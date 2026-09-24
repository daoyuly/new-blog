---
title: "GPU 学习日报 Day 5：GPU 内存层次：从 Register 到 HBM"
date: 2026-09-24 10:00:00
tags:
  - GPU
  - 内存层次
  - Register
  - Shared Memory
  - HBM
  - 带宽
categories:
  - GPU → LLM Inference 学习计划
  - Week 1 建立 GPU 心智模型
description: "Day 5/30 | GPU Memory Hierarchy | GPU 内存层次：从 Register 到 HBM。30 天从 GPU 硬件到 LLM 推理性能的深度学习计划。"
keywords: "GPU, CUDA, LLM, Inference, GPU Memory Hierarchy, GPU, 内存层次, Register, Shared Memory, HBM, 带宽"
author: OpenClaw GPU Learning
---

# GPU 学习日报 Day 5：GPU 内存层次：从 Register 到 HBM

> **30 天学习计划** | Week 1 - 建立 GPU 心智模型 | Day 5/30
> 
> **今日主题**: GPU Memory Hierarchy

---

# GPU 内存层次：从 Register 到 HBM

**核心结论（先记住这一段）**：GPU 的计算速度远超数据供给速度。算力（FLOPS）每代翻倍，而显存带宽（Memory Bandwidth）只能增长 50% 左右，这个剪刀差越来越大。因此，GPU Kernel 的性能瓶颈多数时候不是“算得慢”，而是“数据搬得慢”——这叫 **内存墙（Memory Wall）**。理解 **寄存器（Register）→ 共享内存（Shared Memory）→ L1 缓存 → L2 缓存 → HBM 显存** 这条完整内存层次（GPU Memory Hierarchy）的容量、延迟、带宽与可见范围，是理解 LLM 推理性能（尤其是 Decode 阶段为什么被 Memory-Bound 限制）的必修基础。一句话：**算力免费，带宽昂贵（Arithmetic is free, data movement is expensive）**。

---

## 一、背景与动机：为什么 LLM 工程师必须学内存层次

一个常见的困惑：你买了 H100，Spec Sheet 上写着约 1000 TFLOPS 的 FP16 算力，可你的推理服务 QPS 却低得可怜，GPU 利用率经常只有 30%~50%。问题不在算力，而在数据供给。

LLM 推理的两个阶段泾渭分明：

- **Prefill（预填充）**：一次性处理整个 prompt，矩阵乘矩阵（GEMM），算力强度高，通常是 **Compute-Bound（计算受限）**。
- **Decode（解码）**：每生成一个 token，都要把模型的全部权重（几 GB 到几十 GB）从显存读一遍，但每个权重只做一次乘加。算术强度（Arithmetic Intensity）极低，通常只有 1~2 FLOP/Byte，而 H100 的平衡点约在 500+ FLOP/Byte。这是典型的 **Memory-Bound（访存受限）**。

要理解“为什么 Decode 是 Memory-Bound”、“为什么 FlashAttention 能���速”、“为什么 KV Cache 这么重要”，你必须先建立对 GPU 内存层次的物理直觉。今天这一课，就是所有后续优化的地基。

---

## 二、核心内容

### 2.1 完整的内存层次：一条从快到慢的长走廊

GPU 的内存层次是一个**金字塔**：越靠近计算核心，越快、越小、越贵；越远离核心，越慢、越大、越便宜。CPU 的缓存是硬件自动管理的黑盒，而 GPU 特殊之处在于：**程序员可以直接控制中间几层**（Register 分配由编译器做，Shared Memory 由你显式使用）。

以一颗现代数据中心 GPU（如 A100/H100 级别）为例，典型数字如下（具体值随架构变化，量级是稳定的）：

| 层级 | 中文名 | 典型容量 | 访问延迟（周期数） | 延迟（约） | 带宽 | 可见范围 / 生命周期 |
|---|---|---|---|---|---|---|
| Register | 寄存器 | 每 SM ~256KB（每线程 ≤255 个 32-bit 寄存器） | ~1 cycle | ~0.5 ns | 最高（与 SM 同速） | 单线程私有 / Kernel 生命周期 |
| Shared Memory | 共享内存 | 每 SM 100~228KB（可配置） | ~20-30 cycles | ~10-20 ns | ~20+ TB/s（每 SM） | 同一 CTA（Block）内所有线程 / Kernel 生命周期 |
| L1 Cache | 一级缓存 | 每 SM 128~256KB（与 Shared Memory 共享物理空间） | ~30-40 cycles | ~20 ns | 高 | 单 SM 内 / 硬件管理 |
| L2 Cache | 二级缓存 | 40~60MB（全芯片共享） | ~200-300 cycles | ~100-200 ns | 数 TB/s | 所有 SM / 硬件管理 |
| HBM (Global Memory) | 高带宽显存 | 40~192GB | ~400-800 cycles | ~400-600 ns | 2~3.35 TB/s | 全 GPU + 主机（经 PCIe/NVLink）/ 程序员显式管理 |

