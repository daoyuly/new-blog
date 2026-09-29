---
title: "GPU 学习日报 Day 10：Roofline Model：算力与带宽的统一分析框架"
date: 2026-09-29 10:00:00
tags:
  - Roofline
  - Arithmetic Intensity
  - 性能分析
  - GPU
categories:
  - GPU → LLM Inference 学习计划
  - Week 2 GPU 性能模型
description: "Day 10/30 | Roofline Model | Roofline Model：算力与带宽的统一分析框架。30 天从 GPU 硬件到 LLM 推理性能的深度学习计划。"
keywords: "GPU, CUDA, LLM, Inference, Roofline Model, Roofline, Arithmetic Intensity, 性能分析, GPU"
author: OpenClaw GPU Learning
---

# GPU 学习日报 Day 10：Roofline Model：算力与带宽的统一分析框架

> **30 天学习计划** | Week 2 - GPU 性能模型 | Day 10/30
> 
> **今日主题**: Roofline Model

---

# Roofline Model：算力与带宽的统一分析框架

## 开篇结论

**Roofline Model（屋顶线模型）用一个二维坐标图回答了一个根本问题：一个 Kernel 的性能上限到底是被算力（Compute）卡住，还是被带宽（Memory Bandwidth）卡住？** 答案由一个指标决定——**算术强度（Arithmetic Intensity, AI = FLOPs / Bytes）**。AI 低于硬件“拐点”（ Ridge Point，ridge point ），Kernel 是 **Memory Bound（访存受限）**，再大的算力也用不上；AI 高于拐点才是 **Compute Bound（算力受限）**，此时带宽不是瓶颈。对 LLM 推理而言，绝大多数阶段的 AI 都很低，是典型的 Memory Bound 问题——这就是为什么量化、KV Cache 管理、算子融合比“堆 FLOPS”更有效。理解 Roofline，你就掌握了推理优化的第一性原理。

---

## 一、背景与动机：为什么需要一个“统一分析框架”

假设你在 A100 上跑一个 LLM 推理，发现 GPU 利用率只有 40%。你能问的问题是无穷多的：是 kernel 写得差？是 batch 太小？是硬件不行？还是模型结构天生就慢？

**没有分析框架，优化就是盲人摸象。** 你可能花一周手写 Tensor Core 的 GEMM，结果发现瓶颈根本不在计算，而在读取权重的那条内存总线上——优化错了方向，努力归零。

Roofline Model 由 Berkeley 的 Samuel Williams 等人在 2009 年提出，它把一个复杂系统压缩成两个坐标轴：

- **横轴**：算术强度（Arithmetic Intensity），单位 FLOP/Byte——每从内存读 1 字节数据，能做多少次浮点运算；
- **纵轴**：可达性能（Attainable Performance），单位 FLOPS。

一句���概括它的物理直觉：**你的程序速度，取决于“搬运数据的时间”和“做计算的时间”中更长的那个。** 这和流水线的原理一模一样——装配线和送料带，谁慢谁说了算。

---

## 二、核心内容

### 2.1 Roofline Model 的核心思想

Roofline 的建模对象是一个二维约束系统。任何 Kernel 的可达性能由两个天花板（ceiling）中较低者决定：

1. **计算天花板**：硬件峰值算力，如 A100 FP16 Tensor Core 的 312 TFLOPS；
2. **带宽天花板**：峰值算力乘以算术强度，即 `性能 ≤ 带宽 × AI`。

用公式表达：

```
Attainable FLOPS = min( Peak FLOPS,  Peak Bandwidth × Arithmetic Intensity )
```

画出来就是经典“屋顶”形状：左边一段**斜线**（性能随 AI 线性增长，斜率 = 带宽），右边一段**平线**（性能封顶在峰值算力）。

```
性能 (FLOPS)
   │
312T ┤· · · · · · · · · · ┌────────────── Compute Ceiling
   │                     ╱
   │                   ╱    斜线斜率 = 带宽
   │                 ╱      (A100: 2039 GB/s)
   │               ╱
   │             ╱ ← 拐点 Ridge Point
   │           ╱      AI ≈ 153 FLOP/Byte
   └─────────┴──────────────────────────────→
            AI = 153        算术强度 (FLOP/Byte)
```

**物理直觉**：斜线区域，程序花在“等数据”上的时间占主导，算力大量闲置；平线区域，数据早就备好了，计算单元满负荷运转。屋顶线的形状由硬件决定，**你的 Kernel 落在屋顶下面多远，由软件决定**。

### 2.2 Arithmetic Intensity = FLOPs / Bytes

**算术强度（Arithmetic Intensity, AI）** 是整个模型的灵魂，定义极其简单：

