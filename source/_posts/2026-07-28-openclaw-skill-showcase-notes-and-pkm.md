---
title: OpenClaw Skill 每日推荐 - 笔记与知识管理
date: 2026-07-28 11:30:00
tags:
  - openclaw
  - skill
  - notes-and-pkm
  - 知识管理
  - 记忆系统
categories:
  - 技术推荐
---

# OpenClaw Skill 每日推荐 - 笔记与知识管理（Notes & PKM）

> 📅 2026年7月28日 | 第 19/30 期
> 
> 本系列每天介绍一个 OpenClaw Skill 分类，今天是 **笔记与知识管理**，共收录 **71 个 Skills**。

## 分类概述

「笔记与知识管理」（Notes & PKM）是 OpenClaw 生态中最重要的分类之一。这个分类的 Skill 主要解决两个核心问题：

1. **AI Agent 的记忆持久化** — 让 Agent 跨会话保留上下文和经验
2. **人类知识管理工具集成** — 连接 Notion、Apple Notes、Anki、Bear 等主流笔记工具

71 个 Skill 大致可分为三条线：
- **记忆系统类**（约 40%）：agent-memory-ultimate、cortex-memory、braindb、rune 等
- **笔记工具集成类**（约 35%）：apple-notes、better-notion、bear-notes、flomo-notes 等
- **知识处理类**（约 25%）：meeting-notes、tweet-processor、blogwatcher、nova-letters 等

---

## 精选 Skill 详解

### 1. agent-memory-ultimate ⭐⭐⭐⭐⭐

