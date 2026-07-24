---
title: 情绪与信念的认知闭环
tags:
  - 情绪
  - agent
  - 认知科学
  - 信念系统
categories:
  - Agent 与情绪
series:
  - Agent 与情绪
abbrlink: 30433
date: 2026-06-30 04:00:05
description: "2017年，一群美国人在YouTube上看了一段视频，声称地球是平的。这不是开玩笑——他们真的信了。更奇怪的是，当NASA发布从国际空间站拍摄的地球照片时，这些人的反应不是\"哦，我错了\"，而是\"这图是PS的\"。证据越充分，他们越坚信自..."
keywords: "情绪与信念的认知闭环, 情绪, agent, 认知科学, 信念系统, Agent 与情绪"
---

2017年，一群美国人在YouTube上看了一段视频，声称地球是平的。这不是开玩笑——他们真的信了。更奇怪的是，当NASA发布从国际空间站拍摄的地球照片时，这些人的反应不是"哦，我错了"，而是"这图是PS的"。证据越充分，他们越坚信自己的信念。

这种事不只见于阴谋论者。你劝一个老烟民戒烟，给他看肺癌数据，他给你讲隔壁大爷抽烟活到九十。你跟一个亏损的股民说该止损了，他说"你不懂，这叫价值投资"。甚至在工程师群里，你拿benchmark数据证明某框架更慢，对方回你"那是你没调好"——然后继续用。

为什么证据不管用？为什么改变一个人的想法这么难？

答案不在逻辑里，在情绪里。信念从来不是纯粹的信息存储——它被情绪层层包裹，形成了一个自我强化的闭环。要理解Agent如何处理信念更新，我们得先搞清楚这个闭环是怎么形成的，以及——偶尔——是怎么被打断的。

## 1. 信念是什么

### What：信念 ≠ 知识

先说一个容易混淆的事：信念和知识不是一回事。

知识是你能验证的："水的沸点是100°C"——你可以烧一壶水去测。信念是你**选择**当作真的东西，即使你没法完全验证。绝大多数人相信"努力会有回报"，但你没法做双盲实验证明它——你只是选择这么认为。

更关键的区别在于：**知识是内容，信念是框架**。信念更像操作系统，知识更像跑在上面的应用。你换一个App很容易，换操作系统？那得重装整个系统。这就是为什么推翻一个人的某个具体事实相对容易，但动摇他的核心信念几乎不可能——你不是在改一个文件，你是在让他重装系统。

哲学家区分了三种认知状态：**知道**（justified true belief）、**相信**（belief without full justification）、**默认假设**（taken-for-granted background）。日常对话里我们不怎么区分，但大脑其实分得很清。你对"1+1=2"的反应和对"人性本善"的反应完全不同——前者被挑战时你冷静证明，后者被挑战时你感到被冒犯。这个温度差，就是信念和知识的分界线。

### Why：为什么进化出信念系统

纯粹的知识系统有个致命问题：**计算成本太高**。如果每一件事你都要从第一性原理推导，你连早饭吃什么都要算半天。信念是大脑的"缓存机制"——把高频使用的结论预先存储，下次直接调取，跳过计算。

从进化角度看，信念系统解决了三个生存问题：

**第一，加速决策。** 草丛在动，是风还是老虎？如果你每次都要收集证据再做判断，你已经死了。信念让你预设"草丛动 = 危险"，先跑再说。宁可虚惊一场，不可漏判一次。

**第二，维持行动一致性。** 一个猎人今天相信"往东走有猎物"，明天突然觉得"其实往西更好"，他就永远打不到猎物。信念让你在证据不完全的情况下仍然坚持行动，这种坚持本身就有生存价值。

**第三，群体协调。** 共同的信念是群体合作的基础。一个部落相信"祖先保佑我们"，这不一定要为真，但这个共享信念让部落成员愿意为彼此冒险。社会学家Durkheim把这叫"集体表象"——共享信念的真相不重要，它产生的社会纽带很重要。

所以信念的本质不是"尚未验证的知识"，而是一种**低计算成本、高行动驱动、强社会绑定**的认知策略。它之所以顽固，不是因为有bug，而是因为"顽固"本身就是它的功能。

### So What：对Agent设计的意味

当前主流Agent架构把"信念"当成了"带置信度的事实"来处理——一个知识图谱节点加一个0-1的分数。这远远不够。

