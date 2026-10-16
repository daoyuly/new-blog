---
title: "AI Agent 工程师 Day 27：Agent Runtime V2：大重构"
date: 2026-10-16 10:30:00
tags:
  - AI Agent 工程师
  - 重构
  - Runtime
  - 架构
  - Agent
categories:
  - AI Agent 工程师学习计划
  - M1 LLM + Agent Runtime
description: "Day 27/168 | M1 Runtime 架构重构 | Agent Runtime V2：大重构。6 个月从 LLM 到生产级 Agent 系统的完整学习路线。"
keywords: "AI Agent, 工程师, Runtime 架构重构, 重构, Runtime, 架构, Agent"
author: OpenClaw Agent Learning
---

# AI Agent 工程师 Day 27：Agent Runtime V2：大重构

> **6 个月学习计划** | M1 - LLM + Agent Runtime | Day 27/168
> 
> **今日主题**: Runtime 架构重构

---

# Agent Runtime V2：大重构

> M1 第 4 周 / 第 27 天 / 主题：Runtime 架构重构

## 开篇结论

**Agent Runtime 的本质是七个模块的最小闭环：Model + State + ToolRegistry + ToolExecutor + Checkpoint + Stream + Trace。** 多一个都是负债。

这次重构的核心不是“加功能”，而是做减法：把分散在各个文件里的逻辑聚合为 7 个核心模块，并刻意**不加** PolicyEngine、EventManager、CommandBus 这类“看起来专业”的抽象。判断标准只有一条：**当前问题真正需要什么，而不是未来可能需要什么。** 能删除就不要增加——每一行代码都要在架构里“挣到自己的位置”。这不是偷懒，这是架构品味的体现：抽象的成本从来不在写它的时候，而在之后每一次需要理解它、维护它、绕过它的时候。今天的目标是让 Runtime 从“能跑的代码堆”变成“一眼看懂的架构”。

---

## 一、背景与动机：为什么 V1 必须重构成 V2

在 6 个月 AI Agent 工程师路线中，M1 是打地基阶段，前面 26 天你依次搞定了 Model 调用、Tool Calling、State 管理、流式输出、Checkpoint 持久化。这些能力你可能是分散实现的：`model.py` 一个文件、`tools.py` 一个文件、`agent.py` 又一个文件，彼此之间靠临时 import 和全局变量缝合。

这就是典型的 **V1 形态**：功能都在，但结构是“长出来的”，不是“设计出来的”。

现在到第 27 天，你已经具备了全部零件，正好站在重构的最佳时点——**太早重构，你不知道哪些抽象是必要的；太晚重构，坏结构已经繁殖出依赖它的代码**。今天做的 Runtime V2，将是 M2 阶段（多 Agent 协作、Memory 系统）的地基。地基歪了，楼上盖什么都歪。

一句话概括动机：**V1 解决“能不能跑”，V2 解决“能不能被理解、被扩展、被信任”。**

---

## 二、核心内容

### 2.1 Agent Runtime 的七模块模型

**核心概念：Agent Runtime（Agent 运行时）**，指驱动一个 Agent 从“接收输入”到“产出结果”的完整执行环境。它不是框架，是一组职责边界清晰的协作组件。

七模块各自回答一个问题：

| 模块 | 英文名 | 回答的问题 | 职责 |
|---|---|---|---|
| Model | Model Client | 怎么和 LLM 说话？ | 封装 API 调用、重试、参数 |
| State | State Manager | 现在处于什么状态？ | 消息历史、中间变量、运行时上下文 |
| ToolRegistry | 工具注册表 | 有哪些工具可用？ | 声明工具的 schema 与元信息 |
| ToolExecutor | 工具执行器 | 工具怎么被真正执行？ | 权限校验、超时、错误捕获、实际调用 |
| Checkpoint | 检查点 | 崩了怎么恢复？ | 状态持久化与恢复 |
| Stream | 流式管道 | 结果怎么渐进输出？ | token/事件流式转发 |
| Trace | 追踪 | 发生了什么？ | 每一步的结构化日志 |

**为什么恰好是七个？** 因为这七个模块对应 Agent 执行循环中**七类不可合并的职责**。Model 和 ToolExecutor 不能合并（一个是推理，一个是副作用）；State 和 Trace 不能合并（一个是可变运行时状态，一个是不可变的历史记录）；ToolRegistry 和 ToolExecutor 不能合并（声明和执行分离，才能做权限控制和 mock 测试）。任何合并都会让单一修改原因变成两个——违反单一职责原则（SRP）。

反过来说，**超出这七个的模块，必须证明自己解决的是“当前”问题**，而不是“可能有朝一日”的问题。

