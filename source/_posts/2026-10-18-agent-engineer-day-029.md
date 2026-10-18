---
title: "AI Agent 工程师 Day 29：重新理解 Tool：Tool Calling ≠ Tool Execution"
date: 2026-10-18 10:30:00
tags:
  - AI Agent 工程师
  - Tool
  - Runtime
  - Agent
categories:
  - AI Agent 工程师学习计划
  - M2 Agent Harness + Tool + Environment
description: "Day 29/168 | M2 Tool 概念重塑 | 重新理解 Tool：Tool Calling ≠ Tool Execution。6 个月从 LLM 到生产级 Agent 系统的完整学习路线。"
keywords: "AI Agent, 工程师, Tool 概念重塑, Tool, Runtime, Agent"
author: OpenClaw Agent Learning
---

# AI Agent 工程师 Day 29：重新理解 Tool：Tool Calling ≠ Tool Execution

> **6 个月学习计划** | M2 - Agent Harness + Tool + Environment | Day 29/168
> 
> **今日主题**: Tool 概念重塑

---

# 重新理解 Tool：Tool Calling ≠ Tool Execution

**核心结论**：Tool Calling（工具调用）只是 LLM 生成的一段结构化“意图声明”——它说“我想调用什么、带什么参数”；而 Tool Execution（工具执行）是 Runtime 层的事——它决定“允不允许调、怎么调、执行多久、失败了怎么办”。把这两件事混为一谈，是当前大多数 Agent 系统脆弱性的根源。理解这个分离，你会发现：Agent 的可靠性瓶颈不在模型，而在你为模型构建的执行环境（Tool Runtime）。今天我们用 5 个知识点重塑对 Tool 的认知。

---

## 一、背景与动机：为什么第 29 天要学这个

在 6 个月 AI Agent 工程师路线中，前 28 天你大概率已经搞定了 Prompt Engineering、LLM API、Function Calling 的基本用法，并搭建过一两个能跑的 Agent Demo。从 M2 开始，我们进入“系统层”——不再问“模型能不能调用工具”，而是问“一个生产级的 Tool 体系应该长什么样”。

为什么要在这个节点做认知重塑？因为绝大多数开发者（包括一个月前的我）对 Tool 的理解停留在 API 文档层面：

> "我给 LLM 一个函数定义，它返回一个 JSON，我执行这个函数，把结果喂回去。”

这个理解对 Demo 够用，对生产系统是灾难性的。它会让你在遇到以下问题时束手无策：

- LLM 传的参数类型不对、值非法，怎么办？
- 工具执行了 30 秒还没返回，Agent 卡死吗？
- 一个"删除数据库”的工具，模型突然决定调它，你拦得住吗？
- 同一个工具被 10 个并发请求调用，怎么管理状态？

这些问题没有一个能靠“写好 Prompt”解决。它们全部属于 Tool Execution 层——属于 Runtime。今天的目标就是把这层从模糊的“胶水代码”提升为你架构图上的一等公民。

---

## 二、核心内容

### 知识点 1：LLM 只负责“想”，Runtime 负责“做”

先建立一个最关键的因果链：**LLM 是一个无状态的文本生成器，它没有手，也没有钟表**。

当模型输出这样一段内容：

```json
{
  "tool_name": "search_flights",
  "arguments": {"from": "PEK", "to": "SHA", "date": "2025-07-01"}
}
```

它实际上做的事情仅仅是：**基于上文，预测出一段高概率的 token 序列**。它没有“发起调用”，没有“等待结果”，甚至不知道这个函数是否真的存在、是否真的会执行。它只是“声明了一个意图”。

而真正的调用链路上，所有工程决策都发生在 Runtime（运行时）：

| 决策项 | LLM 能做的 | Runtime 必须做的 |
|---|---|---|
| 调什么工具 | 基于工具描述“建议"调一个 | 校验权限、过滤黑名单 |
| 参数 | 生成参数文本 | Schema 校验、类型转换、参数清洗 |
| 执行 | ❌ 无此能力 | 真正发起调用、管理超时与重试 |
| 失败处理 | 只能看到错误文本 | 决定重试策略、降级方案、熔断 |
| 执行时长 | 完全无感知 | 超时控制、异步调度、进度上报 |

