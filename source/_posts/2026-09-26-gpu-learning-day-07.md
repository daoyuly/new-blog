---
title: "GPU 学习日报 Day 7：GPU Week 1 总结：GPU 为什么适合 LLM"
date: 2026-09-26 10:00:00
tags:
  - GPU
  - 总结
  - 性能对比
  - LLM
categories:
  - GPU → LLM Inference 学习计划
  - Week 1 建立 GPU 心智模型
description: "Day 7/30 | 第一周总结与实验 | GPU Week 1 总结：GPU 为什么适合 LLM。30 天从 GPU 硬件到 LLM 推理性能的深度学习计划。"
keywords: "GPU, CUDA, LLM, Inference, 第一周总结与实验, GPU, 总结, 性能对比, LLM"
author: OpenClaw GPU Learning
---

# GPU 学习日报 Day 7：GPU Week 1 总结：GPU 为什么适合 LLM

> **30 天学习计划** | Week 1 - 建立 GPU 心智模型 | Day 7/30
> 
> **今日主题**: 第一周总结与实验

---

# GPU Week 1 总结：GPU 为什么适合 LLM

**核心结论先行**：GPU 适合 LLM 推理，不是因为它“算得快”，而是因为它**用大规模并行掩盖了内存延迟**。LLM 推理的本质是矩阵乘法和内存搬运，而这恰好命中 GPU 的三个设计优势：数千个核心的并行吞吐能力、多级内存层次的高带宽（Bandwidth）、以及通过 Warp 调度实现的延迟隐藏（Latency Hiding）。理解了 "GPU → CUDA → 性能" 这条因果链，你就能解释为什么 LLM 推理瓶颈常常不在计算，而在内存带宽——这也是第一周最重要的认知收获。

---

## 一、背景与动机：为什么要花一周搞懂 GPU

做 LLM 推理优化的人分两种：一种把 GPU 当黑盒，调 batch size 靠玄学；另一种知道数据在 GPU 里怎么流动，能预判瓶颈在哪。第一周的目标就是成为后者。

这七天我们建立了完整的知识栈：

| 天数 | 主题 | 回答的问题 |
|------|------|-----------|
| Day 1-2 | CPU vs GPU | 为什么需要 GPU？ |
| Day 3 | SM 与 CUDA 执行模型 | 线程是怎么跑起来的？ |
| Day 4 | 内存层次 | 数据放在哪里？ |
| Day 5-6 | Memory Access Pattern | 为什么同样的代码速度差 10 倍？ |
| Day 7 | 本篇总结 | GPU 为什么适合 LLM？ |

这五个问题串起来，就是一条完整的因果链：**硬件结构 → 执行模型 → 内存行为 → 性能表现 → LLM 推理优化**。下面逐一收网。

---

## 二、CPU vs GPU：两种哲学，而非两种芯片

**CPU（Central Processing Unit，中央处理器）** 的设计目标是“尽快完成单个任务”——少量强大的核心、复杂的乱序执行、大缓���来降低延迟。**GPU（Graphics Processing Unit，图形处理器）** 的设计目标是“同时完成海量任务”——数千个简单核心、极致的吞吐。

一个重要的物理直觉：**晶体管预算是固定的，CPU 把晶体管花在控制逻辑和缓存上，GPU 把晶体管花在算术单元（ALU）上。**

| 维度 | CPU | GPU |
|------|-----|-----|
| 核心数 | 8~64 个复杂核心 | 数千~数万个简单核心 |
| 设计目标 | 低延迟 | 高吞吐 |
| 缓存 | 大（几十 MB） | 小（几 MB，靠寄存器+共享内存补位） |
| 控制逻辑 | 乱序执行、分支预测 | 极简，SIMT 批量执行 |
| 擅长任务 | 分支密集、串行依赖 | 数据并行、规则计算 |
| 典型功耗占比 | 大量花在“找指令、找数据” | 绝大多数花在“做计算” |

