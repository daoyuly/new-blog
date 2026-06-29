---
title: Agent Memory arXiv 日报 (2026-06-28)
tags:
  - agent-memory
  - arxiv
  - LLM
  - RAG
  - episodic-memory
  - experience-learning
categories:
  - Agent Memory 研究
abbrlink: 41813
date: 2026-06-28 18:00:00
---

# Agent Memory arXiv 日报 — 2026年6月28日

> 每日追踪 arXiv 上与 Agent Memory 相关的最新论文，聚焦记忆增强、经验学习、检索增强等方向。

---

## 📋 今日相关论文

### 1. Joint Learning of Experiential Rules and Policies for LLM Agents (JERP)

- **arXiv ID:** 2606.27136
- **链接:** [https://arxiv.org/abs/2606.27136](https://arxiv.org/abs/2606.27136) [Kimi解读](http://kimi.com/_prefill_chat?prefill_prompt=%E6%88%91%E4%BB%AC%E8%A6%81%E8%AE%A8%E8%AE%BA%E7%9A%84%E8%AE%BA%E6%96%87%E6%98%AFhttps%3A%2F%2Farxiv.org%2Fabs%2F2606.27136%EF%BC%8C%E9%93%BE%E6%8E%A5%E6%98%AF+https%3A%2F%2Farxiv.org%2Fpdf%2F2606.27136+%EF%BC%8C%E5%B7%B2%E6%9C%89%E7%9A%84FAQ%E9%93%BE%E6%8E%A5%E6%98%AF+https%3A%2F%2Fpapers.cool%2Farxiv%2Fkimi%3Fpaper%3D2606.27136+%E3%80%82%E8%AF%B7%E4%BB%A5%E6%AD%A4%E4%B8%BA%E5%9F%BA%E7%A1%80%EF%BC%8C%E7%BB%A7%E7%BB%AD%E5%9B%9E%E7%AD%94%E6%88%91%E5%90%8E%E9%9D%A2%E7%9A%84%E9%97%AE%E9%A2%98%E3%80%82&system_prompt=%E4%BD%A0%E6%98%AF%E4%B8%80%E4%B8%AA%E5%AD%A6%E6%9C%AF%E5%8A%A9%E6%89%8B%EF%BC%8C%E5%90%8E%E9%9D%A2%E7%9A%84%E5%AF%B9%E8%AF%9D%E5%B0%86%E5%9B%B4%E7%BB%95%E7%9D%80%E4%BB%A5%E4%B8%8B%E8%AE%BA%E6%96%87%E5%86%85%E5%AE%B9%E8%BF%9B%E8%A1%8C%EF%BC%8C%E5%B7%B2%E7%BB%8F%E9%80%9A%E8%BF%87%E9%93%BE%E6%8E%A5%E7%BB%99%E5%87%BA%E4%BA%86%E8%AE%BA%E6%96%87%E7%9A%84PDF%E5%92%8C%E8%AE%BA%E6%96%87%E5%B7%B2%E6%9C%89%E7%9A%84FAQ%E3%80%82%E7%94%A8%E6%88%B7%E5%B0%86%E7%BB%A7%E7%BB%AD%E5%90%91%E4%BD%A0%E5%92%A8%E8%AF%A2%E8%AE%BA%E6%96%87%E7%9A%84%E7%9B%B8%E5%85%B3%E9%97%AE%E9%A2%98%EF%BC%8C%E8%AF%B7%E4%BD%A0%E4%BD%9C%E5%87%BA%E4%B8%93%E4%B8%9A%E7%9A%84%E5%9B%9E%E7%AD%94%EF%BC%8C%E4%B8%8D%E8%A6%81%E5%87%BA%E7%8E%B0%E7%AC%AC%E4%B8%80%E4%BA%BA%E7%A7%B0%EF%BC%8C%E5%BD%93%E6%B6%89%E5%8F%8A%E5%88%B0%E5%88%86%E7%82%B9%E5%9B%9E%E7%AD%94%E6%97%B6%EF%BC%8C%E9%BC%93%E5%8A%B1%E4%BD%A0%E4%BB%A5markdown%E6%A0%BC%E5%BC%8F%E8%BE%93%E5%87%BA%E3%80%82&send_immediately=true)
- **作者:** Shicheng Ye, Chao Yu
- **关键词:** 经验规则、长期记忆、策略学习、交互经验

**摘要要点：**

JERP 提出联合学习「经验规则池」与「策略」的框架。核心思想：从同一组交互轨迹中同时更新长期经验规则库和模型策略。决策时检索任务相关规则并注入上下文；每轮结束后，用轨迹同时优化策略并修订规则池（通过与参考成功轨迹对比）。这种耦合机制保证规则池与演化策略同步，同时稳定有效的行为逐步被吸收到模型参数中。在 AlfWorld 和 WebShop 上取得一致提升。

**记忆视角分析：**
- **Write:** 每轮交互后写入，比较当前轨迹与成功参考轨迹，修订规则
- **Store:** 自然语言规则池（可解释的外挂记忆）
- **Recall:** 按任务相关性检索规则
- **Reason:** 规则注入 agent 上下文，影响决策
- **能力层级:** L3（结构化经验规则 + 可更新）

---

### 2. Empowering GUI Agents via Autonomous Experience Exploration and Hindsight Experience Utilization (PEEU)

- **arXiv ID:** 2606.27330
- **链接:** [https://arxiv.org/abs/2606.27330](https://arxiv.org/abs/2606.27330) [Kimi解读](http://kimi.com/_prefill_chat?prefill_prompt=%E6%88%91%E4%BB%AC%E8%A6%81%E8%AE%A8%E8%AE%BA%E7%9A%84%E8%AE%BA%E6%96%87%E6%98%AFhttps%3A%2F%2Farxiv.org%2Fabs%2F2606.27330%EF%BC%8C%E9%93%BE%E6%8E%A5%E6%98%AF+https%3A%2F%2Farxiv.org%2Fpdf%2F2606.27330+%EF%BC%8C%E5%B7%B2%E6%9C%89%E7%9A%84FAQ%E9%93%BE%E6%8E%A5%E6%98%AF+https%3A%2F%2Fpapers.cool%2Farxiv%2Fkimi%3Fpaper%3D2606.27330+%E3%80%82%E8%AF%B7%E4%BB%A5%E6%AD%A4%E4%B8%BA%E5%9F%BA%E7%A1%80%EF%BC%8C%E7%BB%A7%E7%BB%AD%E5%9B%9E%E7%AD%94%E6%88%91%E5%90%8E%E9%9D%A2%E7%9A%84%E9%97%AE%E9%A2%98%E3%80%82&system_prompt=%E4%BD%A0%E6%98%AF%E4%B8%80%E4%B8%AA%E5%AD%A6%E6%9C%AF%E5%8A%A9%E6%89%8B%EF%BC%8C%E5%90%8E%E9%9D%A2%E7%9A%84%E5%AF%B9%E8%AF%9D%E5%B0%86%E5%9B%B4%E7%BB%95%E7%9D%80%E4%BB%A5%E4%B8%8B%E8%AE%BA%E6%96%87%E5%86%85%E5%AE%B9%E8%BF%9B%E8%A1%8C%EF%BC%8C%E5%B7%B2%E7%BB%8F%E9%80%9A%E8%BF%87%E9%93%BE%E6%8E%A5%E7%BB%99%E5%87%BA%E4%BA%86%E8%AE%BA%E6%96%87%E7%9A%84PDF%E5%92%8C%E8%AE%BA%E6%96%87%E5%B7%B2%E6%9C%89%E7%9A%84FAQ%E3%80%82%E7%94%A8%E6%88%B7%E5%B0%86%E7%BB%A7%E7%BB%AD%E5%90%91%E4%BD%A0%E5%92%A8%E8%AF%A2%E8%AE%BA%E6%96%87%E7%9A%84%E7%9B%B8%E5%85%B3%E9%97%AE%E9%A2%98%EF%BC%8C%E8%AF%B7%E4%BD%A0%E4%BD%9C%E5%87%BA%E4%B8%93%E4%B8%9A%E7%9A%84%E5%9B%9E%E7%AD%94%EF%BC%8C%E4%B8%8D%E8%A6%81%E5%87%BA%E7%8E%B0%E7%AC%AC%E4%B8%80%E4%BA%BA%E7%A7%B0%EF%BC%8C%E5%BD%93%E6%B6%89%E5%8F%8A%E5%88%B0%E5%88%86%E7%82%B9%E5%9B%9E%E7%AD%94%E6%97%B6%EF%BC%8C%E9%BC%93%E5%8A%B1%E4%BD%A0%E4%BB%A5markdown%E6%A0%BC%E5%BC%8F%E8%BE%93%E5%87%BA%E3%80%82&send_immediately=true)
- **作者:** Tianyi Men, Zhuoran Jin, Pengfei Cao, Yubo Chen, Kang Liu, Jun Zhao
- **关键词:** GUI Agent、经验探索、事后经验利用、任务规划

**摘要要点：**

PEEU 方法让小模型 MLLM 自主探索环境发现经验，并利用「事后经验」合成严格对齐的高层训练数据。提出 TDHAF 分析框架，揭示：掌握低层原子技能不保证高层规划能力，而高层任务训练带来更强的 OOD 泛化。7B 模型达到 30.6% 准确率，超过 Qwen2.5-VL-32B。

**记忆视角分析：**
- **Write:** 自主探索写入交互经验，事后合成高层任务描述
- **Store:** 经验轨迹 + 事后总结
- **Recall:** 利用 hindsight experience 进行任务规划
- **Reason:** 经验直接参与高层任务分解和规划
- **能力层级:** L3→L4（经验参与规划和泛化）

---

### 3. Semantic Early-Stopping for Iterative LLM Agent Loops

- **arXiv ID:** 2606.27009
- **链接:** [https://arxiv.org/abs/2606.27009](https://arxiv.org/abs/2606.27009) [Kimi解读](http://kimi.com/_prefill_chat?prefill_prompt=%E6%88%91%E4%BB%AC%E8%A6%81%E8%AE%A8%E8%AE%BA%E7%9A%84%E8%AE%BA%E6%96%87%E6%98%AFhttps%3A%2F%2Farxiv.org%2Fabs%2F2606.27009%EF%BC%8C%E9%93%BE%E6%8E%A5%E6%98%AF+https%3A%2F%2Farxiv.org%2Fpdf%2F2606.27009+%EF%BC%8C%E5%B7%B2%E6%9C%89%E7%9A%84FAQ%E9%93%BE%E6%8E%A5%E6%98%AF+https%3A%2F%2Fpapers.cool%2Farxiv%2Fkimi%3Fpaper%3D2606.27009+%E3%80%82%E8%AF%B7%E4%BB%A5%E6%AD%A4%E4%B8%BA%E5%9F%BA%E7%A1%80%EF%BC%8C%E7%BB%A7%E7%BB%AD%E5%9B%9E%E7%AD%94%E6%88%91%E5%90%8E%E9%9D%A2%E7%9A%84%E9%97%AE%E9%A2%98%E3%80%82&system_prompt=%E4%BD%A0%E6%98%AF%E4%B8%80%E4%B8%AA%E5%AD%A6%E6%9C%AF%E5%8A%A9%E6%89%8B%EF%BC%8C%E5%90%8E%E9%9D%A2%E7%9A%84%E5%AF%B9%E8%AF%9D%E5%B0%86%E5%9B%B4%E7%BB%95%E7%9D%80%E4%BB%A5%E4%B8%8B%E8%AE%BA%E6%96%87%E5%86%85%E5%AE%B9%E8%BF%9B%E8%A1%8C%EF%BC%8C%E5%B7%B2%E7%BB%8F%E9%80%9A%E8%BF%87%E9%93%BE%E6%8E%A5%E7%BB%99%E5%87%BA%E4%BA%86%E8%AE%BA%E6%96%87%E7%9A%84PDF%E5%92%8C%E8%AE%BA%E6%96%87%E5%B7%B2%E6%9C%89%E7%9A%84FAQ%E3%80%82%E7%94%A8%E6%88%B7%E5%B0%86%E7%BB%A7%E7%BB%AD%E5%90%91%E4%BD%A0%E5%92%A8%E8%AF%A2%E8%AE%BA%E6%96%87%E7%9A%84%E7%9B%B8%E5%85%B3%E9%97%AE%E9%A2%98%EF%BC%8C%E8%AF%B7%E4%BD%A0%E4%BD%9C%E5%87%BA%E4%B8%93%E4%B8%9A%E7%9A%84%E5%9B%9E%E7%AD%94%EF%BC%8C%E4%B8%8D%E8%A6%81%E5%87%BA%E7%8E%B0%E7%AC%AC%E4%B8%80%E4%BA%BA%E7%A7%B0%EF%BC%8C%E5%BD%93%E6%B6%89%E5%8F%8A%E5%88%B0%E5%88%86%E7%82%B9%E5%9B%9E%E7%AD%94%E6%97%B6%EF%BC%8C%E9%BC%93%E5%8A%B1%E4%BD%A0%E4%BB%A5markdown%E6%A0%BC%E5%BC%8F%E8%BE%93%E5%87%BA%E3%80%82&send_immediately=true)
- **作者:** Sahil Shrivastava
- **关键词:** Multi-Agent Loop、语义早停、RAG、迭代推理

**摘要要点：**

研究多 Agent 迭代循环的语义早停策略。当连续 draft 的嵌入语义距离不再变化（cosine distance + patience window）且质量停止提升时停止循环。在 HotpotQA（多跳 RAG 问答）上，无 judge 的语义停止器减少 38% 运算 token，质量持平。关键发现：问题不是「何时停止」（简单），而是「哪轮最优」（开放问题）。

**记忆视角分析：**
- 间接相关：涉及 RAG 场景中迭代检索-推理循环的效率优化
- 对 RAG Agent 的记忆检索轮次控制有参考价值

---

### 4. CARVE: Content-Aware Recurrent with Value Efficiency for Chunk-Parallel Linear Attention

- **arXiv ID:** 2606.27229
- **链接:** [https://arxiv.org/abs/2606.27229](https://arxiv.org/abs/2606.27229) [Kimi解读](http://kimi.com/_prefill_chat?prefill_prompt=%E6%88%91%E4%BB%AC%E8%A6%81%E8%AE%A8%E8%AE%BA%E7%9A%84%E8%AE%BA%E6%96%87%E6%98%AFhttps%3A%2F%2Farxiv.org%2Fabs%2F2606.27229%EF%BC%8C%E9%93%BE%E6%8E%A5%E6%98%AF+https%3A%2F%2Farxiv.org%2Fpdf%2F2606.27229+%EF%BC%8C%E5%B7%B2%E6%9C%89%E7%9A%84FAQ%E9%93%BE%E6%8E%A5%E6%98%AF+https%3A%2F%2Fpapers.cool%2Farxiv%2Fkimi%3Fpaper%3D2606.27229+%E3%80%82%E8%AF%B7%E4%BB%A5%E6%AD%A4%E4%B8%BA%E5%9F%BA%E7%A1%80%EF%BC%8C%E7%BB%A7%E7%BB%AD%E5%9B%9E%E7%AD%94%E6%88%91%E5%90%8E%E9%9D%A2%E7%9A%84%E9%97%AE%E9%A2%98%E3%80%82&system_prompt=%E4%BD%A0%E6%98%AF%E4%B8%80%E4%B8%AA%E5%AD%A6%E6%9C%AF%E5%8A%A9%E6%89%8B%EF%BC%8C%E5%90%8E%E9%9D%A2%E7%9A%84%E5%AF%B9%E8%AF%9D%E5%B0%86%E5%9B%B4%E7%BB%95%E7%9D%80%E4%BB%A5%E4%B8%8B%E8%AE%BA%E6%96%87%E5%86%85%E5%AE%B9%E8%BF%9B%E8%A1%8C%EF%BC%8C%E5%B7%B2%E7%BB%8F%E9%80%9A%E8%BF%87%E9%93%BE%E6%8E%A5%E7%BB%99%E5%87%BA%E4%BA%86%E8%AE%BA%E6%96%87%E7%9A%84PDF%E5%92%8C%E8%AE%BA%E6%96%87%E5%B7%B2%E6%9C%89%E7%9A%84FAQ%E3%80%82%E7%94%A8%E6%88%B7%E5%B0%86%E7%BB%A7%E7%BB%AD%E5%90%91%E4%BD%A0%E5%92%A8%E8%AF%A2%E8%AE%BA%E6%96%87%E7%9A%84%E7%9B%B8%E5%85%B3%E9%97%AE%E9%A2%98%EF%BC%8C%E8%AF%B7%E4%BD%A0%E4%BD%9C%E5%87%BA%E4%B8%93%E4%B8%9A%E7%9A%84%E5%9B%9E%E7%AD%94%EF%BC%8C%E4%B8%8D%E8%A6%81%E5%87%BA%E7%8E%B0%E7%AC%AC%E4%B8%80%E4%BA%BA%E7%A7%B0%EF%BC%8C%E5%BD%93%E6%B6%89%E5%8F%8A%E5%88%B0%E5%88%86%E7%82%B9%E5%9B%9E%E7%AD%94%E6%97%B6%EF%BC%8C%E9%BC%93%E5%8A%B1%E4%BD%A0%E4%BB%A5markdown%E6%A0%BC%E5%BC%8F%E8%BE%93%E5%87%BA%E3%80%82&send_immediately=true)
- **作者:** Sayak Dutta
- **关键词:** 循环记忆、线性注意力、内容感知门控

**摘要要点：**

CARVE 解决循环模型中「擦除时不看已存储内容」的缺陷。核心：只在 key 轴擦除，复用 recurrent output tensor 作为内容信号给 erase gate。1.3B 参数训练 100B token，在 RULER 检索探针上全面 SOTA。

**记忆视角分析：**
- 模型架构层面的记忆改进：循环状态 = 连续记忆
- 「内容感知门控」类比 Agent Memory 的「写入前检查已有记忆」
- 对 Agent Memory 的底层架构设计有启发

---

### 5. Where Do CoT Training Gains Land in LLM-based Agents?

- **arXiv ID:** 2606.26935
- **链接:** [https://arxiv.org/abs/2606.26935](https://arxiv.org/abs/2606.26935) [Kimi解读](http://kimi.com/_prefill_chat?prefill_prompt=%E6%88%91%E4%BB%AC%E8%A6%81%E8%AE%A8%E8%AE%BA%E7%9A%84%E8%AE%BA%E6%96%87%E6%98%AFhttps%3A%2F%2Farxiv.org%2Fabs%2F2606.26935%EF%BC%8C%E9%93%BE%E6%8E%A5%E6%98%AF+https%3A%2F%2Farxiv.org%2Fpdf%2F2606.26935+%EF%BC%8C%E5%B7%B2%E6%9C%89%E7%9A%84FAQ%E9%93%BE%E6%8E%A5%E6%98%AF+https%3A%2F%2Fpapers.cool%2Farxiv%2Fkimi%3Fpaper%3D2606.26935+%E3%80%82%E8%AF%B7%E4%BB%A5%E6%AD%A4%E4%B8%BA%E5%9F%BA%E7%A1%80%EF%BC%8C%E7%BB%A7%E7%BB%AD%E5%9B%9E%E7%AD%94%E6%88%91%E5%90%8E%E9%9D%A2%E7%9A%84%E9%97%AE%E9%A2%98%E3%80%82&system_prompt=%E4%BD%A0%E6%98%AF%E4%B8%80%E4%B8%AA%E5%AD%A6%E6%9C%AF%E5%8A%A9%E6%89%8B%EF%BC%8C%E5%90%8E%E9%9D%A2%E7%9A%84%E5%AF%B9%E8%AF%9D%E5%B0%86%E5%9B%B4%E7%BB%95%E7%9D%80%E4%BB%A5%E4%B8%8B%E8%AE%BA%E6%96%87%E5%86%85%E5%AE%B9%E8%BF%9B%E8%A1%8C%EF%BC%8C%E5%B7%B2%E7%BB%8F%E9%80%9A%E8%BF%87%E9%93%BE%E6%8E%A5%E7%BB%99%E5%87%BA%E4%BA%86%E8%AE%BA%E6%96%87%E7%9A%84PDF%E5%92%8C%E8%AE%BA%E6%96%87%E5%B7%B2%E6%9C%89%E7%9A%84FAQ%E3%80%82%E7%94%A8%E6%88%B7%E5%B0%86%E7%BB%A7%E7%BB%AD%E5%90%91%E4%BD%A0%E5%92%A8%E8%AF%A2%E8%AE%BA%E6%96%87%E7%9A%84%E7%9B%B8%E5%85%B3%E9%97%AE%E9%A2%98%EF%BC%8C%E8%AF%B7%E4%BD%A0%E4%BD%9C%E5%87%BA%E4%B8%93%E4%B8%9A%E7%9A%84%E5%9B%9E%E7%AD%94%EF%BC%8C%E4%B8%8D%E8%A6%81%E5%87%BA%E7%8E%B0%E7%AC%AC%E4%B8%80%E4%BA%BA%E7%A7%B0%EF%BC%8C%E5%BD%93%E6%B6%89%E5%8F%8A%E5%88%B0%E5%88%86%E7%82%B9%E5%9B%9E%E7%AD%94%E6%97%B6%EF%BC%8C%E9%BC%93%E5%8A%B1%E4%BD%A0%E4%BB%A5markdown%E6%A0%BC%E5%BC%8F%E8%BE%93%E5%87%BA%E3%80%82&send_immediately=true)
- **作者:** Jingyu Liu, Zhiwen Wang, Yuxin Jing, Huanyu Zhou, Yong Liu
- **关键词:** CoT 推理、Agent 训练、隐式记忆

**摘要要点：**

揭示 CoT 训练对 Agent 的实际增益不在「推理改变行为」，而在「提升 prompt 直接预测动作的质量」。后期 checkpoint 更依赖 prompt 而非 CoT 修订动作。选择性遮蔽 action token 监督可提升 OOD 泛化。

**记忆视角分析：**
- CoT 作为「工作记忆」的反思能力被高估
- 模型倾向将行为「内化」为参数记忆（隐式记忆），而非依赖显式推理链
- 对 Agent Memory 设计的启示：显式记忆与隐式记忆的平衡

---

### 6. Diagnosing Task Insensitivity in Language Agents

- **arXiv ID:** 2606.26918
- **链接:** [https://arxiv.org/abs/2606.26918](https://arxiv.org/abs/2606.26918) [Kimi解读](http://kimi.com/_prefill_chat?prefill_prompt=%E6%88%91%E4%BB%AC%E8%A6%81%E8%AE%A8%E8%AE%BA%E7%9A%84%E8%AE%BA%E6%96%87%E6%98%AFhttps%3A%2F%2Farxiv.org%2Fabs%2F2606.26918%EF%BC%8C%E9%93%BE%E6%8E%A5%E6%98%AF+https%3A%2F%2Farxiv.org%2Fpdf%2F2606.26918+%EF%BC%8C%E5%B7%B2%E6%9C%89%E7%9A%84FAQ%E9%93%BE%E6%8E%A5%E6%98%AF+https%3A%2F%2Fpapers.cool%2Farxiv%2Fkimi%3Fpaper%3D2606.26918+%E3%80%82%E8%AF%B7%E4%BB%A5%E6%AD%A4%E4%B8%BA%E5%9F%BA%E7%A1%80%EF%BC%8C%E7%BB%A7%E7%BB%AD%E5%9B%9E%E7%AD%94%E6%88%91%E5%90%8E%E9%9D%A2%E7%9A%84%E9%97%AE%E9%A2%98%E3%80%82&system_prompt=%E4%BD%A0%E6%98%AF%E4%B8%80%E4%B8%AA%E5%AD%A6%E6%9C%AF%E5%8A%A9%E6%89%8B%EF%BC%8C%E5%90%8E%E9%9D%A2%E7%9A%84%E5%AF%B9%E8%AF%9D%E5%B0%86%E5%9B%B4%E7%BB%95%E7%9D%80%E4%BB%A5%E4%B8%8B%E8%AE%BA%E6%96%87%E5%86%85%E5%AE%B9%E8%BF%9B%E8%A1%8C%EF%BC%8C%E5%B7%B2%E7%BB%8F%E9%80%9A%E8%BF%87%E9%93%BE%E6%8E%A5%E7%BB%99%E5%87%BA%E4%BA%86%E8%AE%BA%E6%96%87%E7%9A%84PDF%E5%92%8C%E8%AE%BA%E6%96%87%E5%B7%B2%E6%9C%89%E7%9A%84FAQ%E3%80%82%E7%94%A8%E6%88%B7%E5%B0%86%E7%BB%A7%E7%BB%AD%E5%90%91%E4%BD%A0%E5%92%A8%E8%AF%A2%E8%AE%BA%E6%96%87%E7%9A%84%E7%9B%B8%E5%85%B3%E9%97%AE%E9%A2%98%EF%BC%8C%E8%AF%B7%E4%BD%A0%E4%BD%9C%E5%87%BA%E4%B8%93%E4%B8%9A%E7%9A%84%E5%9B%9E%E7%AD%94%EF%BC%8C%E4%B8%8D%E8%A6%81%E5%87%BA%E7%8E%B0%E7%AC%AC%E4%B8%80%E4%BA%BA%E7%A7%B0%EF%BC%8C%E5%BD%93%E6%B6%89%E5%8F%8A%E5%88%B0%E5%88%86%E7%82%B9%E5%9B%9E%E7%AD%94%E6%97%B6%EF%BC%8C%E9%BC%93%E5%8A%B1%E4%BD%A0%E4%BB%A5markdown%E6%A0%BC%E5%BC%8F%E8%BE%93%E5%87%BA%E3%80%82&send_immediately=true)
- **作者:** Jingyu Liu, Xiaopeng Wu, Kehan Chen, Chuan Yu, Yong Liu
- **关键词:** 任务不敏感、OOD 泛化、注意力漂移

**摘要要点：**

Agent 面对相似但不同的任务时，继续执行原任务动作（任务不敏感）。训练时注意力从任务 token 漂移到局部观测，优化偏向捷径。提出 Task-Perturbed NLL 对比正则化。

**记忆视角分析：**
- 注意力漂移本质是「记忆过拟合」：模型将训练模式固化，忽略新指令
- 与 Agent Memory 中「记忆污染/旧记忆干扰新任务」问题同源

---

## 📊 研究趋势分析

### 本日热点方向

| 方向 | 论文数 | 代表作 |
|------|--------|--------|
| **经验学习与规则提取** | 2 | JERP, PEEU |
| **Agent 训练与推理机制** | 2 | CoT Gains, Task Insensitivity |
| **循环/持续记忆架构** | 1 | CARVE |
| **多 Agent 循环效率** | 1 | Semantic Early-Stopping |

### 趋势洞察

1. **「经验规则池 + 策略参数」双轨学习成为新范式**：JERP 的核心贡献在于将外挂记忆（规则池）与内化记忆（模型参数）同步更新，而非二选一。这呼应了此前 Agent Memory 研究中 L2（RAG）与 L3（语义记忆）的融合趋势。

2. **Hindsight Experience 回归**：PEEU 的「事后经验利用」与强化学习中的 Hindsight Experience Replay (HER) 思路一致，但在 LLM Agent 场景下赋予了新含义——从失败轨迹中反推成功的高层任务描述。

3. **显式 vs 隐式记忆的张力**：CoT Gains 论文表明模型倾向将经验内化为参数而非依赖显式推理链，这与 JERP 的「外挂规则 + 参数更新」双轨形成有趣对照。

4. **内容感知门控**：CARVE 的「写入前先看已存内容」原则，对 Agent Memory 设计有直接启发——记忆更新不应盲目覆盖。

---

## 🔑 关键洞察与创新点

1. **JERP 的规则-策略对齐机制**：规则池与策略从同一轨迹更新，避免规则漂移。这解决了 ExpeL、Reflexion 等框架中「规则与策略脱节」的结构性问题。

2. **PEEU 的层级泛化发现**：低层技能掌握 ≠ 高层规划能力，直接训练高层任务反而泛化更好。对 Agent Memory 的启示：记忆的组织粒度影响泛化。

3. **语义早停的实际价值**：38% token 节省，质量持平。对 RAG Agent 的多轮检索记忆场景有直接应用价值。

4. **任务不敏感 = 注意力漂移**：训练时注意力从任务 token 漂向局部观测，本质是记忆过拟合。Agent Memory 需要考虑「任务隔离」机制。

---

## 🔗 与 19 个开源记忆项目的关联

| 论文 | 关联项目 | 关联分析 |
|------|----------|----------|
| JERP | **ExpeL, Reflexion, LangChain** | JERP 的规则池与 ExpeL 的经验桶相似，但增加了策略同步更新机制；LangChain 的 ConversationBufferMemory 缺乏 JERP 式的规则-策略对齐 |
| PEEU | **AutoGPT, BabyAGI** | PEEU 的自主经验探索是 AutoGPT 自动执行模式的学术化表达，但增加了事后经验合成与层级分析 |
| CARVE | **MemGPT/Letta** | CARVE 的内容感知门控与 MemGPT 的记忆管理（写入前检索已有记忆）理念一致，但 CARVE 在模型架构层面实现 |
| CoT Gains | **CrewAI, AutoGen** | 多 Agent 协作中 CoT 的价值需要重新评估——显式推理链可能不如 prompt 工程有效 |
| Task Insensitivity | **所有框架** | 通用问题：记忆过拟合导致任务不敏感。需要类似 Task-Perturbed NLL 的「记忆遗忘/去偏」机制 |
| Semantic Early-Stopping | **RAG-based 框架** | 对 LlamaIndex、LangChain RAG chain 的迭代检索次数控制有参考价值 |

### 统一认知模型映射

基于 Agent Memory Analyzer 的 L1-L4 能力层级：

| 论文 | Write | Store | Recall | Reason | 层级 |
|------|-------|-------|--------|--------|------|
| JERP | 轨迹对比修订 | 自然语言规则池 | 任务相关检索 | 规则注入上下文影响决策 | **L3** |
| PEEU | 自主探索 + 事后合成 | 轨迹 + 高层任务 | Hindsight 经验利用 | 经验参与任务规划 | **L3→L4** |
| CARVE | 内容感知门控写入 | 循环隐藏状态 | 线性注意力检索 | 状态直接参与推理 | **L2**（架构级） |
| CoT Gains | 训练隐式内化 | 模型参数 | 直接 prompt 预测 | 内化经验影响动作 | **L1→L2** |
| Task Insensitivity | 训练固化 | 参数记忆 | 注意力偏向局部 | 忽略任务指令 | **L1**（退化） |

---

## 📝 今日总结

今日 cs.AI + cs.CL 上直接与 Agent Memory 相关的论文共 **6 篇**，其中：

- **强相关**（核心记忆机制）：JERP、PEEU
- **中等相关**（间接涉及记忆/经验）：CARVE、Semantic Early-Stopping
- **背景相关**（训练与泛化洞察）：CoT Gains、Task Insensitivity

**最重要的信号**：「外挂规则 + 参数更新」双轨学习（JERP）和「事后经验利用」（PEEU）代表了 Agent Memory 从被动存储检索向主动经验学习的演进方向。这与我们此前分析的 19 个开源项目中，ExpeL、Reflexion 等的思路一脉相承，但解决了规则漂移和经验利用率低的结构性问题。

---

*本报告由 [来顺🎋](https://www.daoyuly.cn) 自动生成，每日 18:00 更新。*
*数据来源：[papers.cool/arxiv](https://papers.cool/arxiv/cs.AI)*
