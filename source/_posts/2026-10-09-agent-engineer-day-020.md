---
title: "AI Agent 工程师 Day 20：Streaming：Token 流与 Agent 事件流"
date: 2026-10-09 10:30:00
tags:
  - AI Agent 工程师
  - Streaming
  - Event
  - Agent
  - Runtime
categories:
  - AI Agent 工程师学习计划
  - M1 LLM + Agent Runtime
description: "Day 20/168 | M1 流式输出 | Streaming：Token 流与 Agent 事件流。6 个月从 LLM 到生产级 Agent 系统的完整学习路线。"
keywords: "AI Agent, 工程师, 流式输出, Streaming, Event, Agent, Runtime"
author: OpenClaw Agent Learning
---

# AI Agent 工程师 Day 20：Streaming：Token 流与 Agent 事件流

> **6 个月学习计划** | M1 - LLM + Agent Runtime | Day 20/168
> 
> **今日主题**: 流式输出

---

# Streaming：Token 流与 Agent 事件流

> **核心结论先行**：Agent 系统中的流式输出分为两层——**Token 级流式**让用户“看到 LLM 在思考”，**事件级流式**让用户“看到 Agent 在行动”。前者解决 LLM 生成慢的体感问题，后者解决 Agent 多步骤执行过程黑盒的问题。工程实现上，一个简单的 `yield event` 生成器模式就足够了，不需要 EventBus 这种重型架构——因为 Agent 事件流本质是**单消费者、有序、逐条产生**的，与发布订阅模型的适用条件完全不符。理解这两层流式的区别与组合方式，是构建任何生产级 Agent 界面（如 Claude、ChatGPT 那种“边跑边显示”的体验）的基础。

---

## 一、背景与动机：为什么第 20 天要学这个

在 6 个月 AI Agent 工程师路线中，你已经走过了 LLM API 调用基础、Prompt 设计、Tool Calling 的基本闭环。你能让 Agent 完成一次“接收任务 → 调用工具 → 返回结果”的完整流程。但你可能已经隐约感觉到一个问题：

**Agent 的一次 Run 可能要跑 30 秒甚至更久，这 30 秒里用户盯着一个转圈图标，什么都不知道。**

这是所有 Agent 产品上线前必须解决的问题。ChatGPT 之所以给人“很快”的错觉，不是因为模型真的快了，而是因为流式输出把“等 20 秒看完整答案”变成了“第 1 秒就开始看到字在蹦出来”。**流式不是性能优化，是体感工程。**

而在 Agent 场景下，问题更复杂：Agent 不只是生成文本，它还会调用工具、多次思考、执行多步。用户需要知道“它现在在搜网页”、“它刚才调了哪个工具”。这就需要比 Token 流更高一层的事件流。

所以本篇的知识结构是一条清晰的因果链：

```
LLM 生成慢 → Token Streaming → Agent 执行是多步黑盒 → Event Streaming
     ↓                              ↓
  体感问题                        过程透明问题
```

---

## 二、核心内容

### 2.1 Model Streaming vs Agent Event Streaming：两个层次，不是两种技术

这两个概念经常被混为一谈，必须先分清楚。

**Model Streaming（模型流式 / Token 级流式）**：LLM API 的能力。模型生成文本时是逐 token 产出的，API 以 SSE（Server-Sent Events）或分块响应的方式把 token 一个个推给你。OpenAI 的 `stream=True`、Anthropic 的 streaming messages API 都属于这一层。它发生在**单次 LLM 调用内部**。

**Agent Event Streaming（Agent 事件流 / 事件级流式）**：Agent Runtime 的能力。Agent 的一次 Run 包含多步：开始运行 → 调模型 → 生成 token → 决定调工具 → 执行工具 → 再调模型 → …… → 结束。事件流把这条时间线上的**关键节点**作为离散事件逐个推给客户端。它发生在**整个 Run 的生命周期**。

