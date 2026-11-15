---
title: "AI Agent 工程师 Day 57：Context 到底是什么：从消息到上下文工程"
date: 2026-11-15 10:30:00
tags:
  - AI Agent 工程师
  - Context
  - Context Engineering
  - Agent
categories:
  - AI Agent 工程师学习计划
  - M3 Context + Memory + Retrieval
description: "Day 57/168 | M3 Context 概念重塑 | Context 到底是什么：从消息到上下文工程。6 个月从 LLM 到生产级 Agent 系统的完整学习路线。"
keywords: "AI Agent, 工程师, Context 概念重塑, Context, Context Engineering, Agent"
author: OpenClaw Agent Learning
---

# AI Agent 工程师 Day 57：Context 到底是什么：从消息到上下文工程

> **6 个月学习计划** | M3 - Context + Memory + Retrieval | Day 57/168
> 
> **今日主题**: Context 概念重塑

---

# Context 到底是什么：从消息到上下文工程

## 开篇结论

**Context（上下文）不是“聊天记录”，而是 Agent 在每一次 LLM 调用时，主动组装并投喂给模型的全部信息。** 它由 System Prompt、对话历史、工具调用结果、系统状态、长期记忆、环境信息等多个来源动态拼装而成，最终填满那个有限的 Context Window（上下文窗口）。

关键认知有三条：**Conversation ≠ Context**（对话只是上下文的一个子集）；**Memory ≠ Context**（记忆是被检索后按需注入的，不是常驻的）；**Context ≠ Prompt**（Prompt 是你写的指令，Context 是模型实际看到的完整输入）。

一旦你把 Context 视为 Agent 的**核心稀缺资源**——就像内存之于操作系统、预算之于项目经理——你的 Agent 设计观会发生根本转变：每一次调用都是一次资源分配决策，Context Engineering（上下文工程）就是这门资源管理的学问。

---

## 背景与动机

### 为什么第 57 天要学这个

在前 8 周的学习中，你可能已经写过 Coding Agent、调用过工具、实现过 RAG。你大概率遇到过这样的困境：

- Agent 跑到第 20 轮，突然“失忆”，忘了最初的任务目标；
- 工具返回了一大坨 JSON，塞进对话后模型注意力被稀释，回答质量骤降；
- 你想把所有历史都保留，但 Context Window 装不下；想裁剪，又不知道裁什么。

这些问题的共同根源是：**你把对话历史当成了上下文的全部，而没有系统性地设计 Context**。

M3 阶段（第 9-16 周）的主题是 Agent 系统架构与高级工程实践。而 Context Engineering 是整个阶段的**地基**——Anthropic 在 2024 年底将其明确定义为“构建动态系统所需的一套技能与技术”，并指出它正在取代简单的 Prompt Engineering 成为 Agent 时代的核心能力。不理解 Context 的本质，后面学习 Multi-Agent 编排、长时程记忆、工具调用优化都会是空中楼阁。

一句话定位：**Prompt Engineering 教你怎么跟模型说话，Context Engineering 教你决定让模型看到什么。**

---

## 核心内容

### 知识点一：Context 的真实构成——七种信息源汇成一条输入流

让我们从一次真实的 LLM API 调用说起。当你发送请求时，模型接收到的不是“你的问题”，而是一个完整的输入序列。这个序列由七类信息源拼装而成：

```
System Prompt ─┐
User Message  ─┤
Conversation  ─┤   Context        LLM
Tool Results  ─┼────────────►  (Attention over
State         ─┤   Assembly        all tokens)
Memory        ─┤
Environment   ─┘
```

逐一拆解：

1. **System Prompt（系统提示）**：身份、规则、输出格式约束。通常每轮固定，是 Context 的“常量区”。
2. **User Message（用户输入）**：本轮新增的指令或问题。
3. **Conversation（对话历史）**：之前的多轮交互，包括 assistant 的回复。
4. **Tool Results（工具结果）**：函数返回值、文件内容、搜索结果——Agent 场景下往往**体积最大**的部分。一个 `read_file` 可能返回数千 token。
5. **State（状态）**：当前任务进度、待办列表、中间变量。ReAct Agent 的 Scratchpad（草稿纸）就属于此类。
6. **Memory（记忆）**：从长期记忆库中**检索**出来的相关信息，跨会话存在，按需注入。
7. **Environment（环境信息）**：当前时间、工作目录、可用工具列表、用户偏好等运行时元数据。