**作者：** globalcaos
**链接：** [ClawHub](https://clawhub.ai/skills/globalcaos) | [GitHub](https://github.com/openclaw/skills/tree/main/skills/globalcaos/agent-memory-ultimate/SKILL.md)

**核心功能：**
生产级 AI Agent 记忆系统，提供完整的记忆管理方案：
- 每日日志自动记录
- Sleep consolidation（睡眠整合）机制 — 模拟人脑在休息时整理记忆的过程
- SQLite + FTS5 全文搜索引擎
- 支持 WhatsApp / ChatGPT / VCF 数据导入

**技术实现：**
- 使用 SQLite 作为底层存储引擎，FTS5 扩展提供全文检索能力
- "Sleep consolidation" 是一大亮点：Agent 在空闲时段自动回顾、压缩、关联历史记忆
- 支持多数据源导入，可以把你在 WhatsApp 上的对话、ChatGPT 的聊天记录统一整合

**实用场景：**
```
场景：你让 Agent 帮你管理日常待办和知识笔记
- 白天：Agent 记录每条指令和交互
- 夜间：自动运行 sleep consolidation，整理当天记忆
- 次日：你问"上周我们讨论的方案是什么来着"，Agent 能快速检索到
```

**推荐指数：** ⭐⭐⭐⭐⭐
**推荐理由：** 最完整的 Agent 记忆方案之一，SQLite + FTS5 的组合既轻量又高效，sleep consolidation 机制设计精巧，适合需要长期记忆的生产环境。

---

### 2. better-notion ⭐⭐⭐⭐⭐

**作者：** tyler6204
**链接：** [ClawHub](https://clawhub.ai/skills/tyler6204) | [GitHub](https://github.com/openclaw/skills/tree/main/skills/tyler6204/better-notion/SKILL.md)

**核心功能：**
为 Notion 提供完整的 CRUD（创建、读取、更新、删除）操作能力：
- 页面（Page）的创建、查询、编辑、删除
- 数据库（Database）的读写操作
- 支持复杂的过滤和排序条件
- 属性级别的精确操作

**技术实现：**
- 基于 Notion API 封装，通过 OpenClaw Skill 接口暴露给 Agent
- 支持结构化数据操作，可以把 Notion 数据库当作 Agent 的外部知识库
- "Better" 之名来自于对原生 Notion API 的简化和增强封装

**实用场景：**
```python
# 场景：用 Agent 管理你的 Notion 项目看板
用户："帮我在项目数据库里新建一个任务，标题是'优化首页加载速度'，
      优先级标为高，截止日期下周五"

Agent 操作：
1. better-notion → 在指定数据库创建新页面
2. 设置 Title = "优化首页加载速度"
3. 设置 Priority = "High"  
4. 设置 Due Date = 2026-08-07
5. 返回页面链接给用户
```

**推荐指数：** ⭐⭐⭐⭐⭐
**推荐理由：** Notion 是最流行的知识管理工具之一，这个 Skill 让 Agent 能直接操作你的 Notion 工作区，实现真正的自动化知识管理。API 封装完整，实用性极强。

---

### 3. apple-notes ⭐⭐⭐⭐

**作者：** steipete
**链接：** [ClawHub](https://clawhub.ai/skills/steipete) | [GitHub](https://github.com/openclaw/skills/tree/main/skills/steipete/apple-notes/SKILL.md)

**核心功能：**
通过 `memo` CLI 工具管理 macOS 原生 Apple Notes：
- 创建、搜索、编辑 Apple Notes 笔记
- 支持文件夹组织
- 原生集成 macOS 生态

**技术实现：**
- 基于 `memo` CLI（命令行工具），通过 AppleScript / Shortcuts 桥接 Apple Notes
- 无需第三方服务，纯本地运行，隐私安全
- 利用了 macOS 原生 Notes.app 的数据库结构

**实用场景：**
```
场景：会议中用语音输入快速记录要点
用户："把刚才的会议纪要存到 Apple Notes 的'工作'文件夹里"
Agent：
1. 整理会议要点为结构化文本
2. 调用 memo CLI 创建新笔记
3. 自动归类到"工作"文件夹
4. 后续可搜索和引用
```

**推荐指数：** ⭐⭐⭐⭐
**推荐理由：** 对 macOS 用户来说，Apple Notes 是最随手可得的笔记工具。这个 Skill 让 Agent 直接操作本地笔记，无需额外的云服务，隐私友好。扣一颗星是因为仅限 macOS 平台。

---

### 4. anki-connect ⭐⭐⭐⭐

**作者：** gyroninja
**链接：** [ClawHub](https://clawhub.ai/skills/gyroninja) | [GitHub](https://github.com/openclaw/skills/tree/main/skills/gyroninja/anki-connect/SKILL.md)

**核心功能：**
通过 AnkiConnect REST API 与 Anki 闪卡应用交互：
- 创建、编辑、删除闪卡（Flashcard）
- 管理牌组（Deck）和笔记类型
- 查询复习进度和统计
- 自动生成卡片内容

**技术实现：**
- 基于 AnkiConnect 插件的 HTTP API（localhost:8765）
- 支持 Anki 的完整数据模型：Note → Card → Deck
- 可与 Agent 的知识提取能力结合，实现自动制卡

**实用场景：**
```
场景：学习新知识时自动生成复习卡片
用户："我在学 Rust 语言的所有权机制，帮我做一套闪卡"

Agent 操作：
1. 整理 Rust 所有权核心知识点
2. 通过 AnkiConnect API 批量创建卡片：
   - 正面：什么是 Rust 的所有权规则？
   - 背面：每个值有且仅有一个所有者，当所有者离开作用域时值被丢弃
3. 归类到 "Rust 编程" 牌组
4. 你打开 Anki 就可以直接开始复习
```

**推荐指数：** ⭐⭐⭐⭐
**推荐理由：** Anki 是间隔重复学习的黄金标准。把 Agent 的知识整理能力和 Anki 的复习算法结合，是学习效率的倍增器。需要本地运行 Anki 桌面端，稍有限制。

---

### 5. daily-memory-save ⭐⭐⭐⭐

**作者：** meimakes
**链接：** [ClawHub](https://clawhub.ai/skills/meimakes) | [GitHub](https://github.com/openclaw/skills/tree/main/skills/meimakes/daily-memory-save/SKILL.md)

**核心功能：**
定期回顾对话历史，自动写入记忆文件以维持 Agent 跨会话连续性：
- 定时扫描对话记录
- 提取关键信息和决策点
- 结构化写入记忆文件
- 支持自定义记忆保留策略

**技术实现：**
- 作为 OpenClaw 的定时任务（Cron）运行
- 分析对话内容，使用 LLM 提取值得记住的信息
- 将提取的记忆写入 workspace 下的 memory 文件
- 与 OpenClaw 的 MEMORY.md 机制深度集成

**实用场景：**
```
场景：长期使用 Agent 管理多个项目
- 每天 23:00 自动运行
- 回顾当天所有对话，提取：
  · 项目决策和原因
  · 待办事项变更
  · 新学到的技术知识
  · 用户的偏好变化
- 写入 memory/daily-2026-07-28.md
- 下次会话时 Agent 自动加载相关记忆
```

**推荐指数：** ⭐⭐⭐⭐
**推荐理由：** 解决了 OpenClaw Agent "失忆" 的核心痛点。设计简洁，与原生记忆机制无缝集成。适合需要长期与 Agent 协作的用户。相比 agent-memory-ultimate 更轻量，适合入门。

---

## 应用场景总结

### 场景一：构建个人知识助手

组合 `apple-notes` + `better-notion` + `anki-connect`：

```
用户 → Agent 整理信息 → 写入 Notion 知识库
                     → 同步要点到 Apple Notes（快速访问）
                     → 生成 Anki 闪卡（复习巩固）
```

这是完整的「捕获 → 组织 → 复习」知识管理闭环。

### 场景二：打造有记忆的 AI 助手

组合 `daily-memory-save` + `agent-memory-ultimate`：

```
日常对话 → daily-memory-save 定时提取关键信息
        → agent-memory-ultimate 整合长期记忆
        → Sleep consolidation 优化记忆关联
        → 跨会话保持上下文连续性
```

适合把 OpenClaw Agent 当作长期协作伙伴的用户。

### 场景三：会议知识管理

组合 `meeting-notes` + `meeting-to-action` + `better-notion`：

```
会议录音/转录 → meeting-notes 生成结构化纪要
             → meeting-to-action 提取行动项
             → better-notion 写入项目看板
```

把会议从"开完就忘"变成可追踪的知识资产。

---

## 推荐指数排名

| 排名 | Skill 名称 | 推荐指数 | 最佳适用场景 |
|------|-----------|---------|------------|
| 1 | agent-memory-ultimate | ⭐⭐⭐⭐⭐ | 生产级 Agent 长期记忆 |
| 2 | better-notion | ⭐⭐⭐⭐⭐ | Notion 知识库自动化 |
| 3 | apple-notes | ⭐⭐⭐⭐ | macOS 本地笔记管理 |
| 4 | anki-connect | ⭐⭐⭐⭐ | 间隔重复学习 |
| 5 | daily-memory-save | ⭐⭐⭐⭐ | 轻量级跨会话记忆 |

---

## 实用建议

1. **记忆系统选择策略：** 如果你是 OpenClaw 重度用户，优先部署 `agent-memory-ultimate`；如果只是偶尔使用，`daily-memory-save` 足够。
2. **笔记工具集成优先级：** 先选你最常用的笔记工具对应的 Skill。Notion 用户装 `better-notion`，Apple 生态用户装 `apple-notes`，Bear 用户装 `bear-notes`。
3. **学习增强：** `anki-connect` 特别适合学生和终身学习者。可以让 Agent 在你阅读文档时自动生成闪卡，实现"学完即卡"。
4. **隐私考虑：** 记忆类 Skill 会存储你的对话摘要，注意检查 memory 目录的权限设置，敏感信息建议手动过滤。
5. **组合使用效果更佳：** 单个 Skill 能力有限，组合使用才能发挥最大价值。推荐先从"笔记 + 记忆"双线并行开始。

---

> 📌 明日预告：**PDF 与文档**（PDF & Documents）分类
> 
> 关注本系列，每天发现新的 OpenClaw Skill！
