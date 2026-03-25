---
title: AI Agent 记忆存储机制深度分析
tags:
  - AI
  - Agent
  - Memory
  - 存储架构
  - 向量数据库
categories:
  - 技术研究
abbrlink: 38091
date: 2026-03-24 13:20:00
---

> 分析时间: 2026-03-24
> 分析维度: 记忆数据结构 | 存储机制 | 检索策略 | 生命周期管理

---

## 存储架构总览

### 架构模式分类

| 模式 | 代表项目 | 特点 |
|------|----------|------|
| **单体存储** | Memori, SimpleMem | 简单直接，易于部署 |
| **分层存储** | MemGPT, OpenMemory, ReMe | 模拟人类记忆层次 |
| **混合存储** | mem0, MemOS, EverMemOS | 向量 + 图 + 关系数据库 |
| **画像驱动** | Memobase | 结构化用户画像 |
| **图谱驱动** | mem0 (Graph), MemOS | 知识图谱增强推理 |
| **文件系统** | OpenViking | 目录范式管理 |

### 存储层次对比

| 项目 | 第一层 | 第二层 | 第三层 |
|------|--------|--------|--------|
| **MemGPT** | Core Memory | Recall Memory | Archival Memory |
| **OpenMemory** | Episodic | Semantic | Procedural/Emotional/Reflective |
| **ReMe** | Working Memory | Personal/Task/Tool | - |
| **MemOS** | TextualMemory | ActivationMemory | ParametricMemory |
| **EverMemOS** | Episode | Profile | Foresight |
| **Memobase** | UserProfile | UserEvent | - |

---

## 记忆数据结构对比

### MemGPT - 三层数据结构

```python
# Core Memory (上下文内)
class CoreMemory:
    persona: str      # AI 人设/性格
    human: str        # 用户基本信息

# Recall Memory (对话历史)
class Message:
    user_id: uuid.UUID
    agent_id: uuid.UUID
    role: str
    text: str
    timestamp: datetime

# Archival Memory (向量存储)
class Passage:
    text: str
    embedding: List[float]
    embedding_dim: int
```

**特点**: Core Memory 始终在上下文中，Recall 存储对话历史，Archival 支持向量检索

---

### mem0 - 向量+图双模式

```python
class MemoryItem:
    id: str
    memory: str           # 记忆内容
    hash: str             # 内容哈希 (去重)
    metadata: dict        # 元数据
    score: float          # 相关性分数

class History:
    memory_id: str
    old_memory: str
    new_memory: str
    event: str            # ADD/UPDATE/DELETE
```

**特点**: 支持向量 + 图双引擎，SQLite 管理历史变更

---

### MemOS - MemCube 结构

```python
class TextualMemoryItem:
    id: str
    memory: str
    metadata: TreeNodeTextualMemoryMetadata

class TreeNodeTextualMemoryMetadata:
    memory_type: Literal[
        "WorkingMemory", "LongTermMemory",
        "UserMemory", "OuterMemory"
    ]
    sources: list[SourceMessage]   # 来源追踪
    embedding: list[float]
    usage: list[str]               # 使用历史
```

**特点**: 完整的来源追溯，多种记忆生命周期类型

---

### EverMemOS - MemCell + Foresight

```python
@dataclass
class MemCell:
    user_id_list: List[str]
    original_data: List[Dict]
    timestamp: datetime
    summary: str
    episode: str
    foresights: List['Foresight']  # 前瞻预测

@dataclass
class Foresight:
    trigger_condition: str    # 触发条件
    action_suggestion: str    # 行动建议
    validity_period: int      # 有效期
```

**特点**: 独特的 Foresight 前瞻记忆机制

---

### ReMe - 模块化记忆

```python
class BaseMemory:
    memory_type: str          # task/personal/tool
    when_to_use: str          # 检索条件描述
    content: str
    score: float

class TaskMemory(BaseMemory):
    memory_type: str = "task"

class ToolMemory(BaseMemory):
    tool_call_results: List[ToolCallResult]
```

**特点**: 模块化设计，when_to_use 支持条件检索

---

### OpenMemory - HSG 分层

```typescript
interface hsg_mem {
    content: string;
    primary_sector: string;     // episodic/semantic/procedural/emotional/reflective
    salience: number;           // 显著性
    decay_lambda: number;       // 衰退率
}

const decay_rates = {
    episodic: 0.015,    // 事件记忆衰退最快
    emotional: 0.020,   // 情感记忆次之
    procedural: 0.008,
    semantic: 0.005,
    reflective: 0.001   // 反思洞察最稳定
};
```

**特点**: 5 种认知类型，行业特定衰退率

---

### Memobase - 用户画像驱动

```python
class UserProfile:
    user_id: UUID
    profile_type: str
    content: dict    # JSONB 结构化画像

# 画像示例
profile_content = {
    "basic_info": {"name": "张三"},
    "interest": {"games": "赛博朋克2077"},
    "work": {"industry": "软件开发"}
}

class UserEvent:
    event_type: str
    event_content: str
    embedding: Vector    # pgvector
```

**特点**: 结构化用户画像 + 事件时间线

---

### SimpleMem - 原子条目

