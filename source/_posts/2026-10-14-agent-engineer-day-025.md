---
title: "AI Agent 工程师 Day 25：Trace：让 Agent 的每一步可观测"
date: 2026-10-14 10:30:00
tags:
  - AI Agent 工程师
  - Trace
  - Observability
  - Debugging
  - Agent
categories:
  - AI Agent 工程师学习计划
  - M1 LLM + Agent Runtime
description: "Day 25/168 | M1 Agent Trace 设计 | Trace：让 Agent 的每一步可观测。6 个月从 LLM 到生产级 Agent 系统的完整学习路线。"
keywords: "AI Agent, 工程师, Agent Trace 设计, Trace, Observability, Debugging, Agent"
author: OpenClaw Agent Learning
---

# AI Agent 工程师 Day 25：Trace：让 Agent 的每一步可观测

> **6 个月学习计划** | M1 - LLM + Agent Runtime | Day 25/168
> 
> **今日主题**: Agent Trace 设计

---

# Trace：让 Agent 的每一步可观测

**核心结论**：Agent 是一个非确定性的多步系统，一次"回答"背后可能是多次模型调用、工具调用和中间推理。没有 Trace（追踪），你面对的只是一段无法归因的输出；有了 Trace，每一次失败都能定位到具体哪一步、哪个工具、哪次调用出了问题。Agent Trace 的本质是：把一次 Run（运行）建模为一棵事件树——Run → Model Call → Tool Call → Tool Result → Model Call → Final，每个节点记录 timestamp、latency、input tokens、output tokens、tool、status、error 七个维度的信息。它是 Agent 从“demo”走向“生产系统”的分水岭：没有 Trace 的 Agent 无法调试、无法优化成本、无法做性能分析，也不具备可审计性。

---

## 一、背景与动机：为什么 Trace 是 Agent 工程的必修课

在六个月 AI Agent 工程师路线中，前四周你已经完成了三件事：理解 LLM 的调用模型、构建 Runtime（运行时）、让 Agent 能调用工具。现在你面临一个必然的问题——**你的 Agent 开始“不听话”了**。

这不是模型变笨了，而是系统变复杂了。一个典型的工具调用 Agent，一次用户请求的内部流程是：

```
用户输入 → Model Call（决策）→ Tool Call（执行）→ Tool Result（返回）
        → Model Call（综合）→ Final Answer
```

任何一步都可能出错：模型选错了工具、工具返回了异常、模型误读了工具结果。当你在终端里只看到一句错误的最终回答时，你无法回答三个关键问题：

1. **哪一步出错了？**（归因）
2. **为什么出错？**（上下文还原）
3. **代价是什么？**（token 消耗、延迟分布）

这三个问题的答案，就是 Trace 要提供的。在 M1 的知识地图里，Trace 属于 **Observability（可观测性）** 板块，它是后续 Evaluation（评估）、成本优化、A/B 测试的地基——你不能优化一个你看不见的东西。

一个工程直觉：**Logging 是“系统说话给你听”，Trace 是“系统把整个故事讲给你听”**。接下来我们展开这个区别，然后一步步设计一个完整的 Trace 系统。

---

## 二、核心内容

### 2.1 Run → Model Call → Tool Call → Tool Result → Final：完整 Trace 的结构

**Agent Trace（Agent 追踪）** 的核心建模思想是：把一次完整的用户请求（一个 **Run**）表示为一棵**层级事件树（hierarchical event tree）**，而不是一条扁平的日志流。

为什么必须是树？因为 Agent 的执行有嵌套关系：一次 Model Call 可能触发多次 Tool Call，每次 Tool Call 产出一个 Tool Result，这些 Result 又被组装进下一次 Model Call。扁平日志无法表达“这个 Tool Call 是由哪次 Model Call 发起的”，而树结构天然携带父子因果链。

一个典型的完整 Trace：

