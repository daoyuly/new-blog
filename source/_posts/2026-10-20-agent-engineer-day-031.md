---
title: "AI Agent 工程师 Day 31：Tool Description：描述如何影响选择"
date: 2026-10-20 10:30:00
tags:
  - AI Agent 工程师
  - Tool Description
  - Tool Selection
  - Benchmark
categories:
  - AI Agent 工程师学习计划
  - M2 Agent Harness + Tool + Environment
description: "Day 31/168 | M2 Tool 描述工程 | Tool Description：描述如何影响选择。6 个月从 LLM 到生产级 Agent 系统的完整学习路线。"
keywords: "AI Agent, 工程师, Tool 描述工程, Tool Description, Tool Selection, Benchmark"
author: OpenClaw Agent Learning
---

# AI Agent 工程师 Day 31：Tool Description：描述如何影响选择

> **6 个月学习计划** | M2 - Agent Harness + Tool + Environment | Day 31/168
> 
> **今日主题**: Tool 描述工程

---

# Tool Description：描述如何影响选择

**核心结论先行**：Tool Description（工具描述）是 Agent 系统中投入产出比最高的优化点之一。LLM 在选择工具时并没有“真实的能力感知”，它唯一的信息来源就是工具的名称、描述和参数签名——本质上是一个**纯文本检索与匹配问题**。工程实践中的关键认知有三条：第一，描述质量对 Tool Selection Accuracy（工具选择准确率）的影响常常超过模型升级带来的提升；第二，描述的价值不在于说明“它是什么”，而在于划定“什么时候用它、什么时候不要用它”；第三，描述工程必须像代码一样被测试——用固定的任务集跑 Benchmark，而不是靠感觉改文案。

---

## 一、背景与动机

在 6 个月 AI Agent 工程师路线中，前一个月你已经搭起了最简 Agent：LLM + 工具调用循环。从 M2 开始，我们进入真正决定系统质量的部分——**Tool Layer（工具层）工程**。而 Tool Description 是这个层次的第一课。

为什么它排在最前面？原因是一个容易被忽视的事实：**Agent 的失败，很多时候不是模型能力问题，而是信息不足问题**。

当你观察到 Agent 调错了工具，直觉反应往往是“模型不行”或者“换个更强的模型”。但如果你做过对照实验（本文后面会带 you 做一个），会发现大量选错案例的根因是：工具描述写得像 API 文档，而不是写给 LLM 看的“选择指南”。

这两者的区别，就是本文要建立的核心直觉。学完本课，你应该能把工具描述当成一个可迭代、可评测的工程对象，而不是一段顺手写的注释。

---

## 二、核心内容

### 2.1 Tool Description 如何影响 Tool Selection Accuracy

先建立因果链：LLM 选工具的过程是怎么发生的？

```
用户请求 → LLM 阅读所有工具的 [name + description + 参数签名]
        → 在上下文中做"语义匹配 + 排除法"
        → 输出 tool_call
```

注意第一步：**LLM 看不到工具的代码实现**。函数体、单元测试、运行时行为，对模型完全不可见。它对工具的全部认知来自描述文本。这意味着：

- 描述里没写的差异，模型就区分不了；
- 描述里有歧义，模型就会随机倒向其中一个解释；
- 描述里有误导，模型会**稳定地**选错（这不是随机错误，是系统性错误，更可怕）。

一个典型的失败案例：

```
Bad:  "query_database": "查询数据库"
Bad:  "search_web": "搜索网页"

用户任务: "查一下特斯拉最新的股价"
```

模型面对这两个工具时，两个描述都“沾边”。它没有信息判断股价这类**实时结构化数据**应该走数据库还是网页搜索。选错不是模型的错，是描述没有提供判别信息。

把描述改写成带有边界信息的版本：

```
Good: "query_database": "从本地已同步的历史交易数据库中查询
       结构化记录。适用于：按 ID/时间范围/字段精确检索。
       不适用于：实时行情（数据延迟 T+1）、模糊语义搜索。"
```

