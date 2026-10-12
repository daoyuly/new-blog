---
title: "GPU 学习日报 Day 23：Kernel Launch：为什么大量小 Kernel 会拖慢推理"
date: 2026-10-12 10:00:00
tags:
  - GPU 学习日报
  - Kernel Launch
  - Overhead
  - Synchronization
  - GPU
categories:
  - GPU → LLM Inference 学习计划
  - Week 4 CUDA Profiling + GPU 推理性能
description: "Day 23/30 | Kernel Launch 开销 | Kernel Launch：为什么大量小 Kernel 会拖慢推理。30 天从 GPU 硬件到 LLM 推理性能的深度学习计划。"
keywords: "GPU, CUDA, LLM, Inference, Kernel Launch 开销, Kernel Launch, Overhead, Synchronization, GPU"
author: OpenClaw GPU Learning
---

# GPU 学习日报 Day 23：Kernel Launch：为什么大量小 Kernel 会拖慢推理

> **30 天学习计划** | Week 4 - CUDA Profiling + GPU 推理性能 | Day 23/30
> 
> **今日主题**: Kernel Launch 开销

---

# Kernel Launch：为什么大量小 Kernel 会拖慢推理

**核心结论**：在 GPU 上执行一次 Kernel Launch（内核启动）有固定的 CPU 侧开销，通常为 3–10 微秒（在开启 CUDA Graphs 优化前）。如果你的 Kernel 本身只跑 5 微秒，那么一半甚至更多的时间花在“调度”而非“计算”上。LLM 推理中的 decode 阶段充满大量小矩阵运算，天然产生海量小 Kernel，这就是为什么很多人观察到“GPU 利用率明明不高，但推理就是慢”。解药主要有两个：**Kernel Fusion（算子融合）** 减少 Kernel 数量，以及 **CUDA Graphs** 减少 Launch 开销本身。理解 Launch 的完整流程，是理解这两个优化手段的前提。

---

## 一、背景与动机：为什么这个知识点是分水岭

很多工程师的 GPU 认知停留在“GPU 快，所以丢给 GPU 跑就完了”。这个认知在跑一个大 GEMM（通用矩阵乘法）时是对的，但在 **LLM 推理（LLM Inference）** 场景下会严重失灵。

一个典型的 decode step 中，模型会执行几十上百个小操作：LayerNorm、GELU、Rotary Position Embedding、QKV 投影、Attention、多个小 GEMM……每一个在 PyTorch eager 模式下都可能对应一个独立的 CUDA Kernel。当你用 `nvidia-smi` 观察 decode 阶段时，GPU 利用率可能只有 40–60%——**GPU 大部分时间在等待 CPU 派活，而不是在计算**。

这个现象的根因就是 **Kernel Launch Overhead（内核启动开销）**。不理解它，你就无法理解 vLLM 为什么要做 Kernel Fusion、CUDA Graphs 为什么是推理引擎的标配、`torch.compile` 的价值在哪里。

---

## 二、核心内容

### 2.1 CPU → Kernel Launch → GPU 的完整流程

**Kernel Launch** 不是简单的“函数调用”，而是一段跨越 CPU 和 GPU 的协作流程。物理直觉：CPU 是“办公室的经理”，GPU 是“工厂车间”，每次派活都要走一遍固定流程。

一次 `cudaLaunchKernel` 大致经历以下阶段：

1. **参数打包（Argument Marshalling）**：CPU 把 Kernel 参数、指针、grid/block 维度写入 CPU 内存中的 launch buffer。
2. **驱动层提交**：CUDA 驱动（用户态的 `libcuda`）把命令写入一个 **Command Queue / Ring Buffer（命令环形缓冲区）**，这段内存 CPU 和 GPU 都能访问。
3. **门铃通知（Doorbell Write）**：驱动往特定寄存器/内存位置写入“有新任务”，触发中断或轮询机制通知 GPU 前端。
4. **GPU 前端调度**：GPU 的 **GPC（General Processing Cluster）前端 / Command Processor** 从 ring buffer 读取命令，解析后把 Kernel 任务交给 **Grid Management Unit**。
5. **Kernel 启动**：分配 SM 资源、加载 Kernel 二进制、初始化参数常量，block 被分发到各 SM 上执行。

关键认知：**步骤 1–3 发生在 CPU 上，是同步的软件开销**；步骤 4–5 由 GPU 硬件完成。我们通常说的 "Launch Overhead"（约 3–10 μs）主要指前半段加上 GPU 前端响应的端到端延迟。

```
CPU 侧                                GPU 侧
┌──────────────┐    Ring Buffer   ┌──────────────────┐
│ 参数打包      │ ──────────────→ │ Command Processor │
│ 驱动写入命令   │   (PCIe/MMIO)   │ Grid Management   │
│ doorbell 通知 │                 │ → 分发 block 到 SM │
└──────────────┘                 └──────────────────┘
      ↑ 大量小 Kernel 时，这条流水线本身就成了瓶颈
```

