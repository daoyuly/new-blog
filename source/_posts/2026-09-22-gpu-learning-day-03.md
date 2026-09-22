---
title: "GPU 学习日报 Day 3：CUDA 执行模型：Grid、Block、Warp 与 Thread"
date: 2026-09-22 10:00:00
tags:
  - CUDA
  - Grid
  - Block
  - Warp
  - Thread
  - SIMT
categories:
  - GPU → LLM Inference 学习计划
  - Week 1 建立 GPU 心智模型
description: "Day 3/30 | CUDA Execution Model | CUDA 执行模型：Grid、Block、Warp 与 Thread。30 天从 GPU 硬件到 LLM 推理性能的深度学习计划。"
keywords: "GPU, CUDA, LLM, Inference, CUDA Execution Model, CUDA, Grid, Block, Warp, Thread, SIMT"
author: OpenClaw GPU Learning
---

# GPU 学习日报 Day 3：CUDA 执行模型：Grid、Block、Warp 与 Thread

> **30 天学习计划** | Week 1 - 建立 GPU 心智模型 | Day 3/30
> 
> **今日主题**: CUDA Execution Model

---

# CUDA 执行模型：Grid、Block、Warp 与 Thread

> **核心结论（先记住这一段）**：CUDA 程序在 GPU 上不是“一次跑一个线程”，而是把几百万个线程（Thread）组织成**线程块（Block）**，Block 再组成**网格（Grid）**；硬件真正调度执行的最小单位是**线程束（Warp）**——通常 32 个 Thread 捆在一起，以 **SIMT（Single Instruction, Multiple Threads，单指令多线程）** 方式执行同一条指令。写 CUDA 代码时，你面对的是 Grid/Block/Thread 的逻辑层次；GPU 硬件运行时，面对的是 Warp 的物理调度。**理解这两套视角的映射关系，是理解一切 GPU 性能现象（占有率、分支发散、Shared Memory 效率）的钥匙。**

---

## 一、背景与动机：为什么必须学执行模型

如果你把 GPU 想象成“有很多核的 CPU”，你一定会写出很慢的 CUDA 程序。

CPU 的执行模型是：少量复杂的核，每个核独立执行自己的指令流（SISD/SMT），擅长分支和串行逻辑。GPU 完全相反：**用一套指令控制电路，驱动成千上万个数据通道同时工作**。这个“一套指令、多份数据各自执行”的设计，就是 SIMT。

不理解执行模型的后果是具体的、可量化的：

- 你写的 `if/else` 分支会让同一个 Warp 内的线程串行执行两条路径，性能直接腰斩；
- 你把 Block 尺寸设为 17、19 这类“顺手”的数字，会导致资源利用率低下；
- 你看不到为什么核函数（Kernel）只跑到理论峰值的 20%。

而这些理解，在 LLM 推理时代更加重要：LLM 推理本质上就是“用 GPU 极限并行度做大规模矩阵乘法”，Transformer 的每一层 GEMM、Attention、Softmax 都是 CUDA 执行模型的直接体现。不懂 Warp 和 Block，就看不懂为什么 Decode 阶段是 Memory-Bound、为什么 GEMM 要分 Tile。

下面我们从底层往上，逐层建立因果链。

---

## 二、核心内容：从 Thread 到 Grid 的四层结构

### 2.1 Thread（线程）：最基本的执行单位

**Thread（线程）** 是 CUDA 中最基本的执行单位，对应核函数中**一次完整的函数调用实例**。

当你写：

```cuda
__global__ void vecAdd(float* a, float* b, float* c, int n) {
    int i = blockIdx.x * blockDim.x + threadIdx.x;
    if (i < n) c[i] = a[i] + b[i];
}
```

这段代码本身只写了一份逻辑，但 Kernel Launch 时你会说：“我要启动 N 个线程，每个线程各自执行这份代码。” 每个线程通过硬件提供的内置变量知道“我是谁”：

| 内置变量 | 含义 | 说明 |
|---|---|---|
| `threadIdx.x/y/z` | 线程在 Block 内的坐标 | 三维，方便映射矩阵/张量 |
| `blockIdx.x/y/z` | Block 在 Grid 内的坐标 | 三维 |
| `blockDim.x/y/z` | 每个 Block 的尺寸 | 你启动时指定的 |
| `gridDim.x/y/z` | Grid 的尺寸 | 你启动时指定的 |

关键物理直觉：**Thread 不是操作系统意义上的线程**。CPU 线程切换需要保存/恢复寄存器上下文，代价是微秒级；CUDA 的“线程”只是寄存器状态的一份数据，创建和切换由硬件近乎零成本完成——因为根本不“切换”，而是一起执行。这就是 GPU 能承载百万级线程的原因。

