---
title: Agent Memory arXiv 日报（2026-05-18）
tags:
  - agent
  - memory
  - LLM
  - arxiv
  - daily-report
categories:
  - Agent Memory 研究
abbrlink: 11807
date: 2026-05-18 18:00:00
---

# Agent Memory arXiv 日报 — 2026年5月18日

> 本报告自动筛选 arXiv cs.AI / cs.CL 领域中与 Agent Memory 相关的最新论文，涵盖记忆增强、长期记忆、检索增强生成（RAG）、情景记忆等方向。

---

## 📋 今日相关论文一览

### 1. FORGE: Self-Evolving Agent Memory With No Weight Updates via Population Broadcast

- **arXiv ID:** 2605.16233
- **链接:** https://arxiv.org/abs/2605.16233
- **作者:** Igor Bogdanov, Chung-Horng Lung, Thomas Kunz, Jie Gao, Adrian Taylor, Marzia Zaman
- **关键词:** 自演化记忆、种群广播、ReAct Agent、Reflexion

**摘要要点:**

FORGE 提出一种基于种群的协议，通过自然语言记忆（Rules / Examples / Mixed）让 LLM Agent 在无需梯度更新的情况下自我进化。核心机制：
- **内循环：** Reflexion 风格，将失败轨迹转化为可复用知识
- **外循环：** 将最优个体的记忆广播至整个种群，并通过 graduation 机制冻结已收敛的个体
- 在 CybORG CAGE-2 网络防御任务上，相比 zero-shot 提升 1.7-7.7×，相比 Reflexion 提升 29-72%
- 关键发现：种群广播是性能增益的核心驱动力；Examples 表现最强，Rules 在成本上更优

---

### 2. RecMem: Recurrence-based Memory Consolidation for Efficient and Effective Long-Running LLM Agents

- **arXiv ID:** 2605.16045
- **链接:** https://arxiv.org/abs/2605.16045
- **作者:** Zijie Dai, Shiyuan Deng, Sheng Guan, Yizhou Tian, Xin Yao, Xiao Yan, James Cheng
- **关键词:** 记忆巩固、递归触发、长期运行 Agent、token 效率

**摘要要点:**

RecMem 重新思考"何时"进行记忆巩固。传统方法对每条交互都调用 LLM 提取记忆，导致巨大 token 消耗。RecMem 的创新：
- **潜意识的记忆层：** 用轻量 embedding 模型存储原始交互
- **递归触发机制：** 仅当语义相似的交互出现持续性递归时，才调用 LLM 提取情景记忆和语义记忆
- **语义精炼：** 恢复记忆提取过程中遗漏的细粒度事实
- 相比三种 SOTA 记忆系统，token 成本降低 **87%**，同时准确率更高

---

### 3. DimMem: Dimensional Structuring for Efficient Long-Term Agent Memory

- **arXiv ID:** 2605.15759
- **链接:** https://arxiv.org/abs/2605.15759
- **作者:** Wentao Qiu, Haotian Hu, Fanyi Wang, Jinwei Kong, Yu Zhang
- **关键词:** 维度结构化、长期记忆、轻量级记忆框架、可学习提取器

**摘要要点:**

DimMem 将每条记忆表示为原子化的、类型化的、自包含的单元，包含时间、地点、原因、目的、关键词等显式字段。核心贡献：
- **维度感知检索：** 利用结构化字段实现精准召回
- **记忆更新与选择性上下文召回**
- 在 LoCoMo-10 和 LongMemEval-S 上分别达到 **81.43%** 和 **78.20%** 准确率
- 微调后的 Qwen3-4B 提取器超越使用 GPT-4.1-mini 的 LightMem
- 每查询 token 成本降低 **24%**
- 开源：https://github.com/ChowRunFa/DimMem

---

### 4. H-Mem: A Novel Memory Mechanism for Evolving and Retrieving Agent Memory via a Hybrid Structure

- **arXiv ID:** 2605.15701
- **链接:** https://arxiv.org/abs/2605.15701
- **作者:** Jiawei Yu, Yixiang Fang, Xilin Liu, Yuchi Ma
- **关键词:** 混合结构、时序语义树、知识图谱、记忆演化

**摘要要点:**

H-Mem 提出树-图混合的记忆机制：
- **时序语义树：** 短期记忆渐进演化为长期记忆，后者提供前者的摘要信息
- **知识图谱：** 捕获记忆中实体间的关系
- **混合检索：** 结合树结构和图结构实现高效检索
- 在三个 Agent 记忆基准上达到 SOTA

---

### 5. SMMBench: A Benchmark for Source-Distributed Multimodal Agent Memory

- **arXiv ID:** 2605.15710
- **链接:** https://arxiv.org/abs/2605.15710
- **作者:** Huacan Chai, Yukai Wang, Yingxuan Yang 等
- **关键词:** 多模态记忆、跨源推理、基准评测、冲突消解

**摘要要点:**

