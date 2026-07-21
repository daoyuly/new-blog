---
title: Agent如何感知人的情绪
tags:
  - 情绪
  - agent
  - 认知科学
  - 持续认知
categories:
  - Agent 与情绪
series:
  - Agent 与情绪
abbrlink: 53974
date: 2026-07-06 04:00:04
---

上一篇讲了情绪在 Agent 中的四个功能——价值反馈、状态调节、资源分配、行为选择。这些功能的前提是 Agent 能感知到情绪信号。但感知自己的情绪是一回事，感知人的情绪是另一回事。

当前大多数 Agent 的"情绪感知"做的事情是：拿一个 sentiment analysis 模型给用户消息打标——positive/negative/neutral。这跟没做差不多。它捕捉的是文本表面的情绪色彩，不是用户的真实情绪状态。

真正的情绪感知不是文本分类问题，而是状态推断问题。

## 文本情绪 ≠ 用户情绪

### 为什么 sentiment analysis 不够

用户说"这个功能真好用"，sentiment 分析会标为 positive。但这句话可能出现在以下场景中：

- 用户第一次使用，确实满意 → 真实情绪：满意
- 用户已经反馈了三次 bug，这是第四次尝试后说的 → 真实情绪：如释重负，但信任度已很低
- 用户在对比竞品后说的，带着"终于找到一个能用的了"的心态 → 真实情绪：谨慎乐观
- 用户是反讽 → 真实情绪：不满

同样的文本，不同场景下的情绪含义完全不同。脱离了 Scenario 去做情绪分类，信息损失巨大。

### What：情绪感知的三个层次

Agent 对人的情绪感知应该分三层：

**第一层：信号采集。** 从用户的交互行为中提取情绪相关的原始信号。不只是文本内容，还包括：

- **交互节奏**：回复速度、消息长度变化、标点使用习惯
- **行为模式**：连续提问 vs. 单次提问、反复修改 vs. 一次性完成
- **语言特征**：确定性词汇频率（"肯定"、"必须"）、情绪词密度、否定结构
- **上下文线索**：当前任务状态、历史交互中的情绪轨迹

**第二层：状态推断。** 基于采集到的信号，推断用户的内部状态。不是简单的"开心/生气"，而是多维状态：

- **满意度**：对当前交互进展的评价
- **信任度**：对 Agent 能力的信心
- **耐心水平**：还能容忍多少次失败
- **预期高度**：对结果的期望有多高

**第三层：场景关联。** 把推断出的情绪状态绑定到当前 Scenario 上。情绪不是全局的——用户可能对 Agent 的代码能力很满意，但对它的响应速度很不耐烦。这两个情绪状态属于不同的 Scenario，不能混为一谈。

### Why：为什么要分层

因为不同层次的信号有不同的可靠性和时间尺度。

文本内容是最容易获取的信号，也是最不可靠的——人会撒谎，会反讽，会客气。行为模式更难伪造——如果用户连续三次在同一类问题上纠正 Agent，不管文字上多客气，信任度实际上在下降。

分层处理让 Agent 可以在不同置信度下做不同的决策。文本信号可信度低 → 用于初步判断，不驱动关键策略。行为模式可信度高 → 可以驱动策略切换。场景关联确保情绪归因正确。

### So What

**对 Agent 设计的启示：** 设计一个三级情绪感知管线：

```python
class EmotionPerceptionPipeline:
    def perceive(self, user_input, scenario):
        # Level 1: 信号采集
        signals = self.collect_signals(user_input, scenario)
        # signals = {
        #   "text_sentiment": 0.3,  # 文本情感
        #   "response_speed": -0.5,  # 比平时快/慢
        #   "message_length_delta": -0.2,  # 消息变短
        #   "correction_count": 3,  # 本场景纠正次数
        #   "certainty_words": ["肯定", "必须"],  # 确定性词汇
        # }
        
        # Level 2: 状态推断
        user_state = self.infer_state(signals, scenario.history)
        # user_state = {
        #   "satisfaction": 0.4,
        #   "trust": 0.2,  # 低信任
        #   "patience": 0.3,  # 接近耗尽
        #   "expectation_height": 0.8,  # 预期很高
        # }
        
        # Level 3: 场景关联
        scenario.user_emotion_state = user_state
        return user_state
```

## 行为模式比文本更可靠