### 2.2 大量小 Kernel 的 Launch Overhead

**Launch Overhead（启动开销）** 的本质是一笔“固定成本”：不管你的 Kernel 是算 1 次乘法还是 10 亿次乘法，从 CPU 发起到 GPU 开始执行的基础流程成本几乎一样。

这就像快递：寄一根针和寄一台冰箱，填单、揽收、扫描的流程成本一样。**如果每件包裹的流程成本是 5 元，而你寄的是 5 元钱的东西，那么成本全部花在流程上。**

用数字算一笔账：

| Kernel 类型 | Kernel 执行时间 | Launch 开销 | 有效算力占比 |
|---|---|---|---|
| 大 GEMM（如 4096×4096） | ~500 μs | ~5 μs | ~99% |
| 小 Kernel（如 LayerNorm，batch=1） | ~5 μs | ~5 μs | **~50%** |
| 极小 Kernel（elementwise on 1KB） | ~1 μs | ~5 μs | **~17%** |

进一步地，CPU 提交命令的**吞吐量**有限——CPU 线程每秒大约只能“发射”几万到十几万个 Kernel。当 GPU 执行速度远快于 CPU 发射速度时，**瓶颈从 GPU 转移到了 CPU**，这个状态叫 **Launch Bound（发射受限）**。此时 GPU 在饥饿等待，而 CPU 在满负荷打包命令——这就是 decode 阶段 `nvidia-smi` 利用率上不去的经典场景。

一个重要细节：**Launch 是异步的**。CPU 发射完一个 Kernel 就能继续发射下一个，不需要等它执行完。所以小 Kernel 之间的 Launch 开销可以被流水线掩盖——前提是 CPU 发射速度 > GPU 消费速度。一旦 Kernel 小到连流水线都填不满，开销就彻底暴露了。

### 2.3 Synchronization 的开销

**Synchronization（同步）** 会把上面那条精心建立的流水线直接打断。

GPU 编程的理想状态是 **异步流水线（Asynchronous Pipeline）**：CPU 提前把几十个 Kernel 塞进队列，GPU 持续消费。但以下操作会强制 CPU 停下来等 GPU：

| 操作 | 性质 | 开销 |
|---|---|---|
| `cudaStreamSynchronize` / `torch.cuda.synchronize()` | 硬同步，CPU 阻塞等待 | 高 |
| `cudaMemcpy`（同步版，D2H 或 H2D） | 隐含同步 | 高 |
| `cudaDeviceSynchronize` | 全设备同步 | 最高 |
| `.item()` / `.cpu()` / `print(tensor)`（PyTorch） | 隐式同步，**最阴险** | 高且难察觉 |

因果链是这样的：CPU 同步等待 → 流水线排空 → GPU 算完 → 结果拷回 CPU → CPU 恢复发射 → GPU 再次饥饿。每一次同步都会产生一段 GPU 空闲期，同步次数越多，流水线被切碎得越厉害。

PyTorch 中最容易踩的坑是**隐式同步**：

```python
# 坏例子：每个 if 判断都需要 .item() → 强制同步
if loss.item() > threshold:      # ← GPU 流水线在这里被斩断
    do_something()

# 坏例子：metrics 打印导致每步同步
print(f"acc: {accuracy.cpu().numpy()}")  # ← 同上
```

在推理引擎里，如果每生成一个 token 都要同步一次检查终止条件，decode 的流水线就会被切成一粒一粒的，Launch 开销完全无法掩盖。

### 2.4 Memory Traffic between Kernels

这是 Launch 开销之外的第二重惩罚：**Kernel 之间通过显存（HBM）传递中间结果**。

每个 Kernel 的输出必须写回 Global Memory，下一个 Kernel 再读回来。对于中间结果是 1 MB 的小算子链，这个“写出去再读回来”的成本可能远超计算本身。

物理直觉：GPU 的 L2 Cache 是车间旁边的临时货架，但 Kernel 边界会把货强制搬回远处的中央仓库（HBM），下一个 Kernel 再去仓库取货。来回的搬运时间（HBM 带宽 ~2–3 TB/s，看起来很快，但相对于 L2 延迟是数量级的差距）在小算子场景下占主导。

```
Fused（融合后）:
  [读x] → 计算A → 计算B → 计算C → [写y]     1次读 + 1次写

Unfused（未融合）:
  [读x]→计算A→[写t1]→[读t1]→计算B→[写t2]→[读t2]→计算C→[写y]
                                                  3次读 + 3次写
```

