---
title: OpenClaw Skill 每日推荐 - Marketing & Sales 营销与销售
date: 2026-07-23 11:30:00
tags:
  - openclaw
  - skill
  - marketing-and-sales
categories:
  - 技术推荐
---

# OpenClaw Skill 每日推荐 - Marketing & Sales 营销与销售

> 🎯 本系列每日介绍一个 OpenClaw Skill 分类，帮助发现实用工具。
> 今日分类：**Marketing & Sales（营销与销售）**，共收录 **103 个 Skills**。

## 📊 分类概述

营销与销售分类涵盖了从冷邮件外联、CRM 管理、社交媒体营销到 SEO 优化、广告投放分析等完整的营销链路。无论你是独立开发者推广产品、初创公司搭建 GTM 策略，还是营销团队自动化工作流，都能在这里找到趁手的工具。

该分类的 Skills 可以大致分为以下几个子方向：

| 子方向 | 代表 Skills | 数量 |
|--------|------------|------|
| 邮件营销 | cold-email, kit-email-operator, brevo, foxreach | ~15 |
| CRM & 销售线索 | apollo, attio-enhanced, workcrm, kvcore-mcp-cli | ~12 |
| 内容营销 | ghost-cms, blog-writer, content-creator, reef-copywriting | ~14 |
| 社交媒体 | simplified-social-media, bluesky, bird, tiktok-viral-marketing | ~10 |
| SEO & 分析 | posthog, windsor-ai, meta-ads-report, performance-reporter | ~12 |
| 产品发布 | listing-swarm, go-to-market, marketing-strategy-pmm | ~8 |
| 其他 | affiliate-master, brand-voice-profile, invoice-template | ~32 |

---

## 🌟 精选 Skill 详解

### 1. Cold Email — AI 超级个性化冷邮件生成器