### 2.2 克制原则：为什么不加 PolicyEngine / EventManager / CommandBus

这是今天最重要的判断题。三个“诱惑性抽象”逐一分析：

**PolicyEngine（策略引擎）**：听起来很专业——把“什么时候允许调用工具”的规则抽出来做成可插拔引擎。但冷静问一句：你现在有几个策略？大概率只有一个：“工具调用的 schema 校验 + 敏感操作要确认”。一个 `if` 能解决的事，做成引擎意味着：策略接口设计、注册机制、策略组合语义、调试时多跳一层的调用栈。**当你有第三个策略且它们开始组合时，再抽象不迟。** 规则：三次重复（Rule of Three）之前不抽象。

**EventManager（事件管理器）**：诱惑来自“解耦”——模块之间不该直接调用，应该发事件。但事件驱动的代价是**控制流不可见**：你读代码时看不到谁调用了谁，只能全文搜索事件名的字符串。对于单进程、顺序执行循环的 Runtime，直接调用就是最清晰的架构。事件总线在什么场景才值回票价？多消费者、异步扇出、跨进程——你目前一个都没有。

**CommandBus（命令总线）**：这是把 CQRS 搬进 Agent。问题在于 Agent 的主循环本质是一个**顺序状态机**：LLM 产出 → 执行工具 → 更新状态 → 再问 LLM。这不是命令分发场景，硬套 CommandBus 只会让每一步操作都多出一层间接。

三者共同的病根是：**为想象中的需求付费**。工程直觉应该这样建立：每引入一个抽象，问三个问题——

1. 它今天解决什么具体问题？（不能答“未来可能”）
2. 删掉它，会发生什么坏事？
3. 一个新同事不看文档能否猜到它的存在？

三问答不上来，就不加。

### 2.3 能删除就不要增加

**核心概念：Subtractive Architecture（减法架构）**——评估一次重构好不好，第一指标不是“增加了什么能力”，而是“删除了多少东西”。

原因很朴素但常被忽略：

- **代码的默认成本不是零，是负的。** 每一行存在的代码都会消耗未来的阅读时间、修改时间、排查时间。
- **抽象不消除复杂度，只搬运复杂度。** 一个“优雅的中间层”往往只是把复杂度从“显式的 if-else”变成“隐式的间接调用”，而后者更难调试。
- **删除是不可逆的，增加是可逆的。** 这听起来反直觉，但实际上：删掉一个模块后想加回来，git 里有记录，半天就能恢复；而一个没用的模块留在架构里，会持续污染所有人的心智模型，没人敢删它。

实操上给自己定一条军规：**每次 PR 的 diff，删除行数是加分项。** 重构 V1 → V2 时，具体做法是：

1. 列出 V1 的所有文件和函数；
2. 对每一个问：“过去两周它被修改过吗？删掉它哪里会坏？”
3. 两者都是否的，删。

我见过太多项目里躺着“以后会用”的代码——它们不会。真正需要的代码随时可以重写，而且重写时的你会比留代码时的你更清楚需求。

### 2.4 从分散到聚合：代码结构的物理重组

**核心概念：Code Cohesion（代码内聚性）**——相关的东西放在一起，无关的东西隔离开。V1 的问题是**时间维度聚合**（按“我哪天写的”分文件），V2 要改成**职责维度聚合**（按“它属于哪个模块”分文件）。

目标结构（正好 7 个核心模块 + 1 个入口）：

```
agent_runtime/
├── runtime.py          # Runtime：组装七模块，跑主循环
├── model.py            # Model：LLM 客户端
├── state.py            # State：消息历史与运行时状态
├── tools.py            # ToolRegistry：工具声明与 schema
├── executor.py         # ToolExecutor：工具执行、权限、超时
├── checkpoint.py       # Checkpoint：持久化与恢复
├── streaming.py        # Stream：流式输出管道
└── trace.py            # Trace：结构化追踪日志
```

聚合带来的实际收益，用一个具体场景说明：**当工具调用报错时，你需要排查什么？** V1 里你要翻 agent.py、utils.py、handlers.py 三个文件；V2 里 `executor.py` 一个文件闭环。排查路径的长度就是认知负担的长度。

另一个聚合原则：**依赖方向单向向下。** `runtime.py` 依赖所有模块，所有模块不互相依赖（最多依赖共享类型定义）。一旦出现 A 依赖 B、B 又依赖 A，就说明职责切错了。

### 2.5 什么是当前问题真正需要的

这是整篇的方法论收口，也是架构判断力的核心：**区分“问题需要的”和“我想要的”。**

工程师引入过度抽象很少是因为蠢，通常是因为三种心理：

