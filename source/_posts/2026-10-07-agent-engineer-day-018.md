---
title: "AI Agent 工程师 Day 18：Checkpoint：让 Agent 可以崩溃恢复"
date: 2026-10-07 10:30:00
tags:
  - Checkpoint
  - SQLite
  - 持久化
  - 可靠性
categories:
  - AI Agent 工程师学习计划
  - M1 LLM + Agent Runtime
description: "Day 18/168 | M1 Agent 持久化 | Checkpoint：让 Agent 可以崩溃恢复。6 个月从 LLM 到生产级 Agent 系统的完整学习路线。"
keywords: "AI Agent, 工程师, Agent 持久化, Checkpoint, SQLite, 持久化, 可靠性"
author: OpenClaw Agent Learning
---

# AI Agent 工程师 Day 18：Checkpoint：让 Agent 可以崩溃恢复

> **6 个月学习计划** | M1 - LLM + Agent Runtime | Day 18/168
> 
> **今日主题**: Agent 持久化

---

# Checkpoint：让 Agent 可以崩溃恢复

**核心结论先行**：Checkpoint（检查点/断点持久化）是 Agent 从"Demo 玩具"变成"生产系统"的分水岭。它的本质只有一句话——**把 Agent 的执行状态（State）按步骤序列化写入持久存储，使得进程崩溃后可以从最近一次检查点恢复，而不是从零重跑**。技术上没有黑魔法：一个 `run_id`、一个 step 计数、一份可序列化的 state、一个 SQLite 表，就构成了崩溃恢复（Crash Recovery）的最小实现。真正需要权衡的是检查频率与性能开销、以及"恢复点之后发生了什么"的语义问题。理解了这五件事，你就掌握了 Agent 持久化的全部骨架。

---

## 一、背景与动机：为什么这个能力是必修课

设想一个真实场景：你的 Agent 正在执行一个 20 步的长任务——调了 3 次搜索、跑了 2 次代码、中间花了 40 秒 LLM 推理。第 7 步时服务器重启、进程被 OOM Killer 杀掉、或者部署流水线把容器干掉了。

没有 Checkpoint 的系统只有两个选择：

1. **从头重跑**：前面 6 步的 LLM 调用、工具执行全部重来，费用翻倍，且工具可能有副作用（重复发邮件、重复写库）；
2. **直接失败**：用户看到报错，任务丢失。

有了 Checkpoint，系统可以做到第三种结果：**从第 6 步的快照恢复，继续执行第 7 步**。这就是 Run → Checkpoint → Process crash → Resume 的完整闭环。

在 6 个月 AI Agent 工程师路线中，这个主题位于 M1 第 3 周，属于"Agent Runtime（运行时）"模块的核心。它向前依赖的是你已经理解的 Agent 执行循环（LLM 调用 → 工具执行 → 循环）和 State 设计；向后支撑的是人机协同（Human-in-the-loop 需要暂停/恢复）、长任务编排、以及后面会学到的多 Agent 系统的状态共享。**可以说，没有持久化，就没有生产级 Agent。**

业界旁证：LangGraph 的核心卖点之一就是 checkpoint-based persistence；OpenAI 的 Assistants API 内置 Thread 持久化；Temporal、Durable Functions 等工作流引擎的思想同源。这个模式在分布式系统领域叫 **Durable Execution（持久化执行）**，Agent 只是它的最新应用者。

---

## 二、核心内容

### 2.1 Run → Checkpoint → Crash → Resume：最小闭环

先建立精确的概念命名：

| 术语 | 英文 | 定义 |
|---|---|---|
| 运行 | Run | Agent 从接受任务到完成的一次完整执行过程 |
| 状态 | State | 某一时刻 Agent 的全部信息：消息历史、中间结果、变量、当前步数 |
| 检查点 | Checkpoint | 某一步执行完成后，State 的持久化快照 |
| 恢复 | Resume | 从 Checkpoint 加载 State，重建内存上下文，继续执行 |
| 幂等性 | Idempotency | 同一操作重复执行结果不变——恢复设计的关键约束 |

整个生命周期的因果链是这样的：

