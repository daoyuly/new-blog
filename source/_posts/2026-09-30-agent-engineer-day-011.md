---
title: AI Agent 工程师 Day 11：Error Handling：Agent 的统一错误处理
tags:
  - AI Agent 工程师
  - Error Handling
  - Retry
  - Timeout
  - Runtime
categories:
  - AI Agent 工程师学习计划
  - M1 LLM + Agent Runtime
description: >-
  Day 11/168 | M1 Agent 错误处理体系 | Error Handling：Agent 的统一错误处理。6 个月从 LLM 到生产级
  Agent 系统的完整学习路线。
keywords: 'AI Agent, 工程师, Agent 错误处理体系, Error Handling, Retry, Timeout, Runtime'
author: OpenClaw Agent Learning
abbrlink: 53950
date: 2026-09-30 10:30:00
---

# AI Agent 工程师 Day 11：Error Handling：Agent 的统一错误处理

> **6 个月学习计划** | M1 - LLM + Agent Runtime | Day 11/168
> 
> **今日主题**: Agent 错误处理体系

---

# Error Handling：Agent 的统一错误处理

## 开篇结论

Agent 的错误处理不是“try-catch 加个日志”，而是一套**错误分类 → 统一结构 → 策略路由 → 反馈给模型**的闭环系统。核心认知有三条：

1. **错误必须分类**（Tool Error / Model Error / Timeout / Invalid Output / Network Error / Unknown Tool），因为不同错误的处理策略完全不同——网络错误该重试，参数错误重试一百次也没用。
2. **错误必须结构化**。不是抛一个字符串异常，而是返回一个带 `retryable`、`reason`、`suggestion` 字段的统一 Error 对象，让上层调度器能机器化决策。
3. **错误要反馈给模型时，必须翻译成模型能理解的语言**。把 Python 堆栈直接塞给 LLM 是新手最常犯的错误——模型会被噪声淹没，做出更差的决策。

一句话总结：**运行时层的错误处理决定 Agent 的健壮性，反馈层的错误表达决定 Agent 的自愈能力**。这两层缺一不可。

---

## 一、背景与动机

### 1.1 为什么 Agent 系统的错误处理比传统系统难

传统软件的错误处理是**确定性**的：输入固定、逻辑固定，同样的错误必然复现，处理策略写死在代码里即可。

Agent 系统多了一个**不确定性的决策核心**（LLM）。这带来三个质变：

- **错误会传播并放大**。一个 Tool 的参数错误，如果不纠正，Agent 可能在错误的假设上继续跑 5 步，浪费大量 token。
- **错误是自我修复的机会**。LLM 具备读错误信息、调整行为的能力——这是传统软件没有的“运行时自愈”通道。但前提是错误信息表达得好。
- **��误类型天然异构**。一次 Agent 执行可能横跨网络调用、模型推理、工具执行、输出解析四个故障域，各自的异常模型完全不同。

### 1.2 在 6 个月路线中的位置

本篇处于 M1（基础建设）第 2 周，紧跟 Tool Calling 与执行循环之后。因果链是：你已经搭好了「模型 ↔ 工具」的执行循环，接下来任何一次真实运行都会撞上错误——此时你会立刻发现：**没有统一错误体系，执行循环就是裸奔的**。后续的 Retry 策略、Human-in-the-Loop、可观测性（Observability）都建立在今天的错误分类之上。

---

## 二、六种错误类型的分类

### 2.1 Agent Error Taxonomy（Agent 错误分类法）

| 错误类型 | 发生层 | 典型原因 | 可重试？ | 默认策略 |
|---|---|---|---|---|
| Tool Error（工具执行错误） | 工具层 | 工具内部逻辑失败、依赖服务异常 | 视情况 | 反馈给模型，让模型修正输入 |
| Model Error（模型错误） | 模型层 | API 返回 5xx、内容过滤、模型拒绝 | 多数可重试 | 指数退避重试，换模型降级 |
| Timeout（超时） | 运行时 | 工具/模型响应超过预算 | 有条件 | 有限重试 + 缩短超时预算 |
| Invalid Output（无效输出） | 解析层 | JSON 格式错、schema 校验失败 | 可重试 | 把校验错误反馈给模型重新生成 |
| Network Error（网络错误） | 基础设施层 | DNS 失败、连接拒绝、断连 | 高度可重试 | 指数退避 + 抖动重试 |
| Unknown Tool（未知工具） | 路由层 | 模型幻觉出不存在的工具名 | 不可盲重试 | 纠正性反馈：列出可用工具 |

