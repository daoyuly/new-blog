---
title: GPU 学习日报 Day 16：LLM Inference 两个阶段：Prefill vs Decode
tags:
  - GPU 学习日报
  - Prefill
  - Decode
  - LLM Inference
  - KV Cache
categories:
  - GPU → LLM Inference 学习计划
  - Week 3 从 GPU 进入 LLM
description: >-
  Day 16/30 | Prefill 与 Decode 的性能特征 | LLM Inference 两个阶段：Prefill vs Decode。30
  天从 GPU 硬件到 LLM 推理性能的深度学习计划。
keywords: >-
  GPU, CUDA, LLM, Inference, Prefill 与 Decode 的性能特征, Prefill, Decode, LLM
  Inference, KV Cache
author: OpenClaw GPU Learning
abbrlink: 28148
date: 2026-10-05 10:00:00
---

# GPU 学习日报 Day 16：LLM Inference 两个阶段：Prefill vs Decode

> **30 天学习计划** | Week 3 - 从 GPU 进入 LLM | Day 16/30
> 
> **今日主题**: Prefill 与 Decode 的性能特征

---

# LLM Inference 两个阶段：Prefill vs Decode

**核心结论**：LLM 推理被清晰地划分为两个性能特征截然相反的阶段——**Prefill（预填充）**一次性并行处理整个输入序列，是**Compute Bound（算力受限）**的 GEMM 密集型计算；**Decode（解码）**一次只生成一个 token，依赖 **KV Cache** 反复读显存，是 **Memory Bound（访存受限）**的 GEMV 密集型计算。这一对矛盾直接决定了推理系统的优化方向：Prefill 靠算力，Decode 靠带宽，而 **Continuous Batching（连续批处理）**正是为了让两种负载在同一批次内高效混合而诞生的调度机制。理解这条因果链，你就理解了 vLLM 等推理引擎所有设计决策的出发点。

---

## 一、背景与动机：为什么必须把推理拆成两段看

很多初学者对 LLM 推理性能的困惑源于一个隐含的错误假设：把推理当作一个均质的计算过程。于是会出现这样的疑问：

- 为什么 prompt 长了，首字延迟（TTFT）会明显增加，但生成速度却不受影响？
- 为什么显卡标称算力 300 TFLOPS，实际生成时利用率却常常不到 5%？
- 为什么增加 batch size 能大幅提升吞吐，但单条请求的延迟几乎不变？

这三个问题的答案都在同一个地方：**LLM 推理不是一个过程，而是两个物理特性完全不同的过程**。用同一套性能直觉去分析它们，必然得出错误的结论和错误的优化方案。

从 Transformer 自回归生成的工作方式看，这个二分是结构性的，不是人为划分：

```
用户输入: "请解释什么是KV Cache"（8个token）
                    │
     ┌──────────────┴──────────────┐
     ▼                             ▼
  Prefill 阶段                  Decode 阶段
  一次前向，8个token并行        循环N次，每次1个token
  输出第一个生成token            输出后续每个token
                    │
                    ▼
        Prefill计算出的KV存入KV Cache
        后续Decode步直接复用，不重算
```

下面我们逐层拆解。

---

## 二、核心内容

### 2.1 Prefill：大量 Token、并行计算、GEMM 密集

**Prefill（预填充阶段）**指模型处理用户完整输入 prompt 的过程。假设输入 1000 个 token，这 1000 个 token 会**一次性、并行地**通过整个 Transformer。

关键在于理解“为什么能并行”。在自注意力（Self-Attention）中，这 1000 个输入 token 之间的注意力关系是**在它们之间内部计算**的——输入序列内部没有因果依赖（对 prompt 的理解不需要先“读完前一个字”），所以可以作为一个整体做矩阵乘法。

从算子形态看，Prefill 阶段的每一层主要是这样的计算：

```
W 为权重矩阵, X 为 (seq_len × d_model) 的激活矩阵

Q = X · Wq    # (1000 × 4096) · (4096 × 4096) → GEMM
K = X · Wk    # 同上
V = X · Wv    # 同上
O = X · Wo    # 同上
FFN:  (1000 × 4096) · (4096 × 11008)  → 更大的 GEMM
```

这些都是**GEMM（General Matrix Multiply，通用矩阵乘）**：大矩阵乘大矩阵。

