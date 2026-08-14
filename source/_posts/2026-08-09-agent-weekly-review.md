---
title: Agent 研究周度深度综述（2026-08-03 ~ 2026-08-09）
tags:
  - Agent
  - LLM
  - 周报
  - 深度综述
categories:
  - AI架构
  - Agent系统
abbrlink: 36421
date: 2026-08-09 20:00:00
---

> 数据来源：[papers.cool/arxiv/cs.AI](https://papers.cool/arxiv/cs.AI) · 生成时间：2026/8/7 17:00:05
> 本报告聚合本周 arXiv cs.AI 的 Agent 相关论文，跨天去重后深度分析。

## 本周总览

本周去重后共 **17** 篇论文，覆盖 1 天数据。上周 12 篇，环比增加 5 篇。

### 研究方向分布

| 方向 | 本周 | 上周 | 变化 |
|------|------|------|------|
| 规划推理 | 7 | 2 | +5 |
| 其他 | 5 | 5 | 0 |
| 评估基准 | 4 | 2 | +2 |
| 记忆系统 | 4 | 0 | +4 |
| 安全对齐 | 1 | 1 | 0 |
| 工具使用 | 1 | 0 | +1 |
| 多智能体 | 1 | 2 | -1 |

### 应用场景分布

| 场景 | 论文数 | 占比 |
|------|--------|------|
| 决策支持 | 2 | 12% |
| 信息检索与问答 | 2 | 12% |
| 代码开发 | 1 | 6% |
| 企业自动化 | 1 | 6% |
| 科学研究 | 1 | 6% |

## 核心论文解读

### 1. CoPlan: A Trustworthy Co-Intelligence Interface for Care Planning through Role-Based Contestable Argument Graphs

- arXiv: [2608.05107](https://arxiv.org/abs/2608.05107)
- 方向: 规划推理 · 评估基准
- 场景: 决策支持
- 关键词: `coplan` `care` `contestable` `planning` `clinical` `trustworthy` `interface` `human` `argument` `agents`

### 2. ContextWeave: A Real-World Workflow Benchmark

- arXiv: [2608.04830](https://arxiv.org/abs/2608.04830)
- 方向: 记忆系统 · 评估基准
- 场景: 企业自动化
- 关键词: `contextweave` `memory` `recall` `workflow` `workspace` `misleading` `workflows` `tasks` `relevance` `568`

### 3. EviGraph: Evidence-Guided Autonomous Research Agents

- arXiv: [2608.04738](https://arxiv.org/abs/2608.04738)
- 方向: 其他
- 场景: 科学研究、信息检索与问答
- 关键词: `evigraph` `research` `evidence` `claim` `autonomous` `manuscripts` `nanoresearch` `inconsistencies` `agents` `graph`

### 4. A/B Agent: A Self-Evolving Agent for Strategy Iteration in Industrial A/B Testing

- arXiv: [2608.04625](https://arxiv.org/abs/2608.04625)
- 方向: 记忆系统 · 评估基准
- 场景: 决策支持
- 关键词: `strategy` `agent` `strategies` `recommendation` `industrial` `historical` `rag` `iteration` `experience` `tree`

### 5. OctoLong: Mid-Training On Cross-Repository Code Contexts Enhances Long-Context Modeling

- arXiv: [2608.05141](https://arxiv.org/abs/2608.05141)
- 方向: 其他
- 场景: 代码开发
- 关键词: `octolong` `context` `code` `long` `contexts` `lms` `agentic` `tokens` `repository` `mid`

### 6. ABSeeker: Training Long-Horizon Search Agents via Answer-Backtracked Credit Assignment

- arXiv: [2608.05102](https://arxiv.org/abs/2608.05102)
- 方向: 其他
- 场景: 信息检索与问答
- 关键词: `backtracked` `answer` `abseeker` `agents` `abc` `credit` `grpo` `rewards` `assignment` `search`

### 7. Item Response Theory for AI Safety

- arXiv: [2608.05086](https://arxiv.org/abs/2608.05086)
- 方向: 安全对齐 · 评估基准
- 关键词: `irt` `benchmarks` `safety` `psychometric` `items` `item` `sandbag` `toolkit` `sandbagging` `psychometrically`

### 8. Diagnosing Tool-Selection Reasoning in LLM Agents with Canary Tools

- arXiv: [2608.04719](https://arxiv.org/abs/2608.04719)
- 方向: 记忆系统 · 规划推理
- 关键词: `canary` `capability` `mirages` `tools` `tool` `decoys` `susceptibility` `csr` `hosted` `provider`

### 9. Calibrating Artificial Guilt: Neurally Grounded Reward Shaping for Prosocial Multi-Agent Reinforcement Learning

- arXiv: [2608.04663](https://arxiv.org/abs/2608.04663)
- 方向: 工具使用 · 多智能体
- 关键词: `guilt` `prosocial` `neurally` `shaping` `social` `calibrated` `agent` `human` `reward` `artificial`

### 10. Argus: A General-Purpose Agentic Runtime for Long-Horizon Reasoning

- arXiv: [2608.05144](https://arxiv.org/abs/2608.05144)
- 方向: 规划推理
- 关键词: `argus` `runtime` `agentic` `bench` `swe` `owned` `self` `verification` `rwkv6` `missions`

## 研究趋势

**主导方向**：规划推理（7 篇），较上周（2 篇）上升。

**上升**: 规划推理（2→7）、评估基准（2→4）、记忆系统（0→4）、工具使用（0→1）

**下降**: 工程架构（2→0）、多智能体（2→1）

## 技术演进脉络

**规划推理**（7 篇）

- [Argus: A General-Purpose Agentic Runtime for Long-Horizon Reasoning](https://arxiv.org/abs/2608.05144)
- [CoPlan: A Trustworthy Co-Intelligence Interface for Care Planning through Role-Based Contestable Argument Graphs](https://arxiv.org/abs/2608.05107)
- [WorldCycle: Self-Verifiable Reinforcement Learning for Long-Horizon Video World Models](https://arxiv.org/abs/2608.04964)
- *及另外 4 篇*

**其他**（5 篇）

- [OctoLong: Mid-Training On Cross-Repository Code Contexts Enhances Long-Context Modeling](https://arxiv.org/abs/2608.05141)
- [ABSeeker: Training Long-Horizon Search Agents via Answer-Backtracked Credit Assignment](https://arxiv.org/abs/2608.05102)
- [EviGraph: Evidence-Guided Autonomous Research Agents](https://arxiv.org/abs/2608.04738)
- *及另外 2 篇*

**评估基准**（4 篇）

- [CoPlan: A Trustworthy Co-Intelligence Interface for Care Planning through Role-Based Contestable Argument Graphs](https://arxiv.org/abs/2608.05107)
- [Item Response Theory for AI Safety](https://arxiv.org/abs/2608.05086)
- [ContextWeave: A Real-World Workflow Benchmark](https://arxiv.org/abs/2608.04830)
- *及另外 1 篇*

**记忆系统**（4 篇）

- [Hierarchical Graph Memory for LLM Agents with Path-level Localization and Rewrite](https://arxiv.org/abs/2608.05095)
- [ContextWeave: A Real-World Workflow Benchmark](https://arxiv.org/abs/2608.04830)
- [Diagnosing Tool-Selection Reasoning in LLM Agents with Canary Tools](https://arxiv.org/abs/2608.04719)
- *及另外 1 篇*

**安全对齐**（1 篇）

- [Item Response Theory for AI Safety](https://arxiv.org/abs/2608.05086)

**工具使用**（1 篇）

- [Calibrating Artificial Guilt: Neurally Grounded Reward Shaping for Prosocial Multi-Agent Reinforcement Learning](https://arxiv.org/abs/2608.04663)

**多智能体**（1 篇）

- [Calibrating Artificial Guilt: Neurally Grounded Reward Shaping for Prosocial Multi-Agent Reinforcement Learning](https://arxiv.org/abs/2608.04663)

## 工程实践启示

- 工具使用方向 1 篇，function calling 与工具链持续演进。
- 记忆系统方向 4 篇，RAG 与长期记忆方案不断优化。
- 多智能体方向 1 篇，协作模式从简单分工走向复杂协调。
- 安全方向 1 篇，Agent 安全从外部围栏走向内化机制。

## 下周关注

**持续热点**：规划推理（本周 7 篇，上周 2 篇）、其他（本周 5 篇，上周 5 篇）、评估基准（本周 4 篇，上周 2 篇）

**新出现方向**：记忆系统（4 篇）、工具使用（1 篇）

## 附录：本周论文完整列表

去重后共 17 篇。

**2026-08-06**（17 篇）

1. [Argus: A General-Purpose Agentic Runtime for Long-Horizon Reasoning](https://arxiv.org/abs/2608.05144) — planning
2. [OctoLong: Mid-Training On Cross-Repository Code Contexts Enhances Long-Context Modeling](https://arxiv.org/abs/2608.05141) — other
3. [CoPlan: A Trustworthy Co-Intelligence Interface for Care Planning through Role-Based Contestable Argument Graphs](https://arxiv.org/abs/2608.05107) — planning, evaluation
4. [ABSeeker: Training Long-Horizon Search Agents via Answer-Backtracked Credit Assignment](https://arxiv.org/abs/2608.05102) — other
5. [Hierarchical Graph Memory for LLM Agents with Path-level Localization and Rewrite](https://arxiv.org/abs/2608.05095) — memory
6. [Item Response Theory for AI Safety](https://arxiv.org/abs/2608.05086) — safety, evaluation
7. [WorldCycle: Self-Verifiable Reinforcement Learning for Long-Horizon Video World Models](https://arxiv.org/abs/2608.04964) — planning
8. [ContextWeave: A Real-World Workflow Benchmark](https://arxiv.org/abs/2608.04830) — memory, evaluation
9. [Privileged, but Biased: How PI-Conditioned Teachers Break Self-Distillation](https://arxiv.org/abs/2608.04794) — planning
10. [Fewer Tokens, Smaller Cache: Reward-Coordinated Efficient Reasoning](https://arxiv.org/abs/2608.04771) — planning
11. [EviGraph: Evidence-Guided Autonomous Research Agents](https://arxiv.org/abs/2608.04738) — other
12. [When Prompts Become Pixels: Prompt-Region Grounding for Multimodal Reasoning](https://arxiv.org/abs/2608.04726) — planning
13. [Diagnosing Tool-Selection Reasoning in LLM Agents with Canary Tools](https://arxiv.org/abs/2608.04719) — memory, planning
14. [Calibrating Artificial Guilt: Neurally Grounded Reward Shaping for Prosocial Multi-Agent Reinforcement Learning](https://arxiv.org/abs/2608.04663) — tool, multi_agent
15. [A/B Agent: A Self-Evolving Agent for Strategy Iteration in Industrial A/B Testing](https://arxiv.org/abs/2608.04625) — memory, evaluation
16. [Joint UAV Flight and Opportunistic Routing under Reinforcement Learning for Delay-Tolerant Networks](https://arxiv.org/abs/2608.04590) — other
17. [What Is a Skill Worth? Structure-Aware Shapley Valuation of Agent Skills](https://arxiv.org/abs/2608.04562) — other

---

*本报告由 OpenClaw 自动生成，基于 agent-papers-research 每日数据聚合。*
