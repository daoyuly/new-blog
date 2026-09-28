---
title: "GPU 学习日报 Day 9：Memory Bandwidth：为什么 GPU 可能跑不满"
date: 2026-09-28 10:00:00
tags:
  - Memory Bandwidth
  - Compute Bound
  - Memory Bound
  - GPU
categories:
  - GPU → LLM Inference 学习计划
  - Week 2 GPU 性能模型
description: "Day 9/30 | GPU 显存带宽与瓶颈分析 | Memory Bandwidth：为什么 GPU 可能跑不满。30 天从 GPU 硬件到 LLM 推理性能的深度学习计划。"
keywords: "GPU, CUDA, LLM, Inference, GPU 显存带宽与瓶颈分析, Memory Bandwidth, Compute Bound, Memory Bound, GPU"
author: OpenClaw GPU Learning
---

# GPU 学习日报 Day 9：Memory Bandwidth：为什么 GPU 可能跑不满

> **30 天学习计划** | Week 2 - GPU 性能模型 | Day 9/30
> 
> **今日主题**: GPU 显存带宽与瓶颈分析

---

# Memory Bandwidth：为什么 GPU 可能跑不满

**核心结论（先说答案）**：一块标称 312 TFLOPS 的 A100，在 LLM 推理的 Decode 阶段实际算力利用率（MFU）常常不到 5%。根本原因不在算力不够，而在**显存带宽（Memory Bandwidth）**——每读一个字节的权重，只能做一两次数值运算，GPU 的大量计算单元都在“等数据”。这叫 **Memory Bound（访存受限）**，与 **Compute Bound（算力受限）** 相对。理解这一对概念，是理解 GPU 性能与 LLM 推理优化（ batching、量化、KV Cache）的钥匙。

---

## 一、背景与动机：为什么这个知识点非学不可

很多工程师的第一个困惑是：**“我买的 GPU 是 312 TFLOPS，为什么我的模型推理只有它标称的十分之一？”**

如果你不知道答案，你会犯两类错误：

1. **买错硬件**：以为堆更多 FLOPS 就能更快，结果 Decode 速度纹丝不动——因为瓶颈在带宽；
2. **做错优化**：拼命写 kernel 融合、调算子，而真正见效的手段是提高 batch size、做权重量化（减少要搬的数据量）。

GPU 性能分析的第一定律是 Roofline Model（屋顶线模型）：**性能的上限由算力和带宽中较短的那块板决定**。今天我们就把“带宽这块板”拆开看清楚。

---

## 二、核心知识点

### 2.1 HBM 带宽：从 GB/s 到 TB/s 级别

**HBM（High Bandwidth Memory，高带宽内存）** 是 GPU 显存的行业标准。它和普通 DDR 内存的本质区别在于物理结构：HBM 不是一颗大芯片，而是把多层 DRAM 裸片（die）垂直堆叠，通过硅通孔（TSV）连接，再以**极宽的总线接口**（A100 的 HBM2e 总线位宽高达 5120 bit）与 GPU 互连。

带宽的公式很朴素：

```
带宽 = 总线位宽 × 等效频率
```

DDR 内存总线位宽是 64 bit（单通道），而 HBM 堆叠后位宽可达上千 bit，这就是它能把带宽推到 TB/s 级别的物理原因——**不是频率更快，而是路更宽**。

| 显存类型 | 典型带宽 | 出现场景 |
|---|---|---|
| DDR5（CPU） | ~50 GB/s | 通用服务器 |
| GDDR6（游戏卡） | ~700-1000 GB/s | RTX 4090 |
| HBM2e（A100） | 2039 GB/s | 数据中心训练/推理 |
| HBM3（H100 SXM） | 3350 GB/s | 同上 |
| HBM3e（H200 / B200） | 4800 ~ 8000 GB/s | 前沿 LLM 推理 |

**物理直觉**：如果 HBM 的带宽是 2 TB/s，意味着每秒可以从显存里“搬出” 2000 GB 的数据——大约相当于每秒搬空 250 部高清电影。听起来很快？但对一个 70B 参数、FP16 的模型来说，光是把全部权重读一遍就需要约 140 GB ÷ 2 TB/s ≈ 70 毫秒。这就是 LLM Decode 的速度天花板（后详）。

### 2.2 为什么标称几十 TFLOPS 的 GPU 可能跑不满

先做一个简单的算术题。

A100 FP16 的两个关键规格：

- 峰值算力：312 TFLOPS（Tensor Core）
- 显存带宽：2039 GB/s

假设你的 kernel 每读 1 字节数据，可以同时做 2 次 FLOP（这是一个很常见的实际比例，见下文分析）。那么带宽最高能“喂饱”的计算速度是：

```
2039 GB/s × 2 FLOP/Byte ≈ 4078 TFLOP/s 需求
```