**读表的关键直觉**：从寄存器到 HBM，延迟差了 **三个数量级**（0.5ns → 500ns）。这意味着一次 HBM 访问的时间，够 GPU 完成 **几百到上千次浮点运算**。如果你的数据没在正确的层次上，SM 就是在“等米下锅”。

用 ASCII 画出来：

```
        ┌─────────────────────────────────────────────┐
        │                  HBM (60-192GB)             │  ← 慢、大、贵带宽
        │        带宽: 2-3.35 TB/s  延迟: ~500ns       │
        └──────────────────────┬──────────────────────┘
                  ┌────────────┴────────────┐
                  │      L2 Cache (40-60MB) │  ← 全 GPU 共享
                  └──────┬──────────┬───────┘
              ┌──────────┴──┐   ┌───┴──────────┐
              │ SM #0       │   │ SM #1        │
              │ ┌─────────┐ │   │ ┌─────────┐  │
              │ │L1/Shared│ │   │ │L1/Shared│  │  ← Block 内共享，
              │ └────┬────┘ │   │ └────┬────┘  │     手动或硬件管理
              │ ┌────┴────┐ │   │ ┌────┴────┐  │
              │ │Registers│ │   │ │Registers│  │  ← 线程私有，最快
              │ └─────────┘ │   │ └─────────┘  │
              └─────────────┘   └──────────────┘
```

注意 L1 和 Shared Memory **共享同一块物理 SRAM**（在 Volta 及之后架构中可通过 CUDA 配置划分比例）。这是一个重要的设计折衷，后面会讲到。

### 2.2 逐层拆解：每层的特性与因果

#### Register：贴在计算单元上的便签

寄存器物理上就是执行单元旁边的触发器阵列，延迟约 1 个周期，与计算几乎零距离。CUDA 中局部变量（只要不被索引动态化或溢出）就分配在寄存器里。

**因果链**：寄存器数量有限（每线程上限 255 个）→ 编译器若需要更多，就会 **Register Spilling（寄存器溢出）**，把数据放到 Local Memory——名字叫 Local，实际物理位置在 HBM，走 L1/L2 缓存 → 性能可能断崖式下跌。这就是为什么核函数里开太大的局部数组很危险。

**可见性**：寄存器是线程私有的。线程 A 看不到线程 B 的寄存器——除非用 Warp Shuffle（`__shfl_sync`），这是绕过 Shared Memory 直接在寄存器间交换数据的高速通道，延迟仅约 1-2 个周期。

#### Shared Memory：软件管理的片上便签本

Shared Memory（共享内存）是 GPU 最有特色的一层。它不是硬件自动管理的缓存，而是**程序员手动控制的 scratchpad（便签本）**：你显式地把数据从 Global Memory 搬进来，显式地让 Block 内线程共享，显式地 `__syncthreads()` 同步。

**为什么 GPU 选择“软件管理”而不是纯硬件缓存？** 因果是这样的：硬件缓存为通用访问模式设计，代价是 tag 查找、替换策略等开销和不可预测性；而 GPU 的并行程序往往有**可预测的数据复用模式**（如矩阵乘的分块 tiling），软件管理可以 100% 利用每一个字节、每一次访问零开销。代价是编程复杂度上升。

经典收益公式（以矩阵乘为例）：

```
朴素 GEMM：每个元素从 HBM 读 A 和 B 各一次 → 大量重复访存
Tiled GEMM：把 A、B 各分成 TILE×TILE 的块，先搬进 Shared Memory，
            块内每个数据被复用 TILE 次
HBM 访流量 ≈ 降低 TILE 倍
```

**注意**：Shared Memory 分为 **32 个 Bank（存储体）**，理想情况多个线程同时访问不同 Bank 可并行；若多个线程访问**同一 Bank 的不同地址**，会串行化，产生 **Bank Conflict（Bank 冲突）**，带宽骤降。这是 Shared Memory 优化中最常见的坑。

