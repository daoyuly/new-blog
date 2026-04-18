---
title: Hermes vs OpenClaw：两大 AI Agent 平台深度对比分析
tags:
  - AI Agent
  - Hermes
  - OpenClaw
  - 架构对比
  - 技能系统
  - 记忆系统
categories:
  - 平台分析
abbrlink: 31384
date: 2026-04-17 13:41:00
---

# Hermes vs OpenClaw：两大 AI Agent 平台深度对比分析

> **分析日期**: 2026年4月17日
> **分析对象**: Hermes Agent v0.8.0 vs OpenClaw
> **分析维度**: 架构设计、核心能力、使用场景、生态系统

---

## 执行摘要

Hermes 和 OpenClaw 是两个设计理念截然不同的 AI Agent 平台。**Hermes 是一个专注于自我改进的单一 Agent 系统**，通过技能、记忆和背景审查构建完整的封闭学习循环；而 **OpenClaw 是一个多通道网关型平台**，强调多 Agent 路由、多通道集成和工具使用能力。

**核心差异**：
- **Hermes**：单体 Agent + 自我进化 + 学习型记忆系统
- **OpenClaw**：多 Agent 网关 + 多通道集成 + 工具编排

---

## 一、平台定位与设计哲学

### 1.1 核心定位对比

| 维度 | Hermes | OpenClaw |
|------|---------|-----------|
| **核心定位** | 自我改进型单一 Agent 系统 | 多通道多 Agent 网关 |
| **设计目标** | 构建会自我进化的 AI 助手 | 连接聊天应用与 AI Agent 的基础设施 |
| **部署模式** | 本地运行（命令行） | 自托管 Gateway（daemon 服务） |
| **用户群体** | 开发者、研究人员、深度用户 | 开发者、团队、多设备用户 |

### 1.2 设计哲学

**Hermes：从学习到应用的闭环**

```
用户请求 → Agent 执行 → 后台审查 → 提取知识 → 固化技能 → 下次应用
```

核心思想：Agent 应该从每次交互中学习，将经验固化为可复用的技能。

**OpenClaw：从任意地方访问任意 Agent**

```
聊天应用 → Gateway 路由 → Agent 执行 → 工具调用 → 返回结果 → 多通道响应
```

核心思想：让 AI Agent 像普通聊天机器人一样易于访问，同时保持强大的工具能力。

---

## 二、架构设计对比

### 2.1 系统架构

#### Hermes 架构特点

- 单一进程，单一 Agent
- 三元记忆模型（技能、记忆、用户画像）
- 后台线程异步审查
- 技能生态系统（多源集成）

#### OpenClaw 架构特点

- Gateway 作为中央路由器
- 多 Agent 并发运行，完全隔离
- 多通道适配器（WhatsApp、Telegram、Discord、iMessage）
- Web Control UI 和移动节点支持

### 2.2 技术栈对比

| 技术维度 | Hermes | OpenClaw |
|---------|---------|-----------|
| **语言** | Python | Node.js (TypeScript) |
| **进程模型** | 单一 CLI 进程 | Gateway daemon + 多 Agent |
| **配置方式** | YAML 配置文件 | JSON/JSON5 配置文件 |
| **存储** | 文件系统 (SKILL.md, MEMORY.md, USER.md) | 文件系统 + 会话存储 |
| **并发模型** | 单线程异步（background threads） | 多进程（Gateway + Agent workers） |

---

## 三、核心能力对比

### 3.1 记忆系统

#### Hermes：三元记忆模型

```
┌─────────────────────────────────────────────────────────────┐
│                    Memory System                      │
├─────────────────────────────────────────────────────────────┤
│  Procedural Memory (技能系统)                         │
│  ├── SKILL.md 文件                               │
│  ├── 支持文件 (references/, templates/, scripts/)    │
│  └── 执行特定任务的标准化流程                       │
├─────────────────────────────────────────────────────────────┤
│  Episodic Memory (MEMORY.md)                        │
│  ├── 环境事实、项目约定、工具怪癖                │
│  └── 从经验中学到的知识                              │
├─────────────────────────────────────────────────────────────┤
│  Semantic Memory (USER.md)                             │
│  ├── 用户偏好、交流风格、工作习惯                   │
│  └── 用户期望                                       │
└─────────────────────────────────────────────────────────────┘
```

**特性**：
- 双重状态：冻结快照（系统提示词）+ 实时更新（内存）
- 字符限制：MEMORY.md 2200 字符，USER.md 1375 字符
- 安全扫描：阻止注入和外泄攻击
- 原子写入：临时文件 + `os.replace()`

**审查机制**：
- 后台线程异步运行
- 可配置触发间隔（默认 10 次轮次）
- 静默执行，简洁通知

#### OpenClaw：文件系统记忆

