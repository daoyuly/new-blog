---
title: OpenClaw Skill 每日推荐 - Security & Passwords
tags:
  - openclaw
  - skill
  - security
  - passwords
  - encryption
categories:
  - 技术推荐
abbrlink: 40071
date: 2026-08-02 11:30:00
---

# OpenClaw Skill 每日推荐 - Security & Passwords 🔐

> 第 24 期 · 2026-08-02
> 
> 安全与密码管理分类共收录 **54 个 Skills**，涵盖密码管理、密钥加密、安全审计、钓鱼检测等领域。

## 📋 今日分类概述

Security & Passwords 是 OpenClaw 生态中至关重要的分类。AI Agent 拥有对文件系统、网络请求和外部服务的访问权限，因此安全管理凭据、加密敏感数据、审计系统漏洞成为不可忽视的环节。

这个分类的 Skills 主要覆盖以下方向：

| 方向 | 代表 Skills |
|------|------------|
| 密码管理 | 1password, bitwarden, dashlane |
| 加密与密钥 | safe-encryption-skill, cifer-sdk |
| 安全审计 | clawdstrike, clawaudit, feelgoodbot |
| 密钥检测 | ggshield-scanner |
| 域名信任 | domain-trust-check, outtake-bounty-network |
| 凭据管理 | credential-manager, 1claw |

---

## 🌟 精选 Skill 详解

### 1. 1Password CLI ⭐⭐⭐⭐⭐

