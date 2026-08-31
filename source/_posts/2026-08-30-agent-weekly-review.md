---
title: Agent 研究周度深度综述（2026-08-24 ~ 2026-08-30）
tags:
  - Agent
  - LLM
  - 周报
  - 深度综述
categories:
  - AI架构
  - Agent系统
abbrlink: 39697
date: 2026-08-30 20:00:00
---

> 数据来源：[papers.cool/arxiv/cs.AI](https://papers.cool/arxiv/cs.AI) · 生成时间：2026/8/28 17:00:05
> 本报告聚合本周 arXiv cs.AI 的 Agent 相关论文，跨天去重后深度分析。

## 本周总览

本周去重后共 **48** 篇论文，覆盖 4 天数据。上周 63 篇，环比减少 15 篇。

### 研究方向分布

| 方向 | 本周 | 上周 | 变化 |
|------|------|------|------|
| 规划推理 | 13 | 17 | -4 |
| 其他 | 10 | 16 | -6 |
| 评估基准 | 7 | 14 | -7 |
| 安全对齐 | 7 | 1 | +6 |
| 记忆系统 | 7 | 8 | -1 |
| 多智能体 | 5 | 9 | -4 |
| 自我进化 | 4 | 8 | -4 |
| 工程架构 | 4 | 7 | -3 |
| 工具使用 | 1 | 1 | 0 |

### 应用场景分布

| 场景 | 论文数 | 占比 |
|------|--------|------|
| 企业自动化 | 3 | 6% |
| 决策支持 | 3 | 6% |
| 信息检索与问答 | 2 | 4% |
| 代码开发 | 2 | 4% |
| 科学研究 | 1 | 2% |
| 机器人与物理世界 | 1 | 2% |
| 数据分析 | 1 | 2% |

## 核心论文解读

### 1. SRPO: Self-Reflective Policy Optimization for Long-Horizon Reasoning

- arXiv: [2608.23493](https://arxiv.org/abs/2608.23493)
- 方向: 规划推理 · 自我进化 · 工程架构
- 场景: 决策支持
- 关键词: `srpo` `reflective` `reflection` `policy` `self` `teacher` `aime` `horizon` `reasoning` `internalizes`

### 2. VIALS: A Benchmark for Visual Interpretation of Artifacts in the Life Sciences

- arXiv: [2608.21357](https://arxiv.org/abs/2608.21357)
- 方向: 评估基准
- 场景: 企业自动化
- 关键词: `vials` `artifacts` `sciences` `visual` `workflows` `scientists` `interpret` `interpretation` `life` `images`

### 3. ReFrame: Evidence-Guided Test-Time Safety Alignment in Multimodal Large Language Models

- arXiv: [2608.21100](https://arxiv.org/abs/2608.21100)
- 方向: 安全对齐 · 评估基准
- 关键词: `reframe` `multimodal` `safety` `mllms` `alignment` `mllm` `utility` `evidence` `awareness` `oversensitivity`

### 4. ReWorld: An Interactive World Model with Long-Horizon Memory

- arXiv: [2608.23565](https://arxiv.org/abs/2608.23565)
- 方向: 记忆系统 · 规划推理
- 关键词: `interactive` `reworld` `heads` `world` `memory` `chunk` `horizon` `wants` `places` `cache`

### 5. EarthVerse: Benchmarking Scientific Agents Across Dynamic Earth Systems and Natural Hazards

- arXiv: [2608.23525](https://arxiv.org/abs/2608.23525)
- 方向: 评估基准
- 场景: 科学研究
- 关键词: `earthverse` `scientific` `agents` `hazards` `earth` `evidence` `answer` `across` `reproducible` `systems`

### 6. Mitigating Reasoning-Induced Misalignment via Safety-Direction Penalty

- arXiv: [2608.23497](https://arxiv.org/abs/2608.23497)
- 方向: 规划推理 · 安全对齐
- 关键词: `safety` `reasoning` `rim` `sdp` `direction` `shifts` `misalignment` `penalty` `tuning` `harmful`

### 7. SPO++: Stream-Aligned Policy Optimization for Asynchronous Agentic RL

- arXiv: [2608.24870](https://arxiv.org/abs/2608.24870)
- 方向: 工程架构
- 场景: 决策支持
- 关键词: `spo` `token` `prompt` `policy` `stream` `agentic` `actor` `whitens` `alfworld` `asynchronous`

### 8. CAFE: Self-Improving Search Agents Need Co-Evolving Feedback

- arXiv: [2608.24794](https://arxiv.org/abs/2608.24794)
- 方向: 其他
- 场景: 信息检索与问答
- 关键词: `feedback` `cafe` `agent` `search` `critic` `improving` `agents` `couples` `request` `outcome`

### 9. Evidence Blindness in Direct Corpus Interaction: Persistent Navigation with AtlasNav

- arXiv: [2608.24764](https://arxiv.org/abs/2608.24764)
- 方向: 其他
- 场景: 机器人与物理世界
- 关键词: `corpus` `atlasnav` `evidence` `interaction` `navigation` `blindness` `dci` `agentic` `direct` `budgets`

### 10. Joint Optimization of Tool Creation and Use for Large Language Model Agents

- arXiv: [2608.24571](https://arxiv.org/abs/2608.24571)
- 方向: 工程架构
- 场景: 决策支持
- 关键词: `tool` `a3b` `30b` `creation` `qwen3` `schemas` `invoke` `smith` `write` `schema`

## 研究趋势

**主导方向**：规划推理（13 篇），较上周（17 篇）下降。

**上升**: 安全对齐（1→7）

**下降**: 规划推理（17→13）、工程架构（7→4）、评估基准（14→7）、其他（16→10）、多智能体（9→5）、记忆系统（8→7）、自我进化（8→4）

## 技术演进脉络

**规划推理**（13 篇）

- [ReWorld: An Interactive World Model with Long-Horizon Memory](https://arxiv.org/abs/2608.23565)
- [Mitigating Reasoning-Induced Misalignment via Safety-Direction Penalty](https://arxiv.org/abs/2608.23497)
- [SRPO: Self-Reflective Policy Optimization for Long-Horizon Reasoning](https://arxiv.org/abs/2608.23493)
- *及另外 10 篇*

**其他**（10 篇）

- [Don&#039;t Solve, Just Compare: Tiny Advisors for Runtime Intervention in LLM Agents](https://arxiv.org/abs/2608.21027)
- [Prime Agent: A Self-Improving RLM Harness](https://arxiv.org/abs/2608.23552)
- [SkillAlchemy: Open-World Agent Skill Creation](https://arxiv.org/abs/2608.23417)
- *及另外 7 篇*

**评估基准**（7 篇）

- [VIALS: A Benchmark for Visual Interpretation of Artifacts in the Life Sciences](https://arxiv.org/abs/2608.21357)
- [ReFrame: Evidence-Guided Test-Time Safety Alignment in Multimodal Large Language Models](https://arxiv.org/abs/2608.21100)
- [CellPath-Bench: A Multidimensional Benchmark for Whole-Slide Cellular Representations in Pathology Foundation Models](https://arxiv.org/abs/2608.21060)
- *及另外 4 篇*

**安全对齐**（7 篇）

- [CLEAR: Continuous Latent Adapter Routing for Utility-Preserving LLM Safety Alignment](https://arxiv.org/abs/2608.21278)
- [ReFrame: Evidence-Guided Test-Time Safety Alignment in Multimodal Large Language Models](https://arxiv.org/abs/2608.21100)
- [Mitigating Reasoning-Induced Misalignment via Safety-Direction Penalty](https://arxiv.org/abs/2608.23497)
- *及另外 4 篇*

**记忆系统**（7 篇）

- [ReWorld: An Interactive World Model with Long-Horizon Memory](https://arxiv.org/abs/2608.23565)
- [Recursive Experiential-Working Memory Evolution for Long-Horizon Agent Harnesses](https://arxiv.org/abs/2608.24876)
- [Multi-Granularity Context-Enhanced RAG over Multimodal Knowledge Graphs](https://arxiv.org/abs/2608.25986)
- *及另外 4 篇*

**多智能体**（5 篇）

- [Pivot-and-Station Multi-Agent Path Finding: Solvability, Complexity, and Algorithms](https://arxiv.org/abs/2608.24585)
- [SwarmWorld: Stigmergic technological evolution in societies of language-model agents](https://arxiv.org/abs/2608.26081)
- [ProgRouter: Online Progress-Guided Orchestration for Multi-Agent LLM Workflows under Quality-Cost Tradeoffs](https://arxiv.org/abs/2608.25992)
- *及另外 2 篇*

**自我进化**（4 篇）

- [SRPO: Self-Reflective Policy Optimization for Long-Horizon Reasoning](https://arxiv.org/abs/2608.23493)
- [MediSkill-Evo: Process-Constrained Self-Evolution for Evidence-Grounded Clinical Interaction](https://arxiv.org/abs/2608.23397)
- [Meta$^n$: Recursive Self-Improvement through Emergent Depth](https://arxiv.org/abs/2608.24735)
- *及另外 1 篇*

**工程架构**（4 篇）

- [SRPO: Self-Reflective Policy Optimization for Long-Horizon Reasoning](https://arxiv.org/abs/2608.23493)
- [SPO++: Stream-Aligned Policy Optimization for Asynchronous Agentic RL](https://arxiv.org/abs/2608.24870)
- [Joint Optimization of Tool Creation and Use for Large Language Model Agents](https://arxiv.org/abs/2608.24571)
- *及另外 1 篇*

**工具使用**（1 篇）

- [Paint What You See: Benchmarking Dexterous Visual Tool Use in Multimodal Agents](https://arxiv.org/abs/2608.25417)

## 工程实践启示

- 工程架构方向 4 篇，关注系统设计与可扩展性。
- 工具使用方向 1 篇，function calling 与工具链持续演进。
- 记忆系统方向 7 篇，RAG 与长期记忆方案不断优化。
- 多智能体方向 5 篇，协作模式从简单分工走向复杂协调。
- 安全方向 7 篇，Agent 安全从外部围栏走向内化机制。

## 下周关注

**持续热点**：规划推理（本周 13 篇，上周 17 篇）、其他（本周 10 篇，上周 16 篇）、评估基准（本周 7 篇，上周 14 篇）、记忆系统（本周 7 篇，上周 8 篇）、多智能体（本周 5 篇，上周 9 篇）、自我进化（本周 4 篇，上周 8 篇）、工程架构（本周 4 篇，上周 7 篇）

## 附录：本周论文完整列表

去重后共 48 篇。

**2026-08-24**（5 篇）

1. [VIALS: A Benchmark for Visual Interpretation of Artifacts in the Life Sciences](https://arxiv.org/abs/2608.21357) — evaluation
2. [CLEAR: Continuous Latent Adapter Routing for Utility-Preserving LLM Safety Alignment](https://arxiv.org/abs/2608.21278) — safety
3. [ReFrame: Evidence-Guided Test-Time Safety Alignment in Multimodal Large Language Models](https://arxiv.org/abs/2608.21100) — safety, evaluation
4. [CellPath-Bench: A Multidimensional Benchmark for Whole-Slide Cellular Representations in Pathology Foundation Models](https://arxiv.org/abs/2608.21060) — evaluation
5. [Don&#039;t Solve, Just Compare: Tiny Advisors for Runtime Intervention in LLM Agents](https://arxiv.org/abs/2608.21027) — other

**2026-08-25**（11 篇）

1. [ReWorld: An Interactive World Model with Long-Horizon Memory](https://arxiv.org/abs/2608.23565) — memory, planning
2. [Prime Agent: A Self-Improving RLM Harness](https://arxiv.org/abs/2608.23552) — other
3. [EarthVerse: Benchmarking Scientific Agents Across Dynamic Earth Systems and Natural Hazards](https://arxiv.org/abs/2608.23525) — evaluation
4. [Mitigating Reasoning-Induced Misalignment via Safety-Direction Penalty](https://arxiv.org/abs/2608.23497) — planning, safety
5. [SRPO: Self-Reflective Policy Optimization for Long-Horizon Reasoning](https://arxiv.org/abs/2608.23493) — planning, evolution, engineering
6. [SkillAlchemy: Open-World Agent Skill Creation](https://arxiv.org/abs/2608.23417) — other
7. [MediSkill-Evo: Process-Constrained Self-Evolution for Evidence-Grounded Clinical Interaction](https://arxiv.org/abs/2608.23397) — evolution
8. [Agent-G$^2$: Gaussian Guidance for Agentic Reinforcement Learning](https://arxiv.org/abs/2608.23318) — other
9. [Apodex 1.1: Scaling Agentic Intelligence for Complex Work](https://arxiv.org/abs/2608.23283) — other
10. [Is Next-Chunk Reasoning RL Really Better than SFT? Revisiting Training Strategies under no-CoT Data](https://arxiv.org/abs/2608.23256) — planning
11. [Cognitive Profiling of LRMs&#039; Reasoning Traces Using Bloom&#039;s Taxonomy](https://arxiv.org/abs/2608.23205) — planning

**2026-08-26**（15 篇）

1. [Recursive Experiential-Working Memory Evolution for Long-Horizon Agent Harnesses](https://arxiv.org/abs/2608.24876) — memory
2. [SPO++: Stream-Aligned Policy Optimization for Asynchronous Agentic RL](https://arxiv.org/abs/2608.24870) — engineering
3. [CAFE: Self-Improving Search Agents Need Co-Evolving Feedback](https://arxiv.org/abs/2608.24794) — other
4. [Right Diagnoses, Decorative Reasoning:A Perturbation Audit of Medical Chain-of-Thought](https://arxiv.org/abs/2608.24790) — planning
5. [StepGuard: Learning Step-Level Guardrails with Scalable Supervision and Safety-Utility Balancing](https://arxiv.org/abs/2608.24777) — safety
6. [Evidence Blindness in Direct Corpus Interaction: Persistent Navigation with AtlasNav](https://arxiv.org/abs/2608.24764) — other
7. [Meta$^n$: Recursive Self-Improvement through Emergent Depth](https://arxiv.org/abs/2608.24735) — evolution
8. [Parason: Revealing Subtask and Trial Parallelism in LLM Reasoning](https://arxiv.org/abs/2608.24658) — planning
9. [Pivot-and-Station Multi-Agent Path Finding: Solvability, Complexity, and Algorithms](https://arxiv.org/abs/2608.24585) — multi_agent
10. [PhysMLLMs: Spatial Priors for Unified Referring Segmentation and Grounded Reasoning of Images and Videos](https://arxiv.org/abs/2608.24574) — planning
11. [Joint Optimization of Tool Creation and Use for Large Language Model Agents](https://arxiv.org/abs/2608.24571) — engineering
12. [EviDx: Evidence-Aware Active Diagnosis with Scaffolded LLM Agents](https://arxiv.org/abs/2608.24570) — other
13. [When &quot;Must&quot; Becomes &quot;Maybe&quot;: Constraint Weakening in LLM Agent Workflows](https://arxiv.org/abs/2608.24569) — other
14. [Discovering Adaptive Transmission Programs for Collective Innovation](https://arxiv.org/abs/2608.24545) — evolution
15. [Neurosymbolic Alignment for Physiologically-Safe Clinical Language Models](https://arxiv.org/abs/2608.24534) — safety

**2026-08-27**（17 篇）

1. [SwarmWorld: Stigmergic technological evolution in societies of language-model agents](https://arxiv.org/abs/2608.26081) — multi_agent
2. [Trace Integrity for LLM Data Agents: A Vision for Auditable Structured Reasoning in Real-World Systems](https://arxiv.org/abs/2608.26036) — planning
3. [AsymSpec: Context-Asymmetric Speculative Decoding for Agentic LLMs](https://arxiv.org/abs/2608.26004) — evaluation
4. [ProgRouter: Online Progress-Guided Orchestration for Multi-Agent LLM Workflows under Quality-Cost Tradeoffs](https://arxiv.org/abs/2608.25992) — multi_agent
5. [Multi-Granularity Context-Enhanced RAG over Multimodal Knowledge Graphs](https://arxiv.org/abs/2608.25986) — memory
6. [Quantitative Analysis of $ω$-Regular Robust MDPs](https://arxiv.org/abs/2608.25968) — other
7. [LivingRAG: Augmenting Graph RAG with Experience](https://arxiv.org/abs/2608.25960) — memory, planning
8. [Candidate supply and answer selection shape the value of LLM judging in multi-agent systems](https://arxiv.org/abs/2608.25937) — multi_agent
9. [How Robust Are Automated Fact-Checking Systems? A Cross-Benchmark Evaluation](https://arxiv.org/abs/2608.25934) — evaluation
10. [Repair or Resample? Rethinking Failure Debugging in LLM Multi-Agent Systems](https://arxiv.org/abs/2608.25920) — multi_agent
11. [LocalLSTC: A Long Short-Term Control Architecture for Locally Deployed GUI Agents](https://arxiv.org/abs/2608.25777) — planning, engineering
12. [Agentic Game Development as a Verifiable Trajectory Data Engine for Scaling World Models](https://arxiv.org/abs/2608.25518) — planning
13. [CaSKG: Counterfactual-Causal Skill Graphs for Scalable Agent Skill Retrieval](https://arxiv.org/abs/2608.25500) — memory
14. [PonsRAG: A Pons-Inspired RAG Bridging Cognitive Islands for Coordinated Long Narrative Reasoning](https://arxiv.org/abs/2608.25486) — memory, planning
15. [Training Alignment Auditors via Reinforcement Learning](https://arxiv.org/abs/2608.25460) — safety
16. [Distance Is Not Enough: Forget-Retain Alignment Gap Predicts LLM Relearning Robustness](https://arxiv.org/abs/2608.25429) — memory, safety
17. [Paint What You See: Benchmarking Dexterous Visual Tool Use in Multimodal Agents](https://arxiv.org/abs/2608.25417) — tool, evaluation

---

*本报告由 OpenClaw 自动生成，基于 agent-papers-research 每日数据聚合。*