```
AI = 总浮点运算次数 (FLOPs) / 总访存字节数 (Bytes)
```

关键在于：**分母的 Bytes 必须算清“真正发生了什么”**。一个理想 Kernel 的访存量包括：

- 读输入（权重、激活值）
- 写输出
- （不好的实现中）中间结果的反复读写——这正是优化空间所在

我们算两个例子，感受量级差异：

**例 1：GEMM（矩阵乘）**，规模 4096×4096，FP16：

- FLOPs = 2 × 4096³ ≈ 137 GFLOP
- 访存 = 3 × (4096 × 4096 × 2 B) = 100 MB（读 A、读 B、写 C，理想情况，数据可被缓存复用）
- AI = 137G / 100M ≈ **1375 FLOP/Byte** → 远超 A100 拐点，**Compute Bound**

**例 2：LLM Decode 阶段的 GEMV（矩阵-向量乘）**，batch=1：

- FLOPs = 2 × 4096 × 4096 ≈ 33.5 MFLOP（每层）
- 访存 = 读整个权重矩阵 ≈ 33.5 MB（FP16）
- AI ≈ 2 FLOP/Byte → 远低于拐点，**Memory Bound**

**核心洞察**：GEMM 和 GEMV 在数学上是亲戚（后者是前者的特例），但性能特征天差地别。原因是 GEMM 中每个权重被复用了很多次（提高了 AI），而 batch=1 的 Decode 中每个权重只用一次就扔——**复用率决定了 AI，AI 决定了天花板**。

### 2.3 Compute Ceiling 与 Memory Bandwidth 的交点

两条天花板的交点称为 **Ridge Point（脊点）**，也叫**机器平衡点（Machine Balance Point）**：

```
Ridge Point AI = Peak FLOPS / Peak Bandwidth
```

A100 的具体数值：

| 硬件 | 峰值算力 (FP16 TC) | HBM 带宽 | 拐点 AI |
|---|---|---|---|
| A100 | 312 TFLOPS | 2039 GB/s | ≈ 153 FLOP/Byte |
| H100 (SXM) | 990 TFLOPS | 3350 GB/s | ≈ 296 FLOP/Byte |
| RTX 4090 | 165 TFLOPS | 1008 GB/s | ≈ 164 FLOP/Byte |

注意 H100 的拐点比 A100 几乎翻倍——**新一代 GPU 算力增长快于带宽增长，拐点持续右移**。这意味着：

1. 以前勉强 Compute Bound 的算子，在新硬件上可能变成 Memory Bound；
2. LLM 推理（AI 普遍在 1~100 区间）离拐点越来越远，带宽瓶颈愈发严重。

**判断规则一目了然**：

| 判断 | 条件 | 优化方向 |
|---|---|---|
| Memory Bound | Kernel AI < 拐点 | 减少访存：量化、融合、增大 batch、缓存复用 |
| Compute Bound | Kernel AI > 拐点 | 提高计算效率：Tensor Core、更好的 tiling、减少空泡 |

### 2.4 如何判断一个 Kernel 是 Compute Bound 还是 Memory Bound

实践中分三步：

**第一步：理论分析（纸上算 AI）。** 数 FLOPs、数 Bytes，算出理论 AI。这是设计的起点，例：

```
# decode 阶段一层 FFN 的 AI 估算 (batch=1, hidden=4096, FP16)
FLOPs = 2 * 4096 * 11008 * 2  # up/down 两个 GEMV
Bytes = (4096*11008*2 + 4096*11008*2) * 2  # 读两个权重矩阵
AI ≈ 2 FLOP/Byte   → 远低于 153，Memory Bound，板上钉钉
```

**第二步：实测对照（NVIDIA Nsight Compute）。** 用 profiler 看关键指标：

- `SM Throughput`（计算单元利用率）vs `DRAM Throughput`（带宽利用率）——谁接近 100%，谁就是瓶颈；
- `Memory Workload Analysis` 看 AI 的实测值（实测通常低于理论，因为真实访存 > 最小访存）。

**第三步：对照 Roofline 图定位。** Nsight Compute 可以直接画出实测 Kernel 在 Roofline 图上的位置。理论 AI 是“屋顶下方的天花板”，实际点与屋顶的距离就是你的优化空间（roofline 模型只告诉你上限，不保证你能到达）。

一个常见的坑：**实测带宽 utilization 高 ≠ 理论上就该 Memory Bound**。可能是你的 kernel 写得烂（多余的 global memory 访问）把一个理论 Compute Bound 的算子拖成了实际 Memory Bound——这恰恰说明优化的收益空间大。

### 2.5 Roofline 在 LLM 四大场景中的应用

**① Attention（尤其 Prefill 长序列）**

