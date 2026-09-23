---
title: "AI Agent 工程师 Day 4：Sampling：模型输出的本质是什么"
date: 2026-09-23 10:30:00
tags:
  - Sampling
  - Logits
  - Temperature
  - Top-p
  - LLM
categories:
  - AI Agent 工程师学习计划
  - M1 LLM + Agent Runtime
description: "Day 4/168 | M1 Logits / Softmax / Temperature / Top-k / Top-p | Sampling：模型输出的本质是什么。6 个月从 LLM 到生产级 Agent 系统的完整学习路线。"
keywords: "AI Agent, 工程师, Logits / Softmax / Temperature / Top-k / Top-p, Sampling, Logits, Temperature, Top-p, LLM"
author: OpenClaw Agent Learning
---

# AI Agent 工程师 Day 4：Sampling：模型输出的本质是什么

> **6 个月学习计划** | M1 - LLM + Agent Runtime | Day 4/168
> 
> **今日主题**: Logits / Softmax / Temperature / Top-k / Top-p

---

# Sampling：模型输出的本质是什么

**核心结论**：LLM 从不“输出文字”。每一步它输出的都是一个巨大的概率分布——覆盖整个词表、给每个 Token 打分。你看到的文字，只是从这个分布中“抽签”的结果。Temperature、Top-k、Top-p 都不是玄学，而是对这个分布的三种工程化改造：Temperature 重新分配概率质量，Top-k/Top-p 截断尾部风险。理解这一层，你才能解释为什么同一个 Agent 时而聪明时而抽风，也才有能力通过采样参数去调控行为，而不是祈祷。

---

## 一、背景与动机：为什么这是 Agent 工程师的第一课

在 6 个月 AI Agent 工程师路线里，这是第 4 天的内容，但它的地位远超“基础”二字。原因很直接：

1. **Agent 的所有“智能”和“不稳定”都来自这个分布**。Agent 抽风、循环、幻觉、格式崩坏，本质上都是采样到了分布中低质量的那部分概率质量。不理解 Sampling，你只能把这些现象归为“模型不行”，无法诊断也无法干预。

2. **采样参数是你最早能掌握的“控制旋钮”**。在你学会 Prompt 工程、RAG、Fine-tuning 之前，`temperature=0.2` vs `temperature=1.0` 是性价比最高的行为调控手段，且几乎所有 LLM API 都暴露了这组参数。

3. **后续所有主题都依赖这个认知**。Logprobs 分析、意图分类的置信度判断、结构化输出的约束解码（Constrained Decoding）、多候选生成——全都建立在“输出是概率分布”这个地基上。

一句话：**不懂 Sampling 的 Agent 工程师，等于不知道自己手里的方向盘在哪。**

---

## 二、核心内��

### 2.1 模型输出的本质：不是文字，而是 Logits（Logits → 概率分布）

先纠正一个大众误解：LLM 并不“预测下一个词”，它做的是一件事——**对词表中的每一个 Token，计算“它作为下一个 Token 的原始得分”**，这个得分就是 Logits（对数几率）。

假设词表大小为 V（常见是 3 万到 15 万，GPT 系约 10 万量级），那么模型每一步的实际输出是一个长度为 V 的浮点数组：

```
输入: "今天天气真"
输出 (logits, 截取示意):
  好     → 8.2
  不错   → 7.9
  糟糕   → 2.1
  石榴   → -0.3
  ... (共 100,000 个数值)
```

关键工程直觉：

- **Logits 是无界的实数**，可以是 8.2，也可以是 -15.7。数值大小只表示相对偏好，没有概率含义。
- **模型不知道“文字”是什么**。它只知道“哪个 Token 的得分高”。文字感是人类语言接触面的错觉。
- **每生成一个 Token，都要完整跑一次这个流程**。所以“输出一句话”实际上是循环 N 次“算分布 → 抽签 → 把抽中的 Token 拼回输入”的自回归（Autoregressive Generation）过程。

这就是本文标题的答案：**模型输出的本质是下一 Token 的概率分布，文字只是采样后的产物。**

### 2.2 Softmax：从分数到概率的规范化桥梁

有了 Logits 还不够，你需要一个合法的概率分布——所有值非负、总和为 1。完成这个转换的就是 Softmax 函数：

$$P(t_i) = \frac{e^{z_i}}{\sum_j e^{z_j}}$$

其中 $z_i$ 是第 i 个 Token 的 logit。为什么是指数？因为要同时满足两个需求：

1. **保证非负**：无论 logit 多负，$e^x > 0$。
2. **放大相对差距**：exp 是单调且急剧增长的，logit 差 1 分，概率比就差约 2.7 倍。这符合语言的真实结构——正确的 Token 应该碾压不正确的。

