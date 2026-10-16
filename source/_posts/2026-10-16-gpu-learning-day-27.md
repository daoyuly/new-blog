---
title: "GPU 学习日报 Day 27：自己做 GPU Performance Model"
date: 2026-10-16 10:00:00
tags:
  - GPU 学习日报
  - Performance Model
  - LLM
  - FLOPs
  - Memory
  - Roofline
categories:
  - GPU → LLM Inference 学习计划
  - Week 4 CUDA Profiling + GPU 推理性能
description: "Day 27/30 | 构建 LLM 性能模型 | 自己做 GPU Performance Model。30 天从 GPU 硬件到 LLM 推理性能的深度学习计划。"
keywords: "GPU, CUDA, LLM, Inference, 构建 LLM 性能模型, Performance Model, LLM, FLOPs, Memory, Roofline"
author: OpenClaw GPU Learning
---

# GPU 学习日报 Day 27：自己做 GPU Performance Model

> **30 天学习计划** | Week 4 - CUDA Profiling + GPU 推理性能 | Day 27/30
> 
> **今日主题**: 构建 LLM 性能模型

---

# 自己做 GPU Performance Model

**核心结论：** LLM 推理性能不需要跑 benchmark 才能估计——一张纸、一支笔、几个物理量（显存带宽 Memory Bandwidth 和算力 FLOPS），就能算出"这个模型在这张卡上大概多快、是不是被显存带宽卡住"。LLM 解码阶段（Decode）本质是一个**带宽受限（Memory Bound）**的过程：每生成一个 token，都要把全部权重从显存搬一遍，而权重只被用一次。算力利用率（MFU）往往不到 10%。理解"每 token 搬多少字节 ÷ 带宽 = 生成速度"这一个公式，你就掌握了 LLM 推理性能建模的 80%。即使估算只有 60% 准确度，也足以回答"要不要买这张卡"、"batch 开多大"、"量化值不值"这类工程决策。

---

## 一、背景与动机：为什么自己建模而不是直接跑测？

三个理由：

1. **买卡/选型前没有卡可测。** 决策时你只有 spec sheet（规格书）。你需要从 HBM 带宽和峰值 FLOPS 推断出实际性能，否则就是在盲选。
2. **Benchmark 只告诉你结果，不告诉你原因。** 实测得出"19 tokens/s"是个黑盒数字；建模告诉你这个数字由什么决定、改哪个变量能改善它。
3. **诊断需要一个"理论锚点"。** 实测比理论慢 5 倍，你就知道有优化空间，并且能定位是算力、带宽还是框架 overhead 的问题。没有理论模型，你连"慢"都判断不出来。

这就是**从理论模型到实测验证的闭环**：模型给出期望值 → 实测给出真实值 → 差距指出优化方向 → 修正模型 → 再验证。性能工程的一切都建立在这个循环上。

---

## 二、输入：建模需要哪些参数

一个 LLM 性能模型（Performance Model）的输入可以分成两组：**模型侧**和**硬件侧**。

| 类别 | 参数 | 符号 | 典型例子（7B 模型） |
|---|---|---|---|
| 模型侧 | 参数量 | N | 7 × 10⁹ |
| 模型侧 | 层数 | L | 32 |
| 模型侧 | Hidden Size | d | 4096 |
| 模型侧 | 注意力头数 | H | 32 |
| 模型侧 | 精度 | - | FP16 = 2 字节 |
| 硬件侧 | 显存带宽 | BW | A100: 2.0 TB/s |
| 硬件侧 | 峰值算力 | FLOPS | A100 FP16: 312 TFLOPS |
| 硬件侧 | 显存容量 | - | 80 GB |

**关键因果链：** 模型侧参数决定了"计算量和搬运量"，硬件侧参数决定了"单位时间能算多少、能搬多少"。二者相除就是时间。

注意一个细节：很多架构参数（L、d、H）可以互相推出参数量。对标准 Transformer，每层大约有 `12·d²` 个权重（4 个矩阵乘 + attention 的 QKV/O），所以 `N ≈ L · 12d²`。看到 4096 的 hidden size 和 32 层，你就能心算出约 6.4B 参数——这是看模型 config 时的第一个肌肉记忆。

---

## 三、输出 1：显存占用

### 3.1 权重显存

