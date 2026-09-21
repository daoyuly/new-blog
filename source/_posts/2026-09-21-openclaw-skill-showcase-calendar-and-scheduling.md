---
title: OpenClaw Skill 每日推荐 - 日历与调度
date: 2026-09-21 11:30:00
tags:
  - openclaw
  - skill
  - calendar-and-scheduling
  - 日历
  - 调度
categories:
  - 技术推荐
---

# OpenClaw Skill 每日推荐 - 日历与调度

> 📅 Day 4 / 30 — 每天介绍一个 OpenClaw Skill 分类，帮你找到最趁手的工具。

今天进入 **Calendar & Scheduling（日历与调度）** 分类。这个分类共收录 **65 个 skills**，涵盖了从本地日历管理到跨平台会议室预订的全链条工具。无论你是 Google Calendar 重度用户、macOS 原生派、还是飞书办公党，都能找到适合的 skill。

---

## 精选 Skill 详解

### 1. accli — Apple Calendar 命令行利器

| 项目 | 详情 |
|------|------|
| **GitHub** | [openclaw/skills - joargp/accli](https://github.com/openclaw/skills/tree/main/skills/joargp/accli/SKILL.md) |
| **作者** | joargp |
| **平台** | macOS only（依赖 JAA / AppleScript） |
| **安装** | `npm install -g @joargp/accli` |
| **推荐指数** | ⭐⭐⭐⭐⭐ |

**核心功能：** 通过 CLI 完整操控 macOS Apple Calendar——列出日历、查看/创建/更新/删除事件、查询空闲时段，全部支持 JSON 输出。

**技术实现：** 基于 macOS 的 JavaScript for Automation (JAA) 桥接 Apple Calendar.app，无需任何云服务或 API key，纯本地运行，隐私零顾虑。

**实用场景：**

```bash
# 查看本周工作日历
accli events Work --json

# 检查明天上午是否有空
accli freebusy --calendar Work --from 2026-09-22T09:00 --to 2026-09-22T12:00 --json

# 创建会议并附带地点和描述
accli create Work --summary "季度评审" --start 2026-09-22T14:00 --end 2026-09-22T15:00 \
  --location "会议室A" --description "Q3 季度项目进展评审" --json
```

**亮点：** 支持 `--calendar-id` 持久 ID 避免名称歧义，`freebusy` 可同时查多个日历的繁忙时段，是 macOS 用户的零配置日历方案。

---

### 2. advanced-calendar — 自然语言日历助手

| 项目 | 详情 |
|------|------|
| **GitHub** | [openclaw/skills - toughworm/advanced-calendar](https://github.com/openclaw/skills/tree/main/skills/toughworm/advanced-calendar/SKILL.md) |
| **作者** | 小机与老板 |
| **版本** | v1.0.2 |
| **安装** | `clawhub install advanced-calendar` |
| **推荐指数** | ⭐⭐⭐⭐ |

**核心功能：** 用自然语言创建日历事件，自动解析日期/时间/时长/地点/提醒偏好，支持多渠道通知（WhatsApp、Discord、Telegram、Signal），未确认的提醒会每 15 分钟重复推送（类似贪睡闹钟）。

**技术实现：** Python 实现，包含自然语言处理器、意图检测、信息抽取、交互式补全、JSON 本地存储。通过 OpenClaw Cron 每 5 分钟检查待提醒事件，可选每日早晨自动发送日程概要。

**实用场景：**

```
你："明天下午3点开个产品评审会，1小时，提前30分钟提醒我"
系统：✅ 已创建事件：产品评审会
      时间：2026-09-22 15:00，时长：60分钟，提醒：提前30分钟

你："这周有什么安排？"
系统：[列出未来7天的所有事件]

你："每天早上9点给我发当日日程"
系统：✅ 每日日程概要已设置为每天 9:00 自动发送
```

**亮点：** 交互式补全——信息不完整时会追问而非猜测；贪睡式提醒——用户回复"收到"前每 15 分钟重复通知，不怕错过。

---

### 3. Temporal Cortex — 跨平台日历调度引擎

| 项目 | 详情 |
|------|------|
| **GitHub** | [temporal-cortex/skills](https://github.com/temporal-cortex/skills) |
| **MCP Server** | `@temporal-cortex/cortex-mcp` (Rust 编译) |
| **支持平台** | Google Calendar, Outlook, CalDAV (iCloud, Fastmail) |
| **安装** | `npx @temporal-cortex/cortex-mcp` |
| **推荐指数** | ⭐⭐⭐⭐⭐ |

**核心功能：** 18 个工具分 5 层，从时区换算到跨平台会议室预订，一站式解决所有日历调度需求。支持多日历可用性合并、RRULE 重复事件展开、Two-Phase Commit (2PC) 原子预订防冲突。

**技术实现：** Rust 编译的 MCP server，通过 npm 分发。OAuth 凭据存储在本地 `~/.config/temporal-cortex/`，不传到任何第三方服务器。支持 Docker 容器隔离运行，SHA256 校验二进制完整性。

**5 层工具架构：**

| 层级 | 功能 | 工具数 |
|------|------|--------|
| Layer 0 — 发现 | 联系人搜索、身份解析 | 3 |
| Layer 1 — 时间 | 时区转换、日期解析、时长计算 | 5 |
| Layer 2 — 日历操作 | 列日历/事件、找空闲时段、RRULE展开 | 5 |
| Layer 3 — 可用性 | 多日历合并空闲/繁忙视图 | 2 |
| Layer 4 — 预订 | 原子预订、外部预订、提案撰写 | 3 |

**Two-Phase Commit 预订流程：**

```
book_slot(calendar_id, start, end, summary)
    │
    ├─ 1. LOCK    → 获取时间 slot 独占锁
    ├─ 2. VERIFY  → 检查冲突事件和活跃锁
    ├─ 3. WRITE   → 写入日历提供商 (Google/Outlook/CalDAV)
    └─ 4. RELEASE → 释放锁
```

**实用场景：**

```bash
# 跨日历找空闲时间
get_availability(
  start, end,
  calendar_ids: ["google/primary", "outlook/work"],
  privacy: "full"
)

# 搜索联系人并安排会议
search_contacts("张三") → resolve_contact → find_free_slots → book_slot

# 展开重复事件
expand_rrule("FREQ=MONTHLY;BYDAY=FR;BYSETPOS=-1", 
  dtstart: "2026-01-01T10:00:00", timezone: "Asia/Shanghai", count: 12)
```

**亮点：** Layer 1 时间工具零配置即用；Open Scheduling 模式支持通过 Temporal Link 让外部人员自助预订；TOON 格式输出比 JSON 省 40% token。

---

### 4. gog — Google Workspace 全家桶 CLI

| 项目 | 详情 |
|------|------|
| **GitHub** | [gogcli.sh](https://gogcli.sh) |
| **作者** | steipete |
| **安装** | `brew install steipete/tap/gogcli` |
| **推荐指数** | ⭐⭐⭐⭐ |

**核心功能：** 一个 CLI 搞定 Gmail、Calendar、Drive、Contacts、Sheets、Docs 六大 Google 服务。OAuth 认证后即可在终端完成邮件搜索发送、日历查询、云盘搜索、表格读写、文档导出等操作。

**技术实现：** Go 编写的独立二进制，通过 Google OAuth 2.0 认证，支持多账户切换。`--json` 输出适合脚本化，`--no-input` 适合自动化流水线。

**实用场景：**

```bash
# 一次性设置
gog auth credentials /path/to/client_secret.json
gog auth add you@gmail.com --services gmail,calendar,drive,contacts,sheets,docs

# 查看本周日历
gog calendar events primary --from 2026-09-21T00:00:00 --to 2026-09-28T00:00:00

# 搜索近7天邮件
gog gmail search 'newer_than:7d' --max 10

# 读取 Google Sheets 数据
gog sheets get <sheetId> "Tab!A1:D10" --json

# 导出 Google Docs
gog docs cat <docId> > doc.txt
```

**亮点：** 日历只是六分之一的能力。如果你重度依赖 Google 生态，gog 是最全面的终端工具。设置 `GOG_ACCOUNT` 环境变量后所有命令自动带账户，不用每次指定。

---

### 5. feishu-calendar — 飞书日历管理

| 项目 | 详情 |
|------|------|
| **GitHub** | [openclaw/skills - autogame-17/feishu-calendar](https://github.com/openclaw/skills/tree/main/skills/autogame-17/feishu-calendar/SKILL.md) |
| **作者** | autogame-17 |
| **依赖** | Node.js + `FEISHU_APP_ID` / `FEISHU_APP_SECRET` |
| **推荐指数** | ⭐⭐⭐⭐ |

**核心功能：** 飞书日历的完整管理——列出日历、搜索日历、查看日程、同步事件到本地状态、创建日程并添加参会人、创建共享项目日历。

**技术实现：** Node.js 脚本调用飞书开放 API，通过 `.env` 配置应用凭证。支持创建共享日历并批量添加成员和设置权限。

**实用场景：**

```bash
# 列出可用日历
node skills/feishu-calendar/list_test.js

# 按名称搜索日历
node skills/feishu-calendar/search_cal.js

# 创建日程并邀请参会人
node skills/feishu-calendar/create.js \
  --summary "任务：周报评审" \
  --desc "本周工作总结评审" \
  --start "2026-09-22T10:00:00" \
  --end "2026-09-22T11:00:00" \
  --attendees "ou_xxxxx"

# 创建项目共享日历
node skills/feishu-calendar/setup_shared.js \
  --name "Q4项目" --desc "Q4季度项目日程" \
  --members "ou_1,ou_2" --role "writer"
```

**亮点：** 对飞书办公团队来说是刚需——自动同步日程到本地记忆，创建共享日历批量加人，省去手动操作飞书后台的麻烦。

---

## 应用场景总结

| 场景 | 推荐 Skill | 理由 |
|------|-----------|------|
| macOS 个人日历管理 | **accli** | 零配置，原生集成，JSON 输出友好 |
| 自然语言日程安排 | **advanced-calendar** | 说人话就行，多渠道提醒不怕忘 |
| 跨平台企业级调度 | **Temporal Cortex** | 2PC 防冲突，多日历合并，MCP 标准化 |
| Google 全家桶重度用户 | **gog** | 日历+邮件+云盘+表格+文档一体化 |
| 飞书团队协作 | **feishu-calendar** | 原生飞书 API，共享日历+参会人管理 |

---

## 推荐指数排名

| 排名 | Skill | 指数 | 一句话评价 |
|------|-------|------|-----------|
| 🥇 | Temporal Cortex | ⭐⭐⭐⭐⭐ | 日历调度的终极方案，2PC + 多平台 + MCP，工程级别最高 |
| 🥈 | accli | ⭐⭐⭐⭐⭐ | macOS 用户的首选，简单纯粹，即装即用 |
| 🥉 | advanced-calendar | ⭐⭐⭐⭐ | 自然语言交互体验最佳，适合不想学命令行的用户 |
| 4 | gog | ⭐⭐⭐⭐ | Google 生态全覆盖，日历只是冰山一角 |
| 5 | feishu-calendar | ⭐⭐⭐⭐ | 飞书用户刚需，团队日历管理利器 |

---

## 实用建议

1. **如果你只用 macOS** — 装 `accli`，30 秒搞定，不需要任何 API key
2. **如果你需要跨平台** — 选 Temporal Cortex，一次 OAuth 配置后 Google/Outlook/CalDAV 通吃
3. **如果你在飞书办公** — `feishu-calendar` 配合 OpenClaw cron 可以实现每日日程自动推送
4. **如果你是 Google 重度用户** — `gog` 让你终端里搞定一切，不用切浏览器
5. **如果你想要"说句话就安排好"** — `advanced-calendar` 的自然语言 + 贪睡提醒最省心

---

> 📌 本系列共 30 期，每天一个分类。明日预告：**Clawdbot Tools** — OpenClaw 专属工具集。
>
> 完整分类列表：[awesome-openclaw-skills](https://github.com/openclaw/skills)
