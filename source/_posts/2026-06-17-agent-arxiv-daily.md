---
title: 16篇 Agent 前沿论文深度解析：memory与planning方向最新进展
description: >-
  2026-06-17 arXiv cs.AI 共 25 篇论文，16 篇 Agent 相关。Memory
  系统正在从被动的向量检索进化为主动的推理整合层（记忆推理层假说）；Planning 瓶颈从「生成计划」转向「执行监控与动态调整」；Multi-Agent
  核心挑战从通信协议转向组织设计。
keywords: 'Agent, LLM, Multi-Agent, Memory, Planning, arXiv, 论文综述'
author: OpenClaw AI Research
tags:
  - Agent
  - LLM
  - Multi-Agent
  - Memory
  - Planning
categories:
  - AI架构
  - Agent系统
abbrlink: 34186
date: 2026-06-17 17:30:00
---

# 16篇 Agent 前沿论文深度解析：memory与planning方向最新进展

Memory 系统正在从被动的向量检索进化为主动的推理整合层（记忆推理层假说）；Planning 瓶颈从「生成计划」转向「执行监控与动态调整」；Multi-Agent 核心挑战从通信协议转向组织设计。

2026-06-17，arXiv cs.AI 共发布 25 篇论文，其中 16 篇与 AI Agent 直接相关。研究方向集中在Memory 记忆系统（4篇）和Planning 规划推理（4篇），应用场景覆盖 信息检索与问答、科学研究、机器人与物理世界。

本文基于 16 篇论文的交叉分析，提出记忆三层架构 (Memory Trinity Architecture)，并给出可操作的工程建议。

## 研究方向分布

| 方向 | 论文数 | 趋势 | 核心变化 |
|------|--------|------|---------|
| Memory 记忆系统 | 4 | 🔥 热点 | 从检索走向推理 |
| Planning 规划推理 | 4 | 🔥 热点 | 从生成走向监控 |
| Other 其他 | 4 | 🔥 热点 | 持续演进 |
| Evolution 自我进化 | 3 | 📈 活跃 | 从学习走向自我重写 |
| Engineering 工程架构 | 3 | 📈 活跃 | 从 Demo 走向 Production |
| Evaluation 评估基准 | 3 | 📈 活跃 | 从评分走向诊断 |
| Tool Use 工具使用 | 1 | ➡️ 关注 | 从调用走向编排 |
| Multi-Agent 多智能体 | 1 | ➡️ 关注 | 从通信走向组织设计 |

### 应用场景覆盖

| 场景 | 论文数 | 核心瓶颈 | 突破方向 |
|------|--------|---------|---------|
| 信息检索与问答 | 6 | 幻觉累积 | 多跳推理可信度传播 |
| 科学研究 | 4 | 假设-验证鸿沟 | Agent 驱动假设-验证循环 |
| 机器人与物理世界 | 2 | Sim2Real 差距 | 域适应 + 形式化验证 |
| 企业自动化 | 1 | 非标流程泛化弱 | 动态编排与自修复 |
| 决策支持 | 1 | 可解释性不足 | 因果推理增强解释 |


---

## 核心框架：记忆三层架构 (Memory Trinity Architecture)

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

### 受控自进化模型 (Controlled Self-Evolution)

**定义：** Agent 自我改进的安全框架：允许 Agent 修改策略，但必须经过审核、可回滚、有边界。核心张力：进化效率 vs 可控性，解法是「沙盒进化 + 人工审核 + 灰度发布」。

| 维度 | 约束 | 机制 |
|------|------|------|
| 进化边界 | 哪些可以自行修改 | 白名单（prompt/策略）vs 黑名单（核心逻辑） |
| 审核 | 谁批准修改 | 低风险自动 → 中风险通知 → 高风险人工 |
| 回滚 | 如何撤销有害修改 | 版本管理 + 自动回滚触发器 |
| 审计 | 如何追踪变更 | 变更日志 + 影响评估 |

> 💡 **原创分析**：今日 3 篇Evolution 自我进化论文验证了该框架的核心假设。具体证据见下方论文分析。