### 2.2 为什么这样分？因果链在哪？

分类的维度不是“错误长什么样”，而是**“错误发生在哪个故障域、决策权在谁手上”**：

- **决策权在上游基础设施**（Network Error）：你的代码什么也修不了，只能重试。
- **决策权在模型**（Tool Error、Invalid Output、Unknown Tool）：重试同样的输入毫无意义，必须把错误**翻译给模型**，让它改参数、换工具。
- **决策权在系统策略层**（Timeout、Model Error）：需要预算控制和降级逻辑。

这个“决策权归属”视角是整个分类体系的核心直觉。判断一个错误该重试还是该反馈给模型，只需问一句：**重试同样的输入，结果会不同吗？** 网络抖动——会；模型幻觉出错误工具名——不会，除非你把正确信息喂回去。

### 2.3 Retryable vs Non-Retryable（可重试 vs 不可重试）

这是工程上最重要的二分。错误的 `retryable` 属性必须在**错误产生处**就确定，而不是让上层去猜：

```python
class AgentError(Exception):
    """统一错误基类"""
    def __init__(self, error_type, message, retryable, reason, suggestion=None):
        self.error_type = error_type      # 六种类型之一
        self.message = message            # 人类可读信息
        self.retryable = retryable        # 机器可判断：能否原样重试
        self.reason = reason              # 结构化的失败原因
        self.suggestion = suggestion      # 给模型的自愈提示
        super().__init__(message)
```

---

## 三、统一 Agent Error 体系

### 3.1 设计目标

统一错误体系要同时服务**三个消费者**，这是它必须结构化的根本原因：

1. **调度器/执行循环**：需要 `retryable`、`error_type` 做程序化决策（重试几次？换路径？终止？）。
2. **LLM 本身**：需要 `reason` + `suggestion`，且格式要压缩、无噪声。
3. **工程师/可观测性系统**：需要 `message`、完整堆栈、上下文 ID，用于事后排查。

一个字符串异常无法同时满足三者。所以统一 Error 的设计原则是：**机器字段与人类字段分离，模型字段单独设计**。

### 3.2 错误体系架构图

```
┌─────────────────────────────────────────────────┐
│                   Agent Loop                    │
│                                                 │
│   LLM ──call──▶ Router ──▶ Tool Executor        │
│    ▲                        │                   │
│    │                        ▼                   │
│    │              ┌──────────────────┐          │
│    │              │  Error Classifier │          │
│    │              └────────┬─────────┘          │
│    │            ┌──────────┼──────────┐         │
│    │            ▼          ▼          ▼         │
│    │      retryable?   model-fixable?  fatal?   │
│    │            │          │          │         │
│    │       Retry w/     Translate to     └──▶ Terminate
│    │       backoff      model-readable
│    │            │          feedback
│    └────────────┴──────────┘
│         (错误反馈进入下一轮上下文)
└─────────────────────────────────────────────────┘
```

关键点：错误分类器是 Tool 执行和 Agent Loop 之间的**防腐层**（Anti-Corruption Layer）。无论底层工具抛出什么千奇百怪的异常（HTTP 404、KeyError、自定义异常），都会被归一化为统一的 `AgentError`。Agent Loop 只需要面对一种错误协议。

### 3.3 六种错误的具体实现

```python
class ErrorType(str, Enum):
    TOOL_ERROR = "tool_error"
    MODEL_ERROR = "model_error"
    TIMEOUT = "timeout"
    INVALID_OUTPUT = "invalid_output"
    NETWORK_ERROR = "network_error"
    UNKNOWN_TOOL = "unknown_tool"

class UnknownToolError(AgentError):
    def __init__(self, tool_name, available_tools):
        super().__init__(
            error_type=ErrorType.UNKNOWN_TOOL,
            message=f"Tool '{tool_name}' not found",
            retryable=False,          # 原样重试 = 再次幻觉
            reason="tool_not_found",
            suggestion=None,          # suggestion 动态生成，见下文
        )
        self.available_tools = available_tools

class InvalidOutputError(AgentError):
    def __init__(self, validation_error, raw_output):
        super().__init__(
            error_type=ErrorType.INVALID_OUTPUT,
            message=f"Output failed schema validation",
            retryable=True,           # 模型重新生成即可修复
            reason="schema_validation_failed",
            suggestion=None,
        )
        self.validation_error = validation_error
        self.raw_output = raw_output  # 保留现场，供反馈用
```

