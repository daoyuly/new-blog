---
title: RAG 效果不好？先看这五个地方
tags:
  - RAG
  - 检索增强
  - 向量数据库
  - LLM
categories:
  - AI工程
abbrlink: 3128
date: 2026-07-13 17:30:00
---

# RAG 效果不好？先看这五个地方

RAG（检索增强生成）的原理很简单：把文档切块，存向量数据库，用户提问时先检索相关段落，再丢给 LLM 生成答案。但"简单"和"好用"之间隔着五道坎。

我做过的 RAG 项目，效果不好的原因基本逃不出这五个。按影响程度排序。

## 一、分块策略不对

这是最常见的问题，也是影响最大的。

**症状：** LLM 的回答缺了关键信息，或者把两段不相关的内容混在一起。

**原因：** chunk 太大，检索到一堆无关内容，淹没了真正有用的段落；chunk 太小，上下文被切断，LLM 看到的是碎片。

**怎么调：**

没有万能的 chunk size，但有通用原则：

- **按语义边界切，不按字符数切。** 一段话讲完一个意思再切，别从句子中间断开。
- **重叠切分。** 相邻 chunk 之间重叠 10-20%，避免边界信息丢失。

```python
from langchain.text_splitter import RecursiveCharacterTextSplitter

splitter = RecursiveCharacterTextSplitter(
    chunk_size=500,        # 目标大小
    chunk_overlap=100,     # 重叠部分
    separators=["\n\n", "\n", "。", "！", "？", ".", " "],  # 优先在自然段处切
)
chunks = splitter.split_text(document)
```

**一个容易被忽略的点：** 不同类型的文档适合不同的切法。技术文档按标题层级切，法律文书按条款切，对话记录按轮次切。一刀切的方式不可能对所有文档类型都好。

## 二、Embedding 模型选错了

Embedding 模型决定了"相似"的定义。模型不对，检索出来的内容就不是用户想要的。

**症状：** 检索结果的语义相关度低——用户问"退款政策"，检索出来的是"退货流程"。

**原因：** 通用 Embedding 模型（如 text-embedding-ada-002）在特定领域的表现不好。它不理解"退款"和"退货"在你这个业务里是两码事。

**怎么调：**

1. **选对模型。** 中文场景别用英文为主的模型。推荐试试 BGE-M3、GTE-multilingual，中文效果明显好于 ada-002。

2. **领域微调。** 如果你有标注数据（查询-相关文档对），微调 Embedding 模型效果提升很大。不需要太多数据，几百对就够。

3. **混合检索。** 向量检索 + 关键词检索（BM25），各取所长。向量检索擅长语义相似，BM25 擅长精确匹配。混合后效果通常比单一方法好 10-20%。

```python
from rank_bm25 import BM25Okapi

def hybrid_search(query: str, top_k: int = 5):
    # 向量检索
    vec_results = vector_store.similarity_search(query, k=top_k * 3)
    
    # BM25检索
    tokenized_corpus = [chunk.split() for chunk in all_chunks]
    bm25 = BM25Okapi(tokenized_corpus)
    bm25_results = bm25.get_top_n(query.split(), all_chunks, n=top_k * 3)
    
    # 合并去重，按混合分数排序
    merged = merge_and_rerank(vec_results, bm25_results, vec_weight=0.7, bm25_weight=0.3)
    return merged[:top_k]
```

## 三、检索到的内容没排序

向量数据库返回的结果是按 embedding 相似度排的，但相似度高不等于对回答有用。一段和问题高度相似的文档片段，可能只是措辞接近，内容并不相关。

**症状：** LLM 的回答方向对，但细节不对，或者用了不太相关的信息。

**原因：** 缺少 Rerank 步骤。Embedding 是双塔模型，快但粗；Rerank 是交叉编码器，慢但准。

**怎么调：**

加一个 Rerank 层，先粗检索多取一些（top_k=20），再 Rerank 精选（top_k=5）。

```python
from sentence_transformers import CrossEncoder

# Rerank模型：慢但准
reranker = CrossEncoder("BAAI/bge-reranker-large")

def search_with_rerank(query: str, top_k: int = 5):
    # 粗检索：多取一些
    candidates = vector_store.similarity_search(query, k=20)
    
    # Rerank
    pairs = [(query, chunk.page_content) for chunk in candidates]
    scores = reranker.predict(pairs)
    
    # 按rerank分数排序
    ranked = sorted(zip(candidates, scores), key=lambda x: -x[1])
    return [chunk for chunk, _ in ranked[:top_k]]
```

Rerank 的代价是延迟——每个候选片段都要过一次模型。但 20 个候选的 rerank 通常在 200ms 以内，完全可接受。效果提升 15-30%，这钱花得值。

