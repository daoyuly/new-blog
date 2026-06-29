---
title: AI Agent 前沿速递 (2026-06-29)：安全免疫、规划落地与小模型蒸馏
tags:
  - arxiv
  - agent
  - LLM
  - planning
  - security
  - distillation
categories:
  - 论文速递
abbrlink: 19470
date: 2026-06-29 12:00:00
---

今日 cs.AI 频道共收录 13 篇新论文，其中 **8 篇与 Agent 直接相关**。以下是按主题整理的趋势报告。

---

## 🔥 核心趋势一览

| 趋势方向 | 代表论文 | 一句话 |
|---------|---------|-------|
| Agent 安全与免疫系统 | ANIS | 把免疫系统内嵌到 Agent 认知循环 |
| Agent 规划的鲁棒性 | GILP / Symbolic Feedback / Graph WM | 用参数化世界模型 + 符号反馈减少幻觉 |
| 具身 Agent 社会规范 | NormAct | SOTA 模型显式目标 67%，隐式规范仅 26% |
| 小模型 Agent 蒸馏 | ATOD / TRL | 退火蒸馏 + RL，小模型超越老师 |
| 神经符号 Agent | SD-GPS | 求解器驱动自动形式化，几何推理新范式 |

---

## 1. Agent 安全：从对齐到免疫

### [Agent-Native Immune System (ANIS)](https://arxiv.org/abs/2606.28270)

这是今天最重磅的框架论文。作者指出：当前 Agent 的防御（对齐、边界安全）都在推理循环**外部**，面对运行时的记忆投毒、工具链操纵、多 Agent 协议攻击几乎无能为力。

**ANIS 的核心设计：**

- **六层免疫塔 (L0-L5)**：从物理隔离 (L1 Barrier Immunity) 到元认知自我监控 (L5)
- **Agent 病毒 vs Agent 疫苗**的统一分类法——区分了非参数化的表层防御和参数化的疫苗
- **驾驭三要素 (Meta/Self/Auto)**：持续免疫学习 (CIL) 让疫苗动态适应新威胁
- **对齐 ≠ 免疫**：对齐是训练时的"宪法"，免疫是运行时的"执法"

> 💡 **趋势判断**：Agent 安全正在从"训练时对齐"走向"运行时免疫"，这是 Agent 从 demo 走向生产的关键一步。

---

## 2. Agent 规划：减少幻觉、增强鲁棒性

三篇论文从不同角度解决同一个问题——**LLM Agent 规划不可靠**。

### [GILP: Grounded Iterative Language Planning](https://arxiv.org/abs/2606.27806)

核心思路：**参数化世界模型 + LLM 推理 = 低幻觉规划**。

- 训练一个小的参数化状态转移预测器，提供 valid actions、state deltas、risk/value
- LLM 起草动作和想象的状态变化
- **一致性门控**：两者不一致时要求 LLM 修正
- 幻觉状态率从 **17.6% → 3.5%**，成功率 66.8% → 83.8%，仅多 ~22% LLM 调用

### [Graph World Models & Error-Aware GWM](https://arxiv.org/abs/2606.27780)

图结构世界模型中的 rollout 误差分析：
- 将误差分解为**拓扑放大**和**模型放大**
- 提出谱正则化 + rollout 一致性 + 关键节点加权
- 动态边场景下 GWM 对 Agent 规划最有价值

### [Symbolic Feedback-Driven Self-Refinement](https://arxiv.org/abs/2606.27757)

符号验证器 + 自然语言映射 → LLM 自我修正：
- 将逻辑符号映射为自然语言描述，帮助 LLM 理解约束
- 符号验证器识别错误，转化为可解释的修正指令
- Plan Recognizer 推断目标可达性

> 💡 **趋势判断**：纯 LLM 规划的天花板已现，"参数化模型锚定 + 符号反馈修正"成为主流范式。

---

## 3. 具身 Agent 的社会规范盲区

### [NormAct](https://arxiv.org/abs/2606.27826)

非常扎心的 Benchmark：测试具身 Agent 能否遵守**隐式社会规范**。