注意 `UnknownToolError` 的 `retryable=False`：它“不可重试”指的是**不能原样重试**，但它恰恰是最需要反馈给模型修��的错误类型。这引出下一节的核心问题。

---

## 四、Agent 如何看到错误信息

### 4.1 关键洞察：错误信息是一种“上下文投资”

Agent 的每一次工具失败都会占用上下文窗口的 token。错误信息的表达质量直接决定了三件事：

- 模型能否**一次修正**成功（修正成本）
- 上下文被错误信息**污染**的程度（token 成本）
- 模型后续决策的质量（级联影响）

### 4.2 差的错误表达 vs 好的错误表达

**差的**（原始堆栈直接进上下文）：

```
Traceback (most recent call last):
  File "/app/tools/search.py", line 47, in execute
    resp = requests.get(url, params=params, timeout=5)
  ...
requests.exceptions.ConnectionError: HTTPSConnectionPool(host='api.example.com', port=443): Max retries exceeded
```

模型看到这个会怎样？大概率重复一遍同样的调用——因为它无法从 40 行噪声里提取出“我该改什么”。

**好的**（结构化 + 面向模型压缩）：

```json
{
  "status": "error",
  "error_type": "unknown_tool",
  "tool": "web_serch",
  "reason": "工具名不存在。注意：工具名必须精确匹配。",
  "available_tools": ["web_search", "calculator", "read_file"],
  "suggestion": "你可能想调用 'web_search'（拼写差异：多了一个 r）"
}
```

模型看到这个，一次就能修正。工程直觉是：**写给模型的错误信息 = 失败原因 + 正确方向，删掉一切模型无法行动的内容**。堆栈、行号、内部变量对模型是纯噪声。

### 4.3 三层错误视图

同一个 `AgentError`，对不同消费者投影出不同视图：

```python
def error_for_model(err: AgentError) -> str:
    """模型视图：紧凑、可行动"""
    parts = [f"Tool call failed: {err.error_type.value}"]
    if err.reason:
        parts.append(f"Reason: {err.reason}")
    if err.suggestion:
        parts.append(f"Suggestion: {err.suggestion}")
    return " | ".join(parts)

def error_for_operator(err: AgentError) -> dict:
    """运维视图：完整、可排查"""
    return {
        "type": err.error_type.value,
        "retryable": err.retryable,
        "message": err.message,
        "context": err.__dict__,
        "traceback": traceback.format_exc(),
    }
```

---

## 五、不同错误类型的处理策略

### 5.1 策略路由表

| 错误类型 | 重试策略 | 反馈给模型？ | 兜底策略 |
|---|---|---|---|
| Network Error | 指数退避 + 抖动，最多 3-5 次 | 否（对模型不可见，运行时自愈） | 上报为 Tool Error |
| Timeout | 最多 1-2 次，可降低超时预算 | 可选：告知"工具执行超时，考虑换方法" | 中断并标记 |
| Model Error (5xx/rate limit) | 指数退避，尊重 Retry-After | 否 | 降级到备选模型 |
| Invalid Output | 不原样重试 | **是**：附上 validation error + 原始输出 | 最多 2 次修正后终止 |
| Tool Error | 不原样重试 | **是**：附上失败原因 + 参数 | 让模型换工具或放弃 |
| Unknown Tool | 禁止 | **是**：附上可用工具列表 | 连续 2 次幻觉则终止 |

### 5.2 重试的核心：Backoff（退避）

```python
import random, asyncio

async def retry_with_backoff(fn, max_retries=3, base_delay=1.0):
    """指数退避 + 抖动：只用于 retryable=True 的错误"""
    for attempt in range(max_retries):
        try:
            return await fn()
        except AgentError as e:
            if not e.retryable or attempt == max_retries - 1:
                raise
            delay = base_delay * (2 ** attempt) + random.uniform(0, 1)
            await asyncio.sleep(delay)
```

