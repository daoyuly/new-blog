---
title: "AI Agent 工程师 Day 28：M1 最终考试：从零实现 Agent Runtime"
date: 2026-10-17 10:30:00
tags:
  - AI Agent 工程师
  - M1考试
  - Runtime
  - Agent
  - 总结
categories:
  - AI Agent 工程师学习计划
  - M1 LLM + Agent Runtime
description: "Day 28/168 | M1 M1 月度验收 | M1 最终考试：从零实现 Agent Runtime。6 个月从 LLM 到生产级 Agent 系统的完整学习路线。"
keywords: "AI Agent, 工程师, M1 月度验收, M1考试, Runtime, Agent, 总结"
author: OpenClaw Agent Learning
---

# AI Agent 工程师 Day 28：M1 最终考试：从零实现 Agent Runtime

> **6 个月学习计划** | M1 - LLM + Agent Runtime | Day 28/168
> 
> **今日主题**: M1 月度验收

---

# M1 最终考试：从零实现 Agent Runtime

## 开篇结论

从零实现一个 Agent Runtime（智能体运行时），最大的收获不是代码本身，而是认知的跃迁：**大模型 API 只是“大脑”，Agent Runtime 才是“身体”**。大脑再聪明，没有手（Tool）、没有记忆（State/Checkpoint）、没有心跳（Retry/Timeout）、没有神经反馈（Trace），它就只是一个问答机器。M1 阶段的核心成果是：把“调用大模型 API 的使用者”升级为“构建智能体运行时的工程师”。本文是 M1 的最终验收考试记录，包含完整 Runtime 的六大核心组件、12 个核心问题的回答、以及“如果重新设计我会删除什么”的批判性复盘。

---

## 一、背景与动机：为什么 M1 的终点是一场“闭卷考试”

在 6 个月 AI Agent 工程师路线中，M1 的定位是**打地基**：理解 Agent 的最小可行架构，不依赖任何框架。M1 前三周我们逐步构建了 Tool 调用、状态管理、重试与超时、Checkpoint 恢复、Trace 观测，以及一个 Coding Agent 雏形和一个 Inference Notebook。

为什么最后一天要“不看资料独立完成”？

因为框架（LangChain、LlamaIndex 等）给了你答案，但没给你**因果链**。你能跑通一个 ReAct Agent，不代表你知道：

- 为什么循环终止条件这么设计？
- 为什么 Checkpoint 要存在工具调用边界，而不是每次 LLM 调用后？
- 为什么 Trace 要分 LLM Span 和 Tool Span 两层？

**考试的本质是把“知识”压缩成“判断力”**。当你能在白板上画出完整的数据流并回答“为什么”，这个架构才真正属于你。

M1 在整��路线中的位置：

| 阶段 | 时间 | 核心目标 | 产出 |
|---|---|---|---|
| **M1** | 第 1 个月 | Agent Runtime 从零实现 | Runtime + Coding Agent 雏形 |
| M2 | 第 2 个月 | RAG 与知识工程 | 生产级检索系统 |
| M3 | 第 3 个月 | Multi-Agent 协作 | 编排与通信 |
| M4-M6 | 后 3 个月 | 生产化 / 评测 / 专项 | 可上线系统 |

M1 的 Runtime 是后续一切的地基：M2 的 RAG 是给 Runtime 加“外挂记忆”，M3 的 Multi-Agent 是给 Runtime 加“社交能力”。地基不稳，全盘皆输。

---

## 二、核心内容：Agent Runtime 的六大组件

### 2.1 Tool（工具调用）：Agent 的“手”

工具是 Agent 与外部世界交互的唯一通道。核心设计决策有三个：

**1. Schema 即接口。** 每个工具必须声明 JSON Schema，让 LLM 知道“手能做什么”。这不是文档，是**约束**——Schema 质量直接决定调用成功率。

**2. 执行隔离。** 工具执行必须包裹在独立函数中，统一入口、统一错误捕获、统一超时控制。绝不允许工具直接裸调。

**3. 结果回填。** 工具结果必须作为 tool 消息回填到对话历史，否则 LLM 会“失忆”。

```python
@tool(schema={"query": {"type": "string", "required": True}})
def web_search(query: str) -> str:
    """Search the web for information."""
    return search_api(query)
```

工程直觉：**工具设计的第一原则是“幂等且可观测”**。幂等保证重试安全，可观测保证调试可能。

