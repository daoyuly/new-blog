---
title: OpenClaw vs Claude Code 记忆管理设计深度分析
date: 2026-03-11 13:05:00
tags:
  - AI
  - 记忆系统
  - OpenClaw
  - Claude Code
  - 架构设计
categories:
  - 技术分析
---

# OpenClaw vs Claude Code 记忆管理设计分析

## 一、架构概览对比

### OpenClaw 记忆架构

```
~/.openclaw/workspace/
├── AGENTS.md          # 操作指令（每个会话加载）
├── SOUL.md            # 身份定义
├── USER.md            # 用户信息
├── MEMORY.md          # 长期记忆（仅主会话）
├── TOOLS.md           # 工具配置
├── memory/
│   ├── 2026-03-11.md  # 每日日志（append-only）
│   ├── 2026-03-10.md
│   └── ...
├── bank/              # 可选：结构化记忆
│   ├── entities/
│   ├── opinions.md
│   └── world.md
└── .memory/
    └── index.sqlite   # 派生索引（可重建）
```

### Claude Code 记忆架构

```
~/.claude/
├── CLAUDE.md          # 项目级指令（推荐放项目根目录）
├── memories/          # 可选：持久记忆
│   └── *.md
└── settings.json      # 配置
```

## 二、核心差异对比

| 维度 | OpenClaw | Claude Code |
|------|----------|-------------|
| **记忆载体** | Markdown 文件（源真相）+ SQLite 索引（派生） | Markdown 文件 |
| **检索方式** | 向量搜索 + BM25 + 混合检索 + MMR + 时间衰减 | 主要靠上下文注入，无自动检索 |
| **记忆层次** | 3层：每日日志 + 长期记忆 + 结构化bank | 2层：CLAUDE.md + memories/ |
| **会话隔离** | 主会话/子会话/群聊严格区分 | 无明确隔离 |
| **安全边界** | MEMORY.md 仅限主会话加载 | 无此机制 |
| **自动写入** | Hook 机制（/new, /reset 触发） | 无自动写入 |
| **压缩前处理** | 有（memory flush 机制） | 无 |

## 三、设计哲学差异

### OpenClaw：「可解释的离线优先记忆系统」

**核心原则：**

1. **Markdown 是真相源**
   - 人类可读、可编辑
   - Git 可追踪、可审计
   - 索引总是可重建

2. **分层记忆模型（受 Hindsight + Letta 启发）**
   ```
   Retain → Recall → Reflect
   ```
   - **Retain**: 每日日志添加 `## Retain` 结构化条目
   - **Recall**: 向量+关键词混合检索
   - **Reflect**: 定期提炼到 `bank/` 实体页面

3. **安全优先**
   - `MEMORY.md` 含敏感信息 → 仅主会话加载
   - 群聊/子会话无法访问长期记忆
   - 防止「记忆泄露」到陌生人

4. **工具化访问**
   ```typescript
   memory_search(query, {maxResults, minScore})
   memory_get(path, {from, lines})
   ```
   Agent 必须显式调用工具检索记忆

### Claude Code：「轻量级项目上下文注入」

**核心原则：**

1. **项目级配置优先**
   - `CLAUDE.md` 放项目根目录
   - 每次启动自动加载
   - 专注于「如何帮助这个项目」

2. **最小化设计**
   - 无复杂检索机制
   - 无分层记忆结构
   - 依赖模型自然「记住」注入的内容

3. **用户手动维护**
   - 记忆内容由用户主动编写
   - 无自动提炼/总结机制

## 四、关键技术决策分析

### 1. 为什么 OpenClaw 选择 SQLite 索引 + Markdown？

**问题：** 纯文件检索效率低，但纯数据库不可读

**解决方案：**
```
Markdown（真相）→ 索引（派生）→ 检索 → 引用原始 Markdown
```

**好处：**
- 向量搜索支持语义匹配（「Mac Studio gateway」≈「the machine running gateway」）
- BM25 支持精确匹配（ID、代码符号、错误字符串）
- 结果带 `Source: memory/2026-03-10.md#L12` 引用
- 索引损坏？删除重建即可，Markdown 仍完整

### 2. 为什么 Claude Code 不做自动记忆检索？

