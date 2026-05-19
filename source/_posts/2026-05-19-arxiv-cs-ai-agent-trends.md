---
title: arXiv cs.AI Agent 前沿日报 (2026-05-19)
date: '2026-05-19 12:00:00 +0800'
categories:
  - arXiv
  - Agent
tags:
  - llm-agent
  - memory
  - exploration
  - formal-methods
  - web-agent
  - benchmark
abbrlink: 12386
---

## 今日 Agent 相关论文精选

数据来源：[papers.cool/arxiv/cs.AI](https://papers.cool/arxiv/cs.AI)，发布日期 2025-05-15。

---

### 🔥 Agent 记忆与自我进化

**[FORGE: Self-Evolving Agent Memory With No Weight Updates via Population Broadcast](https://arxiv.org/abs/2605.16233)**

核心问题：LLM Agent 能否通过自我生成的记忆（无需梯度更新）来提升决策？

- 提出 FORGE 框架——基于种群的分阶段协议，为层级化 ReAct Agent 演化 prompt 注入的自然语言记忆
- 内循环：反思 Agent 将失败轨迹转化为可复用的知识产物（Rules / Examples / Mixed）
- 外循环：种群广播机制将最优实例的记忆传播至整个种群
- 在 CybORG CAGE-2 网络防御环境中，平均回报比零样本提升 **1.7-7.7×**，比 Reflexion 基线提升 **29-72%**
- 关键发现：**种群广播是核心驱动力**；弱模型获益更大，说明 FORGE 可能缩小而非放大能力差距

> 💡 **趋势信号**：Agent 记忆从"单流 Reflexion"进化到"种群级知识广播"，无需训练即可积累经验。

---

### 🧭 Agent 探索能力

**[Look Before You Leap: Autonomous Exploration for LLM Agents](https://arxiv.org/abs/2605.16143)**

- 指出 LLM Agent 在陌生环境中失败的根本原因：**过早利用 (premature exploitation)**——先验知识驱动行动，而非先充分探索环境
- 提出 **Exploration Checkpoint Coverage** 指标，量化 Agent 对关键状态/物体/可达性的发现广度
- 引入 **Explore-then-Act** 范式：先用交互预算收集环境知识，再执行任务
- 标准任务导向 RL 训练的 Agent 表现出窄且重复的行为模式

> 💡 **趋势信号**：探索不再是 RL 的附属品，而是 LLM Agent 的独立核心能力。先探索再行动的范式正在形成共识。

---

**[ScreenSearch: Uncertainty-Aware OS Exploration](https://arxiv.org/abs/2605.16024)**

- 桌面 GUI Agent 的核心挑战：视觉相似的屏幕可能对应不同底层状态
- 将桌面行为建模为 **OS 状态探索问题**，结合结构化屏幕检索 + 去重 + 模糊感知 PUCT 图-bandit
- 在 11 个桌面应用中收集 **100 万+截图**、**3 万+去重状态**
- 发现新颖性-模糊性的权衡：仅降低模糊性不是充分的探索目标

> 💡 **趋势信号**：GUI Agent 从"屏幕截图 + 动作"走向"状态图探索"，不确定性感知成为关键设计维度。

---

### 🏗️ Compound Agent 架构设计

**[Context, Reasoning, and Hierarchy: A Cost-Performance Study of Compound LLM Agent Design](https://arxiv.org/abs/2605.16205)**

- 在对抗性 POMDP（CybORG CAGE-2）中系统研究三个设计维度：上下文表示、推理方式、任务分解
- **核心发现**：
  1. 程序化状态抽象的 token 性价比最高（提升平均回报达 **76%**）
  2. 在层级中叠加推理工具反而降低性能（"**推理级联**"效应），性能恶化高达 **3.4×**，token 消耗增加 **1.8-2.7×**
  3. 层级分解不加推理 = 大多数模型的最佳绝对性能
- 设计原则：**投资程序化基础设施和清晰的任务分解，而非更深的逐 Agent 推理**

> 💡 **趋势信号**：Agent 不是越复杂越好。"推理级联"是重要的失败模式，简洁架构 > 堆叠推理。

---

### 🛡️ Agent 安全与合规

**[Formal Methods Meet LLMs: Auditing, Monitoring, and Intervention](https://arxiv.org/abs/2605.16198)**

- 将**线性时序逻辑 (LTL)** 的形式化方法与 LLM 结合，实现 Agent 行为的离线审计和在线监控
- 引入**干预式监控器**，在运行时预测并主动阻止违规行为
- 小模型标签器在检测时序约束违反方面可匹敌甚至超越前沿 LLM 评判器
- LLM 时序推理能力随事件距离、约束数量、命题数量的增加而显著退化

> 💡 **趋势信号**：形式化方法 + LLM 成为 Agent 安全的新范式——用数学保证补充 LLM 的模糊性。

---

### 🛒 Web Agent 基准

**[ShopGym: E-Commerce Web Agent 仿真与基准框架](https://arxiv.org/abs/2605.16116)**

- 电商 Web Agent 评估的核心矛盾：真实环境不可复现 vs. 沙箱环境不够真实
- ShopArena 将真实店铺转化为可重置、可检查的沙箱；ShopGuru 生成 7 类技能的基准任务
- 224 个任务、6 个沙箱店铺验证：合成店铺保持真实店铺的结构特性，Agent 表现正相关

---

### 📚 Agent 在垂直领域的应用

| 论文 | 领域 | 核心洞察 |
|------|------|----------|
| [#1 Disease Forecasting](https://arxiv.org/abs/2605.16238) | 公共卫生 | LLM 引导的树搜索自主生成预测模型，表现匹敌 CDC 人工模型 |
| [#4 LLM Tutoring Agents](https://arxiv.org/abs/2605.16207) | 教育 | LLM 在最需要反馈的地方（非最优但有效的步骤）表现最差，建议混合架构 |
| [#9 Property-Guided Synthesis](https://arxiv.org/abs/2605.16142) | 规划 | 用形式化属性（反例引导修复）替代简单评分，程序生成量减少 **7×** |

---

## 📊 今日趋势总结

1. **探索是 Agent 的核心能力**：两篇独立论文（Look Before You Leap + ScreenSearch）分别从通用 Agent 和 GUI Agent 角度强调探索的重要性，Explore-then-Act 正在成为新范式

2. **记忆与经验的种群级共享**：FORGE 的种群广播机制表明，Agent 间的知识传播比个体反思更有效，这指向多 Agent 协作学习的新方向

3. **简洁架构胜过堆叠推理**：Compound Agent 设计研究揭示"推理级联"陷阱——在层级分解上叠加推理工具适得其反

4. **形式化方法回归**：LTL 监控、属性引导合成等论文表明，用数学工具约束和验证 LLM Agent 行为是一个快速发展的方向

5. **垂直领域 Agent 的务实路线**：医疗、教育、法律、电商等领域更倾向于混合架构（符号系统 + LLM），而非纯 LLM 方案
