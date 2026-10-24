---
title: "AI Agent 工程师 Day 35：Tool Runtime V2：完整 Tool 工程体系"
date: 2026-10-24 10:30:00
tags:
  - AI Agent 工程师
  - Tool Runtime
  - 整合
  - 验收
  - Agent
categories:
  - AI Agent 工程师学习计划
  - M2 Agent Harness + Tool + Environment
description: "Day 35/168 | M2 Tool Runtime 整合 | Tool Runtime V2：完整 Tool 工程体系。6 个月从 LLM 到生产级 Agent 系统的完整学习路线。"
keywords: "AI Agent, 工程师, Tool Runtime 整合, Tool Runtime, 整合, 验收, Agent"
author: OpenClaw Agent Learning
---

# AI Agent 工程师 Day 35：Tool Runtime V2：完整 Tool 工程体系

> **6 个月学习计划** | M2 - Agent Harness + Tool + Environment | Day 35/168
> 
> **今日主题**: Tool Runtime 整合

---

# Tool Runtime V2：完整 Tool 工程体系

**核心结论**：一个可用的 Agent Tool 系统不是“能调 API”就够了，而是由 Registry（注册）、Schema（描述）、Selection（选择）、Executor（执行）、Validation（校验）、Retry（重试）、Timeout（超时）、Permission（权限）、Compression（压缩）、Trace（追踪）十个模块组成的完整闭环。前 34 天你已经分别学过这些模块，今天要做的是把它们装配成一个整体——Tool Runtime V2。**衡量这个体系是否合格的唯一标准是数据**：10 个 Tool、100 次调用的压测中，Selection Accuracy ≥ 90%、Execution Success ≥ 85%、P95 延迟可控、Token 成本可解释。不能被统计验证的 Tool 系统，等于不存在。

---

## 一、背景与动机：为什么需要一个“整合日”

回顾你前 34 天的路线：M1 阶段你打下了 LLM 基础、Prompt 工程、结构化输出；进入 M2 第 1 周，你连续攻克了 Tool Calling 的各个单点——如何注册工具（Registry）、如何写 Schema、如何让模型选对工具（Selection）、如何执行并校验（Executor + Validation）、如何处理失败（Retry + Timeout）、如何控制风险（Permission）、如何省钱（Compression）、如何可观测（Trace）。

**单点知识 ≠ 工程能力**。这正是今天存在的意义。

工程史上反复出现同一个规律：零件都对，装在一起就坏了。原因是模块之间的**接口契约**和**状态流转**只有在整合时才暴露问题：

- Retry 和 Timeout 会打架：Retry 模块重试 3 次，但每次 Timeout 是 30 秒，总预算早就爆了；
- Validation 失败后到底走 Retry 还是走“反馈给模型让它换工具”？这是两个模块的边界问题；
- Compression 会压缩工具返回结果，但 Trace 需要完整原文——观测性和成本控制的张力；
- Permission 拒绝后，Selection 的统计口径算什么？算失败还是算拦截？

这些问题在单模块学习时永远不会出现，只有跑 100 次真实调用才会暴露。**整合的本质不是“把代码拼起来”，而是“定义清楚模块之间的协议和兜底顺序”**。

在 6 个月路线图中，今天是 M2 第 1 周的收官。完成它之后，你才有资格进入第 2 周的 ReAct 循环和 Multi-Step Planning——因为多步规划中每一步都是一次 Tool Runtime 调用，底层不稳，上层全是空中楼阁。

---

## 二、核心内容

### 2.1 十个模块的整合：谁调用谁，谁兜底谁

先给全景图，这是 Tool Runtime V2 的骨架：

```
                        ┌─────────────────────────────────────┐
                        │           Tool Runtime V2           │
                        └─────────────────────────────────────┘

  用户请求 (Query)
       │
       ▼
  ┌──────────┐    候选工具列表    ┌────────────┐
  │ Registry │ ───────────────► │ Selection  │ ◄── Schema（工具描述）
  │(注册中心)│                  │ (选择器)   │     LLM 决策
  └──────────┘                  └─────┬──────┘
                                      │ 选中的工具 + 参数
                                      ▼
                              ┌──────────────┐
                              │  Permission  │ ── 拒绝 ──► 反馈给模型/终止
                              │  (权限检查)  │
                              └──────┬───────┘
                                     │ 放行
                                     ▼
       ┌──────────────────► ┌──────────────┐
       │   Retry (重试)     │   Executor   │
       │   + Timeout       │    (执行器)  │
       └──────────────────► └──────┬───────┘
                                   │ 原始结果
                                   ▼
                            ┌──────────────┐
                            │  Validation  │ ── 校验失败 ──► 走 Retry 或反馈
                            │  (结果校验)  │
                            └──────┬───────┘
                                   │ 合法结果
                                   ▼
                    ┌────────────────┐    ┌────────────┐
                    │  Compression   │───►│  返回给    │
                    │  (结果压缩)    │    │  LLM 上下文│
                    └────────────────┘    └────────────┘
                                   │
                                   ▼  全程埋点
                            ┌──────────────┐
                            │    Trace     │
                            └──────────────┘
```

