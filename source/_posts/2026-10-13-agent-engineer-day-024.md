---
title: "AI Agent 工程师 Day 24：比较三种架构：我的 Runtime vs LangGraph vs AutoGen"
date: 2026-10-13 10:30:00
tags:
  - AI Agent 工程师
  - 架构对比
  - LangGraph
  - AutoGen
  - Runtime
categories:
  - AI Agent 工程师学习计划
  - M1 LLM + Agent Runtime
description: "Day 24/168 | M1 架构对比与取舍 | 比较三种架构：我的 Runtime vs LangGraph vs AutoGen。6 个月从 LLM 到生产级 Agent 系统的完整学习路线。"
keywords: "AI Agent, 工程师, 架构对比与取舍, 架构对比, LangGraph, AutoGen, Runtime"
author: OpenClaw Agent Learning
---

# AI Agent 工程师 Day 24：比较三种架构：我的 Runtime vs LangGraph vs AutoGen

> **6 个月学习计划** | M1 - LLM + Agent Runtime | Day 24/168
> 
> **今日主题**: 架构对比与取舍

---

# 比较三种架构：我的 Runtime vs LangGraph vs AutoGen

**核心结论（先说答案）**：没有“最好”的 Agent 架构，只有“取舍是否匹配场景”的架构。自己手写的 Runtime 换来的是完全的控制权和极低的抽象成本，代价是分布式、持久化、多 Agent 协作等基础设施都要自己造轮子；LangGraph 用“图 + 显式状态机”换取确定性和可恢复性，适合生产级工作流；AutoGen 用“对话式多 Agent”换取灵活的角色协作，代价是控制流不确定性高、调试更难。理解这三者的差异，本质上是理解一个核心问题：**你把复杂性放在哪里？**（控制流里、状态里，还是对话里。）本文通过 State / Tool / Execution / Checkpoint / Streaming / Human Loop / Multi Agent 七个维度对比三种实现，帮你建立架构判断能力。

---

## 一、背景与动机：为什么第 24 天要学这个

在前 23 天里，你已经从零实现了一个自己的 Agent Runtime：手写了 State 管理、工具调用循环、Checkpoint 持久化、流式输出，甚至尝试了多 Agent 协作。现在是时候“抬头看路”了。

这放在 6 个月 AI Agent 工程师路线的 **M1 第 4 周**，不是偶然。原因有三个：

1. **你刚具备对比的资格**。没写过 Runtime 的人对比框架，只能复述文档；写过的人对比框架，看到的是“这个设计选择我做过，他选了另一条路，为什么？”——这才是架构学习的正确姿势。

2. **框架选型是 Agent 工程师的日常决策**。真实工作中，你会不断被问：“我们该用 LangGraph 还是 AutoGen？还是自己写？”没有架构判断能力的人只能引用社区评价，有判断能力的人能从业务约束倒推技术选型。

3. **框架会过时，取舍逻辑不会**。LangGraph 和 AutoGen 的 API 一年后可能大改，甚至被新框架取代（就像 AutoGen 0.2 到 0.4 的重构），但“状态放哪里、控制流归谁、错误怎么恢复”这些设计维度是永恒的。

一句话：这一天的目标是**从“会写”升级到“会判断”**。

---

## 二、先建立心智模型：三种架构的“复杂性放在哪里”

在逐维度对比之前，先给一个统一的解释框架。所有 Agent 框架的差异，本质上都是对同一个问题的不同回答：

> **Agent 系统的三种复杂性——控制流复杂性、状态复杂性、协作复杂性——你把每一种放在哪里管理？**

```plaintext
                你的 Runtime          LangGraph             AutoGen
控制流          写在 while 循环里      写在图的边和条件里      隐含在对话协议里
状态            自定义数据结构        显式共享 State 对象     分布在各 Agent 的
                                                             消息历史中
协作            自己写编排代码        图节点天然组合          对话即协作
```

