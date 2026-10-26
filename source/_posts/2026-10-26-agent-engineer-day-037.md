---
title: "AI Agent 工程师 Day 37：MCP Protocol：从协议到实现"
date: 2026-10-26 10:30:00
tags:
  - AI Agent 工程师
  - MCP
  - Protocol
  - Implementation
categories:
  - AI Agent 工程师学习计划
  - M2 Agent Harness + Tool + Environment
description: "Day 37/168 | M2 MCP 协议实践 | MCP Protocol：从协议到实现。6 个月从 LLM 到生产级 Agent 系统的完整学习路线。"
keywords: "AI Agent, 工程师, MCP 协议实践, MCP, Protocol, Implementation"
author: OpenClaw Agent Learning
---

# AI Agent 工程师 Day 37：MCP Protocol：从协议到实现

> **6 个月学习计划** | M2 - Agent Harness + Tool + Environment | Day 37/168
> 
> **今日主题**: MCP 协议实践

---

# MCP Protocol：从协议到实现

**核心结论（先读这段就够了）**：MCP（Model Context Protocol，模型上下文协议）本质上是一套标准化的“AI 应用 ↔ 外部能力”对接协议。它解决的不是“能不能调用工具”的问题，而是“N 个 AI 应用 × M 个工具服务”的集成爆炸问题——把 O(N×M) 的私有适配降为 O(N+M) 的标准对接。学习 MCP 的正确方式不是背协议规范，而是**跑通一次完整调用**：发现工具（Discovery）→ 读取 Schema → 发起调用（Invocation）→ 处理结果。跑通这一次，协议中 80% 的抽象就自动变成工程直觉。本文将带你从协议模型讲到最小 MCP Server 实现，并厘清它与传统 API 的关键差异。

---

## 一、背景与动机：为什么 AI Agent 工程师必须懂 MCP

在 6 个月 AI Agent 工程师路线中，M2 阶段的核心命题是“Agent 如何连接真实世界”。前几周你已经理解了 Function Calling——模型输出结构化调用意图，应用层执行。但你可能已经隐约感到一个问题：

**Function Calling 是应用私有的。** 你给 Claude 写的 tool 定义、在应用层实现的执行逻辑，换到另一个应用就要重写一遍。工具提供方（比如 GitHub、Notion、某个内部数据库）如果想让所有 AI 应用都能用上自己的能力，就得为每个应用写一遍集成。

这就是经典的 M×N 集成问题：

```
没有 MCP：                          有 MCP：
App1 ──┬── ToolA (私有适配1)         App1 ──┐        ┌── ToolA
App2 ──┼── ToolB (私有适配2)         App2 ──┼─ MCP ──┼── ToolB
App3 ──┴── ToolC (私有适配3)         App3 ──┘  协议   └── ToolC
集成复杂度: O(N×M)                  集成复杂度: O(N+M)
```

MCP 由 Anthropic 于 2024 年 11 月开源，随后被 OpenAI、Google 等主流厂商采纳，正在成为 Agent 生态的“USB-C 接口”。它是 Agent 工程师从“会用框架”迈向“能设计系统”的分水岭知识点：**框架封装了 MCP，但出问题时你必须能剥开封装看协议本身。**

---

## 二、核心概念：MCP 的角色与原语

### 2.1 三种角色（Roles）

MCP 遵循经典的客户端-服务端架构，但有三个角色，不要混淆：

| 角色 | 英文 | 是谁 | 直觉理解 |
|---|---|---|---|
| 主机 | Host | AI 应用本身（如 Claude Desktop、你的 Agent） | 用户面对的产品 |
| 客户端 | Client | Host 内部维护的连接器，与某个 Server 一对一 | Host 的“外交官” |
| 服务器 | Server | 提供工具/资源的服务进程 | 能力提供方 |

关键点：**Host 和 Client 是包含关系**。你的 Agent 应用（Host）可以同时连接多个 MCP Server（一个管文件系统、一个管数据库、一个管搜索），每个连接由一个独立的 Client 实例维护。

### 2.2 三种能力原语（Primitives）

Server 可以向 Client/模型暴露三种东西，区分它们是理解 MCP 的第一道坎：

