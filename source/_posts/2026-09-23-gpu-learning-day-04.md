---
title: "GPU 学习日报 Day 4：第一个 CUDA Kernel：从向量加法理解线程索引"
date: 2026-09-23 10:00:00
tags:
  - CUDA
  - Kernel
  - 编程入门
  - 线程索引
categories:
  - GPU → LLM Inference 学习计划
  - Week 1 建立 GPU 心智模型
description: "Day 4/30 | CUDA Kernel 编程入门 | 第一个 CUDA Kernel：从向量加法理解线程索引。30 天从 GPU 硬件到 LLM 推理性能的深度学习计划。"
keywords: "GPU, CUDA, LLM, Inference, CUDA Kernel 编程入门, CUDA, Kernel, 编程入门, 线程索引"
author: OpenClaw GPU Learning
---

# GPU 学习日报 Day 4：第一个 CUDA Kernel：从向量加法理解线程索引

> **30 天学习计划** | Week 1 - 建立 GPU 心智模型 | Day 4/30
> 
> **今日主题**: CUDA Kernel 编程入门

---

# 第一个 CUDA Kernel：从向量加法理解线程索引

**核心结论（先记住这三句话）：** CUDA 并行编程的本质是“用一个数学公式给百万级线程分配唯一工号”。这个公式就是 `int i = blockIdx.x * blockDim.x + threadIdx.x`，它是所有 CUDA 程序的地基。向量加法（Vector Addition）`C[i] = A[i] + B[i]` 是理解这套机制的最佳入门案例——因为它足够简单，简单到每个线程只需处理一个元素，你能清晰地看到“线程”和“数据”之间的一一映射。搞懂今天的内容，你就理解了 LLM 推理框架中一切 GPU Kernel 的组织方式。

---

## 一、背景与动机：为什么第一个 Kernel 是向量加法？

假设你有一个 100 万元素的数组要做加法。CPU 上一个循环要跑 100 万次迭代；GPU 上你可以“雇佣”100 万个线程，每个线程只算一个 `C[i] = A[i] + B[i]`，几乎同时完成。

这不是比喻，是 GPU 的物理现实。现代 GPU（如 H100）拥有上万个 CUDA Core，其设计哲学是**吞吐量优先（Throughput-oriented）**：与其用少数几个超强核心快速完成一个任务，不如用海量简单核心同时完成海量任务。

但海量线程立刻带来一个问题：**第 3742 号线程应该处理数组的哪个元素？** 线程不会自动知道自己的身份和任务。你必须亲手算给它。这就是今天的主角——**线程全局索引（Global Thread Index）**。

学习路径的因果链是这样的：

1. 你要先知道 CUDA 给了你哪些“身份变量”（threadIdx、blockIdx 等）
2. 然后用它们拼出全局索引公式
3. 再学会如何“启动”一场由成千上万线程组成的运算（Kernel Launch）
4. 最后打通 CPU 内存与 GPU 内存之间的数据搬运

掌握这条链，你就掌握了所有 CUDA Kernel 的通用骨架——从向量加法到 GPT 的注意力计算，骨架完全相同。

---

## 二、核心内容

### 2.1 CUDA 的线程组织：网格、块、线程（Grid / Block / Thread）

**中英命名：** 网格（Grid）、线程块（Block）、线程（Thread）。

CUDA 把线程组织成一个**两级层次结构**，这是理解一切的起点：

```
Grid（网格）: 本次 Kernel 启动的全部线程
├── Block (0,0,0)          ← 线程块，是调度的基本单位
│   ├── threadIdx.x = 0
│   ├── threadIdx.x = 1
│   └── ... (共 blockDim.x 个线程)
├── Block (1,0,0)
│   ├── threadIdx.x = 0    ← 注意：每个块内的编号都从 0 重新开始！
│   └── ...
└── Block (2,0,0)
    └── ...
```

四个核心变量的含义（用“小区-楼栋-房间”类比）：

| 变量 | 英文 | 含义 | 类比 |
|---|---|---|---|
| `threadIdx` | Thread Index | 线程在**块内**的编号 | 房间号 |
| `blockIdx` | Block Index | 块在**网格内**的编号 | 楼栋号 |
| `blockDim` | Block Dimension | **每个块内**有多少线程 | 每栋楼有几户 |
| `gridDim` | Grid Dimension | **网格里**有多少个块 | 小区有几栋楼 |