- **你的 Runtime**：一切显式。循环怎么转、状态怎么变，都是你写的代码。控制力和认知负担都最大。
- **LangGraph**：把控制流“图化”。节点是函数，边是转移规则，State 是全局共享的单一数据源（Single Source of Truth）。它强制你把隐式的 Agent 逻辑变成显式的状态机。
- **AutoGen**：把控制流“对话化”。Agent 之间通过消息交互，协作模式（如 GroupChat）决定谁接话。控制流是涌现的，不是声明的。

记住这个模型，下面七个维度的对比都是它的推论。

---

## 三、七个维度逐一对比

### 3.1 State（状态管理）

| 维度 | 你的 Runtime | LangGraph | AutoGen |
|---|---|---|---|
| 状态形态 | 自定义类/dict | 显式共享 State（TypedDict/Pydantic） | 消息历史 + Agent 内部状态 |
| 更新方式 | 直接赋值 | Reducer 函数声明式合并 | 依赖消息传递隐式同步 |
| 一致性保证 | 自己实现 | 框架保证（每步 superstep 后合并） | 无全局保证 |

**关键取舍**：LangGraph 的 Reducer 机制值得展开讲。State 更新不是“覆盖”，而是你声明的合并函数：

```python
from typing import Annotated
from typing_extensions import TypedDict
import operator

class AgentState(TypedDict):
    # 每个 superstep 结束后，新消息用 add 合并而非覆盖
    messages: Annotated[list, operator.add]
    # 普通字段则默认覆盖
    current_step: str
```

这个设计的因果链是：**并行节点可能同时写 State → 覆盖会丢数据 → 所以更新必须是可声明的纯函数 → 所以框架可以确定性重放**。你的 Runtime 里，State 就是一个普通对象，怎么改都行——灵活，但框架无法帮你推理“这一步之后状态是什么”。

AutoGen 则走另一个极端：没有全局 State，事实的“状态”散落在对话历史里。好处是简单直观，坏处是**长对话后状态提取要靠 LLM 自己读历史**，既贵又不可靠。

**判断标准**：状态结构复杂、需要精确控制的应用（如数据处理管道），LangGraph 显式 State 明显占优；纯对话场景，AutoGen 的消息即状态反而更自然。

### 3.2 Tool（工具调用）

| 维度 | 你的 Runtime | LangGraph | AutoGen |
|---|---|---|---|
| 注册方式 | 自己解析 function calling | `@tool` 装饰器 / ToolNode | `register_for_llm` + `register_for_execution` |
| 执行方 | 你的循环 | 图内节点 | 指定的 Executor Agent |
| 调用与执行解耦 | 否（自己实现） | 部分 | 是（Agent 角色分离） |

有趣的分野：AutoGen 的设计哲学是**调用者和执行者分离**——一个 Agent 声明工具（给 LLM 看 schema），另一个 Agent 执行工具。这在多 Agent 场景下有优势（比如执行 Agent 可以加权限控制），但在单 Agent 场景是过度设计。你的 Runtime 和 LangGraph 都是调用与执行一体，更简单直接。

**工程直觉**：工具层的差异最小——因为工具调用协议（OpenAI function calling 格式）已经是事实标准。真正拉开差距的是下一层：执行失败后怎么办。

### 3.3 Execution（执行模型）

| 维度 | 你的 Runtime | LangGraph | AutoGen |
|---|---|---|---|
| 循环逻辑 | 手写 while + tool_calls | 图的遍历（含条件边、循环） | 对话轮次驱动 |
| 并行执行 | 自己实现（asyncio） | 原生支持（同一 superstep 多节点并行） | GroupChat 轮转，真并行需额外设计 |
| 错误处理 | 自己写 try/except + 重试 | 内置重试、fallback 边 | 靠对话中的错误信息协商 |

这是**控制流不确定性**的分水岭。画个图感受执行模型的差异：

```plaintext
你的 Runtime:      while True ──► LLM ──► 有 tool_calls? ──► 执行 ──┐
                        ▲                                          │
                        └──────────────────────────────────────────┘

LangGraph:         [START] ──► agent ──(条件边)──► tools ──┐
                        ▲                                  │
                        └──────────────────────────────────┘
                   （条件边是声明的，可静态分析出所有可能路径）

AutoGen:           UserProxy ◄──消息──► Assistant ◄──消息──► ...
                   （谁下一轮说话由 GroupChat manager 决定，动态涌现）
```

