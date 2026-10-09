---
title: AI Agent 工程师 Day 16：Message State：Agent 跑 10 轮后模型应该看到什么
tags:
  - AI Agent 工程师
  - Message
  - State
  - Context
  - Agent
categories:
  - AI Agent 工程师学习计划
  - M1 LLM + Agent Runtime
description: >-
  Day 16/168 | M1 消息管理 | Message State：Agent 跑 10 轮后模型应该看到什么。6 个月从 LLM 到生产级
  Agent 系统的完整学习路线。
keywords: 'AI Agent, 工程师, 消息管理, Message, State, Context, Agent'
author: OpenClaw Agent Learning
abbrlink: 30941
date: 2026-10-05 10:30:00
---

# AI Agent 工程师 Day 16：Message State：Agent 跑 10 轮后模型应该看到什么

> **6 个月学习计划** | M1 - LLM + Agent Runtime | Day 16/168
> 
> **今日主题**: 消息管理

---

# Message State：Agent 跑 10 轮后模型应该看到什么

**核心结论**：Agent 的"记忆"不是数据库，而是一次 API 请求中的 messages 数组。模型在每一轮看到的，是这个数组被截断、压缩、注入后的投影。Agent 跑 10 轮后，模型不应该看到全部 10 轮的原始记录，而应该看到：一条精心设计的 System Prompt、经过管理的对话历史（含 Tool Call/Tool Result 配对）、以及被裁剪或摘要的早期上下文。**消息管理的本质，是在"信息完整性"和"上下文窗口预算"之间做工程取舍**——这不是优化项，而是 Agent 能否稳定运行 50 轮、500 轮的决定性因素。

---

## 一、背景与动机：为什么这是 Agent 工程师的必修课

在 6 个月 Agent 工程师路线中，你已经学过了 Tool Calling 和单轮 ReAct 循环。但当你把 Agent 从"跑一轮 Demo"推进到"跑一个真实任务"时，会立刻撞上一个问题：**状态去哪了？**

LLM 是无状态的（Stateless）。每次调用 API，模型都"失忆"，你必须在请求里把所有它需要知道的东西重新喂给它。所谓 Agent 的"持续工作"，本质是一个循环：

```
while not task_done:
    response = llm(messages)       # 模型看到 messages，决定下一步
    messages.append(response)      # 把模型的输出追加进历史
    if response.has_tool_call:
        result = execute_tool(...)
        messages.append(tool_result)  # 把工具结果追加进历史
```

这个循环跑 1 轮没问题，跑 10 轮后 messages 数组膨胀、结构出错、成本飙升、模型"忘了"最初的目标——所有这些问题都指向同一个工程对象：**Message State（消息状态）**。

这就是 M1 第 3 周把它放在这个位置的原因：它是从"会调 API"到"能构建 Agent 运行时"的分水岭。后面要学的 Memory、Context Engineering、Multi-Agent 通信，全部建立在它之上。

---

## 二、四种消息类型：Agent 的地基

### 2.1 概念中英文对照

| 类型 | 英文 | 产生者 | 作用 |
|---|---|---|---|
| 系统消息 | System Message | 开发者 | 定义身份、规则、约束，通常不可被用户覆盖 |
| 用户消息 | User Message | 终端用户 / 上游系统 | 表达任务和意图 |
| 助手消息 | Assistant Message | 模型 | 模型的回复，含文本和/或 Tool Call |
| 工具消息 | Tool Message（Tool Result） | 你的代码执行环境 | 回传工具执行结果，必须与 Tool Call 配对 |

一个常见的初学者误区是：把这四种类型当成"对话的四种语气"。正确的理解是：**它们是运行时协议的四个角色，各有严格的生产者和消费规则**。

### 2.2 因果链：为什么必须有这四种

- 没有 System Message → 模型行为随对话漂移，无法注入稳定约束（"只调用这三个工具""结果为空时必须询问用户"）。
- 没有 Tool Message → 模型发出了 Tool Call，却收不到结果，Agent 循环断裂。**Tool Call 与 Tool Result 是强配对关系**，顺序必须严格：`assistant(tool_call) → tool(result)`，中间不能插入任何其他角色的消息。
- 没有 Assistant Message 的完整保留 → 模型看不到自己之前的推理和承诺，会重复操作或自我矛盾。

