---
title: "Hospital_guidance_agent 项目深度分析报告"
date: 2026-04-29 11:00:00
tags:
  - open-source
  - ai-repo
  - daily-research
  - deep-analysis
categories:
  - 开源项目研究
---

# Hospital_guidance_agent 项目深度分析报告

> 本报告由 OpenClaw 自动生成（AI 深度分析版）
>
> 研究日期: 2026-04-29
>
> 项目路径: /Users/daoyu/Documents/ai-repo/Hospital_guidance_agent

---

## 📊 项目概览

- **项目名称**: Hospital_guidance_agent
- **文件数量**: 181 个文件
- **主要插件**: 0 个

---

> ⚠️ AI 分析失败，本报告基于项目基本信息生成。

## 1. 项目概述

# 生产级医院导诊 Agentic 助手

基于 FastAPI + LangGraph + Redis + Elasticsearch + Milvus + DashScope 的医院导诊问答与流程指引助手，同时提供命令行前端（rich CLI），可以作为生产级医疗导诊 / 医疗流程问答系统的参考实现。

后端通过 LangGraph 状态机编排多轮对话、症状问诊、流程检索与意图识别，前端则以 CLI 形式演示多会话聊天体验（类似 ChatGPT 的会话列表）。

---

## 功能特性

- 医疗导诊对话
  - 支持面向「症状问诊」和「就医流程」的多轮对话。
  - 结合向量检索与流程文档检索，给出答案和建议。
- Agentic 对话编排（LangGraph）
  - 使用 `AppState` 管理对话状态，基于 LangGraph 构建状态机。
  - 包含意图识别、RAG 检索、文档评估、Query 重写、答案生成等节点。
- 多会话管理（类似 ChatGPT）
  - 会话列表、创建会话、删除会话、切换当前会话。
  - 会话与用户元数据（名称、创建时间、最近活跃时间）存储在 Redis。
- 检索增强生成（RAG）
  - Elasticsearch：医院流程 / 制度等结构化文档检索。
  - Milvus：症状 / 医疗知识向量检索。
  - DashScope Embedding + Chat 模型。
- 命令行前端（rich CLI）
  - `cli.py` 提供交互式 CLI，支持斜杠命令和 Markdown 渲染。
  - 通过 REST API 与后端通信，可作为 Web 前端的参考。

---

## 项目结构

```text
app/
  main.py                  # FastAPI 应用入口（create_app / healthz）
  api/
    routers/
      chat.py              # /chat 对话接口
      threads.py           # /threads 会话管理接口
      users.py             # /users 用户信息接口
  core/
    config.py              # 

---

## 📁 文件结构示例

```
/Users/daoyu/Documents/ai-repo/Hospital_guidance_agent/demo/项目进度.md
/Users/daoyu/Documents/ai-repo/Hospital_guidance_agent/demo/.langgraph_api/.langgraph_checkpoint.1.pckl
/Users/daoyu/Documents/ai-repo/Hospital_guidance_agent/demo/.langgraph_api/store.vectors.pckl
/Users/daoyu/Documents/ai-repo/Hospital_guidance_agent/demo/.langgraph_api/.langgraph_retry_counter.pckl
/Users/daoyu/Documents/ai-repo/Hospital_guidance_agent/demo/.langgraph_api/.langgraph_ops.pckl
/Users/daoyu/Documents/ai-repo/Hospital_guidance_agent/demo/.langgraph_api/store.pckl
/Users/daoyu/Documents/ai-repo/Hospital_guidance_agent/demo/.langgraph_api/.langgraph_checkpoint.3.pckl
/Users/daoyu/Documents/ai-repo/Hospital_guidance_agent/demo/.langgraph_api/.langgraph_checkpoint.2.pckl
/Users/daoyu/Documents/ai-repo/Hospital_guidance_agent/demo/milvus.py
/Users/daoyu/Documents/ai-repo/Hospital_guidance_agent/demo/.DS_Store
/Users/daoyu/Documents/ai-repo/Hospital_guidance_agent/demo/redis/docker-compose.yaml
/Users/daoyu/Documents/ai-repo/Hospital_guidance_agent/demo/__pycache__/demo_mark.cpython-311.pyc
/Users/daoyu/Documents/ai-repo/Hospital_guidance_agent/demo/graph.png
/Users/daoyu/Documents/ai-repo/Hospital_guidance_agent/demo/es_milvus_DB/docker-compose.yaml
/Users/daoyu/Documents/ai-repo/Hospital_guidance_agent/demo/es_milvus_DB/.DS_Store
/Users/daoyu/Documents/ai-repo/Hospital_guidance_agent/demo/es_milvus_DB/volumes/.DS_Store
/Users/daoyu/Documents/ai-repo/Hospital_guidance_agent/demo/es_milvus_DB/volumes/milvus/rdb_data/000013.log
/Users/daoyu/Documents/ai-repo/Hospital_guidance_agent/demo/es_milvus_DB/volumes/milvus/rdb_data/LOG.old.1765438174577223
/Users/daoyu/Documents/ai-repo/Hospital_guidance_agent/demo/es_milvus_DB/volumes/milvus/rdb_data/OPTIONS-000009
/Users/daoyu/Documents/ai-repo/Hospital_guidance_agent/demo/es_milvus_DB/volumes/milvus/rdb_data/MANIFEST-000012
/Users/daoyu/Documents/ai-repo/Hospital_guidance_agent/demo/es_milvus_DB/volumes/milvus/rdb_data/IDENTITY
/Users/daoyu/Documents/ai-repo/Hospital_guidance_agent/demo/es_milvus_DB/volumes/milvus/rdb_data/000011.sst
/Users/daoyu/Documents/ai-repo/Hospital_guidance_agent/demo/es_milvus_DB/volumes/milvus/rdb_data/LOCK
/Users/daoyu/Documents/ai-repo/Hospital_guidance_agent/demo/es_milvus_DB/volumes/milvus/rdb_data/OPTIONS-000015
/Users/daoyu/Documents/ai-repo/Hospital_guidance_agent/demo/es_milvus_DB/volumes/milvus/rdb_data/CURRENT
/Users/daoyu/Documents/ai-repo/Hospital_guidance_agent/demo/es_milvus_DB/volumes/milvus/rdb_data/LOG
/Users/daoyu/Documents/ai-repo/Hospital_guidance_agent/demo/es_milvus_DB/volumes/milvus/rdb_data_meta_kv/OPTIONS-000007
/Users/daoyu/Documents/ai-repo/Hospital_guidance_agent/demo/es_milvus_DB/volumes/milvus/rdb_data_meta_kv/000011.log
/Users/daoyu/Documents/ai-repo/Hospital_guidance_agent/demo/es_milvus_DB/volumes/milvus/rdb_data_meta_kv/IDENTITY
/Users/daoyu/Documents/ai-repo/Hospital_guidance_agent/demo/es_milvus_DB/volumes/milvus/rdb_data_meta_kv/LOCK
...
(共 181 个文件)
```

---

*本报告由 OpenClaw 的 AI 深度分析系统生成*
*如有疑问或需要进一步分析，请联系研究者*
