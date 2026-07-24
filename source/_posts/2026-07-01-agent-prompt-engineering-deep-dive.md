---
title: Agent 源码研究技巧：从 Prompt Engineering 视角拆解 Agent 运行
tags:
  - Agent
  - Prompt Engineering
  - 源码分析
  - Claude Code
  - OpenManus
  - SWE-Agent
  - DeerFlow
  - YoAgent
categories:
  - AI Agent
abbrlink: 28307
date: 2026-07-01 10:45:00
description: "研究 Agent 源码，最快的方式不是从入口函数往下追调用链，而是直接读 prompt。Prompt 是 Agent 的灵魂——它定义了模型能做什么、怎么做、做到什么程度、什么时候停。读懂了 prompt，整个系统的设计意图就暴露了。"
keywords: "agent, 源码研究技巧, prompt, engineering, 视角拆解, Agent, Prompt Engineering, 源码分析"
---
<!-- GEO citation meta
citation_arxiv_id: 2406.06608
citation_arxiv_id: 2210.03629
citation_arxiv_id: 2212.08011
-->

研究 Agent 源码，最快的方式不是从入口函数往下追调用链，而是直接读 prompt。Prompt 是 Agent 的灵魂——它定义了模型能做什么、怎么做、做到什么程度、什么时候停。读懂了 prompt，整个系统的设计意图就暴露了。

我用五个开源 Agent 项目做了一次横向对比：Claude Code、OpenManus、SWE-Agent、DeerFlow、YoAgent。它们的 prompt 设计差异极大，从几百字到上万字，从单块字符串到分层合成数组。这些差异本身就是设计哲学的直接体现。

## 五个项目，五种 Prompt 架构

### Case 1：Claude Code——分层合成的工程极限

Claude Code 是 prompt 工程最复杂的 Agent 之一。914 行系统 prompt + 36 个工具 prompt，不是一个大字符串，而是**分层合成的数组**。

**架构要点：**

- prompt 是数组，支持分段缓存
- `SYSTEM_PROMPT_DYNAMIC_BOUNDARY` 切分静态段和动态段
- 静态段（身份、规则、工具说明）可跨用户缓存
- 动态段（环境信息、MCP 指令、session 指令）每轮重算
- 7 层合成优先级，安全基座在底层，覆盖只能从上往下

**关键设计：**

```
主系统 prompt 组成：
1. 身份与安全边界 (Intro)
2. 系统级规则 (System)
3. 任务执行指南 (Doing Tasks)     ← 最长，对抗模型本能
4. 操作审慎性 (Actions)
5. 工具使用 (Using Tools)
6. 语气与风格 (Tone & Style)
7. 输出效率 (Output Efficiency)
   ═══ 动态边界 ═══
8. 会话指令 + 记忆 + 环境 + MCP
```

Doing Tasks 段最精妙——三条递进规则在对抗 LLM 天然的"多做一点"倾向：不要加多余功能、不要加不可能发生的错误处理、三行相似代码好过过早抽象。这些规则不是在教模型写代码，而是在**刹车**。

对内部用户还有额外规则："如果测试失败了就说失败了""永远不要在输出显示失败时声称所有测试通过"。这些规则的存在本身说明——模型确实会在没验证时声称成功。

**为什么这么复杂？** Claude Code 是面向专业开发者的生产工具，跑在真实的代码仓库里，一行错误修改就可能造成生产事故。复杂度是对风险的对冲。

### Case 2：OpenManus——角色分化的精简派

OpenManus 的 prompt 完全是另一种哲学：每个 agent 角色一个独立 prompt 文件，极简，职责清晰。

**架构要点：**

- `app/prompt/` 目录下 8 个文件，每个对应一种 agent
- BaseAgent 定义 `system_prompt` + `next_step_prompt` 双 prompt 结构
- `max_steps=10` 硬限制循环次数

**各角色 prompt 对比：**

| Agent | system_prompt 字数 | 核心指令 |
|-------|-------|---------|
| Manus（通用） | ~50 | 全能助手，用工具解决任务 |
| ToolCall | ~10 | 执行工具调用，停时用 terminate |
| SWE | ~200 | 自主程序员，命令行界面，每次只调一个工具 |
| Browser | ~500 | 浏览器自动化，JSON 格式响应，交互元素用索引标记 |
| Planning | ~150 | 规划 agent，用 planning 工具管理步骤 |
| MCP | ~150 | MCP 工具调用，先检查可用工具 |

