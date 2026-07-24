---
title: Agent Memory arXiv 日报 (2026-05-22)
tags:
  - agent-memory
  - arxiv
  - daily-report
  - LLM
  - retrieval
  - KV-cache
categories: [Agent Memory 研究]
  - Agent Memory 研究
abbrlink: 791
date: 2026-05-22 18:00:00
noindex: true
---

# Agent Memory arXiv 日报 — 2026年5月22日

> 本日扫描 arXiv cs.AI 最新论文（236 篇），筛选出 **8 篇**与 Agent Memory、Memory-Augmented Agent、KV Cache 压缩、检索增强推理等方向密切相关的论文。

---

## 📋 今日相关论文列表

### 1. MOSS: Self-Evolution through Source-Level Rewriting in Autonomous Agent Systems

- **arXiv ID:** 2605.22794
- **链接:** [https://arxiv.org/abs/2605.22794](https://arxiv.org/abs/2605.22794) [Kimi解读](http://kimi.com/_prefill_chat?prefill_prompt=%E6%88%91%E4%BB%AC%E8%A6%81%E8%AE%A8%E8%AE%BA%E7%9A%84%E8%AE%BA%E6%96%87%E6%98%AFhttps%3A%2F%2Farxiv.org%2Fabs%2F2605.22794%EF%BC%8C%E9%93%BE%E6%8E%A5%E6%98%AF+https%3A%2F%2Farxiv.org%2Fpdf%2F2605.22794+%EF%BC%8C%E5%B7%B2%E6%9C%89%E7%9A%84FAQ%E9%93%BE%E6%8E%A5%E6%98%AF+https%3A%2F%2Fpapers.cool%2Farxiv%2Fkimi%3Fpaper%3D2605.22794+%E3%80%82%E8%AF%B7%E4%BB%A5%E6%AD%A4%E4%B8%BA%E5%9F%BA%E7%A1%80%EF%BC%8C%E7%BB%A7%E7%BB%AD%E5%9B%9E%E7%AD%94%E6%88%91%E5%90%8E%E9%9D%A2%E7%9A%84%E9%97%AE%E9%A2%98%E3%80%82&system_prompt=%E4%BD%A0%E6%98%AF%E4%B8%80%E4%B8%AA%E5%AD%A6%E6%9C%AF%E5%8A%A9%E6%89%8B%EF%BC%8C%E5%90%8E%E9%9D%A2%E7%9A%84%E5%AF%B9%E8%AF%9D%E5%B0%86%E5%9B%B4%E7%BB%95%E7%9D%80%E4%BB%A5%E4%B8%8B%E8%AE%BA%E6%96%87%E5%86%85%E5%AE%B9%E8%BF%9B%E8%A1%8C%EF%BC%8C%E5%B7%B2%E7%BB%8F%E9%80%9A%E8%BF%87%E9%93%BE%E6%8E%A5%E7%BB%99%E5%87%BA%E4%BA%86%E8%AE%BA%E6%96%87%E7%9A%84PDF%E5%92%8C%E8%AE%BA%E6%96%87%E5%B7%B2%E6%9C%89%E7%9A%84FAQ%E3%80%82%E7%94%A8%E6%88%B7%E5%B0%86%E7%BB%A7%E7%BB%AD%E5%90%91%E4%BD%A0%E5%92%A8%E8%AF%A2%E8%AE%BA%E6%96%87%E7%9A%84%E7%9B%B8%E5%85%B3%E9%97%AE%E9%A2%98%EF%BC%8C%E8%AF%B7%E4%BD%A0%E4%BD%9C%E5%87%BA%E4%B8%93%E4%B8%9A%E7%9A%84%E5%9B%9E%E7%AD%94%EF%BC%8C%E4%B8%8D%E8%A6%81%E5%87%BA%E7%8E%B0%E7%AC%AC%E4%B8%80%E4%BA%BA%E7%A7%B0%EF%BC%8C%E5%BD%93%E6%B6%89%E5%8F%8A%E5%88%B0%E5%88%86%E7%82%B9%E5%9B%9E%E7%AD%94%E6%97%B6%EF%BC%8C%E9%BC%93%E5%8A%B1%E4%BD%A0%E4%BB%A5markdown%E6%A0%BC%E5%BC%8F%E8%BE%93%E5%87%BA%E3%80%82&send_immediately=true)
- **摘要要点:** 提出 MOSS 系统，让自主 Agent 在源代码层面进行自我改写以实现进化。该工作指出当前自进化 Agent 将演化局限于"文本可变工件"（skill files、prompt 配置、**memory schemas**、workflow graphs），而路由、钩子排序、状态不变量等结构性逻辑存在于代码中无法通过文本层触达。MOSS 通过确定性多阶段管线在生产 Agent 底座上进行源码级自适应，在 OpenClaw 上将四任务平均评分从 0.25 提升至 0.61。
- **与记忆的关联:** 直接讨论了 memory schemas 作为 Agent 进化的文本可变工件之一，指出其局限性——仅靠文本层修改记忆模式无法解决结构性问题。

### 2. Gated DeltaNet-2: Decoupling Erase and Write in Linear Attention

- **arXiv ID:** 2605.22791
- **链接:** [https://arxiv.org/abs/2605.22791](https://arxiv.org/abs/2605.22791) [Kimi解读](http://kimi.com/_prefill_chat?prefill_prompt=%E6%88%91%E4%BB%AC%E8%A6%81%E8%AE%A8%E8%AE%BA%E7%9A%84%E8%AE%BA%E6%96%87%E6%98%AFhttps%3A%2F%2Farxiv.org%2Fabs%2F2605.22791%EF%BC%8C%E9%93%BE%E6%8E%A5%E6%98%AF+https%3A%2F%2Farxiv.org%2Fpdf%2F2605.22791+%EF%BC%8C%E5%B7%B2%E6%9C%89%E7%9A%84FAQ%E9%93%BE%E6%8E%A5%E6%98%AF+https%3A%2F%2Fpapers.cool%2Farxiv%2Fkimi%3Fpaper%3D2605.22791+%E3%80%82%E8%AF%B7%E4%BB%A5%E6%AD%A4%E4%B8%BA%E5%9F%BA%E7%A1%80%EF%BC%8C%E7%BB%A7%E7%BB%AD%E5%9B%9E%E7%AD%94%E6%88%91%E5%90%8E%E9%9D%A2%E7%9A%84%E9%97%AE%E9%A2%98%E3%80%82&system_prompt=%E4%BD%A0%E6%98%AF%E4%B8%80%E4%B8%AA%E5%AD%A6%E6%9C%AF%E5%8A%A9%E6%89%8B%EF%BC%8C%E5%90%8E%E9%9D%A2%E7%9A%84%E5%AF%B9%E8%AF%9D%E5%B0%86%E5%9B%B4%E7%BB%95%E7%9D%80%E4%BB%A5%E4%B8%8B%E8%AE%BA%E6%96%87%E5%86%85%E5%AE%B9%E8%BF%9B%E8%A1%8C%EF%BC%8C%E5%B7%B2%E7%BB%8F%E9%80%9A%E8%BF%87%E9%93%BE%E6%8E%A5%E7%BB%99%E5%87%BA%E4%BA%86%E8%AE%BA%E6%96%87%E7%9A%84PDF%E5%92%8C%E8%AE%BA%E6%96%87%E5%B7%B2%E6%9C%89%E7%9A%84FAQ%E3%80%82%E7%94%A8%E6%88%B7%E5%B0%86%E7%BB%A7%E7%BB%AD%E5%90%91%E4%BD%A0%E5%92%A8%E8%AF%A2%E8%AE%BA%E6%96%87%E7%9A%84%E7%9B%B8%E5%85%B3%E9%97%AE%E9%A2%98%EF%BC%8C%E8%AF%B7%E4%BD%A0%E4%BD%9C%E5%87%BA%E4%B8%93%E4%B8%9A%E7%9A%84%E5%9B%9E%E7%AD%94%EF%BC%8C%E4%B8%8D%E8%A6%81%E5%87%BA%E7%8E%B0%E7%AC%AC%E4%B8%80%E4%BA%BA%E7%A7%B0%EF%BC%8C%E5%BD%93%E6%B6%89%E5%8F%8A%E5%88%B0%E5%88%86%E7%82%B9%E5%9B%9E%E7%AD%94%E6%97%B6%EF%BC%8C%E9%BC%93%E5%8A%B1%E4%BD%A0%E4%BB%A5markdown%E6%A0%BC%E5%BC%8F%E8%BE%93%E5%87%BA%E3%80%82&send_immediately=true)
- **摘要要点:** 提出将线性注意力中的"擦除"和"写入"操作解耦为独立的通道级门控（erase gate + write gate），改进了固定大小循环状态（即压缩记忆）的编辑能力。在 1.3B 参数、100B token 训练下，于长上下文 RULER needle-in-a-haystack 基准上取得最佳成绩。
- **与记忆的关联:** 核心贡献是改进了 Transformer 中**固定大小循环记忆**的读写机制——"困难不仅在于遗忘什么，更在于如何编辑这个压缩记忆而不扰乱已有关联"。这直接对应 Agent Memory 的 Write/Store 操作设计。

### 3. LCGuard: Latent Communication Guard for Safe KV Sharing in Multi-Agent Systems

- **arXiv ID:** 2605.22786
- **链接:** [https://arxiv.org/abs/2605.22786](https://arxiv.org/abs/2605.22786) [Kimi解读](http://kimi.com/_prefill_chat?prefill_prompt=%E6%88%91%E4%BB%AC%E8%A6%81%E8%AE%A8%E8%AE%BA%E7%9A%84%E8%AE%BA%E6%96%87%E6%98%AFhttps%3A%2F%2Farxiv.org%2Fabs%2F2605.22786%EF%BC%8C%E9%93%BE%E6%8E%A5%E6%98%AF+https%3A%2F%2Farxiv.org%2Fpdf%2F2605.22786+%EF%BC%8C%E5%B7%B2%E6%9C%89%E7%9A%84FAQ%E9%93%BE%E6%8E%A5%E6%98%AF+https%3A%2F%2Fpapers.cool%2Farxiv%2Fkimi%3Fpaper%3D2605.22786+%E3%80%82%E8%AF%B7%E4%BB%A5%E6%AD%A4%E4%B8%BA%E5%9F%BA%E7%A1%80%EF%BC%8C%E7%BB%A7%E7%BB%AD%E5%9B%9E%E7%AD%94%E6%88%91%E5%90%8E%E9%9D%A2%E7%9A%84%E9%97%AE%E9%A2%98%E3%80%82&system_prompt=%E4%BD%A0%E6%98%AF%E4%B8%80%E4%B8%AA%E5%AD%A6%E6%9C%AF%E5%8A%A9%E6%89%8B%EF%BC%8C%E5%90%8E%E9%9D%A2%E7%9A%84%E5%AF%B9%E8%AF%9D%E5%B0%86%E5%9B%B4%E7%BB%95%E7%9D%80%E4%BB%A5%E4%B8%8B%E8%AE%BA%E6%96%87%E5%86%85%E5%AE%B9%E8%BF%9B%E8%A1%8C%EF%BC%8C%E5%B7%B2%E7%BB%8F%E9%80%9A%E8%BF%87%E9%93%BE%E6%8E%A5%E7%BB%99%E5%87%BA%E4%BA%86%E8%AE%BA%E6%96%87%E7%9A%84PDF%E5%92%8C%E8%AE%BA%E6%96%87%E5%B7%B2%E6%9C%89%E7%9A%84FAQ%E3%80%82%E7%94%A8%E6%88%B7%E5%B0%86%E7%BB%A7%E7%BB%AD%E5%90%91%E4%BD%A0%E5%92%A8%E8%AF%A2%E8%AE%BA%E6%96%87%E7%9A%84%E7%9B%B8%E5%85%B3%E9%97%AE%E9%A2%98%EF%BC%8C%E8%AF%B7%E4%BD%A0%E4%BD%9C%E5%87%BA%E4%B8%93%E4%B8%9A%E7%9A%84%E5%9B%9E%E7%AD%94%EF%BC%8C%E4%B8%8D%E8%A6%81%E5%87%BA%E7%8E%B0%E7%AC%AC%E4%B8%80%E4%BA%BA%E7%A7%B0%EF%BC%8C%E5%BD%93%E6%B6%89%E5%8F%8A%E5%88%B0%E5%88%86%E7%82%B9%E5%9B%9E%E7%AD%94%E6%97%B6%EF%BC%8C%E9%BC%93%E5%8A%B1%E4%BD%A0%E4%BB%A5markdown%E6%A0%BC%E5%BC%8F%E8%BE%93%E5%87%BA%E3%80%82&send_immediately=true)
- **摘要要点:** 提出 LCGuard 框架，将多 Agent LLM 系统中共享的 KV cache 视为**潜在工作记忆（latent working memory）**，通过表征级变换在 cache artifacts 传输前进行安全过滤。形式化定义了基于重构的敏感信息泄漏，并通过对抗训练在保持任务性能的同时降低泄漏风险。
- **与记忆的关联:** 直接将 KV cache 定义为"latent working memory"，研究多 Agent 间记忆共享的安全性问题。这与 MemGPT 等框架中 Agent 间 memory 传递的隐私保护直接相关。

### 4. AtelierEval / AtelierJudge: Agentic Evaluation with Memory-Augmented Evaluator

- **arXiv ID:** 2605.22645
- **链接:** [https://arxiv.org/abs/2605.22645](https://arxiv.org/abs/2605.22662) [Kimi解读](http://kimi.com/_prefill_chat?prefill_prompt=%E6%88%91%E4%BB%AC%E8%A6%81%E8%AE%A8%E8%AE%BA%E7%9A%84%E8%AE%BA%E6%96%87%E6%98%AFhttps%3A%2F%2Farxiv.org%2Fabs%2F2605.22645%EF%BC%8C%E9%93%BE%E6%8E%A5%E6%98%AF+https%3A%2F%2Farxiv.org%2Fpdf%2F2605.22662+%EF%BC%8C%E5%B7%B2%E6%9C%89%E7%9A%84FAQ%E9%93%BE%E6%8E%A5%E6%98%AF+https%3A%2F%2Fpapers.cool%2Farxiv%2Fkimi%3Fpaper%3D2605.22662+%E3%80%82%E8%AF%B7%E4%BB%A5%E6%AD%A4%E4%B8%BA%E5%9F%BA%E7%A1%80%EF%BC%8C%E7%BB%A7%E7%BB%AD%E5%9B%9E%E7%AD%94%E6%88%91%E5%90%8E%E9%9D%A2%E7%9A%84%E9%97%AE%E9%A2%98%E3%80%82&system_prompt=%E4%BD%A0%E6%98%AF%E4%B8%80%E4%B8%AA%E5%AD%A6%E6%9C%AF%E5%8A%A9%E6%89%8B%EF%BC%8C%E5%90%8E%E9%9D%A2%E7%9A%84%E5%AF%B9%E8%AF%9D%E5%B0%86%E5%9B%B4%E7%BB%95%E7%9D%80%E4%BB%A5%E4%B8%8B%E8%AE%BA%E6%96%87%E5%86%85%E5%AE%B9%E8%BF%9B%E8%A1%8C%EF%BC%8C%E5%B7%B2%E7%BB%8F%E9%80%9A%E8%BF%87%E9%93%BE%E6%8E%A5%E7%BB%99%E5%87%BA%E4%BA%86%E8%AE%BA%E6%96%87%E7%9A%84PDF%E5%92%8C%E8%AE%BA%E6%96%87%E5%B7%B2%E6%9C%89%E7%9A%84FAQ%E3%80%82%E7%94%A8%E6%88%B7%E5%B0%86%E7%BB%A7%E7%BB%AD%E5%90%91%E4%BD%A0%E5%92%A8%E8%AF%A2%E8%AE%BA%E6%96%87%E7%9A%84%E7%9B%B8%E5%85%B3%E9%97%AE%E9%A2%98%EF%BC%8C%E8%AF%B7%E4%BD%A0%E4%BD%9C%E5%87%BA%E4%B8%93%E4%B8%9A%E7%9A%84%E5%9B%9E%E7%AD%94%EF%BC%8C%E4%B8%8D%E8%A6%81%E5%87%BA%E7%8E%B0%E7%AC%AC%E4%B8%80%E4%BA%BA%E7%A7%B0%EF%BC%8C%E5%BD%93%E6%B6%89%E5%8F%8A%E5%88%B0%E5%88%86%E7%82%B9%E5%9B%9E%E7%AD%94%E6%97%B6%EF%BC%8C%E9%BC%93%E5%8A%B1%E4%BD%A0%E4%BB%A5markdown%E6%A0%BC%E5%BC%8F%E8%BE%93%E5%87%BA%E3%80%82&send_immediately=true)
- **摘要要点:** 提出 AtelierJudge——一个**skill-based、memory-augmented agentic evaluator**，用于评估 T2I 提示词质量。该评估器使用记忆增强机制，在主观和客观评分上与人类专家的 Spearman 相关性达 0.79，接近人类水平。
- **与记忆的关联:** 直接在标题中标注"memory-augmented"，展示了记忆增强在 Agent 评估器中的应用——通过记忆积累评估经验来提升评分一致性。

### 5. Meta-Soft: Leveraging Composable Meta-Tokens for Context-Preserving KV Cache Compression

- **arXiv ID:** 2605.22337
- **链接:** [https://arxiv.org/abs/2605.22337](https://arxiv.org/abs/2605.22337) [Kimi解读](http://kimi.com/_prefill_chat?prefill_prompt=%E6%88%91%E4%BB%AC%E8%A6%81%E8%AE%A8%E8%AE%BA%E7%9A%84%E8%AE%BA%E6%96%87%E6%98%AFhttps%3A%2F%2Farxiv.org%2Fabs%2F2605.22337%EF%BC%8C%E9%93%BE%E6%8E%A5%E6%98%AF+https%3A%2F%2Farxiv.org%2Fpdf%2F2605.22337+%EF%BC%8C%E5%B7%B2%E6%9C%89%E7%9A%84FAQ%E9%93%BE%E6%8E%A5%E6%98%AF+https%3A%2F%2Fpapers.cool%2Farxiv%2Fkimi%3Fpaper%3D2605.22337+%E3%80%82%E8%AF%B7%E4%BB%A5%E6%AD%A4%E4%B8%BA%E5%9F%BA%E7%A1%80%EF%BC%8C%E7%BB%A7%E7%BB%AD%E5%9B%9E%E7%AD%94%E6%88%91%E5%90%8E%E9%9D%A2%E7%9A%84%E9%97%AE%E9%A2%98%E3%80%82&system_prompt=%E4%BD%A0%E6%98%AF%E4%B8%80%E4%B8%AA%E5%AD%A6%E6%9C%AF%E5%8A%A9%E6%89%8B%EF%BC%8C%E5%90%8E%E9%9D%A2%E7%9A%84%E5%AF%B9%E8%AF%9D%E5%B0%86%E5%9B%B4%E7%BB%95%E7%9D%80%E4%BB%A5%E4%B8%8B%E8%AE%BA%E6%96%87%E5%86%85%E5%AE%B9%E8%BF%9B%E8%A1%8C%EF%BC%8C%E5%B7%B2%E7%BB%8F%E9%80%9A%E8%BF%87%E9%93%BE%E6%8E%A5%E7%BB%99%E5%87%BA%E4%BA%86%E8%AE%BA%E6%96%87%E7%9A%84PDF%E5%92%8C%E8%AE%BA%E6%96%87%E5%B7%B2%E6%9C%89%E7%9A%84FAQ%E3%80%82%E7%94%A8%E6%88%B7%E5%B0%86%E7%BB%A7%E7%BB%AD%E5%90%91%E4%BD%A0%E5%92%A8%E8%AF%A2%E8%AE%BA%E6%96%87%E7%9A%84%E7%9B%B8%E5%85%B3%E9%97%AE%E9%A2%98%EF%BC%8C%E8%AF%B7%E4%BD%A0%E4%BD%9C%E5%87%BA%E4%B8%93%E4%B8%9A%E7%9A%84%E5%9B%9E%E7%AD%94%EF%BC%8C%E4%B8%8D%E8%A6%81%E5%87%BA%E7%8E%B0%E7%AC%AC%E4%B8%80%E4%BA%BA%E7%A7%B0%EF%BC%8C%E5%BD%93%E6%B6%89%E5%8F%8A%E5%88%B0%E5%88%86%E7%82%B9%E5%9B%9E%E7%AD%94%E6%97%B6%EF%BC%8C%E9%BC%93%E5%8A%B1%E4%BD%A0%E4%BB%A5markdown%E6%A0%BC%E5%BC%8F%E8%BE%93%E5%87%BA%E3%80%82&send_immediately=true)
- **摘要要点:** 提出 Meta-Soft 框架，通过可学习的正交基矩阵和 Gumbel-Softmax 选择器动态合成 Soft Tokens 进行 KV Cache 压缩。引入基于注意力流的集成机制，将被移除 token 的语义信息重新分配到保留 token 中，避免不可逆的信息丢失和上下文断裂。
- **与记忆的关联:** KV Cache 本质上是 LLM 的短期工作记忆。该工作解决了记忆压缩时的信息保留问题——这在 Agent 长期记忆管理中同样关键（何时丢弃、如何保留语义）。

### 6. Search-E1: Self-Distillation Drives Self-Evolution in Search-Augmented Reasoning

- **arXiv ID:** 2605.22511
- **链接:** [https://arxiv.org/abs/2605.22511](https://arxiv.org/abs/2605.22511) [Kimi解读](http://kimi.com/_prefill_chat?prefill_prompt=%E6%88%91%E4%BB%AC%E8%A6%81%E8%AE%A8%E8%AE%BA%E7%9A%84%E8%AE%BA%E6%96%87%E6%98%AFhttps%3A%2F%2Farxiv.org%2Fabs%2F2605.22511%EF%BC%8C%E9%93%BE%E6%8E%A5%E6%98%AF+https%3A%2F%2Farxiv.org%2Fpdf%2F2605.22511+%EF%BC%8C%E5%B7%B2%E6%9C%89%E7%9A%84FAQ%E9%93%BE%E6%8E%A5%E6%98%AF+https%3A%2F%2Fpapers.cool%2Farxiv%2Fkimi%3Fpaper%3D2605.22511+%E3%80%82%E8%AF%B7%E4%BB%A5%E6%AD%A4%E4%B8%BA%E5%9F%BA%E7%A1%80%EF%BC%8C%E7%BB%A7%E7%BB%AD%E5%9B%9E%E7%AD%94%E6%88%91%E5%90%8E%E9%9D%A2%E7%9A%84%E9%97%AE%E9%A2%98%E3%80%82&system_prompt=%E4%BD%A0%E6%98%AF%E4%B8%80%E4%B8%AA%E5%AD%A6%E6%9C%AF%E5%8A%A9%E6%89%8B%EF%BC%8C%E5%90%8E%E9%9D%A2%E7%9A%84%E5%AF%B9%E8%AF%9D%E5%B0%86%E5%9B%B4%E7%BB%95%E7%9D%80%E4%BB%A5%E4%B8%8B%E8%AE%BA%E6%96%87%E5%86%85%E5%AE%B9%E8%BF%9B%E8%A1%8C%EF%BC%8C%E5%B7%B2%E7%BB%8F%E9%80%9A%E8%BF%87%E9%93%BE%E6%8E%A5%E7%BB%99%E5%87%BA%E4%BA%86%E8%AE%BA%E6%96%87%E7%9A%84PDF%E5%92%8C%E8%AE%BA%E6%96%87%E5%B7%B2%E6%9C%89%E7%9A%84FAQ%E3%80%82%E7%94%A8%E6%88%B7%E5%B0%86%E7%BB%A7%E7%BB%AD%E5%90%91%E4%BD%A0%E5%92%A8%E8%AF%A2%E8%AE%BA%E6%96%87%E7%9A%84%E7%9B%B8%E5%85%B3%E9%97%AE%E9%A2%98%EF%BC%8C%E8%AF%B7%E4%BD%A0%E4%BD%9C%E5%87%BA%E4%B8%93%E4%B8%9A%E7%9A%84%E5%9B%9E%E7%AD%94%EF%BC%8C%E4%B8%8D%E8%A6%81%E5%87%BA%E7%8E%B0%E7%AC%AC%E4%B8%80%E4%BA%BA%E7%A7%B0%EF%BC%8C%E5%BD%93%E6%B6%89%E5%8F%8A%E5%88%B0%E5%88%86%E7%82%B9%E5%9B%9E%E7%AD%94%E6%97%B6%EF%BC%8C%E9%BC%93%E5%8A%B1%E4%BD%A0%E4%BB%A5markdown%E6%A0%BC%E5%BC%8F%E8%BE%93%E5%87%BA%E3%80%82&send_immediately=true)
- **摘要要点:** 提出 Search-E1 方法，通过 GRPO + 离线自蒸馏（OFSD）让搜索增强推理 Agent 自主进化。无需外部监督、PRM、树搜索等附加机制，在 7 个 QA 基准上以 Qwen2.5-3B 达到 0.440 平均 EM，超越所有同规模开源基线。
- **与记忆的关联:** 搜索增强推理是 RAG 的前沿方向。自蒸馏机制让 Agent 从自身的检索经验中学习——本质上是一种**经验记忆的自优化**。

### 7. Think Thrice Before You Speak: Dual Knowledge-Enhanced Theory-of-Mind Reasoning

- **arXiv ID:** 2605.22602
- **链接:** [https://arxiv.org/abs/2605.22602](https://arxiv.org/abs/2605.22602) [Kimi解读](http://kimi.com/_prefill_chat?prefill_prompt=%E6%88%91%E4%BB%AC%E8%A6%81%E8%AE%A8%E8%AE%BA%E7%9A%84%E8%AE%BA%E6%96%87%E6%98%AFhttps%3A%2F%2Farxiv.org%2Fabs%2F2605.22602%EF%BC%8C%E9%93%BE%E6%8E%A5%E6%98%AF+https%3A%2F%2Farxiv.org%2Fpdf%2F2605.22602+%EF%BC%8C%E5%B7%B2%E6%9C%89%E7%9A%84FAQ%E9%93%BE%E6%8E%A5%E6%98%AF+https%3A%2F%2Fpapers.cool%2Farxiv%2Fkimi%3Fpaper%3D2605.22602+%E3%80%82%E8%AF%B7%E4%BB%A5%E6%AD%A4%E4%B8%BA%E5%9F%BA%E7%A1%80%EF%BC%8C%E7%BB%A7%E7%BB%AD%E5%9B%9E%E7%AD%94%E6%88%91%E5%90%8E%E9%9D%A2%E7%9A%84%E9%97%AE%E9%A2%98%E3%80%82&system_prompt=%E4%BD%A0%E6%98%AF%E4%B8%80%E4%B8%AA%E5%AD%A6%E6%9C%AF%E5%8A%A9%E6%89%8B%EF%BC%8C%E5%90%8E%E9%9D%A2%E7%9A%84%E5%AF%B9%E8%AF%9D%E5%B0%86%E5%9B%B4%E7%BB%95%E7%9D%80%E4%BB%A5%E4%B8%8B%E8%AE%BA%E6%96%87%E5%86%85%E5%AE%B9%E8%BF%9B%E8%A1%8C%EF%BC%8C%E5%B7%B2%E7%BB%8F%E9%80%9A%E8%BF%87%E9%93%BE%E6%8E%A5%E7%BB%99%E5%87%BA%E4%BA%86%E8%AE%BA%E6%96%87%E7%9A%84PDF%E5%92%8C%E8%AE%BA%E6%96%87%E5%B7%B2%E6%9C%89%E7%9A%84FAQ%E3%80%82%E7%94%A8%E6%88%B7%E5%B0%86%E7%BB%A7%E7%BB%AD%E5%90%91%E4%BD%A0%E5%92%A8%E8%AF%A2%E8%AE%BA%E6%96%87%E7%9A%84%E7%9B%B8%E5%85%B3%E9%97%AE%E9%A2%98%EF%BC%8C%E8%AF%B7%E4%BD%A0%E4%BD%9C%E5%87%BA%E4%B8%93%E4%B8%9A%E7%9A%84%E5%9B%9E%E7%AD%94%EF%BC%8C%E4%B8%8D%E8%A6%81%E5%87%BA%E7%8E%B0%E7%AC%AC%E4%B8%80%E4%BA%BA%E7%A7%B0%EF%BC%8C%E5%BD%93%E6%B6%89%E5%8F%8A%E5%88%B0%E5%88%86%E7%82%B9%E5%9B%9E%E7%AD%94%E6%97%B6%EF%BC%8C%E9%BC%93%E5%8A%B1%E4%BD%A0%E4%BB%A5markdown%E6%A0%BC%E5%BC%8F%E8%BE%93%E5%87%BA%E3%80%82&send_immediately=true)
- **摘要要点:** 提出 TTBYS 框架，利用**显式和隐式先验经验**（explicit and implicit prior experiences）增强 LLM 对心理状态（信念、欲望、意图）的推理能力。Qwen3-8B + TTBYS 在信念预测上超过 GPT-5 达 22.80%。
- **与记忆的关联:** "先验经验"的利用直接对应 Agent Memory 中的**经验记忆（episodic memory）**——从历史交互中提取模式来指导当前推理。

### 8. AMEL: Accumulated Message Effects on LLM Judgments

- **arXiv ID:** 2605.22714
- **链接:** [https://arxiv.org/abs/2605.22714](https://arxiv.org/abs/2605.22714) [Kimi解读](http://kimi.com/_prefill_chat?prefill_prompt=%E6%88%91%E4%BB%AC%E8%A6%81%E8%AE%A8%E8%AE%BA%E7%9A%84%E8%AE%BA%E6%96%87%E6%98%AFhttps%3A%2F%2Farxiv.org%2Fabs%2F2605.22714%EF%BC%8C%E9%93%BE%E6%8E%A5%E6%98%AF+https%3A%2F%2Farxiv.org%2Fpdf%2F2605.22714+%EF%BC%8C%E5%B7%B2%E6%9C%89%E7%9A%84FAQ%E9%93%BE%E6%8E%A5%E6%98%AF+https%3A%2F%2Fpapers.cool%2Farxiv%2Fkimi%3Fpaper%3D2605.22714+%E3%80%82%E8%AF%B7%E4%BB%A5%E6%AD%A4%E4%B8%BA%E5%9F%BA%E7%A1%80%EF%BC%8C%E7%BB%A7%E7%BB%AD%E5%9B%9E%E7%AD%94%E6%88%91%E5%90%8E%E9%9D%A2%E7%9A%84%E9%97%AE%E9%A2%98%E3%80%82&system_prompt=%E4%BD%A0%E6%98%AF%E4%B8%80%E4%B8%AA%E5%AD%A6%E6%9C%AF%E5%8A%A9%E6%89%8B%EF%BC%8C%E5%90%8E%E9%9D%A2%E7%9A%84%E5%AF%B9%E8%AF%9D%E5%B0%86%E5%9B%B4%E7%BB%95%E7%9D%80%E4%BB%A5%E4%B8%8B%E8%AE%BA%E6%96%87%E5%86%85%E5%AE%B9%E8%BF%9B%E8%A1%8C%EF%BC%8C%E5%B7%B2%E7%BB%8F%E9%80%9A%E8%BF%87%E9%93%BE%E6%8E%A5%E7%BB%99%E5%87%BA%E4%BA%86%E8%AE%BA%E6%96%87%E7%9A%84PDF%E5%92%8C%E8%AE%BA%E6%96%87%E5%B7%B2%E6%9C%89%E7%9A%84FAQ%E3%80%82%E7%94%A8%E6%88%B7%E5%B0%86%E7%BB%A7%E7%BB%AD%E5%90%91%E4%BD%A0%E5%92%A8%E8%AF%A2%E8%AE%BA%E6%96%87%E7%9A%84%E7%9B%B8%E5%85%B3%E9%97%AE%E9%A2%98%EF%BC%8C%E8%AF%B7%E4%BD%A0%E4%BD%9C%E5%87%BA%E4%B8%93%E4%B8%9A%E7%9A%84%E5%9B%9E%E7%AD%94%EF%BC%8C%E4%B8%8D%E8%A6%81%E5%87%BA%E7%8E%B0%E7%AC%AC%E4%B8%80%E4%BA%BA%E7%A7%B0%EF%BC%8C%E5%BD%93%E6%B6%89%E5%8F%8A%E5%88%B0%E5%88%86%E7%82%B9%E5%9B%9E%E7%AD%94%E6%97%B6%EF%BC%8C%E9%BC%93%E5%8A%B1%E4%BD%A0%E4%BB%A5markdown%E6%A0%BC%E5%BC%8F%E8%BE%93%E5%87%BA%E3%80%82&send_immediately=true)
- **摘要要点:** 大规模研究（75,898 次 API 调用、11 个模型）发现 LLM 判断受对话历史极性偏置——先前正面评价使后续判断偏向正面，负面同理。负面历史比正面历史产生 1.62 倍更多偏置。有趣的是，偏置不随上下文长度增长（5 轮和 50 轮效果相同）。
- **与记忆的关联:** 直接揭示了 Agent 在使用**对话记忆**时的系统性偏置问题。对任何维护会话历史的 Agent Memory 系统都有重要启示。

---

## 🔬 研究趋势分析

### 热门方向

| 方向 | 论文数 | 趋势 |
|------|--------|------|
| **KV Cache 压缩与优化** | 2 | 🔥🔥🔥 持续升温，从通用压缩走向上下文感知的智能压缩 |
| **Agent 自进化** | 2 | 🔥🔥🔥 新兴热点，从 prompt/memory 层面进化到源码级 |
| **多 Agent 记忆共享** | 1 | 🔥🔥 隐私安全成为新关注点 |
| **经验增强推理** | 2 | 🔥🔥 从 RAG 检索扩展到结构化经验复用 |
| **对话记忆偏置** | 1 | 🔥 安全/对齐视角的记忆研究开始出现 |

### 关键观察

1. **记忆压缩成为瓶颈问题**：线性注意力和 KV Cache 压缩的持续进展表明，如何高效存储和检索信息仍然是 Agent Memory 的核心挑战。Gated DeltaNet-2 将擦除和写入解耦的思路值得记忆系统设计者关注。

2. **Agent 自进化突破文本层**：MOSS 提出了一个重要观点——仅修改 memory schemas、prompts 等文本工件不足以实现真正的自进化。这对所有依赖文本格式记忆（如 MemGPT 的 JSON memory blocks）的系统提出了挑战。

3. **记忆安全性浮出水面**：LCGuard 首次系统性地研究了多 Agent 环境中记忆（KV cache）共享的隐私泄漏问题。随着 Agent 协作场景增多，这将成为关键议题。

4. **对话记忆的隐含风险**：AMEL 揭示的对话历史偏置效应（d = -0.17）对所有使用长对话记忆的 Agent 都有实际影响。建议：**每个独立任务使用新的上下文窗口**。

---

## 💡 关键洞察与创新点

### 1. 记忆编辑的精细化

Gated DeltaNet-2 的核心创新——将 erase 和 write 解耦——为 Agent Memory 设计提供了一个重要洞察：**遗忘和写入应该独立控制**。在 MemGPT、LangChain Memory 等框架中，记忆的写入和遗忘通常是耦合的，这可能导致有用的信息被意外覆盖。

### 2. 记忆压缩的无损化

Meta-Soft 的注意力流集成机制展示了记忆压缩的新范式：不是简单丢弃不重要的信息，而是将被移除内容的语义重新分配到保留项中。这类似于人类记忆的"整合性遗忘"——我们不是简单忘记细节，而是将它们压缩为更高层次的模式。

### 3. 从检索到经验的跃迁

TTBYS 和 Search-E1 代表了一个趋势：从单纯的 RAG 检索走向结构化的经验复用。TTBYS 显式建模"先验经验"，Search-E1 通过自蒸馏从自身经验中学习。这对应了 Agent Memory 从"外部知识检索"到"内部经验积累"的演进。

---

## 🔗 与开源记忆项目的关联

以下是今日论文与之前分析的 19 个开源 Agent Memory 项目的关联映射：

| 论文 | 关联项目 | 关联说明 |
|------|----------|----------|
| **MOSS** | MemGPT, LangChain Memory | MOSS 指出 memory schemas 作为文本可变工件的局限，直接挑战 MemGPT 的 JSON memory block 设计 |
| **Gated DeltaNet-2** | MemGPT, Letta | 线性注意力的 erase/write 解耦思路可用于改进 MemGPT 的 memory 编辑策略 |
| **LCGuard** | AutoGen, CrewAI | 多 Agent 记忆共享的隐私保护，直接适用于 AutoGen 的多 Agent 通信 |
| **Meta-Soft** | LangChain Memory, LlamaIndex | KV Cache 压缩的语义保留机制可启发长期记忆的摘要压缩策略 |
| **Search-E1** | RAG-based Memory (LlamaIndex, Haystack) | 自蒸馏 + 搜索增强的范式为 RAG 记忆系统的自优化提供了新路径 |
| **TTBYS** | MemGPT (Episodic), Zep | 先验经验的结构化复用与 Zep 的 episodic memory 设计理念一致 |
| **AMEL** | 所有使用对话记忆的项目 | 对话历史偏置效应是通用风险，影响所有维护 session memory 的系统 |
| **AtelierJudge** | MemGPT, LangChain | Memory-augmented evaluator 展示了记忆增强在评估场景中的应用 |

### 特别值得关注的趋势

**MemGPT/Letta 生态最受影响**：今日 3 篇论文（MOSS、Gated DeltaNet-2、TTBYS）直接关联 MemGPT 的记忆架构设计。特别是 MOSS 对"文本可变 memory schemas"局限性的论证，值得 Letta 团队关注。

**RAG → Experience 的范式转变**：Search-E1 和 TTBYS 共同指向一个方向——单纯的检索增强不够，Agent 需要从经验中学习。这与 Zep 的 long-term episodic memory 方向高度一致。

---

## 📊 今日总结

今日 cs.AI 共 236 篇新论文中，8 篇与 Agent Memory 强相关。整体趋势显示：

1. **记忆机制正在从"附加组件"走向"核心架构"**：不再只是给 Agent 加一个向量数据库，而是在模型底层（KV cache、线性注意力）设计记忆机制
2. **安全性和偏置成为新关注点**：记忆共享的隐私、对话历史的偏置——这些是记忆系统走向生产的关键障碍
3. **自进化 + 记忆的交叉**：Agent 如何通过改写自身的记忆策略来进化，正在成为新的研究前沿

---

*本报告由来顺 🎋 自动生成，数据来源：[papers.cool/arxiv/cs.AI](https://papers.cool/arxiv/cs.AI) + arXiv.org*
