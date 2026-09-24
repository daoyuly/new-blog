---
title: "AI Agent 工程师 Day 5：Structured Output 与 Tool Calling"
date: 2026-09-24 10:30:00
tags:
  - Structured Output
  - Tool Calling
  - JSON Schema
  - LLM
categories:
  - AI Agent 工程师学习计划
  - M1 LLM + Agent Runtime
description: "Day 5/168 | M1 从自然语言到结构化行动 | Structured Output 与 Tool Calling。6 个月从 LLM 到生产级 Agent 系统的完整学习路线。"
keywords: "AI Agent, 工程师, 从自然语言到结构化行动, Structured Output, Tool Calling, JSON Schema, LLM"
author: OpenClaw Agent Learning
---

# AI Agent 工程师 Day 5：Structured Output 与 Tool Calling

> **6 个月学习计划** | M1 - LLM + Agent Runtime | Day 5/168
> 
> **今日主题**: 从自然语言到结构化行动

---

# Structured Output 与 Tool Calling：LLM 如何从“会说话”变成“会行动”

**核心结论**：Tool Calling（工具调用，又称 Function Calling）的本质不是让模型“执行”任何东西，而是让 LLM 把模糊的自然语言意图，压缩成一份符合 JSON Schema 的结构化行动请求。模型始终只做一件事——生成文本；所谓的“调用工具”，是框架层解析这段结构化文本、校验参数、再由代码真正执行的。理解“LLM 只提议、系统才执行”这个分工，是后续构建一切 Agent 系统的基石。本篇聚焦于“LLM 如何提出行动”这半个问题，刻意不实现完整 Agent。

---

## 一、背景与动机：为什么这是 Agent 工程师的第一道分水岭

在六个月的 AI Agent 工程师学习路线中，你已经完成了 Prompt Engineering 和 LLM API 的基础部分。你知道怎么让模型写诗、总结文档、回答问题——但这些都是“单向输出”：模型给你文字，你读完，结束。

真实的 Agent 系统面对的需求是这样的：

> 用户：“帮我看看上海明天适合穿什么。”

这句话背后需要：调用天气 API → 拿到明天的温度和降水概率 → 基于数据给出穿衣建议。问题在于，**LLM 是一个文本进、文本出的概率模型，它没有手，不能真的去查天气**。它唯一能做的是输出文字。

于是整个 Agent 工程的核心问题被归结为一句话：

**如何让一个只会生成文本的模型，可靠地表达“我想执行某个动作，参数是这些”？**

答案就是 Structured Output（结构化输出）+ Tool Calling。这也是 M1 第 1 周安排这个主题的原因：它是从“聊天机器人开发者”到“Agent 工程师”的认知分水岭。后面所有主题——ReAct 循环、多工具编排、Agent 记忆、多 Agent 协作——全部建立在这个机制之上。不理解 Tool Calling 的底层原理，后面写 Agent 就只会调 SDK 的黑盒，出了 bug 无从下手。

---

## 二、核心内容

### 2.1 从 Natural Language 到 Structured Output 的转换

**核心概念**：Structured Output（结构化输出）指 LLM 按照预先定义的格式（通常是 JSON Schema）生成输出，而不是自由发挥的自然语言。

为什么必须有这一层？看一个因果链：

1. 自然语言是**高熵、多义**的。“明天上海几点下雨”和“明天上海的降雨时间”是同一个意图的两种表述。
2. 下游程序（天气 API、数据库查询、邮件发送）需要**精确、确定**的输入：城市名必须是 `Shanghai` 而不是“魔都”、“上海”混着来。
3. 因此中间必须有一个**意图归一化**层：把无限种表达方式映射到有限、可枚举的结构化表示上。

在 LLM 出现之前，这个归一化靠正则、NER 模型、意图分类器三件套，每个任务都要单独训练，泛化能力极差。LLM 的价值在于：**它天生就是意图理解的通用压缩器**，只要你把目标 schema 告诉它，它就能把自然语言“装进去”。

