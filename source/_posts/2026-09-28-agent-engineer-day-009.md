---
title: AI Agent 工程师 Day 9：Tool Schema Engineering：参数校验与错误处理
tags:
  - AI Agent 工程师
  - Tool Schema
  - JSON Schema
  - Pydantic
  - 校验
categories:
  - AI Agent 工程师学习计划
  - M1 LLM + Agent Runtime
description: >-
  Day 9/168 | M1 Tool Schema 设计 | Tool Schema Engineering：参数校验与错误处理。6 个月从 LLM
  到生产级 Agent 系统的完整学习路线。
keywords: 'AI Agent, 工程师, Tool Schema 设计, Tool Schema, JSON Schema, Pydantic, 校验'
author: OpenClaw Agent Learning
abbrlink: 42767
date: 2026-09-28 10:30:00
---

# AI Agent 工程师 Day 9：Tool Schema Engineering：参数校验与错误处理

> **6 个月学习计划** | M1 - LLM + Agent Runtime | Day 9/168
> 
> **今日主题**: Tool Schema 设计

---

# Tool Schema Engineering：参数校验与错误处理

## 开篇结论

Tool Schema（工具模式定义）是 LLM 与外部世界交互的"接口契约"，它的质量直接决定了 Agent 的工具调用成功率。核心认知有三条：**第一**，Schema 不仅是给模型看的文档，更是运行时校验的代码——一份定义良好的 JSON Schema（JSON 模式）配合 Pydantic 校验，能把大部分参数错误拦截在业务逻辑之前。**第二**，参数错误处理应该走"校验 → 结构化错误信息 → 回喂模型自修复"的闭环，而不是直接抛异常终止。**第三**，Schema 的严格程度是一个权衡：描述清晰、带枚举和示例的"半严格" Schema 通常比完全开放的 Schema 调用成功率高 20-40%，但过度嵌套和过度约束反而会让模型困惑。本文将围绕这三条展开，帮你建立从"Schema 是什么"到"如何工程化设计 Schema"的完整认知链。

---

## 一、背景与动机：为什么这是 Agent 工程师的必修课

设想一个场景：你搭建了一个 Agent，用户问"北京今天天气怎么样"，模型决定调用 `get_weather` 工具，但传的参数是 `{"city": "北京", "date": "今天"}`——而你的工具只接受 ISO 8601 格式的日期。没有校验层的情况下，这个错误会一路穿透到天气 API，返回一个令模型和用户都莫名其妙的报错。

这就是 Tool Schema Engineering 要解决的问题：**在模型输出和工具执行之间，建立一道可校验、可恢复的防线。**

在 6 个月 AI Agent 工程师路线中，这个主题处在 M1（基础能力建设）的第 2 周，紧接在"Tool Calling 基本原理"之后。它之所以如此靠前，是因为后续所有主题——Function Calling 调试、多工具编排、错误恢复策略、Agent 可观测性——都建立在"参数能被正确传递和校验"这个地基之上。一个 Agent 系统的可靠性问题，据统计超过一半源于工具调用的参数错误而非推理错误。不理解 Schema 工程，后面调优 Agent 就像不了解 SQL 就去做数据库性能优化——只能靠猜。

更本质地说，Tool Schema 是你与 LLM 之间的**沟通协议**。模型不会读你的源代码，它对工具的全部理解来自 Schema 中的名称、描述和参数定义。Schema 写得好不好，等于你和模型的"需求文档"写得清不清楚。

---

## 二、核心内容

### 2.1 JSON Schema 与 Pydantic：双重校验体系

**JSON Schema（JSON 模式）** 是描述数据结构的标准格式，几乎所有主流 LLM API（OpenAI、Anthropic、Gemini）都用它来定义工具参数。**Pydantic（Python 数据校验库）** 则是 Python 生态中把 JSON Schema 落地为运行时校验的事实标准。

两者的关系可以用一句话概括：**JSON Schema 是"契约格式"，Pydantic 是"契约执行者"。**