**关键判断**：GPU 不是“更快的 CPU”，它是把并行性兑换成性能的专用机器。LLM 推理的核心操作（矩阵乘法）恰恰是“数万次独立乘加”，完美契合 GPU 的设计假设。

---

## 三、SM 与 CUDA 执行模型：并行的组织结构

**SM（Streaming Multiprocessor，流式多处理器）** 是 GPU 的基本计算单元。一块 A100 有 108 个 SM，每个 SM 内部包含大量 ALU、寄存器文件和共享内存。

CUDA 的执行模型是一个三层结构：

```
Grid（网格）
 └── Block（线程块）→ 分配到某个 SM 上
      └── Warp（线程束）= 32 个线程 → SM 的最小调度单位
           └── Thread（线程）→ 拥有私有寄存器
```

物理直觉：**Block 是资源分配的单位**（一个 Block 只会待在一个 SM 上），**Warp 是调度执行的单位**（Warp 内 32 个线程锁步执行同一指令，即 SIMT——Single Instruction Multiple Threads）。

这带来两个重要推论：

1. **Block 内线程可以通过共享内存协作，跨 Block 只能靠全局内存**——这是性能优化的分界线。
2. **如果 Warp 内线程走了不同分支（Warp Divergence，分支发散），GPU 只能串行执行两条路径**——这就是"if/else 写多了 GPU 变慢"的根本原因。

---

## 四、内存层次：性能的真正战场

GPU 的计算能力增长速度远超内存带宽增长速度，所以**现代 GPU 的主要矛盾是“算不过来不如喂不饱”**。内存层次从快到慢：

| 层次 | 位置 | 容量（A100 例） | 延迟（约） | 谁控制 |
|------|------|----------------|-----------|--------|
| 寄存器 | 每线程私有 | 256 KB/SM | ~1 cycle | 编译器 |
| 共享内存 | Block 内共享 | 192 KB/SM | ~30 cycles | 程序员 |
| L2 缓存 | 全 GPU 共享 | 40 MB | ~200 cycles | 硬件 |
| 全局内存 | 板载 HBM | 40 GB HBM2e | ~400-600 cycles | 程序员 |

关键洞察：**全局内存和寄存器之间有上百倍的延迟鸿沟**。如果每个线程都直接访问全局内存，GPU 会慢到怀疑人生。解决办法有两个：

1. **延迟隐藏**：一个 Warp 等内存时，调度器立刻切换到另一个就绪的 Warp——这就是 GPU 需要“大量线程”的根本原因。线程不是用来算得快，是用来“排队堵住延迟的坑”的。
2. **合并访问（Coalesced Memory Access，合并内存访问）**：让相邻线程访问相邻地址，32 次访问合并成一次内存事务。

```
合并访问（好）：                      非合并访问（坏）：
thread0 → a[0]                       thread0 → a[0]
thread1 → a[1]    1次事务            thread1 → a[1000]   32次事务
thread2 → a[2]    ═══════            thread2 → a[2000]   ═══════
...                                   ...
带宽利用率 ~100%                       带宽利用率 ~3%
```

Day 5-6 的实验里，仅把 `a[i * N + j]`（行优先，合并）改成 `a[j * N + i]`（列优先，跨步），矩阵转置内核的性能就掉了 5~10 倍——这就是内存访问模式的力量。

---

## 五、Latency、Bandwidth、Throughput：三个必须分清的指标

这三个词经常混用，但它们回答的是三个不同的问题：

| 指标 | 英文 | 回答的问题 | 类比 |
|------|------|-----------|------|
| 延迟 | Latency | 一次请求多久返回？ | 快递单件多久送到 |
| 带宽 | Bandwidth | 单位时间能搬多少数据？ | 高速公路宽度 |
| 吞吐 | Throughput | 单位时间完成多少任务？ | 每天总共送多少件 |

**测量方法**（本周实验实际使用）：

- **Latency**：让单个线程反复访问同一个全局内存地址，用 CUDA Event 计时，测出一次往返耗时。
- **Bandwidth**：用大规模 `memcpy` 类内核，搬运 N 字节耗时 T，则带宽 = N / T。A100 理论 HBM 带宽 1.6 TB/s，实测能达到 80%~90% 就算优秀。
- **Throughput**：统计内核单位时间完成的运算量（FLOPS），与硬件峰值对比得出“计算利用率”。