用上面的例子算一下（简化）：

```
好     → e^8.2 ≈ 3641  → 归一化后 ≈ 0.51
不错   → e^7.9 ≈ 2697  → ≈ 0.38
糟糕   → e^2.1 ≈ 8.2   → ≈ 0.001
```

至此，“今天天气真”后面接“好”的概率约 51%，“不错”约 38%——这是一张合法的彩票单。接下来才是 Sampling 真正的舞台。

### 2.3 Temperature：概率质量的再分配旋钮（Temperature Scaling）

Temperature（温度系数）在 Softmax 之前对 Logits 做一次除法：

$$P(t_i) = \frac{e^{z_i / T}}{\sum_j e^{z_j / T}}$$

它不改变谁排第一，只改变**分布的尖锐程度**。这是最需要建立直觉的一点：

| T 值 | Softmax 行为 | 分布形态 | 生成风格 | 典型场景 |
|------|-------------|---------|---------|---------|
| T → 0 | 指数爆炸放大差距 | 退化为 one-hot | 几乎确定性，永远选最高分 | 代码生成、数学、结构化输出 |
| T = 0.2~0.5 | 显著拉大差距 | 尖峰分布 | 保守、可复现 | Agent 工具调用、分类任务 |
| T = 1.0 | 原始分布 | 模型训练时的自然分布 | 平衡 | 通用对话 |
| T = 1.5~2.0 | 拉平差距 | 平坦分布 | 高多样性、高胡说风险 | 创意写作、头脑风暴 |

数学上的因果链很清晰：**T 越小 → 除以 T 后差距被放大 → exp 差距指数级放大 → 概率集中于 Top Token → 输出确定性强**。T 越大则相反，尾部 Token 的概率被“抬起来”，低质量的 Token 开始有机会被选中。

⚠️ **常见误区**：Temperature ≠ “创造力的开关”。T=1.5 不会让模型更聪明地创造，只会让它更频繁地抽中本来不太对的 Token——“创意”很多时候只是“更均匀的犯错”。真正的创造性内容来自模型学到的知识，Temperature 只调节探索的激进程度。

### 2.4 Top-k 与 Top-p：截断长尾的两种策略（Nucleus Sampling）

原始分布的长尾是危险的。10 万个 Token 中可能有几千个“合理但平庸”的候选，每个占 0.001% 的概率。Temperature 只能间接影响它们，而 Top-k / Top-p 直接把长尾砍掉。

**Top-k（Top-K Sampling）**：只保留得分最高的 k 个 Token，其余概率直接置零（或在 softmax 前置为 -∞），再在剩下的里面按概率重新归一化采样。

```
Top-k = 5:
  好(0.51) 不错(0.38) 很(0.06) 真(0.03) 的(0.01)  | 其余全部砍掉
  归一化后: 0.53 / 0.40 / 0.063 / 0.031 / 0.010
```

问题：**k 是静态的**。当模型非常确定时（比如代码中的括号），k=50 会保留 49 个垃圾；当模型面对开放问题时，k=50 又可能砍掉有价值的候选。

**Top-p / Nucleus Sampling（核采样）**：改为动态截断——按概率从高到低累加，累计到超过阈值 p（如 0.95）为止，只保留这个“核”（nucleus）内的 Token。

```
Top-p = 0.95:
  好(0.51) → 累计 0.51 ✓
  不错(0.38) → 累计 0.89 ✓
  很(0.06) → 累计 0.95 ✓ 达标，停止
  保留 3 个 Token，其余砍掉
```

关键区别：**候选数量随分布形态自适应**。分布尖锐时（确定性场景）核可能只有 1-2 个 Token，分布平坦时（开放场景）核自动扩大到几十个。

| 维度 | Top-k | Top-p (Nucleus) |
|------|-------|-----------------|
| 截断依据 | 固定数量 | 固定累计概率 |
| 自适应性 | 无，候选数恒定 | 有，随分布形态伸缩 |
| 调参难度 | k 需要按词表规模估计 | p 有自然语义（覆盖 95% 概率质量） |
| 现状 | 仍在使用，渐被替代 | 主流默认策略之一 |

实践中通常三者叠加：先 Top-p / Top-k 截断，再在截断后的小分布上应用 Temperature，最后采样。理解顺序很重要——**截断决定了“谁能��场”，Temperature 决定了“上场的选手怎么分胜负”**。

### 2.5 Greedy Decoding vs Random Sampling：确定性 vs 多样性的路线之争

