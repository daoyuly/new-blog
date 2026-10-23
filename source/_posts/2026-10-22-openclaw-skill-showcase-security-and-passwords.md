---
title: OpenClaw Skill 每日推荐 - 安全与密码（security-and-passwords）
tags:
  - openclaw
  - skill
  - security-and-passwords
categories:
  - 技术推荐
abbrlink: 58952
date: 2026-10-22 11:30:00
---

# OpenClaw Skill 每日推荐：安全与密码

> 「OpenClaw Skill 每日推荐」第 23 期。每天从 awesome-openclaw-skills 的 30 个分类中挑一个，带你认识社区里最值得装的 skill。今天轮到**安全与密码（security-and-passwords）**——54 个 skills，体量不大，但可能是对 OpenClaw 用户最要命的一个分类：你的 agent 有 shell、有网络、有你的密钥，它缺的不是能力，是门禁。

## 一、今日分类概览

54 个 skills，真正围绕"安全"展开的大概分五块：

| 子方向 | 代表能力 |
|---|---|
| 密码管理器集成 | 1password、bitwarden / bitwarden-vault、dashlane |
| Agent 平台安全 | clawdstrike（网关威胁建模）、1claw（HSM 保险库）、credential-manager、mfa-word（口令挑战）、hopeids（入侵检测 + 隔离） |
| 链接与内容风控 | domain-trust-check（钓鱼/诈骗预检）、outtake-bounty-network（恶意域名悬赏）、glin-profanity（内容审核） |
| 密钥与加密 | ggshield-scanner（500+ 种硬编码密钥检测）、safe-encryption-skill（后量子加密）、cifer-sdk（抗量子）、expanso-tls-inspect（证书检查） |
| 传输与共享 | vnsh（加密限时链接）、saysigned（电子签名） |

两句实话：

1. **这是全仓库"错分类"重灾区。** starwars（星战资料查询）、harrypotter、breweries（精酿啤酒厂）、countries（国家信息查询）、google-tasks、dotnet-expert、liewatch（AI 狼人杀）……这些和安全半毛钱关系没有，大概是被提交者塞进来的。54 个里能叫"安全 skill"的约莫 30 个上下。
2. **但安全类的头部质量反而高。** 因为这个分类直面的是真问题——"你敢让一个能执行任意 shell 命令的 agent 摸你的密码库吗"。头部 skill 给出的答案相当成熟。

## 二、精选 Skill 详解

### 1. 1password —— 给 agent 发一张"只读门禁卡" ⭐⭐⭐⭐⭐