### 2.3 一个最小但完整的例子

```python
messages = [
    {"role": "system", "content": "你是订单查询助手，只能使用 provided tools。"},
    {"role": "user", "content": "帮我查订单 A100 的物流"},
    {"role": "assistant", "content": None,
     "tool_calls": [{"id": "call_1", "function": {"name": "query_order", "arguments": "{\"order_id\": \"A100\"}"}}]},
    {"role": "tool", "tool_call_id": "call_1",
     "content": "{\"status\": \"shipped\", \"eta\": \"2025-06-02\"}"},
    {"role": "assistant", "content": "订单 A100 已发货，预计 6 月 2 日送达。"},
]
```

注意两个工程细节：`tool_call_id` 必须与 Tool Call 的 `id` 精确对应（模型靠它配对）；Tool Result 的 content 建议是序列化后的结构化文本（JSON 字符串），而不是裸对象——不同 API 对此要求不同，OpenAI 兼容协议普遍要求字符串。

---

## 三、Tool Call / Tool Result / Assistant 消息的处理：Agent 循环的心脏

### 3.1 处理流程

Agent 每一轮的执行顺序是固定的因果链：

```
1. 发送 messages 给 LLM
2. LLM 返回 Assistant Message（可能含 tool_calls）
3. 若无 tool_calls → 任务结束，回复用户
4. 若有 tool_calls → 逐个执行（或并行执行）工具
5. 将每个结果包装为 Tool Message，按 call 顺序追加
6. 回到第 1 步
```

### 3.2 三个容易踩的坑

**坑 1：Tool Result 忘记追加。** 你执行了工具，但忘了把结果 append 进 messages。下一轮模型看到的 Assistant 消息里有一个"悬空"的 Tool Call，绝大多数 API 会直接报错（400），即使不报错，模型也会困惑。

**坑 2：并行 Tool Call 顺序错乱。** 模型一次返回多个 tool_calls 时，对应的 Tool Messages 必须全部紧跟其后。理想情况按返回顺序排列，至少要保证每个 `tool_call_id` 都有对应结果。

**坑 3：Assistant 消息内容丢失。** 有些框架只保存 `content` 而丢弃 `tool_calls` 字段，导致历史里模型"说过的话"和"做过的事"脱节。**持久化时必须完整序列化 Assistant 消息的全部字段**。

### 3.3 结果格式设计

Tool Result 不只是"把工具返回值塞进去"。好的实践：

```python
def format_tool_result(raw: dict) -> str:
    # 1. 截断超长内容（如网页抓取），保留关键部分
    # 2. 错误也要结构化返回，而不是抛异常
    if raw.get("error"):
        return json.dumps({"ok": False, "error": raw["error"]})
    return json.dumps({"ok": True, "data": truncate(raw["data"], max_tokens=2000)})
```

关键直觉：**Tool Result 是给模型读的，不是给人读的**。它应该干净、结构化、信息密度高。一个返回 50KB 原始 HTML 的工具结果，既浪费预算又稀释模型注意力。

---

## 四、跑 10 轮后的 Context 构成

### 4.1 累积后的全景图

假设 Agent 执行"帮用户规划一次出差并订机票"，跑了 10 轮，消息结构大致如下：

```
┌─────────────────────────────────────────────────┐
│ [0] System Message        ── 固定，~1-3K tokens  │
├─────────────────────────────────────────────────┤
│ [1] User Message          ── 任务 + 偏好        │
├─────────────────────────────────────────────────┤
│ [2] Assistant (tool_call: search_flights)       │
│ [3] Tool Result (20 条航班 JSON, ~3K tokens)    │
│ [4] Assistant (tool_call: check_hotel)          │
│ [5] Tool Result                                 │
│ [6] Assistant ("找到 3 个合适方案...")           │
│ [7] Tool Result (tool_call: get_weather)        │
│ [8] Tool Result (tool_call: get_calendar)       │
│ [9] Assistant (文本推理 + tool_call: book_flight)│
│ [10] Tool Result (booking_id, 确认码)           │
│ ... 直到 [N]                                    │
├─────────────────────────────────────────────────┤
│ [N+1] ← 下一轮模型要基于这些做决策               │
└─────────────────────────────────────────────────┘
```

