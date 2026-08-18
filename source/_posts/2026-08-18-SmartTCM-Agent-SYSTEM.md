---
title: "SmartTCM-Agent-SYSTEM 项目深度分析报告"
date: 2026-08-18 11:00:00
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
> 研究日期: 2026-08-18
>
> 项目路径: /Users/daoyu/Documents/ai-repo/SmartTCM-Agent-SYSTEM

---

## 📊 项目概览

- **项目名称**: SmartTCM-Agent-SYSTEM
- **文件数量**: 932 个文件
- **主要插件**: 0 个

---

以下是对 `SmartTCM-Agent-SYSTEM` 项目的深度分析报告：

# SmartTCM-Agent-SYSTEM 开源项目深度研究报告

## 1. 项目概述

**项目定位与核心价值**：
SmartTCM-Agent-SYSTEM 是一个基于大语言模型构建的**多智能体中医问诊系统**，旨在通过前沿的 AI 技术重构传统中医问诊流程。其核心价值在于解决了当前中医数字化系统的三大痛点：意图识别准确率低（<60%）、结构化与非结构化数据割裂、以及辨证推理缺乏严谨性。项目通过融合动态智能体网络与 GraphRAG 知识检索，将中医问诊意图识别准确率提升至 90% 以上，实现了符合中医理论逻辑的“辨证-查典-荐方”业务闭环。

**主要功能列表**：
- **动态意图识别**：精准区分闲聊、问诊、古籍检索等 6 类中医核心场景。
- **多轮辨证问诊**：按“寒热→汗出→二便→舌苔→脉象”中医十问逻辑进行自适应追问。
- **混合知识检索**：打通结构化数据库与《黄帝内经》等非结构化古籍，支持 GraphRAG 语义匹配。
- **药材配伍校验**：基于图数据库校验“十八反十九畏”等禁忌，确保荐方安全。
- **多模态图文解析**：集成中医 CV 模型，解析舌苔、面色特征辅助辨证。
- **实时服务接口**：封装权威中医数据库查询接口，支持高并发实时响应。

## 2. 技术栈分析

**使用的技术和框架**：
- **后端框架**：FastAPI（提供高性能异步 API 服务）
- **前端框架**：Vue 3（构建现代化前后端分离交互界面）
- **智能体编排**：LangGraph（构建动态状态多智能体网络）
- **大语言模型**：DeepSeek（中医微调版）、TCM-LLM（中医领域专用模型）
- **图数据库**：Neo4j（存储药材、症状、证候间的复杂关联关系）
- **检索增强**：GraphRAG（结合知识图谱与向量检索的混合 RAG 技术）

**架构特点**：
系统采用**“动态识别 - 知识融合 - 工具校验 - 实时响应”四层架构**。底层通过多模态输入获取患者信息；知识层利用 Neo4j 和向量库构建混合知识引擎；逻辑层通过 LangGraph 编排多个专职 Agent 进行路由和推理；接口层通过 FastAPI 对外提供稳定服务。整体架构兼具高内聚低耦合的特性与良好的水平扩展能力。

**依赖关系**：
项目强依赖于 LangGraph 进行复杂的状态流转和节点控制，强依赖于 Neo4j 进行 Cypher 查询和图谱推理。前端通过 HTTP/WebSocket 与后端 FastAPI 交互，大模型推理服务可通过 API 形式解耦接入。

## 3. 核心功能/组件分析

**主要功能模块**：
1. **意图识别网络**：基于 LangGraph 构建，负责对用户输入进行分类，路由至对应的处理节点（如闲聊 Agent、问诊 Agent）。
2. **混合知识引擎**：包含 100+ 预定义 Cypher 查询模板，覆盖 90% 高频场景，将非结构化古籍文本与结构化病例数据建立映射。
3. **多轮追问引擎**：内嵌中医辨证逻辑状态机，根据当前获取的信息缺口动态生成追问策略。
4. **工具校验模块**：作为 Agent 的外部工具，在输出最终药方前，调用图谱查询校验药材配伍禁忌。

**关键组件说明**：
- **GraphRAG 检索器**：不仅依赖向量相似度，还通过图谱关系（如“症状-指示-证候-治法-方剂”）进行多跳检索推理，大幅降低大模型幻觉。
- **多模态解析器**：对接 TCM-CV 模型，将舌苔图片转化为结构化特征数据（如“黄腻”、“胖大”），直接喂入辨证 Agent。

**功能之间的关系**：
系统以意图识别为入口，闲聊类直接由 LLM 生成温和科普回复；问诊类则触发多轮追问引擎，收集齐四诊信息后，调用混合知识引擎进行 GraphRAG 检索，最后将检索到的方剂送入工具校验模块进行安全过滤，形成完整的诊疗闭环。

