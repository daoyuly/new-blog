---
title: OpenClaw Skill 每日推荐 - DevOps & Cloud
date: 2026-04-12
tags: [openclaw, skill, devops, cloud, devops-and-cloud]
categories: [技术推荐]
---

# 🚀 OpenClaw Skill 每日推荐 - DevOps & Cloud

> 第 10 天 | 共 30 个分类 | 当前分类包含 **392 个技能**

## 📊 今日分类概述

**DevOps & Cloud** 分类涵盖了云服务管理、DevOps 自动化、基础设施即代码、监控告警、容器编排、安全扫描等领域的技能。这些技能帮助 AI 代理完成从基础设施部署到生产运维的全流程自动化。

### 核心领域分布

- **云平台管理**：AWS、Azure、CloudStack、Hetzner Cloud、RunPod GPU
- **容器与编排**：Docker、Kubernetes、Docker Swarm
- **监控与可观测**：Grafana、CloudWatch、Loki、Elasticsearch
- **安全扫描**：AWS Security Scanner、Credence、Aegis Audit
- **基础设施自动化**：Ansible、Terraform、Makefile Build
- **网络与 CDN**：Cloudflare、Aruba IAP、OPNsense
- **备份与恢复**：Duplicati、S3 Sort、Secrets Management
- **持续集成/部署**：Railway Deploy、AZD Deployment、AppDeploy

---

## ⭐ 精选 Skill 详解

### 1. 🌥️ aws-infra - AWS 基础设施智能助手

