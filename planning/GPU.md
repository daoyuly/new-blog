如果你的目标是“用一年时间真正深入大模型推理”，那么第一个月学 GPU 是非常合理的。但我建议你不要把它学成传统的“GPU 编程课程”。

你的目标应该是：

> **一个月后，看到一个大模型推理问题，你能够从 GPU 硬件 → CUDA 执行模型 → 显存/带宽 → Kernel → Attention → KV Cache → 并行策略 → 推理性能，建立完整的因果链。**

也就是说，不是“知道 GPU 有 SM、Tensor Core”，而是能够解释：

> 为什么这个模型慢？慢在哪里？是算力瓶颈、显存带宽瓶颈、访存瓶颈、Kernel launch 瓶颈，还是并行度不足？为什么 FlashAttention 有效？为什么 KV Cache 能显著影响长上下文？为什么 BF16/FP8 会改变吞吐？为什么一个 GPU 跑不满？

这才是后面学习 Transformer 推理、vLLM、Tensor Parallel、MoE、Speculative Decoding 的基础。

我建议第一个月按照下面的路径走。

---

# 一、先确定第一个月的学习目标

月底你应该具备 8 个能力：

1. 能解释 CPU 与 GPU 的体系结构差异
2. 能理解 GPU 的 SM、CUDA Core、Tensor Core、Warp、Block、Thread
3. 能理解 CUDA 的执行模型和内存层次
4. 能计算一个模型的大致 FLOPs、显存占用和带宽需求
5. 能写并运行简单 CUDA Kernel
6. 能使用 Nsight / profiling 工具分析 Kernel
7. 能理解 Transformer 推理为什么受到 GPU 架构约束
8. 能从 GPU 层面解释 FlashAttention、KV Cache、量化、Batching 等技术

其中第 4、6、7 是最重要的。

---

# 二、整个一年学习路线

先给你整个一年地图，避免第一个月学偏。

| 月份  | 核心主题                 | 最终目标                                                 |
| --- | -------------------- | ---------------------------------------------------- |
| M1  | GPU                  | 建立硬件 → CUDA → 性能的底层认知                                |
| M2  | Transformer          | 从数学到代码完整理解 Transformer                               |
| M3  | Attention & KV Cache | 深入理解 Attention 推理机制                                  |
| M4  | CUDA Kernel & 算子     | 能读懂/修改核心 CUDA Kernel                                 |
| M5  | LLM Inference        | Prefill / Decode / Continuous Batching               |
| M6  | 推理系统                 | vLLM / SGLang / TensorRT-LLM                         |
| M7  | 并行计算                 | TP / PP / DP / EP / CP                               |
| M8  | Attention 优化         | FlashAttention / PagedAttention / MLA                |
| M9  | Quantization         | INT8 / INT4 / FP8 / MXFP                             |
| M10 | 推理优化                 | Speculative Decoding / Prefix Cache / Disaggregation |
| M11 | 推理系统源码               | vLLM / SGLang / TensorRT-LLM 深入                      |
| M12 | 综合项目                 | 自己做一个简化版 LLM Inference Engine                        |

所以：

**M1 不应该急着学 CUDA C++。**

先建立 GPU 的“心智模型”。

---

# 三、第一个月的总体结构

我建议每天投入：

**1.5～2 小时**

如果你只能每天 1 小时，也可以压缩。

每周结构：

> 理论 40%
> 实验 40%
> 源码/论文 20%

不要变成：

> 看视频 80% + 做笔记 20%

GPU 这个领域，如果不实际跑 Kernel，理解很容易是假的。

---

# Week 1：建立 GPU 心智模型

核心问题：

> **GPU 到底是什么？为什么它适合大模型？**

## Day 1：CPU vs GPU

理解：

* CPU 的设计目标
* GPU 的设计目标
* Latency vs Throughput
* Instruction Level Parallelism
* Thread Level Parallelism
* SIMD / SIMT
* 为什么 GPU 可以拥有大量计算单元
* GPU 为什么不适合所有任务

重点理解：

```text
CPU
少量强大的 Core
        ↓
低延迟
复杂控制流
大 Cache

GPU
大量相对简单的计算单元
        ↓
高吞吐
大量并行
隐藏 Memory Latency
```

然后思考：

> Transformer 为什么天然适合 GPU？

这个问题要自己写一页答案。

---

# Day 2：GPU 基本硬件结构

开始进入 GPU 内部。

重点理解：

```text
GPU
│
├── GPC
│
├── SM
│   ├── CUDA Cores
│   ├── Tensor Cores
│   ├── Registers
│   ├── Shared Memory
│   └── L1 Cache
│
├── L2 Cache
│
└── HBM / VRAM
```

重点搞清：

### SM 是什么？

这是第一个非常重要的概念。

你以后看到：

* CUDA Kernel
* Warp
* Tensor Core
* Occupancy
* Register
* Shared Memory