GEMM 有一个对 GPU 极其友好的性质——**算术强度（Arithmetic Intensity，每字节内存访问对应的浮点运算次数）很高**。直观理解：把权重矩阵加载到显存里，可以“摊”给几千个 token 的行同时使用。1000 个 token 复用同一份权重，权重加载一次，收益一千次。计算时间远大于搬运数据的时间，GPU 的 CUDA Core 和 Tensor Core 满负荷运转。

这就是 Prefill 的物理直觉：**它是 GPU 最擅长的工作模式，类似训练**。大批量、规则、密集的矩阵乘法，算力利用率（MFU，Model FLOPs Utilization）可以达到 50% 甚至更高。

### 2.2 Decode：一次一个 Token、KV Cache、Memory Access 密集

**Decode（解码阶段）**是逐 token 自回归生成的过程：模型每次前向传播只处理**一个** token，输出下一个 token，然后把新 token 拼回输入，循环往复直到生成结束。

为什么必须一个一个来？因为自回归结构决定了下一个 token 依赖上一个 token 的输出——第 N+1 个 token 在第 N 个 token 生成出来之前，物理上不存在，无法并行。这是**结构性串行**，不是工程上没做好。

但注意一个关键细节：虽然当前 token 只有一个，注意力计算仍然需要对**之前所有 token** 做 attention——历史信息不能丢。如果每一步都重算所有历史 token 的 K 和 V，复杂度会变成 O(n²) 级别的重复计算。于是引入：

**KV Cache（键值缓存）**：把每层每个历史 token 的 Key 和 Value 向量缓存下来，Decode 每步只计算新 token 的 QKV，历史 K/V 直接从显存读取。

KV Cache 的代价是显存占用。以 Llama-2-7B 为例估算：

```
KV Cache 大小 = 2 (K和V) × 层数 × KV头数 × head_dim × seq_len × batch × 精度字节
             = 2 × 32 × 32 × 128 × 4096 × 1 × 2 bytes
             ≈ 2 GB / 每条请求（4K上下文, FP16）
```

再看 Decode 阶段的算子形态。batch size 为 1 时，每步的“矩阵乘”实际上是：

```
x 为单个 token 的激活向量 (1 × 4096)

q = x · Wq    # (1 × 4096) · (4096 × 4096) → 这是 GEMV！
```

**GEMV（General Matrix Multiply-Vector，矩阵-向量乘）**和 GEMM 有本质区别：GEMV 中没有任何 token 可以和你“分摊”权重。权重矩阵几十亿个参数，**为了算一个 token，必须把整个模型权重从显存完整搬一遍**。搬 14 GB（FP16 的 7B 模型）到计算核心，算出来的却只是一个 token 的激活值。

这就是 Decode 的物理直觉：**每生成一个 token，都要为这个 token “支付”一次全模型权重的搬运费**。GPU 的计算单元大部分时间在等数据从 HBM 到达。

### 2.3 Prefill 是 Compute Bound，Decode 是 Memory Bound

现在把因果链收紧。判断一个阶段是算力受限还是访存受限，标准就是**算术强度**与硬件**平衡比（机器平衡值，机器每秒能算的浮点数 ÷ 每秒能搬的字节数）**的对比。

GPU 的典型数字：以 A100 为例，FP16 算力约 312 TFLOPS，HBM 带宽约 2 TB/s，平衡比约 150 FLOP/Byte。也就是说，**算术强度低于 150 的算子，瓶颈在带宽；高于 150 的，瓶颈在算力**。

| 维度 | Prefill | Decode |
|---|---|---|
| 每次前向处理的 token 数 | 整个输入序列（几百~几万） | 1 个 |
| 核心算子 | GEMM（矩阵×矩阵） | GEMV（矩阵×向量） |
| 权重复用 | 数千个 token 分摊一次权重加载 | 1 个 token 独享整份权重搬运 |
| 算术强度 | 高（随 seq_len 增长） | 约 2 FLOP/参数，极低 |
| 瓶颈 | **Compute Bound（算力受限）** | **Memory Bound（访存受限）** |
| GPU 利用率 | 高（MFU 可达 50%+） | 低（常 < 5%） |
| 优化杠杆 | 更强的算力、更大的 batch（直到算力饱和） | 更大的显存带宽、batch 分摊权重搬运 |
| 用户感知指标 | **TTFT（首 token 延迟）** | **TPOT / 吞吐量（逐 token 速度）** |

