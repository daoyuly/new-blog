---
title: "GPU 学习日报 Day 8：FLOPS：GPU 算力的度量与 Transformer 计算量"
date: 2026-09-27 10:00:00
tags:
  - FLOPS
  - 算力
  - Transformer
  - 计算量
categories:
  - GPU → LLM Inference 学习计划
  - Week 2 GPU 性能模型
description: "Day 8/30 | FLOPS 与计算量估算 | FLOPS：GPU 算力的度量与 Transformer 计算量。30 天从 GPU 硬件到 LLM 推理性能的深度学习计划。"
keywords: "GPU, CUDA, LLM, Inference, FLOPS 与计算量估算, FLOPS, 算力, Transformer, 计算量"
author: OpenClaw GPU Learning
---

# GPU 学习日报 Day 8：FLOPS：GPU 算力的度量与 Transformer 计算量

> **30 天学习计划** | Week 2 - GPU 性能模型 | Day 8/30
> 
> **今日主题**: FLOPS 与计算量估算

---

# FLOPS：GPU 算力的度量与 Transformer 计算量

**核心结论（先读这段就够了）**：FLOP（Floating Point Operation，浮点运算次数）衡量“干了多少活”，FLOPS（Floating Point Operations Per Second，每秒浮点运算次数）衡量“干活速度”。一个 Transformer 模型做一次前向传播，计算量约为 **2 × 参数量 FLOPs**（每个权重参与一次乘加），因此 7B 模型推理一次约需 14 GFLOPs per token。GPU 标称算力（如 A100 的 312 TFLOPS）是“理论天花板”，实际可达 30%–60%，差距来自内存带宽、算子效率与并行度。掌握这两个数字，你就能心算出“一张卡一秒能生成多少 token”——这是所有 LLM 推理性能估算的起点。

---

## 一、背景与动机：为什么 LLM 工程师必须会算 FLOPs

做 LLM 推理优化，你会不断面对这样的问题：

- 这张 H100 跑 70B 模型，理论上限每秒能出多少 token？
- 我把 batch size 从 1 提到 32，为什么吞吐量涨了 20 倍而不是 32 倍？
- Flash Attention 到底省了多少计算量？

这些问题没有一个能用“感觉”回答，全部归结为一个因果链：

> **模型计算量（FLOPs）→ 硬件算力（FLOPS）→ 理论时间 → 除以效率系数 → 实际时间**

如果你不会估算 FLOPs，你就无法判断一个优化是真优化（减少计算/访存）还是伪优化（改了代码但瓶颈没动）。今天这一课，就是把这条链的第一环补上。

---

## 二、核心概念：FLOP 与 FLOPS

### 2.1 定义与单位

| 概念 | 英文 | 含义 | 类比 |
|---|---|---|---|
| FLOP | Floating Point Operation | 一次浮点运算（加或乘算 1 次） | 搬了多少块砖 |
| FLOPS | Floating Point Operations per Second | 每秒浮点运算次数 | 每秒搬多少块砖 |
| TFLOPS | Tera-FLOPS | 10¹² FLOPS | — |
| PFLOPS | Peta-FLOPS | 10¹⁵ FLOPS | — |

**注意一个易错点**：FLOP 是“量”（复数形式 FLOPs），FLOPS 是“速率”。写“这个模型需要 14 GFLOPS”是错的，应为“14 GFLOPs”；说“GPU 有 312 TFLOPS 算力”是对的。中文语境常混用，但技术文档中必须区分——因为两者相除才有意义：**时间 = 计算量 ÷ 算力**。

### 2.2 精度与算力的关系

GPU 的标称算力依赖数值精度，这是很多估算出错的根源：

| GPU | FP32 | TF32/FP16 (Tensor Core) | INT8 |
|---|---|---|---|
| A100 | 19.5 TFLOPS | 312 TFLOPS | 624 TOPS |
| H100 (SXM) | 67 TFLOPS | 989 TFLOPS (FP16) | ~2000 TOPS |