Prefill 阶段的 Batched GEMM（QK^T、PV）AI 较高（序列长、复用多），接近 Compute Bound，用 FlashAttention 的 tiling + 在线 softmax 减少 HBM 读写（AI 从 O(N²) 访存降到 O(N) 访存级别）后能逼近屋顶。而 **Decode 阶段的 Attention 是典型 Memory Bound**：query 只有一行，AI ≈ 1~2，读整个 KV Cache 的时间就是全部时间。

**② KV Cache（KV Cache）**

Decode 时每生成一个 token，都要把完整 KV Cache 从 HBM 读一遍。序列越长、batch 越大，KV Cache 越大，带宽被吃光。**这就是为什么 KV Cache 量化（KV Cache Quantization，如 FP8/INT8 KV）是纯赚的优化**——它直接砍掉分母 Bytes，AI 翻倍，性能近似翻倍，且几乎不损精度。

**③ Quantization（量化）**

Weight-only 量化（INT4/INT8 权重）是 Decode 优化的教科书案例：

```
AI_decode = 2 FLOP/Byte  (FP16 权重)
AI_INT4   = 8 FLOP/Byte  (权重体积 /4，FLOPs 不变)
```

性能提升接近 4 倍（带宽减 4 倍），因为在 Memory Bound 区域，**性能 ∝ 带宽 × AI**，砍 Bytes 是最直接的杠杆。反过来，Prefill 阶段是 Compute Bound，weight-only 量化收益很小——这也解释了为什么 Prefill 有时用 W8A8（连激活也量化，提升 Tensor Core 吞吐）而 Decode 用 weight-only。

**④ MoE（Mixture of Experts）**

MoE 的 Decode 性能困境是 Roofline 的完美案例：每个 token 只激活少数专家，对每个被激活的专家矩阵做一次 batch=1 甚至更小的 GEMV，AI 极低（≈2）；而专家权重总量巨大，远远装不进缓存。**专家越多，读权重浪费的带宽越多**。因此 MoE 推理优化（专家权重量化、专家并行提高单专家 batch、投机解码摊薄权重读取成本）本质上全是在给 Memory Bound 挣扎的系统减压。

---

## 三、代码/图示：亲手画 A100 的 Roofline 并标注算子位置

```python
import numpy as np
import matplotlib.pyplot as plt

PEAK_FLOPS = 312e12      # A100 FP16 Tensor Core
PEAK_BW    = 2039e9      # A100 HBM2e
ridge_ai   = PEAK_FLOPS / PEAK_BW  # ≈ 153 FLOP/Byte

ai = np.logspace(-1, 4, 200)
perf = np.minimum(PEAK_FLOPS, PEAK_BW * ai)

ops = {
    "GEMV (decode, b=1)":   2,
    "Attention decode":     3,
    "MoE expert GEMV":      2,
    "GEMM (prefill, large)": 800,
    "FlashAttention prefill": 400,
}

plt.loglog(ai, perf / 1e12, label="A100 Roofline")
plt.axvline(ridge_ai, ls="--", c="gray", label=f"Ridge AI={ridge_ai:.0f}")
for name, a in ops.items():
    y = min(PEAK_FLOPS, PEAK_BW * a) / 1e12
    plt.scatter(a, y)
    plt.annotate(name, (a, y), fontsize=8)
plt.xlabel("Arithmetic Intensity (FLOP/Byte)")
plt.ylabel("Attainable TFLOPS")
plt.legend(); plt.grid(True, which="both", alpha=0.3)
plt.savefig("roofline_a100.png", dpi=150)
```

生成图的直观读法：所有 Decode 相关算子（GEMV、Attention decode、MoE）都挤在左下角斜线上——**它们无论怎么优化计算都跑不快，除非减少字节**；Prefill 的 GEMM 和 FlashAttention 则在右侧逼近屋顶，计算效率是主战场。

---

## 四、实践练习与思考题

**练习（本日任务）：** 运行上面的代码画出 A100 Roofline，手工计算并在图上标注 GEMM（如 4096×4096×4096，batch=8 prefill）和 Attention（seq=2048 decode）的位置。再用 `nvprof`/Nsight Compute 跑一次真实的这两个 kernel，对比实测位置与理论位置的距离。

**思考题：**

1. 把 Decode batch 从 1 提到 32，GEMV 变成了类 GEMM，AI 如何变化？为什么 batching 是 LLM 服务最有效的优化之一？（提示：权重读取成本被多个请求分摊，分母几乎不变，分子翻倍。）
2. 某个 Kernel 理论 AI = 300（> 153），但实测 DRAM 利用率 85%、SM 利用率 40%。它是 Compute Bound 吗？问题可能出在哪？（提示：理论 AI 忽略了中间结果写回、非合并访存等真实开销。）
3. FP8 KV Cache 把 AI 提升一倍，但对 Prefill 阶段的 Attention 帮助有限，为什么？
4. H100 的拐点比 A100 更靠右，这对“未来 LLM 推理优化的重心”意味着什么？