### 2.2 Warp（线程束）：硬件真正调度的单位

**Warp（线程束）** 是 GPU 硬件调度的最小单位，**通常由 32 个连续编号的 Thread 组成**（`threadIdx.x` 相邻的 32 个）。

这 32 个线程**严格锁步（Lock-step）执行同一条指令**，各有各的寄存器数据和程序计数器——这就是 SIMT：Single Instruction, Multiple Threads。

为什么是 32？因为硬件设计。一个 Warp 的指令由一个**指令发射单元**发给 32 个并行的运算通道（CUDA Core），一套取指、译码、调度电路服务 32 个运算单元，**控制电路的成本被 32 路摊薄**。这是 GPU 能同时塞下这么多算力的根本原因——不是核多，而是控制逻辑被极致复用。

SIMT 带来的第一个性能陷阱：**分支发散（Branch Divergence）**。

```cuda
if (threadIdx.x % 2 == 0) { /* 路径 A */ }
else                      { /* 路径 B */ }
```

假设一个 Warp 内一半线程走 A、一半走 B。硬件没有“部分执行”的能力，它会**先执行 A 路径（B 侧线程被掩码禁用），再执行 B 路径**——串行执行两条路径。最坏情况：32 个线程各走不同分支，性能退化为原来的 1/32。

第二个陷阱：**Warp 内合并访存（Memory Coalescing）**。Warp 的 32 个线程同时访问内存时，如果地址连续，硬件合并成少量大事务；如果地址散乱，就拆成 32 个独立事务，内存带宽利用率暴跌。

第三个陷阱：**占用率（Occupancy）**。SM 上同时驻留的 Warp 数量决定了延迟掩盖能力——当某个 Warp 等待内存返回时，调度器立刻切换到另一个就绪的 Warp 执行。GPU 没有大的每核缓存来隐藏延迟，靠的就是“Warp 多到总有活干”。

### 2.3 Block（线程块）：协作与共享的边界

**Block（线程块）** 是一组 Thread 的逻辑容器，也是**协作的基本边界**。

Block 的两个关键能力：

1. **共享内存（Shared Memory）**：每个 Block 拥有一块片上高速存储（现代架构约 48~228 KB/SM），Block 内所有线程可访问，延迟远低于全局内存（约几十周期 vs 几百周期）。
2. **同步（Synchronization）**：`__syncthreads()` 是 Block 级 Barrier，Block 内所有线程到达后才能继续。因为 Block 内线程**可能分布在多个 Warp 上**，需要硬件 Barrier 机制协调。

为什么 Block 之间不能同步？**物理原因**：Block 在 Launch 时被分配到某个 SM（流式多处理器）上，其 Shared Memory 是该 SM 的物理资源。不同的 Block 可能在不同 SM 上，甚至不同时间启动——GPU 不保证它们同时存活，所以不提供 Grid 级同步原语（跨 Block 协作通常靠 Atomic 操作或多次 Kernel Launch）。

这就引出一条重要的设计因果链：**你想共享数据 → 必须放进同一个 Block → Block 大小影响共享内存需求 → 影响 SM 能驻留多少 Block → 影响占用率**。Block 尺寸的常见选择是 128/256/512（即 4/8/16 个 Warp），太小则同步开销占比高，太大则驻留 Block 数受限。

### 2.4 Grid（网格）：一次 Kernel Launch 的全貌

**Grid（网格）** 是一次 Kernel Launch 生成的所有 Block 的集合，代表**一个逻辑上完整的并行任务**。

三层结构的职责划分非常清晰：

| 层次 | 组织者 | 资源 | 通信/同步能力 |
|---|---|---|---|
| Thread | 你 | 私有寄存器、Local Memory | 无 |
| Warp | 硬件 | 32 个锁步线程 | 天然同步（锁步） |
| Block | 你（Launch 配置） | Shared Memory、SM 资源 | `__syncthreads()`、共享变量 |
| Grid | 你（Launch 配置） | 全局内存 | 原子操作、（不保证顺序的）弱同步 |

Kernel Launch 语法把 Grid 和 Block 的维度声明出来：

```cuda
// 第二个参数是 Block 尺寸，第一个参数是 Grid 尺寸（以 Block 数计）
vecAdd<<<numBlocks, blockSize>>>(d_a, d_b, d_c, n);
```

### 2.5 SIMT 到底是什么意思

**SIMT（Single Instruction, Multiple Threads，单指令多线程）** vs **SIMD（Single Instruction, Multiple Data，单指令多数据）**，一字之差，设计哲学不同：

