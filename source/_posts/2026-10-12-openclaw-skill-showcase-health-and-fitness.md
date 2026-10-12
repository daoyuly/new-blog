---
title: OpenClaw Skill 每日推荐 - 健康与健身（Health & Fitness）
date: 2026-10-12 11:30:00
tags:
  - openclaw
  - skill
  - health-and-fitness
categories:
  - 技术推荐
---

> 「OpenClaw Skill 每日推荐」第 13 期。这个系列每天从 [awesome-openclaw-skills](https://clawskills.sh/) 的 30 个分类中取一个，精选几个值得装的 skill 做详细介绍。今天轮到 **健康与健身（health-and-fitness）** 分类——前两轮已经介绍过 Health Sync、Fitbit、Oura Analytics 这批"老面孔"，这一期换个角度，专挑前两期没讲过的新秀。

## 今日分类概述

**Health & Fitness** 分类收录了 **84 个 skills**。这个分类很有意思，它是整个目录里"名不副实"最严重的一个——真正做健康的 skill 大约占一半，剩下的混进了不少加密货币 hackathon、税务报告、职位看板之类完全不相关的内容（社区自荐分类的通病，筛选时务必留意）。

刨掉杂质后，真正健康向的 skill 大致分五条线：

- ⌚ **可穿戴设备集成**：Garmin、Fitbit、Oura、WHOOP、Withings、Eight Sleep、Hevy——生态位基本被占满
- 🍽️ **饮食与体重管理**：卡路里追踪、断食记录、营养计算
- 🏃 **训练指导**：从马拉松到力量训练的 AI 教练
- 📈 **训练数据分析**：面向严肃训练者的功率、心率变异性分析
- 👶 **家庭健康**：婴儿作息追踪、药品库存查询

从 ClawHub 的下载数据看，这个分类的头部集中度很高：Garmin Health Analysis 一骑绝尘（6,200+ 下载），断食追踪和力量训练这两个细分也都有 3,000+ 的爆款。

我从没介绍过的 skill 里挑了 5 个，正好覆盖"练、吃、睡"三条主线。

---

## 精选 Skill 详解

### 1. Garmin Health Analysis —— 佳明用户的自然语言数据入口 ⭐⭐⭐⭐⭐

| 项目 | 详情 |
|------|------|
| **ClawHub** | [eversonl/garmin-health-analysis](https://clawhub.ai/eversonl/skills/garmin-health-analysis) |
| **下载量** | 6,235（分类第一） |
| **推荐指数** | ⭐⭐⭐⭐⭐ |

**核心功能：**

前两期介绍过 Fitbit 和 Oura，唯独没讲 Garmin——而它恰恰是可穿戴阵营里用户基数最大的一支。这个 skill 是分类的下载量冠军，核心卖点一句话：**用自然语言直接问你的佳明数据**。

- 覆盖 **20+ 项指标**：睡眠阶段、Body Battery、HRV、VO2 max、训练准备度、身体成分、血氧
- 运动细节可下钻：查询任意时间点的心率、海拔、配速
- 支持 **FIT/GPX 原始文件下载**，可以拿去做路线分析
- 能生成交互式健康仪表盘

**实用场景举例：**

```
用户：我上次单板滑雪最快滑到多少？
AI：2026-02-14 北大湖，最大速度 61.3 km/h，
    当日滑雪 4 小时 12 分，下降垂直累计 5,840m。

用户：那段时间的 Body Battery 怎么样？
AI：滑雪当周你的 Body Battery 日均峰值 78，
    比之前四周低 9%，HRV 均值 41ms——
    高强度户外周之后恢复偏慢，建议本周控制训练强度。
```

**技术实现：**
- 走 Garmin Connect 的第三方 API（非官方），典型的 Python 库封装
- 数据落在本地再交给 Agent 分析，查询不依赖云端
- FIT/GPX 二进制解析是这个 skill 区别于同类的地方——大部分竞品只给汇总数字

**适合人群：** Garmin 手表用户。如果你前两期看完装了 Health Sync，这个可以作为 Garmin 数据源的深度补充。

---

### 2. Hevy —— 健身房力量训练的数据桥梁 ⭐⭐⭐⭐

| 项目 | 详情 |
|------|------|
| **ClawHub** | [mjrussell/hevy](https://clawhub.ai/mjrussell/skills/hevy) |
| **下载量** | 3,564 |
| **推荐指数** | ⭐⭐⭐⭐ |

**核心功能：**

Hevy 是欧美健身圈很流行的力量训练记录 App，这个 skill 把它接进了 Agent：

- 查询训练历史：动作、组数、重量、次数
- 读取和修改训练计划（routines）
- 查看动作模板和训练文件夹
- 追踪一段时间内的渐进超负荷进度

**实用场景举例：**

```
用户：我这三个月深蹲进步怎么样？
AI：近 90 天深蹲共 22 次：
    5×5 最好成绩从 92.5kg 提升到 105kg（+13.5%），
    最近两周因出差频率下降（周均 1.5 次 → 0.5 次），
    建议本周先恢复到 90% 强度再递增。
```

**技术实现：**
- 基于 Hevy 官方 REST API，OAuth 认证
- 作者 mjrussell 就是第 3 期介绍过的 Fitbit skill 的同一人——他专门做"可穿戴 App → Agent"这条产品线，质量相对有保障
- 同类里还有 hevycli（3,591 下载）走 CLI 路线，支持导出 JSON，适合想自己折腾数据的用户

**适合人群：** 用 Hevy 记录训练的健身房常客。没用过 Hevy 的话，这个 skill 的价值要打折扣。

---

### 3. Section 11 —— 给严肃训练者的证据派教练 ⭐⭐⭐⭐⭐

| 项目 | 详情 |
|------|------|
| **ClawHub** | [crankaddict/section11](https://clawhub.ai/crankaddict/skills/section11) |
| **下载量** | 3,752 |
| **推荐指数** | ⭐⭐⭐⭐⭐ |

**核心功能：**

第 3 期介绍过 Endurance Coach（生成训练计划），Section 11 是它的"进阶替代品"——区别在于它不只是排课表，而是一套**基于证据的耐力训练协议**（当前版本 v11.35，迭代痕迹很重）：

- 课前后报告：训练负荷、强度分布、主观疲劳对照
- 分析训练数据：功率曲线、心率漂移、PWR
- 生成周期化计划，并结合 Intervals.icu 的实际数据校准
- 作者 crankaddict 是自行车圈用户，对骑行场景覆盖最好

**实用场景举例：**

```
用户：分析一下上周的训练，FTP 测试要不要安排？
AI：上周总负荷 612 TSS，低于计划的 700（-12%），
    原因是周三的 4×8min 间歇没完成。
    但你的慢性训练负荷（CTL）已到 68，连续三周上升，
    form 值 -15 属于偏疲劳区间。
    建议：本周不安排 FTP 测试，先完成计划的
    有氧量，下周 freshness 到位再测。
```

**技术实现：**
- 本质是"协议 + 工作流"型 skill：把运动科学文献里公认的监测指标（CTL/ATL/TSB 等）固化成 Agent 的分析步骤
- 数据层对接 [Intervals.icu](https://intervals.icu)——一个免费的运动数据分析平台；如果你嫌它重，同类的 pseuss/intervals-icu-api（3,053 下载）是纯 API 参考手册，适合自己拼装
- 国内用户可以看看 baijian/garmin-analysis-skill（866 下载），中文界面，同时支持 Garmin、iGPSPORT、行者、Strava 多平台

**适合人群：** 有功率计的骑行/跑步爱好者，已经懂 CTL/FTP 这些概念的进阶训练者。

---

### 4. Fasting Tracker + jhillin8 追踪家族 —— 极简主义的胜利 ⭐⭐⭐⭐

| 项目 | 详情 |
|------|------|
| **ClawHub** | [jhillin8/fasting-tracker](https://clawhub.ai/jhillin8/skills/fasting-tracker) |
| **下载量** | 3,089（同门 muscle-gain 3,236、detox-counter 2,781） |
| **推荐指数** | ⭐⭐⭐⭐ |

**核心功能：**

这个分类里有个有趣的现象：作者 jhillin8 一个人贡献了三个轻量追踪器，形成一个"自律工具箱"：

- **Fasting Tracker**：间歇性断食窗口记录，支持 16:8、18:6 等常见模式和延长断食
- **Muscle Gain**：增肌追踪，体重渐进 + 蛋白质摄入
- **Detox Counter**：任意戒断目标的自定义计数器 + 症状日志（戒烟、戒糖、戒咖啡都行）

**实用场景举例：**

```
用户：开始断食
AI：已开启 16:8 断食窗口，进食期 12:00-20:00。
    当前已断食 14h 32m，距窗口结束还有 1h 28m。
    过去 7 天完成率 6/7，平均断食 15.2h，
    周三那次只坚持了 12h——那天你提到加班到很晚，
    压力性进食是常见破窗原因，需要我提前提醒你吗？
```

**技术实现：**
- 没有外部 API 依赖，纯本地状态文件存储——数据不出本机，隐私友好
- 正因为没有 App 依赖，跨设备同步要自己想办法（比如把状态文件放 iCloud/坚果云）
- 这类 skill 的价值在"顺手"：聊天中一句话开始/结束，不用专门打开 App

**适合人群：** 不想再装一个 App、但希望 Agent 顺手帮忙记账的轻量用户。三个 tracker 可以单独装，也可以组合。

---

### 5. Mealie API —— 自托管家庭的饮食中枢 ⭐⭐⭐⭐

| 项目 | 详情 |
|------|------|
| **ClawHub** | [angusthefuzz/mealie-api](https://clawhub.ai/angusthefuzz/skills/mealie-api) |
| **下载量** | 1,842 |
| **推荐指数** | ⭐⭐⭐⭐ |

**核心功能：**

前面四个都在管"练"，最后一个管"吃"。Mealie 是流行的自托管菜谱管理器（self-hosted），这个 skill 让 Agent 直接操作它：

- 菜谱增删改查、按食材搜索
- 生成和管理一周膳食计划
- 自动汇总购物清单
- 网页菜谱一键导入（解析 schema.org 数据）

**实用场景举例：**

```
用户：这周家里三人晚餐安排一下，周二周四我在健身房
     晚上九点才到家， preferably 高蛋白快手菜
AI：已更新 Mealie 膳食计划：
    周二：香煎鸡胸肉藜麦沙拉（25min，蛋白质 48g/人）
    周四：番茄牛肉乌冬（20min，蛋白质 42g/人）
    其余五天安排常规菜谱。
    购物清单已生成 23 项，按超市动线排好序。
```

**技术实现：**
- 调用自建 Mealie 实例的 REST API，需要配置实例地址和 API Key
- 数据完全在自己家里——这是 self-hosted 路线的核心卖点
- 同类可选：thekie/cookidoo（2,944 下载，对接美善品官方 Cookidoo）、g1mb01d/mealie（2,086 下载，功能相近的另一个实现）

**适合人群：** 已经在跑 HomeLab、有 NAS 的家庭用户。没有自托管需求的话，直接用 cookidoo 或 recipe-finder 更省事。

---

## 推荐指数排名

| 排名 | Skill | 推荐指数 | 一句话点评 |
|------|-------|---------|-----------|
| 🥇 | Garmin Health Analysis | ⭐⭐⭐⭐⭐ | 分类下载量冠军，佳明用户必装 |
| 🥈 | Section 11 | ⭐⭐⭐⭐⭐ | 证据派训练协议，严肃训练者的升级选项 |
| 🥉 | Hevy | ⭐⭐⭐⭐ | 力量训练数据桥梁，Hevy 用户专属 |
| 4 | Fasting Tracker（家族） | ⭐⭐⭐⭐ | 零依赖本地追踪，胜在顺手 |
| 5 | Mealie API | ⭐⭐⭐⭐ | 自托管家庭刚需，受众垂直 |

## 应用场景总结

**场景一：Garmin 全家桶用户**
Garmin Health Analysis + Section 11：手表数据自动进 Agent，训练建议基于 CTL/TSB 等量化指标而不是拍脑袋。

**场景二：健身房力量党**
Hevy + Muscle Gain（jhillin8 家族）+ 前几期介绍过的 Calorie Counter：训练记录、体重渐进、蛋白质摄入三本账一起盯。

**场景三：轻断食减脂**
Fasting Tracker + Calorie Counter + Fitbit：断食窗口、热量缺口、活动消耗互相校验，Agent 在你快"破窗"时发提醒。

**场景四：自托管家庭**
Mealie API + HomeAssistant 类 skill（第 21 期讲过）：菜谱、购物清单、膳食计划都在自家服务器上，Agent 是唯一的操作入口。

## 实用建议

1. **注意第三方 API 的脆弱性**：Garmin 这类 skill 走的是非官方接口，佳明改版可能导致失效；重要历史数据建议定期导出 FIT 文件存档
2. **健康数据格外敏感**：睡眠、心率、位置都属于高敏信息，优先选本地存储型 skill（如 jhillin8 家族），云端型至少搞清楚 token 存在哪
3. **AI 教练建议 ≠ 医疗建议**：训练计划、断食方案类 skill 的输出请当作参考，有基础疾病先问医生
4. **前两期内容依然有效**：Health Sync（多平台聚合）和 Endurance Coach（计划生成）与本期推荐不冲突，组合使用体验更好

---

*本文数据采集自 [clawskills.sh](https://clawskills.sh/)（awesome-openclaw-skills 官方目录）与 ClawHub（clawhub.ai），下载量为 2026 年 10 月 12 日数据。原目录中的 SKILL.md 源链接（openclaw/skills 仓库）已失效，本文信息以 ClawHub 注册表为准。*

**下一期预告**：第 14 期将介绍 **图像与视频生成（image-and-video-generation）** 分类，看看 Agent 怎么帮你画画和剪片。
