---
title: Loop Engineering 深度综述：从手动 Prompt 到自主循环的工程范式迁移
tags:
  - Loop Engineering
  - AI Agent
  - Harness Engineering
  - 自主编程
  - Claude Code
  - Codex
  - 编排
  - 软件工程
categories:
  - AI
  - Engineering
abbrlink: 83127
date: 2026-06-14 20:45:00
description: "2026 年 6 月，\"Loop Engineering\"在 AI 工程社区爆发式传播。这不是又一个炒作概念——它精确地描述了一个正在发生的范式迁移：人从 Agent 循环的内部走向外部，从执行者变成设计者。"
keywords: "loop, engineering, 深度综述, 从手动, prompt, 到自主循环的工程范式迁移, Loop Engineering, AI Agent"
---

# Loop Engineering 深度综述：从手动 Prompt 到自主循环的工程范式迁移

> "你不应该再手动 prompt coding agent 了。你应该设计 loop 来 prompt 你的 agent。"
> — Peter Steinberger
>
> "我不再 prompt Claude 了。我写 loop 让它们运行，loop 去 prompt Claude 并决定下一步做什么。我的工作是写 loop。"
> — Boris Cherny, Claude Code 负责人

2026 年 6 月，"Loop Engineering"在 AI 工程社区爆发式传播。这不是又一个炒作概念——它精确地描述了一个正在发生的范式迁移：**人从 Agent 循环的内部走向外部，从执行者变成设计者**。

本文综合 LoopEngineer.ai、Addy Osmani、Boris Cherny、Ben's Bites 等多方信息源，结合 Anthropic 最新披露的内部数据，从概念、架构、实现、趋势四个层面深度综述 Loop Engineering。

---

## 一、定义：什么是 Loop Engineering？

### 1.1 核心定义

**Loop Engineering 是构建驱动 AI Agent 的系统，而不是构建单个 prompt。**

传统模式：人 → 写 prompt → Agent 输出 → 人读结果 → 人写新 prompt → …
Loop 模式：人 → 设计 loop → loop 自动 prompt Agent → loop 读输出 → loop 判断是否完成 → loop 自动重 prompt 或终止

一句话：**Loop = Cron + 决策器**。模型变成子程序，人变成 loop 的作者。

### 1.2 与相关概念的关系

Loop Engineering 不是凭空出现的，它处于一个清晰的概念层级中：

```
Prompt Engineering     →  怎么跟模型说话
Harness Engineering    →  怎么给模型造运行环境
Loop Engineering       →  怎么让运行环境自己跑起来
Factory Model          →  怎么让多个 loop 协同产出软件
```

Addy Osmani 的精确定位：**Loop Engineering sits one floor above the harness. The harness runs on a timer, it spawns little helpers, and it feeds itself.**

Harness 是静态的基础设施，Loop 是动态的编排层。Harness 解决"Agent 能不能跑"，Loop 解决"Agent 跑不跑、怎么跑、跑到什么时候停"。

---

## 二、演进史：从 ReAct 到多 Agent 编排

| 阶段 | 时间 | 核心思想 | 局限性 |
|------|------|---------|--------|
| **ReAct** | 2022 | 推理+行动交替进行 | 单步推理，无自主循环 |
| **AutoGPT** | 2023 | 全自主 Agent，设定目标后自动执行 | 容易失控，缺乏有效终止条件 |
| **Ralph Loop** | 2025 | 引入结构化循环验证 | 仍需人工介入验证 |
| **/goal 和 /loop** | 2026 | 声明式目标 + 自动循环 | 需要精心设计目标描述 |
| **多 Agent 编排** | 2026 | 多个 Agent 协同完成复杂任务 | 编排复杂度指数级增长 |

这个演进路径的核心趋势：**从"人驱动 Agent"到"人设计 Agent 驱动系统"**。

AutoGPT 是第一个"让 Agent 自主循环"的尝试，但它的失败恰好定义了 Loop Engineering 需要解决的核心问题——没有终止条件的自主循环就是灾难。

---

## 三、架构：Loop 的六个原语

Addy Osmani 在其深度文章中总结了 Loop 的五个原语加一个持久状态。这个框架同时映射到 Codex 和 Claude Code 两大产品，说明它不是工具特定的，而是 loop 本身的结构。

### 3.1 六原语总览