```
Run (run_id: r_20240601_001)
├── span: model_call #1
│   ├── model: gpt-4o
│   ├── input: [system prompt, user query]
│   ├── output: tool_call(search_weather, {"city": "北京"})
│   └── status: ok, latency: 1.2s, tokens: 850 in / 40 out
├── span: tool_call #1 (search_weather)
│   ├── status: ok, latency: 0.3s
│   └── result: {"city": "北京", "temp": "28°C", ...}
├── span: model_call #2
│   ├── input: [system prompt, user query, tool result]
│   ├── output: "北京今天 28°C，适合出行。"
│   └── status: ok, latency: 0.9s, tokens: 920 in / 25 out
└── final: status=ok, total_latency=2.4s, total_tokens=1835
```

这里引入 **Span（跨度）** 的概念——来自分布式追踪的经典术语（Google Dapper、OpenTelemetry）。一个 Span 代表一段有开始、有结束、有归属的操作。Run 是根 Span，Model Call 和 Tool Call 是子 Span。Span 之间用 `parent_span_id` 关联。

因果链直觉：**Trace 的树结构 = Agent 的决策结构**。树的深度反映了 Agent 的迭代次数（模型调了几轮），树的分支反映了并行工具调用的能力，每个叶子节点的 Tool Result 就是模型下一轮决策的输入证据。当你发现 Agent 行为异常时，看树的形状往往比看日志文本更快定位问题——比如树只有一层说明模型没调工具就回答了，这本身就是一种 bug 模式。

### 2.2 每个节点记录什么：七维度信息模型

一个可用的 Trace 节点至少要记录七个维度，每个维度回答一个调试时的必答问题：

| 维度 | 字段 | 回答的问题 |
|---|---|---|
| 时间 | `timestamp` | 这一步什么时候发生的？事件顺序对吗？ |
| 性能 | `latency` | 这一步花了多久？瓶颈在哪？ |
| 成本 | `input_tokens` / `output_tokens` | 钱花在哪了？prompt 是不是膨胀了？ |
| 行为 | `tool`（工具名/模型名） | 这一步实际做了什么动作？ |
| 结果 | `status` | 成功还是失败？ |
| 诊断 | `error` | 失败的具体原因是什么？ |
| 归属 | `run_id` / `span_id` / `parent_span_id` | 这一步属于哪次运行、哪个父节点？ |

逐个说明设计上的关键考量：

**timestamp 与 latency 是一对，但都需要**。timestamp 给绝对时间（用于跨系统对齐、审计），latency 给相对耗时（用于性能分析）。注意 LLM 场景下 latency 还可以细分为 **TTFT（Time To First Token，首 token 延迟）** 和总延迟——前者影响用户体验，后者影响吞吐。生产级 Trace 通常两个都记。

**tokens 要分 input 和 output 记**，而且按模型分。原因很直接：input tokens 和 output tokens 价格不同（通常 output 贵 3-4 倍），且多轮 Agent 的 input tokens 会随轮次累积膨胀（第 N 轮的 input 包含了前面所有轮次的内容）。不分开记录，你就无法回答“为什么这个 Run 花了 5 万 token”——很可能答案是第 8 轮的 prompt 已经塞进了 7 轮的历史。

**status 与 error 是一对**。status 是粗粒度的枚举（`ok / error / timeout / cancelled`），用于统计和告警；error 是细粒度的信息（异常类型、堆栈、原始错误消息），用于归因。注意：**Tool Call 的“成功”和“模型对结果的满意”是两回事**——工具返回 200 但数据为空，工具层面 status=ok，但这可能是 Agent 决策链的失败起点。所以 Tool Result 本身也应作为节点内容记录。

一个常被忽略的维度是 **span 的状态继承**：如果 Tool Call 超时，其父 Model Call 通常不该标记为 error（模型没错），但 Run 层面可能要标记 degraded。层级化让这种归因变得干净。

### 2.3 trace.json 的格式设计

Trace 的存储格式没有强制标准，但有两个主流参照：**OpenTelemetry（OTel）** 的 Span 模型和各 LLM Observability 平台（LangSmith、Langfuse、Arize Phoenix）的 JSON Schema。自建系统的推荐格式如下：