用一张表对比：

| 维度 | Model Streaming | Agent Event Streaming |
|---|---|---|
| 粒度 | Token（词/字片段） | 事件（生命周期节点） |
| 来源 | LLM API 原生支持 | Agent Runtime 自己封装 |
| 抽象层级 | 传输层细节 | 业务编排层 |
| 谁消费 | Runtime 内部聚合，或透传给前端 | 前端 UI、日志系统、观测工具 |
| 典型内容 | 一小段文本 | "工具开始了"、"运行结束了" |
| 是否必须 | 可选（不开也能用） | Agent 产品基本必须有 |

**关键工程直觉**：Agent Event Streaming 是**包含并超越** Token Streaming 的。在事件流中，Token 也是一种事件（`Token` 事件）。Agent Runtime 拿到 LLM 的 token 流后，把它们包装成事件，和其他生命周期事件一起吐给下游。两层流式不是二选一，而是嵌套关系：

```
Run（一次 Agent 执行）
 └─ ModelStarted（模型开始）
     └─ Token / Token / Token / ...   ← 内层：来自 LLM API 的流
     └─ ToolCall（模型决定调用工具）   ← 模型输出结束的标志
 └─ ToolStarted（工具开始执行）
 └─ ToolFinished（工具执行完成）
 └─ ModelStarted（第二轮思考）
     └─ Token / Token / ...
 └─ ModelFinished
 └─ RunFinished（整个运行结束）
```

### 2.2 八种核心事件：Agent Run 的时间线切分

理解事件流的最好方式是把一次 Run 想象成一条时间线，事件就是时间线上的刻度。标准的八种事件：

| 事件 | 中文含义 | 触发时机 | 前端典型用途 |
|---|---|---|---|
| `RunStarted` | 运行开始 | Agent 收到用户输入，Run 启动 | 显示“正在处理”、初始化会话 UI |
| `ModelStarted` | 模型开始 | 每次调用 LLM 前 | 显示“思考中…” |
| `Token` | Token 片段 | LLM 流式输出的每个 token | 打字机效果渲染回复 |
| `ToolCall` | 工具调用决策 | 模型输出中包含工具调用请求 | 展示“我要调用 XX 工具” |
| `ToolStarted` | 工具开始执行 | Runtime 开始执行工具 | 显示工具调用卡片（进行中状态） |
| `ToolFinished` | 工具执行完成 | 工具返回结果 | 更新卡片为完成状态，可展示结果摘要 |
| `ModelFinished` | 模型调用结束 | 本次 LLM 调用完成（含 stop reason） | 判断是继续还是收尾 |
| `RunFinished` | 运行结束 | 整个 Run 完成 | 结束加载状态，标记最终结果 |

几个容易被忽略但重要的设计细节：

**1. `ToolCall` 与 `ToolStarted` 为什么要分开？** `ToolCall` 是模型的**决策**（“我想调用 search，参数是 {...}”），`ToolStarted` 是 Runtime 的**执行动作**。两者之间可能有 gap：Runtime 可能要做参数校验、权限检查、甚至人工审批（human-in-the-loop）。分开建模，才能在中间插入控制逻辑。这是“决策与执行分离”思想的体现。

**2. `ModelFinished` 里藏着控制流的钥匙。** 它通常携带 stop reason：`end_turn`（模型说完了）、`tool_use`（模型要求调工具）、`max_tokens`（被截断了）。Agent Runtime 的主循环就是靠它决定“再调一轮模型”还是“结束 Run”。

**3. `ModelStarted/Finished` 是多次的。** 一次 Run 中，每个“思考→行动”循环都会触发一对。前端如果把它做成时间线，用户能清楚看到 Agent 跑了几轮。

### 2.3 为什么用 yield，而不是 EventBus

这是本篇最有工程判断价值的一节。很多教程一上来就教你搭 EventBus（事件总线）、发布订阅（Pub/Sub），对 Agent 场景来说是**过度设计**。原因从需求出发推导：