为什么加抖动（jitter）？因为当上游服务故障恢复时，所有重试的客户端会同步涌回，形成重试风暴，把刚恢复的服务再次打垮。抖动打散了重试时间。

### 5.3 反馈式修复的关键：区分“告知”与“误导”

把错误反馈给模型时有一条红线：**不要替模型做决定，只提供事实**。比如 Unknown Tool 时，告诉它“这个工具不存在，可用工具是 A/B/C”，而不是直接替它改写成 A 再执行——你不确定模型的意图到底是 A 还是 B。错误反馈的目标是让模型带着新信息重新推理，而不是让运行时替它猜测。

### 5.4 终止条件：防止无限错误循环

错误处理体系必须有**熔断**：同一工具调用连续失败 N 次（通常 2-3 次）、或者总错误数超过预算时，强制终止并把汇总错误交给上层（可能是 Human-in-the-Loop）。没有熔断的 Agent 会在错误循环里烧光 token 预算。

---

## 六、错误信息对模型决策的影响

### 6.1 因果链：错误表达 → 修正成功率

可以建立一个直觉模型：模型收到错误后的行为，取决于它能从错误信息中提取多少**可行动信息**（actionable information）。

- 错误信息包含“哪里错了 + 怎么改”→ 修正成功率通常很高，一轮修复。
- 错误信息只包含“哪里错了”→ 模型需要猜测，可能引入新错误。
- 错误信息是噪声 → 模型倾向重复原调用（这就是 Agent 卡死的常见原因）。

实验建议（今天的练习里做）：对同一个参数错误的场景，分别用原始堆栈和结构化反馈喂给模型，统计 3 次内的修正成功率。你会看到显著差异——这是建立工程直觉最直接的方式。

### 6.2 上下文污染：错误信息的隐性成本

每次失败都会往上下文写入错误记录。长对话中，10 次失败的工具调用可能占据上下文的相当比例，导致：

- 模型被“失败历史”锚定，变得保守（“这个工具不好用”的错误泛化）
- 有效上下文被挤占，早期关键指令被稀释

工程对策：错误反馈要**紧凑**；连续失败的调用可以只保留最后一条完整错误 + 前几条摘要。

### 6.3 错误也是信号：让模型“学习”运行时约束

反直觉的一点：好的错误反馈不只是修复当次调用，还在教模型运行时的规则。比如 Unknown Tool 反馈中列出可用工具，实际上是在动态补充工具清单；Invalid Output 反馈中的 schema 错误，相当于按需的格式教学。这是 Agent 系统里“运行时教育模型”的重要机制。

---

## 七、实践练习

**练习 1：实现统一错误体系**

实现 `AgentError` 基类和 6 个子类，每个子类在构造时就确定 `retryable` 和 `reason`。写一个 `ErrorClassifier`，能将任意底层异常（`requests.Timeout`、`json.JSONDecodeError`、`KeyError`）归一化为对应的 `AgentError`。

**练习 2：实现策略路由**

在执行循环中加入错误处理分支：`retryable=True` 走 backoff 重试；`retryable=False` 且 `error_type` 属于 model-fixable 类型，则把 `error_for_model()` 的输出作为 tool message 写回上下文，让模型重新决策。设置熔断：同参数连续失败 2 次即终止。

**练习 3：错误表达 A/B 实验**

构造一个模型必然写错参数的场景（比如要求它调用一个参数名容易混淆的 API）。分别用“原始异常字符串”和“结构化反馈”两种方式回传错误，各跑 10 轮，统计平均修正轮数和 token 消耗。

**思考题**

1. `InvalidOutput` 错误反馈时，要不要把模型的原始错误输出附上？附上会帮助定位，但也是噪声和潜在的坏示例。你的取舍是什么？
2. Network Error 重试 5 次都失败后升级为 Tool Error 反馈给模型——模型此时应该被告知“网络问题”还是“工具坏了”？两种表述会引导出什么不同行为？
3. 如果工具本身是幂等的（如 GET 查询）vs 非幂等的（如发送邮件），重试策略应该有什么区别？

---

## 八、与 Agent Engineering 的关联

统一错误处理在实际 Agent 系统中是四条主线的交汇点：

