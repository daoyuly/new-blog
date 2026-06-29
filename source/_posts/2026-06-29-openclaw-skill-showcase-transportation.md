---
title: OpenClaw Skill 每日推荐 - 交通出行
date: 2026-06-29 11:30:00
tags:
  - openclaw
  - skill
  - transportation
categories:
  - 技术推荐
---

# 🚀 OpenClaw Skill 每日推荐 — 交通出行（Transportation）

> 第 29 期 | 共 30 个分类 | 本分类包含 **110 个 Skills**

交通出行是 OpenClaw 生态中最接地气的分类之一。从查航班、坐地铁、找充电桩到规划旅行路线，这些 Skill 让你的 AI 助手秒变出行管家。今天精选 5 个最具代表性的 Skill，覆盖航空、公共交通和旅行规划三大场景。

---

## ✈️ 精选 Skill 详解

### 1. Amadeus Flights

- **GitHub**: [kirorab/amadeus-flights](https://github.com/openclaw/skills/tree/main/skills/kirorab/amadeus-flights/SKILL.md)
- **推荐指数**: ⭐⭐⭐⭐⭐

**核心功能**: 通过 Amadeus API 查询航班价格、时刻表和座位可用性。Amadeus 是全球最大的航空 GDS 之一，数据覆盖 400+ 航空公司。

**实用场景**:
- "帮我查一下下周北京到东京的机票，最便宜的"
- 比较不同日期的价格波动，找到最佳购买时机
- 查看特定航线的航班时刻和舱位余量

**技术实现**: 封装 Amadeus Flight Offers Search API，需要申请 Amadeus 开发者密钥（免费沙盒可用）。支持出发/到达/日期/乘客数等查询参数。

---

### 2. TfL (London Transport)

- **GitHub**: [brianleach/tfl](https://github.com/openclaw/skills/tree/main/skills/brianleach/tfl/SKILL.md)
- **推荐指数**: ⭐⭐⭐⭐⭐

**核心功能**: 伦敦交通实时信息 — 地铁到站时间、公交预测、线路状态、服务中断提醒、路线规划，一站式覆盖。

**实用场景**:
- "Northern Line 现在正常运行吗？"
- "从 King's Cross 到 Heathrow 怎么走最快？"
- 早上出门前问一声，避开线路故障和延误

**技术实现**: 基于 TfL Unified API，提供实时数据。同一作者还开发了 [MTA (纽约)](https://github.com/openclaw/skills/tree/main/skills/brianleach/mta/SKILL.md)、[CTA (芝加哥)](https://clawhub.ai/brianleach/cta) 和 [Metra (芝加哥通勤铁路)](https://github.com/openclaw/skills/tree/main/skills/brianleach/metra/SKILL.md) 系列 Skill，堪称公共交通 Skill 专业户。

---

### 3. HK Bus ETA 🇭🇰

- **GitHub**: [tomfong/hk-bus-eta](https://github.com/openclaw/skills/tree/main/skills/tomfong/hk-bus-eta/SKILL.md)
- **推荐指数**: ⭐⭐⭐⭐

**核心功能**: 香港巴士实时到站预测，支持九巴（KMB）、龙运（LWB）和城巴（Citybus）。

**实用场景**:
- "下一班 104 号巴士几时到？"
- 在香港街头不用掏手机 App，直接问 AI 助手
- 多条线路对比，选择最快到站的方案

**技术实现**: 对接香港巴士实时数据 API，轻量级实现，无需复杂配置。对香港用户特别友好。

---

### 4. Bahn (德国铁路)

- **GitHub**: [tobiasbischoff/bahn](https://github.com/openclaw/skills/tree/main/skills/tobiasbischoff/bahn/SKILL.md)
- **推荐指数**: ⭐⭐⭐⭐

**核心功能**: 使用 `bahn-cli` 工具搜索德铁（Deutsche Bahn）列车连接，查询时刻表和票价。

**实用场景**:
- "柏林到慕尼黑的 ICE 几点出发？"
- 查询德铁延误信息和替代路线
- 欧洲跨国火车旅行规划

**技术实现**: 基于 `bahn-cli` 命令行工具，调用 DB API。同类 Skill 还有 [db-travel](https://github.com/openclaw/skills/tree/main/skills/mmichelli/db-travel/SKILL.md)（使用 v6.db.transport.rest API），更适合偏好 REST API 的开发者。

---

### 5. Camino Travel Planner

- **GitHub**: [james-southendsolutions/camino-travel-planner](https://github.com/openclaw/skills/tree/main/skills/james-southendsolutions/camino-travel-planner/SKILL.md)
- **推荐指数**: ⭐⭐⭐⭐⭐

**核心功能**: 使用 Camino AI 规划完整的单日行程、步行游览和多站路线，带时间预算约束。

**实用场景**:
- "帮我规划东京一日游，8 个小时，想去浅草寺、秋叶原和涩谷"
- 步行游览路线优化，自动计算步行时间和交通衔接
- 多目的地时间分配，确保不超时

**技术实现**: Camino AI 系列 Skill 是本分类中最完整的出行工具链，同一作者还开发了：
- [camino-route](https://github.com/openclaw/skills/tree/main/skills/james-southendsolutions/camino-route/SKILL.md) — 点对点路线规划
- [camino-ev-charger](https://github.com/openclaw/skills/tree/main/skills/james-southendsolutions/camino-ev-charger/SKILL.md) — 沿途找充电桩
- [camino-safety-checker](https://github.com/openclaw/skills/tree/main/skills/james-southendsolutions/camino-safety-checker/SKILL.md) — 周边安全设施查询

---

## 📊 推荐指数排名

| 排名 | Skill | 推荐指数 | 亮点 |
|:---:|-------|:---:|------|
| 1 | Camino Travel Planner | ⭐⭐⭐⭐⭐ | 最完整的 AI 旅行规划工具链 |
| 2 | Amadeus Flights | ⭐⭐⭐⭐⭐ | 全球航空数据，专业级航班查询 |
| 3 | TfL | ⭐⭐⭐⭐⭐ | 伦敦交通全覆盖，实时数据 |
| 4 | HK Bus ETA | ⭐⭐⭐⭐ | 华语地区首选，实用接地气 |
| 5 | Bahn | ⭐⭐⭐⭐ | 欧洲铁路出行必备 |

---

## 🌍 应用场景总结

交通出行分类的 110 个 Skill 可归纳为四大场景：

**1. 航班追踪与预订** — Amadeus Flights、Air France-KLM、Flight Tracker 等，覆盖从搜索到追踪的全流程。AI 助手可以主动推送延误提醒，比手动查 App 更省心。

**2. 城市公共交通** — TfL（伦敦）、MTA（纽约）、BVG（柏林）、MVG（慕尼黑）、CTA（芝加哥）、CapMetro（奥斯汀）、HK Bus（香港）、Entur（挪威）等，基本覆盖了全球主要城市的公交系统。出门问一声 AI，比开 App 快。

**3. 旅行路线规划** — Camino 系列最为突出，从路线规划到安全检查到充电桩查找，一条龙服务。适合自驾游和深度旅行。

**4. 电动出行** — EV 充电桩查找（Charger、Camino EV Charger）是新兴方向，随着电动车普及，这类 Skill 会越来越重要。

---

## 💡 实用建议

1. **组合使用效果更佳** — 航班查询 + 机场到酒店路线 + 当地公交，组成完整的出行链
2. **关注 API 密钥** — 大部分 Skill 需要配置对应的 API Key，提前申请避免临时抓瞎
3. **优先选实时数据 Skill** — 交通信息时效性强，实时 API 比静态数据实用得多
4. **Camino 系列值得深挖** — 如果你经常自驾或旅行规划，Camino 全家桶是最佳选择

---

*明天是本系列的最后一期 — Web 前端开发分类，敬请期待！*

---

> 🎋 本文由 OpenClaw Skill 每日推荐系统自动生成 | [OpenClaw 官网](https://docs.openclaw.ai) | [ClawHub Skills 市场](https://clawhub.com)
