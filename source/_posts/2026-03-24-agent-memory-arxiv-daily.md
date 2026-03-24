---
title: "Agent Memory 每日论文速递 (2026-03-24)"
date: 2026-03-24 18:00:00 +0800
tags: [agent-memory, arxiv, daily-report, RAG, knowledge-management]
categories: [AI Research, Agent Memory]
---

## 📋 今日概览

今日 arXiv cs.AI 共发布 **24 篇**论文，筛选出 **11 篇**与 Agent Memory、RAG、知识管理高度相关的论文。

---

## 📚 相关论文列表

### 1. 🌟 GSEM: Graph-based Self-Evolving Memory for Experience Augmented Clinical Reasoning

**arXiv ID**: 2603.22096  
**链接**: https://arxiv.org/abs/2603.22096  
**代码**: https://github.com/xhan1022/gsem

**摘要要点**:
- 提出双层记忆图结构，捕获决策内部结构和跨经验关系依赖
- 支持适用性感知检索和在线反馈驱动的节点/边权重校准
- 在 MedR-Bench 和 MedAgentsBench 上达到 70.90% / 69.24% 准确率

**与开源项目关联**: 
- 架构理念与 **MemGPT** 三层记忆类似，但增加了图结构关系
- 在线校准机制类似于 **EverMemOS** 的 Foresight 前瞻机制
- 经验复用与 **ReMe** 的 Task Memory 高度相关

---

### 2. 🔍 Oph-Guid-RAG: Guideline-grounded retrieval-augmented generation for ophthalmic clinical decision support

**arXiv ID**: 2603.21925  
**链接**: https://arxiv.org/abs/2603.21925

**摘要要点**:
- 多模态视觉 RAG 系统，直接检索页面图像保留表格/流程图
- 可控检索框架：路由 + 过滤减少噪声
- 在困难子集上相比 GPT-5.2 提升 30.0% 整体分数

**与开源项目关联**:
- 多模态检索与 **mem0** 的向量+图双引擎理念相似
- 路由机制可与 **LangMem** 的 LangGraph 流程集成
- 可追溯输出与 **OpenViking** 的上下文管理一致

---

### 3. 🧠 Tacit Knowledge Management with Generative AI: Proposal of the GenAI SECI Model

**arXiv ID**: 2603.21866  
**链接**: https://arxiv.org/abs/2603.21866

**摘要要点**:
- 提出 GenAI SECI 模型，整合显性知识和隐性知识
- 引入 "Digital Fragmented Knowledge" 新概念
- 提供具体的系统架构设计

**与开源项目关联**:
- 知识结构化与 **Memobase** 的用户画像驱动理念一致
- 隐性知识提取与 **EverMemOS** 的 Profile Extractor 功能相似
- 知识演化与 **MemOS** 的 MemCube 调度机制相关

---

### 4. 🏥 MARCUS: An agentic, multimodal vision-language model for cardiac diagnosis and management

**arXiv ID**: 2603.22179  
**链接**: https://arxiv.org/abs/2603.22179

**摘要要点**:
- 分层 agentic 架构：模态专家 + 多模态编排器
- 在 13.5M 图像 + 1.6M 问答数据上训练
- 多模态准确率 70%，是前沿模型的 3 倍

**与开源项目关联**:
- 分层架构与 **MemGPT** Core/Recall/Archival 三层设计理念一致
- 专家模型协调与 **MIND** 多智能体框架相关
- 抗 mirage reasoning 能力与 **INTRYGUE** 幻觉检测相关

---

### 5. 🔄 A Context Engineering Framework for Improving Enterprise AI Agents based on Digital-Twin MDP

**arXiv ID**: 2603.22083  
**链接**: https://arxiv.org/abs/2603.22083

**摘要要点**:
- 通过离线 RL 改进 LLM 企业 Agent
- DT-MDP 抽象 + 对比逆向 RL + RL 引导上下文工程
- 在 IT 自动化任务上显著改进

**与开源项目关联**:
- 上下文工程与 **OpenViking** 的分层上下文加载理念一致
- 离线轨迹学习与 **ALMA** 的元学习机制相关
- MDP 建模与 **ReMe** 的工作记忆管理类似

---

### 6. 👤 Agentic Personas for Adaptive Scientific Explanations with Knowledge Graphs

**arXiv ID**: 2603.21846  
**链接**: https://arxiv.org/abs/2603.21846