```json
{
  "run_id": "r_20240601_001",
  "session_id": "s_abc123",
  "agent_name": "weather_assistant",
  "agent_version": "v0.3.2",
  "started_at": "2024-06-01T10:30:00.123Z",
  "finished_at": "2024-06-01T10:30:02.545Z",
  "status": "ok",
  "total_latency_ms": 2422,
  "total_input_tokens": 1770,
  "total_output_tokens": 65,
  "total_cost_usd": 0.0081,
  "spans": [
    {
      "span_id": "sp_01",
      "parent_span_id": null,
      "type": "model_call",
      "name": "gpt-4o",
      "started_at": "2024-06-01T10:30:00.123Z",
      "ended_at": "2024-06-01T10:30:01.345Z",
      "latency_ms": 1222,
      "input": [{"role": "system", "content": "..."}, {"role": "user", "content": "北京天气怎么样？"}],
      "output": {"role": "assistant", "tool_calls": [{"name": "search_weather", "arguments": {"city": "北京"}}]},
      "input_tokens": 850,
      "output_tokens": 40,
      "model": "gpt-4o",
      "status": "ok",
      "error": null
    },
    {
      "span_id": "sp_02",
      "parent_span_id": "sp_01",
      "type": "tool_call",
      "name": "search_weather",
      "started_at": "2024-06-01T10:30:01.350Z",
      "ended_at": "2024-06-01T10:30:01.680Z",
      "latency_ms": 330,
      "input": {"city": "北京"},
      "output": {"temp": "28°C", "condition": "晴"},
      "status": "ok",
      "error": null
    },
    {
      "span_id": "sp_03",
      "parent_span_id": "sp_01",
      "type": "model_call",
      "name": "gpt-4o",
      "started_at": "2024-06-01T10:30:01.690Z",
      "ended_at": "2024-06-01T10:30:02.545Z",
      "latency_ms": 855,
      "input_tokens": 920,
      "output_tokens": 25,
      "status": "ok",
      "error": null
    }
  ]
}
```

格式设计的三条原则：

1. **扁平 spans 数组 + parent_span_id**，而不是嵌套 children。嵌套结构序列化/反序列化麻烦，且工具调用并行时树会变宽；扁平结构让查询（“找出所有 status=error 的 span”）变成一行过滤。
2. **input/output 全量保留原始内容**。调试 Agent 的核心动作是“回放当时的完整上下文”，任何截断都会在关键时刻坑你。生产环境若考虑体积，可做内容截断 + 完整内容落盘到对象存储的两级方案。
3. **Run 层做聚合**（total_latency、total_tokens、total_cost）。这是分析层的数据源——你不想每次都遍历 spans 求和。

`agent_version` 字段值得单独强调：没有版本号的 Trace 在两个月后就是考古现场。每次改了 prompt 或工具列表，version 都要变，否则你无法对比两个版本的 Trace 差异。

### 2.4 Trace 与 Logging 的区别

这是最容易混淆的一对概念，直接给对比表：

| 维度 | Logging（日志） | Tracing（追踪） |
|---|---|---|
| 数据组织 | 扁平的、按时间排列的事件流 | 层级树，有父子因果结构 |
| 核心标识 | 无统一标识（或仅 log line） | run_id + span_id + parent_span_id |
| 回答的问题 | “发生了什么事件？” | “这次请求的完整因果链是什么？” |
| 关联性 | 需要人工 grep 拼接 | 结构化关联，天然可回放 |
| 典型用途 | 错误告警、审计、debug 单点 | 延迟瀑布分析、成本归因、行为回放 |
| 粒度 | 通常是行/条 | 是“操作”（span），带起止时间 |
| 与 Metrics 关系 | 无直接关系 | 可从 trace 聚合出 metrics（P95 延迟、错误率） |

因果直觉：Logging 和 Trace 不是替代关系，而是**视角关系**。Log 是“摄像头的原始录像”（每个组件各自记录），Trace 是“剪辑成片”（按一次请求把相关片段串起来）。在传统微服务里，Trace 靠在服务间传递 trace_id 实现串联；在 Agent 里情况更简单也更必要——所有 Span 都在同一个进程的 Runtime 内产生，Runtime 天然是 Trace 的最佳记录点。

在 Agent 场景下，纯 Logging 还有一个致命缺陷：**LLM 的调用是流式且多次的**，日志流里 “模型的第二输出” 和 “工具的返回” 混在一起，中间还可能穿插重试、并行调用。没有 span 层级，你甚至无法确定哪条日志属于哪次模型调用。这就是为什么 Agent 框架（LangChain、LlamaIndex）无一例外都内置了 callback/tracing 机制。

