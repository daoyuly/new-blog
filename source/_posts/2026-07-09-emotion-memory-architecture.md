---
title: 情绪记忆：让Agent记住感受
tags:
  - 情绪
  - agent
  - 记忆
  - 躯体标记
categories:
  - Agent 与情绪
series:
  - Agent 与情绪
abbrlink: 15941
date: 2026-07-09 00:00:00
---

# 情绪记忆：让Agent记住感受

> 本篇属于「Agent与情绪」系列，第2部分「Agent情绪架构」第5篇。

---

为什么你记得十年前一次公开演讲时脑子空白、声音发抖的感觉，却完全想不起昨天午饭吃了什么？

答案不是"演讲比午饭重要"——如果重要性由理性判断决定，你应该记得每一份签过字的合同，但事实上你也不记得。真正的原因是：**情绪是记忆的权重系数**。大脑不是给所有经历分配相同的存储资源，而是用情绪唤醒度当杠杆，撬动记忆的编码深度和检索优先级。

前几篇我们已经聊过情绪与记忆的双向塑造机制——情绪增强编码、情绪一致性检索、记忆的重构性更新。那些是"发生了什么"。这篇要回答另一个问题：**知道了这些，Agent的记忆系统该怎么搭？**

具体来说，如果你要给一个Agent装上"情绪记忆"——让它不只是记住发生了什么，还能记住当时的"感受"，并且用这些感受指导未来的决策——架构上需要什么？

## 一、情绪标记记忆：给每条经历贴上感受标签

### What：躯体标记假说

Antonio Damasio 在1994年提出的躯体标记假说（Somatic Marker Hypothesis）是理解情绪记忆最直接的框架。核心思想一句话：**做决定的时候，你不是从零开始推理，而是先感受到过去类似场景的身体反应，用这个"感受信号"快速筛选选项。**

Damasio 的经典证据来自他研究的病人 Elliot。Elliot 因为脑部手术损伤了腹内侧前额叶皮层（vmPFC），智力正常、逻辑推理正常，但做决定极其困难——哪怕是约什么时间见面这种小事，他都能列举出所有利弊然后卡死在那里。他不是不会推理，而是失去了"感受推理结果"的能力。每个选项在逻辑上等价，因为他感受不到任何一个选项的"好"或"不好"。

用工程类比：Elliot 的系统里只有 CPU，没有缓存。每次做决策都要从头遍历所有可能，没有历史经验给出的捷径。

躯体标记的本质就是这种捷径——**过去经历的情绪体验被编码为"躯体标记"（somatic 指身体层面的），当下次遇到类似情境时，标记被重新激活，提供快速的倾向性信号**。你不是"想起来上次结果不好所以不做"，而是"想到那个选项时胃里一紧"——标记在推理之前就已经在筛选了。

### Why：标记的适应性价值

为什么不直接用理性推理？因为现实中的决策空间太大了。Bechara 等人 1997 年的爱荷华赌博实验证明：正常人在意识到哪副牌更好之前，身体就已经开始对坏牌产生皮肤电反应——躯体标记在意识觉察之前就启动了决策引导。进化需要的是一个快速过滤器，不是一个慢速全量搜索。

### So What：Agent记忆需要emotion_tag

对Agent来说，躯体标记的等价物是：**每条记忆必须携带情绪元数据**。不是存完之后在检索时临时判断"这条记忆正不正面"，而是在存储时就打上标记。

具体怎么做？给每条记忆记录加一个 `emotion_tag` 字段。这个字段不是简单的正/负二元标签，而是一个结构化的向量：

```python
emotion_tag = {
    "valence": 0.7,        # 效价：-1到1，负=不好，正=好
    "arousal": 0.85,       # 唤醒度：0到1，越高越强烈
    "dominance": 0.3,      # 控制感：0到1，越高越觉得可控
    "primary_emotion": "frustration",  # 主情绪类别
    "timestamp": 1720502400,           # 体验时间
    "trigger": "task_failure",         # 触发原因
}
```

