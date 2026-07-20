---
title: "主-子 Agent 上下文设计：5 篇论文的深度拆解"
date: 2026-07-20 14:40:00
tags:
  - Agent
  - Multi-Agent
  - 上下文设计
  - 论文分析
categories:
  - AI架构
  - Agent系统
---

# 主-子 Agent 上下文设计：5 篇论文的深度拆解

Agent 系统从单 agent 走向多 agent，最难的不是调度，是上下文。主 agent 把任务拆给子 agent，子 agent 干完活把结果塞回主 agent 的上下文——这个过程里有多少坑，做过的人都知道。

我从博客里积累的论文中挑了 5 篇跟"主-子 agent 上下文设计"最相关的，逐篇拆解：核心观点、优势、劣势、技术机制、工程可行性。

---

## 1. SearchSwarm：委派智能与上下文预算管理

**论文**: [Towards Delegation Intelligence in Agentic LLMs for Long-Horizon Deep Research](https://arxiv.org/abs/2606.09730)

### 核心观点

主 agent 的上下文窗口是有限的，但长周期任务的上下文需求会无限增长。SearchSwarm 提出一个方案：主 agent 把任务拆成子任务，派给子 agent，子 agent 只返回摘要结果，不返回原始过程——这样省主 agent 的上下文预算。

关键概念叫 **delegation intelligence**（委派智能）：模型需要学会三件事——任务怎么拆、什么时候委派、子 agent 返回的结果怎么整合回主 workflow。

### 技术机制

- 设计了一个 **harness**（脚手架），引导模型做高质量的任务分解和委派
- 子 agent 被约束为"只返回结果摘要"的格式，不把中间过程塞给主 agent
- 用 harness 引导产生的轨迹作为 SFT 训练数据，把委派能力内化到模型权重里
- 最终模型 SearchSwarm-30B-A3B 在 BrowseComp 上拿 68.1 分，同规模最优

### 优势

- **上下文预算思路清晰**：不是无限扩大上下文窗口，而是通过委派+摘要压缩主 agent 的信息负担
- **训练方法可复现**：harness 产生的轨迹直接做 SFT 数据，开源社区可以复刻
- **效果硬核**：BrowseComp 68.1 是同规模模型里最好的

### 劣势

- **子 agent 摘要质量是单点故障**：如果子 agent 返回的摘要丢了关键信息，主 agent 根本不知道，因为它看不到原始过程。等于把"上下文爆炸"换成了"信息丢失风险"
- **harness 设计偏 deep research 场景**：任务分解逻辑针对搜索/研究类任务优化，换到其他场景（比如运维排障）未必 work
- **没有讨论子 agent 之间的上下文隔离**：多个子 agent 并行执行时，彼此的上下文是否需要隔离，论文没提

### 工程可行性

中等偏高。harness 的设计不需要修改模型架构，SFT 训练流程也是标准的。实际落地时，摘要质量控制是关键——需要设计摘要的验证机制，比如让主 agent 对摘要提追问，或者让子 agent 返回结构化摘要而非自由文本。

---

## 2. HANA：层级 Agent 原生网络架构

**论文**: [From Automated to Autonomous: Hierarchical Agent-native Network Architecture (HANA)](https://arxiv.org/abs/2605.20608)，发表于 IEEE Networking Letters。

### 核心观点

从"自动化"到"自主化"的跨越需要 agent-native 的架构。HANA 提出了一个层级多 agent 参考架构：顶层是 **Dual-Driven Orchestrator**（双驱动编排器），下面是多个 **Executive Agents**（执行 agent），通过 **Shared Public Memory**（共享公共记忆）统一领域知识。

关键创新是 agent 自感知（self-awareness）：系统能在"审慎的战略治理"和"反射式故障恢复"之间自主切换。

### 技术机制

- **双驱动编排器**：两种驱动模式并行——战略层做长期规划，反射层做即时故障响应
- **共享公共记忆**：所有 executive agents 共享同一个记忆库，避免每个 agent 各自维护重复知识
- **层级结构**：Orchestrator → Executive Agents，上下文通过共享记忆传递，而非直接的消息传递
- 在 5G Core 环境验证，拥塞场景下维持关键吞吐，MTTR 降低 86%

### 优势

- **共享记忆 vs 消息传递**：这是个好选择。消息传递需要序列化/反序列化，共享记忆让 agent 直接读写同一块知识，延迟更低
- **双驱动模式**：战略层和反射层分离，日常走战略规划，出事走反射恢复，不同模式不同上下文
- **有真实环境验证**：5G Core 不是玩具场景，MTTR 降 86% 是硬指标

### 劣势

- **共享记忆的并发控制没讲清**：多个 executive agent 同时读写共享记忆，一致性怎么保证？锁机制？乐观并发？论文没展开
- **层级是固定的两层**：Orchestrator + Executive，如果任务需要三层甚至递归层级呢？
- **场景偏窄**：5G 网络运维是一个高度结构化的场景，换到开放域任务（比如代码开发、数据分析），双驱动模式是否还适用？

### 工程可行性

中等。共享记忆在分布式系统里是老问题，Redis/etcd 都能做，但 agent 场景下的并发写入冲突更复杂（因为 agent 写入的是语义信息而非简单 KV）。双驱动模式在工程上可以借鉴——相当于给系统加了"快路径"和"慢路径"。

---

## 3. Interaction Locality：层级递归推理中的交互局部性

**论文**: [Interaction Locality in Hierarchical Recursive Reasoning](https://arxiv.org/abs/2605.20784)

### 核心观点

空间推理需要两种计算：location-bound（位置绑定）的局部计算和 location-invariant（位置无关）的全局结构。论文提出 **interaction locality**（交互局部性）框架，测量信息流是在局部 cell 内流动还是跨越语义边界。

简单讲：高层递归状态倾向于在附近 cell 或同语义段内写入信息，递归更新把这些局部写入累积成全局解结构。

### 技术机制

- 用 **sparse-autoencoder feature ablation**（稀疏自编码器特征消融）和 **finite-noise activation patching**（有限噪声激活修补）做因果分析
- 在 HRM 和 TRM 两个紧凑层级递归推理模型上测试
- 测试集：Maze-Hard、Sudoku Extreme、ARC-AGI
- 还测了 MTU3D（大规模 3D 场景理解模型），发现因果空间局部性出现在模块边界（视觉特征→grounding 模块的过渡），而非整个视觉编码器

### 优势

- **给了"局部执行/全局规划"一个可测量的框架**：以前大家说"高层做规划、底层做执行"是直觉判断，这篇论文把它变成了可复现的测量方法
- **跨模型一致性好**：HRM、TRM 两个模型上都观察到 local-to-global 的模式，TRM 最强
- **理论价值高**：理解了信息流在层级间怎么传递，对设计主-子 agent 的上下文隔离有直接指导意义

### 劣势

- **偏理论，离工程远**：用的是 maze、sudoku、ARC-AGI 这类 grid benchmark，跟生产环境的 agent 系统差距大
- **不讨论 LLM agent**：论文聚焦的是小模型（HRM、TRM）的递归推理，不是 LLM-based agent 的上下文管理
- **"局部性"的语义在开放域不明确**：在 grid 世界里"附近 cell"很清楚，在自然语言 agent 系统里什么叫"附近"？

### 工程可行性

低（直接应用）。但理论启发价值高——如果你在设计主-子 agent 系统，interaction locality 告诉你：高层 agent 的信息更新应该集中在当前子任务的上下文范围内，而不是全局散播。这跟 SearchSwarm 的"子 agent 只返回摘要"是同一个思路的不同表述。

---

## 4. ADEMA：知识状态编排架构

**论文**: [ADEMA: A Knowledge-State Orchestration Architecture for Long-Horizon Knowledge Synthesis with LLM Agents](https://arxiv.org/abs/2604.25849)

### 核心观点

长周期 LLM 任务失败的常见原因不是单次回答不行，而是：知识状态在多轮之间漂移、中间承诺没有显式记录、中断后恢复断裂。ADEMA 把这些问题的解法打包成一个编排架构。

核心设计承诺：显式的知识状态转换、带证据的 artifact 推进、可恢复的连续性。

### 技术机制

- **显式认知簿记（epistemic bookkeeping）**：每一步推理的知识状态都被显式记录
- **异构双评估器治理**：两种不同类型的评估器交叉检查
- **检查点-可恢复持久化**：任务可中断、可恢复，通过检查点保存中间状态
- **段级记忆压缩**：不是把所有历史都塞进上下文，而是按段压缩
- **artifact 优先组装**：先产出 artifact（结构化产出物），再组装最终答案
- **最终有效性检查 + 安全回退**：如果最终结果不可靠，有 fallback

### 优势

- **直击长周期任务的痛点**：知识漂移、隐式承诺、中断恢复——这三个问题在实际 agent 系统里天天遇到
- **检查点机制有实验支撑**：在固定 60 次实验中，去掉 checkpoint/resume 导致唯一一次无效运行，发生在中断敏感的恢复场景
- **段级记忆压缩很实用**：比简单的"截断历史"或"全量保留"都好，按语义段压缩保留了结构信息

### 劣势

- **复杂度高**：8 个组件（认知簿记、双评估器、自适应模式切换、声誉分配、检查点、段级压缩、artifact 组装、最终校验），工程实现成本不低
- **评估局限**：在代码生成场景里质量敏感度最高，其他场景的评估不够
- **双评估器的开销**：两套评估器交叉检查，推理成本翻倍，生产环境能不能承受？

### 工程可行性

中等。不需要全部 8 个组件都上。最值得摘出来用的是三个：**检查点-恢复**、**段级记忆压缩**、**artifact 优先**。检查点机制在 OpenClaw 的 sessions_spawn 里已经有了类似的实现（sub-agent 可以中断和恢复），段级压缩可以用 LangChain 的 ConversationSummaryMemory 做简化版。

---

## 5. RecursiveMAS：递归多 agent 系统

**论文**: [Recursive Multi-Agent Systems](https://arxiv.org/abs/2604.25917)

### 核心观点

递归/循环语言模型通过迭代精炼同一个计算来加深推理，这条路能不能从单模型扩展到多 agent？RecursiveMAS 把整个多 agent 系统看作一个统一的潜空间递归计算——agent 之间通过轻量级 RecursiveLink 模块连接成协作环，在潜空间里传递状态。

### 技术机制

- **RecursiveLink 模块**：轻量级连接器，让异构 agent 在潜空间里传递思考状态，不需要转成文本再传
- **内-外循环学习**：内循环做递归推理，外循环做整个系统的梯度优化，通过共享梯度信用分配跨递归轮次联合优化
- **理论保证**：证明了 RecursiveMAS 比标准 text-based MAS 更高效，训练时梯度稳定
- 在 9 个 benchmark 上测了 4 种协作模式，平均准确率提升 8.3%，推理加速 1.2-2.4 倍，token 减少 34.6%-75.6%

### 优势

- **潜空间传递是关键创新**：传统多 agent 通信靠文本（A 说一段话，B 读一段话），RecursiveMAS 直接传潜空间状态，省了编解码的 token 开销
- **效率提升显著**：token 减少 34.6%-75.6% 不是小数，对成本敏感的生产环境很有吸引力
- **理论分析扎实**：有复杂度分析和学习动力学证明，不是纯实验拍脑袋

### 劣势

- **需要共享潜空间**：异构 agent 要能通过 RecursiveLink 连接，前提是潜空间维度兼容。如果 agent 用的是不同族的模型（比如 GLM + Claude），潜空间对齐本身就是个大问题
- **训练侵入性强**：内外循环联合优化需要梯度回传，意味着 agent 模型必须是可训练的。用 API 调用的黑盒模型（GPT-4、Claude）做不到
- **协作模式有限**：测了 4 种模式，但现实中的 agent 协作模式远不止 4 种

### 工程可行性

低（当前阶段）。RecursiveLink 和内外循环优化都需要对模型权重做修改，不是 plug-and-play 的。但思路很值得借鉴——如果你有自己训练的 agent 模型，潜空间传递比文本传递效率高一个量级。对于用 API 的团队，这个方案暂时用不了。

---

## 横向对比

| 维度 | SearchSwarm | HANA | Interaction Locality | ADEMA | RecursiveMAS |
|------|-------------|------|---------------------|-------|--------------|
| 上下文传递方式 | 摘要返回 | 共享记忆 | 局部写入 | 检查点+段压缩 | 潜空间传递 |
| 层级数 | 2 层 | 2 层 | 递归 | 无固定层级 | 递归 |
| 工程可行性 | 中高 | 中 | 低 | 中 | 低 |
| 场景 | 深度研究 | 网络运维 | 空间推理 | 知识合成 | 通用推理 |
| 是否需要训练 | 是（SFT） | 否 | 否 | 否 | 是（联合优化） |
| 上下文隔离 | 隐式（摘要） | 无（共享记忆） | 有（局部性） | 有（检查点） | 隐式（潜空间） |

---

## 工程启示

**如果你在用 API 调用做主-子 agent 系统**（比如 OpenClaw + GLM/Claude）：

1. **SearchSwarm 的摘要返回模式最实用**：子 agent 只返回结构化摘要，不返回中间过程。但加一个"主 agent 追问"机制——如果摘要信息不够，主 agent 可以要求子 agent 补充特定字段
2. **ADEMA 的检查点机制值得抄**：长周期任务一定要有检查点。OpenClaw 的 sessions_spawn 天然支持中断恢复，可以把 ADEMA 的段级压缩加进去
3. **HANA 的双驱动模式可以简化用**：给 agent 设两个模式——"规划模式"和"应急模式"，不同模式不同 prompt、不同上下文窗口
4. **Interaction Locality 的启发**：主 agent 接收子 agent 返回时，应该把返回结果约束在当前子任务的上下文范围内，不要让一个子 agent 的结果污染其他子任务的决策
5. **RecursiveMAS 暂时用不了**，但它的效率数据说明了文本传递的浪费有多大。如果你有自训模型的机会，潜空间传递是值得探索的方向

**最核心的一个判断**：主-子 agent 的上下文设计，本质是在"信息完整"和"上下文预算"之间找平衡。SearchSwarm 选了压缩（摘要），ADEMA 选了分段（检查点+段压缩），HANA 选了共享（公共记忆）。没有银弹，看你扛得住哪种风险。

---

## 参考资料

1. SearchSwarm - [arXiv:2606.09730](https://arxiv.org/abs/2606.09730)
2. HANA - [arXiv:2605.20608](https://arxiv.org/abs/2605.20608), IEEE Networking Letters 2026
3. Interaction Locality - [arXiv:2605.20784](https://arxiv.org/abs/2605.20784)
4. ADEMA - [arXiv:2604.25849](https://arxiv.org/abs/2604.25849)
5. RecursiveMAS - [arXiv:2604.25917](https://arxiv.org/abs/2604.25917)
6. 裴彤：从 AIOps 到 Agent-Ops（工程实践参考）- [博客文章](https://www.daoyuly.cn/2026/05-22-042-裴彤-从-AIOps-到-Agent-Ops：故障定位-Agent-的设计与实践/)
7. COrDE 模式（工程模式参考）- [博客文章](https://www.daoyuly.cn/2026/07-08-agent-arxiv-daily/)
