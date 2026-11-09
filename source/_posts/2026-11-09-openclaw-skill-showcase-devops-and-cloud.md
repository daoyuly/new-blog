---
title: OpenClaw Skill 每日推荐 - DevOps 与云服务（devops-and-cloud）
tags:
  - openclaw
  - skill
  - devops-and-cloud
categories:
  - 技术推荐
abbrlink: 9573
date: 2026-11-09 11:30:00
---

# OpenClaw Skill 每日推荐 - DevOps 与云服务

> 「OpenClaw Skill 每日推荐」第 36 期，**第三轮第 6 期**。继续从 [awesome-openclaw-skills](https://github.com/openclaw/skills)（全库 5300+ 条目、30 个分类）中每天取一个分类，精选代表性 skill 深入介绍。前两天给 Agent 装了「嘴」、配了「算盘」，今天发它一块工牌：**DevOps 与云服务（DevOps & Cloud）**，392 个 skills，教 Agent 登服务器、看监控、管部署。这个分类的特殊性在于试错成本——数据分析算错了重跑一遍就行，生产环境改错了是真炸。所以今天能进精选的，多半是「先看一眼再动手」的类型。

先修正一个预告翻车：昨天说 data-and-analytics 里串场的 netlify 和 cicd-pipeline 今天会再见面——查了下，这两个条目只挂在数据分析分类名下，今天并不在场。自动分类再次证明了它的自由散漫，连预告都能放鸽子。不过它们的作者 gitgoodordietrying 本人到场了，带着 [makefile-build](https://github.com/openclaw/skills/tree/main/skills/gitgoodordietrying/makefile-build/SKILL.md)（教 Agent 给任何项目写 Makefile）。cicd-pipeline 的描述是「Create, debug, and manage CI/CD pipelines with GitHub」，归宿多半在 git-and-github 分类——那期再见，这次先记它缺席一次。

## 今日分类概述

392 个条目，本轮开始以来最大的分类（此前最大是 browser-and-automation 的 320）。不过别急，本轮后面还排着 352 条的 search-and-research 和 925 条的 web-and-frontend-development。拆开看，正经做运维的技能大致五块：

- **云厂商管理**：AWS 系的 [awscli](https://github.com/openclaw/skills/tree/main/skills/hypertextassassinrajith/awscli/SKILL.md)（Lightsail/EC2）与 aws-infra，Azure 系的 [azure-cli](https://github.com/openclaw/skills/tree/main/skills/ddevaal/azure-cli/SKILL.md) 和一整排 azure-* SDK 技能，Hetzner 的 [hcloud](https://github.com/openclaw/skills/tree/main/skills/jpj069/hcloud/SKILL.md)，GPU 云的 [runpod](https://github.com/openclaw/skills/tree/main/skills/andrewharp/runpod/SKILL.md)，PaaS 路线的 [railway-deploy](https://github.com/openclaw/skills/tree/main/skills/dbanys/railway-deploy/SKILL.md)（说一声「railway up」就部署）和 [laravel-forge](https://github.com/openclaw/skills/tree/main/skills/florianbeer/laravel-forge/SKILL.md)。从裸 VPS 到 Serverless GPU，管你有几朵云，Agent 一视同仁。
- **监控与可观测**：[grafana-lens](https://github.com/openclaw/skills/tree/main/skills/awsome-o/grafana-lens/SKILL.md)（下面详讲）、[log-dive](https://github.com/openclaw/skills/tree/main/skills/tkuehnl/log-dive/SKILL.md)（下面详讲）、[aws-ecs-monitor](https://github.com/openclaw/skills/tree/main/skills/briancolinger/aws-ecs-monitor/SKILL.md)（ECS 生产健康 + CloudWatch）、[librenms](https://github.com/openclaw/skills/tree/main/skills/florianbeer/librenms/SKILL.md)（网络设备）、[rollbar](https://github.com/openclaw/skills/tree/main/skills/vittor1o/rollbar/SKILL.md)（错误追踪），外加一窝 watchdog 系：service-watchdog、system-watchdog、claude-watchdog（盯 Claude API 宕机）、jarvis-monitor（科幻 HUD 风格系统监控）——运维人对 watchdog 这个词的执念在这里体现得淋漓尽致。
- **IaC 与容器**：[tf-plan-review](https://github.com/openclaw/skills/tree/main/skills/tkuehnl/tf-plan-review/SKILL.md)（下面详讲）、[neo-tf-module-generator](https://github.com/openclaw/skills/tree/main/skills/martinforsulu/neo-tf-module-generator/SKILL.md)（从存量云资源反推 Terraform 模块）、[ansible-skill](https://github.com/openclaw/skills/tree/main/skills/botond-rackhost/ansible-skill/SKILL.md)（基础设施自动化祖师爷）、[neo-docker-to-k8s-manifests](https://github.com/openclaw/skills/tree/main/skills/martinforsulu/neo-docker-to-k8s-manifests/SKILL.md)（下面详讲）、dacker 与 docker-skill（同作者同描述的 Docker 安装双胞胎）。
- **网络与边缘**：[cf-manager](https://github.com/openclaw/skills/tree/main/skills/rexlunae/cf-manager/SKILL.md)（下面详讲）、[cloudflare-guard](https://github.com/openclaw/skills/tree/main/skills/guifav/cloudflare-guard/SKILL.md)、[cfshare](https://github.com/openclaw/skills/tree/main/skills/ystemsrx/cfshare/SKILL.md)（本地端口一键变临时公网 URL）、[flaresolverr](https://github.com/openclaw/skills/tree/main/skills/dolverin/flaresolverr/SKILL.md)（过 Cloudflare 盾——注意这位跟前面几位的业务方向恰好相反）、[opnsense-admin](https://github.com/openclaw/skills/tree/main/skills/transcendenceia/opnsense-admin/SKILL.md)（防火墙）、[telnyx-network](https://github.com/openclaw/skills/tree/main/skills/teamtelnyx/telnyx-network/SKILL.md)（WireGuard 组网）。
- **安全与凭证**：[secrets-management](https://github.com/openclaw/skills/tree/main/skills/brandonwise/secrets-management/SKILL.md)（CI/CD 凭证管理，Vault + AWS Secrets Manager）、[depguard](https://github.com/openclaw/skills/tree/main/skills/suhteevah/depguard/SKILL.md)（依赖审计 + 漏洞扫描 + 许可证合规）、[aws-security-scanner](https://github.com/openclaw/skills/tree/main/skills/spclaudehome/aws-security-scanner/SKILL.md)、[agentkeys](https://github.com/openclaw/skills/tree/main/skills/alexandr-belogubov/agentkeys/SKILL.md)（Agent 凭证代理）。

必须单独表扬一位中文作者：2233admin 的 [k8s-memory-tune](https://github.com/openclaw/skills/tree/main/skills/2233admin/k8s-memory-tune/SKILL.md)，描述开头就是「触发词：oomkilled, memory_limit, jvm_heap, container_memory, k8s 内存」——教 Agent 排查 Kubernetes 内存问题（OOMKilled、JVM 堆、limit 配置），全库少见的中文触发词技能，K8s 用户建议直接收藏。

然后照例说噪音。392 个条目里，跨界住户数量创本轮新高。语音技能成建制搬家（aliyun-tts、fish-tts、qwen3-tts 两位、valtec-tts、beware-piper-tts 等，数下来十个有余）；日历全家桶集体走错门（calcom、caldav 两位、icloud 两位）；交易机器人把这里当机房（blowfish-launch、clanker、vibetrader、torchmarket、tellermcp 四胞胎……加密货币浓度直逼生产环境的咖啡因）。最离谱的三位：[12306](https://github.com/openclaw/skills/tree/main/skills/kirorab/12306/SKILL.md)——火车票查询出现在 DevOps 分类，唯一说得通的解释是春运抢票对系统抗压能力的要求确实堪比生产运维；[compost-tracker](https://github.com/openclaw/skills/tree/main/skills/johstracke/compost-tracker/SKILL.md)——堆肥堆管理，带温度监控和翻堆记录，放运维分类居然毫无违和感，堪称全库把「基础设施」理解得最字面意思的技能；[kefir-batch-manager](https://github.com/openclaw/skills/tree/main/skills/p-salmon/kefir-batch-manager/SKILL.md)——开菲尔菌种管理系统，卖点包括「grain health monitoring」，菌群健康监控，听起来像 SRE，实际上是酸奶。此外 lraivisto 一人贡献了七个 researchvault 变体（researchvault、vault-research、vaultresearch、lraivisto-researchvault……描述全是同一句「research orchestration engine」），rbcp18 贡献了四个描述一字不差的 teller——自动分类的自由散漫，在数字上也对得上了。

## 精选 Skill 详解

### 1. tf-plan-review —— 给 Agent 的 Terraform 上一道闸 ⭐⭐⭐⭐✨

**链接**：[tkuehnl/tf-plan-review](https://github.com/openclaw/skills/tree/main/skills/tkuehnl/tf-plan-review/SKILL.md)

描述一句话：「Analyze Terraform plans for risk before you apply」。Terraform 工作流里最危险的一步就是 apply——plan 输出那一大坨增删改符号，人类都会看漏，何况让 Agent 全自动跑。这个 skill 的定位就是在 apply 之前加一道评审闸门：读 plan，标记高风险变更（删资源、替换资源、动网络配置这类），给出风险结论。

它解决的痛点非常具体：Agent 的执行力太强，而敬畏心不足。人肉运维改错配置会手抖，Agent 不会——它需要外置的刹车，这个技能就是刹车。配上同分类的 secrets-management（凭证管理）和 depguard（依赖审计），凑出一套「Agent 动生产环境前的安全带三件套」。

四星半：机制朴素（本质是 plan 解析加风险规则），但位置极其关键——它管的是整个分类里代价最高的一种错误。

### 2. log-dive —— 一个入口查遍所有日志 ⭐⭐⭐⭐

**链接**：[tkuehnl/log-dive](https://github.com/openclaw/skills/tree/main/skills/tkuehnl/log-dive/SKILL.md)

「Unified log search across Loki, Elasticsearch, and CloudWatch」。排障时最浪费时间的动作之一，就是在三个日志系统之间来回切：Kibana 查一遍、Loki 查一遍、CloudWatch 再查一遍。log-dive 把三家收进一个统一入口，让 Agent 用同一套动作横跨查日志。

实用场景不难想象：「应用报 5xx 了，把最近 30 分钟相关服务的错误日志拉出来归个类」——放在以前是开三个浏览器标签页的活，现在是一句话。Agent 拿到统一日志流之后做聚类、对时间线、找异常突变点，都是它擅长的事。

值得一提的是作者 tkuehnl 在本分类的三连发：[agentic-devops](https://github.com/openclaw/skills/tree/main/skills/tkuehnl/agentic-devops/SKILL.md)（Docker、进程管理、日志分析、健康监控工具箱）、tf-plan-review、log-dive——一个人补齐了「Agent SRE」的改动、看护、排障三块拼图，思路相当完整。四星：东西实在，前提是你家日志得先在 Loki、ES、CloudWatch 这三家里面。

### 3. grafana-lens —— 把整个 Grafana 塞给 Agent ⭐⭐⭐⭐✨

**链接**：[awsome-o/grafana-lens](https://github.com/openclaw/skills/tree/main/skills/awsome-o/grafana-lens/SKILL.md)

「Full Grafana access: query, dashboard, alert, trace — 16 agent tools」。Grafana 是监控可视化的事实标准，grafana-lens 的野心也是本分类最大的：查询、仪表盘、告警、链路追踪，16 个工具一次给齐。对比同分类的 grafana-plugin 和 rpe-grafana（同作者，描述都是「Read current values from Grafana dashboards without knowing the underlying queries」——只读看板数值的轻量版），lens 走的是全家桶路线。

对 Agent 意味着什么：不只是「看监控」，还能「配监控」——建仪表盘、调告警规则、下钻 trace。「给新服务配一个带 P99 延迟告警的仪表盘」从运维的半小时变成聊天里的一句话。当然，给 Agent 的 Grafana 权限建议分级：query 随便给，仪表盘和告警的管理权限留在需要时再开。

四星半：覆盖面在本分类无出其右，扣的半星给命名——lens 这个后缀实在配不上它的体量。

### 4. neo-docker-to-k8s-manifests —— 从 docker-compose 到 K8s 的摆渡船 ⭐⭐⭐⭐

**链接**：[martinforsulu/neo-docker-to-k8s-manifests](https://github.com/openclaw/skills/tree/main/skills/martinforsulu/neo-docker-to-k8s-manifests/SKILL.md)

「Automatically generate optimized Kubernetes deployment manifests from Dockerfile and docker-compose configurations」。很多团队的现状是：本地 docker-compose 跑得好好的，上 K8s 的第一步——把 compose 翻译成 Deployment、Service、Ingress 那一套 YAML——卡住了。这个 skill 干的就是这个翻译活，还号称 optimized，资源限制、探针这类新手最容易漏的配置帮你补上。

同作者还有个 neo-tf-module-generator：从存量云资源反推生成 Terraform 模块。两个 neo- 凑成一对「逆向工程」组合——一个从容器到编排，一个从资源到代码，都是把「已经在跑的东西」变成「可以版本化管理的东西」。对正走在 IaC 化路上的团队非常对口。

四星：摆渡船的价值取决于河对岸有多诱人。另外它生成的 YAML 建议人工过一遍再 apply——结合今天的主题，你现在已经知道该用哪个技能来过这一遍了。

### 5. cf-manager —— 把 Cloudflare 控制台变成聊天窗口 ⭐⭐⭐✨

**链接**：[rexlunae/cf-manager](https://github.com/openclaw/skills/tree/main/skills/rexlunae/cf-manager/SKILL.md)

「Manage Cloudflare via API — DNS zones and records, page rules, SSL/TLS settings, caching, firewall rules, Workers」。Cloudflare 管着全世界相当比例网站的 DNS 和边缘配置，而它的控制台以功能繁多著称——找个设置项能在菜单里翻三层。这个 skill 把 DNS 记录、页面规则、SSL/TLS、缓存、防火墙规则、Workers 全部收进 API 操作。

高频场景都很小很具体：「把这个域名的 A 记录指到新服务器」「给这个子域开开发模式清缓存」「查一下是不是防火墙规则把人家拦了」。这些活单个都不难，难的是凌晨三点在控制台里找入口。给 Agent 配一个权限受限的 API Token，这类活就变成一句话的事。

三星半：Cloudflare 用户刚需。但和隔壁 cloudflare-guard 的描述高度重叠，装之前建议两个都对比再选——本分类里 Cloudflare 相关条目一共五六个，堪称 Cloudflare 选手专场，内卷在所难免。

## 应用场景总结

把今天 392 个条目按「运维的一天」串起来：

1. **动手前**：tf-plan-review（Terraform 变更评审）、aws-security-scanner（账号安检）、depguard（依赖审计）——先看病再开药；
2. **部署上线**：railway-deploy（PaaS 一键）、neo-docker-to-k8s-manifests（容器上编排）、azd-deployment（Azure 容器应用）、hostinger-vps-optimizer（VPS 调优）；
3. **日常看护**：grafana-lens（看板 + 告警）、aws-ecs-monitor（容器集群健康）、service-watchdog（自托管服务监控）、pi-health（树莓派也能享受 SRE 待遇）；
4. **出事排障**：log-dive（三平台统一查日志）、k8s-memory-tune（OOMKilled 专项）、mdata（系统诊断工具箱）、crash-fixer（自动崩溃分析）；
5. **月底复盘**：sovereign-aws-cost-optimizer（AWS 成本分析）——运维的尽头是看账单。

给想上手的人三条实在建议：

- **先给「看」的权限，再谈「改」的**：监控类技能（grafana-lens、log-dive、aws-ecs-monitor）全是只读安全牌，先装它们让 Agent 学会看，跑顺了再考虑带写操作的——跟昨天数据分类的「只读优先」一脉相承，只是这回的代价单位从「脏数据」变成了「宕机」；
- **一切写操作走 plan**：Terraform 用 tf-plan-review 过闸，K8s 上让 Agent 输出 YAML 人工过目再 apply，Cloudflare 改 DNS 前先让 Agent 备份现有记录——Agent 不手抖，所以你得替它抖；
- **凭证分级是运维技能的第一课**：secrets-management 管 CI/CD 密钥，cf-manager 这类 API 技能配最小权限 Token。Agent 拿到的每把钥匙都假设会丢——这不是不信任，是架构。

## 推荐指数排名

| Skill | 定位 | 推荐指数 |
|---|---|---|
| tf-plan-review | Terraform 变更风险闸门 | ⭐⭐⭐⭐✨ |
| grafana-lens | Grafana 全家桶（16 工具） | ⭐⭐⭐⭐✨ |
| log-dive | 跨平台统一日志检索 | ⭐⭐⭐⭐ |
| neo-docker-to-k8s-manifests | compose → K8s 清单生成 | ⭐⭐⭐⭐ |
| cf-manager | Cloudflare 全功能管理 | ⭐⭐⭐✨ |
| k8s-memory-tune | K8s 内存排障（中文触发词） | ⭐⭐⭐✨ |
| secrets-management | CI/CD 凭证管理 | ⭐⭐⭐✨ |
| aws-ecs-monitor | ECS 健康监控 | ⭐⭐⭐✨ |
| railway-deploy | PaaS 一键部署 | ⭐⭐⭐ |
| sovereign-aws-cost-optimizer | AWS 成本优化 | ⭐⭐⭐ |

（✨ 表示半星）

## 下期预告

明天进 **gaming（游戏）**——35 个条目，本轮最小的分类之一。刚发完工牌让 Agent 进机房值班，明天带它去打游戏。从机房到游戏厅只隔一天，这大概就是当 AI 助手的好处。
