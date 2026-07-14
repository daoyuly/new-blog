---
title: 从对话到人物画像
date: 2026-07-14 06:00:05
tags:
  - 情绪
  - agent
  - 认知科学
  - 持续认知
categories:
  - Agent 与情绪
series:
  - Agent 与情绪
---

上一篇谈到，Agent理解用户的起点是长期观察。观察什么？不是观察“用户说了哪几句话”，而是观察“用户在什么状态下做了什么事”。

但观察本身不产生认知，观察只是数据的堆砌。如果不经处理，Agent 的记忆库里只是一堆 Dialogue（对话）的残渣。现在的 Agent 架构最大的问题就在这儿：把 Dialogue 当成了认知的原子，认为只要把对话记录存下来，Agent 就有了记忆，进而就能理解用户。

这完全搞错了。

Dialogue 只是原始信号，里面夹杂着噪音、废话和暂态的语境。真正的认知单元是 Scenario（场景）。如果不经过从 Dialogue 到 Scenario 的提炼，Agent 永远无法构建出真正的 Persona（人物画像），所谓的“个性化”也就沦为简单的关键词匹配。

我们需要一套更底层的认知演化模型：

**Dialogue → Situation → Scenario → Scenario Graph → Persona**

这是持续认知 Agent 的核心数据链路。接下来我们逐层拆解。

### Dialogue：原始观察数据

Dialogue 是系统感知到的原始信号流。

在技术实现上，它通常是一连串的 (Timestamp, Role, Content) 元组。目前的 RAG（检索增强生成）架构基本都在这一层打转。向量数据库存储的是切分好的 Chunk，检索时匹配的是语义相似度。

这一层非常脆弱。

Dialogue 高度依赖具体的语言表达，具有极强的随机性和非结构化特征。用户今天说“我不饿”，明天说“我吃撑了”，语义相似度可能很低，但背后的状态是一致的。如果 Agent 的认知停留在 Dialogue 层，它就无法处理同义变换，更无法处理隐含意图。

更重要的是，Dialogue 是线性的、离散的。它丢失了大部分非语言信息（如用户的行为轨迹、时间间隔、操作上下文）。把 Dialogue 当作核心记忆单元，就像试图通过研究一堆散乱的砖头来理解一栋建筑的结构。

必须向上抽象。

### Situation：一次事件

从 Dialogue 到 Situation，是第一次抽象跃迁。

Situation 定义为：**在特定时间切片内发生的事件快照。**

它不再是原始的文本，而是结构化的信息三元组或多元组：。

例如，用户说：“我刚才把那个项目文档提交了。”
Dialogue 是这句话的文本。
Situation 则是：{Time: 14:00, Subject: User, Action: Submit_Document, Object: Project_Doc}。

这一步的难点在于信息抽取与归一化。

现在的 LLM（大语言模型）做这件事并不难，难的是定义 Schema（模式）。如果你让 LLM 自由发挥，它会生成一堆五花八门的 Situation 描述，依然无法结构化。必须预定义一套针对特定领域的 Ontology（本体论），强制 Agent 将 Dialogue 映射到这套结构上。

Situation 解决了“发生了什么”的问题，但它依然是孤立的。用户提交文档，这只是一个点。如果 Agent 只能记录 Situation，那它得到的是一本流水账。

流水账不等于认知。认知需要上下文。

### Scenario：具有目标与上下文的认知单元

这是整个认知演化模型中最关键的一跳，也是本系列文章的核心命题所在。

**Scenario ≠ Situation.**

Situation 只是“用户提交了文档”，Scenario 则是“用户在项目截止前匆忙提交文档以避免延期”。

Scenario 是 Situation 的容器，它给孤立的 Event 加上了两个核心要素：**Context（上下文）** 和 **Goal（目标）**。

#### 1. Context：状态环境
Context 描述了 Situation 发生的背景。比如用户当前的情绪状态、物理环境、之前的操作序列。Situation 是点，Context 是面。

#### 2. Goal：驱动意图
这是 Scenario 区别于普通 Memory 的关键。每一个 Scenario 都隐含或显式包含一个 Goal。用户做一件事，一定是为了达成某种状态转移。

为什么 Scenario 是持续认知 Agent 的最小认知单元？

因为只有到了 Scenario 这一层，Agent 才具备了推理能力。

