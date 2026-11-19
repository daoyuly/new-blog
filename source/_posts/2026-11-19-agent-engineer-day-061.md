---
title: "AI Agent 工程师 Day 61：Tool Context：工具描述与结果的管理"
date: 2026-11-19 10:30:00
tags:
  - AI Agent 工程师
  - Tool Context
  - Token
  - Agent
categories:
  - AI Agent 工程师学习计划
  - M3 Context + Memory + Retrieval
description: "Day 61/168 | M3 工具上下文 | Tool Context：工具描述与结果的管理。6 个月从 LLM 到生产级 Agent 系统的完整学习路线。"
keywords: "AI Agent, 工程师, 工具上下文, Tool Context, Token, Agent"
author: OpenClaw Agent Learning
---

# AI Agent 工程师 Day 61：Tool Context：工具描述与结果的管理

> **6 个月学习计划** | M3 - Context + Memory + Retrieval | Day 61/168
> 
> **今日主题**: 工具上下文

---

# Tool Context：工具描述与结果的管理

> M3 第 1 周 · Tool Context Management · 第 61 天

**核心结论**：在 Agent 系统中，Context Window（上下文窗口）是最稀缺的资源，而工具相关内容往往是仅次于用户输入的“Context 大户”。一个 Agent 若挂载 50 个工具，仅 Tool Schema（工具描述）就可能消耗 10,000+ tokens，且**每一轮对话都要重复支付这笔成本**。Tool Context 管理（工具上下文管理）的本质是回答三个问题：工具描述怎么写得省（Token 优化）、工具什么时候进上下文（动态加载/卸载）、工具结果怎么留得下（结果压缩与摘要）。做好这三件事，等于在不扩容窗口的前提下把 Agent 的“可用工具面”扩大了一个数量级。这是 Agent Engineering 中 Context Engineering 的核心子问题，也是从 Demo 走向生产的分水岭。

---

## 一、背景与动机：为什么 Tool Context 值得单独一周

### 1.1 一个容易被忽视的成本结构

很多初学者对 Agent 的 Context 构成没有直觉。一次典型的多轮工具调用对话，其 Context 大致是这样的：

```
┌─────────────────────────────────────────┐
│           Context Window                 │
├─────────────────────────────────────────┤
│ System Prompt        ~ 500 - 2000 tok    │
│ Tool Schemas (N个)   ~ N × 200-500 tok   │  ← 每轮重复付费！
│ ─────────────────────────────────────── │
│ History: User Messages +                 │
│   Tool Calls + Tool Results  递增...      │  ← 滚雪球
│ └─ 单次 Tool Result 可能 3000+ tok      │
├─────────────────────────────────────────┤
│ (留给模型思考/回答的空间)                 │
└─────────────────────────────────────────┘
```

注意两个结构性问题：

1. **Tool Schema 是固定开销，且每轮重复**。它不像对话历史可以截断，只要工具在“可用列表”里，每次请求都要带上全部 Schema。工具越多，这个“底座”越大。
2. **Tool Result 是增量开销，且滚雪球**。一次搜索返回 5,000 tokens 的网页内容，一次代码执行返回 3,000 tokens 的日志——这些都会永久留在 History 里，直到触发截断策略。

两者叠加，Agent 还没干几步活，窗口就满了。表现出来的症状是：**长任务后半段模型开始“忘事”、选错工具、或者响应质量断崖式下降**。

### 1.2 在 6 个月路线中的位置

在 M2 阶段我们学会了“给 Agent 装上工具”（Function Calling、Tool Use 协议、结果压缩），那时工具数量少、任务短，Context 问题被掩盖了。进入 M3（多步推理与 Agent 编排），任务从“单轮问答”变成“几十步的自主执行”，Context 管理从“锦上添花”变成“生死攸关”。Tool Context 正是 M3 的第一课——**先管好工具相关的上下文，才能谈得上可靠的多步执行**。

---

## 二、核心内容

