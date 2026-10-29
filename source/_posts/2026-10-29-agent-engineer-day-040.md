---
title: "AI Agent 工程师 Day 40：MCP Resource：获取上下文与数据"
date: 2026-10-29 10:30:00
tags:
  - AI Agent 工程师
  - MCP
  - Resource
  - Context
  - Memory
categories:
  - AI Agent 工程师学习计划
  - M2 Agent Harness + Tool + Environment
description: "Day 40/168 | M2 MCP Resource 概念 | MCP Resource：获取上下文与数据。6 个月从 LLM 到生产级 Agent 系统的完整学习路线。"
keywords: "AI Agent, 工程师, MCP Resource 概念, MCP, Resource, Context, Memory"
author: OpenClaw Agent Learning
---

# AI Agent 工程师 Day 40：MCP Resource：获取上下文与数据

> **6 个月学习计划** | M2 - Agent Harness + Tool + Environment | Day 40/168
> 
> **今日主题**: MCP Resource 概念

---

# MCP Resource：获取上下文与数据

## 开篇结论

**MCP Resource（模型上下文协议资源）** 是 Model Context Protocol 中一种"只读数据暴露"原语：它让 LLM/Agent 能以 URI 的形式读取外部数据（文件、数据库记录、日志、文档），但**不执行任何动作**。核心认知一句话：**Tool 是"做事"（do things），Resource 是"给上下文"（provide context）**。Resource 与 Memory 的区别也很清晰：Memory 是 Agent 自己写入、跨会话留存的状态；Resource 是外部系统持有、由服务端按需暴露的数据。理解这条边界，是构建可维护 Agent 系统的关键分水岭——用错原语不会立刻报错，但会让系统在权限、缓存、上下文预算上逐渐失控。

---

## 背景与动机

在 6 个月 AI Agent 工程师路线中，你已经走过了 Tool 调用（Function Calling）、MCP 基础架构（Host / Client / Server 三角色）。你知道 Agent 能"调用工具做事"了。但一个真实的 Agent 系统，80% 的失败不是"不会做事"，而是**缺少正确的上下文**——模型拿着错误的、过时的、或过量的信息去调 Tool，结果自然不可靠。

这就是 M2 第 2 周引入 Resource 的原因：**上下文获取是一个独立的工程问题**，需要独立的原语来解决。把"读数据"和"做事"混在一个 Tool 里，是新手最常见的设计错误。今天我们把这个边界画清楚。

---

## 核心内容

### 1. Tool = 做事情，Resource = 获取上下文/数据

**Model Context Protocol（MCP，模型上下文协议）** 定义了三种核心原语：**Tools（工具）、Resources（资源）、Prompts（提示模板）**。Tools 和 Resources 最容易混淆，但 MCP 官方规范给出的区分标准非常明确：

- **Tool**：由**模型控制**（model-controlled）。模型根据用户意图决定何时调用，调用会产生副作用（写数据库、发邮件、执行计算）。它回答的是"我能**做**什么"。
- **Resource**：由**应用控制**（application-controlled）。数据由 MCP Server 暴露，由 Host 应用决定何时、把哪些资源注入模型上下文。它是**只读的**（read-only），回答的是"我能**知道**什么"。

为什么这个区分重要？因为二者在协议层的行为完全不同：

| 维度 | Tool | Resource |
|------|------|----------|
| 控制方 | 模型自主决定调用 | 应用/用户决定注入 |
| 副作用 | 通常有 | 无，严格只读 |
| 传输机制 | `tools/call` 请求-响应 | URI 标识 + `resources/read` |
| 是否出现在模型可见的工具列表 | 是 | 否（经 Host 转换为上下文） |
| 缓存友好性 | 差（每次调用独立） | 好（URI 可缓存、可订阅变更） |
| 类比 | REST 中的 POST/DELETE | REST 中的 GET |

注意最后一行的类比：**Tool ≈ 写操作，Resource ≈ GET 请求**。如果你做过 Web 后端，这个直觉可以直接迁移——GET 应该幂等、可缓存、可重试；Resource 同理。把一个"读数据"操作做成 Tool，你就放弃了缓存和变更订阅的能力，还让模型多消耗一次工具调用的推理开销。

### 2. MCP Resource 的概念与使用场景

