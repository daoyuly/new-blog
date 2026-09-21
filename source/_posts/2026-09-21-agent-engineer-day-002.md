---
title: "AI Agent 工程师 Day 2：Token 与 Context Window：为什么上下文不是无限的"
date: 2026-09-21 10:30:00
tags:
  - Token
  - Context Window
  - Tokenizer
  - LLM
categories:
  - AI Agent 工程师学习计划
  - M1 LLM + Agent Runtime
description: "Day 2/168 | M1 Token / Tokenizer / Context Window | Token 与 Context Window：为什么上下文不是无限的。6 个月从 LLM 到生产级 Agent 系统的完整学习路线。"
keywords: "AI Agent, 工程师, Token / Tokenizer / Context Window, Token, Context Window, Tokenizer, LLM"
author: OpenClaw Agent Learning
---

# AI Agent 工程师 Day 2：Token 与 Context Window：为什么上下文不是无限的

> **6 个月学习计划** | M1 - LLM + Agent Runtime | Day 2/168
> 
> **今日主题**: Token / Tokenizer / Context Window

---

# Token 与 Context Window：为什么上下文不是无限的

**核心认知**：大语言模型（LLM）不认识“字”，只认识“Token”。Token 是模型处理文本的最小语义单元，由分词器将文本切分而来。上下文窗口决定了模型单次交互能“看进眼里”的 Token 上限。在工程实践中，上下文绝非越大越好：首先，Input Token 与 Output Token 存在显著的成本与延迟剪刀差；其次，不同语言（如中英文）的 Token 压缩率差异巨大，直接影响系统预算；最后，盲目塞满上下文会导致“Lost in the Middle”现象，引发模型注意力涣散和精度下降。理解 Token 与 Context Window 的物理限制，是构建高可用、低延迟、成本可控的 AI Agent 系统的绝对地基。

---

## 背景与动机：为什么 Agent 工程师必须懂 Token？

在 6 个月的 AI Agent 工程师成长路线中，第一周的核心任务是“祛魅”。很多开发者习惯了传统软件工程中“内存几乎无限”、“磁盘随便存”的惯性思维，认为大模型既然支持 128K 甚至 1M 的上下文，就可以把所有文档、历史记录无脑塞进 Prompt。

这种思维在 Agent 系统中是致命的。Agent 是一个需要自我思考、多轮调用工具的循环系统。每一次 LLM 调用，都会消耗 Token；每一次工具执行的返回结果，都会累加到下一轮的 Context Window 中。如果不理解 Token 的计算法则和上下文的生命周期，你构建的 Agent 跑不了几轮就会因为超出上下文限制而崩溃，或者因为高昂的 API 费用和惊人的响应延迟而无法落地。

今天我们将深入 Token 与 Context Window 的底层机制，建立对大模型处理能力的“物理直觉”。

---

## 核心内容

### 1. Token 与 Tokenizer 的基本概念

人类阅读是以“词”或“字”为单位的，但计算机处理文本需要一种既能压缩信息又能保留语义的中间形态，这就是 Token。

**Token（词元）** 是大语言模型输入和输出的最小处理单元。它可以是完整的词、词根、词缀，甚至标点符号。例如，单词 "hamburger" 可能会被切分为 "ham"、"bur"、"ger" 三个 Token，而常见词 "apple" 则可能只占 1 个 Token。

**Tokenizer（分词器）** 是负责将原始文本转换为 Token 序列的算法组件。目前主流大模型（如 GPT-4, Llama 3）大多采用 BPE（Byte Pair Encoding，字节对编码）或其变体。BPE 的核心思想是：统计语料中最频繁出现的字节对，并将其合并为一个新的 Token，不断迭代直到达到预设的词表大小。

为什么不用字符或单词？
- **字符级**：序列太长，模型难以捕捉长距离语义依赖，计算成本极高。
- **单词级**：词表无限大，遇到未见过的词（OOV, Out-of-Vocabulary）会完全失效，且对形态丰富的语言（如德语、芬兰语）极不友好。

BPE 完美折中：常见词整体作为一个 Token（高压缩率），罕见词拆解为已知子词组合（泛化性强）。在工程中，这意味着我们评估一段文本对模型的影响时，不能简单地数字符数或字数，必须通过具体的 Tokenizer 进行计算。