两种主流实现方式对比：

| 方式 | 原理 | 可靠性 | 适用场景 |
|---|---|---|---|
| Prompt 约束 | 在 system prompt 里写“请输出 JSON，字段为...”，然后自己解析 | 低，模型可能加 Markdown 代码块、漏字段、多说话 | 快速原型 |
| 原生 Structured Output | API 层通过受限解码强制输出符合 schema 的 token | 高，语法层面保证合法 | 生产环境 |

关键工程直觉：**JSON 语法合法 ≠ 语义正确**。即使用了原生 Structured Output，模型也可能把 `city` 填成用户没提过的城市，或者把温度填成字符串 `"25度"`。语法由解码器保证，语义需要你自己校验——这是 2.5 节的主题。

### 2.2 Tool Calling 的 JSON Schema

**核心概念**：Tool Definition（工具定义）是你告诉 LLM“有哪些工具可用、每个工具干什么、需要什么参数”的说明书，载体就是 JSON Schema。

一个典型定义长这样：

```json
{
  "type": "function",
  "function": {
    "name": "get_weather",
    "description": "查询指定城市指定日期的天气",
    "parameters": {
      "type": "object",
      "properties": {
        "city": {
          "type": "string",
          "description": "城市名，如 'Shanghai'"
        },
        "date": {
          "type": "string",
          "description": "日期，ISO 8601 格式，如 '2025-01-15'"
        },
        "unit": {
          "type": "string",
          "enum": ["celsius", "fahrenheit"],
          "description": "温度单位，默认 celsius"
        }
      },
      "required": ["city", "date"]
    }
  }
}
```

三个字段的作用机理值得掰开看：

- **`description`（工具和参数的描述）**：这是模型决定“是否调用、怎么填参数”的唯一依据。模型看不到你的代码，只看得到描述。所以写 description 不是写注释，是在**给模型写 prompt**。模糊的 description 是工具调用出错的最大来源。
- **`type` 与 `enum`**：类型约束在推理时影响模型对参数值的生成分布；`enum` 相当于给了模型一道选择题，显著降低胡编的可能性。
- **`required`**：告诉模型哪些参数不能省。模型会自己判断：如果用户没说日期，它可能填一个猜测值、可能调用失败、也可能反问用户——具体行为取决于 `required` 和 system prompt 的设计。

一个常见误区：很多人以为 schema 是给“执行层”看的。实际上执行层根本不需要 schema——它是你的代码，参数类型你自己清楚。**schema 是纯粹写给 LLM 看的接口文档**。这个视角转换能帮你理解为什么 description 的质量如此重要。

### 2.3 LLM 如何提出行动请求

这是本篇最重要的认知点。**LLM 并没有“决定调用工具”的能力，它做的是条件文本生成**：当上下文中出现了工具定义，且用户消息在语义上与某个工具的 description 匹配时，模型生成一段特殊格式的结构化文本，声明“我建议调用这个工具，参数如下”。

从概率角度看：模型的训练数据里包含大量“API 文档 + 调用示例”的语料。当你把工具定义放进上下文，相当于把模型置于“看了文档的程序员”这个分布里，它自然会生成调用语句。现代模型还针对这个场景做了专门微调，让 `tool_calls` 字段的生成更稳定。

用 ASCII 图把一次请求的数据流画出来：

```
┌─────────────────────────────────────────────────────┐
│ 你发给 API 的请求体                                   │
│                                                     │
│  messages: [ {role:"user",                          │
│               content:"上海明天适合穿什么？"} ]         │
│  tools:    [ get_weather 的 JSON Schema ]           │
└──────────────────────┬──────────────────────────────┘
                       ▼
┌─────────────────��───────────────────────────────────┐
│ LLM（只做文本生成）                                   │
│                                                     │
│  判断：语义匹配 get_weather → 生成结构化请求：          │
│                                                     │
│  tool_calls: [{                                     │
│    id: "call_abc123",                               │
│    name: "get_weather",                             │
│    arguments: '{"city":"Shanghai","date":"2025-01-15"}' │
│  }]                                                 │
└──────────────────────┬──────────────────────────────┘
                       ▼
┌─────────────────────────────────────────────────────┐
│ 你的代码（模型已经停了，接下来全是你的事）               │
│                                                     │
│  1. 解析 tool_calls     2. 校验参数                  │
│  3. 真正执行 get_weather  4. 把结果塞回 messages      │
└─────────────────────────────────────────────────────┘
```

