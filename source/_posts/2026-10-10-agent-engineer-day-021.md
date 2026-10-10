---
title: AI Agent 工程师 Day 21：Stateful Agent V1：State + Checkpoint + Streaming 整合
tags:
  - AI Agent 工程师
  - Stateful Agent
  - Checkpoint
  - Streaming
  - Runtime
categories:
  - AI Agent 工程师学习计划
  - M1 LLM + Agent Runtime
description: >-
  Day 21/168 | M1 有状态 Agent 整合 | Stateful Agent V1：State + Checkpoint +
  Streaming 整合。6 个月从 LLM 到生产级 Agent 系统的完整学习路线。
keywords: 'AI Agent, 工程师, 有状态 Agent 整合, Stateful Agent, Checkpoint, Streaming, Runtime'
author: OpenClaw Agent Learning
abbrlink: 51598
date: 2026-10-10 10:30:00
---

# AI Agent 工程师 Day 21：Stateful Agent V1：State + Checkpoint + Streaming 整合

> **6 个月学习计划** | M1 - LLM + Agent Runtime | Day 21/168
> 
> **今日主题**: 有状态 Agent 整合

---

# Stateful Agent V1：State + Checkpoint + Streaming 整合

**核心结论**：有状态 Agent（Stateful Agent）的本质，是把一个 `while` 循环重构为可暂停、可恢复、可流式输出的 **Runtime**。State 定义 Agent 在某一时刻的完整快照，Checkpoint 把这个快照持久化到磁盘，Streaming 让外部世界实时观察 Agent 的思考过程，三者通过统一的事件日志（Event Log）串起来——每一步推理产生事件、事件修改 State、State 定期落盘为 Checkpoint。掌握 `runtime.run() / resume() / stream()` 三个接口，你就掌握了支撑 Agent 长时间运行的全部核心能力。这是从“玩具 Agent”到“生产级 Agent”的分水岭。

---

## 一、背景与动机

### 1.1 你现在的位置

在 6 个月 AI Agent 工程师路线中，前三周你已经分别实现了：

- **State 管理**：Agent 的记忆结构（对话历史、任务状态、中间结果）
- **Checkpoint**：状态持久化与恢复
- **Streaming**：Token 级流式输出与事件推送
- **Human Approval**：人工审批中断
- **Error Recovery**：失败重试与降级

这五块能力今天要**合体**。这就像你分别学会了发动机、变速箱、底盘和电控系统，今天是总装下线的日子。

### 1.2 为什么必须整合？

分散掌握这些技术，和整合成一个 Runtime，是两种完全不同的能力层次。原因在于：**这些机制会互相打架**。

- Streaming 输出到一半，Checkpoint 该在哪里截断？
- Human Approval 暂停时，State 处于什么状态？恢复时从哪一步继续？
- Error Recovery 重试时，要回滚到上一个 Checkpoint，但已经流出去的输出怎么办？

这些问题没有统一的 Runtime 架构，就只能靠 `if-else` 糊补。今天的目标就是给出统一答案。

### 1.3 从 `while` 循环说起

你最初的 Agent 大概长这样：

```python
while not task_done:
    thought = llm.generate(state)
    action = parse(thought)
    result = execute(action)
    state.update(result)
```

这个循环有三个致命缺陷：

1. **不可暂停**：进程一死，一切归零
2. **不可观察**：跑 10 分钟，外面一片漆黑
3. **不可干预**：想在中途审批？没门

生产环境的 Agent 任务动辄跑几小时（深度研究、代码重构、数据分析），三个缺陷个个致命。**可恢复 Runtime（Resumable Runtime）** 就是解药。

---

## 二、核心内容

### 2.1 知识点一：五组件的完整整合——事件溯源式架构

**State（状态）**、**Checkpoint（检查点）**、**Streaming（流式输出）**、**Human Approval（人工审批）**、**Error Recovery（错误恢复）**，整合的关键是引入一个统一抽象：**Event Log（事件日志）**。

核心思想借鉴自 Event Sourcing（事件溯源）：Agent 的执行过程不是直接改状态，而是**不断追加事件**，State 是事件的折叠结果。

```
Event Types:
├── ThoughtEvent        # LLM 思考过程（流式 token）
├── ActionEvent         # 工具调用
├── ObservationEvent    # 工具结果
├── ApprovalRequestEvent # 审批请求（暂停点）
├── ApprovalResultEvent  # 审批结果
└── ErrorEvent           # 错误（触发恢复）
```

