---
title: "GPU 学习日报 Day 24：Operator Fusion：合并 Kernel 的性能魔法"
date: 2026-10-13 10:00:00
tags:
  - GPU 学习日报
  - Operator Fusion
  - Kernel
  - RMSNorm
  - SiLU
  - LLM
categories:
  - GPU → LLM Inference 学习计划
  - Week 4 CUDA Profiling + GPU 推理性能
description: "Day 24/30 | 算子融合 | Operator Fusion：合并 Kernel 的性能魔法。30 天从 GPU 硬件到 LLM 推理性能的深度学习计划。"
keywords: "GPU, CUDA, LLM, Inference, 算子融合, Operator Fusion, Kernel, RMSNorm, SiLU, LLM"
author: OpenClaw GPU Learning
---

# GPU 学习日报 Day 24：Operator Fusion：合并 Kernel 的性能魔法

> **30 天学习计划** | Week 4 - CUDA Profiling + GPU 推理性能 | Day 24/30
> 
> **今日主题**: 算子融合

---

# Operator Fusion：合并 Kernel 的性能魔法

**核心结论**：算子融合（Operator Fusion）是 LLM 推理优化中性价比最高的手段之一。它的本质不是“让计算变快”，而是“让数据少跑路”。GPU 的显存带宽（HBM）远慢于计算速度，一个 kernel 读一次数据、算完就写回显存，下一个 kernel 再读一遍——大量时间浪费在搬运上。融合就是把多个 kernel 合并成一个，让中间结果留在片上内存（Shared Memory / 寄存器）里，一次搬运、多次计算。对于 LLM 推理中的访存受限型算子（RMSNorm、激活函数、小矩阵乘），融合可带来 1.3x～3x 的端到端加速；vLLM、TensorRT-LLM 的核心卖点之一就是激进的手工融合。理解 Fusion，就是理解现代 GPU 上“计算便宜、搬运昂贵”这一基本物理事实。

---

## 一、背景与动机：为什么搬运比计算更贵

要理解算子融合，必须先建立一个反直觉的物理直觉：**在 GPU 上，做一次乘加运算的时间，可能只有从显存搬一个数字过来的几十分之一。**

我们看一组 A100 的典型数字：

| 指标 | A100 (SXM) | H100 (SXM) |
|---|---|---|
| HBM 带宽 | ~2.0 TB/s | ~3.35 TB/s |
| FP16 Tensor Core 峰值算力 | ~312 TFLOPS | ~990 TFLOPS |
| **算术强度门槛（Roofline 拐点）** | ~156 FLOP/Byte | ~296 FLOP/Byte |

这意味着：一个算子要想“吃满”GPU，每从显存读 1 字节，至少要完成 150~300 次浮点运算。否则，SM（Streaming Multiprocessor）就在干等数据——这种情况叫**访存受限**。

再看 LLM 推理的实际负载：decode 阶段 batch 小，权重矩阵乘（GEMM）的 M 维度只有 1～8，算术强度天然很低；而 RMSNorm、SiLU、Softmax 这类逐元素/逐行算子，算术强度接近 1 FLOP/Byte——比拐点低了两个数量级。这些算子单独跑，GPU 利用率往往不到 10%。

算子融合（Operator Fusion，中文也常称“核融合”或“kernel 合并”）的动机就在于此：**既然每个 kernel 都要为“读数据→写数据”付出两次带宽代价，那就把流水线上相邻的算子合并，让中间结果根本不落地到显存。**

一个 Transformer decode 层里，隐藏状态要从显存被完��读写多少次？RMSNorm 写一次，QKV 投影写一次，残差加一次……如果全都单独执行，一个 4090 维的 hidden state 在 7B 模型单层中可能被搬运 6~8 次。融合后可以压缩到 2~3 次。

---

## 二、核心原理：从"Kernel Launch"到“数据不落地”

### 2.1 单独执行 vs 融合执行

先看最直观的对比。假设我们要计算 `y = SiLU(x @ W1 + b1) @ W2 + b2`（一个简化的 FFN）：