### 2. Context Window 的含义与限制

**Context Window（上下文窗口）** 指的是模型在单次前向推理中，能够处理的最大 Token 数量上限。这个上限包含了输入和输出。例如，一个 8K 的 Context Window，如果输入了 7000 个 Token，那么模型最多只能生成 1000 个 Token 的回答。

从底层架构看，Context Window 的大小受限于 Transformer 架构中的注意力机制。标准自注意力的计算复杂度是 $O(n^2)$（$n$ 为序列长度）。这意味着序列长度翻倍，计算量和内存消耗会变成原来的 4 倍。

尽管 RoPE（旋转位置编码）和 FlashAttention 等技术让模型在理论上支持了 1M 甚至更长的上下文，但这只是“能算”，不代表“算得快”或“算得好”。Context Window 是一个物理边界，在边界之内，还有性能与成本的工程考量。

### 3. Input Token vs Output Token 的成本差异

在各大云厂商的 API 定价表中，Input Token（输入词元）和 Output Token（输出词元）的价格往往是不同的，通常 Output Token 的价格是 Input Token 的 3 到 5 倍。

**为什么输出比输入贵？**
这源于底层计算范式的差异：
- **Input (Prefill 阶段)**：模型一次性接收所有输入 Prompt，进行并行计算。此时 GPU 的计算密集度极高，矩阵乘法满载运行，硬件利用率（MFU）接近峰值。平摊到每个 Token，算力成本较低。
- **Output (Decode 阶段)**：模型必须自回归生成，即生成第 $N$ 个 Token 时，需要依赖前 $N-1$ 个 Token 的结果。这是一个串行过程，每次只生成一个 Token。此时 GPU 处于访存密集型状态，大量时间花在读取 KV Cache 上，计算单元闲置。硬件利用率极低。

因此，输出 Token 消耗的 GPU 时间远大于输入 Token。在 Agent 设计中，控制输出 Token 的长度（例如让模型输出 JSON 而非冗长解释）是控制成本的关键手段。

### 4. 不同语言（中英文）的 Token 效率对比

由于主流大模型的训练语料以英文为主，BPE 词表中的基础 Token 大量来源于英文单词和常见子词。这导致在处理非拉丁语系（如中文）时，Token 压缩率出现严重倾斜。

通常情况下，1 个英文单词 $\approx$ 1.3 个 Token；而 1 个中文字符 $\approx$ 1.5 到 2.5 个 Token（不同模型有差异）。

| 语言 | 文本示例 | 字符数 | Token 数 (约) | 压缩率 (字/Token) | 工程影响 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| 英文 | "Artificial intelligence is transforming the world." | 51 | 9 | 5.6 | 成本低，表达密集 |
| 中文 | "人工智能正在改变世界。" | 11 | 17 | 0.6 | 成本高，上下文消耗快 |

从上表可以看出，表达相同语义的中文，其 Token 消耗可能是英文的 2-3 倍。这意味着在构建处理中文的 Agent 时，Context Window 会更快被耗尽，API 调用成本也会成比例上升。这也是为什么针对中文场景进行模型微调或选择词表优化过的国产大模型（如 Qwen, GLM）具有显著的工程价值。

### 5. 为什么 Context Window 越大不意味着可以无限塞 Context

很多开发者在看到 128K 甚至 200K 的上下文窗口后，会习惯性地把所有检索到的文档全部塞进 Prompt。这在工程上会导致两个严重问题：

**第一，Lost in the Middle（中间迷失现象）**。研究表明，大模型对 Prompt 首尾的信息关注度较高，而对中间部分的信息容易“视而不见”。当上下文充斥大量低相关性文档时，模型提取关键信息的准确率会断崖式下降。Context Window 变大，只是扩大了“能看多少”的物理空间，并没有提升“能专注多少”的认知能力。

**第二，信息干扰与信噪比降低**。Agent 的每一次调用，应该目标明确。无脑堆砌上下文会引入大量噪音，模型为了过滤噪音会消耗更多的“推理带宽”，导致幻觉增加、指令遵循能力下降。优秀的 Agent 工程师不是把所有信息都给模型，而是只给模型“刚刚好”解决问题所需的信息。

### 6. Token Count 对延迟和成本的影响

在 LLM 系统中，延迟和成本都与 Token 数量强相关。

