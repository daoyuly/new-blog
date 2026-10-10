---
title: "GPU 学习日报 Day 21：FlashAttention：GPU Memory Hierarchy 下的 IO 优化"
date: 2026-10-10 10:00:00
tags:
  - GPU 学习日报
  - FlashAttention
  - IO 优化
  - Tiling
  - SRAM
  - GPU
categories:
  - GPU → LLM Inference 学习计划
  - Week 3 从 GPU 进入 LLM
description: "Day 21/30 | FlashAttention 原理 | FlashAttention：GPU Memory Hierarchy 下的 IO 优化。30 天从 GPU 硬件到 LLM 推理性能的深度学习计划。"
keywords: "GPU, CUDA, LLM, Inference, FlashAttention 原理, FlashAttention, IO 优化, Tiling, SRAM, GPU"
author: OpenClaw GPU Learning
---

# GPU 学习日报 Day 21：FlashAttention：GPU Memory Hierarchy 下的 IO 优化

> **30 天学习计划** | Week 3 - 从 GPU 进入 LLM | Day 21/30
> 
> **今日主题**: FlashAttention 原理

---

# FlashAttention：GPU Memory Hierarchy 下的 IO 优化

**核心结论（30 秒版）**：FlashAttention 不是一个新的 Attention 数学公式，计算量（FLOPs）与标准 Attention 完全相同——它是一次纯粹的 **IO 优化（IO-Awareness）**。它利用 GPU 上 SRAM 比 HBM 快一个数量级以上的特性，通过 **分块计算（Tiling）** 和 **在线 Softmax（Online Softmax）** 两个技术，让 Attention 的中间矩阵（N×N 的 S 和 P 矩阵）永远不落回高带宽内存（HBM），从而把显存占用从 O(N²) 降到 O(N)，把实际运行速度提升 2~4 倍。理解 FlashAttention 的关键是理解一个物理事实：**在现代 GPU 上，很多时候搬运数据的成本远高于计算的成本（Memory-Bound）**。

---

## 一、背景与动机：为什么必须学这个

如果你训练或推理过长序列模型，一定会遇到两个痛点：

1. **显存爆炸**：Sequence Length 从 2K 涨到 32K，标准 Attention 的中间矩阵按 N² 增长，4090 的 24GB 显存根本存不下。
2. **速度上不去**：你买了 A100，理论算力 312 TFLOPS，但自己手写的 Attention 只能跑到 5% 的利用率。

这两个痛点指向同一个根源：**Attention 的实现方式与 GPU 的内存层级（Memory Hierarchy）严重不匹配**。FlashAttention（Tri Dao 等，2022）是第一个系统性解决这个问题的工程方案，如今已是 PyTorch (`torch.nn.functional.scaled_dot_product_attention`)、vLLM、Transformers 库的默认选项。

不理解 FlashAttention，你就无法理解为什么长上下文推理的瓶颈、PagedAttention 的设计动机、以及 KV Cache 管理的种种取舍。它是 LLM 推理性能优化的地基。

---

## 二、先建立物理直觉：GPU 的内存层级

### 2.1 关键概念：Memory Hierarchy（内存层级）

GPU 内部不是一个统一的“大内存”，而是一个金字塔：

| 层级 | 位置 | 容量（A100） | 带宽 | 直觉类比 |
|---|---|---|---|---|
| **SRAM / Shared Memory（片上静态内存）** | 芯片内部 | 约 20 MB（FA2 可用约 192KB/SM） | 约 19 TB/s | 你的办公桌 |
| **HBM（High Bandwidth Memory，高带宽显存）** | 芯片外部 | 40~80 GB | 约 1.5~2 TB/s | 公司仓库 |
| 主机内存（DRAM） | 主板上 | 数百 GB | 数十 GB/s | 异地仓库 |

两个决定性的事实：

- **速度差约 10 倍以上**：SRAM 带宽是 HBM 的 10 倍以上，延迟差上百倍。
- **容量差约 1000 倍**：SRAM 只有 MB 级，HBM 才有几十 GB。

这就是所有 GPU 性能优化的核心矛盾：**快的太小，大的太慢**。

