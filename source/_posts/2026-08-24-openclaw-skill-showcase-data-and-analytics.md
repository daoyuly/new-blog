---
title: OpenClaw Skill 每日推荐 - 数据分析 (Data & Analytics)
date: 2026-08-24 11:30:00
tags:
  - openclaw
  - skill
  - data-and-analytics
  - 数据分析
categories:
  - 技术推荐
---

# OpenClaw Skill 每日推荐 — 数据分析 (Data & Analytics)

> 📊 第 9/30 期 | 数据是新时代的石油，而分析是炼油厂。今天介绍 Data & Analytics 分类下的 41 个 skill 中最值得关注的 5 个。

## 今日分类概述

**Data & Analytics** 分类共收录 **41 个 skills**，覆盖了从基础 CSV 处理到高级数据科学工作流的完整链条。无论你是需要快速分析一份销售数据表，还是要构建可扩展的数据管道，这个分类都有对应的工具。

分类涵盖的主要方向：
- **数据处理与转换**：CSV/JSON 解析、格式转换、ETL
- **数据库与后端**：Supabase、NocoDB、DuckDB
- **分析可视化**：数据报表、统计摘要、图表生成
- **专业分析**：OSINT 知识图谱、金融分析、CEO 评级
- **数据工程**：数据血缘追踪、CI/CD 管道、数据富化

---

## 🲄 精选 Skill 详解

### 1. CSV Data Pipeline ⭐⭐⭐⭐⭐

