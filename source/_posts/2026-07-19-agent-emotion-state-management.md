---
title: Agent情绪与状态管理
tags:
  - 情绪
  - agent
  - 认知科学
  - 持续认知
categories:
  - Agent 与情绪
series:
  - Agent 与情绪
abbrlink: 46380
date: 2026-07-19 06:00:04
---

上一篇设计了 Agent 情绪的数据结构——Scenario State、Expectation State、Emotion State、Persona State 四个实体相互索引。数据结构是静态的，真正让它活起来的是状态管理：状态怎么更新、怎么传播、怎么衰减、怎么恢复。

这四个操作构成了 Agent 状态管理的完整生命周期。做对了，Agent 就像一个有连贯记忆和稳定性格的伙伴；做错了，要么变成金鱼记忆（每次对话从零开始），要么变成情绪僵尸（情绪状态永远不变）。

## 状态更新：不是赋值，是演化

### 问题

最直觉的做法是：每次 Scenario 状态变化时，直接用新值覆盖旧值。`emotion_state.satisfaction = 0.4` → 用户表扬了 → `emotion_state.satisfaction = 0.8`。

这不对。情绪不是跳变的，它是滑动的。用户表扬了一次，满意度不会从 0.4 瞬间跳到 0.8——它应该是从 0.4 滑向 0.8 的过程中某个点，滑动的速度取决于这次表扬的力度和当前状态的惯性。

### What：指数移动平均更新

正确的更新方式是指数移动平均（EMA）：

```python
def update_emotion_state(current_state, new_signal, alpha=0.3):
    """
    alpha 越大，新信号权重越高，状态变化越快
    alpha 越小，历史状态惯性越大，变化越慢
    """
    for key in current_state:
        current_state[key] = (1 - alpha) * current_state[key] + alpha * new_signal[key]
    return current_state
```

alpha 是关键参数。不同维度应该有不同的 alpha：

- **满意度**：alpha 较高（0.4）——最近一次体验权重大
- **信任度**：alpha 较低（0.15）——需要长期积累，单次互动影响小
- **耐心**：alpha 中等（0.25）——既有惯性也会被快速消耗

### Why

人类情绪的更新就是 EMA 式的。你不会因为一次好体验就完全信任一个人，也不会因为一次失误就彻底否定。信任是缓慢建立的，但可以被快速破坏——这意味着正向更新和负向更新的 alpha 应该不对称：

```python
def asymmetric_update(current, new_signal, pos_alpha=0.15, neg_alpha=0.35):
    alpha = pos_alpha if new_signal > current else neg_alpha
    return (1 - alpha) * current + alpha * new_signal
```

正向变化用小 alpha（缓慢上升），负向变化用大 alpha（快速下降）。这不是悲观，这是对人类信任心理的忠实建模。

### So What

**对 Agent 设计的启示：**

1. 状态更新用 EMA，不用直接赋值
2. 不同维度用不同 alpha，反映该维度的惯性特征
3. 正负向更新用不对称 alpha——信任建立慢、破坏快

## 状态传播：情绪在场景间扩散

### What

一个 Scenario 产生的情绪信号不应该只影响当前场景。它应该向相关的其他场景传播。

用户在"代码重构"场景中经历了连续失败 → 信任度下降 → 这个信任度下降不应该只停留在代码重构场景。它应该传播到"代码审查"场景（因为都是代码相关），但不应该传播到"日程管理"场景（因为领域不相关）。

传播规则：

1. **同类型场景**：高传播权重。代码任务失败 → 其他代码任务的信任度也受影响
2. **关联场景**：中传播权重。通过 Scenario Graph 的边传播，权重随跳数衰减
3. **无关场景**：零传播权重。不同领域的场景互不影响

### Why

人类的情绪就是这样跨场景传播的。你在工作中被批评了，回到家对家人的态度也会变差——但不会同等程度地变差，因为"工作"和"家庭"是不同的场景域。传播强度取决于场景之间的关联度。

在 Agent 架构中，Scenario Graph 提供了场景关联的拓扑结构。情绪传播就是在这个图上做信息扩散。

### So What

**对 Agent 设计的启示：** 实现 Scenario Graph 上的情绪传播算法：

