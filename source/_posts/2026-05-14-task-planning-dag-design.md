---
title: AI Agent 任务规划的 DAG 设计：从理论到工程实践
tags:
  - AI Agent
  - DAG
  - 任务规划
  - 工作流引擎
  - 依赖调度
  - 分布式系统
  - LLM
categories:
  - 技术深度分析
  - 系统设计
abbrlink: 37626
date: 2026-05-14 14:00:00
---

# AI Agent 任务规划的 DAG 设计：从理论到工程实践

> 当 LLM 学会了"思考"，谁来教它"编排"？  
> 答案是：DAG（有向无环图）。

## 引言：为什么 Agent 需要任务规划

大语言模型让 AI 具备了"单步推理"的能力——给它一个问题，它能给出回答。但现实世界的任务从来不是单步的：

- **写一篇技术报告**：调研 → 大纲 → 撰写 → 审校 → 发布
- **部署一个服务**：编译 → 测试 → 打包 → 部署 → 验证
- **处理一个客户工单**：分类 → 检索历史 → 生成方案 → 确认 → 执行

这些任务有一个共同特征：**步骤之间存在依赖关系，某些步骤可以并行，某些必须串行，某些步骤的输出是另一些步骤的输入**。

这正是 DAG（Directed Acyclic Graph，有向无环图）的天然领地。

本文将从理论到工程，系统性地分析 AI Agent 任务规划的 DAG 设计——为什么选 DAG、DAG 的数学模型、核心算法、与 LLM 的集成模式、工业级实现方案，以及前沿的动态 DAG 演化。

---

## 一、DAG 的数学基础与表达力

### 1.1 什么是 DAG

DAG（有向无环图）是一个满足以下两个条件的有向图：

1. **有向性**：每条边有明确的方向（从 A 到 B，而非 A-B）
2. **无环性**：不存在从某个节点出发沿着有向边能回到自身的路径

```
     [A]          A: 获取数据
    /   \         B: 清洗数据
  [B]   [C]       C: 训练模型（依赖 A）
    \   /         D: 评估（依赖 B 和 C）
     [D]          E: 部署（依赖 D）
      |
     [E]
```

**无环性的重要性**：如果存在环（A→B→C→A），系统就会陷入死锁——A 等 B 完成，B 等 C 完成，C 等 A 完成，谁也动不了。

### 1.2 DAG 的形式化定义

一个任务 DAG 定义为四元组：

$$G = (V, E, w, d)$$

其中：
- $V = \{v_1, v_2, ..., v_n\}$：任务节点集合
- $E \subseteq V \times V$：有向边集合，表示依赖关系
- $w: V \rightarrow \mathbb{R}^+$：节点权重函数（估计执行时间）
- $d: E \rightarrow D$：边上的数据传递描述

**关键约束**：

1. **无环性**：$\nexists$ 路径 $v_i \xrightarrow{+} v_i$
2. **依赖完备**：$\forall v_i \in V$，如果 $v_i$ 有前驱，则所有前驱完成才能执行 $v_i$
3. **数据一致性**：$v_i$ 的输入数据类型与所有前驱 $(v_j, v_i) \in E$ 的输出数据类型匹配

### 1.3 DAG vs 其他任务表达模型

| 模型 | 并行表达 | 条件分支 | 循环 | 动态性 | 适用场景 |
|------|---------|---------|------|-------|---------|
| **线性链** (Chain) | ❌ | ❌ | ❌ | ❌ | 简单管道 |
| **状态机** (FSM) | ❌ | ✅ | ✅ | 部分 | 游戏AI、对话系统 |
| **行为树** (BT) | ✅（并行节点） | ✅ | ✅ | 部分 | 机器人控制 |
| **Petri 网** | ✅ | ✅ | ✅ | ✅ | 并发系统建模 |
| **DAG** | ✅ | ✅（条件边） | ❌（本质无环） | ✅（动态构建） | 任务编排 |
| **工作流** (BPMN) | ✅ | ✅ | ✅ | ✅ | 业务流程 |

**DAG 的核心优势**：
1. **天然并行**：无依赖的节点可以立即并行执行
2. **拓扑排序**：有明确的执行顺序保证
3. **可组合**：子 DAG 可以作为大 DAG 的节点
4. **可验证**：环检测、依赖完备性都是多项式时间可解

**DAG 的局限**：
- **无法原生表达循环**：迭代/重试需要外层控制
- **静态结构**：运行前必须确定完整的图结构（但可通过动态 DAG 缓解）

---

## 二、Agent 任务规划的核心问题

### 2.1 从自然语言到 DAG：任务分解

这是 Agent 任务规划的核心挑战——将用户的一句话转化为一个可执行的 DAG。

**问题定义**：

> 给定自然语言任务描述 $T$，生成任务 DAG $G = (V, E, w, d)$，使得执行 $G$ 的结果满足 $T$ 的要求。

**子问题拆解**：

1. **任务识别**：$T$ 包含哪些原子任务？（$V$ 的确定）
2. **依赖推断**：哪些任务必须先于哪些任务？（$E$ 的确定）
3. **资源估算**：每个任务需要多少时间/资源？（$w$ 的确定）
4. **数据流设计**：任务之间传递什么数据？（$d$ 的确定）

### 2.2 任务粒度问题

DAG 设计中最关键的决策之一是**粒度选择**——每个节点应该代表多"大"的任务？

```
粒度过粗：                          粒度过细：
┌─────────────────┐               [获取API数据]
│                 │                    ↓
│  完成整个报告    │               [解析JSON]
│                 │                    ↓
└─────────────────┘               [清洗字段1]
                                     ↓
  问题：无法并行、无法容错          [清洗字段2]
                                     ↓
                                  [合并数据]
                                     ↓
                                  ... (20+ nodes)

  问题：调度开销大、依赖冗余
```

**粒度选择原则**：

| 原则 | 描述 | 示例 |
|------|------|------|
| **独立性** | 节点应该有明确的输入/输出，不依赖内部状态 | "获取用户数据" 是好的节点，"处理一半数据" 不是 |
| **可重试** | 节点失败后可以独立重试，不需要从头开始 | API 调用、文件写入 |
| **可并行** | 不同节点可以分配给不同的执行器 | 数据获取可以并行 |
| **有意义** | 节点对应一个人类可以理解的逻辑步骤 | 而非"调用第3行代码" |

**经验法则**：一个 DAG 节点应该对应"一个 API 调用"或"一次 LLM 推理"或"一个确定性的数据处理步骤"。

### 2.3 依赖类型与建模

DAG 中的依赖不只是简单的"A 完成才能做 B"。实际场景中的依赖类型更丰富：

| 依赖类型 | 含义 | DAG 表达 | 示例 |
|---------|------|---------|------|
| **硬依赖** | A 必须**成功**完成后 B 才能开始 | 有向边 A→B | 编译 → 测试 |
| **软依赖** | A 完成后 B 可以开始，但 B 不一定需要 A 的输出 | 有向边（可选标记） | 建议参考 → 生成方案 |
| **条件依赖** | A 的结果决定 B 是否执行 | 条件边 | 检查 → [如果失败] → 修复 |
| **数据依赖** | B 需要 A 的输出作为输入 | 有向边 + 数据标注 | 查询DB → 格式化结果 |
| **资源依赖** | A 和 B 不能同时使用同一资源 | 互斥约束（DAG 外） | 写同一文件 |

**条件依赖的 DAG 建模**：

条件依赖是最复杂的——它意味着 DAG 的结构在运行时才能确定。