全部都要回到 SM。

---

# Day 3：CUDA Execution Model

学习：

```text
Grid
 ↓
Block
 ↓
Warp
 ↓
Thread
```

重点理解：

### Thread

最基本执行单位。

### Warp

通常 32 个 Thread 一组执行。

理解：

> SIMT 到底是什么意思？

### Block

Block 中的线程：

* 可以共享 Shared Memory
* 可以同步

### Grid

一次 Kernel Launch 的全部 Block。

最终形成：

```text
Kernel
   ↓
Grid
   ↓
Block
   ↓
Warp
   ↓
Thread
```

这张图必须彻底理解。

---

# Day 4：CUDA Kernel

写第一个 CUDA Kernel。

不要一开始做矩阵乘法。

先做：

```cpp
C[i] = A[i] + B[i]
```

然后理解：

```cpp
threadIdx
blockIdx
blockDim
gridDim
```

最终能够自己解释：

```cpp
int i = blockIdx.x * blockDim.x + threadIdx.x;
```

到底发生了什么。

---

# Day 5：GPU Memory Hierarchy

这是第一个月最重要的内容之一。

必须建立：

```text
Registers
    ↓
Shared Memory
    ↓
L1 Cache
    ↓
L2 Cache
    ↓
HBM / VRAM
```

理解它们的：

* 容量
* 延迟
* 带宽
* 生命周期
* 可见范围
* 使用场景

尤其理解：

> **为什么 GPU Kernel 很多时候不是算得慢，而是数据搬得慢？**

这是理解 LLM inference 的关键。

---

# Day 6：Memory Access

学习：

### Coalesced Memory Access

例如：

```text
Thread 0 → A[0]
Thread 1 → A[1]
Thread 2 → A[2]
...
```

和：

```text
Thread 0 → A[0]
Thread 1 → A[1024]
Thread 2 → A[2048]
...
```

为什么性能完全不同。

理解：

* Memory Coalescing
* Global Memory
* Cache
* Memory Transaction

---

# Day 7：第一周总结

不要继续学习。

做一个实验：

写三个版本：

```text
Vector Add
```

然后改变：

* Thread 数
* Block Size
* Memory Access Pattern

测量：

```text
Latency
Bandwidth
Throughput
```

最终写：

> 《GPU Week1：GPU为什么适合LLM》

控制在 1000～2000 字。

---

# Week 2：GPU 性能模型

第二周开始真正进入“性能工程”。

这一周非常重要。

---

# Day 8：FLOPS

理解：

```text
FLOPS
```

以及：

```text
FLOP
FLOPS
TFLOPS
PFLOPS
```

然后理解：

> 一个 Transformer Layer 到底需要多少计算？

例如矩阵乘法：

```text
A[M,K] × B[K,N]

≈ 2MKN FLOPs
```

这个公式要熟练。

---

# Day 9：Memory Bandwidth

理解：

```text
Memory Bandwidth
```

例如：

```text
HBM
GB/s
TB/s
```

然后思考：

> 为什么一个 GPU 即使标称几十 TFLOPS，也可能跑不满？

因为：

```text
Compute Bound
vs
Memory Bound
```

---

# Day 10：Roofline Model

这是你必须掌握的一个模型。

核心：

```text
Performance
     │
     │          ______ Compute Ceiling
     │         /
     │        /
     │       /
     │      /
     │_____/
           Memory Bandwidth
```

理解：

> Arithmetic Intensity

即：

```text
FLOPs / Bytes
```

然后判断：

```text
Memory Bound
       vs
Compute Bound
```

这套思维以后分析：

* Attention
* KV Cache
* Quantization
* MoE
* GEMM
* Embedding

都会用到。

---

# Day 11：Tensor Core

开始理解 Tensor Core。

重点：

```text
CUDA Core
vs
Tensor Core
```

理解 Tensor Core 为什么专门适合：

```text
Matrix Multiply
```

重点理解：

```text
MMA
```

以及：

* FP32
* FP16
* BF16
* TF32
* FP8
* INT8

不用现在深入每一种格式。

先理解：

> 数据类型为什么直接影响 GPU 推理性能？

---

# Day 12：Mixed Precision

理解：

```text
FP32
↓
FP16 / BF16
↓
FP8
↓
INT8
↓
INT4
```

理解三个维度：

```text
Memory
Compute
Accuracy
```

最终形成：

> Precision 是一种系统级 trade-off，而不仅仅是“压缩模型”。

---

# Day 13：Occupancy

学习：

* Warp
* SM
* Registers
* Shared Memory
* Occupancy

理解：

> 为什么一个 Kernel 即使计算量不大，也可能性能不好？

重点不是背公式，而是理解：

```text
Registers 太多
       ↓
同时运行的 Warp 减少
       ↓
Occupancy 降低
```

---

