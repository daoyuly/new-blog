---
title: "AI Agent 工程师 Day 39：MCP Discovery：工具的自动发现"
date: 2026-10-28 10:30:00
tags:
  - AI Agent 工程师
  - MCP
  - Discovery
  - 动态注册
  - Agent
categories:
  - AI Agent 工程师学习计划
  - M2 Agent Harness + Tool + Environment
description: "Day 39/168 | M2 MCP 工具发现 | MCP Discovery：工具的自动发现。6 个月从 LLM 到生产级 Agent 系统的完整学习路线。"
keywords: "AI Agent, 工程师, MCP 工具发现, MCP, Discovery, 动态注册, Agent"
author: OpenClaw Agent Learning
---

# AI Agent 工程师 Day 39：MCP Discovery：工具的自动发现

> **6 个月学习计划** | M2 - Agent Harness + Tool + Environment | Day 39/168
> 
> **今日主题**: MCP 工具发现

---

# MCP Discovery：工具的自动发现

**核心结论**：MCP Discovery（工具自动发现）解决的是 Agent 系统中“能力注册”问题——Agent 不再被硬编码绑定到固定的工具集合，而是在运行时通过 `connect → list_tools → register` 三步协议动态感知可用工具。这意味着：新增一个 MCP Server，Agent 无需改一行代码就能获得新能力；Server 端工具增删，Agent 也能通过变更通知机制同步。理解 Discovery 的本质，就是理解 Agent 从“静态能力集”走向“动态能力生态”的关键转折点。

---

## 一、背景与动机：为什么 Discovery 是 Agent 工程的必修课

想象你在维护一个 AI Agent 系统。最初它有 5 个工具：搜索、计算器、读文件……一切都硬编码在 Agent 的 prompt 和工具注册表里。三个月后，公司要接入内部 CRM、Jira、数据仓库。每接一个新系统，你都要：

1. 改 Agent 代码，注册新工具
2. 改 prompt，告诉 LLM 新工具的存在
3. 重新部署、回归测试

这就是“静态工具集成”的死亡螺旋——**Agent 的能力增长速度等于你的开发速度**。

MCP（Model Context Protocol）的 Discovery 机制把这个问题倒转过来：工具的实现方（MCP Server）负责“自我描述”，Agent（MCP Client/Host）负责“发现”。能力增长的瓶颈从“Agent 开发者”转移到了“Server 提供者”，这正是生态化的前提。

**在 6 个月 AI Agent 工程师路线中的位置**：你已完成 M1（LLM 基础、Prompt 工程、Function Calling 基础），M2 正在学习 MCP 与工具层。Discovery 是 MCP 从“能用”到“工程化可用”的分水岭——前面你手动注册工具，从这里开始，Agent 学会了自己“长出”工具。后续的多 Server 编排、权限治理、动态 Agent 架构都建立在这之上。

---

## 二、核心内容

### 2.1 Discovery 的完整流程：connect → list_tools → register

**工具发现（Tool Discovery）** 的标准流程分三步，每一步都有明确的协议语义：

**第一步：connect(server)。** Client 与 Server 建立连接。MCP 基于传输层（stdio / Streamable HTTP / SSE）先完成 **initialize 握手**：Client 发送协议版本和 capabilities，Server 回应自己支持的能力（capabilities）。注意，这里的 capability 是协议层的“我能提供什么类型的东西”（tools / resources / prompts），而不是具体工具清单——具体清单要等下一步。

**第二步：list_tools()。** Client 发送 `tools/list` 请求，Server 返回工具描述数组。每个工具包含三个关键字段：

```json
{
  "name": "query_database",
  "description": "根据 SQL 查询业务数据库，返回 JSON 结果",
  "inputSchema": {
    "type": "object",
    "properties": {
      "sql": { "type": "string" },
      "limit": { "type": "integer", "default": 100 }
    },
    "required": ["sql"]
  }
}
```