整合时的三条关键协议，请写进代码注释：

**协议一：兜底顺序固定。** 一次调用的失败处理路径是单向的：`Selection 失败 → 直接返回错误给模型`；`Permission 拒绝 → 标记为 blocked，不重试`；`Validation 失败 → 先 Retry（最多 N 次），N 次后仍失败 → 把错误信息结构化反馈给模型，让它换参数或换工具`。不要让模块之间互相“自作主张”地改变流程。

**协议二：预算分层。** Timeout 必须分两层：单次执行超时（如 10s）和总调用预算（如 30s）。Retry 的总时间不能突破总预算，即 `retry_deadline = total_budget - elapsed`。

**协议三：Trace 是旁路，不是主干。** Trace 只读不写业务状态，任何 Trace 自身的异常都不能影响主流程（包一层 try-except 吞掉即可）。观测系统挂了导致业务挂掉，是工程事故。

用一个伪代码表达整合后的调用入口：

```python
def run_tool_call(query: str, ctx: RunContext) -> ToolResult:
    # 1. 选择
    tool, args = selector.choose(query, registry.list_schemas())
    if tool is None:
        return ctx.trace.log_and_return("selection_failed", query)

    # 2. 权限
    if not permission.check(tool, ctx.user):
        return ctx.trace.log_and_return("blocked", tool.name)

    # 3. 执行 + 重试 + 超时（预算分层）
    deadline = ctx.budget.total
    for attempt in range(retry.max_attempts):
        remaining = deadline - ctx.elapsed()
        if remaining <= 0:
            return ctx.trace.log_and_return("budget_exceeded")
        raw = executor.run(tool, args, timeout=min(retry.timeout, remaining))
        ok, err = validation.check(tool, raw)
        if ok:
            break
    else:
        return ctx.trace.log_and_return("validation_failed", err)

    # 4. 压缩 + 返回
    compressed = compressor.compress(raw, token_budget=ctx.budget.tokens)
    ctx.trace.log("success", latency=..., tokens=...)
    return ToolResult(content=compressed, raw=raw)  # raw 给 Trace，compressed 给 LLM
```

**工程直觉**：这个结构的本质是“漏斗 + 安全网”。每个模块是一道漏斗，把不合格的调用提前淘汰；Retry 和 Validation 是安全网，保证漏下去的是经过检验的结果。十模块不是十个平等的特性，而是一条**有顺序、有分工的责任链**。

### 2.2 10 Tools / 100 Tool Calls：为什么必须压测统计

**结论先行：Tool 系统的可靠性无法靠代码审查保证���只能靠统计验证。** 原因有三：

1. **Selection 依赖 LLM，是概率性的。** 同一个 query，模型选对工具的概率受 Schema 描述质量、候选工具数量、相似工具干扰影响。这些只有大样本才能测出来。
2. **失败模式是长尾的。** 网络抖动、API 限流、Schema 边界参数（空列表、超长字符串）——100 次调用里总会撞上几个。
3. **指标之间会互相挤压。** 比如你把 Compression 的 token 预算调得更激进，Token Cost 降了，但模型拿到的信息变少，下一步决策质量可能下降。没有统计，你不知道自己是在优化还是在拆东墙补西墙。

为什么是 10 个 Tool、100 次调用？10 个工具刚好跨过“模型开始混淆相似工具”的阈值（实践中 5 个以内几乎不会选错，10 个以上开始暴露 Schema 问题）；100 次调用足以让 P95/P99 延迟有统计意义，同时单次实验成本可控（约 0.5~2 元人民币的 API 费用）。

压测集的构成建议（100 条 = 每工具至少 8 条正常 + 20 条边界/恶意样本）：

| 样本类型 | 数量 | 目的 |
|---|---|---|
| 每工具正常查询 | 10 × 6 = 60 | 测 Selection Accuracy 基线 |
| 参数边界 | 20 | 测 Validation 和 Executor 的健壮性 |
| 应触发权限拦截 | 10 | 测 Permission 拒绝路径 |
| 故意模糊/多义 | 10 | 测 Selection 在困难样本下的表现 |

