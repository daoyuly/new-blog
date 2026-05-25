---
title: OpenClaw Skill 每日推荐 - 日历与调度
tags:
  - openclaw
  - skill
  - calendar
  - scheduling
categories:
  - 技术推荐
abbrlink: 24518
date: 2026-05-22 11:30:00
---

# 📅 OpenClaw Skill 每日推荐 — 日历与调度

> 本分类共收录 **65 个 Skills**，涵盖 Google Calendar、Apple Calendar、飞书日历、CalDAV、Cron 调度等全方位日历与时间管理工具。

---

## 🏆 精选 Skill 详解

### 1. gog — Google Workspace 全能 CLI

- **GitHub**: [openclaw/skills → steipete/gog](https://github.com/openclaw/skills/tree/main/skills/steipete/gog)
- **推荐指数**: ⭐⭐⭐⭐⭐

**核心功能**：一个 Skill 搞定 Google 全家桶——Gmail、Calendar、Drive、Contacts、Sheets、Docs。通过命令行直接操作 Google Workspace，无需打开浏览器。

**实用场景**：
- "帮我看看今天下午有什么会议"
- "把明天上午 10 点到 12 点标记为忙碌"
- "从 Gmail 里找到上周 John 发的会议确认邮件"

**技术实现**：基于 Google API 的 CLI 封装，通过 OAuth2 认证，将复杂的 API 调用简化为自然语言指令。对 OpenClaw 来说，只需调用对应 CLI 命令即可。

**为什么推荐**：覆盖面广，一个 Skill 替代多个单一功能 Skill，适合重度 Google Workspace 用户。

---

### 2. feishu-calendar — 飞书日历管理

- **GitHub**: [openclaw/skills → autogame-17/feishu-calendar](https://github.com/openclaw/skills/tree/main/skills/autogame-17/feishu-calendar)
- **推荐指数**: ⭐⭐⭐⭐⭐

**核心功能**：管理飞书（Lark）日历事件，支持创建、查询、更新和删除日历日程。

**实用场景**：
- "帮我约一个明天下午 3 点和产品组的会议"
- "下周我的日程表有哪些空闲时段？"
- "取消周五的周例会"

**技术实现**：通过飞书开放 API 操作日历数据，支持自然语言解析时间表达式（如"下周三"、"后天下午"等）。

**为什么推荐**：飞书在国内企业中普及率极高，这个 Skill 是 OpenClaw 接入飞书生态的核心入口之一。配合 `feishu-whiteboard` Skill 使用效果更佳。

---

### 3. apple-reminders — Apple 提醒事项

- **GitHub**: [openclaw/skills → steipete/apple-reminders](https://github.com/skills/tree/main/skills/steipete/apple-reminders)
- **推荐指数**: ⭐⭐⭐⭐

**核心功能**：通过 `remindctl` CLI 在 macOS 上管理 Apple Reminders，支持创建、完成、删除和列出提醒事项。

**实用场景**：
- "提醒我下午 5 点去买牛奶"
- "把所有已完成的提醒事项列出来"
- "给「工作」列表添加一个新任务"

**技术实现**：基于 macOS 原生 `remindctl` CLI 工具，直接与 Apple Reminders.app 数据库交互，无需额外 API 或云同步。

**为什么推荐**：对 macOS 用户来说，Reminders 是最轻量的任务管理工具。通过 OpenClaw 语音或文字控制，体验丝滑。

---

### 4. calendar-scheduling — 多平台日程调度

- **GitHub**: [openclaw/skills → billylui/calendar-scheduling](https://github.com/openclaw/skills/tree/main/skills/billylui/calendar-scheduling)
- **推荐指数**: ⭐⭐⭐⭐⭐

**核心功能**：跨 Google Calendar、Outlook 和 CalDAV 的统一日程调度。能合并多个日历的可用时段，自动找到最佳会议时间。

**实用场景**：
- "帮我找下周所有团队成员都有空的时间段"
- "在 Outlook 和 Google Calendar 上都创建这个会议"
- "把 Google 上的会议同步到 CalDAV 日历"

**技术实现**：多日历 API 聚合层，统一抽象了 Google Calendar API、Microsoft Graph API 和 CalDAV 协议的差异。支持时区感知和冲突检测。

**为什么推荐**：解决「多日历管理」这个真实痛点。同名作者的 `temporal-cortex` 系列更提供了高级功能，如原子化预约（2PC 协议）和 DST 感知的时间运算。

---

### 5. cron-scheduling — 定时任务管理

- **GitHub**: [openclaw/skills → gitgoodordietrying/cron-scheduling](https://github.com/openclaw/skills/tree/main/skills/gitgoodordietrying/cron-scheduling)
- **推荐指数**: ⭐⭐⭐⭐

**核心功能**：通过自然语言管理 cron 定时任务，创建、查看和删除定期执行的任务。

**实用场景**：
- "每天早上 8 点给我发送今日天气预报"
- "每周一检查网站 SSL 证书是否即将过期"
- "列出所有我设置的定时任务"

**技术实现**：将自然语言描述转换为 cron 表达式，通过系统 crontab 管理任务调度。

**为什么推荐**：OpenClaw 的定时任务是核心能力之一，这个 Skill 让非技术用户也能轻松设置周期性自动化任务。搭配 `cron-optimizer` 可以自动清理过期和冗余的 cron 条目。

---

## 📊 推荐指数排名

| 排名 | Skill | 推荐指数 | 适用人群 |
|:---:|:---|:---:|:---|
| 1 | **gog** (Google Workspace) | ⭐⭐⭐⭐⭐ | Google 全家桶重度用户 |
| 1 | **feishu-calendar** | ⭐⭐⭐⭐⭐ | 飞书企业用户 |
| 1 | **calendar-scheduling** | ⭐⭐⭐⭐⭐ | 多日历平台用户 |
| 4 | **apple-reminders** | ⭐⭐⭐⭐ | macOS 生态用户 |
| 4 | **cron-scheduling** | ⭐⭐⭐⭐ | 自动化爱好者 |

---

## 🎯 应用场景总结

这个分类的 65 个 Skills 覆盖了时间管理的方方面面：

1. **个人日程管理**：Apple Calendar、Google Calendar、飞书日历等主流平台全覆盖
2. **企业协同调度**：跨平台日程合并、会议室预约、团队空闲时间查询
3. **自动化定时任务**：Cron 调度、定期提醒、周期性数据抓取
4. **邮件+日历联动**：Microsoft 365 (clippy)、Google Workspace (gog) 统一管理
5. **垂直领域日程**：祈祷时间 (islamic-skills)、曲棍球赛程 (knhb-hockey)、农业设备维护 (farmos-equipment)

### 💡 实用建议

- **如果你主要用 Google**：安装 `gog`，一个 Skill 搞定所有
- **如果你用飞书**：`feishu-calendar` + `feishu-whiteboard` 组合拳
- **如果你需要跨平台**：`calendar-scheduling` + `temporal-cortex-datetime` 解决时区问题
- **如果你想自动化**：`cron-scheduling` + `cron-optimizer` 定时任务不失控
- **如果你是 macOS 用户**：`apple-reminders` + `accli` 充分利用系统原生能力

---

> 📌 *本系列每日更新一个 OpenClaw Skill 分类，共 30 期。关注 [daoyuly.cn](https://www.daoyuly.cn) 获取更多 OpenClaw 技巧。*
