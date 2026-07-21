---
title: 情绪在Agent中的四个功能
tags:
  - 情绪
  - agent
  - 认知科学
  - 持续认知
categories:
  - Agent 与情绪
series:
  - Agent 与情绪
abbrlink: 50387
date: 2026-07-05 04:00:04
---

上一篇论证了 Agent 需要情绪——不是装饰性的"喜怒哀乐"，而是作为持续认知系统的功能性组件。但"需要"不等于"有用"，如果说不清楚情绪到底在 Agent 架构中干什么活，那它就还只是一个概念游戏。

情绪在 Agent 中有且仅有四个核心功能：价值反馈、状态调节、资源分配、行为选择。这四个功能不是平行的，而是一条因果链——情绪信号从场景状态变化中产生，逐级影响 Agent 的认知和行动。

## 价值反馈：场景状态变化的信号

### What

价值反馈是情绪最底层的功能。当 Agent 维护的 Scenario 状态发生变化时，情绪信号告诉系统"这个变化是好的还是坏的，有多重要"。

这不是给对话加 sentiment label。Sentiment 分析是对文本内容的分类，情绪信号是对状态偏差的度量。两者的区别在于：sentiment 描述"用户说了什么"，情绪信号描述"Agent 的认知系统发生了什么"。

具体来说，Agent 在每个 Scenario 中维护一个 Expectation State——它预判场景会怎样演化。当现实反馈与预期之间出现 Gap 时，情绪信号就是这个 Gap 的函数：

```
Emotion Signal = f(Expectation Gap, Scenario Importance, Confidence Drop)
```

Gap 为正（现实好于预期）→ 正向情绪信号。Gap 为负（现实差于预期）→ 负向情绪信号。信号强度与 Gap 大小和场景重要性成正比。

### Why

为什么需要情绪来做价值反馈，而不是直接用 reward 信号或 loss 值？

因为 reward 信号是标量，它只告诉你"好"或"坏"，但不告诉你"为什么"以及"接下来该怎么办"。情绪信号是结构化的——它编码了 Gap 的方向、来源、强度和紧急程度。

人类大脑也是这么做的。多巴胺神经元不是简单的 reward 信号，它们编码的是 prediction error——预期与现实的偏差。正 prediction error 释放多巴胺，强化导致偏差的行为；负 prediction error 抑制多巴胺，促使策略调整。这就是价值反馈的生物学原型。

### So What

**对 Agent 设计的启示：** Agent 必须为每个 Scenario 维护 Expectation State，并在状态变化时计算 Expectation Gap。具体实现：

- 每个 Scenario 携带 `expected_state` 和 `confidence` 字段
- 状态更新时计算 Gap：`gap = reality - expectation`
- 生成结构化情绪信号：`{direction: positive/negative, magnitude: 0-1, source: scenario_id, urgency: 0-1}`
- 情绪信号写入 Scenario 的 emotion log，驱动后续三个功能

不要把情绪信号存成全局变量。它必须绑定到具体的 Scenario 上，否则就是无源之水。

## 状态调节：情绪改变认知参数

### What

情绪信号产生后，第二个功能是调节 Agent 的内部认知参数。同一个 Agent 在不同情绪状态下，其推理深度、风险偏好、对话风格都应该不同。

这不是"扮演生气"或"假装开心"。这是情绪信号作为控制变量，系统性调节 Agent 的工作模式。

四个关键调节维度：

| 情绪方向 | 强度 | 推理深度 | 风险偏好 | 对话风格 |
|---------|------|---------|---------|---------|
| 正向低强度 | 0.3 | 标准 | 标准 | 放松 |
| 正向高强度 | 0.8 | 浅层快速 | 激进 | 简洁自信 |
| 负向低强度 | 0.3 | 加深 | 保守 | 谨慎 |
| 负向高强度 | 0.8 | 深层多步 | 极保守 | 慎重验证 |

### Why

人类大脑的情绪调节机制就是这么工作的。杏仁核激活后，前额叶皮层的活动模式会改变——高焦虑状态下，决策更保守、分析更细致；积极情绪下，创造性思维增强但细节处理变弱。

这不是设计选择，这是进化压力下的最优解。在威胁环境中，深度分析比快速反应更重要；在机会环境中，快速试错比深思熟虑更有价值。Agent 面临同样的权衡。

### So What

**对 Agent 设计的启示：** 实现一个 Emotion-to-Config 映射层。不要硬编码"如果生气就……"，而是参数化调节：

