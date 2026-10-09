---
title: GPU 学习日报 Day 11：Tensor Core：GPU 的矩阵计算引擎
tags:
  - GPU 学习日报
  - Tensor Core
  - MMA
  - 数据类型
  - GPU
categories:
  - GPU → LLM Inference 学习计划
  - Week 2 GPU 性能模型
description: >-
  Day 11/30 | Tensor Core 深入 | Tensor Core：GPU 的矩阵计算引擎。30 天从 GPU 硬件到 LLM
  推理性能的深度学习计划。
keywords: 'GPU, CUDA, LLM, Inference, Tensor Core 深入, Tensor Core, MMA, 数据类型, GPU'
author: OpenClaw GPU Learning
abbrlink: 18595
date: 2026-09-30 10:00:00
---

# GPU 学习日报 Day 11：Tensor Core：GPU 的矩阵计算引擎

> **30 天学习计划** | Week 2 - GPU 性能模型 | Day 11/30
> 
> **今日主题**: Tensor Core 深入

---

# Tensor Core：GPU 的矩阵计算引擎

**核心结论**：Tensor Core（张量核心）是 NVIDIA GPU 中专用于矩阵乘加运算的硬件单元，它与 CUDA Core 的区别不是“更快”，而是“计算范式完全不同”——CUDA Core 一个周期做一次标量乘加，Tensor Core 一个周期做一个完整的矩阵分块乘加（如 4x4 或 8x8 的 MMA）。Tensor Core 的性能优势来自三点：**专用化的阵列式计算单元（牺牲灵活性换密度）**、**更低精度的数据类型（FP16/BF16/FP8 让同样硅片面积塞进更多乘法器）**、**Warp 级编程模型（一条指令驱动整个 Warp，摊薄指令开销）**。理解 Tensor Core，就理解了为什么现代 LLM 推理 90% 的时间花在 GEMM 上，也就理解了量化、混合精度这些优化手段的物理基础。

---

## 一、背景与动机：为什么要专门学 Tensor Core

如果你在 2017 年之前做过 CUDA 编程，你脑中的 GPU 执行模型是：海量线程，每个线程独立做浮点运算，靠 SIMT 掩盖访存延迟。这个模型至今成立，但它只描述了一半的 GPU。

2017 年 NVIDIA 在 Volta 架构（V100）中首次引入 Tensor Core，此后每一代 GPU 的算力增长几乎全部来自 Tensor Core 而非传统 CUDA Core：

| 架构 | 年份 | FP32 算力 | Tensor Core FP16 算力（稠密） |
|---|---|---|---|
| Volta (V100) | 2017 | ~15.7 TFLOPS | ~125 TFLOPS |
| Ampere (A100) | 2020 | ~19.5 TFLOPS | ~312 TFLOPS |
| Hopper (H100) | 2022 | ~67 TFLOPS | ~989 TFLOPS（稠密） |
| Blackwell (B200) | 2024 | ~80 TFLOPS | ~2250 TFLOPS（FP8 更高） |

一个数量级的差距。这意味着：**如果你的 kernel 没有跑在 Tensor Core 上，你只用了 GPU 大约 10% 的理论算力**。对于 LLM 推理——其计算主体就是一层又一层的矩阵乘（GEMM, General Matrix Multiply）——Tensor Core 是决定性的硬件。PyTorch 中 `torch.matmul` 之所以快，cuBLAS/cuDNN 之所以把 90% 的工程精力花在 GEMM 上，都是为了让数据高效地流过 Tensor Core。

不学 Tensor Core，你只能把 GPU 当黑盒调参；学了它，量化选型、batch size 决策、算子优化都有了物理依据。

---

## 二、CUDA Core vs Tensor Core：本质区别

### 2.1 一句话讲清区别

CUDA Core（也叫 FP32 Core 或 Shader Core）是**通用标量流水线**：一个线程一个周期完成一次 `a * b + c`。Tensor Core 是**专用矩阵计算阵列**：一条指令让一组单元同时完成一个小矩阵块的 `D = A × B + C`。

