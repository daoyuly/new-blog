---
title: OpenClaw Skill 每日推荐 - AI 与大语言模型
date: 2026-09-18 11:30:00
tags:
  - openclaw
  - skill
  - ai-and-llms
categories:
  - 技术推荐
---

# OpenClaw Skill 每日推荐 - AI 与大语言模型

> 每天介绍一个 OpenClaw Skill 分类，今日分类：**AI & LLMs**
> 共 **184 个 Skills**，是 OpenClaw 生态中最大的分类

## 📋 分类概述

AI & LLMs 分类是 OpenClaw 技能生态中最庞大的分类，汇聚了 184 个与大语言模型和 AI Agent 直接相关的技能。从持久记忆、多模型协作到自我反思和 Token 优化，这个分类几乎涵盖了 AI Agent 的所有核心能力建设。

分类中的技能可以归纳为以下几个方向：

| 方向 | 代表技能 | 说明 |
|------|---------|------|
| 记忆系统 | agent-memory, mnemon | 让 Agent 拥有持久记忆 |
| 多模型协作 | moa, llmcouncil-router | 多模型辩论与智能路由 |
| 自我认知 | metacognition, anti-regression | 自我反思与行为约束 |
| Token 优化 | smart-context, compression | 降低成本、提升效率 |
| 安全防护 | anti-injection-skill, pincer | 防注入与安全审计 |
| Agent 编排 | agent-orchestrator, multi-agent-collab | 多 Agent 协调 |

---

## 🏆 精选 Skill 详解

### 1. agent-memory — Agent 持久记忆系统