### 2.2 关键概念：Compute-Bound vs Memory-Bound（算力受限 vs 带宽受限）

一个 kernel 的实际耗时取决于两条腿中较短的那条：

- **Compute-Bound（算力受限）**：计算单元在满负荷运转，数据早就备好了。大矩阵乘法（GEMM）通常属于这类。
- **Memory-Bound（带宽受限）**：计算单元大部分时间在**等数据**到位。Element-wise 操作、Softmax、以及——标准 Attention。

判断公式很直观：

```
算术强度 (Arithmetic Intensity) = FLOPs / 传输字节数
若 算术强度 < 机器比值(FLOPs/带宽) → Memory-Bound
```

**判断**：标准 Attention 在常见配置下是典型的 Memory-Bound 操作。这就是 FlashAttention 存在的理由。

---

## 三、传统 Attention 的 HBM 往返问题

### 3.1 标准实现的数据流

先回忆标准 Attention 的计算：

```
S = Q @ K^T / sqrt(d)      # N×N 矩阵
P = softmax(S)              # N×N 矩阵
O = P @ V                   # N×d 矩阵
```

其中 N 是 sequence length，d 是 head dimension。

问题在哪？看每一步与 HBM 的交互（假设一次性读入 Q、K、V）：

```
HBM → 读 Q, K         → 计算 S = QK^T     → S 写回 HBM   (N² )
HBM → 读 S            → 计算 P = softmax(S) → P 写回 HBM   (N² )
HBM → 读 P, V         → 计算 O = PV        → O 写回 HBM   (N×d)
```

### 3.2 为什么这是灾难

三个层面的坏处：

1. **额外显存**：S 和 P 都是 N×N。N=8192、batch=8、16 个 head 时，一个 N² 矩阵（fp16）就是 8×16×8192²×2 字节 ≈ 16 GB。训练时还要保存 P 用于反向传播，更是雪上加霜。
2. **额外 IO**：N² 的矩阵写了又读、读了又写。以 A100 的 1.5 TB/s 带宽算，N=4K 时光搬运 S 和 P 就要消耗数百毫秒级的时间——而真正的矩阵乘法 FLOPs 其实不多。
3. **计算单元闲置**：Softmax 是逐元素的归约操作，算术强度极低，GPU 的 Tensor Core 大量时间在空转。

**因果链条**：中间矩阵必须落 HBM（太大放不进 SRAM）→ 产生额外 IO → Attention 变成 Memory-Bound → GPU 利用率低 + 显存随 N² 增长。

FlashAttention 的思路就是在第一环动手：**让中间矩阵根本不产生、不落盘**。

---

## 四、FlashAttention 的核心：Tiling（分块计算）

### 4.1 关键概念：Tiling（分块 / 算子融合）

Tiling 不是新概念——它就是“把大矩阵切成能放进 SRAM 的小块，一块块算完写回”。FlashAttention 的挑战在于：**Softmax 是沿整个 K 维度的归约操作（需要看到全行的 S 才能算）**，切了块怎么算 Softmax？

FlashAttention 的答案是两步：

1. **Tiling**：把 Q、K、V 分成 block（如 K、V 每块 128 行），Q 的每个 block 与所有 K/V block 依次配对计算，全部在 SRAM 内完成。
2. **Online Softmax**：一套数学技巧，让 Softmax 可以“增量式”地算——每来一个新块，不重算之前的，只做修正。

### 4.2 数据搬运路径对比

```
Standard Attention（3 次 kernel，2 次全量落盘）:

  Q,K,V ──HBM──→ [kernel1: QK^T] ──S(N²)──→ HBM
  S     ──HBM──→ [kernel2: softmax] ──P(N²)─→ HBM
  P,V   ──HBM──→ [kernel3: PV] ──O──→ HBM

FlashAttention（1 个 kernel，中间矩阵不落盘）:

  Q块,K块,V块 ──HBM→SRAM──→ [QK^T + OnlineSoftmax + PV 全在SRAM内]
                             ↓ 只输出累积结果 O (N×d)
                             HBM
```

显存占用对比：

