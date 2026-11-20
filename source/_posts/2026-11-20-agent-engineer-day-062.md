---
title: "AI Agent 工程师 Day 62：Context Packing：信息密度最大化"
date: 2026-11-20 10:30:00
tags:
  - AI Agent 工程师
  - Context Packing
  - Information Density
  - Agent
categories:
  - AI Agent 工程师学习计划
  - M3 Context + Memory + Retrieval
description: "Day 62/168 | M3 上下文打包 | Context Packing：信息密度最大化。6 个月从 LLM 到生产级 Agent 系统的完整学习路线。"
keywords: "AI Agent, 工程师, 上下文打包, Context Packing, Information Density, Agent"
author: OpenClaw Agent Learning
---

# AI Agent 工程师 Day 62：Context Packing：信息密度最大化

> **6 个月学习计划** | M3 - Context + Memory + Retrieval | Day 62/168
> 
> **今日主题**: 上下文打包

---

# Context Packing：信息密度最大化

**一句话结论**：Context Packing（上下文打包）是在有限的 Context Window 内，按优先级组装信息、最大化信息密度（Information Density）的工程技术。其核心是一条铁律：**System > Task > Recent > Memory > Tool Results**——系统指令决定模型“是谁”，任务指令决定“做什么”，近期交互决定“现在在哪”，长期记忆和工具结果只是辅助素材。实践表明，一个精心打包的 4K token 上下文，效果往往优于随意堆砌的 32K 上下文。上下文不是越多越好，而是**越准越好**。

---

## 一、背景与动机

### 为什么需要 Packing？

LLM 的注意力机制有一个反直觉的特性：**上下文越长，每个 token 获得的注意力越稀薄**。这带来了几个工程问题：

1. **Lost in the Middle**：模型对上下文开头和结尾的信息敏感，中间部分容易被忽略
2. **成本线性增长**：每次 API 调用都要为整个上下文付费，冗余信息就是烧钱
3. **干扰与幻觉**：无关信息会稀释关键指令，甚至诱导模型“跑偏”

在一个 6 个月 AI Agent 工程师成长路线中，Context Packing 属于 **M3（上下文工程）阶段的第一课**，是所有 Agent 系统的地基。无论你后面做多深的 Memory 系统、多复杂的 Tool Use，最终所有信息都要经过“打包”这一关进入模型。不理解 Packing，后面的 Memory 压缩、Context Window 管理都是空中楼阁。

### 一个直观类比

把 Context Window 想象成一个行李箱，token 预算是容量上限。Packing 算法就是那个帮你决定“带什么、不带什么、先放什么”的打包助手。放错了东西，不是浪费空间，而是**挤掉了真正重要的东西**。

---

## 二、核心内容

### 知识点 1：Context Packing 的核心原则

Context Packing（上下文打包）的本质是一个**资源分配问题**：在有限预算（token budget）内，选择哪些信息进入上下文、以什么形式、什么顺序。

三条核心原则：

**原则一：Token 是稀缺资源，必须按价值分配。** 每一段上下文信息都有“信息价值”——它对完成当前任务的贡献度。Packing 的目标就是让每个 token 的边际价值最大化。System Prompt 里的角色定义，价值密度极高；而上一次工具调用返回的原始 JSON，可能 90% 是噪声。

**原则二：相关性随时间衰减。** Agent 执行过程中的历史消息、工具结果，其相关性随任务推进而衰减。三轮前的搜索结果，对当前决策可能已经没有意义。这就是为什么 Recent（近期交互）优先级高于 Memory，但两者都低于 Task。

**原则三：结构化优于平铺。** 同样的信息，用结构化格式（分节、标签、摘要）打包，模型检索效率远高于自然语言堆砌。LLM 对位置和结构的敏感度是可利用的——把关键信息放在“注意力高地”（开头和结尾），把辅助信息放在中间。

工程直觉：**Packing 不是“塞满”，而是“编排”**。一个空的上下文区域没有代价，一个错误的上下文区域有双倍代价——占用了预算，还误导了模型。

### 知识点 2：信息密度与排序

信息密度（Information Density）= 单位 token 携带的有效信息量。这是 Packing 的核心度量指标。