**关键洞察在于：这七类信息源没有一个是“自动”进入 Context 的，每一个都需要你的代码显式决策。** 对话历史要决定保留几轮、怎么摘要；工具结果要决定截断还是全量放入；记忆要决定检索什么、注入多少 token。这就是 Context Engineering 的日常。

很多工程师的误区是把 2 和 3（即“聊天记录”）等同于 Context，结果工具结果爆炸时束手无策——因为他们从未把工具结果视为需要管理的 Context 资产。

### 知识点二：三个“≠”——厘清最容易混淆的概念边界

用一张表建立精确的概念边界：

| 对比项 | 概念 A | 概念 B | 核心区别 |
|--------|--------|--------|----------|
| Conversation vs Context | 对话历史 | 上下文 | 对话是**数据源**，Context 是**组装结果**；Context 可包含零轮对话（如单次工具调用验证） |
| Memory vs Context | 长期记忆 | 上下文 | Memory 是**持久化存储**，Context 是**瞬时输入**；记忆必须经过检索才能成为 Context 的一部分 |
| Prompt vs Context | 提示词 | 上下文 | Prompt 是你**写的**，Context 是模型**看到的**；Context = Prompt + 拼装的一切 |

逐条建立工程直觉：

**Conversation ≠ Context**：想象一个 Agent 执行了 50 步任务，每步都有工具调用。对话历史可能有 10 万 token，但 Context Window 只有 12.8 万——你必须裁剪、压缩、摘要，最终放入的才是 Context。反过来，你也可以在没有任何对话的情况下构造 Context（比如只放 System Prompt + 一份检索文档，让模型做单次分析）。**Context 是一个比对话更宽、也更受限的概念：更宽在于来源多样，更受限在于受窗口硬约束。**

**Memory ≠ Context**：Memory 存在向量库、数据库或文件系统里，它是**冷数据**。只有当检索系统判断“这条记忆与当前任务相关”并把它注入请求时，它才变成 Context 的一部分。一个常见 bug 是开发者以为“写了记忆系统 Agent 就记住了”，实际上如果检索逻辑没把记忆塞进本次请求，模型对它一无所知。**记忆的召回率，本质上是记忆进入 Context 的比率。**

**Context ≠ Prompt**：这是三层中最微妙的一层。当你写 `prompt = "帮我修复这个 bug"` 时，这只是 Context 的一小片段。最终发送的可能是：System Prompt（2000 token）+ 摘要后的对话（3000 token）+ 相关文件内容（8000 token）+ 你的指令（20 token）。模型的质量取决于它看到的**全部 13020 个 token**，而不是你精心打磨的那 20 个。**优化 Prompt 而无视 Context 的其他部分，就像装修了门面却忽略了整个建筑结构。**

### 知识点三：一次 Agent 请求的 Context 解剖

让我们拿 M2 阶段的 Coding Agent 做一次“请求解剖”。假设用户说“修复 src/auth.py 里的登录 bug"，Agent 需要读文件、跑测试，然后修复。第二轮调用时，Context 大致长这样：

```python
context = {
    "system": """
    你是一个 Coding Agent。
    工具规范：... (约 500 tokens)
    代码规范：... (约 300 tokens)
    """,
    "conversation": [
        {"role": "user", "content": "修复 src/auth.py 里的登录 bug"},
        {"role": "assistant", "content": "我先读取该文件",
         "tool_calls": [{"fn": "read_file", "args": {"path": "src/auth.py"}}]},
        {"role": "tool", "content": "<1800 行源代码，约 12000 tokens>"},
        {"role": "assistant", "content": "我发现第 45 行的密码比较使用了 ==",
         "tool_calls": [{"fn": "run_tests", "args": {"module": "test_auth"}}]},
        {"role": "tool", "content": "<测试输出，约 800 tokens>"}
    ],
    "state": {"current_step": "diagnose", "files_touched": ["src/auth.py"]},
    "memory": [],  # 本例无跨会话记忆注入
    "environment": {
        "cwd": "/home/user/project",
        "available_tools": ["read_file", "write_file", "run_tests", "grep"],
        "now": "2025-01-15T10:30:00"
    }
}
```

