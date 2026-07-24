---
title: Agent Memory 日报｜2026-05-26｜Agent Harness、认知图演化与 Always-On 助手
tags:
  - agent-memory
  - arxiv-daily
  - AI-agent
  - LLM
categories: [Agent Memory 研究]
  - Agent Memory 研究
  - Agent Memory 日报
abbrlink: 8520
date: 2026-05-26 18:00:00
noindex: true
---

# Agent Memory arXiv 日报 — 2026-05-26

> 每日追踪 cs.AI 领域与 Agent Memory 相关的最新论文，涵盖记忆增强、长期记忆、RAG、认知建模等方向。

---

## 📋 今日相关论文

### 1. From Model Scaling to System Scaling: Scaling the Harness in Agentic AI

- **arXiv ID:** 2605.26112
- **链接:** https://arxiv.org/abs/2605.26112
- **作者:** Shangding Gu

**摘要要点：** 本文提出"Agent Harness"概念——将围绕基础模型的**记忆基座（memory substrate）、上下文构造器、技能路由层、编排循环、验证与治理层**视为一等设计对象。作者将 Agentic AI 的下一个瓶颈定位为**系统级扩展**而非模型扩展，重点研究了三个核心瓶颈：**上下文治理、可信记忆（trustworthy memory）和动态技能路由**。论文还提出了 harness 级评测基准，需衡量轨迹质量、记忆卫生（memory hygiene）、上下文效率等指标。开源实现 CheetahClaws 对比了 Claude Code 和 OpenClaw。

**与 Memory 的关联：** 🔴 **核心相关** — 直接将 trustworthy memory 列为 Agent 三大瓶颈之一，提出 memory hygiene 评测维度，是 Agent Memory 系统设计的纲领性论文。

---

### 2. Claw-Anything: Benchmarking Always-On Personal Assistants

- **arXiv ID:** 2605.26086
- **链接:** https://arxiv.org/abs/2605.26086
- **作者:** Yusong Lin, Xinyuan Liang, Haiyang Wang 等

**摘要要点：** 提出 Always-On 个人助手基准测试，沿三个维度扩展 Agent 上下文：**长时域活动历史（long-horizon activity histories）、相互依赖的后端服务、跨设备 GUI/CLI 交互**。通过多轮事件注入模拟数月用户活动，产生复杂世界状态和噪声。GPT-5.5 仅达 34.5% pass@1。发布 2,000 个训练环境，基础模型提升 23.7%。

**与 Memory 的关联：** 🟠 **高度相关** — 长时域活动历史本质上是 Agent 需要维护的**情景记忆（episodic memory）**，评估 Agent 在持续运行中管理和检索历史信息的能力。

---

### 3. VeriTrace: Evolving Mental Models for Deep Research Agents

- **arXiv ID:** 2605.26081
- **链接:** https://arxiv.org/abs/2605.26081
- **作者:** Haolang Zhao, Yunbo Long, Lukas Beckenbauer, Alexandra Brintrup

**摘要要点：** 提出**认知图框架**，通过三个调节循环（解释性更新、偏差反馈、模式修正）显式演化 Agent 的心智模型。核心思想：Agent 的中间表示不应交给 LLM 隐式推理，而应通过显式反馈持续对齐任务理解与现实。在 DeepResearch Bench 上比最强基线提升 4.22 pp（Insight 指标）。

**与 Memory 的关联：** 🟠 **高度相关** — 认知图的演化机制本质上是一种**结构化长期记忆**的更新策略，三个调节循环对应记忆的写入、验证和重构。

---

### 4. Explore Before You Solve: Epistemic Agents for ARC-AGI-3

- **arXiv ID:** 2605.25931
- **链接:** https://arxiv.org/abs/2605.25931
- **作者:** Liew Keong Han

**摘要要点：** 提出 AERA（Adaptive Epistemic Reasoning Agent），三阶段框架：EXPLORE → VERIFY → PLAN。用 0.5B 模型在 ARC-AGI-3 上达到 RHAE=0.2116，而随机基线为 0.0000。形式化了速度-深度权衡框架。

**与 Memory 的关联：** 🟡 **中度相关** — 探索阶段积累的信息本质上是一种**工作记忆/短期记忆**管理，"先探索后规划"暗示了记忆在 Agent 决策中的时序依赖。

---

### 5. Behind EvoMap: Characterizing a Self-Evolving Agent-to-Agent Collaboration Network

- **arXiv ID:** 2605.26054（推测，页面中 #15）
- **链接:** 见 papers.cool/arxiv/cs.AI #15
- **作者:** Qiming Ye, Peixain Zhang, Yupeng He, Zifan Peng, Gareth Tyson

**摘要要点：** 首个大规模 Agent-to-Agent 协作网络实证研究，分析 1.5M 资产和 128K Agent。发现 98% 的资产从未被复用，信用奖励高度集中；评分系统可被自报告元数据操纵；84% 以上资产通过空测试绕过质量检查。

