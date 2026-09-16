---
title: OpenClaw Skill 每日推荐 - 交通出行
date: 2026-09-16 11:30:00
tags:
  - openclaw
  - skill
  - transportation
  - 交通出行
categories:
  - 技术推荐
---

# OpenClaw Skill 每日推荐 - 交通出行 🚗✈️🚇

> 第 29/30 期 · 2026-09-16
> 今日分类：**Transportation（交通出行）** · 共 110 个 Skills

## 📋 今日分类概述

交通出行是 OpenClaw 生态中数量最多、覆盖面最广的分类之一，包含 **110 个 Skills**。从航班搜索到地铁实时到站，从 EV 充电桩定位到跨城火车规划，这个分类几乎涵盖了现代出行的所有场景。

值得注意的是，交通类 Skills 呈现出明显的地域分布特征：

| 地区 | 代表 Skills | 数据源 |
|------|------------|--------|
| 🇺🇸 美国 | MTA、Metra、CTA、CapMetro | GTFS-RT / SIRI API |
| 🇬🇧 英国 | TfL | TfL Unified REST API |
| 🇭🇰 香港 | HK Bus ETA | DATA.GOV.HK |
| 🇩🇪 德国 | Bahn、DB Travel | bahn-cli / DB API |
| 🇦🇹 奥地利 | AnachB | VOR AnachB API |
| 🇳🇴 挪威 | Entur Travel | Entur API |
| 🇫🇷 法国 | French Services、IDFM | SNCF / Navitia API |
| 🌍 全球 | Flight Search、Camino | Google Flights / OSM |

---

## 🏆 精选 Skill 详解

### 1. Flight Search — Google 航班搜索利器 ⭐⭐⭐⭐⭐

