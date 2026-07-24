---
title: OpenClaw Skill 每日推荐 - 搜索与研究
tags:
  - openclaw
  - skill
  - search-and-research
categories:
  - 技术推荐
abbrlink: 46482
date: 2026-06-15 11:30:00
description: "搜索与研究是 AI Agent 最核心的能力之一。这个分类的 352 个 Skill 可以粗分为以下几个子方向："
keywords: "openclaw, skill, 每日推荐, 搜索与研究, search-and-research, 技术推荐"
---

# 🔍 OpenClaw Skill 每日推荐 — 搜索与研究

> Search & Research 分类共收录 **352 个 Skills**，是 OpenClaw 生态中最庞大的分类之一。从学术文献检索到社交媒体情报，从实时价格查询到深度研究框架，几乎涵盖了信息获取的所有维度。

---

## 📋 今日分类概述

搜索与研究是 AI Agent 最核心的能力之一。这个分类的 352 个 Skill 可以粗分为以下几个子方向：

| 子方向 | 代表 Skill | 数量 |
|--------|-----------|------|
| 学术研究 | academic-deep-research, arxiv-* | ~40 |
| 网页搜索 | hybrid-deep-search, openclaw-free-web-search | ~30 |
| 社交媒体情报 | social-intelligence, twitter-api-alternative | ~25 |
| 知识管理与 RAG | cheese-brain, ragflow, orchata | ~35 |
| 金融数据 | jquants-mcp, vietstock, priceforagent | ~20 |
| 航旅搜索 | duffel, google-flights, variflight | ~15 |
| 电商比价 | amazon-data, naver-shopping, forage-shopping | ~15 |
| 法律与医疗 | legalfrance, med-info, medical-clinicaltrials | ~10 |
| 其他垂直搜索 | torah-scholar, geepers-etymology, lyrics-search | ~50+ |

---

## ⭐ 精选 Skill 详解

### 1. Super Research — 终极研究系统