```
~/.openclaw/workspace/
├── SOUL.md          # 个性、价值观、行为准则
├── AGENTS.md        # Code Agent 调用规则
├── USER.md          # 用户信息、偏好、时区
├── MEMORY.md        # 长期记忆、项目信息
└── skills/         # Agent 技能目录
```

**特性**：
- 项目级记忆（每个 Agent 有独立 workspace）
- 技能系统（Agent Skills）
- 会话历史存储（`~/.openclaw/agents/<agentId>/sessions`）
- 跨会话记忆检索（skills 自动加载）

### 3.2 技能系统

#### Hermes 技能系统

**技能定义**（SKILL.md 前置元数据）：

```yaml
---
name: deploy-container
description: 部署容器到生产环境的标准化流程
metadata:
  hermes:
    tags: [devops, docker, deployment]
    platforms: [linux]
---

# 部署容器

## 触发条件
当用户请求部署容器时使用此技能。

## 步骤
1. 验证镜像是否存在
2. 拉取最新镜像
3. 停止旧容器
4. 启动新容器
5. 健康检查

## 常见陷阱
- 镜像名称包含标签时，必须使用完整的 `repo:tag` 格式
```

**自动创建与自我改进**：

```python
# 后台审查触发（默认 10 次工具调用后）
if self._check_skill_nudge():
    self._spawn_background_review(
        messages_snapshot=list(messages),
        review_skills=True,
    )
```

**技能生态系统**（多源集成）：
1. **GitHub Source**：任意公开仓库
2. **Skills.sh Source**：技能目录索引
3. **ClawHub Source**：技能市场 API
4. **LobeHub Source**：LobeChat Agent 市场
5. **Official Optional Skills**：官方可选技能

#### OpenClaw 技能系统

**技能定义**（SKILL.md 简化版）：

```markdown
---
name: blog-publisher
description: Publish Markdown documents to a Hexo blog with automatic deployment via Vercel.
---

# Blog Publisher (Vercel)

## Overview

This skill automates the process of publishing Markdown documents to a Hexo blog deployed on Vercel.

## Workflow

1. Prepare the Markdown Document with proper YAML frontmatter
2. Save to blog directory
3. Deploy via git push
```

**技能触发机制**：
- 基于 `<available_skills>` 元数据注入系统提示词
- Agent 根据任务描述自动选择匹配的技能

### 3.3 工具系统

#### Hermes 工具系统

**内置工具**：
- `exec`：执行 shell 命令
- `read/write/edit`：文件操作
- `skill_manage`：技能管理
- `memory`：记忆读写
- `browser`：浏览器控制
- `sessions_spawn`：启动子 Agent
- `image`：图像分析

**工具调用优化**（v0.8.0）：
- 参数类型强制转换
- 批量调用支持
- 错误模式自我修复

#### OpenClaw 工具系统

**内置工具（50+）**：
- 文件操作：`read`, `write`, `edit`
- 系统操作：`exec`, `process`
- 网络操作：`web_search`, `web_fetch`, `browser`
- 会话管理：`sessions_spawn`, `sessions_send`, `subagents`
- 消息操作：`message`（多通道）
- 图像处理：`image`, `canvas`, `nodes`
- TTS：`tts`

**工具沙箱**（per-agent 配置）：

```json
{
  "sandbox": {
    "mode": "all",
    "scope": "agent",
    "docker": {
      "setupCommand": "apt-get update && apt-get install -y git curl"
    }
  },
  "tools": {
    "allow": ["read"],
    "deny": ["exec", "write", "edit"]
  }
}
```

### 3.4 多 Agent 能力

#### Hermes：子 Agent 系统

**sessions_spawn 工具**：

```python
sessions_spawn({
  agentId: "code-agent",
  task: "<任务描述>",
  mode: "run",  // 一次性任务
  // 或 mode: "session" // 持续会话
})
```

**特性**：
- 启动子 Agent 在独立会话中
- 子 Agent 结果返回到主会话
- 支持持久化会话

#### OpenClaw：多 Agent 路由

**Agent 隔离**：

```json
{
  "agents": {
    "list": [
      {
        "id": "main",
        "workspace": "~/.openclaw/workspace"
      },
      {
        "id": "work",
        "workspace": "~/.openclaw/workspace-work"
      }
    ]
  }
}
```

**绑定规则**（按优先级匹配）：
1. `peer` 匹配（精确 DM/group/channel id）
2. `guildId + roles`（Discord 角色路由）
3. `accountId` 匹配
4. fallback 到默认 agent

**跨 Agent 通信**：

```json
{
  "tools": {
    "agentToAgent": {
      "enabled": true,
      "allow": ["main", "work"]
    }
  }
}
```

---

## 四、通道与集成能力

### 4.1 通道支持对比