**Agent 事件流的实际特征是：**

1. **单消费者**：一个 Run 的事件只流向一个地方（HTTP 响应流 / WebSocket 连接）。不是广播。
2. **严格有序**：事件必须按发生顺序到达，乱序的 Token 流渲染出来是乱码。
3. **生产者与消费者生命周期绑定**：Run 结束，流就结束，没有“离线订阅”需求。
4. **天然同步产生**：Runtime 主循环执行到哪一步，事件就在哪一步产生。

**Generator（生成器）模式恰好完美匹配这些特征**：`yield` 天然保序、天然是拉取模型（消费者驱动）、天然随函数结束而结束、零额外依赖。代码量从 EventBus 的几百行降到几十行。

| 特性 | yield Generator | EventBus / Pub-Sub |
|---|---|---|
| 消费者数量 | 单个（天然） | 多个（天然） |
| 顺序保证 | 强（代码顺序即事件顺序） | 需要额外设计 |
| 背压（backpressure） | 自动（拉取模型） | 需要队列实现 |
| 生命周期 | 与函数作用域绑定 | 需要显式管理订阅 |
| 适用场景 | 一次 Run 的事件输出 | 多模块解耦、跨进程分发 |

**判断要明确**：什么时候才需要 EventBus？当事件需要**多个独立消费者**（比如同时发给 UI、审计日志、指标系统，且三者互不感知）或者**跨进程/跨服务**分发时。早期 Agent 项目从 `yield` 起步，等出现真正的多消费者需求再升级到事件总线——而且升级路径是平滑的：把 `yield event(event)` 换成 `bus.publish(event)` 即可，主循环逻辑不变。

### 2.4 流式输出对用户体验的影响：数字背后的体感

这部分给几个可以量化的工程直觉。

**感知延迟**：人类对“系统无响应”的忍耐阈值约为 1-2 秒。LLM 非流式输出一个 500 token 的回答，假设 40 tokens/s 的生成速度，用户要等约 12 秒才看到第一个字。流式输出把首字延迟（TTFT, Time To First Token）压缩到 1 秒内——**等待总时长没变，但心理感受完全不同**，因为用户看到系统在持续工作。

**Agent 场景下效应被放大**：一次含工具调用的 Run 总时长 30-60 秒很常见。如果只有 Run 结束才给结果，用户大概率会重复提交或直接流失。事件流把这段长等待切成一系列“有进展感的瞬间”：

- 第 0 秒：`RunStarted` → 界面出现时间线
- 第 1 秒：`ModelStarted` + `Token` → 看到模型在思考/输出
- 第 8 秒：`ToolCall` + `ToolStarted` → 看到“正在搜索...”
- 第 12 秒：`ToolFinished` → 看到“搜索完成，找到 5 条结果”
- 第 30 秒：`RunFinished` → 完整答案

**透明度带来信任**：用户能看到 Agent 调了什么工具、拿到了什么中间结果，出错时能定位是哪一步的问题（是模型决策错了，还是工具返回错了）。这在调试和生产排障中同样关键——事件流本身就是**结构化日志**，接进观测系统零成本。

### 2.5 两种 Streaming 的应用场景

最后回答“什么时候用哪层”：

**只用 Token Streaming（无 Agent 编排）**：纯聊天机器人、单轮问答、文案生成。没有多步执行，生命周期事件没有信息量。

**Token + Event Streaming（标准 Agent 形态）**：任何带工具调用的 Agent。Token 事件负责回答的“打字机效果”，生命周期事件负责工具卡片、多轮时间线。这是 Claude、ChatGPT（带 tool use 时）、LangGraph、OpenAI Assistants Streaming 的共同形态。

**只用 Event Streaming、Token 不透传**：某些场景下你会隐藏模型的中间思考，只让用户看到“开始思考 → 调用工具 X → 完成”。适合隐私敏感或 UI 极简的产品。事件流架构的好处正在于此：**要不要透传 Token 是消费端的策略选择，不是架构改动**。

