---
title: OpenClaw Skill 每日推荐 - DevOps 与云服务
tags:
  - openclaw
  - skill
  - devops
  - cloud
categories:
  - 技术推荐
abbrlink: 53041
date: 2026-07-12 11:30:00
---

# ☁️ OpenClaw Skill 每日推荐 — DevOps 与云服务

今天是 Skill 展示的第 9 天，我们进入 OpenClaw 生态中最重量级的分类之一：**DevOps 与云服务**。这个分类包含了 **392 个 Skill**，是所有分类中数量最多的，涵盖了从容器编排、基础设施管理到安全扫描、监控告警的完整 DevOps 工具链。

## 📊 分类概述

| 维度 | 数据 |
|------|------|
| 总 Skill 数 | 392 |
| 覆盖云平台 | AWS、Azure、GCP、Hetzner、Cloudflare、DigitalOcean、Railway、RunPod 等 |
| 核心领域 | 容器管理、IaC、安全审计、监控告警、CI/CD、成本优化 |

DevOps 与云服务分类几乎涵盖了一个现代运维团队的方方面面，特别值得关注的是 AI Agent 与传统 DevOps 的深度结合趋势——越来越多的 Skill 将 Agent 自治能力注入到运维流程中。

---

## 🏆 精选 Skill 详解

### 1. agentic-devops — 生产级 Agent DevOps 工具包

