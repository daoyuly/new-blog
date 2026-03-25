---
title: AI Agent 记忆召回机制深度分析
tags:
  - AI
  - Agent
  - Memory
  - Recall
  - RAG
categories:
  - 技术研究
abbrlink: 38759
date: 2026-03-24 13:30:00
---

> 分析时间: 2026-03-24
> 分析维度: 召回策略 | 排序机制 | 上下文注入 | 多阶段召回

---

## 召回机制总览

### 召回模式分类

| 模式 | 代表项目 | 特点 |
|------|----------|------|
| **单路召回** | MemGPT, Memori | 向量检索或关键词匹配 |
| **多路召回** | mem0, ReMe | 向量 + 图遍历 |
| **三层召回** | SimpleMem | 语义 + 词汇 + 符号 |
| **画像驱动** | Memobase | 用户画像 + 事件时间线 |
| **认知分层** | OpenMemory | 5种认知类型 + Waypoint图 |

### 召回流程对比

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           记忆召回流程                                        │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  MemGPT:     Query → 向量检索 → 返回 Top-K                                  │
│                                                                             │
│  mem0:       Query → 向量检索 → 图遍历扩展 → 重排序 → 返回                   │
│                                                                             │
│  OpenMemory: Query → 扇区分类 → 多扇区检索 → Waypoint扩展 → 综合评分        │
│                                                                             │
│  SimpleMem:  Query → 查询分析 → 三层并行召回 → 融合排序 → 反思补充          │
│                                                                             │
│  Memobase:   Query → 画像匹配 → 事件相似度 → Token限制 → 返回上下文          │
│                                                                             │
│  ReMe:       Query → 向量检索 → 去重 → 阈值过滤 → 融合重排                  │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 各项目召回机制详解

### 1. MemGPT - 简洁双路召回

MemGPT 提供两种独立的召回方式：

```python
# ========== Recall Memory (对话历史) ==========
class RecallMemory:
    def text_search(self, query_string, count=None, start=None):
        """文本匹配搜索"""
        matches = [m for m in self._message_logs 
                   if query_string.lower() in m.content.lower()]
        return matches[start:start+count]

    def date_search(self, start_date, end_date, count=None, start=None):
        """日期范围搜索"""
        matches = [m for m in self._message_logs
                   if start_date <= m.timestamp <= end_date]
        return matches[start:start+count]

# ========== Archival Memory (向量存储) ==========
class ArchivalMemory:
    def search(self, query_string, count=None, start=None):
        """向量相似度搜索"""
        # 1. 查询嵌入
        query_vec = self.embed_model.get_text_embedding(query_string)
        # 2. 向量检索
        results = self.storage.query(query_string, query_vec, top_k=count)
        return results
```

**特点**:
- ✅ 简洁明了，易于理解
- ✅ Recall 支持文本和日期两种检索
- ✅ Archival 纯向量检索
- ⚠️ 缺少重排序机制

---

### 2. mem0 - 向量+图双引擎召回

```python
def search(self, query, user_id, limit=100, threshold=None, rerank=True):
    # 1. 构建过滤条件
    effective_filters = _build_filters(user_id, agent_id, run_id, filters)
    
    # 2. 并行执行：向量检索 + 图检索
    with ThreadPoolExecutor() as executor:
        future_memories = executor.submit(
            self._search_vector_store, query, effective_filters, limit
        )
        future_graph = executor.submit(
            self.graph.search, query, effective_filters, limit
        )
        
        memories = future_memories.result()
        relations = future_graph.result() if self.enable_graph else None
    
    # 3. 可选：重排序
    if rerank and self.reranker and memories:
        memories = self.reranker.rerank(query, memories, limit)
    
    # 4. 返回结果
    return {"results": memories, "relations": relations}
```

**高级过滤支持**:
```python
filters = {
    "key": "value",                    # 精确匹配
    "key": {"eq": "value"},            # 等于
    "key": {"ne": "value"},            # 不等于
    "key": {"in": ["v1", "v2"]},       # 包含于
    "key": {"gt": 10},                 # 大于
    "key": {"contains": "text"},       # 包含文本
    "AND": [filter1, filter2],         # 逻辑与
    "OR": [filter1, filter2],          # 逻辑或
}
```

**特点**:
- ✅ 并行执行向量+图检索
- ✅ 丰富的过滤操作符
- ✅ 可选重排序
- ✅ 返回关系图谱

---

### 3. OpenMemory - HSG 认知分层召回

