---
title: Agent Memory 日报 | 2026-05-20：上下文缓存、信念状态与跨轮经验演化
date: '2026-05-20 18:00:00 +0800'
tags:
  - agent-memory
  - arxiv-daily
  - RAG
  - episodic-memory
  - belief-state
categories: [Agent Memory 研究]
  - Agent Memory 日报
abbrlink: 26258
noindex: true
description: "今日扫描 arXiv cs.AI + cs.CL 最新论文（2026-05-19 发布），筛选出 7 篇与 Agent Memory 密切相关的论文。核心主题集中在：上下文缓存与复用、信念状态建模、跨轮经验演化，以及 RAG 系统优化。"
keywords: "agent, memory, 2026, 上下文缓存、信念状态与跨轮经验演化, agent-memory, arxiv-daily, RAG, episodic-memory"
---

## 📋 今日概览

今日扫描 arXiv cs.AI + cs.CL 最新论文（2026-05-19 发布），筛选出 **7 篇**与 Agent Memory 密切相关的论文。核心主题集中在：**上下文缓存与复用**、**信念状态建模**、**跨轮经验演化**，以及 **RAG 系统优化**。

---

## 🔬 相关论文列表

### 1. PEEK: Context Map as an Orientation Cache for Long-Context LLM Agents

- **arXiv ID**: 2605.19932
- **链接**: [arxiv.org/abs/2605.19932](https://arxiv.org/abs/2605.19932) [Kimi解读](http://kimi.com/_prefill_chat?prefill_prompt=%E6%88%91%E4%BB%AC%E8%A6%81%E8%AE%A8%E8%AE%BA%E7%9A%84%E8%AE%BA%E6%96%87%E6%98%AFarxiv.org%2Fabs%2F2605.19932%EF%BC%8C%E9%93%BE%E6%8E%A5%E6%98%AF+https%3A%2F%2Farxiv.org%2Fpdf%2F2605.19932+%EF%BC%8C%E5%B7%B2%E6%9C%89%E7%9A%84FAQ%E9%93%BE%E6%8E%A5%E6%98%AF+https%3A%2F%2Fpapers.cool%2Farxiv%2Fkimi%3Fpaper%3D2605.19932+%E3%80%82%E8%AF%B7%E4%BB%A5%E6%AD%A4%E4%B8%BA%E5%9F%BA%E7%A1%80%EF%BC%8C%E7%BB%A7%E7%BB%AD%E5%9B%9E%E7%AD%94%E6%88%91%E5%90%8E%E9%9D%A2%E7%9A%84%E9%97%AE%E9%A2%98%E3%80%82&system_prompt=%E4%BD%A0%E6%98%AF%E4%B8%80%E4%B8%AA%E5%AD%A6%E6%9C%AF%E5%8A%A9%E6%89%8B%EF%BC%8C%E5%90%8E%E9%9D%A2%E7%9A%84%E5%AF%B9%E8%AF%9D%E5%B0%86%E5%9B%B4%E7%BB%95%E7%9D%80%E4%BB%A5%E4%B8%8B%E8%AE%BA%E6%96%87%E5%86%85%E5%AE%B9%E8%BF%9B%E8%A1%8C%EF%BC%8C%E5%B7%B2%E7%BB%8F%E9%80%9A%E8%BF%87%E9%93%BE%E6%8E%A5%E7%BB%99%E5%87%BA%E4%BA%86%E8%AE%BA%E6%96%87%E7%9A%84PDF%E5%92%8C%E8%AE%BA%E6%96%87%E5%B7%B2%E6%9C%89%E7%9A%84FAQ%E3%80%82%E7%94%A8%E6%88%B7%E5%B0%86%E7%BB%A7%E7%BB%AD%E5%90%91%E4%BD%A0%E5%92%A8%E8%AF%A2%E8%AE%BA%E6%96%87%E7%9A%84%E7%9B%B8%E5%85%B3%E9%97%AE%E9%A2%98%EF%BC%8C%E8%AF%B7%E4%BD%A0%E4%BD%9C%E5%87%BA%E4%B8%93%E4%B8%9A%E7%9A%84%E5%9B%9E%E7%AD%94%EF%BC%8C%E4%B8%8D%E8%A6%81%E5%87%BA%E7%8E%B0%E7%AC%AC%E4%B8%80%E4%BA%BA%E7%A7%B0%EF%BC%8C%E5%BD%93%E6%B6%89%E5%8F%8A%E5%88%B0%E5%88%86%E7%82%B9%E5%9B%9E%E7%AD%94%E6%97%B6%EF%BC%8C%E9%BC%93%E5%8A%B1%E4%BD%A0%E4%BB%A5markdown%E6%A0%BC%E5%BC%8F%E8%BE%93%E5%87%BA%E3%80%82&send_immediately=true)
- **领域**: cs.AI / cs.CL / cs.LG

**摘要要点**: 提出 PEEK 系统，为长上下文 LLM Agent 缓存和维护"方向知识"（orientation knowledge）作为上下文地图（context map）。通过 Distiller（提取）→ Cartographer（结构化编辑）→ Evictor（token 预算控制）三级流水线维护固定大小的缓存 artifact。在长上下文推理任务上比强基线提升 6.3-34.0%，迭代次数减少 93-145 次，成本降低 1.7-5.8x。

**🔑 记忆关联**: 本质上是一种 **语义缓存（Semantic Cache）** 机制，类似于 MemGPT 的 Core Memory 概念，但专注于外部上下文的"索引"而非对话历史。与之前分析的 19 个开源项目中最接近的是 **MemGPT 的递归记忆管理** 和 **LlamaIndex 的索引缓存**。

---

### 2. ReBel: Rewarding Beliefs, Not Actions — Consistency-Guided Credit Assignment for Long-Horizon Agents

- **arXiv ID**: 2605.20061
- **链接**: [arxiv.org/abs/2605.20061](https://arxiv.org/abs/2605.20061) [Kimi解读](http://kimi.com/_prefill_chat?prefill_prompt=%E6%88%91%E4%BB%AC%E8%A6%81%E8%AE%A8%E8%AE%BA%E7%9A%84%E8%AE%BA%E6%96%87%E6%98%AFarxiv.org%2Fabs%2F2605.20061%EF%BC%8C%E9%93%BE%E6%8E%A5%E6%98%AF+https%3A%2F%2Farxiv.org%2Fpdf%2F2605.20061+%EF%BC%8C%E5%B7%B2%E6%9C%89%E7%9A%84FAQ%E9%93%BE%E6%8E%A5%E6%98%AF+https%3A%2F%2Fpapers.cool%2Farxiv%2Fkimi%3Fpaper%3D2605.20061+%E3%80%82%E8%AF%B7%E4%BB%A5%E6%AD%A4%E4%B8%BA%E5%9F%BA%E7%A1%80%EF%BC%8C%E7%BB%A7%E7%BB%AD%E5%9B%9E%E7%AD%94%E6%88%91%E5%90%8E%E9%9D%A2%E7%9A%84%E9%97%AE%E9%A2%98%E3%80%82&system_prompt=%E4%BD%A0%E6%98%AF%E4%B8%80%E4%B8%AA%E5%AD%A6%E6%9C%AF%E5%8A%A9%E6%89%8B%EF%BC%8C%E5%90%8E%E9%9D%A2%E7%9A%84%E5%AF%B9%E8%AF%9D%E5%B0%86%E5%9B%B4%E7%BB%95%E7%9D%80%E4%BB%A5%E4%B8%8B%E8%AE%BA%E6%96%87%E5%86%85%E5%AE%B9%E8%BF%9B%E8%A1%8C%EF%BC%8C%E5%B7%B2%E7%BB%8F%E9%80%9A%E8%BF%87%E9%93%BE%E6%8E%A5%E7%BB%99%E5%87%BA%E4%BA%86%E8%AE%BA%E6%96%87%E7%9A%84PDF%E5%92%8C%E8%AE%BA%E6%96%87%E5%B7%B2%E6%9C%89%E7%9A%84FAQ%E3%80%82%E7%94%A8%E6%88%B7%E5%B0%86%E7%BB%A7%E7%BB%AD%E5%90%91%E4%BD%A0%E5%92%A8%E8%AF%A2%E8%AE%BA%E6%96%87%E7%9A%84%E7%9B%B8%E5%85%B3%E9%97%AE%E9%A2%98%EF%BC%8C%E8%AF%B7%E4%BD%A0%E4%BD%9C%E5%87%BA%E4%B8%93%E4%B8%9A%E7%9A%84%E5%9B%9E%E7%AD%94%EF%BC%8C%E4%B8%8D%E8%A6%81%E5%87%BA%E7%8E%B0%E7%AC%AC%E4%B8%80%E4%BA%BA%E7%A7%B0%EF%BC%8C%E5%BD%93%E6%B6%89%E5%8F%8A%E5%88%B0%E5%88%86%E7%82%B9%E5%9B%9E%E7%AD%94%E6%97%B6%EF%BC%8C%E9%BC%93%E5%8A%B1%E4%BD%A0%E4%BB%A5markdown%E6%A0%BC%E5%BC%8F%E8%BE%93%E5%87%BA%E3%80%82&send_immediately=true)
- **领域**: cs.CL

**摘要要点**: 提出显式建模**结构化信念状态（structured belief states）**来总结交互历史，通过信念一致性监督（belief-consistency supervision）将预测信念与观测反馈的偏差转化为密集的自监督信号，无需外部逐步标注。在 ALFWorld 和 WebShop 上任务成功率提升最高 20.4pp，样本效率提升 2.1x。

**🔑 记忆关联**: 信念状态本质上是一种 **Working Memory / Episodic Memory 的压缩表示**。与 **AutoGPT 的历史摘要** 和 **CrewAI 的上下文管理** 思路一致，但将其形式化为 RL 训练信号。这是"记忆即信念"的典型案例。

---

### 3. AutoResearchClaw: Self-Reinforcing Autonomous Research with Human-AI Collaboration

- **arXiv ID**: 2605.20025
- **链接**: [arxiv.org/abs/2605.20025](https://arxiv.org/abs/2605.20025) [Kimi解读](http://kimi.com/_prefill_chat?prefill_prompt=%E6%88%91%E4%BB%AC%E8%A6%81%E8%AE%A8%E8%AE%BA%E7%9A%84%E8%AE%BA%E6%96%87%E6%98%AFarxiv.org%2Fabs%2F2605.20025%EF%BC%8C%E9%93%BE%E6%8E%A5%E6%98%AF+https%3A%2F%2Farxiv.org%2Fpdf%2F2605.20025+%EF%BC%8C%E5%B7%B2%E6%9C%89%E7%9A%84FAQ%E9%93%BE%E6%8E%A5%E6%98%AF+https%3A%2F%2Fpapers.cool%2Farxiv%2Fkimi%3Fpaper%3D2605.20025+%E3%80%82%E8%AF%B7%E4%BB%A5%E6%AD%A4%E4%B8%BA%E5%9F%BA%E7%A1%80%EF%BC%8C%E7%BB%A7%E7%BB%AD%E5%9B%9E%E7%AD%94%E6%88%91%E5%90%8E%E9%9D%A2%E7%9A%84%E9%97%AE%E9%A2%98%E3%80%82&system_prompt=%E4%BD%A0%E6%98%AF%E4%B8%80%E4%B8%AA%E5%AD%A6%E6%9C%AF%E5%8A%A9%E6%89%8B%EF%BC%8C%E5%90%8E%E9%9D%A2%E7%9A%84%E5%AF%B9%E8%AF%9D%E5%B0%86%E5%9B%B4%E7%BB%95%E7%9D%80%E4%BB%A5%E4%B8%8B%E8%AE%BA%E6%96%87%E5%86%85%E5%AE%B9%E8%BF%9B%E8%A1%8C%EF%BC%8C%E5%B7%B2%E7%BB%8F%E9%80%9A%E8%BF%87%E9%93%BE%E6%8E%A5%E7%BB%99%E5%87%BA%E4%BA%86%E8%AE%BA%E6%96%87%E7%9A%84PDF%E5%92%8C%E8%AE%BA%E6%96%87%E5%B7%B2%E6%9C%89%E7%9A%84FAQ%E3%80%82%E7%94%A8%E6%88%B7%E5%B0%86%E7%BB%A7%E7%BB%AD%E5%90%91%E4%BD%A0%E5%92%A8%E8%AF%A2%E8%AE%BA%E6%96%87%E7%9A%84%E7%9B%B8%E5%85%B3%E9%97%AE%E9%A2%98%EF%BC%8C%E8%AF%B7%E4%BD%A0%E4%BD%9C%E5%87%BA%E4%B8%93%E4%B8%9A%E7%9A%84%E5%9B%9E%E7%AD%94%EF%BC%8C%E4%B8%8D%E8%A6%81%E5%87%BA%E7%8E%B0%E7%AC%AC%E4%B8%80%E4%BA%BA%E7%A7%B0%EF%BC%8C%E5%BD%93%E6%B6%89%E5%8F%8A%E5%88%B0%E5%88%86%E7%82%B9%E5%9B%9E%E7%AD%94%E6%97%B6%EF%BC%8C%E9%BC%93%E5%8A%B1%E4%BD%A0%E4%BB%A5markdown%E6%A0%BC%E5%BC%8F%E8%BE%93%E5%87%BA%E3%80%82&send_immediately=true)
- **领域**: cs.AI

**摘要要点**: 多 Agent 自主研究管线，五大机制中包含 **cross-run evolution**（跨轮演化），将过去错误转化为未来防护。在 ARC-Bench 上比 AI Scientist v2 高 54.7%。

**🔑 记忆关联**: Cross-run evolution 是一种 **跨会话经验记忆（Cross-session Episodic Memory）**。类似于 **BabyAGI 的任务历史** 和 **MemGPT 的召回记忆**，但将记忆显式用于错误预防而非单纯的信息检索。

---

### 4. KoRe: Compact Knowledge Representations for Large Language Models

- **arXiv ID**: 2605.20170
- **链接**: [arxiv.org/abs/2605.20170](https://arxiv.org/abs/2605.20170) [Kimi解读](http://kimi.com/_prefill_chat?prefill_prompt=%E6%88%91%E4%BB%AC%E8%A6%81%E8%AE%A8%E8%AE%BA%E7%9A%84%E8%AE%BA%E6%96%87%E6%98%AFarxiv.org%2Fabs%2F2605.20170%EF%BC%8C%E9%93%BE%E6%8E%A5%E6%98%AF+https%3A%2F%2Farxiv.org%2Fpdf%2F2605.20170+%EF%BC%8C%E5%B7%B2%E6%9C%89%E7%9A%84FAQ%E9%93%BE%E6%8E%A5%E6%98%AF+https%3A%2F%2Fpapers.cool%2Farxiv%2Fkimi%3Fpaper%3D2605.20170+%E3%80%82%E8%AF%B7%E4%BB%A5%E6%AD%A4%E4%B8%BA%E5%9F%BA%E7%A1%80%EF%BC%8C%E7%BB%A7%E7%BB%AD%E5%9B%9E%E7%AD%94%E6%88%91%E5%90%8E%E9%9D%A2%E7%9A%84%E9%97%AE%E9%A2%98%E3%80%82&system_prompt=%E4%BD%A0%E6%98%AF%E4%B8%80%E4%B8%AA%E5%AD%A6%E6%9C%AF%E5%8A%A9%E6%89%8B%EF%BC%8C%E5%90%8E%E9%9D%A2%E7%9A%84%E5%AF%B9%E8%AF%9D%E5%B0%86%E5%9B%B4%E7%BB%95%E7%9D%80%E4%BB%A5%E4%B8%8B%E8%AE%BA%E6%96%87%E5%86%85%E5%AE%B9%E8%BF%9B%E8%A1%8C%EF%BC%8C%E5%B7%B2%E7%BB%8F%E9%80%9A%E8%BF%87%E9%93%BE%E6%8E%A5%E7%BB%99%E5%87%BA%E4%BA%86%E8%AE%BA%E6%96%87%E7%9A%84PDF%E5%92%8C%E8%AE%BA%E6%96%87%E5%B7%B2%E6%9C%89%E7%9A%84FAQ%E3%80%82%E7%94%A8%E6%88%B7%E5%B0%86%E7%BB%A7%E7%BB%AD%E5%90%91%E4%BD%A0%E5%92%A8%E8%AF%A2%E8%AE%BA%E6%96%87%E7%9A%84%E7%9B%B8%E5%85%B3%E9%97%AE%E9%A2%98%EF%BC%8C%E8%AF%B7%E4%BD%A0%E4%BD%9C%E5%87%BA%E4%B8%93%E4%B8%9A%E7%9A%84%E5%9B%9E%E7%AD%94%EF%BC%8C%E4%B8%8D%E8%A6%81%E5%87%BA%E7%8E%B0%E7%AC%AC%E4%B8%80%E4%BA%BA%E7%A7%B0%EF%BC%8C%E5%BD%93%E6%B6%89%E5%8F%8A%E5%88%B0%E5%88%86%E7%82%B9%E5%9B%9E%E7%AD%94%E6%97%B6%EF%BC%8C%E9%BC%93%E5%8A%B1%E4%BD%A0%E4%BB%A5markdown%E6%A0%BC%E5%BC%8F%E8%BE%93%E5%87%BA%E3%80%82&send_immediately=true)
- **领域**: cs.CL

**摘要要点**: 将知识图谱的 1-hop 子图编码为**紧凑离散知识 token** 并注入 LLM，token 使用量减少最高 10x，性能保持竞争力。

**🔑 记忆关联**: 这是一种 **外部知识压缩存储** 方法，与 RAG 的"按需检索"不同，KoRe 将知识预编码为 token 级别的紧凑表示。类比于 **Semantic Kernel 的 Embedding 存储** 和 **LangChain 的 VectorStore**，但压缩到了离散 token 空间。

---

### 5. BalanceRAG: Joint Risk Calibration for Cascaded Retrieval-Augmented Generation

- **arXiv ID**: 2605.20084
- **链接**: [arxiv.org/abs/2605.20084](https://arxiv.org/abs/2605.20084) [Kimi解读](http://kimi.com/_prefill_chat?prefill_prompt=%E6%88%91%E4%BB%AC%E8%A6%81%E8%AE%A8%E8%AE%BA%E7%9A%84%E8%AE%BA%E6%96%87%E6%98%AFarxiv.org%2Fabs%2F2605.20084%EF%BC%8C%E9%93%BE%E6%8E%A5%E6%98%AF+https%3A%2F%2Farxiv.org%2Fpdf%2F2605.20084+%EF%BC%8C%E5%B7%B2%E6%9C%89%E7%9A%84FAQ%E9%93%BE%E6%8E%A5%E6%98%AF+https%3A%2F%2Fpapers.cool%2Farxiv%2Fkimi%3Fpaper%3D2605.20084+%E3%80%82%E8%AF%B7%E4%BB%A5%E6%AD%A4%E4%B8%BA%E5%9F%BA%E7%A1%80%EF%BC%8C%E7%BB%A7%E7%BB%AD%E5%9B%9E%E7%AD%94%E6%88%91%E5%90%8E%E9%9D%A2%E7%9A%84%E9%97%AE%E9%A2%98%E3%80%82&system_prompt=%E4%BD%A0%E6%98%AF%E4%B8%80%E4%B8%AA%E5%AD%A6%E6%9C%AF%E5%8A%A9%E6%89%8B%EF%BC%8C%E5%90%8E%E9%9D%A2%E7%9A%84%E5%AF%B9%E8%AF%9D%E5%B0%86%E5%9B%B4%E7%BB%95%E7%9D%80%E4%BB%A5%E4%B8%8B%E8%AE%BA%E6%96%87%E5%86%85%E5%AE%B9%E8%BF%9B%E8%A1%8C%EF%BC%8C%E5%B7%B2%E7%BB%8F%E9%80%9A%E8%BF%87%E9%93%BE%E6%8E%A5%E7%BB%99%E5%87%BA%E4%BA%86%E8%AE%BA%E6%96%87%E7%9A%84PDF%E5%92%8C%E8%AE%BA%E6%96%87%E5%B7%B2%E6%9C%89%E7%9A%84FAQ%E3%80%82%E7%94%A8%E6%88%B7%E5%B0%86%E7%BB%A7%E7%BB%AD%E5%90%91%E4%BD%A0%E5%92%A8%E8%AF%A2%E8%AE%BA%E6%96%87%E7%9A%84%E7%9B%B8%E5%85%B3%E9%97%AE%E9%A2%98%EF%BC%8C%E8%AF%B7%E4%BD%A0%E4%BD%9C%E5%87%BA%E4%B8%93%E4%B8%9A%E7%9A%84%E5%9B%9E%E7%AD%94%EF%BC%8C%E4%B8%8D%E8%A6%81%E5%87%BA%E7%8E%B0%E7%AC%AC%E4%B8%80%E4%BA%BA%E7%A7%B0%EF%BC%8C%E5%BD%93%E6%B6%89%E5%8F%8A%E5%88%B0%E5%88%86%E7%82%B9%E5%9B%9E%E7%AD%94%E6%97%B6%EF%BC%8C%E9%BC%93%E5%8A%B1%E4%BD%A0%E4%BB%A5markdown%E6%A0%BC%E5%BC%8F%E8%BE%93%E5%87%BA%E3%80%82&send_immediately=true)
- **领域**: cs.CL / cs.AI

**摘要要点**: 为级联 RAG 系统开发联合风险校准方法，通过二维格上的序贯图检验认证阈值对，在保持目标风险水平的同时减少不必要的检索调用。

**🔑 记忆关联**: 直接涉及 RAG 检索策略优化。核心洞察是 **"不是所有查询都需要检索"**——这暗示 Agent Memory 系统需要智能的 **检索决策机制**，而非无差别地查向量库。与 **LlamaIndex 的查询路由** 和 **RAGAS 的检索质量评估** 思路呼应。

---

### 6. A Methodology for Selecting and Composing Runtime Architecture Patterns for Production LLM Agents

- **arXiv ID**: 2605.20173
- **链接**: [arxiv.org/abs/2605.20173](https://arxiv.org/abs/2605.20173) [Kimi解读](http://kimi.com/_prefill_chat?prefill_prompt=%E6%88%91%E4%BB%AC%E8%A6%81%E8%AE%A8%E8%AE%BA%E7%9A%84%E8%AE%BA%E6%96%87%E6%98%AFarxiv.org%2Fabs%2F2605.20173%EF%BC%8C%E9%93%BE%E6%8E%A5%E6%98%AF+https%3A%2F%2Farxiv.org%2Fpdf%2F2605.20173+%EF%BC%8C%E5%B7%B2%E6%9C%89%E7%9A%84FAQ%E9%93%BE%E6%8E%A5%E6%98%AF+https%3A%2F%2Fpapers.cool%2Farxiv%2Fkimi%3Fpaper%3D2605.20173+%E3%80%82%E8%AF%B7%E4%BB%A5%E6%AD%A4%E4%B8%BA%E5%9F%BA%E7%A1%80%EF%BC%8C%E7%BB%A7%E7%BB%AD%E5%9B%9E%E7%AD%94%E6%88%91%E5%90%8E%E9%9D%A2%E7%9A%84%E9%97%AE%E9%A2%98%E3%80%82&system_prompt=%E4%BD%A0%E6%98%AF%E4%B8%80%E4%B8%AA%E5%AD%A6%E6%9C%AF%E5%8A%A9%E6%89%8B%EF%BC%8C%E5%90%8E%E9%9D%A2%E7%9A%84%E5%AF%B9%E8%AF%9D%E5%B0%86%E5%9B%B4%E7%BB%95%E7%9D%80%E4%BB%A5%E4%B8%8B%E8%AE%BA%E6%96%87%E5%86%85%E5%AE%B9%E8%BF%9B%E8%A1%8C%EF%BC%8C%E5%B7%B2%E7%BB%8F%E9%80%9A%E8%BF%87%E9%93%BE%E6%8E%A5%E7%BB%99%E5%87%BA%E4%BA%86%E8%AE%BA%E6%96%87%E7%9A%84PDF%E5%92%8C%E8%AE%BA%E6%96%87%E5%B7%B2%E6%9C%89%E7%9A%84FAQ%E3%80%82%E7%94%A8%E6%88%B7%E5%B0%86%E7%BB%A7%E7%BB%AD%E5%90%91%E4%BD%A0%E5%92%A8%E8%AF%A2%E8%AE%BA%E6%96%87%E7%9A%84%E7%9B%B8%E5%85%B3%E9%97%AE%E9%A2%98%EF%BC%8C%E8%AF%B7%E4%BD%A0%E4%BD%9C%E5%87%BA%E4%B8%93%E4%B8%9A%E7%9A%84%E5%9B%9E%E7%AD%94%EF%BC%8C%E4%B8%8D%E8%A6%81%E5%87%BA%E7%8E%B0%E7%AC%AC%E4%B8%80%E4%BA%BA%E7%A7%B0%EF%BC%8C%E5%BD%93%E6%B6%89%E5%8F%8A%E5%88%B0%E5%88%86%E7%82%B9%E5%9B%9E%E7%AD%94%E6%97%B6%EF%BC%8C%E9%BC%93%E5%8A%B1%E4%BD%A0%E4%BB%A5markdown%E6%A0%BC%E5%BC%8F%E8%BE%93%E5%87%BA%E3%80%82&send_immediately=true)
- **领域**: cs.AI / cs.SE

**摘要要点**: 提出 Agent 运行时架构设计方法论，围绕随机-确定性边界（SDB）组织三大关注点：Coordination、**State**、Control。提出六种运行时模式，包含共享状态机和事件驱动序列等。

**🔑 记忆关联**: "State" 关注点直接映射 Agent Memory 的架构层面。**共享状态机模式** 类似于 **MemGPT 的 Core Memory**，**事件驱动序列** 类似于 **LangGraph 的 Checkpoint**。对生产级 Agent 记忆系统的架构选择有直接指导意义。

---

### 7. ThoughtTrace: Understanding User Thoughts in Real-World LLM Interactions

- **arXiv ID**: 2605.20087
- **链接**: [arxiv.org/abs/2605.20087](https://arxiv.org/abs/2605.20087) [Kimi解读](http://kimi.com/_prefill_chat?prefill_prompt=%E6%88%91%E4%BB%AC%E8%A6%81%E8%AE%A8%E8%AE%BA%E7%9A%84%E8%AE%BA%E6%96%87%E6%98%AFarxiv.org%2Fabs%2F2605.20087%EF%BC%8C%E9%93%BE%E6%8E%A5%E6%98%AF+https%3A%2F%2Farxiv.org%2Fpdf%2F2605.20087+%EF%BC%8C%E5%B7%B2%E6%9C%89%E7%9A%84FAQ%E9%93%BE%E6%8E%A5%E6%98%AF+https%3A%2F%2Fpapers.cool%2Farxiv%2Fkimi%3Fpaper%3D2605.20087+%E3%80%82%E8%AF%B7%E4%BB%A5%E6%AD%A4%E4%B8%BA%E5%9F%BA%E7%A1%80%EF%BC%8C%E7%BB%A7%E7%BB%AD%E5%9B%9E%E7%AD%94%E6%88%91%E5%90%8E%E9%9D%A2%E7%9A%84%E9%97%AE%E9%A2%98%E3%80%82&system_prompt=%E4%BD%A0%E6%98%AF%E4%B8%80%E4%B8%AA%E5%AD%A6%E6%9C%AF%E5%8A%A9%E6%89%8B%EF%BC%8C%E5%90%8E%E9%9D%A2%E7%9A%84%E5%AF%B9%E8%AF%9D%E5%B0%86%E5%9B%B4%E7%BB%95%E7%9D%80%E4%BB%A5%E4%B8%8B%E8%AE%BA%E6%96%87%E5%86%85%E5%AE%B9%E8%BF%9B%E8%A1%8C%EF%BC%8C%E5%B7%B2%E7%BB%8F%E9%80%9A%E8%BF%87%E9%93%BE%E6%8E%A5%E7%BB%99%E5%87%BA%E4%BA%86%E8%AE%BA%E6%96%87%E7%9A%84PDF%E5%92%8C%E8%AE%BA%E6%96%87%E5%B7%B2%E6%9C%89%E7%9A%84FAQ%E3%80%82%E7%94%A8%E6%88%B7%E5%B0%86%E7%BB%A7%E7%BB%AD%E5%90%91%E4%BD%A0%E5%92%A8%E8%AF%A2%E8%AE%BA%E6%96%87%E7%9A%84%E7%9B%B8%E5%85%B3%E9%97%AE%E9%A2%98%EF%BC%8C%E8%AF%B7%E4%BD%A0%E4%BD%9C%E5%87%BA%E4%B8%93%E4%B8%9A%E7%9A%84%E5%9B%9E%E7%AD%94%EF%BC%8C%E4%B8%8D%E8%A6%81%E5%87%BA%E7%8E%B0%E7%AC%AC%E4%B8%80%E4%BA%BA%E7%A7%B0%EF%BC%8C%E5%BD%93%E6%B6%89%E5%8F%8A%E5%88%B0%E5%88%86%E7%82%B9%E5%9B%9E%E7%AD%94%E6%97%B6%EF%BC%8C%E9%BC%93%E5%8A%B1%E4%BD%A0%E4%BB%A5markdown%E6%A0%BC%E5%BC%8F%E8%BE%93%E5%87%BA%E3%80%82&send_immediately=true)
- **领域**: cs.CL / cs.AI

**摘要要点**: 首个大规模"用户思维"数据集，将真实多轮人机对话与用户自报告的思维配对。Thought 提升用户行为预测，thought-guided rewrite 提供细粒度对齐信号。

**🔑 记忆关联**: 开启了 **"用户意图记忆"** 的新维度——不仅记住用户说了什么，还要记住用户在想什么。对个性化 Agent 的 **用户画像记忆（User Profile Memory）** 有直接启发。

---

## 📊 研究趋势分析

### 热门方向

| 方向 | 论文数 | 趋势 |
|------|--------|------|
| **语义缓存与上下文复用** | 2 (PEEK, KoRe) | 🔥🔥🔥 新兴 |
| **信念状态建模** | 1 (ReBel) | 🔥🔥 上升中 |
| **跨会话经验积累** | 1 (AutoResearchClaw) | 🔥🔥 稳定 |
| **RAG 检索策略优化** | 1 (BalanceRAG) | 🔥🔥🔥 持续热门 |
| **Agent 运行时架构** | 1 (Production Patterns) | 🔥🔥 新兴 |
| **用户意图理解** | 1 (ThoughtTrace) | 🔥 新兴 |

### 关键趋势判断

1. **从"存什么"到"怎么缓存"**: PEEK 和 KoRe 的出现表明，社区不再只关注记忆的存储和检索，开始深入思考**记忆的压缩、缓存淘汰和 token 预算控制**。
2. **信念状态作为记忆的抽象**: ReBel 将交互历史压缩为信念状态并用于训练信号，预示着"记忆即信念"可能成为新的理论框架。
3. **生产级架构需求**: Production LLM Agents 论文系统性地将 State 作为一等公民，说明工业界对记忆系统的可靠性要求正在推动架构层面的标准化。

---

## 💡 关键洞察与创新点

### PEEK 的三级缓存流水线

Distiller → Cartographer → Evictor 的设计模式非常值得借鉴。对应到通用 Agent Memory 系统：
- **Distiller** = 记忆的 Write 阶段（从交互信号中提取可迁移知识）
- **Cartographer** = 记忆的 Store 阶段（结构化组织）
- **Evictor** = 记忆的遗忘/淘汰机制（token 预算约束下的优先级淘汰）

### ReBel 的信念一致性自监督

无需外部标注，将"预测的信念 vs 实际观测"的差异直接作为训练信号。这对自研 Memory 系统的启示是：**记忆质量可以通过对比"Agent 预期的记忆内容"与"实际结果"来自动评估和优化**。

### BalanceRAG 的"选择性检索"

级联 RAG 的核心洞察——不是每个查询都需要检索——对 Agent Memory 系统的设计同样重要：记忆系统需要一个 **"是否需要 Recall"的决策门控**，而非每次都全量检索。

---

## 🔗 与 19 个开源记忆项目的关联

| 论文 | 最相关的开源项目 | 关联分析 |
|------|-----------------|----------|
| **PEEK** | MemGPT, LlamaIndex | 语义缓存 ≈ MemGPT Core Memory + LlamaIndex 索引缓存 |
| **ReBel** | AutoGPT, CrewAI | 信念状态 ≈ AutoGPT 历史摘要 + CrewAI 上下文管理 |
| **AutoResearchClaw** | BabyAGI, MemGPT | 跨轮演化 ≈ BabyAGI 任务历史 + MemGPT 召回记忆 |
| **KoRe** | Semantic Kernel, LangChain | 离散知识 token ≈ Semantic Kernel Embedding + LangChain VectorStore 的压缩版 |
| **BalanceRAG** | LlamaIndex, RAGAS | 选择性检索 ≈ LlamaIndex 查询路由 |
| **Production Patterns** | LangGraph, MemGPT | 共享状态机 ≈ MemGPT Core Memory；事件驱动 ≈ LangGraph Checkpoint |
| **ThoughtTrace** | 无直接对应 | 开辟新的"用户意图记忆"维度 |

### 对自研 Memory 的建议

1. **借鉴 PEEK 的 Evictor**: 自研系统需要明确的 token 预算和优先级淘汰机制
2. **引入信念状态**: 不仅仅存储原始交互，还要存储 Agent 对当前状态的"理解"
3. **选择性检索门控**: 不是所有场景都需要 Recall，需要一个轻量的决策模块
4. **用户意图维度**: 在 Memory 中增加"用户为什么这么说"的标注，而不仅是"用户说了什么"

---

## 📅 数据来源

- 数据日期: 2026-05-19 (arXiv 发布日期)
- 扫描范围: cs.AI + cs.CL 共约 28 篇论文
- 筛选关键词: agent, memory, episodic, recall, retrieval, RAG, long-term, experience, cache, belief state, knowledge representation
- 筛选结果: 7 篇相关论文（命中率 25%）
