---
title: "AI Agent 工程师 Day 66：BM25：不用 Embedding 的检索"
date: 2026-11-24 10:30:00
tags:
  - AI Agent 工程师
  - BM25
  - Keyword Search
  - Retrieval
categories:
  - AI Agent 工程师学习计划
  - M3 Context + Memory + Retrieval
description: "Day 66/168 | M3 词频检索 | BM25：不用 Embedding 的检索。6 个月从 LLM 到生产级 Agent 系统的完整学习路线。"
keywords: "AI Agent, 工程师, 词频检索, BM25, Keyword Search, Retrieval"
author: OpenClaw Agent Learning
---

# AI Agent 工程师 Day 66：BM25：不用 Embedding 的检索

> **6 个月学习计划** | M3 - Context + Memory + Retrieval | Day 66/168
> 
> **今日主题**: 词频检索

---

# BM25：不用 Embedding 的检索

**先给结论：BM25（Best Match 25）是基于词频统计的稀疏检索算法，它不需要 Embedding 模型、不需要 GPU，只需倒排索引就能跑，延迟在毫秒级。在 RAG 系统中，它擅长精确匹配（产品编号、函数名、专有名词），而 Vector Search 擅长语义泛化（“怎么退货” ≈ “如何办理退款”）。两者不是替代关系，而是互补关系——工业级 RAG 系统的主流做法是 Hybrid Retrieval（混合检索），即 BM25 + 向量检索加权融合，通常用 RRF（Reciprocal Rank Fusion）合并排序。如果你的 RAG 效果差，先别急着换更贵的 Embedding 模型，很可能你缺的是 BM25。**

---

## 背景与动机

在 6 个月 AI Agent 工程师路线的第 3 个月，你已经学会了 Embedding、向量数据库和基础 RAG。这时容易形成一种思维惯性：**检索 = Embedding + Vector Search**。

但真实的工业系统不是这样。Elasticsearch 的默认排序是 BM25，GitHub 的代码搜索基于变体 BM25，AWS Kendra、Azure AI Search 都内置了关键词检索通道。为什么？因为在很多查询场景下，用户要找的不是一个“语义相近”的文档，而是一个**字面上就包含答案**的文档。

举个例子：用户搜 `error code 42903`，一个最强的 Embedding 模型也会把它映射到某个“错误处理”语义空间附近，返回一堆讲错误处理的文章；而 BM25 会直接命中包含 `42903` 这个字符串的文档。这就是精确匹配的价值。

学这一课的目的：建立“检索 = 稀疏 + 稠密”的完整认知，并亲手实现一次“故意不用 Embedding”的检索系统，体会两者的边界。

---

## 核心内容

### 1. BM25 算法原理

BM25 的本质是一个**评分函数**：给定查询 Q 和文档 D，输出一个相关性分数。分数由三部分组成：

```
score(D, Q) = Σ IDF(qi) · TF饱和项(qi, D) · 长度归一化(D)
```

公式（经典 Robertson 版本）：

```
score(D, Q) = Σ_{i=1..n} IDF(qi) · [ f(qi, D) · (k1 + 1) ] / [ f(qi, D) + k1 · (1 − b + b · |D|/avgdl) ]
```

逐项拆解因果链：

**第一项：IDF（Inverse Document Frequency，逆文档频率）**

```
IDF(qi) = ln( (N − df(qi) + 0.5) / (df(qi) + 0.5) + 1 )
```

- `N`：总文档数；`df(qi)`：包含词 qi 的文档数。
- 因果链：一个词在越多文档中出现，区分度越低 → 权重越低。“的”、“是”这类词 df ≈ N，IDF 趋近 0；“42903” 这种只出现在 3 篇文档里的词，IDF 极高。
- **直觉：IDF 决定“这个词值不值得听”。**

**第二项：TF 饱和（Term Frequency Saturation，词频饱和）**

