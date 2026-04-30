---
title: OpenClaw Skill 每日推荐 - 安全与密码
tags:
  - openclaw
  - skill
  - security
  - password
  - 安全
  - 密码
categories:
  - 技术推荐
abbrlink: 55785
date: 2026-04-30 00:00:00
---

# 🛡️ OpenClaw Skill 每日推荐 - 安全与密码

## 分类概述

安全与密码分类包含 **54 个 skills**，涵盖了密码管理、加密、安全审计、威胁检测等多个领域。在数字化时代，安全是任何 AI 助手和个人工作流的基础，这个分类的技能可以帮助你保护敏感数据、检测威胁、管理凭证，并构建更安全的应用程序。

## 精选 Skill 详解

### 1. 1claw ⭐⭐⭐⭐⭐
**GitHub:** [openclaw/skills/tree/main/skills/kmjones1979/1claw](https://github.com/openclaw/skills/tree/main/skills/kmjones1979/1claw/SKILL.md)

**核心功能:**
- HSM（硬件安全模块）支持的保险库，专为 AI Agent 设计
- 安全存储、轮换和分享代理密钥
- 提供企业级密钥管理方案

**实用场景:**
```bash
# 保存 API 密钥到安全保险库
1claw save openai-api-key

# 获取密钥（自动解密）
1claw get openai-api-key

# 定期轮换密钥
1claw rotate openai-api-key
```

**推荐理由:**
这是 OpenClaw 生态系统中最重要的安全基础设施之一。传统的密码管理器是为人类设计的，而 1claw 是专门为 AI Agent 设计的密钥管理解决方案。使用 HSM 支持可以防止密钥泄露，即使系统被攻破也能保护核心凭证。

---

### 2. Bitwarden ⭐⭐⭐⭐⭐
**GitHub:** [openclaw/skills/tree/main/skills/asleep123/bitwarden](https://github.com/openclaw/skills/tree/main/skills/asleep123/bitwarden/SKILL.md)

**核心功能:**
- 安全访问和管理 Bitwarden/Vaultwarden 密码
- 支持 OTP（一次性密码）代码
- 与流行的开源密码管理器无缝集成

**实用场景:**
```bash
# 搜索并获取密码
bitwarden get github.com

# 自动填充登录凭证
bitwarden autofill login-form.html

# 生成强密码并保存
bitwarden generate --length 32 --save github-new
```

**推荐理由:**
Bitwarden 是最受欢迎的开源密码管理器之一，支持自托管（Vaultwarden）。这个 skill 让 OpenClaw 可以直接操作你的密码库，在需要登录、认证的场景下自动完成。对于已经使用 Bitwarden 的用户来说，这是必备的安全工具。

---

### 3. Domain Trust Check ⭐⭐⭐⭐⭐
**GitHub:** [openclaw/skills/tree/main/skills/jamesouttake/domain-trust-check](https://github.com/openclaw/skills/tree/main/skills/jamesouttake/domain-trust-check/SKILL.md)

**核心功能:**
- 检查 URL 是否为钓鱼、恶意网站
- 检测品牌滥用和诈骗
- 基于 Outtake Trust API 的实时威胁情报

**实用场景:**
```bash
# 在访问前检查网站
domain-trust-check https://example-login.com

# 批量检查可疑链接
domain-trust-check --batch suspicious-links.txt

# 集成到浏览器自动化流程
domain-trust-check --block-evil --allow-trusted
```

**推荐理由:**
钓鱼攻击是网络安全威胁之首。这个 skill 可以在 OpenClaw 访问任何 URL 之前进行安全检查，有效防止钓鱼攻击。特别是当你让 AI 助手帮你浏览网页、填写表单时，这个额外的安全层非常重要。

---

### 4. Safe Encryption Skill ⭐⭐⭐⭐⭐
**GitHub:** [openclaw/skills/tree/main/skills/grittygrease/safe-encryption-skill](https://github.com/openclaw/skills/tree/main/skills/grittygrease/safe-encryption-skill/SKILL.md)

**核心功能:**
- 使用 SAFE CLI 进行加密、解密和密钥管理
- 现代化的 GPG 替代方案
- 支持后量子加密算法

**实用场景:**
```bash
# 加密敏感文件
safe encrypt secret-data.txt -r recipient@example.com

# 解密文件
safe decrypt secret-data.txt.safe

# 管理密钥
safe key generate --algorithm kyber1024
safe key export --public
```

**推荐理由:**
传统的 GPG 使用复杂且与现代加密标准脱节。SAFE 是一个现代化的加密工具，界面友好，支持后量子加密（Post-Quantum Cryptography），为未来的量子计算威胁做好准备。对于需要保护数据隐私的用户来说，这是必备工具。

---

### 5. GGShield Scanner ⭐⭐⭐⭐
**GitHub:** [openclaw/skills/tree/main/skills/amascia-gg/ggshield-scanner](https://github.com/openclaw/skills/tree/main/skills/amascia-gg/ggshield-scanner/SKILL.md)

**核心功能:**
- 检测 500+ 种硬编码的秘密（API 密钥、密码、令牌等）
- 支持 Git pre-commit 钩子
- 实时代码审计

**实用场景:**
```bash
# 扫描代码库
ggshield-scanner scan ./my-project

# 设置 Git pre-commit 钩子
ggshield-scanner install-hook

# 扫描特定的文件或目录
ggshield-scanner scan-file secrets.env
```

**推荐理由:**
代码泄露是安全事件的主要原因之一。开发者经常不小心将 API 密钥、数据库密码等敏感信息提交到代码仓库。GGShield 可以在代码提交前自动扫描，防止敏感信息泄露。对于任何开发团队来说，这都是必须的安全工具。

---

## 其他值得关注的安全 Skills

### credential-manager ⭐⭐⭐⭐⭐
OpenClaw 的强制性安全基础，为所有其他 skills 提供凭证管理支持。

### vnsh ⭐⭐⭐⭐
通过加密的过期链接安全共享文件，无需担心文件被永久泄露。

### secure-auth-patterns ⭐⭐⭐⭐
掌握 JWT、OAuth2、会话管理和 RBAC 等认证授权模式，构建安全应用。

### saysigned ⭐⭐⭐⭐
AI Agent 的电子签名解决方案，符合 ESIGN Act 和 UETA Section 14，具有法律效力。

## 应用场景总结

### 场景 1: 开发者安全工作流
```bash
# 1. 设置密钥管理
1claw init
1claw save github-token

# 2. 启用代码扫描
ggshield-scanner install-hook

# 3. 加密敏感配置
safe encrypt .env -r team@company.com

# 4. 检查外部依赖
domain-trust-check https://third-party-api.com
```

### 场景 2: 个人隐私保护
```bash
# 1. 管理所有密码
bitwarden sync

# 2. 安全分享文件
vnsh upload sensitive-document.pdf --expire 24h

# 3. 检查可疑链接
domain-trust-check https://suspicious-site.com
```

### 场景 3: 企业安全审计
```bash
# 1. 扫描代码库
ggshield-scanner scan --repo .

# 2. 审计认证模式
secure-auth-patterns audit ./auth-module

# 3. 生成安全报告
clawaudit report --format markdown
```

## 推荐指数排名

| 排名 | Skill | 星级 | 核心价值 |
|------|-------|------|----------|
| 1 | 1claw | ⭐⭐⭐⭐⭐ | AI 专用密钥管理 |
| 2 | Bitwarden | ⭐⭐⭐⭐⭐ | 主流密码管理器集成 |
| 3 | Domain Trust Check | ⭐⭐⭐⭐⭐ | 钓鱼攻击防护 |
| 4 | Safe Encryption Skill | ⭐⭐⭐⭐⭐ | 后量子加密 |
| 5 | GGShield Scanner | ⭐⭐⭐⭐ | 防止代码泄露 |
| 6 | credential-manager | ⭐⭐⭐⭐⭐ | OpenClaw 安全基础 |
| 7 | vnsh | ⭐⭐⭐⭐ | 安全文件共享 |
| 8 | secure-auth-patterns | ⭐⭐⭐⭐ | 认证授权最佳实践 |
| 9 | saysigned | ⭐⭐⭐⭐ | 法律效力电子签名 |
| 10 | outtake-bounty-network | ⭐⭐⭐⭐ | 挖掘漏洞赚取赏金 |

## 安全最佳实践建议

### 1. 密码管理
- 使用不同的密码：每个服务使用唯一强密码
- 启用 2FA/MFA：为重要账户启用双因素认证
- 定期轮换密钥：特别是 API 密钥和访问令牌
- 使用密码管理器：避免记忆多个复杂密码

### 2. 代码安全
- 从不提交敏感信息：使用 .gitignore 排除配置文件
- 使用环境变量：敏感配置通过环境变量传递
- 启用 pre-commit 钩子：自动扫描提交的代码
- 定期审计依赖：检查第三方库的安全性

### 3. 加密与密钥
- 传输时加密：HTTPS、TLS 是基本要求
- 静态加密：敏感文件存储前加密
- 密钥分离：开发、测试、生产环境使用不同密钥
- 最小权限原则：只授予必要的权限

### 4. 威胁防护
- 检查链接：点击前验证 URL 安全性
- 可疑行为监控：设置异常行为告警
- 定期备份：加密备份重要数据
- 应急响应：制定安全事件响应计划

## 总结

安全与密码分类的 54 个 skills 构建了一个完整的安全生态系统，从基础的密码管理到高级的加密技术，从代码安全到威胁防护。无论你是个人用户还是企业开发者，都能在这里找到适合的安全工具。

**最重要的建议：** 安全不是一次性配置，而是持续的过程。建议从 credential-manager 和 bitwarden 开始，逐步建立起完整的安全防护体系。

---

*明日预告：Apple 应用与服务分类 - 探索 Apple 生态系统的 AI 助手集成技能*