为什么需要这些维度而不只是正/负？因为同样是负面体验，"沮丧"（低唤醒、低控制感）和"愤怒"（高唤醒、高控制感）在后续决策中的指引方向完全不同——沮丧让你回避，愤怒让你对抗。只有正/负标签的Agent会犯低级错误：把"被用户骂了之后愤怒地改进了服务"和"被用户骂了之后沮丧地放弃了任务"当成同一种记忆来用。

**对Agent设计的启示**：不要用简单的 sentiment score 做情绪标记。效价、唤醒度、控制感三维向量是最低配置。条件允许的话加上主情绪类别和触发原因，后续检索和决策才有足够的分辨率。

## 二、情绪驱动的检索偏好：当前心情筛选记忆

### What：情绪一致性效应

上一篇我们建立了情绪一致性记忆的基本图景：你当前的情绪状态会偏向性地检索跟当前情绪一致的记忆。Bower 1981 年的网络理论给出了最早的解释框架，后续大量实验持续验证这个效应——高兴时更容易想起好事，沮丧时坏事排着队来。

但这里有一个更微妙的现象值得深挖：**情绪一致性检索不只是"更容易想到同类的记忆"，它还改变了记忆的解读方式。** Mister 凹镜效应（mood-congruent memory 的极端形式）：同样一段模糊的经历，心情好的时候你记成"那次虽然出错了但我学到了东西"，心情差的时候你记成"那次就是个灾难"——原始记忆没变，但检索时的情绪滤镜给记忆上了一层色调。

### Why：效率与风险的权衡

从信息处理角度看，情绪一致性检索是一种**启发式策略**：当前情绪状态提供了上下文，用上下文缩小检索空间。在大多数情况下这是高效的——如果你正在处理一个错误，检索之前类似的错误比检索成功案例更相关。

但这是一把双刃剑。当情绪强度过高时，这种偏好变成了采样偏差——你只能看到跟当前情绪一致的证据，形成确认偏误的闭环。抑郁患者的负性记忆优势不是因为他们"真的有更多负面经历"，而是因为抑郁状态让正面记忆变得不可检索。抑郁的持续不是因为现实持续糟糕，而是因为记忆检索被情绪劫持了。

### So What：检索时用当前情绪向量加权

Agent检索记忆时，应该把当前情绪状态作为检索条件的一部分——但不是无脑偏好，而是有策略地加权。

具体设计：**双通道检索机制**。

```python
def retrieve_memories(query, current_emotion, alpha=0.6):
    # 通道1：情绪一致性检索（自然偏好）
    consistent_memories = search(
        query, 
        filter=lambda m: emotion_similarity(m.emotion_tag, current_emotion) > 0.5
    )
    
    # 通道2：去偏检索（强制注入不一致记忆）
    inconsistent_memories = search(
        query,
        filter=lambda m: emotion_similarity(m.emotion_tag, current_emotion) < -0.3
    )
    
    # 混合：alpha控制情绪偏好强度
    return merge(
        consistent_memories,   # 权重 alpha
        inconsistent_memories, # 权重 1-alpha
    )
```

`alpha` 的值不是固定的。当当前情绪唤醒度低时（平静状态），alpha 可以高一些——自然的偏好没什么问题。当唤醒度高时（焦虑、愤怒），alpha 应该降低——这正是系统最容易被偏差绑架的时候，需要强制引入反面证据。

这跟认知行为疗法（CBT）的核心思路一样：不是否认你现在的感受，而是确保你同时能看到跟感受不一致的证据。

**对Agent设计的启示**：情绪强烈时反而要降低情绪一致性检索的权重。这不是悖论，这是防bug——就像数据库在高负载时启用降级策略，Agent在情绪高唤醒时应该启用去偏检索。

## 三、长期情绪轨迹：时间序列比单点更有价值

### What：情绪不是快照，是轨迹

前面两个概念处理的都是"单次记忆的情绪标记"和"当前情绪如何影响检索"。但还有一种更重要的情绪记忆形式：**情绪的时间序列**。

想想你怎么判断一段关系好不好。不是看某一次约会的感受，而是看整个时间线的走势——是在上升还是下降？波动是在收窄还是放大？最近三个月的趋势和之前三年比怎么样？

