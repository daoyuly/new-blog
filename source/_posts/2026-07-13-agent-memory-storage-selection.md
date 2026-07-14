---
title: Agent 记忆系统选型：从 Redis 到向量数据库
tags:
  - AI Agent
  - 记忆系统
  - 向量数据库
  - Redis
categories:
  - AI工程
abbrlink: 37921
date: 2026-07-13 18:30:00
---

# Agent 记忆系统选型：从 Redis 到向量数据库

Agent 需要记忆，这不是新鲜事。但"用什么存记忆"这事儿，选型文章不多。大部分教程要么用内存字典糊弄，要么直接上 Milvus 搞全套，中间地带很少聊。

这篇把常见的存储方案过一遍，说清楚各自的适用场景。

## 先搞清楚你要存什么

Agent 的记忆不是一块铁板，至少分三种：

- **工作记忆**：当前对话上下文，本轮任务的状态。生命周期：秒到分钟。
- **短期记忆**：最近 N 轮对话的摘要、最近执行的步骤。生命周期：分钟到小时。
- **长期记忆**：用户偏好、历史决策、学到的规则。生命周期：天到永久。

三种记忆的读写模式完全不同，硬要用一个存储方案搞定所有，要么性能差，要么成本高。

## 方案一：内存 / 进程内字典

最简单的方案，Python 字典搞定。

```python
class InMemoryMemory:
    def __init__(self):
        self.working = {}    # 工作记忆
        self.short_term = [] # 短期记忆
        self.long_term = {}  # 长期记忆
    
    def store(self, key: str, value, memory_type: str = "working"):
        if memory_type == "working":
            self.working[key] = value
        elif memory_type == "short":
            self.short_term.append({"key": key, "value": value})
            if len(self.short_term) > 100:
                self.short_term.pop(0)
        else:
            self.long_term[key] = value
    
    def recall(self, key: str, memory_type: str = "working"):
        ...
```

**优点：** 快，零依赖，调试方便。

**缺点：** 进程重启就没了。不能跨 Agent 共享。长期记忆多了以后查找效率低（O(n)遍历）。

**适合：** 原型验证、单 Agent 短任务。生产环境别用。

## 方案二：Redis

Redis 是工作记忆和短期记忆的最佳选择。

```python
import redis
import json

class RedisMemory:
    def __init__(self, agent_id: str):
        self.r = redis.Redis(host='localhost', port=6379)
        self.prefix = f"agent:{agent_id}"
    
    def store_working(self, key: str, value, ttl: int = 300):
        """工作记忆，5分钟过期"""
        k = f"{self.prefix}:working:{key}"
        self.r.setex(k, ttl, json.dumps(value))
    
    def store_short_term(self, conversation_id: str, messages: list):
        """短期记忆，最近N轮对话"""
        k = f"{self.prefix}:short:{conversation_id}"
        self.r.lpush(k, *[json.dumps(m) for m in messages])
        self.r.ltrim(k, 0, 49)  # 保留最近50条
        self.r.expire(k, 3600)   # 1小时过期
    
    def recall_working(self, key: str):
        k = f"{self.prefix}:working:{key}"
        val = self.r.get(k)
        return json.loads(val) if val else None
```

**优点：** 快（亚毫秒），天然支持 TTL，跨进程共享，持久化可选。

**缺点：** 不支持语义检索。你只能按 key 查，不能按"跟用户退款相关的记忆"查。

**适合：** 工作记忆、短期记忆，以及不需要语义检索的长期记忆（如 key-value 型的用户偏好）。

Redis 7.2+ 加了 RediSearch 的向量检索功能，但实测效果一般，不如专用向量数据库。

## 方案三：SQLite + 全文搜索

轻量级本地方案。适合单机部署的 Agent。

```python
import sqlite3
import json

class SQLiteMemory:
    def __init__(self, db_path: str = "agent_memory.db"):
        self.conn = sqlite3.connect(db_path)
        self.conn.execute("""
            CREATE TABLE IF NOT EXISTS memories (
                id INTEGER PRIMARY KEY,
                agent_id TEXT,
                content TEXT,
                metadata TEXT,
                timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        """)
        # 全文搜索索引
        self.conn.execute("""
            CREATE VIRTUAL TABLE IF NOT EXISTS memories_fts 
            USING fts5(content, metadata)
        """)
    
    def store(self, agent_id: str, content: str, metadata: dict = None):
        self.conn.execute(
            "INSERT INTO memories (agent_id, content, metadata) VALUES (?, ?, ?)",
            (agent_id, content, json.dumps(metadata or {}))
        )
        self.conn.execute(
            "INSERT INTO memories_fts (content, metadata) VALUES (?, ?)",
            (content, json.dumps(metadata or {}))
        )
        self.conn.commit()
    
    def search(self, query: str, limit: int = 5):
        rows = self.conn.execute("""
            SELECT m.* FROM memories m
            JOIN memories_fts f ON m.content = f.content
            WHERE memories_fts MATCH ?
            ORDER BY rank
            LIMIT ?
        """, (query, limit)).fetchall()
        return rows
```

**优点：** 零部署，文件级存储，支持全文搜索，够用。

**缺点：** 全文搜索不是语义搜索。搜"退款"找不到"退费"。不支持向量检索。不适合多进程并发写入。