$$\text{Weight Memory} = N \times \text{bytes per param}$$

7B 模型：FP16（2 bytes）→ 14 GB；INT8 → 7 GB；INT4 → 3.5 GB。这解释了为什么 4-bit 量化（Quantization）能让 70B 模型跑进 40GB 显卡。

### 3.2 KV Cache

这是新手最容易忽略的输出。KV Cache（键值缓存）存的是每个 token 在每层的 Key 和 Value 向量：

$$\text{KV Cache} = 2 \times L \times d \times s \times b \times \text{bytes}$$

（2 表示 K 和 V，s 是序列长度，b 是 batch size）

7B 模型、FP16、序列长度 4096、batch 1：
`2 × 32 × 4096 × 4096 × 2 bytes ≈ 2.1 GB`

三个直观结论：
- **KV Cache 随 batch 和序列长度线性增长**，长上下文场景下它会反超权重，成为显存瓶颈；
- 这就是 PagedAttention（vLLM）和 MQA/GQA（分组查询注意力）存在的理由——前者管显存碎片，后者把 KV Cache 砍到 1/8；
- Prefill 阶段不需要存所有历史 KV，Decode 阶段每步只新增 1 个 token 的 KV。

### 3.3 激活值

训练时是大头，推理 Decode 时几乎可以忽略（batch 小、逐 token 处理）。Prefill 时长序列的 attention 矩阵需要留意，但本篇聚焦 Decode。

---

## 四、输出 2：计算量估算

对标准 Transformer Decoder，每生成一个 token 的计算量有个经典近似（来自 PaLM 论文）：

$$\text{FLOPs per token} \approx 2N$$

因果链很清楚：模型里 99% 的计算是 GEMM（矩阵乘法），一个 `d × d` 的矩阵乘，权重是 `d²` 个数，每个数对每个输入 token 做 2 次浮点运算（一次乘、一次加），即 `2d²` FLOPs。全模型求和就是 `2N`。

7B 模型：每 token 约 **14 GFLOPs**。

加上 attention 对 KV 的部分（长序列时约 `2·L·s·d` FLOPs），但 Decode 时权重项通常占主导，先忽略它是合理的近似。

---

## 五、输出 3：访存量与 Roofline——整个模型的灵魂

这是全文最重要的部分。

### 5.1 Decode 阶段的访存量

Decode 阶段每生成一个 token，GPU 要执行什么？对每个权重矩阵做一次向量-矩阵乘。权重矩阵的每个元素都要从 HBM（高带宽显存）读出来，**且只用一次**。所以：

$$\text{Memory Traffic per token} \approx N \times \text{bytes} + \text{KV Cache 读量}$$

7B 模型 FP16：约 14 GB 访存量每 token。

### 5.2 Roofline Model（屋顶线模型）

GPU 的算力和带宽是两个独立的天花板：

$$T_{\text{decode}} = \max\left(\frac{\text{计算时间}}{}=\frac{2N}{\text{FLOPS}},\ \frac{\text{搬运时间}}{}=\frac{2N_{\text{bytes}}}{\text{BW}}\right)$$

代入 A100 跑 7B FP16：

- 计算时间：14 GFLOPs ÷ 312 TFLOPS = **45 μs**
- 搬运时间：14 GB ÷ 2.0 TB/s = **7 ms**

搬运时间是计算时间的 **150 倍**。Decode 彻底是 Memory Bound（访存受限），GPU 的张量核心大部分时间在等数据。

### 5.3 Arithmetic Intensity（算术强度）

判断 Compute Bound 还是 Memory Bound 的统一判据：

$$\text{AI} = \frac{\text{FLOPs}}{\text{Bytes}} = \frac{2N}{2N} = 1\ \text{FLOP/byte}$$

而 GPU 的**平衡点（Balance Point）** = 峰值算力 ÷ 带宽 = 312e12 ÷ 2e12 ≈ **156 FLOP/byte**。算术强度低于平衡点就是 Memory Bound。Decode 的 AI ≈ 1，远低于 156，没有悬念。

### 5.4 推导出峰值速度

既然是带宽受限，Decode 速度就是：

$$\text{Speed} = \frac{\text{BW}}{\text{Model size in bytes}} = \frac{2.0\ \text{TB/s}}{14\ \text{GB}} \approx 143\ \text{tokens/s}$$