#### L1 / L2 Cache：硬件管理的安全网

L1 缓存挂在每个 SM 内，L2 缓存全芯片共享。它们由硬件自动管理，负责捕捉程序员没有显式优化的那部分访存——比如 CUDA 12 之后的默认行为：Global Memory 的 load 会经过 L1（`ld.global.ca`），而旧架构默认旁路 L1。

**为什么 GPU 的缓存通常不如 CPU 缓存“顶用”？** 因为 GPU 的设计哲学是**用海量线程并行来掩盖延迟（Latency Hiding）**，而不是靠缓存来降低延迟。CPU 面对长延迟的对策是大缓存 + 乱序执行 + 分支预测；GPU 的对策是：SM 上同时驻留几千个线程，一个线程等内存时，调度器立刻切换到另一个就绪线程——只要 Occupancy（占用率）够高，HBM 的 500ns 延迟就被“藏”在其他线程的计算时间里了。

这解释了一个反直觉的现象：**提高 Occupancy 往往比提高缓存命中率更直接地提升 GPU 性能**。

#### HBM：快得惊人的“慢内存”

HBM（High Bandwidth Memory，高带宽内存）通过硅通孔（TSV）堆叠 DRAM 芯片，与 GPU 裸片在同一封装内通过超宽总线（几千 bit）连接，带宽达 2~3.35 TB/s（A100 是 1.6~2TB/s，H100 是 3.35TB/s，H200/B200 更高）。

但请记住核心矛盾：**HBM 的带宽很高，延迟却依然高达数百纳秒**——这是 DRAM 的物理属性决定的，堆叠只能提升带宽（并行度），不能根治延迟。所以：

- **高带宽 ≠ 低延迟**。带宽靠“同时搬运大量数据”取胜，单次访问依然很慢。
- **高延迟靠并行掩盖，不靠缓存消除**。这是 GPU 与 CPU 的根本分歧。

另外，从 HBM 再往外是 PCIe（~64GB/s）和 NVLink（~900GB/s）连接的**主机内存（Host DRAM）**，跨度又是一个数量级。数据在 CPU↔GPU 之间的搬运（Host-to-Device Copy）常常是端到端延迟的大头。

### 2.3 为什么 Kernel 很多时候不是算得慢，而是搬得慢

这是本文最重要的一节。判断一个 Kernel 是 Compute-Bound 还是 Memory-Bound，看**算术强度（Arithmetic Intensity，AI）**：

```
AI = FLOPs 计算量 / Bytes 访存量 （单位：FLOP/Byte）
```

对比 GPU 的 **机器平衡点（Machine Balance）**：

| GPU | 峰值算力（FP16） | HBM 带宽 | 平衡点 = 算力/带宽 |
|---|---|---|---|
| V100 | ~125 TFLOPS | ~900 GB/s | ~139 FLOP/Byte |
| A100 | ~312 TFLOPS | ~2039 GB/s | ~153 FLOP/Byte |
| H100 | ~990 TFLOPS | ~3350 GB/s | ~296 FLOP/Byte |

含义：**每从 HBM 读 1 字节，GPU 必须有约 300 次浮点运算可做，计算单元才不会闲着**。如果你的 Kernel 算术强度低于这个数，无论代码写得多精巧，性能上限就是：

```
耗时 ≥ 访存字节数 / HBM 带宽    （Roofline 模型的倾斜段）
```

用 ASCII 表示 Roofline（屋顶线）模型：

```
 性能
 FLOPS│                    ＿＿＿＿＿＿＿＿ 峰值算力 (Compute-Bound)
      │                ／
      │            ／
      │        ／                斜率 = HBM 带宽
      │    ／                    (Memory-Bound)
      │＿／
      └────────────────────────────→ 算术强度 (FLOP/Byte)
           平衡点 ≈ 300
```

一个直观例子：向量加法 `C[i] = A[i] + B[i]`。每 3 次访存（读 A、读 B、写 C，各 2 字节 FP16）只换 1 次加法，AI ≈ 6/6 = 1 FLOP/Byte。离平衡点差 300 倍——这个 Kernel 的 GPU 利用率天花板只有约 0.3%。**它不是算得慢，是带宽只够喂这么快。**

### 2.4 全局访存优化：合并访问是第一戒律

在 HBM 这一层的优化里，最重要的规则是 **Memory Coalescing（内存合并访问）**：

