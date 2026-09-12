---
title: OpenClaw Skill 每日推荐 - 自托管与自动化
date: 2026-09-12 11:30:00
tags:
  - openclaw
  - skill
  - self-hosted
  - automation
categories:
  - 技术推荐
---

# OpenClaw Skill 每日推荐 - 自托管与自动化

> 第 25 期 | 2026-09-12 | 分类：Self-Hosted & Automation
> 
> 探索 OpenClaw 生态中最实用的自托管与自动化技能，让你的智能家居和 homelab 更智能。

## 今日分类概述

**Self-Hosted & Automation** 分类共收录 **33 个技能**，涵盖工作流自动化、文档管理、备份策略、网络监控、NAS 管理等多个方向。这是 OpenClaw 生态中实用性最强的分类之一——对于任何运行 homelab 或自托管服务的用户来说，这里几乎是必装的技能集合。

该分类的核心主题包括：
- 🔁 **工作流自动化**：n8n 集成、cron 任务管理
- 📄 **文档管理**：Paperless-ngx 等自托管文档系统
- 💾 **备份与同步**：加密备份、工作区同步
- 🌐 **网络监控**：UniFi 网络设备管理
- 🏠 **智能家居**：NAS 管理、静态文件托管

---

## 精选 Skill 详解

### 1. n8n — 工作流自动化引擎管理