| 维度 | SIMD（如 AVX-512） | SIMT（CUDA） |
|---|---|---|
| 编程抽象 | 显式向量寄存器，手动打包数据 | 标量编程，每个线程写自己的逻辑 |
| 分支处理 | 掩码需程序员手动管理 | 硬件自动掩码 + 自动串行化发散分支 |
| 寄存器 | 向量寄存器（如 512-bit） | 每线程独立标量寄存器堆 |
| 灵活性 | 数据必须规整对齐 | 允许一定程度的发散（代价是性能） |

一句话：**SIMD 是你围着硬件转，SIMT 是硬件围着你转**。CUDA 程序员写的是“一个线程做什么”，硬件自动把 32 个这样的线程捆成 Warp 批量执行。这也是 CUDA 比 OpenCL/裸 SIMD 更容易上手的根本原因。

### 2.6 Kernel → Grid → Block → Warp → Thread 的完整映射

启动一个 Kernel 时发生的事，可以画成这样一张映射图（以 `blockDim=(256)`、`gridDim=(4)` 为例）：

```
Kernel Launch:  vecAdd<<<4, 256>>>(...)
                          │
        ┌─────────────────┼─────────────────┐
        ▼                 ▼                 ▼
   ┌─────────┐       ┌─────────┐       ┌─────────┐
   │Block #0 │  ...  │Block #2 │  ...  │Block #3 │   Grid: 4 Blocks
   └────┬────┘       └────┬────┘       └─────────┘
        │ 分配到某个 SM     │
   ┌────┴──────────┐      ▼
   ▼               ▼   ┌──────────────────────────┐
┌───────┐    ┌───────┐│ SM (流式多处理器)          │
│Warp 0 │ ... │Warp 7 ││  ├─ Shared Memory        │
│T0-T31 │    │T224-255│  ├─ 寄存器文件             │
└───────┘    └───────┘│  └─ Warp 调度器 ×4        │
   Block 内 256 线程    └──────────────────────────┘
   = 8 个 Warp
```

现在回到实践练习中的表达式：

```cuda
int i = blockIdx.x * blockDim.x + threadIdx.x;
```

逐项拆解因果：

- `blockDim.x = 256`：每个 Block 管 256 个连续元素；
- `blockIdx.x`：我是第几个 Block；
- `blockIdx.x * blockDim.x`：我的 Block 负责的数据段的**起始下标**；
- `+ threadIdx.x`：加上我在 Block 内的偏移。

举例：`blockIdx.x = 2, threadIdx.x = 5` → `i = 2*256 + 5 = 517`。整个 Grid 覆盖下标 `[0, 1023]`，无遗漏、无重叠。**这个“块基址 + 块内偏移”的模式是所有 CUDA 索引计算的母体**，二维版本是 `row = blockIdx.y * blockDim.y + threadIdx.y`，多维矩阵、Tile 划分都是它的变形。

```
一维数据映射示意（blockDim = 4）:
数据:   [ 0][ 1][ 2][ 3] [ 4][ 5][ 6][ 7] [ 8][ 9][10][11]
        └── Block 0 ──┘  └── Block 1 ──┘  └── Block 2 ──┘
          T0 T1 T2 T3     T0 T1 T2 T3      T0 T1 T2 T3
          = 1 Warp        = 1 Warp         = 1 Warp
```

---

## 三、实践练习与思考题

**练习 1**：`gridDim = (32), blockDim = (128)`，线程 `threadIdx.x = 37, blockIdx.x = 10` 处理的全局下标是多少？（答：10×128+37 = 1317；该 Block 含几个 Warp？答：128/32 = 4 个）

**练习 2**：数组长度 n = 10000，`blockDim = 256`，Grid 应该开多大？为什么核函数里还需要 `if (i < n)`？（答：`ceil(10000/256) = 40` 个 Block，共 10240 线程 > 10000，越界线程必须被条件守卫掉）

**思考题 1**：为什么 `blockDim` 不是 32 的倍数时（如 100），会造成硬件资源浪费？
**思考题 2**：如果 Block 内所有线程都走同一个分支，SIMT 有性能损失吗？
**思考题 3**：为什么 `__syncthreads()` 放在 `if` 内部且部分线程不进入时会死锁？（提示：Barrier 等待的是 Block 全体）

---

## 四、与 LLM Inference 的关联

这套执行模型直接决定了 LLM 推理的每一个性能决策：

1. **GEMM 的 Tile 划分就是 Block 划分**。矩阵乘法被切成 Tile，每个 Block 计算输出矩阵的一个子块，并把输入 Tile 从全局内存加载进 Shared Memory 复用——这正是 Block “可共享内存”能力的教科书应用。Prefill 阶段（大量并行 GEMM）之所以能打满 GPU 算力，靠的就是 Tile 化产生足够多的 Block。

