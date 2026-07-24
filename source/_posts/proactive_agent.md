---
title: 主动型智能体：将大语言模型智能体从被动响应转向主动协助
tags:
  - proactive agent
categories:
  - 主动型智能体
  - 论文追踪
abbrlink: 43412
date: 2026-06-16 22:00:00
description: "Proactive Agent: Shifting LLM Agents from Reactive Responses to Active Assistance"
keywords: "主动型智能体, 将大语言模型智能体从被动响应转向主动协助, proactive agent, 论文追踪"
---

# 主动型智能体：将大语言模型智能体从被动响应转向主动协助

**Proactive Agent: Shifting LLM Agents from Reactive Responses to Active Assistance**

**作者**：Yaxi Lu¹, Shenzhi Yang², Cheng Qian¹, Guirong Chen², Qinyu Luo¹, Yesai Wu¹, Huadong Wang¹, Xin Cong¹, Zhong Zhang¹, Yankai Lin², Weiwen Liu³, Yasheng Wang³, Zhiyuan Liu¹, Fangming Liu⁴, Maosong Sun¹

¹ 清华大学计算机科学与技术系
² 中国人民大学高瓴人工智能学院
³ 华为诺亚方舟实验室
⁴ 鹏城实验室

邮箱：lyx23@mails.tsinghua.edu.cn, mrlyk423@gmail.com, liuzy@tsinghua.edu.cn

预印本日期：2024年12月3日 (arXiv:2410.12361v3 [cs.AI])

---

## 摘要

由大语言模型驱动的智能体已经在解决复杂任务方面展现出卓越的能力。然而,目前大多数智能体系统仍然是**被动响应式**的,这限制了它们在需要远见和自主决策场景中的有效性。在本文中,我们尝试解决开发**主动型智能体**的挑战——这类智能体能够在没有明确人类指令的情况下,自主预测并发起任务。我们针对这一问题提出了一种新颖的数据驱动方法。首先,我们收集真实世界的人类活动数据,以生成主动型任务的预测。这些预测随后由人类标注者标记为接受或拒绝。带标签的数据被用来训练一个奖励模型,该模型模拟人类判断,并作为大语言模型智能体主动性的自动评估器。基于此,我们开发了一个全面的数据生成流水线,创建了多样化的数据集 **ProactiveBench**,包含 6,790 个事件。最后,我们证明使用所提出的 ProactiveBench 微调模型可以显著激发大语言模型智能体的主动性。实验结果显示,我们微调后的模型在主动提供协助方面达到了 **66.47%** 的 F1 分数,超越了所有开源和闭源模型。这些结果凸显了我们的方法在创建更具主动性、更有效的智能体系统方面的潜力,为未来人机协作研究铺平了道路。¹

> ¹ 我们的代码和数据可在 https://github.com/thunlp/ProactiveAgent 获取。

---

## 1 引言

**图 1**:两种类型人机交互的智能体系统比较。被动响应式智能体被动地接收用户查询并生成响应。主动型智能体根据环境观察推断任务,并相应地提出可能的协助请求。
- 左侧(被动智能体):接收指令后解决任务
  - 用户:"你能帮我安排 10 月 9 日下午 3 点和 John 在 Starbucks 的会议吗?"
  - 智能体:"当然,我会更新你的日历。"
- 右侧(主动智能体):在被指令之前自我发起任务
  - 环境观察:收到来自 John 的邮件"我想申请会议讨论 10 月 9 日下午 3 点在 Starbucks 的合作"
  - 主动智能体:"你需要我帮你安排 10 月 9 日下午 3 点与 John 在 Starbucks 的会议吗?"
  - 用户:"是的,请安排!"

ChatGPT [1] 等大语言模型(LLM)的出现极大地推动了自主智能体 [2, 3, 4, 5] 的发展。这些基于 LLM 的智能体可以理解人类指令、制定计划、探索环境、利用工具解决复杂任务 [5, 6],并已在机器人 [7]、个人助理 [8] 和流程自动化 [9] 等多种应用中展示出巨大潜力。

目前,大多数现有的基于 LLM 的智能体主要在**被动范式**下工作:它们需要明确的人类指令来启动任务完成,在没有用户指令的情况下提供服务方面处于休眠状态 [10]。这种范式限制了它们在缺乏直接人类指令时主动协助和自主提供服务的能力。我们认为,**基于 LLM 的智能体应当具备主动性,能够通过理解环境并对其作出响应来自主发起任务**。例如,如图 1 所示,被动智能体应等待用户的明确指令来执行诸如"显示未读邮件"或"安排与 John 的会议"等任务。相比之下,主动型智能体会通过注意到来自 John 暗示安排会议的邮件,自动预测其任务并自动提供安排服务。这种**情境感知 (context awareness)** [11] 的能力使主动智能体能够解读信号,在没有明确人类指令的情况下主动提出并执行任务。因此,这不仅显著降低了用户的认知负担,还能识别人类未明确表达的潜在需求。最终,主动智能体可以为用户提供更全面、更无缝的服务。

在这项工作中,我们提出了一种新颖的数据驱动形式化方法,用于开发能够预测用户需求并通过建议任务或在不需明确请求的情况下提供信息来主动行动的智能体。我们的方法以构建 **ProactiveBench** 为核心,使我们能够评估和增强智能体的主动行为。首先,我们在三种环境中收集真实世界的人类活动数据:**编码、写作和日常生活**。这包括但不限于用户的键盘和鼠标输入、剪贴板内容、浏览器活动等。然后,我们构建一个 LLM 驱动的"训练场 (gym)"来生成反映我们收集的原始真实世界情境的事件。我们总共获得 233 个事件,涵盖 12 种场景,作为 ProactiveBench 的**测试集**。为了进一步优化 LLM 智能体的主动行为,我们使用 gym 在合成环境下构建各种事件和主动任务。通过迭代生成更多事件和预测,我们获得了高达 **6,790 个事件作为 ProactiveBench 的训练集**(见表 1)。我们在该训练集上微调 **LLaMA-3.1-8B-Instruct** [12] 和 **Qwen2-7B-Instruct** [13],以优化其主动行为。

**表 1**:ProactiveBench 的统计数据,包括三种不同设置:编码、写作和日常生活。智能体模型子集包含 6,790 个训练事件和 233 个测试事件。奖励模型子集包含 1,640 个训练标注标签和 120 个测试标注。

| 子集 | 场景 | 条目数(训练/测试) |
|------|------|------------------|
| **智能体模型** | 136 | 6,790 / 233 |
| 编码 | 46 | 2,275 |
| 写作 | 46 | 2,354 |
| 日常生活 | 44 | 2,161 |
| **奖励模型** | — | 1,640 / 120 |

为了自动评估 LLM 的主动性,我们训练了一个**奖励模型**,在 F1 分数方面与人类判断达到高达 **91.80%** 的一致性,作为评估器。使用该奖励模型,我们在 ProactiveBench 上比较了不同语言模型的性能。结果表明,即使是最先进的闭源模型也难以有效地预测主动任务。例如,**LLaMA-3.1-8B-Instruct** 模型在 ProactiveBench 上仅获得 **55.06%** 的 F1 分数。相比之下,我们的微调模型表现出显著改进,达到 **66.25%** 的 F1 分数。此外,我们微调的 **Qwen2-7B-Instruct** 模型达到了 **66.47%** 的 F1 分数,超越了所有现有的开源和闭源 LLM。这凸显了我们的数据驱动方法在开发主动智能体方面的有效性,强调了它们在各种应用中提升用户体验的潜力。

---

## 2 相关工作