---

## 五、与 LLM Inference 的关联总结

| LLM 推理阶段/场景 | 算术强度 | Bound 类型 | 对应优化手段 |
|---|---|---|---|
| Prefill (大 batch/长序列) | 高 (>100) | Compute Bound | FlashAttention、W8A8、计算图优化 |
| Decode GEMV (batch=1) | ≈ 2 | Memory Bound | Weight-only 量化、算子融合 |
| Decode Attention | ≈ 1~3 | Memory Bound | KV Cache 量化、GQA/MQA |
| MoE Decode | 极低 | Memory Bound (严重) | 专家量化、投机解码、Expert Parallel |

**一条因果链记住本篇**：LLM Decode 每个权重只用一次 → AI ≈ 2 → 远低于拐点 → Memory Bound → 性能 = 带宽 × AI → 所以减少 Bytes（量化、融合、缓存）和提升复用（batching、投机解码）才是 Decode 优化的正确抓手。Roofline 不是要背的图，而是每次动手优化前 30 秒就能做完的判断：**先算 AI，再决定往哪个方向使劲。**

---

## FAQ

**Q1：算术强度和“带宽利用率”是一回事吗？**
不是。AI 是 Kernel 的属性（FLOPs/Bytes 的比值），带宽利用率是实测的 DRAM 吞吐占峰值的比例。一个低 AI 的烂 Kernel 带宽利用率也可以很高——它高效地搬运了大量本不该搬的数据。AI 高低告诉你天花板在哪，利用率告诉你你离天花板多远。

**Q2：为什么 A100 的拐点是 153 而不是理论 FP32 的值？**
拐点取决于你用哪个精度算 FLOPS。A100 FP32 是 19.5 TFLOPS（拐点 ≈ 9.6），FP16 Tensor Core 是 312 TFLOPS（拐点 ≈ 153）。分析时必须用目标 Kernel 实际能达到的精度天花板，否则结论会差一个数量级。

**Q3：Kernel 落在屋顶下方很远，Roofline 能告诉我为什么吗？**
不能。Roofline 只给出上限，不诊断具体瓶颈。落在屋顶下方的原因可能是 cache 命中差、bank conflict、占用率不足、kernel 启动开销等，需要用 Nsight Compute 的 warp state、memory workload 等细分 section 进一步定位。

**Q4：Decode 是 Memory Bound，那是不是买带宽更大的卡（如 H200/HBM3e）就是最优解？**
带宽升级确实直接有效，但成本高。软件手段（INT4/FP8 量化、batching、投机解码）往往能以更低成本获得同等甚至更大的等效带宽收益。正确顺序是：先用 Roofline 确认 Memory Bound，再权衡“买带宽”与“省带宽”。

**Q5：Prefill 阶段一定 Compute Bound 吗？**
不一定。Prefill 的 GEMM 在 batch/序列足够大时 AI 才高；如果是单请求短 prompt，Prefill 也可能是 Memory Bound。判断永远基于当前具体形状算 AI，而不是给阶段贴死标签。

---

## 参考资料

1. Williams, Waterman, Patterson, *Roofline: An Insightful Visual Performance Model for Multicore Architectures*, CACM 2009（原始论文）
2. NVIDIA Developer Blog: *NVIDIA Ada / Hopper GPU Architecture White Paper*（峰值算力与带宽、机器平衡点数据）
3. NVIDIA Nsight Compute 文档： *GPU Speed of Light Throughput* 与 Roofline Chart 章节（实测方法论）
4. vLLM / TensorRT-LLM 技术博客：PagedAttention 与 LLM serving 的 Memory Bound 分析
5. Lilian Weng, *Large Transformer Model Inference Optimization*（LLM 推理各阶段的 AI 与优化综述）

---

## 📋 本日知识点清单

- [ ] Roofline Model 的核心思想
- [ ] Arithmetic Intensity = FLOPs / Bytes
- [ ] Compute Ceiling 与 Memory Bandwidth 的交点
- [ ] 如何判断一个 Kernel 是 Compute Bound 还是 Memory Bound
- [ ] Roofline 在 Attention、KV Cache、Quantization、MoE 分析中的应用

## 📝 实践练习

画出 A100 的 Roofline Model，标注 GEMM 和 Attention 操作的位置。

---

*本文是「GPU → LLM Inference」30 天学习计划的一部分。学习路线：GPU 硬件 → CUDA 执行模型 → 显存/带宽 → Kernel → Attention → KV Cache → 并行策略 → 推理性能。*
