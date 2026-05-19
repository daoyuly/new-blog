---
title: OpenClaw Skill 每日推荐 - AI 与大语言模型
date: 2026-05-19 11:30:00
tags:
  - openclaw
  - skill
  - ai-and-llms
categories:
  - 技术推荐
---

# 🤖 OpenClaw Skill 每日推荐 — AI 与大语言模型

> 今日分类：**AI & LLMs** | 共 **184 个 Skills** | OpenClaw 生态中最大的分类

---

## 📋 分类概述

AI & LLMs 分类是 OpenClaw 生态的绝对主力，汇聚了 184 个 Skill，涵盖了从 Agent 记忆系统、多模型编排、安全防护到语音识别、区块链交易等方方面面。无论你是想让 AI Agent 拥有持久记忆、自动路由最优模型，还是构建多 Agent 协作系统，这个分类都有对应的解决方案。

今天从 184 个 Skill 中精选 5 个最具代表性的，逐一深入剖析。

---

## 🏆 精选 Skill 详解

### 1. agent-memory — 持久记忆系统

- **GitHub**: [openclaw/skills/agent-memory](https://github.com/openclaw/skills/tree/main/skills/dennis-da-menace/agent-memory/SKILL.md)
- **作者**: dennis-da-menace
- **推荐指数**: ⭐⭐⭐⭐⭐

**核心功能**：为 AI Agent 提供持久化记忆存储。默认情况下，Agent 的每次会话都是无状态的，关掉就忘。这个 Skill 让 Agent 能跨会话记住用户偏好、历史对话和重要上下文。

**实用场景**：
- 个人助手需要记住你的饮食习惯、日程偏好
- 客服 Agent 记住用户的历史问题和解决方案
- 长期项目追踪，Agent 记住项目进展和决策

**技术实现**：通过文件系统或数据库存储记忆条目，支持记忆检索、更新和遗忘策略。典型的实现包含向量检索（semantic search）用于关联记忆召回。

```bash
# 安装方式
openclaw skill add dennis-da-menace/agent-memory
```

---

### 2. moa (Mixture of Agents) — 混合专家模型

- **GitHub**: [openclaw/skills/moa](https://github.com/openclaw/skills/tree/main/skills/jscianna/moa/SKILL.md)
- **作者**: jscianna
- **推荐指数**: ⭐⭐⭐⭐⭐

**核心功能**：让 3 个前沿大模型「辩论」，然后综合它们的最佳洞察，输出一个更优的答案。灵感来自学术界的 Mixture of Experts 思想，但用 Agent 编排的方式实现。

**实用场景**：
- 需要高置信度的技术决策（架构选择、方案评审）
- 复杂推理任务（法律分析、医疗诊断辅助）
- 创意生成中的多角度碰撞

**技术实现**：并行调用多个 LLM（如 GPT、Claude、Gemini），收集各自的输出后，通过一个「合成 Agent」整合观点、解决冲突、提炼共识。本质上是用额外的推理成本换取更高的输出质量。

```
用户提问 → Agent A (GPT) ↘
           Agent B (Claude) → 合成 Agent → 最终答案
           Agent C (Gemini) ↗
```

---

### 3. smart-context — 智能上下文管理

- **GitHub**: [openclaw/skills/smart-context](https://github.com/openclaw/skills/tree/main/skills/joe3112/smart-context/SKILL.md)
- **作者**: joe3112
- **推荐指数**: ⭐⭐⭐⭐⭐

**核心功能**：Token 效率优化器。自动管理响应大小、上下文裁剪、工具调用效率，以及任务委派策略。在长对话中自动压缩历史，保留关键信息。

**实用场景**：
- 长时间编程会话（上下文容易爆）
- 多轮研究任务（需要精确保留关键发现）
- Token 预算有限的场景（使用付费 API 时节省成本）

**为什么重要**：Token 窗口是 AI Agent 的核心瓶颈。Smart-context 不只是简单的截断，而是智能地识别哪些上下文值得保留、哪些可以压缩，是 Agent 长期运行的基础设施。

---

### 4. metacognition — AI 自省引擎

- **GitHub**: [openclaw/skills/metacognition](https://github.com/openclaw/skills/tree/main/skills/meimakes/metacognition/SKILL.md)
- **作者**: meimakes
- **推荐指数**: ⭐⭐⭐⭐

**核心功能**：让 AI Agent 具备自我反思能力。Agent 能审视自己的推理过程、识别认知偏差、评估答案置信度，并在必要时自我纠正。

**实用场景**：
- 高风险决策前的自我审查
- 减少幻觉（Hallucination）的额外防线
- 持续改进 Agent 行为模式

**技术机制**：在生成答案后，触发一轮「元认知」评估——Agent 会对自己的回答进行结构化反思：逻辑是否自洽？证据是否充分？有无遗漏角度？这种「thinking about thinking」的模式显著提升了复杂任务的可靠性。

---

### 5. wolfram-alpha — 科学计算引擎

- **GitHub**: [openclaw/skills/wolfram-alpha](https://github.com/openclaw/skills/tree/main/skills/robert-janssen/wolfram-alpha/SKILL.md)
- **作者**: robert-janssen
- **推荐指数**: ⭐⭐⭐⭐

**核心功能**：接入 Wolfram Alpha 计算引擎，执行复杂数学计算、物理模拟、数据分析和科学查询。补足了 LLM 在精确计算上的短板。

**实用场景**：
- 数学建模与符号计算
- 物理仿真（运动方程、热力学）
- 单位换算、统计分析
- 学生作业辅助、科研计算

**使用示例**：

```bash
# 通过自然语言查询
"计算 x^3 - 2x + 1 = 0 的实数根"
"500公里/小时换算成马赫数"
"计算 1000 个样本的 95% 置信区间"
```

---

## 📊 推荐指数排名

| 排名 | Skill | 评分 | 一句话总结 |
|:---:|:---|:---:|:---|
| 1 | agent-memory | ⭐⭐⭐⭐⭐ | Agent 的「长期记忆」，不可或缺的基础设施 |
| 2 | moa | ⭐⭐⭐⭐⭐ | 三模型辩论，质量碾压单模型 |
| 3 | smart-context | ⭐⭐⭐⭐⭐ | Token 管家，长会话必备 |
| 4 | metacognition | ⭐⭐⭐⭐ | 自省能力，让 Agent 更靠谱 |
| 5 | wolfram-alpha | ⭐⭐⭐⭐ | 精确计算的瑞士军刀 |

---

## 🎯 应用场景总结

这 184 个 AI & LLMs Skill 覆盖了以下核心领域：

### 🧠 Agent 基础能力
- **记忆与上下文**：agent-memory、mnemon、smart-context、context-gatekeeper
- **自我认知**：metacognition、anti-regression、agent-sentinel
- **多 Agent 协作**：moa、agent-orchestration、multi-agent-collab

### 🔀 模型路由与成本优化
- **智能路由**：arya-model-router、aisa-llm-router-skill、astrai-inference-router
- **成本控制**：agentpulse、tokenguard、token-alert、model-guard
- **动态切换**：switch-modes、bunni-modes

### 🔒 安全与防护
- **提示注入防护**：anti-injection-skill、pincer、safety-checks
- **凭证管理**：authy、vincent-credentials
- **安全审计**：arc-security-mcp、lieutenant

### 🗣️ 语音与音频
- **语音转文字**：voice-recognition、mh-openai-whisper、zhipu-asr
- **文字转语音**：local-llama-tts、speakturbo-tts、togetherai-tts

### 💰 金融与区块链
- **加密交易**：solana-skills、crypto-agent-payments、pump-fun
- **传统金融**：aisa-financial-data、revolut-business、wallet-api

---

## 💡 实用建议

1. **从 agent-memory 开始**：如果你刚开始用 OpenClaw，第一步就是装上持久记忆。没有记忆的 Agent 就像金鱼。
2. **关注 Token 成本**：长期运行的 Agent 必须搭配 smart-context 或 agentpulse，不然 API 账单会让你心跳加速。
3. **安全先行**：如果你的 Agent 有外部访问权限（邮件、支付、社交媒体），强烈建议安装 anti-injection-skill 和 safety-checks。
4. **多模型不是万能药**：moa 虽然效果好，但成本是单模型的 3-4 倍。日常任务用模型路由器就够了，关键决策再上 moa。

---

## 🔗 相关链接

- [OpenClaw 官方文档](https://docs.openclaw.ai)
- [Awesome OpenClaw Skills 完整列表](https://github.com/openclaw/skills)
- [OpenClaw Discord 社区](https://discord.com/invite/clawd)

---

*📝 本系列每日更新，明天预告：**Apple 应用与服务** 分类。关注本站不错过每天的 Skill 推荐！*