分子分母都含 `f(qi, D)`（词在文档中的出现次数）。当 f 增大时，整个分式的值渐近收敛到 `(k1 + 1)`，不再增长。这解决了 TF-IDF 的一个著名缺陷：

- TF-IDF 中，词出现 100 次的文档分数是出现 1 次的 100 倍 → 长文档靠“堆词”作弊。
- BM25 中，出现 3 次约等于出现 30 次 → **第一次出现携带信息，重复出现边际递减**。

`k1` 控制饱和速度：k1 越大，饱和越慢（TF 影响持续更久）。经验值 `k1 ∈ [1.2, 2.0]`。

**第三项：长度归一化（Length Normalization）**

`b ∈ [0, 1]` 控制文档长度的影响：

- `b = 0`：完全不考虑长度（长文档天然 TF 更高，占便宜）。
- `b = 1`：完全按 `|D|/avgdl` 缩放。
- 经验值 `b = 0.75`。

**直觉：短文档里的一个词比长文档里的同一个词更“值钱”——短文档主题更集中。**

一句话总结：**BM25 = IDF（词的区分度） × TF 饱和（出现次数的边际递减） × 长度归一化（短文档加权）**。

### 2. TF-IDF 与 BM25 的关系

BM25 不是横空出世，而是 TF-IDF 的工程化改进版。理解这条演化链，比背公式更重要：

| 维度 | TF-IDF | BM25 |
|---|---|---|
| TF 处理 | 线性增长：TF × IDF | 饱和增长，上限 (k1+1) |
| 文档长度 | 无处理 | 参数 b 归一化 |
| 参数 | 无 | k1, b（可调） |
| 理论基础 | 启发式 | 概率检索框架（PRP） |
| 排序质量 | 中 | 高（TREC 验证） |

因果链如下：

1. **TF-IDF 的问题一**：TF 线性增长 → SEO 式“关键词堆砌”能刷分。
2. **问题二**：长文档 TF 天然高 → 长文档系统性占优，即使内容跑题。
3. BM25 的解法：TF 饱和解决问题一，长度归一化解决问题二。
4. 更深一层：BM25 源自 Robertson 的**概率检索模型**（Probability Ranking Principle），它是“文档与查询相关的概率比”的二阶近似，而 TF-IDF 只是启发式。理论根基决定了它在真实语料上的排序更稳。

记住这个演化关系：**TF-IDF →（加饱和）→（加长度归一化）→ BM25**。两个超参（k1, b）就是这两步改进的“开关”。

### 3. BM25 的三大优势

**优势一：精确匹配**

Embedding 是有损压缩——把文档压缩成 768 维向量，必然丢失细节。而 BM25 在倒排索引层面工作，`authorization failed` 这个短语是否**逐字出现**在文档里，它是确定性判断的。对于代码标识符、SKU 编号、人名、错误码、SQL 片段这类查询，精确匹配完胜语义匹配。

**优势二：无需模型**

- 不需要 Embedding 模型 → 没有 API 成本，没有模型下载，没有推理延迟。
- 不需要训练 → 新领域（如法律、医疗、内部文档）冷启动零成本。Embedding 在领域外效果会打折，BM25 不会。
- 索引构建 = 分词 + 建倒排表，纯 CPU 操作，百万级文档分钟级完成。

**优势三：低延迟**

```
查询路径对比：

BM25:     查询分词 → 查倒排表（O(查询词数)）→ 合并评分 → 排序
           典型延迟：1-10 ms（Elasticsearch P99 < 50ms）

Vector:   查询 → 调 Embedding API（50-200ms）→ ANN 搜索（HNSW 5-20ms）→ 排序
           典型延迟：60-250 ms
```

关键差距在**查询侧的 Embedding 推理**——这一步是网络往返 + 神经网络前向，BM25 完全跳过。对于对话式 Agent 的多轮检索（每轮都可能触发检索），这个差距会被乘以轮数。