# Day 14：第二周实验

写一个：

```text
Matrix Multiplication
```

先做 naive version。

然后尝试：

```text
Naive GEMM
↓
Tiled GEMM
↓
Shared Memory
```

观察性能。

最终回答：

> 为什么 Shared Memory 可以加速矩阵乘法？

这是进入 CUDA Kernel 世界的重要实验。

---

# Week 3：从 GPU 进入 LLM

第三周开始把 GPU 知识和你真正的目标连接起来。

这一周非常关键。

---

# Day 15：Transformer 的计算结构

先不深入 Attention 数学。

只看：

```text
Transformer Layer

Input
 ↓
QKV Projection
 ↓
Attention
 ↓
Output Projection
 ↓
MLP
 ↓
Output
```

把每个地方映射到 GPU：

```text
Linear
 → GEMM

Attention
 → Matrix / Memory operations

MLP
 → GEMM

Normalization
 → Elementwise Kernel
```

你开始建立：

> Transformer = 大量 GPU Kernel 的组合

---

# Day 16：LLM Inference 两个阶段

必须彻底理解：

```text
Prefill
Decode
```

例如：

```text
Prompt
 ↓
Prefill
 ↓
KV Cache
 ↓
Token 1
 ↓
Token 2
 ↓
Token 3
 ...
```

重点理解：

### Prefill

特点：

```text
大量 token
并行计算
GEMM 密集
```

### Decode

特点：

```text
一次生成一个 token
Batch 中每个请求长度不同
KV Cache
Memory Access
```

然后开始思考：

> 为什么 Prefill 和 Decode 的性能特征完全不同？

---

# Day 17：KV Cache

这一节非常重要。

理解：

```text
K
V
```

为什么需要 Cache。

然后自己计算：

假设：

```text
L = 32 layers
H = 32 heads
D = 128
Sequence = 8192
dtype = FP16
```

计算：

> 一个请求需要多少 KV Cache？

然后进一步：

```text
1 request
10 requests
100 requests
```

看看 GPU 显存怎么爆掉。

---

# Day 18：LLM Memory Footprint

建立完整模型：

```text
GPU Memory
│
├── Model Weights
├── KV Cache
├── Activations
├── CUDA Runtime
├── Workspace
└── Fragmentation
```

然后计算：

一个：

```text
7B
14B
32B
70B
```

模型大概需要多少显存。

不要依赖别人给你的数字。

自己计算。

---

# Day 19：Batching

理解：

```text
Batch
Dynamic Batch
Continuous Batch
```

思考：

为什么：

```text
Batch = 1
```

和：

```text
Batch = 32
```

性能差别这么大？

进一步理解：

```text
Throughput
vs
Latency
```

---

# Day 20：Attention 的 GPU 视角

现在再回头看 Attention：

```text
QKᵀ
 ↓
Softmax
 ↓
× V
```

重点不是数学。

而是：

> 数据在哪里？

> 中间结果在哪里？

> HBM ↔ SRAM/Shared Memory 搬了多少数据？

> 为什么普通 Attention 会产生大量 Memory Traffic？

然后自然引出：

**FlashAttention**

---

# Day 21：FlashAttention

这一周最重要的一天。

不要先看论文结论。

先自己思考：

> 如果 HBM 很慢，能不能少访问 HBM？

然后理解 FlashAttention 的基本思想：

```text
传统：

HBM
 ↓
Q
 ↓
K
 ↓
Attention Matrix
 ↓
Softmax
 ↓
V
 ↓
HBM

FlashAttention：

HBM
 ↓
Tile
 ↓
SRAM / Shared Memory
 ↓
计算
 ↓
减少 HBM 往返
```

你要真正理解：

> FlashAttention 本质上不是“更快的 Attention 公式”，而是 GPU memory hierarchy 下的 IO 优化。

这是非常重要的认知。

---

# Week 4：CUDA Profiling + GPU 推理性能

第四周进入真正的工程实践。

---

# Day 22：CUDA Profiling

学习 NVIDIA profiling 工具。

重点了解：

```text
Nsight Systems
Nsight Compute
```

先不用追求所有功能。

你只需要知道：

### Nsight Systems

回答：

> 整个系统发生了什么？

### Nsight Compute

回答：

> 这个 Kernel 为什么慢？

---

# Day 23：Kernel Launch

理解：

```text
CPU
 ↓
Kernel Launch
 ↓
GPU
```

为什么大量小 Kernel 会造成问题。

例如：

```text
Kernel A
Kernel B
Kernel C
Kernel D
...
```

可能出现：

```text
Launch overhead
Synchronization
Memory traffic
```

这会自然引出：

> Kernel Fusion

---

# Day 24：Operator Fusion

理解：

```text
Kernel A
 ↓
Kernel B
 ↓
Kernel C
```

和：

```text
Fused Kernel
```

为什么可能更快。

