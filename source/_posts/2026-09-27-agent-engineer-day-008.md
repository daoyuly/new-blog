---
title: "AI Agent 工程师 Day 8：Tool Registry：从直接调用到注册管理"
date: 2026-09-27 10:30:00
tags:
  - Tool Registry
  - Runtime
  - Agent
categories:
  - AI Agent 工程师学习计划
  - M1 LLM + Agent Runtime
description: "Day 8/168 | M1 Tool Registry 设计 | Tool Registry：从直接调用到注册管理。6 个月从 LLM 到生产级 Agent 系统的完整学习路线。"
keywords: "AI Agent, 工程师, Tool Registry 设计, Tool Registry, Runtime, Agent"
author: OpenClaw Agent Learning
---

# AI Agent 工程师 Day 8：Tool Registry：从直接调用到注册管理

> **6 个月学习计划** | M1 - LLM + Agent Runtime | Day 8/168
> 
> **今日主题**: Tool Registry 设计

---

# Tool Registry：从直接调用到注册管理

**核心结论**：Tool Registry（工具注册中心）是 Agent 系统中所有工具的统一管理入口。它通过 register/unregister/get/list 四个基础操作，把"Agent 直接调用 Python 函数"这种硬编码模式，升级为"运行时按名查找、动态注册"的间接调用模式。这个转变的本质是**解耦**：调用方（Agent/LLM）只需要知道工具的名字和描述，不需要知道实现细节；系统层只需要维护一张注册表，就能实现工具的动态加载、权限控制、审计追踪。没有 Registry 的 Agent 是一堆 if-else 的堆砌；有了 Registry，Agent 才具备了作为"系统"演进的基础。

---

## 一、背景与动机

在 6 个月 AI Agent 工程师路线中，你此前的学习路径大致是：LLM 基础 API → Prompt 工程 → Function Calling → 简单的 Agent Loop。到目前为止，你的 Agent 调用工具的方式大概率是这样的：

```python
if tool_name == "search_web":
    result = search_web(query)
elif tool_name == "read_file":
    result = read_file(path)
```

这种写法在 Demo 阶段完全够用，但它有一个致命问题：**每加一个工具，就要改 Agent 的核心代码**。当你想做一个真正能被多场景复用的 Agent Runtime 时，工具的数量会从 3 个涨到 30 个，调用逻辑会从一段代码膨胀成一个不可维护的泥球。

第 8 天的 Tool Registry 正是这个拐点上的关键一课。它处于"从能跑的 Demo 到可演进的系统"的交界处——是 M1 阶段从"会用 API"走向"会做架构"的第一块基石。后面几周的 Executor（执行器）、Permission（权限）、MCP 协议接入，全部建立在 Registry 之上。

理解这一课，需要建立一条清晰的因果链：**为什么要抽象 → 抽象成什么样 → 各组件如何分工**。下面按这个顺序展开。

---

## 二、为什么 Agent 不应直接调用 Python 函数

### 2.1 直接调用的问题本质

直接调用 Python 函数，意味着**调用方和被调方在编译期就绑死了**。这在软件工程里叫紧耦合（Tight Coupling）。具体到 Agent 场景，它带来四个工程问题：

**1. 无法动态扩展。** 工具集合在代码写死，加工具必须改代码、重启进程。而真实 Agent 系统（如 Claude Code、各类 Copilot）经常需要运行时热插拔工具——比如用户连接了一个新的 MCP Server，或管理员临时禁用了某个危险工具。

**2. 无法统一治理。** 工具散落在各处，权限校验、参数校验、日志审计、超时控制这些横切关注点（Cross-cutting Concerns）没地方放。你要么在每个函数里重复写，要么放弃治理。