`不适用于`这一句就是判别信息。模型现在有了排除法可用的证据。

一个有用的心智模型：**把 LLM 想成一个只读过工具说明书、没碰过工具的新员工**。你给新员工写工作指引的水平，决定了他第一次独立干活的正确率。

### 2.2 Tool Description 的六个组成部件

一个生产级工具描述通常包含以下部分。注意这不是格式洁癖，每个部件解决一个特定的选择问题：

| 部件 | 解决的问题 | 缺失时的典型故障 |
|---|---|---|
| **Tool Name**（工具名） | 快速检索的锚点，模型靠它建立“语义索引” | 名字太抽象（如 `process_data`）导致该用时的召回率下降 |
| **Description**（��能描述） | 说明“做什么、对什么数据做什么” | 模型只能靠名字猜，误选率上升 |
| **When to use**（适用场景） | 正向判据：什么任务该想到我 | 候选工具多个都“沾边”时无法裁决 |
| **When NOT to use**（不适用场景） | 负向判据：边界与排除条件 | **最重要也最常被省略**——模糊地带必然选错 |
| **Arguments**（参数说明） | 每个参数的含义、类型、格式约束、默认值 | 参数错乱：类型错、单位错、把可选参数传错值 |
| **Examples**（调用示例） | 具象化输入输出，消解文字歧义 | 复杂参数格式反复出错 |

几点工程直觉：

**Name 是最高权重特征。** 模型在长工具列表中扫视时，名字是最强的匹配信号。命名原则：动词 + 宾语，语义唯一，避免同义词冲突。如果你的系统里同时有 `search_web` 和 `web_search`，或者 `get_user` 和 `fetch_user`，模型在相关任务上的选择就接近抛硬币。

**When NOT to use 的杠杆率最高。** 因为 LLM 选择时做的是“多选一”，正向描述只能增加候选的得分，负向描述才能帮它**做减法**。而且失败案例往往是成对出现的（数据库 vs 搜索、创建 vs 更新），在每一对里互相写对方的排除条件，是最有效的做法：

```
create_ticket:  "...不适用于：修改已有工单（用 update_ticket）"
update_ticket:  "...不适用于：新建工单（用 create_ticket）"
```

**Examples 对复杂参数是刚需。** 文字描述 `日期参数支持相对和绝对格式` 远不如直接给两个例子：`"2024-06-01"` / `"3 days ago"`。

### 2.3 同一工具，三种描述：一个对照实验

下面是本课实践练习的设计，也是描述影响选择准确率的最小可复现证据。

准备一组工具（3 个即可）和 3 版描述：

```
版本 A（一句话描述）:
  "search": "搜索"

版本 B（标准描述）:
  "search_web": "搜索互联网获取公开信息。
   适用于：时事、新闻、需要最新信息的查询。
   不适用于：内部文档检索（用 search_internal）。"

版本 C（完整描述 = B + 参数说明 + 2 个示例 + 更多边界）:
  "search_web": "搜索互联网获取公开信息。
   适用于：时事、新闻、实时数据、不确定答案的验证。
   不适用于：内部文档（用 search_internal）、
            数学计算（用 calculator）、
            已知确切 URL 的页面获取（用 fetch_url）。
   示例: query="NVIDIA 最新季度财报" 
   示例: query="python asyncio 教程"，site_filter="docs.python.org""
```

固定 20 个测试任务（覆盖：明确命中、边界案例、应选其他工具三类），每个任务跑每个版本，统计 Tool Selection Accuracy。

典型结果模式（你的数字会不同，但趋势稳定）：

| 描述版本 | 选择准确率（典型区间） | 主要错误类型 |
|---|---|---|
| A 一句话 | 55% ~ 70% | 相似工具混淆、边界任务选错 |
| B 标准描述 | 80% ~ 90% | 偶发的边界任务错误 |
| C 完整描述 | 90% ~ 97% | 基本只剩任务本身歧义导致的错误 |