以后理解：

* RMSNorm Fusion
* SiLU Fusion
* QKV Fusion
* Attention Fusion

都会容易很多。

---

# Day 25：GPU 推理性能指标

开始建立 LLM inference metrics：

```text
TTFT
TPOT
ITL
TPS
QPS
Latency
Throughput
GPU Utilization
Memory Utilization
```

特别区分：

```text
TTFT
Time To First Token

TPOT
Time Per Output Token
```

以及：

```text
Latency
vs
Throughput
```

---

# Day 26：GPU 推理性能分析

拿一个真实模型。

例如：

```text
Qwen
Llama
```

跑：

```text
Batch = 1
Batch = 4
Batch = 8
Batch = 16
```

记录：

```text
TTFT
TPOT
Tokens/s
GPU Memory
GPU Utilization
```

然后分析：

> 为什么性能变化？

---

# Day 27：自己做 GPU Performance Model

建立一个简单模型：

输入：

```text
Model Parameters
Sequence Length
Batch Size
Hidden Size
Layers
Heads
Precision
GPU Memory Bandwidth
GPU FLOPS
```

输出：

```text
Weight Memory
KV Cache Memory
Approx FLOPs
Approx Memory Traffic
Compute Bound / Memory Bound
```

哪怕只有 60% 准确，也非常有价值。

因为你开始拥有：

> **LLM Performance 的物理直觉。**

---

# Day 28：读 GPU 推理框架

这一天不要试图读懂整个 vLLM。

只看：

```text
vLLM
 ↓
Model
 ↓
Attention
 ↓
KV Cache
 ↓
CUDA Kernel
```

然后找到：

```text
PagedAttention
```

理解：

> 为什么 KV Cache 需要分页管理？

这会把：

```text
GPU Memory
+
KV Cache
+
LLM Serving
```

三个知识点真正连接起来。

---

# Day 29：做一个 Mini Project

建议你做一个：

## Mini LLM GPU Profiler

输入：

```text
model
batch_size
input_length
output_length
precision
```

输出：

```text
Model Memory
KV Cache Memory
Estimated FLOPs
Estimated Memory Traffic
Arithmetic Intensity
Compute/Memory Bound
```

然后实际跑模型：

```text
Qwen / Llama
```

比较：

```text
理论值
vs
实际 profiling
```

这一步非常重要。

---

# Day 30：写最终总结

最终不要写普通学习笔记。

写一篇：

# 《从 GPU 到 LLM Inference：一个工程师的性能模型》

建议结构：

```text
1. GPU 为什么适合 LLM

2. SM / Warp / Tensor Core

3. GPU Memory Hierarchy

4. FLOPs vs Memory Bandwidth

5. Roofline Model

6. Transformer 如何映射到 GPU

7. Prefill vs Decode

8. KV Cache

9. FlashAttention

10. Batching

11. Kernel Fusion

12. Profiling

13. 我如何定位一个 LLM 推理性能问题
```

最后一定写一个：

> **如果一个 LLM 推理服务很慢，我会按照什么顺序排查？**

---

# 四、你这个月真正应该掌握的知识树

我建议你最终把 GPU 知识压缩成这一张图：

```text
                    GPU
                     │
          ┌──────────┴──────────┐
          │                     │
       Compute                Memory
          │                     │
     ┌────┼────┐          ┌─────┼─────┐
     │    │    │          │     │     │
   CUDA Tensor FP       HBM   L2   Shared
   Core  Core           │           Memory
     │    │             │             │
     └────┼─────────────┴─────────────┘
          │
        Kernel
          │
     ┌────┴────┐
   Thread    Warp
     │         │
   Block      SM
          │
          ↓
    Performance
          │
    ┌─────┼─────┐
    │     │     │
  FLOPS  BW  Latency
    │     │     │
    └─────┼─────┘
          ↓
    Roofline Model
          │
          ↓
   Transformer
          │
    ┌─────┴─────┐
    │           │
  Prefill     Decode
    │           │
  GEMM      KV Cache
    │           │
    └─────┬─────┘
          ↓
     LLM Inference
```

如果这张图你能真正讲清楚，第一个月就达标了。

---

# 五、学习资料不要铺太多

你容易陷入“资料收集”，所以我建议严格控制。

第一层：GPU体系结构

NVIDIA 官方 CUDA Programming Guide。

重点看：

* CUDA execution model
* Thread hierarchy
* Memory hierarchy
* Asynchronous execution

第二层：CUDA

CUDA C++ Programming Guide + CUDA Samples。

不要从头到尾读。

**边学边写 Kernel。**

第三层：性能

重点学习：

* NVIDIA Nsight Systems
* NVIDIA Nsight Compute
* Roofline Model

第四层：LLM

论文依次：

```text
Attention Is All You Need
        ↓
FlashAttention
        ↓
FlashAttention-2
        ↓
vLLM / PagedAttention
```

