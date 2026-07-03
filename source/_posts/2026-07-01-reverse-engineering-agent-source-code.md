---
title: 逆向拆 Agent：从技术栈反推源码的研究方法论
tags:
  - Agent
  - 源码分析
  - 逆向工程
  - Prompt Engineering
  - Context Engineering
  - Harness Engineering
  - Loop Engineering
categories:
  - AI Agent
abbrlink: 47238
date: 2026-07-01 09:35:00
---

读 Agent 源码，大部分人习惯从入口文件开始，顺着调用链往下看。这种方法在传统软件上管用，在 Agent 上效率很低——因为 Agent 的核心逻辑不在代码里，而在 prompt、上下文组装、工具编排和循环控制里。

换个思路：**Agent 是用什么技术造的，就从什么技术入手去拆**。Prompt Engineering 造的就去读 prompt，Context Engineering 造的就去追踪上下文拼装，Harness Engineering 造的就去画工具编排图，Loop Engineering 造的就去跟循环状态机。这是逆向思维——不是从代码出发找逻辑，而是从技术出发找代码。

## 四大技术栈，四个入口

一个 Agent 系统的技术栈可以拆成四层：

```
┌─────────────────────────────┐
│      Loop Engineering       │  最上层：控制流
├─────────────────────────────┤
│    Harness Engineering      │  工具编排与约束
├─────────────────────────────┤
│    Context Engineering      │  上下文拼装与缓存
├─────────────────────────────┤
│    Prompt Engineering       │  最底层：指令设计
└─────────────────────────────┘
```

每层都有自己的一套设计模式，每层都有对应的源码入口。逐层拆解，就能拼出完整的系统图景。

## 一、Prompt Engineering：读指令，读意图

### 核心问题

Prompt 是 Agent 的"灵魂代码"。它定义了模型的行为边界、任务拆分方式、工具选择偏好、安全护栏。读懂了 prompt，就读懂了设计者的全部意图。

### 逆向方法

1. **提取所有 prompt 文本**——不只是系统 prompt，工具 prompt 同等重要。Claude Code 有 914 行系统 prompt + 36 个工具 prompt，每个工具的 prompt 都是独立的"API 文档"。
2. **画合成链**——prompt 怎么拼接、顺序是什么、覆盖优先级怎么排。Claude Code 的 `buildEffectiveSystemPrompt` 有 7 层优先级，越靠前越"硬"，安全基座在最底层。
3. **找缓存边界**——哪些是静态的、哪些是动态的，为什么这样分。Claude Code 用 `SYSTEM_PROMPT_DYNAMIC_BOUNDARY` 把 prompt 数组切成两半，前半可跨用户缓存，后半每轮重算。
4. **分析规则的存在理由**——每条规则都是踩坑的产物。"不要重试被拒绝的调用"是对抗模型的目标完成倾向，"先读再改"是 prompt 和代码的双重约束。
5. **对比内部/外部差异**——同一个项目给不同用户不同 prompt，差异本身就是信息。Claude Code 的内部用户多了一套"如实报告"规则，说明模型确实会在没验证时声称成功。

### 典型源码入口

```
constants/prompts.ts          → 主系统 prompt
tools/*/prompt.ts             → 工具级 prompt  
utils/systemPrompt.ts         → 合成逻辑
constants/systemPromptSections.ts → 缓存机制
```

### 实战案例

Claude Code 的 `getSimpleDoingTasksSection()` 里有三条递进规则：不要加多余功能、不要加不可能发生的错误处理、三行相似代码好过过早抽象。这三条不是空话——它们在对抗 LLM 天然的"多做一点"倾向。理解了这一点，你就知道这段 prompt 不是在教模型写代码，而是在**刹车**。

## 二、Context Engineering：追拼装，追流动

### 核心问题

上下文工程解决的问题是：每次调用模型时，往上下文窗口里塞什么、塞多少、以什么顺序塞。这比写 prompt 更难，因为上下文是动态的、有容量限制的、有缓存经济性考虑的。

### 逆向方法

1. **追踪上下文拼装函数**——找到"最终发给模型的消息"是在哪里组装的。Claude Code 的路径是 `api.ts → assembleMessages → splitSysPromptPrefix + buildSystemPromptBlocks`。
2. **区分系统侧 vs 用户侧**——Claude Code 把安全敏感、易变、需审计的内容放系统侧（OS、路径、git 状态），项目长期知识放用户侧（CLAUDE.md）。这个分离不是随意的——系统侧内容更难被用户注入攻击。
3. **找 attachment 机制**——很多上下文不是塞在 prompt 里的，而是作为消息附件动态注入。Claude Code 的 plan mode、auto mode 切换、分类器结果都走 attachment。好处是按会话开关，不浪费 token。
4. **追踪压缩/摘要路径**——对话超过上下文窗口怎么办？Claude Code 有自动压缩机制，`compaction` 模块负责把历史消息摘要化。找到这个模块，就知道系统怎么处理长对话。
5. **画 token 流向图**——每个 token 从哪来（prompt？工具结果？用户消息？），到哪去（缓存？摘要？丢弃？），什么时候被丢弃。

