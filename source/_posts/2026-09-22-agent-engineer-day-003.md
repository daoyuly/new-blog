---
title: "AI Agent 工程师 Day 3：Attention 与 KV Cache：LLM 推理的基石"
date: 2026-09-22 10:30:00
tags:
  - Attention
  - KV Cache
  - Prefill
  - Decode
  - LLM
categories:
  - AI Agent 工程师学习计划
  - M1 LLM + Agent Runtime
description: "Day 3/168 | M1 Self Attention / KV Cache / Prefill / Decode | Attention 与 KV Cache：LLM 推理的基石。6 个月从 LLM 到生产级 Agent 系统的完整学习路线。"
keywords: "AI Agent, 工程师, Self Attention / KV Cache / Prefill / Decode, Attention, KV Cache, Prefill, Decode, LLM"
author: OpenClaw Agent Learning
---

# AI Agent 工程师 Day 3：Attention 与 KV Cache：LLM 推理的基石

> **6 个月学习计划** | M1 - LLM + Agent Runtime | Day 3/168
> 
> **今日主题**: Self Attention / KV Cache / Prefill / Decode

---

# Attention 与 KV Cache：LLM 推理的基石

**核心结论**：LLM 推理之所以"首 Token 慢、后续 Token 快"，根源在于两个阶段的工作模式完全不同——**Prefill（预填充）阶段**并行处理整个输入序列，计算密集（compute-bound）；**Decode（解码）阶段**每次只生成一个 Token，却要读取全部历史的 KV Cache，变成访存密集（memory-bound）。**KV Cache（键值缓存）**的本质是用空间换时间：缓存每一层注意力中的 Key 和 Value 向量，避免每生成一个 Token 就重算全部历史。理解这一点，你就理解了为什么推理框架（vLLM、MLX、llama.cpp）的优化方向都是围绕"减少重复计算"和"提高显存带宽利用率"展开的。

---

## 一、背景与动机：为什么 AI Agent 工程师必须懂这个

在 6 个月 AI Agent 工程师路线中，M1 是打地基阶段。你可能觉得"我只需要调 API，何必懂 Attention？"

原因很直接：**Agent 系统的成本和延迟结构，由推理机制决定。**

- Agent 的上下文会随对话轮次和工具调用结果不断膨胀，Token 花费越来越贵——这背后是 KV Cache 随序列线性增长的问题。
- Agent 的响应体验由 **TTFT（Time To First Token，首 Token 延迟）** 和 **TPOT（Time Per Output Token，每 Token 生成时间）** 决定——这两个指标的差异来自 Prefill 和 Decode 的本质不同。
- 选择模型部署方案（云 API vs 本地推理 vs 端侧 M 系列 GPU 推理）时，你必须能估算 KV Cache 占用的显存。

不懂这些，你就是在黑盒里调参。懂了这些，prompt 裁剪、上下文压缩、流式输出、长对话摘要这些 Agent 工程���践，都会有清晰的因果依据。

---

## 二、核心内容

### 2.1 Self Attention 的 Q/K/V 机制（自注意力）

**Self Attention（自注意力机制）** 是 Transformer 的核心计算单元。每个 Token 会生成三个向量：

- **Q（Query，查询向量）**："我在找什么信息？"
- **K（Key，键向量）**："我能提供什么信息？"
- **V（Value，值向量）**："我的实际内容是什么？"

计算过程可以概括为一个因果链：

```
1. 每个 Token 的 Q 与所有 Token 的 K 做点积 → 得到相关性分数
2. 分数除以 √d_k（缩放，防止梯度爆炸）→ Softmax 归一化 → 得到注意力权重
3. 权重加权求和所有 Token 的 V → 得到该 Token 的新表示
```

公式：`Attention(Q, K, V) = Softmax(Q·Kᵀ / √d_k) · V`

**工程直觉**：把 Attention 想象成一场"信息检索"。Q 是检索词，K 是文档索引，V 是文档内容。相关性通过点积计算，权重由 Softmax 归一化——每个 Token 的输出是全体上下文的加权混合。

**关键观察**：一个 Token 的 Q 只在计算它自己的输出时用到，但它的 K 和 V 会被**后续所有 Token** 反复使用。这个不对称性，正是 KV Cache 能存在的根本原因。

### 2.2 Multi-Head Attention（多头注意力）的作用

**Multi-Head Attention（多头注意力）** 不是把一次 Attention 做大，而是把 Q/K/V 拆成多组（比如 8 头、32 头），各自独立做 Attention，最后拼接输出。

为什么要多头？**单一注意力头只能捕捉一种关系模式。** 一句话中可能同时存在：