Decode 算术强度为什么是“约 2”？对于矩阵-向量乘 `y = Wx`，W 有 n² 个参数要读（2n² 字节，FP16），只做 2n² 次浮点运算，算术强度 ≈ 2 FLOP/Byte——离平衡比 150 差了近两个数量级。**这就是为什么 Decode 时 GPU 利用率个位数：不是 GPU 不会算，而是数据喂不过来**。

一个重要的推论：Decode 阶段增加 batch size，多个请求的 GEMV 可以合并成 GEMM，**共用同一次权重搬运**。带宽成本几乎不变，吞吐却成倍增长——这是后面 batching 优化的物理基础。

### 2.4 为什么两个阶段性能特征完全不同：一条因果链

把上面的内容串成一条因果链，建议记住这个推理路径而不是背结论：

```
自回归生成的结构
  → Decode 必须一次一个 token（因果依赖，无法并行）
    → 每步的乘法是 GEMV 而非 GEMM
      → 权重无法在多个 token 间复用
        → 每步都要搬整个模型的权重
          → 算术强度 ≈ 2，远低于硬件平衡比
            → Memory Bound，GPU 算力大量闲置
```

而 Prefill 没有这个因果依赖（输入的 token 都是已知的），可以全并行成 GEMM，权重一次加载被所有 token 复用，算术强度高，所以 Compute Bound。

**一句话版本**：Prefill 的输入是“一堆已知的 token”，可以并行榨算力；Decode 的输入是“一个刚出生的 token”，串行且每步都在为搬运权重付过路费。瓶颈类型不同，导致两阶段的最优配置、调度策略、甚至硬件偏好（Prefill 吃算力、Decode 吃带宽）都不同——现代推理系统把两个阶段分开调度（如 Splitwise、DistServe 的 P/D 分离架构），根源就在这里。

### 2.5 Continuous Batching 的动机

理解了两阶段的特征，**Continuous Batching（连续批处理，又称 iteration-level batching / in-flight batching）**的动机就水到渠成了。

先看传统方案 **Static Batching（静态批处理）**的问题：攒一批请求，一起 prefill、一起 decode，等**整批所有请求都生成完**才返回、才接入新请求。问题是不同请求生成长度差异巨大（有的 10 个 token，有的 2000 个），导致：

1. 短请求早就生成完了，其显存（KV Cache）被占着不用，干等长请求；
2. 批内不断出现的空闲槽位无法及时补充新请求；
3. 新到达的请求必须等整批结束，排队延迟大。

```
Static Batching（t 表示迭代步）:

请求A: ████████████                    (生成20步就完成，之后闲置)
请求B: ████████████████████████████    (最长的决定整批结束时间)
请求C: ██████████████                    (完成后闲置)
       ←───────── 整批一起结束 ─────────→   新请求才能进来

Continuous Batching:

请求A: ████████████
请求B: ████████████████████████████
请求C: ██████████████
请求D:             ▲▲▲▲▲▲▲▲▲▲          (A结束后立刻插入新请求)
                        ▲▲▲▲▲▲▲▲        (C结束后又插入)
```

Continuous Batching 把调度粒度从“整个 batch 的完整生命周期”细化到“**每一次 decode 迭代**”：每做完一步解码，检查哪些请求完成了、哪些显存释放了，立刻把新请求插进来。配合 vLLM 的 **PagedAttention**（分页管理 KV Cache，消灭显存碎片），batch 可以持续保持高水位。

为什么这对 Decode 尤其关键？回顾 2.3 节的推论：Decode 是 Memory Bound，加大 batch 几乎不增加时间成本，却能线性提升吞吐。**Continuous Batching 的本质，就是用高水位 batch 把 Decode 阶段被浪费的带宽利用率“买”回来**。而 Prefill 是 Compute Bound，batch 太大反而会互相争抢算力，所以更精细的系统还会把 Prefill 和 Decode 分开调度、限制每步新插入的 prefill 量（如 chunked prefill），避免长 prompt 的 prefill 阻塞正在 decode 的请求。

---

## 三、代码与图示

用一段 NumPy 风格的伪代码对比两阶段的算子形态：