```
              [检查输入]
              /        \
        (valid)      (invalid)
           /              \
      [处理数据]       [请求修正]
           \              /
            \            /
             [继续流程]
```

实现方案有两种：

1. **静态 DAG + 条件边**：运行前确定完整的图，条件边标记执行谓词
2. **动态 DAG**：运行时根据中间结果动态添加/删除节点和边

---

## 三、DAG 调度算法深度分析

### 3.1 拓扑排序与执行顺序

DAG 的执行顺序由拓扑排序（Topological Sort）确定。一个 DAG 可能有多种合法的拓扑排序，选择哪一种直接影响执行效率。

**Kahn 算法**（BFS 式拓扑排序）：

```python
def topological_sort_kahn(graph):
    """Kahn 算法：基于入度的拓扑排序"""
    in_degree = {node: 0 for node in graph.nodes}
    for u, v in graph.edges:
        in_degree[v] += 1
    
    # 入度为 0 的节点可以立即执行
    ready = deque([n for n, d in in_degree.items() if d == 0])
    order = []
    
    while ready:
        node = ready.popleft()
        order.append(node)
        for successor in graph.successors(node):
            in_degree[successor] -= 1
            if in_degree[successor] == 0:
                ready.append(successor)
    
    if len(order) != len(graph.nodes):
        raise CycleDetectedError("DAG 中存在环！")
    
    return order
```

**关键洞察**：Kahn 算法天然揭示了**最大并行度**——同一时刻所有入度为 0 的节点都可以并行执行。

### 3.2 关键路径分析

关键路径（Critical Path）是 DAG 中最长的路径，决定了任务的最短完成时间（无并行约束下）。

$$CP(G) = \max_{p \in \text{paths}(G)} \sum_{v \in p} w(v)$$

```python
def critical_path(graph, weights):
    """关键路径分析"""
    # 1. 拓扑排序
    topo_order = topological_sort_kahn(graph)
    
    # 2. 计算每个节点的最早完成时间 (Earliest Finish Time)
    earliest_start = {node: 0 for node in graph.nodes}
    earliest_finish = {}
    
    for node in topo_order:
        # 最早开始时间 = 所有前驱的最早完成时间的最大值
        for pred in graph.predecessors(node):
            earliest_start[node] = max(
                earliest_start[node], 
                earliest_finish[pred]
            )
        earliest_finish[node] = earliest_start[node] + weights[node]
    
    # 3. 关键路径长度 = 所有节点最早完成时间的最大值
    cp_length = max(earliest_finish.values())
    
    # 4. 反向追踪关键路径
    critical_nodes = []
    node = max(earliest_finish, key=earliest_finish.get)
    while node:
        critical_nodes.append(node)
        # 找前驱中最早完成时间 + 权重 = 当前最早开始时间的
        preds = list(graph.predecessors(node))
        if not preds:
            break
        node = max(preds, key=lambda p: earliest_finish[p])
    
    critical_nodes.reverse()
    return cp_length, critical_nodes
```

**对 Agent 调度的意义**：
- 关键路径上的任务应分配最高优先级和最多资源
- 非关键路径上的任务有"浮动时间"（slack），可以延迟而不影响总完成时间
- 优化关键路径上的任务是最有效的性能提升手段

### 3.3 并行调度策略

#### 3.3.1 最小完成时间调度

目标：最小化 DAG 的总完成时间（makespan）。

这是一个 NP-hard 问题（等价于带依赖约束的作业车间调度），但有多种近似算法：

**HEFT 算法**（Heterogeneous Earliest Finish Time）：

```python
def heft_schedule(graph, weights, processors):
    """HEFT 算法：异构处理器的 DAG 调度"""
    # 1. 计算每个节点的向上排名（upward rank）
    upward_rank = {}
    for node in reversed(topological_sort_kahn(graph)):
        succ_ranks = [
            weights[node] + avg_comm_cost(node, s) + upward_rank[s]
            for s in graph.successors(node)
        ]
        upward_rank[node] = weights[node] + (max(succ_ranks) if succ_ranks else 0)
    
    # 2. 按向上排名降序排列（关键路径优先）
    schedule_order = sorted(graph.nodes, key=lambda n: upward_rank[n], reverse=True)
    
    # 3. 贪心分配：每个任务分配到最早完成的处理器
    processor_available = [0] * len(processors)
    task_schedule = {}
    
    for node in schedule_order:
        # 最早开始时间受前驱约束
        earliest_start = max(
            (task_schedule[pred]['finish'] + comm_cost(pred, node, proc_idx)
             for pred in graph.predecessors(node)
             for proc_idx in range(len(processors))),
            default=0
        )
        
        # 选择最早完成的处理器
        best_proc = min(range(len(processors)),
                       key=lambda p: max(processor_available[p], earliest_start))
        
        actual_start = max(processor_available[best_proc], earliest_start)
        task_schedule[node] = {
            'processor': best_proc,
            'start': actual_start,
            'finish': actual_start + weights[node]
        }
        processor_available[best_proc] = actual_start + weights[node]
    
    return task_schedule
```

#### 3.3.2 Agent 场景下的调度策略

Agent 任务调度与传统的 HPC 调度有本质区别：

| 维度 | HPC 调度 | Agent 调度 |
|------|---------|-----------|
| 任务执行时间 | 可预测（秒级） | 不可预测（LLM 调用 1-30 秒） |
| 任务失败率 | 极低 | 较高（LLM 幻觉、API 故障） |
| 资源异构 | CPU/GPU | LLM/API/本地工具 |
| 优先级 | 固定 | 动态（用户反馈可能改变优先级） |
| 数据传递 | 文件/消息 | Token 上下文/JSON |

**Agent 适配的调度策略**：

```python
class AgentDAGScheduler:
    """适配 Agent 场景的 DAG 调度器"""
    
    def __init__(self, max_concurrent=5, timeout=60):
        self.max_concurrent = max_concurrent
        self.timeout = timeout
        self.executor = ThreadPoolExecutor(max_workers=max_concurrent)
    
    def schedule(self, dag):
        """调度执行 DAG"""
        in_degree = {n: dag.in_degree(n) for n in dag.nodes}
        ready_queue = PriorityQueue()
        running = {}
        results = {}
        
        # 初始化：入度为 0 的节点入队
        for node in dag.nodes:
            if in_degree[node] == 0:
                ready_queue.put((self._priority(node, dag), node))
        
        while not ready_queue.empty() or running:
            # 1. 提交就绪任务
            while not ready_queue.empty() and len(running) < self.max_concurrent:
                _, node = ready_queue.get()
                future = self.executor.submit(
                    self._execute_with_timeout, 
                    node, dag, results
                )
                running[node] = future
            
            if not running:
                break
            
            # 2. 等待任意一个完成
            done, _ = wait(running.values(), return_when=FIRST_COMPLETED)
            
            for future in done:
                node = [n for n, f in running.items() if f == future][0]
                try:
                    results[node] = future.result()
                    # 3. 更新后继节点的入度
                    for succ in dag.successors(node):
                        in_degree[succ] -= 1
                        if in_degree[succ] == 0:
                            ready_queue.put((self._priority(succ, dag), succ))
                except Exception as e:
                    # 容错：标记失败，尝试重试或跳过
                    self._handle_failure(node, e, dag, results)
                finally:
                    del running[node]
        
        return results
    
    def _priority(self, node, dag):
        """计算调度优先级（关键路径上的节点优先）"""
        return -dag.get_upward_rank(node)  # 负号：优先队列取最小
    
    def _execute_with_timeout(self, node, dag, results):
        """带超时执行"""
        # 准备输入：从已完成的前驱获取数据
        inputs = {
            pred: results[pred] 
            for pred in dag.predecessors(node)
        }
        return node.execute(inputs, timeout=self.timeout)
    
    def _handle_failure(self, node, error, dag, results):
        """失败处理策略"""
        if node.retry_count < node.max_retries:
            node.retry_count += 1
            # 重试
        elif node.is_optional:
            # 可选节点：跳过，用默认值
            results[node] = node.default_output
        else:
            # 必需节点：标记整个 DAG 失败
            raise DAGExecutionError(f"必需节点 {node} 失败: {error}")
```

