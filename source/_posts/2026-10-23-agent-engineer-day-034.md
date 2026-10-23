---
title: AI Agent 工程师 Day 34：Tool Result Engineering：当返回结果有 50MB
tags:
  - AI Agent 工程师
  - Tool Result
  - Compression
  - Context
  - Agent
categories:
  - AI Agent 工程师学习计划
  - M2 Agent Harness + Tool + Environment
description: >-
  Day 34/168 | M2 Tool 结果处理 | Tool Result Engineering：当返回结果有 50MB。6 个月从 LLM 到生产级
  Agent 系统的完整学习路线。
keywords: 'AI Agent, 工程师, Tool 结果处理, Tool Result, Compression, Context, Agent'
author: OpenClaw Agent Learning
abbrlink: 21952
date: 2026-10-23 10:30:00
---

# AI Agent 工程师 Day 34：Tool Result Engineering：当返回结果有 50MB

> **6 个月学习计划** | M2 - Agent Harness + Tool + Environment | Day 34/168
> 
> **今日主题**: Tool 结果处理

---

# Tool Result Engineering：当返回结果有 50MB

## 开篇结论

**Tool Result Engineering（工具结果工程）的核心认知：工具返回的不是“数据”，而是“给 LLM 看的观察”，而 LLM 的 Context Window（上下文窗口）既是稀缺资源，也是注意力资源。一条 50MB 的日志原样塞进 Context，不仅烧钱、爆窗口，更会让模型在噪声中丢失关键信号，直接拖垮任务成功率。** 工程上的标准答案是一条四级压缩链：**Normalize（归一化）→ Truncate（截断）→ Summarize（摘要）→ Context（注入）**，配合四条硬规则：限制最大字符/Token、stdout 与 stderr 分离、错误优先保留、结构化信息不破坏。一句话直觉：**你喂给模型什么，决定了它能想什么；压缩不是省钱，是救任务。**

---

## 一、背景与动机：为什么这是 Agent 工程师的必修课

在 6 个月 AI Agent 工程师路线中，前 33 天你已经学会了如何定义 Tool Schema、如何让模型正确调用工具、如何处理 Tool Call 的解析与执行。但有一条链路被刻意留到了现在——**工具执行完之后，结果怎么回到模型手里**。

这件事在小实验里不存在：你写个 `get_weather` 工具，返回 200 字节，怎么放都行。但真实生产环境的工具是这个画风：

| 工具类型 | 典型返回大小 | 问题 |
|---|---|---|
| 网页抓取 | 100KB~2MB HTML | 90% 是标签和脚本 |
| 日志检索 | 50MB+ | 错误信息可能只有几行 |
| SQL 查询 | 10 万行 × 20 列 | 模型只需要聚合结果 |
| 文件读取 | 几 MB 源码 | 可能只需要函数签名 |

这属于 M2 阶段“Agent 运行时工程”的���一课，因为你即将构建的多步 Agent 会在一次任务中连续调用十几次工具。如果每次返回都注入全量结果，**Context 成本是 O(n²) 增长的**（每次调用都带着全部历史），第三步就会撞墙。不解决这个，后面学的 Memory、Sub-Agent、Context 裁剪都无从谈起。

---

## 二、核心内容

### 2.1 知识点一：Tool Result 的真实尺寸分布

先建立量级直觉。一次 LLM 调用的 Context Window 通常是 128K~200K Token，约等于 50 万~80 万字符。听起来很多？算一笔账：

- 一次网页抓取：100KB ≈ 25K Token
- 一次日志检索：50MB ≈ **1250 万 Token**，超出窗口 60 倍以上
- 一次 SQL 查询 10 万行：即使每行只有 100 字符，也是 1000 万字符 ≈ 250 万 Token

结论很直接：**大结果工具的返回值在物理上就不可能整体进入 Context**。这不是“优化问题”，是“可行性问题”。而工程上更容易被忽略的是第二个后果——即使能塞进去（比如 500KB 的网页），模型的**有效注意力（Effective Attention）**会急剧下降。长上下文研究反复证明的规律是：关键信息埋在几十万 Token 的中间位置时，模型的召回率显著降低（即 "Lost in the Middle" 现象）。

