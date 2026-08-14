---
title: OpenClaw Skill 每日推荐 - 自托管与自动化
tags:
  - openclaw
  - skill
  - self-hosted
  - automation
categories:
  - 技术推荐
abbrlink: 58030
date: 2026-08-03 11:30:00
---

# OpenClaw Skill 每日推荐 - 自托管与自动化

> 📅 2026年8月3日 | 分类：Self-Hosted & Automation | 共 33 个 Skills

自托管（Self-Hosted）是技术爱好者和技术发烧友的永恒话题。把数据握在自己手里，把自动化做到极致——这正是 OpenClaw Skills 生态中「自托管与自动化」分类的核心精神。

今天从这个包含 33 个 skill 的分类中，精选 5 个最具代表性的进行深度解读。

---

## 🏆 精选 Skill 详解

### 1. n8n — 工作流自动化管理

| 项目 | 详情 |
|------|------|
| **GitHub** | [thomasansems/n8n](https://github.com/openclaw/skills/tree/main/skills/thomasansems/n8n/SKILL.md) |
| **推荐指数** | ⭐⭐⭐⭐⭐ |

**核心功能：** 通过 API 全面管理 n8n 工作流——列出、创建、激活/停用、执行监控、性能优化，一条龙搞定。

**技术实现：** 基于 Python 的三层架构：
- `n8n_api.py` — 核心 API 客户端，封装所有 REST 操作
- `n8n_tester.py` — 工作流验证与试运行引擎
- `n8n_optimizer.py` — 性能分析与优化建议器

**实用场景：**

```bash
# 列出所有活跃工作流
python3 scripts/n8n_api.py list-workflows --active true --pretty

# 验证工作流结构完整性
python3 scripts/n8n_tester.py validate --id <workflow-id>

# 试运行并生成报告
python3 scripts/n8n_tester.py dry-run --id <workflow-id> --data-file test.json --report

# 性能分析（最近30天）
python3 scripts/n8n_optimizer.py analyze --id <workflow-id> --days 30 --pretty
```

**亮点：** 内置性能评分系统（0-100分），基于成功率（50%权重）、复杂度（30%权重）和瓶颈数量自动计算。90+分是优秀，50分以下需要认真优化了。

**适用人群：** 重度 n8n 用户，特别是需要批量管理工作流和监控执行健康度的自动化玩家。

---

### 2. cron-backup — 定时自动备份

| 项目 | 详情 |
|------|------|
| **GitHub** | [zfanmy/cron-backup](https://github.com/openclaw/skills/tree/main/skills/zfanmy/cron-backup/SKILL.md) |
| **推荐指数** | ⭐⭐⭐⭐⭐ |

**核心功能：** 定时备份 + 版本检测 + 自动清理，三位一体的备份方案。

**技术实现：** 纯 Shell 脚本，零依赖，适合任何 Linux/macOS 环境：
- `backup.sh` — 单次备份，生成带时间戳的 tar.gz
- `backup-versioned.sh` — 版本感知备份，仅在版本变化时执行
- `setup-cron.sh` — Cron 任务配置器
- `cleanup.sh` — 旧备份清理

**实用场景：**

```bash
# 每天凌晨2点备份工作区，保留30天
./scripts/setup-cron.sh daily /home/user/workspace /backups/workspace "0 2 * * *"
./scripts/setup-cron.sh cleanup /backups/workspace "" "0 3 * * *" 30

# 版本感知备份：仅在软件升级时备份
./scripts/backup-versioned.sh /opt/myapp /opt/myapp/version.txt /backups/myapp
```

**亮点：** 版本感知备份是非常巧妙的设计——不再无脑定时备份，而是监控版本号变化，只在真正更新时才执行备份。对于 OpenClaw 这类频繁更新但不需要每次都备份的场景，省时省空间。

**适用人群：** 所有自托管用户。备份是自托管的命脉，这个 skill 让备份变得简单到没有借口不做。

---

### 3. paperless-ngx — 文档管理系统

| 项目 | 详情 |
|------|------|
| **GitHub** | [oskarstark/paperless-ngx](https://github.com/openclaw/skills/tree/main/skills/oskarstark/paperless-ngx/SKILL.md) |
| **推荐指数** | ⭐⭐⭐⭐☆ |

**核心功能：** 通过 REST API 与 Paperless-ngx 交互——搜索、上传、下载、组织文档，管理标签、通讯方和文档类型。

**技术实现：** 基于 curl 的轻量级 HTTP 调用，仅需两个环境变量：
- `PAPERLESS_URL` — 实例地址
- `PAPERLESS_TOKEN` — API 令牌

**实用场景：**

```bash
# 搜索包含"发票"的文档
curl -s "$PAPERLESS_URL/api/documents/?query=invoice" \
  -H "Authorization: Token $PAPERLESS_TOKEN"

# 上传新文档并自动打标签
curl -s "$PAPERLESS_URL/api/documents/post_document/" \
  -H "Authorization: Token $PAPERLESS_TOKEN" \
  -F "document=@/path/to/file.pdf" \
  -F "title=水电费发票 2026年7月" \
  -F "tags=3" \
  -F "correspondent=1"

# 批量给多个文档添加标签
curl -s -X POST "$PAPERLESS_URL/api/documents/bulk_edit/" \
  -H "Authorization: Token $PAPERLESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"documents": [1, 2, 3], "method": "add_tag", "parameters": {"tag": 5}}'
```

**亮点：** 纯 curl 实现，不需要额外安装任何运行时。配合 OpenClaw 的自然语言能力，可以直接说"帮我找去年的发票"就能查到。

**适用人群：** 已部署 Paperless-ngx 的用户，特别是想用 AI 对接文档库实现智能检索和归档的。

---

### 4. unifi — 网络监控仪表盘

| 项目 | 详情 |
|------|------|
| **GitHub** | [jmagar/unifi](https://github.com/openclaw/skills/tree/main/skills/jmagar/unifi/SKILL.md) |
| **推荐指数** | ⭐⭐⭐⭐☆ |

**核心功能：** 只读监控 UniFi 网络——设备状态、在线客户端、网络健康、流量分析、告警事件。

**技术实现：** Shell 脚本 + curl + jq，通过 UniFi OS 本地网关 API 获取数据。所有操作都是 GET 请求，安全无副作用。

**实用场景：**

```bash
# 一句话查看网络全貌
bash scripts/dashboard.sh

# 谁在蹭网？
bash scripts/clients.sh

# 带宽被什么吃掉了？
bash scripts/top-apps.sh 15

# 最近有什么告警？
bash scripts/alerts.sh 50
```

**亮点：** 全部只读操作，不用担心误配置网络。Dashboard 模式一键输出全局面板——设备、客户端、健康状态、DPI 流量、告警，一目了然。配合 OpenClaw 可以实现"网络异常自动通知"。

**适用人群：** UniFi 网络用户（Cloud Gateway Max 等设备），想要 AI 驱动的网络监控体验。

---

### 5. keepmyclaw — OpenClaw 灾难恢复

| 项目 | 详情 |
|------|------|
| **GitHub** | [ryce/keepmyclaw](https://github.com/openclaw/skills/tree/main/skills/ryce/keepmyclaw/SKILL.md) |
| **推荐指数** | ⭐⭐⭐⭐⭐ |

**核心功能：** OpenClaw Agent 的加密异地备份与一键恢复——工作区、记忆、Skills、Cron 任务、凭证、多 Agent 配置，全部备份到 Cloudflare R2。

**技术实现：**
- AES-256 零知识加密（本地加密后上传，服务端无法解密）
- Cloudflare R2 存储后端
- Agent 驱动的设置流程（人类只需点一个支付链接）
- 支持多 Agent 共享一个账户（最多 100 个 Agent）

**实用场景：**

```bash
# 一键备份
bash scripts/backup.sh

# 一键恢复（最新备份）
bash scripts/restore.sh

# 恢复到新机器的完整流程
# 1. 安装 OpenClaw
# 2. 配置 keepmyclaw
# 3. 恢复 passphrase
# 4. bash scripts/restore.sh
# 5. openclaw gateway restart
```

**亮点：** 这不是普通的文件备份——它备份的是 Agent 的"灵魂"：工作区文件（记忆、人格、技能）、Cron 任务（习惯）、凭证（身份）、多 Agent 配置（社交关系）。换台机器，一条命令就能让你的 Agent 完整复活。

**备份内容清单：**
- ✅ `~/.openclaw/workspace/` — 所有工作区文件
- ✅ `~/.openclaw/openclaw.json` — Agent 配置
- ✅ `~/.openclaw/credentials/` — 认证令牌
- ✅ `~/.openclaw/cron/jobs.json` — 定时任务
- ✅ `~/.openclaw/agents/` — 多 Agent 配置
- ❌ 不备份二进制文件（可重装）、运行时状态（可重建）

**适用人群：** 所有 OpenClaw 用户。你的 Agent 积累了大量记忆和配置，一旦丢失从头来过非常痛苦。这个 skill 就是保险。

---

## 📊 推荐指数排名

| 排名 | Skill | 推荐指数 | 一句话点评 |
|------|-------|---------|-----------|
| 1 | n8n | ⭐⭐⭐⭐⭐ | 自动化工作流的指挥中心，功能最全面 |
| 2 | cron-backup | ⭐⭐⭐⭐⭐ | 备就该做的事变成简单的事，零依赖 |
| 3 | keepmyclaw | ⭐⭐⭐⭐⭐ | Agent 的"存档点"，灾难恢复必备 |
| 4 | paperless-ngx | ⭐⭐⭐⭐☆ | 文档管理利器，纯 curl 轻量实现 |
| 5 | unifi | ⭐⭐⭐⭐☆ | 网络监控一目了然，只读安全 |

---

## 🎯 应用场景总结

### 场景一：家庭实验室全面自动化

```
n8n 编排工作流 → cron-backup 定时备份关键数据
                 ↓
           keepmyclaw 异地加密备份 Agent 状态
                 ↓
           unifi 监控网络健康 → 异常时 n8n 触发通知
```

### 场景二：无纸化办公

```
paperless-ngx 管理所有文档
       ↓
OpenClaw 自然语言搜索："找去年的水电费发票"
       ↓
n8n 自动归档新文档到 paperless-ngx
```

### 场景三：灾难恢复

```
机器故障 → keepmyclaw 一键恢复 Agent
       ↓
cron-backup 恢复本地数据备份
       ↓
unifi 验证网络配置 → 一切回到正轨
```

---

## 💡 实用建议

1. **备份策略分层：** cron-backup 负责本地高频备份，keepmyclaw 负责异地加密备份。两者互补，不怕硬盘坏也不怕整台机器挂。

2. **n8n + OpenClaw 组合拳：** 用 OpenClaw 的自然语言能力驱动 n8n 工作流管理。说"检查一下哪些工作流最近失败了"，比手动翻 API 爽太多。

3. **Paperless-ngx 配合 OCR：** 上传文档后 Paperless-ngx 会自动 OCR，配合 OpenClaw 可以实现"帮我找包含某某关键词的扫描件"。

4. **UniFi 监控自动化：** 把 unifi 的 dashboard 检查加入 cron 任务，每天早上自动输出网络健康报告。

5. **安全第一：** 所有自托管服务务必配置好认证，API token 定期轮换，别把管理界面暴露在公网。

---

## 📌 分类全览

本分类共 33 个 skill，除了精选的 5 个之外，还有这些值得关注：

- **casual-cron** — 自然语言创建 cron 任务
- **claw-sync** — OpenClaw 记忆和工作区安全同步
- **gotify** — 任务完成后推送通知
- **hydra-evolver** — Proxmox 原生编排工具
- **mongodb-atlas-admin** — MongoDB Atlas 集群管理
- **nas-master** — ASUSTOR NAS 元数据管理
- **pinme** — 一键部署静态网站到 IPFS
- **nordvpn** — Linux 上控制 NordVPN

---

*明天预告：shopping-and-e-commerce — 购物与电商分类，看看 OpenClaw 如何帮你聪明地购物。*

> 🔗 更多 OpenClaw Skills: [awesome-openclaw-skills](https://github.com/openclaw/skills)
> 🏠 OpenClaw 官网: [openclaw.ai](https://openclaw.ai)