---

## 四、LLM 驱动的 DAG 构建

### 4.1 从自然语言到 DAG 的转换

这是 Agent 任务规划最具挑战性的环节——让 LLM 理解任务并生成结构化的 DAG。

#### 4.1.1 单步生成 vs 渐进生成

**单步生成**：直接让 LLM 输出完整的 DAG

```python
SINGLE_STEP_PROMPT = """
你是一个任务规划专家。将以下任务分解为 DAG 格式。

任务：{task_description}

请输出 JSON 格式的 DAG：
{{
  "nodes": [
    {{"id": "task_1", "name": "...", "type": "...", "estimated_time": 5}},
    ...
  ],
  "edges": [
    {{"from": "task_1", "to": "task_2", "data_type": "..."}},
    ...
  ]
}}

约束：
1. 必须是有向无环图（DAG）
2. 每个节点有明确的输入和输出
3. 依赖关系必须合理
4. 粒度适中（5-15 个节点）
"""
```

**渐进生成**：先分解为子任务，再逐步细化依赖

```python
PROGRESSIVE_PROMPTS = [
    # 第一步：识别主要阶段
    """将任务 "{task}" 分解为 3-5 个主要阶段，每个阶段一个简短描述。输出 JSON 数组。""",
    
    # 第二步：细化每个阶段
    """将阶段 "{phase}" 细化为具体步骤，每个步骤应是一个可独立执行的操作。输出 JSON 数组。""",
    
    # 第三步：建立依赖
    """以下是一组任务步骤，请分析它们之间的依赖关系，哪些必须先完成，哪些可以并行？
    步骤：{steps}
    输出依赖边列表。""",
    
    # 第四步：验证 DAG
    """验证以下 DAG 是否合理：
    - 是否有环？
    - 依赖是否多余？
    - 粒度是否合适？
    DAG：{dag_json}
    如果有问题，请修正。""",
]
```

**渐进生成的优势**：

| 维度 | 单步生成 | 渐进生成 |
|------|---------|---------|
| 准确性 | 低（复杂任务容易遗漏） | 高（逐步验证） |
| 可控性 | 低 | 高（每步可人工干预） |
| 成本 | 低（1 次 LLM 调用） | 高（4+ 次 LLM 调用） |
| 复杂度 | 简单 | 需要编排逻辑 |
| 适用场景 | 简单任务（< 5 步） | 复杂任务（5+ 步） |

#### 4.1.2 DAG 验证与修正

LLM 生成的 DAG 不一定合法，需要验证和修正：

```python
class DAGValidator:
    """DAG 验证器"""
    
    def validate(self, dag):
        """验证 DAG 的合法性"""
        errors = []
        
        # 1. 环检测
        if self._has_cycle(dag):
            errors.append(ValidationError(
                severity='CRITICAL',
                message='DAG 中存在环',
                fix='移除形成环的边'
            ))
        
        # 2. 孤立节点检测
        orphans = self._find_orphans(dag)
        if orphans:
            errors.append(ValidationError(
                severity='WARNING',
                message=f'存在孤立节点: {orphans}',
                fix='确认这些节点是否应该连接到其他节点'
            ))
        
        # 3. 依赖冗余检测
        redundant = self._find_redundant_edges(dag)
        if redundant:
            errors.append(ValidationError(
                severity='INFO',
                message=f'存在冗余依赖边: {redundant}',
                fix='移除冗余边以简化图'
            ))
        
        # 4. 数据类型一致性
        type_errors = self._check_type_consistency(dag)
        if type_errors:
            errors.append(ValidationError(
                severity='ERROR',
                message=f'数据类型不一致: {type_errors}',
                fix='检查上下游节点的输入输出类型'
            ))
        
        # 5. 粒度检查
        granularity = self._check_granularity(dag)
        if granularity['too_fine'] or granularity['too_coarse']:
            errors.append(ValidationError(
                severity='WARNING',
                message=f'粒度问题: {granularity}',
                fix='调整节点粒度'
            ))
        
        return errors
    
    def _has_cycle(self, dag):
        """DFS 环检测"""
        WHITE, GRAY, BLACK = 0, 1, 2
        color = {node: WHITE for node in dag.nodes}
        
        def dfs(node):
            color[node] = GRAY
            for succ in dag.successors(node):
                if color[succ] == GRAY:
                    return True  # 发现环
                if color[succ] == WHITE and dfs(succ):
                    return True
            color[node] = BLACK
            return False
        
        return any(dfs(n) for n in dag.nodes if color[n] == WHITE)
    
    def _find_redundant_edges(self, dag):
        """检测冗余边：如果 A→C 已经通过 A→B→C 可达，则 A→C 是冗余的"""
        redundant = []
        for u, v in list(dag.edges):
            # 临时移除 u→v
            dag.remove_edge(u, v)
            # 检查 u 是否仍然可达 v
            if self._is_reachable(dag, u, v):
                redundant.append((u, v))
            dag.add_edge(u, v)
        return redundant
```

### 4.2 动态 DAG：运行时演化

静态 DAG 要求执行前确定完整的图结构，但 Agent 面对的任务往往需要**运行时动态调整**：

- 某个步骤的结果决定了后续步骤的数量（如：查询返回 N 条记录，每条需要处理）
- 某个步骤的失败需要插入修复步骤
- 用户中途修改了需求

**动态 DAG 的三种实现模式**：

#### 模式一：条件边

```python
class ConditionalEdge:
    """条件边：运行时决定是否激活"""
    
    def __init__(self, source, target, condition_fn):
        self.source = source
        self.target = target
        self.condition_fn = condition_fn
    
    def should_activate(self, context):
        return self.condition_fn(context)

# 示例：检查通过 → 部署；检查失败 → 修复 → 重新检查
check_deploy_edge = ConditionalEdge(
    source="检查",
    target="部署",
    condition_fn=lambda ctx: ctx["检查结果"] == "通过"
)

check_fix_edge = ConditionalEdge(
    source="检查",
    target="修复",
    condition_fn=lambda ctx: ctx["检查结果"] == "失败"
)
```

#### 模式二：扇出/扇入（Map-Reduce）

```python
class MapReduceNode:
    """扇出-扇入节点：动态创建子任务"""
    
    def __init__(self, map_fn, reduce_fn):
        self.map_fn = map_fn   # 生成子任务
        self.reduce_fn = reduce_fn  # 聚合结果
    
    def execute(self, inputs):
        # 1. 扇出：根据输入动态创建子任务
        sub_tasks = self.map_fn(inputs)
        
        # 2. 并行执行子任务
        results = parallel_execute(sub_tasks)
        
        # 3. 扇入：聚合结果
        return self.reduce_fn(results)

# 示例：批量处理用户数据
batch_processor = MapReduceNode(
    map_fn=lambda users: [ProcessUser(u) for u in users],  # 动态创建 N 个子任务
    reduce_fn=lambda results: aggregate(results)            # 聚合所有结果
)
```

#### 模式三：自适应 DAG（最灵活）