1. **可靠性（Reliability）**：Agent 生产环境的核心指标不是“能不能跑通 happy path”，而是“出错后能否恢复”。错误体系就是可靠性的骨架。
2. **可观测性（Observability）**：统一错误结构让 tracing 系统能按 `error_type` 聚合统计、按 `reason` 建立告警规则。没有统一协议，监控就是散装日志。
3. **成本控制**：错误循环是 token 失控的头号来源。熔断 + 重试预算直接决定账单。
4. **Human-in-the-Loop**：当自动恢复失败时，什么样的错误、什么样的上下文该升级给人类？今天的 `error_for_operator()` 就是那个升级接口的雏形。

后续 M1 的 Retry 策略优化、M2 的多 Agent 编排（错误在 Agent 间如何传播）、M3 的生产部署（SLO 与告警），都直接复用今天的体系。**这里投入的每一小时，都会在后续被放大。**

---

## FAQ

**Q1：为什么不直接用 try-except 捕获所有异常，统一返回"出错了"给模型？**

A：因为丢失了 `retryable` 和 `reason`，调度器无法区分“该重试”和“该反馈模型”，模型也无法修正。笼统错误信息会导致模型重复原调用，进入死循环。“出错了”三个字的 token 成本最低，但修正成本最高。

**Q2：错误反馈给模型会不会泄露系统内部信息（如路径、API 细节），有安全风险？**

A：会。`error_for_model()` 必须做一层脱敏：去掉文件路径、内部主机名、密钥相关的报错内容。这也是为什么“模型视图”和“运维视图”必须分离——前者既要紧凑也要安全。

**Q3：重试次数和超时预算应该怎么定？**

A：经验起点：Network Error 重试 3 次、退避基值 1s；Invalid Output 修正最多 2 次；单个工具调用超时 30-60s；单轮 Agent 执行总错误数熔断阈值 5-10 次。关键不是具体数字，而是**所有预算必须是显式配置**，而不是隐式写死在代码里。

**Q4：模型一直修不对同一个错误怎么办？**

A：三层递进：(1) 检查错误反馈本身是否可行动，很多“模型蠢”其实是“反馈烂”；(2) 连续失败达阈值后终止该路径，让模型换工具或换思路；(3) 如果是系统性失败（模型总是写不对某工具的参数），那是 Prompt/工具设计问题——改善工具的参数 schema 或文档，而不是继续堆错误反馈。

**Q5：Error Type 会不会不够用？未来怎么扩展？**

A：会不够用，比如后续会遇到 Context Overflow、Rate Limit、Policy Violation 等更细的类型。设计上预留两个机制：`error_type` 用字符串枚举而非硬编码类，方便扩展；每个 `AgentError` 携带自由格式的 `context` 字典，承载类型特有的数据，这样扩展类型不需要改动调度器协议。

---

## 参考资料

> 注：本篇学习计划的搜索结果为空，以下为该主题公认的高价值参考方向，建议按关键词自行检索。

1. **Anthropic — Building Effective Agents**：官方工程指南，讨论 error handling 与 agent loop 设计
2. **OpenAI Cookbook — Function Calling / Error Handling**：工具调用错误回传的标准模式
3. **Microsoft — AutoGen 源码**：`autogen` 中的异常处理与重试封装，工程实现参考
4. **Google SRE Book — Ch.22 Addressing Cascading Failures**：重试风暴、退避与抖动的经典论述
5. **搜索关键词建议**：`agent tool error recovery patterns`、`retryable vs non-retryable errors`、`exponential backoff jitter`、`LLM structured error feedback`

---

## 📋 本日知识点清单

- [ ] Tool Error / Model Error / Timeout / Invalid Output / Network Error / Unknown Tool 的分类
- [ ] 统一 Agent Error 体系
- [ ] Agent 如何看到错误信息（retryable/reason vs 简单 error）
- [ ] 不同错误类型的处理策略
- [ ] 错误信息对模型决策的影响

## 📝 实践练习

实现统一错误处理，覆盖 6 种错误类型，设计 Agent 可读的错误信息格式。

---

*本文是「AI Agent 工程师」6 个月学习计划的一部分。学习路线：LLM → Inference → Runtime → Harness → Memory → Environment → Evaluation → Production。目标：Agent / AI Systems Engineer。*