### 4. BM25 vs Vector Search 全面对比

| 维度 | BM25（稀疏检索，Sparse Retrieval） | Vector Search（稠密检索，Dense Retrieval） |
|---|---|---|
| 表示方式 | 高维稀疏向量（词表维度，绝大多数为 0） | 低维稠密向量（如 768 维，全非零） |
| 匹配逻辑 | 词面精确匹配 | 语义相似度（余弦/内积） |
| 查询“怎么退货” vs 文档“办理退款流程” | **失配**（无共同词） | **命中** |
| 查询 `ERR_42903` | **精确命中** | 可能失配（罕见 token 被 Embedding 弱化） |
| 模型依赖 | 无 | 需要 Embedding 模型 |
| 索引成本 | 倒排表，低 | HNSW/IVF，内存高 |
| 查询延迟 | 1-10 ms | 60-250 ms（含查询编码） |
| 新词/专有名词 | 天然支持（进词表即可） | 需模型见过，否则退化为噪声 |
| 多语言/跨语言 | 弱（需分词适配） | 强（多语言模型） |
| 可解释性 | 强（能指出哪些词命中） | 弱（黑盒相似度） |
| 典型实现 | Elasticsearch, Lucene, rank_bm25 | FAISS, Milvus, pgvector, Pinecone |

工程直觉总结成一句话：

> **用户知道自己在找什么 → BM25 赢；用户只描述需求 → Vector 赢。**

真实的查询流量中，两类查询往往混在一起，所以才有 Hybrid Retrieval 的必要性——后文实践部分会实现 RRF 融合。

### 5. BM25 的局限

**局限一：词汇鸿沟**

BM25 的命门：它只认字面。同义词、缩写、口语化表达全部失配。

- 查询“电脑蓝屏” → 文档“计算机系统崩溃” → BM25 得分 0。
- 查询“PPT” → 文档“演示文稿” → 得分 0。

这是它被 Neural Retrieval 取代的根本原因：自然语言的多样性使得同一意图有无数种表达。

**局限二：无语义排序能力**

BM25 对候选集只能做“词面匹配度”排序，无法理解“哪个文档更深入地回答了问题”。一篇只提了一次关键词的综述文档，可能排在一篇通篇讨论该关键词但角度不同的文档之后。

**局限三：跨语言能力弱**

中英混合查询、跨语言检索需要额外的分词与词表设计，而多语言 Embedding 模型天然覆盖。

**局限四：无上下文理解**

BM25 不会利用查询历史。多轮对话中“它多少钱？”这种指代性查询，BM25 完全无能为力——**查询改写（Query Rewriting）仍然是 Hybrid 系统的必需组件**，这其实是 Agent Engineering 的活儿，见后文。

---

## 代码：50 行实现 BM25 + Hybrid 对比

用 `rank_bm25` 库（`pip install rank-bm25`），故意不用任何 Embedding：

```python
from rank_bm25 import BM25Okapi

# 语料：注意 doc2 与 query 无词面重叠，但语义相关
corpus = [
    "the user authorization failed with error code 42903",
    "how to process a refund request for returned goods",
    "refund policy and money back guarantee terms",
    "authorization token refresh mechanism in oauth2",
]

query_sparse = "error 42903"
query_dense_style = "customer wants money back"  # 语义查询

tokenized = [doc.split() for doc in corpus]
bm25 = BM25Okapi(tokenized)

# --- 稀疏检索 ---
scores = bm25.get_scores(query_sparse.split())
for doc, s in zip(corpus, scores):
    print(f"{s:8.3f}  {doc}")
# 输出：doc0 得分远高于其他 → 精确命中 "42903" 和 "error"

scores2 = bm25.get_scores(query_dense_style.split())
print(max(scores2))  # ≈ 0.0 → 词汇鸿沟，全部失配
```

这就是分界线的直观演示：`42903` 查询 BM25 完胜，`money back` 查询 BM25 归零。

