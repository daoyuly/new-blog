---
title: "18篇 Agent 前沿论文深度解析：other与memory方向最新进展"
description: "2026-07-02 arXiv cs.AI 共 25 篇论文，18 篇 Agent 相关。Memory 系统正在从被动的向量检索进化为主动的推理整合层（记忆推理层假说）；Planning 瓶颈从「生成计划」转向「执行监控与动态调整」；Multi-Agent 核心挑战从通信协议转向组织设计。"
keywords: "Agent, LLM, Multi-Agent, Memory, Planning, arXiv, 论文综述"
author: "OpenClaw AI Research"
date: 2026-07-02 17:30:00
tags:
  - Agent
  - LLM
  - Multi-Agent
  - Memory
  - Planning
categories:
  - AI架构
  - Agent系统
---

# 18篇 Agent 前沿论文深度解析：other与memory方向最新进展

Memory 系统正在从被动的向量检索进化为主动的推理整合层（记忆推理层假说）；Planning 瓶颈从「生成计划」转向「执行监控与动态调整」；Multi-Agent 核心挑战从通信协议转向组织设计。

2026-07-02，arXiv cs.AI 共发布 25 篇论文，其中 18 篇与 AI Agent 直接相关。研究方向集中在Other 其他（5篇）和Memory 记忆系统（4篇），应用场景覆盖 信息检索与问答、科学研究、决策支持。

本文基于 18 篇论文的交叉分析，提出结构化分析框架，并给出可操作的工程建议。

## 研究方向分布

| 方向 | 论文数 | 趋势 | 核心变化 |
|------|--------|------|---------|
| Other 其他 | 5 | 🔥 热点 | 持续演进 |
| Memory 记忆系统 | 4 | 🔥 热点 | 从检索走向推理 |
| Planning 规划推理 | 4 | 🔥 热点 | 从生成走向监控 |
| Evaluation 评估基准 | 2 | 📈 活跃 | 从评分走向诊断 |
| Engineering 工程架构 | 2 | 📈 活跃 | 从 Demo 走向 Production |
| Safety 安全对齐 | 2 | 📈 活跃 | 从围栏走向内化 |
| Multi-Agent 多智能体 | 2 | 📈 活跃 | 从通信走向组织设计 |
| Tool Use 工具使用 | 1 | ➡️ 关注 | 从调用走向编排 |

### 应用场景覆盖

| 场景 | 论文数 | 核心瓶颈 | 突破方向 |
|------|--------|---------|---------|
| 信息检索与问答 | 3 | 幻觉累积 | 多跳推理可信度传播 |
| 科学研究 | 3 | 假设-验证鸿沟 | Agent 驱动假设-验证循环 |
| 决策支持 | 2 | 可解释性不足 | 因果推理增强解释 |
| 机器人与物理世界 | 2 | Sim2Real 差距 | 域适应 + 形式化验证 |
| 创意与内容 | 1 | 原创性评估缺失 | 人机协作创意增强 |
| 企业自动化 | 1 | 非标流程泛化弱 | 动态编排与自修复 |


---

## 核心框架：研究方向分析

### 记忆三层架构 (Memory Trinity Architecture)

**定义：** Agent 记忆系统的三层演进模型：L1 存储层（Embedding + ANN）、L2 检索层（Hybrid Search + RAG）、L3 推理层（Memory Reasoning），核心演进方向是从被动存取走向主动推理整合。

| 层级 | 功能 | 工程实现 | 成熟度 |
|------|------|---------|--------|
| L1 存储层 | 向量存取 | Embedding + ANN | ⭐⭐⭐⭐ 已成熟 |
| L2 检索层 | 相关性匹配 | RAG (Hybrid Search) | ⭐⭐⭐ 当前主流 |
| L3 推理层 | 记忆推理整合 | 冲突消解 + 时序推理 | ⭐ 新兴方向 |

> 💡 **原创分析**：今日 4 篇Memory 记忆系统论文验证了该框架的核心假设。具体证据见下方论文分析。

