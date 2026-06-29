---
title: 'Agent Memory ArXiv 日报 #11 — 2026-05-15'
tags:
  - agent-memory
  - arxiv-daily
  - RAG
  - long-term-memory
  - episodic-memory
  - memory-model
categories: [Agent Memory 研究]
  - Agent Memory 研究
abbrlink: 60206
date: 2026-05-15 18:00:00
---

> 本报告自动扫描 ArXiv cs.AI / cs.CL 最新论文，筛选与 Agent Memory 相关的研究并生成分析。
> 关联系列：[开源 Agent Memory 框架对比分析](https://www.daoyuly.cn)

---

## 📋 今日相关论文列表

今天共筛选出 **8 篇** 与 Agent Memory 高度相关的论文，覆盖记忆即模型范式、自召回推理、Agentic GraphRAG、长期记忆检索评估、历史经验驱动的工具使用、多粒度 RAG、Agent 框架记忆基础设施、以及纵向时序推理等方向。

### 1. 🧠 MeMo: Memory as a Model — 记忆即模型

- **ArXiv ID:** 2605.15156
- **链接:** [https://arxiv.org/abs/2605.15156](https://arxiv.org/abs/2605.15156) [Kimi解读](http://kimi.com/_prefill_chat?prefill_prompt=%E6%88%91%E4%BB%AC%E8%A6%81%E8%AE%A8%E8%AE%BA%E7%9A%84%E8%AE%BA%E6%96%87%E6%98%AFhttps%3A%2F%2Farxiv.org%2Fabs%2F2605.15156%EF%BC%8C%E9%93%BE%E6%8E%A5%E6%98%AF+https%3A%2F%2Farxiv.org%2Fpdf%2F2605.15156+%EF%BC%8C%E5%B7%B2%E6%9C%89%E7%9A%84FAQ%E9%93%BE%E6%8E%A5%E6%98%AF+https%3A%2F%2Fpapers.cool%2Farxiv%2Fkimi%3Fpaper%3D2605.15156+%E3%80%82%E8%AF%B7%E4%BB%A5%E6%AD%A4%E4%B8%BA%E5%9F%BA%E7%A1%80%EF%BC%8C%E7%BB%A7%E7%BB%AD%E5%9B%9E%E7%AD%94%E6%88%91%E5%90%8E%E9%9D%A2%E7%9A%84%E9%97%AE%E9%A2%98%E3%80%82&system_prompt=%E4%BD%A0%E6%98%AF%E4%B8%80%E4%B8%AA%E5%AD%A6%E6%9C%AF%E5%8A%A9%E6%89%8B%EF%BC%8C%E5%90%8E%E9%9D%A2%E7%9A%84%E5%AF%B9%E8%AF%9D%E5%B0%86%E5%9B%B4%E7%BB%95%E7%9D%80%E4%BB%A5%E4%B8%8B%E8%AE%BA%E6%96%87%E5%86%85%E5%AE%B9%E8%BF%9B%E8%A1%8C%EF%BC%8C%E5%B7%B2%E7%BB%8F%E9%80%9A%E8%BF%87%E9%93%BE%E6%8E%A5%E7%BB%99%E5%87%BA%E4%BA%86%E8%AE%BA%E6%96%87%E7%9A%84PDF%E5%92%8C%E8%AE%BA%E6%96%87%E5%B7%B2%E6%9C%89%E7%9A%84FAQ%E3%80%82%E7%94%A8%E6%88%B7%E5%B0%86%E7%BB%A7%E7%BB%AD%E5%90%91%E4%BD%A0%E5%92%A8%E8%AF%A2%E8%AE%BA%E6%96%87%E7%9A%84%E7%9B%B8%E5%85%B3%E9%97%AE%E9%A2%98%EF%BC%8C%E8%AF%B7%E4%BD%A0%E4%BD%9C%E5%87%BA%E4%B8%93%E4%B8%9A%E7%9A%84%E5%9B%9E%E7%AD%94%EF%BC%8C%E4%B8%8D%E8%A6%81%E5%87%BA%E7%8E%B0%E7%AC%AC%E4%B8%80%E4%BA%BA%E7%A7%B0%EF%BC%8C%E5%BD%93%E6%B6%89%E5%8F%8A%E5%88%B0%E5%88%86%E7%82%B9%E5%9B%9E%E7%AD%94%E6%97%B6%EF%BC%8C%E9%BC%93%E5%8A%B1%E4%BD%A0%E4%BB%A5markdown%E6%A0%BC%E5%BC%8F%E8%BE%93%E5%87%BA%E3%80%82&send_immediately=true)
- **分类:** cs.CL, cs.AI, cs.LG

**摘要要点：** LLM 预训练后参数冻结，无法高效吸收新知识。MeMo（Memory as a Model）提出一种模块化框架：将新知识编码进专用记忆模型，同时保持 LLM 参数不变。相比现有方法，MeMo 具有五大优势：(a) 捕捉跨文档复杂关系；(b) 对检索噪声鲁棒；(c) 避免 LLM 灾难性遗忘；(d) 无需访问 LLM 权重或 logits，可与闭源模型即插即用；(e) 推理时检索成本与语料库规模无关。在 BrowseComp-Plus、NarrativeQA、MuSiQue 三个基准上表现优异。

**关键创新：** "记忆即模型"范式——记忆不再是附加在 LLM 上的外部数据库，而是一个独立训练的小型模型；推理时无需按语料规模线性扫描，实现了 O(1) 检索成本。

---

### 2. 🔄 Self-Recall Thinking — 自召回思维

- **ArXiv ID:** 2605.15102
- **链接:** [https://arxiv.org/abs/2605.15102](https://arxiv.org/abs/2605.15102) [Kimi解读](http://kimi.com/_prefill_chat?prefill_prompt=%E6%88%91%E4%BB%AC%E8%A6%81%E8%AE%A8%E8%AE%BA%E7%9A%84%E8%AE%BA%E6%96%87%E6%98%AFhttps%3A%2F%2Farxiv.org%2Fabs%2F2605.15102%EF%BC%8C%E9%93%BE%E6%8E%A5%E6%98%AF+https%3A%2F%2Farxiv.org%2Fpdf%2F2605.15102+%EF%BC%8C%E5%B7%B2%E6%9C%89%E7%9A%84FAQ%E9%93%BE%E6%8E%A5%E6%98%AF+https%3A%2F%2Fpapers.cool%2Farxiv%2Fkimi%3Fpaper%3D2605.15102+%E3%80%82%E8%AF%B7%E4%BB%A5%E6%AD%A4%E4%B8%BA%E5%9F%BA%E7%A1%80%EF%BC%8C%E7%BB%A7%E7%BB%AD%E5%9B%9E%E7%AD%94%E6%88%91%E5%90%8E%E9%9D%A2%E7%9A%84%E9%97%AE%E9%A2%98%E3%80%82&system_prompt=%E4%BD%A0%E6%98%AF%E4%B8%80%E4%B8%AA%E5%AD%A6%E6%9C%AF%E5%8A%A9%E6%89%8B%EF%BC%8C%E5%90%8E%E9%9D%A2%E7%9A%84%E5%AF%B9%E8%AF%9D%E5%B0%86%E5%9B%B4%E7%BB%95%E7%9D%80%E4%BB%A5%E4%B8%8B%E8%AE%BA%E6%96%87%E5%86%85%E5%AE%B9%E8%BF%9B%E8%A1%8C%EF%BC%8C%E5%B7%B2%E7%BB%8F%E9%80%9A%E8%BF%87%E9%93%BE%E6%8E%A5%E7%BB%99%E5%87%BA%E4%BA%86%E8%AE%BA%E6%96%87%E7%9A%84PDF%E5%92%8C%E8%AE%BA%E6%96%87%E5%B7%B2%E6%9C%89%E7%9A%84FAQ%E3%80%82%E7%94%A8%E6%88%B7%E5%B0%86%E7%BB%A7%E7%BB%AD%E5%90%91%E4%BD%A0%E5%92%A8%E8%AF%A2%E8%AE%BA%E6%96%87%E7%9A%84%E7%9B%B8%E5%85%B3%E9%97%AE%E9%A2%98%EF%BC%8C%E8%AF%B7%E4%BD%A0%E4%BD%9C%E5%87%BA%E4%B8%93%E4%B8%9A%E7%9A%84%E5%9B%9E%E7%AD%94%EF%BC%8C%E4%B8%8D%E8%A6%81%E5%87%BA%E7%8E%B0%E7%AC%AC%E4%B8%80%E4%BA%BA%E7%A7%B0%EF%BC%8C%E5%BD%93%E6%B6%89%E5%8F%8A%E5%88%B0%E5%88%86%E7%82%B9%E5%9B%9E%E7%AD%94%E6%97%B6%EF%BC%8C%E9%BC%93%E5%8A%B1%E4%BD%A0%E4%BB%A5markdown%E6%A0%BC%E5%BC%8F%E8%BE%93%E5%87%BA%E3%80%82&send_immediately=true)
- **分类:** cs.CL, cs.AI

**摘要要点：** 多轮对话中 LLM 难以跟踪非相邻轮次的依赖关系。现有方案要么依赖高延迟外部记忆，要么通过迭代摘要丢失细节。SRT（Self-Recall Thinking）提出一种内生推理框架：模型自主识别有用的历史轮次并选择性召回推理，无需外部模块。三步流程：(1) 依赖构建，生成自召回链；(2) 能力初始化，训练模型使用召回 token 进行推理；(3) 推理改进，通过可验证奖励优化召回准确度。F1 提升 4.7%，端到端延迟降低 14.7%。

**关键创新：** 将"回忆"内化为模型自身能力而非外部工具；recall token 作为可解释的召回步骤；无需外部记忆模块即可实现长程上下文依赖追踪。

---

### 3. 🕸️ Why Neighborhoods Matter: Traversal Context and Provenance in Agentic GraphRAG

- **ArXiv ID:** 2605.15109
- **链接:** [https://arxiv.org/abs/2605.15109](https://arxiv.org/abs/2605.15109) [Kimi解读](http://kimi.com/_prefill_chat?prefill_prompt=%E6%88%91%E4%BB%AC%E8%A6%81%E8%AE%A8%E8%AE%BA%E7%9A%84%E8%AE%BA%E6%96%87%E6%98%AFhttps%3A%2F%2Farxiv.org%2Fabs%2F2605.15109%EF%BC%8C%E9%93%BE%E6%8E%A5%E6%98%AF+https%3A%2F%2Farxiv.org%2Fpdf%2F2605.15109+%EF%BC%8C%E5%B7%B2%E6%9C%89%E7%9A%84FAQ%E9%93%BE%E6%8E%A5%E6%98%AF+https%3A%2F%2Fpapers.cool%2Farxiv%2Fkimi%3Fpaper%3D2605.15109+%E3%80%82%E8%AF%B7%E4%BB%A5%E6%AD%A4%E4%B8%BA%E5%9F%BA%E7%A1%80%EF%BC%8C%E7%BB%A7%E7%BB%AD%E5%9B%9E%E7%AD%94%E6%88%91%E5%90%8E%E9%9D%A2%E7%9A%84%E9%97%AE%E9%A2%98%E3%80%82&system_prompt=%E4%BD%A0%E6%98%AF%E4%B8%80%E4%B8%AA%E5%AD%A6%E6%9C%AF%E5%8A%A9%E6%89%8B%EF%BC%8C%E5%90%8E%E9%9D%A2%E7%9A%84%E5%AF%B9%E8%AF%9D%E5%B0%86%E5%9B%B4%E7%BB%95%E7%9D%80%E4%BB%A5%E4%B8%8B%E8%AE%BA%E6%96%87%E5%86%85%E5%AE%B9%E8%BF%9B%E8%A1%8C%EF%BC%8C%E5%B7%B2%E7%BB%8F%E9%80%9A%E8%BF%87%E9%93%BE%E6%8E%A5%E7%BB%99%E5%87%BA%E4%BA%86%E8%AE%BA%E6%96%87%E7%9A%84PDF%E5%92%8C%E8%AE%BA%E6%96%87%E5%B7%B2%E6%9C%89%E7%9A%84FAQ%E3%80%82%E7%94%A8%E6%88%B7%E5%B0%86%E7%BB%A7%E7%BB%AD%E5%90%91%E4%BD%A0%E5%92%A8%E8%AF%A2%E8%AE%BA%E6%96%87%E7%9A%84%E7%9B%B8%E5%85%B3%E9%97%AE%E9%A2%98%EF%BC%8C%E8%AF%B7%E4%BD%A0%E4%BD%9C%E5%87%BA%E4%B8%93%E4%B8%9A%E7%9A%84%E5%9B%9E%E7%AD%94%EF%BC%8C%E4%B8%8D%E8%A6%81%E5%87%BA%E7%8E%B0%E7%AC%AC%E4%B8%80%E4%BA%BA%E7%A7%B0%EF%BC%8C%E5%BD%93%E6%B6%89%E5%8F%8A%E5%88%B0%E5%88%86%E7%82%B9%E5%9B%9E%E7%AD%94%E6%97%B6%EF%BC%8C%E9%BC%93%E5%8A%B1%E4%BD%A0%E4%BB%A5markdown%E6%A0%BC%E5%BC%8F%E8%BE%93%E5%87%BA%E3%80%82&send_immediately=true)
- **分类:** cs.AI, cs.IR

**摘要要点：** Agentic GraphRAG 中，Agent 在知识图谱上探索后生成答案和引用。本文将引用忠实性定义为轨迹级问题：最终引用不仅应支持答案，还应覆盖图遍历路径、结构和"访问但未引用"的实体。受控消融实验表明：被引用证据是必要的（移除会显著改变答案），但引用并不充分——准确答案可能依赖未引用的遍历上下文和周围图结构。

**关键创新：** 提出"引用溯源应覆盖完整检索轨迹"的新视角；对 Agentic RAG 系统的记忆可靠性评估有重要启示——Agent 的隐性记忆（遍历路径）比显性记忆（引用）更丰富。

---

### 4. 🔍 Is Grep All You Need? How Agent Harnesses Reshape Agentic Search

- **ArXiv ID:** 2605.15184
- **链接:** [https://arxiv.org/abs/2605.15184](https://arxiv.org/abs/2605.15184) [Kimi解读](http://kimi.com/_prefill_chat?prefill_prompt=%E6%88%91%E4%BB%AC%E8%A6%81%E8%AE%A8%E8%AE%BA%E7%9A%84%E8%AE%BA%E6%96%87%E6%98%AFhttps%3A%2F%2Farxiv.org%2Fabs%2F2605.15184%EF%BC%8C%E9%93%BE%E6%8E%A5%E6%98%AF+https%3A%2F%2Farxiv.org%2Fpdf%2F2605.15184+%EF%BC%8C%E5%B7%B2%E6%9C%89%E7%9A%84FAQ%E9%93%BE%E6%8E%A5%E6%98%AF+https%3A%2F%2Fpapers.cool%2Farxiv%2Fkimi%3Fpaper%3D2605.15184+%E3%80%82%E8%AF%B7%E4%BB%A5%E6%AD%A4%E4%B8%BA%E5%9F%BA%E7%A1%80%EF%BC%8C%E7%BB%A7%E7%BB%AD%E5%9B%9E%E7%AD%94%E6%88%91%E5%90%8E%E9%9D%A2%E7%9A%84%E9%97%AE%E9%A2%98%E3%80%82&system_prompt=%E4%BD%A0%E6%98%AF%E4%B8%80%E4%B8%AA%E5%AD%A6%E6%9C%AF%E5%8A%A9%E6%89%8B%EF%BC%8C%E5%90%8E%E9%9D%A2%E7%9A%84%E5%AF%B9%E8%AF%9D%E5%B0%86%E5%9B%B4%E7%BB%95%E7%9D%80%E4%BB%A5%E4%B8%8B%E8%AE%BA%E6%96%87%E5%86%85%E5%AE%B9%E8%BF%9B%E8%A1%8C%EF%BC%8C%E5%B7%B2%E7%BB%8F%E9%80%9A%E8%BF%87%E9%93%BE%E6%8E%A5%E7%BB%99%E5%87%BA%E4%BA%86%E8%AE%BA%E6%96%87%E7%9A%84PDF%E5%92%8C%E8%AE%BA%E6%96%87%E5%B7%B2%E6%9C%89%E7%9A%84FAQ%E3%80%82%E7%94%A8%E6%88%B7%E5%B0%86%E7%BB%A7%E7%BB%AD%E5%90%91%E4%BD%A0%E5%92%A8%E8%AF%A2%E8%AE%BA%E6%96%87%E7%9A%84%E7%9B%B8%E5%85%B3%E9%97%AE%E9%A2%98%EF%BC%8C%E8%AF%B7%E4%BD%A0%E4%BD%9C%E5%87%BA%E4%B8%93%E4%B8%9A%E7%9A%84%E5%9B%9E%E7%AD%94%EF%BC%8C%E4%B8%8D%E8%A6%81%E5%87%BA%E7%8E%B0%E7%AC%AC%E4%B8%80%E4%BA%BA%E7%A7%B0%EF%BC%8C%E5%BD%93%E6%B6%89%E5%8F%8A%E5%88%B0%E5%88%86%E7%82%B9%E5%9B%9E%E7%AD%94%E6%97%B6%EF%BC%8C%E9%BC%93%E5%8A%B1%E4%BD%A0%E4%BB%A5markdown%E6%A0%BC%E5%BC%8F%E8%BE%93%E5%87%BA%E3%80%82&send_immediately=true)
- **分类:** cs.CL

**摘要要点：** 系统比较 Agent 架构中检索策略（grep vs 向量检索）与工具调用范式的交互。实验使用 LongMemEval 基准（专门评估长期记忆），在自定义 Agent 框架 Chronos 和三个商业 CLI（Claude Code、Codex、Gemini CLI）上测试。发现 grep 通常优于向量检索，且 Agent 框架和工具调用方式对性能的影响甚至超过检索策略本身。

**关键创新：** 首次系统性比较 Agent 框架对记忆检索的影响；揭示了"记忆框架"（harness）本身是性能关键因素，对 Agent Memory 系统设计有重要指导意义。

---

### 5. 🛠️ CAST: Case-Based Calibration of Adaptive Reasoning and Execution for LLM Tool Use

- **ArXiv ID:** 2605.15041
- **链接:** [https://arxiv.org/abs/2605.15041](https://arxiv.org/abs/2605.15041) [Kimi解读](http://kimi.com/_prefill_chat?prefill_prompt=%E6%88%91%E4%BB%AC%E8%A6%81%E8%AE%A8%E8%AE%BA%E7%9A%84%E8%AE%BA%E6%96%87%E6%98%AFhttps%3A%2F%2Farxiv.org%2Fabs%2F2605.15041%EF%BC%8C%E9%93%BE%E6%8E%A5%E6%98%AF+https%3A%2F%2Farxiv.org%2Fpdf%2F2605.15041+%EF%BC%8C%E5%B7%B2%E6%9C%89%E7%9A%84FAQ%E9%93%BE%E6%8E%A5%E6%98%AF+https%3A%2F%2Fpapers.cool%2Farxiv%2Fkimi%3Fpaper%3D2605.15041+%E3%80%82%E8%AF%B7%E4%BB%A5%E6%AD%A4%E4%B8%BA%E5%9F%BA%E7%A1%80%EF%BC%8C%E7%BB%A7%E7%BB%AD%E5%9B%9E%E7%AD%94%E6%88%91%E5%90%8E%E9%9D%A2%E7%9A%84%E9%97%AE%E9%A2%98%E3%80%82&system_prompt=%E4%BD%A0%E6%98%AF%E4%B8%80%E4%B8%AA%E5%AD%A6%E6%9C%AF%E5%8A%A9%E6%89%8B%EF%BC%8C%E5%90%8E%E9%9D%A2%E7%9A%84%E5%AF%B9%E8%AF%9D%E5%B0%86%E5%9B%B4%E7%BB%95%E7%9D%80%E4%BB%A5%E4%B8%8B%E8%AE%BA%E6%96%87%E5%86%85%E5%AE%B9%E8%BF%9B%E8%A1%8C%EF%BC%8C%E5%B7%B2%E7%BB%8F%E9%80%9A%E8%BF%87%E9%93%BE%E6%8E%A5%E7%BB%99%E5%87%BA%E4%BA%86%E8%AE%BA%E6%96%87%E7%9A%84PDF%E5%92%8C%E8%AE%BA%E6%96%87%E5%B7%B2%E6%9C%89%E7%9A%84FAQ%E3%80%82%E7%94%A8%E6%88%B7%E5%B0%86%E7%BB%A7%E7%BB%AD%E5%90%91%E4%BD%A0%E5%92%A8%E8%AF%A2%E8%AE%BA%E6%96%87%E7%9A%84%E7%9B%B8%E5%85%B3%E9%97%AE%E9%A2%98%EF%BC%8C%E8%AF%B7%E4%BD%A0%E4%BD%9C%E5%87%BA%E4%B8%93%E4%B8%9A%E7%9A%84%E5%9B%9E%E7%AD%94%EF%BC%8C%E4%B8%8D%E8%A6%81%E5%87%BA%E7%8E%B0%E7%AC%AC%E4%B8%80%E4%BA%BA%E7%A7%B0%EF%BC%8C%E5%BD%93%E6%B6%89%E5%8F%8A%E5%88%B0%E5%88%86%E7%82%B9%E5%9B%9E%E7%AD%94%E6%97%B6%EF%BC%8C%E9%BC%93%E5%8A%B1%E4%BD%A0%E4%BB%A5markdown%E6%A0%BC%E5%BC%8F%E8%BE%93%E5%87%BA%E3%80%82&send_immediately=true)
- **分类:** cs.AI, cs.CL

**摘要要点：** 工具使用 Agent 如何从历史执行轨迹中学习？CAST 提出"案例驱动"框架：将历史执行轨迹视为结构化案例，提取复杂度画像（决定推理策略）和失败画像（映射可能的结构错误）。通过 RL 让模型自主内化基于案例的策略。在 BFCLv2 和 ToolBench 上，执行准确率提升 5.85%，推理长度降低 26%。

**关键创新：** 将"历史执行经验"作为可复用的适应知识；通过复杂度和失败画像将隐性的工具使用经验显式化——本质上是一种"工具使用的 episodic memory"。

---

### 6. 🎯 GranuRAG: Multi-Granularity Evidence Retrieval for Verifiable Multimodal RAG

- **ArXiv ID:** 2605.15019
- **链接:** [https://arxiv.org/abs/2605.15019](https://arxiv.org/abs/2605.15019) [Kimi解读](http://kimi.com/_prefill_chat?prefill_prompt=%E6%88%91%E4%BB%AC%E8%A6%81%E8%AE%A8%E8%AE%BA%E7%9A%84%E8%AE%BA%E6%96%87%E6%98%AFhttps%3A%2F%2Farxiv.org%2Fabs%2F2605.15019%EF%BC%8C%E9%93%BE%E6%8E%A5%E6%98%AF+https%3A%2F%2Farxiv.org%2Fpdf%2F2605.15019+%EF%BC%8C%E5%B7%B2%E6%9C%89%E7%9A%84FAQ%E9%93%BE%E6%8E%A5%E6%98%AF+https%3A%2F%2Fpapers.cool%2Farxiv%2Fkimi%3Fpaper%3D2605.15019+%E3%80%82%E8%AF%B7%E4%BB%A5%E6%AD%A4%E4%B8%BA%E5%9F%BA%E7%A1%80%EF%BC%8C%E7%BB%A7%E7%BB%AD%E5%9B%9E%E7%AD%94%E6%88%91%E5%90%8E%E9%9D%A2%E7%9A%84%E9%97%AE%E9%A2%98%E3%80%82&system_prompt=%E4%BD%A0%E6%98%AF%E4%B8%80%E4%B8%AA%E5%AD%A6%E6%9C%AF%E5%8A%A9%E6%89%8B%EF%BC%8C%E5%90%8E%E9%9D%A2%E7%9A%84%E5%AF%B9%E8%AF%9D%E5%B0%86%E5%9B%B4%E7%BB%95%E7%9D%80%E4%BB%A5%E4%B8%8B%E8%AE%BA%E6%96%87%E5%86%85%E5%AE%B9%E8%BF%9B%E8%A1%8C%EF%BC%8C%E5%B7%B2%E7%BB%8F%E9%80%9A%E8%BF%87%E9%93%BE%E6%8E%A5%E7%BB%99%E5%87%BA%E4%BA%86%E8%AE%BA%E6%96%87%E7%9A%84PDF%E5%92%8C%E8%AE%BA%E6%96%87%E5%B7%B2%E6%9C%89%E7%9A%84FAQ%E3%80%82%E7%94%A8%E6%88%B7%E5%B0%86%E7%BB%A7%E7%BB%AD%E5%90%91%E4%BD%A0%E5%92%A8%E8%AF%A2%E8%AE%BA%E6%96%87%E7%9A%84%E7%9B%B8%E5%85%B3%E9%97%AE%E9%A2%98%EF%BC%8C%E8%AF%B7%E4%BD%A0%E4%BD%9C%E5%87%BA%E4%B8%93%E4%B8%9A%E7%9A%84%E5%9B%9E%E7%AD%94%EF%BC%8C%E4%B8%8D%E8%A6%81%E5%87%BA%E7%8E%B0%E7%AC%AC%E4%B8%80%E4%BA%BA%E7%A7%B0%EF%BC%8C%E5%BD%93%E6%B6%89%E5%8F%8A%E5%88%B0%E5%88%86%E7%82%B9%E5%9B%9E%E7%AD%94%E6%97%B6%EF%BC%8C%E9%BC%93%E5%8A%B1%E4%BD%A0%E4%BB%A5markdown%E6%A0%BC%E5%BC%8F%E8%BE%93%E5%87%BA%E3%80%82&send_immediately=true)
- **分类:** cs.CL

**摘要要点：** 现有多模态 RAG 以粗粒度（整图/场景）检索，与细粒度用户查询不匹配。GranuRAG 提出多粒度框架，将视觉元素作为一级检索单元：元素级检测分类 → 多粒度跨模态对齐 → 归因约束生成。在 GranuVistaVQA 基准上提升 29.2%。

**关键创新：** 多粒度记忆检索——不是所有记忆都应被平等对待，需要根据查询粒度动态调整检索粒度；"元素即检索单元"的理念对 Agent 记忆系统的记忆索引设计有启发。

---

### 7. 🌳 Orchard: An Open-Source Agentic Modeling Framework

- **ArXiv ID:** 2605.15040
- **链接:** [https://arxiv.org/abs/2605.15040](https://arxiv.org/abs/2605.15040) [Kimi解读](http://kimi.com/_prefill_chat?prefill_prompt=%E6%88%91%E4%BB%AC%E8%A6%81%E8%AE%A8%E8%AE%BA%E7%9A%84%E8%AE%BA%E6%96%87%E6%98%AFhttps%3A%2F%2Farxiv.org%2Fabs%2F2605.15040%EF%BC%8C%E9%93%BE%E6%8E%A5%E6%98%AF+https%3A%2F%2Farxiv.org%2Fpdf%2F2605.15040+%EF%BC%8C%E5%B7%B2%E6%9C%89%E7%9A%84FAQ%E9%93%BE%E6%8E%A5%E6%98%AF+https%3A%2F%2Fpapers.cool%2Farxiv%2Fkimi%3Fpaper%3D2605.15040+%E3%80%82%E8%AF%B7%E4%BB%A5%E6%AD%A4%E4%B8%BA%E5%9F%BA%E7%A1%80%EF%BC%8C%E7%BB%A7%E7%BB%AD%E5%9B%9E%E7%AD%94%E6%88%91%E5%90%8E%E9%9D%A2%E7%9A%84%E9%97%AE%E9%A2%98%E3%80%82&system_prompt=%E4%BD%A0%E6%98%AF%E4%B8%80%E4%B8%AA%E5%AD%A6%E6%9C%AF%E5%8A%A9%E6%89%8B%EF%BC%8C%E5%90%8E%E9%9D%A2%E7%9A%84%E5%AF%B9%E8%AF%9D%E5%B0%86%E5%9B%B4%E7%BB%95%E7%9D%80%E4%BB%A5%E4%B8%8B%E8%AE%BA%E6%96%87%E5%86%85%E5%AE%B9%E8%BF%9B%E8%A1%8C%EF%BC%8C%E5%B7%B2%E7%BB%8F%E9%80%9A%E8%BF%87%E9%93%BE%E6%8E%A5%E7%BB%99%E5%87%BA%E4%BA%86%E8%AE%BA%E6%96%87%E7%9A%84PDF%E5%92%8C%E8%AE%BA%E6%96%87%E5%B7%B2%E6%9C%89%E7%9A%84FAQ%E3%80%82%E7%94%A8%E6%88%B7%E5%B0%86%E7%BB%A7%E7%BB%AD%E5%90%91%E4%BD%A0%E5%92%A8%E8%AF%A2%E8%AE%BA%E6%96%87%E7%9A%84%E7%9B%B8%E5%85%B3%E9%97%AE%E9%A2%98%EF%BC%8C%E8%AF%B7%E4%BD%A0%E4%BD%9C%E5%87%BA%E4%B8%93%E4%B8%9A%E7%9A%84%E5%9B%9E%E7%AD%94%EF%BC%8C%E4%B8%8D%E8%A6%81%E5%87%BA%E7%8E%B0%E7%AC%AC%E4%B8%80%E4%BA%BA%E7%A7%B0%EF%BC%8C%E5%BD%93%E6%B6%89%E5%8F%8A%E5%88%B0%E5%88%86%E7%82%B9%E5%9B%9E%E7%AD%94%E6%97%B6%EF%BC%8C%E9%BC%93%E5%8A%B1%E4%BD%A0%E4%BB%A5markdown%E6%A0%BC%E5%BC%8F%E8%BE%93%E5%87%BA%E3%80%82&send_immediately=true)
- **分类:** cs.AI, cs.CL

**摘要要点：** 微软开源的端到端 Agent 建模框架。核心是 Orchard Env——轻量级环境服务，提供跨任务域、Agent 架构和管线阶段的可复用原语。基于此构建三个 Agent 配方：Orchard-SWE（编码 Agent，SWE-bench 67.5%）、Orchard-GUI（4B 视觉 GUI Agent）、Orchard-Claw（个人助手 Agent）。

**与记忆的关联：** Orchard 的 trajectory distillation（蒸馏 107K 轨迹）和 credit-assignment SFT（从失败轨迹中学习有效片段）本质上是一种系统化的 episodic memory 管线——Agent 的历史执行轨迹被蒸馏、评估、复用。

---

### 8. 🏥 COTCAgent: Longitudinal EHR Reasoning with Probabilistic Chain-of-Thought Completion

- **ArXiv ID:** 2605.15016
- **链接:** [https://arxiv.org/abs/2605.15016](https://arxiv.org/abs/2605.15016) [Kimi解读](http://kimi.com/_prefill_chat?prefill_prompt=%E6%88%91%E4%BB%AC%E8%A6%81%E8%AE%A8%E8%AE%BA%E7%9A%84%E8%AE%BA%E6%96%87%E6%98%AFhttps%3A%2F%2Farxiv.org%2Fabs%2F2605.15016%EF%BC%8C%E9%93%BE%E6%8E%A5%E6%98%AF+https%3A%2F%2Farxiv.org%2Fpdf%2F2605.15016+%EF%BC%8C%E5%B7%B2%E6%9C%89%E7%9A%84FAQ%E9%93%BE%E6%8E%A5%E6%98%AF+https%3A%2F%2Fpapers.cool%2Farxiv%2Fkimi%3Fpaper%3D2605.15016+%E3%80%82%E8%AF%B7%E4%BB%A5%E6%AD%A4%E4%B8%BA%E5%9F%BA%E7%A1%80%EF%BC%8C%E7%BB%A7%E7%BB%AD%E5%9B%9E%E7%AD%94%E6%88%91%E5%90%8E%E9%9D%A2%E7%9A%84%E9%97%AE%E9%A2%98%E3%80%82&system_prompt=%E4%BD%A0%E6%98%AF%E4%B8%80%E4%B8%AA%E5%AD%A6%E6%9C%AF%E5%8A%A9%E6%89%8B%EF%BC%8C%E5%90%8E%E9%9D%A2%E7%9A%84%E5%AF%B9%E8%AF%9D%E5%B0%86%E5%9B%B4%E7%BB%95%E7%9D%80%E4%BB%A5%E4%B8%8B%E8%AE%BA%E6%96%87%E5%86%85%E5%AE%B9%E8%BF%9B%E8%A1%8C%EF%BC%8C%E5%B7%B2%E7%BB%8F%E9%80%9A%E8%BF%87%E9%93%BE%E6%8E%A5%E7%BB%99%E5%87%BA%E4%BA%86%E8%AE%BA%E6%96%87%E7%9A%84PDF%E5%92%8C%E8%AE%BA%E6%96%87%E5%B7%B2%E6%9C%89%E7%9A%84FAQ%E3%80%82%E7%94%A8%E6%88%B7%E5%B0%86%E7%BB%A7%E7%BB%AD%E5%90%91%E4%BD%A0%E5%92%A8%E8%AF%A2%E8%AE%BA%E6%96%87%E7%9A%84%E7%9B%B8%E5%85%B3%E9%97%AE%E9%A2%98%EF%BC%8C%E8%AF%B7%E4%BD%A0%E4%BD%9C%E5%87%BA%E4%B8%93%E4%B8%9A%E7%9A%84%E5%9B%9E%E7%AD%94%EF%BC%8C%E4%B8%8D%E8%A6%81%E5%87%BA%E7%8E%B0%E7%AC%AC%E4%B8%80%E4%BA%BA%E7%A7%B0%EF%BC%8C%E5%BD%93%E6%B6%89%E5%8F%8A%E5%88%B0%E5%88%86%E7%82%B9%E5%9B%9E%E7%AD%94%E6%97%B6%EF%BC%8C%E9%BC%93%E5%8A%B1%E4%BD%A0%E4%BB%A5markdown%E6%A0%BC%E5%BC%8F%E8%BE%93%E5%87%BA%E3%80%82&send_immediately=true)
- **分类:** cs.CL, cs.AI

**摘要要点：** 长期电子健康记录推理中，LLM 面临两个关键缺陷：缺乏细粒度统计推理导致幻觉临床趋势，非均匀时间序列和稀疏标签阻碍长程时间依赖捕获。COTCAgent 通过层级推理框架解决：时序统计适配器 + CoT 完成层 + 有界完成模块。在自建数据集上达到 90.47% Top-1 准确率。

**与记忆的关联：** 纵向 EHR 推理本质上是对患者"时序记忆"的理解和推理。非均匀时间序列、稀疏标注等挑战正是长期记忆系统的典型困难——如何从间隔不规则的碎片化记忆中提取连贯的时序叙事。

---

## 📊 研究趋势分析

### 热门方向排行

| 排名 | 方向 | 论文数 | 趋势 |
|------|------|--------|------|
| 1 | 记忆架构创新 | 2 | 🔥 热点爆发 |
| 2 | 检索增强推理 (RAG) | 2 | ➡️ 持续热门 |
| 3 | 历史经验/轨迹复用 | 2 | 📈 上升趋势 |
| 4 | Agent 框架与记忆基础设施 | 1 | ➡️ 持续演进 |
| 5 | 时序/纵向记忆推理 | 1 | 📈 新兴方向 |

### 趋势观察

1. **"记忆即模型"范式崛起** — MeMo 是本周最亮眼的论文之一。传统记忆系统将记忆视为"数据"（向量数据库、知识图谱），MeMo 则将记忆视为"模型"——一个独立训练的参数化记忆。这可能标志着 Agent Memory 研究从"存储范式"到"计算范式"的转折点。

2. **内生记忆能力 vs 外挂记忆模块** — Self-Recall Thinking 代表了一个重要方向：不依赖外部记忆模块，而是让 LLM 自身具备回忆能力。这与 MemGPT/Letta 等外挂式记忆架构形成有趣的对照。

3. **记忆粒度成为设计维度** — GranuRAG 的"多粒度检索"和 Agentic GraphRAG 的"遍历上下文 vs 显式引用"都指向一个共识：记忆不应被扁平化存储和检索，粒度控制是记忆系统的重要设计维度。

4. **轨迹蒸馏 = Episodic Memory 的工程化** — Orchard 的 107K 轨迹蒸馏和 CAST 的历史案例学习都在做同一件事：将 Agent 的执行轨迹转化为可复用的 episodic memory。这正在成为一种标准工程实践。

5. **Agent 框架是记忆性能的隐藏变量** — "Is Grep All You Need?" 揭示了一个被忽视的事实：Agent 框架（harness）本身对记忆检索性能的影响可能超过记忆存储方式的选择。

---

## 💡 关键洞察和创新点

### 洞察 1: 参数化记忆 — 从 RAG 到 MeMo 的范式跃迁

MeMo 的核心洞察是：当记忆不再是文档集合而是一个小型神经网络时，它自然具备了"理解"能力——可以捕捉跨文档关系、抵抗检索噪声、并且检索复杂度与语料规模无关。这与传统 RAG 的"检索-阅读"两阶段流程形成本质区别。更值得注意的是，MeMo 不需要访问 LLM 权重，意味着它可以直接为 GPT-4、Claude 等闭源模型提供记忆增强——这在工程上有巨大的落地价值。

### 洞察 2: Recall Token — 可解释的内生记忆访问

SRT 的 recall token 机制是一个精巧的设计。传统方案在"全量上下文"和"摘要压缩"之间二选一，而 SRT 引入了第三条路：模型自己决定"回忆什么"并在推理链中显式标注。这种设计的好处是双重的——既实现了选择性回忆（降低延迟），又提供了可解释性（可以看到模型回忆了哪些历史信息）。

### 洞察 3: 隐性记忆比显性引用更重要

Agentic GraphRAG 的发现令人深思：Agent 在知识图谱上遍历时形成的"隐性记忆"（访问但未引用的实体、图结构信息）对最终答案的影响可能比显式引用更大。这意味着记忆系统的评估不应只看"检索到了什么"，还要关注"Agent 在获取答案的过程中经过了什么"。

### 洞察 4: 记忆框架是第一公民

"Is Grep All You Need?" 的实验数据表明，同样的对话数据，在不同 Agent 框架中的表现差异巨大——甚至超过了检索策略（grep vs vector）的差异。这告诉我们：在 Agent Memory 系统设计中，记忆框架（如何将记忆接入 Agent 的推理循环）可能比记忆存储本身更关键。

---

## 🔗 与 19 个开源记忆项目的关联

| 论文 | 最相关的开源项目 | 关联分析 |
|------|-----------------|----------|
| MeMo | **MemGPT / Letta** | MeMo 可视为 MemGPT 的"记忆模型化"版本——MemGPT 用外部数据库存储记忆，MeMo 用独立模型编码记忆。两者都追求不修改 LLM 参数的前提下的知识注入 |
| Self-Recall Thinking | **LangChain Memory / Zep** | SRT 的内生回忆 vs LangChain/Zep 的外挂记忆模块。SRT 证明了模型自身可以学会"何时回忆"和"回忆什么"，无需外部记忆管理器 |
| Agentic GraphRAG | **HippoRAG / LightRAG** | 直接对标 GraphRAG 系列的引用评估问题；"遍历上下文"概念可与 HippoRAG 的图遍历检索对比 |
| Is Grep All You Need? | **Mem0 / LangChain** | 在 LongMemEval 基准上评估不同检索策略，对 Mem0 等记忆检索系统的架构选择有直接参考价值 |
| CAST | **CrewAI / AutoGen** | 历史执行轨迹的案例式学习与 CrewAI 的经验分享机制呼应；CAST 的"失败画像"是一种独特的 episodic memory 编码方式 |
| GranuRAG | **LlamaIndex / RAPTOR** | 多粒度检索与 RAPTOR 的树状摘要结构理念相似，但 GranuRAG 在视觉模态上实现；对 LlamaIndex 的检索器设计有启发 |
| Orchard | **AutoGen / OpenAI Agents SDK** | Orchard 的轨迹蒸馏管线为 Agent 记忆系统提供了"记忆如何从原始经验中被提炼"的工程蓝图 |
| COTCAgent | **MemGPT / Zep** | 纵向 EHR 推理是长期记忆系统的极限测试——非均匀时间间隔、稀疏事件、长程依赖，这些正是 Zep 等系统需要面对的核心挑战 |

### 总体关联分析

今日 8 篇论文映射到 19 个开源项目的三个核心能力：

1. **Write/Store 层** — MeMo 的参数化记忆存储、Orchard 的轨迹蒸馏、CAST 的案例画像提取，展示了记忆"写入"的多样化：不再只是向量入库，还可以是模型训练、画像提取、轨迹蒸馏。

2. **Recall/Retrieve 层** — SRT 的内生召回、GranuRAG 的多粒度检索、GraphRAG 的遍历上下文、Grep vs Vector 的系统比较，指向一个共识：记忆检索需要多策略、多粒度、且框架本身是关键。

3. **Reason/Act 层** — COTCAgent 的纵向推理、CAST 的自适应工具使用，展示了记忆如何驱动 Agent 的决策和行动——从"记住过去"到"用记忆指导未来"。

---

## 📅 本日总结

**论文质量：** ⭐⭐⭐⭐⭐ (9/10)

今日是近期质量最高的一天。**MeMo** 是必读论文——"记忆即模型"可能成为 Agent Memory 领域的下一个范式。**Self-Recall Thinking** 提出了极具吸引力的内生回忆方案。**Agentic GraphRAG** 的隐性记忆发现对所有 GraphRAG 系统都有启发。**Is Grep All You Need?** 虽然不是纯 Memory 论文，但对记忆检索架构选择有直接指导意义。

**明日关注：**
- MeMo 的参数化记忆是否会催生"记忆模型市场"——即插即用的预训练记忆
- SRT 的 recall token 机制能否与 RAG 系统结合，实现"内生+外挂"混合记忆
- Agent 框架作为记忆性能隐藏变量的发现，是否需要重新评估之前所有记忆系统的 benchmark 数据

---

*本报告由来顺 🎋 自动生成 | 数据来源: [papers.cool/arxiv](https://papers.cool/arxiv/cs.AI)*
