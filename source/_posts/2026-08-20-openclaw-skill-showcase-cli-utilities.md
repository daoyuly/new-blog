---
title: OpenClaw Skill 每日推荐 - CLI Utilities
tags:
  - openclaw
  - skill
  - cli-utilities
categories:
  - 技术推荐
abbrlink: 51786
date: 2026-08-20 11:30:00
---

# OpenClaw Skill 每日推荐 - CLI Utilities（CLI 工具）

> 📅 Day 6/30 | 分类：CLI Utilities | 共 180 个 Skills

CLI 工具是 OpenClaw 生态中最庞大的分类之一，足足 180 个 Skills。这些 Skill 让你的 AI 助手能够直接操作命令行工具——从系统管理、网络控制到安全认证，几乎所有能在终端完成的事情都可以封装成 Skill。今天精选 5 个最实用的 CLI 工具，涵盖**安全认证、系统备份、智能限流、摄像头控制、上下文压缩**五个方向。

---

## 🏆 精选 Skill 详解

### 1. TOTP - 二次验证安全守卫

**GitHub:** [diegofcornejo/totp](https://github.com/openclaw/skills/tree/main/skills/diegofcornejo/totp/SKILL.md)

**核心功能：** 基于 TOTP（Time-based One-Time Password）的 OTP 验证系统，为敏感操作提供二次认证保护。

**实用场景：**
- 修改环境变量、重启 Gateway 前需要 OTP 验证
- 删除备份、修改关键配置时增加安全层
- 任何需要"人在回路"确认的高危操作

**技术实现：** 遵循 RFC 6238 标准，使用共享密钥生成 6 位时间同步验证码，30 秒有效期。Agent 在执行敏感操作前先要求用户提供 TOTP 码，验证通过后才继续。

**推荐指数：** ⭐⭐⭐⭐⭐

> 💡 **实用建议：** 配合 OpenClaw 的 cron 任务使用，在定时执行的高危操作（如自动备份清理）前插入 TOTP 验证，避免误操作。

---

### 2. Restic Home Backup - 家目录加密备份方案

**GitHub:** [moep90/restic-home-backup](https://github.com/openclaw/skills/tree/main/skills/moep90/restic-home-backup/SKILL.md)

**核心功能：** 设计、实施和管理 Linux 家目录的加密备份，支持 systemd 自动化。

**实用场景：**
- 服务器/工作站数据定期加密备份
- 多台机器统一备份策略管理
- 灾难恢复方案设计与验证

**技术实现：** 基于 [restic](https://restic.net/) 备份工具，支持增量备份、去重压缩、客户端加密。通过 systemd timer 实现定时自动备份，集成 `restic forget` 策略管理快照保留周期。

```bash
# 初始化加密仓库
restic init --repo /mnt/backup/home

# 创建备份
restic backup ~/Documents --tag daily

# 查看快照
restic snapshots --repo /mnt/backup/home

# 恢复指定快照
restic restore latest --target /tmp/restore
```

**推荐指数：** ⭐⭐⭐⭐⭐

> 💡 **实用建议：** 搭配远程存储后端（S3、B2、SFTP）使用，实现 3-2-1 备份策略。Skill 自带 systemd 集成，配置好后完全免维护。

---

### 3. Agent Rate Limiter - API 限流守护者

**GitHub:** [theagentwire/agent-rate-limiter](https://github.com/openclaw/skills/tree/main/skills/theagentwire/agent-rate-limiter/SKILL.md)

**核心功能：** 自动限流和指数退避，防止 API 调用触发 429 错误。

**实用场景：**
- 多 Skill 并发调用同一 API 提供商
- 处理有严格速率限制的第三方服务（如 OpenAI、Anthropic）
- 生产环境 Agent 部署的稳定性保障

**技术实现：** 基于令牌桶算法实现分层限流。自动检测 API 返回的 `Retry-After` 头，按指数退避策略调整请求间隔。支持按 API 提供商配置不同的限流等级和并发上限。

```
请求流入 → 令牌桶检查 → 有令牌 → 立即执行
              ↓ 无令牌
         等待补充 → 重试 → 429 检测 → 指数退避 → 重新排队
```

**推荐指数：** ⭐⭐⭐⭐

> 💡 **实用建议：** 如果你的 Agent 频繁触发 429 错误，安装这个 Skill 可以显著提升稳定性。尤其适合使用多模型路由的场景。

---

### 4. Camsnap - RTSP/ONVIF 摄像头快照

**GitHub:** [steipete/camsnap](https://github.com/openclaw/skills/tree/main/skills/steipete/camsnap/SKILL.md)

**核心功能：** 从 RTSP/ONVIF 协议摄像头捕获画面帧或视频片段。

**实用场景：**
- 智能家居安防：定时抓拍门口/庭院摄像头
- 宠物监控：上班时查看家中宠物状态
- 结合 AI 视觉分析：抓拍后自动识别人脸/包裹/异常

**技术实现：** 通过 FFmpeg 后端连接 RTSP 流，支持单帧抓拍和片段录制。ONVIF 协议用于自动发现摄像头能力和 PTZ 控制。输出为标准图片格式，可直接传递给 OpenClaw 的 image 分析工具。

```bash
# 抓拍单帧
camsnap --camera front-door --output /tmp/snap.jpg

# 录制 10 秒片段
camsnap --camera living-room --duration 10 --output /tmp/clip.mp4
```

**推荐指数：** ⭐⭐⭐⭐

> 💡 **实用建议：** 搭配 OpenClaw 的 Heartbeat 机制，每 5 分钟自动抓拍前门摄像头，然后用 image 工具分析是否有异常包裹或陌生人。一个完整的 DIY 安防方案就成型了。

---

### 5. Context Compactor - 上下文压缩器

**GitHub:** [emberdesire/context-compactor](https://github.com/openclaw/skills/tree/main/skills/emberdesire/context-compactor/SKILL.md)

**核心功能：** 基于 Token 计数的上下文压缩，专为不报告上下文限制的本地模型设计。

**实用场景：**
- 使用 MLX、llama.cpp、Ollama 等本地推理引擎
- 长对话场景下自动压缩历史消息
- 降低 Token 消耗，节省推理成本

**技术实现：** 监控对话历史的 Token 计数，当接近模型上下文窗口阈值时自动触发压缩。压缩策略包括：摘要旧消息、移除冗余工具调用输出、保留最近 N 轮对话原文。支持自定义压缩触发阈值和保留策略。

```
对话持续 → Token 计数监控 → 超过阈值？
                            ↓ 是
                     旧消息 → AI 摘要压缩
                     工具输出 → 精简/移除
                     最近对话 → 保留原文
                            ↓
                     重建上下文窗口
```

**推荐指数：** ⭐⭐⭐⭐

> 💡 **实用建议：** 如果你用 OpenClaw 跑本地模型（如 Llama 3、Qwen），这个 Skill 是必备的。它能有效避免上下文溢出导致的"失忆"问题。

---

## 📊 推荐指数排名

| 排名 | Skill | 评分 | 一句话推荐 |
|:---:|:---|:---:|:---|
| 1 | TOTP | ⭐⭐⭐⭐⭐ | 敏感操作必备的安全锁 |
| 2 | Restic Home Backup | ⭐⭐⭐⭐⭐ | 系统管理员的数据保险 |
| 3 | Agent Rate Limiter | ⭐⭐⭐⭐ | API 稳定性守护者 |
| 4 | Camsnap | ⭐⭐⭐⭐ | 摄像头一键变 AI 眼睛 |
| 5 | Context Compactor | ⭐⭐⭐⭐ | 本地模型的续命丹 |

---

## 🎯 应用场景总结

CLI Utilities 分类的 180 个 Skills 覆盖了以下核心领域：

| 领域 | 代表 Skills | 适用人群 |
|:---|:---|:---|
| **安全认证** | TOTP, ClawPrint, Agent Hardening | 所有用户，特别是生产环境 |
| **系统运维** | Restic Backup, WOL-Sleep-PC, Entr | 系统管理员、自托管爱好者 |
| **API 管理** | Rate Limiter, Smart Cache, Endpoints | Agent 开发者、API 重度用户 |
| **IoT/硬件** | Camsnap, Airfoil, Shelly | 智能家居玩家 |
| **上下文管理** | Context Compactor, Arc Memory Pruner | 本地模型用户 |
| **金融工具** | Kraken, DeFi Sniper, Stock Watcher | 加密货币/股票投资者 |
| **通信集成** | Gmail, Nostr, Telnyx Voice | 需要多渠道通信的用户 |

---

## 💡 今日建议

1. **安全优先：** 如果你只安装一个 Skill，选 TOTP。给高危操作加一把锁，成本几乎为零。
2. **备份不是可选的：** Restic Home Backup 配合 systemd timer，10 分钟配置，终身受益。
3. **本地模型用户看过来：** Context Compactor + Arc Memory Pruner 组合使用，能让你的本地模型体验提升一个档次。
4. **探索更多：** 180 个 Skills 不可能一一介绍，建议直接浏览 [Awesome OpenClaw Skills](https://github.com/VoltAgent/awesome-clawdbot-skills) 仓库，按需安装。

---

> 📌 明日预告：**Coding Agents & IDEs** 分类的 Skills 推荐，敬请期待！
>
> 🏷️ 本文是 [OpenClaw Skill 每日推荐系列](https://www.daoyuly.cn/tags/openclaw/) 的第 6 篇，共 30 篇。
