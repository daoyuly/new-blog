---
title: OpenClaw Skill 每日推荐 - 交通出行（transportation）
tags:
  - openclaw
  - skill
  - transportation
categories:
  - 技术推荐
date: 2026-10-30 11:30:00
---

# OpenClaw Skill 每日推荐 - 交通出行

> 「OpenClaw Skill 每日推荐」第 28 期。每天从 [awesome-openclaw-skills](https://github.com/openclaw/skills) 的 30 个分类中取一个，精选代表性 skill 深入介绍。今天是 **交通出行（Transportation）**——也是目前见过的"串门最严重"的一期，但正主们个个能打。

## 今日分类概述

交通出行分类收录 **110 个 skills**，规模不小，但这个分类堪称杂物间重灾区：里面有记账的（accountsos、bookkeeper）、发虚拟信用卡的（privacy-cards、creditcard）、写商业计划的（business-plan）、做简历的（resume-and-cover-letter）、印名片和宣传册的，甚至还有祷告时间表（jadwal-sholat）、哲学人格包（conatus）和改写 agent 灵魂的 NFT（trip-protocol）。剔除这些串门成员后，真正的出行类 skill 大约有 40 个，可以分成四条车道：

- **城市公共交通**：这是最卷的一条道。伦敦的 tfl、纽约的 mta 和 gotrain、芝加哥的 cta 和 metra、奥斯汀的 capmetro-skill、柏林的 bvg-route、慕尼黑的 mvg-cli、全德的 bahn 和 db-travel、奥地利的 anachb、挪威的 entur-travel、巴黎的 idfm-journey-skill、布里斯班的 translink-cli，还有香港的 hk-bus-eta——基本等于一张"全球地铁图"
- **航空出行**：查价的 amadeus-flights、flight-search，盯动态的 track-flight、flight-tracker、aviationstack-flight-tracker、airfrance-afkl（法航-荷航官方 Open Data），还有真金白银帮你下单的 travel-agent
- **路线规划套件**：Camino AI 系列六件套（route / journey / travel-planner / ev-charger / safety-checker / real-estate），加上 personal-travel、ubtrippin 等行程管家
- **电动车**：查充电桩的 charger 和 camino-ev-charger，还有个蹭特斯拉热点的 fsd-secure-skill

这一期的明显趋势：**城市交通数据 API 大多免费开放**，tfl、MTA、港铁巴士这类机构都提供公开实时数据，让 agent 做"出行管家"的门槛低到惊人。下面精选 5 个详解。

## 精选 Skill 详解

### 1. tfl —— 伦敦人的通勤外挂

**链接**：[github.com/openclaw/skills/.../tfl](https://github.com/openclaw/skills/tree/main/skills/brianleach/tfl/SKILL.md)

**核心功能**：接入伦敦交通局（TfL）开放数据，一站式覆盖地铁实时到站、公交预测、线路状态、故障告警和行程规划。不是只查"下一班车几点来"，而是能回答"Piccadilly 线今天是不是又坏了、我该怎么绕"。

**实用场景**：

- 早上出门前问一句："今天坐 Central 线顺不顺？"agent 汇总线路状态和故障告警，给你结论而不是让你去刷官网
- "我 8 点半要到 King's Cross，帮我规划路线"——直接调用 TfL 行程规划，连换乘走路时间都算好
- 定时任务化：每天 7:30 自动推送通勤线路的异常提醒

**技术实现**：基于 TfL 官方 Open Data API（api.tfl.gov.uk），免费注册即可使用，无需付费。数据是 TfL 自己发的，准确度和伦敦地铁站的到站屏一致。

**推荐指数**：★★★★★

> 值得一提的是作者 brianleach 是个"城市交通专业户"：同一套模式还做了纽约 mta、芝加哥 cta / metra、奥斯汀 capmetro-skill，纽约地铁迷还可以看 gotrain。你在哪个城市，就挑哪个的装。

### 2. travel-agent —— 真的会帮你订机票的那种

**链接**：[github.com/openclaw/skills/.../travel-agent](https://github.com/openclaw/skills/tree/main/skills/aszelem/travel-agent/SKILL.md)

**核心功能**：通过邮件替你查找、预订、改签航班。注意这三个动词的分量——不是"帮你查"，是"帮你下单、帮你改签"。这是整个精选里最"agent 原生"的一个：把人类订票时那套反复比价、填乘机人信息、收确认邮件的流程整个接管了。

**实用场景**：

- "帮我订下周三下午去东京的机票，靠窗，价格 3000 以内"——agent 查价、筛选、下单，确认邮件直接落到你邮箱
- 航班取消或改期时，agent 走改签流程，你只需要在关键节点点头确认
- 配合日历 skill：出差日程变动 → 自动触发改签评估

**技术实现**：以邮件为主要交互通道，符合"agent 替人办事"的最小权限模型——所有操作留邮件凭证，可审计、可回溯。

**推荐指数**：★★★★★

> ⚠️ 实用提醒：这个 skill 会产生真实消费。建议给它配支付额度上限和"下单前必须人工确认"的门槛，让它当差旅助理，别当甩手掌柜。

### 3. track-flight —— 接机人的刚需

**链接**：[github.com/openclaw/skills/.../track-flight](https://github.com/openclaw/skills/tree/main/skills/rafaforesightai/track-flight/SKILL.md)

**核心功能**：实时追踪航班，包括详细状态、登机口信息、延误情况和实时位置。同类还有 flight-tracker、aviationstack-flight-tracker、copey-flight-tracker，这个分类里"盯航班"是仅次于"查地铁"的拥挤赛道。

**实用场景**：

- 接机："帮我盯着 MU583，落地前 40 分钟提醒我出门"——比反复刷航旅纵横省心
- 自家行程：起飞前自动汇总登机口、延误、取消风险，延误超阈值主动推送
- 接送客户：把客户航班号丢给 agent，落地动态全程同步

**技术实现**：接入实时航班数据源（ AviationStack / OpenSky 一类公开 API），覆盖航班状态、登机口与航迹数据；具体数据源以仓库内 SKILL.md 为准。

**推荐指数**：★★★★☆

### 4. hk-bus-eta —— 中文用户的本地化样本

**链接**：[github.com/openclaw/skills/.../hk-bus-eta](https://github.com/openclaw/skills/tree/main/skills/tomfong/hk-bus-eta/SKILL.md)

**核心功能**：查询香港九巴（KMB）、龍運（LWB）、城巴（Citybus）三大巴士公司的实时到站预测。作者是中文开发者，对路线命名、站点搜索做了本地化处理，问"下一班 900 何时到"和问"将军澳地铁站往坑口方向"都能对上号。

**实用场景**：

- "966 往我这边最近一班几点到？"——通勤等车前的三秒钟决策
- 巴士改道、脱班时 agent 主动对比备选路线
- 对港漂、跨境通勤族：早高峰前批量查询常坐线路，异常时才打扰你

**技术实现**：基于香港巴士公司公开的实时 ETA API（九巴/城巴均提供开放数据接口），免费使用。数据就是站牌电子屏上那份，可信度高。

**推荐指数**：★★★★☆

### 5. camino-ev-charger —— 电动车长途的里程焦虑解药

**链接**：[github.com/openclaw/skills/.../camino-ev-charger](https://github.com/openclaw/skills/tree/main/skills/james-southendsolutions/camino-ev-charger/SKILL.md)

**核心功能**：用 Camino AI 的位置智能服务，沿路线查找 EV 充电站，或查目的地附近的桩位。重点在"沿路线"三个字——不是查"附近充电桩"，而是结合你的行驶路径规划补能点。

**实用场景**：

- 长途前："我从深圳开到桂林，每 2 小时报一次沿途快充站"——把补能点先排进行程
- 目的地不确定："酒店附近 3 公里内有几个快充？"顺手评估住宿选择
- 配合同系列的 camino-route（两点间路线与耗时）和 camino-journey（多途经点优化）组成自驾全家桶

**技术实现**：调用 Camino AI 的位置智能 API；同门六个 skill（route / journey / travel-planner / ev-charger / safety-checker / real-estate）共享底层地理数据，适合搭配安装。

**推荐指数**：★★★★☆

> 同系列还有个 camino-safety-checker（查夜间照明、警局、医院分布），单独开车走夜路的场景下值得一并开启。

## 应用场景总结

| 场景 | 组合方案 |
| --- | --- |
| 日常通勤 | tfl / mta / hk-bus-eta 等城市 transit skill + 定时任务：出门前推送线路异常 |
| 商务差旅 | travel-agent 订票 + track-flight 盯航班 + 日历 skill 联动改签 |
| 接送机 | track-flight：落地倒计时自动提醒出发 |
| 电动车自驾 | camino-route 排路线 + camino-ev-charger 找补能点 |
| 城市漫游 | camino-travel-planner 按时间预算排步行路线 |

## 推荐指数排名

| 排名 | Skill | 推荐指数 | 一句话点评 |
| --- | --- | --- | --- |
| 1 | tfl | ★★★★★ | 官方数据源 + 全功能覆盖，城市 transit 类的标杆 |
| 2 | travel-agent | ★★★★★ | 最 agent 原生：查、订、改签一条龙，但记得加支付护栏 |
| 3 | track-flight | ★★★★☆ | 接机刚需，登机口/延误/实时位置齐活 |
| 4 | hk-bus-eta | ★★★★☆ | 中文本地化到位，港人港漂都好用 |
| 5 | camino-ev-charger | ★★★★☆ | "沿路线找充电桩"切中电动车长途痛点 |

## 实用建议

1. **按城市挑 transit skill，别全装**。brianleach 的 tfl / mta / cta / metra / capmetro-skill 是同一套模式的多城市复刻，装你所在城市的那一个就够，多装只会稀释 agent 的路由判断。
2. **免费 API 是这类的最大红利**。TfL、MTA、香港巴士、挪威 Entur 都开放免费实时数据，装好即用；需要 API key 的（如 Amadeus 航班查询）注册个免费档也够个人用。
3. **涉及下单的 skill 必须设护栏**。travel-agent 这类会真实消费的 skill，务必配额度上限 + 人工确认门槛；agent 的权限越大，护栏越要硬。
4. **出行类 skill 天生适合配 cron**。"每天 7:30 报通勤路况"、"起飞前 3 小时播报航班状态"这类固定节拍任务，比每次手动问价值大得多。

---

*本期是第 28 期。明天进入第 29 期 **web-and-frontend-development（Web 前端开发）**——整个系列倒数第二期，敬请期待。*