这里有个关键认知：**`inputSchema` 是 JSON Schema，这是 Discovery 能自动化的根本原因**。Schema 是机器可读、可验证的结构化契约，Agent 拿到它就能直接转成 LLM 的 function calling 格式，不需要任何人工适配。`description` 则是给 LLM 看的“说明书”——它的质量直接决定 LLM 能否正确选用这个工具。

**第三步：register()。** Client/Host 把发现的工具翻译成 Agent 运行时的工具格式，注入 Agent 的可用工具集。在发送给 LLM 的请求里，这些工具以 `tools` 参数出现（OpenAI 格式）或 MCP 兼容格式（Anthropic 原生支持）。

完整的因果链是：

```
Server 启动 → 声明工具清单（name + description + JSON Schema）
    ↓
Client connect → initialize 握手确认能力
    ↓
list_tools() → 拉取工具描述
    ↓
register() → 转换为 Agent 工具格式，注入运行��
    ↓
LLM 收到增强后的工具列表 → 推理时选择并调用
    ↓
Client 通过 tools/call 转发给对应 Server 执行
```

一个容易忽略的细节：**工具名的命名空间问题**。当你连接多个 Server 时，两个 Server 可能都有叫 `search` 的工具。成熟的 Host 实现（如 Claude Desktop、Cline）会做名称前缀化（`github__search`、`web__search`），注册阶段必须处理这个冲突，否则 LLM 会看到两个无法区分的工具。

### 2.2 动态连接与断开：Agent 的能力生命周期

Discovery 不是“启动时连一次就完事”，而是一个**生命周期管理**问题。

**动态连接（Dynamic Connection）** 的典型场景：

- **启动时预连接**：Host 读取配置文件（如 `claude_desktop_config.json`），逐个连接配置的 Server
- **运行时按需连接**：Agent 判断当前任务需要某类能力，临时拉起/连接对应 Server（比如用户说“帮我查 Jira”，才连接 Jira MCP Server）
- **用户手动接入**：像 Claude Desktop 的连接器，用户随时添加新 Server

**断开（Disconnect）** 同样重要，却常被忽视。断开时必须做三件事：

1. **工具注销（Deregister）**：从 Agent 工具集移除该 Server 的所有工具，否则 LLM 会继续选择一个已经无法执行的工具，产生“幻觉调用”
2. **资源清理**：关闭传输连接、取消 pending 的请求
3. **状态一致性**：如果 Agent 正在执行该 Server 的某个工具，需要决定是等待完成还是中断并告知 LLM

**连接与断开的策略对比**：

| 维度 | 启动时全量连接 | 运行时按需连接 |
|---|---|---|
| 首响应延迟 | 高（所有 Server 握手+列举） | 低 |
| 工具列表大小 | 可能膨胀（LLM context 压力） | 精简，按任务聚焦 |
| 故障影响面 | 一个 Server 挂可能拖慢启动 | 故障隔离好 |
| 实现复杂度 | 低 | 高（需要能力路由/元数据索引） |

工程直觉：**工具数量会直接吃掉 LLM 的 context 窗口和选择准确率**。50 个工具以内全量注册没问题；超过 100 个，按需连接 + 工具检索（tool retrieval）就成了必需品。这是 Discovery 对扩展性最直接的影响，我们在 2.4 展开。

### 2.3 工具变更同步：`tools/list_changed` 通知机制

静态世界里，工具清单连接时拉一次就够了。但 MCP Server 是可以热更新的——运维给数据库工具加了参数，或者下线了一个有 bug 的工具。Agent 怎么知道？

MCP 协议定义了 **`notifications/tools/list_changed`** 通知机制：

```
Server 端工具变更
    ↓
Server 发送 notification: tools/list_changed
    ↓
Client 收到通知（注意：通知里不含具体变更内容！）
    ↓
Client 重新调用 tools/list() 拉取最新清单
    ↓
对比新旧清单 → diff 出新增/删除/修改的工具
    ↓
增量更新 Agent 注册表，必要时通知上层（如刷新 UI）
```

这里有个反直觉的设计点：**通知是“信号”而不是“数据”**。Server 只告诉 Client“清单变了”，不说变了什么。为什么？因为变更可能是增删改任意组合，与其设计一套复杂的增量描述协议，不如让 Client 重新拉全量——在工具数量级别（几十到几百）下，一次 list 的成本远低于协议复杂度。这是典型的 **KISS 协议设计取舍**。

