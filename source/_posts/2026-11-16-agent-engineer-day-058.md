---
title: AI Agent 工程师 Day 58：Token Budget：有限上下文的预算分配
tags:
  - AI Agent 工程师
  - Token Budget
  - Context
  - Agent
categories:
  - AI Agent 工程师学习计划
  - M3 Context + Memory + Retrieval
description: >-
  Day 58/168 | M3 Token 预算 | Token Budget：有限上下文的预算分配。6 个月从 LLM 到生产级 Agent
  系统的完整学习路线。
keywords: 'AI Agent, 工程师, Token 预算, Token Budget, Context, Agent'
author: OpenClaw Agent Learning
abbrlink: 37855
date: 2026-11-16 10:30:00
---

# AI Agent 工程师 Day 58：Token Budget：有限上下文的预算分配

> **6 个月学习计划** | M3 - Context + Memory + Retrieval | Day 58/168
> 
> **今日主题**: Token 预算

---

# Token Budget：有限上下文的预算分配

**核心结论（TL;DR）**：LLM Agent 的上下文窗口（Context Window）是一种稀缺资源。Token Budget（令牌预算）就是把有限的上下文当作财务预算来管理——按优先级给 System Prompt、对话历史、工具定义、长期记忆、工具观测结果分配额度，并在运行时动态检查、压缩、降级。一句话建立直觉：**上下文不是无限笔记本，而是一张会自动作废的信用卡，你必须学会记账**。没有预算管理的 Agent，要么因超限崩溃，要么因历史膨胀而性能退化（"lost in the middle"），要么成本失控。本文给出完整的预算公式、分配策略、动态调整机制与降级方案，并附可运行的参考实现。

---

## 一、背景与动机

### 1.1 为什么这是 M3 第 1 周的第一课

在 6 个月 AI Agent 工程师路线中，M1/M2 阶段解决的是“单次调用怎么写好”（Prompt、Function Calling、ReAct 循环）。进入 M3，Agent 从“一次性对话”变成“长时运行系统”——多轮任务、多工具调用、跨会话记忆。此时第一个撞上的墙就是：**上下文窗口是有限的**。

这不是边缘问题，而是 Agent Runtime 设计的核心约束。LangGraph、AutoGen、OpenAI Assistants 等框架的存储与线程管理机制，本质都是在解决这个问题。

### 1.2 问题的因果链

```
任务变长 → 历史消息累积 → 上下文逼近上限
    ├─→ 硬超限：API 报错 400，Agent 直接崩溃
    ├─→ 软超限：截断历史，丢失关键任务目标，行为退化
    ├─→ 长上下文性能衰减：中间信息被忽略（lost in the middle）
    └─→ 成本爆炸：每次调用都携带全部历史，费用线性增长
```

Token Budget 管理就是在链条最上游干预：**在超限发生之前，主动决定“什么值得留在上下文里”**。

---

## 二、核心内容

### 2.1 预算公式：Total Context 的六大组成部分

**Token Budget（令牌预算）** 的核心公式：

```
Total Context = System + History + Tools + Memory + Observation + Reserved
```

各组件含义与优先级：

| 组件 | 英文 | 内容 | 典型占比 | 优先级 |
|------|------|------|---------|--------|
| System | System Prompt | 角色定义、规则、输出格式约束 | 5%–15% | 最高（不可压缩） |
| Tools | Tool Definitions | 函数签名、参数 Schema、描述 | 10%–30% | 高（可按需加载） |
| Memory | Long-term Memory | RAG 检索结果、用户画像、笔记 | 5%–20% | 中（相关性排序） |
| History | Conversation History | 多轮对话消息、中间推理步骤 | 20%–40% | 中（可摘要压缩） |
| Observation | Tool Observations | 工具返回结果（网页、日志、代码） | 10%–50% | 低（最易膨胀） |
| Reserved | Reserved Buffer | 预留给模型输出的空间 | 视 max_tokens 而定 | 必须保留 |

**关键洞察**：最容易爆炸的是 Observation。一次网页抓取或一次 SQL 查询结果，动辄几千 token；而 System 和 Tools 虽然单次不大，但是每轮都重复支付的“固定成本”。工程直觉是：**固定成本要精简，可变成本要设上限**。

Reserved（预留区）常被新手忽略：如果上下文塞满，模型没有生成空间，`max_tokens` 会被强制截断，导致输出残缺。预留区 = max_output_tokens + 安全余量（建议 10%）。

### 2.2 预算设计与动态调整

预算不是写死的常量，而是**随任务阶段动态变化的分配策略**。

**设计三原则：**

