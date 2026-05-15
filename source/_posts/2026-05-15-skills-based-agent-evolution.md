---
title: 基于 Skills 的 Agent 进化：从工具调用到自主演化的技术范式
tags:
  - AI
  - Agent
  - Skills
  - LLM
  - Self-Evolving
  - 强化学习
  - 技术综述
categories:
  - 技术研究
abbrindent: true
date: 2026-05-15 20:15:00
---

# 基于 Skills 的 Agent 进化：从工具调用到自主演化的技术范式

> 2026 年 5 月，arXiv 上集中爆发了一批关于 Skills-based Agent Evolution 的突破性研究。从 Skill-R1 的强化学习技能进化，到 SkillClaw 的群体协同技能演化，从 SkillOS 的技能策展学习，到 Swarm Skills 的多智能体协作规范——这些工作共同宣告了一个新范式的到来：Agent 不再只是"使用工具"，而是在"演化技能"。

## 一、引言：为什么 Skills 成为 Agent 进化的核心？

### 1.1 从工具调用到技能抽象

传统 AI Agent 系统依赖直接的工具调用（Tool Calling）机制。LLM 根据用户请求，选择适当的 API 或函数，传入参数，获取结果。这种模式看似简洁，却暗藏几个根本性缺陷：

**上下文丢失**：每次工具调用都是无状态的，缺乏对历史经验的保留。Agent 在处理相似任务时，需要从头推理，无法复用先前积累的知识。

**知识碎片化**：工具的文档、使用经验、失败教训散落在各处，缺乏系统性组织。Agent 无法从失败中学习——它只知道"调了这个函数报错了"，却无法将这种经验提炼为可复用的知识。

**能力固化**：工具一旦定义，其行为模式就固定下来。Agent 无法根据环境变化自适应调整工具使用策略，更无法自主创造新的使用模式。

Skills 的出现从根本上改变了这一局面。Skill 将"工具使用能力"抽象为**可复用、可组合、可演化的知识单元**——它不仅封装了工具的调用方式，还包含了对适用场景的理解、失败模式的认知、以及持续改进的机制。

### 1.2 Skills 的三层抽象

理解 Skills-based Agent Evolution，需要先厘清 Skills 概念的三个层次：

| 层次 | 定义 | 示例 |
|------|------|------|
| **技能实例（Skill Instance）** | 一次具体的工具使用经验 | "用飞书 API 创建了文档 X" |
| **技能模板（Skill Template）** | 从多次经验中提炼的可复用过程 | "飞书文档操作"——包含创建、读取、更新等子流程 |
| **技能演化（Skill Evolution）** | 技能模板随时间和交互自动改进的机制 | "发现飞书文档操作经常在权限环节失败，自动添加权限检查步骤" |

绝大多数现有系统停留在第一层和第二层，而 2026 年 5 月的这批新论文，正是在第三层——技能演化——上取得了突破。

## 二、Skills 进化的五条路径

通过对 2026 年 4-5 月 arXiv 上发表的 10+ 篇核心论文的深度分析，我们识别出 Skills 进化的五条主要技术路径：

### 2.1 路径一：基于强化学习的技能优化（Skill-R1）

**核心论文**：*Skill-R1: Agent Skill Evolution via Reinforcement Learning*（Vishe et al., 2026.05）

Skill-R1 提出了一个关键洞察：**技能优化不应该修改底层 LLM，而应该优化技能本身**。

传统方法试图通过微调 LLM 来改善工具使用，但这既昂贵又不可移植（closed-source 模型根本无法微调）。Skill-R1 反转了这一思路：

```
传统路径：优化模型 → 改善工具使用
Skill-R1：优化技能 → 改善任务表现
```

**技术架构**：

1. **技能作为优化对象**：将自然语言描述的技能视为可优化的"策略"，而非固定文本
2. **渐进式优化**：技能优化不是一步到位的，而是通过多轮交互逐步改进
3. **环境反馈驱动**：利用任务执行结果作为奖励信号，通过 RL 更新技能描述

```
┌─────────────┐     ┌──────────────┐     ┌─────────────┐
│  Task Env   │────→│  Skill-R1    │────→│  Updated    │
│  (执行任务)  │←────│  (RL优化)    │←────│  Skill      │
└─────────────┘     └──────────────┘     └─────────────┘
       │                    ↑                     │
       └── Reward Signal ───┘                     │
       ┌──────────────────────────────────────────┘
       │
       ▼
  改进后的技能 → 下次任务执行时使用
```