整合后的数据流：

```
┌─────────────────────────────────────────────────┐
│                  Agent Runtime                   │
│                                                  │
│  run() ──► Step Loop ──► Events ──► Event Log    │
│               │                        │         │
│               ▼                        ▼         │
│         fold(events)          persist/checkpoint │
│               │                        │         │
│               ▼                        ▼         │
│            State ◄─────── load(ckpt) on resume   │
│                                                  │
│  stream() ──► 订阅 Events ──► SSE/WebSocket 推送 │
└─────────────────────────────────────────────────┘
```

这个设计的因果链是：

1. 一切行为先产生**事件**（单一事实来源，Single Source of Truth）
2. Streaming 只是**订阅事件流**，与主逻辑解耦——Agent 崩了不影响已发出的事件
3. Checkpoint 是**事件日志的快照 + 游标位置**——恢复时从游标重放
4. Human Approval 是一种**特殊的阻塞事件**——Runtime 停在等待状态
5. Error Recovery 是**回滚游标 + 重放**——从上一个 Checkpoint 位置重新执行

一套抽象，五个问题全部收敛。

### 2.2 知识点二：三大核心接口——run / resume / stream

**run()**：从零启动一次完整执行。同步阻塞或后台异步均可，核心职责是驱动 Step Loop 并持续追加事件。

**resume()**：从指定 Checkpoint 恢复执行。它不是 run 的复制品，而是 run 的“续集”——加载状态、校验一致性、跳过已完成步骤、继续循环。

**stream()**：事件流的订阅接口。注意一个常见的架构错误：把 stream 当成另一种执行模式（“流式运行 vs 非流式运行”）。正确的设计是：**stream 不执行，只订阅**。run/resume 内部照常执行，stream 只是观察者。这样执行逻辑只有一份，不会有流式和非流式两套代码路径的 bug。

三接口对比：

| 接口 | 触发条件 | 输入 | 输出 | 典型场景 |
|------|---------|------|------|---------|
| `run()` | 任务首次启动 | task + config | 最终结果 / handle | 正常执行 |
| `resume()` | 存在 Checkpoint | checkpoint_id | 最终结果 / handle | 崩溃恢复、审批通过后 |
| `stream()` | 随时订阅 | task/handle | 事件迭代器 | 前端实时展示、日志采集 |

一个容易被忽略的细节：**run 和 resume 应返回同一个 handle（任务句柄）**。因为对调用方来说，“新任务”和“恢复的任务”都只是一个可订阅、可取消、可查询的执行实例。统一句柄让上层 API（如 REST 的 `POST /tasks` 和 `POST /tasks/{id}/resume`）共享同一套语义。

### 2.3 知识点三：长时间运行的支撑能力

一个能跑几小时的 Agent，需要的不仅是“不死”，而是四层保障：

**① 状态可持久化（Durability）**
进程重启、机器迁移、部署更新，任务必须能接续。Checkpoint 策略上建议：每个 Step 完成后落盘一次（Step 粒度），而不是 token 粒度——后者开销太大且恢复意义有限。

**② 执行可暂停（Suspensibility）**
两类暂停：
- **主动暂停**：Human Approval、等待外部资源，此时任务进入 `waiting` 状态，资源可释放
- **被动暂停**：进程崩溃，此时 Checkpoint 是唯一救命稻草

**③ 进度可观察（Observability）**
长时间任务如果黑盒运行，用户会在第 3 分钟就失去耐心。Streaming 不只是 UX 特性，更是**信任机制**——用户看到 Agent 在有条不紊地工作，才愿意等。

**④ 失败可恢复（Fault Tolerance）**
LLM 调用失败、工具超时、幻觉导致的非法输出——每个失败点都要有明确定义的重试策略，且重试必须基于 Checkpoint 回滚，否则 State 可能处于半更新状态（比如工具执行成功但结果没写入）。

四层能力的对应关系：

| 能力 | 依赖机制 | 失败后果（若无） |
|------|---------|----------------|
| Durability | Checkpoint 落盘 | 任务从头再来 |
| Suspensibility | 状态机 + 等待事件 | 只能杀进程 |
| Observability | Event Streaming | 用户流失、无法调试 |
| Fault Tolerance | Checkpoint + 重试策略 | State 污染、死循环 |

### 2.4 知识点四：从 while 循环到可恢复 Runtime 的跃迁

这是今天最本质的思维转变。对比一下两种范式：