```typescript
async function query(query_text: string, top_k: number) {
    // 1. 扇区分类 (确定查询属于哪些认知类型)
    const sector_class = await classifyContent(query_text);
    // 返回: { primary: "episodic", additional: ["emotional"], confidence: 0.85 }
    
    // 2. 多扇区嵌入
    const query_vecs = await embedMultiSector(query_text, sector_class);
    
    // 3. 扇区检索
    let results = [];
    for (const sector of sector_class.sectors) {
        const sector_results = await searchVectors({
            sector: sector,
            query_vec: query_vecs[sector],
            limit: top_k * 2
        });
        results.push(...sector_results);
    }
    
    // 4. Waypoint 图扩展
    results = await expandViaWaypoints(results);
    
    // 5. 综合评分
    for (const mem of results) {
        mem.score = 
            0.35 * mem.similarity +      // 向量相似度
            0.20 * mem.overlap +          // 内容重叠度
            0.15 * mem.waypoint_weight +  // Waypoint 权重
            0.10 * mem.recency +          // 时间新近度
            0.20 * mem.tag_match;         // 标签匹配度
    }
    
    // 6. 强化：提升命中记忆的显著性
    await reinforce(results);
    
    return results.slice(0, top_k);
}
```

**扇区分类规则**:
```typescript
const sector_patterns = {
    episodic: [
        /\b(today|yesterday|remember when|that time)\b/i,
        /\b(went|saw|met|visited|attended)\b/i
    ],
    semantic: [
        /\b(is a|means|defined as|concept|theory)\b/i,
        /\b(fact|statistic|data|evidence)\b/i
    ],
    procedural: [
        /\b(how to|step by step|guide|tutorial)\b/i,
        /\b(first|then|next|finally)\b/i
    ],
    emotional: [
        /\b(feel|feeling|happy|sad|angry|excited)\b/i,
        /\b(wow|omg|yay|nooo)\b/i
    ],
    reflective: [
        /\b(realize|insight|epiphany|lesson)\b/i,
        /\b(think|thought|pattern|connection)\b/i
    ]
};
```

**特点**:
- ✅ 5种认知类型自动分类
- ✅ 多因素综合评分 (5个维度)
- ✅ Waypoint 图扩展
- ✅ 记忆强化机制

---

### 4. SimpleMem - 三层混合召回 + 反思

```python
class HybridRetriever:
    def retrieve(self, query: str) -> List[MemoryEntry]:
        # 阶段 1: 智能规划
        information_plan = self._analyze_information_requirements(query)
        search_queries = self._generate_targeted_queries(query, information_plan)
        
        # 阶段 2: 三层并行召回
        all_results = self._execute_parallel_searches(search_queries)
        
        # 阶段 3: 融合去重
        merged_results = self._merge_and_deduplicate(all_results)
        
        # 阶段 4: 反思补充 (最多 2 轮)
        merged_results = self._retrieve_with_reflection(query, merged_results)
        
        return merged_results
    
    def _execute_single_search(self, query: str) -> Dict:
        """三层并行召回"""
        # Layer 1: Semantic (语义向量)
        semantic_results = self.vector_store.semantic_search(query, top_k=10)
        
        # Layer 2: Lexical (词汇 BM25)
        query_analysis = self._analyze_query(query)
        lexical_results = self.vector_store.keyword_search(
            query_analysis["keywords"], top_k=10
        )
        
        # Layer 3: Symbolic (符号元数据)
        symbolic_results = self.vector_store.structured_search(
            persons=query_analysis["persons"],
            location=query_analysis["location"],
            timestamp_range=self._parse_time_range(query_analysis["time_expression"])
        )
        
        return {
            "semantic": semantic_results,
            "lexical": lexical_results,
            "symbolic": symbolic_results
        }
    
    def _retrieve_with_reflection(self, query, initial_results):
        """反思式召回"""
        for round_num in range(self.max_reflection_rounds):
            # 检查当前结果是否足够
            adequacy = self._check_answer_adequacy(query, initial_results)
            
            if adequacy == "sufficient":
                break
            elif adequacy == "insufficient":
                # 生成补充查询
                additional_queries = self._generate_additional_queries(
                    query, initial_results
                )
                # 执行补充检索
                additional_results = self._execute_parallel_searches(additional_queries)
                # 合并
                initial_results = self._merge_and_deduplicate(
                    initial_results + additional_results
                )
        
        return initial_results
```

**查询分析示例**:
```python
# 输入: "上周我和张三在北京讨论了什么项目?"
# 输出:
{
    "keywords": ["讨论", "项目"],
    "persons": ["张三"],
    "time_expression": "上周",
    "location": "北京",
    "entities": []
}
```

