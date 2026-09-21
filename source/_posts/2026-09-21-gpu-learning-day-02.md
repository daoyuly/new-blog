---
title: "GPU 学习日报 Day 2：GPU 硬件结构：SM、CUDA Core 与 Tensor Core"
date: 2026-09-21 10:00:00
tags:
  - GPU
  - SM
  - CUDA Core
  - Tensor Core
  - 硬件结构
categories:
  - GPU → LLM Inference 学习计划
  - Week 1 建立 GPU 心智模型
description: "Day 2/30 | GPU 基本硬件结构 | GPU 硬件结构：SM、CUDA Core 与 Tensor Core。30 天从 GPU 硬件到 LLM 推理性能的深度学习计划。"
keywords: "GPU, CUDA, LLM, Inference, GPU 基本硬件结构, GPU, SM, CUDA Core, Tensor Core, 硬件结构"
author: OpenClaw GPU Learning
---

# GPU 学习日报 Day 2：GPU 硬件结构：SM、CUDA Core 与 Tensor Core

> **30 天学习计划** | Week 1 - 建立 GPU 心智模型 | Day 2/30
> 
> **今日主题**: GPU 基本硬件结构

---

# GPU 硬件结构：SM、CUDA Core 与 Tensor Core

**核心结论：** GPU 并非一块平铺的计算芯片，而是一个高度层级的并发机器。从宏观到微观，GPU 遵循 **GPU → GPC → SM** 的树状拓扑结构。**SM (Streaming Multiprocessor，流式多处理器)** 是 GPU 的灵魂与核心调度单元，内部集成了 **CUDA Cores（标量算术逻辑单元）**、**Tensor Cores（矩阵计算引擎）**、寄存器、共享内存与 L1 缓存。理解 SM 结构是解开所有 LLM 推理性能谜题的钥匙：CUDA Core 负责标量与向量计算，而 Tensor Core 通过 WMMA 指令在单个时钟周期内完成矩阵乘加运算，是 LLM 推理算力的绝对主力。此外，SM 内部的存储器层级决定了数据的吞吐延迟。掌握 SM 的物理边界，是理解 Kernel、Warp 线程束调度、以及 Occupancy 占用率的先决条件，更是后续优化 LLM 推理效率的物理基础。

---

## 背景与动机：为什么要深入硬件底层？

在大语言模型（LLM）席卷全球的今天，算力成为了最核心的生产力。许多开发者习惯于在高度抽象的框架层（如 PyTorch、vLLM）工作，将 GPU 视为一个“只要把数据扔进去就能出结果”的黑盒。

然而，LLM 推理本质上是一个极度访存受限与计算密集型交织的任务。当你遇到以下情况时：
- 为什么模型推理的显存占用远超理论值？
- 为什么增大 Batch Size 后，吞吐量没有线性提升？
- 为什么同样的参数量，FP16 和 INT8 的性能差异远不止 2 倍？

如果不深入 GPU 的硬件架构，这些问题就只能靠盲人摸象式的试错来解决。**软件定义了“做什么”，硬件决定了“多快做完”**。SM、CUDA Core 和 Tensor Core 是 GPU 硬件的物理边界，任何上层软件优化最终都要映射到这些物理单元的执行动作上。理解它们，就是建立从算法到硅片之间的因果链。

---

## 核心内容

### 1. GPU → GPC → SM 的层次结构

要理解 GPU 的超强算力，首先要打破“GPU是一个大计算核心”的错觉。CPU 的设计哲学是极低延迟与复杂控制逻辑，而 GPU 的设计哲学是**吞吐量**，通过空间并行度换取时间。

NVIDIA GPU 的物理结构是一个高度模块化的层级系统：
- **GPU (Graphics Processing Unit)**：整个芯片，包含所有的计算集群、显存控制器和 PCIe/NVLink 接口。
- **GPC (Graphics Processing Cluster，图形处理集群)**：GPU 内部的宏观计算单元。一个 GPC 通常包含多个 SM、一个光栅引擎等。GPC 可以看作是一个“微型 GPU”，具备完整的独立处理能力。引入 GPC 层级是为了方便芯片设计的模块化扩展，比如 AD102 芯片有 12 个 GPC。
- **SM (Streaming Multiprocessor，流式多处理器)**：GPC 内部的核心计算模块，也是 GPU 架构中最关键的执行单元。

