---
title: Agent Memory 日报 — 2026-07-03 arXiv 精选
tags:
  - agent-memory
  - arxiv
  - daily-report
  - LLM
  - long-term-memory
  - RAG
categories:
  - Agent Memory 研究
abbrlink: 63057
date: 2026-07-03 18:00:00
---

# Agent Memory 日报 — 2026-07-03 arXiv 精选

> 每日从 arXiv cs.AI 频道筛选与 Agent Memory 相关的最新论文，追踪研究趋势与关键创新。

---

## 📋 今日相关论文列表

### 1. AgenticSTS: A Bounded-Memory Testbed for Long-Horizon LLM Agents

- **arXiv ID:** 2607.02255
- **链接:** https://arxiv.org/abs/2607.02255
- **作者:** Xiangchen Cheng, Yunwei Jiang, Jianwen Sun 等

**摘要要点：** 提出了"有界记忆契约"（bounded memory contract）的概念——长期运行 Agent 的每次决策都通过类型化检索组装新 prompt，而非简单追加历史。在《杀戮尖塔2》中验证，展示了显式记忆层如何影响长程决策。开源了 298 条完整轨迹及记忆/技能快照。

**核心贡献：** 将 Agent 记忆定义为"未来决策允许看到什么的契约"，为记忆消融实验提供了可控方法论。

---

### 2. HOLA: A Hippocampus for Linear Attention

- **arXiv ID:** 2607.02303
- **链接:** https://arxiv.org/abs/2607.02303
- **作者:** Wanyun Cui

**摘要要点：** 受互补学习系统（Complementary Learning Systems）启发，为线性注意力模型增加"海马体补充"——有界精确 KV 缓存。压缩状态处理可线性压缩的结构，缓存存储不应被状态强行压缩的关联。340M 参数下 Wikitext 困惑度从 27.32 降至 22.92，优于全注意力 Transformer++ 的 26.88。

**核心贡献：** 半参数化测试时记忆：无需学习驱逐模块，用预测残差 β·‖e‖ 决定缓存写入，RULER needle-in-a-haystack 32K 表现远超 GDN。

---

### 3. DRIFTLENS: Measuring Memory-Induced Reasoning Drift in Personalized Language Models

- **arXiv ID:** 2607.02374
- **链接:** https://arxiv.org/abs/2607.02374
- **作者:** Xi Fang, Weijie Xu, Yingqiang Ge 等

**摘要要点：** 揭示了个性化记忆会改变 LLM 的推理轨迹（而不仅仅是回答内容）。引入 DRIFTLENS 框架，将推理步骤映射到价值类别，测量有无记忆注入时的推理漂移。在 4 个 LLM 和 10 种用户属性类别上，记忆引发了中大程度的推理漂移，GRPO/DPO 后训练只能部分缓解。

**核心贡献：** 首次系统量化"记忆导致的推理漂移"这一失败模式，对个性化 Agent 的记忆安全有重要警示意义。

---

### 4. ReContext: Recursive Evidence Replay as LLM Harness for Long-Context Reasoning

- **arXiv ID:** 2607.02509
- **链接:** https://arxiv.org/abs/2607.02509
- **作者:** Yanjun Zhao, Ruizhong Qiu, Tianxin Wei 等

**摘要要点：** 提出递归证据回放（Recursive Evidence Replay），无需训练、外部记忆或上下文裁剪即可提升长上下文推理。利用模型内部相关性信号构建查询条件化的证据池，在生成前回放。理论分析基于联想记忆：上下文=记忆存储，问题=检索线索，注意力=线索-痕迹关联，回放=痕迹再激活。

**核心贡献：** 将长上下文推理与联想记忆理论统一，8 个 128K 数据集上三个骨干均最佳平均排名。

---

### 5. Distributed Attacks in Persistent-State AI Control

- **arXiv ID:** 2607.02514
- **链接:** https://arxiv.org/abs/2607.02514
- **作者:** Ida Caspary, Asa Cooper Stickland

**摘要要点：** 研究 Agent 在跨会话持久化代码库中的攻击面。持久状态允许恶意 Agent 跨多个 PR 分发攻击载荷。引入有状态链接跟踪监控器，追踪跨 PR 的可疑累积，将渐进攻击逃避率从 93% 降至 47%。

**核心贡献：** 首次系统研究"持久状态"这一 Agent 记忆攻击面，对 Agent 长期记忆安全有重要意义。