**作者：** [awlevin](https://clawhub.ai/awlevin/skills/flight-search)
**GitHub：** [Olafs-World/flight-search](https://github.com/Olafs-World/flight-search)

#### 核心功能

基于 Google Flights 数据的命令行航班搜索工具，**无需 API Key** 即可使用。支持单程/往返搜索、多乘客、舱位选择，输出格式支持纯文本和 JSON。

#### 实用场景

```bash
# 搜索北京到洛杉矶的单程航班
flight-search PEK LAX --date 2026-10-01

# 往返商务舱
flight-search JFK LHR --date 2026-12-20 --return 2027-01-05 --class business

# JSON 输出，方便 Agent 解析
flight-search SFO NRT --date 2026-11-01 --output json
```

#### 技术实现

- 基于 Python 包 `fast-flights`，通过模拟 Google Flights 页面抓取数据
- 使用 `uvx` 实现零安装运行（`uvx flight-search DEN LAX --date 2026-03-01`）
- 输出包含航空公司、起降时间、飞行时长、经停次数、价格、是否为最优推荐

#### 推荐指数：⭐⭐⭐⭐⭐

> **亮点：** 零配置开箱即用，JSON 输出完美适配 Agent 调用，覆盖全球航线。对于需要商旅规划的用户来说是最实用的 Skill 之一。

---

### 2. TfL London Transit — 伦敦公共交通实时数据 ⭐⭐⭐⭐⭐

**作者：** [brianleach](https://clawhub.ai/brianleach/skills/tfl)
**链接：** [clawhub.ai/brianleach/tfl](https://clawhub.ai/brianleach/skills/tfl)

#### 核心功能

伦敦交通局（TfL）全模式实时数据查询，覆盖地铁（Tube）、公交（Bus）、DLR、Overground、Elizabeth Line、有轨电车、水上巴士和缆车。

#### 实用场景

```bash
# 维多利亚线状态
node scripts/tfl.mjs status --line victoria

# Oxford Circus 站下一班车
node scripts/tfl.mjs arrivals --station "Oxford Circus"

# 规划从 Waterloo 到 King's Cross 的路线
node scripts/tfl.mjs journey --from "waterloo" --to "kings cross"

# 查找附近站点
node scripts/tfl.mjs stops --near 51.5074,-0.1278 --radius 500

# 北线服务中断信息
node scripts/tfl.mjs disruptions --line northern
```

#### 技术实现

- 基于 TfL 统一 REST API（`api.tfl.gov.uk`），所有交通模式共用一套 JSON 接口
- **无需 API Key** 即可基本使用（有速率限制），注册免费 Key 后可达 500 请求/分钟
- Node.js 实现（`tfl.mjs`），支持线路状态、到站时间、公交预测、路线规划、站点搜索、中断信息等全功能
- 内置伦敦所有地铁线路参考表（11 条线路，含 Emoji 和首末站信息）

#### 推荐指数：⭐⭐⭐⭐⭐

> **亮点：** 数据源设计优雅（单一 REST API 覆盖所有模式），文档详尽，零配置可用。是城市公交数据集成的优秀范例。

---

### 3. NYC MTA Transit — 纽约地铁公交实时追踪 ⭐⭐⭐⭐

**作者：** [brianleach](https://clawhub.ai/brianleach/skills/mta)
**链接：** [clawhub.ai/brianleach/mta](https://clawhub.ai/brianleach/skills/mta)

#### 核心功能

纽约大都会运输署（MTA）实时数据查询，支持地铁到站预测、公交追踪、服务警报和路线信息。

#### 实用场景

```bash
# 时代广场下一班地铁
node scripts/mta.mjs arrivals --stop-search "times square"

# 查询 A 车在 Penn Station 的到站
node scripts/mta.mjs arrivals --stop-search "penn station" --line A

# 公交到站（需要 MTA_BUS_API_KEY）
node scripts/mta.mjs bus-arrivals --stop MTA_308209 --route M1

# 地铁服务警报
node scripts/mta.mjs alerts --subway
node scripts/mta.mjs alerts --line A

# 查找附近地铁站的站点
node scripts/mta.mjs stops --near 40.7484,-73.9856
```

#### 技术实现

- 地铁数据使用 **GTFS-RT Protobuf** 格式，按线路分组（1-7、A/C/E、B/D/F/M 等 8 个 Feed）
- 公交数据使用 **SIRI JSON API**，需免费注册 API Key
- 服务警报同样基于 GTFS-RT Protobuf，无需 Key
- 数据每 30 秒更新一次
- 支持 GTFS 静态数据下载（首次使用需 `refresh-gtfs` 初始化）

#### 与 TfL 的对比

| 特性 | TfL | MTA |
|------|-----|-----|
| API 风格 | 统一 REST JSON | 多格式（Protobuf + SIRI） |
| Key 要求 | 可选 | 地铁不需要，公交需要 |
| 数据更新 | 实时 | 30 秒 |
| 复杂度 | 低 | 中（需处理 Protobuf） |

#### 推荐指数：⭐⭐⭐⭐

> **亮点：** 覆盖全美最大公交系统，地铁数据零配置可用。Protobuf 处理增加了复杂度，但也意味着数据更紧凑、更新更快。

---

### 4. HK Bus ETA — 香港巴士实时到站 ⭐⭐⭐⭐⭐

**作者：** [tomfong](https://clawhub.ai/tomfong/skills/hk-bus-eta)
**链接：** [clawhub.ai/tomfong/skills/hk-bus-eta](https://clawhub.ai/tomfong/skills/hk-bus-eta)

#### 核心功能

香港巴士实时到站时间查询，支持九巴（KMB）、龙运（LWB）、城巴（Citybus）及联营线路。

#### 实用场景

```bash
# 查询 A29 在宝琳站的下一班车（中文）
python3 scripts/eta.py A29 寶琳站 tc

# 查询 A29 在机场的到站（英文）
python3 scripts/eta.py A29 Airport en

# 同时查询多条线路（并行抓取）
cd scripts && (python3 eta.py A29 機場 tc & python3 eta.py E22A 機場 tc & wait)
```

#### 技术实现

- 数据源：香港政府数据开放平台 `data.etabus.gov.hk` 和 `rt.data.gov.hk`
- **本地 SQLite 数据库**：首次运行 `sync_bus_stops.py` 从 DATA.GOV.HK 下载站点数据并建立本地索引（1-2 分钟），后续查询秒级响应
- **并行 API 抓取**：使用 `ThreadPoolExecutor` 并行获取多条线路 ETA，多线路查询仅需 2-3 秒
- **智能站名匹配**：支持模糊搜索，50 米内同名站点自动合并，联营线目的地智能合并
- 每条结果附带 Google Maps 链接
- 支持繁体中文和英文双语输出

#### 输出格式示例

```
🚌 A29 · 寶琳站 → 機場
───────────────────────────
往 機場 (Ground Transportation Centre)
  14:32 (8 min) [KMB]
  14:52 (28 min) [KMB]
  15:12 (48 min) [KMB]
```

#### 推荐指数：⭐⭐⭐⭐⭐

> **亮点：** 本地数据库 + 并行抓取的设计非常高效。多运营商统一接口、模糊匹配、双语支持，细节做得很到位。是亚洲地区公交 Skill 的标杆。

---

### 5. Camino EV Charger — EV 充电桩智能定位 ⭐⭐⭐⭐

**作者：** [james-southendsolutions](https://clawhub.ai/james-southendsolutions/skills/camino-ev-charger)
**链接：** [clawhub.ai/james-southendsolutions/skills/camino-ev-charger](https://clawhub.ai/james-southendsolutions/skills/camino-ev-charger)

#### 核心功能

基于 Camino AI 位置智能平台的 EV 充电桩搜索，支持沿路线搜索、按品牌筛选（Tesla Supercharger、ChargePoint 等）、AI 排序。

#### 实用场景

```bash
# 查找坐标附近的充电桩
./scripts/ev-charger.sh '{"lat": 34.0522, "lon": -118.2437, "radius": 5000}'

# 搜索 Tesla 超级充电站
./scripts/ev-charger.sh '{"query": "Tesla Supercharger", "lat": 37.3861, "lon": -122.0839}'

# 在城市区域搜索
./scripts/ev-charger.sh '{"query": "EV charging stations near downtown Denver", "radius": 3000}'

# 沿高速搜索充电桩（公路旅行）
./scripts/ev-charger.sh '{"query": "EV charging near Interstate 5", "lat": 34.0522, "lon": -118.2437, "radius": 10000}'
```

#### 技术实现

- 数据源：OpenStreetMap 充电基础设施数据 + Camino AI 排序引擎
- **API Key 必需**：在 [app.getcamino.ai](https://app.getcamino.ai/skills/activate) 注册，每月 100 次免费调用
- 也支持 **x402 协议** 付费按需调用（$0.001/次，USDC on Base），适合原生支持 x402 的 Agent
- 返回 JSON 格式，包含名称、坐标、距离、相关性评分、地址
- 属于 Camino 位置智能套件的一部分（共 14 个配套 Skills）

#### Camino 套件协同

```bash
# 路线规划 + 充电桩 = 完整电动出行
camino-route      # 规划 A 到 B 的路线
camino-ev-charger # 沿途搜索充电桩
camino-relationship # 计算充电桩到目的地的距离
camino-travel-planner # 整合为完整行程
```

#### 推荐指数：⭐⭐⭐⭐

> **亮点：** 填补了 EV 出行的关键缺口。与 Camino 套件的其他 Skills 协同能力强，适合构建完整的电动出行规划工作流。需要 API Key 是一个小门槛。

---

## 📊 推荐指数排名

| 排名 | Skill | 评分 | 核心优势 |
|------|-------|------|---------|
| 🥇 | Flight Search | ⭐⭐⭐⭐⭐ | 零配置、全球覆盖、JSON 输出 |
| 🥇 | TfL London Transit | ⭐⭐⭐⭐⭐ | 统一 API、全模式覆盖、文档优秀 |
| 🥇 | HK Bus ETA | ⭐⭐⭐⭐⭐ | 本地数据库、并行抓取、双语支持 |
| 🥈 | NYC MTA Transit | ⭐⭐⭐⭐ | 覆盖最大公交系统、Protobuf 高效 |
| 🥈 | Camino EV Charger | ⭐⭐⭐⭐ | 填补 EV 出行缺口、套件协同强 |

---

## 🎯 应用场景总结

### 场景一：商旅规划

> "下周三去伦敦出差，帮我查航班和当地交通"

- `flight-search` 搜索最优航班
- `tfl` 规划机场到酒店的地铁路线
- `tfl disruptions` 检查当日线路是否正常

### 场景二：日常通勤

> "A 车现在什么情况？时代广场下一班什么时候到？"

- `mta alerts --line A` 检查服务状态
- `mta arrivals --stop-search "times square"` 查询实时到站

### 场景三：EV 公路旅行

> "从洛杉矶到旧金山，沿途哪里可以充电？"

- `camino-route` 规划路线
- `camino-ev-charger` 沿途搜索充电桩
- `camino-travel-planner` 整合为完整行程

### 场景四：多城市出行

> "香港机场到市区，坐哪条巴士线最快？"

- `hk-bus-eta` 并行查询 A29 和 E22A 在机场的到站时间
- 本地数据库秒级响应，无需等待网络

---

## 💡 实用建议

1. **优先安装零配置 Skills**：Flight Search 和 TfL 不需要任何 Key，装上就能用
2. **公交类 Skill 注意数据格式**：GTFS-RT（MTA/Metra）是 Protobuf 二进制格式，TfL 是 JSON，后者更易于调试
3. **地域性 Skill 的价值**：如果你住在对应城市，这些 Skill 是日常刚需；即使不在，也可以作为学习公交数据集成的范例
4. **Camino 套件建议整体安装**：14 个 Skills 互相协同，单独使用 EV Charger 效果有限
5. **定期更新静态数据**：MTA 和 Metra 的 GTFS 静态数据需要定期 `refresh-gtfs`，否则站点信息可能过时

---

## 🔮 明日预告

明天是本系列的最后一期：**Web 前端开发** 分类。作为 30 天旅程的收官，我们将看到前端开发领域的精彩 Skills。

> 📅 第 30/30 期 · 2026-09-17 · web-and-frontend-development

---

*本文是 OpenClaw Skill 每日推荐系列的第 29 期。系列目标是在 30 天内遍历 OpenClaw 生态全部 30 个分类，每日精选介绍。*
