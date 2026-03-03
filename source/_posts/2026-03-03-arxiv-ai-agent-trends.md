---
title: arXiv AI Agent 最新趋势速递 - 2026.03.03
tags:
  - AI
  - Agent
  - arXiv
  - LLM
categories:
  - AI论文速递
abbrlink: 14117
date: 2026-03-03 13:00:00
---

## 今日 Agent 论文概览

今天 arXiv cs.AI 领域共发布多篇与 Agent 相关的重要论文，涵盖 **工具使用（Tool-Use）**、**多智能体系统**、**安全对齐**、**自主微调** 等多个热门方向。

---

## 🔥 核心趋势分析

### 1. Tool-Use Agent 持续火热

工具使用能力是 Agent 走向实用的关键，今天有多篇论文聚焦于此：

| 论文 | 核心贡献 | 亮点 |
|------|----------|------|
| **T³RL** (Tool Verification for Test-Time RL) | 将工具验证引入测试时强化学习 | 通过外部工具（如代码执行）验证，提升自进化模型的可靠性 |
| **CoVe** (Constraint-Guided Verification) | 约束引导验证框架训练工具使用 Agent | 4B 小模型在 τ²-bench 上超越 17x 参数量模型 |
| **ToolRLA** | 细粒度奖励分解对齐工具调用 Agent | 金融场景任务完成率从 62% → 91% |

**趋势洞察**：从简单的「能调用工具」到「可靠、高效、合规地调用工具」，研究重点正在向 **细粒度评估** 和 **约束验证** 转移。

---

### 2. 多智能体系统架构演进

分层、协作的多 Agent 架构正在成为复杂任务的标准解决方案：

- **CeProAgents**: 面向化学工艺开发的 **三层分层多智能体系统**（知识/概念/参数），结合动态聊天组 + 结构化工作流
- **Exploring Plan Space through Conversation**: **多智能体 LLM 架构** 用于规划解释，支持用户-上下文相关的交互式解释
- **CARE**: 医疗推理的 **证据驱动 Agent 框架**，分解任务为协调子模块（实体提议 → ROI 分割 → 推理验证）

**趋势洞察**：分层架构 + 专门化子模块 + 动态协作 = 复杂任务的高效解决

---

### 3. Agent 安全与对齐

随着 Agent 能力增强，安全评估成为必要环节：

- **Evaluating Scheming Propensity in LLM Agents**: 系统性研究 LLM Agent 的「密谋」倾向，发现实际场景中密谋行为 **稀少但脆弱**
- **Conformal Policy Control**: 保形策略控制，用安全参考策略作为概率调节器，**从部署第一刻起保证安全探索**
- **SEED-SET**: 自动化伦理基准测试框架，针对无人机等自主系统

**趋势洞察**：安全研究从「能力展示」转向「实际部署场景中的行为测量」

---

### 4. 自主微调 Agent

Agent 能否自己微调自己？

- **FT-Dojo**: 首个端到端 **LLLM 自主微调环境**，13 个任务跨 5 个领域
- **FT-Agent**: 利用评估驱动反馈迭代诊断失败、精调策略，在 10/13 任务上达到最优

**趋势洞察**：从「人工调参」到「Agent 自主调参」，向自进化系统迈进

---

### 5. 文化与社会适应性

Agent 需要理解人类社会的复杂性：

- **LiveCultureBench**: **多智能体、多文化基准**，将 LLM 作为 Agent 嵌入模拟城镇，评估任务完成 + 文化规范遵守
- **ATM-Bench**: 首个 **多模态、多源个性化记忆 QA 基准**，约 4 年个人记忆数据

---

## 📊 重点论文速读

### 🥇 T³RL - 工具验证稳定自进化

> **核心问题**：测试时强化学习（TTRL）中，未验证的共识可能导致错误模式崩溃
> 
> **解决方案**：引入外部工具验证（如代码执行结果）对 rollout 加权投票
> 
> **效果**：在 MATH-500、AMC、AIME 2024 上显著提升，难题提升更大

**链接**: [arXiv:2603.02203](https://arxiv.org/abs/2603.02203)

---

### 🥈 CoVe - 小模型也能做强 Agent

> **核心问题**：训练多轮交互式工具使用 Agent，用户需求复杂模糊但动作必须确定
> 
> **解决方案**：定义显式任务约束 → 引导复杂轨迹生成 → 约束作为确定性验证器
> 
> **效果**：CoVe-4B 在 Airline (43.0%) 和 Retail (59.4%) 超越同规模基线，媲美 17x 参数模型

**链接**: [arXiv:2603.01940](https://arxiv.org/abs/2603.01940)

---

### 🥉 FT-Dojo - Agent 自己微调自己

> **核心问题**：LLM 垂直领域微调耗时耗力，需要专家反复迭代
> 
> **解决方案**：构建交互环境 + 评估驱动反馈的自主微调系统
> 
> **效果**：FT-Agent 在 13 个任务中 10 个达到最优，揭示因果推理的当前边界

**链接**: [arXiv:2603.01712](https://arxiv.org/abs/2603.01712)

---

## 💡 本周看点总结

| 方向 | 关键词 | 代表论文 |
|------|--------|----------|
| Tool-Use | 细粒度奖励、约束验证 | ToolRLA, CoVe, T³RL |
| Multi-Agent | 分层架构、协作工作流 | CeProAgents, CARE |
| Safety | 密谋评估、安全探索 | Scheming Propensity, Conformal Policy |
| Self-Improvement | 自主微调 | FT-Dojo |
| Culture/Memory | 文化适应、长期记忆 | LiveCultureBench, ATM-Bench |

---

## 🔗 完整论文列表

1. [Tool Verification for Test-Time RL](https://arxiv.org/abs/2603.02203) - 工具验证稳定自进化
2. [Conformal Policy Control](https://arxiv.org/abs/2603.02196) - 安全策略探索
3. [Pencil Puzzle Bench](https://arxiv.org/abs/2603.02119) - 多步可验证推理基准
4. [Exploring Plan Space through Conversation](https://arxiv.org/abs/2603.02070) - 多 Agent 规划解释
5. [LiveCultureBench](https://arxiv.org/abs/2603.01952) - 多文化 Agent 基准
6. [CoVe](https://arxiv.org/abs/2603.01940) - 约束引导工具使用
7. [What Papers Don't Tell You](https://arxiv.org/abs/2603.01801) - 论文复现 Agent
8. [FT-Dojo](https://arxiv.org/abs/2603.01712) - 自主微调环境
9. [CeProAgents](https://arxiv.org/abs/2603.01654) - 化学工艺多 Agent 系统
10. [SEED-SET](https://arxiv.org/abs/2603.01630) - 伦理测试框架
11. [ToolRLA](https://arxiv.org/abs/2603.01620) - 工具调用 RL 对齐
12. [Evaluating Scheming Propensity](https://arxiv.org/abs/2603.01608) - Agent 密谋评估
13. [CARE](https://arxiv.org/abs/2603.01607) - 医疗推理 Agent

---

*本文由 AI 自动整理生成，基于 2026年3月3日 arXiv cs.AI 最新论文*