**摘要要点**:
- RL 方法生成科学解释，整合 agentic personas
- personas 捕获专家推理策略和认识偏好
- 反馈需求减少两个数量级

**与开源项目关联**:
- 知识图谱推理与 **mem0** 的 GraphStore 直接相关
- personas 与 **Memobase** 的用户画像驱动理念相似
- 自适应解释与 **OpenMemory** 的认知分区相关

---

### 7. 🚗 A Blueprint for Self-Evolving Coding Agents in Vehicle Aerodynamic Drag Prediction

**arXiv ID**: 2603.21698  
**链接**: https://arxiv.org/abs/2603.21698

**摘要要点**:
- 自进化编程 Agent 发现可执行代理管道
- Famou-Agent 风格评估器 + 岛屿进化
- 硬评估合约：防泄漏 + 确定性回放 + 多种子鲁棒性

**与开源项目关联**:
- 自进化与 **EverMemOS** 的 Foresight 前瞻机制理念一致
- 经验积累与 **ReMe** 的 Task Memory 高度相关
- 可审计工作流与 **OpenViking** 的检索轨迹类似

---

### 8. 🤝 MIND: Multi-agent inference for negotiation dialogue in travel planning

**arXiv ID**: 2603.21696  
**链接**: https://arxiv.org/abs/2603.21696

**摘要要点**:
- 基于 Theory of Mind 的多智能体谈判框架
- Strategic Appraisal 阶段推断对手意愿 (90.2% 准确率)
- 在 High-w Hit 提升 20.5%，Debate Hit-Rate 提升 30.7%

**与开源项目关联**:
- 多智能体协调与 **EnterpriseLab** 的企业 Agent 平台相关
- 意愿推断与 **Memobase** 的心理画像功能相似
- 共识构建与 **ReMe** 的 SOP Memory 流程相关

---

### 9. 📊 Reasoning Provenance for Autonomous AI Agents: Structured Behavioral Analytics

**arXiv ID**: 2603.21692  
**链接**: https://arxiv.org/abs/2603.21692

**摘要要点**:
- 提出 Agent Execution Record (AER) 原语
- 捕获意图、观察、推理为一级可查询字段
- 支持群体级行为分析：模式挖掘、置信度校准、跨 Agent 比较

**与开源项目关联**:
- 结构化记录与 **Memori** 的 SQL 原生存储理念一致
- 行为分析与 **OpenMemory** 的 Waypoint 图相关
- 证据链与 **mem0** 的知识图谱推理类似

---

### 10. 🏢 EnterpriseLab: A Full-Stack Platform for developing and deploying agents in Enterprises

**arXiv ID**: 2603.21630  
**链接**: https://arxiv.org/abs/2603.21630

**摘要要点**:
- 全栈平台：工具集成 + 轨迹合成 + 训练管道
- 通过 MCP 协议暴露企业应用
- 8B 模型匹配 GPT-4o 性能，推理成本降低 8-10x

**与开源项目关联**:
- MCP 协议与 **MCP Memory Service** 和 **SimpleMem** 直接相关
- 轨迹合成与 **ReMe** 的 Tool Memory 经验记录类似
- 企业部署与 **EverMemOS** 的企业级架构一致

---

### 11. 🎯 INTRYGUE: Induction-Aware Entropy Gating for Reliable RAG Uncertainty Estimation

**arXiv ID**: 2603.21607  
**链接**: https://arxiv.org/abs/2603.21607

**摘要要点**:
- 发现 RAG 中标准熵 UQ 方法的机制悖论
- 提出 INTRYGUE 基于 induction heads 激活模式门控
- 在 4 个 RAG 基准 + 6 个 LLM 上评估，16/16 设置中 13 个最佳

**与开源项目关联**:
- 幻觉检测与 **SimpleMem** 的语义无损压缩理念互补
- 不确定性量化与 **MemGPT** 的消息摘要机制相关
- RAG 优化与 **mem0** 的检索增强直接相关

---

## 📈 研究趋势分析

### 🔥 热门方向

| 方向 | 论文数 | 关键特点 |
|------|--------|----------|
| **医疗临床 Agent** | 4 | 多模态、证据溯源、可控推理 |
| **多智能体协调** | 3 | 谈判、角色分工、共识构建 |
| **RAG 增强** | 3 | 多模态检索、不确定性量化、路由优化 |
| **知识图谱集成** | 2 | 关系推理、结构化存储 |
| **企业级部署** | 2 | MCP 协议、成本优化、隐私保护 |

### 🎯 核心创新点

