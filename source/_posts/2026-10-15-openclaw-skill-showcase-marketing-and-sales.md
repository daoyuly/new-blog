---
title: OpenClaw Skill 每日推荐 - Marketing & Sales（营销与销售）
date: 2026-10-15 11:30:00
tags: [openclaw, skill, marketing-and-sales]
categories: [技术推荐]
---

# OpenClaw Skill 每日推荐：Marketing & Sales（营销与销售）（103 个 Skills）

> OpenClaw Skill 每日推荐第 16 期。今天进入可能是对个人和小团队最有"钱景"的分类 —— **marketing-and-sales**，共收录 103 个 skills。这个分类几乎是一个完整的"一人增长团队"工具箱：从找线索、写冷邮件、做广告素材，到盯投放数据、管 CRM，AI Agent 都能接管。

## 今日分类概述

营销与销售分类是所有 30 个分类中体量第二大的（仅次于 ai-and-llms），103 个 skills 大致可以分成六条线：

| 方向 | 代表 Skills | 说明 |
| --- | --- | --- |
| **销售情报** | apollo、attio-enhanced、workcrm | 查客户、富化数据、管 CRM |
| **外联触达** | cold-email、cold-outreach、foxreach、phone-caller | 冷邮件、短信、甚至 AI 打电话 |
| **广告创意** | ad-ready、ad-ready-pro、ar-filter-generation | 从商品链接直接生成广告图 |
| **投放分析** | meta-ads-report、posthog、windsor-ai | 用自然语言查广告和产品数据 |
| **内容与社媒** | bird、bluesky、simplified-social-media、ghost-cms | 发帖、排期、多平台管理 |
| **获客渠道** | listing-swarm、lead-magnets、go-to-market | 目录提交、GTM 策略 |

整体观察：这个分类的 skill 有个鲜明特点 —— **大多是"API 封装型"**，把 SaaS 平台的能力通过 REST API / SDK 暴露给 Agent，让"问一句、办一件事"成为可能。下面挑 5 个最有代表性的细讲。

## 精选 Skill 详解

### 1. apollo —— 销售情报与客户数据富化 🛰️