```python
def propagate_emotion(scenario_graph, source_scenario_id, emotion_signal):
    """
    从源场景向关联场景传播情绪信号
    传播权重随图距离衰减
    """
    visited = {source_scenario_id}
    frontier = [(source_scenario_id, 1.0)]  # (scenario_id, weight)
    
    while frontier:
        current_id, weight = frontier.pop(0)
        current = scenario_graph.get(current_id)
        
        # 更新当前场景的情绪状态
        current.emotion_state.apply_signal(emotion_signal, weight=weight * 0.5)
        
        # 向邻居传播
        for neighbor_id, edge_weight in scenario_graph.neighbors(current_id):
            if neighbor_id not in visited:
                visited.add(neighbor_id)
                new_weight = weight * edge_weight * 0.7  # 衰减因子
                if new_weight > 0.05:  # 低于阈值停止传播
                    frontier.append((neighbor_id, new_weight))
```

关键设计决策：

- 传播权重随距离衰减（0.7 因子），防止情绪信号无限扩散
- 低于阈值（0.05）时停止传播，避免微弱信号的计算开销
- 传播是异步的——先更新当前场景，再批量向邻居传播

## 状态衰减：让情绪回归基线

### What

情绪信号如果没有新的输入，应该随时间衰减回基线。不能让 Agent 永远记住三个月前的一次不愉快交互——那不是持续认知，那是记仇。

衰减的数学形式很简单：

```python
def decay_emotion_state(state, elapsed_time, half_life_hours=24):
    """
    情绪状态随时间衰减
    half_life: 半衰期，默认 24 小时
    """
    decay_factor = 0.5 ** (elapsed_time / half_life_hours)
    for key in state:
        # 向基线衰减，不是向零衰减
        state[key] = state[key] * decay_factor + state.baseline[key] * (1 - decay_factor)
    return state
```

### Why

人类情绪有自然的衰减机制。PTSD（创伤后应激障碍）就是衰减机制失灵的结果——强烈负面情绪信号无法衰减，持续影响认知和行为。

不同维度的衰减速度应该不同：

- **满意度**：快衰减（半衰期 6 小时）——今天的满意不代表明天还满意
- **信任度**：慢衰减（半衰期 7 天）——信任是长期状态，不会一夜消失
- **预期高度**：中衰减（半衰期 24 小时）——预期会随着新信息调整

### So What

**对 Agent 设计的启示：**

1. 每个情绪维度有自己的半衰期，反映该状态的持久性
2. 衰减是向基线回归，不是向零回归——基线是用户的长期情绪画像
3. 衰减应该在后台定期执行，不是每次访问时计算（性能考虑）

```python
class EmotionDecayScheduler:
    def __init__(self):
        self.last_decay_time = {}
    
    def maybe_decay(self, scenario_id, current_time):
        last = self.last_decay_time.get(scenario_id, current_time)
        elapsed = current_time - last
        
        if elapsed > 3600:  # 至少 1 小时才执行一次衰减
            scenario = self.get_scenario(scenario_id)
            scenario.emotion_state = self.decay(scenario.emotion_state, elapsed)
            self.last_decay_time[scenario_id] = current_time
```

## 状态恢复：从负面情绪中回弹

### What

状态衰减是被动的——时间流逝，情绪自然回归基线。但有些情况下，Agent 需要主动恢复情绪状态。

比如：用户连续三次纠正 Agent 的回答，信任度降到 0.2。如果只靠自然衰减，可能需要几天才能恢复到可用水平。但 Agent 可以采取主动恢复策略——承认错误、给出高质量回答、或者主动降低预期。

### Why

人类有主动的情绪调节机制。Gross 的情绪调节理论定义了五种策略：情境选择、情境修改、注意分配、认知重评、表达抑制。其中认知重评（cognitive reappraisal）是最有效的——改变对事件的理解方式来调节情绪反应。

Agent 的主动恢复策略对应的是行为层面的调节——通过改变行为来改变用户对 Agent 的评价，从而恢复情绪状态。

### So What

**对 Agent 设计的启示：** 定义一组恢复策略，根据当前情绪状态自动触发：

```python
class EmotionRecovery:
    def check_and_recover(self, scenario):
        state = scenario.emotion_state
        
        # 信任度过低 → 主动恢复
        if state.trust < 0.3:
            return self.low_trust_recovery(scenario)
        
        # 耐心耗尽 → 快速恢复
        if state.patience < 0.2:
            return self.low_patience_recovery(scenario)
        
        # 满意度骤降 → 紧急恢复
        if state.satisfaction < 0.3 and state.satisfaction_trend == "declining":
            return self.critical_satisfaction_recovery(scenario)
        
        return None  # 不需要恢复
    
    def low_trust_recovery(self, scenario):
        """信任度恢复策略"""
        return {
            "action": "acknowledge_limitation",
            "message": "这个问题我之前没处理好，让我换个思路试试",
            "strategy": "conservative",  # 用保守策略，不冒险
            "follow_up": True  # 主动跟进结果
        }
    
    def low_patience_recovery(self, scenario):
        """耐心恢复策略"""
        return {
            "action": "shorten_response",
            "max_length": 100,  # 限制回答长度
            "strategy": "direct_answer",  # 不解释，直接给答案
            "skip_verification": True  # 跳过确认步骤
        }
```