### 4.2 成本与质量的两个数字

- **成本**：多数 API 按 input tokens 计费，且每次请求都要重发全部历史。10 轮对话，历史被发送了 10 次，总 input 量是 O(n²) 级别的增长。跑 10 轮、每轮 4K tokens 的 Agent，累计发送可能超过 20 万 tokens。
- **质量**：上下文越长，模型对早期指令的遵循度越低，这就是 Context Rot（上下文腐烂）。特别是"用户最初的偏好"往往在 20 轮后就被稀释了。

所以 Message State 管理的两个目标天然成立：**控预算，保关键信息**。

---

## 五��模型应该看到什么、不应该看到什么

这是本节的核心判断题。给出一张决策表：

| 信息类别 | 应该保留 | 原因 |
|---|---|---|
| System Message | ✅ 永远保留，置顶 | 约束和身份不能漂移 |
| 用户的原始任务 | ✅ 保留或摘要置顶 | 目标锚点，防止任务漂移 |
| 最近的 K 轮完整交互 | ✅ 原样保留 | 当前推理的直接依赖 |
| 早期的 Tool Result 大块内容 | ⚠️ 摘要/截断 | 已被消化，保留结论即可 |
| 中间失败的 Tool Call | ⚠️ 保留但压缩 | 避免模型重复犯错，但不留完整错误堆栈 |
| 敏感数据（用户手机号、密钥回显） | ❌ 脱敏/移除 | 安全与合规 |
| 已完成的子任务结果明细 | ❌ 换成一行摘要 | 状态记录即可 |
| 内部调试日志、重试噪音 | ❌ 不进入 messages | 纯浪费预算 |

### 5.1 三种主流管理策略

| 策略 | 英文 | 做法 | 适用场景 |
|---|---|---|---|
| 滑动窗口 | Sliding Window | 只保留最近 N 轮 | 简单聊天，任务边界模糊 |
| 摘要压缩 | Summarization / Compaction | 旧历史压缩成一条 summary 消息 | 长任务 Agent，需保留目标 |
| 结构化裁剪 | Selective Pruning | 按规则丢弃大块 Tool Result，保留关键结论 | Tool-heavy Agent |

**实战推荐**：混合策略——System 永远置顶 + 用户目标做"任务便签"（在 System 或首条消息中复述）+ 近 5 轮原样 + 更早的 Tool Result 压缩为结论 + 达到阈值时整体 Summarization。

### 5.2 一个关键认知

"不应该看到什么"不等于"信息被销毁了"。**Message State 和 Memory 是两层**：messages 是模型的"工作台"（Working Memory），完整的运行记录应该存在外部数据库里，需要时再按需注入。新手常犯的错误是把 messages 数组当数据库用——一旦裁剪，信息就永久丢失了。

---

## 六、代码实现：一个可运行的最小消息管理器