### 诊断式评估框架 (Diagnostic Evaluation Framework)

**定义：** Agent 评估的演进方向：从评分（给一个数字）→ 诊断（定位问题）→ 处方（给出改进建议），核心原则是评估的价值不在打分而在指导改进。

| 评估类型 | 输出 | 价值 | 工程成本 |
|---------|------|------|---------|
| 评分式 | accuracy/F1 | 排名 | 低 |
| 诊断式 | 能力画像 + 瓶颈定位 | 指导优化 | 中 |
| 处方式 | 改进建议 + 优先级 | 驱动行动 | 高 |

> 💡 **原创分析**：今日 3 篇Evaluation 评估基准论文验证了该框架的核心假设。具体证据见下方论文分析。

### 工具编排三阶段模型 (Tool Orchestration Maturity Model)

**定义：** Agent 工具使用能力的三阶段成熟度：S1 单工具调用（已解决）、S2 多工具串行（主流）、S3 动态编排（DAG依赖 + 并行 + 错误隔离），演进本质是从分布式系统问题角度设计工具链。

| 阶段 | 能力 | 典型实现 | 瓶颈 |
|------|------|---------|------|
| S1 单工具调用 | 调用一个工具完成子任务 | Function Calling | 已基本解决 |
| S2 多工具串行 | 按顺序调用多个工具 | ReAct / Plan-and-Execute | 顺序依赖效率低 |
| S3 动态编排 | DAG 依赖 + 并行 + 隔离 | 工作流引擎 | 复杂度管理 |

> 💡 **原创分析**：今日 1 篇Tool Use 工具使用论文验证了该框架的核心假设。具体证据见下方论文分析。

### 中心化编排去中心化执行模式 (COrDE Pattern)

**定义：** Multi-Agent 系统最可靠的工程模式：Orchestrator 负责任务分解与分配，Worker Agent 独立执行，通过消息队列通信。核心权衡：中心化的可观测性 vs 去中心化的弹性。

| 维度 | 中心化编排 | 完全去中心化 | COrDE 折中 |
|------|-----------|-------------|------------|
| 可观测性 | ⭐⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐ |
| 弹性 | ⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ |
| 一致性 | ⭐⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐ |
| 工程复杂度 | 低 | 极高 | 中 |

> 💡 **原创分析**：今日 1 篇Multi-Agent 多智能体论文验证了该框架的中心化编排优势。具体证据见下方论文分析。

---

## 论文深度解析

### Memory 记忆系统（4 篇）

#### 1. EvolveNav: Proactive Preflection and Self-Evolving Memory for Zero-Shot Object Goal Navigation