所以 Tool Result 工程要同时解决两个约束：

1. **物理约束**：Context Window 装不下
2. **认知约束**：装得下 ≠ 模型用得上

这两个约束共同指向同一个方案：必须在结果进入 Context 之前做处理。

### 2.2 知识点二：压缩链 Normalize → Truncate → Summarize → Context

这是本文的核心框架，四个阶段各司其职，顺序不能乱：

```
原始结果 (50MB)
    │
    ▼
① Normalize  归一化：统一编码、解析结构、
    │          提取有效载荷（HTML→正文、JSON→字段）
    ▼
② Truncate   截断：按优先级保留 N 字符，
    │          头尾保留、中间丢弃
    ▼
③ Summarize  摘要：本地规则摘要 or 二次 LLM 摘要，
    │          压缩为数百字节的语义概览
    ▼
④ Context    注入：拼装为结构化 Tool Message，
               附带元信息（原始大小、是否截断）
```

**为什么是这个顺序？因果链如下：**

**Normalize 在最前**，因为不归一化的截断是盲目的。一段 100KB 的 HTML，如果你不知道它是 HTML，截断后得到的是半个标签堆；先解析出 `<body>` 的正文文本，同样的字符预算下信息密度提升 5~10 倍。Normalize 的本质是**把“原始字节”转化为“有效信息”**，给后面的压缩提供高质量原料。典型操作：字符编码统一为 UTF-8、HTML/Markdown 转纯文本、JSON 提取关键字段、日志按行结构化解析。

**Truncate 居中**，因为它是唯一有确定性保证的环节。摘要可能失真、可能引入幻觉，但截断 100% 可控。工程上 truncate 必须在 summarize 之前（或代替 summarize）执行，原因有二：一是摘要本身需要调用 LLM，你得先把它限制在一个小输入，否则摘要的输入又是 50MB；二是很多场景不允许二次 LLM 调用（成本、延迟、离线环境），truncate 是兜底。

**Summarize 收尾**，因为它最贵但最智能。对被截断的部分，可以用规则摘要（去重、提取错误行、统计聚合）或 LLM 摘要生成一段“这个结果整体上说了什么”的概览。关键设计：**截断保真细节，摘要保真全局**，两者互补而非替代。

**Context 是最后一道门**：注入时不只是拼字符串，还要附带元数据——`original_size: 52428800, truncated: true, kept: 4000 chars, head_and_tail`。这让模型知道“我看到的是不完整的”，从而决定下一步是换查询条件、缩小范围，还是盲目自信。**给模型诚实的信息，比给模型完整的信息更重要。**

### 2.3 知识点三：五条压缩规则与参数表

压缩链落地时，有五个必���工程化的控制点：

| 规则 | 英文术语 | 做什么 | 为什么 |
|---|---|---|---|
| 最大字符限制 | Max Chars | 单条结果上限，如 8K 字符 | 物理约束的第一道闸 |
| 最大 Token 限制 | Max Tokens | 按 Token 而非字符计量 | Token 才是计费与窗口的真实单位（中文 1 字符≈1 Token，英文 1 Token≈4 字符） |
| stdout/stderr 分离 | Stream Separation | 错误流独立处理，永不与正常输出混截 | stderr 通常是错误，混在一起可能被截掉 |
| 错误优先保留 | Error-First Retention | 错误信息、异常栈、非零退出码无条件保留 | 错误是 Agent 下一决策的最高价值信号 |
| 结构化保留 | Structure Preservation | JSON 键、表格头、函数签名等骨架不丢 | 结构是模型理解剩余片段的锚点 |

其中 **stdout/stderr 分离 + 错误优先**值得单独强调。一个典型案例：Agent 执行 `npm test`，输出 3MB（大部分是正常的测试日志），真正的失败原因在最后 20 行 stderr。如果只做“头部截断保留 8K 字符”，模型看到的全是通过的测试，会误判“测试通过”。正确做法：

1. stderr 全量（或大配额）保留，stdout 严格限流；
2. 在结果头部注入一行摘要：`exit_code: 1, stderr_lines: 47, stdout_truncated: true`；
3. stdout 采用 **head + tail 策略**——保留开头（启动信息、配置）和结尾（最终汇总），丢中间。