**MCP Resource** 由三要素构成：**URI（统一资源标识符）、name（人类可读名称）、mimeType（内容类型）**。每个 Resource 有一个稳定 URI，例如：

```
file:///home/user/report.pdf
postgres://localhost/customers/123
github://repo/owner/README.md
```

MCP Server 通过两个方法暴露资源：

- `resources/list`：列出可用资源（静态发现）
- `resources/read`：按 URI 读取内容，返回文本或 base64 二进制
- `resources/templates/list`：列出**资源模板**（Resource Template），支持参数化 URI，如 `db://customers/{id}`——这让资源数量可以动态扩展，而不必枚举每一条记录

典型使用场景：

1. **文件系统���问**：让 Agent 读取代码仓库、文档、日志。这是最常见的场景，也是官方 filesystem server 的核心能力。
2. **知识库检索结果固化**：检索到的文档片段以资源形式暴露，带 URI 便于引用和追溯来源（citation）。
3. **数据库快照**：把某条业务记录暴露为资源，Agent 分析时直接读取，而不是让模型拼 SQL 调 Tool。
4. **长文档的按需加载**：Prompt 里只放资源列表和摘要，模型需要时 Host 再读全文——这是控制**上下文预算（context budget）**的关键手段。

一个值得记住的设计信号：如果你发现某个 Tool 的描述是"获取/查询/读取 XX 数据"，九成它应该是 Resource。

### 3. Resource 与 Memory 的区别

这是今天实践练习要回答的问题，也是很多 Agent 学习者的困惑点。先给定义：

- **Memory（记忆）**：Agent 系统中由 Agent 自己（或用户）**写入**、跨会话**留存**、用于**影响未来行为**的状态。典型实现如 Mem0、Letta（原 MemGPT）、向量库中的对话摘要。
- **Resource**：**外部系统持有**的数据，MCP Server 只做暴露，Agent **只读不写**，数据本体不归 Agent 管。

| 维度 | Resource | Memory |
|------|----------|--------|
| 写入者 | 外部系统/用户 | Agent 自己 |
| 数据主权 | 归源系统 | 归 Agent/用户 |
| 生命周期 | 跟随源系统 | 跟随 Agent 生命周期 |
| 一致性来源 | 源系统即真相（single source of truth） | 需要自己维护一致性（遗忘、冲突、过期） |
| 协议归属 | MCP 标准原语 | 无标准，工程自定义 |

因果链是这样的：**Memory 的本质成本是"一致性维护"**——写入的记忆会过期、会互相矛盾、会污染后续推理（memory poisoning）。而 Resource 把真相留给源系统，Agent 每次读取都拿到最新状态，无需维护副本。所以工程原则是：**能从源系统按需读取的（Resource），不要复制进 Memory；只有源系统不存在的推导、偏好、摘要，才值得进 Memory**。

举个具体例子：用户的项目技术栈信息，如果存在 Notion 里，做成 Resource 每次读取即可；但"用户偏好简洁风格的回答"这种 nowhere 存在的推导结论，才是 Memory 的领地。

### 4. Resource 与 Context 系统的联系

**Context（上下文）** 是 LLM 推理的全部输入窗口。Agent 的 Context Engineering（上下文工程）要解决三个问题：放什么、什么时候放、放多少。Resource 在这个体系中的位置：

```
┌─────────────────── Host 应用 ───────────────────┐
│                                                  │
│  ┌──────────┐   ①发现资源   ┌────────────────┐  │
│  │ MCP      │◄──────────────┤  Context 管理器 │  │
│  │ Client   │               │                │  │
│  └────┬─────┘               │  - 系统提示词   │  │
│       │                     │  - 对话历史     │  │
│  ②resources/read          │  - 工具列表     │  │
│       │                     │  - 资源内容 ◄──┼──┼── 按需注入
│       ▼                     └───────┬────────┘  │
│  ┌──────────┐                       │           │
│  │ MCP      │                ┌──────▼──────┐    │
│  │ Server   │───────────────►│    LLM      │    │
│  │ (资源方) │                └─────────────┘    │
│  └──────────┘                                    │
└──────────────────────────────────────────────────┘
```

三个关键联系：