算一笔账：一个 batch=1 的 7B 模型，hidden size 4096，中间激活约 16 KB（fp16 下 4096×2 bytes… 实际上是一个 token × 4096 维 = 8 KB）。这么小的数据，**计算时间微秒级，访存和 Launch 时间却是同级甚至更大**。这就是为什么 decode 阶段被归类为 **Memory Bound（访存受限）+ Launch Bound** 的双重受限场景。

### 2.5 引出 Kernel Fusion 的动机

把 2.2–2.4 串起来，因果链完整了：

```
算子多而小
  → ① 每个 Kernel 承担固定 Launch 开销（占比失控）
  → ② Kernel 间强制走 HBM 传递中间结果（访存浪费）
  → ③ 若有同步点，流水线反复清空
  → GPU 空转，CPU 忙于派活，推理延迟高
```

**Kernel Fusion（算子融合）** 一次性攻击 ①和②：把多个相邻小算子合并成一个 Kernel，Launch 次数减少 N 倍，中间结果留在寄存器/Shared Memory/L2 中，HBM 流量大幅下降。

经典例子是 **Attention 中的融合**：朴素实现需要 Softmax 之前的 QK^T 写一次显存、Softmax 写一次、再乘 V 写一次；FlashAttention 把整个链路融成一个 Kernel，中间矩阵根本不落盘——这既是 Fusion 的胜利，也是它省显存的原因。

而剩下的攻击面 ③，则由 **CUDA Graphs** 解决：把整个推理图一次性录制，之后每次重放，把成百次 Launch 压缩成一次图重放（replay 开销从数百微秒降到几十微秒）。vLLM、TensorRT-LLM 都把 CUDA Graphs 作为 decode 的默认开启项。

注意两者的分工：**Fusion 减少 Kernel 数量，CUDA Graphs 降低单次 Launch 成本**，二者正交且常配合使用。

---

## 三、代码/图示：动手测量

```python
import torch, time

def bench(fn, warmup=10, iters=100):
    for _ in range(warmup): fn()
    torch.cuda.synchronize()
    t0 = time.perf_counter()
    for _ in range(iters): fn()
    torch.cuda.synchronize()   # 只在最后同步一次，让流水线充分工作
    return (time.perf_counter() - t0) / iters * 1e6  # μs

N = 256
x = torch.randn(N, N, device='cuda')

# 实验1：1000 个极小 Kernel（每次在 256x256 上做一次逐元素加法）
small = lambda: [x.add_(1.0) for _ in range(1000)]
t_small = bench(small)

# 实验2：1 个等量计算的大 Kernel（1000 次加法融进一次循环编译的乘法里）
y = torch.randn(N, N, device='cuda')
one_big = lambda: x.mul_(2.0).mul_(2.0)  # 大致等量 FLOPs，单 Kernel
t_big = bench(one_big)

# 实验3：对照——1000 个小 Kernel，但每次发射后立刻同步（模拟坏习惯）
synced = lambda: (x.add_(1.0), torch.cuda.synchronize())
t_sync = bench(synced, iters=100)

print(f"1000 小 Kernel: {t_small:.1f} μs/iter")
print(f"1 个大 Kernel : {t_big:.1f} μs/iter")
print(f"小 Kernel+每次同步: {t_sync*10:.1f} μs/10 kernels")
```

在一张普通消费级 GPU 上，你通常会看到：实验 1 的 1000 个 Kernel 耗时 **数毫秒**，而实验 2 的等价计算只需 **几微秒**——差距可达 100–1000 倍，几乎全部来自 Launch Overhead。这就是“GPU 利用率低但推理慢”的最小复现。

用 **Nsight Systems（nsys）** 剖析更直观：

```
nsys profile python bench.py
```

在 timeline 上你会看到：CPU 轨道密密麻麻的 `cudaLaunchKernel`，GPU 轨道上一格一格的小缝隙——缝隙就是 GPU 的饥饿时间。

---

## 四、实践练习与思考题

**练习**：运行上面的代码，记录三个数字。然后回答：

1. 实验 1 中，单个 Kernel 的平均间隔是多少？减去 Kernel 真实执行时间（约 1–2 μs），估算你的机器上单次 Launch 的成本。
2. 把 `N` 从 256 改成 8192，看 1000 个 Kernel 的总耗时变化——为什么 Launch 开销部分几乎不变？
3. 用 `nsys` 观察，CPU 发射 1000 个 Kernel 用了多久？CPU 发射吞吐量是多少 Kernel/s？

**思考题**：

- 为什么 Training 场景对 Launch Overhead 的敏感度远低于 batch=1 的 decode？（提示：kernel 变大后固定成本被摊薄）
- CUDA Graphs 能解决隐式同步问题吗？为什么动态 shape 是 CUDA Graphs 的头号敌人？

---

## 五、与 LLM Inference 的关联

把本篇的知识直接映射到推理优化实践：

