---
title: "AI Agent 工程师 Day 41：Model Gateway：多模型的统一接口"
date: 2026-10-30 10:30:00
tags:
  - AI Agent 工程师
  - Model Gateway
  - 多模型
  - Runtime
  - Agent
categories:
  - AI Agent 工程师学习计划
  - M2 Agent Harness + Tool + Environment
description: "Day 41/168 | M2 Model Gateway 设计 | Model Gateway：多模型的统一接口。6 个月从 LLM 到生产级 Agent 系统的完整学习路线。"
keywords: "AI Agent, 工程师, Model Gateway 设计, Model Gateway, 多模型, Runtime, Agent"
author: OpenClaw Agent Learning
---

# AI Agent 工程师 Day 41：Model Gateway：多模型的统一接口

> **6 个月学习计划** | M2 - Agent Harness + Tool + Environment | Day 41/168
> 
> **今日主题**: Model Gateway 设计

---

# Model Gateway：多模型的统一接口

**核心结论（先给答案）**：Model Gateway（模型网关）是 Agent 系统中位于 Agent 逻辑与模型 API 之间的一层抽象基础设施。它的核心价值不是“能调多个模型”——直接调 SDK 也能做到——而是**把“模型差异”从 Agent 代码中剥离**，让 Agent 只面向一个稳定的 `generate()` 接口编程。没有这层抽象，每换一次模型就要改 Agent 代码；有了它，切换 OpenAI、DeepSeek、Kimi 或本地模型变成改一行配置。它是 Agent Harness（运行时框架）的第一块基石，也是后续实现降级、路由、观测、成本控制的前提。本文讲清楚为什么需要它、接口怎么设计、适配层怎么写，并带一个可运行的最小实现。

---

## 一、背景与动机：为什么第 41 天学这个

在 6 个月 AI Agent 工程师路线中，你到这一天的状态是：已经理解了 Agent 的基本循环，也能直接调一两个模型的 API。接下来 M2 阶段的目标是**从“能跑通”走向“能工程化”**，而 Model Gateway 正是工程化的第一站。

直觉上的因果链是这样的：

1. Agent 的核心循环是 `generate → parse tool calls → execute → append → generate`，其中“生成”这一步是唯一与具体模型厂商耦合的环节。
2. 生产环境的现实是：**没有任何 Agent 系统只绑定一个模型**。原因是多重的——成本（DeepSeek 比 GPT-4 便宜一个量级）、能力（复杂推理用强模型、简单格式化用小模型）、合规（部分数据只能走本地模型）、可用性（任何一家都会宕机）。
3. 如果模型调用散落在 Agent 代码各处，以上任何一个需求变化都会变成一场重构。

所以 Model Gateway 的本质是**依赖倒置（Dependency Inversion）**：Agent 依赖抽象接口，具体模型是实现细节。这也是为什么它在 Harness 基础设施中最先出现——后续的重试、限流、流式、缓存、可观测性，全部挂在这一层上。

```
没有 Gateway：                       有 Gateway：

┌─────────┐                          ┌─────────┐
│  Agent  │──openai sdk──> OpenAI    │  Agent  │
└─────────┘                          └────┬────┘
                                      │ generate()（唯一依赖）
┌─────────┐                     ┌─────▼──────────────┐
│  Agent  │──deepseek──> DeepSeek│   Model Gateway    │──> OpenAI
└─────────┘                     │  (适配/路由/降级)   │──> DeepSeek
                                └────────────────────┘──> Kimi
                                                        └──> Local
```

---

## 二、核心知识点

### 2.1 统一架构：Agent → Model Gateway → 多模型

三段式架构的每一环都有明确职责：

- **Agent**：负责业务逻辑——决定何时调模型、如何解析工具调用、如何管理对话历史。它不应该知道也不需要知道对方是 GPT-4o 还是 Qwen。
- **Model Gateway**：负责协议翻译和策略执行——把统一请求翻译成各家 API 格式，同时集中处理重试、超时、流式、日志、成本统计。
- **模型 Provider**：OpenAI、DeepSeek、Kimi（月之暗面）、本地模型等，各家 API 各不相同。

