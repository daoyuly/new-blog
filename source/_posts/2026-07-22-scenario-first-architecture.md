---
title: Scenario First：场景优先的Agent架构
tags:
  - 情绪
  - agent
  - 认知科学
  - 持续认知
categories:
  - Agent 与情绪
series:
  - Agent 与情绪
description: >-
  上一篇拆完了情绪作为进化信号的完整链路：Expectation → Reality → Expectation Gap → Emotion →
  Resource Allocation → Behavior Adjustment → S...
keywords: 'scenario, first, 场景优先的agent架构, 情绪, agent, 认知科学, 持续认知, Agent 与情绪'
abbrlink: 13168
date: 2026-07-22 06:00:05
---

# 场景优先的Agent架构

上一篇拆完了情绪作为进化信号的完整链路：Expectation → Reality → Expectation Gap → Emotion → Resource Allocation → Behavior Adjustment → State Evolution → Agent Evolution。每一步都指向同一个事实——Agent 的认知活动始终围绕具体场景展开，不是围绕记忆条目展开。

这引出本系列的最终结论。

## 传统架构的问题

传统 Agent 架构是三个独立模块的拼接：

```
Memory + Persona + Emotion
```

Memory 存对话历史，Persona 定义角色特征，Emotion 生成情绪反应。三者通过 prompt 拼接或编排逻辑连接。

这个方案不太行。

问题出在拆分方式上。Memory、Emotion、Persona 描述的不是三件独立的事，而是同一个认知过程的三种表征。你回忆昨天和用户的对话（Memory），是因为当前场景需要（Scenario），回忆本身带有情绪色彩（Emotion），这次交互又更新了你对用户的理解（Persona）。

把它们拆成独立模块，等于人为制造三个信息孤岛，再花大量工程 effort 去同步。同步逻辑写在代码里、写在 prompt 里、写在各种 ad hoc 规则里。系统越复杂，缝合处越多，漏得越厉害。

## 最小认知单元

持续认知 Agent 需要一个最小认知单元——自包含、可组合、携带完整上下文的基础结构。

传统选的是 Memory。一条对话记录、一段摘要、一个 embedding 向量。但 Memory 有个致命缺陷：没有结构。

一条 Memory 说"用户昨天提到他妈生病了"。这条信息里没有目标、没有上下文、没有预期、没有结果。它只是事实碎片。要理解这条 Memory 的意义，必须回到它产生的场景。但场景信息早就丢了。

Memory 不是认知单元，是认知单元的残留物。化石不是恐龙。

Scenario 才是。

## 什么是 Scenario

```
Scenario = 目标 + 上下文 + 预期 + 行为 + 结果 + 情绪状态
```

一个 Scenario 描述的是：在某个上下文中，某个角色带着某个目标，产生了某个预期，执行了某些行为，得到某个结果，引发了某种情绪状态变化。

它自包含。拿到一个 Scenario，不需要额外信息就能理解发生了什么、为什么发生、产生了什么影响。

它可组合。Scenario 之间通过共享实体、目标、情绪关联，形成 Scenario Graph。

它携带完整上下文。目标、预期、情绪、策略全挂载在 Scenario 上，不需要外部查找。

## 认知演化链路

从原始数据到人物画像，完整链路：

```
Dialogue → Situation → Scenario → Scenario Graph → Persona
```

**Dialogue** 是原始观察数据。用户说了一句话，Agent 做了一次回复。最低层的数据，没有结构，没有意义。

**Situation** 是一次事件。从 Dialogue 中抽取出的离散事件——"用户询问了项目进度"。有时间、有参与者、有动作，但没有目标和预期。

**Scenario** 是具有目标与上下文的认知单元。从 Situation 演化而来：用户为什么问？预期什么？Agent 怎么回应？结果是否符合预期？这构成完整 Scenario。

**Scenario Graph** 是场景之间的关联网络。用户上周问过进度（Scenario A），这周又问了（Scenario B），两次之间的情绪变化、预期偏差、行为模式，构成图谱中的边。

