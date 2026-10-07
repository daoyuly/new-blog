---
title: OpenClaw Skill 每日推荐 - Data & Analytics（数据分析）
date: 2026-10-07 09:00:00
tags: [openclaw, skill, data-and-analytics]
categories: [技术推荐]
---

# OpenClaw Skill 每日推荐 · 第 9 期：Data & Analytics（数据分析）

> 本系列每天介绍一个 OpenClaw Skill 分类，精选其中最有代表性的技能，帮你把 AI 助手真正用起来。今天是第 9 期——**数据分析**。

## 今日分类概述

**Data & Analytics** 分类下共有 **41 个 skills**，覆盖了数据分析工作的完整链路：

- **文件级查询分析**：duckdb-en、csv-pipeline、data-analyst
- **数据库与云服务**：supabase、nocodb、senior-data-engineer
- **数据接入与采集**：yahoo-data-fetcher、tabstack-extractor、ipinfo
- **领域数据**：douban-sync-skill（豆瓣）、umea-data（瑞典于默奥开放数据）、hyperliquid（加密货币行情）
- **分析与治理**：osint-graph-analyzer、data-lineage-tracker、senior-data-scientist

这一分类的共同点是：**让 AI 助手直接处理数据，而不是让你先开一个 Jupyter Notebook**。下面精选 5 个详解。

---

## 精选 Skill 详解

### 1. duckdb-en —— 把 SQL 变成万能数据瑞士军刀 ⭐⭐⭐⭐½

- **作者**：camelsprout
- **安装**：`openclaw skills install @camelsprout/duckdb-cli-ai-skills`
- **依赖**：本地安装 DuckDB CLI
- **安全审计**：VirusTotal / OpenClaw 双 Benign ✅

**核心功能**：DuckDB 是嵌入式分析型数据库，这个 skill 教会 AI 助手用它直接对 CSV、Parquet、JSON 文件跑 SQL——**不需要启动数据库服务，不需要写 pandas 脚本**，文件在哪，查询就在哪。

**实用场景**：
- 一行命令统计 CSV 里符合条件的记录，不用打开 Excel
- Parquet 导出转 CSV，方便给用 Excel 的同事
- 跨多个日志文件按类别聚合交易金额
- 大文件导入前先用 `LIMIT` 预览结构

**示例**：

```bash
duckdb -table -c "SELECT category, SUM(amount) AS total
FROM 'sales_2024.csv'
GROUP BY category ORDER BY total DESC"
```

直接输出格式化的 ASCII 表格。对经常和"一堆数据文件"打交道的人来说，这是本分类里性价比最高的 skill 之一——**查询即开即用，分析完即走**。

---

### 2. csv-pipeline —— 零依赖的表格数据处理管线 ⭐⭐⭐⭐½

- **作者**：gitgoodordietrying
- **依赖**：仅需 Python 3（标准库）
- **支持格式**：CSV / TSV / JSON / JSON Lines
- **安全审计**：Benign ✅

**核心功能**：提供一套完整的表格数据处理方法论——过滤、去重、排序、join、聚合、格式转换、数据校验、生成 Markdown 报告，全部用 shell 标准工具 + Python 标准库实现，**零外部依赖**。

**亮点设计**：

```bash
# awk 一行过滤：第 3 列大于 100 的行
awk -F',' 'NR==1 || $3 > 100' data.csv > filtered.csv

# 按第 2 列去重（保留首次出现）
awk -F',' '!seen[$2]++' data.csv > deduped.csv

# 甚至可以借用 Python 自带的 sqlite3 内存库做聚合
sqlite3 :memory: ".mode csv" ".import data.csv t" \
  "SELECT category, SUM(amount) FROM t GROUP BY category;"
```

SKILL.md 里还内置了**流式处理函数**（逐行读写，不撑爆内存）和**schema 校验器**（检查邮箱格式、日期格式、数值类型），处理"脏数据"的常见坑基本都提前填好了。

**适合谁**：经常收到各种格式的数据文件、需要快速清洗和汇总报告的人。和 duckdb-en 组合使用效果更佳——简单转换用 shell，复杂分析用 DuckDB。

---

### 3. data-analyst —— 全流程数据分析工作流 ⭐⭐⭐⭐

- **作者**：oyi77
- **下载量**：**16.3k**（本分类下载量第一）
- **安全状态**：⚠️ OpenClaw 标记为 **Suspicious**，使用前建议先审查其脚本内容

**核心功能**：把 AI 助手变成"数据分析师"，覆盖 SQL 查询、表格处理、可视化、报告生成、数据清洗、统计分析六大能力。它的 SKILL.md 本身就是一份浓缩的数据分析教科书：

- SQL 模板：留存分析（Cohort）、漏斗转化、环比增长（`LAG` 窗口函数）一应俱全
- 数据清洗清单：缺失值、重复、离群值（IQR 法）的检测与处理 SQL
- 图表选型指南：什么数据用什么图，一目了然
- 报告模板：从执行摘要到方法论附录的完整 Markdown 骨架

**漏斗分析示例**（SKILL.md 内置）：