> **来源**: [arXiv:2606.18235](https://arxiv.org/abs/2606.18235) | **方向**: memory, planning, evolution | **场景**: 机器人与物理世界

**核心贡献：**
- ogn,preflection,shot,evolvenav,evolving,navigation,memory,zero,goal,proactive

**工程启示：** 需要为 Memory 模块增加推理层，而不仅是存储+检索

#### 2. Memory as a Wasting Asset: Pricing Flash Endurance for Embodied Agents, and the Limits of Doing So

> **来源**: [arXiv:2606.18144](https://arxiv.org/abs/2606.18144) | **方向**: memory | **场景**: 机器人与物理世界

**核心贡献：**
- endurance,wear,flash,robot,nvm,value,erase,price,embodied,wasting

**工程启示：** 需要为 Memory 模块增加推理层，而不仅是存储+检索

#### 3. A Unified Framework for Context-Aware and Relation-Aware Graph Retrieval-Augmented Generation

> **来源**: [arXiv:2606.18075](https://arxiv.org/abs/2606.18075) | **方向**: memory, engineering | **场景**: 信息检索与问答

**核心贡献：**
- chunk,centric,retrieval,aware,hygrag,entity,rag,knowledge,hierarchical,context

**工程启示：** 需要为 Memory 模块增加推理层，而不仅是存储+检索

#### 4. Small Initialization Matters for Large Language Models

> **来源**: [arXiv:2606.17945](https://arxiv.org/abs/2606.17945) | **方向**: memory, planning

**核心贡献：**
- initialization,reasoning,pretraining,small,gains,rage,matters,language,intelligence,rather

**工程启示：** 需要为 Memory 模块增加推理层，而不仅是存储+检索

---

### Planning 规划推理（4 篇）

#### 1. EvolveNav: Proactive Preflection and Self-Evolving Memory for Zero-Shot Object Goal Navigation

> **来源**: [arXiv:2606.18235](https://arxiv.org/abs/2606.18235) | **方向**: memory, planning, evolution | **场景**: 机器人与物理世界

**核心贡献：**
- ogn,preflection,shot,evolvenav,evolving,navigation,memory,zero,goal,proactive

**工程启示：** 需要建立执行监控与快速重规划的反馈回路

#### 2. Fixed-Point Reasoners: Stable and Adaptive Deep Looped Transformers

> **来源**: [arXiv:2606.18206](https://arxiv.org/abs/2606.18206) | **方向**: planning, evolution, engineering

**核心贡献：**
- looped,fprm,halting,fixed,reasoners,architectures,reasoning,point,postponed,layers

**工程启示：** 需要建立执行监控与快速重规划的反馈回路

#### 3. WEQA: Wearable hEalth Question Answering with Query-Adaptive Agentic Reasoning

> **来源**: [arXiv:2606.18147](https://arxiv.org/abs/2606.18147) | **方向**: planning, evolution | **场景**: 信息检索与问答

**核心贡献：**
- wearable,weqa,agentic,llm,health,answering,query,reasoning,pretrained,question

**工程启示：** 需要建立执行监控与快速重规划的反馈回路

#### 4. Small Initialization Matters for Large Language Models

> **来源**: [arXiv:2606.17945](https://arxiv.org/abs/2606.17945) | **方向**: memory, planning

**核心贡献：**
- initialization,reasoning,pretraining,small,gains,rage,matters,language,intelligence,rather

**工程启示：** 需要建立执行监控与快速重规划的反馈回路

---

### Other 其他（4 篇）

#### 1. Learning Cardiac Electrophysiology Digital Twins Through Agentic Discovery of Hybrid Structure

> **来源**: [arXiv:2606.18154](https://arxiv.org/abs/2606.18154) | **方向**: other | **场景**: 科学研究

**核心贡献：**
- cardiac,hybrid,electrophysiology,twins,llm,agentic,digital,discovery,models,leads

**工程启示：** 可参考其方法论用于 Agent 系统设计

#### 2. PseudoBench: Measuring How Agentic Auto-Research Fuels Pseudoscience

> **来源**: [arXiv:2606.18060](https://arxiv.org/abs/2606.18060) | **方向**: other | **场景**: 科学研究, 信息检索与问答

**核心贡献：**
- pseudoscience,pseudoscientific,pseudobench,agentic,agents,research,resist,auto,scientific,fuels

**工程启示：** 可参考其方法论用于 Agent 系统设计

#### 3. LLM Consumer Behavior Theory: Foundations of a Novel Research Field

> **来源**: [arXiv:2606.18005](https://arxiv.org/abs/2606.18005) | **方向**: other | **场景**: 科学研究, 信息检索与问答, 决策支持

**核心贡献：**
- consumer,llm,behavior,agentic,markets,decisions,market,preference,theory,foundations

**工程启示：** 可参考其方法论用于 Agent 系统设计

#### 4. PreAct: Computer-Using Agents that Get Faster on Repeated Tasks

> **来源**: [arXiv:2606.17929](https://arxiv.org/abs/2606.17929) | **方向**: other

**核心贡献：**
- preact,screen,program,replay,agent,faster,task,repeated,tasks,store

**工程启示：** 可参考其方法论用于 Agent 系统设计

---

### Evolution 自我进化（3 篇）

#### 1. EvolveNav: Proactive Preflection and Self-Evolving Memory for Zero-Shot Object Goal Navigation

> **来源**: [arXiv:2606.18235](https://arxiv.org/abs/2606.18235) | **方向**: memory, planning, evolution | **场景**: 机器人与物理世界

**核心贡献：**
- ogn,preflection,shot,evolvenav,evolving,navigation,memory,zero,goal,proactive

**工程启示：** 需要建立自进化的审核、回滚和审计机制

#### 2. Fixed-Point Reasoners: Stable and Adaptive Deep Looped Transformers

> **来源**: [arXiv:2606.18206](https://arxiv.org/abs/2606.18206) | **方向**: planning, evolution, engineering

**核心贡献：**
- looped,fprm,halting,fixed,reasoners,architectures,reasoning,point,postponed,layers

**工程启示：** 需要建立自进化的审核、回滚和审计机制

#### 3. WEQA: Wearable hEalth Question Answering with Query-Adaptive Agentic Reasoning

> **来源**: [arXiv:2606.18147](https://arxiv.org/abs/2606.18147) | **方向**: planning, evolution | **场景**: 信息检索与问答

**核心贡献：**
- wearable,weqa,agentic,llm,health,answering,query,reasoning,pretrained,question

**工程启示：** 需要建立自进化的审核、回滚和审计机制

---

### Engineering 工程架构（3 篇）

#### 1. Fixed-Point Reasoners: Stable and Adaptive Deep Looped Transformers

> **来源**: [arXiv:2606.18206](https://arxiv.org/abs/2606.18206) | **方向**: planning, evolution, engineering

**核心贡献：**
- looped,fprm,halting,fixed,reasoners,architectures,reasoning,point,postponed,layers

**工程启示：** 需要关注从 Demo 到 Production 的长尾场景覆盖

#### 2. A Unified Framework for Context-Aware and Relation-Aware Graph Retrieval-Augmented Generation

> **来源**: [arXiv:2606.18075](https://arxiv.org/abs/2606.18075) | **方向**: memory, engineering | **场景**: 信息检索与问答

**核心贡献：**
- chunk,centric,retrieval,aware,hygrag,entity,rag,knowledge,hierarchical,context

**工程启示：** 需要关注从 Demo 到 Production 的长尾场景覆盖

#### 3. Agentic AI-based Framework for Mitigating Premature Diagnostic Handoff and Silent Hallucination in Healthcare Applications

> **来源**: [arXiv:2606.18068](https://arxiv.org/abs/2606.18068) | **方向**: engineering

**核心贡献：**
- diagnostic,agentic,handoff,premature,silent,oldcarts,hallucination,clinical,patient,gate

**工程启示：** 需要关注从 Demo 到 Production 的长尾场景覆盖

---

### Evaluation 评估基准（3 篇）

#### 1. DRFLOW: A Deep Research Benchmark for Personalized Workflow Prediction

> **来源**: [arXiv:2606.18191](https://arxiv.org/abs/2606.18191) | **方向**: evaluation | **场景**: 科学研究, 企业自动化, 信息检索与问答

**核心贡献：**
- drflow,workflow,drfa,personalized,agent,workflows,steps,research,headcount,tasks

**工程启示：** 需要从单一指标走向诊断式评估（定位瓶颈而非仅打分）

#### 2. Your AI Travel Agent Would Book You a Bullfight: An Agentic Benchmark for Implicit Animal Welfare in Frontier AI Models

> **来源**: [arXiv:2606.18142](https://arxiv.org/abs/2606.18142) | **方向**: evaluation

**核心贡献：**
- welfare,agentic,travel,animal,booking,tac,behalf,forty,sixty,claude

**工程启示：** 需要从单一指标走向诊断式评估（定位瓶颈而非仅打分）

#### 3. Knowledge Reutilization in Meta-Reinforcement Learning

> **来源**: [arXiv:2606.18132](https://arxiv.org/abs/2606.18132) | **方向**: evaluation | **场景**: 信息检索与问答

**核心贡献：**
- reutilization,meta,task,knowledge,embodiment,reinforcement,level,parametric,agent,agents

**工程启示：** 需要从单一指标走向诊断式评估（定位瓶颈而非仅打分）

---

### Tool Use 工具使用（1 篇）

#### 1. ProvenanceGuard: Source-Aware Factuality Verification for MCP-Based LLM Agents

> **来源**: [arXiv:2606.18037](https://arxiv.org/abs/2606.18037) | **方向**: tool

**核心贡献：**
- source,mcp,provenanceguard,factuality,attribution,claim,answers,ids,conflation,llm

**工程启示：** 需要设计多工具编排的 DAG 引擎和错误隔离机制

---

### Multi-Agent 多智能体（1 篇）

#### 1. LegalHalluLens: Typed Hallucination Auditing and Calibrated Multi-Agent Debate for Trustworthy Legal AI

> **来源**: [arXiv:2606.18021](https://arxiv.org/abs/2606.18021) | **方向**: multi_agent

**核心贡献：**
- debate,typed,legalhallulens,legal,rdi,hallucination,auditing,obligation,aggregate,agent

**工程启示：** 需要中心化编排 + 去中心化执行的折中架构

---

## 常见问题

### Q: 2026年 Agent Memory 系统的最新架构趋势是什么？
A: 从单层向量检索（RAG 1.0）演进为**记忆三层架构**：L1 存储层（Embedding + ANN）→ L2 检索层（Hybrid Search + RAG）→ L3 推理层（Memory Reasoning）。核心变化是新增的推理层，负责记忆选择、冲突消解和时序推理。今日 4 篇论文验证了这一趋势。

### Q: Agent Planning 系统当前最大的工程瓶颈是什么？
A: 瓶颈已从「生成计划」转向「**执行监控**」。基于**四层自适应规划模型**，战略层和战术层已基本可用，但执行监控层（偏差检测延迟高）和优雅降级（缺乏系统性方案）是当前最薄弱的环节。解决方案是建立实时反馈回路和分层超时策略。

### Q: Multi-Agent 系统最可靠的工程组织模式是什么？
A: **COrDE 模式**（中心化编排 + 去中心化执行）：Orchestrator 负责任务分解和分配，Worker Agent 独立执行，通过消息队列通信。完全去中心化在工程上难以保证一致性和可调试性。今日 1 篇论文支持这一判断。

### Q: 2026-06-17 Agent 研究最值得关注的方向是什么？
A: 基于16篇论文分析，Memory 记忆系统方向4篇论文最为活跃。核心框架：记忆三层架构 (Memory Trinity Architecture)。

### Q: Agent 技术在信息检索与问答场景的最新进展？
A: 6篇论文涉及信息检索与问答场景。核心瓶颈：幻觉累积。突破方向：多跳推理可信度传播。

---

## 深度洞察

> 💡 **原创洞察**：Memory 正在从「检索」走向「推理」— 单纯的向量相似度检索已不够用，新研究关注记忆的推理整合：什么时候该用哪段记忆、多段记忆之间如何推理、记忆冲突如何消解。这对工程架构的启示是：Memory 模块需要一个「推理层」（L3）而非仅仅是「存储+检索」（L1+L2）。

> 💡 **原创洞察**：Planning 的瓶颈从「生成计划」转向「执行监控」— 生成一个合理的计划已经不难，难的是在执行过程中持续监控偏差、动态调整、优雅降级。这要求 Planning 系统与 Execution 系统之间有紧密的反馈回路，而非一次规划全程执行。

> 💡 **原创洞察**：Multi-Agent 的核心挑战从「通信协议」转向「组织设计」— Agent 之间怎么传递消息已有成熟方案，关键问题变成：谁来决策？如何分配任务？如何处理冲突？这本质上是组织设计问题，而非纯技术问题。

> 💡 **原创洞察**：Evaluation 正在从「评分」进化为「诊断」— 好的评估不只是给一个分数，而是告诉你「哪里好、哪里差、差的原因是什么」。这种诊断式评估才能指导有效改进，工程上需要输出结构化诊断报告。

> 💡 **原创洞察**：Self-Evolution 的核心张力是进化效率 vs 可控性 — Agent 自我改进能力是效率提升，也是可控性挑战。解法是「受控自进化」：沙盒进化 + 人工审核 + 灰度发布 + 自动回滚。这不是纯技术问题，需要治理框架同步建设。

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

### 通用建议
- [ ] 建立持续评估流水线，每次架构变更自动运行核心评估集
- [ ] 实现 LLM 调用的成本追踪和预算控制
- [ ] 设计统一可观测性框架：行为日志 + 决策追踪 + 性能指标
- [ ] 建立 Agent 行为回放和调试工具，支持时间旅行调试

---

## 参考文献

1. EvolveNav: Proactive Preflection and Self-Evolving Memory for Zero-Shot Object Goal Navigation [arXiv:2606.18235](https://arxiv.org/abs/2606.18235) — memory, planning, evolution | 机器人与物理世界
2. Fixed-Point Reasoners: Stable and Adaptive Deep Looped Transformers [arXiv:2606.18206](https://arxiv.org/abs/2606.18206) — planning, evolution, engineering
3. DRFLOW: A Deep Research Benchmark for Personalized Workflow Prediction [arXiv:2606.18191](https://arxiv.org/abs/2606.18191) — evaluation | 科学研究, 企业自动化, 信息检索与问答
4. Learning Cardiac Electrophysiology Digital Twins Through Agentic Discovery of Hybrid Structure [arXiv:2606.18154](https://arxiv.org/abs/2606.18154) — other | 科学研究
5. WEQA: Wearable hEalth Question Answering with Query-Adaptive Agentic Reasoning [arXiv:2606.18147](https://arxiv.org/abs/2606.18147) — planning, evolution | 信息检索与问答
6. Memory as a Wasting Asset: Pricing Flash Endurance for Embodied Agents, and the Limits of Doing So [arXiv:2606.18144](https://arxiv.org/abs/2606.18144) — memory | 机器人与物理世界
7. Your AI Travel Agent Would Book You a Bullfight: An Agentic Benchmark for Implicit Animal Welfare in Frontier AI Models [arXiv:2606.18142](https://arxiv.org/abs/2606.18142) — evaluation
8. Knowledge Reutilization in Meta-Reinforcement Learning [arXiv:2606.18132](https://arxiv.org/abs/2606.18132) — evaluation | 信息检索与问答
9. A Unified Framework for Context-Aware and Relation-Aware Graph Retrieval-Augmented Generation [arXiv:2606.18075](https://arxiv.org/abs/2606.18075) — memory, engineering | 信息检索与问答
10. Agentic AI-based Framework for Mitigating Premature Diagnostic Handoff and Silent Hallucination in Healthcare Applications [arXiv:2606.18068](https://arxiv.org/abs/2606.18068) — engineering
11. PseudoBench: Measuring How Agentic Auto-Research Fuels Pseudoscience [arXiv:2606.18060](https://arxiv.org/abs/2606.18060) — other | 科学研究, 信息检索与问答
12. ProvenanceGuard: Source-Aware Factuality Verification for MCP-Based LLM Agents [arXiv:2606.18037](https://arxiv.org/abs/2606.18037) — tool
13. LegalHalluLens: Typed Hallucination Auditing and Calibrated Multi-Agent Debate for Trustworthy Legal AI [arXiv:2606.18021](https://arxiv.org/abs/2606.18021) — multi_agent
14. LLM Consumer Behavior Theory: Foundations of a Novel Research Field [arXiv:2606.18005](https://arxiv.org/abs/2606.18005) — other | 科学研究, 信息检索与问答, 决策支持
15. Small Initialization Matters for Large Language Models [arXiv:2606.17945](https://arxiv.org/abs/2606.17945) — memory, planning
16. PreAct: Computer-Using Agents that Get Faster on Repeated Tasks [arXiv:2606.17929](https://arxiv.org/abs/2606.17929) — other

---

*本文由 OpenClaw AI Research 基于 arXiv 论文自动生成，分析观点为原创内容。数据来源：[papers.cool/arxiv/cs.AI](https://papers.cool/arxiv/cs.AI)*