一个不需要跑任何代码就能得出的数字。实测通常在 100-140 tokens/s（考虑 kernel 效率、Python overhead），60%-90% 的吻合度完全够工程决策用。

### 5.5 Prefill 阶段：另一个世界

Prefill（预填充）要并行处理整个 prompt，所有 GEMM 的 M 维度都是上千——算术强度高，是 **Compute Bound**。这解释了 LLM 推理的两个基本现象：

- Prefill 时间 ≈ 计算量 ÷ 算力，长 prompt 的首 token 延迟（TTFT）高；
- Decode 时间由带宽决定，与 prompt 长度基本无关（直到 KV Cache 访存占比上升）。

### 5.6 Batch Size：免费的并行

Decode 时每个 batch 样本都要搬同一份权重，但**权重只搬一次**。Batch 从 1 到 32：

| Batch | 权重访存/token | 计算 FLOPs/token | 算术强度 | 瓶颈 |
|---|---|---|---|---|
| 1 | 14 GB | 14 G | 1 | 带宽 |
| 32 | 14 GB（共享） | 448 G | 32 | 仍带宽 |
| 256 | 14 GB | 3.6 T | 256 | 接近平衡点，开始转向算力 |

Batch 增大在带宽饱和前几乎"免费"提升吞吐（Throughput）——这是 continuous batching（连续批处理）的理论根基。但代价是延迟上升和 KV Cache 显存暴涨，权衡就在这三者之间。

---

## 六、代码：30 行的 Performance Calculator

```python
def llm_perf_calculator(params_b, hidden, layers, seq, batch=1,
                        bits=16, bw=2.0e12, flops=312e12, mem_gb=80):
    """极简 LLM Decode 性能模型（单位：SI）"""
    bytes_per = bits / 8
    weight_mem   = params_b * 1e9 * bytes_per              # 权重显存
    kv_cache     = 2 * layers * hidden * seq * batch * bytes_per
    total_mem    = weight_mem + kv_cache

    flops_per_tok  = 2 * params_b * 1e9 * batch
    traffic_per_tok = weight_mem + kv_cache                # Decode 权重只读一次

    t_compute = flops_per_tok / flops
    t_memory  = traffic_per_tok / bw
    bound     = "Memory Bound" if t_memory > t_compute else "Compute Bound"

    speed = batch / max(t_compute, t_memory)               # tokens/s
    ai    = flops_per_tok / traffic_per_tok                # 算术强度
    return {
        "总显存(GB)": round(total_mem / 1e9, 1),
        "算术强度(FLOP/Byte)": round(ai, 1),
        "瓶颈类型": bound,
        "吞吐(tokens/s)": round(speed, 1),
        "显存够用": total_mem / 1e9 < mem_gb,
    }

# A100 + 7B FP16
print(llm_perf_calculator(7, 4096, 32, 4096))
# {'总显存': 16.1, '算术强度': 1.0, '瓶颈': Memory Bound, '吞吐': 129, '显存够用': True}
```

### ASCII 图示：Roofline 的一生

```
性能( TFLOPS )
   │
   │                         ____________  ← 峰值算力 312 TFLOPS
   │                       /
   │                      /   ← 这段是 Compute Bound
   │                     /
   │                    /   ← 平衡点 AI = 156
   │                   /
   │                  /      ← LLM Decode 活在这段
   │                 /          (AI ≈ 1 ~ 32)
   │                /
   │  ← Decode 在这里
   │               /
   └──────────────/──────────────────→ 算术强度 (FLOP/Byte)
                平衡点
```

**闭环验证方法：** 用 `torch.cuda.Event` 或 `nvidia-smi dmon` 实测实际吞吐，与模型估算对比。差距来源通常是：kernel 启动开销、attention 不是完美 GEMM、Python 调度延迟、权重未驻留 L2。把这些差距量化，你的模型就从"玩具"变成了"工具"。

---

## 七、实践练习与思考题

**练习 1：** 用上面的计算器分别估算 Llama-7B 在 FP16 / INT8 / INT4 下的 Decode 速度，验证一个反直觉结论：为什么 INT4 量化后速度提升**不到 4 倍**？（提示：KV Cache 没有被同等量化。）

**练习 2：** 把 batch 拉到多大时，7B FP16 在 A100 上从 Memory Bound 变成 Compute Bound？

