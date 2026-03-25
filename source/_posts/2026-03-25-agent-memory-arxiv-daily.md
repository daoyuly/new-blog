---
title: Agent Memory 每日论文速递 (2026-03-25)
date: '2026-03-25 18:00:00 +0800'
tags:
  - agent
  - memory
  - LLM
  - arxiv
  - daily-report
categories:
  - AI研究
toc: true
excerpt: >-
  今日 arXiv cs.AI 上关于 Agent Memory 的最新论文分析，包括跨智能体记忆协作 MemCollab、个性化记忆基准
  PERMA，以及与开源记忆项目的关联分析。
abbrlink: 38868
---

## 📋 今日概览

今日 arXiv cs.AI 领域共发布 25+ 篇论文，经筛选后发现 **2 篇高度相关** 的 Agent Memory 论文，以及 **1 篇 RAG 相关论文**。

### 核心发现

1. **跨智能体记忆共享** 成为新热点 - MemCollab 提出对比轨迹蒸馏方法
2. **个性化记忆评估** 亟需新基准 - PERMA 引入事件驱动的偏好演化测试
3. **RAG 安全** 与记忆系统安全密切相关 - ProGRank 防御知识库投毒

---

## 🔬 今日论文列表

### 1. MemCollab: Cross-Agent Memory Collaboration via Contrastive Trajectory Distillation