| | Standard Attention | FlashAttention |
|---|---|---|
| 额外中间显存 | O(N²) | O(N) |
| HBM 读写量 | O(N² + Nd) | O(Nd)（约快 7.5 倍 IO，N 大时更多） |
| Kernel 数量 | 3 个 | 1 个（全融合） |
| 实测速度 | 基线 | 2~4× |

---

## 五、Online Softmax：FlashAttention 的数学引擎

### 5.1 问题的本质

普通 Softmax：

```
softmax(x)_i = e^{x_i} / Σ_j e^{x_j}
```

它需要**先看到所有 x_j 才能算分母**。传统数值安全的写法还要先算全局最大值 m（防止 e^{x} 上溢），即“两遍扫描”：第一遍求 max，第二遍求和、归一化。这在分块场景下意味着要么存住所有块，要么重扫——都不行。

### 5.2 关键技巧：带修正项的增量更新

Online Softmax 的核心观察：**Softmax 结果对“分子分母同时乘以同一个数”是不变的**。

于是我们可以维护两个统计量，随着新块到来滚动更新：

- `m_new`：到目前为止见过的最大值
- `l_new`：带修正的指数和

假设已处理到旧块，统计量为 `m_old, l_old`；新块来了，局部 max 为 `m_block`：

```
m_new  = max(m_old, m_block)
l_new  = e^{m_old - m_new} · l_old  +  Σ_block e^{x_i - m_new}
         └── 修正项：旧的统计量"贬值"到新的尺度 ──┘
```

那个 `e^{m_old - m_new}` 就是**修正因子（rescaling factor）**。因为分子分母同乘一个数不改变结果，所以旧的部分算出来的中间结果不需要重算，只需要按比例“缩放”一下。

### 5.3 扩展到 Attention：多维护一个累积输出

FlashAttention 在此之上还要算 `O = P @ V`，即 Softmax 加权求和。它多维护一个累积输出 `O_acc`，同样带修正：

```
# 对每个新的 (K块, V块)，在 SRAM 内：
S_block  = Q_block @ K_block^T / sqrt(d)
m_new    = max(m_old, rowmax(S_block))
l_new    = e^{m_old - m_new} * l_old + rowsum(e^{S_block - m_new})
O_acc    = e^{m_old - m_new} * O_acc + e^{S_block - m_new} @ V_block
# 循环结束后：O = O_acc / l_new  （最后才归一化）
```

注意一个精妙之处：`e^{S_block - m_new} @ V_block` 可以直接复用为矩阵乘法喂给 Tensor Core——数学修正与硬件加速完美结合。整个过程中，N×N 的 S 矩阵只以 block 大小存在于 SRAM 中，从未完整存在过。

### 5.4 一个直观类比

想象你在算“班级平均分”，但成绩单分批发给你。普通 Softmax 相当于“必须收齐所有成绩才能开始算”。Online Softmax 相当于你维护一个“当前最高分 + 当前总和”，每来一批新成绩，只需把之前的总和按新最高分折算一下，再加上新批次即可。**信息分批到达 ≠ 计算必须推迟到最后**。

---

## 六、FlashAttention-2 的改进

FlashAttention-1 证明了方向正确，但实测 GPU 利用率只有约 25~40%（理论 GEMM 效率的 50~70% 还达不到）。FlashAttention-2（2023）针对三个瓶颈做了手术：

| 维度 | FlashAttention-1 的问题 | FlashAttention-2 的改进 |
|---|---|---|
| **并行度** | 只在 batch × head 维度并行；长序列时 SM 大量空转 | 额外沿 **sequence length 维度并行**（每个 Q block 由一个 thread block 处理，Q 的行块互相独立） |
| **线程内数据流** | 每个 thread 处理 K/V 的 4 行，频繁访问 shared memory | 每个 thread 处理 **Q 的行**，K/V 列在 SM 内共享，减少 SRAM 读写 |
| **Warp 分工** | 所有 warp 做同一件事，shared memory 同步多 | **Warp 特化**：不同 warp 分别负责 GEMM（QK^T 和 PV），减少同步开销 |
| **非因果计算浪费** | 因果掩码下仍有部分无效块计算 | 尽量跳过被 mask 的块，只对部分遮蔽的块做精细 mask |