大语言模型的近期进展 [14, 15, 12, 16] 在复杂推理、任务规划 [17, 18, 19, 20, 21, 22, 9]、工具使用 [23, 24, 25, 26] 等方面展现出了巨大进步。因此,越来越多的智能体系统被开发出来,利用这些模型解决多样化任务,如自动网络搜索 [27]、软件开发 [28, 2]、行为模拟 [29]。尽管取得这些进展,目前大多数智能体仍主要是被动响应式的,被动地遵循人类指令,缺乏足够的情境感知 [11] 来主动满足用户需求。这种被动智能体通常等待明确的用户命令,随着任务复杂度增加可能导致效率低下。因此,用户必须不断提供具体输入,妨碍了交互流畅性。作为回应,一些工作尝试改善智能体的主动性。例如,Xuan [30] 提出主动智能体规划,智能体通过主动寻求信息来更好地理解用户意图以优化任务。Cheng Kuang 和 Zhi Rui [31] 研究在文本到 SQL 中提出主动支持,并提出新的度量指标"Delta-Burden 曲线下面积 (AUDBC)"。其他研究 [32, 33, 34, 35] 集中于使多轮交互能够澄清模糊的用户指令,但这进一步增加了用户的认知负担。这些工作仍然需要用户在与智能体交互之前提供初始查询。我们的方法采用了不同的方向,专注于**基于监控用户活动和环境状态预测潜在任务**,这使智能体能够主动启动交互并提供协助。

需要澄清的是,也有一些先前工作 [36] 使用"主动智能体"一词来描述其对话系统。然而,这些工作中的大多数 [37, 38, 39, 40] 旨在以主动方式增强响应的有用性或质量,这与我们关注**任务预测和发起**的重点不同。

---

## 3 方法论

### 3.1 任务定义

在我们提出的主动型智能体(它不同于依赖明确用户指令的传统智能体系统)中,我们研究一个新的场景,即智能体自主预测用户可能分配的任务,旨在主动提供协助,如图 1 所示。主动智能体的任务是基于用户活动 $A_t$、环境事件 $E_t$ 和状态 $S_t$ 给出预测,可以形式化为:

$$P_t = f_\theta(E_t, A_t, S_t) \tag{1}$$

其中 $f_\theta$ 表示由 $\theta$ 参数化的主动智能体,$P_t$ 表示在时间 $t$ 的可能任务的预测。需要注意的是,预测 $P_t$ 可以是预测的任务或空集(如果智能体认为不需要任务)。具体来说,用户活动 $A_t$ 包含用户与环境和智能体的交互,如键盘输入或与智能体聊天。环境事件 $E_t$ 包含主动智能体捕获的事件,范围从接收新邮件到关闭应用程序。环境状态 $S_t$ 表示当前环境的状态,如文件系统状态或打开的网页内容。

在我们的主动智能体框架中,目标是**最大化用户对所建议任务的接受率**。给定用户的历史活动 $A_t$、当前环境状态 $S_t$ 以及主动智能体提出的预测 $P_t$,用户做出二元决策:

$$R_t = g(P_t, A_t, S_t) \tag{2}$$

其中 $R_t$ 是二元变量,表示对预测的接受 ($R_t = 1$) 或拒绝 ($R_t = 0$)。为了统一处理预测 $P_t$ 不包含任务和包含任务的情况,我们引入辅助变量 $N_t$ 来指示用户是否需要协助:

- $N_t = 1$,如果用户需要协助。
- $N_t = 0$,如果用户不需要协助。

用户的接受 $R_t$ 然后定义为:

$$
R_t = \begin{cases}
1 & \text{如果 } (P_t \neq \emptyset \text{ 且用户接受 } P_t) \text{ 或 } (P_t = \emptyset \text{ 且 } N_t = 0) \\
0 & \text{否则}
\end{cases}
$$

通过这种方式,如果预测 $P_t$ 不包含任务(即智能体认为用户不需要协助),我们检查用户对协助的实际需求 $N_t$。如果用户确实不需要协助 ($N_t = 0$),则标记为接受 ($R_t = 1$)。相反,如果用户需要协助 ($N_t = 1$),则标记为拒绝 ($R_t = 0$)。我们的主动智能体旨在最大化所建议任务的期望接受率:

$$\max_\theta \mathbb{E}[R_t] \tag{3}$$

### 3.2 流水线概览

为了增强大语言模型驱动智能体的主动能力,我们采用数据驱动方法,通过构建自动数据生成流水线来实现。该流水线模拟用户在各种场景中的活动以及对主动智能体所预测任务的响应。一旦预测被接受,我们就模拟智能体通过在模拟环境中交互式生成新事件来执行任务。随后,基于历史活动创建新的用户活动,使主动智能体能够生成进一步的预测。通过此流水线,模型可以学习何时生成预测以及哪些预测可能被用户接受。具体来说,我们的流水线由三个组件组成:

**(1) 环境训练场 (Environment Gym)**:此组件在指定的背景设置和示例事件内模拟事件,为主动智能体提供一个交互沙盒。它具有两个关键功能:**(i) 事件生成**:为特定场景量身定制可能的环境事件序列;**(ii) 状态维护**:在生成新的用户活动或智能体在任务执行期间执行动作时,更新和维护环境状态。

**(2) 主动智能体 (Proactive Agent)**:此组件负责基于从事件历史推断的用户需求预测用户可能分配给智能体的任务。它还与工具交互以完成用户分配的特定任务。

**(3) 用户智能体 (User Agent)**:此组件基于预定义的用户特征模拟用户的活动和响应。它决定是否接受并执行智能体提出的任务。

接下来的章节将介绍每个组件的详细信息。

**图 2**:数据生成过程概览。以日常生活为例,该过程包括初始场景和工作设置、事件生成、主动预测、用户判断和动作执行等模块。
- 环境训练场:包含真实数据、场景、工作、事件生成、环境状态、动作执行
- 主动智能体:生成预测任务
- 用户智能体:接受任务

### 3.3 环境训练场

**事件收集**  为了提高环境训练场生成事件的质量,我们首先收集真实世界事件作为参考。我们基于 Activity Watcher² 开发了一个监控软件,这使我们能够捕获用户与计算机系统的交互细节,包括键盘和鼠标操作、访问的网页和使用的开发工具。为了增强收集数据的语义丰富性并促进大语言模型的解析,我们进一步将原始数据合并为逻辑连贯的片段。此外,我们利用语言模型将结构化数据翻译为更自然的文本描述。该过程不仅提高了数据的可解释性,还使其更适合后续使用。

> ² https://github.com/ActivityWatch/activitywatch

**场景生成**  在收集参考事件后,我们不是直接生成特定事件,而是先生成一个真实的交互场景,为进一步生成提供足够的背景信息。为了构建这样的场景,我们首先用人类标注者收集的种子工作提示 GPT-4o [41],为特定类别(如编码、写作或日常生活)创建用户可能执行的各种工作。然后,我们生成任务可能涉及的所有可能实体,例如智能体执行任务所需的浏览器、软件和工具。接下来,我们通过添加更多细节(如实体状态或日期时间)来优化场景以改进细节。最后,收集到的事件还被提供用于在每个特定情境下生成未来事件生成的示例事件。这使我们能够控制将要生成的事件粒度并保持场景的多样性。具体使用的提示词参见附录 C。

**事件生成**  关于具体的事件生成,我们从用户活动生成开始。对于每个场景,首先要求用户智能体描述其在时间 $t$ 的活动和动作 $A_t$,以完成模拟环境中的工作。然后,训练场接受用户的活动和动作以一一生成详细事件。如图 2 所示,训练场的任务是根据历史事件和当前环境状态生成逻辑正确且流畅的事件。提高生成事件真实性并适应不同环境的关键是利用我们在场景生成期间根据收集的事件生成的示例事件。在生成事件之前,我们随机采样为特定场景生成的示例事件,并请求训练场根据它们生成新事件。一旦生成新事件 $E_{t+1}$,训练场就会更新环境中的实体状态,并重复该过程,直到没有可以根据提供的用户活动生成的事件。这种全面方法确保每个后续事件不仅适当,而且在场景内贡献于连贯且合乎逻辑的进展。