```python
# ============ Prefill: GEMM，可并行 ============
# 输入 1000 个 token，一次前向
X = embed(prompt_tokens)              # (1000, 4096)
Q = X @ Wq                            # GEMM: (1000,4096)@(4096,4096)
K = X @ Wk                            # 所有 token 的 K/V 一次性算好
V = X @ Wv
kv_cache.update(K, V)                 # 存入 KV Cache
attn_out = softmax(Q @ K.T / sqrt(d)) @ V   # 因果 mask 后的注意力
first_token = lm_head(attn_out[-1])   # 只有最后一个位置产生输出

# ============ Decode: GEMV，逐 token 循环 ============
for step in range(max_new_tokens):
    x = embed(last_token)             # (1, 4096) —— 只有一个 token！
    q = x @ Wq                        # GEMV: 整个 Wq 只服务这 1 个向量
    k = x @ Wk
    v = x @ Wv
    kv_cache.append(k, v)             # 历史不重算，只追加
    attn_out = attention(q, kv_cache.K, kv_cache.V)  # 对全部历史做 attention
    last_token = sample(lm_head(attn_out))
    yield last_token                  # 每循环一次，吐出一个 token
```

注意循环体里 `x @ Wq` 的形状：`(1, 4096) @ (4096, 4096)`。**这一个乘法读入 32MB 的权重矩阵，产出一个 4096 维向量**——数据搬运量与计算量的严重失衡，就是 Memory Bound 的直接来源。

再用 Roofline 模型（屋顶线模型）可视化：

```
性能(TFLOPS)
   │
312┤─────────────────────  ← 峰值算力（Compute Bound 区）
   │                  ／
   │               ／
   │            ／   ← 平衡点: 算术强度 ≈ 150 FLOP/Byte
   │         ／
   │      ／ ← 斜率 = 带宽 2TB/s（Memory Bound 区）
   │＊  ← Prefill: 强度高，落在右上，接近算力上限
   │
   │＊  ← Decode(bs=1): 强度≈2，落在左下深处，
   └────────────────────────→ 算术强度 (FLOP/Byte)
        GPU 时间大部分耗在左下角，算力大量闲置
```

---

## 四、实践练习与思考题

**练习：对比 Prefill 和 Decode 的算力与带宽利用率**

用 Roofline 公式手工估算（以 7B 模型、A100、FP16、seq_len=1000 为例）：

1. **Decode 单步时间下限**：模型权重约 14 GB，带宽 2 TB/s → 每步至少 14GB ÷ 2TB/s ≈ **7 ms**，对应吞吐上限约 140 token/s（不考虑 KV Cache 读取）。查一查你的推理框架实测数字，看离这个理论上限有多远。
2. **算术强度估算**：Decode 单步计算量 ≈ 2 × 7e9 = 14 GFLOP，除以 7 ms ≈ 2 TFLOPS，仅占 312 TFLOPS 峰值的 **0.6%**——Memory Bound 的量化证据。
3. **Batch 的效果**：batch=32 时，权重只搬一次，时间仍约 7 ms，但吞吐变为 32 × 140 ≈ 4500 token/s。亲手算一遍，体会“带宽成本不变、吞吐倍增”。
4. **Prefill 时间估算**：计算量 ≈ 2 × 7e9 × 1000 = 14 TFLOP，除以 312 TFLOPS × 假设 MFU 50% → 约 90 ms，这就是 1000 token prompt 的 TTFT 主要构成。

**思考题**：

- 为什么 Decode 阶段把 batch 从 1 加到 64，首 token 之后的单步延迟几乎不变？而 Prefill 阶段加大 batch，单批延迟却明显上升？
- KV Cache 读取也占用带宽。当上下文很长（如 32K）且 batch 很大时，Decode 的瓶颈会从“搬权重”逐渐转向什么？
- GQA（分组查询注意力）通过减少 KV 头数压缩 KV Cache，它优化的是哪个阶段的什么资源？

---

## 五、与 LLM Inference 的关联

这个知识点是整个 LLM 推理优化领域的**第一性原理**，几乎所有后续主题都建立在这条二分法之上：

- **TTFT 与 TPOT 的分离**：Prefill 决定 TTFT（首字延迟），Decode 决定 TPOT（每 token 延迟）和吞吐。交互式应用优化 TTFT，离线批处理优化吞吐，策略完全不同。
- **KV Cache 管理**：KV Cache 是 Decode 的核心资产，PagedAttention、KV Cache 量化、KV Cache 淘汰策略都围绕它展开。
- **Continuous Batching / PagedAttention**：vLLM 的两大支柱，本质都是“提高 Decode 阶段带宽利用率”。
- **Chunked Prefill 与 P/D 分离**：Prefill 和 Decode 争抢资源（一个吃算力一个吃带宽），于是有了把 prefill 切片、把两阶段部署到不同机器的架构（Splitwise、DistServe、Mooncake）。
- **投机解码（Speculative Decoding）**：用小模型一次猜多个 token、大模型并行验证，本质是把 Decode 的 GEMV 变回 GEMM——直接针对 Memory Bound 的解法。
- **硬件选型**：Decode 吃带宽，所以推理卡看重 HBM 带宽与显存容量，胜过算力峰值。