### 2.2 State（状态管理）：Agent 的“工作记忆”

State 是整个 Runtime 的单一事实来源。我把它设计成一个可序列化的字典：

```python
@dataclass
class AgentState:
    messages: list[Message]      # 对话历史
    tool_results: dict[str, Any] # 工具结果缓存
    iteration: int               # 当前循环轮数
    status: AgentStatus          # RUNNING / DONE / FAILED / PAUSED
```

关键决策：**State 必须是不可变更新或显式拷贝**，避免多个工具并发写同一状态时的竞态。State 与 Checkpoint 的关系是：State 是“当前快照”，Checkpoint 是“历史快照的持久化”。

### 2.3 Retry（重试）：与不确定性和解

LLM API 调用失败是常态而非异常：429 限流、500 错误、网络抖动。重试策略的核心是**指数退避 + 抖动**：

```python
async def with_retry(fn, max_retries=5, base_delay=1.0):
    for attempt in range(max_retries):
        try:
            return await fn()
        except RetryableError:
            delay = base_delay * (2 ** attempt) + random.uniform(0, 1)
            await asyncio.sleep(delay)
    raise MaxRetriesExceeded()
```

最重要的区分：**可重试错误 vs 不可重试错误**。429/503 可重试，400（参数错误）重试一万次也没用，应该立即失败并回传给 LLM 让它修正参数。把不可重试错误交给重试逻辑，是新手最常见的 bug 来源。

### 2.4 Timeout（超时）：故障的止损线

超时是重试的“前置条件”——没有超时，一次挂起的请求会卡死整个 Agent。分层超时设计：

| 层级 | 超时设置 | 原因 |
|---|---|---|
| 单次 LLM 调用 | 30-120s | 推理时间随输出长度变化 |
| 单次工具执行 | 10-30s | 外部 API 不可控 |
| 整个 Agent 循环 | 5-15min | 防止无限循环烧钱 |

超时不是失败，是**触发降级决策的信号**：跳过该工具？换备用方案？还是直接终止并保留 Checkpoint？

### 2.5 Checkpoint（检查点）：长任务的救命稻草

Checkpoint 解决的问题是：**一个跑 20 分钟的 Agent 任务，在第 18 分钟崩了，怎么办？**

关键决策：Checkpoint 存储在**工具调用边界**，而不是每次 LLM 调用后。原因是工具调用通常有副作用（写文件、发请求），恢复时必须知道“副作用已完成到哪一步”，否则重放会导致重复执行。恢复时从最近的 Checkpoint 重��� State，Agent 从断点继续，已完成的工具调用不重复。

```
LLM call ──> Tool A ──[CP1]──> LLM call ──> Tool B ──[CP2]──> LLM call ──[CP3]
                                  ↑
                            crash here, restore from CP1, re-run Tool B only
```

工程直觉：**Checkpoint 的粒度 = 副作用的边界**。粒度太细浪费 IO，太粗则恢复代价大。

### 2.6 Trace（追踪）：Agent 的“黑匣子”

Agent 是概率系统，没有 Trace 就无法调试。Trace 设计为两层 Span：

- **LLM Span**：记录 prompt、completion、token 用量、耗时
- **Tool Span**：记录工具名、参数、结果摘要、耗时、错误

Trace 与 Checkpoint 联动的价值：出问题时，Trace 告诉你“哪里错了”，Checkpoint 告诉你“从哪恢复”。只记录文本日志不够——你需要结构化的、可按 trace_id 检索的数据，这也是生产系统接入 OpenTelemetry / LangSmith 的原因。

### 2.7 把六个组件装进主循环

```python
async def run(self, task: str) -> AgentState:
    state = AgentState(messages=[user_msg(task)])
    checkpoint = self.load_latest_checkpoint(task)
    if checkpoint:
        state = checkpoint.state  # 断点续跑

    while state.status == AgentStatus.RUNNING:
        if state.iteration >= self.max_iterations:
            break  # 防失控

        with self.trace.span("llm_call"):
            resp = await with_retry(
                lambda: self.llm.call(state.messages, timeout=60)
            )
        state.messages.append(resp.message)

        if not resp.tool_calls:
            state.status = AgentStatus.DONE
            break

        for tc in resp.tool_calls:
            with self.trace.span("tool_call", name=tc.name):
                result = await self.execute_tool(tc, timeout=30)
            state.messages.append(tool_msg(tc.id, result))
            state.iteration += 1

        self.save_checkpoint(state)  # 工具调用边界存档
    return state
```