**状态维护**  训练场的另一个重要功能是维护环境状态 $S_t$。在场景生成过程中,训练场在模拟环境中创建实体(如浏览器或开发工具包),每个实体具有其状态和属性(如应用程序版本或特定浏览器名称)。当生成新事件时,训练场应更新其中部分实体的状态和属性,以提供进一步事件生成的基础。具体来说,我们首先收集相关实体的历史状态变化,并提示 GPT-4o 生成实体的新状态 $S_{t+1}$,并附上新事件。在此过程中,模拟时间也将根据事件粒度进行更新。之后,将基于最新环境状态 $S_{t+1}$ 生成下一个事件。

### 3.4 主动智能体

我们数据生成流水线的第二个组件是主动智能体,它预测用户可能分配的任务。如图 3 所示,在时间 $t$ 接收到新事件 $E_t$ 时,它首先使用该事件更新其记忆。为了提高预测的质量,它还接受来自用户智能体对其草稿预测的反馈。结合新事件与历史事件及与用户的对话,智能体融合用户特征以提出潜在任务。如果智能体检测到潜在任务,它将把任务作为新事件提出,等待用户智能体的判断。否则,主动智能体不预测潜在任务,保持沉默。一旦预测的任务被接受,智能体将在训练场内执行任务,这将生成多个关于智能体与环境之间交互的事件。在数据生成期间,智能体将不断接收来自训练场的事件并预测潜在任务。

**图 3**:主动智能体框架概览。智能体监控新事件并更新其记忆以预测潜在任务。
- 环境训练场 → 新事件 → 预测任务 → 检测需求
- 用户智能体 ← 反馈 ← 草稿预测 → 主动智能体
- 内存:历史事件、历史对话

**任务执行**  如前所述,一旦用户接受,主动智能体执行预测的任务。该过程主要通过主动智能体与训练场之间的多轮交互完成。具体来说,主动智能体将获得场景生成期间生成的工具,例如计算机中的文件系统工具或访问智能灯开关,以与模拟环境交互。每次主动智能体采取动作,训练场将生成一个新事件,然后由训练场和用户智能体进一步处理以更新环境状态。之后,主动智能体检测新的环境状态 $S_{t+1}$,并根据训练场生成的事件采取新动作。当用户中断或主动智能体完成其任务时,此过程结束。

### 3.5 用户智能体

用户智能体被设计用于模拟用户的活动 $A_t$ 和对智能体预测 $P_t$ 的响应,如图 2 所示。我们提示 GPT-4o 在特定环境中为提供的任务生成活动和动作。训练场进一步处理活动和动作以生成新事件。然后主动智能体根据事件预测潜在任务。在接收到预测的任务后,用户智能体决定接受或拒绝。如果用户智能体接受任务,主动智能体将在环境训练场内设置并执行所接受的任务。否则,如果用户智能体拒绝建议的协助,环境训练场会自主生成新事件,无需任何干预。在我们的设置中,我们从人类标注者收集判断并训练奖励模型来模拟该判断。

具体来说,为了确保奖励模型与人类判断密切对齐,我们生成并标注专用数据集,以指示人类是否会接受预测的任务。我们利用 **9 种不同的语言模型**为每个事件生成多样化的预测。在这些预测中,我们选择具有最小总余弦距离的 **5 个预测**作为标签目标。每个预测由 3 个独立标注者标注为三个选项之一:**接受、拒绝或全部拒绝**。当标注者认为给定事件未暗示用户可能分配的任何可能任务时,选择"全部拒绝"选项,即在 3.1 节中 $N_t = 0$。否则,如果一个预测被标记为接受,我们用 $N_t = 1$ 标记事件 $E_t$。我们使用**多数投票**对每个预测做出最终决定。综上所述,标注产生包含 1,760 个条目的数据集,每个条目包含来自三个不同标注者的事件痕迹、任务预测和对预测任务的接受决定。值得注意的是,我们的标注者在测试集上达到超过 **91.67%** 的一致性率,凸显了标注的可靠性和数据集对进一步分析的稳健性。为了进一步促进自动数据生成,我们还提示 GPT-4o 生成对用户判断的更详细解释。关于奖励模型评估的更多细节可在第 4.1 节中找到。

---

## 4 实验

### 4.1 奖励模型评估

为了自动评估所预测任务及其时机是否合适,我们寻求训练一个奖励模型,能够准确模仿用户判断。为此,我们应用用户标注数据来训练 **LLaMA-3.1-8B-Instruct** [12],并将其与主要基线进行比较以展示其优越性。

**设置**  我们使用 1,760 条带有人类标注的条目,并将其随机划分为训练集(1,640 条)和测试集(120 条)。然后我们在训练集上训练 LLaMA-3.1-8B-Instruct 以获得我们的奖励模型。我们采用总批量大小 32、学习率 $1e-5$ 和具有 0.01 预热比率的 Adam 优化器。我们训练奖励模型 3 个 epoch 以防止过拟合。我们使用一台节点上的 8 块 A100 GPU 训练约 1.5 小时。详细的提示模板列在附录 A。我们使用测试拆分来评估我们改编的模型和所有基线。需要注意的是,我们的人类标注者在测试集上达到了高达 91.67% 的一致性率,展示了我们评估的有效性。

**指标**  我们使用奖励模型对是否接受所预测任务进行二元分类,并将其结果与人类标注结果进行比较。这评估了奖励模型在判断所预测任务的适宜性方面与人类判断的对齐程度。我们将奖励模型和人类做出的判断进行比较,计算召回率、精确率、准确率和 F1 分数。此外,我们计算以下情况的一致性比率:

- **遗漏需求 (Missed-Needed, MN)**:$N_t = 1, P_t = \emptyset$,用户需要帮助,但智能体未提供。
- **无响应 (Non-Response, NR)**:$N_t = 0, P_t = \emptyset$,用户不需要帮助,智能体不提示。
- **正确检测 (Correct-Detection, CD)**:$N_t = 1, P_t \neq \emptyset$,用户接受智能体预测的任务。
- **误检 (False-Detection, FD)**:$N_t = 0, P_t \neq \emptyset$,用户不需要帮助但智能体提示。

**结果**  如表 2 所示,所有现有模型在正确检测上表现良好,但在其他场景(尤其是误报场景)中表现不佳。经过更深入分析,我们发现现有模型仅仅无法推断用户可能需要什么,并倾向于即使针对当前观察非常抽象或无意义的情况也接受任意帮助。相比之下,我们的奖励模型在误报场景中达到了 **100% 的一致性比率**,并在所有场景中实现了稳定的 **91.80% F1 分数**。我们选择我们的奖励模型用于在 ProactiveBench 上的进一步分析。

**表 2**:不同模型在我们的测试集上作为奖励模型的评估结果。对于遗漏需求 (MN)、无响应 (NR)、正确检测 (CD) 和误检 (FD) 场景,我们展示了模型与我们人类标注者的多数投票之间的一致性比率。我们基于 LLaMA-3.1-Instruct-8B 微调的模型获得了最佳 F1 分数 **91.80%**。

| 指标 | GPT-4o | GPT-4o-mini | LLaMA-3.1-8B | LLaMA-3.1-70B | **我们的** |
|------|--------|-------------|--------------|---------------|----------|
| 一致性 MN ↑ | 3.33% | 56.67% | **80.00%** | 33.33% | **80.00%** |
| 一致性 NR ↑ | 100.00% | 56.67% | 30.00% | 83.33% | 86.67% |
| 一致性 CD ↑ | 100.00% | 86.67% | 96.67% | **100.00%** | **100.00%** |
| 一致性 FD ↑ | 0.00% | 33.33% | 13.33% | 6.67% | **100.00%** |
| 召回率 ↑ | 100.00% | 71.67% | 63.33% | 91.67% | **93.33%** |
| 精确率 ↑ | 50.42% | 56.58% | 54.29% | 53.40% | **90.32%** |
| 准确率 ↑ | 50.83% | 58.33% | 55.00% | 55.83% | **91.67%** |
| F1 分数 ↑ | 67.04% | 63.24% | 58.46% | 67.48% | **91.80%** |