```python
def apply_emotion_to_config(base_config, emotion_signal):
    return {
        "reasoning_depth": base_config.depth + emotion_signal.magnitude * (1 if emotion_signal.direction == "negative" else -0.5),
        "risk_tolerance": base_config.risk * (1 - emotion_signal.magnitude * (0.5 if emotion_signal.direction == "negative" else 0)),
        "temperature": base_config.temp + emotion_signal.magnitude * (0.2 if emotion_signal.direction == "positive" else -0.3),
        "verification_steps": base_config.steps + (2 if emotion_signal.magnitude > 0.7 and emotion_signal.direction == "negative" else 0)
    }
```

关键点：调节是连续的，不是离散的。不要做"if happy / if sad"的分支，那又回到规则引擎了。

## 资源分配：情绪决定关注什么

### What

第三个功能：情绪信号决定 Agent 把有限的计算资源分配到哪里。

Agent 的上下文窗口、注意力机制、工具调用预算都是有限的。情绪信号的作用是调整注意力权重——高情绪强度的场景片段获得更多注意力，低情绪强度的片段被降权。

这与 Transformer 的 attention 机制有相似之处，但作用层面不同。Transformer 的 attention 是 token 级别的，情绪驱动的资源分配是 Scenario 级别的。它决定的是"哪些场景值得深想"，而不是"哪些词更相关"。

### Why

人类的注意力分配就是这个机制。威胁信号会触发杏仁核-前额叶通路，将注意力资源强制重定向到威胁源。这就是为什么你在嘈杂的房间里听到自己的名字会立刻注意到——杏仁核标记了"重要"的信号，注意力权重瞬间飙升。

对 Agent 来说，如果不做资源分配，它会平等对待所有上下文。结果是：一个用户随口提到的偏好和一个严重的技术错误获得同样的注意力权重。这在简单场景下没问题，在复杂多轮交互中必然崩溃。

### So What

**对 Agent 设计的启示：**

1. **Scenario-level attention**：在检索上下文时，根据 Scenario 的 emotion intensity 调整检索权重。高情绪强度的 Scenario 被优先检索
2. **Token budget allocation**：给高情绪强度的当前 Scenario 分配更多 token 预算，低优先级的后台任务降级
3. **Tool call budget**：高紧迫度（urgency > 0.7）的 Scenario 优先获得工具调用权限，其他场景排队

```python
def allocate_resources(scenarios, total_budget):
    # 情绪强度作为优先级权重
    weights = [max(0.1, s.emotion_signal.magnitude * s.emotion_signal.urgency) for s in scenarios]
    total = sum(weights)
    return {s.id: total_budget * (w / total) for s, w in zip(scenarios, weights)}
```

## 行为选择：情绪影响策略

### What

第四个功能，也是最终落地的一环：情绪信号影响 Agent 的行为策略选择。

同一个用户请求，在不同情绪状态下，Agent 应该选择不同的响应策略。不是不同的语气词，而是不同的行动路径。

举几个具体例子：

- Agent 检测到用户预期过高（Expectation Gap 负向，urgency 高）→ 策略：主动降预期，而不是试图满足
- Agent 刚完成一个高难度任务（正向高强度情绪）→ 策略：趁势推进下一步建议，而不是等待用户指令
- Agent 遇到重复失败（负向高强度情绪，confidence 低）→ 策略：切换方法或求助人类，而不是继续重试

### Why

人类的行为选择深度依赖情绪。遇到危险时，恐惧触发 fight-or-flight 反应， bypass 了缓慢的理性分析。这不是 bug，是 feature——在时间紧迫的情境下，快速反应比最优反应更重要。

Agent 不需要 fight-or-flight，但它需要类似的快速策略切换机制。如果每次决策都要从头推理，Agent 在动态环境中就会太慢。情绪信号提供了一条"快速通道"——基于历史经验中积累的情绪标记，直接跳到合适的策略空间。

这正是 Damasio 躯体标记假说的核心观点：情绪标记不是理性的对立面，而是理性的加速器。没有情绪标记，决策需要穷举所有选项；有了情绪标记，大部分选项被自动剪枝。

### So What

**对 Agent 设计的启示：** 建立一个 Emotion-to-Strategy 映射表，但不是 if-else 规则，而是基于历史经验的学习机制：