**物理直觉：** 如果把 GPU 比作一个大型工厂，GPC 就是独立的车间，而 SM 就是车间里一条条高度自动化的流水线。数据像原料一样被分配到各条流水线上并行处理。这种层级结构使得 NVIDIA 能够通过增减 GPC 和 SM 的数量，像搭积木一样快速推出不同性能梯度的产品（从 RTX 4060 到 H100）。

### 2. SM 的组成：微观计算宇宙

SM 是 GPU 架构的灵魂。所有的指令调度、线程管理、计算执行和片上数据缓存都在 SM 内部完成。以 NVIDIA Ada/Hopper 架构为例，一个典型 SM 内部包含以下关键组件：

1. **计算单元**：
   - **CUDA Cores**：负责基础的 INT32/FP32 标量和向量运算。
   - **Tensor Cores**：专门针对深度学习矩阵运算设计的加速单元。
2. **存储与缓存层级**：
   - **Registers (寄存器)**：速度最快，每个线程私有。SM 内部的寄存器总量是固定的（如 65536 个 32-bit 寄存器）。
   - **Shared Memory (共享内存)**：SM 内部的高速 SRAM，由同一个 SM 内的线程块共享，用于线程间通信和数据复用。
   - **L1 Cache (一级缓存)**：通常与 Shared Memory 共享同一块物理 SRAM，可配置比例，用于缓存局部数据。
3. **调度与控制单元**：
   - **Warp Scheduler (线程束调度器)**：负责将指令派发给执行单元。
   - **Dispatch Unit (分发单元)**：配合调度器将指令发送到具体的计算 Core。

**因果链：** SM 内部的寄存器和共享内存是极其宝贵的资源。如果一个线程块需要的寄存器越多，那么 SM 能同时容纳的线程块就越少。这就直接引出了后续的核心概念——**Occupancy (占用率)**。SM 的物理资源决定了并发度的上限。

### 3. CUDA Core vs Tensor Core 的区别

这是理解 LLM 推理性能的分水岭。很多人混淆了这两者，实际上它们在物理结构和功能定位上截然不同。

**CUDA Core** 是 NVIDIA 早期的统一着色器模型基础。从 Fermi 架构开始，CUDA Core 被设计为一个完整的标量 ALU（算术逻辑单元）。一个 CUDA Core 每个时钟周期能执行一次浮点或整数运算。它非常灵活，适合分支密集、逻辑复杂的通用计算。

**Tensor Core** 是 Volta 架构（V100）引入的革命性硬件。它不是标量计算单元，而是**矩阵计算引擎**。Tensor Core 引入了 WMMA (Warp Matrix Multiply-Accumulate) 指令，可以在一个时钟周期内完成一个小的矩阵乘加操作（如 $D = A \times B + C$）。

**物理直觉：** 
- 假设你要搬砖。CUDA Core 就像一个熟练的工人，一次搬一块砖，动作极快，还能灵活绕过障碍物。
- Tensor Core 就像一台定制的叉车，它不能灵活绕路，但你把一堆砖（矩阵）放上去，它一次性全给你搬走。
- LLM 推理中的核心操作是矩阵乘法（GEMM）。用 CUDA Core 算矩阵乘法，需要嵌套循环拆解成标量乘加，效率极低；而 Tensor Core 直接吃进矩阵块，吐出结果矩阵，性能呈数量级跃升。

| 特性 | CUDA Core | Tensor Core |
| :--- | :--- | :--- |
| **计算类型** | 标量运算 | 矩阵乘加运算 (MMA) |
| **适用场景** | 通用逻辑、控制流、元素级操作 | 深度学习 GEMM、卷积运算 |
| **物理结构** | 标量 ALU (支持 INT/FP32/FP64) | 矩阵乘法阵列 (支持 FP16/BF16/FP8/INT8) |
| **指令周期** | 1 周期 1 个 FMA (乘加指令) | 1 周期 1 个小矩阵 MMA (如 16x16x16) |
| **在 LLM 中的作用** | 激活函数计算、Softmax、归一化 | Attention 计算、FC 层前向传播 |