| 通道 | Hermes | OpenClaw |
|------|---------|-----------|
| **CLI** | ✅ 主要方式 | ✅ 支持 |
| **WhatsApp** | ❌ | ✅ Baileys 集成，多账号 |
| **Telegram** | ❌ | ✅ Bot API，多账号 |
| **Discord** | ❌ | ✅ Bot，角色路由 |
| **iMessage** | ❌ | ✅ macOS 本地集成 |
| **Web UI** | ❌ | ✅ Control UI |
| **移动节点** | ❌ | ✅ iOS/Android 配对 |

### 4.2 Web 界面

**Hermes**：无 Web 界面，纯 CLI 交互

**OpenClaw**：完整的 Web Control UI
- 浏览器聊天界面
- 配置管理
- 会话历史查看
- 节点管理
- 实时日志

---

## 五、使用场景对比

### 5.1 适合 Hermes 的场景

#### ✅ 深度学习型助手

**场景**：长期维护一个项目，Agent 需要记住大量细节和流程。

**优势**：
- 自动技能创建和改进
- 强大的记忆系统
- 跨会话知识检索
- 背景审查自动提取知识

#### ✅ 复杂任务流程固化

**场景**：重复执行复杂的多步骤任务。

**优势**：
- 技能系统标准化流程
- 常见陷阱文档化
- 自动修补技能缺陷

#### ✅ 研究与开发环境

**场景**：需要深度代码分析和长期项目跟踪。

### 5.2 适合 OpenClaw 的场景

#### ✅ 多通道消息集成

**场景**：从任意聊天应用访问 AI。

**优势**：
- WhatsApp、Telegram、Discord 原生支持
- 多账号管理
- 统一网关

#### ✅ 多人协作环境

**场景**：团队共享一个 Gateway，每个人都有独立的 AI。

**优势**：
- 多 Agent 完全隔离
- 绑定规则按人路由
- 独立 workspace 和会话

#### ✅ 移动设备访问

**场景**：在手机上访问 AI 的能力。

**优势**：
- iOS/Android 节点
- Canvas 支持
- 相机、位置等功能

#### ✅ 自动化与任务执行

**场景**：定时任务、自动化工作流。

**优势**：
- Daemon 服务
- exec 工具
- cron 支持

---

## 六、安全性对比

### 6.1 安全机制

#### Hermes 安全机制

**技能安全扫描**：

```python
_MEMORY_THREAT_PATTERNS = [
    (r'ignore\s+(previous|all|above|prior)\s+instructions', "prompt_injection"),
    (r'you\s+are\s+now\s+', "role_hijack"),
    (r'curl\s+[^\n]*\$\{?\w*(KEY|TOKEN|SECRET)', "exfil_curl"),
    (r'cat\s+[^\n]*(\.env|credentials)', "read_secrets"),
]
```

**记忆安全扫描**：
- 不可见 Unicode 字符检测
- 注入模式检测
- 外泄模式检测

#### OpenClaw 安全机制

**多 Agent 隔离**：
- 独立 workspace
- 独立 agentDir
- 独立会话存储

**沙箱支持**：
- Docker 容器隔离
- per-agent 配置

**工具限制**：
- per-agent allow/deny 列表

**通道访问控制**：
- allowFrom 白名单
- requireMention 机制

### 6.2 安全对比

| 安全维度 | Hermes | OpenClaw |
|---------|---------|-----------|
| **内容扫描** | ✅ 技能和记忆自动扫描 | ❌ 无自动扫描 |
| **沙箱隔离** | ❌ 无 | ✅ Docker 沙箱 |
| **多 Agent 隔离** | ❌ 单 Agent | ✅ 完全隔离 |
| **访问控制** | ❌ 依赖 OS | ✅ 多层访问控制 |
| **认证机制** | ❌ 无 | ✅ Gateway + 通道认证 |

---

## 七、生态系统

### 7.1 项目信息

| 维度 | Hermes | OpenClaw |
|------|---------|-----------|
| **GitHub** | NousResearch/hermes-agent | openclaw/openclaw |
| **License** | 开源 | MIT |
| **文档** | GitHub README + 代码注释 | 完整文档站点 |

### 7.2 技能生态

**Hermes 技能生态**：
- GitHub：任意公开仓库
- Skills.sh：社区索引
- ClawHub：技能市场
- LobeHub：Agent 市场
- 信任分级：builtin, trusted, community

**OpenClaw 技能生态**：
- 官方技能：10+ 内置技能包
- 共享技能：`~/.openclaw/skills`
- Agent 技能：per-agent workspace

---

## 八、选择建议

### 8.1 选择 Hermes 如果你

