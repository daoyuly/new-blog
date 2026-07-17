---
title: "SmartTCM-Agent-SYSTEM 项目深度分析报告"
date: 2026-07-17 11:00:00
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
> 研究日期: 2026-07-17
>
> 项目路径: /Users/daoyu/Documents/ai-repo/SmartTCM-Agent-SYSTEM

---

## 📊 项目概览

- **项目名称**: SmartTCM-Agent-SYSTEM
- **文件数量**: 932 个文件
- **主要插件**: 0 个

---

> ⚠️ AI 分析失败，本报告基于项目基本信息生成。

## 1. 项目概述

# SmartTCM-Agent - 基于大语言模型构建的多智能体中医问诊系统

一个基于 FastAPI + Vue 3 + LangGraph 构建的前后端分离多智能体中医问诊系统，支持 DeepSeek（中医微调版）、TCM-LLM 等中医领域大模型，融合 Agent 动态推理与 GraphRAG 中医知识检索能力，解决中医问诊场景下**意图识别准确率低**、**结构化 / 非结构化数据割裂**、**辨证推理不严谨**等核心痛点，覆盖中医辨证、古籍查询、医案参考、药材咨询、养生指导等全场景需求。

## 项目背景

当前中医问诊养生系统普遍存在三大核心问题：

1. **中医意图识别精度不足**：对 "辨证问诊""药材配伍""古籍检索" 等细分场景的识别准确率低于 60%，易混淆 "寒证咨询" 与 "热证用药" 等关键需求；
2. **中医数据割裂严重**：结构化数据（患者病例、药材库存、问诊订单）与非结构化数据（《黄帝内经》《伤寒论》等古籍、临床医案、舌苔图片）缺乏关联，无法支撑 "辨证 - 查典 - 荐方" 的闭环；
3. **辨证推理缺乏严谨性**：传统系统难以结合中医理论（如五行相生相克、十八反十九畏）进行动态推理，易出现 "寒证荐寒凉药" 等逻辑错误。

为此，本项目基于 LangGraph + DeepSeek（中医微调版）构建多智能体系统，通过 "动态识别 - 知识融合 - 工具校验 - 实时响应" 四层架构，打造符合中医诊疗逻辑的智能问诊解决方案。

## 核心职责

1. 基于 LangGraph 构建中医专属**动态智能体网络**，实现 6 类中医核心场景的精准意图识别与自适应响应；
2. 搭建中医**混合知识引擎**，打通结构化（病例、药材数据）与非结构化（古籍、医案）数据，支撑辨证推理与知识检索；
3. 开发中医领域**工具校验模块**，确保 Cypher 查询、方剂推荐、药材配伍的严谨性（符合中医理论与规范）；
4. 封装中医相关**实时服务接口**，集成权威中医数据库与医疗资源，提升问诊系统的实用性与合规性。

## 主要工作

### 1. 中医专属识别网络构建（基于 LangGraph）

基于 LangGraph 设计可扩展的中医意图识别网络，覆盖 6 类核心场景，通过 "动态策略 + 场景适配" 提升识别准确率至 90%+：

---

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
