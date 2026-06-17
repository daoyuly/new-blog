---
title: OpenClaw Skill 每日推荐 - 自托管与自动化
date: 2026-06-17 11:30:00
tags:
  - openclaw
  - skill
  - self-hosted-and-automation
categories:
  - 技术推荐
---

# 🏠 OpenClaw Skill 每日推荐 - 自托管与自动化

> 自托管玩家的终极武器库：33 个 Skill，让你的家庭实验室和自动化工作流如虎添翼。

## 今日分类概述

**自托管与自动化（Self-Hosted & Automation）** 共收录 **33 个 Skill**，覆盖了从工作流编排、文档管理、网络监控到数据备份的全链路自托管场景。如果你是 Homelab 玩家或追求数据主权的开发者，这个分类就是为你量身打造的。

---

## 🌟 精选 Skill 详解

### 1. n8n — 工作流自动化编排

- **GitHub**: [openclaw/skills - n8n](https://github.com/openclaw/skills/tree/main/skills/thomasansems/n8n/SKILL.md)
- **推荐指数**: ⭐⭐⭐⭐⭐

**核心功能**: 通过 API 管理 n8n 工作流和自动化任务。n8n 是开源界最流行的工作流自动化平台之一，类似 Zapier 但完全自托管。

**实用场景**:
- 用自然语言创建复杂的工作流（如"每天抓取 RSS 并发送到 Telegram"）
- 批量激活/停用工作流
- 监控工作流执行状态，异常时自动告警

**技术实现**: 通过 n8n REST API 与本地实例交互，支持工作流的 CRUD 操作和执行历史查询。配合 `n8n-workflow-automation`（另一个 Skill）可以直接生成工作流 JSON。

**代码示例**:
```bash
# 通过 OpenClaw 对话创建工作流
"帮我在 n8n 里建一个工作流：每天早上 8 点从 FreshRSS 拉取未读文章，摘要后发到飞书"
```

---

### 2. Paperless-ngx — 无纸化文档管理

- **GitHub**: [openclaw/skills - paperless-ngx](https://github.com/openclaw/skills/tree/main/skills/oskarstark/paperless-ngx/SKILL.md)
- **推荐指数**: ⭐⭐⭐⭐⭐

**核心功能**: 与 Paperless-ngx 文档管理系统交互，实现文档的搜索、分类和管理。Paperless-ngx 是最流行的自托管文档管理方案。

**实用场景**:
- "帮我找去年所有的水电费账单"
- 自动给新上传的文档打标签和分类
- 按日期范围导出特定类型文档的清单

**技术实现**: 通过 Paperless-ngx 的 REST API 操作，支持全文搜索、标签管理、文档元数据修改等。还有同类的 `paperless` Skill（作者 nickchristensen）提供另一种实现方式。

---

### 3. cron-backup — 定时自动备份

- **GitHub**: [openclaw/skills - cron-backup](https://github.com/openclaw/skills/tree/main/skills/zfanmy/cron-backup/SKILL.md)
- **推荐指数**: ⭐⭐⭐⭐

**核心功能**: 设置定时自动备份任务，支持版本追踪和自动清理。OpenClaw 的 cron 机制天然适合这种周期性任务。

**实用场景**:
- 每日自动备份重要数据库
- 每周备份 OpenClaw workspace 到指定位置
- 自动清理超过 30 天的旧备份，释放存储空间

**技术实现**: 利用 OpenClaw 的 cron 调度能力，配合版本号追踪备份历史。结合 `keepmyclaw`（加密云备份）可实现端到端加密的异地备份。

**代码示例**:
```json
// 在 OpenClaw 中配置备份 cron
{
  "schedule": "0 2 * * *",
  "task": "备份 PostgreSQL 数据库到 /backup/db/，保留最近 7 个版本"
}
```

---

### 4. UniFi — 网络监控与管理

- **GitHub**: [openclaw/skills - unifi](https://github.com/openclaw/skills/tree/main/skills/jmagar/unifi/SKILL.md)
- **推荐指数**: ⭐⭐⭐⭐

**核心功能**: 通过本地网关 API 查询和监控 UniFi 网络设备。Ubiquiti 的 UniFi 系列是 Homelab 玩家的首选网络方案。

**实用场景**:
- "客厅的 AP 还在线吗？信号强度如何？"
- 查看网络流量统计和设备连接状态
- 异常设备告警（如未知设备接入网络）

**技术实现**: 通过 UniFi Controller 的本地 API 交互，无需云依赖。支持查询设备状态、客户端列表、流量统计等。

---

### 5. keepmyclaw — 加密云备份与恢复

- **GitHub**: [openclaw/skills - keepmyclaw](https://github.com/openclaw/skills/tree/main/skills/ryce/keepmyclaw/SKILL.md)
- **推荐指数**: ⭐⭐⭐⭐

**核心功能**: 对 OpenClaw workspace 进行加密后备份到云端，支持一键恢复。数据安全是自托管的底线。

**实用场景**:
- 迁移 OpenClaw 到新设备时一键恢复全部配置
- 异地容灾：workspace 数据加密备份到云存储
- 定期自动备份，防止硬件故障导致数据丢失

**技术实现**: 端到端加密，备份前本地加密再上传，云端只存密文。恢复时下载解密还原。与 `claw-sync`（安全同步）互补——claw-sync 侧重实时同步，keepmyclaw 侧重快照备份。

---

## 📊 推荐指数排名

| 排名 | Skill | 推荐指数 | 一句话点评 |
|------|-------|---------|-----------|
| 🥇 | n8n | ⭐⭐⭐⭐⭐ | 自托管自动化的瑞士军刀 |
| 🥈 | Paperless-ngx | ⭐⭐⭐⭐⭐ | 无纸化办公的终极方案 |
| 🥉 | cron-backup | ⭐⭐⭐⭐ | 简单可靠的定时备份 |
| 4 | UniFi | ⭐⭐⭐⭐ | 网络运维从此开口即达 |
| 5 | keepmyclaw | ⭐⭐⭐⭐ | 加密备份，安心无忧 |

---

## 🎯 应用场景总结

### Homelab 全栈运维
将 n8n + UniFi + cron-backup 组合，用自然语言管理整个家庭实验室：自动化工作流编排、网络监控告警、定时备份保护——全部通过 OpenClaw 对话完成。

### 无纸化办公
Paperless-ngx + FreshRSS（自托管 RSS 阅读器）的组合，文档和资讯一手掌控，再也不用在各种 App 之间跳转。

### 数据安全三板斧
- **实时同步**: claw-sync
- **快照备份**: cron-backup + keepmyclaw
- **完整性校验**: system-integrity-and-backup

### 进阶玩法
- **hydra-evolver**: Proxmox 原生编排，把 Homelab 变成弹性计算集群
- **nas-master**: 华擎 NAS 的混合管理套件（SMB + SSH）
- **nordvpn**: 一句话控制 VPN 连接
- **gotify**: 长任务完成推送通知，再也不用盯着终端

---

> 💡 **实用建议**: 自托管 Skill 通常需要对应服务已在本地运行。建议先部署好核心服务（n8n、Paperless-ngx），再安装对应 Skill，这样体验最流畅。所有 Skill 都可通过 `openclaw skill install` 一键安装。

---

*本文是 OpenClaw Skill 每日推荐系列第 24 篇，明天预告：🛒 购物与电商*