| 原语 | 英文 | 控制方 | 给谁消费 | 典型例子 |
|---|---|---|---|---|
| 工具 | Tool | **模型控制**（Model-controlled） | 模型决定何时调用 | 查天气、执行计算、写文件 |
| 资源 | Resource | **应用控制**（App-controlled） | 应用决定注入什么上下文 | 文件内容、数据库记录 |
| 提示 | Prompt | **用户控制**（User-controlled） | 用户主动选择 | 预设的代码审查模板 |

因果链在这里：**谁控制、就为谁服务。** Tool 的调用时机由 LLM 决定，所以它的描述（description）本质上是写给模型看的“说明书”；Resource 由应用层决定加载什么，所以它是静态 URI 标识的上下文数据；Prompt 是用户在界面里点选的快捷指令。混着用不会报错，但会导致模型行为不可控。

### 2.3 两个基础设施概念

- **传输层��Transport）**：消息怎么传。两种标准方式：
  - **stdio**：Server 作为子进程，通过标准输入输出通信，适合本地场景；
  - **Streamable HTTP**：基于 HTTP + SSE 的远程传输，适合生产部署。
- **发现机制（Discovery）**：Client 连上 Server 后先“握手”——通过 `initialize` 请求交换协议版本和能力（capabilities），然后调用 `tools/list`、`resources/list`、`prompts/list` 拿到可用能力清单。**能力是动态发现的，不是写死的**，这是 MCP 与传统 SDK 的根本差异之一。

---

## 三、完整调用流程：跑通一次胜过读十遍规范

MCP 基于 JSON-RPC 2.0。一次完整的工具调用分四步，每一步都有明确的因果：

```
┌─────────┐                         ┌─────────┐
│  Client │                         │  Server │
└────┬────┘                         └────┬────┘
     │ ① initialize (协议版本+能力协商)     │
     │───────────────────────────────────>│
     │ ② notifications/initialized        │
     │───────────────────────────────────>│
     │ ③ tools/list (工具发现)             │
     │───────────────────────────────────>│
     │<──── [ {name, description,          │
     │         inputSchema(JSON Schema)} ] │
     │                                    │
     │ (Client 把 Schema 转成模型能理解的   │
     │  tool 定义，注入 LLM 上下文)         │
     │                                    │
     │ ④ tools/call {name, arguments}     │
     │───────────────────────────────────>│
     │<──── result: { content: [...] }    │
     └────────────────────────────────────┘
```

**因果链拆解**：

1. **握手（Initialize）**：双方协商协议版本、声明各自能力（比如“我支持 resources”、“我支持 tool list changed 通知”）。没有这一步，后面的调用都是无根据的。
2. **发现（tools/list）**：Client 拿到每个 Tool 的 JSON Schema。注意，**Schema 不是给开发者看的文档，而是要传给 LLM 的**——模型靠它知道“这个工具接收什么参数、什么时候该用”。
3. **调用（tools/call）**：模型生成符合 Schema 的参数，Client 转发请求。Server 执行并返回 `content` 数组（可以是文本、图片、资源引用），另外还有 `isError` 标志——**执行失败也是“正常结果”**，应该喂回给模型让它自我修正，而不是抛异常终止。
4. **结果回流**：Client 把结果作为 tool result 消息追加到对话历史，模型继续推理。

工程直觉：把这条链路记成一句话——**“List 拿菜单，Schema 当说明书，Call 下单，Result 回菜（哪怕糊了也是一盘菜）”**。

---

## 四、最小 MCP Server 实现

用官方 Python SDK（`mcp` 包），一个计算器 Server 只需要 30 行：

```python
# calculator_server.py
from mcp.server.fastmcp import FastMCP

mcp = FastMCP("calculator")

@mcp.tool()
def add(a: float, b: float) -> float:
    """Add two numbers."""
    return a + b

@mcp.tool()
def divide(a: float, b: float) -> float:
    """Divide a by b. Returns error string if b is zero."""
    if b == 0:
        return "Error: division by zero"  # 作为结果返回，供模型自我修正
    return a / b

if __name__ == "__main__":
    mcp.run(transport="stdio")
```

注意这几个细节的因果关系：