有意思的发现：**角色越专一，prompt 越长**。通用 Manus 只有 50 个字，而 Browser Agent 有 500 字——因为浏览器操作有大量格式约束（JSON 输出、元素索引、交互规则）。这告诉我们：**prompt 的复杂度和任务域的约束成正比**，不是和任务难度成正比。

SWE Agent 的 prompt 里有条看似啰嗦的规则："If you'd like to issue two commands at once, PLEASE DO NOT DO THAT!" 大写强调模型不要并行调用工具。为什么？因为 SWE-Agent 的执行环境不支持并发命令，模型如果不被显式禁止，会试图同时调两个工具来"提效"。

**双 prompt 结构的设计意图**：`system_prompt` 定义角色身份，`next_step_prompt` 每轮注入驱动下一步行动。分离后，system_prompt 可以走缓存，next_step_prompt 每轮变化。这和 Claude Code 的动态边界是同一个思路，只是实现更简单。

### Case 3：SWE-Agent——思考与行动的双人舞

SWE-Agent 采用了独特的双 agent 架构：Architect（思考）+ Developer（执行），prompt 完全分离。

**架构要点：**

- Architect 的 `think_step_prompt`：只能推理和给建议，不能调工具
- Developer 的 `act_step_prompt`：只能执行，不能自己推理
- 额外的 `conduct_research_plan_prompt`、`get_clear_implementation_plan` 等阶段 prompt
- `create_diff_prompt`：专门用于生成代码差异

**think_step_prompt 核心结构：**

```markdown
You are an AI Software Architecture assisting a Human Software Engineer.
You have tools but CANNOT invoke them directly — you ADVISE.

Output structure:
## Your reasoning
（关于下一步的推理，聚焦下一个原子步骤）

## Instructions to the engineer
Tool to use: ...
File path: ...
```

**act_step_prompt 核心结构：**

```markdown
You are a Software Engineering Agent, operating under the guidance of 
a Senior AI Software Architecture Consultant.
Your role is to STRICTLY FOLLOW his thought process.
Do NOT introduce your own reasoning — adhere entirely to the consultant's.
YOU MUST focus on the last <thought> and execute the tool accordingly.
```

这个设计的精妙之处：**把推理和执行硬拆成两个独立的上下文**。Architect 看不到工具结果细节，Developer 看不到完整的推理过程。这避免了"确认偏误"——如果一个 agent 既推理又执行，它倾向于用自己的推理来解释执行结果，即使结果已经偏离了。

代价是上下文切换的 overhead。但 SWE 场景下，准确性的收益远大于效率的损失。

**阶段 prompt 的设计**：SWE-Agent 把"解决一个 bug"拆成多个阶段——研究、规划、实现、验证。每个阶段有独立的 prompt，控制模型的注意力焦点。这是一种**时间维度的 prompt 分层**，Claude Code 是空间维度（同时存在的段），SWE-Agent 是时间维度（先后出现的段）。

### Case 4：DeerFlow——模板化组装与记忆注入

DeerFlow 的 prompt 系统最"工程化"——用 Python 模板语言动态组装，支持记忆注入、skill 注入、子 agent 注入。

**架构要点：**

- `SYSTEM_PROMPT_TEMPLATE` 是一个大模板，用 `.format()` 填充动态段
- 领导 agent prompt 由 8+ 个动态段组成
- 独立的 Memory Agent 有自己的 `MEMORY_UPDATE_PROMPT`
- Skill 加载遵循 AgentSkills 开放标准，分三层注入：元数据→指令→资源

**SYSTEM_PROMPT_TEMPLATE 关键动态段：**

```python
prompt = SYSTEM_PROMPT_TEMPLATE.format(
    agent_name=agent_name,           # Agent 名称
    soul=get_agent_soul(agent_name), # 从配置加载的"灵魂"
    skills_section=skills_section,   # 可用 skills 列表
    memory_context=memory_context,   # 长期记忆注入
    subagent_section=subagent_section, # 可用子 agent 列表
    subagent_reminder=subagent_reminder, # 子 agent 约束提醒
    subagent_thinking=subagent_thinking, # 分解思考引导
    acp_section=acp_and_mounts_section, # ACP 外部 agent 挂载
)
```