FP16 Tensor Core 算力是 FP32 的 **16 倍**。LLM 推理几乎全部运行在 FP16/BF16（甚至 FP8/INT8）上，所以估算时必须用对应精度的数字，不能用 FP32 标称值。

---

## 三、矩阵乘法：为什么是 2MKN

### 3.1 推导因果链

GPU 上 90% 以上的计算都归结为矩阵乘法（GEMM，General Matrix Multiply）。理解它的 FLOPs，就理解了一切。

计算 **A[M,K] × B[K,N]**：结果矩阵 C 有 M×N 个元素，每个元素需要 K 次乘法和 K 次加法：

```
C[i][j] = Σ A[i][k] × B[k][j]   (k = 0..K-1)
```

每个元素 = 2K 个 FLOPs（乘 K 次 + 加 K 次），总计算量：

**FLOPs = 2 × M × N × K**

那个"2"不是近似，是精确的乘加计数。

### 3.2 建立“计算密度”直觉

| 矩阵规模 | FLOPs |
|---|---|
| 100×100 × 100×100 | 2 × 10⁶ = 2 MFLOPs |
| 4096×4096 × 4096×4096 | ~137 GFLOPs |

另一个关键视角：计算量增长是 **O(MKN) 三次方级**，而数据量（读入 A 和 B）只有 O(MK + KN) 二次方级。矩阵越大，“每字节数据对应的计算”越多——这正是 GPU（而非 CPU）擅长矩阵乘法的物理原因：计算可以摊薄访存开销。这个性质后面判断“计算受限 vs 访存受限”时会反复用到。

---

## 四、Transformer Layer 计算量分解

### 4.1 模型设定

以 decoder-only Transformer（GPT 类）为例，设：

- hidden size = d
- 序列长度 = s，batch size = b
- 每层包含：QKV Projection、Attention、Output Projection、MLP

### 4.2 逐项分解（每层每 token）

**① QKV Projection + Output Projection**（4 个 [d, d] 矩阵乘法）

每个 token 的输入向量 [1, d] 乘以权重 [d, d]，FLOPs = 2·d·d。四个投影共 **4d² FLOPs / layer / token**。

**② Attention 计算**（Q·K^T 和 softmax(QK)·V）

- QK^T：每个 (i,j) 位置对做一次 d 维点积 → 2·s²·d
- ×V：→ 2·s²·d

共 **4·s·d FLOPs / layer / token**（注意这里除以了 s，因为是全序列摊分；单 token 视角下，因果注意力平均每个新 token 要和所有历史 token 交互）。

**③ MLP**（两层全连接，通常 d → 4d → d）

FLOPs = 2·d·4d + 2·4d·d = **16d² / layer / token**

### 4.3 汇总

```
每层每 token = 4d² (投影) + 4sd (attention) + 16d² (MLP) = 20d² + 4sd
```

**关键观察**：当 s ≪ 5d 时（绝大多数推理场景，比如 d=4096、s<10000），attention 部分占比很小，**计算量由权重矩阵主导**。由此得出推理领域最重要的经验公式：

> **每个 token 的前向计算量 ≈ 2 × 参数量 FLOPs**

因为参数量主要就是这些权重矩阵的元素个数，而每个权重在每次前向中恰好参与一次乘加（2 FLOPs）。

### 4.4 ASCII 图示

```
Transformer Layer (decoder-only)
┌─────────────────────────────────────────┐
│  QKV Projection   [d,d]×3   → 6d²  ←┐   │
│  Attention        QK^T, ×V   → 4sd   │   │
│  Output Proj      [d,d]       → 2d²  │   │
│                                    │ 20d² (权重主导)
│  MLP: d→4d→d               → 16d² ┘   │
│                                         │
│  ← s 增大时，4sd 这块才显著增长 →        │
└─────────────────────────────────────────┘
```

---

## 五、估算整个模型的 FLOPs：以 7B 为例

### 5.1 快速公式

**总 FLOPs（decode 单 token）≈ 2N**，N 为参数量。

7B 模型：2 × 7 × 10⁹ = **14 GFLOPs / token**。

