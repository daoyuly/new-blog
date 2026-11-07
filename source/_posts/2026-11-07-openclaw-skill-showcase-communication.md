---
title: OpenClaw Skill 每日推荐 - 通信工具（communication）
tags:
  - openclaw
  - skill
  - communication
categories:
  - 技术推荐
abbrlink: 38652
date: 2026-11-07 11:30:00
---

# OpenClaw Skill 每日推荐 - 通信工具

> 「OpenClaw Skill 每日推荐」第 34 期，**第三轮第 4 期**。继续从 [awesome-openclaw-skills](https://github.com/openclaw/skills)（全库 5300+ 条目、30 个分类）中每天取一个分类，精选代表性 skill 深入介绍。昨天说日历分类是「出错的代价最真实」，今天这个分类有过之而无不及——**通信工具（Communication）** 收录 145 个 skills，教 Agent 发消息、回邮件、打电话，给它装上「嘴」。嘴装上了，说错话的代价也就来了：浏览器抓错数据可以重抓，一封发错的邮件收不回来。

## 今日分类概述

Communication 是全库最大的分类之一（**145 个 skills**，仅次于 ai-and-llms）。它也是景观最杂的一个，大致能切成五块：

- **邮件基建**：[aa](https://github.com/openclaw/skills/tree/main/skills/azvast/aa/SKILL.md)（自动代回 Gmail）、`agent-mail` 与 `agent-mail-cli`（给 Agent 造专用收件箱）、`clawemail`（Google Workspace 全家桶）、`sixel-email`（1:1 限定邮件通道——Agent 只能发给一个地址，也只有那个地址能发进来，白名单思想的极致）、`custom-smtp-sender`、`disposable-email-for-agents`（一次性邮箱）、`lnemail`（用比特币闪电网络付费的匿名邮箱，很赛博朋克）、`apple-mail-search-safe`、`gmail-last5`、`expanso-email-triage`（邮件分诊 + 日历同步 + 回复草拟）。
- **平台消息**：[beeper](https://github.com/openclaw/skills/tree/main/skills/krausefx/beeper/SKILL.md)（下面详讲）、`groupme-cli`、`rocketchat`、`claw-me-maybe`（Beeper 集成的另一个入口）、`pidgesms`（借一台 Android 手机收发短信）、`freemobile-sms`（给法国 Free Mobile 用户发短信，作者的法语注释写着「给你的人类发短信」——定位很准确）、`tsend`（Telegram 传文件）、`v2ex`（V2EX API，中文社区玩家的亲切惊喜）。
- **Agent 社交网络扎堆**：这是本分类独有的奇观——`agent-nou`、`agent-social`、`agentbook`、`botworld`、`claw-club`、`clawgang`、`koen`、`aulifox`、`enteriva-ai-social-hub`、`lumos-auditor`……至少十个「Agent 专属社交网络」，外加 `klawdin`（Agent 版 LinkedIn，替主人经营职场人脉）、`gradientdesires`（Agent 婚恋平台，宣传语包括「fall in love, and start drama」，堪称赛博情人节限定）、`lelamp-room`（3D 龙虾聊天室，Agent 化身龙虾在里面溜达聊天）。协议层也有几个认真的选手：`youam`（Universal Agent Messaging 协议）、`agentmesh`（WhatsApp 式端到端加密）、`clawchat-p2p`、`quackgram`。
- **语音与电话**：`outbound-call`（下面详讲）、`clawring`（「Real phone calls from your bot」）、`miranda-elevenlabs-speech`（ElevenLabs TTS/STT）、`sarvam`（印度语言语音）、`aliyun-asr`（阿里云语音转写，支持飞书）、`voice-email`（语音口述发邮件，无障碍友好）。
- **内容分发**：`blogburst`（一篇文章秒变 10+ 条社媒帖子）、`moments-copy`（生成病毒式朋友圈文案）、`subreddit-scout`（找高契合 subreddit、读版规、给价值优先的发帖角度）、`publora-telegram`（定时发 Telegram 频道）、`readx`（X/Twitter 情报分析）。

还有一撮「通信 + 会议」的跨界选手：`coordinate-meeting`、`meetlark`（都是 mkelk 的作品，给人类和 Agent 混合团队排会议——接昨天日历分类的话头）、`bookameeting`、`meeting-coordinator`（行政级排会：邮件、场地、确认一条龙）。

老规矩说噪音：145 个条目里，真正通信相关的大约只占一半。`tradingview-screener`、`rho-signals`、`mt5trade`、`banana-farmer` 等十几只加密货币和股票交易工具，`camelcamelcamel-alerts`、`ecommerce-price-watcher`、`zepto`（生鲜下单）等一队电商比价，再加上 `neo-py2py3-converter`（Python 2 转 3？）、`ctf-writeup-generator`、`openra-rl`（玩红警）、`lembrete-agua`（每两小时提醒喝水，葡萄牙语）……自动分类的通病在这里尤其严重，检索时务必多看一眼描述。

## 精选 Skill 详解

### 1. beeper —— 让 Agent 读遍你的聊天史 ⭐⭐⭐⭐✨

**链接**：[krausefx/beeper](https://github.com/openclaw/skills/tree/main/skills/krausefx/beeper/SKILL.md)

「Search and browse local Beeper chat history」——功能一句话说完：在本地检索和浏览 Beeper 的聊天记录。但往深一层想，这是在给 Agent 接上**记忆**。

Beeper 本身是个统一聊天客户端，把 WhatsApp、iMessage、Telegram、Signal、Messenger 等一串平台桥接进同一个本地数据池。对 Agent 来说，这份池子是无价的：你两周前在 WhatsApp 里跟客户随口说的需求、上周 Telegram 群里讨论的技术选型、iMessage 里家人提的「记得帮我带东西」——这些上下文散落在七八个 App 里，人类自己都记不全，而 Agent 一旦能检索它们，回答「客户上次说的那个预算范围是多少」这类问题就从猜变成了查。

作者 krausefx 是 Felix Krause——iOS 圈老熟人，自动化工具 Fastlane 的作者，后来做过 iOS 隐私安全研究。由对开发者工具链和隐私都敏感的人来做「让 Agent 读聊天记录」这件事，选「本地检索」而不是「上云同步」这个方向，算是意料之中的稳健。

配合它的姊妹条目 `claw-me-maybe`（同样接 Beeper，偏消息收发），读和写就齐了。

**适用场景**：会议前拉取相关客户的跨平台沟通记录；「我什么时候答应过这件事」式的上下文考古；把聊天里的口头承诺提炼成待办（跟日历分类的 apple-reminders 正好串起来）。

**推荐指数**：⭐⭐⭐⭐✨（4.5/5）——聊天记录是 Agent 最被低估的数据源，前提是你本来就在用 Beeper。

### 2. postwall —— 发邮件之前，先问过你 ⭐⭐⭐⭐✨

**链接**：[casperaiassist/postwall](https://github.com/openclaw/skills/tree/main/skills/casperaiassist/postwall/SKILL.md)

「Secure email gateway for AI agents - human-in-the-loop approval for reading and sending emails」——一个带人工审批的邮件网关：Agent 读邮件、发邮件，都要先过你这一关。

在一百多个通信 skill 里，绝大多数在比谁发得快、发得多，postwall 是少数在回答另一个问题的：**Agent 凭什么直接用你的邮箱说话？** 它把「Agent 有通信能力」和「Agent 有通信权限」拆成了两件事——能力照给，权限留闸。读信要批，发信更要批，每封出站邮件都是你看过才点的发送。

这个设计值得所有通信类 skill 借鉴。邮件和聊天不一样：聊天有聊天记录可查可撤回（大概），邮件是法律意义上的书面往来，发错客户、发错附件、发错语气，代价都是真实世界的。本系列反复说「出错的代价」：浏览器自动化错在数据，日历自动化错在时间，通信自动化错在**关系**——而关系是最难回滚的。

另一个思路相近的条目是 `sixel-email`：干脆把 Agent 的通信对象限定成一个地址，1:1 白名单，用拓扑限制爆炸半径。一个靠审批流，一个靠收窄面，殊途同归。

**适用场景**：让 Agent 起草所有对外邮件、你只做最后审批；试用期 Agent 的只读邮箱；给家里长辈配的邮件助手（误发风险为零）。

**推荐指数**：⭐⭐⭐⭐✨（4.5/5）——不炫技，但它回答的问题比炫技重要得多。首次给 Agent 开邮件权限，从它开始。

### 3. microsoft365 —— 企业通信的一站式集成 ⭐⭐⭐⭐

**链接**：[robert-janssen/microsoft365](https://github.com/openclaw/skills/tree/main/skills/robert-janssen/microsoft365/SKILL.md)

「Microsoft 365 integration for Outlook, Calendar, Contacts, and OneDrive via Microsoft Graph API」——通过 Graph API 一站式覆盖 Outlook 邮件、日历、通讯录、OneDrive 四个工作负载。

昨天讲过 M365 阵营的 `clippy`（日历 + 邮件的轻量 CLI），今天这个是它的重装版：多出通讯录和 OneDrive，而且四件套走同一个 Graph 认证。对企业用户来说，这个组合拳有实际意义——「给上周开会的所有人发一封会议纪要，附件放 OneDrive，链接写进邮件」这种一句话任务，横跨四个工作负载，统一认证下 Agent 一次串完，不用在中途换凭据。

同阵营还有 `m365-pnp-cli`（PnP 那套 CLI，管 SharePoint 和 Teams，运维味更重）。两害相权：个人轻度用选 clippy，要把邮件、文件、人脉一起交给 Agent 选 microsoft365。

上期说过的预防针这里原样有效：Graph 的企业权限体系（管理员同意、租户策略）决定你能不能顺利接上。公司电脑上能不能用，先问 IT。

**适用场景**：会议纪要自动分发（纪要 + 附件 + 邮件一次完成）；通讯录驱动的批量通知；把 OneDrive 文档链接智能补进邮件和邀请。

**推荐指数**：⭐⭐⭐⭐（4/5）——M365 用户的通信中枢，门槛依旧取决于你的 IT 部门。

### 4. localsend —— Agent 之间的 AirDrop ⭐⭐⭐⭐

**链接**：[chordlini/localsend](https://github.com/openclaw/skills/tree/main/skills/chordlini/localsend/SKILL.md)

「Send and receive files to/from nearby devices using the LocalSend protocol」——用 LocalSend 协议在附近设备间收发文件。

LocalSend 本身是这几年口碑很好的开源项目：跨平台的 AirDrop 替代品，同一 Wi-Fi 下手机、电脑、平板互传文件，不走公网、不建账号。这个 skill 把这套协议交给了 Agent，于是「把刚下载的 PDF 传到我手机上」「把我手机相册里刚才那几张截图拿过来处理」变成了对 Agent 说一句话的事。

它解决的是一个常被忽略的场景：**Agent 的工作成果大多停留在电脑里，而人拿着手机在客厅**。云端中转当然可以，但要登录、要上传、有隐私顾虑；局域网直传是零成本路径——快、私密、断网也能用。同类选手还有 `tsend`（Telegram 传文件，跨地域场景）和 `feishui-file-sender`（飞书传文件，团队场景），正好构成「本地 / 远程 / 协作」三个距离档位。

**适用场景**：电脑上处理完的照片/文档直接推到手机；让 Agent 从手机端拉取素材（截图、扫描件）；智能家居场景里往客厅设备投递文件。

**推荐指数**：⭐⭐⭐⭐（4/5）——零配置、零云依赖，装了不后悔的基础设施型 skill。

### 5. outbound-call —— 给 Agent 一部电话 ⭐⭐⭐✨

**链接**：[humanjesse/outbound-call](https://github.com/openclaw/skills/tree/main/skills/humanjesse/outbound-call/SKILL.md)

「Make outbound phone calls via ElevenLabs voice agent and Twilio」——用 ElevenLabs 的语音 Agent 加 Twilio 的电话网络，让 Agent 拨出真实电话。

技术栈一看就懂：ElevenLabs 出「声」（低延迟、拟人的语音对话），Twilio 出「线」（PSTN 电话网络），Agent 出「词」。这是通信分类里离科幻最近的场景——预约餐厅、询问营业时间、代拨客服热线，Agent 真的拿起电话替你说话。同方向的还有 `clawring`（描述就一句「Real phone calls from your bot」，方案未知）。

但把它排在第五，是因为这是本分类里**出错成本和不确定性最高**的方向。电话是同步、不可编辑的强实时媒介：说错一句就是说了，对方听到的每个字都收不回；录音告知义务、AI 语音的合规要求、各地对自动外呼的监管，也都是真实的坑。再加上按秒计费，一句口误就是真金白银。

想玩的话给三条保命建议：第一，先让它打你自己的手机，把话术跑顺；第二，通话对象和目的必须由你显式指定，绝不给 Agent 自由拨号权；第三，选低风险场景（查营业时间）起步，别一上来就让它替你谈事情。

**适用场景**：预约电话（餐厅、诊所）；查询单向信息（营业时间、库存）；行动不便者的电话代办。

**推荐指数**：⭐⭐⭐✨（3.5/5）——方向性感，落地要稳，适合当玩具养熟了再当工具用。

## 应用场景总结

把 145 个 skills 按「你想干什么」重新归置（只列通信正经军）：

| 你要做的事 | 值得看的 skills | 一句话建议 |
|---|---|---|
| 翻聊天史找上下文 | `beeper`、`claw-me-maybe`、`apple-mail-search-safe`、`gmail-last5` | 聊天记录是 Agent 最好的记忆库 |
| 邮件收发与分诊 | `postwall`、`expanso-email-triage`、`email-autoreply`、`aa`、`personaldatahub` | 出站动作必须过人审 |
| 企业 M365 通信 | `microsoft365`、`m365-pnp-cli`、`clawemail` | Graph 权限先过 IT 这关 |
| 文件传输 | `localsend`、`tsend`、`feishui-file-sender` | 本地、远程、团队三个距离档 |
| 给 Agent 装电话 | `outbound-call`、`clawring`、`miranda-elevenlabs-speech` | 先拨自己手机练话术 |
| Agent 之间通信 | `youam`、`agentmesh`、`clawchat-p2p`、`quackgram` | 协议混战期，玩票心态入场 |
| 内容多平台分发 | `blogburst`、`moments-copy`、`subreddit-scout`、`publora-telegram` | 一稿多改，先审后发 |
| 会议协调（人类+Agent） | `coordinate-meeting`、`meetlark`、`meeting-coordinator` | 接昨天日历分类的下半场 |

值得单独一提的两个「偏门但有意思」：`sixel-email` 的 1:1 白名单通道是安全设计的另一种答案；`voice-email` 面向无障碍场景，让语音口述变成邮件——通信工具的包容性设计，平时想不起来，需要时是刚需。

## 推荐指数排名

1. **beeper** ⭐4.5 —— 聊天记录金矿，给 Agent 接上跨平台记忆
2. **postwall** ⭐4.5 —— human-in-the-loop 的通信安全样板
3. **microsoft365** ⭐4 —— 企业四件套一站式，Graph 统一认证
4. **localsend** ⭐4 —— 局域网直传，零云依赖的基础设施
5. **outbound-call** ⭐3.5 —— 真电话外呼，性感但得拴绳用

## 实用建议

- **出站一律过审**。读可以放开，写必须留闸——每封邮件、每条消息发出前给主人过目，尤其头一个月。postwall 把这个理念做成了产品，哪怕你不用它，也值得照抄这个流程。通信出错的代价是关系，而关系没有回滚命令。
- **身份要亮明**。Agent 代你发言时，让对方知道对面是 AI（「这是我的助手代发的，我会跟进」）。冒充本人短期省事，长期透支的是你自己的人际信用。
- **聊天记录是资产，也是雷区**。给 Agent 接入聊天史的收益巨大，但记得收窄范围：按项目、按时间窗授权，别把十年私聊一把梭给它——里面躺着你都忘了自己说过的东西。
- **电话这种强实时媒介，先仿真后上真**。话术在自家手机上迭代到不尬，再碰真人；并且始终保留「最后一步人工确认」的闸门，成本虽高，但比给陌生人拨错电话便宜。
- **警惕这个分类的标签**。一半条目是交易、比价、游戏、喝水提醒——检索时以描述为准，别信文件夹的名字。反过来，那些「Agent 社交网络」虽像玩具，却可能是 Agent 互联网的早期形态，值得隔三差五回去看一眼。

明天进入 **data-and-analytics（数据分析）**——通信管「说出去」，数据分析管「看进来」，让 Agent 替你读数。