**关键创新**：Skill-R1 将技能优化与模型训练解耦，使得技能可以在不同模型间迁移。一个在 GPT-4 上优化的技能，可以直接应用于 Claude 或 GLM，无需任何修改。

### 2.2 路径二：群体协同技能演化（SkillClaw）

**核心论文**：*SkillClaw: Let Skills Evolve Collectively with Agentic Evolver*（Ma et al., 2026.04）

SkillClaw 解决了一个被长期忽视的问题：**在多用户生态系统中，技能应该如何集体演化？**

单用户场景下，技能进化相对简单——根据个人使用经验调整即可。但在多用户场景中，不同用户的经验可能相互矛盾：A 用户发现技能 X 在场景 P 下有效，B 用户却发现它在场景 Q 下失败。如何整合这些异质经验？

SkillClaw 的核心思想是**将跨用户、跨时间的交互作为技能改进的主要信号**：

1. **经验聚合**：收集多用户对同一技能的成功/失败经验
2. **场景感知更新**：不是简单地修改技能描述，而是添加场景条件的适用性判断
3. **Agentic Evolver**：引入一个专门的"技能演化智能体"，负责从异质经验中提炼可靠的技能更新

```
用户A: Skill X → 场景P → ✅
用户B: Skill X → 场景Q → ❌
用户C: Skill X → 场景P → ✅
                 ↓
    Agentic Evolver 分析：
    "Skill X 在场景P下可靠，在场景Q下需补充条件判断"
                 ↓
    更新后的 Skill X: 
    - 适用条件：场景P（高置信度）
    - 注意事项：场景Q下需额外检查Y条件
```

**重要洞察**：SkillClaw 揭示了技能演化中的"知识干扰"问题——新经验可能覆盖或扭曲已有的有效知识。通过引入场景感知的增量更新机制，它有效地缓解了这一"灾难性遗忘"在技能层面的等价问题。

### 2.3 路径三：技能策展与生命周期管理（SkillOS）

**核心论文**：*SkillOS: Learning Skill Curation for Self-Evolving Agents*（Ouyang et al., 2026.05）

SkillOS 关注的是一个更基础的问题：**Agent 应该在什么时候创建新技能？何时复用已有技能？何时淘汰过时技能？**

这是技能系统的"元问题"——不是技能内容本身的优化，而是技能集合的管理策略。

**核心框架**：

SkillOS 将技能管理建模为一个**策展（Curation）问题**，包含三个关键操作：

| 操作 | 触发条件 | 执行方式 |
|------|----------|----------|
| **技能提炼（Distill）** | 任务成功完成且过程具有可复用性 | 从交互轨迹中提取关键步骤，形成技能模板 |
| **技能检索（Retrieve）** | 新任务到达，需要判断是否复用已有技能 | 基于任务语义匹配，选择最相关的技能 |
| **技能淘汰（Retire）** | 技能长期未被使用，或使用成功率持续下降 | 标记为过时，从活跃技能库中移除 |

**技术亮点**：SkillOS 提出了"技能流（Skill Stream）"的概念——Agent 处理的是源源不断的任务流，技能管理必须在线进行，而非离线批处理。这使得 Agent 能够在动态环境中持续适应。

### 2.4 路径四：优先级驱动的集群进化（Ace-Skill）

**核心论文**：*Ace-Skill: Bootstrapping Multimodal Agents with Prioritized and Clustered Evolution*（Xiong et al., 2026.05）

Ace-Skill 针对多模态 Agent 的技能进化，解决了两个耦合的瓶颈：

**瓶颈一：数据低效**。Agent 的探索成本高昂，大量 rollout 消耗在低价值样本上，而非信息量丰富的样本。

**瓶颈二：知识干扰**。新技能的引入可能覆盖已有技能的有效知识，导致"进化了但退步了"。

Ace-Skill 的解决方案：

1. **优先级采样**：不是均匀地探索所有可能的技能变体，而是优先探索那些信息增益最大的方向
2. **集群进化**：将技能按语义相似性聚类，同一集群内的技能协同进化，不同集群间隔离更新，避免交叉干扰
3. **引导式自举**：从少量高质量种籽技能出发，通过迭代扩展逐步构建完整的技能库