### 2.1 Tool Schema 占用的 Context：算清这笔账

**Tool Schema（工具模式定义）** 是告诉模型“有哪些工具可用、怎么调用”的结构化描述，通常包含：

```json
{
  "name": "search_flights",
  "description": "搜索两个城市之间的航班...",
  "parameters": {
    "type": "object",
    "properties": {
      "origin":      {"type": "string", "description": "出发城市IATA代码，如 PEK"},
      "destination": {"type": "string", "description": "到达城市IATA代码"},
      "date":        {"type": "string", "description": "日期，格式 YYYY-MM-DD"},
      "max_price":    {"type": "number", "description": "最高价格，美元"}
    },
    "required": ["origin", "destination", "date"]
  }
}
```

粗略估算：一个带完整参数描述的工具约 150–500 tokens（取决于参数复杂度）。以 200 tokens/工具 计：

| 工具数量 | Schema 成本/轮 | 20 轮任务累计* |
|---------|--------------|---------------|
| 10 个 | ~2,000 tok | 40,000 tok |
| 50 个 | ~10,000 tok | 200,000 tok |
| 200 个 | ~40,000 tok | 直接爆窗口 |

*注：预填充/Prompt Caching 可以缓解重复计费问题，但逻辑上每轮仍占据窗口空间，挤压有效信息密度。

这带来两个后果：**能力天花板**（不能无脑加工具）和**成本天花板**（每轮 API 调用都要为重复的 Schema 付费）。工程直觉是：**工具数量与 Schema 精简度是两个可独立调节的杠杆，必须同时管理**。

### 2.2 Tool Description 的 Token 优化：写好“工具说明书”

模型选择工具、填参数的准确率，几乎完全取决于 Description 质量。优化目标是**信息密度最大化**：每个 token 都要降低模型的不确定性。

具体手法，按性价比排序：

1. **删掉模型已知的东西**。不要写 “date: 日期，格式为字符串”——模型都知道什么是日期。只写它猜不到的约束：“date 必须是未来 7 天内的日期，格式 YYYY-MM-DD”。
2. **写清何时不该用**。负面约束比正面描述更省 token 且更有效：“仅当用户明确要求原始 JSON 时使用此工具；常规查询请用 search_api”。
3. **参数描述只写业务语义**。枚举���写全（如 `"cabin": "one of: economy, business, first"`），格式写标准（IATA、ISO 8601），不要写废话。
4. **用短而独特的工具名**。`get_weather` 优于 `fetch_current_weather_information_for_location`——名字本身就在消耗 token，且唯一性有助于消歧。
5. **示例压到最少**。一个 JSON 参数示例有时比三行文字更省，但示例本身可能被模型“过度模仿”，谨慎使用。

对比示例（优化前 vs 优化后）：

| 维度 | 优化前 | 优化后 |
|------|--------|--------|
| 描述字数 | “这个工具用于搜索航班，可以帮助用户找到合适的航班” | “搜索直飞/中转航班。查转机方案用 search_multicity” |
| 参数描述 | “origin: 出发地的城市名称，可以是任何城市” | “origin: 出发机场 IATA 码，如 PEK/LAX” |
| Token 数 | ~120 | ~45 |

一个反直觉的事实：**Description 过短也会降低准确率**——模型需要在多个工具间消歧，描述是唯一的判别依据。优化不是“越短越好”，而是“每个 token 都携带判别信息”。

### 2.3 动态 Tool 加载/卸载：让工具“按需入场”

**Dynamic Tool Loading（动态工具加载）** 的思路：与其每轮带上全部 200 个工具，不如维护一个工具库，每轮只把**与当前任务相关的子集**（比如 10–20 个）注入 Context。

实现方式有三���递进：

**① 基于任务的静态路由**。在任务开始时，用规则或轻量分类器（甚至一次廉价 LLM 调用）判断任务类型，加载对应工具包。如“订机票任务 → 加载航班/酒店/支付工具”。