**3. LLM 需要工具清单，而不是工具实现。** Function Calling 的本质是：LLM 输出一个"我想调用 search_web，参数是 {...}"的声明，由外部代码真正执行。LLM 决策的输入是一份工具清单（名称 + 描述 + JSON Schema）。这意味着系统天然需要一个"清单的单一数据源"（Single Source of Truth）——直接调用模式下，这个清单只能靠手写维护，极易和实际实现不同步。

**4. 测试与替换困难。** 想把 `search_web` 换成另一个实现（比如从 Google 换到 Bing），或者测试时换成 mock，直接调用模式都得改动 Agent 核心代码。

### 2.2 间接调用：一句核心直觉

解决思路来自计算机科学最古老的智慧：**Any problem in computer science can be solved by adding a layer of indirection**（计算机科学的任何问题都可以通过增加一层间接来解决）。

把"Agent → 函数"改造成"Agent → 注册表 → 函数"，中间这一层就是 Tool Registry。注册表本身不懂任何业务逻辑，它只做一件事：**维护"名字 → 可调用对象 + 元数据"的映射**。

```
直接调用（硬编码）：                注册调用（间接层）：

┌───────┐                          ┌───────┐     ┌──────────┐     ┌──────────┐
│ Agent │───if/else──→ 函数们      │ Agent │────→│ Registry │────→│  Tool A  │
└───────┘                          └───────┘     └──────────┘     ├──────────┤
                                                                 ──→│  Tool B  │
                                                                 ──→│  Tool C  │
```

一句话直觉：**Registry 就是工具世界的 DNS**——你只需要域名（工具名），DNS 负责找到 IP（实际函数），而底层服务器怎么迁移、扩容，调用方完全不关心。

---

## 三、Tool Registry 的四个基本操作

### 3.1 接口设计

一个最小可用的 Tool Registry 只需要四个操作，对应经典的注册表模式（Registry Pattern）：

| 操作 | 签名 | 职责 |
|------|------|------|
| **register** | `register(tool: Tool) -> None` | 注册工具，存入映射表；重名时报警或拒绝 |
| **unregister** | `unregister(name: str) -> None` | 注销工具，运行时下线 |
| **get** | `get(name: str) -> Tool` | 按名查找，找不到抛明确异常 |
| **list** | `list() -> list[Tool]` | 列出所有工具，用于生成 LLM 的工具清单 |

注意一个容易被忽略的设计点：**`list()` 是 Registry 最有业务价值的操作**。因为 `get` 只服务于执行阶段，而 `list` 服务于 LLM 决策阶段——每次构造请求时，系统都要把 `list()` 的结果转成 tools JSON 发给模型。工具描述写得好不好、该不该出现在清单里，都由这一步控制。这就是"工具管理"和"工具执行"分离的伏笔。

### 3.2 一个可运行的实现骨架

```python
# tools/registry.py
from typing import Callable, Protocol
import json

class Tool(Protocol):
    """工具的统一抽象：可调用 + 自描述"""
    name: str
    description: str
    parameters: dict          # JSON Schema
    def __call__(self, **kwargs): ...

class ToolRegistry:
    def __init__(self):
        self._tools: dict[str, Tool] = {}

    def register(self, tool: Tool, override: bool = False) -> None:
        if tool.name in self._tools and not override:
            raise ValueError(f"Tool '{tool.name}' already registered")
        self._tools[tool.name] = tool

    def unregister(self, name: str) -> None:
        self._tools.pop(name, None)   # 幂等注销，不抛错

    def get(self, name: str) -> Tool:
        if name not in self._tools:
            raise KeyError(f"Unknown tool: '{name}'")
        return self._tools[name]

    def list(self) -> list[Tool]:
        return list(self._tools.values())

    def to_openai_schema(self) -> list[dict]:
        """关键方法：把注册表翻译成 LLM 能理解的工具清单"""
        return [
            {"type": "function",
             "function": {"name": t.name,
                          "description": t.description,
                          "parameters": t.parameters}}
            for t in self._tools.values()
        ]
```

