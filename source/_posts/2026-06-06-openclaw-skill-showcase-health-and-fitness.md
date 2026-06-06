---
title: OpenClaw Skill 每日推荐 - Health & Fitness
date: 2026-06-06 11:30:00
tags:
  - openclaw
  - skill
  - health-and-fitness
categories:
  - 技术推荐
---

# 🏥 OpenClaw Skill 每日推荐 — Health & Fitness（健康与健身）

> 第 13 期 | 2026-06-06 | 共 84 个 Skills

健康与健身是 OpenClaw 生态中一个越来越重要的分类。从可穿戴设备数据整合到个性化训练计划，这些 Skill 让 AI 助手真正成为你的健康管理伙伴。今天精选 5 个最具代表性的 Skill 进行详解。

---

## 🏆 精选 Skill 详解

### 1. Health Sync — 多设备健康数据聚合分析

**GitHub:** [openclaw/skills/health-sync](https://github.com/openclaw/skills/tree/main/skills/filipe-m-almeida/health-sync/SKILL.md)

**推荐指数:** ⭐⭐⭐⭐⭐

**核心功能：** 一站式整合多款主流健康设备的数据，包括 Oura Ring、Withings、Hevy、Strava、WHOOP 和 Eight Sleep。无论你用哪个设备，都能在一个界面中获得全面的健康分析。

**实用场景：**
- 你戴 Oura Ring 睡觉、用 WHOOP 训练、拿 Hevy 记录力量训练 — Health Sync 把所有数据汇总成统一视图
- 「我昨天恢复得怎么样？」— 直接问，AI 跨设备分析 HRV、睡眠质量、训练负荷

**技术亮点：** 通过各平台的 API 实现数据同步，OpenClaw 作为中间层做数据标准化和交叉分析，这种「AI + 多设备」的模式是健康管理的未来方向。

---

### 2. Fitbit — 全维度健康数据查询

**GitHub:** [openclaw/skills/fitbit](https://github.com/openclaw/skills/tree/main/skills/mjrussell/fitbit/SKILL.md)

**推荐指数:** ⭐⭐⭐⭐⭐

**核心功能：** 查询 Fitbit 设备的完整健康数据，涵盖睡眠、心率、活动量、血氧饱和度（SpO2）等核心指标。

**实用场景：**
- 「我这周平均静息心率是多少？」
- 「昨晚深睡比例如何？」
- 「过去 7 天步数趋势怎样？」

**搭配 Fitbit Analytics Skill 效果更佳：** 配合 [fitbit-analytics](https://github.com/openclaw/skills/tree/main/skills/kesslerio/fitbit-analytics/SKILL.md) 可以生成可视化图表和深度分析报告。

---

### 3. Oura Analytics — 智能戒指数据洞察

**GitHub:** [openclaw/skills/oura-analytics](https://github.com/openclaw/skills/tree/main/skills/kesslerio/oura-analytics/SKILL.md)

**推荐指数:** ⭐⭐⭐⭐⭐

**核心功能：** 整合 Oura Ring 的数据并生成分析报告，覆盖睡眠评分、准备度评分、活动评分、HRV 趋势等。

**实用场景：**
- 每天早上自动推送睡眠质量报告
- 追踪长期 HRV 趋势，判断身体恢复状态
- 根据 Readiness Score 调整当日训练强度

**为什么推荐：** Oura Ring 以精准的睡眠和恢复追踪著称，将数据接入 OpenClaw 后，你不再需要打开 App 查看数据，直接问 AI 就能获得个性化解读和建议。

---

### 4. Calorie Counter — 卡路里与蛋白质追踪

**GitHub:** [openclaw/skills/calorie-counter](https://github.com/openclaw/skills/tree/main/skills/cnqso/calorie-counter/SKILL.md)

**推荐指数:** ⭐⭐⭐⭐

**核心功能：** 记录每日卡路里和蛋白质摄入，设定目标并追踪达成进度。配合 [diet-tracker](https://github.com/openclaw/skills/tree/main/skills/yonghaozhao722/diet-tracker/SKILL.md) 和 [health-summary](https://github.com/openclaw/skills/tree/main/skills/yusaku-0426/health-summary/SKILL.md) 可形成完整的饮食管理闭环。

**实用场景：**
- 「我今天的蛋白质摄入够了吗？」
- 「帮我记录午餐吃了 200g 鸡胸肉和一碗米饭」
- 「这周营养摄入总结一下」

**使用方式：** 自然语言输入食物信息，AI 自动计算卡路里和宏量营养素，无需手动查表。

---

### 5. Endurance Coach — 耐力运动教练

**GitHub:** [openclaw/skills/endurance-coach](https://github.com/openclaw/skills/tree/main/skills/shiv19/endurance-coach/SKILL.md)

**推荐指数:** ⭐⭐⭐⭐

**核心功能：** 为铁人三项、马拉松和超级耐力运动创建个性化训练计划。

**实用场景：**
- 「我三个月后要跑首马，帮我制定训练计划」
- 「根据上周训练数据，调整这周的训练量」
- 「铁人三项备赛 16 周计划」

**同类 Skill：** [Intervals.icu](https://github.com/openclaw/skills/tree/main/skills/pseuss/intervals-icu-api/SKILL.md) 提供自行车训练数据的专业管理，适合骑行爱好者。

---

## 📊 推荐指数排名

| 排名 | Skill | 评分 | 关键词 |
|------|-------|------|--------|
| 1 | Health Sync | ⭐⭐⭐⭐⭐ | 多设备整合、跨平台分析 |
| 2 | Fitbit | ⭐⭐⭐⭐⭐ | 可穿戴设备、全面数据 |
| 3 | Oura Analytics | ⭐⭐⭐⭐⭐ | 睡眠追踪、恢复评分 |
| 4 | Calorie Counter | ⭐⭐⭐⭐ | 饮食管理、宏量营养素 |
| 5 | Endurance Coach | ⭐⭐⭐⭐ | 训练计划、耐力运动 |

---

## 🏃 分类全景

Health & Fitness 分类共包含 **84 个 Skills**，覆盖以下领域：

| 领域 | 代表 Skill | 数量 |
|------|-----------|------|
| 可穿戴设备 | Fitbit, Oura, Garmin, WHOOP | ~15 |
| 饮食管理 | Calorie Counter, Diet Tracker, Feast | ~10 |
| 训练计划 | Endurance Coach, Hevy, Intervals.icu | ~8 |
| 睡眠追踪 | Soft Pillow, Huckleberry | ~5 |
| 身体扫描 | AnthroVision Body Scan | ~2 |
| 健康监测 | Health Guardian, Gevety | ~5 |
| 其他 | 食谱、黑客马拉松、区块链相关 | ~39 |

> ⚠️ 注意：此分类中部分 Skill（约 40%）与健康健身关联度较低，更偏区块链/加密货币方向，可能是分类标签问题。

---

## 💡 应用场景总结

**场景一：全方位健康仪表盘**
```
Health Sync + Oura/Fitbit + Health Summary
→ 每天自动汇总：睡眠 + 训练 + 营养 + 恢复状态
```

**场景二：减脂增肌助手**
```
Calorie Counter + Muscle Gain + Hevy
→ 记录饮食 + 追踪力量训练进步 + 蛋白质达标提醒
```

**场景三：备赛训练**
```
Endurance Coach + Intervals.icu + Fasting Tracker
→ 个性化训练计划 + 骑行数据分析 + 间歇断食管理
```

---

## 🔧 实用建议

1. **从数据接入开始：** 先安装对应可穿戴设备的 Skill（Fitbit/Oura/Garmin），有了数据基础才能做后续分析
2. **组合使用效果翻倍：** 单个 Skill 能力有限，Health Sync + 设备专用 Skill 的组合能提供最全面的洞察
3. **设定自动化：** 配合 OpenClaw 的定时任务，可以实现每天早上自动推送健康日报
4. **注意数据隐私：** 健康数据属于敏感信息，确保 API Token 安全存储

---

*明天预告：Image & Video Generation — 图像与视频生成 Skill 分类*

---

> 本文是 [OpenClaw Skill 每日推荐](https://www.daoyuly.cn)系列的第 13 篇。关注本系列，每天发现好用的 AI Skill。
