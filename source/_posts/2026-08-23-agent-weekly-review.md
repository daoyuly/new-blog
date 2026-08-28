---
title: Agent 研究周度深度综述（2026-08-17 ~ 2026-08-23）
tags:
  - Agent
  - LLM
  - 周报
  - 深度综述
categories:
  - AI架构
  - Agent系统
abbrlink: 43820
date: 2026-08-23 20:00:00
---

> 数据来源：[papers.cool/arxiv/cs.AI](https://papers.cool/arxiv/cs.AI) · 生成时间：2026/8/21 17:00:05
> 本报告聚合本周 arXiv cs.AI 的 Agent 相关论文，跨天去重后深度分析。

## 本周总览

本周去重后共 **47** 篇论文，覆盖 4 天数据。上周 68 篇，环比减少 21 篇。

### 研究方向分布

| 方向 | 本周 | 上周 | 变化 |
|------|------|------|------|
| 规划推理 | 11 | 20 | -9 |
| 其他 | 11 | 17 | -6 |
| 评估基准 | 9 | 19 | -10 |
| 多智能体 | 9 | 4 | +5 |
| 记忆系统 | 6 | 13 | -7 |
| 工程架构 | 5 | 9 | -4 |
| 自我进化 | 4 | 2 | +2 |
| 安全对齐 | 1 | 7 | -6 |

### 应用场景分布

| 场景 | 论文数 | 占比 |
|------|--------|------|
| 信息检索与问答 | 5 | 11% |
| 决策支持 | 4 | 9% |
| 企业自动化 | 4 | 9% |
| 科学研究 | 3 | 6% |
| 数据分析 | 2 | 4% |
| 代码开发 | 2 | 4% |
| 机器人与物理世界 | 2 | 4% |
| 创意与内容 | 1 | 2% |

## 核心论文解读

### 1. Adaptive Memory and Reflection Multi-Agent System for Medical Question Answering

- arXiv: [2608.19029](https://arxiv.org/abs/2608.19029)
- 方向: 记忆系统 · 规划推理 · 多智能体 · 自我进化
- 场景: 信息检索与问答
- 关键词: `agent` `reflection` `memory` `medical` `amr` `answering` `reasoning` `overseer` `medmcqa` `escalated`

### 2. ScienceFlow: A long-horizon agent for ML research, scientific discovery and beyond

- arXiv: [2608.14354](https://arxiv.org/abs/2608.14354)
- 方向: 其他
- 场景: 科学研究、信息检索与问答
- 关键词: `scienceflow` `research` `executable` `horizon` `autoresearch` `execution` `scientific` `sustain` `progress` `exploration`

### 3. Intern-S2-Mobius: Foundation Model with Decoupled Knowledge and Reasoning

- arXiv: [2608.14290](https://arxiv.org/abs/2608.14290)
- 方向: 规划推理 · 工程架构
- 场景: 信息检索与问答
- 关键词: `mobius` `intern` `reasoning` `knowledge` `reasoners` `architecture` `attn` `achieves` `35b` `decoupled`

### 4. Reconstruction: A Blind Benchmark for Recovering Research Ideas from Pre-Publication Bibliographies

- arXiv: [2608.16645](https://arxiv.org/abs/2608.16645)
- 方向: 评估基准
- 场景: 科学研究、信息检索与问答
- 关键词: `bibliographies` `leakage` `idea` `approx` `publication` `tournament` `blind` `seed` `withholds` `reconstruction`

### 5. PDDLCoder: Agentic PDDL Generation for LLM-Assisted Symbolic Planning

- arXiv: [2608.16637](https://arxiv.org/abs/2608.16637)
- 方向: 规划推理
- 场景: 代码开发、决策支持
- 关键词: `pddl` `planning` `pddlcoder` `agentic` `pddlgym` `generation` `llm` `symbolic` `plans` `assisted`

### 6. A Multi-Agent Platform for Automated Enterprise Analytics and Insight Generation

- arXiv: [2608.18740](https://arxiv.org/abs/2608.18740)
- 方向: 多智能体
- 场景: 数据分析、企业自动化
- 关键词: `enterprise` `agent` `crewai` `conversational` `platform` `quality` `llm` `multi` `analytics` `agents`

### 7. SheetCompass: Hierarchical Relation Graphs for Agentic Spreadsheet Reasoning

- arXiv: [2608.14452](https://arxiv.org/abs/2608.14452)
- 方向: 规划推理
- 场景: 数据分析
- 关键词: `sheetcompass` `spreadsheet` `workbooks` `agentic` `spreadsheets` `reasoning` `sheet` `worksheets` `llms` `flatten`

### 8. PACE-Bench: Benchmarking Physics Adaptation via Code Evolution in Dynamic Environments

- arXiv: [2608.14441](https://arxiv.org/abs/2608.14441)
- 方向: 评估基准
- 场景: 代码开发
- 关键词: `pace` `bench` `code` `adaptation` `target` `succeeds` `agents` `physics` `grounded` `self`

### 9. Cross-Sign Language Transfer Learning Using Domain Adaptation with Multi-scale Temporal Alignment

- arXiv: [2608.16804](https://arxiv.org/abs/2608.16804)
- 方向: 多智能体 · 安全对齐
- 关键词: `sign` `language` `temporal` `adaptation` `transfer` `domain` `ta3n` `aligning` `communication` `individuals`

### 10. Chronocooked: A Benchmark for Implicit Interval Timing in Reinforcement Learning Agents

- arXiv: [2608.16666](https://arxiv.org/abs/2608.16666)
- 方向: 评估基准
- 场景: 创意与内容
- 关键词: `chronocooked` `agents` `timing` `biologically` `implicit` `interval` `reinforcement` `suite` `temporal` `designed`

## 研究趋势

**主导方向**：规划推理（11 篇），较上周（20 篇）下降。

**上升**: 多智能体（4→9）、自我进化（2→4）

**下降**: 其他（17→11）、记忆系统（13→6）、工程架构（9→5）、评估基准（19→9）、规划推理（20→11）、安全对齐（7→1）、工具使用（3→0）

## 技术演进脉络

**规划推理**（11 篇）

- [SheetCompass: Hierarchical Relation Graphs for Agentic Spreadsheet Reasoning](https://arxiv.org/abs/2608.14452)
- [Intern-S2-Mobius: Foundation Model with Decoupled Knowledge and Reasoning](https://arxiv.org/abs/2608.14290)
- [GRIP: Grounded Reasoning via Information-Restricted Premises](https://arxiv.org/abs/2608.16776)
- *及另外 8 篇*

**其他**（11 篇）

- [AgentRewind: Recoverable Execution for Long-Horizon LLM Agents](https://arxiv.org/abs/2608.14380)
- [ScienceFlow: A long-horizon agent for ML research, scientific discovery and beyond](https://arxiv.org/abs/2608.14354)
- [Clearing the Fog: Towards Installing and Refining Proactive Exploration Capabilities in LLM Agents](https://arxiv.org/abs/2608.14339)
- *及另外 8 篇*

**评估基准**（9 篇）

- [PACE-Bench: Benchmarking Physics Adaptation via Code Evolution in Dynamic Environments](https://arxiv.org/abs/2608.14441)
- [AnchorBench: A Multi-Pathway Benchmark for the Anchoring Effect in LLMs](https://arxiv.org/abs/2608.14320)
- [TimeSage-EV: A Live Benchmark for Agentic Time Series Analysis in Evolving Environments](https://arxiv.org/abs/2608.14270)
- *及另外 6 篇*

**多智能体**（9 篇）

- [Wrong but Useful: Trajectory Value Beyond Answer Correctness in Multi-Agent Messages](https://arxiv.org/abs/2608.14375)
- [Cross-Sign Language Transfer Learning Using Domain Adaptation with Multi-scale Temporal Alignment](https://arxiv.org/abs/2608.16804)
- [When Agents Coordinate: Measuring Coordination in Multi-Agent AI Coding](https://arxiv.org/abs/2608.16801)
- *及另外 6 篇*

**记忆系统**（6 篇）

- [Hypergraph-based Multimodal Retrieval-Augmented Generation with Incremental Refinement](https://arxiv.org/abs/2608.16628)
- [On the Fragility of Self-Improving Agents: Variance, Task Order, and Underspecification](https://arxiv.org/abs/2608.18066)
- [ARASH: Adaptive Retrieval And Shot Selection for Tabular Prediction](https://arxiv.org/abs/2608.17856)
- *及另外 3 篇*

**工程架构**（5 篇）

- [Wyvern: An Agentic Framework for Generating Grounded Multimodal Reports](https://arxiv.org/abs/2608.14446)
- [Intern-S2-Mobius: Foundation Model with Decoupled Knowledge and Reasoning](https://arxiv.org/abs/2608.14290)
- [Delegation Asymmetry in Agentic Recommender Systems: Measuring Two-Sided Receptivity in Online Dating](https://arxiv.org/abs/2608.18058)
- *及另外 2 篇*

**自我进化**（4 篇）

- [ARASH: Adaptive Retrieval And Shot Selection for Tabular Prediction](https://arxiv.org/abs/2608.17856)
- [Auditing Self-Evolution in Financial Agents: Capability Gains, Security Drift, and Execution-Interface Mismatch](https://arxiv.org/abs/2608.17684)
- [Adaptive Memory and Reflection Multi-Agent System for Medical Question Answering](https://arxiv.org/abs/2608.19029)
- *及另外 1 篇*

**安全对齐**（1 篇）

- [Cross-Sign Language Transfer Learning Using Domain Adaptation with Multi-scale Temporal Alignment](https://arxiv.org/abs/2608.16804)

## 工程实践启示

- 工程架构方向 5 篇，关注系统设计与可扩展性。
- 记忆系统方向 6 篇，RAG 与长期记忆方案不断优化。
- 多智能体方向 9 篇，协作模式从简单分工走向复杂协调。
- 安全方向 1 篇，Agent 安全从外部围栏走向内化机制。

## 下周关注

**持续热点**：规划推理（本周 11 篇，上周 20 篇）、其他（本周 11 篇，上周 17 篇）、评估基准（本周 9 篇，上周 19 篇）、多智能体（本周 9 篇，上周 4 篇）、记忆系统（本周 6 篇，上周 13 篇）、工程架构（本周 5 篇，上周 9 篇）、自我进化（本周 4 篇，上周 2 篇）

## 附录：本周论文完整列表

去重后共 47 篇。

**2026-08-17**（10 篇）

1. [SheetCompass: Hierarchical Relation Graphs for Agentic Spreadsheet Reasoning](https://arxiv.org/abs/2608.14452) — planning
2. [Wyvern: An Agentic Framework for Generating Grounded Multimodal Reports](https://arxiv.org/abs/2608.14446) — engineering
3. [PACE-Bench: Benchmarking Physics Adaptation via Code Evolution in Dynamic Environments](https://arxiv.org/abs/2608.14441) — evaluation
4. [AgentRewind: Recoverable Execution for Long-Horizon LLM Agents](https://arxiv.org/abs/2608.14380) — other
5. [Wrong but Useful: Trajectory Value Beyond Answer Correctness in Multi-Agent Messages](https://arxiv.org/abs/2608.14375) — multi_agent
6. [ScienceFlow: A long-horizon agent for ML research, scientific discovery and beyond](https://arxiv.org/abs/2608.14354) — other
7. [Clearing the Fog: Towards Installing and Refining Proactive Exploration Capabilities in LLM Agents](https://arxiv.org/abs/2608.14339) — other
8. [AnchorBench: A Multi-Pathway Benchmark for the Anchoring Effect in LLMs](https://arxiv.org/abs/2608.14320) — evaluation
9. [Intern-S2-Mobius: Foundation Model with Decoupled Knowledge and Reasoning](https://arxiv.org/abs/2608.14290) — planning, engineering
10. [TimeSage-EV: A Live Benchmark for Agentic Time Series Analysis in Evolving Environments](https://arxiv.org/abs/2608.14270) — evaluation

**2026-08-18**（12 篇）

1. [Cross-Sign Language Transfer Learning Using Domain Adaptation with Multi-scale Temporal Alignment](https://arxiv.org/abs/2608.16804) — multi_agent, safety
2. [When Agents Coordinate: Measuring Coordination in Multi-Agent AI Coding](https://arxiv.org/abs/2608.16801) — multi_agent
3. [GRIP: Grounded Reasoning via Information-Restricted Premises](https://arxiv.org/abs/2608.16776) — planning
4. [Chronocooked: A Benchmark for Implicit Interval Timing in Reinforcement Learning Agents](https://arxiv.org/abs/2608.16666) — evaluation
5. [Reconstruction: A Blind Benchmark for Recovering Research Ideas from Pre-Publication Bibliographies](https://arxiv.org/abs/2608.16645) — evaluation
6. [PDDLCoder: Agentic PDDL Generation for LLM-Assisted Symbolic Planning](https://arxiv.org/abs/2608.16637) — planning
7. [Hypergraph-based Multimodal Retrieval-Augmented Generation with Incremental Refinement](https://arxiv.org/abs/2608.16628) — memory
8. [Physics of Agents: Statistical Mechanics Predicts Collective Behavior of AI Agents](https://arxiv.org/abs/2608.16578) — other
9. [Probabilistic Circuits as Reasoning Machines in Artificial Intelligence (Part I)](https://arxiv.org/abs/2608.16565) — planning
10. [DeepInsight II: One Trace from Benchmark to Robot](https://arxiv.org/abs/2608.16556) — evaluation
11. [Offline Reinforcement Learning for Hemodynamic Management of Sepsis in the ICU: a MIMIC-IV Study with Dual Off-Policy Evaluation](https://arxiv.org/abs/2608.16482) — evaluation
12. [HaReCAP: Habitual-action Grounding for Recursive Large Language Model Agents](https://arxiv.org/abs/2608.16447) — other

**2026-08-19**（13 篇）

1. [On the Fragility of Self-Improving Agents: Variance, Task Order, and Underspecification](https://arxiv.org/abs/2608.18066) — memory, evaluation
2. [Delegation Asymmetry in Agentic Recommender Systems: Measuring Two-Sided Receptivity in Online Dating](https://arxiv.org/abs/2608.18058) — engineering
3. [StagedWorkspace: A Versioned Workspace for Knowledge-Work Agents](https://arxiv.org/abs/2608.18050) — other
4. [Towards Zero-Shot Task Transfer with Neurosymbolic World Models](https://arxiv.org/abs/2608.17959) — planning
5. [EvoTS-Agent: A Self-Evolving LLM Agent for Financial Time Series Change Point Detection](https://arxiv.org/abs/2608.17933) — other
6. [ARASH: Adaptive Retrieval And Shot Selection for Tabular Prediction](https://arxiv.org/abs/2608.17856) — memory, evolution
7. [StartupBench: Benchmarking General-Purpose Agents on Market-Validated End-to-End Workflows](https://arxiv.org/abs/2608.17800) — evaluation
8. [D$^2$ACCI: A Dual-Loop Diagnostic Protocol for Evidence-Preserving Agent Memory](https://arxiv.org/abs/2608.17756) — memory
9. [The Curious Case of Exploding DecPOMDPs: Containing the Fire through Policy Counting](https://arxiv.org/abs/2608.17749) — other
10. [Beyond Suspicious Steps: Ontological Trust in Long-Horizon Agents](https://arxiv.org/abs/2608.17718) — other
11. [Auditing Self-Evolution in Financial Agents: Capability Gains, Security Drift, and Execution-Interface Mismatch](https://arxiv.org/abs/2608.17684) — planning, evolution
12. [GraphWake: Group Polarization via Memory-Mediated Polarization Cascade in LLM-Agent Communities](https://arxiv.org/abs/2608.17665) — memory
13. [Beyond the Trace: Coupling an Interpretable Reasoning-State Readout to Native MoE Routing](https://arxiv.org/abs/2608.17638) — planning

**2026-08-20**（12 篇）

1. [Beyond the Transcript: Detecting Covert Co ordination in Latent Multi-Agent Communication](https://arxiv.org/abs/2608.19161) — multi_agent
2. [Eureka: Task-Conditioned Meta-Agent Orchestration for Scientific Discovery](https://arxiv.org/abs/2608.19047) — engineering
3. [Adaptive Memory and Reflection Multi-Agent System for Medical Question Answering](https://arxiv.org/abs/2608.19029) — memory, planning, multi_agent, evolution
4. [A Theory of Post-hoc Debate Judgement](https://arxiv.org/abs/2608.19002) — multi_agent
5. [Training-Free Inference-Time Self-Reflection and Cost-Bounded Early Stopping for Large Language Models](https://arxiv.org/abs/2608.18884) — evolution
6. [DentAgent: Evidence-Centric Multi-Agent Coordination for Multimodal Dental Reasoning](https://arxiv.org/abs/2608.18878) — planning, multi_agent
7. [SkillGate: Training In-Policy Skill Selection in Long-Horizon Agents](https://arxiv.org/abs/2608.18852) — other
8. [ORBITER: Conflict-Aware Decision-Making for Agentic Last-Mile Delivery](https://arxiv.org/abs/2608.18846) — other
9. [A Multi-Agent Platform for Automated Enterprise Analytics and Insight Generation](https://arxiv.org/abs/2608.18740) — multi_agent
10. [RTPO: Reverse-Turn Policy Optimization for Stabilizing Agentic RL Training](https://arxiv.org/abs/2608.18682) — engineering
11. [Sanyu Studio: A Multi-Agent System for Art-Historical Narrative Construction](https://arxiv.org/abs/2608.18677) — multi_agent
12. [Preference Reasoning under Indeterminacy in Large Language Models](https://arxiv.org/abs/2608.18631) — planning

---

*本报告由 OpenClaw 自动生成，基于 agent-papers-research 每日数据聚合。*