如果算上 KV Cache 读取时的 attention 项（长序列下不可忽略），再加上 ~4·L·s·d FLOPs，但入门估算用 2N 足够。

**Prefill（处理 prompt）阶段**：所有 token 并行计算，约为 2Ns FLOPs。输入 1024 token 的 prompt：14 GFLOPs × 1024 ≈ 14.4 TFLOPs。

### 5.2 实践：7B 模型 vs A100

```
模型:   Llama-2-7B,  N = 7e9
精度:   FP16,  A100 标称算力 = 312 TFLOPS
任务:   decode 单个 token

理论时间 = 14e9 FLOPs ÷ 312e12 FLOPS
        ≈ 45 微秒
理论速度 ≈ 22,000 token/s   ← 标称算力下的幻想值

实际速度 ≈ 50~100 token/s   ← 相差 200 倍以上！
```

**为什么差 200 倍？** 这是下一节的正题，也是理解 LLM 推理的钥匙。

### 5.3 实际可达性能（MFU）

实际 FLOPS ÷ 标称 FLOPS = **MFU（Model FLOPs Utilization，模型算力利用率）**。

| 场景 | 典型 MFU |
|---|---|
| 大 batch 训练（优化良好） | 40%–60% |
| 大 batch 推理（prefill） | 50%–70% |
| 小 batch decode（batch=1~8） | **1%–5%** |

decode 阶段 MFU 低到令人发指，原因是一个物理事实：

**Decode 阶段是访存受限（Memory-Bound），不是计算受限（Compute-Bound）。**

- 每 token 计算量：14 GFLOPs（2N）
- 每权重都要从显存读一次：14 GB（FP16）
- A100 计算能力 312 TFLOPS，显存带宽 2 TB/s

计算 14 GFLOPs 只需 45 μs，但读 14 GB 需要 **7 ms**——内存比算力慢 150 倍。GPU 的计算单元大部分时间在“等数据”，这就是 MFU 只有百分之几的原因。由此推出 decode 速度的真正公式：

> **Decode token/s ≈ 显存带宽 ÷ 模型大小（GB）**

A100 上 7B FP16：2000 GB/s ÷ 14 GB ≈ **143 token/s**，与实测同量级。这个公式比 FLOPS 公式重要得多——它解释了为什么量化、KV Cache、多卡流水线、batch 并发能提速，而“换更强算力的卡”（如 H100 vs A100 的 FP32 提升）对单流 decode 帮助有限。

```
        Compute-Bound                  Memory-Bound
   ┌──────────────────┐          ┌──────────────────┐
   │ 算力 ████████░░  │          │ 算力 █░░░░░░░░░  │
   │ 带宽 █░░░░░░░░░  │          │ 带宽 ████████░░  │
   └──────────────────┘          └──────────────────┘
     训练/大batch prefill            小batch decode
     优化方向: 提高MFU              优化方向: 量化/减少读量
```

---

## 六、实践练习与思考题

**练习 1**：手算 Llama-2-7B（d=4096, 层数 L=32, 词表 32000）的参数量。

提示：参数 ≈ L × (12d²) + embedding（12d² = 4d²[attention 投影] + 8d²[MLP]）。
答案：32 × 12 × 4096² ≈ 6.4B + embedding ≈ 0.26B ≈ 6.7B ✓（与官方 7B 吻合）

**练习 2**：A100（312 TFLOPS FP16）跑 prefill，输入 4096 token 的 prompt，理论最少耗时多少？（答案：2 × 7e9 × 4096 ÷ 312e12 ≈ 184 μs，实际约 1–2 ms，对应 MFU ~15%）

**思考题**：
1. 为什么 batch size 增大时 decode 的 MFU 会上升？（提示：权重只读一次，算多个 token）
2. INT8 量化后，decode 速度大约提升多少？瓶颈变了吗？
3. GQA（Grouped-Query Attention）减少的是计算量还是访存量？

---

## 七、与 LLM Inference 的关联

今天的内容是后面所有性能课程的度量衡：

