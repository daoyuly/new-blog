---
title: GPU 学习日报 Day 20：Attention 的 GPU 视角：数据在哪里
tags:
  - GPU 学习日报
  - Attention
  - Memory Traffic
  - HBM
  - GPU
  - Arithmetic Intensity
categories:
  - GPU → LLM Inference 学习计划
  - Week 3 从 GPU 进入 LLM
description: >-
  Day 20/30 | Attention 运算的 GPU 重新审视 | Attention 的 GPU 视角：数据在哪里。30 天从 GPU 硬件到
  LLM 推理性能的深度学习计划。
keywords: >-
  GPU, CUDA, LLM, Inference, Attention 运算的 GPU 重新审视, Attention, Memory Traffic,
  HBM, GPU, Arithmetic Intensity
author: OpenClaw GPU Learning
abbrlink: 61788
date: 2026-10-09 10:00:00
---

# GPU 学习日报 Day 20：Attention 的 GPU 视角：数据在哪里

> **30 天学习计划** | Week 3 - 从 GPU 进入 LLM | Day 20/30
> 
> **今日主题**: Attention 运算的 GPU 重新审视

---

# Attention 的 GPU 视角：数据在哪里

**核心结论**：Attention 之所以慢，不在于计算量，而在于数据搬运量。标准 Attention 需要把一个 N×N 的注意力矩阵 S（以及其 Softmax 结果 P）完整写入 HBM 再读回来——这是纯粹的"额外流量"。在 N 较长、batch 较小的典型推理场景下，Attention 的算术强度（Arithmetic Intensity）远低于 GPU 的平衡点，成为典型的访存受限（Memory-Bound）算子。理解了"数据在哪里、搬了多少次"，你就能自然推导出 FlashAttention 的全部动机：**不要让中间结果落地 HBM，在片上 SRAM 里完成"算出来→用掉→扔掉"的循环**。

---

## 一、背景与动机：为什么 Day 20 要回头看 Attention

前三周你大概率已经建立了这样的印象：GPU 是算力怪兽，矩阵乘法（GEMM）是它的主场。但只要跑过长序列推理，你会发现一个反直觉的事实——Attention 层的 FLOPs 只占模型的一部分，耗时却可能占大头，而且 GPU 利用率（SM Occupancy / FLOPs Utilization）反而很低。

原因只有一个：**Attention 的瓶颈在 HBM 带宽，而不是计算核心**。

这个认知非常关键，因为：

1. 它解释了为什么 vLLM 的 PagedAttention、FlashAttention、KV Cache 量化这些优化都在"搬数据"上下功夫，而不是"算得更快"；
2. 它决定了 Decode 阶段（一次生成一个 token）的吞吐上限——这个阶段几乎每一个算子都是 Memory-Bound 的；
3. 它是后续学习 FlashAttention（Day 21+ 常见主题）的必要前置：不理解标准 Attention 浪费在哪里，就无法理解 FlashAttention 节省了什么。

今天我们做的事情很简单：把 QK^T → Softmax → ×V 这个你早已熟悉的公式，放到 GPU 的存储层级（Memory Hierarchy）下重新审视一遍，搞清楚每一步**数据在哪里**。

---

## 二、核心内容

### 2.1 QK^T → Softmax → ×V 的完整数据流

先复习公式的物理含义。给定查询矩阵 Q、键矩阵 K、值矩阵 V（形状均为 N×d，N 是序列长度，d 是每个头的维度，如 64/128）：

```
S = Q @ K^T        # N×N 相似度分数矩阵
P = Softmax(S)     # 逐行 Softmax，归一化
O = P @ V          # N×d 输出
```

在 GPU 上的实际执行序列（标准实现，如早期 PyTorch 的 naive 写法）：

```
HBM (显存)
│
│  ① 读 Q, K                 → 计算 S = QK^T
│  ② 把 S 写回 HBM            (N×N × fp16 = 2N² 字节)
│  ③ 把 S 从 HBM 读回来        → 逐行计算 Softmax
│  ④ 把 P 写回 HBM            (又是 2N² 字节)
│  ⑤ 把 P 从 HBM 读回来        → 计算 O = P @ V
│  ⑥ 把 O 写回 HBM            (2Nd 字节)
▼
```