```
用户任务
   │
   ▼
Run 启动（分配 run_id）
   │
   ▼
Step 1 执行 ──► 写 Checkpoint 1（state + step=1）
   │
Step 2 执行 ──► 写 Checkpoint 2
   │
   ...
Step N-1 执行 ──► 写 Checkpoint N-1
   │
   ▼
Step N 执行中 ◄── 进程被杀 ✗
   
═══ 进程重启 ═══

Resume：用 run_id 查最后一个 Checkpoint（N-1）
   │
   ▼
反序列化 state ──► 重建 Agent 上下文 ──► 从 Step N 继续执行
```

关键洞察：**Checkpoint 的边界必须选在"一个完整步骤结束"的时刻**。也就是 LLM 响应解析完、工具执行完、结果写入 state 之后。如果在一个步骤的中间打断点，恢复时你会发现 state 处于"半完成"状态——工具调了但结果没拿到，LLM 回复了但没进历史。所以 Checkpoint 隐含了一个契约：每个 step 的执行是原子的，要么全部完成并落盘，要么恢复时当作没发生过。

这又引出副作用问题：如果 Step N 的工具是"发邮件"，执行完、Checkpoint 还没写、进程死了——恢复时会重发一封邮件。解决办法是给工具执行也做幂等设计（如带唯一 ID 的写操作、先落盘再执行副作用）。这是分布式系统的老问题，在 Agent 场景下同样逃不掉。

### 2.2 用 SQLite 保存 Run 状态：Schema 设计

SQLite 是这个练习的最佳选择：零部署、单文件、支持事务、Python 标准库自带。生产中可平替为 PostgreSQL，模型不变。

一张表就够：

```sql
CREATE TABLE IF NOT EXISTS checkpoints (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    run_id      TEXT NOT NULL,
    step        INTEGER NOT NULL,
    state_json  TEXT NOT NULL,        -- 序列化后的完整 State
    status      TEXT NOT NULL,        -- 'running' / 'completed' / 'crashed'
    created_at  REAL NOT NULL         -- Unix timestamp
);

CREATE INDEX IF NOT EXISTS idx_run_latest
    ON checkpoints (run_id, step DESC);
```

字段逐个说清楚为什么存在：

- **`run_id`**：一次任务执行的唯一标识。崩溃恢复的第一步就是拿着它查询。注意区分 `run_id` 和 `session_id`/`thread_id`——前者是一次执行，后者是逻辑会话（可能包含多次 run）。
- **`step`**：步数计数器，两个作用：恢复时定位最新进度；调试时回放执行轨迹。
- **`state_json`**：完整状态的 JSON 快照。注意是**全量快照**而非增量日志——对入门实现来说，全量简单可靠，增量日志（WAL 式）留到优化阶段。
- **`status`**：区分"正在跑"和"已完成/已崩溃"。恢复查询的关键条件之一。
- **`created_at`**：排查问题时至关重要，也支持"回滚到指定步"（time-travel debugging）这类高级玩法。

恢复时的查询就一句：

```sql
SELECT state_json, step FROM checkpoints
WHERE run_id = ? AND status = 'running'
ORDER BY step DESC LIMIT 1;
```

有个工程细节值得注意：**写 Checkpoint 本身也要考虑崩溃**。如果"更新内存 state"和"写数据库"不是原子的，可能出现写了一半的 JSON。SQLite 的 `INSERT` 单语句本身就是事务性的，JSON 又是单个字段，所以这条链路天然安全。如果你未来改成增量日志模式，事务设计就要认真对待了。

### 2.3 执行到第 N 步被杀后的恢复：完整代码

下面是一个最小但完整可运行的实现，核心是 `AgentRunner` 类的 `run` 与 `resume` 两个入口：