Client 拿到新清单后要做 diff，因为盲目全量替换注册表有副作用：如果 LLM 正在对话中引用了某个工具，突然替换可能导致上下文里的 tool_call_id 对不上。稳妥做法是增量更新。

**变更高频的坑**：如果 Server 频繁发送 list_changed（比如每次内部状态变化都发），Client 会陷入通知风暴。工程上的防御是 **debounce**——收到通知后延迟 1-2 秒再拉取，期间合并多次通知。另外，如果你的传输层不支持 Server → Client 的服务端推送（某些 HTTP 短轮询场景），��需要退化为**定期轮询 list_tools**，这是降级方案而非首选。

### 2.4 Discovery 对 Agent 扩展性的影响：从工具到生态

把前面三点串起来，我们看 Discovery 改变了 Agent 架构的什么。

**扩展性公式**：Agent 能力增长成本从 O(集成数 × 开发工作量) 变为 O(Server 数 × 连接配置)。用一个对比表说清楚：

| 维度 | 硬编码工具集成 | MCP Discovery |
|---|---|---|
| 新增能力 | 改 Agent 代码 + 部署 | 启动/配置一个 Server |
| 工具描述维护 | Agent 侧维护 prompt 片段 | Server 侧自描述 |
| 工具变更 | 双方同步改 | Server 独立演进 + 通知同步 |
| 多 Agent 共享 | 各自实现一遍 | 一个 Server 服务多个 Agent |
| 权限边界 | 代码层硬控 | Host 侧按 Server/工具粒度管控 |

**但 Discovery 也带来了新的扩展性挑战**，工程上必须正视：

1. **工具列表爆炸（Tool List Explosion）**：每个工具的 description + schema 都占 LLM context。连接 10 个 Server、每个 20 个工具，就是 200 个工具描述，可能占用数万 token，且 LLM 在过多工具间选择的准确率显著下降。解法：**工具检索/路由（Tool Retrieval / RAG over Tools）**——先根据用户意图检索相关的 top-K 工具，只把这些注入 LLM。这本质上是把“工具发现”做成了两层：MCP Discovery 发现全量，语义检索选择当前相关的子集。

2. **命名冲突与治理**：多 Server 环境下名称冲突、职责重叠（两个 Server 都有“发邮件”工具）会直接干扰 LLM 决策。Host 需要命名空间策略和工具优先级配置。

3. **信任与安全边界**：动态发现意味着“运行时引入新能力”，一个恶意或劣质的 Server 可以注入诱导性 description 操纵 LLM。生产环境的 Discovery 必须配合：Server 白名单/签名、description 审核、工具调用权限控制（human-in-the-loop 确认高危工具）。

一句话总结工程直觉：**Discovery 把“能力集成”从编译期移到了运行期，换来的是生态扩展性，付出的代价是运行时的治理复杂度。**

---

## 三、代码与图示

**整体架构图**：

```
┌─────────────────────────────────────────────┐
│                Agent Host                   │
│  ┌───────────┐   ┌──────────────────────┐   │
│  │ LLM 推理层 │←──│  Tool Registry       │   │
│  └───────────┘   │  (name→schema→server)│   │
│                  └──────────┬───────────┘   │
│                  register() │ ↑ list_changed│
│                  ┌──────────▼───────────┐   │
│                  │  MCP Client Manager  │   │
│                  └──┬───────┬───────┬───┘   │
└─────────────────────┼───────┼───────┼───────┘
              connect │       │       │
        ┌─────────────▼┐ ┌────▼─────┐ ┌▼──────────┐
        │ MCP Server A │ │ Server B │ │ Server C  │
        │ (文件系统工具) │ │ (数据库) │ │ (Web API) │
        └──────────────┘ └──────────┘ └───────────┘
```

**最小可运行的 Discovery 实现（Python）**：