```
不融合（3 个 kernel）:
                                   HBM（显存）
                                      │
  Kernel 1: x @ W1 + b1  ──写入──▶  中间结果 t   (t: [B, S, H_ff])
  Kernel 2: SiLU(t)      ◀──读取──  中间结果 t
                         ──写入──▶  中间结果 s   (s: [B, S, H_ff])
  Kernel 3: s @ W2 + b2  ◀──读取──  中间结果 s
                         ──写入──▶  y

  显存搬运量：2 × 读t + 2 × 写s + ... ≈ 4 × |t| 字节

融合（1 个 kernel）:
  Fused Kernel:
    tile 从 HBM 读 x 一次
    x @ W1 + b1  （结果留在 Shared Memory）
    SiLU         （原地计算）
    s @ W2 + b2  （结果留在寄存器）
    y 写回 HBM 一次

  显存搬运量：读 x + 写 y ≈ 2 × |x| 字节（t、s 根本不存在于显存）
```

融合的收益来自三个来源：

1. **省带宽**：中间张量不落地，省掉一次写 + 一次读。
2. **省 Launch 开销**：每个 CUDA kernel 启动有 3~10 μs 的固定开销（CPU 端提交、GPU 端调度）。decode 时每个 token 只需 2~5 ms，几十个 kernel 的 launch 开销累积可观。
3. **省 Kernel 尾部空泡**：每个小 kernel 的 grid 通常无法占满 GPU，启动和收尾阶段大量 SM 空转。

### 2.2 融合的前提条件

不是任意两个算子都能融合，需要满足：

- **生产者-消费者相邻**：后一个算子的输入正好是前一个的输出，中间没有全局同步。
- **数据访问模式兼容**：能映射到同一种线程-数据划分方式（比如都是逐元素，或都是按行归约）。
- **数据局部性**：中间结果能装进 Shared Memory / 寄存器，且生命周期局限在当前 tile。

RMSNorm + 残差加、GEMM + SiLU、Softmax 前后的逐元素缩放——这些天然满足条件，是融合的“黄金搭档”。而两个大 GEMM 之间往往需要全局同步（中间结果要参与下一次全量计算），融合收益有限甚至不可行——这也是为什么融合的主要受害者是“小算子”，而不是“大算子”。

---

## 三、LLM 推理中的经典融合案例

### 3.1 RMSNorm Fusion

**RMSNorm**（Root Mean Square Normalization）是 LLaMA 系列模型的标准归一化算子，计算公式为：

```
y = x / sqrt(mean(x²) + ε) * γ
```

它需要对一整行（hidden dimension，如 4096）做**两次遍历**：第一次求 Σx²，第二次做归一化。如果不融合：

```
Kernel 1: sum(x²)        读 x，写标量
Kernel 2: x / rms * γ    读 x（第二次！），写 y
```

x 被读了两次、写了两次。更糟的是，这个算子通常前面还有残差加：`x = residual + attn_out`，然后才做 RMSNorm。**融合版把 Residual Add + RMSNorm 合成一个 kernel**，`x` 只读一次、`y` 只写一次，中间的平方和通过 Warp Shuffle 在片上归约完成。

在 vLLM 的 CUDA 后端中，`rms_norm` 就是这样实现的单 kernel 融合算子。对于 decode 场景（每层两次 RMSNorm），这一项融合可节省数百 GB/s 级别的无效搬运。

### 3.2 SiLU Fusion（GEMM + 激活）

LLaMA 的 FFN 结构是：

```
down(SiLU(gate(x)) * up(x))
```

其中 `gate` 和 `up` 两个 GEMM 常被合并成一个（这是另一种融合：**权重打包融合**，把两个 `[H, H_ff]` 矩阵拼成 `[H, 2*H_ff]`，一次 GEMM 算完，提高算术强度并减少 launch）。而 `SiLU + elementwise mul + down 的 epilogue` 可以融合进 down GEMM 的收尾阶段（epilogue fusion，即 Tensor Core 算完 GEMM 后在写回前顺带做逐元素变换）。

单独执行时，`SiLU(gate(x))` 和 `* up(x)` 的中间结果各需一次完整的显存读写——对于一个 7B 模型，H_ff=11008，一个 token 的中间激活就有 22 KB × 2 次读写 × 几十层，decode 高频调用下浪费显著。

### 3.3 QKV Fusion

**QKV Fusion** 属于“权重层面”的融合：把三个独立的线性投影 `W_q, W_k, W_v` 拼成一个 `W_qkv`，一次 GEMM 输出 `[3*H]`，再在片上切分。

