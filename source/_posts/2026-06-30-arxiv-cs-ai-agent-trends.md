---
title: Agent 日报 | 2026-06-30 · cs.AI Agent 趋势速览
tags:
  - arxiv
  - agent
  - AI
  - 日报
categories:
  - Agent 日报
abbrlink: 41596
date: 2026-06-30 12:00:00
---

今日 [cs.AI](https://papers.cool/arxiv/cs.AI) 共 13 篇新文，其中 **7 篇与 Agent 直接相关**，趋势清晰——**安全免疫、世界模型、训练蒸馏、具身规划**四大方向齐头并进。

---

## 🔥 趋势一：Agent 安全从"对齐"走向"免疫"

### [#1] Agent-Native Immune System (ANIS)
**[论文](https://arxiv.org/abs/2606.28270) | cs.AI + cs.MA**

首个生物启发式 Agent 内生防御架构。核心观点：**模型对齐是"宪法"，Agent 免疫是"执法"**——对齐只提供训练时的静态价值基础，而 Agent 在运行时面临记忆投毒、工具链操控、多 Agent 协议攻击等动态威胁，需要一套嵌入认知循环的免疫系统。

- 六层免疫塔 L0-L5，L1 为非认知的物理-逻辑隔离层
- Agent Virus / Agent Vaccine 分类体系，区分非参数防御 vs 参数化疫苗
- Harness Triad（Meta/Self/Auto）驱动持续免疫学习（CIL）
- 提出 Autoimmunity Rate 等新评估指标

> 💡 **信号**：Agent 安全正在从"外围防护"转向"内生免疫"，与生物免疫系统类比极具启发性。随着 Agent 自主性增强，运行时安全将成为独立于对齐的核心研究方向。

---

## 🔥 趋势二：世界模型 + Agent 规划，减少幻觉是核心

### [#11] GILP — Grounded Iterative Language Planning
**[论文](https://arxiv.org/abs/2606.27806) | cs.AI**

LLM Agent 的世界模型有两种：基于 API 的语言世界模型（灵活但幻觉多）和参数化世界模型（可度量但能力弱）。GILP 将两者结合——小参数化 backbone 提供合法动作、状态预测、风险值，LLM 起草动作，一致性门控在两者不一致时请求修订。

- 幻觉状态率从 **17.6% 降至 3.5%**
- 成功率从 0.668 提升至 0.838，仅增加 ~22% LLM 调用

### [#12] Understanding Rollout Error in Graph World Models
**[论文](https://arxiv.org/abs/2606.27780) | cs.AI**

同一团队的前作，研究图结构世界模型的长时域 rollout 误差。提出 Error-Aware GWM（谱正则化 + rollout 一致性 + 关键节点加权），防止长时域发散。

- 图世界模型最适合动态图 rollout 和 Agent 规划
- 边预测 vs 固定边的误差传播模式截然不同

> 💡 **信号**：**小模型做"锚"，大模型做"想象"**——这是 Agent 规划中平衡可靠性与灵活性的新范式。世界模型研究正从向量/图像转向图结构，更贴近真实 Agent 场景。

---

## 🔥 趋势三：小模型 Agent 的训练方法持续演进

### [#10] ATOD — Annealed Turn-aware On-policy Distillation
**[论文](https://arxiv.org/abs/2606.27814) | cs.AI**

训练小模型 Agent 的核心矛盾：在线蒸馏（OPD）早期快但天花板低，RL 直接优化奖励但早期慢。ATOD 用退火调度（OPD → RL 渐进切换）+ Turn 级别重加权来解决。

- ALFWorld / WebShop / Search-QA 三个基准全面超越
- 比 OPD 平均高 3.03 分，比 GRPO 高 23.62 分
- **超越对应 Teacher 模型 2.16 分**

### [#2] TRL — Tandem Reinforcement Learning
**[论文](https://arxiv.org/abs/2606.28166) | cs.AI**

解决 RLVR 的"兼容性问题"——强模型推理能力虽强，但推理模式人类/弱模型难以跟随。TRL 让强模型（senior）和冻结弱模型（junior）交替生成，作为团队获得奖励。

- 匹配 GRPO 的独立推理能力
- 同时获得更强的交接鲁棒性、更小的分布漂移、更易读的 CoT

> 💡 **信号**：**小模型 Agent 训练进入"混合策略"时代**——蒸馏和 RL 不是二选一，而是需要时序调度和细粒度控制。人机兼容性成为 Agent 训练的新优化目标。

---

## 🔥 趋势四：具身 Agent 的社会规范与可靠规划

### [#9] NormAct — Hidden Social Norm Compliance
**[论文](https://arxiv.org/abs/2606.27826) | cs.AI**

具身规划不仅要完成任务，还要遵守隐性社会规范。NormAct 基准揭示：GPT-5.4/Claude Opus 4.7/Gemini 3 Pro 在显式目标达成 67.3%，但隐性规范遵守仅 26.4%。

- 提出 NormPerceptor：上下文条件化的线索生成器
- Task Success 从 24.2% 提升至 46.7%

### [#13] Symbolic Feedback-Driven Iterative Self-Refinement
**[论文](https://arxiv.org/abs/2606.27757) | cs.AI**

符号反馈驱动的 LLM 规划自精炼框架：自然语言提示机制映射逻辑符号，符号验证器识别错误并转为纠正指令，规划识别器推断目标可达性。

### [#8] SD-GPS — Solver-Driven Geometry Problem Solving
**[论文](https://arxiv.org/abs/2606.27926) | cs.AI + cs.CL + cs.CV**

将符号求解器作为执行预言机，贯穿形式化和推导全程。提出 impasse-aware agent 提出辅助引理，经符号验证确保正确性。

> 💡 **信号**：**神经+符号的深度融合**是 Agent 可靠规划的关键路径。从社会规范到几何证明，"让 Agent 知道自己不知道什么"比"让 Agent 更聪明"更紧迫。

---

## 📊 今日 Agent 论文全景

| # | 论文 | 关键词 | 核心贡献 |
|---|------|--------|----------|
| 1 | ANIS | 安全·免疫 | Agent 内生防御架构 |
| 10 | ATOD | 训练·蒸馏 | OPD-RL 退火调度 |
| 11 | GILP | 世界模型·规划 | 参数化锚+LLM 想象 |
| 12 | Graph WM | 世界模型·理论 | 图世界模型 rollout 误差 |
| 9 | NormAct | 具身·规范 | 隐性社会规范基准 |
| 13 | Symbolic Feedback | 规划·可靠 | 符号反馈自精炼 |
| 8 | SD-GPS | 推理·验证 | 求解器驱动形式化 |

---

## 🧭 总结

今日 Agent 研究呈现四条清晰主线：

1. **安全内生化**：从外围防护到认知循环内的免疫系统，对齐 ≠ 免疫
2. **世界模型锚定**：小参数化模型做"现实锚点"，大模型做"想象力"，一致性门控防幻觉
3. **训练策略混合化**：蒸馏+RL 退火调度，人机兼容成为优化目标
4. **神经符号融合**：符号验证器/求解器作为 Agent 的"校验层"，确保规划可靠可验证

一句话：**Agent 正在从"能做事"走向"安全地做事"和"可靠地做事"**。
