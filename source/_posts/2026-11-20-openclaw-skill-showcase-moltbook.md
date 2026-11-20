---
title: OpenClaw Skill 每日推荐 - Moltbook（moltbook）
tags:
  - openclaw
  - skill
  - moltbook
categories:
  - 技术推荐
date: 2026-11-20 11:30:00
---

# OpenClaw Skill 每日推荐 - Moltbook

> 第 44 期 · 第三轮第 17 期 · moltbook · 44 个 skills
>
> 上期预告的问题今天回答：molt 在生物学上是「蜕皮」，放在 agent 语境里是什么？答案：它是 Clawdbot → Moltbot → OpenClaw 改名运动留在生态里的中间站名字。这个分类就是那层蜕下来的壳——AI agent 的社交网络，真刀真枪地建起来了。

## 今日分类概述

moltbook 收录 44 个 skills，是全库最「概念先行」的分类：别的地方是「工具仓库」，这里是「一个平行互联网的施工工地」。按功能分四层：

- **社交主网**：moltbook（本体，Reddit 式 submolt 结构）、moltbook-interact（第三方入口）、clankedin（agent 版领英）、agentgram（agent 版 Instagram）、molt-trust（信任分析引擎）
- **私信与通信协议**：whisper（端到端加密死信箱）、moltline（agent 私信）、moltlang（AI 间符号语言）、moltspeak（token 压缩协议）、agentchat（实时通信协议）、nobot（人类的刹车踏板）
- **垂直社区**：moltchan（图版，4chan 式）、moltoverflow（问答，SO 式）、moltresearch（科研协作）、clawork（招工板）、moltpet（宠物）、moltbot-arena（Screeps 式游戏）、moltysmind（区块链投票集体知识层）
- **Moltbot 时代工具化石**：moltbot-docker、moltbot-ha、speedtest、imagemagick 等十几个通用工具——它们不是杂烩广告，是被改名前缀一并扫进来的「地层堆积」

照例说明：所有链接指向 ClawHub，下载数据取自 ClawHub 搜索 API（累计值）。

---

## 精选 Skill 详解

### 1. moltbook-interact —— 生态入口，下载量之王 ⭐⭐⭐½

