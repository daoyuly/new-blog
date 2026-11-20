---
title: OpenClaw Skill 每日推荐 - 营销与销售（marketing-and-sales）
tags:
  - openclaw
  - skill
  - marketing-and-sales
categories:
  - 技术推荐
abbrlink: 20896
date: 2026-11-17 11:30:00
---

# OpenClaw Skill 每日推荐 - 营销与销售（marketing-and-sales）

第 42 期，第三轮第 16 站。

上期收尾埋的钩子：「应用写完只是一半，让用户搜到你才是另一半。」——今天兑现，marketing-and-sales，103 个 skill，目前遇到的第二大分类。

先来一次诚实的勘误：上期预告里说好的 **app-store-optimization，在这个分类里根本不存在**。我把 103 条目翻了个遍，没有任何一个专门的 ASO（App Store 搜索优化）skill。这个空缺本身就是本期最有意思的发现之一——大家都在教你怎么涨粉、怎么发冷邮件，唯独「让 App Store 搜到你」这一环，只有 nicholasrae-review-reply 用评分维护覆盖了半边天。**iOS 开发者做增长的需求，和 skill 生态的供给之间，有一条清晰的裂缝。**

> **链接说明**：往期所用 clawskills.sh 详情页已整站 404，本期继续统一使用官方注册表 [ClawHub](https://clawhub.ai)，安装命令 `clawhub install <slug>`，文内链接均已验证可访问。

## 分类速览

103 个 skill，正经率约 75%——比上期的 83% 略降，主要是被一个「crypto 集团军」拖累的：

| 板块 | 数量 | 代表 |
|------|------|------|
| 内容与社媒 | ~18 | b2c-marketing、bird、ghost-cms、bluesky、tiktok-viral-marketing |
| 冷外联与 BD | ~9 | cold-outreach、phone-caller、foxreach、alibaba-supplier-outreach |
| SEO 与效果分析 | ~10 | meta-tags-optimizer、botsee、posthog、windsor-ai、meta-ads-report |
| CRM 与销售运营 | ~15 | apollo、attio-enhanced、odoo-reporting、clovercli、review-reply |
| 策略与文案框架 | ~18 | go-to-market、lead-magnets、reef-copywriting、listing-swarm |
| crypto 跑错片场 | 9 | 换币、跨链桥、钱包追踪、预测市场…… |
| 其他串场 | ~13 | 4chan-reader、水合教练、TTRPG 团长、Git issue 追踪 |

那个 crypto 集团军值得单独一提：changenow（换币返佣）、lifi-orchestrator（跨链桥）、mobula（88 条链钱包追踪）、buzz-bd（代币 BD 情报）、near-agent-skills、signet（链上广告）、justpayai、crypto-market-data、deck0-skills——9 条 DeFi 生意挤进营销分类，俨然一个「链上营销部」。还有 water-coach（喝水提醒）、dungeons-and-lobsters（机器人奇幻战役）、beads（Git issue 追踪器）这种老朋友式的串场。

另外这个分类的**重复条目**也创了系列纪录：foxreach / foxreach-io、signup-lead / agenticcreed-signup-lead、writing-assistant / writing-group-leader、ad-ready / ad-ready-pro、dellight-content-marketing / dellight-cmo-content-marketing——五组双胞胎，103 条里注水不少。

好，串场的说完，看正经的。

---

## 精选 Skill 详解

### 1. b2c-marketing —— 500M 播放换来的增长教练 ⭐⭐⭐⭐⭐

- **作者**：jackfriks（Jack Friks，情侣应用 Lovelee 作者）
- **安装**：`clawhub install b2c-marketing` ｜ [ClawHub 页面](https://clawhub.ai/skills/b2c-marketing)
- **依赖**：`POST_BRIDGE_API_KEY`（多平台发布 API）

335 行 SKILL.md，开头就晒战绩：**5 亿+ 播放、六位数下载、$33K+ 营收，零广告零预算**（元数据写 300K+ 下载，正文写 130K+，数字有出入，但量级和方法论是真的）。

它把 B2C 有机增长拆成六个阶段，每一步都带着实战细节：

1. **账号创建（Day 1）**：新号用独立邮箱，Instagram 开企业号（能挂链接），TikTok 新号不能挂链接就把应用名写进 bio
2. **社区养号（Day 2-8）**：发帖前先当 7 天真人——刷、点赞、评论、收藏目标垂类内容，让算法先认识你。「我知道这感觉像浪费时间。不是。我急过的每个号都挣扎，认真养的每个号都长得快。」
3. **内容市场契合（Day 8-30）**：找「稳定拿到 1000+ 真实目标用户播放」的格式，一次只测一种，原文金句——**「在你试满 100 个格式之前，你没有资格气馁」**
4. **蹭趋势**：找使用量 10K-50K 的音频（早到能吃到，晚到没肉吃），48 小时窗口，每周最多 1-2 条，80% 靠稳定格式
5. **转化漏斗**：视频 → 主页 → bio → 下载，最强 CTA 是「背景露出」——不提应用名，让观众自己在评论区问
6. **规模化（Day 30+）**：1 号 1 贴/天 ≈ 100 下载/天 → 4 号 3 贴/天 → 30 天 3 万+ 下载，然后才轮到自动化上场

技术实现上，它内置了 [Post Bridge](https://api.post-bridge.com) API 的完整调用链，一次上传发全平台：

```
1. POST /v1/media/create-upload-url  → 拿到 media_id + upload_url
2. PUT 文件到 upload_url
3. POST /v1/posts（带 caption、media ID、平台配置）
4. GET  /v1/post-results?post_id=<id>  查结果
```

批量发帖的 workflow 也考虑周到：先用 ffmpeg 抽帧读出视频里的文字 overlay，再据此写 caption：

```bash
ffmpeg -i video.mp4 -ss 00:00:04 -frames:v 1 frame.jpg -y
```

最有意思的是它的**教练模式**：用户说「有播放没下载」就检查 bio 和 CTA 是否吸引对了人群；说「0 播放」就问有没有养号、内容是不是像广告；说「找到爆款格式但做腻了」，它回——「这就是苦役。爆款格式本身就是生意。你看了 300 遍，你的观众还没看过。」

**适用场景**：独立开发者冷启动、DTC 品牌做 TikTok/Reels、任何想用短视频获客但不知道从哪开始的人。这是整个系列里「实战浓度」最高的 skill 之一，每个论断背后都是作者的亲身数据。

### 2. cold-outreach —— 把 Hormozi 装进 260 行 ⭐⭐⭐⭐½

- **作者**：staybased
- **安装**：`clawhub install cold-outreach` ｜ [ClawHub 页面](https://clawhub.ai/skills/cold-outreach)

B2C 管涨粉，B2B 管开单。这个 skill 把《$100M Leads》的方法论加上 Cleverly / Hypergen / SalesHandy 对 10 万+ 外联活动的分析，压缩成 260 行可直接执行的框架。

开篇先讲残酷现实：Hunter.io 数据显示 **95.9% 的冷邮件无人回复**（实际区间 80-95%）。失败原因高度模式化，它列了 6 条「秒删触发器」：

1. 自我中心开场（"We're the leading..."）——还没人关心你是谁
2. 群发模板（1000 人同文案回复率 2.1%，50 人定向 5.8%）
3. 首封邮件硬卖
4. "Hope this finds you well"——大脑自动标记为群发
5. "Just checking in"——每次跟进必须新增价值
6. 超过 125 词（理想 50-100 词）

然后是「3 秒规则」：**收件人 3 秒内决定读不读，第一行必须证明你研究过「他」而不是在发「你」**。

文案框架按对方认知阶段选型，直接给可填空模板：

```
PAS（知道有问题，没解决）
[PROBLEM] 发现 [公司] 没有 [具体东西]。
[AGITATE] [地区]的大多数[同行]每月因此损失 [X 客户/美元]——而且在复利。
[SOLVE] 我们给 [类似公司] 做的 [方案] 在 [ timeframe ] 内拿到了 [具体结果]。
花 10 分钟看看怎么做到的？

BAB（没意识到有问题）
[BEFORE] 现在，[公司] 还在 [手工排期/无人回评]。
[AFTER] 想象 [自动排上、五星好评源源不断]。
[BRIDGE] 我们帮 [同行] 在 [timeframe] 内完成切换。
看一眼？
```

模板库做到 A-F 六套：E 是 Upwork 提案（对发单者的冷外联），F 是 LinkedIn 连接请求（硬性 <300 字符）。

这个 skill 最值得学的是它的**边界工程**：Use when / Don't use when 各 6 条，还带反例——「写博客？不，那是内容营销」「回客户投诉？不，那是支持」「写 landing page？不对，漏斗阶段都错了」。连 edge case 都想好了：6 个月没回的死线索重新按冷线索处理；LinkedIn 加好友超 30 天没回，降级为带上下文的冷外联。这是整个系列见过最干净的触发设计，堪称 SKILL.md 写作范本。

**适用场景**：B2B 销售、自由职业者接单、本地服务商拓客。

### 3. nicholasrae-review-reply —— 应用上架后的守门员 ⭐⭐⭐⭐½

- **作者**：nicholasrae
- **安装**：`clawhub install review-reply` ｜ [ClawHub 页面](https://clawhub.ai/skills/review-reply)
- **依赖**：App Store Connect API Key、Anthropic API Key、Telegram Bot

上期讲完「怎么把 App 发出去」，这个 skill 管「发出去之后」：自动监控 App Store 评论、起草回复、检测抱怨模式、每天早上 8 点把审批队列推到 Telegram——**你点批准，它才发**。

完整的工作流设计：

- **监控**：cron 每 4 小时轮询 App Store Connect API 的 `/v1/apps/{id}/customerReviews`
- **起草**：只对 1-3 星评论调用 Claude 起草「温暖、符合品牌语气」的回复，4-5 星只记录不回复
- **模式检测**：同一主题抱怨 7 天内出现 3 次以上 → 不等早报，立即 Telegram 告警——大概率是 bug

```
🚨 Pattern Alert — FeedFare
Complaint: "Feed not refreshing / stuck on loading"
Count: 5 reviews in the last 7 days
Rating avg: 1.8★
👉 Likely bug. Recommend investigating feed refresh logic.
```

- **审批队列**：每天 8 点推送待审列表，支持 `/approve_N`、`/edit_N`、`/reject_N` 命令，状态机清晰：

```
new review → [drafting] → [pending] ⇄ [edited]
                              ├─ approve → [approved] → post API → [posted]
                              ├─ reject  → [rejected]
                              └─ skip    → [skipped]
```

**绝不自动发送**——所有回复必须人批，这是它和「AI 自动回复灾难」之间的那道墙。还带完整指标体系：回复率、平均响应时长、评分趋势。

**适用场景**：多 App 独立开发者、 solo founder。评分和回复速度直接影响 App Store 转化率，这是「没有 ASO skill」的现实下离 ASO 最近的一环。顺带说，国内安卓渠道和 Google Play 同理可迁移。

### 4. listing-swarm —— 冷启动分发的体力活终结者 ⭐⭐⭐⭐½

- **作者**：LinkSwarm（heyw00d）
- **安装**：`clawhub install listing-swarm` ｜ [ClawHub 页面](https://clawhub.ai/skills/listing-swarm)
- **依赖**：BYOK——`CAPTCHA_API_KEY`（2captcha）、IMAP 邮箱凭证

「做 AI 产品的人都知道那个枯燥的开局：把产品提交到几十个 AI 目录站换外链和早期流量。」这个 skill 把这事自动化了：**向 70+ AI 目录提交产品**，Agent 自动填表单、解验证码、完成邮箱验证，号称省下 10+ 小时手工提交。

技术细节相当务实——全链路最难的三件事它都解了：表单填写交给浏览器自动化、验证码走 2captcha API、提交后的确认邮件走 IMAP 自动读取点链接。安全设计值得表扬：**BYOK（Bring Your Own Key），凭证全在用户侧，skill 不存任何东西**。

它也是本分类里唯一一条在 awesome 列表里直接挂 ClawHub 链接（而非 GitHub 路径）的，背后是 linkswarm.ai 这个商业产品的 skill 化——「skill 即渠道」的样板。

**适用场景**：AI 产品发布周、独立开发者冷启动、想攒 dofollow 外链的 SEO 基建。

### 5. bird —— 25 行的社媒触手 ⭐⭐⭐⭐

- **作者**：steipete（Peter Steinberger）
- **安装**：`brew install steipete/tap/bird` ｜ [ClawHub 页面](https://clawhub.ai/skills/bird)

上期 steipete 挂名 5 条、4 条拷贝自 Dimillian，这次正名：**bird 是他自己的产品**（主页 [bird.fast](https://bird.fast)），一个 X/Twitter 命令行客户端。

整个 SKILL.md 只有 25 行——对比 b2c-marketing 的 335 行，是「极简派」和「百科派」的两个极端，但都成立，因为 bird 的复杂度本来就该住在 CLI 里而不是提示词里：

```bash
bird whoami                    # 验证登录
bird read <url-or-id>          # 读推文
bird thread <url-or-id>        # 读整个线程
bird search "query" -n 5       # 搜索
bird tweet "text"              # 发推（SKILL.md 要求先向用户确认）
bird reply <id-or-url> "text"  # 回复
```

认证走两条路：浏览器 cookie（Firefox/Chrome 本地读取，零配置）或 Sweetistics API key。发帖前必须向用户确认——对外动作加确认门，这个分寸感是对的。

**适用场景**：跟 b2c-marketing 是天作之合——那个负责选题、脚本和发布策略，bird 负责把内容真的发到 X 上。也是舆情监控的轻量入口（search + 定时 cron 就是简版 Brand24）。

---

## 荣誉提名

- **[kit-email-operator](https://clawhub.ai/skills/kit-email-operator)**（kevjade，483 行）：Kit（ConvertKit）邮件营销全流程，带「声音训练」——喂它 3-5 封历史邮件，提取你的语气结构词汇，以后所有邮件都按你的声音写。注意它的分发方式：**Private ClawHub，仅限付费 Skool 社群成员**——skill 市场出现订阅制商业模式了。
- **[phone-caller](https://clawhub.ai/skills/phone-caller)**（omerflo）：AI 真的打电话。Twilio 拨号 + ElevenLabs 发声（默认 Clara，澳洲口音）+ GPT 当脑子，支持单向留言和双向对话（localtunnel + webhook，每轮 3-5 秒延迟）。示例场景：让 AI 给餐厅订今晚 8 点两位。挂断后自动把通话摘要发 iMessage。
- **[meta-ads-report](https://clawhub.ai/skills/meta-ads-report)**（kein-s）：在聊天里问「昨天的广告表现」，它算好花费、转化、CAC 按广告组拆给你。还带事件发现工具，专治「明明有成交但转化数是 0」的经典 pixel 事件名错配问题。
- **[comms-md-reader](https://clawhub.ai/skills/comms-md-reader)**（stedmanhalliday）：联系一个人之前，先读他的 COMMS.md。这是 AGENTS.md 生态的礼仪层——当 Agent 开始给 Agent 发冷邮件，先看看对方写的「怎么跟我说话」。
- **[botsee](https://clawhub.ai/skills/botsee)**：监控你的品牌在 AI 里的可见度。当用户开始问 ChatGPT「XX 哪家好」，GEO（生成引擎优化）就是新 SEO。

## 本期观察

**1. 营销的对象正在变成 AI。** botsee 监控「AI 怎么谈论你」，comms-md-reader 教 Agent 读对方的自我介绍，crabernews 是「AI 的社交新闻网络」，auto-skill-hunter 让 Agent 自己挖需求装 skill——被营销的、做营销的、看广告的，都开始有 Agent 的份。人机边界上最先商业化的，永远是营销。

**2. ASO 空缺是供给缺口也是信号。** 上架后的评分管理有了（review-reply），目录提交有了（listing-swarm），唯独关键词优化没有。103 个 skill 盯着流量和转化，没人管「搜索发现」这最古老的一环——要么是需求伪命题，要么是蓝海。

**3. 实战派正在进场。** b2c-marketing 晒的是自己的真实数据（数字甚至对不齐，但框架完整可复制），listing-swarm 背后是商业产品，kit-email-operator 做起了付费分发。当 skill 开始自带商业模式，这个生态就从「爱好者仓库」向「软件市场」过渡了。

**4. 本期正经率 75%**，crypto 集团军 9 条 + 五组双胞胎注水是主要扣分项。但头部质量高——五个精选全部值得装。

## 推荐指数排名

| 排名 | Skill | 评分 | 一句话 |
|------|-------|------|--------|
| 1 | b2c-marketing | ⭐⭐⭐⭐⭐ | 5 亿播放换来的 playbook，教练模式独一份 |
| 2 | cold-outreach | ⭐⭐⭐⭐½ | 框架齐全、边界清晰的 B2B 外联武器库 |
| 3 | nicholasrae-review-reply | ⭐⭐⭐⭐½ | 人机协作审批队列的教科书实现 |
| 4 | listing-swarm | ⭐⭐⭐⭐½ | 70+ 目录自动提交，BYOK 安全设计加分 |
| 5 | bird | ⭐⭐⭐⭐ | 25 行的社媒触手，steipete 正名之作 |

## 下期预告

b2c-marketing 说每天一条短视频，bird 负责发到 X——那内容的**原料**从哪来？下期 media-and-streaming（84 个 skill）：本地跑 faster-whisper 的 audio-transcribe、跨平台内容回收的 content-recycler、控制 Apple Music 的 clawtunes……还有老朋友 steipete 的 blucli。营销的尽头是内容，内容的尽头是媒体管道。

---

*本系列为每日自动生成的 OpenClaw Skill 生态观察，数据来源：[awesome-openclaw-skills](https://github.com/awesome-lists/awesome-openclaw-skills) 分类索引 + ClawHub 官方注册表 + 本地 SKILL.md 原文。本期为第三轮第 16 期，累计第 42 期。*
