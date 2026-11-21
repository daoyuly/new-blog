---
title: "AI Agent 工程师 Day 63：Context Manager V1：整合上下文工程"
date: 2026-11-21 10:30:00
tags:
  - AI Agent 工程师
  - Context Manager
  - 整合
  - Agent
categories:
  - AI Agent 工程师学习计划
  - M3 Context + Memory + Retrieval
description: "Day 63/168 | M3 Context 管理器 | Context Manager V1：整合上下文工程。6 个月从 LLM 到生产级 Agent 系统的完整学习路线。"
keywords: "AI Agent, 工程师, Context 管理器, Context Manager, 整合, Agent"
author: OpenClaw Agent Learning
---

# AI Agent 工程师 Day 63：Context Manager V1：整合上下文工程

> **6 个月学习计划** | M3 - Context + Memory + Retrieval | Day 63/168
> 
> **今日主题**: Context 管理器

---

# Context Manager V1：整合上下文工程

> **一句话结论**：Context Manager（上下文管理器）是 Agent 系统中负责“决定 LLM 每一步到底看到什么”的核心组件。它把 Token Budget（令牌预算）、Conversation Window（会话窗口）、Compression（上下文压缩）、Tool Context（工具上下文）和 Packing（上下文打包）五个独立机制整合成一条统一管线。没有它，Agent 跑得越久越“失忆”，工具越多越“爆窗”。本文给出 V1 版本的完整设计与 Python 实现，让你理解从“能用”到“可控”的上下文工程。

## 一、背景与动机：为什么需要 Context Manager

在 6 个月 AI Agent 工程师路线中，前两个月你已经学会了搭 LLM 调用、实现 Tool Use、跑通 ReAct 循环。但很快会遇到三个墙：

1. **窗口爆炸**：多轮对话 + 工具返回的大 JSON，几轮就把 context window 塞满，要么报错、要么成本飙升。
2. **注意力稀释**：即使塞得下，LLM 对超长上下文中间部分的利用率也很差（lost in the middle 问题），关键信息被淹没。
3. **无策略的裁剪**：很多人用 `messages[-20:]` 一刀切，结果把系统提示词、工具定义、甚至“用户上一句刚说的需求”切掉了。

这三堵墙的共同根因是：**上下文组装被散落在代码各处，没有单一职责的组件统一决策**。Context Manager 就是把这个决策收敛到一个模块——它不是新概念，而是对已有机制（预算、窗口、压缩、工具上下文、打包）的**工程化整合**。

用一句话建立直觉：**Runtime 负责“执行”，Context Manager 负责“喂什么”**。前者是发动机，后者是燃油喷射系统。

## 二、核心内容

### 2.1 Context Manager 的完整设计

Context Manager 的职责边界很清晰：**输入是系统的全部状态，输出是一条可直接发给 LLM 的 message 列表**。全部状态包括：

- System Prompt（系统提示词）
- Conversation History（对话历史，可能很长）
- Tool Definitions（工具定义，schema 占 token 很凶）
- Tool Results（工具返回结果，常常是大 JSON）
- Retrieved Context（RAG 检索到的文档片段）
- Working Memory（Agent 自己维护的笔记/计划）

设计原则有三条：

1. **单一出口**：所有发给 LLM 的内容必须经过 Context Manager，禁止业务代码直接拼 messages。这是保证可控性的前提。
2. **声明式策略优于命令式切片**：策略是“保什么、压什么、丢什么”的规则集合，而不是硬编码下标。
3. **可观测**：每次组装完要输出预算报告（各部分占多少 token），否则线上排查等于盲调。

整体架构如下：

```
        ┌─────────────────────────────────────────┐
        │              Agent State                │
        │  system / history / tools / memory      │
        └──────────────────┬──────────────────────┘
                           │
        ┌──────────────────▼──────────────────────┐
        │           Context Manager V1            │
        │                                         │
        │  1. Token Budget      预算分配           │
        │  2. Conv Window       会话窗口裁剪       │
        │  3. Compression       滚动摘要           │
        │  4. Tool Context      工具结果瘦身       │
        │  5. Packing           最终打包排序       │
        └──────────────────┬──────────────────────┘
                           │
        ┌──────────────────▼──────────────────────┐
        │        LLM API (messages, tools)        │
        └─────────────────────────────────────────┘
```

### 2.2 五大机制的整合：Token Budget + Window + Compression + Tool Context + Packing

这五个机制不是并列关系，而是**管线中的五道工序**。理解它们的因果关系是本节核心。

**第一道工序：Token Budget（令牌预算分配）**。总预算 = 模型窗口 − 预留的输出空间（比如 2048）。然后按优先级给各部分分配份额，例如：