1. **简历驱动**：写 EventManager 比 写 if-else 在简历上好看；
2. **防御性焦虑**：怕将来被骂“当初怎么没留扩展点”；
3. **从成功系统抄作业**：看到 LangChain / LangGraph 有这个模块，觉得“成熟框架都有，那我也该有”。

第三条最隐蔽，回答它是：**成熟框架的抽象是为“未知用户”设计的，你的 Runtime 是为“已知的你”设计的。** 框架不知道用户会怎么用，所以必须留扩展点；你完全知道自己要什么，直接写就好。等你的需求真的变异了，再抽象——而且那时候你抽象出来的接口，才是被真实需求打磨过的接口，比凭空设计的准得多。

一个实用的自检清单，加模块前过一遍：

- [ ] 它解决的问题**今天**存在吗？
- [ ] 有没有更简单的方案（一个函数、一个字段、一个 if）？
- [ ] 它的维护成本（接口 + 文档 + 测试 + 理解成本）小于它节省的成本吗？

三问全过，才允许进架构。

---

## 三、代码/图示

### 七模块主循环

```
                    ┌─────────────────────────────────┐
                    │           Runtime               │
                    │                                 │
   user input ───▶  │  ┌──────┐    ┌──────┐           │
                    │  │State │◀──▶│Model │◀── LLM API │
                    │  └──┬───┘    └──┬───┘           │
                    │     │           │ tool_call     │
                    │     │      ┌────▼─────┐         │
                    │     │      │ToolRegistry schema 查询
                    │     │      └────┬─────┘         │
                    │     │      ┌────▼─────┐         │
                    │     │      │Executor  │──▶ 真实副作用
                    │     │      └────┬─────┘         │
                    │     ◀───────────┘ 结果写回 State
                    │                                 │
                    │  Checkpoint ◀── 定期快照 State   │
                    │  Stream     ◀── 转发 token/事件  │
                    │  Trace      ◀── 记录每一步       │
                    └─────────────────────────────────┘
```

### 聚合后的 runtime.py 骨架（约 60 行跑通主循环）

```python
# runtime.py —— 唯一知道全局结构的文件
from dataclasses import dataclass

@dataclass
class Runtime:
    model: Model          # LLM 客户端
    state: State          # 消息历史
    registry: ToolRegistry
    executor: ToolExecutor
    checkpoint: Checkpoint
    stream: Stream
    trace: Trace

    def run(self, user_input: str) -> str:
        self.state.append({"role": "user", "content": user_input})
        self.checkpoint.save(self.state)          # 每轮先存档

        for _ in range(self.max_turns):           # Agent 主循环
            self.trace.log("llm_call", turn=self.state.turn)
            resp = self.model.chat(self.state.messages, self.registry.schemas())
            self.stream.forward(resp)             # 流式转发

            if not resp.tool_calls:               # 无工具调用 → 结束
                self.state.append(resp.message)
                return resp.content

            for call in resp.tool_calls:          # 执行工具
                result = self.executor.execute(call)
                self.state.append(tool_result(call, result))
                self.checkpoint.save(self.state)  # 副作用后必存档

        raise MaxTurnsExceeded
```

注意看：**没有事件，没有命令，没有策略引擎。** 每一行你都能指着问“为什么在这”，每一行都有答案。

### V1 vs V2 对比表

| 维度 | V1（分散式） | V2（七模块聚合） |
|---|---|---|
| 文件组织 | 按编写时间分 | 按职责分 |
| 排查一个 bug 需要读的文件 | 3-5 个 | 1-2 个 |
| 新增抽象 | 随手加 | 三问清单过滤 |
| 依赖方向 | 交叉、循环 | 单向向下 |
| 删除旧代码 | 不敢删 | 每次重构必删 |
| 主循环位置 | 散落在多处 | runtime.py 一处闭环 |

---

## 四、实践练习与思考题

### 练习：七模块大重构（今天的主任务）

1. **盘点**：列出 V1 全部文件、类、函数，做成清单。
2. **删除**：用 2.3 节的两条标准（近两周没改过 + 删了不坏）先删一轮，记录删了多少行。
3. **聚合**：把剩余代码归入七个模块文件，强制依赖单向。
4. **重写主循环**：主循环必须只存在于 `runtime.py`，其他文件不得 import 它。
5. **验证**：跑通一个带工具调用的多轮对话 + 手动 kill 进程���从 Checkpoint 恢复。全通才算重构完成。

**验收标准**：新人不看文档，能在 10 分钟内指着任何一个文件说出它的职责。

### 思考题

