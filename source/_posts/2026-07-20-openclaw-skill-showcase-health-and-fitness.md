---
title: OpenClaw Skill 每日推荐 - Health & Fitness 健康与健身
tags:
  - openclaw
  - skill
  - health-and-fitness
categories:
  - 技术推荐
abbrlink: 37308
date: 2026-07-20 11:30:00
---

# OpenClaw Skill 每日推荐 - Health & Fitness 健康与健身

> 📅 2026年7月20日 | 第13期 | 分类：健康与健身
> 
> 让 AI 成为你的私人健康顾问——从可穿戴设备数据聚合到个性化训练计划，OpenClaw 健康类 Skill 覆盖了 84 个实用工具。

## 今日分类概述

**Health & Fitness（健康与健身）** 分类共收录 **84 个 Skill**，是 OpenClaw 生态中规模较大的分类之一。这些 Skill 涵盖了：

- 🏃 运动训练与耐力教练
- 🍎 饮食追踪与营养管理
- ⌚ 可穿戴设备数据集成（Fitbit、Garmin、Oura Ring、WHOOP 等）
- 😴 睡眠监测与分析
- 👶 婴儿健康追踪
- 📊 多平台健康数据聚合
- 🧘 心理健康与冥想

今天精选 5 个最具代表性的 Skill 进行深度解析。

---

## 🲃 精选 Skill 详解

### 1. Health Sync — 多平台健康数据聚合中心

