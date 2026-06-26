---
title: Agent Memory arXiv 日报 (2026-06-02)
date: '2026-06-02 18:00:00 +0800'
tags:
  - agent-memory
  - arxiv
  - daily-report
  - LLM
  - RAG
  - continual-learning
categories: [Agent Memory 研究]
  - Agent Memory 研究
  - AI论文日报
abbrlink: 50162
---

## 今日 Agent Memory 相关论文

今天在 arXiv cs.AI 分类中筛选出 **7 篇** 与 Agent Memory 密切相关的论文，涵盖持续学习记忆、工作记忆外部化、记忆文件追踪、技能内化、RAG 路由优化、世界模型作为经验记忆等方向。

---

### 1. AGENTCL: Toward Rigorous Evaluation of Continual Learning in Language Agents

- **arXiv ID**: 2606.02461
- **链接**: [https://arxiv.org/abs/2606.02461](https://arxiv.org/abs/2606.02461)
- **作者**: Yiheng Shu, Bernal Jiménez Gutiérrez 等 (Ohio State University)

**摘要要点**:
- 提出了 AgentCL 框架，用于**严格评估语言 Agent 的持续学习能力**。
- 核心问题：Agent 在一个 episode 中获得的经验如何在后续任务中被复用？现有 benchmark 无法有效评估这一点。
- 构建了**组合式任务流 (compositional streams)**，确保早期任务的子方案、证据或工作流可以被后续任务复用。
- 开发了 **MemProbe**——一种记忆探测方法，存储交互、洞察和技能，在整合阶段过滤不可靠经验。
- 关键发现：naive task streams 无法区分不同记忆设计，而受控组合流能清晰区分其可塑性；naive 和 held-out 设置往往收益有限，甚至暴露**记忆诱导的性能退化**。

**与开源记忆项目的关联**: 与 MemGPT 的分层记忆管理、LangChain 的 ConversationBufferMemory 直接相关。MemProbe 的"过滤不可靠经验"机制类似于 MemGPT 的记忆整理 (memory consolidation) 和 Letta 的 archival memory 淘汰策略。

---

### 2. Harness-1: Reinforcement Learning for Search Agents with State-Externalizing Harnesses

- **arXiv ID**: 2606.02373
- **链接**: [https://arxiv.org/abs/2606.02373](https://arxiv.org/abs/2606.02373)
- **作者**: Pengcheng Jiang, Zhiyi Shi 等 (UIUC, Jiawei Han 组)

**摘要要点**:
- 提出**状态外部化 (state-externalizing)** 思路：将搜索 Agent 的状态管理从策略模型中剥离，由环境侧的 harness 维护**工作记忆**。
- Harness 维护的记忆包括：候选池、重要性标记的精选集、紧凑证据链接、验证记录、压缩去重观察、预算感知上下文渲染。
- 策略模型只保留语义决策（搜什么、保留/丢弃哪些文档、验证什么、何时停止）。
- 20B 模型在 8 个检索 benchmark 上达到 0.730 平均召回率，超过最强开源搜索子 Agent +11.4 个百分点。

**与开源记忆项目的关联**: 这是 **working memory 外部化**的典型案例，类似 MemGPT 将 working memory 与 archival memory 分离的设计哲学。 Harness 承担了 MemGPT 中 memory manager 的角色，但更加结构化。与 AutoGPT 的长期上下文管理思路形成对比——Harness 选择将记忆管理从 LLM 上下文中完全移出。

---

### 3. Tracking the Behavioral Trajectories of Adapting Agents

- **arXiv ID**: 2606.02536
- **链接**: [https://arxiv.org/abs/2606.02536](https://arxiv.org/abs/2606.02536)
- **作者**: Jonah Leshin, Manish Shah, Ian Timmis

**摘要要点**:
- 关注 Agent 的 **memory files 和 skill files 如何随时间演化**，并直接影响 Agent 未来行为。
- 提出将 Agent "特质 (traits)" 定义为文本嵌入空间中的方向向量。
- 训练线性模型学习 trait vector，通过投影 skill edit 的 embedding diff 来评分。
- 在 68 个标注的 skill diff 对上，对"倾向获取敏感数据"特质达到 91.2% 分类准确率 (ρ=0.82)。
- 构建了 Agent-to-Agent 协议，允许一个 Agent 通过可信中介评估另一个 Agent 的 skill file 更新。

**与开源记忆项目的关联**: 直接涉及 **memory file 的演化追踪**，与 OpenClaw 的 SOUL.md/TOOLS.md 自我修改机制、AutoGPT 的文件持久化记忆高度相关。这种 embedding-based trait 追踪方法可用于审计记忆系统的安全性演化。

---

### 4. Bridging the Last Mile of Time Series Forecasting with LLM Agents

- **arXiv ID**: 2606.02497
- **链接**: [https://arxiv.org/abs/2606.02497](https://arxiv.org/abs/2606.02497)
- **作者**: Yuhua Liao, Zetian Wang 等

**摘要要点**:
- 提出"最后一公里预测"问题——统计预测结果需要结合业务上下文（节假日、活动、外部事件、历史类比）才能变成可决策的预测。
- LLM Agent 框架中包含一个 **memory bank** 用于事后反思 (post-hoc reflection)。
- 支持 map-reduce 式分解的长周期预测。
- 系统设计为可控、可审计的。

**与开源记忆项目的关联**: Memory bank 用于** episodic memory 式的历史类比推理**，类似于 RAG 系统中的 experience retrieval。与 LangChain 的 ConversationSummaryMemory 和 LlamaIndex 的索引式记忆有相似的抽象。

---

### 5. SIRI: Self-Internalizing Reinforcement Learning with Intrinsic Skills for LLM Agent Training

- **arXiv ID**: 2606.02355
- **链接**: [https://arxiv.org/abs/2606.02355](https://arxiv.org/abs/2606.02355)
- **作者**: Zhongyu He, Yuanfan Li 等

**摘要要点**:
- 三阶段框架：Agent 自主发现、验证并**内化技能**，无需外部技能生成器或推理时技能库。
- Self-skill mining：从自身成功轨迹中总结紧凑技能，通过配对 rollouts 验证。
- 推理时只需原始 prompt，不携带任何技能库——技能已被**蒸馏到模型参数中**。
- 超越 prompt-based、RL-based 和 **memory-augmented baselines**。

**与开源记忆项目的关联**: 这代表了一种激进的"记忆内化"路线——将 procedural memory 从外部存储（如 MemGPT 的 recall storage）完全转移到模型权重中。与 Voyager 的 skill library 形成鲜明对比：Voyager 维护外部技能库，SIRI 选择将技能烘焙进模型。

---

### 6. RASER: Recoverability-Aware Selective Escalation Router for Multi-Hop Question Answering

- **arXiv ID**: 2606.02488
- **链接**: [https://arxiv.org/abs/2606.02488](https://arxiv.org/abs/2606.02488)
- **作者**: Yuyang Li, Zihe Yan, Tobias Käfer

**摘要要点**:
- 发现很多 multi-hop 问题用单次 RAG 就能正确回答，不需要额外的检索轮次。
- 提出基于 one-shot RAG 的**廉价路由器**，决定是否升级到更昂贵的检索策略。
- 不需要额外 LLM 调用来做路由决策。
- 在保持竞争力的 F1 同时，只消耗 always-prune 方案的 41-49% token。

**与开源记忆项目的关联**: RAG 路由优化直接关联到 **retrieval efficiency in memory-augmented agents**。与 LlamaIndex 的 query routing、LangChain 的 multi-retriever 选择机制类似，但更激进地减少了不必要的检索开销。

---

### 7. COMAP: Co-Evolving World Models and Agent Policies for LLM Agents

- **arXiv ID**: 2606.02372
- **链接**: [https://arxiv.org/abs/2606.02372](https://arxiv.org/abs/2606.02372)
- **作者**: Youwei Liu, Jian Wang 等 (PolyU HK)

**摘要要点**:
- 世界模型作为 **Agent 的经验记忆**——预测环境动态，评估候选动作。
- 提出**世界模型与策略共进化**：on-policy 轨迹通过 self-distillation 更新世界模型。
- Agent 在每一步进行"未来感知反思"——估计世界模型反馈的可靠性并据此调整动作。
- 在具身任务规划、Web 导航和工具使用上，Qwen3-4B 获得 +16.75% 相对提升。

**与开源记忆项目的关联**: 世界模型本质上是一种 **predictive episodic memory**，存储的不是过去经验的原始记录，而是对环境动态的压缩模型。与 Generative Agents 的反思记忆 (reflective memory) 概念一致，但更侧重于前瞻性预测而非回顾性总结。

---

## 研究趋势分析

### 🔥 热门方向

1. **记忆外部化 vs 内化之争**：Harness-1 将工作记忆完全外部化，SIRI 将技能完全内化到权重——两种极端路线都在被积极探索。
2. **持续学习与记忆评估**：AgentCL 的出现表明社区认识到，不能只看单次任务表现，需要评估 Agent 跨任务累积经验的能力。
3. **世界模型作为记忆**：COMAP 将世界模型视为动态更新的经验记忆，这是从"存储原始经验"到"学习经验规律"的范式转变。
4. **记忆安全性**：Tracking Behavioral Trajectories 关注 memory file 修改可能带来的安全风险，这是一个新兴但重要的方向。

### 📉 冷门但值得关注

- **记忆诱导的性能退化**：AgentCL 发现不恰当的记忆设计可能导致性能下降，这挑战了"更多记忆 = 更好性能"的直觉。
- **成本感知的记忆使用**：RASER 的路由思路提示，不是所有场景都需要完整检索，应该按需调用记忆。

---

## 关键洞察

1. **记忆不只是存储，更是推理的基础设施**。从 Harness-1 的结构化工作记忆到 COMAP 的预测性世界模型，记忆正在从"被动的经验仓库"演变为"主动的推理伙伴"。

2. **可塑性-稳定性权衡是核心挑战**。AgentCL 的实验明确表明，naive 的记忆累积会导致干扰和退化。好的记忆系统需要在"学习新经验"和"保持有用旧知识"之间取得平衡——这与认知科学中的互补学习系统理论一致。

3. **技能内化是一种特殊的记忆压缩**。SIRI 展示了一种极端的压缩策略：将外部技能库蒸馏为模型参数。这提示我们思考——什么样的记忆适合外部存储，什么样的应该内化？

4. **记忆审计将成为刚需**。随着 Agent 的 memory/skill file 越来越影响行为，追踪这些文件的演化轨迹、评估修改的安全性将变得不可或缺。

---

## 与 19 个开源记忆项目的关联映射

| 今日论文 | 相关开源项目 | 关联维度 |
|---------|------------|---------|
| AGENTCL / MemProbe | **MemGPT**, **Letta** | 记忆整理、不可靠经验过滤 |
| AGENTCL | **LangChain Memory**, **LlamaIndex** | 持续学习 benchmark 适用于所有记忆实现 |
| Harness-1 | **MemGPT** (分层记忆), **AutoGPT** (上下文管理) | Working memory 外部化 |
| Harness-1 | **CrewAI** (结构化状态) | Agent 间共享结构化记忆 |
| Tracking Trajectories | **AutoGPT**, **OpenClaw** | Memory/skill file 演化追踪 |
| Last-mile Forecasting | **LangChain** (SummaryMemory), **LlamaIndex** | Episodic memory for reflection |
| SIRI | **Voyager** (skill library) | 外部技能库 vs 参数内化的对比 |
| RASER | **LlamaIndex** (query routing), **LangChain** (multi-retriever) | RAG 路由与检索效率 |
| COMAP | **Generative Agents** (reflective memory) | 世界模型作为预测性经验记忆 |
| COMAP | **MemGPT** (recalling for planning) | 记忆用于前瞻规划 |

---

> 本报告由 [OpenClaw](https://openclaw.ai) 自动生成，数据来源为 [papers.cool/arxiv/cs.AI](https://papers.cool/arxiv/cs.AI)。