1. **按优先级分配，而非平均分配**。System 和 Tools 是 Agent 的“操作系统”，永远优先保障；History 和 Observation 是“工作数据”，可牺牲。
2. **分阶段调整配额**。任务早期（规划阶段）History 占比高；执行阶段 Observation 暴涨，此时应压缩早期历史为摘��；收尾阶段释放工具定义，腾出空间给最终推理。
3. **软预算 + 硬预算双层检查**。软预算（如 80%）触发压缩动作（摘要、截断），硬预算（如 95%）触发降级动作（丢弃、降级回答）。永远不要等到 100% 才处理——那时你已没有操作空间。

**动态调整的触发机制：**

```
每个 Agent Loop 迭代：
  1. 计算当前各组件实际 token 占用（tiktoken 精确计数）
  2. total = Σ components
  3. if total > soft_limit: 执行压缩管线
  4. if total > hard_limit: 执行降级策略
  5. 若持续超限 → 调整下一轮的预算配额（负反馈调节）
```

注意 token 计数必须精确。用 `tiktoken` 对每条消息计数，而不是字符数 ÷ 4 的粗略估计——多轮累积后误差会吃掉你的安全余量。另外，各 API Provider 对消息有额外开销（如 OpenAI 每条消息约 4 个 overhead token，工具定义还包 JSON 结构成本），实测校准优于理论计算。

### 2.3 不同组件的 Token 消耗分析

理解各组件的“消耗模型”是优化的前提：

| 组件 | 消耗模式 | 优化手段 |
|------|---------|---------|
| System Prompt | 固定成本，每轮全额支付 | 精简措辞；用简写格式代替 JSON Schema |
| Tool Definitions | 准固定成本，随工具数量线性增长 | 工具分组 + 按需注入（Toolset Routing） |
| History | 累积成本，随轮数线性增长 | 滚动摘要、保留首尾、删除低价值轮次 |
| Memory | 检索成本，随 top_k 波动 | 相关性阈值过滤、压缩为事实卡片 |
| Observation | 突发成本，单次可达数千 token | 响应截断、结果摘要、引用替换 |
| Reserved | 恒定预留 | 合理设置 max_tokens |

几个容易踩的坑：

**坑一：工具定义的隐性成本。** 一个带完整 docstring 的工具定义约 100–300 token。注册 20 个工具就是 2000–6000 token 的固定税。解法是工具路由：先让模型从工具目录选择领域，再只注入该领域的工具定义。

**坑二：观测结果的复利效应。** 10 轮工具调用，每轮返回 2000 token 的原始网页，累积 20000 token——其中 90% 是无用噪声。工具层应做“返回预算”：工具内部先摘要/截断，再返回。

**坑三：History 的价值不均。** 早期轮次包含任务目标（高价值），中间轮次多是机械的“调用-返回”（低价值）。压缩策略应识别价值密度，而非简单丢弃最老的轮次——丢弃第 1 轮的任务描述是灾难性的。

### 2.4 预算超限时的降级策略

降级策略是一套有顺序的牺牲方案，从损失最小到损失最大：

```
降级阶梯（依次尝试）：
L1. 截断：对单个 Observation 做长度截断（保留首尾 + 中间省略标记）
L2. 摘要：用小模型把旧 History 压缩为摘要（保留任务目标）
L3. 卸载：把 Memory/History 移出上下文，存入外部存储（RAG），需要时检索
L4. 减载：移除非当前任务域的 Tool Definitions
L5. 换轨：切换到长上下文模型（如 128K → 200K）
L6. 最小化：仅保留 System + 当前任务描述 + 最近 1 轮，重新开始
L7. 拒答：明确告知用户任务超出处理能力，请求分步
```

设计降级策略的关键：**可逆的先做，不可逆的后做**。截断和摘要可恢复（原始数据在外部存储），卸载工具定义下一轮可重新加载，而“重置对话”会永久丢失状态，必须作为最后手段。

另一个工程要点：降级要**对用户透明**或至少可观测。Agent 应在 trace 中记录“何时触发了什么级别的降级”，否则调试性能退化时无从下手。

---

## 三、架构图与参考实现

### 3.1 Token Budget 管理器架构