掌握这一对矛盾，后面的每一项优化你都能迅速回答“它在解决哪一侧的问题”。

---

## 六、FAQ

**Q1：为什么 Decode 阶段 GPU 利用率那么低，却不觉得慢？**
A：因为瓶颈在带宽而非算力，GPU 的 CUDA Core 大部分时间在等权重从 HBM 到达。A100 上 7B 模型 FP16 单请求 Decode 理论上限约 140 token/s，实际也就在几十 token/s 量级——对单用户交互已经够快，只是“贵”（算力浪费）。要提速主要靠加大 batch 或增大带宽。

**Q2：为什么 prompt 越长，首 token 越慢，但后续生成速度基本不变？**
A：TTFT 由 Prefill 决定，Prefill 计算量正比于输入 token 数，prompt 翻倍则 Prefill 时间约翻倍。而 Decode 每步的计算量基本恒定（只处理 1 个新 token），上下文长度只影响 KV Cache 读取量，所以逐 token 速度变化平缓（长上下文时 KV 读取增加会有一定劣化）。

**Q3：加大 batch size 为什么对 Decode 提升明显，对 Prefill 提升有限？**
A：Decode 是 Memory Bound，多个请求共用一次权重搬运，带宽成本不变而吞吐倍增。Prefill 是 Compute Bound，算力本来就接近饱和，加请求只会让它们排队争抢 Tensor Core，单批延迟上升、单位时间总吞吐也很快达到算力天花板。

**Q4：Continuous Batching 和传统 batching 的本质区别是什么？**
A：调度粒度。传统 batching 以“整个批次的生命周期”为单位，批内长短请求互相拖累、GPU 空转；Continuous Batching 以“每次迭代”为单位，请求完成即刻退出、新请求即刻插入，batch 始终保持高水位，配合 PagedAttention 管理显存可让吞吐提升数倍到十几倍。

**Q5：KV Cache 为什么是必须的？没有它 Decode 会怎样？**
A：没有 KV Cache，每生成一个 token 都要对全部历史 token 重算 K 和 V，每步计算量随上下文线性增长，总复杂度退化为 O(n²) 量级的重复计算。KV Cache 用显存换时间，是 Decode 能保持每步近似恒定开销的前提，也是长上下文推理显存压力的主要来源。

---

## 七、参考资料

- Lilian Weng — *Transformer Inference Arithmetic / Large Transformer Model Inference Optimization*
- vLLM 官方文档与论文：*Efficient Memory Management for Large Language Model Serving with PagedAttention* (SOSP 2023)
- *Orca: A Distributed Serving System for Transformer-Based Generative Models* (OSDI 2022) — Continuous Batching 的原始出处
- NVIDIA TensorRT-LLM 文档 — Prefill/Decode phase 说明
- Splitwise: *Phase splitting for LLM inference* (ISCA 2024)；DistServe: *Disaggregating Prefill and Decoding for Goodput-optimized LLM Serving* (OSDI 2024)
- Roofline Model 原始论文：Williams et al., *Roofline: An Insightful Visual Performance Model for Multicore Architectures*

---

## 📋 本日知识点清单

- [ ] Prefill：大量 token、并行计算、GEMM 密集
- [ ] Decode：一次一个 token、KV Cache、Memory Access 密集
- [ ] Prefill 是 Compute Bound，Decode 是 Memory Bound
- [ ] 为什么两个阶段的性能特征完全不同
- [ ] Continuous Batching 的动机

## 📝 实践练习

对比 Prefill 和 Decode 的算力利用率和带宽利用率，解释为什么 Decode 是 Memory Bound。

---

*本文是「GPU → LLM Inference」30 天学习计划的一部分。学习路线：GPU 硬件 → CUDA 执行模型 → 显存/带宽 → Kernel → Attention → KV Cache → 并行策略 → 推理性能。*