2. **Decode 阶段为什么是 Memory-Bound？** 生成每个 token 时，batch 小、每个权重只用一次，GEMM 退化成 GEMV——线程级并行度不足，Grid 里塞不满 Block/SM，Warp 数量不够掩盖内存延迟。这就是为什么连续批处理（Continuous Batching）、推测解码都要想办法“制造更多并行工作”。

3. **Kernel Fusion 的动机**。多次 Kernel Launch 意味着多次 Grid 生命周期，中间结果写回全局内存再读出。Fusion 把多个操作放进一个 Kernel，数据留在 Shared Memory/寄存器里——本质是在 Block 协作边界内榨取带宽。

4. **分支发散在推理中的体现**。Attention 中不同 Query 长度不同（变长序列处理）时，padding 或条件分支会引发 Warp 发散；好的推理引擎（如 PagedAttention 的实现）会精心安排数据布局让 Warp 内访问对齐、分支一致。

一句话总结：**LLM 推理优化的很多“玄学”，回到 Warp 和 Block 的物理约束后都是必然。**

---

## 五、FAQ

**Q1：Warp 大小为什么是 32，能改吗？**
不能通过程序修改，是硬件常量。NVIDIA 传统架构为 32；AMD 的对应概念是 Wavefront（64）。新架构上虽然引入了独立线程调度等改进，但 32 仍是 Warp 的组织粒度，写代码时应始终按 32 对齐。

**Q2：Block 里的线程一定在同一个 SM 上吗？**
是的。Block 是原子调度单位，Launch 时整体分配给一个 SM，其 Shared Memory 也绑定在该 SM 上。所以 Block 太大（线程多、共享内存需求大）时，SM 能驻留的 Block 数变少，占用率下降。

**Q3：`__syncthreads()` 是怎么实现的？为什么 Grid 级没有对应物？**
`__syncthreads()` 是 SM 硬件 Barrier：所有线程到达计数达标后统一放行。Grid 级没有，因为 Block 分散在不同 SM 上且启动/结束时间不保证一致，硬件无法低成本保证全局到达。跨 Block 协作需用原子操作、Cooperative Groups 的特殊机制，或干脆拆成多次 Kernel Launch（Launch 之间天然全 Grid 同步）。

**Q4：线程数超过 GPU 能“同时执行”的数量怎么办？**
没关系，这正是设计的一部分。GPU 上千个 CUDA Core 同时执行的是千级线程，但一个 Kernel 可以有百万级线程。多余的 Warp 驻留在 SM 中等待调度，调度器在 Warp 阻塞（如等内存）时快速切换——靠这种超订阅来掩盖延迟。

**Q5：怎么选择 Block 大小？有经验法则吗？**
从 128 或 256（即 4~8 个 Warp）起步，是 32 的倍数；然后根据 Shared Memory 使用量、寄存器占用和实际 profile（Nsight Compute）调整。没有万能值，但“不是 32 的倍数”几乎一定是错的。

---

## 六、参考资料

1. NVIDIA CUDA C++ Programming Guide — Execution Model 章节（docs.nvidia.com）
2. NVIDIA CUDA C++ Best Practices Guide — Occupancy 与分支发散章节
3. CUDA Parallel Computing Platform 官方文档：Hardware Implementation（Warp 调度机制）
4. 《Programming Massively Parallel Processors》（PMPP，第 4 版），Hwu, Kirk, El Hajj — 第 2~4 章为本文内容的经典出处
5. NVIDIA Developer Blog: "Cooperative Groups" 与 "CUDA Math Kernel Tuning" 系列文章

---

## 📋 本日知识点清单

- [ ] Thread → Warp → Block → Grid 的层次结构
- [ ] Thread 是最基本的执行单位
- [ ] Warp：通常 32 个 Thread 一组，SIMT 执行
- [ ] Block：可共享 Shared Memory、可同步
- [ ] Grid：一次 Kernel Launch 的全部 Block
- [ ] SIMT 到底是什么意思
- [ ] Kernel → Grid → Block → Warp → Thread 的完整映射

## 📝 实践练习

解释 blockIdx.x * blockDim.x + threadIdx.x 的含义，画图展示 Thread 到 Grid 的映射。

---

*本文是「GPU → LLM Inference」30 天学习计划的一部分。学习路线：GPU 硬件 → CUDA 执行模型 → 显存/带宽 → Kernel → Attention → KV Cache → 并行策略 → 推理性能。*