对这次请求做一个 token 预算分析（假设窗口 128K）：

| 组成部分 | 大约 Token 占用 | 占比 | 性质 |
|----------|----------------|------|------|
| System Prompt + 工具定义 | 1,000 | 7% | 固定开销 |
| 对话轮次（含 assistant 思考） | 600 | 4% | 增量累积 |
| 工具结果（文件 + 测试输出） | 12,800 | 89% | **主要成本** |
| 状态 + 环境 | 100 | <1% | 轻量元数据 |

这个解剖揭示了 Agent Context 的一个普遍规律：**工具结果通常占据 80% 以上的 Context 体积，但信息密度往往最低。** 一个 1800 行的文件里，与 bug 相关的可能只有 30 行。这意味着 Context Engineering 的最大杠杆点不在 System Prompt 的措辞优化上，而在**工具结果的裁剪与压缩策略**上——这是很多团队踩坑后才明白的事实。

同时注意因果链：Context 越长 → 注意力被稀释（"Lost in the Middle" 现象）+ 成本线性上升 → Agent 能执行的步数越少 → 任务完成能力下降。所以 Context 管理直接决定 Agent 的**任务上限**。

### 知识点四：Context 作为 Agent 的核心资源——一种操作系统式的世界观

现在可以给出本文最重要的视角转换：**把 Context Window 当作 Agent 的“内存”，把 Context Engineering 当作 Agent 的“内存管理”。**

这个类比之所以成立，看对应关系：

| 操作系统概念 | Agent Context 对应物 |
|--------------|---------------------|
| 物理内存上限 | Context Window 大小（如 128K/200K tokens） |
| 内存分配策略 | Context Packing（上下文打包）：决定什么进、什么不进 |
| 内存换页（swap） | 摘要压缩 + 长期记忆外存：装不下的内容降级存储 |
| 缓存命中率 | 相关性检索的召回质量：注入的内容是否真正有用 |
| 内存泄漏 | 无节制累积的对话历史和工具结果 |
| 工作集 | 当前任务步骤真正需要的最小信息集合 |

基于这个世界观，Context 管理的核心决策只有两个：

**决策一：什么进入 Context（Packing 策略）**。相关性排序 → 按信息密度分配预算 → 低密度内容截断或摘要。典型策略包括：

- **Sliding Window（滑动窗口）**：只保留最近 N 轮，早期对话摘要成一段“任务简报”。
- **Selective Retention（选择性保留）**：用户指令全保留（不可再生），工具结果用后压缩（可再生——大不了再调用一次）。
- **Retrieval-on-Demand（按需检索）**：历史不进 Context，改由检索系统按当前步骤相关性动态注入。

**决策二：什么被逐出 Context（Eviction 策略）**。当接近窗口上限时的降级路径：

```
原始工具结果 → 截断（保留头尾）→ 摘要（结构化压缩）→ 外存（写入文件，需要时重新读取）
```

注意这条降级链的信息损失是递增的，所以正确的时机判断很重要：**宁可早压缩，不要等溢出。** 一旦超长导致 API 报错或被静默截断（截掉的往往是尾部——恰恰是最新、最重要的信息），损失不可控。

一个反直觉的推论：**Context 不是越多越好。** 实验反复证明，塞入无关信息会稀释注意力、降低推理质量。Context Engineering 的目标不是“填满窗口”，而是**用最小 token 集合支撑当前决策**——这与数据库查询优化的思想惊人地一致：扫描的数据越少，又快又准。

---

## 图示：Context 组装流水线

用一张 ASCII 图把整条流水线串起来，这也是你设计 Context 模块时的架构草图：