## 4. 技术实现亮点

**创新点**：
- **中医专属动态智能体网络**：将中医“十问歌”等传统问诊逻辑硬编码入 LangGraph 的状态转移图中，使大模型的提问符合中医师的临床思维。
- **GraphRAG 在中医领域的深度落地**：利用图数据库的强关系表达力，解决传统向量检索无法理解“五行相生相克”等复杂中医逻辑的问题。
- **Cypher 模板库**：通过预定义 100+ 查询模板，有效屏蔽了自然语言到 Cypher 转换的不确定性，提升了图数据库查询的准确率和系统稳定性。

**设计模式与最佳实践**：
- **Router Pattern（路由模式）**：通过意图识别 Agent 作为 Router，动态分发任务给下游专职 Agent。
- **Tool Use Pattern（工具调用模式）**：将禁忌校验、古籍查询封装为独立工具，由 LLM 按需调用，增强了系统的可解释性。
- **缓存优先机制**：针对桂枝汤、麻黄汤等高频古籍条文引入缓存，使检索响应提速 50%，优化了端到端用户体验。

## 5. 产品意义和应用场景

**解决的问题**：
解决了医疗垂直领域中通用大模型“不懂医理”、“乱开药方”、“数据孤岛”的问题。通过严格的逻辑校验，避免了“寒证荐寒凉药”等致命逻辑错误，提升了 AI 问诊的安全边界和临床实用价值。

**目标用户**：
- **中医诊所/中医院**：作为辅助诊疗系统，帮助年轻医生快速完成辨证论治和病历结构化。
- **大健康/养生平台**：集成至 C 端应用，提供 7x24 小时的智能养生咨询与初步健康评估。
- **中医数字化研究者**：作为基于 GraphRAG 和 Multi-Agent 的垂直领域开源参考实现。

**应用场景**：
患者通过文字或图片描述症状（如上传舌苔照片并说明怕冷、流清涕），系统自动识别为“辨证问诊”意图，进行多轮追问后，判定为“风寒感冒”，并从图谱中检索出《伤寒论》相关条文及桂枝汤加减方，同时校验患者无相关药材禁忌后，输出最终诊疗建议。

## 6. 借鉴点

**技术层面**：
1. **LangGraph 的状态机应用**：将复杂的垂直领域业务逻辑（如问诊流程）转化为 LangGraph 的图结构状态流转，是控制大模型行为的有效范式。
2. **GraphRAG 混合检索架构**：在需要强逻辑关联的垂直领域（医疗、法律），单纯向量检索不够，结合知识图谱的 GraphRAG 是目前的最佳实践。
3. **模板化图查询**：用预定义 Cypher 模板替代 Text2Cypher，平衡了灵活性与准确性，是工程落地的务实选择。

**产品层面**：
1. **场景颗粒度细分**：将用户意图细分为 6 类，并针对每类设计专门的适配策略，避免了“一招鲜”带来的体验下降。
2. **安全合规前置**：在产品架构中直接内嵌“十八反十九畏”等校验模块，体现了医疗健康类 AI 产品的底线思维。
3. **多模态辅助决策**：结合中医特有的“望诊”（舌苔/面色），让产品体验更贴近真实就医场景，提升了产品的专业感。

**工程实践**：
1. **前后端分离与异步架构**：FastAPI + Vue 3 的组合保证了高并发下的 I/O 性能和前后端协作效率。
2. **高频数据缓存策略**：对高频访问的古籍片段进行缓存，有效降低底层向量库/图库压力，提升响应速度。
3. **微服务化解耦**：将大模型推理、知识检索、多模态解析等模块服务化，便于独立扩展和替换底层模型（如从 DeepSeek 切换到其他中医模型）。

## 7. 待深入研究

1. **LangGraph 的状态定义与流转逻辑**：需深入源码分析项目如何定义 `State` 对象，以及多轮追问中如何实现上下文的记忆与截断。
2. **100+ Cypher 模板的设计规范**：研究这些模板的参数化设计，以及如何与大模型提取的实体进行对接，评估其可扩展性。
3. **GraphRAG 的具体实现细节**：分析图谱节点与向量化文本的结合方式（如是否使用多跳查询与向量召回的融合排序），以及知识图谱的本体设计。
4. **中医多模态模型（TCM-CV）的集成方式**：研究舌苔图片的预处理、特征提取及结果如何作为结构化 Prompt 注入主推理链路。
5. **工具校验模块的覆盖范围**：除了“十八反十九畏”，是否涵盖了孕期禁忌、剂量超限等校验，以及当大模型输出与校验规则冲突时的回退策略。---

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