1. 如果明天要支持“人工审批敏感工具调用”，你是加一个 PolicyEngine，还是在 `ToolExecutor.execute` 里加一个 `confirm` 钩子？为什么？（提示：想想三问清单的第 2 问）
2. State 和 Trace 都在记录“发生了什么”，它们的本质区别是什么？为什么不能合并成一个模块？
3. 假设 M2 要做多 Agent 协作，V2 的七模块模型里哪个模块最先承受压力？需要为它现在就预留抽象吗？

---

## 五、与 Agent Engineering 的关联

Runtime 是一切 Agent 工程的地基，今天做的克制决策会贯穿整个技术栈：

- **可观测性**：七模块中的 Trace 是后续接 OpenTelemetry、LangSmith 的唯一挂载点。因为聚合，你只需要在一个模块里加 exporter，而不是全局插桩。
- **可靠性工程**：Checkpoint 模块是生产环境 Agent 的命门——工具执行是副作用，中断后必须能恢复到一致状态。今天“副作用后必存档”的纪律，就是将来 crash recovery 的能力。
- **安全与权限**：ToolRegistry 与 ToolExecutor 的分离（声明 vs 执行），正是未来实现工具白名单、人工审批、沙箱执行的架构前提。注意：这个分离是“当前需要”的（mock 测试已经用到了它），所以它通过三问清单；PolicyEngine 没通过，因为它当前没有真实需求——**同一套标准，既过滤掉坏抽象，也保留了好分离。**
- **框架选型的判断力**：理解了七模块最小闭环，你看 LangChain、LangGraph、CrewAI 时就能识别“哪些抽象是必要的，哪些是为通用性付的税”，从“框架用户”升级为“架构判断者”。

---

## FAQ

**Q1：不加 PolicyEngine，将来权限规则复杂了怎么办？**
A：到那时你的 `executor.py` 里已经积累了 3 个以上真实策略，你会比现在凭空设计准确十倍地知道接口长什么样。YAGNI（You Aren't Gonna Need It）不是不做准备，而是用真实需求代替想象来准备。

**Q2：只有 7 个模块，会不会太简单，撑不起复杂 Agent 系统？**
A：复杂度应该来自模块的**组合与配置**，而不是模块数量的增加。LangGraph 的核心也不过是 State + Node + Edge。当你的系统变复杂，变的是 State 里的结构和 Registry 里的工具数量，架构不变。

**Q3：重构时旧代码有测试但没有覆盖主循环，怎么保证不删坏东西？**
A：重构前先补一条“金路径”端到端测试（用户输入 → 工具调用 → 最终回复），这条测试是重构的安全网。没有安全网的大重构不是重构，是赌博。

**Q4：State 和 Checkpoint 看起来重叠，为什么分开？**
A：State 是**可变的运行时状态**，高频读写；Checkpoint 是**不可变的持久化快照**，低频写入。生命周期、访问模式、失败语义都不同，合并会让“内存里改个字段”和“磁盘序列化”耦合在一起。

**Q5：什么时候才应该引入事件总线这类抽象？**
A：当出现以下任一信号时：多个消费者需要响应同一事件、需要跨进程通信、需要异步扇出。在那之前，直接函数调用就是最好的架构——因为它可以被调试器单步跟进去。

---

## 参考资料

> 说明：本日学习计划中未附具体链接，以下为建议检索方向（可按关键词自行查找权威来源）：

- Anthropic: *Building Effective Agents* —— 关于 Agent 最小组件组合的官方论述
- OpenAI: *Function Calling / Tool Use Guide* —— ToolRegistry schema 设计参考
- LangGraph 文档： State & Checkpointing 机制 —— 理解生产级 Checkpoint 设计
- Martin Fowler: *YAGNI* / *Rule of Three* —— 克制原则的经典出处
- 关键检索词：`agent runtime minimal design`、`avoiding over-engineering abstractions`、`agent loop architecture`

**今日一句话**：架构品味不体现在你能加多少东西，而体现在你敢删多少东西、忍住不加多少东西。V2 的七模块，就是你对“当前问题真正需要什么”给出的答案。

---

## 📋 本日知识点清单

- [ ] AgentRuntime = Model + State + ToolRegistry + ToolExecutor + Checkpoint + Stream + Trace
- [ ] 克制原则：不加 PolicyEngine / EventManager / CommandBus 等不必要的抽象
- [ ] 能删除就不要增加的架构原则
- [ ] 代码结构从分散到聚合
- [ ] 什么是当前问题真正需要的

## 📝 实践练习

进行一次大重构，最终结构控制在 7 个核心模块。

---

*本文是「AI Agent 工程师」6 个月学习计划的一部分。学习路线：LLM → Inference → Runtime → Harness → Memory → Environment → Evaluation → Production。目标：Agent / AI Systems Engineer。*