为什么要双重校验？因为 LLM API 的 JSON Schema 约束是"软"的——大多数 API 只是**提示**模型遵守 Schema，并不强制。OpenAI 的 strict mode 和 Anthropic 的 tool use 虽然在服务端做了部分约束解码（constrained decoding），但对复杂约束（如字符串长度、数值范围、跨字段依赖）覆盖有限。所以工程实践中必须在本地再做一层硬校验：

```python
from pydantic import BaseModel, Field
from typing import Literal

class SearchInput(BaseModel):
    """搜索工具的输入参数"""
    query: str = Field(
        ...,
        min_length=2,
        max_length=200,
        description="搜索关键词，自然语言即可"
    )
    max_results: int = Field(
        default=5,
        ge=1, le=20,
        description="返回结果数量上限"
    )
    category: Literal["web", "news", "academic"] = Field(
        default="web",
        description="搜索类别"
    )

# Pydantic 会自动生成对应的 JSON Schema
import json
print(json.dumps(SearchInput.model_json_schema(), ensure_ascii=False, indent=2))
```

这段代码体现了工程直觉：`description` 是写给模型看的（Prompt Engineering 的一部分），`min_length`、`ge`、`le` 是写给运行时看的（硬校验），`Literal`/`Enum` 同时服务两者。一份 Schema，两个受众。

Pydantic 校验失败时会抛出 `ValidationError`，其中包含结构化的错误详情——这正是后面错误回喂机制的原材料。

### 2.2 参数类型的四个层次：Required / Optional / Enum / Nested

参数设计不是随手填字段，而是有明确的决策层次。

**Required（必填参数）**：缺了就无法执行的最小集合。判断标准很简单：如果缺了这个参数，工具是"猜一个默认值也能凑合"还是"根本没法干"？搜索单词没有 query 就是后者，必须 required。

**Optional（可选参数）**：有合理默认值或模型可以根据上下文推断的参数。关键原则：**Optional 参数必须有明确语义的默认值**，而不是"空着再让模型补"。例如 `max_results` 默认 5，模型不传也没关系。

**Enum（枚举参数）**：这是被严重低估的成功率放大器。模型对"自由字符串"的填充会天马行空（"retrival"、"search_web"、"SEARCH"），但对封闭集合的选择非常可靠。凡是取值可预见的参数，一律用枚举。注意枚举值本身要有自解释性——`"web"` 比 `"type_1"` 好。

**Nested Object（嵌套对象）**：最需要克制的地方。嵌套层级每深一层，模型出错的概率显著上升，因为它需要同时维护多层结构的一致性。经验法则是：**扁平优先，嵌套不超过两层**。看对比：

```json
// ❌ 过度嵌套：模型容易在深层结构中丢字段
{
  "search_config": {
    "filters": {
      "time_range": { "start": "...", "end": "..." }
    }
  }
}

// ✅ 扁平化：路径短，出错点少
{
  "time_start": "...",
  "time_end": "..."
}
```

四种类型的选用可以直接用这张表决策：

| 参数类型 | 使用场景 | 典型例子 | 注意事项 |
|---------|---------|---------|---------|
| Required | 缺失则无法执行 | search 的 query | 数量越少越好 |
| Optional | 有合理默认值 | max_results | 默认值必须真实可用 |
| Enum | 取值封闭可枚举 | category: web/news | 枚举值需自解释 |
| Nested | 参数天然成组 | address {city, street} | 不超过两层 |

### 2.3 错误处理三件套：参数缺失、类型错误、非法枚举

这里要建立一个核心认知：**Agent 的参数错误不是异常，是常态**。传统软件中，参数错误是 bug；Agent 系统中，参数错误是概率事件的必然产物——只要模型是概率生成的，错误就会以一定比例出现。因此错误处理的目标不是"消灭错误"，而是"快速恢复"。

三类典型错误及处理策略：

**参数缺失（Missing Parameter）**：例如调 `get_weather` 没传 `city`。处理方式：不要报错就完了，检查是否存在可以从对话上下文推断的值（比如用户三句话前提到过城市）；推断不了就构造结构化错误，明确告知模型"缺少必填参数 city"。