关键洞察：**两者做乘法的“零件”本质是一样的（乘法器 + 加法树），区别在于组织方式**。

- CUDA Core：乘法器分散在各条流水线中，由独立线程驱动，灵活但开销大（每做一次乘法要付出取指、调度、寄存器读取的成本）。
- Tensor Core：把大量乘法器按阵列组织，操作数共享，指令一条管一片，计算密度（FLOPS per mm²）极高。

### 2.2 类比：散装工人 vs 流水线工厂

CUDA Core 像一万名各自为战的工人，每人拿到两个数字算一个乘法；Tensor Core 像一条矩阵乘流水线，一次投喂两组数字块，出来一整块结果。工厂产出高，但只会干这一件事——这就是“专用化换性能”的硬件设计通用规律（Domain-Specific Architecture）。

### 2.3 对比表

| 维度 | CUDA Core | Tensor Core |
|---|---|---|
| 计算粒度 | 标量（一次一个数） | 矩阵块（一次一个 m×n×k 的分块） |
| 编程抽象 | 线程级（每线程独立） | Warp 级（32 线程协作） |
| 支持数据类型 | FP32/FP64/INT32 | FP16/BF16/TF32/FP8/INT8/INT4 |
| 峰值算力占比 | ~10% | ~90% |
| 灵活性 | 任意计算模式 | 仅矩阵乘加（含卷积展开后的矩阵乘） |
| 典型指令 | `FFMA` | `mma`/`wmma`（PTX）、`wgmma`（Hopper+） |
| 出现于 | 所有 GPU | Volta 及之后 |

注意最后一行的隐含结论：**只要你的问题是矩阵乘（或者能变形为矩阵乘，比如卷积的 im2col），就应该用 Tensor Core；反之则无用武之地**。这也是为什么 embedding lookup、采样、复杂的控制逻辑在 LLM 推理里是“CUDA Core 活儿”，而线性层、注意力 QK^T 与 PV 是“Tensor Core 活儿”。

---

## 三、Tensor Core 为什么天生适合 Matrix Multiply

### 3.1 矩阵乘的计算结构

回顾矩阵乘的访存/计算比：

```
C[M×N] = A[M×K] × B[K×N]
计算量： 2 × M × N × K  FLOPs
数据量： M×K + K×N + M×N 个元素
```

当矩阵够大时，计算量是 O(MNK) 的三次方增长，而数据量只有平方级——**计算密集型**，算术强度随问题规模增长。这正是 GPU 最擅长、也最需要专用硬件的场景：只要能把数据喂进来，乘法器阵列就能全速运转。

### 3.2 硬件直觉：乘法器阵列 + 累加树

一个 Tensor Core 内部大致是这样：

```
        A 分块 (行)      B 分块 (列)
            ↓                ↓
        ┌──────────────────────────┐
        │   M×N 个乘法器阵列        │
        │   每个: a[i,k] * b[k,j]   │
        └──────────┬───────────────┘
                   ↓
            K 维方向加法树
                   ↓
            + C 分块 (累加)
                   ↓
              D 分块输出
```

以 Volta 的一代 Tensor Core 为例，一个 SM 内 8 个 Tensor Core，每周期共完成 64 次 FP16 FMA。关键设计：

1. **操作数复用**：一个 A 元素要和 N 个 B 元素相乘。在阵列中，A 沿行广播、B 沿列广播，一次读入服务大量乘法——极大摊薄了寄存器读取和访存开销。CUDA Core 做同样的矩阵乘，每个乘法都要单独取操作数。
2. **高精度累加**：乘法用 FP16，累加（加法树）用 FP32。这是混合精度的硬件体现：乘积的舍入误差用宽累加器兜底，保证长链累加不失精度。
3. **K 维流水**：GEMM 按 K 切片迭代，每轮做一次 MMA、累加一次，数据可以驻留在寄存器/共享内存中被反复利用。

### 3.3 为什么 CUDA Core 做不到这个密度