## 四、查询没改写

用户输入的查询往往不是最优的检索 query。

比如用户问"我怎么退款"，但文档里写的是"退费流程"。字面上不太一样，embedding 相似度可能不高。

**症状：** 用户觉得问题很简单，但系统就是找不到相关内容。

**原因：** 直接用原始查询检索，没做 query 改写。

**怎么调：**

```python
def rewrite_query(original_query: str, llm_client) -> str:
    """用LLM改写查询，生成更适合检索的版本"""
    resp = llm_client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": "你是一个查询改写助手。把用户的自然语言问题改写成适合文档检索的关键词查询。保留核心意图，补充同义词，去掉语气词。"},
            {"role": "user", "content": f"原查询：{original_query}\n改写后："}
        ],
        max_tokens=100,
        temperature=0
    )
    return resp.choices[0].message.content

# 效果：
# "我怎么退款" → "退费 退款 流程 政策 条件"
# "这个多少钱" → "价格 费用 收费标准 定价"
```

更高级的做法：**多查询扩展。** 用 LLM 生成 3-5 个不同角度的查询，分别检索，合并结果。

```python
def multi_query_search(original_query: str, top_k: int = 5) -> list:
    # 生成多个查询角度
    variations = generate_query_variations(original_query)  # 返回3-5个变体
    
    all_results = []
    seen = set()
    
    for query in [original_query] + variations:
        results = vector_store.similarity_search(query, k=top_k)
        for r in results:
            if r.id not in seen:
                seen.add(r.id)
                all_results.append(r)
    
    # 对合并结果做rerank
    return rerank_and_select(original_query, all_results, top_k)
```

多查询的代价是检索请求量翻倍，但准确率提升 20-40%，在效果优先的场景很值得。

## 五、给 LLM 的上下文没组织好

前面四步都做对了，检索到的 5 段内容都是相关的。但如果直接把这些文本拼起来丢给 LLM，效果还是不好。

**症状：** LLM 的回答有"幻觉"——编造了文档里没有的内容，或者把两段不同来源的信息混为一谈。

**原因：** 上下文组织混乱。LLM 分不清哪些是检索到的内容、哪些是它自己的知识、哪段内容来自哪个文档。

**怎么调：**

给每段检索结果加来源标注，并在 prompt 里明确要求 LLM 只基于提供的内容回答：

```python
def build_rag_prompt(query: str, retrieved_chunks: list) -> str:
    context_parts = []
    for i, chunk in enumerate(retrieved_chunks, 1):
        context_parts.append(
            f"[文档{i}] 来源：{chunk.source}\n{chunk.content}"
        )
    
    context = "\n\n".join(context_parts)
    
    prompt = f"""基于以下文档内容回答用户问题。

{context}

用户问题：{query}

要求：
- 只基于以上文档内容回答，不要编造
- 如果文档中没有相关信息，直接说"根据现有资料无法回答"
- 引用信息时标注来源，如"根据[文档1]...""
    
    return prompt
```

另一个常见问题：**上下文太长。** 5 段 × 500 字 = 2500 字，加上 prompt 模板和对话历史，很容易超过模型的最佳上下文窗口。研究表明，LLM 在上下文超过一定长度后，对中间部分的信息利用率明显下降（"lost in the middle"问题）。

解法：**精简上下文。** 不需要把检索到的内容原文全部放入，可以用 LLM 先做一次信息提取，只保留和问题直接相关的句子。

## 一个快速诊断表

| 问题 | 检查点 | 快速验证 |
|------|--------|---------|
| 分块策略 | 看 chunk 样本，是否从句子中间断开 | 打印5个随机chunk，人眼检查 |
| Embedding | 用5个测试query检索，看top3是否相关 | 准备标准测试集，跑一遍 |
| Rerank | 对比有/无rerank的top5，看差异 | 同一query对比 |
| 查询改写 | 看改写后的query是否更匹配文档措辞 | 打印改写前后对比 |
| 上下文组织 | 看LLM输入的完整prompt，是否混乱 | 把完整prompt打出来读一遍 |

**从第一个开始查，按顺序排。** 分块不对，后面全白搭。先修分块，再调 Embedding，然后加 Rerank，再改写查询，最后组织上下文。每修一步测一次，别一次改五个地方。

RAG 的效果优化是个系统工程，不存在"调一个参数就好了"的银弹。但按这个顺序排查，大部分问题都能解决。

---

**相关阅读：**
- Liu et al., "Lost in the Middle" (2023) - LLM长上下文信息利用研究
- BGE/Reranker 系列 - BAAI开源的embedding和rerank模型
- LangChain RAG 文档 - 检索增强生成最佳实践