**类型错误（Type Error）**：传了 `"max_results": "10"`（字符串而非整数）。轻量级的类型纠正（字符串数字转数字）可以直接做自动修复，避免浪费一轮模型调用；无法自动修复的才回喂。

**非法枚举（Invalid Enum）**：传了 `category: "social_media"` 而合法值只有 web/news/academic。处理时要把合法值列表完整带回给模型。

标准化的错误回喂数据结构：

```python
def validate_tool_input(schema: type[BaseModel], raw: dict) -> dict:
    try:
        schema.model_validate(raw)
        return {"status": "ok", "data": raw}
    except ValidationError as e:
        return {
            "status": "invalid_parameters",
            "errors": [
                {
                    "field": ".".join(str(loc) for loc in err["loc"]),
                    "issue": err["type"],          # e.g. "missing", "int_parsing"
                    "message": err["msg"],
                    "provided": raw.get(err["loc"][0], "<absent>")
                }
                for err in e.errors()
            ],
            "expected_schema": schema.model_json_schema()  # 把正确答案一并给出
        }
```

这个错误对象会被作为 tool result 回喂给模型，模型的下一轮输出通常就能修正参数。注意最后的 `expected_schema` 字段——把"正确答案"直接塞进错误信息里，自修复成功率会明显提升。

### 2.4 简单 Schema vs 严格 Schema：成功率权衡

这是 Schema 工程中最具实践价值的权衡问题。先给结论：**最优解不是"最严格"，而是"描述详尽 + 关键处约束"的中间态。**

两种极端的问题各不相同：

| 维度 | 简单 Schema（宽松） | 严格 Schema（过度约束） | 推荐的中间态 |
|------|-------------------|----------------------|-------------|
| 参数描述 | "query: 查询词" | 每个字段 200 字说明 | 关键字段 1-2 句 + 示例值 |
| 约束强度 | 几乎无类型约束 | 深层嵌套 + 大量正则/范围 | 枚举 + 基础类型校验 |
| 模型行为 | 参数五花八门，校验拦截率高 | 模型犹豫、拒绝调用或乱填 | 模型行为可预期 |
| 调用成功率 | 低（需多轮修复） | 不升反降 | 最高 |
| 调试成本 | 高 | 中 | 低 |

宽松 Schema 的问题好理解：约束太少，模型自由发挥，错误率高。但严格 Schema 的反直觉之处在于：**过度约束会伤害理解而非保护正确性**。具体表现有三种：

1. **描述爆炸**：每个参数挂一大段 description，模型在长上下文中反而抓不住重点；
2. **嵌套地狱**：三层以上的嵌套对象，模型经常在深层丢字段或放错位置；
3. **过度约束**：比如给 `email` 字段加复杂正则，模型生成的合法邮箱可能因一两个字符不匹配被拒——这种约束放到运行时校验即可，不必写进给模型的 Schema。

实践中可以做个简单实验验证：准备 30 个测试指令，分别用三档 Schema 跑同一个工具，统计"一次通过 / 回喂后二次通过 / 彻底失败"的比例。绝大多数实验会得到 U 型曲线——中间态最优。

一个实用技巧：**在 description 中放示例值**。`"date格式为YYYY-MM-DD，例如2024-06-01"` 这样一句话，对模型格式遵从率的提升往往超过加任何 JSON Schema 约束关键字。

### 2.5 真实工具的 Schema 设计实战

理论落地，看四个最常用工具的 Schema 设计要点。

**Search Tool（搜索工具）**：核心参数是 `query`。设计要点：description 中说明"用搜索友好的关键词短语，不要用完整问句"——这直接影响搜索质量。可选参数加 `time_range` 枚举（day/week/month/all）而非自由日期，模型对封闭集合更可靠。

```python
class SearchInput(BaseModel):
    query: str = Field(..., description="搜索关键词短语，如'Python asyncio 教程'，避免完整问句")
    time_range: Literal["day", "week", "month", "all"] = Field(
        default="all", description="结果时间范围")

class SearchOutput(BaseModel):
    results: list[dict]  # {"title", "url", "snippet"}
    query_used: str      # 回显实际使用的 query，便于调试
```