因为通用性要求每个线程能执行任意指令序列，调度和寄存器堆必须按最坏情况设计。Tensor Core 砍掉了这些灵活性：操作数布局固定、指令固定、数据类型受限，换来的是单位面积数倍甚至数十倍的乘法器密度。**这是所有专用加速器（包括 NPU、TPU）的共同设计哲学**。

---

## 四、MMA 指令：一条指令，一块矩阵

### 4.1 MMA 是什么

MMA（Matrix Multiply-Accumulate，矩阵乘加）是驱动 Tensor Core 的机器指令（在 PTX 层面暴露）。它规定：**一个 Warp 的 32 个线程共同持有一个小矩阵块的碎片，协同执行一次乘加**。

不同代的 MMA 形状（shape）不同：

| 架构 | 典型 MMA 形状 (M×N×K) | 接口层级 |
|---|---|---|
| Volta/Turing | 8×8×4 | `wmma` API |
| Ampere | 16×8×16（`mma.sync`） | PTX `mma` |
| Hopper | 大块 + `wgmma`（Warp Group MMA，跨 4 个 Warp） | 异步、直接吃 Shared Memory |
| Blackwell | `tcgen05`，引入 Tensor Memory | 进一步异步化 |

演进方向清晰：**MMA 越来越“大”、越来越“异步”、离 Shared Memory 越来越近**——目的都是让数据供给跟上计算阵列的吞吐。

### 4.2 一个 MMA 的执行模型

以 Ampere 的 `mma.sync.aligned.m16n8k16` 为例：

```
一个 Warp (32 线程) 持有:
  A: 16×16 FP16  → 每线程 8 个元素（4 个 .f16x2 寄存器）
  B: 16×8  FP16  → 每线程 4 个元素（2 个寄存器）
  C/D: 16×8 FP32 → 每线程 4 个元素（4 个寄存器）

PTX 片段:
  mma.sync.aligned.m16n8k16.row.col.f32.f16.f16.f32
      {d0,d1,d2,d3},   // D 输出 (FP32)
      {a0,a1,a2,a3},   // A 输入
      {b0,b1},          // B 输入
      {c0,c1,c2,c3};   // C 累加输入
```

注意几个要点：

1. **碎片化持有**：矩阵不整体存在于任何地方，而是按固定 layout 分布在 32 个线程的寄存器里。这就是为什么手写 Tensor Core 代码的最大难点是**数据布局**——你必须把数据按 MMA 要求的碎片格式搬进寄存器。
2. **`.sync`**：Warp 内同步执行，32 线程步调一致。
3. **指令级并行**：一条 MMA 通常 8~16 个周期完成，期间 Warp Scheduler 可以发射别的指令填充空隙。

### 4.3 编程层级

实际写代码时你几乎不会碰裸 PTX，层级从高到低：

```
1. cuBLAS / cuBLASLt     ← PyTorch 背后调的库，99% 场景用这个
2. CUTLASS              ← NVIDIA 开源 GEMM 模板库，写自定义算子的首选
3. WMMA API (C++)        ← nvcuda::wmma，简化版 Warp 级接口
4. PTX mma 指令          ← 完全控制，难点在布局管理
```

---

## 五、数据类型：精度即性能

### 5.1 为什么低精度等于高性能

Tensor Core 里最贵的零件是乘法器和加法树。一个 FP16 乘法器所需的晶体管和逻辑深度远小于 FP32（乘法器面积大约随位宽平方增长）。所以：

**位宽减半 ≈ 同样面积塞进约 2 倍乘法器 + 数据搬运带宽减半 + 功耗降低**。三者叠加，低精度在算力表上通常是指数级差异，而非线性。

### 5.2 主流数据类型对比

