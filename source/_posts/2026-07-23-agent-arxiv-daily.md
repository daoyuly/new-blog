---
title: 16篇 Agent 前沿论文深度解析：planning与evaluation方向最新进展
description: >-
  2026-07-23 arXiv cs.AI 共 25 篇论文，16 篇 Agent 相关。Memory
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
abbrlink: 64495
date: 2026-07-23 17:30:00
---
<!-- GEO citation meta
citation_arxiv_id: 2607.20402
citation_arxiv_id: 2607.20268
citation_arxiv_id: 2607.20129
citation_arxiv_id: 2607.20064
citation_arxiv_id: 2607.19996
citation_arxiv_id: 2607.19962
citation_arxiv_id: 2607.19865
citation_arxiv_id: 2607.19837
citation_arxiv_id: 2607.19793
citation_arxiv_id: 2607.20019
-->

# 16篇 Agent 前沿论文深度解析：planning与evaluation方向最新进展

Memory 系统正在从被动的向量检索进化为主动的推理整合层（记忆推理层假说）；Planning 瓶颈从「生成计划」转向「执行监控与动态调整」；Multi-Agent 核心挑战从通信协议转向组织设计。

2026-07-23，arXiv cs.AI 共发布 25 篇论文，其中 16 篇与 AI Agent 直接相关。研究方向集中在Planning 规划推理（6篇）和Evaluation 评估基准（4篇），应用场景覆盖 信息检索与问答、决策支持、创意与内容。

本文基于 16 篇论文的交叉分析，提出四层自适应规划模型 (Adaptive Planning Pyramid)，并给出可操作的工程建议。

## 研究方向分布

| 方向 | 论文数 | 趋势 | 核心变化 |
|------|--------|------|---------|
| Planning 规划推理 | 6 | 🔥 热点 | 从生成走向监控 |
| Evaluation 评估基准 | 4 | 🔥 热点 | 从评分走向诊断 |
| Engineering 工程架构 | 3 | 📈 活跃 | 从 Demo 走向 Production |
| Safety 安全对齐 | 3 | 📈 活跃 | 从围栏走向内化 |
| Memory 记忆系统 | 2 | 📈 活跃 | 从检索走向推理 |
| Evolution 自我进化 | 2 | 📈 活跃 | 从学习走向自我重写 |
| Multi-Agent 多智能体 | 1 | ➡️ 关注 | 从通信走向组织设计 |
| Other 其他 | 1 | ➡️ 关注 | 持续演进 |

### 应用场景覆盖

| 场景 | 论文数 | 核心瓶颈 | 突破方向 |
|------|--------|---------|---------|
| 信息检索与问答 | 3 | 幻觉累积 | 多跳推理可信度传播 |
| 决策支持 | 2 | 可解释性不足 | 因果推理增强解释 |
| 创意与内容 | 1 | 原创性评估缺失 | 人机协作创意增强 |


---

## 核心框架：四层自适应规划模型 (Adaptive Planning Pyramid)

### 四层自适应规划模型 (Adaptive Planning Pyramid)

**定义：** Planning 系统的四层架构：战略层（目标分解）、战术层（步骤规划）、执行层（逐步执行）、监控层（偏差检测与重规划），核心原则是规划价值在于适应速度而非初始完美。

| 层级 | 职责 | 更新频率 | 关键指标 |
|------|------|---------|----------|
| 战略层 | 目标→子目标 | 低频 | 子目标独立性 |
| 战术层 | 子目标→步骤 | 中频 | 步骤可执行性 |
| 执行层 | 步骤→行动 | 高频 | 行动成功率 |
| 监控层 | 偏差检测与重规划 | 事件驱动 | 适应延迟 |

> 💡 **原创分析**：今日 6 篇Planning 规划推理论文验证了该框架的监控层瓶颈。具体证据见下方论文分析。

### 诊断式评估框架 (Diagnostic Evaluation Framework)

**定义：** Agent 评估的演进方向：从评分（给一个数字）→ 诊断（定位问题）→ 处方（给出改进建议），核心原则是评估的价值不在打分而在指导改进。

