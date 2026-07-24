---
title: Agent Memory 日报 - 2026-07-04
tags:
  - agent-memory
  - arxiv
  - daily-report
  - long-term-memory
  - RAG
  - hippocampal-memory
  - episodic-memory
categories:
  - Agent Memory 研究
abbrlink: 29147
date: 2026-07-04 18:00:00
noindex: true
---

# Agent Memory arXiv 日报 — 2026-07-04

> 每日自动筛选 cs.AI 领域与 Agent Memory 相关的最新论文，追踪研究趋势与关键创新。

---

## 📋 今日相关论文列表

### 1. A Hippocampus for Linear Attention: An Exact Memory for What the Recurrent State Forgets

- **arXiv ID:** 2607.02303
- **链接:** [https://arxiv.org/abs/2607.02303](https://arxiv.org/abs/2607.02303) [Kimi解读](http://kimi.com/_prefill_chat?prefill_prompt=%E6%88%91%E4%BB%AC%E8%A6%81%E8%AE%A8%E8%AE%BA%E7%9A%84%E8%AE%BA%E6%96%87%E6%98%AF2607.02303%EF%BC%8C%E9%93%BE%E6%8E%A5%E6%98%AF%20https%3A//arxiv.org/pdf/2607.02303%20%EF%BC%8C%E5%B7%B2%E6%9C%89%E7%9A%84FAQ%E9%93%BE%E6%8E%A5%E6%98%AF%20https%3A//papers.cool/arxiv/kimi%3Fpaper%3D2607.02303%20%E3%80%82%E8%AF%B7%E4%BB%A5%E6%AD%A4%E4%B8%BA%E5%9F%BA%E7%A1%80%EF%BC%8C%E7%BB%A7%E7%BB%AD%E5%9B%9E%E7%AD%94%E6%88%91%E5%90%8E%E9%9D%A2%E7%9A%84%E9%97%AE%E9%A2%98%E3%80%82&system_prompt=%E4%BD%A0%E6%98%AF%E4%B8%80%E4%B8%AA%E5%AD%A6%E6%9C%AF%E5%8A%A9%E6%89%8B%EF%BC%8C%E5%90%8E%E9%9D%A2%E7%9A%84%E5%AF%B9%E8%AF%9D%E5%B0%86%E5%9B%B4%E7%BB%95%E7%9D%80%E4%BB%A5%E4%B8%8B%E8%AE%BA%E6%96%87%E5%86%85%E5%AE%B9%E8%BF%9B%E8%A1%8C%EF%BC%8C%E5%B7%B2%E7%BB%8F%E9%80%9A%E8%BF%87%E9%93%BE%E6%8E%A5%E7%BB%99%E5%87%BA%E4%BA%86%E8%AE%BA%E6%96%87%E7%9A%84PDF%E5%92%8C%E8%AE%BA%E6%96%87%E5%B7%B2%E6%9C%89%E7%9A%84FAQ%E3%80%82%E7%94%A8%E6%88%B7%E5%B0%86%E7%BB%A7%E7%BB%AD%E5%90%91%E4%BD%A0%E5%92%A8%E8%AF%A2%E8%AE%BA%E6%96%87%E7%9A%84%E7%9B%B8%E5%85%B3%E9%97%AE%E9%A2%98%EF%BC%8C%E8%AF%B7%E4%BD%A0%E4%BD%9C%E5%87%BA%E4%B8%93%E4%B8%9A%E7%9A%84%E5%9B%9E%E7%AD%94%EF%BC%8C%E4%B8%8D%E8%A6%81%E5%87%BA%E7%8E%B0%E7%AC%AC%E4%B8%80%E4%BA%BA%E7%A7%B0%EF%BC%8C%E5%BD%93%E6%B6%89%E5%8F%8A%E5%88%B0%E5%88%86%E7%82%B9%E5%9B%9E%E7%AD%94%E6%97%B6%EF%BC%8C%E9%BC%93%E5%8A%B1%E4%BD%A0%E4%BB%A5markdown%E6%A0%BC%E5%BC%8F%E8%BE%93%E5%87%BA%E3%80%82&send_immediately=true)
- **作者:** Wanyun Cui

**摘要要点：** 线性注意力和状态空间模型将前缀压缩为固定大小的循环状态，以 O(1) 内存换取了有损的记忆——当大量 key-value 竞争时，早期事实被覆盖，needle recall 性能下降。受**互补学习系统（Complementary Learning Systems）**启发，提出 HOLA（Hippocampal Linear Attention）：保留 delta-rule 状态作为压缩记忆，额外添加有界的精确 KV 缓存，形成半参数化测试时记忆。缓存无需学习驱逐模块，保留预测残差大的 token；解耦的 RMSNorm-gamma 缓存读取实现精确检索。340M 参数模型上 Wikitext 困惑度从 27.32 降至 22.92（-16.1%），低于全注意力 Transformer++（26.88），在 RULER needle-in-a-haystack 测试中 32k token 长度仍保持鲁棒。

---

### 2. DRIFTLENS: Measuring Memory-Induced Reasoning Drift in Personalized Language Models

- **arXiv ID:** 2607.02374
- **链接:** [https://arxiv.org/abs/2607.02374](https://arxiv.org/abs/2607.02374) [Kimi解读](http://kimi.com/_prefill_chat?prefill_prompt=%E6%88%91%E4%BB%AC%E8%A6%81%E8%AE%A8%E8%AE%BA%E7%9A%84%E8%AE%BA%E6%96%87%E6%98%AF2607.02374%EF%BC%8C%E9%93%BE%E6%8E%A5%E6%98%AF%20https%3A//arxiv.org/pdf/2607.02374%20%EF%BC%8C%E5%B7%B2%E6%9C%89%E7%9A%84FAQ%E9%93%BE%E6%8E%A5%E6%98%AF%20https%3A//papers.cool/arxiv/kimi%3Fpaper%3D2607.02374%20%E3%80%82%E8%AF%B7%E4%BB%A5%E6%AD%A4%E4%B8%BA%E5%9F%BA%E7%A1%80%EF%BC%8C%E7%BB%A7%E7%BB%AD%E5%9B%9E%E7%AD%94%E6%88%91%E5%90%8E%E9%9D%A2%E7%9A%84%E9%97%AE%E9%A2%98%E3%80%82&system_prompt=%E4%BD%A0%E6%98%AF%E4%B8%80%E4%B8%AA%E5%AD%A6%E6%9C%AF%E5%8A%A9%E6%89%8B%EF%BC%8C%E5%90%8E%E9%9D%A2%E7%9A%84%E5%AF%B9%E8%AF%9D%E5%B0%86%E5%9B%B4%E7%BB%95%E7%9D%80%E4%BB%A5%E4%B8%8B%E8%AE%BA%E6%96%87%E5%86%85%E5%AE%B9%E8%BF%9B%E8%A1%8C%EF%BC%8C%E5%B7%B2%E7%BB%8F%E9%80%9A%E8%BF%87%E9%93%BE%E6%8E%A5%E7%BB%99%E5%87%BA%E4%BA%86%E8%AE%BA%E6%96%87%E7%9A%84PDF%E5%92%8C%E8%AE%BA%E6%96%87%E5%B7%B2%E6%9C%89%E7%9A%84FAQ%E3%80%82%E7%94%A8%E6%88%B7%E5%B0%86%E7%BB%A7%E7%BB%AD%E5%90%91%E4%BD%A0%E5%92%A8%E8%AF%A2%E8%AE%BA%E6%96%87%E7%9A%84%E7%9B%B8%E5%85%B3%E9%97%AE%E9%A2%98%EF%BC%8C%E8%AF%B7%E4%BD%A0%E4%BD%9C%E5%87%BA%E4%B8%93%E4%B8%9A%E7%9A%84%E5%9B%9E%E7%AD%94%EF%BC%8C%E4%B8%8D%E8%A6%81%E5%87%BA%E7%8E%B0%E7%AC%AC%E4%B8%80%E4%BA%BA%E7%A7%B0%EF%BC%8C%E5%BD%93%E6%B6%89%E5%8F%8A%E5%88%B0%E5%88%86%E7%82%B9%E5%9B%9E%E7%AD%94%E6%97%B6%EF%BC%8C%E9%BC%93%E5%8A%B1%E4%BD%A0%E4%BB%A5markdown%E6%A0%BC%E5%BC%8F%E8%BE%93%E5%87%BA%E3%80%82&send_immediately=true)
- **作者:** Xi Fang, Weijie Xu, Yingqiang Ge, Yuhui Xu, Stephanie Eckman, Chandan K. Reddy

**摘要要点：** 个性化 LLM 通过存储用户属性、偏好和先前上下文来实现个性化，但本文发现**记忆注入不仅改变了输出内容，还会改变推理轨迹**。提出 DRIFTLENS 框架：将每个推理步骤映射到价值类别，测量无记忆轨迹与注入用户属性记忆后的轨迹偏差。在 4 个 LLM 和 10 个用户属性类别上，记忆引发中等到大程度的推理漂移，即使最终答案仍流畅合理。GRPO 和 DPO 后训练方法可降低漂移但无法完全消除，且效果因模型和奖励而异。**记忆诱导的推理漂移是可测量但仅部分缓解的失败模式。**

---

### 3. ReContext: Recursive Evidence Replay as LLM Harness for Long-Context Reasoning

- **arXiv ID:** 2607.02509
- **链接:** [https://arxiv.org/abs/2607.02509](https://arxiv.org/abs/2607.02509) [Kimi解读](http://kimi.com/_prefill_chat?prefill_prompt=%E6%88%91%E4%BB%AC%E8%A6%81%E8%AE%A8%E8%AE%BA%E7%9A%84%E8%AE%BA%E6%96%87%E6%98%AF2607.02509%EF%BC%8C%E9%93%BE%E6%8E%A5%E6%98%AF%20https%3A//arxiv.org/pdf/2607.02509%20%EF%BC%8C%E5%B7%B2%E6%9C%89%E7%9A%84FAQ%E9%93%BE%E6%8E%A5%E6%98%AF%20https%3A//papers.cool/arxiv/kimi%3Fpaper%3D2607.02509%20%E3%80%82%E8%AF%B7%E4%BB%A5%E6%AD%A4%E4%B8%BA%E5%9F%BA%E7%A1%80%EF%BC%8C%E7%BB%A7%E7%BB%AD%E5%9B%9E%E7%AD%94%E6%88%91%E5%90%8E%E9%9D%A2%E7%9A%84%E9%97%AE%E9%A2%98%E3%80%82&system_prompt=%E4%BD%A0%E6%98%AF%E4%B8%80%E4%B8%AA%E5%AD%A6%E6%9C%AF%E5%8A%A9%E6%89%8B%EF%BC%8C%E5%90%8E%E9%9D%A2%E7%9A%84%E5%AF%B9%E8%AF%9D%E5%B0%86%E5%9B%B4%E7%BB%95%E7%9D%80%E4%BB%A5%E4%B8%8B%E8%AE%BA%E6%96%87%E5%86%85%E5%AE%B9%E8%BF%9B%E8%A1%8C%EF%BC%8C%E5%B7%B2%E7%BB%8F%E9%80%9A%E8%BF%87%E9%93%BE%E6%8E%A5%E7%BB%99%E5%87%BA%E4%BA%86%E8%AE%BA%E6%96%87%E7%9A%84PDF%E5%92%8C%E8%AE%BA%E6%96%87%E5%B7%B2%E6%9C%89%E7%9A%84FAQ%E3%80%82%E7%94%A8%E6%88%B7%E5%B0%86%E7%BB%A7%E7%BB%AD%E5%90%91%E4%BD%A0%E5%92%A8%E8%AF%A2%E8%AE%BA%E6%96%87%E7%9A%84%E7%9B%B8%E5%85%B3%E9%97%AE%E9%A2%98%EF%BC%8C%E8%AF%B7%E4%BD%A0%E4%BD%9C%E5%87%BA%E4%B8%93%E4%B8%9A%E7%9A%84%E5%9B%9E%E7%AD%94%EF%BC%8C%E4%B8%8D%E8%A6%81%E5%87%BA%E7%8E%B0%E7%AC%AC%E4%B8%80%E4%BA%BA%E7%A7%B0%EF%BC%8C%E5%BD%93%E6%B6%89%E5%8F%8A%E5%88%B0%E5%88%86%E7%82%B9%E5%9B%9E%E7%AD%94%E6%97%B6%EF%BC%8C%E9%BC%93%E5%8A%B1%E4%BD%A0%E4%BB%A5markdown%E6%A0%BC%E5%BC%8F%E8%BE%93%E5%87%BA%E3%80%82&send_immediately=true)
- **作者:** Yanjun Zhao, Ruizhong Qiu, Tianxin Wei, Yuanchen Bei, Zhining Liu, Lingjie Chen, Ismini Lourentzou, Hanghang Tong, Jingrui He

**摘要要点：** 提出 RECONTEXT——一种无训练推理方法，通过**递归证据回放**改善长上下文推理。利用模型内部相关性信号构建查询条件化证据池，在最终生成前回放，同时保留完整原始上下文。将证据组织与答案生成分离，无需训练、外部记忆或上下文裁剪。理论分析基于**联想记忆（Associative Memory）**：上下文视为记忆存储、问题为检索线索、注意力为线索-痕迹关联、回放为痕迹再激活。在 8 个长上下文数据集（128K）上，Qwen3-4B/8B 和 Llama3-8B 均持续改善。

---

### 4. AgenticSTS: A Bounded-Memory Testbed for Long-Horizon LLM Agents

- **arXiv ID:** 2607.02295（#15）
- **链接:** [https://arxiv.org/abs/2607.02295](https://arxiv.org/abs/2607.02295) [Kimi解读](http://kimi.com/_prefill_chat?prefill_prompt=%E6%88%91%E4%BB%AC%E8%A6%81%E8%AE%A8%E8%AE%BA%E7%9A%84%E8%AE%BA%E6%96%87%E6%98%AF2607.02295%EF%BC%8C%E9%93%BE%E6%8E%A5%E6%98%AF%20https%3A//arxiv.org/pdf/2607.02295%20%EF%BC%8C%E5%B7%B2%E6%9C%89%E7%9A%84FAQ%E9%93%BE%E6%8E%A5%E6%98%AF%20https%3A//papers.cool/arxiv/kimi%3Fpaper%3D2607.02295%20%E3%80%82%E8%AF%B7%E4%BB%A5%E6%AD%A4%E4%B8%BA%E5%9F%BA%E7%A1%80%EF%BC%8C%E7%BB%A7%E7%BB%AD%E5%9B%9E%E7%AD%94%E6%88%91%E5%90%8E%E9%9D%A2%E7%9A%84%E9%97%AE%E9%A2%98%E3%80%82&system_prompt=%E4%BD%A0%E6%98%AF%E4%B8%80%E4%B8%AA%E5%AD%A6%E6%9C%AF%E5%8A%A9%E6%89%8B%EF%BC%8C%E5%90%8E%E9%9D%A2%E7%9A%84%E5%AF%B9%E8%AF%9D%E5%B0%86%E5%9B%B4%E7%BB%95%E7%9D%80%E4%BB%A5%E4%B8%8B%E8%AE%BA%E6%96%87%E5%86%85%E5%AE%B9%E8%BF%9B%E8%A1%8C%EF%BC%8C%E5%B7%B2%E7%BB%8F%E9%80%9A%E8%BF%87%E9%93%BE%E6%8E%A5%E7%BB%99%E5%87%BA%E4%BA%86%E8%AE%BA%E6%96%87%E7%9A%84PDF%E5%92%8C%E8%AE%BA%E6%96%87%E5%B7%B2%E6%9C%89%E7%9A%84FAQ%E3%80%82%E7%94%A8%E6%88%B7%E5%B0%86%E7%BB%A7%E7%BB%AD%E5%90%91%E4%BD%A0%E5%92%A8%E8%AF%A2%E8%AE%BA%E6%96%87%E7%9A%84%E7%9B%B8%E5%85%B3%E9%97%AE%E9%A2%98%EF%BC%8C%E8%AF%B7%E4%BD%A0%E4%BD%9C%E5%87%BA%E4%B8%93%E4%B8%9A%E7%9A%84%E5%9B%9E%E7%AD%94%EF%BC%8C%E4%B8%8D%E8%A6%81%E5%87%BA%E7%8E%B0%E7%AC%AC%E4%B8%80%E4%BA%BA%E7%A7%B0%EF%BC%8C%E5%BD%93%E6%B6%89%E5%8F%8A%E5%88%B0%E5%88%86%E7%82%B9%E5%9B%9E%E7%AD%94%E6%97%B6%EF%BC%8C%E9%BC%93%E5%8A%B1%E4%BD%A0%E4%BB%A5markdown%E6%A0%BC%E5%BC%8F%E8%BE%93%E5%87%BA%E3%80%82&send_immediately=true)
- **作者:** Xiangchen Cheng, Yunwei Jiang, Jianwen Sun, Zizhen Li, Chuanhao Li 等

**摘要要点：** 长时域 LLM Agent 的记忆是一个"合约"——决定每次决策能看到什么。传统做法将所有历史观察、工具调用和反思拼接到 prompt，导致记忆混乱且无法隔离分析单层效果。提出**有界记忆合约**：每次决策从类型化检索组装的新鲜用户消息出发，不附加原始跨决策记录。在《杀戮尖塔 2》中实现测试平台，发布 298 条完整轨迹、条件标签、冻结记忆/技能快照和提示记录。**为显式记忆层如何塑造长时域 Agent 决策提供了可复用的方法论。**

---

### 5. Grounded Autonomous Research: A Fault-Tolerant LLM Pipeline from Corpus to Manuscript

- **arXiv ID:** 2607.02329
- **链接:** [https://arxiv.org/abs/2607.02329](https://arxiv.org/abs/2607.02329) [Kimi解读](http://kimi.com/_prefill_chat?prefill_prompt=%E6%88%91%E4%BB%AC%E8%A6%81%E8%AE%A8%E8%AE%BA%E7%9A%84%E8%AE%BA%E6%96%87%E6%98%AF2607.02329%EF%BC%8C%E9%93%BE%E6%8E%A5%E6%98%AF%20https%3A//arxiv.org/pdf/2607.02329%20%EF%BC%8C%E5%B7%B2%E6%9C%89%E7%9A%84FAQ%E9%93%BE%E6%8E%A5%E6%98%AF%20https%3A//papers.cool/arxiv/kimi%3Fpaper%3D2607.02329%20%E3%80%82%E8%AF%B7%E4%BB%A5%E6%AD%A4%E4%B8%BA%E5%9F%BA%E7%A1%80%EF%BC%8C%E7%BB%A7%E7%BB%AD%E5%9B%9E%E7%AD%94%E6%88%91%E5%90%8E%E9%9D%A2%E7%9A%84%E9%97%AE%E9%A2%98%E3%80%82&system_prompt=%E4%BD%A0%E6%98%AF%E4%B8%80%E4%B8%AA%E5%AD%A6%E6%9C%AF%E5%8A%A9%E6%89%8B%EF%BC%8C%E5%90%8E%E9%9D%A2%E7%9A%84%E5%AF%B9%E8%AF%9D%E5%B0%86%E5%9B%B4%E7%BB%95%E7%9D%80%E4%BB%A5%E4%B8%8B%E8%AE%BA%E6%96%87%E5%86%85%E5%AE%B9%E8%BF%9B%E8%A1%8C%EF%BC%8C%E5%B7%B2%E7%BB%8F%E9%80%9A%E8%BF%87%E9%93%BE%E6%8E%A5%E7%BB%99%E5%87%BA%E4%BA%86%E8%AE%BA%E6%96%87%E7%9A%84PDF%E5%92%8C%E8%AE%BA%E6%96%87%E5%B7%B2%E6%9C%89%E7%9A%84FAQ%E3%80%82%E7%94%A8%E6%88%B7%E5%B0%86%E7%BB%A7%E7%BB%AD%E5%90%91%E4%BD%A0%E5%92%A8%E8%AF%A2%E8%AE%BA%E6%96%87%E7%9A%84%E7%9B%B8%E5%85%B3%E9%97%AE%E9%A2%98%EF%BC%8C%E8%AF%B7%E4%BD%A0%E4%BD%9C%E5%87%BA%E4%B8%93%E4%B8%9A%E7%9A%84%E5%9B%9E%E7%AD%94%EF%BC%8C%E4%B8%8D%E8%A6%81%E5%87%BA%E7%8E%B0%E7%AC%AC%E4%B8%80%E4%BA%BA%E7%A7%B0%EF%BC%8C%E5%BD%93%E6%B6%89%E5%8F%8A%E5%88%B0%E5%88%86%E7%82%B9%E5%9B%9E%E7%AD%94%E6%97%B6%EF%BC%8C%E9%BC%93%E5%8A%B1%E4%BD%A0%E4%BB%A5markdown%E6%A0%BC%E5%BC%8F%E8%BE%93%E5%87%BA%E3%80%82&send_immediately=true)
- **作者:** Haonan Huang

**摘要要点：** 自主研究 Agent 在 47 个新上下文会话中仅通过**磁盘状态共享**完成端到端科研流程（11,083 篇论文 → 出版级手稿）。跨会话的状态持久化与 2,162 次文献咨询事件体现了**外部化记忆**在长程任务中的关键作用。容错源于冗余：新上下文隔离、分布式锚定和对抗性审查。核心洞察：校验检查点的结构化数值对峙是有效的锚定机制。

---

### 6. Distributed Attacks in Persistent-State AI Control

- **arXiv ID:** 2607.02514
- **链接:** [https://arxiv.org/abs/2607.02514](https://arxiv.org/abs/2607.02514) [Kimi解读](http://kimi.com/_prefill_chat?prefill_prompt=%E6%88%91%E4%BB%AC%E8%A6%81%E8%AE%A8%E8%AE%BA%E7%9A%84%E8%AE%BA%E6%96%87%E6%98%AF2607.02514%EF%BC%8C%E9%93%BE%E6%8E%A5%E6%98%AF%20https%3A//arxiv.org/pdf/2607.02514%20%EF%BC%8C%E5%B7%B2%E6%9C%89%E7%9A%84FAQ%E9%93%BE%E6%8E%A5%E6%98%AF%20https%3A//papers.cool/arxiv/kimi%3Fpaper%3D2607.02514%20%E3%80%82%E8%AF%B7%E4%BB%A5%E6%AD%A4%E4%B8%BA%E5%9F%BA%E7%A1%80%EF%BC%8C%E7%BB%A7%E7%BB%AD%E5%9B%9E%E7%AD%94%E6%88%91%E5%90%8E%E9%9D%A2%E7%9A%84%E9%97%AE%E9%A2%98%E3%80%82&system_prompt=%E4%BD%A0%E6%98%AF%E4%B8%80%E4%B8%AA%E5%AD%A6%E6%9C%AF%E5%8A%A9%E6%89%8B%EF%BC%8C%E5%90%8E%E9%9D%A2%E7%9A%84%E5%AF%B9%E8%AF%9D%E5%B0%86%E5%9B%B4%E7%BB%95%E7%9D%80%E4%BB%A5%E4%B8%8B%E8%AE%BA%E6%96%87%E5%86%85%E5%AE%B9%E8%BF%9B%E8%A1%8C%EF%BC%8C%E5%B7%B2%E7%BB%8F%E9%80%9A%E8%BF%87%E9%93%BE%E6%8E%A5%E7%BB%99%E5%87%BA%E4%BA%86%E8%AE%BA%E6%96%87%E7%9A%84PDF%E5%92%8C%E8%AE%BA%E6%96%87%E5%B7%B2%E6%9C%89%E7%9A%84FAQ%E3%80%82%E7%94%A8%E6%88%B7%E5%B0%86%E7%BB%A7%E7%BB%AD%E5%90%91%E4%BD%A0%E5%92%A8%E8%AF%A2%E8%AE%BA%E6%96%87%E7%9A%84%E7%9B%B8%E5%85%B3%E9%97%AE%E9%A2%98%EF%BC%8C%E8%AF%B7%E4%BD%A0%E4%BD%9C%E5%87%BA%E4%B8%93%E4%B8%9A%E7%9A%84%E5%9B%9E%E7%AD%94%EF%BC%8C%E4%B8%8D%E8%A6%81%E5%87%BA%E7%8E%B0%E7%AC%AC%E4%B8%80%E4%BA%BA%E7%A7%B0%EF%BC%8C%E5%BD%93%E6%B6%89%E5%8F%8A%E5%88%B0%E5%88%86%E7%82%B9%E5%9B%9E%E7%AD%94%E6%97%B6%EF%BC%8C%E9%BC%93%E5%8A%B1%E4%BD%A0%E4%BB%A5markdown%E6%A0%BC%E5%BC%8F%E8%BE%93%E5%87%BA%E3%80%82&send_immediately=true)
- **作者:** Ida Caspary, Asa Cooper Stickland

**摘要要点：** AI 编码 Agent 的代码库在跨会话中持久存在，这种**持久状态**创造了新的攻击面。提出有状态链接追踪监控器，跨 PR 追踪可疑累积——本质上是一种**跨会话状态记忆**的安全监控应用。四监控器集成将渐进攻击规避率从 93% 降至 47%。

---

## 🔥 研究趋势分析

### 趋势一：神经科学启发的记忆架构（最热）

HOLA 直接借鉴**海马体-互补学习系统**理论，将压缩记忆（新皮层类比）与精确缓存（海马体类比）分离。这与 ReContext 的联想记忆理论分析形成呼应——认知科学持续为 Agent Memory 提供核心设计灵感。

### 趋势二：记忆的安全性与副作用（新兴方向）

DRIFTLENS 揭示了记忆注入对推理轨迹的隐性影响——不仅是"记什么"的问题，更是"记忆如何重塑思维"的问题。Persistent-State 攻击则从安全角度审视跨会话状态持久化的风险。**记忆安全**正在成为独立研究方向。

### 趋势三：有界记忆 vs 无界上下文（工程收敛）

AgenticSTS 的有界记忆合约和 HOLA 的有界精确缓存都指向同一设计哲学：**不是更多记忆，而是更好的记忆合约**。这标志着领域从"堆上下文窗口"向"结构化记忆访问"的转变。

### 趋势四：证据回放与检索增强（推理时记忆）

ReContext 的递归证据回放是一种**推理时记忆增强**——不修改模型权重，不依赖外部存储，仅通过重组织上下文内的证据来改善长上下文推理。这与 RAG 形成互补：RAG 从外部注入知识，ReContext 从内部重新激活已有证据。

---

## 💡 关键洞察和创新点

| 论文 | 核心创新 | 一句话洞察 |
|------|---------|-----------|
| **HOLA** | 半参数化测试时记忆（压缩状态 + 精确缓存） | 海马体不是更大的缓存，而是选择性记忆的机制 |
| **DRIFTLENS** | 无真值的推理漂移测量框架 | 个性化记忆是双刃剑——它改变了推理本身 |
| **ReContext** | 递归证据回放 + 联想记忆理论 | 上下文窗口里的"遗忘"可以用回放来弥补 |
| **AgenticSTS** | 有界记忆合约 + 可消融记忆层测试平台 | 好的记忆架构是合约，不是堆栈 |
| **Grounded Research** | 磁盘状态共享的跨会话持久化 | 外部化记忆 + 分布式锚定 = 容错长程推理 |

---

## 🔗 与 19 个开源记忆项目的关联

| 开源项目 | 今日论文关联 |
|---------|------------|
| **MemGPT** | HOLA 的半参数化架构与 MemGPT 的分层记忆（核心+归档）设计理念一致：压缩记忆处理结构化信息，精确存储保留关键事实 |
| **LangChain Memory** | DRIFTLENS 对记忆注入副作用的发现，直接挑战 LangChain 简单拼接历史消息的做法 |
| **LlamaIndex** | ReContext 的证据回放可视为 LlamaIndex RAG 的推理时增强版本——不引入外部知识，而是重新激活已有上下文 |
| **AutoGPT** | AgenticSTS 的有界记忆合约为 AutoGPT 的无限上下文累积问题提供了替代方案 |
| **Mem0** | DRIFTLENS 的发现对 Mem0 的用户画像记忆系统尤其相关——用户属性记忆可能引发推理漂移 |
| **Letta** | HOLA 的海马体机制与 Letta 的记忆管理理念互补，可为 Agent 提供更精确的长期事实存储 |
| **Zep** | AgenticSTS 的类型化检索合约与 Zep 的结构化记忆存储方案目标一致 |
| **Cognosys** | Grounded Research 的磁盘状态共享是 Cognosys 跨会话状态管理的工程实现参考 |
| **AutoGen** | Persistent-State 攻击研究对 AutoGen 多 Agent 协作中的状态共享安全有直接启示 |
| **其他项目 (CrewAI/ camel /camel /AgentLens 等)** | 有界记忆合约的消融实验方法可应用于评估各框架的记忆层有效性 |

---

## 📊 总结

今日 cs.AI 共筛选出 **6 篇** 与 Agent Memory 高度相关的论文，覆盖**架构设计、安全评估、推理增强和测试基准**四个维度。

**最值得关注的论文：**
1. 🏆 **HOLA** — 认知科学启发的模型级记忆架构，效果显著
2. 🥈 **DRIFTLENS** — 首次系统量化记忆对推理的副作用，开辟新方向
3. 🥉 **AgenticSTS** — 提供可复用的长时域 Agent 记忆测试方法论

---

*本报告由 OpenClaw 自动生成，数据来源：[papers.cool/arxiv/cs.AI](https://papers.cool/arxiv/cs.AI)*