```python
class AdaptiveDAG:
    """自适应 DAG：运行时动态修改图结构"""
    
    def __init__(self, initial_dag=None):
        self.dag = initial_dag or DAG()
        self.completed = set()
        self.results = {}
    
    def on_node_complete(self, node, result):
        """节点完成时的回调：根据结果动态调整 DAG"""
        self.completed.add(node)
        self.results[node.id] = result
        
        # 根据结果动态添加节点
        if node.type == 'ANALYSIS' and result['has_anomalies']:
            # 发现异常 → 添加深度分析节点
            for anomaly in result['anomalies']:
                new_node = TaskNode(
                    id=f"investigate_{anomaly.id}",
                    name=f"调查异常: {anomaly.type}",
                    type="INVESTIGATION"
                )
                self.dag.add_node(new_node)
                self.dag.add_edge(node.id, new_node.id)
                # 新节点完成后还需要生成报告
                report_node = TaskNode(
                    id=f"report_{anomaly.id}",
                    name=f"异常报告: {anomaly.type}",
                    type="REPORT"
                )
                self.dag.add_node(report_node)
                self.dag.add_edge(new_node.id, report_node.id)
    
    def on_node_failure(self, node, error):
        """节点失败时的回调：插入修复步骤"""
        retry_node = TaskNode(
            id=f"retry_{node.id}",
            name=f"重试: {node.name}",
            type=node.type,
            config=node.config,
            max_retries=3
        )
        self.dag.add_node(retry_node)
        
        # 重定向依赖：原节点的后继指向重试节点
        for succ in list(self.dag.successors(node.id)):
            self.dag.remove_edge(node.id, succ)
            self.dag.add_edge(retry_node.id, succ)
        
        # 重试节点依赖原节点的输入
        for pred in self.dag.predecessors(node.id):
            self.dag.add_edge(pred, retry_node.id)
```

### 4.3 Plan-then-Execute vs ReAct

当前 Agent 的两种主流执行模式与 DAG 有不同的关系：

**Plan-then-Execute**（先规划后执行）：

```
用户请求 → LLM 生成 DAG → 调度器执行 DAG → 返回结果
```

- 优势：全局最优规划，可并行，可预估时间
- 劣势：规划可能与实际不符，无法灵活应对意外

**ReAct**（推理-行动交替）：

```
用户请求 → [思考 → 行动 → 观察] 循环 → 返回结果
```

- 优势：灵活，可实时调整
- 劣势：线性执行，无法并行，容易陷入局部最优

**DAG 增强的混合模式**：

```
用户请求 → LLM 生成初始 DAG → 执行 DAG（支持并行）
                                    ↓
                        遇到意外 → ReAct 模式处理 → 更新 DAG → 继续执行
```

```python
class HybridPlanner:
    """Plan-then-Execute + ReAct 混合模式"""
    
    def __init__(self, llm, dag_scheduler):
        self.llm = llm
        self.scheduler = dag_scheduler
    
    def execute(self, task):
        # Phase 1: Plan — 生成初始 DAG
        dag = self._plan_to_dag(task)
        
        # Phase 2: Execute — 带异常处理的 DAG 执行
        while not self.scheduler.is_complete(dag):
            try:
                results = self.scheduler.step(dag)  # 执行一批并行任务
            except UnexpectedResultError as e:
                # Phase 3: ReAct — 异常处理
                react_result = self._react_handle(e, dag)
                
                if react_result.action == 'MODIFY_DAG':
                    dag = react_result.modified_dag
                elif react_result.action == 'REPLAN':
                    dag = self._plan_to_dag(task, context=react_result.context)
                elif react_result.action == 'ABORT':
                    return ExecutionResult(status='FAILED', error=e)
        
        return ExecutionResult(status='SUCCESS', results=self.scheduler.results)
    
    def _react_handle(self, error, dag):
        """ReAct 模式处理异常"""
        thought = self.llm.reason(
            f"执行 DAG 时遇到异常: {error}\n"
            f"当前 DAG 状态: {dag.status()}\n"
            f"请分析原因并决定下一步行动。"
        )
        action = self.llm.decide(thought)
        return action
```

**关键洞察**：DAG 提供了**结构化的并行能力**，ReAct 提供了**灵活的异常处理**。两者结合，既有全局规划的高效，又有局部应变的灵活。

---

## 五、DAG 设计模式

### 5.1 线性管道（Pipeline）

最简单的 DAG——一条线性链。

```
[A] → [B] → [C] → [D]
```

适用：步骤间严格串行，无并行可能。

**Agent 示例**：文本处理管道
- 接收文本 → 分句 → 翻译 → 校对 → 返回

### 5.2 扇出-聚合（Fan-out / MapReduce）

```
        [A]
      / | \
    [B] [C] [D]
      \ | /
        [E]
```

适用：一个数据源需要多种并行处理，结果需要合并。

**Agent 示例**：多源调研
- 确定主题 → [搜索论文 / 搜索新闻 / 搜索GitHub] → 整合报告

### 5.3 钻石依赖（Diamond）

```
      [A]
     /   \
   [B]   [C]
     \   /
      [D]
```

适用：两个独立任务都需要同一输入，且都需要完成才能继续。

**Agent 示例**：代码部署
- 拉取代码 → [单元测试 / 代码扫描] → 合并报告 → 部署

### 5.4 条件分支（Conditional）

```
        [A]
       /    \
   (cond1) (cond2)
     /        \
   [B]        [C]
     \        /
        [D]
```

适用：根据中间结果走不同分支。

**Agent 示例**：客服处理
- 分类工单 → [技术问题 → 技术支持 / 账单问题 → 财务处理] → 发送回复

### 5.5 递归子图（SubDAG）

```
[外层DAG]
   └── [SubDAG: 数据处理]
          ├── [清洗]
          ├── [验证]
          └── [转换]
```

适用：复杂任务的层次化组织。子 DAG 封装了内部细节，对外只暴露输入输出。

**Agent 示例**：研究报告生成
- 主 DAG：大纲 → [子DAG: 各章节撰写] → 整合 → 审校
- 每个章节的子 DAG：收集素材 → 撰写初稿 → 自审 → 定稿

### 5.6 动态扇出（Dynamic Fan-out）

```
[A: 查询] → ??? → [B: 聚合]
              ↑
        运行时决定数量
```

适用：子任务数量在运行时才确定。

**Agent 示例**：批量邮件处理
- 获取邮件列表 → [处理邮件1 / 处理邮件2 / ... / 处理邮件N] → 汇总

### 5.7 模式选择决策树

```
任务是否有并行步骤？
├── 否 → Pipeline
└── 是 → 并行步骤的结果是否需要合并？
    ├── 否 → Fan-out (无需聚合)
    └── 是 → 是否有条件分支？
        ├── 否 → Diamond
        └── 是 → Conditional
              ↓
        是否需要层次化组织？
        ├── 否 → 使用基本模式
        └── 是 → SubDAG
              ↓
        子任务数量是否运行时确定？
        ├── 否 → 静态 DAG
        └── 是 → Dynamic Fan-out
```

---

## 六、工业级 DAG 引擎分析

### 6.1 主流 DAG 引擎对比

| 引擎 | 领域 | DAG 定义方式 | 动态性 | 容错 | 生态 |
|------|------|------------|-------|------|------|
| **Apache Airflow** | 数据工程 | Python 代码 | 低 | 重试 + 回填 | 极丰富 |
| **Prefect** | 数据工程 | Python + API | 中 | 自动重试 | 中等 |
| **Dagster** | 数据工程 | Python + 类型系统 | 中 | 级别化容错 | 中等 |
| **Temporal** | 微服务编排 | 代码 + 状态机 | 高 | 持久化执行 | 中等 |
| **Argo Workflows** | Kubernetes | YAML | 中 | 重试 + 继续 | K8s 生态 |
| **LangGraph** | AI Agent | Python + 图 | 高 | 检查点 | LLM 生态 |
| **CrewAI** | AI Agent | Python + 角色 | 中 | 有限 | LLM 生态 |
| **AutoGen** | AI Agent | 代码 + 对话 | 高 | 有限 | LLM 生态 |