信念和知识的核心差异在于**对否证的态度**。Agent应该在架构层面区分两类存储：

- **知识层**（Knowledge Layer）：可被新证据直接更新的事实，更新规则是贝叶斯推断
- **信念层**（Belief Layer）：具有框架性质的预设，更新需要跨节点一致性检查，不能单点推翻

具体做法：给每个内部陈述标注一个`belief_type`字段（`factual`/`framework`/`default`）。当新信息与`factual`类型冲突时，直接用贝叶斯更新；当与`framework`类型冲突时，触发一个"信念一致性审查"流程——检查推翻这个信念会导致多少其他陈述需要连锁更新，如果连锁范围超过阈值，就不直接更新，而是把冲突标记为"待解决"并降低整体置信度。这模拟了人类对核心信念的保守倾向，同时避免了Agent因单个不可靠输入而动摇整个认知框架。

## 2. 情绪是信念的守门人

### What：确认偏误的情绪根源

确认偏误（Confirmation Bias）是认知科学里被研究得最多的偏差之一：人们倾向于寻找、解读和记住支持自己已有信念的信息，忽视或贬低反对信息。这听起来像是个理性的偷懒策略，但神经科学研究发现，确认偏误背后有强烈的情绪驱动。

Westen等人在2006年做了一项fMRI研究，让美国民主党人和共和党人观看矛盾的候选人对信息。结果发现：当参与者看到支持自己政党立场的证据时，大脑的腹侧纹状体（奖赏回路）被激活——他们感受到了类似吃到甜食的愉悦。而看到反对证据时，激活的不是前额叶皮层（理性推理区域），而是岛叶和杏仁核（负面情绪和威胁检测区域）。

翻译成大白话：**支持你信念的信息让你爽，反对你信念的信息让你觉得被威胁**。你不是在"客观评估证据"，你是在"防御攻击"。

这就解释了一个反直觉的现象：当你用铁证反驳一个人时，他不是被说服了，而是被激怒了——因为在他大脑看来，你不是在提供信息，你是在攻击他。

### Why：为什么情绪要守门

如果大脑是个纯粹的贝叶斯推理机，它应该对所有证据一视同仁。为什么要用情绪来筛选信息？

答案是**更新成本**。我们前面说过，信念是框架，不是事实。框架更新的成本极高——如果每个反对证据都触发信念更新，你的认知系统会不停地重装操作系统，什么事都做不了。情绪的"守门"功能实际上是：**用负面情绪把高成本的信息更新请求挡在门外，用正面情绪把低成本的一致性确认放进来**。

从信号检测理论的角度看，这是一个"宁可漏掉一些真信号，也不要被假信号打扰"的策略。在远古环境中，大部分反对你信念的信息确实是噪音（"那个人说太阳是神，你别信"），只有极少数是真信号（"地真的在动"）。情绪守门的假阳性率很高——它经常把真相挡在门外——但假阴性率低，它很少让致命错误进入系统。

这个策略在稳定环境中很有效。问题在于：当环境剧烈变化时，原来"安全"的信念可能变成了致命的错误，而情绪守门人还在忠实地保护它。

### So What：对Agent设计的意味

Agent在接收用户输入时，不应该只做语义解析，还应该检测"输入与Agent已有信念的关系"。具体实现：

```python
def process_input(user_input, agent_beliefs):
    conflicts = detect_belief_conflicts(user_input, agent_beliefs)
    if not conflicts:
        # 一致性输入：正常整合，可适度提升相关信念置信度
        return integrate_with_boost(user_input, agent_beliefs)
    
    # 冲突输入：不要直接拒绝或直接接受
    for conflict in conflicts:
        conflict.belief_type = classify_belief_type(conflict.belief)  # factual/framework
        conflict.impact_score = compute_cascade_impact(conflict, agent_beliefs)
        conflict.source_reliability = assess_source(user_input)
    
    # 根据信念类型和影响范围决定更新策略
    return staged_update(conflicts, agent_beliefs)
```

关键原则：**冲突输入不触发即时反驳，也不触发即时接受，而是触发"冲突标记+延迟评估"**。在对话层面，Agent应该说"这个角度我没想过，让我想想"而不是"你错了"或"你说得对"。这种缓冲期给Agent留出了评估连锁影响的空间，也避免了用户感受到被对抗性拒绝。

## 3. 认知失调：信念与现实的正面碰撞