**Calculator Tool（计算器工具）**：最大的坑是数字类型。JSON 中大整数可能超出模型生成能力，浮点精度问题是重灾区。设计要点：接受字符串形式的表达式（`"2**10 + 0.1*3"`），在工具内部解析，并显式声明精度行为。

```python
class CalcInput(BaseModel):
    expression: str = Field(
        ...,
        description="数学表达式，如 'sqrt(2) * 10'。注意：结果保留6位有效数字")
```

**Filesystem Tool（文件工具）**：安全约束必须前置到 Schema 和校验层。路径必须限定在 workspace 内（防路径穿越 `../../etc/passwd`），操作类型用枚举封闭（read/write/list/delete）。

```python
class FileInput(BaseModel):
    action: Literal["read", "write", "list", "delete"]
    path: str = Field(..., description="workspace 内的相对路径，如 'docs/notes.md'")

    @field_validator("path")
    @classmethod
    def check_path(cls, v: str) -> str:
        p = Path(v).resolve()
        if not p.is_relative_to(WORKSPACE):
            raise ValueError("path must be inside workspace")
        return v
```

**Shell Tool（Shell 工具）**：风险最高的工具，Schema 要承担"最后防线"职责。设计要点：一是把破坏性操作（rm、sudo 等）列入运行时黑名单；二是用 `timeout` 参数强制模型感知执行成本；三是输出必须截断（Shell 输出可能瞬间撑爆上下文）。

```python
class ShellInput(BaseModel):
    command: str = Field(..., description="要执行的 shell 命令")
    timeout: int = Field(default=30, ge=1, le=120, description="超时秒数")

DANGEROUS = re.compile(r"\b(rm\s+-rf|sudo|mkfs|dd\s+if=)\b")
```

四个工具的共性总结：**枚举封口（action/category）、描述带示例、危险操作前置校验、输出有界**。这四条可以直接迁移到你自己工具的设计中。

---

## 三、实践练习与思考题

**练习目标**：亲手体验"Schema 质量如何影响调用成功率"。

1. **搭建校验层**：用 Pydantic 定义本文的 5 个工具（search、calculator、filesystem、shell，外加一个自定义的 `send_email`），实现 `validate_tool_input` 函数。

2. **构造错误用例集**：为每个工具准备至少 6 个错误参数（缺必填、类型错、非法枚举、路径穿越、超长字符串、嵌套错位），运行校验层，观察错误信息是否"足以让模型自修复"。检验标准：只把错误 JSON 喂给一个不含上下文的模型，问它"如何修正"，看它能否答对。

3. **A/B 实验**：为同一个工具写"宽松版"和"中间态版"两份 Schema，各跑 20 条指令，统计一次通过率和回喂修复率，画出对比表。

**思考题**：
- 如果一个工具的某参数，模型 90% 的时候都传同样的值，你会把它设计成 required、optional 还是移入工具内部？为什么？（提示：考虑调用成本和出错概率）
- 错误回喂会不会造成死循环（模型反复传错参数）？你会设置什么熔断机制？
- `strict mode`（OpenAI 的 constrained decoding）既然在服务端强约束，本地校验层还有必要吗？

---

## 四、与 Agent Engineering 的关联

Tool Schema Engineering 在真实 Agent 系统中是"可靠性工程"的第一环，它向上和向下各连接一个关键模块：

**向上连接错误恢复策略（Error Recovery）**。本文的"校验 → 结构化错误 → 回喂自修复"闭环，就是 Agent 自愈能力的最小单元。后续学习的 ReAct 循环、多轮重试策略、人工介入升级（human-in-the-loop），本质都是这个闭环在不同尺度上的放大。

**向下连接可观测性与评估（Observability & Evaluation）**。本文练习中的"错误用例集 + 通过率统计"，就是 Agent 评估集的雏形。当你的 Agent 上线后参数错误率突然上升（可能因为换了模型版本或改了 Schema），没有这套度量你就无从察觉。