### 交互节奏中的情绪信号

用户的行为模式携带着大量情绪信息，而且比文本更难伪装。

几个高价值的行为信号：

**回复速度变化。** 用户突然加快回复 → 可能是急迫或兴奋。突然变慢 → 可能在思考、犹豫、或者失去兴趣。关键看的是变化方向，不是绝对速度——有些人天生打字快。

**消息长度趋势。** 用户的消息越来越短 → 耐心在下降。从详细描述变成"嗯"、"好"、"行" → 不再投入精力解释。这是 Agent 应该警惕的信号。

**修改和纠正频率。** 用户反复修改同一个请求 → Agent 理解有偏差，用户在尝试不同表述。每多一次纠正，信任度下降一档。

**提问模式变化。** 从开放式问题（"你觉得怎么设计好？"）变成封闭式问题（"你能做X吗？"）→ 用户从协作模式切换到指令模式，信任度下降。

### What

这些行为信号构成了一套"非文本情绪通道"。在人类交流中，这对应于肢体语言、语调、微表情——人可能嘴上说"没事"，但语气僵硬、双臂交叉，你就知道其实有事。

Agent 没有视觉和听觉通道，但交互行为就是它的"肢体语言"。

### Why

行为信号的可靠性来自于它是**非自主的**。用户可能控制自己说什么，但很难同时控制自己说话的速度、长度、修改频率。这些信号泄漏了用户的真实状态。

在心理学中，这叫做非言语线索（nonverbal cues）。Mehrabian 的经典研究表明，在情感传达中，语言内容只占 7%，语调占 38%，面部表情占 55%。虽然具体数字有争议，但核心结论被广泛接受：文字内容只是情绪信息的一小部分。

### So What

**对 Agent 设计的启示：**

1. **建立用户行为基线**。Agent 应为每个用户维护一个交互模式基线（平均回复速度、消息长度、修改频率）。情绪判断基于偏离基线的方向和幅度，而不是绝对值
2. **行为信号权重 > 文本信号权重**。当两者矛盾时（文字 positive 但行为模式显示不耐烦），以行为信号为准
3. **追踪趋势而非单次**。单次行为偏差可能是噪音，连续 3 次同方向偏差才是信号

```python
class BehaviorBaseline:
    def __init__(self):
        self.avg_response_time = None
        self.avg_message_length = None
        self.correction_rate = None
        self.samples = []
    
    def update(self, interaction):
        self.samples.append(interaction)
        if len(self.samples) > 50:
            self.samples.pop(0)
        self.recompute_baseline()
    
    def deviation(self, current_interaction):
        return {
            "response_time_dev": (current_interaction.response_time - self.avg_response_time) / self.avg_response_time,
            "length_dev": (current_interaction.message_length - self.avg_message_length) / self.avg_message_length,
            "correction_rate_dev": current_interaction.corrections - self.correction_rate
        }
```

## 情绪状态的时间维度

### What

用户情绪不是离散事件，而是连续的时间序列。Agent 需要追踪的不是"用户现在开心还是生气"，而是"用户的情绪状态如何从过去演化到现在，以及接下来会往哪走"。

三个时间尺度：

- **瞬时情绪**（秒级）：对单次交互的反应。Agent 回答正确 → 满意度短暂上升
- **会话情绪**（分钟到小时级）：整个交互会话的情绪趋势。从开始的期待 → 中间的起伏 → 最终的满意/失望
- **长期情绪**（天到周级）：跨会话的情绪积累。用户对 Agent 的整体信任度、使用习惯的变化

### Why

不同时间尺度的情绪有不同的用途。瞬时情绪驱动即时策略调整——用户不耐烦了，Agent 应该缩短回答。会话情绪驱动会话级决策——整个会话不太顺利，Agent 应该主动总结并建议休息。长期情绪驱动关系管理——用户信任度持续下降，Agent 应该调整交互模式或提示需要人工介入。

### So What

**对 Agent 设计的启示：**

```python
class EmotionTimeSeries:
    def __init__(self, user_id):
        self.instantaneous = []  # 最近 N 次交互的情绪
        self.session_trend = None  # 当前会话的情绪趋势
        self.long_term_trend = self.load_from_memory(user_id)  # 跨会话情绪轨迹
    
    def update(self, emotion_state):
        self.instantaneous.append(emotion_state)
        if len(self.instantaneous) > 20:
            self.instantaneous.pop(0)
        
        # 检测趋势
        if len(self.instantaneous) >= 5:
            trend = self.compute_trend(self.instantaneous[-5:])
            if trend.direction == "declining" and trend.slope < -0.1:
                # 连续下降趋势，触发预警
                self.alert_declining_emotion()
```