**工程直觉**：把 LLM 想象成一个坐在控制室里的顾问，他只能对着对讲机喊“我建议打开 3 号阀门”——听不听、怎么拧、拧坏了谁负责，全是控制室外面的执行系统的事。你不会因为顾问喊错一声就让整个工厂停产，同理，你的 Runtime 也不该因为模型输出了一次错误调用就崩溃。

### 知识点 2：Tool Calling 与 Tool Execution 的分离

这个分离（Calling/Execution Separation）不是理论洁癖，而是实际的架构边界。我们用一张表把它说透：

| 维度 | Tool Calling | Tool Execution |
|---|---|---|
| 责任主体 | LLM | Runtime / Agent Framework |
| 本质 | 意图表达（intent declaration） | 受控执行（controlled execution） |
| 输出 | 结构化 JSON（name + arguments） | 执行结果 + 状态（success/error/timeout） |
| 失败类型 | 幻觉工具名、参数幻觉、格式错误 | 网络错误、业务异常、超时、权限拒绝 |
| 可靠性手段 | Prompt 设计、工具描述优化、Few-shot | 校验、沙箱、重试、超时、降级、审计 |
| 关注点 | "选对了吗？参数对吗？" | "安全吗？稳定吗？可追溯吗？" |

注意一个容易忽略的事实：**两层的失败模式完全不同，所以修复手段也完全不同**。模型把 `user_id` 传成了 `null`，是 Calling 层问题，你应该优化工具描述或加 Few-shot；工具调用本身超时，是 Execution 层问题，你应该加超时和重试。把 Execution 层的错误甩锅给模型（“这模型真笨”）或把 Calling 层的问题用重试硬扛（重试 3 次参数还是错的），都是层次错配。

**双层失败还应分开度量**：日志里给每次工具调用打上失败类别标签（`INVALID_ARGS` / `PERMISSION_DENIED` / `EXECUTION_ERROR` / `TIMEOUT`），你会发现优化方向立刻清晰——哪类占比高，就优化哪一层。

### 知识点 3：当前 Runtime 的问题分析

看看大多数开发者（以及不少框架）的 Tool Runtime 长什么样：

```python
# 典型的"Demo 级" Runtime
result = globals()[tool_call["name"]](**tool_call["arguments"])
messages.append({"role": "tool", "content": str(result)})
```

一行执行，一行回填。这条链路至少有五个问题：

1. **无校验（No Validation）**：参数直接 `**kwargs` 展开，模型传个注入字符串就直接进了你的 SQL 或 Shell。
2. **无权限（No Authorization）**：模型“想调什么就调什么”，`delete_file` 和 `read_file` 在模型眼里没有区别。
3. **无超时（No Timeout Control）**：工具挂起，整个 Agent 循环挂起，token 在烧，用户在等。
4. **无重试与降级（No Retry/Fallback）**：一次网络抖动就让整轮对话报错退出。
5. **无可观测性（No Observability）**：出了问题只知道“最终结果不对”，无法回答“第几步、调了什么、传了什么、返回了什么、耗时多少”。

**深层原因**：Demo 阶段工具数量少（3-5 个）、调用者是你自己（可控）、失败成本低。一旦工具数量上到 50+、调用者是真实用户、工具涉及写操作，这五个问题每个都能演变成生产事故。

### 知识点 4：Tool Runtime 的完整链路

一个生产级的 Tool Runtime，从模型输出意图到结果回填，应该经过完整的水线（pipeline）：

```text
            ┌─────────────────── Tool Runtime Pipeline ───────────────────┐
            │                                                              │
 LLM 输出   │  ┌────────┐   ┌────────┐   ┌────────┐   ┌─────────┐         │
───────────┼─▶│ 解析   │──▶│ 校验   │──▶│ 授权   │──▶│ 调度    │──┐      │
 (intent)   │  │ Parse  │   │ Validate│  │ Authorize│ │ Dispatch│  │      │
            │  └────────┘   └────────┘   └────────┘   └─────────┘  │      │
            │       │失败: 结构化错误回填，不执行          │             │      │
            │                                                  ▼             │
            │  ┌────────┐   ┌────────┐   ┌────────┐   ┌─────────┐  │      │
            │  │ 观测   │◀──│ 结果   │◀──│ 执行   │◀──│ 沙箱/   │◀─┘      │
            │  │ Observe│   │ 处理   │   │ Execute│   │ 隔离    │         │
            │  └────────┘   └────────┘   └────────┘   └─────────┘         │
            │       │                                                      │
            └───────┼──────────────────────────────────────────────────────┘
                    ▼
            结构化结果回填给 LLM（成功结果 / 可恢复的错误信息）
```