| 项目 | 详情 |
|------|------|
| **GitHub** | [filipe-m-almeida/health-sync](https://github.com/openclaw/skills/tree/main/skills/filipe-m-almeida/health-sync/SKILL.md) |
| **推荐指数** | ⭐⭐⭐⭐⭐ |

**核心功能：**

Health Sync 是健康类 Skill 中集成度最高的工具之一，支持从 **6 大主流健康平台** 同步和分析数据：

- **Oura Ring** — 睡眠、体温、心率变异性（HRV）
- **Withings** — 体重、血压、体脂率
- **Hevy** — 力量训练记录
- **Strava** — 跑步、骑行等有氧运动
- **WHOOP** — 恢复评分、睡眠质量
- **Eight Sleep** — 智能床垫睡眠数据

**实用场景举例：**

```
用户：我这周的训练负荷和恢复状态怎么样？
AI：正在分析你的 WHOOP 恢复数据和 Strava 训练记录...
→ 本周训练负荷较高（Strava 显示 4 次跑步共 42km），
   WHOOP 恢复评分从 78% 降至 52%，
   Oura 深睡时间减少 23%。
   建议明天安排休息日或低强度恢复训练。
```

**技术实现：**
- 通过各平台 REST API 获取数据
- 统一时间轴对齐多源数据
- 本地缓存减少 API 调用
- 生成跨平台健康趋势报告

**适合人群：** 同时使用多个健康设备的量化自我爱好者、数据驱动型运动员。

---

### 2. Fitbit — 可穿戴设备数据查询

| 项目 | 详情 |
|------|------|
| **GitHub** | [mjrussell/fitbit](https://github.com/openclaw/skills/tree/main/skills/mjrussell/fitbit/SKILL.md) |
| **推荐指数** | ⭐⭐⭐⭐ |

**核心功能：**

Fitbit Skill 让你的 AI 助手直接查询 Fitbit 设备的健康数据，无需打开 App：

- 📈 睡眠分析（深睡、浅睡、REM 时长）
- ❤️ 心率监测（静息心率、运动心率区间）
- 🏃 活动追踪（步数、距离、卡路里消耗）
- 🩸 血氧饱和度（SpO2）监测

**实用场景举例：**

```
用户：帮我看看昨晚的睡眠质量
AI：正在查询你的 Fitbit 睡眠数据...
→ 昨晚总睡眠 7h 23min，深睡 1h 12min（占比 16.3%），
   REM 1h 45min，觉醒 3 次。
   静息心率 58 bpm，较前日下降 2 bpm。
   整体睡眠评分 82/100（良好）。
```

**技术实现：**
- 基于 Fitbit Web API
- OAuth 2.0 认证流程
- 支持 JSON 格式数据解析
- 可设置时间范围查询历史数据

**适合人群：** Fitbit 设备用户，希望用自然语言查询健康数据。

---

### 3. Endurance Coach — AI 耐力运动教练

| 项目 | 详情 |
|------|------|
| **GitHub** | [shiv19/endurance-coach](https://github.com/openclaw/skills/tree/main/skills/shiv19/endurance-coach/SKILL.md) |
| **推荐指数** | ⭐⭐⭐⭐⭐ |

**核心功能：**

Endurance Coach 是一个 AI 驱动的个性化耐力训练计划生成器，支持：

- 🏊‍♂️ 铁人三项训练计划（游泳+骑行+跑步）
- 🏃‍♂️ 马拉松训练计划（全马/半马）
- 🏔️ 超级耐力赛训练计划（Ultra-endurance）
- 📅 周期化训练安排（基础期、建设期、巅峰期、减量期）
- 🔄 根据反馈动态调整训练量

**实用场景举例：**

```
用户：我要准备 12 月的厦门马拉松，目标 sub 4，帮我制定训练计划
AI：正在生成个性化马拉松训练计划...

📊 训练周期：16 周（8月-12月）
🎯 目标完赛时间：3:59:59
📈 周跑量递增：从 30km → 峰值 65km

阶段安排：
- W1-W4 基础期：轻松跑为主，建立有氧基础
- W5-W10 建设期：加入 tempo run 和间歇训练
- W11-W14 巅峰期：长距离拉练 + 配速训练
- W15-W16 减量期：逐步降低训练量，赛前调整

本周训练（W1）：
- 周二：6km 轻松跑（心率 Z2）
- 周四：5km 轻松跑 + 4×100m 冲刺
- 周六：10km 长距离慢跑
- 周日：休息或 30min 交叉训练
```

**技术实现：**
- 基于运动科学的周期化训练理论
- 考虑跑者当前水平和目标成绩
- 支持心率区间训练指导
- 可结合 Garmin/Strava 数据动态调整

**适合人群：** 马拉松跑者、铁三爱好者、追求系统化训练的耐力运动员。

---

### 4. Calorie Counter — 智能热量追踪

| 项目 | 详情 |
|------|------|
| **GitHub** | [cnqso/calorie-counter](https://github.com/openclaw/skills/tree/main/skills/cnqso/calorie-counter/SKILL.md) |
| **推荐指数** | ⭐⭐⭐⭐ |

**核心功能：**

Calorie Counter 是一个简洁实用的每日热量和蛋白质追踪工具：

- 📊 每日卡路里摄入记录
- 🥩 蛋白质摄入追踪
- 🎯 个性化目标设定
- 📅 历史数据回顾
- 💬 自然语言输入（"午饭吃了一碗牛肉面"）

**实用场景举例：**

```
用户：早饭吃了两个鸡蛋、一杯牛奶、两片全麦面包
AI：已记录今日早餐：
   - 煮鸡蛋 ×2：140 kcal，12g 蛋白质
   - 牛奶 250ml：150 kcal，8g 蛋白质
   - 全麦面包 ×2：160 kcal，6g 蛋白质
   合计：450 kcal，26g 蛋白质
   
   今日目标：1800 kcal，蛋白质 120g
   已摄入：450 kcal（25%），蛋白质 26g（22%）
   剩余可用：1350 kcal，蛋白质 94g
```

**技术实现：**
- 食物营养数据库查询
- 自然语言食物识别
- 每日目标进度追踪
- 支持自定义食物条目

**适合人群：** 减脂人群、健身增肌者、需要控制饮食的慢性病患者。

---

### 5. Huckleberry — 婴儿健康追踪

| 项目 | 详情 |
|------|------|
| **GitHub** | [jayhickey/huckleberry](https://github.com/openclaw/skills/tree/main/skills/jayhickey/huckleberry/SKILL.md) |
| **推荐指数** | ⭐⭐⭐⭐ |

**核心功能：**

Huckleberry Skill 是一个独特的婴儿健康追踪工具，通过 Huckleberry App 的 API 实现：

- 😴 婴儿睡眠记录（入睡时间、醒来时间、睡眠时长）
- 🍼 喂养记录（母乳/配方奶、量、时间）
- 👶 尿布记录（湿尿布/脏尿布）
- 📈 生长曲线追踪（体重、身高百分位）
- 🔮 基于年龄的睡眠预测建议

**实用场景举例：**

```
用户：宝宝今天睡了多久？
AI：正在查询 Huckleberry 数据...
→ 今日宝宝睡眠记录：
   夜间睡眠：21:30 - 06:45（9h 15min）
   上午小睡：08:30 - 09:45（1h 15min）
   下午小睡：13:00 - 14:30（1h 30min）
   总计：12h 0min
   
   💡 根据宝宝月龄（8个月），建议下午小睡时间略短，
   夜间入睡时间可提前至 20:45 以保证充足夜间睡眠。
```

**技术实现：**
- 通过 Huckleberry App API 获取数据
- 支持多宝宝档案切换
- 结合儿科睡眠科学给出建议
- 可设置提醒（喂养间隔、睡眠窗口）

**适合人群：** 新手父母，尤其是需要精确追踪婴儿作息的家庭。

---

## 📊 推荐指数排名

| 排名 | Skill | 推荐指数 | 核心价值 |
|------|-------|---------|---------|
| 1 | Health Sync | ⭐⭐⭐⭐⭐ | 多平台数据聚合，健康全景视图 |
| 2 | Endurance Coach | ⭐⭐⭐⭐⭐ | AI 驱动个性化训练计划 |
| 3 | Fitbit | ⭐⭐⭐⭐ | 自然语言查询可穿戴设备数据 |
| 4 | Calorie Counter | ⭐⭐⭐⭐ | 简洁实用的饮食追踪 |
| 5 | Huckleberry | ⭐⭐⭐⭐ | 婴儿健康追踪的稀缺方案 |

---

## 🎯 应用场景总结

### 场景一：量化自我爱好者

**组合方案：** Health Sync + Fitbit + Calorie Counter

将多个可穿戴设备数据聚合到一处，配合饮食记录，构建完整的个人健康仪表盘。AI 可以交叉分析睡眠质量与次日运动表现、卡路里摄入与体重变化趋势等。

### 场景二：系统化备赛跑者

**组合方案：** Endurance Coach + Garmin Health + Health Sync

让 AI 教练根据你的 Garmin 运动数据和恢复状态，动态调整训练计划。训练完成后自动同步数据，形成训练-恢复-调整的闭环。

### 场景三：新手父母育儿助手

**组合方案：** Huckleberry + Calorie Counter

追踪宝宝作息的同时，也关注自己的饮食健康。育儿期间容易忽视自身营养，AI 可以提醒妈妈保持充足的蛋白质和水分摄入。

### 场景四：减脂塑形

**组合方案：** Calorie Counter + Fitbit + Endurance Coach

热量缺口管理 + 运动消耗追踪 + 个性化训练计划三位一体。AI 根据每日活动量动态调整饮食建议，确保减脂期间不流失肌肉。

---

## 💡 实用建议

1. **从单一 Skill 开始**：不要一次性安装所有健康 Skill，先从你目前最需要的功能开始
2. **数据隐私优先**：健康数据敏感，确保理解每个 Skill 的数据存储策略
3. **设备兼容性检查**：安装前确认你的设备平台是否被支持
4. **定期数据审查**：AI 分析仅供参考，重要健康决策仍需咨询专业医生
5. **结合 Heartbeat 机制**：可以设置 OpenClaw 的 Heartbeat 定期检查健康数据，主动提醒

---

## 🔮 值得关注的其他 Skill

除了精选的 5 个之外，以下 Skill 也值得关注：

- **Fasting Tracker** — 间歇性断食追踪，支持自定义断食窗口
- **Garmin Health** — Garmin Connect 数据自然语言查询
- **Oura Analytics** — Oura Ring 数据深度分析
- **Diet Tracker** — 每日饮食营养计算
- **Muscle Gain** — 力量训练进展与蛋白质追踪
- **Soft Pillow** — 睡眠数据查询与梦境记录
- **Sauna Calm** — 呼吸练习与情绪管理

---

> 🏷️ 本篇为 OpenClaw Skill 每日推荐系列第 13 期，共 30 期。
> 
> 明日预告：**Image & Video Generation（图像与视频生成）** — AI 创作工具合集
> 
> 完整系列请访问：[www.daoyuly.cn](https://www.daoyuly.cn)