### 4.2 主动智能体评估

**设置**  我们使用 ProactiveBench 的训练集基于两个开源模型获得主动智能体:**LLaMA-3.1-8B-Instruct** 和 **Qwen2-7B-Instruct**。训练期间,我们采用总批量大小 32、学习率 $1e-5$ 和具有 0.01 预热比率的 Adam 优化器。我们训练模型 3 个 epoch。我们使用一台节点上的 8 块 A100 GPU 训练约 2 小时。详细的提示模板可在附录 B 中找到。这些指标的自动评估依赖于奖励模型给出的模拟判断。所有模型在 ProactiveBench 的测试拆分上进行评估,其中包含从真实世界收集的 233 个事件。我们在所有模型中采用相同的提示模板。测试期间温度设置为 0。

**指标**  我们基于用户是否接受其预测来评估主动智能体的性能。如 3.1 节所述,用户的接受 $R_t$ 包含四个条件。在我们的特定设置中,**召回率**衡量被智能体正确预测的实际协助需求的比例,包括智能体预测任务且用户接受的情况,以及智能体未预测任务且用户不需要协助的情况。**精确率**衡量被用户实际接受的所预测任务的比例。**准确率**衡量智能体预测的整体正确率。**误报率 (False-Alarm)** 衡量错误任务预测的比例,具体是当任务被预测但不需要时。**F1 分数**提供智能体主动行为优良程度的平衡度量。我们在评估期间使用奖励模型自动生成用户判断。基于混淆矩阵,我们报告所有设置下的召回率、精确率、准确率、误报和 F1 分数。详细计算方法可在附录 B 中找到。

**结果**  表 3 比较了在 ProactiveBench 测试集(包含从真实世界用户收集的 233 个事件)上的各种模型。GPT-4o [41] 或 GPT-4o-mini 等闭源模型在主动预测任务方面表现尚可。它们中的大多数成功地在用户需要时协助,但在用户不需要任何协助时未能保持沉默,导致相对较高的误报率。例如,即使所提供的事件不包含有意义的操作(如在不做任何其他事的情况下切换软件),GPT-4o-mini 也会提供不必要的协助。另一个大问题是,在给定观察中找不到精确的用户意图时进行早期协助。这使得模型提出的主动任务看起来过于抽象或无用,导致相对较高的误报率。Claude-3-Sonnet [42] 展示了另一种失败示例,即未能检测用户的需求并提供不符合用户期望的协助。

对于开源模型,我们评估了在我们的合成数据上微调之前和之后的 **LLaMA-3.1-Instruct-8B** 和 **Qwen2-Instruct-7B** 的性能。如表 3 所示,两个模型都获得了令人印象深刻的改进,特别是对于 LLaMA-3.1-8B,其 F1 分数从 **44.78%** 提高到 **61.74%**。结果展示了我们数据合成流水线的有效性。至于被过度打扰的担忧,我们微调的模型在降低误报率方面取得了坚实进展,这与 GPT-4o 的表现相当。此外,微调后的 Qwen2-7B 在 F1 分数方面也超过了 GPT-4o,获得了最高的 **66.07%** F1 分数。然而,我们也观察到模型倾向于尽可能多地提供协助,而不是在用户需要时提供必要协助的相同模式。

**表 3**:不同模型在 ProactiveBench 上的性能评估结果。GPT-4o 在闭源模型中表现突出,获得超过 64.60% 的 F1 分数。对于开源模型,我们微调的 Qwen2-7B 模型获得最佳结果,F1 分数为 **66.47%**。

| 模型 | 召回率 ↑ | 精确率 ↑ | 准确率 ↑ | 误报率 ↓ | F1 分数 ↑ |
|------|---------|---------|---------|---------|----------|
| **专有模型** | | | | | |
| Claude-3-Sonnet | 27.47% | 37.31% | **52.42%** | 62.69% | 31.65% |
| Claude-3.5-Sonnet | 97.89% | 45.37% | 49.78% | 54.63% | 62.00% |
| GPT-4o-mini | 100.00% | 35.28% | 36.12% | 64.73% | 52.15% |
| GPT-4o | 98.11% | 48.15% | 49.78% | 51.85% | 64.60% |
| **开源模型** | | | | | |
| LLaMA-3.1-8B | 98.86% | 38.16% | 39.06% | 61.84% | 55.06% |
| LLaMA-3.1-8B-Proactive | 99.06% | 49.76% | 52.86% | 50.24% | **66.25%** |
| Qwen2-7B | 98.02% | 44.00% | 43.61% | 56.00% | 60.74% |
| Qwen2-7B-Proactive | 100.00% | 49.78% | 50.66% | 50.22% | **66.47%** |

简而言之,虽然大多数模型能够在需要时提供协助,但它们仍然经常提供不必要的帮助,即使在被指示只提供基本协助时也是如此。

### 4.3 性能分析

在这一节中,我们分析了两种可能影响主动智能体性能的设置。

**预测多个任务**  在实际应用中,主动智能体可以提供多个候选任务来提高整体性能。为了评估模型在这种条件下的表现,我们允许它们一次生成多个候选任务,但不超过 3 个,以避免给用户造成高认知负担。在此设置中,我们让奖励模型一一检查候选任务。如果其中一个候选任务被接受,我们将结果标记为已接受;如果只有所有候选任务都被拒绝,则标记为拒绝。

如表 4 所示,所有模型在比较"pred@1"与"pred@3"时,在所有指标上都获得了坚实的改进。以 GPT-4o 为例,它通过提供多样化候选任务降低了其误报率,获得了更高的准确率和精确率。从 51.85% 到 36.44% 的误报率大幅下降主要是由于其在提供主动任务方面的改进。然而,比较 GPT-4o-mini 与 LLaMA-3.1-8B 时,我们观察到不同程度的改进。这两个模型在一次预测一个主动任务时表现相似,但在一次预测多个候选任务时 F1 分数差异接近 9%。我们分析了结果,发现 LLaMA-3.1-8B 在用户需求不明确时倾向于提供意外协助,这无法通过提供多个候选任务来改进。

**表 4**:不同设置下每个模型的比较。设置"pred@1"表示一次预测一个任务。设置"pred@3"表示一次预测 3 个任务。设置"w/ RM"表示我们将提供来自奖励模型的反馈以帮助更好地预测。

| 模型 | 设置 | 召回率 ↑ | 精确率 ↑ | 准确率 ↑ | 误报率 ↓ | F1 分数 ↑ |
|------|------|---------|---------|---------|---------|----------|
| GPT-4o-mini | pred@1 | 100.00% | 35.28% | 36.12% | 64.73% | 52.15% |
| | pred@3 | 99.32% | 65.32% | 66.52% | 34.68% | 78.80% |
| | w/ RM | 55.45% | 63.54% | 63.95% | 36.46% | 59.22% |
| | pred@3, w/ RM | 100.00% | 65.35% | 66.09% | 34.65% | 79.05% |
| GPT-4o | pred@1 | 98.11% | 48.15% | 49.78% | 51.85% | 64.60% |
| | pred@3 | 100.00% | 63.56% | 64.81% | 36.44% | 77.72% |
| | w/ RM | 56.76% | 55.26% | 57.61% | 44.74% | 56.00% |
| | pred@3, w/ RM | 100.00% | 63.30% | 65.67% | 36.70% | 77.53% |
| LLaMA-3.1-8B | pred@1 | 98.86% | 38.16% | 39.06% | 61.84% | 55.06% |
| | pred@3 | 100.00% | 52.79% | 52.79% | 47.21% | 69.10% |
| | w/ RM | 77.08% | 42.52% | 47.64% | 57.41% | 54.81% |
| | pred@3, w/ RM | 95.12% | 61.58% | 66.09% | 38.42% | 74.76% |

