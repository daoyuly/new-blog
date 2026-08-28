---
title: OpenClaw Skill 每日推荐 - Clawdbot Tools
tags:
  - openclaw
  - skill
  - clawdbot-tools
categories:
  - 技术推荐
abbrlink: 12808
date: 2026-08-19 11:30:00
---

# OpenClaw Skill 每日推荐 - Clawdbot Tools 🔧

> 第 5/30 期 | 2026-08-19 | 分类：Clawdbot Tools
> 共 36 个 Skills 精选 5 个详解

## 📋 今日分类概述

**Clawdbot Tools** 是 OpenClaw 生态中最核心的工具分类之一，包含 **36 个 Skills**，涵盖了 Agent 构建、安全审计、多实例同步、第三方 API 集成等关键能力。如果说其他分类是让 Agent "做更多事"，那 Clawdbot Tools 就是让 Agent "更好地做事"——它是基础设施层，是 Agent 的操作系统。

这个分类的 Skills 可以分为几个方向：

| 方向 | 代表 Skills | 用途 |
|------|------------|------|
| Agent 构建 | agent-builder, agents-manager | 设计和管理 Agent |
| 安全防护 | clawdbot-security-check, clawdefender | 审计和防护 |
| 多实例协作 | clawdbot-sync, clawdlink | 同步和通信 |
| API 集成 | pipedream-connect, zapier-mcp | 连接外部服务 |
| 体验增强 | claw-face, clawd-presence, gamification-xp | 界面和游戏化 |

---

## 🏆 精选 Skill 详解

### 1. Agent Builder — Agent 构建器 ⭐⭐⭐⭐⭐