| 项目 | 详情 |
|------|------|
| **GitHub** | [openclaw/skills - thomasansems/n8n](https://github.com/openclaw/skills/tree/main/skills/thomasansems/n8n/SKILL.md) |
| **核心功能** | 通过 API 管理 n8n 工作流和自动化任务 |
| **推荐指数** | ⭐⭐⭐⭐⭐ |

**功能详解**

n8n 是自托管领域最流行的开源工作流自动化工具之一，类似 Zapier 的替代品。这个技能让 OpenClaw 直接通过 API 与 n8n 实例交互，实现工作流的创建、修改、激活和监控。

**实用场景**
- 当 OpenClaw 检测到某个条件触发时，自动启动 n8n 工作流（如发送通知、同步数据）
- 用自然语言描述自动化需求，让 OpenClaw 在 n8n 中创建对应工作流
- 监控工作流执行状态，失败时自动重试或通知

**技术实现**
- 通过 n8n REST API 进行通信
- 支持工作流 JSON 的创建和修改
- 需要 n8n 实例的 API Key 和 URL 配置

```yaml
# 配置示例
N8N_BASE_URL: http://localhost:5678
N8N_API_KEY: your-api-key-here
```

**为什么推荐？** n8n + OpenClaw 的组合堪称自托管自动化的黄金搭档。OpenClaw 负责理解意图和决策，n8n 负责执行具体的工作流，两者互补性极强。

---

### 2. cron-backup — 定时备份与版本管理

| 项目 | 详情 |
|------|------|
| **GitHub** | [openclaw/skills - zfanmy/cron-backup](https://github.com/openclaw/skills/tree/main/skills/zfanmy/cron-backup/SKILL.md) |
| **核心功能** | 设置定时自动备份，支持版本追踪和自动清理 |
| **推荐指数** | ⭐⭐⭐⭐⭐ |

**功能详解**

备份是自托管的命脉。cron-backup 技能为 OpenClaw 提供了完整的备份管理能力：定时调度、版本追踪、存储清理，一条龙服务。

**实用场景**
- 每日备份 OpenClaw 工作区和配置文件到指定目录
- 每周备份数据库快照到远程存储
- 自动清理超过 30 天的旧备份，避免磁盘空间耗尽
- 备份完成后发送通知

**技术实现**
- 基于 cron 调度系统
- 支持增量备份和全量备份
- 版本追踪机制，可回滚到任意历史版本
- 自动清理策略基于时间和数量

```bash
# OpenClaw 对话示例
用户: "帮我设置每天凌晨 3 点备份 OpenClaw 工作区到 /backup/openclaw，保留最近 30 天"
来顺: "已创建备份任务：
  - 调度: 每日 03:00
  - 源: ~/.openclaw/workspace
  - 目标: /backup/openclaw
  - 保留策略: 30 天
  - 版本追踪: 已启用"
```

**为什么推荐？** 数据无价。对于任何自托管用户来说，自动化备份都是第一要务。这个技能把复杂的备份策略简化为一句自然语言指令。

---

### 3. paperless-ngx — 文档管理系统集成

| 项目 | 详情 |
|------|------|
| **GitHub** | [openclaw/skills - oskarstark/paperless-ngx](https://github.com/openclaw/skills/tree/main/skills/oskarstark/paperless-ngx/SKILL.md) |
| **核心功能** | 与 Paperless-ngx 文档管理系统交互 |
| **推荐指数** | ⭐⭐⭐⭐ |

**功能详解**

Paperless-ngx 是自托管领域最流行的文档管理系统（DMS），用于扫描、OCR、归档和检索各类文档。这个技能让 OpenClaw 成为你私人文档库的智能管家。

**实用场景**
- "帮我找一下去年的水电费账单" → OpenClaw 查询 Paperless-ngx 返回匹配文档
- 自动给新上传的文档打标签和分类
- 批量导出某个类别的所有文档
- 检查是否有未分类的文档待处理

**技术实现**
- 通过 Paperless-ngx REST API 交互
- 支持文档搜索、过滤、标签管理
- 可配合 OCR 结果进行语义搜索

```python
# 典型 API 调用流程
# 1. 搜索文档
GET /api/documents/?query=水电费&created__gte=2025-01-01

# 2. 更新标签
PATCH /api/documents/{id}/
{"tags": [1, 3, 5]}
```

**为什么推荐？** 纸质文档数字化后，最大的痛点不是扫描而是检索。有了 OpenClaw + Paperless-ngx，你可以用自然语言查询文档库，大幅降低文档管理门槛。

---

### 4. keepmyclaw — OpenClaw 工作区加密备份

| 项目 | 详情 |
|------|------|
| **GitHub** | [openclaw/skills - ryce/keepmyclaw](https://github.com/openclaw/skills/tree/main/skills/ryce/keepmyclaw/SKILL.md) |
| **核心功能** | OpenClaw 工作区的加密云备份与恢复 |
| **推荐指数** | ⭐⭐⭐⭐ |

**功能详解**

与 cron-backup 不同，keepmyclaw 专注于 OpenClaw 自身的工作区备份——包括 SOUL.md、IDENTITY.md、记忆文件、技能配置等核心数据。它支持端到端加密，确保你的 AI 助手"灵魂"安全存储在云端。

**实用场景**
- 迁移到新设备时一键恢复 OpenClaw 完整状态
- 定期加密备份到云存储（S3、Backblaze B2 等）
- 多设备间同步 OpenClaw 工作区
- 灾难恢复：设备丢失后从云端恢复

**技术实现**
- AES-256 加密上传
- 支持多种云存储后端
- 增量同步机制
- 恢复时自动验证完整性

```bash
# 备份
openclaw skill keepmyclaw backup

# 恢复
openclaw skill keepmyclaw restore --date 2026-09-10

# 验证
openclaw skill keepmyclaw verify
```

**为什么推荐？** OpenClaw 的工作区包含了你的个性化配置、记忆和身份信息——这些是不可替代的。keepmyclaw 确保即使硬件故障，你的 AI 助手也能"重生"。

---

### 5. unifi — UniFi 网络监控与管理

| 项目 | 详情 |
|------|------|
| **GitHub** | [openclaw/skills - jmagar/unifi](https://github.com/openclaw/skills/tree/main/skills/jmagar/unifi/SKILL.md) |
| **核心功能** | 通过本地网关 API 查询和监控 UniFi 网络 |
| **推荐指数** | ⭐⭐⭐⭐ |

**功能详解**

Ubiquiti 的 UniFi 是 homelab 社区最流行的网络设备管理平台。这个技能让 OpenClaw 直接与 UniFi 控制器通信，实现网络状态的实时监控和查询。

**实用场景**
- "现在有多少设备连着 WiFi？" → 即时查询在线设备列表
- 监控网络流量异常，自动发送告警
- 查询某个设备的连接历史和带宽使用
- 当新设备接入网络时自动通知

**技术实现**
- 通过 UniFi Controller API 通信
- 支持本地部署和 UniFi Cloud
- 查询设备状态、客户端列表、流量统计

```bash
# 查询示例
# 在线客户端
GET /proxy/network/api/s/default/stat/sta

# 设备状态
GET /proxy/network/api/s/default/stat/device

# 健康状态
GET /proxy/network/api/s/default/stat/health
```

**为什么推荐？** 网络是自托管的基础设施。能用自然语言查询网络状态，比打开 UniFi 管理界面点击层层菜单高效得多。

---

## 应用场景总结

### 场景一：全自动化 Homelab 运维

```
用户: "检查一下家里的网络状况，然后备份今天的配置变化"
  ↓
OpenClaw (unifi): 查询 UniFi 网络 → 12 台设备在线，1 台异常
OpenClaw (cron-backup): 触发配置备份 → 已保存到 /backup/2026-09-12/
OpenClaw (gotify): 推送通知到手机 → "网络检查完成，发现 1 台异常设备"
```

### 场景二：智能文档归档

```
用户: "把刚收到的发票归档到 Paperless"
  ↓
OpenClaw (paperless-ngx): 上传文档 → OCR 识别 → 自动分类为"发票"
OpenClaw (n8n): 触发工作流 → 记录到 Google Sheets → 发送确认邮件
```

### 场景三：灾难恢复

```
用户: "MacBook 进水了，新电脑到了"
  ↓
OpenClaw (keepmyclaw): 从云端恢复工作区 → 验证完整性 → 恢复完成
用户: "感觉什么都没变"
来顺: "因为什么都没丢。"
```

---

## 推荐指数排名

| 排名 | Skill | 推荐指数 | 适用人群 |
|------|-------|---------|---------|
| 1 | n8n | ⭐⭐⭐⭐⭐ | 所有自动化用户 |
| 2 | cron-backup | ⭐⭐⭐⭐⭐ | 所有自托管用户 |
| 3 | paperless-ngx | ⭐⭐⭐⭐ | 文档管理需求者 |
| 4 | keepmyclaw | ⭐⭐⭐⭐ | 所有 OpenClaw 用户 |
| 5 | unifi | ⭐⭐⭐⭐ | UniFi 网络用户 |

---

## 其他值得关注

本分类还有几个值得留意的技能：

- **claw-sync** — OpenClaw 记忆和工作区的安全同步，多设备用户的福音
- **casual-cron** — 用自然语言创建 cron 任务，告别 crontab 语法
- **nas-master** — ASUSTOR NAS 管理，混合 SMB + SSH 的硬件感知套件
- **gotify** — 自托管推送通知，长任务完成时通知手机
- **pinme** — 一键部署静态网站到 IPFS，去中心化托管

---

## 安装方式

```bash
# 通过 ClawHub 安装
clawhub install n8n
clawhub install cron-backup
clawhub install paperless-ngx
clawhub install keepmyclaw
clawhub install unifi

# 或批量安装
clawhub install n8n cron-backup paperless-ngx keepmyclaw unifi
```

---

> 📅 **明日预告**：Shopping & E-commerce — 购物与电商技能，让 OpenClaw 帮你比价、下单、追踪物流。
> 
> 📊 **进度**：25/30 分类已完成展示，还剩 5 个分类。