一个容易被忽略的细节是：**Kimi 和 DeepSeek 都提供 OpenAI 兼容端点**，这大幅降低了适配成本。但“OpenAI 兼容”是部分兼容——工具调用格式、reasoning 字段、流式 chunk 结构仍存在差异，所以不能只写一个 `base_url` 就高枕无忧，适配层依然必要。

架构上还有一个关键判断：Gateway 应该是**进程内的库**而不是独立的网关服务（至少在当前阶段是）。大厂会做独立的 LLM Gateway 服务（如 LiteLLM Proxy），但对单 Agent 应用而言，进程内模块足够，且省去了部署和网络开销。

### 2.2 统一接口设计：`model.generate(messages, tools, ...)`

这是整个 Gateway 的 API 面，设计好坏决定后续扩展难度。核心签名：

```python
class ModelGateway(ABC):
    @abstractmethod
    def generate(
        self,
        messages: list[Message],
        tools: list[ToolSpec] | None = None,
        model: str = "default",
        temperature: float = 0.7,
        max_tokens: int | None = None,
        stream: bool = False,
        **kwargs,
    ) -> ModelResponse | Iterator[ModelChunk]:
        ...
```

设计时有几条经验法则：

**规则 1：Message 用自定义数据结构，不要直接用 dict。** 定义 `Message(role, content, tool_calls, tool_call_id)` 的 dataclass，而不是裸 `{"role": ..., "content": ...}`。原因：dict 没有校验，字段拼错要到运行时才发现；而 dataclass 让各家适配器的翻译逻辑可测试、可静态检查。

**规则 2：响应也要统一结构。** 返回 `ModelResponse(content, tool_calls, usage, finish_reason, raw)`，其中保留 `raw` 原始响应用于调试。特别是 `usage`（token 用量）必须统一归一化，否则成本统计无从谈起。

**规则 3：`**kwargs` 是逃生舱，不是设计。** 各家 API 总有独有的参数（如 OpenAI 的 `logprobs`），可以用 kwargs 透传，但高频参数必须显式声明——否则接口就失去了“统一”的意义。

**规则 4：同步与流式分开考虑。** `stream=True` 时返回迭代器还是单独的 `stream_generate()` 方法？建议显式分成两个方法，避免返回类型多态带来的调用方分支判断。

### 2.3 参数语义：model / temperature / max_tokens / tools / streaming

这五个参数看似简单，但每一家语义和约束不同，Gateway 必须做**语义级适配**而非仅做字段名翻译：

| 参数 | 语义 | 各家差异点 | Gateway 职责 |
|---|---|---|---|
| `model` | 模型标识 | 命名体系完全不同（`gpt-4o` vs `deepseek-chat` vs `moonshot-v1-8k`） | 提供模型别名/注册表，支持逻辑名映射物理名 |
| `temperature` | 采样随机性 | 取值范围大体一致，但不同模型对同一温度行为敏感度不同 | 允许按模型设置默认值；推理模型（如 DeepSeek-R1）不支持自定义温度时要拦截或忽略 |
| `max_tokens` | 输出上限 | OpenAI 新版改为 `max_completion_tokens`，含 reasoning token 计数 | 字段翻译 + 按模型取值范围钳制 |
| `tools` | 工具定义 | JSON Schema 格式大体统一，但支持程度差异大（部分模型不支持 parallel tool calls） | 校验 Schema；对不支持 tools 的模型给出明确报错而非静默失败 |
| `stream` | 流式输出 | chunk 结构、finish_reason 出现位置不一致 | 统一 chunk 协议，归一化为 `content_delta / tool_call_delta / done` 三类事件 |

这里建立工程直觉的关键是：**适配层处理的不只是“字段名不同”，更是“约束和能力不同”**。比如 `max_tokens` 翻译成 `max_completion_tokens` 是字段翻译；而“这个模型不支持 temperature=0 以下”就是能力裁剪，需要 Gateway 有明确的报错或降级策略。

### 2.4 不同模型 API 的适配实现

适配器模式的典型结构：定义 `ProviderAdapter` 抽象类，每家一个实现，Gateway 根据 `model` 参数路由到对应适配器。

