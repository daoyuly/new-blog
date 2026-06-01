---
title: OpenClaw Skill 每日推荐 - DevOps 与云服务
tags:
  - openclaw
  - skill
  - devops
  - cloud
  - k8s
  - aws
categories:
  - 技术推荐
abbrlink: 53041
date: 2026-06-01 11:30:00
---

# OpenClaw Skill 每日推荐 - DevOps 与云服务 ☁️

> 第 9 期 | 2026 年 6 月 1 日

今天我们进入 **DevOps & Cloud（DevOps 与云服务）** 分类——这是 OpenClaw 生态中最大的分类之一，收录了 **392 个 Skills**，覆盖了从基础设施管理、容器编排、云平台运维到监控告警的完整 DevOps 链路。

## 📊 分类概览

DevOps & Cloud 分类几乎涵盖了现代运维的所有场景：

| 领域 | 典型 Skills | 数量级 |
|------|------------|--------|
| 云平台管理 | AWS、Azure、GCP、Hetzner | 30+ |
| 容器与编排 | Docker、Kubernetes | 20+ |
| 监控与告警 | Grafana、Rollbar、CloudWatch | 15+ |
| CI/CD 与部署 | Railway、Vercel、Laravel Forge | 20+ |
| 基础设施即代码 | Terraform、Ansible | 10+ |
| 安全审计 | Aegis Audit、DepGuard、ZTP | 15+ |
| 网络与 DNS | Cloudflare、OPNsense、AdGuard | 10+ |

以下是精选的 5 个代表性 Skill 深度解析。

---

## 🏆 精选 Skill 详解

### 1. Agentic DevOps