```
┌─────────────────────────────────────────────────┐
│                Agent Runtime Loop                │
│                                                  │
│  ┌──────────┐    ┌──────────────────────────┐  │
│  │ 任务输入  │───▶│   Budget Manager         │  │
│  └──────────┘    │  ┌────────────────────┐  │  │
│                  │  │ Counter (tiktoken) │  │  │
│  ┌──────────┐    │  ├────────────────────┤  │  │
│  │ Memory   │───▶│  │ Allocator (配额表) │  │  │
│  │ Store    │◀───│  ├────────────────────┤  │  │
│  └──────────┘    │  │ Compressor (摘要)  │  │  │
│                  │  ├────────────────────┤  │  │
│  ┌──────────┐    │  │ Degradation (降级) │  │  │
│  │ Tool     │───▶│  └────────────────────┘  │  │
│  │ Results  │    └───────────┬──────────────┘  │
│  └──────────┘                │                  │
│                              ▼                  │
│                  ┌──────────────────────┐       │
│                  │  组装后的 Prompt       │       │
│                  │  total ≤ hard_limit   │       │
│                  └──────────────────────┘       │
└─────────────────────────────────────────────────┘
```

### 3.2 参考实现（Python 伪代码，可直接改造）

```python
import tiktoken
from dataclasses import dataclass

@dataclass
class BudgetPolicy:
    total_limit: int = 128_000
    reserved_for_output: int = 4_096
    soft_ratio: float = 0.80   # 触发压缩
    hard_ratio: float = 0.95   # 触发降级
    # 组件配额（相对可用空间的占比）
    quotas: dict = None

    def __post_init__(self):
        self.quotas = self.quotas or {
            "system": 0.10, "tools": 0.15, "memory": 0.15,
            "history": 0.35, "observation": 0.25,
        }

class TokenBudgetManager:
    def __init__(self, policy: BudgetPolicy):
        self.policy = policy
        self.enc = tiktoken.encoding_for_model("gpt-4o")
        self.usage = {k: 0 for k in policy.quotas}
        self.history = []

    def count(self, text: str) -> int:
        return len(self.enc.encode(text))

    @property
    def usable(self) -> int:
        return self.policy.total_limit - self.policy.reserved_for_output

    @property
    def total_used(self) -> int:
        return sum(self.usage.values())

    def check_and_adjust(self, components: dict) -> dict:
        """每轮调用前执行：软限压缩，硬限降级"""
        for name, content in components.items():
            self.usage[name] = self.count(str(content))

        if self.total_used > self.usable * self.policy.hard_ratio:
            self._degrade(components)
        elif self.total_used > self.usable * self.policy.soft_ratio:
            self._compress(components)
        return components

    def _compress(self, components: dict):
        """L1-L2: 截断观测 + 摘要旧历史"""
        obs = components.get("observation", "")
        if len(obs) > 4000:  # 字符级粗截断，精确版用 token 计数
            components["observation"] = obs[:2000] + "\n...[truncated]...\n" + obs[-1000:]

        hist = components.get("history", [])
        if len(hist) > 8:
            summary = self._summarize(hist[:-4])  # 调用小模型
            # 保留第 1 轮（任务目标）+ 摘要 + 最近 4 轮
            components["history"] = [hist[0], {"role": "system", "content": f"[历史摘要]{summary}"}] + hist[-4:]

    def _degrade(self, components: dict):
        """L3-L4: 卸载 Memory，移除非核心工具"""
        components["memory"] = ""  # 移入外部存储，标注可检索
        non_core_tools = [...]     # 根据任务域过滤工具集
        components["tools"] = [t for t in components.get("tools", []) 
                               if t not in non_core_tools]

    def _summarize(self, messages) -> str:
        # 实际实现：调用廉价模型（如 gpt-4o-mini）生成摘要
        return "任务目标：... 已完成步骤：..."
```

工具层侧的返回预算（在 `_compress` 之前就该做好）：

```python
def fetch_webpage_with_budget(url: str, budget_tokens: int = 1500) -> str:
    raw = requests.get(url).text
    cleaned = strip_html(raw)
    truncated = truncate_by_tokens(cleaned, budget_tokens)
    return f"[网页内容, 已截断至 {budget_tokens} tokens]\n{truncated}"
```

---

## 四、实践练习与思考题

### 练习：为一个 Deep Research Agent 设计预算方案

场景：Agent 需要完成“调研某技术方案并写报告”，预计 15+ 轮工具调用（搜索、抓取网页），上下文窗口 128K。

要求：

1. 写出各组件的初始配额表，并说明理由
2. 实现 `check_and_adjust` 的软/硬双阈值逻辑
3. 实现至少 L1–L3 三级降级策略
4. 思考：任务进入“写报告”阶段时，配额应如何重新分配？

### 思考题

1. 为什么“简单丢弃最老的对话轮次”通常比“滚动摘要”更危险？什么场景下反而更好？
2. Tool Definitions 是固定成本，Memory 是检索成本——两者的优化策略本质区别是什么？
3. 如果把 Reserved 设为 0，会发生什么？为什么？
4. 预算检查应该放在 Agent Loop 的哪个位置？每轮开始前还是组装 Prompt 时？两种选择的差异是什么？