### 2.3 五个核心指标：定义、口径与目标

指标最容易踩的坑是**口径不清**。以下定义请严格执行，否则两次实验结果不可比。

| 指标 | 英文 | 定义 | 目标参考 |
|---|---|---|---|
| 选择准确率 | Selection Accuracy | 选中了“人类标注的正确工具”的比例 / 总调用数 | ≥ 90% |
| 执行成功率 | Execution Success Rate | 最终返回合法结果的次数 / 通过 Permission 的调用数 | ≥ 85% |
| 失败率 | Failure Rate | (selection 失败 + validation 失败 + timeout + budget 超限) / 总调用数 | ≤ 10% |
| 延迟 | Latency | 从发起调用到返回结果，看 P50 / P95 / P99 | P95 < 5s |
| Token 成本 | Token Cost | 每次调用的输入+输出 token 均值，分“schema 开销”与“结果开销” | 有基线即可 |

三个口径细节，决定了你的数据是否可信：

**Selection Accuracy 的分母**是全部调用（包括 Permission 拦截的——拦截说明选择正确但权限不允许，选择本身可能是对的，需要在 Trace 里分开记）。**Execution Success 的分子**应包含“Retry 后成功”的调用——重试成功算成功，但要在 Trace 里标记 `retried=true`，否则你会掩盖 Executor 的真实质量。**Failure Rate 与前两者的关系**：`Selection Failure + Execution Failure ≈ Failure Rate`（口径对齐时应该能对上账，对不上说明 Trace 有 bug）。

延迟要看分位数而不是均值。均值 800ms 但 P95 是 8s，意味着每 20 次调用就有一次用户明显卡顿——Agent 系统中长尾延迟往往来自外部 API 慢响应 + Retry 叠加，这是你设计预算分层时要防住的场景。

**Token 成本要拆开看**：`schema_cost`（每次调用都要把工具 Schema 塞进 prompt，10 个工具可能占 2000+ token，这是固定税）+ `result_cost`（工具返回结果，Compression 的主战场）。很多人只优化后者，但工具多了以后前者才是大头——这也解释了为什么 M3 会学 Tool RAG（按需注入 Schema）。

### 2.4 Tool Runtime V2 的完整验收清单

V1 和 V2 的区别不是功能多少，而是**是否闭环**。用这张表验收：

| 验收项 | V1 水平 | V2 验收标准 |
|---|---|---|
| 功能 | 能调用工具返回结果 | 十模块全部接入且职责清晰 |
| 压测 | 无 | 10 Tools / 100 Calls 完整跑通 |
| 指标 | 无数据 | 5 项指标全部输出且有分位数 |
| 失败处理 | 抛异常 | 失败路径全覆盖：结构化错误反馈给模型 |
| 可观测 | print 调试 | 每次调用有 Trace 记录，可回放单次调用全流程 |
| 安全 | 无 | Permission 拦截样本全部被正确拒绝 |
| 成本 | 不知道 | 每次调用 token 可归因（schema/result 分开） |

验收的核心是**可回放**：随机抽 3 次 Trace 记录，你能看着日志还原“模型为什么选这个工具 → 参数是什么 → 有没有重试 → 结果被压缩了多少”。做到这一点，V2 才算真正完成。

---

## 三、实践练习

**目标**：整合 Tool Runtime V2，10 个 Tool 跑 100 次调用，统计 5 项指标。

**步骤**：

1. **准备工具集**：挑 10 个工具，覆盖不同类型（查询类 3 个、计算类 2 个、写入类 2 个、易混淆对 3 个，如 `get_weather` vs `get_weather_history`）。易混淆工具是 Selection Accuracy 的照妖镜。
2. **编写测试集**：按 2.2 的配比写 100 条 query，每条标注 `expected_tool` 和 `expected_outcome`（success/blocked）。
3. **跑批**：串行执行（先别并发，避免限流干扰数据），每条记录完整 Trace（JSON 一行一条，存 JSONL）。
4. **出报告**：写一个统计脚本，从 Trace 中算出 5 项指标，输出一张表 + 一张延迟分布直方图。
5. **归因 3 个最差样本**：找出 Selection 错的、Validation 失败的、超时的各至少 1 个，写清楚根因（Schema 写得歧义？参数校验太严？外部 API 慢？）。

**思考题**：

1. 如果把 Selection Accuracy 从 90% 提到 95%，最便宜的杠杆是什么？（提示：改 Schema 描述 vs 换更强的模型 vs 减少工具数量，各自的成本和收益？）
2. Retry 重试成功的那部分调用，如果不从数据里拆出来，会对你后续优化 Executor 造成什么误导？
3. 10 个工具的 schema 每次调用都占约 2000 token。如果你要扩到 100 个工具，固定税变成 2 万 token，架构上应该怎么改？