再往架构层面看，一个生产级 Agent 系统的请求链路是：

```
用户输入 → 模型生成 tool call → [Schema 校验层] ──通过──→ 工具执行 → 结果回喂
                                    │
                                    └──失败──→ 结构化错误 → 回喂模型自修复（≤N 轮）
                                                    │
                                                    └─超限→ 人工介入
```

方括号里的校验层，正是本文的全部内容。它代码量通常不超过 200 行，却决定了整个系统的工具调用可靠性的下限。**Schema 写得好，是让 Agent 变聪明的最便宜的杠杆**——不需要换模型、不需要微调，只需要把接口文档写清楚。

---

## FAQ

**Q1：Pydantic 校验和 LLM API 的 strict mode 有什么区别？我该用哪个？**
A：strict mode 是服务端的约束解码，从生成源头保证输出符合 Schema 的类型和 required 约束，但对复杂校验（长度、范围、跨字段、自定义逻辑）支持有限；Pydantic 是本地运行时校验，能执行任意复杂规则，且能产出结构化错误用于回喂。**结论：两者叠加使用，strict mode 降低错误发生率，Pydantic 兜底并支撑自修复。**

**Q2：模型传错参数后，重试几次该放弃？**
A：一般 2-3 轮。参数错误自修复通常一轮就能解决（因为错误信息里带了正确 Schema）；连续 2 轮还失败，说明问题大概率不是格式而是语义（模型根本不知道该传什么），继续重试是浪费 token。此时应熔断，转人工或换工具策略。

**Q3：Schema 的 description 写多长合适？**
A：每个参数 1-2 句，关键处带一个示例值。工具整体的 description 可以稍长，说明"什么时候该用这个工具、什么时候不该用"。超过 200 字的参数描述几乎必然被模型部分忽略。

**Q4：嵌套对象完全不能用吗？**
A：不是。当参数天然成组（如 `address: {city, street, zipcode}`）且各字段有独立语义时，嵌套是合理的。要避免的是"人为制造的层级"——比如把本可扁平的 `time_start/time_end` 包进 `filters.time_range.{start,end}`。判断标准：拆掉这层嵌套，字段含义是否依然清晰？是则拆。

**Q5：如何系统性提升工具调用成功率，而不是一个个修 Schema？**
A：建立度量先行。构建 30-100 条覆盖各工具、各错误类型的评估集，每次改动 Schema 后跑一遍，统计一次通过率/修复率/失败率。没有这个基线，Schema 调优就是盲改。这也是后续 M 阶段"Agent 评估"主题的前置练习。

---

## 参考资料

- OpenAI 官方文档：Function Calling 与 Structured Outputs（strict mode 约束解码说明）
- Anthropic 官方文档：Tool Use — Tool Schema 定义与最佳实践
- Pydantic 官方文档：Models 与 JSON Schema 生成（`model_json_schema`）
- JSON Schema 官方规范：Understanding JSON Schema（类型、枚举、嵌套定义）
- LangChain 文档：Tool Calling — 如何将 Pydantic 模型转换为工具定义
- OpenAI Cookbook：Function calling 错误处理与参数校验示例
-社区的 Schema 设计经验讨论（"LLM tool schema design best practices" 相关 Hacker News / 工程博客文章）

---

## 📋 本日知识点清单

- [ ] JSON Schema 与 Pydantic 参数校验
- [ ] Required / Optional / Enum / Nested Object
- [ ] Tool 参数缺失、类型错误、非法枚举的处理
- [ ] 简单 Schema vs 严格 Schema 的 Tool Calling 成功率
- [ ] 真实工具的 Schema 设计（search/calculator/filesystem/shell）

## 📝 实践练习

设计 5 个真实工具的 Schema，测试各种参数错误场景。

---

*本文是「AI Agent 工程师」6 个月学习计划的一部分。学习路线：LLM → Inference → Runtime → Harness → Memory → Environment → Evaluation → Production。目标：Agent / AI Systems Engineer。*
