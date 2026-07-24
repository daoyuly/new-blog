---
title: Agent Memory arXiv 日报 — 2026-06-30
tags:
  - Agent Memory
  - arXiv
  - Episodic Memory
  - World Model
  - Self-Evolving Agent
  - Belief State
categories:
  - Agent Memory 研究
abbrlink: 46938
date: 2026-06-30 18:00:00
noindex: true
---

# Agent Memory arXiv 日报 — 2026-06-30

今日扫描 cs.AI 最新论文，筛选出 3 篇与 Agent Memory 高度相关的工作。

---

## 📄 今日相关论文

### 1. Self-Evolving World Models for LLM Agent Planning

- **arXiv ID:** 2606.30639
- **链接:** [https://arxiv.org/abs/2606.30639](https://arxiv.org/abs/2606.30639) [Kimi解读](http://kimi.com/_prefill_chat?prefill_prompt=%E6%88%91%E4%BB%AC%E8%A6%81%E8%AE%A8%E8%AE%BA%E7%9A%84%E8%AE%BA%E6%96%87%E6%98%AF2606.30639%EF%BC%8C%E9%93%BE%E6%8E%A5%E6%98%AF%20https%3A//arxiv.org/pdf/2606.30639%20%EF%BC%8C%E5%B7%B2%E6%9C%89%E7%9A%84FAQ%E9%93%BE%E6%8E%A5%E6%98%AF%20https%3A//papers.cool/arxiv/kimi%3Fpaper%3D2606.30639%20%E3%80%82%E8%AF%B7%E4%BB%A5%E6%AD%A4%E4%B8%BA%E5%9F%BA%E7%A1%80%EF%BC%8C%E7%BB%A7%E7%BB%AD%E5%9B%9E%E7%AD%94%E6%88%91%E5%90%8E%E9%9D%A2%E7%9A%84%E9%97%AE%E9%A2%98%E3%80%82&system_prompt=%E4%BD%A0%E6%98%AF%E4%B8%80%E4%B8%AA%E5%AD%A6%E6%9C%AF%E5%8A%A9%E6%89%8B%EF%BC%8C%E5%90%8E%E9%9D%A2%E7%9A%84%E5%AF%B9%E8%AF%9D%E5%B0%86%E5%9B%B4%E7%BB%95%E7%9D%80%E4%BB%A5%E4%B8%8B%E8%AE%BA%E6%96%87%E5%86%85%E5%AE%B9%E8%BF%9B%E8%A1%8C%EF%BC%8C%E5%B7%B2%E7%BB%8F%E9%80%9A%E8%BF%87%E9%93%BE%E6%8E%A5%E7%BB%99%E5%87%BA%E4%BA%86%E8%AE%BA%E6%96%87%E7%9A%84PDF%E5%92%8C%E8%AE%BA%E6%96%87%E5%B7%B2%E6%9C%89%E7%9A%84FAQ%E3%80%82%E7%94%A8%E6%88%B7%E5%B0%86%E7%BB%A7%E7%BB%AD%E5%90%91%E4%BD%A0%E5%92%A8%E8%AF%A2%E8%AE%BA%E6%96%87%E7%9A%84%E7%9B%B8%E5%85%B3%E9%97%AE%E9%A2%98%EF%BC%8C%E8%AF%B7%E4%BD%A0%E4%BD%9C%E5%87%BA%E4%B8%93%E4%B8%9A%E7%9A%84%E5%9B%9E%E7%AD%94%EF%BC%8C%E4%B8%8D%E8%A6%81%E5%87%BA%E7%8E%B0%E7%AC%AC%E4%B8%80%E4%BA%BA%E7%A7%B0%EF%BC%8C%E5%BD%93%E6%B6%89%E5%8F%8A%E5%88%B0%E5%88%86%E7%82%B9%E5%9B%9E%E7%AD%94%E6%97%B6%EF%BC%8C%E9%BC%93%E5%8A%B1%E4%BD%A0%E4%BB%A5markdown%E6%A0%BC%E5%BC%8F%E8%BE%93%E5%87%BA%E3%80%82&send_immediately=true)
- **作者:** Wenxuan Zhang, See-Kiong Ng, Yang Deng

**摘要要点：** 提出 WorldEvolver，一个自进化世界模型框架，在部署时通过记忆修订提升 Agent 规划能力，**冻结模型参数**。核心三模块：
- **Episodic Memory**：通过检索式模拟利用真实动作转移经验
- **Semantic Memory**：从预测-观察偏差中提取持久启发式规则
- **Selective Foresight**：过滤低置信度预测后再注入推理上下文

在 ALFWorld 和 ScienceWorld 上达到最高预测准确率和下游 Agent 成功率。

**记忆类型映射：** Episodic Memory（情景记忆）+ Semantic Memory（语义记忆）的双记忆架构，是认知科学经典分层在 LLM Agent 中的直接应用。

---

### 2. BayesEvolve: Explicit Belief States for Autonomous Scientific Discovery

- **arXiv ID:** 2606.30335
- **链接:** [https://arxiv.org/abs/2606.30335](https://arxiv.org/abs/2606.30335) [Kimi解读](http://kimi.com/_prefill_chat?prefill_prompt=%E6%88%91%E4%BB%AC%E8%A6%81%E8%AE%A8%E8%AE%BA%E7%9A%84%E8%AE%BA%E6%96%87%E6%98%AF2606.30335%EF%BC%8C%E9%93%BE%E6%8E%A5%E6%98%AF%20https%3A//arxiv.org/pdf/2606.30335%20%EF%BC%8C%E5%B7%B2%E6%9C%89%E7%9A%84FAQ%E9%93%BE%E6%8E%A5%E6%98%AF%20https%3A//papers.cool/arxiv/kimi%3Fpaper%3D2606.30335%20%E3%80%82%E8%AF%B7%E4%BB%A5%E6%AD%A4%E4%B8%BA%E5%9F%BA%E7%A1%80%EF%BC%8C%E7%BB%A7%E7%BB%AD%E5%9B%9E%E7%AD%94%E6%88%91%E5%90%8E%E9%9D%A2%E7%9A%84%E9%97%AE%E9%A2%98%E3%80%82&system_prompt=%E4%BD%A0%E6%98%AF%E4%B8%80%E4%B8%AA%E5%AD%A6%E6%9C%AF%E5%8A%A9%E6%89%8B%EF%BC%8C%E5%90%8E%E9%9D%A2%E7%9A%84%E5%AF%B9%E8%AF%9D%E5%B0%86%E5%9B%B4%E7%BB%95%E7%9D%80%E4%BB%A5%E4%B8%8B%E8%AE%BA%E6%96%87%E5%86%85%E5%AE%B9%E8%BF%9B%E8%A1%8C%EF%BC%8C%E5%B7%B2%E7%BB%8F%E9%80%9A%E8%BF%87%E9%93%BE%E6%8E%A5%E7%BB%99%E5%87%BA%E4%BA%86%E8%AE%BA%E6%96%87%E7%9A%84PDF%E5%92%8C%E8%AE%BA%E6%96%87%E5%B7%B2%E6%9C%89%E7%9A%84FAQ%E3%80%82%E7%94%A8%E6%88%B7%E5%B0%86%E7%BB%A7%E7%BB%AD%E5%90%91%E4%BD%A0%E5%92%A8%E8%AF%A2%E8%AE%BA%E6%96%87%E7%9A%84%E7%9B%B8%E5%85%B3%E9%97%AE%E9%A2%98%EF%BC%8C%E8%AF%B7%E4%BD%A0%E4%BD%9C%E5%87%BA%E4%B8%93%E4%B8%9A%E7%9A%84%E5%9B%9E%E7%AD%94%EF%BC%8C%E4%B8%8D%E8%A6%81%E5%87%BA%E7%8E%B0%E7%AC%AC%E4%B8%80%E4%BA%BA%E7%A7%B0%EF%BC%8C%E5%BD%93%E6%B6%89%E5%8F%8A%E5%88%B0%E5%88%86%E7%82%B9%E5%9B%9E%E7%AD%94%E6%97%B6%EF%BC%8C%E9%BC%93%E5%8A%B1%E4%BD%A0%E4%BB%A5markdown%E6%A0%BC%E5%BC%8F%E8%BE%93%E5%87%BA%E3%80%82&send_immediately=true)
- **作者:** Xuening Wu, Shan Yu, Qianya Xu, Shenqin Yin

**摘要要点：** 指出现有科学发现 Agent 仅依赖"实验记忆"（高分候选存档或启发式摘要）的局限，提出用显式的**不确定性感知信念状态（Belief State）**替代简单记忆存档。BayesEvolve 将实验证据转化为预测性信念状态来指导后续实验，在 BBOB 黑盒优化任务上显著优于 memory-guided 和 archive-guided LLM 基线。

**记忆类型映射：** 从"存档式记忆"升级为"信念状态"——本质上是对记忆的结构化推理，而非简单存储和检索。

---

### 3. ManimAgent: Self-Evolving Multimodal Agents for Visual Education

- **arXiv ID:** 2606.30296
- **链接:** [https://arxiv.org/abs/2606.30296](https://arxiv.org/abs/2606.30296) [Kimi解读](http://kimi.com/_prefill_chat?prefill_prompt=%E6%88%91%E4%BB%AC%E8%A6%81%E8%AE%A8%E8%AE%BA%E7%9A%84%E8%AE%BA%E6%96%87%E6%98%AF2606.30296%EF%BC%8C%E9%93%BE%E6%8E%A5%E6%98%AF%20https%3A//arxiv.org/pdf/2606.30296%20%EF%BC%8C%E5%B7%B2%E6%9C%89%E7%9A%84FAQ%E9%93%BE%E6%8E%A5%E6%98%AF%20https%3A//papers.cool/arxiv/kimi%3Fpaper%3D2606.30296%20%E3%80%82%E8%AF%B7%E4%BB%A5%E6%AD%A4%E4%B8%BA%E5%9F%BA%E7%A1%80%EF%BC%8C%E7%BB%A7%E7%BB%AD%E5%9B%9E%E7%AD%94%E6%88%91%E5%90%8E%E9%9D%A2%E7%9A%84%E9%97%AE%E9%A2%98%E3%80%82&system_prompt=%E4%BD%A0%E6%98%AF%E4%B8%80%E4%B8%AA%E5%AD%A6%E6%9C%AF%E5%8A%A9%E6%89%8B%EF%BC%8C%E5%90%8E%E9%9D%A2%E7%9A%84%E5%AF%B9%E8%AF%9D%E5%B0%86%E5%9B%B4%E7%BB%95%E7%9D%80%E4%BB%A5%E4%B8%8B%E8%AE%BA%E6%96%87%E5%86%85%E5%AE%B9%E8%BF%9B%E8%A1%8C%EF%BC%8C%E5%B7%B2%E7%BB%8F%E9%80%9A%E8%BF%87%E9%93%BE%E6%8E%A5%E7%BB%99%E5%87%BA%E4%BA%86%E8%AE%BA%E6%96%87%E7%9A%84PDF%E5%92%8C%E8%AE%BA%E6%96%87%E5%B7%B2%E6%9C%89%E7%9A%84FAQ%E3%80%82%E7%94%A8%E6%88%B7%E5%B0%86%E7%BB%A7%E7%BB%AD%E5%90%91%E4%BD%A0%E5%92%A8%E8%AF%A2%E8%AE%BA%E6%96%87%E7%9A%84%E7%9B%B8%E5%85%B3%E9%97%AE%E9%A2%98%EF%BC%8C%E8%AF%B7%E4%BD%A0%E4%BD%9C%E5%87%BA%E4%B8%93%E4%B8%9A%E7%9A%84%E5%9B%9E%E7%AD%94%EF%BC%8C%E4%B8%8D%E8%A6%81%E5%87%BA%E7%8E%B0%E7%AC%AC%E4%B8%80%E4%BA%BA%E7%A7%B0%EF%BC%8C%E5%BD%93%E6%B6%89%E5%8F%8A%E5%88%B0%E5%88%86%E7%82%B9%E5%9B%9E%E7%AD%94%E6%97%B6%EF%BC%8C%E9%BC%93%E5%8A%B1%E4%BD%A0%E4%BB%A5markdown%E6%A0%BC%E5%BC%8F%E8%BE%93%E5%87%BA%E3%80%82&send_immediately=true)
- **作者:** Wenjia Jiang, Zongyuan Cai, Yuanhang Shao 等

**摘要要点：** 解决多轮反思经验跨任务丢失的问题。ManimAgent 通过**双通道情景记忆库（Episodic Memory Bank）**将反思经验跨任务迁移：
- **M+（正向通道）**：存储成功理由，作为软参考示例
- **M-（负向通道）**：存储验证过的失败模式，作为硬性已知陷阱

记忆完全从自身任务流中生长，无需权重更新或人工种子。随着记忆规模增长，人工盲评 Pass@1 持续上升，反思轮次下降。

**记忆类型映射：** 正/负双通道情景记忆，与 RAG 基线对比验证了结构化记忆优于简单检索。

---

## 📊 研究趋势分析

### 热门方向

| 方向 | 今日论文 | 趋势 |
|------|---------|------|
| **情景记忆（Episodic Memory）** | WorldEvolver, ManimAgent | 🔥🔥🔥 持续升温 |
| **记忆驱动的自我进化** | WorldEvolver, ManimAgent | 🔥🔥 新兴热点 |
| **记忆 vs 信念状态** | BayesEvolve | 🔥🔥 概念升级 |
| **双通道/分层记忆架构** | WorldEvolver, ManimAgent | 🔥🔥 架构趋同 |
| **无需训练的测试时记忆更新** | WorldEvolver, ManimAgent | 🔥 实用化方向 |

### 关键观察

1. **情景记忆成为标配**：3 篇论文中有 2 篇显式使用 Episodic Memory，且都强调跨任务经验迁移而非单任务内反思。
2. **"记忆不仅是存储"成为共识**：BayesEvolve 明确批评 archive-based memory 的不足，主张用信念状态替代；WorldEvolver 用 Semantic Memory 对 Episodic Memory 进行规则提炼。
3. **正/负经验分离存储**：ManimAgent 的 M+/M- 双通道设计是今天最有创意的记忆架构创新，将成功与失败经验结构化区分。
4. **测试时自进化**：三篇论文都不约而同地选择了冻结模型参数、通过外部记忆在推理时进化的路线，而非微调。

---

## 💡 关键洞察与创新点

### 1. 记忆的双重抽象

WorldEvolver 的 Episodic → Semantic 提炼链路，揭示了 Agent Memory 的关键问题：**原始经验需要抽象为可复用规则**。这与人类认知中情景记忆→语义记忆的转化过程一致。

### 2. 信念状态 > 存档记忆

BayesEvolve 的核心洞察是：**记忆应该是有结构的信念，而非无序的存档**。简单的 RAG 检索高分候选，缺乏不确定性建模，Agent 不知道自己不知道什么。

### 3. 失败经验的硬约束

ManimAgent 的 M- 通道将失败模式作为"硬约束"而非"软参考"，这与传统 RAG 只检索正样本形成鲜明对比。**知道什么不能做，和知道什么能做一样重要。**

---

## 🔗 与 19 个开源记忆项目的关联

| 论文 | 最相关开源项目 | 关联分析 |
|------|--------------|---------|
| WorldEvolver | **MemGPT** | 都采用分层记忆（Episodic/Semantic），但 WorldEvolver 专注于世界模型预测场景，MemGPT 面向通用对话 |
| WorldEvolver | **LangChain Memory** | LangChain 的 ConversationBuffer/Summary 可对应 Episodic/Semantic 分层，但缺乏 WorldEvolver 的自动规则提取机制 |
| BayesEvolve | **MemGPT** | MemGPT 的核心记忆管理（recall/recopy）本质上也是维护信念状态，但缺乏 BayesEvolve 的显式不确定性建模 |
| BayesEvolve | **AutoGPT** | AutoGPT 的长期记忆是典型的 archive-based，BayesEvolve 恰恰批评了这种方式的局限 |
| ManimAgent | **Voyager** | Voyager 的 Skill Library 与 M+ 通道类似（存储成功技能），但缺乏 M- 失败通道的硬约束 |
| ManimAgent | **Reflexion** | Reflexion 也做反思经验迁移，但用的是自然语言摘要，ManimAgent 用 VLM 评分的结构化信号更可靠 |
| 三篇共同 | **LlamaIndex** | LlamaIndex 作为 RAG 框架，是三篇论文共同对比的基线技术；论文结论一致表明结构化记忆 > 朴素 RAG |

### 开源项目的启示

- **MemGPT 最接近今日论文的思想**，但其记忆管理仍偏重对话场景，缺乏世界模型和信念状态建模
- **Voyager 的 Skill Library** 可以借鉴 ManimAgent 的双通道设计，增加失败模式库
- **朴素 RAG（LlamaIndex 等）** 在 Agent Memory 场景下已显不足，需要向结构化、不确定性感知的方向演进

---

## 📝 总结

今日 Agent Memory 领域的核心信号：**记忆正在从"存储-检索"范式向"信念-推理"范式演进**。无论是 WorldEvolver 的情景→语义提炼、BayesEvolve 的信念状态替代存档、还是 ManimAgent 的正负双通道，都在指向同一个方向——Agent 的记忆不应该只是存东西的地方，而应该是能思考、能推理、能知道不确定性的认知基础设施。

---

*本报告由 OpenClaw 自动生成，数据来源：[papers.cool/arxiv/cs.AI](https://papers.cool/arxiv/cs.AI)*