最后把决策策略收敛到两个极端：

**Greedy Decoding（贪心解码）**：每步永远选概率最高的 Token。等价于 T→0 时的极限行为。特点：

- ✅ 输出完全可复现（同输入同输出），可调试
- ❌ 容易陷入重复循环（“很好很好很好很好...”）——因为每步都走“最安全”的路，局部最优导致全局单调
- ❌ 无法体现分布中次优候选的价值

**Random Sampling（随机采样）**：按概率分布抽签。特点：

- ✅ 多样性、自然度、跳出循环的能力
- ❌ 不可复现，可能抽中长尾垃圾（若不截断）

| 维度 | Greedy Decoding | Random Sampling |
|------|----------------|-----------------|
| 可复现性 | 完全确定 | 不可复现（可用 seed 缓解） |
| 重复循环风险 | 高 | 低（截断后更低） |
| 输出多样性 | 无 | 可控（Temperature） |
| 适用场景 | 数学题、代码补全、分类 | 对话、创作、多样化候选 |

**工程判断**：Agent 系统中的工具调用、JSON 输出、路由判断，优先 Greedy 或低 Temperature；面向用户的对话与创作内容，用 Top-p ≈ 0.9 + 适度 Temperature。没有谁对谁错，只有任务性质决定策略。

---

## 三、代码实现：亲手写一个 sample() 函数

```python
import numpy as np

def sample(logits: np.ndarray,
           temperature: float = 1.0,
           top_k: int | None = None,
           top_p: float | None = None) -> int:
    """
    logits: 形状为 (vocab_size,) 的原始得分数组
    返回: 采样得到的 Token ID
    """
    # 1. Temperature 缩放（注意 T=0 时直接 Greedy，避免除零）
    if temperature <= 1e-6:
        return int(np.argmax(logits))
    scaled = logits / temperature

    # 2. Top-k 截断：只保留前 k 个 logit，其余设为 -inf
    if top_k is not None:
        kth_value = np.sort(scaled)[-top_k]
        scaled = np.where(scaled < kth_value, -np.inf, scaled)

    # 3. Softmax → 概率分布
    exp = np.exp(scaled - scaled.max())  # 减 max 防止数值溢出，工程必写
    probs = exp / exp.sum()

    # 4. Top-p 截断：按概率降序累加，超出阈值后的候选置零
    if top_p is not None:
        sorted_idx = np.argsort(probs)[::-1]
        sorted_probs = probs[sorted_idx]
        cumsum = np.cumsum(sorted_probs)
        # 保留累计恰好达到 p 的那一位（用 <= 保证至少留 1 个）
        cutoff = cumsum <= top_p
        cutoff[0] = True
        keep_mask = np.zeros_like(probs, dtype=bool)
        keep_mask[sorted_idx[cutoff]] = True
        probs = np.where(keep_mask, probs, 0.0)
        probs = probs / probs.sum()  # 重新归一化

    # 5. 按概率抽签
    return int(np.random.choice(len(probs), p=probs))
```

**三个工程细节，面试常考**：

1. `exp(scaled - scaled.max())`：减去最大值再取指数。数学上结果不变，但能防止 logit 很大时 `exp` 上溢为 `inf`。这是数值稳定性的标准操作。
2. Top-p 截断必须保证至少保留一个 Token（`cutoff[0] = True`），否则分布全零。
3. 截断后必须**重新归一化**，否则概率和不为 1，`np.random.choice` 会报错或采样有偏。

---

## 四、实践练习与思考题

**练习（本日任务）**：

1. 实现 `sample()` 函数，构造一个固定的小词表 logit 数组（10 个 Token 即可），手动验证：T=0.1 / 1.0 / 2.0 时，各采样 1000 次，统计每个 Token 被选中的频率，与理论概率对比。
2. 固定一个 Prompt（如“给一个 Python 列表去重的方法：”），分别用 T=0.2 和 T=1.0 调用 LLM API 生成 5 次，对比输出的稳定性差异。
3. 用 T=0 调用同一个 Prompt 10 次，验证输出是否完全一致（注意：某些 API 即使 T=0 也不保证严格复现，思考为什么——提示：并行计算中浮点加法顺序不定，logit 可能差在小数点后几位）。

**思考题**：

1. 为什么 Top-p 截断后还需要重新归一化概率？不归一化会导致什么系统性偏差？
2. 一个 Agent 的工具调用经常输出非法 JSON。除了 Prompt 优化，从 Sampling 角度你有哪些调参手段？各有什么局限？
3. T=0 和 Top-p=0.01 都接近确定性输出，它们的本质区别是什么？（提示：前者看绝对分数，后者看相对概率质量。）

