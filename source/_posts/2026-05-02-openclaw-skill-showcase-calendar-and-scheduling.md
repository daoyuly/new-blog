---
title: OpenClaw Skill 每日推荐 - 日历与调度
date: 2026-05-02 11:30:00
tags: [openclaw, skill, 日历与调度]
categories: [技术推荐]
---

# OpenClaw Skill 每日推荐 - 日历与调度 (Calendar & Scheduling)

> 今日推荐：第 21 个分类，共 65 个 skills

## 分类概述

日历与调度分类是 OpenClaw 生态中非常实用的一类工具，涵盖了从个人时间管理到企业级日程安排的各个方面。无论你是想快速安排会议、同步多平台日历，还是自动化提醒，这个分类都能满足你的需求。

## 🌟 精选 Skill 详解

### 1. google-calendar ⭐⭐⭐⭐⭐

**GitHub**: [openclaw/skills/google-calendar](https://github.com/openclaw/skills/tree/main/skills/adrianmiller99/google-calendar/SKILL.md)

**核心功能**: 与 Google Calendar 完整集成

**技术特点**:
- 通过 Google Calendar API 进行交互
- 支持查看、创建、管理日历事件
- 自然语言输入，智能识别时间地点

**实用场景**:
```bash
# 创建会议
"下周三下午 3 点在 Zoom 开会，邀请 Alice 和 Bob"

# 查看今日日程
"今天还有什么安排？"

# 重新安排时间
"把周五的会议改到下周二上午 10 点"
```

**推荐指数**: ⭐⭐⭐⭐⭐ (最常用的日历工具，生态完善)

---

### 2. feishu-calendar ⭐⭐⭐⭐⭐

**GitHub**: [openclaw/skills/feishu-calendar](https://github.com/openclaw/skills/tree/main/skills/autogame-17/feishu-calendar/SKILL.md)

**核心功能**: 管理飞书（Lark）日历

**技术特点**:
- 深度集成飞书开放平台 API
- 支持中文自然语言处理
- 与飞书协作生态无缝衔接

**实用场景**:
```bash
# 安排团队会议
"明天上午 10 点和产品团队开评审会"

# 创建日程提醒
"提醒我下周一提交周报"

# 查询同事空闲时间
"张三本周三下午有空吗？"
```

**推荐指数**: ⭐⭐⭐⭐⭐ (国内企业必备，中文体验优秀)

---

### 3. calendar-scheduling ⭐⭐⭐⭐⭐

**GitHub**: [openclaw/skills/calendar-scheduling](https://github.com/openclaw/skills/tree/main/skills/billylui/calendar-scheduling/SKILL.md)

**核心功能**: 跨平台日程调度（Google + Outlook + CalDAV）

**技术特点**:
- 多平台统一调度接口
- 智能时间冲突检测
- 跨时区时间转换

**实用场景**:
```bash
# 跨平台创建事件
"下周四上午 9 点同时在 Google 和 Outlook 创建会议"

# 查询所有平台日程
"本周所有平台有什么安排？"

# 同步事件
"把 Google 日历上的会议同步到 Outlook"
```

**推荐指数**: ⭐⭐⭐⭐⭐ (多平台用户福音，统一管理神器)

---

### 4. temporal-cortex-scheduling ⭐⭐⭐⭐

**GitHub**: [openclaw/skills/temporal-cortex-scheduling](https://github.com/openclaw/skills/tree/main/skills/billylui/temporal-cortex-scheduling/SKILL.md)

**核心功能**: 多日历可用性合并与原子预订（2PC）

**技术特点**:
- 多日历实时可用性检测
- 原子性预订（避免双重预订）
- 两阶段提交保证一致性
- 智能时间建议

**实用场景**:
```bash
# 查找多人共同空闲时间
"找到下周一到周三，我们 5 个人都有的 2 小时空闲段"

# 原子预订多个日历
"在大家都有空的时间预订会议，同步更新所有日历"

# 智能时间建议
"这个会议什么时候开最合适？"
```

**推荐指数**: ⭐⭐⭐⭐ (企业团队协作利器，技术实现优雅)

---

### 5. apple-calendar ⭐⭐⭐⭐

**GitHub**: [openclaw/skills/apple-calendar](https://github.com/openclaw/skills/tree/main/skills/tyler6204/apple-calendar/SKILL.md)

**核心功能**: macOS Apple Calendar.app 集成

**技术特点**:
- 直接与 macOS 系统日历交互
- 支持 iCloud 同步
- 原生体验，无额外依赖

**实用场景**:
```bash
# 快速创建事件
"今天下午 2 点和客户开会"

# 查看系统日历
"这个月有哪些重要日程？"

# 设置提醒
"提醒我每周一早上 9 点开例会"
```

**推荐指数**: ⭐⭐⭐⭐ (Mac 用户必备，原生集成流畅)

---

## 🎯 应用场景总结

### 场景 1: 个人时间管理

适合技能：
- `google-calendar` - Google 用户
- `apple-calendar` - Mac 用户
- `apple-reminders` - 需要任务提醒

### 场景 2: 团队协作

适合技能：
- `feishu-calendar` - 使用飞书的企业
- `lark-calendar` - 国际版 Lark 用户
- `office-secretary` - Microsoft 365 企业用户

### 场景 3: 跨平台同步

适合技能：
- `calendar-scheduling` - Google + Outlook + CalDAV
- `caldav-calendar` - 通用 CalDAV 支持
- `fastmail` - Fastmail 生态用户

### 场景 4: 高级调度

适合技能：
- `temporal-cortex-scheduling` - 多人会议协调
- `meeting-prep` - 会议准备和摘要
- `cron-scheduling` - 定时任务调度

## 📊 推荐指数排名

| Skill | 推荐指数 | 适用人群 |
|-------|---------|---------|
| google-calendar | ⭐⭐⭐⭐⭐ | 所有 Google 用户 |
| feishu-calendar | ⭐⭐⭐⭐⭐ | 国内企业用户 |
| calendar-scheduling | ⭐⭐⭐⭐⭐ | 多平台用户 |
| temporal-cortex-scheduling | ⭐⭐⭐⭐ | 团队协作需求 |
| apple-calendar | ⭐⭐⭐⭐ | Mac/iOS 用户 |

## 💡 实用建议

1. **单平台用户**: 直接选择对应平台的 calendar skill
2. **多平台用户**: 优先考虑 `calendar-scheduling` 或 `temporal-cortex-scheduling`
3. **企业团队**: 飞书/Outlook 等企业工具的集成是首选
4. **开发者**: 可以结合 `cron-scheduling` 实现自动化任务

## 🔗 相关资源

- [OpenClaw 官方文档](https://docs.openclaw.ai)
- [Awesome OpenClaw Skills 仓库](https://github.com/openclaw/awesome-openclaw-skills)
- [OpenClaw 社区](https://discord.com/invite/clawd)

---

**明日预告**: 智能家居与物联网 (Smart Home & IoT) - 84 个 skills 等你探索！

> 本文由 OpenClaw 自动生成，每日推荐一个 OpenClaw Skill 分类
