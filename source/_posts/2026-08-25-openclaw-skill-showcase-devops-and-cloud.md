---
title: OpenClaw Skill 每日推荐 - DevOps 与云服务
date: 2026-08-25 11:30:00
tags:
  - openclaw
  - skill
  - devops
  - cloud
categories:
  - 技术推荐
---

# OpenClaw Skill 每日推荐 — DevOps 与云服务

> 📅 Day 10/30 | 📦 392 skills in this category
>
> 从容器编排到基础设施即代码，从监控告警到安全审计——DevOps & Cloud 分类是 OpenClaw 生态中最大的分类之一，涵盖了 392 个 skill。今天精选 5 个最具代表性的工具，帮你打造全自动化的 DevOps 工作流。

---

## 🏗️ 今日分类概述

**DevOps & Cloud** 分类包含 392 个 skill，覆盖以下核心领域：

| 领域 | 代表方向 | 典型 Skill |
|------|---------|-----------|
| 容器与编排 | Docker、K8s | agentic-devops, neo-docker-to-k8s |
| 基础设施即代码 | Terraform、Ansible | tf-plan-review, ansible-skill |
| 监控与可观测性 | Grafana、Prometheus | grafana-lens |
| 云平台管理 | AWS、Azure、GCP | aws-infra, azure-infra |
| 安全与审计 | 密钥管理、漏洞扫描 | secrets-management, depguard |
| CI/CD 与部署 | Railway、Vercel | railway-deploy, appdeploy |

---

## ⭐ 精选 Skill 详解

### 1. agentic-devops 🛠️

