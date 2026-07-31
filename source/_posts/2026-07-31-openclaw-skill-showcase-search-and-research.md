---
title: OpenClaw Skill 每日推荐 - 搜索与研究
tags:
  - openclaw
  - skill
  - search-and-research
categories:
  - 技术推荐
abbrlink: 46484
date: 2026-07-31 11:30:00
---

# OpenClaw Skill 每日推荐 - 搜索与研究

> 📅 2026年7月31日 | 🏷️ 分类：Search & Research | 📊 共 352 个 Skills

## 今日分类概述

**搜索与研究（Search & Research）** 是 OpenClaw 生态中最大的技能分类之一，汇集了 352 个与信息检索、深度研究、学术分析、知识管理等相关的 Skills。从简单的网页搜索到多轮深度研究，从 arXiv 论文追踪到社交媒体情报收集，这个分类几乎覆盖了 AI Agent 在信息获取和处理方面的所有需求。

无论你是做学术研究、竞品分析、市场调研，还是简单地查资料，这个分类都有对应的 Skill 可以大幅提升效率。

---

## 精选 Skill 详解

### 1. 🔬 Super Research — 终极 AI 研究系统

**GitHub:** [heldinhow/super-research](https://github.com/openclaw/skills/tree/main/skills/heldinhow/super-research/SKILL.md)

**⭐ 推荐指数：★★★★★ (5/5)**

#### 核心功能

Super Research 是一个"集大成者"——它合并了 8 个顶级研究技能的精华，形成一个统一的研究框架。系统会根据查询类型自动选择最佳策略：

- **快速查询**：直接调用 Web 搜索，秒级返回
- **深度研究**：多源穷尽分析，生成完整报告
- **学术研究**：聚焦学术文献，支持文献综述格式
- **并行研究**：多主题同时调查，提升效率

#### 技术实现

Super Research 的核心是一个**研究分类器**，它会先判断查询的类型和复杂度，然后路由到对应的处理流程：

```
用户查询 → 研究分类 → 路由策略
                        ├─ 快速查询 → Web Search (Google/Bing)
                        ├─ 深度研究 → 多源分析 (Web + News + GitHub + Papers)
                        ├─ 学术研究 → arXiv + 学术数据库
                        └─ 并行研究 → sessions_spawn 多线程
```

它合并的 8 个技能及其评分：

| 技能 | 评分 |
|------|------|
| academic-deep-research | 3.431 |
| deep-research-pro | 3.420 |
| parallel-ai-research | 3.379 |
| research-engine | 3.376 |
| research-cog | 3.373 |
| research-tracker | 3.368 |
| parallel-deep-research | 3.360 |
| in-depth-research | 3.354 |

#### 实用场景

```bash
# 快速对比研究
Research topic: "OpenCode vs Cursor 2026 comparison"
Depth: Executive summary + technical deep-dive

# 学术文献综述
Theme: Impact of AI on developer productivity
Key questions: What studies exist? Methodology? Results?
Format: Literature review
```

#### 亮点

- 自动判断研究深度，避免过度研究或研究不足
- 支持执行摘要、关键发现、趋势分析、发展计划等多种输出格式
- 质量分级体系：学术/官方 > 技术博客 > 论坛讨论

---

### 2. 📚 Academic Deep Research — 学术级深度研究

**GitHub:** [kesslerio/academic-deep-research](https://github.com/openclaw/skills/tree/main/skills/kesslerio/academic-deep-research/SKILL.md)

**⭐ 推荐指数：★★★★☆ (4.5/5)**

#### 核心功能

这是一个严格按照学术标准执行的研究技能，最大的特点是**透明、可复现**——不是黑盒 API 调用，而是有完整方法论的研究流程。

核心架构包含**三个停止点**（用户交互节点）：

1. **Phase 1 - 初始接洽**：提出 2-3 个澄清问题，确认研究范围
2. **Phase 2 - 研究计划**：展示完整研究方案，等待用户批准
3. **Phase 3 - 研究执行**：每个主题至少 2 轮研究循环
4. **Phase 4 - 最终报告**：学术叙事格式的完整报告

#### 技术实现

每个主题必须完成**两轮研究循环**：

**Cycle 1 - 初始全景扫描：**
- `web_search` (count=20) 广撒网
- 提取关键模式、形成初始假设
- 识别知识缺口和矛盾点

**Cycle 2 - 深度定向调查：**
- 针对 Cycle 1 的缺口进行定向搜索
- `web_fetch` 深入原始来源
- 测试和修正初始假设

```python
# 并行研究策略示例
sessions_spawn(
    task="Research AI coding assistant market landscape. Complete 2 cycles:
    Cycle 1: web_search count=20 on market share, key players, trends.
    Cycle 2: web_fetch on top 5 sources, deep dive on contradictions.
    Return: Key findings, confidence levels, gaps remaining, source list."
)
```

#### 证据等级体系

| 等级 | 来源类型 | 置信度 |
|------|----------|--------|
| 1 | 系统综述 / 元分析 | 最高 |
| 2 | 随机对照试验 | 高 |
| 3 | 队列 / 纵向研究 | 中高 |
| 4 | 专家共识 / 指南 | 中 |
| 5 | 横断面 / 观察研究 | 中 |
| 6 | 专家意见 / 社论 | 较低 |
| 7 | 媒体报道 / 博客 | 最低 |

#### 亮点

- 严格遵循 APA 7th 引用格式
- 每个结论必须有多源支撑
- 所有矛盾点必须被记录和分析
- 最终报告采用学术叙事体（非列表式）

---

### 3. 🚀 Hybrid Deep Search — 智能路由搜索

**GitHub:** [scsun1978/hybrid-deep-search](https://github.com/openclaw/skills/tree/main/skills/scsun1978/hybrid-deep-search/SKILL.md)

**⭐ 推荐指数：★★★★☆ (4/5)**

#### 核心功能

Hybrid Deep Search 解决了一个很实际的问题：**什么时候该用免费搜索，什么时候该用付费深度分析？** 它通过一个智能路由器自动判断查询复杂度，选择最优搜索策略。

```
用户查询 → 查询分析器 (router.py)
            ↓
            ├─ 简单问题 → Brave API (免费、快速、<2s)
            ├─ 复杂问题 → OpenAI Codex (深度分析、付费、5-30s)
            └─ 手动模式 → 用户指定
```

#### 复杂度评分系统

路由器基于 0-10 分的评分决定使用哪个引擎：

| 评分因素 | 分值 | 说明 |
|----------|------|------|
| 关键词匹配 | +6 | compare/analyze/explain/why/how |
| 查询长度 | +2 | >15词 +2, >8词 +1 |
| 问题模式 | +1 | 复杂疑问句 |
| 技术术语 | +1 | API/framework/architecture |
| 简单关键词惩罚 | -2 | what is/who is/list of |

**决策阈值：** 0-2 分 → Brave API（快速），3+ 分 → OpenAI Codex（深度）

#### 使用示例

```bash
# 自动模式（推荐）
python3 scripts/deep_search.py "your query"

# 快速搜索（免费）
python3 scripts/deep_search.py "what is OpenClaw?" --mode quick

# 深度分析（付费）
python3 scripts/deep_search.py "compare LangChain vs LlamaIndex" --mode codex

# 学术聚焦
python3 scripts/deep_search.py "AI agent frameworks research" --mode codex --focus academic
```

#### 聚焦模式

| 模式 | 用途 |
|------|------|
| `web` | 通用网页搜索 |
| `academic` | 学术文献 |
| `news` | 新闻资讯 |
| `youtube` | 视频内容 |

#### 亮点

- 成本自动优化：简单问题不浪费 API 额度
- 支持批量搜索
- JSON/Markdown/纯文本多种输出格式
- 透明的路由决策（可查看评分过程）

---

### 4. 🔍 OpenClaw Free Web Search — 免费私有搜索

**GitHub:** [wd041216-bit/openclaw-free-web-search](https://github.com/openclaw/skills/tree/main/skills/wd041216-bit/openclaw-free-web-search/SKILL.md)

**⭐ 推荐指数：★★★★☆ (4/5)**

#### 核心功能

完全免费、完全本地的网页搜索方案——零 API 密钥、零成本、零追踪。基于自托管的 SearXNG 和 Scrapling 反爬引擎实现。

**核心架构：**
- **SearXNG**：自托管元搜索引擎，聚合 Bing/DuckDuckGo/Google/Startpage/Qwant 多引擎结果
- **Scrapling**：本地反爬引擎，三级抓取器应对不同防护级别
- **Agent Reach**：意图感知的查询扩展

#### 三级抓取器

| 级别 | 抓取器 | 适用场景 |
|------|--------|----------|
| Tier 1 | `Fetcher` | 普通网站 |
| Tier 2 | `StealthyFetcher` | Cloudflare / 反爬网站 |
| Tier 3 | `DynamicFetcher` | 重度 JS / SPA 网站 |

自动降级策略：`auto` 模式从 Tier 1 开始，失败则升级到 Tier 2，再失败到 Tier 3。

#### 意图感知搜索

```bash
python3 scripts/search_local_web.py \
  --query "YOUR QUERY" \
  --intent research \
  --limit 5
```

| 意图 | 最佳场景 | 引擎选择 |
|------|----------|----------|
| `general` | 通用查询 | 全部引擎 |
| `factual` | 事实/定义/文档 | Google/Bing |
| `news` | 最新事件 | Bing/ DuckDuckGo |
| `research` | 论文/技术深度 | Google/Bing + 学术扩展 |
| `privacy` | 敏感查询 | 仅 DuckDuckGo/Startpage/Qwant |

#### 反幻觉验证

搜索结果会标注 `[cross-validated]` 标签，表示该结果在多个引擎中同时出现，可信度更高。系统建议：

1. 优先查看 `[cross-validated]` 结果
2. 用 `browse_page.py` 深入阅读原文
3. 检查置信度（HIGH/MEDIUM/LOW）
4. **永远不要仅基于摘要做出事实判断**

#### 亮点

- 完全本地运行，无数据外泄
- 多引擎交叉验证降低幻觉风险
- 三级反爬抓取器应对各种网站防护
- 公共回退服务（searx.be）保证可用性

---

### 5. 📄 ArXiv Summarizer Orchestrator — 论文追踪流水线

**GitHub:** [xukp20/arxiv-summarizer-orchestrator](https://github.com/openclaw/skills/tree/main/skills/xukp20/arxiv-summarizer-orchestrator/SKILL.md)

**⭐ 推荐指数：★★★★☆ (4/5)**

#### 核心功能

一个端到端的 arXiv 论文收集和报告编排系统，由三个子技能协同工作，形成完整的论文研究流水线。支持定期调度（daily/weekly/monthly），非常适合科研人员持续跟踪领域动态。

#### 三阶段流水线

```
Stage A: 收集        Stage B: 处理        Stage C: 报告
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│  查询规划    │    │  批量下载    │    │  摘要汇总    │
│  论文检索    │ →  │  逐篇阅读    │ →  │  模板渲染    │
│  去重合并    │    │  摘要生成    │    │  最终报告    │
└─────────────┘    └─────────────┘    └─────────────┘
```

**Stage A - 收集（arxiv-search-collector）：**
1. 初始化运行目录
2. 模型根据主题生成多个聚焦查询
3. 批量执行查询，获取论文元数据
4. 模型审阅结果，决定保留哪些论文
5. 合并选中论文

**Stage B - 处理（arxiv-paper-processor）：**
1. 批量下载论文源码（LaTeX）或 PDF
2. 逐篇阅读并生成结构化摘要
3. 支持并行处理（默认最多 5 篇同时）
4. 摘要保存为 `summary.md`

**Stage C - 报告（arxiv-batch-reporter）：**
1. 收集所有摘要生成汇总文件
2. 模型基于汇总编写报告模板
3. 脚本注入每篇论文的关键信息
4. 生成最终层级化报告

#### 并行处理策略

```python
# 并行模式（默认，适合大批量）
paper_processing_mode = "subagent_parallel"
max_parallel_papers = 5  # 同时处理 5 篇

# 串行模式（适合深度阅读）
paper_processing_mode = "serial"
# 一次只处理一篇
```

#### 多语言支持

通过 `--language` 参数控制所有输出的语言，包括中间文件和最终报告：

```bash
python3 scripts/init_collection_run.py --language Chinese
```

#### 亮点

- 完整的流水线设计，从查询到报告一站式完成
- 支持定时调度，适合持续追踪研究前沿
- 并行处理大幅提升大批量论文处理效率
- 模板化报告确保输出格式一致

---

## 应用场景总结

| 场景 | 推荐 Skill | 理由 |
|------|-----------|------|
| 日常快速查资料 | Hybrid Deep Search | 自动选择免费/付费策略，成本最优 |
| 学术文献综述 | Academic Deep Research | 严格学术标准，APA 引用，多轮研究 |
| 综合研究任务 | Super Research | 集成 8 个研究技能，自动判断深度 |
| 隐私敏感搜索 | OpenClaw Free Web Search | 完全本地，零追踪 |
| 持续论文追踪 | ArXiv Summarizer Orchestrator | 流水线式处理，支持定时调度 |
| 竞品分析 | Super Research + Academic Deep Research | 多源分析 + 证据等级 |
| 市场调研 | Hybrid Deep Search (codex mode) | 深度分析 + 多源综合 |
| 社交媒体研究 | Social Intelligence / Twitter API | 1.5B+ 帖子索引，实时搜索 |

---

## 推荐指数排名

| 排名 | Skill | 推荐指数 | 核心优势 |
|------|-------|----------|----------|
| 1 | Super Research | ★★★★★ | 集大成者，自动路由，覆盖全场景 |
| 2 | Academic Deep Research | ★★★★☆ | 学术级严谨，APA 引用，可复现 |
| 3 | Hybrid Deep Search | ★★★★☆ | 智能成本优化，免费/付费自动切换 |
| 4 | OpenClaw Free Web Search | ★★★★☆ | 完全免费私有，多引擎交叉验证 |
| 5 | ArXiv Summarizer Orchestrator | ★★★★☆ | 流水线设计，适合持续追踪 |

---

## 实用建议

### 1. 根据需求选择合适的 Skill

不要总用最强大的工具——**适合的才是最好的**。简单查询用 Hybrid Deep Search 的 quick 模式就够了，深度研究再上 Super Research 或 Academic Deep Research。

### 2. 组合使用效果更佳

```bash
# 先用 Free Web Search 做初步调研
# 再用 Academic Deep Research 做深度分析
# 最后用 ArXiv Summarizer 持续追踪
```

### 3. 注意成本控制

- 免费方案：OpenClaw Free Web Search + Brave API
- 付费方案：Hybrid Deep Search (codex mode) + OpenAI API
- 建议：用 Hybrid Deep Search 的 auto 模式自动平衡成本

### 4. 学术研究者的最佳实践

用 Academic Deep Research 做文献综述，配合 ArXiv Summarizer Orchestrator 定期追踪新论文。两者都支持 APA 引用和结构化报告输出，可以直接用于论文写作。

### 5. 注意数据隐私

如果你的研究涉及敏感话题，优先使用 OpenClaw Free Web Search 的 `privacy` 意图模式，仅使用 DuckDuckGo/Startpage/Qwant 引擎，避免查询被追踪。

---

> 💡 **明日预告**：Security & Passwords 分类——探索 OpenClaw 生态中的安全审计、密码管理和隐私保护技能。
>
> 📖 **系列导航**：这是 OpenClaw Skill 每日推荐系列的第 22 篇（共 30 篇）。[查看全部](/tags/openclaw/)
