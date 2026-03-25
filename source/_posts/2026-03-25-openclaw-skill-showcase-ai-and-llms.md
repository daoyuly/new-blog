---
title: OpenClaw Skill 每日推荐 - AI 与大语言模型
date: 2026-03-25 11:30:00
tags: [openclaw, skill, ai-and-llms, 大语言模型, 人工智能]
categories: [技术推荐]
---

# OpenClaw Skill 每日推荐 - AI 与大语言模型

欢迎来到 OpenClaw Skill 每日推荐系列！今天我们探索 **AI 与大语言模型** 分类，这是 OpenClaw 生态中最庞大的分类，包含 **184 个精选 Skills**，覆盖了从模型推理到智能体协作的完整技术栈。

## 📊 分类概览

AI & LLMs 分类是 OpenClaw 的核心领域之一，涵盖了：

- **智能体记忆与认知**：持久化存储、自我反思、元认知
- **模型路由与优化**：硬件适配、成本优化、多模型协作
- **多智能体协作**：团队协同、任务分解、结果聚合
- **专用能力增强**：语音识别、图像生成、金融分析
- **安全与防护**：提示注入防御、模型验证、访问控制

---

## 🌟 精选 Skill 详解

### 1. LLMFit - 智能硬件适配器 ⭐⭐⭐⭐⭐