不用这个月去读几十篇论文。

---

# 六、我建议你建立一个非常重要的学习习惯

每学一个 GPU 知识点，都问三个问题：

### 1. 它解决什么问题？

例如：

> Shared Memory 解决什么问题？

不是回答“高速内存”。

而应该回答：

> 减少对高延迟 Global Memory 的重复访问。

### 2. 它为什么有效？

例如：

> FlashAttention 为什么有效？

因为：

```text
减少 HBM ↔ GPU on-chip memory 的数据搬运
```

### 3. 它什么时候没用？

这个问题最重要。

例如：

> FlashAttention 是不是永远更快？

不是。

不同：

* sequence length
* batch
* GPU
* head dimension
* workload

都会影响结果。

这会训练你从“背技术”进入“做性能工程”。

---

# 七、一个月后的验收标准

不要用“我看完了多少课程”衡量。

用下面 10 个问题测试自己。

如果你可以不查资料解释清楚，M1 就基本成功：

1. GPU 为什么比 CPU 更适合 Transformer？
2. SM、Warp、Thread、Block 分别是什么？
3. Tensor Core 和 CUDA Core 有什么区别？
4. GPU Memory Hierarchy 是什么？
5. 什么是 Memory Bandwidth？
6. 什么是 Arithmetic Intensity？
7. 什么是 Roofline Model？
8. 为什么 LLM Decode 很容易受到 Memory Bandwidth 限制？
9. 为什么 KV Cache 会成为长上下文推理的重要瓶颈？
10. FlashAttention 到底优化了什么？

再增加一个实战题：

> **给我一个 70B 模型、FP16、8192 context、batch=8，估算显存需求，并判断推理过程中可能出现的主要 GPU 瓶颈。**

如果你能自己完成这个问题，你已经不是“学过 GPU”，而是开始具备 **LLM Inference Engineer 的底层视角**。

---

最后，我建议你的这一年不要按照“GPU → CUDA → Transformer → vLLM”这种纯课程式路线推进，而是始终围绕一个主问题：

> **一个 Token 是如何在 GPU 上被计算出来的？**

从：

```text
用户请求
 ↓
Tokenizer
 ↓
Transformer
 ↓
QKV
 ↓
Attention
 ↓
KV Cache
 ↓
GEMM
 ↓
CUDA Kernel
 ↓
SM
 ↓
Tensor Core
 ↓
HBM
 ↓
Next Token
```

一路往下钻。

然后再一路反过来：

```text
GPU硬件
 ↓
Kernel
 ↓
算子
 ↓
Attention
 ↓
Transformer
 ↓
Inference Engine
 ↓
Agent
```

这条路线和你原本的 Agent 系统背景是能接上的。你最终真正需要的不是成为 CUDA 专家，而是成为一个**能够从模型算法一直看到 GPU 硬件，并能解释推理系统性能的 Agent/LLM 系统架构师**。

如果按每天 1～2 小时执行，我会把这个月进一步拆成一份 **30 天 × 每天 60～120 分钟的具体任务表**，每一天明确到“读什么、写什么 CUDA 代码、做什么实验、回答什么问题、产出什么笔记”，这样可以直接照着执行。



下面把它落成一份可以直接执行的「GPU 30 天训练计划」。考虑到你的目标不是转 CUDA 工程师，而是最终深入 LLM 推理，我会刻意控制 CUDA 的深度：**够理解 GPU、够分析性能、够读 Kernel，不追求把 CUDA API 学全。**

每天建议 90 分钟；有时间可以做到 2 小时。

整体节奏：

> 30 分钟理论 → 40 分钟实验 → 20 分钟总结
> 每 7 天做一次小项目，而不是继续堆知识。

---

# 第 1 周：建立 GPU 心智模型

目标：

> 搞清楚 GPU 是怎么执行程序的，以及数据是怎么在 GPU 里流动的。

## Day 1 — CPU vs GPU

理论：

* CPU / GPU 的设计目标
* Latency vs Throughput
* ILP / TLP
* SIMD / SIMT
* 为什么深度学习适合 GPU

实验：

用 Python + NumPy/PyTorch 对一个大数组做：

```python
C = A + B
```

分别：

```text
CPU
GPU
```

测试不同数据规模。

重点不是得到一个漂亮的 benchmark，而是观察：

```text
数据规模
CPU 时间
GPU 时间
GPU 加速比
```

回答：

> 为什么小任务 GPU 可能反而更慢？

---

## Day 2 — GPU 架构

学习：

```text
GPU
├── GPC
├── SM
│   ├── CUDA Core
│   ├── Tensor Core
│   ├── Register
│   ├── Shared Memory
│   └── L1
├── L2
└── HBM
```

重点理解：

> SM 到底是什么？

不要死记 NVIDIA 某一代 GPU 有多少个 SM。

