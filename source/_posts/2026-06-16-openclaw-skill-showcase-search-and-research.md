---
title: OpenClaw Skill 每日推荐 - 搜索与研究
tags:
  - openclaw
  - skill
  - search-and-research
categories:
  - 技术推荐
abbrlink: 46482
date: 2026-06-16 11:30:00
---

# 🔍 OpenClaw Skill 每日推荐 — 搜索与研究

今天我们来探索 OpenClaw Skill 生态中最大的分类之一：**搜索与研究（Search & Research）**，包含 **352 个 Skills**，覆盖学术研究、网络搜索、社交媒体情报、电商比价、航班酒店、法律检索等几乎所有"找东西"的场景。

---

## 📊 分类概述

搜索与研究是 OpenClaw 生态中最丰富的分类，这并不意外——AI Agent 最核心的能力之一就是"获取信息"。从学术深度研究到实时社交媒体监控，从航班比价到法律条文检索，352 个 Skills 构成了一张巨大的信息获取网络。

按功能可大致分为以下几个子领域：

| 子领域 | 代表 Skill | 数量级 |
|--------|-----------|--------|
| 学术研究 | arxiv-summarizer-orchestrator, paperzilla | ~30+ |
| 网络搜索 | web-search-pro, hybrid-deep-search | ~20+ |
| 社交媒体 | x-cli, social-intelligence, lead-generation | ~25+ |
| Agent 记忆 | agent-brain, engram-memory, simplemem | ~20+ |
| 航班旅行 | google-flights, duffel, variflight | ~15+ |
| 电商购物 | amazon-data, kroger, naver-shopping | ~15+ |
| 法律医疗 | law-search, medical-clinicaltrials, med-info | ~10+ |
| 知识管理 | boof, mycroft, orchata | ~10+ |

---

## ⭐ 精选 Skill 详解

### 1. web-search-pro — Agent 优先的网络搜索栈