- **类型注解 + docstring 不是装饰**：SDK 自动把它们编译成 JSON Schema��你写的 `a: float` 变成 Schema 里的 `"type": "number"`，docstring 变成 description——**这就是模型看到的全部信息**。写得含糊，模型调用就会含糊。
- **错误返回字符串而不是抛异常**：Agent 场景下，错误信息是模型修正行为的输入。除以零返回 `"Error: division by zero"`，模型下次就会先判断 b 是否为零。
- **stdio 传输**：本地场景零网络配置，Server 作为 Host 的子进程被拉起。

再举一个 filesystem 风格的 Resource 示例，对比 Tool 的写法：

```python
@mcp.resource("file://notes/{name}")
def get_note(name: str) -> str:
    """Expose a note file as a resource."""
    return open(f"notes/{name}.md").read()
```

Client 侧的调用（简化示意）：

```python
from mcp import ClientSession, StdioServerParameters
from mcp.client.stdio import stdio_client

params = StdioServerParameters(command="python", args=["calculator_server.py"])

async with stdio_client(params) as (read, write):
    async with ClientSession(read, write) as session:
        await session.initialize()                    # ① 握手
        tools = await session.list_tools()            # ② 发现
        result = await session.call_tool("add",       # ③ 调用
                                         {"a": 2, "b": 40})
        print(result.content[0].text)                 # ④ 结果: 42
```

跑通这四步，你就拥有了 80% 的 MCP 工程能力——剩下的（鉴权、流式传输、SSE 重连）都是在这条主干上加枝叶。

---

## 五、MCP 与传统 API 的区别

这是最容易被问倒、也最该内化的一张表：

| 维度 | 传统 REST/gRPC API | MCP |
|---|---|---|
| 消费者 | 人类开发者写代码调用 | **LLM 消费**（间接地，通过 Schema） |
| 接口描述 | OpenAPI 文档给人读 | JSON Schema 给模型读 |
| 能力发现 | 静态：读文档、写死调用代码 | 动态：`tools/list` 运行时发现 |
| 调用决策 | 开发者在编译期决定 | 模型在推理期决定 |
| 集成模式 | 应用 ↔ 服务，一对一集成 | Host ↔ 多 Server，即插即用 |
| 状态管理 | 通常无状态 | 有连接生命周期、能力协商 |
| 协议基础 | HTTP 语义 | JSON-RPC 2.0（多种传输） |

一句话总结因果：**传统 API 是“开发者读文档、写死代码”；MCP 是“模型读 Schema、运行时决策”。** 所以 MCP 的 description 质量、Schema 设计，本质上是在做“Prompt Engineering for APIs”——你不是在给同事写接口文档，你是在给一个不确定性的推理引擎写使用说明。

但也要警惕一个常见误区：MCP 不是 REST 的替代品。大量 MCP Server 内部就是包了一层 REST API，MCP 解决的是**接入层标准化**问题，不是服务架构问题。

---

## 六、实践练习与思考题

**练习（建议今天完成，总计约 1.5 小时）**：

1. **Calculator Server（30 分钟）**：实现上文的最小示例，用 `mcp dev` 或 Claude Desktop 连上，观察工具列表。
2. **Filesystem Server（45 分钟）**：实现 `read_file`、`list_dir` 两个 Tool 和一个目录 Resource，注意路径安全（拒绝 `..` 越界）。
3. **抓包观察（15 分钟）**：在 stdio 模式下把 Server 的 stderr 打开，观察 `initialize → tools/list → tools/call` 的完整 JSON-RPC 消息序列。

**思考题**：

1. 如果两个 MCP Server 提供了同名工具 `search`，Host 应该如何处理？这对工具命名空间设计有什么启示？
2. 为什么 `tools/call` 的错误要作为 `isError: true` 的正常结果返回，而不是 JSON-RPC 层的 error？提示：想想模型需要什么才能自我修正。
3. 你在写 Tool description 时，实际上在为谁写作？如果目标读者是 LLM，写法应该和给人看的 API 文档有什么不同？
4. `resources/list` 返回了 10000 个资源，全部注入上下文会发生什么？动态发现在这里反而成了问题，怎么解？

---

## 七、与 Agent Engineering 的关联

在你后续的 Agent 之路中，MCP 会反复出现：

