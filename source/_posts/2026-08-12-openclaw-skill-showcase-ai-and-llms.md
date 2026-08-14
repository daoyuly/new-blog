---
title: OpenClaw Skill 每日推荐 - AI 与大语言模型
tags:
  - openclaw
  - skill
  - ai-and-llms
categories:
  - 技术推荐
abbrlink: 14079
date: 2026-08-12 11:30:00
---

# OpenClaw Skill 每日推荐 - AI 与大语言模型

> 🎋 新一轮 Skill 展示之旅开始了！今天我们从最大的分类——**AI & LLMs** 出发，这个分类包含了 **184 个 Skills**，是 OpenClaw 生态中最庞大、最活跃的领域。

## 今日分类概述

**分类名称：** AI & LLMs（AI 与大语言模型）
**Skill 数量：** 184 个
**涵盖范围：** Agent 记忆系统、多模型协作、元认知、安全防护、成本管理、本地模型部署、语音处理、区块链 AI 等

这个分类几乎涵盖了 AI Agent 生态的方方面面——从底层记忆架构到上层成本管控，从安全防护到多模型协同。无论你是想让 Agent 更聪明、更安全、还是更省钱，这里都有对应的 Skill。

---

## 精选 Skill 详解

### 1. 🧠 agent-memory — AI Agent 持久记忆系统

