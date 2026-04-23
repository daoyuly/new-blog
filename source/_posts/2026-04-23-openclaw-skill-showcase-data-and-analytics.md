---
title: OpenClaw Skill 每日推荐 - 数据与分析
date: 2026-04-23
tags: [openclaw, skill, data-and-analytics]
categories: [技术推荐]
---

# OpenClaw Skill 每日推荐 - 数据与分析

## 分类概述

今天是 OpenClaw Skill 每日推荐的第 **17** 期（共 30 期），我们聚焦于 **数据与分析** 分类。这个分类共包含 **41 个** 技能，涵盖了从数据收集、处理、分析到可视化的全流程工具，是数据驱动决策的得力助手。

数据是新时代的石油，但只有经过处理和分析才能释放其价值。这个分类的技能可以帮助你：

- 📊 **数据处理**：CSV/JSON 转换、清洗、管道处理
- 📈 **数据分析**：SQL 查询、数据可视化、报表生成
- 🔍 **数据获取**：爬虫、API 集成、实时数据流
- 🗄️ **数据存储**：数据库操作、向量搜索、云存储
- 🧠 **高级分析**：知识图谱、OSINT 分析、机器学习

---

## 精选 Skill 详解

### 1️⃣ csv-pipeline ⭐⭐⭐⭐⭐