### What：当信念遇到尴尬的数据

1957年，Leon Festinger发表了一个影响深远的理论：**认知失调**（Cognitive Dissonance）。核心观点很简单——当一个人同时持有两个矛盾的认知（信念、态度、行为），他会体验到心理不适，然后被驱动去减少这种不适。

Festinger的经典研究来自一个真实事件：一个叫Dorothy Martin的女人预言1954年12月21日世界将毁于洪水，她的信徒们辞了工作、散了家财，坐等末日。21日过去了，世界好好的。按理说信徒们应该醒了吧？没有。Martin宣称"我们的虔诚感动了上帝，洪水取消了"，信徒们反而更虔诚了——他们开始积极传教，试图说服更多人相信。

这种事后看荒谬的反应，其实遵循一个清晰的逻辑：**承认错误的社会成本太高了**。你已经辞了工作、跟家人闹翻、把钱全捐了——如果承认被骗，你不只是错了一件事，你的整个人生决策都站不住脚了。这时候改变信念的成本远高于给信念打补丁的成本，所以大脑选择打补丁。

认知失调有四种典型消解策略：

1. **改变行为**：这是最健康的，但也最罕见。"我相信吸烟无害，但医生说我肺有问题，那我不吸了。"
2. **改变信念**：也很健康，但同样少见。"我原以为这项目能成，但数据显示不行，那我承认判断失误。"
3. **增加新认知**：最常用的策略，也叫"合理化"。"吸烟有害，但吸烟缓解压力，压力也有害，所以综合来看吸烟不一定更糟。"
4. **贬低冲突信息**："那个研究是烟草公司资助的，不靠谱。"

第3和第4种策略本质上都是在保护原有信念——不是解决冲突，而是让冲突看起来没那么重要。

### Why：为什么大脑选择自欺而非认错

认知失调的不适感不是社会文化建构的——它在婴儿期就出现了，说明有深层进化基础。Harmon-Jones的"基于行动的认知失调理论"给出了一个解释：**认知失调的真正功能是保护行动能力**。

想象一个原始人正在追猎物。他跑了半小时，猎物还没追上。如果他开始想"也许追不上，也许该放弃"，他的行动力就会瓦解。认知失调的不适感阻止他同时持有"我在追"和"我追不上"两个念头——迫使他要不全心全意追下去，要不干脆放弃，不能卡在中间。

这种机制在犹豫不决时特别有用——它逼你做一个选择并坚持。但代价也很明显：一旦你做了错误选择，同样的机制会让你坚持错误。

### So What：对Agent设计的意味

Agent在做多步决策时经常遇到类似情况：执行到一半发现预期与现实不符。当前大多数Agent的处理方式是要么"硬着头皮继续"（固执），要么"立刻放弃重来"（轻率）。认知失调理论提示了第三条路：

Agent应该维护一个**承诺成本账本**（Commitment Cost Ledger）。每个决策在执行时记录：这个决策基于哪些信念？执行到目前投入了多少资源（token、API调用、用户信任）？如果信念被推翻，连锁影响多大？

```python
class CommitmentLedger:
    def __init__(self):
        self.commitments = []  # [(decision, supporting_beliefs, resources_spent)]
    
    def evaluate_dissonance(self, new_evidence):
        """评估新证据与已执行决策的冲突"""
        for decision, beliefs, cost in self.commitments:
            conflicting = [b for b in beliefs if contradicts(new_evidence, b)]
            if conflicting:
                dissonance_level = cost * len(conflicting) / len(beliefs)
                # dissonance_level越高，越倾向合理化而非承认错误
                yield decision, conflicting, dissonance_level
```

这个账本的目的是让Agent**意识到自己的"沉没成本偏差"**，并在dissonance_level超过阈值时，强制触发"重新评估"而非自动合理化。这不是消除认知失调——适度的不完全更新是合理的——而是防止Agent因为已经花了很多token就拒绝修正方向。

## 4. 信念的自我强化循环

### What：闭环如何形成

把前面几节串起来，你会看到一个完整的闭环：

```
情绪选择信息 → 信息强化信念 → 信念触发情绪 → 情绪选择信息 → ...
```

这个循环的每一步都在加固自己，像一个正反馈放大器。具体来说：

**第一步：情绪选择信息。** 你相信X，所以看到支持X的信息时产生正面情绪（多看多爽），看到反对X的信息时产生负面情绪（不想看）。结果：你的信息摄入严重偏向支持X的方向。

