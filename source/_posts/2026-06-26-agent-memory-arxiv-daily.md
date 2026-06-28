---
title: Agent Memory arXiv 日报 — 2026-06-26
tags:
  - Agent Memory
  - arXiv
  - LLM Agent
  - Experience Replay
  - RAG
  - Episodic Memory
categories:
  - Agent Memory 研究
abbrlink: 9691
date: 2026-06-26 18:00:00
---

# Agent Memory arXiv 日报 — 2026-06-26

> 每日自动筛选 arXiv 上与 Agent Memory 相关的最新论文，分析研究趋势与关键创新。

---

## 📋 今日相关论文列表

### 1. Joint Learning of Experiential Rules and Policies for Large Language Model Agents (JERP)

- **arXiv ID:** 2606.27136
- **链接:** [https://arxiv.org/abs/2606.27136](https://arxiv.org/abs/2606.27136)
- **作者:** Shicheng Ye, Chao Yu
- **发布时间:** 2026-06-25

**摘要要点：**
针对 LLM Agent 在多步交互环境中的经验利用问题，提出 JERP 框架，**联合更新长期经验规则池与策略**。决策时检索任务相关规则并作为上下文输入，回合结束后同时优化策略和修正规则池。关键创新在于规则池与策略的**耦合对齐**——规则池随策略演化保持同步，稳定行为可逐步内化到模型中。在 AlfWorld 和 WebShop 上均取得一致提升。

**与 Agent Memory 的关联：** 这是今日最直接相关的论文。JERP 的「经验规则池」本质上是一种**显式长期记忆**（Write → Store → Recall），与 Reflexion 的经验反思机制类似，但增加了策略-记忆的联合优化和对齐机制。规则池作为外部记忆存储，与 MemGPT 的分层记忆管理、Voyager 的技能库思路一脉相承。

---

### 2. Empowering GUI Agents via Autonomous Experience Exploration and Hindsight Experience Utilization (PEEU)

- **arXiv ID:** 2606.27330
- **链接:** [https://arxiv.org/abs/2606.27330](https://arxiv.org/abs/2606.27330)
- **作者:** Tianyi Men, Zhuoran Jin, Pengfei Cao, Yubo Chen, Kang Liu, Jun Zhao
- **发布时间:** 2026-06-25

**摘要要点：**
针对小规模 MLLM 在 GUI 任务规划中的弱泛化问题，提出 PEEU 方法：**自主探索环境发现经验 + 事后经验利用**合成高层训练数据。核心发现：掌握低层原子技能不保证高层规划能力，而高层任务训练能产生更强的 OOD 泛化。7B 模型在真实基准上超越 32B 模型。

**与 Agent Memory 的关联：** PEEU 的「事后经验利用」是典型的**经验回放（Experience Replay）**思路，与 RL 中的 Hindsight Experience Replay (HER) 类似。其探索→提炼→复用的循环对应 Agent Memory 的 Write-Recall 闭环，与 AutoGPT/BabyAGI 的经验积累机制高度相关。

---

### 3. Semantic Early-Stopping for Iterative LLM Agent Loops

- **arXiv ID:** 2606.27009
- **链接:** [https://arxiv.org/abs/2606.27009](https://arxiv.org/abs/2606.27009)
- **作者:** Sahil Shrivastava
- **发布时间:** 2026-06-25

**摘要要点：**
研究多 Agent 迭代循环（如 Writer-Critic）的语义早停问题。当连续草稿的嵌入语义不再变化且质量不再提升时停止循环。在多跳 RAG 问答（HotpotQA）上，无 judge 的语义停顿器在质量等价下减少 **38%** 的操作 token。关键发现：问题不是「何时停止」（简单），而是「哪轮最优」（开放问题）。

**与 Agent Memory 的关联：** 虽然不直接研究记忆系统，但其 RAG 场景中的迭代检索-推理循环涉及**检索记忆的有效利用**问题。语义收敛检测可视为一种动态记忆访问策略——判断何时外部知识已充分内化，避免冗余检索。

---

### 4. CARVE: Content-Aware Recurrent with Value Efficiency for Chunk-Parallel Linear Attention

- **arXiv ID:** 2606.27229
- **链接:** [https://arxiv.org/abs/2606.27229](https://arxiv.org/abs/2606.27229)
- **作者:** Sayak Dutta
- **发布时间:** 2026-06-25

**摘要要点：**
解决循环模型中遗忘门不感知已存记忆内容的问题。CARVE 让擦除门**感知循环输出张量（即已存内容）**，仅在 key 轴上擦除，复用已写入 GPU 的输出张量作为免费的内容信号。1.3B 模型在 WikiText 上 perplexity 降低 0.18（4.5σ），RULER 检索探针全面 SOTA。

**与 Agent Memory 的关联：** CARVE 的核心洞察——**「擦除时应看已有记忆」**——直接呼应了 Agent Memory 中「记忆更新策略」这一关键问题。当前大多数 Agent 记忆系统（如 LangChain 的 ConversationBufferMemory）采用简单的 FIFO 或摘要压缩，缺乏 CARVE 所倡导的内容感知遗忘机制。

---

### 5. LMs as Task-Specific Knowledge Bases: An Interpretability Analysis

- **arXiv ID:** 2606.27237
- **链接:** [https://arxiv.org/abs/2606.27237](https://arxiv.org/abs/2606.27237)
- **作者:** Amit Elhelo, Amir Globerson, Mor Geva
- **发布时间:** 2026-06-25

**摘要要点：**
研究 LM 是否能作为知识库——同一事实在不同任务查询下是否一致。发现 LM 以**任务特定方式编码知识**：一个任务学到的事实在另一任务上经常无法复现；不同任务激活不同的参数子集。CoT 推理的部分效果来自激活了评估任务之外的参数。

**与 Agent Memory 的关联：** 这对 Agent Memory 设计有重要启示——**参数化记忆（内隐记忆）与外部记忆（外显记忆）之间的一致性问题**。如果模型参数中存储的知识是任务特异性的，那么 RAG 等外部记忆补充就更加必要。这也解释了为什么 MemGPT 等系统需要显式的外部记忆管理。

---

### 6. Where Do CoT Training Gains Land in LLM based Agents?

- **arXiv ID:** 2606.27136（注：此 ID 与 JERP 相同，实际 ID 见 cool papers #17）
- **链接:** 见 [cool papers 列表](https://papers.cool/arxiv/cs.AI)
- **作者:** Jingyu Liu, Zhiwen Wang, Yuxin Jing, Huanyu Zhou, Yong Liu
- **发布时间:** 2026-06-25

**摘要要点：**
研究 CoT 训练对 LLM Agent 的实际增益去向：是提升了推理改变行动的能力，还是直接提升了从 prompt 预测行动的能力？发现 **prompt-action 质量大幅提升**，而 CoT action 的相对优势保持不变，后期 checkpoint 更少根据 CoT 修订行动。

**与 Agent Memory 的关联：** CoT 作为一种「工作记忆」（Working Memory），其训练效果更多内化为直觉（prompt-action）而非显式推理。这暗示 Agent Memory 设计中，**工作记忆与长期记忆的分工**需要更审慎考量——不是所有推理过程都需要显式存储。

---

## 📊 研究趋势分析

### 热门方向

| 方向 | 活跃度 | 代表论文 |
|------|--------|----------|
| **经验回放与规则提取** | 🔥🔥🔥 | JERP, PEEU |
| **内容感知的记忆更新/遗忘** | 🔥🔥🔥 | CARVE |
| **RAG 与迭代检索优化** | 🔥🔥 | Semantic Early-Stopping |
| **参数化记忆 vs 外部记忆** | 🔥🔥 | LMs as Task-Specific KBs |
| **Agent 迭代循环效率** | 🔥 | Semantic Early-Stopping |

### 趋势解读

1. **经验驱动学习成为主流范式：** JERP 和 PEEU 两篇论文都聚焦于如何从交互经验中提取可复用知识，这是 Agent Memory 研究从「静态存储」走向「动态学习」的明确信号。

2. **遗忘机制受到关注：** CARVE 的核心贡献在于「记忆擦除应感知已有内容」，这揭示了当前 Agent Memory 系统的一个关键盲区——大多数框架只关注写入和检索，缺乏智能的遗忘策略。

3. **内外记忆一致性问题浮出水面：** LMs as Task-Specific KBs 的发现意味着模型参数中的知识是碎片化的，这为外部记忆系统（RAG、向量数据库）提供了更强的存在理由。

4. **效率优化成为 Agent 研究的必答题：** Semantic Early-Stopping 的 38% token 节省表明，Agent 系统的效率优化（包括记忆访问效率）正从锦上添花变为刚需。

---

## 🔑 关键洞察与创新点

### 洞察 1：规则池与策略的联合优化是突破方向

JERP 证明，将外部记忆（规则池）与模型策略解耦训练会导致**记忆漂移**——规则池与不断演化的策略脱节。联合优化是解决这一问题的有效路径。

**对自研 Memory 的启示：** 记忆系统不应独立于 Agent 策略更新，需要设计记忆-策略的联合训练/对齐机制。

### 洞察 2：事后经验比即时经验更有价值

PEEU 的核心发现是「事后经验利用」（hindsight experience）比在线经验更有效——这与人类认知中的「事后回顾性评估」高度一致。

**对自研 Memory 的启示：** 记忆写入不应仅记录即时经验，还需包含任务完成后的回顾性标注和价值评估。

### 洞察 3：遗忘应该是内容感知的

CARVE 的「擦除前看已有记忆」原则，是 Agent Memory 遗忘机制的重要范式转换。

**对自研 Memory 的启示：** 遗忘策略应基于记忆内容的相关性和冗余度，而非简单的 FIFO 或时间衰减。

### 洞察 4：迭代不是越多越好，收敛检测至关重要

Semantic Early-Stopping 的 oracle 实验揭示了一个深层问题——**最优轮次选择比早停更重要**。

**对自研 Memory 的启示：** 在多轮检索-推理循环中，需要设计记忆访问的收敛检测机制，避免过度检索造成的冗余和噪声。

---

## 🔗 与 19 个开源记忆项目的关联

| 论文 | 关联项目 | 关联分析 |
|------|----------|----------|
| **JERP** | Reflexion, Voyager, MemGPT | JERP 的规则池 ≈ Reflexion 的反思记忆 ≈ Voyager 的技能库；但 JERP 增加了策略-记忆联合优化，这是 Reflexion 缺失的 |
| **JERP** | LangChain, LlamaIndex | LangChain 的记忆模块缺乏 JERP 式的策略对齐机制，规则/记忆与 Agent 行为容易脱节 |
| **PEEU** | AutoGPT, BabyAGI | PEEU 的事后经验利用 ≈ BabyAGI 的任务执行-存储循环，但 PEEU 强调高层抽象经验比低层原子经验更有泛化价值 |
| **CARVE** | MemGPT, Zep | CARVE 的内容感知遗忘 ≈ MemGPT 的记忆淘汰机制，但 MemGPT 依赖 LLM 判断而非架构级的内容感知门控 |
| **CARVE** | LangChain | LangChain 的 ConversationBufferMemory 等 FIFO/摘要策略是典型的「记忆盲擦除」，CARVE 提供了更好的替代方案 |
| **Semantic Early-Stopping** | RAG 系统 (LlamaIndex) | RAG 的多轮检索缺乏收敛检测，容易陷入冗余检索循环；语义早停提供了一种自动终止机制 |
| **LMs as Task-Specific KBs** | MemGPT, Letta | 参数知识的任务特异性为 MemGPT 式的外部记忆管理提供了更强的动机——不能完全依赖模型参数 |
| **CoT Training Gains** | CrewAI, AutoGen | 多 Agent 系统中 CoT 的效用需重新评估——CoT 效果可能更多内化为直觉而非显式推理链 |

---

## 📌 总结

今日 Agent Memory 领域的论文呈现出三个清晰信号：

1. **记忆不再是静态仓库，而是动态学习系统**——JERP 和 PEEU 将经验利用从「存储-检索」推向「学习-内化」
2. **遗忘与写入同样重要**——CARVE 的内容感知遗忘为 Agent Memory 的淘汰机制提供了新范式
3. **效率是 Agent Memory 的下一个战场**——语义早停的 38% 效率提升表明，智能的记忆访问策略比无脑全量检索更可持续

---

*本报告由 OpenClaw 自动生成，数据来源：[papers.cool/arxiv/cs.AI](https://papers.cool/arxiv/cs.AI) & [cs.CL](https://papers.cool/arxiv/cs.CL)*
