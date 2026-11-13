---
title: OpenClaw Skill 每日推荐 - 健康与健身（health-and-fitness）
tags:
  - openclaw
  - skill
  - health-and-fitness
categories:
  - 技术推荐
abbrlink: 9582
date: 2026-11-13 11:30:00
---

# OpenClaw Skill 每日推荐 - 健康与健身（health-and-fitness）

> 「OpenClaw Skill 每日推荐」第 39 期，**第三轮第 9 期**。继续从 [awesome-openclaw-skills](https://github.com/openclaw/skills)（全库 5300+ 条目、30 个分类）中每天取一个分类，精选代表性 skill 深入介绍。昨天说好的：git 管你收工，今天管你几点睡。兑现了——Agent 的管辖范围从版本库正式扩张到你的睡眠、心率、蛋白质摄入和夜奶记录。顺便说一句，它现在比你更清楚你上个月的静息心率趋势。

老规矩，本期精选条目的机制描述、依赖要求和版本历史均逐个核对过 clawskills.sh 详情页原文，附安装命令和链接，出处一手。

## 今日分类概述

**健康与健身（health-and-fitness）**，84 个 skills，全库中等体量（排不进前十，前十名是 coding-agents 1200 / web 925 / devops 392 那一串）。盘完的结构是**四成正经、六成串场**——和上一期的 Git 分类（六成正经四成串场）正好倒了个个儿。

**正经集群**（约 33 条）最大的亮点是**可穿戴生态出奇地全**，从出生到生物年龄全生命周期覆盖：

- **手表/手环党**：Garmin 三件套（garmer、garmin-cli、garmin-health-analysis）、Fitbit 双件套（fitbit、fitbit-analytics）、Oura（oura-analytics）、Gevety（生物标志物与健康寿命评分）、health-sync（六平台聚合）
- **训练党**：hevy（力量训练日志）、intervals-icu（耐力训练数据）、endurance-coach（训练计划生成）
- **睡眠党**：soft-pillow（睡眠+梦境记录）
- **婴儿党**：huckleberry（新生儿喂养/睡眠/尿布追踪）
- **饮食党**：calorie-counter、diet-tracker、health-summary、opencal、recipe-finder、mealie-api、cookidoo、feast、bring-recipes——从找菜谱到记卡路里一条龙
- **极简党**：jhillin8 的零设备三部曲（fasting-tracker、muscle-gain、detox-counter）

**串场住户**（50+ 条）的主力是 crypto 军团和"挂 health 之名行他事"的系统工具，下面行为艺术部分细说。此外还有德国财税二人组（norman-tax-report 管报税、norman-overdue-reminders 管催款）、希腊社保（efka-api-integration）、Groupon 折扣、Twitter 发帖……自动分类器大概是看见"fit"（benefit？fitness？）就往这扔。

**行为艺术三则**：

1. **swairshah 五连发**：crypto-hackathon、hackathon、sample-skill、usdc、usdc-hackathon——五条 skill，描述一字不差，全是"Use when participating in the USDC Hackathon, submitting projects, or voting. 3 tracks: SmartContract, Skill"。上期 ghggh/ghgghg 双胞胎已是行为艺术，这期直接五胞胎。健身房的储物柜都被同一个赞助商承包了。
2. **"health"的三重含义**：health-guardian（cgtreadw）、ct-health-guardian 和 egvert-health-guardian（都来自 ctsolutionsdev）这组三胞胎，描述如出一辙——"Proactive health monitoring for AI [agents]"——注意，监控对象是 **AI agent 自己**，不是你。再加上 system-health-check（检查文件、权限、备份）和 ub2-api-health-checker（检查 API 端点），本分类里"健康"最大的产出对象根本不是人类：你的 Agent 体检的项目，比你的体检项目多。
3. **克隆浓度全库领先**：三对双胞胎（openfunderse-participant/strategy、free-jobboard-api/humaboam-final、hackathon-manager×2——ntombisol 和 tonbistudio 各发一个描述一模一样的），加上一组三胞胎、一组五连发。选装时认准一个即可。

## 精选 Skill 详解

### 1. health-sync —— 六平台数据，一张 SQLite ⭐⭐⭐⭐⭐

- **链接**：[filipe-m-almeida/health-sync](https://github.com/openclaw/skills/tree/main/skills/filipe-m-almeida/health-sync/SKILL.md)
- **安装**：`openclaw skills install @filipe-m-almeida/health-sync`
- **详情页**：[clawskills.sh/skills/filipe-m-almeida-health-sync](https://clawskills.sh/skills/filipe-m-almeida-health-sync)

本分类的集大成者。把 **Oura、Withings、Hevy、Strava、WHOOP、Eight Sleep** 六个平台的数据统一拉进一个 SQLite 数据库，通过单一 CLI 查询，让 Agent 能在一个对话里做跨源关联分析——回答"上周的睡眠怎么影响了我的训练表现"这种问题，不用再开五个 App 对着抄。

一手资料里的工程细节值得说：v0.3.5（2026-02-20）修复了跨 provider 的 fsck 一致性行为和 Hevy 的 delta watermark 解析，diff 里能看到 per-provider 架构（`src/providers/hevy.js`、`strava.js`、`whoop.js`）加上 667 行新增、覆盖同步状态、provider watermark、stale-row 处理的回归测试。这不是玩具，是当基础设施在养的。

**实用场景**：

- Oura 睡眠分 vs WHOOP 恢复分，谁更懂你，拉个表就知道；
- 出差一周恢复分暴跌，Eight Sleep 的床垫数据替你作证；
- 赛前想看 Strava 训练负荷 + Hevy 力量训练的合并视图。

**依赖门槛**：六家账号都要有（Oura 需 API access），这是全库依赖最贵的 skill 之一——但反过来，配齐的人得到的是别处买不到的聚合视图。

### 2. garmin-cli —— Garmin 没有官方 API，所以它就是 API ⭐⭐⭐⭐

- **链接**：[voydz/garmin-cli](https://github.com/openclaw/skills/tree/main/skills/voydz/garmin-cli/SKILL.md)
- **安装**：`openclaw skills install @voydz/garmin-cli`（二进制本体：`brew tap voydz/homebrew-tap && brew install garmin-cli`）
- **详情页**：[clawskills.sh/skills/voydz-garmin-cli](https://clawskills.sh/skills/voydz-garmin-cli)

详情页原话说得很直接：Garmin Connect 没有官方公共 API，这个 CLI 是**不开浏览器就能脚本化访问 Garmin 数据的唯一途径**。`gc` 命令覆盖活动、日常健康指标、睡眠、压力、身体电量（body battery）、锻炼、设备列表，以及 raw API 端点直通，支持 JSON 输出。v1.0.5（2026-03-03）补充了 summary 查询的文档和 `vo2max` 的取值逻辑说明。

```
gc today steps          # 脚本里查今日步数
gc sleep --last 7 --json  # 上周睡眠数据导出 JSON
gc activity download --gpx  # 把最近一次跑步下成 GPX 做路线分析
```

**实用场景**：训练前查 HRV 和训练准备度；把上周睡眠导出交给 Agent 画趋势；用脚本创建并上传结构化训练课表。

顺带交代 Garmin 三兄弟的分工：garmer（garrza）偏数据提取，garmin-health-analysis（eversonl）做自然语言问答，garmin-cli 是脚本化底座。三选一的话，要自动化就选它。

### 3. huckleberry —— 夜奶两点钟，单手敲命令 ⭐⭐⭐⭐

- **链接**：[jayhickey/huckleberry](https://github.com/openclaw/skills/tree/main/skills/jayhickey/huckleberry/SKILL.md)
- **安装**：`openclaw skills install @jayhickey/huckleberry`
- **详情页**：[clawskills.sh/skills/jayhickey-huckleberry](https://clawskills.sh/skills/jayhickey-huckleberry)

Huckleberry（新手爸妈人手一个的婴儿追踪 App）的非官方 CLI。记录睡眠、喂养、尿布、身高体重，全部走终端。v1.0.1（2026-01-19）修了 `--json` 参数位置、删掉了不存在的子命令、要求 Python 3.11+——changelog 很朴素，但"凌晨三点抱着孩子单手记录 120ml 奶瓶"这个场景，用过 App 的人都知道解锁手机再点五层菜单有多折磨。凭 `HUCKLEBERRY_EMAIL` / `HUCKLEBERRY_PASSWORD` 环境变量登录。

**实用场景**：夜奶记录不解锁手机；儿科量完身高体重，回家一敲入库；脚本定时检查"上次喂奶是几点"。

**一句提醒**：非官方工具、账号密码走环境变量，婴儿数据又是全家最敏感的数据之一——装之前想清楚你信任谁的管道。

### 4. jhillin8 零设备三部曲 —— 不买手表的极简派 ⭐⭐⭐

- **链接**：[jhillin8/fasting-tracker](https://github.com/openclaw/skills/tree/main/skills/jhillin8/fasting-tracker/SKILL.md)（另有 [muscle-gain](https://github.com/openclaw/skills/tree/main/skills/jhillin8/muscle-gain/SKILL.md)、[detox-counter](https://github.com/openclaw/skills/tree/main/skills/jhillin8/detox-counter/SKILL.md)）
- **安装**：`openclaw skills install @jhillin8/fasting-tracker`
- **详情页**：[clawskills.sh/skills/jhillin8-fasting-tracker](https://clawskills.sh/skills/jhillin8-fasting-tracker)

同一作者的三个本地追踪器：fasting-tracker 管轻断食，muscle-gain 管增肌（重量渐进+蛋白质），detox-counter 管戒断（带症状日志）。数据全部留在本机，零账号零设备。

以 fasting-tracker 为代表说两句：除了记录断食窗口和历史，它内置**代谢里程碑倒计时**——距离生酮开始、脂肪适应、自噬（autophagy）还有多久，实时算给你看。16:8 到 24h+ 的进阶玩家会觉得这个倒计时比 App 里的干巴巴计时器有参与感。

**为什么只给三星**：功能单刀直入、隐私满分，但和可穿戴生态完全隔离，也没有趋势分析。适合"我就想知道现在断到第几个小时了"的用户。

### 5. endurance-coach —— 教练的记忆放在 Athlete_Context.md ⭐⭐⭐⭐

- **链接**：[shiv19/endurance-coach](https://github.com/openclaw/skills/tree/main/skills/shiv19/endurance-coach/SKILL.md)
- **安装**：`openclaw skills install @shiv19/endurance-coach`
- **详情页**：[clawskills.sh/skills/shiv19-endurance-coach](https://clawskills.sh/skills/shiv19-endurance-coach)

给铁人三项、马拉松、超马/超耐力赛事生成个性化训练计划：分期化（periodized phases）、分项目训练内容、心率/功率区间、比赛日配速与补给策略。可以从 Strava 拉训练历史（可选），也可以手动喂数据。

真正值得学的是 v1.4.0（2026-02-13）的架构决策：**Athlete_Context.md 上下文优先**——每次任何流程的第一步都是检查这份运动员上下文文档，按决策树决定复用还是补采，训练后访谈（详情页称"Reflection as Data"）的产出也回写进去。一句话：它把"教练对运动员的记忆"做成了持久化文件，跨会话不丢、按 token 效率优化。这个模式对任何长期陪伴型 skill 都是模板级参考。

### 6. feed-diet —— 本分类名的正确打开方式 ⭐⭐⭐⭐

- **链接**：[tkuehnl/feed-diet](https://github.com/openclaw/skills/tree/main/skills/tkuehnl/feed-diet/SKILL.md)
- **安装**：`openclaw skills install @tkuehnl/feed-diet`
- **详情页**：[clawskills.sh/skills/tkuehnl-feed-diet](https://clawskills.sh/skills/tkuehnl-feed-diet)

一个词双关玩明白了：**diet 审计的不是你的饮食，是你的信息饮食**。把 Hacker News 浏览历史和 OPML 订阅源拉出来做审计，产出 Markdown 报告——分类占比、多样性得分、ASCII 图表、阅读建议，还有按你自定义目标过滤的 digest 模式（比如"只给我看编译器和分布式系统相关"）。分类由 LLM 驱动（配 `ANTHROPIC_API_KEY` 或 `OPENAI_API_KEY` 效果更好），没配则回退到关键词匹配。v0.2.1（2026-02-21）完成了 Anvil AI 品牌重塑。

**实用场景**：发现你的 HN 阅读八成是吃瓜新闻而不是技术内容；每周生成一份目标过滤后的阅读清单；审计 RSS 订阅看哪些主题挤占了你的注意力预算。

**为什么选它**：它大概是这个分类里唯一同时满足"名字贴切"和"脑洞清奇"的条目——信息摄入确实该像卡路里一样被管理。

## 应用场景总结

按人群对号入座：

- **多设备重度玩家**（Oura+WHOOP+Strava 全配齐）：health-sync 是唯一解，聚合视图别处买不到；
- **Garmin 用户**：garmin-cli 做自动化底座，配 Agent 做日报；
- **新手爸妈**：huckleberry 把记录成本降到一条命令；
- **断食/增肌/戒断**：jhillin8 三部曲，零设备纯本地；
- **备赛耐力运动员**：endurance-coach，顺便学它的上下文管理思路；
- **信息焦虑患者**：feed-diet，先审计再节食；
- **Agent 本身**：health-guardian 三胞胎管的是它的健康，不是你的——搞清楚监控对象再装。

一个横向观察：本分类的"正经"部分本质上是**三类代理**——数据代理（garmin-cli、fitbit、health-sync 替你去各家 API 取数）、记忆代理（endurance-coach 的 Athlete_Context.md、fasting-tracker 的历史）、纪律代理（detox-counter、feed-diet 替你保持克制）。和上期 Git 分类"管你收工"一脉相承：Agent 正在从工具变成监护人，只是这次监护的是你自己。

## 推荐指数排名

| 排名 | Skill | 推荐指数 | 一句话 |
|---|---|---|---|
| 1 | health-sync | ⭐⭐⭐⭐⭐ | 六平台聚合，工程认真，可穿戴党毕业装备 |
| 2 | garmin-cli | ⭐⭐⭐⭐ | Garmin 脚本化的唯一通道 |
| 3 | huckleberry | ⭐⭐⭐⭐ | 夜奶场景真痛点，注意账号安全 |
| 4 | endurance-coach | ⭐⭐⭐⭐ | 训练计划+上下文管理双料教材 |
| 5 | feed-diet | ⭐⭐⭐⭐ | 信息饮食审计，本分类最贴题的清流 |
| 6 | fasting-tracker 三部曲 | ⭐⭐⭐ | 零设备极简派，功能单刀直入 |

---

*系列连载中。明天第 40 期：管完你几点睡，Agent 决定管你画什么——**图像与视频生成（image-and-video-generation）**，169 个 skills，全库体量第九的大分类，从文生图到视频流水线。敬请期待。*