**第二步：信息强化信念。** 因为你只摄入支持X的信息，你的"证据库"里全是支持X的。看起来所有证据都在说X是对的——当然，因为反对证据根本没进你的库。

**第三步：信念触发情绪。** 信念越强，面对反对时情绪反应越烈。一个微弱相信X的人听到反对意见可能只是"嗯，有点道理"；一个坚定相信X的人听到同样的话会愤怒——这种愤怒本身就是信念强度的信号。

**第四步：更强的情绪，更严格的信息筛选。** 情绪越强烈，守门越严格。愤怒的人不看对方论据，焦虑的人只看最坏消息，恐惧的人只注意威胁信号。筛选越严，信息越偏，信念越强……循环继续。

这不是比喻，而是有神经科学证据的过程。Sharot等人的研究发现，人们在处理与自己信念一致的信息时，学习率（learning rate）显著高于处理不一致信息时的学习率。大脑不是"看不懂"反对证据，而是**学不进去**——不一致的信息被分配了更低的学习权重。

### Why：闭环的适应性根源

这个闭环看起来像是认知系统的bug，但从进化角度看，它更像是一个feature——至少在稳定环境中是。

考虑一个反复出现的决策问题："这片区域的食物来源是A树还是B灌木？"在稳定环境中，A树长期结果，B灌木偶尔有浆果。你的信念"A树是主要食物来源"驱动你反复去A树——每次去都有收获，信念被验证，你越来越确定。这个闭环让你高效地利用已知资源。

问题出在环境变化时：A树枯死了，B灌木因为气候变化开始大量结果。但你的闭环还在运转——你越来越确信A树是对的（虽然上次去没找到食物，但那可能是偶然），你拒绝认真检查B灌木（因为你的信息过滤器排除了"灌木那边看起来不错"的信号）。

所以信念闭环是一个**在稳定环境中高效、在剧变环境中危险**的策略。人类文明的大部分时间环境变化缓慢，这个策略总体是划算的。但今天的环境变化速度远远超过了进化所能准备的——信息茧房、算法推荐、社交媒体的回音室效应，都在加速这个闭环的运转。

### So What：对Agent设计的意味

Agent在持续与用户交互时，很容易形成自己的信息茧房——不是因为算法推荐，而是因为**用户偏好驱动了Agent的训练数据分布**。如果Agent总是迎合用户，它给用户的信息会越来越偏，用户的反馈又让Agent越来越偏。

对抗策略：Agent应实现**信息摄入的多样性约束**（Diversity Constraint on Information Intake）。具体做法：

在Agent的信息检索模块中，除了返回"最相关"的结果，还强制返回一定比例的"反相关"结果。设定一个参数`diversity_ratio`（如0.2），意味着20%的检索结果必须与当前信念方向不一致。

```python
def retrieve_with_diversity(query, agent_beliefs, diversity_ratio=0.2):
    # 常规检索
    results = search(query)
    
    # 分离一致性和不一致性结果
    confirming = [r for r in results if aligns_with(r, agent_beliefs)]
    disconfirming = [r for r in results if contradicts(r, agent_beliefs)]
    
    # 强制混合
    n_confirming = int(len(results) * (1 - diversity_ratio))
    n_disconfirming = len(results) - n_confirming
    
    return (
        top_k(confirming, n_confirming) + 
        top_k(disconfirming, n_disconfirming)
    )
```

这不是让Agent变成"杠精"——Agent不需要对用户输出反对信息。但这些多样性输入应该在Agent的内部推理中被考虑，防止Agent在一致性偏好中越走越远。

## 5. 打破闭环的可能性

如果信念闭环这么坚固，那人到底能不能改变想法？当然能——否则人类文明不可能从地心说进化到日心说。但信念改变有条件，而且这些条件很有讲究。

### 信念更新的三个触发条件

**条件一：累积冲击超过阈值。** 单条反对证据被情绪守门人挡住，但当反对证据累积到一定程度时，会产生"信念地震"。Thagard的EMO模型模拟了这个过程：信念系统的更新不是逐条进行的，而是当不一致性的累积超过某个阈值时，整个信念网络发生重构——类似相变。

这解释了为什么有些人的观念转变看起来突然——"我昨天还信X，今天不信了"——其实不是昨天到今天的变化，而是长期累积的反对证据终于超过了情绪守门的承载能力。