计时注意两点：① 用 `cudaEvent` 而不是 CPU 端 `clock()`，因为 kernel 启动是异步的；② 记得做 warm-up，第一次运行包含 context 初始化和缓存冷启动。

**核心结论**：CPU 优化手段（降延迟）和 GPU 优化手段（提带宽利用率、隐藏延迟）方向完全不同。GPU 不怕延迟高，怕的是**闲着**。

---

## 六、实验数据：改变三个旋钮，看性能怎么变

本周用向量加法和矩阵乘法做了三组对照实验（RTX 3090，数据为典型量级）：

**实验 1：Thread 总数（向量加法，10⁸ 元素）**

| 配置 | 耗时 | 说明 |
|------|------|------|
| 1 Block × 1 Thread | ~850 ms | 完全串行 |
| 1 Block × 1024 Threads | ~8.5 ms | 只用一个 SM，其他闲置 |
| 1024 Blocks × 256 Threads | **~1.2 ms** | 全部 SM 饱和 |

结论：线程数必须远超核心数，才能填满延迟隐藏所需的“流水线”。

**实验 2：Block Size（固定总线程数）**

| Block Size | 耗时 | 说明 |
|-----------|------|------|
| 32 | ~1.8 ms | 每 SM 调度开销大 |
| 128 | ~1.3 ms | 接近最优 |
| 256 | **~1.2 ms** | 最优区间 |
| 1024 | ~1.4 ms | 每 SM 可驻留 Block 数受限，灵活性下降 |

结论：Block Size 不是越大越好。最优值取决于每 Block 资源占用（寄存器、共享内存）与 SM 可驻留 Warp 数的平衡（Occupancy，占用率）。

**实验 3：访问模式（矩阵乘法，4096×4096）**

| 版本 | 耗时 | 相对性能 |
|------|------|---------|
| Naive（全局内存直读，非合并） | ~45 ms | 1× |
| 合并访问 | ~9 ms | 5× |
| 共享内存分块 | ~2.5 ms | 18× |
| cuBLAS | ~1.1 ms | 40× |

这四行就是一条完整的优化阶梯：从“能用”到“吃满硬件”，靠的全是第一周的知识。

---

## 七、回答核心问题：GPU 为什么适合 LLM 推理？

现在把所有线索串起来。LLM 推理的两个阶段：

**Prefill 阶段（处理完整 prompt）**：一次前向传播处理数千个 token，本质是大型 GEMM（通用矩阵乘法）——**计算密集（Compute-bound）**，GPU 数千核心 + Tensor Core 高并行利用率，吞吐拉满。这是 GPU 的主场。

**Decode 阶段（逐 token 生成）**：每步只算 1 个 token，权重矩阵（几十 GB）每个元素都要被读一次，却只做一次乘加——**内存密集（Memory-bound）**。此时算术强度约 1 FLOP/Byte，远低于 GPU 的平衡点（A100 约 200+ FLOP/Byte）。

```
Decode 一步的物理本质：
  读 7B 模型权重 ≈ 14 GB（FP16）
  HBM 带宽 1.6 TB/s
  → 理论下限 ≈ 9 ms/token ≈ 111 token/s
  这就是"内存带宽决定解码速度"的由来
```

所以 GPU 适合 LLM 的完整答案分三层：

1. **计算层**：矩阵乘法天然并行，GPU 的 SIMT 海量核心完美匹配；
2. **内存层**：高 HBM 带宽支撑权重的高速搬运，KV Cache 频繁读写也依赖它；
3. **架构层**：Batch 内多个请求共享同一份权重，一次权重读取服务多个请求——把 Decode 阶段从 Memory-bound 往 Compute-bound 拉（这就是 Continuous Batching 的原理）。

反过来，这也是为什么推理优化的主要方向都指向内存：量化（减少读的字节数）、KV Cache 优化（避免重复计算）、算子融合（减少内存往返）、 speculative decoding（用小模型猜、大模型批量验证）。

