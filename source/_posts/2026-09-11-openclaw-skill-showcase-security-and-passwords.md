---
title: OpenClaw Skill 每日推荐 - 安全与密码
date: 2026-09-11 11:30:00
tags:
  - openclaw
  - skill
  - security
  - passwords
  - 安全
categories:
  - 技术推荐
---

# OpenClaw Skill 每日推荐 - 安全与密码 🔐

> 每日精选 OpenClaw 生态中的优秀 Skill，今天带你探索 **Security & Passwords** 分类。

## 📋 今日分类概述

**分类名称：** Security & Passwords（安全与密码）
**Skill 总数：** 54 个
**涵盖范围：** 密码管理、密钥加密、安全审计、密钥泄露检测、入侵检测、量子抗性加密等

安全是 AI Agent 生态中至关重要的一环。当 Agent 拥有了执行命令、访问文件、调用 API 的能力后，如何安全管理凭据、防止密钥泄露、审计系统安全就成为了不可忽视的课题。OpenClaw 的 Security & Passwords 分类汇聚了 54 个相关 Skill，从密码管理到加密通信，从漏洞扫描到入侵检测，构建了一套完整的安全工具链。

---

## 🏆 精选 Skill 详解

### 1. 1Password — 1Password CLI 集成 ⭐⭐⭐⭐⭐