```python
class ProviderAdapter(ABC):
    name: str

    @abstractmethod
    def translate_request(self, req: UnifiedRequest) -> dict: ...

    @abstractmethod
    def translate_response(self, raw: dict) -> ModelResponse: ...

    @abstractmethod
    def capabilities(self) -> ModelCapabilities: ...


class OpenAIAdapter(ProviderAdapter):
    name = "openai"

    def translate_request(self, req):
        body = {
            "model": MODEL_MAP[req.model],
            "messages": [asdict(m) for m in req.messages],
            "temperature": req.temperature,
        }
        if req.max_tokens:
            # 新版 API 字段变化
            body["max_completion_tokens"] = req.max_tokens
        if req.tools:
            body["tools"] = [{
                "type": "function",
                "function": {"name": t.name, "description": t.description,
                             "parameters": t.parameters}
            } for t in req.tools]
        return body

    def translate_response(self, raw):
        choice = raw["choices"][0]["message"]
        return ModelResponse(
            content=choice.get("content"),
            tool_calls=[ToolCall(id=c["id"], name=c["function"]["name"],
                                 arguments=c["function"]["arguments"])
                        for c in choice.get("tool_calls", [])],
            usage=Usage(prompt_tokens=raw["usage"]["prompt_tokens"],
                        completion_tokens=raw["usage"]["completion_tokens"]),
            finish_reason=raw["choices"][0]["finish_reason"],
            raw=raw,
        )


class DeepSeekAdapter(OpenAIAdapter):
    """DeepSeek 兼容 OpenAI 协议，仅覆写差异点"""
    name = "deepseek"
    BASE_URL = "https://api.deepseek.com/v1"
    # 复用父类的翻译逻辑，只在 model 映射和能力声明上差异化
```

注意 DeepSeek 适配器**继承 OpenAI 适配器只覆写差异**——这是“OpenAI 兼容端点”的正确利用方式。但要在 `capabilities()` 中如实声明差异（比如 deepseek-reasoner 不支持自定义 temperature），让 Gateway 能在上游拦截不合法的请求。

### 2.5 Model Gateway 作为 Harness 基础设施

这是本课最有战略价值的一点。Agent Harness（Agent 运行时框架）指承载 Agent 运行的全套基础设施：模型访问、工具执行、状态管理、观测、安全控制。Model Gateway 在其中的角色是**唯一的模型出入口**。

这个“唯一出入口”的架构地位，让它天然成为横切能力的挂载点：

| 横切能力 | 为什么挂在 Gateway | 典型实现 |
|---|---|---|
| 重试与降级 | 模型 API 是最容易失败的依赖（429/500/超时） | 指数退避重试 → 主模型失败自动切换备用模型 |
| 模型路由 | Agent 不关心具体用哪个模型 | 按 task 类型路由：推理任务→强模型，摘要任务→便宜模型 |
| 成本与配额 | 所有 token 用量都经过这里 | 统计每次调用的费用，超出预算拒绝或降级 |
| 可观测性 | 这是追踪 LLM 行为的最佳切面 | 记录完整 request/response，接入 Langfuse/OTel 做链路追踪 |
| 缓存 | 相同输入的确定性调用可复用 | 以 messages hash 为 key 缓存响应，temperature=0 时尤其有效 |
| 安全与合规 | 数据出境管控需要统一入口 | 按数据敏感级别强制路由到本地模型 |

因果链很清晰：**因为所有模型调用都经过这一层，所以在这一层做一次，全系统生效**。反过来，如果 Agent 直接调 SDK，以上每一项都要侵入业务代码。这就是“基础设施”与“工具函数”的区别——工具函数解决单点问题，基础设施通过控制一个必经之路解决一类问题。

```
┌─────────────────────────── Agent Harness ───────────────────────────┐
│                                                                      │
│  ┌────────┐   ┌─────────────────────────────────────────────────┐   │
│  │ Agent  │──▶│               Model Gateway                     │   │
│  └────────┘   │  ┌────────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌─────┐ │   │
│       ▲       │  │ Router │→│Retry │→│Cache │→│Logging│→│Cost │ │   │
│       │       │  └────────┘ └──────┘ └──────┘ └──────┘ └─────┘ │   │
│  ┌────────┐   └──────────────────┬──────────────────────────────┘   │
│  │ Tools │                      │                                   │
│  └────────┘        ┌─────────┬───┴──────┬──────────┐                │
│                    ▼         ▼          ▼          ▼                │
│               OpenAI    DeepSeek     Kimi      Local(Ollama)         │
└──────────────────────────────────────────────────────────────────────┘
```