GPU 的 HBM 访问以 **32 字节（或 32B 的倍数）的扇区（Sector）** 为单位。当一个 Warp（32 个线程）访问连续地址时，比如 `thread i 读 array[i]`，硬件把这 32 个请求**合并成少数几次**大块传输——这是最高效的模式。

反之，如果 Warp 内线程访问的地址彼此跳跃（**Strided Access**）或完全随机（**Random Access**），硬件不得不发起多次独立的扇区传输，实际消耗的带宽可能是理论需求的 8~32 倍。矩阵按列访问（行主序存储）就是典型的踩坑现场，解决办法通常是让 Warp 沿行方向遍历，或用 Shared Memory 做 **Transpose（转置）** 中转。

一个快速自查清单：

1. Warp 内线程是否访问连续地址？（Coalescing）
2. 数据是否在 Block 内有复用？有 → 上 Shared Memory Tiling
3. 局部数组是否过大导致寄存器溢出？
4. 是否有 Bank Conflict？（用 `padding` 或按行访问规避）
5. 访存量能否减少？（数据类型 FP32→FP16/INT8，本身就是 2 倍带宽优化）

---

## 三、实践练习与思考题

**练习 1：内存层次对比表（本日核心任务）**

不看上文，独立默写一张表：Register / Shared Memory / L1 / L2 / HBM 五层的容量、延迟、带宽、可见范围、生命周期、管理方式（软件/硬件）。写完再对照第 2.1 节修正。**默写不出来就是没理解。**

**练习 2：算术强度心算**

对以下操作，估算算术强度（FP16 数据）并判断 Compute-Bound 还是 Memory-Bound：
1. 逐元素激活函数 ReLU
2. 向量点积（长度 4096）
3. 4096×4096 的大矩阵乘（考虑理想 tiling）
4. 1×4096 与 4096×4096 的矩阵-向量乘（GEMV）

（参考答案：1 是 Memory-Bound；2 约 1 FLOP/Byte，Memory-Bound；3 内部 AI = O(N)，Tiling 后可达数百 FLOP/Byte，Compute-Bound；4 每 2 字节权重只做 1 次乘加，AI≈1，严重 Memory-Bound——注意，这正是 LLM Decode 阶段的核心操作。）

**思考题**：
- 为什么 Shared Memory 不做成更大的、由硬件全自动管理的 L1？（提示：比较两者在可预测工作负载下的开销）
- 为什么 CUDA 优化的第一课是提高 Occupancy 而不是提高缓存命中率？
- H100 带宽比 A100 高 64%，算力高 3 倍多，这对 Decode 阶段的加速比意味着什么？

---

## 四、与 LLM Inference 的关联

把今天的内容直接映射到 LLM 推理，你会看清整个性能图景：

**1. Decode 阶段 = GEMV = Memory-Bound 的教科书案例**
Batch=1 时，每生成一个 token 是一次矩阵-向量乘：读入全部权重（如 70B 模型 FP16 约 140GB），只产生极少的 FLOPs。在 H100 上：
```
理论下限 ≈ 140GB / 3.35TB/s ≈ 42ms/token ≈ 24 tokens/s 上限
```
无论你的 CUDA 写得多好，**带宽就是天花板**。这也是量化（FP8/INT4 能把权重砍半甚至砍 4 倍）对 Decode 提速近乎线性的原因——**减字节比减计算更值钱**。

**2. Continuous Batching 的原理 = 提高算术强度**
Batch 增大后，GEMV 变成 GEMM，同样的权重字节被 Batch 个请求复用，AI 提升，逐渐逼近 Compute-Bound。这就是 vLLM 等框架 continuous batching 能大幅提升吞吐的第一性原理。

**3. FlashAttention = 内存层次的艺术**
标准 Attention 需要把 N×N 的中间矩阵写回 HBM 再读回（O(N²) 的访存量）。FlashAttention 通过 Tiling 把 Q/K/V 分块装进 Shared Memory，用在线 Softmax 技巧避免物化中间矩阵，把 HBM 访存从 O(N²) 降到 O(N²/M)（M 为 SRAM 大小）——**算的 FLOPs 一点没少，只是少搬了数据，就快了几倍**。

**4. KV Cache 就是 HBM 容量与带宽的争夺战**
长上下文场景下 KV Cache 从几 GB 到几十 GB，挤占权重和 Batch 空间；Decode 每步还要反复读写它。PagedAttention、KV Cache 量化（FP8 KV）、MLA 等技术，本质上都是在内存层次的不同层上做文章。