### 典型源码入口

```
utils/api.ts                  → 消息组装
services/compact/             → 上下文压缩
constants/attachments.ts      → 附件注入
memdir/memdir.ts              → 记忆加载
```

### 实战案例

Claude Code 的 `prependUserContext` 函数把 CLAUDE.md 内容作为"前置用户消息"而非系统消息注入。为什么？因为 CLAUDE.md 是用户可编辑的，如果放在系统侧，用户可能通过它注入系统指令。放在用户侧，权限更低，更安全。这个设计选择体现了上下文工程不只是"拼字符串"，而是**安全架构的一部分**。

## 三、Harness Engineering：画编排，画约束

### 核心问题

Harness 是 Agent 的"骨架"——它定义了模型能调用哪些工具、工具之间怎么约束、权限怎么控制、结果怎么验证。Harness 决定了 Agent 的能力上限和安全下限。

### 逆向方法

1. **枚举所有工具**——每个工具是一个能力单元。Claude Code 有 36 个工具，每个有独立的 prompt、schema 和权限控制。
2. **画工具依赖图**——哪些工具调用其他工具？Agent Tool 可以调用所有工具，File Edit Tool 依赖 File Read Tool 的结果。依赖关系揭示了系统的层级结构。
3. **找权限控制点**——每个工具的 `isConcurrencySafe` 属性决定了能否并行调用。File Edit 不能和另一个 File Edit 并行（会冲突），但 Read 可以和任何工具并行。
4. **追踪工具注册与门控**——哪些工具是默认启用的，哪些需要 feature flag？Claude Code 用 `feature()` 函数做编译时门控，用 `enabledTools` 做运行时门控。两道门，双重控制。
5. **找 sandbox 边界**——Bash Tool 有沙箱机制，控制文件系统和网络访问。SandboxManager 从多个来源合并配置，沙箱配置本身也注入到 prompt 里让模型知道。
6. **分析子 agent 编排**——Agent Tool 是最复杂的编排点。它有 fork 模式（继承上下文）和 subagent 模式（从零开始），有 worktree 隔离，有 remote 执行。这些模式的选择逻辑藏在 prompt 和代码里。

### 典型源码入口

```
tools/*/                      → 每个工具的实现
Tool.ts                       → 工具基类与接口
utils/permissions/            → 权限控制
utils/sandbox/                → 沙箱管理
tools/AgentTool/              → 子 agent 编排
```

### 实战案例

Claude Code 的 Agent Tool prompt 里有这样一句："**Don't peek.** The tool result includes an output_file path — do not Read or tail it unless the user explicitly asks." 这不是技术限制（代码不会阻止你读），而是 prompt 级的约束。为什么？因为读子 agent 的中间输出会把它拉回主上下文，抵消了委托的目的——节省上下文空间。这个约束不是安全的，是**经济的**。

## 四、Loop Engineering：跟状态，跟控制流

### 核心问题

Agent 不是调用一次模型就完事的，它是一个循环：接收输入 → 模型推理 → 工具调用 → 观察结果 → 再推理。Loop Engineering 解决的是这个循环怎么转、什么时候停、怎么恢复。

### 逆向方法

1. **找主循环入口**——Claude Code 的主循环在 `query()` 函数里，它调 Anthropic API，拿到模型响应，处理工具调用，再把结果喂回去，直到模型不再调用工具。
2. **追踪状态机**——Agent 有哪些状态？Claude Code 有普通模式、Plan 模式、Proactive 模式、Worktree 模式。每个模式有不同的 prompt、不同的工具集、不同的循环行为。找到模式切换的触发条件，就找到了状态机。
3. **找中断与恢复机制**——循环不是铁板一块。用户可以在工具调用时拒绝（权限弹窗），可以中途切换模式，可以 Ctrl+C 打断。每个中断点都有对应的恢复逻辑。
4. **追踪主动模式（Proactive）的 tick 机制**——Claude Code 的 Proactive 模式用 `<tick>` 标签驱动循环：系统定期发 tick，agent 醒来干活，没活就 sleep。这是一个完全不同的循环范式——不是用户驱动的，是时间驱动的。
5. **找循环终止条件**——什么时候停止？模型不再调用工具？用户说停？达到 token 预算？每种终止条件都有对应的清理逻辑。

### 典型源码入口

```
core/query.ts                 → 主循环
proactive/                    → 主动模式
commands/                     → 模式切换命令
tools/SleepTool/              → 循环控制工具
services/cron/                → 定时任务
```

### 实战案例

Claude Code 的 Proactive 模式 prompt 里有一条看似矛盾的设计："**If you have nothing useful to do on a tick, you MUST call SleepTool.** Never respond with only a status message." 为什么不允许"无事可做"的文字回复？因为每次模型调用都花 token，如果模型只回了一句"still waiting"，那就是白烧钱。SleepTool 不触发模型调用，是真正的暂停。这条规则是 Loop Engineering 层面的**成本优化**。

