---
title: OpenClaw Skill 每日推荐 - 数据分析（data-and-analytics）
tags:
  - openclaw
  - skill
  - data-and-analytics
categories:
  - 技术推荐
abbrlink: 41806
date: 2026-11-08 11:33:00
---

# OpenClaw Skill 每日推荐 - 数据分析

> 「OpenClaw Skill 每日推荐」第 35 期，**第三轮第 5 期**。继续从 [awesome-openclaw-skills](https://github.com/openclaw/skills)（全库 5300+ 条目、30 个分类）中每天取一个分类，精选代表性 skill 深入介绍。昨天给 Agent 装上了「嘴」，今天给它配一副「算盘」——**数据分析（Data & Analytics）** 收录 41 个 skills，教 Agent 读表、写 SQL、连数据库、看行情。嘴负责说，算盘负责算。而且跟通信不同，算错了的代价通常是「重算一遍」——这大概是整个技能库里试错成本最低的领域之一。

## 今日分类概述

Data & Analytics 只有 **41 个条目**，跟昨天的 145 个、AI 分类的 184 个比是个小分类。但小有小的好处：今天几乎每个条目都能说出个所以然，不用像昨天那样在交易工具堆里刨通信技能。大致分五块：

- **本地 SQL 与文件处理**：[duckdb-en](https://github.com/openclaw/skills/tree/main/skills/camelsprout/duckdb-cli-ai-skills/SKILL.md)（下面详讲）、[csv-pipeline](https://github.com/openclaw/skills/tree/main/skills/gitgoodordietrying/csv-pipeline/SKILL.md)（下面详讲）、[data-analyst](https://github.com/openclaw/skills/tree/main/skills/oyi77/data-analyst/SKILL.md)（下面详讲）、`senior-data-engineer` 与 `senior-data-scientist`（alirezarezvani 的两个「资深人设」技能，往 Agent 里注入数据工程/数据科学的工作方法论）、`data-lineage-tracker`（追踪数据来源与变换链路——ETL 场景里很正经的东西）、`tabstack-extractor`（从网站抽取结构化数据）。
- **在线数据库**：[supabase](https://github.com/openclaw/skills/tree/main/skills/stopmoclay/supabase/SKILL.md)（下面详讲）、[nocodb](https://github.com/openclaw/skills/tree/main/skills/nickian/nocodb/SKILL.md)（经 REST API 管理 NocoDB 的库、表、记录——自托管 Airtable 用户的对口菜）、[thingsboard-skill](https://github.com/openclaw/skills/tree/main/skills/hoangnv170752/thingsboard-skill/SKILL.md)（IoT 平台 ThingsBoard 的设备、仪表盘、遥测管理，把「数据」往前推到了采集端）。
- **行情与金融数据**：[yahoo-data-fetcher](https://github.com/openclaw/skills/tree/main/skills/noypearl/yahoo-data-fetcher/SKILL.md)（雅虎财经实时报价）、[hyperliquid](https://github.com/openclaw/skills/tree/main/skills/k0nkupa/hyperliquid/SKILL.md)（Hyperliquid 永续与现货行情，描述里明确标注 read-only——昨天那一堆会下单的交易工具看了都该学学）、[ceorater](https://github.com/openclaw/skills/tree/main/skills/ceorater-skills/ceorater/SKILL.md)（给标普 500 的 CEO 们做「机构级」表现分析）、[sure](https://github.com/openclaw/skills/tree/main/skills/bt0r/sure/SKILL.md)（从个人财务看板出报告）。
- **个人数据资产**：[douban-sync-skill](https://github.com/openclaw/skills/tree/main/skills/cosformula/douban-sync-skill/SKILL.md)（下面详讲）、[ec-session-cleaner](https://github.com/openclaw/skills/tree/main/skills/henrino3)（转换清洗 OpenClaw 自己的会话 JSONL 记录——用 Agent 分析 Agent，本分类里最自指的一个）、[umea-data](https://github.com/openclaw/skills/tree/main/skills/simskii/umea-data/SKILL.md)（瑞典于默奥市政开放数据，查位置与设施——可能是全库地理限定最强的一个技能，非于默奥居民基本无用）。
- **统计与情报基建**：`add-analytics` / `check-analytics` / `remove-analytics`（jeftekhari 的 GA4 三件套：加埋点、审计实现、干净移除，三兄弟齐活是好事——见过太多只管埋不管拆的）、[google-analytics-api](https://github.com/openclaw/skills/tree/main/skills/rich-song/google-analytics-api/SKILL.md)（GA 数据 API 接入）、[amplitude-automation](https://github.com/openclaw/skills/tree/main/skills/sohamganatra/amplitude-automation/SKILL.md)（经 Rube MCP 自动化 Amplitude 操作）、[osint-graph-analyzer](https://github.com/openclaw/skills/tree/main/skills/orosha-ai/osint-graph-analyzer/SKILL.md)（从 OSINT 数据构建知识图谱）、[ipinfo](https://github.com/openclaw/skills/tree/main/skills/tiagom101/ipinfo/SKILL.md)（IP 地理定位）。

老规矩说噪音。41 个条目里最刺眼的：`clean-skill-1` 和 `cleanboi-00002`——两个「友好的问候测试技能」，同一位作者在数据分类里放了两个打招呼技能，堪称行为艺术；`cleanup` 和 `kradleverse-cleanup` 是同作者同描述的重复条目；`agi-artificial-geometric-intelligence` 的全部描述是「Designed multi-layer.」，三个词零信息量，竞争全库最空描述的种子选手。跨界住户也不少：[canva](https://github.com/openclaw/skills/tree/main/skills/abgohel/canva/SKILL.md) 和 [design-assets](https://github.com/openclaw/skills/tree/main/skills/cmanfre7/design-assets/SKILL.md)（设计）、[netlify](https://github.com/openclaw/skills/tree/main/skills/ajmwagar/netlify/SKILL.md) 和 [cicd-pipeline](https://github.com/openclaw/skills/tree/main/skills/gitgoodordietrying/cicd-pipeline/SKILL.md)（DevOps）、[facebook-page-manager](https://github.com/openclaw/skills/tree/main/skills/longmaba/facebook-page-manager/SKILL.md) / [linkdapi](https://github.com/openclaw/skills/tree/main/skills/foontinz/linkdapi/SKILL.md) / [data-enricher](https://github.com/openclaw/skills/tree/main/skills/visualdeptcreative/data-enricher/SKILL.md)（营销）、[harvest-time-reporting-api](https://github.com/openclaw/skills/tree/main/skills/zachgodsell93)（工时）、[get-weather](https://github.com/openclaw/skills/tree/main/skills/noypearl/get-weather/SKILL.md)（天气）。自动分类的通病照例存在，但密度比昨天好太多。

## 精选 Skill 详解

### 1. duckdb-en —— 让 Agent 直接用 SQL 砸开你的数据文件 ⭐⭐⭐⭐✨

**链接**：[camelsprout/duckdb-cli-ai-skills](https://github.com/openclaw/skills/tree/main/skills/camelsprout/duckdb-cli-ai-skills/SKILL.md)

描述一句话：「DuckDB CLI specialist for SQL analysis, data processing」。先说 DuckDB 是什么：单文件、零配置、进程内运行的分析型数据库，江湖人称「分析界的 SQLite」——最大的本事是能直接对 CSV、Parquet、JSON 这类文件跑 SQL，不用先建库导数。

这个 skill 的定位是给 Agent 注入一套 DuckDB CLI 的使用规范：怎么在 shell 里调用 duckdb、怎么读各种格式、怎么写聚合查询。机制上是标准的 shell 优先路线——Agent 本来就能跑命令，这个 skill 教它把命令跑对。典型用法：

```sql
-- 一行 SQL 直接分析几百 MB 的销售流水 CSV
SELECT region, sum(amount) AS total
FROM 'sales-2026.csv'
GROUP BY region ORDER BY total DESC;
```

对个人用户，这是本分类最实用的入口：导出的账单、下载的公开数据集、随手整理的表格，丢给 Agent 加一句「用 DuckDB 分析一下」就完事。数据全程不出本机——没有上传、没有第三方 API，隐私上天然干净。前提是机器上装了 duckdb（macOS 上 `brew install duckdb` 一行的事）。扣半星的原因也在这：它是个规范型技能，能力上限取决于 DuckDB 本身，特别复杂的分析还得看 Agent 自己的 SQL 功力。

### 2. supabase —— 给 Agent 一把生产数据库的钥匙 ⭐⭐⭐⭐✨

**链接**：[stopmoclay/supabase](https://github.com/openclaw/skills/tree/main/skills/stopmoclay/supabase/SKILL.md)

「Connect to Supabase for database operations, vector search, and storage」。Supabase 是托管的 Postgres 全家桶：数据库、认证、对象存储，外加基于 pgvector 的向量检索。这个 skill 让 Agent 对接 Supabase，做增删改查、跑向量搜索、管文件存储。

它跟 duckdb-en 恰好是光谱的两端：一个管本地的死文件，一个管云上的活数据。有了它，「帮我在记账表里记一笔」「把这篇笔记的摘要存进向量库」「查一下上周新增了多少条记录」都变成聊天里的一句指令。vector search 这一项尤其关键——意味着你让 Agent 存进去的数据，之后能被语义检索，等于给 Agent 搭了个外挘认知库。

实用场景：个人 CRM（聊天中一句话记录联系人动态）、轻量 RAG 后端、家庭小应用的数据库管理员。风险也明摆着：这是真·生产数据，写错了是真丢。务必给 Agent 配权限受限的 key，别把 service key 无脑塞给它——数据库类技能，「钥匙管理」永远比「技能本身」重要。

### 3. csv-pipeline —— 表格民工的日常流水线 ⭐⭐⭐⭐

**链接**：[gitgoodordietrying/csv-pipeline](https://github.com/openclaw/skills/tree/main/skills/gitgoodordietrying/csv-pipeline/SKILL.md)

「Process, transform, analyze, and report on CSV and JSON」——处理、转换、分析、出报告，四个动词就是数据工作的全部日常。如果说 duckdb-en 是把 SQL 武器递给 Agent，csv-pipeline 更像一套流程规范：拿到脏数据怎么清洗、怎么变换、怎么汇总、最后怎么输出一份像样的报告。

它跟 duckdb 并不冲突，更像互补：轻量转换和报告用它定流程，重分析落到 DuckDB。作者 gitgoodordietrying 还有个 `cicd-pipeline` 也混进了这个分类（其实是 DevOps 的活，明天正好能在 DevOps 分类里再见到它）。这不影响 csv-pipeline 本身是本分类里定位最「大众」的技能——毕竟不是人人有数据库，但人人有表格。

实用场景：每周把各部门导出的 CSV 合并成一份报表、给编码/空值/格式问题做批量清洗、把 JSON API 响应转成可读表格。这些活以前要开 Excel 折腾半天，现在是一段对话。

### 4. data-analyst —— 给非技术人的一个全能数据员 ⭐⭐⭐✨

**链接**：[oyi77/data-analyst](https://github.com/openclaw/skills/tree/main/skills/oyi77/data-analyst/SKILL.md)

「Data visualization, report generation, SQL queries, and spreadsheet」——可视化、报告、SQL、表格，四个能力打一个包。这是典型的「人设型」技能：不绑定某个具体工具，而是给 Agent 一套数据分析师的工作方法——先理解问题，再查数据，再出图出报告。

跟 duckdb-en、supabase 这类「工具型」技能相比，它的价值在入口友好：你不需要知道 DuckDB 和 Supabase 是什么，只需要说「帮我把这个表画个图」「对比一下这两个月的数据」，Agent 自己选工具。对已经清楚自己要干嘛的人，增量不大；对「我有数据但不知道从哪下手」的人，它是个不错的起点。三星半，差的半个星就是定位的宽度。

### 5. douban-sync-skill —— 把你的标记生活变成数据集 ⭐⭐⭐✨

**链接**：[cosformula/douban-sync-skill](https://github.com/openclaw/skills/tree/main/skills/cosformula/douban-sync-skill/SKILL.md)

「Export and sync Douban (豆瓣) book/movie/music/game collections」——导出并同步豆瓣的书、影、音、游戏收藏。中文用户看到这个会心一笑：在豆瓣上标记了十几年的电影和书，是个人趣味的完整画像，可惜一直锁在豆瓣里，官方导出渠道历来一言难尽。

这个 skill 干的事是把收藏数据拉出来、变成 Agent 可用的数据集。能玩出的花样不少：「统计我近五年观影口味的变化」「按我的书单推荐接下来读什么」「把看过的电影同步到别的平台」。本质上和同分类的 `sure`（个人财务看板）是同一个思路：**个人数据的所有权**——先有导出，才有一切分析。

机制上从描述看大概率走豆瓣的开放接口或个人导出数据，同步频率和字段覆盖得装上才知道。三星半：类别小众，但对中文玩家是实打实的刚需，情怀加半星。

## 应用场景总结

把今天 41 个条目按「数据在哪」排一遍，恰好是一条完整的管道：

1. **采集**：tabstack-extractor（网页抽数据）、thingsboard-skill（IoT 遥测）、yahoo-data-fetcher / hyperliquid（行情）；
2. **存储**：supabase、nocodb、thingsboard 仪表盘；
3. **加工**：duckdb-en、csv-pipeline、senior-data-engineer；
4. **分析**：data-analyst、senior-data-scientist、osint-graph-analyzer；
5. **呈现**：data-analyst 的可视化与报告、daily-report、google-analytics-api 看流量。

给想上手的人三条实在建议：

- **从本地开始**：duckdb-en + csv-pipeline 的组合零风险零成本，机器上有表格就能玩，数据不出门；
- **碰在线库先管钥匙**：supabase / nocodb 用权限受限的凭证，写操作前让 Agent 先备份——数据库技能的第一课永远是钥匙管理；
- **只读优先**：行情类和分析类技能，能只读就不给写权限（hyperliquid 描述里那个 read-only 标注就是榜样）。昨天通信分类讲过「说错话收不回」，数据这边对应的是「写错库回不去」。

## 推荐指数排名

| Skill | 定位 | 推荐指数 |
|---|---|---|
| duckdb-en | 本地 SQL 分析 | ⭐⭐⭐⭐✨ |
| supabase | 云数据库 + 向量检索 | ⭐⭐⭐⭐✨ |
| csv-pipeline | CSV/JSON 流水线 | ⭐⭐⭐⭐ |
| data-analyst | 全能数据员人设 | ⭐⭐⭐✨ |
| douban-sync-skill | 豆瓣收藏同步 | ⭐⭐⭐✨ |
| yahoo-data-fetcher | 股票行情 | ⭐⭐⭐✨ |
| nocodb | 自托管库管理 | ⭐⭐⭐ |
| hyperliquid | 只读行情 | ⭐⭐⭐ |
| ec-session-cleaner | 会话记录分析 | ⭐⭐⭐ |
| osint-graph-analyzer | OSINT 知识图谱 | ⭐⭐✨ |

（✨ 表示半星）

## 下期预告

明天进 **devops-and-cloud（DevOps 与云服务）**——今天分类里串场的 netlify 和 cicd-pipeline 算是提前打了招呼。教 Agent 运维服务器、管部署，这是离「自我托管」最近的一期，值得期待。