| 原语 | Loop 中的角色 | Codex 实现 | Claude Code 实现 |
|------|-------------|-----------|-----------------|
| **Automations** | 定时发现与分诊 | Automations tab + /goal | /loop + /goal + hooks + GitHub Actions |
| **Worktrees** | 并行隔离 | 内置 worktree per thread | git worktree + --worktree + isolation: worktree |
| **Skills** | 固化项目知识 | SKILL.md, $name 调用 | SKILL.md, 隐式匹配 |
| **Connectors** | 连接外部工具 | MCP Connectors + Plugins | MCP servers + Plugins |
| **Sub-agents** | 制作与审查分离 | .codex/agents/ TOML | .claude/agents/ + agent teams |
| **State** | 跨会话记忆 | Markdown / Linear | AGENTS.md / progress files / Linear |

### 3.2 Automations：Loop 的心跳

Automations 是 loop 之所以叫 loop 的原因——不是跑一次就结束，而是持续运行、持续发现。

- **Codex**：Automations tab，选项目、prompt、频率、环境，发现的问题进 Triage inbox，没发现的自动归档
- **Claude Code**：/loop 按频率重跑，/goal 跑到条件满足为止，hooks 在生命周期特定节点触发，GitHub Actions 让 loop 在关机后继续跑

`/goal` 是最重要的原语：给定一个可验证的终止条件（如"test/auth 全通过且 lint clean"），Agent 持续工作直到满足。**关键的架构决策：判断是否完成的不是干活的模型，而是另一个独立的小模型**——制造者不批改自己的作业。

### 3.3 Worktrees：并行不冲突

两个 Agent 同时写同一个文件 = 两个工程师同时改同一行代码 = 灾难。Git worktree 让每个 Agent 有独立的 checkout，物理上不可能互相覆盖。

**但 Addy Osmani 指出了一个更深层的限制**：worktrees 解决了机械冲突，但你的 review 带宽才是真正的上限。不是工具决定你能跑多少并行 Agent，而是你能审核多少。

### 3.4 Skills：意图的固化

Skill 的本质不是"教 Agent 做事"，而是**把意图固化到磁盘上**。

Agent 每次启动都是失忆的。没有 skill，loop 每个循环都从零推导你的项目约定；有 skill，意图被写在外面，agent 每次运行都读取。"我们不用这种方式是因为那次事故"——这种隐性知识只有 skill 能传递。

**Skill 是 authoring format，Plugin 是分发 format。** 这两个概念要分开：你写 skill 描述怎么做，你包成 plugin 给别人用。

### 3.5 Connectors：Loop 触达真实世界

只能看文件系统的 loop 是微小的 loop。MCP 连接器让 Agent 读 issue tracker、查数据库、调 staging API、发 Slack 消息。

**区别在于**：没有 connector 的 Agent 说"这是修复方案"；有 connector 的 loop 自己开 PR、关联 Linear ticket、CI 绿了后 ping 频道。

### 3.6 Sub-agents：制造者与审查者分离

Loop 运行时你不在旁边看着——所以**你信任的验证器是唯一让你敢走开的东西**。

最有效的结构：一个 Agent 写代码，一个不同指令（甚至不同模型）的 Agent 审查。写代码的模型对自己太客气了，第二双眼睛能抓住第一个说服自己的东西。

代价：sub-agent 烧更多 token。花在值得第二意见的地方。

### 3.7 State：Agent 忘记，仓库不忘记

第六个原语，看似最简单，实则最关键：**模型在两次运行之间忘记一切，所以记忆必须在磁盘上，不在上下文里**。

一个 markdown 文件、一个 Linear board、任何存在于单次对话之外的东西。听起来太简单以至于不重要——但 Addy Osmani 反复强调：**This is the same trick every long-running agent depends on.**

---

## 四、AI 辅助工作的三个高度

Boris Cherny 提出的"阶梯"模型：

### 高度 1：带自动补全的手写代码

人写代码，模型建议补全。最快写简单代码的方式，但人仍在 loop 内。

### 高度 2：并行运行多个 Agent 会话

启动多个 Agent 探索不同方案，人决定推进哪个。人仍在做决策和指挥。

### 高度 3：编写 Loop 来替你 Prompt Agent

人写决策器，loop 和模型自主运行。人只在 loop 卡住或需要优化时介入。

**核心洞察：每上升一个高度，人的角色从执行者变成设计者。**

