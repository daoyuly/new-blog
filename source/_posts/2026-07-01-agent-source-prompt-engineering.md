---
title: Agent 源码研究技巧：从 Prompt Engineering 视角拆解 Claude Code
date: 2026-07-01 09:30:00
tags:
  - Agent
  - Prompt Engineering
  - Claude Code
  - 源码分析
categories:
  - AI Agent
---

研究一个 Agent 项目，最值钱的角度不是架构图，不是代码组织，而是 prompt。Prompt 才是 Agent 的灵魂——它定义了模型能做什么、怎么做、做到什么程度。

我用 Claude Code 的源码做了一次完整的 prompt 工程拆解，把这个方法论整理出来。

## 为什么先读 Prompt

一个 Agent 系统里，prompt 承载的东西远比想象中多：

- **身份与边界**：Agent 是谁、不能干什么
- **任务拆分**：大目标怎么变成可执行的小步骤
- **工具调度**：什么时候用什么工具、不用什么工具
- **安全护栏**：哪些操作必须确认、哪些可以自主
- **输出风格**：跟用户怎么说话、说多少

读懂了 prompt，你就读懂了设计者的全部意图。代码只是意图的实现方式。

## Claude Code 的 Prompt 架构全景

Claude Code 的 prompt 不是一个大字符串，而是**分层合成的数组**。核心文件就三个：

| 文件 | 行数 | 作用 |
|------|------|------|
| `constants/prompts.ts` | 914 | 主系统 prompt，定义身份、行为、风格 |
| `constants/systemPromptSections.ts` | 68 | 段落缓存机制 |
| `utils/systemPrompt.ts` | 123 | 合成优先级逻辑 |

加上 36 个工具各自的 `prompt.ts`，构成了完整的 prompt 体系。

### 分层结构

系统 prompt 按这个顺序合成：

```
1. 身份与行为边界 (Intro)
2. 系统级规则 (System)
3. 任务执行指南 (Doing Tasks)
4. 操作审慎性 (Actions)
5. 工具使用 (Using Tools)
6. 语气与风格 (Tone & Style)
7. 输出效率 (Output Efficiency)
8. ===== 动态边界 =====
9. 会话特有指令 (Session Guidance)
10. 记忆 (Memory)
11. 环境信息 (Environment)
12. MCP 指令
13. Scratchpad / Token Budget / 其他
```

这个顺序不是随便排的。前 7 层是**静态内容**，可以跨用户、跨会话缓存，省 token 省钱。第 8 层之后是**动态内容**，每轮可能变化。

这个设计的关键洞察：**缓存边界比 prompt 内容本身更重要**。如果你先写文案再考虑缓存，成本和延迟就不可控了。

### 合成优先级

`buildEffectiveSystemPrompt` 函数定义了覆盖优先级（从高到低）：

1. **overrideSystemPrompt**：完全替换（loop 模式等）
2. **Coordinator 模式**：协调者专用 prompt
3. **Agent 定义**：内置 agent 用动态 prompt，自定义 agent 用静态 prompt
4. **Proactive/KAIROS 模式**：agent 指令追加在默认 prompt 后
5. **customSystemPrompt**：CLI 传入的自定义 prompt
6. **defaultSystemPrompt**：标准 Claude Code prompt
7. **appendSystemPrompt**：追加段，几乎总在链尾

这个优先级保证了一个原则：**编排层可以覆盖，但安全基座不丢**（除非 override）。越靠后的层越"软"，越靠前的越"硬"。

## Prompt 的六层设计思路

### 第一层：身份与安全边界

```typescript
function getSimpleIntroSection(outputStyleConfig): string {
  return `You are an interactive agent that helps users...
    ${CYBER_RISK_INSTRUCTION}
    IMPORTANT: You must NEVER generate or guess URLs...`
}
```

开头就把身份和安全绑死。`CYBER_RISK_INSTRUCTION` 是 Safeguards 团队维护的独立常量，明确划定了防御性安全协助和攻击性操作的边界。

设计思路：**安全相关的 prompt 放在最前面、最难被覆盖的位置**。

### 第二层：系统级规则

这一层定义了 Agent 的基本行为范式：

- 工具执行需要用户权限确认
- 用户拒绝后不要重试相同的调用
- 注意 prompt injection，标记可疑内容
- 对话会自动压缩，不受上下文窗口限制

每条规则都是针对 LLM 已知弱点的**防护性设计**。比如"不要重试被拒绝的调用"——模型天然倾向于完成目标，被拒绝后会换个方式再试，这条规则就是刹车。

