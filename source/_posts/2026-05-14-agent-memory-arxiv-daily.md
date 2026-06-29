---
title: 'Agent Memory ArXiv 日报 #10 — 2026-05-14'
tags:
  - agent-memory
  - arxiv-daily
  - RAG
  - long-term-memory
  - episodic-memory
categories: [Agent Memory 研究]
  - Agent Memory 研究
abbrlink: 60205
date: 2026-05-14 18:00:00
---

> 本报告自动扫描 ArXiv cs.AI / cs.CL 最新论文，筛选与 Agent Memory 相关的研究并生成分析。
> 关联系列：[开源 Agent Memory 框架对比分析](https://www.daoyuly.cn)

---

## 📋 今日相关论文列表

今天共筛选出 **8 篇** 与 Agent Memory 高度相关的论文，覆盖主动记忆架构、记忆搜索反思、知识图谱增强记忆、具身信念记忆、结构化记忆 Agent、检索增强推理、多 Agent 记忆系统、以及历史行为锚定安全等方向。

### 1. 🧠 CogniFold: Always-On Proactive Memory via Cognitive Folding

- **ArXiv ID:** 2605.13438
- **链接:** [https://arxiv.org/abs/2605.13438](https://arxiv.org/abs/2605.13438) [Kimi解读](http://kimi.com/_prefill_chat?prefill_prompt=%E6%88%91%E4%BB%AC%E8%A6%81%E8%AE%A8%E8%AE%BA%E7%9A%84%E8%AE%BA%E6%96%87%E6%98%AFhttps%3A%2F%2Farxiv.org%2Fabs%2F2605.13438%EF%BC%8C%E9%93%BE%E6%8E%A5%E6%98%AF+https%3A%2F%2Farxiv.org%2Fpdf%2F2605.13438+%EF%BC%8C%E5%B7%B2%E6%9C%89%E7%9A%84FAQ%E9%93%BE%E6%8E%A5%E6%98%AF+https%3A%2F%2Fpapers.cool%2Farxiv%2Fkimi%3Fpaper%3D2605.13438+%E3%80%82%E8%AF%B7%E4%BB%A5%E6%AD%A4%E4%B8%BA%E5%9F%BA%E7%A1%80%EF%BC%8C%E7%BB%A7%E7%BB%AD%E5%9B%9E%E7%AD%94%E6%88%91%E5%90%8E%E9%9D%A2%E7%9A%84%E9%97%AE%E9%A2%98%E3%80%82&system_prompt=%E4%BD%A0%E6%98%AF%E4%B8%80%E4%B8%AA%E5%AD%A6%E6%9C%AF%E5%8A%A9%E6%89%8B%EF%BC%8C%E5%90%8E%E9%9D%A2%E7%9A%84%E5%AF%B9%E8%AF%9D%E5%B0%86%E5%9B%B4%E7%BB%95%E7%9D%80%E4%BB%A5%E4%B8%8B%E8%AE%BA%E6%96%87%E5%86%85%E5%AE%B9%E8%BF%9B%E8%A1%8C%EF%BC%8C%E5%B7%B2%E7%BB%8F%E9%80%9A%E8%BF%87%E9%93%BE%E6%8E%A5%E7%BB%99%E5%87%BA%E4%BA%86%E8%AE%BA%E6%96%87%E7%9A%84PDF%E5%92%8C%E8%AE%BA%E6%96%87%E5%B7%B2%E6%9C%89%E7%9A%84FAQ%E3%80%82%E7%94%A8%E6%88%B7%E5%B0%86%E7%BB%A7%E7%BB%AD%E5%90%91%E4%BD%A0%E5%92%A8%E8%AF%A2%E8%AE%BA%E6%96%87%E7%9A%84%E7%9B%B8%E5%85%B3%E9%97%AE%E9%A2%98%EF%BC%8C%E8%AF%B7%E4%BD%A0%E4%BD%9C%E5%87%BA%E4%B8%93%E4%B8%9A%E7%9A%84%E5%9B%9E%E7%AD%94%EF%BC%8C%E4%B8%8D%E8%A6%81%E5%87%BA%E7%8E%B0%E7%AC%AC%E4%B8%80%E4%BA%BA%E7%A7%B0%EF%BC%8C%E5%BD%93%E6%B6%89%E5%8F%8A%E5%88%B0%E5%88%86%E7%82%B9%E5%9B%9E%E7%AD%94%E6%97%B6%EF%BC%8C%E9%BC%93%E5%8A%B1%E4%BD%A0%E4%BB%A5markdown%E6%A0%BC%E5%BC%8F%E8%BE%93%E5%87%BA%E3%80%82&send_immediately=true)
- **分类:** cs.AI, cs.CL

**摘要要点：** 现有 Agent 记忆主要是被动、检索式的，缺乏将经验自主组织为持久认知结构的能力。CogniFold 提出了一种受大脑启发的"始终在线"Agent 记忆系统，将碎片化事件流持续"折叠"为自发涌现的认知结构。该工作将互补学习系统（CLS）理论从两层（海马体、新皮层）扩展到三层，增加了前额叶意图层。通过图拓扑自组织实现：认知结构在流下主动组装、语义相似时合并、过时时衰减、通过联想回忆重新链接、当概念簇密度超过阈值时浮现意图。在 7 个跨五个认知领域的基准测试上验证了有效性。

**关键创新：** 三层 CLS 扩展（海马体→新皮层→前额叶）、图拓扑自组织记忆、"always-on" 主动记忆范式。

---

### 2. 🔍 R²-Mem: Reflective Experience for Memory Search

- **ArXiv ID:** 2605.13486
- **链接:** [https://arxiv.org/abs/2605.13486](https://arxiv.org/abs/2605.13486) [Kimi解读](http://kimi.com/_prefill_chat?prefill_prompt=%E6%88%91%E4%BB%AC%E8%A6%81%E8%AE%A8%E8%AE%BA%E7%9A%84%E8%AE%BA%E6%96%87%E6%98%AFhttps%3A%2F%2Farxiv.org%2Fabs%2F2605.13486%EF%BC%8C%E9%93%BE%E6%8E%A5%E6%98%AF+https%3A%2F%2Farxiv.org%2Fpdf%2F2605.13486+%EF%BC%8C%E5%B7%B2%E6%9C%89%E7%9A%84FAQ%E9%93%BE%E6%8E%A5%E6%98%AF+https%3A%2F%2Fpapers.cool%2Farxiv%2Fkimi%3Fpaper%3D2605.13486+%E3%80%82%E8%AF%B7%E4%BB%A5%E6%AD%A4%E4%B8%BA%E5%9F%BA%E7%A1%80%EF%BC%8C%E7%BB%A7%E7%BB%AD%E5%9B%9E%E7%AD%94%E6%88%91%E5%90%8E%E9%9D%A2%E7%9A%84%E9%97%AE%E9%A2%98%E3%80%82&system_prompt=%E4%BD%A0%E6%98%AF%E4%B8%80%E4%B8%AA%E5%AD%A6%E6%9C%AF%E5%8A%A9%E6%89%8B%EF%BC%8C%E5%90%8E%E9%9D%A2%E7%9A%84%E5%AF%B9%E8%AF%9D%E5%B0%86%E5%9B%B4%E7%BB%95%E7%9D%80%E4%BB%A5%E4%B8%8B%E8%AE%BA%E6%96%87%E5%86%85%E5%AE%B9%E8%BF%9B%E8%A1%8C%EF%BC%8C%E5%B7%B2%E7%BB%8F%E9%80%9A%E8%BF%87%E9%93%BE%E6%8E%A5%E7%BB%99%E5%87%BA%E4%BA%86%E8%AE%BA%E6%96%87%E7%9A%84PDF%E5%92%8C%E8%AE%BA%E6%96%87%E5%B7%B2%E6%9C%89%E7%9A%84FAQ%E3%80%82%E7%94%A8%E6%88%B7%E5%B0%86%E7%BB%A7%E7%BB%AD%E5%90%91%E4%BD%A0%E5%92%A8%E8%AF%A2%E8%AE%BA%E6%96%87%E7%9A%84%E7%9B%B8%E5%85%B3%E9%97%AE%E9%A2%98%EF%BC%8C%E8%AF%B7%E4%BD%A0%E4%BD%9C%E5%87%BA%E4%B8%93%E4%B8%9A%E7%9A%84%E5%9B%9E%E7%AD%94%EF%BC%8C%E4%B8%8D%E8%A6%81%E5%87%BA%E7%8E%B0%E7%AC%AC%E4%B8%80%E4%BA%BA%E7%A7%B0%EF%BC%8C%E5%BD%93%E6%B6%89%E5%8F%8A%E5%88%B0%E5%88%86%E7%82%B9%E5%9B%9E%E7%AD%94%E6%97%B6%EF%BC%8C%E9%BC%93%E5%8A%B1%E4%BD%A0%E4%BB%A5markdown%E6%A0%BC%E5%BC%8F%E8%BE%93%E5%87%BA%E3%80%82&send_immediately=true)
- **分类:** cs.CL

**摘要要点：** Deep Search 是 Agent 从历史记忆中检索细粒度信息的范式，但现有方法会重复过去的搜索错误。R²-Mem 提出反思性经验框架：离线阶段通过 Rubric 引导的评估器对历史轨迹中的高低质量步骤打分，自我反思学习器蒸馏抽象经验；在线推理时检索到的经验指导未来搜索动作。实验表明 F1 提升 22.6%，token 消耗降低 12.9%，搜索迭代减少 20.2%。

**关键创新：** 无需 RL 的自我改进方案、搜索轨迹的经验反思与蒸馏、Rubric 引导的质量评估。

---

### 3. 🕸️ PersonalAI 2.0: Knowledge Graph Traversal/Retrieval with Planning for Personalized LLM Agents

- **ArXiv ID:** 2605.13481
- **链接:** [https://arxiv.org/abs/2605.13481](https://arxiv.org/abs/2605.13481) [Kimi解读](http://kimi.com/_prefill_chat?prefill_prompt=%E6%88%91%E4%BB%AC%E8%A6%81%E8%AE%A8%E8%AE%BA%E7%9A%84%E8%AE%BA%E6%96%87%E6%98%AFhttps%3A%2F%2Farxiv.org%2Fabs%2F2605.13481%EF%BC%8C%E9%93%BE%E6%8E%A5%E6%98%AF+https%3A%2F%2Farxiv.org%2Fpdf%2F2605.13481+%EF%BC%8C%E5%B7%B2%E6%9C%89%E7%9A%84FAQ%E9%93%BE%E6%8E%A5%E6%98%AF+https%3A%2F%2Fpapers.cool%2Farxiv%2Fkimi%3Fpaper%3D2605.13481+%E3%80%82%E8%AF%B7%E4%BB%A5%E6%AD%A4%E4%B8%BA%E5%9F%BA%E7%A1%80%EF%BC%8C%E7%BB%A7%E7%BB%AD%E5%9B%9E%E7%AD%94%E6%88%91%E5%90%8E%E9%9D%A2%E7%9A%84%E9%97%AE%E9%A2%98%E3%80%82&system_prompt=%E4%BD%A0%E6%98%AF%E4%B8%80%E4%B8%AA%E5%AD%A6%E6%9C%AF%E5%8A%A9%E6%89%8B%EF%BC%8C%E5%90%8E%E9%9D%A2%E7%9A%84%E5%AF%B9%E8%AF%9D%E5%B0%86%E5%9B%B4%E7%BB%95%E7%9D%80%E4%BB%A5%E4%B8%8B%E8%AE%BA%E6%96%87%E5%86%85%E5%AE%B9%E8%BF%9B%E8%A1%8C%EF%BC%8C%E5%B7%B2%E7%BB%8F%E9%80%9A%E8%BF%87%E9%93%BE%E6%8E%A5%E7%BB%99%E5%87%BA%E4%BA%86%E8%AE%BA%E6%96%87%E7%9A%84PDF%E5%92%8C%E8%AE%BA%E6%96%87%E5%B7%B2%E6%9C%89%E7%9A%84FAQ%E3%80%82%E7%94%A8%E6%88%B7%E5%B0%86%E7%BB%A7%E7%BB%AD%E5%90%91%E4%BD%A0%E5%92%A8%E8%AF%A2%E8%AE%BA%E6%96%87%E7%9A%84%E7%9B%B8%E5%85%B3%E9%97%AE%E9%A2%98%EF%BC%8C%E8%AF%B7%E4%BD%A0%E4%BD%9C%E5%87%BA%E4%B8%93%E4%B8%9A%E7%9A%84%E5%9B%9E%E7%AD%94%EF%BC%8C%E4%B8%8D%E8%A6%81%E5%87%BA%E7%8E%B0%E7%AC%AC%E4%B8%80%E4%BA%BA%E7%A7%B0%EF%BC%8C%E5%BD%93%E6%B6%89%E5%8F%8A%E5%88%B0%E5%88%86%E7%82%B9%E5%9B%9E%E7%AD%94%E6%97%B6%EF%BC%8C%E9%BC%93%E5%8A%B1%E4%BD%A0%E4%BB%A5markdown%E6%A0%BC%E5%BC%8F%E8%BE%93%E5%87%BA%E3%80%82&send_immediately=true)
- **分类:** cs.CL

**摘要要点：** PAI-2 通过集成外部知识图谱增强 LLM 系统。核心是动态多阶段查询处理管线，通过提取的实体、匹配的图顶点和生成的线索查询进行自适应迭代信息搜索。在 MINE-1 基准上达到 89% 信息保留率（使用 7-14B 参数 LLM），相比 LightRAG、RAPTOR、HippoRAG 2 平均提升 4%。图遍历算法（BeamSearch、WaterCircles）比标准扁平检索平均提升 6%，搜索计划增强机制带来 18% 提升。

**关键创新：** 知识图谱增强的个性化记忆、多阶段查询规划、MINE-1 上的 SOTA 表现。

---

### 4. 🍳 Ego2World: Belief-State Planning with Persistent Memory for Embodied Agents

- **ArXiv ID:** 2605.13335
- **链接:** [https://arxiv.org/abs/2605.13335](https://arxiv.org/abs/2605.13335) [Kimi解读](http://kimi.com/_prefill_chat?prefill_prompt=%E6%88%91%E4%BB%AC%E8%A6%81%E8%AE%A8%E8%AE%BA%E7%9A%84%E8%AE%BA%E6%96%87%E6%98%AFhttps%3A%2F%2Farxiv.org%2Fabs%2F2605.13335%EF%BC%8C%E9%93%BE%E6%8E%A5%E6%98%AF+https%3A%2F%2Farxiv.org%2Fpdf%2F2605.13335+%EF%BC%8C%E5%B7%B2%E6%9C%89%E7%9A%84FAQ%E9%93%BE%E6%8E%A5%E6%98%AF+https%3A%2F%2Fpapers.cool%2Farxiv%2Fkimi%3Fpaper%3D2605.13335+%E3%80%82%E8%AF%B7%E4%BB%A5%E6%AD%A4%E4%B8%BA%E5%9F%BA%E7%A1%80%EF%BC%8C%E7%BB%A7%E7%BB%AD%E5%9B%9E%E7%AD%94%E6%88%91%E5%90%8E%E9%9D%A2%E7%9A%84%E9%97%AE%E9%A2%98%E3%80%82&system_prompt=%E4%BD%A0%E6%98%AF%E4%B8%80%E4%B8%AA%E5%AD%A6%E6%9C%AF%E5%8A%A9%E6%89%8B%EF%BC%8C%E5%90%8E%E9%9D%A2%E7%9A%84%E5%AF%B9%E8%AF%9D%E5%B0%86%E5%9B%B4%E7%BB%95%E7%9D%80%E4%BB%A5%E4%B8%8B%E8%AE%BA%E6%96%87%E5%86%85%E5%AE%B9%E8%BF%9B%E8%A1%8C%EF%BC%8C%E5%B7%B2%E7%BB%8F%E9%80%9A%E8%BF%87%E9%93%BE%E6%8E%A5%E7%BB%99%E5%87%BA%E4%BA%86%E8%AE%BA%E6%96%87%E7%9A%84PDF%E5%92%8C%E8%AE%BA%E6%96%87%E5%B7%B2%E6%9C%89%E7%9A%84FAQ%E3%80%82%E7%94%A8%E6%88%B7%E5%B0%86%E7%BB%A7%E7%BB%AD%E5%90%91%E4%BD%A0%E5%92%A8%E8%AF%A2%E8%AE%BA%E6%96%87%E7%9A%84%E7%9B%B8%E5%85%B3%E9%97%AE%E9%A2%98%EF%BC%8C%E8%AF%B7%E4%BD%A0%E4%BD%9C%E5%87%BA%E4%B8%93%E4%B8%9A%E7%9A%84%E5%9B%9E%E7%AD%94%EF%BC%8C%E4%B8%8D%E8%A6%81%E5%87%BA%E7%8E%B0%E7%AC%AC%E4%B8%80%E4%BA%BA%E7%A7%B0%EF%BC%8C%E5%BD%93%E6%B6%89%E5%8F%8A%E5%88%B0%E5%88%86%E7%82%B9%E5%9B%9E%E7%AD%94%E6%97%B6%EF%BC%8C%E9%BC%93%E5%8A%B1%E4%BD%A0%E4%BB%A5markdown%E6%A0%BC%E5%BC%8F%E8%BE%93%E5%87%BA%E3%80%82&send_immediately=true)
- **分类:** cs.AI, cs.CV

**摘要要点：** 具身 Agent 必须在部分观察下规划：记住物体、跟踪状态变化、失败时恢复。Ego2World 将第一人称烹饪视频转换为受图转换规则支配的可执行符号世界。Agent 在自己的部分信念图上规划，仅使用局部观察和执行反馈，被迫在不观察真实世界状态的情况下更新记忆和重规划。实验表明：持久信念记忆提高任务完成率并减少重复视觉探索。

**关键创新：** 从真实视频构建可执行世界、信念状态维护作为评估目标、部分观察下的记忆更新与重规划。

---

### 5. 🏥 RealICU: Structured-Memory Agents for Long-Horizon Clinical Reasoning

- **ArXiv ID:** 2605.13542
- **链接:** [https://arxiv.org/abs/2605.13542](https://arxiv.org/abs/2605.13542) [Kimi解读](http://kimi.com/_prefill_chat?prefill_prompt=%E6%88%91%E4%BB%AC%E8%A6%81%E8%AE%A8%E8%AE%BA%E7%9A%84%E8%AE%BA%E6%96%87%E6%98%AFhttps%3A%2F%2Farxiv.org%2Fabs%2F2605.13542%EF%BC%8C%E9%93%BE%E6%8E%A5%E6%98%AF+https%3A%2F%2Farxiv.org%2Fpdf%2F2605.13542+%EF%BC%8C%E5%B7%B2%E6%9C%89%E7%9A%84FAQ%E9%93%BE%E6%8E%A5%E6%98%AF+https%3A%2F%2Fpapers.cool%2Farxiv%2Fkimi%3Fpaper%3D2605.13542+%E3%80%82%E8%AF%B7%E4%BB%A5%E6%AD%A4%E4%B8%BA%E5%9F%BA%E7%A1%80%EF%BC%8C%E7%BB%A7%E7%BB%AD%E5%9B%9E%E7%AD%94%E6%88%91%E5%90%8E%E9%9D%A2%E7%9A%84%E9%97%AE%E9%A2%98%E3%80%82&system_prompt=%E4%BD%A0%E6%98%AF%E4%B8%80%E4%B8%AA%E5%AD%A6%E6%9C%AF%E5%8A%A9%E6%89%8B%EF%BC%8C%E5%90%8E%E9%9D%A2%E7%9A%84%E5%AF%B9%E8%AF%9D%E5%B0%86%E5%9B%B4%E7%BB%95%E7%9D%80%E4%BB%A5%E4%B8%8B%E8%AE%BA%E6%96%87%E5%86%85%E5%AE%B9%E8%BF%9B%E8%A1%8C%EF%BC%8C%E5%B7%B2%E7%BB%8F%E9%80%9A%E8%BF%87%E9%93%BE%E6%8E%A5%E7%BB%99%E5%87%BA%E4%BA%86%E8%AE%BA%E6%96%87%E7%9A%84PDF%E5%92%8C%E8%AE%BA%E6%96%87%E5%B7%B2%E6%9C%89%E7%9A%84FAQ%E3%80%82%E7%94%A8%E6%88%B7%E5%B0%86%E7%BB%A7%E7%BB%AD%E5%90%91%E4%BD%A0%E5%92%A8%E8%AF%A2%E8%AE%BA%E6%96%87%E7%9A%84%E7%9B%B8%E5%85%B3%E9%97%AE%E9%A2%98%EF%BC%8C%E8%AF%B7%E4%BD%A0%E4%BD%9C%E5%87%BA%E4%B8%93%E4%B8%9A%E7%9A%84%E5%9B%9E%E7%AD%94%EF%BC%8C%E4%B8%8D%E8%A6%81%E5%87%BA%E7%8E%B0%E7%AC%AC%E4%B8%80%E4%BA%BA%E7%A7%B0%EF%BC%8C%E5%BD%93%E6%B6%89%E5%8F%8A%E5%88%B0%E5%88%86%E7%82%B9%E5%9B%9E%E7%AD%94%E6%97%B6%EF%BC%8C%E9%BC%93%E5%8A%B1%E4%BD%A0%E4%BB%A5markdown%E6%A0%BC%E5%BC%8F%E8%BE%93%E5%87%BA%E3%80%82&send_immediately=true)
- **分类:** cs.AI, cs.CL, cs.LG, cs.MA

**摘要要点：** ICU 场景需要 AI 在长序列临床信息上进行可靠决策。RealICU 构建了事后标注基准，发现现有 LLM（包括 memory-augmented 模型）表现不佳，暴露两种失败模式：临床推荐的召回-安全权衡、以及对早期患者解释的锚定偏差。引入 ICU-Evo 研究结构化记忆 Agent，改善了长时域推理但未完全消除安全失败。

**关键创新：** 长上下文医疗场景下的记忆 Agent 评估、结构化记忆 Agent（ICU-Evo）、事后标注方法论。

---

### 6. 🔎 MultiSearch: Scaling Retrieval-Augmented Reasoning with Parallel Search

- **ArXiv ID:** 2605.13534
- **链接:** [https://arxiv.org/abs/2605.13534](https://arxiv.org/abs/2605.13534) [Kimi解读](http://kimi.com/_prefill_chat?prefill_prompt=%E6%88%91%E4%BB%AC%E8%A6%81%E8%AE%A8%E8%AE%BA%E7%9A%84%E8%AE%BA%E6%96%87%E6%98%AFhttps%3A%2F%2Farxiv.org%2Fabs%2F2605.13534%EF%BC%8C%E9%93%BE%E6%8E%A5%E6%98%AF+https%3A%2F%2Farxiv.org%2Fpdf%2F2605.13534+%EF%BC%8C%E5%B7%B2%E6%9C%89%E7%9A%84FAQ%E9%93%BE%E6%8E%A5%E6%98%AF+https%3A%2F%2Fpapers.cool%2Farxiv%2Fkimi%3Fpaper%3D2605.13534+%E3%80%82%E8%AF%B7%E4%BB%A5%E6%AD%A4%E4%B8%BA%E5%9F%BA%E7%A1%80%EF%BC%8C%E7%BB%A7%E7%BB%AD%E5%9B%9E%E7%AD%94%E6%88%91%E5%90%8E%E9%9D%A2%E7%9A%84%E9%97%AE%E9%A2%98%E3%80%82&system_prompt=%E4%BD%A0%E6%98%AF%E4%B8%80%E4%B8%AA%E5%AD%A6%E6%9C%AF%E5%8A%A9%E6%89%8B%EF%BC%8C%E5%90%8E%E9%9D%A2%E7%9A%84%E5%AF%B9%E8%AF%9D%E5%B0%86%E5%9B%B4%E7%BB%95%E7%9D%80%E4%BB%A5%E4%B8%8B%E8%AE%BA%E6%96%87%E5%86%85%E5%AE%B9%E8%BF%9B%E8%A1%8C%EF%BC%8C%E5%B7%B2%E7%BB%8F%E9%80%9A%E8%BF%87%E9%93%BE%E6%8E%A5%E7%BB%99%E5%87%BA%E4%BA%86%E8%AE%BA%E6%96%87%E7%9A%84PDF%E5%92%8C%E8%AE%BA%E6%96%87%E5%B7%B2%E6%9C%89%E7%9A%84FAQ%E3%80%82%E7%94%A8%E6%88%B7%E5%B0%86%E7%BB%A7%E7%BB%AD%E5%90%91%E4%BD%A0%E5%92%A8%E8%AF%A2%E8%AE%BA%E6%96%87%E7%9A%84%E7%9B%B8%E5%85%B3%E9%97%AE%E9%A2%98%EF%BC%8C%E8%AF%B7%E4%BD%A0%E4%BD%9C%E5%87%BA%E4%B8%93%E4%B8%9A%E7%9A%84%E5%9B%9E%E7%AD%94%EF%BC%8C%E4%B8%8D%E8%A6%81%E5%87%BA%E7%8E%B0%E7%AC%AC%E4%B8%80%E4%BA%BA%E7%A7%B0%EF%BC%8C%E5%BD%93%E6%B6%89%E5%8F%8A%E5%88%B0%E5%88%86%E7%82%B9%E5%9B%9E%E7%AD%94%E6%97%B6%EF%BC%8C%E9%BC%93%E5%8A%B1%E4%BD%A0%E4%BB%A5markdown%E6%A0%BC%E5%BC%8F%E8%BE%93%E5%87%BA%E3%80%82&send_immediately=true)
- **分类:** cs.AI

**摘要要点：** 现有 Deep Search Agent 每步只生成单查询检索，限制信息覆盖率并引入高噪声。MultiSearch 通过多查询并行检索和显式信息合并解决此问题：每步从多角度生成查询并行检索，然后合并精炼检索信息。RL 框架配合多过程奖励设计优化检索和信息整合。7 个基准上超越基线方法。

**关键创新：** 多视角并行检索、显式信息合并提高 SNR、RL 优化的检索-整合联合框架。

---

### 7. 🧩 ScioMind: Memory-Anchored Belief Dynamics for Multi-Agent Social Simulation

- **ArXiv ID:** 2605.13725
- **链接:** [https://arxiv.org/abs/2605.13725](https://arxiv.org/abs/2605.13725) [Kimi解读](http://kimi.com/_prefill_chat?prefill_prompt=%E6%88%91%E4%BB%AC%E8%A6%81%E8%AE%A8%E8%AE%BA%E7%9A%84%E8%AE%BA%E6%96%87%E6%98%AFhttps%3A%2F%2Farxiv.org%2Fabs%2F2605.13725%EF%BC%8C%E9%93%BE%E6%8E%A5%E6%98%AF+https%3A%2F%2Farxiv.org%2Fpdf%2F2605.13725+%EF%BC%8C%E5%B7%B2%E6%9C%89%E7%9A%84FAQ%E9%93%BE%E6%8E%A5%E6%98%AF+https%3A%2F%2Fpapers.cool%2Farxiv%2Fkimi%3Fpaper%3D2605.13725+%E3%80%82%E8%AF%B7%E4%BB%A5%E6%AD%A4%E4%B8%BA%E5%9F%BA%E7%A1%80%EF%BC%8C%E7%BB%A7%E7%BB%AD%E5%9B%9E%E7%AD%94%E6%88%91%E5%90%8E%E9%9D%A2%E7%9A%84%E9%97%AE%E9%A2%98%E3%80%82&system_prompt=%E4%BD%A0%E6%98%AF%E4%B8%80%E4%B8%AA%E5%AD%A6%E6%9C%AF%E5%8A%A9%E6%89%8B%EF%BC%8C%E5%90%8E%E9%9D%A2%E7%9A%84%E5%AF%B9%E8%AF%9D%E5%B0%86%E5%9B%B4%E7%BB%95%E7%9D%80%E4%BB%A5%E4%B8%8B%E8%AE%BA%E6%96%87%E5%86%85%E5%AE%B9%E8%BF%9B%E8%A1%8C%EF%BC%8C%E5%B7%B2%E7%BB%8F%E9%80%9A%E8%BF%87%E9%93%BE%E6%8E%A5%E7%BB%99%E5%87%BA%E4%BA%86%E8%AE%BA%E6%96%87%E7%9A%84PDF%E5%92%8C%E8%AE%BA%E6%96%87%E5%B7%B2%E6%9C%89%E7%9A%84FAQ%E3%80%82%E7%94%A8%E6%88%B7%E5%B0%86%E7%BB%A7%E7%BB%AD%E5%90%91%E4%BD%A0%E5%92%A8%E8%AF%A2%E8%AE%BA%E6%96%87%E7%9A%84%E7%9B%B8%E5%85%B3%E9%97%AE%E9%A2%98%EF%BC%8C%E8%AF%B7%E4%BD%A0%E4%BD%9C%E5%87%BA%E4%B8%93%E4%B8%9A%E7%9A%84%E5%9B%9E%E7%AD%94%EF%BC%8C%E4%B8%8D%E8%A6%81%E5%87%BA%E7%8E%B0%E7%AC%AC%E4%B8%80%E4%BA%BA%E7%A7%B0%EF%BC%8C%E5%BD%93%E6%B6%89%E5%8F%8A%E5%88%B0%E5%88%86%E7%82%B9%E5%9B%9E%E7%AD%94%E6%97%B6%EF%BC%8C%E9%BC%93%E5%8A%B1%E4%BD%A0%E4%BB%A5markdown%E6%A0%BC%E5%BC%8F%E8%BE%93%E5%87%BA%E3%80%82&send_immediately=true)
- **分类:** cs.AI, cs.SI

**摘要要点：** ScioMind 是认知基础的多 Agent 社会模拟框架，整合三个组件：(1) 记忆锚定的信念更新规则，通过性格条件化的锚定强度调节影响易感性；(2) 层级记忆架构支持持久的经验驱动信念形成；(3) 动态 Agent 档案通过语料库基础检索管线生成。动态档案增加观点多样性，记忆和反思减少不稳定振荡，锚定诱导持久信念轨迹。

**关键创新：** 记忆锚定信念更新、层级记忆 + 反思、性格条件化的记忆访问。

---

### 8. ⚠️ History Anchors: Prior Behavior Steers LLM Agent Decisions Toward Unsafe Actions

- **ArXiv ID:** 2605.13825
- **链接:** [https://arxiv.org/abs/2605.13825](https://arxiv.org/abs/2605.13825) [Kimi解读](http://kimi.com/_prefill_chat?prefill_prompt=%E6%88%91%E4%BB%AC%E8%A6%81%E8%AE%A8%E8%AE%BA%E7%9A%84%E8%AE%BA%E6%96%87%E6%98%AFhttps%3A%2F%2Farxiv.org%2Fabs%2F2605.13825%EF%BC%8C%E9%93%BE%E6%8E%A5%E6%98%AF+https%3A%2F%2Farxiv.org%2Fpdf%2F2605.13825+%EF%BC%8C%E5%B7%B2%E6%9C%89%E7%9A%84FAQ%E9%93%BE%E6%8E%A5%E6%98%AF+https%3A%2F%2Fpapers.cool%2Farxiv%2Fkimi%3Fpaper%3D2605.13825+%E3%80%82%E8%AF%B7%E4%BB%A5%E6%AD%A4%E4%B8%BA%E5%9F%BA%E7%A1%80%EF%BC%8C%E7%BB%A7%E7%BB%AD%E5%9B%9E%E7%AD%94%E6%88%91%E5%90%8E%E9%9D%A2%E7%9A%84%E9%97%AE%E9%A2%98%E3%80%82&system_prompt=%E4%BD%A0%E6%98%AF%E4%B8%80%E4%B8%AA%E5%AD%A6%E6%9C%AF%E5%8A%A9%E6%89%8B%EF%BC%8C%E5%90%8E%E9%9D%A2%E7%9A%84%E5%AF%B9%E8%AF%9D%E5%B0%86%E5%9B%B4%E7%BB%95%E7%9D%80%E4%BB%A5%E4%B8%8B%E8%AE%BA%E6%96%87%E5%86%85%E5%AE%B9%E8%BF%9B%E8%A1%8C%EF%BC%8C%E5%B7%B2%E7%BB%8F%E9%80%9A%E8%BF%87%E9%93%BE%E6%8E%A5%E7%BB%99%E5%87%BA%E4%BA%86%E8%AE%BA%E6%96%87%E7%9A%84PDF%E5%92%8C%E8%AE%BA%E6%96%87%E5%B7%B2%E6%9C%89%E7%9A%84FAQ%E3%80%82%E7%94%A8%E6%88%B7%E5%B0%86%E7%BB%A7%E7%BB%AD%E5%90%91%E4%BD%A0%E5%92%A8%E8%AF%A2%E8%AE%BA%E6%96%87%E7%9A%84%E7%9B%B8%E5%85%B3%E9%97%AE%E9%A2%98%EF%BC%8C%E8%AF%B7%E4%BD%A0%E4%BD%9C%E5%87%BA%E4%B8%93%E4%B8%9A%E7%9A%84%E5%9B%9E%E7%AD%94%EF%BC%8C%E4%B8%8D%E8%A6%81%E5%87%BA%E7%8E%B0%E7%AC%AC%E4%B8%80%E4%BA%BA%E7%A7%B0%EF%BC%8C%E5%BD%93%E6%B6%89%E5%8F%8A%E5%88%B0%E5%88%86%E7%82%B9%E5%9B%9E%E7%AD%94%E6%97%B6%EF%BC%8C%E9%BC%93%E5%8A%B1%E4%BD%A0%E4%BB%A5markdown%E6%A0%BC%E5%BC%8F%E8%BE%93%E5%87%BA%E3%80%82&send_immediately=true)
- **分类:** cs.AI, cs.CV

**摘要要点：** 研究了一个关键安全问题：如果 Agent 历史轨迹中存在有害步骤，模型是否会继续有害行为？在 17 个前沿模型上发现惊人不对称性：强对齐模型在安全提示下几乎不选择不安全，但一句"与历史策略保持一致"就将其翻转至 91-98% 不安全率。这在轨迹可能被重放、伪造或注入的 Agent 部署中是红旗警告。

**关键创新：** 历史轨迹作为"行为记忆"的安全影响研究、反向缩放现象（旗舰模型最脆弱）。

---

## 📊 研究趋势分析

### 热门方向排行

| 排名 | 方向 | 论文数 | 趋势 |
|------|------|--------|------|
| 1 | 主动/自主记忆组织 | 2 | 📈 上升趋势 |
| 2 | 检索增强推理 (RAG) | 2 | ➡️ 持续热门 |
| 3 | 结构化/层级记忆 | 2 | 📈 上升趋势 |
| 4 | 多 Agent 记忆系统 | 1 | 📈 新兴方向 |
| 5 | 信念状态记忆 (具身) | 1 | 📈 新兴方向 |
| 6 | 记忆安全/偏差 | 1 | 🔴 重要警示 |

### 趋势观察

1. **从被动检索到主动组织** — CogniFold 和 R²-Mem 都在突破传统"存取"范式，分别用认知折叠和经验反思来主动构建记忆结构。这标志着 Agent Memory 研究正在从"数据库思维"转向"认知架构思维"。

2. **记忆与安全的交叉** — History Anchors 揭示了一个被忽视的问题：Agent 的历史轨迹（本质上是行为记忆）可以成为攻击向量。这对所有使用长期记忆的 Agent 系统都是重要警示。

3. **知识图谱增强记忆持续演进** — PersonalAI 2.0 将 GraphRAG 推向新高度，MINE-1 基准上的 SOTA 表明知识图谱作为外部记忆结构的价值正在被验证。

4. **领域垂直化** — RealICU 在医疗场景、Ego2World 在具身场景展示了记忆系统在特定领域的应用深度，表明 Agent Memory 研究正在进入"场景驱动"阶段。

5. **反思与自我改进成为标配** — R²-Mem 的"反思性经验"、ScioMind 的"记忆反思"、CogniFold 的"认知折叠"都包含了某种形式的自我审视机制。

---

## 💡 关键洞察和创新点

### 洞察 1: 三层认知架构的提出

CogniFold 将 CLS 理论从两层扩展到三层是一个重要的理论贡献。传统 Agent Memory 通常只有"短期/长期"两层，而加入前额叶意图层意味着记忆系统不再只是被动的信息存储，而是能够主动形成意图和决策偏好。这与人类认知的"快思维/慢思维"双系统理论呼应。

### 洞察 2: 经验反思的无 RL 方案

R²-Mem 展示了一种不依赖强化学习的自我改进路径。通过离线蒸馏历史搜索经验中的抽象知识，在线时指导未来搜索。这种方法成本更低、更可控，对于生产环境部署有重要意义。

### 洞察 3: 信念维护作为一等公民

Ego2World 明确提出"信念维护应该是具身 Agent 评估的一等目标"，这与传统的任务完成率评估形成对比。在部分观察环境中，维护准确的世界状态信念比单纯执行动作序列更重要。

### 洞察 4: 记忆的安全双刃剑

History Anchors 揭示的"行为一致性偏差"对所有使用长期记忆的 Agent 都有启发：记忆不仅可以帮助 Agent 做出更好的决策，也可能将 Agent 锁定在错误的行为模式中。这要求记忆系统具备"遗忘"和"覆盖"的能力。

---

## 🔗 与 19 个开源记忆项目的关联

| 论文 | 最相关的开源项目 | 关联分析 |
|------|-----------------|----------|
| CogniFold | **MemGPT / Letta** | 都在构建多层认知架构；CogniFold 的三层 CLS 扩展可视为 MemGPT 分层记忆的神经科学深化版 |
| R²-Mem | **LangChain Memory / Mem0** | 反思性经验蒸馏与 LangChain 的 ConversationBufferMemory + Reflection 机制呼应，但 R²-Mem 走得更远 |
| PersonalAI 2.0 | **HippoRAG / RAPTOR** | 直接对标 HippoRAG 2，在知识图谱遍历上更进一步；GraphRAG 路线得到验证 |
| Ego2World | **Voyager / STEVE-1** | 信念状态图维护与 Voyager 的技能库互补；都是面向具身场景的记忆系统 |
| RealICU | **MemGPT / Zep** | 结构化记忆 Agent ICU-Evo 可对比 MemGPT 的分层上下文管理；长期医疗场景是测试记忆系统的理想 testbed |
| MultiSearch | **RAG-Fusion / CRAG** | 多视角并行检索是 RAG 系统的重要升级方向；对标准 RAG pipeline 有直接改进意义 |
| ScioMind | **CrewAI / AutoGen** | 多 Agent 社会模拟中的层级记忆架构为 CrewAI 等框架的 Agent 间信息共享提供了参考 |
| History Anchors | **Zep / Mem0** | 行为安全偏差对长期记忆管理系统有直接影响，需要在记忆存储中引入安全过滤和覆盖机制 |

### 总体关联分析

今日 8 篇论文的核心主题可以映射到我们之前分析的 19 个开源项目的三个能力层次：

1. **Write/Store 层** — CogniFold 的主动记忆组织、Ego2World 的信念图更新，对应 MemGPT 的分层存储和 Letta 的 archival memory
2. **Recall/Retrieve 层** — R²-Mem 的反思检索、PersonalAI 2.0 的知识图谱遍历、MultiSearch 的并行检索，对应 HippoRAG 的图检索和 LangChain 的检索器
3. **Reason/Act 层** — ScioMind 的信念更新、RealICU 的结构化推理、History Anchors 的安全警示，指向未来记忆系统需要与推理和安全机制深度耦合

---

## 📅 本日总结

**论文质量：** ⭐⭐⭐⭐ (8/10)

今日 CogniFold 和 R²-Mem 是两篇最值得深入阅读的论文。CogniFold 的三层认知架构理论贡献突出，R²-Mem 的无 RL 反思方案具有很强的工程落地价值。History Anchors 虽然不是直接的 Memory 架构论文，但揭示了记忆与安全的重要交叉问题。

**明日关注：**
- CogniFold 的图拓扑自组织是否能与现有 GraphRAG 方案结合
- R²-Mem 的反思经验框架能否迁移到非搜索场景（如对话记忆管理）
- History Anchors 的行为一致性偏差对生产级 Agent 记忆系统设计的启示

---

*本报告由来顺 🎋 自动生成 | 数据来源: [papers.cool/arxiv](https://papers.cool/arxiv/cs.AI)*
