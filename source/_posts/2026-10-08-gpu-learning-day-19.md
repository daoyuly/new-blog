---
title: GPU 学习日报 Day 19：Batching：从 1 到 32 的吞吐量飞跃
tags:
  - GPU 学习日报
  - Batching
  - Continuous Batch
  - Throughput
  - Latency
  - LLM
categories:
  - GPU → LLM Inference 学习计划
  - Week 3 从 GPU 进入 LLM
description: >-
  Day 19/30 | Batch 策略与吞吐量 | Batching：从 1 到 32 的吞吐量飞跃。30 天从 GPU 硬件到 LLM
  推理性能的深度学习计划。
keywords: >-
  GPU, CUDA, LLM, Inference, Batch 策略与吞吐量, Batching, Continuous Batch,
  Throughput, Latency, LLM
author: OpenClaw GPU Learning
abbrlink: 17155
date: 2026-10-08 10:00:00
---

# GPU 学习日报 Day 19：Batching：从 1 到 32 的吞吐量飞跃

> **30 天学习计划** | Week 3 - 从 GPU 进入 LLM | Day 19/30
> 
> **今日主题**: Batch 策略与吞吐量

---

# Batching：从 1 到 32 的吞吐量飞跃

> **核心结论（TL;DR）**：LLM 推理是典型的 Memory-Bound（访存受限）任务——GPU 的算力大量闲置，瓶颈在于显存带宽。Batching 的本质是**让一批请求共享同一次权重读取**，用一次搬运养活多个请求，从而把单次权重加载的“固定成本”摊薄到 N 个用户头上。Batch 从 1 提升到 32，吞吐量（Throughput）常常提升 10~30 倍，而单个请求的延迟（Latency）只增加 20%~50%。但传统 Static/Dynamic Batching 在 LLM 场景下会因“请求长度参差”导致队头阻塞（Head-of-Line Blocking），Continuous Batching（连续批处理）通过请求级细粒度调度解决了这个问题。**结论先行：如果你的推理服务没有 Continuous Batching，你的 GPU 利用率大概率低于 20%。**

---

## 一、背景与动机：为什么 Batching 是 LLM 服务的第一课

假设你部署了一个 7B 模型，单请求 Batch=1 时 GPU 利用率只有 15%。这意味着你花几万元买的 A100/H800，超过 85% 的时间在“发呆”。理解 Batching，就是理解这些浪费从哪里来、如何赚回来。

这个问题对 LLM 尤其重要，因为 LLM 推理和传统深度学习推理有一个本质区别：**传统模型的输入是定长的，一次前向就出结果；LLM 是自回归的，一个 token 一个 token 地吐**。这个区别让 LLM 的 Batching 策略自成体系，也是本篇的重点。

---

## 二、核心内容

### 2.1 Batch=1 vs Batch=32：物理直觉从哪来

**Memory-Bound（访存受限）与 Compute-Bound（算力受限）** 的区别是理解一切的基础。

看一次 Decode 阶段（逐 token 生成）的计算过程：

- 权重读取：7B 模型 FP16 ≈ 14 GB，每个 token 生成都要**完整读一遍所有权重**
- 计算量：约 2 × 7B = 14 GFLOPs（每 token）
- 时间下限：14 GB ÷ 2 TB/s（HBM 带宽）≈ 7 ms

对比一下 GPU 的算力：A100 FP16 有 312 TFLOPS，算这 14 GFLOPs 只需要约 0.045 ms。也就是说：

> **GPU 算得飞快，但 99% 的时间在等权重从显存搬过来。这就是 Memory-Bound。**

现在加入 Batch。关键洞察是：**Batch 内所有请求用的是同一份权重**。权重读取是“固定成本”，不管你养活 1 个请求还是 32 个请求，搬运量几乎不变（激活值会增大，但相对权重是小头）。

| 指标 | Batch=1 | Batch=32 |
|---|---|---|
| 权重搬运量 | 14 GB | 14 GB（基本不变） |
| 计算量 | 14 GFLOPs | ~448 GFLOPs |
| 每步耗时 | ~7 ms | ~9 ms（约 1.3 倍） |
| 系统吞吐 | 143 tokens/s | ~3600 tokens/s（**25 倍**） |
| 单请求延迟 | 基线 | 增加 20%~50% |

