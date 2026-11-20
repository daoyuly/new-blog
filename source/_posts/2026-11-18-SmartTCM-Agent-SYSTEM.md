---
title: SmartTCM-Agent-SYSTEM 项目深度分析报告
tags:
  - open-source
  - ai-repo
  - daily-research
  - deep-analysis
categories:
  - 开源项目研究
abbrlink: 65007
date: 2026-11-18 11:00:00
---

# SmartTCM-Agent-SYSTEM 项目深度分析报告

> 本报告由 OpenClaw 自动生成（AI 深度分析版）
>
> 研究日期: 2026-11-18
>
> 项目路径: /Users/daoyu/Documents/ai-repo/SmartTCM-Agent-SYSTEM

---

## 📊 项目概览

- **项目名称**: SmartTCM-Agent-SYSTEM
- **文件数量**: 932 个文件
- **主要插件**: 0 个

---

# SmartTCM-Agent-SYSTEM 深度分析报告

## 1. 项目概述

**SmartTCM-Agent-SYSTEM** 是一个基于大语言模型的多智能体中医问诊系统，采用前后端分离架构（FastAPI + Vue 3），核心编排引擎为 LangGraph，支持 DeepSeek（中医微调版）、TCM-LLM 等中医领域大模型。

**核心价值**：针对中医问诊场景的三大痛点——意图识别准确率低（<60%）、结构化/非结构化数据割裂、辨证推理缺乏严谨性（如“寒证荐寒凉药”的逻辑错误）——提供“动态识别 - 知识融合 - 工具校验 - 实时响应”四层解决方案。

**主要功能**：
- 6 类中医场景的意图识别与自适应响应（闲聊、辨证问诊、古籍检索、医案参考、药材咨询、图文/舌苔解析）
- 混合知识引擎：Neo4j 图数据库 + GraphRAG + 传统 RAG
- 100+ 中医专属 Cypher 查询模板
- 多模态舌苔/面色解析（TCM-CV）
- 方剂推荐与配伍校验（符合十八反十九畏等规范）
- 实时医疗服务接口集成

## 2. 技术栈分析

### 核心技术
| 层次 | 技术 |
|------|------|
| 前端 | Vue 3（932 个文件说明有较完整的前端工程） |
| 后端 | FastAPI（Python 异步 Web 框架） |
| 智能体编排 | LangGraph（状态机式多智能体编排） |
| 大模型 | DeepSeek（中医微调版）、TCM-LLM、多模态 TCM-CV |
| 知识存储 | Neo4j（图数据库）+ 向量库（GraphRAG 检索） |
| 检索增强 | GraphRAG + Cypher 模板查询 + 缓存机制 |

### 架构特点
1. **四层架构**：意图动态识别层 → 知识融合层 → 工具校验层 → 实时响应层，职责清晰、分层解耦
2. **多智能体网络**：LangGraph 基于图状态机编排智能体路由，各场景智能体可独立扩展
3. **混合数据引擎**：结构化（病例、药材、订单，走 Cypher）与非结构化（古籍、医案，走 RAG/GraphRAG）统一接入
4. **模型可插拔**：底层 LLM 抽象化，支持替换中医垂直模型

### 依赖关系
典型 RAG 链路：用户输入 → 意图识别（LLM/分类器）→ 路由到场景 Agent → 并行调用 Neo4j Cypher 模板 + GraphRAG 检索 + 多模态解析 → 工具校验层（配伍合法性、辨证逻辑）→ LLM 综合生成 → 前端流式响应。

## 3. 核心功能/组件分析

### 3.1 意图识别与路由网络（LangGraph）
- 覆盖 6 大场景，宣称识别准确率 90%+
- 各场景有独立适配策略：如辨证问诊采用“寒热→汗出→二便→舌苔→脉象”的多轮追问状态机；闲聊场景叠加情感分析调整语气
- LangGraph 的 StateGraph 天然适合此类“多轮追问 + 条件分支”流程

### 3.2 混合知识引擎
- **100+ Cypher 模板**：预定义覆盖 90% 高频查询，如 `(Symptom)-[:INDICATES]->(Syndrome)` 的症状→证型图谱查询，既保证查询效率又约束查询逻辑符合中医理论
- **GraphRAG**：关联“症状-辨证-治法”三元关系，用于医案语义匹配，优于纯向量检索（保留关系结构）
- **缓存优先机制**：高频古籍片段（桂枝汤、麻黄汤条文等）缓存，响应提速 50%