顺带补全可观测性三件套的关系：**Tracing 提供明细，Metrics 提供聚合，Logs 提供事件**。Trace 是最细的，metrics 可以从 trace 聚合得出（P95 latency = 对所有 run 的 total_latency 排序取 95 分位），所以从 ROI 角度，**先做 Trace 是 Agent 可观测性的正确顺序**。

### 2.5 Trace 对调试和性能分析的价值

最后回答“值得投入吗”——用三个真实场景说明。

**场景一：调试归因（Debugging）**。用户报告“Agent 回答了错误的价格”。没有 Trace，你只能复现问题、碰运气。有 Trace，你打开那次的 run：看到 model_call #2 的 input 里，tool result 返回的是 3 天前的缓存数据——归因完成，耗时 30 秒。更进一步，把 Trace 存下来后可以建立**失败样本库**：所有 status=error 或人工标记为错误的 run 集中存放，成为回归测试的测试集。这是 M1 后续 Evaluation 模块的直接输入。

**场景二：性能分析（Performance Profiling）**。一次 Run 总耗时 8 秒，慢在哪？把 spans 画成瀑布图（waterfall）：

```
model_call #1  ████████░░░░░░░░░░░░  2.1s  (TTFT 1.8s)
tool_call #1   ░░░░░░░░████░░░░░░░░░  0.5s
tool_call #2   ░░░░░░░░░███░░░░░░░░░  0.4s  (并行)
model_call #2  ░░░░░░░░░░░░░░██████░  4.2s  ← 瓶颈：input 12k tokens
final          ░░░░░░░░░░░░░░░░░░░░
```

一眼看出瓶颈是第二轮模型调用——大概率是 prompt 膨胀（历史累积），解法是历史压缩或摘要。没有 Trace，你会本能地去“优化工具速度”，方向就错了。**Agent 的延迟大头几乎总是模型调用，而模型调用的延迟大头几乎总是 input tokens**——这个结论只有看 Trace 才能对具体系统验证。

**场景三：成本分析（Cost Attribution）**。按 run_id 聚合 tokens，再按 session/用户/工具类型切片，你才能回答“哪个功能最烧钱”。多轮 Agent 的 input tokens 增长是平方级的（每轮都带全量历史），不改 prompt 策略只调参数，成本曲线不会变。

一句话总结价值链条：**Trace 是原始数据 → 调试、性能、成本、评估都是 Trace 之上的分析**。数据模型设计对了，后面所有能力都是查询问题。

---

## 三、代码实现：给 Runtime 加上 Trace

在现有 Runtime 中嵌入 Trace 的最小实现，核心是一个 `Tracer` 类管理 span 栈：

```python
import json, time, uuid
from dataclasses import dataclass, field, asdict
from typing import Optional

@dataclass
class Span:
    span_id: str
    parent_span_id: Optional[str]
    type: str            # "run" | "model_call" | "tool_call"
    name: str
    started_at: float
    # 七维度信息，结束时填充
    ended_at: Optional[float] = None
    input: object = None
    output: object = None
    input_tokens: int = 0
    output_tokens: int = 0
    tool: Optional[str] = None
    status: str = "ok"   # ok | error | timeout
    error: Optional[str] = None

    @property
    def latency_ms(self):
        return round((self.ended_at - self.started_at) * 1000, 1) if self.ended_at else None

class Tracer:
    def __init__(self):
        self.spans: list[Span] = []
        self._stack: list[Span] = []

    def start(self, type: str, name: str, **kw) -> Span:
        parent = self._stack[-1] if self._stack else None
        span = Span(
            span_id=f"sp_{uuid.uuid4().hex[:8]}",
            parent_span_id=parent.span_id if parent else None,
            type=type, name=name, started_at=time.time(), **kw)
        self.spans.append(span)
        self._stack.append(span)
        return span

    def end(self, span: Span, output=None, in_tok=0, out_tok=0,
            status="ok", error=None):
        span.ended_at = time.time()
        span.output = output
        span.input_tokens, span.output_tokens = in_tok, out_tok
        span.status, span.error = status, error
        self._stack.pop()

    def dump(self, path: str):
        with open(path, "w", encoding="utf-8") as f:
            json.dump({"spans": [asdict(s) for s in self.spans]},
                      f, ensure_ascii=False, indent=2)
```