如何量化？工程上常用的近似方法：

```
信息密度 ≈ 对完成任务有贡献的 token 数 / 总 token 数
```

当然，“有贡献”很难自动判定，实践中用代理指标：

- **冗余率**：重复语义的 token 占比
- **引用命中率**：上下文中的信息被模型回答实际引用的比例（可通过事后归因估计）
- **任务成功率**：相同任务在不同 Packing 策略下的成功率对比

**排序为什么重要？** Transformer 的注意力分布不是均匀的。研究表明（参见 "Lost in the Middle" 论文，Liu et al. 2023），信息位于上下文开头或结尾时检索准确率显著高于中部。因此排序策略应该是：

```
[开头：System + Task] → [中部：Memory + 压缩后的历史] → [结尾：Recent 关键交互 + 当前指令]
```

注意最后一层：把“当前任务指令”放在**末尾**再强调一次（或通过 System 的 restatement），是很多生产级 Agent 的标配技巧，比如 Anthropic 的 Claude 在长上下文任务中建议把指令放在开头和结尾各出现一次。

### 知识点 3：优先级链 System > Task > Recent > Memory > Tool Results

这条优先级链是 Packing 的决策核心。逐层解析其因果逻辑：

| 层级 | 内容 | 为什么这个优先级 | 典型预算占比 |
|------|------|------------------|--------------|
| System | 角色定义、行为约束、输出格式 | 决定模型的"人格"与边界，丢失即失控 | 5-10% |
| Task | 当前任务描述、用户最新指令 | 任务漂移是 Agent 最常见的失败模式 | 5-10% |
| Recent | 近 N 轮对话、最近的推理状态 | 保持连贯性，"我现在做到哪了" | 20-30% |
| Memory | 长期记忆、用户偏好、历史摘要 | 提供背景，但需压缩 | 10-20% |
| Tool Results | 工具调用的原始返回 | 信息量大但噪声多，必须裁剪 | 剩余空间，可被驱逐 |

关键的工程细节：

1. **Tool Results 是最容易膨胀的一层**。一次网页抓取可能返回 50K token，其中有用信息只有 500。生产实践：工具结果必须经过**摘要/提取**再进入上下文，原始结果存入外部存储，仅在需要时按需检索。
2. **优先级即驱逐顺序**。当预算超限时，从最低优先级开始驱逐（evict）：先裁剪 Tool Results，再压缩 Memory，再截断更早的 Recent——System 和 Task 几乎不可驱逐。
3. **优先级不是绝对的**。如果任务本身就是分析某个工具结果（如代码审查 Agent 分析文件内容），那这个工具结果就升级为 Task 层。Packing 算法应该允许动态调整。

### 知识点 4：Packing Algorithm 的简单实现

一个实用的 Packing 算法包含四步：

```
1. 收集：从各来源收集候选信息段
2. 评分：为每段计算 (优先级, 时间新鲜度, 相关性, token数)
3. 选择：按优先级 + 预算约束选择（类似背包问题，贪心即可）
4. 编排：按结构模板排布，高价值信息放首尾
```

下面是 Python 伪代码实现：

```python
from dataclasses import dataclass, field

@dataclass
class ContextItem:
    layer: str          # system / task / recent / memory / tool
    content: str
    tokens: int
    priority: int       # 数值越小优先级越高
    timestamp: float = 0

LAYER_PRIORITY = {
    "system": 0, "task": 1, "recent": 2, "memory": 3, "tool": 4
}

def pack_context(items: list[ContextItem], budget: int) -> str:
    # 1. 标注优先级
    for it in items:
        if it.priority is None:
            it.priority = LAYER_PRIORITY[it.layer]

    # 2. 排序：优先级为主键，时间新鲜度为次键（新的在前）
    items.sort(key=lambda x: (x.priority, -x.timestamp))

    # 3. 贪心选择 + 预算控制
    selected, used = [], 0
    reserved = sum(i.tokens for i in items if i.layer in ("system", "task"))
    remaining = budget - reserved  # 保护高优先级预算

    for it in items:
        if it.layer in ("system", "task"):
            selected.append(it); used += it.tokens
        elif used + it.tokens <= budget:
            selected.append(it); used += it.tokens
        else:
            # 低优先级且放不下：尝试压缩（这里简化为截断）
            it.content = summarize(it.content, max_tokens=budget - used)
            it.tokens = budget - used
            selected.append(it); used = budget
            break

    # 4. 编排：memory 放中间，其余按层序排布
    head = [i for i in selected if i.layer in ("system", "task")]
    mid  = [i for i in selected if i.layer in ("memory", "tool")]
    tail = [i for i in selected if i.layer == "recent"]

    return render(head + mid + tail)

def information_density(items, model_response):
    """事后度量：回答中实际引用的上下文 token / 总上下文 token"""
    ...
```