**Persona** 是由 Scenario Graph 长期沉淀形成的人物画像。不是预先定义的标签，是从真实场景中涌现的模式。"这个用户倾向于在项目延期时焦虑"——这不是 Persona 模板里的字段，是从几十个相关 Scenario 中提取的规律。

这条链路单向演化。Dialogue 不可逆地变成 Situation，Situation 不可逆地变成 Scenario。但 Persona 不是终点——它反向影响 Agent 对新 Dialogue 的理解。用户说"进度怎么样"，Agent 激活相关 Scenario，调取 Persona 中的模式，做出更精准的判断。

## Memory 不是对话历史

传统做法：Memory = Conversation History。存所有对话，用 RAG 检索。

简单场景下能用，持续认知场景下不行。

对话历史是线性的，认知不是。用户今天聊项目进度，明天聊家庭，后天又绕回项目进度。对话历史按时间排列，但认知关联按场景关联。检索"用户对项目进度的态度"时，需要的不是"最近 N 条包含'进度'的消息"，而是"所有与项目进度相关的 Scenario 及其情绪状态"。

正确做法：

```
Memory = Scenario Graph
```

Memory 不是对话存档，是场景图谱。每条 Memory 是一个 Scenario 节点，节点上挂着目标、预期、结果、情绪。检索不是向量相似度匹配，是图谱遍历——从一个 Scenario 出发，沿关联边找到相关场景。

四个核心技术问题：

**场景抽取**：从 Dialogue 中识别 Situation，再从 Situation 构建 Scenario。需要识别目标、上下文、预期。这一步决定认知单元的质量。

**场景存储**：Scenario 不是文本块，是结构化对象。目标、预期、结果、情绪状态、参与者、时间、关联实体，每个字段独立存储，支持多维度检索。

**场景检索**：不是 embedding 相似度，是图谱查询。给定当前上下文，找到目标相关、情绪相关、实体相关的 Scenario 子图。检索结果是场景集合，不是一条条独立消息。

**场景演化**：Scenario 不是静态的。新信息到来时，已有 Scenario 可能被更新、合并、分裂。用户上次对进度焦虑（Scenario A），这次表示放心了（Scenario B），两个 Scenario 合并为一个带情绪变化轨迹的复合场景。

## 情绪挂载在场景上

传统做法：Emotion 是独立模块。输入文本，输出情绪标签。情绪和认知是两个系统，通过接口连接。

这不对。情绪不是独立于认知的外挂模块，情绪是认知状态变化的表征。

```
Emotion = Scenario State Change
```

情绪产生于预期与现实的偏差。偏差发生在具体场景中，不是凭空产生。

完整链路：

```
Dialogue
  ↓
Situation
  ↓
Scenario
  ↓
Expected Scenario
  ↓
Reality
  ↓
Expectation Gap
  ↓
Emotion
  ↓
Scenario Graph
  ↓
Persona
```

用户问"项目进度怎么样"（Dialogue），构成询问事件（Situation），Agent 识别为进度查询场景（Scenario），用户预期"进度正常"（Expected Scenario），实际"进度延期了"（Reality），预期偏差产生（Expectation Gap），用户感到焦虑（Emotion），情绪状态写入当前 Scenario，同时更新 Scenario Graph 和 Persona。

情绪不是凭空冒出来的标签，是场景状态变化的必然产物。不需要独立的情绪识别模块，需要的是在场景状态变化时自然计算出情绪。

## 数据结构设计

四个核心状态对象：

**Scenario State**：当前场景的目标、上下文、参与者、预期、当前状态、历史轨迹。最基础的状态对象，所有其他状态挂载在它上面。

**Expectation State**：当前场景中各方的预期。包括用户预期、Agent 预期、系统预期。预期不是静态的，随场景推进动态更新。

**Emotion State**：由 Expectation State 和 Reality 的差值计算得出。不是独立维护的情绪向量，是挂载在 Scenario 上的状态字段。包含情绪类型、强度、方向、来源。

**Persona State**：从 Scenario Graph 中提取的用户模式。不是预定义标签集合，是动态生成的特征向量。包括行为模式、情绪模式、预期模式、偏好模式。