收益逻辑：
- 三个小 GEMM 合成一个大 GEMM，算术强度上升（M 不变，N 变大三倍，权重复用率提高）；
- launch 次数 3 → 1；
- 输出直接进入 Attention kernel，无需中间落地。

几乎所有推理框架（vLLM、TensorRT-LLM、SGLang）都在权重加载时自动完成这个 packing。

### 3.4 Attention Fusion：FlashAttention

**FlashAttention** 是融合思想最极致的典范，值得单独讲透它的因果链。

标准 Attention 计算需要显式构造 `[S, S]` 的注意力矩阵：

```
S = Q @ Kᵀ          → 写 [S,S] 到 HBM
S = S / sqrt(d) + mask
P = softmax(S)       → 读 [S,S]，写 [S,S]
O = P @ V            → 读 [S,S]
```

对于 S=4096，这个矩阵是 4096² × 2 bytes = **32 MB**（fp16），要被完整写一次、读三次。而它的计算量只有 O(S²·d)，算术强度极低——典型访存受限。

FlashAttention 的核心洞察：softmax 的分子（指数和）可以用**流式（online）重缩放**的方式分块累积，不需要看到整行 K/V。于是它把 Q/K/V 分块加载进 Shared Memory，在一个 kernel 内完成“分块 QKᵀ → 局部 softmax 累积 → 分块 PV”，**注意力矩阵从不落入 HBM**：

```
FlashAttention（tiling + online softmax）:
  for each Q block:
    for each K,V block:        # K/V block 从 HBM 读入 SRAM
      S_ij = Q_i @ K_jᵀ        # 在片上计算
      m_new = max(m_old, rowmax(S_ij))
      l_new = l_old·e^(m_old-m_new) + rowsum(exp(S_ij - m_new))
      O_acc   = O_acc·e^(m_old-m_new) + (exp(S_ij-m_new) @ V_j)
    O = O_acc / l_new          # 最后一次性归一化
```

结果：显存访问从 O(S²) 降到 O(S²·d/M)（M 为 SRAM 大小），训练时速度提升 2~4 倍，显存从 O(S²) 降到 O(S)。这就是融合 + 分块算法的威力——**它不只是省搬运，还让原本不可能的长序列 Attention 变得可行**。FlashAttention 证明了融合的上限：当融合与算法重构结合时，性能收益可以从“百分比级”跃升到“倍数级”。

---

## 四、PyTorch 中的融合工具：torch.jit.script 与 torch.compile

### 4.1 两个时代的工具

| 维度 | torch.jit.script | torch.compile |
|---|---|---|
| 引入版本 | PyTorch 1.0（2018） | PyTorch 2.0（2023） |
| 工作方式 | TorchScript IR + 手写优化 pass | FX Graph → **Inductor** 编译器 |
| 融合能力 | 有限的逐元素融合 | 逐元素/归约融合，GEMM epilogue fusion |
| 图获取 | 代码静态解析（script） | Python 字节码追踪（dynamo） |
| 当前状态 | 维护模式，**不推荐新项目使用** | 主流推荐 |
| 典型用法 | `@torch.jit.script` | `model = torch.compile(model)` |

`torch.jit.script` 曾是 PyTorch 唯一的图捕获手段，但其优化能力弱、生态已停滞。今天讨论融合，焦点是 **torch.compile**。

### 4.2 torch.compile 的融合机制

`torch.compile` 的工作流：**Dynamo**（捕获计算图）→ 分解为 ATen 算子 → **Inductor** 生成 Triton kernel。Inductor 的融合策略是：

1. 把计算图切分成节点：GEMM/conv 等重计算节点保持独立（调用 cuBLAS 或 Triton GEMM）；
2. **将逐元素、归约等“小算子”串成链，熔进一个 Triton kernel**；
3. 若逐元素算子恰好紧跟 GEMM，可生成 epilogue 融合版本。

```python
import torch

model = MyTransformerLayer()
compiled = torch.compile(model, mode="max-autotune")  # 自动融合 + autotune

# 查看融合效果：
# TORCH_LOGS="graph_breaks,output_code" python train.py
```

实测中，`torch.compile` 对典型的 Transformer 模型可带来 **30%~100%** 的加速（训练场景），其中大部分来自融合和减少 CPU launch 开销。