---

## 四、与 Agent Engineering 的关联

Tool Runtime 是 Agent 系统的**手和脚**，也是生产环境中最常出事故的层。实际工作中的对应关系：

- **生产 Agent 的可靠性预算**，基本等于这 5 项指标。产品问“Agent 能不能上线”，你的回答就是这张指标表，而不是“我觉得差不多”。
- **成本工程**：一个跑几百步的 Agent，每次调用都背着全量 Schema 的固定税，Token 成本会指数式恶化。今天建立的“成本归因”习惯，是后面做 Tool RAG、Schema 缓存的前提。
- **安全合规**：Permission 模块在真实系统中对应的是审计要求——谁、什么时候、调用了什么写操作，Trace 记录就是审计日志。
- **可回放调试**：Agent 出错时用户只说“它乱来”，唯一能救你的是 Trace。M3 之后做 Multi-Agent 和长程规划，Trace 是你唯一的 debug 手段。

一句话：**后面的所有 Agent 架构创新，都建立在“每一次工具调用可测、可控、可回放”这个地基上。今天就是在打这个地基。**

---

## FAQ

**Q1：十个模块都要自己写吗？有没有现成框架？**
LangChain、OpenAI Agents SDK 等框架提供了大部分模块（Registry、Executor、Retry），但 Selection 策略、Permission 粒度、指标统计通常需要按业务定制。建议第一次自己手写一遍核心链路，理解协议后再用框架——否则出问题时你不知道该改哪一层。

**Q2：Selection Accuracy 一直上不了 90% 怎么办？**
按性价比顺序排查：① 改写 Schema 的 description，用“什么时候用我/什么时候不用我”的对比式描述；② 合并或删掉功能重叠的工具；③ 给 Selection 加 few-shot 示例；④ 最后才考虑换更强的模型。80% 的选错问题出在 Schema 描述歧义上。

**Q3：100 次调用要花不少 API 费，能否用 mock 模型？**
指标测的是“模型 + 工具”的联合表现，mock 模型测不出 Selection Accuracy，没有意义。可以省的地方是工具本身：外部 API 用本地 mock/stub，只保留真实 LLM 调用，成本能降 60% 以上，且数据不受外部服务波动污染。

**Q4：失败率目标 ≤10% 是不是太宽松了？**
分场景。读操作 10% 可接受（配合重试，用户感知的失败率远低于此）；写操作（发邮件、转账）必须接近 0%，靠 Permission 白名单 + Validation 严格校验兜底。指标目标应该按工具分级设定，而不是一刀切。

**Q5：Trace 应该记到什么粒度？会不会太大？**
记录每次调用的：query、候选工具列表（或 hash）、选中结果及理由（若模型有输出）、参数、每次尝试的结果与耗时、最终状态、token 消耗。单条通常 2~5KB，100 次调用不到 1MB，完全不用担心体积；担心的是“记得太少无法归因”。

---

## 参考资料

> 本次学习搜索返回的参考资料为空。以下为可自行验证的替代路径：

- 各 LLM 官方 Function Calling / Tool Use 文档（OpenAI / Anthropic / Qwen），重点看 Schema 定义与错误处理章节
- LangChain Tools 与 ToolNode 源码（Registry + Executor 的参考实现）
- OpenAI Agents SDK 文档中 Guardrails 与 Tracing 部分（对应 Permission 与 Trace）
- 自己 M2 第 1 周前几天的学习笔记与代码——**整合日的第一手资料是你自己写过的模块**

**今日完成标志**：10 Tools / 100 Calls 报告出炉，5 项指标达标，3 个最差样本归因写完。做到这三点，M2 第 1 周收官，明天进入 ReAct 循环。

---

## 📋 本日知识点清单

- [ ] Registry + Schema + Selection + Executor + Validation + Retry + Timeout + Permission + Compression + Trace 的整合
- [ ] 10 Tools / 100 Tool Calls 的统计
- [ ] Selection Accuracy / Execution Success / Failure Rate / Latency / Token Cost
- [ ] Tool Runtime V2 的完整验收

## 📝 实践练习

整合 Tool Runtime V2，10 个 Tool 跑 100 次调用，统计 5 个指标。

---

*本文是「AI Agent 工程师」6 个月学习计划的一部分。学习路线：LLM → Inference → Runtime → Harness → Memory → Environment → Evaluation → Production。目标：Agent / AI Systems Engineer。*