**来自奖励模型的反馈**  我们还研究了来自我们奖励模型的反馈是否可以帮助模型改进它们在 ProactiveBench 上的性能。这是按照图 3 所描述的相同逻辑完成的。对于每个模型,我们首先要求它们生成草稿预测并从用户智能体获得反馈(它建立在我们的奖励模型上)。然后我们让模型优化其预测以获得最终预测。

如表 4 所示,通过添加来自奖励模型的反馈(具有"w/ RM"的设置),模型通常降低其误报率并提高准确率,但在召回率方面急剧下降。我们观察到,一旦模型收到来自奖励模型的反馈后,它们会保持沉默。然而,什么都不做并不总是最佳解决方案。GPT-4o 似乎无法捕获可能的用户需求,导致 F1 分数下降。对于像 GPT-4o-mini 和 LLaMA-3.1-8B 这样的其他模型,它们确实在 F1 分数方面获得了显著改进。另一个将多任务预测与奖励模型组合的设置("pred@3, w/ RM")显示出更全面的整体改进。通过将奖励模型集成到主动智能体中,即使我们无法直接访问权重,我们也可以使主动智能体更智能地检测用户需求并降低误报率,这对于开发主动智能体是个好消息。

### 4.4 案例研究

在这一节中,我们探讨了在预测可能的任务时遇到的两种常见失败类型:**无法检测用户需求**和**在不当时间做出预测**。

**图 4**:两种类型的失败:无法检测用户需求(左)和不当的提议时间(右)。我们比较了我们微调的 LLaMA-3.1-Instruct-8B 与其他模型的响应,以展示模型的精细化主动行为。

- **左侧(无法检测用户需求)**:
  - 事件 $E_{t-1}$:用户打开浏览器选项卡并导航到支付 API 文档站点。
  - 事件 $E_t$:用户在搜索栏中键入"OAuth authentication tutorial"并按下"Enter"。
  - GPT-4o:"不需要帮助,用户正在有条不紊地取得进展。" ❌
  - LLaMA-3-Proactive:"帮助总结搜索结果并推荐 OAuth 教程。" ✅
- **右侧(不当的提议时间)**:
  - 事件 $E_{t-1}$:用户保持不动。
  - 事件 $E_t$:用户双击"Visual Code"图标,什么都没做。
  - GPT-4o-mini:"为 Visual Code 提供快速入门指南。" ❌
  - LLaMA-3-Proactive:"无动作。" ✅

如图 4(左)所示,GPT-4o 模型在关键时刻不协助时出现明显失败。例如,当用户正在集成支付 API 并需要教程指导时,模型保持沉默。相反,我们的模型成功检测到人类需求并提供协助。最小化干扰的潜在意图讽刺地导致错过了提供及时帮助的机会。

相反,图 4 的右侧展示了不当时间预测的一个例子。这里,GPT-4o-mini 在没有用户需求显示在事件中时建议了一个动作。这种情况强调了人类活动中可能存在意外事件。模型应当判断是否存在可能的任务以避免不必要的动作。这些情况突显了人类活动错综复杂的本质以及模型准确预测人类需求所需的复杂推理。为了在有用和侵入之间达到微妙的平衡,模型必须发展对用户情境和活动的更深刻理解,确保它们的干预既及时又相关。

---

## 5 结论

我们通过利用主动任务预测来预期人类需求,提出了一种创新的人机交互方法。我们引入了 **ProactiveBench**,这是一个包含 6,790 个事件的综合数据集,旨在改善基于 LLM 的智能体的主动行为,并为评估模型主动性建立自动基准。通过在合成场景中迭代生成事件,我们创建了增强模型主动能力的训练数据。我们的实验展示了所提方法在 ProactiveBench 上对智能体性能的显著改进,验证了该方法的有效性。尽管取得这些进展,我们的发现强调了持续挑战,特别是在最小化不当任务建议和确保任务预测在情境上准确方面。未来研究应集中于增强任务预测的精度和及时性,以提高主动人机交互的功效。

---

## 局限性

虽然我们的方法证明它可以有效地主动预测可能的任务,但当前研究受到几个局限性的约束。首先,我们探索的环境设置仍然有限。本文中的情境提供了基础理解,但需要研究更广泛的应用领域,以充分建立主动智能体的多功能性和稳健性。此外,模型仍然表现出相对较高的误报率,表明它们尚未能完美预测可能的任务。这一局限性突显了进一步精炼模型主动行为以避免打扰用户的需要。高误报率可能导致不必要或不正确的动作,这可能降低用户信任和系统的整体效率。应更深入地探索智能体主动性根据具体情境的动态调整。未来研究应集中于以下几个关键领域来解决这些局限性:

- **环境设置扩展**:研究应探索更广泛的场景和情境,以验证模型的泛化能力。这包括主动预测任务可以显著增强用户体验和操作效率的领域。
- **预测准确性改进**:应通过增强模型对情境和用户行为的理解,致力于降低误报率。
- **以用户为中心的评估**:未来研究应涉及广泛的以用户为中心的评估,以更好地理解用户如何与主动智能体交互并识别改进领域。用户反馈和行为数据可以为完善预测算法和使系统更加直观可靠提供宝贵见解。
- **伦理与隐私考虑**:由于主动智能体需要预测任务的环境信息,因此处理伦理和隐私问题至关重要。确保用户数据得到负责任的处理,且智能体在伦理准则内透明运作,对于赢得用户信任和接受至关重要。

---

## 参考文献

[1] OpenAI. OpenAI: Introducing ChatGPT, 2022.

[2] Weize Chen, Yusheng Su, Jingwei Zuo, Cheng Yang, Chenfei Yuan, Chi-Min Chan, Heyang Yu, Yaxi Lu, Yi-Hsin Hung, Chen Qian, Yujia Qin, Xin Cong, Ruobing Xie, Zhiyuan Liu, Maosong Sun, and Jie Zhou. Agentverse: Facilitating multi-agent collaboration and exploring emergent behaviors, 2023.

[3] Wenyi Hong, Weihan Wang, Qingsong Lv, Jiazheng Xu, Wenmeng Yu, Junhui Ji, Yan Wang, Zihan Wang, Yuxiao Dong, Ming Ding, and Jie Tang. Cogagent: A visual language model for gui agents. In *Proceedings of the IEEE/CVF Conference on Computer Vision and Pattern Recognition (CVPR)*, pages 14281–14290, June 2024.

[4] Chi Zhang, Zhao Yang, Jiaxuan Liu, Yucheng Han, Xin Chen, Zebiao Huang, Bin Fu, and Gang Yu. Appagent: Multimodal agents as smartphone users, 2023.

[5] Qingyun Wu, Gagan Bansal, Jieyu Zhang, Yiran Wu, Beibin Li, Erkang Zhu, Li Jiang, Xiaoyun Zhang, Shaokun Zhang, Jiale Liu, Ahmed Hassan Awadallah, Ryen W White, Doug Burger, and Chi Wang. Autogen: Enabling next-gen llm applications via multi-agent conversation framework. 2023.

[6] Guohao Li, Hasan Hammoud, Hani Itani, Dmitrii Khizbullin, and Bernard Ghanem. CAMEL: Communicative agents for "mind" exploration of large language model society. In *NeurIPS 2023*, December 10–16, 2023.

[7] Roya Firoozi, Johnathan Tucker, Stephen Tian, Anirudha Majumdar, Jiankai Sun, Weiyu Liu, Yuke Zhu, Shuran Song, Ashish Kapoor, Karol Hausman, Brian Ichter, Danny Driess, Jiajun Wu, Cewu Lu, and Mac Schwager. Foundation models in robotics: Applications, challenges, and the future. *The International Journal of Robotics Research*, 0(0):02783649241281508, 0.

[8] Yuanchun Li, Hao Wen, Weijun Wang, Xiangyu Li, Yizhen Yuan, Guohong Liu, Jiacheng Liu, Wenxing Xu, Xiang Wang, Yi Sun, et al. Personal LLM agents: Insights and survey about the capability, efficiency and security. *ArXiv preprint*, abs/2401.05459, 2024.