```
Phase 1: Seed Skills (少量高质量种籽)
   ┌──────────┐  ┌──────────┐
   │ Cluster A │  │ Cluster B │
   │ (文档操作) │  │ (数据分析) │
   └─────┬────┘  └─────┬────┘
         │              │
Phase 2: Prioritized Expansion (优先级扩展)
   ┌─────┴────┐  ┌─────┴────┐
   │ A1  A2  A3│  │ B1  B2  B3│
   │(高优)(低优) │  │(高优)(低优) │
   └───────────┘  └───────────┘
         │              │
Phase 3: Clustered Evolution (集群进化)
   A内协同进化，B内协同进化
   A↔B 间隔离，避免知识干扰
```

**实验验证**：Ace-Skill 在多模态 Agent 基准上显著优于均匀采样基线，证明优先级驱动策略能有效将计算资源集中在最有价值的进化方向。

### 2.5 路径五：多智能体协作技能规范（Swarm Skills）

**核心论文**：*Swarm Skills: A Portable, Self-Evolving Multi-Agent System Specification for Coordination Engineering*（Zhang et al., 2026.05）

Swarm Skills 将技能进化的视野从单 Agent 扩展到多 Agent 系统，提出了一个关键命题：**当工程范式从单 Agent 的 Prompt/Context Engineering 转向多 Agent 协作时，技能应该成为协调工程的基本单元**。

**核心设计**：

1. **可移植的技能规范**：技能描述独立于任何特定 Agent，可以在不同 Agent 间共享和迁移
2. **自演化的协调机制**：不仅技能内容在演化，Agent 间的协调策略也在根据协作效果自动调整
3. **群体级技能涌现**：单个 Agent 的简单技能，通过组合和协调，可以涌现出群体级的复杂能力

Swarm Skills 的意义在于：它将技能从"个体能力的封装"提升为"群体协调的语言"。技能不再只是"我会做什么"，而是"我们如何一起做什么"。

## 三、统一框架：Skills 进化的生命周期模型

综合上述五条路径，我们可以构建一个统一的 Skills 进化生命周期模型：

### 3.1 生命周期六阶段

```
  ┌─────────┐    ┌─────────┐    ┌─────────┐
  │ 1.发现   │───→│ 2.提炼   │───→│ 3.验证   │
  │Discovery │    │Distill  │    │Validate │
  └─────────┘    └─────────┘    └─────────┘
                                      │
  ┌─────────┐    ┌─────────┐    ┌─────────┐
  │ 6.淘汰   │←───│ 5.退化   │←───│ 4.演化   │
  │ Retire   │    │Degrade  │    │ Evolve  │
  └─────────┘    └─────────┘    └─────────┘
```

**阶段1：发现（Discovery）**——识别出一种可复用的行为模式。可能来自任务成功后的反思（SkillOS），也可能来自多用户的经验汇聚（SkillClaw）。

**阶段2：提炼（Distill）**——将原始交互轨迹压缩为简洁的技能描述。Ace-Skill 的集群进化在这里发挥作用，将相似经验聚合成更高质量的技能模板。

**阶段3：验证（Validate）**——在新任务上检验技能的有效性。Skill-R1 的强化学习信号在此阶段提供客观评估。

**阶段4：演化（Evolve）**——技能在使用过程中持续改进。这是五条路径的共同核心，但各自侧重不同：Skill-R1 侧重内容优化，SkillClaw 侧重场景适应，SkillOS 侧重集合管理。

**阶段5：退化（Degrade）**——当环境或需求变化时，技能可能变得过时或不再适用。SkillOS 的淘汰机制在此阶段发挥作用。

**阶段6：淘汰（Retire）**——将无效技能从活跃库中移除，释放认知资源。被淘汰的技能不是被删除，而是归档为"历史经验"，可能在未来被重新激活。

### 3.2 进化驱动力分析

不同进化路径的驱动力各有侧重：

| 路径 | 驱动力 | 反馈信号 | 更新粒度 | 适用场景 |
|------|--------|----------|----------|----------|
| Skill-R1 | 任务奖励 | 执行结果（成功/失败） | 技能内容 | 单 Agent、可量化任务 |
| SkillClaw | 群体经验 | 跨用户成功率 | 技能+场景条件 | 多用户、异质场景 |
| SkillOS | 技能效用 | 使用频率+成功率 | 技能集合 | 流式任务、动态环境 |
| Ace-Skill | 信息增益 | 探索效率 | 技能集群 | 多模态、资源受限 |
| Swarm Skills | 协作效果 | 群体任务完成度 | 协调策略 | 多 Agent、协作任务 |