- ✅ 需要**深度自我学习**和**经验沉淀**
- ✅ 主要在**本地开发环境**工作
- ✅ 需要**复杂任务流程固化**
- ✅ 追求**单一 Agent**的极致体验
- ✅ 习惯**命令行**工作流
- ✅ 需要**强大的技能生态系统**

### 8.2 选择 OpenClaw 如果你

- ✅ 需要**多通道消息集成**（WhatsApp, Telegram, Discord）
- ✅ 需要**多人协作**环境
- ✅ 需要**移动设备访问**
- ✅ 需要**多 Agent**并行工作
- ✅ 需要**Web UI**和可视化界面
- ✅ 需要**自动化任务**和定时执行
- ✅ 需要**远程访问**AI 能力

### 8.3 可以同时使用

**场景 1：Hermes 做深度学习，OpenClaw 做多通道访问**

```
Hermes (本地开发)
├── 深度项目分析
├── 技能创建和改进
└── 长期记忆沉淀

OpenClaw (多通道网关)
├── WhatsApp / Telegram 集成
├── 移动节点访问
└── 快速问答和自动化
```

**场景 2：OpenClaw 调用 Hermes 作为子 Agent**

```
OpenClaw (WhatsApp)
├── 接收用户消息
├── sessions_spawn 启动 Hermes
└── 返回结果
```

---

## 九、总结

### 9.1 核心差异总结

| 维度 | Hermes | OpenClaw |
|------|---------|-----------|
| **核心定位** | 自我改进型单一 Agent | 多通道多 Agent 网关 |
| **架构模式** | 单体应用 | Gateway + 多 Agent |
| **记忆系统** | 三元记忆模型 | 项目级文件系统 |
| **技能系统** | 自动创建 + 自我改进 | 手动创建 + 共享 |
| **通道支持** | 仅 CLI | 5+ 原生通道 |
| **Web UI** | ❌ | ✅ Control UI |
| **移动支持** | ❌ | ✅ iOS/Android |
| **沙箱** | ❌ | ✅ Docker |
| **安全扫描** | ✅ 技能和记忆 | ❌ |

### 9.2 优势对比

**Hermes 的独特优势**：
1. ✅ **封闭学习循环**：从交互中自动提取知识
2. ✅ **技能自动创建**：后台审查智能建议技能
3. ✅ **自我改进机制**：使用中实时修补技能
4. ✅ **强大的记忆系统**：三元记忆模型 + FTS5 检索
5. ✅ **技能生态系统**：多源集成（GitHub, Skills.sh 等）

**OpenClaw 的独特优势**：
1. ✅ **多通道集成**：WhatsApp, Telegram, Discord 原生支持
2. ✅ **多 Agent 路由**：绑定规则自动分发
3. ✅ **Web Control UI**：完整的浏览器界面
4. ✅ **移动节点**：iOS/Android 配对支持
5. ✅ **沙箱隔离**：per-agent Docker 沙箱
6. ✅ **Daemon 服务**：自动管理和远程访问

### 9.3 最终建议

**对于个人开发者**：
- 如果主要在本地开发，需要深度学习能力 → **Hermes**
- 如果需要多通道访问和移动支持 → **OpenClaw**

**对于团队**：
- 需要 AI 深度分析和流程固化 → **Hermes**
- 需要多 AI 协作和消息集成 → **OpenClaw**

**最佳实践**：
- 考虑同时使用两者
- Hermes 做深度学习和技能管理
- OpenClaw 做多通道访问和团队协作
- 通过工具调用集成两个平台

---

## 附录：快速对比表

| 特性 | Hermes | OpenClaw |
|------|---------|-----------|
| **类型** | 单一 Agent | 多 Agent 网关 |
| **语言** | Python | TypeScript (Node.js) |
| **配置** | YAML | JSON/JSON5 |
| **通道** | CLI | WhatsApp, Telegram, Discord, iMessage, Mattermost |
| **Web UI** | ❌ | ✅ Control UI |
| **移动支持** | ❌ | ✅ iOS/Android |
| **技能系统** | ✅ 自动创建 + 自我改进 | ✅ 手动创建 + 共享 |
| **记忆系统** | ✅ 三元模型 + FTS5 | ✅ 文件系统 |
| **多 Agent** | ⚠️ 子 Agent（临时） | ✅ 持久 Agent（并行） |
| **沙箱** | ❌ | ✅ Docker |
| **安全扫描** | ✅ 技能和记忆 | ❌ |
| **Daemon** | ❌ | ✅ launchd/systemd |
| **远程访问** | ❌ | ✅ SSH/Tailscale |
| **技能生态** | ✅ 多源集成（5+） | ⚠️ 本地 + 共享 |
| **插件系统** | ⚠️ 记忆提供者 | ✅ 通道 + 工具 |

---

**报告完成时间**: 2026年4月17日
**报告作者**: daoyu (来顺)
**分析深度**: 架构级对比