整个 Runtime 不过一百多行代码，但每一个 `with`、每一个 `await` 背后都是一个设计决策。

---

## 三、12 个核心问题：考试的“口试题”

闭卷回答这些问题，是检验理解深度的试金石。摘要如下：

1. **Runtime 与框架的区别是什么？** —— Runtime 是“引擎”，框架是“整车”。理解引擎才能诊断整车的故障。
2. **为什么用 while 循环而不是递归？** —— 递归在长任务下会栈溢出，while 循环天然支持状态快照与恢复。
3. **循环终止条件有哪些？** —— 无工具调用、达到最大迭代数、整体超时、显式状态标记（DONE/FAILED）。
4. **State 为什么要可序列化？** —— Checkpoint、跨进程传输、断点恢复都依赖序列化；不可序列化的 State 等于不可恢复。
5. **Retry 哪些错误？** —— 只重试幂等且暂时性错误（429/503/网络），不重试参数错误和逻辑错误。
6. **超时和重试的顺序关系？** —— 先超时再重试，超时是重试的触发器；没有超时的重试会无限挂起。
7. **Checkpoint 为什么在工具边界存？** —— 副作用边界，恢复时避免重复执行有副作用的操作。
8. **Trace 为什么要分层 Span？** —— 便于归因：是模型推理慢，还是工具卡死？一层 Span 无法区分。
9. **工具执行失败怎么处理？** —— 把错误作为 tool 消息回传给 LLM，让它自主决策（换工具/换参数/放弃），而不是直接崩掉 Runtime。
10. **如何防止 Agent 无限循环烧钱？** —— 最大迭代数 + 整体超时 + token 预算三重保险。
11. **如何测试一个不确定性的系统？** —— 不测输出对错，测行为边界：终止保证、错误恢复、超时表现，用 mock LLM 做确定性测试。
12. **这个 Runtime 距离生产还差什么？** —— 并发隔离、成本预算、权限控制、持久化队列、评测管线。

---

## 四、如果重新设计：我会删除什么

这是本次考试最有价值的一题。**架构的成熟不在于加了多少，而在于敢删多少。**

| 组件 | 决定 | 理由 |
|---|---|---|
| 自建 Trace 系统 | **删除，改用 OpenTelemetry 标准** | 自建 Trace 只适合学习，生产应站在标准之上 |
| 复杂的 State 缓存层 | **删除** | 对话历史本身已是缓存，重复缓存引入一致性 bug |
| 过早的异步工具并发 | **保留但降级为可选** | 90% 场景串行足够，并发引入的复杂度先欠着 |
| 自定义错误分类体系 | **简化为 Retryable / Fatal 两类** | 三层分类的判断成本高于收益 |

删完之后剩下的最小核心是：**循环 + State + 工具边界 Checkpoint**。其他一切都可以按需生长。这就是“最小可行架构”的真正含义——不是做得少，而是每一行都有不可替代的理由。

---

## 五、M1 五大成果回顾

1. **Agent Runtime**：六大组件的从零实现，约 1500 行，零框架依赖。
2. **Coding Agent 雏形**：能读文件、写代码、跑测试、自我修复的 Agent，验证了 Runtime 的实战能力。
3. **Inference Notebook**：参数、采样策略、上下文窗口的实验记录，理解“大脑”的脾气。
4. **框架对比报告**：LangChain / LlamaIndex / 自建的对比，结论是“框架适合快速验证，自建适合深度掌控”。
5. **README 与文档**：把隐性知识显性化——写作即是第二遍学习。

### 认知跃迁：从“调用 API”到“Runtime Engineer”

M1 之前，我的心智模型是：`用户 → Prompt → API → 回答`。M1 之后变成：

```
用户 → Runtime[ 状态机 × 工具 × 容错 × 观测 ] → LLM → 外部世界
              ↑______________ 反馈闭环 ______________↓
```

**调用 API 是使用一个概率函数；构建 Runtime 是工程化一个概率系统**。前者的技能是写 prompt，后者的技能是设计状态机、故障恢复和观测体系——这正是“工程师”与“调用者”的分水岭。

---

## 六、实践练习与思考题