你的 Runtime 和 LangGraph 的循环是**可静态分析的**——你能在运行前画出所有可能的执行路径。AutoGen 的对话循环是**运行时涌现的**——LLM 决定说给谁听，路径组合爆炸。这就是为什么 LangGraph 适合需要审计的金融/医疗场景，而 AutoGen 适合探索性任务（研究、头脑风暴）。

### 3.4 Checkpoint（持久化与恢复）

| 维度 | 你的 Runtime | LangGraph | AutoGen |
|---|---|---|---|
| 机制 | 自己序列化 State 到磁盘/DB | 内置 Checkpointer（Memory/SQLite/Postgres） | 无一等公民支持，需自己封装 |
| 恢复粒度 | 自定义 | 每个 superstep 自动存档 | 手动保存消息历史 |
| 时间旅行 | 自己实现很痛苦 | 支持（从任意 checkpoint 分叉重放） | 不支持 |

**LangGraph 在这个维度的优势是结构性的，不是实现性的。** 因果链是：显式 State + 声明式 Reducer + 图结构 → 每个 superstep 的状态变化是确定的 ��� 所以自动 checkpoint 是“顺带”的能力。你的 Runtime 想做到同样的事，必须先回答“什么算状态的一部分？”——所有手工循环里闭包捕获的变量、对话中间态，都是坑。

我自己的 Runtime 实现 checkpoint 时踩的最大坑就是：State 里混进了不可序列化的对象（open file handle、lambda）。LangGraph 通过强制 State 是纯数据结构（TypedDict/Pydantic）从根上消灭了这类问题。**约束换来可靠性**——这是框架价值的典型样本。

### 3.5 Streaming（流式输出）

| 维度 | 你的 Runtime | LangGraph | AutoGen |
|---|---|---|---|
| Token 级流式 | 自己接 SSE | 支持（`stream_mode="messages"`） | 支持，但多 Agent 下事件流较嘈杂 |
| 状态级流式 | 无 | 支持（每步 State 变化可订阅） | 无 |
| 事件语义 | 自己定义 | 统一事件模型 | 消息即事件 |

你的 Runtime 里，流式意味着自己维护一个 SSE 管道，把 LLM 的 delta 和工具执行事件混排后推给前端——需要自己设计事件协议。LangGraph 提供了多种 `stream_mode`（values / updates / messages），本质上是**把你手写的事件协议标准化了**。多 Agent 场景下这很重要：前端需要知道“这条 token 是哪个 Agent 说的”，统一事件模型省掉了大量胶水代码。

### 3.6 Human-in-the-Loop（人机协作）

| 维度 | 你的 Runtime | LangGraph | AutoGen |
|---|---|---|---|
| 机制 | 自己实现暂停/恢复 | `interrupt()` + Checkpoint 原生配合 | `UserProxyAgent` 人工介入对话 |
| 恢复方式 | 自己持久化后重启 | 从断点继续，可修改 State | 对话中插一轮人类输入 |
| 状态修改 | 手动 | 支持人工编辑 State 后继续 | 只能通过追加消息影响 |

这是**最能体现架构哲学差异**的维度。LangGraph 的 `interrupt()` 利用了它的 checkpoint 机制：暂停 = 存一个 checkpoint，恢复 = 从 checkpoint 继续，还能在恢复前人工修改 State。这是“状态机”架构的免费午餐。AutoGen 的人工介入是“往对话里塞一条人写的消息”——简单，但无法精确修改内部状态。你的 Runtime 里这就是一个分布式两阶段提交问题的简化版：暂停时进程内状态怎么办、恢复时怎么对齐，全靠你自己设计。

**判断标准**：审批流、人工审核类应用（如合同审查 Agent），LangGraph 的 interrupt 模型几乎是必选。

### 3.7 Multi-Agent（多 Agent 协作）