### 3.3 工具校验模块
- 药材配伍校验：检查十八反十九畏等配伍禁忌
- 方剂推荐校验：确保证型与药性逻辑一致（防止寒证荐寒凉药）
- Cypher 查询校验：防止生成的查询语义漂移

### 3.4 多模态解析
- 舌苔/面色图片分析，接入 TCM-CV 类模型，输出颜色、厚薄等特征，作为辨证的补充证据输入主推理链

### 组件关系
意图路由是总入口 → 分发到各场景 Agent → 各 Agent 按需调用知识引擎（Cypher/RAG/多模态）→ 输出统一经过工具校验层把关 → 流式返回。校验层是横向切面，保证全场景合规性。

## 4. 技术实现亮点

1. **领域化的意图识别策略**：不做通用 NLU，而是为每类中医场景设计专属策略（多轮追问、缓存优先、知识关联、多模态），这是垂直 Agent 的正确做法
2. **Cypher 模板库而非 Text2Cypher 自由生成**：用预定义模板规避 LLM 生成图查询的幻觉问题，同时模板本身编码了中医领域知识（INDICATES、配伍禁忌关系）
3. **GraphRAG 与传统 RAG 混合**：医案检索用图结构（症状-证型-治法链路）保证推理路径可解释，古籍检索用缓存加速——按数据特性选择检索策略
4. **工具校验层作为安全闸门**：将领域规则（配伍禁忌）硬编码在工具层而非依赖 LLM 自觉，是医疗场景的关键工程实践
5. **“识别准确率提升至 90%+” 的量化目标导向**：以可测量指标驱动 Agent 设计

## 5. 产品意义和应用场景

**解决的问题**：
- 中医爱好者/患者获取专业中医咨询的门槛高
- 现有通用 LLM 缺乏中医理论约束，回答易出现辨证错误
- 中医知识分散在古籍、医案、药材数据库中，缺乏整合入口

**目标用户**：
- C 端：注重养生的普通用户、慢病调理人群
- B 端：中医诊所（辅助问诊）、在线健康平台、中医教育机构

**应用场景**：
- 辨证问诊与方剂推荐辅助
- 中医古籍与医案检索研究
- 药材功效/禁忌/配伍咨询
- 舌苔自查辅助分析
- 季节性养生指导（如“春季养肝”）

## 6. 借鉴点

### 技术层面
1. **场景化 Agent 策略设计**：每个意图类别配独立响应策略（追问逻辑、缓存策略、检索方式），可复用于任何垂直领域 Agent
2. **模板化图查询 + 领域图谱**：用“预定义 Cypher 模板 + 知识图谱”替代 LLM 自由生成查询，兼顾准确性、性能与安全性
3. **混合检索架构**：按数据结构特性分流——结构化走图查询、非结构化走 RAG、关联性强的走 GraphRAG
4. **领域规则硬校验层**：将安全约束从 Prompt 下沉到工具层

### 产品层面
1. **痛点驱动叙事**：从“意图识别<60%、数据割裂、推理不严谨”三大具体痛点出发定义产品，而非泛泛做“AI+中医”
2. **量化指标承诺**（识别准确率 90%+、响应提速 50%）让产品价值可验证
3. **全场景覆盖但单点深耕**：6 类场景覆盖中医问诊全流程，每个场景有明确差异化体验
4. **多模态贴近真实问诊流程**：舌诊是中医“望闻问切”的核心环节，引入图片解析补齐了传统文本系统的短板

### 工程实践
1. **前后端分离 + 流式架构**（FastAPI + Vue 3），便于独立迭代与多端复用
2. **模型可插拔抽象**：底层 LLM 可替换，避免锁定单一供应商
3. **缓存优先策略**：高频知识片段缓存，控制 LLM/检索成本
4. **模板库沉淀团队知识**：100+ Cypher 模板是可复用资产，避免重复开发

## 7. 待深入研究

1. **意图识别的实际实现**：是纯 LLM 分类、微调小模型还是规则+模型混合？“90%+”的评估数据集与测试方法是什么？是否存在评测报告？
2. **LangGraph 的状态设计**：多轮追问（辨证问诊）的 StateGraph 如何定义状态字段、何时结束追问、上下文如何压缩？
3. **知识图谱构建流程**：古籍和医案是如何抽取为 Neo4j 图谱的（实体/关系 Schema、抽取 Pipeline、数据规模）？
4. **工具校验的具体规则来源与实现**：十八反十九畏等规则是硬编码还是图谱查询？校验失败后的回退策略是什么？
5. **多模态集成方式**：TCM-CV 模型如何部署，舌苔特征如何结构化后注入 LLM 推理链？
6. **合规与安全边界**：医疗场景下如何声明“辅助诊断非处方”的免责边界？是否有对话安全兜底机制？
7. **性能与成本**：GraphRAG 检索链路的端到端延迟、token 成本、缓存命中率等实际生产数据。
8. **932 个文件的工程结构**：前后端代码比例、模块划分、测试覆盖率，值得从工程组织角度做代码级走读。---