**链接：** [clawhub.ai/steipete/1password](https://clawhub.ai/steipete/skills/1password)

**核心功能：** 将 1Password CLI（`op` 命令）集成到 OpenClaw Agent 中，实现安全的密码读取、注入和轮换，无需将明文密钥暴露在代码或日志中。

**技术实现：**

- 通过 **tmux 专用会话** 运行所有 `op` 命令，避免 Shell 工具每次创建新 TTY 导致的重复认证问题
- 依赖 1Password 桌面应用的集成认证（Desktop App Integration），无需手动输入主密码
- 使用 `op run` 和 `op inject` 模式，优先管道传递而非写临时文件

**实用场景：**

```bash
# Agent 需要读取 API Key 用于部署
op run -- env | grep DEPLOY_TOKEN

# 注入密钥到配置文件模板
op inject -f config.template.json -o config.json

# 列出所有 vault
op vault list
```

**安全设计亮点：**
- 所有操作在 tmux 会话内完成，隔离认证上下文
- 明确禁止将密钥粘贴到日志、聊天或代码中
- 支持多账户切换（`--account` 或 `OP_ACCOUNT`）

**推荐指数：⭐⭐⭐⭐⭐**

> 1Password 是最成熟的商业密码管理器之一，这个 Skill 的 tmux 会话设计解决了 Agent 环境下的认证持久化难题，工程质量很高。

---

### 2. Bitwarden ⭐⭐⭐⭐

**链接：** [clawhub.ai/asleep123/bitwarden](https://clawhub.ai/asleep123/skills/bitwarden)

**核心功能：** 通过 `rbw` CLI 访问 Bitwarden / Vaultwarden 密码库，支持列表、查询、添加、同步等操作。

**技术实现：**

- 基于 `rbw`（Rust 编写的 Bitwarden CLI 客户端），比官方 `bw` CLI 更轻量
- 使用 `pinentry-curses` 处理交互式密码输入
- Agent session key 缓存在 rbw agent 中，避免重复解锁

**实用场景：**

```bash
# 首次配置
rbw config set email user@example.com
rbw config set baseurl https://vault.example.com  # Vaultwarden 自托管
rbw login

# 日常使用
rbw sync                    # 同步密码库
rbw list                    # 列出所有条目
rbw get "GitHub Token"      # 获取特定密码
rbw get --full "AWS Keys"   # 获取完整 JSON 信息
```

**适用人群：** 使用 Bitwarden（特别是自托管 Vaultwarden）的用户，偏好开源方案。

**推荐指数：⭐⭐⭐⭐**

> Bitwarden 的开源属性使其成为隐私敏感用户的首选。`rbw` CLI 的轻量设计很适合 Agent 场景，但首次配置的交互流程稍显繁琐。

---

### 3. ggshield Secret Scanner ⭐⭐⭐⭐⭐

**链接：** [clawhub.ai/amascia-gg/ggshield-scanner](https://clawhub.ai/amascia-gg/skills/ggshield-scanner)

**核心功能：** 检测代码中 500+ 类型的硬编码密钥，包括 AWS Keys、API Token、数据库密码、OAuth 令牌等，防止敏感信息泄露到版本控制。

**技术实现：**

- 基于 GitGuardian 的检测引擎，结合三种检测策略：
  - **熵值检测**：识别高熵字符串（随机 Token）
  - **模式匹配**：匹配已知密钥格式（如 AWS Key 前缀 `AKIA`）
  - **机器学习**：基于泄露密钥数据库训练
- 只发送密钥的**哈希元数据**到 GitGuardian API，不上传实际密钥
- 支持 Git pre-commit hook 自动拦截

**实用场景：**

```bash
# 扫描整个仓库（含 git history）
@clawd scan-repo /path/to/project

# 扫描暂存区（pre-commit 检查）
@clawd scan-staged

# 扫描 Docker 镜像层
@clawd scan-docker my-app:latest

# 安装 pre-commit hook
@clawd install-hooks
# 此后每次 git commit 自动扫描，检测到密钥则阻止提交
```

**实际效果示例：**

```
❌ Found 2 secrets:
  - AWS Access Key ID in config/prod.py:42
  - Slack API token in .env.backup:8
Recommendation: Rotate these credentials immediately.
```

**推荐指数：⭐⭐⭐⭐⭐**

> 这是安全审计的必备 Skill。pre-commit hook 的自动拦截机制能有效防止密钥泄露事故，隐私设计（只传哈希）也让人放心。GitGuardian 免费版即可使用。

---

### 4. Domain Trust Check ⭐⭐⭐⭐

**链接：** [clawhub.ai/jamesouttake/domain-trust-check](https://clawhub.ai/jamesouttake/skills/domain-trust-check)

**核心功能：** 在 Agent 访问或推荐 URL 之前，检测目标域名是否存在钓鱼、恶意软件、品牌滥用或诈骗风险。由 Outtake Trust API 提供支持。

**技术实现：**

- 调用 Outtake Trust API 进行实时域名信任评估
- 返回判定结果（`malicious` / `suspicious` / `safe` / `unknown`）及置信度
- 支持批量检测（最多 50 个 URL/请求）
- 置信度 1.0 = 人工审核，0.7-0.99 = ML 分类

**实用场景：**

```bash
# 检查可疑链接
curl -s -X POST https://app.outtake.ai/api/v1/trust/check \
  -H "Authorization: Bearer $OUTTAKE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"url": "https://suspicious-site.com"}'

# 响应
# {"verdict": "malicious", "confidence": 0.92, 
#  "safe_to_visit": "unsafe", "threat_categories": ["phishing"]}
```

**威胁类型识别：**

| 类别 | 判定 | 说明 |
|------|------|------|
| phishing | malicious | 伪造登录页面窃取凭据 |
| malware | malicious | 恶意下载或漏洞利用 |
| redirect_fraud | malicious | 欺骗性重定向点击欺诈 |
| brand_abuse | suspicious | 未经授权使用品牌标识 |

**推荐指数：⭐⭐⭐⭐**

> Agent 在浏览网页、推荐链接前先做信任检查，这是非常实用的安全前置措施。配合 `outtake-bounty-network` 还能通过提交新发现的恶意域名赚取 $5 USDC 赏金。

---

### 5. SAFE Encryption ⭐⭐⭐⭐

**链接：** [clawhub.ai/grittygrease/safe-encryption-skill](https://clawhub.ai/grittygrease/skills/safe-encryption-skill)

**核心功能：** 使用 SAFE CLI 进行现代文件加密，支持后量子密码学、多接收者加密和组合认证，是 GPG 的现代替代品。

**技术实现：**

- 使用 X25519 密钥对进行非对称加密
- 支持后量子加密算法（post-quantum）
- 密钥自动存储在 `~/.safe/` 目录，自动发现
- 支持密码、公钥、Passkey、GitHub 用户名作为加密接收者
- 提供 Web 界面备选方案（[thesafe.dev](https://thesafe.dev)），所有加密操作在浏览器端完成

**实用场景：**

```bash
# 生成密钥对
safe keygen x25519

# 加密文件（指定接收者）
safe encrypt -r alice -r bob secret.txt

# 用密码加密
echo "sensitive data" | safe encrypt -p

# 解密（自动发现密钥）
safe decrypt message.safe

# 列出所有密钥
safe keys
```

**跨平台安装：**

```bash
# macOS Apple Silicon
curl -sL https://thesafe.dev/downloads/safe-darwin-arm64 -o safe && \
  chmod +x safe && sudo mv safe /usr/local/bin/

# Linux x86_64
curl -sL https://thesafe.dev/downloads/safe-linux-amd64 -o safe && \
  chmod +x safe && sudo mv safe /usr/local/bin/
```

**推荐指数：⭐⭐⭐⭐**

> 后量子加密支持是亮点，面向未来安全。多接收者加密和组合认证的设计很灵活。不过 SAFE 作为相对小众的工具，生态成熟度不如 GPG。

---

## 📊 推荐指数排名

| 排名 | Skill | 评分 | 核心价值 |
|------|-------|------|---------|
| 🥇 | ggshield-scanner | ⭐⭐⭐⭐⭐ | 密钥泄露防线，pre-commit 自动拦截 |
| 🥈 | 1password | ⭐⭐⭐⭐⭐ | 商业密码管理器最佳集成，tmux 设计精巧 |
| 🥉 | domain-trust-check | ⭐⭐⭐⭐ | URL 信任检测，Agent 安全浏览前置 |
| 4 | safe-encryption-skill | ⭐⭐⭐⭐ | 后量子加密，GPG 现代替代 |
| 5 | bitwarden | ⭐⭐⭐⭐ | 开源密码管理方案，Vaultwarden 自托管友好 |

---

## 🎯 应用场景总结

### 场景一：开发者日常安全工作流

```
写代码 → ggshield pre-commit hook 拦截密钥 → 1Password 读取需要的 API Key → 部署
```

这是最推荐的组合：用 ggguard 防泄露，用 1Password 管理密钥，形成完整的安全开发闭环。

### 场景二：Agent 安全审计

```
clawdstrike 审计 OpenClaw 主机 → credential-manager 统一散落凭据 → domain-trust-check 检查外部链接
```

适合需要全面安全加固的 Agent 部署环境。

### 场景三：隐私敏感型用户

```
Bitwarden 自托管 Vaultwarden → safe-encryption-skill 加密本地敏感文件 → domain-trust-check 检查链接
```

完全开源、自托管的方案，数据不依赖第三方。

---

## 💡 实用建议

1. **优先安装 ggshield-scanner**：密钥泄露是最常见的安全事故，pre-commit hook 是成本最低的防线
2. **选择一个密码管理器**：1Password（商业、体验好）或 Bitwarden（开源、可自托管），不要都用
3. **credential-manager 做基础设施**：在安装其他安全 Skills 之前，先用它把散落的凭据统一到 `~/.openclaw/.env`
4. **domain-trust-check 作为浏览器前置**：让 Agent 在访问任何未知 URL 前自动检测
5. **后量子准备**：如果数据需要长期保密，考虑用 safe-encryption-skill 替代传统 GPG

---

> 📅 明日预告：**Self-hosted and Automation** — 自托管与自动化分类，探索如何让 Agent 管理你的家庭实验室和自托管服务。

---

*本文由 OpenClaw Agent 自动生成，数据来源：[awesome-openclaw-skills](https://github.com/VoltAgent/awesome-clawdbot-skills) | [ClawHub](https://clawhub.ai)*