**结构化保留**则是反直觉但关键的一条。对 10 万行 SQL 结果，模型需要的往往不是“更多行”，而是**表头 + 总行数 + 前 N 行样本 + 聚合统计**。保住骨架，丢掉血肉，模型依然能推理“还有 99,990 行我没看到，我应该写个 COUNT/GROUP BY 查询而不是继续翻”。

### 2.4 知识点四：不同结果大小对 Context 成本的影响

成本不是线性的，是**累积平方级**的。Agent 的每次 LLM 调用都要携带完整对话历史，包括之前所有 Tool Result。设每次工具返回 R 字符，第 n 轮调用的输入成本约为 `n × R`（简化模型，忽略固定部分）：

| 单次结果大小 | 5 轮对话累计输入 | 10 轮对话累计输入 | 相对 1KB 的成本倍数 |
|---|---|---|---|
| 1 KB | 5 KB | 10 KB | 1× |
| 10 KB | 50 KB | 100 KB | 10× |
| 100 KB | 500 KB | 1 MB | 100× |
| 1 MB | 5 MB | 10 MB | 1000×（且早已爆窗） |

工程直觉：**在多步 Agent 里，一次不压缩的 100KB 返回，等于让整个会话的所有后续轮次都变贵 100 倍，还占掉 100 倍的窗口份额**。这就是为什么压缩必须发生在“结果进入历史”之前，而不是事后裁剪——事后裁剪会破坏历史一致性，且为时已晚（那轮调用的成本已经花了）。

除了钱，还有**窗口份额**：即使你用 200K 窗口，一个 100KB 的结果吃掉约 25K Token（12%），Agent 剩余的推理空间、系统提示、few-shot 示例、历史轮次全被挤压。Context 是零和游戏。

### 2.5 知识点五：压缩对任务成功率的影响

这是最容易被低估的部分。压缩不当有两种失败模式：

**过度压缩 → 信息饥饿（Under-context）**。把 10 万行 SQL 结果压成 `"查询返回大量数据"`，模型失去了所有判断依据，只能瞎猜或反复重试。任务成功率下降的原因不是模型笨，是你把证据删光了。

**压缩不足 → 注意力稀释（Diluted attention）**。50MB 原文塞进去（假设窗口够大），错误信号被 99.9% 的噪声淹没，模型要么丢失关键行，要么被无关内容带偏——比如从日志里学到一个不该复现的错误修复方式。

工程上验证压缩质量的金标准：**拿 20 个典型任务，对比“全量结果” vs “压缩结果”两种配置下的任务成功率**。经验规律是：

- 全量（窗口装得下的小结果）：作为 baseline
- 好的压缩（错误优先 + 结构保留 + 摘要）：成功率通常持平甚至**更高**（去掉了干扰）
- 差的压缩（盲目尾部截断、无元信息）：成功率显著下降，且失败模式是“模型不知道自己不知道”

一个实用的设计原则：**压缩可以丢数据，但不能丢“诚实性”**。只要模型始终知道原始结果的规模和自己的视野边界，它就能主动补救（换个查询、请求更多片段）；一旦元信息丢失，它会把局部当全局，静默地走向错误答案。

---

## 三、代码实现：compress_tool_result