一句话因果链：**Memory-Bound → 权重搬运是固定成本 → Batch 摊薄固定成本 → 吞吐量近似线性增长，而延迟只小幅上升**。这是 Batching 全部价值的物理来源。

（补充：Prefill 阶段由于一次处理大量 token，算术强度高，接近 Compute-Bound，Batching 收益小得多——这点在 2.5 节展开。）

### 2.2 Dynamic Batch 的问题：为什么传统方案在 LLM 上失灵

先厘清三个概念：

| 方案 | 英文 | 工作方式 | 问题 |
|---|---|---|---|
| 静态批处理 | Static Batching | 攒够固定 Batch 再一次性推理 | 必须等最慢的请求结束才能放行整批 |
| 动态批处理 | Dynamic Batching | 在固定时间窗口（如 50ms）内攒请求组成一批 | 批次内请求必须同生共死，粒度太粗 |
| 连续批处理 | Continuous Batching | **每一步 Decode 后重新调度**，完成的立即退出，新请求随时插入 | 实现复杂，需管理 KV Cache |

传统 Dynamic Batching 是为 CV/推荐模型设计的——输入定长、一次前向出结果、请求生命周期一致。但 LLM 的输出长度天差地别：同一个 Batch 里，有人生成 10 个 token 就结束，有人生成 1000 个 token。

后果就是**队头阻塞（Head-of-Line Blocking）**：

```
Static/Dynamic Batching 的时间线：

Batch 内请求:  A(10 token) ████░░░░░░░░░░░░░░░░
               B(50 token) ██████████░░░░░░░░░░
               C(1000 token)████████████████████
                             ↑
              A、B 早就完成，但槽位空转，等 C 结束才能开新批

█ = 在计算   ░ = 空转等待
```

A 和 B 的槽位大量空转，等效 Batch Size 越来越小，吞吐量优势被蚕食。输出长度方差越大，浪费越严重——而 LLM 恰恰是输出长度方差极大的场景。

### 2.3 Continuous Batching：每一步都是新的一批

**Continuous Batching**（也叫 In-flight Batching / Iteration-level Batching，由 Orca 论文 2022 年提出）的核心思想只有一句话：

> **调度粒度从“请求级”降到“迭代级”——每次 Decode 迭代之后都重新组装 Batch。**

```
Continuous Batching 的时间线：

A(10 token)    ████
B(50 token)      ██████████          ← A 完成后立即有 D 插入
C(1000 token)      ██████████████████████████
D                    ████████████
E                      ████████████████
              ↑ A 一结束，D 立刻顶上，槽位几乎零空转
```

效果：GPU 上始终保持高 Batch，槽位利用率接近 100%。工业界效果数据：vLLM 论文报告相比静态 Batching 吞吐提升 **2~4 倍**；相比 Batch=1，提升可达 10 倍以上。

但要实现它，必须解决两个工程问题：

1. **KV Cache 显存管理**：请求随时进出，KV Cache 的分配和释放必须高效且无碎片。vLLM 的答案就是 **PagedAttention**——像操作系统管理内存页一样，把 KV Cache 切成固定大小的 Block 按需分配，碎片率从 60%~80% 降到 4% 以下。
2. **调度器开销**：每步迭代都要做调度决策，逻辑必须轻量（通常只是优先级队列 + 空闲槽位检查）。

**判断明确：2024 年之后生产的所有主流推理框架（vLLM、TensorRT-LLM、SGLang、TGI）都已默认采用 Continuous Batching。任何还在用请求级批处理的方案，都可以直接判定为过时。**

### 2.4 Throughput vs Latency：鱼与熊掌的经典权衡

**吞吐量（Throughput）**：系统每秒处理的总 token 数，衡量资源效率。
**延迟（Latency）**：单个请求从发出到完成的时间，衡量用户体验。

Batching 提高吞吐的代价是延迟上升，原因有二：

1. **排队延迟**：你的请求要等当前 Batch 有空位；
2. **迭代变慢**：Batch 越大，单次 Decode 迭代耗时越长（虽然远非线性增长），每个 token 的生成间隔（ITL，Inter-Token Latency）被拉长。

