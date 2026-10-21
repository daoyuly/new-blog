---
title: OpenClaw Skill 每日推荐 - 搜索与研究（search-and-research）
tags:
  - openclaw
  - skill
  - search-and-research
categories:
  - 技术推荐
abbrlink: 54414
date: 2026-10-21 11:30:00
---

# OpenClaw Skill 每日推荐：搜索与研究

> 「OpenClaw Skill 每日推荐」第 22 期。每天从 awesome-openclaw-skills 的 30 个分类中挑一个，带你认识社区里最值得装的 skill。今天这个分类是全仓库的"巨无霸"——**搜索与研究（search-and-research）**，352 个 skills，超过了昨天的生产力分类，坐上了体量头把交椅。

## 一、今日分类概览

352 个 skills，粗略归拢大概是这么几大块：

| 子方向 | 代表能力 |
|---|---|
| 通用搜索与深度调研 | web-search-pro、hybrid-deep-search、agent-deep-research、perplexity-deep-search |
| 学术与论文 | arxiv-watcher、agentic-paper-digest、literature-manager、pubmed-edirect、aminer-open-academic |
| 社交媒体情报 | social-intelligence、lead-generation、x-monitor、twitterapi-io |
| 垂直领域检索 | google-trends、fred-navigator（美联储数据）、law-search（韩国法规）、torah-scholar（犹太典籍） |
| 本地知识库 / RAG | boof、orchata、dify-kb-search、zvec-local-rag-service |
| 隐私与自托管 | openclaw-free-web-search（自托管 SearXNG）、yacy（本地搜索引擎） |

两句实话：

1. **这个分类的边界相当松。** 名字里带 search 的什么都往里装：机票酒店比价、Amazon 选品、Twitter 刷帖工具、agent 人才市场，甚至还有几个记忆系统（memory）也挤在这里。按"帮 agent 找东西"的最宽口径它们都算搜索，但你要找的"研究类 skill"大概只占一半。
2. **噪音多，但精品密度不低。** 搜索是 agent 的刚需，所以这个分类卷得最凶——恰好意味着头部几个 skill 在"免费可用、成本控制、结果可信度"这些真问题上打出了差异化。

## 二、精选 Skill 详解

### 1. web-search-pro —— 给 agent 装一个"搜索底座" ⭐⭐⭐⭐⭐