### 6.2 Airflow 的 DAG 模型

Airflow 是最成熟的 DAG 引擎，其核心抽象值得深入分析：

```python
from airflow import DAG
from airflow.operators.python import PythonOperator
from datetime import timedelta

with DAG(
    dag_id='agent_task_pipeline',
    default_args={
        'retries': 3,
        'retry_delay': timedelta(minutes=5),
    },
    schedule_interval=None,  # 手动触发
) as dag:
    
    # 定义任务节点
    fetch_data = PythonOperator(
        task_id='fetch_data',
        python_callable=fetch_from_api,
    )
    
    clean_data = PythonOperator(
        task_id='clean_data',
        python_callable=clean_dataset,
    )
    
    train_model = PythonOperator(
        task_id='train_model',
        python_callable=train_ml_model,
    )
    
    evaluate = PythonOperator(
        task_id='evaluate',
        python_callable=evaluate_model,
    )
    
    # 定义依赖（DAG 边）
    fetch_data >> clean_data >> train_model >> evaluate
```

**Airflow 的核心设计理念**：
1. **DAG 即代码**：用 Python 代码定义，可版本控制
2. **静态优先**：DAG 结构在解析时确定，运行时不可变
3. **重试与回填**：失败任务自动重试，支持历史回填
4. **传感器（Sensor）**：等待外部条件的特殊节点

**对 Agent DAG 的启示**：
- "DAG 即代码" 的理念适合 Agent——LLM 生成的 DAG 可以序列化为可审查的代码
- 传感器模式适合 Agent 等待用户输入或外部事件
- 重试和回填机制是 Agent 容错的基础

### 6.3 LangGraph 的状态图模型

LangGraph 是专门为 LLM Agent 设计的图引擎，其核心创新是将**状态**引入 DAG：

```python
from langgraph.graph import StateGraph, END

# 定义状态类型
class AgentState(TypedDict):
    messages: list[BaseMessage]
    next_action: str
    documents: list[Document]

# 构建状态图
workflow = StateGraph(AgentState)

# 添加节点
workflow.add_node("researcher", research_node)
workflow.add_node("writer", writer_node)
workflow.add_node("reviewer", review_node)

# 添加条件边
workflow.add_conditional_edges(
    "reviewer",
    should_continue,
    {
        "continue": "writer",   # 修改后重新审校
        "end": END,             # 审校通过，结束
    }
)

# 添加普通边
workflow.add_edge("researcher", "writer")
workflow.add_edge("writer", "reviewer")

# 设置入口
workflow.set_entry_point("researcher")

# 编译
app = workflow.compile()
```

**LangGraph vs Airflow 的关键区别**：

| 维度 | Airflow | LangGraph |
|------|---------|-----------|
| 执行粒度 | 任务级（分钟-小时） | 步骤级（秒-分钟） |
| 状态管理 | 数据库持久化 | 内存 + 检查点 |
| 动态性 | 静态 DAG | 条件边 + 循环 |
| 循环支持 | ❌ | ✅（状态图而非严格 DAG） |
| 人工介入 | 手动触发 | 人工节点 |
| 适用场景 | 数据管道 | Agent 工作流 |

**LangGraph 的"伪 DAG"**：严格来说 LangGraph 支持循环边（reviewer → writer），因此不是真正的 DAG。但从设计意图上看，它用状态图扩展了 DAG 的表达力——循环不再是"结构性循环"，而是"迭代性循环"，每次循环的状态不同。

### 6.4 Temporal 的持久化执行

Temporal 采用了完全不同的范式——**持久化执行**（Durable Execution）：

```python
@workflow.defn
class AgentWorkflow:
    @workflow.run
    async def run(self, task: str) -> str:
        # 步骤 1: 规划
        plan = await workflow.execute_activity(
            generate_plan, task,
            start_to_close_timeout=timedelta(seconds=30),
        )
        
        # 步骤 2: 并行执行子任务
        futures = []
        for sub_task in plan.sub_tasks:
            futures.append(
                workflow.execute_activity(
                    execute_sub_task, sub_task,
                    start_to_close_timeout=timedelta(minutes=5),
                )
            )
        results = await asyncio.gather(*futures)
        
        # 步骤 3: 聚合
        final_result = await workflow.execute_activity(
            aggregate_results, results,
            start_to_close_timeout=timedelta(seconds=30),
        )
        
        return final_result
```

**Temporal 的关键优势**：
- **执行不丢失**：即使进程崩溃，重启后从上次完成的状态继续
- **天然支持长时间任务**：一个工作流可以运行数天
- **内置重试和超时**：声明式配置

**对 Agent DAG 的启示**：Agent 任务经常涉及长时间运行的 LLM 调用和外部 API，持久化执行是刚需。

---

## 七、Agent DAG 的完整工程实现

### 7.1 核心数据结构

```python
from dataclasses import dataclass, field
from enum import Enum
from typing import Any, Callable, Optional
import uuid

class TaskStatus(Enum):
    PENDING = "pending"
    READY = "ready"       # 所有前驱已完成
    RUNNING = "running"
    SUCCESS = "success"
    FAILED = "failed"
    SKIPPED = "skipped"
    RETRYING = "retrying"

class TaskType(Enum):
    LLM_CALL = "llm_call"           # LLM 推理
    API_CALL = "api_call"           # 外部 API 调用
    DATA_PROCESS = "data_process"   # 数据处理
    CONDITION = "condition"         # 条件判断
    MAP_REDUCE = "map_reduce"       # 扇出-聚合
    HUMAN_INPUT = "human_input"     # 人工介入

@dataclass
class TaskNode:
    id: str = field(default_factory=lambda: str(uuid.uuid4())[:8])
    name: str = ""
    task_type: TaskType = TaskType.LLM_CALL
    status: TaskStatus = TaskStatus.PENDING
    
    # 执行配置
    config: dict = field(default_factory=dict)
    timeout: float = 60.0
    max_retries: int = 3
    retry_count: int = 0
    is_optional: bool = False
    
    # 输入输出
    input_schema: dict = field(default_factory=dict)
    output_schema: dict = field(default_factory=dict)
    result: Any = None
    
    # 优先级（关键路径上的节点优先级更高）
    priority: float = 0.0
    
    # 估计执行时间（秒）
    estimated_time: float = 10.0

@dataclass
class TaskEdge:
    source: str       # 源节点 ID
    target: str       # 目标节点 ID
    data_mapping: dict = field(default_factory=dict)  # 数据映射
    condition: Optional[Callable] = None  # 条件函数（None 表示无条件）

class TaskDAG:
    """Agent 任务 DAG"""
    
    def __init__(self):
        self.nodes: dict[str, TaskNode] = {}
        self.edges: list[TaskEdge] = []
        self._adj: dict[str, list[str]] = {}      # 邻接表
        self._radj: dict[str, list[str]] = {}     # 反向邻接表
    
    def add_node(self, node: TaskNode):
        self.nodes[node.id] = node
        self._adj[node.id] = []
        self._radj[node.id] = []
    
    def add_edge(self, source: str, target: str, 
                 data_mapping: dict = None, condition: Callable = None):
        if source not in self.nodes or target not in self.nodes:
            raise ValueError(f"节点不存在: {source} 或 {target}")
        
        edge = TaskEdge(source, target, data_mapping or {}, condition)
        self.edges.append(edge)
        self._adj[source].append(target)
        self._radj[target].append(source)
        
        # 环检测
        if self._has_cycle():
            self.edges.pop()
            self._adj[source].pop()
            raise CycleError(f"添加边 {source}→{target} 会形成环！")
    
    def successors(self, node_id: str) -> list[str]:
        return self._adj.get(node_id, [])
    
    def predecessors(self, node_id: str) -> list[str]:
        return self._radj.get(node_id, [])
    
    def in_degree(self, node_id: str) -> int:
        return len(self._radj.get(node_id, []))
    
    def get_ready_nodes(self) -> list[TaskNode]:
        """获取所有前驱已完成的节点"""
        ready = []
        for node in self.nodes.values():
            if node.status == TaskStatus.PENDING:
                preds = self.predecessors(node.id)
                if all(
                    self.nodes[p].status in (TaskStatus.SUCCESS, TaskStatus.SKIPPED)
                    for p in preds
                ):
                    ready.append(node)
        return ready
    
    def to_dict(self) -> dict:
        """序列化为 JSON"""
        return {
            'nodes': [
                {'id': n.id, 'name': n.name, 'type': n.task_type.value,
                 'estimated_time': n.estimated_time, 'is_optional': n.is_optional}
                for n in self.nodes.values()
            ],
            'edges': [
                {'source': e.source, 'target': e.target,
                 'data_mapping': e.data_mapping,
                 'has_condition': e.condition is not None}
                for e in self.edges
            ]
        }
```

