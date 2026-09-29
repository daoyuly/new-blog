---
title: "AI Agent 工程师 Day 10：Tool Executor：执行与结果归一化"
date: 2026-09-29 10:30:00
tags:
  - Tool Executor
  - ToolResult
  - Runtime
  - Agent
categories:
  - AI Agent 工程师学习计划
  - M1 LLM + Agent Runtime
description: "Day 10/168 | M1 Tool Executor 设计 | Tool Executor：执行与结果归一化。6 个月从 LLM 到生产级 Agent 系统的完整学习路线。"
keywords: "AI Agent, 工程师, Tool Executor 设计, Tool Executor, ToolResult, Runtime, Agent"
author: OpenClaw Agent Learning
---

# AI Agent 工程师 Day 10：Tool Executor：执行与结果归一化

> **6 个月学习计划** | M1 - LLM + Agent Runtime | Day 10/168
> 
> **今日主题**: Tool Executor 设计

---

# Tool Executor：执行与结果归一化

**核心结论**：Tool Executor 是 Agent 系统中第一个真正的运行时抽象——它把“工具能做什么”（Registry 的声明职责）与“工具怎么被安全地执行”（Execution 的运行时职责）彻底分离。一个合格的 Executor 必须实现一条固定流水线：**Validate → Permission → Execute（带 Timeout）→ Result Normalize → Trace**，并把所有工具的异构输出收敛到统一的 `ToolResult(success, output, error, latency_ms)` 结构。这个设计的本质是：让 LLM 和上层编排逻辑面对一个**确定性的执行契约**，而不是几十种各不相同的工具返回格式。理解了 Executor，你就理解了 Agent Runtime 的雏形。

---

## 一、背景与动机：为什么第 10 天要学这个

在 6 个月 AI Agent 工程师路线中，你此前已经完成了：

- **M1 第 1 周**：Agent 基本循环、消息结构、LLM 调用封装
- **Tool Registry**：工具的注册、Schema 声明、按名查找

你现在已经能回答“Agent 有哪些工具、每个工具长什么样”，但还没回答一个更关键的问题：**当 LLM 决定调用某个工具时，谁来执行它？执行失败怎么办？执行超时怎么办？执行结果怎么喂回给模型？**

这就是 Tool Executor（工具执行器）要解决的问题。它的位置非常关键：

```
LLM 决策层（"我要调用 search(query=...)"）
        │
        ▼
Tool Registry（声明层：有哪些工具、参数 Schema）
        │
        ▼
Tool Executor（执行层：★ 你在这里 ★）
        │
        ▼
真实世界（HTTP API / 本地代码 / 数据库 / Shell）
```

Executor 之上是“认知”，之下是“行动”。它是 Agent 从一个“会聊天的模型”变成“能干事的系统”的分界线。后面几周你会学到的 Sandbox 执行、多步编排、可观测性，全部建立在今天这个抽象之上——如果这里的设计是脏的，后面的每一层都会被污染。

一个直观的因果链：**LLM 不可靠 → 调用参数可能非法 → 工具可能挂起 → 返回格式千奇百怪 → 如果没有统一执行层，这些不确定性会直接爆炸到编排代码里**。Executor 的全部意��，就是把这四种不确定性封死在一个模块内。

---

## 二、核心内容

### 2.1 Registry 与 Execution 的分离

**核心概念**：Registry-Execution Separation（注册与执行分离）

先建立一个工程直觉：**声明“能做什么”和执行“怎么做”是两个变化方向完全不同的关注点**。

- Registry 变化的原因：新增工具、修改参数 Schema、调整工具描述（这些是**静态的、编译期的事**）
- Executor 变化的原因：调整超时策略、加权限检查、改日志格式、换执行沙箱（这些是**动态的、运行期的事**）

如果两者耦合在一个类里，你会遇到典型的“改一个理由要动另一份代码”的坏味道。比如你想给所有工具统一加一层权限校验——如果执行逻辑散落在每个工具类内部，你就得改 N 个地方。

分离后的职责边界如下表：

| 维度 | Tool Registry | Tool Executor |
|---|---|---|
| 职责 | 声明工具、Schema 校验依据、按名查找 | 校验、鉴权、执行、超时、归一化、追踪 |
| 变化频率 | 低（随工具集变化） | 高（随策略变化） |
| 是否知道具体工具逻辑 | 是（持有引用） | 否（只依赖统一接口） |
| 类比 | REST API 的路由表 | Web 框架的中间件 + 请求处理器 |
| 测试方式 | 单测 Schema 正确性 | 用 Mock Tool 测流水线行为 |