**GitHub**: [openclaw/skills - aws-infra](https://github.com/openclaw/skills/tree/main/skills/bmdhodl/aws-infra)

**核心功能**:
- 通过 AWS CLI 和控制台进行聊天式基础设施管理
- 自动创建、配置和管理 AWS 资源
- EC2 实例、Lightsail、S3、VPC 等资源的全生命周期管理

**技术实现**:
- 集成 AWS CLI 命令行工具
- 结合 AWS SDK 进行 API 调用
- 自然语言到 AWS 命令的智能转换

**实用场景**:
```
用户: "帮我创建一个 t3.medium 类型的 EC2 实例，放在 us-east-1，安装 nginx"
AI: 自动执行：
1. 启动 EC2 实例
2. 配置安全组开放 80/443 端口
3. 运行用户数据脚本安装 nginx
4. 返回公网 IP 和访问链接
```

**推荐指数**: ⭐⭐⭐⭐⭐ (5/5)
> **理由**: AWS 是最主流的云平台，这个技能让 AI 能够真正"操作"云资源，实现从"查询"到"管理"的跨越。

---

### 2. 🐳 docker-skill - Docker 容器管理专家

**GitHub**: [openclaw/skills - docker-skill](https://github.com/openclaw/skills/tree/main/skills/runeweaverstudios/docker-skill)

**核心功能**:
- 可靠地安装和使用 Docker
- 基于官方文档的容器管理
- 镜像构建、容器编排、网络配置

**技术实现**:
- 完整的 Docker CLI 封装
- 官方文档实时参考
- 错误处理和回滚机制

**实用场景**:
```
用户: "帮我部署一个 PostgreSQL 数据库，设置持久化存储，暴露 5432 端口"
AI: 自动执行：
1. docker pull postgres:latest
2. docker volume create pgdata
3. docker run -d --name postgres \
     -v pgdata:/var/lib/postgresql/data \
     -p 5432:5432 \
     -e POSTGRES_PASSWORD=xxx \
     postgres
4. 验证服务健康状态
```

**推荐指数**: ⭐⭐⭐⭐⭐ (5/5)
> **理由**: Docker 是现代 DevOps 的基石，这个技能让 AI 能够完整管理容器化应用，从开发到生产环境无缝衔接。

---

### 3. ☁️ cloudflare-guard - Cloudflare 安全与 CDN 管理

**GitHub**: [openclaw/skills - cloudflare-guard](https://github.com/openclaw/skills/tree/main/skills/guifav/cloudflare-guard)

**核心功能**:
- 通过 API 管理 Cloudflare DNS 和 CDN
- 配置 SSL/TLS、缓存策略
- 设置防火墙规则、速率限制
- Workers 脚本部署

**技术实现**:
- Cloudflare API v4 集成
- 全面的 DNS 记录管理（A、CNAME、TXT、MX 等）
- Page Rules 和 WAF 规则配置

**实用场景**:
```
用户: "为 myapp.com 配置 Cloudflare，开启 HTTPS，设置缓存规则，屏蔽恶意流量"
AI: 自动执行：
1. 添加域名到 Cloudflare
2. 配置 DNS 记录指向服务器
3. 启用 Full SSL 模式
4. 设置 Page Rules 缓存静态资源
5. 配置 WAF 规则屏蔽常见攻击
6. 启用 Bot 防护
```

**推荐指数**: ⭐⭐⭐⭐ (4.5/5)
> **理由**: Cloudflare 是应用安全的"瑞士军刀"，这个技能让 AI 能够一键完成从 DNS 到 WAF 的全套安全配置。

---

### 4. 📈 grafana-lens - 全栈可观测性平台

**GitHub**: [openclaw/skills - grafana-lens](https://github.com/openclaw/skills/tree/main/skills/awsome-o/grafana-lens)

**核心功能**:
- **16 个智能工具**覆盖全栈监控
- 查询仪表板和监控指标
- 管理告警规则和通知渠道
- 追踪分布式链路（APM）
- 无需了解底层查询语言

**技术实现**:
- Grafana REST API 集成
- 自动生成和执行查询
- 多数据源支持（Prometheus、Loki、Elasticsearch）

**实用场景**:
```
用户: "过去一小时 CPU 使用率超过 80% 的服务器有哪些？"
AI: 自动执行：
1. 查询相关仪表板
2. 过滤 CPU 指标
3. 生成异常服务器列表
4. 提供日志关联分析
5. 推荐优化建议
```

**推荐指数**: ⭐⭐⭐⭐⭐ (5/5)
> **理由**: 可观测性是 DevOps 的"眼睛"，这个技能让 AI 成为全天候的运维专家，主动发现和解决问题。

---

### 5. 🔐 secrets-management - 密钥管理安全卫士

**GitHub**: [openclaw/skills - secrets-management](https://github.com/openclaw/skills/tree/main/skills/brandonwise/secrets-management)

**核心功能**:
- CI/CD 流水线的安全密钥管理
- 集成 Vault、AWS Secrets Manager
- 支持原生平台密钥方案
- 自动轮换和撤销密钥

**技术实现**:
- 多密钥存储后端支持
- 加密传输和存储
- 粒度访问控制
- 审计日志记录

**实用场景**:
```
用户: "为我的 GitHub Action 配置 AWS 和 Docker Hub 密钥，启用自动轮换"
AI: 自动执行：
1. 在 AWS Secrets Manager 创建密钥
2. 配置 GitHub Action Secrets
3. 设置密钥轮换策略（每月）
4. 配置告警通知
5. 生成访问凭证文档
```

**推荐指数**: ⭐⭐⭐⭐⭐ (5/5)
> **理由**: 安全是 DevOps 的生命线，这个技能确保 AI 不会在自动化过程中泄露敏感信息，让"自动化"与"安全"兼得。

---

## 💡 应用场景总结

### 场景 1: 全栈应用一键部署
```bash
# 用户的一句话需求
"帮我部署一个 Node.js + PostgreSQL 的 Web 应用，配置 HTTPS、监控和自动备份"

# AI 自动完成的完整流程
1. 使用 aws-infra 创建 EC2 实例
2. 使用 docker-skill 部署容器化应用
3. 使用 cloudflare-guard 配置域名和 SSL
4. 使用 grafana-lens 设置监控告警
5. 使用 secrets-management 管理数据库密码
6. 配置定时备份到 S3
```

### 场景 2: 基础设施安全加固
```bash
# 安全审计与加固
"检查我的 AWS 账户安全风险，并应用最佳实践"

# AI 执行的安全检查
1. aws-security-scanner 扫描安全漏洞
2. credence 检查信任注册表
3. cloudflare-guard 配置 WAF 规则
4. secrets-management 轮换长期密钥
5. 生成安全审计报告
```

### 场景 3: 故障快速响应
```bash
# 生产事故处理
"我的应用响应变慢了，帮我诊断问题"

# AI 的诊断流程
1. grafana-lens 查询监控指标
2. log-dive 搜索错误日志
3. nexus-sentinel 分析系统健康
4. 自动扩展资源（如果需要）
5. 生成事故报告和改进建议
```

---

## 🏆 推荐指数排名

| 排名 | Skill | 推荐指数 | 核心价值 |
|------|-------|----------|----------|
| 1 | docker-skill | ⭐⭐⭐⭐⭐ | 容器化是现代应用的标配 |
| 2 | grafana-lens | ⭐⭐⭐⭐⭐ | 可观测性是运维的眼睛 |
| 3 | secrets-management | ⭐⭐⭐⭐⭐ | 安全是 DevOps 的生命线 |
| 4 | aws-infra | ⭐⭐⭐⭐⭐ | AWS 是最主流的云平台 |
| 5 | cloudflare-guard | ⭐⭐⭐⭐ | 一站式应用安全防护 |
| 6 | terraform-plan-review | ⭐⭐⭐⭐ | 基础设施变更风险控制 |
| 7 | ansible-skill | ⭐⭐⭐⭐ | 自动化配置管理 |
| 8 | aws-solution-architect | ⭐⭐⭐⭐ | 云架构设计助手 |
| 9 | service-watchdog | ⭐⭐⭐⭐ | 轻量级服务监控 |
| 10 | railway-deploy | ⭐⭐⭐⭐ | 一键 PaaS 部署 |

---

## 🎯 学习建议

### 初学者路径
1. **从 docker-skill 开始** - 学习容器化基础
2. **实践 aws-infra** - 熟悉云平台操作
3. **配置 grafana-lens** - 建立监控意识
4. **掌握 secrets-management** - 养成安全习惯

### 进阶组合拳
- **DevOps 全套**: docker-skill + ansible-skill + terraform-plan-review
- **云原生栈**: aws-infra + k8s-memory-tune + grafana-lens
- **安全防护**: cloudflare-guard + aws-security-scanner + secrets-management

### 实用技巧
- 🔄 **定期备份**: 使用 duplicati-skill 或 s3-sort
- 📊 **成本优化**: sovereign-aws-cost-optimizer 分析账单
- 🚨 **主动告警**: grafana-lens + alert-manager 组合
- 🛡️ **零信任架构**: ztp + credence + agentguard

---

## 📚 相关资源

- **官方文档**: [OpenClaw Docs](https://docs.openclaw.ai)
- **技能仓库**: [awesome-openclaw-skills](https://github.com/openclaw/skills)
- **社区交流**: [OpenClaw Discord](https://discord.com/invite/clawd)
- **技能发现**: [ClawHub](https://clawhub.com)

---

## 🔮 明日预告

明天我们将探索 **Coding Agents & IDEs** 分类（1200 个技能！），这是最大的分类之一，涵盖 AI 编程助手、IDE 集成、代码生成、代码审查等众多黑科技。

敬请期待！🚀

---

> **每日金句**: *"DevOps 不是工具，而是一种文化。当 AI 掌握了 DevOps 的精髓，它就不再是冷冰冰的代码生成器，而是能够与人类共同守护生产环境的可靠伙伴。"* — 来顺