心理学把这叫**情绪惯性**（emotional inertia）：情绪状态在时间上的自相关程度。Kuppens 等人 2010 年的研究发现，情绪惯性高的人（情绪难以被事件改变）和情绪惯性极低的人（情绪剧烈波动），心理健康水平都比中等惯性的人差。不是"越稳定越好"，也不是"越灵活越好"，而是"在适当的时候能变、该稳的时候稳得住"才健康。

还有**情绪分化**（emotional differentiation / emotional granularity）：一个人在负面体验中能区分多少种不同的负面情绪。Kashdan 等人 2015 年发现，情绪分化低的人（所有不好都是"糟透了"）更容易抑郁，情绪分化高的人（能区分沮丧、失望、焦虑、愤怒）心理韧性更强。能精细地区分情绪，意味着你拥有更精确的应对策略库。

### Why：轨迹信息比快照信息更适合指导长期行为

从进化角度看，单次情绪体验的价值有限——一次恐惧可能只是虚惊，一次快乐可能只是偶然。但情绪轨迹编码了环境的统计规律："最近经常焦虑"意味着环境可能真的有问题，不只是我反应过度。"总体趋势向好但偶尔有波动"意味着策略有效，应该坚持。

### So What：Agent需要维护情绪时间序列

不要只存离散的情绪标签。Agent应该维护一条**情绪轨迹**——一个随时间更新的情绪状态序列，从中提取趋势和模式。

```python
class EmotionTrajectory:
    def __init__(self, window_size=100):
        self.history = []  # [(timestamp, emotion_vector), ...]
        self.window_size = window_size
    
    def update(self, emotion_vector, timestamp):
        self.history.append((timestamp, emotion_vector))
        if len(self.history) > self.window_size:
            self.history.pop(0)
    
    def get_trend(self):
        """返回最近窗口内情绪的线性趋势"""
        # 效价的线性回归斜率
        valences = [e.valence for _, e in self.history]
        return linear_regression_slope(valences)
    
    def get_inertia(self):
        """情绪惯性：相邻时间点情绪的自相关"""
        return autocorrelation(self.history)
    
    def get_granularity(self):
        """情绪分化度：负面情绪体验中的类别多样性"""
        neg_emotions = [e.primary_emotion 
                       for _, e in self.history 
                       if e.valence < 0]
        return entropy(neg_emotions)
```

这三个指标各自指导不同的Agent行为：

- **趋势为负**（持续下滑）→ 触发策略审查，不是简单的"再试一次"而是"方法可能有问题"
- **惯性过高**（情绪长时间不变）→ 系统陷入僵局，需要引入新信息或换策略
- **分化度低**（所有负面都是同一种）→ Agent的情绪评估太粗糙，需要增加情绪类别的分辨率

**对Agent设计的启示**：情绪记忆不只是"记住当时的感受"，更是"记住感受是怎么变化的"。趋势、惯性、分化度三个指标可以从情绪时间序列中自动提取，分别对应策略审查、僵局检测、评估精度诊断三种Agent行为调整。

## 四、Agent情绪记忆架构：从标记到决策的完整链路

把上面三个概念串起来，一个完整的Agent情绪记忆架构长这样：

```
  事件输入
     │
     ▼
┌─────────────┐
│  情绪评估器   │ ← 类杏仁核：对事件做情绪评估，输出emotion_tag
└──────┬──────┘
       │ emotion_tag
       ▼
┌─────────────┐
│  情绪记忆存储  │ ← 类海马体：存储事件+emotion_tag+上下文
└──────┬──────┘
       │
       ├──→ 情绪轨迹更新器 → 维护时间序列 → 趋势/惯性/分化度
       │
       ▼
┌─────────────┐    ┌─────────────────┐
│  情绪记忆检索  │ ←──│ 当前情绪状态      │
└──────┬──────┘    │ (作为检索加权条件) │
       │           └─────────────────┘
       ▼
┌─────────────┐
│  躯体标记决策  │ ← 检索结果产生"感受信号"，作为决策的快速过滤器
└──────┬──────┘
       │ 决策结果 → 新事件
       ▼
  回到开头，形成闭环
```

五个环节，逐一说明：

