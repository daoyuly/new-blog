---
title: "SmartTCM-Agent-SYSTEM 项目深度分析报告"
date: 2026-09-17 11:00:00
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
> 研究日期: 2026-09-17
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

**项目定位与核心价值**
SmartTCM-Agent-SYSTEM 是一个基于大语言模型构建的前后端分离多智能体中医问诊系统。项目针对当前中医数字化系统存在的“意图识别精度低（<60%）”、“结构化与非结构化数据割裂”、“辨证推理缺乏严谨性”三大痛点，提出了一套融合动态推理与知识检索的解决方案。其核心价值在于将中医理论逻辑（如五行相生相克、十八反十九畏）与大模型的推理能力深度结合，实现了符合中医临床思维的智能问诊闭环。

**主要功能列表**
- **动态意图识别**：精准区分并处理中医闲聊、辨证问诊、古籍检索等6类核心场景。
- **多轮辨证问诊**：遵循“寒热→汗出→二便→舌苔→脉象”的中医问诊逻辑进行多轮动态追问。
- **混合知识检索**：打通结构化数据（病例、药材库）与非结构化数据（《黄帝内经》等古籍、医案）。
- **多模态图文解析**：集成中医视觉模型，支持舌苔、面色图片的解析以辅助辨证。
- **药材配伍校验**：联动图数据库校验药材禁忌与配伍逻辑，防止医疗逻辑错误。

## 2. 技术栈分析

**使用的技术和框架**
- **后端框架**：FastAPI（提供高性能的异步实时服务接口）。
- **前端框架**：Vue 3（构建现代化、响应式的用户交互界面）。
- **智能体编排**：LangGraph（构建动态、可循环的多智能体网络）。
- **大语言模型**：DeepSeek（中医微调版）、TCM-LLM 等垂直领域大模型。
- **知识检索引擎**：GraphRAG（结合图数据库的知识增强检索生成）。
- **图数据库**：Neo4j（存储药材关系、症状-辨证网络等复杂关联数据）。
- **多模态技术**：集成 TCM-CV 等中医专属计算机视觉模型。

**架构特点**
采用“动态识别 - 知识融合 - 工具校验 - 实时响应”四层架构。系统通过 LangGraph 实现状态机式的多智能体流转，而非传统的线性链。前后端分离设计保证了系统的扩展性，同时图数据库的引入使得中医复杂的网状知识体系得以原生表达。

**依赖关系**
核心依赖在于 LangGraph 对 Agent 状态流转的控制，以及 LLM 与 Neo4j 图数据库的交互。系统需要通过预定义的 Cypher 模板将自然语言转化为图查询，同时依赖外部多模态模型的 API 进行图像特征提取。

## 3. 核心功能/组件分析

**主要功能模块**
1. **意图识别与路由网络**：基于 LangGraph 构建，负责接收用户输入，识别其属于闲聊、问诊、查典等6类场景中的哪一类，并路由至对应的智能体。
2. **混合知识引擎**：包含 100+ 中医专属 Cypher 查询模板和 GraphRAG 检索器，负责对接 Neo4j 与向量数据库，提供底层知识支撑。
3. **多轮追问辨证模块**：内置中医“十问歌”逻辑，通过动态策略补全辨证所需的关键信息点。
4. **多模态解析模块**：处理用户上传的舌象或面色图片，提取特征（如黄腻、胖大）并转化为结构化症状输入到辨证模块。
5. **工具校验拦截器**：在输出最终方剂或药材建议前，调用图数据库校验“十八反十九畏”等禁忌规则。

**关键组件说明及关系**
- **Router（路由器）**：系统的入口，决定数据流向。
- **GraphRAG Retriever**：被问诊模块和古籍模块调用，提供背景知识。
- **Cypher Generator**：将辨证模块提取的症状实体转化为 Neo4j 查询语句。
- **Validator（校验器）**：作为系统的出口前置组件，拦截不合规的医疗建议。各组件通过 LangGraph 的状态图进行编排，实现数据流的闭环。

## 4. 技术实现亮点

- **创新点：中医专属的 GraphRAG 融合**
  传统 RAG 难以处理中医中“症状-辨证-治法-方剂-药材”的复杂链路关系。项目采用 GraphRAG，将非结构化古籍与结构化医案映射到同一张知识图谱中，大幅提升了检索的准确性和推理的严谨性。