结果：FA2 在 A100 上达到约 50~73% 的理论最大 FLOPs 利用率（前向），端到端训练速度比 FA1 再快约 2 倍。**核心思路没变，变的是“怎么把活儿更均匀地分给 GPU 里的每个计算单元”。**

后续的 FlashAttention-3（针对 Hopper 架构，利用异步执行和 FP8）继续沿用这一路线，说明 “IO-aware 算子设计” 是一个长期范式而非一次性 trick。

---

## 七、性能差异：不同 Sequence Length / Batch / GPU 下的表现

理解 FlashAttention 的适用边界同样重要。

| 场景 | 表现 | 原因 |
|---|---|---|
| **长序列（N ≥ 2K）** | 提速最显著，2~4× | N² 的 HBM 往返成本占主导，消除收益最大 |
| **短序列（N < 512）** | 提升有限，甚至与标准实现持平 | 中间矩阵小，IO 本来就不是瓶颈；kernel 启动开销占比升高 |
| **大 batch** | 提速稳定 | 总 IO 量大，融合 kernel 的收益充分兑现 |
| **小 batch + 长序列** | 收益最大 | 显存从 O(N²) 降到 O(N) 可能是“能不能跑”的问题而非快慢问题 |
| **A100/H100（HBM 带宽高）** | 相对提升明显 | Memory-Bound 越严重，IO 优化收益越大 |
| **旧 GPU（如 V100）** | 提升较小 | SRAM 小（96KB/SM 限制更紧），Tiling 空间受限，且缺少关键指令支持 |

**一个反直觉的点**：FlashAttention 的 FLOPs 其实比标准实现**略多**（要计算 rescaling 修正项、某些块可能重复算 exp）。它更快完全是因为省下的 IO 远大于多出的计算。这是 "IO-Aware Algorithm Design" 最生动的教材：**在 Memory-Bound 的场景下，减少数据搬运比减少浮点运算更值钱。**

---

## 八、实践练习

### 练习 1：画出数据搬运路径（本日任务）

用 ASCII 图（或纸笔画）分别画出 Standard Attention 和 FlashAttention 的数据流，必须体现：

- 每条箭头跨越的是 SRAM↔HBM 边界还是寄存器↔SRAM 边界
- N² 矩阵（S、P）出现在哪一层、出现几次
- Kernel 边界（每次跨界同步都是一个 kernel）

参考答案骨架见上文第 4.2 节，重点是数一数 Standard 版本中 N² 数据穿过了多少次 HBM 边界（答案：写 2 次 + 读 2 次 = 4 次）。

### 练习 2：手推 Online Softmax

用 Python 模拟验证 Online Softmax 与两遍扫描 Softmax 结果一致（误差 < 1e-6）：

```python
import numpy as np

def online_softmax(x, block=4):
    m, l, out = -np.inf, 0.0, np.zeros_like(x)
    for i in range(0, len(x), block):
        xb = x[i:i+block]
        m_new = max(m, xb.max())
        scale = np.exp(m - m_new)          # 修正因子
        p = np.exp(xb - m_new)
        l = l * scale + p.sum()
        out[:i] *= scale                   # 修正之前的输出
        out[i:i+block] = p
        m = m_new
    return out / l

x = np.random.randn(1000) * 10
assert np.allclose(online_softmax(x), np.exp(x - x.max()) / np.exp(x - x.max()).sum())
```

### 思考题

1. FlashAttention 的 FLOPs 比标准实现更多，为什么反而更快？
2. 如果 SRAM 无限大且带宽与 HBM 一样快，FlashAttention 还有意义吗？
3. 因果掩码（Causal Mask）下，FlashAttention-2 能省掉约多少无效计算？提示：下三角。
4. 为什么 FA2 把并行维度从 batch×head 扩展到 sequence length？（提示：考虑 batch 小、序列长的训练场景）

---

## 九、与 LLM Inference 的关联

FlashAttention 对推理的影响集中在 **Prefill 阶段**和 **长上下文场景**：