### 4.3 关键限制

- **Graph Break**：遇到 Python 动态控制流、数据依赖的 shape 变化时，Dynamo 会断图，融合失效。
- **decode 阶段不是强项**：decode 是小 batch 下的 GEMV 主导，瓶颈在权重搬运，compile 的逐元素融合收益有限；推理框架通常用 CUDA Graph（消除 launch 开销）+ 手写融合 kernel。
- 动态 shape 频繁触发重编译，Serving 场景需配置 `dynamic=True` 或固定 shape bucket。

---

## 五、量化影响：融合到底值多少性能

以一个 7B 模型（LLaMA 结构，hidden=4096，32 层）单层 decode 为例，做一次粗算（每个 token，fp16，2 bytes/元素）：

| 操作 | 不融合的额外显存搬运（单层） | 融合后 |
|---|---|---|
| Residual + RMSNorm | 读 2 ��� + 写 1 次 hidden ≈ 24 KB | 读 2 次 + 写 1 次（必须的），中间归约在片上 |
| SiLU + mul | 写+读 2×11008×2B ≈ 44 KB | 0（GEMM epilogue） |
| QKV 三 GEMM | 3 次 launch，权重分三次读 | 1 次 launch，权重 packing |
| Attention softmax 中间矩阵 | O(S²) 落地 | FlashAttention，不落地 |

粗略估算：不融合时单层有 6~10 次完整的 hidden-state 级显存往返，融合后压到 3~4 次。考虑 decode 的每个 GEMV 本身就受权重带宽限制，这些额外的激活搬运约占总时间的 10%~30%——**端到端 decode 加速通常在 1.2x~1.5x**；加上 FlashAttention，prefill 长序列场景可达 2x~3x。

行业佐证：
- **vLLM** 相比原生 HF Transformers decode 提速 2~4x，其中融合 kernel（fused RMSNorm、fused rotary embedding、fused MLP）是主要来源之一；
- **TensorRT-LLM** 通过手工 CUDA kernel + Graph Capture，在 H100 上把 7B 模型 decode 推到 >10,000 tok/s 级别，其技术清单里融合排第一位；
- NVIDIA 官方数据显示，仅仅 QKV 融合这一项，对小 batch GEMV 场景即可带来 10%~20% 的单层收益。

**明确判断**：如果你的推理服务还在跑“eager 模式 PyTorch + 未融合的自定义算子”，融合是你能拿到的最便宜的性能——不需要改模型、不需要改精度、不需要改算法，只改执行方式。

---

## 六、实践练习与思考题

**练习 1：算子对分析**

对下面这个标准 Transformer decoder layer，列出所有可融合的算子对（组），并标注融合类型：

```
x → [Residual Add] → [RMSNorm] → [QKV Linear] → [RoPE] → [Attention] 
  → [O Linear] → [Residual Add] → [RMSNorm] → [Gate Linear, Up Linear] 
  → [SiLU + Mul] → [Down Linear]
```

参考答案要点：
- Residual+RMSNorm → 融合 kernel（跨算子融合）
- QKV Linear → 权重 packing（结构融合）
- RoPE → 可融合进 QKV 输出的 epilogue 或 Attention kernel 内
- Gate/Up Linear → 权重 packing；SiLU+Mul → down GEMM 的 prologue/独立融合 kernel
- 两个 Residual Add 可融合进相邻 GEMM epilogue

**练习 2：量化估算**

7B 模型，hidden=4096，S=2048，fp16。分别计算： 不融合 Attention 需要多少显存搬运（S² 矩阵读写）？ FlashAttention 分块 SRAM=192KB 时，理论搬运量降到多少？ 思考题：为什么逐元素算子（SiLU、GELU）几乎总能融合，而两个连续的大 GEMM（如 attention output 投影和下一个 residual）通常不融合？

提示：考虑中间结果的“重用量”和是否需要全局同步。

---

## 七、与 LLM Inference 的关联总结