**特点**:
- ✅ 三层召回 (语义/词汇/符号)
- ✅ 智能规划 + 反思补充
- ✅ 复杂度感知动态深度
- ✅ 最高 F1 分数 (43.24%)

---

### 5. Memobase - 画像驱动召回

```python
class MemobaseSearch:
    def search_memory(self, user_id, query, max_token_size=3000):
        user = self.client.get_user(user_id)
        
        # 核心 API: context()
        memories = user.context(
            max_token_size=max_token_size,
            chats=[{"role": "user", "content": query}],
            event_similarity_threshold=0.2,
            fill_window_with_events=True,
        )
        
        return memories
```

**服务端 context 实现**:
```python
async def get_user_context(user_id, chats, max_token_size, event_threshold):
    # 1. 获取用户画像
    profiles = await get_user_profiles(user_id)
    
    # 2. 如果有对话，进行相关性过滤
    if chats:
        profiles = await filter_profiles_with_chats(
            profiles, chats, only_topics=only_topics
        )
    
    # 3. Token 限制截断
    profiles = await truncate_profiles(
        profiles,
        max_token_size=max_token_size,
        prefer_topics=prefer_topics
    )
    
    # 4. 事件相似度匹配
    events = await search_similar_events(
        query_embedding=embed(chats[-1]["content"]),
        threshold=event_threshold
    )
    
    # 5. 填充上下文窗口
    context = fill_context_window(profiles, events, max_token_size)
    
    return context
```

**返回的上下文格式**:
```python
{
    "profiles": [
        {"topic": "work", "sub_topic": "programming", "content": "用户擅长Python开发"},
        {"topic": "interest", "sub_topic": "games", "content": "喜欢赛博朋克2077"}
    ],
    "events": [
        {"time": "2025-11-15", "content": "用户提到了新的项目计划"}
    ]
}
```

**特点**:
- ✅ 结构化用户画像
- ✅ 事件时间线
- ✅ Token 预算控制
- ✅ 超低延迟 (<100ms)

---

### 6. ReMe - 模块化召回流水线

```python
# ReMe 使用操作符模式构建召回流水线

# ========== Personal Memory 召回流水线 ==========
class RetrieveMemoryOp(BaseAsyncOp):
    async def async_execute(self):
        # 1. 获取查询
        query = self.context[self.op_params.get("recall_key", "query")]
        top_k = self.context.get("top_k", 3)
        
        # 2. 向量检索
        nodes = await self.vector_store.async_search(
            query=query,
            workspace_id=self.context.workspace_id,
            top_k=top_k
        )
        
        # 3. 转换为记忆对象
        memory_list = [vector_node_to_memory(node) for node in nodes]
        
        # 4. 去重
        seen_content = set()
        unique_memories = []
        for mem in memory_list:
            if mem.content not in seen_content:
                unique_memories.append(mem)
                seen_content.add(mem.content)
        
        # 5. 阈值过滤
        threshold = self.op_params.get("threshold_score")
        if threshold:
            unique_memories = [m for m in unique_memories 
                              if m.score >= threshold or m.score is None]
        
        # 6. 存入上下文
        self.context.response.metadata["memory_list"] = unique_memories

# ========== 完整召回流水线 ==========
# SetQueryOp → RetrieveMemoryOp → SemanticRankOp → FuseRerankOp → PrintMemoryOp
```

**流水线操作符**:
| 操作符 | 功能 |
|--------|------|
| SetQueryOp | 设置查询 |
| RetrieveMemoryOp | 向量检索 |
| SemanticRankOp | 语义重排 |
| FuseRerankOp | 融合重排 |
| PrintMemoryOp | 格式化输出 |
| ExtractTimeOp | 时间提取 |

**特点**:
- ✅ 操作符模式，可组合
- ✅ 支持多种记忆类型
- ✅ 内置去重和阈值过滤

---

### 7. LangMem - LangGraph 原生召回

```python
def create_search_memory_tool(namespace, store=None):
    """创建记忆搜索工具"""
    
    async def search_memory(
        query: str,
        limit: int = 10,
        offset: int = 0,
        filter: dict = None
    ):
        store = _get_store(store)
        namespace = namespacer()  # 运行时解析命名空间
        
        # LangGraph BaseStore 搜索
        results = await store.asearch(
            namespace,
            query=query,
            limit=limit,
            offset=offset,
            filter=filter
        )
        
        return [
            {"id": r.key, "content": r.value["content"], "score": r.score}
            for r in results
        ]
    
    return search_memory
```