关键观察：**②③④⑤ 这四步搬运的 N×N 矩阵，在数学上完全不需要存在**。S 算出来只是为了让 Softmax 消费，P 算出来只是为了让 P@V 消费。但标准实现无法在 GPU 内部"即算即用"，因为 Softmax 需要一整行的完整数据（求 max 和 sum 是行内全局归约），而 tile 化的 GEMM 结果分散在不同 CTA 里——最简单的做法就是落地 HBM 再统一读。

### 2.2 数据在哪里？中间结果在哪里？

要回答这个问题，必须先看 GPU 的存储层级（Memory Hierarchy）：

| 层级 | 位置 | 容量（A100/H100 量级） | 带宽 | 访问延迟 |
|---|---|---|---|---|
| 寄存器 Register | SM 内部 | ~256 KB/SM | 极高 | ~1 cycle |
| 共享内存/ SRAM | SM 内部 | 164~228 KB/SM | ~19 TB/s | ~30 cycles |
| L2 Cache | 芯片上 | 40~50 MB | 数 TB/s | ~200 cycles |
| HBM 显存 | 芯片外 | 40~80 GB | 1.5~3.35 TB/s | ~400+ cycles |

**物理直觉**：SRAM 离计算单元近、快，但小；HBM 离得远、慢 10~20 倍，但大。GPU 的算力增长速度（每年约 1.5~2 倍）远超带宽增长（约 1.2~1.4 倍），这个"剪刀差"意味着**越往后的 GPU，访存相对越贵**。

标准 Attention 中各数据的位置：

| 数据 | 形状 | 大小 | 位置 | 是否必要落地 |
|---|---|---|---|---|
| Q, K, V | N×d | O(Nd) | HBM（源头） | 是（输入） |
| S = QK^T | **N×N** | O(N²) | 写入 HBM | **否！** |
| P = Softmax(S) | **N×N** | O(N²) | 写入 HBM | **否！** |
| O = PV | N×d | O(Nd) | HBM（输出） | 是 |

结论清晰了：两个 O(N²) 的中间结果被无必要地往返 HBM 各两次。N=4096、d=128、fp16 时，一个头的 S 和 P 各 32 MB，多个头叠加后，搬运量轻松达到上百 MB——而真正有用的输入输出只有几 MB。

### 2.3 HBM ↔ SRAM 到底搬了多少数据

我们来精确数一数（这是 Day 20 的实践练习，值得动手算）。设序列长度 N、头维度 d、精度 fp16（2 字节）：

**标准 Attention 的 HBM 流量：**

```
读 Q, K (算 S):        4Nd
写 S:                  2N²
读 S (算 Softmax):     2N²
写 P:                  2N²
读 P (算 O):           2N²
写 O:                  2Nd
─────────────────────────────
总计:                  8N² + 6Nd  字节
```

**理想情况（FlashAttention 式，中间结果不落地）最少流量：**

```
读 Q, K, V:            6Nd
写 O:                  2Nd
─────────────────────────────
总计:                  8Nd  字节
```

对比一下 N=4096、d=128：

| 方案 | HBM 流量 | 比值 |
|---|---|---|
| 标准 Attention | 8N²+6Nd ≈ **134 MB** | 32 倍 |
| 最优（不落地中间结果） | 8Nd ≈ **4.2 MB** | 1 倍 |

当 N=16384 时，这个差距扩大到约 **128 倍**。这就是 FlashAttention 论文标题里 "memory traffic 减少" 的定量含义。注意：**计算量一次都没有减少，减少的只是搬运**——FLOPs 完全相同，时间却快了一个量级。

### 2.4 为什么普通 Attention 产生大量 Memory Traffic

把上面的数字翻译成因果链：