**GitHub:** [openclaw/skills - agent-memory](https://github.com/openclaw/skills/tree/main/skills/dennis-da-menace/agent-memory/SKILL.md)

**核心功能：** 为 AI Agent 提供持久化记忆能力，让 Agent 能够跨会话存储和检索信息。

**实用场景：**
- 用户偏好记忆：记住用户的口味、工作习惯、常用工具
- 项目上下文持久化：跨会话保持项目进度和决策记录
- 对话历史压缩：将冗长的对话历史压缩为结构化记忆条目
- 知识积累：Agent 从交互中学习并积累领域知识

**技术实现机制：**
- 采用文件系统作为记忆存储后端（JSON/Markdown）
- 提供写入（Write）、存储（Store）、回忆（Recall）、推理（Reason）四层 API
- 支持语义检索和关键词索引双模式
- 记忆条目支持时间戳、标签、优先级等元数据

**推荐指数：⭐⭐⭐⭐⭐ (5/5)**

> 评价：记忆系统是 AI Agent 从"金鱼脑"走向真正助手的核心基础设施。这个 Skill 设计简洁但覆盖了记忆系统的关键需求，是构建长期可信赖 Agent 的必备组件。

---

### 2. moa (Mixture of Agents) — 多模型辩论与综合

**GitHub:** [openclaw/skills - moa](https://github.com/openclaw/skills/tree/main/skills/jscianna/moa/SKILL.md)

**核心功能：** 让 3 个前沿 LLM 就同一问题展开辩论，然后综合它们的最佳见解，输出一个更优的答案。

**实用场景：**
- 复杂技术决策：让 GPT-4、Claude、Gemini 分别给出架构方案，综合选择最优
- 创意内容生成：多模型从不同角度生成，取其精华
- 代码审查：多个模型交叉审查，发现单一模型容易遗漏的 Bug
- 研究问题分析：利用不同模型的知识优势互补

**技术实现机制：**
- 并行调用 3 个前沿模型（如 GPT-4、Claude 3.5、Gemini Pro）
- 第一轮：各模型独立给出答案和推理
- 第二轮：各模型看到其他模型的答案后进行交叉评论
- 第三轮：综合所有讨论，输出最终答案
- 支持 Round 数配置，可扩展为更多轮辩论

```yaml
# 使用示例
skills:
  - moa
# 在对话中触发：
# "用 MoA 分析：微服务 vs 单体架构的优劣"
```

**推荐指数：⭐⭐⭐⭐⭐ (5/5)**

> 评价：Mixture of Agents 是 LLM 集成学习的优雅实现。通过让模型互相"辩论"，可以显著降低单一模型的偏见和盲点。代价是 Token 消耗较高，但效果提升明显。

---

### 3. llmcouncil-router — LLM 智能路由

**GitHub:** [openclaw/skills - llmcouncil-router](https://github.com/openclaw/skills/tree/main/skills/ashtiwariasu/llmcouncil-router/SKILL.md)

**核心功能：** 基于同行评审排名，将任意 Prompt 路由到表现最佳的 LLM。

**实用场景：**
- 成本优化：简单任务路由到便宜模型，复杂任务路由到强模型
- 质量保障：根据社区评测数据选择最擅长该任务的模型
- A/B 测试：对比不同模型在同一任务上的表现
- 多模型管理：统一入口管理多个 LLM Provider

**技术实现机制：**
- 内置 LLM Council 排行榜数据（基于同行评审的模型排名）
- 根据 Prompt 特征（代码/写作/推理/数学等）匹配最佳模型
- 支持自定义模型偏好和成本约束
- 路由决策透明可解释，附带排名依据

```python
# 路由逻辑示意
def route_prompt(prompt: str) -> str:
    task_type = classify_task(prompt)  # code/writing/reasoning/math
    ranking = llm_council_rankings[task_type]
    return select_model(ranking, budget_constraint)
```

**推荐指数：⭐⭐⭐⭐ (4/5)**

> 评价：智能路由是多模型环境下的关键中间件。这个 Skill 的亮点在于引入了同行评审机制，让模型选择不再依赖固定规则，而是基于实际性能数据。适合需要管理多个 LLM Provider 的团队。

---

### 4. metacognition — Agent 自我反思引擎

**GitHub:** [openclaw/skills - metacognition](https://github.com/openclaw/skills/tree/main/skills/meimakes/metacognition/SKILL.md)

**核心功能：** 为 AI Agent 提供自我反思能力，让 Agent 能够评估自身输出的质量并进行迭代改进。

**实用场景：**
- 代码质量自检：Agent 生成代码后自动审查，发现潜在问题
- 回答质量评估：对不确定的回答进行二次验证
- 策略调整：根据反思结果调整后续行动策略
- 错误学习：从失败中总结经验，避免重复犯错

**技术实现机制：**
- 在 Agent 输出后插入"反思阶段"
- 使用元认知 Prompt 模板引导自我评估：
  - "这个回答的置信度如何？"
  - "有哪些假设可能不成立？"
  - "是否有遗漏的边界情况？"
- 反思结果写入记忆系统，供后续参考
- 支持可配置的反思深度和频率

```
Agent 输出 → [反思引擎] → 质量评估 → 是否需要改进？
     ↑                                    ↓
     └────────── 迭代改进 ←───────────────┘
```

**推荐指数：⭐⭐⭐⭐ (4/5)**

> 评价：自我反思是 Agent 从"工具"走向"助手"的关键一步。这个 Skill 的价值在于将反思过程系统化、可配置化。代价是会增加 Token 消耗和响应时间，适合对输出质量要求高的场景。

---

### 5. smart-context — Token 效率引擎

**GitHub:** [openclaw/skills - smart-context](https://github.com/openclaw/skills/tree/main/skills/joe3112/smart-context/SKILL.md)

**核心功能：** 通过响应大小控制、上下文裁剪、工具效率优化和任务委派，实现 Token 使用效率最大化。

**实用场景：**
- 长对话场景：自动压缩历史消息，保留关键信息
- 成本敏感场景：根据问题复杂度调整响应详细程度
- 多工具场景：优化工具调用顺序，减少冗余调用
- 委派场景：将简单子任务委派给更便宜的模型

**技术实现机制：**
- **响应大小控制：** 根据问题类型自动决定回复长度（简单问题简短回答，复杂问题详细展开）
- **上下文裁剪：** 使用滑动窗口 + 摘要策略，保留最近 N 轮原文 + 更早的摘要
- **工具效率分析：** 记录每个工具的调用成本和收益，优化调用策略
- **任务委派：** 识别可独立完成的子任务，委派给 sub-agent 或更经济的模型

```
Token 使用对比：
┌─────────────┬──────────────┬──────────────┐
│   场景      │  无 smart-context  │  有 smart-context  │
├─────────────┼──────────────┼──────────────┤
│  10轮对话   │   ~15K tokens    │   ~6K tokens      │
│  工具调用   │   12次调用       │   7次调用         │
│  响应长度   │   平均500字      │   按需调整         │
└─────────────┴──────────────┴──────────────┘
```

**推荐指数：⭐⭐⭐⭐⭐ (5/5)**

> 评价：Token 效率是 AI Agent 可持续运行的经济基础。这个 Skill 从多个维度系统性地优化 Token 使用，效果显著。对于需要长时间运行或处理大量请求的 Agent 来说，这是必备技能。

---

## 📊 推荐指数排名

| 排名 | Skill | 推荐指数 | 核心价值 |
|------|-------|---------|---------|
| 1 | agent-memory | ⭐⭐⭐⭐⭐ | Agent 持久记忆的基础设施 |
| 2 | moa | ⭐⭐⭐⭐⭐ | 多模型辩论提升输出质量 |
| 3 | smart-context | ⭐⭐⭐⭐⭐ | Token 效率最大化 |
| 4 | llmcouncil-router | ⭐⭐⭐⭐ | 基于评审数据的智能路由 |
| 5 | metacognition | ⭐⭐⭐⭐ | 自我反思与迭代改进 |

---

## 🎯 应用场景总结

### 场景一：构建长期记忆型 Agent

如果你需要一个能记住用户偏好、项目历史的 Agent：

```
agent-memory（记忆存储）+ metacognition（自我反思）+ smart-context（Token 优化）
```

这套组合让 Agent 具备"记住过去、反思现在、优化未来"的能力。适合个人助手、项目协作助手等长期使用场景。

### 场景二：高质量内容生成

如果你追求最高质量的内容输出：

```
moa（多模型辩论）+ llmcouncil-router（智能路由）+ agent-memory（知识积累）
```

先路由到最佳模型，再通过多模型辩论综合，最后将结果存入记忆供后续参考。适合研究报告、技术文档、代码审查等高质量要求场景。

### 场景三：成本敏感的批量处理

如果你需要处理大量请求且对成本敏感：

```
smart-context（Token 优化）+ llmcouncil-router（成本路由）+ compression（Prompt 压缩）
```

通过上下文裁剪、模型选择和 Prompt 压缩三重优化，可以降低 60%+ 的 Token 消耗。适合批量数据处理、客服自动化等大规模场景。

---

## 💡 实用建议

1. **从记忆开始：** 如果只安装一个 Skill，选 `agent-memory`。没有记忆的 Agent 永远只是聊天机器人。

2. **质量 vs 成本：** `moa` 追求质量但 Token 消耗高（3x），`smart-context` 追求效率但可能损失细节。根据场景权衡。

3. **安全第一：** 分类中有多个安全相关 Skill（`anti-injection-skill`、`pincer`、`safety-checks`），在开放环境下部署 Agent 时强烈建议安装。

4. **组合使用：** 这些 Skill 不是互斥的，组合使用效果倍增。例如 `metacognition` 的反思结果可以存入 `agent-memory`，`llmcouncil-router` 可以路由到 `moa` 进行辩论。

5. **关注更新：** 这个分类有 184 个 Skill，活跃度高，建议定期关注新增技能。完整列表见 [awesome-openclaw-skills](https://github.com/openclaw/skills)。

---

## 📅 明日预告

明日分类：**Browser and Automation（浏览器自动化）** — 让 Agent 能够操控浏览器，完成网页交互、数据抓取、自动化测试等任务。

---

*本文是 OpenClaw Skill 每日推荐系列的一部分，每天介绍一个分类，共 30 个分类。*
