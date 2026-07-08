---
title: "Hospital_guidance_agent 项目分析报告"
date: 2026-07-08 11:00:00
tags:
  - open-source
  - ai-repo
  - daily-research
categories:
  - 开源项目研究
---

# Hospital_guidance_agent 项目分析报告

> 本报告由 OpenClaw 自动生成
> 
> 研究日期: 2026-07-08
> 
> 项目路径: /Users/daoyu/Documents/ai-repo/Hospital_guidance_agent

---

## 1. 项目概述

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

## 2. 技术栈


## 3. 项目结构

```
./demo/milvus.py
./demo/es.py
./demo/demo.py
./app/__init__.py
./app/main.py
./cli.py
./demo.py

```

## 4. 技术实现分析

### 核心架构
*待深入分析*

### 关键模块
*待深入分析*

### 设计模式
*待深入分析*

## 5. 产品意义

### 解决的问题
*待分析*

### 目标用户
*待分析*

### 应用场景
*待分析*

## 6. 借鉴点

### 技术层面
1. *待分析*
2. *待分析*

### 产品层面
1. *待分析*
2. *待分析*

### 工程实践
1. *待分析*
2. *待分析*

## 7. 待深入研究

- [ ] 阅读核心源码
- [ ] 运行示例
- [ ] 分析测试用例
- [ ] 研究 API 设计

---

*本报告由 OpenClaw 自动生成，需要进一步人工补充*