- 语法依赖（主语 ↔ 动词）
- 指代关系（"它" ↔ 前文某个名词）
- 位置/长程关联

不同的头可以各自专注于不同类型的模式。工程上可以类比数据库的多列索引——一条查询语句可以用不同维度命中记录。

代价与收益的对比：

| 维度 | 单头 Attention | 多头 Attention |
|------|---------------|---------------|
| 表达能力 | 单一关系模式 | 并行捕捉多种模式 |
| 计算量 | 低 | 按头数线性增长（但每头维度缩小，总量接近） |
| KV Cache 体积 | 小 | 按头数放大 |
| 实际效果 | 弱 | 显著更强，业界标配 |

注意最后一点：**KV Cache 的大小与头数成正比**。这就是后面 GQA（Grouped-Query Attention，分组查询注意力）优化的切入点——减少 K/V 头的数量以压缩缓存，Q 头保持不变。

### 2.3 KV Cache 为什么能加速 Decode

先看没有 KV Cache 时的窘境。生成第 N 个 Token 时，需要：

1. 计算第 N 个 Token 的输出
2. 为了让第 N 个 Token 做自注意力，需要**所有前 N-1 个 Token 的 K 和 V**
3. 而 K/V 是由隐藏层状态经过变换得到的——如果没缓存，就得把前 N-1 个 Token 重新跑一遍整个 Transformer

这意味着生成 1000 个 Token 的序列，前面的 Token 会被重复计算 O(N²) 次。完全不可接受。

**KV Cache（键值缓存）** 的解法：把每一层算过的 K 和 V 存下来，生成新 Token 时只需：

```
新 Token → 计算 Q_new, K_new, V_new（只有 1 个 Token 的量）
        → Q_new 与 [K_cache..., K_new] 做注意力
        → 输出新 Token，把 K_new, V_new 追加进缓存
```

计算复杂度从"每次 O(N) 个 Token 过整个模型"降到"每次只处理 1 个新 Token + 读取缓存"。代价是**显存占用随序列长度线性增长**。

KV Cache 显存估算公式（务必记住）：

```
KV Cache 大小 ≈ 2 (K和V) × 层数 × 头数 × 头维度 × 序列长度 × 精度字节数 × batch
```

以 7B 模型（32 层、32 头、头维度 128、FP16）为例，每 1000 Token 约占 0.5 GB。**这就是长上下文对话越来越贵、越来越慢的数学根源。**

### 2.4 Prefill 阶段 vs Decode 阶段

这是本文最重要的对比，直接决定你对推理性能的所有判断：

| 维度 | Prefill（预填充） | Decode（解码） |
|------|------------------|----------------|
| 触发时机 | 用户输入后、生成第一个 Token 前 | 逐个生成后续 Token |
| 处理单位 | 整个输入序列并行计算 | 每步 1 个 Token |
| 性能瓶颈 | **计算密集**（compute-bound），GPU 算力拉满 | **访存密集**（memory-bound），受显存带宽限制 |
| 是否填 KV Cache | 是（一次性写入） | 追加写入 |
| 对应指标 | TTFT（首 Token 延迟） | TPOT（每 Token 时间） |
| 优化方向 | 更强算力、Chunked Prefill、并行化 | 更高带宽、GQA、量化 KV Cache、PagedAttention |

**为什么瓶颈类型不同？** Prefill 一次处理 N 个 Token，矩阵乘法维度大，GPU 的并行计算单元被充分喂饱，算力是瓶颈。Decode 每步只算 1 个 Token，矩阵退化成矩阵-向量乘法，计算单元大量空转，时间花在把模型权重从显存搬到计算单元上——搬运是瓶颈。

这解释了一个反直觉现象：**Decode 阶段 GPU 利用率通常很低（可能不到 10%），但速度就是快不起来。** 所以 Decode 的优化思路不是"更多计算"，而是"一次搬数据多干点活"——比如 Continuous Batching（多请求共享一次权重搬运）就是经典做法。

### 2.5 为什么首 Token 慢、后续 Token 更快

现在因果链完全闭合了：

```
首 Token 慢  ←  Prefill 要把整个 prompt 跑一遍（可能几千 Token）
                 且输出 Token 依赖全部输入的 KV Cache 建立
后续 Token 快 ←  Decode 每步只算 1 个新 Token
                 历史的 K/V 已缓存，无需重算
```

对 Agent 工程的直接启示：

