---
title: OpenClaw Skill 每日推荐 - Notes & PKM（笔记与知识管理）
tags:
  - openclaw
  - skill
  - notes-and-pkm
  - 知识管理
  - 笔记
categories:
  - 技术推荐
abbrlink: 10510
date: 2026-06-12 11:30:00
---

# 🧠 Notes & PKM — 笔记与知识管理

OpenClaw Skill 生态中最庞大的分类之一，**71 个 Skills** 涵盖了从个人笔记、知识图谱、Agent 长期记忆到会议纪要的全链路。如果你想让 AI 助手真正成为你的「第二大脑」，这个分类是必逛的。

---

## 🏆 精选 Skill 详解

### 1. agent-memory-ultimate ⭐⭐⭐⭐⭐

**GitHub:** [openclaw/skills/agent-memory-ultimate](https://github.com/openclaw/skills/tree/main/skills/globalcaos/agent-memory-ultimate/SKILL.md)

**核心功能：** 生产级 Agent 记忆系统，支持日志记录、睡眠整合（sleep consolidation）、SQLite + FTS5 全文检索，还能从 WhatsApp/ChatGPT/VCF 导入历史数据。

**实用场景：**
- 让你的 AI 助手记住跨会话的对话上下文和偏好
- 自动从日常对话中提取关键信息并持久化
- 导入你在其他平台的聊天记录，让 Agent 快速「了解你」

**技术亮点：**
- SQLite 作为底层存储，轻量且可靠
- FTS5 全文搜索，毫秒级召回
- 睡眠整合机制模拟人类记忆巩固过程，自动压缩冗余信息

**推荐指数：** ⭐⭐⭐⭐⭐ — 记忆系统中的「全家桶」，适合想认真搭建 Agent 记忆的用户

---

### 2. apple-notes ⭐⭐⭐⭐

**GitHub:** [openclaw/skills/apple-notes](https://github.com/openclaw/skills/tree/main/skills/steipete/apple-notes/SKILL.md)

**核心功能：** 通过 `memo` CLI 在 macOS 上直接管理 Apple Notes，实现创建、搜索、编辑笔记。

**实用场景：**
- 语音转文字后自动存入 Apple Notes
- 定期将 Agent 总结的工作笔记同步到 Notes.app
- 用自然语言搜索和检索 Apple Notes 中的内容

**技术实现：** 基于 macOS 原生 AppleScript 桥接，通过 `memo` CLI 工具操作 Notes.app 的本地数据库，无需 API Key。

```bash
# 示例：创建一条新笔记
memo add "项目会议纪要 - 2026-06-12" --body "讨论了Q3规划..."

# 搜索笔记
memo search "Q3规划"
```

**推荐指数：** ⭐⭐⭐⭐ — Apple 生态用户的福音，零配置即用

---

### 3. cortex-memory ⭐⭐⭐⭐⭐

**GitHub:** [openclaw/skills/cortex-memory](https://github.com/openclaw/skills/tree/main/skills/matthewubundi/cortex-memory/SKILL.md)

**核心功能：** 长期结构化记忆系统，内建知识图谱、实体追踪、时序推理和跨会话召回。

**实用场景：**
- 构建个人知识图谱，自动提取对话中的实体和关系
- 时序推理：记住事件发生的时间线，回答「上次我们讨论X是什么时候」
- 跨会话上下文衔接，让每次对话都有「前情提要」

**技术亮点：**
- 知识图谱存储，支持实体-关系-实体三元组
- 时序感知，能区分「昨天说的」和「上个月说的」
- 跨会话召回，不依赖单一上下文窗口

**推荐指数：** ⭐⭐⭐⭐⭐ — 比 agent-memory-ultimate 更「智能」的记忆方案，适合需要深度知识管理的用户

---

### 4. meeting-to-action ⭐⭐⭐⭐

**GitHub:** [openclaw/skills/meeting-to-action](https://github.com/openclaw/skills/tree/main/skills/codedao12/meeting-to-action/SKILL.md)

**核心功能：** 将会议记录或转录文本转换为结构化的摘要、决策和行动项（含负责人和截止日期）。

**实用场景：**
- 语音转录后的会议纪要自动生成
- 从冗长的讨论中提取关键决策和待办事项
- 自动分配行动项负责人和截止时间

**示例输出：**

```markdown
## 会议摘要
- Q3 产品路线图已确认
- 新增 AI 助手功能模块

## 关键决策
1. ✅ 采用 Cortex 架构作为记忆方案
2. ✅ 上线时间定在 8 月 15 日

## 行动项
| 任务 | 负责人 | 截止日期 |
|------|--------|----------|
| 完成 API 设计 | 张三 | 6/20 |
| 用户调研报告 | 李四 | 6/25 |
```

**推荐指数：** ⭐⭐⭐⭐ — 职场人必备，把会议从「浪费时间」变成「产出行动」

---

### 5. braindb ⭐⭐⭐⭐

**GitHub:** [openclaw/skills/braindb](https://github.com/openclaw/skills/tree/main/skills/chair4ce/braindb/SKILL.md)

**核心功能：** 基于**语义搜索**的持久化记忆系统，让 AI Agent 拥有「理解」而非「关键词匹配」的检索能力。

**实用场景：**
- 存入大量技术文档，用自然语言提问而非精确关键词
- 跨领域知识关联：把「苹果」和「Apple Inc.」关联起来
- 长期知识积累，越用越智能

**技术实现：** 利用向量嵌入（embeddings）将文本转为语义向量，通过相似度搜索实现精准召回。不同于传统全文检索，语义搜索能理解「同义词」和「上下文」。

**推荐指数：** ⭐⭐⭐⭐ — 如果你更看重「搜索质量」而非「存储结构」，这是首选

---

## 📊 推荐指数排名

| 排名 | Skill | 评分 | 一句话推荐 |
|------|-------|------|-----------|
| 🥇 | agent-memory-ultimate | ⭐⭐⭐⭐⭐ | 全功能记忆系统，开箱即用 |
| 🥇 | cortex-memory | ⭐⭐⭐⭐⭐ | 知识图谱 + 时序推理，更「懂你」 |
| 🥈 | braindb | ⭐⭐⭐⭐ | 语义搜索记忆，质量优先 |
| 🥈 | apple-notes | ⭐⭐⭐⭐ | Apple 生态无缝集成 |
| 🥈 | meeting-to-action | ⭐⭐⭐⭐ | 会议纪要自动生成行动项 |

---

## 🎯 应用场景总结

**个人知识管理：** 用 `apple-notes`、`bear-notes`、`upnote` 等连接你常用的笔记工具，让 Agent 成为笔记的「智能入口」。

**Agent 记忆系统：** `agent-memory-ultimate`、`cortex-memory`、`braindb` 三大方案各有侧重——需要全功能选前者，需要知识图谱选中者，需要语义搜索选后者。

**会议与协作：** `meeting-to-action` 自动生成行动项，`meeting-notes` 生成结构化纪要，告别手动整理。

**内容消费：** `blogwatcher` 监控 RSS 更新，`tweet-processor` 提取推文洞察，`cubox` 保存网页到收藏夹。

---

## 💡 实用建议

1. **记忆系统选型：** 新手推荐 `agent-memory-ultimate`（功能全），进阶用户考虑 `cortex-memory`（更智能）
2. **笔记工具集成：** 优先选你已经在用的工具对应的 Skill，降低迁移成本
3. **组合使用：** `meeting-to-action` + `apple-notes` = 会议纪要自动存入 Notes.app
4. **定期维护：** 记忆系统需要定期清理，利用 sleep consolidation 功能自动压缩冗余

---

> 📅 这是 OpenClaw Skill 每日推荐系列的第 19 篇。明天预告：**PDF & Documents** — PDF 与文档处理。
