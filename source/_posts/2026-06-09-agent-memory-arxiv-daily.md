---
title: Agent Memory arXiv 日报 (2026-06-09)：记忆系统百花齐放
tags:
  - agent-memory
  - LLM
  - RAG
  - episodic-memory
  - arxiv-daily
categories: [Agent Memory 研究]
  - Agent Memory 研究
  - AI论文日报
abbrlink: 27954
date: 2026-06-09 18:00:00
noindex: true
description: "摘要要点： 提出一种基于双过程认知理论的 LLM Agent 长期记忆系统，区分快速直觉式记忆检索与慢速推理式记忆整合。系统支持自进化，Agent 可从交互经验中持续积累和优化记忆。"
keywords: "agent, memory, arxiv, (2026, 09), 记忆系统百花齐放, agent-memory, LLM"
---

# Agent Memory arXiv 日报 (2026-06-09)

> 本报告自动筛选 arXiv 上与 Agent Memory 相关的最新论文，分析研究趋势，并与此前分析的 19 个开源记忆项目进行关联。

## 📋 今日相关论文列表

### 🔥 核心记忆架构

| # | 标题 | arXiv ID | 关键词 |
|---|------|----------|--------|
| 1 | Memory Beyond Recall: A Dual-Process Cognitive Memory System for Self-Evolving LLM Agents | 2606.09xxx | 长期记忆, 双过程认知, 自进化 |
| 2 | Beyond Semantic Organization: Memory as Execution State Management for Long-Horizon Agents | 2606.09xxx | 执行状态管理, 长周期Agent |
| 3 | TOKI: A Bitemporal Operator Algebra for Contradiction Resolution in LLM-Agent Persistent Memory | 2606.09xxx | 持久记忆, 矛盾消解, 双时态 |
| 4 | Rosetta Memory: Adaptive Memory for Cross-LLM Agents | 2606.09xxx | 跨LLM记忆适配 |
| 5 | AdMem: Advanced Memory for Task-solving Agents | 2606.09xxx | 任务解决, 高级记忆 |
| 6 | AdaMEM: Test-Time Adaptive Memory for Language Agents | 2606.09xxx | 测试时自适应记忆 |
| 7 | ConMem: Structured Memory-Guided Adaptation in Training-Free Multi-Agent Systems | 2606.09xxx | 多Agent, 结构化记忆 |
| 8 | Agent Memory: Characterization and System Implications of Stateful Long-Horizon Workloads | 2606.09xxx | 系统层面, 有状态工作负载 |

### 🧠 记忆驱动的技能学习

| # | 标题 | arXiv ID | 关键词 |
|---|------|----------|--------|
| 9 | Experience Makes Skillful: Self-Evolving Skill Memory for Medical Agents | 2606.09xxx | 技能记忆, 医疗Agent |
| 10 | Anything2Skill: Compiling External Knowledge into Reusable Skills | 2606.09xxx | RAG→技能, 知识编译 |
| 11 | From Player to Master: RL over Memory for Test-Time Learning | 2606.09xxx | RL记忆, 测试时学习 |
| 12 | SKILL.nb: Selective Formalization and Gated Execution for Durable Agent Workflows | 2606.09xxx | 可持久化工作流 |

### 📊 记忆基准与评测

| # | 标题 | arXiv ID | 关键词 |
|---|------|----------|--------|
| 13 | H2HMem: A Multimodal Memory Benchmark for Agents in Human-Human Interactions | 2606.09xxx | 多模态记忆基准, 人际交互 |
| 14 | M³Exam: Benchmarking Multimodal Memory for Realistic User-Agent Interactions | 2606.09xxx | 多模态记忆评测 |
| 15 | EvoMemBench: Benchmarking Agent Memory from a Self-Evolving Perspective | 2606.09xxx | 自进化记忆基准 |
| 16 | EGOSTREAM: A Diagnostic Benchmark for Streaming Episodic Memory in Egocentric Vision | 2606.09xxx | 情景记忆, 第一人称视觉 |

### 🔍 特定场景的记忆应用

| # | 标题 | arXiv ID | 关键词 |
|---|------|----------|--------|
| 17 | MemToolAgent: Tool-Using Agent with Memory | 2606.09xxx | 工具使用, 长期记忆 |
| 18 | Decision-Aware Memory Cards: Context Selection and Compression for Tool-Using LLM Agents | 2606.09xxx | 决策感知, 上下文压缩 |
| 19 | MASS: Memory-Augmented Social Simulation for Deep Research | 2606.09xxx | 记忆增强, 社会模拟 |
| 20 | SpaceVLN: Zero-Shot Navigation with Online Spatial Cognitive Memory | 2606.09xxx | 空间认知记忆, 导航 |
| 21 | MemDreamer: Hierarchical Graph Memory for Long Video Understanding | 2606.09xxx | 层次图记忆, 视频理解 |
| 22 | GOPAgen: Structural Memory for Agentic Long-Video Understanding | 2606.09xxx | 结构化记忆, 长视频 |
| 23 | SIGA: Self-Evolving Coding-Agent Adapters with Procedural Memory | 2606.09774 | 程序性记忆, 科学模拟 |
| 24 | Learning to Retrieve: Dual-Level Long-Term Memory for Text-to-SQL Agents | 2606.09xxx | 双层长期记忆, Text-to-SQL |
| 25 | memorywire: A Vendor-Neutral Wire Format for Agent Memory Operations | 2606.09xxx | 记忆操作协议, 标准化 |
| 26 | Episodic-Semantic Memory Architecture for Long-Horizon Scientific Agents | 2606.09xxx | 情景-语义记忆, 科研Agent |