**GitHub:** [openclaw/skills - tkuehnl/agentic-devops](https://github.com/openclaw/skills/tree/main/skills/tkuehnl/agentic-devops)

**推荐指数: ⭐⭐⭐⭐⭐**

一句话概括：**生产级 Agent DevOps 工具箱，一个命令搞定全系统健康诊断。**

#### 核心功能

- **一键系统诊断**：CPU、内存、磁盘、Docker、端口、错误日志、Top 进程全览
- **Docker 管理**：容器状态、日志过滤、健康检查、Compose 服务状态
- **进程管理**：按资源排序进程列表、端口扫描、僵尸进程检测
- **日志分析**：错误模式匹配、高亮显示、频率统计
- **健康检查**：HTTP 端点探活、端口扫描、系统资源健康

#### 实用场景

```bash
# 上线前一键体检
python3 skills/agentic-devops/devops.py diag

# 容器日志中搜索错误模式
python3 skills/agentic-devops/devops.py docker logs myapp --tail 100 --grep "error|warn"

# 分析日志文件错误频率
python3 skills/agentic-devops/devops.py logs frequency /var/log/app.log --top 20

# 检查 HTTP 端点健康
python3 skills/agentic-devops/devops.py health check https://myapp.com/healthz
```

#### 技术亮点

- 纯 Python 标准库实现，**零外部依赖**，开箱即用
- Docker 未安装时自动降级，不影响其他功能
- 支持Unix 系统工具（ps、ss/netstat）集成
- 输出结构化数据，适合 Agent 进一步分析和决策

#### 适用人群

SRE 工程师、运维人员、独立开发者——任何需要快速了解系统健康状态的人。

---

### 2. ansible-skill 📜

**GitHub:** [openclaw/skills - botond-rackhost/ansible-skill](https://github.com/openclaw/skills/tree/main/skills/botond-rackhost/ansible-skill)

**推荐指数: ⭐⭐⭐⭐⭐**

一句话概括：**基础设施自动化全套方案，从 VPS 初始化到安全加固一条龙。**

#### 核心功能

- **服务器配置管理**：通过 Ansible Playbook 批量配置服务器
- **安全加固**：SSH 加固、fail2ban、UFW 防火墙，遵循 CIS 基准
- **OpenClaw 部署**：完整的 OpenClaw VPS 部署流水线
- **多主机编排**：Inventory 管理、滚动更新、并行执行
- **密钥管理**：Ansible Vault 加密敏感变量

#### 实用场景

**新 VPS 开箱即用：**

```bash
# 1. 添加主机到 Inventory
# 2. 一键部署 OpenClaw
ansible-playbook -i inventory/hosts.yml playbooks/openclaw-vps.yml \
  --limit newserver --ask-vault-pass

# 3. 安全加固
ansible-playbook -i inventory/hosts.yml playbooks/security.yml \
  --tags "ssh,firewall"

# 4. 滚动更新（逐台更新，避免全量宕机）
ansible-playbook -i inventory/hosts.yml playbooks/update.yml --serial 1
```

**Ad-hoc 运维：**

```bash
# 检查所有服务器磁盘
ansible all -i inventory/hosts.yml -m shell -a "df -h"

# 重启 OpenClaw 服务
ansible openclaw -i inventory/hosts.yml -m systemd -a "name=openclaw state=restarted"
```

#### 内置角色体系

| 角色 | 功能 |
|------|------|
| `common` | 系统更新、基础包安装、时区配置 |
| `security` | SSH 加固、fail2ban、UFW、自动安全更新 |
| `nodejs` | Node.js 安装（NodeSource）、npm 全局包、pm2 |
| `openclaw` | OpenClaw 安装、Systemd 服务、配置文件 |

#### 技术亮点

- 完整的目录结构规范（Inventory → Playbooks → Roles → References）
- 支持幂等性（Idempotency）——多次执行结果一致
- FQCN（Fully Qualified Collection Names）规范
- Handler 机制——配置变更自动触发服务重启
- Tag 系统——选择性执行特定任务子集

---

### 3. grafana-lens 🔭

**GitHub:** [openclaw/skills - awsome-o/grafana-lens](https://github.com/openclaw/skills/tree/main/skills/awsome-o/grafana-lens)

**推荐指数: ⭐⭐⭐⭐⭐**

一句话概括：**16 个 Grafana 原生工具，从指标查询到安全审计的全栈可观测性方案。**

#### 核心功能

这是 OpenClaw 生态中最重量级的监控 skill，提供 **16 个独立工具**：

| 工具 | 用途 |
|------|------|
| `grafana_query` | PromQL 查询，直接获取数值 |
| `grafana_query_logs` | LogQL 日志搜索 |
| `grafana_query_traces` | TraceQL 分布式追踪 |
| `grafana_create_dashboard` | 模板化创建仪表盘 |
| `grafana_update_dashboard` | 增删改面板 |
| `grafana_get_dashboard` | 仪表盘审计 |
| `grafana_search` | 搜索现有仪表盘 |
| `grafana_share_dashboard` | 渲染图表内联发送 |
| `grafana_create_alert` | 创建告警规则 |
| `grafana_check_alerts` | 告警全生命周期管理 |
| `grafana_annotate` | 事件标注 |
| `grafana_push_metrics` | 推送自定义数据 |
| `grafana_explain_metric` | 指标上下文解释 |
| `grafana_security_check` | 6 项并行安全检查 |
| `grafana_investigate` | 多信号联合调查 |
| `grafana_explore_datasources` | 数据源发现 |

#### 实用场景

**"我的 Agent 今天花了多少钱？"**

```bash
# 直接查数值，不用建仪表盘
grafana_query: sum(increase(openclaw_lens_cost_by_model_total[1d]))
```

**"帮我建一套 AI 监控"**

一键部署 6 层 SRE 仪表盘体系：

1. `llm-command-center`（系统总览）
2. `session-explorer`（会话级调试）
3. `cost-intelligence`（成本分析）
4. `tool-performance`（工具性能）
5. `sre-operations`（SRE 运维）
6. `genai-observability`（OTel 标准 AI 监控）

**"我是不是被攻击了？"**

`grafana_security_check` 并行执行 6 项检查：
- Webhook 错误率
- 成本异常
- 工具循环检测
- 提示注入信号
- 会话枚举
- 卡死会话

返回 `green/yellow/red` 威胁等级评估。

#### 技术亮点

- **查询→告警链式调用**：query 响应直接返回 `datasourceUid`，无需二次查询
- **面板查询重放**：`dashboardUid + panelId` 自动解析 PromQL，无需手动提取
- **日志-追踪互相关联**：日志查询结果自动提取 `trace_id`，追踪结果自动生成关联 LogQL
- **自定义数据推送**：支持历史数据回填（带 timestamp），自动注册指标
- **安全检查并行化**：`Promise.allSettled` 实现 6 项并行检查，部分失败不影响整体

---

### 4. neo-docker-to-k8s-manifests 🐳→☸️

**GitHub:** [openclaw/skills - martinforsulu/neo-docker-to-k8s-manifests](https://github.com/openclaw/skills/tree/main/skills/martinforsulu/neo-docker-to-k8s-manifests)

**推荐指数: ⭐⭐⭐⭐**

一句话概括：**从 Dockerfile/docker-compose 自动生成生产级 K8s 部署清单。**

#### 核心功能

- 解析 Dockerfile 指令提取元数据
- 解析 docker-compose.yml 多服务配置
- 生成 Deployment、Service、Ingress 资源
- 自动估算资源限制（基于应用类型）
- 配置存活、就绪、启动探针
- 应用安全最佳实践（非 root、只读 FS、降权）

#### 实用场景

```bash
# 从 Dockerfile 生成
docker-to-k8s --dockerfile ./Dockerfile --output ./k8s/

# 从 docker-compose 生成
docker-to-k8s --compose ./docker-compose.yml --output ./k8s/

# 指定应用名
docker-to-k8s --dockerfile ./Dockerfile --name my-app --output ./k8s/
```

#### 生成资源清单

| 资源 | 内容 |
|------|------|
| **Deployment** | 资源限制、健康探针、安全上下文 |
| **Service** | ClusterIP + 端口映射 |
| **Ingress** | HTTP 服务对外暴露 |
| **ConfigMap** | 环境变量管理 |
| **PersistentVolumeClaim** | 持久化卷 |

#### 技术亮点

- 可作为 CLI 使用，也可作为 Node.js 库集成
- 自动从 Dockerfile 中提取端口、环境变量、挂载点
- 按应用类型智能估算 CPU/内存限制
- 输出通过 Kubernetes Schema 验证
- 安全加固：`runAsNonRoot: true`、`readOnlyRootFilesystem: true`、`drop ALL capabilities`

#### 适用人群

从 Docker 迁移到 Kubernetes 的团队、需要快速生成 K8s 清单的开发者。

---

### 5. tf-plan-review 🔍

**GitHub:** [openclaw/skills - tkuehnl/tf-plan-review](https://github.com/openclaw/skills/tree/main/skills/tkuehnl/tf-plan-review)

**推荐指数: ⭐⭐⭐⭐⭐**

一句话概括：**Terraform 计划的风险评估器——在 apply 之前，先告诉你哪里会炸。**

#### 核心功能

- 分析 `terraform plan` 输出，对每个变更进行风险分级
- 四级风险分类：🟢 安全 → 🟡 中等 → 🟠 危险 → 🔴 严重
- 检测资源销毁、IAM 变更、数据丢失风险
- 评估爆炸半径（blast radius）——哪些依赖会受影响
- **严格只读**——绝不执行 apply/destroy/import

#### 风险分级体系

| 等级 | 变更类型 | 典型场景 |
|------|---------|---------|
| 🔴 严重 | destroy/replace | RDS、S3、KMS、IAM 角色/策略、安全组 |
| 🟠 危险 | destroy/replace | EC2、ELB、ECS/EKS、VPC、Lambda |
| 🟡 中等 | update/create | ASG 策略、监控规则、新 IAM 角色 |
| 🟢 安全 | create/tag | 非敏感资源创建、标签更新 |

#### 实用场景

```bash
# 分析 Terraform 计划
bash scripts/tf-plan-review.sh plan ./infra/prod

# 检查状态漂移
bash scripts/tf-plan-review.sh state "iam" .

# 验证配置语法
bash scripts/tf-plan-review.sh validate ./infra/staging
```

**输出示例：**

```
🔴 CRITICAL RISK

Summary: 1 create, 3 update, 1 destroy, 0 replace

⚠️ CRITICAL CHANGES:
- aws_iam_role.admin → DELETE
  This will permanently delete the admin IAM role.
  All attached policies and trust relationships will be lost.
  Blast radius: 3 resources depend on this role.

PRE-APPLY CHECKLIST:
□ Verify backup of IAM policies
□ Confirm no services assume this role
□ Review with team lead
```

#### 安全红线

这个 skill 严格执行只读策略：

- ❌ 绝不执行 `terraform apply`
- ❌ 绝不执行 `terraform destroy`
- ❌ 绝不执行 `terraform import/taint/state mv/state rm`
- ✅ 只执行 `plan/show/state list/state show/validate/init`

#### 技术亮点

- 支持 Terraform 和 OpenTofu（自动检测）
- JSON + Markdown 双输出格式（stdout 结构化数据，stderr 可读报告）
- 自动初始化（未初始化时自动 `terraform init`）
- 超时保护（默认 600 秒）
- 敏感值不提取、不缓存——防止凭据泄露

---

## 📊 推荐指数排名

| 排名 | Skill | 星级 | 最佳场景 |
|------|-------|------|---------|
| 1 | grafana-lens | ⭐⭐⭐⭐⭐ | 全栈可观测性、AI 监控、安全审计 |
| 2 | agentic-devops | ⭐⭐⭐⭐⭐ | 快速系统诊断、日常运维 |
| 3 | tf-plan-review | ⭐⭐⭐⭐⭐ | IaC 安全审计、变更风险控制 |
| 4 | ansible-skill | ⭐⭐⭐⭐⭐ | 批量服务器配置、OpenClaw 部署 |
| 5 | neo-docker-to-k8s | ⭐⭐⭐⭐ | Docker→K8s 迁移、清单生成 |

---

## 🎯 应用场景总结

### 场景一：从零搭建 DevOps 体系

```
ansible-skill (服务器初始化)
    → neo-docker-to-k8s (容器化部署)
        → grafana-lens (监控告警)
            → agentic-devops (日常诊断)
```

### 场景二：基础设施变更安全网

```
开发提交 Terraform 变更
    → tf-plan-review 自动分析风险
        → 🔴 严重？阻断并通知
        → 🟢 安全？允许 apply
```

### 场景三：AI Agent 运维

```
grafana-lens 推送自定义指标
    → 创建 LLM Command Center 仪表盘
        → 设置成本/错误/延迟告警
            → 安全检查自动巡检
```

### 场景四：快速故障排查

```
agentic-devops 一键诊断
    → grafana-lens 深入调查
        → 查日志、查追踪、查指标
            → 标注事件、生成事后报告
```

---

## 💡 实用建议

1. **组合使用**：这 5 个 skill 覆盖了 DevOps 全生命周期——从部署（ansible）到容器化（docker-to-k8s），从监控（grafana-lens）到诊断（agentic-devops），再到安全审计（tf-plan-review）。组合使用效果远大于单独使用。

2. **自动化流水线**：用 OpenClaw 的 cron 功能定时执行 `agentic-devops diag` 和 `grafana_security_check`，实现 7×24 无人值守运维。

3. **安全优先**：`tf-plan-review` 应该作为 IaC 变更的强制门禁——任何 Terraform apply 之前都先跑一遍风险评估。

4. **渐进式采纳**：不需要一次全装。从 `agentic-devops`（零依赖）开始，逐步加入 `grafana-lens`（需要 Grafana 实例），再到 `ansible-skill`（需要多台服务器）。

5. **关注 OpenTofu**：`tf-plan-review` 同时支持 Terraform 和 OpenTofu。随着 OpenTofu 社区增长，多工具兼容是趋势。

---

> 📖 本系列每日更新，明天将介绍 **Gaming** 分类。
>
> 完整 30 天系列：[OpenClaw Skill 每日推荐](https://www.daoyuly.cn/tags/openclaw/)