## 感知的边界：什么时候该放弃推断

### 一个容易被忽略的问题

情绪感知不是万能的。有些情况下，Agent 根本没有足够的信息来可靠地推断用户情绪。这时候，强行推断比承认无知更危险。

具体场景：

- **首次交互**：没有行为基线，无法判断"快"和"慢"
- **极短交互**：用户只说了一句话，信息量不够
- **跨文化场景**：情绪表达方式在不同文化中差异巨大
- **用户状态异常**：用户可能在疲劳、生病、或者本身情绪不稳定（与 Agent 无关）

### So What

**对 Agent 设计的启示：** 情绪感知系统必须输出置信度，低置信度时不驱动策略变更：

```python
def perceive_with_confidence(self, user_input, scenario):
    if len(scenario.history) < 3:
        return {"confidence": 0.1, "state": None, "action": "collect_more_data"}
    
    state = self.infer_state(user_input, scenario)
    confidence = self.compute_confidence(scenario)
    
    if confidence < 0.3:
        return {"confidence": confidence, "state": state, "action": "no_strategy_change"}
    
    return {"confidence": confidence, "state": state, "action": "apply_to_strategy"}
```

不要假装能感知到所有情绪。坦诚地说"我还不了解你的使用习惯"比基于一个不可靠的推断做出奇怪的行为好得多。

下一篇，我们讨论 Agent 如何理解人的目标——不是用户说了什么，而是用户真正想要什么。这是从情绪感知过渡到认知建模的关键一步。

## 参考资料

### 论文
1. Mehrabian, A. (1971). *Silent Messages*. Wadsworth. — 非言语交流的经典研究
2. Picard, R. (1997). *Affective Computing*. MIT Press. — 情感计算的开创性工作
3. Calvo, R. & D'Mello, S. (2010). *Affect detection: An interdisciplinary review of models, methods, and their applications*. IEEE Transactions on Affective Computing, 1(1). — 情绪检测方法综述
4. Scherer, K. (2005). *What are emotions? And how can they be measured?* Social Science Information, 44(4). — 情绪定义与测量方法
5. Russell, J. (1980). *A circumplex model of affect*. Journal of Personality and Social Psychology, 39(6). — 情绪环形模型
6. Poria, S. et al. (2017). *A review of affective computing: From unimodal analysis to multimodal fusion*. Information Fusion, 37. — 多模态情绪分析综述
7. Schuller, D. & Schuller, B. (2018). *The age of affective computing*. AI Communications, 31(2). — 情感计算发展综述
8. Hoque, M. et al. (2012). *Exploring temporal features in classifying frustrated and delighted smiles*. IEEE Transactions on Affective Computing, 3(3). — 情绪的时间特征分析
9. D'Mello, S. & Graesser, A. (2012). *Dynamics of affective states during complex learning*. Learning and Instruction, 22(2). — 学习过程中的情绪动态变化
10. Cowie, R. et al. (2001). *Emotion recognition in human-computer interaction*. IEEE Signal Processing Magazine, 18(1). — HCI 中的情绪识别

### 书籍
11. Scherer, K. & Ekman, P. (Eds.) (1984). *Approaches to Emotion*. Lawrence Erlbaum. — 情绪研究方法大全
12. Lewis, M., Haviland-Jones, J. & Barrett, L. (Eds.) (2008). *Handbook of Emotions* (3rd ed.). Guilford Press. — 情绪研究手册
13. Oatley, K., Keltner, D. & Jenkins, J. (2006). *Understanding Emotions* (2nd ed.). Blackwell. — 情绪心理学教材

### 综述
14. Calvo, R. et al. (2015). *Emotion recognition: A tutorial review*. In *Emotion and Anxiety*. Cambridge University Press. — 情绪识别教程综述
15. Zeng, Z. et al. (2009). *A survey of affective recognition methods: Audio, visual, and spontaneous expressions*. IEEE Transactions on Multimedia, 11(5). — 多模态情绪识别方法综述
