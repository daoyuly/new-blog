---
title: "GPU 学习日报 Day 30：从 GPU 到 LLM Inference：一个工程师的性能模型"
date: 2026-10-19 10:00:00
tags:
  - GPU 学习日报
  - 总结
  - GPU
  - LLM Inference
  - 性能模型
  - 工程师
categories:
  - GPU → LLM Inference 学习计划
  - Week 4 CUDA Profiling + GPU 推理性能
description: "Day 30/30 | 30 天最终总结 | 从 GPU 到 LLM Inference：一个工程师的性能模型。30 天从 GPU 硬件到 LLM 推理性能的深度学习计划。"
keywords: "GPU, CUDA, LLM, Inference, 30 天最终总结, 总结, GPU, LLM Inference, 性能模型, 工程师"
author: OpenClaw GPU Learning
---

# GPU 学习日报 Day 30：从 GPU 到 LLM Inference：一个工程师的性能模型

> **30 天学习计划** | Week 4 - CUDA Profiling + GPU 推理性能 | Day 30/30
> 
> **今日主题**: 30 天最终总结

---

# 从 GPU 到 LLM Inference：一个工程师的性能模型

## 开篇结论

**LLM 推理性能的本质，是在 GPU 硬件约束下的算术强度问题。** 一句话总结 30 天的核心认知：Prefill 阶段是 Compute-bound（计算受限），Decode 阶段是 Memory-bound（带宽受限），而几乎所有推理优化技术——FlashAttention、KV Cache、Continuous Batching、Kernel Fusion——都是围绕“如何提高算术强度或减少显存搬运”展开的。掌握了 Roofline Model（屋顶线模型），你就有了判断“一个优化值不值得做”的物理直觉。这篇文章是 30 天学习的终章总结：把 GPU 架构（SM、Warp、Tensor Core、显存层级）与 Transformer 的计算模式连接起来，形成一套可操作的推理性能心智模型和排查清单。读完你应该能回答：为什么 GPU 适合 LLM？为什么 Decode 的 MFU 只有 1%？为什么 Batching 是免费的午餐？

---

## 背景与动机

很多工程师面对 LLM 推理性能问题时，习惯性地“加卡、换卡、上量化”，但对真正的瓶颈缺乏判断依据。结果往往是：花大价钱换了 H100，吞吐只提升了 40%；或者盲目开启某个优化，反而更慢。

问题的根源在于：**LLM 推理是 GPU 架构特性与 Transformer 计算模式的乘积**。不懂 GPU 的执行模型（Warp 调度、显存层级），就无法理解 Decode 为什么慢；不懂 Transformer 的数据流，就无法理解为什么 KV Cache 能省 99% 的重复计算。

这篇文章把 30 天的内容串成一条因果链：

```
GPU 架构 → 计算与访存的物理限制 → Roofline 定位瓶颈
   ↓
Transformer 计算模式 → Prefill / Decode 两种截然不同的负载
   ↓
针对性优化：FlashAttention / KV Cache / Batching / Kernel Fusion
   ↓
Profiling 验证 → 排查清单落地
```

---

## 一、GPU 为什么适合 LLM：并行性的匹配

**核心概念：SIMT（Single Instruction Multiple Threads，单指令多线程）**

LLM 的绝大部分计算是矩阵乘法。一个 4096×4096 的矩阵乘法包含约 680 亿次浮点操作，且这些操作天然独立、规则、可大规模并行。这与 GPU 的设计哲学完全吻合：

- **CPU**：几个强大核心（高主频、复杂分支预测、大缓存），为串行逻辑和低延迟设计
- **GPU**：上万个简单核心（H100 有 16896 个 FP32 CUDA Core），为高吞吐设计

更关键的是 **Tensor Core（张量核心）**。它是 GPU 中专门执行小矩阵块乘加运算的硬件单元，一个 SM 内的 Tensor Core 可以在一个周期内完成一整个 4×4 或 8×8 矩阵块的乘累加，相当于把“标量乘法器阵列”升级成“矩阵乘法器阵列”。H100 的 Tensor Core 峰值算力约为同代 FP32 CUDA Core 的 16 倍。

**因果链**：Transformer = 矩阵乘法为主 → 矩阵乘法天然并行 → GPU 的 SIMT + Tensor Core 提供海量并行算力 → GPU 成为 LLM 的天然载体。

反面例子：如果模型充满 if-else、不规则的数据依赖（比如某些稀疏专家路由），GPU 的优势就会大幅缩水——这就是 MoE 推理在某些场景下 GPU 利用率偏低的原因之一。

---

