---
title: OpenClaw Skill 每日推荐 - Marketing & Sales 营销与销售
date: 2026-09-01 11:30:00
tags:
  - openclaw
  - skill
  - marketing-and-sales
categories:
  - 技术推荐
---

# OpenClaw Skill 每日推荐 — Marketing & Sales 营销与销售

> 📅 2026年9月1日 | 第 16/30 期 | 分类：Marketing & Sales
> 
> 今日聚焦：营销与销售领域的 103 个 OpenClaw Skills 精选解读

## 📊 分类概述

**Marketing & Sales** 分类共收录 **103 个 Skills**，是 OpenClaw 生态中最大的分类之一。这个分类涵盖了从冷邮件外联、社交媒体营销、广告投放分析到 CRM 管理、SEO 优化、品牌建设等营销全链路能力。

无论是独立开发者推广产品、初创公司做 GTM 策略，还是营销团队自动化日常工作流，这里都有对应的 Skill 可以直接使用。

---

## 🏆 精选 Skill 详解

### 1. Cold Outreach — 冷邮件外联自动化

| 项目 | 详情 |
|------|------|
| **GitHub** | [staybased/cold-outreach](https://github.com/openclaw/skills/tree/main/skills/staybased/cold-outreach/SKILL.md) |
| **推荐指数** | ⭐⭐⭐⭐⭐ |

**核心功能：** 基于 Hormozi 等营销大师的实战框架，自动生成高转化率的冷邮件（Cold Email）、短信和 LinkedIn DM 序列。支持邮件、SMS、LinkedIn 多渠道外联。

**实用场景：**
- B2B 销售团队批量触达潜在客户
- 独立开发者推广新产品
- 招商合作、媒体 Pitch

**技术实现：** 内置多种经过验证的冷邮件框架模板，通过变量替换实现个性化定制。支持多步骤跟进序列设计，自动生成不同版本的文案供 A/B 测试。

```bash
# 使用示例
openclaw skill install staybased/cold-outreach
# 然后对 AI 说："帮我写一封给 SaaS 公司 CTO 的冷邮件，推荐我们的 API 监控工具"
```

**入选理由：** 冷邮件是营销的基石技能，这个 Skill 直接打包了顶级营销人的方法论，开箱即用。

---

### 2. Ghost CMS — 内容营销全自动化

| 项目 | 详情 |
|------|------|
| **GitHub** | [chrisagiddings/ghost-cms](https://github.com/openclaw/skills/tree/main/skills/chrisagiddings/ghost-cms/SKILL.md) |
| **推荐指数** | ⭐⭐⭐⭐⭐ |

**核心功能：** 全面的 Ghost CMS 集成，支持创建、发布、定时管理和博客内容、新闻通讯的全流程操作。

**实用场景：**
- 内容营销团队管理技术博客
- 独立写作者发布 Newsletter
- 企业定期发布产品更新日志
- 自动化内容发布排期

**技术实现：** 通过 Ghost Admin API 实现完整的 CRUD 操作，支持文章草稿管理、定时发布、标签管理、作者分配等。可以直接从 Markdown 文件发布到 Ghost 平台。

**入选理由：** Ghost 是最受欢迎的开源内容发布平台之一，这个 Skill 让 AI 直接成为你的内容编辑助手，从写作到发布一条龙搞定。

---

### 3. Meta Ads Report — 广告投放数据监控

| 项目 | 详情 |
|------|------|
| **GitHub** | [kein-s/meta-ads-report](https://github.com/openclaw/skills/tree/main/skills/kein-s/meta-ads-report/SKILL.md) |
| **推荐指数** | ⭐⭐⭐⭐ |

**核心功能：** 直接通过对话监控 Meta（Facebook/Instagram）广告投放表现，无需打开 Ads Manager 仪表盘。

**实用场景：**
- 每日快速查看广告系列表现
- 投放团队定期汇报数据
- 电商卖家监控 ROAS 变化
- 发现异常花费时快速排查

**技术实现：** 通过 Meta Marketing API 获取广告系列数据，支持按日期范围、广告系列、指标维度筛选。返回结构化的投放数据摘要，包括花费、展示、点击、转化等核心指标。

**入选理由：** 对任何在 Meta 平台投广告的人来说，能用自然语言问 "昨天广告花了多少、转化率怎样" 然后直接得到答案，体验远超手动翻仪表盘。

---

### 4. Apollo — B2B 客户线索富化

| 项目 | 详情 |
|------|------|
| **GitHub** | [jhumanj/apollo](https://github.com/openclaw/skills/tree/main/skills/jhumanj/apollo/SKILL.md) |
| **推荐指数** | ⭐⭐⭐⭐ |

**核心功能：** 对接 Apollo.io REST API，实现人物/组织信息富化、线索搜索、列表管理等 B2B 销售核心功能。

**实用场景：**
- 销售团队根据 ICP 搜索目标客户决策人
- 对现有线索进行信息补全（邮箱、职位、公司规模等）
- 管理潜在客户列表和分组
- 竞品公司人员变动追踪

**技术实现：** 封装 Apollo.io 的 REST API，支持 People Search、Organization Enrichment、Contact Lists 等核心端点。通过自然语言描述目标客户画像，AI 自动构建 API 查询参数。

**入选理由：** Apollo.io 是 B2B 销售领域最流行的线索数据库之一。将这个能力集成到 AI 助手后，销售人员可以直接用对话方式筛选和富化线索，大幅缩短从 "找到目标" 到 "开始触达" 的路径。

---

### 5. Listing Swarm — AI 产品自动提交

| 项目 | 详情 |
|------|------|
| **链接** | [listing-swarm](https://clawhub.ai/skills/listing-swarm) |
| **推荐指数** | ⭐⭐⭐⭐ |

**核心功能：** 自动将 AI 产品提交到 70+ 个目录网站和聚合平台，实现一次性多渠道分发。

**实用场景：**
- 独立开发者发布新 AI 产品后快速铺量
- SaaS 产品冷启动获取初始流量
- AI 工具上架到 Product Hunt、Futurepedia 等平台
- 替代手动逐一提交的繁琐工作

**技术实现：** 预置 70+ 个产品目录网站的提交模板和流程，自动填充产品信息（名称、描述、Logo、分类等），通过浏览器自动化或 API 提交方式完成批量上架。

**入选理由：** 产品推广最难的不是做好产品，而是让足够多的人看到它。这个 Skill 把 "上架 70 个目录" 从几天的工作压缩到几分钟，是每个 AI 产品创始人的必备工具。

---

## 📋 应用场景总结

### 场景一：独立开发者推广新产品

```
1. 使用 cold-outreach 生成给目标客户的冷邮件序列
2. 使用 listing-swarm 将产品提交到 70+ 个目录
3. 使用 ghost-cms 在博客上发布产品介绍文章
4. 使用 meta-ads-report 监控 Facebook 广告效果
```

### 场景二：B2B 销售团队线索管理

```
1. 使用 apollo 按行业/规模/职位筛选目标客户
2. 使用 cold-outreach 生成个性化邮件序列
3. 使用 campaign-orchestrator 编排多渠道跟进
4. 使用 attio-enhanced 管理 CRM 数据
```

### 场景三：内容营销团队日常运营

```
1. 使用 content-creator 生成 SEO 优化的营销内容
2. 使用 brand-voice-profile 保持品牌调性一致
3. 使用 ghost-cms 定时发布博客和 Newsletter
4. 使用 posthog 分析内容转化漏斗
```

---

## 🎯 推荐指数排名

| 排名 | Skill | 星级 | 最佳场景 |
|:----:|-------|:----:|----------|
| 1 | Cold Outreach | ⭐⭐⭐⭐⭐ | B2B 冷邮件/DM 外联 |
| 2 | Ghost CMS | ⭐⭐⭐⭐⭐ | 内容发布与 Newsletter 管理 |
| 3 | Meta Ads Report | ⭐⭐⭐⭐ | Facebook/Instagram 广告监控 |
| 4 | Apollo | ⭐⭐⭐⭐ | B2B 线索搜索与富化 |
| 5 | Listing Swarm | ⭐⭐⭐⭐ | AI 产品批量上架 |

---

## 💡 实用建议

1. **从冷邮件开始**：如果你只能安装一个营销 Skill，选 `cold-outreach`。冷邮件是所有营销活动的起点，这个 Skill 直接给你顶级营销人的框架。

2. **内容 + 分发双管齐下**：`ghost-cms` 负责 "写出好内容"，`listing-swarm` 负责 "让内容被看到"。两者组合使用效果远大于单独使用。

3. **数据驱动决策**：安装 `meta-ads-report` 或 `posthog` 来追踪营销效果，不要凭感觉调预算。

4. **注意合规性**：使用 `apollo` 和 `cold-outreach` 时，确保遵守 GDPR、CAN-SPAM 等法规，始终提供退订选项。

5. **品牌一致性**：搭配使用 `brand-voice-profile` 来确保所有 AI 生成的营销内容都符合你的品牌调性。

---

## 🔗 相关分类

- **Productivity & Tasks** — 营销任务管理工具
- **Search & Research** — 市场调研和竞品分析
- **Communication** — 客户沟通渠道管理
- **Data & Analytics** — 营销数据分析深度工具

---

> 📌 明日预告：**Media & Streaming** — 媒体与流媒体分类的 Skills 推荐
> 
> 本系列共 30 期，每日一期，涵盖 OpenClaw 全部 Skills 分类。