| 维度 | 你的 Runtime | LangGraph | AutoGen |
|---|---|---|---|
| 编排方式 | 手写编排代码 | Supervisor / 图嵌套（子图） | GroupChat / 对话协议 |
| 控制方式 | 代码控制 | 结构控制（图） | 语义控制（LLM 决定谁说话） |
| 确定性 | 高 | 高 | 低 |
| Agent 间通信 | 自定义 | 共享 State / 消息 | 对话消息 |

**这是 AutoGen 的主场**。它的 GroupChat 模式让 Agent 像开会一样自发协作，适合角色分工模糊、需要“讨论”的任务（如：一个写代码、一个 review、一个测试，互相迭代）。LangGraph 的多 Agent 是**结构化的**：Supervisor 图决定调度，子图封装团队——适合流程清晰的组织型任务（如：先检索、再生成、再审核的流水线）。

一个类比：**AutoGen 是自发团队协作，LangGraph 是带组织架构的分工**。前者灵活但难管理，后者可控但设计成本高。你的手写 Runtime 做多 Agent，相当于你亲自当 CEO 给每个 Agent 发消息——控制力最强，但每加一个 Agent 都是体力活。

---

## 四、全景对比表与场景判断

### 4.1 七维度总表

| 维度 | 你的 Runtime | LangGraph | AutoGen |
|---|---|---|---|
| **State** | 自定义，全手工 | 显式共享 + Reducer | 消息历史隐式承载 |
| **Tool** | 手写解析与执行 | 装饰器注册，一体化 | 调用/执行角色分离 |
| **Execution** | 手写循环 | 图遍历，可静态分析 | 对话轮次驱动，动态涌现 |
| **Checkpoint** | 自己造轮子 | 内置，自动 superstep 存档 | 弱，需自封装 |
| **Streaming** | 自定义事件协议 | 多模式标准事件流 | 有，多 Agent 下较嘈杂 |
| **Human Loop** | 全手工实现 | interrupt + 状态修改，最强 | 对话中人工插话 |
| **Multi Agent** | 手写编排 | 结构化（Supervisor/子图） | 对话式协作，最灵活 |

### 4.2 适用场景判断

| 场景 | 推荐 | 原因 |
|---|---|---|
| 需求极简单（单 Agent、few tools） | 自写 Runtime | 引入框架是负收益 |
| 生产级、需审计、可恢复 | LangGraph | checkpoint + 确定性图 |
| 人工审批/编辑流 | LangGraph | interrupt 是结构性优势 |
| 研究探索、多角色讨论 | AutoGen | 对话式协作摩擦最低 |
| 极致性能/特殊运行时约束 | 自写 Runtime | 无框架抽象税 |
| 原型验证、快速试错 | AutoGen | 上手最快 |
| 大规模多 Agent 组织 | LangGraph（Supervisor） | 结构化编排可管理 |

---

## 五、实践练习与思考题

**练习（必做）**：把下表补全——针对你第 23 天自己实现的 Runtime，在每个维度写下“我做了什么 / 我没做什么 / 框架替我做了什么 / 我需要付出的代价”：

```plaintext
| 维度      | 我的实现 | LangGraph 的方案 | 我的短板 |
|-----------|---------|------------------|---------|
| Checkpoint|         |                  |         |
| Human Loop|         |                  |         |
| ...       |         |                  |         |
```

**思考题**：

1. 你的 Runtime 如果要支持“暂停后人工修改 State 再恢复”，最少需要改哪几处代码？改完之后，它和 LangGraph 的 interrupt 还差什么？
2. 一个法律文书审查 Agent，要求每一步可审计、审批人可修改中间结论。你会选哪个架构？说出三个理由。
3. AutoGen 的 GroupChat 中，控制流由 LLM 决定。这在什么情况下是**优点**？（提示：想想任务本身无法预先流程化的场景。）

---

## 六、与 Agent Engineering 的关联

架构对比能力在实际 Agent 系统工程中直接对应三件事：

1. **技术选型答辩**。Agent 工程师进入团队的第一件事往往是“评估框架”。能用维度化对比而非“社区都说 LangGraph 好”来表达判断，是初级和资深的分水岭。

