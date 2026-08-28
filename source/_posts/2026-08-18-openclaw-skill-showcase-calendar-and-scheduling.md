---
title: OpenClaw Skill 每日推荐 - 日历与调度
tags:
  - openclaw
  - skill
  - calendar
  - scheduling
categories:
  - 技术推荐
abbrlink: 24519
date: 2026-08-18 11:30:00
---

# OpenClaw Skill 每日推荐 - 日历与调度

> 📅 Day 4 / 30 — 今天我们来聊聊 OpenClaw 生态中与日历和调度相关的 Skills。

## 分类概述

**Calendar & Scheduling** 分类共收录了 **65 个 Skills**，是 OpenClaw 生态中非常活跃的领域之一。这些 Skills 覆盖了从本地日历管理（Apple Calendar、CalDAV）到云端协作（Google Calendar、Feishu/Lark、Microsoft 365），从简单的提醒到复杂的多日历跨平台调度，从 cron 定时任务到 NFT 活动门票等丰富场景。

无论你是个人用户想要管理日常安排，还是团队管理者需要跨平台协调会议，这个分类都有适合你的工具。

## 精选 Skill 详解

### 1. ⭐⭐⭐⭐⭐ apple-calendar

- **GitHub**: [openclaw/skills/tyler6204/apple-calendar](https://github.com/openclaw/skills/tree/main/skills/tyler6204/apple-calendar/SKILL.md)
- **作者**: tyler6204

**核心功能**：深度集成 macOS 原生日历应用（Calendar.app），允许 OpenClaw 直接读取、创建、修改和删除日历事件。

**实用场景**：
- "帮我看一下明天下午有什么安排"
- "创建一个周三下午 3 点的 dentist 预约，提前 1 小时提醒我"
- "把今天所有含'会议'的事件整理成清单"

**技术实现**：通过 AppleScript / EventKit 框架与 macOS Calendar.app 交互，无需额外配置任何 API 密钥或 OAuth 流程。对于 macOS 用户来说，这是零门槛的日历管理方案。

**推荐指数**：⭐⭐⭐⭐⭐

> 💡 适合所有 macOS 用户，尤其是不想折腾第三方 API 配置的人。

---

### 2. ⭐⭐⭐⭐⭐ gog (Google Workspace CLI)

- **GitHub**: [openclaw/skills/steipete/gog](https://github.com/openclaw/skills/tree/main/skills/steipete/gog/SKILL.md)
- **作者**: steipete

**核心功能**：一站式 Google Workspace 命令行工具，覆盖 Gmail、Google Calendar、Drive、Contacts、Sheets 和 Docs。不限于日历，但日历功能非常强大。

**实用场景**：
- "查看我本周 Google 日历的所有事件"
- "在 Gmail 中找上周关于 Q3 规划的邮件，然后在日历创建一个跟进会议"
- "把 Drive 里的会议纪要 Sheet 数据导入日历事件"

**技术实现**：`gog` 是一个独立的 CLI 工具，封装了 Google Workspace 各产品的 API。通过 OAuth 2.0 认证后，可以跨服务联动——比如从邮件中提取事件信息自动创建日历条目，或从 Sheets 批量导入日程。

**推荐指数**：⭐⭐⭐⭐⭐

> 💡 如果你重度使用 Google 生态，`gog` 是必装 Skill。它的跨服务联动能力是单体日历工具无法比拟的。

---

### 3. ⭐⭐⭐⭐ feishu-calendar

- **GitHub**: [openclaw/skills/autogame-17/feishu-calendar](https://github.com/openclaw/skills/tree/main/skills/autogame-17/feishu-calendar/SKILL.md)
- **作者**: autogame-17

**核心功能**：管理飞书（Lark）日历，支持创建/查询/修改日历事件，与飞书生态深度集成。

**实用场景**：
- "帮我查一下今天飞书上有没有空闲时间段，安排一个 30 分钟的 1:1 会议"
- "把下周的飞书日历导出为文字摘要发给我"
- "在飞书日历创建一个每周五下午的周会，邀请整个团队"

**技术实现**：通过飞书开放平台的 Calendar API 实现，需要配置 App ID 和 App Secret。支持读写日历事件、查询空闲/忙碌状态、管理参与者等。同作者还提供了 `feishu-whiteboard` 等配套 Skills，形成飞书生态工具链。

**推荐指数**：⭐⭐⭐⭐

> 💡 飞书用户（尤其国内团队）的首选。配合 OpenClaw 的飞书 Channel 使用体验更佳。

---

### 4. ⭐⭐⭐⭐ temporal-cortex-scheduling

- **GitHub**: [openclaw/skills/billylui/temporal-cortex-scheduling](https://github.com/openclaw/skills/tree/main/skills/billylui/temporal-cortex-scheduling/SKILL.md)
- **作者**: billylui

**核心功能**：多日历可用时间合并 + 原子化预约（两阶段提交）。这是整个分类中技术含量最高的 Skill。

**实用场景**：
- "我有 Google Calendar 和 Outlook 两个日历，帮我找一个下周双方都空闲的 1 小时时段"
- "跨 3 个时区安排一个所有参与者都能参加的电话会议"
- "同时预约会议室和通知参与者，如果任一步失败就全部回滚"

**技术实现**：采用 **两阶段提交（2PC）** 协议确保跨平台预约的原子性——要么所有日历上都成功创建事件，要么全部回滚。支持 Google、Outlook 和 CalDAV 三大日历平台的可用时间合并查询。同作者还提供了 `temporal-cortex-datetime`（时区转换与 DST 感知时间计算）和 `temporal-cortex`（完整调度框架）作为配套。

**推荐指数**：⭐⭐⭐⭐

> 💡 适合需要跨多个日历平台协调会议的重度用户。技术架构精良，但配置复杂度也相对较高。

---

### 5. ⭐⭐⭐⭐ cron-scheduling

- **GitHub**: [openclaw/skills/gitgoodordietrying/cron-scheduling](https://github.com/openclaw/skills/tree/main/skills/gitgoodordietrying/cron-scheduling/SKILL.md)
- **作者**: gitgoodordietrying

**核心功能**：使用 cron 语法调度和管理 OpenClaw 的周期性任务。

**实用场景**：
- "每天早上 8 点给我发一条天气预报"
- "每周一 9 点汇总上周的 Git 提交记录"
- "工作日每天下午 5 点提醒我写日报"

**技术实现**：封装了 OpenClaw 的 cron 调度系统，支持标准 cron 表达式语法。可以创建、列出、暂停和删除定时任务。与 OpenClaw 的 Heartbeat 机制配合，实现真正的自动化工作流。

```bash
# 示例：创建一个每天早上 8 点的天气预报任务
cron-scheduling create \
  --schedule "0 8 * * *" \
  --task "查询上海今天和明天的天气，发送到当前频道"
```

**推荐指数**：⭐⭐⭐⭐

> 💡 这是 OpenClaw 自动化的基石 Skill。虽然不是传统意义上的"日历"，但它是时间调度的基础设施。

---

## 应用场景总结

| 场景 | 推荐 Skill | 理由 |
|------|-----------|------|
| macOS 个人日程管理 | apple-calendar | 零配置，原生体验 |
| Google 全家桶用户 | gog | 跨服务联动，功能全面 |
| 飞书团队协作 | feishu-calendar | 深度集成飞书生态 |
| 跨平台复杂调度 | temporal-cortex-scheduling | 2PC 保证一致性，多日历合并 |
| 自动化定时任务 | cron-scheduling | 系统级调度基础设施 |
| CalDAV 日历同步 | caldav-calendar | 支持 CalDAV 协议的日历服务 |
| Microsoft 365 用户 | clippy | Outlook 日历和邮件集成 |
| 农场设备调度 | farmos-equipment | 垂直领域，农机维护排期 |

## 推荐指数排名

| 排名 | Skill | 指数 | 一句话点评 |
|------|-------|------|-----------|
| 1 | apple-calendar | ⭐⭐⭐⭐⭐ | macOS 用户首选，零门槛 |
| 2 | gog | ⭐⭐⭐⭐⭐ | Google 生态全能选手 |
| 3 | feishu-calendar | ⭐⭐⭐⭐ | 飞书用户必备 |
| 4 | temporal-cortex-scheduling | ⭐⭐⭐⭐ | 技术含量最高，跨平台调度 |
| 5 | cron-scheduling | ⭐⭐⭐⭐ | 自动化调度基石 |

## 值得关注的其他 Skills

这个分类还有不少有意思的 Skills：

- **advanced-calendar** — 支持自然语言创建事件（"下周三下午 3 点" → 自动解析）
- **apple-reminders** — Apple 提醒事项管理，与 apple-calendar 互补
- **calcurse** — 终端文本界面日历，适合极客玩家
- **meeting-prep** — 会议准备和每日提交摘要
- **morning-email-rollup** — 每日邮件汇总推送
- **islamic-skills** — 伊斯兰祈祷时间和斋月日程

## 安装方式

```bash
# 通过 ClawHub CLI 安装
clawhub install apple-calendar
clawhub install gog
clawhub install feishu-calendar

# 手动安装：将 skill 文件夹复制到
# ~/.openclaw/skills/ 或 <workspace>/skills/
```

## 下期预告

明天我们将介绍 **Clawdbot Tools** 分类——OpenClaw 官方出品的一系列实用工具集。敬请期待！

---

*本文是 OpenClaw Skill 每日推荐系列的第 4 篇，共 30 篇。每天介绍一个分类，帮你发现 OpenClaw 生态中的宝藏 Skills。*
