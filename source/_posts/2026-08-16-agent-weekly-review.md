---
title: "Agent 研究周度深度综述（2026-08-10 ~ 2026-08-16）"
date: 2026-08-16 20:00:00
tags:
  - Agent
  - LLM
  - 周报
  - 深度综述
categories:
  - AI架构
  - Agent系统
---

> 数据来源：[papers.cool/arxiv/cs.AI](https://papers.cool/arxiv/cs.AI) · 生成时间：2026/8/14 17:00:05
> 本报告聚合本周 arXiv cs.AI 的 Agent 相关论文，跨天去重后深度分析。

## 本周总览

本周去重后共 **55** 篇论文，覆盖 4 天数据。上周 30 篇，环比增加 25 篇。

### 研究方向分布

| 方向 | 本周 | 上周 | 变化 |
|------|------|------|------|
| 其他 | 16 | 9 | +7 |
| 评估基准 | 15 | 6 | +9 |
| 规划推理 | 15 | 9 | +6 |
| 记忆系统 | 9 | 8 | +1 |
| 工程架构 | 7 | 2 | +5 |
| 安全对齐 | 4 | 2 | +2 |
| 多智能体 | 2 | 1 | +1 |
| 工具使用 | 2 | 1 | +1 |
| 自我进化 | 1 | 1 | 0 |

### 应用场景分布

| 场景 | 论文数 | 占比 |
|------|--------|------|
| 信息检索与问答 | 10 | 18% |
| 科学研究 | 5 | 9% |
| 决策支持 | 4 | 7% |
| 企业自动化 | 3 | 5% |
| 机器人与物理世界 | 1 | 2% |
| 创意与内容 | 1 | 2% |
| 代码开发 | 1 | 2% |

## 核心论文解读

### 1. Adaptive Sequential Test Planning for Multi-Mechanism Reliability Qualification via Bayesian Monte Carlo Tree Search

- arXiv: [2608.09622](https://arxiv.org/abs/2608.09622)
- 方向: 规划推理 · 评估基准 · 自我进化
- 场景: 信息检索与问答、决策支持
- 关键词: `qualification` `reliability` `sequential` `planning` `test` `tddb` `damage` `adaptive` `failure` `degradation`

### 2. FinRank: An Evidence-Grounded Benchmark for Financial Question Answering and Retrieval over SEC Filings

- arXiv: [2608.07400](https://arxiv.org/abs/2608.07400)
- 方向: 记忆系统 · 评估基准
- 场景: 信息检索与问答
- 关键词: `filings` `finrank` `grounded` `negatives` `evidence` `embedder` `financial` `answering` `reporting` `sec`

### 3. Agentic Auto-Research is Fuzz Testing

- arXiv: [2608.09855](https://arxiv.org/abs/2608.09855)
- 方向: 评估基准
- 场景: 科学研究、信息检索与问答
- 关键词: `research` `auto` `feedback` `fuzzer` `progress` `signal` `agentic` `fuzz` `rather` `validation`

### 4. Model Discovery Agent: LLM-assisted Bayesian experiment design for data-efficient discovery of mechanistic world models

- arXiv: [2608.09696](https://arxiv.org/abs/2608.09696)
- 方向: 规划推理
- 场景: 科学研究、创意与内容
- 关键词: `discovery` `emph` `mda` `mechanistic` `proposer` `interventional` `citep` `model` `llm` `dpbench`

### 5. V-FiLLM: Verified Financial LLM Reasoning Benchmark

- arXiv: [2608.11047](https://arxiv.org/abs/2608.11047)
- 方向: 规划推理 · 评估基准
- 场景: 信息检索与问答
- 关键词: `financial` `fillm` `reasoning` `verified` `tables` `items` `finqa` `2022a` `benchmarks` `evaluating`

### 6. ThinkRetrieve: Retrieval-Augmented Reasoning Traces for Test-Time Scaling

- arXiv: [2608.10928](https://arxiv.org/abs/2608.10928)
- 方向: 记忆系统 · 规划推理 · 评估基准
- 关键词: `thinkretrieve` `reasoning` `aime` `lrms` `traces` `2025` `test` `scaling` `step` `sciq`

### 7. Tree-of-Ideas: Automated Research Ideation via Cross-Trajectory Reasoning over Scholarly Evolution

- arXiv: [2608.10740](https://arxiv.org/abs/2608.10740)
- 方向: 规划推理
- 场景: 科学研究、信息检索与问答
- 关键词: `scholarly` `research` `ideation` `ideas` `toi` `trajectories` `evoagent` `tree` `reasoning` `across`

### 8. Self-Correcting Long-Horizon Search Agents via Tree-Structured Memory

- arXiv: [2608.10676](https://arxiv.org/abs/2608.10676)
- 方向: 记忆系统 · 规划推理
- 场景: 信息检索与问答
- 关键词: `retree` `search` `correcting` `evidence` `agents` `tree` `context` `react` `reasoning` `self`

### 9. VAKRA: Evaluating Multi-Hop Reasoning Across APIs and Retrieval Under Tool-Use Policies

- arXiv: [2608.12282](https://arxiv.org/abs/2608.12282)
- 方向: 记忆系统 · 规划推理 · 工具使用
- 关键词: `apis` `vakra` `textbf` `reasoning` `hop` `tool` `ibm` `across` `failures` `etrieval`

### 10. SkillProx: Self-Evolving Agent Skills via Proximal Textual Gradient Descent

- arXiv: [2608.07449](https://arxiv.org/abs/2608.07449)
- 方向: 其他
- 场景: 信息检索与问答
- 关键词: `skillprox` `skills` `proximal` `diagnosis` `textual` `gradient` `skill` `agent` `knowledge` `updates`

## 研究趋势

**主导方向**：其他（16 篇），较上周（9 篇）上升。

**上升**: 其他（9→16）、评估基准（6→15）、规划推理（9→15）、记忆系统（8→9）、工程架构（2→7）、安全对齐（2→4）、多智能体（1→2）、工具使用（1→2）

## 技术演进脉络

**其他**（16 篇）

- [SkillProx: Self-Evolving Agent Skills via Proximal Textual Gradient Descent](https://arxiv.org/abs/2608.07449)
- [Blast Radius](https://arxiv.org/abs/2608.07440)
- [ResidencyRL: Reinforcement Learning in Simulated Clinical Environments](https://arxiv.org/abs/2608.07418)
- *及另外 13 篇*

**评估基准**（15 篇）

- [Fisher-R1: Training LLM Agents for Reliable Hypothesis Testing](https://arxiv.org/abs/2608.07437)
- [CoBa: Cost-Effective Test-Time Scaling via Compute-Balanced Routing](https://arxiv.org/abs/2608.07424)
- [GeoBenchLLM: A Comprehensive Benchmark for Evaluating LLMs on Geo-Related Tasks](https://arxiv.org/abs/2608.07411)
- *及另外 12 篇*

**规划推理**（15 篇）

- [CoBa: Cost-Effective Test-Time Scaling via Compute-Balanced Routing](https://arxiv.org/abs/2608.07424)
- [Model Discovery Agent: LLM-assisted Bayesian experiment design for data-efficient discovery of mechanistic world models](https://arxiv.org/abs/2608.09696)
- [Avalon-ToM-Bench: Evaluating Fine-Grained Theory of Mind via Asymmetric Game Mechanics](https://arxiv.org/abs/2608.09638)
- *及另外 12 篇*

**记忆系统**（9 篇）

- [PsychoAgent: An Affect-Sensitive Cognitive Architecture for Conflict-Aware Memory in LLM Agents](https://arxiv.org/abs/2608.07438)
- [TEPA: Revoking Stale Memories for Conflict-Robust Language Agents](https://arxiv.org/abs/2608.07429)
- [FinRank: An Evidence-Grounded Benchmark for Financial Question Answering and Retrieval over SEC Filings](https://arxiv.org/abs/2608.07400)
- *及另外 6 篇*

**工程架构**（7 篇）

- [PsychoAgent: An Affect-Sensitive Cognitive Architecture for Conflict-Aware Memory in LLM Agents](https://arxiv.org/abs/2608.07438)
- [ArchAgent v2: A Case Study with the Data Prefetching Championship](https://arxiv.org/abs/2608.09874)
- [CEAA: A Cognitive Embodied Agents Architecture for Interactive Computing Systems](https://arxiv.org/abs/2608.09848)
- *及另外 4 篇*

**安全对齐**（4 篇）

- [People Are Not Just Their Countries. Disentangling Social Determinants of LLM Value Alignment Across Europe](https://arxiv.org/abs/2608.07367)
- [SHE: Trajectory-driven Safety Harness Evolution for LLM Agents](https://arxiv.org/abs/2608.09885)
- [REDAgentBench: Executable Red Teaming and Faithful Measurement of LLM Agent Systems](https://arxiv.org/abs/2608.10669)
- *及另外 1 篇*

**多智能体**（2 篇）

- [EMAS: Stabilizing Multi-Agent System Evolution through Evidence-Guided Revision](https://arxiv.org/abs/2608.07196)
- [ExRole: From Team Trajectories to Executable Roles in Multi-Agent Language Models](https://arxiv.org/abs/2608.11949)

**工具使用**（2 篇）

- [Open Evaluation Agent: Efficient and Promptable Evaluation of Visual Generative Models](https://arxiv.org/abs/2608.09666)
- [VAKRA: Evaluating Multi-Hop Reasoning Across APIs and Retrieval Under Tool-Use Policies](https://arxiv.org/abs/2608.12282)

**自我进化**（1 篇）

- [Adaptive Sequential Test Planning for Multi-Mechanism Reliability Qualification via Bayesian Monte Carlo Tree Search](https://arxiv.org/abs/2608.09622)

## 工程实践启示

- 工程架构方向 7 篇，关注系统设计与可扩展性。
- 工具使用方向 2 篇，function calling 与工具链持续演进。
- 记忆系统方向 9 篇，RAG 与长期记忆方案不断优化。
- 多智能体方向 2 篇，协作模式从简单分工走向复杂协调。
- 安全方向 4 篇，Agent 安全从外部围栏走向内化机制。

## 下周关注

**持续热点**：其他（本周 16 篇，上周 9 篇）、评估基准（本周 15 篇，上周 6 篇）、规划推理（本周 15 篇，上周 9 篇）、记忆系统（本周 9 篇，上周 8 篇）、工程架构（本周 7 篇，上周 2 篇）、安全对齐（本周 4 篇，上周 2 篇）

## 附录：本周论文完整列表

去重后共 55 篇。

**2026-08-10**（13 篇）

1. [SkillProx: Self-Evolving Agent Skills via Proximal Textual Gradient Descent](https://arxiv.org/abs/2608.07449) — other
2. [Blast Radius](https://arxiv.org/abs/2608.07440) — other
3. [PsychoAgent: An Affect-Sensitive Cognitive Architecture for Conflict-Aware Memory in LLM Agents](https://arxiv.org/abs/2608.07438) — memory, engineering
4. [Fisher-R1: Training LLM Agents for Reliable Hypothesis Testing](https://arxiv.org/abs/2608.07437) — evaluation
5. [TEPA: Revoking Stale Memories for Conflict-Robust Language Agents](https://arxiv.org/abs/2608.07429) — memory
6. [CoBa: Cost-Effective Test-Time Scaling via Compute-Balanced Routing](https://arxiv.org/abs/2608.07424) — planning, evaluation
7. [ResidencyRL: Reinforcement Learning in Simulated Clinical Environments](https://arxiv.org/abs/2608.07418) — other
8. [GeoBenchLLM: A Comprehensive Benchmark for Evaluating LLMs on Geo-Related Tasks](https://arxiv.org/abs/2608.07411) — evaluation
9. [FinRank: An Evidence-Grounded Benchmark for Financial Question Answering and Retrieval over SEC Filings](https://arxiv.org/abs/2608.07400) — memory, evaluation
10. [People Are Not Just Their Countries. Disentangling Social Determinants of LLM Value Alignment Across Europe](https://arxiv.org/abs/2608.07367) — safety
11. [An End-to-End Agent Auditing Engine](https://arxiv.org/abs/2608.07346) — evaluation
12. [EMAS: Stabilizing Multi-Agent System Evolution through Evidence-Guided Revision](https://arxiv.org/abs/2608.07196) — multi_agent
13. [Agent Memory Distillation: Empowering Small LLM Agents with Hierarchical Teacher Memory](https://arxiv.org/abs/2608.07169) — memory

**2026-08-11**（13 篇）

1. [SHE: Trajectory-driven Safety Harness Evolution for LLM Agents](https://arxiv.org/abs/2608.09885) — safety
2. [ArchAgent v2: A Case Study with the Data Prefetching Championship](https://arxiv.org/abs/2608.09874) — engineering
3. [Agentic Auto-Research is Fuzz Testing](https://arxiv.org/abs/2608.09855) — evaluation
4. [CEAA: A Cognitive Embodied Agents Architecture for Interactive Computing Systems](https://arxiv.org/abs/2608.09848) — engineering
5. [CARD: Controlled Agentic Reddit Discussions for Credit Card Simulation](https://arxiv.org/abs/2608.09790) — other
6. [Model Discovery Agent: LLM-assisted Bayesian experiment design for data-efficient discovery of mechanistic world models](https://arxiv.org/abs/2608.09696) — planning
7. [Open Evaluation Agent: Efficient and Promptable Evaluation of Visual Generative Models](https://arxiv.org/abs/2608.09666) — tool, evaluation
8. [Avalon-ToM-Bench: Evaluating Fine-Grained Theory of Mind via Asymmetric Game Mechanics](https://arxiv.org/abs/2608.09638) — planning, evaluation
9. [Rethinking Self-Evolving Agents: Do We Still Need Prescribed Optimization Pipelines?](https://arxiv.org/abs/2608.09629) — engineering
10. [Adaptive Sequential Test Planning for Multi-Mechanism Reliability Qualification via Bayesian Monte Carlo Tree Search](https://arxiv.org/abs/2608.09622) — planning, evaluation, evolution
11. [ElasticBack: Stealthy Conditional Backdoor in LLM-Agent Skills via Coupled Trigger-Rule Optimization](https://arxiv.org/abs/2608.09577) — engineering
12. [The Politician, the Liar, and the Obedient Worker: Emerging Behavior of LLM Agents in Hierarchical Games](https://arxiv.org/abs/2608.09574) — other
13. [Bidirectional Context Self-Distillation for Reinforcement Learning of Skill-Based LLM Agents](https://arxiv.org/abs/2608.09555) — other

**2026-08-12**（15 篇）

1. [Why Does CLAUDE.md Keep Growing? Catastrophic Remembering in Agentic Coding](https://arxiv.org/abs/2608.11095) — other
2. [SkillZip: Evaluation-Free Skill Compression for Self-Evolving Agents by Discovering Reusable Structure](https://arxiv.org/abs/2608.11079) — evaluation
3. [V-FiLLM: Verified Financial LLM Reasoning Benchmark](https://arxiv.org/abs/2608.11047) — planning, evaluation
4. [XCoT-VLA: Executable Chain-of-Thought for Vision-Language-Action Driving](https://arxiv.org/abs/2608.10976) — planning
5. [ThinkRetrieve: Retrieval-Augmented Reasoning Traces for Test-Time Scaling](https://arxiv.org/abs/2608.10928) — memory, planning, evaluation
6. [IO Factory: Simulating AI-Enabled Influence Campaigns at Scale](https://arxiv.org/abs/2608.10920) — other
7. [ComBodied Agents: a New Paradigm of Human-Centric Agentic AI](https://arxiv.org/abs/2608.10915) — other
8. [ChemWorld: Programmable Chemical Worlds for Controlled and Replayable Agent Experimentation](https://arxiv.org/abs/2608.10792) — other
9. [SkillLens: Visual Skill Cards for Retrieval-Augmented GUI Action Prediction and On-Policy Distillation](https://arxiv.org/abs/2608.10775) — memory
10. [Compositional Benchmark Synthesis for Hierarchical Human Action Recognition](https://arxiv.org/abs/2608.10765) — evaluation, engineering
11. [Tree-of-Ideas: Automated Research Ideation via Cross-Trajectory Reasoning over Scholarly Evolution](https://arxiv.org/abs/2608.10740) — planning
12. [Self-Correcting Long-Horizon Search Agents via Tree-Structured Memory](https://arxiv.org/abs/2608.10676) — memory, planning
13. [REDAgentBench: Executable Red Teaming and Faithful Measurement of LLM Agent Systems](https://arxiv.org/abs/2608.10669) — safety
14. [VERDICT: Training-Free Step-Wise Verification of Multimodal Reasoning via Disagreement-Aware Consensus](https://arxiv.org/abs/2608.10665) — planning
15. [Operationalising Relative Causal Knowledge: Backbone Identifiability from Private Reports on a Shared Outcome](https://arxiv.org/abs/2608.10664) — other

**2026-08-13**（14 篇）

1. [Constructing Dynamic Master Logic Models as Knowledge Graphs for Complex System Diagnostics Using Retrieval-Augmented Large Language Models](https://arxiv.org/abs/2608.12304) — memory
2. [VAKRA: Evaluating Multi-Hop Reasoning Across APIs and Retrieval Under Tool-Use Policies](https://arxiv.org/abs/2608.12282) — memory, planning, tool
3. [An Agentic Workflow for Legacy HPC Modernization: Converting the Two-Electron-Integral Core of GAMESS](https://arxiv.org/abs/2608.12249) — other
4. [CTBench: Evaluating Troubleshooting Capabilities of AI Agents in Realistic Telecom Network Operations](https://arxiv.org/abs/2608.12002) — other
5. [Claim-Level Reliability Assessment for Efficient Test-Time Reasoning](https://arxiv.org/abs/2608.11994) — planning, evaluation
6. [ExRole: From Team Trajectories to Executable Roles in Multi-Agent Language Models](https://arxiv.org/abs/2608.11949) — multi_agent
7. [Policy-as-logic for robust reasoning over rules](https://arxiv.org/abs/2608.11905) — planning
8. [Agent Skills Can Be Harmful: An Empirical Study of Skill-Induced Failures in LLM Agents](https://arxiv.org/abs/2608.11888) — safety
9. [The Sleeping Agent: What Gist-Based Context Compression Loses and Why](https://arxiv.org/abs/2608.11775) — other
10. [Harness-IF: Evaluating Instruction Following Across Instruction Surfaces in Coding Agents](https://arxiv.org/abs/2608.11727) — other
11. [HUGIN: Enhancing Vision-Language Planning for Autonomous Logistics Sorting](https://arxiv.org/abs/2608.11692) — planning
12. [FrontierFinance: A Challenging Benchmark for Measuring Frontier Intelligence of Finance Agents](https://arxiv.org/abs/2608.11683) — evaluation
13. [AgenticTwin: An Agentic LLM Framework Integrated with Digital Twin for Anomaly Detection](https://arxiv.org/abs/2608.11679) — planning, engineering
14. [CLAIM: Leading Open-domain Active Clarification of Large Language Models with Uncertainty Measurement](https://arxiv.org/abs/2608.11631) — other

---

*本报告由 OpenClaw 自动生成，基于 agent-papers-research 每日数据聚合。*