配上一个装饰器让注册体验更顺手：

```python
registry = ToolRegistry()

def tool(name: str, description: str):
    def decorator(fn: Callable):
        schema = {"type": "object", "properties": {}, "required": []}
        # 生产中可用 typing.get_type_hints 自动推导 schema
        registry.register(SimpleTool(name, description, schema, fn))
        return fn
    return decorator

@tool(name="search_web", description="搜索互联网获取实时信息")
def search_web(query: str) -> str:
    ...
```

设计上的两个严谨性考量：

- **重名冲突要显式处理**。`register` 默认拒绝覆盖，是因为两个工具重名几乎一定是 bug 或注入攻击（恶意代码抢先注册同名工具劫持调用）。显式 `override=True` 才允许热更新。
- **`unregister` 做成幂等**。注销一个不存在的工具不应炸掉整个流程——这在多租户、多 Agent 共享 Registry 时尤为重要。

---

## 四、Tool 的统一管理抽象

### 4.1 抽象什么？

Registry 只管"存和查"，真正的难点在于：**注册进去的东西必须长得一样**。这就是 Tool 抽象（Tool Abstraction）的职责。一个规范的 Tool 至少要包含两部分：

1. **可执行体**（executable）：真正干活的函数或方法；
2. **自描述元数据**（self-describing metadata）：名称、描述、参数 JSON Schema、返回类型，甚至作者、版本、所需权限。

为什么元数据必须和实现绑在一起？回到因果链：LLM 决策依赖工具清单，清单来自工具元数据。如果描述和实现分离维护，必然发生"描述说能传三个参数，实现只认两个"的漂移。**把 Schema 写在工具定义旁边，改实现时顺手改描述，才能保证清单永远可信。** 这也是 OpenAI Function Calling、Anthropic Tool Use、MCP 协议共同的设计选择——所有主流协议都要求工具自带 JSON Schema。

### 4.2 统一抽象的收益

有了统一的 Tool 接口，大量系统能力可以在"对所有工具一视同仁"的前提下实现：

- **动态清单生成**：`registry.to_openai_schema()` 一行搞定，永不与实现脱节；
- **统一中间件**：日志、指标、参数校验、脱敏，写一次装饰器套在 `__call__` 上，全量工具受益；
- **异构来源归一**：本地函数、REST API、MCP 远程工具，都可以包装成同一个 Tool 接口塞进同一个 Registry——这正是后续接入 MCP 的架构基础。

工程直觉：**Tool 抽象之于 Agent，相当于驱动接口之于操作系统**。内核不关心磁盘是 SATA 还是 NVMe，它只跟"块设备接口"打交道；Agent Runtime 也不关心工具是本地函数还是远程 API，它只跟 Tool 接口打交道。

---

## 五、Registry 与 Executor 的分离

### 5.1 为什么要分离

新手最常见的架构错误，是把"查找工具"和"执行工具"写在一个函数里。这在工具少的时候看不出问题，但一旦要加权限控制、并发执行、重试策略，就会发现查找逻辑和执行逻辑互相纠缠，改一处动全身。

正确的分工是：

| 组件 | 职责 | 不负责 |
|------|------|--------|
| **Tool Registry** | 存储与查找：工具在不在、叫什么、元数据是什么 | 不执行、不校验权限 |
| **Tool Executor** | 执行与治理：参数校验、超时、重试、异常包装、审计日志 | 不知道工具从哪来、有几个 |

```
LLM 决策                系统执行
┌──────────────────┐    ┌─────────────────────────────┐
│ 1. registry.list()│    │ 3. registry.get(name)       │
│    → 工具清单      │    │ 4. executor.execute(        │
│ 2. LLM 返回工具调用 │ →  │       tool, args,           │
│    声明            │    │       context)              │
└──────────────────┘    │    ├─ 参数校验                │
                        │    ├─ 权限检查                │
                        │    ├─ 执行 + 超时/重试         │
                        │    └─ 结果包装回消息           │
                        └─────────────────────────────┘
```