| 组成部分 | 优先级 | 典型预算占比 | 说明 |
|---|---|---|---|
| System Prompt | P0 | 5% | 身份与规则，永不被压缩 |
| Tool Definitions | P0 | 15% | 工具 schema，丢工具=能力残废 |
| Recent Turns | P1 | 40% | 最近 2-4 轮原始对话 |
| Compressed History | P2 | 20% | 早期对话的滚动摘要 |
| Retrieved Context | P1 | 15% | RAG 结果，按时效/相关性排序 |
| Working Memory | P1 | 5% | Agent 笔记，如当前计划 |

预算的意义在于：**当总量超限时，牺牲谁、保谁，在分配阶段就确定了，而不是在报错时手忙脚乱**。

**第二道工序：Conversation Window（会话窗口）**。决定保留最近多少轮“原文”。关键细节：轮次按“语义单元”切分（一次 user 输入 + assistant 回复 + 其间的 tool calls 算一轮），不能按 message 条数切——否则会把 tool_call 和它的 tool_result 切开，直接触发 API 报错。

**第三道工序：Compression（压缩）**。窗口外的历史不是丢弃，而是滚动摘要：每滑出一轮，就更新一次摘要（可用便宜模型如 GPT-4o-mini 执行）。摘要写入 Compressed History 段，附在 System Prompt 之后，格式如 `[历史摘要] 用户最初要求实现一个爬虫，已完成登录模块…`。

**第四道工序：Tool Context（工具上下文瘦身）**。工具返回结果是最常见的爆窗元凶——一次搜索返回 50KB HTML。策略分三层：

- **截断**：超长文本只保留前 N token + `... [truncated]`
- **结构化抽取**：JSON 结果只保留业务字段
- **引用化**：大结果存入外部存储，context 中只放句柄（如 `doc_7`），Agent 需要时再调用工具取回

**第五道工序：Packing（打包排序）**。把所有存活的内容按最终顺序组装。排序依据是 LLM 的注意力特性——**开头和结尾注意力最强**。典型顺序：

```
[System Prompt] [Tool Definitions] [Compressed History] [Retrieved Context] [Working Memory] [Recent Turns]
```

稳定内容在前（利用 KV Cache），动态内容在后（保证最新指令在结尾、注意力最高）。

**因果链总结**：预算决定生死 → 窗口决定保真 → 压缩决定记忆 → 工具瘦身决定不爆 → 打包决定利用率。五者缺一，上下文工程就崩。

### 2.3 Context Manager 作为 Agent 的核心组件

为什么说它是“核心”而非“工具类”？对比一下没有它和有它的 Agent 系统：

| 维度 | 无 Context Manager | 有 Context Manager |
|---|---|---|
| 上下文组装 | 散落在 Runtime 各处 | 单一出口，策略集中 |
| 超长对话 | 报错或随机截断 | 预算内平滑降级 |
| 成本 | 随轮次线性膨胀 | 摘要+瘦身，接近常数 |
| 可调试性 | 无法回答"LLM 看到了什么" | 每次组装输出预算报告 |
| 策略迭代 | 改代码、回归测试 | 改配置、A/B 实验 |

更深一层：LLM Agent 的“智能”上限，很大程度由上下文质量决定。模型本身是固定的，你能控制的只有输入。**Context Manager 本质上是在为一个固定智能体动态构造“工作记忆”**——类比人脑：System Prompt 是性格，Recent Turns 是工作记忆，Compressed History 是长期记忆的语义压缩，Working Memory 是便签。这个认知框架比任何代码模板都重要。

### 2.4 动态 Context 管理的实现

“动态”体现在两处：

**运行时自适应**。预算不是静态分配的——如果当前任务不用工具，Tool Definitions 可以动态剔除（function calling 时才注入），省下的预算给 Retrieved Context。同理，RAG 无命中时该段直接置空。

**按需加载**。配合引用化策略，Context Manager 维护一个 `context_store`，Agent 可通过 `read_context(handle)` 工具主动拉取被压缩掉的内容。这就把“被动丢信息”升级为“主动取信息”——Agent 获得了对自己记忆的元控制能力。

实现层面的关键数据结构：

```python
@dataclass
class TokenBudget:
    total: int = 128_000
    reserve_output: int = 4_096
    # 各段份额，按比例初始化，运行时可调
    shares: dict = field(default_factory=lambda: {
        "system": 0.05, "tools": 0.15, "compressed": 0.20,
        "retrieved": 0.15, "memory": 0.05, "recent": 0.40,
    })
```