---

## 三、实践练习：实现最小 Model Gateway

**目标**：支持 OpenAI + DeepSeek（或任意 OpenAI 兼容端点）两个 Provider，统一接口，支持 tools 和 temperature。

```python
from dataclasses import dataclass, asdict, field
from abc import ABC, abstractmethod
import os, httpx

@dataclass
class Message:
    role: str
    content: str | None = None
    tool_calls: list | None = None
    tool_call_id: str | None = None

@dataclass
class ToolSpec:
    name: str
    description: str
    parameters: dict

@dataclass
class ModelResponse:
    content: str | None
    tool_calls: list
    finish_reason: str
    usage: dict
    raw: dict

class ProviderAdapter(ABC):
    @abstractmethod
    def chat(self, messages, tools, model, temperature) -> ModelResponse: ...

class OpenAICompatAdapter(ProviderAdapter):
    def __init__(self, base_url, api_key):
        self.base_url, self.api_key = base_url, api_key

    def chat(self, messages, tools, model, temperature, max_tokens=2048):
        body = {
            "model": model,
            "messages": [m for m in self._msg(m) for m in messages][:0]
                        or [self._msg(m) for m in messages],
            "temperature": temperature,
            "max_tokens": max_tokens,
        }
        if tools:
            body["tools"] = [{"type": "function", "function": asdict(t)}
                             for t in tools]
        r = httpx.post(f"{self.base_url}/chat/completions",
                       json=body, timeout=60,
                       headers={"Authorization": f"Bearer {self.api_key}"})
        r.raise_for_status()
        raw = r.json()
        msg = raw["choices"][0]["message"]
        return ModelResponse(
            content=msg.get("content"),
            tool_calls=msg.get("tool_calls") or [],
            finish_reason=raw["choices"][0]["finish_reason"],
            usage=raw.get("usage", {}),
            raw=raw,
        )

    @staticmethod
    def _msg(m: Message) -> dict:
        d = {"role": m.role}
        if m.content is not None: d["content"] = m.content
        if m.tool_calls: d["tool_calls"] = m.tool_calls
        if m.tool_call_id: d["tool_call_id"] = m.tool_call_id
        return d

class ModelGateway:
    def __init__(self):
        self.adapters = {
            "openai": OpenAICompatAdapter(
                "https://api.openai.com/v1", os.environ["OPENAI_API_KEY"]),
            "deepseek": OpenAICompatAdapter(
                "https://api.deepseek.com/v1", os.environ["DEEPSEEK_API_KEY"]),
        }

    def generate(self, messages, tools=None,
                 model: str = "deepseek/deepseek-chat",
                 temperature: float = 0.7, **kw) -> ModelResponse:
        provider, model_id = model.split("/", 1)
        adapter = self.adapters[provider]  # 未知 provider 应抛明确错误
        try:
            return adapter.chat(messages, tools, model_id, temperature, **kw)
        except (httpx.TimeoutException, httpx.HTTPStatusError) as e:
            # 简易降级：主模型失败切备用
            fallback = "openai/gpt-4o-mini" if provider != "openai" \
                       else "deepseek/deepseek-chat"
            p, m = fallback.split("/", 1)
            return self.adapters[p].chat(messages, tools, m, temperature, **kw)
```

**验收标准**：
1. 同一个 Agent 循环代码，不改一行，仅改 `model` 参数即可在两个 Provider 间切换；
2. tool call 的调用格式在两个模型下完全一致；
3. 手动制造一次超时/429，观察降级是否生效。

**思考题**：
1. 如果 DeepSeek 某模型不支持 tools，Gateway 应该抛异常、静默去掉 tools、还是换一个支持的模型？三种方案的适用场景分别是什么？
2. `messages` 里的历史记录中，tool result 消息的格式各家差异在哪？为什么 `tool_call_id` 的配对很容易出错？
3. 为什么说“进程内 Gateway”最终会演化为独立网关服务？什么样的规模信号提示你该做这个迁移？

---

## 四、与 Agent Engineering 的关联