2. **故障排查的坐标系**。生产事故出现时，“控制流在哪一层”决定了你去哪里找 bug：LangGraph 的问题看图的条件和 State Reducer，AutoGen 的问题看对话协议和消息历史，自研 Runtime 的问题看自己的循环。维度模型就是你的调试地图。

3. **从框架用户到系统设计者**。M1 的尾声做这次对比，是为后续阶段（RAG 深入、评估体系、生产部署）铺路——后续你会反复遇到“这个能力该在框架层解决还是应用层解决”的问题，今天的七个维度就是回答这类问题的通用词汇表。

**明确判断**：如果你未来 80% 的工作是构建生产级 Agent 工作流，LangGraph 是投入产出比最高的主线框架；AutoGen 作为多 Agent 探索的补充学习；自写 Runtime 的经验是你能看懂另外两者源码的前提——三者不是竞争关系，是互补的教材。

---

## FAQ

**Q1：有了 LangGraph，自己写 Runtime 还有意义吗？**
A：有意义，且意义就在“学习”本身。手写 Runtime 让你理解 checkpoint 为什么要纯数据 State、为什么要声明式 Reducer——这些理解决定了你用 LangGraph 时能否快速定位问题。但生产中“重复造轮子”通常不划算，除非你有特殊运行时约束或性能要求。

**Q2：AutoGen 的控制流不可预测，是不是说明它不适合生产环境？**
A：不是“不适合”，是“适合的生产场景不同”。对话涌现式协作在探索性任务（research、代码迭代讨论）中是优点；在需要合规审计的任务中是缺点。判断标准是：**你的业务允许多大比例的执行路径不可预知？**

**Q3：LangGraph 的显式 State 会不会在复杂应用里变成一个巨大的上帝对象？**
A：会，这是它真实的代价。缓解手段是子图封装（每个子图有自己的局部 State）、State 分层设计。如果你的 State 字段超过 20 个，通常说明该拆子图了。

**Q4：三个架构在 Token 成本上差异大吗？**
A：显著。AutoGen 的对话式多 Agent 天然消耗更多 Token（Agent 间消息也是 LLM 调用），且 GroupChat manager 本身要额外调用 LLM 决定发言顺序；LangGraph 的图遍历中只有节点内是 LLM 调用，控制流零 Token 成本；自研 Runtime 成本取决于你自己的循环设计。成本敏感的批处理任务，这个差异可达数倍。

**Q5：新框架不断出现（CrewAI、OpenAI Agents SDK 等），今天学的对比逻辑会过时吗？**
A：不会。任何新框架都必须回答同样的七个问题：状态放哪、工具怎么调、控制流归谁、怎么恢复、怎么流式、人在哪、多 Agent 怎么编排。框架是流水的，维度是铁打的。

---

## 参考资料

- LangGraph 官方文档：State 管理、Checkpointers、Human-in-the-loop（https://langchain-ai.github.io/langgraph/）
- LangGraph 概念指南：Why LangGraph?（架构动机与设计取舍）
- AutoGen 官方文档：Multi-Agent Conversation 框架（https://microsoft.github.io/autogen/）
- AutoGen 0.4 架构重构说明（事件驱动架构的演进案例）
- Anthropic: Building Effective Agents（工作流 vs Agent 的取舍框架，https://www.anthropic.com/research/building-effective-agents）
- LangChain Blog: LangGraph 多 Agent 架构模式（Supervisor / Network / Hierarchical）

*—— 第 24 天学习笔记，M1 第 4 周。明天开始：把架构判断能力应用到具体场景选型中。*

---

## 📋 本日知识点清单

- [ ] 三种实现在 State / Tool / Execution / Checkpoint / Streaming / Human Loop / Multi Agent 的对比
- [ ] 不追求谁"最好"而是理解架构取舍
- [ ] 不同设计选择的适用场景
- [ ] 形成架构判断能力
- [ ] 对比表格的制作

## 📝 实践练习

制作三种架构的对比表格（7 个维度），分析各自取舍。

---

*本文是「AI Agent 工程师」6 个月学习计划的一部分。学习路线：LLM → Inference → Runtime → Harness → Memory → Environment → Evaluation → Production。目标：Agent / AI Systems Engineer。*