1. **Decode 是访存受限的天下**：小 batch GEMV 算术强度 ~1-2 FLOP/Byte，远低于 Roofline 拐点，所有省带宽的手段都直接转化为延迟收益。
2. **融合是 decode 优化的第一优先级**：优先级排序大致为 权重 packing + 融合 kernel ≈ FlashAttention > CUDA Graph > 量化 > 批处理策略。
3. **Prefill 受益于 Attention 融合**：长序列下 O(S²) 的中间矩阵消除是数量级的改善。
4. **落地路径**：先用 `torch.compile` 白拿收益；生产环境用 vLLM/TensorRT-LLM 的手工融合；自定义模型结构时，学 FlashAttention 的“分块 + 片上累积”模式自己写 Triton kernel。

---

## FAQ

**Q1：算子融合会不会影响数值精度？**
基本不会。融合只是改变中间结果的存放位置（片上 vs 显存），计算本身仍是 fp16/fp32。唯一要注意的是 FlashAttention 的 online softmax 用了重缩放技巧，数值上与标准 softmax 等价（误差在浮点舍入级别）。但某些融合实现会顺手把逐元素算用 fp32 累加中间值，精度反而更好。

**Q2：为什么 torch.compile 有时会让我的模型变慢？**
三种常见原因：Graph break 导致图被切碎，融合失效但多了编译开销；动态 shape 反复触发重编译；编译出的 Triton kernel 在某些 shape 下不如 cuBLAS 手调 kernel（尤其大 GEMM）。用 `TORCH_LOGS=graph_breaks` 排查，或对大 GEMM 部分 fallback 到 eager。

**Q3：融合 kernel 数量越少越好吗？**
不是。过度融合（一个 kernel 做太多事）会导致 Shared Memory 超限、占用率（occupancy）下降、寄存器溢出（register spilling）。融合的最优边界是“中间数据刚好装得进片上内存，且 kernel 仍有足够的并行度”。FlashAttention 根据不同 SRAM 大小提供多个 head_dim 版本，就是权衡的体现。

**Q4：FlashAttention 之后，Attention 还能继续优化吗？**
能。FlashAttention-2/3 优化了 GPU 内部并行（跨 SM 分配、异步拷贝、Tensor Core 利用率）；Flash-Decoding 针对推理 decode 把 KV 的序列维展开成并行维度，解决长 KV 下并行度不足的问题；MLA、GQA 则从“减少 KV 读取量”的角度正交优化。融合、并行、算法压缩三条路可以叠加。

**Q5：自己写融合 kernel 值得吗？**
先确认瓶颈。用 Nsight Systems 看时间线：如果发现大量 5~20 μs 的小 kernel 中间夹着空隙（launch 开销），或者某个逐元素算的 kernel 带宽远低于峰值——那就值得。工具链推荐 OpenAI Triton（比 CUDA C++ 门槛低很多），vLLM 里有大量可学习的融合 kernel 实例。

---

## 参考资料

- FlashAttention 论文：*FlashAttention: Fast and Memory-Efficient Exact Attention with IO-Awareness* (Dao et al., 2022)，arXiv:2205.14135
- FlashAttention-2 论文 (Dao, 2023)，arXiv:2307.08691；FlashAttention-3 (Shah et al., 2024)，arXiv:2407.08608
- PyTorch 官方文档：torch.compile Tutorial 与 Inductor 内部原理（pytorch.org/tutorials）
- vLLM GitHub 仓库：`csrc/` 目录下的 fused kernel 实现（fused RMSNorm、fused MLP、paged attention）
- NVIDIA TensorRT-LLM 文档：Performance Guide 中关于 kernel fusion 的章节
- Roofline Model 原始论文：*Roofline: An Insightful Visual Performance Model* (Williams et al., 2009)
- Triton 官方教程：Layer Norm 与 Fused Softmax 的 fused kernel 实现（triton-lang.org）

---

## 📋 本日知识点清单

- [ ] 多个 Kernel → Fused Kernel 的性能提升
- [ ] RMSNorm Fusion、SiLU Fusion、QKV Fusion、Attention Fusion
- [ ] PyTorch 中的 torch.jit.script / torch.compile
- [ ] FlashAttention 作为 Fused Kernel 的典范
- [ ] Operator Fusion 对 LLM 推理性能的量化影响

## 📝 实践练习

分析一个 Transformer Layer 中可以融合的算子对，估算性能提升。

---

*本文是「GPU → LLM Inference」30 天学习计划的一部分。学习路线：GPU 硬件 → CUDA 执行模型 → 显存/带宽 → Kernel → Attention → KV Cache → 并行策略 → 推理性能。*