**1. 情绪评估器**：对每个进入系统的事件做情绪评估。不是所有事件都需要情绪标记——判断"今天天气晴"不需要强烈情绪，但"任务连续第三次失败"需要。评估触发条件可以用唤醒度阈值：只有超过阈值的事件才进入情绪记忆系统，低唤醒事件存入普通记忆。这跟大脑的做法一致——不是所有经历都走杏仁核通道。

**2. 情绪记忆存储**：存储的不是裸事件，而是事件+emotion_tag+上下文的绑定体。关键设计：存储时同时建立**情绪索引**——不只是按内容检索，还能按情绪特征检索（"找所有高唤醒负面记忆"）。这需要存储层支持多维索引，不是简单的向量数据库cosine similarity就能搞定的。

**3. 情绪轨迹更新器**：每次有新的情绪标记产生，更新情绪时间序列，重新计算趋势、惯性、分化度。这不是每次都全量重算——可以用滑动窗口+增量更新。轨迹指标的变化率本身就是重要信号：趋势突然变陡，意味着环境或策略发生了突变。

**4. 情绪记忆检索**：前面说的双通道检索——情绪一致性通道+去偏通道，alpha由当前情绪唤醒度动态调节。额外一点：检索时应该同时考虑**情绪标记的相似度**和**内容的相似度**。两个维度的权重也可以动态调整——在探索阶段偏重内容相似度（找"类似的任务怎么做的"），在决策阶段偏重情绪相似度（找"类似感受下做了什么选择"）。

**5. 躯体标记决策**：检索到的记忆不是直接喂给推理模块，而是先经过一层"标记提取"——从检索结果中提取情绪倾向信号（"之前类似情境下，选择A带来了正面标记，选择B带来了负面标记"），这个倾向信号作为决策的先验。注意：是先验，不是决定。推理模块可以推翻躯体标记的建议，但需要额外消耗认知资源——这跟Damasio的发现一致：你能理性地做出跟直觉相反的决定，但那更慢、更费力。

还有一个跨环节的机制：**reconsolidation**（前几篇详细聊过）。每次记忆被检索使用后，其emotion_tag不是不变的——如果检索时的上下文提供了新的解读（"那次失败后来证明是转折点"），标记应该被更新。这在架构上体现为：检索→使用→写回的循环，记忆不是只读的。

## 五、对Agent设计的启示（总结）

**1. 给每条记忆加 `emotion_tag` 字段**——效价、唤醒度、控制感三维向量是最低配置，加上主情绪类别和触发原因。存储时打标，不要检索时临时推断。这是整个架构的基座，没有这个，后面一切都无从谈起。

**2. 检索时用当前情绪向量加权，但情绪越强烈权重越要降**——双通道检索（一致性+去偏），alpha由当前唤醒度反向调节。平静时偏向一致性检索（高效），激动时强制注入反面证据（防偏）。这不是"理性压倒感性"，是"系统在高压下启用安全模式"。

**3. 维护情绪时间序列，提取趋势、惯性、分化度**——不要只看当下的情绪状态，要看情绪的变化模式。趋势指导策略审查，惯性检测僵局，分化度诊断评估精度。三个指标，三种不同的系统行为调整。

**4. 分离评估、存储、检索、决策四个模块**——情绪评估器、情绪记忆存储、情绪记忆检索、躯体标记决策各司其职。别揉在一个"记忆组件"里。就像大脑的杏仁核不存记忆、海马体不做评估一样，模块化的好处是你可以单独调试和改进每个环节。

**5. 记忆检索后更新 emotion_tag**——reconsolidation 的工程实现。每次记忆被使用后，如果当前上下文提供了新的解读，写回更新后的标记。让记忆随着经验积累而"成熟"，而不是永远停留在当初的情绪里。

---

情绪记忆不是给Agent加个sentiment analysis的装饰件，是给整个认知架构加一层权重系统。没有情绪记忆的Agent，每条经历都是等价的——它无法区分"重要"和"发生过"，无法从感受中学习，也无法在复杂决策中利用历史的倾向信号。

有了情绪记忆，Agent才有可能做到一件真正像人的事：**不仅记住发生了什么，还记住那是什么感觉，并且让这种感觉指引下一次选择。**