你需要理解的是：

> **Kernel 最终是在 SM 上执行的。**

产出：

画一张你自己的 GPU Architecture 图。

---

## Day 3 — Thread / Warp / Block

理解：

```text
Thread
  ↓
Warp
  ↓
Block
  ↓
Grid
```

重点：

* Thread
* Warp = 32 threads
* Block
* Grid
* SM

实验：

写一个最简单 CUDA Kernel：

```cpp
C[i] = A[i] + B[i]
```

改变：

```text
threads/block
```

例如：

```text
32
64
128
256
512
1024
```

记录性能。

---

## Day 4 — CUDA Kernel

深入：

```cpp
threadIdx
blockIdx
blockDim
gridDim
```

理解：

```cpp
int i =
    blockIdx.x * blockDim.x
    + threadIdx.x;
```

自己画：

```text
Grid
 ├── Block 0
 │    ├── Thread 0
 │    ├── Thread 1
 │    └── ...
 ├── Block 1
 └── ...
```

实验：

实现：

```text
Vector Add
Vector Multiply
SAXPY
```

不需要复杂。

目标是能够自己写 Kernel。

---

## Day 5 — GPU Memory Hierarchy

重点学习：

```text
Register
   ↓
Shared Memory
   ↓
L1 Cache
   ↓
L2 Cache
   ↓
HBM
```

建立三个维度：

```text
容量
延迟
带宽
```

重点理解：

> 越靠近计算单元，通常越快、越小。

实验：

比较不同 memory access pattern。

例如：

```text
A[i]
```

和：

```text
A[i * stride]
```

改变：

```text
stride = 1
2
4
8
32
128
```

观察性能。

---

## Day 6 — Coalesced Access

重点：

> GPU 为什么希望一个 Warp 的线程访问连续地址？

理解：

```text
Thread 0 → A[0]
Thread 1 → A[1]
Thread 2 → A[2]
...
```

与：

```text
Thread 0 → A[0]
Thread 1 → A[1024]
Thread 2 → A[2048]
...
```

之间的区别。

这是以后理解：

* Attention
* KV Cache
* FlashAttention
* Embedding
* Quantization

的基础。

---

## Day 7 — Week 1 小项目

做：

> **GPU Vector Benchmark**

实现：

```text
Vector Add
Vector Multiply
Vector SAXPY
```

测试：

```text
不同数据量
不同 block size
不同 memory access
```

输出一张表：

| Experiment | Size | Block | Time | Bandwidth |
| ---------- | ---: | ----: | ---: | --------: |
| Add        |   1M |   128 |  ... |       ... |
| Add        |   1M |   256 |  ... |       ... |
| Add        |  10M |   256 |  ... |       ... |

然后写 500～1000 字：

> 为什么 GPU Vector Add 通常不是计算瓶颈，而是 Memory Bandwidth 瓶颈？

---

# 第 2 周：性能工程

这一周开始从“GPU 是什么”进入：

> **GPU 为什么快 / 为什么慢？**

---

# Day 8 — FLOPs

学习：

```text
FLOP
FLOPS
TFLOPS
PFLOPS
```

重点掌握矩阵乘法：

```text
[M,K] × [K,N]
```

大约：

```text
2 × M × K × N FLOPs
```

自己算：

```text
4096 × 4096
```

矩阵乘法需要多少 FLOPs。

再计算：

```text
1024 × 4096
×
4096 × 4096
```

---

# Day 9 — Memory Bandwidth

学习：

```text
Memory Bandwidth
GB/s
TB/s
```

假设 GPU：

```text
HBM Bandwidth = 1 TB/s
```

一个 Kernel 每次需要读取：

```text
100 GB
```

理论最短时间是多少？

这类估算以后必须做到“心算级”。

---

# Day 10 — Compute Bound vs Memory Bound

学习：

```text
Compute Bound
Memory Bound
```

建立：

```text
                    Compute
                      ↑
                      │
                      │
Memory ───────────────┼────────
                      │
```

然后理解：

> GPU 利用率低，不一定代表 GPU 没有工作。

可能是：

```text
Memory Bound
Kernel Launch
Synchronization
Low Occupancy
```

---

# Day 11 — Arithmetic Intensity

掌握：

```text
Arithmetic Intensity

= FLOPs / Bytes
```

例如：

一个操作：

```text
1 TFLOP
100 GB memory traffic
```

则：

```text
10 FLOPs/Byte
```

然后思考：

> AI 越高是不是一定越快？

答案不是。

这会引出 Roofline。

---

# Day 12 — Roofline Model

这是本月必须掌握的核心模型。

你应该能自己画出：

```text
Performance
│
│                 ───────── Compute Ceiling
│               /
│             /
│           /
│         /
│_______/________________
        Arithmetic Intensity
```

理解：

```text
低 AI
→ Memory Bound

高 AI
→ Compute Bound
```