**闭卷练习（已完成）**：2 小时内不看资料，从空文件写出完整 Runtime 并通过 5 个测试用例：正常完成、工具失败恢复、限流重试、超时降级、断点续跑。

**留给你的思考题**：

1. 如果两个工具并发执行且都写 State，如何保证一致性？（提示：版本号或 Actor 模型）
2. Checkpoint 存储格式选 JSON 还是 SQLite？各自在什么规模下失效？
3. 如果 LLM 陷入了“调同一个工具、传同样参数”的死循环，除了最大迭代数，还能设计什么更聪明的检测？
4. Trace 数据量爆炸怎么办？采样策略怎么设计才不丢失关键故障？

---

## 七、与 Agent Engineering 的关联

这个手写 Runtime 在实际 Agent 系统中的对应关系：

- **生产框架的内化**：LangGraph 的 `StateGraph` 就是你的 State + 循环；其 `interrupt` 机制就是你的 Checkpoint。理解原理后，框架文档从“API 手册”变成“你已知设计的对照表”。
- **可观测性即运维**：生产 Agent 事故排查 80% 依赖 Trace。M1 的两层 Span 设计直接对接 OpenTelemetry GenAI 语义约定。
- **可靠性设计是核心竞争力**：企业落地的最大障碍不是模型能力，而是故障恢复、成本控制、行为可控——全是 M1 覆盖的内容。
- **M2+ 的地基**：RAG 是往 Runtime 里加一个检索工具，Multi-Agent 是多个 Runtime 实例互相作为对方的“工具”。地基清晰，上层自然顺畅。

---

## 八、FAQ

**Q1：有了 LangChain/LangGraph，为什么还要从零实现 Runtime？**
A：框架是“知其然”，从零实现是“知其所以然”。当你遇到框架的抽象泄漏（比如 LangGraph 的状态序列化限制），手写经验能让你 10 分钟定位问题，而不是读三天源码。

**Q2：Checkpoint 应该多久存一次？**
A：在有副作用的操作边界存，通常是工具调用后。纯 LLM 推理阶段崩溃代价低（只是重推一次），不值得为它付出 IO 开销。

**Q3：重试次数设多少合适？**
A：LLM API 建议 3-5 次指数退避（1s、2s、4s…），工具调用 1-2 次。关键原则：重试必须有上限，且可重试与不可重试错误必须区分。

**Q4：Trace 和普通日志有什么区别？**
A：日志是文本流，Trace 是结构化的、带层级和时间关系的 Span 树，能回答“这次 Agent 运行中哪一次 LLM 调用最慢、它前面调了什么工具”。调试 Agent 几乎只靠 Trace。

**Q5：M1 结束后下一步学什么？**
A：M2 的 RAG。有了 Runtime 地基，RAG 对你来说就是“给 Agent 加一个高质量的检索工具 + 外挂记忆管理”，学习曲线会平滑得多。

---

## 参考资料

- OpenAI Function Calling 官方文档 — Tool Schema 设计规范
- Anthropic《Building effective agents》— Agent 设计模式与工作流区分
- LangGraph 文档 — StateGraph 与 Checkpointer 的生产实现对照
- OpenTelemetry GenAI Semantic Conventions — Trace 标准化方案
- Google SRE Book — Retry / Timeout / Exponential Backoff 的经典论述
- Twelve-Factor App — 可恢复、可观测系统的通用原则

> **M1 结语**：这一个月最重要的产出不是 1500 行代码，而是一条因果链——你不再问“怎么用”，而是能回答“为什么这样设计、不这样设计会坏在哪”。这，就是从 API 调用者到 Runtime Engineer 的跃迁。

---

## 📋 本日知识点清单

- [ ] 从零实现 Tool/State/Retry/Timeout/Checkpoint/Trace 的 Agent Runtime
- [ ] 12 个核心问题的回答
- [ ] 如果重新设计会删除什么
- [ ] M1 五大成果回顾（Runtime/Coding Agent 雏形/Inference Notebook/对比报告/README）
- [ ] 从"调用大模型API"到"Agent Runtime Engineer"的认知跃迁

## 📝 实践练习

不看资料独立完成 Agent Runtime，回答 12 个核心问题。

---

*本文是「AI Agent 工程师」6 个月学习计划的一部分。学习路线：LLM → Inference → Runtime → Harness → Memory → Environment → Evaluation → Production。目标：Agent / AI Systems Engineer。*