| 类型 | 位宽 | 格式 | 典型用途 | 关键特征 |
|---|---|---|---|---|
| FP32 | 32 | 1 符号 + 8 指数 + 23 尾数 | 累加器、训练基准 | 高精度，CUDA Core 原生 |
| TF32 | 19 | 1+8+10（存为 FP32 容器） | Ampere+ 训练 | 指数位同 FP32，动态范围大，尾数截断 |
| FP16 | 16 | 1+5+10 | 推理/训练 | 范围小（最大 65504），易溢出 |
| BF16 | 16 | 1+8+7 | LLM 训练/推理主流 | **指数位同 FP32，动态范围大，精度低** |
| FP8 E4M3/E5M2 | 8 | 两种变体 | Hopper+ 前向推理 | E4M3 精度高、E5M2 范围大 |
| INT8 | 8 | 整数 + per-tensor/channel scale | 量化推理（W8A8） | 需要校准 scale |
| INT4 | 4 | 整数 | W4 权重量化（GPTQ/AWQ） | 只量化权重，激活运行时反量化 |

**FP16 vs BF16 的取舍是面试与工程中最常考的点**：两者同为 16 位，FP16 尾数多（精度高）但指数少（范围小）；BF16 直接复用 FP32 的指数位（范围同 FP32），牺牲尾数。LLM 的激活值动态范围大、偶有离群值，BF16 不易溢出，所以 **LLM 训练事实标准是 BF16**。FP16 需要配合 loss scaling 防下溢。

**FP8 的两条路**：E4M3（更多尾数，适合前向传播）和 E5M2（更多指数，适合梯度）。Hopper 的 Transformer Engine 会根据张量统计自动在 FP8 与 BF16 间切换。

### 5.3 为什么数据类型直接决定推理性能

因果链是这样的：

```
权重/激活用低精度存储
  → 显存占用减半/再减半
    → 模型能塞进更小的卡、KV Cache 更小、batch 更大
  → HBM 带宽压力减半（LLM decode 阶段是 memory-bound！）
    → 生成速度（tokens/s）近乎线性提升
  → Tensor Core 算力翻倍/翻四倍
    → prefill 阶段（compute-bound）速度提升
```

LLM decode 阶段算术强度低（batch 小的时候），瓶颈在**带宽**——此时量化的收益主要来自省带宽；prefill 阶段是 compute-bound，收益来自 Tensor Core 算力。理解了这个分界，你才能回答“为什么 W4A16 量化对 decode 提速明显”这类问题。

### 5.4 官方算力对比表（以 H100 SXM 为例，稠密峰值）

| 数据类型 | 算力 (TFLOPS) |
|---|---|
| FP64 | 34 |
| FP64 Tensor Core | 67 |
| FP32 | 67 |
| TF32 Tensor Core | 495 |
| BF16/FP16 Tensor Core | 990 |
| FP8 Tensor Core | 1979 |
| INT8 | 3958 TOPS |

规律一目了然：**每降一级精度，算力翻倍**。这张表是所有推理部署选型的第一手依据。

---

## 六、Tensor Core 的 Warp 级编程模型

### 6.1 为什么是 Warp 级

传统 CUDA 模型：线程是执行单位，每个线程有自己的寄存器、自己的计算。Tensor Core 把执行单位上移到了 **Warp（32 线程的调度单元）**：一个 Warp 的 32 个线程像一个人手上的 32 根手指，共同捧着矩阵碎片，同时按下 MMA 按钮。

这个设计的好处：

1. **摊薄指令开销**：一条指令换 2×M×N×K 次 FLOP，取指/解码/调度成本被摊到极薄。
2. **强制协作布局**：数据布局在编译期就确定，硬件不需要动态寻址。
3. **与 SIMT 天然契合**：Warp 本来就是锁步执行单元，MMA 只是给它换了一副更粗的“手套”。

### 6.2 数据流全景：GEMM kernel 如何喂饱 Tensor Core

一个高性能 GEMM kernel 的数据搬运流水线（以 CUTLASS 为代表）：

```
Global Memory (HBM)
      │  大块 tile，TMA/异步拷贝
      ▼
Shared Memory (SM 内，~228KB on H100)
      │  ldmatrix，按 MMA 碎片布局加载
      ▼
寄存器 (每 Warp 持有 A/B/C 碎片)
      │  mma / wgmma 指令
      ▼
Tensor Core 阵列计算 → 结果累加回寄存器
```