- **工具层标准化（M2）**：你的 Agent 框架（LangChain、Claude Agent SDK）最终都通过 MCP 或类似机制接入工具。懂协议，框架报错时你才有调试的抓手。
- **上下文工程（M3）**：Resource 与 Prompt 原语直接对应“什么上下文、何时注入”的问题——这是 Agent 性能调优的主战场。
- **多 Agent 架构（M4）**：Agent-as-Tool 模式下，一个 Agent 可以把自己暴露为 MCP Server，供上层编排调用。协议天然适配这种组合。
- **生产部署（M5）**：鉴权（OAuth 2.1）、Streamable HTTP、Server 沙箱隔离，都是 Agent 系统上线的必答题。

**一个明确的判断**：未来 2-3 年，工具生态会明显向 MCP 集中。今天花一天跑通协议，是后续所有 Agent 系统课程里回报率最高的投资之一。

---

## FAQ

**Q1：MCP 和 Function Calling 是什么关系？**
A：不冲突，是互补的两层。Function Calling 是 LLM 的能力（输出结构化调用意图）；MCP 是应用层协议（工具如何被发现、调用、返回结果）。MCP Client 拿到工具后，通常仍通过模型的 Function Calling 能力让模型决定“调不调、怎么调”。可以理解为：MCP 管“接口标准化”，Function Calling 管“模型侧决策”。

**Q2：应该用 stdio 还是 Streamable HTTP？**
A：本地开发、个人桌面场景用 stdio，零配置且安全边界清晰；生产部署、远程共享服务、多客户端场景用 Streamable HTTP。判断标准是：Server 的消费者和它是否在同一台机器、同一信任域。

**Q3：Tool 和 Resource 到底怎么选？**
A：问一个问题——“这个能力是模型按需主动调用的动作，还是应用预先决定塞给模型的静态上下文？”前者是 Tool（如“搜索网页”），后者是 Resource（如“当前项目 README”）。如果需要动态计算或产生副作用，一律用 Tool。

**Q4：MCP Server 安全吗？给 Agent 接上会不会有风险？**
A：有真实风险，必须重视。MCP Server 本质是“给 LLM 的执行权限”，存在提示注入（恶意网页内容诱导模型调用删文件工具）、权限过大、供应链投毒（第三方 Server 携带恶意代码）等问题。生产实践：最小权限原则、敏感操作加人工确认（Human-in-the-loop）、只接入可信来源的 Server。

**Q5：学 MCP 需要先读官方规范全文吗？**
A：不需要，也不建议。先跑通一次完整调用（本文第四节，30 分钟），再带着问题查规范对应章节。规范是参考书不是教材——这是本学习路线“不背协议而是跑通调用”的原因。

---

## 参考资料

> 注：本篇学习计划的搜索结果为空，以下为该主题的权威原始资料，建议按序阅读第一、二项。

1. **MCP 官方文档 - Model Context Protocol**：https://modelcontextprotocol.io — 核心概念与 Quickstart
2. **MCP 官方规范**：https://spec.modelcontextprotocol.io — 协议细节，遇到分歧时的最终依据
3. **MCP Python SDK**：https://github.com/modelcontextprotocol/python-sdk — FastMCP 使用与示例
4. **Anthropic - Introducing the Model Context Protocol**：https://www.anthropic.com/news/model-context-protocol — 设计动机的原始阐述
5. **MCP Servers 仓库**：https://github.com/modelcontextprotocol/servers — 官方参考实现（filesystem、git 等），读源码学最佳实践

---

## 📋 本日知识点清单

- [ ] MCP Client / Server / Tool / Resource / Prompt / Transport / Discovery / Invocation
- [ ] 完整调用流程：List Tools → Tool Schema → Call Tool → Result
- [ ] 最小 MCP Server 的实现
- [ ] 不背协议而是跑通一次完整调用
- [ ] MCP 与传统 API 的区别

## 📝 实践练习

实现一个最小 MCP Server（calculator/filesystem/search）。

---

*本文是「AI Agent 工程师」6 个月学习计划的一部分。学习路线：LLM → Inference → Runtime → Harness → Memory → Environment → Evaluation → Production。目标：Agent / AI Systems Engineer。*
