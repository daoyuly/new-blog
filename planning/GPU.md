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