1. **Prefill 加速**：Prompt 处理是并行的自注意力计算，N 为 prompt 长度。长 prompt（RAG、长文档）下 FlashAttention 直接决定首 token 延迟（TTFT）。N=32K 时，差距可能是数倍。
2. **Decode 阶段的诚实说明**：Decode 是逐 token 生成，Q 长度为 1，Attention 变成矩阵-向量乘（GEMV），瓶颈在 **KV Cache 的读取**（每生成一个 token 要读整个 KV Cache 一遍）。此时 FlashAttention 的 Tiling 收益减弱——这也是为什么 vLLM 造了 PagedAttention 专门管理 KV Cache，而不是靠 FlashAttention 解决 decode 瓶颈。**Prefill 靠 FA，Decode 靠 KV Cache 管理，两者互补而非替代。**
3. **显存释放**：O(N²)→O(N) 意味着同样的显存可以支持更长的上下文或更大的 batch，间接提升吞吐。
4. **生态地位**：vLLM、TensorRT-LLM、SGLang 的 Attention 后端均基于 FlashAttention（或其变体 FlashInfer）。看懂 FA，才能看懂这些推理框架的 kernel 选择策略。

---

## FAQ

**Q1：FlashAttention 是近似算法吗？会损失精度吗？**
不是近似，是**精确计算**。数学上与标准 Attention 完全等价（浮点累加顺序不同导致极微小的数值差异），可以放心替换。

**Q2：我已经用 PyTorch 了，怎么用上 FlashAttention？**
`torch.nn.functional.scaled_dot_product_attention(q, k, v)` 会自动根据硬件选择 FlashAttention 后端。升级 PyTorch 2.x + 新版 CUDA 即可，无需手动集成。

**Q3：为什么不用更大的 SRAM 从硬件上解决？**
SRAM 越大，制造成本和功耗急剧上升（SRAM 单位面积成本远高于 DRAM），且布线复杂度增加会拖慢频率。内存层级金字塔是物理与经济约束下的最优解，软件必须适应它。

**Q4：FlashAttention-2 和 FlashAttention 有什么本质区别？**
核心算法（Tiling + Online Softmax）完全相同。FA2 的改进全部在**工程并行层面**：并行维度扩展、warp 分工优化、减少 shared memory 同步。是“同一个算法更好的实现”。

**Q5：Decode 阶段 FlashAttention 为什么没那么有效？**
Decode 时 Q 只有 1 个 token，Attention 是矩阵-向量乘，算术强度天然极低，瓶颈是读取 KV Cache 的 HBM 带宽——Tiling 无法减少必须读取的数据量。这正是 PagedAttention / KV Cache 量化 / GQA 等技术在 decode 阶段更受关注的原因。

---

## 参考资料

1. **FlashAttention 论文**：Tri Dao et al., *FlashAttention: Fast and Memory-Efficient Exact Attention with IO-Awareness* (NeurIPS 2022), arXiv:2205.14135
2. **FlashAttention-2 论文**：Tri Dao, *FlashAttention-2: Faster Attention with Better Parallelism and Work Partitioning*, arXiv:2307.08691
3. **官方代码库**：https://github.com/Dao-AILab/flash-attention
4. **Online Softmax 原始思路**：Milakov & Gimelshein, *Online normalizer calculation for softmax*, arXiv:1805.02867
5. **PyTorch 文档**：`torch.nn.functional.scaled_dot_product_attention`（含 FlashAttention 后端说明）
6. **GPU 内存层级参考**：NVIDIA A100 Whitepaper（SRAM/HBM 带宽与容量数据来源）

---

## 📋 本日知识点清单

- [ ] 传统 Attention 的 HBM 往返问题
- [ ] FlashAttention 的 Tiling 思想：HBM → Tile → SRAM → 计算
- [ ] FlashAttention 不是更快的公式而是 IO 优化
- [ ] Online Softmax 的数学技巧
- [ ] FlashAttention-2 的改进
- [ ] 不同 sequence length / batch / GPU 下的性能差异

## 📝 实践练习

画图对比 Standard Attention 和 FlashAttention 的数据搬运路径。

---

*本文是「GPU → LLM Inference」30 天学习计划的一部分。学习路线：GPU 硬件 → CUDA 执行模型 → 显存/带宽 → Kernel → Attention → KV Cache → 并行策略 → 推理性能。*