注意最后一行：**分离之后，Executor 可以用一个假的工具来完整测试执行流水线**（超时、报错、返回异常格式），不需要真的调外部 API。这是抽象带来的可测试性红利，也是判断你的抽象是否合格的标准之一。

工程上的接口设计也很简单——Executor 不 import 任何具体工具，只依赖一个协议：

```python
class Executor:
    def execute(self, tool_call: ToolCall, context: Context) -> ToolResult:
        tool = self.registry.get(tool_call.name)  # 依赖 Registry，但不依赖具体工具
        ...
```

### 2.2 统一的 ToolResult

**核心概念**：Tool Result Normalization（工具结果归一化）

设想没有统一结果结构的世界：`search` 返回 JSON 字符串，`run_code` 返回 stdout，`db_query` 返回一个对象列表，`send_email` 返回 `None` 表示成功。上层编排代码要写一堆 `isinstance` 和 try/except 来应付，每加一个工具就要改一次适配逻辑。

解法是把“成功/失败、产出内容、错误信息、耗时”这四个所有工具共有的正交维度，抽成一个数据类：

```python
from dataclasses import dataclass, field
from typing import Any, Optional

@dataclass
class ToolResult:
    success: bool                          # 执行是否成功（布尔，不含糊）
    output: Optional[str] = None           # 归一化后的主输出（喂给 LLM 的内容）
    error: Optional[str] = None            # 失败时的错误描述（也喂给 LLM）
    latency_ms: int = 0                    # 执行耗时（观测与限流依据）
    metadata: dict = field(default_factory=dict)  # 结构化附加信息（不直接给 LLM）

    def for_llm(self) -> str:
        """归一化为喂回模型的文本"""
        if self.success:
            return self.output or "(empty output)"
        return f"ERROR: {self.error}"
```

几个容易踩坑的设计决策：

1. **`success` 必须是显式布尔**，不要用“error 是否为空”来推断。工具可能部分成功（下载了 8/10 个文件），语义必须由执行器明确裁定。
2. **`error` 不是异常，是信息**。工具失败对 Agent 来说是正常输入——LLM 需要读到错误信息才能自我修正（比如参数格式错了就重试）。把异常吞掉只返回 `"failed"` 是最常见的反模式。
3. **`latency_ms` 从第一天就要记**。它是后续做超时调优、慢工具识别、成本统计的基础数据，事后补记几乎不可能。
4. **`output` 要预归一化为字符串**。LLM 的上下文是文本，无论工具返回 JSON、对象还是二进制摘要，Executor 负责转成模型可读的形式，而不是把这个责任推给编排层。

一个心智模型：**ToolResult 是 Executor 与世界签订的合同**。合同之下，工具千奇百怪；合同之上，世界整齐划一。

### 2.3 执行流水线：Validate → Permission → Execute → Timeout → Normalize → Trace

**核心概念**：Execution Pipeline（执行流水线）

这是本文的核心。一次工具调用不是“直接执行”一个动作，而是穿过六个阶段的流水线。每个阶段失败都会**短路**并直接产出归一化的失败结果：

```
ToolCall
   │
   ▼
┌─────────────┐  工具不存在 / 参数不符合 Schema
│ 1. Validate │──────────────────────────┐
└─────────────┘                          │
   ▼                                     │
┌─────────────┐  权限不足 / 触发策略禁止  │
│ 2. Permission│─────────────────────────┤
└─────────────┘                          │
   ▼                                     ▼
┌─────────────┐  工具抛异常          ┌──────────────┐
│ 3. Execute  │─────────────────────►│ 6. Normalize │
│  + Timeout  │  超时 kill           │  + Trace     │
└─────────────┘                      └──────────────┘
                                            │
                                            ▼
                                       ToolResult
                                       (喂回 LLM / 上层)
```

逐阶段拆解因果：