**适合：** 桌面端 Agent、CLI Agent、单机小规模部署。

## 方案四：Chroma

Chroma 是最轻量的向量数据库，适合快速起步。

```python
import chromadb

class ChromaMemory:
    def __init__(self, agent_id: str):
        self.client = chromadb.PersistentClient(path=f"./memory/{agent_id}")
        self.collection = self.client.get_or_create_collection("long_term")
    
    def store(self, content: str, metadata: dict = None, doc_id: str = None):
        self.collection.add(
            documents=[content],
            metadatas=[metadata or {}],
            ids=[doc_id or f"mem_{len(self.collection.get()['ids'])}"]
        )
    
    def recall(self, query: str, top_k: int = 5):
        results = self.collection.query(
            query_texts=[query],
            n_results=top_k
        )
        return results["documents"][0]
```

**优点：** 嵌入式部署（纯 Python），零运维，自带 embedding（默认 all-MiniLM-L6-v2），API 简洁。

**缺点：** 不支持分布式，大数据量性能下降明显（10万条以上），持久化稳定性一般。

**适合：** 开发阶段、小规模生产（10万条记忆以下）、对部署复杂度敏感的场景。

## 方案五：Milvus / Qdrant / Weaviate

这三个是生产级向量数据库，功能类似，选型看偏好。

```python
# 以Qdrant为例（API最简洁）
from qdrant_client import QdrantClient
from qdrant_client.models import Distance, VectorSize, PointStruct

class QdrantMemory:
    def __init__(self, agent_id: str):
        self.client = QdrantClient(host="localhost", port=6333)
        self.collection = f"agent_{agent_id}"
        self.client.recreate_collection(
            collection_name=self.collection,
            vectors_config={"size": 1536, "distance": Distance.COSINE}
        )
    
    def store(self, content: str, embedding: list, metadata: dict = None):
        self.client.upsert(
            collection_name=self.collection,
            points=[PointStruct(
                id=hash(content) % (2**63),
                vector=embedding,
                payload={"content": content, **(metadata or {})}
            )]
        )
    
    def recall(self, query_embedding: list, top_k: int = 5):
        results = self.client.search(
            collection_name=self.collection,
            query_vector=query_embedding,
            limit=top_k
        )
        return [r.payload["content"] for r in results]
```

| 特性 | Milvus | Qdrant | Weaviate |
|------|--------|--------|----------|
| 部署复杂度 | 高（依赖etcd/MinIO） | 低（单二进制） | 中 |
| 性能（100万+向量） | 最好 | 好 | 好 |
| 过滤+向量混合查询 | ✅ | ✅ | ✅ |
| 云托管 | Zilliz Cloud | Qdrant Cloud | Weaviate Cloud |
| API 风格 | gRPC+REST | REST | GraphQL+REST |
| Go/Rust | Go | Rust | Go |

**适合：** 大规模生产部署（100万+向量），需要分布式、高可用、混合查询的场景。

## 选型决策树

```
你的Agent记忆规模多大？
├─ <1万条，单机部署
│   ├─ 需要语义检索？
│   │   ├─ 是 → Chroma（最简单）
│   │   └─ 否 → SQLite + FTS
│   └─ 只需要工作/短期记忆 → Redis
├─ 1-100万条，生产环境
│   ├─ 运维资源充足 → Milvus（性能最好）
│   ├─ 追求简单 → Qdrant（单二进制部署）
│   └─ 喜欢 GraphQL → Weaviate
└─ >100万条，高并发
    └─ Milvus Cluster / 云托管方案
```

## 混合方案：实际推荐

生产环境用单一方案很难覆盖所有需求。推荐混合架构：

- **Redis** → 工作记忆 + 短期记忆（快、TTL、跨进程）
- **向量数据库（Qdrant/Chroma）** → 长期记忆的语义检索
- **SQLite/Postgres** → 结构化元数据（用户偏好、配置、统计）

```python
class HybridMemory:
    def __init__(self, agent_id: str):
        self.redis = RedisMemory(agent_id)      # 快速存取
        self.vector = ChromaMemory(agent_id)     # 语义检索
        self.meta = SQLiteMemory(f"meta_{agent_id}")  # 结构化数据
    
    def store(self, content: str, memory_type: str, **kwargs):
        if memory_type in ("working", "short"):
            self.redis.store_working(content, **kwargs)
        else:
            # 长期记忆：同时存向量库和元数据
            self.vector.store(content, metadata=kwargs.get("metadata"))
            self.meta.store(agent_id, content, kwargs.get("metadata"))
    
    def recall(self, query: str, memory_type: str = "any"):
        if memory_type in ("working", "short"):
            return self.redis.recall_working(query)
        return self.vector.recall(query)  # 语义检索长期记忆
```

三层各司其职，不互相干扰。复杂度增加了，但每个存储都在它最擅长的场景工作。

别追求一步到位。先从 Redis + Chroma 开始，够用了再上 Milvus。记忆系统的选型和业务规模强相关，过早优化是浪费时间。

---

**相关阅读：**
- Chroma 官方文档 - https://docs.trychroma.com
- Qdrant 官方文档 - https://qdrant.tech/documentation
- Milvus 官方文档 - https://milvus.io/docs
- LangChain Memory 模块源码 - 各类 Memory 实现的参考