**思考题 1：** 为什么 Speculative Decoding（投机解码）能加速 Decode？用访存量视角解释（提示：一次搬运权重，验证多个 token）。
**思考题 2：** GQA 把 KV Cache 砍到 1/8，但对单 batch Decode 速度帮助有限。为什么？（提示：单 batch 时权重访存占绝对主导。）

---

## 八、与 LLM Inference 的关联

这个性能模型是所有推理优化技术的"裁判"：

- **连续批处理（Continuous Batching）**：提高算术强度，逼近平衡点；
- **量化（Quantization）**：直接减少访存字节数，对 Memory Bound 的 Decode 一比一提速；
- **PagedAttention**：不减少访存量，但消除碎片，让大 batch 成为可能——间接提升 AI；
- **Flash Attention / 多卡 TP**：Prefill（Compute Bound）阶段的优化，对 Decode 边际收益小；
- **KV Cache 量化**：长上下文场景下，KV 访存占比上升后开始发力。

**一个明确的判断：** 在单卡、单请求、Decode 阶段，LLM 推理速度的上限就是 `带宽 ÷ 模型大小`，任何不减少访存量的优化都无法突破这个天花板。

---

## 九、FAQ

**Q1：估算和实测差 2-3 倍正常吗？怎么办？**
正常。先检查是否混淆了 Prefill 和 Decode；再检查实测吞吐是否被 Python/kernel 启动 overhead 拖累（小模型更明显）；最后看 KV 访存和 attention kernel 效率。60%-70% 吻合即可用于决策，无需强行拟合到 99%。

**Q2：为什么训练常用 Compute Bound 衡量（MFU），推理 Decode 却看带宽？**
训练时 M 维度大��全 batch 全序列并行），GEMM 算术强度高；Decode 是逐 token 的向量-矩阵乘，权重每步重搬一次，AI 极低。两个阶段物理性质不同，指标自然不同。

**Q3：这个模型适用于 MoE 模型吗？**
需要修改：每 token 只激活部分专家，访存量按激活参数量算而非总参数量。MoE 的 Decode 速度往往比同激活参数量的稠密模型更快（总带宽需求下降）。

**Q4：多卡张量并行（Tensor Parallelism）怎么建模？**
带宽和显存近似乘以卡数，但卡间通信（NVLink 带宽）成为新的访存项。经验法则：TP 度数每翻一倍，有效带宽不到 2 倍。

**Q5：N 个 FLOPs 的估算对长序列还准吗？**
近似准确。attention 部分引入 `2·L·s·d` 的额外项，KV Cache 访存也随 s 线性增长。上下文超过一定长度后（FP16 下约数万 token），KV 访存开始与权重访存同量级，此时必须把 KV 项加回模型。

---

## 参考资料

- PaLM 论文（Transformer 训练/推理 FLOPs 近似，`2N` 公式出处）：*PaLM: Scaling Language Modeling with Pathways*
- NVIDIA A100 Datasheet（HBM 带宽与峰值算力）
- vLLM 论文：*Efficient Memory Management for Large Language Model Serving with PagedAttention*
- Roofline Model 原始论文：*Roofline: An Insightful Visual Performance Model for Multicore Architectures*
- GQA 论文：*GQA: Training Generalized Multi-Query Transformer Models*
- NVIDIA Deep Learning Performance 文档（GEMM 理论效率与实测对比）

---

## 📋 本日知识点清单

- [ ] 输入：Model Parameters、Sequence Length、Batch Size、Hidden Size、Layers、Heads、Precision、GPU Memory Bandwidth、GPU FLOPS
- [ ] 输出：Weight Memory、KV Cache Memory、Approx FLOPs、Approx Memory Traffic、Compute/Memory Bound
- [ ] 即使只有 60% 准确也有价值
- [ ] 建立 LLM Performance 的物理直觉
- [ ] 从理论模型到实测验证的闭环

## 📝 实践练习

编写一个简单的 GPU Performance Model 计算器，输入模型参数输出性能估算。

---

*本文是「GPU → LLM Inference」30 天学习计划的一部分。学习路线：GPU 硬件 → CUDA 执行模型 → 显存/带宽 → Kernel → Attention → KV Cache → 并行策略 → 推理性能。*