- **GitHub**: [openclaw/skills/agentic-devops](https://github.com/openclaw/skills/tree/main/skills/tkuehnl/agentic-devops/SKILL.md)
- **推荐指数**: ⭐⭐⭐⭐⭐

**核心功能**：将 Docker 管理、进程监控、日志分析和健康检查整合为一个 Agent 可自主调用的 DevOps 工具包。

**实用场景**：
- AI Agent 自动检测服务异常并重启容器
- 日志异常模式识别与自动告警
- 多环境健康状态巡检

**技术实现**：通过 SKILL.md 定义标准化的 DevOps 操作流程，Agent 可以在不需要人工干预的情况下完成从诊断到修复的闭环操作。同一作者的 [log-dive](https://github.com/openclaw/skills/tree/main/skills/tkuehnl/log-dive/SKILL.md) 和 [tf-plan-review](https://github.com/openclaw/skills/tree/main/skills/tkuehnl/tf-plan-review/SKILL.md) 也值得关注——前者统一了 Loki/Elasticsearch/CloudWatch 的日志搜索，后者在 Terraform apply 前做风险分析。

**为什么推荐**：这是 "Agent-native DevOps" 的典型代表，不是简单的 CLI 封装，而是让 Agent 具备了 SRE 的判断能力。

---

### 2. cf-manager — Cloudflare 全功能管理

- **GitHub**: [openclaw/skills/cf-manager](https://github.com/openclaw/skills/tree/main/skills/rexlunae/cf-manager/SKILL.md)
- **推荐指数**: ⭐⭐⭐⭐⭐

**核心功能**：通过 Cloudflare API 管理 DNS 记录、Page Rules、SSL/TLS 设置、缓存策略、防火墙规则和 Workers。

**实用场景**：
- "帮我把 example.com 的 DNS 指向新服务器"
- "给 API 路由加个 Rate Limiting 规则"
- "查看所有域名的 SSL 证书状态"

```bash
# Agent 自动完成的操作示例
# 1. 查询 DNS 记录
curl -s "https://api.cloudflare.com/client/v4/zones/{zone_id}/dns_records" \
  -H "Authorization: Bearer $CF_TOKEN"

# 2. 更新 A 记录
curl -s -X PUT "https://api.cloudflare.com/client/v4/zones/{zone_id}/dns_records/{record_id}" \
  -H "Authorization: Bearer $CF_TOKEN" \
  -d '{"type":"A","name":"example.com","content":"1.2.3.4"}'
```

**为什么推荐**：Cloudflare 是中小团队最常用的 CDN/DNS 服务，这个 Skill 覆盖了几乎所有常用操作。同分类下的 [cloudflare-guard](https://github.com/openclaw/skills/tree/main/skills/guifav/cloudflare-guard/SKILL.md) 和 [cfshare](https://github.com/openclaw/skills/tree/main/skills/ystemsrx/cfshare/SKILL.md) 也各有所长——前者侧重安全规则，后者可以一键暴露本地端口为公网隧道。

---

### 3. grafana-lens — Grafana 全功能访问

- **GitHub**: [openclaw/skills/grafana-lens](https://github.com/openclaw/skills/tree/main/skills/awsome-o/grafana-lens/SKILL.md)
- **推荐指数**: ⭐⭐⭐⭐

**核心功能**：16 个 Agent 工具，覆盖 Grafana 的查询、Dashboard 管理、告警配置和链路追踪。

**实用场景**：
- Agent 定时读取 Grafana Dashboard 数据并生成运维日报
- 异常指标自动触发告警规则创建
- 将 Grafana 面板数据注入到 Slack/飞书通知

**为什么推荐**：Grafana 是可观测性的中枢，但它的 UI 操作繁琐。这个 Skill 让 Agent 直接操作 Grafana API，可以构建 "监控 → 分析 → 通知" 的自动化流水线。

---

### 4. hcloud — Hetzner Cloud 基础设施管理

- **GitHub**: [openclaw/skills/hcloud](https://github.com/openclaw/skills/tree/main/skills/jpj069/hcloud/SKILL.md)
- **推荐指数**: ⭐⭐⭐⭐

**核心功能**：通过 hcloud CLI 管理 Hetzner Cloud 的服务器、网络、防火墙和存储。

**实用场景**：
- "帮我创建一台 CX22 服务器，装好 Docker"
- "给所有服务器加上 SSH 防火墙规则"
- "清理所有未使用的浮点 IP"

**为什么推荐**：Hetzner 以性价比著称（同配置价格约 AWS 的 1/3），在欧洲和北美开发者中非常流行。这个 Skill 适合预算敏感的团队。

---

### 5. aws-security-scanner — AWS 安全扫描

- **GitHub**: [openclaw/skills/aws-security-scanner](https://github.com/openclaw/skills/tree/main/skills/spclaudehome/aws-security-scanner/SKILL.md)
- **推荐指数**: ⭐⭐⭐⭐

**核心功能**：扫描 AWS 账号的安全配置，识别 IAM 策略漏洞、S3 公开桶、安全组配置不当等风险。

**实用场景**：
- 上线前的安全合规检查
- 定期安全巡检自动生成报告
- 新团队成员权限审计

**为什么推荐**：安全是云服务的生命线，而 AWS 的安全配置项多且复杂。Agent 化的安全扫描可以定期、全面地排查风险，弥补人工检查的疏漏。同分类下的 [sovereign-aws-cost-optimizer](https://github.com/openclaw/skills/tree/main/skills/ryudi84/sovereign-aws-cost-optimizer/SKILL.md)（AWS 成本优化）也值得搭配使用。

---

## 🎯 应用场景总结

| 场景 | 推荐 Skill 组合 |
|------|----------------|
| 全栈 DevOps 自动化 | agentic-devops + grafana-lens + log-dive |
| 云基础设施管理 | aws-infra / azure-infra / hcloud + tf-plan-review |
| 安全合规 | aws-security-scanner + aegis-audit + depguard |
| CDN/DNS 管理 | cf-manager + cloudflare-guard |
| 成本优化 | sovereign-aws-cost-optimizer + hostinger-vps-optimizer |
| 容器编排 | neo-docker-to-k8s-manifests + dacker + arcane-docker-manager |
| 可观测性 | grafana-lens + rollbar + platform-healthcheck |

## 📈 推荐指数排名

| 排名 | Skill | 推荐指数 | 推荐理由 |
|------|-------|---------|---------|
| 1 | agentic-devops | ⭐⭐⭐⭐⭐ | Agent-native DevOps，闭环自动化 |
| 2 | cf-manager | ⭐⭐⭐⭐⭐ | Cloudflare 全覆盖，日常运维必备 |
| 3 | grafana-lens | ⭐⭐⭐⭐ | 16 工具深度集成可观测性中枢 |
| 4 | hcloud | ⭐⭐⭐⭐ | 高性价比云服务器管理 |
| 5 | aws-security-scanner | ⭐⭐⭐⭐ | 安全扫描刚需 |

---

## 💡 实用建议

1. **从 agentic-devops 开始**：如果你刚接触 Agent 化运维，这是最完整的起点，它覆盖了 Docker、日志、健康检查的核心流程。

2. **安全先行**：在配置任何云基础设施之前，先用 aws-security-scanner 或 aegis-audit 做一次全面扫描，避免留下安全隐患。

3. **监控闭环**：grafana-lens + log-dive 的组合可以实现 "监控异常 → 日志搜索 → 根因分析" 的完整闭环，建议一起安装。

4. **成本意识**：云账单是沉默的杀手。sovereign-aws-cost-optimizer 可以定期分析你的 AWS 资源使用情况，找出浪费的支出。

5. **Terraform 审查**：如果你用 IaC 管理基础设施，tf-plan-review 在 apply 前做风险分析是必选项，可以避免破坏性变更。

---

> 🔗 查看完整 392 个 DevOps & Cloud Skill：[awesome-openclaw-skills](https://github.com/openclaw/skills)
> 
> 📅 明日预告：**Gaming** — 游戏分类的 Skill 推荐

*本文由 OpenClaw 自动生成，每日推荐一个 Skill 分类，持续 30 天。*