1. **图结构记忆** (GSEM)
   - 双层图捕获内部结构和跨经验关系
   - 在线反馈驱动权重校准

2. **多模态 RAG** (Oph-Guid-RAG)
   - 直接检索页面图像保留布局信息
   - 路由 + 过滤减少噪声

3. **Agentic Personas** (Agentic Personas)
   - 结构化专家推理策略
   - 反馈需求减少 100x

4. **Reasoning Provenance** (AER)
   - 一级可查询推理记录
   - 群体级行为分析

5. **自进化 Agent** (Self-Evolving Coding Agents)
   - 岛屿进化 + 评估器反馈
   - 硬评估合约保证质量

---

## 🔗 与 19 个开源记忆项目的关联矩阵

| 论文 | MemGPT | mem0 | MemOS | EverMemOS | ReMe | OpenMemory | Memobase | SimpleMem |
|------|--------|------|-------|-----------|------|------------|----------|-----------|
| GSEM | ⭐⭐⭐ | ⭐⭐ | ⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐ | ⭐ | ⭐ |
| Oph-Guid-RAG | ⭐ | ⭐⭐⭐ | ⭐ | ⭐ | ⭐⭐ | ⭐ | ⭐ | ⭐⭐ |
| GenAI SECI | ⭐ | ⭐ | ⭐⭐ | ⭐⭐ | ⭐ | ⭐ | ⭐⭐⭐ | ⭐ |
| MARCUS | ⭐⭐⭐ | ⭐ | ⭐ | ⭐ | ⭐ | ⭐ | ⭐ | ⭐ |
| DT-MDP-CE | ⭐ | ⭐ | ⭐ | ⭐ | ⭐⭐ | ⭐⭐ | ⭐ | ⭐ |
| Agentic Personas | ⭐ | ⭐⭐⭐ | ⭐ | ⭐ | ⭐ | ⭐⭐ | ⭐⭐⭐ | ⭐ |
| Self-Evolving | ⭐ | ⭐ | ⭐ | ⭐⭐⭐ | ⭐⭐ | ⭐ | ⭐ | ⭐ |
| MIND | ⭐ | ⭐ | ⭐ | ⭐ | ⭐⭐ | ⭐ | ⭐⭐ | ⭐ |
| AER | ⭐ | ⭐⭐ | ⭐ | ⭐ | ⭐ | ⭐⭐ | ⭐ | ⭐⭐ |
| EnterpriseLab | ⭐ | ⭐ | ⭐⭐ | ⭐⭐ | ⭐⭐ | ⭐ | ⭐ | ⭐⭐⭐ |
| INTRYGUE | ⭐⭐ | ⭐⭐ | ⭐ | ⭐ | ⭐ | ⭐ | ⭐ | ⭐⭐ |

⭐⭐⭐ = 高度相关 | ⭐⭐ = 中度相关 | ⭐ = 弱相关

---

## 💡 关键洞察

### 1. 图结构记忆成为新趋势

GSEM 的双层记忆图结构为 Agent Memory 提供了新的组织范式：
- 不仅存储独立记忆项，还捕获记忆间的关系
- 与 mem0 的 GraphStore 和 OpenMemory 的 Waypoint 图理念一致

### 2. 多模态 RAG 从文本扩展到图像

Oph-Guid-RAG 直接检索页面图像，保留表格和流程图：
- 超越纯文本 RAG
- 与 mem0 的向量+图双引擎形成互补

### 3. 知识管理从显性扩展到隐性

GenAI SECI 模型引入 "Digital Fragmented Knowledge"：
- 整合显性和隐性知识
- 与 Memobase 的心理画像和 EverMemOS 的 Foresight 机制呼应

### 4. Agent 推理可追溯性成为基础设施需求

AER 提出 reasoning provenance 作为一级原语：
- 与 Memori 的 SQL 原生存储理念一致
- 为群体级 Agent 行为分析提供基础

### 5. MCP 协议加速企业 Agent 部署

EnterpriseLab 展示了 MCP 协议在企业场景的价值：
- 与 MCP Memory Service 和 SimpleMem 的 MCP 支持形成生态

---

## 📅 明日关注

- 继续追踪图结构记忆的演化
- 关注医疗临床 Agent 的多模态融合进展
- 监控 RAG 不确定性量化的新方法

---

*报告生成时间: 2026-03-24 18:00 (Asia/Shanghai)*  
*数据来源: arXiv cs.AI*  
*关联分析: 基于 19 个开源 Agent Memory 项目*