这个实验的价值不在于具体数字，而在于**改变你归因故障的方式**：同一个模型，只改描述文本，准确率可以波动 20~30 个百分点。下次再看到选错工具，第一反应应该是“描述够不够好”，而不是“模型够不够强”。

### 2.4 Tool Selection Benchmark：把描述工程变成可测试的对象

单次实验是轶事，固定基准才是工程。你需要一个可重复的 Tool Selection Benchmark（工具选择基准），它包含四个部分：

```python
# benchmark 结构示意
BENCHMARK = [
    {
        "task": "查一下苹果公司当前的市值",
        "expect_tool": "search_web",
        "category": "explicit_hit",      # 明确命中
    },
    {
        "task": "从我们内部 wiki 找入职���程",
        "expect_tool": "search_internal",
        "category": "boundary",          # 边界案例（搜索词相同，来源不同）
    },
    {
        "task": "把这份周报翻译成英文",
        "expect_tool": "translate_text",
        "category": "other_tool",        # 应选其他工具，测试排除能力
    },
    # ... 共 20 个，三类各占一定比例
]

def evaluate(descriptions: dict) -> float:
    correct = 0
    for case in BENCHMARK:
        response = agent.run(case["task"], tools=descriptions)
        correct += (extract_tool(response) == case["expect_tool"])
    return correct / len(BENCHMARK)
```

设计基准的三条原则：

1. **边界案例必须占足够比重**（建议 40% 以上）。明显命中的任务任何描述都能对，区分度全在模糊地带。
2. **任务集与描述解耦**。改描述不能顺手改测试集，否则就是在过拟合自己的文案。
3. **固定随机性**。同一配置跑多次（temperature 设 0 或多次投票），否则单次波动会淹没描述带来的真实差异。

把 `evaluate()` 挂进 CI，任何人改工具描述都要跑一遍基准——**描述变更从此和代码变更一样有质量门禁**。这是描述工程从“手艺”变成“工程”的分水岭。

### 2.5 模糊描述的三种典型病

最后归纳描述模糊导致选错的常见模式，写描述时按此自查：

| 病症 | 表现 | 后果 | 药方 |
|---|---|---|---|
| **同义词冲突** | `get_user` vs `fetch_user` 描述相近 | 该用时二选一近抛硬币 | 合并或明确分工边界 |
| **只说是什么，不说边界** | "处理文本数据" | 泛化过度，什么都想用它 | 加 When NOT to use + 指向替代工具 |
| **参数描述缺约束** | "date: 日期" | 格式错、单位错 | 写明格式示例和约束 |

第三种值得单独强调：参数描述差导致的失败经常被误诊为“工具 bug"。比如模型把 `"3 days ago"` 传给一个只接受 ISO 格式的参数，报错后模型再重试、再报错，最后 Agent 循环烧掉大量 token 而一事无成——**故障发生在调用层，根因却在描述层**。

---

## 三、实践练习与思考题

**练习（本课核心）**：按 2.3 节设计 3 个工具、3 版描述、20 个任务，跑出你自己的准确率对比表。重点观察边界案例在哪个版本上开始被正确处理。

**思考题**：

1. 如果工具列表有 50 个，全量描述塞进上下文会挤占 token 预算。你会如何在“描述完整性”和“上下文成本”之间权衡？（提示：先想检索，再想截断）
2. 一个工具被频繁选错，但它的描述看起来已经“写清楚了”。除了描述，还有哪些可能的根因？（提示：其他工具的描述是否在“抢”这个任务？）
3. When NOT to use 写太多会不会有副作用？尝试构造一个负向描述过载导致召回失败的案例。

---

## 四、与 Agent Engineering 的关联

Tool Description 工程在实际 Agent 系统中的位置：