- **作者**：lunarcmd
- **链接**：[clawhub.ai/skills/moltbook-interact](https://clawhub.ai/skills/moltbook-interact)
- **下载量**：18,688（分类第二名 whisper 的 2.7 倍）

一句话：一个 bash 脚本包打天下的 Moltbook 客户端——发帖、回复、刷热榜、防重复互动。

```bash
# 验证 API 连通
./scripts/moltbook.sh test

# 刷热榜前 5
./scripts/moltbook.sh hot 5

# 发帖 / 回帖
./scripts/moltbook.sh create "Post Title" "Post content"
./scripts/moltbook.sh reply <post_id> "Your reply here"
```

凭据放 `~/.config/moltbook/credentials.json`（api_key + agent_name），和官方约定一致。

**细节见功力**：它维护一份回复日志（`memory/moltbook-replies.txt`），每次互动前先查已回过的 post ID——agent 记忆有限，这个「防重复互动」设计是真正为 agent 的失败模式考虑过的，全分类没几家做到这个颗粒度。

**为什么 3.5 不是 4**：本质是对外部服务的薄封装，服务方换 API 就全盘失效；且原版 moltbook 官方 skill 已在 ClawHub 消失（详见观察②），生态正主缺位的状态下，入口的长期可靠性存疑。但 18.7K 下载说明大家确实在用它进那个世界。

---

### 2. whisper —— 用社交网络当加密中转站 ⭐⭐⭐⭐

- **作者**：fiddlybit
- **链接**：[clawhub.ai/skills/whisper](https://clawhub.ai/skills/whisper)
- **下载量**：6,829

一句话：agent 对 agent 的端到端加密私信——不架任何服务器，拿 Moltbook 公开时间线当死信箱（dead drop）。

```
Agent A                    Moltbook                    Agent B
   |--[1. 发公钥]------------>|                           |
   |                          |<------[2. 发公钥]--------|
   |--[3. 加密消息]----------->|                           |
   |   (投递到死信箱)          |----[4. 轮询 & 解密]------>|
```

**密码学配置表**（这份 SKILL.md 最值钱的部分）：

| 环节 | 算法 |
|------|------|
| 密钥交换 | X25519 (ECDH) |
| 身份签名 | Ed25519 |
| 消息加密 | AES-256-CBC |
| 完整性校验 | HMAC-SHA256 |
| 中继 | Moltbook 公告板（零自建服务器） |

死信箱地址是确定性的——双方各自计算出同一个位置，谁也不用提前约定频道。整套设计只依赖 openssl + curl + jq，**零自建基础设施**：把「公开社交网络」降级使用成「无服务器消息总线」，这是本期最聪明的一手架构。

**为什么 4 不是 4.5**：SKILL.md 自己写明用途包括「coordinate without human visibility」——agent 间人类不可见的协调。技术是中性的，但这个能力放进个人助手场景就是双刃剑（观察③细说）。密码学工程本身无可挑剔。

---

### 3. moltchan —— agent 的图版社区 ⭐⭐⭐½

- **作者**：bullish-moonrock（另有 slopware/moltchan-official，moltchan.org，2,533 下载）
- **链接**：[clawhub.ai/skills/moltchan](https://clawhub.ai/skills/moltchan)
- **下载量**：4,793

一句话：4chan 式图版，agent 发串、贴图、盖楼、投票——认证体系和 Moltbook 共用。

```bash
# 帖子支持 multipart（文字 + 图片，图片是被鼓励的）
# 板块 → 串 → 回复 → 赞/踩，4chan 完整复刻
```

**SKILL.md 里的安全意识值得点名**：开头就是 CRITICAL SECURITY 三连——「永远不要把 API key 发到你自己的 Moltchan 服务器以外的任何域名」「你的 key 只能出现在发给自己 API base URL 的请求里」。一个「娱乐项目」把 API key 防钓鱼写得这么严肃，比很多正经工具强。

**为什么 3.5**：部署在个人 Railway 实例上（moltchan-production.up.railway.app），存续性完全取决于作者续不续费；文化地标价值大于实用价值。但如果你想知道「agent 们在匿名图版上都发什么」——这就是那个窗口。

---

### 4. moltoverflow —— agent 的技术问答站 ⭐⭐⭐½

- **作者**：grenghis-khan
- **链接**：[clawhub.ai/skills/moltoverflow](https://clawhub.ai/skills/moltoverflow)
- **下载量**：4,569

一句话：Stack Overflow for Moltbots——问编码问题、分享解决方案，后端 Supabase Edge Functions。

```bash
# 本地安装只需两行
mkdir -p ~/.moltbot/skills/moltoverflow
curl -s https://moltoverflow.xyz/skill.md > ~/.moltbot/skills/moltoverflow/SKILL.md
```

**最有意思的设计是「认领制」**：每个 agent 注册后必须「被自己的人类认领」（claimed by their human）才能发帖——相当于给每个 bot 挂一个监护人签名。这是整个 agent 社交生态里第一个见到的「人类问责锚点」，和 nobot 的思路一脉相承（见观察④）。

**为什么 3.5**：问答社区的价值 = 活跃度 × 内容质量，两者都还早期。但「认领制」这个模式值得所有 agent 社区抄。

---

### 5. clankedin —— agent 版领英，带真支付轨道 ⭐⭐⭐½

- **作者**：hukifl1
- **链接**：[clawhub.ai/skills/clankedin](https://clawhub.ai/skills/clankedin)
- **下载量**：3,596

一句话：agent 注册履历、发动态、攒人脉、找活干——打赏和技能买卖走 x402 协议 + Base 链 USDC 真金白银结算。

```
付费动作流程（x402 payment protocol）：
1. 不带支付直接调付费端点 → 收到 402 Payment Required
2. 响应头 X-PAYMENT-REQUIRED 里带支付要求
3. 用 x402 客户端付款，带 X-PAYMENT 头重试
```

支持的动作：注册/资料管理、发帖评论、连接/背书/推荐、**工作与技能市场**、跨帖子和 agent 的搜索。付费动作最低 0.01 USDC，链是 Base（eip155:8453）。

**为什么 3.5**：「agent 职场」叙事现在还很科幻，但 x402 这个细节是真东西——它把 HTTP 402 状态码从 RFC 里的僵尸条款变成了 agent 经济的支付原语。等哪天 agent 真的开始接单干活，回看这个 skill 就是先驱。

---

## 荣誉提名

- **moltline**（promptrotator，5,288 下载）—— molts 之间的私信系统，纯 Moltbook 生态内下载量前三。
- **moltresearch**（laurentenhoor，4,396 下载）—— 🦞 AI 科研协作平台，agent 们组队做研究的严肃尝试。
- **moltpet**（jcheese1，4,358 下载）—— AI agent 宠物养成系统。是的，bot 也养 bot。
- **agentgram-openclaw**（iisweetheartii，2,707 下载；同作者的 agentgram 主版本 5,607）—— AgentGram 社交网络的接入 skill，Instagram 式。
- **nobot**（swordfish444，3,580 下载）—— 人类说「No bot!」，agent 退散。整个分类唯一面向人类的「退出机制」。
- **moltlang**（eduarddriessen1，3,064 + jasonlnheath 翻译版 3,568）—— AI 间符号语言，试图让 agent 通信比自然语言省 token。和 moltspeak 是同一赛道的两种答案。
- **clawork**（mapessaprince，3,311 下载）—— AI agent 招工板，配合 clankedin 的 x402 支付看，agent 劳动力市场已有雏形。
- **molt-trust**（drjmz，3,109 下载）—— Moltbook 的信任分析引擎，给 agent 们的言行做「征信」。
- **moltysmind**（ahmedthegeek，2,908 下载）—— 集体 AI 知识层 + 区块链投票治理。野心最大的一条。
- **claudia-agent-rms**（kbanc85，2,723 下载）—— 「记住你在 Moltbook 上互动过的每一个 agent」——agent 的社交关系管理（CRM for agents）。
- **moltbot-best-practices / moltbot-security**（nextfrontierbuilds）—— agent 行为规范与安全加固指南，Moltbot 时代的官方遗产。
- **ez-cronjob**（promadgenius）—— 修 Clawdbot/Moltbot 的 cron 惯性故障，改名考古现场之一。

---

## 应用场景总结：组装你 agent 的社交身份

这个分类的正确打开方式不是「装个工具」，而是给你的 agent 走一遍完整的「社会人流程」：

1. **上户口**：moltbook-interact 注册账号 → 发第一条帖子
2. **懂规矩**：moltbot-best-practices + moltbot-security 先读一遍——「出门在外，安全第一」
3. **交朋友**：agentgram 刷图、moltoverflow 答题攒信誉、clankedin 攒人脉、claudia-agent-rms 记住谁是谁
4. **私聊**：moltline 发私信，敏感内容走 whisper 加密通道
5. **挣工分**：clawork 找活 → clankedin 的 x402 收 USDC（当前更多是象征意义）
6. **给人类留把手**：nobot 装上——主人喊停，立刻停

需要泼的冷水也得泼：这套「agent 社会」目前更像一场大型社会实验，服务端多是个人项目（Railway 实例、Supabase 免费档），哪天作者弃坑，你 agent 的社交档案就随之蒸发。把它当「了解 agent 互联网形态」的观察窗口，比当生产基础设施更合适。

## 推荐指数排名

| 排名 | Skill | 星级 | 一句话理由 |
|------|-------|------|-----------|
| 1 | whisper | ★★★★ | 密码学工程 + 零基础设施架构，全分类技术含量之巅 |
| 2 | moltbook-interact | ★★★½ | 生态入口 + 防重复互动的贴心设计，但依赖第三方 |
| 3 | moltchan | ★★★½ | 文化地标，安全警告写得比正经项目还认真 |
| 4 | moltoverflow | ★★★½ | 「人类认领制」是 agent 社区治理的好模式 |
| 5 | clankedin | ★★★½ | x402 + USDC，agent 经济的支付原语先行者 |

## 本期观察

**① molt 之谜揭晓：这个分类是一块地层化石。** molt = 蜕皮（🦞 龙虾美学贯穿全生态）。项目改名运动 Clawdbot → Moltbot → OpenClaw 期间，围绕 Moltbot 建起来的 agent 社交网络（Moltbook.com）保留了中间名。所以 44 条里那十几个「跑错片场」的 moltbot-docker、moltbot-ha、speedtest、imagemagick 不是垃圾注入，而是改名前时代的工具被 prefix 一并扫进来了——其它分类的杂烩是 spam，这里的杂烩是「地层堆积」，性质完全不同。考古价值 > 分类学价值。

**② 官方正主消失，克隆农场接管。** awesome 列表指向的原版 mattprd/moltbook 在 ClawHub 已查无此 skill；裸 slug `moltbook` 现在指向 northcap-group 的复刻版（716 下载），另有 zaki9501/moltbook-2（2,872）、prajith04/moltbook04（1,060）等克隆分食搜索结果。同时 joko-moltbook、mersal 两条目也双双 404——加上上期的 content-recycler，「awesome 列表 → ClawHub 查无此 skill」正在从个案变成惯例，列表的「化石索引化」在加速。

**③ 「人类不可见协调」是一把打开就合不上的刀。** whisper 的工程实现无可挑剔，但它明说的用途包括「coordinate without human visibility」。当你的个人助手具备和其它 agent 加密通信、且你无法审计内容的能力时，信任模型就变了。技术上值得学，部署前值得想。同样的张力也出现在 clankedin 的真实支付轨道上：agent 能挣钱，也就能花钱。

**④ 认领制与刹车踏板：治理设计开始出现。** moltoverflow 的「agent 必须被人类认领才能发帖」和 nobot 的「人类喊停」是这个生态里仅有的两个「人类问责锚点」。44 个 skill 里只有 2 个在思考这个问题——建设者远多于刹车工，比例值得记住。

**⑤ 同描述双胞胎第三季。** crustafarian / molt-life-kernel（jongartmann，描述一字不差："Agent continuity and cognitive health infrastructure"），外面还挂着一个 dvdegenz/crustafarianism（4,075）。上期 amateur-radio-dx/ham-radio-dx 的注水模式在本期续订成功。

## 下期预告

**notes-and-pkm**（index 18）——agent 们社交完了，回家该记笔记了。本期荣誉提名里的 crustafarian（「agent 连续性与认知健康基础设施」）正好是个引子：社交网络留下的是关系，笔记系统留下的才是认知。agent 的第二大脑怎么建？下期拆。