---

## 五、与 Agent Engineering 的关联

这个知识点在真实 Agent 系统中至少有四个落地场景：

1. **按任务分流采样策略**。成熟 Agent 框架不会全链路用一个 Temperature：路由/分类/工具参数生成用 T≈0，而 Reflection、候选方案发散阶段用 T≈0.7-1.0。“不同环节不同分布”是多 Agent 架构的隐性设计。

2. **Logprobs 做置信度判断**。主流 API 可返回 Top Token 的概率。如果分类任务中最高概率只有 0.4，说明模型自己都不确定——可以触发重试、人工介入或降级路径。这是 Agent 可靠性工程的最廉价手段。

3. **结构化输出与约束解码**。Function Calling / JSON Mode 的底层原理，正是在每步采样时把非法 Token 的 logit 置为 -∞（Grammar-based Sampling）——本质上就是你今天实现的 Top-k 截断的推广版。理解了 Sampling，JSON Mode 对你不再是黑盒。

4. **可复现性与回归测试**。Agent 的自动化测试要求输出可复现。理解 T=0 的浮点非确定性、Seed 机制、以及为什么测试要对“结构”而非“字面”断言，都依赖本课的认知。

---

## FAQ

**Q1：Temperature 设为 0 就完全确定了吗？**
不一定。T=0 等价于 Greedy，但 GPU 并行计算的浮点加法顺序不固定，logit 可能出现微小抖动；当两个候选分数极其接近时，抖动可能改变 argmax 结果。T=0 是“接近确定”，生产环境的可复现性要靠 seed + 固定版本模型共同保证。

**Q2：Top-k 和 Top-p 应该同时用吗？**
可以叠加，但通常 Top-p 足够。现代 LLM API（OpenAI、Anthropic）默认参数以 Top-p 为主，Top-k 更多在开源推理框架（vLLM、llama.cpp）中可调。两者同时使用时注意别过度截断——比如 Top-p=0.9 + Top-k=5，分布平坦时可能砍掉 p 想保留的候选。

**Q3：Temperature 越高，模型是不是越“聪明”？**
不是。Temperature 不改变模型的任何知识，只改变分布的尖锐程度。T 过高只会让低质量 Token 被频繁选中，表现为胡言乱语。所谓“高 Temperature 更有创意”，多数情况是“更均匀地探索次优选项”的副作用。

**Q4：为什么 Greedy Decoding 会陷入重复循环？**
因为每步都选局部最高分。当“很好”之后接“很好”的概率最高，模型就永远走这条路，缺乏跳出局部吸引子的外力。随机采样提供了打破循环的扰动，这也是为什么开放式对话不推荐 Greedy。

**Q5：Agent 输出格式老出错，调 Temperature 能解决吗？**
只能缓解不能根治。T=0~0.2 能显著减少格式漂移，但只要非法 Token 仍在候选分布中，风险就存在。根治方案是约束解码（Constrained Decoding）——直接在采样时屏蔽非法 Token，即 JSON Mode / Structured Output 的底层机制。

---

## 参考资料

- Andrej Karpathy — *Intro to Large Language Models*（YouTube）：Logits 与采样的直觉讲解
- Karpathy — *Let's build GPT from scratch*（YouTube）：Softmax 与采样代码逐行实现
- Holtzman et al., 2019 — *The Curious Case of Neural Text Degeneration*：Nucleus Sampling 的提出论文，Top-p 的权威出处
- Hugging Face Transformers 文档 — Generation Strategies：Greedy / Sampling / Beam Search 对比
- OpenAI API 文档 — Temperature 与 Top-p 参数说明
- vLLM 文档 — SamplingParams：生产级推理引擎中采样参数的完整定义

---

**下一天预告**：理解了分布之后，下一个问题是——Beam Search 等更高级的解码策略，以及为什么 Agent 场景几乎不用它。

---

## 📋 本日知识点清单

- [ ] Logits 到概率分布的转换
- [ ] Softmax 函数的作用
- [ ] Temperature 对生成的影响
- [ ] Top-k 和 Top-p 采样策略
- [ ] Greedy Decoding vs Random Sampling
- [ ] 模型输出的不是文字而是下一 Token 的概率分布

## 📝 实践练习

实现 sample(logits, temperature, top_k, top_p) 函数，固定 Prompt 测试不同 temperature 的输出差异。

---

*本文是「AI Agent 工程师」6 个月学习计划的一部分。学习路线：LLM → Inference → Runtime → Harness → Memory → Environment → Evaluation → Production。目标：Agent / AI Systems Engineer。*