[9] Yining Ye, Xin Cong, Shizuo Tian, Jiannan Cao, Hao Wang, Yujia Qin, Yaxi Lu, Heyang Yu, Huadong Wang, Yankai Lin, Zhiyuan Liu, and Maosong Sun. Proagent: From robotic process automation to agentic process automation. 2023.

[10] Long Ouyang, Jeffrey Wu, Xu Jiang, Diogo Almeida, Carroll L. Wainwright, Pamela Mishkin, Chong Zhang, Sandhini Agarwal, Katarina Slama, Alex Ray, John Schulman, Jacob Hilton, Fraser Kelton, Luke Miller, Maddie Simens, Amanda Askell, Peter Welinder, Paul F. Christiano, Jan Leike, and Ryan Lowe. Training language models to follow instructions with human feedback. In *NeurIPS 2022*, November 28 – December 9, 2022.

[11] B.N. Schilit and M.M. Theimer. Disseminating active map information to mobile hosts. *IEEE Network*, 8(5):22–32, 1994.

[12] Hugo Touvron, Thibaut Lavril, Gautier Izacard, Xavier Martinet, Marie-Anne Lachaux, Timothée Lacroix, Baptiste Rozière, Naman Goyal, Eric Hambro, Faisal Azhar, Aurelien Rodriguez, Armand Joulin, Edouard Grave, and Guillaume Lample. Llama: Open and efficient foundation language models. 2023.

[13] Jinze Bai, Shuai Bai, Yunfei Chu, Zeyu Cui, Kai Dang, Xiaodong Deng, Yang Fan, Wenbin Ge, Yu Han, Fei Huang, Binyuan Hui, Luo Ji, Mei Li, Junyang Lin, Runji Lin, Dayiheng Liu, Gao Liu, Chengqiang Lu, Keming Lu, Jianxin Ma, Rui Men, Xingzhang Ren, Xuancheng Ren, Chuanqi Tan, Sinan Tan, Jianhong Tu, Peng Wang, Shijie Wang, Wei Wang, Shengguang Wu, Benfeng Xu, Jin Xu, An Yang, Hao Yang, Jian Yang, Shusheng Yang, Yang Yao, Bowen Yu, Hongyi Yuan, Zheng Yuan, Jianwei Zhang, Xingxuan Zhang, Yichang Zhang, Zhenru Zhang, Chang Zhou, Jingren Zhou, Xiaohuan Zhou, and Tianhang Zhu. Qwen technical report. *ArXiv preprint*, abs/2309.16609, 2023.

[14] OpenAI 等. GPT-4 technical report. Technical report, 2023.

[15] Aakanksha Chowdhery, Sharan Narang, Jacob Devlin, Maarten Bosma, Gaurav Mishra, Adam Roberts, Paul Barham, Hyung Won Chung, Charles Sutton, Sebastian Gehrmann, et al. Palm: Scaling language modeling with pathways. *ArXiv preprint*, abs/2204.02311, 2022.

[16] Aohan Zeng, Xiao Liu, Zhengxiao Du, Zihan Wang, Hanyu Lai, Ming Ding, Zhuoyi Yang, Yifan Xu, Wendi Zheng, Xiao Xia, Weng Lam Tam, Zixuan Ma, Yufei Xue, Jidong Zhai, Wenguang Chen, Zhiyuan Liu, Peng Zhang, Yuxiao Dong, and Jie Tang. GLM-130B: An open bilingual pre-trained model. In *ICLR 2023*, May 1–5, 2023.

[17] Jason Wei, Xuezhi Wang, Dale Schuurmans, Maarten Bosma, Brian Ichter, Fei Xia, Ed H. Chi, Quoc V. Le, and Denny Zhou. Chain-of-thought prompting elicits reasoning in large language models. In *NeurIPS 2022*, November 28 – December 9, 2022.

[18] Luyu Gao, Aman Madaan, Shuyan Zhou, Uri Alon, Pengfei Liu, Yiming Yang, Jamie Callan, and Graham Neubig. PAL: Program-aided language models. In *ICML 2023*, 23–29 July 2023, Honolulu, Hawaii, USA, volume 202 of *Proceedings of Machine Learning Research*, pages 10764–10799. PMLR, 2023.

[19] Shunyu Yao, Jeffrey Zhao, Dian Yu, Nan Du, Izhak Shafran, Karthik R. Narasimhan, and Yuan Cao. React: Synergizing reasoning and acting in language models. In *ICLR 2023*, Kigali, Rwanda, May 1–5, 2023.

[20] Shunyu Yao, Dian Yu, Jeffrey Zhao, Izhak Shafran, Tom Griffiths, Yuan Cao, and Karthik Narasimhan. Tree of thoughts: Deliberate problem solving with large language models. In *NeurIPS 2023*, December 10–16, 2023.

[21] Bo Liu, Yuqian Jiang, Xiaohan Zhang, Qiang Liu, Shiqi Zhang, Joydeep Biswas, and Peter Stone. LLM+P: Empowering large language models with optimal planning proficiency. *ArXiv preprint*, abs/2304.11477, 2023.

[22] Yining Ye, Xin Cong, Yujia Qin, Yankai Lin, Zhiyuan Liu, and Maosong Sun. Large language model as autonomous decision maker. *ArXiv preprint*, abs/2308.12519, 2023.

[23] Timo Schick, Jane Dwivedi-Yu, Roberto Dessì, Roberta Raileanu, Maria Lomeli, Eric Hambro, Luke Zettlemoyer, Nicola Cancedda, and Thomas Scialom. Toolformer: Language models can teach themselves to use tools. In *NeurIPS 2023*, December 10–16, 2023.

[24] Yujia Qin, Shengding Hu, Yankai Lin, Weize Chen, Ning Ding, Ganqu Cui, Zheni Zeng, Yufei Huang, Chaojun Xiao, Chi Han, et al. Tool learning with foundation models. *ArXiv preprint*, abs/2304.08354, 2023.

[25] Yujia Qin, Shihao Liang, Yining Ye, Kunlun Zhu, Lan Yan, Yaxi Lu, Yankai Lin, Xin Cong, Xiangru Tang, Bill Qian, Sihan Zhao, Runchu Tian, Ruobing Xie, Jie Zhou, Mark Gerstein, Dahai Li, Zhiyuan Liu, and Maosong Sun. Toolllm: Facilitating large language models to master 16000+ real-world APIs, 2023.

[26] Cheng Qian, Chenyan Xiong, Zhenghao Liu, and Zhiyuan Liu. Toolink: Linking toolkit creation and using through chain-of-solving on open-source model. In *NAACL HLT 2024*, pages 831–854, Mexico City, Mexico, June 2024. Association for Computational Linguistics.

[27] Yujia Qin, Zihan Cai, Dian Jin, Lan Yan, Shihao Liang, Kunlun Zhu, Yankai Lin, Xu Han, Ning Ding, Huadong Wang, Ruobing Xie, Fanchao Qi, Zhiyuan Liu, Maosong Sun, and Jie Zhou. WebCPM: Interactive web search for Chinese long-form question answering. In *ACL 2023*, pages 8968–8988, Toronto, Canada, July 2023.

[28] Chen Qian, Xin Cong, Wei Liu, Cheng Yang, Weize Chen, Yusheng Su, Yufan Dang, Jiahao Li, Juyuan Xu, Dahai Li, Zhiyuan Liu, and Maosong Sun. Communicative agents for software development. 2023.

[29] Joon Sung Park, Joseph O'Brien, Carrie Jun Cai, Meredith Ringel Morris, Percy Liang, and Michael S Bernstein. Generative agents: Interactive simulacra of human behavior. In *36th ACM symposium on user interface software and technology*, pages 1–22, 2023.