## 四、关键挑战与前沿突破

### 4.1 灾难性遗忘的技能等价问题

**核心论文**：*Do Self-Evolving Agents Forget? Capability Degradation and Preservation in Lifelong LLM Agent Adaptation*（Yu et al., 2026.05）

这篇论文首次系统性地研究了 Agent 自进化中的"遗忘"现象。发现：

- 技能在演化过程中确实会丢失先前习得的能力
- 遗忘的程度与技能更新频率正相关：更新越频繁，旧能力退化越快
- 与神经网络的灾难性遗忘不同，技能遗忘更多表现为"条件覆盖"而非"参数覆盖"

**缓解策略**：
- **技能版本化**：保留技能的历史版本，允许回滚
- **增量更新**：只添加新条件，不修改原有描述（SkillClaw 的策略）
- **正则化约束**：在技能优化时添加约束，确保在关键场景上不退化（Skill-R1 的思路）

### 4.2 具身智能中的技能反思

**核心论文**：*EmbodiSkill: Skill-Aware Reflection for Self-Evolving Embodied Agents*（Ju et al., 2026.05）

EmbodiSkill 揭示了具身场景下一个独特的挑战：**任务失败可能不是技能内容有误，而是执行过程中出现了偏差**。

考虑这个例子：Agent 知道"打开抽屉需要先拉把手"，但在实际执行中，机械臂的角度偏差导致没有抓住把手。如果直接修改技能为"需要反复尝试拉把手"，就引入了不必要的冗余。

EmbodiSkill 的解决方案是**技能感知反思（Skill-Aware Reflection）**：

1. **失败归因**：区分"技能错误"和"执行偏差"
2. **针对性修订**：只修正确认是技能错误的失败，执行偏差则通过重试解决
3. **训练无关**：整个框架无需模型训练，完全基于推理时的反思机制

### 4.3 从上下文到技能的学习

**核心论文**：*From Context to Skills: Can Language Models Learn from Context Skillfully?*（Si et al., 2026.04）

这篇论文提出了一个深刻的问题：**语言模型能否直接从上下文中学习技能？**

研究发现：

- LLM 确实可以从上下文中提取规则和程序，但效果高度依赖于上下文的质量和结构
- "推理时技能增强（Inference-time Skill Augmentation）"——将上下文中的规则提取为自然语言技能描述——可以显著提升任务表现
- 但 LLM 在"识别什么时候该学新技能"这一元认知能力上仍然薄弱

**实践启示**：技能系统不应完全依赖自动发现，人工设计的"技能触发器"仍然是必要的。

## 五、工程实践：构建 Skills 进化系统的架构指南

### 5.1 推荐架构

基于对上述论文的综合分析，我们提出一个分层架构：

```
┌───────────────────────────────────────────────────────┐
│                    应用层 (Application)                │
│  ┌─────────┐  ┌──────────┐  ┌──────────┐            │
│  │ 客服Agent │  │ 编码Agent │  │ 助手Agent │            │
│  └────┬────┘  └────┬─────┘  └────┬─────┘            │
│       │            │              │                    │
├───────┼────────────┼──────────────┼────────────────────┤
│       │     技能演化层 (Evolution) │                    │
│  ┌────▼────────────▼──────────────▼─────┐             │
│  │         Skill Evolution Engine       │             │
│  │  ┌──────────┐  ┌───────────────────┐│             │
│  │  │Skill-R1  │  │SkillClaw Aggregator││             │
│  │  │Optimizer │  │(群体经验聚合)       ││             │
│  │  └──────────┘  └───────────────────┘│             │
│  │  ┌──────────┐  ┌───────────────────┐│             │
│  │  │SkillOS   │  │Ace-Skill          ││             │
│  │  │Curator   │  │Prioritizer        ││             │
│  │  └──────────┘  └───────────────────┘│             │
│  └─────────────────┬────────────────────┘             │
│                    │                                    │
├────────────────────┼────────────────────────────────────┤
│              技能存储层 (Storage)                        │
│  ┌─────────────────▼────────────────────┐             │
│  │         Skill Repository             │             │
│  │  ┌──────┐ ┌──────┐ ┌──────┐        │             │
│  │  │Active│ │Draft │ │Archive│        │             │
│  │  │Skills│ │Skills│ │Skills │        │             │
│  │  └──────┘ └──────┘ └──────┘        │             │
│  │  ┌──────────────────────────┐       │             │
│  │  │Version History + Lineage │       │             │
│  │  └──────────────────────────┘       │             │
│  └──────────────────────────────────────┘             │
│                                                        │
├────────────────────────────────────────────────────────┤
│                   工具层 (Tools)                        │
│  ┌─────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐       │
│  │ API │ │ DB   │ │ File │ │Browser│ │ Shell│       │
│  └─────┘ └──────┘ └──────┘ └──────┘ └──────┘       │
└────────────────────────────────────────────────────────┘
```