1. **性能分析的地基**：所有优化（Flash Attention、PagedAttention、连续批处理、量化）的效果，最终都要用“计算量省了多少 / 带宽省了多少”来解释。
2. **判断瓶颈的第一步**：先用 2N 公式算计算时间，再用 带宽÷模型大小 算访存时间，谁大谁是瓶颈。这是 Roofline Model 的雏形（第 9–10 天将正式展开）。
3. **成本估算**：云厂商按 GPU 小时计费，知道“每 token 消耗多少 FLOPs + 实际 MFU”，就能算出每百万 token 的理论成本下限——这是商用推理服务的定价逻辑。

**一句话总结因果链**：参数量 → 计算量（2N FLOPs/token）→ 但 decode 受限于显存带宽而非算力 → 所以推理优化的主战场是“少搬数据”，而不是“少算”（至少在批处理饱和之前是这样）。

---

## FAQ

**Q1：FLOP 和 FLOPS 到底怎么区分？**
A：FLOP 是运算次数（工作量，单位无“每秒”），FLOPS 是每秒运算次数（速率）。记忆法：带 S 是 Speed。时间 = FLOPs ÷ FLOPS。

**Q2：为什么矩阵乘法是 2MKN 而不是 MKN？**
A：C 中每个元素需要 K 次乘 + K 次加 = 2K FLOPs，共 M×N 个元素，所以是 2MKN。“2”是乘加的精确计数，不是保险系数。

**Q3：为什么“2 × 参数量”就能估算模型计算量？**
A：因为每个权重参数在每次前向传播中恰好参与一次乘加运算（乘一次、加一次 = 2 FLOPs）。attention 的 4sd 项在常规序列长度下占比小，可忽略。Prefill 时为 2Ns，decode 单 token 时为 2N。

**Q4：GPU 标称 312 TFLOPS，实际只用 2%，是不是 GPU 不行？**
A：不是。decode 阶段瓶颈在显存带宽（读 14 GB 模型要 7ms，算 14 GFLOPs 只要 45μs），算力闲置是物理必然。提升 MFU 的正确方式是增大 batch（一次读权重算多个 token）、量化（减少读量）、算子融合。

**Q5：估算推理速度时应该用哪个公式？**
A：decode 用 **token/s ≈ 显存带宽 ÷ 模型权重大小（GB）**；prefill 用 **token/s ≈ 算力 × MFU ÷ (2N)**。先算两个再取小的，对应瓶颈。

---

## 参考资料

1. NVIDIA A100 Datasheet & H100 Datasheet — 标称算力与显存带宽（nvidia.com）
2. PaLM: Scaling Language Modeling with Pathways（Chowdhery et al., 2022）— 附录给出 Transformer FLOPs 详细推导，训练计算量 ≈ 6N·D
3. Transformer Inference Arithmetic（kipp.ly 博客）— 2N 公式与 KV Cache 估算的经典推导
4. NVIDIA Deep Learning Performance Guide — 各精度的 GEMM 达成效率基准
5. Roofline Model（Williams et al., 2009）— 计算受限与访存受限的判定框架

> 明日预告：算力只是一半，下一课讲显存带宽（Memory Bandwidth）与 Roofline Model——你会看到今天的“200 倍差距”如何用一张图彻底解释清楚。

---

## 📋 本日知识点清单

- [ ] FLOP、FLOPS、TFLOPS、PFLOPS 的定义
- [ ] 矩阵乘法 A[M,K] × B[K,N] ≈ 2MKN FLOPs
- [ ] Transformer Layer 的计算量分解：QKV Projection、Attention、MLP
- [ ] 如何估算一个 Transformer 模型的总 FLOPs
- [ ] GPU 标称 TFLOPS 与实际可达性能的差距

## 📝 实践练习

计算 7B 模型一次前向传播的总 FLOPs，对比 GPU 标称算力。

---

*本文是「GPU → LLM Inference」30 天学习计划的一部分。学习路线：GPU 硬件 → CUDA 执行模型 → 显存/带宽 → Kernel → Attention → KV Cache → 并行策略 → 推理性能。*
