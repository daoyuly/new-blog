---
title: Agent Memory 每日 arXiv 速递 (2026-05-25)
tags:
  - agent
  - memory
  - LLM
  - arXiv
  - daily-report
categories: [Agent Memory 研究]
  - Agent Memory
  - 论文速递
abbrlink: 15505
date: 2026-05-25 18:00:00
noindex: true
description: "- arXiv ID: 2605.23723"
keywords: "agent, memory, arxiv, (2026, 25), LLM, arXiv, daily-report"
---

# Agent Memory 每日 arXiv 速递 (2026-05-25)

> 本报告自动筛选 arXiv cs.AI 领域与 Agent Memory 相关的最新论文，分析研究趋势与关键创新点。

## 📋 今日相关论文列表

### 1. MemAudit: Post-hoc Auditing of Poisoned Agent Memory via Causal Attribution and Structural Anomaly Detection

- **arXiv ID:** 2605.23723
- **链接:** [https://arxiv.org/abs/2605.23723](https://arxiv.org/abs/2605.23723) [Kimi解读](http://kimi.com/_prefill_chat?prefill_prompt=%E6%88%91%E4%BB%AC%E8%A6%81%E8%AE%A8%E8%AE%BA%E7%9A%84%E8%AE%BA%E6%96%87%E6%98%AFhttps%3A%2F%2Farxiv.org%2Fabs%2F2605.23723%EF%BC%8C%E9%93%BE%E6%8E%A5%E6%98%AF+https%3A%2F%2Farxiv.org%2Fpdf%2F2605.23723+%EF%BC%8C%E5%B7%B2%E6%9C%89%E7%9A%84FAQ%E9%93%BE%E6%8E%A5%E6%98%AF+https%3A%2F%2Fpapers.cool%2Farxiv%2Fkimi%3Fpaper%3D2605.23723+%E3%80%82%E8%AF%B7%E4%BB%A5%E6%AD%A4%E4%B8%BA%E5%9F%BA%E7%A1%80%EF%BC%8C%E7%BB%A7%E7%BB%AD%E5%9B%9E%E7%AD%94%E6%88%91%E5%90%8E%E9%9D%A2%E7%9A%84%E9%97%AE%E9%A2%98%E3%80%82&system_prompt=%E4%BD%A0%E6%98%AF%E4%B8%80%E4%B8%AA%E5%AD%A6%E6%9C%AF%E5%8A%A9%E6%89%8B%EF%BC%8C%E5%90%8E%E9%9D%A2%E7%9A%84%E5%AF%B9%E8%AF%9D%E5%B0%86%E5%9B%B4%E7%BB%95%E7%9D%80%E4%BB%A5%E4%B8%8B%E8%AE%BA%E6%96%87%E5%86%85%E5%AE%B9%E8%BF%9B%E8%A1%8C%EF%BC%8C%E5%B7%B2%E7%BB%8F%E9%80%9A%E8%BF%87%E9%93%BE%E6%8E%A5%E7%BB%99%E5%87%BA%E4%BA%86%E8%AE%BA%E6%96%87%E7%9A%84PDF%E5%92%8C%E8%AE%BA%E6%96%87%E5%B7%B2%E6%9C%89%E7%9A%84FAQ%E3%80%82%E7%94%A8%E6%88%B7%E5%B0%86%E7%BB%A7%E7%BB%AD%E5%90%91%E4%BD%A0%E5%92%A8%E8%AF%A2%E8%AE%BA%E6%96%87%E7%9A%84%E7%9B%B8%E5%85%B3%E9%97%AE%E9%A2%98%EF%BC%8C%E8%AF%B7%E4%BD%A0%E4%BD%9C%E5%87%BA%E4%B8%93%E4%B8%9A%E7%9A%84%E5%9B%9E%E7%AD%94%EF%BC%8C%E4%B8%8D%E8%A6%81%E5%87%BA%E7%8E%B0%E7%AC%AC%E4%B8%80%E4%BA%BA%E7%A7%B0%EF%BC%8C%E5%BD%93%E6%B6%89%E5%8F%8A%E5%88%B0%E5%88%86%E7%82%B9%E5%9B%9E%E7%AD%94%E6%97%B6%EF%BC%8C%E9%BC%93%E5%8A%B1%E4%BD%A0%E4%BB%A5markdown%E6%A0%BC%E5%BC%8F%E8%BE%93%E5%87%BA%E3%80%82&send_immediately=true)
- **关键词:** agent memory, memory poisoning, security, causal attribution

**摘要要点：** 提出了 MemAudit，一个针对记忆增强 LLM Agent 的事后因果审计框架。Agent 的持久化记忆存储了过去的交互记录以供检索，但也带来了安全隐患——攻击者可以通过普通交互注入恶意记录。MemAudit 结合两个互补信号：(1) 反事实记忆影响分数（衡量每条记忆对有害输出的因果贡献）；(2) 记忆一致性图（识别记忆库中的结构异常）。在 MINJA 攻击场景下，QA 攻击成功率从 70% 降至 0%，RAP 攻击成功率从 83.3% 降至 0%。

**与开源项目的关联：** 直接关联 MemGPT、LangChain Memory 等持久化记忆系统的安全问题。当前大多数开源记忆实现缺乏对记忆投毒的防御机制。

---

### 2. Parallel Context Compaction for Long-Horizon LLM Agent Serving

- **arXiv ID:** 2605.23296
- **链接:** [https://arxiv.org/abs/2605.23296](https://arxiv.org/abs/2605.23296) [Kimi解读](http://kimi.com/_prefill_chat?prefill_prompt=%E6%88%91%E4%BB%AC%E8%A6%81%E8%AE%A8%E8%AE%BA%E7%9A%84%E8%AE%BA%E6%96%87%E6%98%AFhttps%3A%2F%2Farxiv.org%2Fabs%2F2605.23296%EF%BC%8C%E9%93%BE%E6%8E%A5%E6%98%AF+https%3A%2F%2Farxiv.org%2Fpdf%2F2605.23296+%EF%BC%8C%E5%B7%B2%E6%9C%89%E7%9A%84FAQ%E9%93%BE%E6%8E%A5%E6%98%AF+https%3A%2F%2Fpapers.cool%2Farxiv%2Fkimi%3Fpaper%3D2605.23296+%E3%80%82%E8%AF%B7%E4%BB%A5%E6%AD%A4%E4%B8%BA%E5%9F%BA%E7%A1%80%EF%BC%8C%E7%BB%A7%E7%BB%AD%E5%9B%9E%E7%AD%94%E6%88%91%E5%90%8E%E9%9D%A2%E7%9A%84%E9%97%AE%E9%A2%98%E3%80%82&system_prompt=%E4%BD%A0%E6%98%AF%E4%B8%80%E4%B8%AA%E5%AD%A6%E6%9C%AF%E5%8A%A9%E6%89%8B%EF%BC%8C%E5%90%8E%E9%9D%A2%E7%9A%84%E5%AF%B9%E8%AF%9D%E5%B0%86%E5%9B%B4%E7%BB%95%E7%9D%80%E4%BB%A5%E4%B8%8B%E8%AE%BA%E6%96%87%E5%86%85%E5%AE%B9%E8%BF%9B%E8%A1%8C%EF%BC%8C%E5%B7%B2%E7%BB%8F%E9%80%9A%E8%BF%87%E9%93%BE%E6%8E%A5%E7%BB%99%E5%87%BA%E4%BA%86%E8%AE%BA%E6%96%87%E7%9A%84PDF%E5%92%8C%E8%AE%BA%E6%96%87%E5%B7%B2%E6%9C%89%E7%9A%84FAQ%E3%80%82%E7%94%A8%E6%88%B7%E5%B0%86%E7%BB%A7%E7%BB%AD%E5%90%91%E4%BD%A0%E5%92%A8%E8%AF%A2%E8%AE%BA%E6%96%87%E7%9A%84%E7%9B%B8%E5%85%B3%E9%97%AE%E9%A2%98%EF%BC%8C%E8%AF%B7%E4%BD%A0%E4%BD%9C%E5%87%BA%E4%B8%93%E4%B8%9A%E7%9A%84%E5%9B%9E%E7%AD%94%EF%BC%8C%E4%B8%8D%E8%A6%81%E5%87%BA%E7%8E%B0%E7%AC%AC%E4%B8%80%E4%BA%BA%E7%A7%B0%EF%BC%8C%E5%BD%93%E6%B6%89%E5%8F%8A%E5%88%B0%E5%88%86%E7%82%B9%E5%9B%9E%E7%AD%94%E6%97%B6%EF%BC%8C%E9%BC%93%E5%8A%B1%E4%BD%A0%E4%BB%A5markdown%E6%A0%BC%E5%BC%8F%E8%BE%93%E5%87%BA%E3%80%82&send_immediately=true)
- **关键词:** context compaction, long-horizon agent, summarization, serving

**摘要要点：** 长周期 LLM Agent 的对话历史会不断增长并超出上下文窗口。传统的 LLM 摘要压缩是阻塞式的，且摘要量不可控。本文提出**并行压缩**方法，将上下文分块并行摘要，提供细粒度、可预测的摘要量控制。在 HotpotQA 和 LoCoMo 基准上，8B 到 120B 参数的四个骨干模型测试显示，在相同压缩解码量下减少了端到端时间并提高了吞吐量。

**与开源项目的关联：** 与所有长上下文记忆管理方案（如 MemGPT 的核心-摘要记忆分层、LangChain 的 ConversationSummaryMemory）直接相关。并行压缩是一个工程友好的优化方向。

---

### 3. SkillOpt: Executive Strategy for Self-Evolving Agent Skills

- **arXiv ID:** 2605.23904
- **链接:** [https://arxiv.org/abs/2605.23904](https://arxiv.org/abs/2605.23904) [Kimi解读](http://kimi.com/_prefill_chat?prefill_prompt=%E6%88%91%E4%BB%AC%E8%A6%81%E8%AE%A8%E8%AE%BA%E7%9A%84%E8%AE%BA%E6%96%87%E6%98%AFhttps%3A%2F%2Farxiv.org%2Fabs%2F2605.23904%EF%BC%8C%E9%93%BE%E6%8E%A5%E6%98%AF+https%3A%2F%2Farxiv.org%2Fpdf%2F2605.23904+%EF%BC%8C%E5%B7%B2%E6%9C%89%E7%9A%84FAQ%E9%93%BE%E6%8E%A5%E6%98%AF+https%3A%2F%2Fpapers.cool%2Farxiv%2Fkimi%3Fpaper%3D2605.23904+%E3%80%82%E8%AF%B7%E4%BB%A5%E6%AD%A4%E4%B8%BA%E5%9F%BA%E7%A1%80%EF%BC%8C%E7%BB%A7%E7%BB%AD%E5%9B%9E%E7%AD%94%E6%88%91%E5%90%8E%E9%9D%A2%E7%9A%84%E9%97%AE%E9%A2%98%E3%80%82&system_prompt=%E4%BD%A0%E6%98%AF%E4%B8%80%E4%B8%AA%E5%AD%A6%E6%9C%AF%E5%8A%A9%E6%89%8B%EF%BC%8C%E5%90%8E%E9%9D%A2%E7%9A%84%E5%AF%B9%E8%AF%9D%E5%B0%86%E5%9B%B4%E7%BB%95%E7%9D%80%E4%BB%A5%E4%B8%8B%E8%AE%BA%E6%96%87%E5%86%85%E5%AE%B9%E8%BF%9B%E8%A1%8C%EF%BC%8C%E5%B7%B2%E7%BB%8F%E9%80%9A%E8%BF%87%E9%93%BE%E6%8E%A5%E7%BB%99%E5%87%BA%E4%BA%86%E8%AE%BA%E6%96%87%E7%9A%84PDF%E5%92%8C%E8%AE%BA%E6%96%87%E5%B7%B2%E6%9C%89%E7%9A%84FAQ%E3%80%82%E7%94%A8%E6%88%B7%E5%B0%86%E7%BB%A7%E7%BB%AD%E5%90%91%E4%BD%A0%E5%92%A8%E8%AF%A2%E8%AE%BA%E6%96%87%E7%9A%84%E7%9B%B8%E5%85%B3%E9%97%AE%E9%A2%98%EF%BC%8C%E8%AF%B7%E4%BD%A0%E4%BD%9C%E5%87%BA%E4%B8%93%E4%B8%9A%E7%9A%84%E5%9B%9E%E7%AD%94%EF%BC%8C%E4%B8%8D%E8%A6%81%E5%87%BA%E7%8E%B0%E7%AC%AC%E4%B8%80%E4%BA%BA%E7%A7%B0%EF%BC%8C%E5%BD%93%E6%B6%89%E5%8F%8A%E5%88%B0%E5%88%86%E7%82%B9%E5%9B%9E%E7%AD%94%E6%97%B6%EF%BC%8C%E9%BC%93%E5%8A%B1%E4%BD%A0%E4%BB%A5markdown%E6%A0%BC%E5%BC%8F%E8%BE%93%E5%87%BA%E3%80%82&send_immediately=true)
- **关键词:** agent skills, experience optimization, text-space optimizer, self-evolving

**摘要要点：** 首次提出将 Agent 技能作为冻结 Agent 的"外部状态"来训练的系统方法。SkillOpt 是一个文本空间优化器：独立优化模型将评分过的 rollout 转化为对技能文档的增/删/改操作，只有严格改善验证分数的编辑才被接受。引入文本学习率预算、拒绝编辑缓冲区、epoch 级慢/元更新。在 6 个基准、7 个模型、3 种执行框架（direct chat / Codex / Claude Code）上全部 52 个评估单元中取得最佳或并列最佳。

**与开源项目的关联：** 技能本质上是 Agent 的**程序性记忆**（procedural memory）。SkillOpt 的优化范式可视为对 AutoGPT、CrewAI 等框架中技能提示工程的系统化替代。

---

### 4. From Raw Experience to Skill Consumption: A Systematic Study of Model-Generated Agent Skills

- **arXiv ID:** 2605.23899
- **链接:** [https://arxiv.org/abs/2605.23899](https://arxiv.org/abs/2605.23899) [Kimi解读](http://kimi.com/_prefill_chat?prefill_prompt=%E6%88%91%E4%BB%AC%E8%A6%81%E8%AE%A8%E8%AE%BA%E7%9A%84%E8%AE%BA%E6%96%87%E6%98%AFhttps%3A%2F%2Farxiv.org%2Fabs%2F2605.23899%EF%BC%8C%E9%93%BE%E6%8E%A5%E6%98%AF+https%3A%2F%2Farxiv.org%2Fpdf%2F2605.23899+%EF%BC%8C%E5%B7%B2%E6%9C%89%E7%9A%84FAQ%E9%93%BE%E6%8E%A5%E6%98%AF+https%3A%2F%2Fpapers.cool%2Farxiv%2Fkimi%3Fpaper%3D2605.23899+%E3%80%82%E8%AF%B7%E4%BB%A5%E6%AD%A4%E4%B8%BA%E5%9F%BA%E7%A1%80%EF%BC%8C%E7%BB%A7%E7%BB%AD%E5%9B%9E%E7%AD%94%E6%88%91%E5%90%8E%E9%9D%A2%E7%9A%84%E9%97%AE%E9%A2%98%E3%80%82&system_prompt=%E4%BD%A0%E6%98%AF%E4%B8%80%E4%B8%AA%E5%AD%A6%E6%9C%AF%E5%8A%A9%E6%89%8B%EF%BC%8C%E5%90%8E%E9%9D%A2%E7%9A%84%E5%AF%B9%E8%AF%9D%E5%B0%86%E5%9B%B4%E7%BB%95%E7%9D%80%E4%BB%A5%E4%B8%8B%E8%AE%BA%E6%96%87%E5%86%85%E5%AE%B9%E8%BF%9B%E8%A1%8C%EF%BC%8C%E5%B7%B2%E7%BB%8F%E9%80%9A%E8%BF%87%E9%93%BE%E6%8E%A5%E7%BB%99%E5%87%BA%E4%BA%86%E8%AE%BA%E6%96%87%E7%9A%84PDF%E5%92%8C%E8%AE%BA%E6%96%87%E5%B7%B2%E6%9C%89%E7%9A%84FAQ%E3%80%82%E7%94%A8%E6%88%B7%E5%B0%86%E7%BB%A7%E7%BB%AD%E5%90%91%E4%BD%A0%E5%92%A8%E8%AF%A2%E8%AE%BA%E6%96%87%E7%9A%84%E7%9B%B8%E5%85%B3%E9%97%AE%E9%A2%98%EF%BC%8C%E8%AF%B7%E4%BD%A0%E4%BD%9C%E5%87%BA%E4%B8%93%E4%B8%9A%E7%9A%84%E5%9B%9E%E7%AD%94%EF%BC%8C%E4%B8%8D%E8%A6%81%E5%87%BA%E7%8E%B0%E7%AC%AC%E4%B8%80%E4%BA%BA%E7%A7%B0%EF%BC%8C%E5%BD%93%E6%B6%89%E5%8F%8A%E5%88%B0%E5%88%86%E7%82%B9%E5%9B%9E%E7%AD%94%E6%97%B6%EF%BC%8C%E9%BC%93%E5%8A%B1%E4%BD%A0%E4%BB%A5markdown%E6%A0%BC%E5%BC%8F%E8%BE%93%E5%87%BA%E3%80%82&send_immediately=true)
- **关键词:** experience, skill extraction, skill lifecycle, negative transfer

**摘要要点：** 首次系统性覆盖技能完整生命周期（经验生成 → 技能提取 → 技能消费）的综合研究。发现模型生成的技能平均有益但存在不可忽视的**负迁移**问题；强提取器 ≠ 强消费者，技能效用与模型规模无关。最终提出 meta-skill 引导技能提取，一致提高技能质量并大幅减少负迁移。

**与开源项目的关联：** 直接关联经验回放（experience replay）和情景记忆（episodic memory）研究。LangChain、LlamaIndex 等框架的 few-shot 示例选择策略可借鉴其发现。

---

### 5. Co-ReAct: Rubrics as Step-Level Collaborators for ReAct Agents

- **arXiv ID:** 2605.23590
- **链接:** [https://arxiv.org/abs/2605.23590](https://arxiv.org/abs/2605.23590) [Kimi解读](http://kimi.com/_prefill_chat?prefill_prompt=%E6%88%91%E4%BB%AC%E8%A6%81%E8%AE%A8%E8%AE%BA%E7%9A%84%E8%AE%BA%E6%96%87%E6%98%AFhttps%3A%2F%2Farxiv.org%2Fabs%2F2605.23590%EF%BC%8C%E9%93%BE%E6%8E%A5%E6%98%AF+https%3A%2F%2Farxiv.org%2Fpdf%2F2605.23590+%EF%BC%8C%E5%B7%B2%E6%9C%89%E7%9A%84FAQ%E9%93%BE%E6%8E%A5%E6%98%AF+https%3A%2F%2Fpapers.cool%2Farxiv%2Fkimi%3Fpaper%3D2605.23590+%E3%80%82%E8%AF%B7%E4%BB%A5%E6%AD%A4%E4%B8%BA%E5%9F%BA%E7%A1%80%EF%BC%8C%E7%BB%A7%E7%BB%AD%E5%9B%9E%E7%AD%94%E6%88%91%E5%90%8E%E9%9D%A2%E7%9A%84%E9%97%AE%E9%A2%98%E3%80%82&system_prompt=%E4%BD%A0%E6%98%AF%E4%B8%80%E4%B8%AA%E5%AD%A6%E6%9C%AF%E5%8A%A9%E6%89%8B%EF%BC%8C%E5%90%8E%E9%9D%A2%E7%9A%84%E5%AF%B9%E8%AF%9D%E5%B0%86%E5%9B%B4%E7%BB%95%E7%9D%80%E4%BB%A5%E4%B8%8B%E8%AE%BA%E6%96%87%E5%86%85%E5%AE%B9%E8%BF%9B%E8%A1%8C%EF%BC%8C%E5%B7%B2%E7%BB%8F%E9%80%9A%E8%BF%87%E9%93%BE%E6%8E%A5%E7%BB%99%E5%87%BA%E4%BA%86%E8%AE%BA%E6%96%87%E7%9A%84PDF%E5%92%8C%E8%AE%BA%E6%96%87%E5%B7%B2%E6%9C%89%E7%9A%84FAQ%E3%80%82%E7%94%A8%E6%88%B7%E5%B0%86%E7%BB%A7%E7%BB%AD%E5%90%91%E4%BD%A0%E5%92%A8%E8%AF%A2%E8%AE%BA%E6%96%87%E7%9A%84%E7%9B%B8%E5%85%B3%E9%97%AE%E9%A2%98%EF%BC%8C%E8%AF%B7%E4%BD%A0%E4%BD%9C%E5%87%BA%E4%B8%93%E4%B8%9A%E7%9A%84%E5%9B%9E%E7%AD%94%EF%BC%8C%E4%B8%8D%E8%A6%81%E5%87%BA%E7%8E%B0%E7%AC%AC%E4%B8%80%E4%BA%BA%E7%A7%B0%EF%BC%8C%E5%BD%93%E6%B6%89%E5%8F%8A%E5%88%B0%E5%88%86%E7%82%B9%E5%9B%9E%E7%AD%94%E6%97%B6%EF%BC%8C%E9%BC%93%E5%8A%B1%E4%BD%A0%E4%BB%A5markdown%E6%A0%BC%E5%BC%8F%E8%BE%93%E5%87%BA%E3%80%82&send_immediately=true)
- **关键词:** ReAct, step-level guidance, rubric, reasoning trajectory

**摘要要点：** 将评分准则（rubric）作为推理时的步骤级指导注入 ReAct Agent 的上下文，引导每一步的证据搜索、推理或自评估。训练专用 rubric 生成器，使用 GRPO 优化 list-wise Spearman 排名相关奖励。在 DeepResearchBench 和 SQA-CS-V2 上持续优于 ReAct 基线。

**与开源项目的关联：** Rubric 可以视为一种**工作记忆**（working memory）的增强形式——在推理过程中动态注入指导信息，与 RAG 的检索增强思路有相似之处。

---

## 📊 研究趋势分析

### 热门方向

| 方向 | 热度 | 说明 |
|------|------|------|
| **记忆安全性** | 🔥🔥🔥 | MemAudit 揭示了持久化记忆的攻击面，记忆投毒成为新的研究热点 |
| **上下文压缩与管理** | 🔥🔥🔥 | 长周期 Agent 的上下文管理是工程刚需，并行压缩代表新范式 |
| **技能/程序性记忆** | 🔥🔥 | 将经验转化为可复用的技能文档，成为 Agent 自进化的核心路径 |
| **经验生命周期** | 🔥🔥 | 从经验生成到消费的完整链路分析，关注负迁移问题 |
| **推理时记忆注入** | 🔥 | 通过外部信号（rubric）在推理时动态引导，类似 RAG 思路 |

### 趋势洞察

1. **从"存什么"到"怎么安全地存"：** 记忆安全性（MemAudit）成为一个独立研究方向，说明 Agent Memory 已经从"有没有"进入"好不好、安不安全"的阶段。

2. **程序性记忆 > 情景性记忆：** 本日论文中，技能优化（SkillOpt）和技能生命周期研究比纯情景记忆更受关注，说明社区正在向"从经验中提炼可复用知识"倾斜。

3. **压缩与效率成为核心命题：** 并行上下文压缩说明 Agent Memory 的瓶颈正在从"设计架构"转向"工程效率"。

4. **负迁移问题浮出水面：** 经验到技能的转化不是万能的，负迁移的存在提示我们需要更精细的记忆管理策略。

## 💡 关键洞察与创新点

1. **因果归因用于记忆审计（MemAudit）：** 将因果推理引入 Agent 记忆安全领域，用反事实分析量化每条记忆的贡献，这是方法论上的创新。

2. **文本空间优化器（SkillOpt）：** 将深度学习优化器的严谨性（学习率、验证集、epoch）引入文本技能优化，"技能即外部状态"的类比很优雅。

3. **并行压缩（Parallel Context Compaction）：** 打破传统的顺序摘要范式，用并行化实现可控的上下文压缩，工程价值高。

4. **技能生命周期分析：** 揭示了"强提取器 ≠ 强消费者"的现象，这对记忆系统的设计有重要启示——记忆写入和读取需要不同的优化策略。

## 🔗 与 19 个开源记忆项目的关联

| 开源项目 | 关联论文 | 关联说明 |
|----------|----------|----------|
| **MemGPT** | MemAudit, Parallel Compaction | MemGPT 的核心-摘要记忆分层面临摘要效率和安全问题，MemAudit 和并行压缩直接相关 |
| **LangChain Memory** | MemAudit, Skill Lifecycle | LangChain 的多 种记忆类型（Summary、Buffer、Entity）需要考虑投毒防御和负迁移 |
| **LlamaIndex** | Parallel Compaction | LlamaIndex 的索引记忆同样面临上下文压缩效率问题 |
| **AutoGPT** | SkillOpt | AutoGPT 的自进化能力可通过 SkillOpt 的文本空间优化增强 |
| **CrewAI** | Skill Lifecycle | CrewAI 的角色记忆共享机制需关注技能消费端的负迁移 |
| **Mem0 (EmbedChain)** | MemAudit | 向量记忆的持久化存储需要投毒检测机制 |
| **Zep** | Parallel Compaction | Zep 的长期记忆管理可借鉴并行压缩提升效率 |
| **Letta** | MemAudit, SkillOpt | Letta（原 MemGPT 商业版）是记忆安全研究的直接受益者 |
| **其他项目** | Skill Lifecycle | 几乎所有使用 few-shot / 经验回放的项目都受技能生命周期研究的影响 |

## 📝 总结

今日 cs.AI 共筛选出 **5 篇**与 Agent Memory 高度相关的论文，覆盖**记忆安全、上下文压缩、技能优化、经验生命周期、推理引导**五个方向。

**核心信息：** Agent Memory 研究正在从架构设计走向**安全性、效率、负迁移治理**三个纵深方向。MemAudit 的出现标志着记忆安全成为独立子领域，而 SkillOpt 则为程序性记忆的优化提供了新范式。

---

*本报告由 OpenClaw Agent Memory Daily Cron 自动生成。数据来源：[papers.cool/arxiv/cs.AI](https://papers.cool/arxiv/cs.AI)*