关联关系：

```
Scenario State
├── Expectation State  (1:N，一个场景多方各有预期)
├── Emotion State      (1:1，每个场景一个当前情绪状态)
├── Goal               (1:1，每个场景一个主目标)
├── Strategy           (1:N，每个场景可有多策略)
└── Memory             (1:N，每个场景关联的历史场景)

Persona State
└── ← Scenario Graph   (N:1，多场景沉淀为一个画像)
```

## 状态管理

四个机制：

**状态更新**：每次新 Dialogue 进入，触发 Situation 识别，更新当前 Scenario State。更新不是覆盖，是追加。Scenario State 记录轨迹，不是快照。Expectation State 随新信息调整。Emotion State 由 Expectation Gap 重新计算。

**状态传播**：一个 Scenario 的状态变化传播到关联场景。用户在项目进度场景中焦虑，这个情绪状态传播到"工作"相关的其他 Scenario，影响 Agent 在那些场景中的预期和策略。传播强度随场景关联度衰减。

**状态衰减**：情绪不是永久的。Scenario 的 Emotion State 随时间衰减，衰减速率取决于情绪强度和场景重要性。高强度情绪衰减慢，低强度快速消退。衰减不是删除——情绪轨迹保留在 Scenario State 中，影响未来判断。

**状态恢复**：类似场景再次出现时，历史 Emotion State 被激活。用户上次对进度焦虑，下次再聊进度时，Agent 预激活焦虑相关的预期和策略。不是记忆检索，是场景级状态恢复。

## 情绪作为价值反馈

在持续认知系统中，情绪的核心作用是价值反馈。

Agent 面临的问题：资源有限，注意力有限，推理深度有限。怎么分配？

情绪给出信号：

**引导注意力**：高情绪强度的 Scenario 优先处理。用户焦虑的场景比平静的场景更需要 Agent 注意力。

**调节记忆**：高情绪强度的 Scenario 优先存储、优先检索、衰减更慢。平淡对话不需要长期保留，引发强烈情绪的场景必须记住。

**调节推理深度**：高情绪强度触发更深的推理链。用户随口一问，浅层推理够。用户带焦虑来问，Agent 需要深挖原因、评估影响、制定方案。

**调节资源分配**：情绪强度直接映射到计算资源分配。不是什么高深机制，就是 priority queue——情绪强度高的排前面。

## 最终架构

把整个系列串起来，持续认知 Agent 的架构是：

```
Scenario（最小认知单元）
│
├── Goal          (场景目标)
├── Context       (场景上下文)
├── Expectation   (预期状态)
├── Emotion       (情绪状态 = 场景状态变化)
├── Strategy      (行为策略)
├── Memory        (历史场景关联)
│
↓
Scenario Graph（场景关联网络）
│
↓
Persona（人物画像 = 场景图谱长期沉淀）
```

对比传统架构：

传统：`Memory + Persona + Emotion`，三个独立模块拼接。

持续认知：`Scenario → Scenario Graph → Persona`，一条演化链路。

区别不是把三个模块换个名字。区别在于认知单元的选择。

传统架构的认知单元是 Memory——一条对话记录、一个事实碎片。没有结构，没有目标，没有预期，没有情绪。只能在外面加壳：加 Persona 模块补充用户特征，加 Emotion 模块补充情绪状态，加 RAG 补充检索能力。加得越多，系统越臃肿，缝合处越多。

Scenario First 的认知单元是 Scenario——一个自包含的认知结构。目标、预期、情绪、策略、记忆全在里面。不需要外挂模块，不需要缝合。Agent 的认知活动就是在 Scenario Graph 上的遍历、更新、演化。

Memory 不是独立模块，是 Scenario 的历史关联。Emotion 不是独立模块，是 Scenario 的状态变化。Persona 不是独立模块，是 Scenario Graph 的沉淀结果。Goal 不是独立模块，是 Scenario 的核心字段。Strategy 不是独立模块，是 Scenario 的行为输出。

Scenario 是持续认知 Agent 的最小认知单元。不是 Memory，不是 Token，不是 Vector。是 Scenario。