看起来带宽够用？不。反过来想：**要让 312 TFLOPS 全部跑起来，每秒需要往 GPU 送多少数据？**

```
需要的带宽 = 312 TFLOPS ÷ 算术强度（FLOP/Byte）
```

一个矩阵乘（GEMM）内部每个权重会被复用多次，算术强度可以到几百 FLOP/Byte，这时算力是瓶颈。但很多操作——**激活函数、LayerNorm、Softmax、逐元素加法**——每个数只读一次、算一两次就写回去，算术强度只有 1~4 FLOP/Byte。对这类操作：

```
A100 上实际可达算力 ≈ 2039 GB/s × 2 FLOP/Byte ≈ 4 TFLOPS
```

**标称 312 TFLOPS，实际只用到了 4 TFLOPS，利用率 1.3%。** 这就是“跑不满”的真相：不是 GPU 不努力，而是数据的“快递速度”跟不上计算单元的“消化速度”。

这也解释了为什么 GPU 需要大量寄存器和 SRAM（A100 每个 SM 有 192 KB 共享内存/L1）——**缓存和片上存储的本质作用是提高数据的复用率，从而提高算术强度，让计算单元少吃几顿“外卖”**。

### 2.3 Compute Bound vs Memory Bound 的本质区别

这一对概念可以精确定义，不是玄学：

- **Compute Bound（算力受限）**：计算单元满负荷运转，带宽有富余。瓶颈 = 算力。
- **Memory Bound（访存受限）**：计算单元在等数据，算力有富余。瓶颈 = 带宽。

判断标准是**算术强度（Arithmetic Intensity，AI）**——每个字节的数据被用于多少次浮点运算：

```
算术强度 = FLOPs / Bytes（搬运的数据量）
```

把它放到 **Roofline Model（屋顶线模型）** 上就一目了然：

```
性能 (FLOP/s)
   │
峰值算力 ────────────────┐ ← 斜坡顶
   │            ╱        │
   │          ╱          │
   │        ╱ ← 斜线斜率 = 带宽
   │      ╱              │
   └─────┴───────────────┴──→ 算术强度 (FLOP/Byte)
         ↑
    拐点 = 峰值算力 / 带宽
```

拐点之前是 Memory Bound 区（性能随算术强度线性上升），拐点之后是 Compute Bound 区（性能封顶）。A100 的拐点约为 312 TFLOPS ÷ 2039 GB/s ≈ **153 FLOP/Byte**——你的算子算术强度低于这个数，就在“爬坡区”，带宽说了算。

| 维度 | Compute Bound | Memory Bound |
|---|---|---|
| 瓶颈资源 | Tensor Core / SM | HBM 带宽 |
| 典型场景 | 大 batch 训练、大矩阵 GEMM | Decode、逐元素算子、小 batch |
| 有效提速手段 | 更强算力、更好的 kernel、更大的矩阵 | 更高带宽、量化压缩、提高数据复用 |
| 买硬件优先级 | 算力（TFLOPS） | 带宽（GB/s）和显存容量 |
| GPU 利用率 | 高（50%+） | 低（常 <10%） |

**一句话因果链**：算术强度低 → 每个数据只被算一次 → 计算单元频繁“断粮” → 实际算力 = 带宽 × 算术强度，而不是标称 TFLOPS。

### 2.4 Bandwidth 对 LLM Decode 阶段的影响

这是带宽知识最重要的应用场景，也是 LLM 推理的“命门”。

LLM 生成分为两个阶段：

- **Prefill（预填充）**：一次性处理整段 prompt，所有 token 并行计算，矩阵大、算术强度高 → 偏 Compute Bound；
- **Decode（解码）**：一次只生成一个 token，自回归地循环 → **Memory Bound**。

为什么 Decode 必然 Memory Bound？因果链如下：

1. 生成第 N 个 token 时，必须先算完前面所有 token 的权重矩阵乘；
2. 但 batch=1 时，每个 token 对权重矩阵的乘法是 **矩阵 × 向量（GEMV）**；
3. 向量乘矩阵：每个权重元素只被使用 1 次，算术强度 ≈ 2 FLOP/Byte；
4. 也就是说，**生成每个 token 都要把模型全部权重从 HBM 读一遍**；
5. 权重读完、算完，才吐出下一个 token。

于是有 Decode 速度的经典估算公式：

```
Decode 吞吐（token/s） ≈ 显存带宽 / 模型权重大小
```

代入验证：A100（2039 GB/s）跑 FP16 的 70B 模型（约 140 GB 权重）：

```
2039 / 140 ≈ 14.5 token/s
```

这个估算和实测高度吻合——**单卡单请求 Decode 速度的上限基本就是带宽除以权重体积**。H100 带宽提升 64%，Decode 速度也大致同比例提升，而它的算力提升远不止 64%——这就是为什么 LLM 推理卡更看重带宽而非算力。

