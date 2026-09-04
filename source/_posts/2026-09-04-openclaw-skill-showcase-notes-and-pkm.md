---
title: OpenClaw Skill 每日推荐 - Notes & PKM
date: 2026-09-04 11:30:00
tags:
  - openclaw
  - skill
  - notes-and-pkm
  - 知识管理
  - 记忆系统
categories:
  - 技术推荐
---

# OpenClaw Skill 每日推荐 — Notes & PKM（笔记与知识管理）

> 📅 2026年9月4日 | 第 19/30 期
> 
> 每天介绍一个 OpenClaw Skill 分类，帮你发现最实用的 AI Agent 技能。

## 今日分类概述

**Notes & PKM（笔记与个人知识管理）** 分类共收录 **71 个 Skill**，是 OpenClaw 生态中最大的分类之一。这个分类涵盖了从传统笔记应用集成（Apple Notes、Notion、Bear、Flomo）到 AI Agent 专用记忆系统（知识图谱、失败模式追踪、长期记忆持久化）的广泛领域。

对于 AI Agent 来说，"记忆"是通向真正智能的关键桥梁——没有记忆的 Agent 每次对话都从零开始，而有了结构化记忆系统，它可以记住你的偏好、理解实体间的关系、甚至从失败中学习。

---

## 精选 Skill 详解

### 1. 🧠 Cortex Memory — 知识图谱长期记忆系统

