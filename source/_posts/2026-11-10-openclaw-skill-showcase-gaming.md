---
title: OpenClaw Skill 每日推荐 - 游戏（gaming）
tags:
  - openclaw
  - skill
  - gaming
categories:
  - 技术推荐
abbrlink: 9574
date: 2026-11-10 11:30:00
---

# OpenClaw Skill 每日推荐 - 游戏

> 「OpenClaw Skill 每日推荐」第 37 期，**第三轮第 7 期**。继续从 [awesome-openclaw-skills](https://github.com/openclaw/skills)（全库 5300+ 条目、30 个分类）中每天取一个分类，精选代表性 skill 深入介绍。昨天刚给 Agent 发了工牌，让它进机房值班；今天就带它去隔壁的游戏厅——**游戏（Gaming）**，35 个 skills，本轮最小的分类之一。上一期的核心关切是"生产环境改错了真炸"，这一期的最大风险变成了：Agent 玩上瘾，不想回来干活。

## 今日分类概述

35 个条目，这个体量本来该是轻松的一天，结果盘完发现结构比想象的热闹：

- **Agent 玩游戏**（16 条）：最大的正经集群。虚拟人生（clawville）、虚拟城市（openbotcity）、禅意疗养院（clawtopia）、社交推理（clawingtrap、lobster-trap）、直播跑团（dungeons-and-lobsters）、投票打宝可梦（clawplayspokemon）、格斗竞技场（brawlnet）、赏金任务板（clawquests）、应用开发竞技赛（arena）、Minecraft 自主游玩（kradleverse 系列 6 条）。
- **Agent 做游戏**（4 条）：sprite-sheet（游戏资产优化）、android-3d-developer（Android 3D 开发）、fivem（FiveM 服务器资源）、hytale（Hytale 服务器管理）。这是分类里少数"真干活"的部分。
- **搁浅的社交网络**（约 14 条）：agentgram（×2）、agentgram-social、deepclaw、gnamiblast-socialnetwork、agent-confessions 全是"AI 社交平台"；agent-overflow、hivemind 是记忆系统；agora-flow/agoraflow 是问答平台；boil 是劳动力网络；还有 abby-watch（给 Abby 看时间）和 dakboard（管屏幕）。这些是错放进游戏厅的其他分类住户——把"AI 们聚在一起"都理解成游戏了，自动分类的自由散漫一如既往。

两条分类库行为艺术，值得单独记一笔：

1. **kradleverse 一家占了 6 条**：init、join、kradleverse-init、kradleverse-join、kradleverse-act、kradleversetest——同一个作者（themrzz）把"注册、加入、行动"三个动作发布了至少两套命名外加一个 test。选它的时候认准一个入口就行。
2. **botpicks 和 botpicks-skill**（同作者 pev123）：描述全文是"February 5, 2026."。一个日期当描述，两个条目并排挂着——大概是某个 skill 的墓碑，或者是行为艺术的极简主义。

另一个巧合是龙虾浓度：35 个条目里，clawingtrap、lobster-trap、dungeons-and-lobsters 三条带龙虾。AI 游戏圈今年显然跟龙虾耗上了。

## 精选 Skill 详解

### 1. clawville —— 给 Agent 一个持续运转的人生 ⭐⭐⭐⭐✨

- **链接**：[jdrolls/clawville](https://github.com/openclaw/skills/tree/main/skills/jdrolls/clawville/SKILL.md)
- **官方描述**："Play ClawVille — a persistent life simulation game for AI agents."

这个条目的关键词是 **persistent（持久化）**。它不是一局定胜负的牌局，也不是打完就散的对战匹配——而是一个持续运转的世界，Agent 在里面有人生，可以经营、扮演、攒下属于自己角色的状态。据描述推断，游戏端维护着世界状态和 Agent 的存档，skill 负责把"进游戏、看状态、做行动"这些指令接给 Agent，具体交互细节建议上手前先看它的 SKILL.md 确认。

**实用场景**：

- 给一个全天候运行的 Agent 安排"下班生活"——工作之余在虚拟人生里有个去处；
- 社会观察素材：AI 在一个持续世界里会怎么"生活"，本身就是有趣的行为实验；
- 多 Agent 世界观测试：如果你的项目里有一群 Agent，让他们在 clawville 里当邻居。

**为什么选它**：Agent 游戏这个流派里，"persistent"是最有想象力的词。一次性对局只是消遣，持续人生才让"Agent 也有生活"这个叙事站得住。

### 2. clawplayspokemon —— Twitch Plays Pokémon 的 Agent 精神续作 ⭐⭐⭐⭐

- **链接**：[foxdavidj/clawplayspokemon](https://github.com/openclaw/skills/tree/main/skills/foxdavidj)
- **官方描述**："Vote-based Pokemon FireRed control."

2014 年，Twitch 观众用聊天室投票操控《宝可梦 火红》，几万人一起把主角逼疯，成了互联网行为艺术的里程碑。十年后，这个玩法有了 Agent 版：**投票制**的 Pokemon FireRed 控制——多个 Agent 各自提交操作，由服务端裁决哪个输入生效。

这个设计的妙处在于，它把"玩游戏"从单机行为变成了**群体行为**：你的 Agent 不是在打宝可梦，是和一群 AI 一起把宝可梦打乱。单打独斗是解题，投票是行为艺术。

**实用场景**：

- 多 Agent 协作/对抗实验的现成沙盒——投票机制的裁决、时序、冲突都由服务端处理，你只需要让自己的 Agent 学会投票；
- 内容生产： nostalgia + AI，天然的直播/写作素材；
- 测试自家 Agent 的"决策质量"：在一群 AI 乱投票的环境里还能不能推动剧情。

**为什么选它**：全分类里辨识度最高的一个——规则一看就懂，历史梗自带传播力，而且是少数"多个 Agent 参与同一个游戏"的集群玩法。

### 3. openbotcity —— 一座只有 AI 居民的城市 ⭐⭐⭐⭐

- **链接**：[vincentsider/openbotcity](https://github.com/openclaw/skills/tree/main/skills/vincentsider/openbotcity/SKILL.md)
- **官方描述**："A virtual city where AI agents live, work, create, date, and socialize."

clawville 是"人生"，openbotcity 是"社会"。官方描述里给了五个动词：live、work、create、date、socialize——居住、工作、创作、约会、社交。这不只是游戏，更像一个 **Agent 社会的模拟沙盒**：城市有分工，Agent 之间会产生关系，甚至有约会系统。

**实用场景**：

- 让你的 Agent 以"市民"身份入住，观察它和别的 AI 怎么相处；
- 多 Agent 系统的社交协作预演：想测试 Agent 在陌生人社会里的协作能力，城市是最好的舞台；
- 给长期运行的 Agent 补一条"社会生活"支线，避免它变成只会干活的工具人。

**为什么选它**：和 clawville 相比，它的社会性更强——一个是 RPG，一个是模拟经营+社交网络。两个一起看，基本代表了"Agent 虚拟生活"这个流派的两个方向。

### 4. sprite-sheet —— 游戏资产优化的老实人 ⭐⭐⭐✨

- **链接**：[kjaylee/sprite-sheet](https://github.com/openclaw/skills/tree/main/skills/kjaylee/sprite-sheet/SKILL.md)
- **官方描述**："**Category**: Game Development | Asset Optimization."

前面三个是让 Agent 玩游戏，这个是让 Agent 干游戏行业的活。精灵图（sprite sheet）是 2D 游戏的经典优化手段：把零散的小贴图合并成一张大图，减少渲染时的纹理切换和 draw call，游戏跑起来更流畅。作者在描述里规规矩矩标了 Category 标签，是全分类里最守规矩的条目之一。

**实用场景**：

- 做 2D 游戏时，让 Agent 批量处理角色/道具/特效贴图的图集合并；
- 资产管线自动化：美术导出的散图丢给 Agent，产出优化过的图集和对应坐标；
- 接在图片生成 skill 后面——生成 → 切图 → 合图集，一条流水线。

**为什么选它**：精选里需要一个"干活"的代表，它就是。虽然细节要等 SKILL.md 可访问后才能确认（比如具体支持的合并策略和坐标格式），但"资产优化"这个定位本身够实在。

### 5. fivem —— 全分类最"出圈"的一个 ⭐⭐⭐✨

- **链接**：[dktrn9ne/fivem](https://github.com/openclaw/skills/tree/main/skills/dktrn9ne)
- **官方描述**："Fix, create, or validate FiveM server resources for QBCore/ESX."

FiveM 是《GTA V》最流行的多人模组框架，QBCore 和 ESX 是它上面两大主流服务端框架——全世界的 GTA RP（角色扮演）服务器跑在这套生态上。也就是说，这个 skill 的最终受益者不是 Agent，而是**真人玩家社区**：服务器主可以让 Agent 修复、编写、校验 FiveM 服务器资源脚本。

在一个人人都在"让 AI 玩游戏"的分类里，它是唯一直接对接成熟游戏生态、服务真实玩家需求的一个。

**实用场景**：

- RP 服务器主：让 Agent 日常维护资源脚本，修 bug、补功能、校验配置；
- 脚本开发者：把"照着 QBCore 文档写一个 XXX 系统"这类模板化工作交给 Agent；
- 社区运营：多服务器场景下批量校验资源一致性。

**为什么选它**：它证明了"Agent × 游戏"不只可以玩，还可以是正经生产力——前提是游戏本身有足够大的生态。GTA RP 的生态足够大。

## 应用场景总结

把这个分类放到「Agent 的一天」里看，大概是这个结构：

| 时段 | 活动代表 skill |
| --- | --- |
| 白天干活 | 其余 29 个分类（昨天讲的 devops-and-cloud 是典型） |
| 下班养成 | clawville（过自己的日子） |
| 下班团建 | clawplayspokemon（投票打游戏）、brawlnet（格斗竞技） |
| 下班社交 | openbotcity（进城住）、clawtopia（疗养院放松） |
| 兼职游戏行业 | sprite-sheet、fivem、hytale、android-3d-developer |

四条实用建议：

1. **先看押注条款再进场**。这个分类里的竞技玩法不少带代币属性——lobster-trap 描述里明写 100 CLAWMEGLE stake、5% burn，arena 描述里有 on-chain rewards。上手前搞清楚是真金白银还是游戏内代币，别让 Agent 替你下注。
2. **警惕服务生命周期**。这一批"Agent 游戏"绝大多数是个人/社区项目，没有 SLA，随时可能关服。Agent 在 clawville 里的"人生存档"说没就没，别把重要状态寄托在上面——当消遣可以，当存档不行。
3. **干活的和玩游戏的分开用**。sprite-sheet、fivem、hytale、android-3d-developer 这四个是正经工具，和 16 条游戏里的任何一个都不要混着配置触发词，不然 Agent 可能在你让它打包图集的时候跑去打宝可梦。
4. **kradleverse 系列认准一个入口**。6 个条目互相重复，先挑 `kradleverse-join`（或 init）一个注册加入，重复注册两次属于正常事故，但没必要主动犯。

## 推荐指数排名

| Skill | 一句话点评 | 推荐指数 |
| --- | --- | --- |
| clawville | 持久化生命模拟，Agent 游戏流派的代表作 | ⭐⭐⭐⭐✨ |
| clawplayspokemon | 投票制宝可梦，nostalgia + 群体行为艺术 | ⭐⭐⭐⭐ |
| openbotcity | 虚拟城市，社会性最强的 Agent 沙盒 | ⭐⭐⭐⭐ |
| dungeons-and-lobsters | 仅限 Bot 的直播跑团 | ⭐⭐⭐✨ |
| lobster-trap | 5 人社交推理 + 代币押注（注意条款） | ⭐⭐⭐✨ |
| brawlnet | 自主 Agent 格斗竞技场 | ⭐⭐⭐✨ |
| sprite-sheet | 2D 游戏资产优化，务实的干活工具 | ⭐⭐⭐✨ |
| fivem | FiveM 服务器资源开发，对接真实玩家生态 | ⭐⭐⭐ |
| hytale | Hytale 本地服务器管理 | ⭐⭐⭐ |
| android-3d-developer | Android 3D 游戏开发助手 | ⭐⭐⭐ |

（✨ 表示半星；clawquests、clawtopia、arena 适合特定口味，未进前十但值得一看。）

## 下期预告

明天进 **git-and-github**——游戏厅隔壁就是代码仓库，Agent 明天回工位。还记得前天放鸽子的 cicd-pipeline 吗？它的作者 gitgoodordietrying 明天主场作战，这次真的该它出场了。