### 4. GPC (Graphics Processing Cluster) 的角色

在架构图中，GPC 夹在 GPU 和 SM 之间，看起来像个冗余的层级。实际上，GPC 承担着重要的物理隔离与路由功能。

一个 GPC 包含多个 SM（如 Ampere 架构中通常 1 GPC = 4 SM），并且拥有独立的**光栅化引擎**和**L2 缓存接口**。

1. **模块化设计**：GPC 是芯片设计的“积木”。NVIDIA 设计出一个 GPC 后，可以通过复制 GPC 来快速产出不同规模的芯片，大大降低了设计成本和周期。
2. **任务隔离**：在图形渲染中，GPC 可以独立处理屏幕的不同区域；在计算任务中，GPC 的层级结构有助于减少全局路由的拥塞，保证 SM 之间的数据同步在局部区域内完成。
3. **可扩展性**：当 GPU 规模越来越大时，单层级管理所有 SM 会导致调度器设计极其复杂。GPC 作为中间层，分担了部分路由和调度的压力。

### 5. L2 Cache 与 HBM/VRAM 的宏观图景

SM 内部解决了“算得快”的问题，但如果数据喂不饱计算单元，再快的 Core 也只能空转。这就是**存储墙**问题。

- **HBM (High Bandwidth Memory) / VRAM**：这是 GPU 的主显存（如 H100 的 80GB HBM3）。HBM 通过 3D 堆叠技术和超宽总线（如 5120-bit）提供了惊人的带宽（几 TB/s）。但相对于计算速度，HBM 的延迟依然很高（几百个时钟周期）。LLM 的模型权重和 KV Cache 都存放在这里。
- **L2 Cache (二级缓存)**：L2 Cache 是所有 GPC/SM 共享的缓存层。它比 HBM 快得多，但容量较小（几十 MB 级别）。在 LLM 推理中，L2 Cache 的命中率对性能影响巨大。例如，如果多个请求复用同一批系统提示词，这部分计算结果或权重就可能被缓存在 L2 中，大幅降低 HBM 带宽压力。

**因果链：** LLM 推理的 Decode 阶段是典型的访存受限过程。每生成一个 Token，都需要把整个模型的权重从 HBM 搬到 SM 中。如果 HBM 带宽不够，Tensor Core 就会处于等待状���。这就是为什么 LLM 推理芯片如此看重 HBM 带宽，甚至需要 NVLink 来跨节点通信。

### 6. SM 是理解后续概念的基础

理解 SM 不是终点，而是起点。后续所有关于 CUDA 编程和性能优化的概念，都建立在 SM 的物理结构之上：

- **Kernel (内核函数)**：Kernel 是程序员视角的代码，但在硬件上，Kernel 会被实例化成成千上万个线程，分发到各个 SM 上执行。
- **Warp (线程束)**：SM 调度的基本单位是 Warp，包含 32 个线程。Warp 内的线程必须执行相同的指令（SIMT 模型）。如果发生分支分歧，SM 只能串行执行不同分支，导致性能减半。
- **Thread Block (线程块)**：线程块被映射到单个 SM 上执行。一个 SM 可以同时运行多个 Thread Block，前提是寄存器和共享内存够用。
- **Occupancy (占用率)**：SM 上实际活跃的 Warp 数量与理论最大 Warp 数量的比值。高 Occupancy 意味着 SM 能够在 Warp 等待访存时，快速切换到另一个 Warp 执行计算，从而隐藏延迟。

---

## 代码/图示：GPU 硬件结构 ASCII 图

下面通过一张 ASCII 图，展示 GPU 从宏观到微观的完整拓扑结构，请特别注意 SM 内部的组件标注：