Boris Cherny 的数据点：最近 30 天，100% 对 Claude Code 的贡献（259 个 PR）都是由 Claude Code 自己写的。他的工作不再是写代码，而是设计让 Claude Code 写代码的 loop。

---

## 五、真实数据：Anthropic 内部的证据

Anthropic 在 2026 年 6 月发布的《When AI builds itself》提供了 Loop Engineering 的真实生产力数据：

| 指标 | 数值 |
|------|------|
| Claude 写的代码占合并总量 | >80% (2026年5月) |
| 工程师日均代码合并量 | 比 2024 年增长 8x |
| 开放式任务成功率 | 76% (2026年5月，半年前 26%) |
| Claude 自主优化训练代码加速 | 从 3x (2025年5月) 到 52x (2026年4月) |

两个拐点：
1. **2025年初**：Claude 从"建议代码"变成"自己跑代码"——代码量开始攀升
2. **2026年初**：模型开始长时间自主工作——斜率再次陡增

这些数据印证了 Loop Engineering 的核心假设：**当 Agent 可以在 loop 中自主运行时，人的产出不取决于写代码的速度，而取决于设计 loop 的质量。**

---

## 六、一个真实 Loop 的形状

综合 Addy Osmani 的描述，一个典型的 loop 长这样：

```
1. Automation 每天早上在 repo 上运行
   → 调用 $triage skill，扫描新 issue 和 CI 失败
   → 结果写入 progress.md（State）

2. Loop 读取 progress.md，找到最高优先级任务
   → 派出 sub-agent A（实现者，用 fast model）
   → 在独立 worktree 中工作
   → 完成后派 sub-agent B（审查者，用 strong model）
   → 审查通过 → 开 PR + 关联 Linear ticket（Connector）
   → 审查不通过 → 反馈写回 progress.md，A 重新尝试

3. /goal 判断："所有 P0 issue 已关闭且 CI green"
   → 满足 → loop 终止，通知人
   → 超过迭代上限 → 终止，升级给人

4. 预算控制：max 15 iterations / $5 / 300s
```

人介入的时机：loop 卡住、需要方向调整、审查最终结果。

---

## 七、挑战与风险

### 7.1 Token 成本

Ben's Bites 的提醒很直接：**usage patterns can vary wildly if you are token rich or poor**。一个设计不当的 loop 可以在几小时内烧掉数十美元。预算上限不是可选项，是前提。

### 7.2 质量保证

Anthropic 内部数据：Claude 写的代码在 2025 年底仍比人差，2026 年中大致持平，预计年底超越人类。但"能跑"和"可维护"是两件事——**模型写的代码越多，审查负担越重**。Mikhail Parakhin（前微软）的观察："模型写更好的代码，但我们用它们写更多代码——不是更好的代码。"

### 7.3 可调试性

当 loop 出错时，"为什么做了这个决策"是最难回答的问题。需要：
- 每个 iteration 的完整日志
- 决策树追踪
- 人可读的 state 变更记录

### 7.4 编排税

Addy Osmani 提出的概念：**你的 review 带宽是并行度的真正上限**。5 个并行 Agent 听起来很酷，但如果你每小时只能认真审查 1 个 PR，其他 4 个就是在浪费 token。

### 7.5 失控风险

AutoGPT 的教训：没有终止条件的自主 loop 是灾难。Loop Engineering 的第一条规则——**设计清晰终止行为**——正是从 AutoGPT 的失败中学到的。

---

## 八、Loop Engineering 的行业生态

### 8.1 人才市场

- **LoopEngineer.ai**：专门为 Loop Engineer 匹配工作的平台，审核制，invite-only
- **薪资范围**：$150k-$300k+/年，与资深 AI 工程师角色相当
- **需求增长**：2026 年 AI 工程领域增长最快的角色

### 8.2 框架与工具

| 工具 | Loop Engineering 支持 |
|------|---------------------|
| **Claude Code** | /goal, /loop, hooks, sub-agents, skills, worktree |
| **Codex App** | Automations, /goal, sub-agents, skills, worktree |
| **Cursor** | Agent 模式自动循环 |
| **OpenClaw** | Skills 系统、心跳机制、子 Agent 编排 |
| **LangGraph** | 状态图驱动的 Agent 循环 |
| **CrewAI** | 多 Agent 协作 + 任务循环 |
| **AutoGen** | 多 Agent 对话循环 |

### 8.3 Skills 生态

