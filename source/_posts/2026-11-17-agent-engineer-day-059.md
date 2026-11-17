---
title: "AI Agent 工程师 Day 59：Conversation Window：对话历史的裁剪策略"
date: 2026-11-17 10:30:00
tags:
  - AI Agent 工程师
  - Conversation
  - Sliding Window
  - Summary
  - Context
categories:
  - AI Agent 工程师学习计划
  - M3 Context + Memory + Retrieval
description: "Day 59/168 | M3 对话窗口 | Conversation Window：对话历史的裁剪策略。6 个月从 LLM 到生产级 Agent 系统的完整学习路线。"
keywords: "AI Agent, 工程师, 对话窗口, Conversation, Sliding Window, Summary, Context"
author: OpenClaw Agent Learning
---

# AI Agent 工程师 Day 59：Conversation Window：对话历史的裁剪策略

> **6 个月学习计划** | M3 - Context + Memory + Retrieval | Day 59/168
> 
> **今日主题**: 对话窗口

---

# Conversation Window：对话历史的裁剪策略

**一句话结论：LLM 的 Context Window（上下文窗口）是有限且昂贵的资源，Agent 的对话历史必须裁剪。三种主流策略——Sliding Window（滑动窗口）、Recent Messages（保留最近消息）、Summary（摘要压缩）——本质是在“信息完整性”与“成本/延迟”之间做取舍。工程上的黄金组合是：**System Prompt 和关键状态永久保留 + 摘要压缩中段历史 + 滑动窗口保留最近对话**。裁剪不当的直接后果是 Agent “失忆”：忘记用户偏好、丢失任务目标、重复提问，连续性崩塌。

---

## 一、背景与动机：为什么对话历史裁剪是 Agent 工程的必修课

在 6 个月 AI Agent 工程师路线的第三个月，你已经跨过了单轮调用的阶段，进入多轮交互、工具调用、状态管理的深水区。这时一个此前被掩盖的问题会浮出水面：**Agent 的对话历史是线性增长的，而 Context Window 不是**。

三个硬约束决定了你绕不开这个话题：

1. **Token 上限**：即使是 128K 甚至 1M token 的窗口，长程任务（客服工单处理、代码库分析、多步骤研究任务）也会触顶。超限直接报错。
2. **成本与延迟**：LLM 按 token 计费，每轮都携带全部历史，成本随轮数线性甚至超线性增长（如果触发缓存失效）。Attention 计算复杂度也让延迟随长度上升。
3. **“Lost in the Middle”效应**：即使窗口装得下，模型对中段信息的利用率也显著低于首尾。塞满历史 ≠ 模型记得。

所以问题的正确表述不是“要不要裁剪”，而是“**裁什么、留什么、怎么压**”。这就是 Conversation Window Management（对话窗口管理）的核心命题。

---

## 二、核心内容

### 2.1 三种裁剪策略：Sliding Window / Recent Messages / Summary

**Sliding Window（滑动窗口）**：维护一个固定大小为 N 的消息队列，每轮新消息入队，超出的旧消息出队。它是一个 FIFO（先进先出）结构，实现最简单，成本恒定。

它的致命缺陷也很明显：**窗口滑过的信息永久丢失**。如果用户在第 2 轮说“我是素食者”，第 30 轮让 Agent 推荐晚餐，滑窗策略下 Agent 会理直气壮地推荐红烧肉。

**Recent Messages（保留最近消息）**：严格说这是滑窗的语义化变体——不按“消息条数”裁剪，而是按 token 预算保留最近的消息，且通常有例外规则：System Prompt 永不裁剪、当前任务的工具调用结果尽量保留。它的工程价值在于把“裁剪”从机械操作变成**带优先级的保留策略**。

**Summary（摘要压缩）**：当历史超过阈值时，调用一次 LLM（或用廉价模型）把被裁掉的部分压缩成一段摘要文本，以一条 `summary` 消息的形式放回历史头部。信息不是被丢弃，而是**有损压缩**。