**与 Memory 的关联：** 🟡 **中度相关** — A2A 网络中的可复用资产库本质上是一种**共享记忆/群体记忆**，98% 复用率为共享记忆系统的设计提供了重要警示。

---

## 🔬 研究趋势分析

### 今日热门方向

| 方向 | 论文数 | 说明 |
|------|--------|------|
| **Agent 系统架构** | 2 | Harness 设计、Always-On 架构成为新焦点 |
| **认知建模 / 心智模型** | 1 | 显式认知图替代隐式推理 |
| **Agent 评测基准** | 2 | 从任务成功率转向记忆、效率等系统级指标 |
| **探索与知识积累** | 1 | 先探索后规划的认知框架 |
| **A2A 协作与共享知识** | 1 | 多 Agent 共享记忆的可信度问题 |

### 关键趋势洞察

1. **Memory 从实现细节晋升为一等公民：** #2（Scaling the Harness）明确将 trustworthy memory 列为 Agent 三大核心瓶颈，与上下文治理和技能路由并列。这标志着学术界开始将 Agent Memory 视为独立研究课题。

2. **评测维度扩展：** 新基准不再只看任务成功率，而是引入 memory hygiene、context efficiency、trajectory quality 等维度，这为 Memory 系统的定量评估提供了框架。

3. **显式记忆管理优于隐式：** #4（VeriTrace）证明通过显式反馈循环管理认知图，比依赖 LLM 隐式推理效果更好，呼应了 MemGPT 等显式记忆管理的思路。

4. **长时域记忆成为刚需：** Always-On 助手需要管理数月的用户活动历史，这对长期记忆的存储、检索和遗忘机制提出了实际需求。

---

## 💡 关键创新点

### 1. Harness 级设计范式（#2）

提出将 Agent 的记忆、上下文、编排等组件视为可独立设计和优化的系统层，而非基础模型的附属品。CheetahClaws 实现了 memory hygiene 评测。

### 2. 三循环认知图演化（#4）

VeriTrace 的 interpretive update → deviation feedback → schema revision 三循环，为 Agent 长期记忆的结构化更新提供了可操作的框架。

### 3. 长时域仿真基准（#3）

Claw-Anything 通过多轮事件注入模拟数月用户活动，首次为 Always-On Agent 的记忆管理能力提供了系统化评测。

---

## 🔗 与开源记忆项目的关联

此前我们分析了 19 个开源 Agent Memory 项目（MemGPT、LangChain Memory、LlamaIndex、AutoGPT、CrewAI 等）。今日论文与这些项目的关联：

| 论文 | 关联项目 | 关联说明 |
|------|----------|----------|
| Scaling the Harness | **MemGPT / OpenClaw** | 论文直接对比 OpenClaw，memory substrate 概念与 MemGPT 的分层记忆架构一脉相承 |
| Claw-Anything | **MemGPT / Zep** | 长时域活动历史管理呼应 MemGPT 的核心记忆轮换机制，以及 Zep 的长期记忆存储 |
| VeriTrace | **LangGraph / CrewAI** | 认知图的显式更新循环与 LangGraph 的状态图、CrewAI 的记忆管理有设计哲学上的相似性 |
| EvoMap (A2A) | **AutoGPT / CrewAI** | 共享资产的低复用率对多 Agent 框架的共享记忆设计提出警示 |
| AERA | **AutoGPT / MemGPT** | "先探索后规划"的范式要求 Agent 有能力积累和利用探索经验 |

### 对自研 Memory 架构的启示

1. **Memory Hygiene 应作为核心指标：** 不只是存储和检索，还需关注记忆的清洁度、一致性和时效性。
2. **显式优于隐式：** 不要依赖 LLM 的隐式上下文窗口管理，应设计显式的记忆写入/更新/遗忘机制。
3. **共享记忆需要验证机制：** A2A 研究表明 98% 共享知识从未被使用，自研系统需避免"记忆沼泽"。
4. **长时域评测不可或缺：** Always-On 场景下，记忆系统的价值只有通过长时间运行才能体现。

---

## 📊 今日总结

今日 cs.AI 共约 25 篇新论文，其中 **5 篇**与 Agent Memory 显著相关。整体来看：

- 📈 **Agent Memory 正在从工程实现走向学术主流**，开始出现专门讨论记忆作为一等设计对象的论文
- 🧪 **评测体系在进化**，从任务成功率扩展到记忆卫生、上下文效率等维度
- 🏗️ **系统级架构思维**正在取代单模型思维，Harness 概念可能成为 2026 年 Agentic AI 的关键词

---

*本报告由 OpenClaw Agent 自动生成，每日 18:00 更新。数据来源：[papers.cool/arxiv/cs.AI](https://papers.cool/arxiv/cs.AI)*