三个关键事实，请刻进脑子：

1. **这四个变量都是三维的**（有 `.x / .y / .z` 三个分量），因为 GPU 天生面向二维图像和矩阵。今天我们只用一维。
2. **`threadIdx` 在每个块内独立从 0 开始计数**。这就是为什么必须有 `blockIdx` 参与——否则 100 个块里的线程全是“0 号”，无法区分。
3. **`blockDim` 和 `gridDim` 是运行时才确定的**，由启动参数 `<<<>>>` 决定，Kernel 代码里不需要硬编码。

**为什么分块而不是一条平铺的线程队列？** 因果链是：块是 GPU 调度和共享内存的基本单位——同一个块内的线程可以被捆绑调度到同一个 SM（流式多处理器）上，共享一块高速片上内存，还能协同同步。没有块结构，这些优化都无从谈起。

### 2.2 全局索引公式：`i = blockIdx.x * blockDim.x + threadIdx.x`

这是全文最重要的一行代码。它做的事情只有一件：**把两级局部编号换算成一个全局唯一的一维编号**。

数学直觉：类比十进制。一个数 = 高位 × 进制 + 低位。这里：

- `blockIdx.x` 是“高位”（第几个块）
- `blockDim.x` 是“进制”（每块容纳多少线程）
- `threadIdx.x` 是“低位”（块内偏移）

假设 `blockDim.x = 256`，即每个块 256 个线程：

```
Block 0:  threadIdx 0~255    → 全局 i = 0*256 + tid =    0 ~  255
Block 1:  threadIdx 0~255    → 全局 i = 1*256 + tid =  256 ~  511
Block 2:  threadIdx 0~255    → 全局 i = 2*256 + tid =  512 ~  767
Block b:  ...                → 全局 i = b*256 + tid
```

验证唯一性：对任意全局 i，`i / blockDim.x` 唯一确定块号，`i % blockDim.x` 唯一确定块内编号——这是一个**双射（Bijection）**，不重不漏。这就是这个公式优雅的地方：它本质是把二维坐标（块号，块内偏移）线性化为一维地址。

**边界检查是新手第一坑。** 线程总数往往不能被 block size 整除。例如 100 万元素、每块 256 线程，需要 `ceil(1000000/256) = 3907` 个块，共 1000,192 个线程——多出 192 个“多余线程”。所以 Kernel 里必须写：

```cuda
if (i < n) {   // 边界检查：多余线程直接退出
    C[i] = A[i] + B[i];
}
```

漏掉这行，多余的线程会读写越界内存，程序轻则结果错误、重则崩溃，而且这类 bug 往往是静默的。

### 2.3 `__global__` 修饰符：Kernel 函数从哪里来，到哪里去

**中英命名：** Kernel（核函数）、`__global__` 修饰符、Host（主机，指 CPU 侧）、Device（设备，指 GPU 侧）。

```cuda
__global__ void vectorAdd(const float* A, const float* B, float* C, int n) {
    int i = blockIdx.x * blockDim.x + threadIdx.x;
    if (i < n) C[i] = A[i] + B[i];
}
```

`__global__` 告诉编译器（NVCC）：这个函数**在 GPU 上执行，但从 CPU 侧调用**。CUDA 一共有三个函数空间修饰符，用表格对比：

| 修饰符 | 在哪执行 | 从哪调用 | 典型用途 |
|---|---|---|---|
| `__global__` | Device (GPU) | Host（也可 Device，动态并行） | Kernel 入口 |
| `__device__` | Device (GPU) | Device only | Kernel 内部调用的辅助函数 |
| `__host__` | Host (CPU) | Host only | 普通 C++ 函数（默认） |

两个隐藏约束值得知道：

1. `__global__` 函数的**返回值必须是 `void`**。因为它是异步启动的——CPU 扔出任务后立刻返回继续干别的，没人接收返回值。想拿到结果？写到显存里去。
2. Kernel 内**不能直接解引用 CPU 指针**。CPU 指针指向的内存 GPU 看不见，反之亦然（在没有统一内存 UVM 的普通用法下）。这引出下一个知识点。

### 2.4 Kernel Launch 语法：`<<<blocks, threads>>>`

