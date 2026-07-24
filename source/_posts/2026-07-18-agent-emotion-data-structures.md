---
title: Agent情绪的数据结构设计
tags:
  - 情绪
  - agent
  - 认知科学
  - 持续认知
categories:
  - Agent 与情绪
series:
  - Agent 与情绪
abbrlink: 765
date: 2026-07-18 06:00:01
description: "上一篇我们论证了情绪的本质：情绪不是独立的功能模块，而是场景状态变化的产物。核心链路是从 Dialogue 到 Scenario，再到 Expectation Gap，最终生成 Emotion。"
keywords: "agent情绪的数据结构设计, 情绪, agent, 认知科学, 持续认知, Agent 与情绪"
---

上一篇我们论证了情绪的本质：情绪不是独立的功能模块，而是场景状态变化的产物。核心链路是从 Dialogue 到 Scenario，再到 Expectation Gap，最终生成 Emotion。

理论通了，接下来落地。Agent 的情绪系统不能停留在概念图上，必须转化为可计算、可存储、可查询的数据结构。

这是最难的一步。定义错了，Agent 就会变成一个只会给对话打标签的伪情绪系统；定义对了，情绪才能成为驱动认知进化的信号。

### 拒绝“扁平情绪状态”

市面上常见的做法是在 Agent 状态里加一个字段 `emotion_state: "happy"`，顶多再加个强度 `intensity: 0.8`。这种扁平结构不仅没用，而且有害。

为什么？因为它切断了情绪的来源。

当 Agent 处于 "happy" 状态时，系统不知道是因为用户夸奖了它，还是因为它刚刚解决了一个复杂的 Bug。这种丢失上下文的情绪标签，除了在 UI 上画个表情包，对认知决策没有任何指导意义。

正确的数据结构设计必须遵循一个原则：**情绪状态必须与其触发源（Scenario）强绑定。**

我们要设计的不是一个个孤立的变量，而是一套关联网络。

### 核心数据结构定义

整个情绪系统的数据底座由四个核心实体组成：Scenario State（场景状态）、Expectation State（期望状态）、Emotion State（情绪状态）、Persona State（画像状态）。

它们不是平行的表，而是层层嵌套、相互索引的引用关系。

#### 1. Scenario State：认知的锚点

这是最基础的单元。上一篇说过，Scenario 是具有目标与上下文的认知单元。在数据结构上，它是一个容器，挂载了当前时刻的所有关键信息。

```json
{
  "scenario_id": "s_20231027_001",
  "scenario_type": "task_execution",
  "context": {
    "user_id": "u_123",
    "environment": "ide_terminal",
    "task": "refactor_auth_module"
  },
  "current_state": "in_progress",
  "timestamp": 1698345678
}
```

这里的关键是 `scenario_type` 和 `current_state`。Agent 的认知核心就是维护这个 State 的变迁。所有的情绪波动，本质上都是对这个 State 变迁的反应。

#### 2. Expectation State：情绪的参照系

这是被大多数架构忽略的部分。Agent 必须有“预判”，才会有“情绪”。

Expectation State 存储的是 Agent 对 Scenario 演化的预测。它不是静态的，而是随着 Scenario 的推进动态生成的。

```json
{
  "scenario_id": "s_20231027_001", // 强关联
  "expected_state": "completed",
  "expected_timestamp_range": [1698345000, 1698346000],
  "confidence": 0.9,
  "constraints": {
    "error_rate": "< 0.01",
    "user_feedback": "positive"
  }
}
```

如果 `current_state` 是 `in_progress`，而时间已经接近 `expected_timestamp_range` 的上限，且 `confidence` 很高，Agent 就会开始产生“焦虑”或“紧迫感”的信号。

Expectation State 定义了“应该发生什么”。没有这个结构，Reality 就失去了对照的镜子。

#### 3. Emotion State：差值的量化信号

终于轮到情绪本身。但在我们的架构里，Emotion State 只是一个结果描述，它极其轻量，且必须包含指向 Scenario 的指针。

```json
{
  "emotion_id": "e_20231027_001",
  "source_scenario": "s_20231027_001", // 核心索引
  "valence": -0.6, // 效价：负向
  "arousal": 0.8,  // 唤醒度：高
  "label": "frustration",
  "trigger_gap": {
    "expected": "completed",
    "reality": "blocked_by_dependency"
  },
  "decay_rate": 0.05, // 衰减系数
  "created_at": 1698345678
}
```