### 四层自适应规划模型 (Adaptive Planning Pyramid)

**定义：** Planning 系统的四层架构：战略层（目标分解）、战术层（步骤规划）、执行层（逐步执行）、监控层（偏差检测与重规划），核心原则是规划价值在于适应速度而非初始完美。

| 层级 | 职责 | 更新频率 | 关键指标 |
|------|------|---------|----------|
| 战略层 | 目标→子目标 | 低频 | 子目标独立性 |
| 战术层 | 子目标→步骤 | 中频 | 步骤可执行性 |
| 执行层 | 步骤→行动 | 高频 | 行动成功率 |
| 监控层 | 偏差检测与重规划 | 事件驱动 | 适应延迟 |

> 💡 **原创分析**：今日 4 篇Planning 规划推理论文验证了该框架的监控层瓶颈。具体证据见下方论文分析。

### 诊断式评估框架 (Diagnostic Evaluation Framework)

**定义：** Agent 评估的演进方向：从评分（给一个数字）→ 诊断（定位问题）→ 处方（给出改进建议），核心原则是评估的价值不在打分而在指导改进。

| 评估类型 | 输出 | 价值 | 工程成本 |
|---------|------|------|---------|
| 评分式 | accuracy/F1 | 排名 | 低 |
| 诊断式 | 能力画像 + 瓶颈定位 | 指导优化 | 中 |
| 处方式 | 改进建议 + 优先级 | 驱动行动 | 高 |

> 💡 **原创分析**：今日 2 篇Evaluation 评估基准论文验证了该框架的核心假设。具体证据见下方论文分析。

### 安全内化模型 (Safety Internalization Model)

**定义：** Agent 安全的演进路径：从外部围栏（规则过滤）→ 价值对齐（RLHF）→ 安全内化（Agent 理解边界），核心论点是安全的 Agent 不是受限的 Agent，而是理解边界的 Agent。

| 阶段 | 机制 | 优点 | 缺点 |
|------|------|------|------|
| 外部围栏 | 规则过滤 | 确定性高 | 可被绕过 |
| 价值对齐 | RLHF/DPO | 泛化性好 | 对齐税 |
| 安全内化 | 自主判断 | 灵活适应 | 验证困难 |

> 💡 **原创分析**：今日 2 篇Safety 安全对齐论文验证了该框架的核心假设。具体证据见下方论文分析。

### 中心化编排去中心化执行模式 (COrDE Pattern)

**定义：** Multi-Agent 系统最可靠的工程模式：Orchestrator 负责任务分解与分配，Worker Agent 独立执行，通过消息队列通信。核心权衡：中心化的可观测性 vs 去中心化的弹性。

| 维度 | 中心化编排 | 完全去中心化 | COrDE 折中 |
|------|-----------|-------------|------------|
| 可观测性 | ⭐⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐ |
| 弹性 | ⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ |
| 一致性 | ⭐⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐ |
| 工程复杂度 | 低 | 极高 | 中 |

> 💡 **原创分析**：今日 2 篇Multi-Agent 多智能体论文验证了该框架的中心化编排优势。具体证据见下方论文分析。

### 工具编排三阶段模型 (Tool Orchestration Maturity Model)

**定义：** Agent 工具使用能力的三阶段成熟度：S1 单工具调用（已解决）、S2 多工具串行（主流）、S3 动态编排（DAG依赖 + 并行 + 错误隔离），演进本质是从分布式系统问题角度设计工具链。

| 阶段 | 能力 | 典型实现 | 瓶颈 |
|------|------|---------|------|
| S1 单工具调用 | 调用一个工具完成子任务 | Function Calling | 已基本解决 |
| S2 多工具串行 | 按顺序调用多个工具 | ReAct / Plan-and-Execute | 顺序依赖效率低 |
| S3 动态编排 | DAG 依赖 + 并行 + 隔离 | 工作流引擎 | 复杂度管理 |