### 第三层：任务执行指南

这是 prompt 中最长、最精微的部分。关键设计：

**最小改动原则**——三条规则层层递进：
1. 不要加功能、重构或"改进"超出要求的东西
2. 不要为不可能发生的场景加错误处理
3. 三行相似的代码好过一个过早的抽象

这三条不是废话。LLM 天然倾向"多做一点"——加注释、加类型、加错误处理、加抽象。这些规则是在对抗模型的本能。

**反对称的忠告**——对内部用户（Ant），多了几条额外的规则：

```
默认不写注释。只在 WHY 不明显时才加一条。
不要解释代码做什么，命名良好的标识符已经做了。
不要删除已有注释——看起来没用的注释可能编码了某个约束。
完成前要验证：跑测试、执行脚本、检查输出。
```

这些规则是在修补特定模型的过度活跃行为（注释里标注了 `capy v8`，即 Claude Opus 4.6 的代号）。

**如实报告**——这也是内部用户专属的规则：

```
如果测试失败了，就说失败了，附上相关输出。
如果没有跑验证步骤，就说没有，不要暗示它成功了。
永远不要在输出显示失败时声称"所有测试通过"。
```

这条规则的存在本身就很说明问题——模型确实会在没验证的情况下声称成功。

### 第四层：操作审慎性

`getActionsSection()` 是一段极长的 prompt，主题就一个：**高风险操作必须确认**。

它列了四类风险操作：
- 破坏性操作：删文件、删分支、杀进程
- 难以逆转的操作：force push、reset --hard、改 CI/CD
- 对他人可见的操作：push 代码、发 PR、发消息
- 上传到第三方：可能泄露敏感信息

关键金句：

> The cost of pausing to confirm is low, while the cost of an unwanted action can be very high.

> Measure twice, cut once.

这不是法律文本式的规则，而是**说理式的引导**——告诉模型为什么，而不只是禁止。

### 第五层：工具使用

这层的核心设计是**工具偏好链**：

```
Read 代替 cat/head/tail
Edit 代替 sed/awk
Write 代替 echo/cat heredoc
Glob 代替 find/ls
Grep 代替 grep/rg
```

为什么不用 Bash？因为专用工具"让用户更好理解和审查你的工作"。这不是技术原因，是**可审查性**原因。

还有一个精巧的规则：**独立工具调用并行，依赖调用串行**。模型很容易一次只调一个工具，这条规则鼓励它最大化并行。

### 第六层：输出效率

内部用户和外部用户拿到完全不同的 prompt：

**外部用户**：
```
直奔主题。先用最简单的方法。不要过度。格外简洁。
能一句话说清的不要用三句。
```

**内部用户**（Ant）：
```
你在写给人看，不是在写日志。假设用户看不到工具调用和思考过程。
做之前简短说你要做什么。关键节点给短更新。
更新时假设对方刚回来、失去了上下文——用完整句子，展开术语。
避免语义回溯：让每句话可以线性阅读，不用回头重读。
```

两种风格的差异反映了不同的使用场景：外部用户需要快、需要简洁；内部用户在做复杂工程任务，需要上下文丰富的沟通。

## 36 个工具 Prompt 的设计模式

每个工具的 prompt 都遵循同样的模式：

1. **工具名称和描述**：模型可调用的 API 文档
2. **使用说明**：什么时候用、怎么用
3. **示例**：具体的调用示范
4. **反例**：什么时候不用

举几个有意思的：

### Agent Tool：委托的艺术

Agent Tool 的 prompt 最复杂，因为它要教模型**怎么写 prompt 给另一个模型**：

```
Brief the agent like a smart colleague who just walked into the room —
it hasn't seen this conversation, doesn't know what you've tried.

Never delegate understanding.
Don't write "based on your findings, fix the bug" —
those phrases push synthesis onto the agent instead of doing it yourself.
```

翻译：把子 agent 当成一个刚进办公室的聪明同事——它没看过之前的对话。写 prompt 要证明你理解了问题，而不是把理解的工作甩给子 agent。

### Bash Tool：沙箱与 Git 安全

Bash Tool 的 prompt 包含完整的 Git 操作安全协议：

- 永远不要用 `--no-verify` 跳过 hooks
- 永远不要 `--amend` 修改上一个 commit（pre-commit hook 失败后尤其危险）
- 不要用 `git add -A`，要指定文件名
- commit 消息用 HEREDOC 格式传递，确保格式正确

这些规则每一条都是踩过坑之后加的。