三者的本质差异：滑窗是“硬截断、零成本、信息全丢”；摘要是“软压缩、有额外成本、信息衰减但保留语义骨架”。

| 维度 | Sliding Window | Recent Messages | Summary |
|---|---|---|---|
| 实现复杂度 | 低 | 低-中 | 中-高 |
| 额外成本 | 无 | 无 | 每次压缩一次 LLM 调用 |
| 信息保留 | 差（窗口外全丢） | 差，但有优先级例外 | 好（语义级保留） |
| 延迟影响 | 降低 | 降低 | 压缩时短暂增加 |
| 长任务连续性 | 差 | 中 | 好 |
| 典型失效场景 | 忘记早期约束 | 忘记早期约束 | 摘要失真、细节丢失 |

工程直觉：**这三种策略不是互斥选项，而是可以组合的层次**。详见 2.4。

### 2.2 长对话的 Context 管理：分层心智模型

把 Agent 的上下文想象成一个分层存储结构，类似操作系统的内存层级：

```
┌──────────────────────────────���──────────┐
│  L1: System Prompt（永不裁剪）           │  ← 身份、规则、工具定义
├─────────────────────────────────────────┤
│  L2: Long-term State（持久化，按需注入） │  ← 用户画像、任务目标、关键事实
├─────────────────────────────────────────┤
│  L3: Summary Memory（压缩后的历史）      │  ← 滚动摘要，定期更新
├─────────────────────────────────────────┤
│  L4: Verbatim History（最近 N 轮原文）   │  ← 滑动窗口保留
└─────────────────────────────────────────┘
```

这个分层带来的关键转变是：**对话历史 ≠ Agent 记忆**。历史只是记忆的载体之一。把“必须记住的东西”（用户约束、任务状态、决策原因）显式抽取到 L2 的结构化状态中，把“可以压缩的叙事”交给 L3，把“需要原文细节的近期交互”留给 L4。

实践中的触发机制通常是这样：每轮结束后计算当前 prompt 总 token，超过预算的 70%~80% 就触发压缩——把 L4 中最旧的一段滚动进摘要。留 20%~30% 余量是为了容纳工具返回的大结果（一次搜索返回几千 token 很常见）。

另一个容易被忽视的点：**token 计数必须和实际调用一致**。用 `tiktoken` 估算和 API 实际计数有偏差，而且工具消息中的 JSON 结构、多模态内容都会显著增加实际占用。生产系统应该用 API 返回的 `usage.prompt_tokens` 做闭环校准。

### 2.3 裁剪对 Agent 连续性的影响：失忆的四种形态

裁剪不是中性的性能优化，它直接改变 Agent 的行为。裁剪不当的失忆有四种典型形态：

1. **约束遗忘**：用户早期声明的偏好/禁令丢失（“别用被动语态”），Agent 第 40 轮又开始用被动语态。滑窗策略的高发问题。
2. **目标漂移**：多步任务的原始目标被裁掉，Agent 开始解决一个“看起来相关但并非用户所要”的问题。
3. **指代断裂**：历史中残留的代词引用（“把它也改了”）指向已被裁剪的实体，Agent 猜错对象。
4. **重复提问**：Agent 忘了自己问过什么，陷入循环。这不仅是体验问题，在自动化评测中会直接判失败。

有一个反直觉的现象值得注意：**过度保留也会损害连续性**。塞满 100K 的原始历史，模型可能在旧上下文中被早期的不成熟讨论带偏（“上下文污染”），此时摘要策略反而表现出更好的连续性——因为摘要过滤掉了噪声。这说明裁剪策略的评估不能只看“丢了多少”，要看“留下的东西是否指向当前任务”。

评估连续性的实操方法：设计一组**跨轮依赖测试用例**——第 1 轮植入约束，第 N 轮（N 很大）验证约束是否被遵守。分别跑滑窗和摘要两个版本，对比通过率。这正是本日实践练习的核心。

### 2.4 Summary-based 压缩的实现：增量摘要与信息保真

摘要压缩的核心工程问题有两个：**何时触发**和**如何压缩不失真**。