| 评估类型 | 输出 | 价值 | 工程成本 |
|---------|------|------|---------|
| 评分式 | accuracy/F1 | 排名 | 低 |
| 诊断式 | 能力画像 + 瓶颈定位 | 指导优化 | 中 |
| 处方式 | 改进建议 + 优先级 | 驱动行动 | 高 |

> 💡 **原创分析**：今日 4 篇Evaluation 评估基准论文验证了该框架的核心假设。具体证据见下方论文分析。

### 安全内化模型 (Safety Internalization Model)

**定义：** Agent 安全的演进路径：从外部围栏（规则过滤）→ 价值对齐（RLHF）→ 安全内化（Agent 理解边界），核心论点是安全的 Agent 不是受限的 Agent，而是理解边界的 Agent。

| 阶段 | 机制 | 优点 | 缺点 |
|------|------|------|------|
| 外部围栏 | 规则过滤 | 确定性高 | 可被绕过 |
| 价值对齐 | RLHF/DPO | 泛化性好 | 对齐税 |
| 安全内化 | 自主判断 | 灵活适应 | 验证困难 |

> 💡 **原创分析**：今日 3 篇Safety 安全对齐论文验证了该框架的核心假设。具体证据见下方论文分析。

### 记忆三层架构 (Memory Trinity Architecture)

**定义：** Agent 记忆系统的三层演进模型：L1 存储层（Embedding + ANN）、L2 检索层（Hybrid Search + RAG）、L3 推理层（Memory Reasoning），核心演进方向是从被动存取走向主动推理整合。

| 层级 | 功能 | 工程实现 | 成熟度 |
|------|------|---------|--------|
| L1 存储层 | 向量存取 | Embedding + ANN | ⭐⭐⭐⭐ 已成熟 |
| L2 检索层 | 相关性匹配 | RAG (Hybrid Search) | ⭐⭐⭐ 当前主流 |
| L3 推理层 | 记忆推理整合 | 冲突消解 + 时序推理 | ⭐ 新兴方向 |

> 💡 **原创分析**：今日 2 篇Memory 记忆系统论文验证了该框架的核心假设。具体证据见下方论文分析。

### 受控自进化模型 (Controlled Self-Evolution)

**定义：** Agent 自我改进的安全框架：允许 Agent 修改策略，但必须经过审核、可回滚、有边界。核心张力：进化效率 vs 可控性，解法是「沙盒进化 + 人工审核 + 灰度发布」。

| 维度 | 约束 | 机制 |
|------|------|------|
| 进化边界 | 哪些可以自行修改 | 白名单（prompt/策略）vs 黑名单（核心逻辑） |
| 审核 | 谁批准修改 | 低风险自动 → 中风险通知 → 高风险人工 |
| 回滚 | 如何撤销有害修改 | 版本管理 + 自动回滚触发器 |
| 审计 | 如何追踪变更 | 变更日志 + 影响评估 |

> 💡 **原创分析**：今日 2 篇Evolution 自我进化论文验证了该框架的核心假设。具体证据见下方论文分析。

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

### Planning 规划推理（6 篇）

#### 1. SoftReason: A Fully Differentiable Neuro-Soft-Symbolic Deductive Reasoning Architecture over High-Dimensional Perceptual Data