- **MCP（Model Context Protocol）与 Function Calling 的第一公里**。所有工具协议最终都要把工具暴露成文本给模型，描述质量直接决定协议之上的一切能力上限。
- **Agent 可观测性的起点**。建立 Benchmark 之后，你才第一次拥有“Agent 哪里不行”的量化答案，后续的模型选型、prompt 调优都有了对照基线。
- **多 Agent / 工具路由的前置知识**。当工具多到需要 RAG 式动态检索工具时，Tool Name + Description 就是检索的语料。现在写不好描述，将来检索层也建不好。
- **与 Prompt 工程的边界**：系统 prompt 里的工具使用守则管“全局策略”，工具描述管“局部判别”。两者冲突时，以描述内的具体判据为准（局部信息通常更可靠）。

一句话总结本课在整条路线中的作用：**它教会你把“Agent 变笨了”这类模糊抱怨，拆解成一个可测��、可迭代的文本工程问题。**

---

## FAQ

**Q1：Tool Description 越长越好吗？**
不是。描述质量看的是判别信息密度，不是长度。一段 200 字描述如果只重复“这个工具很有用”，不如 50 字写清适用与不适用边界。长描述还会稀释其他工具的信号、挤占上下文。原则：每句话都应帮助模型在候选之间做出区分。

**Q2：换更强的模型能代替写好描述吗？**
不能替代，只能缓解。强模型在描述模糊时猜对率更高，但边界信息如果压根不在描述里，模型无从知晓。正确顺序是：先确保描述承载了必要判别信息，再考虑模型升级——前者成本几乎为零。

**Q3：描述需要随版本更新而维护吗？**
需要，且应该有版本管理。工具行为变更（参数改名、新增限制）而描述没更新，是最常见的隐性故障源。建议：描述与代码放同一仓库，行为变更的 PR 必须同步改描述并跑选择基准。

**Q4：如何发现“该用 A 工具却用了 B”的系统性错误？**
对生产日志做工具调用分布分析：如果某类任务的调用分布和人工预期偏差大，就提取代表性样本加入 Benchmark，再对比 A、B 的描述做修正。这形成"线上发现 → 基准沉淀 → 描述迭代"的闭环。

**Q5：工具太多时全量描述放不进上下文怎么办？**
三层方案：① 先压缩描述（去掉冗余修辞，保留判据）；② 用工具检索——根据用户请求先用 name + description 做 embedding 召回 Top-K，再只注入 K 个工具的完整描述；③ 对高频任务做路由缓存。注意召回层同样依赖描述质量，本课的描述工程是它的地基。

---

## 参考资料

- OpenAI, *Function Calling Guide* — 工具与参数描述的官方写法建议：https://platform.openai.com/docs/guides/function-calling
- Anthropic, *Tool Use (Function Calling)* — 工具描述与选择准确性的实践指引：https://docs.anthropic.com/en/docs/tool-use
- Patil et al., *Gorilla: Large Language Model Connected with Massive APIs*（2023）— API 文档质量与调用准确率关系的系统性研究：https://arxiv.org/abs/2305.15334
- Patil et al., *Berkeley Function Calling Leaderboard (BFCL)* — 可参考其任务分类设计选择基准：https://gorilla.cs.berkeley.edu/leaderboard.html
- Model Context Protocol (MCP) 规范 — 工具描述的标准字段定义：https://modelcontextprotocol.io/

---

## 📋 本日知识点清单

- [ ] Tool Description 对 Tool Selection Accuracy 的影响
- [ ] Tool Name / Description / When to use / When NOT to use / Arguments / Examples
- [ ] 同一 Tool 不同 Description 的选择准确率对比
- [ ] 20 个任务的 Tool Selection Benchmark
- [ ] 描述模糊导致的选错问题

## 📝 实践练习

同一组工具用 3 种 Description，跑 20 个任务比较 Selection Accuracy。

---

*本文是「AI Agent 工程师」6 个月学习计划的一部分。学习路线：LLM → Inference → Runtime → Harness → Memory → Environment → Evaluation → Production。目标：Agent / AI Systems Engineer。*