```python
import json, sqlite3, time, uuid

class CheckpointStore:
    def __init__(self, db_path="agent.db"):
        self.conn = sqlite3.connect(db_path)
        self.conn.execute("""
            CREATE TABLE IF NOT EXISTS checkpoints (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                run_id TEXT NOT NULL,
                step INTEGER NOT NULL,
                state_json TEXT NOT NULL,
                status TEXT NOT NULL,
                created_at REAL NOT NULL)
        """)
        self.conn.commit()

    def save(self, run_id, step, state, status="running"):
        self.conn.execute(
            "INSERT INTO checkpoints (run_id, step, state_json, status, created_at) VALUES (?,?,?,?,?)",
            (run_id, step, json.dumps(state, ensure_ascii=False),
             status, time.time()))
        self.conn.commit()

    def latest(self, run_id):
        row = self.conn.execute(
            "SELECT step, state_json, status FROM checkpoints "
            "WHERE run_id = ? ORDER BY step DESC LIMIT 1",
            (run_id,)).fetchone()
        if row:
            return row[0], json.loads(row[1]), row[2]
        return -1, None, None


class AgentRunner:
    def __init__(self, store: CheckpointStore):
        self.store = store

    def run(self, task: str, max_steps=10):
        run_id = str(uuid.uuid4())
        state = {"task": task, "messages": [], "results": []}
        self.store.save(run_id, 0, state)   # 初始 checkpoint
        return self._loop(run_id, state, start_step=1)

    def resume(self, run_id: str):
        step, state, status = self.store.latest(run_id)
        if state is None or status == "completed":
            raise ValueError(f"run {run_id} 无法恢复: step={step}, status={status}")
        print(f"[resume] 从 step {step + 1} 恢复")
        return self._loop(run_id, state, start_step=step + 1)

    def _loop(self, run_id, state, start_step):
        for step in range(start_step, start_step + 10):
            state = self._execute_step(state, step)  # LLM/工具调用
            self.store.save(run_id, step, state)     # 步末写 checkpoint
        self.store.save(run_id, state["step"], state, status="completed")
        return state

    def _execute_step(self, state, step):
        # 实际场景：调 LLM、执行工具、更新 messages
        state["results"].append(f"step-{step}-done")
        state["step"] = step
        return state
```

测试崩溃恢复的方法很直接：写一个脚本，跑到第 5 步时用 `os._exit(1)` 模拟进程被杀（硬退出，不给任何清理机会，模拟 SIGKILL）：

```python
import os
runner = AgentRunner(CheckpointStore())
state = runner.run("分析这份财报")

if state["step"] >= 5:
    os._exit(1)  # 模拟进程被杀

# ---- 重新启动进程后 ----
# runner.resume("<上次的 run_id>")
```

重启后调用 `resume(run_id)`，你会看到它从第 6 步继续，第 1–5 步的结果原封不动。更严格的测法：用子进程 + `kill -9` 或在 Docker 里 `docker kill`，确认即使是最粗暴的崩溃也能恢复。

一个常见的坑：**恢复后 LLM 的对话上下文必须完整重建**。如果你的 state 里只存了工具结果而没存消息历史，恢复后的第一次 LLM 调用会"失忆"，输出质量断崖式下跌。原则：**恢复后 Agent 的下一步行为，必须和不崩溃时完全一致**——这叫确定性恢复（Deterministic Resume），是判断你的 Checkpoint 设计是否合格的唯一标准。

### 2.4 Checkpoint 频率与性能的 Trade-off

多久存一次？这是所有持久化执行系统都要回答的问题。先看数据量级：

一个带消息历史的 Agent state，通常在几 KB 到几百 KB 之间。SQLite 单行写入在 SSD 上是毫秒级。所以对于每步耗时数秒的 LLM Agent，**每步存一次的开销通常 <1%**，几乎可以忽略。这就是为什么"每步一存"是默认推荐。

但当情况变化时，权衡就出现了：

| 策略 | 写入频率 | 崩溃损失 | 适用场景 | 风险 |
|---|---|---|---|---|
| 每步一存 | 高 | 最多损失 1 步 | LLM Agent（步长数秒）默认选择 | state 巨大时 IO 放大 |
| 每 N 步一存 | 中 | 最多损失 N 步 | 步骤密集且廉价（纯计算步骤） | 恢复点过旧 |
| 时间窗口（如每 30s） | 中 | 损失 30s 进度 | 步长不均匀的任务 | 语义不精确 |
| 仅在关键节点 | 低 | 视节点而定 | 工具副作用前后、人工审批点 | 中途崩溃全丢 |

三条工程判断：