**GitHub:** [steipete/1password](https://github.com/openclaw/skills/tree/main/skills/steipete/1password/SKILL.md)
**ClawHub:** [clawhub.ai/steipete/1password](https://clawhub.ai/steipete/skills/1password)

#### 核心功能

将 1Password CLI（`op` 命令）集成到 OpenClaw Agent 中，让 Agent 安全地访问和引用密码库中的凭据，而永远不需要将明文密码写入代码或配置文件。

#### 技术实现

- 基于 1Password 官方 CLI 工具 `op`
- 通过 **tmux 会话** 管理 `op` 的认证状态，解决 CLI 工具的 TTY 交互问题
- 支持桌面应用集成认证（Desktop App Integration）
- 支持 `op run` 和 `op inject` 两种安全引用模式

#### 实用场景

```bash
# Agent 需要数据库密码时，不写明文，而是从 1Password 引用
op run -- env | grep DATABASE_URL

# 使用 inject 模式替换配置文件中的占位符
op inject -i config.template.json -o config.json
```

#### 安全设计亮点

- **永远不在日志、聊天或代码中粘贴密码**
- 优先使用 `op run` / `op inject` 而非将密码写入磁盘
- 强制要求在 tmux 会话中运行所有 `op` 命令
- 支持 `--account` 和 `OP_ACCOUNT` 环境变量管理多账户

**推荐指数：** ⭐⭐⭐⭐⭐

> 💡 **推荐理由：** 1Password 是最成熟的商业密码管理器之一，这个 Skill 的设计非常用心——tmux 会话管理解决了 Agent 环境下 CLI 认证的核心痛点，安全护栏设计到位。

---

### 2. ggshield-scanner — 密钥泄露扫描器 ⭐⭐⭐⭐⭐

**GitHub:** [amascia-gg/ggshield-scanner](https://github.com/openclaw/skills/tree/main/skills/amascia-gg/ggshield-scanner/SKILL.md)
**ClawHub:** [clawhub.ai/amascia-gg/ggshield-scanner](https://clawhub.ai/amascia-gg/skills/ggshield-scanner)

#### 核心功能

集成 GitGuardian 的 ggshield CLI，为 Agent 提供密钥泄露检测能力。支持扫描代码仓库、单个文件、Git 暂存区、Docker 镜像等，能检测 500+ 种硬编码密钥。

#### 技术实现

- 基于 ggshield CLI（Python 3.8+）
- 使用 GitGuardian API 进行密钥检测
- **检测引擎：** 熵值分析 + 模式匹配 + 公开 CVE 交叉引用 + 机器学习
- **隐私保护：** 仅发送密钥的哈希值和元数据，永不发送实际密钥内容

#### 实用场景

```bash
# 扫描整个代码仓库（包含历史记录）
@clawd scan-repo /path/to/project

# 扫描 Git 暂存区（提交前检查）
@clawd scan-staged

# 安装为 Git pre-commit 钩子
@clawd install-hooks

# 扫描 Docker 镜像
@clawd scan-docker my-app:latest
```

#### 典型工作流

1. **开发时：** Agent 在推送代码前自动扫描仓库
2. **审计时：** 扫描旧项目，发现历史泄露的密钥
3. **CI/CD：** 集成到 GitHub Actions 中自动拦截

```yaml
# .github/workflows/secret-scan.yml
name: Secret Scan
on: [push]
jobs:
  scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: pip install ggshield
      - run: ggshield secret scan repo .
        env:
          GITGUARDIAN_API_KEY: ${{ secrets.GITGUARDIAN_API_KEY }}
```

#### 可检测的密钥类型

- AWS Access Keys / GCP Service Accounts / Azure 凭据
- API tokens（GitHub、Slack、Stripe 等）
- 数据库密码和连接字符串
- 私钥和证书
- OAuth tokens 和 refresh tokens

**推荐指数：** ⭐⭐⭐⭐⭐

> 💡 **推荐理由：** 密钥泄露是开发中最常见的安全事故之一。这个 Skill 功能完整、文档详尽，从扫描到 pre-commit 钩子到 CI/CD 集成都覆盖了，是 Agent 辅助安全开发的标准范例。

---

### 3. safe-encryption-skill — 后量子加密工具 ⭐⭐⭐⭐

**GitHub:** [grittygrease/safe-encryption-skill](https://github.com/openclaw/skills/tree/main/skills/grittygrease/safe-encryption-skill/SKILL.md)
**ClawHub:** [clawhub.ai/grittygrease/safe-encryption-skill](https://clawhub.ai/grittygrease/skills/safe-encryption-skill)

#### 核心功能

SAFE（Simple Async File Encryption）是一个现代加密 CLI 工具，支持**后量子加密算法**、多接收者加密和可组合认证。定位为 GPG 的现代替代品。

#### 技术实现

- 支持 x25519 密钥交换和后量子 KEM（Key Encapsulation Mechanism）
- 多接收者加密：一条消息可加密给多个接收者
- 可组合认证：密码、公钥、Passkey、GitHub 用户名均可作为认证方式
- 自动密钥管理：密钥存储在 `~/.safe/` 目录
- 提供 Web 备选方案：[thesafe.dev](https://thesafe.dev) 全客户端浏览器实现

#### 实用场景

```bash
# 生成密钥对
safe keygen x25519

# 加密文件（指定接收者）
safe encrypt -r alice -r bob secret.txt

# 使用密码加密
safe encrypt -p secret.txt

# 解密（自动发现密钥）
safe decrypt message.safe

# 通过管道解密内嵌内容
echo "..." | base64 -d | safe decrypt -k key.key

# 通过环境变量传递密码（自动化场景）
safe encrypt -p env:SAFE_PASSPHRASE data.txt
```

#### 安装

```bash
# macOS Apple Silicon
curl -sL https://thesafe.dev/downloads/safe-darwin-arm64 -o safe && chmod +x safe && sudo mv safe /usr/local/bin/

# 自动检测平台
which safe || { OS=$(uname -s | tr '[:upper:]' '[:lower:]'); ARCH=$(uname -m); \
  [ "$ARCH" = "arm64" ] || [ "$ARCH" = "aarch64" ] && ARCH=arm64 || ARCH=amd64; \
  curl -sL "https://thesafe.dev/downloads/safe-${OS}-${ARCH}" -o safe && chmod +x safe && sudo mv safe /usr/local/bin/; }
```

#### 设计亮点

- **后量子安全：** 在量子计算威胁日益临近的当下，提前布局抗量子加密
- **多认证组合：** 密码、公钥、Passkey、GitHub 用户名自由组合
- **浏览器备选：** CLI 不可用时，Web 版本完全等价，所有运算在浏览器端完成
- **管道优先：** 避免 temp 文件，降低密钥泄露风险

**推荐指数：** ⭐⭐⭐⭐

> 💡 **推荐理由：** 后量子加密是未来趋势，这个 Skill 让 Agent 能够轻松使用现代加密技术。Web 备选方案设计很贴心，解决了受限环境下的可用性问题。

---

### 4. Bitwarden — 开源密码管理器集成 ⭐⭐⭐⭐

**GitHub:** [asleep123/bitwarden](https://github.com/openclaw/skills/tree/main/skills/asleep123/bitwarden/SKILL.md)
**ClawHub:** [clawhub.ai/asleep123/bitwarden](https://clawhub.ai/asleep123/skills/bitwarden)

#### 核心功能

通过 `rbw` CLI（Bitwarden 的高性能 Rust 客户端）集成 Bitwarden / Vaultwarden 密码库，让 Agent 安全访问密码、安全笔记和 OTP。

#### 技术实现

- 基于 `rbw`（Rust 编写的 Bitwarden CLI 客户端）
- 支持 Bitwarden 官方服务和自托管 Vaultwarden 实例
- 通过 pinentry-curses 处理交互式密码输入
- 使用 tmux 管理认证会话

#### 实用场景

```bash
# 首次配置
rbw config set email your@email.com
rbw config set baseurl https://vault.yourdomain.com  # Vaultwarden 自托管
rbw login

# 解锁密码库
rbw unlock

# 列出所有项目
rbw list

# 获取密码
rbw get "GitHub Token"

# 获取完整 JSON 信息
rbw get --full "Database Credentials"

# 搜索
rbw search "aws"

# 同步密码库（获取最新数据）
rbw sync
```

#### 适用人群

- 使用 Bitwarden / Vaultwarden 的用户
- 需要自托管密码管理方案的安全敏感团队
- 开源安全工具爱好者

**推荐指数：** ⭐⭐⭐⭐

> 💡 **推荐理由：** Bitwarden 是最流行的开源密码管理器，rbw 作为 Rust 客户端性能出色。对于不愿使用商业密码管理器的用户，这是最佳替代方案。

---

### 5. clawdstrike — OpenClaw 主机安全审计 ⭐⭐⭐⭐

**GitHub:** [misirov/clawdstrike](https://github.com/openclaw/skills/tree/main/skills/misirov/clawdstrike/SKILL.md)
**ClawHub:** [clawhub.ai/misirov/clawdstrike](https://clawhub.ai/misirov/skills/clawdstrike)

#### 核心功能

对运行 OpenClaw Gateway 的主机进行安全审计和威胁建模，识别潜在安全风险并提供加固建议。

#### 技术实现

- 扫描主机配置：SSH 配置、防火墙规则、开放端口、用户权限
- 检查 OpenClaw Gateway 的安全配置
- 生成威胁模型和安全评分
- 提供可执行的加固建议

#### 实用场景

```bash
# Agent 对自己的运行环境进行安全审计
@clawd audit-host

# 生成安全报告
@clawd security-report --format markdown
```

#### 为什么重要

当你的 Agent 拥有了文件系统访问、命令执行、消息发送等能力后，运行环境的安全至关重要。clawdstrike 能帮你：

- 发现意外开放的端口和服务
- 检查 SSH 配置是否安全
- 验证防火墙规则是否充分
- 评估 OpenClaw 配置的安全性

**推荐指数：** ⭐⭐⭐⭐

> 💡 **推荐理由：** 安全审计是 Agent 运维的重要环节。这个 Skill 填补了 OpenClaw 生态中主机安全审计的空白，适合所有自托管 OpenClaw 的用户。

---

## 📊 推荐指数排名

| 排名 | Skill 名称 | 推荐指数 | 核心价值 |
|:---:|:---:|:---:|:---|
| 1 | ggshield-scanner | ⭐⭐⭐⭐⭐ | 密钥泄露检测，开发安全必备 |
| 2 | 1password | ⭐⭐⭐⭐⭐ | 商业密码管理器最佳集成 |
| 3 | safe-encryption-skill | ⭐⭐⭐⭐ | 后量子加密，面向未来 |
| 4 | bitwarden | ⭐⭐⭐⭐ | 开源密码管理首选 |
| 5 | clawdstrike | ⭐⭐⭐⭐ | Agent 主机安全审计 |

---

## 🎯 应用场景总结

### 场景一：安全开发流程

Agent 在开发过程中，使用 **ggshield-scanner** 在每次提交前自动扫描密钥泄露，配合 pre-commit 钩子实现自动化拦截。开发完成后，使用 **clawdstrike** 审计部署环境的安全性。

### 场景二：凭据安全管理

Agent 需要访问数据库、API 等服务时，通过 **1Password** 或 **Bitwarden** Skill 从密码库安全获取凭据，永远不在代码或配置中硬编码密码。使用 `op run` 或 `rbw get` 动态注入环境变量。

### 场景三：敏感数据加密传输

Agent 处理敏感数据时，使用 **safe-encryption-skill** 进行端到端加密。多接收者功能支持将同一条消息安全地发送给多个相关方，后量子算法确保长期安全性。

### 场景四：安全审计与合规

定期使用 **clawdstrike** 对 Agent 运行环境进行安全审计，使用 **ggshield-scanner** 扫描代码仓库中的历史泄露，确保符合安全合规要求。

---

## 💡 实用建议

1. **优先部署密钥扫描**：如果你只能安装一个安全 Skill，选 ggshield-scanner。密钥泄露是最常见且最具破坏性的安全事故。
2. **选择适合的密码管理器**：1Password 功能最全但需付费，Bitwarden 开源免费且支持自托管，按需选择。
3. **关注后量子安全**：safe-encryption-skill 虽然看起来超前，但对于需要长期保密的数据（如医疗、金融记录），后量子加密已经值得考虑。
4. **定期安全审计**：将 clawdstrike 设为定期任务（如每周一次），及时发现环境中的安全变化。
5. **组合使用效果最佳**：ggshield（扫描泄露）+ 1Password/Bitwarden（密码管理）+ safe-encryption（数据加密）+ clawdstrike（环境审计）= 完整的安全工具链。

---

## 🔗 相关链接

- [OpenClaw 官方文档](https://docs.openclaw.ai)
- [ClawHub Skill 市场](https://clawhub.ai)
- [Security & Passwords 完整列表](https://github.com/openclaw/skills/tree/main/skills)
- [GitGuardian 官网](https://dashboard.gitguardian.com)
- [SAFE 加密工具官网](https://thesafe.dev)

---

> 📅 **系列文章：** 本文是 OpenClaw Skill 每日推荐系列的第 24 篇，共 30 篇。明天将为大家带来 **Self-Hosted & Automation（自托管与自动化）** 分类的精彩内容！

*安全不是一次性的工作，而是持续的过程。让 Agent 帮你把安全做到日常的每一个角落。* 🔐