### 7.2 LLM 驱动的 DAG 构建器

```python
class LLMDAGBuilder:
    """LLM 驱动的 DAG 构建器"""
    
    def __init__(self, llm_client):
        self.llm = llm_client
        self.validator = DAGValidator()
    
    async def build(self, task_description: str, 
                    context: dict = None) -> TaskDAG:
        """从自然语言构建 DAG"""
        
        # Phase 1: 任务分解
        subtasks = await self._decompose(task_description, context)
        
        # Phase 2: 依赖推断
        dependencies = await self._infer_dependencies(subtasks)
        
        # Phase 3: 构建 DAG
        dag = self._construct_dag(subtasks, dependencies)
        
        # Phase 4: 验证与修正
        errors = self.validator.validate(dag)
        if errors:
            dag = await self._fix_errors(dag, errors)
        
        # Phase 5: 关键路径分析与优先级设定
        self._assign_priorities(dag)
        
        return dag
    
    async def _decompose(self, task: str, context: dict = None) -> list[dict]:
        """任务分解"""
        prompt = f"""将以下任务分解为可执行的子任务列表。

任务：{task}
{f"上下文：{context}" if context else ""}

要求：
1. 每个子任务应该有明确的输入和输出
2. 子任务粒度适中（一个 API 调用或一次 LLM 推理）
3. 避免过细（不要把一个 API 调用拆成 5 步）
4. 避免过粗（不要把"完成整个项目"作为一个子任务）

输出 JSON 数组：
[
  {{"id": "t1", "name": "子任务名称", "type": "llm_call|api_call|data_process|condition|human_input", "description": "详细描述", "estimated_time": 10}},
  ...
]"""
        
        response = await self.llm.generate(prompt)
        return json.loads(response)
    
    async def _infer_dependencies(self, subtasks: list[dict]) -> list[dict]:
        """依赖推断"""
        prompt = f"""分析以下子任务之间的依赖关系。

子任务列表：
{json.dumps(subtasks, ensure_ascii=False, indent=2)}

请分析：
1. 哪些任务必须等待其他任务完成才能开始？
2. 哪些任务可以并行执行？
3. 任务之间的数据如何传递？

输出依赖边列表：
[
  {{"source": "t1", "target": "t2", "data_mapping": {{"output_field": "input_field"}}, "condition": null}},
  ...
]

注意：
- 只添加必要的依赖（不要添加冗余依赖）
- 确保不会形成环
- 标注数据传递的映射关系"""
        
        response = await self.llm.generate(prompt)
        return json.loads(response)
    
    def _construct_dag(self, subtasks, dependencies) -> TaskDAG:
        """构建 DAG"""
        dag = TaskDAG()
        
        # 添加节点
        for task in subtasks:
            node = TaskNode(
                id=task['id'],
                name=task['name'],
                task_type=TaskType(task.get('type', 'llm_call')),
                estimated_time=task.get('estimated_time', 10),
            )
            dag.add_node(node)
        
        # 添加边
        for dep in dependencies:
            dag.add_edge(
                source=dep['source'],
                target=dep['target'],
                data_mapping=dep.get('data_mapping', {}),
            )
        
        return dag
    
    async def _fix_errors(self, dag, errors):
        """修正 DAG 错误"""
        critical_errors = [e for e in errors if e.severity == 'CRITICAL']
        if critical_errors:
            # 重新生成 DAG
            prompt = f"""DAG 验证发现以下错误：
{[e.message for e in critical_errors]}

当前 DAG：
{json.dumps(dag.to_dict(), indent=2)}

请修正错误并输出修正后的 DAG JSON。"""
            response = await self.llm.generate(prompt)
            return self._parse_dag_from_json(response)
        return dag
    
    def _assign_priorities(self, dag):
        """基于关键路径分配优先级"""
        ranks = self._compute_upward_ranks(dag)
        max_rank = max(ranks.values()) if ranks else 1
        for node_id, rank in ranks.items():
            dag.nodes[node_id].priority = rank / max_rank
    
    def _compute_upward_ranks(self, dag):
        """计算向上排名（关键路径长度）"""
        ranks = {}
        for node_id in reversed(self._topo_sort(dag)):
            succ_ranks = [
                ranks[s] + dag.nodes[s].estimated_time
                for s in dag.successors(node_id)
            ]
            ranks[node_id] = (
                dag.nodes[node_id].estimated_time + 
                (max(succ_ranks) if succ_ranks else 0)
            )
        return ranks
```

### 7.3 执行引擎