**5. 多卡推理 = 跨越内存层次的最外层**
Tensor Parallelism 下每层要 All-Reduce，数据走 NVLink（~900GB/s）甚至 PCIe（~64GB/s）——比 HBM 又慢一个数量级。为什么 TP 通常不超过 8 卡、为什么通信和计算要重叠调度，答案都在这条层次链上。

---

## 五、FAQ

**Q1：Shared Memory 和 L1 Cache 物理上是同一块东西吗？**
在 Volta 及之后的架构中是共享同一块物理 SRAM，可配置划分比例（如各 128KB 或 100KB/156KB 等）。但逻辑上完全不同：Shared Memory 由软件显式分配寻址，L1 由硬件透明管理。开多大的 Shared Memory 会反过来影响可运行的 Block 数量和 Occupancy。

**Q2：为什么 HBM 带宽那么高（3TB/s+），还说它是瓶颈？**
因为算力更高（近 1000 TFLOPS），比值即平衡点约 300 FLOP/Byte。只要 Kernel 的算术强度低于这个数，HBM 就是短板。另外 HBM 延迟仍然高达数百纳秒，高带宽靠的是并行通道多，不改变单次访问慢的事实。

**Q3：如何快速判断我的 Kernel 是 Memory-Bound 还是 Compute-Bound？**
三种方法：① 手算或用工具（如 Triton/CUTLASS 的 profiler）估算算术强度，对比 GPU 平衡点；② 用 Nsight Compute 看 SM 吞吐和显存吞吐两条曲线，谁顶到 roofline 谁是瓶颈；③ 简单实验——如果提升数据精度/减少计算量对性能影响不大，而减少数据量（如量化）提速明显，基本就是 Memory-Bound。

**Q4：Register Spilling 是怎么发生的，怎么发现和避免？**
核函数使用的寄存器超过编译器分配上限时，溢出的变量被放入 Local Memory（物理上在 HBM，经 L1/L2）。发现方式：编译加 `-Xptxas -v` 看 spill 数量，或 Nsight 中看 local memory 访问。避免方法：减小局部数组、限制 Block 大小、必要时用 `__launch_bounds__` 或 `maxrregcount` 控制寄存器预算。

**Q5：为什么 LLM Decode 加速这么多工作都集中在“减少访存”而不是“加速计算”？**
因为 Decode 的算术强度只有 ~1-2 FLOP/Byte，远低于平衡点，计算单元本来就大量闲置。此时减少字节数（量化、稀疏化、跳过无效计算）或复用字节（Batching、FlashAttention 式分块）是唯一有效的杠杆，而优化乘加本身收益为零。

---

## 六、参考资料

- NVIDIA CUDA C++ Programming Guide — Memory Hierarchy 章节：https://docs.nvidia.com/cuda/cuda-c-programming-guide/
- NVIDIA CUDA C++ Best Practices Guide — Memory Optimizations：https://docs.nvidia.com/cuda/cuda-c-best-practices-guide/
- NVIDIA H100 Tensor Core GPU Datasheet（带宽/算力官方数据）：https://www.nvidia.com/en-us/data-center/h100/
- FlashAttention 论文（V1, 2022）：Dao et al., *FlashAttention: Fast and Memory-Efficient Exact Attention with IO-Awareness*，arXiv:2205.14135
- vLLM / PagedAttention 论文：Kwon et al., *Efficient Memory Management for Large Language Model Serving with PagedAttention*，SOSP 2023
- Roofline 模型原始论文：Williams et al., *Roofline: An Insightful Visual Performance Model for Multicore Architectures*, CACM 2009

---

## 📋 本日知识点清单

- [ ] Registers → Shared Memory → L1 Cache → L2 Cache → HBM/VRAM 的完整层次
- [ ] 每层的容量、延迟、带宽、生命周期、可见范围
- [ ] 为什么 GPU Kernel 很多时候不是算得慢而是数据搬得慢
- [ ] Global Memory 的高延迟问题
- [ ] Shared Memory 作为软件管理的缓存
- [ ] 这是理解 LLM inference 性能的关键基础

## 📝 实践练习

制作 GPU 内存层次对比表（容量、延迟、带宽、可见范围），解释为什么数据搬运是瓶颈。

---

*本文是「GPU → LLM Inference」30 天学习计划的一部分。学习路线：GPU 硬件 → CUDA 执行模型 → 显存/带宽 → Kernel → Attention → KV Cache → 并行策略 → 推理性能。*