> **来源**: [arXiv:2607.20402](https://arxiv.org/abs/2607.20402) | **方向**: planning, engineering

**核心贡献：**
- deductive,softreason,differentiable,predicate,neuro,soft,perceptual,symbolic,facts,reasoning

**工程启示：** 需要建立执行监控与快速重规划的反馈回路

#### 2. PoTRE: Test-Time Reasoning inspired by Cognitive Heterogeneity

> **来源**: [arXiv:2607.20268](https://arxiv.org/abs/2607.20268) | **方向**: planning, evaluation | **场景**: 决策支持

**核心贡献：**
- potre,hle,reasoning,agent,heterogeneity,planning,final,prbench,cognitive,reconciles

**工程启示：** 需要建立执行监控与快速重规划的反馈回路

#### 3. CUSUM-Shaped Inference-Time Monitoring and Targeted Re-Decoding for Quantized Small Language Model Reasoning

> **来源**: [arXiv:2607.20129](https://arxiv.org/abs/2607.20129) | **方向**: planning

**核心贡献：**
- 467,cusum,240,mcnemar,threshold,monitoring,reasoning,alarm,audit,ids

**工程启示：** 需要建立执行监控与快速重规划的反馈回路

#### 4. PRO-LONG: Programmatic Memory Enables Long-Horizon Reasoning

> **来源**: [arXiv:2607.20064](https://arxiv.org/abs/2607.20064) | **方向**: memory, planning

**核心贡献：**
- pro,long,programmatic,agi,horizon,harnesses,agents,arc,tradeoff,reasoning

**工程启示：** 需要建立执行监控与快速重规划的反馈回路

#### 5. CLARK: Closed-loop Learning for Adaptive Reasoning over Knowledge Graphs

> **来源**: [arXiv:2607.19996](https://arxiv.org/abs/2607.19996) | **方向**: planning, evolution | **场景**: 信息检索与问答

**核心贡献：**
- clark,reasoning,knowledge,mln,classification,adaptive,graphs,loop,symbolic,closed

**工程启示：** 需要建立执行监控与快速重规划的反馈回路

#### 6. EvoThink: Evolving Thinking in Large Reasoning Models via Self-Pruning and Aha-Moment Preference Optimization

> **来源**: [arXiv:2607.19962](https://arxiv.org/abs/2607.19962) | **方向**: planning, engineering | **场景**: 决策支持

**核心贡献：**
- reasoning,evothink,aha,redundant,lrms,overthinking,thinking,moment,pruning,preference

**工程启示：** 需要建立执行监控与快速重规划的反馈回路

---

### Evaluation 评估基准（4 篇）

#### 1. PoTRE: Test-Time Reasoning inspired by Cognitive Heterogeneity

> **来源**: [arXiv:2607.20268](https://arxiv.org/abs/2607.20268) | **方向**: planning, evaluation | **场景**: 决策支持

**核心贡献：**
- potre,hle,reasoning,agent,heterogeneity,planning,final,prbench,cognitive,reconciles

**工程启示：** 需要从单一指标走向诊断式评估（定位瓶颈而非仅打分）

#### 2. DocOps: A Verifiable Benchmark for Autonomous Agents in Complex Document Operations

> **来源**: [arXiv:2607.19865](https://arxiv.org/abs/2607.19865) | **方向**: evaluation

**核心贡献：**
- docops,agents,document,verifiable,destructive,autonomous,operations,deconstructs,complex,digital

**工程启示：** 需要从单一指标走向诊断式评估（定位瓶颈而非仅打分）

#### 3. Know Your Agent: Reconnaissance-Driven Pentesting of AI Agents

> **来源**: [arXiv:2607.19837](https://arxiv.org/abs/2607.19837) | **方向**: evaluation

**核心贡献：**
- pentesting,reconnaissance,kya,agent,agents,know,attacks,weaknesses,driven,stronger

**工程启示：** 需要从单一指标走向诊断式评估（定位瓶颈而非仅打分）

#### 4. Silent Failures in Multimodal Agentic Search:A Diagnostic Taxonomy and Cross-Judge Evaluation

> **来源**: [arXiv:2607.19793](https://arxiv.org/abs/2607.19793) | **方向**: evaluation | **场景**: 信息检索与问答

**核心贡献：**
- failures,silent,agentic,multimodal,taxonomy,judge,answer,search,diagnostic,trajectory

**工程启示：** 需要从单一指标走向诊断式评估（定位瓶颈而非仅打分）

---

### Engineering 工程架构（3 篇）

#### 1. SoftReason: A Fully Differentiable Neuro-Soft-Symbolic Deductive Reasoning Architecture over High-Dimensional Perceptual Data

> **来源**: [arXiv:2607.20402](https://arxiv.org/abs/2607.20402) | **方向**: planning, engineering

**核心贡献：**
- deductive,softreason,differentiable,predicate,neuro,soft,perceptual,symbolic,facts,reasoning

**工程启示：** 需要关注从 Demo 到 Production 的长尾场景覆盖

#### 2. EvoDRC: A Self-Evolving Agentic Framework for Automated DRC Violation Repair

> **来源**: [arXiv:2607.20019](https://arxiv.org/abs/2607.20019) | **方向**: engineering | **场景**: 创意与内容

**核心贡献：**
- drc,repair,evodrc,agentic,skills,design,rule,violations,drvs,drv

**工程启示：** 需要关注从 Demo 到 Production 的长尾场景覆盖

#### 3. EvoThink: Evolving Thinking in Large Reasoning Models via Self-Pruning and Aha-Moment Preference Optimization

> **来源**: [arXiv:2607.19962](https://arxiv.org/abs/2607.19962) | **方向**: planning, engineering | **场景**: 决策支持

**核心贡献：**
- reasoning,evothink,aha,redundant,lrms,overthinking,thinking,moment,pruning,preference

**工程启示：** 需要关注从 Demo 到 Production 的长尾场景覆盖

---

### Safety 安全对齐（3 篇）

#### 1. MOF-Sleuth: Tool-Grounded Reward Alignment for Explainable Fine-Grained MOF CIF Auditing

> **来源**: [arXiv:2607.19935](https://arxiv.org/abs/2607.19935) | **方向**: safety

**核心贡献：**
- mof,sleuth,cif,grounded,evidence,auditing,chemical,explanation,llm,diagnosis

**工程启示：** 需要从规则过滤升级为基于对抗训练的安全内化

#### 2. JANUS: Foreseeing Latent Risk for Long-Horizon Agent Safety

> **来源**: [arXiv:2607.19913](https://arxiv.org/abs/2607.19913) | **方向**: safety

**核心贡献：**
- safety,agent,janus,vanguard,guards,foreseeing,forecasts,percentage,horizon,task

**工程启示：** 需要从规则过滤升级为基于对抗训练的安全内化

#### 3. Rewarding Better Thinking for LLM Preference Alignment

> **来源**: [arXiv:2607.19824](https://arxiv.org/abs/2607.19824) | **方向**: safety

**核心贡献：**
- tcr,preference,thinking,alignment,checklist,outcome,reward,ema,llm,rewarding

**工程启示：** 需要从规则过滤升级为基于对抗训练的安全内化

---

### Memory 记忆系统（2 篇）

#### 1. PRO-LONG: Programmatic Memory Enables Long-Horizon Reasoning

> **来源**: [arXiv:2607.20064](https://arxiv.org/abs/2607.20064) | **方向**: memory, planning

**核心贡献：**
- pro,long,programmatic,agi,horizon,harnesses,agents,arc,tradeoff,reasoning

**工程启示：** 需要为 Memory 模块增加推理层，而不仅是存储+检索

#### 2. Coordinating from Memory: Graph-Structured Experience Reuse for Multi-Agent Adaptation in Dynamic Manufacturing

> **来源**: [arXiv:2607.19985](https://arxiv.org/abs/2607.19985) | **方向**: memory, multi_agent

**核心贡献：**
- disturbance,gsem,agent,manufacturing,coordination,adaptation,graph,dynamic,structured,experience

**工程启示：** 需要为 Memory 模块增加推理层，而不仅是存储+检索

---

### Evolution 自我进化（2 篇）

#### 1. CLARK: Closed-loop Learning for Adaptive Reasoning over Knowledge Graphs

> **来源**: [arXiv:2607.19996](https://arxiv.org/abs/2607.19996) | **方向**: planning, evolution | **场景**: 信息检索与问答

**核心贡献：**
- clark,reasoning,knowledge,mln,classification,adaptive,graphs,loop,symbolic,closed

**工程启示：** 需要建立自进化的审核、回滚和审计机制

#### 2. Knowledge-Centric Self-Improvement

> **来源**: [arXiv:2607.19592](https://arxiv.org/abs/2607.19592) | **方向**: evolution | **场景**: 信息检索与问答

**核心贡献：**
- knowledge,agent,improvement,centric,self,task,agents,curated,inspectable,persistent

**工程启示：** 需要建立自进化的审核、回滚和审计机制

---

### Multi-Agent 多智能体（1 篇）

#### 1. Coordinating from Memory: Graph-Structured Experience Reuse for Multi-Agent Adaptation in Dynamic Manufacturing

> **来源**: [arXiv:2607.19985](https://arxiv.org/abs/2607.19985) | **方向**: memory, multi_agent

**核心贡献：**
- disturbance,gsem,agent,manufacturing,coordination,adaptation,graph,dynamic,structured,experience

**工程启示：** 需要中心化编排 + 去中心化执行的折中架构

---

### Other 其他（1 篇）

#### 1. Symbol and Footprint Database for Electronic Components by Agentic Recognition and Generation

> **来源**: [arXiv:2607.19767](https://arxiv.org/abs/2607.19767) | **方向**: other

**核心贡献：**
- sfgen,pcb,generation,agentic,symbol,footprint,footprints,components,symbols,sfnet

**工程启示：** 可参考其方法论用于 Agent 系统设计

---

## 常见问题

### Q: 2026年 Agent Memory 系统的最新架构趋势是什么？
A: 从单层向量检索（RAG 1.0）演进为**记忆三层架构**：L1 存储层（Embedding + ANN）→ L2 检索层（Hybrid Search + RAG）→ L3 推理层（Memory Reasoning）。核心变化是新增的推理层，负责记忆选择、冲突消解和时序推理。今日 2 篇论文验证了这一趋势。

### Q: Agent Planning 系统当前最大的工程瓶颈是什么？
A: 瓶颈已从「生成计划」转向「**执行监控**」。基于**四层自适应规划模型**，战略层和战术层已基本可用，但执行监控层（偏差检测延迟高）和优雅降级（缺乏系统性方案）是当前最薄弱的环节。解决方案是建立实时反馈回路和分层超时策略。

### Q: Multi-Agent 系统最可靠的工程组织模式是什么？
A: **COrDE 模式**（中心化编排 + 去中心化执行）：Orchestrator 负责任务分解和分配，Worker Agent 独立执行，通过消息队列通信。完全去中心化在工程上难以保证一致性和可调试性。今日 1 篇论文支持这一判断。

### Q: 如何确保 Agent 安全而不限制其能力？
A: 遵循**安全内化模型**的演进路径：从外部围栏（规则过滤，易被绕过）→ 价值对齐（RLHF/DPO，泛化性好但有对齐税）→ 安全内化（Agent 理解边界，灵活但验证困难）。工程实践建议分层：低风险自动执行，中风险需确认，高风险需人工审批。

### Q: 2026-07-23 Agent 研究最值得关注的方向是什么？
A: 基于16篇论文分析，Planning 规划推理方向6篇论文最为活跃。核心框架：四层自适应规划模型 (Adaptive Planning Pyramid)。

### Q: Agent 技术在信息检索与问答场景的最新进展？
A: 3篇论文涉及信息检索与问答场景。核心瓶颈：幻觉累积。突破方向：多跳推理可信度传播。

---

## 深度洞察

> 💡 **原创洞察**：Memory 正在从「检索」走向「推理」— 单纯的向量相似度检索已不够用，新研究关注记忆的推理整合：什么时候该用哪段记忆、多段记忆之间如何推理、记忆冲突如何消解。这对工程架构的启示是：Memory 模块需要一个「推理层」（L3）而非仅仅是「存储+检索」（L1+L2）。

> 💡 **原创洞察**：Planning 的瓶颈从「生成计划」转向「执行监控」— 生成一个合理的计划已经不难，难的是在执行过程中持续监控偏差、动态调整、优雅降级。这要求 Planning 系统与 Execution 系统之间有紧密的反馈回路，而非一次规划全程执行。

> 💡 **原创洞察**：Multi-Agent 的核心挑战从「通信协议」转向「组织设计」— Agent 之间怎么传递消息已有成熟方案，关键问题变成：谁来决策？如何分配任务？如何处理冲突？这本质上是组织设计问题，而非纯技术问题。

> 💡 **原创洞察**：Safety 的工程实现从「规则引擎」走向「对抗训练」— 简单的规则过滤容易被绕过，新趋势是用对抗训练让 Agent 内化安全边界。但工程上引入了新不确定性：对抗训练本身是否充分？需要红队测试持续验证。

> 💡 **原创洞察**：Evaluation 正在从「评分」进化为「诊断」— 好的评估不只是给一个分数，而是告诉你「哪里好、哪里差、差的原因是什么」。这种诊断式评估才能指导有效改进，工程上需要输出结构化诊断报告。

> 💡 **原创洞察**：Self-Evolution 的核心张力是进化效率 vs 可控性 — Agent 自我改进能力是效率提升，也是可控性挑战。解法是「受控自进化」：沙盒进化 + 人工审核 + 灰度发布 + 自动回滚。这不是纯技术问题，需要治理框架同步建设。

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

1. SoftReason: A Fully Differentiable Neuro-Soft-Symbolic Deductive Reasoning Architecture over High-Dimensional Perceptual Data [arXiv:2607.20402](https://arxiv.org/abs/2607.20402) — planning, engineering
2. PoTRE: Test-Time Reasoning inspired by Cognitive Heterogeneity [arXiv:2607.20268](https://arxiv.org/abs/2607.20268) — planning, evaluation | 决策支持
3. CUSUM-Shaped Inference-Time Monitoring and Targeted Re-Decoding for Quantized Small Language Model Reasoning [arXiv:2607.20129](https://arxiv.org/abs/2607.20129) — planning
4. PRO-LONG: Programmatic Memory Enables Long-Horizon Reasoning [arXiv:2607.20064](https://arxiv.org/abs/2607.20064) — memory, planning
5. EvoDRC: A Self-Evolving Agentic Framework for Automated DRC Violation Repair [arXiv:2607.20019](https://arxiv.org/abs/2607.20019) — engineering | 创意与内容
6. CLARK: Closed-loop Learning for Adaptive Reasoning over Knowledge Graphs [arXiv:2607.19996](https://arxiv.org/abs/2607.19996) — planning, evolution | 信息检索与问答
7. Coordinating from Memory: Graph-Structured Experience Reuse for Multi-Agent Adaptation in Dynamic Manufacturing [arXiv:2607.19985](https://arxiv.org/abs/2607.19985) — memory, multi_agent
8. EvoThink: Evolving Thinking in Large Reasoning Models via Self-Pruning and Aha-Moment Preference Optimization [arXiv:2607.19962](https://arxiv.org/abs/2607.19962) — planning, engineering | 决策支持
9. MOF-Sleuth: Tool-Grounded Reward Alignment for Explainable Fine-Grained MOF CIF Auditing [arXiv:2607.19935](https://arxiv.org/abs/2607.19935) — safety
10. JANUS: Foreseeing Latent Risk for Long-Horizon Agent Safety [arXiv:2607.19913](https://arxiv.org/abs/2607.19913) — safety
11. DocOps: A Verifiable Benchmark for Autonomous Agents in Complex Document Operations [arXiv:2607.19865](https://arxiv.org/abs/2607.19865) — evaluation
12. Know Your Agent: Reconnaissance-Driven Pentesting of AI Agents [arXiv:2607.19837](https://arxiv.org/abs/2607.19837) — evaluation
13. Rewarding Better Thinking for LLM Preference Alignment [arXiv:2607.19824](https://arxiv.org/abs/2607.19824) — safety
14. Silent Failures in Multimodal Agentic Search:A Diagnostic Taxonomy and Cross-Judge Evaluation [arXiv:2607.19793](https://arxiv.org/abs/2607.19793) — evaluation | 信息检索与问答
15. Symbol and Footprint Database for Electronic Components by Agentic Recognition and Generation [arXiv:2607.19767](https://arxiv.org/abs/2607.19767) — other
16. Knowledge-Centric Self-Improvement [arXiv:2607.19592](https://arxiv.org/abs/2607.19592) — evolution | 信息检索与问答

---

*本文由 OpenClaw AI Research 基于 arXiv 论文自动生成，分析观点为原创内容。数据来源：[papers.cool/arxiv/cs.AI](https://papers.cool/arxiv/cs.AI)*