核心原则：**用两级缓存复用掩盖带宽，用异步拷贝掩盖延迟，让 Tensor Core 阵列永远不空转**。Hopper 的 `wgmma` 更进一步：直接从 Shared Memory 读操作数（省掉寄存器搬运），且与访存异步并行——这就是 FlashAttention-2 在 H100 上比 A100 快数倍的原因之一。

### 6.3 一个直觉性的 WMMA 伪代码

```cpp
// 每个 Warp 负责输出矩阵的一个 tile
wmma::fragment<matrix_a, 16,16,16, half, row_major> a_frag;
wmma::fragment<matrix_b, 16,16,16, half, col_major> b_frag;
wmma::fragment<accumulator, 16,16,16, float> c_frag;

wmma::load_matrix_sync(a_frag, A_ptr, lda);   // 碎片化加载
wmma::load_matrix_sync(b_frag, B_ptr, ldb);
wmma::mma_sync(c_frag, a_frag, b_frag, c_frag); // D = A×B + C
wmma::store_matrix_sync(C_ptr, c_frag, ldc, wmma::mem_row_major);
```

看得出，编程负担主要不在“算”，而在“搬运与布局”——这正是 GEMM 优化 90% 的工作量所在。

---

## 七、实践练习与思考题

**练习 1（查表）**：打开 NVIDIA H100 官方 Datasheet，抄下各精度的 Tensor Core 算力，验证“降精度、算��翻倍”规律；再对比消费卡 RTX 4090 的表，找出它与数据中心卡的差异点（提示：FP64、稀疏、显存带宽）。

**练习 2（跑基准）**：用 PyTorch 在 A100/H100 上跑：

```python
import torch, time
a = torch.randn(8192, 8192, device='cuda', dtype=torch.float32)
b = torch.randn(8192, 8192, device='cuda', dtype=torch.float32)
for dtype in [torch.float32, torch.bfloat16]:
    x, y = a.to(dtype), b.to(dtype)
    torch.cuda.synchronize(); t = time.time()
    for _ in range(20): x @ y
    torch.cuda.synchronize()
    dt = time.time() - t
    print(dtype, 2 * 8192**3 * 20 / dt / 1e12, "TFLOPS")
```

观察 BF16 相对 FP32 的加速比，并与官方表对照，估算实际利用率。

**思考题**：

1. LLM decode 阶段 batch=1 时是 memory-bound，此时换更快的 Tensor Core 有用吗？瓶颈在哪？
2. 为什么 INT4 量化通常只量化权重（W4A16），而不是激活也量化成 INT4？
3. 一个 kernel 的 MMA 指令占比很高但实测只有 40% 峰值算力，最可能的瓶颈是什么？

---

## 八、与 LLM Inference 的关联

把前面的知识串成 LLM 推理的性能地图：

1. **计算主体是 GEMM**：Transformer 每层包含 QKV 投影、attention 的 QK^T/PV、MLP 的两个大矩阵乘。70B 模型一次前向约 2×70G FLOPs/token，几乎全部落在 Tensor Core 上。
2. **推理框架的精度选型就是 Tensor Core 选型**：vLLM/TensorRT-LLM 支持 FP16/BF16/FP8/INT8/INT4 后端，本质是在“Tensor Core 算力 vs 带宽 vs 精度损失”三角中做权衡。FP8（Hopper+）利用 E4M3 格式跑 prefill，W4A16（GPTQ/AWQ）用反量化 + BF16 计算救 decode 带宽。
3. **KV Cache 是 FP16 存的**：这也是一个显存大头，KV Cache 量化（FP8 KV Cache）直接提升长上下文场景的 batch 容量。
4. **Prefill 与 Decode 的瓶颈切换**：Prefill 长序列时 compute-bound，FP8/BF16 Tensor Core 算力直接决定首 token 延迟（TTFT）；Decode 时 memory-bound，权重精度（每 token 要把全部权重从 HBM 读一遍）决定 tokens/s。**这就是“权重越小、decode 越快”的物理根源**。
5. **算子优化的天花板**：FlashAttention、PagedAttention 优化的本质，都是围绕“如何让数据更快流过 Tensor Core”重新组织计算——前者用 tiling + 在线 softmax 减少对 HBM 的往返，后者解决 KV 布局碎片化。