在 Runtime 的执行循环中埋点（伪代码）：

```python
def run(self, user_input: str) -> str:
    run_span = self.tracer.start("run", "agent_run")
    messages = [{"role": "user", "content": user_input}]
    try:
        while True:
            m = self.tracer.start("model_call", self.model_name,
                                  input=messages)
            resp = self.llm.chat(messages)
            usage = resp.usage
            self.tracer.end(m, output=resp.message,
                            in_tok=usage.prompt_tokens,
                            out_tok=usage.completion_tokens)

            if not resp.message.tool_calls:
                break  # 模型给出最终回答

            messages.append(resp.message)
            for tc in resp.message.tool_calls:
                t = self.tracer.start("tool_call", tc.name, tool=tc.name)
                try:
                    result = self.tools.execute(tc.name, tc.arguments)
                    self.tracer.end(t, output=result)
                except Exception as e:
                    self.tracer.end(t, status="error", error=str(e))
                messages.append(tool_message(tc, result))
        self.tracer.end(run_span, output=resp.message.content)
    except Exception as e:
        self.tracer.end(run_span, status="error", error=str(e))
        raise
    finally:
        self.tracer.dump(f"traces/{run_span.span_id}.json")
    return resp.message.content
```

注意几个工程细节：`finally` 里 dump 保证崩溃时也不丢 Trace；`tool_call` 的异常被捕获记入 span 而不是直接抛出——因为 Agent 常见策略是把工具错误喂回模型让它自行调整，Trace 记录了这条恢复路径。

---

## 四、实践练习与思考题

**练习 1（基础）**：按上面的代码给你的 Runtime 加 Trace，跑 5 个不同复杂度的查询，检查 trace.json 中树结构是否符合预期（Model Call → Tool Call → Model Call → Final）。

**练习 2（分析）**：写一个脚本读取 trace.json，输出：(a) 每个 Run 的总延迟和 token 花费；(b) 按 span type 分组的平均延迟；(c) 所有 status=error 的 span 及其父 span 的 name。

**练习 3（进阶）**：给 Run 层实现 `total_cost_usd` 计算（需要维护一张模型单价表），并对多轮 Agent 验证一个猜想：第 N 轮 model call 的 input_tokens 是否近似等于前 N-1 轮 tokens 之和。

**思考题**：
1. 如果 Agent 支持并行工具调用，扁平 spans 数组还能还原执行顺序吗？需要补什么字段？
2. Trace 里 input/output 包含用户隐私数据，生产环境你会怎么处理？（提示：脱敏策略应该在埋点层还是存储层？）
3. Streaming 场景下，span 的 `ended_at` 应该是什么时刻？TTFT 怎么记？

---

## 五、与 Agent Engineering 的关联

Trace 在真实 Agent 系统中是**基础设施级别**的存在，具体体现在四个环节：

1. **生产运维**：线上 Agent 出问题的第一入口是 Trace。告警基于 Trace 聚合出的 metrics（错误率、P95 延迟），值班工程师顺着 trace_id 下钻到具体 span。
2. **评估体系（Evaluation）**：M1 后续要做的 eval，其数据源就是 Trace。你用真实 Trace 构建测试集，用 Trace 中的中间步骤判断“模型是否正确选择了工具”（这叫 trajectory evaluation，轨迹评估，与只看最终答案的 end-to-end eval 互补）。
3. **成本与性能优化**：所有优化决策（prompt 压缩、缓存、模型路由）都必须先由 Trace 证明瓶颈所在，优化后再由 Trace 验证效果。
4. **生态对接**：行业已有成熟方案——**OpenTelemetry** 定义了 GenAI 语义约定（`gen_ai.system`、`gen_ai.usage.tokens` 等属性），**Langfuse** 和 **LangSmith** 提供开箱即用的 Trace 采集与可视化，**Arize Phoenix** 提供开源方案。你的自建 Trace 格式设计得越接近 OTel 约定，未来迁移/对接成本越低。