```python
from dataclasses import dataclass, field, asdict
import json

MAX_TOOL_RESULT_TOKENS = 2000   # 单条工具结果上限
MAX_MESSAGES_BEFORE_SUMMARY = 30  # 触发压缩的阈值

@dataclass
class MessageStore:
    """Agent 运行时的消息状态管理器（最小实现）"""
    messages: list = field(default_factory=list)
    archive: list = field(default_factory=list)   # 完整历史，永不丢

    def set_system(self, prompt: str):
        # System 永远保持在 index 0，唯一且不可覆盖
        if self.messages and self.messages[0]["role"] == "system":
            self.messages[0]["content"] = prompt
        else:
            self.messages.insert(0, {"role": "system", "content": prompt})

    def add_user(self, content: str):
        self._append({"role": "user", "content": content})

    def add_assistant(self, msg: dict):
        # 必须完整保存，包括 tool_calls 字段
        self._append(msg)

    def add_tool_result(self, tool_call_id: str, result: dict):
        self._append({
            "role": "tool",
            "tool_call_id": tool_call_id,
            "content": self._compact(json.dumps(result, ensure_ascii=False)),
        })

    def _compact(self, s: str) -> str:
        # 超 long 的工具结果截断（生产中应做语义摘要而非硬截断）
        if len(s) > MAX_TOOL_RESULT_TOKENS * 3:
            return s[:MAX_TOOL_RESULT_TOKENS * 3] + "\n...[truncated]"
        return s

    def _append(self, msg: dict):
        self.messages.append(msg)
        self.archive.append(dict(msg))
        if len(self.messages) > MAX_MESSAGES_BEFORE_SUMMARY:
            self._compact_history()

    def _compact_history(self):
        """保护头部 System + 首条 User，压缩中段工具结果，保留最近 8 条"""
        system = [m for m in self.messages if m["role"] == "system"]
        user_goal = next((m for m in self.messages if m["role"] == "user"), None)
        recent = self.messages[-8:]
        middle = [m for m in self.messages[1:-8] if m["role"] != "system"]
        summary = {
            "role": "system",
            "content": f"[历史摘要] 此前完成 {len(middle)} 条交互，"
                       f"关键结论：{self._summarize(middle)}",
        }
        self.messages = system + ([user_goal] if user_goal else []) \
                        + [summary] + recent

    def _summarize(self, msgs) -> str:
        # 生产中这里应调用一个小模型做摘要；此处用规则提取演示
        done = [m["content"][:80] for m in msgs if m["role"] == "tool"]
        return "; ".join(done[-5:])

    def render(self) -> list:
        """发给 LLM 的最终视图"""
        return self.messages
```

这个实现体现了三个不变量（Invariant），任何消息管理器都必须守住：

1. **System 在 index 0，唯一且不可被压缩掉**；
2. **Tool Call 与 Tool Result 的配对关系在压缩后依然成立**（要么都保留，要么都进入摘要）；
3. **archive 与 messages 分离**——裁剪只影响模型视图，不影响真实记录。

第三点值得展开：**压缩破坏配对是 Agent 运行时最常见的崩溃原因**。如果你把中间的 Assistant tool_call 裁掉了，但保留了后面的 Tool Message，下一次请求会直接被 API 拒绝。压缩时必须以"轮"为单位，而不是以"条"为单位。

---

## 七、实践练习与思考题

**练习 1（必做）**：基于上面的 `MessageStore`，模拟一个"订机票" Agent 跑 10 轮（可以手动构造 Tool Call/Result），打印第 10 轮时模型看到的完整 messages。检查：配对是否完整？System 是否还在顶部？

**练习 2**：给 `_compact_history` 加一条规则：Booking 成功的 Tool Result（含确认码）永远不进摘要、必须原文保留。思考为什么——因为确认码是"不可再生的外部事实"，摘要会损坏它。

**练习 3**：统计你的 messages 在 10 轮里的 token 增长曲线（用 tiktoken），画出曲线。这个 O(n²) 增长曲线是后面学 Context Window 管理和成本优化的直观依据。

**思考题**：
1. 如果用户中途改了需求（"不订机票了，改高铁"），消息历史里的旧目标怎么处理？
2. 多个并行 Agent 共享同一个 MessageStore 会发生什么？这引出了下一阶段的 Multi-Agent State 隔离问题。
3. Sub-agent 跑完后，父 Agent 应该看到子 Agent 的全部轨迹，还是只有最终结论？为什么？

---

## 八、与 Agent Engineering 的关联

Message State 不是孤立知识点，它是 Agent 系统的中枢数据结构：