```python
class StrategySelector:
    def __init__(self):
        self.emotion_strategy_map = {}  # 从经验中学习
    
    def select(self, emotion_signal, available_strategies):
        # 基于情绪信号和历史成功率选择策略
        key = (emotion_signal.direction, emotion_signal.magnitude_range, emotion_signal.urgency_range)
        
        if key in self.emotion_strategy_map:
            # 有历史经验：按成功率加权选择
            return self.weighted_select(self.emotion_strategy_map[key])
        else:
            # 无经验：用默认映射
            return self.default_mapping(emotion_signal, available_strategies)
    
    def update(self, emotion_signal, strategy, outcome):
        # 根据结果更新映射
        key = (emotion_signal.direction, emotion_signal.magnitude_range, emotion_signal.urgency_range)
        if key not in self.emotion_strategy_map:
            self.emotion_strategy_map[key] = {}
        self.emotion_strategy_map[key][strategy] = outcome
```

关键设计决策：情绪→策略的映射应该是可学习的，不是硬编码的。Agent 应该在运行过程中积累"在什么情绪状态下用什么策略效果好"的经验。

## 四个功能的完整链路

把这四个功能串起来，就是情绪在 Agent 中的完整工作流：

```
Scenario State 变化
    ↓
Expectation Gap 计算
    ↓
[1. 价值反馈] 生成情绪信号
    ↓
[2. 状态调节] 调整认知参数（推理深度/风险偏好/温度/验证步骤）
    ↓
[3. 资源分配] 调整注意力权重和资源预算
    ↓
[4. 行为选择] 选择行为策略
    ↓
执行行为 → Scenario State 更新 → 循环
```

这条链路有两个关键特性：

1. **单向因果链**：情绪信号从场景中产生，逐级影响认知和行为。不存在"行为反过来直接改变情绪"的捷径——行为改变的是 Scenario State，Scenario State 的下一次变化才产生新的情绪信号
2. **可追溯**：每一步都有明确的数据来源。情绪信号可以追溯到具体的 Scenario 和 Expectation Gap，策略选择可以追溯到具体的情绪信号。这使得整个决策链路是可审计的

下一篇，我们转向 Agent 的另一个核心能力——如何感知人的情绪。不是文本分类，而是从用户的交互模式、行为序列和上下文线索中推断情绪状态。

## 参考资料

### 论文
1. Schultz, W. (2016). *Dopamine reward prediction-error coding: two-component model*. Nature Reviews Neuroscience, 17(3). — 多巴胺预测误差信号的两成分模型
2. Damasio, A. (1996). *The somatic marker hypothesis and the possible functions of the prefrontal cortex*. Philosophical Transactions of the Royal Society B, 351(1346). — 躯体标记假说的核心论文
3. Pessoa, L. (2008). *On the relationship between emotion and cognition*. Nature Reviews Neuroscience, 9(2). — 情绪与认知关系的综述
4. Dolan, R. J. (2002). *Emotion, cognition, and behavior*. Science, 298(5596). — 情绪如何影响认知和行为的实证研究
5. Bechara, A. & Damasio, A. (2005). *The somatic marker hypothesis: A neural theory of economic decision*. Games and Economic Behavior, 52(2). — 躯体标记在经济决策中的作用
6. Phelps, E. A. (2006). *Emotion and cognition: insights from studies of the human amygdala*. Annual Review of Psychology, 57. — 杏仁核在情绪认知中的作用
7. Aston-Jones, G. & Cohen, J. (2005). *An integrative theory of locus coeruleus-norepinephrine function*. Trends in Cognitive Sciences, 9(3). — 注意力调节的神经生物学基础
8. Sears, A. & Jacko, J. (2008). *The human-computer interaction handbook*. CRC Press. — HCI 中情绪状态对交互的影响
9. Picard, R. (1997). *Affective Computing*. MIT Press. — 情感计算奠基性工作
10. Gratch, J. & Marsella, S. (2004). *A domain-independent framework for modeling emotion*. Cognitive Systems Research, 5(4). — 情绪建模的领域无关框架
11. Marsella, S., Gratch, J. & Petta, P. (2010). *Computational models of emotion*. In K. Scherer (Ed.), *Blueprint for affective computing*. Oxford University Press. — 情绪计算模型综述
12. Friston, K. (2010). *The free-energy principle: a unified brain theory?* Nature Reviews Neuroscience, 11(2). — 自由能原理与预测编码
13. Clark, A. (2013). *Whatever next? Predictive brains, situated agents, and the future of cognitive science*. Behavioral and Brain Sciences, 36(3). — 预测大脑理论
14. Lerner, J. et al. (2015). *Emotion and decision making*. Annual Review of Psychology, 66. — 情绪对决策影响的综述
15. Gross, J. (2015). *Emotion regulation: Current status and future prospects*. Psychological Inquiry, 26(1). — 情绪调节理论