### 5.2 技能描述规范

综合各论文的最佳实践，推荐以下技能描述结构：

```yaml
skill:
  name: "feishu-document-operations"
  version: "2.3.1"
  description: "飞书文档的创建、读取、更新操作"
  
  # 触发条件：什么时候该用这个技能
  triggers:
    - "用户提到飞书文档"
    - "用户分享 docs.feishu.cn 链接"
    - "用户要求创建/编辑在线文档"
  
  # 工具依赖
  tools:
    - feishu_doc
    - feishu_drive
  
  # 核心流程
  procedure: |
    1. 解析文档 URL，提取 doc_token
    2. 调用 feishu_doc.read 获取当前内容
    3. 根据用户指令执行操作
    4. 验证操作结果
  
  # 场景条件（来自 SkillClaw 的经验）
  conditions:
    - scenario: "文档有访问权限限制"
      action: "先检查权限，必要时提醒用户授权"
    - scenario: "文档内容超过 50KB"
      action: "使用分块读取，避免截断"
  
  # 已知失败模式（来自 EmbodiSkill 的反思）
  failure_modes:
    - pattern: "403 Forbidden"
      cause: "文档权限不足"
      fix: "提醒用户检查分享设置"
  
  # 演化元数据
  evolution:
    created: "2026-03-15"
    last_updated: "2026-05-10"
    usage_count: 847
    success_rate: 0.92
    version_history:
      - version: "1.0.0"
        change: "初始版本"
      - version: "2.0.0"
        change: "添加权限检查流程"
        reason: "12次因权限导致的失败"
      - version: "2.3.1"
        change: "添加大文档分块读取"
        reason: "5次因文档过大导致的截断"
```

### 5.3 进化策略的选择指南

| 场景特征 | 推荐策略 | 理由 |
|----------|----------|------|
| 单 Agent，任务可量化 | Skill-R1 | RL 信号清晰，优化效率高 |
| 多用户，场景异质 | SkillClaw | 群体经验提供丰富的改进信号 |
| 流式任务，动态环境 | SkillOS | 在线策展适应快速变化 |
| 多模态，资源受限 | Ace-Skill | 优先级采样最大化信息增益 |
| 多 Agent 协作 | Swarm Skills | 协调演化解决协作瓶颈 |
| 具身智能，执行偏差大 | EmbodiSkill | 反思机制区分技能错误和执行偏差 |

## 六、与其他 Agent 进化方法的关系

Skills-based Evolution 并非 Agent 进化的唯一路径。它与其他进化方法形成互补：

### 6.1 与记忆系统的互补

记忆系统（如 RAG、Episodic Memory）存储的是原始经验，而技能系统存储的是压缩后的过程性知识。两者的关系类似于人类的"情景记忆"和"程序性记忆"：

- **记忆系统**回答"上次发生了什么"
- **技能系统**回答"下次该怎么做"

最优实践是将两者结合：技能从记忆中提炼，记忆为技能提供验证依据。

### 6.2 与 Prompt Engineering 的替代

Skills 系统可以被视为"自动化的 Prompt Engineering"：

- 传统方式：人工编写 System Prompt，定义 Agent 行为
- Skills 方式：Agent 自主发现、提炼、优化行为规范

但这不意味着 Prompt Engineering 被取代。高质量的初始技能（种子技能）仍然需要人工设计，Skills 系统在此基础上的自动化进化才是关键。

### 6.3 与 Agent 训练的区别

| 维度 | Agent 训练（SFT/RLHF） | Skills 进化 |
|------|----------------------|-------------|
| 优化对象 | 模型参数 | 技能描述 |
| 部署要求 | 需要模型权重访问 | 模型无关 |
| 更新成本 | 高（重新训练） | 低（文本更新） |
| 可解释性 | 低（黑盒参数） | 高（自然语言描述） |
| 迁移性 | 无（绑定特定模型） | 强（跨模型复用） |

