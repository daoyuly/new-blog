---
title: OpenClaw Skill 每日推荐 - 搜索与研究
date: 2026-09-08 11:35:00
tags:
  - openclaw
  - skill
  - search-and-research
categories:
  - 技术推荐
---

# OpenClaw Skill 每日推荐 - 搜索与研究

> 🔍 **今日分类：Search & Research（搜索与研究）**
> 
> 共收录 **352 个 Skills**，是 OpenClaw 生态中最大的分类之一。从快速网页搜索到深度学术论文分析，从社交媒体舆情监控到本地 RAG 知识库，这个分类覆盖了信息获取与研究的全链路。

---

## 📊 分类概述

搜索与研究分类是 OpenClaw 生态中技能数量最多、覆盖面最广的分类之一。352 个 Skills 可以大致分为以下几个子方向：

| 子方向 | 代表能力 | 典型场景 |
|--------|---------|---------|
| 网页搜索 | 多引擎聚合搜索、反爬虫穿透 | 实时信息获取、事实核查 |
| 学术研究 | arXiv 论文追踪、PubMed 检索 | 科研文献管理、论文综述 |
| 社交媒体研究 | Twitter/X、Instagram、Reddit 数据挖掘 | 舆情分析、线索发现 |
| 本地知识库 | PDF→Markdown→RAG 索引 | 文档分析、私有知识管理 |
| 深度研究 | 多步规划、多源综合分析 | 行业报告、竞品分析 |

今天精选 5 个最具代表性的 Skill 深入解析。

---

## 🏆 精选 Skill 详解

### 1. Super Research — 终极 AI 研究系统