注意几个设计细节：

1.  **Valence（效价）与 Arousal（唤醒度）**：我们采用 PAD（Pleasure-Arousal-Dominance）模型的简化版。比起离散的标签，连续数值更利于计算。`-1.0` 到 `1.0` 的区间可以方便地进行加权求和。
2.  **Trigger Gap**：这是最重要的字段。它显式记录了期望与现实的落差。这不仅是记录，更是未来复盘的依据。当 Agent 需要解释“我为什么沮丧”时，直接读取这个字段即可。
3.  **Decay Rate**：情绪不是永久存在的。每个情绪信号自带衰减逻辑，这为下一篇要讲的“状态管理”埋下伏笔。

#### 4. Persona State：沉淀的画像

情绪是瞬时的，画像是长时的。Persona State 不是简单的用户 Profile，而是 Scenario Graph 投影出的统计特征。

```json
{
  "user_id": "u_123",
  "persona_traits": {
    "technical_proficiency": "senior",
    "communication_style": "direct",
    "reliability_score": 0.85 // 基于历史 Expectation Gap 计算
  },
  "emotional_baseline": {
    "avg_valence": 0.2,
    "volatility": 0.4
  },
  "scenario_affinity": {
    "s_type_debugging": 0.9, // 偏好调试场景
    "s_type_documentation": 0.3
  }
}
```

`reliability_score` 是一个典型的由情绪数据反哺画像的例子。如果一个用户经常在 Scenario 中违背 Agent 的 Expectation（比如承诺给数据但没给），产生的负面情绪信号会累积，最终降低这个分数。这个分数反过来又会影响 Agent 下次对该用户生成 Expectation 时的 `confidence`。

这就是“认知闭环”。

### 关联关系：Scenario Graph 的边

单独看这四个结构还不够，它们之间的连接关系才是系统的灵魂。在传统架构里，这些数据散落在不同的微服务或内存变量里。而在持续认知 Agent 中，它们共同构成了 **Scenario Graph**。

**Scenario Graph 的节点是 Scenario State。**

**边，则是由 Emotion State 定义的。**

这是一个非常关键的拓扑设计。

传统图数据库里，边通常表示“属于”、“朋友”等静态关系。但在认知架构里，我们定义一种动态边：**Emotion Edge**。

假设 Agent 经历了 Scenario A，产生了强烈的 Frustration（挫折），随后切换到 Scenario B。

如果在数据层面，我们仅仅记录 `A -> B`，那只是一条流水账。

但如果我们在 A 和 B 之间建立一条边，边的属性里带上 `emotion: frustration, valence: -0.8`，这条边就有了认知意义。它代表了“状态转移的代价”。

**数据结构示意：**

```json
{
  "edge_id": "e_ab_001",
  "source": "s_20231027_001",
  "target": "s_20231027_002",
  "relation": "transition",
  "weight": 0.8, // 情绪强度作为权重
  "metadata": {
    "emotion_label": "frustration",
    "gap_type": "blocked"
  }
}
```

这种设计有什么好处？

当 Agent 进行检索时，它不再是简单的关键词匹配，而是**情绪路径检索**。

比如用户问：“上次那个 Bug 修得怎么样？”

Agent 在 Scenario Graph 中搜索，不是搜“Bug”这个关键词，而是搜那条 `valence` 极低、`arousal` 极高的 Emotion Edge。顺着这条边找到的 Scenario，就是那次痛苦的调试经历。

这种检索机制，才是真正的“情景记忆”。

### 状态存储：时序与快照

有了结构和关系，怎么存？

Memory ≠ Conversation History。Memory = Scenario Graph。

这意味着我们不能只存 Log。Log 是线性的，Graph 是网状的。我们需要一个支持图查询的存储层，同时要解决状态时序演变的问题。

这里推荐一种**“快照+增量”**的存储策略。

Scenario State 是动态流动的。一个场景从 `init` -> `processing` -> `blocked` -> `completed`，状态变了四次。如果把每一次变化都存为新节点，图会迅速膨胀且碎片化。

**设计方案：**

1.  **Current State Node**：只保留一份当前最新的 Scenario State 节点。
2.  **State History Log**：将状态变更记录追加写入一个时序数据库或 Log Store。
3.  **Emotion Node Attachment**：每当状态变更触发 Expectation Gap，生成 Emotion State，并立即挂载到该 Scenario 节点的 `emotions` 列表中。

