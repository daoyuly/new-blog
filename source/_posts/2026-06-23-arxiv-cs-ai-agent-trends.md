---
title: arXiv cs.AI 日报：Agent 相关最新趋势 (2026-06-23)
categories:
  - arxiv
  - agent
tags:
  - agent
  - LLM
  - multi-agent
  - skill
  - tool-calling
  - arxiv
abbrlink: 21227
date: 2026-06-23 12:00:00
---

## 今日 Agent 相关论文精选

数据来源：[papers.cool/arxiv/cs.AI](https://papers.cool/arxiv/cs.AI)，从今日 24 篇 cs.AI 论文中筛选出与 Agent 密切相关的 6 篇。

---

### 1. 🏦 LedgerAgent：为工具调用 Agent 引入结构化状态账本

**论文**：[LedgerAgent: Structured State for Policy-Adherent Tool-Calling Agents](https://arxiv.org/abs/2606.20529)

**核心问题**：现有工具调用 Agent 将所有观察、工具返回和策略指令塞进 prompt，状态管理是隐式的，导致两种常见故障——(1) 用过时/错误信息做决策，(2) 语法合法但违反业务策略的 tool call。

**方法**：引入独立的 Ledger（账本）来维护任务状态（事实、约束、条件），渲染到 prompt 中；并在执行环境变更 tool call 前用 Ledger 检查策略约束，阻止违规操作。

**结果**：在 4 个客服领域 + 多种开源/闭源模型上，pass^k 一致性指标显著提升。

**趋势解读**：Agent 的状态管理正从"全塞 prompt"走向结构化显式表示。Ledger 思路类似数据库事务的 ACID 保障——把 Agent 的"工作记忆"外部化、可检查。

---

### 2. 🤖 自动挖掘 SKILL.md：从 GUI 交互轨迹生成技能库

**论文**：[Automating SKILL.md Generation for Computer-Using Agents via Interaction Trajectory Mining](https://arxiv.org/abs/2606.20363)

**核心问题**：显式技能库（如 SKILL.md）让计算机 Agent 更可审查，但能否从交互数据自动挖掘可迁移的技能？

**方法**：三阶段管线——分割 GUI 轨迹 → 聚类为候选技能 → 训练 skill-aware 策略。8 个聚类中 5 个纯度 ≥0.95。

**结果**：可读但不可迁移。GRPO 仅将 skill-step 准确率从 18.5% 提到 20.5%，BrowseComp+ 基本无变化。

**趋势解读**：技能的"可读性"≠"可迁移性"。当前轨迹挖掘能发现结构，但边界检测器、无序段表示和离线奖励模型还不足以支撑跨域策略提升。这是一个重要的负结果。

---

### 3. 🧬 SoftSkill：用连续潜变量替代 Markdown 技能文件

**论文**：[SoftSkill: Behavioral Compression for Contextual Adaptation](https://arxiv.org/abs/2606.20333)

**核心问题**：Agent 技能通常以 Markdown 文件部署，但冻结的 LLM 需要每次重新解释这些文本——能否将技能压缩为紧凑的连续上下文？

**方法**：SoftSkill 将自然语言技能初始化为长度-32 的 soft prefix，用 next-token prediction 微调，推理时作为 latent behavioral prior 注入，基座模型保持冻结。

**结果**：在 Qwen3.5-4B 上，SearchQA +8.3、LiveMath +42.1、DocVQA +1.3。vs SkillOpt 在 SearchQA +5.2、LiveMath +12.5，同时用几个 virtual token 替代数百 Markdown token。

**趋势解读**：与 #2 形成互补——#2 证明 Markdown 技能的局限，#3 提出绕过文本的替代方案。**Agent 技能正在从"文本描述"向"潜变量控制"演进**，类似 prompt tuning 之于 prompt engineering。

---

### 4. 🧩 MACR：多 Agent 推理解决 LLM 知识冲突

**论文**：[Navigating Unreliable Parametric and Contextual Knowledge: Explicit Knowledge Conflict Resolution for LLM Inference](https://arxiv.org/abs/2606.20245)

**核心问题**：LLM 的参数知识与外部上下文可能冲突，且外部上下文之间也可能矛盾。现有方法假设某一方可靠，回避而非解决冲突。

**方法**：MACR 框架——先用改进的语义熵量化 LLM 对答案的置信度，据此外化内部知识或检索外部知识；再用 3 个专用 Agent 分别归纳规则、分析冲突、解决不一致。

**结果**：在多个基准上显著优于 SOTA 基线，且提供可解释的冲突解决过程。

**趋势解读**：多 Agent 不再只用于任务分工，更用于**认知仲裁**——让不同 Agent 扮演"公诉人/辩护人/法官"角色来处理不确定性。

---

### 5. 🎯 MAMO：多 Agent 多目标约束优化

**论文**：[A Multi-Agent system for Multi-Objective constrained optimization](https://arxiv.org/abs/2606.20236)

**核心问题**：约束优化中，成本和约束违反的权重需手动设定，动态环境下难以平衡。

**方法**：MAMO 将任务执行与目标设计解耦，用多 Agent RL 学习奖励权重，将权重选择本身建模为学习问题。

**趋势解读**：多 Agent RL 的应用从博弈扩展到**元优化**——用 Agent 学习其他 Agent 的激励结构。朝着更自主的 Agent 系统迈出一步。

---

### 6. 🚗 Lagrange：开放词汇端到端自动驾驶

**论文**：[Lagrange: An Open-Vocabulary, Energy-Based Sparse Framework for Generalized End-to-End Driving](https://arxiv.org/abs/2606.20274)

**核心问题**：稀疏规划器依赖闭集定义，OOD 场景脆弱；VLA 模型的自回归 token 生成与连续高频控制需求矛盾。

**方法**：Lagrange 用 VLM 编码开放词汇对象为连续语义 token，通过意图驱动的 masked cross-attention 过滤，解码为隐式能量场，将决策建模为 Lagrangian 作用量最小化问题，确保运动学合规。

**趋势解读**：自动驾驶 Agent 正在融合 VLM 的开放世界理解与物理约束的形式化保证，"能量场 + Lagrangian 优化"是一种优雅的统一框架。

---

## 今日趋势总结

| 趋势 | 代表论文 | 关键词 |
|------|---------|--------|
| Agent 状态结构化 | LedgerAgent | 显式状态账本、策略合规检查 |
| 技能表示革新 | SoftSkill, SKILL.md Mining | 文本→潜变量、可读≠可迁移 |
| 多 Agent 认知仲裁 | MACR, MAMO | 冲突消解、元优化 |
| 物理约束 Agent | Lagrange | 能量场、Lagrangian 优化 |

**一句话**：今天的 Agent 研究在三个方向同时发力——**让状态更结构化、让技能更紧凑、让多 Agent 协作从任务分工走向认知治理**。SoftSkill 的潜变量技能尤其值得关注，它可能重新定义"Agent 技能"的基本单位。
