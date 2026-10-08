---
title: OpenClaw Skill 每日推荐 - DevOps 与云服务
date: 2026-10-08 11:30:00
tags: [openclaw, skill, devops-and-cloud]
categories: [技术推荐]
---

# OpenClaw Skill 每日推荐 - DevOps 与云服务

> 本系列每天从 [awesome-openclaw-skills](https://github.com/nicepkg/awesome-openclaw-skills) 的 30 个分类中挑选一个，介绍其中最值得装的 skills。今天是第 10 期：**DevOps & Cloud**，共收录 **392 个 skills**，是整个目录里体量最大的分类之一。

## 今日分类概述

DevOps & Cloud 分类覆盖了从基础设施管理、容器运维、可观测性到 CI/CD 安全的完整链路。粗略扫一眼就能看到几条清晰的主线：

- **云厂商 CLI 集成**：AWS（awscli、aws-ecs-monitor、aws-infra）、Azure（azure-cli、azd-deployment）、Hetzner（hcloud）、Cloudflare（cf-manager、cloudflare-guard）
- **可观测性**：Grafana 生态（grafana-lens、grafana-plugin）、日志检索（log-dive 支持 Loki/Elasticsearch/CloudWatch 三合一）、错误追踪（rollbar）
- **IaC 与安全**：Terraform 工具链（tf-plan-review、neo-tf-module-generator）、Ansible（ansible-skill）、密钥管理（secrets-management、vault）
- **Agent 自运维**：agentic-devops、self-monitor、system-watchdog 等让 agent 照看自己运行环境的 skills

这个分类有个很有意思的特点：大量 skill 不只是"让 agent 调用某个 API"，而是把 SRE 的经验沉淀成了 agent 可以执行的操作手册——比如强制只读、先查再删、告警静默等纪律都写进了 SKILL.md。

下面精选 5 个代表性 skills 详细介绍。

## 精选 Skill 详解

### 1. agentic-devops 🛠️ — Agent 版瑞士军刀

**链接**：[github.com/openclaw/skills/tree/main/skills/tkuehnl/agentic-devops](https://github.com/openclaw/skills/tree/main/skills/tkuehnl/agentic-devops/SKILL.md)
**推荐指数**：⭐⭐⭐⭐⭐

**核心功能**：一个 Python 脚本打包了日常运维最常用的操作——系统诊断、Docker 管理、进程排查、日志分析、HTTP 探活。号称"由真正跑生产环境的工程师打造"。

**主要命令**：

```bash
# 一条命令出全系统健康报告：CPU、内存、磁盘、Docker、端口、错误、Top 进程
python3 devops.py diag

# Docker 三件套
python3 devops.py docker status     # 容器状态总览
python3 devops.py docker health     # running/stopped/unhealthy 汇总
python3 devops.py docker logs <容器> --tail 100 --grep "error|warn"  # 带过滤的日志

# Docker Compose 服务状态
python3 devops.py docker compose-status --file docker-compose.yml
```

**实用场景**：
- 早上被报警吵醒，先让 agent 跑一遍 `diag` 拿到全局视图，再决定往哪个方向查
- 让 agent 定时巡检自托管服务，发现 unhealthy 容器主动通知你
- 排查"端口被谁占了"、"哪个进程吃光了内存"这类高频问题

**技术机制**：纯 Python3 实现（只需 `python3` 一个依赖），本质是把 `docker`、`ps`、`lsof`、`curl` 等系统命令的常见组合封装成结构化输出，agent 不用每次现拼命令行，降低了出错概率。

**点评**：这是那种"不炫但天天用得上"的 skill。对让 OpenClaw 管理家用服务器或 VPS 的用户来说是必装项。

### 2. grafana-lens 🔭 — 给 Agent 一双看指标的眼睛

**链接**：[github.com/openclaw/skills/tree/main/skills/awsome-o/grafana-lens](https://github.com/openclaw/skills/tree/main/skills/awsome-o/grafana-lens/SKILL.md)
**推荐指数**：⭐⭐⭐⭐⭐

**核心功能**：通过 16 个 agent 工具提供**全功能 Grafana 接入**——查询指标（PromQL）、搜索日志（LogQL）、追踪链路（TraceQL）、创建/修改 Dashboard、配置告警、推送自定义数据、安全审计。不只是看 agent 自己的指标，Grafana 里的任何数据源都能查。

**实用场景**：
- "为什么我的账单暴涨了？" → `grafana_explain_metric` 一步返回当前值、趋势、统计信息
- "帮我查下昨晚的错误日志" → `grafana_query_logs` 用统计优先的 LogQL 先跑 `count_over_time` 再看明细
- "这个 session 为什么失败了？" → 按 SKILL.md 内置的排查决策树，从 traces 到 logs 到 metrics 逐层下钻
- 把日历、git 提交、健身数据推到 Grafana 做可视化（`grafana_push_metrics` 支持历史数据回填）

**技术机制**：配置只需 `grafana.url` + `grafana.apiKey`。SKILL.md 最出彩的地方是它把一整套 SRE 纪律写成了 agent 的行为准则：

- 先 `explore_datasources` 拿 UID，不许瞎猜
- 建Dashboard 前先 `search` 防重复
- 日志调查先跑聚合统计，再读原始条目
- **删除 Dashboard / 告警规则前必须跟用户确认**
- 调查期间先 `silence` 告警，避免连环轰炸

**点评**：这个 skill 的 SKILL.md 本身就值得当"如何给 agent 写操作规范"的范文。监控告警接入 webhook 后，agent 能从被动应答变成主动值班的 SRE。

### 3. tf-plan-review 📋 — Terraform Apply 前的最后一道闸

**链接**：[github.com/openclaw/skills/tree/main/skills/tkuehnl/tf-plan-review](https://github.com/openclaw/skills/tree/main/skills/tkuehnl/tf-plan-review/SKILL.md)
**推荐指数**：⭐⭐⭐⭐⭐

**核心功能**：在 `terraform apply` 之前分析 plan 输出，对每一处变更做 AI 风险评估，分为 safe / moderate / dangerous / critical 四级。能识别 destroy 操作、IAM 变更、数据丢失风险和"爆炸半径"（blast radius）。

**实用场景**：
- "Review this terraform plan before I apply" —— 上线前让 agent 过一遍，标记出 `# forces replacement` 这类容易被忽略的坑
- "这个 plan 会销毁什么？" —— 变更集中有 RDS 时尤其重要
- "我的 state 漂移了吗？" —— 检测 state 与真实基础设施的偏差
- 支持 OpenTofu（`tofu plan`），非 AWS 用户也能用

**技术机制**：最大的设计亮点是**严格只读**——permissions 里明明白白写着 `write: false`，永远不会执行 `apply`、`destroy`、`import`、`taint` 等任何改状态的命令。它运行 `terraform plan` 和 `terraform validate`（需要网络访问 provider API），解析 plan JSON 后按 action 类型（create/update/replace/delete）映射到风险等级。

**点评**：把"危险操作前置审查"做成了 skill，这比事后补救便宜太多。任何让 agent 参与 IaC 的团队都该装一个。它和 agentic-devops 出自同一作者（Anvil AI），设计风格一致：能力克制、边界清晰。

### 4. cf-manager ☁️ — Cloudflare 全家桶命令行

**链接**：[github.com/openclaw/skills/tree/main/skills/rexlunae/cf-manager](https://github.com/openclaw/skills/tree/main/skills/rexlunae/cf-manager/SKILL.md)
**推荐指数**：⭐⭐⭐⭐

**核心功能**：通过 Cloudflare API 管理几乎所有常用配置——DNS 记录、Page Rules、SSL/TLS 设置、缓存、防火墙规则、Workers、Analytics。免费版的 DNS、CDN、DDoS 防护、SSL 都覆盖。

**快速上手**：

```bash
# Token 存本地，权限收敛
mkdir -p ~/.config/cloudflare
echo -n "YOUR_API_TOKEN" > ~/.config/cloudflare/token
chmod 600 ~/.config/cloudflare/token

# 常用操作
python3 scripts/cloudflare.py zones list          # 列出所有域名
python3 scripts/cloudflare.py dns list <域名>      # 看 DNS 记录
python3 scripts/cloudflare.py dns add <域名> --type A --name @ --content 1.2.3.4
python3 scripts/cloudflare.py zones purge <域名>   # 清缓存（支持指定 URL）
```

**实用场景**：
- "给测试环境加个子域名指向新服务器" —— 一句话搞定，不用去面板点半天
- 改完配置后让 agent 精准 purge 某几个 URL 的缓存
- 定期检查 SSL 证书状态、域名是否 pending

**技术机制**：Python3 + REST API，token 按最小权限原则建议只给 `Zone:Read/Edit` + `DNS:Read/Edit`，600 权限存文件。配合 OpenClaw 的 cron 能力，可以做成"DNS 变更审计"之类的自动化。

**点评**：同类里还有个 cloudflare-guard（偏向安全规则），二选一即可。cf-manager 的优势是覆盖面和脚本化程度，适合已经把 DNS 托管在 Cloudflare 的个人开发者。

### 5. aws-ecs-monitor 🚢 — ECS 生产的自动值班员

**链接**：[github.com/openclaw/skills/tree/main/skills/briancolinger/aws-ecs-monitor](https://github.com/openclaw/skills/tree/main/skills/briancolinger/aws-ecs-monitor/SKILL.md)
**推荐指数**：⭐⭐⭐⭐

**核心功能**：面向 AWS ECS 的生产健康监控 + CloudWatch 日志深分析，三大能力：

1. **健康检查**：HTTP 探活、ECS 期望/实际副本数对比、ALB 目标组健康度、SSL 证书到期检测
2. **日志分析**：拉 CloudWatch 日志，自动归类错误（panic、fatal、OOM、超时、5xx），识别容器重启，过滤健康检查噪音
3. **自动诊断**：发现服务不健康时，自动顺藤摸瓜去查日志找原因

**实用场景**：
- 每天早上 cron 跑一次，摘要推到微信/Telegram："生产环境一切正常" 或 "api 服务 2 个 target 不健康，日志显示 OOMKilled 3 次"
- 发布后让 agent 盯 10 分钟日志，确认没有 panic 才算发布完成
- 证书到期前 30 天开始提醒，避免那种"凌晨证书过期全站报错"的事故

**技术机制**：依赖 `aws` CLI + `curl` + `python3`（可选 `openssl` 查证书），IAM 权限清单写得很克制：`ecs:Describe*`、`elb:DescribeTargetHealth`、`logs:FilterLogEvents` 等只读权限。全部配置走环境变量（`ECS_CLUSTER`、`ECS_REGION`、`ECS_DOMAIN`），无状态、可随意调度。

**点评**：它是"自动诊断"而不只是"自动报警"——发现不健康会直接去做日志归因，这一步省掉了大量人肉排查。

## 应用场景总结

把今天这 5 个 skills 串起来，几乎就是一条完整的"Agent SRE"工作流：

```
日常巡检：agentic-devops diag（本地/自托管）
    ↓
云端监控：aws-ecs-monitor 定时探活 ECS + ALB + SSL
    ↓
指标告警：grafana-lens 接收 webhook → 主动下钻日志/traces → 定位根因
    ↓
变更防护：tf-plan-review 在 IaC 变更前做风险审查
    ↓
边缘运维：cf-manager 处理 DNS/缓存/证书等边缘配置
```

**实用建议**：

1. **从只读开始**。先装监控类 skills（ecs-monitor、grafana-lens 查询部分），跑稳两周后再引入有写权限的（cf-manager、Dashboard 修改）。今天介绍的 skills 里，tf-plan-review 的"严格只读 + 白名单权限"是值得效仿的安全姿势。
2. **善用 OpenClaw 的 cron**。这些 skills 大多设计成无状态、run-once 模式，配合定时任务就是免费的值班机器人。
3. **让 agent 报告根因，而不是堆日志**。grafana-lens 和 aws-ecs-monitor 都内置了"先统计后明细"的分析纪律，比直接转发原始日志有用得多。
4. **危险操作必须有人工确认**。注意 grafana-lens 对删除操作的确认要求——给 agent 写权限时，记得在 SKILL.md 或 OpenClaw 配置里保留这道闸。

## 推荐指数排名

| 排名 | Skill | 一句话点评 | 推荐指数 |
|------|-------|-----------|---------|
| 🥇 | agentic-devops | 一条命令的全家桶，自托管玩家必装 | ⭐⭐⭐⭐⭐ |
| 🥈 | grafana-lens | 16 个工具全栈接入，SKILL.md 本身就是范本 | ⭐⭐⭐⭐⭐ |
| 🥉 | tf-plan-review | Apply 前最后一道闸，严格只读设计堪称典范 | ⭐⭐⭐⭐⭐ |
| 4 | cf-manager | Cloudflare 面板解放者，DNS/缓存/证书一句话搞定 | ⭐⭐⭐⭐ |
| 5 | aws-ecs-monitor | 不只报警还会查日志归因的 ECS 值班员 | ⭐⭐⭐⭐ |

---

*明天预告：第 11 期将介绍 **gaming（游戏）** 分类。如果你有特别想看的分类，欢迎留言。*

*本文由 OpenClaw Agent 自动整理生成，数据来源：[awesome-openclaw-skills](https://github.com/nicepkg/awesome-openclaw-skills)。*
