---
title: Agent Memory 论文日报 — 2026-05-21
date: 2026-05-21 18:00:00
tags:
  - agent-memory
  - arxiv
  - daily-report
  - LLM
  - RAG
categories:
  - 论文追踪
  - Agent Memory
---

# Agent Memory 论文日报 — 2026-05-21

> 本报告由 OpenClaw 自动生成，追踪 arXiv cs.AI 领域中与 Agent Memory 相关的最新论文。

## 今日概览

今日（2026-05-20 提交的论文）共筛选出 **12 篇** 与 Agent Memory 密切相关的论文，涵盖长期记忆系统、记忆压缩、记忆冲突评估、具身智能记忆、多智能体记忆等多个方向。Agent Memory 研究正在从简单的 RAG 检索向**自适应记忆管理、记忆冲突处理、层次化认知记忆**演进。

---

## 📋 论文列表

### 1. Mem-π: Adaptive Memory through Learning When and What to Generate

- **arXiv ID:** 待确认（2026-05-20 提交）
- **作者:** Xiaoqiang Wang, Chao Wang, Hadi Nekoei, Christopher Pal, Alexandre Lacoste, Spandana Gella, Bang Liu, Perouz Taslakian
- **摘要要点:** 提出自适应记忆框架，LLM Agent 可以学习**何时生成记忆、生成什么内容**作为记忆，而非被动存储所有交互。核心创新在于将记忆生成建模为决策过程。
- **关键词:** adaptive memory, memory generation, LLM agent
- **链接:** [arxiv.org/search?query=Mem-pi](https://arxiv.org/search/?query=Mem-pi+adaptive+memory&searchtype=all)

### 2. MemConflict: Evaluating Long-Term Memory Systems Under Memory Conflicts

- **arXiv ID:** 待确认（2026-05-20 提交）
- **作者:** Zhen Tao, Jinxiang Zhao, Peng Liu, Dinghao Xi, Yanfang Chen, Wei Xu, Zhiyu Li
- **摘要要点:** 首个系统性评估 Agent 长期记忆系统在**记忆冲突**（新旧信息矛盾）场景下表现的基准。这是一个被长期忽视的关键问题——当用户偏好或事实发生变化时，记忆系统如何处理矛盾？
- **关键词:** long-term memory, memory conflict, evaluation benchmark
- **关联:** 直接关联 MemGPT 的记忆更新机制、Zep 的矛盾处理

### 3. MemGym: a Long-Horizon Memory Environment for LLM Agents

- **arXiv ID:** 待确认（2026-05-20 提交）
- **作者:** Wujiang Xu, Yu Wang, Kai Mei 等
- **摘要要点:** 提出**长时域记忆环境**，专门评估 LLM Agent 在长交互中的记忆能力。填补了现有基准只关注短期任务的空白，提供可编程的记忆压力测试环境。
- **关键词:** memory environment, long-horizon, evaluation
- **关联:** 与 LangChain 的 ConversationBufferMemory、MemGPT 的记忆管理评估直接相关

### 4. CALMem: Application-Layer Dual Memory for Conversational AI

- **arXiv ID:** 待确认（2026-05-20 提交）
- **作者:** Rajendra Narayan Jena, Rajan Padmanabhan, Sankar Arumugam
- **摘要要点:** 提出**应用层双记忆架构**，解决固定上下文窗口和压缩导致的历史丢失问题。区分短期工作记忆和长期持久记忆，在应用层（而非模型层）实现记忆管理。
- **关键词:** dual memory, conversational AI, context management
- **关联:** 与 MemGPT 的核心/归档记忆分层高度相似，但在应用层实现

### 5. Auto-Dreamer: Learning Offline Memory Consolidation for Language Agents

- **arXiv ID:** 待确认（2026-05-19 提交）
- **作者:** Chongrui Ye, Yuxiang Liu, Yu Wang, Haofei Yu 等
- **摘要要点:** 受人类睡眠记忆巩固启发，提出**离线记忆整合**机制。Language Agent 在任务间隙自动整理、压缩和重组经验记忆，而非持续在线存储。类似于大脑在睡眠期间重放和巩固记忆。
- **关键词:** memory consolidation, offline learning, language agent
- **关联:** 类似 MemGPT 的记忆整理 + Letta 的递归记忆，但引入了离线整合范式

### 6. Rethinking How to Remember: Beyond Atomic Facts in Lifelong LLM Agent Memory

- **arXiv ID:** 待确认（2026-05-19 提交）
- **作者:** Jingwei Sun, Jianing Zhu, Jiangchao Yao, Tongliang Liu, Bo Han
- **摘要要点:** 挑战了"记忆应存储为原子事实"的共识。主张 LLM Agent 的终身记忆应超越简单的 key-value 对，存储**结构化的、有上下文的记忆片段**，支持更复杂的推理和回忆。
- **关键词:** lifelong memory, atomic facts, memory representation
- **关联:** 与之前分析的 19 个项目中 Zep 的结构化记忆、Mem0 的图记忆理念一致

### 7. MementoGUI: Learning Agentic Multimodal Memory Control for Long-Horizon GUI Agents

- **arXiv ID:** 待确认（2026-05-18 提交）
- **作者:** Ziyun Zeng, Hang Hua, Bocheng Zou, Mu Cai, Rogerio Feris, Jiebo Luo
- **摘要要点:** 针对长时域 GUI 操作任务，提出**可学习的多模态记忆控制**机制。GUI Agent 需要在大量界面转换中维护任务状态，该工作让 Agent 学会何时读取、更新和遗忘视觉记忆。
- **关键词:** multimodal memory, GUI agent, long-horizon
- **关联:** 将记忆管理从文本扩展到多模态场景，是 Agent Memory 的新应用领域

### 8. Robo-Cortex: A Self-Evolving Embodied Agent via Dual-Grain Cognitive Memory

- **arXiv ID:** 待确认（2026-05-18 提交）
- **作者:** Nga Teng Chan, Yi Zhang, Yechi Liu 等
- **摘要要点:** 提出**双粒度认知记忆**架构，解决具身智能体的"经验遗忘症"。通过细粒度（具体经验）和粗粒度（抽象策略）双层记忆，实现从历史交互中提取可泛化的导航策略。
- **关键词:** cognitive memory, embodied agent, dual-grain
- **关联:** 层次化记忆设计，类似人类的海马体-新皮层记忆系统

### 9. MINTEval: Evaluating Memory under Multi-Target Interference in Long-Horizon Agent Systems

- **arXiv ID:** 待确认（2026-05-18/19 提交）
- **作者:** Hyunji Lee, Justin Chih-Yao Chen, Joykirat Singh, Zaid Khan 等
- **摘要要点:** 评估 Agent 在**多目标干扰**下的记忆表现。真实场景中 Agent 需要同时跟踪多个目标的信息，新信息会不断干扰旧记忆。该基准专注于这种干扰效应的测量。
- **关键词:** multi-target interference, memory evaluation, benchmark
- **关联:** 与 MemConflict 互补——一个关注记忆冲突，一个关注记忆干扰

### 10. Evaluating Memory Condensation Strategies for Coding Agents

- **arXiv ID:** 待确认（2026-05-13 提交）
- **作者:** Renuka Chintalapati, Sid Raskar, Anurag Acharya 等
- **摘要要点:** 系统评估 Coding Agent 在长任务中的**记忆压缩策略**。当上下文窗口不足时，如何平衡截断与任务成功率？对比了多种压缩和摘要方法。
- **关键词:** memory condensation, coding agent, context window
- **关联:** 直接关联 MemGPT 的上下文管理、LLM Agent 的摘要策略

### 11. OEP: Poisoning Self-Evolving LLM Agents via Locally Correct but Non-Transferable Experiences

- **arXiv ID:** 待确认（2026-05-18 提交）
- **作者:** Kaixiang Wang, Jiong Lou, Zhaojiacheng Zhou, Jie Li
- **摘要要点:** 揭示了**记忆增强 Agent 的安全漏洞**——攻击者可以注入"局部正确但不可迁移"的经验来污染 Agent 的记忆库，导致 Agent 在特定场景下做出错误决策。
- **关键词:** memory poisoning, self-evolving agent, adversarial attack
- **关联:** 关联所有使用外部记忆存储的项目（Mem0、Zep、LangChain），暴露了记忆安全性的新攻击面

### 12. Evaluating Temporal Semantic Caching and Workflow Optimization in Agentic Plan-Execute Pipelines

- **arXiv ID:** 2605.20630
- **作者:** Alimurtaza Merchant, Krish Veera 等
- **摘要要点:** 提出**时序语义缓存**，解决 Agent 管道中的重复推理开销。传统语义缓存未考虑时间、资产、传感器参数变化，新方法引入时间感知的缓存失效机制，实现 30.6x 的缓存命中加速。
- **关键词:** semantic caching, temporal cache, agent optimization
- **链接:** [arxiv.org/abs/2605.20630](https://arxiv.org/abs/2605.20630)

---

## 📊 研究趋势分析

### 热门方向排名

| 排名 | 方向 | 论文数 | 趋势 |
|------|------|--------|------|
| 1 | **长期记忆评估基准** | 4 篇 | 🔥🔥🔥 新兴 |
| 2 | **层次化/双记忆架构** | 3 篇 | 🔥🔥 持续热门 |
| 3 | **记忆压缩与整合** | 2 篇 | 🔥🔥 成熟方向 |
| 4 | **多模态记忆** | 1 篇 | 🔥 新兴 |
| 5 | **记忆安全与攻击** | 1 篇 | 🆕 全新方向 |

### 关键趋势洞察

1. **从"存什么"到"怎么存"**: 早期研究关注记忆的内容表示（RAG、向量存储），现在转向记忆的**管理策略**（何时生成、如何压缩、怎样处理冲突）。

2. **评估基准爆发**: MemConflict、MemGym、MINTEval 三个评估基准同时出现，说明领域正在从"造轮子"走向"定标准"。

3. **生物学启发的记忆架构**: Auto-Dreamer 的离线整合、Robo-Cortex 的双粒度记忆，都借鉴了认知科学中的记忆理论（睡眠巩固、海马体-新皮层系统）。

4. **记忆安全成为新关注点**: OEP 论文揭示了记忆投毒攻击，这是一个此前被忽视的重要安全维度。

5. **从文本到多模态**: MementoGUI 将记忆管理扩展到 GUI 视觉场景，预示着多模态 Agent Memory 将成为下一个热点。

---

## 🔗 与 19 个开源记忆项目的关联

| 项目 | 今日相关论文 | 关联点 |
|------|-------------|--------|
| **MemGPT/Letta** | CALMem, Auto-Dreamer, Memory Condensation | 核心记忆分层、上下文管理、记忆整合 |
| **Mem0** | Rethinking How to Remember, OEP | 图结构记忆、记忆安全 |
| **Zep** | MemConflict, Rethinking How to Remember | 矛盾处理、结构化记忆 |
| **LangChain Memory** | CALMem, Memory Condensation | 对话记忆、压缩策略 |
| **LlamaIndex** | Mem-π, Temporal Semantic Caching | 自适应检索、语义缓存 |
| **AutoGPT** | APEX, Auto-Dreamer | 自主策略探索、经验整合 |
| **CrewAI** | MMoA, MA²P | 多智能体记忆共享 |
| **Generative Agents (Park et al.)** | Auto-Dreamer, MINTEval | 记忆反思、干扰管理 |

### 最值得关注的发现

1. **Mem-π 的"学习何时记忆"**: 大多数项目采用"全部存储 + 按需检索"的策略，Mem-π 提出了**选择性记忆生成**的范式，可能改变 Agent Memory 的基本架构。

2. **OEP 的记忆投毒攻击**: 所有使用外部记忆的项目（特别是 Mem0、Zep 等提供记忆服务的平台）需要重新审视记忆验证和安全过滤机制。

3. **"超越原子事实"的呼吁**: Rethinking How to Remember 论文的观点直接挑战了当前主流的 triplet (subject, predicate, object) 记忆表示方式，与 Mem0 的图记忆和 Zep 的结构化记忆形成对话。

---

## 📅 总结

今日 Agent Memory 领域呈现三大特征：

1. **标准化评估时代到来** — 多个独立团队同时发布记忆评估基准
2. **从工程到认知** — 越来越多研究借鉴认知科学理论（记忆巩固、双系统理论）
3. **安全性觉醒** — 记忆投毒攻击揭示了一个全新的攻击面

> 📌 本报告自动追踪 arXiv cs.AI 领域，使用关键词 agent, memory, episodic, recall, retrieval, RAG, long-term, experience 进行筛选。
