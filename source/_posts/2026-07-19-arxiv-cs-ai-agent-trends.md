---
title: arXiv cs.AI Agent 趋势日报 (2026-07-19)
tags:
  - arxiv
  - AI Agent
  - 趋势日报
categories:
  - 论文速递
abbrlink: 31985
date: 2026-07-19 12:50:00
---

本文从 [papers.cool/arxiv/cs.AI](https://papers.cool/arxiv/cs.AI) 今日更新中筛选 Agent 相关论文，提炼最新趋势。

## 🔥 今日 Agent 相关论文

### 1. SearchOS: 面向鲁棒开放域信息检索的多 Agent 协作系统

**论文**: [SearchOS-V1](https://arxiv.org/abs/2607.15257) | 人大 & 中科院

当前信息检索 Agent 随着交互历史增长，容易陷入重复搜索循环。SearchOS 提出将隐式的搜索进度**外化为显式、持久、可共享的状态**：

- **搜索导向上下文管理 (SOCM)**：前沿任务队列 + 证据图 + 覆盖率地图 + 失败记忆
- **流水线并行调度**：子 Agent 交错执行，空闲槽位自动补充未解决任务
- **搜索工具中间件**：拦截模型/工具交互，记录证据，响应停滞或预算耗尽

> 💡 **趋势洞察**：Agent 的"记忆外部化"成为多 Agent 协作的关键设计模式，避免上下文窗口爆炸和重复劳动。

---

### 2. Plover: 以计划为中心的 GUI Agent 交互系统

**论文**: [Plover](https://arxiv.org/abs/2607.15193) | Lenovo Research

GUI Agent 在动态界面中容易偏离用户意图，且计划不透明。Plover 的核心思路是**将计划外化为可检视、可修改的工件**：

- **Planner-Executor 架构**：计划与执行分离
- **局部修正**：用户可编辑计划中的特定步骤，无需从头重来
- **截图锚定干预**：基于截图进行精确引导
- 保留已有进展的同时进行修复

> 💡 **趋势洞察**：GUI Agent 正从"黑箱执行"走向"白箱协作"，计划可见性和人机共修是核心方向。

---

### 3. PRISM: 具身 Agent 的物理安全探测

**论文**: [When Words Are Safe But Actions Kill](https://arxiv.org/abs/2607.15218) | 清华 & 人大

LLM 作为具身 Agent 的规划器时，**语言上安全的指令在物理世界中可能危险**。本文发现：

- **内容危险 (CD) 和物理危险 (PD) 是可分离的信号**，存在于 LLM 隐藏状态中
- PRISM 探针在 SafeAgentBench 上达 86.2-87.7% 准确率，误报率仅 11.7-13.7%
- LLM Judge 误报率高达 24.7-39.0%，PRISM 显著优于文本审查

> 💡 **趋势洞察**：Agent 安全从"文本安全"走向"物理安全"，隐藏状态探针可能是更高效的安全守卫方案。

---

### 4. AutoSynthesis: 自动化元分析的多 Agent 系统

**论文**: [AutoSynthesis](https://arxiv.org/abs/2607.15247)

端到端的元分析 Agent 流水线：搜索策略 → 文献检索 → 筛选 → 全文评估 → 统计提取 → 效应量计算 → 随机效应元分析。输出符合 PRISMA 规范的透明报告。筛选 28+ 篇研究，提取 20+ 条定量声明，结果与人工元分析高度一致。

> 💡 **趋势洞察**：Agent 正在深入科学研究流程，"端到端"自动化从代码走向学术方法论。

---

### 5. BrainPilot: 脑科学发现的多 Agent 系统

**论文**: [BrainPilot](https://arxiv.org/abs/2607.15079)

全开源多 Agent 脑科学研究系统：

- **PI Agent** 协调专家 Agent，基于 7,233 条领域知识 + 72 个可复用方法单元
- **Graph of Trace**：可审计的工作流记录，链接子目标、工具使用、证据和声明
- **Auditor Agent**：集成幻觉检查
- 开源骨干模型达到 SOTA Agent 框架可比性能，成本更低

> 💡 **趋势洞察**：领域 Agent 的核心竞争力是**领域知识注入 + 可审计性**，而非通用能力的堆叠。

---

### 6. Proof-or-Stop: 自主编码 Agent 的证据门控生命周期

**论文**: [Proof-or-Stop](https://arxiv.org/abs/2607.14890)

自主编码 Agent 的"reviewed""tested""DONE"等状态只是声明，除非有证据支撑。本文提出：

- Agent 输出视为**声明**而非状态
- 生命周期转换仅在**新鲜、可追踪、机械可验证的证据**满足门控条件时才允许
- 无值守引擎 10/10 场景零假 DONE，收据包拒绝 18 种篡改攻击

> 💡 **趋势洞察**：Agent 可信度从"信任输出"转向"信任证据"，证据门控是 Agent 落地的关键基础设施。

---

## 📊 趋势总结

| 趋势 | 代表论文 | 关键词 |
|------|---------|--------|
| 状态外化 | SearchOS, Plover | 记忆外部化、计划可见性 |
| 安全深化 | PRISM, Proof-or-Stop | 物理安全、证据门控 |
| 科学自动化 | AutoSynthesis, BrainPilot | 端到端科研、可审计 |
| 人机协作 | Plover, BrainPilot | 局部修正、专家在环 |

**核心信号**：Agent 研究正从"能做什么"转向"如何可靠地做"——状态外化确保不迷路，证据门控确保不撒谎，物理安全确保不伤人。可靠性工程正在成为 Agent 领域的主旋律。