1. **Resource 是 Context 的"按需加载"机制**。System prompt 和历史记录是常驻的，Resource 是懒加载的。Host 根据对话进展决定把哪个资源读进来，避免一次性塞爆窗口。
2. **变更订阅**：MCP 支持 `resources/subscribe`，资源变化时 Server 发通知，Host 可以刷新上下文——这让 Agent 能"感知"外部数据的更新，而不靠轮询。
3. **来源可追溯**：每个资源有 URI，模型引用它时天然携带出处，这对需要 citation 的场景（法务、金融分析）是结构性优势，而 Tool 返回的结果通常是匿名文本。

### 5. 什么时候用 Tool、什么时候用 Resource

给一个决策流程，建立工程直觉：

```
这个操作会改变外部状态吗？
│
├─ 是 ──► Tool（且考虑是否需要审批/确认）
│
└─ 否（只读）──► 数据是固定可寻址的吗（有稳定 URI）？
                 │
                 ├─ 是 ──► Resource（可缓存、可订阅、可预加载）
                 │
                 └─ 否（需要动态计算，如"搜索""聚合查询"）
                          ──► Tool，但返回结果应引用/生成资源 URI
```

三条经验法则：

1. **读操作优先 Resource**，除非它需要参数化的动态计算（全文搜索、多表聚合），这时退化为 Tool。
2. **幂等的查询类 Tool 是设计坏味道**。`get_weather` 这类看起来必须用 Tool 的场景，也可以建模为 `weather://beijing/today` 资源模板——是否值得取决于调用频率（高频读 → Resource 收益大）。
3. **Resource 不占模型的工具调用预算**。模型可见的是工具列表，Resource 由 Host 管理，减少了模型需要"记住"的接口数量，降低了选择错误的概率。

---

## 代码实践：实现一个 MCP Resource Server

用 Python SDK 实现一个暴露"笔记"资源的 MCP Server，并对比一个等价的 Tool 写法，直观感受差异：

```python
from mcp.server.fastmcp import FastMCP

mcp = FastMCP("notes-server")

# 模拟一个外部数据源（真相在服务端，不在 Agent 侧）
NOTES = {
    "1": {"title": "架构决策", "body": "选择 Postgres 而非 MongoDB，因为事务需求"},
    "2": {"title": "发布记录", "body": "v1.2.0 于 2024-06-01 发布，含搜索功能"},
}

# ── Resource：静态资源 + 资源模板 ──────────────
@mcp.resource("notes://all")
def list_notes() -> str:
    """列出所有笔记（只读，可缓存）"""
    return "\n".join(f"[{k}] {v['title']}" for k, v in NOTES.items())

@mcp.resource("notes://{note_id}")
def get_note(note_id: str) -> str:
    """按 ID 读取单条笔记"""
    note = NOTES.get(note_id)
    return f"# {note['title']}\n{note['body']}" if note else "Not Found"

# ── 反例：把读操作写成 Tool（不推荐）──────────
@mcp.tool()
def read_note(note_id: str) -> str:
    """读取笔记 —— 注意：这是只读操作，做成 Tool 是坏味道"""
    note = NOTES.get(note_id)
    return f"# {note['title']}\n{note['body']}" if note else "Not Found"
```

客户端读取：

```python
# Host 侧：先发现，再读取
resources = await session.list_resources()          # 发现 notes://all
templates = await session.list_resource_templates() # 发现 notes://{note_id}
content = await session.read_resource("notes://1")  # 读取具体内容
```

**"Resource 和 Memory 到底有什么区别"的实践结论**：把上面的 `NOTES` 字典想象成 Memory 存储——如果你每次都把笔记内容写入 Memory，Agent 断连后数据就孤岛化，且源端更新后 Memory 里的副本变陈旧。而 Resource 方案下，Agent 只持有 URI 引用，读取时永远拿到当前值。**Memory 存的是"Agent 的理解"，Resource 承载的是"世界的现状"**。

---

## 实践练习与思考题

**练习**：为上文的 notes-server 编写一个 Client 脚本，完成：列出资源 → 发现资源模板 → 用模板参数读取一条笔记 → 故意读一个不存在的 URI，观察错误处理方式。

**思考题**：