**GitHub**: [openclaw/skills → matthewubundi/cortex-memory](https://github.com/openclaw/skills/tree/main/skills/matthewubundi/cortex-memory/SKILL.md)

**推荐指数: ⭐⭐⭐⭐⭐**

#### 核心功能

Cortex Memory 是一个基于知识图谱的结构化长期记忆系统，超越简单的关键词搜索。它能从文本中自动提取事实、实体和关系，存储为图节点，并支持混合检索（BM25 + 语义搜索 + 时间推理 + 图遍历 + 重排序）。

#### 技术实现机制

- **存储后端**: Cortex API（托管服务，知识图谱数据库）
- **检索通道**: 5 路混合检索 — BM25 关键词、语义向量、时间推理、图遍历、重排序
- **节点类型**: FACT（事实）、ENTITY（实体）、EMOTION（情感）、INSIGHT（洞察）、VALUE（价值观）、BELIEF（信念）
- **查询模式**: `full`（完整检索，300-600ms）和 `fast`（快速检索，80-150ms）
- **Session ID 作用域**: 支持按项目/主题隔离记忆

#### 实用场景

```bash
# 记住用户偏好
curl -s -X POST "$CORTEX_BASE_URL/v1/ingest" \
  -H "x-api-key: $CORTEX_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"text": "User prefers PostgreSQL over MySQL", "session_id": "openclaw:preferences"}'

# 跨会话检索事实
curl -s -X POST "$CORTEX_BASE_URL/v1/retrieve" \
  -H "x-api-key: $CORTEX_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"query": "What company did the user join?", "query_type": "factual", "top_k": 5}'
```

**适用场景**:
- Agent 需要跨会话记住用户信息、项目上下文
- 理解概念间的关系（"auth 服务和 API 网关什么关系？"）
- 追踪信息随时间的变化（信念演变、事实更新）
- `memory_search` 返回结果太嘈杂时的升级方案

#### 亮点

Cortex 最独特之处在于**时间推理**——它能追踪"SUPERSEDES"关系，即当新事实覆盖旧事实时，系统知道哪个是最新的。这在长期对话中极为重要。

---

### 2. 🔥 Failure Memory — 从失败中学习的自我进化系统

**GitHub**: [openclaw/skills → leegitw/failure-memory](https://github.com/openclaw/skills/tree/main/skills/leegitw/failure-memory/SKILL.md)

**推荐指数: ⭐⭐⭐⭐⭐**

#### 核心功能

Failure Memory 解决了一个根本问题：AI 系统总是重复犯同样的错误。它通过 R/C/D 计数器（复发/确认/否定）追踪失败模式，当证据充分时自动将模式提升为约束规则。

#### 技术实现机制

- **工作目录**: `.learnings/` — 包含 `ERRORS.md`、`LEARNINGS.md` 和 `observations/` 子目录
- **R/C/D 计数器**:
  - **R (Recurrence)**: 自动检测到的失败次数
  - **C (Confirmations)**: 人工确认的真阳性次数
  - **D (Disconfirmations)**: 人工否定的假阳性次数
- **证据分层**: 弱（N=1）→ 中（N=2）→ 強（N≥3）
- **自动检测触发器**: 测试失败、用户纠正（"Actually..."）、API 4xx/5xx、部署回滚
- **命令接口**: `/fm detect`、`/fm record`、`/fm search`、`/fm classify`、`/fm status`、`/fm converge`

#### 实用场景

```
[DETECTED] test failure
Pattern: lint-before-commit
Observation: OBS-20260215-001
R: 1 → 2
Status: Monitoring (R<3)
```

当同一失败模式复发 3 次以上且获得 2 次以上人工确认时，系统自动标记为"eligible for constraint"，可生成硬约束规则防止再次发生。

**适用场景**:
- 开发流程中反复出现的 lint/build 错误
- API 集成中的常见失败模式
- Agent 重复犯的上下文遗漏错误
- 需要持续改进的 CI/CD 流程

#### 亮点

这是真正意义上的"AI 自我改进"——不是靠微调权重，而是靠经验积累。它把"犯过的错误"变成"不再犯的规则"。

---

### 3. 📝 Better Notion — Notion 全功能 CRUD 集成

**GitHub**: [openclaw/skills → tyler6204/better-notion](https://github.com/openclaw/skills/tree/main/skills/tyler6204/better-notion/SKILL.md)

**推荐指数: ⭐⭐⭐⭐**

#### 核心功能

通过 Notion API 实现页面、数据库和 Block 的完整 CRUD 操作。支持创建、读取、更新、删除、搜索和查询。

#### 技术实现机制

- **认证**: Notion Integration Token（Bearer Auth）
- **API 版本**: `2025-09-03`（最新 API，数据库已更名为 "data sources"）
- **速率限制**: ~3 请求/秒
- **配置**: 将 API Key 存储在 `~/.config/notion/api_key`

#### 实用场景

```bash
# 在数据库中创建新页面
curl -X POST "https://api.notion.com/v1/pages" -d '{
  "parent": {"data_source_id": "xxx"},
  "properties": {"Name": {"title": [{"text": {"content": "新任务"}}]}}
}'

# 查询数据库（过滤状态）
curl -X POST "https://api.notion.com/v1/data_sources/{id}/query" -d '{
  "filter": {"property": "Status", "select": {"equals": "Active"}}
}'

# 添加内容 Block
curl -X PATCH "https://api.notion.com/v1/blocks/{page_id}/children" -d '{
  "children": [{"type": "paragraph", "paragraph": {"rich_text": [{"text": {"content": "会议记录..."}}]}}]
}'
```

**适用场景**:
- 将 Agent 对话摘要自动存入 Notion 数据库
- 在 Notion 中管理项目看板（创建/更新任务状态）
- 从 Notion 知识库中检索信息回答用户问题
- 自动化会议纪要 → Notion 页面

#### 亮点

简洁直接的 curl 封装，没有额外依赖。属性类型对照表清晰明了，上手成本极低。

---

### 4. 🍎 Apple Notes — macOS 原生笔记管理

**GitHub**: [openclaw/skills → steipete/apple-notes](https://github.com/openclaw/skills/tree/main/skills/steipete/apple-notes/SKILL.md)

**推荐指数: ⭐⭐⭐⭐**

#### 核心功能

通过 `memo` CLI 工具直接在终端管理 Apple Notes，支持创建、查看、编辑、删除、搜索、移动和导出笔记。

#### 技术实现机制

- **依赖工具**: `memo`（Homebrew 安装: `brew tap antoniorodr/memo && brew install antoniorodr/memo/memo`）
- **平台限制**: macOS only
- **权限要求**: 需要在系统设置中授予 Automation 访问 Notes.app 的权限
- **交互方式**: 支持 CLI 参数和交互式选择

#### 实用场景

```bash
# 快速创建笔记
memo notes -a "项目会议纪要 - 2026/09/04"

# 搜索笔记（模糊匹配）
memo notes -s "API设计"

# 按文件夹过滤
memo notes -f "工作"

# 导出为 Markdown
memo notes -ex
```

**适用场景**:
- Agent 帮用户快速记录灵感到 Apple Notes
- 从对话中提取关键信息并存入指定文件夹
- 搜索已有笔记中的内容
- 将笔记导出为 Markdown 用于博客发布

#### 亮点

对于深度使用 Apple Notes 的 macOS 用户来说，这个 Skill 无缝衔接了终端和 Notes.app，无需切换应用即可完成所有笔记操作。

---

### 5. 💬 Flomo Notes — Webhook 速记到 Flomo

**GitHub**: [openclaw/skills → xiaoluoboding/flomo-notes](https://github.com/openclaw/skills/tree/main/skills/xiaoluoboding/flomo-notes/SKILL.md)

**推荐指数: ⭐⭐⭐**

#### 核心功能

通过 Webhook 将文本笔记一键保存到 Flomo（浮墨笔记），极简实现，只需一个 POST 请求。

#### 技术实现机制

- **集成方式**: Flomo Inbox Webhook URL
- **配置**: 通过 `~/.openclaw/openclaw.json` 设置 `FLOMO_WEBHOOK_URL`
- **执行**: `bash scripts/save_to_flomo.sh "<note text>"`

#### 实用场景

```bash
# 保存灵感到 Flomo
FLOMO_WEBHOOK_URL="https://flomoapp.com/iwh/XXXX" \
  bash scripts/save_to_flomo.sh "下周美股大事件：CPI数据公布、FOMC会议"
```

**适用场景**:
- 对话中随时记录灵感和想法
- 自动将重要信息片段推送到 Flomo
- 轻量级的信息收集管道

#### 亮点

用最少的代码做最专注的事——整个 Skill 就是一个 webhook POST。Flomo 用户的最快捷记录方式。

---

## 应用场景总结

| 场景 | 推荐 Skill | 理由 |
|------|-----------|------|
| Agent 需要跨会话记忆用户信息 | **Cortex Memory** | 知识图谱 + 时间推理，检索质量最高 |
| 开发团队希望 Agent 不重复犯错 | **Failure Memory** | R/C/D 计数器 + 自动约束提升 |
| 使用 Notion 作为知识库 | **Better Notion** | 完整 CRUD，直接操作 data sources |
| macOS 用户日常笔记管理 | **Apple Notes** | 原生集成，无需额外服务 |
| 需要极速捕捉灵感 | **Flomo Notes** | 一个 webhook 搞定，零延迟 |
| 需要语义搜索 + 图谱推理 | **Cortex Memory** | 5 通道混合检索，支持实体关系查询 |
| 项目知识管理 + 失败追踪组合 | **Cortex + Failure Memory** | 记住成功经验 + 不重复失败 |

---

## 推荐指数排名

| 排名 | Skill | 评分 | 核心优势 |
|------|-------|------|---------|
| 🥇 1 | Cortex Memory | ⭐⭐⭐⭐⭐ | 最完整的记忆系统：知识图谱 + 5通道检索 + 时间推理 |
| 🥈 2 | Failure Memory | ⭐⭐⭐⭐⭐ | 独特的失败学习机制，真正的 Agent 自我进化 |
| 🥉 3 | Better Notion | ⭐⭐⭐⭐ | Notion 全功能集成，简洁无依赖 |
| 4 | Apple Notes | ⭐⭐⭐⭐ | macOS 原生体验，`memo` CLI 优雅实用 |
| 5 | Flomo Notes | ⭐⭐⭐ | 极简设计，一个 webhook 解决速记需求 |

---

## 实用建议

### 给 Agent 开发者

1. **记忆系统选择路径**: 先用 `memory_search`（OpenClaw 内置）→ 如果跨会话检索不够用 → 上 `Cortex Memory`
2. **失败追踪要趁早**: 在项目初期就安装 `Failure Memory`，越早积累错误模式，越快收敛到稳定状态
3. **笔记应用集成**: 根据你团队用的工具选——Notion 选 `Better Notion`，Apple 生态选 `Apple Notes`，Flomo 用户选 `Flomo Notes`

### 给普通用户

1. **不想配 API Key？** → 用 `Apple Notes` 或 `Flomo Notes`，设置最简单
2. **想要最强大的记忆？** → `Cortex Memory`，但需要申请 API Key
3. **开发场景为主？** → `Failure Memory` + `Better Notion` 组合

### 组合推荐

```
日常 Agent 记忆三件套：
┌─────────────────────────────────┐
│  Cortex Memory    → 长期事实存储  │
│  Failure Memory   → 失败模式追踪  │
│  Better Notion    → 结构化输出    │
└─────────────────────────────────┘
```

这个组合让 Agent 能记住你说过的话（Cortex）、不重复犯同样的错（Failure Memory）、并将结果存入你习惯使用的知识库（Notion）。

---

> 📌 **明日预告**: PDF & Documents 分类 — 文档处理、PDF 操作、格式转换相关 Skill 推荐。
>
> 本系列共 30 期，每日一期，涵盖 OpenClaw 全部分类。更多 Skill 请访问 [ClawHub](https://clawhub.com)。