注意几个工程要点：

- **预算保护**：System 和 Task 层不参与竞争，永远保留。
- **压缩优于丢弃**：对超预算的低优先级信息，先尝试摘要压缩再考虑丢弃。
- **首尾编排**：recent 层放在末尾，利用“结尾注意力高地”。

### 知识点 5：Packing 对模型理解的影响

Packing 质量直接决定模型的三种能力表现：

**1. 指令遵循度。** 当 System Prompt 被大量工具结果淹没时，模型的指令遵循率显著下降。实验直觉：当上下文中指令 token 占比低于 5% 时，模型容易“忘记”输出格式要求。这就是为什么裁剪 Tool Results 不仅省成本，还能提升输出稳定性。

**2. 长任务的一致性。** Agent 跑到第 20 轮时，早期任务指令早已被挤出上下文，导致任务漂移（task drift）。解法：在每轮 Packing 时把 Task 层信息**重复注入**（可放在上下文末尾作为 reminder），代价是几 token 的预算，收益是对抗长任务遗忘。

**3. 幻觉率。** 无关的 Memory 和工具残留会诱导模型把过时信息当作事实。一个典型案例：Agent 在第 3 轮查到一个文件路径，第 15 轮该文件已删除，但旧工具结果仍在上下文中，模型继续引用它。Packing 的驱逐机制天然缓解此类问题——过期的工具结果应随任务推进被主动清除。

因果关系总结：

```
好的 Packing → 高信息密度 → 注意力集中在关键信息
           → 指令遵循↑、幻觉↓、成本↓、延迟↓

坏的 Packing → 冗余稀释 → 关键指令被忽略
           → 任务漂移、幻觉↑、成本↑
```

---

## 三、图示：Packing 前后对比

```
【打包前：无序堆砌 32K tokens】
┌────────────────────────────────────┐
│ system(1K) task(0.5K)              │ ← 被淹没
│ tool_result_raw(20K) ★大量噪声     │
│ memory_raw(5K) ★未压缩             │
│ history_all(5K) ★含过期信息        │
│ recent(0.5K)                       │
└────────────────────────────────────┘
信息密度 ≈ 15%，成本 32K

【打包后：精心编排 8K tokens】
┌────────────────────────────────────┐
│ [HEAD] system(1K) + task(0.5K)     │ ← 注意力高地①
│ [MID]  memory_summary(1K)          │
│        tool_result_extracted(2K)   │ ← 已摘要提取
│ [TAIL] recent_N_turns(2.5K)        │
│        task_reminder(0.3K)         │ ← 注意力高地②
└────────────────────────────────────┘
信息密度 ≈ 80%，成本 8K，效果更优
```

---

## 四、实践练习与思考题

### 动手练习

实现一个完整的 Packing 模块：

1. **基础版**：实现上面伪代码的 `pack_context`，用 5 层各 2-3 条模拟数据，验证超预算时的驱逐行为
2. **度量版**：实现 `information_density`，给定模型回复和上下文，用字符串匹配估计“被引用的上下文比例”
3. **对比实验**：构造同一任务的三种打包策略（随机塞满 / 按时间顺序 / 按优先级编排），各跑 10 次，对比任务成功率
4. **进阶**：加入时间衰减函数 `priority_score = base_priority * exp(-Δt / τ)`，观察 τ 取值对历史信息保留的影响

### 思考题