**Hybrid 融合（RRF，Reciprocal Rank Fusion）**：

```
RRF 公式：score(d) = Σ_r  1 / (k + rank_r(d))    通常 k = 60
```

```python
def rrf(rankings: list[list[str]], k: int = 60) -> dict:
    """rankings: 每个 retriever 返回的文档按相关度降序排列的列表"""
    scores = {}
    for ranking in rankings:
        for rank, doc in enumerate(ranking):
            scores[doc] = scores.get(doc, 0) + 1 / (k + rank + 1)
    return dict(sorted(scores.items(), key=lambda x: -x[1]))

# 假设两个 retriever 各自返回 top-3
bm25_ranking   = ["doc0", "doc2", "doc1"]
vector_ranking = ["doc2", "doc1", "doc3"]

print(rrf([bm25_ranking, vector_ranking]))
# doc2 在两个榜上都靠前 → 排第一；doc0 只在 BM25 榜上 → 保底出现
```

RRF 的妙处：**不需要归一化两个系统的分数**（BM25 分数无上界，余弦相似度在 [-1,1]，直接加权融合是常见工程错误），只看排名。这是生产系统首选的融合策略。

检索架构图：

```
                    ┌─────────────┐
        query ──────┤ Query Rewrite│ (Agent 侧：多轮指代消解)
                    └──────┬──────┘
              ┌────────────┼────────────┐
              ▼            ▼            
      ┌──────────────┐  ┌──────────────┐
      │  BM25 稀疏通道 │  │ Vector 稠密通道│
      │ 倒排索引       │  │ Embedding+ANN │
      └──────┬───────┘  └──────┬───────┘
              └──────► RRF 融合 ◄──────┘
                          │
                          ▼
                   Top-K → Reranker（可选）→ LLM
```

---

## 实践练习与思考题

**练习（本日核心任务）**：

1. 准备 50-100 条文档（可用产品 FAQ 或技术文档片段），准备 10 条测试查询，**一半是精确型**（含专有名词、编号），**一半是语义型**（换词表达）。
2. 用 `rank_bm25` 实现 BM25 检索，记录每条查询的 Top-5。
3. 用任意 Embedding（如 `sentence-transformers` 的 `all-MiniLM-L6-v2`）实现 Vector Search，记录 Top-5。
4. 手写 RRF 融合两者，对比三种方案在各查询上的命中率（人工标注 10 条查询的正确文档）。
5. 调整 BM25 的 `k1`（0.5 / 1.5 / 2.0）和 `b`（0 / 0.75 / 1.0），观察排序变化，验证你对两个参数的直觉。

**思考题**：

1. 为什么 RRF 用排名而不是原始分数做融合？如果一定要用分数融合，需要解决什么问题？
2. 你的知识库中，查询词分布是“已知术语型”多还是“描述需求型”多？这如何影响 BM25 与 Vector 的权重配比？
3. BM25 索引在文档更新（增/删/改）时的成本如何？和 HNSW 索引相比呢？（提示：倒排表的追加 vs 图结构重连）

---

## 与 Agent Engineering 的关联

在真实 Agent 系统中，BM25 出现在四个位置：

**1. RAG 的稀疏通道。** 主流方案是 Hybrid：Elasticsearch/Lucene 提供 BM25，向量库提供稠密检索，RRF 或加权融合。LangChain 的 `EnsembleRetriever`、LlamaIndex 的 `QueryFusionRetriever` 内置了这个模式。

**2. 工具检索。** Agent 有 50 个工具时，不可能全部塞进 prompt。按用户意图检索 Top-K 工具的方案中，工具名、参数名是典型的精确匹配场景——`search_flight` 工具用 BM25 匹配 "flight" 查询比 Embedding 更快更准，且**工具注册零成本**（新增工具即生效，无需重新 embedding）。