### 5.2 分离的因果收益

**1. 决策与执行各取所需。** LLM 决策只需要 Registry 的 `list`（快、纯查询、可缓存）；执行只需要 Executor（重、有副作用、需治理）。两者访问的数据源头相同（Registry），但通路不同，互不拖累。

**2. 治理策略集中且可替换。** 想给所有工具加 30 秒超时？改 Executor 一处。想给高危工具加人工审批？在 Executor 的执行前钩子里加，工具实现本身零改动。

**3. 为权限系统留出干净的挂载点。** "Agent A 能调用哪些工具"是 Registry 层的过滤问题（list 时过滤）；"这次调用是否允许执行"是 Executor 层的校验问题。分离之后，两层可以独立演进。

一个判断标准送给你：**当你在 Registry 里忍不住想写 try/except 包执行逻辑时，就是该拆出 Executor 的信号。** Registry 应该是纯粹的、无副作用的、接近数据结构的存在。

---

## 六、当前 Runtime 存在的问题分析

用上面的标尺回头审视大多数初学者（以及本文开头）的 Runtime 代码，问题清单如下：

| # | 问题 | 直接后果 | Registry 如何解决 |
|---|------|----------|------------------|
| 1 | 工具调用硬编码在 Agent 主循环 | 加工具必改核心代码，不可热插拔 | 注册表统一查找，核心循环零改动 |
| 2 | 工具清单（prompt 里的 tools 描述）手工维护 | 描述与实现漂移，LLM 幻觉调用不存在的参数 | `list()` / `to_schema()` 自动生成 |
| 3 | 没有统一的参数校验和异常处理 | 一个工具报错拖垮整个 Agent Loop | 统一 Tool 抽象 + Executor 中间件 |
| 4 | 工具状态是全局隐式的 | 无法按 Agent/租户隔离工具集，无法运行时禁用 | Registry 实例化，按需注册/注销 |
| 5 | 工具调用无审计 | 出问题无法追溯"谁在什么时候调了什么" | Executor 层统一打点 |

其中第 2 条最值得强调：**清单与实现脱节是 LLM 幻觉调用的头号来源之一**。模型基于清单做决策，清单错了，决策必然错。所以"自动从注册表生成清单"不只是省事，它是正确性问题，不是便利性问题。

---

## 七、实践练习与思考题

**练习目标**：完成 `tools/registry.py`，支持 register/unregister/get/list，并用 3 个示例工具跑通"注册 → 生成清单 → 模拟调用 → 注销"全流程。

**验收标准**：

1. `register` 重复注册同名工具时抛出明确异常，`override=True` 可覆盖；
2. `to_openai_schema()`（或对应 Anthropic 格式）输出可直接塞进 API 请求的合法结构；
3. `unregister` 幂等：注销不存在的工具不报错；
4. 写一个最小测试：注册后 `list` 可见，注销后 `get` 抛 KeyError。

**思考题**：

1. 如果两个 Agent 需要不同的工具集（客服 Agent 不该有删库工具），你会用一个全局 Registry 加过滤，还是每个 Agent 一个 Registry 实例？各自的安全和性能代价是什么？
2. 工具执行是耗时操作，`get` 返回 Tool 对象后、执行完成前，另一个线程把它 `unregister` 了，会发生什么？你打算怎么处理？
3. Registry 要不要支持工具的版本管理（同名 v1/v2 共存）？什么场景下值得加这个复杂度？

---

## 八、与 Agent Engineering 的关联

Tool Registry 不是学术练习，它是当代所有生产级 Agent 系统的地基构件：