```
┌─────────────────────────────────────────────────────┐
│                  信息源              │
├──────────────┬──────────────┬───────────────────────┤
│ System Prompt│  Conversation│  Tool Results / State │
│   (常量区)    │  (裁剪/摘要)  │  Memory / Environment │
└──────┬───────┴──────┬───────┴──────────┬────────────┘
       │              │                  │
       ▼              ▼                  ▼
┌─────────────────────────────────────────────────────┐
│           Context Assembler（组装器）                │
│  1. 相关性排序     2. Token 预算分配                  │
│  3. 压缩/截断      4. 结构化拼接                     │
└──────────────────────────┬──────────────────────────┘
                           ▼
┌─────────────────────────────────────────────────────┐
│        Context Window（受限资源，如 128K）           │
│  [System][简报][近3轮][压缩后的工具结果][检索记忆]   │
└──────────────────────────┬──────────────────────────┘
                           ▼
                       LLM 推理
                           │
              ┌────────────┴────────────┐
              ▼                         ▼
        工具调用结果               最终回答
              │
              ▼
    ┌──────────────────────┐
    │  Eviction / Archive  │──► 长期记忆库（外存）
    │  (降级与归档策略)     │──► 会话持久化存储
    └──────────────────────┘
```

配套的最小 Context 数据结构设计：

```python
from dataclasses import dataclass, field
from typing import Any

@dataclass
class ContextBlock:
    """Context 的最小管理单元：来源 + 内容 + 优先级 + 可压缩性"""
    source: str            # system | conversation | tool | state | memory | env
    content: Any
    priority: int          # 驱逐时的排序依据，越小越先被逐出
    compressible: bool     # 工具结果 True，用户原始指令 False
    token_count: int

@dataclass 
class AgentContext:
    blocks: list[ContextBlock] = field(default_factory=list)
    max_tokens: int = 128_000
    
    def pack(self) -> list[dict]:
        """Packing：按优先级降序填充，超预算时对可压缩块降级"""
        total = sum(b.token_count for b in self.blocks)
        if total > self.max_tokens:
            for b in sorted(self.blocks, key=lambda x: x.priority, reverse=True):
                if not b.compressible:
                    continue
                b.content = summarize(b.content)   # 压缩降级
                b.token_count = count_tokens(b.content)
                if sum(x.token_count for x in self.blocks) <= self.max_tokens:
                    break
        return [b.to_message() for b in self.blocks]  # 转为 API messages 格式
```

这个设计的核心思想是：**Context 不是一坨字符串，而是一组带元数据的、可调度、可压缩的结构化块。** 这为后续的智能裁剪、A/B 测试不同 Packing 策略打下基础。

---

## 实践练习与思考题

### 实践：解剖你的 M2 Coding Agent

1. **统计 Context 构成**：在你的 Coding Agent 中加入埋点，记录每次 LLM 调用各类信息源的 token 占用，跑一个多步任务（如“修复项目里的 3 个测试失败”），输出类似上文预算表的报告。
2. **找出毒瘤块**：找出占用最大但信息密度最低的 Context 块（大概率是某个工具结果），实现针对性压缩（如文件读取只返回相关函数 ± 20 行）。
3. **实现 Context 数据结构**：把上面的 `AgentContext` 类落地到你的 Agent 中，实现 `pack()` 方法，验证长任务下不再超窗。
4. **对比实验**：同一任务，跑“全量 Context” vs “压缩 Context”两个版本，对比任务成功率、token 成本、平均步数。

### 思考题

1. 如果一个 Agent 的对话历史被完全摘要成 200 token 的简报，但任务成功率不降，这说明了什么？反过来说明什么时候摘要会失败？
2. 用户原始指令为什么应该标记为 `compressible=False`？是否存在例外（提示：超长粘贴的场景）？
3. Multi-Agent 系统中，子 Agent 完成任务后，向父 Agent 汇报的内容应该如何设计，才能在最小化 Context 占用的同时保留决策所需信息？

---

## 与 Agent Engineering 的关联

Context Engineering 在真实 Agent 系统中的地位，可以概括为“**三个决定**”：

1. **决定成本上限**：Agent 的推理成本 ≈ 调用次数 × 平均 Context 长度。工业界 Agent 的 token 开销大头几乎总在 Context 组装，而不是输出。优化 Packing 策略可以直接砍掉 50%+ 的成本。
2. **决定能力上限**：长时程任务（跑 100 步不崩）、复杂代码库理解（读 50 个文件不失焦）这些“高级能力”，本质上不是模型能力问题，而是 Context 管理问题。Claude Code 等顶级 Coding Agent 的核心竞争力之一就是精细的工具结果裁剪。
3. **决定架构形态**：Context 装不下 → 诞生了 RAG（检索外置知识）、Memory 系统（对话外置历史）、Multi-Agent（分摊上下文）、Sub-Agent 隔离（临时上下文用完即弃）。**你熟悉的几乎所有 Agent 架构模式，都是对 Context 稀缺性的响应。**

