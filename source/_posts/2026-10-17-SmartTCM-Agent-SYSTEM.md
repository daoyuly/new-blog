---
title: "SmartTCM-Agent-SYSTEM 项目深度分析报告"
date: 2026-10-17 11:00:00
tags:
  - open-source
  - ai-repo
  - daily-research
  - deep-analysis
categories:
  - 开源项目研究
---

# SmartTCM-Agent-SYSTEM 项目深度分析报告

> 本报告由 OpenClaw 自动生成（AI 深度分析版）
>
> 研究日期: 2026-10-17
>
> 项目路径: /Users/daoyu/Documents/ai-repo/SmartTCM-Agent-SYSTEM

---

## 📊 项目概览

- **项目名称**: SmartTCM-Agent-SYSTEM
- **文件数量**: 932 个文件
- **主要插件**: 0 个

---

# SmartTCM-Agent-SYSTEM 开源项目深度研究报告

## 1. 项目概述

**SmartTCM-Agent-SYSTEM** 是一个基于 FastAPI、Vue 3 和 LangGraph 构建的前后端分离多智能体中医问诊系统。该项目的核心价值在于将大语言模型（如 DeepSeek 中医微调版、TCM-LLM）与中医专业理论深度融合，通过多智能体协同工作，解决传统中医问诊数字化系统存在的**意图识别准确率低**、**结构化与非结构化数据割裂**、**辨证推理缺乏严谨性**三大痛点。

**主要功能包括：**
- 覆盖中医闲聊、辨证问诊、古籍检索、医案参考、药材咨询、图文舌苔解析的 6 类核心场景意图识别。
- 基于多轮追问的智能辨证问诊，补全“寒热-汗出-二便-舌苔-脉象”关键信息。
- 融合结构化数据与古籍非结构化数据的混合知识引擎。
- 结合中医理论（如十八反十九畏）的工具校验模块，确保荐方逻辑的安全性与合规性。

## 2. 技术栈分析

### 使用的技术和框架
- **前端**：Vue 3（提供现代响应式用户界面）、Vite、TypeScript（推测）。
- **后端**：FastAPI（Python 高性能异步 Web 框架）。
- **大模型与 Agent 框架**：LangGraph（构建动态智能体网络与状态机流转）、DeepSeek（中医微调版）/ TCMLLM。
- **数据存储与检索**：
  - Neo4j（图数据库，存储药材关系、症状-辨证关联图）。
  - GraphRAG（结合图数据库的检索增强生成技术）。
  - 缓存机制（用于高频古籍片段检索提速）。
- **多模态**：TCM-CV 等中医多模态视觉模型（用于舌苔、面色图片解析）。

### 架构特点
- **四层架构设计**：系统采用“动态识别 -> 知识融合 -> 工具校验 -> 实时响应”的分层架构，职责清晰。
- **图驱动的状态机流转**：利用 LangGraph 的特性，将问诊过程抽象为图节点与边，实现复杂多轮对话的精准路由。
- **前后端分离与微服务化接口**：FastAPI 提供高并发异步接口，Vue 3 负责前端交互，后端底层服务模块化封装。

### 依赖关系
项目依赖关系呈现出“大模型推理依赖知识图谱与多模态输入”的特征。LangGraph 作为中枢调度，依赖 Neo4j 进行图查询验证，依赖缓存层加速检索，依赖外部微调 LLM 和 CV 模型进行语义理解与图像解析。

## 3. 核心功能/组件分析

### 主要功能模块
1. **意图识别与路由网络**：基于 LangGraph 构建，负责将用户输入分发到闲聊、问诊、检索等 6 个子智能体节点。
2. **混合知识引擎**：包含 100+ 中医专属 Cypher 查询模板，打通了患者病例（结构化）与《伤寒论》等古籍（非结构化）的壁垒。
3. **多模态辨证辅助模块**：处理用户上传的舌苔/面色图片，提取特征向量，辅助大模型进行寒热虚实判断。
4. **中医合规校验模块**：在输出最终药方前，通过预设工具检查药材配伍是否违反“十八反十九畏”等中医铁律。

### 关键组件说明及关系
- **LangGraph Router（路由器）**：系统的入口组件，决定对话流向。
- **GraphRAG Engine（检索引擎）**：当路由器进入“古籍/医案”节点时被调用，从 Neo4j 和向量库中提取知识上下文。
- **Validator Tool（校验工具）**：当路由器进入“辨证问诊”并生成药方后，拦截输出并进行图数据库校验。
这些组件形成了一个**“接收输入 -> 意图路由 -> 知识检索补全 -> 逻辑校验拦截 -> 输出反馈”**的闭环链路。

## 4. 技术实现亮点