- **Validate（校验）**：LLM 生成的参数本质是概率采样，可能缺字段、类型错误、编造枚举值。在执行前用 JSON Schema 校验，可以用**一次廉价的字符串比对**避免一次昂贵且可能有副作用的真实调用。校验失败要生成描述性错误（“缺少必填参数：query”），这样 LLM 下一轮能自己修。
- **Permission（权限）**：执行前最后一道闸门。哪些工具允许在当前 context 下调用？删除类操作是否需要人工确认？这个阶段与 Validate 分开，是因为“参数对不对”和“允不允许做”是两个独立的判断维度——参数完美但被禁止的调用必须走这条路，且错误信息要明确指向权限而非格式。
- **Execute（执行）**：真正调用工具。这一步必须是流水线中**唯一**接触真实世界的阶段。
- **Timeout（超时）**：不是独立阶段，而是 Execute 的强制约束。任何工具调用都必须有 deadline，否则一个挂死的 HTTP 请求就能卡住整个 Agent 循环。工程上用 `concurrent.futures` 的 `future.result(timeout=...)` 或 `asyncio.wait_for`，超时后**必须真正取消底层任务**（线程池做不到强杀，这是线程方案比不上子进程/asyncio 方案的点，后续 Sandbox 章节会展开）。
- **Result Normalize（结果归一化）**：把工具的原始产出（stdout、stderr、JSON、异常）折叠进统一的 `ToolResult`。关键规则见下一节。
- **Trace（追踪）**：记录 tool name、入参、结果摘要、耗时、各阶段命中情况。没有 Trace 的 Executor 在生产环境等于盲飞——你无法回答“为什么这个 Agent 决策这么差”，因为看不到它看到的工具返回。

**设计原则**：任何阶段失败都不抛异常穿透到编排层，而是全部折进 `ToolResult(success=False, error=...)`。这一条是流水线可用性的关键——上层循环逻辑因此只需要处理一种返回类型。

### 2.4 stdout / stderr / structured result / error / metadata 的统一处理

**核心概念**：Multi-Channel Output Unification（多通道输出统一）

真实工具的“输出”其实有五个通道，语义完全不同：

| 通道 | 语义 | 归一化去向 | 是否给 LLM |
|---|---|---|---|
| stdout / return value | 主产出 | `output` | ✅ 是 |
| stderr / warning | 警告与诊断 | `metadata["stderr"]`，摘要并入 `output` | ⚠️ 摘要 |
| structured result | 结构化数据 | `metadata`（保结构）+ `output`（文本化） | ✅ 文本版 |
| error / exception | 失败原因 | `error` + `success=False` | ✅ 是 |
| runtime info（耗时、重试次数） | 观测��据 | `metadata` + `latency_ms` | ❌ 否 |

处理原则只有三条：

1. **区分“给模型看的”和“给系统看的”**。LLM 的上下文窗口又贵又有限，完整 stderr 和运行时指标不应该灌进去，但要保留在 metadata 里供调试和后续分析。
2. **结构化数据要“双写”**：原始结构进 `metadata`（供程序用），文本化摘要进 `output`（供模型用）。例如数据库查询返回 100 行，`output` 可以是前 10 行的表格 + “共 100 行”的提示，完整结果存 metadata 供代码后续读取。
3. **stderr 默认不失败**。工具往 stderr 写了东西不代表失败（很多库把进度写 stderr），只有返回码/异常才决定 `success`。但 stderr 内容要捕获，因为它常常是排查问题的唯一线索。

### 2.5 Executor 作为第一个真正的 Runtime 抽象

**核心概念**：Runtime Abstraction（运行时抽象）

在这一天之前，你写的都是“库”——被动调用的函数集合。Executor 是你写的第一个“运行时”——一个**主动管理生命周期、资源和故障**的常驻组件。这个转变的标志性特征有三个：

1. **它管理资源**：线程池/事件循环、超时预算、并发上限都在它手里。
2. **它定义故障语义**：什么算失败、失败怎么表达、超时怎么处理，全由它统一裁定，工具作者无权决定。
3. **它是策略注入点**：权限、限流、重试、审计日志，都可以作为横切策略挂在流水线上，而不用改任何工具代码。

一个印证其重要性的观察：OpenAI 的 function calling、LangChain 的 Tool 抽象、Anthropic 的 tool use，最终都收敛到了和 `ToolResult` 高度同构的结构上——**因为这个问题域的约束（不可靠的调用方 + 异构的执行方 + 文本化的通信媒介）决定了最优解的形状**。你不是在学某家的 API，而是在学这个问题本身。

往后看，Executor 是你 Agent Runtime 蓝图的第一个模块。后续的 Sandbox Execution（把 Execute 阶段换成沙箱进程）、Human-in-the-loop（把 Permission 阶段升级为审批流）、Observability（把 Trace 阶段接入 OTel），全是在这条流水线的固定位置替换或增强某个阶段。**流水线结构不变，阶段实现演进**——这就是好的运行时抽象的样子。