```sql
WITH funnel AS (
    SELECT
        COUNT(DISTINCT CASE WHEN event = 'page_view' THEN user_id END) as views,
        COUNT(DISTINCT CASE WHEN event = 'signup'   THEN user_id END) as signups,
        COUNT(DISTINCT CASE WHEN event = 'purchase' THEN user_id END) as purchases
    FROM events
    WHERE date >= CURRENT_DATE - INTERVAL '30 days'
)
SELECT views, signups, purchases,
       ROUND(signups * 100.0 / NULLIF(views, 0), 2) as signup_rate
FROM funnel;
```

**提醒**：它是本分类最热门的 skill，但被标记 Suspicious——热门不等于安全。安装后建议先通读 `scripts/` 目录再投入使用，这也是用任何社区 skill 的好习惯。

---

### 4. supabase —— 让 AI 助手直接操作你的云数据库 ⭐⭐⭐⭐

- **作者**：stopmoclay
- **依赖**：`SUPABASE_URL` + `SUPABASE_SERVICE_KEY` 环境变量
- **安全审计**：Benign ✅

**核心功能**：封装 Supabase（PostgreSQL 云服务）的常用操作：CRUD、原生 SQL、表管理、存储过程调用，最亮眼的是**内置 pgvector 向量检索**。

**向量检索三步走**：

```sql
-- 1. 启用扩展
CREATE EXTENSION IF NOT EXISTS vector;

-- 2. 建表（embedding 列 1536 维）
CREATE TABLE documents (
  id bigserial PRIMARY KEY,
  content text,
  embedding vector(1536)
);

-- 3. 建相似度检索函数 + ivfflat 索引
CREATE INDEX ON documents
USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);
```

之后一行命令就能做语义搜索：

```bash
supabase.sh vector-search documents "如何配置登录鉴权" --limit 10
```

**实用场景**：给个人知识库加语义检索、为聊天机器人挂长期记忆、快速搭建原型后端。skill 文档里也明确提醒了 **service key 会绕过 RLS（行级安全）**，生产环境要注意用 anon key。

---

### 5. douban-sync-skill —— 把你的豆瓣十年记录装进本地 ⭐⭐⭐⭐

- **作者**：cosformula
- **版本**：v0.2.2
- **依赖**：`DOUBAN_USER` 环境变量
- **安全审计**：Benign ✅

**核心功能**：导出并同步豆瓣的书 / 影 / 音 / 游戏收藏到本地 CSV（Obsidian 兼容），提供两种模式：

1. **全量导出**：通过浏览器逐页抓取收藏页（每页 30 条，自动翻页，内置 2-3 秒限速 + 被封 30 秒重试策略）
2. **增量同步**：走豆瓣 RSS，**无需登录**，可挂每日 cron 自动跑

**输出结构**：

```
douban-sync/
└── {user_id}/
    ├── 书.csv
    ├── 影视.csv
    ├── 音乐.csv
    └── 游戏.csv
```

每条记录包含标题、链接、日期、个人评分、状态（读过/在读/想读）和短评，按豆瓣 URL 去重，重复跑也安全。

**实用场景**：年度书影总结的数据源、导入 Obsidian 做个人阅读图谱、给"豆瓣倒闭了数据怎么办"买个保险。对中文用户来说，这是本分类里最有亲切感的一个。

---

## 应用场景总结

把今天的 5 个 skill 串起来，就是一条完整的个人数据分析工作流：

| 环节 | Skill | 一句话 |
|------|-------|--------|
| 文件探索 | duckdb-en | SQL 直接查 CSV/Parquet，免建库 |
| 清洗转换 | csv-pipeline | 零依赖的格式转换与数据清洗 |
| 深度分析 | data-analyst | 留存、漏斗、可视化、报告模板全套 |
| 落库检索 | supabase | 云数据库 + pgvector 语义搜索 |
| 生活数据 | douban-sync-skill | 豆瓣收藏自动同步本地 |

**推荐指数排名**：

1. 🥇 duckdb-en（⭐⭐⭐⭐½）—— 上手最快，收益最直接
2. 🥈 csv-pipeline（⭐⭐⭐⭐½）—— 零依赖，随装随用
3. 🥉 data-analyst（⭐⭐⭐⭐）—— 内容最全，但注意安全标记
4. supabase（⭐⭐⭐⭐）—— 适合已有 Supabase/向量检索需求的用户
5. douban-sync-skill（⭐⭐⭐⭐）—— 小而美，中文用户强烈推荐

## 实用建议

- **先装 duckdb-en**：如果你今天只装一个，装它。`brew install duckdb` 之后就能用，学习成本几乎为零。
- **注意供应链安全**：data-analyst 下载量最高却被标 Suspicious，说明**下载量 ≠ 安全**。装任何 skill 前花两分钟看看它的脚本做了什么。
- **组合拳**：csv-pipeline 负责清洗 → duckdb-en 负责分析 → supabase 负责持久化和语义检索，三个免费 skill 就能搭起个人数据中台。
- **定时任务**：douban-sync-skill 这类"同步型" skill 一定要配 cron，增量模式不登录也能跑，Set and forget。

---

*明日预告：DevOps & Cloud（DevOps 与云服务）。数据有了，下一篇看看怎么部署上线。*