**链接：** [SKILL.md](https://github.com/openclaw/skills/tree/main/skills/zjianru/web-search-pro/SKILL.md)

**核心功能：** Agent-first 的搜索与检索全栈方案——主打"没有 API key 也能跑"的真实基线、可解释的查询路由、可见的多源增益，外加 extract（正文提取）、crawl（爬取）、map（站点地图）、research（多步调研）四件套。

**为什么它是五星：** 三个理由。第一，**"真·无 key 基线"解决了上手第一公里**——很多搜索 skill 不配 key 就是废铁，它承诺不配置也有可用后端。第二，**路由可解释**：什么查询走轻量通道、什么查询升级联邦搜索，决策过程看得见，而不是一个黑盒吞掉你的查询。第三，**它不止搜索**：extract/crawl/map/research 把"搜到之后的事"（读正文、爬站点、深挖）也接管了，一条 skill 覆盖信息获取全链路。

**实用场景：**
- 只想给 OpenClaw 装一个搜索 skill：选它当底座，大概率不用再折腾
- 「查证一下这个说法的原始出处」——多源交叉比对
- 「把这个文档站的内容抓下来整理」——crawl + extract 流水线

**实现机制：** 从描述看是一个"路由器 + 多后端联邦"结构：先跑免费基线，按查询类型和意图决定是否升级到更强的检索或深度研究流程。extract/crawl/map 是网页处理的标准三件套，research 则是多轮检索的编排层。这套"免费打底、按需升级"的思路和下面 hybrid-deep-search 异曲同工。

### 2. hybrid-deep-search —— 成本感知的双通道路由 ⭐⭐⭐⭐

**链接：** [SKILL.md](https://github.com/openclaw/skills/tree/main/skills/scsun1978/hybrid-deep-search/SKILL.md)

**核心功能：** 在 Brave API（免费、快）和 OpenAI Codex（深度分析、付费）之间智能路由。

**为什么值得四星：** 它直面搜索场景里最现实的矛盾：**质量与成本的取舍**。"今天几号"这种查询走深度分析是烧钱行为艺术；"这三个框架在千万级并发下的真实差异"却值得多花点钱换深度。hybrid-deep-search 把分级做成了自动化：简单事实类查询秒回，复杂问题才升级付费通道。对跑定时任务、每天调用成百上千次的 agent 来说，这个路由层就是账单的减压阀。

**实用场景：**
- 高频监控类任务（每天定时扫资讯），日常查询全走免费通道
- 偶尔来一个硬骨头问题，自动升级深度分析，不用你手动切换工具

**实现机制：** 核心是一个查询分流器：判断问题属于"快问快答"还是"需要交叉验证的复杂分析"，前者直接走 Brave 的搜索结果，后者交给 Codex 做多步推理。难点在分流本身的准确率——分错方向的代价要么是浪费钱，要么是答案太浅。

### 3. research-report —— 一句话换来一份可交付的调研报告 ⭐⭐⭐⭐

**链接：** [SKILL.md](https://github.com/openclaw/skills/tree/main/skills/huaruoji/research-report/SKILL.md)

**核心功能：** 研究技术项目或论文，自动生成综合报告，并支持 PDF 导出。

**为什么值得四星：** 它把"调研"这件事产品化了——交付物不是一屏聊天记录，而是一份**可以转发的报告文件**。Deep research 类 skill 不少，但很多停在"对话里给你讲讲"；research-report 走完了最后一公里：结构化成文、渲染成 PDF。对要向上汇报、要给团队存档的人来说，这一步就是"能用"和"好看"的区别。

**实用场景：**
- 技术选型：「调研 XX 和 YY 两个方案的取舍，出份对比报告」
- 进陌生领域前先要一份综述，再决定要不要深读原文
- 竞品分析：让 agent 交一份带出处的 PDF，而不是口头总结

**实现机制：** 典型的深度研究流水线：拆解研究问题 → 多轮检索 → 汇总成结构化报告 → 渲染导出 PDF。质量上限取决于检索层的深度和交叉验证是否到位，PDF 导出更多是工程收尾，但恰恰是这层"收尾"决定了它在工作流里的位置。

### 4. literature-manager —— 学术文献的"总务管家" ⭐⭐⭐⭐

**链接：** [SKILL.md](https://github.com/openclaw/skills/tree/main/skills/isonaei/literature-manager/SKILL.md)

**核心功能：** 学术文献的搜索、下载、格式转换、整理与审计，一条链路全包。

**为什么值得四星：** 科研人的痛点从来不是"找不到论文"，而是**找到了之后的事**：PDF 要下、格式要转、按主题归档、去重、检查引用信息完不完整。这五件事琐碎且没有成就感，却是文献综述里最耗时间的部分。literature-manager 把整条长尾流水线接给 agent，属于"无聊但高价值"的典型。同分类里还有 arxiv-watcher（追新）、agentic-paper-digest（每日摘要）可以拼成完整组合。

**实用场景：**
- 开题/写综述：「把这个方向的近三年论文抓下来，按主题分好类」
- 追踪某个领域的月度新论文，自动下载归档
- 写作前让 agent 审计文献库：哪些缺 PDF、哪些引用信息不全

**实现机制：** 从描述看，它对接学术检索源（同类 skill 多用 arXiv、PubMed 等公开 API），下载后本地做格式转换（多为转 markdown，便于 agent 后续阅读），再用元数据组织归档；audit 环节负责完整性检查。架构上是"检索 + 文件处理 + 知识组织"三段式。

### 5. social-intelligence —— 把 15 亿条社媒帖子当语料库 ⭐⭐⭐⭐

**链接：** [SKILL.md](https://github.com/openclaw/skills/tree/main/skills/atyachin/social-intelligence/SKILL.md)

**核心功能：** 跨 Twitter、Instagram、Reddit 的 AI 社交情报研究，索引量 15 亿+ 帖子。

**为什么值得四星：** 社交媒体是**最快、最脏、也最真实的用户声音来源**——产品发布会后的第一波差评、某个功能的真实使用吐槽、竞品用户在 Reddit 里的抱怨，全都先于任何报告出现。social-intelligence 的思路是把预先抓取好的超大索引暴露给 agent，用自然语言直接查。同一作者的 lead-generation 是它的销售特化版（从社媒对话里找高意向买家），两个拼起来就是一条"听需求 → 找客户"的链路。

**实用场景：**
- 独立开发者：「搜一下最近一个月里用户抱怨 XX 工具什么」——需求挖掘
- 市场/舆情：盯竞品口碑变化，盯自家产品被提及的语境
- 内容选题：看某个话题在 Reddit 上最近什么讨论最热

**实现机制：** 关键在"预抓取 + 索引"而非实时爬取——平台反爬越来越狠，实时抓的稳定性是个坑；预先建索引再用查询接口暴露，是第三方社交数据服务的成熟做法。代价是数据有延迟，且覆盖范围取决于服务商索引策略。

## 三、应用场景总结

把这条分类线串起来，可以搭出一个**分层的信息获取体系**：

```
快问快答 ──→ web-search-pro / hybrid-deep-search（免费基线 + 成本路由）
    │
深度调研 ──→ research-report / agent-deep-research（多轮检索，产出可交付报告）
    │
垂直领域 ──→ literature-manager（学术）/ social-intelligence（社媒）/ google-trends（趋势）
    │
私有知识 ──→ boof / orchata 等 RAG skills（把本地文档变成可检索知识）
```

两条值得注意的产品思路，正在这个分类里分头演化：

- **思路 A：成本分级。** 承认"好答案是要花钱的"，用路由层把预算花在刀刃上——hybrid-deep-search 是代表。
- **思路 B：可信度优先。** 承认"单源搜索不可信"，用多源交叉验证 + 明示置信度来对抗幻觉——openclaw-free-web-search 甚至会告诉你"这个答案值多少信任"。

实用原则是**先便宜后昂贵、先通用后垂直**：日常查询交给免费通道，复杂问题才升级深度研究，领域固定了再挂垂直 skill。

## 四、推荐指数排名

| 排名 | Skill | 一句话点评 | 推荐指数 |
|---|---|---|---|
| 1 | [web-search-pro](https://github.com/openclaw/skills/tree/main/skills/zjianru/web-search-pro/SKILL.md) | 无 key 可用、路由透明、全链路覆盖的搜索底座 | ⭐⭐⭐⭐⭐ |
| 2 | [hybrid-deep-search](https://github.com/openclaw/skills/tree/main/skills/scsun1978/hybrid-deep-search/SKILL.md) | 免费与深度双通道，账单减压阀 | ⭐⭐⭐⭐ |
| 3 | [research-report](https://github.com/openclaw/skills/tree/main/skills/huaruoji/research-report/SKILL.md) | 调研到 PDF 交付一条龙 | ⭐⭐⭐⭐ |
| 4 | [literature-manager](https://github.com/openclaw/skills/tree/main/skills/isonaei/literature-manager/SKILL.md) | 学术文献长尾工作的总务管家 | ⭐⭐⭐⭐ |
| 5 | [social-intelligence](https://github.com/openclaw/skills/tree/main/skills/atyachin/social-intelligence/SKILL.md) | 15 亿帖子里的真实用户声音 | ⭐⭐⭐⭐ |

## 五、实用建议

1. **搜索 skill 只装一个底座，别贪多。** 同时装五个搜索 skill 的结果是 agent 选择困难 + 重复调用。选 web-search-pro（省心）或 openclaw-free-web-search（隐私党自托管）其一即可。
2. **高频任务先想成本。** 如果你要跑每天几十次的定时资讯扫描，学 hybrid-deep-search 的思路：能走免费通道的绝不走付费深度。一个简单的判断标准——这个问题的答案错了你会心疼吗？不会就走便宜通道。
3. **学术党上组合拳。** arxiv-watcher 追新 + literature-manager 归档 + research-report 出综述，三件套基本覆盖"追、存、读"全流程，比单装一个大而全的 skill 更稳。
4. **做产品的人把社媒当需求库。** social-intelligence 搜出来的真实抱怨比任何问卷都诚实，但注意社媒数据噪音大——负面声音的音量通常和问题的严重性不成正比，交叉验证后再下结论。
5. **对搜索结果保持一份警惕。** 这个分类里最健康的趋势是"多源验证 + 置信度明示"。哪怕不用专门的 skill，也可以在提示词里加一句"至少两个独立来源确认后再下结论"。

---

*本文是「OpenClaw Skill 每日推荐」系列第 22 篇，数据来自 awesome-openclaw-skills 仓库，星级为个人主观评价。明天第 23 期：安全与密码（security-and-passwords）。*