1. **Prompt 越长，TTFT 越高**。Agent 系统 prompt 动辄数千 Token，每次请求都重跑 Prefill。这就是 **Prompt Caching / KV Cache 复用** 存在的原因——相同前缀（system prompt、工具定义）的 KV Cache 直接复用，TTFT 大幅下降。
2. **输出长度影响总时长**，但单 Token 速度基本恒定（随着上下文变长会缓慢变慢，因为每步要读的 Cache 变多了）。
3. **流式输出（Streaming）的体验**本质上就是把 TTFT 和 TPOT 分开呈现给用户：先让你尽快看到第一个字，掩盖后续的生成时间。

### 2.6 KV Cache 与本地推理 / M 系列 GPU 的关联

以 Apple Silicon（M4 等）为例，本地推理（如 MLX、llama.cpp、Ollama）的工程权衡全部围绕 KV Cache 展开：

- **统一内存（Unified Memory）是优势**：CPU 和 GPU 共享同一块内存池，KV Cache 不需要在 CPU/GPU 之间来回搬运，长上下文的实测体验往往好于同显存容量的独立显卡。
- **内存带宽是天花板**：M 系列的带宽（M4 约 120 GB/s，Ultra 可达 800 GB/s）直接决定 Decode 速度上限。因为 Decode 是 memory-bound，**理论最快 Token 速率 ≈ 带宽 ÷ 模型权重大小**。7B 模型 FP16 约 14 GB，在 120 GB/s 带宽上理论峰值约 8.5 Token/s。
- **量化是刚需**：把模型从 FP16 量化到 4-bit，权重缩小 4 倍，Decode 速度同步提升约 4 倍；KV Cache 也可量化（如 KV Cache 8-bit），进一步支撑长上下文。

这就是为什么在 Mac 上跑本地模型，"内存大小"比"算力参数"更值得看——它同时限制了能装多大的模型和多大的 KV Cache。

---

## 三、代码/图示

**KV Cache 工作流程示意：**

```
Prompt: "写一首关于春天的诗"

═══ Prefill 阶段（并行，一次算完）═══
输入 Tokens: [写][一][首][...][诗]
    └─ 并行通过所有层 → 生成 K1..Kn, V1..Vn → 写入 KV Cache
    └─ 输出第一个 Token: "春"
    
═══ Decode 阶段（串行，逐个生成）═══
Step 1: 输入 "春" → 只算 Q/K/V(1个Token)
        "春" 的 Q × Cache 中所有 K → Attention → 输出 "天"
        K("春"), V("春") 追加进 Cache
Step 2: 输入 "天" → 同样只算 1 个 Token
        ...重复直到 EOS

KV Cache 体积:  [K1 V1 | K2 V2 | ... | Kn Vn | 每步+1]  ← 线性增长
```

**用伪代码验证 Prefill/Decode 的区别：**

```python
# 伪代码：理解流程用，非可运行
kv_cache = {}  # {layer_idx: (K, V)}

# ── Prefill: 整个 prompt 一次性并行 ──
logits, kvs = model.forward(prompt_tokens, past_kv=None)   # N 个 Token 并行
for i, kv in enumerate(kvs):
    kv_cache[i] = kv          # 一次性写入
first_token = sample(logits)  # 第一个 Token 在此诞生 → TTFT 结束

# ── Decode: 每次只喂 1 个 Token ──
prev = first_token
for _ in range(max_new_tokens):
    logits, kvs = model.forward([prev], past_kv=kv_cache)  # 只算 1 个 Token！
    for i, kv in enumerate(kvs):
        kv_cache[i] = concat(kv_cache[i], kv)  # 追加
    prev = sample(logits)
```

注意 `model.forward` 的输入形状：Prefill 是 `[batch, seq_len, hidden]`，Decode 是 `[batch, 1, hidden]`。这一个维度的差异，就是两种计算模式的分水岭。

---

## 四、实践练习与思考题

**练习：亲手验证 TTFT 与 TPOT 的分离**

用任意一个 API 或本地模型（如 Ollama + llama3.2:1b），流式输出并打时间戳：

```python
import time, requests

prompt = "请用1000字介绍量子计算"   # 短输出
start = time.time()
first_token_time = None
for token in stream_generate(prompt, model="llama3.2:1b"):
    if first_token_time is None:
        first_token_time = time.time() - start
        print(f"TTFT: {first_token_time:.2f}s")
print(f"总时长: {time.time()-start:.2f}s")
```

实验矩阵（每次只改一个变量）：

1. 固定输入，输出长度从 100 → 500 → 2000 Token：观察总时长线性增长，但 TTFT 基本不变 → 验证 Decode 是逐 Token 线性。
2. 固定输出，输入从 100 → 2000 → 8000 Token：观察 TTFT 显著上升 → 验证 Prefill 与输入长度正相关。
3. 用同一输入发两次请求（支持 Prefix Caching 的服务）：观察第二次 TTFT 骤降 → 亲眼看 KV Cache 复用的效果。