**假设：**
- Claude Code 定位是「代码助手」而非「个人助理」
- 项目上下文通常足够，不需要跨项目记忆
- 复杂记忆系统增加维护负担
- 让用户自己写 CLAUDE.md 更可控

**权衡：**
- ✅ 简单、可预测
- ❌ 无法回答「上次我们怎么处理这个问题来着？」
- ❌ 长期项目需要手动整理知识

### 3. 为什么 OpenClaw 强调会话隔离？

**场景：**
```
用户在 Telegram 群聊说：「帮我查一下上周的会议记录」
```

**风险：**
- 如果群聊能访问 MEMORY.md
- 可能泄露私人信息（家庭住址、密码提示等）

**解决方案：**
```json
{
  "load_MEMORY_md": {
    "main_session": true,   // ✅ 主会话加载
    "subagent": false,      // ❌ 子会话不加载
    "group_chat": false     // ❌ 群聊不加载
  }
}
```

### 4. 为什么 OpenClaw 有 memory flush 机制？

**问题：** 会话即将压缩时，上下文中的「临时记忆」会丢失

**解决方案：**
```json5
{
  memoryFlush: {
    enabled: true,
    softThresholdTokens: 4000,
    prompt: "Write any lasting notes to memory/YYYY-MM-DD.md; reply NO_REPLY"
  }
}
```

**流程：**
```
上下文接近压缩阈值
  → 触发 silent turn
  → Agent 被提醒写入持久记忆
  → 压缩发生
  → 记忆已保存到文件
```

## 五、适用场景分析

### OpenClaw 更适合：

1. **长期个人助理**
   - 需要记住数月/数年前的对话
   - 多项目、多上下文切换
   - 需要跨会话的知识积累

2. **多通道部署**
   - Telegram/Discord/WhatsApp 多平台
   - 不同通道有不同的隐私要求

3. **需要可解释性**
   - 「为什么你这么说？」
   - 可以追溯到具体记忆文件和行号

### Claude Code 更适合：

1. **单项目开发**
   - 专注于当前仓库
   - 不需要跨项目记忆

2. **轻量级配置**
   - 只需要一个 CLAUDE.md
   - 不想维护复杂的记忆系统

3. **可控性优先**
   - 用户完全控制写入什么
   - 不想要 Agent 自动「学习」

## 六、设计启示

### OpenClaw 的创新点：

1. **混合检索策略**
   ```typescript
   finalScore = 0.7 * vectorScore + 0.3 * bm25Score
   ```
   语义理解 + 精确匹配的结合

2. **时间衰减**
   ```
   decayedScore = score × e^(-λ × ageInDays)
   ```
   新记忆天然排名更高，避免旧信息干扰

3. **MMR 去重**
   避免返回 5 个几乎相同的结果

4. **Retain/Recall/Reflect 循环**
   从原始日志 → 结构化事实 → 实体知识图谱的演进

### Claude Code 的优势：

1. **极简主义**
   - 学习成本低
   - 配置文件少
   - 行为可预测

2. **项目优先**
   - CLAUDE.md 放在代码仓库
   - 团队可以共享配置
   - 版本控制自然集成

## 七、总结

| 设计选择 | OpenClaw 思考 | Claude Code 思考 |
|----------|--------------|-----------------|
| **复杂性** | 接受复杂性换取长期价值 | 保持简单，减少认知负担 |
| **记忆范围** | 跨项目、跨时间的个人助理 | 项目级代码助手 |
| **自动化程度** | 高（自动索引、自动flush） | 低（用户手动维护） |
| **安全边界** | 严格的会话隔离 | 依赖用户自觉 |
| **可解释性** | 每条记忆可溯源 | 上下文黑盒 |

**本质差异：**
- **OpenClaw** 设计为 **「会学习的个人助理」** —— 长期运行、持续积累、多通道服务
- **Claude Code** 设计为 **「懂项目的代码伙伴」** —— 轻量配置、即开即用、项目隔离

两种设计都有其合理性，关键在于使用场景。如果你需要一个长期陪伴、越用越懂你的助理，OpenClaw 的记忆架构更合适；如果你只需要一个了解当前项目惯例的编码助手，Claude Code 的极简设计更高效。

---

*本文分析了 OpenClaw 和 Claude Code 两种 AI Agent 记忆管理系统的设计差异，帮助理解不同设计背后的技术考量和适用场景。*