### File Edit Tool：先读再改

```
You must use your Read tool at least once before editing.
This tool will error if you attempt an edit without reading the file.
```

这条规则被**硬编码在工具逻辑里**，不只是 prompt 建议——不读就改，直接报错。Prompt 和代码双重约束。

## 缓存机制：省钱的艺术

`systemPromptSections.ts` 只有 68 行，但设计很精巧：

```typescript
// 稳定段：计算一次，缓存到 /clear 或 /compact
function systemPromptSection(name, compute) {
  return { name, compute, cacheBreak: false }
}

// 易变段：每轮重算，故意打破缓存
function DANGEROUS_uncachedSystemPromptSection(name, compute, reason) {
  return { name, compute, cacheBreak: true }
}
```

MCP 指令是 `DANGEROUS_uncached` 的典型——MCP 服务器随时可能连接或断开，每轮都可能变。如果把它放在静态段，一个 MCP 连接变化就会让整个 prompt 缓存失效。

还有一个优化：Agent 列表从工具描述中移到了 attachment 消息。原因是一个 MCP 插件加载/卸载会改变 agent 列表 → 改变工具描述 → 打破整个工具 schema 的缓存。分离后，工具描述保持稳定，只有 attachment 变化。

## 整体任务拆分图像

把 Claude Code 的 prompt 体系画成任务图：

```
用户请求
  │
  ├─ 识别任务类型
  │   ├─ 代码任务 → Doing Tasks 规则
  │   ├─ 安全相关 → CYBER_RISK_INSTRUCTION
  │   └─ 自主模式 → Proactive Section
  │
  ├─ 选择工具
  │   ├─ 文件操作 → Read/Edit/Write（优先于 Bash）
  │   ├─ 搜索 → Glob/Grep（优先于 find/grep 命令）
  │   ├─ 复杂任务 → Agent Tool（委托子 agent）
  │   └─ 系统命令 → Bash（最后手段）
  │
  ├─ 执行与安全
  │   ├─ 低风险 → 自主执行
  │   ├─ 高风险 → 确认后执行
  │   └─ 被拒绝 → 分析原因，不重试
  │
  └─ 输出与沟通
      ├─ 外部用户 → 极简风格
      ├─ 内部用户 → 上下文丰富风格
      └─ Proactive 模式 → Brief Tool
```

## 方法论总结：怎么研究一个 Agent 的 Prompt

1. **先找 prompt 文件**：搜索 `prompt.ts`、`system*`、`instruction*` 等关键词
2. **提取所有 prompt 文本**：不只是系统 prompt，工具 prompt 同等重要
3. **画合成链**：prompt 是怎么拼接的，顺序是什么，覆盖优先级怎么排
4. **找缓存边界**：哪些是静态的、哪些是动态的，为什么这样分
5. **分析每条规则的存在理由**：每条规则都是踩坑的产物，理解"为什么"比理解"是什么"重要
6. **对比内部/外部差异**：同一个项目对内部和外部用户给出不同 prompt，差异本身就是信息
7. **看代码中的硬约束**：prompt 说了"不要做 X"，代码里有没有检查？双重约束才是真约束

第七点尤其重要——很多 Agent 项目的 prompt 写了"不要做 X"，但代码里根本没检查。Claude Code 的 File Edit Tool 的"先读再改"则是在 prompt 和代码两个层面都做了约束，这才是可靠的设计。

## 参考资料

- [Claude Code 源码](https://github.com/anthropics/claude-code) - Anthropic 官方 CLI Agent
- [Prompt Caching 最佳实践](https://docs.anthropic.com/en/docs/build-with-claude/prompt-caching) - Anthropic 官方文档，解释缓存边界设计
- [Tool Use 设计指南](https://docs.anthropic.com/en/docs/build-with-claude/tool-use) - 工具 prompt 的设计原则
- [The Prompt Report: A Systematic Survey of Prompting Techniques](https://arxiv.org/abs/2406.06608) - 2024 年 prompt 技术系统综述
- [Prompt Programming for Large Language Models](https://arxiv.org/abs/2102.07350) - 早期 prompt 工程论文
- [ReAct: Synergizing Reasoning and Acting in Language Models](https://arxiv.org/abs/2210.03629) - Agent 推理+行动范式
- [Chain-of-Thought Prompting](https://arxiv.org/abs/2201.11903) - 思维链提示技术
- [Constitutional AI: Harmlessness from AI Feedback](https://arxiv.org/abs/2212.08011) - Claude 安全对齐方法论，影响安全 prompt 设计
