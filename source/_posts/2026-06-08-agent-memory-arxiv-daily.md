---
title: Agent Memory arXiv 日报 (2026-06-08)
date: '2026-06-08 18:00:00 +0800'
tags:
  - agent
  - memory
  - LLM
  - arxiv
  - daily-report
categories: [Agent Memory 研究]
  - Agent Memory 研究
  - Agent Memory
  - 论文日报
abbrlink: 25588
noindex: true
---

## 今日 Agent Memory 相关论文

从 [papers.cool/arxiv/cs.AI](https://papers.cool/arxiv/cs.AI) 2026-06-05 批次中筛选出以下与 Agent Memory、经验学习、技能提取相关的论文。

---

### 🌟 核心论文

#### 1. AdMem: Advanced Memory for Task-solving Agents

- **arXiv ID:** 2606.06787
- **链接:** [arxiv.org/abs/2606.06787](https://arxiv.org/abs/2606.06787) [Kimi解读](http://kimi.com/_prefill_chat?prefill_prompt=%E6%88%91%E4%BB%AC%E8%A6%81%E8%AE%A8%E8%AE%BA%E7%9A%84%E8%AE%BA%E6%96%87%E6%98%AFarxiv.org%2Fabs%2F2606.06787%EF%BC%8C%E9%93%BE%E6%8E%A5%E6%98%AF+https%3A%2F%2Farxiv.org%2Fpdf%2F2606.06787+%EF%BC%8C%E5%B7%B2%E6%9C%89%E7%9A%84FAQ%E9%93%BE%E6%8E%A5%E6%98%AF+https%3A%2F%2Fpapers.cool%2Farxiv%2Fkimi%3Fpaper%3D2606.06787+%E3%80%82%E8%AF%B7%E4%BB%A5%E6%AD%A4%E4%B8%BA%E5%9F%BA%E7%A1%80%EF%BC%8C%E7%BB%A7%E7%BB%AD%E5%9B%9E%E7%AD%94%E6%88%91%E5%90%8E%E9%9D%A2%E7%9A%84%E9%97%AE%E9%A2%98%E3%80%82&system_prompt=%E4%BD%A0%E6%98%AF%E4%B8%80%E4%B8%AA%E5%AD%A6%E6%9C%AF%E5%8A%A9%E6%89%8B%EF%BC%8C%E5%90%8E%E9%9D%A2%E7%9A%84%E5%AF%B9%E8%AF%9D%E5%B0%86%E5%9B%B4%E7%BB%95%E7%9D%80%E4%BB%A5%E4%B8%8B%E8%AE%BA%E6%96%87%E5%86%85%E5%AE%B9%E8%BF%9B%E8%A1%8C%EF%BC%8C%E5%B7%B2%E7%BB%8F%E9%80%9A%E8%BF%87%E9%93%BE%E6%8E%A5%E7%BB%99%E5%87%BA%E4%BA%86%E8%AE%BA%E6%96%87%E7%9A%84PDF%E5%92%8C%E8%AE%BA%E6%96%87%E5%B7%B2%E6%9C%89%E7%9A%84FAQ%E3%80%82%E7%94%A8%E6%88%B7%E5%B0%86%E7%BB%A7%E7%BB%AD%E5%90%91%E4%BD%A0%E5%92%A8%E8%AF%A2%E8%AE%BA%E6%96%87%E7%9A%84%E7%9B%B8%E5%85%B3%E9%97%AE%E9%A2%98%EF%BC%8C%E8%AF%B7%E4%BD%A0%E4%BD%9C%E5%87%BA%E4%B8%93%E4%B8%9A%E7%9A%84%E5%9B%9E%E7%AD%94%EF%BC%8C%E4%B8%8D%E8%A6%81%E5%87%BA%E7%8E%B0%E7%AC%AC%E4%B8%80%E4%BA%BA%E7%A7%B0%EF%BC%8C%E5%BD%93%E6%B6%89%E5%8F%8A%E5%88%B0%E5%88%86%E7%82%B9%E5%9B%9E%E7%AD%94%E6%97%B6%EF%BC%8C%E9%BC%93%E5%8A%B1%E4%BD%A0%E4%BB%A5markdown%E6%A0%BC%E5%BC%8F%E8%BE%93%E5%87%BA%E3%80%82&send_immediately=true)
- **作者:** Runzhe Wang, Huilin Lu, Shengjie Liu, Li Dong, Jason Zhu

**摘要要点：** 提出统一的自动记忆框架，集成语义记忆（Semantic）、情节记忆（Episodic）和程序记忆（Procedural），采用双层设计（短期 + 长期存储）。通过 Actor-Memory-Critic 多智能体架构实现自动记忆生成、奖励标注和自适应检索。长期记忆通过奖励评估、合并和剪枝管理，确保可扩展性和持续改进。

**与开源项目的关联：**
- 🔗 **MemGPT/Letta**：同样采用多层记忆架构，但 AdMem 增加了 Critic Agent 进行奖励标注，自动化程度更高
- 🔗 **LangChain Memory**：AdMem 的语义/情节/程序三分法超越了 LangChain 简单的 buffer/window 机制
- 🔗 **AutoGPT**：AdMem 的自动合并/剪枝解决了 AutoGPT 长期记忆膨胀的问题
- 🔗 **CrewAI**：CrewAI 的记忆系统偏简单，AdMem 的多智能体协作模式提供了更完整的参考

**创新点：**
- 首次将三种记忆类型（语义/情节/程序）统一到自动框架中
- Critic Agent 的奖励标注机制让记忆质量有了可量化的评估标准
- 处理失败案例的能力，突破了"只回放成功经验"的局限

---

#### 2. OpenSkill: Open-World Self-Evolution for LLM Agents

- **arXiv ID:** 2606.06741
- **链接:** [arxiv.org/abs/2606.06741](https://arxiv.org/abs/2606.06741) [Kimi解读](http://kimi.com/_prefill_chat?prefill_prompt=%E6%88%91%E4%BB%AC%E8%A6%81%E8%AE%A8%E8%AE%BA%E7%9A%84%E8%AE%BA%E6%96%87%E6%98%AFarxiv.org%2Fabs%2F2606.06741%EF%BC%8C%E9%93%BE%E6%8E%A5%E6%98%AF+https%3A%2F%2Farxiv.org%2Fpdf%2F2606.06741+%EF%BC%8C%E5%B7%B2%E6%9C%89%E7%9A%84FAQ%E9%93%BE%E6%8E%A5%E6%98%AF+https%3A%2F%2Fpapers.cool%2Farxiv%2Fkimi%3Fpaper%3D2606.06741+%E3%80%82%E8%AF%B7%E4%BB%A5%E6%AD%A4%E4%B8%BA%E5%9F%BA%E7%A1%80%EF%BC%8C%E7%BB%A7%E7%BB%AD%E5%9B%9E%E7%AD%94%E6%88%91%E5%90%8E%E9%9D%A2%E7%9A%84%E9%97%AE%E9%A2%98%E3%80%82&system_prompt=%E4%BD%A0%E6%98%AF%E4%B8%80%E4%B8%AA%E5%AD%A6%E6%9C%AF%E5%8A%A9%E6%89%8B%EF%BC%8C%E5%90%8E%E9%9D%A2%E7%9A%84%E5%AF%B9%E8%AF%9D%E5%B0%86%E5%9B%B4%E7%BB%95%E7%9D%80%E4%BB%A5%E4%B8%8B%E8%AE%BA%E6%96%87%E5%86%85%E5%AE%B9%E8%BF%9B%E8%A1%8C%EF%BC%8C%E5%B7%B2%E7%BB%8F%E9%80%9A%E8%BF%87%E9%93%BE%E6%8E%A5%E7%BB%99%E5%87%BA%E4%BA%86%E8%AE%BA%E6%96%87%E7%9A%84PDF%E5%92%8C%E8%AE%BA%E6%96%87%E5%B7%B2%E6%9C%89%E7%9A%84FAQ%E3%80%82%E7%94%A8%E6%88%B7%E5%B0%86%E7%BB%A7%E7%BB%AD%E5%90%91%E4%BD%A0%E5%92%A8%E8%AF%A2%E8%AE%BA%E6%96%87%E7%9A%84%E7%9B%B8%E5%85%B3%E9%97%AE%E9%A2%98%EF%BC%8C%E8%AF%B7%E4%BD%A0%E4%BD%9C%E5%87%BA%E4%B8%93%E4%B8%9A%E7%9A%84%E5%9B%9E%E7%AD%94%EF%BC%8C%E4%B8%8D%E8%A6%81%E5%87%BA%E7%8E%B0%E7%AC%AC%E4%B8%80%E4%BA%BA%E7%A7%B0%EF%BC%8C%E5%BD%93%E6%B6%89%E5%8F%8A%E5%88%B0%E5%88%86%E7%82%B9%E5%9B%9E%E7%AD%94%E6%97%B6%EF%BC%8C%E9%BC%93%E5%8A%B1%E4%BD%A0%E4%BB%A5markdown%E6%A0%BC%E5%BC%8F%E8%BE%93%E5%87%BA%E3%80%82&send_immediately=true)
- **作者:** Zhiling Yan, Dingjie Song, Hanrong Zhang, Wei Liang, Yuxuan Zhang, Yutong Dai, Lifang He, Philip S. Yu, Ran Xu, Xiang Li, Lichao Sun

**摘要要点：** 研究开放世界自演化问题——智能体在只有任务提示、没有监督信号的情况下，从零构建技能和验证信号。OpenSkill 框架利用开放世界资源构建自我验证循环。

**与开源项目的关联：**
- 🔗 **MemGPT**：OpenSkill 的"从零构建技能"与 MemGPT 的自我管理记忆有相似哲学
- 🔗 **AutoGPT / BabyAGI**：将"预设学习循环"推进到"无监督自建学习循环"
- 🔗 **LlamaIndex**：OpenSkill 的技能构建可视为一种程序记忆的自动生成

**创新点：**
- 无需任何目标任务的监督信号，仅靠开放世界资源
- 同时构建技能和验证信号，实现真正的自主进化

---

#### 3. Workflow-to-Skill: Skill Creation via RWSA Decomposition

- **arXiv ID:** 2606.06893
- **链接:** [arxiv.org/abs/2606.06893](https://arxiv.org/abs/2606.06893) [Kimi解读](http://kimi.com/_prefill_chat?prefill_prompt=%E6%88%91%E4%BB%AC%E8%A6%81%E8%AE%A8%E8%AE%BA%E7%9A%84%E8%AE%BA%E6%96%87%E6%98%AFarxiv.org%2Fabs%2F2606.06893%EF%BC%8C%E9%93%BE%E6%8E%A5%E6%98%AF+https%3A%2F%2Farxiv.org%2Fpdf%2F2606.06893+%EF%BC%8C%E5%B7%B2%E6%9C%89%E7%9A%84FAQ%E9%93%BE%E6%8E%A5%E6%98%AF+https%3A%2F%2Fpapers.cool%2Farxiv%2Fkimi%3Fpaper%3D2606.06893+%E3%80%82%E8%AF%B7%E4%BB%A5%E6%AD%A4%E4%B8%BA%E5%9F%BA%E7%A1%80%EF%BC%8C%E7%BB%A7%E7%BB%AD%E5%9B%9E%E7%AD%94%E6%88%91%E5%90%8E%E9%9D%A2%E7%9A%84%E9%97%AE%E9%A2%98%E3%80%82&system_prompt=%E4%BD%A0%E6%98%AF%E4%B8%80%E4%B8%AA%E5%AD%A6%E6%9C%AF%E5%8A%A9%E6%89%8B%EF%BC%8C%E5%90%8E%E9%9D%A2%E7%9A%84%E5%AF%B9%E8%AF%9D%E5%B0%86%E5%9B%B4%E7%BB%95%E7%9D%80%E4%BB%A5%E4%B8%8B%E8%AE%BA%E6%96%87%E5%86%85%E5%AE%B9%E8%BF%9B%E8%A1%8C%EF%BC%8C%E5%B7%B2%E7%BB%8F%E9%80%9A%E8%BF%87%E9%93%BE%E6%8E%A5%E7%BB%99%E5%87%BA%E4%BA%86%E8%AE%BA%E6%96%87%E7%9A%84PDF%E5%92%8C%E8%AE%BA%E6%96%87%E5%B7%B2%E6%9C%89%E7%9A%84FAQ%E3%80%82%E7%94%A8%E6%88%B7%E5%B0%86%E7%BB%A7%E7%BB%AD%E5%90%91%E4%BD%A0%E5%92%A8%E8%AF%A2%E8%AE%BA%E6%96%87%E7%9A%84%E7%9B%B8%E5%85%B3%E9%97%AE%E9%A2%98%EF%BC%8C%E8%AF%B7%E4%BD%A0%E4%BD%9C%E5%87%BA%E4%B8%93%E4%B8%9A%E7%9A%84%E5%9B%9E%E7%AD%94%EF%BC%8C%E4%B8%8D%E8%A6%81%E5%87%BA%E7%8E%B0%E7%AC%AC%E4%B8%80%E4%BA%BA%E7%A7%B0%EF%BC%8C%E5%BD%93%E6%B6%89%E5%8F%8A%E5%88%B0%E5%88%86%E7%82%B9%E5%9B%9E%E7%AD%94%E6%97%B6%EF%BC%8C%E9%BC%93%E5%8A%B1%E4%BD%A0%E4%BB%A5markdown%E6%A0%BC%E5%BC%8F%E8%BE%93%E5%87%BA%E3%80%82&send_immediately=true)
- **作者:** Yuyang Zhang, Xinyuan Han, Xudong Jiang, Run Wang

**摘要要点：** 提出从异构交互证据（演示、轨迹、工具追踪、执行日志）自动构建技能的框架。引入 RWSA 中间表示（Routing-Workflow-Semantics-Attachments），将轨迹视为可执行运行时规范而非可压缩文本。

**与开源项目的关联：**
- 🔗 **LangChain**：技能文件可类比 LangChain 的 Tool/Chain 定义，但更强调从真实轨迹自动提取
- 🔗 **CrewAI**：CrewAI 的技能定义偏静态，W2S 提供了自动化构建路径
- 🔗 **所有框架**：直接关联"程序记忆如何写入"这一核心问题

**创新点：**
- 轨迹→技能不是简单摘要，而是可执行规范的提取
- 保留安全关键行为和置信度标注

---

#### 4. Declarative Skills for AI Agents in Knowledge-Grounded Tool-Use Workflows

- **arXiv ID:** 2606.06923
- **链接:** [arxiv.org/abs/2606.06923](https://arxiv.org/abs/2606.06923) [Kimi解读](http://kimi.com/_prefill_chat?prefill_prompt=%E6%88%91%E4%BB%AC%E8%A6%81%E8%AE%A8%E8%AE%BA%E7%9A%84%E8%AE%BA%E6%96%87%E6%98%AFarxiv.org%2Fabs%2F2606.06923%EF%BC%8C%E9%93%BE%E6%8E%A5%E6%98%AF+https%3A%2F%2Farxiv.org%2Fpdf%2F2606.06923+%EF%BC%8C%E5%B7%B2%E6%9C%89%E7%9A%84FAQ%E9%93%BE%E6%8E%A5%E6%98%AF+https%3A%2F%2Fpapers.cool%2Farxiv%2Fkimi%3Fpaper%3D2606.06923+%E3%80%82%E8%AF%B7%E4%BB%A5%E6%AD%A4%E4%B8%BA%E5%9F%BA%E7%A1%80%EF%BC%8C%E7%BB%A7%E7%BB%AD%E5%9B%9E%E7%AD%94%E6%88%91%E5%90%8E%E9%9D%A2%E7%9A%84%E9%97%AE%E9%A2%98%E3%80%82&system_prompt=%E4%BD%A0%E6%98%AF%E4%B8%80%E4%B8%AA%E5%AD%A6%E6%9C%AF%E5%8A%A9%E6%89%8B%EF%BC%8C%E5%90%8E%E9%9D%A2%E7%9A%84%E5%AF%B9%E8%AF%9D%E5%B0%86%E5%9B%B4%E7%BB%95%E7%9D%80%E4%BB%A5%E4%B8%8B%E8%AE%BA%E6%96%87%E5%86%85%E5%AE%B9%E8%BF%9B%E8%A1%8C%EF%BC%8C%E5%B7%B2%E7%BB%8F%E9%80%9A%E8%BF%87%E9%93%BE%E6%8E%A5%E7%BB%99%E5%87%BA%E4%BA%86%E8%AE%BA%E6%96%87%E7%9A%84PDF%E5%92%8C%E8%AE%BA%E6%96%87%E5%B7%B2%E6%9C%89%E7%9A%84FAQ%E3%80%82%E7%94%A8%E6%88%B7%E5%B0%86%E7%BB%A7%E7%BB%AD%E5%90%91%E4%BD%A0%E5%92%A8%E8%AF%A2%E8%AE%BA%E6%96%87%E7%9A%84%E7%9B%B8%E5%85%B3%E9%97%AE%E9%A2%98%EF%BC%8C%E8%AF%B7%E4%BD%A0%E4%BD%9C%E5%87%BA%E4%B8%93%E4%B8%9A%E7%9A%84%E5%9B%9E%E7%AD%94%EF%BC%8C%E4%B8%8D%E8%A6%81%E5%87%BA%E7%8E%B0%E7%AC%AC%E4%B8%80%E4%BA%BA%E7%A7%B0%EF%BC%8C%E5%BD%93%E6%B6%89%E5%8F%8A%E5%88%B0%E5%88%86%E7%82%B9%E5%9B%9E%E7%AD%94%E6%97%B6%EF%BC%8C%E9%BC%93%E5%8A%B1%E4%BD%A0%E4%BB%A5markdown%E6%A0%BC%E5%BC%8F%E8%BE%93%E5%87%BA%E3%80%82&send_immediately=true)
- **作者:** M. Danish Lim, I. Danial Bin Sharudin, Wen Han Chen, Cedric Lim, Laura Wynter

**摘要要点：** 对比声明式 Agent（通过自然语言技能文件编排）、命令式 Agent（状态机驱动）和无脚手架基线 Agent。关键发现：**检索质量是 Agent 性能的主导瓶颈**——当证据不完整时，所有 Agent 都会显著退化，技能文件无法弥补。

**与开源项目的关联：**
- 🔗 **RAG 系统（LlamaIndex 等）**：直接印证了检索质量是记忆系统的生命线
- 🔗 **MemGPT**：声明式 vs 命令式的对比对 MemGPT 的记忆管理策略有启发
- 🔗 **LangChain**：检索瓶颈的发现对所有基于 RAG 的记忆框架都有警示意义

**创新点：**
- 用 Dec-POMDP 形式化分析三种编排范式
- 实验证明检索质量 > 编排策略，这是很有价值的实证发现

---

### 📎 相关论文

#### 5. DuMate-DeepResearch: Multi-Agent System with Recursive Search

- **arXiv ID:** 2606.07299
- **链接:** [arxiv.org/abs/2606.07299](https://arxiv.org/abs/2606.07299) [Kimi解读](http://kimi.com/_prefill_chat?prefill_prompt=%E6%88%91%E4%BB%AC%E8%A6%81%E8%AE%A8%E8%AE%BA%E7%9A%84%E8%AE%BA%E6%96%87%E6%98%AFarxiv.org%2Fabs%2F2606.07299%EF%BC%8C%E9%93%BE%E6%8E%A5%E6%98%AF+https%3A%2F%2Farxiv.org%2Fpdf%2F2606.07299+%EF%BC%8C%E5%B7%B2%E6%9C%89%E7%9A%84FAQ%E9%93%BE%E6%8E%A5%E6%98%AF+https%3A%2F%2Fpapers.cool%2Farxiv%2Fkimi%3Fpaper%3D2606.07299+%E3%80%82%E8%AF%B7%E4%BB%A5%E6%AD%A4%E4%B8%BA%E5%9F%BA%E7%A1%80%EF%BC%8C%E7%BB%A7%E7%BB%AD%E5%9B%9E%E7%AD%94%E6%88%91%E5%90%8E%E9%9D%A2%E7%9A%84%E9%97%AE%E9%A2%98%E3%80%82&system_prompt=%E4%BD%A0%E6%98%AF%E4%B8%80%E4%B8%AA%E5%AD%A6%E6%9C%AF%E5%8A%A9%E6%89%8B%EF%BC%8C%E5%90%8E%E9%9D%A2%E7%9A%84%E5%AF%B9%E8%AF%9D%E5%B0%86%E5%9B%B4%E7%BB%95%E7%9D%80%E4%BB%A5%E4%B8%8B%E8%AE%BA%E6%96%87%E5%86%85%E5%AE%B9%E8%BF%9B%E8%A1%8C%EF%BC%8C%E5%B7%B2%E7%BB%8F%E9%80%9A%E8%BF%87%E9%93%BE%E6%8E%A5%E7%BB%99%E5%87%BA%E4%BA%86%E8%AE%BA%E6%96%87%E7%9A%84PDF%E5%92%8C%E8%AE%BA%E6%96%87%E5%B7%B2%E6%9C%89%E7%9A%84FAQ%E3%80%82%E7%94%A8%E6%88%B7%E5%B0%86%E7%BB%A7%E7%BB%AD%E5%90%91%E4%BD%A0%E5%92%A8%E8%AF%A2%E8%AE%BA%E6%96%87%E7%9A%84%E7%9B%B8%E5%85%B3%E9%97%AE%E9%A2%98%EF%BC%8C%E8%AF%B7%E4%BD%A0%E4%BD%9C%E5%87%BA%E4%B8%93%E4%B8%9A%E7%9A%84%E5%9B%9E%E7%AD%94%EF%BC%8C%E4%B8%8D%E8%A6%81%E5%87%BA%E7%8E%B0%E7%AC%AC%E4%B8%80%E4%BA%BA%E7%A7%B0%EF%BC%8C%E5%BD%93%E6%B6%89%E5%8F%8A%E5%88%B0%E5%88%86%E7%82%B9%E5%9B%9E%E7%AD%94%E6%97%B6%EF%BC%8C%E9%BC%93%E5%8A%B1%E4%BD%A0%E4%BB%A5markdown%E6%A0%BC%E5%BC%8F%E8%BE%93%E5%87%BA%E3%80%82&send_immediately=true)
- **关联:** 多智能体系统中的信息检索与证据管理，递归搜索子任务委托机制

#### 6. StainFlow: Entity-Stain Tracking for Process Rewards in GUI Agents

- **arXiv ID:** 2606.07027
- **链接:** [arxiv.org/abs/2606.07027](https://arxiv.org/abs/2606.07027) [Kimi解读](http://kimi.com/_prefill_chat?prefill_prompt=%E6%88%91%E4%BB%AC%E8%A6%81%E8%AE%A8%E8%AE%BA%E7%9A%84%E8%AE%BA%E6%96%87%E6%98%AFarxiv.org%2Fabs%2F2606.07027%EF%BC%8C%E9%93%BE%E6%8E%A5%E6%98%AF+https%3A%2F%2Farxiv.org%2Fpdf%2F2606.07027+%EF%BC%8C%E5%B7%B2%E6%9C%89%E7%9A%84FAQ%E9%93%BE%E6%8E%A5%E6%98%AF+https%3A%2F%2Fpapers.cool%2Farxiv%2Fkimi%3Fpaper%3D2606.07027+%E3%80%82%E8%AF%B7%E4%BB%A5%E6%AD%A4%E4%B8%BA%E5%9F%BA%E7%A1%80%EF%BC%8C%E7%BB%A7%E7%BB%AD%E5%9B%9E%E7%AD%94%E6%88%91%E5%90%8E%E9%9D%A2%E7%9A%84%E9%97%AE%E9%A2%98%E3%80%82&system_prompt=%E4%BD%A0%E6%98%AF%E4%B8%80%E4%B8%AA%E5%AD%A6%E6%9C%AF%E5%8A%A9%E6%89%8B%EF%BC%8C%E5%90%8E%E9%9D%A2%E7%9A%84%E5%AF%B9%E8%AF%9D%E5%B0%86%E5%9B%B4%E7%BB%95%E7%9D%80%E4%BB%A5%E4%B8%8B%E8%AE%BA%E6%96%87%E5%86%85%E5%AE%B9%E8%BF%9B%E8%A1%8C%EF%BC%8C%E5%B7%B2%E7%BB%8F%E9%80%9A%E8%BF%87%E9%93%BE%E6%8E%A5%E7%BB%99%E5%87%BA%E4%BA%86%E8%AE%BA%E6%96%87%E7%9A%84PDF%E5%92%8C%E8%AE%BA%E6%96%87%E5%B7%B2%E6%9C%89%E7%9A%84FAQ%E3%80%82%E7%94%A8%E6%88%B7%E5%B0%86%E7%BB%A7%E7%BB%AD%E5%90%91%E4%BD%A0%E5%92%A8%E8%AF%A2%E8%AE%BA%E6%96%87%E7%9A%84%E7%9B%B8%E5%85%B3%E9%97%AE%E9%A2%98%EF%BC%8C%E8%AF%B7%E4%BD%A0%E4%BD%9C%E5%87%BA%E4%B8%93%E4%B8%9A%E7%9A%84%E5%9B%9E%E7%AD%94%EF%BC%8C%E4%B8%8D%E8%A6%81%E5%87%BA%E7%8E%B0%E7%AC%AC%E4%B8%80%E4%BA%BA%E7%A7%B0%EF%BC%8C%E5%BD%93%E6%B6%89%E5%8F%8A%E5%88%B0%E5%88%86%E7%82%B9%E5%9B%9E%E7%AD%94%E6%97%B6%EF%BC%8C%E9%BC%93%E5%8A%B1%E4%BD%A0%E4%BB%A5markdown%E6%A0%BC%E5%BC%8F%E8%BE%93%E5%87%BA%E3%80%82&send_immediately=true)
- **关联:** 轨迹级别的实体状态追踪，可视为一种动态情节记忆机制

---

## 研究趋势分析

### 🔥 热门方向

| 方向 | 趋势 | 代表论文 |
|------|------|----------|
| **统一记忆架构** | 从单一记忆向语义+情节+程序统一发展 | AdMem |
| **技能自动提取** | 从手工编写技能到从轨迹自动构建 | W2S, OpenSkill |
| **自演化/自进化** | Agent 部署后无监督持续学习 | OpenSkill |
| **检索质量瓶颈** | 社区开始正视 RAG 的根本性局限 | Declarative Skills |
| **多智能体记忆协作** | 通过 Agent 分工实现记忆的生成、评估、检索 | AdMem (Actor-Memory-Critic) |

### 📊 关键洞察

1. **记忆三分法成为共识**：语义记忆（事实）、情节记忆（经历）、程序记忆（技能）的分类正在被学术界广泛采纳，AdMem 是首个统一三者的自动框架。

2. **"从成功回放"到"从失败学习"**：以往的程序记忆研究倾向于重放成功轨迹，AdMem 明确提出处理失败案例的重要性，这是一个重要的范式转变。

3. **检索质量是记忆系统的阿喀琉斯之踵**：Declarative Skills 论文的实证发现——无论编排多精巧，检索质量不行就全崩——对整个 RAG+Memory 领域都是一记警钟。

4. **技能即记忆，轨迹即规范**：W2S 论文将轨迹提升为"可执行运行时规范"，而不仅是可压缩文本，这对程序记忆的写入机制有深远影响。

5. **开放世界自演化是下一个前沿**：OpenSkill 代表了一种大胆的尝试——完全不依赖人工标注或预设验证器，Agent 从零构建自己的技能库。

---

## 与 19 个开源记忆项目的关联矩阵

| 论文 | MemGPT | LangChain | LlamaIndex | AutoGPT | CrewAI | 其他 |
|------|--------|-----------|------------|---------|--------|------|
| **AdMem** | 架构升级 | 替代简单buffer | 互补 | 解决膨胀 | 丰富记忆 | 多Agent记忆协作新范式 |
| **OpenSkill** | 自管理+自构建 | — | 检索增强 | 自演化升级 | — | 无监督技能发现 |
| **W2S** | 轨迹→程序记忆 | Tool定义自动化 | — | 轨迹复用 | 技能自动生成 | 程序记忆写入机制 |
| **Declarative Skills** | 编排策略对比 | RAG瓶颈警示 | 检索质量验证 | — | 声明式vs命令式 | Dec-POMDP形式化 |

---

## 总结

本期最值得关注的是 **AdMem**——它代表了当前 Agent Memory 研究的前沿水平：统一的三层记忆架构、多智能体协作的记忆管理、以及处理失败经验的能力。结合 **W2S** 的技能自动提取和 **OpenSkill** 的开放世界自演化，我们看到了一个清晰的技术路线：**从被动存储到主动构建，从单一类型到统一架构，从静态知识到持续演化**。

检索质量瓶颈的发现则提醒我们：记忆系统的上限取决于检索系统的质量，这也是 RAG 和 Memory 研究需要共同面对的核心挑战。