## 四层交叉验证

这四层不是孤立的，它们互相引用、互相约束。交叉验证能发现更深的设计意图：

| 交叉点 | 问题 | 例子 |
|--------|------|------|
| Prompt × Harness | prompt 里的规则有没有代码级约束？ | "先读再改"在 prompt 和代码里都做了检查 |
| Prompt × Loop | 循环控制逻辑是写在 prompt 里还是代码里？ | Proactive 的 pacing 规则在 prompt 里，tick 机制在代码里 |
| Context × Loop | 上下文压缩怎么影响循环行为？ | 压缩后 agent 可能"忘记"之前的决定，需要 prompt 补救 |
| Harness × Context | 工具结果怎么进入上下文？ | Agent Tool 的结果不在主上下文里（fork 模式），避免膨胀 |

一个高质量的 Agent 项目，约束会出现在多个层面。如果 prompt 说"不要做 X"但代码里没有检查，这个约束就是不可靠的。反过来，如果代码里有检查但 prompt 没提，模型可能在检查之前就走了弯路。

## 逆向方法论的推广

这个逆向思路不只适用于 Claude Code，可以推广到任何 Agent 项目：

### 推广到 LangChain / LlamaIndex

- **Prompt 层**：找 `SystemMessagePromptTemplate`、`ChatPromptTemplate`
- **Context 层**：找 retriever、memory、conversation buffer 的组装逻辑
- **Harness 层**：找 tool decorator、`@tool` 定义、StructuredTool 子类
- **Loop 层**：找 `AgentExecutor` 的 `_call` 方法，看循环怎么转

### 推广到 AutoGPT / CrewAI

- **Prompt 层**：找 agent 的 `role`、`goal`、`backstory` 定义
- **Context 层**：找 memory 系统（短期/长期/实体记忆）的注入点
- **Harness 层**：找 tool 定义和任务分配逻辑
- **Loop 层**：找 planning 循环、task 依赖图、crew 的执行流程

### 推广到 OpenClaw

- **Prompt 层**：找 `SOUL.md`、`AGENTS.md`、skill 的 `SKILL.md`
- **Context 层**：找 workspace 文件注入、HEARTBEAT 机制、session 历史
- **Harness 层**：找 tool policy、capability 控制、node 配对
- **Loop 层**：找 heartbeat 循环、cron 调度、sub-agent 编排

## 检查清单

拿到一个新的 Agent 项目，按这个顺序走一遍：

```
□ 提取所有 prompt，画合成链和覆盖优先级
□ 找上下文拼装函数，区分系统侧和用户侧
□ 枚举所有工具，画依赖图和权限矩阵
□ 找主循环，画状态机和中断/恢复点
□ 做 Prompt × Harness 交叉验证：prompt 规则有代码支撑吗？
□ 做 Prompt × Loop 交叉验证：循环控制在哪一层？
□ 做 Context × Loop 交叉验证：压缩怎么影响行为？
□ 找内外差异、feature flag、A/B 测试——这些是设计意图的直接证据
```

## 为什么要逆向

正向读代码，你看到的是"怎么实现的"。逆向从技术栈出发，你看到的是"为什么这样实现"。

Claude Code 的 prompt 里有一条："不要为不可能发生的场景加错误处理"。如果正向读代码，你只看到这条规则。如果逆向思考——"LLM 为什么要被提醒不要加错误处理？因为 LLM 天然会过度防御"——你就理解了这条规则存在的原因，也理解了整个 prompt 体系的设计哲学：**不是教模型做什么，而是约束模型不做什么**。

逆向思维的核心假设是：**Agent 系统的每一个设计选择，都是对某种已知失败的回应**。找到失败模式，就找到了设计意图。

## 参考资料

- [Claude Code 源码](https://github.com/anthropics/claude-code) — 本文主要分析对象
- [Prompt Engineering 技术综述](https://arxiv.org/abs/2406.06608) — The Prompt Report, 2024
- [Context Engineering 理论与实践](https://arxiv.org/abs/2504.10955) — 上下文工程系统性研究
- [ReAct: Synergizing Reasoning and Acting](https://arxiv.org/abs/2210.03629) — Agent 推理-行动循环范式
- [Tool Learning with Foundation Models](https://arxiv.org/abs/2305.16534) — 工具使用与编排理论
- [The Landscape of Emerging AI Agent Architectures](https://arxiv.org/abs/2404.11584) — Agent 架构综述
- [Constitutional AI](https://arxiv.org/abs/2212.08011) — 安全对齐方法论
- [LangChain 源码](https://github.com/langchain-ai/langchain) — 对比分析参考
- [AutoGPT 源码](https://github.com/Significant-Gravitas/AutoGPT) — 对比分析参考
- [CrewAI 文档](https://docs.crewai.com/) — 多 Agent 编排框架
- [OpenClaw 文档](https://docs.openclaw.ai) — Agent 运行时参考