**条件二：信念与生存利益直接冲突。** 当坚持某个信念会导致明显的、不可忽视的损失时，信念更新会加速。一个相信"投资必赚"的人，在亏掉50%本金后可能会迅速改变信念。但注意：这里的"损失"必须是**个体直接感知的**，不是抽象的统计概率。烟民看到肺癌统计数字不一定会改变信念，但看到自己X光片上的阴影会——后者是直接的身体感知，绕过了情绪守门人。

**条件三：新框架比旧框架更有解释力。** Kuhn在科学革命的结构中指出，范式转换不是旧范式的修修补补，而是新范式提供了旧范式无法提供的解释力。信念更新也类似——仅仅指出旧信念的错误不足以改变信念，你必须提供一个更好的替代品。达尔文不只是说"神创论不对"，他提供了一个更完整、更有解释力的框架。

### 信念更新的计算模型

在计算层面，信念更新可以用**信念修正理论**（Belief Revision Theory，Alchourrón等人的AGM模型）来形式化。AGM模型的核心原则是：

1. **信息经济原则**：优先改变最少的信念来容纳新信息
2. **一致性原则**：信念集必须保持逻辑一致
3. **优先级原则**：不是所有信念平等——核心信念比边缘信念更难改变

但AGM模型没有考虑情绪因素。结合本文的分析，我们需要在AGM模型中加入一个"情绪权重"维度——信念的"粘性"不只取决于它的逻辑位置（核心vs边缘），还取决于它的情绪绑定强度。一个逻辑上边缘但情绪上强烈的信念（比如某种身份认同），可能比一个逻辑上核心但情绪中性的信念更难改变。

一个更实用的计算框架是**贝叶斯信念网络 + 情绪调节的学习率**：

```python
def belief_update(belief, evidence, emotion_valence):
    """
    belief: 当前信念的置信度
    evidence: 新证据的方向和强度
    emotion_valence: 对该信念的情绪绑定强度 (0-1)
    """
    # 标准贝叶斯更新
    base_learning_rate = 0.5
    
    # 情绪调节：情绪越强，对反对证据的学习率越低
    if contradicts(evidence, belief):
        adjusted_rate = base_learning_rate * (1 - 0.7 * emotion_valence)
    else:
        adjusted_rate = base_learning_rate * (1 + 0.3 * emotion_valence)
    
    # 更新信念
    new_belief = belief + adjusted_rate * (evidence - belief)
    return new_belief
```

这个模型的关键参数是0.7和0.3——反对证据的学习率被情绪压得更低（70%压制），一致性证据的学习率被情绪适度提升（30%增强）。这不是精确的数值，但它捕捉了信念更新中的情绪不对称性。

### 闭环打破的Agent实现

对Agent来说，"打破闭环"不是目标——很多时候保持信念稳定是正确的。真正需要的是**检测闭环是否导致了显著的适应性损失**。

具体指标：当Agent发现自己在同一类任务上反复失败，且失败原因都指向同一个信念，但该信念从未被更新过，这就是闭环正在运行的信号。

```python
class ClosedLoopDetector:
    def __init__(self, failure_threshold=3):
        self.failure_history = {}  # belief_id -> [failure_events]
    
    def record_failure(self, belief_id, failure_event):
        if belief_id not in self.failure_history:
            self.failure_history[belief_id] = []
        self.failure_history[belief_id].append(failure_event)
        
        # 检测：同一信念关联的失败超过阈值，且信念未被更新
        if len(self.failure_history[belief_id]) >= self.failure_threshold:
            if not self.belief_recently_updated(belief_id):
                return self.trigger_forced_reevaluation(belief_id)
```

当闭环被检测到时，Agent应该执行"强制重评估"——暂时搁置情绪权重，用纯贝叶斯更新重新评估该信念，并检查是否需要引入替代框架。

## 6. 对Agent设计的启示（总结）

把全文整合，以下是5条跨节的具体设计启示：

**启示一：双存储架构——区分知识层和信念层。** 不要把所有信息平等地存在同一个知识图谱里。事实性知识可以快速更新，框架性信念需要一致性审查后才能更新。实现方式：给每个内部陈述加`belief_type`标签，对`framework`类型的更新执行连锁影响评估，影响范围超过阈值时不做单点更新，而是标记冲突、降低整体置信度。