**GitHub**: [gitgoodordietrying/csv-pipeline](https://github.com/openclaw/skills/tree/main/skills/gitgoodordietrying/csv-pipeline/SKILL.md)

#### 核心功能
处理、转换、分析和报告 CSV 和 JSON 数据的完整管道工具。

#### 技术实现
- 支持 CSV 和 JSON 格式的相互转换
- 内置数据清洗和转换功能
- 自动生成分析报告
- 支持数据管道串联操作

#### 实用场景
- **电商数据批量处理**：将导出的订单 CSV 转换为财务分析报表
- **日志数据分析**：处理服务器日志 JSON 文件，提取关键指标
- **数据迁移**：将旧系统的 CSV 数据迁移到新数据库
- **自动化报表**：定时处理数据并生成日报/周报

#### 代码示例
```python
# 处理电商订单数据
csv_pipeline.process(
    input="orders_2026_04.csv",
    transformations=[
        "remove_duplicates",
        "filter_by_status:completed",
        "calculate_revenue"
    ],
    output="revenue_report.json"
)
```

#### 推荐指数：⭐⭐⭐⭐⭐
**评价**：数据处理的核心工具，适用性极强，几乎是数据分析的必备技能。

---

### 2️⃣ data-analyst ⭐⭐⭐⭐⭐

**GitHub**: [oyi77/data-analyst](https://github.com/openclaw/skills/tree/main/skills/oyi77/data-analyst/SKILL.md)

#### 核心功能
全能型数据分析师技能，集成了数据可视化、报表生成、SQL 查询和电子表格操作。

#### 技术实现
- 集成多种数据源连接（数据库、API、文件）
- 支持 SQL 查询和复杂分析
- 自动生成可视化图表（柱状图、折线图、饼图等）
- 导出多种格式报告（PDF、Excel、HTML）

#### 实用场景
- **业务数据分析**：分析销售数据、用户行为数据
- **数据仪表盘**：创建实时数据监控面板
- **数据库查询**：无需 SQL 知识即可查询数据库
- **自动化报表**：定期生成业务分析报告

#### 代码示例
```python
# 查询并可视化销售数据
data_analyst.query(
    database="sales_db",
    sql="SELECT product, SUM(revenue) as total FROM orders GROUP BY product",
    chart_type="bar",
    export="sales_chart.png"
)
```

#### 推荐指数：⭐⭐⭐⭐⭐
**评价**：一站式数据分析解决方案，适合从初学者到专业数据分析师的所有用户。

---

### 3️⃣ duckdb-en ⭐⭐⭐⭐☆

**GitHub**: [camelsprout/duckdb-cli-ai-skills](https://github.com/openclaw/skills/tree/main/skills/camelsprout/duckdb-cli-ai-skills/SKILL.md)

#### 核心功能
DuckDB 命令行专家，专注于 SQL 分析和数据处理。

#### 技术实现
- 基于 DuckDB 列式数据库引擎
- 支持标准 SQL 语法
- 高性能数据查询和分析
- 与 Python、Pandas 无缝集成

#### 实用场景
- **大数据分析**：处理 GB 级别数据文件
- **数据科学**：与 Python 生态系统结合，进行数据挖掘
- **OLAP 分析**：快速执行聚合查询和数据分析
- **数据湖查询**：直接查询 Parquet、CSV 等文件格式

#### 代码示例
```sql
-- 查询本地 CSV 文件
SELECT product, SUM(revenue) as total
FROM 'sales_*.parquet'
WHERE date >= '2026-01-01'
GROUP BY product
ORDER BY total DESC
LIMIT 10;
```

#### 推荐指数：⭐⭐⭐⭐☆
**评价**：专业级数据分析工具，适合需要高性能 SQL 分析的用户，但学习曲线稍陡。

---

### 4️⃣ supabase ⭐⭐⭐⭐⭐

**GitHub**: [stopmoclay/supabase](https://github.com/openclaw/skills/tree/main/skills/stopmoclay/supabase/SKILL.md)

#### 核心功能
连接和管理 Supabase 数据库，支持数据库操作、向量搜索和文件存储。

#### 技术实现
- 基于 PostgreSQL 的全栈数据库平台
- 内置身份认证和实时订阅
- 支持向量搜索（pgvector 扩展）
- 提供 RESTful API 和 GraphQL 接口

#### 实用场景
- **全栈应用开发**：快速搭建后端数据库
- **向量搜索**：构建语义搜索和 RAG 应用
- **实时应用**：聊天、协作工具等实时功能
- **数据同步**：多设备数据同步

#### 代码示例
```python
# 执行向量搜索
supabase.search(
    table="documents",
    query="机器学习最佳实践",
    similarity_threshold=0.7,
    limit=5
)
```

#### 推荐指数：⭐⭐⭐⭐⭐
**评价**：现代化数据库解决方案，集成了传统数据库和向量数据库的能力，适合 AI 应用开发。

---

### 5️⃣ google-analytics-api ⭐⭐⭐⭐☆

**GitHub**: [rich-song/google-analytics-api](https://github.com/openclaw/skills/tree/main/skills/rich-song/google-analytics-api/SKILL.md)

#### 核心功能
Google Analytics API 集成，轻松获取和分析网站流量数据。

#### 技术实现
- 官方 GA4 API 集成
- 支持自定义查询和报告
- 自动处理认证和分页
- 支持实时数据和历史数据查询

#### 实用场景
- **网站分析**：获取访问量、用户行为等关键指标
- **营销效果评估**：追踪广告投放效果
- **自动化报告**：定期生成网站分析报告
- **数据集成**：将 GA 数据与其他数据源结合分析

#### 代码示例
```python
# 获取最近 7 天的访问数据
ga_api.query(
    metrics=["sessions", "pageviews", "bounce_rate"],
    dimensions=["date", "source"],
    date_range="last_7_days",
    sort="-sessions"
)
```

#### 推荐指数：⭐⭐⭐⭐☆
**评价**：网站运营必备工具，但需要 GA 账号和配置。

---

### 6️⃣ osint-graph-analyzer ⭐⭐⭐⭐☆

**GitHub**: [orosha-ai/osint-graph-analyzer](https://github.com/openclaw/skills/tree/main/skills/orosha-ai/osint-graph-analyzer/SKILL.md)

#### 核心功能
从 OSINT（开源情报）数据构建知识图谱，进行关联分析。

#### 技术实现
- 自动采集公开网络数据
- 构建实体关系图谱
- 支持图算法分析（最短路径、社区发现等）
- 可视化展示复杂关系网络

#### 实用场景
- **安全研究**：威胁情报分析、攻击溯源
- **调查取证**：网络犯罪调查
- **商业情报**：竞争对手分析
- **学术研究**：社会网络分析

#### 推荐指数：⭐⭐⭐⭐☆
**评价**：专业工具，适合安全研究人员和调查人员使用。

---

## 应用场景总结

### 🎯 个人用户
- **理财追踪**：使用 `sure` 获取个人财务报告
- **健康管理**：使用 `get-weather` 获取天气数据，配合健康应用
- **阅读管理**：使用 `douban-sync-skill` 同步豆瓣书影音数据
- **投资分析**：使用 `yahoo-data-fetcher` 获取实时股票数据

### 🏢 企业用户
- **业务分析**：使用 `data-analyst` 生成业务报表
- **数据处理**：使用 `csv-pipeline` 处理大批量数据
- **网站运营**：使用 `google-analytics-api` 分析流量
- **数据存储**：使用 `supabase` 搭建数据库

### 🔬 专业用户
- **数据科学**：使用 `duckdb-en` 进行高性能数据分析
- **安全研究**：使用 `osint-graph-analyzer` 进行情报分析
- **数据工程**：使用 `senior-data-engineer` 构建数据管道

---

## 推荐指数排名

| 排名 | Skill | 推荐指数 | 适用人群 |
|------|-------|----------|----------|
| 1 | csv-pipeline | ⭐⭐⭐⭐⭐ | 所有人 |
| 2 | data-analyst | ⭐⭐⭐⭐⭐ | 数据分析师 |
| 3 | supabase | ⭐⭐⭐⭐⭐ | 开发者 |
| 4 | google-analytics-api | ⭐⭐⭐⭐☆ | 网站运营 |
| 5 | duckdb-en | ⭐⭐⭐⭐☆ | 数据科学家 |
| 6 | osint-graph-analyzer | ⭐⭐⭐⭐☆ | 安全研究者 |

---

## 使用建议

### 新手入门路径
1. 从 `csv-pipeline` 开始，学习基础数据处理
2. 使用 `data-analyst` 进行可视化分析
3. 逐步尝试更复杂的工具如 `duckdb-en`

### 进阶学习路径
1. 深入学习 SQL 和数据库操作
2. 掌握 `supabase` 等现代化数据库
3. 结合多个技能构建完整的数据分析流程

### 实用组合推荐
- **电商分析**：`csv-pipeline` + `data-analyst` + `google-analytics-api`
- **数据科学**：`duckdb-en` + `csv-pipeline` + `data-analyst`
- **应用开发**：`supabase` + `csv-pipeline` + `data-analyst`

---

## 结语

数据与分析是 OpenClaw 生态系统中最强大的分类之一。无论你是个人用户、企业用户还是专业数据分析师，都能在这个分类中找到适合自己的工具。

明天我们将探索 **媒体与流媒体** 分类，敬请期待！

---

*本文发布于 OpenClaw 技术博客，持续更新中...*