## 二、SM / Warp / Tensor Core：执行模型的三层结构

**核心概念：SM（Streaming Multiprocessor，流式多处理器）、Warp（线程束）**

理解 GPU 执行模型，记住三层结构即可：

```
GPU
 └── SM（流式多处理器，H100 有 132 个）——"小车间"
      ├── Warp（线程束，32 个线程一组）——"流水线班组"
      │    └── 线程（最小执行单位）
      └── Tensor Core / CUDA Core——"机床"
```

**关键机制：Latency Hiding（延迟隐藏）**。显存访问需要几百个周期，如果线程只是“等”着数据回来，GPU 就空转了。GPU 的解法是：一个 SM 上同时驻留多个 Warp，当某个 Warp 在等显存数��时，调度器立刻切换执行另一个就绪的 Warp。这就是“用吞吐量换延迟”的物理实现。

由此推出一个重要结论：**要打满 GPU，必须保证足够的并行度**。Warp 数量不足（小 batch、小矩阵），GPU 只能空等——这正是 Decode 阶段 GPU 利用率低的微观解释（后文详述）。

**对推理的启示**：Batch size 太小 → Warp 调度没有余量 → 延迟无法隐藏 → 显存带宽打不满。这是 Continuous Batching（连续批处理）在硬件层面的根本依据。

---

## 三、GPU Memory Hierarchy：快与大的物理权衡

**核心概念：Memory Hierarchy（存储层级）**

存储器速度和容量是物理上对立的（越快越贵越小），GPU 用金字塔结构应对：

| 层级 | 位置 | 容量（H100） | 延迟 | 说明 |
|---|---|---|---|---|
| Register（寄存器） | 核心内 | ~256KB/SM | 1 周期 | 线程私有 |
| Shared Memory（共享内存） | SM 内 | 228KB/SM | ~30 周期 | Warp 间共享，手动管理 |
| L2 Cache | 芯片内 | 50MB | ~200 周期 | 全 GPU 共享 |
| HBM（高带宽显存） | 芯片旁 | 80GB | ~几百周期 | 3.35TB/s |
| CPU DRAM | 主机 | TB 级 | 毫秒级 | PCIe/NVLink 传输 |

**关键数字直觉**：HBM 带宽约 3TB/s，但 SM 的总算力约 1000 TFLOPS——即每搬运 1 个字节，GPU 能做几百次浮点运算。**数据搬运比计算贵一个数量级以上**，这个事实是理解后面所有优化的钥匙。

另一个关键数字：Shared Memory 带宽约为 HBM 的几十倍。所以高性能 Kernel 的核心手法就是 **Tiling（分块）**：把数据从 HBM 分块搬进 Shared Memory，反复计算后再写回，摊薄搬运成本。FlashAttention 正是这个思路的巅峰之作。

---

## 四、FLOPs vs Memory Bandwidth 与 Roofline Model

**核心概念：Roofline Model（屋顶线模型）、Arithmetic Intensity（算术强度）**

两个核心定义：

- **计算量**：一个操作需要多少浮点运算
- **访存量**：一个操作需要搬运多少字节
- **算术强度** = 计算量 ÷ 访存量（单位：FLOP/Byte）
- **Roofline**：可达性能 = min(峰值算力， 算术强度 × 带宽)

用图表示：

```
性能(TFLOPS)
    │                    _______________
峰值算力 │                  /  Compute-bound
    │                /
    │              /
    │            /   斜率 = 显存带宽
    │          /
    │        /  Memory-bound
    │______/
    └────────┴──────────────────────→ 算术强度
             拐点 = ridge point
```

**拐点（ridge point）**：算术强度超过拐点后，再增加计算量才有意义；低于拐点，性能被带宽锁死。H100 的拐点约为 峰值算力 ÷ 带宽 ≈ 300 FLOP/Byte（FP16）。也就是说，一个 Kernel 的算术强度低于 300，带宽就是瓶颈。

判断口诀：**算术强度低于硬件拐点 → Memory-bound，优化方向是减少搬运或增大 batch；高于拐点 → Compute-bound，优化方向是计算效率（量化、更好的 Kernel）**。这是所有推理优化决策的第一性依据。

---

## 五、Transformer → GPU 映射与 Prefill vs Decode

**核心概念：Prefill（预填充）、Decode（解码）、Autoregressive Decoding（自回归解码）**

LLM 推理分两个阶段，它们的计算模式截然不同：