- **MCP（Model Context Protocol）** 本质上就是一个跨进程的 Tool Registry 协议：Server 注册工具并声明 Schema，Client 发现（`tools/list`）并调用（`tools/call`）。你今天写的 `register/get/list`，就是 MCP `tools/list` 与 `tools/call` 的单进程版本。
- **OpenAI Assistants / Anthropic Tool Use** 的 tools 参数，对应本文 `to_openai_schema()` 的输出。理解 Registry，才能理解为什么工具描述必须随注册自动生成。
- **多 Agent 系统**中，"把另一个 Agent 当工具调用"（Agent-as-Tool）的注册方式与普通工具完全一致——这依赖统一的 Tool 抽象。
- **企业级治理**（工具级权限、调用审计、灰度下线）全部挂载在 Registry + Executor 这对组件上。没有这一层，Agent 在企业环境寸步难行。

一句话定位：**第 8 天之前你在写 Agent，第 8 天之后你在写 Agent 系统。** 分界线就是你是否开始用注册中心管理工具。

---

## FAQ

**Q1：Tool Registry 和 Function Calling 是什么关系？**
Function Calling 是 LLM 的输出协议（模型声明想调用什么）；Tool Registry 是服务端的实现机制（维护可用工具及其元数据）。两者通过"Registry 生成清单 → 模型决策 → 系统按名查找并执行"这条链路衔接。没有 Registry，Function Calling 的清单只能手工维护。

**Q2：工具就三五个，直接 if-else 不是更简单吗？**
Demo 阶段可以，但工具清单发给 LLM 的部分无法靠 if-else 自动生成，治理（日志/权限/超时）也没有挂载点。经验上，工具数超过 3 个或需要被第二处复用时，就该引入 Registry——迁移成本远低于事后重构。

**Q3：Registry 需要持久化吗？工具定义要存数据库吗？**
通常不需要。工具定义是代码的一部分（函数 + 装饰器），随进程启动时注册即可，内存中的 dict 足够。需要持久化的是**配置类信息**：哪些租户启用了哪些工具、工具的启用/禁用状态——这属于 Registry 之上的管理层。

**Q4：MCP 出现后还需要自己写 Registry 吗？**
需要。MCP 解决的是跨进程工具发现与调用的协议问题，但每个进程内部仍然需要一张注册表来管理"本地工具 + 远程 MCP 工具"的统一视图。MCP Server 的工具接入你的 Runtime 时，依然要包装成 Tool 对象注册进 Registry——协议是外部的，注册表是内部的。

**Q5：register 应该用装饰器还是显式调用？**
装饰器适合"工具定义即注册"的常见场景，代码紧凑；显式调用适合需要传运行时配置（如 API key、base_url）的工具。生产系统中两者混用很常见：装饰器处理纯函数工具，显式调用处理有状态的工具类实例。

---

## 参考资料

- OpenAI 文档 — Function Calling / Tools：https://platform.openai.com/docs/guides/function-calling
- Anthropic 文档 — Tool Use：https://docs.anthropic.com/en/docs/agents-and-tools/tool-use/overview
- Model Context Protocol 规范 — Tools：https://modelcontextprotocol.io/docs/concepts/tools
- Martin Fowler — Registry Pattern（注册表模式）：https://martinfowler.com/eaaCatalog/registry.html
- Lilian Weng — LLM Powered Autonomous Agents：https://lilianweng.github.io/posts/2023-06-23-agent/

---

## 📋 本日知识点清单

- [ ] 为什么 Agent 不应直接调用 Python 函数
- [ ] Tool Registry 的 register/unregister/get/list
- [ ] Tool 的统一管理抽象
- [ ] Registry 与 Executor 的分离
- [ ] 当前 Runtime 存在的问题分析

## 📝 实践练习

实现 tools/registry.py，支持 register/unregister/get/list 操作。

---

*本文是「AI Agent 工程师」6 个月学习计划的一部分。学习路线：LLM → Inference → Runtime → Harness → Memory → Environment → Evaluation → Production。目标：Agent / AI Systems Engineer。*