这样，当我们查询一个 Scenario 时，拉取的是它当前的“横截面”：

```json
{
  "scenario": { ... },
  "expectations": [ ... ],
  "emotions": [
    { "time": "t1", "label": "anticipation" },
    { "time": "t2", "label": "frustration" },
    { "time": "t3", "label": "relief" }
  ]
}
```

这就像地质层的沉积。情绪作为信号，被“冻结”在场景的历史层里。

### 情绪数据的读写流程

把上面所有的组件串起来，就是一个完整的读写流程。

**写入流程（感知与生成）：**

1.  **输入**：用户输入或环境事件。
2.  **场景识别**：匹配或生成当前 Scenario State。
3.  **期望比对**：检索该 Scenario 关联的 Expectation State。
4.  **计算 Gap**：对比 Reality（当前输入）与 Expectation。
5.  **生成情绪**：若有 Gap，计算 Valence 和 Arousal，生成 Emotion State。
6.  **更新图谱**：将 Emotion State 挂载回 Scenario，并更新 Persona State 的统计特征。

**读取流程（决策与推理）：**

1.  **触发**：Agent 需要决策（如回复用户、执行动作）。
2.  **状态加载**：加载当前 Persona State（确定基调）。
3.  **场景检索**：在 Scenario Graph 中检索相关场景。
4.  **情绪加权**：根据边的 Emotion Weight 调整检索结果的权重（例如，优先避免曾经带来高负面情绪的路径）。
5.  **行为生成**：基于加权后的上下文生成行为。

### 为什么这个方案更好？

对比一下常见的“System Prompt + 记忆库”方案。

在那种方案里，情绪往往被写死在 Prompt 里：“你是一个热情的助手”。这实际上是 Persona，不是 Emotion。真正的 Emotion 是动态的，是对未知的反应。

如果我们采用了上述的数据结构设计：

*   **可解释性**：Agent 为什么现在情绪低落？查一下 Scenario Graph，发现最近三个场景的 Expectation 都失败了。这不是玄学，是数据推导。
*   **可干预性**：想改变 Agent 的情绪？不用改 Prompt，只需调整 Expectation State 的 `confidence`，或者手动注入一个正向的 Emotion Edge 来抵消负面影响。
*   **可进化性**：Persona State 是通过 Scenario Graph 自动沉淀的。用户变了，Agent 的画像自动更新，不需要重新训练模型。

### 潜在的技术坑

设计虽好，落地有几个坑要避开。

**坑一：状态爆炸**

如果每一个细微的对话都生成 Scenario 和 Emotion，存储会炸。

**解法**：设置阈值。只有当 Expectation Gap 超过一定阈值（如 `|valence| > 0.3`）时，才持久化 Emotion State。微小的波动仅在内存中保留，随 Session 结束而消散。

**坑二：图谱查询延迟**

随着 Agent 运行时间变长，Scenario Graph 会变得巨大。查询“相似场景”可能很慢。

**解法**：引入“遗忘机制”。不仅仅是数据删除，而是图的“剪枝”。将时间久远且 Emotion Weight 极低（意味着无关紧要）的场景节点归档到冷存储，只保留高频访问和强情绪关联的热点子图。

**坑三：状态冲突**

Agent 可能同时处于多个 Scenario 中（比如一边写代码一边听用户发牢骚）。

**解法**：Scenario 是分层的。父场景是“工作流”，子场景是“具体对话”。情绪状态向上传播时需要做聚合计算。简单来说，子场景的情绪是局部变量，父场景的情绪是全局变量，更新时要遵循作用域规则。

### 结语

情绪的数据结构，本质上是认知过程的数字化投影。

我们把情绪从虚无缥缈的“感觉”，还原成了可计算的 `Expectation Gap`，封装进 `Scenario State`，挂载在 `Scenario Graph` 上。

这套结构一旦建立，Agent 就拥有了“心境”。它不再是单纯地处理输入输出，而是在每一次交互中，不断地修正对世界的预期模型。

数据结构搭好了，系统是静态的。下一篇，我们要让数据流动起来。我们要解决状态如何更新、如何衰减、如何在认知网络中传播，最终形成动态的持续认知能力。