**GitHub:** [openclaw/skills - agentic-devops](https://github.com/openclaw/skills/tree/main/skills/tkuehnl/agentic-devops/SKILL.md)
**推荐指数:** ⭐⭐⭐⭐⭐

**核心功能：** 生产级 Agent DevOps 工具包，集成了 Docker 管理、进程监控、日志分析和健康检查于一体。

**实用场景：**
- 自动化容器生命周期管理（创建、启动、停止、销毁）
- 实时监控服务健康状态并触发自动恢复
- 跨服务的统一日志搜索与异常分析

**技术亮点：** 作为专门为 AI Agent 设计的 DevOps 套件，它将传统的运维操作封装为 Agent 可直接调用的技能接口，实现了 "对话式运维" 的体验。配合同作者的 `log-dive` 和 `tf-plan-review` Skills，可以构建完整的 DevOps 工作流。

---

### 2. Grafana Lens

**GitHub:** [openclaw/skills - grafana-lens](https://github.com/openclaw/skills/tree/main/skills/awsome-o/grafana-lens/SKILL.md)
**推荐指数:** ⭐⭐⭐⭐⭐

**核心功能：** 完整的 Grafana 访问能力——查询数据源、管理仪表盘、配置告警规则、链路追踪，提供 **16 个 Agent 工具**。

**实用场景：**
- "查看今天所有服务的 P99 延迟"
- 自动创建告警规则并在异常时通知
- 无需打开浏览器即可获取监控面板数据
- 追踪分布式系统中的性能瓶颈

**技术亮点：** 16 个专用工具覆盖了 Grafana API 的核心能力，Agent 可以像 SRE 工程师一样通过自然语言完成监控体系的搭建和维护。

---

### 3. K8s Memory Tune

**GitHub:** [openclaw/skills - k8s-memory-tune](https://github.com/openclaw/skills/tree/main/skills/2233admin/k8s-memory-tune/SKILL.md)
**推荐指数:** ⭐⭐⭐⭐

**核心功能：** 专注于 Kubernetes 内存问题诊断与调优，处理 OOMKilled、JVM 堆配置、容器内存限制等常见痛点。

**实用场景：**
```bash
# Agent 自动诊断 Pod 被 OOMKilled 的原因
# 检查内存限制设置、JVM 堆大小、实际内存使用
# 给出具体的调优建议和 YAML 修改方案
```

**触发词：** `oomkilled`、`memory_limit`、`jvm_heap`、`container_memory`、`k8s 内存`

**技术亮点：** K8s 内存问题是生产环境最高频的故障之一，这个 Skill 针对性地解决了这一痛点。它理解 JVM、Go、Node.js 等不同运行时的内存模型，能给出精准的 `resources.limits` 和 `resources.requests` 配置建议。

---

### 4. CF Manager（Cloudflare 全能管理）

**GitHub:** [openclaw/skills - cf-manager](https://github.com/openclaw/skills/tree/main/skills/rexlunae/cf-manager/SKILL.md)
**推荐指数:** ⭐⭐⭐⭐

**核心功能：** 通过 API 全面管理 Cloudflare——DNS 区域与记录、页面规则、SSL/TLS 设置、缓存策略、防火墙规则、Workers。

**实用场景：**
```bash
# 快速添加 DNS 记录
# 配置防火墙规则封禁恶意 IP
# 管理 Workers 路由和边缘函数
# 批量更新 SSL 设置
```

**技术亮点：** Cloudflare 的 Web 控制台操作繁琐，这个 Skill 让 Agent 通过 API 一次性完成复杂配置。配合 `cloudflare-guard` 和 `cfshare`（Cloudflare Quick Tunnel）等 Skills，可以构建完整的 Cloudflare 自动化管理方案。

---

### 5. Railway Deploy

**GitHub:** [openclaw/skills - railway-deploy](https://github.com/openclaw/skills/tree/main/skills/dbanys/railway-deploy/SKILL.md)
**推荐指数:** ⭐⭐⭐⭐

**核心功能：** 一键将代码部署到 Railway 云平台，支持自然语言触发整个部署流程。

**实用场景：**
- "帮我把这个项目部署上线"
- "railway up" 即可完成推送和部署
- 管理环境变量、数据库连接、服务编排

**技术亮点：** 将 Railway 的部署命令封装为 Agent 技能，从代码推送、环境配置到服务启动，全部通过对话完成。特别适合快速原型验证和小团队敏捷部署。

---

## 🎯 应用场景总结

### 场景一：全栈运维自动化

组合 `agentic-devops` + `grafana-lens` + `k8s-memory-tune`，构建一个能自动监控、诊断、修复的 AI SRE：

```
用户: "线上服务响应变慢了"
Agent: → 查询 Grafana 仪表盘发现 P99 延迟飙升
       → 检查 K8s Pod 发现内存接近 limit
       → 自动调整 resources 并触发滚动更新
```

### 场景二：基础设施安全加固

使用 `aws-security-scanner` + `depguard` + `aegis-audit` + `ztp`（Zero Trust Protocol），建立安全审计流水线。

### 场景三：多云管理

- AWS: `aws-infra`、`aws-solution-architect`
- Azure: `azure-cli`、`azd-deployment`
- Hetzner: `hcloud`
- Cloudflare: `cf-manager`

---

## 📈 推荐指数排名

| 排名 | Skill | 评分 | 最佳场景 |
|------|-------|------|----------|
| 1 | Agentic DevOps | ⭐⭐⭐⭐⭐ | 日常运维一体化 |
| 2 | Grafana Lens | ⭐⭐⭐⭐⭐ | 监控与可观测性 |
| 3 | K8s Memory Tune | ⭐⭐⭐⭐ | K8s 故障排查 |
| 4 | CF Manager | ⭐⭐⭐⭐ | Cloudflare 管理 |
| 5 | Railway Deploy | ⭐⭐⭐⭐ | 快速部署上线 |

---

## 💡 实用建议

1. **从监控开始**：先部署 `grafana-lens` 建立可观测性，再逐步接入自动化运维
2. **安全先行**：在开放 Agent 操作生产环境之前，务必配置 `aegis-audit` 做行为审计
3. **渐进式自动化**：初期让 Agent 只做只读查询（状态检查、日志分析），确认稳定后再开放写操作
4. **多云场景优先用统一 Skill**：如果使用多云架构，优先选择 `agentic-devops` 这类跨平台工具

---

> 📋 **系列导航**：这是 OpenClaw Skill 每日推荐系列的第 9 篇。明天我们将介绍 **Gaming（游戏）** 分类。
>
> 🔗 完整分类列表：[awesome-openclaw-skills](https://github.com/openclaw/awesome-openclaw-skills)