```python
@dataclass
class MemoryEntry:
    content: str              # 自包含事实
    timestamp: str            # 绝对时间戳
    entities: List[str]
    
    # 三层索引
    semantic_embedding: List[float]
    lexical_tokens: Set[str]
    symbolic_metadata: dict

# 转换示例
# 输入: "He'll meet Bob tomorrow at 2pm"
# 输出: "Alice will meet Bob at Starbucks on 2025-11-16T14:00:00"
```

**特点**: 语义无损压缩，写时消歧，绝对时间锚定

---

## 写入流程对比

### MemGPT

```
消息 → Core Memory 检查 → Recall 存储 → 定期摘要 → Archival
```

### mem0

```
消息 → 事实提取(LLM) → 去重检查 → 向量存储 → 可选:图谱构建 → History 记录
```

### MemOS

```
消息 → MemCube.add() → TextualMemory 存储 → 异步: MemScheduler 整理
```

### EverMemOS

```
对话流 → 边界检测 → MemCell → Episode/Profile/Foresight/EventLog 提取
```

### SimpleMem 三阶段

```
Stage 1: 语义结构化压缩 (共指消解 + 时间锚定)
Stage 2: 结构化索引 (原子 → 分子洞察)
Stage 3: 多层存储 (语义/词汇/符号)
```

### Memobase 批处理

```
消息 → BufferZone 缓冲 → 达到阈值 → 批处理 (3次LLM) → Profile/Event 更新
```

---

## 检索策略对比

### MemGPT

- **Recall**: 文本匹配 + 日期范围
- **Archival**: 向量相似度搜索

### mem0

- 向量搜索 + 可选图遍历扩展 + 可选重排序

### OpenMemory HSG

```typescript
综合评分 = 
    0.35 * 相似度 +
    0.20 * 重叠度 +
    0.15 * Waypoint权重 +
    0.10 * 新近度 +
    0.20 * 标签匹配
```

### SimpleMem 三层

- **Semantic**: 向量相似度
- **Lexical**: BM25 关键词
- **Symbolic**: 元数据过滤
- 融合排序 + 复杂度感知剪枝

---

## 生命周期管理

### 记忆衰退

| 项目 | 方式 | 公式/策略 |
|------|------|-----------|
| OpenMemory | 指数衰减 | `salience × e^(-λ × days)` |
| MemGPT | 摘要压缩 | 定期摘要旧消息 |
| MemOS | 状态迁移 | WorkingMemory → LongTermMemory |

### 记忆强化

```python
# OpenMemory
memory.salience = min(1.0, memory.salience + 0.1)
waypoint.weight = min(1.0, waypoint.weight + 0.05)
```

### 记忆清理

- **时间过滤**: 删除 N 天前的记忆
- **Waypoint 剪枝**: 删除权重 < 0.05 的关联

---

## 存储后端支持

### 向量存储

| 项目 | Qdrant | Pinecone | FAISS | Milvus | Chroma |
|------|--------|----------|-------|--------|--------|
| MemGPT | ❌ | ❌ | ❌ | ✅ | ✅ |
| mem0 | ✅ | ✅ | ✅ | ✅ | ✅ |
| MemOS | ✅ | ✅ | ✅ | ❌ | ❌ |

### 图存储

| 项目 | Neo4j | Memgraph | Kuzu |
|------|-------|----------|------|
| mem0 | ✅ | ✅ | ✅ |
| MemOS | ✅ | ❌ | ❌ |

### 关系数据库

| 项目 | PostgreSQL | SQLite | MongoDB |
|------|------------|--------|---------|
| MemGPT | ✅ | ✅ | ❌ |
| EverMemOS | ❌ | ❌ | ✅ |
| Memobase | ✅ (pgvector) | ❌ | ❌ |

---

## 选型决策矩阵

### 按存储需求

| 需求 | 推荐 |
|------|------|
| 纯向量检索 | mem0, MemGPT |
| 知识图谱推理 | mem0 (Graph), MemOS |
| 用户画像 | Memobase |
| 认知模拟 | OpenMemory |
| 前瞻预测 | EverMemOS |
| 高效压缩 | SimpleMem |

### 按性能需求

| 指标 | 最佳 | 数据 |
|------|------|------|
| 最高 F1 | SimpleMem | 43.24% |
| 最低延迟 | Memobase | <100ms |
| 最低成本 | Memobase | 减少 40-50% LLM 调用 |

### 按功能需求

| 功能 | 支持项目 |
|------|----------|
| 记忆追溯 | mem0, MemOS, ReMe |
| 记忆衰退 | OpenMemory, Memary |
| 记忆强化 | OpenMemory, mem0 |
| 前瞻预测 | EverMemOS |
| 工具记忆 | ReMe |
| 群组记忆 | EverMemOS |

---

## 总结

### 核心洞察

1. **数据结构趋同**: `id + content + metadata + embedding` 是标配
2. **分层是共识**: 所有项目都有记忆分层
3. **向量是基础**: 向量嵌入 + 相似度搜索是标配
4. **图是增强**: 知识图谱用于关系推理，但非必需
5. **时间是趋势**: 时间感知、事件时间线越来越重要
6. **成本是关键**: 批处理、压缩、缓存是优化重点

### 技术选型建议

| 场景 | 推荐 |
|------|------|
| 简单场景 | MemGPT |
| 生产环境 | mem0 或 Memobase |
| 研究实验 | OpenMemory 或 ALMA |
| 高效检索 | SimpleMem |

---

*报告生成时间: 2026-03-24*