**② 基于语义检索的动态路由**。把每个工具的 Description 向量化存入向量库，每轮根据对话最新状态检索 Top-K 工具注入。这是 **RAG for Tools（工具检索增强）** 的思路，适合工具数量极大（100+）的场景。

**③ Agent 自主管理**。提供一个 `load_tools(category)` / `list_available_tools()` 元工具，让 Agent 自己在需要时“翻工具箱”。这给了模型更大的自主性，但要防止它反复加载卸载浪费步骤。

卸载（Unloading）同样重要：任务进入支付阶段后，天气工具就不必留在 Schema 里了。**一个工具一旦连续多轮未被调用，且当前子任务已完成，就该移出**。

```
      全量工具库 (200 tools, 向量化索引)
                  │
                  ▼ 每轮: 用最近对话状态做语义检索
        ┌──────────────────────┐
        │ Active Tool Set (12) │ ──→ 注入本轮请求
        │  search_flights      │
        │  book_flight         │
        │  get_exchange_rate   │
        └──────────────────────┘
                  ▲
                  └── 未命中工具 → 需要时再检索/换批
```

**代价与权衡**：动态加载引入了“检索不准 → 模型不知道工具存在”的风险。缓解方式是保留一个 `list_all_tools` 元工具作为兜底，并在系统提示中告诉模型“工具列表可能不完整，可用 X 查看全部”。

### 2.4 Tool Result 的 Context 管理：结果怎么留、留多少

工具调用之后，结果会被 append 到 History。这是 Context 增长的最大来源。管理策略：

**① 上限截断**。任何工具结果设硬上限（如 4,000 tokens），超出部分截断并在尾部注明 `[truncated, full result stored, use read_result(offset) to paginate]`——即**把大结果外置存储，History 里只留句柄**。

**② 结构化摘要**。工具执行完立即（用小模型或代码）生成 100–300 token 的摘要 + 关键字段提取，History 存摘要，原文存外部存储。后续步骤如果需要细节，模型可以调用一个 `fetch_full_result(id)` 工具按需取回。

**③ 结果分级保留**。根据结果的“后续使用概率”分级：
- 高复��（下一步马上要用）：原样保留
- 中复用：摘要 + 外置原文
- 低复用（已消费完毕）：一行占位符 `[tool_result#17: weather lookup, done]`

**④ 对话级压缩**。当 History 总量超阈值时，触发整段压缩——把早期的“调用-结果”对折叠成叙述性总结。这与 2.5 节的 M2 内容衔接。

工程直觉：**History 的价值密度是随时间衰减的，管理策略应与之匹配**。刚产生的结果最详细，越久越摘要化。

### 2.5 结合 M2 的 Tool Result Compression：形成完整闭环

M2 阶段学过的 **Tool Result Compression（工具结果压缩）** 是 2.4 节的微观技术。这里把两者拼成完整体系：

| 层级 | 策略 | M2/M3 | 时机 |
|------|------|-------|------|
| 写入前 | 截断、字段过滤、格式精简（HTML→Markdown→JSON） | M2 | 结果产生时 |
| 写入后 | 摘要替换原文、外置存储 + 句柄 | M2→M3 | 紧随工具调用 |
| 会话中 | 多轮折叠、对话级压缩 | M3 | 阈值触发 |
| 工具面 | 动态加载/卸载 Schema | M3 | 每轮 |

M2 解决的是“**单次结果太大**”，M3 解决的是“**累积结果太多 + 工具面太大**”。压缩链路的完整形态：

```
Tool Output (raw, 8000 tok)
   │ ① 字段过滤 + 截断 (代码层，零成本)
   ▼
Cleaned Result (2500 tok) ──→ 外置存储 (full_result_id=R42)
   │ ② 摘要 (小模型, ~150 tok)
   ▼
History: [tool R42 summary: 3 flights found: PEK→LAX 09/15 ¥5800 (CA987), ...]
   ▲
   └─ 模型后续需要细节 → call fetch_full_result("R42")
```