---

## 三、代码实现

完整实现 `executor.execute(tool_call, context)`，覆盖全部六个阶段：

```python
import time
import json
import logging
from concurrent.futures import ThreadPoolExecutor, TimeoutError as FuturesTimeout
from dataclasses import dataclass, field
from typing import Any, Callable, Optional

logger = logging.getLogger("tool_executor")

# ---------- 数据结构 ----------

@dataclass
class ToolCall:
    name: str
    arguments: dict = field(default_factory=dict)
    call_id: str = ""

@dataclass
class ToolResult:
    success: bool
    output: Optional[str] = None
    error: Optional[str] = None
    latency_ms: int = 0
    metadata: dict = field(default_factory=dict)

    def for_llm(self) -> str:
        return self.output if self.success else f"ERROR: {self.error}"

@dataclass
class Tool:
    name: str
    description: str
    parameters: dict                      # JSON Schema
    fn: Callable[..., Any]                # 同步执行函数
    timeout_s: float = 30.0
    requires_permission: bool = False

@dataclass
class Context:
    user_id: str = "default"
    allowed_tools: Optional[set] = None   # None = 全部允许
    approved: bool = False                # 敏感操作是否已获批

# ---------- Executor ----------

class ToolExecutor:
    def __init__(self, registry: dict[str, Tool], pool: ThreadPoolExecutor):
        self.registry = registry
        self.pool = pool

    def execute(self, call: ToolCall, ctx: Context) -> ToolResult:
        start = time.monotonic()
        stages = []

        def _fail(error: str, md: dict = None) -> ToolResult:
            latency = int((time.monotonic() - start) * 1000)
            result = ToolResult(success=False, error=error,
                                latency_ms=latency, metadata=md or {})
            self._trace(call, stages, result)
            return result

        # 1. Validate：存在性 + 参数 Schema
        stages.append("validate")
        tool = self.registry.get(call.name)
        if tool is None:
            return _fail(f"Unknown tool: {call.name}. Available: {sorted(self.registry)}")
        err = self._validate_args(tool, call.arguments)
        if err:
            return _fail(f"Invalid arguments: {err}")

        # 2. Permission
        stages.append("permission")
        if ctx.allowed_tools is not None and call.name not in ctx.allowed_tools:
            return _fail(f"Permission denied: tool '{call.name}' not allowed for this context")
        if tool.requires_permission and not ctx.approved:
            return _fail(f"Tool '{call.name}' requires human approval before execution")

        # 3+4. Execute with Timeout（流水线中唯一接触真实世界的位置）
        stages.append("execute")
        future = self.pool.submit(tool.fn, **call.arguments)
        try:
            raw = future.result(timeout=tool.timeout_s)
            success, error = True, None
        except FuturesTimeout:
            future.cancel()
            return _fail(f"Execution timed out after {tool.timeout_s}s")
        except Exception as e:
            success, error, raw = False, f"{type(e).__name__}: {e}", None

        # 5. Normalize：多通道折叠
        stages.append("normalize")
        result = self._normalize(call, tool, raw, success, error,
                                 int((time.monotonic() - start) * 1000))

        # 6. Trace
        stages.append("trace")
        self._trace(call, stages, result)
        return result

    # ---- 辅助方法 ----

    def _validate_args(self, tool: Tool, args: dict) -> Optional[str]:
        required = tool.parameters.get("required", [])
        missing = [k for k in required if k not in args]
        if missing:
            return f"missing required fields: {missing}"
        props = tool.parameters.get("properties", {})
        for k, v in args.items():
            if k not in props:
                return f"unknown field '{k}'"
            expected = props[k].get("type")
            type_map = {"string": str, "number": (int, float),
                        "integer": int, "boolean": bool, "array": list, "object": dict}
            if expected and not isinstance(v, type_map.get(expected, object)):
                return f"field '{k}' expected {expected}, got {type(v).__name__}"
        return None

    def _normalize(self, call, tool, raw, success, error, latency) -> ToolResult:
        md = {"tool": tool.name}
        output = None
        if success:
            if isinstance(raw, tuple) and len(raw) == 2:      # 约定: (stdout, stderr)
                stdout, stderr = raw
                md["stderr"] = stderr
                output = stdout
                if stderr:                                     # stderr 作为警告摘要附加
                    output += f"\n[stderr] {stderr[:500]}"
            elif isinstance(raw, (dict, list)):                # 结构化结果双写
                md["structured"] = raw
                output = json.dumps(raw, ensure_ascii=False, default=str)[:4000]
            else:
                output = str(raw) if raw is not None else "(empty output)"
        return ToolResult(success=success, output=output, error=error,
                          latency_ms=latency, metadata=md)

    def _trace(self, call, stages, result: ToolResult):
        logger.info("tool=%s call_id=%s stages=%s success=%s latency=%dms err=%s",
                    call.name, call.call_id, "+".join(stages),
                    result.success, result.latency_ms, result.error)


# ---------- 使用示例 ----------

if __name__ == "__main__":
    import math

    def divide(a: float, b: float) -> tuple:
        time.sleep(0.1)  # 模拟耗时
        return (f"result = {a / b}", "")          # (stdout, stderr)

    registry = {
        "divide": Tool(name="divide", description="a / b",
                       parameters={"type": "object",
                                   "properties": {"a": {"type": "number"},
                                                  "b": {"type": "number"}},
                                   "required": ["a", "b"]},
                       fn=divide, timeout_s=5),
        "dangerous_wipe": Tool(name="dangerous_wipe", description="wipe data",
                               parameters={"type": "object", "properties": {}},
                               fn=lambda: "wiped", requires_permission=True),
    }

    ex = ToolExecutor(registry, pool=ThreadPoolExecutor(max_workers=4))
    ctx = Context()

    print(ex.execute(ToolCall(name="divide", arguments={"a": 10, "b": 3}, call_id="c1"), ctx))
    # ToolResult(success=True, output='result = 3.3333...', latency_ms=100, ...)

    print(ex.execute(ToolCall(name="divide", arguments={"a": 1}, call_id="c2"), ctx))
    # success=False, error="Invalid arguments: missing required fields: ['b']"

    print(ex.execute(ToolCall(name="dangerous_wipe", arguments={}, call_id="c3"), ctx))
    # success=False, error="...requires human approval..."

    print(ex.execute(ToolCall(name="nope", arguments={}, call_id="c4"), ctx))
    # success=False, error="Unknown tool: nope. Available: ['dangerous_wipe', 'divide']"
```