然后把：

```text
Vector Add
GEMM
Attention
```

放到这个模型中。

---

# Day 13 — Tensor Core

理解：

```text
CUDA Core
vs
Tensor Core
```

重点：

> Tensor Core 本质上是为矩阵乘加设计的专用计算单元。

理解：

```text
FP32
TF32
FP16
BF16
FP8
INT8
```

不要求现在把每种格式的细节全部学完。

只需要建立：

```text
Precision
 ↓
Memory
 ↓
Compute
 ↓
Accuracy
```

之间的关系。

---

# Day 14 — Week 2 小项目：GEMM

实现三个版本：

```text
Naive GEMM
     ↓
Tiled GEMM
     ↓
Shared Memory GEMM
```

然后比较：

```text
Latency
GFLOPS
Memory
```

回答三个问题：

1. 为什么矩阵乘法适合 GPU？
2. 为什么 Shared Memory 有用？
3. 为什么 GEMM 能非常接近 GPU 峰值算力？

如果这三个问题回答清楚，第二周基本过关。

---

# 第 3 周：GPU → Transformer → LLM

这是整个学习计划最关键的一周。

你开始把前面的 GPU 知识全部连接起来。

---

# Day 15 — Transformer 的 GPU 映射

不要先研究 Transformer 数学。

只看：

```text
Transformer Layer

Input
 ↓
QKV Projection
 ↓
Attention
 ↓
Output Projection
 ↓
MLP
 ↓
Output
```

然后映射：

```text
Linear
 ↓
GEMM

Attention
 ↓
Matrix + Memory

MLP
 ↓
GEMM

RMSNorm
 ↓
Elementwise
```

最终理解：

> Transformer 并不是一个“大算法”，而是大量 GPU Kernel 的组合。

---

# Day 16 — Prefill

理解：

```text
Prompt
 ↓
Tokenizer
 ↓
Prefill
 ↓
KV Cache
```

例如：

```text
8K prompt
```

模型可以同时处理大量 token。

所以 Prefill 通常具有：

```text
高并行度
GEMM
Compute Intensive
```

重点问题：

> 为什么 Prefill 通常比较容易把 GPU 算力利用起来？

---

# Day 17 — Decode

理解：

```text
Token 1
 ↓
Token 2
 ↓
Token 3
 ↓
Token 4
```

每次生成一个 token。

于是：

```text
Prefill
≈ 大矩阵计算

Decode
≈ 小计算 + 大量 Memory Access
```

这时你应该开始意识到：

> **LLM 推理不是一个统一 workload。**

Prefill 和 Decode 是两种完全不同的性能问题。

---

# Day 18 — KV Cache

这是整个第 3 周最重要的内容。

自己计算：

假设：

```text
Layers = 32
Heads = 32
Head Dim = 128
Sequence = 8192
dtype = FP16
```

计算：

```text
KV Cache / token
KV Cache / request
KV Cache / 100 requests
```

然后回答：

> 为什么长上下文 + 高并发很容易把 GPU 显存打爆？

---

# Day 19 — Model Memory

建立完整 GPU Memory Model：

```text
GPU Memory
│
├── Model Weights
├── KV Cache
├── Activations
├── CUDA Context
├── Temporary Workspace
└── Fragmentation
```

分别估算：

```text
7B
14B
32B
70B
```

FP16 模型的 Weight Memory。

然后：

```text
FP16
BF16
INT8
INT4
```

进行比较。

---

# Day 20 — Batching

理解：

```text
Batch = 1
Batch = 8
Batch = 32
```

然后：

```text
Static Batch
Dynamic Batch
Continuous Batch
```

重点理解：

> 为什么 LLM Serving 中 Continuous Batching 非常重要？

不要背 vLLM 的答案。

从 GPU 利用率和请求生命周期自己推导。

---

# Day 21 — Week 3 小项目

做：

# LLM Memory Calculator

输入：

```text
Model Parameters
Layers
Heads
Head Dimension
Context Length
Batch Size
Precision
```

输出：

```text
Model Weight Memory
KV Cache Memory
Total Estimated Memory
```

例如：

```text
Qwen
32B
FP16
32K Context
Batch 16
```

估算：

> 到底需要多少显存？

然后再思考：

> 为什么真实运行所需显存和理论值不同？

---

# 第 4 周：FlashAttention + Profiling + 推理系统

最后一周从“理解 GPU”进入真正的 LLM Performance Engineering。

---

# Day 22 — Attention IO

重新看：

```text
QKᵀ
 ↓
Softmax
 ↓
×V
```

不要只看 FLOPs。

计算：

```text
需要读取多少数据？
需要写多少数据？
中间 Attention Matrix 多大？
```

然后问：

> Attention 为什么会产生大量 HBM traffic？

---

# Day 23 — FlashAttention

现在开始读：

**FlashAttention**

重点不是论文证明。

