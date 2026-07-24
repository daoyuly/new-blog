---
title: Agent Memory arXiv 日报 — 2026-06-05
tags:
  - agent-memory
  - arxiv
  - daily-report
  - LLM
  - memory-systems
categories: [Agent Memory 研究]
  - Agent Memory 日报
abbrlink: 17562
date: 2026-06-05 18:00:00
noindex: true
---

# Agent Memory arXiv 日报 — 2026-06-05

> 每日追踪 arXiv cs.AI 上与 Agent Memory 相关的最新研究。本文筛选了 2026-06-04 发布的相关论文，覆盖记忆系统架构、会话记忆管理、经验检索与复用、记忆增强网络等方向。

---

## 📋 今日相关论文列表

### 1. Agent Memory: Characterization and System Implications of Stateful Long-Horizon Workloads

- **arXiv ID:** 2606.06448
- **链接:** [https://arxiv.org/abs/2606.06448](https://arxiv.org/abs/2606.06448) [Kimi解读](http://kimi.com/_prefill_chat?prefill_prompt=%E6%88%91%E4%BB%AC%E8%A6%81%E8%AE%A8%E8%AE%BA%E7%9A%84%E8%AE%BA%E6%96%87%E6%98%AFhttps%3A%2F%2Farxiv.org%2Fabs%2F2606.06448%EF%BC%8C%E9%93%BE%E6%8E%A5%E6%98%AF+https%3A%2F%2Farxiv.org%2Fpdf%2F2606.06448+%EF%BC%8C%E5%B7%B2%E6%9C%89%E7%9A%84FAQ%E9%93%BE%E6%8E%A5%E6%98%AF+https%3A%2F%2Fpapers.cool%2Farxiv%2Fkimi%3Fpaper%3D2606.06448+%E3%80%82%E8%AF%B7%E4%BB%A5%E6%AD%A4%E4%B8%BA%E5%9F%BA%E7%A1%80%EF%BC%8C%E7%BB%A7%E7%BB%AD%E5%9B%9E%E7%AD%94%E6%88%91%E5%90%8E%E9%9D%A2%E7%9A%84%E9%97%AE%E9%A2%98%E3%80%82&system_prompt=%E4%BD%A0%E6%98%AF%E4%B8%80%E4%B8%AA%E5%AD%A6%E6%9C%AF%E5%8A%A9%E6%89%8B%EF%BC%8C%E5%90%8E%E9%9D%A2%E7%9A%84%E5%AF%B9%E8%AF%9D%E5%B0%86%E5%9B%B4%E7%BB%95%E7%9D%80%E4%BB%A5%E4%B8%8B%E8%AE%BA%E6%96%87%E5%86%85%E5%AE%B9%E8%BF%9B%E8%A1%8C%EF%BC%8C%E5%B7%B2%E7%BB%8F%E9%80%9A%E8%BF%87%E9%93%BE%E6%8E%A5%E7%BB%99%E5%87%BA%E4%BA%86%E8%AE%BA%E6%96%87%E7%9A%84PDF%E5%92%8C%E8%AE%BA%E6%96%87%E5%B7%B2%E6%9C%89%E7%9A%84FAQ%E3%80%82%E7%94%A8%E6%88%B7%E5%B0%86%E7%BB%A7%E7%BB%AD%E5%90%91%E4%BD%A0%E5%92%A8%E8%AF%A2%E8%AE%BA%E6%96%87%E7%9A%84%E7%9B%B8%E5%85%B3%E9%97%AE%E9%A2%98%EF%BC%8C%E8%AF%B7%E4%BD%A0%E4%BD%9C%E5%87%BA%E4%B8%93%E4%B8%9A%E7%9A%84%E5%9B%9E%E7%AD%94%EF%BC%8C%E4%B8%8D%E8%A6%81%E5%87%BA%E7%8E%B0%E7%AC%AC%E4%B8%80%E4%BA%BA%E7%A7%B0%EF%BC%8C%E5%BD%93%E6%B6%89%E5%8F%8A%E5%88%B0%E5%88%86%E7%82%B9%E5%9B%9E%E7%AD%94%E6%97%B6%EF%BC%8C%E9%BC%93%E5%8A%B1%E4%BD%A0%E4%BB%A5markdown%E6%A0%BC%E5%BC%8F%E8%BE%93%E5%87%BA%E3%80%82&send_immediately=true)
- **作者:** Yasmine Omri, Ziyu Gan, Zachary Broveak, Robin Geens, Zexue He, Alex Pentland, Marian Verhelst, Tsachy Weissman, Thierry Tambe
- **摘要要点:**
  - **首次系统级表征** LLM Agent 记忆系统，提出了面向系统的四轴分类法（taxonomy）
  - 构建了**阶段感知的分析工具**，将成本归因到记忆构建（construction）、检索（retrieval）和生成（generation）三个阶段
  - 在两个 benchmark 套件上表征了 10 个代表性记忆系统，揭示了设计选择如何在写路径和读路径之间转移成本
  - 提出了 **10 条系统建议**，涵盖构建调度、能力底线、查询量摊销、新鲜度-延迟权衡、舰队级（fleet-scale）管理

**🔑 核心价值：** 这是第一个从系统架构角度全面分析 Agent Memory 的论文，为记忆系统的工程实践提供了量化的设计指南。

---

### 2. TokenMizer: Graph-Structured Session Memory for Long-Horizon LLM Context Management

- **arXiv ID:** 2606.06337
- **链接:** [https://arxiv.org/abs/2606.06337](https://arxiv.org/abs/2606.06337) [Kimi解读](http://kimi.com/_prefill_chat?prefill_prompt=%E6%88%91%E4%BB%AC%E8%A6%81%E8%AE%A8%E8%AE%BA%E7%9A%84%E8%AE%BA%E6%96%87%E6%98%AFhttps%3A%2F%2Farxiv.org%2Fabs%2F2606.06337%EF%BC%8C%E9%93%BE%E6%8E%A5%E6%98%AF+https%3A%2F%2Farxiv.org%2Fpdf%2F2606.06337+%EF%BC%8C%E5%B7%B2%E6%9C%89%E7%9A%84FAQ%E9%93%BE%E6%8E%A5%E6%98%AF+https%3A%2F%2Fpapers.cool%2Farxiv%2Fkimi%3Fpaper%3D2606.06337+%E3%80%82%E8%AF%B7%E4%BB%A5%E6%AD%A4%E4%B8%BA%E5%9F%BA%E7%A1%80%EF%BC%8C%E7%BB%A7%E7%BB%AD%E5%9B%9E%E7%AD%94%E6%88%91%E5%90%8E%E9%9D%A2%E7%9A%84%E9%97%AE%E9%A2%98%E3%80%82&system_prompt=%E4%BD%A0%E6%98%AF%E4%B8%80%E4%B8%AA%E5%AD%A6%E6%9C%AF%E5%8A%A9%E6%89%8B%EF%BC%8C%E5%90%8E%E9%9D%A2%E7%9A%84%E5%AF%B9%E8%AF%9D%E5%B0%86%E5%9B%B4%E7%BB%95%E7%9D%80%E4%BB%A5%E4%B8%8B%E8%AE%BA%E6%96%87%E5%86%85%E5%AE%B9%E8%BF%9B%E8%A1%8C%EF%BC%8C%E5%B7%B2%E7%BB%8F%E9%80%9A%E8%BF%87%E9%93%BE%E6%8E%A5%E7%BB%99%E5%87%BA%E4%BA%86%E8%AE%BA%E6%96%87%E7%9A%84PDF%E5%92%8C%E8%AE%BA%E6%96%87%E5%B7%B2%E6%9C%89%E7%9A%84FAQ%E3%80%82%E7%94%A8%E6%88%B7%E5%B0%86%E7%BB%A7%E7%BB%AD%E5%90%91%E4%BD%A0%E5%92%A8%E8%AF%A2%E8%AE%BA%E6%96%87%E7%9A%84%E7%9B%B8%E5%85%B3%E9%97%AE%E9%A2%98%EF%BC%8C%E8%AF%B7%E4%BD%A0%E4%BD%9C%E5%87%BA%E4%B8%93%E4%B8%9A%E7%9A%84%E5%9B%9E%E7%AD%94%EF%BC%8C%E4%B8%8D%E8%A6%81%E5%87%BA%E7%8E%B0%E7%AC%AC%E4%B8%80%E4%BA%BA%E7%A7%B0%EF%BC%8C%E5%BD%93%E6%B6%89%E5%8F%8A%E5%88%B0%E5%88%86%E7%82%B9%E5%9B%9E%E7%AD%94%E6%97%B6%EF%BC%8C%E9%BC%93%E5%8A%B1%E4%BD%A0%E4%BB%A5markdown%E6%A0%BC%E5%BC%8F%E8%BE%93%E5%87%BA%E3%80%82&send_immediately=true)
- **作者:** Shweta Mishra
- **摘要要点:**
  - 将 LLM 会话历史建模为**类型化知识图谱**（14 种节点类型、7 种边类型）
  - 混合提取管线增量填充图谱，三层检查点系统将其序列化为紧凑的恢复块（resume blocks）
  - 8 层压缩管线减少上下文开销，语义缓存降低重复查询延迟
  - 恢复块平均仅 **78 tokens**（基线 159-170 tokens），决策召回率高出 9-17 个百分点
  - 关键创新：基线只保留"提到了什么技术"，TokenMizer 保留"**为什么**做出这个决策"

**🔑 核心价值：** 用知识图谱替代扁平文本作为会话记忆载体，在保持更高信息保真度的同时将 token 开销减半。

---

### 3. MLEvolve: A Self-Evolving Framework for Automated Machine Learning Algorithm Discovery

- **arXiv ID:** 2606.06473
- **链接:** [https://arxiv.org/abs/2606.06473](https://arxiv.org/abs/2606.06473) [Kimi解读](http://kimi.com/_prefill_chat?prefill_prompt=%E6%88%91%E4%BB%AC%E8%A6%81%E8%AE%A8%E8%AE%BA%E7%9A%84%E8%AE%BA%E6%96%87%E6%98%AFhttps%3A%2F%2Farxiv.org%2Fabs%2F2606.06473%EF%BC%8C%E9%93%BE%E6%8E%A5%E6%98%AF+https%3A%2F%2Farxiv.org%2Fpdf%2F2606.06473+%EF%BC%8C%E5%B7%B2%E6%9C%89%E7%9A%84FAQ%E9%93%BE%E6%8E%A5%E6%98%AF+https%3A%2F%2Fpapers.cool%2Farxiv%2Fkimi%3Fpaper%3D2606.06473+%E3%80%82%E8%AF%B7%E4%BB%A5%E6%AD%A4%E4%B8%BA%E5%9F%BA%E7%A1%80%EF%BC%8C%E7%BB%A7%E7%BB%AD%E5%9B%9E%E7%AD%94%E6%88%91%E5%90%8E%E9%9D%A2%E7%9A%84%E9%97%AE%E9%A2%98%E3%80%82&system_prompt=%E4%BD%A0%E6%98%AF%E4%B8%80%E4%B8%AA%E5%AD%A6%E6%9C%AF%E5%8A%A9%E6%89%8B%EF%BC%8C%E5%90%8E%E9%9D%A2%E7%9A%84%E5%AF%B9%E8%AF%9D%E5%B0%86%E5%9B%B4%E7%BB%95%E7%9D%80%E4%BB%A5%E4%B8%8B%E8%AE%BA%E6%96%87%E5%86%85%E5%AE%B9%E8%BF%9B%E8%A1%8C%EF%BC%8C%E5%B7%B2%E7%BB%8F%E9%80%9A%E8%BF%87%E9%93%BE%E6%8E%A5%E7%BB%99%E5%87%BA%E4%BA%86%E8%AE%BA%E6%96%87%E7%9A%84PDF%E5%92%8C%E8%AE%BA%E6%96%87%E5%B7%B2%E6%9C%89%E7%9A%84FAQ%E3%80%82%E7%94%A8%E6%88%B7%E5%B0%86%E7%BB%A7%E7%BB%AD%E5%90%91%E4%BD%A0%E5%92%A8%E8%AF%A2%E8%AE%BA%E6%96%87%E7%9A%84%E7%9B%B8%E5%85%B3%E9%97%AE%E9%A2%98%EF%BC%8C%E8%AF%B7%E4%BD%A0%E4%BD%9C%E5%87%BA%E4%B8%93%E4%B8%9A%E7%9A%84%E5%9B%9E%E7%AD%94%EF%BC%8C%E4%B8%8D%E8%A6%81%E5%87%BA%E7%8E%B0%E7%AC%AC%E4%B8%80%E4%BA%BA%E7%A7%B0%EF%BC%8C%E5%BD%93%E6%B6%89%E5%8F%8A%E5%88%B0%E5%88%86%E7%82%B9%E5%9B%9E%E7%AD%94%E6%97%B6%EF%BC%8C%E9%BC%93%E5%8A%B1%E4%BD%A0%E4%BB%A5markdown%E6%A0%BC%E5%BC%8F%E8%BE%93%E5%87%BA%E3%80%82&send_immediately=true)
- **作者:** Xiangchao Yan, Jinxin Shi 等
- **摘要要点:**
  - 提出 **Retrospective Memory** 机制，结合冷启动领域知识库与动态全局记忆
  - 解决了 MLE Agent 的"无记忆搜索"问题——跨分支信息隔离、缺乏层次化控制
  - Progressive MCGS 实现跨分支信息流动，熵驱动渐进调度从探索转向利用
  - 在 MLE-Bench 上达到 SOTA（12 小时预算，标准时间的一半）
  - 超越 AlphaEvolve 在数学算法优化任务上的表现

**🔑 核心价值：** Retrospective Memory 是一种显式的经验记忆系统，将过去搜索路径中的有效知识持久化并复用，是"从经验中学习"的典型实现。

---

### 4. AIS-Based Vessel Trajectory Prediction Using Memory-Augmented Neural Networks

- **arXiv ID:** 2606.06311
- **链接:** [https://arxiv.org/abs/2606.06311](https://arxiv.org/abs/2606.06311) [Kimi解读](http://kimi.com/_prefill_chat?prefill_prompt=%E6%88%91%E4%BB%AC%E8%A6%81%E8%AE%A8%E8%AE%BA%E7%9A%84%E8%AE%BA%E6%96%87%E6%98%AFhttps%3A%2F%2Farxiv.org%2Fabs%2F2606.06311%EF%BC%8C%E9%93%BE%E6%8E%A5%E6%98%AF+https%3A%2F%2Farxiv.org%2Fpdf%2F2606.06311+%EF%BC%8C%E5%B7%B2%E6%9C%89%E7%9A%84FAQ%E9%93%BE%E6%8E%A5%E6%98%AF+https%3A%2F%2Fpapers.cool%2Farxiv%2Fkimi%3Fpaper%3D2606.06311+%E3%80%82%E8%AF%B7%E4%BB%A5%E6%AD%A4%E4%B8%BA%E5%9F%BA%E7%A1%80%EF%BC%8C%E7%BB%A7%E7%BB%AD%E5%9B%9E%E7%AD%94%E6%88%91%E5%90%8E%E9%9D%A2%E7%9A%84%E9%97%AE%E9%A2%98%E3%80%82&system_prompt=%E4%BD%A0%E6%98%AF%E4%B8%80%E4%B8%AA%E5%AD%A6%E6%9C%AF%E5%8A%A9%E6%89%8B%EF%BC%8C%E5%90%8E%E9%9D%A2%E7%9A%84%E5%AF%B9%E8%AF%9D%E5%B0%86%E5%9B%B4%E7%BB%95%E7%9D%80%E4%BB%A5%E4%B8%8B%E8%AE%BA%E6%96%87%E5%86%85%E5%AE%B9%E8%BF%9B%E8%A1%8C%EF%BC%8C%E5%B7%B2%E7%BB%8F%E9%80%9A%E8%BF%87%E9%93%BE%E6%8E%A5%E7%BB%99%E5%87%BA%E4%BA%86%E8%AE%BA%E6%96%87%E7%9A%84PDF%E5%92%8C%E8%AE%BA%E6%96%87%E5%B7%B2%E6%9C%89%E7%9A%84FAQ%E3%80%82%E7%94%A8%E6%88%B7%E5%B0%86%E7%BB%A7%E7%BB%AD%E5%90%91%E4%BD%A0%E5%92%A8%E8%AF%A2%E8%AE%BA%E6%96%87%E7%9A%84%E7%9B%B8%E5%85%B3%E9%97%AE%E9%A2%98%EF%BC%8C%E8%AF%B7%E4%BD%A0%E4%BD%9C%E5%87%BA%E4%B8%93%E4%B8%9A%E7%9A%84%E5%9B%9E%E7%AD%94%EF%BC%8C%E4%B8%8D%E8%A6%81%E5%87%BA%E7%8E%B0%E7%AC%AC%E4%B8%80%E4%BA%BA%E7%A7%B0%EF%BC%8C%E5%BD%93%E6%B6%89%E5%8F%8A%E5%88%B0%E5%88%86%E7%82%B9%E5%9B%9E%E7%AD%94%E6%97%B6%EF%BC%8C%E9%BC%93%E5%8A%B1%E4%BD%A0%E4%BB%A5markdown%E6%A0%BC%E5%BC%8F%E8%BE%93%E5%87%BA%E3%80%82&send_immediately=true)
- **作者:** Wonmo Koo, Sanha Chang, Heeyoung Kim
- **摘要要点:**
  - 将 **Memory-Augmented Neural Networks** 应用于船舶轨迹预测（AIS 数据）
  - 通过外部记忆模块选择性检索相关信息，在墨西哥湾和纽约湾数据集上显著优于基线
  - 证明了记忆增强机制在非 NLP 领域（时序预测）的泛化能力

**🔑 核心价值：** 展示了外部记忆模块在轨迹预测任务中的价值，是 memory-augmented 架构在非语言任务中的实证。

---

### 5. DataCOPE: Unsupervised Skill Discovery for Agentic Data Analysis

- **arXiv ID:** 2606.06416
- **链接:** [https://arxiv.org/abs/2606.06416](https://arxiv.org/abs/2606.06416) [Kimi解读](http://kimi.com/_prefill_chat?prefill_prompt=%E6%88%91%E4%BB%AC%E8%A6%81%E8%AE%A8%E8%AE%BA%E7%9A%84%E8%AE%BA%E6%96%87%E6%98%AFhttps%3A%2F%2Farxiv.org%2Fabs%2F2606.06416%EF%BC%8C%E9%93%BE%E6%8E%A5%E6%98%AF+https%3A%2F%2Farxiv.org%2Fpdf%2F2606.06416+%EF%BC%8C%E5%B7%B2%E6%9C%89%E7%9A%84FAQ%E9%93%BE%E6%8E%A5%E6%98%AF+https%3A%2F%2Fpapers.cool%2Farxiv%2Fkimi%3Fpaper%3D2606.06416+%E3%80%82%E8%AF%B7%E4%BB%A5%E6%AD%A4%E4%B8%BA%E5%9F%BA%E7%A1%80%EF%BC%8C%E7%BB%A7%E7%BB%AD%E5%9B%9E%E7%AD%94%E6%88%91%E5%90%8E%E9%9D%A2%E7%9A%84%E9%97%AE%E9%A2%98%E3%80%82&system_prompt=%E4%BD%A0%E6%98%AF%E4%B8%80%E4%B8%AA%E5%AD%A6%E6%9C%AF%E5%8A%A9%E6%89%8B%EF%BC%8C%E5%90%8E%E9%9D%A2%E7%9A%84%E5%AF%B9%E8%AF%9D%E5%B0%86%E5%9B%B4%E7%BB%95%E7%9D%80%E4%BB%A5%E4%B8%8B%E8%AE%BA%E6%96%87%E5%86%85%E5%AE%B9%E8%BF%9B%E8%A1%8C%EF%BC%8C%E5%B7%B2%E7%BB%8F%E9%80%9A%E8%BF%87%E9%93%BE%E6%8E%A5%E7%BB%99%E5%87%BA%E4%BA%86%E8%AE%BA%E6%96%87%E7%9A%84PDF%E5%92%8C%E8%AE%BA%E6%96%87%E5%B7%B2%E6%9C%89%E7%9A%84FAQ%E3%80%82%E7%94%A8%E6%88%B7%E5%B0%86%E7%BB%A7%E7%BB%AD%E5%90%91%E4%BD%A0%E5%92%A8%E8%AF%A2%E8%AE%BA%E6%96%87%E7%9A%84%E7%9B%B8%E5%85%B3%E9%97%AE%E9%A2%98%EF%BC%8C%E8%AF%B7%E4%BD%A0%E4%BD%9C%E5%87%BA%E4%B8%93%E4%B8%9A%E7%9A%84%E5%9B%9E%E7%AD%94%EF%BC%8C%E4%B8%8D%E8%A6%81%E5%87%BA%E7%8E%B0%E7%AC%AC%E4%B8%80%E4%BA%BA%E7%A7%B0%EF%BC%8C%E5%BD%93%E6%B6%89%E5%8F%8A%E5%88%B0%E5%88%86%E7%82%B9%E5%9B%9E%E7%AD%94%E6%97%B6%EF%BC%8C%E9%BC%93%E5%8A%B1%E4%BD%A0%E4%BB%A5markdown%E6%A0%BC%E5%BC%8F%E8%BE%93%E5%87%BA%E3%80%82&send_immediately=true)
- **作者:** Zhisong Qiu, Kangqi Song 等
- **摘要要点:**
  - 提出 **Skill Manager** 用于对比式技能蒸馏，从无标注探索中发现可复用的程序性知识
  - 通过无监督验证器（Adaptive Checklist / Answer Agreement）提取信号
  - 报告型分析提升 9.71%，推理型分析提升 32.30%
  - 技能本质上是**过程性记忆**（procedural memory）的一种实现

**🔑 核心价值：** Skill Manager 可视为 Agent 的过程性记忆系统，将探索轨迹中的有效策略抽象为可复用的技能。

---

### 6. RedKnot: Efficient Long-Context LLM Serving with Head-Aware KV Reuse

- **arXiv ID:** 2606.06256
- **链接:** [https://arxiv.org/abs/2606.06256](https://arxiv.org/abs/2606.06256) [Kimi解读](http://kimi.com/_prefill_chat?prefill_prompt=%E6%88%91%E4%BB%AC%E8%A6%81%E8%AE%A8%E8%AE%BA%E7%9A%84%E8%AE%BA%E6%96%87%E6%98%AFhttps%3A%2F%2Farxiv.org%2Fabs%2F2606.06256%EF%BC%8C%E9%93%BE%E6%8E%A5%E6%98%AF+https%3A%2F%2Farxiv.org%2Fpdf%2F2606.06256+%EF%BC%8C%E5%B7%B2%E6%9C%89%E7%9A%84FAQ%E9%93%BE%E6%8E%A5%E6%98%AF+https%3A%2F%2Fpapers.cool%2Farxiv%2Fkimi%3Fpaper%3D2606.06256+%E3%80%82%E8%AF%B7%E4%BB%A5%E6%AD%A4%E4%B8%BA%E5%9F%BA%E7%A1%80%EF%BC%8C%E7%BB%A7%E7%BB%AD%E5%9B%9E%E7%AD%94%E6%88%91%E5%90%8E%E9%9D%A2%E7%9A%84%E9%97%AE%E9%A2%98%E3%80%82&system_prompt=%E4%BD%A0%E6%98%AF%E4%B8%80%E4%B8%AA%E5%AD%A6%E6%9C%AF%E5%8A%A9%E6%89%8B%EF%BC%8C%E5%90%8E%E9%9D%A2%E7%9A%84%E5%AF%B9%E8%AF%9D%E5%B0%86%E5%9B%B4%E7%BB%95%E7%9D%80%E4%BB%A5%E4%B8%8B%E8%AE%BA%E6%96%87%E5%86%85%E5%AE%B9%E8%BF%9B%E8%A1%8C%EF%BC%8C%E5%B7%B2%E7%BB%8F%E9%80%9A%E8%BF%87%E9%93%BE%E6%8E%A5%E7%BB%99%E5%87%BA%E4%BA%86%E8%AE%BA%E6%96%87%E7%9A%84PDF%E5%92%8C%E8%AE%BA%E6%96%87%E5%B7%B2%E6%9C%89%E7%9A%84FAQ%E3%80%82%E7%94%A8%E6%88%B7%E5%B0%86%E7%BB%A7%E7%BB%AD%E5%90%91%E4%BD%A0%E5%92%A8%E8%AF%A2%E8%AE%BA%E6%96%87%E7%9A%84%E7%9B%B8%E5%85%B3%E9%97%AE%E9%A2%98%EF%BC%8C%E8%AF%B7%E4%BD%A0%E4%BD%9C%E5%87%BA%E4%B8%93%E4%B8%9A%E7%9A%84%E5%9B%9E%E7%AD%94%EF%BC%8C%E4%B8%8D%E8%A6%81%E5%87%BA%E7%8E%B0%E7%AC%AC%E4%B8%80%E4%BA%BA%E7%A7%B0%EF%BC%8C%E5%BD%93%E6%B6%89%E5%8F%8A%E5%88%B0%E5%88%86%E7%82%B9%E5%9B%9E%E7%AD%94%E6%97%B6%EF%BC%8C%E9%BC%93%E5%8A%B1%E4%BD%A0%E4%BB%A5markdown%E6%A0%BC%E5%BC%8F%E8%BE%93%E5%87%BA%E3%80%82&send_immediately=true)
- **作者:** Yang Liu, ZhaoKai Luo 等
- **摘要要点:**
  - 按 KV head 分解 KV Cache，支持位置无关复用、前缀压缩、冷热分离
  - 将 KV Cache 从单一张量抽象转化为**结构化记忆对象**
  - 支持 GLM-4.7-Flash 上 4.7× 吞吐提升，229B 参数 MiniMax-M2.7 上 1.37×

**🔑 核心价值：** 虽然是基础设施层工作，但其"结构化 KV Cache"理念与 Agent 记忆系统的分层管理高度契合——为大规模 Agent 部署提供底层支撑。

---

## 🔬 研究趋势分析

### 热门方向

| 方向 | 论文数 | 说明 |
|------|--------|------|
| **记忆系统架构设计** | 3 | 从扁平检索到知识图谱、经验记忆、四轴分类法 |
| **长期会话管理** | 2 | TokenMizer、RedKnot 均关注长上下文场景 |
| **经验复用与自进化** | 2 | MLEvolve 的 Retrospective Memory、DataCOPE 的 Skill Manager |
| **记忆增强网络** | 1 | 在非 NLP 领域验证外部记忆的价值 |

### 趋势洞察

1. **从扁平文本到结构化记忆：** TokenMizer 的知识图谱方案和 RedKnot 的 head-aware KV Cache 都指向同一个趋势——Agent 记忆需要结构化表示，而非简单的文本拼接。
2. **记忆系统的工程化：** Agent Memory (2606.06448) 的系统级表征表明，研究社区正从"能不能做"转向"怎么做好"——关注成本、延迟、可扩展性。
3. **经验记忆的兴起：** MLEvolve 的 Retrospective Memory 和 DataCOPE 的 Skill Manager 都试图让 Agent 从过去的交互中学习，这是 episodic memory 在 LLM Agent 中的直接应用。
4. **写路径与读路径的权衡：** Agent Memory 论文揭示了一个关键设计维度——记忆系统的成本分布（构建 vs. 检索）深刻影响整体性能。

---

## 💡 关键创新点

1. **TokenMizer 的"保留理由"而非"保留事实"：** 传统记忆系统记住"做了什么"，TokenMizer 记住"为什么这样做"——这是从 episodic memory 到 reflective memory 的关键跃迁。

2. **Agent Memory 的四轴分类法：** 首次为 Agent 记忆系统建立统一的系统级分类框架，为后续研究和工程选型提供了共同语言。

3. **MLEvolve 的冷热记忆结合：** 冷启动领域知识 + 动态全局记忆的双层架构，类似于人类认知中的 semantic memory + episodic memory 的协同。

4. **DataCOPE 的无监督技能发现：** 不依赖标注，从探索轨迹中自动蒸馏可复用技能，降低了记忆构建的成本门槛。

---

## 🔗 与开源记忆项目的关联

基于之前分析的 19 个开源 Agent Memory 项目（LangChain、LlamaIndex、MemGPT、AutoGPT、CrewAI 等），今日论文提供了以下映射：

| 今日论文 | 相关开源项目 | 关联说明 |
|----------|-------------|----------|
| **Agent Memory (2606.06448)** | MemGPT, Letta | 系统级分析覆盖了 MemGPT 风格的分层记忆架构，10 条系统建议可直接指导 Letta 的优化 |
| **TokenMizer (2606.06337)** | LangChain (ConversationKGMemory) | LangChain 已有基于知识图谱的会话记忆，但 TokenMizer 的 14 节点/7 边类型 schema 更精细 |
| **MLEvolve (2606.06473)** | AutoGPT, CrewAI | AutoGPT 的长期记忆是最简单的向量检索；MLEvolve 的 Retrospective Memory 提供了更高级的经验复用范式 |
| **DataCOPE (2606.06416)** | LangChain (Skill 系列工具) | Skill Manager 的对比蒸馏思路可以增强 LangChain 的工具选择记忆 |
| **RedKnot (2606.06256)** | MemGPT/Letta 的上下文管理 | RedKnot 的结构化 KV Cache 可直接服务于 MemGPT 风格的分层记忆在推理时的效率优化 |
| **Memory-Augmented NN (2606.06311)** | 理论基础 | 为理解外部记忆模块的检索机制提供了非 NLP 领域的实证支持 |

### 关键差距

对比 19 个开源项目，今日论文揭示了几个社区尚未充分解决的问题：

1. **记忆的"为什么"：** 大多数开源项目存储"什么"，很少存储"为什么"。TokenMizer 提出了解决方案。
2. **写路径成本优化：** 开源项目普遍忽视记忆构建的计算成本。Agent Memory 论文给出了量化分析。
3. **舰队级记忆管理：** 多 Agent 协同场景下的记忆共享和一致性管理在开源项目中几乎空白。

---

## 📊 今日总结

| 指标 | 数值 |
|------|------|
| 扫描论文范围 | arXiv cs.AI (2026-06-04) |
| 总论文数 | ~24 篇 |
| Agent Memory 相关 | **5 篇**（核心）+ 1 篇（基础设施） |
| 最值得关注 | Agent Memory (2606.06448) — 首个系统级表征 |
| 最具创新性 | TokenMizer (2606.06337) — 知识图谱 + 理由保留 |

---

*本报告由 OpenClaw Agent Memory 日报系统自动生成。每日 18:00 更新。*
*追踪关键词：agent, memory, episodic, recall, retrieval, RAG, long-term, experience, session, context management*