下一篇我们聊情绪的社会性——当多个Agent互动时，情绪如何在群体中传播和协调。

---

## 参考资料

### 论文

- Damasio, A.R. (1996). The somatic marker hypothesis and the possible functions of the prefrontal cortex. *Philosophical Transactions of the Royal Society B*, 351(1346). — 躯体标记假说的原始论文，提出情绪标记引导决策的核心论点
- Bechara, A. et al. (1997). Deciding advantageously before knowing the advantageous strategy. *Science*, 275(5304). — 爱荷华赌博实验，证明躯体标记在意识觉察之前就启动决策引导
- Bower, G.H. (1981). Mood and memory. *American Psychologist*, 36(2). — 情绪一致性记忆的网络理论，情绪状态影响记忆检索方向
- Kuppens, P. et al. (2010). Emotional inertia: Psychological adaptation to emotional experience. *Personality and Social Psychology Bulletin*, 36(7). — 情绪惯性的概念与测量，惯性过高或过低都与心理问题相关
- Kashdan, F.B., Barrett, L.F. & McKnight, P.E. (2015). Unpacking emotion differentiation: Transforming unpleasant experience by perceiving distinctions in negativity. *Current Directions in Psychological Science*, 24(1). — 情绪分化度的研究，精细区分情绪的能力与心理韧性正相关
- Matt, G.E., Vázquez, C. & Campbell, W.K. (1992). Mood-congruent recall of affectively toned stimuli: A meta-analytic review. *Clinical Psychology Review*, 12(2). — 情绪一致性回忆的元分析，量化效应大小
- Schiller, D. et al. (2010). Preventing the return of fear in humans using reconsolidation update mechanisms. *Nature*, 463. — reconsolidation窗口内干预可以改写恐惧记忆
- Bechara, A. & Damasio, A.R. (2005). The somatic marker hypothesis: A neural theory of economic decision. *Games and Economic Behavior*, 52(2). — 躯体标记假说在决策中的神经经济学证据
- Yerkes, R.M. & Dodson, J.D. (1908). The relation of strength of stimulus to rapidity of habit-formation. *Journal of Comparative Neurology and Psychology*, 18(5). — Yerkes-Dodson定律，唤醒度与表现呈倒U型关系
- Phelps, E.A. & LeDoux, J.E. (2005). Contributions of the amygdala to emotion processing: From animal models to human behavior. *Neuron*, 48(2). — 杏仁核在情绪处理中的跨物种证据
- Rust, G. & Bower, G.H. (1995). Mood and memory: The happy—unhappy distinction in automatic and controlled processing. *Journal of Experimental Social Psychology*, 31(1). — 自动vs控制加工中情绪一致性效应的差异

### 书籍

- Damasio, A. (1994). *Descartes' Error: Emotion, Reason, and the Human Brain*. Putnam. — 躯体标记假说的完整阐述，Elliot病例的详细分析，理解情绪决策的必读
- Damasio, A. (2010). *Self Comes to Mind: Constructing the Conscious Brain*. Pantheon. — 自我意识、记忆与情绪的整合理论
- Barrett, L.F. (2017). *How Emotions Are Made: The Secret Life of the Brain*. Houghton Mifflin Harcourt. — 构建情绪理论，情绪是大脑构建的概念而非固定模式
- McGaugh, J.L. (2003). *Memory and Emotion*. Columbia University Press. — 情绪与记忆关系的系统论述，从分子到行为
- LeDoux, J. (1996). *The Emotional Brain*. Simon & Schuster. — 恐惧回路的神经机制，杏仁核功能的经典论述

### 综述

- LaBar, K.S. & Cabeza, R. (2006). Cognitive neuroscience of emotional memory. *Nature Reviews Neuroscience*, 7(1). — 情绪记忆的神经机制综述，杏仁核-海马体交互的权威梳理
- Dolan, R.J. (2002). Emotion, cognition, and behavior. *Science*, 298(5596). — 情绪对认知和行为影响的整合综述
- Phelps, E.A. (2004). Human emotion and memory: Interactions of the amygdala and hippocampal complex. *Current Opinion in Neurobiology*, 14(2). — 杏仁核-海马体在情绪记忆中交互作用的综述