```python
class DAGExecutionEngine:
    """DAG 执行引擎"""
    
    def __init__(self, llm_client, max_concurrent=5, 
                 checkpoint_interval=30):
        self.llm = llm_client
        self.max_concurrent = max_concurrent
        self.checkpoint_interval = checkpoint_interval
        self.semaphore = asyncio.Semaphore(max_concurrent)
    
    async def execute(self, dag: TaskDAG, 
                      initial_context: dict = None) -> dict:
        """执行 DAG"""
        context = initial_context or {}
        results = {}
        
        while True:
            # 1. 获取就绪节点
            ready_nodes = dag.get_ready_nodes()
            if not ready_nodes:
                # 检查是否全部完成
                if all(n.status in (TaskStatus.SUCCESS, TaskStatus.SKIPPED, TaskStatus.FAILED)
                       for n in dag.nodes.values()):
                    break
                # 还有运行中的节点，等待
                await asyncio.sleep(0.5)
                continue
            
            # 2. 按优先级排序
            ready_nodes.sort(key=lambda n: n.priority, reverse=True)
            
            # 3. 并行执行
            tasks = []
            for node in ready_nodes:
                node.status = TaskStatus.RUNNING
                tasks.append(self._execute_node(node, dag, context, results))
            
            completed = await asyncio.gather(*tasks, return_exceptions=True)
            
            # 4. 处理结果
            for node, result in zip(ready_nodes, completed):
                if isinstance(result, Exception):
                    await self._handle_failure(node, result, dag, context)
                else:
                    node.status = TaskStatus.SUCCESS
                    node.result = result
                    results[node.id] = result
                    
                    # 条件边处理
                    self._evaluate_conditions(node, dag)
        
        return results
    
    async def _execute_node(self, node, dag, context, results):
        """执行单个节点"""
        async with self.semaphore:
            # 准备输入
            inputs = self._prepare_inputs(node, dag, results)
            inputs.update(context)
            
            # 根据节点类型执行
            if node.task_type == TaskType.LLM_CALL:
                return await self._execute_llm(node, inputs)
            elif node.task_type == TaskType.API_CALL:
                return await self._execute_api(node, inputs)
            elif node.task_type == TaskType.DATA_PROCESS:
                return self._execute_process(node, inputs)
            elif node.task_type == TaskType.CONDITION:
                return self._execute_condition(node, inputs)
            elif node.task_type == TaskType.HUMAN_INPUT:
                return await self._execute_human(node, inputs)
            else:
                raise ValueError(f"未知任务类型: {node.task_type}")
    
    def _prepare_inputs(self, node, dag, results):
        """从已完成的前驱节点收集输入"""
        inputs = {}
        for pred_id in dag.predecessors(node.id):
            if pred_id in results:
                # 查找边上的数据映射
                edge = next(
                    e for e in dag.edges 
                    if e.source == pred_id and e.target == node.id
                )
                if edge.data_mapping:
                    for src_field, dst_field in edge.data_mapping.items():
                        inputs[dst_field] = results[pred_id].get(src_field)
                else:
                    inputs[pred_id] = results[pred_id]
        return inputs
    
    async def _execute_llm(self, node, inputs):
        """执行 LLM 调用"""
        prompt = node.config.get('prompt_template', '').format(**inputs)
        response = await self.llm.generate(
            prompt,
            timeout=node.timeout,
        )
        # 解析响应
        if node.output_schema:
            return self._parse_structured_output(response, node.output_schema)
        return {'text': response}
    
    async def _handle_failure(self, node, error, dag, context):
        """失败处理"""
        node.retry_count += 1
        
        if node.retry_count <= node.max_retries:
            node.status = TaskStatus.RETRYING
            # 指数退避
            delay = min(2 ** node.retry_count, 60)
            await asyncio.sleep(delay)
            node.status = TaskStatus.PENDING  # 重新入队
        elif node.is_optional:
            node.status = TaskStatus.SKIPPED
            node.result = node.config.get('default_output', {})
        else:
            node.status = TaskStatus.FAILED
            raise DAGExecutionError(
                f"节点 {node.name} 执行失败: {error}"
            )
```

### 7.4 检查点与恢复

长时间运行的 Agent DAG 需要检查点机制，以便崩溃后恢复：

```python
class CheckpointManager:
    """DAG 执行检查点"""
    
    def __init__(self, storage_backend='file'):
        self.backend = storage_backend
        self.checkpoint_dir = Path('./checkpoints')
        self.checkpoint_dir.mkdir(exist_ok=True)
    
    async def save(self, dag_id: str, dag: TaskDAG, results: dict):
        """保存检查点"""
        checkpoint = {
            'dag_id': dag_id,
            'timestamp': time.time(),
            'nodes': {
                nid: {
                    'status': n.status.value,
                    'result': self._serialize(n.result),
                    'retry_count': n.retry_count,
                }
                for nid, n in dag.nodes.items()
            },
            'results': self._serialize(results),
            'dag_structure': dag.to_dict(),
        }
        
        path = self.checkpoint_dir / f"{dag_id}.json"
        path.write_text(json.dumps(checkpoint, ensure_ascii=False, indent=2))
    
    async def restore(self, dag_id: str) -> tuple[TaskDAG, dict]:
        """从检查点恢复"""
        path = self.checkpoint_dir / f"{dag_id}.json"
        if not path.exists():
            raise CheckpointNotFoundError(dag_id)
        
        checkpoint = json.loads(path.read_text())
        
        # 重建 DAG
        dag = self._reconstruct_dag(checkpoint['dag_structure'])
        
        # 恢复节点状态
        for nid, state in checkpoint['nodes'].items():
            if nid in dag.nodes:
                dag.nodes[nid].status = TaskStatus(state['status'])
                dag.nodes[nid].result = state['result']
                dag.nodes[nid].retry_count = state['retry_count']
        
        results = checkpoint['results']
        return dag, results
```

---

## 八、高级话题

### 8.1 DAG 的代价模型

在选择 DAG 策略时，需要考虑 LLM 调用的代价：

**单次 LLM 调用成本**：

$$C_{llm} = \frac{T_{input} \times P_{input} + T_{output} \times P_{output}}{1000}$$

其中 $T$ 是 token 数，$P$ 是每千 token 价格。

**DAG 执行总成本**：

$$C_{total} = \sum_{v \in V} C_{llm}(v) + C_{coordination}$$

$$C_{coordination} = \sum_{v \in V} (R_v \times C_{retry}) + C_{context\_propagation}$$

**关键优化**：
1. 减少不必要的 LLM 调用（用确定性步骤替代）
2. 压缩上下文传播（不要把整个中间结果都传给下游）
3. 增加并行度以减少时间成本（但可能增加 token 成本）

### 8.2 多 Agent DAG 协作

当 DAG 的节点由不同角色的 Agent 执行时，协作模式成为关键：

```python
class MultiAgentDAG:
    """多 Agent DAG 协作"""
    
    def __init__(self):
        self.agents = {}  # role -> Agent
        self.shared_context = GlobalWorkspace()
    
    def assign_agents(self, role_mapping: dict):
        """为 DAG 节点分配 Agent"""
        for node_id, role in role_mapping.items():
            self.agents[node_id] = self._get_agent_for_role(role)
    
    async def execute(self, dag: TaskDAG):
        """多 Agent 协作执行"""
        results = {}
        
        for layer in self._topological_layers(dag):
            # 同一层的任务可以并行
            layer_tasks = []
            for node_id in layer:
                agent = self.agents.get(node_id)
                task = self._create_agent_task(agent, node_id, dag, results)
                layer_tasks.append(task)
            
            layer_results = await asyncio.gather(*layer_tasks)
            
            for node_id, result in zip(layer, layer_results):
                results[node_id] = result
                # 广播到共享上下文
                self.shared_context.broadcast(node_id, result)
        
        return results
    
    def _topological_layers(self, dag):
        """拓扑分层：同层节点无依赖，可并行"""
        layers = []
        remaining = set(dag.nodes.keys())
        completed = set()
        
        while remaining:
            layer = []
            for nid in list(remaining):
                preds = set(dag.predecessors(nid))
                if preds.issubset(completed):
                    layer.append(nid)
            
            if not layer:
                raise CycleError("DAG 中存在环")
            
            layers.append(layer)
            completed.update(layer)
            remaining -= set(layer)
        
        return layers
```

### 8.3 DAG 可观测性

生产环境的 DAG 需要完整的可观测性：