| 维度 | Prefill | Decode |
|---|---|---|
| 输入 | 整个 prompt（如 2048 token） | 每次仅 1 个新 token |
| 矩阵形状 | 大 GEMM（2048×d×d） | 瘦 GEMM（1×d×d） |
| 算术强度 | 高（数百 FLOP/Byte） | 低（个位数 FLOP/Byte） |
| 瓶颈 | **Compute-bound** | **Memory-bound** |
| 关键指标 | TTFT（首 token 延迟） | TPOT / ITL（每 token 延迟） |
| 权重矩阵访问 | 摊到大量 token 上 | 每 token 都要完整读一遍所有权重 |

**Decode 为什么慢？** 因果链很清晰：每生成一个 token，都要把模型��全部权重（如 70B 模型约 140GB）从 HBM 读一遍，而计算只有一次向量-矩阵乘。以 70B FP16 模型、H100（3.35TB/s）为例：读权重需要约 40ms，而对应的计算量微不足道。**带宽利用率可以接近 100%，但算力利用率（MFU）可能不到 5%**——GPU 的 Tensor Core 几乎全程在等数据。

这个“每 token 必读一遍权重”的事实，直接推出了两大优化的合法性：

1. **Batching**：10 个请求共享一次权重读取，权重搬运成本被 10 个请求摊薄，吞吐近乎线性增长（直到把带宽打满）。
2. **量化（Quantization）**：权重字节减半，Decode 上限直接翻倍——因为瓶颈是搬运不是计算。

---

## 六、KV Cache：用空间换时间的必然选择

**核心概念：KV Cache（键值缓存）**

自回归解码时，每生成一个新 token 都要计算它对所有历史 token 的 Attention。如果每步都重算历史 token 的 K 和 V，计算量随序列长度平方增长，且完全重复。**KV Cache 的解法：把每层算过的 K、V 存下来，后续步骤直接复用。**

代价是显存。一个估算公式（背下来，排查显存问题时直接用）：

```
KV Cache 大小 = 2 × 层数 × 序列长度 × 头数 × 头维度
              × batch × 每 token 字节数

例：Llama-2-7B（32 层，32 头，128 维），
FP16，batch=1，4096 tokens：
= 2 × 32 × 4096 × 4096 × 2 B ≈ 2 GB
```

几个推论：

- **长上下文是显存杀手**：序列长度是线性项，128K 上下文单条请求就可能吃掉几十 GB。
- **MQA / GQA（Multi-Query / Grouped-Query Attention）** 通过减少 KV 头数压缩 KV Cache，是长上下文模型的标配。
- **PagedAttention**（vLLM 的核心技术）借鉴操作系统分页思想，消除 KV Cache 显存碎片，让显存利用率和 batch 并发数大幅提升。

**Prefill 阶段不需要读 KV Cache（它是写的一方），但 Decode 阶段每步都要读写完整 KV Cache**——这也是为什么长上下文的 Decode 速度会随序列增长而下降（带宽瓶颈转向 KV Cache 搬运）。

---

## 七、FlashAttention：让 Attention 从平方访存变线性

**核心概念：FlashAttention、Tiling（分块）、Online Softmax**

朴素 Attention 的实现流程：算出完整 N×N 的注意力矩阵 → 写入 HBM → 做 Softmax → 再读回来做加权求和。问题在于：**N×N 中间矩阵要写读 HBM 至少两次**。序列长 4K 时是 16M 个元素，访存远超计算，且显存占用 O(N²)。

**FlashAttention 的洞察**：Attention 的数学计算是逐块的，Softmax 可以通过增量修正（Online Softmax）在分块下正确计算。于是把 Q、K、V 分块搬进 Shared Memory，块内完成“乘法 + 局部 Softmax + 归并修正 + 加权求和”，**中间矩阵从头到尾不落 HBM**。

效果：

- 访存量从 O(N²) 降到 O(N²/M)（M 为 Shared Memory 大小），实际带宽效率提升 2~4 倍
- 显存占用从 O(N²) 降到 O(N)
- 序列越长收益越大

**方法论价值**：FlashAttention 不改任何数学，只改变计算调度（Fusion + Tiling），却带来了数量级的改进。这告诉我们：**在 Memory-bound 的负载里，“少搬数据”本身就是最大的算法创新空间。**

---

## 八、Batching：推理服务最重要的免费午餐

**核心概念：Static Batching（静态批处理）、Continuous Batching（连续批处理）**

第五节已论证：Decode 是 Memory-bound，每步必须读完整权重。那么把 N 个请求合成一个 batch，权重只读一次、结果算 N 份——**算术强度直接乘以 N，几乎不增加延迟**（矩阵从“瘦”变“胖”，对 GPU 反而更友好）。这是 Decode 场景下最接近免费午餐的优化。