- **设计模式：状态机驱动的多轮问诊**
  利用 LangGraph 的有向图特性，将中医问诊流程抽象为状态机。例如，系统只有在确认了“寒热”状态后，才会转移至询问“汗出”状态，完美契合中医临床思维。
- **最佳实践：模板化图查询保障安全性**
  预定义 100+ Cypher 模板，避免了让大模型直接生成 Cypher 语句带来的“幻觉”和注入风险，同时保证了查询逻辑符合中医理论规范。
- **最佳实践：领域微调模型与通用框架的解耦**
  底层模型支持 DeepSeek 中医微调版等，通过标准 API 接入，实现了模型层与业务逻辑层的解耦，方便后续替换更先进的基座模型。

## 5. 产品意义和应用场景

**解决的问题**
解决了中医数字化过程中“懂技术的懂中医”的壁垒，通过大模型与知识图谱的结合，有效避免了 AI 在医疗场景下“胡说八道”（如寒证荐寒凉药）的致命风险，提升了中医问诊系统的可用性与合规性。

**目标用户**
- 中医诊所/医院：作为辅助诊断系统，帮助年轻医生梳理辨证逻辑。
- 大健康平台：提供智能养生咨询、药材功效解答服务。
- 中医学习者：作为交互式的学习工具，查询古籍与模拟医案。

**应用场景**
- 线上轻问诊：用户输入症状，系统多轮追问后给出辨证参考与养生建议。
- 古籍与医案研究：通过语义匹配快速检索《伤寒论》等经典中的相关条文与历代医案。
- 药房配伍审查：快速校验医师所开方剂是否存在配伍禁忌。

## 6. 借鉴点

**技术层面**
1. **基于 LangGraph 的复杂业务流编排**：将复杂的领域业务逻辑转化为图状态机，为其他需要严格流程控制的垂直领域 Agent 开发提供了范本。
2. **GraphRAG 在垂直领域的应用**：展示了如何利用知识图谱约束大模型的检索增强生成，提高专业领域的回答准确率。
3. **多模态与文本智能体的融合机制**：将视觉模型提取的特征作为结构化数据注入文本 Agent，为医疗、工业检测等多模态场景提供了通用解法。

**产品层面**
1. **领域痛点的精准定位**：没有盲目做通用医疗大模型，而是聚焦“意图识别”、“数据割裂”、“推理不严”三个具体痛点，产品边界清晰。
2. **符合行业规范的校验机制**：在产品链路末端增加“十八反十九畏”等硬性逻辑校验，是医疗健康类 AI 产品落地的必要前提。
3. **场景化意图细分**：将用户意图细分为6类，并针对每类设计专门策略（如闲聊用情感分析，问诊用多轮追问），极大提升了用户体验。

**工程实践**
1. **查询模板化与标准化**：通过 100+ Cypher 模板封装高频场景，既提高了开发效率，又保障了数据库操作的安全与稳定。
2. **前后端分离与异步架构**：采用 FastAPI + Vue 3 的现代化技术栈，支撑大模型高延迟下的流式响应与实时交互。
3. **缓存优先机制**：针对桂枝汤、麻黄汤等高频古籍片段引入缓存，使检索响应提速 50%，体现了对系统性能与资源成本的工程考量。

## 7. 待深入研究

1. **LangGraph 的状态流转细节**：需深入源码研究其如何定义和转移问诊状态（如寒热、汗出等状态的节点定义及条件边逻辑）。
2. **GraphRAG 的知识图谱构建 Schema**：研究 Neo4j 中如何定义“症状-辨证-方剂-药材”的节点属性与边关系，以及非结构化古籍是如何被抽取并映射到该 Schema 的。
3. **多模态模型的集成方式**：研究 TCM-CV 等视觉模型的输出格式，以及系统如何将图像特征（如舌苔黄腻）精准对齐到图谱中的 Symptom 节点。
4. **100+ Cypher 模板的设计规范**：分析这些模板的参数化设计、复用性设计，以及如何与 LLM 的 Function Calling 机制结合。
5. **中医微调模型的边界能力**：研究 DeepSeek 中医微调版在意图识别、实体抽取等任务上的表现，以及当模型出现幻觉时，系统的容错与降级策略。---

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