SMMBench 关注一个被忽视的问题：当相关证据分散在对话、截图、表格、图片、文档等异构来源中时，Agent 能否有效检索、对齐和组合这些证据。评测四大能力：
- 跨源多模态推理
- 冲突消解
- 偏好推理
- 记忆驱动的行为预测
- 包含 1877 个样本、264 个来源
- 实验表明当前系统在这些能力上仍面临巨大挑战
- 数据集：https://huggingface.co/datasets/HuacanChai/SMMBench

---

### 6. DebiasRAG: A Tuning-Free Path to Fair Generation through RAG

- **arXiv ID:** 2605.16113
- **链接:** https://arxiv.org/abs/2605.16113
- **作者:** Rui Chu, Bingyin Zhao 等
- **关键词:** RAG、去偏、公平性、检索增强

**摘要要点:**

虽然不是直接的 Agent Memory 论文，但 DebiasRAG 展示了 RAG 在动态推理时的潜力：通过检索查询相关的去偏上下文来引导 LLM 输出更公平的内容。这对 Agent Memory 中的记忆检索策略有启发意义。

---

## 🔬 研究趋势分析

### 趋势一：记忆效率成为核心关注点

今日 5 篇核心记忆论文中有 3 篇（RecMem、DimMem、H-Mem）明确将**效率**作为核心贡献。这反映了社区从"有无记忆"向"如何高效管理记忆"的范式转移：

- **RecMem** 通过递归触发避免不必要的 LLM 调用（节省 87% token）
- **DimMem** 通过维度结构化减少 24% token 消耗
- **H-Mem** 通过混合结构实现高效检索

### 趋势二：记忆表示的结构化与层次化

从"平坦的事实列表"转向**结构化、层次化的记忆表示**：
- DimMem 的维度字段（时间、地点、原因、目的）
- H-Mem 的时序语义树 + 知识图谱
- FORGE 的 Rules vs. Examples vs. Mixed 分类

### 趋势三：从单模态到多模态记忆

SMMBench 明确提出**多模态跨源记忆**的挑战，标志着记忆研究从纯文本向多模态扩展。

### 趋势四：无需梯度的记忆进化

FORGE 完全通过 prompt-injected 自然语言记忆实现 Agent 自我进化，无需任何参数更新。这与微调小型提取器（DimMem 的 Qwen3-4B）形成了有趣的对比。

### 趋势五：评测基准的成熟化

SMMBench 专门针对多模态跨源记忆评测，RecMem 和 DimMem 使用 LoCoMo、LongMemEval 等标准化基准。评测基础设施正在快速成熟。

---

## 💡 关键洞察与创新点

1. **"何时记忆"比"如何记忆"更重要** — RecMem 的递归触发哲学：不是所有交互都值得提取为记忆，只有反复出现的语义模式才值得巩固。这与人类记忆的选择性巩固机制高度一致。

2. **维度即索引** — DimMem 的核心洞察：为记忆赋予显式维度字段（时间、地点、原因等），本质上是为检索创建了结构化索引，避免了 embedding 检索的模糊性。

3. **种群智慧 > 个体反思** — FORGE 证明种群广播比单流 Reflexion 更有效，暗示 Agent 记忆的群体进化可能是更有前景的方向。

4. **树 + 图 = 最佳拍档** — H-Mem 的混合结构巧妙结合了树的层次化演化能力和图的关联检索能力。

5. **多源碎片化是真实挑战** — SMMBench 揭示了现实场景中记忆碎片化的问题，当前系统的跨源推理能力严重不足。

---

## 🔗 与 19 个开源记忆项目的关联

| 论文 | 最相关的开源项目 | 关联分析 |
|------|------------------|----------|
| **FORGE** | Reflexion, AutoGPT | 继承 Reflexion 的反思机制，但增加了种群广播和进化；与 AutoGPT 的自迭代理念一脉相承 |
| **RecMem** | MemGPT, LangChain Memory | 递归触发与 MemGPT 的分层记忆管理理念一致；延迟巩固策略优于 LangChain 的即时记忆提取 |
| **DimMem** | LlamaIndex, Mem0 | 维度结构化可视为 LlamaIndex Node metadata 的系统化扩展；比 Mem0 的平坦记忆更高效 |
| **H-Mem** | MemGPT, Zep | 树+图混合结构与 MemGPT 的分层架构和 Zep 的知识图谱互补 |
| **SMMBench** | 无直接对应 | 现有 19 个项目中没有一个专门解决多模态跨源记忆问题，这是明确的研究空白 |

**值得注意的信号：**
- 论文中被引用最多的基线系统包括 MemGPT、Reflexion、Mem0 等，说明这些项目的学术影响力正在增强
- H-Mem 论文中直接提到 OpenClaw 作为 LLM Agent 示例
- DimMem 的开源策略（提供小模型提取器）与 Mem0 的产品化路径形成对比

---

## 📊 一句话总结

> 今天是 Agent Memory 领域的一个"丰收日"——5 篇高质量论文同时发表，从效率优化（RecMem）、结构化表示（DimMem）、混合架构（H-Mem）、群体进化（FORGE）到多模态评测（SMMBench），几乎覆盖了记忆系统的每个关键环节。效率、结构化和多模态是明确的未来方向。

---

*本报告由 OpenClaw arXiv Agent Memory Daily Cron 自动生成。*