```text
+-----------------------------------------------------------------------+
|                          GPU (e.g., H100)                             |
|  +---------------+   +---------------+   +---------------+           |
|  |     GPC 0     |   |     GPC 1     |   |     GPC N     |  ...      |
|  | +-----------+ |   | +-----------+ |   | +-----------+ |           |
|  | |    SM     | |   | |    SM     | |   | |    SM     | |           |
|  | | +-------+ | |   | | +-------+ | |   | | +-------+ | |           |
|  | | |CUDA Co| | |   | | |CUDA Co| | |   | | |CUDA Co| | |           |
|  | | |Tensor | | |   | | |Tensor | | |   | | |Tensor | | |           |
|  | | +-------+ | |   | | +-------+ | |   | | +-------+ | |           |
|  | | Registers | |   | | Registers | |   | | Registers | |           |
|  | | Shared Mem| |   | | Shared Mem| |   | | Shared Mem| |           |
|  | | L1 Cache  | |   | | L1 Cache  | |   | | L1 Cache  | |           |
|  | | Warp Sched| |   | | Warp Sched| |   | | Warp Sched| |           |
|  | +-----------+ |   | +-----------+ |   | +-----------+ |           |
|  |    ...SMs     |   |    ...SMs     |   |    ...SMs     |           |
|  +---------------+   +---------------+   +---------------+           |
|                                                                       |
|  +---------------------------------------------------------------+   |
|  |                      L2 Cache (Shared by all)                 |   |
|  +---------------------------------------------------------------+   |
|                                                                       |
|  +---------------------------------------------------------------+   |
|  |          HBM / VRAM (High Bandwidth Memory - Main Memory)     |   |
|  +---------------------------------------------------------------+   |
+-----------------------------------------------------------------------+
```

**SM 内部执行数据流向：**
1. 数据从 HBM 加载到 L2 Cache。
2. L2 Cache 传输到 SM 内部的 Shared Memory 或 Registers。
3. Warp Scheduler 发送指令，Tensor Cores / CUDA Cores 从 Registers 取数据进行计算。
4. 计算结果写回 Registers，最终通过 Shared Memory / L2 刷回 HBM。

---

## 实践练习与思考题

**实践练习：**
请拿出一张纸，不看本文的 ASCII 图，凭记忆画出 NVIDIA GPU 的完整硬件结构图。要求：
1. 标注出 GPU、GPC、SM 三级结构。
2. 在 SM 内部准确画出 CUDA Core、Tensor Core、Registers、Shared Memory、L1 Cache 和 Warp Scheduler。
3. 用箭头标出数据从 HBM 到计算单元的流动路径。

**思考题：**
如果一个 LLM 推理过程中，你发现 Tensor Core 的利用率极低（如 `nvidia-smi` 显示计算占用率不到 30%），但显存带宽已经跑满。结合 SM 的存储层级结构，你认为瓶颈出在哪里？可以通过什么方式缓解？（提示：思考算术强度与访存带宽的关系）

---

## 与 LLM Inference 的关联

理解 SM 结构对优化 LLM 推理具有直接且致命的指导意义：

1. **算子融合 与 Shared Memory**：LLM 推理中包含大量的非矩阵运算（如 LayerNorm、Activation、Softmax）。如果这些操作每次都去 HBM 读写数据，会导致极高的延迟。CUDA 编程中利用 SM 内部的 Shared Memory 将这些算子融合，数据在 SM 内部流转，不落盘 HBM，极大提升速度。
2. **KV Cache 与访存瓶颈**：在自回归生成阶段，每一步都需要读取历史的 KV Cache。KV Cache 存放在 HBM 中，随着序列长度增加，KV Cache 体积膨胀，导致 HBM 带宽成为瓶颈。理解 SM 如何从 HBM 搬运数据，就能理解为什么 PagedAttention 等技术能大幅提升推理效率。
3. **Tensor Core 与量化**：LLM 推理极度依赖 Tensor Core 的算力。Tensor Core 原生支持 FP16、INT8 甚至 Hopper 架构的 FP8。将模型从 FP32 降为 FP16 或 INT8，不仅将 HBM 访问量减半，还能让 Tensor Core 的吞吐量翻倍甚至四倍。这是因为量化数据直接匹配了 Tensor Core 的物理计算位宽。
4. **Occupancy 与 Batch Size**：增大 Batch Size 可以提高 SM 的 Occupancy，让 SM 在等待显存时切换执行其他请求的 Warp，从而隐藏延迟，提高吞吐量。但 Batch Size 受限于 HBM 容量和 SM 内部寄存器数量。