**核心发现：**
- GPT-5.4 / Claude Opus 4.7 / Gemini 3 Pro：显式目标达成 **67.3%**，隐式规范遵守仅 **26.4%**
- 不是缺乏社会知识，而是**无法在上下文中激活和落地**相关规范
- 提出的 **NormPerceptor**（上下文条件线索生成器）将 Task Success 从 24.2% 提升到 46.7%

> 💡 **趋势判断**：Agent 的下一个瓶颈不是能力，而是"懂事"——理解隐含的社会约束。

---

## 4. 小模型 Agent 训练：蒸馏 + RL 的退火策略

### [ATOD: Annealed Turn-aware On-policy Distillation](https://arxiv.org/abs/2606.27814)

小模型做 Agent 的经典困境：OPD（在线蒸馏）起步快但天花板低，RL 天花板高但起步慢。

**ATOD 的解法：**
1. **退火调度**：早期 OPD 为主 → 逐渐增强 RL
2. **T-DUR**：Turn 级别的 Disagreement-Uncertainty 重加权，放大高效用 turn 的监督信号
3. 在 ALFWorld / WebShop / Search-QA 上，平均成功率比 OPD 高 3.03 点，比 GRPO 高 **23.62 点**，甚至超越老师模型 2.16 点

### [TRL: Tandem Reinforcement Learning](https://arxiv.org/abs/2606.28166)

解决 RLVR 的兼容性问题：强模型推理方式对弱模型/人类不可读。

- Senior + Junior 交替生成推理链，作为团队获得奖励
- Senior 被迫用 Junior 能跟上的方式推理
- Solo 能力不降，同时提升交接鲁棒性、减少分布偏移、CoT 更可读

> 💡 **趋势判断**：小模型 Agent 不再只是"蒸馏"，退火式 OPD→RL 和 Senior-Junior 协同训练成为新范式。

---

## 5. 神经符号 Agent：从几何推理看形式化落地

### [SD-GPS: Solver-Driven Autoformalization](https://arxiv.org/abs/2606.27926)

将符号求解器作为执行神谕，贯穿形式化和推理两阶段：
- **Solver-Driven Autoformalization**：以可执行性为核心训练信号（基于 QwenVL3-2B）
- **Verified Theorem Proposing**：僵局感知 Agent 提出辅助引理，经符号验证过滤
- 在 Geometry3K 和 PGPS9K 上全面超越现有方法

> 💡 神经 Agent + 形式系统 = 可验证的推理能力，这对 Agent 在安全关键场景的部署至关重要。

---

## 📊 本日 Agent 论文速查表

| # | 论文 | 核心贡献 | 关键指标 |
|---|------|---------|---------|
| 1 | [ANIS](https://arxiv.org/abs/2606.28270) | Agent 免疫系统架构 | 框架性工作 |
| 2 | [TRL](https://arxiv.org/abs/2606.28166) | Senior-Junior 协同 RL | Solo 不降 + 可读性提升 |
| 9 | [NormAct](https://arxiv.org/abs/2606.27826) | 隐式社会规范 Benchmark | 规范遵守 26.4% → 46.7% |
| 10 | [ATOD](https://arxiv.org/abs/2606.27814) | 退火蒸馏+RL | 比 GRPO 高 23.62 点 |
| 11 | [GILP](https://arxiv.org/abs/2606.27806) | 参数化模型减少幻觉 | 幻觉率 17.6% → 3.5% |
| 12 | [Graph WM](https://arxiv.org/abs/2606.27780) | 图世界模型误差分析 | 防止长程发散 |
| 13 | [Symbolic Feedback](https://arxiv.org/abs/2606.27757) | 符号反馈自修正 | 可行性+正确性双提升 |
| 8 | [SD-GPS](https://arxiv.org/abs/2606.27926) | 求解器驱动自动形式化 | 全面超越现有方法 |

---

*数据来源：[papers.cool/arxiv/cs.AI](https://papers.cool/arxiv/cs.AI) | 发布日期 2026-06-26 | 整理时间 2026-06-29*