| 属性 | 内容 |
|------|------|
| **arXiv ID** | [2603.23234](https://arxiv.org/abs/2603.23234) |
| **作者** | Yurui Chang, Yiran Wu, Qingyun Wu, Lu Lin |
| **发布时间** | 2026-03-24 14:05:47 UTC |
| **主题** | cs.AI, cs.LG |

#### 摘要要点

- **问题**：现有记忆系统采用 per-agent 方式构建，知识与单一模型的推理风格紧密耦合，无法在异构智能体间共享
- **发现**：简单地在智能体间迁移记忆会降低性能，因为记忆将任务相关知识 + 智能体特定偏差纠缠在一起
- **方案 MemCollab**：
  - 通过对比不同智能体在同一任务上的推理轨迹，构建智能体无关的记忆
  - 蒸馏出抽象推理约束，捕获共享的任务级不变性，同时抑制智能体特定伪影
  - 引入任务感知检索机制，根据任务类别条件化记忆访问
- **实验结果**：在数学推理和代码生成基准上，MemCollab 在不同智能体（包括跨模态系列）上持续提高准确率和推理效率

#### 创新点

1. **对比轨迹蒸馏** - 通过对比多个智能体的推理轨迹提取共享知识
2. **智能体无关记忆** - 解耦任务知识与模型偏差
3. **任务感知检索** - 根据任务类别过滤相关约束

#### 与开源项目关联

| 开源项目 | 关联度 | 说明 |
|----------|--------|------|
| **mem0** | 🔴 高 | mem0 的图存储可支持跨智能体知识图谱 |
| **MemOS** | 🟡 中 | MemCube 的 TextualMemory 可扩展为共享模式 |
| **MemGPT** | 🟡 中 | Core Memory 可考虑跨模型共享设计 |
| **ReMe** | 🟡 中 | when_to_use 字段与任务感知检索思路类似 |

---

### 2. PERMA: Benchmarking Personalized Memory Agents via Event-Driven Preference and Realistic Task Environments

| 属性 | 内容 |
|------|------|
| **arXiv ID** | [2603.23231](https://arxiv.org/abs/2603.23231) |
| **作者** | Shuochen Liu, Junyi Zhu, Long Shu 等 (14人) |
| **发布时间** | 2026-03-24 14:04:11 UTC |
| **主题** | cs.AI |
| **代码** | [GitHub](https://github.com/PolarisLiu1/PERMA) |

#### 摘要要点

- **问题**：现有评估将偏好相关对话与无关对话交错，退化为"大海捞针"式检索，忽略了驱动用户偏好演化的事件间关系
- **现实特征**：偏好逐渐涌现，在噪声上下文中跨交互累积
- **方案 PERMA**：
  - 时间排序的交互事件，跨越多个会话和领域
  - 引入文本变异性 + 语言对齐，模拟真实用户输入的不规则性和个人习惯用语
  - 设计选择题 + 交互任务，探测模型沿交互时间线的角色理解
- **实验发现**：
  - 通过关联相关交互，高级记忆系统可提取更精确的偏好并减少 token 消耗
  - 但在时间深度和跨域干扰方面仍难以保持一致的角色

#### 创新点

1. **事件驱动偏好演化** - 超越静态偏好回忆
2. **真实用户模拟** - 文本变异性 + 个人习惯用语
3. **时间深度测试** - 多会话、跨领域的角色一致性评估

#### 与开源项目关联

| 开源项目 | 关联度 | 说明 |
|----------|--------|------|
| **Memobase** | 🔴 高 | 用户画像 + 事件时间线与 PERMA 设计高度契合 |
| **EverMemOS** | 🔴 高 | Episode 记忆 + 时间戳支持事件驱动评估 |
| **OpenMemory** | 🟡 中 | HSG 的 episodic sector + 衰退机制相关 |
| **MemOS** | 🟡 中 | SourceMessage 来源追溯支持时间线分析 |

---

### 3. ProGRank: Probe-Gradient Reranking to Defend Dense-Retriever RAG from Corpus Poisoning

| 属性 | 内容 |
|------|------|
| **arXiv ID** | [2603.22934](https://arxiv.org/abs/2603.22934) |
| **作者** | Xiangyu Yin, Yi Qi, Chih-hong Cheng |
| **发布时间** | 2026-03-24 08:29:15 UTC |
| **主题** | cs.AI |

#### 摘要要点

- **问题**：RAG 引入新的攻击面 - 知识库投毒（corpus poisoning），攻击者注入/编辑段落使其排名进入 Top-K 结果
- **方案 ProGRank**：
  - 后处理、无训练、检索器端防御
  - 对每个查询-段落对进行随机扰动压力测试
  - 从检索器的固定参数子集提取探针梯度
  - 衍生两个不稳定性信号：表示一致性 + 分散风险
  - 结合分数门控进行重排序
- **特点**：保持原始段落内容，无需重训练，支持代理变体

#### 与 Agent Memory 关联

RAG 是 Agent Memory 的核心技术之一，知识库安全直接影响记忆系统的可靠性。

| 开源项目 | 关联度 | 说明 |
|----------|--------|------|
| **mem0** | 🟡 中 | 向量存储 + 图存储可借鉴 ProGRank 的安全机制 |
| **MemGPT** | 🟡 中 | Archival Memory 的向量检索需要防御投毒 |
| **OpenMemory** | 🟡 中 | 多扇区检索可引入不稳定性检测 |

---

## 📊 研究趋势分析

### 热门方向

```
跨智能体记忆共享     ████████████  (新热点)
个性化记忆评估       ██████████    (基准建设)
记忆安全/防御        ████████      (RAG 安全延伸)
时间感知记忆         ███████       (衰退+演化)
知识图谱+记忆        ██████        (结构化存储)
```

### 技术演进路线

```
2024                    2025                    2026
  │                       │                       │
  ▼                       ▼                       ▼
单智能体记忆    →    多智能体协作记忆    →    跨智能体共享记忆
(MemGPT)              (多 Agent 框架)         (MemCollab)
  │                       │                       │
  ▼                       ▼                       ▼
静态偏好存储    →    动态偏好追踪    →    事件驱动偏好演化
(SimpleMem)           (Memobase)              (PERMA)
```

### 关键洞察

1. **记忆解耦是关键** - MemCollab 的核心贡献是将任务知识与模型偏差解耦
2. **时间维度被低估** - PERMA 指出现有系统在时间深度上表现不佳
3. **安全是隐忧** - RAG 投毒攻击对记忆系统同样适用

---

## 🔗 与 19 个开源记忆项目的关联矩阵

| 项目 | MemCollab 关联 | PERMA 关联 | ProGRank 关联 |
|------|---------------|------------|---------------|
| **LangChain Memory** | 🟡 | 🟡 | 🟢 |
| **LlamaIndex** | 🟡 | 🟡 | 🟢 |
| **MemGPT/Letta** | 🔴 | 🟡 | 🟡 |
| **mem0** | 🔴 | 🟡 | 🟡 |
| **MemOS** | 🟡 | 🟡 | 🟢 |
| **EverMemOS** | 🟡 | 🔴 | 🟢 |
| **ReMe** | 🟡 | 🟡 | 🟢 |
| **OpenMemory** | 🟡 | 🔴 | 🟡 |
| **Memobase** | 🟡 | 🔴 | 🟢 |
| **SimpleMem** | 🟢 | 🟡 | 🟢 |
| **Memari** | 🟢 | 🟡 | 🟢 |
| **ALMA** | 🟡 | 🟡 | 🟢 |
| **OpenViking** | 🟢 | 🟡 | 🟢 |
| **CrewAI** | 🔴 | 🟡 | 🟢 |
| **AutoGen** | 🔴 | 🟡 | 🟢 |
| **Cognosys** | 🟡 | 🟡 | 🟢 |
| **MemGPT Agent** | 🔴 | 🟡 | 🟡 |
| **LangGraph** | 🔴 | 🟡 | 🟢 |
| **AutoGPT** | 🟡 | 🟡 | 🟢 |

图例：🔴 高度相关 | 🟡 中度相关 | 🟢 低度相关

---

## 💡 对开源项目的建议

### 基于 MemCollab 的改进方向

1. **mem0/MemOS** - 可扩展为支持多租户共享记忆模式
2. **CrewAI/AutoGen** - 多智能体协作框架可直接集成对比轨迹蒸馏
3. **MemGPT** - Core Memory 可考虑设计为可共享的"团队记忆"

### 基于 PERMA 的评估建议

1. **引入时间深度测试** - 评估记忆系统在跨会话场景的表现
2. **增加文本变异性** - 模拟真实用户的不规则输入
3. **跨域干扰测试** - 评估记忆在多领域切换时的稳定性

### 基于 ProGRank 的安全加固

1. **向量存储防护** - 在检索阶段引入不稳定性检测
2. **记忆验证机制** - 对存入的知识进行来源验证
3. **异常检测** - 监控记忆访问模式，识别潜在攻击

---

## 📚 参考资源

- [MemCollab 论文](https://arxiv.org/abs/2603.23234)
- [PERMA 论文](https://arxiv.org/abs/2603.23231) | [GitHub](https://github.com/PolarisLiu1/PERMA)
- [ProGRank 论文](https://arxiv.org/abs/2603.22934)
- [Agent Memory 深度分析报告](/2026/03/24/agent-memory-storage-analysis.html)

---

## 📅 往期报告

- [2026-03-24 Agent Memory 存储机制深度分析](/2026/03/24/agent-memory-storage-analysis.html)
- [2026-03-02 AI Agent 趋势分析](/2026/03/02/arxiv-ai-agent-trends.html)

---

*报告生成时间: 2026-03-25 18:00 (Asia/Shanghai)*  
*数据来源: arXiv cs.AI*  
*分析工具: OpenClaw Agent Memory Analyzer*