**🔗 GitHub:** [bluecraft-ai/cold-email](https://github.com/openclaw/skills/tree/main/skills/bluecraft-ai/cold-email/SKILL.md)

**核心功能：**
利用 AI 生成高度个性化的冷邮件序列。不再是简单的模板替换，而是根据目标客户的公司信息、行业背景、近期动态等上下文，生成有针对性的邮件内容。

**实用场景：**
- B2B 销售团队批量触达潜在客户
- 独立开发者向投资人发送融资邮件
- 自由职业者向企业毛遂自荐

**技术机制：**
Skill 接收目标客户信息（公司名、职位、行业等）作为输入，调用 LLM 生成多轮邮件序列（初始邮件 + 跟进邮件），支持自定义语气风格和调用行动（CTA）。输出可直接导入邮件发送工具。

**示例用法：**
```
用户：帮我给 10 家使用 Shopify 的电商品牌写冷邮件，推销我们的 AI 客服方案
AI：生成 10 封个性化冷邮件 + 3 轮跟进序列，每封邮件基于品牌特色定制...
```

**⭐ 推荐指数：★★★★☆（4/5）**
> 冷邮件是 B2B 销售的核心环节，这个 Skill 将手动撰写的时间从数小时缩短到几分钟。扣一颗星是因为仍需人工审核确保语气得体。

---

### 2. Ghost CMS — Ghost 博客全功能管理

**🔗 GitHub:** [chrisagiddings/ghost-cms](https://github.com/openclaw/skills/tree/main/skills/chrisagiddings/ghost-cms/SKILL.md)

**核心功能：**
与 Ghost CMS 深度集成，支持创建、发布、定时和管理博客内容及邮件订阅通讯。覆盖 Ghost Admin API 的主要功能。

**实用场景：**
- 内容营销团队管理多作者博客
- 独立写作者发布Newsletter
- 企业官网内容更新自动化

**技术机制：**
通过 Ghost Admin API 进行交互，支持：
- 文章 CRUD（创建、读取、更新、删除）
- 定时发布
- 标签和作者管理
- 邮件订阅列表管理
- Newsletter 发送

**示例用法：**
```
用户：把这篇 Markdown 文章发布到我的 Ghost 博客，标签设为 "AI" 和 "教程"，定时明天上午 9 点发布
AI：调用 Ghost Admin API 创建文章，设置标签和定时发布...
```

**⭐ 推荐指数：★★★★★（5/5）**
> Ghost 是最受欢迎的开源内容平台之一，这个 Skill 功能全面，对内容创作者来说几乎是必备工具。

---

### 3. Apollo — Apollo.io 销售情报 API 集成

**🔗 GitHub:** [jhumanj/apollo](https://github.com/openclaw/skills/tree/main/skills/jhumanj/apollo/SKILL.md)

**核心功能：**
对接 Apollo.io REST API，实现人员和组织信息增强、线索搜索、列表管理等功能。Apollo.io 是市场上最流行的销售情报平台之一。

**实用场景：**
- 销售团队根据 ICP（理想客户画像）搜索潜在客户
- 获取决策者的联系方式和背景信息
- 管理线索列表，同步 CRM 数据

**技术机制：**
封装 Apollo.io REST API，支持：
- **People Search**：按职位、公司规模、行业等条件搜索联系人
- **Organization Enrichment**：输入公司域名，获取公司详细信息（规模、收入、技术栈等）
- **List Management**：创建和管理线索列表
- **Contact Enrichment**：补充联系人邮箱、电话等信息

**示例用法：**
```
用户：找到 50 家美国地区、员工 50-200 人的 SaaS 公司的 CTO，邮箱整理成表格
AI：调用 Apollo People Search API，筛选条件：title=CTO, location=US, employee_range=50-200, industry=SaaS...
```

**⭐ 推荐指数：★★★★★（5/5）**
> Apollo.io 是销售团队的刚需工具，这个 Skill 让 AI 直接成为你的销售情报分析师。数据质量和覆盖范围行业领先。

---

### 4. Kit Email Operator — Kit (ConvertKit) 邮件营销自动化

**🔗 GitHub:** [kevjade/kit-email-operator](https://github.com/openclaw/skills/tree/main/skills/kevjade/kit-email-operator/SKILL.md)

**核心功能：**
AI 驱动的 Kit（原 ConvertKit）邮件营销管理。支持订阅者管理、邮件序列设计、广播邮件发送、标签和分段管理。

**实用场景：**
- 创作者经济中的 Newsletter 运营
- 在线课程的邮件序列自动化
- 电商品牌的客户生命周期邮件

**技术机制：**
通过 Kit REST API 交互，核心能力包括：
- 订阅者 CRUD + 标签管理
- 创建和管理邮件序列（Sequence）
- 发送广播邮件（Broadcast）
- 表单和着陆页管理
- 数据分析（打开率、点击率等）

**示例用法：**
```
用户：给所有标记了 "AI工具" 标签的订阅者发一封关于新产品上线的广播邮件
AI：调用 Kit API，筛选 tag=AI工具 的订阅者，创建广播邮件，内容如下...
```

**⭐ 推荐指数：★★★★☆（4/5）**
> Kit 是创作者经济最流行的邮件平台之一。这个 Skill 适合已有 Kit 账户的创作者，但如果你的列表还在 Mailchimp 或 Brevo 上，需要先迁移。

---

### 5. Listing Swarm — 一键提交产品到 70+ 目录

**🔗 链接:** [listing-swarm on ClawHub](https://clawhub.ai/skills/listing-swarm)

**核心功能：**
自动将 AI 产品提交到 70+ 产品目录网站，包括 Product Hunt、Toolify、Futurepedia、There's An AI For That 等热门平台。

**实用场景：**
- 独立开发者发布新 AI 产品后快速获取反向链接
- 创业公司进行产品冷启动
- SEO 团队建设外链矩阵

**技术机制：**
Skill 通过浏览器自动化或 API 调用，模拟人工提交流程到各个目录站。支持：
- 自动填充产品信息（名称、描述、Logo、分类等）
- 批量提交到多个平台
- 提交状态追踪
- 支持自定义提交策略（只提交高权重站点 vs 全量提交）

**示例用法：**
```
用户：我刚刚上线了一个 AI 写作助手产品 www.example.com，帮我提交到主流 AI 产品目录
AI：启动 Listing Swarm，准备产品信息... 开始提交到 Product Hunt、Toolify、Futurepedia 等 70+ 平台...
```

**⭐ 推荐指数：★★★★★（5/5）**
> 对于独立开发者和小团队来说，产品目录提交是冷启动最有效的方式之一，但手动提交极其耗时。这个 Skill 解决了一个真正的痛点，ROI 极高。

---

## 📋 推荐指数排名

| 排名 | Skill | 推荐指数 | 最适合人群 |
|------|-------|---------|-----------|
| 1 | Apollo | ★★★★★ | B2B 销售团队 |
| 2 | Ghost CMS | ★★★★★ | 内容创作者/营销团队 |
| 3 | Listing Swarm | ★★★★★ | 独立开发者/创业公司 |
| 4 | Cold Email | ★★★★☆ | B2B 销售人员 |
| 5 | Kit Email Operator | ★★★★☆ | Newsletter 创作者 |

---

## 🎯 应用场景总结

### 场景一：独立开发者产品冷启动

> 你刚上线了一个 AI 产品，需要快速获取用户。

**推荐组合：** Listing Swarm（提交目录） + Cold Email（触达潜在客户） + Ghost CMS（内容营销）

1. 用 **Listing Swarm** 一键提交到 70+ 产品目录，获取初始流量和 SEO 外链
2. 用 **Cold Email** 生成个性化邮件，触达 50 个潜在客户
3. 用 **Ghost CMS** 持续发布技术博客，建立品牌权威

### 场景二：B2B 销售团队自动化

> 你的销售团队需要从零搭建线索获取到跟进的完整流程。

**推荐组合：** Apollo（线索获取） + Cold Email（邮件外联） + WorkCRM（线索管理）

1. 用 **Apollo** 按 ICP 搜索 200 个潜在客户
2. 用 **Cold Email** 生成个性化邮件序列
3. 用 **WorkCRM** 追踪每条线索的进展状态

### 场景三：创作者经济 Newsletter 运营

> 你是内容创作者，想通过 Newsletter 变现。

**推荐组合：** Kit Email Operator（邮件管理） + Ghost CMS（博客内容） + Reef Copywriting（文案优化）

1. 用 **Ghost CMS** 发布免费内容吸引流量
2. 用 **Kit Email Operator** 将读者转化为订阅者
3. 用 **Reef Copywriting** 优化邮件文案，提升打开率和转化率

---

## 💡 实用建议

1. **从痛点出发选择 Skill**：不要贪多，先明确你营销链路中最耗时的环节，再选对应 Skill
2. **注意 API 额度**：Apollo、Kit 等平台都有 API 调用限制，批量操作前确认额度
3. **人工审核不可省**：AI 生成的冷邮件、社媒内容发布前务必人工审核，避免品牌风险
4. **组合使用效果更佳**：单个 Skill 解决单点问题，组合使用才能搭建完整营销工作流
5. **关注数据合规**：使用 Apollo 等数据平台时，注意 GDPR/CCPA 等数据隐私法规

---

> 📅 明日预告：**Media & Streaming（媒体与流媒体）** 分类
>
> 🔗 查看完整分类列表：[awesome-openclaw-skills](https://github.com/openclaw/skills)
>
> 💬 加入社区讨论：[Discord](https://discord.com/invite/clawd)