**链接**：[jhumanj/apollo](https://github.com/openclaw/skills/tree/main/skills/jhumanj/apollo/SKILL.md)

**核心功能**：对接 Apollo.io（全球最大的 B2B 销售情报数据库之一）的 REST API，支持人物/公司搜索、域名富化、组织信息批量查询。

**实用场景举例**：

- "帮我找 5 个 SaaS 公司的 VP Marketing，附上邮箱" —— 一句话完成原本要在 Apollo 网页上点十几次的操作
- 拿到一个潜在客户的域名，立刻拉出公司规模、融资阶段、技术栈
- CRM 里缺联系方式？批量富化一波

**技术实现**：纯 Bash 脚本封装 REST API，通过 `X-Api-Key` 请求头认证，配置文件放 `config/apollo.env`。设计上很克制 —— 提供低层 GET/POST 助手脚本 + 几个常用场景的封装：

```bash
# 人物搜索：职位关键词 + 页码 + 每页数量
skills/apollo/scripts/apollo-people-search.sh "vp marketing" 1 5

# 按域名富化公司信息
skills/apollo/scripts/apollo-enrich-website.sh "apollo.io"
```

SKILL.md 里还贴心地写了两个坑：部分接口需要 **master API key + 付费计划**（返回 403），以及常见接口有 **600 次/小时的限流**（要处理 429）。

**推荐指数**：⭐⭐⭐⭐

### 2. cold-email —— AI 冷邮件序列生成 ✉️

**链接**：[bluecraft-ai/cold-email](https://github.com/openclaw/skills/tree/main/skills/bluecraft-ai/cold-email/SKILL.md)

**核心功能**：基于 MachFive 平台，把线索数据（姓名、职位、公司、LinkedIn）变成 3-5 封一组的个性化冷邮件序列。卖点很明确：**AI 先研究对象再写邮件，不是套模板**。

**实用场景举例**：

- 拿到一份展会名单，批量生成针对每个职位的差异化触达序列
- 设置批准过的 CTA 列表（约会议/领资料），让 AI 只能从中选择，控制承诺口径
- 单个高价值客户，生成深度定制的触达序列

**技术实现**：REST API 调用，需要 `MACHFIVE_API_KEY`。有两个值得学习的工程细节：

1. **防呆设计** —— 如果用户没指定 campaign ID，skill 会先调 `GET /api/v1/campaigns` 列出所有 campaign 让用户选，绝不瞎猜。这种"不假设默认值"的设计在写 skill 时非常值得抄。
2. **超时预期管理** —— SKILL.md 明确警告：AI 研究加生成需要 3-5 分钟，客户端超时必须设到 300 秒以上，"用 120 秒超时会被截断"。给 Agent 写工具说明时，把这类运行时陷阱写清楚，能省掉大量调试时间。

```json
POST /api/v1/campaigns/{campaign_id}/generate
{
  "lead": {
    "name": "John Smith",
    "title": "VP of Marketing",
    "company": "Acme Corp",
    "linkedin_url": "https://linkedin.com/in/johnsmith"
  },
  "options": {
    "email_count": 3,
    "approved_ctas": ["Direct Meeting CTA", "Lead Magnet CTA"]
  }
}
```

**推荐指数**：⭐⭐⭐⭐

### 3. ad-ready —— 从商品链接到广告大片 🎨

**链接**：[pauldelavallaz/ad-ready](https://github.com/openclaw/skills/tree/main/skills/pauldelavallaz/ad-ready/SKILL.md)

**核心功能**：输入一个电商商品 URL（可选品牌名、漏斗阶段），输出一张带模特的专业广告图。这是本次精选里技术含量最高的一个。

**实用场景举例**：

- 独立站卖家上新，一键生成 awareness / consideration / conversion 三个漏斗阶段的素材
- 想测试不同视觉调性？换个漏斗阶段重新生成，风格自动切换
- 品牌方用 70+ 预置品牌档案保持视觉一致性

**技术实现**：部署在 ComfyDeploy 上的 ComfyUI 自定义节点，内部跑一个**四阶段流水线**：

```
阶段 1：商品抓取（Gemini Flash）→ 提取标题/卖点/价格/高清图
阶段 2：创意简报（Gemini Flash）→ 10 点框架的 Campaign Brief
阶段 3：蓝图生成（Gemini Flash）→ 漏斗阶段 Master Prompt → JSON Blueprint
阶段 4：图像生成（Nano Banana Pro / Imagen 3）→ 最终广告图
```

最值得称道的是**阶段 2 的"创意简报"**：它扮演"资深艺术总监"，用 10 点框架（战略目标、中心信息、视觉语气、产品角色、品牌一致性、摄影概念、艺术指导、环境语境、材质渲染、最终签名）把原始数据翻译成可执行的创意方向。SKILL.md 里有句话说得很好：*没有简报，Master Prompt 只能猜创意策略；有了简报，Master Prompt 只管执行*。

另外还有 **Fidelity Lock** 机制 —— 商品几何形状和模特身份在生成过程中被标记为不可变，防止 AI 出图时把产品画走样。这是 AI 生图用于电商的核心痛点。

**推荐指数**：⭐⭐⭐⭐⭐

### 4. meta-ads-report —— 用聊天查广告数据 📊

**链接**：[kein-s/meta-ads-report](https://github.com/openclaw/skills/tree/main/skills/kein-s/meta-ads-report/SKILL.md)

**核心功能**：通过自然语言直接查询 Meta（Facebook/Instagram）广告绩效：花费、转化数、CAC（获客成本），支持按广告组分解，日期支持"昨天"、"上个月"这类自然语言。

**实用场景举例**：

- 早上睁眼问一句："昨天广告跑得怎么样？" —— 直接得到 Spend / Conversions / CAC
- "最近 7 天哪个广告组的 CAC 最低？"
- 转化数明明有单却显示 0？让 Agent "List all ad events" 找到像素事件的真实名称，改一下配置就好

**技术实现**：基于 Meta Graph API，配置三个环境变量即可（`META_ACCESS_TOKEN`、`META_AD_ACCOUNT_ID`、`META_EVENT_NAME`）。SKILL.md 里附了完整的凭证申请步骤（Graph API Explorer 勾选 `ads_read`、`read_insights` 权限）。

它的第二能力**事件发现工具**非常实用 —— Meta 像素的转化事件名五花八门（`purchase`、`lead`、`offsite_conversion.custom...`），配错了事件名，报表永远是 0。这个工具直接列出账户里所有活跃事件的原始名称，解决了一个真实且高频的痛点。

**推荐指数**：⭐⭐⭐⭐

### 5. foxreach —— 冷邮件外联全流程管理 🦊

**链接**：[concaption/foxreach](https://github.com/openclaw/skills/tree/main/skills/concaption/foxreach/SKILL.md)

**核心功能**：管理 FoxReach 冷邮件外联平台的全部资源：线索、活动、序列、模板、发件邮箱、收件箱、分析报表。如果说 cold-email 是"写邮件"，foxreach 就是"管整个外联流水线"。

**实用场景举例**：

- "建一个新 campaign，把这 50 个线索挂上去，用三步序列发出去"
- "查一下这周哪个模板回复率最高"
- 收件箱里来了回复，让 Agent 总结并起草回复

**技术实现**：Python SDK + CLI 双形态，API key 以 `otr_` 为前缀，通过环境变量注入、绝不硬编码。它的执行模式很有代表性 —— 不预定义所有命令，而是教 Agent **用 SDK 写内联 Python 脚本**：

```python
from foxreach import FoxReach

client = FoxReach(api_key="otr_USER_KEY_HERE")
# 任意 SDK 支持的操作都能组合
client.close()
```

这种"给 Agent 一把瑞士军刀而不是一排预制按钮"的设计，灵活性远高于固定命令列表，代价是对模型能力要求更高。

**推荐指数**：⭐⭐⭐⭐

## 应用场景总结

把今天的 skills 串起来，可以拼出一条完整的 **AI 驱动增长流水线**：

```
找线索（apollo）→ 触达（cold-email / foxreach）→ 转化素材（ad-ready）
     → 投放（Meta 广告）→ 数据复盘（meta-ads-report / posthog）
```

几个典型组合：

1. **独立开发者冷启动**：listing-swarm 提交 70+ 目录拿首批曝光 → posthog 埋点看留存 → go-to-market 规划正式发布
2. **B2B 销售自动化**：apollo 找决策人 → cold-email 生成个性化序列 → foxreach 管理后续跟进
3. **电商投放优化**：ad-ready 批量出素材 → meta-ads-report 每天用聊天查 CAC → 砍掉高 CAC 广告组
4. **内容营销**：brand-voice-profile 固化品牌语气 → writing-assistant 生产内容 → simplified-social-media 多平台分发

## 推荐指数排名

| 排名 | Skill | 推荐指数 | 一句话点评 |
| --- | --- | --- | --- |
| 🥇 | ad-ready | ⭐⭐⭐⭐⭐ | 工程最扎实：四阶段流水线 + 创意简报 + 产品保真锁 |
| 🥈 | apollo | ⭐⭐⭐⭐ | B2B 销售情报标配，脚本封装克制好用 |
| 🥈 | cold-email | ⭐⭐⭐⭐ | 个性化序列生成，防呆设计值得学习 |
| 🥈 | meta-ads-report | ⭐⭐⭐⭐ | 小而美，事件发现工具解决真实痛点 |
| 🥈 | foxreach | ⭐⭐⭐⭐ | 外联全流程管理，SDK 交给 Agent 灵活组合 |

## 实用建议

1. **先想清楚合规边界**。冷邮件在欧美受 CAN-SPAM / GDPR 约束，国内也有反垃圾邮件规范。用这些工具放量前，确认你的名单来源和退订机制是合规的。
2. **API key 管理要统一**。这批 skills 几乎每个都要一个 API key（`MACHFIVE_API_KEY`、`META_ACCESS_TOKEN`、`otr_...`）。建议在 OpenClaw 的环境配置里集中管理，定期轮换，别让 key 散落在聊天记录里。
3. **文案类 skill 的产出要人工过一遍**。cold-email、cold-outreach 这类基于框架（如 Hormozi 的方法论）生成的内容，框架是对的，但具体承诺、价格、数据引用必须人工核实后再发。
4. **很多 skill 有免费层但都按量收费**。apollo 免费额度有限、Meta 广告本身烧钱、MachFive 按量计费 —— 先用小批量验证 ROI 再放量。
5. **国内用户可替换选型**。Apollo、Meta 广告类工具在国内场景受限，可以参考同类的组合思路：销售情报换成企查查/天眼查 API，投放分析换成巨量引擎/腾讯广告的报表接口，思路完全通用。

---

*明天进入第 17 期：**media-and-streaming（媒体与流媒体）**，看看 AI Agent 怎么接管你的影音娱乐。欢迎持续关注。*
