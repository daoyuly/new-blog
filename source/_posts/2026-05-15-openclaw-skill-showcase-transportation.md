---
title: OpenClaw Skill 每日推荐 - 交通出行 (Transportation)
date: 2026-05-15 11:30:00
tags:
  - openclaw
  - skill
  - transportation
  - 交通出行
categories:
  - 技术推荐
---

# 🚀 OpenClaw Skill 每日推荐 — 交通出行 (Transportation)

> 今日分类共收录 **110 个 Skills**，覆盖航班搜索、公交地铁实时追踪、行程规划、充电桩定位等出行全场景。

## 📋 分类概述

交通出行是 OpenClaw 生态中最实用的分类之一。无论你是在伦敦地铁里赶路、纽约地铁上看延误信息，还是规划一场巴黎徒步旅行、搜索便宜的机票，这些 Skill 都能让你的 AI 助手变成一个强大的出行管家。

这个分类的特点是**地域性强**——大量 Skill 针对特定城市或国家的交通系统做了深度适配，从伦敦 TfL、纽约 MTA 到香港巴士、德国铁路、法国 SNCF，几乎覆盖了全球主要城市。

---

## ⭐ 精选 Skill 详解

### 1. 🚇 TfL London Transit — 伦敦交通全掌握

- **GitHub**: [brianleach/tfl-skill](https://github.com/brianleach/tfl-skill)
- **推荐指数**: ⭐⭐⭐⭐⭐

**核心功能**：

伦敦 TfL（Transport for London）实时数据查询——地铁到站时间、公交线路预测、线路状态、服务中断信息、行程规划，一站式覆盖地铁、公交、DLR、地上铁、Elizabeth 线、有轨电车等所有 TfL 运营线路。

**实用场景**：

- 早高峰出门前问一句「Northern Line 现在正常吗？」，立即获取线路状态
- 在 King's Cross 问「下一班去 Waterloo 的地铁还有几分钟」
- 自动规划从 A 到 B 的路线，包含票价估算

**技术实现**：

- 基于 TfL 统一 REST API (`api.tfl.gov.uk`)，所有交通方式使用同一个 API，返回统一 JSON 格式
- **API Key 可选**——无 Key 也能用（有速率限制），注册免费 Key 后可达 500 请求/分钟
- Node.js 脚本实现，支持 `status`、`arrivals`、`bus-arrivals`、`disruptions`、`journey` 等子命令

```bash
# 查看所有地铁线路状态
node scripts/tfl.mjs status

# 查看 Oxford Circus 站的实时到站
node scripts/tfl.mjs arrivals --station "Oxford Circus"

# 规划从 Waterloo 到 King's Cross 的行程
node scripts/tfl.mjs journey --from "waterloo" --to "kings cross"
```

**亮点**：零配置可用，内置票价参考表，输出格式清晰直观（带线路颜色 emoji）。

---

### 2. 🚇 NYC MTA Transit — 纽约地铁公交实时追踪

- **GitHub**: [brianleach/mta-skill](https://github.com/brianleach/mta-skill)
- **推荐指数**: ⭐⭐⭐⭐⭐

**核心功能**：

纽约市 MTA 实时数据——地铁到站（GTFS-RT Protobuf）、公交预测（SIRI JSON API）、服务警报、路线信息。覆盖纽约地铁全部 26 条线路和公交系统。

**实用场景**：

- 「下一班去 Grand Central 的 4 号线还有多久？」
- 周末查看计划停运信息，避免白跑一趟
- 查找附近公交站的 M15 下一班车

**技术实现**：

- **地铁数据零配置**：使用 GTFS-RT Protobuf 实时数据源，无需 API Key
- **公交数据需免费 Key**：通过 MTA BusTime SIRI API，注册即可获取
- 包含 GTFS 静态数据本地缓存，首次使用自动下载到 `~/.mta/gtfs/`
- 支持 Protobuf 解析，包含 NYCT 扩展字段（方向、轨道信息）

```bash
# 搜索 Times Square 站的地铁到站信息
node scripts/mta.mjs arrivals --stop-search "times square"

# 查看 A 线服务警报
node scripts/mta.mjs alerts --line A

# 查看某条公交线路的车辆位置
node scripts/mta.mjs bus-vehicles --route B52
```

**亮点**：地铁数据完全开放（无需 Key），每 30 秒更新，是纽约通勤者的必备 Skill。

---

### 3. ✈️ Flight Search — Google Flights 命令行搜索

- **GitHub**: [Olafs-World/flight-search](https://github.com/Olafs-World/flight-search)
- **推荐指数**: ⭐⭐⭐⭐⭐

**核心功能**：

从命令行搜索 Google Flights，获取机票价格、航班时间、航空公司信息。**无需 API Key**，开箱即用。

**实用场景**：

- 快速比价：「帮我查一下 6 月 15 号 JFK 到 LHR 的航班」
- 设置价格监控提醒
- 找到特定航线的最便宜日期

**技术实现**：

- 基于 [fast-flights](https://github.com/AWeirdDev/flights) 库，抓取 Google Flights 数据
- 使用 `uvx` 运行，无需安装（`uvx flight-search DEN LAX --date 2026-03-01`）
- 支持单程/往返、成人/儿童、经济/商务/头等舱筛选
- 输出格式支持 text 和 JSON（便于程序化处理）

```bash
# 单程搜索
uvx flight-search DEN LAX --date 2026-03-01

# 往返商务舱
uvx flight-search JFK LHR --date 2026-06-15 --return 2026-06-22 --class business

# JSON 输出，方便二次处理
uvx flight-search SFO NRT --date 2026-04-01 --output json
```

**示例输出**：

```
✈️  DEN → LAX
   One way · 2026-03-01

   Frontier ⭐ BEST
   🕐 10:43 PM → 12:30 AM +1
   ⏱️  2 hr 47 min
   ✅ Nonstop
   💰 $84
```

**亮点**：零配置、零 API Key、直接可用，输出格式优美且实用。

---

### 4. ✈️ Camino Travel Planner — AI 行程规划

- **GitHub**: [james-southendsolutions/camino-travel-planner](https://github.com/openclaw/skills/tree/main/skills/james-southendsolutions/camino-travel-planner/SKILL.md)
- **推荐指数**: ⭐⭐⭐⭐

**核心功能**：

使用 Camino AI 规划完整的单日游、步行游览、多站行程。支持步行、骑行、驾车三种交通方式，并提供时间预算约束和可行性分析。

**实用场景**：

- 「帮我规划一个巴黎 6 小时步行游览路线，要经过埃菲尔铁塔、卢浮宫、圣母院和圣心大教堂」
- 「安排一个旧金山半日骑行路线」
- 商务出行时规划多个会议地点间的最优路线

**技术实现**：

- 基于 Camino AI 的 Journey API，支持经纬度 + 目的描述的航点输入
- 返回可行性分析、总距离、总时间、路线分段详情
- **免费试用**：无需注册即可获得 25 次调用；注册后每月 1000 次免费
- 可与同系列 Skill（route、hotel-finder、ev-charger、safety-checker 等）联动

```bash
# 巴黎步行游览
./scripts/travel-planner.sh '{
  "waypoints": [
    {"lat": 48.8584, "lon": 2.2945, "purpose": "Eiffel Tower"},
    {"lat": 48.8606, "lon": 2.3376, "purpose": "Louvre Museum"},
    {"lat": 48.8530, "lon": 2.3499, "purpose": "Notre-Dame"}
  ],
  "constraints": {"transport": "foot", "time_budget": "6 hours"}
}'
```

**亮点**：不仅能规划路线，还会给出可行性判断和优化建议（如「建议从卢浮宫出发以减少折返」）。

---

### 5. 🚌 HK Bus ETA — 香港巴士实时到站

- **GitHub**: [tomfong/hk-bus-eta](https://github.com/openclaw/skills/tree/main/skills/tomfong/hk-bus-eta/SKILL.md)
- **推荐指数**: ⭐⭐⭐⭐

**核心功能**：

香港巴士实时到站时间查询，支持九巴 (KMB)、龙运 (LWB)、城巴 (CTB) 及联营线路。

**实用场景**：

- 在宝琳站等 A29，问一句「A29 下一班几时到？」
- 在尖沙咀找 1A 巴士站
- 查询机场巴士 A41P 的到站时间

**技术实现**：

- Python 实现，首次使用自动下载并建立 SQLite 本地数据库 (`bus_stops.db`)
- **智能站点匹配**：50 米内同名/近名站点自动合并
- **联营线智能合并**：不同公司对同一目的地的不同称呼会智能归并
- **终点站标记**：落客站自动标注 `[終點站]`，提醒用户只供落客
- 建议每 7 天同步一次数据库

```bash
# 查询 A29 在宝琳站的到站时间
python3 scripts/eta.py A29 寶琳站

# 查询 1A 在尖沙咀的站点
python3 scripts/eta.py 1A 尖沙咀

# 查询机场巴士
python3 scripts/eta.py A41P 機場
```

**亮点**：中文原生支持、智能地点联想、坐标聚合，非常适合香港本地使用。

---

## 📊 推荐指数排名

| 排名 | Skill | 推荐指数 | 亮点 |
|:---:|-------|:---:|------|
| 1 | Flight Search | ⭐⭐⭐⭐⭐ | 零配置搜索 Google Flights，无需 API Key |
| 2 | TfL London Transit | ⭐⭐⭐⭐⭐ | 伦敦交通全覆盖，API Key 可选 |
| 3 | NYC MTA Transit | ⭐⭐⭐⭐⭐ | 纽约地铁零配置，实时 Protobuf 数据 |
| 4 | Camino Travel Planner | ⭐⭐⭐⭐ | AI 行程规划 + 可行性分析 |
| 5 | HK Bus ETA | ⭐⭐⭐⭐ | 香港巴士实时追踪，中文原生 |

---

## 🎯 应用场景总结

### 日常通勤
如果你在伦敦或纽约，TfL 和 MTA Skill 是绝对的刚需。每天出门前问一句线路状态，通勤效率直接拉满。

### 商务出行
Flight Search + Camino Travel Planner 的组合堪称出差神器——先搜航班，再规划目的地行程，全程 AI 代劳。

### 旅行规划
Camino 系列还有充电桩查找（ev-charger）、安全区域检查（safety-checker）、酒店搜索（hotel-finder）等配套 Skill，可以组成完整的旅行规划工具链。

### 城市生活
香港的巴士 ETA、奥斯陆的公共交通查询、慕尼黑的 MVG——每个城市都有专门的交通 Skill，让 AI 助手成为你的本地出行百事通。

---

## 💡 实用建议

1. **优先安装本地交通 Skill**：如果你常驻某个城市，优先安装对应的城市交通 Skill，把它加入日常使用
2. **Flight Search 是旅行必备**：零配置 + 零 API Key，出发前随手一搜就能找到最便宜机票
3. **Camino 系列建议全套安装**：多个 Skill 之间可以联动，效果远大于单用
4. **关注 API Key 免费额度**：大多数交通 Skill 都有免费额度或完全开放，但要注意速率限制

---

*这是 OpenClaw Skill 每日推荐系列的第 28 篇。明天我们将介绍 **Web 前端开发 (Web and Frontend Development)** 分类，敬请期待！*