这是 CUDA 独有的启动语法，也常被称为**执行配置（Execution Configuration）**：

```cuda
vectorAdd<<<numBlocks, blockSize>>>(d_A, d_B, d_C, n);
```

尖括号里的两个参数：

- 第 1 个：**Grid 中有多少个 Block**
- 第 2 个：**每个 Block 中有多少个 Thread**

一维情形下，总线程数 = `numBlocks × blockSize`。经典计算方式：

```cuda
int blockSize = 256;                                // 每块线程数
int numBlocks = (n + blockSize - 1) / blockSize;    // 向上取整
vectorAdd<<<numBlocks, blockSize>>>(d_A, d_B, d_C, n);
```

`(n + blockSize - 1) / blockSize` 是整数向上取整的标准写法，等价于 `ceil(n / blockSize)`，避免了浮点误差。配上前面的 `if (i < n)`，多余线程安全空转。

**block size 取多少？** 这是实践练习的核心。直觉是“越大越好”，但真实约束是：每个块最多 1024 个线程（硬件限制），且块是调度到 SM 上的——block size 太小，SM 上驻留的线程太少，无法隐藏内存延迟（GPU 靠海量线程切换来掩盖访存等待，这叫**延迟隐藏，Latency Hiding**）；太大则寄存器不够分配。对向量加法这类简单 Kernel，128~512 都是合理起点，实践中**用实验说话，不靠猜**。

还有一个易被忽略的事实：**Kernel 启动是异步的**。CPU 执行到 `vectorAdd<<<...>>>` 这一行时立刻返回，不等 GPU 算完。这既是性能利器（CPU/GPU 流水线），也是新手坑（必须在下一步 `cudaMemcpy` 处隐式同步，或显式 `cudaDeviceSynchronize()` 后才能安全读取结果）。

### 2.5 内存管理三件套：cudaMalloc、cudaMemcpy、cudaFree

**中英命名：** 显存（Device Memory / VRAM）、主机内存（Host Memory）、 PCIe 总线（PCIe Bus）。

CPU 和 GPU 各有独立的物理内存。Kernel 只能读写显存，所以完整的向量加法流程是一条“搬运流水线”：

```
Host 内存 (A, B) ──cudaMemcpy(H2D)──▶ Device 显存 (d_A, d_B)
                                            │
                                    vectorAdd<<<...>>> 在 GPU 上计算
                                            │
Host 内存 (C)    ◀──cudaMemcpy(D2H)──  Device 显存 (d_C)
```

```cuda
float *h_A, *h_B, *h_C;              // h_ 前缀 = host
float *d_A, *d_B, *d_C;              // d_ 前缀 = device

size_t bytes = n * sizeof(float);
h_A = (float*)malloc(bytes);  /* ... 初始化 h_A, h_B ... */

cudaMalloc(&d_A, bytes);             // 在显存上分配
cudaMalloc(&d_B, bytes);
cudaMalloc(&d_C, bytes);

cudaMemcpy(d_A, h_A, bytes, cudaMemcpyHostToDevice);  // H2D
cudaMemcpy(d_B, h_B, bytes, cudaMemcpyHostToDevice);
cudaMemcpy(d_C, h_C, bytes, cudaMemcpyDeviceToHost);  // D2H，隐式同步

cudaFree(d_A); cudaFree(d_B); cudaFree(d_C);          // 释放显存
```

关键认知：**数据搬运往往比计算更贵**。PCIe 4.0 带宽约 32 GB/s，而 H100 的 HBM 带宽超过 3 TB/s——差 100 倍。对向量加法来说，搬运 12 MB（3 个数组各 4 MB）的时间远超计算时间。这个“搬运比计算贵”的现象，是 GPU 编程永恒的主题，叫 **Roofline 思维**：先问这个 Kernel 是计算受限（Compute-bound）还是访存受限（Memory-bound）。

工程习惯：CUDA API 都返回 `cudaError_t`，生产代码必须检查（或用宏封装），否则显存分配失败会静默传导成后续 Kernel 的诡异崩溃。

### 2.6 完整代码：把六块拼图合在一起