但静态 Batching 有个经典问题：batch 里最长的请求决定整体节奏，短请求早早完成却占着位置空等。**Continuous Batching（Orca 论文提出，vLLM/TGI 均已实现）** 的解法：每次 Decode 迭代后动态调度——完成的请求立刻退出，等待队列的新请求立刻插入。

```
Static Batching:   [Req1----]        短请求干等长请求
                   [Req2------]
Continuous:        [Req1----]→新请求立刻补位
                   [Req2------]
```

吞吐提升通常在 2~10 倍量级。注意代价：**Batch 越大，单请求的 TPOT 越差**（每步计算变多），所以 Batching 本质是用延迟换吞吐——这是一个必须用 SLA 约束来调的 trade-off。

---

## 九、Kernel Fusion 与 Profiling：优化的两个基本功

**Kernel Fusion（核函数融合）**：把多个连续的小 Kernel 合并成一个，避免中间结果写读 HBM。典型例子：LayerNorm + 残差加法 + GELU 激活融合成一个 Kernel。因果链：每个 Kernel 启动都有固定开销（几微秒）+ 中间张量必须落 HBM → 小操作占比越高，浪费越大 → 融合后访存减少、启动开销消失。Decode 阶段大量操作是逐元素小运算（Memory-bound），Fusion 收益尤其明显。推理框架（TensorRT-LLM、vLLM）都会做大量预融合。

**Profiling（性能剖析）**：不要猜瓶颈，用工具测量。核心工具链：

- **NVIDIA Nsight Systems（nsys）**：时间线视角，看 GPU 空闲（gap）、Kernel 启动开销、CPU-GPU 串行依赖
- **Nsight Compute（ncu）**：单个 Kernel 深度分析，看算术强度、带宽利用率、占用率
- **PyTorch Profiler / torch.cuda.synchronize**：框架层定位热点算子
- 常用经验公式：**理论 Decode 最低延迟 ≈ 模型权重大小 ÷ 显存带宽**。实际延迟远高于此值，说明有调度、同步或访存浪费可挖。

一个典型 profiling 发现：Decode 阶段时间线上出现大量小 Kernel 之间的空隙 → CPU 端 Kernel 启动跟不上（Launch Overhead）→ 解法是 CUDA Graph（图捕获，一次启动整张计算图）。

---

## 十、如何定位一个 LLM 推理性能问题：排查清单

这是 30 天内容的实践出口。按顺序执行：

**第一步：明确指标与场景**
- [ ] 目标是 TTFT 还是 TPOT 还是吞吐？
- [ ] 模型大小、量化精度、序列长度分布、并发数？

**第二步：计算理论上限（不跑也能算）**
- [ ] Decode 下限延迟 = 权重字节 ÷ HBM 带宽（例：70B FP16 ÷ 3.35TB/s ≈ 42ms/token）
- [ ] 显存够吗？权重 + KV Cache（用第六节公式）+ 激活

**第三步：判断 Compute-bound 还是 Memory-bound**
- [ ] nsys 看时间线：GPU 利用率低、Kernel 间有 gap → 调度/启动问题（考虑 CUDA Graph、加大 batch）
- [ ] ncu 看 Kernel：带宽利用率 >80% → Memory-bound（考虑量化、GQA、减少 KV 读写）
- [ ] 带宽利用率低但 GPU 繁忙 → Compute-bound 或 Kernel 写得差（考虑换更好的 Kernel、FlashAttention）

**第四步：按瓶颈施策（对照表）**

| 症状 | 可能原因 | 优化手段 |
|---|---|---|
| TTFT 高、prompt 长 | Prefill 计算瓶颈 | Chunked Prefill、Prefix Caching |
| TPOT 高、batch 小 | Memory-bound | 加大 batch、Continuous Batching、量化 |
| 长上下文越来越慢 | KV Cache 带宽瓶颈 | GQA/MQA、PagedAttention、KV 量化 |
| GPU 利用率忽高忽低 | 启动开销/CPU 瓶颈 | CUDA Graph、Kernel Fusion |
| OOM、并发上不去 | KV Cache 碎片 | PagedAttention、降 batch、KV 精度压缩 |
| 吞吐不随 batch 线性涨 | 带宽已打满 | 到顶了，考虑多卡张量并行 |

**第五步：验证**——每次只改一个变量，用同一套 profiling 数据前后对比。

---

## 实践练习与思考题