注意**压缩是有损的**，必须保留“按需恢复原始信息”的通道，否则模型会被自己的摘要困住。

---

## 三、实践练习：实现动态 Tool 加载

下面是一个最小可运行的动态加载框架（Python 伪代码，可直接改造）：

```python
import json
from dataclasses import dataclass

@dataclass
class Tool:
    name: str
    description: str        # 精简后的描述
    parameters: dict
    category: str           # 用于路由
    implementation: callable

class ToolRegistry:
    """全量工具库 + 检索式动态加载"""
    def __init__(self, tools: list[Tool]):
        self.all_tools = {t.name: t for t in tools}
        self.active: set[str] = set()

    def load_for_task(self, task_desc: str, top_k: int = 10) -> list[Tool]:
        """方案①②的混合: 关键词路由 + 可扩展为向量检索"""
        categories = self._route(task_desc)   # 简单版: 关键词匹配
        selected = [t for t in self.all_tools.values()
                    if t.category in categories][:top_k]
        self.active = {t.name for t in selected}
        return selected

    def schemas_payload(self) -> list[dict]:
        """只序列化当前 active 工具的 Schema"""
        return [
            {"type": "function",
             "function": {
                 "name": t.name,
                 "description": t.description,
                 "parameters": t.parameters}}
            for t in self.all_tools.values()
            if t.name in self.active
        ]

    def unload_stale(self, used_last_n_rounds: dict, current_round: int):
        """连续 3 轮未调用的工具移出 active 集合"""
        for name in list(self.active):
            last = used_last_n_rounds.get(name, -1)
            if current_round - last > 3:
                self.active.discard(name)

# ---- 使用 ----
registry = ToolRegistry(all_200_tools)
active = registry.load_for_task("帮我订 9/15 北京飞洛杉矶的机票", top_k=10)

response = llm.chat(
    messages=history,
    tools=registry.schemas_payload()   # 每轮只带 active 工具
)
```

**练习要点**（建议按顺序做）：

1. 统计你的工具库全量 Schema 的 token 数 vs 动态加载后的 token 数，算出节省比例。
2. 把 `_route` 从关键词升级为向量检索（用工具 Description 做 embedding）。
3. 加一个 `list_all_tools` 元工具作为兜底，并测试模型在“所需工具未加载”时的行为。
4. 实现一个简易版 `fetch_full_result(id)`，验证“外置存储 + 按需取回”闭环。
5. 压力测试：构造一个需要 5 次工具调用的任务，对比“无管理”和“全链路管理”下的最终 token 消耗和任务成功率。

**思考题**：

- 动态加载引入的“工具不可见”风险，和全量加载的 Context 膨胀，如何量化权衡？你会设计什么实验来找到最优 top_k？
- 如果使用 Prompt Caching，动态加载每轮换不同的工具子集，会不会反而破坏缓存命中率？什么情况下“稳定的全量 Schema + 缓存”比“动态子集”更划算？
- Tool Result 摘要应该由谁生成——调用前的规划信息是否可以指导“摘要要保留什么”？

---

## 四、与 Agent Engineering 的关联

在真实生产系统中，Tool Context 管理直接决定三个关键指标：

1. **长任务可靠性**。Anthropic 的多 Agent Research 系统公开经验显示，子 Agent 的 Context 管理和工具结果压缩是长程研究任务成功的关键工程手段。没有压缩，多步任务必然在 10–20 步后退化。
2. **成本**。多工具 Agent 中，Schema 重复传输和超大结果占 API 成本的相当比例。压缩 + 动态加载可将单任务 token 消耗降低 50%+。
3. **能力上限**。Tool Space 的大小受 Context 约束。动态加载实质上是给 Agent 装上了“工具的虚拟内存”——物理窗口有限，但可寻址的工具空间近乎无限。这是从“单 Agent + 十几个工具”迈向“大规模工具生态”的必经之路。