1. **中间矩阵是 N×N 的**：序列长度的平方级膨胀，是流量的根源；
2. **Softmax 的全局依赖**：Softmax 分母需要一整行的 max 和 sum，而行是由 GEMM 按 tile 切分、分散在不同计算单元上算出来的。如果 GEMM 的输出不先汇聚到一处（HBM），就没有任何一个执行单元能看到"完整的行"；
3. **Kernel 边界强制落地**：QK^T、Softmax、PV 在标准实现里是三个独立的 CUDA kernel。Kernel 之间的数据交换只有一个通道——全局显存（HBM）。这是 CUDA 编程模型的硬约束：一个 kernel 结束后，它的结果必须写回 HBM，下一个 kernel 才能读。

第三点最容易被忽视。即使单看 QK^T，它在 kernel 内部已经高效利用了 SRAM（GEMM 是标准的 tiling + shared memory 优化）；问题出在**kernel 之间**的 N×N 中间结果必须落地。所以准确的表述是：**标准 Attention 不是算得慢，而是三个 kernel 的"接力棒"太大了**。

FlashAttention 的全部魔法就是把这三次 kernel 融合（Kernel Fusion）成一次，并用 Online Softmax（分块计算、用 running max 和 running sum 修正）绕开"需要整行"的依赖——这是后话，今天先立好动机。

### 2.5 Attention 的 Arithmetic Intensity 分析

Arithmetic Intensity（算术强度，AI）定义：

```
AI = FLOPs / 内存访问字节数    （单位: FLOP/Byte）
```

它是判断算子属于计算受限还是访存受限的核心指标。判断方法：与 GPU 的**平衡点**（Balance Point / Ridge Point）比较：

```
平衡点 = 峰值算力 / 峰值带宽
A100:  312 TFLOPS ÷ 2039 GB/s ≈ 153 FLOP/Byte  (fp16 Tensor Core)
H100:  989 TFLOPS ÷ 3350 GB/s ≈ 295 FLOP/Byte
```

- AI > 平衡点 → Compute-Bound，GPU 算力跑满；
- AI < 平衡点 → Memory-Bound，算力大量闲置，时间由带宽决定。

现在算标准 Attention 的 AI（FLOPs 近似为 4N²d，来自两次 N×d×N / N×N×d 的矩阵乘）：

```
AI_standard ≈ 4N²d / (8N² + 6Nd)

N >> d 时（长序列）:  AI → 4N²d / 8N² = d/2
N=4096, d=128:       AI ≈ 62 FLOP/Byte
```

对比：

| 算子 | Arithmetic Intensity | A100 判定 |
|---|---|---|
| 大矩阵 GEMM | 数百 FLOP/Byte | Compute-Bound ✓ |
| 标准 Attention（长序列） | ≈ d/2 ≈ 62 | **Memory-Bound** ✗ |
| 最优融合 Attention | ≈ 4N²d/8Nd = N/2（随 N 增长） | 长序列下可逼近 Compute-Bound |

注意两个漂亮的结论：

1. **标准 Attention 的 AI 上限是 d/2**——它被头维度锁死，与序列长度无关。d=128 意味着无论 N 多大，你最多只有 64 FLOP/Byte，永远追不上 153 的平衡点；
2. **融合后的 AI 上限变成 N/2**——随序列长度线性增长。这就是"融合后长序列能吃满算力"的数学原因。

```
   FLOP/Byte
      │
  153 ┤····················· 平衡点 (A100)
      │      ┌─────── 融合 Attention (N/2, 随 N 上升)
      │   ───┘
   64 ┤━━━━━━━━━━━ 标准 Attention (d/2, 被锁死)
      │
      └──────────────────→ 序列长度 N
```

Decode 阶段更极端：batch=1、生成单 token 时，Q 只有 1 行，Attention 的 FLOPs 是 O(Nd)，流量是 O(Nd)，AI 只有几个 FLOP/Byte——所以 Decode 是彻头彻尾的 Memory-Bound，这也是 KV Cache 读取成为 Decode 瓶颈的根本原因。

---

## 三、代码/图示

用 PyTorch 写出"标准"三段式实现，注意每行注释了 HBM 行为：