```python
import asyncio
from mcp import ClientSession, StdioServerParameters
from mcp.client.stdio import stdio_client

class ToolRegistry:
    """Agent 侧的工具注册表：工具名 → (schema, 会话)"""
    def __init__(self):
        self._tools = {}   # qualified_name -> {schema, session}

    def register(self, session, tools, namespace):
        for tool in tools:
            # 命名空间前缀，避免多 Server 冲突
            qname = f"{namespace}__{tool.name}"
            self._tools[qname] = {"schema": tool, "session": session}

    def deregister(self, namespace):
        self._tools = {
            k: v for k, v in self._tools.items()
            if not k.startswith(f"{namespace}__")
        }

    def to_llm_format(self):
        """转换为 LLM function calling 格式"""
        return [{
            "name": name,
            "description": t["schema"].description,
            "parameters": t["schema"].inputSchema,
        } for name, t in self._tools.items()]


async def discover_server(server_cmd, namespace, registry):
    """connect → list_tools → register 完整流程"""
    params = StdioServerParameters(command=server_cmd[0], args=server_cmd[1:])
    async with stdio_client(params) as (read, write):
        async with ClientSession(read, write) as session:
            await session.initialize()          # ① 握手
            result = await session.list_tools() # ② 发现
            registry.register(session, result.tools, namespace)  # ③ 注册
            print(f"[{namespace}] 发现 {len(result.tools)} 个工具")

            # 模拟运行：等 LLM 调用
            await asyncio.Event().wait()  # 实际中由 Agent 主循环接管


async def main():
    registry = ToolRegistry()
    task = asyncio.create_task(
        discover_server(["python", "weather_server.py"], "weather", registry)
    )
    await asyncio.sleep(2)  # 等待发现完成

    # 此时 Agent 拿到的工具列表已自动包含 weather server 的工具
    print("Agent 可用工具:", [t["name"] for t in registry.to_llm_format()])
    await task

asyncio.run(main())
```

**变更同步的处理骨架**：

```python
async def watch_tool_changes(session, namespace, registry):
    """监听 tools/list_changed，增量同步注册表"""
    old_names = {t["schema"].name for t in registry._tools.values()
                 if t["namespace"] == namespace}
    async for message in session.incoming_messages:
        if isinstance(message, mcp.types.ToolListChangedNotification):
            await asyncio.sleep(1.0)          # debounce
            fresh = (await session.list_tools()).tools
            new_names = {t.name for t in fresh}
            registry.sync(namespace, fresh)   # 增量更新
            print(f"变更: +{new_names - old_names} -{old_names - new_names}")
            old_names = new_names
```

---

## 四、实践练习与思考题

**练习 1（基础）**：写一个极简 MCP Server（提供 2 个工具，如 `get_weather`、`get_time`），实现 Client 端的 connect → list_tools → register，打印 Agent 最终看到的工具 schema。

**练习 2（进阶）**：让 Server 支持运行时增删工具（比如通过一个管理接口），Client 收到 `list_changed` 通知后 diff 并打印变更。验证 debounce 的效果。

**练习 3（挑战）**：连接 3 个 Server，其中两个有同名工具 `search`。实现命名空间前缀 + 冲突检测，并模拟 Agent 调用其中一个被注销 Server 的工具时的错误处理。

**思考题**：

1. 如果你的 Agent 需要接入 50 个 MCP Server、共 500 个工具，纯 Discovery 会遇到什么问题？你会怎么设计两层发现架构？
2. `list_changed` 通知不携带变更详情，是协议设计的缺陷还是取舍？什么条件下你会支持这个设计？
3. 动态发现的工具描述由 Server 侧编写，如何防止恶意 description 操纵 LLM？（提示：think about prompt injection via tool description）

---

## 五、与 Agent Engineering 的关联

Discovery 在真实 Agent 系统中是承重墙级别的机制：