注意一个细节：`arguments` 是**字符串形式的 JSON**，不是 JSON 对象。这是历史遗留的 API 设计，但也意味着解析失败是真实可能的运行时风险，你的代码必须处理 `json.loads` 抛异常的情况。

另外，模型不一定每次都调用工具。如果用户说“你好”，模型会正常返回 `content` 文本而不带 `tool_calls`。是否调用，是模型基于语义匹配做的一个隐式二分类决策。

### 2.4 Tool Call 的完整流程（请求-响应闭环）

单次工具调用只是半轮对话，完整的闭环是四步：

```
用户输入
   │
   ▼
① LLM 推理 ──→ 返回 tool_calls（行动提议）
   │
   ▼
② 你的代码：校验 + 执行工具 ──→ 得到结果（如 {"temp":8,"rain":0.2}）
   │
   ▼
③ 把结果作为 tool 角色消息追加进上下文
   │      messages += {role:"tool", tool_call_id:"call_abc123",
   │                    content:'{"temp":8}'}
   ▼
④ 再次调用 LLM ──→ 模型基于工具结果生成最终自然语言回答
   │                "明天上海 8 度有雨，建议穿防水外套。"
   ▼
结束（或回到 ①，继续调用下一个工具 → 这就是 Agent 循环）
```

两个容易踩坑的地方：

- **上下文完整性**：第 ④ 步的 messages 必须包含之前所有的 assistant `tool_calls` 消息和对应的 `tool` 结果消息，一条都不能少，否则 API 直接报错。模型需要看到完整的调用链才能理解当前状态。
- **这还不是 Agent，但是 Agent 的原子操作**。如果第 ④ 步之后模型的回答里又包含 `tool_calls`，你就回到第 ② 步——这个“LLM 调工具 → 结果回填 → LLM 再决策”的循环，就是 Agent 的执行循环（Agent Loop）。本篇只走到第 ④ 步；把循环加上的事，属于后面 M1 第 2 周的内容。

### 2.5 Tool Call 的参数校验

模型提议的参数，本质上还是**采样出来的 token**，不是查表得到的精确值。所以校验层不可省略。工程上的原则是：**永远不信任模型输出，模型输出按不可信外部输入对待**——和对待用户输入的 Web 请求一个待遇。

校验分三层：

| 校验层 | 检查内容 | 失败示例 | 失败后怎么办 |
|---|---|---|---|
| 语法层 | `arguments` 能否被 `json.loads` 解析 | 模型截断产生非法 JSON | 重试或直接报错给上层 |
| 结构层 | 字段是否存在、类型是否正确 | `date` 是 `"明天"` 而非 ISO 格式 | 尝试归一化，失败则走纠错路径 |
| 语义层 | 值是否合理、是否有权限执行 | `city="Atlantis"`，日期超出可查询范围 | 把错误信息返回给模型，让它重新生成参数 |

第三层的处理方式是实践中的精髓：**把校验失败的原因作为 tool 消息发回给模型**，例如 `"Error: date must be ISO 8601 format, got '明天'"`。模型在下一轮会自己修正参数重新调用。这种“错误反馈自愈”机制比直接抛异常终止健壮得多，也是后续 Agent 系统容错设计的基础模式。

工具库方面，生产中常用 `pydantic`（Python）定义参数模型，自动完成结构层校验和错误信息生成：