---

## 八、思考与实践题

1. **测量你显卡的 Roofline**：用 `cudaMemcpy` 测实测带宽，用 cuBLAS 测实测 FLOPS，画出 Roofline 图，标出你的 GPU 的“平衡点”算术强度。
2. **亲手复现实验 3**：写 naive 矩阵乘法，逐步加入合并访问和共享内存分块，观察每一级的收益。
3. **思考题 A**：为什么 Decode 阶段 batch size 增大时，单 token 延迟几乎不变，直到某个点后突然线性增长？
4. **思考题 B**：如果 GPU 带宽翻倍但计算单元不变，LLM Decode 速度会怎么变？Prefill 呢？

---

## FAQ

**Q1：GPU 核心数是 CPU 的几百倍，为什么单线程程序 GPU 反而更慢？**
GPU 的单个核心是“精简版”，没有分支预测和乱序执行，单线程性能远弱于 CPU。GPU 的性能来自成千上万线程的并行，串行代码用它就是用跑车拉一件货——发动机再强也白搭。

**Q2：Block Size 设多少最好？有没有万能值？**
没有万能值，128~256 是常见起点，但最优值取决于寄存器/共享内存占用和硬件世代。正确方法是 profiling（如 Nsight Compute），看 Occupancy 和内存吞吐，而不是猜。

**Q3：为什么说 LLM 推理是 Memory-bound？GPU 不是计算很强吗？**
Decode 阶段每生成一个 token 都要读完整个模型的权重，但每个权重只参与一次乘加，算术强度约 1 FLOP/Byte，远低于 GPU 计算与带宽的比值（约 200）。算力在“等数据”，所以瓶颈在内存带宽。

**Q4：共享内存和 L1 缓存有什么区别？都有 L1 了还要共享内存干嘛？**
L1 由硬件自动管理，你无法控制缓存什么；共享内存由程序员显式管理（读写、同步）。当你清楚知道数据会被 Block 内复用时（如分块矩阵乘法），共享内存能给出比 L1 高得多的命中确定性。

**Q5：Warp Divergence 在 LLM 推理中会遇到吗？**
会。比如采样阶段的不同分支、变长序列的 padding 处理、MoE 模型的专家路由，都可能造成发散。推理框架（如 vLLM）会尽量让同一 Warp 内的线程执行相同路径，这也是算子设计和数据排布要考虑的因素。

---

## 参考资料

- NVIDIA CUDA C++ Programming Guide — Execution Model & Memory Hierarchy 章节
- NVIDIA A100 Tensor Core GPU Architecture Whitepaper
- CUDA C++ Best Practices Guide — Coalescing 与 Occupancy 章节
- "Dissecting the NVIDIA Volta GPU Architecture via Microbenchmarking"
- vLLM / TensorRT-LLM 文档中关于 Memory-bound 与 Continuous Batching 的论述
- Roofline Model 原始论文：Williams et al., "Roofline: An Insightful Visual Performance Model"

下周我们进入 Week 2：深入 Tensor Core 与 GEMM 优化，看看硬件是如何专门为矩阵乘法“开小灶”的。

---

## 📋 本日知识点清单

- [ ] 总结 CPU vs GPU、SM、CUDA 执行模型、内存层次、Memory Access
- [ ] 改变 Thread 数、Block Size、Memory Access Pattern 的性能对比
- [ ] Latency、Bandwidth、Throughput 的测量方法
- [ ] 建立 GPU → CUDA → 性能 的底层认知链
- [ ] 回答核心问题：GPU 为什么适合 LLM 推理？

## 📝 实践练习

写一篇 1000-2000 字的《GPU Week1：GPU为什么适合LLM》，包含性能对比数据。

---

*本文是「GPU → LLM Inference」30 天学习计划的一部分。学习路线：GPU 硬件 → CUDA 执行模型 → 显存/带宽 → Kernel → Attention → KV Cache → 并行策略 → 推理性能。*