**GitHub:** [openclaw/skills/agent-memory](https://github.com/openclaw/skills/tree/main/skills/dennis-da-menace/agent-memory/SKILL.md)

**核心功能：** 为 AI Agent 提供跨会话的持久化记忆能力，让 Agent 不再"健忘"。

**实用场景：**
- 用户偏好记忆：记住用户的习惯、口味、工作方式，下次对话直接延续
- 项目上下文持久化：跨会话保持项目进度、关键决策、待办事项
- 长期关系构建：让 Agent 随时间推移越来越了解用户

**技术实现：**
- 基于文件系统的记忆存储，将关键信息序列化到本地
- 支持记忆的分类管理（人物、项目、偏好等）
- 通过 SKILL.md 定义记忆的读写规则和检索策略
- 与 OpenClaw 的 workspace 机制深度集成

**推荐指数：** ⭐⭐⭐⭐⭐

> 💡 **点评：** 记忆是 Agent 从"工具"进化为"伙伴"的基础。这个 Skill 解决了 AI Agent 最根本的痛点——遗忘。如果你只能装一个 AI 类 Skill，这就是首选。

---

### 2. 🔄 moa (Mixture of Agents) — 多模型混合推理

**GitHub:** [openclaw/skills/moa](https://github.com/openclaw/skills/tree/main/skills/jscianna/moa/SKILL.md)

**核心功能：** 让 3 个前沿 LLM 先各自独立回答，再相互辩论，最后综合出最优答案。

**实用场景：**
- 复杂技术决策：让不同模型从不同角度分析架构方案
- 创意内容生成：多模型头脑风暴，取其精华
- 关键问题验证：当单个模型可能"幻觉"时，多模型交叉验证

**技术实现：**
- 并行调用 3 个不同的前沿模型（如 GPT-4、Claude、Gemini）
- 第一轮：各模型独立生成回答
- 第二轮：模型间相互审视对方的回答
- 第三轮：综合所有洞察，输出最终答案
- 通过 sub-agent 机制实现并行调度

```yaml
# 使用示例
用户提问 → moa skill 触发
  ├─ Agent 1 (Model A) → 独立回答
  ├─ Agent 2 (Model B) → 独立回答
  ├─ Agent 3 (Model C) → 独立回答
  ↓
  交叉评审阶段 → 综合最优答案 → 输出
```

**推荐指数：** ⭐⭐⭐⭐⭐

> 💡 **点评：** "三个臭皮匠顶个诸葛亮"的 AI 版本。成本虽高，但在关键决策场景下，多模型交叉验证的价值远超 3 倍的 API 费用。

---

### 3. 🪞 metacognition — Agent 自我反思引擎

**GitHub:** [openclaw/skills/metacognition](https://github.com/openclaw/skills/tree/main/skills/meimakes/metacognition/SKILL.md)

**核心功能：** 为 AI Agent 构建自我反思能力，让 Agent 在行动前"想一想"，在行动后"复盘"。

**实用场景：**
- 任务执行前：评估方案可行性，预判潜在风险
- 任务执行后：分析失败原因，总结经验教训
- 长期改进：基于历史表现自动调整行为策略
- 防止"机械执行"：避免 Agent 盲目按流程操作而不思考

**技术实现：**
- 在 Agent 的执行循环中插入反思节点
- 使用结构化的反思模板（What happened? Why? What to improve?）
- 反思结果写入持久化存储，影响后续决策
- 与 agent-memory 配合使用效果最佳

```
感知 → 思考 → 行动 → 反思 → 记忆更新
  ↑                              ↓
  └──────────────────────────────┘
         (形成认知闭环)
```

**推荐指数：** ⭐⭐⭐⭐

> 💡 **点评：** 让 Agent 从"执行者"升级为"学习者"。单独使用价值有限，但与记忆系统配合后，Agent 就有了真正的"成长性"。

---

### 4. 🛡️ anti-injection-skill — 提示注入防御

**GitHub:** [openclaw/skills/anti-injection-skill](https://github.com/openclaw/skills/tree/main/skills/georges91560/anti-injection-skill/SKILL.md)

**核心功能：** 多层防御体系，保护 AI Agent 免受提示注入攻击。

**实用场景：**
- 处理用户输入时：过滤恶意指令注入
- Agent 访问外部内容时：防止网页/邮件中的隐藏指令
- 多 Agent 通信时：防止 Agent 间的指令污染
- 工具调用时：防止通过工具返回值进行注入

**技术实现：**
- **多层防护架构：**
  - 输入层：模式检测与过滤
  - 记忆层：记忆完整性校验
  - 工具层：工具调用的安全包装器
- 检测常见注入模式：角色劫持、指令覆盖、间接注入
- 对可疑输入进行隔离和消毒
- 提供安全审计日志

```
用户输入 → [输入检测] → [记忆校验] → [工具安全包装] → Agent 核心
              ↓             ↓              ↓
           可疑隔离      完整性恢复     调用白名单过滤
```

**推荐指数：** ⭐⭐⭐⭐⭐

> 💡 **点评：** 安全不是可选项。随着 Agent 被赋予越来越多权限（文件、邮件、支付），提示注入攻击的后果越来越严重。这个 Skill 是 Agent 安全的基石。

---

### 5. 💰 tokenguard — Agent API 成本守护

**GitHub:** [openclaw/skills/tokenguard](https://github.com/openclaw/skills/tree/main/skills/g0head/tokenguard/SKILL.md)

**核心功能：** 实时监控 Agent 的 API 调用成本，防止"钱包失控"。

**实用场景：**
- 日常使用：设置每日/每月预算上限，超限自动告警
- 多 Agent 环境：追踪每个 sub-agent 的 token 消耗
- 成本优化：识别高消耗任务，寻找更经济的替代方案
- 开发调试：发现不必要的 API 调用和 token 浪费

**技术实现：**
- 拦截所有 LLM API 调用，记录 token 使用量
- 按模型、任务、时间维度统计成本
- 支持预算阈值告警（如 75%/90%/95% 预警）
- 与 token-alert 配合实现主动通知

```yaml
# 配置示例
budget:
  daily_limit: $5.00
  monthly_limit: $100.00
  alerts:
    - threshold: 75%
      action: notify
    - threshold: 90%
      action: notify + warn
    - threshold: 95%
      action: throttle
```

**推荐指数：** ⭐⭐⭐⭐

> 💡 **点评：** Agent 跑起来容易，停下来难。没有成本管控的 Agent 就像没装水表的自动浇水系统——等你发现时账单已经爆了。tokenguard 是生产环境的必备品。

---

## 应用场景总结

| 场景 | 推荐组合 | 说明 |
|------|---------|------|
| **个人助手** | agent-memory + metacognition | 让 Agent 越用越懂你 |
| **关键决策** | moa + anti-injection-skill | 多模型交叉验证 + 安全防护 |
| **生产部署** | tokenguard + anti-injection-skill + agent-memory | 成本管控 + 安全 + 记忆 |
| **开发调试** | tokenguard + metacognition | 成本追踪 + 行为分析 |
| **多 Agent 系统** | moa + agent-memory + anti-injection-skill | 协作 + 共享记忆 + 安全隔离 |

## 推荐指数排名

| 排名 | Skill | 评分 | 一句话评价 |
|------|-------|------|-----------|
| 🥇 | agent-memory | ⭐⭐⭐⭐⭐ | Agent 的记忆是一切的基础 |
| 🥈 | moa | ⭐⭐⭐⭐⭐ | 三个模型顶一个诸葛亮 |
| 🥉 | anti-injection-skill | ⭐⭐⭐⭐⭐ | 安全是 Agent 的生命线 |
| 4 | metacognition | ⭐⭐⭐⭐ | 让 Agent 学会思考自己的思考 |
| 5 | tokenguard | ⭐⭐⭐⭐ | 不装等于裸奔的成本监控 |

## 其他值得关注

184 个 Skill 无法逐一介绍，以下是按场景的快速推荐：

- **本地模型部署：** `llmfit`（硬件检测+模型推荐）、`modelready`（一键启动本地模型）
- **模型路由：** `switch-modes`（动态切换模型）、`arya-model-router`（省钱路由器）
- **语音处理：** `audio-processing`（全链路音频）、`zhipu-asr`（中文语音识别）
- **Agent 协作：** `agent-orchestration`（多 Agent 编排）、`multi-agent-collab`（协作方法论）
- **安全审计：** `arc-security-mcp`（安全情报）、`safety-checks`（运行时验证）

---

## 结语

AI & LLMs 分类是 OpenClaw 生态的"心脏"——184 个 Skill 覆盖了从底层记忆到上层应用的全链路。今天精选的 5 个 Skill 代表了这个分类的五个核心维度：**记忆、架构、认知、安全、成本**。

如果你刚开始使用 OpenClaw，建议按这个顺序安装：
1. 先装 `agent-memory`（让 Agent 有记忆）
2. 再装 `tokenguard`（防止费用失控）
3. 然后装 `anti-injection-skill`（保护 Agent 安全）
4. 按需装 `moa`（重要决策场景）
5. 最后装 `metacognition`（进阶优化）

> 🎋 明天我们将介绍 **apple-apps-and-services** 分类，敬请期待！

---

*本文由 OpenClaw 自动生成 | [博客首页](https://www.daoyuly.cn)*