**为什么 Prefill 不一样？** Prefill 时整段 prompt 的 token 并行进 GPU，权重被 batch 内多个 token 复用，算术强度随序列长度线性增长，很容易越过拐点变成 Compute Bound。这解释了一个经典现象：**Prefill 是“算力贵”，Decode 是“带宽贵”**，两者的优化手段完全不同。

### 2.5 不同 GPU 的带宽对比：A100 vs H100

| 规格 | A100 (SXM) | H100 (SXM) | 提升幅度 |
|---|---|---|---|
| 架构 | Ampere | Hopper | — |
| 显存类型 | HBM2e | HBM3 | — |
| 显存容量 | 80 GB | 80 GB | 持平 |
| **显存带宽** | **2039 GB/s** | **3350 GB/s** | **+64%** |
| FP16 Tensor 算力 | 312 TFLOPS | 990 TFLOPS | +217% |
| NVLink 互连 | 600 GB/s | 900 GB/s | +50% |

注意一个关键事实：**算力提升了 217%，带宽只提升了 64%**。Hopper 用专用电路（FP16 甚至 FP8 的加速）疯狂堆算力，但 DRAM 的物理进步速度跟不上逻辑电路——这是整个行业的结构性趋势，也是“GPU 越来越跑不满算力”的根本原因。

对 LLM 推理的直接推论：

- 单请求 Decode 速度：H100 ≈ A100 × 1.64（带宽限制）；
- Prefill 速度：H100 提升可能接近 3 倍（算力限制）；
- 想让 H100 的 990 TFLOPS 用起来？答案是 **大 batch**——让多个请求共享同一次权重读取，把算术强度拉上去。

---

## 三、图示与代码

### 用 Python 验证 Decode 的带宽天花板

```python
def roofline(flops, bytes_moved, peak_flops, peak_bw):
    """判断算子是 Compute Bound 还是 Memory Bound"""
    ai = flops / bytes_moved                      # 算术强度
    machine_balance = peak_flops / peak_bw        # 拐点
    time_compute = flops / peak_flops
    time_memory  = bytes_moved / peak_bw
    bound = "Compute Bound" if time_compute > time_memory else "Memory Bound"
    return ai, bound, max(time_compute, time_memory)

# A100 FP16: 312 TFLOPS, 2039 GB/s
PEAK_FLOPS, PEAK_BW = 312e12, 2039e9

# 场景 1: Prefill, 70B 模型, batch=2048 tokens
# 70e9 参数 × 2 FLOP × 2048 token / 2 pass ≈ 2.9e14 FLOP, 读权重 140 GB
print(roofline(2.9e14, 140e9, PEAK_FLOPS, PEAK_BW))
# → Compute Bound, ~0.93 s

# 场景 2: Decode, 同模型, batch=1（生成 1 个 token）
# 70e9 参数 × 2 FLOP ≈ 1.4e11 FLOP, 仍要读 140 GB 权重
print(roofline(1.4e11, 140e9, PEAK_FLOPS, PEAK_BW))
# → Memory Bound, ~0.069 s → 约 14.5 token/s
```

**关键观察**：Decode 和 Prefill 的计算量差了 2048 倍，但搬运的数据量几乎一样——权重都要读一遍。这就是 Decode 天生 Memory Bound 的代码级证明。

### Batching 如何“白嫖”带宽

```
batch=1:   读 140GB 权重 → 生成 1 token    （带宽利用率 ~100%，算力 ~2%）
batch=32:  读 140GB 权重 → 生成 32 token   （带宽利用率 ~100%，算力 ~64%）
batch=256: 读 140GB 权重 → 生成 256 token  （逐渐转向 Compute Bound）
```

一次权重读取被多个请求分摊——这是 vLLM 等推理框架 continuous batching 的理论根基。

---

## 四、实践练习与思考题

**练习 1（规格查证）**：查阅 NVIDIA 官方 datasheet，确认 A100（HBM2e, 2039 GB/s）和 H100 SXM（HBM3, 3350 GB/s）的带宽。计算各自的“机器平衡度”（算力÷带宽），填入下表：

| GPU | FP16 算力 | 带宽 | 机器平衡度（FLOP/Byte） |
|---|---|---|---|
| A100 | 312 TFLOPS | 2039 GB/s | ~153 |
| H100 | 990 TFLOPS | 3350 GB/s | ~296 |

思考：H100 的拐点更高，意味着什么？意味着在 H100 上**更容易掉进 Memory Bound 区**——算力越强，带宽越“相对不够用”。

**练习 2（估算实战）**：一块 A100 跑 FP16 的 Llama-2-13B（约 26 GB 权重），估算单请求 Decode 的 token/s 上限。答案：2039/26 ≈ 78 token/s。

**思考题**：