各环节职责一句话说清：

- **解析（Parse）**：容错解析模型输出。模型输出半截 JSON、多打了反引号，解析层要能兜住，兜不住就生成一个“格式错误，请重新输出”的反馈而不是抛异常。
- **校验（Validate）**：用 JSON Schema 严格校验参数，非法则拒��执行并把校验错误信息回填给模型，让它有机会自我修正。
- **授权（Authorize）**：按会话/用户/风险等级判断该工具此刻是否可调。高风险工具（写操作、支付）可要求二次确认（human-in-the-loop）。
- **调度（Dispatch）**：选择执行策略——同步/异步、并发控制、队列排队、超时预算分配。
- **执行（Execute）**：在沙箱或受控环境中真正运行，带超时、重试（区分幂等/非幂等工具）、熔断。
- **观测（Observe）**：记录调用链路全量数据——工具名、参数、耗时、结果、失败类别——供调试、评测、回放。

**关键设计**：校验失败、授权失败都不该是“异常”，而应该是**结构化的错误信息回填给模型**。模型看到“参数 date 格式应为 YYYY-MM-DD”，下一轮大概率能自己改对——这就是把错误处理变成 Agent 自我修复的回路。

### 知识点 5：Tool 与 Environment 的概念区分

最后一个认知升级：**Tool 是能力接口（capability interface），Environment 是 Agent 所处的世界（world state）**。

| 维度 | Tool（工具） | Environment（环境） |
|---|---|---|
| 本质 | 一组显式声明的能力入口 | Agent 操作对象所在的持续状态空间 |
| 状态 | 无状态（理想情况下） | 有状态、随时间演化 |
| 生命周期 | 注册/发现/调用/注销 | Agent 会话开始到结束（甚至更长） |
| 变更方式 | 只能通过被调用而生效 | 任何行动（包括别人、包括时间）都能改变它 |
| 典型例子 | `search_web`、`run_sql` 函数 | 一个代码仓库、一份数据库、一个浏览器会话 |

为什么这个区分重要？因为**Tool 是幂等声明，Environment 是会腐烂的**。你调用 `get_file` 拿到的内容，在你下一步行动时可能已经被别的进程改了；你读到“库存还有 10 件”，执行下单时可能只剩 2 件。很多 Agent 的诡异行为——比如“读到的信息和实际不符”、“同样输入不同输出”——根源不是 Tool 有问题，而是 Agent 缺乏对 Environment 状态的感知与同步机制。

**工程直觉**：Tool 是“动词的集合”，Environment 是“名词与状态的总和”。设计 Agent 系统时，Tool 设计关注接口清晰、描述准确、副作用可控；Environment 设计关注状态一致性、快照与回滚、并发与锁。两套问题，两套解法。

---

## 三、实践练习：画出你当前 Runtime 的 Tool 链路

打开你最近写的 Agent 项目（或者昨天 Demo 的代码），完成以下三步：

1. **画图**：从“模型输出 tool_call”开始，画到“结果回填消息列表”结束。每经过一层代码就画一个框。
2. **找洞**：对照知识点 4 的六环节，标出你缺失的环节。绝大多数人的图上只有"Parse → Execute → Return"三个框。
3. **列问题清单**：按下面的模板填写：

```text
我的 Runtime 问题清单（Day 29 练习示例）
─────────────────────────────────────────────
[ ] 参数校验: 无 → 模型传错参数直接执行
[ ] 权限控制: 无 → 任何工具模型都能调
[ ] 超时控制: 无 → requests 默认永不超时 ← 最高危
[ ] 重试策略: 无 → 网络抖动直接报错
[ ] 失败分类: 无 → 所有错误都 str(err) 回填
[ ] 调用日志: print → 无法回放和统计
─────────────────────────────────────────────
```

**思考题**：
1. 一个非幂等的工具（如“下单”）失败后，重试策略和幂等工具（如“查询”）有什么本质区别？
2. 如果你的 Agent 有 100 个工具，模型的工具选择准确率会怎么变化？Runtime 层有什么手段缓解（提示：工具检索/分组）？
3. “模型生成了不存在的工具名”——这个错误应该在链路的哪个环节被捕获？回填给模型的信息应该长什么样？