```python
import torch
import torch.nn.functional as F

def standard_attention(Q, K, V):
    # Q, K, V: (batch, heads, N, d)，均已在 HBM
    scores = Q @ K.transpose(-2, -1)          # Kernel 1: S 写回 HBM, 2N² B
    probs  = F.softmax(scores, dim=-1)        # Kernel 2: 读 S + 写 P, 4N² B
    out    = probs @ V                        # Kernel 3: 读 P + 写 O, 2N²+2Nd B
    return out
# HBM 总流量 ≈ 8N² + 6Nd 字节，其中 8N² 是纯浪费

# 对比: PyTorch 2.0 的 F.scaled_dot_product_attention
# 会自动分派到 FlashAttention / Mem-Efficient 融合 kernel
out = F.scaled_dot_product_attention(Q, K, V)   # 流量 ≈ 8Nd
```

数据流 ASCII 图：

```
        ┌──────────────── GPU ────────────────┐
        │  SM0 [SRAM]   SM1 [SRAM]   SM2 ...  │
        │   ▲    │        ▲    │              │
        │   │    ▼        │    ▼              │
        │  ┌──────────────────────┐           │
        │  │        L2 Cache      │           │
        │  └──────────────────────┘           │
        └───────────────┬─────────────────────┘
                        │  ~2 TB/s          S, P 每次往返
                        ▼                    = 8N² 字节
              ┌──────────────────┐
              │   HBM 显存       │  ← 瓶颈所在
              │  Q K V S P O     │
              └──────────────────┘
```

---

## 四、实践练习与思考题

**练习 1（动手算）**：N=8192，d=128，fp16，单头。计算：
- (a) S 矩阵占用多少 MB？
- (b) 标准 Attention 的 HBM 总流量？
- (c) Arithmetic Intensity，并在 A100（153 FLOP/Byte 平衡点）上判断 Bound 类型。

<details>
<summary>参考答案</summary>

(a) 8192×8192×2 B = 128 MB。
(b) 8N²+6Nd = 536 MB + 12.6 MB ≈ 549 MB。
(c) FLOPs = 4N²d ≈ 34.4 GFLOP；AI ≈ 34.4/0.549 ≈ 63 FLOP/Byte < 153 → Memory-Bound。
</details>

**练习 2（用 profiling 验证）**：在 PyTorch 中分别跑上面的 `standard_attention` 和 `F.scaled_dot_product_attention`（N=4096，d=64，一个头），用 `torch.profiler` 对比 kernel 数量和总访存量（`self_device_memory_traffic`）。观察标准版是否出现 3 个以上 kernel、融合版是否只有 1 个。

**思考题**：
1. 为什么增大 batch size 能缓解 Decode 阶段的 Memory-Bound，但对 Prefill 的 Attention 帮助有限？（提示：AI 公式中分子分母如何随 batch 变化）
2. 如果把 fp16 换成 fp8，标准 Attention 的 AI 会变化吗？平衡点呢？
3. MQA/GQA（多查询注意力）减少了什么数据，为什么能加速 Decode？（预告：这正是减少"搬"的另一个方向）

---

## 五、与 LLM Inference 的关联

把今天的分析映射到真实推理场景：

1. **Prefill（处理 prompt）**：N 等于 prompt 长度，Attention 是 O(N²) 的。标准实现下 S/P 的 HBM 流量随上下文长度平方增长——这正是长上下文（128K）推理中 Attention 层耗时占比飙升的直接原因。FlashAttention 的 AI 上限 N/2 在这里直接兑现为吞吐提升。
2. **Decode（逐 token 生成）**：Q 只有 1 行，Attention AI 只有几个 FLOP/Byte，瓶颈变成从 HBM 读取整个 KV Cache（O(Nd) 的读，每生成一个 token 都要读一遍）。今天建立的"看 AI、看流量"的分析框架，是理解 KV Cache 优化（PagedAttention、量化、GQA/MQA）的钥匙——这些手段本质上都是在削减 Decode 阶段的 HBM 读取量。
3. **工程实践**：现代推理引擎（vLLM、SGLang、TensorRT-LLM）全部默认使用融合 Attention kernel。你自己写推理代码时，应使用 `F.scaled_dot_product_attention` 或直接调用 FlashAttention 库，而不是手写 `softmax(q@k.T)@v`——后者在长序列下慢数倍到数十倍，且显存占用多出 O(N²)。

