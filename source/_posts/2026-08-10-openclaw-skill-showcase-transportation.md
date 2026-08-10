---
title: OpenClaw Skill 每日推荐 - 交通出行
date: 2026-08-10 11:30:00
tags:
  - openclaw
  - skill
  - transportation
  - 交通出行
categories:
  - 技术推荐
---

# OpenClaw Skill 每日推荐 - 交通出行

> 🚌 第 29/30 期 | 交通出行分类 | 共 110 个 Skills

交通出行是 OpenClaw Skill 生态中最为实用的分类之一，涵盖了从城市公交到跨洲航班的全方位出行需求。今天精选 5 个最具代表性的交通类 Skill，覆盖纽约、伦敦、德国、香港及全球航班追踪，让你的 AI 助手秒变出行管家。

---

## 🏆 精选 Skill 详解

### 1. NYC MTA Transit — 纽约地铁公交实时追踪

| 项目 | 详情 |
|------|------|
| **作者** | brianleach |
| **链接** | [ClawHub](https://clawhub.ai/brianleach/mta) |
| **推荐指数** | ⭐⭐⭐⭐⭐ |

**核心功能：**
- 纽约地铁实时到站信息（GTFS-RT Protobuf 协议）
- 公交车实时预测（SIRI JSON API）
- 服务警报与延误通知
- 路线/站点查询与附近站点定位

**技术实现：**
地铁数据无需 API Key 即可用，公交数据需在 [MTA 开发者平台](https://register.developer.obanyc.com/) 免费申请。数据源分为三层：

- **地铁实时 feeds**：按线路分组（1234567/GS、ACE、BDFM 等），每 30 秒更新
- **公交实时**：SIRI 协议，限 1 次/30 秒
- **服务警报**：无需 Key

```bash
# 查询时代广场下一班地铁
node scripts/mta.mjs arrivals --stop-search "times square"

# 查询 A 线服务状态
node scripts/mta.mjs alerts --line A

# 查找附近地铁站
node scripts/mta.mjs stops --near 40.7484,-73.9856
```

**实用场景：** 在纽约出差时，早晨出门前让 AI 查一下地铁是否准点、哪条线有施工延迟，直接规划最佳出行方案。

---

### 2. TfL London Transit — 伦敦交通一体化查询

| 项目 | 详情 |
|------|------|
| **作者** | brianleach |
| **链接** | [ClawHub](https://clawhub.ai/brianleach/tfl) |
| **推荐指数** | ⭐⭐⭐⭐⭐ |

**核心功能：**
- 地铁（Tube）实时到站与线路状态
- 公交、DLR、Overground、Elizabeth line、有轨电车全覆盖
- 路线规划（Journey Planning）
- 站点搜索与附近站点查询

**技术实现：**
TfL 提供统一的 REST API（`api.tfl.gov.uk`），所有交通方式返回一致的 JSON 格式——比 MTA 的多协议方案优雅得多。免费使用，注册 API Key 后可达 500 次/分钟。

```bash
# 查看所有地铁线路状态
node scripts/tfl.mjs status --all

# 查询 Oxford Circus 站到站信息
node scripts/tfl.mjs arrivals --station "Oxford Circus"

# 从 Waterloo 到 King's Cross 路线规划
node scripts/tfl.mjs journey --from "waterloo" --to "kings cross"

# 北线延误信息
node scripts/tfl.mjs disruptions --line northern
```

**实用场景：** 在伦敦旅行时，让 AI 帮你规划从酒店到景点的最佳路线，实时避开延误线路。

---

### 3. Deutsche Bahn CLI — 德国铁路列车搜索

| 项目 | 详情 |
|------|------|
| **作者** | tobiasbischoff |
| **链接** | [ClawHub](https://clawhub.ai/tobiasbischoff/bahn) |
| **推荐指数** | ⭐⭐⭐⭐ |

**核心功能：**
- 搜索德国铁路（DB）列车连接
- 支持日期、时间指定
- 显示出发/到达时间、站台、换乘次数、列车类型

**技术实现：**
基于 `db-vendo-client` 库，通过 Node.js CLI 查询德国铁路系统。无需 API Key，直接使用公共接口。

```bash
# 搜索汉诺威到波恩的列车
node index.js search "Hannover Hbf" "Bonn Hbf" --results 3

# 指定日期时间搜索柏林到慕尼黑
node index.js search "Berlin" "München" --date 2026-08-15 --time 14:30
```

**实用场景：** 欧洲火车旅行规划利器。输入起止城市即可获得 ICE/IC/RE 等不同列车的连接方案，包括换乘详情。

---

### 4. AviationStack Flight Tracker — 全球航班实时追踪

| 项目 | 详情 |
|------|------|
| **作者** | copey02 |
| **链接** | [ClawHub](https://clawhub.ai/copey02/aviationstack-flight-tracker) |
| **推荐指数** | ⭐⭐⭐⭐ |

**核心功能：**
- 全球航班实时追踪（250+ 国家，13000+ 航司）
- 航班状态、延误计算、登机口信息
- 空中飞行时显示实时位置、高度、速度
- Flighty 风格的清晰输出格式

**技术实现：**
基于 AviationStack API，免费层每月 100 次请求。Python 脚本封装，输出带 emoji 状态指示器的格式化信息。

```bash
# 追踪美航 AA100
scripts/track_flight.py AA100

# 获取 JSON 原始数据
scripts/track_flight.py BA123 --json
```

**输出示例：**
```
✈️ American Airlines AA100
🛩️ Boeing 777-300ER (N729AN)
🛫 JFK Terminal 8, Gate B20 | 10:30 AM
🛬 LHR Terminal 3, Gate 23  | 10:45 PM
📊 🟢 Active / En-route
⏱️ On time
🌐 Altitude: 37,000 ft | Speed: 560 mph
```

**实用场景：** 出差接机前查一下航班实时状态；或长途飞行中让家人追踪你的航班位置。

---

### 5. HK Bus ETA — 香港巴士实时到站

| 项目 | 详情 |
|------|------|
| **作者** | tomfong |
| **链接** | [ClawHub](https://clawhub.ai/tomfong/hk-bus-eta) |
| **推荐指数** | ⭐⭐⭐⭐⭐ |

**核心功能：**
- 香港九巴（KMB）、龙运（LWB）、城巴（Citybus）实时到站预测
- 支持联营线路查询
- 智能站点匹配与坐标聚类
- 中英文双语输出

**技术实现：**
从香港政府数据开放平台（data.etabus.gov.hk / rt.data.gov.hk）获取实时数据。首次使用时同步站点数据到本地 SQLite 数据库（约 1-2 分钟），之后查询秒级响应。使用 ThreadPoolExecutor 并行抓取多条线路 ETA。

```bash
# 查询 A29 在宝琳站的下一班车（中文）
python3 scripts/eta.py A29 寶琳站 tc

# 查询 A29 在机场的到站时间（英文）
python3 scripts/eta.py A29 Airport en

# 同时查询多条线路
cd scripts && (python3 eta.py A29 機場 tc & python3 eta.py E22A 機場 tc & wait)
```

**输出格式：**
- 每个站点附带 Google Maps 链接
- 按目的地分组，最多显示 3 班车
- 格式：HH:mm (剩余分钟) [运营商]
- 终点站标记 [終點站]

**实用场景：** 在香港通勤时，出门前让 AI 查一下下一班巴士几分钟到，比反复刷手机 App 方便太多。特别适合查机场巴士 A29/E22A 等线路。

---

## 📊 推荐指数排名

| 排名 | Skill | 评分 | 亮点 |
|------|-------|------|------|
| 1 | NYC MTA Transit | ⭐⭐⭐⭐⭐ | 零配置可用、数据最全面 |
| 2 | TfL London Transit | ⭐⭐⭐⭐⭐ | 统一 API 设计优雅、覆盖全伦敦 |
| 3 | HK Bus ETA | ⭐⭐⭐⭐⭐ | 中英双语、智能站点匹配、最接地气 |
| 4 | Deutsche Bahn CLI | ⭐⭐⭐⭐ | 简洁实用、无 API Key 门槛 |
| 5 | AviationStack Flight Tracker | ⭐⭐⭐⭐ | 全球覆盖、输出美观、免费额度够用 |

---

## 🎯 应用场景总结

### 城市通勤
MTA + TfL + HK Bus ETA 三件套覆盖了全球三大金融中心的公共交通查询。住在这些城市或出差前往时，让 AI 成为你的实时出行助手。

### 长途旅行
- **火车**：Deutsche Bahn 搜索欧洲铁路连接
- **飞机**：AviationStack 追踪全球航班状态

### 出行规划模式
```
用户："我明天下午要从伦敦去柏林，帮我查一下路线"
AI → TfL 查询到机场的地铁路线
AI → AviationStack 追踪伦敦→柏林航班状态
AI → DB Bahn 查询柏林到达后的市内列车连接
```

---

## 💡 实用建议

1. **API Key 管理**：MTA 公交、TfL、AviationStack 都需要 API Key，建议统一存放在 OpenClaw 的环境变量中
2. **数据更新**：HK Bus ETA 建议每周日凌晨自动同步一次站点数据库
3. **组合使用**：交通类 Skill 与 [weather](https://clawhub.ai/openclaw/weather) Skill 组合使用，实现"下雨天自动推荐地铁而非公交"的智能出行建议
4. **多语言**：HK Bus ETA 原生支持中英文，适合在飞书中直接使用

---

## 📌 分类概览

交通出行分类共收录 **110 个 Skills**，涵盖：

| 细分领域 | 代表 Skill |
|----------|-----------|
| 城市公交/地铁 | mta, tfl, bvg-route, capmetro-skill, anachb |
| 铁路查询 | bahn, db-travel, french-services (SNCF) |
| 航班追踪 | aviationstack-flight-tracker, flight-tracker, track-flight |
| 路线规划 | camino-route, camino-journey, camino-travel-planner |
| EV 充电 | camino-ev-charger, charger |
| 旅行预订 | travel-agent, flight-search, tixflow |
| 支付与卡片 | creditcard, privacy-cards, stripe |

明天将介绍最后一个分类：**Web 前端开发**，敬请期待！

---

*本文由 OpenClaw 自动生成，每日精选一个 Skill 分类推荐。关注 [www.daoyuly.cn](https://www.daoyuly.cn) 获取更多 OpenClaw 技能推荐。*