### 2.5 Context Manager 与 Runtime 的接口

Context Manager 不执行任何动作，它只做纯函数式的转换。与 Runtime 的接口极简：

```python
class ContextManager(Protocol):
    def build(self, state: AgentState) -> LLMRequest:
        """输入完整状态，输出可直接发送的请求（messages + tools）"""

    def ingest(self, state: AgentState, new_messages: list[Message]) -> AgentState:
        """吸收新消息（用户输入/工具结果），更新内部状态（如触发压缩）"""

    def report(self) -> ContextReport:
        """返回最近一次组装的 token 分布，用于日志与监控"""
```

Runtime 的 Agent Loop 中调用点固定为两处：循环开始时 `build()`，收到新消息后 `ingest()`。这种“纯转换 + 窄接口”的设计让 Context Manager 可以独立单测——给定任意状态序列，断言输出永远不超预算、永远包含 P0 内容。

```
Runtime Agent Loop:
  while not done:
      req = ctx_mgr.build(state)        # ← 组装
      resp = llm(req)
      state = ctx_mgr.ingest(state, resp.tool_calls ...)
      result = runtime.execute(tools)
      state = ctx_mgr.ingest(state, result)
```

## 三、V1 参考实现

```python
import tiktoken
from dataclasses import dataclass, field

enc = tiktoken.get_encoding("cl100k_base")

def count_tokens(text: str) -> int:
    return len(enc.encode(text))

class ContextManagerV1:
    """整合五工序的最小可用上下文管理器"""

    def __init__(self, budget: TokenBudget):
        self.budget = budget
        self.summary = ""          # Compressed History
        self.history = []          # 完整历史（含语义轮次边界）

    # ---- 工序4: Tool Context 瘦身 ----
    def _slim_tool_result(self, text: str, limit: int = 2000) -> str:
        if count_tokens(text) <= limit:
            return text
        half = limit // 2
        head = enc.decode(enc.encode(text)[:half])
        tail = enc.decode(enc.encode(text)[-half:])
        return f"{head}\n...[truncated {count_tokens(text)-limit} tokens]...\n{tail}"

    # ---- 工序3: Compression（滚动摘要，此处用朴素截取代替 LLM 调用）----
    def _compress(self, dropped_turns: list) -> None:
        for turn in dropped_turns:
            brief = turn[:300]
            self.summary = (self.summary + " " + brief)[-3000:]  # 摘要本身也有上限

    # ---- 工序2+5: Window + Packing ----
    def build(self, state: dict) -> dict:
        total = self.budget.total - self.budget.reserve_output
        # 1) System Prompt（P0，直接放）
        messages = [{"role": "system", "content": state["system_prompt"]}]
        used = count_tokens(state["system_prompt"])
        # 2) Compressed History
        if self.summary:
            messages.append({"role": "system", "content": f"[历史摘要]\n{self.summary}"})
            used += count_tokens(self.summary)
        # 3) Recent Turns（从最新往回装，装不下就压缩掉）
        recent = []
        for turn in reversed(state["recent_turns"]):
            t = count_tokens(str(turn))
            if used + t > total * self.budget.shares["recent"] + total * 0.1:
                break
            recent.insert(0, turn)
            used += t
        dropped = state["recent_turns"][: len(state["recent_turns"]) - len(recent)]
        if dropped:
            self._compress([str(t) for t in dropped])
        messages.extend(recent)
        # 4) Tool Definitions
        tools = state.get("tools", [])
        tools_tokens = sum(count_tokens(str(t)) for t in tools)
        if tools_tokens > total * self.budget.shares["tools"]:
            tools = self._drop_optional_tools(tools)  # 按优先级降级
        # 5) 组装请求
        return {"messages": messages, "tools": tools}

    def _drop_optional_tools(self, tools):
        return tools  # V1 占位：按 tool.priority 降级，留作练习

    def ingest(self, state: dict, new_msgs: list) -> dict:
        for m in new_msgs:
            if m.get("role") == "tool":
                m["content"] = self._slim_tool_result(m["content"])
        state["recent_turns"].extend(new_msgs)
        return state
```

注意三个工程细节：**（1）token 计数用 `tiktoken` 估算而非精确 API 计数，因为组装必须在发送前完成；粗略估算需留 5-10% 安全余量；（2）压缩发生在 build 时而非 ingest 时，保证摘要总是“最新的窗口外内容”；（3）tool_result 瘦身在 ingest 时同步做，防止膨胀数据在状态里滞留。**

## 四、实践练习与思考题

