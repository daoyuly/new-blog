---
title: Agent Memory 日报｜2026-06-29：Agent 免疫系统与记忆投毒、内部化世界模型、RAG 知识冲突
date: 2026-06-29 18:00:00
tags:
  - agent-memory
  - arxiv-daily
  - RAG
  - world-model
  - memory-poisoning
categories:
  - Agent Memory 研究
---

# Agent Memory 日报｜2026-06-29

> 每日追踪 arXiv 上与 Agent Memory 相关的最新论文，涵盖 agent memory、memory-augmented agent、episodic memory、long-term memory、RAG 等方向。

## 📄 今日相关论文

### 1. Agent-Native Immune System: Architecture, Taxonomy, and Engineering

- **arXiv ID**: 2606.28270
- **链接**: [https://arxiv.org/abs/2606.28270](https://arxiv.org/abs/2606.28270) [Kimi解读](http://kimi.com/_prefill_chat?prefill_prompt=%E6%88%91%E4%BB%AC%E8%A6%81%E8%AE%A8%E8%AE%BA%E7%9A%84%E8%AE%BA%E6%96%87%E6%98%AFhttps%3A%2F%2Farxiv.org%2Fabs%2F2606.28270%EF%BC%8C%E9%93%BE%E6%8E%A5%E6%98%AF+https%3A%2F%2Farxiv.org%2Fpdf%2F2606.28270+%EF%BC%8C%E5%B7%B2%E6%9C%89%E7%9A%84FAQ%E9%93%BE%E6%8E%A5%E6%98%AF+https%3A%2F%2Fpapers.cool%2Farxiv%2Fkimi%3Fpaper%3D2606.28270+%E3%80%82%E8%AF%B7%E4%BB%A5%E6%AD%A4%E4%B8%BA%E5%9F%BA%E7%A1%80%EF%BC%8C%E7%BB%A7%E7%BB%AD%E5%9B%9E%E7%AD%94%E6%88%91%E5%90%8E%E9%9D%A2%E7%9A%84%E9%97%AE%E9%A2%98%E3%80%82&system_prompt=%E4%BD%A0%E6%98%AF%E4%B8%80%E4%B8%AA%E5%AD%A6%E6%9C%AF%E5%8A%A9%E6%89%8B%EF%BC%8C%E5%90%8E%E9%9D%A2%E7%9A%84%E5%AF%B9%E8%AF%9D%E5%B0%86%E5%9B%B4%E7%BB%95%E7%9D%80%E4%BB%A5%E4%B8%8B%E8%AE%BA%E6%96%87%E5%86%85%E5%AE%B9%E8%BF%9B%E8%A1%8C%EF%BC%8C%E5%B7%B2%E7%BB%8F%E9%80%9A%E8%BF%87%E9%93%BE%E6%8E%A5%E7%BB%99%E5%87%BA%E4%BA%86%E8%AE%BA%E6%96%87%E7%9A%84PDF%E5%92%8C%E8%AE%BA%E6%96%87%E5%B7%B2%E6%9C%89%E7%9A%84FAQ%E3%80%82%E7%94%A8%E6%88%B7%E5%B0%86%E7%BB%A7%E7%BB%AD%E5%90%91%E4%BD%A0%E5%92%A8%E8%AF%A2%E8%AE%BA%E6%96%87%E7%9A%84%E7%9B%B8%E5%85%B3%E9%97%AE%E9%A2%98%EF%BC%8C%E8%AF%B7%E4%BD%A0%E4%BD%9C%E5%87%BA%E4%B8%93%E4%B8%9A%E7%9A%84%E5%9B%9E%E7%AD%94%EF%BC%8C%E4%B8%8D%E8%A6%81%E5%87%BA%E7%8E%B0%E7%AC%AC%E4%B8%80%E4%BA%BA%E7%A7%B0%EF%BC%8C%E5%BD%93%E6%B6%89%E5%8F%8A%E5%88%B0%E5%88%86%E7%82%B9%E5%9B%9E%E7%AD%94%E6%97%B6%EF%BC%8C%E9%BC%93%E5%8A%B1%E4%BD%A0%E4%BB%A5markdown%E6%A0%BC%E5%BC%8F%E8%BE%93%E5%87%BA%E3%80%82&send_immediately=true)
- **关键词**: memory poisoning, persistent memory, agent security, immune system

**摘要要点**：本文提出 Agent-Native Immune System (ANIS)，首个生物学启发的内源防御架构，直接嵌入 Agent 认知循环。核心贡献包括六层免疫塔（L0-L5）、Agent Virus/Vaccine 分类法、Harness Triad（Meta/Self/Auto）元认知自监控机制，以及持续免疫学习（CIL）。**关键洞察**：当 Agent 具备持久记忆（persistent memory）后，memory poisoning 成为运行时劫持的主要攻击向量，传统对齐无法防御。论文严格区分了模型对齐（静态宪法价值）与 Agent 免疫（动态执法机制）。

**与开源项目的关联**：ANIS 的 memory poisoning 攻击模型直接关联 MemGPT/Letta 的记忆管理——当 Agent 拥有长期记忆写入能力时，如何防止恶意内容注入记忆库是一个尚未解决的安全问题。Harness Triad 的元认知自监控思路与 AutoGPT/CrewAI 中的反思机制有相似之处，但更系统化。

---

### 2. Internalizing the Future: A Unified Agentic Training Paradigm for World Model Planning

- **arXiv ID**: 2606.27483
- **链接**: [https://arxiv.org/abs/2606.27483](https://arxiv.org/abs/2606.27483) [Kimi解读](http://kimi.com/_prefill_chat?prefill_prompt=%E6%88%91%E4%BB%AC%E8%A6%81%E8%AE%A8%E8%AE%BA%E7%9A%84%E8%AE%BA%E6%96%87%E6%98%AFhttps%3A%2F%2Farxiv.org%2Fabs%2F2606.27483%EF%BC%8C%E9%93%BE%E6%8E%A5%E6%98%AF+https%3A%2F%2Farxiv.org%2Fpdf%2F2606.27483+%EF%BC%8C%E5%B7%B2%E6%9C%89%E7%9A%84FAQ%E9%93%BE%E6%8E%A5%E6%98%AF+https%3A%2F%2Fpapers.cool%2Farxiv%2Fkimi%3Fpaper%3D2606.27483+%E3%80%82%E8%AF%B7%E4%BB%A5%E6%AD%A4%E4%B8%BA%E5%9F%BA%E7%A1%80%EF%BC%8C%E7%BB%A7%E7%BB%AD%E5%9B%9E%E7%AD%94%E6%88%91%E5%90%8E%E9%9D%A2%E7%9A%84%E9%97%AE%E9%A2%98%E3%80%82&system_prompt=%E4%BD%A0%E6%98%AF%E4%B8%80%E4%B8%AA%E5%AD%A6%E6%9C%AF%E5%8A%A9%E6%89%8B%EF%BC%8C%E5%90%8E%E9%9D%A2%E7%9A%84%E5%AF%B9%E8%AF%9D%E5%B0%86%E5%9B%B4%E7%BB%95%E7%9D%80%E4%BB%A5%E4%B8%8B%E8%AE%BA%E6%96%87%E5%86%85%E5%AE%B9%E8%BF%9B%E8%A1%8C%EF%BC%8C%E5%B7%B2%E7%BB%8F%E9%80%9A%E8%BF%87%E9%93%BE%E6%8E%A5%E7%BB%99%E5%87%BA%E4%BA%86%E8%AE%BA%E6%96%87%E7%9A%84PDF%E5%92%8C%E8%AE%BA%E6%96%87%E5%B7%B2%E6%9C%89%E7%9A%84FAQ%E3%80%82%E7%94%A8%E6%88%B7%E5%B0%86%E7%BB%A7%E7%BB%AD%E5%90%91%E4%BD%A0%E5%92%A8%E8%AF%A2%E8%AE%BA%E6%96%87%E7%9A%84%E7%9B%B8%E5%85%B3%E9%97%AE%E9%A2%98%EF%BC%8C%E8%AF%B7%E4%BD%A0%E4%BD%9C%E5%87%BA%E4%B8%93%E4%B8%9A%E7%9A%84%E5%9B%9E%E7%AD%94%EF%BC%8C%E4%B8%8D%E8%A6%81%E5%87%BA%E7%8E%B0%E7%AC%AC%E4%B8%80%E4%BA%BA%E7%A7%B0%EF%BC%8C%E5%BD%93%E6%B6%89%E5%8F%8A%E5%88%B0%E5%88%86%E7%82%B9%E5%9B%9E%E7%AD%94%E6%97%B6%EF%BC%8C%E9%BC%93%E5%8A%B1%E4%BD%A0%E4%BB%A5markdown%E6%A0%BC%E5%BC%8F%E8%BE%93%E5%87%BA%E3%80%82&send_immediately=true)
- **关键词**: world model, internal planning, agent training, foresight

**摘要要点**：提出将未来感知规划内化到 Agent 中的训练范式，通过三阶段训练（WM-AMT → FE-SFT → FC-RL）让单一自回归模型同时生成前瞻状态推演和计划条件成功估计（文本 Q 值）。核心发现：简单微调前瞻轨迹只会产生表层的"前瞻模仿"而无真正的预测能力，需要能力优先的训练管线。

**与开源项目的关联**：这与 LangChain/LlamaIndex 的 RAG 记忆范式形成对比——RAG 是外部记忆检索，而本文将"未来预测"作为内部记忆内化到模型权重中。可类比为"参数化记忆 vs 非参数化记忆"的张力。MemGPT 的分层记忆架构中，核心记忆（core memory）的编辑操作可借鉴此文的"能力注入"思路。

---

### 3. SHIFT: Gate-Modulated Activation Steering for Knowledge Conflict Mitigation in RAG

- **arXiv ID**: 2606.27786
- **链接**: [https://arxiv.org/abs/2606.27786](https://arxiv.org/abs/2606.27786) [Kimi解读](http://kimi.com/_prefill_chat?prefill_prompt=%E6%88%91%E4%BB%AC%E8%A6%81%E8%AE%A8%E8%AE%BA%E7%9A%84%E8%AE%BA%E6%96%87%E6%98%AFhttps%3A%2F%2Farxiv.org%2Fabs%2F2606.27786%EF%BC%8C%E9%93%BE%E6%8E%A5%E6%98%AF+https%3A%2F%2Farxiv.org%2Fpdf%2F2606.27786+%EF%BC%8C%E5%B7%B2%E6%9C%89%E7%9A%84FAQ%E9%93%BE%E6%8E%A5%E6%98%AF+https%3A%2F%2Fpapers.cool%2Farxiv%2Fkimi%3Fpaper%3D2606.27786+%E3%80%82%E8%AF%B7%E4%BB%A5%E6%AD%A4%E4%B8%BA%E5%9F%BA%E7%A1%80%EF%BC%8C%E7%BB%A7%E7%BB%AD%E5%9B%9E%E7%AD%94%E6%88%91%E5%90%8E%E9%9D%A2%E7%9A%84%E9%97%AE%E9%A2%98%E3%80%82&system_prompt=%E4%BD%A0%E6%98%AF%E4%B8%80%E4%B8%AA%E5%AD%A6%E6%9C%AF%E5%8A%A9%E6%89%8B%EF%BC%8C%E5%90%8E%E9%9D%A2%E7%9A%84%E5%AF%B9%E8%AF%9D%E5%B0%86%E5%9B%B4%E7%BB%95%E7%9D%80%E4%BB%A5%E4%B8%8B%E8%AE%BA%E6%96%87%E5%86%85%E5%AE%B9%E8%BF%9B%E8%A1%8C%EF%BC%8C%E5%B7%B2%E7%BB%8F%E9%80%9A%E8%BF%87%E9%93%BE%E6%8E%A5%E7%BB%99%E5%87%BA%E4%BA%86%E8%AE%BA%E6%96%87%E7%9A%84PDF%E5%92%8C%E8%AE%BA%E6%96%87%E5%B7%B2%E6%9C%89%E7%9A%84FAQ%E3%80%82%E7%94%A8%E6%88%B7%E5%B0%86%E7%BB%A7%E7%BB%AD%E5%90%91%E4%BD%A0%E5%92%A8%E8%AF%A2%E8%AE%BA%E6%96%87%E7%9A%84%E7%9B%B8%E5%85%B3%E9%97%AE%E9%A2%98%EF%BC%8C%E8%AF%B7%E4%BD%A0%E4%BD%9C%E5%87%BA%E4%B8%93%E4%B8%9A%E7%9A%84%E5%9B%9E%E7%AD%94%EF%BC%8C%E4%B8%8D%E8%A6%81%E5%87%BA%E7%8E%B0%E7%AC%AC%E4%B8%80%E4%BA%BA%E7%A7%B0%EF%BC%8C%E5%BD%93%E6%B6%89%E5%8F%8A%E5%88%B0%E5%88%86%E7%82%B9%E5%9B%9E%E7%AD%94%E6%97%B6%EF%BC%8C%E9%BC%93%E5%8A%B1%E4%BD%A0%E4%BB%A5markdown%E6%A0%BC%E5%BC%8F%E8%BE%93%E5%87%BA%E3%80%82&send_immediately=true)
- **关键词**: RAG, knowledge conflict, activation steering, gate modulation

**摘要要点**：针对 RAG 系统中检索上下文与参数化知识冲突的问题，提出 SHIFT 框架。将神经元级修改重构为可学习的门控调制，仅训练 <0.01% 参数即可自适应调节上下文知识与参数化知识的利用。避免了传统神经元编辑对模型通用能力的级联损害。

**与开源项目的关联**：直接关联所有使用 RAG 的记忆系统（LlamaIndex、LangChain、CrewAI）。RAG 记忆检索到的信息可能与 LLM 已有知识冲突，SHIFT 提供了一种轻量级解决方案。这对 MemGPT 的召回记忆（recall memory）设计有启示——何时信任检索结果 vs 内部知识，需要更精细的调控机制。

---

### 4. Cognitive Episodes in LLM Reasoning Traces Enable Interpretable Human Item Difficulty Prediction

- **arXiv ID**: 2606.28186
- **链接**: [https://arxiv.org/abs/2606.28186](https://arxiv.org/abs/2606.28186) [Kimi解读](http://kimi.com/_prefill_chat?prefill_prompt=%E6%88%91%E4%BB%AC%E8%A6%81%E8%AE%A8%E8%AE%BA%E7%9A%84%E8%AE%BA%E6%96%87%E6%98%AFhttps%3A%2F%2Farxiv.org%2Fabs%2F2606.28186%EF%BC%8C%E9%93%BE%E6%8E%A5%E6%98%AF+https%3A%2F%2Farxiv.org%2Fpdf%2F2606.28186+%EF%BC%8C%E5%B7%B2%E6%9C%89%E7%9A%84FAQ%E9%93%BE%E6%8E%A5%E6%98%AF+https%3A%2F%2Fpapers.cool%2Farxiv%2Fkimi%3Fpaper%3D2606.28186+%E3%80%82%E8%AF%B7%E4%BB%A5%E6%AD%A4%E4%B8%BA%E5%9F%BA%E7%A1%80%EF%BC%8C%E7%BB%A7%E7%BB%AD%E5%9B%9E%E7%AD%94%E6%88%91%E5%90%8E%E9%9D%A2%E7%9A%84%E9%97%AE%E9%A2%98%E3%80%82&system_prompt=%E4%BD%A0%E6%98%AF%E4%B8%80%E4%B8%AA%E5%AD%A6%E6%9C%AF%E5%8A%A9%E6%89%8B%EF%BC%8C%E5%90%8E%E9%9D%A2%E7%9A%84%E5%AF%B9%E8%AF%9D%E5%B0%86%E5%9B%B4%E7%BB%95%E7%9D%80%E4%BB%A5%E4%B8%8B%E8%AE%BA%E6%96%87%E5%86%85%E5%AE%B9%E8%BF%9B%E8%A1%8C%EF%BC%8C%E5%B7%B2%E7%BB%8F%E9%80%9A%E8%BF%87%E9%93%BE%E6%8E%A5%E7%BB%99%E5%87%BA%E4%BA%86%E8%AE%BA%E6%96%87%E7%9A%84PDF%E5%92%8C%E8%AE%BA%E6%96%87%E5%B7%B2%E6%9C%89%E7%9A%84FAQ%E3%80%82%E7%94%A8%E6%88%B7%E5%B0%86%E7%BB%A7%E7%BB%AD%E5%90%91%E4%BD%A0%E5%92%A8%E8%AF%A2%E8%AE%BA%E6%96%87%E7%9A%84%E7%9B%B8%E5%85%B3%E9%97%AE%E9%A2%98%EF%BC%8C%E8%AF%B7%E4%BD%A0%E4%BD%9C%E5%87%BA%E4%B8%93%E4%B8%9A%E7%9A%84%E5%9B%9E%E7%AD%94%EF%BC%8C%E4%B8%8D%E8%A6%81%E5%87%BA%E7%8E%B0%E7%AC%AC%E4%B8%80%E4%BA%BA%E7%A7%B0%EF%BC%8C%E5%BD%93%E6%B6%89%E5%8F%8A%E5%88%B0%E5%88%86%E7%82%B9%E5%9B%9E%E7%AD%94%E6%97%B6%EF%BC%8C%E9%BC%93%E5%8A%B1%E4%BD%A0%E4%BB%A5markdown%E6%A0%BC%E5%BC%8F%E8%BE%93%E5%87%BA%E3%80%82&send_immediately=true)
- **关键词**: episodic, cognitive episodes, reasoning traces

**摘要要点**：提出 Epi2Diff 框架，将 LRM 推理轨迹映射为认知层面的"情节序列"（cognitive episode sequences）。这些情节将推理片段分组为功能性问题解决状态，使难度可通过推理规模、努力分配和状态转移来建模。核心发现：更难的问题引发更费力、迭代和执行中心的情节动态。

**与开源项目的关联**："认知情节"概念直接关联 episodic memory 研究。目前的 19 个开源记忆项目中，大多数将 episodic memory 简化为"对话历史存储"，而本文的情节序列提供了更结构化的表示——记忆不是原始对话片段，而是功能性问题解决状态。这对 MemGPT 的召回记忆和 AutoGPT 的经验存储有重构启示。

---

### 5. Grounded Iterative Language Planning (GILP)

- **arXiv ID**: 2606.27806
- **链接**: [https://arxiv.org/abs/2606.27806](https://arxiv.org/abs/2606.27806) [Kimi解读](http://kimi.com/_prefill_chat?prefill_prompt=%E6%88%91%E4%BB%AC%E8%A6%81%E8%AE%A8%E8%AE%BA%E7%9A%84%E8%AE%BA%E6%96%87%E6%98%AFhttps%3A%2F%2Farxiv.org%2Fabs%2F2606.27806%EF%BC%8C%E9%93%BE%E6%8E%A5%E6%98%AF+https%3A%2F%2Farxiv.org%2Fpdf%2F2606.27806+%EF%BC%8C%E5%B7%B2%E6%9C%89%E7%9A%84FAQ%E9%93%BE%E6%8E%A5%E6%98%AF+https%3A%2F%2Fpapers.cool%2Farxiv%2Fkimi%3Fpaper%3D2606.27806+%E3%80%82%E8%AF%B7%E4%BB%A5%E6%AD%A4%E4%B8%BA%E5%9F%BA%E7%A1%80%EF%BC%8C%E7%BB%A7%E7%BB%AD%E5%9B%9E%E7%AD%94%E6%88%91%E5%90%8E%E9%9D%A2%E7%9A%84%E9%97%AE%E9%A2%98%E3%80%82&system_prompt=%E4%BD%A0%E6%98%AF%E4%B8%80%E4%B8%AA%E5%AD%A6%E6%9C%AF%E5%8A%A9%E6%89%8B%EF%BC%8C%E5%90%8E%E9%9D%A2%E7%9A%84%E5%AF%B9%E8%AF%9D%E5%B0%86%E5%9B%B4%E7%BB%95%E7%9D%80%E4%BB%A5%E4%B8%8B%E8%AE%BA%E6%96%87%E5%86%85%E5%AE%B9%E8%BF%9B%E8%A1%8C%EF%BC%8C%E5%B7%B2%E7%BB%8F%E9%80%9A%E8%BF%87%E9%93%BE%E6%8E%A5%E7%BB%99%E5%87%BA%E4%BA%86%E8%AE%BA%E6%96%87%E7%9A%84PDF%E5%92%8C%E8%AE%BA%E6%96%87%E5%B7%B2%E6%9C%89%E7%9A%84FAQ%E3%80%82%E7%94%A8%E6%88%B7%E5%B0%86%E7%BB%A7%E7%BB%AD%E5%90%91%E4%BD%A0%E5%92%A8%E8%AF%A2%E8%AE%BA%E6%96%87%E7%9A%84%E7%9B%B8%E5%85%B3%E9%97%AE%E9%A2%98%EF%BC%8C%E8%AF%B7%E4%BD%A0%E4%BD%9C%E5%87%BA%E4%B8%93%E4%B8%9A%E7%9A%84%E5%9B%9E%E7%AD%94%EF%BC%8C%E4%B8%8D%E8%A6%81%E5%87%BA%E7%8E%B0%E7%AC%AC%E4%B8%80%E4%BA%BA%E7%A7%B0%EF%BC%8C%E5%BD%93%E6%B6%89%E5%8F%8A%E5%88%B0%E5%88%86%E7%82%B9%E5%9B%9E%E7%AD%94%E6%97%B6%EF%BC%8C%E9%BC%93%E5%8A%B1%E4%BD%A0%E4%BB%A5markdown%E6%A0%BC%E5%BC%8F%E8%BE%93%E5%87%BA%E3%80%82&send_immediately=true)
- **关键词**: world model, hallucination, parameterized model, consistency gate

**摘要要点**：比较了两种 Agent 世界模型：基于 API 的 agent 世界模型（灵活但幻觉多）和参数化世界模型（可度量但较弱）。提出 GILP 将小参数化骨干与 API Agent 推理结合，通过一致性门控在两者不一致时请求修订，将幻觉状态率从 0.176 降至 0.035。

**与开源项目的关联**：参数化世界模型本质上是一种"压缩的内部记忆"——将环境动态编码到模型权重中。这为 Agent 的长期记忆提供了一种除 RAG 外的替代范式。一致性门控机制可类比到记忆验证——从外部记忆检索的内容需要与内部知识交叉验证。

---

### 6. Understanding Rollout Error in Graph World Models

- **arXiv ID**: 2606.27780
- **链接**: [https://arxiv.org/abs/2606.27780](https://arxiv.org/abs/2606.27780) [Kimi解读](http://kimi.com/_prefill_chat?prefill_prompt=%E6%88%91%E4%BB%AC%E8%A6%81%E8%AE%A8%E8%AE%BA%E7%9A%84%E8%AE%BA%E6%96%87%E6%98%AFhttps%3A%2F%2Farxiv.org%2Fabs%2F2606.27780%EF%BC%8C%E9%93%BE%E6%8E%A5%E6%98%AF+https%3A%2F%2Farxiv.org%2Fpdf%2F2606.27780+%EF%BC%8C%E5%B7%B2%E6%9C%89%E7%9A%84FAQ%E9%93%BE%E6%8E%A5%E6%98%AF+https%3A%2F%2Fpapers.cool%2Farxiv%2Fkimi%3Fpaper%3D2606.27780+%E3%80%82%E8%AF%B7%E4%BB%A5%E6%AD%A4%E4%B8%BA%E5%9F%BA%E7%A1%80%EF%BC%8C%E7%BB%A7%E7%BB%AD%E5%9B%9E%E7%AD%94%E6%88%91%E5%90%8E%E9%9D%A2%E7%9A%84%E9%97%AE%E9%A2%98%E3%80%82&system_prompt=%E4%BD%A0%E6%98%AF%E4%B8%80%E4%B8%AA%E5%AD%A6%E6%9C%AF%E5%8A%A9%E6%89%8B%EF%BC%8C%E5%90%8E%E9%9D%A2%E7%9A%84%E5%AF%B9%E8%AF%9D%E5%B0%86%E5%9B%B4%E7%BB%95%E7%9D%80%E4%BB%A5%E4%B8%8B%E8%AE%BA%E6%96%87%E5%86%85%E5%AE%B9%E8%BF%9B%E8%A1%8C%EF%BC%8C%E5%B7%B2%E7%BB%8F%E9%80%9A%E8%BF%87%E9%93%BE%E6%8E%A5%E7%BB%99%E5%87%BA%E4%BA%86%E8%AE%BA%E6%96%87%E7%9A%84PDF%E5%92%8C%E8%AE%BA%E6%96%87%E5%B7%B2%E6%9C%89%E7%9A%84FAQ%E3%80%82%E7%94%A8%E6%88%B7%E5%B0%86%E7%BB%A7%E7%BB%AD%E5%90%91%E4%BD%A0%E5%92%A8%E8%AF%A2%E8%AE%BA%E6%96%87%E7%9A%84%E7%9B%B8%E5%85%B3%E9%97%AE%E9%A2%98%EF%BC%8C%E8%AF%B7%E4%BD%A0%E4%BD%9C%E5%87%BA%E4%B8%93%E4%B8%9A%E7%9A%84%E5%9B%9E%E7%AD%94%EF%BC%8C%E4%B8%8D%E8%A6%81%E5%87%BA%E7%8E%B0%E7%AC%AC%E4%B8%80%E4%BA%BA%E7%A7%B0%EF%BC%8C%E5%BD%93%E6%B6%89%E5%8F%8A%E5%88%B0%E5%88%86%E7%82%B9%E5%9B%9E%E7%AD%94%E6%97%B6%EF%BC%8C%E9%BC%93%E5%8A%B1%E4%BD%A0%E4%BB%A5markdown%E6%A0%BC%E5%BC%8F%E8%BE%93%E5%87%BA%E3%80%82&send_immediately=true)
- **关键词**: graph world model, rollout error, agent planning, memory propagation

**摘要要点**：研究图世界模型中的长视野推演误差，分离拓扑放大和模型放大两类误差源。提出 Error-Aware GWM，结合谱正则化、推演一致性和关键节点加权来防止长视野发散。核心洞察：局部预测误差可能在图中传播或被隔离，动态边预测时失败模式完全不同。

**与开源项目的关联**：图世界模型可视为一种结构化记忆表示——Agent 的工具、技能、路径和依赖关系以图形式组织。误差传播分析对记忆系统的设计有启示：在 MemGPT/Letta 的记忆架构中，记忆项之间的关联错误同样会级联传播。谱正则化思路可应用于记忆图的维护。

---

### 7. ATOD: Annealed Turn-aware On-policy Distillation for Multi-turn Autonomous Agents

- **arXiv ID**: 2606.27814
- **链接**: [https://arxiv.org/abs/2606.27814](https://arxiv.org/abs/2606.27814) [Kimi解读](http://kimi.com/_prefill_chat?prefill_prompt=%E6%88%91%E4%BB%AC%E8%A6%81%E8%AE%A8%E8%AE%BA%E7%9A%84%E8%AE%BA%E6%96%87%E6%98%AFhttps%3A%2F%2Farxiv.org%2Fabs%2F2606.27814%EF%BC%8C%E9%93%BE%E6%8E%A5%E6%98%AF+https%3A%2F%2Farxiv.org%2Fpdf%2F2606.27814+%EF%BC%8C%E5%B7%B2%E6%9C%89%E7%9A%84FAQ%E9%93%BE%E6%8E%A5%E6%98%AF+https%3A%2F%2Fpapers.cool%2Farxiv%2Fkimi%3Fpaper%3D2606.27814+%E3%80%82%E8%AF%B7%E4%BB%A5%E6%AD%A4%E4%B8%BA%E5%9F%BA%E7%A1%80%EF%BC%8C%E7%BB%A7%E7%BB%AD%E5%9B%9E%E7%AD%94%E6%88%91%E5%90%8E%E9%9D%A2%E7%9A%84%E9%97%AE%E9%A2%98%E3%80%82&system_prompt=%E4%BD%A0%E6%98%AF%E4%B8%80%E4%B8%AA%E5%AD%A6%E6%9C%AF%E5%8A%A9%E6%89%8B%EF%BC%8C%E5%90%8E%E9%9D%A2%E7%9A%84%E5%AF%B9%E8%AF%9D%E5%B0%86%E5%9B%B4%E7%BB%95%E7%9D%80%E4%BB%A5%E4%B8%8B%E8%AE%BA%E6%96%87%E5%86%85%E5%AE%B9%E8%BF%9B%E8%A1%8C%EF%BC%8C%E5%B7%B2%E7%BB%8F%E9%80%9A%E8%BF%87%E9%93%BE%E6%8E%A5%E7%BB%99%E5%87%BA%E4%BA%86%E8%AE%BA%E6%96%87%E7%9A%84PDF%E5%92%8C%E8%AE%BA%E6%96%87%E5%B7%B2%E6%9C%89%E7%9A%84FAQ%E3%80%82%E7%94%A8%E6%88%B7%E5%B0%86%E7%BB%A7%E7%BB%AD%E5%90%91%E4%BD%A0%E5%92%A8%E8%AF%A2%E8%AE%BA%E6%96%87%E7%9A%84%E7%9B%B8%E5%85%B3%E9%97%AE%E9%A2%98%EF%BC%8C%E8%AF%B7%E4%BD%A0%E4%BD%9C%E5%87%BA%E4%B8%93%E4%B8%9A%E7%9A%84%E5%9B%9E%E7%AD%94%EF%BC%8C%E4%B8%8D%E8%A6%81%E5%87%BA%E7%8E%B0%E7%AC%AC%E4%B8%80%E4%BA%BA%E7%A7%B0%EF%BC%8C%E5%BD%93%E6%B6%89%E5%8F%8A%E5%88%B0%E5%88%86%E7%82%B9%E5%9B%9E%E7%AD%94%E6%97%B6%EF%BC%8C%E9%BC%93%E5%8A%B1%E4%BD%A0%E4%BB%A5markdown%E6%A0%BC%E5%BC%8F%E8%BE%93%E5%87%BA%E3%80%82&send_immediately=true)
- **关键词**: multi-turn agent, experience distillation, long-horizon

**摘要要点**：提出退火式回合感知在线蒸馏（ATOD），混合 OPD 和 RL 训练多轮自主 Agent。引入回合级分歧-不确定性重加权（T-DUR），在长轨迹中软放大高效用回合。在 ALFWorld、WebShop、Search-QA 上平均超越教师模型 2.16 个百分点。

**与开源项目的关联**：多轮交互中的经验蒸馏本质上是一种"记忆压缩"——从教师模型的长轨迹经验中提取关键回合信息。T-DUR 的回合级重加权与 MemGPT 的记忆优先级排序（memory prioritization）思路一致，但更精细化。对 Agent 长期记忆的遗忘机制设计有参考价值。

---

## 🔥 研究趋势分析

### 趋势一：Agent 安全与记忆投毒成为新焦点

ANIS 论文标志着 Agent Memory 研究从"如何存储和检索"进入"如何保护"的新阶段。随着 Agent 具备持久记忆，memory poisoning 攻击成为一个此前被忽视的关键威胁面。这与 19 个开源记忆项目中几乎无人关注记忆安全现状形成鲜明对比。

### 趋势二：参数化记忆 vs 非参数化记忆的融合

GILP、Internalizing the Future 两篇论文从不同角度探讨了同一个问题：将外部世界模型/记忆内化到模型参数中。SHIFT 则从 RAG 角度展示了外部知识与内部知识冲突时的调控方案。**趋势方向**：不是二选一，而是如何让两种记忆形式协同工作。

### 趋势三：认知情节（Episodic）结构化

Epi2Diff 将推理轨迹结构化为认知情节，超越了简单的对话历史存储。这呼应了认知科学中 episodic memory 的原始定义——不仅是时间序列记录，更是功能性状态序列。当前开源项目的 episodic memory 实现普遍过于简化。

### 趋势四：世界模型作为 Agent 记忆的新范式

GILP、Graph World Models、Internalizing the Future 三篇论文都涉及世界模型与记忆的关系。世界模型可视为一种"预测性记忆"——不仅记住过去，还能模拟未来。这对传统 RAG 式记忆提出了范式挑战。

## 💡 关键洞察和创新点

1. **记忆安全是新的第一优先级**：ANIS 指出，一个完全对齐的 Agent 在运行时仍然极易被 memory poisoning 攻击劫持。这要求记忆系统在设计之初就内置安全机制，而非事后补丁。

2. **能力注入 > 格式模仿**：Internalizing the Future 证明了直接微调前瞻格式只会产生表面模仿，需要三阶段能力优先训练。这对记忆写入策略有启示——简单地让 Agent 把经验写入记忆不够，需要确保写入的内容具有预测性价值。

3. **门控调制 > 神经元编辑**：SHIFT 用 <0.01% 参数的门控模块解决了 RAG 知识冲突，优于直接编辑知识神经元。这为记忆系统的知识更新提供了更优雅的方案。

4. **图结构记忆的误差传播**：Graph World Models 揭示了结构化记忆中误差的传播机制，这对设计记忆图的维护和清理策略至关重要。

## 🔗 与 19 个开源记忆项目的关联映射

| 论文 | 最相关项目 | 关联说明 |
|------|-----------|---------|
| ANIS (memory poisoning) | **MemGPT/Letta** | 长期记忆写入权限需安全防护 |
| Internalizing the Future | **MemGPT, AutoGPT** | 参数化记忆 vs 非参数化记忆的权衡 |
| SHIFT (RAG conflict) | **LlamaIndex, LangChain** | RAG 知识冲突的轻量级解决方案 |
| Epi2Diff (episodes) | **MemGPT, CrewAI** | 情节记忆的结构化表示升级 |
| GILP (world model) | **AutoGPT, CrewAI** | 世界模型作为预测性记忆 |
| Graph World Models | **MemGPT, AutoGPT** | 记忆图的误差传播与维护 |
| ATOD (experience) | **All Agent frameworks** | 经验蒸馏与记忆优先级排序 |

## 📊 本日总结

今日 cs.AI + cs.CL 共筛选出 **7 篇**与 Agent Memory 相关的论文，涵盖：

- **记忆安全**（1 篇）：memory poisoning 与免疫防御
- **世界模型/参数化记忆**（3 篇）：内化规划、图世界模型、幻觉抑制
- **RAG/知识冲突**（1 篇）：门控调制解决检索知识冲突
- **情节记忆结构化**（1 篇）：认知情节序列
- **经验蒸馏**（1 篇）：多轮交互中的记忆压缩

**最值得关注**：ANIS（Agent-Native Immune System）——首次系统化提出 Agent 记忆安全架构，填补了开源记忆项目在安全维度的重大空白。

---

*本报告由 Agent Memory 日报系统自动生成，追踪 arXiv cs.AI / cs.CL 领域与 Agent Memory 相关的最新研究。*