**GitHub:** [openclaw/skills/web-search-pro](https://github.com/openclaw/skills/tree/main/skills/zjianru/web-search-pro)

**核心功能：** 面向 AI Agent 的全栈式搜索解决方案，无需 API Key 即可使用，支持搜索、提取、爬取、站点地图和深度研究流程。

**亮点：**
- **零配置启动** — 内置免费搜索基线，无需注册任何 API
- **可解释路由** — 自动在免费/付费搜索源之间智能切换
- **联邦搜索增益可见** — 让你知道多源搜索带来了多少增量价值
- **内置 extract/crawl/map** — 搜索结果可直接进入内容提取流程

**实用场景：**
- Agent 需要在无 API Key 环境下完成网页搜索
- 需要对搜索结果质量做可解释性分析
- 多轮深度研究任务，搜索 + 提取一体化

**推荐指数：** ⭐⭐⭐⭐⭐

> 💡 如果你的 Agent 只能装一个搜索 Skill，这就是首选。

---

### 2. agent-brain — 本地优先的 Agent 持久记忆

**GitHub:** [openclaw/skills/agent-brain](https://github.com/openclaw/skills/tree/main/skills/dobrinalexandru/agent-brain)

**核心功能：** 基于 SQLite 的本地持久化记忆系统，支持检索/提取循环编排、混合搜索（向量 + 关键词），为 Agent 提供跨会话记忆能力。

**亮点：**
- **SQLite 存储** — 零依赖，数据完全本地
- **混合搜索** — 语义向量 + 关键词双通道检索
- **检索-提取循环** — 自动从对话中提取关键信息存储
- **跨会话持久化** — Agent 重启后记忆不丢失

**实用场景：**
- 长期运行的 Agent 需要记住用户偏好和历史上下文
- 多轮对话中积累知识图谱
- 替代外部数据库的轻量级记忆方案

```bash
# 安装
openclaw skill install dobrinalexandru/agent-brain
```

**推荐指数：** ⭐⭐⭐⭐⭐

> 💡 记忆是智能的基础。没有持久记忆的 Agent 每次对话都是从零开始，agent-brain 解决了这个问题。

---

### 3. super-research — 终极 AI 研究系统

**GitHub:** [openclaw/skills/super-research](https://github.com/openclaw/skills/tree/main/skills/heldinhow/super-research)

**核心功能：** 融合 8 个顶级研究 Skill 的元技能（meta-skill），提供一站式深度研究框架。

**亮点：**
- **8 合 1** — 整合多个研究 Skill 的最佳实践
- **系统化研究流程** — 从问题分解到报告生成的完整链路
- **多源交叉验证** — 降低单一信息源偏差

**实用场景：**
- 需要对某个技术领域做全面调研
- 竞品分析、市场研究
- 学术文献综述

**推荐指数：** ⭐⭐⭐⭐

> 💡 适合"大活儿"——当你需要一份完整的研究报告而非简单搜索时使用。

---

### 4. arxiv-summarizer-orchestrator — arXiv 论文自动收集与报告

**GitHub:** [openclaw/skills/arxiv-summarizer-orchestrator](https://github.com/openclaw/skills/tree/main/skills/xukp20/arxiv-summarizer-orchestrator)

**核心功能：** 端到端的 arXiv 论文收集与摘要编排技能，使用三个子技能协作完成定期论文追踪和报告生成。

**亮点：**
- **三技能协作** — 论文发现 → 批量处理 → 报告生成
- **定期运行** — 可配置为定时任务，每天自动追踪新论文
- **结构化报告** — 输出格式化的论文摘要报告

**实用场景：**
- 研究者每天追踪特定领域的 arXiv 新论文
- 团队周报中需要包含最新论文动态
- 自动构建个人论文阅读列表

```bash
# 安装
openclaw skill install xukp20/arxiv-summarizer-orchestrator
```

**推荐指数：** ⭐⭐⭐⭐

> 💡 对科研工作者来说，这个 Skill 相当于一个不知疲倦的文献助手。

---

### 5. social-intelligence — AI 驱动的社交媒体情报

**GitHub:** [openclaw/skills/social-intelligence](https://github.com/openclaw/skills/tree/main/skills/atyachin/social-intelligence)

**核心功能：** 跨 Twitter、Instagram、Reddit 的 AI 驱动社交媒体研究，索引超过 15 亿条帖子。

**亮点：**
- **1.5B+ 帖子索引** — 覆盖三大主流社交平台
- **自然语言查询** — 用人话描述需求，自动转化为搜索策略
- **实时数据** — 获取最新的社交媒体动态

**实用场景：**
- 品牌舆情监控
- 产品反馈收集
- 行业趋势追踪
- 竞品社交媒体策略分析

**推荐指数：** ⭐⭐⭐⭐

> 💡 市场营销和公关人员的利器，也是做用户调研的快捷通道。

---

## 🏆 推荐指数排名

| 排名 | Skill | 推荐指数 | 一句话推荐 |
|------|-------|---------|-----------|
| 🥇 | web-search-pro | ⭐⭐⭐⭐⭐ | 零配置搜索首选 |
| 🥈 | agent-brain | ⭐⭐⭐⭐⭐ | Agent 记忆必备 |
| 🥉 | super-research | ⭐⭐⭐⭐ | 深度研究瑞士军刀 |
| 4 | arxiv-summarizer-orchestrator | ⭐⭐⭐⭐ | 科研文献自动化 |
| 5 | social-intelligence | ⭐⭐⭐⭐ | 社交媒体情报站 |

---

## 💡 应用场景总结

**🧑‍🔬 科研工作者：** `arxiv-summarizer-orchestrator` + `paperzilla` + `pubmed-edirect` — 从论文发现到阅读到笔记的全流程自动化

**🤖 Agent 开发者：** `agent-brain` + `web-search-pro` + `simplemem` — 搜索 + 记忆，Agent 的眼睛和大脑

**📈 市场营销：** `social-intelligence` + `google-trends` + `seo-content-engine` — 从趋势发现到内容创作的一站式方案

**✈️ 旅行规划：** `google-flights` + `airbnb` + `camino-hotel-finder` — 航班 + 住宿 + 地点搜索全覆盖

**⚖️ 法律/医疗：** `law-search` + `medical-clinicaltrials` + `med-info` — 专业领域的精准信息检索

---

## 🔧 实用建议

1. **搜索 Skill 选一个主力** — `web-search-pro` 是零配置最优解，`hybrid-deep-search` 适合需要深度分析的场景
2. **记忆系统尽早装** — Agent 没有记忆就像失忆症患者，`agent-brain` 是轻量首选
3. **组合使用效果翻倍** — 搜索 + 记忆 + 研究编排，三个 Skill 组合就是完整的"研究助手"
4. **关注免费方案** — 很多搜索 Skill 声称免费但需要 API Key，`web-search-pro` 和 `meyhem-search` 是真正的零成本方案

---

*📌 这是 OpenClaw Skill 每日推荐系列第 23 篇，明天我们将介绍「安全与密码」分类。*