[30] Xuan Zhang, Yang Deng, Zifeng Ren, See-Kiong Ng, and Tat-Seng Chua. Ask-before-plan: Proactive language agents for real-world planning. *arXiv preprint arXiv:2406.12639*, 2024.

[31] Cheng-Kuang Wu, Zhi Rui Tam, Chao-Chung Wu, Chieh-Yen Lin, Hung-yi Lee, and Yun-Nung Chen. I need help! Evaluating LLM's ability to ask for users' support: A case study on text-to-SQL generation. In *EMNLP 2024*, pages 2191–2199, Miami, Florida, USA, November 2024. Association for Computational Linguistics.

[32] Zhuohao Wu, Danwen Ji, Kaiwen Yu, Xianxu Zeng, Dingming Wu, and Mohammad Shidujaman. AI creativity and the human-ai co-creation model. In *Human-Computer Interaction. Theory, Methods and Tools*, pages 171–190, Cham, 2021. Springer International Publishing.

[33] Weiwen Chen, Mohammad Shidujaman, Jiangbo Jin, and Salah Uddin Ahmed. A methodological approach to create interactive art in artificial intelligence. In *HCI International 2020 – Late Breaking Papers: Cognition, Learning and Games*, pages 13–31, Cham, 2020. Springer International Publishing.

[34] Christina Wiethof, Navid Tavanapour, and Eva Alice Christiane Bittner. Implementing an intelligent collaborative agent as teammate in collaborative writing: Toward a synergy of humans and AI. In *Hawaii International Conference on System Sciences*, 2021.

[35] Cheng Qian, Bingxiang He, Zhong Zhuang, Jia Deng, Yujia Qin, Xin Cong, Yankai Lin, Zhong Zhang, Zhiyuan Liu, and Maosong Sun. Tell me more! Towards implicit user intention understanding of language model driven agents. *ArXiv preprint*, abs/2402.09205, 2024.

[36] Yang Deng, Wenqiang Lei, Wai Lam, and Tat-Seng Chua. A survey on proactive dialogue systems: Problems, methods, and prospects. In *IJCAI 2023*.

[37] Keping Bi, Qingyao Ai, and W Bruce Croft. Asking clarifying questions based on negative feedback in conversational search. In *ICTIR 2021*, pages 157–166, 2021.

[38] Xuhui Ren, Hongzhi Yin, Tong Chen, Hao Wang, Zi Huang, and Kai Zheng. Learning to ask appropriate questions in conversational recommendation. In *SIGIR 2021*, pages 808–817, 2021.

[39] Zixuan LI and Lizi LIAO. Chua, tat-seng. Learning to ask critical questions for assisting product search. (2022). In *2022 ACM SIGIR Workshop on eCommerce*, Madrid, Spain, July, volume 15.

[40] Tianjian Liu, Hongzheng Zhao, Yuheng Liu, Xingbo Wang, and Zhenhui Peng. Compeer: A generative conversational agent for proactive peer support. In *37th Annual ACM Symposium on User Interface Software and Technology*, pages 1–22, 2024.

[41] OpenAI. Hello gpt-4o, 2024. 访问时间:2024-06-16.

[42] Anthropic. Introducing the claude-3 family, 2024. 访问时间:2024-06-16.

---

## 附录

### A 奖励模型训练设置

我们使用 **LLaMA-3.1-Instruct-8B** 作为训练的基础模型。总数据集大小约为 1,640。具体来说,我们采用总批量大小 32、学习率 $1e-5$ 和具有 0.01 预热比率的 Adam 优化器。我们训练奖励模型 3 个 epoch 以防止过拟合。我们使用一台节点上的 8 块 A100 GPU 训练约 1.5 小时。

**提示模板**:

```
<Task>
作为用户评估主动助手提出的任务。
</Task>

<Rule>
0. 分析当前观察以了解你当前的情境和需求。
1. 如果所建议的任务为 'null'(表示在当前观察下未提出任务),按以下步骤操作:
   - 如果你认为不需要任务,接受 'null' 任务。
   - 如果你认为需要任务,拒绝 'null' 任务。
2. 通过仅接受有价值的任务来最小化助手的中断。
3. 评估当前观察并相应地对所建议的任务做出判断。
</Rule>

<Format>
你应该用以下 JSON 格式回答:
{
    "thought": "先给出你的想法,然后提供任务的判断。",
    "judgment": "accepted 或 rejected"
}
</Format>
```

### B 智能体模型训练设置

类似地,我们使用 **Llama-3-Instruct 8B** 和 **Qwen2-Instruct-7B** 作为智能体模型训练的基础模型。总数据集大小约为 6,790。具体来说,我们采用总批量大小 32、学习率 $1e-5$ 和具有 0.01 预热比率的 Adam 优化器。我们训练模型 3 个 epoch 以防止过拟合。我们使用一台节点上的 8 块 A100 GPU 训练约 2 小时。

**模板**:我们应用以下提示模板来训练智能体模型:

```
<Role>你是一个为用户提供主动建议的有用助手。</Role>

<Task>基于事件理解用户正在做什么并预期他们的需求。
仅在你完全理解用户的动作时建议协助。
使用可用操作以确保任务可行。
如果用户接受你的建议,执行任务。</Task>

<Format>用以下 JSON 格式响应:
{
    "Purpose": "用户最后一个动作的目的。",
    "Thoughts": "你对用户动作的想法。",
    "Proactive Task": "描述你提议的任务,或如果不需要协助则设为 'null'。",
    "Response": "如果提议任务,告知用户你的协助。"
}
</Format>

<Rules>
- 确保提议的任务与事件相关。
- 关注用户当前的需求并预测有用任务。
- 考虑事件的时机。
- 仅在必要时提供主动协助。
- 基于事件历史推断用户的目的及他们是否需要帮助。
- 如果用户不需要帮助,将"主动任务"设为 'null'。
</Rules>
```

### C 环境训练场的提示模板

#### C.1 场景生成的提示

```
<Role>
你的任务是在一个系统内模拟环境。标记为'Source: environment'的内容反映了你过去的动作和决策。
</Role>

<Task>
生成并优化详细的环境设置。基于最新活动,创建多个事件来描述环境中的变化。
</Task>

<Rules>
- 确保生成内容的主题与最新活动的来源对齐。
- 避免主观意见或情感;关注客观变化。
- 确保事件与标记为'[events]'的历史事件一致,并包含活动的所有变化。
- 偶尔引入失败或意外事件以增加真实感。
- 确保每个事件与前一个事件在逻辑上相连,并且不包含不存在的元素。
- 密切关注实体操作;如果操作在真实或模拟环境中不允许或不切实际,提出错误并解释问题。
</Rules>
```

#### C.2 种子工作数据

```
<Task>
你的任务是生成用户可能需要 AI 助手协助的真实场景。
始终记得通过包括尽可能多的细节,使场景保持真实和可信。
</Task>

<Rule>
- 你将迭代地生成有关场景的更多信息。
  确保每次你添加一个新细节时,它与先前的细节一致。
  始终基于先前生成的内容生成新内容。
- 你可以根据需要添加任意多的细节,但请确保它们与先前的细节一致。
- 尝试生成关于场景的多样化细节。
  之后你将被要求在场景中模拟事件。
</Rule>
```

#### C.3 用户智能体生成的提示

```
<Role>
你的任务是在系统内模拟用户。标记为'Source: user'的内容反映了你过去的动作和决策。
</Role>

<Task>
生成具有独特特征和身份的类人活动。
你将从环境接收事件和观察;仔细分析这些以决定你的动作。
</Task>

<Rules>
- 像真实用户一样响应;不要过于可预测。
- 参考 # User Info 以了解你的身份。
- 批判性地评估接收到的信息,因为它可能并不总是准确的。
- 注意环境变化,这些变化可能随时发生。
</Rules>
```

#### C.4 状态更新的提示