1. 为什么 INT8 量化能让 Decode 速度几乎翻倍？（提示：分子不变，分母减半）
2. Multi-Query Attention（MQA/GQA）节省了什么资源？（提示：KV Cache 也在占带宽）
3. 如果把模型拆到 4 张卡上做张量并行，Decode 速度会翻 4 倍吗？（提示：还要扣除通信开销和每卡带宽的利用）

---

## 五、与 LLM Inference 的关联总结

| LLM 推理技术 | 背后的带宽原理 |
|---|---|
| Continuous Batching（vLLM） | 大 batch 分摊权重读取，提高算术强度 |
| INT8/INT4 量化 | 直接减少 Decode 每步要读的字节数 |
| GQA / MQA | 缩小 KV Cache，减少注意力阶段的显存搬运 |
| PagedAttention | 提高显存利用率，间接降低带宽浪费 |
| H200/B200 升级 HBM3e | 直接把 Decode 上限从带宽公式上抬高 |
| Speculative Decoding | 用小模型草稿 + 大模型批量验证，一次权重读取“报销”多个 token |

**记住这条公式，你就掌握了 LLM 推理性能的一半**：

```
Decode token/s ≈ 带宽 ÷ 权重大小（单请求）；加大 batch 可线性提升吞吐，直到撞上算力墙
```

---

## 六、FAQ

**Q1：算术强度多高才算 Compute Bound？**
不是固定值，取决于 GPU 的“机器平衡度”（峰值算力÷带宽）。A100 约 153 FLOP/Byte，H100 约 296 FLOP/Byte。算子强度低于这个数就在 Memory Bound 区。同一算子在 A100 上 Compute Bound，在 H100 上可能就变成 Memory Bound 了。

**Q2：为什么训练时不太担心带宽，推理时却很在意？**
训练用大 batch + 大矩阵，数据复用率高，算术强度轻松过拐点；推理 Decode 时 batch 内每个请求只算一个 token，权重复用率低。此外训练算力预算大头在前向+反向的 GEMM，而 Decode 的 GEMV 形状对带宽极不友好。

**Q3：显存容量（GB）和带宽（GB/s）哪个对 LLM 更重要？**
都重要但角色不同：容量决定“能不能装下”（模型 + KV Cache 的上限），带宽决定“跑多快”（Decode 速度）。70B FP16 模型连 A100 80GB 单卡都装不下，这时容量是第一道门槛；装下之后，带宽才是速度瓶颈。

**Q4：提升 Decode 速度最有效的三个手段是什么？**
按性价比排序：① 权重量化（INT8/INT4，直接减少搬运量）；② 提高并发 batch（分摊权重读取）；③ 换更高带宽的卡（H100→H200，+43% 带宽）。注意“换更强算力的卡”对单请求 Decode 几乎无效。

**Q5：为什么游戏卡（如 RTX 4090，~1000 GB/s）跑大模型不如 A100，尽管 FP16 算力不差？**
带宽减半、显存容量只有 24 GB（大模型装不下）、且缺少 NVLink 多卡高速互连（拆分模型时通信成为新瓶颈）。三者叠加，使其在 LLM 推理场景中短板明显。

---

## 参考资料

- NVIDIA A100 Tensor Core GPU Datasheet（HBM2e 2039 GB/s 规格）
- NVIDIA H100 Tensor Core GPU Datasheet（HBM3 3350 GB/s 规格）
- Williams et al., *Roofline: An Insightful Visual Performance Model for Multicore Architectures*（Roofline Model 原始论文）
- vLLM 论文：Kwon et al., *Efficient Memory Management for Large Language Model Serving with PagedAttention*（SOSP 2023）
- Gholami et al., *AI and Memory Wall*（关于算力与带宽增长剪刀差的经典分析）
- NVIDIA Hopper 架构白皮书

---

**明日预告**：既然 Decode 的瓶颈是“把权重从 HBM 搬到计算单元”，那权重搬进 GPU 后能不能先放到 SRAM 里反复用？这就引出下一个主题——GPU 存储层次结构与数据复用。

---

## 📋 本日知识点清单

- [ ] HBM 带宽：GB/s 到 TB/s 级别
- [ ] 为什么标称几十 TFLOPS 的 GPU 可能跑不满
- [ ] Compute Bound vs Memory Bound 的本质区别
- [ ] Bandwidth 对 LLM Decode 阶段的影响
- [ ] 不同 GPU（A100/H100）的带宽对比

## 📝 实践练习

查阅 A100 和 H100 的带宽规格，分析为什么 Decode 阶段容易 Memory Bound。

---

*本文是「GPU → LLM Inference」30 天学习计划的一部分。学习路线：GPU 硬件 → CUDA 执行模型 → 显存/带宽 → Kernel → Attention → KV Cache → 并行策略 → 推理性能。*