```python
from pydantic import BaseModel, Field

class WeatherArgs(BaseModel):
    city: str = Field(description="城市名")
    date: str = Field(description="ISO 8601 日期，如 2025-01-15")

    # pydantic 校验失败 → 拿到结构化错误信息 → 回传给模型
```

---

## 三、实践练习：实现 get_weather 的工具调用

目标：不借助 LangChain 等框架，直接用 OpenAI SDK（或兼容 API）实现“模型决定是否调用工具”的完整半轮流程。**刻意不实现 Agent 循环**——本周只解决“LLM 如何提出行动”。

```python
# tool_call.py
import json
from openai import OpenAI

client = OpenAI()

# 1. 工具定义：这段 JSON 是写给模型看的"接口文档"
TOOLS = [{
    "type": "function",
    "function": {
        "name": "get_weather",
        "description": "查询指定城市指定日期的实时天气，"
                       "仅当用户询问天气时调用",
        "parameters": {
            "type": "object",
            "properties": {
                "city": {"type": "string",
                         "description": "城市名，拼音或英文"},
                "date": {"type": "string",
                         "description": "ISO 8601 日期"}
            },
            "required": ["city"]
        }
    }
}]

# 2. 真正的执行函数：模型永远碰不到它
def get_weather(city: str, date: str = "today") -> dict:
    # 真实场景这里调天气 API；练习中返回 mock 数据
    return {"city": city, "date": date,
            "temp_c": 8, "rain_prob": 0.2}

def run(user_input: str):
    messages = [{"role": "user", "content": user_input}]
    resp = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=messages,
        tools=TOOLS,
    )
    msg = resp.choices[0].message

    # 3. 模型的行动提议在这里；没有 tool_calls 就是普通回答
    if not msg.tool_calls:
        print("模型直接回答:", msg.content)
        return

    for tc in msg.tool_calls:
        # 4. 三层校验的第一步：语法层
        try:
            args = json.loads(tc.function.arguments)
        except json.JSONDecodeError as e:
            print("参数解析失败:", e)
            continue

        # 5. 执行（这里应加结构层/语义层校验，留作练习）
        result = get_weather(**args)

        print(f"模型请求调用 {tc.function.name}({args})")
        print(f"执行结果: {result}")
        print("→ 下一步：把结果作为 tool 消息回填，"
              "再调用一次 LLM 生成最终回答（下周实现）")

if __name__ == "__main__":
    run("上海明天适合穿什么？")   # 应触发 tool call
    run("你好，介绍一下你自己")    # 应直接回答，不调用
```

**观察重点**：跑完这两条输入，对照输出确认两件事——模型对“是否调用”的判断是语义驱动的；`arguments` 确实是字符串。这两点亲手验证过，比读十篇文章记得牢。

---

## 四、思考题

1. 如果把 `get_weather` 的 description 改成“查询任何信息”，模型在用户问“北京有多少人口”时会怎样？动手试试，理解 description 对调用决策的影响。
2. 模型返回了 `date: "明天"` 而不是 ISO 格式。请设计一个错误消息，回传给模型让它自行修正——而不是在你的代码里写正则修复。为什么后者长期来看是死路？
3. 如果一个请求里模型同时返回了两个 `tool_calls`（比如“对比北京和上海的天气”），你的执行层应该串行还是并行处理？各自的风险是什么？
4. Structured Output 能保证 JSON 语法正确，但保证不了语义正确。请举出一个语法合法但业务上必然出错的参数例子。

---

## 五、与 Agent Engineering 的关联

本篇的内容在实际 Agent 系统中的位置可以用一句话概括：**Tool Calling 是 Agent 的手脚神经接口，本篇解决的是神经信号如何编码**。

- **Agent Loop 的原子操作**：Agent = “LLM 决策 + 工具执行”的循环。本篇实现了循环体的单次执行，下周加上循环控制和终止条件，就是一个最小 Agent。
- **可靠性的第一道防线**：生产 Agent 事故的大头不在模型“想不想调用”，而在参数校验缺失导致脏数据进工具层。本篇的三层校验模式会贯穿整个路线。
- **后续主题的地基**：MCP（Model Context Protocol）本质是把工具定义和调用标准化成协议；多 Agent 系统中 Agent 之间的“调用”，底层同样是结构化请求传递。今天理解的 JSON Schema 设计，决定了未来工具生态的可用性。