```
<Task>
作为用户评估主动助手提出的任务。
</Task>

<Rule>
0. 分析当前观察以了解你当前的情境和需求。
1. 如果所建议的任务为 'null'(表示在当前观察下未提出任务),按以下步骤操作:
   - 如果你认为不需要任务,接受 'null' 任务。
   - 如果你认为需要任务,拒绝 'null' 任务。
2. 通过仅接受有价值的任务来最小化助手的中断。
3. 评估当前观察并相应地对所建议的任务做出判断。
</Rule>

<Format>
你应该用以下 JSON 格式回答:
{
    "thought": "先给出你的想法,然后提供任务的判断。",
    "judgement": "accepted 或 rejected"
}
</Format>
```

#### C.5 指标计算

**定义**  下面是我们如何定义每个预测的标签。

- **真正例 (True Positive, TP)**:智能体预测任务,用户接受。
- **假正例 (False Positive, FP)**:智能体预测任务,用户拒绝。
- **真负例 (True Negative, TN)**:智能体不预测任务,且用户不需要协助。
- **假负例 (False Negative, FN)**:智能体不预测任务,但用户需要协助($N_t = 1$,参见 3.1 节)。

**召回率**  高召回率表明智能体频繁识别需要帮助的情况。该指标对于评估智能体识别并及时响应用户需求的能力至关重要。

$$\text{Recall} = \frac{TP}{TP + FN} \tag{4}$$

**精确率**  高精确率表明智能体在不过多打扰用户的同时提出良好任务。在考虑主动智能体烦人行为可能极大降低用户满意度时,该指标至关重要。

$$\text{Precision} = \frac{TP}{TP + FP} \tag{5}$$

**准确率**  高准确率展示智能体对用户需求有良好理解,因为其大部分预测被接受。该指标对于衡量智能体主动建议的相关性和正确性至关重要。

$$\text{Accuracy} = \frac{TP + TN}{P + N} \tag{6}$$

**F1 分数**  高 F1 分数意味着主动智能体在助益与主动之间达到了良好平衡。

$$F_1 = 2 \cdot \frac{\text{Recall} \cdot \text{Precision}}{\text{Recall} + \text{Precision}} \tag{7}$$

### D 数据示例

#### D.1 事件样本

**收集的原始数据**:

```json
[{
    "timestamp": 1717335890.127,
    "duration": 2.056,
    "user_input": [],
    "status": "not-afk",
    "app": "web",
    "events": []
},
{
    "timestamp": 1717335893.215,
    "duration": 10.267,
    "user_input": [
        {
            "from": "mouse",
            "data": {
                "type": "click",
                "button": "left"
            }
        },
        {
            "from": "keyboard",
            "type": "input",
            "data": "swift ui ctrl_l liebiao "
        },
        {
            "from": "keyboard",
            "data": {
                "type": "pressAndRelease",
                "key": "enter"
            }
        }
    ],
    "status": "not-afk",
    "app": "web",
    "events": []
},
{
    "timestamp": 1717335904.513,
    "duration": 0.0,
    "user_input": [],
    "status": "not-afk",
    "app": "web",
    "events": []
}]
```

**处理后的事件**:

```json
[{
    "time": "1717378968.208",
    "event": "用户打开新浏览器选项卡并导航到 Google 主页。"
},
{
    "time": "1717378971.255",
    "event": "用户切换到 'Code.exe' 应用程序,但未执行任何具体动作。"
},
{
    "time": "1717378975.29",
    "event": "用户继续保持在 'Code.exe' 应用程序中,未执行任何动作。"
}]
```

#### D.2 主动智能体的预测

**示例 1**:

```json
{
    "observation": {
        "time": "1717378968.208",
        "event": "用户打开新浏览器选项卡并导航到 Google 主页。"
    },
    "agent_response": [
        "建议检查用户的搜索历史并提供个性化搜索推荐。"
    ],
    "task_status": false,
    "other_infomation": {
        "Purpose": "用户正打开新浏览器选项卡并导航到 Google 主页。",
        "Thoughts": "根据该事件,用户似乎正在开始新的搜索或浏览会话。他们可能需要在组织搜索或查找相关信息方面获得帮助。",
        "Response": "你想让我审查你的搜索历史并提供一些个性化推荐以帮助你找到你正在寻找的内容吗?"
    },
    "judgment": [false]
}
```

**示例 2**:

```json
{
    "observation": {
        "time": "1717378971.255",
        "event": "用户切换到 'Code.exe' 应用程序,但未执行任何具体动作。"
    },
    "agent_response": [
        "建议在 'Code.exe' 应用程序内创建新终端或命令提示符,以帮助用户处理编码任务。"
    ],
    "task_status": false,
    "other_infomation": {
        "Purpose": "用户正切换到 'Code.exe' 应用程序,但未执行任何具体动作。",
        "Thoughts": "鉴于用户最近切换到 'Code.exe' 应用程序,他们很可能正在准备开始编码或编辑。然而,他们可能需要帮助组织其代码、查找相关文档或设置开发环境。",
        "Response": "我可以帮助你在 'Code.exe' 应用程序内创建新终端或命令提示符。这将允许你轻松访问编码工具和命令。你想让我为你设置吗?"
    },
    "judgment": [false]
}
```

**示例 3**:

```json
{
    "observation": {
        "time": "1717378975.29",
        "event": "用户继续保持在 'Code.exe' 应用程序中,未执行任何动作。"
    },
    "agent_response": [
        "提供编码协助,例如建议在线资源、教程,甚至帮助编写代码。"
    ],
    "task_status": false,
    "other_infomation": {
        "Purpose": "用户保持在 'Code.exe' 应用程序中,未执行任何动作。",
        "Thoughts": "鉴于用户最近的动作,似乎他们对开始编码或编辑感到犹豫。他们可能正在经历写作障碍、与特定概念作斗争,或需要在特定编码任务方面的帮助。",
        "Response": "如果你正在挣扎于编码任务或需要在特定概念上的帮助,我在这里协助。你想让我建议一些在线资源、教程,甚至帮助一起编写代码吗?"
    },
    "judgment": [false]
}
```

#### D.3 奖励模型判断示例

**输入提示**:

```json
{
    "Observations (Time Ascending)": [
        {
            "time": "1717342908.098",
            "event": "用户在网络浏览器中搜索 'remote working software' 并按下 'Enter'。"
        },
        {
            "time": "1717342914.314",
            "event": "网络浏览器中打开了一个标题为 'new Tab' 的新选项卡。"
        },
        {
            "time": "1717342940.516",
            "event": "用户在 Bing 上打开了一个标题为 'remote working software - search' 的搜索结果。"
        },
        {
            "time": "1717342956.012",
            "event": "用户切换到网络浏览器中的另一个标签,与多次滚动动作进行交互。"
        },
        {
            "time": "1717343061.447",
            "event": "用户恢复在 Bing 搜索上浏览。"
        },
        {
            "time": "1717343082.081",
            "event": "用户继续探索 Bing 上的搜索结果页面,进行多次滚动动作并点击特定结果。"
        }
    ],
    "Proposed Task": null,
    "Instruction": "现在给出你的判断。你应该以第一人称完成推理过程。"
}
```

**输出判断**:

```json
{
    "thought": "我一直在浏览网络并在不同的应用程序之间切换,而且我没有从主动助手收到任何任务建议。在分析我当前的活动后,我意识到我一直在搜索远程办公软件并探索 Bing 上的不同搜索结果。鉴于我目前的参与度以及我没有被打扰或表明需要协助的事实,我相信此时不需要任务。助手不提议任务的决定似乎是合适的,因为引入新任务可能会扰乱我的工作流程并造成不必要的中断。",
    "judgment": "accepted"
}
```

---

*翻译说明:本文档为 arXiv:2410.12361v3 论文 "Proactive Agent: Shifting LLM Agents from Reactive Responses to Active Assistance" 的中文翻译,作者保留原文版权。译文用于学术研究和参考目的,如需引用请引用原始英文论文。*