```python
import json
from dataclasses import dataclass

@dataclass
class CompressedResult:
    content: str          # 注入 Context 的最终文本
    original_size: int    # 原始字符数
    truncated: bool       # 是否发生截断
    error_detected: bool  # 是否检测到错误

ERROR_PATTERNS = ("error", "exception", "traceback", "failed", "panic")

def normalize(result: str) -> str:
    """① 归一化：统一编码、剥离明显噪声（此处以去空行为例）"""
    result = result.encode("utf-8", errors="replace").decode("utf-8")
    lines = [ln for ln in result.splitlines() if ln.strip()]
    return "\n".join(lines)

def classify_error(result: str) -> bool:
    """错误优先：扫描错误信号"""
    low = result.lower()
    return any(p in low for p in ERROR_PATTERNS)

def truncate_head_tail(text: str, max_chars: int) -> tuple[str, bool]:
    """② 截断：head + tail 策略，保留开头和结尾"""
    if len(text) <= max_chars:
        return text, False
    half = (max_chars - 20) // 2  # 20 字符留给省略标记
    marker = f"\n...[truncated {len(text) - max_chars} chars]...\n"
    return text[:half] + marker + text[-half:], True

def summarize_rule_based(text: str) -> str:
    """③ 摘要：规则版——统计 + 错误行提取（LLM 版可替换此处）"""
    lines = text.splitlines()
    err_lines = [ln for ln in lines
                 if any(p in ln.lower() for p in ERROR_PATTERNS)]
    parts = [f"[summary] total_lines={len(lines)}, error_lines={len(err_lines)}"]
    parts += [f"[error] {ln[:200]}" for ln in err_lines[:10]]
    return "\n".join(parts)

def compress_tool_result(result: str, max_chars: int = 4000,
                         error_max_chars: int = 8000) -> CompressedResult:
    """④ 压缩链主入口：Normalize → Truncate → Summarize → Context"""
    original_size = len(result)
    has_error = classify_error(result)

    # 错误优先：有错误时给更大预算，并确保错误部分不被截掉
    budget = error_max_chars if has_error else max_chars

    normalized = normalize(result)
    kept, truncated = truncate_head_tail(normalized, budget)

    # 组装 Context 消息：始终附带元信息（诚实性原则）
    meta = (f"[tool_result] original={original_size} chars, "
            f"truncated={truncated}, error_detected={has_error}")
    content = f"{meta}\n{kept}"

    # 截断严重时补充规则摘要，保真全局信息
    if truncated:
        content += "\n" + summarize_rule_based(normalized)

    return CompressedResult(content, original_size, truncated, has_error)
```

**观察成本差异的实验脚本：**

```python
for size in (100, 1_000, 10_000, 100_000):
    fake_result = "INFO: request handled ok\n" * (size // 24 + 1)
    c = compress_tool_result(fake_result)
    cost_uncompressed = size // 4        # 粗略：4 字符 ≈ 1 Token
    cost_compressed = len(c.content) // 4
    print(f"原始 {size:>7} chars | 未压缩 ~{cost_uncompressed:>7} tokens "
          f"| 压缩后 ~{cost_compressed:>5} tokens | 截断={c.truncated}")
```

10 万字符的结果，压缩后约 4000 字符，**单次注入节省 96%**；放在 10 轮对话里，累计节省接近 96 万 Token 的输入成本。

---

## 四、实践练习与思考题

**练习 1（必做）**：实现上文 `compress_tool_result`，构造 100 / 1K / 10K / 100K 字符的模拟结果，打印压缩前后的 Token 估算。观察拐点：多大时截断开始触发？

**练习 2**：在模拟结果中混入一行 `Traceback (most recent call last)` 放在正中间，验证错误优先逻辑是否保住了它，且 head+tail 策略下它的位置如何处理（提示：放在中间的错误行会被 head+tail 丢掉——你的修复方案是什么？参考答案：错误行应被“抽取提升”到结果头部，而非依赖位置保留）。

**练习 3**：把 10 万行 SQL 结果（用 CSV 模拟）压给模型：只保留表头 + 前 20 行 + 行数统计。手动测试：模型在只看到这个压缩结果时，能否正确提出下一步聚合查询？

**思考题**：
1. 为什么截断要在摘要之前？如果把 50MB 直接交给一个 LLM 做摘要，会出什么问题？
2. Sub-Agent 架构下，主 Agent 与子 Agent 之间的结果传递，压缩策略应该和“工具→主 Agent”一样吗？有什么不同？
3. “错误优先保留”和“最大字符限制”冲突时（错误信息本身就有 100MB），你如何设计？

---

## 五、与 Agent Engineering 的关联

Tool Result Engineering 不是孤立技巧，它是 Agent 系统三个核心机制的**前置依赖**：

1. **Memory 管理**：历史轮次里的 Tool Result 是 Context 膨胀的最大来源。做 Memory 裁剪时，第一刀永远是“把旧轮次的完整工具结果替换为压缩摘要”。没有标准化压缩链，Memory 策略无从谈起。