关键原则：恢复策略是功能性的，不是道歉话术。Agent 不是说"对不起让你不开心了"——那是客服话术。Agent 做的是调整行为模式来重建信任。

## 四个操作的完整生命周期

```
[事件发生]
    ↓
[状态更新] EMA 更新当前 Scenario 的情绪状态
    ↓
[状态传播] 通过 Scenario Graph 向关联场景扩散
    ↓
[状态衰减] 后台定时任务，所有场景向基线回归
    ↓
[状态恢复] 检测低值状态，触发主动恢复策略
    ↓
[场景状态变化] → 回到 [状态更新]
```

这四个操作确保了 Agent 的情绪系统既有即时反应能力（更新），又有跨场景影响（传播），还有遗忘能力（衰减），以及修复能力（恢复）。缺任何一个，系统都是残缺的。

下一篇，我们讨论情绪如何作为持续认知的价值反馈信号——不是 Agent 的状态管理，而是 Agent 如何用情绪信号驱动自身的认知进化。

## 参考资料

### 论文
1. Gross, J. (1998). *The emerging field of emotion regulation: An integrative review*. Review of General Psychology, 2(3). — 情绪调节理论的奠基性综述
2. Gross, J. (2015). *Emotion regulation: Current status and future prospects*. Psychological Inquiry, 26(1). — 情绪调节理论的最新进展
3. Ochsner, K. & Gross, J. (2005). *The cognitive control of emotion*. Trends in Cognitive Sciences, 9(5). — 认知控制情绪的神经机制
4. Koole, S. (2009). *The psychology of emotion regulation: An integrative review*. Cognition and Emotion, 23(1). — 情绪调节心理学综述
5. Sheppes, G. et al. (2011). *Emotion regulation choice: A conceptual framework and supporting evidence*. Journal of Experimental Psychology, 147(1). — 情绪调节策略选择
6. Thiruchselvam, R. et al. (2011). *The temporal dynamics of emotion regulation: An EEG study of distraction and reappraisal*. Biological Psychology, 87(1). — 情绪调节的时间动态
7. Brazdil, M. et al. (2009). *Emotion regulation in humans: A neural systems perspective*. Neuroscience. — 情绪调节的神经系统视角
8. Etkin, A. et al. (2015). *The neural bases of emotion regulation*. Nature Reviews Neuroscience, 16(11). — 情绪调节的神经基础综述
9. Webb, T. et al. (2012). *Dealing with feeling: A meta-analysis of the effectiveness of strategies derived from the process model of emotion regulation*. Psychological Bulletin, 138(4). — 情绪调节策略效果元分析
10. Aldao, A. et al. (2010). *Emotion-regulation strategies across psychopathology: A meta-analytic review*. Clinical Psychology Review, 30(2). — 情绪调节策略与心理健康
11. McRae, K. & Gross, J. (2020). *Emotion regulation*. Emotion, 20(1). — 情绪调节的最新理论框架
12. David, D. et al. (2010). *Cognitive emotion regulation: From basic research to clinical practice*. Journal of Cognitive Psychotherapy, 24(2). — 认知情绪调节的临床应用
13. Bonanno, G. & Burton, C. (2013). *Regulatory flexibility: An individual differences perspective on coping and emotion regulation*. Psychological Bulletin, 139(5). — 情绪调节的个体差异
14. Troy, A. et al. (2010). *Seeing the silver lining: Cognitive reappraisal ability moderates the relationship between stress and depressive symptoms*. Emotion, 10(6). — 认知重评的保护作用
15. Ford, B. & Gross, J. (2019). *Why beliefs about emotion matter: An emotion-regulation perspective*. Current Directions in Psychological Science, 28(1). — 情绪信念与调节的关系

### 书籍
1. Gross, J. (Ed.) (2014). *Handbook of Emotion Regulation* (2nd ed.). Guilford Press. — 情绪调节研究最权威的合集