| 维度 | while 循环范式 | Runtime 范式 |
|------|--------------|-------------|
| 生命周期 | 进程级 | 任务级（与进程解耦） |
| 状态位置 | 内存变量 | Event Log + Checkpoint |
| 暂停恢复 | 不可能 | Checkpoint + resume() |
| 观察方式 | print 调试 | stream() 事件订阅 |
| 失败处理 | try/except 后放弃 | 回滚重放 |
| 部署耦合 | 任务必须和进程同生共死 | 任务可迁移到任意 worker |

关键直觉：**while 循环把“控制流”和“执行载体”绑死了**。循环在内存里跑，进程死循环就死。Runtime 范式的做法是把控制流**外化**——状态机由 Event Log 驱动，循环的“下一轮”由“加载最新状态”决定。进程只是控制流的临时宿主，随时可换。

类比：while 循环是“骑着马赶路”，Runtime 是“沿着驿站的地图赶路”——马可以换，地图和进度永远在驿站（Checkpoint Store）里。

---

## 三、代码实现

完整的 V1 Runtime 骨架（约 120 行，可直接作为练习起点）：

```python
import json, time, uuid
from enum import Enum
from dataclasses import dataclass, field, asdict

class TaskStatus(Enum):
    RUNNING = "running"
    WAITING_APPROVAL = "waiting_approval"
    FAILED = "failed"
    DONE = "done"

@dataclass
class Checkpoint:
    task_id: str
    step: int
    status: str
    state: dict          # 折叠后的 Agent State
    event_log: list      # 完整事件日志
    pending_approval: dict | None = None

class AgentRuntime:
    def __init__(self, agent, store):
        self.agent = agent   # 你的 step 逻辑
        self.store = store   # Checkpoint 存储后端

    # ── 核心接口 1：启动 ──
    def run(self, task: str) -> str:
        task_id = str(uuid.uuid4())
        state = {"task": task, "history": [], "results": []}
        ckpt = Checkpoint(task_id, 0, TaskStatus.RUNNING.value, state, [])
        self.store.save(ckpt)
        return self._drive(ckpt)

    # ── 核心接口 2：恢复 ──
    def resume(self, task_id: str, approval: dict | None = None) -> str:
        ckpt = self.store.load(task_id)
        if approval is not None:
            ckpt.event_log.append({"type": "approval_result", **approval})
            ckpt.status = TaskStatus.RUNNING.value
            ckpt.pending_approval = None
        return self._drive(ckpt)

    # ── 主循环：事件驱动，每步落盘 ──
    def _drive(self, ckpt: Checkpoint) -> str:
        while ckpt.status == TaskStatus.RUNNING.value:
            try:
                events = self.agent.step(ckpt.state)   # 一步执行
            except Exception as e:
                ckpt.status = TaskStatus.FAILED.value
                ckpt.event_log.append({"type": "error", "msg": str(e)})
                self.store.save(ckpt)
                break

            for ev in events:
                ckpt.event_log.append(ev)
                self._notify_subscribers(ckpt.task_id, ev)  # → stream()
                if ev["type"] == "approval_request":
                    ckpt.status = TaskStatus.WAITING_APPROVAL.value
                    ckpt.pending_approval = ev
                elif ev["type"] == "done":
                    ckpt.status = TaskStatus.DONE.value

            ckpt.step += 1
            self.store.save(ckpt)          # 每步 Checkpoint
        return ckpt.task_id

    # ── 核心接口 3：订阅（不执行，只观察）──
    def stream(self, task_id: str, since: int = 0):
        """返回事件迭代器；since 支持断线重连回放"""
        for ev in self.store.events_since(task_id, since):
            yield ev

    def _notify_subscribers(self, task_id, event):
        ...  # 推送到内存 channel / Redis pubsub
```

恢复的正确性验证——一个简单的混沌测试：

```python
import random

class FlakyAgent:
    """30% 概率在 step 中崩溃，用于测试 resume"""
    def step(self, state):
        if random.random() < 0.3:
            raise RuntimeError("LLM timeout")
        return [{"type": "done", "result": f"ok after {len(state['history'])+1} steps"}]

# 即使 agent 频繁崩溃，外层循环 resume 直到成功，
# 最终 state 和一次性跑通的结果完全一致 —— 这就是可恢复性的含义
```

---

## 四、实践练习与思考题

**练习 1（基础）**：在上述骨架上实现 `store` 的内存版和 SQLite 版，跑通 run → crash → resume 全流程。