往后续学习路线看：M3 的记忆系统设计（本质是 Context 的外存管理）、Multi-Agent 编排（本质是 Context 的分治）、Context Compaction 技术（Claude 的自动摘要机制）——全部建立在本周的 Context 概念模型之上。**理解了 Context 是核心资源，你就拿到了理解一切 Agent 架构的钥匙。**

---

## FAQ

**Q1：Context Window 越大（比如 1M token），Context Engineering 还有必要吗？**

有必要，且理由有三：成本随长度线性增长；注意力稀释问题不因窗口大而消失（长 Context 中部信息的召回率显著下降，即 "Lost in the Middle"）；无限堆 Context 会让模型被无关信息干扰。大窗口改变的是“何时需要压缩”的阈值，而不是“需要管理”这一事实——正如内存变大不意味着操作系统可以取消内存管理。

**Q2：RAG 和 Context Engineering 是什么关系？**

RAG 是 Context Engineering 的一种具体实现策略。RAG 解决的问题是“哪些外部知识应该被注入 Context”，它是 Packing 决策中“Memory/知识源如何进入 Context”这一子问题的方案。Context Engineering 是上位概念，覆盖的范围更广（工具结果裁剪、对话摘要、状态注入都不属于传统 RAG）。

**Q3：工具结果应该全量放入还是截断？有没有通用原则？**

通用原则是**可再生内容可激进压缩，不可再生内容必须保留**。工具结果理论上可以通过再次调用再生，所以可以放心截断、摘要，代价只是多一次调用。而用户的原始输入、模型的推理结论是不可再生的，应优先保留。此外优先采用“结构化提取”（只保留字段而非原始输出）而非粗暴截断。

**Q4：Conversation 和 Context 的区别，能用一句话说清吗？**

对话是你**拥有**的历史数据，Context 是模型**看到**的本次输入。对话可以 10 万 token，Context 只有窗口大小；模型只对 Context 里的内容负责——没进 Context 的对话历史，对模型而言等于没发生过。

**Q5：实践中最常见的一个 Context 错误是什么？**

把工具的原始返回值不经处理直接 append 到消息列表。这会导致 Context 被低密度内容撑爆，长任务必然崩溃。正确做法是给每个工具定义“返回值进入 Context 的策略”：截断长度、提取字段、超长落盘后返回文件引用。一个简单的 `grep` 结果清洗，就能把 token 占用降低一个数量级。

---

## 参考资料

- Anthropic Blog: *Effective Context Engineering for AI Agents* — 提出 Context Engineering 取代 Prompt Engineering 的系统性论述
- Anthropic Blog: *Effective Agents* — Agent 设计模式与 Sub-Agent 上下文隔离实践
- Lilian Weng: *LLM Powered Autonomous Agents* — Agent 记忆与上下文架构的经典综述
- LangChain Blog: *Context Engineering* — 系统一级上下文组装的工程视角
- Microsoft: *Magnetic-One / AutoGen 文档* — Multi-Agent 中的上下文传递设计
- 论文：*"Lost in the Middle: How Language Models Use Long Contexts"* — 长上下文注意力衰减的实证研究

---

## 📋 本日知识点清单

- [ ] System Prompt + User + Conversation + Tool Results + State + Memory + Environment → Context → LLM
- [ ] Conversation ≠ Context, Memory ≠ Context, Context ≠ Prompt
- [ ] Agent 请求的 Context 构成分析
- [ ] Context 作为 Agent 的核心资源

## 📝 实践练习

统计 M2 Coding Agent 的 Context 构成，设计 Context 数据结构。

---

*本文是「AI Agent 工程师」6 个月学习计划的一部分。学习路线：LLM → Inference → Runtime → Harness → Memory → Environment → Evaluation → Production。目标：Agent / AI Systems Engineer。*