## 📁 文件结构示例

```
/Users/daoyu/Documents/ai-repo/SmartTCM-Agent-SYSTEM/.env_example
/Users/daoyu/Documents/ai-repo/SmartTCM-Agent-SYSTEM/.DS_Store
/Users/daoyu/Documents/ai-repo/SmartTCM-Agent-SYSTEM/app/__init__.py
/Users/daoyu/Documents/ai-repo/SmartTCM-Agent-SYSTEM/app/src/core/__init__.py
/Users/daoyu/Documents/ai-repo/SmartTCM-Agent-SYSTEM/app/src/response/response_codes.py
/Users/daoyu/Documents/ai-repo/SmartTCM-Agent-SYSTEM/app/src/response/response_models.py
/Users/daoyu/Documents/ai-repo/SmartTCM-Agent-SYSTEM/app/src/response/response_factory.py
/Users/daoyu/Documents/ai-repo/SmartTCM-Agent-SYSTEM/app/src/response/__init__.py
/Users/daoyu/Documents/ai-repo/SmartTCM-Agent-SYSTEM/app/src/response/utils.py
/Users/daoyu/Documents/ai-repo/SmartTCM-Agent-SYSTEM/app/src/response/response_middleware.py
/Users/daoyu/Documents/ai-repo/SmartTCM-Agent-SYSTEM/app/src/response/exception/__init__.py
/Users/daoyu/Documents/ai-repo/SmartTCM-Agent-SYSTEM/app/src/response/exception/global_exception.py
/Users/daoyu/Documents/ai-repo/SmartTCM-Agent-SYSTEM/app/src/response/exception/exceptions.py
/Users/daoyu/Documents/ai-repo/SmartTCM-Agent-SYSTEM/app/src/entity/app_entity.py
/Users/daoyu/Documents/ai-repo/SmartTCM-Agent-SYSTEM/app/src/dependencies/__init__.py
/Users/daoyu/Documents/ai-repo/SmartTCM-Agent-SYSTEM/app/src/dependencies/dependency.py
/Users/daoyu/Documents/ai-repo/SmartTCM-Agent-SYSTEM/app/src/__init__.py
/Users/daoyu/Documents/ai-repo/SmartTCM-Agent-SYSTEM/app/src/utils/logging_config.py
/Users/daoyu/Documents/ai-repo/SmartTCM-Agent-SYSTEM/app/src/utils/structlog_config.py
/Users/daoyu/Documents/ai-repo/SmartTCM-Agent-SYSTEM/app/src/utils/structlog_utils.py
/Users/daoyu/Documents/ai-repo/SmartTCM-Agent-SYSTEM/app/src/utils/__init__.py
/Users/daoyu/Documents/ai-repo/SmartTCM-Agent-SYSTEM/app/src/utils/logger.py
/Users/daoyu/Documents/ai-repo/SmartTCM-Agent-SYSTEM/app/src/utils/structlog_middleware.py
/Users/daoyu/Documents/ai-repo/SmartTCM-Agent-SYSTEM/app/src/utils/log_middleware.py
/Users/daoyu/Documents/ai-repo/SmartTCM-Agent-SYSTEM/app/src/utils/paginator/models.py
/Users/daoyu/Documents/ai-repo/SmartTCM-Agent-SYSTEM/app/src/utils/paginator/__init__.py
/Users/daoyu/Documents/ai-repo/SmartTCM-Agent-SYSTEM/app/src/controller/user_controller.py
/Users/daoyu/Documents/ai-repo/SmartTCM-Agent-SYSTEM/app/src/controller/__init__.py
/Users/daoyu/Documents/ai-repo/SmartTCM-Agent-SYSTEM/app/src/schema/conversation_schema.py
/Users/daoyu/Documents/ai-repo/SmartTCM-Agent-SYSTEM/app/src/schema/user_schema.py
...
(共 932 个文件)
```

---

*本报告由 OpenClaw 的 AI 深度分析系统生成*
*如有疑问或需要进一步分析，请联系研究者*