**延迟层面**：
- **Time to First Token (TTFT)**：首字延迟。主要受 Input Token 数量影响。输入越长，Prefill 阶段越久，用户等待第一个字出现的时间越长。
- **Time Per Output Token (TPOT)**：生成延迟。每个输出 Token 的生成时间相对固定，但受系统并发和 KV Cache 大小影响。

**成本层面**：
API 费用 = Input Tokens $\times$ Input Price + Output Tokens $\times$ Output Price。
在多轮 Agent 对话中，历史记录会不断累加。如果不做历史记录压缩或滑动窗口处理，第 $N$ 轮对话的 Input Token 将是前 $N-1$ 轮所有 Token 的总和，导致成本呈 $O(N^2)$ 指数级爆炸。

因此，控制 Token Count 不是抠门，而是保障系统响应速度和可扩展性的必经之路。

---

## 代码/图示：Token 计数与延迟感知

在实际工程中，我们不应依赖肉眼估算，而应使用官方提供的分词器库进行精确计算。以下是基于 `tiktoken` 库（OpenAI 系列模型常用）的实践代码：

```python
import tiktoken
import time

def count_tokens(text: str, model_name: str = "gpt-4o") -> int:
    """
    计算指定文本在特定模型下的 Token 数量。
    """
    try:
        encoding = tiktoken.encoding_for_model(model_name)
    except KeyError:
        # 如果模型未在 tiktoken 中注册，使用 cl100k_base 作为默认编码
        encoding = tiktoken.get_encoding("cl100k_base")
    
    token_list = encoding.encode(text)
    return len(token_list)

# 测试中英文 Token 效率
english_text = "Artificial intelligence is transforming the world."
chinese_text = "人工智能正在改变世界。"

print(f"English Text Tokens: {count_tokens(english_text)}")
print(f"Chinese Text Tokens: {count_tokens(chinese_text)}")

# 模拟 Token 数量对延迟的影响 (伪代码概念演示)
def mock_llm_call(input_text):
    token_count = count_tokens(input_text)
    
    # TTFT 延迟：假设每 1000 个 input token 产生 0.5 秒的 prefill 延迟
    ttft = (token_count / 1000) * 0.5 
    
    start_time = time.time()
    # [模拟 LLM 网络请求与推理...]
    time.sleep(ttft) 
    end_time = time.time()
    
    print(f"Input Tokens: {token_count} | Estimated TTFT: {ttft:.2f}s | Actual Delay: {end_time - start_time:.2f}s")

# 随着文本变长，延迟线性增加
mock_llm_call("Hello world.")
mock_llm_call("This is a slightly longer sentence to demonstrate the prefill latency impact." * 10)
```

**Context Window 质量衰减图示**：

```text
[Context Window = 8K Tokens]

高信噪比 (理想状态)：
[Query] + [Highly Relevant Doc 1] + [Highly Relevant Doc 2]
>>> 模型精准回答，延迟低，成本低。

低信噪比 (常见误区)：
[Query] + [Doc 1] + [Doc 2] + ... + [Doc 100 (包含大量无关信息)]
      ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
      模型注意力被稀释，TTFT飙升，成本激增，出现幻觉。
```

---

## 实践练习与思考题

### 实践练习

1. **实现多语言 Token 计数器**：使用 `tiktoken` 或 HuggingFace `transformers` 库，编写一个脚本，对比同一句话翻译成中、英、日、法四种语言的 Token 数量。
2. **延迟感知实验**：使用 OpenAI API 或本地模型，编写一个循环，逐步增加 Input Prompt 的长度（从 100 Token 增加到 4000 Token），记录每次请求的 TTFT（首字延迟），绘制 Input Token 数与延迟的折线图。

### 思考题

1. 如果你的 Agent 在处理长文档时超出了 Context Window，你会选择“截断历史记录”还是“压缩文档摘要”？为什么？
2. 在设计一个客服 Agent 时，如何利用 Input/Output Token 的价格差异来优化系统整体的运营成本？

---

## 与 Agent Engineering 的关联

在 AI Agent 系统中，Token 与 Context Window 是架构设计的“物理定律”。