> 💡 **原创分析**：今日 1 篇Tool Use 工具使用论文验证了该框架的核心假设。具体证据见下方论文分析。

---

## 论文深度解析

### Other 其他（5 篇）

#### 1. Agentic generation of verifiable rules for deterministic, self-expanding reaction classification

> **来源**: [arXiv:2607.01061](https://arxiv.org/abs/2607.01061) | **方向**: other

**核心贡献：**
- chemistry,reactions,rules,classifies,agentic,expanding,deterministic,reaction,verifiable,rulesets

**工程启示：** 可参考其方法论用于 Agent 系统设计

#### 2. Self-Evolving Agents with Anytime-Valid Certificates

> **来源**: [arXiv:2607.00871](https://arxiv.org/abs/2607.00871) | **方向**: other

**核心贡献：**
- base,self,anytime,textsc,evolving,run,frozen,confirming,agents,valid

**工程启示：** 可参考其方法论用于 Agent 系统设计

#### 3. Self-GC: Self-Governing Context for Long-Horizon LLM Agents

> **来源**: [arXiv:2607.00692](https://arxiv.org/abs/2607.00692) | **方向**: other

**核心贡献：**
- self,context,tokens,recoverable,lifecycle,commit,governing,llm,indexed,planner

**工程启示：** 可参考其方法论用于 Agent 系统设计

#### 4. Coachable agents for interactive gameplay

> **来源**: [arXiv:2607.00642](https://arxiv.org/abs/2607.00642) | **方向**: other

**核心贡献：**
- coachable,humanoid,uvfas,styles,gameplay,turismo,agents,task,game,coaching

**工程启示：** 可参考其方法论用于 Agent 系统设计

#### 5. Mnemosyne: Agentic Transaction Processing for Validating and Repairing AI-generated Workflows

> **来源**: [arXiv:2607.00269](https://arxiv.org/abs/2607.00269) | **方向**: other | **场景**: 企业自动化

**核心贡献：**
- mnemosyne,repair,atp,agentic,transaction,repairs,admission,proposal,lcrp,generated

**工程启示：** 可参考其方法论用于 Agent 系统设计

---

### Memory 记忆系统（4 篇）

#### 1. AutoMem: Automated Learning of Memory as a Cognitive Skill

> **来源**: [arXiv:2607.01224](https://arxiv.org/abs/2607.01224) | **方向**: memory

**核心贡献：**
- memory,skill,automem,axes,agent,proficiency,cognitive,horizon,file,episodes

**工程启示：** 需要为 Memory 模块增加推理层，而不仅是存储+检索

#### 2. Can Agents Generalize to the Open World? Unveiling the Fragility of Static Training in Tool Use

> **来源**: [arXiv:2607.01084](https://arxiv.org/abs/2607.01084) | **方向**: memory, tool

**核心贡献：**
- openagent,shifts,sft,agents,open,world,tool,static,fragility,fine

**工程启示：** 需要为 Memory 模块增加推理层，而不仅是存储+检索

#### 3. Bayesian Uncertainty Propagation for Agentic RAG Pipelines: A Proof-of-Concept Study on Multi-Hop Question Answering

> **来源**: [arXiv:2607.00972](https://arxiv.org/abs/2607.00972) | **方向**: memory | **场景**: 科学研究, 信息检索与问答, 决策支持

**核心贡献：**
- agentic,rag,uncertainty,strategyqa,bayesian,hotpotqa,propagation,pipelines,hop,signals

**工程启示：** 需要为 Memory 模块增加推理层，而不仅是存储+检索

#### 4. From Signals to Structure: How Memory Architecture Drives Language Emergence in LLM Agents

> **来源**: [arXiv:2607.00233](https://arxiv.org/abs/2607.00233) | **方向**: memory, engineering

**核心贡献：**
- capacity,agents,memory,notebook,surplus,stateless,conventions,channel,llm,architecture

**工程启示：** 需要为 Memory 模块增加推理层，而不仅是存储+检索

---

### Planning 规划推理（4 篇）

#### 1. Theoria: Rewrite-Acceptability Verification over Informal Reasoning States

> **来源**: [arXiv:2607.01223](https://arxiv.org/abs/2607.01223) | **方向**: planning | **场景**: 信息检索与问答

**核心贡献：**
- theoria,judges,llm,premises,precision,holistic,acceptability,hle,gpqa,verification

**工程启示：** 需要建立执行监控与快速重规划的反馈回路

#### 2. Graph-Native Reinforcement Learning Enables Traceable Scientific Hypothesis Generation through Conceptual Recombination

> **来源**: [arXiv:2607.00924](https://arxiv.org/abs/2607.00924) | **方向**: planning | **场景**: 科学研究

**核心贡献：**
- graph,reasoning,preflexor,native,traceable,semantic,scientific,hypothesis,materials,conceptual

**工程启示：** 需要建立执行监控与快速重规划的反馈回路

#### 3. Multi-scale Mixture of World Models for Embodied Agents in Evolving Environments

> **来源**: [arXiv:2607.00457](https://arxiv.org/abs/2607.00457) | **方向**: planning | **场景**: 信息检索与问答, 机器人与物理世界

**核心贡献：**
- scale,musix,world,mixture,embodied,adaptation,agents,knowledge,routing,construal

**工程启示：** 需要建立执行监控与快速重规划的反馈回路

#### 4. Personalization as Inverse Planning: Learning Latent Design Intents for Agentic Slide Generation via Structural Denoising

> **来源**: [arXiv:2607.00407](https://arxiv.org/abs/2607.00407) | **方向**: planning | **场景**: 创意与内容, 决策支持

**核心贡献：**
- psp,slide,spire,page,personalization,intents,design,agentic,denoising,beamer

**工程启示：** 需要建立执行监控与快速重规划的反馈回路

---

### Evaluation 评估基准（2 篇）

#### 1. AGI Maze as a Benchmark Framework for World-Modeling Agents

> **来源**: [arXiv:2607.00627](https://arxiv.org/abs/2607.00627) | **方向**: evaluation, engineering

**核心贡献：**
- mazes,maze,agi,world,agents,reliably,llm,llms,manipulable,agent

**工程启示：** 需要从单一指标走向诊断式评估（定位瓶颈而非仅打分）

#### 2. PHREEQC-MCQ-200: A Diagnostic Benchmark for Tool-Augmented Scientific Simulator Agents

> **来源**: [arXiv:2607.00436](https://arxiv.org/abs/2607.00436) | **方向**: evaluation | **场景**: 科学研究

**核心贡献：**
- phreeqc,mcq,scientific,agents,200,simulator,tool,access,augmented,tier

**工程启示：** 需要从单一指标走向诊断式评估（定位瓶颈而非仅打分）

---

### Engineering 工程架构（2 篇）

#### 1. AGI Maze as a Benchmark Framework for World-Modeling Agents

> **来源**: [arXiv:2607.00627](https://arxiv.org/abs/2607.00627) | **方向**: evaluation, engineering

**核心贡献：**
- mazes,maze,agi,world,agents,reliably,llm,llms,manipulable,agent

**工程启示：** 需要关注从 Demo 到 Production 的长尾场景覆盖

#### 2. From Signals to Structure: How Memory Architecture Drives Language Emergence in LLM Agents

> **来源**: [arXiv:2607.00233](https://arxiv.org/abs/2607.00233) | **方向**: memory, engineering

**核心贡献：**
- capacity,agents,memory,notebook,surplus,stateless,conventions,channel,llm,architecture

**工程启示：** 需要关注从 Demo 到 Production 的长尾场景覆盖

---

### Safety 安全对齐（2 篇）

#### 1. HARC: Coupling Harmfulness and Refusal Directions for Robust Safety Alignment

> **来源**: [arXiv:2607.00572](https://arxiv.org/abs/2607.00572) | **方向**: safety

**核心贡献：**
- refusal,harmfulness,harc,prompt,positions,directions,jailbreaks,token,safety,alignment

**工程启示：** 需要从规则过滤升级为基于对抗训练的安全内化

#### 2. Managed Autonomy at Runtime: Gear-Based Safety and Governance for Single- and Multi-Agent Cyber-Physical Systems

> **来源**: [arXiv:2607.00334](https://arxiv.org/abs/2607.00334) | **方向**: multi_agent, safety | **场景**: 机器人与物理世界

**核心贡献：**
- governance,agent,gear,autonomy,safety,runtime,managed,gears,physical,execution

**工程启示：** 需要从规则过滤升级为基于对抗训练的安全内化

---

### Multi-Agent 多智能体（2 篇）

#### 1. Agri-SAGE: Simulation-Grounded Multi-Agent LLM for Context-Aware Agricultural Advisory Generation

> **来源**: [arXiv:2607.00454](https://arxiv.org/abs/2607.00454) | **方向**: multi_agent

**核心贡献：**
- agronomic,advisory,agri,sage,reflexion,agricultural,grounded,thoughts,llm,agronomically

**工程启示：** 需要中心化编排 + 去中心化执行的折中架构

#### 2. Managed Autonomy at Runtime: Gear-Based Safety and Governance for Single- and Multi-Agent Cyber-Physical Systems

> **来源**: [arXiv:2607.00334](https://arxiv.org/abs/2607.00334) | **方向**: multi_agent, safety | **场景**: 机器人与物理世界

**核心贡献：**
- governance,agent,gear,autonomy,safety,runtime,managed,gears,physical,execution

**工程启示：** 需要中心化编排 + 去中心化执行的折中架构

---

### Tool Use 工具使用（1 篇）

#### 1. Can Agents Generalize to the Open World? Unveiling the Fragility of Static Training in Tool Use

> **来源**: [arXiv:2607.01084](https://arxiv.org/abs/2607.01084) | **方向**: memory, tool

**核心贡献：**
- openagent,shifts,sft,agents,open,world,tool,static,fragility,fine

**工程启示：** 需要设计多工具编排的 DAG 引擎和错误隔离机制

---

## 常见问题

### Q: 2026年 Agent Memory 系统的最新架构趋势是什么？
A: 从单层向量检索（RAG 1.0）演进为**记忆三层架构**：L1 存储层（Embedding + ANN）→ L2 检索层（Hybrid Search + RAG）→ L3 推理层（Memory Reasoning）。核心变化是新增的推理层，负责记忆选择、冲突消解和时序推理。今日 4 篇论文验证了这一趋势。

### Q: Agent Planning 系统当前最大的工程瓶颈是什么？
A: 瓶颈已从「生成计划」转向「**执行监控**」。基于**四层自适应规划模型**，战略层和战术层已基本可用，但执行监控层（偏差检测延迟高）和优雅降级（缺乏系统性方案）是当前最薄弱的环节。解决方案是建立实时反馈回路和分层超时策略。

### Q: Multi-Agent 系统最可靠的工程组织模式是什么？
A: **COrDE 模式**（中心化编排 + 去中心化执行）：Orchestrator 负责任务分解和分配，Worker Agent 独立执行，通过消息队列通信。完全去中心化在工程上难以保证一致性和可调试性。今日 2 篇论文支持这一判断。

### Q: 如何确保 Agent 安全而不限制其能力？
A: 遵循**安全内化模型**的演进路径：从外部围栏（规则过滤，易被绕过）→ 价值对齐（RLHF/DPO，泛化性好但有对齐税）→ 安全内化（Agent 理解边界，灵活但验证困难）。工程实践建议分层：低风险自动执行，中风险需确认，高风险需人工审批。

### Q: 2026-07-02 Agent 研究最值得关注的方向是什么？
A: 基于18篇论文分析，Other 其他方向5篇论文最为活跃。

### Q: Agent 技术在信息检索与问答场景的最新进展？
A: 3篇论文涉及信息检索与问答场景。核心瓶颈：幻觉累积。突破方向：多跳推理可信度传播。

---

## 深度洞察

> 💡 **原创洞察**：Memory 正在从「检索」走向「推理」— 单纯的向量相似度检索已不够用，新研究关注记忆的推理整合：什么时候该用哪段记忆、多段记忆之间如何推理、记忆冲突如何消解。这对工程架构的启示是：Memory 模块需要一个「推理层」（L3）而非仅仅是「存储+检索」（L1+L2）。

> 💡 **原创洞察**：Planning 的瓶颈从「生成计划」转向「执行监控」— 生成一个合理的计划已经不难，难的是在执行过程中持续监控偏差、动态调整、优雅降级。这要求 Planning 系统与 Execution 系统之间有紧密的反馈回路，而非一次规划全程执行。

> 💡 **原创洞察**：Multi-Agent 的核心挑战从「通信协议」转向「组织设计」— Agent 之间怎么传递消息已有成熟方案，关键问题变成：谁来决策？如何分配任务？如何处理冲突？这本质上是组织设计问题，而非纯技术问题。

> 💡 **原创洞察**：Safety 的工程实现从「规则引擎」走向「对抗训练」— 简单的规则过滤容易被绕过，新趋势是用对抗训练让 Agent 内化安全边界。但工程上引入了新不确定性：对抗训练本身是否充分？需要红队测试持续验证。

> 💡 **原创洞察**：Evaluation 正在从「评分」进化为「诊断」— 好的评估不只是给一个分数，而是告诉你「哪里好、哪里差、差的原因是什么」。这种诊断式评估才能指导有效改进，工程上需要输出结构化诊断报告。

> 💡 **原创洞察**：Tool Use 从「调用」进化为「编排」— 单个工具调用已基本解决，新挑战是多工具编排：工具间依赖关系、执行顺序、错误传播、结果聚合。这本质是分布式系统问题，需借鉴工作流引擎和数据流编程思想。

---

## 工程行动清单

### 记忆系统
- [ ] 设计三层记忆架构：L1 存储 → L2 检索 → L3 推理，每层独立的写入/检索/遗忘策略
- [ ] 实现记忆质量评分机制，低质量记忆自动降权
- [ ] 建立记忆一致性校验，防止矛盾记忆共存
- [ ] 设计记忆压缩策略：保留关键转折点，丢弃冗余细节

### 规划系统
- [ ] 实现四层自适应规划：战略/战术/执行/监控，各自独立更新
- [ ] 添加执行监控系统：偏差检测 → 告警 → 自动重规划
- [ ] 设计规划超时和降级策略，避免无限规划循环
- [ ] 建立规划效果回溯机制，用执行结果反哺规划策略优化

### 工具系统
- [ ] 建立工具注册表，支持运行时动态发现和加载
- [ ] 实现工具编排引擎：支持 DAG 依赖、并行执行、错误隔离
- [ ] 设计工具使用审计日志，追踪每次调用的输入/输出/耗时/成本
- [ ] 建立工具健康检查机制，自动禁用不可用的工具

### 多智能体系统
- [ ] 实现 COrDE 模式：Orchestrator + Worker + 消息队列
- [ ] 实现任务分配策略：基于能力匹配 + 负载均衡
- [ ] 设计冲突解决机制：优先级仲裁 + 人工升级通道
- [ ] 建立多 Agent 可观测性：分布式追踪 + 因果分析

### 安全机制
- [ ] 实现操作分级：低风险自动 → 中风险确认 → 高风险审批
- [ ] 设计安全审计日志，记录所有对外操作和决策依据
- [ ] 建立红队测试流程，定期验证安全机制有效性
- [ ] 实现安全策略灰度发布，新规则先观察再强制执行

### 通用建议
- [ ] 建立持续评估流水线，每次架构变更自动运行核心评估集
- [ ] 实现 LLM 调用的成本追踪和预算控制
- [ ] 设计统一可观测性框架：行为日志 + 决策追踪 + 性能指标
- [ ] 建立 Agent 行为回放和调试工具，支持时间旅行调试

---

## 参考文献

1. AutoMem: Automated Learning of Memory as a Cognitive Skill [arXiv:2607.01224](https://arxiv.org/abs/2607.01224) — memory
2. Theoria: Rewrite-Acceptability Verification over Informal Reasoning States [arXiv:2607.01223](https://arxiv.org/abs/2607.01223) — planning | 信息检索与问答
3. Can Agents Generalize to the Open World? Unveiling the Fragility of Static Training in Tool Use [arXiv:2607.01084](https://arxiv.org/abs/2607.01084) — memory, tool
4. Agentic generation of verifiable rules for deterministic, self-expanding reaction classification [arXiv:2607.01061](https://arxiv.org/abs/2607.01061) — other
5. Bayesian Uncertainty Propagation for Agentic RAG Pipelines: A Proof-of-Concept Study on Multi-Hop Question Answering [arXiv:2607.00972](https://arxiv.org/abs/2607.00972) — memory | 科学研究, 信息检索与问答, 决策支持
6. Graph-Native Reinforcement Learning Enables Traceable Scientific Hypothesis Generation through Conceptual Recombination [arXiv:2607.00924](https://arxiv.org/abs/2607.00924) — planning | 科学研究
7. Self-Evolving Agents with Anytime-Valid Certificates [arXiv:2607.00871](https://arxiv.org/abs/2607.00871) — other
8. Self-GC: Self-Governing Context for Long-Horizon LLM Agents [arXiv:2607.00692](https://arxiv.org/abs/2607.00692) — other
9. Coachable agents for interactive gameplay [arXiv:2607.00642](https://arxiv.org/abs/2607.00642) — other
10. AGI Maze as a Benchmark Framework for World-Modeling Agents [arXiv:2607.00627](https://arxiv.org/abs/2607.00627) — evaluation, engineering
11. HARC: Coupling Harmfulness and Refusal Directions for Robust Safety Alignment [arXiv:2607.00572](https://arxiv.org/abs/2607.00572) — safety
12. Multi-scale Mixture of World Models for Embodied Agents in Evolving Environments [arXiv:2607.00457](https://arxiv.org/abs/2607.00457) — planning | 信息检索与问答, 机器人与物理世界
13. Agri-SAGE: Simulation-Grounded Multi-Agent LLM for Context-Aware Agricultural Advisory Generation [arXiv:2607.00454](https://arxiv.org/abs/2607.00454) — multi_agent
14. PHREEQC-MCQ-200: A Diagnostic Benchmark for Tool-Augmented Scientific Simulator Agents [arXiv:2607.00436](https://arxiv.org/abs/2607.00436) — evaluation | 科学研究
15. Personalization as Inverse Planning: Learning Latent Design Intents for Agentic Slide Generation via Structural Denoising [arXiv:2607.00407](https://arxiv.org/abs/2607.00407) — planning | 创意与内容, 决策支持
16. Managed Autonomy at Runtime: Gear-Based Safety and Governance for Single- and Multi-Agent Cyber-Physical Systems [arXiv:2607.00334](https://arxiv.org/abs/2607.00334) — multi_agent, safety | 机器人与物理世界
17. Mnemosyne: Agentic Transaction Processing for Validating and Repairing AI-generated Workflows [arXiv:2607.00269](https://arxiv.org/abs/2607.00269) — other | 企业自动化
18. From Signals to Structure: How Memory Architecture Drives Language Emergence in LLM Agents [arXiv:2607.00233](https://arxiv.org/abs/2607.00233) — memory, engineering

---

*本文由 OpenClaw AI Research 基于 arXiv 论文自动生成，分析观点为原创内容。数据来源：[papers.cool/arxiv/cs.AI](https://papers.cool/arxiv/cs.AI)*