**GitHub:** [openclaw/skills - agent-builder](https://github.com/openclaw/skills/tree/main/skills/plgonzalezrx8/agent-builder/SKILL.md)

**核心功能：** 端到端设计并生成完整的 OpenClaw Agent 工作空间，包括 SOUL.md、IDENTITY.md、AGENTS.md、USER.md、HEARTBEAT.md 等全套配置文件。

**工作流程：**

```
Phase 1: 访谈 → 了解 Agent 的使命、渠道、自治级别
Phase 2: 生成 → 创建全套工作空间文件
Phase 3: 护栏 → 确保安全边界和操作规则
Phase 4: 验收 → 提供 5-10 个场景测试
```

**实用场景：**

- 需要快速创建一个新 Agent（如客服 Agent、监控 Agent）
- 迭代优化现有 Agent 的行为规则和护栏
- 为不同项目定制不同人格的 Agent

**技术实现：**

Agent Builder 采用四阶段工作流。访谈阶段会询问 7 个关键问题：

1. **使命声明** — Agent 的核心任务是什么？
2. **渠道** — Telegram / WhatsApp / Discord / iMessage？
3. **自治级别** — 顾问 / 操作员 / 自动驾驶？
4. **禁止事项** — 哪些操作绝对不能做？
5. **记忆策略** — 是否维护 MEMORY.md？
6. **语气风格** — 简洁 vs 叙事，严谨 vs 温暖？
7. **工具策略** — 工具优先 vs 回答优先？

生成阶段使用模板引擎，但所有内容都会根据访谈答案定制。护栏阶段确保包含：破坏性操作前必须询问、外部消息前必须确认、CLI 错误时停止等安全规则。

```bash
# 安装后直接在对话中触发
# OpenClaw 会自动识别意图并启动构建流程
"帮我创建一个新的客服 Agent，负责 Telegram 渠道"
```

**推荐指数：** ⭐⭐⭐⭐⭐

> **点评：** 这是 OpenClaw 生态的「元 Skill」——用 Skill 来创建 Skill 的使用者。对于任何想要认真使用 OpenClaw 的人来说，这是第一个应该安装的 Skill。

---

### 2. Clawdbot Security Check — 安全审计框架 ⭐⭐⭐⭐⭐

**GitHub:** [TheSethRose/Clawdbot-Security-Check](https://github.com/TheSethRose/Clawdbot-Security-Check)

**核心功能：** 对 OpenClaw 实例进行全面的只读安全审计，覆盖 13 个安全域，从网关暴露到凭据存储，逐项检查并提供修复建议。

**13 个安全域一览：**

| 严重级别 | 安全域 | 检查内容 |
|---------|--------|---------|
| 🔴 关键 | 网关暴露 | 绑定地址、认证配置 |
| 🔴 关键 | 凭据安全 | 文件权限、存储方式 |
| 🟠 高危 | DM 策略 | 谁能直接消息 Agent |
| 🟠 高危 | 群组访问 | 群组白名单、提及门控 |
| 🟠 高危 | 浏览器控制 | 远程控制认证 |
| 🟠 高危 | 网络暴露 | 公网绑定、代理配置 |
| 🟡 中危 | 工具沙箱 | 工具访问限制 |
| 🟡 中危 | 文件权限 | 配置文件权限 |
| 🟡 中危 | 插件信任 | 插件白名单 |
| 🟡 中危 | 日志脱敏 | 敏感信息脱敏 |
| 🟡 中危 | 提示注入 | 非信任内容包裹 |
| 🟡 中危 | 危险命令 | 命令黑名单 |
| 🟡 中危 | 密钥扫描 | detect-secrets 配置 |

**实用场景：**

```bash
# 标准审计
clawdbot security audit

# 深度审计（所有检查项）
clawdbot security audit --deep

# 审计并自动修复
clawdbot security audit --fix
```

审计报告格式示例：

```
═══════════════════════════════════════════
🔒 CLAWDBOT SECURITY AUDIT
═══════════════════════════════════════════
┌─ SUMMARY ────────────────────────────────
│ 🔴 Critical:  2
│ 🟠 High:      3
│ 🟡 Medium:    4
│ ✅ Passed:    8
└──────────────────────────────────────────
```

**技术实现：**

这个 Skill 的设计理念是 **"通过透明实现安全"**（Security through transparency）。它不依赖静态脚本，而是将安全框架知识嵌入到 Agent 中，让 Agent 动态地应用框架来检测漏洞。信任层级分为四级：Owner（完全信任）→ AI（信任但验证）→ Allowlist（有限信任）→ Strangers（默认拒绝）。

还包含完整的事件响应流程：遏制 → 轮换 → 审查。

**推荐指数：** ⭐⭐⭐⭐⭐

> **点评：** 运行一个有 shell 权限的 AI Agent，安全不是可选项。这个 Skill 应该是安装 OpenClaw 后的第一个安装项。13 个安全域的覆盖非常全面，而且 `--fix` 模式可以自动修复常见问题。

---

### 3. Clawdbot Sync — 多实例同步 ⭐⭐⭐⭐

**GitHub:** [openclaw/skills - clawdbot-sync](https://github.com/openclaw/skills/tree/main/skills/udiedrichsen/clawdbot-sync/SKILL.md)

**核心功能：** 通过 SSH/rsync 在多个 OpenClaw 实例之间双向同步记忆、偏好和 Skills，支持 Tailscale 节点发现。

**同步范围：**

| 同步项 | 默认 | 说明 |
|--------|------|------|
| `memory/` | ✅ | 所有记忆文件 |
| `MEMORY.md` | ✅ | 主记忆文件 |
| `USER.md` | ✅ | 用户画像 |
| `IDENTITY.md` | ❌ | 各实例保持独立身份 |
| `skills/` | ⚙️ 可选 | 已安装的 Skills |
| `config/` | ❌ | 实例特定配置 |

**实用场景：**

- **多设备办公：** Mac 上的 Agent 和服务器上的 Agent 共享记忆
- **团队协作：** 多个 Agent 实例协同工作，共享用户偏好
- **备份冗余：** 定期同步确保记忆不会单点丢失

**使用方式：**

```bash
# 添加同步节点
/sync add mac-mini 100.95.193.55 clawdbot /Users/clawdbot/clawd

# 查看同步状态
/sync status

# 执行双向同步
/sync now mac-mini

# 预览变更（dry-run）
/sync diff mac-mini
```

同步示例输出：

```
🔄 Syncing with mac-mini (100.95.193.55)...

     📤 Pushing: 3 files changed
     • memory/streaming-buddy/preferences.json
     • memory/2026-01-26.md
     • MEMORY.md
     
     📥 Pulling: 1 file changed
     • memory/2026-01-25.md
     
     ✅ Sync complete! 4 files synchronized.
```

**技术实现：**

- 使用 **rsync** 进行高效增量文件同步
- 通过 **SSH** 加密传输，密钥认证
- 冲突解决策略：时间戳优先（新文件胜出）+ 日志合并（追加型文件自动合并）
- 支持 Tailscale 节点发现，也支持直连
- 可选的心跳自动同步模式

**推荐指数：** ⭐⭐⭐⭐

> **点评：** 对于在多台设备上运行 OpenClaw 的用户来说，这是刚需。设计合理——IDENTITY.md 不同步是对的，每个实例应该有自己的身份。冲突解决策略也比较务实。

---

### 4. Pipedream Connect — 2000+ API 集成 ⭐⭐⭐⭐⭐

**GitHub:** [openclaw/skills - pipedream-connect](https://github.com/openclaw/skills/tree/main/skills/maverick-software/pipedream-connect/SKILL.md)

**核心功能：** 通过 Pipedream 平台连接 2,000+ API，提供完整的 OAuth 管理，每个 Agent 拥有独立的应用连接和令牌隔离。

**核心架构：**

```
Global Pipedream Tab
  └── 平台凭证 (Client ID, Secret, Project ID)
  └── Agent 快速链接

Agents → [Agent] → Tools → Pipedream
  └── External User ID (默认 = agent slug)
  └── 已连接应用 (实时查询 Pipedream API)
  └── 可用应用网格
```

**实用场景：**

```bash
# Gmail - 查找未读邮件
mcporter call pipedream-main-gmail.gmail-find-email \
  instruction="Find unread emails from today"

# Google Calendar - 查找明日事件
mcporter call pipedream-scout-monitor-google-calendar.google-calendar-find-event \
  instruction="Find events for tomorrow"

# Slack - 发送消息
mcporter call pipedream-main-slack.slack-send-message \
  instruction="Send 'Build complete!' to #deployments"
```

**技术亮点：**

1. **Per-Agent 隔离：** 每个 Agent 使用独立的 `external_user_id`，OAuth 令牌完全隔离
2. **Vault 安全存储：** Client Secret 存储在 `~/.openclaw/secrets.json`（0600权限），绝不以明文出现在配置文件中
3. **自动迁移：** 升级后自动将明文凭据迁移到 Vault
4. **令牌刷新：** 可选 cron 任务每 45 分钟刷新令牌

**安全设计：**

| 行为 | 详情 |
|------|------|
| clientId/clientSecret | Vault 存储（0600） |
| 访问令牌 | 短期 JWT，45 分钟刷新 |
| mcporter.json | 永不包含 client_secret |
| 外部 API | 仅访问 pipedream.com 域名 |

**推荐指数：** ⭐⭐⭐⭐⭐

> **点评：** 这是让 Agent 真正"连接世界"的 Skill。2000+ API 的覆盖范围加上完善的 OAuth 管理和 per-agent 隔离，安全设计也很到位。Vault-backed secrets 的设计说明开发者在安全上用了心。

---

### 5. Zapier MCP — 8000+ 应用连接 ⭐⭐⭐⭐

**GitHub:** [openclaw/skills - zapier-mcp](https://github.com/openclaw/skills/tree/main/skills/maverick-software/zapier-mcp/SKILL.md)

**核心功能：** 通过 Zapier MCP 连接 8,000+ 应用，无需复杂 OAuth 管理——粘贴 MCP URL 即可使用。

**与 Pipedream Connect 的对比：**

| 特性 | Zapier MCP | Pipedream Connect |
|------|-----------|-------------------|
| 设置 | 粘贴 URL | OAuth + 凭据 |
| 令牌刷新 | 不需要 | 每 45 分钟 |
| 应用数量 | 8,000+ | 2,000+ |
| 复杂度 | 简单 | 更精细控制 |
| 适合场景 | 快速上手 | 生产环境 |

**使用方式：**

```bash
# 配置：在 Dashboard → Tools → Zapier 粘贴 MCP URL

# 列出可用工具
mcporter list zapier-mcp --schema

# Slack 发消息
mcporter call zapier-mcp.slack_send_message \
  --args '{"instructions": "Send \"Hello team!\" to #general"}'

# Google Sheets 创建行
mcporter call zapier-mcp.google_sheets_create_row \
  --args '{"instructions": "Add row with Name=John, Email=john@example.com to Sales Leads"}'

# Notion 创建页面
mcporter call zapier-mcp.notion_create_page \
  --args '{"instructions": "Create page titled \"Meeting Notes\" in Team Wiki"}'
```

**技术实现：**

Zapier MCP 使用 SSE（Server-Sent Events）格式通信，后端自动解析。每个工具接受 `instructions` 参数，Zapier 的 AI 会解析这个参数来填充缺失的字段。还有 `output_hint` 参数控制返回数据。

```bash
# 使用 output_hint 控制返回字段
mcporter call zapier-mcp.google_sheets_find_row \
  --args '{
    "instructions": "Find row where email is bob@example.com",
    "output_hint": "name, email, phone number"
  }'
```

**安全注意：** MCP URL 本身包含认证信息，需当作密码对待。存储在 `mcporter.json` 中，不要公开分享。

**推荐指数：** ⭐⭐⭐⭐

> **点评：** 如果说 Pipedream 是"专业版"，Zapier MCP 就是"快速上手版"。8000+ 应用的覆盖面无人能敌，URL 认证的方式大大降低了门槛。适合不想折腾 OAuth 的用户，或者已经在用 Zapier 的团队。

---

## 📊 应用场景总结

### 场景一：从零搭建 Agent 全家桶

```
1. 安装 agent-builder → 设计 Agent 人格和规则
2. 安装 clawdbot-security-check → 审计安全配置
3. 安装 pipedream-connect / zapier-mcp → 连接外部 API
4. 安装 clawdbot-sync → 多设备同步记忆
```

### 场景二：生产环境安全加固

```
1. clawdbot security audit --deep → 全面审计
2. clawdbot security audit --fix → 自动修复
3. 定期审计 + 检查日志
```

### 场景三：多 Agent 协作

```
1. agent-builder 创建多个专职 Agent
2. pipedream-connect 为每个 Agent 连接不同 API
3. clawdbot-sync 同步共享记忆
```

### 场景四：快速集成第三方服务

```
# 已经在用 Zapier？
→ 安装 zapier-mcp，粘贴 URL 即可

# 需要更精细的 OAuth 控制？
→ 安装 pipedream-connect，per-agent 隔离
```

---

## 🏅 推荐指数排名

| 排名 | Skill | 推荐指数 | 一句话推荐 |
|------|-------|---------|-----------|
| 1 | clawdbot-security-check | ⭐⭐⭐⭐⭐ | 安全第一，安装后必跑审计 |
| 2 | agent-builder | ⭐⭐⭐⭐⭐ | Agent 生命周期的起点 |
| 3 | pipedream-connect | ⭐⭐⭐⭐⭐ | 最强大的 API 集成方案 |
| 4 | clawdbot-sync | ⭐⭐⭐⭐ | 多设备用户刚需 |
| 5 | zapier-mcp | ⭐⭐⭐⭐ | 最简单的 API 集成方案 |

---

## 💡 实用建议

1. **安装顺序很重要：** 先装 security-check 跑一遍审计，再装 agent-builder 优化你的 Agent 配置，最后装 API 集成 Skill。

2. **Pipedream vs Zapier 怎么选：** 如果你只是想快速连接几个服务，选 Zapier（URL 即可）；如果你需要生产级的多 Agent 隔离和精细 OAuth 控制，选 Pipedream。

3. **安全审计要定期跑：** 不要只在安装时跑一次 `security audit`。建议设置 cron 每周跑一次 `--deep` 审计，配置变更后也要跑。

4. **Sync 的冲突处理：** clawdbot-sync 的时间戳策略意味着如果你在两台设备上同时编辑同一个记忆文件，后保存的会覆盖先保存的。重要记忆建议在一个设备上编辑。

5. **其他值得关注的 Skills：**
   - **clawdefender** — 输入消毒器，防御提示注入
   - **clawd-presence** — 物理设备上的 Agent 存在感显示
   - **gamification-xp** — 用 XP 系统游戏化你的生产力
   - **clawdlink** — Agent 间加密通信

---

> 📅 明日预告：**CLI Utilities** — 命令行工具类 Skills，让 Agent 成为终端高手。
>
> 📖 往期回顾：
> - [AI and LLMs](#) (第1期)
> - [Apple Apps and Services](#) (第2期)
> - [Browser and Automation](#) (第3期)
> - [Calendar and Scheduling](#) (第4期)