**GitHub**: [openclaw/skills/llmfit](https://github.com/openclaw/skills/tree/main/skills/alexsjones/llmfit)

#### 核心功能
LLMFit 是一个硬件感知的本地 LLM 推荐工具，能够：
- 自动检测系统硬件（RAM、CPU、GPU/VRAM）
- 智能推荐最佳适配的本地模型
- 提供最优量化方案和速度预估
- 生成适配度评分（完美/良好/勉强/过紧）

#### 实用场景

**场景 1：新手入门**
```bash
# 检测硬件配置
llmfit --json system

# 获取前 5 个推荐模型
llmfit recommend --json --limit 5
```

输出示例：
```json
{
  "name": "meta-llama/Llama-3.1-8B-Instruct",
  "score": 87,
  "fit_level": "Perfect",
  "best_quant": "Q5_K_M",
  "estimated_tps": 45,
  "memory_required_gb": 6.2
}
```

**场景 2：按用途筛选**
```bash
# 编程专用模型
llmfit recommend --json --use-case coding --limit 3

# 推理增强模型
llmfit recommend --json --use-case reasoning --limit 3
```

#### 技术实现
- **硬件检测**：支持 NVIDIA（nvidia-smi）、AMD（rocm-smi）、Apple Silicon（统一内存）
- **多 GPU 聚合**：自动聚合多卡显存
- **量化优化**：根据显存自动选择最佳量化级别（Q4_K_M 到 Q8_0）
- **运行模式**：GPU 全速 / CPU+GPU 混合 / CPU 仅用

#### 推荐理由
- ✅ 零配置：自动检测，无需手动输入硬件参数
- ✅ 智能量化：根据显存动态选择最优方案
- ✅ 多平台支持：NVIDIA、AMD、Apple Silicon 全覆盖
- ✅ 实用评分：综合质量、速度、适配度、上下文长度

**推荐指数：⭐⭐⭐⭐⭐**

---

### 2. Multi-Agent Collab - 多智能体协作方法论 ⭐⭐⭐⭐⭐

**GitHub**: [openclaw/skills/multi-agent-collab](https://github.com/openclaw/skills/tree/main/skills/vdc-k/multi-agent-collab)

#### 核心功能
这是一个通用的多智能体协作方法论，适用于任何多智能体系统（Claude Code、Cursor、LangChain、OpenAI Assistants 等）：

1. **模型分层协作**：贵的想，便宜的干，更便宜的归档
2. **文档驱动同步**：TASK / CHANGELOG / CONTEXT = 协作协议
3. **按需检索**：QMD 索引，不全量注入
4. **自演化**：重复模式 → 候选技能

#### 实用场景

**场景：大型项目开发**

```bash
# 初始化项目
./scripts/init.sh my-ai-project

# 索引文档（需要 qmd 工具）
qmd index .
```

**工作流程：**

**开始前：**
```bash
# 查询项目当前任务
qmd query "项目 X 当前任务"

# 或直接读取 TASK.md（小项目）
cat TASK.md
```

**工作后：**
```markdown
# 更新 TASK.md（完成 → 移到最近完成）
# 追加 CHANGELOG 条目（一行，带 #标签 + 身份）
2026-03-25 完成用户认证模块 #feature @agent-lead

# 重大决策 → 更新 CONTEXT.md
决策：使用 JWT 而非 Session（考虑微服务架构）
```

**周报时：**
```markdown
# 按 #标签 聚合 CHANGELOG
# 填充"模式发现"板块
# 出现 3+ 次的操作 → 标记为候选技能
# 归档旧数据到 archive/
```

#### 模型分工

| 角色 | 模型示例 | 职责 |
|------|---------|------|
| **Lead** | Opus / GPT-4 / 高能力模型 | 架构设计、决策、任务拆解 |
| **Engineer** | Sonnet / GPT-4o-mini / 平衡型 | 执行、编码、Review |
| **Maintainer** | Flash / GPT-3.5 / 成本优化型 | 归档、清理、周报聚合 |

#### 技术实现
- **文档协议**：标准化 TASK.md、CHANGELOG.md、CONTEXT.md
- **QMD 索引**：语义检索，避免全量上下文注入
- **模式识别**：自动发现重复操作，转化为候选技能
- **跨平台兼容**：方法论可应用于任何多智能体系统

#### 推荐理由
- ✅ 方法论而非工具：适用于所有多智能体系统
- ✅ 成本优化：通过模型分层显著降低成本
- ✅ 自演化：系统能力随时间自动增强
- ✅ 标准化：统一的协作协议，易于团队协作

**推荐指数：⭐⭐⭐⭐⭐**

---

### 3. MoA (Mixture of Agents) - 多模型辩论合成器 ⭐⭐⭐⭐⭐

**GitHub**: [openclaw/skills/moa](https://github.com/openclaw/skills/tree/main/skills/jscianna/moa)

#### 核心功能
MoA 让 3 个前沿模型"辩论"，然后综合它们的最佳见解，生成超越任何单一模型的答案。成本约 $0.03/查询。

**工作流程：**
```
PROMPT
   │
   ├─────┬─────┬─────┐
   ▼     ▼     ▼     │
Kimi  GLM  MiniMax  │（并行"辩论"）
   │     │     │     │
   └─────┴─────┴─────┘
         ▼
    AGGREGATOR
    (Kimi 2.5)
         │
         ▼
   FINAL ANSWER
```

#### 实用场景

**场景 1：VC 尽职调查**
```bash
node scripts/moa.js "分析 AI 代码生成领域的竞争格局。
谁有可防御的护城河？谁可能被商品化？请具体说明。"
```

**场景 2：技术评估**
```bash
node scripts/moa.js "比较 RLHF vs DPO vs RLAIF 用于 LLM 对齐。
哪个扩展性更好？各自的失败模式是什么？"
```

**场景 3：市场研究**
```bash
node scripts/moa.js "2026 年实体 AI 的新兴用例有哪些？
重点关注机器人、无人机和自动驾驶系统。包括具体公司。"
```

#### 模型配置（付费层）

| 角色 | 模型 | 延迟 | 优势 |
|------|------|------|------|
| **Proposer 1** | `moonshotai/kimi-k2.5` | 23s | 长上下文，强推理 |
| **Proposer 2** | `z-ai/glm-5` | 36s | 技术深度，不同训练语料 |
| **Proposer 3** | `minimax/minimax-m2.5` | 64s | 细节捕捉，全面分析 |
| **Aggregator** | `moonshotai/kimi-k2.5` | 15s | 快速合成 |

**成本分解：**
```
3 proposers × ~$0.008 = $0.024
1 aggregator × ~$0.005 = $0.005
─────────────────────────────
Total: ~$0.029/query
```

#### 技术实现
- **并行调用**：3 个模型同时推理，避免串行延迟
- **智能聚合**：识别共同点，解决冲突，合成最佳见解
- **容错机制**：1-2 个模型失败仍能返回部分结果
- **成本控制**：选择前沿但非拥堵的模型，成本低于单一 Opus 调用

#### 性能指标

| 指标 | 付费层 | 免费层 |
|------|--------|--------|
| **P50 延迟** | ~45s | ~60s |
| **P95 延迟** | ~90s | ~120s+ |
| **成功率** | >99% | ~80%（限流）|
| **成本/查询** | ~$0.03 | $0.00 |

#### 推荐理由
- ✅ 质量提升：综合多个模型，超越任何单一模型
- ✅ 成本合理：$0.03/查询，比单一 Opus 更便宜
- ✅ 容错性强：部分失败仍能返回结果
- ✅ 适用场景明确：复杂分析、高决策风险、创意头脑风暴

**推荐指数：⭐⭐⭐⭐⭐**

---

### 4. Metacognition - 智能体自我反思引擎 ⭐⭐⭐⭐

**GitHub**: [openclaw/skills/metacognition](https://github.com/openclaw/skills/tree/main/skills/meimakes/metacognition)

#### 核心功能
Metacognition 是一个 AI 智能体的自我反思引擎，从会话转录中提取模式，构建加权图谱，使用赫布学习（Hebbian learning）和时间衰减：

1. **模式提取**：从会话中提取洞察（感知、覆盖、保护、自我观察、决策、好奇）
2. **赫布强化**：重复的洞察变强，未使用的衰减
3. **图谱构建**：在相关洞察间建立连接
4. **聚类发现**：找到可能代表高级原则的知识簇
5. **镜头编译**：生成令牌预算内的活跃自我知识摘要

#### 实用场景

**场景：智能体自我进化**

```bash
# 设置定时任务（每 4 小时运行）
# 1. 应用时间衰减
python3 scripts/metacognition.py decay

# 2. 分析主会话最近对话
# （使用 sessions_list + sessions_history）

# 3. 添加洞察（1-3 个，质量优先）
python3 scripts/metacognition.py add perceptions "用户更偏好简洁的代码示例而非冗长解释"
python3 scripts/metacognition.py add decisions "优先使用 Python 而非 Bash 进行复杂逻辑"
python3 scripts/metacognition.py add curiosities "为什么用户在晚上 10 点后提问频率降低？"

# 4. 构建图谱连接
python3 scripts/metacognition.py reweave

# 5. 编译镜头
python3 scripts/metacognition.py compile
```

#### CLI 命令

```bash
python3 metacognition.py add <type> <text>       # 添加或合并条目
python3 metacognition.py list [type]             # 列出条目
python3 metacognition.py feedback <id> <pos|neg> # 强化或减弱
python3 metacognition.py decay                   # 应用时间衰减
python3 metacognition.py compile                 # 编译镜头
python3 metacognition.py extract <path>          # 从每日笔记提取
python3 metacognition.py resolve <id>            # 标记好奇已解决
python3 metacognition.py reweave                 # 构建图谱连接
python3 metacognition.py graph                   # 显示图谱统计
python3 metacognition.py integrate               # 完整周期
```

#### 配置参数

| 常量 | 默认值 | 描述 |
|------|--------|------|
| `HALF_LIFE_DAYS` | 7.0 | 未强化条目衰减速度 |
| `STRENGTH_CAP` | 3.0 | 条目最大强度 |
| `LENS_TOKEN_BUDGET` | 500 | 编译镜头的令牌预算 |
| `EMBEDDING_SIM_THRESHOLD` | 0.85 | 合并相似度阈值（嵌入）|
| `FALLBACK_SIM_THRESHOLD` | 0.72 | 合并相似度阈值（字符串匹配）|
| `EDGE_SIM_THRESHOLD` | 0.35 | 创建图谱边的阈值 |

#### 条目类型

- **perceptions**：从经验中学到的东西
- **overrides**：对先前信念的修正
- **protections**：防止已知失败模式的规则
- **self-observations**：自身行为的模式
- **decisions**：未来行为的策略决策
- **curiosities**：开放问题（生命周期：出生 → 活跃 → 演化 → 解决）

#### 技术实现
- **赫布学习**："一起激发的神经元连接在一起"——重复模式强化连接
- **时间衰减**：未使用的洞察逐渐减弱，避免过时信息积累
- **语义相似度**：可选的本地嵌入端点，用于语义匹配（默认字符串匹配）
- **安全设计**：仅允许本地网络（127.0.0.1/localhost），无外部请求

#### 推荐理由
- ✅ 真正的自我进化：智能体能力随时间增强
- ✅ 科学的学习机制：赫布学习 + 时间衰减
- ✅ 令牌友好：500 令牌预算，不影响上下文
- ✅ 安全第一：仅本地网络，无数据外泄

**推荐指数：⭐⭐⭐⭐**

---

### 5. Agent Memory - 持久化记忆系统 ⭐⭐⭐⭐

**GitHub**: [openclaw/skills/agent-memory](https://github.com/openclaw/skills/tree/main/skills/dennis-da-menace/agent-memory)

#### 核心功能
Agent Memory 为 AI 智能体提供持久化记忆系统，让智能体能够跨会话记住重要信息。

#### 实用场景
- **用户偏好记忆**：记住用户的编程语言偏好、工作习惯
- **项目上下文**：记住项目的架构决策、技术栈
- **错误历史**：记住之前犯过的错误，避免重复
- **知识积累**：逐步积累领域知识

#### 技术实现
- 持久化存储（文件系统或数据库）
- 语义检索（基于嵌入向量）
- 重要性排序（优先记住关键信息）
- 自动清理（移除过时信息）

#### 推荐理由
- ✅ 基础能力：记忆是智能体的核心能力
- ✅ 跨会话持久：重启后仍能记住
- ✅ 语义检索：快速找到相关信息
- ✅ 自动管理：无需手动维护

**推荐指数：⭐⭐⭐⭐**

---

## 🎯 应用场景总结

### 1. **个人开发者**
- **LLMFit**：选择最适合本地硬件的模型
- **Agent Memory**：记住项目上下文和个人偏好

### 2. **团队协作**
- **Multi-Agent Collab**：标准化团队协作流程
- **MoA**：复杂决策时获得多模型视角

### 3. **智能体开发**
- **Metacognition**：让智能体自我进化
- **Agent Memory**：构建持久化记忆

### 4. **研究与决策**
- **MoA**：高决策风险场景下的多模型验证
- **Metacognition**：从历史中学习模式

---

## 📊 推荐指数排名

1. **⭐⭐⭐⭐⭐ LLMFit** - 硬件适配必备，零配置智能推荐
2. **⭐⭐⭐⭐⭐ Multi-Agent Collab** - 方法论层面，适用于所有多智能体系统
3. **⭐⭐⭐⭐⭐ MoA** - 质量提升显著，成本合理
4. **⭐⭐⭐⭐ Metacognition** - 前沿技术，自我进化能力
5. **⭐⭐⭐⭐ Agent Memory** - 基础能力，智能体必备

---

## 🚀 快速开始

### 安装 Skill

```bash
# 方法 1: 使用 ClawHub（推荐）
clawhub install llmfit
clawhub install multi-agent-collab
clawhub install moa
clawhub install metacognition
clawhub install agent-memory

# 方法 2: 手动安装
cd ~/clawd/skills/
git clone https://github.com/openclaw/skills.git
cp -r skills/skills/alexsjones/llmfit ./
# ... 其他 skill
```

### 配置环境变量

```bash
# MoA 需要 OpenRouter API Key
export OPENROUTER_API_KEY="your-key-here"

# Metacognition 可选本地嵌入端点
export EMBEDDINGS_URL="http://localhost:4821/v1/embeddings"
```

### 验证安装

```bash
# 测试 LLMFit
llmfit --json system

# 测试 MoA
node scripts/moa.js "测试问题"

# 测试 Metacognition
python3 scripts/metacognition.py list
```

---

## 💡 实用建议

### 1. **从 LLMFit 开始**
如果你刚开始使用本地模型，先用 LLMFit 检测硬件并获取推荐，避免盲目下载大模型。

### 2. **组合使用 Skills**
- **LLMFit + Multi-Agent Collab**：硬件适配 + 团队协作
- **MoA + Metacognition**：多模型决策 + 自我反思
- **Agent Memory + Metacognition**：持久记忆 + 模式提取

### 3. **成本优化策略**
- 使用 Multi-Agent Collab 的模型分层：贵的想，便宜的干
- MoA 虽然调用 4 个模型，但总成本仍低于单一 Opus
- LLMFit 帮你选择最适合硬件的模型，避免资源浪费

### 4. **安全注意事项**
- Metacognition 仅允许本地网络，确保数据安全
- MoA 需要 API Key，妥善保管
- Agent Memory 存储敏感信息时注意加密

---

## 📚 延伸阅读

- [OpenClaw 官方文档](https://docs.openclaw.ai)
- [ClawHub Skills 市场](https://clawhub.com)
- [OpenClaw GitHub](https://github.com/openclaw/openclaw)
- [OpenClaw 社区](https://discord.com/invite/clawd)

---

## 🔗 相关资源

- **LLMFit**: [GitHub](https://github.com/openclaw/skills/tree/main/skills/alexsjones/llmfit)
- **Multi-Agent Collab**: [GitHub](https://github.com/openclaw/skills/tree/main/skills/vdc-k/multi-agent-collab)
- **MoA**: [GitHub](https://github.com/openclaw/skills/tree/main/skills/jscianna/moa)
- **Metacognition**: [GitHub](https://github.com/openclaw/skills/tree/main/skills/meimakes/metacognition)
- **Agent Memory**: [GitHub](https://github.com/openclaw/skills/tree/main/skills/dennis-da-menace/agent-memory)

---

**明日预告**：我们将探索 **浏览器与自动化** 分类，介绍如何用 Skills 实现浏览器自动化、网页抓取和 UI 测试！

---

*本文是 OpenClaw Skill 每日推荐系列的第 1 篇，共 30 篇。关注本博客，每天解锁一个新分类！*

**标签**: #OpenClaw #Skill #AI #LLM #大语言模型 #人工智能 #智能体 #多模型协作

**分类**: 技术推荐