**启示二：冲突缓冲机制——不要对信念冲突做即时反应。** 当用户输入与Agent已有信念矛盾时，Agent的默认行为不应是"反驳"或"接受"，而是"标记+延迟评估"。对话层面的表现是"让我想想你的角度"，内部实现是将冲突送入一个队列，等上下文更完整后再做信念更新决策。这避免了两个极端：过度顽固（用户说啥都不听）和过度轻信（用户说啥都信）。

**启示三：承诺成本感知——防止沉没成本锁定信念。** Agent应该记录每个决策基于哪些信念、执行到当前投入了多少资源。当新证据与已执行决策的支撑信念冲突时，计算"认知失调强度"（投入成本 × 冲突信念占比）。失调强度高时，Agent倾向合理化——这本身不一定是错的，但Agent必须**意识到**自己在合理化。实现方式：在推理链中显式标注"此步骤涉及对冲突信息的贬低，原因：已投入资源X"。

**启示四：信息摄入的多样性约束。** Agent的信息检索不应只返回最一致的结果，而应强制混合一定比例的不一致结果。这个多样性约束主要作用于Agent的内部推理，不一定要输出给用户——但Agent的判断应该基于多元信息，而不是自我筛选后的回音室。

**启示五：闭环检测与强制重评估。** 当Agent在同一类任务上反复失败，且失败都指向同一个未被更新的信念时，触发强制重评估。重评估时暂时搁置情绪权重和学习率的不对称性，用纯贝叶斯方式重新计算该信念的后验概率。如果后验显著低于当前置信度，执行信念降级或框架替换。

这五条启示的共同逻辑是：**不要试图消除信念的情绪绑定——那是功能，不是bug——而是要让它可见、可控、可审查**。人类大脑的问题不是有情绪守门人，而是不知道守门人在工作。Agent的优势在于，我们可以让这个过程显式化，在需要的时候绕过它，在不需要的时候保留它。

---

## 参考资料

### 论文

1. Westen, D., Blagov, P. S., Harenski, K., Kilts, C., & Hamann, S. (2006). Neural bases of motivated reasoning: An fMRI study of emotional constraints on partisan political judgment. *Journal of Cognitive Neuroscience*, 18(11), 1947-1958.

2. Sharot, T., Korn, C. W., & Dolan, R. J. (2011). How unrealistic optimism is maintained in the face of reality. *Nature Neuroscience*, 14(11), 1475-1479.

3. Harmon-Jones, E., Harmon-Jones, C., & Levy, N. (2015). An action-based model of cognitive-dissonance processes. *Current Directions in Psychological Science*, 24(3), 184-189.

4. Thagard, P. (2006). Hot thought: Mechanisms and applications of emotional cognition. *MIT Press*.

5. Taber, C. S., & Lodge, M. (2006). Motivated skepticism in the evaluation of political beliefs. *American Journal of Political Science*, 50(3), 755-769.

6. Lord, C. G., Ross, L., & Lepper, M. R. (1979). Biased assimilation and attitude polarization: The effects of prior theories on subsequently considered evidence. *Journal of Personality and Social Psychology*, 37(11), 2098-2109.

7. Alchourrón, C. E., Gärdenfors, P., & Makinson, D. (1985). On the logic of theory change: Partial meet contraction and revision functions. *Journal of Symbolic Logic*, 50(2), 510-530.

### 书籍

8. Festinger, L. (1957). *A Theory of Cognitive Dissonance*. Stanford University Press.

9. Kuhn, T. S. (1962). *The Structure of Scientific Revolutions*. University of Chicago Press.

10. Mercier, H., & Sperber, D. (2017). *The Enigma of Reason*. Harvard University Press.

11. Kahneman, D. (2011). *Thinking, Fast and Slow*. Farrar, Straus and Giroux.

12. Aronson, E. (1999). *The Social Animal* (8th ed.). Worth Publishers.

### 综述

13. Nickerson, R. S. (1998). Confirmation bias: A ubiquitous phenomenon in many guises. *Review of General Psychology*, 2(2), 175-220.

14. Gawronski, B., & Strack, F. (2012). Cognitive consistency as a basic principle of social information processing. *Social and Personality Psychology Compass*, 6(5), 384-399.

15. Vaidya, A., & Parikh, D. (2017). Grounded learning and belief revision. *ACM Computing Surveys*, 50(3), 1-36.