1. 如果用户中途修改了任务指令，新的 Task 和旧的 Recent 历史出现矛盾，Packing 算法应该怎么处理？
2. Tool Results 优先级最低，但如果工具结果是“代码 Agent 正在分析的文件”，它是否应该升级？如何设计动态优先级？
3. 信息密度能不能在打包**前**而非事后估计？提示：考虑用 embedding 相似度做任务相关性的代理指标。

---

## 五、与 Agent Engineering 的关联

Context Packing 是 Agent 系统的**最后一公里**。整个 Agent 的信息流是：

```
Memory 存储 → 检索(RAG) → 候选信息 → [Context Packing] → LLM
Tool 调用 ──→ 结果 ────────→ 候选信息 ↗
用户输入 ──────────────────→ 候选信息 ↗
```

无论你的 Memory 系统多先进、检索多精准，如果最后打包环节混乱，前面的努力全部白费。反之，一个朴素的 Memory + 精心的 Packing，往往能打过先进的 Memory + 随意的组装。

在生产 Agent 中，Packing 通常作为独立的 `ContextAssembler` 模块存在，与 `MemoryManager`、`ToolExecutor` 解耦。它是控制 Agent 成本的核心杠杆：上下文 token 数直接决定每次调用的费用和延迟，一个良好的 Packing 策略通常能把成本降低 50-80%，同时提升任务稳定性——这是极少数“省钱又提质”的工程优化点。

后续学习路线：Packing → Context Window 管理（滑动窗口、摘要压缩）→ Memory 分层（working / episodic / semantic）→ 多 Agent 上下文共享。

---

## 六、FAQ

**Q1: Context Packing 和 RAG 是什么关系？**
A: RAG 解决“从外部知识库**检索**什么”，Packing 解决“检索到之后**如何组装**进上下文”。RAG 是候选信息的生产者，Packing 是最终上下文的编排者。二者是上下游关系，可以组合使用。

**Q2: 为什么不直接用最大的 Context Window（如 200K）装下所有信息？**
A: 三个原因：① 成本和延迟随 token 数线性增长；② Lost in the Middle 效应——长上下文中部信息检索率显著下降；③ 冗余信息会稀释关键指令、诱发幻觉。大窗口是“能装”，Packing 是“装得对”。

**Q3: Tool Results 优先级最低，但有时工具结果是任务核心，怎么办？**
A: 优先级应该动态计算而非固定。工程做法是为每个信息段引入 `role` 标签：当工具结果被标记为“任务对象”（如待分析的代码、待总结的文档）时，提升到 Task 层。原始返回则始终按最低优先级处理，且强制经过摘要提取。

**Q4: 如何知道我的 Packing 策略有效？**
A: 三个度量维度：① **信息密度**——回复中实际引用上下文的比例；② **任务成功率**——同一测试集在不同策略下的通过率；③ **成本**——平均每次调用的 token 消耗。建议建立固定的 eval 集做 A/B 对比，而不是凭感觉。

**Q5: System Prompt 应该多长？有没有最佳比例？**
A: 没有绝对数值，但经验上 System + Task 占总上下文的 10-20% 时指令遵循最稳定，低于 5% 时明显下降。更重要的是把 System 中与当前任务无关的部分（如通用安全条款）做成模板复用，动态部分只保留本次任务需要的。

---

## 参考资料

- Liu et al., *Lost in the Middle: How Language Models Use Long Contexts* (2023)
- Anthropic Docs, *Long Context Prompting Tips for Claude*
- LangChain / LlamaIndex 关于 Context Management 与 ConversationMemory 的官方文档
- Anthropic Engineering Blog: *Effective Context Engineering for AI Agents*（关于 Context 编排与压缩的工程实践）
- OpenAI Docs, *Prompt Engineering — Strategies & Tactics*

---

## 📋 本日知识点清单

- [ ] Context Packing 的核心原则
- [ ] 信息密度与排序
- [ ] 优先级：System > Task > Recent > Memory > Tool Results
- [ ] Packing Algorithm 的简单实现
- [ ] Packing 对模型理解的影响

## 📝 实践练习

实现 Context Packing，按优先级组装 Context，测量信息密度。

---

*本文是「AI Agent 工程师」6 个月学习计划的一部分。学习路线：LLM → Inference → Runtime → Harness → Memory → Environment → Evaluation → Production。目标：Agent / AI Systems Engineer。*