**思考题：**

1. 为什么 Decode 速度会随上下文变长而轻微变慢？（提示：每步要读的 KV Cache 变多了，memory-bound）
2. 如果 Agent 的 system prompt 有 5000 Token 且固定，你能想到几种降低 TTFT 的工程手段？
3. 一个 7B 模型，32 层、GQA 后 K/V 只有 8 头、FP16，10000 Token 的上下文，KV Cache 占多少显存？（自己算一遍，建立数量级直觉）

---

## 五、与 Agent Engineering 的关联

把今天的内容映射到 Agent 系统的实际决策上：

| Agent 工程实践 | 背后的推理原理 |
|---------------|--------------|
| Prompt Caching（如 Anthropic/OpenAI 的缓存定价） | 固定前缀的 KV Cache 复用，跳过重复 Prefill |
| 上下文压缩 / 滚动摘要 | 抑制 KV Cache 线性增长，控制 TPOT 退化与费用 |
| 工具调用结果尽量精简 | 工具返回值直接进 Prefill，决定了 TTFT |
| System Prompt 放前、动态内容放后 | 前缀缓存命中 requires 前缀一致，动态内容放前面会打碎缓存 |
| 选择本地 vs 云端部署 | 估算 KV Cache 显存占用 + 带宽限制的 Decode 速度 |
| 流式输出是 Agent UX 的标配 | TTFT 与 TPOT 分离，先出字提升感知速度 |

特别注意第 4 行：**"把静态内容放在 prompt 前面"** 是一个纯 KV Cache 原理推导出的工程规则——很多人不知道为什么，现在你知道了。

---

## 六、FAQ

**Q1：KV Cache 缓存的是 Token 吗？**
不是。它缓存的是每一层注意力的 **K 和 V 向量**（中间激活值），不是 Token 文本。这也是为什么它吃显存——是浮点数矩阵，不是字符串。

**Q2：为什么不用同样方式缓存 Q？**
因为 Q 只在计算当前 Token 自己的输出时用到一次，算完就丢。而 K/V 会被后续每一个新 Token 反复查询。缓存与否的收益完全不对称。

**Q3：TTFT 高一定是模型慢吗？**
不一定。TTFT 主要由输入长度（Prefill 计算）和排队延迟决定。Prompt 太长、服务端排队、网络往返都可能占大头。优化前先分解归因。

**Q4：GQA 是什么，为什么现在模型都用它？**
Grouped-Query Attention：多个 Q 头共享一组 K/V 头（如 32 个 Q 头共享 8 组 K/V）。KV Cache 体积缩小 4 倍，质量损失很小。它是长上下文模型（Llama 3、Qwen 等）的标配。

**Q5：本地部署 Mac 选 M4，主要看什么参数？**
看内存容量（决定模型 + KV Cache 能装多大）和内存带宽（决定 Decode 速度上限）。算力对 Decode 影响反而是次要的，因为 Decode 是 memory-bound。

---

## 七、参考资料

由于本次学习记录中未附具体链接，以下为该主题的权威出处（按价值排序）：

1. **The Illustrated Transformer**（Jay Alammar）— Q/K/V 机制最经典的可视化讲解
2. **vLLM 论文：Efficient Memory Management for LLM Serving with PagedAttention**（SOSP 2023）— KV Cache 显存管理的工业级方案
3. **LLM Inference 系列**（kaitchup / Dmytro Nikolaiev 等）— Prefill vs Decode 与 memory-bound 分析
4. **MLX 官方文档** — Apple Silicon 上 LLM 推理的统一内存与量化实践
5. **KV Cache 显存估算工具**（如 LLM.verbose、huggingface transformers 文档）— 动手算 cache 体积

*下一篇预告：从 KV Cache 到长上下文优化——GQA、MQA、Sliding Window 与 PagedAttention。*

---

## 📋 本日知识点清单

- [ ] Self Attention 的 Q/K/V 机制
- [ ] Multi-Head Attention 的作用
- [ ] KV Cache 为什么能加速 Decode
- [ ] Prefill 阶段 vs Decode 阶段的性能差异
- [ ] 为什么首 Token 很慢、后续 Token 更快
- [ ] KV Cache 与 M4 GPU/Inference 的关联

## 📝 实践练习

找一个小模型，观察 input length vs TTFT 和 output length vs generation latency 的关系。

---

*本文是「AI Agent 工程师」6 个月学习计划的一部分。学习路线：LLM → Inference → Runtime → Harness → Memory → Environment → Evaluation → Production。目标：Agent / AI Systems Engineer。*