1. **按"崩溃代价"定频率，而不是按"存储代价"**。如果重跑一步要花 $0.05 的 LLM 费用加 30 秒延迟，那每步一存绝对值得；如果一步只是本地字符串拼接，攒几步再存也没问题。
2. **关键节点必须存**：调用有副作用的工具之前、人工审批挂起之前、长推理之前——这些点的 Checkpoint 价值远高于其他时刻。
3. **State 体积是隐性杀手**。如果消息历史无限增长（比如每步塞进一个 10KB 的工具输出），100 步后单条 checkpoint 记录就是 1MB，每步全量写入的 IO 会滚雪球。应对手段：裁剪历史（保留最近 K 轮 + 摘要）、大对象外置存储（state 里只存引用）。这也是 M1 后面 State 管理主题的伏笔。

### 2.5 State 的序列化与反序列化

Checkpoint 的可靠性上限，取决于 State 能不能被无损地"存进去再取出来"。这就是序列化（Serialization / 通常是 JSON）与反序列化（Deserialization）的问题。

**JSON 是默认选择**，但有四个必须提前想清楚的坑：

**坑一：不可序列化的对象。** Python 里的 `datetime`、`Decimal`、自定义类实例、数据库连接、文件句柄——都不能直接 `json.dumps`。两种应对：写 `default=` 钩子做自定义转换；或者更根本的——**规定 State 里只能放"纯数据"**（str/int/float/list/dict/None）。我强烈推荐后者，这是一条架构纪律：内存对象可以随时重建（比如恢复后重新连接数据库），State 只存重建所需的参数。

**坑二：Schema 演进（版本兼容）。** 你今天存的 state 是 `{"messages": [...]}`，下周你加了 `{"tool_calls": [...]}`。老 checkpoint 在新代码里恢复，KeyError 就来了。解法：state 里加 `version` 字段，恢复时跑迁移函数（migration）：

```python
def migrate(state: dict) -> dict:
    v = state.get("version", 1)
    if v == 1:
        state["tool_calls"] = []
        state["version"] = 2
    return state
```

**坑三：非确定性的内容。** 如果 state 里存了时间戳、随机数、依赖外部世界的值，恢复后的行为可能偏离原轨迹。审计时要能区分"确定字段"和"环境字段"。

**坑四：大 JSON 的解析成本。** 每次 checkpoint 都 `json.dumps` 全量 state，state 很大时 CPU 和 IO 都疼。优化路径：增量序列化 → 二进制格式（MessagePack）→ 结构化存储（每类数据一张表）。但记住：**先用 JSON 把正确性做对，再考虑性能**。

---

## 三、实践练习与思考题

**练习目标**：实现上文代码，验证"第 5 步被杀 → 恢复 → 完成"全链路。

步骤：
1. 实现 `CheckpointStore` + `AgentRunner`（可以直接抄上文，但建议每行都自己敲）；
2. 跑一次完整任务，检查 SQLite 里的记录（`sqlite3 agent.db "SELECT run_id, step, status FROM checkpoints"`）；
3. 加入第 5 步崩溃逻辑，进程退出后重新启动，用 `resume(run_id)` 恢复；
4. **验证确定性**：对比"没崩溃的正常执行"和"崩溃恢复的执行"的最终 state，两者必须完全一致；
5. 把崩溃点改成第 3 步、第 8 步，重复测试。

**思考题**：
1. 如果工具"发邮件"在第 5 步执行成功，但 checkpoint 写入前进程被杀，恢复后会发生什么？如何设计才能避免重复发信？
2. 如果你的 state 里存了一个打开的数据库连接，恢复时会怎样？该怎么改设计？
3. 全量快照在什么规模下会成为瓶颈？你会如何设计增量 checkpoint？
4. 多个 Agent 共享同一个 SQLite 库时，会有什么并发问题？

---

## 四、与 Agent Engineering 的关联

Checkpoint 不是孤立技巧，它是 Agent 生产化的基础设施，直接支撑四个方向：

1. **长任务与可靠性（Reliability）**：SLA 的本质是"失败可控"。有 Checkpoint 的系统，故障恢复时间从"整个任务时长"降为"一步"，这是可观测性和 SRE 实践的前提。
2. **Human-in-the-loop**：人工审批本质上是"暂停 + 持久化 + 等待 + 恢复"。没有 Checkpoint，Agent 无法在等人时安全地挂起几小时甚至几天。LangGraph 的 `interrupt` 机制底层就是 checkpoint。
3. **Time-travel 与调试**：既然每步都有快照，你就可以回滚到任意一步、修改输入、重新分支执行——这是 Agent 调试和评测的利器。
4. **多 Agent 与工作流编排**：后面的多 Agent 系统中，子 Agent 的状态交接、失败重试、任务迁移，全都建立在单 Agent 的可持久化之上。Temporal 这类 Durable Execution 引擎的思想与本章完全同源，学完这里再去看它们会非常轻松。