```python
class DAGTelemetry:
    """DAG 执行遥测"""
    
    def __init__(self):
        self.events = []
        self.metrics = {
            'total_nodes': 0,
            'completed_nodes': 0,
            'failed_nodes': 0,
            'total_time': 0,
            'critical_path_time': 0,
            'parallelism_efficiency': 0,
        }
    
    def record(self, event_type, node_id, data=None):
        """记录事件"""
        self.events.append({
            'timestamp': time.time(),
            'event_type': event_type,
            'node_id': node_id,
            'data': data or {},
        })
    
    def compute_metrics(self, dag, results):
        """计算执行指标"""
        total_time = max(
            e['timestamp'] for e in self.events 
            if e['event_type'] == 'node_complete'
        ) - min(
            e['timestamp'] for e in self.events 
            if e['event_type'] == 'dag_start'
        )
        
        # 并行效率 = 理想时间 / 实际时间
        ideal_time = sum(n.estimated_time for n in dag.nodes.values())
        parallelism_efficiency = ideal_time / total_time if total_time > 0 else 0
        
        return {
            'total_nodes': len(dag.nodes),
            'completed_nodes': sum(1 for n in dag.nodes.values() 
                                   if n.status == TaskStatus.SUCCESS),
            'failed_nodes': sum(1 for n in dag.nodes.values() 
                               if n.status == TaskStatus.FAILED),
            'total_time_seconds': total_time,
            'parallelism_efficiency': parallelism_efficiency,
            'llm_tokens_used': sum(n.result.get('tokens', 0) 
                                   for n in dag.nodes.values() 
                                   if n.result),
            'estimated_cost_usd': self._compute_cost(dag),
        }
```

### 8.4 DAG 的测试策略

```python
class DAGTester:
    """DAG 测试框架"""
    
    def test_dag_validity(self, dag):
        """测试 DAG 合法性"""
        # 1. 无环
        assert not self._has_cycle(dag), "DAG 有环"
        
        # 2. 无孤立节点
        for node in dag.nodes.values():
            assert dag.in_degree(node.id) > 0 or dag.out_degree(node.id) > 0, \
                f"节点 {node.name} 是孤立的"
        
        # 3. 数据类型一致
        for edge in dag.edges:
            source = dag.nodes[edge.source]
            target = dag.nodes[edge.target]
            assert self._types_compatible(source.output_schema, target.input_schema), \
                f"边 {edge.source}→{edge.target} 数据类型不匹配"
    
    def test_dag_executability(self, dag):
        """测试 DAG 可执行性"""
        # 1. 所有节点都有执行器
        for node in dag.nodes.values():
            assert node.task_type in self.executor_registry, \
                f"节点 {node.name} 的类型 {node.task_type} 没有执行器"
        
        # 2. 估计时间合理
        for node in dag.nodes.values():
            assert 0 < node.estimated_time < 3600, \
                f"节点 {node.name} 的估计时间不合理: {node.estimated_time}"
    
    def test_dag_resilience(self, dag):
        """测试 DAG 弹性"""
        # 模拟每个节点失败，验证 DAG 是否能优雅降级
        for node in dag.nodes.values():
            if not node.is_optional:
                # 必需节点失败 → 整个 DAG 应该失败
                with self._simulate_failure(node):
                    with pytest.raises(DAGExecutionError):
                        self.engine.execute(dag)
            else:
                # 可选节点失败 → DAG 应该继续
                with self._simulate_failure(node):
                    result = self.engine.execute(dag)
                    assert result is not None
```

---

## 九、前端可视化与交互

### 9.1 DAG 可视化

DAG 的可视化对于理解和调试至关重要：

```
┌─────────────────────────────────────────────┐
│  Task DAG: 生成技术报告                       │
│                                              │
│  [调研主题] ──────┐                          │
│       │           │                          │
│       ▼           ▼                          │
│  [搜索论文]   [搜索GitHub]   ✅ 已完成        │
│       │           │                          │
│       └─────┬─────┘                          │
│             ▼                                │
│  [整理大纲] 🔄 运行中                         │
│             │                                │
│       ┌─────┴──────┐                         │
│       ▼            ▼                         │
│  [撰写正文]   [制作图表]  ⏳ 等待中            │
│       │            │                         │
│       └─────┬──────┘                         │
│             ▼                                │
│  [审校发布]  ⏳ 等待中                         │
│                                              │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━               │
│  进度: 3/6 | 耗时: 45s | 预计剩余: 60s        │
└─────────────────────────────────────────────┘
```

### 9.2 交互式 DAG 编辑

允许用户在 LLM 生成 DAG 后进行微调：

- 拖拽调整节点顺序
- 点击节点编辑参数
- 右键添加/删除/禁用节点
- 切换边的条件

---

## 十、总结与展望

### 10.1 核心要点回顾

| 要点 | 说明 |
|------|------|
| DAG 是 Agent 并行的基石 | 有向无环图天然表达任务依赖和并行关系 |
| 粒度选择是关键 | 太粗无法并行，太细调度开销大 |
| 动态 DAG 是 Agent 的刚需 | 运行时才能确定完整结构的场景很常见 |
| Plan + ReAct 是最佳组合 | DAG 提供结构化并行，ReAct 提供灵活应变 |
| LLM 生成 DAG 需要验证 | 幻觉可能产生非法图结构 |
| 关键路径决定性能瓶颈 | 优化关键路径上的任务最有效 |

### 10.2 开放问题

1. **LLM 生成的 DAG 质量如何保证？**——需要更强的结构化输出约束
2. **动态 DAG 的可验证性**——运行时修改图结构后如何保证安全性？
3. **DAG 与循环的统一**——LangGraph 用状态图扩展了 DAG，但理论模型还不清晰
4. **跨 Agent 的 DAG 编排**——不同 Agent 的 DAG 如何组合和协调？
5. **自适应粒度**——DAG 的粒度能否根据运行情况自动调整？

### 10.3 未来趋势

1. **声明式 DAG**：用户只需描述"做什么"，"怎么编排"由系统自动决定
2. **DAG 编译优化**：类似数据库查询优化器，自动合并、重排、并行化 DAG
3. **DAG 市场**：可复用的 DAG 模板库，类似 GitHub Actions marketplace
4. **可验证 DAG**：形式化方法保证 DAG 的安全性和正确性
5. **神经 DAG**：用神经网络学习最优的 DAG 结构

---

## 参考文献

1. Li, Y., et al. (2026). Beyond Entangled Planning: Task-Decoupled Planning for Long-Horizon Agents. *arXiv preprint*.
2. Jafari, A.A., et al. (2026). A Lightweight Modular Framework for Constructing Autonomous Agents: AgentForge. *arXiv preprint*.
3. Moslemi, Z., et al. (2026). POLARIS: Typed Planning and Governed Execution for Agentic AI. *arXiv preprint*.
4. Del Rosario, R.F., et al. (2025). Architecting Resilient LLM Agents: A Guide to Secure Plan-then-Execute. *arXiv preprint*.
5. Ye, Y. (2025). Task Memory Engine: Spatial Memory for Robust Multi-Step LLM Agents. *arXiv preprint*.
6. Topcuoglu, H., et al. (2002). Performance-effective and low-complexity task scheduling for heterogeneous computing. *IEEE TPDS*.
7. Kahn, A.B. (1962). Topological sorting of large networks. *Communications of the ACM*.
8. Dean, J., & Ghemawat, S. (2004). MapReduce: Simplified data processing on large clusters. *OSDI*.
9. Airflow documentation. https://airflow.apache.org
10. LangGraph documentation. https://langchain-ai.github.io/langgraph/
11. Temporal documentation. https://docs.temporal.io
12. Prefect documentation. https://docs.prefect.io
13. Dagster documentation. https://docs.dagster.io
14. Argo Workflows documentation. https://argoproj.github.io/argo-workflows/

---

> **DAG 不是目的，而是手段。**  
> 目标是让 Agent 像人类一样高效地组织工作——哪些先做、哪些并行、哪些可以跳过、失败了怎么办。DAG 是我们目前找到的最优雅的形式化工具。

---

*撰写日期：2026-05-14*  
*字数：~15,000 字*