**一个判断标准**：评估任何 LLM 推理优化方案时，先问三个问题——它降低了多少数据搬运量？它用了哪个精度的 Tensor Core？它在 prefill 还是 decode 阶段起作用？答不上来，多半是伪优化。

---

## 九、FAQ

**Q1：有了 Tensor Core，CUDA Core 还需要吗？**
需要。Tensor Core 只做矩阵乘加。LLM 推理中的 softmax、LayerNorm/RMSNorm、RoPE、采样、量化/反量化 kernel、KV Cache 读写都跑在 CUDA Core 上。一个推理引擎是两者的协作，只是 FLOPs 的大头在 Tensor Core。

**Q2：Tensor Core 会不会降低模型精度？**
FP16/BF16 用 FP32 累加器，精度损失极小，训练都敢用。FP8/INT8 需要校准或逐层 scale 管理，有可测的精度代价，但现代量化方法（AWQ、SmoothQuant）已能把损失压到几乎无感。低精度 ≠ 不准确，关键是累加精度和 scale 管理。

**Q3：BF16 和 FP16 该选哪个做推理？**
默认 BF16。它的动态范围与 FP32 相同，LLM 激活中的离群值不会溢出，不需要 loss scaling。只有当模型权重本身是 FP16 训练的、或极老的卡（如 V100，不支持 BF16）才用 FP16。

**Q4：为什么我的 kernel 用了 PyTorch 却没达到官方 TFLOPS？**
峰值算力是理想条件的数字。实际受限于：矩阵太小（算术强度不足）、访存模式差、kernel 不是 Tensor Core 路径（如开了 `allow_tf32=False` 的 FP32 matmul）、batch 维度浪费。大矩阵 × BF16 × cuBLAS 后端通常能到 60–80% 峰值，已是相当好的水平。

**Q5：非 NVIDIA GPU（如 AMD、国产卡）有类似的东西吗？**
有。AMD 的 Matrix Core（MFMA 指令）、各家 AI 芯片的 MAC 阵列，设计哲学与 Tensor Core 一致：专用化、矩阵粒度、低精度高密度。理解了 Tensor Core 的原理，迁移到任何加速器架构都只是换名词。

---

## 十、参考资料

- NVIDIA Ampere / Hopper Architecture Whitepaper（Tensor Core 与 MMA 详解）：developer.nvidia.com/blog/nvidia-ampere-architecture-in-depth/
- NVIDIA H100 Tensor Core GPU Datasheet（各精度算力官方表）
- NVIDIA CUTLASS 文档与 GEMM 教程：github.com/NVIDIA/cutlass
- CUDA Programming Guide — Warp Matrix Functions（WMMA API）
- PTX ISA 文档 — `mma` / `wgmma` 指令章节
- "Mixed-Precision Training" (NVIDIA, 2017)：低精度训练的开山论文
- NVIDIA blog: "Tensor Cores in CUDA 12 / FP8 on Hopper"

---

## 📋 本日知识点清单

- [ ] CUDA Core vs Tensor Core 的本质区别
- [ ] Tensor Core 为什么专门适合 Matrix Multiply
- [ ] MMA (Matrix Multiply-Accumulate) 指令
- [ ] FP32、FP16、BF16、TF32、FP8、INT8 数据类型
- [ ] 数据类型为什么直接影响 GPU 推理性能
- [ ] Tensor Core 的 Warp 级编程模型

## 📝 实践练习

对比不同数据类型下 Tensor Core 的算力（查阅 NVIDIA 官方规格表）。

---

*本文是「GPU → LLM Inference」30 天学习计划的一部分。学习路线：GPU 硬件 → CUDA 执行模型 → 显存/带宽 → Kernel → Attention → KV Cache → 并行策略 → 推理性能。*