1. 一个 `search_notes(keyword)` 接口，该做成 Resource 模板还是 Tool？提示：它有稳定 URI 吗？结果集是确定的吗？
2. 如果你要让 Agent "记住"用户上周说过的项目目标，这条信息应该进 Memory 还是做成 Resource？依据是什么？
3. `resources/subscribe` 能在哪些场景替代轮询式 Tool 调用？代价是什么（提示：连接保持、通知风暴）？

---

## 与 Agent Engineering 的关联

在真实 Agent 系统中，这个知识点直接决定三件事：

1. **上下文预算管理**：成熟的 Agent Host（如 Claude Desktop、Cursor）用 Resource 实现文档的按需加载，这是长任务 Agent 不爆窗口的核心手段之一。
2. **权限模型**：Resource 只读 → 可以安全地授予宽泛的读取权限；Tool 有副作用 → 需要细粒度授权和人工确认（human-in-the-loop）。把读操作误做成 Tool，会迫使你的审批流程对所有读取动作都弹确认框，用户体验崩塌。
3. **可观测性与追溯**：Resource 的 URI 天然构成数据血缘（data lineage），Agent 的每个结论都能回溯到具体资源版本，这是企业级 Agent 审计合规的基础。

一句话总结今天的工程直觉：**先问"这是读还是写"，再问"��相在谁手里"，两个问题答完，原语选择就定了。**

---

## FAQ

**Q1：Resource 内容会被自动塞进模型上下文吗？**
不会。Resource 是 application-controlled 的，Host 应用决定何时读取、是否注入。模型看到的只是 Host 转换后的上下文内容，而不是资源本身。这与 Tool 形成对比——Tool 会出现在模型的工具列表里，由模型决定调用。

**Q2：`get_user_profile` 这种查询接口，到底用 Tool 还是 Resource？**
看 URI 稳定性和调用频率。如果用户 ID 已知、数据可寻址（`db://users/123`），用 Resource 模板，享受缓存与订阅；如果需要动态计算（模糊查询、跨表聚合），用 Tool。介于两者之间时，优先 Resource——模型少一次工具调用决策，系统多一层缓存能力。

**Q3：Memory 可以用 MCP Resource 实现吗？**
可以但要想清楚。把 Memory 暴露成资源意味着"真相在 Memory 服务器手里"，Agent 只读——这适合"用户手册式"的长期事实。但 Memory 通常需要 Agent 写入，写操作就得回到 Tool（如 `memory/save`）。所以常见架构是：Memory Server 同时暴露 Resource（读）和 Tool（写）。

**Q4：Resource 和 RAG 是什么关系？**
RAG 是检索策略，Resource 是暴露协议。你可以把 RAG 检索到的文档片段包装成 MCP Resource（带 URI 指向原文），兼得检索的召回能力和 Resource 的可追溯性。二者是互补而非竞争。

**Q5：资源模板的 URI 参数有注入风险吗？**
有。`notes://{id}` 中的 `{id}` 来自 Host 侧拼装，Server 必须校验参数（白名单、类型检查、路径穿越防护），尤其是 `file://` 类资源，必须限制在声明的根目录内，否则会变成任意文件读取漏洞。

---

## 参考资料

- MCP 官方规范 — Resources：https://modelcontextprotocol.io/docs/concepts/resources
- MCP 官方规范 — Tools：https://modelcontextprotocol.io/docs/concepts/tools
- MCP Python SDK：https://github.com/modelcontextprotocol/python-sdk
- MCP 架构概览（Host/Client/Server 三角色）：https://modelcontextprotocol.io/docs/concepts/architecture
- Anthropic — Context Engineering for Agents（上下文工程与按需加载实践）：https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents

---

## 📋 本日知识点清单

- [ ] Tool = 做事情，Resource = 获取上下文/数据
- [ ] MCP Resource 的概念与使用场景
- [ ] Resource 与 Memory 的区别
- [ ] Resource 与 Context 系统的联系
- [ ] 什么时候用 Tool、什么时候用 Resource

## 📝 实践练习

实现 MCP Resource 获取，回答"Resource 和 Memory 到底有什么区别"。

---

*本文是「AI Agent 工程师」6 个月学习计划的一部分。学习路线：LLM → Inference → Runtime → Harness → Memory → Environment → Evaluation → Production。目标：Agent / AI Systems Engineer。*