- **GitHub:** [openclaw/skills/super-research](https://github.com/openclaw/skills/tree/main/skills/heldinhow/super-research/SKILL.md)
- **推荐指数:** ⭐⭐⭐⭐⭐

**核心功能：** 将 8 个顶级研究 Skill 融合为一个强大框架，是目前最全面的一站式研究解决方案。

**技术实现：** 元技能（Meta-Skill）架构，在运行时根据任务类型动态编排子技能——先规划搜索策略，再并行调用多个搜索引擎和知识源，最后综合生成结构化报告。

**实用场景：**
- 竞品分析：自动搜索目标公司信息、整理对比表格
- 技术调研：多源检索技术方案，输出可行性评估
- 市场研究：跨平台数据采集，生成趋势报告

```bash
# 安装
openclaw skill add heldinhow/super-research
# 使用
openclaw run "对 Rust 在嵌入式开发中的应用做一份深度调研"
```

---

### 2. Hybrid Deep Search — 智能路由搜索

- **GitHub:** [openclaw/skills/hybrid-deep-search](https://github.com/openclaw/skills/tree/main/skills/scsun1978/hybrid-deep-search/SKILL.md)
- **推荐指数:** ⭐⭐⭐⭐⭐

**核心功能：** 在 Brave API（免费、快速）和 OpenAI Codex（深度分析、付费）之间智能路由，兼顾成本与深度。

**技术实现：** 双引擎搜索架构——简单事实查询走 Brave 路径（零成本），复杂分析任务自动切换到 Codex 深度研究模式。搜索质量可视化，让你知道该信任结果多少。

**实用场景：**
- 日常问答：快速获取事实，不浪费 API 额度
- 深度课题：需要多步推理的复杂问题自动升级
- 预算控制：自动在免费/付费之间找最优路径

```bash
# 安装
openclaw skill add scsun1978/hybrid-deep-search
```

---

### 3. OpenClaw Free Web Search — 零成本隐私搜索

- **GitHub:** [openclaw/skills/openclaw-free-web-search](https://github.com/openclaw/skills/tree/main/skills/wd041216-bit/openclaw-free-web-search/SKILL.md)
- **推荐指数:** ⭐⭐⭐⭐⭐

**核心功能：** 自托管 SearXNG + Scrapling 反爬虫 + 多源交叉验证。**零 API Key，零成本**，并告诉你该多大程度信任结果。

**技术实现：**
- 自托管 SearXNG 作为搜索聚合器
- Scrapling 处理反爬虫和验证码
- 多源交叉验证评估结果可信度
- 输出可信度评分（类似学术引用的置信区间）

**实用场景：**
- 不想付费的搜索需求
- 对隐私敏感的查询
- 需要多个来源佐证的事实核查

```bash
# 安装
openclaw skill add wd041216-bit/openclaw-free-web-search
```

---

### 4. Cheese Brain — DuckDB 驱动的知识管理

- **GitHub:** [openclaw/skills/cheese-brain](https://github.com/openclaw/skills/tree/main/skills/mhugo22/cheese-brain/SKILL.md)
- **推荐指数:** ⭐⭐⭐⭐

**核心功能：** 基于 DuckDB 的本地知识管理系统，支持 22+ 实体类型（项目、联系人、工具等）的快速检索。

**技术实现：** 利用 DuckDB 的列式存储和 SQL 查询引擎，在本地实现毫秒级语义检索。无需外部向量数据库，零配置启动。支持项目、联系人、工具、笔记等多种实体类型的关联查询。

**实用场景：**
- 个人知识库：统一管理笔记、项目、联系人
- 研究资料整理：跨类型关联检索
- Agent 长期记忆：替代传统向量数据库的轻量方案

```bash
# 安装
openclaw skill add mhugo22/cheese-brain
```

---

### 5. Academic Deep Research — 学术深度研究

- **GitHub:** [openclaw/skills/academic-deep-research](https://github.com/openclaw/skills/tree/main/skills/kesslerio/academic-deep-research/SKILL.md)
- **推荐指数:** ⭐⭐⭐⭐

**核心功能：** 透明、严谨的学术研究，强调可溯源性和方法论。

**技术实现：** 分阶段研究流程——问题分解 → 文献检索 → 证据评估 → 综合分析 → 报告生成。每一步都保留完整引用链，确保研究可复现、可审计。

**实用场景：**
- 论文写作前的文献综述
- 技术方案的学术支撑
- 研究生课题调研

```bash
# 安装
openclaw skill add kesslerio/academic-deep-research
```

---

## 🏆 推荐指数排名

| 排名 | Skill | 推荐指数 | 核心亮点 |
|------|-------|---------|---------|
| 1 | Super Research | ⭐⭐⭐⭐⭐ | 8 合 1 终极研究框架 |
| 2 | Hybrid Deep Search | ⭐⭐⭐⭐⭐ | 智能路由，成本最优 |
| 3 | OpenClaw Free Web Search | ⭐⭐⭐⭐⭐ | 零成本 + 可信度评分 |
| 4 | Cheese Brain | ⭐⭐⭐⭐ | DuckDB 本地知识管理 |
| 5 | Academic Deep Research | ⭐⭐⭐⭐ | 可溯源的学术研究 |

---

## 🎯 应用场景总结

### 场景一：日常信息查询
**推荐组合：** OpenClaw Free Web Search（默认） + Hybrid Deep Search（升级）

日常事实查询走免费路径，遇到复杂问题自动切换深度模式。零成本覆盖 90% 的搜索需求。

### 场景二：学术/技术调研
**推荐组合：** Academic Deep Research + arxiv-cli-tools + Paperzilla

从文献检索到论文阅读到知识整理的完整链路，适合研究型工作。

### 场景三：社交媒体情报
**推荐组合：** Social Intelligence + X-Monitor + Twitter API Alternative

实时监控社交动态、分析舆论趋势、发现潜在客户。1.5B+ 帖子索引量。

### 场景四：个人知识管理
**推荐组合：** Cheese Brain + RAGFlow + Orchata

从文件摄入到语义检索到知识图谱，构建属于自己的第二大脑。

---

## 💡 实用建议

1. **从免费开始：** 先装 `openclaw-free-web-search`，零成本体验搜索能力
2. **按需升级：** 深度研究需求再加 `super-research` 或 `hybrid-deep-search`
3. **垂直深耕：** 特定领域（法律、医疗、金融）有专门的 Skill，比通用搜索更精准
4. **组合使用：** 搜索 + 记忆的组合（如 Cheese Brain + Free Web Search）比单一 Skill 更强大
5. **注意成本：** 部分 Skill 依赖付费 API，安装前看清说明

---

> 📌 本系列每日更新，明日预告：**安全与密码 (Security & Passwords)** 分类
>
> 上一篇：[生产力与任务](https://www.daoyuly.cn) | 系列索引：[OpenClaw Skill 每日推荐](https://www.daoyuly.cn)