---

## 三、代码实现：用 yield 构建完整事件流

先定义事件类型与事件结构：

```python
from dataclasses import dataclass
from enum import Enum
from typing import Iterator, Any

class EventType(str, Enum):
    RUN_STARTED = "run_started"
    MODEL_STARTED = "model_started"
    TOKEN = "token"
    TOOL_CALL = "tool_call"
    TOOL_STARTED = "tool_started"
    TOOL_FINISHED = "tool_finished"
    MODEL_FINISHED = "model_finished"
    RUN_FINISHED = "run_finished"

@dataclass
class Event:
    type: EventType
    payload: Any
```

核心：Agent 主循环是一个生成器，执行到哪一步就 `yield` 哪个事件：

```python
def run_agent(query: str, tools: dict, max_turns: int = 5) -> Iterator[Event]:
    yield Event(EventType.RUN_STARTED, {"query": query})
    messages = [{"role": "user", "content": query}]

    for _ in range(max_turns):
        # --- 模型阶段：透传 LLM 的 token 流 ---
        yield Event(EventType.MODEL_STARTED, {})
        stop_reason, tool_call = None, None
        for chunk in llm_stream(messages):  # 内层：Model Streaming
            if chunk.is_text:
                yield Event(EventType.TOKEN, chunk.text)
            elif chunk.is_tool_use:
                tool_call = chunk.tool_call
            stop_reason = chunk.stop_reason
        yield Event(EventType.MODEL_FINISHED, {"stop_reason": stop_reason})

        # --- 决策与执行分离 ---
        if stop_reason != "tool_use":
            break
        yield Event(EventType.TOOL_CALL, tool_call)

        # --- 工具阶段 ---
        yield Event(EventType.TOOL_STARTED, {"name": tool_call.name})
        result = tools[tool_call.name](**tool_call.args)
        yield Event(EventType.TOOL_FINISHED, {"result": result})
        messages.append(tool_result_message(tool_call, result))

    yield Event(EventType.RUN_FINISHED, {})
```

消费端转成 SSE 推给前端：

```python
# FastAPI 示例
from fastapi.responses import StreamingResponse

@app.post("/chat")
def chat(req: ChatRequest):
    def sse():
        for event in run_agent(req.query, TOOLS):
            yield f"event: {event.type.value}\ndata: {json.dumps(event.payload)}\n\n"
    return StreamingResponse(sse(), media_type="text/event-stream")
```

事件顺序（对照 2.2 的时间线）：

```
RunStarted → ModelStarted → Token* → (ToolCall → ToolStarted
→ ToolFinished → ModelStarted → Token*)* → ModelFinished → RunFinished
```

注意嵌套关系：Token 事件在 ModelStarted 和 ModelFinished 之间，工具事件夹在 ToolCall 之后、下一轮 ModelStarted 之前。**事件顺序本身就是 Agent 的执行语义**，消费端可以仅凭事件序列重建整个执行过程。

---

## 四、实践练习与思考题

**练习：** 实现一个带 `get_weather` 工具的 Agent，用 `yield` 产生全部 8 种事件类型。用 `for event in run_agent("北京今天天气如何")` 打印事件序列，验证顺序符合上文时间线。进阶：接 FastAPI 转成 SSE，用浏览器 EventSource 消费。

**思考题：**

1. 如果用户在 Agent 执行到一半时点击“停止”，生成器架构下如何实现取消？（提示：生成器被 `close()` 或垃圾回收时，`yield` 处会抛出 `GeneratorExit`——这就是为什么 yield 架构的取消逻辑特别自然。）
2. `ToolFinished` 事件里应该放完整工具结果还是摘要？如果工具返回了 50KB 的网页内容，透传给前端意味着什么？
3. 什么时候你的 Agent 项目该从 yield 升级到 EventBus？写出至少两个触发条件。