如果只看 Situation（用户提交文档），Agent 只能做出反应（回复“收到”）。
只有看到了 Scenario（用户为了赶截止日期而匆忙提交），Agent 才能理解用户的潜在状态（焦虑、时间紧迫），进而做出预测（接下来用户可能会去休息，或者等待审核反馈）。

**Memory 不应该是 Dialogue 的集合，也不应该是 Situation 的列表。Memory 应该是 Scenario 的集合。**

当我们说“Agent 拥有持续认知”时，意思是 Agent 能够识别出当前处于哪个 Scenario，并知道这个 Scenario 的前因后果。Dialogue 是噪音，Situation 是信号，Scenario 才是知识。

### Scenario Graph：场景之间的关联网络

单个 Scenario 是有生命周期的。用户完成了一次项目提交，这个 Scenario 就结束了。但认知不会结束，Scenario 之间会产生关联。

用户提交文档后，可能会面临“审核反馈”的 Scenario，也可能会触发“项目延期”的 Scenario。这些 Scenario 之间存在着因果、时序、相关等关系。

**Scenario Graph 就是这些关系的拓扑结构。**

图结构是知识的最佳载体。传统的 Memory 往往是扁平的列表或树状结构，难以表达复杂的网状关系。Scenario Graph 则不同：

*   **节点**：Scenario 实例。
*   **边**：关系类型（如 `CAUSE`, `FOLLOW`, `CONFLICT`）。

构建 Scenario Graph 的核心难点在于**场景演化**的判定。

什么时候应该创建一个新的 Scenario 节点？什么时候应该更新现有的 Scenario？
如果用户在提交文档时突然被打断去开会，这是两个 Scenario 还是一个？

判定标准在于**Goal 的连续性**。
如果 Goal 发生了切换（从“提交文档”变为“参与会议”），则必须分裂出新的 Scenario 节点。如果 Goal 保持不变（“提交文档”过程中遇到了技术故障），则视为同一个 Scenario 的状态更新。

Scenario Graph 是 Agent 动态记忆的载体。它不是静态的数据库，而是一张随着时间不断生长、修剪、重构的活图。

### Persona：由场景图谱长期沉淀形成的人物画像

终于，我们谈到了 Persona。

在传统的 Agent 设计中，Persona 往往是预设的：在 Prompt 里写上“你是一个乐于助人的助手”，或者让用户填个表单“我喜欢简洁的回答”。这种 Persona 是静止的、标签化的，甚至可以说是虚假的。

**真正的 Persona 不是预设的，而是沉淀出来的。**

Persona 是 Scenario Graph 的统计特征。

当 Agent 观察到用户在“项目提交”这个 Scenario 下，反复表现出“拖延到最后一刻”的行为模式，并在 Scenario Graph 中形成了高频的因果回路，Agent 就可以在用户画像中生成一个特征：{Attribute: Procrastination_Tendency, Context: Work_Submission}。

这就是从行为到人格的归纳。

这个归纳过程必须是长期的、动态的。用户可能在工作上拖延，但在健身这件事上极其自律。这对应着 Scenario Graph 中不同子图的行为模式差异。Persona 应该是一个多维度的、带权重的特征向量，而不是几句干瘪的描述。

**Dialogue → Situation → Scenario → Scenario Graph → Persona。**

这条链路清晰地定义了认知的层级：

1.  **Dialogue**：感知层，原始数据输入。
2.  **Situation**：符号层，结构化抽取。
3.  **Scenario**：认知层，带意图的上下文单元。
4.  **Scenario Graph**：记忆层，关联网络。
5.  **Persona**：人格层，长期统计特征。

目前的 Agent 系统大多试图直接从 Dialogue 跳到 Persona，试图通过几轮对话就给用户打标签，这属于过拟合。中间缺失了 Situation 的归一化、Scenario 的上下文建模以及 Graph 的关联构建，得到的 Persona 必然是脆弱的、不稳定的。

只有把 Scenario 作为核心认知单元，把认知过程拆解清楚，Agent 才能真正“理解”用户。

既然 Persona 是 Scenario Graph 沉淀的结果，那么核心问题就变成了：这张图怎么存？怎么查？怎么更新？

这回到了 Agent 记忆系统的设计。但这一次，我们要彻底抛弃传统的“对话历史即记忆”的观念。

Memory ≠ Conversation History.

Memory = Scenario Graph.