对聊天场景，用户感知的主要是 **TTFT（Time To First Token，首 token 延迟）** 和 **TPOT/ITL（每 token 生成时间）**。Batch 太大时 ITL 上升，用户会感觉“打字机变慢了”。

实践中的分界线：

| 目标 | Batch 策略 | 典型场景 |
|---|---|---|
| 延迟优先 | Batch ≤ 4，或干脆 1 | 实时对话、代码补全 |
| 平衡 | Batch 8~32 | 通用 API 服务 |
| 吞吐优先 | Batch 64+，离线批处理 | 数据标注、评测、蒸馏数据生成 |

经验法则：**在线服务看 P99 延迟设置 Batch 上限；离线任务把 Batch 拉满**。没有免费的午餐，但有便宜的午餐——由于 Memory-Bound 特性，Batch 从 1 到 8 的吞吐增益几乎是“白捡”的，延迟代价极小。

### 2.5 为什么 Batching 对 Prefill 和 Decode 的影响不同

这是最容易混淆、也最能体现理解深度的一点。LLM 推理分两个阶段，物理性质完全不同：

| 维度 | Prefill（预填充） | Decode（解码） |
|---|---|---|
| 每步处理的 token 数 | 整个 Prompt（成百上千） | 1 个（×Batch） |
| 算术强度（FLOPs/Byte） | 高，数百 | 低，≈ 1~2 |
| 瓶颈 | **Compute-Bound** | **Memory-Bound** |
| Batching 收益 | 小（并行度已被 Prompt 长度吃满） | 大（靠 Batch 提供并行度） |

原因的因果链：

- **Decode 时每步只有 1 个 token**，矩阵乘法退化成矩阵-向量乘（GEMV），算术强度约等于 1，完全喂不饱 GPU 的算力——只能靠 Batch=32 来提供 32 倍的“并行 token”填满流水线。
- **Prefill 时一个请求就有几百上千个 token**，本身就是大矩阵乘（GEMM），���行度已经很高，接近算力上限。再叠加 Batch，计算时间按比例增长，**吞吐几乎不涨，延迟明显变坏**。

由此衍生出一个重要的工程实践：**Prefill 与 Decode 分离调度**，即 Chunked Prefill / Prefill-Decode Disaggregation（如 SARATHI、DistServe 的方案）。如果一个大 Prompt 的 Prefill 和别人的 Decode 混在同一批次，Prefill 的长计算会阻塞所有正在 Decode 的请求，导致 ITL 尖刺。拆开调度（或把 Prefill 切成 chunk 分次执行）可以让延迟曲线平滑得多。

---

## 三、图示：一次 Decode 迭代的成本结构

```
单次 Decode 迭代的时间构成（Batch=1 vs 32，A100, 7B FP16）：

Batch=1:   [===== 权重搬运 14GB ≈ 7ms =====][计算 0.05ms]   ← GPU 99% 时间在读权重

Batch=32:  [===== 权重搬运 14GB ≈ 7ms =====][计算 1.6ms]    ← 同样的搬运，算 32 倍的活

           吞吐: 143 tok/s  ──────────────►  ~3600 tok/s
```

“搬运成本不变、计算量翻倍、总时长几乎不变”——这就是 Batching 红利的全部秘密。

---

## 四、实践练习与思考题

**练习：测量 Trade-off 曲线**

用 vLLM 跑同样的 100 条请求，改变 max_num_seqs（等效 Batch 上限）：

```python
from vllm import LLM, SamplingParams

prompts = ["写一段 200 字的产品介绍。"] * 100
for max_seqs in [1, 4, 8, 16, 32]:
    llm = LLM(model="Qwen/Qwen2.5-7B-Instruct", max_num_seqs=max_seqs)
    # 记录: 总吞吐 tokens/s、平均 TTFT、平均 ITL、P99 延迟
```

预期观察到的现象：

- 吞吐随 Batch 增大而上升，但**增速递减**（逐渐从 Memory-Bound 过渡到受算力限制）
- TTFT 随排队而上升，ITL 随 Batch 增大而缓慢变差
- 画出 “Throughput vs Latency” 双轴曲线，找到拐点

**思考题**：