在真实 Agent 系统中，Model Gateway 的价值会在几个时刻凸显：

- **多模型编排（Model Routing）**：复杂 Agent 通常“一个任务走多模型”——规划用强模型、执行用快模型、总结用便宜模型。没有 Gateway，这种编排意味着三套调用代码；有 Gateway，就是三次 `generate()` 调用，只是参数不同。
- **容错与可用性（Fallback）**：生产事故的第一来源往往是上游 API 抖动。Gateway 的降级链路（主模型→备用模型→缓存结果）能把可用性从“取决于单一厂商”变成自己可控。
- **可观测性（Observability）**：Agent 调试的核心难点是“模型为什么这么回答”。Gateway 记录的���整请求/响应链路，是接入 Langfuse、OpenTelemetry 等 LLM 可观测工具的标准数据源。
- **成本工程（Cost Engineering）**：Agent 系统的 token 消耗容易失控（循环调用放大用量），Gateway 是唯一能做全局成本计量和预算熔断的位置。

一句话：**Agent 的智能上限由模型决定，工程下限由 Gateway 决定。**

---

## 五、FAQ

**Q1：直接用 LiteLLM / OpenRouter 这类现成方案，还需要自己写 Gateway 吗？**
A：学习阶段必须自己写一遍，否则不理解适配层的坑（字段差异、tool call 格式、流式协议）。生产中可以选用 LiteLLM（进程内库/代理）或 OpenRouter（托管路由），但理解原理后你才知道它们的能力边界和扩展点。

**Q2：“OpenAI 兼容端点”既然协议一样，为什么还要写适配器？**
A：兼容的是请求/响应的骨架结构，不兼容的是能力细节：工具调用的支持程度、reasoning 字段、流式 chunk 的 finish_reason 时机、参数取值范围等。适配器是把“协议兼容”升级为“语义兼容”。

**Q3：Gateway 和 RAG、向量数据库是什么关系？**
A：没有直接关系，但有间接关系：RAG 检索后的内容要注入 messages 再调模型，这条调用路径同样经过 Gateway，因此 RAG 场景的模型路由（如长上下文模型处理大检索结果）也由 Gateway 承载。

**Q4：流式输出（streaming）应该在哪一层统一？**
A：在 Gateway 统一。各家的 chunk 事件类型、tool call 增量拼装方式不同，Agent 不应该处理这些差异。Gateway 把原始 chunk 归一化为 `content_delta / tool_call_delta / done` 三类事件后再吐给上层。

**Q5：temperature 设多少合适？**
A：Agent 场景的经验值：需要可靠工具调用和格式输出时用 0~0.3，创意生成可用 0.7~1.0。注意部分推理模型（如 DeepSeek-R1）不接受自定义 temperature，Gateway 应在能力声明中拦截。

---

## 六、参考资料

- LiteLLM 官方文档 —— 统一 100+ LLM API 的开源实现，适配层设计的最佳参考：`https://docs.litellm.ai`
- OpenAI API Reference（Chat Completions / Tools）：`https://platform.openai.com/docs/api-reference`
- DeepSeek API 文档（OpenAI 兼容端点说明）：`https://api-docs.deepseek.com`
- Kimi / Moonshot API 文档：`https://platform.moonshot.cn/docs`
- OpenRouter 文档 —— 托管型多模型路由网关的产品形态参考：`https://openrouter.ai/docs`
- Portkey / Gateway 开源项目 —— AI Gateway 横切能力（缓存、降级、观测）的实现范例：`https://github.com/Portkey-AI/gateway`

---

## 📋 本日知识点清单

- [ ] Agent → Model Gateway → OpenAI/DeepSeek/Kimi/Local 的统一架构
- [ ] 统一接口：model.generate(messages, tools, ...) 的设计
- [ ] 支持 model/temperature/max_tokens/tools/streaming 参数
- [ ] 不同模型 API 的适配
- [ ] Model Gateway 作为 Harness 基础设施

## 📝 实践练习

实现 Model Gateway，统一接口支持至少 2 个模型提供商。

---

*本文是「AI Agent 工程师」6 个月学习计划的一部分。学习路线：LLM → Inference → Runtime → Harness → Memory → Environment → Evaluation → Production。目标：Agent / AI Systems Engineer。*