**链接：** [SKILL.md](https://github.com/openclaw/skills/tree/main/skills/steipete/1password/SKILL.md)

**核心功能：** 配置并使用 1Password CLI（`op`），让 agent 安全地读取和管理密码库。

**为什么它是五星：** 它解决的是 agent 安全里最经典的两难——**agent 干活需要密钥，但密钥进了聊天记录和配置文件就是事故**。1Password CLI 的玩法是"引用而非复制"：agent 拿到的是 `op://` 格式的 secret reference，用的时候才通过 `op read` 解锁取值；`op run` 更进一步，启动子进程时把 secret 注入环境变量，全程不落盘、不进历史。等于你给 agent 发了张门禁卡，它能开门，但带不走钥匙。顺带一提，作者 steipete 正是 OpenClaw 的作者本人，这个 skill 大概是"官方使用姿势"的最好参考。

**实用场景：**
- 部署时：「把生产数据库的连接串取出来跑迁移」——`op read` 按需取用
- 长期跑的服务：`op run` 包一层，agent 进程里永远只有引用，没有明文
- 密钥轮换：让 agent 批量检查哪些条目超过 90 天没换

**实现机制：** 薄封装层。skill 本身不碰密码学，全部信任 1Password CLI 的安全模型（本地解锁、生物识别、服务账号授权）。这也正是正确的设计——安全 skill 最大的忌讳就是自己重新发明加密。

### 2. bitwarden —— 开源党的密码库方案 ⭐⭐⭐⭐

**链接：** [SKILL.md](https://github.com/openclaw/skills/tree/main/skills/asleep123/bitwarden/SKILL.md)

**核心功能：** 安全地访问和管理 Bitwarden / Vaultwarden 密码库。同分类里的 bitwarden-vault 是姊妹篇，专注 CLI 的初始配置与认证。

**为什么值得四星：** 定位和 1password skill 类似，但路线完全不同——**全开源 + 可自托管**。Vaultwarden 是 Bitwarden 协议的轻量开源实现，一台吃灰树莓派就能跑起全套密码服务，数据不出家门。对"我的密码凭什么放别人云上"党来说，这是唯一解。扣一星的原因也直白：自托管意味着可用性自己扛——备份、升级、证书，哪样不管都会在某个深夜找上门。

**实用场景：**
- 家庭/小团队自托管密码库，agent 通过 `bw` CLI 代查代填
- 隐私敏感场景：密码库数据 + agent 都留在内网，出不了门
- 预算党：Vaultwarden 免费且条目不限，比商业方案省下的钱够买好几块硬盘

**实现机制：** 对接 Bitwarden 官方 CLI（`bw`），unlock 后拿 session key 调用，skill 负责把"unlock → 取值 → 会话即焚"的流程讲清楚给 agent 听。和 1password 一样是薄封装，安全模型外包给专业选手。

### 3. domain-trust-check —— agent 是"最先点开链接的人" ⭐⭐⭐⭐

**链接：** [SKILL.md](https://github.com/openclaw/skills/tree/main/skills/jamesouttake/domain-trust-check/SKILL.md)

**核心功能：** 在访问任何 URL 之前检查钓鱼、恶意软件、品牌滥用与诈骗风险，背后是 Outtake Trust API。

**为什么值得四星：** 这个 skill 的视角很妙：传统安全是"人别乱点链接"，而在 agent 时代**链接是 agent 替你点的**——你让它处理一封"快递异常"的邮件，它顺手就会访问里面的链接。钓鱼防御的检查点必须前移到 agent 的浏览器动作之前，domain-trust-check 就是这道前置门：URL 进来先查信誉，红的拒开。配套的 outtake-bounty-network 更是玩出了花——发现并提交验证过的恶意域名，一个 5 USDC，让 agent 自己去抓坏人挣赏金。

**实用场景：**
- 邮件/消息代理：agent 帮你处理收件箱，链接先过安检再打开
- 网页抓取任务：批量抓取陌生站点前先过滤已知恶意域名
- 给长辈配的 agent：防诈骗场景里最实用的一道闸

**实现机制：** 查询型 skill，调用第三方信誉 API（Outtake Trust），agent 无需自己维护黑名单。依赖单一服务商是双刃剑：接口挂了它就瞎了。但对个人用户来说，比裸奔强出一个数量级。

### 4. ggshield-scanner —— 别让 agent 把密钥写进代码 ⭐⭐⭐⭐

**链接：** [SKILL.md](https://github.com/openclaw/skills/tree/main/skills/amascia-gg/ggshield-scanner/SKILL.md)

**核心功能：** 检测 500+ 种硬编码密钥（hardcoded secrets），来自 GitGuardian 的 ggshield 工具链。

**为什么值得四星：** agent 写代码的量级是人的十倍，出错的量级也是——把测试密钥复制进生产代码、调试时把 `.env` 内容打进日志、依赖的示例配置里躺着别人的真实 key，这类事故在 AI 辅助编码时代只会更常见。ggshield 扫描 500 多种密钥格式（AWS、Stripe、OpenAI、数据库连接串……），把它挂进 agent 的"写完代码"流程，等于给每一次提交加一道自动安检。

**实用场景：**
- agent 完成编码任务后自动扫一遍 diff，有密钥就报
- 接手老项目：先扫一遍历史，看前人埋了多少雷
- CI 前置检查，配合密钥轮换流程做"发现即轮换"

**实现机制：** 封装 GitGuardian 开源的 ggshield CLI：本地做格式匹配 + 熵分析 + 已知密钥特征校验，可选对接 GitGuardian 云端做实时有效性检测（密钥是否已被吊销）。

### 5. clawdstrike —— 给 OpenClaw 宿主机做威胁建模 ⭐⭐⭐

**链接：** [SKILL.md](https://github.com/openclaw/skills/tree/main/skills/misirov/clawdstrike/SKILL.md)

**核心功能：** 对 OpenClaw gateway 宿主机做安全审计和威胁模型分析。

**为什么值得三星：** 这是分类里少有的"OpenClaw 原生"安全 skill——它审的对象就是你的 agent 网关本身：暴露了哪些端口、哪些工具对外可用、exec 权限边界在哪、有没有把 gateway 裸奔在公网。这类"平台自检"目前生态里还很少，方向对，值得鼓励。扣两星的原因也直白：描述信息有限，成熟度和检查深度未知，而且同时存在 clawdstrike 与 clawdstrike-test 两个几乎同名的仓库，工程规范存疑。装之前值得先看 SKILL.md 到底查什么。

**实用场景：**
- 第一次把 OpenClaw 部署到 VPS 后，做一次全面体检
- 定期复审：随着 skill 越装越多，工具面和暴露面只增不减
- 心理建设：知道自己的威胁模型长什么样，睡得更香

**实现机制：** 从描述看是"检查清单 + 审计流程"型 skill：按威胁建模思路逐项检查 gateway 配置、端口暴露、凭据存放。这类 skill 的价值不在技术多深，而在"逼你把安全配置过一遍脑"。

**同场加映：** mfa-word（执行敏感操作前先问你一个秘密口令，最朴素的人机确认）、vnsh（加密 + 限时过期的文件分享链接）、safe-encryption-skill（SAFE CLI，带后量子加密的现代 GPG 替代品）、hopeids（基于推理的入侵检测 + 隔离）、1claw（HSM 硬件背书的 agent 密钥保险库）——这个分类的纵深比想象中厚。

## 三、应用场景总结

把精选的几个串起来，可以搭出一套 **agent 的分层门禁体系**：

```
密钥存放 ──→ 1password / bitwarden（引用取用，明文不落地）
    │
密钥防漏 ──→ ggshield-scanner（代码与提交里不留硬编码 secrets）
    │
对外访问 ──→ domain-trust-check（链接先查信誉，钓鱼挡在点击之前）
    │
敏感操作 ──→ mfa-word（破坏性动作前要口令，人在环中）
    │
宿主机 ────→ clawdstrike（gateway 威胁建模与暴露面审计）
```

这个分类里有一个清晰的产品共识：**信任外包 + 最小暴露**。没有一家试图自己发明加密——全部信任专业选手（1Password CLI、Bitwarden CLI、GitGuardian 引擎、Outtake 信誉库），skill 层只做一件事：把这些专业能力接进 agent 的动作流，并在"能做"和"该做"之间加一道闸。

实用原则一句话：**先管住密钥，再管住链接，最后管住宿主机。** agent 安全事故的三大件——密钥泄漏、钓鱼中招、暴露面失守——对应的正是这三层。

## 四、推荐指数排名

| 排名 | Skill | 一句话点评 | 推荐指数 |
|---|---|---|---|
| 1 | [1password](https://github.com/openclaw/skills/tree/main/skills/steipete/1password/SKILL.md) | secret reference + op run，agent 拿密钥不留明文 | ⭐⭐⭐⭐⭐ |
| 2 | [bitwarden](https://github.com/openclaw/skills/tree/main/skills/asleep123/bitwarden/SKILL.md) | 开源自托管党唯一解，Vaultwarden 树莓派能跑 | ⭐⭐⭐⭐ |
| 3 | [ggshield-scanner](https://github.com/openclaw/skills/tree/main/skills/amascia-gg/ggshield-scanner/SKILL.md) | 500+ 种密钥检测，AI 写代码时代的自动安检 | ⭐⭐⭐⭐ |
| 4 | [domain-trust-check](https://github.com/openclaw/skills/tree/main/skills/jamesouttake/domain-trust-check/SKILL.md) | 钓鱼防御前移到"点击之前" | ⭐⭐⭐⭐ |
| 5 | [clawdstrike](https://github.com/openclaw/skills/tree/main/skills/misirov/clawdstrike/SKILL.md) | OpenClaw 网关威胁建模，方向对但还早期 | ⭐⭐⭐ |

## 五、实用建议

1. **先挂密码管理器，再让 agent 干别的。** 这是优先级最高的一件事：只要 agent 还在用明文配置文件存 API key，其他所有安全措施都是装饰。1password 或 bitwarden 二选一，半小时配完，长期受益。
2. **给"写完代码"加一道扫描仪式。** 在工作流里固定一条：agent 交付代码后必过 ggshield。AI 生成代码里混入密钥的渠道很多，事后扫描是成本最低的兜底。
3. **安全 skill 本身更要审。** 这个分类的特殊性在于：安全 skill 要的权限恰恰最敏感（读密码库、拦链接）。装任何一个之前，务必打开 SKILL.md 看它要什么、数据发到哪——比如 domain-trust-check 会把 URL 发给第三方 API，这件事你至少得知情。
4. **mfa-word 这种"土办法"反而值得装。** 复杂的安全体系可能被 agent 绕晕，但"执行删库/转账/发邮件之前先问我要口令"这种朴素设计，鲁棒性惊人。高危动作前置一个人类确认，成本极低，救命概率极高。
5. **噪音多的分类更要睁眼。** 今天 54 个里近一半和安全无关（星战、啤酒厂、狼人杀……）。教训是通用的：awesome list 是入口不是权威，装 skill 前看源仓库、更新时间和权限要求，三件齐查。

---

*本文是「OpenClaw Skill 每日推荐」系列第 23 篇，数据来自 awesome-openclaw-skills 仓库，星级为个人主观评价。明天第 24 期：自托管与自动化（self-hosted-and-automation）。*