---

## FAQ

**Q1: CUDA Core 和 Tensor Core 能同时工作吗？**
**A:** 可以。SM 内部的调度器可以同时派发指令给 CUDA Core 和 Tensor Core。在 LLM 推理中，通常利用 Tensor Core 进行大规模矩阵乘法，同时利用 CUDA Core 并行执行标量逻辑或索引计算。这种指令级并行（ILP）是 CUDA 编程优化的关键点。

**Q2: 为什么不能把所有显存都做成 Shared Memory？**
**A:** 物理限制与成本。Shared Memory 本质是 SRAM（静态随机存取存储器），速度快但密度低、功耗高、造价极其昂贵。而 HBM 是 DRAM（动态随机存取存储器），密度高、相对便宜。芯片上只能集成几十 MB 的 SRAM，却可以堆叠 80 GB 的 HBM。这种金字塔式的存储层级是计算机体系结构中平衡速度、容量和成本的必然选择。

**Q3: 增加 SM 数量一定能线性提升 LLM 推理速度吗？**
**A:** 不一定。如果 LLM 模型很小，或者 Batch Size 为 1（单请求推理），此时计算量不足以填满所有 SM 的并发槽位，增加 SM 数量没有意义。此外，如果瓶颈在 HBM 带宽上，即使有再多 SM 也会因为拿不到数据而空转。这就是为什么小模型推理更看重显存带宽而非纯算力。

**Q4: 同一个 SM 内的线程如何进行数据同步？**
**A:** 同一个 SM 内的线程属于同一个 Thread Block。CUDA 提供了 `__syncthreads()` 函数，用于在 Block 级别进行栅栏同步。这要求所有线程必须等待彼此到达该指令点后才能继续执行。这种同步机制依赖于 SM 内部的共享内存和硬件同步原语，跨 SM（跨 Block）的同步则无法通过此机制直接实现。

**Q5: LLM 推理中，Shared Memory 通常用来存什么？**
**A:** 在 LLM 推理的典型算子（如 FlashAttention）中，Shared Memory 主要用于缓存 Q、K、V 矩阵的分块。通过将大矩阵切分成小块从 HBM 加载到 Shared Memory，然后让 Tensor Core 高速读取这些小块进行计算，计算结果再写回 HBM。这种分块策略极大地减少了 HBM 的重复访问次数。

---

## 参考资料

1. **NVIDIA Hopper Architecture In-Depth** (NVIDIA 官方白皮书，详细描述了 H100 的 GPC/SM 结构与 Tensor Core 进化)
2. **CUDA C++ Programming Guide** (NVIDIA 官方文档，关于 Thread Block, Warp, Shared Memory 的权威定义)
3. **Dissecting the NVIDIA Turing T4 GPU** (AnandTech 硬件分析，深入微观架构的优质材料)
4. **Programming Massively Parallel Processors (第 4 版)** (David B. Kirk & Wen-mei W. Hwu，建立 GPU 硬件直觉的经典教材)

---

## 📋 本日知识点清单

- [ ] GPU → GPC → SM 的层次结构
- [ ] SM (Streaming Multiprocessor) 的组成：CUDA Cores、Tensor Cores、Registers、Shared Memory、L1 Cache
- [ ] CUDA Core vs Tensor Core 的区别
- [ ] GPC (Graphics Processing Cluster) 的角色
- [ ] L2 Cache 与 HBM/VRAM
- [ ] SM 是理解所有后续概念（Kernel、Warp、Occupancy）的基础

## 📝 实践练习

画出 NVIDIA GPU 的完整硬件结构图，标注 SM 内部所有组件。

---

*本文是「GPU → LLM Inference」30 天学习计划的一部分。学习路线：GPU 硬件 → CUDA 执行模型 → 显存/带宽 → Kernel → Attention → KV Cache → 并行策略 → 推理性能。*