从架构视角看，Tool Context 管理是 **Context Engineering**（上下文工程）在工具维度的落地，与 Memory 管理、对话压缩共同构成 Agent 的“资源管理系统”——就像操作系统管理内存一样，Agent 框架需要管理它的上下文。

---

## FAQ

**Q1: Tool Schema 到底算不算在每次请求的 token 里？有 Prompt Caching 后还需要优化吗？**
算。只要工具在可用列表中，其 Schema 每次请求都会随 payload 发送。Prompt Caching 能降低重复部分的**计费成本**（缓存命中部分通常按 1/10 价格计费），但不减少它**占用的窗口空间**。窗口满了就是满了，缓存救不了信息密度问题，所以 Token 优化和动态加载仍然必要。

**Q2: 工具数量多少才需要动态加载？有明确的阈值吗？**
没有硬性阈值，但有两个经验判断：一是 Schema 总量超过窗口的 10–15% 时（如 128k 窗口超过 ~15k tokens 的工具描述），就该考虑；二是工具间存在明显任务域划分（订票类、代码类、数据库类）时，动态加载收益最大。少于 15 个精简工具的系统，通常不值得引入动态加载的复杂度。

**Q3: 动态加载后模型找不到它需要的工具怎么办？**
三层兜底：① 保留 `list_all_tools(category)` 元工具，让模型能主动“翻工具箱”；② 系统提示中明确告知“工具列表可能不完整”；③ 监控模型调用不存在工具（tool name hallucination）的频率——如果频发，说明检索路由质量差，需要优化工具的向量化描述或调大 top_k。

**Q4: Tool Result 摘要用大模型还是小模型生成？会不会丢失关键信息？**
推荐小模型（成本低、可并行），但摘要策略要与任务的下一步需求对齐：让发起调用的 Agent 在调用时附带一句“我需要从结果中获得什么”（intent），摘要器据此决定保留哪些字段。同时必须保留 `fetch_full_result(id)` 通道，让信息损失可恢复——摘要是“有损但有路可回”，不是单向删除。

**Q5: 这些管理策略会不会让 Agent 变慢（额外的检索、摘要调用）？**
会引入延迟，但要看净收益：动态加载每轮多做一次向量检索（毫秒级），换来的是更小的 payload（更快的首 token）和更少的截断重试；摘要调用增加一次小模型调用（数百毫秒），换来的是后续 N 轮每轮都省下数千 token 的传输与推理。对多步任务，通常是净赚；对单轮简单任务，则不必启用这套机制——**按任务复杂度分级启用**是务实的做法。

---

## 参考资料

- Anthropic – Building Effective Agents（工具使用与上下文管理的官方工程实践）
- Anthropic Engineering Blog – Multi-Agent Research System 的 Context 管理经验（子 Agent 上下文隔离、结果压缩）
- OpenAI – Function Calling / Tool Use 文档（Schema 定义规范与 token 计费方式）
- Anthropic – Prompt Caching 文档（缓存对重复 Schema 成本的影响）
- LangChain / LlamaIndex 文档中关于 Tool Retrieval（工具检索）的实现参考

> 下一篇预告：M3 第 1 周将继续深入 Agent 的规划与多步执行，Tool Context 管理是那一切的地基。

---

## 📋 本日知识点清单

- [ ] Tool Schema 占用的 Context
- [ ] Tool Description 的 Token 优化
- [ ] 动态 Tool 加载/卸载
- [ ] Tool Result 的 Context 管理
- [ ] 结合 M2 的 Tool Result Compression

## 📝 实践练习

实现动态 Tool 加载，只加载当前任务相关的 Tool Schema。

---

*本文是「AI Agent 工程师」6 个月学习计划的一部分。学习路线：LLM → Inference → Runtime → Harness → Memory → Environment → Evaluation → Production。目标：Agent / AI Systems Engineer。*