1. **计算题**：Llama-2-13B FP16 模型部署在 A100（2TB/s），单请求 Decode 的理论最低延迟是多少？开 8 路 batch 后呢？
2. **动手题**：用 `nsys profile` 跑一次 vLLM 的 Decode，找出时间线上最大的三类 Kernel，判断各自是带宽瓶颈还是计算瓶颈。
3. **思考题**：为什么 Speculative Decoding（投机解码）能在不改变模型权重的前提下加速 Decode？用 Memory-bound 的视角解释它为什么有效。
4. **思考题**：Batch 从 1 加到 64，TPOT 几乎不变；但从 64 加到 256，TPOT 明显上升。为什么？

---

## 与 LLM Inference 的关联总结

| 知识点 | 对推理性能的影响 |
|---|---|
| SM/Warp/Tensor Core | 并行度不足 → Decode 打不满硬件 |
| Memory Hierarchy | 决定了“少搬数据”是第一优化原则 |
| Roofline | 瓶颈判断的第一性工具 |
| Prefill/Decode | 两种负载、两套优化策略、两个 SLA 指标 |
| KV Cache | 显存规划与长上下文性能的核心变量 |
| FlashAttention | 长序列 Prefill 的标配 |
| Batching | 吞吐优化的最大杠杆 |
| Fusion + Profiling | 从“猜测”到“测量”的工程闭环 |

---

## FAQ

**Q1：为什么 Decode 阶段 GPU 利用率很低，但延迟仍然降不下来？**
因为 Decode 是 Memory-bound：每生成一个 token 都要读完整权重，GPU 的算力单元大部分时间在等数据。利用率低是“算力在闲置”，延迟由带宽决定——这也是为什么换更强的算力卡（同带宽）对 Decode 帮助有限，而量化（减少字节）帮助直接。

**Q2：Batching 会增加单请求延迟吗？**
会，但通常很划算。Batch 内每步要多算 N 份 token，Prefill 排队也会等待；但 Decode 本身被带宽锁死，加 batch 在带宽打满前几乎不增加每步时间。实际系统中用 Continuous Batching + 并发上限（SLA 驱动）来平衡吞吐与延迟。

**Q3：FlashAttention 改变了 Attention 的计算结果吗？**
不改变（误差在浮点精度范围内）。它通过 Online Softmax 让 Softmax 可以分块增量计算，只是改变了计算调度和中间数据的存放位置，数学上等价。

**Q4：KV Cache 太大怎么办？按优先级给方案。**
① 换用 GQA/MQA 架构的模型（从源头减少 KV 头数）；② KV Cache 量化（FP8/INT8）；③ PagedAttention 消除碎片、提高有效并发；④ Prefix Caching 复用公共前缀；⑤ 确实不够就上多卡（Pipeline/TP 并行分摊）。

**Q5：拿到一台新机器，第一件事该做什么？**
跑一次 nsys 基准测试，记录三个数：实际可达 HBM 带宽（`ncu` 实测，通常低于标称值）、峰值算力、以及一个标准负载的 Decode 延迟。有了这三个基线，之后所有优化都有对照依据。

---

## 参考资料

- NVIDIA H100 Tensor Core GPU Architecture Whitepaper（NVIDIA 官方）
- *FlashAttention: Fast and Memory-Efficient Exact Attention with IO-Awareness*（Dao et al., 2022）
- *Efficient Memory Management for Large Language Model Serving with PagedAttention*（vLLM, Kwon et al., 2023）
- *Fast Inference from Transformers via Speculative Decoding*（Leviathan et al., 2022）
- *Orca: A Distributed Serving System for Transformer-Based Generative Models*（Yu et al., OSDI 2022）
- NVIDIA Nsight Systems / Nsight Compute 官方文档
- vLLM 与 TensorRT-LLM 官方性能调优文档
- Roofline Model 原始论文（Williams et al., 2009, *Roofline: An Insightful Visual Performance Model*）

---

## 📋 本日知识点清单

- [ ] GPU 为什么适合 LLM
- [ ] SM / Warp / Tensor Core 总结
- [ ] GPU Memory Hierarchy 总结
- [ ] FLOPs vs Memory Bandwidth
- [ ] Roofline Model
- [ ] Transformer → GPU 映射
- [ ] Prefill vs Decode
- [ ] KV Cache
- [ ] FlashAttention
- [ ] Batching
- [ ] Kernel Fusion
- [ ] Profiling
- [ ] 如何定位一个 LLM 推理性能问题

## 📝 实践练习

写一篇完整的《从 GPU 到 LLM Inference：一个工程师的性能模型》，包含排查清单。

---

*本文是「GPU → LLM Inference」30 天学习计划的一部分。学习路线：GPU 硬件 → CUDA 执行模型 → 显存/带宽 → Kernel → Attention → KV Cache → 并行策略 → 推理性能。*