| LLM 推理现象 | 本篇的因果解释 | 业界对策 |
|---|---|---|
| decode 比 prefill 慢得多（每 token） | prefill 是大 GEMM（计算受限），decode 算子极小（Launch+访存受限） | — |
| batch=1 时 GPU 利用率 30–50% | CPU 发射速度跟不上 GPU 消费速度，Launch Bound | CUDA Graphs |
| 连续两个算子间 GPU 有空隙 | Launch 开销未被流水线掩盖 | Kernel Fusion |
| FlashAttention 又快又省显存 | 融合消除了中间矩阵的 HBM 往返 | 算子级融合 |
| vLLM 开启 `enforce_eager=False` 默认用图模式 | 录制整步推理，消除数千次 Launch | CUDA Graphs |
| `loss.item()` / 每 token 检查 stop | 隐式同步斩断流水线 | 批量检查、异步终止条件 |

一句话总结：**LLM decode 的性能战争，本质上是一场“减少 Kernel 数量 + 降低单次 Launch 成本 + 消灭隐式同步”的三线作战。**

---

## 六、FAQ

**Q1：Kernel Launch 开销大概是多少？瓶颈到底在 CPU 还是 GPU？**
A：现代驱动下单次 Launch 端到端约 3–10 μs，CPU 侧提交吞吐量约几万到十几万 Kernel/s。当 Kernel 执行时间与 Launch 开销同量级时（小算子场景），瓶颈在 CPU 发射侧和 GPU 前端调度，而非 SM 计算。

**Q2：Kernel Fusion 一定更快吗？**
A：不一定。融合会增大寄存器压力，可能导致 Occupancy（占用率）下降或寄存器溢出到 Local Memory；过大的融合 Kernel 还可能降低 L2 局部性。经验法则：融合相邻的、中间数据量小的 Memory Bound 算子几乎总是赚的；融合两个大 GEMM 则需要实测。

**Q3：CUDA Graphs 和 Kernel Fusion 是二选一吗？**
A：是互补关系，解决的是不同问题。Fusion 把 10 个 Kernel 变成 1 个（减少 Launch 次数 10 倍）；CUDA Graphs 把 1000 次 Launch 变成 1 次图重放（单次成本降到 ~1/10）。推理引擎通常两者都用。CUDA Graphs 的主要限制是要求固定 shape 和固定计算图，动态 batch/动态序列长度需要 padding 或分桶来适配。

**Q4：怎么判断我的程序是 Launch Bound？**
A：三个信号：① `nvidia-smi` / Nsight 中 GPU 利用率低但延迟高；② Nsight Systems timeline 上 CPU 轨道全是 `cudaLaunchKernel`，GPU 轨道有大量空隙；③ 把 batch 放大 10 倍后总时间几乎不变（说明时间花在发射而非计算上）。

**Q5：PyTorch 里有没有低成本的手段先缓解？**
A：有。① 用 `torch.compile`（默认做算子融合，mode="reduce-overhead" 还会启用 CUDA Graphs）；② 避免隐式同步操作（`.item()`、`.cpu()`、`print(tensor)`）；③ 把多个小操作合并写（如用 `torch.addcmul`、Fused LayerNorm/RMSNorm 的官方实现）；④ 推理部署直接上 vLLM / TensorRT-LLM，它们的图优化和 CUDA Graphs 是开箱即用的。

---

## 七、参考资料

- NVIDIA CUDA C++ Programming Guide — Kernel Execution 与 Streams 章节：https://docs.nvidia.com/cuda/cuda-c-programming-guide/
- NVIDIA Developer Blog — *Getting Started with CUDA Graphs*：https://developer.nvidia.com/blog/cuda-graphs/
- NVIDIA Developer Blog — *CUDA Graphs 优化低延迟推理*（Framework/Inference 相关文章）
- PyTorch 官方文档 — `torch.compile` 与 `mode="reduce-overhead"`：https://pytorch.org/docs/stable/torch.compiler.html
- FlashAttention 论文（Dao et al., 2022）：https://arxiv.org/abs/2205.14135
- vLLM 文档 — CUDA Graph 与调度设计：https://docs.vllm.ai/
- Nsight Systems 用户指南（用于 timeline 分析 Launch Gap）：https://docs.nvidia.com/nsight-systems/

---

## 📋 本日知识点清单

- [ ] CPU → Kernel Launch → GPU 的流程
- [ ] 大量小 Kernel 的 Launch Overhead
- [ ] Synchronization 的开销
- [ ] Memory traffic between kernels
- [ ] 引出 Kernel Fusion 的动机

## 📝 实践练习

测量 1000 个小 Kernel vs 1 个大 Kernel 的执行时间差异。

---

*本文是「GPU → LLM Inference」30 天学习计划的一部分。学习路线：GPU 硬件 → CUDA 执行模型 → 显存/带宽 → Kernel → Attention → KV Cache → 并行策略 → 推理性能。*