判断明确地说：**跳过这一节的原理直接上 Agent 框架，是新手 Agent 开发者最常见的弯路**。框架会在你不理解的地方替你做决定，而那些决定恰恰是出问题时你唯一能改的地方。

---

## 六、FAQ

**Q1：Tool Calling 是模型真的执行了函数吗？**
不是。模型只输出一段声明“我想调用 X 工具，参数是这些”的结构化文本。解析、校验、执行全部发生在你的代码里。记住“LLM 只提议，系统才执行”这十个字。

**Q2：Structured Output 和 Tool Calling 是什么关系？**
Structured Output 是手段，Tool Calling 是应用。Tool Calling 的 `arguments` 本质上就是一次 Structured Output——只不过输出结构由工具的 JSON Schema 决定，且约定输出到 `tool_calls` 字段。

**Q3：模型怎么“决定”要不要调用工具？**
基于语义匹配的条件生成：上下文里有工具定义，当用户消息与某个工具的 description 语义相关时，模型生成调用请求的概率大幅上升；否则正常生成文本回复。所以 description 的质量直接决定调用决策的质量。

**Q4：模型填错了参数怎么办？**
分层处理：语法错误直接重试；结构错误用 pydantic 等工具校验并捕获；语义错误最有效的做法是把错误信息作为 tool 消息回传给模型，让它自我修正，而不是在业务代码里硬编码修复逻辑。

**Q5：学会了 Tool Calling 就能做 Agent 了吗？**
差一步。Tool Calling 解决了“单次行动提议”，Agent 还需要：多轮循环控制、终止条件、错误恢复、记忆管理。这些是 M1 第 2 周及以后的内容，但今天的四步闭环是它们的公共原子操作。

---

## 七、参考资料

> 注：本篇写作时的检索��录中未沉淀出可直接引用的具体链接，以下为学习时建议检索验证的关键词与权威来源方向，请以官方文档为准。

1. OpenAI 官方文档 — *Function Calling*（`platform.openai.com/docs/guides/function-calling`）：tool_calls 数据结构、并行调用的最权威定义。
2. OpenAI 官方文档 — *Structured Outputs*（`platform.openai.com/docs/guides/structured-outputs`）：受限解码与 JSON Schema 的原生支持方式。
3. Anthropic 官方文档 — *Tool Use*（`docs.anthropic.com`）：对比不同厂商的 schema 设计差异，加深“schema 是给模型看的 prompt”这一理解。
4. JSON Schema 官方规范（`json-schema.org`）：`type`、`enum`、`required` 等字段的严格语义。
5. Pydantic 官方文档（`docs.pydantic.dev`）：生产环境参数校验的标准工具，重点看 Field 和 ValidationError。
6. 检索关键词建议：`LLM function calling explained`、`tool calling JSON schema validation`、`how LLM decides to call tools`——前两页结果中官方博客和框架文档（LangChain、LlamaIndex 的 Tool Calling 章节）可信度最高。

---

## 📋 本日知识点清单

- [ ] 从 Natural Language 到 Structured Output 的转换
- [ ] Tool Calling 的 JSON Schema
- [ ] Tool Call 的完整流程
- [ ] LLM 如何提出行动请求
- [ ] Tool Call 的参数校验
- [ ] 不实现完整 Agent，只解决"LLM 如何提出行动"

## 📝 实践练习

实现一个简单 Tool（如 get_weather），让模型决定是否调用，输出 tool_call.py。

---

*本文是「AI Agent 工程师」6 个月学习计划的一部分。学习路线：LLM → Inference → Runtime → Harness → Memory → Environment → Evaluation → Production。目标：Agent / AI Systems Engineer。*