---

## 四、与 Agent Engineering 的关联

这个知识点是 Agent 系统从 Demo 走向生产的分水岭，具体体现在三处：

1. **可靠性工程的主战场**：Agent 端到端失败中，除模型推理错误外，最大来源就是工具执行层。把校验、超时、重试、降级做成 Runtime 标配，Agent 的可用性提升是数量级的。
2. **安全边界的唯一落点**：LLM 本身不可信任（它是概率系统），所以沙箱、权限、审计必须全部做在 Execution 层。这是 Agent Security 的第一原则：**永不信任 Calling 层输出，一切以 Runtime 校验为准**。
3. **评测与迭代的基础**：有了完整的观测链路，你才能回答“Agent 失败在 Calling 还是 Execution"，才能建立工具维度的成功率指标，才能做回归测试。没有这层，Agent 优化全靠玄学。

后续课程中的 Memory 管理、Multi-Agent 编排、Human-in-the-loop 审批流，全部构建在今天的分离认知之上——因为它们本质上都是 Runtime 层的能力，而不是模型层的能力。

---

## 五、FAQ

**Q1：Function Calling、Tool Calling、Tool Use 有区别吗？**
本质是同一件事的不同叫法。Function Calling 是 OpenAI 早期的 API 术语，Tool Calling/Tool Use 是更通用的说法（Anthropic 用 Tool Use）。都指模型输出结构化调用意图这一行为，都只是 Calling 层。

**Q2：LangChain / LangGraph 这类框架是不是已经帮我解决了 Execution 层？**
部分解决。主流框架提供了重试、超时、结构化输出解析等能力，但授权策略、沙箱隔离、业务级降级、审计合规仍然需要你自己构建。框架给你脚手架，不给你安全边界。

**Q3：把工具描述写得更详细，能不能替代 Runtime 校验？**
不能。Prompt 和工具描述只能降低 Calling 层错误率（概率性），无法消除。写操作、涉及资金与数据的工具，必须由 Runtime 做确定性校验与授权——概率手段防事故，确定手段保底线。

**Q4：工具调用应该同步还是异步执行？**
读类、轻量工具（<2s）同步即可；写类、重工具（长耗时任务）应异步化：立即返回任务 ID，通过后续轮询或回调把进度/结果回填给模型，避免 Agent 循环阻塞。

**Q5：Environment 状态不一致问题有通用解法吗？**
没有银弹，常用组合拳：关键操作前重新读取状态（re-read before write）、给读取结果加时间戳让模型感知新鲜度、写操作加乐观锁或版本号、对高风险 Environment 做快照以便回滚。

---

## 六、参考资料

以下为本次学习检索到的高价值方向（建议按顺序阅读）：

1. **OpenAI Function Calling 官方文档** — 理解 Calling 层的协议设计与错误反馈机制
2. **Anthropic Tool Use Guide** — 对 `tool_use` / `tool_result` 消息结构的清晰定义，是“意图与结果分离”的最好示例
3. **Anthropic: Writing Effective Tools for Agents** — 工具描述设计与错误信息回填的工程实践
4. **ReAct 论文（Yao et al., 2022）** — Reasoning + Acting 循环的原始定义，理解 Observation 在循环中的角色
5. **OpenAI: A practical guide to building agents** — 生产级 Agent 的编排与护栏（guardrails）设计

> Day 29 小结：模型负责“想调用什么”，Runtime 负责“允不允许、怎么调、调多久、失败了怎么办”。把这层做扎实，Agent 才算从玩具变成了系统。明天见。

---

## 📋 本日知识点清单

- [ ] LLM 只负责"想调用什么"，Runtime 负责"允不允许/怎么调用/执行多久/失败怎么办"
- [ ] Tool Calling 与 Tool Execution 的分离
- [ ] 当前 Runtime 问题分析
- [ ] Tool Runtime 的完整链路
- [ ] Tool 与 Environment 的概念区分

## 📝 实践练习

画出当前 Runtime 的 Tool 链路，列出存在的问题。

---

*本文是「AI Agent 工程师」6 个月学习计划的一部分。学习路线：LLM → Inference → Runtime → Harness → Memory → Environment → Evaluation → Production。目标：Agent / AI Systems Engineer。*
