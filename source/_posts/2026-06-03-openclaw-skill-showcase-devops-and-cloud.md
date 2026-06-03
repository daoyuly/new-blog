---
title: OpenClaw Skill 每日推荐 - DevOps 与云服务
date: 2026-06-03 11:30:00
tags:
  - openclaw
  - skill
  - devops-and-cloud
categories:
  - 技术推荐
---

# OpenClaw Skill 每日推荐 - DevOps 与云服务 ☁️

> 这是 OpenClaw Skill 每日推荐系列的第 10 期。每天为你精选一个分类中最实用的 Skills，帮你打造更强大的 AI Agent 工作流。

## 📋 今日分类概览

**DevOps & Cloud（DevOps 与云服务）** 是 OpenClaw 生态中最大的分类之一，包含 **392 个 Skills**，覆盖了从基础设施管理到安全审计、从容器编排到监控告警的全链路 DevOps 场景。

无论你是管理 AWS/Azure/GCP 云资源，还是运维自托管服务，这个分类都能找到趁手的工具。

---

## 🏆 精选 Skill 详解

### 1. Agentic DevOps

- **GitHub**: [openclaw/skills - agentic-devops](https://github.com/openclaw/skills/tree/main/skills/tkuehnl/agentic-devops/SKILL.md)
- **作者**: @tkuehnl
- **推荐指数**: ⭐⭐⭐⭐⭐

**核心功能**: 生产级 Agent DevOps 工具套件，集成 Docker 管理、进程管理、日志分析和健康监控于一体。

**实用场景**:
- 通过自然语言管理 Docker 容器的生命周期（创建、启动、停止、删除）
- 实时分析服务日志，快速定位异常
- 自动化健康检查，在服务异常时主动告警

**为什么推荐**: 这是最全面的 DevOps 通用工具包之一，把常见运维操作都封装成了 Agent 可直接调用的能力，非常适合作为基础设施管理的基础 Skill。

---

### 2. AWS Security Scanner

- **GitHub**: [openclaw/skills - aws-security-scanner](https://github.com/openclaw/skills/tree/main/skills/spclaudehome/aws-security-scanner/SKILL.md)
- **作者**: @spclaudehome
- **推荐指数**: ⭐⭐⭐⭐⭐

**核心功能**: 自动化扫描 AWS 账户的安全风险，覆盖 IAM 策略、S3 存储桶权限、安全组配置等关键安全维度。

**实用场景**:
- 定期执行安全基线检查，确保账户配置合规
- 在部署新资源后自动验证安全策略
- 生成结构化的安全审计报告

**代码示例**:
```
用户: "扫描我的 AWS 账户安全状态"
Agent → 调用 aws-security-scanner → 输出安全评分 + 风险清单 + 修复建议
```

**为什么推荐**: 安全是云服务的生命线，这个 Skill 让安全审计从人工操作变成 Agent 自动化流程，大幅降低安全盲区。

---

### 3. CF Manager (Cloudflare 全能管理)

- **GitHub**: [openclaw/skills - cf-manager](https://github.com/openclaw/skills/tree/main/skills/rexlunae/cf-manager/SKILL.md)
- **作者**: @rexlunae
- **推荐指数**: ⭐⭐⭐⭐⭐

**核心功能**: 通过 Cloudflare API 全面管理 DNS 记录、Page Rules、SSL/TLS 设置、缓存策略、防火墙规则和 Workers。

**实用场景**:
- 一条指令批量更新 DNS 记录
- 自动配置 SSL 证书和缓存策略
- 管理防火墙规则，封禁恶意 IP
- 部署和更新 Cloudflare Workers

**代码示例**:
```
用户: "帮我把 example.com 的 A 记录指向 1.2.3.4"
Agent → cf-manager → 调用 Cloudflare API → 返回更新结果
```

**为什么推荐**: Cloudflare 是最流行的 CDN/DNS 服务之一，这个 Skill 覆盖了几乎所有的管理操作，是运维人员的瑞士军刀。

---

### 4. TF Plan Review (Terraform 计划审查)

- **GitHub**: [openclaw/skills - tf-plan-review](https://github.com/openclaw/skills/tree/main/skills/tkuehnl/tf-plan-review/SKILL.md)
- **作者**: @tkuehnl
- **推荐指数**: ⭐⭐⭐⭐

**核心功能**: 在执行 `terraform apply` 之前，自动分析 Terraform Plan 的变更内容，评估风险等级。

**实用场景**:
- 在 CI/CD 流水线中自动审查基础设施变更
- 识别可能导致服务中断的破坏性变更
- 为团队成员提供变更风险提示

**技术实现**: 解析 `terraform plan` 的 JSON 输出，对比资源变更的 diff，基于规则引擎评估风险（如删除资源、降低配置、开放公网访问等）。

**为什么推荐**: "先审查再执行"是基础设施管理的黄金法则，这个 Skill 把 Terraform 的安全网又加厚了一层。

---

### 5. Grafana Lens

- **GitHub**: [openclaw/skills - grafana-lens](https://github.com/openclaw/skills/tree/main/skills/awsome-o/grafana-lens/SKILL.md)
- **作者**: @awsome-o
- **推荐指数**: ⭐⭐⭐⭐

**核心功能**: 全功能 Grafana 访问工具，提供 16 个 Agent 工具用于查询数据、管理仪表盘、配置告警和追踪链路。

**实用场景**:
- 自然语言查询 Grafana 仪表盘数据，无需手写 PromQL
- 自动创建和更新监控仪表盘
- 配置告警规则，当指标异常时自动通知
- 集成到 Agent 日常巡检流程中

**技术实现**: 通过 Grafana HTTP API 与服务端交互，支持数据源查询、Dashboard CRUD、Alert Rule 管理、Explore 面板等。

**为什么推荐**: 监控是 DevOps 的眼睛。Grafana Lens 让 Agent 能直接"看懂"系统状态，这是走向智能运维的关键一步。

---

## 📊 推荐指数排名

| 排名 | Skill | 推荐指数 | 一句话评价 |
|:---:|-------|:---:|---------|
| 1 | Agentic DevOps | ⭐⭐⭐⭐⭐ | DevOps 全能瑞士军刀 |
| 1 | AWS Security Scanner | ⭐⭐⭐⭐⭐ | 云安全必备的自动审计工具 |
| 1 | CF Manager | ⭐⭐⭐⭐⭐ | Cloudflare 管理的一站式方案 |
| 4 | TF Plan Review | ⭐⭐⭐⭐ | Terraform 变更的安全门卫 |
| 4 | Grafana Lens | ⭐⭐⭐⭐ | 让 Agent 看懂监控数据 |

---

## 🎯 应用场景总结

### 场景一：自动化运维巡检
每天定时让 Agent 执行安全扫描 + 健康检查 + 日志分析，自动生成运维日报。

### 场景二：基础设施即代码审查
在 Git PR 中自动触发 Terraform Plan Review，确保基础设施变更经过安全评估后才合并。

### 场景三：智能故障响应
Grafana 检测到异常 → Agent 自动查询日志定位问题 → 执行修复操作 → 更新 Cloudflare 防火墙规则封禁恶意流量。

### 场景四：多云资源管理
通过 AWS/Azure/GCP 相关 Skills 统一管理多云环境，用自然语言完成跨云操作。

---

## 💡 实用建议

1. **组合使用更强大**: 把安全扫描、监控查询和日志分析组合成自动化流水线
2. **从安全入手**: 优先部署 AWS Security Scanner，安全是基础
3. **善用 Terraform 审查**: 在团队协作中，TF Plan Review 能有效防止误操作
4. **定期巡检**: 配合 OpenClaw 的 Heartbeat 机制，让 Agent 定期执行健康检查

---

## 🔗 相关资源

- [OpenClaw 官方文档](https://docs.openclaw.ai)
- [OpenClaw Skills 仓库](https://github.com/openclaw/skills)
- [ClawHub Skills 市场](https://clawhub.com)

---

> 📅 下一篇预告：**游戏 (Gaming)** 分类 — AI Agent 也能玩游戏？敬请期待！
>
> *关注本系列，每天发现一个新分类的精彩 Skills。*