重点是：

> 它如何利用 GPU Memory Hierarchy？

理解：

```text
HBM
 ↓
Tile
 ↓
Shared Memory / SRAM
 ↓
Compute
 ↓
减少 HBM Read/Write
```

核心认知：

> FlashAttention 的核心价值是 IO 优化，而不只是数学计算优化。

---

# Day 24 — Kernel Fusion

理解：

```text
Kernel A
 ↓
HBM
 ↓
Kernel B
 ↓
HBM
 ↓
Kernel C
```

与：

```text
Fused Kernel
```

为什么后者可能更快。

然后理解：

```text
Memory Traffic
Kernel Launch
Intermediate Tensor
```

之间的关系。

---

# Day 25 — Nsight Systems

学习：

> 如何看整个 GPU workload。

重点关注：

```text
CPU
GPU
Kernel
Memory
Synchronization
```

你要学会回答：

> GPU 到底有没有被充分利用？

---

# Day 26 — Nsight Compute

学习：

> 如何分析一个 Kernel。

重点关注：

```text
Occupancy
Memory Throughput
Compute Throughput
Warp
Cache
Registers
Shared Memory
```

不要试图理解 Nsight Compute 的所有指标。

先抓住：

> **这个 Kernel 到底是 Compute Bound 还是 Memory Bound？**

---

# Day 27 — LLM Serving Benchmark

跑一个真实模型。

建议：

```text
Qwen / Llama
```

测试：

```text
Batch 1
Batch 4
Batch 8
Batch 16
```

记录：

```text
TTFT
TPOT
Tokens/s
GPU Memory
GPU Utilization
```

然后做：

```text
Batch Size
      ↓
Throughput
      ↓
Latency
```

曲线。

---

# Day 28 — PagedAttention

开始看：

**vLLM / PagedAttention**

核心问题：

> KV Cache 为什么需要分页？

理解：

```text
传统：

Request A
████████████████
Request B
████████████
Request C
██████████████████

可能出现大量碎片
```

Paged KV Cache：

```text
Page
Page
Page
Page
Page
```

由类似虚拟内存的思想管理。

这时你应该能够理解：

> 为什么 vLLM 不只是“一个更快的模型推理框架”。

它实际上涉及：

```text
GPU Memory Management
+
KV Cache Management
+
Batch Scheduling
+
Kernel
```

---

# Day 29 — 最终项目

做：

# Mini LLM Performance Analyzer

输入：

```text
Model
Parameter Count
Layers
Heads
Head Dim
Context
Batch
Input Tokens
Output Tokens
Precision
GPU
```

输出：

```text
Weight Memory
KV Cache
Estimated FLOPs
Estimated Memory Traffic
Arithmetic Intensity
Expected Bottleneck
```

然后实际跑一次模型。

比较：

```text
理论模型
      VS
真实 Benchmark
```

分析误差来源。

---

# Day 30 — Final Review

最后一天不要学习新东西。

完成一篇：

> 《一个 Token 是如何在 GPU 上生成的》

建议从：

```text
User
 ↓
Prompt
 ↓
Tokenizer
 ↓
Transformer
 ↓
QKV
 ↓
Attention
 ↓
KV Cache
 ↓
GEMM
 ↓
CUDA Kernel
 ↓
Warp
 ↓
SM
 ↓
Tensor Core
 ↓
HBM
 ↓
Next Token
```

一路讲到底。

然后反过来：

> 如果生成一个 Token 很慢，我如何定位问题？

形成：

```text
模型
 ↓
Inference Engine
 ↓
Scheduler
 ↓
Kernel
 ↓
Compute
 ↓
Memory
 ↓
Hardware
```

的排查树。

---

# 最后给你一个非常重要的调整

你未来一年学习“推理”，我建议建立四层知识结构，而不是单纯按照论文顺序学习：

```text
L4  Inference System
    vLLM / SGLang / TRT-LLM
              ↑
L3  Model Computation
    Transformer / Attention / MoE
              ↑
L2  GPU Software
    CUDA / Kernel / Compiler
              ↑
L1  Hardware
    SM / Tensor Core / HBM / Cache
```

你现在的第一个月，只解决：

```text
L1 Hardware
     ↓
L2 CUDA
```

但要不断拿 LLM 作为例子。

这样到了第 4～5 个月，你会形成非常有价值的能力：

> **看到一个 LLM 推理优化技术，不只是知道“它是什么”，而是能判断它究竟在优化计算、Memory、通信、调度还是算法复杂度。**

这会比单纯学习“vLLM 怎么用”“FlashAttention 怎么调用”高一个层次。

尤其对于你这种已经有 Agent 系统和生产工程背景的人，我认为这条路线比从 Transformer 数学开始重新学一遍更合适：**你真正缺的不是应用层知识，而是把模型计算一直下钻到 GPU 执行层的能力。**