代码里值得注意的三个点：(1) 所有失败路径都经过 `_fail` 统一收敛，异常不会穿透；(2) 超时走的是独立的返回分支，与异常区分开（错误信息不同，LLM 的应对策略也应不同）；(3) `for_llm()` 把归一化后的内容直接喂回对话循环，编排代码只需一行。

---

## 四、实践练习与思考题

**练习（必做）**：

1. 跑通上面的实现，然后新增一个工具 `slow_api`（内部 `time.sleep(10)`，timeout 设为 1s），验证超时路径的行为，观察错误信息与校验失败的区别。
2. 给 `ToolExecutor` 增加重试策略：仅对 `success=False` 且 error 不含 "Invalid arguments" 的结果重试一次。思考：为什么参数校验错误不该重试？
3. 写一个 `MockTool`（可配置返回正常/异常/超时/超长输出四种行为），用它给流水线写单元测试，覆盖每条失败路径。

**思考题**：

1. 如果某个工具的输出有 10MB，直接放进 `output` 会发生什么？应该在流水线哪个阶段处理？怎么处理？
2. Permission 检查放在 Validate 之前是否更好？考虑“不存在的工具 + 无权限”时你希望暴露哪个信息（提示词注入视角下，错误信息的粒度也是一种信息泄露）。
3. 同步线程池的 `future.cancel()` 对已在运行的任务无效。如果工具是个死循环，超时后线程会怎样？这会如何影响后续用子进程/沙箱方案的决策？
4. `ToolResult.metadata` 目前不喂给 LLM。什么场景下你会希望把部分 metadata 也给模型看？

---

## 五、与 Agent Engineering 的关联

在生产级 Agent 系统中，Tool Executor 不是可选项，而是稳定性与安全性的承重墙：