**记忆注入的安全设计**：DeerFlow 的 memory prompt 模板把记忆放在 `<current_memory>` 标签里，更新指令要求"执行结构化反思"——先检测错误/重试、用户纠正、项目约束发现，再提取事实。这不是简单的"记住用户说了什么"，而是一个**带纠错机制的认知更新流程**。

**子 agent 分解约束**：模板里有条动态规则——"如果任务能拆成 2+ 个并行子任务，必须计数。如果数量 > N，必须分批，每次最多 N 个 task 调用。" 这条规则的 N 值是运行时计算的，取决于系统配置。这是一种**参数化的 prompt 约束**，比硬编码更灵活。

**soul（灵魂）机制**：DeerFlow 允许通过配置文件定义 agent 的"灵魂"——个性、语气、价值观。这和 OpenClaw 的 SOUL.md 是同一个思路，但 DeerFlow 把它作为 prompt 模板的一个参数注入。好处是同一个代码可以跑不同性格的 agent。

### Case 5：YoAgent——Progressive Disclosure 的优雅实现

YoAgent 是 Rust 写的极简 Agent 运行时，prompt 设计遵循一个原则：**渐进披露**。

**架构要点：**

- Skill 注入分三层：元数据（~100 token/skill，常驻系统 prompt）→ 指令（<5k token，激活时加载）→ 资源（无限，按需加载）
- Agent 自己决定何时激活 skill，不需要触发引擎
- 系统本身几乎不写死 prompt，而是通过 skill 组合出来

```rust
/// Progressive Disclosure:
/// 1. Metadata (~100 tokens/skill) — name + description, always in system prompt
/// 2. Instructions (<5k tokens) — SKILL.md body, loaded when activated
/// 3. Resources (unlimited) — scripts/, references/, assets/, loaded on demand
///
/// The agent decides when to activate a skill based on the description.
/// No trigger engine needed — the LLM is smart enough.
```

这个设计的关键假设：**LLM 足够聪明，能根据 skill 描述自己决定要不要激活**。不需要写规则引擎、不需要关键词匹配。skill 的 description 写清楚就行。

和 Claude Code 的对比很有意思：Claude Code 把所有工具的详细说明都放在系统 prompt 里，YoAgent 只放名字和一句话描述。Claude Code 用 token 换确定性，YoAgent 用 LLM 的判断力换 token 效率。两种取舍都对——取决于你的场景是否允许模型"判断错误"。

## 五种架构的横向对比

| 维度 | Claude Code | OpenManus | SWE-Agent | DeerFlow | YoAgent |
|------|-------------|-----------|-----------|----------|---------|
| prompt 规模 | ~1000行+36工具 | 8文件×50-500字 | 11个阶段文件 | 动态模板 | 极简+skill |
| 组织方式 | 分层合成数组 | 角色分化文件 | 阶段化文件 | 模板.format() | 渐进披露 |
| 缓存设计 | 显式动态边界 | 双prompt分离 | 阶段切换自动 | 模板参数动态 | 三层按需 |
| 安全约束 | 最强（7层优先级） | 最弱（几乎无） | 中（分离推理执行） | 中（参数化约束） | 依赖skill |
| 记忆系统 | workspace文件 | 内置memory字段 | scratchpad | 独立Memory Agent | 无（skill承载） |
| 子agent | AgentTool+worktree | 无 | Architect+Developer | task工具+并行约束 | 无 |

## 从 Prompt 反推系统设计意图

### prompt 长度 → 信任度

Claude Code 的 prompt 最长，因为它对模型的**信任度最低**。每条规则都是在堵一个已知的模型缺陷。OpenManus 的 prompt 最短，因为它对模型的信任度最高——"你是全能助手，自己看着办"。

信任度和场景风险正相关：Claude Code 跑在生产代码上，一行错改就是事故；OpenManus 是通用助手，错了大不了重来。

### prompt 结构 → 并发模型

- Claude Code 的分层合成 → 单 agent 多能力，顺序执行
- OpenManus 的角色分化 → 多 agent 各干各的，互相独立
- SWE-Agent 的思考/执行分离 → 串行双 agent，交替推进
- DeerFlow 的模板组装 → 领导 agent + 多 worker agent，并行调度

prompt 的组织方式直接反映了系统的并发模型。

### 缓存边界 → 成本敏感度

所有项目都在做某种形式的 prompt 缓存，但粒度不同：

- Claude Code：段级别缓存，显式动态边界，`DANGEROUS_uncachedSystemPromptSection`
- OpenManus：system_prompt / next_step_prompt 二分
- DeerFlow：模板参数分离，静态模板可缓存
- YoAgent：三层渐进披露，元数据常驻