**触发**：如上节所述，token 阈值触发。压缩粒度建议按“段”而非按“条”——每次把最早的 K 轮打包成增量摘要，追加到已有摘要后面，形成滚动摘要。

**增量摘要**是关键实现细节：不要每次都对全量历史重新摘要（成本高且会二次失真），而是：

```
new_summary = LLM_summarize(old_summary + 被裁掉的最近一段)
```

摘要 prompt 的设计直接决定信息保真度。一个可靠的模板应显式要求提取：

- **用户约束与偏好**（“素食”、“回复用中文”）
- **任务状态**（目标、已完成步骤、待办）
- **关键决策及其原因**（为什么选了方案 B）
- **重要实体与数值**（订单号、文件路径、API 版本）
- **未解决的问题**

这里有一个隐蔽的坑：**摘要的累积失真**。每轮摘要都是有损压缩，多次滚动后早期信息会被逐步稀释。对策是把“绝对不能丢”的信息（硬约束、关键 ID）在摘要之外再维护一份结构化的 bullet list，每次压缩时原样拼入摘要头部，形成“摘要 + 核心事实清单”的双保险结构。

---

## 三、参考实现

一个最小可用的混合裁剪器（Python 伪代码，依赖概念清晰优先）：

```python
from dataclasses import dataclass, field

@dataclass
class ConversationWindow:
    max_tokens: int = 8000
    keep_recent: int = 6              # L4: 保留最近 N 条消息原文
    summary: str = ""                 # L3: 滚动摘要
    facts: list[str] = field(default_factory=list)  # 硬约束清单
    messages: list[dict] = field(default_factory=list)  # L4 原文

    def add(self, msg: dict):
        self.messages.append(msg)
        if self._estimate_tokens() > self.max_tokens * 0.75:
            self._compress()

    def _estimate_tokens(self) -> int:
        text = self.summary + "".join(
            m.get("content", "") or "" for m in self.messages
        )
        return int(len(text) * 0.4)  # 粗估，生产应换 tiktoken 并闭环校准

    def _compress(self):
        # 取出最早的 messages，留最近 keep_recent 条
        evicted = self.messages[:-self.keep_recent]
        self.messages = self.messages[-self.keep_recent:]

        prompt = f"""将以下对话历史合并进既有摘要。必须保留：
1. 用户约束与偏好  2. 任务状态与待办  3. 关键决策及原因
4. 重要实体/数值  5. 未解决问题

既有摘要：
{self.summary}

新增对话：
{self._render(evicted)}

输出：更新后的摘要（300字内）+ 硬事实清单（JSON数组）。"""

        out = llm_call(prompt)          # 可用廉价模型
        self.summary, self.facts = parse(out)

    def render_for_llm(self) -> list[dict]:
        """组装最终发给 LLM 的消息序列"""
        prefix = f"[对话摘要]\n{self.summary}\n[核心事实]\n{self.facts}"
        return ([{"role": "system", "content": prefix}]
                if self.summary else []) + self.messages
```

流程全景图：

```
新消息入队 ──► token 超阈值(75%)? ──否──► 直接组装 prompt ──► 调用 LLM
                    │
                   是
                    ▼
        裁掉最早一段 ──► LLM 增量摘要 ──► 更新 summary + facts
                    │
                    ▼
        [System + Summary/Facts + 最近N条] ──► 调用 LLM
```

---

## 四、实践练习与思考题

**练习（本日核心任务）**：

1. 用上面的骨架实现两个独立的 `HistoryManager`：`SlidingWindowManager`（只滑窗）和 `SummaryManager`（滑窗 + 摘要）。
2. 构造一个 30+ 轮的测试对话，在第 2 轮植入约束（如“所有代码示例用 Python，不要用循环”），在第 25 轮要求写一段代码。
3. 对比两个版本的：约束遵守率、响应质量（主观打分）、总 token 消耗、总成本。

**思考题**：

