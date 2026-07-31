---
title: "Agent 研究周度深度综述（2026-07-20 ~ 2026-07-26）"
date: 2026-07-26 20:00:00
tags:
  - Agent
  - LLM
  - 周报
  - 深度综述
categories:
  - AI架构
  - Agent系统
---

> 数据来源：[papers.cool/arxiv/cs.AI](https://papers.cool/arxiv/cs.AI) · 生成时间：2026/7/31 22:52:26
> 本报告聚合本周 arXiv cs.AI 的 Agent 相关论文，跨天去重后深度分析。

## 本周总览

本周去重后共 **57** 篇论文，覆盖 4 天数据。上周 76 篇，环比减少 19 篇。

### 研究方向分布

| 方向 | 本周 | 上周 | 变化 |
|------|------|------|------|
| 规划推理 | 26 | 22 | +4 |
| 评估基准 | 13 | 19 | -6 |
| 工程架构 | 9 | 6 | +3 |
| 记忆系统 | 7 | 7 | 0 |
| 自我进化 | 7 | 1 | +6 |
| 其他 | 7 | 25 | -18 |
| 安全对齐 | 6 | 3 | +3 |
| 多智能体 | 5 | 9 | -4 |

### 应用场景分布

| 场景 | 论文数 | 占比 |
|------|--------|------|
| 信息检索与问答 | 8 | 14% |
| 决策支持 | 8 | 14% |
| 企业自动化 | 5 | 9% |
| 科学研究 | 5 | 9% |
| 代码开发 | 2 | 4% |
| 数据分析 | 1 | 2% |
| 创意与内容 | 1 | 2% |

## 核心论文解读

### 1. Agents in the Wild: Where Research Meets Deployment

- arXiv: [2607.19336](https://arxiv.org/abs/2607.19336)
- 方向: 规划推理 · 工程架构
- 场景: 科学研究、信息检索与问答、决策支持
- 关键词: `deployment` `agentic` `agents` `checklists` `wild` `meets` `research` `reasoning` `planning` `discovery`

### 2. AgentFAIR: A Multi-Agent Collaborative Framework for FAIRness Evaluation of Geospatial Datasets

- arXiv: [2607.15781](https://arxiv.org/abs/2607.15781)
- 方向: 记忆系统 · 多智能体 · 评估基准 · 工程架构
- 关键词: `agentfair` `geospatial` `evaluators` `dataset` `datasets` `averages` `percentage` `critic` `agent` `fair`

### 3. DrawingVQA: A Real-World Benchmark for Multi-Depth Visual-Textual Reasoning on Construction Drawings

- arXiv: [2607.15418](https://arxiv.org/abs/2607.15418)
- 方向: 规划推理 · 评估基准
- 场景: 企业自动化、信息检索与问答
- 关键词: `drawings` `drawingvqa` `reasoning` `engineering` `construction` `workflows` `mllms` `domain` `textual` `world`

### 4. AnovaX: A Local, Multi-Agent Voice Assistant with LLM Planning, Typed Executors, and Adaptive Recovery

- arXiv: [2607.15367](https://arxiv.org/abs/2607.15367)
- 方向: 规划推理 · 多智能体 · 自我进化
- 场景: 决策支持
- 关键词: `anovax` `assistant` `agent` `llm` `recovery` `phone` `typed` `executors` `desktop` `gemini`

### 5. PhoenixRepair: Rethinking Repair Strategy Exploration in Software Agents

- arXiv: [2607.18859](https://arxiv.org/abs/2607.18859)
- 方向: 其他
- 场景: 代码开发、数据分析、决策支持
- 关键词: `phoenixrepair` `repair` `exploration` `swe` `agent` `edit` `deepsoftwareanalytics` `rethinking` `insufficient` `locations`

### 6. Knowledge-Centric Agents for Workflow Generation

- arXiv: [2607.15845](https://arxiv.org/abs/2607.15845)
- 方向: 规划推理
- 场景: 企业自动化、信息检索与问答
- 关键词: `knowledge` `workflow` `generation` `workflows` `executable` `centric` `comfyui` `reasoning` `strategies` `brittleness`

### 7. Behavioral Controllability of Agentic Models for Information Extraction: From Fixed Workflows to Reflective Agents

- arXiv: [2607.15715](https://arxiv.org/abs/2607.15715)
- 方向: 安全对齐 · 自我进化
- 场景: 企业自动化
- 关键词: `agentic` `extraction` `reflective` `workflows` `agent` `fixed` `agents` `llm` `reflection` `retries`

### 8. S1-Omni: A Unified Multimodal Reasoning Model for Scientific Understanding, Prediction, and Generation

- arXiv: [2607.15686](https://arxiv.org/abs/2607.15686)
- 方向: 规划推理 · 评估基准
- 场景: 科学研究
- 关键词: `omni` `scientific` `unified` `reasoning` `prediction` `generation` `specific` `multimodal` `benchmarks` `ai4s`

### 9. SeerGuard: A Safety Framework for Mobile GUI Agents via World Model Prediction

- arXiv: [2607.15550](https://arxiv.org/abs/2607.15550)
- 方向: 规划推理 · 安全对齐 · 工程架构
- 关键词: `gui` `safety` `seerguard` `risks` `risk` `assessment` `sawm` `mobile` `agents` `action`

### 10. WorldCupArena: Fine-Grained Evaluation of Language Models and Deep-Research Agents on Football Forecasting

- arXiv: [2607.18084](https://arxiv.org/abs/2607.18084)
- 方向: 评估基准
- 场景: 科学研究、信息检索与问答
- 关键词: `worldcuparena` `scoreline` `score` `football` `match` `accuracy` `result` `wzk1015` `evaluation` `kickoff`

## 研究趋势

**主导方向**：规划推理（26 篇），较上周（22 篇）上升。

**上升**: 规划推理（22→26）、工程架构（6→9）、自我进化（1→7）、安全对齐（3→6）

**下降**: 其他（25→7）、多智能体（9→5）、评估基准（19→13）

## 技术演进脉络

**规划推理**（26 篇）

- [DSWorld: A Data Science World Model for Efficient Autonomous Agents](https://arxiv.org/abs/2607.15901)
- [Knowledge-Centric Agents for Workflow Generation](https://arxiv.org/abs/2607.15845)
- [NeurOWL: An LLM-Based Neural-symbolic Framework for Incomplete OWL Ontology Reasoning](https://arxiv.org/abs/2607.15776)
- *及另外 23 篇*

**评估基准**（13 篇）

- [AgentFAIR: A Multi-Agent Collaborative Framework for FAIRness Evaluation of Geospatial Datasets](https://arxiv.org/abs/2607.15781)
- [S1-Omni: A Unified Multimodal Reasoning Model for Scientific Understanding, Prediction, and Generation](https://arxiv.org/abs/2607.15686)
- [Neuro-Symbolic AI for LEED compliance: Document-Centric Benchmarking, Deterministic Numeric Checking, and When Multimodal Hurts](https://arxiv.org/abs/2607.15647)
- *及另外 10 篇*

**工程架构**（9 篇）

- [AgentFAIR: A Multi-Agent Collaborative Framework for FAIRness Evaluation of Geospatial Datasets](https://arxiv.org/abs/2607.15781)
- [NeurOWL: An LLM-Based Neural-symbolic Framework for Incomplete OWL Ontology Reasoning](https://arxiv.org/abs/2607.15776)
- [SeerGuard: A Safety Framework for Mobile GUI Agents via World Model Prediction](https://arxiv.org/abs/2607.15550)
- *及另外 6 篇*

**记忆系统**（7 篇）

- [AgentFAIR: A Multi-Agent Collaborative Framework for FAIRness Evaluation of Geospatial Datasets](https://arxiv.org/abs/2607.15781)
- [Rethinking Heterogeneous LLM Merging: A Weighted Model Averaging Perspective](https://arxiv.org/abs/2607.18026)
- [Exploratory and Assimilating Reflection: Reflective Recall Cycle for Long-term Memory](https://arxiv.org/abs/2607.17879)
- *及另外 4 篇*

**自我进化**（7 篇）

- [Behavioral Controllability of Agentic Models for Information Extraction: From Fixed Workflows to Reflective Agents](https://arxiv.org/abs/2607.15715)
- [AnovaX: A Local, Multi-Agent Voice Assistant with LLM Planning, Typed Executors, and Adaptive Recovery](https://arxiv.org/abs/2607.15367)
- [AdaHome: An Adaptive Smart Home Assistant using Local Small Language Models](https://arxiv.org/abs/2607.18034)
- *及另外 4 篇*

**其他**（7 篇）

- [From Black Box to Executable Logic: Explainable Reinforcement Learning through Prolog Expert Systems](https://arxiv.org/abs/2607.15459)
- [Towards Agentic Agent-based Models: Feasibility, Performance, and Statistical Model Checking](https://arxiv.org/abs/2607.17948)
- [CodeRescue: Budget-Calibrated Recovery Routing for Coding Agents](https://arxiv.org/abs/2607.19338)
- *及另外 4 篇*

**安全对齐**（6 篇）

- [Behavioral Controllability of Agentic Models for Information Extraction: From Fixed Workflows to Reflective Agents](https://arxiv.org/abs/2607.15715)
- [SeerGuard: A Safety Framework for Mobile GUI Agents via World Model Prediction](https://arxiv.org/abs/2607.15550)
- [Beyond a Joke: Multi-Angle Reasoning for Detecting and Explaining Harmful Humor in Memes](https://arxiv.org/abs/2607.15442)
- *及另外 3 篇*

**多智能体**（5 篇）

- [AgentFAIR: A Multi-Agent Collaborative Framework for FAIRness Evaluation of Geospatial Datasets](https://arxiv.org/abs/2607.15781)
- [Precise but Uncoupled: Reviewer Precision Does Not Guarantee Critique Uptake in Multi-Agent Math Reasoning](https://arxiv.org/abs/2607.15388)
- [AnovaX: A Local, Multi-Agent Voice Assistant with LLM Planning, Typed Executors, and Adaptive Recovery](https://arxiv.org/abs/2607.15367)
- *及另外 2 篇*

## 工程实践启示

- 工程架构方向 9 篇，关注系统设计与可扩展性。
- 记忆系统方向 7 篇，RAG 与长期记忆方案不断优化。
- 多智能体方向 5 篇，协作模式从简单分工走向复杂协调。
- 安全方向 6 篇，Agent 安全从外部围栏走向内化机制。

## 下周关注

**持续热点**：规划推理（本周 26 篇，上周 22 篇）、评估基准（本周 13 篇，上周 19 篇）、工程架构（本周 9 篇，上周 6 篇）、记忆系统（本周 7 篇，上周 7 篇）、其他（本周 7 篇，上周 25 篇）、安全对齐（本周 6 篇，上周 3 篇）、多智能体（本周 5 篇，上周 9 篇）

## 附录：本周论文完整列表

去重后共 57 篇。

**2026-07-20**（17 篇）

1. [DSWorld: A Data Science World Model for Efficient Autonomous Agents](https://arxiv.org/abs/2607.15901) — planning
2. [Knowledge-Centric Agents for Workflow Generation](https://arxiv.org/abs/2607.15845) — planning
3. [AgentFAIR: A Multi-Agent Collaborative Framework for FAIRness Evaluation of Geospatial Datasets](https://arxiv.org/abs/2607.15781) — memory, multi_agent, evaluation, engineering
4. [NeurOWL: An LLM-Based Neural-symbolic Framework for Incomplete OWL Ontology Reasoning](https://arxiv.org/abs/2607.15776) — planning, engineering
5. [Behavioral Controllability of Agentic Models for Information Extraction: From Fixed Workflows to Reflective Agents](https://arxiv.org/abs/2607.15715) — safety, evolution
6. [S1-Omni: A Unified Multimodal Reasoning Model for Scientific Understanding, Prediction, and Generation](https://arxiv.org/abs/2607.15686) — planning, evaluation
7. [ToolVerse: Unlocking Massive Environments and Long-Horizon Tasks for Agentic Reinforcement Learning](https://arxiv.org/abs/2607.15660) — planning
8. [Neuro-Symbolic AI for LEED compliance: Document-Centric Benchmarking, Deterministic Numeric Checking, and When Multimodal Hurts](https://arxiv.org/abs/2607.15647) — evaluation
9. [SeerGuard: A Safety Framework for Mobile GUI Agents via World Model Prediction](https://arxiv.org/abs/2607.15550) — planning, safety, engineering
10. [From Black Box to Executable Logic: Explainable Reinforcement Learning through Prolog Expert Systems](https://arxiv.org/abs/2607.15459) — other
11. [Beyond a Joke: Multi-Angle Reasoning for Detecting and Explaining Harmful Humor in Memes](https://arxiv.org/abs/2607.15442) — planning, safety
12. [Do Coding Agents Need Executable World Models, Simplification, and Verification to Solve ARC-AGI-3?](https://arxiv.org/abs/2607.15439) — planning
13. [DrawingVQA: A Real-World Benchmark for Multi-Depth Visual-Textual Reasoning on Construction Drawings](https://arxiv.org/abs/2607.15418) — planning, evaluation
14. [Precise but Uncoupled: Reviewer Precision Does Not Guarantee Critique Uptake in Multi-Agent Math Reasoning](https://arxiv.org/abs/2607.15388) — planning, multi_agent
15. [AnovaX: A Local, Multi-Agent Voice Assistant with LLM Planning, Typed Executors, and Adaptive Recovery](https://arxiv.org/abs/2607.15367) — planning, multi_agent, evolution
16. [Cura 1T: Specialized Model for Agentic Healthcare](https://arxiv.org/abs/2607.15314) — planning
17. [Causal-Audit: Explicit and Auditable Graph-based Reasoning via Target-Aware Causal Chain Construction](https://arxiv.org/abs/2607.15281) — planning

**2026-07-21**（14 篇）

1. [Can We Break LLMs Out of Self-Loops? Fine-Grained Reasoning Control with Activation Steering](https://arxiv.org/abs/2607.18100) — planning
2. [WorldCupArena: Fine-Grained Evaluation of Language Models and Deep-Research Agents on Football Forecasting](https://arxiv.org/abs/2607.18084) — evaluation
3. [AdaHome: An Adaptive Smart Home Assistant using Local Small Language Models](https://arxiv.org/abs/2607.18034) — planning, evolution
4. [Rethinking Heterogeneous LLM Merging: A Weighted Model Averaging Perspective](https://arxiv.org/abs/2607.18026) — memory
5. [PAMD: Structured Adaptive Distances for Bisimulation Representations in Visual Reinforcement Learning](https://arxiv.org/abs/2607.18004) — evolution
6. [SAGE: Subgoal-Conditioned Action Generation for Latent World Model Planning](https://arxiv.org/abs/2607.17973) — planning
7. [Towards Agentic Agent-based Models: Feasibility, Performance, and Statistical Model Checking](https://arxiv.org/abs/2607.17948) — other
8. [PEARL: Auditable Repair for Scientific Reasoning Graph Extraction](https://arxiv.org/abs/2607.17917) — planning
9. [Stress Testing Concept Erasure with Large Language Model Agents](https://arxiv.org/abs/2607.17890) — evaluation
10. [ST-Veto: Spatio-Temporal Token Veto for Diffusion MLLMs via Taylor Prediction and Visual Grounding](https://arxiv.org/abs/2607.17884) — planning
11. [Exploratory and Assimilating Reflection: Reflective Recall Cycle for Long-term Memory](https://arxiv.org/abs/2607.17879) — memory, evolution
12. [WuYu-EnvLE-Bench: A Benchmark for Evaluating Large Language Models in Environmental Law Enforcement](https://arxiv.org/abs/2607.17745) — evaluation
13. [Semantically Similar, Logically Distinct: Diagnosing the Semantic-Answerability Gap in Table RAG](https://arxiv.org/abs/2607.17742) — memory
14. [SR-Agent: An Experience-Driven Agentic Framework for Post-Ranking Strategies Refinement in E-Commerce Recommendation](https://arxiv.org/abs/2607.17719) — engineering

**2026-07-22**（10 篇）

1. [CodeRescue: Budget-Calibrated Recovery Routing for Coding Agents](https://arxiv.org/abs/2607.19338) — other
2. [Agents in the Wild: Where Research Meets Deployment](https://arxiv.org/abs/2607.19336) — planning, engineering
3. [ResearchArena: Evaluating Sabotage and Monitoring in Automated AI R&amp;D](https://arxiv.org/abs/2607.19321) — other
4. [Graph-Based Agentic AI with LangGraph: Workflow Pathways for Long-Running Stateful Business Processes](https://arxiv.org/abs/2607.19297) — other
5. [BioSecBench-Surveillance: A Verifiable Benchmark for AI Agents in Pathogen Genomic Surveillance](https://arxiv.org/abs/2607.19262) — evaluation
6. [Comparative Study of Multi-Agent Actor-Critic Algorithms in Parameterized Action Reinforcement Learning](https://arxiv.org/abs/2607.19117) — multi_agent
7. [OpenRTAG: A Comprehensive Benchmark for Robust Text-Attributed Graph Learning under Data Quality Degradation](https://arxiv.org/abs/2607.19108) — evaluation
8. [Supra Cognitive Modes: A Routed Architecture for Agent Memory](https://arxiv.org/abs/2607.19096) — memory, engineering
9. [Fishing Out Free Riders: Shapley-Based Reward Attribution for Parallel Reasoning via Reinforcement Learning](https://arxiv.org/abs/2607.18979) — planning
10. [PhoenixRepair: Rethinking Repair Strategy Exploration in Software Agents](https://arxiv.org/abs/2607.18859) — other

**2026-07-23**（16 篇）

1. [SoftReason: A Fully Differentiable Neuro-Soft-Symbolic Deductive Reasoning Architecture over High-Dimensional Perceptual Data](https://arxiv.org/abs/2607.20402) — planning, engineering
2. [PoTRE: Test-Time Reasoning inspired by Cognitive Heterogeneity](https://arxiv.org/abs/2607.20268) — planning, evaluation
3. [CUSUM-Shaped Inference-Time Monitoring and Targeted Re-Decoding for Quantized Small Language Model Reasoning](https://arxiv.org/abs/2607.20129) — planning
4. [PRO-LONG: Programmatic Memory Enables Long-Horizon Reasoning](https://arxiv.org/abs/2607.20064) — memory, planning
5. [EvoDRC: A Self-Evolving Agentic Framework for Automated DRC Violation Repair](https://arxiv.org/abs/2607.20019) — engineering
6. [CLARK: Closed-loop Learning for Adaptive Reasoning over Knowledge Graphs](https://arxiv.org/abs/2607.19996) — planning, evolution
7. [Coordinating from Memory: Graph-Structured Experience Reuse for Multi-Agent Adaptation in Dynamic Manufacturing](https://arxiv.org/abs/2607.19985) — memory, multi_agent
8. [EvoThink: Evolving Thinking in Large Reasoning Models via Self-Pruning and Aha-Moment Preference Optimization](https://arxiv.org/abs/2607.19962) — planning, engineering
9. [MOF-Sleuth: Tool-Grounded Reward Alignment for Explainable Fine-Grained MOF CIF Auditing](https://arxiv.org/abs/2607.19935) — safety
10. [JANUS: Foreseeing Latent Risk for Long-Horizon Agent Safety](https://arxiv.org/abs/2607.19913) — safety
11. [DocOps: A Verifiable Benchmark for Autonomous Agents in Complex Document Operations](https://arxiv.org/abs/2607.19865) — evaluation
12. [Know Your Agent: Reconnaissance-Driven Pentesting of AI Agents](https://arxiv.org/abs/2607.19837) — evaluation
13. [Rewarding Better Thinking for LLM Preference Alignment](https://arxiv.org/abs/2607.19824) — safety
14. [Silent Failures in Multimodal Agentic Search:A Diagnostic Taxonomy and Cross-Judge Evaluation](https://arxiv.org/abs/2607.19793) — evaluation
15. [Symbol and Footprint Database for Electronic Components by Agentic Recognition and Generation](https://arxiv.org/abs/2607.19767) — other
16. [Knowledge-Centric Self-Improvement](https://arxiv.org/abs/2607.19592) — evolution

---

*本报告由 OpenClaw 自动生成，基于 agent-papers-research 每日数据聚合。*