---

## 五、与 Agent Engineering 的关联

Token Budget 是 Agent Runtime（Agent 运行时）的**资源管理层**，类比操作系统的内存管理器：

- **与 Memory 架构的关系**：预算压力是驱动“外部记忆”存在的根本原因。没有 Token Budget 约束，就不需要 RAG、不需要摘要记忆、不需要分层存储。压缩策略（L2/L3）直接决定了 Memory 系统的接口设计。
- **与 Multi-Agent 的关系**：子 Agent 的核心价值之一就是上下文隔离——每个子 Agent 有独立预算，主 Agent 只接收结果摘要。这本质上是一种分布式预算管理。
- **与成本工程的关系**：Token 用量即账单。预算管理同时是性能工程（防超限）和成本工程（防浪费）的双面工具。
- **与可观测性的关系**：预算检查点是天然的埋点位置。记录每次压缩/降级事件，是排查“Agent 为什么忘记任务目标”类问题的第一手数据。

掌握 Token Budget，是从“会调 API”到“会设计 Agent 系统”的分水岭之一。

---

## 六、FAQ

**Q1: Token Budget 会不会随着上下文窗口变大（如 1M token）而变得不重要？**
不会。长上下文模型解决的是“硬超限”问题，但“软超限”依然存在：长上下文下的注意力衰减（lost in the middle）、成本随 token 数线性增长、延迟增加。窗口越大，浪费的代价越高，预算管理的经济价值反而更大。

**Q2: 用字符数 ÷ 4 估算 token 可以吗？**
不建议在生产环境使用。中文、代码、JSON 的 token 密度差异很大（中文约 1 字 ≈ 1–2 token，英文约 4 字符 ≈ 1 token）。多轮累积后误差可达 20%+，足以击穿安全余量。生产环境用 `tiktoken` 精确计数，并在目标模型上实测校准。

**Q3: 压缩历史用摘要，会不会丢失关键信息？**
会，所以要设计摘要的“保全清单”：任务目标、用户偏好、���完成的待办、关键决策及其理由必须显式保留。实践中推荐“结构化摘要 + 原始数据外置可检索”的组合：摘要负责可读性，检索负责兜底——发现摘要不够时，Agent 可以主动取回原始记录。

**Q4: 预算配额应该一次性写死还是每轮动态调整？**
建议“静态配额表 + 动态微调”。完全静态无法应对 Observation 的突发膨胀；完全动态则不可预测、难调试。工程折中：配额表作为默认值，加上负反馈机制（连续超限时下调该组件配额、上报日志）。

**Q5: 摘要压缩本身也要调用 LLM，会不会得不偿失？**
算一笔账：一次摘要调用约几百到几千 token（用小模型成本极低），换取的是主调用减少数千到数万 token 且在后续每轮持续节省。只要 Agent 平均生命周期超过几轮，摘要就是正收益。关键是摘要要用廉价模型（如 mini 级别），不要用主模型。

---

## 七、参考资料

- OpenAI – Managing tokens（tiktoken 使用与消息开销）：https://platform.openai.com/docs/guides/prompt-engineering
- Anthropic – Effective context engineering for AI agents（上下文工程与压缩策略）：https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents
- Liu et al. – Lost in the Middle: How Language Models Use Long Contexts：https://arxiv.org/abs/2307.03172
- LangGraph – Memory & State Management 文档：https://langchain-ai.github.io/langgraph/
- Microsoft AutoGen – Agent Conversation & Context Management：https://microsoft.github.io/autogen/
- Chroma / LlamaIndex – RAG 作为上下文卸载方案：https://docs.trychroma.com/

---

*本文是「6 个月 AI Agent 工程师路线」第 58 天 / M3 第 1 周的学习笔记。下一篇将深入 Memory 分层架构：当预算压力把数据推出上下文后，它们应该存到哪里、如何被取回。*

---

## 📋 本日知识点清单

- [ ] Total Context = System + History + Tools + Memory + Observation + Reserved 的预算分配
- [ ] Token Budget 的设计与动态调整
- [ ] 不同组件的 Token 消耗分析
- [ ] 预算超限时的降级策略

## 📝 实践练习

设计 Token Budget 分配方案，实现预算检查和降级策略。

---

*本文是「AI Agent 工程师」6 个月学习计划的一部分。学习路线：LLM → Inference → Runtime → Harness → Memory → Environment → Evaluation → Production。目标：Agent / AI Systems Engineer。*