- **skills.sh**（Vercel）：600k+ skills 的 API，可查询和集成
- **Codex Skills**：TOML 定义的 skill 格式，可打包为 plugin 分发
- **Claude Code Skills**：SKILL.md 格式，隐式匹配 + 显式调用
- **Firecrawl Workflows**：可安装的 web 任务 skill（深度研究、SEO 审计等）
- **Colab CLI + Skills**：Google Colab 的 skill 体系，支持 GPU/TPU 按需调用

---

## 九、如何成为 Loop Engineer

### 9.1 思维转变

| 从 | 到 |
|----|-----|
| 我写代码 | 我设计写代码的系统 |
| 我 prompt Agent | 我设计 prompt Agent 的 loop |
| 我验证结果 | 我设计验证结果的机制 |
| 我在循环里 | 我在循环外 |

### 9.2 技能栈

1. **编程基础**：Python/TypeScript（loop 本身就是程序）
2. **系统设计**：分布式系统、状态管理、故障恢复
3. **LLM 理解**：能力边界、失效模式、token 经济学
4. **评估设计**：量化 Agent 输出质量的评估体系
5. **编排能力**：多 Agent 协同、任务分解、依赖管理
6. **Skills 设计**：把隐性知识编码为可复用的 SKILL.md

### 9.3 入门路径

1. 从简单 loop 开始：自动修复 lint 错误的 loop
2. 加入验证、终止条件、预算控制
3. 尝试 sub-agent 编排：一个写，一个审
4. 构建可复用 skill 库
5. 设计完整的自主工作流

---

## 十、趋势判断

### 10.1 Loop 会成为默认开发模式

当 Codex 和 Claude Code 都内置了 /goal、/loop、automations，当 Boris Cherny 100% 的 PR 都由 Agent 写，Loop Engineering 不是一种选择，而是默认模式的迁移。就像 Git 取代 SVN 不是因为 SVN 不能用，而是因为并行工作流成为默认需求。

### 10.2 人从"写代码"变成"写写代码的系统"

这不是消亡，是升级。问题空间变大了，技能天花板更高了。但门槛也更高了——不是所有人都能完成这个跃迁。

### 10.3 递归自我改进的阴影

Anthropic 的数据已经展示了递归自我改进的雏形：Claude 正在帮助训练下一个 Claude。当 loop 足够成熟，Agent 可以自主设计、实现、验证、部署下一个 Agent 时，我们就站在了递归自我改进的门槛上。Anthropic 专门撰文讨论了这个可能性及其风险——**这是 Loop Engineering 最深远的影响，也是最需要提前思考的。**

### 10.4 Review 带宽是新瓶颈

写代码不再是瓶颈，审查代码才是。当 Agent 每天产出 8x 的代码量，人的审查能力没有 8x 增长。**编排税（Orchestration Tax）** 将成为 Loop Engineering 最核心的工程挑战。

---

## 总结

Loop Engineering 是 2026 年 AI 工程领域最真实的范式迁移。它不是 prompt engineering 的进化版，而是工作方式的根本转变：

1. **Loop = Cron + 决策器**，模型是子程序
2. **六个原语**：Automations、Worktrees、Skills、Connectors、Sub-agents、State
3. **三个高度**：手写补全 → 并行 Agent → 自主 Loop
4. **核心能力**：终止设计、自验证、预算控制、可复用 Skills
5. **真实数据**：Anthropic 内部 80%+ 代码由 Claude 编写，8x 产出增长
6. **最大风险**：token 成本失控、审查带宽不足、递归自我改进
7. **核心判断**：Review 带宽是新瓶颈，编排税是核心挑战

Loop Engineering 回答了一个问题：**当 Agent 足够聪明时，人做什么？** 答案是：人设计让 Agent 自主运行的系统，然后只在系统卡住时介入。你不是司机了，你是调度中心。

---

*参考资料：*
- *[LoopEngineer.ai](https://loopengineer.ai) — Loop Engineer 定义与招聘平台*
- *[Addy Osmani: Loop Engineering](https://addyosmani.com/blog/loop-engineering/) — 六原语框架与 Codex/Claude Code 映射*
- *[Anthropic Institute: When AI builds itself](https://www.anthropic.com/institute/recursive-self-improvement) — Anthropic 内部 AI 辅助开发数据*
- *[Ben's Bites: Hey Siri, meet AI](https://bensbites.com/p/hey-siri-meet-ai) — 社区讨论与工具生态*
