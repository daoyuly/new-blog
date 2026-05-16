---
title: OpenClaw Skill 每日推荐 - 交通出行
tags:
  - openclaw
  - skill
  - 交通出行
  - transportation
categories:
  - 技术推荐
abbrlink: 24888
date: 2026-05-16 11:36:00
---

# 🚀 OpenClaw Skill 每日推荐 — 交通出行 (Transportation)

> 本栏目每天介绍一个 OpenClaw Skill 分类，帮你发现最实用的 AI Agent 技能。
> 今日是第 **29/30** 期。

## 分类概述

交通出行（Transportation）分类共收录 **110 个 Skills**，覆盖了从航班追踪、公共交通查询、路线规划到旅行代理的全方位出行能力。无论你是在伦敦赶地铁、纽约坐公交、德国坐火车，还是想追踪一架航班的实时位置，这个分类都有对应的 Skill 可以帮到你的 AI Agent。

这 110 个 Skills 中，交通出行相关的约占 60%，其余涵盖了支付安全、旅行管理、地理定位等出行衍生场景。今天精选 5 个最具代表性的交通出行 Skill 进行详解。

---

## 🌟 精选 Skill 详解

### 1. TfL — 伦敦公共交通实时查询

- **GitHub**: [brianleach/tfl](https://github.com/openclaw/skills/tree/main/skills/brianleach/tfl/SKILL.md)
- **推荐指数**: ⭐⭐⭐⭐⭐

**核心功能：**
为你的 AI Agent 接入伦敦交通局 (Transport for London) 的完整 API，提供实时地铁到站、公交预测、线路状态、服务中断和行程规划。

**实用场景：**
- "Northern Line 现在正常运行吗？"
- "从 King's Cross 到 Canary Wharf 怎么走最快？"
- "37 路公交还有几分钟到？"
- 伦敦通勤族每日出行前自动检查线路状态

**技术实现：**
基于 TfL 统一 API（`api.tfl.gov.uk`），封装了多个命令行工具，分别处理地铁 (Tube)、公交 (Bus)、线路状态 (Line Status) 和行程规划 (Journey Planner)。支持 GTFS 实时数据，能获取车辆实时位置。

**同类 Skills：** 同一作者还开发了 [MTA](https://github.com/openclaw/skills/tree/main/skills/brianleach/mta/SKILL.md)（纽约地铁公交）、[CTA](https://clawhub.ai/brianleach/cta)（芝加哥 L 线）、[Metra](https://github.com/openclaw/skills/tree/main/skills/brianleach/metra/SKILL.md)（芝加哥通勤铁路）、[CapMetro](https://github.com/openclaw/skills/tree/main/skills/brianleach/capmetro-skill/SKILL.md)（奥斯汀公交）等美国城市交通 Skill，形成了一个全球城市交通 Skill 生态。

---

### 2. AviationStack Flight Tracker — 全球航班实时追踪

- **GitHub**: [copey02/aviationstack-flight-tracker](https://github.com/openclaw/skills/tree/main/skills/copey02/aviationstack-flight-tracker/SKILL.md)
- **推荐指数**: ⭐⭐⭐⭐⭐

**核心功能：**
通过 AviationStack API 实时追踪全球航班，获取航班状态、出发/到达时间、延误信息、航站楼和登机口等详细信息。

**实用场景：**
- "帮我查一下 CA981 航班现在到哪了？"
- "我朋友的飞机晚点了吗？"
- 机场接机前自动检查航班实时状态
- 差旅管理中批量追踪团队航班

**技术实现：**
基于 [AviationStack API](https://aviationstack.com/)，这是一个提供全球航班数据的 RESTful API。Skill 封装了航班查询、实时追踪和历史数据接口，支持按航班号、出发/到达机场、航空公司等多维度查询。

**同类 Skills：** 还有 [flight-tracker](https://github.com/openclaw/skills/tree/main/skills/xenofex7/flight-tracker/SKILL.md)、[track-flight](https://github.com/openclaw/skills/tree/main/skills/rafaforesightai/track-flight/SKILL.md)、[copey-flight-tracker](https://github.com/openclaw/skills/tree/main/skills/copey02/copey-flight-tracker/SKILL.md) 等多个航班追踪实现。

---

### 3. Camino Route — 智能路线规划

- **GitHub**: [james-southendsolutions/camino-route](https://github.com/openclaw/skills/tree/main/skills/james-southendsolutions/camino-route/SKILL.md)
- **推荐指数**: ⭐⭐⭐⭐⭐

**核心功能：**
基于 Camino AI 的位置智能平台，提供两点之间的详细路线规划，包含距离、时长和可选的逐步导航指令。

**实用场景：**
- "从酒店到会议中心开车要多久？"
- "帮我规划一条步行为主的观光路线"
- 每日通勤路线时间预估
- 自驾游路线规划

**技术实现：**
调用 Camino AI 的位置智能 API，支持多种交通模式（驾车、步行、骑行、公共交通）。同一作者还构建了一整套 Camino 生态 Skills：

| Skill | 功能 |
|-------|------|
| [camino-ev-charger](https://github.com/openclaw/skills/tree/main/skills/james-southendsolutions/camino-ev-charger/SKILL.md) | 沿途查找电动车充电站 |
| [camino-journey](https://github.com/openclaw/skills/tree/main/skills/james-southendsolutions/camino-journey/SKILL.md) | 多途经点行程优化 |
| [camino-travel-planner](https://github.com/openclaw/skills/tree/main/skills/james-southendsolutions/camino-travel-planner/SKILL.md) | 完整的一日游/多站行程规划 |
| [camino-safety-checker](https://github.com/openclaw/skills/tree/main/skills/james-southendsolutions/camino-safety-checker/SKILL.md) | 周边安全设施查找（24小时商铺、警察局、医院） |

这套组合非常适合打造完整的旅行助手 Agent。

---

### 4. Bahn — 德国铁路查询

- **GitHub**: [tobiasbischoff/bahn](https://github.com/openclaw/skills/tree/main/skills/tobiasbischoff/bahn/SKILL.md)
- **推荐指数**: ⭐⭐⭐⭐

**核心功能：**
使用 `bahn-cli` 命令行工具搜索德国铁路 (Deutsche Bahn) 的火车连接，查询时刻表、换乘方案和票价。

**实用场景：**
- "柏林到慕尼黑的 ICE 最快要多久？"
- "明天早上 8 点从法兰克福出发有哪些火车？"
- 德国出差时的铁路出行规划

**技术实现：**
基于 `bahn-cli` npm 包，这是一个社区开发的德国铁路 CLI 查询工具，底层调用 Deutsche Bahn 的公开 API。纯命令行方式，适合集成到 Agent 的工作流中。

**同类 Skills：** [db-travel](https://github.com/openclaw/skills/tree/main/skills/mmichelli/db-travel/SKILL.md) 使用 `v6.db.transport.rest` API 提供更全面的德铁查询，覆盖德国及欧洲范围内的铁路出行。

---

### 5. HK Bus ETA — 香港巴士实时到站

- **GitHub**: [tomfong/hk-bus-eta](https://github.com/openclaw/skills/tree/main/skills/tomfong/hk-bus-eta/SKILL.md)
- **推荐指数**: ⭐⭐⭐⭐

**核心功能：**
实时查询香港巴士到站时间，支持九巴 (KMB)、龙运 (LWB) 和城巴 (Citybus) 的到站预测。

**实用场景：**
- "170 号巴士还有几长时间到？"
- "坑口站附近有边架巴士快到？"
- 香港日常通勤出行
- 周末出行前查看巴士班次

**技术实现：**
对接香港公共交通数据开放平台，实时获取巴士预计到站时间 (ETA)。Skill 同时支持繁体中文和英文查询，符合香港本地使用习惯。

---

## 📊 推荐指数排名

| 排名 | Skill | 推荐指数 | 一句话评价 |
|:----:|-------|:-------:|-----------|
| 1 | TfL (伦敦交通) | ⭐⭐⭐⭐⭐ | 最完整的城市公共交通 Skill |
| 2 | AviationStack Flight Tracker | ⭐⭐⭐⭐⭐ | 全球航班追踪，差旅必备 |
| 3 | Camino Route | ⭐⭐⭐⭐⭐ | 位置智能平台，路线规划生态 |
| 4 | Bahn (德国铁路) | ⭐⭐⭐⭐ | 德铁出行好帮手 |
| 5 | HK Bus ETA | ⭐⭐⭐⭐ | 香港巴士出行实时查询 |

---

## 🗺️ 其他值得关注

这个分类还有不少亮点：

- **[Amadeus Flights](https://github.com/openclaw/skills/tree/main/skills/kirorab/amadeus-flights/SKILL.md)** — 通过 Amadeus API 查询航班价格、时刻和可用座位，适合机票比价
- **[Air France-KLM](https://github.com/openclaw/skills/tree/main/skills/iclems/airfrance-afkl/SKILL.md)** — 法航-荷航开放数据 API 航班追踪
- **[Travel Agent](https://github.com/openclaw/skills/tree/main/skills/aszelem/travel-agent/SKILL.md)** — 完整的旅行代理，能搜索、预订、改签航班
- **[BVG Route](https://github.com/openclaw/skills/tree/main/skills/jaysonsantos/bvg-route/SKILL.md)** — 柏林公共交通路线规划
- **[MVG CLI](https://github.com/openclaw/skills/tree/main/skills/lars147/mvg-cli/SKILL.md)** — 慕尼黑公共交通实时追踪
- **[Entur Travel](https://github.com/openclaw/skills/tree/main/skills/mmichelli/entur-travel/SKILL.md)** — 挪威公共交通行程规划
- **[GoTrain](https://github.com/openclaw/skills/tree/main/skills/gumadeiras/gotrain/SKILL.md)** — 纽约 MTA 系统（地铁、LIRR、Metro-North）列车时刻
- **[Aviation Weather](https://github.com/openclaw/skills/tree/main/skills/dimitryvin/aviation-weather/SKILL.md)** — 航空气象数据（METAR、TAF、PIREPs），飞行爱好者必备
- **[Charger](https://github.com/openclaw/skills/tree/main/skills/borahm/charger/SKILL.md)** — 电动车充电桩可用性查询
- **[Translink CLI](https://github.com/openclaw/skills/tree/main/skills/alanburchill/translink-cli/SKILL.md)** — 澳大利亚布里斯班公交查询

---

## 💡 应用场景总结

### 通勤场景
让 AI Agent 每天早上自动检查你的通勤线路状态，遇到延误或中断时主动提醒，甚至建议替代路线。

### 差旅管理
航班追踪 + 机票搜索 + 路线规划三位一体。出差前自动规划最佳路线，出差中实时追踪航班状态。

### 旅行规划
利用 Camino 生态 Skills 规划完整的多日行程，包含路线、安全检查、充电站（电动车出行）等。

### 本地化出行
香港巴士、伦敦地铁、纽约公交、德国火车……无论你身在哪个城市，都有一款 Skill 适合你。

---

## 📌 实用建议

1. **组合使用效果最佳**：将航班追踪 + 路线规划 + 天气查询组合起来，打造完整的出行助手
2. **关注 API Key 配置**：大部分交通 Skill 需要配置对应的 API Key（如 AviationStack、Amadeus、TfL），记得提前申请
3. **城市交通 Skill 选择**：优先选择同一作者的系列（如 brianleach 的城市交通系列），API 接口风格统一，便于维护
4. **实时数据为王**：交通出行最看重实时性，选择支持 GTFS Realtime 或 WebSocket 的 Skill 效果更好

---

> 🎋 **关于本系列**：这是 OpenClaw Skill 每日推荐系列的第 29 篇，明天将是最后一期 —— **Web 前端开发** 分类，敬请期待！
>
> 完整 Skill 列表请访问：[awesome-openclaw-skills](https://github.com/openclaw/skills)