一句话总结它的位置：**LLM 调用让 Agent 能思考，Checkpoint 让 Agent 能被信任。**

---

## 五、FAQ

**Q1：每步都写 SQLite，会不会太慢？**
对于典型 LLM Agent（步长数秒、state 几十 KB），一次 SQLite 写入约 1–5ms，开销不足 1%，可以忽略。只有 state 达到 MB 级或步骤达到毫秒级频率时才需要优化（裁剪历史、批量写入、增量快照）。

**Q2：Checkpoint 和对话记忆（Memory）是一回事吗？**
不是。Memory 关注"跨会话记住什么"（长期记忆、摘要、用户偏好），语义层概念；Checkpoint 关注"单次执行如何崩溃恢复"，运行时机制。两者都持久化，但目的、粒度、生命周期完全不同。

**Q3：直接把 LLM 的对话历史存下来不就够了吗？为什么还要完整的 state？**
不够。Agent 的 state 不只是消息历史，还包括工具结果缓存、循环计数、中间变量、任务分解进度等。只存对话历史，恢复后 Agent 知道"说过什么"但不知道"做到哪了"，无法确定性恢复。

**Q4：生产环境应该用 SQLite 还是 PostgreSQL / Redis？**
单机、单进程、学习与原型场景，SQLite 完全够用。生产多实例部署时用 PostgreSQL（事务、并发、备份完善）。Redis 适合做"最新状态缓存"但不宜作为唯一 checkpoint 存储（持久化语义较弱）。Schema 设计不变，只换存储层。

**Q5：如果 Checkpoint 写入本身失败怎么办？**
这是"恢复机制自身的可靠性"问题。标准做法：写 checkpoint 失败时立即停止继续执行（fail-fast），宁可让任务失败也不让系统在"没有保护网"的状态下跑下去；配合重试和告警。绝不能"写失败也继续跑"——那等于裸奔。

---

## 六、参考资料

以下为本主题的核心参考方向（按价值排序）：

1. **LangGraph Persistence 官方文档** — `langchain-ai.github.io/langgraph/concepts/persistence/`：工业级 checkpoint 实现的完整设计，含 thread/checkpoint/中断恢复模型，最值得精读。
2. **SQLite 官方文档：Transactions** — `sqlite.org/lang_transaction.html`：理解 checkpoint 写入的原子性保证。
3. **Temporal 文档：Durable Execution 概念** — `docs.temporal.io`：Agent 持久化的思想源头，事件溯源 + 重放模型。
4. **Python `json` 模块文档** — `docs.python.org/3/library/json.html`：`default`/`object_hook` 参数，解决自定义对象序列化。
5. **Microsoft Durable Functions: Checkpointing and Replay** — `learn.microsoft.com/azure/azure-functions/durable-functions-checkpointing`：另一种持久化执行的设计视角。

> 备注：本文的参考资料以官方文档为主，因为 Checkpoint 属于"设计模式"而非"标准 API"，最佳学习材料就是成熟框架的实现文档。建议完成练习后再去读 LangGraph 的源码（`langgraph/checkpoint/`），你会发现它的抽象和本文的 `CheckpointStore` 一一对应。

---

## 📋 本日知识点清单

- [ ] Run → Checkpoint → Process crash → Resume 的能力
- [ ] SQLite 保存 run_id/state/step/timestamp
- [ ] Agent 执行到第 N 步进程被杀后的恢复
- [ ] Checkpoint 的频率与性能 trade-off
- [ ] State 序列化与反序列化

## 📝 实践练习

用 SQLite 实现 Checkpoint，测试 Agent 执行到第 5 步被杀后能否恢复。

---

*本文是「AI Agent 工程师」6 个月学习计划的一部分。学习路线：LLM → Inference → Runtime → Harness → Memory → Environment → Evaluation → Production。目标：Agent / AI Systems Engineer。*