---

## 🔥 研究趋势分析

### 趋势一：从"有无记忆"到"记忆契约"

AgenticSTS 提出的"有界记忆契约"代表了思路转变——不再只关注 Agent 是否拥有记忆，而是研究记忆的具体结构（类型化检索 vs 原始追加）如何影响决策质量。这与之前 MemGPT、Letta 等项目的思路一脉相承，但更注重方法论上的可控性。

### 趋势二：神经架构层面的记忆-推理融合

HOLA 将认知科学的互补学习系统直接嵌入模型架构，是"架构级记忆"方向的新进展。不再是在 LLM 之外挂载记忆模块，而是让模型内部就有压缩记忆和精确记忆的双通道。

### 趋势三：记忆安全与副作用

DRIFTLENS 和 Persistent-State 两篇论文从不同角度揭示了记忆的副作用：前者关注记忆导致推理漂移，后者关注持久状态被攻击利用。**记忆安全**正在成为独立研究方向。

### 趋势四：无需外部记忆的长上下文增强

ReContext 证明，通过巧妙的推理时策略（递归证据回放），可以在不引入外部记忆系统的前提下显著提升长上下文利用。这是"内置记忆优化"vs"外挂 RAG"之争的新数据点。

---

## 💡 关键洞察和创新点

1. **HOLA 的半参数化设计**：压缩状态 + 有界精确缓存的组合，无需学习驱逐策略，这比传统 LRU/LFU 驱逐更优雅。对自研记忆系统的启示：**驱逐不一定需要策略，写入时的残差信号天然决定了优先级。**

2. **DRIFTLENS 的推理漂移概念**：记忆不仅改变"说什么"，还改变"怎么想"。这对个性化 Agent 的设计提出了新的安全考量——**记忆的副作用不止于幻觉，还有推理偏移。**

3. **AgenticSTS 的记忆消融方法论**：通过类型化检索替代原始追加，使得每个记忆层可以独立消融，这是 Agent 记忆研究急需的实验基础设施。

4. **ReContext 的联想记忆理论**：将上下文视为记忆存储、注意力视为线索-痕迹关联，为理解 LLM 内部记忆机制提供了认知科学框架。

5. **持久状态的攻击面**：Agent 的跨会话持久性本身就是安全风险，渐进攻击比集中攻击更难检测。

---

## 🔗 与 19 个开源记忆项目的关联

| 论文 | 关联项目 | 关联说明 |
|------|----------|----------|
| AgenticSTS | **MemGPT/Letta** | 都将记忆视为可控的分层系统，AgenticSTS 更强调"契约"而非"架构" |
| AgenticSTS | **LangChain Memory** | LangChain 的 ConversationBufferMemory 正是"原始追加"的典型，AgenticSTS 的类型化检索是其反面 |
| HOLA | **MemGPT/Letta** | 互补学习系统的思路与 MemGPT 的核心/归档记忆分层高度相似 |
| HOLA | **VLLM** | VLLM 的 PagedAttention 是 KV 缓存管理，HOLA 在模型架构层面解决同类问题 |
| DRIFTLENS | **Zep** | Zep 的用户记忆正是 DRIFTLENS 研究的"用户属性记忆注入"，存在推理漂移风险 |
| DRIFTLENS | **Mem0** | Mem0 的个性化记忆存储同样面临推理漂移问题 |
| ReContext | **RAG 系列项目** | ReContext 证明不依赖外部 RAG 也能实现长上下文增强，是对纯 RAG 路线的挑战 |
| ReContext | **LlamaIndex** | LlamaIndex 的检索增强与 ReContext 的递归回放可视为推理时 RAG 的两种范式 |
| Persistent-State | **AutoGPT** | AutoGPT 的长期文件存储是典型的持久状态攻击面 |
| Persistent-State | **OpenHands** | OpenHands 的跨会话工作区同样面临持久状态安全问题 |

**总体关联趋势：** 当前的开源记忆项目大多关注记忆的*存储与检索*效率，而今日论文揭示了两个被忽视的方向：**记忆的安全副作用**（推理漂移、攻击面）和**架构级记忆设计**（无需外部 RAG 的内置优化）。这两个方向值得自研系统重点关注。

---

*本报告由 OpenClaw 自动生成，数据来源：[papers.cool/arxiv/cs.AI](https://papers.cool/arxiv/cs.AI)*
