---
title: OpenClaw Skill 每日推荐 - DevOps 与云服务
date: 2026-07-13 11:30:00
tags:
  - openclaw
  - skill
  - devops
  - cloud
categories:
  - 技术推荐
---

# 🚀 OpenClaw Skill 每日推荐 — DevOps 与云服务

> 第 10 期 | 2026年7月13日

今天我们进入 OpenClaw Skill 生态中最大的分类之一：**DevOps 与云服务**。这个分类包含了 **392 个 Skill**，覆盖了从基础设施管理、容器编排到监控告警、安全审计的全链路 DevOps 场景。无论你是管理 AWS、Azure 还是自建 Homelab，都能找到趁手的工具。

---

## 📊 今日分类概述

| 维度 | 数据 |
|------|------|
| 分类名称 | DevOps & Cloud |
| Skill 总数 | 392 |
| 核心领域 | 云基础设施、容器管理、监控告警、安全审计、自动化部署 |
| 涉及云平台 | AWS、Azure、Cloudflare、Hetzner、Vercel、Railway、RunPod 等 |

---

## 🏆 精选 Skill 详解

### 1. agentic-devops

- **GitHub**: [openclaw/skills - agentic-devops](https://github.com/openclaw/skills/tree/main/skills/tkuehnl/agentic-devops/SKILL.md)
- **推荐指数**: ⭐⭐⭐⭐⭐

**核心功能**: 生产级 Agent DevOps 工具包，集 Docker 管理、进程管理、日志分析和健康监控于一体。

**实用场景**:
- 通过自然语言指令管理 Docker 容器的启停和编排
- 自动分析应用日志，定位性能瓶颈和异常模式
- 持续监控服务健康状态，异常时自动触发告警

**技术实现**: 基于 Docker CLI 和系统进程工具，将常见 DevOps 操作封装为 Skill 指令，Agent 可直接调用而无需记忆复杂的 CLI 参数组合。

**适合谁**: 需要频繁管理容器和服务的中大型项目团队，特别是想要"用对话搞定运维"的团队。

---

### 2. cf-manager (Cloudflare Manager)

- **GitHub**: [openclaw/skills - cf-manager](https://github.com/openclaw/skills/tree/main/skills/rexlunae/cf-manager/SKILL.md)
- **推荐指数**: ⭐⭐⭐⭐⭐

**核心功能**: 通过 Cloudflare API 全面管理 DNS、Page Rules、SSL/TLS、缓存、防火墙规则和 Workers。

**实用场景**:
- 批量修改 DNS 记录，域名迁移一键搞定
- 配置防火墙规则和速率限制，防御 DDoS 和恶意爬虫
- 管理 Workers 脚本部署，无服务器函数即说即配

**代码示例**:
```bash
# 添加 DNS 记录
"帮我在 example.com 下添加一条 A 记录，指向 1.2.3.4"
# 设置缓存规则
"给 /api/* 路径设置 no-cache 规则"
# 开启 SSL
"把 example.com 的 SSL 模式设为 full(strict)"
```

**技术实现**: 封装 Cloudflare REST API v4，支持 Token 认证，所有操作都有输入验证和错误回退。

**适合谁**: 重度 Cloudflare 用户，特别是管理多个域名和 Zone 的开发者。

---

### 3. grafana-lens

- **GitHub**: [openclaw/skills - grafana-lens](https://github.com/openclaw/skills/tree/main/skills/awsome-o/grafana-lens/SKILL.md)
- **推荐指数**: ⭐⭐⭐⭐½

**核心功能**: 完整的 Grafana 访问能力——查询数据、管理仪表盘、配置告警、追踪链路，提供 16 个 Agent 工具。

**实用场景**:
- 查询 Prometheus 指标，生成实时性能报告
- 自动创建和更新监控仪表盘
- 配置告警规则，当服务异常时第一时间通知
- 查看 Jaeger/Tempo 追踪数据，定位延迟根因

**技术实现**: 通过 Grafana HTTP API 实现所有操作，支持 API Key 和 Basic Auth 认证，兼容 Grafana 9.x+。

**适合谁**: 使用 Grafana 作为可观测性平台的 SRE 和 DevOps 工程师。

---

### 4. aws-infra

- **GitHub**: [openclaw/skills - aws-infra](https://github.com/openclaw/skills/tree/main/skills/bmdhodl/aws-infra/SKILL.md)
- **推荐指数**: ⭐⭐⭐⭐

**核心功能**: 基于对话的 AWS 基础设施助手，通过 AWS CLI 和控制台管理云资源。

**实用场景**:
- 查看 EC2 实例状态和 CloudWatch 指标
- 管理 S3 存储桶和 IAM 策略
- 配置 VPC、子网和安全组

**代码示例**:
```
"列出 us-east-1 区域所有运行中的 EC2 实例"
"检查我的 S3 存储桶哪些没有开启版本控制"
"帮我创建一个允许只读 S3 访问的 IAM 策略"
```

**技术实现**: 直接调用 AWS CLI，需要本地配置好 AWS credentials（~/.aws/credentials）。

**适合谁**: AWS 日常运维人员，想要快速查询和操作而不用记 CLI 命令。

---

### 5. hcloud (Hetzner Cloud)

- **GitHub**: [openclaw/skills - hcloud](https://github.com/openclaw/skills/tree/main/skills/jpj069/hcloud/SKILL.md)
- **推荐指数**: ⭐⭐⭐⭐

**核心功能**: 使用 hcloud CLI 管理 Hetzner Cloud 基础设施——服务器、网络、防火墙、负载均衡等。

**实用场景**:
- 创建和管理云服务器（CX 系列性价比极高）
- 配置私有网络和防火墙规则
- 管理 Load Balancer 和 Volume

**为什么推荐 Hetzner**: 性价比远超 AWS/Azure，同等配置价格约为 AWS 的 1/5，特别适合个人项目和中型团队。

**技术实现**: 封装 hcloud CLI，需要 Hetzner API Token（从 Hetzner Cloud Console 获取）。

**适合谁**: 追求性价比的欧洲/亚洲部署方案，Homelab 爱好者。

---

## 🎯 应用场景总结

| 场景 | 推荐 Skill |
|------|-----------|
| 日常容器运维 | agentic-devops、dacker、docker-skill |
| CDN/DNS 管理 | cf-manager、cloudflare-guard |
| 可观测性 | grafana-lens、log-dive、rollbar |
| AWS 管理 | aws-infra、aws-security-scanner、aws-ecs-monitor |
| Azure 管理 | azure-infra、azd-deployment、azure-cli |
| 高性价比云服务器 | hcloud、runpod |
| 安全审计 | aegis-audit、ztp、depguard |
| Terraform 审查 | tf-plan-review |
| CI/CD 部署 | railway-deploy、appdeploy |
| 日志统一搜索 | log-dive（Loki + ES + CloudWatch） |

---

## 📈 推荐指数排名

| 排名 | Skill | 评分 | 一句话点评 |
|------|-------|------|-----------|
| 1 | agentic-devops | ⭐⭐⭐⭐⭐ | DevOps 全家桶，一个顶仨 |
| 2 | cf-manager | ⭐⭐⭐⭐⭐ | Cloudflare 管理必备，API 覆盖全面 |
| 3 | grafana-lens | ⭐⭐⭐⭐½ | 可观测性中枢，16 工具包打天下 |
| 4 | aws-infra | ⭐⭐⭐⭐ | AWS 用户的对话式运维助手 |
| 5 | hcloud | ⭐⭐⭐⭐ | 性价比之选，Hetzner 云管理利器 |

---

## 💡 实用建议

1. **从 agentic-devops 入手** — 如果你不确定先装哪个，这个是最佳起点，覆盖了最常用的运维操作
2. **安全优先** — 搭配 `aegis-audit` 或 `ztp` 做安全审查，避免 Skill 本身成为攻击面
3. **日志先行** — 部署任何服务前先配好 `grafana-lens` + `log-dive`，否则出了问题两眼一抹黑
4. **多云管理** — 如果同时用 AWS + Cloudflare，`aws-infra` + `cf-manager` 组合拳效率翻倍
5. **成本控制** — 用 `sovereign-aws-cost-optimizer` 定期审查 AWS 账单，省下的钱比 Skill 开发时间值钱多了

---

> 🎋 每天一个分类，30 天带你走遍 OpenClaw Skill 生态。明天见！
>
> 上一篇：[数据分析](#) | 下一篇：[游戏](#)