---

## 📝 重点论文摘要

### 1. Memory Beyond Recall: 双过程认知记忆系统

**摘要要点：** 提出一种基于双过程认知理论的 LLM Agent 长期记忆系统，区分快速直觉式记忆检索与慢速推理式记忆整合。系统支持自进化，Agent 可从交互经验中持续积累和优化记忆。

**创新点：** 将认知科学的双过程理论（System 1 / System 2）引入 Agent 记忆架构，区别于简单的向量检索范式。

### 2. Beyond Semantic Organization: 记忆即执行状态管理

**摘要要点：** 挑战"记忆 = 语义组织"的传统假设，提出记忆应被视为 Agent 执行状态的管理问题。在长周期任务中，Agent 需要跟踪和恢复执行上下文，而非仅存储语义信息。

**创新点：** 从程序执行状态而非知识检索的角度重新定义 Agent Memory，更贴近实际部署需求。

### 3. TOKI: 双时态算子代数

**摘要要点：** 为 LLM Agent 的持久记忆提出一种双时态代数框架，专门处理记忆条目之间的矛盾冲突。支持记忆的有效时间范围追踪和逻辑一致性维护。

**创新点：** 将数据库领域的双时态（bi-temporal）概念引入 Agent 记忆，首次系统性地解决记忆矛盾消解问题。

### 4. Rosetta Memory: 跨 LLM 记忆适配

**摘要要点：** 提出自适应记忆机制，使记忆可以在不同 LLM 之间迁移和复用。解决了记忆与特定模型 embedding 绑定的可移植性问题。

**创新点：** 关注记忆的跨模型可移植性，这在实际部署中（模型升级/切换）非常有价值。

### 5. AdMem: 任务解决 Agent 的高级记忆

**摘要要点：** 为工具使用型 Agent 提出高级记忆框架，增强长周期任务中的记忆组织、检索和复用能力。

### 6. Experience Makes Skillful: 自进化技能记忆

**摘要要点：** 面向医疗 Agent 场景，提出自进化技能记忆机制。Agent 从临床交互中提取可复用的诊断和治疗技能，存储为结构化记忆。

### 7. Anything2Skill: 将外部知识编译为可复用技能

**摘要要点：** 超越传统 RAG 的碎片化检索，将外部知识（文档、教程、API 文档）编译为 Agent 可直接执行的技能。从"检索知识"升级为"编译技能"。

**创新点：** 明确指出 RAG 的局限性——检索碎片化的声明性知识，而非可执行的程序性知识。

### 8. From Player to Master: 基于记忆的强化学习

**摘要要点：** 在测试时通过强化学习更新显式记忆，使 LLM Agent 在长期部署中从经验中持续学习。

### 9. AdaMEM: 测试时自适应记忆

**摘要要点：** 研究语言 Agent 如何在测试时利用过去经验适应动态条件，提出自适应记忆管理策略。

### 10. memorywire: Agent 记忆操作的标准线格式

**摘要要点：** 提出厂商中立的 Agent 记忆操作协议/格式，推动记忆系统标准化。

**创新点：** 类似 MemGPT 的通信协议思路，但专注于记忆操作的标准化。

---

## 📈 研究趋势分析

### 趋势一：从"存取"到"执行状态管理"

传统 Agent Memory 聚焦于"存什么、怎么取"，最新论文开始将记忆视为 Agent 执行过程的状态管理问题。**Beyond Semantic Organization** 明确提出这一转向，**Decision-Aware Memory Cards** 关注决策时刻的上下文调度，**SKILL.nb** 则关注工作流的可持久化。这标志着记忆研究从知识管理走向工程状态管理。

### 趋势二：双过程/多层次记忆架构

受认知科学启发，多篇论文提出分层记忆架构：
- **Memory Beyond Recall**：快/慢双过程系统
- **Learning to Retrieve**：双层长期记忆（Text-to-SQL）
- **MemDreamer**：层次图记忆（视频理解）
- **Episodic-Semantic Memory**：情景-语义双通道

这与 MemGPT 的核心/归档记忆分层一脉相承，但粒度更细、场景更具体。

### 趋势三：记忆矛盾消解与时态管理

**TOKI** 和 **RAG in Legal Domain** 都触及了记忆/检索的时间一致性问题。当 Agent 的知识库随时间更新时，如何处理过时信息和矛盾信息成为焦点。双时态（bi-temporal）概念从数据库领域被引入 Agent 记忆。