**3. 记忆检索。** 长期记忆中存的是结构化片段（“用户偏好：素食”）。关键词命中在这类精确事实查询上依然可靠，且延迟优势在 Agent 每轮决策中被放大。

**4. 成本与延迟预算。** Agent 一轮对话可能触发多次检索（迭代式 RAG、ReAct 循环）。BM25 通道的 1-10ms 延迟使得“先 BM25 快筛，miss 再走向量”的级联策略成为可能，直接降低 P99 延迟和 token/推理成本。

**判断标准很明确：你的 Agent 检索对象里有多少“字符串必须精确出现”的内容，BM25 就有多少存在价值。**

---

## FAQ

**Q1: BM25 适合中文吗？**
适合，但需要分词。BM25 的前提是“词”的切分，英文天然空格分词，中文必须先过 jieba / HanLP / IK Analyzer。分词质量直接决定 BM25 上限——专有名词切错（如“机器学习”切成“机器/学习”），匹配就崩。生产中文场景，Elasticsearch + IK 分词是最常见组合。

**Q2: 有了 Reranker（如 BGE-reranker、Cohere Rerank），还需要 BM25 吗？**
需要。Reranker 作用于候选集，而候选集从哪来是 Retrieval 阶段的问题。如果候选召回阶段漏掉了正确文档，Reranker 无力回天。BM25 的价值在召回层保证精确匹配类文档不漏。正确架构是：BM25 + Vector 双路召回 → Reranker 精排。

**Q3: k1 和 b 该怎么调？**
先默认 k1=1.5, b=0.75（Lucene 默认 k1=1.2, b=0.75），除非有标注数据再调。经验规律：语料中长文档含金量高（如论文）→ 调低 b；查询词重复出现有强信号（如法律条文引用）→ 调高 k1。没有评估集的调参都是玄学，先建评估集。

**Q4: BM25 分数能直接当“相关性概率”用吗？**
不能。BM25 分数无界、不可跨查询比较（同一查询内可比，不同查询间不可比）。不要用“分数 > 15 就算相关”这种阈值逻辑。需要阈值时，用 Reranker 的分数，或在查询内用相对量（如 top1 分数的百分比）。

**Q5: BM25 会被纯神经检索完全取代吗？**
短期不会。SPLADE 等学习型稀疏检索在学术榜单上超过 BM25，但它们需要训练、推理成本和领域适配，失去了 BM25 “零模型、零训练”的核心优势。在工业界，BM25 作为 Hybrid 系统的基线通道的地位，在可预见的几年内是稳固的——**它便宜、快、可解释、冷启动零成本，这四个属性神经网络检索很难同时给出。**

---

## 参考资料

- BM25 论文：Robertson & Zaragoza, *The Probabilistic Relevance Framework: BM25 and Beyond* (2009)
- rank_bm25 库：https://github.com/dorianbrown/rank_bm25
- Lucene BM25 实现解析：https://lucene.apache.org/core/
- Elasticsearch BM25 默认相关性：https://www.elastic.co/blog/practical-bm25-part-2-the-bm25-algorithm-and-its-variables
- RRF 融合原始论文：Cormack et al., *Reciprocal Rank Fusion Outperforms Condorcet and Individual Rank Learning Methods* (2009)
- LangChain EnsembleRetriever 文档：https://python.langchain.com/docs/how_to/ensemble_retriever/

---

## 📋 本日知识点清单

- [ ] BM25 算法原理
- [ ] TF-IDF 与 BM25 的关系
- [ ] BM25 的优势：精确匹配、无需模型、低延迟
- [ ] BM25 vs Vector Search 的对比
- [ ] BM25 的局限

## 📝 实践练习

故意不用 Embedding，用 BM25 实现检索，与 Vector Search 对比。

---

*本文是「AI Agent 工程师」6 个月学习计划的一部分。学习路线：LLM → Inference → Runtime → Harness → Memory → Environment → Evaluation → Production。目标：Agent / AI Systems Engineer。*