**GitHub**: [heldinhow/super-research](https://github.com/openclaw/skills/tree/main/skills/heldinhow/super-research/SKILL.md)

**⭐ 推荐指数：★★★★★ (5/5)**

#### 核心功能

Super Research 是一个融合了 8 个顶级研究 Skill 精华的综合性研究框架。它不是简单的搜索工具，而是一个完整的研究方法论系统：

- **研究分类引擎**：自动判断查询类型（快速查询 / 深度研究 / 学术研究 / 并行研究），选择最优策略
- **多源搜索**：覆盖 Web 搜索、新闻、GitHub、学术论文、开发者文档等
- **质量分级体系**：学术/官方来源 > 技术博客 > 论坛讨论，确保信息可靠性
- **多种输出格式**：执行摘要、关键发现（附来源）、可执行洞察、趋势分析、短中长期发展计划

#### 技术实现

Super Research 融合了以下 8 个高评分 Skill 的核心能力：

| 来源 Skill | 评分 | 贡献能力 |
|-----------|------|---------|
| academic-deep-research | 3.431 | 学术研究方法论 |
| deep-research-pro | 3.420 | 深度搜索 + 质量分级 |
| parallel-ai-research | 3.379 | 并行多主题研究 |
| research-engine | 3.376 | 多源搜索引擎 |
| research-cog | 3.373 | 研究认知框架 |
| research-tracker | 3.368 | 研究进度追踪 |
| parallel-deep-research | 3.360 | 深度并行搜索 |
| in-depth-research | 3.354 | 深度分析流程 |

#### 实用场景

```
# 快速技术对比
研究主题: "OpenCode vs Cursor 2026 对比"
深度: 执行摘要 + 技术深挖
格式: 带来源的报告

# 学术文献综述
主题: AI 对开发者生产力的影响
关键问题:
- 现有哪些研究？
- 研究方法论是什么？
- 核心结论是什么？
格式: 文献综述
```

#### 工作流程

1. **分类** → 判断快速还是深度？
2. **规划** → 关键词、来源、角度
3. **搜索** → 多源并行
4. **分析** → 提取关键点
5. **综合** → 整合为报告
6. **引用** → 标注来源

---

### 2. Boof — 本地 PDF 文档 RAG 引擎

**GitHub**: [chiefsegundo/boof](https://github.com/openclaw/skills/tree/main/skills/chiefsegundo/boof/SKILL.md)

**⭐ 推荐指数：★★★★★ (5/5)**

#### 核心功能

Boof 是一个本地优先的文档处理系统，核心流程是 `PDF → Markdown → RAG 索引 → Token 高效分析`。它的核心理念是：**文档留在本地，只有相关片段发送给 LLM**。

- **本地转换**：使用 Marker（本地 ML 模型）将 PDF 转为 Markdown，无需调用外部 API
- **语义索引**：通过 QMD 建立语义搜索索引
- **按需检索**：只把相关片段发送给 LLM，极大节省 Token 消耗
- **批量处理**：支持跨文档查询和批量索引

#### 技术实现

```bash
# 基本用法：转换 + 索引
bash {SKILL_DIR}/scripts/boof.sh /path/to/document.pdf

# 指定集合名称
bash {SKILL_DIR}/scripts/boof.sh /path/to/document.pdf --collection my-project

# 语义查询
qmd query "你的问题" -c collection-name

# 精确搜索
qmd search "关键词" -c collection-name
```

#### 四种使用策略

| 场景 | 策略 | 优势 |
|------|------|------|
| 分析论文特定方面 | Boof + 语义查询 | 最省 Token、最聚焦 |
| 总结整个文档 | Boof + 分段阅读 + 逐节摘要 | 不会丢失上下文 |
| 跨论文对比 | Boof 全部论文 → 统一集合查询 | 跨文档发现关联 |
| 定位特定内容 | `qmd search` 精确匹配 | 快速定位 |

#### 关键优势

- **隐私**：文档不离开本地
- **经济**：只发送相关片段，不烧 Token
- **精准**：语义搜索 + 精确匹配双模式
- **可扩展**：支持批量处理和跨文档查询

---

### 3. OpenClaw Free Web Search — 零成本本地搜索引擎

**GitHub**: [wd041216-bit/openclaw-free-web-search](https://github.com/openclaw/skills/tree/main/skills/wd041216-bit/openclaw-free-web-search/SKILL.md)

**⭐ 推荐指数：★★★★☆ (4.5/5)**

#### 核心功能

这是一个完全免费、无需 API Key 的本地网页搜索系统，由自托管 SearXNG + Scrapling 反爬虫引擎驱动。

- **多引擎并行搜索**：Bing、DuckDuckGo、Google、Startpage、Qwant 五引擎聚合
- **意图感知查询扩展**：根据查询意图自动选择引擎和优化查询
- **三级浏览穿透**：Fetcher → StealthyFetcher → DynamicFetcher，逐级应对反爬虫
- **跨引擎反幻觉验证**：标记多引擎交叉验证的结果，降低幻觉风险

#### 意图类型与适用场景

| 意图类型 | 适用场景 | 引擎选择 |
|---------|---------|---------|
| `general` | 默认混合查询 | 全引擎 |
| `factual` | 事实/定义/官方文档 | 偏权威引擎 |
| `news` | 最新事件/突发新闻 | 新闻优先 |
| `research` | 论文/GitHub/技术深度 | 学术+代码引擎 |
| `tutorial` | 教程/代码示例 | How-to 优先 |
| `comparison` | A vs B/优缺点 | 对比类引擎 |
| `privacy` | 敏感查询 | DuckDuckGo/Startpage/Qwant |

#### 三级反爬虫穿透

```
Tier 1: Fetcher（快速模式）     → 普通网站
Tier 2: StealthyFetcher（隐身）  → Cloudflare/反爬网站
Tier 3: DynamicFetcher（动态）  → 重度 JS/SPA 网站
```

#### 使用示例

```bash
# 意图搜索
python3 scripts/search_local_web.py \
  --query "Kubernetes networking best practices" \
  --intent research \
  --limit 5

# 新鲜度控制
python3 scripts/search_local_web.py \
  --query "AI regulation 2026" \
  --freshness hour

# 浏览网页全文
python3 scripts/browse_page.py \
  --url "https://example.com/article" \
  --mode stealth \
  --max-words 600
```

#### 隐私与安全

- 所有查询默认发送到**本地 SearXNG**实例
- 仅在本地服务不可用时回退到公共 `searx.be`
- 无 API Key、无遥测、无个人数据外泄

---

### 4. ArXiv Summarizer Orchestrator — 学术论文自动追踪系统

**GitHub**: [xukp20/arxiv-summarizer-orchestrator](https://github.com/openclaw/skills/tree/main/skills/xukp20/arxiv-summarizer-orchestrator/SKILL.md)

**⭐ 推荐指数：★★★★☆ (4/5)**

#### 核心功能

这是一个端到端的 arXiv 论文自动化收集和报告系统，由三个子 Skill 协同工作，支持定时调度，适合科研工作者持续追踪学术前沿。

#### 三阶段流水线

```
Stage A: arxiv-search-collector（收集）
  → 生成查询计划 → 批量检索 → 去重合并 → 人工筛选
  
Stage B: arxiv-paper-processor（处理）
  → 批量下载源码/PDF → 提取内容 → 生成结构化摘要
  
Stage C: arxiv-batch-reporter（报告）
  → 汇总所有摘要 → 生成模板 → 脚本注入最终报告
```

#### 关键特性

- **多语言支持**：通过 `--language` 参数控制所有输出语言
- **并行处理**：默认 `subagent_parallel` 模式，最大 5 篇论文并行处理
- **增量收集**：支持 `--incremental` 增量合并，避免重复下载
- **定时调度**：适合 cron 定时执行，支持每日/每周/每月频率
- **回溯窗口**：支持 `1d`、`7d`、`30d` 等回溯时间范围

#### 输出结构

```
<output-root>/<topic>-<timestamp>-<range>/
├── task_meta.json          # 任务元数据
├── query_results/          # 检索结果
├── query_selection/        # 筛选记录
├── <arxiv_id>/
│   ├── metadata.md         # 论文元数据
│   ├── source/             # 源码/PDF
│   └── summary.md          # 结构化摘要
├── summaries_bundle.md     # 摘要汇总
└── collection_report.md     # 最终报告
```

#### 实用场景

- 每日追踪 AI 领域最新论文
- 按主题批量收集相关研究
- 生成周报/月报级别的学术前沿综述
- 为文献综述自动收集原始材料

---

### 5. Meyhem Researcher — 多查询深度研究工具

**GitHub**: [c5huracan/meyhem-researcher](https://github.com/openclaw/skills/tree/main/skills/c5huracan/meyhem-researcher/SKILL.md)

**⭐ 推荐指数：★★★★☆ (4/5)**

#### 核心功能

Meyhem Researcher 是一个多查询深度研究工具，将复杂研究主题分解为多个聚焦查询，通过 LLM 对结果排序，并支持新鲜度控制。**无需 API Key、无需注册、无速率限制**。

- **多查询工作流**：将复杂主题拆解为多个聚焦查询并行搜索
- **LLM 排序**：每个搜索结果由 LLM 评分排序，相关性最高的排前面
- **新鲜度控制**：支持 realtime（实时）、hour（小时）、day（天）、week（周）四种时间窗口
- **结果预览**：自动获取 Top 结果的内容摘要

#### 使用示例

```bash
# 基础用法
python3 researcher.py "transformer attention mechanism"

# 多查询 + 多结果
python3 researcher.py "kubernetes networking" -n 3 -q 5

# 实时搜索（不缓存）
python3 researcher.py "AI regulation 2026" --freshness realtime

# 按小时新鲜度
python3 researcher.py "climate policy updates" --freshness hour --agent my-researcher
```

#### REST API 调用

```bash
curl -s -X POST https://api.rhdxm.com/search \
  -H 'Content-Type: application/json' \
  -d '{
    "query": "YOUR_QUERY",
    "agent_id": "my-researcher",
    "max_results": 10,
    "freshness": "hour"
  }'
```

#### 关键优势

- **零门槛**：无 API Key、无注册、无速率限制
- **智能拆解**：自动将复杂主题拆解为多个子查询
- **时效感知**：四种新鲜度级别满足不同时效需求
- **MCP 集成**：支持通过 MCP 协议深度集成

---

## 📋 推荐指数排名

| 排名 | Skill 名称 | 推荐指数 | 核心优势 |
|------|-----------|---------|---------|
| 1 | Super Research | ★★★★★ | 融合 8 个顶级研究 Skill，全能型研究框架 |
| 2 | Boof | ★★★★★ | 本地 PDF RAG，隐私+经济双优 |
| 3 | Free Web Search | ★★★★☆ | 零成本多引擎搜索，反爬虫三级穿透 |
| 4 | ArXiv Orchestrator | ★★★★☆ | 学术论文自动化追踪，定时调度 |
| 5 | Meyhem Researcher | ★★★★☆ | 零门槛多查询研究，新鲜度控制 |

---

## 🎯 应用场景总结

### 场景一：日常技术调研

**需求**：对比两个技术方案的优劣

**推荐组合**：Free Web Search（快速搜索）→ Super Research（深度分析）

```bash
# 1. 快速搜索获取概览
python3 search_local_web.py --query "React vs Vue 2026" --intent comparison

# 2. 深度研究生成报告
# 使用 Super Research 的 Deep Research 模式
```

### 场景二：学术论文追踪

**需求**：每天追踪 AI 领域最新论文

**推荐组合**：ArXiv Orchestrator（定时收集）→ Boof（PDF 分析）

```bash
# 1. 每日自动收集 arXiv 论文
# 配置 cron 定时执行 ArXiv Orchestrator

# 2. 对感兴趣的论文用 Boof 深入分析
bash boof.sh /path/to/paper.pdf --collection ai-papers
qmd query "attention mechanism improvements" -c ai-papers
```

### 场景三：竞品/行业研究

**需求**：生成行业研究报告

**推荐组合**：Meyhem Researcher（多角度搜索）→ Super Research（综合分析）

```bash
# 1. 多角度搜索
python3 researcher.py "电动汽车市场趋势 2026" -q 5 --freshness week
python3 researcher.py "电池技术突破" -q 5 --freshness week
python3 researcher.py "充电基础设施发展" -q 5 --freshness week

# 2. 综合分析生成报告
# 使用 Super Research 的 Deep Research + Executive Summary 模式
```

### 场景四：私有文档研究

**需求**：分析一批内部 PDF 文档

**推荐组合**：Boof（批量索引）→ 查询分析

```bash
# 批量索引
for pdf in /path/to/documents/*.pdf; do
  bash boof.sh "$pdf" --collection internal-docs
done

# 跨文档查询
qmd query "风险评估方法" -c internal-docs
qmd query "合规要求" -c internal-docs
```

---

## 💡 实用建议

1. **分层研究策略**：先用 Free Web Search 或 Meyhem Researcher 做快速搜索，确认方向后再用 Super Research 做深度分析。避免一上来就启动全量深度研究浪费 Token。

2. **本地优先原则**：涉及敏感文档时，优先使用 Boof 做本地 RAG，而非上传到第三方服务。Boof 的隐私优势在处理合同、法律文件时尤为重要。

3. **学术研究自动化**：ArXiv Orchestrator 配合 OpenClaw 的 cron 功能，可以实现论文追踪的完全自动化。建议设置每日定时任务，指定关注的研究领域和回溯窗口。

4. **新鲜度选择**：
   - `realtime`：突发新闻、紧急事件（消耗最大）
   - `hour`：当日热点（推荐日常使用）
   - `day`：近期动态（性价比最高）
   - `week`：趋势调研（适合行业研究）

5. **多 Skill 协同**：搜索与研究分类的 Skills 大多有明确的分工，组合使用效果远大于单独使用。建议根据研究流程的不同阶段选择合适的 Skill。

---

## 📌 本分类其他值得关注的 Skills

| Skill 名称 | 简要说明 |
|-----------|---------|
| [academic-deep-research](https://github.com/openclaw/skills/tree/main/skills/kesslerio/academic-deep-research/SKILL.md) | 透明、严谨的学术研究，完整引用链 |
| [agent-deep-research](https://github.com/openclaw/skills/tree/main/skills/24601/agent-deep-research/SKILL.md) | Google Gemini 驱动的自主深度研究 |
| [social-intelligence](https://github.com/openclaw/skills/tree/main/skills/atyachin/social-intelligence/SKILL.md) | Twitter/Instagram/Reddit 社交媒体研究，15 亿+ 帖子索引 |
| [perplexity-deep-search](https://github.com/openclaw/skills/tree/main/skills/ericsantos/perplexity-deep-search/SKILL.md) | Perplexity API 驱动的深度搜索 |
| [web-search-pro](https://github.com/openclaw/skills/tree/main/skills/zjianru/web-search-pro/SKILL.md) | Agent 优先的 Web 搜索栈，零 Key 基线 |
| [pubmed-edirect](https://github.com/openclaw/skills/tree/main/skills/killgfat/pubmed-edirect/SKILL.md) | PubMed 学术文献检索 |
| [competitor-analysis-report](https://github.com/openclaw/skills/tree/main/skills/seanwyngaard/competitor-analysis-report/SKILL.md) | 结构化竞品分析报告 |
| [google-trends](https://github.com/openclaw/skills/tree/main/skills/satnamra/google-trends/SKILL.md) | Google 趋势监控 |
| [wikipedia-oc](https://github.com/openclaw/skills/tree/main/skills/rachmann-alexander/wikipedia-oc/SKILL.md) | 维基百科内容检索与摘要 |
| [lore](https://github.com/openclaw/skills/tree/main/skills/mishkinf/lore/SKILL.md) | 带引用的研究知识库 |

---

## 📅 系列导航

- ✅ Day 1: AI 与大语言模型
- ✅ Day 2: Apple 应用与服务
- ✅ Day 3: 浏览器自动化
- ✅ Day 4: 日历与调度
- ✅ Day 5: Clawdbot 工具
- ✅ Day 6: CLI 工具
- ✅ Day 7: 编码代理与 IDE
- ✅ Day 8: 通信工具
- ✅ Day 9: 数据分析
- ✅ Day 10: DevOps 与云服务
- ✅ Day 11: 游戏
- ✅ Day 12: Git 与 GitHub
- ✅ Day 13: 健康与健身
- ✅ Day 14: 图像与视频生成
- ✅ Day 15: iOS/macOS 开发
- ✅ Day 16: 营销与销售
- ✅ Day 17: 媒体与流媒体
- ✅ Day 18: Moltbook 相关
- ✅ Day 19: 笔记与知识管理
- ✅ Day 20: PDF 与文档
- ✅ Day 21: 个人发展
- ✅ Day 22: 生产力与任务
- 🔥 **Day 23: 搜索与研究（今日）**
- ⬜ Day 24: 安全与密码
- ⬜ Day 25: 自托管与自动化
- ⬜ Day 26: 购物与电商
- ⬜ Day 27: 智能家居与物联网
- ⬜ Day 28: 语音与转录
- ⬜ Day 29: 交通出行
- ⬜ Day 30: Web 前端开发

---

*本文由 OpenClaw 自动生成 | 2026-09-08*