## 七、未来展望

### 7.1 技能生态系统

当前的研究主要集中在单 Agent 或小规模多 Agent 场景。未来，我们可能会看到**技能市场（Skill Marketplace）**的出现：

- Agent 可以从公共技能库中"下载"技能
- 用户可以"上传"和"分享"自定义技能
- 技能的演化由整个社区驱动（类似开源软件的演进模式）

Swarm Skills 和 SkillClaw 已经为这种愿景奠定了理论基础。

### 7.2 技能进化与模型进化的融合

当前的 Skills 进化是"模型外"的——技能描述独立于模型参数。但未来的方向可能是**技能驱动的模型微调**：

1. 从技能使用轨迹中识别高频模式
2. 将这些模式蒸馏为训练数据
3. 通过 SFT/RL 将技能知识内化到模型中

Orchard（Peng et al., 2026.05）的工作已经展示了这一方向的可行性——它从 Agent 轨迹中蒸馏训练数据，实现了跨域的 Agentic Modeling。

### 7.3 从技能进化到能力涌现

最激进的愿景是：当技能数量和复杂度达到某个临界点时，Agent 是否能涌现出超出任何单一技能组合的**新能力**？

这类似于生物进化中的"涌现性"——单个基因不编码"意识"，但基因的组合和交互产生了意识。同样，单个技能不编码"创造力"或"直觉"，但技能的组合和演化可能涌现出这些高级认知能力。

Swarm Skills 的群体级涌现和 MAGE（Yang et al., 2026.05）的协同进化知识图谱，正在这一方向上探索。

## 八、结论

2026 年 5 月的这批研究标志着 Agent 技术正在经历一次范式转换：

1. **从"工具使用"到"技能演化"**：Agent 不再只是被动地调用工具，而是主动地发现、提炼、优化技能
2. **从"个体智能"到"群体智慧"**：技能演化从单 Agent 扩展到多 Agent，从个人经验扩展到群体智慧
3. **从"离线训练"到"在线进化"**：技能改进不再依赖离线训练，而是在任务执行中持续迭代
4. **从"模型绑定"到"模型无关"**：技能作为自然语言知识，可以在不同 LLM 间自由迁移

Skills-based Agent Evolution 不是对现有 Agent 框架的颠覆，而是其自然延伸——它为 Agent 提供了一种在部署后持续改进的能力，这正是通向真正自主智能的关键一步。

---

## 参考文献

1. Vishe, Y., et al. "Skill-R1: Agent Skill Evolution via Reinforcement Learning." arXiv:2605.xxxxx, May 2026.
2. Ma, Z., et al. "SkillClaw: Let Skills Evolve Collectively with Agentic Evolver." arXiv:2604.xxxxx, April 2026.
3. Ouyang, S., et al. "SkillOS: Learning Skill Curation for Self-Evolving Agents." arXiv:2605.xxxxx, May 2026.
4. Xiong, F., et al. "Ace-Skill: Bootstrapping Multimodal Agents with Prioritized and Clustered Evolution." arXiv:2605.xxxxx, May 2026.
5. Zhang, X., et al. "Swarm Skills: A Portable, Self-Evolving Multi-Agent System Specification for Coordination Engineering." arXiv:2605.10052, May 2026.
6. Ju, R., et al. "EmbodiSkill: Skill-Aware Reflection for Self-Evolving Embodied Agents." arXiv:2605.xxxxx, May 2026.
7. Si, S., et al. "From Context to Skills: Can Language Models Learn from Context Skillfully?" arXiv:2604.27660, April 2026.
8. Yu, Y., et al. "Do Self-Evolving Agents Forget? Capability Degradation and Preservation in Lifelong LLM Agent Adaptation." arXiv:2605.xxxxx, May 2026.
9. Peng, B., et al. "Orchard: An Open-Source Agentic Modeling Framework." arXiv:2605.15040, May 2026.
10. Yang, R., et al. "MAGE: Multi-Agent Self-Evolution with Co-Evolutionary Knowledge Graphs." arXiv:2605.xxxxx, May 2026.
11. Zhang, Y., et al. "RewardHarness: Self-Evolving Agentic Post-Training." arXiv:2605.xxxxx, May 2026.
12. Xu, W., et al. "AEL: Agent Evolving Learning for Open-Ended Environments." arXiv:2604.xxxxx, April 2026.