共同规律：**越难变化的放越前面，越容易变化的放越后面或按需加载**。这不是 prompt 技巧，这是缓存设计的基本原则。

### 约束位置 → 可靠性

| 约束类型 | 只在 prompt 里 | prompt + 代码双重 |
|---------|--------------|-----------------|
| "先读再改" | 大多数项目 | Claude Code |
| "每次只调一个工具" | SWE-Agent, OpenManus | Claude Code (concurrency safe) |
| "不要修改安全指令" | DeerFlow | Claude Code (priority chain) |
| "测试通过才算完成" | DeerFlow (memory prompt) | Claude Code (verification step) |

关键洞察：**只在 prompt 里的约束是"建议"，prompt + 代码双重约束才是"规则"**。Claude Code 的可靠性最高，不是因为 prompt 写得好，而是因为关键约束在代码里也有 enforcement。

## 方法论：怎么从一个 Agent 的 Prompt 反推整个系统

1. **提取所有 prompt**——不只是系统 prompt，工具 prompt、阶段 prompt、记忆 prompt 都要读
2. **数 prompt 数量和长度**——数量反映角色分化度，长度反映信任度/风险度
3. **画合成链**——prompt 怎么拼的，顺序是什么，哪些可缓存
4. **找安全约束**——哪些约束只在 prompt 里，哪些有代码支撑
5. **找模型弱点的补丁**——每条"不要做 X"的规则，都对应一个已知的模型缺陷
6. **对比角色差异**——同一个项目里不同角色的 prompt 差异，反映职责边界
7. **追踪动态段**——什么信息是运行时注入的，注入点在哪，这些是系统的"活的部分"

第 5 条最值钱。Claude Code 里"不要在没验证时声称成功"这条规则，直接告诉你：模型有"虚报完成"的倾向。SWE-Agent 里"PLEASE DO NOT DO THAT"的大写警告，直接告诉你：模型有"并行调工具"的倾向。这些规则是**模型行为缺陷的活地图**。

## 参考资料