- **Memory 系统**：长期记忆本质是"消息的持久化 + 检索注入"，没有 Message State 的分层认知（工作台 vs 档案），Memory 就无从设计。
- **Context Engineering**：业界 2024-2025 年的热点。Anthropic 的 compaction、OpenAI Agents SDK 的 session 管理，核心都是本节讲的消息裁剪与压缩。
- **可观测性与调试**：Agent 出错时，你排查的第一现场就是"那一轮模型看到了什么 messages"。生产级 Agent 都要求记录每次请求的完整消息视图。
- **Multi-Agent 通信**：Agent 之间传递的也是消息。子 Agent 的输出如何裁剪后进入父 Agent 的 context，就是本节知识点的直接应用。
- **成本与延迟工程**：input tokens 是 Agent 的主要成本项。消息管理做得好，成本可以差 5-10 倍。

一句话：**Agent 框架千千万，但内核都是"循环 + messages 管理 + 工具执行"三件事**。掌握了 Message State，你就掌握了框架的内核，以后用 LangGraph、Claude Agent SDK 还是自研，只是 API 皮肉不同。

---

## FAQ

**Q1：System Message 可以放在对话中间吗？**
不建议。主流 API 约定 System 在数组首位，部分模型对中部的 system 消息处理不一致。如果你想在运行中更新指令，用一条 role 为 user 或带标记的注入消息（如 `[system update]`），并把核心约束始终留在顶部 System 里。

**Q2：压缩历史后模型忘了关键信息怎么办？**
三个手段：① 把不可再生的关键事实（确认码、用户最终决定）提升到 System 或固定便签区，永远不参与压缩；② 摘要时显式列出"已完成的动作清单"而非泛泛描述；③ 需要时从 archive 检索原文再注入——这就是 RAG 式的记忆回灌。

**Q3：Tool Result 应该保留多久？**
经验法则：最近 3-5 轮的 Tool Result 原样保留（当前推理直接依赖），更早的压缩为一句结论。但有例外——错误结果建议保留 2-3 轮，让模型知道"这条路走不通"，避免重复尝试。

**Q4：多轮调用应该用同一个 conversation id 让服务端管历史，还是自己管 messages？**
自己管。无状态管理（每次发全量 messages）虽然流量大，但让你拥有裁剪、压缩、注入的完全控制权——这正是本节的核心能力。服务端托管历史会剥夺你做 Context Engineering 的空间。

**Q5：跑几十轮后 Agent 越来越"傻"，是模型问题还是消息问题？**
大概率是消息问题。优先检查：① 历史是否无限增长没有裁剪；② 大块 Tool Result 是否在稀释注意力；③ 最初的 System 约束是否被后来的消息"淹没"。先做消息管理，再怀疑模型。

---

## 参考资料

- OpenAI Docs: [Why you should build a stateful agent](https://platform.openai.com/docs/guides/agents) — 官方对 Agent 消息状态管理的说明
- Anthropic Docs: [Context Editing / Compaction](https://docs.anthropic.com/en/docs/build-with-claude/context-editing) — 业界标杆的上下文压缩实践
- OpenAI Cookbook: [Function Calling 完整示例](https://cookbook.openai.com/examples/function_calling) — Tool Call/Result 消息格式的权威参考
- LangChain Blog: [Agent Memory & State](https://blog.langchain.dev/) — 框架层的 state 设计思路
- LangGraph Docs: [MessagesState](https://langchain-ai.github.io/langgraph/) — 生产级消息 reducer 的实现，强烈建议阅读源码对照本文的不变量设计

> 下一天预告：在 Message State 之上，我们将进入 Memory 设计——如何让 Agent 跨会话记住用户，而不只是记住这一单任务。

---

## 📋 本日知识点清单

- [ ] System / User / Assistant / Tool 四种消息类型
- [ ] Tool Call / Tool Result / Assistant 消息的处理
- [ ] Agent 跑多轮后的 Context 构成
- [ ] 模型应该看到什么、不应该看到什么
- [ ] 消息的顺序与角色管理

## 📝 实践练习

设计消息管理方案，模拟 Agent 跑 10 轮后的完整消息列表。

---

*本文是「AI Agent 工程师」6 个月学习计划的一部分。学习路线：LLM → Inference → Runtime → Harness → Memory → Environment → Evaluation → Production。目标：Agent / AI Systems Engineer。*