**作者：** gitgoodordietrying
**GitHub：** [openclaw/skills/csv-pipeline](https://github.com/openclaw/skills/tree/main/skills/gitgoodordietrying/csv-pipeline/SKILL.md)
**ClawHub：** [clawhub.ai/gitgoodordietrying/skills/csv-pipeline](https://clawhub.ai/gitgoodordietrying/skills/csv-pipeline)

#### 核心功能

一个零依赖的 CSV/TSV/JSON 数据处理管道，仅依赖 Python 3 标准库和系统命令行工具。这意味着你不需要安装 pandas、numpy 等重量级依赖，就能完成大部分数据处理工作。

支持的操作包括：
- **读取与检查**：预览行数、列名、空值统计
- **过滤与转换**：条件筛选、计算列、类型转换、列重命名
- **分组与聚合**：sum/avg/count/min/max 分组统计
- **数据连接**：内连接、左连接
- **格式转换**：CSV ↔ JSON ↔ TSV 互转
- **排序与去重**：按列排序、全列去重、按指定列去重

#### 技术实现

分为两层：

**Shell 层**（快速操作）使用 `head`、`tail`、`awk`、`cut`、`sort` 等 Unix 工具，适合大数据集的快速过滤和检查：

```bash
# 过滤第三列大于 100 的行
awk -F',' 'NR==1 || $3 > 100' data.csv > filtered.csv

# 按第四列求和
awk -F',' 'NR>1 {sum += $4} END {print sum}' data.csv

# 按第二列去重（保留首次出现）
awk -F',' '!seen[$2]++' data.csv > deduped.csv
```

**Python 层**（复杂转换）使用标准库 `csv`、`json`、`collections`，适合需要复杂逻辑的场景：

```python
from collections import defaultdict

def group_by(rows, key):
    """按列分组"""
    groups = defaultdict(list)
    for r in rows:
        groups[r[key]].append(r)
    return dict(groups)

def aggregate(rows, group_col, agg_col, func='sum'):
    """分组聚合：支持 sum/avg/count/min/max"""
    groups = group_by(rows, group_col)
    results = []
    for name, group in sorted(groups.items()):
        values = [float(r[agg_col]) for r in group if r[agg_col].strip()]
        if func == 'sum':
            agg = sum(values)
        elif func == 'avg':
            agg = sum(values) / len(values) if values else 0
        results.append({group_col: name, f'{func}_{agg_col}': str(agg), 'count': str(len(group))})
    return results
```

#### 实用场景

| 场景 | 具体应用 |
|------|---------|
| 月度销售报告 | 读取销售 CSV → 按品类分组求和 → 输出汇总表 |
| 数据清洗 | 去除重复行 → 填充空值 → 统一日期格式 |
| 格式转换 | 客户提供的 TSV → 转为 JSON 供 API 消费 |
| 数据合并 | 两个 CSV 按客户 ID 内连接 → 合并数据集 |

#### 推荐理由

零依赖设计是最大的亮点。在快速分析场景下，不需要等 `pip install pandas` 的几十秒，直接就能跑。Shell + Python 的双层架构也很聪明——简单操作用 awk 一行搞定，复杂逻辑才上 Python。

---

### 2. DuckDB CLI Specialist ⭐⭐⭐⭐⭐

**作者：** camelsprout
**GitHub：** [openclaw/skills/duckdb-cli-ai-skills](https://github.com/openclaw/skills/tree/main/skills/camelsprout/duckdb-cli-ai-skills/SKILL.md)
**ClawHub：** [clawhub.ai/camelsprout/skills/duckdb-cli-ai-skills](https://clawhub.ai/camelsprout/skills/duckdb-cli-ai-skills)

#### 核心功能

DuckDB CLI 的专业操控技能。DuckDB 是近年来数据分析领域最受关注的工具之一——它是一个进程内分析型数据库，不需要独立服务，直接对文件进行 SQL 查询。

这个 Skill 让 OpenClaw 代理精通 DuckDB CLI 的所有功能：

- **直接读取文件**：CSV、Parquet、JSON 无需导入即可查询
- **18 种输出格式**：csv、json、markdown、html、latex、insert 等
- **格式互转**：CSV → Parquet、JSON → Parquet、带过滤的转换
- **数据库管理**：创建持久化数据库、只读模式、批量导入
- **Dot 命令**：`.tables`、`.schema`、`.mode`、`.timer` 等元操作
- **键盘快捷键**：完整的 readline 快捷键支持

#### 技术实现

核心是教会代理 DuckDB CLI 的完整命令体系：

```bash
# 直接对 CSV 文件执行 SQL
duckdb -c "SELECT * FROM 'data.csv' LIMIT 10"

# 多文件 glob 读取 Parquet
duckdb -c "SELECT * FROM read_parquet('logs/*.parquet')"

# CSV 转 Parquet（带过滤）
duckdb -c "COPY (SELECT * FROM 'data.csv' WHERE amount > 1000) TO 'filtered.parquet' (FORMAT PARQUET)"

# 跨格式 JOIN
duckdb -c "SELECT a.*, b.name FROM 'orders.csv' a JOIN 'customers.parquet' b ON a.customer_id = b.id"
```

输出格式控制：

```bash
# Markdown 表格输出
duckdb -markdown -c "SELECT category, COUNT(*) as cnt FROM 'data.csv' GROUP BY category"

# JSON 流式输出
duckdb -jsonlines -c "SELECT * FROM read_json_auto('events.json') WHERE level = 'ERROR'"
```

#### 实用场景

| 场景 | 具体应用 |
|------|---------|
| 日志分析 | 多个 Parquet 日志文件 glob 读取 → SQL 聚合 → 输出报告 |
| 数据采样 | 大 CSV 文件 → SQL WHERE 过滤 → 导出子集 |
| 跨源关联 | 订单 CSV + 客户 Parquet → SQL JOIN → 合并结果 |
| 快速统计 | `SELECT COUNT(*), AVG(amount), SUM(amount) FROM 'tx.csv'` |
| 数据迁移 | CSV → Parquet（列式存储，查询更快，体积更小） |

#### 推荐理由

DuckDB 是数据分析领域的游戏规则改变者。这个 Skill 把 DuckDB CLI 的所有能力系统地教给代理，包括 18 种输出格式、完整的 dot 命令体系、甚至键盘快捷键。对于需要频繁处理结构化数据的用户来说，这是必装技能。

---

### 3. Supabase ⭐⭐⭐⭐

**作者：** stopmoclay
**GitHub：** [openclaw/skills/supabase](https://github.com/openclaw/skills/tree/main/skills/stopmoclay/supabase/SKILL.md)
**ClawHub：** [clawhub.ai/stopmoclay/skills/supabase](https://clawhub.ai/stopmoclay/skills/supabase)

#### 核心功能

连接 Supabase 后端，提供数据库操作、向量搜索和存储管理能力。Supabase 作为开源版 Firebase，在开发者中非常流行，这个 Skill 让 OpenClaw 代理能够直接操作 Supabase 实例。

主要能力：
- **数据库 CRUD**：通过 REST API 或 SQL 对表进行增删改查
- **向量搜索**：利用 pgvector 进行语义搜索
- **文件存储**：上传、下载、管理 Supabase Storage 中的文件
- **认证管理**：操作 Supabase Auth 系统

#### 实用场景

| 场景 | 具体应用 |
|------|---------|
| RAG 应用 | 存储文档向量 → 语义搜索 → 检索相关上下文 |
| 用户数据管理 | 查询用户表 → 分析活跃度 → 生成报表 |
| 文件处理 | 上传用户生成的文件到 Storage → 返回 URL |
| 实时数据 | 监听数据变更 → 触发后续工作流 |

#### 推荐理由

Supabase 是目前最流行的开源 BaaS 之一，这个 Skill 让 OpenClaw 直接具备了对 Supabase 实例的完整操作能力。特别是向量搜索的支持，对于构建 AI 应用的用户来说非常实用。

---

### 4. NocoDB ⭐⭐⭐⭐

**作者：** nickian
**GitHub：** [openclaw/skills/nocodb](https://github.com/openclaw/skills/tree/main/skills/nickian/nocodb/SKILL.md)
**ClawHub：** [clawhub.ai/nickian/skills/nocodb](https://clawhub.ai/nickian/skills/nocodb)

#### 核心功能

通过 REST API 访问和管理 NocoDB 数据库、表和记录。NocoDB 是一个开源的 Airtable 替代品，可以将任何关系型数据库转化为类似 Airtable 的电子表格界面。

主要能力：
- **表管理**：创建、查看、修改数据库表结构
- **记录操作**：增删改查表中的记录
- **视图管理**：操作不同的表格视图（网格、看板、画廊等）
- **关联管理**：处理表间关联关系

#### 实用场景

| 场景 | 具体应用 |
|------|---------|
| 项目管理 | 在 NocoDB 中创建项目表 → 添加任务记录 → 更新状态 |
| 数据录入 | 批量导入数据到 NocoDB 表 → 自动生成表格视图 |
| 数据查询 | 通过 API 查询记录 → 格式化为报表 |
| 团队协作 | 多人通过 NocoDB 界面查看和编辑数据 |

#### 推荐理由

如果你在使用 NocoDB 管理团队数据，这个 Skill 是连接 OpenClaw 和你的数据的桥梁。相比于直接操作 SQL，通过 NocoDB 的 API 层操作更安全、更直观，也更适合非技术人员。

---

### 5. OSINT Graph Analyzer ⭐⭐⭐⭐

**作者：** orosha-ai
**GitHub：** [openclaw/skills/osint-graph-analyzer](https://github.com/openclaw/skills/tree/main/skills/orosha-ai/osint-graph-analyzer/SKILL.md)
**ClawHub：** [clawhub.ai/orosha-ai/skills/osint-graph-analyzer](https://clawhub.ai/orosha-ai/skills/osint-graph-analyzer)

#### 核心功能

从开源情报（OSINT）数据构建知识图谱。这个 Skill 代表了数据分析中一个更专业化、更前沿的方向——将分散的开源信息转化为结构化的图谱关系。

主要能力：
- **实体提取**：从文本、网页、报告中提取人、组织、地点等实体
- **关系建模**：构建实体间的关系网络
- **图谱可视化**：生成可交互的知识图谱
- **关联分析**：发现隐藏的关系链条和模式

#### 实用场景

| 场景 | 具体应用 |
|------|---------|
| 调查报道 | 从多源新闻提取人物关系 → 构建利益网络图 |
| 安全研究 | 分析威胁情报 → 关联攻击组织和手法 |
| 尽职调查 | 梳理公司高管的社会关系 → 评估潜在风险 |
| 学术研究 | 整理文献中的引用关系 → 构建学术影响图谱 |

#### 推荐理由

知识图谱是数据分析的高阶应用。这个 Skill 把 OSINT 数据采集 → 实体提取 → 关系建模 → 图谱构建的完整链条封装成一个可执行的流程，对于研究人员和调查记者来说非常有价值。

---

## 📋 其他值得关注

| Skill | 简述 | 推荐指数 |
|-------|------|---------|
| [data-analyst](https://github.com/openclaw/skills/tree/main/skills/oyi77/data-analyst) | 数据可视化、报表生成、SQL 查询、电子表格操作 | ⭐⭐⭐⭐ |
| [senior-data-engineer](https://github.com/openclaw/skills/tree/main/skills/alirezarezvani/senior-data-engineer) | 构建可扩展数据管道的工程级技能 | ⭐⭐⭐⭐ |
| [senior-data-scientist](https://github.com/openclaw/skills/tree/main/skills/alirezarezvani/senior-data-scientist) | 全能数据科学技能，覆盖建模到部署 | ⭐⭐⭐⭐ |
| [data-lineage-tracker](https://github.com/openclaw/skills/tree/main/skills/datadrivenconstruction/data-lineage-tracker) | 追踪数据来源和转换血缘 | ⭐⭐⭐ |
| [yahoo-data-fetcher](https://github.com/openclaw/skills/tree/main/skills/noypearl/yahoo-data-fetcher) | 实时获取雅虎财经股票报价 | ⭐⭐⭐ |
| [ceorater](https://github.com/openclaw/skills/tree/main/skills/ceorater-skills/ceorater) | S&P 500 CEO 绩效机构级分析 | ⭐⭐⭐ |
| [hyperliquid](https://github.com/openclaw/skills/tree/main/skills/k0nkupa/hyperliquid) | Hyperliquid 市场数据只读助手 | ⭐⭐⭐ |
| [douban-sync-skill](https://github.com/openclaw/skills/tree/main/skills/cosformula/douban-sync-skill) | 豆瓣书影音游收藏同步导出 | ⭐⭐⭐ |

---

## 🎯 应用场景总结

### 按用户类型推荐

**数据分析师 / 商业分析师：**
- 必装：CSV Data Pipeline + DuckDB CLI
- 推荐：Data Analyst + Senior Data Scientist
- 场景：日常报表、数据清洗、快速统计分析

**后端开发者 / 全栈工程师：**
- 必装：Supabase + NocoDB
- 推荐：DuckDB CLI（用于日志分析）
- 场景：数据库操作、向量搜索、团队数据协作

**安全研究员 / 调查人员：**
- 必装：OSINT Graph Analyzer
- 推荐：CSV Data Pipeline（数据处理）+ IPInfo（IP 定位）
- 场景：情报收集、关系分析、威胁建模

**数据工程师：**
- 必装：Senior Data Engineer + Data Lineage Tracker
- 推荐：DuckDB CLI + CSV Pipeline
- 场景：ETL 管道、数据血缘追踪、批量数据转换

### 按技术栈推荐

| 技术栈 | 推荐 Skill 组合 |
|--------|-----------------|
| Python 数据分析 | CSV Pipeline + DuckDB + Data Analyst |
| Supabase 技术栈 | Supabase + DuckDB（分析层） |
| 开源 BaaS | NocoDB + Supabase |
| 无依赖快速分析 | CSV Pipeline（纯标准库） |

---

## 📊 推荐指数排名

| 排名 | Skill | 评分 | 核心优势 |
|------|-------|------|---------|
| 🥇 | CSV Data Pipeline | ⭐⭐⭐⭐⭐ | 零依赖、Shell+Python 双层、覆盖面广 |
| 🥈 | DuckDB CLI Specialist | ⭐⭐⭐⭐⭐ | DuckDB 是分析利器、18 种输出格式 |
| 🥉 | Supabase | ⭐⭐⭐⭐ | 后端全栈、向量搜索、生态流行 |
| 4 | NocoDB | ⭐⭐⭐⭐ | Airtable 替代、团队友好 |
| 5 | OSINT Graph Analyzer | ⭐⭐⭐⭐ | 知识图谱、专业领域强 |

---

## 💡 实用建议

1. **组合使用效果更佳**：CSV Pipeline 负责数据清洗，DuckDB 负责查询分析，Supabase 负责数据持久化——三者组合就是一套完整的轻量级数据分析平台。

2. **优先安装零依赖的 Skill**：CSV Pipeline 不需要任何外部依赖，在任何环境下都能用。DuckDB 只需要安装一个二进制文件。这两个是性价比最高的入门组合。

3. **DuckDB 是分析师的最佳朋友**：如果你只能选一个数据分析工具，选 DuckDB。它能直接对 CSV/Parquet/JSON 执行 SQL，不需要导入步骤，速度极快。

4. **关注数据安全**：使用 Supabase 和 NocoDB 等 Skill 时，注意 API Key 和访问权限的管理。建议使用只读凭据进行查询操作。

5. **从简单开始**：先掌握 CSV Pipeline 的 Shell 命令（awk、cut、sort），再学习 Python 层，最后上 DuckDB。循序渐进比一上来就搞全栈管道更高效。

---

> 📌 明日预告：**DevOps & Cloud** 分类——从 CI/CD 管道到云服务管理，探索 OpenClaw 在运维领域的最佳实践。
>
> 本系列每日更新，30 天带你了解 OpenClaw 生态中最值得关注的技能。已发布：AI & LLMs → Apple Apps → Browser Automation → Calendar → Clawdbot Tools → CLI Utilities → Coding Agents → Communication → **Data & Analytics** ✅