```cuda
#include <cstdio>
#include <cuda_runtime.h>

__global__ void vectorAdd(const float* A, const float* B, float* C, int n) {
    int i = blockIdx.x * blockDim.x + threadIdx.x;   // 全局索引
    if (i < n) {
        C[i] = A[i] + B[i];                          // 每线程处理一个元素
    }
}

int main() {
    const int N = 1 << 20;                           // 1M 元素
    size_t bytes = N * sizeof(float);

    // 1. Host 内存分配与初始化
    float *h_A = (float*)malloc(bytes);
    float *h_B = (float*)malloc(bytes);
    float *h_C = (float*)malloc(bytes);
    for (int i = 0; i < N; i++) { h_A[i] = 1.0f; h_B[i] = 2.0f; }

    // 2. Device 显存分配
    float *d_A, *d_B, *d_C;
    cudaMalloc(&d_A, bytes);
    cudaMalloc(&d_B, bytes);
    cudaMalloc(&d_C, bytes);

    // 3. 数据上卡 (H2D)
    cudaMemcpy(d_A, h_A, bytes, cudaMemcpyHostToDevice);
    cudaMemcpy(d_B, h_B, bytes, cudaMemcpyHostToDevice);

    // 4. 启动 Kernel：4096 个块 × 256 线程 = 1,048,576 线程
    int blockSize = 256;
    int numBlocks = (N + blockSize - 1) / blockSize;
    vectorAdd<<<numBlocks, blockSize>>>(d_A, d_B, d_C, N);

    // 5. 结果下卡 (D2H)，隐式等待 Kernel 完成
    cudaMemcpy(h_C, d_C, bytes, cudaMemcpyDeviceToHost);

    // 6. 验证与清理
    printf("h_C[0]=%f h_C[N-1]=%f\n", h_C[0], h_C[N-1]);  // 应为 3.0
    cudaFree(d_A); cudaFree(d_B); cudaFree(d_C);
    free(h_A); free(h_B); free(h_C);
    return 0;
}
```

编译与运行：`nvcc vector_add.cu -o vector_add && ./vector_add`

---

## 三、实践练习与思考题

**练习 1（必做）：** 运行上面的代码，验证结果。然后把 `blockSize` 分别改为 32、64、256、1024，用 `nvprof ./vector_add`（新版本为 `nsys profile` 或 `ncu`）记录 Kernel 耗时，填一张对比表。

**练习 2（思考）：** 当 `blockSize` 改变时，`numBlocks` 如何变？总线程数变吗？Kernel 代码需要改吗？（答案：不需要——这正是 `blockDim` 作为运行时变量的意义，Kernel 对启动配置完全无感。）

**练习 3（进阶）：** 故意删掉 `if (i < n)`，把 N 设为 1,000,001（blockSize=256），观察会发生什么（可能静默出错或报 `cudaErrorIllegalAddress`——用 `cudaGetLastError()` 抓一下）。

**思考题：** 如果 `blockSize = 1`（一个块一个线程），程序结果还对吗？性能会怎样？（提示：退化为 100 万个单线程块，结果正确，但调度开销和延迟隐藏能力急剧恶化——想想为什么。）

---

## 四、与 LLM Inference 的关联

你可能觉得向量加法太玩具，但它是理解 LLM 推理性能的第一块砖：

1. **今天写的公式无处不在。** 打开 vLLM 或 llama.cpp 的源码，几乎所有 Kernel 第一行都是 `int i = blockIdx.x * blockDim.x + threadIdx.x` 的变体。元素级操作（Activation、residual add、RoPE 旋转位置编码、KV Cache 写入）的组织方式与今天的向量加法一模一样——`residual = hidden + attn_out` 就是一个上百万维的向量加法。

2. **Memory-bound 是 LLM 推理的主旋律。** 上面算过：搬运比计算贵。LLM 解码阶段（Decode Phase）每生成一个 token，都要把数十 GB 的模型权重从 HBM 读一遍，而计算量相对很小——**它是典型的访存受限场景**，GPU 算力利用率（MFU）很低。这就是为什么解码速度 ≈ 显存带宽 ÷ 模型大小。理解了“数据搬运是瓶颈”，你就理解了量化、KV Cache、批量推理等所有优化的出发点。

3. **Kernel Launch 的异步性支撑了流水线。** vLLM 的 CUDA Graph、多流（Multi-stream）并行、计算与通信重叠（如 Tensor Parallel 的 all-reduce overlap），本质上都是在利用“Kernel 启动异步 + CPU 可提前调度”这一特性——正是 2.4 节那个看似坑人的细节。