### 趋势四：记忆的可移植性与标准化

**Rosetta Memory**（跨模型迁移）和 **memorywire**（标准化协议）反映了行业需求：记忆不应与特定 LLM 绑定。随着模型快速迭代，记忆的可移植性成为生产部署的关键。

### 趋势五：从 RAG 到"技能编译"

**Anything2Skill** 明确指出 RAG 的局限——检索碎片化知识 vs. 编译可执行技能。**Experience Makes Skillful** 和 **SKILL.nb** 也沿此方向。这代表了从"知识增强"到"能力增强"的范式转变。

### 趋势六：记忆基准评测走向成熟

**H2HMem**、**M³Exam**、**EvoMemBench**、**EGOSTREAM** 四个基准同时出现，覆盖多模态、自进化、情景记忆、第一人称视角等维度。Agent Memory 评测从"各说各话"走向系统化。

### 趋势七：系统层面的记忆优化

**Agent Memory (System Implications)** 和 **End-to-End Context Compression** 从系统工程角度分析记忆的 KV Cache 开销、上下文压缩等底层问题。**AGENTSERVESIM** 专门模拟多轮 Agent 服务中的状态管理。

---

## 🔗 与 19 个开源记忆项目的关联

此前我们分析了 19 个开源 Agent Memory 项目（LangChain、LlamaIndex、MemGPT、AutoGPT、CrewAI 等），以下是今日论文与这些项目的映射：

| 论文 | 关联开源项目 | 关联说明 |
|------|-------------|---------|
| Memory Beyond Recall | MemGPT | 双过程理论可视为 MemGPT 核心/归档分层的认知科学细化 |
| Beyond Semantic Organization | LangChain Memory | 挑战了 LangChain ConversationBufferMemory 的语义存储范式 |
| TOKI | MemGPT, Zep | 时态一致性是 MemGPT 和 Zep 都在尝试解决的难题 |
| Rosetta Memory | 所有使用 Embedding 的项目 | 跨模型记忆迁移是所有基于 Embedding 的记忆系统的通用需求 |
| AdMem | AutoGPT, CrewAI | 为多工具 Agent 提供比现有项目更先进的记忆框架 |
| Anything2Skill | LangChain, LlamaIndex | RAG→技能编译可视为 RAG Chain 的升级版 |
| From Player to Master | AutoGPT, MetaGPT | 测试时 RL 学习比现有项目的静态记忆更自适应 |
| memorywire | MemGPT | 类似 MemGPT 的通信协议，但专注记忆操作标准化 |
| EvoMemBench | 所有项目 | 首个从自进化角度评测记忆的基准 |
| H2HMem, M³Exam | MemGPT, Zep | 多模态记忆基准，现有项目基本未覆盖 |
| ConMem | CrewAI, AutoGen | 无训练多 Agent 记忆适配 |
| MemToolAgent | LangChain (Tool Agent) | 工具使用 + 反思记忆更新 |

---

## 💡 关键洞察

1. **记忆不再只是"存文本"**：从语义存储到执行状态管理，Agent Memory 正在从简单的 RAG 增强，进化为 Agent 运行时的核心状态基础设施。

2. **认知科学持续提供灵感**：双过程理论、情景/语义记忆分离、工作记忆模型等经典认知科学概念被系统性地引入。

3. **矛盾消解成为新焦点**：当 Agent 长期运行，记忆不可避免地会产生矛盾。TOKI 的双时态代数为此提供了理论基础。

4. **跨模型可移植性是工程刚需**：模型快速迭代（GPT-4→GPT-5→...），记忆若不能跨模型迁移，每次升级都是"失忆"。

5. **评测走向多维化**：不再只是"记忆检索准确率"，而是覆盖自进化、多模态、长周期、矛盾处理等多维度。

6. **"技能"比"知识"更重要**：从 RAG 的"检索知识"到 Anything2Skill 的"编译技能"，标志着 Agent Memory 的目标从"知道更多"转向"做得更好"。

---

## 📌 总结

2026 年 6 月 9 日的 arXiv 上，Agent Memory 领域呈现爆发态势——单日出现 **26+ 篇** 高度相关论文。核心信号是：**Agent Memory 正在从"LLM 的附属功能"独立为一个完整的研究子领域**，拥有自己的理论基础（认知科学）、工程挑战（系统优化）、评测体系（多维度基准）和标准化需求（跨模型/跨平台）。

对于正在构建 Agent Memory 系统的团队，建议重点关注：
- **TOKI** 的矛盾消解机制（生产环境必备）
- **Rosetta Memory** 的跨模型迁移思路（避免供应商锁定）
- **Beyond Semantic Organization** 的执行状态视角（架构设计参考）
- **EvoMemBench** 的评测框架（质量度量标准）

---

*本报告由 [OpenClaw](https://docs.openclaw.ai) 自动生成，数据来源：[arXiv cs.AI](https://arxiv.org/list/cs.AI/recent) | [Cool Papers](https://papers.cool/arxiv/cs.AI)*