一个职业判断：面试中区分“调过 API 的人”和“做过 Agent 系统的人”的常见问题就是“你怎么调试一个多步 Agent 的失败案例”。能画出 Trace 树结构、说出七维度字段、讲清 Trace 与 Logging 区别的人，答案高下立判。

---

## FAQ

**Q1：LangSmith/Langfuse 这类平台这么成熟，还有必要自建 Trace 吗？**
有必要，且两者不冲突。自建的价值在于理解数据模型——你才知道平台给你看的东西意味着什么、字段是怎么来的，以及在不能引入外部依赖的场景（私有化部署、合规要求）有 Plan B。实践中常见做法是：埋点层自己实现（或用 OTel SDK），导出层对接 Langfuse 这类平台。

**Q2：Trace 会不会因为记录全量 input/output 导致存储成本爆炸？**
会，所以要分级。开发/调试环境全量记录；生产环境保留全部结构化字段（tokens、latency、status）但 input/output 可截断（如保留首尾各 500 字符）或落对象存储、数据库里只存引用。另一个技巧是只在 error run 和抽样的正常 run 上保留全量内容。

**Q3：每一步都记 Trace，会增加多少延迟？**
几乎为零。Trace 记录是内存操作 + 异步落盘，单个 span 开销在微秒级，而 Agent 的每一步是秒级（LLM 调用）到百毫秒级（工具调用），差 4 个数量级以上。真正要注意的是不要在埋点路径里做同步 I/O（如每记一个 span 就写一次文件）。

**Q4：Trace、Span、Run 这些概念和 OpenTelemetry 是什么关系？**
Run ≈ OTel 的 Trace（一次完整请求的追踪），Span 是 OTel 的原生概念，语义一致。OTel 还定义了 GenAI 的属性命名约定（`gen_ai.request.model`、`gen_ai.usage.input_tokens` 等）。如果你的系统未来可能接入 OTel 生态，建议字段命名直接对齐这套约定。

**Q5：Multi-Agent 系统中 Trace 怎么组织？**
两种主流做法：一是**单树跨 Agent**——子 Agent 的 Run 作为父 Agent 某个 span 的子树，通过传递 trace context 实现，适合强协作场景；二是**每 Agent 独立 Run 树 + 顶层关联 ID**，适合松耦合。核心原则是保留跨 Agent 的因果链，否则“为什么 A Agent 把任务交给了 B Agent”将无法回答。

---

## 参考资料

以下方向检索到的资料对本文主题最有价值（按主题归类）：

- **OpenTelemetry GenAI 语义约定**：opentelemetry.io — GenAI Semantic Conventions（Span 属性命名与字段模型的事实标准）
- **Google Dapper 论文**：*Dapper, a Large-Scale Distributed Systems Tracing Infrastructure*（Trace/Span 树模型的源头，理解层级追踪必读）
- **Langfuse 文档**：langfuse.com/docs — Tracing 概念与 SDK 设计（LLM 场景 Trace 格式的典型实现）
- **LangSmith 文档**：Traces & Runs 数据模型（Run → Child Runs 的层级组织方式）
- **Arize Phoenix**：开源 LLM Tracing 方案，OTel 兼容（自建系统的参照实现）
- **LangChain Callbacks 文档**：框架层如何设计埋点接口（Runtime 集成 Trace 的工程参考）

---

## 📋 本日知识点清单

- [ ] Run → Model Call → Tool Call → Tool Result → Model Call → Final 的完整 trace
- [ ] 每个节点记录 timestamp/latency/input tokens/output tokens/tool/status/error
- [ ] trace.json 的格式设计
- [ ] Trace 与 Logging 的区别
- [ ] Trace 对调试和性能分析的价值

## 📝 实践练习

给 Runtime 增加完整 Trace，每个节点记录 7 个维度信息。

---

*本文是「AI Agent 工程师」6 个月学习计划的一部分。学习路线：LLM → Inference → Runtime → Harness → Memory → Environment → Evaluation → Production。目标：Agent / AI Systems Engineer。*
