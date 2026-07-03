---
title: OpenClaw Skill 每日推荐 - AI 与大语言模型
tags:
  - openclaw
  - skill
  - ai-and-llms
categories:
  - 技术推荐
abbrlink: 14077
date: 2026-07-01 11:30:00
---

# OpenClaw Skill 每日推荐 — AI 与大语言模型 🤖

> 本系列每天介绍一个 OpenClaw Skill 分类，帮你发现最有价值的 AI Agent 技能。今天是第 1 天，我们走进最大的分类——**AI & LLMs**，共 **184 个 Skills**！

## 📋 分类概述

AI & LLMs 是 OpenClaw 生态中规模最大的分类，涵盖了 Agent 记忆、多模型路由、安全防护、成本监控、语音转录、金融数据等方方面面。无论你是想让 Agent 记住上下文、节省 Token 开销，还是接入区块链支付，这个分类都有对应的 Skill。

## 🌟 精选 Skill 详解

### 1. MoA (Mixture of Agents) ⭐⭐⭐⭐⭐

- **仓库**: [openclaw/skills/moa](https://github.com/openclaw/skills/tree/main/skills/jscianna/moa/SKILL.md)
- **核心功能**: 让 3 个前沿 LLM 就同一问题展开辩论，然后综合出更优答案
- **实用场景**:
  - 复杂技术方案的决策——让 GPT、Claude、Gemini 各抒己见，取最优解
  - 代码审查时多视角交叉验证，减少单一模型的盲区
  - 创意写作中获得更多元的灵感碰撞
- **技术机制**: 采用 Mixture of Agents 架构，并行调用多个 LLM 获取各自回答，再由一个综合模型提炼最终输出。本质上是"集体智慧"在 LLM 领域的实现
- **推荐指数**: ⭐⭐⭐⭐⭐ — 用量虽大，但答案质量显著提升

### 2. Smart Context ⭐⭐⭐⭐⭐

- **仓库**: [openclaw/skills/smart-context](https://github.com/openclaw/skills/tree/main/skills/joe3112/smart-context/SKILL.md)
- **核心功能**: Token 效率优化——智能调整响应长度、上下文裁剪、工具调用精简、任务委托
- **实用场景**:
  - 长对话中自动裁剪过期上下文，保持 Token 在预算内
  - 根据问题复杂度自动选择简洁或详尽的回复风格
  - 将重型任务委托给子 Agent，主 Agent 只做调度
- **技术机制**: 基于 Token 计数和语义相关性分析，动态决定保留/裁剪哪些上下文片段，并根据任务类型选择最优的执行路径
- **推荐指数**: ⭐⭐⭐⭐⭐ — 每个 Agent 都应该装上的基础设施

### 3. Agent Memory ⭐⭐⭐⭐

- **仓库**: [openclaw/skills/agent-memory](https://github.com/openclaw/skills/tree/main/skills/dennis-da-menace/agent-memory/SKILL.md)
- **核心功能**: 为 AI Agent 提供持久化记忆系统，跨会话保留信息
- **实用场景**:
  - 记住用户偏好（语言、风格、常用工具）
  - 项目上下文延续——下次对话自动加载上次的工作状态
  - 构建有"人格"的 Agent，记忆塑造行为
- **技术机制**: 将关键信息序列化存储到本地文件系统，新会话启动时自动加载。类似人类的工作记忆 + 长期记忆分层架构
- **推荐指数**: ⭐⭐⭐⭐ — 持久记忆是 Agent 从"工具"走向"伙伴"的关键一步

### 4. Agent Orchestration ⭐⭐⭐⭐

- **仓库**: [openclaw/skills/agent-orchestration](https://github.com/openclaw/skills/tree/main/skills/halthelobster)
- **核心功能**: 掌握子 Agent 的生成和管理艺术——任务分解、并行执行、结果聚合
- **实用场景**:
  - 大型项目自动拆分为子任务，分配给多个 Agent 并行处理
  - 研究+写作+审查流水线，不同 Agent 各司其职
  - 多步骤工作流编排，如"搜索→分析→生成报告→发布"
- **技术机制**: 基于 OpenClaw 的 `sessions_spawn` API，提供一套任务分解和 Agent 编排的方法论，包括依赖管理、错误恢复和结果汇总
- **推荐指数**: ⭐⭐⭐⭐ — 复杂任务必备，但需要理解多 Agent 协作模式

### 5. Wolfram Alpha ⭐⭐⭐⭐

- **仓库**: [openclaw/skills/wolfram-alpha](https://github.com/openclaw/skills/tree/main/skills/robert-janssen/wolfram-alpha/SKILL.md)
- **核心功能**: 接入 Wolfram Alpha 计算引擎，执行复杂数学计算、物理模拟和科学查询
- **实用场景**:
  - 精确的数学推导和数值计算（微积分、线性代数、概率统计）
  - 物理仿真和工程计算
  - 数据分析与可视化
- **技术机制**: 通过 Wolfram Alpha API 将自然语言查询转换为结构化计算，返回精确结果和步骤推导。需要 Wolfram Alpha AppID
- **推荐指数**: ⭐⭐⭐⭐ — LLM 的计算能力有限，Wolfram 正好补位

## 🏆 推荐指数排名

| 排名 | Skill | 评分 | 一句话 |
|------|-------|------|--------|
| 1 | Smart Context | ⭐⭐⭐⭐⭐ | 省 Token 的艺术 |
| 2 | MoA | ⭐⭐⭐⭐⭐ | 三个臭皮匠顶个诸葛亮 |
| 3 | Agent Memory | ⭐⭐⭐⭐ | 让 Agent 拥有记忆 |
| 4 | Agent Orchestration | ⭐⭐⭐⭐ | 多 Agent 协作编排 |
| 5 | Wolfram Alpha | ⭐⭐⭐⭐ | 精确计算的终极武器 |

## 🎯 应用场景总结

这个 184 个 Skill 的大分类，核心覆盖了五大场景：

1. **Agent 基础能力增强** — 记忆、上下文管理、安全防护、自省机制
2. **多模型路由与优化** — 根据任务自动选择最优模型，节省成本
3. **金融与区块链** — 实时行情、钱包管理、跨链交易、DeFi 查询
4. **语音与转录** — Whisper 本地/云端转录、TTS 语音合成
5. **Agent 通信与身份** — Agent 间通信协议、身份验证、社交互动

## 💡 实用建议

- **新手入门**: 先装 `smart-context`，立竿见影省 Token
- **进阶玩家**: `agent-memory` + `agent-orchestration` 组合，打造有记忆的多 Agent 系统
- **成本敏感**: `arya-model-router` 或 `astrai-inference-router` 自动路由到最便宜的模型
- **安全优先**: `anti-injection-skill` + `safety-checks` 双保险

---

*本系列共 30 期，明日预告：**Apple 应用与服务** 🍎*

> 关注 [ClawHub](https://clawhub.com) 发现更多 Skills | [OpenClaw 文档](https://docs.openclaw.ai)
