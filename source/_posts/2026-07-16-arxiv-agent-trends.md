---
title: arXiv cs.AI Agent 研究趋势 (2026-07-16)
tags:
  - arXiv
  - AI Agent
  - cs.AI
  - 研究趋势
categories:
  - AI 研究
  - Agent
abbrlink: 29507
date: 2026-07-16 12:00:00
---

# arXiv cs.AI Agent 研究趋势 (2026-07-16)

> 每日追踪 arXiv cs.AI 领域中与 **Agent** 相关的最新研究进展

## 📊 今日概览

- **发布日期：** 2026年7月16日
- **Agent 相关论文：** 至少 13 篇
- **核心主题：** Agent 持续优化与记忆、安全治理、评估基准、人机交互、具身智能、多 Agent 协作

---

## 🔥 核心 Agent 论文速览

### #1 - Do Agent Optimizers Compound? A Continual-Learning Evaluation on Terminal-Bench 2.0

**作者：** Wenxiao Wang, Priyatham Kattakinda, Soheil Feizi

**链接：** [arxiv.org/abs/2607.14004](https://arxiv.org/abs/2607.14004)

Agent 优化方法的收益能否叠加？本文提出两阶段持续学习评估框架，在 Terminal-Bench 2.0 上对比 GEPA、Meta Harness 和 RELAI-VCL 三种 agent harness 优化方法。关键发现：只有内建回归控制的 RELAI-VCL 能在新任务上持续提升（终身平均通过率 76.4%），而 GEPA 优化后甚至低于未优化基线（66.0%）。

> 💡 **趋势洞察：** Agent 优化正从一次性调参转向持续学习范式，回归控制是防止"优化反噬"的关键。

---

### #2 - A Self-Evolving Agent for Longitudinal Personal Health Management (HealthClaw)

**作者：** Haoran Li, Jiebi Deng, Tong Jin 等

**链接：** [arxiv.org/abs/2607.13940](https://arxiv.org/abs/2607.13940)

HealthClaw 提出自我进化 agent 架构，将共享安全规则与私人纵向记忆分离（profile facts、可复用 procedures、episodic traces），每次交互后通过归纳决定更新什么、保留什么、排除什么。准确率从当前查询提示的 0.2% 提升至 45.7%，上下文暴露减少 71.7%，隐私泄露更少。开源：[github.com/HC-Guo/HealthClaw](https://github.com/HC-Guo/HealthClaw)

> 💡 **趋势洞察：** 纵向记忆管理是 agent 走向长期部署的核心能力，"归纳-分离-治理"的记忆架构值得关注。

---

### #3 - Experience Memory Graph: One-Shot Error Correction for Agents

**作者：** Wenjun Wang, Yuchen Fang, Fengrui Liu, Zibo Liang, Kai Zheng

**链接：** [arxiv.org/abs/2607.13884](https://arxiv.org/abs/2607.13884)

EMG 将 agent 失败恢复重新定义为图匹配问题：将失败轨迹和成功轨迹转为有向动作决策图，提取公共子图和图编辑路径，存入含任务内节点和跨任务边的记忆图。测试时一次执行，无需试错循环。在 ALFWorld 和 ScienceWorld 上持续超越 reflection 基线。

> 💡 **趋势洞察：** 从 prompt-based reflection 转向结构化记忆图谱，agent 的错误纠正正在"图灵化"——用图结构替代反复尝试。

---

### #4 - CAVA: Canonical Action Verification and Attestation for Runtime Governance of Agentic AI Systems

**作者：** Zexun Wang

**链接：** [arxiv.org/abs/2607.13716](https://arxiv.org/abs/2607.13716)

CAVA 提出"规范动作验证与认证"层，将异构运行时（SDK、浏览器、API 网关等）的 agent 活动统一为规范运行时动作对象，解决"到底批准了什么动作"这一治理根本问题。在 96-seed、384-variant 基准上验证了语义等价性、绕过检测、审批绑定等能力。

> 💡 **趋势洞察：** Agent 治理正从"要不要拦"演进到"拦的东西到底是什么"——动作语义规范化是可治理性的前提。

---

### #5 - AgentCompass: A Unified Evaluation Infrastructure for Agent Capabilities

**作者：** Zichen Ding, Jiaye Ge, Shufan Jiang 等（23人）

**链接：** [arxiv.org/abs/2607.13705](https://arxiv.org/abs/2607.13705)

开源轻量可扩展的 agent 评估基础设施，将评估拆分为 Benchmark、Harness、Environment 三个独立组件。支持容错异步运行时和轨迹分析工具（可诊断 reward-hacking 等细微失败模式），原生支持 20+ 基准，覆盖五个能力维度。

> 💡 **趋势洞察：** 评估基础设施的标准化正在追赶 agent 系统的发展速度，可复现性是社区下一步的刚需。

---

### #6 - STOCKTAKE: Measuring the Gap Between Perception and Action in LLM Agents

**作者：** Sagar Deb, Ashwanth Krishnan

**链接：** [arxiv.org/abs/2607.13618](https://arxiv.org/abs/2607.13618)

提出"知行差距"（knowing-doing gap）的概念：agent 能正确诊断问题但仍然无法正确行动。在 26 周供应链补充基准上，Claude Sonnet 5、GPT-5.4、DeepSeek-V4-Pro、Grok 4.5 检测隐藏故障率 84-88%，但两个模型技能分低于"盲猜基线"——问题不只是"不响应"，还包括"响应代价超过保护价值"。

> 💡 **趋势洞察：** "知道"和"做到"是两回事，这个 gap 是 agent 落地最大的鸿沟之一。

---

### #7 - SAFETY SENTRY: Context-Aware Human Intervention via EXECUTE-ASK-REFUSE Routing

**作者：** Tianyu Chen, Chujia Hu, Wenjie Wang

**链接：** [arxiv.org/abs/2607.13705](https://arxiv.org/abs/2607.13705)

将 agent 安全防护从二元 {safe/unsafe} 重构为三元 {EXECUTE, ASK, REFUSE} 路由，基于实例而非类别粒度判断。单一解码阈值即可调整风险容忍度，无需重训练。在准确率和安全召回率上均优于多个开源和闭源基线。

> 💡 **趋势洞察：** 安全不再是简单的开关，而是带阈值的旋钮——"问一声"比"全拦"或"全放"都更合理。

---

### #8 - When Bots Join the Team: Bot Adoption and the Institutional Fabric of Open-Source Software Projects

**作者：** Yongren Shi, Wenyi Gong

**链接：** [arxiv.org/abs/2607.13679](https://arxiv.org/abs/2607.13679)

对 2,991 个 GitHub 项目追踪机器人采纳前后两年变化，发现：采纳后重复协作增加、冲突级联减少、产出更具辨识度。核心发现——"机器人是契机，社会组织才是机制"（The bot is the occasion; social organization is the mechanism）。

> 💡 **趋势洞察：** Agent 融入团队不是技术问题而是社会问题，组织架构比 bot 本身更重要。

---

### #9 - Deep Interaction: An Efficient Human-AI Interaction Method for Large Reasoning Models

**作者：** Jinxuan Zhang, Jiong Lou, Yuxin Liu 等

**链接：** [arxiv.org/abs/2607.14049](https://arxiv.org/abs/2607.14049)

提出 Deep Interaction，允许用户直接编辑 CoT 中的错误步骤，将编辑后的 CoT 蒸馏为 prompt 引导 LLM 沿修正路径推理。修正成功率提升 25%+，token 用量减少约 40%。

> 💡 **趋势洞察：** 人机交互正在从"对话式纠错"走向"编辑式纠错"——直接改推理链比让模型重来更高效。

---

### #10 - Multi-Agent Collaborative Reasoning with Tool-Augmented Evidence for Urban Region Profiling

**作者：** Xixuan Hao, Yutian Jiang, Jiabo Liu 等

**链接：** [arxiv.org/abs/2607.13597](https://arxiv.org/abs/2607.13597)

多 agent 协作推理框架，结合工具增强证据进行城市区域画像，从相关性驱动转向因果推理驱动。

---

### #11 - MEDA: Automatic ODE Discovery for Biological Systems Using LLM-Powered Agentic System

**作者：** David Krongauz, Arad Zulti, Eran Segal, Teddy Lazebnik

**链接：** [arxiv.org/abs/2607.13588](https://arxiv.org/abs/2607.13588)

LLM+符号回归驱动的 agentic 框架，用于自动发现生物系统的常微分方程模型。能检索背景知识、定义变量、生成约束、提出候选 ODE 并拟合评估。

> 💡 **趋势洞察：** Agent 正从"通用助手"渗透到科学发现的各个环节，生物系统是下一个前沿。

---

### #12 - UESF-Bench: Unified Embodied Seeking and Following

**作者：** Kun Yu, Jianhua Yang, Yixiang Chen 等

**链接：** [arxiv.org/abs/2607.13621](https://arxiv.org/abs/2607.13621)

提出统一具身"寻找-跟随"基准，要求 agent 先找到语言描述的目标再持续跟随，提出 SeekFollow-VLA 框架实现任务驱动的阶段路由。

---

### #13 - Explaining RL Agents via Inductive Logic Programming

**作者：** Celeste Veronese, Edoardo Zorzi 等

**链接：** [arxiv.org/abs/2607.13655](https://arxiv.org/abs/2607.13655)

用归纳逻辑编程提取 RL 策略的符号表示，定义激活率、特征覆盖、语法/语义距离等可解释性指标，覆盖单 agent 和多 agent 场景。

---

## 📈 趋势总结

### 1. Agent 记忆与持续进化成为主旋律
HealthClaw 的纵向记忆、EMG 的经验图谱、Terminal-Bench 的持续优化——都在解决同一个问题：**agent 如何在长期部署中不退化反而越用越好**。记忆架构的设计（分离、归纳、跨任务迁移）是关键。

### 2. 安全治理从"拦不拦"走向"拦什么、怎么拦"
CAVA 的动作规范化、Safety Sentry 的三元路由、STOCKTAKE 的知行差距分析——agent 安全正在从二分类走向精细化的治理栈。

### 3. 评估基础设施的成熟化
AgentCompass 统一评估框架、STOCKTAKE 分离感知与行动评估、Terminal-Bench 2.0 持续学习评测——社区对"怎么评 agent"的共识正在形成。

### 4. 人机协作模式升级
Deep Interaction 的编辑式纠错、Bot Join the Team 的组织视角——人 agent 交互正从"对话"走向更深层的协作。

### 5. Agent 向垂直领域渗透
HealthClaw（健康管理）、MEDA（生物系统发现）、UESF-Bench（具身跟随）——agent 应用正在从通用任务向专业领域深入。

---

*数据来源：[papers.cool/arxiv/cs.AI](https://papers.cool/arxiv/cs.AI) | 自动整理 by 来顺 🎋*