---

## 五、与 Agent Engineering 的关联

在生产级 Agent 系统中，事件流不是锦上添花，而是四个关键能力的地基：

1. **前���体验**：Agent 产品 UI（时间线、工具卡片、打字机）全部由事件驱动。没有事件流，前端只能做转圈。
2. **可观测性（Observability）**：事件序列天然是结构化 trace，直接对接 LangSmith、Langfuse 等观测平台，可以回放每一次 Run 的完整过程。
3. **Human-in-the-loop**：`ToolCall` 与 `ToolStarted` 之间插入“等待用户审批”状态，是敏感操作（发邮件、转账、删数据）审批流的标准实现点。
4. **多 Agent 编排**：当子 Agent 作为父 Agent 的工具被调用时，子 Agent 的事件流可以被“转发”或“折叠”进父级事件流——这就是为什么主流框架（LangGraph、CrewAI）都把事件流作为一等公民设计。

---

## 六、FAQ

**Q1：SSE 和 WebSocket 该选哪个？**
Agent 事件流是服务器到客户端的单向推送，SSE 完全够用且实现简单（HTTP 原生、自动重连）。只有需要客户端在 Run 进行中持续发消息（如流式语音输入、中途插话）时才需要 WebSocket。大多数 Agent 产品选 SSE。

**Q2：Token 事件是不是太细了？每个 token 一条消息会不会性能问题？**
会。生产实践常做**事件批处理（batching/coalescing）**：比如每 50ms 或每 N 个 token 合并为一条消息发送。注意必须在**发送层**合并，Runtime 内部的 Token 事件保持逐个产生，否则丢失语义完整性。

**Q3：yield 架构在多轮工具调用时事件顺序会乱吗？**
不会。生成器的代码执行顺序就是事件顺序，这是它的核心优势。会乱的是你自己写异步并发执行多个工具时——如果并发执行多个工具，需要给事件加 `tool_call_id` 标识归属。

**Q4：`ToolCall` 事件能不能省掉，直接发 `ToolStarted`？**
不建议。分开才能支持参数校验失败、权限拒绝、人工审批等“决策了但没执行”的场景。省掉一个事件类型省不了代码，只会堵死控制流的扩展点。

**Q5：事件流和 MCP 有什么关系？**
MCP（Model Context Protocol）定义了 Agent 与工具服务之间的通信协议，其中也包含流式通知机制。本篇讲的是 Agent Runtime 与客户端之间的事件流；MCP 解决的是 Agent 与工具之间的问题。两者是相邻层的协议，事件模型思想相通。

---

## 七、参考资料

- OpenAI API — Streaming chat completions（`stream=True` 与 SSE 格式）
- Anthropic Docs — Streaming Messages（streaming 事件类型与 stop reason）
- Vercel AI SDK — Streaming & Generative UI（事件流驱动前端的典型实现）
- LangGraph — Streaming（`stream_mode="updates" / "messages"` 的两层流式设计）
- Python Docs — Generators 与 GeneratorExit（yield 取消语义的官方说明）
- MDN — Server-Sent Events（SSE 协议规范）

---

## 📋 本日知识点清单

- [ ] Model Streaming（Token 级）vs Agent Event Streaming（事件级）
- [ ] RunStarted / ModelStarted / Token / ToolCall / ToolStarted / ToolFinished / ModelFinished / RunFinished 事件
- [ ] 简单 yield event 而非复杂 EventBus
- [ ] 流式输出对用户体验的影响
- [ ] 两种 Streaming 的应用场景

## 📝 实践练习

实现 Agent 事件流，用 yield 产生 8 种事件类型。

---

*本文是「AI Agent 工程师」6 个月学习计划的一部分。学习路线：LLM → Inference → Runtime → Harness → Memory → Environment → Evaluation → Production。目标：Agent / AI Systems Engineer。*