4. **Block size 的调优直觉直接迁移。** LLM 推理框架会针对不同序列长度、不同 batch size 动态选择 Kernel 配置（甚至自动调优，如 Triton 的 autotune）。今天“改变 block size 观察行为”的练习，就是这类自动调优在做的事的微缩版。

**一个明确的判断：** 如果你只能记住本文一件事，记住这个——*LLM 解码慢的根源不是算不动，而是搬不动。* 而理解“搬”与“算”的分工，起点就是今天这个 12 行的向量加法 Kernel。

---

## FAQ

**Q1：`threadIdx` 和 `threadIdx.x` 有什么区别？**
A：`threadIdx` 是一个三维向量结构（`uint3`），包含 `.x`、`.y`、`.z` 三个分量。一维 Kernel 只用 `.x`（此时 `.y`、`.z` 恒为 0）。三维在图像处理（如卷积按 H×W 组织）和矩阵分块中常用。

**Q2：block size 最大是 1024，那 Grid 最多多少个 Block？**
A：x 方向最多 2³¹-1（约 21 亿），y/z 方向各最多 65535。对绝大多数应用来说，Grid 大小实际上不构成限制，瓶颈在 Block 内的 1024 线程上限。

**Q3：Kernel 启动后 CPU 会等它算完吗？**
A：不会。Kernel Launch 是异步的，CPU 立刻继续执行下一行。`cudaMemcpy`（D2H 方向）会隐式同步等待；如需中途同步可调用 `cudaDeviceSynchronize()`。忘记这一点是异步结果错误的头号来源。

**Q4：为什么我的向量加法 GPU 版比 CPU 版还慢？**
A：大概率是数据搬运吃掉了全部收益。数组太小（比如只有几千个元素）时，`cudaMalloc` + 两次 `cudaMemcpy` 的固定开销远超计算节省。GPU 的收益来自规模：数据量和并行度足够大时才划算。另外检查是否用�� Debug 模式编译（加 `-O3`）。

**Q5：`blockIdx.x * blockDim.x + threadIdx.x` 会不会整数溢出？**
A：会，且是真 bug。`blockIdx.x * blockDim.x` 是 `int`（32 位）乘法，当总线程数超过 2³¹-1 时溢出。处理超大数组的 Kernel 应写成 `(size_t)blockIdx.x * blockDim.x + threadIdx.x`。LLM 推理的 KV Cache Kernel 常处理超大索引，实际工程中就是这么写的。

---

## 参考资料

- NVIDIA 官方入门教程：*An Even Easier Introduction to CUDA*（developer.nvidia.com/blog/even-easier-introduction-cuda）—— 官方就是用向量加法做入门案例
- NVIDIA CUDA C++ Programming Guide，Chapter 2: Programming Model（docs.nvidia.com/cuda）—— Grid/Block 层次结构的权威定义
- NVIDIA CUDA Samples：`0_Simple/vectorAdd`（github.com/NVIDIA/cuda-samples）—— 可直接编译运行的官方完整示例
- CUDA C++ Best Practices Guide —— Execution Configuration 优化与 Roofline 思维
- Paulius Micikevicius et al., *Optimizing Parallel Reduction in CUDA*（NVIDIA 演讲稿）—— 理解 Block 组织与性能关系的进阶材料

---

## 📋 本日知识点清单

- [ ] 写第一个 CUDA Kernel：C[i] = A[i] + B[i]
- [ ] threadIdx、blockIdx、blockDim、gridDim 的含义
- [ ] int i = blockIdx.x * blockDim.x + threadIdx.x 的原理
- [ ] Kernel 函数的 __global__ 修饰符
- [ ] Kernel Launch 语法 <<<blocks, threads>>>
- [ ] cudaMalloc、cudaMemcpy、cudaFree 的使用

## 📝 实践练习

编写一个 CUDA Kernel 实现向量加法，改变 block size 观察行为。

---

*本文是「GPU → LLM Inference」30 天学习计划的一部分。学习路线：GPU 硬件 → CUDA 执行模型 → 显存/带宽 → Kernel → Attention → KV Cache → 并行策略 → 推理性能。*