**练习 1（本日主任务）**：基于上文 V1 代码，完整跑通一个场景：模拟 30 轮带工具调用的对话，验证 (a) 任意时刻总 token 不超预算；(b) System Prompt 和最近 2 轮永不被裁剪；(c) 摘要随轮次增长但自身封顶。

**练习 2**：实现 `_drop_optional_tools`，给每个工具加 `priority` 字段，超预算时从低优先级开始剔除，并观察 Agent 行为变化。

**思考题 1**：如果把摘要任务交给一个便宜的小模型，摘要质量损失会带来什么连锁反应？你会如何在报告中监测这种“记忆漂移”？

**思考题 2**：Packing 时把 Retrieved Context 放在 System Prompt 附近 vs 放在最后一条 user message 里，哪种效果更好？设计一个 A/B 实验验证。

**思考题 3**：KV Cache 视角下，“稳定内容在前、动态内容在后”为什么能省钱？如果每轮都要更新 Working Memory，缓存还有效吗？

## 五、与 Agent Engineering 的关联

Context Manager 是 Agent Runtime 三大件（**Runtime / Context Manager / Tool Registry**）中承上启下的一环。后续路线中它会持续演化：

- **M3 后续**：接入 RAG Pipeline 后，Retrieved Context 的排序与去重逻辑并入 Packing 工序
- **多 Agent 系统**：每个 Agent 有独立 Context Manager，共享的 Compressed History 成为 Agent 间传递“任务记忆”的载体
- **Memory 系统（M4）**：Working Memory 会升级为完整的分层记忆（episodic / semantic），Context Manager 变成记忆系统的“查询接口”

在真实生产系统中，这个组件直接决定三件事：**成本曲线的形状、长任务的成败率、以及可调试性**。Anthropic、OpenAI 官方的 Agent 构建指南中，"manage context carefully" 都是放在最前面的工程建议——这不是玄学，是因为上下文是你在固定模型之外唯一能优化的输入变量。

## FAQ

**Q1: Context Manager 和 Python 的 `with` 语句（contextmanager 装饰器）是一回事吗？**

不是。Python 的 context manager 管理的是**资源的进入/退出**（如文件句柄）。本文的 Agent Context Manager 管理的是 **LLM 输入的组装**。二者只是重名，语义完全不同。搜索资料时务必区分。

**Q2: 有了 128K 甚至 1M 的长上下文模型，还需要上下文工程吗？**

需要，且更重要。原因有三：成本随 token 线性增长；lost-in-the-middle 使超长上下文的中部信息利用率显著下降；模型上下文 ≠ Agent 有效记忆，长任务仍需摘要与引用化。长窗口只是把“爆窗”问题变成了“稀释”问题。

**Q3: 摘要应该多久做一次？每轮都做吗？**

V1 建议在窗口滑出时增量更新（rolling summary），而非每轮全量重写——增量更新成本低、延迟小，缺点是误差累积。工程折中：每 N 轮做一次全量重写校正增量摘要。

**Q4: Token 计数不准导致超限报错怎么办？**

三层防御：用 `tiktoken` 估算并预留 5-10% 余量；发送前做一次硬校验，超限则触发紧急裁剪（丢 Retrieved Context 末尾）；API 报 400 时降级重试。精确计数（如 OpenAI 的 `count_tokens` API）延迟高，不适合每次组装都调用。

**Q5: Context Manager 的策略应该配置化还是写死在代码里？**

配置化。预算份额、窗口大小、截断阈值都应该是可热更新的参数——因为它们需要按任务类型和模型版本 A/B 调优。V1 用 dataclass 默认值即可，但接口设计要为“策略外置”留好缝。

## 参考资料

- OpenAI: Function Calling / Token 使用与估算（`tiktoken` 文档）
- Anthropic: Building Effective Agents（上下文管理章节）
- LangChain / LlamaIndex 中 ConversationSummaryMemory 的实现源码（滚动摘要参考）
- "Lost in the Middle: How Language Models Use Long Contexts"（Liu et al., 2023）—— Packing 排序策略的实证依据

---

## 📋 本日知识点清单

- [ ] Context Manager 的完整设计
- [ ] Token Budget + Conversation Window + Compression + Tool Context + Packing 的整合
- [ ] Context Manager 作为 Agent 的核心组件
- [ ] 动态 Context 管理的实现
- [ ] Context Manager 与 Runtime 的接口

## 📝 实践练习

整合 Context Manager V1，实现完整的上下文工程体系。

---

*本文是「AI Agent 工程师」6 个月学习计划的一部分。学习路线：LLM → Inference → Runtime → Harness → Memory → Environment → Evaluation → Production。目标：Agent / AI Systems Engineer。*