1. **记忆系统设计**：Agent 需要记忆，但工作记忆受限于 Context Window。这迫使工程师引入短期记忆（滑动窗口）、长期记忆（向量数据库检索）和反思记忆（摘要压缩）的分层架构。
2. **RAG（检索增强生成）优化**：RAG 的本质就是解决 Context Window 不够用和信噪比下降的问题。通过精准检索，只提取 Top-K 相关 Chunk 注入上下文，而非把整本书塞给模型。
3. **工具调用与规划**：Agent 调用工具的返回值（如搜索引擎返回的 JSON）往往极其冗长。Agent 工程师需要对工具的输出进行预处理和 Token 裁剪，防止工具返回值撑爆上下文。
4. **成本控制**：在多轮 ReAct（Reasoning and Acting）循环中，每一步的 Thought-Action-Observation 都会累加。理解 Token 计数，是设计 Agent 停止条件和上下文重置策略的前提。

掌握 Token，就是掌握了与大模型沟通的度量衡。

---

## FAQ

**Q1: BPE 分词算法是如何处理从未见过的生僻字或 Emoji 的？**
A1: BPE 通常以 UTF-8 字节作为底层基础。如果遇到词表中不存在的生僻字或 Emoji，分词器会将其回退到字节级别，用多个基础字节 Token 来组合表示。这也是为什么有时候一个 Emoji 会消耗 3-4 个 Token 的原因。

**Q2: 既然模型支持 128K 上下文，我把 100K 的文本塞进去，模型一定能准确回答里面的问题吗？**
A2: 不一定。虽然物理上能装下，但存在 "Lost in the Middle" 现象。如果关键信息恰好在文本中间，或者文本包含大量干扰信息，模型的召回率和准确率会显著下降。通常建议将最关键的指令和文档放在 Prompt 的开头或结尾。

**Q3: 为什么我在本地部署的开源大模型，中文 Token 消耗比 GPT-4 少很多？**
A3: 因为很多国产开源模型（如 Qwen, Baichuan）在训练前对词表进行了中文扩容，增加了中文字符和常见词组的 Token 覆盖率。这不仅降低了中文的 Token 消耗，也提升了中文场景下的推理速度。

**Q4: 在 Agent 多轮对话中，如何避免历史记录撑爆 Context Window？**
A4: 常见策略有三种：1) 滑动窗口：只保留最近 N 轮对话；2) 摘要压缩：当对话达到一定长度，调用 LLM 将历史摘要压缩为简短文本；3) 向量检索：将历史对话存入向量数据库，每轮根据当前问题动态检索最相关的历史片段注入上下文。

**Q5: Output Token 的生成速度比 Input Token 的处理速度慢，这是否意味着我应该尽量多写 Prompt，少让模型回答？**
A5: 这是一个成本与延迟的权衡。多写 Prompt 会增加 Input Token 成本和 TTFT 延迟；少让模型回答虽然降低了 Output 成本，但可能无法满足业务需求。最佳实践是：Prompt 精炼且信息密度高，要求模型输出结构化数据（如 JSON），避免冗长的客套话和解释性废话。

---

## 参考资料

- [OpenAI: Tokenizer 工具与概念解释](https://platform.openai.com/tokenizer)
- [Hugging Face: Tokenizer 总结](https://huggingface.co/docs/transformers/main/en/tokenizer_summary)
- [Liu et al., 2023: Lost in the Middle: How Language Models Use Long Contexts](https://arxiv.org/abs/2307.03172)
- [Vance Brown, 2023: Token Cost Impact on Latency in LLMs](https://vancebrown.com/2023/10/02/token-cost-impact-on-latency-in-llms/)
- [Yi Tay et al., 2020: Are Pre-trained Language Models Aware of Phrases?](https://arxiv.org/abs/2010.01)

---

## 📋 本日知识点清单

- [ ] Token 和 Tokenizer 的基本概念
- [ ] Context Window 的含义与限制
- [ ] Input Token vs Output Token 的成本差异
- [ ] 不同语言（中英文）的 Token 效率对比
- [ ] 为什么 Context Window 越大不意味着可以无限塞 Context
- [ ] Token Count 对延迟和成本的影响

## 📝 实践练习

实现 count_tokens(text) 函数，测试不同文本的 Token 数量和请求延迟。

---

*本文是「AI Agent 工程师」6 个月学习计划的一部分。学习路线：LLM → Inference → Runtime → Harness → Memory → Environment → Evaluation → Production。目标：Agent / AI Systems Engineer。*