1. 如果工具调用返回了 5000 token 的搜索结果，它应该被放进 L4 全量保留，还是压缩后保留？你的判断依据是什么？
2. 摘要压缩用 GPT-4 级模型还是便宜的小模型？成本和失真风险如何权衡？
3. 什么时候应该把信息从摘要层“提升”到结构化的 L2 状态层？（提示：信息被第二次引用时。）

---

## 五、与 Agent Engineering 的关联

对话窗口管理不是孤立的优化技巧，它是多个 Agent 工程主题的交汇点：

- **Memory 系统**：本文的 L2/L3/L4 分层就是 Agent Memory（短期记忆 vs 长期记忆）的具体实现。跨会话记忆（向量库检索历史）是下一步的自然延伸——检索到的记忆本质上也是“按需注入的上下文”。
- **Context Engineering**：裁剪策略是 Context Engineering 的核心子问题。LangGraph 的 `trim_messages`、LlamaIndex 的 `ContextWindowStrategies`，都是这个问题的框架级答案。
- **多 Agent 系统**：子 Agent 完成任务后向父 Agent 汇报时，汇报内容就是一次人工设计的 Summary 压缩。
- **成本工程**：在真实生产中，历史管理策略对单位会话成本的影响常常大于模型选型本身。

一句话：**Agent 的智能上限由模型决定，但长程任务中的可用智能，很大程度由上下文管理决定。**

---

## FAQ

**Q1：Sliding Window 简单免费，为什么还要费劲做 Summary？**
滑窗在 10 轮以内的短对话中完全够用。但长程任务（客服工单、研究型任务）中，早期约束和任务目标的丢失会直接导致任务失败。摘要用一次额外的廉价 LLM 调用，换来语义级的信息保留，在长对话场景下 ROI 明显。判断标准：对话是否会超过 15~20 轮、是否包含跨轮约束。

**Q2：现在模型窗口都到 1M token 了，还需要裁剪吗？**
需要，原因有三：成本（每轮全量历史，成本随轮数线性增长）、延迟（长 prompt 推理更慢）、Lost in the Middle（超长上下文中段利用率低）。大窗口改变的是“触顶频率”，不是“管理必要性”。

**Q3：摘要应该多久生成一次？**
事件驱动而非定时驱动：token 达到预算的 70%~80% 时触发。压缩粒度按“段”（如最早的 10 轮一批），避免每轮都压缩造成累积失真和成本浪费。

**Q4：如何防止摘要丢失关键信息？**
三层防护：① 摘要 prompt 显式列出必须保留的信息类别；② 维护独立的“核心事实清单”（硬约束、关键 ID），每次压缩原样保留；③ 对绝对关键的信息，在首次出现时就抽取到结构化状态层（L2），不依赖摘要链路。

**Q5：token 计数用什么工具？**
开发期用 `tiktoken` 按目标模型编码器估算；生产环境必须以 API 返回的 `usage.prompt_tokens` 做校准，因为工具消息的 JSON 结构、缓存命中规则都会造成估算偏差。留 20%~30% 的 token 余量给不可预测的工具返回。

---

## 参考资料

- LangGraph 文档：Managing Conversation History / `trim_messages` 用法
- OpenAI Cookbook：Context Window Management 与 token 计数实践
- Liu et al., *Lost in the Middle: How Language Models Use Long Contexts*（长上下文中段衰减效应）
- LlamaIndex 文档：Context Window Strategies for Agents
- Anthropic 文档：Long Context Handling 与 Prompt Caching（成本优化配套阅读）

---

## 📋 本日知识点清单

- [ ] Sliding Window / Recent Messages / Summary 的裁剪策略
- [ ] 长对话的 Context 管理
- [ ] 裁剪对 Agent 连续性的影响
- [ ] Summary-based 压缩的实现

## 📝 实践练习

实现 Sliding Window 和 Summary 两种裁剪策略，对比 Agent 连续性。

---

*本文是「AI Agent 工程师」6 个月学习计划的一部分。学习路线：LLM → Inference → Runtime → Harness → Memory → Environment → Evaluation → Production。目标：Agent / AI Systems Engineer。*