- **可靠性**：LLM 的 function calling 调用约 5–15% 存在参数问题（业界粗略经验值），Schema 校验 + 描述性错误回传是让 Agent “自我修复”的基础机制——模型读到自己犯的错，下一轮就能纠正。
- **安全性**：Permission 阶段是人工审批（Human-in-the-loop）、工具白名单、敏感操作二次确认的唯一挂载点。没有统一 Executor 的系统，权限逻辑必然散落各处，审计时无从下手。
- **可观测性**：`latency_ms` 和 Trace 记录是后续做“哪个工具拖慢了 Agent”“哪类调用失败率最高”分析的全部数据来源。LangSmith、Langfuse 这类平台记录的正是流水线各阶段的结构化事件。
- **成本控制**：`output` 的截断策略直接决定每次工具调用消耗的 token 数。10 次工具调用 × 每次 5000 token 的无节制输出，足以让一次会话成本失控。
- **面向未来**：当你后续把 Execute 阶段的实现从“进程内函数调用”换成“Docker 沙箱”或“远程执行服务”时，流水线的其他五个阶段和 `ToolResult` 契约完全不用动——这就是今天这个抽象买下的保险。

---

## 六、FAQ

**Q1：ToolResult 和直接 try/except 工具函数相比，到底多了什么？**

try/except 只解决“不崩溃”，ToolResult 解决“语义统一”。它把成功/失败、输出、错误、耗时收敛为一种返回类型，让上层编排代码面对所有工具时逻辑完全一致；同时 error 是给 LLM 读的自我修正信息，而非给人看的堆栈。异常是语言的机制，ToolResult 是系统的契约。

**Q2：为什么 Permission 要独立于 Validate，合并成一个阶段不行吗？**

两者回答不同的问题：Validate 管“这个调用格式对不对”，Permission 管“这个动作允不允许做”。合并后错误信息会混淆语义——LLM 收到"invalid"却其实是"not allowed"，会反复尝试修改参数而不是请求授权，陷入无效循环。分离还便于独立演进：加审批流不用碰校验逻辑。

**Q3：超时应该设在工具级别还是 Executor 全局级别？**

两者都要。工具级默认值（如 `Tool.timeout_s`）承认工具的异构性——搜索引擎 5s、代码执行 120s；Executor 级全局上限兜底，防止某个工具配置了荒谬的超时。原则：**具体工具知道自己的合理耗时，系统知道总预算**。

**Q4：工具执行失败后，应该让 LLM 重试吗？**

取决于错误类型。参数校验错误：回传描述性错误让模型修正参数后重试，通常一次就好。权限拒绝：不要让模型重试，应终止该分支或请求人工介入。超时/瞬时故障：可由 Executor 自动重试（对 LLM 透明）。关键判断：**模型能修复的错误才交给模型，系统层面能恢复的错误交给系统**。

**Q5：什么时候该把 Execute 阶段从进程内调用换成沙箱？**

当工具代码来源不可信（LLM 生成的代码、第三方插件），或需要强隔离（文件系统、网络、资源限额）时。进程内调用性能好但零隔离；沙箱（子进程、Dicro、gVisor、Firecracker）隔离强但延迟高一个数量级。实务上按工具分级：可信内部 API 走进程内，动态生成的代码必须走沙箱。

---

## 七、参考资料

- OpenAI Documentation — *Function Calling*：官方对工具调用结构与错误处理的约定，可与本文 ToolResult 对照
- Anthropic Documentation — *Tool Use*：tool_result 消息结构，与本文归一化设计高度同构
- LangChain — *Tools / ToolNode 源码*（`langchain-core.tools`）：工业界 Executor 实现的参考，注意其 `ToolException` 处理与 `handle_tool_error` 策略
- Simon Willison 博客 — *Tools, not plugins* 系列文章：工具设计哲学与边界划分的一手思考
- Python 官方文档 — `concurrent.futures`：`Future.result(timeout=)` 与 `cancel()` 的语义限制（超时无法强杀运行中的线程，思考题 3 的答案线索）
- Berkeley FRAMES / 各 Agent 评测报告：工具调用失败率数据来源，支撑“校验先行”的工程决策

> 下一篇预告（Day 11）：Memory 与 State——当 Agent 有了执行能力，下一个问题是它如何记住执行过的东西。

---

## 📋 本日知识点清单

- [ ] Registry 与 Execution 的分离
- [ ] 统一的 ToolResult(success, output, error, latency_ms)
- [ ] Validate → Permission → Execute → Timeout → Result Normalize → Trace 流程
- [ ] stdout/stderr/structured result/error/metadata 的统一处理
- [ ] Executor 作为第一个真正的 Runtime 抽象

## 📝 实践练习

实现 executor.execute(tool_call, context)，包含完整执行流程。

---

*本文是「AI Agent 工程师」6 个月学习计划的一部分。学习路线：LLM → Inference → Runtime → Harness → Memory → Environment → Evaluation → Production。目标：Agent / AI Systems Engineer。*