**命名空间配置**:
```python
# 用户级隔离
namespace = ("memories", "{langgraph_user_id}")

# 项目级隔离
namespace = ("project_memories", "{project_id}", "{langgraph_user_id}")

# 类型级隔离
namespace = ("memories", "{langgraph_user_id}", "user_profile")
```

**特点**:
- ✅ LangGraph 原生集成
- ✅ 命名空间隔离
- ✅ 支持 create/update/delete 操作

---

## 召回策略对比

### 单路 vs 多路召回

| 策略 | 项目 | 优点 | 缺点 |
|------|------|------|------|
| **单路向量** | MemGPT | 简单高效 | 召回不全 |
| **向量+图** | mem0 | 关系推理 | 复杂度高 |
| **三层混合** | SimpleMem | 召回全面 | 计算量大 |
| **画像驱动** | Memobase | 个性化强 | 依赖画像质量 |

### 粗排 vs 精排

| 项目 | 粗排 | 精排 | 特点 |
|------|------|------|------|
| mem0 | 向量相似度 | Reranker 模型 | 可选精排 |
| OpenMemory | 扇区匹配 | 5因素综合评分 | 内置精排 |
| SimpleMem | 三层召回 | 反思式补充 | 多轮精排 |
| ReMe | 向量检索 | SemanticRankOp | 流水线精排 |

---

## 上下文注入策略

### 1. MemGPT - Core Memory 注入

```python
# Core Memory 始终在上下文中
system_prompt = f"""
Your persona: {core_memory.persona}
User info: {core_memory.human}

[Relevant memories from archival search will be inserted here]
"""
```

### 2. mem0 - 格式化注入

```python
def format_for_prompt(memories):
    return "\n".join([
        f"- {m['memory']} (relevance: {m['score']:.2f})"
        for m in memories
    ])

# 注入到系统提示
system_prompt = f"""
Relevant memories:
{format_for_prompt(memories)}

Based on these memories, answer the user's question.
"""
```

### 3. Memobase - Token 预算控制

```python
# 预算控制注入
context = user.context(
    max_token_size=3000,  # 最多 3000 tokens
    chats=current_messages
)

# 返回格式
prompt = f"""
User Profile:
{context['profiles']}

Recent Events:
{context['events']}
"""
```

---

## 性能对比

### LoCoMo 基准测试

| 项目 | F1 Score | 检索时间 | 总时间 |
|------|----------|----------|--------|
| **SimpleMem** | **43.24%** | 388.3s | 480.9s |
| mem0 | 34.20% | 583.4s | 1934.3s |
| A-Mem | 32.58% | 796.7s | 5937.2s |
| LightMem | 24.63% | 577.1s | 675.9s |

### 延迟对比

| 项目 | 延迟 | 说明 |
|------|------|------|
| **Memobase** | <100ms | 画像预加载 + 事件索引 |
| mem0 | ~200ms | 向量检索 + 图遍历 |
| SimpleMem | ~300ms | 三层召回 + 反思 |

---

## 选型建议

### 按召回需求选型

| 需求 | 推荐 | 理由 |
|------|------|------|
| **简单高效** | MemGPT | 单路向量检索 |
| **关系推理** | mem0 | 向量 + 图遍历 |
| **召回全面** | SimpleMem | 三层混合 + 反思 |
| **个性化** | Memobase | 画像驱动 |
| **认知模拟** | OpenMemory | 5种认知类型 |
| **可组合** | ReMe | 操作符流水线 |

### 按性能需求选型

| 指标 | 最佳 | 数据 |
|------|------|------|
| 最高 F1 | SimpleMem | 43.24% |
| 最低延迟 | Memobase | <100ms |
| 最全面 | OpenMemory | 5因素评分 |

---

## 总结

### 核心洞察

1. **向量检索是基础**: 所有项目都使用向量相似度作为核心召回
2. **多路召回是趋势**: 三层召回、向量+图等混合策略越来越普遍
3. **重排序很重要**: 精排能显著提升召回质量
4. **反思机制创新**: SimpleMem 的反思式召回是亮点
5. **Token 预算控制**: 生产环境必需的上下文管理

### 技术演进

```
单路向量 → 向量+图 → 三层混合 → 反思式召回 → 画像驱动
```

### 最佳实践

- **简单场景**: MemGPT 单路向量
- **生产环境**: mem0 或 Memobase
- **高召回质量**: SimpleMem 三层 + 反思
- **认知研究**: OpenMemory HSG 架构

---

*报告生成时间: 2026-03-24*