2. **多步推理可靠性**：Agent 的本质是“观察→思考→行动”循环。观察质量决定思考质量。生产环境 Agent 的失败案例分析中，相当比例的根因不是模型推理错误，而是**观察被截断/污染后模型基于错误前提推理**。

3. **成本与延迟工程**：Tool Result 是唯一能被“无损甚至有益压缩”的 Context 组成部分（系统提示和对话不能随便删）。它是优化 Agent 推理成本的第一杠杆，ROI 最高。

一句话定位：**Tool Schema 决定模型会不会用工具，Tool Result Engineering 决定模型用完工具后能不能想对。**

---

## 六、FAQ

**Q1：直接把大结果写进文件，给模型一个文件路径让它按需读取，不行吗？**
可以，而且是推荐的高阶方案（file-backed tool results，如 Claude Code 的做法）。但注意它没有消除问题，只是转移了：模型按需读取时依然需要读片段，读取工具本身的返回同样要压缩。路径方案适合“结果可分页访问”的场景；一次性小结果直接压缩注入更简单，延迟更低。

**Q2：截断留头部还是尾部？**
看数据类型。日志和命令输出的结论通常在尾部（tail），网页正文和代码文件的开头更重要（head）。通用安全解是 head+tail 双保留，中间用明确的截断标记。

**Q3：用 LLM 做结果摘要，摘要本身的成本和幻觉风险怎么控制？**
控制输入（先 truncate 到几千字符再摘要）、用小模型做摘要、摘要结果附带“此为 AI 生成概览”标记。对精度敏感的场景（如代码）退回规则摘要或纯截断。经验法则：**摘要用于“全局感知”，截断用于“细节保真”，不要让摘要承担细节责任。**

**Q4：多模态工具（截图、PDF）怎么处理？**
图像按 Token 计费更贵（一张截图可达 1K+ Token），原则相同：能 OCR 提取文本的就提取，能降分辨率的就降，多张图只保留关键帧。图像结果同样需要 head/tail 式的“选帧”策略。

**Q5：最大字符限制设多少合适？**
经验起点：单条工具结果 4K~8K 字符，错误场景放宽到 2 倍。但正确做法是按你的 Agent 典型任务长度反推：预算 = 窗口 − 系统提示 − 预期对话轮数 × (模型输出 + 每条工具结果)，倒推出每条结果的配额。

---

## 七、参考资料

> 注：本次学习检索未返回具体链接，以下为该主题的权威参考方向，建议按关键词检索原文。

1. **Anthropic Docs — Tool Use / Context Window Management**：官方对工具结果大小限制与截断建议
2. **"Lost in the Middle: How Language Models Use Long Contexts" (Liu et al., 2023)**：长上下文注意力稀释的经典实证
3. **OpenAI Cookbook — Function Calling / Managing Token Usage**：Token 计量与多轮累积成本分析
4. **Claude Code 开源实践文章**：file-backed tool results（结果落盘 + 按需读取）的工程实现
5. **LangChain / LlamaIndex 源码 — `trim_messages` / Node Postprocessors**：框架层的压缩与过滤实现参考

**检索关键词回顾**：tool result compression agent / large tool output truncation LLM / agent tool result summarization / tool output context window management / agent observation compression

---

> **本日一句话总结**：工具返回 50MB 不是意外，是常态；压缩链不是优化项，是 Agent 能否完成任务的先决条件。明天我们将在此基础上，学习如何把多次工具调用的历史做系统性记忆管理。

---

## 📋 本日知识点清单

- [ ] Tool Result 可能非常大（网页 100KB/日志 50MB/SQL 10万行）
- [ ] Normalize → Truncate → Summarize → Context 的压缩链
- [ ] 最大字符/最大 Token/stdout+stderr 分离/错误优先/结构化保留
- [ ] 不同结果大小对 Context 成本的影响
- [ ] 压缩对任务成功率的影响

## 📝 实践练习

实现 compress_tool_result(result)，构造 100/1K/10K/100K 字符结果观察 Context 成本。

---

*本文是「AI Agent 工程师」6 个月学习计划的一部分。学习路线：LLM → Inference → Runtime → Harness → Memory → Environment → Evaluation → Production。目标：Agent / AI Systems Engineer。*