- [Claude Code 源码](https://github.com/anthropics/claude-code) — 分层合成 prompt 架构
- [OpenManus 源码](https://github.com/mannaandpoem/OpenManus) — 角色分化 prompt 架构
- [SWE-Agent 源码](https://github.com/SWE-agent/SWE-agent) — 思考/执行分离 prompt 架构
- [DeerFlow 源码](https://github.com/bytedance/deer-flow) — 模板化组装 prompt 架构
- [YoAgent 源码](https://github.com/anthropics/yoagent) — 渐进披露 prompt 架构
- [The Prompt Report: A Systematic Survey of Prompting Techniques](https://arxiv.org/abs/2406.06608) [Kimi解读](http://kimi.com/_prefill_chat?prefill_prompt=%E6%88%91%E4%BB%AC%E8%A6%81%E8%AE%A8%E8%AE%BA%E7%9A%84%E8%AE%BA%E6%96%87%E6%98%AF2406.06608%EF%BC%8C%E9%93%BE%E6%8E%A5%E6%98%AF%20https%3A//arxiv.org/pdf/2406.06608%20%EF%BC%8C%E5%B7%B2%E6%9C%89%E7%9A%84FAQ%E9%93%BE%E6%8E%A5%E6%98%AF%20https%3A//papers.cool/arxiv/kimi%3Fpaper%3D2406.06608%20%E3%80%82%E8%AF%B7%E4%BB%A5%E6%AD%A4%E4%B8%BA%E5%9F%BA%E7%A1%80%EF%BC%8C%E7%BB%A7%E7%BB%AD%E5%9B%9E%E7%AD%94%E6%88%91%E5%90%8E%E9%9D%A2%E7%9A%84%E9%97%AE%E9%A2%98%E3%80%82&system_prompt=%E4%BD%A0%E6%98%AF%E4%B8%80%E4%B8%AA%E5%AD%A6%E6%9C%AF%E5%8A%A9%E6%89%8B%EF%BC%8C%E5%90%8E%E9%9D%A2%E7%9A%84%E5%AF%B9%E8%AF%9D%E5%B0%86%E5%9B%B4%E7%BB%95%E7%9D%80%E4%BB%A5%E4%B8%8B%E8%AE%BA%E6%96%87%E5%86%85%E5%AE%B9%E8%BF%9B%E8%A1%8C%EF%BC%8C%E5%B7%B2%E7%BB%8F%E9%80%9A%E8%BF%87%E9%93%BE%E6%8E%A5%E7%BB%99%E5%87%BA%E4%BA%86%E8%AE%BA%E6%96%87%E7%9A%84PDF%E5%92%8C%E8%AE%BA%E6%96%87%E5%B7%B2%E6%9C%89%E7%9A%84FAQ%E3%80%82%E7%94%A8%E6%88%B7%E5%B0%86%E7%BB%A7%E7%BB%AD%E5%90%91%E4%BD%A0%E5%92%A8%E8%AF%A2%E8%AE%BA%E6%96%87%E7%9A%84%E7%9B%B8%E5%85%B3%E9%97%AE%E9%A2%98%EF%BC%8C%E8%AF%B7%E4%BD%A0%E4%BD%9C%E5%87%BA%E4%B8%93%E4%B8%9A%E7%9A%84%E5%9B%9E%E7%AD%94%EF%BC%8C%E4%B8%8D%E8%A6%81%E5%87%BA%E7%8E%B0%E7%AC%AC%E4%B8%80%E4%BA%BA%E7%A7%B0%EF%BC%8C%E5%BD%93%E6%B6%89%E5%8F%8A%E5%88%B0%E5%88%86%E7%82%B9%E5%9B%9E%E7%AD%94%E6%97%B6%EF%BC%8C%E9%BC%93%E5%8A%B1%E4%BD%A0%E4%BB%A5markdown%E6%A0%BC%E5%BC%8F%E8%BE%93%E5%87%BA%E3%80%82&send_immediately=true) — prompt 技术系统综述
- [Prompt Caching 最佳实践](https://docs.anthropic.com/en/docs/build-with-claude/prompt-caching) — 缓存边界设计
- [Tool Use 设计指南](https://docs.anthropic.com/en/docs/build-with-claude/tool-use) — 工具 prompt 设计原则
- [ReAct: Synergizing Reasoning and Acting](https://arxiv.org/abs/2210.03629) [Kimi解读](http://kimi.com/_prefill_chat?prefill_prompt=%E6%88%91%E4%BB%AC%E8%A6%81%E8%AE%A8%E8%AE%BA%E7%9A%84%E8%AE%BA%E6%96%87%E6%98%AF2210.03629%EF%BC%8C%E9%93%BE%E6%8E%A5%E6%98%AF%20https%3A//arxiv.org/pdf/2210.03629%20%EF%BC%8C%E5%B7%B2%E6%9C%89%E7%9A%84FAQ%E9%93%BE%E6%8E%A5%E6%98%AF%20https%3A//papers.cool/arxiv/kimi%3Fpaper%3D2210.03629%20%E3%80%82%E8%AF%B7%E4%BB%A5%E6%AD%A4%E4%B8%BA%E5%9F%BA%E7%A1%80%EF%BC%8C%E7%BB%A7%E7%BB%AD%E5%9B%9E%E7%AD%94%E6%88%91%E5%90%8E%E9%9D%A2%E7%9A%84%E9%97%AE%E9%A2%98%E3%80%82&system_prompt=%E4%BD%A0%E6%98%AF%E4%B8%80%E4%B8%AA%E5%AD%A6%E6%9C%AF%E5%8A%A9%E6%89%8B%EF%BC%8C%E5%90%8E%E9%9D%A2%E7%9A%84%E5%AF%B9%E8%AF%9D%E5%B0%86%E5%9B%B4%E7%BB%95%E7%9D%80%E4%BB%A5%E4%B8%8B%E8%AE%BA%E6%96%87%E5%86%85%E5%AE%B9%E8%BF%9B%E8%A1%8C%EF%BC%8C%E5%B7%B2%E7%BB%8F%E9%80%9A%E8%BF%87%E9%93%BE%E6%8E%A5%E7%BB%99%E5%87%BA%E4%BA%86%E8%AE%BA%E6%96%87%E7%9A%84PDF%E5%92%8C%E8%AE%BA%E6%96%87%E5%B7%B2%E6%9C%89%E7%9A%84FAQ%E3%80%82%E7%94%A8%E6%88%B7%E5%B0%86%E7%BB%A7%E7%BB%AD%E5%90%91%E4%BD%A0%E5%92%A8%E8%AF%A2%E8%AE%BA%E6%96%87%E7%9A%84%E7%9B%B8%E5%85%B3%E9%97%AE%E9%A2%98%EF%BC%8C%E8%AF%B7%E4%BD%A0%E4%BD%9C%E5%87%BA%E4%B8%93%E4%B8%9A%E7%9A%84%E5%9B%9E%E7%AD%94%EF%BC%8C%E4%B8%8D%E8%A6%81%E5%87%BA%E7%8E%B0%E7%AC%AC%E4%B8%80%E4%BA%BA%E7%A7%B0%EF%BC%8C%E5%BD%93%E6%B6%89%E5%8F%8A%E5%88%B0%E5%88%86%E7%82%B9%E5%9B%9E%E7%AD%94%E6%97%B6%EF%BC%8C%E9%BC%93%E5%8A%B1%E4%BD%A0%E4%BB%A5markdown%E6%A0%BC%E5%BC%8F%E8%BE%93%E5%87%BA%E3%80%82&send_immediately=true) — 推理-行动循环范式
- [Constitutional AI](https://arxiv.org/abs/2212.08011) [Kimi解读](http://kimi.com/_prefill_chat?prefill_prompt=%E6%88%91%E4%BB%AC%E8%A6%81%E8%AE%A8%E8%AE%BA%E7%9A%84%E8%AE%BA%E6%96%87%E6%98%AF2212.08011%EF%BC%8C%E9%93%BE%E6%8E%A5%E6%98%AF%20https%3A//arxiv.org/pdf/2212.08011%20%EF%BC%8C%E5%B7%B2%E6%9C%89%E7%9A%84FAQ%E9%93%BE%E6%8E%A5%E6%98%AF%20https%3A//papers.cool/arxiv/kimi%3Fpaper%3D2212.08011%20%E3%80%82%E8%AF%B7%E4%BB%A5%E6%AD%A4%E4%B8%BA%E5%9F%BA%E7%A1%80%EF%BC%8C%E7%BB%A7%E7%BB%AD%E5%9B%9E%E7%AD%94%E6%88%91%E5%90%8E%E9%9D%A2%E7%9A%84%E9%97%AE%E9%A2%98%E3%80%82&system_prompt=%E4%BD%A0%E6%98%AF%E4%B8%80%E4%B8%AA%E5%AD%A6%E6%9C%AF%E5%8A%A9%E6%89%8B%EF%BC%8C%E5%90%8E%E9%9D%A2%E7%9A%84%E5%AF%B9%E8%AF%9D%E5%B0%86%E5%9B%B4%E7%BB%95%E7%9D%80%E4%BB%A5%E4%B8%8B%E8%AE%BA%E6%96%87%E5%86%85%E5%AE%B9%E8%BF%9B%E8%A1%8C%EF%BC%8C%E5%B7%B2%E7%BB%8F%E9%80%9A%E8%BF%87%E9%93%BE%E6%8E%A5%E7%BB%99%E5%87%BA%E4%BA%86%E8%AE%BA%E6%96%87%E7%9A%84PDF%E5%92%8C%E8%AE%BA%E6%96%87%E5%B7%B2%E6%9C%89%E7%9A%84FAQ%E3%80%82%E7%94%A8%E6%88%B7%E5%B0%86%E7%BB%A7%E7%BB%AD%E5%90%91%E4%BD%A0%E5%92%A8%E8%AF%A2%E8%AE%BA%E6%96%87%E7%9A%84%E7%9B%B8%E5%85%B3%E9%97%AE%E9%A2%98%EF%BC%8C%E8%AF%B7%E4%BD%A0%E4%BD%9C%E5%87%BA%E4%B8%93%E4%B8%9A%E7%9A%84%E5%9B%9E%E7%AD%94%EF%BC%8C%E4%B8%8D%E8%A6%81%E5%87%BA%E7%8E%B0%E7%AC%AC%E4%B8%80%E4%BA%BA%E7%A7%B0%EF%BC%8C%E5%BD%93%E6%B6%89%E5%8F%8A%E5%88%B0%E5%88%86%E7%82%B9%E5%9B%9E%E7%AD%94%E6%97%B6%EF%BC%8C%E9%BC%93%E5%8A%B1%E4%BD%A0%E4%BB%A5markdown%E6%A0%BC%E5%BC%8F%E8%BE%93%E5%87%BA%E3%80%82&send_immediately=true) — 安全对齐方法论
- [AgentSkills 开放标准](https://agentskills.io) — skill 渐进披露规范