- **创新点：基于 LangGraph 的多轮动态追问策略**。针对中医问诊“十问歌”的复杂逻辑，系统不是简单的单轮问答，而是通过 LangGraph 维护对话状态，按“寒热→汗出→二便→舌苔→脉象”顺序动态生成追问，极大提升了辨证信息收集的完整性。
- **设计模式：混合 RAG (Hybrid RAG) 机制**。结合了图数据库（Neo4j）的关系查询能力和向量数据库的语义匹配能力。通过 100+ 预定义 Cypher 模板，解决了纯向量检索在中医专业术语匹配上容易出现的“幻觉”问题。
- **最佳实践：领域规则前置拦截**。在 LLM 生成回复后、输出给用户前，增加基于中医理论的规则校验工具（如检查配伍禁忌），有效避免了大模型在医疗领域直接生成危险建议的风险。

## 5. 产品意义和应用场景

### 解决的问题
- 解决了通用大模型在中医垂直领域“胡说八道”（如寒证荐寒凉药）的致命问题。
- 解决了传统医疗信息系统数据孤岛问题，让古籍知识、临床医案和现代病例能够在同一个问诊上下文中被联合检索。
- 解决了用户口语化描述与中医专业术语之间的语义鸿沟。

### 目标用户与应用场景
- **目标用户**：中医诊所/医院的数字化问诊前端、大健康养生平台的智能客服、中医学生辅助学习工具。
- **应用场景**：
  - **初诊筛查**：患者就诊前通过多轮对话完成基础辨证信息收集，生成结构化病历供医生参考。
  - **养生咨询**：用户询问“春季如何养肝”，系统结合古籍与体质给出建议。
  - **医教研辅**：中医师或学生通过自然语言查询《伤寒论》条文或相似历史医案。

## 6. 借鉴点

### 技术层面
1. **LangGraph 在复杂状态机中的应用**：将复杂的业务 SOP（如中医问诊流程）转化为 Graph 结构，比传统的线性 Chain 更加灵活，值得所有需要多轮信息收集的 Agent 系统借鉴。
2. **GraphRAG + 模板化 Cypher 的结合**：在关系复杂的垂直领域（如医疗、法律），纯向量检索不够用，通过预定义的高频图查询模板结合 LLM，既保证了准确性又降低了图查询的门槛。
3. **多模态在垂直领域的定向集成**：不是通用看图，而是专门接入中医舌苔/面色 CV 模型，将视觉特征直接映射为辨证向量输入，是 Multimodal Agent 在垂直领域的优秀实践。

### 产品层面
1. **意图细分与差异化响应策略**：将用户意图细分为 6 类，并对每类设定专门策略（如闲聊用情感分析调语气，问诊用多轮追问），极大提升了用户体验的专业感和温度。
2. **缓存优先的检索提速机制**：针对高频古籍片段（如桂枝汤条文）进行缓存，使检索响应提速 50%，解决了 RAG 系统普遍存在的延迟痛点。
3. **安全合规的产品底线设计**：医疗产品容错率极低，系统内置“十八反十九畏”等配伍校验，体现了 AI 医疗产品必须“规则先行”的产品哲学。

### 工程实践
1. **前后端分离与高性能接口**：采用 FastAPI 异步特性处理大模型的并发请求，结合 Vue 3 提供流畅的流式输出体验，是现代 LLM 应用的标准工程范式。
2. **模板化开发提升效率**：封装 100+ Cypher 模板覆盖 90% 高频场景，避免了重复造轮子，提高了后端开发效率与查询稳定性。
3. **微调大模型与 Agent 架构解耦**：底层可支持 DeepSeek 中医微调版或 TCMLLM，大模型作为可插拔组件，通过 Agent 层做逻辑控制，实现了模型升级与业务逻辑的解耦。

## 7. 待深入研究

1. **LangGraph 状态流转的具体实现细节**：需深入源码研究其如何维护多轮问诊的 Memory State，以及在用户答非所问时如何进行图的回环或重路由。
2. **100+ Cypher 模板的抽象与生成机制**：研究这些模板是纯人工编写，还是利用 LLM 自动将自然语言转化为 Cypher，以及其复用率和维护成本。
3. **中医多模态模型（TCM-CV）的集成方案**：研究其如何处理用户上传的图片，是否存在去噪、光线校正等预处理逻辑，以及视觉特征如何与文本辨证向量进行对齐融合。
4. **工具校验模块的拦截与重试机制**：当 LLM 生成的药方触发了“十八反十九畏”红线时，系统是直接报错、还是将错误信息喂给 LLM 让其重新生成？
5. **混合知识引擎的数据治理与同步**：研究结构化病例数据与非结构化古籍数据是如何在底层打通的，Neo4j 图谱的构建过程、实体抽取逻辑以及增量更新策略是什么。---

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