一句话总结今天的收获：**分析 LLM 算子性能，先算 Arithmetic Intensity，再看它离 GPU 平衡点多远**。这个方法论适用于后面要学的所有算子（GEMM、GELU、LayerNorm、RoPE……）。

---

## FAQ

**Q1：Attention 的 FLOPs 没变，为什么 FlashAttention 能变快？**
A：因为它减少的不是 FLOPs，而是 HBM 访存量（从 8N²+6Nd 降到 8Nd）。Memory-Bound 算子的耗时由流量决定，流量减一个量级，时间就减一个量级，即使计算单元干的活完全一样。

**Q2：L2 Cache 不是也有几十 MB 吗，能不能靠它挡住 N×N 中间矩阵？**
A：不能。N=4096 时仅 S 矩阵就 32 MB，多个头和多 batch 叠加后远超 L2 容量；且三个 kernel 之间的依赖需要写-读完整传递。Cache 只能减少重复读，不能消除"必须先写完再读"的结构性流量。

**Q3：为什么说标准 Attention 的 Arithmetic Intensity 上限是 d/2？**
A：AI ≈ 4N²d/(8N²+6Nd)，当 N≫d 时分母被 8N² 主导，AI → d/2。d 是模型结构决定的（如 128），所以标准实现的 AI 被架构"锁死"，加长序列也无法改善——这是数学结论，不是工程调优能解决的。

**Q4：Decode 时 batch 增大为什么能提高吞吐？**
A：Decode 读 KV Cache 的流量对所有 batch 内请求可近似看作各自独立但 GPU 可并行处理，而计算可以共用同一套权重读取。batch 增大使总 FLOPs 增长快于总流量增长，AI 上升，GPU 算力利用率提高——这是"凑批（Batching）"能提升吞吐的量化解释。

**Q5：Softmax 为什么不能直接在 GEMM 的 tile 里算完？**
A：逐行 Softmax 需要整行的 max 和 sum 做归一化，而 GEMM 把一行切到多个 tile 上分别计算。解法是 Online Softmax：维护 running max/sum，每来一块新数据就增量修正——这正是 FlashAttention 融合三个 kernel 的核心技术，我们后面会展开。

---

## 参考资料

1. FlashAttention 论文：*FlashAttention: Fast and Memory-Efficient Exact Attention with IO-Awareness*（Dao et al., 2022）—— 2.1 节的 HBM 流量分析与本文同源
2. NVIDIA A100 白皮书 / H100 白皮书 —— 峰值算力、HBM 带宽、SRAM 容量数据来源
3. PyTorch 官方文档：`torch.nn.functional.scaled_dot_product_attention` —— 融合 kernel 的开箱即用入口
4. *The Illusion of Matrix Multiplication* 与 Roofline Model 相关资料 —— Arithmetic Intensity 与 Balance Point 的原始框架
5. vLLM / PagedAttention 论文：*Efficient Memory Management for Large Language Model Serving with PagedAttention* —— Decode 阶段 KV Cache 访存优化的延伸阅读

---

## 📋 本日知识点清单

- [ ] QK^T → Softmax → ×V 的完整数据流
- [ ] 数据在哪里？中间结果在哪里？
- [ ] HBM ↔ SRAM/Shared Memory 搬了多少数据
- [ ] 为什么普通 Attention 产生大量 Memory Traffic
- [ ] Attention 的 Arithmetic Intensity 分析
- [ ] 引出 FlashAttention 的动机

## 📝 实践练习

分析标准 Attention 的 HBM 访问次数，计算其 Arithmetic Intensity。

---

*本文是「GPU → LLM Inference」30 天学习计划的一部分。学习路线：GPU 硬件 → CUDA 执行模型 → 显存/带宽 → Kernel → Attention → KV Cache → 并行策略 → 推理性能。*