1. 如果模型完全 Compute-Bound（比如 Prefill），Batching 还划算吗？为什么？
2. 输出长度方差越大，Static Batching 浪费越严重——请用 2.2 节的图推算：A/B/C 三请求 Static Batch 的平均槽位利用率是多少？
3. 为什么 GQA（分组查询注意力）能进一步提升 Batch 下的吞吐？（提示：KV Cache 也是要搬运的数据。）

---

## 五、与 LLM Inference 的关联

Batching 不是孤立技巧，而是 LLM 推理优化体系的地基：

- **它是吞吐优化的第一杠杆**：量化、算子融合的收益以十百分比计，Batching 的收益以倍数计；
- **KV Cache 容量决定 Batch 上限**：Batch=32 时 KV Cache 占用是 Batch=1 的 32 倍，显存不够就得抢占或换出——这直接引出 PagedAttention 和 KV Cache 量化；
- **Continuous Batching 是调度器的核心**，与 Chunked Prefill、Speculative Decoding（投机采样生成的 token 也要组 Batch 验证）协同工作；
- **成本核算的单位是 token 吞吐**：Batching 做得好，单 token 服务成本可以差出一个数量级，这决定了你的产品定价是否有竞争力。

---

## FAQ

**Q1：Batch 越大越好吗？有上限吗？**
不是。Batch 增大到一定程度后，权重搬运被摊薄到极致，瓶颈转移到算力和 KV Cache 容量，吞吐增速递减；同时延迟持续上升。找到拐点的方法就是第四节的压测。经验上 7B 模型在线服务 Batch 在 16~64 之间常见。

**Q2：Continuous Batching 和 Dynamic Batching 有什么区别？**
Dynamic Batching 的调度粒度是“请求级”：批次组成后同生共死，必须等最慢请求结束。Continuous Batching 的调度粒度是“迭代级”：每步 Decode 后请求可随时退出/加入。前者在 LLM 上会队头阻塞，后者槽位利用率接近 100%。

**Q3：为什么我的推理服务吞吐和理论差 10 倍？**
大概率是 Batch 没上去。检查三点：框架是否支持 Continuous Batching；max_num_seqs / max_batch_size 是否设得太小；KV Cache 显存占比是否太低导致实际并发上不去。

**Q4：TTFT 和 ITL 分别受 Batching 什么影响？**
TTFT 主要受排队影响——Batch 满了要等空位；ITL 受单步迭代变慢影响——Batch 越大每步越慢。优化 TTFT 靠更快腾出槽位和 Chunked Prefill，优化 ITL 靠控制 Batch 上限和 Prefill/Decode 分离。

**Q5：小模型还需要 Batching 吗？**
更需要。小模型参数少，权重搬运的固定成本更低，单次迭代极快，Memory-Bound 往往更严重——不 Batch 时 GPU 利用率可能低到个位数。小模型恰恰是靠大 Batch 才能榨出高吞吐的。

---

## 参考资料

1. Yu et al., *Orca: A Distributed Serving System for Transformer-Based Generative Models*, OSDI 2022 —— Continuous Batching（Iteration-level Scheduling）的开山之作
2. Kwon et al., *Efficient Memory Management for Large Language Model Serving with PagedAttention*, SOSP 2023（vLLM）—— Continuous Batching + KV Cache 分页管理的工业标准
3. NVIDIA TensorRT-LLM 文档：In-flight Batching 章节
4. vLLM 官方文档：Continuous Batching 与调度器配置（max_num_seqs、gpu_memory_utilization）
5. Pope et al., *Efficiently Scaling Transformer Inference*, MLSys 2023 —— Memory-Bound 分析的理论基础

---

## 📋 本日知识点清单

- [ ] Batch=1 vs Batch=32 的性能差异
- [ ] Dynamic Batch 的问题
- [ ] Continuous Batch 的优势
- [ ] Throughput vs Latency 的 trade-off
- [ ] 为什么 Batching 对 Prefill 和 Decode 的影响不同

## 📝 实践练习

对比 Batch=1/4/8/16/32 下的 Tokens/s 和 Latency，画出 trade-off 曲线。

---

*本文是「GPU → LLM Inference」30 天学习计划的一部分。学习路线：GPU 硬件 → CUDA 执行模型 → 显存/带宽 → Kernel → Attention → KV Cache → 并行策略 → 推理性能。*