**练习 2（进阶）**：为 `stream()` 实现断线重连——客户端携带 `since=<event_index>`，服务端从该位置回放。这要求 Event Log 有单调递增索引。

**练习 3（挑战）**：把 Human Approval 做成 HTTP API：`POST /tasks/{id}/approve`。思考幂等性问题——同一个 approve 调用两次，不能执行两次。

**思考题**：

1. Checkpoint 保存的是“State 快照”还是“Event Log 全量”？两者各自的恢复成本和存储成本是什么 trade-off？（提示：可以快照 + 增量事件混合）
2. 一个工具调用“已发出请求但未收到响应”时崩溃了，恢复后应该重试还是跳过？如何设计工具的幂等性？
3. Streaming 中途崩溃，已经发给用户的 token 和 Checkpoint 记录的进度不一致，前端该如何处理？

---

## 五、与 Agent Engineering 的关联

这套 Runtime 架构不是学术练习，而是当前所有生产级 Agent 框架的地基：

- **LangGraph** 的核心卖点就是 `graph.checkpointer` + `interrupt()`（Human Approval）+ `astream_events()`——正是本文的三接口模型
- **OpenAI Assistants API / Agents SDK** 的 Run 对象天然有 `queued / in_progress / requires_action / completed` 状态机，`requires_action` 就是 Waiting Approval
- **Temporal / Restate** 这类 Durable Execution 引擎，用“代码重放 + 事件日志”实现任意语言的 Agent 可恢复执行，思路与本文完全一致

在企业落地中，长时任务（深度研究、代码迁移、批量审批）没有这套 Runtime 就是空中楼阁。面试中“你的 Agent 崩了怎么办”这个问题，答案就是今天的内容。

---

## 六、FAQ

**Q1：Checkpoint 应该多久保存一次？**
按 Step 粒度保存，而不是 token 粒度。Token 级状态可以通过重放 LLM 流式输出恢复，保存成本高且收益低。步与步之间是天然的一致性边界。

**Q2：run/resume/stream 是三种执行模式吗？**
不是。run 和 resume 是执行入口（区别只在起点），stream 是纯订阅接口，不参与执行。把 stream 做成独立执行模式会导致两套代码路径，是常见架构错误。

**Q3：State 和 Event Log 都存，会不会冗余？**
会冗余，但值得。Event Log 保证可审计可回放，State 快照保证恢复快（不用重放全部事件）。生产系统常用“定期快照 + 增量事件”混合方案。

**Q4：Human Approval 期间任务会占用计算资源吗？**
不应该。WAITING_APPROVAL 状态下任务只占一份 Checkpoint 存储，不占进程/连接。审批通过后由 resume() 重新调度到可用 worker——这也是 Runtime 范式相对于 while 循环的核心优势。

**Q5：这套东西和 LangGraph 自带的有什么区别？自己造轮子有必要吗？**
自己实现一次，你才能理解 LangGraph 的 checkpointer 为什么要求 State 可序列化、interrupt 为什么返回 resume 值。生产中建议用成熟框架，但理解必须来自亲手实现——这正是本次练习的目的。

---

## 参考资料

- LangGraph Persistence 文档：https://langchain-ai.github.io/langgraph/concepts/persistence/
- LangGraph Human-in-the-loop：https://langchain-ai.github.io/langgraph/concepts/human_in_the_loop/
- LangGraph Streaming：https://langchain-ai.github.io/langgraph/concepts/streaming/
- Temporal Durable Execution 概念：https://docs.temporal.io/develop/python/core-application
- Microsoft AutoGen Runtime 架构：https://microsoft.github.io/autogen/stable/user-guide/core-user-guide/framework/agent-and-multi-agent-application.html
- Anthropic《Building effective agents》：https://www.anthropic.com/research/building-effective-agents

---

## 📋 本日知识点清单

- [ ] State + Checkpoint + Streaming + Human Approval + Error Recovery 的完整整合
- [ ] runtime.run() / runtime.resume() / runtime.stream() 三个核心接口
- [ ] Agent 长时间运行的支撑能力
- [ ] 从 while 循环到可恢复 Runtime 的跃迁

## 📝 实践练习

整合所有组件，实现 runtime.run() / resume() / stream()。

---

*本文是「AI Agent 工程师」6 个月学习计划的一部分。学习路线：LLM → Inference → Runtime → Harness → Memory → Environment → Evaluation → Production。目标：Agent / AI Systems Engineer。*