- **插件化 Agent 平台**：企业级 Agent 平台（如 Claude Enterprise、各类 Agent 网关）的核心卖点就是“接入即用”——底层正是 MCP Discovery + 权限治理。
- **Multi-Agent 系统**：子 Agent 可以把上层 Agent 的 MCP Server 视为自己的工具源，Discovery 是 Agent 间能力分发的统一通道。
- **LLM 网关与路由**：生产系统中 Discovery 的注册���同时服务两个消费者——LLM（要 schema）和路由器（要工具元数据做意图分流）。
- **可观测性**：注册表记录了“哪个 Server 提供了哪个工具、何时变更”，是工具调用链路追踪的数据基础。

掌握 Discovery 之后，你看任何 Agent 框架的“插件/扩展”机制，都会发现它们在解决同一个问题：**能力如何在不修改核心的情况下被发现、验证和接入**。

---

## 六、FAQ

**Q1：MCP Discovery 和传统的 Function Calling 有什么区别？**
A：Function Calling 是“LLM 如何选择和调用工具”的推理层协议，工具定义需要应用开发者手动传入。MCP Discovery 解决的是“工具定义从哪来”——通过标准协议从 Server 动态拉取。两者是互补关系：MCP 发现阶段把工具转成 function calling 格式，LLM 侧的调用机制不变。

**Q2：工具数量太多导致 context 爆炸怎么办？**
A：三层方案递进：(1) 精简 description 和 schema，砍掉冗余字段；(2) 按需连接——不同任务场景连接不同 Server 子集；(3) 工具检索——用 embedding 对工具描述建索引，按用户意图召回 top-K 工具注入 LLM。超过 100 个工具时第三层几乎是必选。

**Q3：Server 端工具变更后，Agent 一定会立即感知吗？**
A：不一定，取决于传输层。stdio 和支持服务端推送的 HTTP 传输下，Server 发 `tools/list_changed` 通知，Client 通常秒级感知（加上 debounce 延迟）。在不支持推送的环境下，Client 只能靠轮询，感知延迟等于轮询间隔。设计系统时不要假设“实时同步”。

**Q4：两个 Server 有同名工具怎么办？**
A：Host/Client 层必须做命名空间隔离，常见做法是 `server名__工具名` 的限定前缀。注册阶段检测冲突并显式处理（报错、重命名或按优先级屏蔽），绝不能让 LLM 看到两个无法区分的同名工具——那会直接导致选择混乱。

**Q5：动态发现的工具有安全风险吗？**
A：有，且是主要风险面之一。恶意 Server 可以通过诱导性 description 做 prompt injection，或提供危险工具等待 LLM 误用。生产环境必备三件事：Server 白名单/可信来源校验、工具 description 审计、高危工具的 human-in-the-loop 确认。Discovery 开放性越强，治理越要跟上。

---

## 七、参考资料

- MCP 官方规范 — Tools：https://modelcontextprotocol.io/docs/concepts/tools（`tools/list`、`inputSchema`、`list_changed` 通知的权威定义）
- MCP Specification（Schema 定义）：https://spec.modelcontextprotocol.io/specification/（协议消息格式与能力协商）
- MCP Python SDK：https://github.com/modelcontextprotocol/python-sdk（`ClientSession.list_tools()` 与通知监听的参考实现）
- Anthropic MCP 文档 — For Client Developers：https://modelcontextprotocol.io/docs/developing-clients（客户端发现流程的官方指引）
- MCP Servers 示例仓库：https://github.com/modelcontextprotocol/servers（观察真实 Server 的工具描述写法，学习 description 工程化）
- LangChain / LlamaIndex 的 MCP Adapter 源码（可搜索 `langchain-mcp-adapters`），学习 `list_tools → to_llm_format` 的生产级转换实现

---

## 📋 本日知识点清单

- [ ] connect(server) → list_tools() → register() → Agent 的自动发现流程
- [ ] MCP Server 的动态连接与断开
- [ ] 工具变更的同步机制
- [ ] Discovery 对 Agent 扩展性的影响

## 📝 实践练习

实现 MCP Discovery，测试启动 Server → Agent 发现工具 → 调用工具的完整流程。

---

*本文是「AI Agent 工程师」6 个月学习计划的一部分。学习路线：LLM → Inference → Runtime → Harness → Memory → Environment → Evaluation → Production。目标：Agent / AI Systems Engineer。*
