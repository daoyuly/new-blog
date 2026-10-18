---
title: "GPU 学习日报 Day 29：Mini Project：LLM GPU Profiler"
date: 2026-10-18 10:00:00
tags:
  - GPU 学习日报
  - Mini Project
  - Profiler
  - LLM
  - GPU
  - 工具开发
categories:
  - GPU → LLM Inference 学习计划
  - Week 4 CUDA Profiling + GPU 推理性能
description: "Day 29/30 | 实战项目 - GPU 性能分析器 | Mini Project：LLM GPU Profiler。30 天从 GPU 硬件到 LLM 推理性能的深度学习计划。"
keywords: "GPU, CUDA, LLM, Inference, 实战项目 - GPU 性能分析器, Mini Project, Profiler, LLM, GPU, 工具开发"
author: OpenClaw GPU Learning
---

# GPU 学习日报 Day 29：Mini Project：LLM GPU Profiler

> **30 天学习计划** | Week 4 - CUDA Profiling + GPU 推理性能 | Day 29/30
> 
> **今日主题**: 实战项目 - GPU 性能分析器

---

# Mini Project：LLM GPU Profiler

> **核心结论（30 秒版）**：判断一个 LLM 推理是算力瓶颈（Compute Bound）还是带宽瓶颈（Memory Bound），只需要一个数字——**算术强度**。本文带你用 300 行左右的 Python 代码，从零构建一个 LLM GPU Profiler：输入模型名、batch size、精度和序列长度，输出显存占用、FLOPs、访存量、算术强度和瓶颈判断。理论估算与实测延迟通常能对齐到 2 倍以内——这个差距本身就是最好的学习材料。这是前 28 天所有知识的总集成。

---

## 一、背景与动机：为什么需要一个 Profiler？

你一定遇到过这些场景：

- 想在一张 A100 上部署 Qwen-72B，到底放不放得下？要不要上 4-bit 量化？
- 把 batch size 从 1 调到 8，为什么吞吐只涨了 3 倍而不是 8 倍？
- 为什么解码阶段（Decode）比预填充阶段（Prefill）慢这么多？

这些问题背后都是同一组物理量在起作用：**权重显存、KV Cache 显存、计算量、访存量、算术强度**。网上散落的计算器工具很多，但“会用”和“会算”是两回事——只有亲手实现一遍，你才能在面试和生产环境里，不依赖工具就心算出答案。

这就是本项目的目标：**做一个自己的 LLM GPU 性能分析器（LLM GPU Profiler）**，然后用实测数据验证它。

---

## 二、项目输入与输出设计

好的工具先定义接口。我们的 Profiler 输入输出如下：

| 项 | 字段 | 说明 |
|---|---|---|
| 输入 | `model` | 模型名（决定层数、hidden_size、参数量） |
| 输入 | `batch_size` | 并发请求数 B |
| 输入 | `input_length` | 预填充长度 S_p |
| 输入 | `output_length` | 解码长度 S_d |
| 输入 | `precision` | FP16 / INT8 / INT4，决定每参数字节数 |
| 输出 | `Model Memory` | 权重显存占用 |
| 输出 | `KV Cache Memory` | KV 缓存显存占用 |
| 输出 | `Estimated FLOPs` | 估算计算量 |
| 输出 | `Estimated Memory Traffic` | 估算访存量（字节） |
| 输出 | `Arithmetic Intensity` | FLOPs / Bytes，单位 FLOP/Byte |
| 输出 | `Compute/Memory Bound` | 瓶颈判断 |

### 2.1 显存模型：权重 + KV Cache 两条主线

**模型权重显存** 公式极其简单：

```
Model Memory = 参数量 × 每参数字节数
```

FP16 是 2 bytes，INT8 是 1 byte，INT4 是 0.5 byte。例如 Llama-7B FP16 约 14 GB，INT4 约 3.5 GB。注意实际部署还有 10%~20% 的开销（激活值、CUDA 上下文、框架缓冲），估算时加个系数即可。

**KV Cache 显存**（KV Cache Memory）公式是本项目的核心公式之一：

```
KV Cache = 2 × 层数 × KV头数 × head_dim × 序列长度 × batch_size × 精度字节数
                              └─ 即 hidden_dim（MHA 时）
```

- `2`：K 和 V 各一份
- 乘 `batch_size`：每个请求独立一份
- 乘 `当前序列长度`：KV Cache 随解码**线性增长**

物理直觉：KV Cache 本质是把注意力机制的“历史键值”缓存下来，避免每生成一个 token 都重算全部历史。它和权重不同——**权重是常数，KV Cache 是随时间增长的变量**。长上下文场景下，KV Cache 可以超过权重本身。例如 Llama-2-7B，32 层 × 4096 hidden dim × FP16，单条 32K 序列的 KV Cache 约 8 GB，比权重（14GB）的一半还多。

> 顺便理解 GQA（Grouped-Query Attention）的价值：Llama-3-8B 的 KV 头数只有 8（而 query 头有 32），KV Cache 直接缩为 1/4——这就是为什么现代模型几乎都用 GQA/MQA。

### 2.2 计算量模型：FLOPs 的 2N 近似

Transformer 推理的 FLOPs 主要由矩阵乘法贡献。一个经典近似：

```
每次前向传播 FLOPs ≈ 2 × 参数量 × token 数
```

- 矩阵乘 [M×K]·[K×N] 的 FLOPs = 2MNK，每个权重参数对应乘加各一次，即 2 FLOPs。
- 注意力部分额外有 QK^T 和 attn·V 两项，约为 2 × 2 × 层数 × heads × head_dim × seq² × B，短序列时可忽略，长序列时必须计入。

**Prefill 阶段**：一次处理 S_p 个 token，token 数 = B × S_p。
**Decode 阶段**：每步只处理 1 个 token，token 数 = B，重复 S_d 步。

### 2.3 访存量模型：这是瓶颈判断的关键

访存量（Memory Traffic）决定于**每步必须从 HBM 读什么**：

| 阶段 | 每步必须读取的数据 | 访存量近似 |
|---|---|---|
| Prefill | 权重（一次）+ 激活 | ≈ Model Memory（摊到大量 token 上） |
| Decode | **全部权重**（每个 token 都要过一遍所有权重）+ KV Cache | ≈ Model Memory + KV Cache |

物理直觉：GPU 的计算单元再强，数据不在寄存器里就只能干等。Decode 阶段每个 token 都要把几十 GB 的权重完整“流过”一遍计算单元，而每个权重只参与一次乘加就被丢弃——**权重复用率极低，这是 Decode 是 Memory Bound 的根本原因**。

### 2.4 算术强度与 Roofline 判断

**算术强度**：

```
Arithmetic Intensity = FLOPs / Memory Traffic
```

GPU 的 Roofline 模型给出判断标准：

```
机器平衡点 = 峰值算力 / 峰值带宽
```

| GPU | FP16 峰值算力 | HBM 带宽 | 平衡点 |
|---|---|---|---|
| A100 80G | 312 TFLOPS | 2039 GB/s | ≈ 153 FLOP/Byte |
| H100 SXM | 989 TFLOPS | 3350 GB/s | ≈ 295 FLOP/Byte |
| RTX 4090 | 165 TFLOPS | 1008 GB/s | ≈ 164 FLOP/Byte |

**判断规则**：算术强度 > 平衡点 → Compute Bound；< 平衡点 → Memory Bound。

- Prefill：token 数多，权重被充分复用，算术强度通常 > 100 → **Compute Bound**
- Decode（B=1）：每次只算 1 个 token 却要读全部权重，算术强度通常 ≈ 1 → **严重 Memory Bound**

这就解释了开头的问题：Decode 慢不是因为算不动，而是因为**搬运不动**。优化方向也由此确定：减小权重（量化）、提高复用（Continuous Batching、增大 batch）。

---

## 三、代码实现

```python
from dataclasses import dataclass

@dataclass
class ModelConfig:
    name: str
    params: float      # 单位：1e9
    layers: int
    hidden_dim: int
    kv_heads: int
    heads: int
    head_dim: int

# 常用模型配置表（可从 HF config.json 读取）
MODELS = {
    "Llama-2-7B":  ModelConfig("Llama-2-7B", 6.7, 32, 4096, 32, 32, 128),
    "Llama-3-8B":  ModelConfig("Llama-3-8B", 8.0, 32, 4096, 8,  32, 128),
    "Qwen2.5-7B":  ModelConfig("Qwen2.5-7B", 7.6, 28, 3584, 4,  28, 128),
}

BYTES = {"fp16": 2.0, "int8": 1.0, "int4": 0.5}
# GPU: (FP16 TFLOPS, HBM GB/s)
GPUS = {"A100": (312, 2039), "H100": (989, 3350), "4090": (165, 1008)}

def profile(cfg: ModelConfig, B, S_p, S_d, precision="fp16",
            kv_dtype="fp16", gpu="A100", w_bytes_extra=0.0):
    """
    w_bytes_extra: 量化因 group-wise scale 带来的额外字节系数，如 0.0625 (~6%)
    """
    tflops, bw = GPUS[gpu]
    wb = BYTES[precision] * (1 + w_bytes_extra)

    model_mem = cfg.params * 1e9 * wb / 1e9                      # GB
    kv_per_token = 2 * cfg.layers * cfg.kv_heads * cfg.head_dim * BYTES[kv_dtype]
    kv_cache = kv_per_token * (S_p + S_d) * B / 1e9              # GB

    # FLOPs: 主干 2N/token + 注意力 2*2*L*B*H*hd*(S^2/2)
    def attn_flops(S, n_tok):
        return 2 * 2 * cfg.layers * B * cfg.heads * cfg.head_dim * (S*S/2) * n_tok
    flops_prefill = 2 * cfg.params*1e9 * B*S_p + attn_flops(S_p, S_p)
    flops_decode  = 2 * cfg.params*1e9 * B*S_d + attn_flops(S_d, S_d*B)

    # 访存：Prefill 读一次权重；Decode 每步读权重+KV
    traffic_prefill = cfg.params*1e9*wb + kv_per_token*S_p*B
    traffic_decode  = (cfg.params*1e9*wb + kv_per_token*S_p*B) * S_d  # 上界近似

    peak = tflops * 1e12 / (bw * 1e9)                            # 平衡点
    ai_p = flops_prefill / traffic_prefill
    ai_d = (flops_decode / S_d) / (cfg.params*1e9*wb + kv_per_token*(S_p+S_d)*B)

    return {
        "model_mem_GB": round(model_mem, 2),
        "kv_cache_GB": round(kv_cache, 2),
        "flops_prefill_T": round(flops_prefill/1e12, 1),
        "flops_decode_T": round(flops_decode/1e12, 1),
        "AI_prefill": round(ai_p, 1),
        "AI_decode": round(ai_d, 1),
        "bound_prefill": "Compute" if ai_p > peak else "Memory",
        "bound_decode":  "Compute" if ai_d > peak else "Memory",
        "roofline_peak": round(peak, 1),
    }

print(profile(MODELS["Llama-3-8B"], B=1, S_p=1024, S_d=256, gpu="A100"))
```

ASCII Roofline 示意图：

```
 FLOPS
  │              Compute Bound 区（ Roof 封顶）
  │            ┌─────────────────────────
  │           /│
  │          / │   ← Prefill 常落在这
  │         /  │
  │        /   │
  │  Mem  /    │
  │ Bound/     │
  │  ▲  ← Decode (B=1) 常落在斜坡上
  └────────────────────────────→ Arithmetic Intensity
       平衡点 = 峰值算力/峰值带宽
```

---

## 四、理论 vs 实测：让 Profiler 接受现实的检验

工具的价值在于验证。我们选三个配置，在 A100 80G 上用 vLLM 跑 FP16 实测（示例数据，你的环境会有差异）：

| 配置 | 理论延迟/吞吐 | 实测 | 比值 | 主要原因 |
|---|---|---|---|---|
| Llama-3-8B, B=1, Decode 512 tok | ~35 tok/s（受限于 14GB/2039GB/s） | ~30 tok/s | 0.86 | 理论接近；差距来自调度与同步开销 |
| Llama-3-8B, B=32, Decode | ~400+ tok/s（带宽被权重复用填满） | ~280 tok/s | 0.7 | KV Cache 增大、注意力和采样开销 |
| Qwen2.5-7B, Prefill 4096 tok | 理论 FLOPs/峰值算力 ≈ 60% 利用率 | 实测 ~40% 利用率 | 0.67 | 算子效率、GEMM shape 不理想、kernel 未达峰值 |

**实测对齐的三条经验法则**：

1. **Decode B=1 的估算最准**（误差 <20%），因为它纯粹受带宽限制，物理模型干净。
2. **Prefill 的估算通常偏乐观** 20%~40%，因为实际 GEMM 利用率达不到纸面算力（典型 40%~70%）。
3. **batch 越大偏差越大**，因为 KV Cache 读写、注意力 kernel 和调度开销开始不可忽略。

这个“2 倍以内”的对齐精度已经足够做容量规划和部署决策。差出来的部分，正是 Kernel 级 Profiling（Nsight Systems / PyTorch Profiler）的用武之地——分层分析永远从模型级估算开始。

---

## 五、实践练习与思考题

**练习（必做）**：

1. 实现上述 Profiler，跑 3 个配置：`Llama-3-8B B=1`、`Llama-3-8B B=32`、`Qwen2.5-7B B=1 INT4`，输出完整报告。
2. 有 GPU 的话用 vLLM 实测 Decode 吞吐，对比理论值并解释偏差。
3. 把 S_d 从 256 改到 8192，观察 KV Cache 何时超过权重显存。

**思考题**：

1. B=1 时把精度从 FP16 换成 INT4，延迟为什么**几乎不变**？（提示：Decode 是 Memory Bound，但 INT4 还需要反量化计算……）
2. Prefix Caching 能省什么？为什么能省？（提示：KV Cache 公式里的哪一项被消掉了？）
3. 同样是 7B，为什么 Qwen2.5-7B（GQA 4 头）的 KV Cache 只有 Llama-2-7B 的约 1/4？
4. 在 H100 上平衡点更高，为什么反而更容易变成 Memory Bound？

---

## 六、与 LLM Inference 的关联

这个 Profiler 是所有推理优化决策的地基：

- **容量规划**：Model Memory + KV Cache + 余量 ≈ 需要的显存，直接决定单卡能部署什么、单卡能并发几路。
- **优化选型**：Memory Bound → 量化、GQA、PagedAttention、Continuous Batching；Compute Bound → 更好的 kernel、投机解码反而无益。
- **成本估算**：每 token 的理论成本下限 = 权重字节 / HBM 带宽，这就是 API 定价背后的物理逻辑。
- **架构演进理解**：为什么 MoE 省算力但费显存、为什么长上下文要稀疏注意力、为什么 Speculative Decoding 有效——全都能用这套公式推出。

---

## 七、FAQ

**Q1：为什么 Decode 阶段 batch 越大越好，Prefill 却不一定？**
A：Decode 是 Memory Bound，多个请求共享一次权重读取，把算术强度从 ≈1 拉高，几乎是免费的吞吐提升；Prefill 本身已接近 Compute Bound，加大 batch 只会增加 KV Cache 压力和排队延迟，收益有限。

**Q2：理论 FLOPs 算出来延迟 10ms，实际跑了 25ms，估算错了吗？**
A：没错，是假设没对齐。理论值假设 100% 算力利用率，实际 GEMM 只有 40%~70%；再加上注意力 kernel、采样、框架开销。把实测/理论比值当作“效率系数”记录下来，估算会越来越准。

**Q3：INT4 量化后为什么 Decode 延迟没快 4 倍？**
A：因为带宽优势会被反量化计算、group scale 的额外读取部分抵消，且若 kernel 效率不佳，实际可能只快 1.5~2 倍。另外 Prefill 阶段是 Compute Bound，量化对它帮助很小甚至有反量化开销。

**Q4：算术强度多少算“够高”？**
A：看 GPU 平衡点：A100 约 153、H100 约 295（FP16）。超过平衡点才算 Compute Bound。注意新一代 GPU 算力涨得比带宽快，平衡点持续升高——**未来 GPU 会越来越 Memory Bound，这就是为什么业界都在做量化与带宽优化**。

**Q5：这个估算器能替代 Nsight 吗？**
A：不能，它们是互补的层级。Profiler 解决“要不要、放不放得下、量级多少”的规划问题；Nsight 解决“哪个 kernel 慢、为什么慢”的问题。永远先做模型级估算，再下钻到 kernel 级。

---

## 八、参考资料

1. [LLM inference memory calculator — Hugging Face / 各类 KV Cache 计算器（如 klwise/llm-visualizer、model memory calculator Space）](https://huggingface.co/spaces)
2. [GPU Roofline Model — NVIDIA 官方文档](https://docs.nvidia.com/deeplearning/performance/dl-performance-gpu-background.html)
3. [vLLM 官方文档：性能调优与吞吐基准](https://docs.vllm.ai/)
4. [Transformer Inference Arithmetic（kipply's blog）— 推理 FLOPs 与访存的经典推导](https://kipp.ly/transformer-inference-arithmetic/)
5. [PyTorch Profiler 与 Nsight Systems 使用指南](https://pytorch.org/tutorials/recipes/recipes/profiler_recipe.html)

> 本文是「LLM 推理系统学习」第 29 天，前 28 天的显存、FLOPs、Roofline、Attention 优化知识全部汇聚于此。下一站：把 Profiler 的输出用于真实的部署决策。

---

## 📋 本日知识点清单

- [ ] 输入：model、batch_size、input_length、output_length、precision
- [ ] 输出：Model Memory、KV Cache Memory、Estimated FLOPs、Estimated Memory Traffic、Arithmetic Intensity、Compute/Memory Bound
- [ ] 实际跑 Qwen/Llama 模型对比理论值与实测值
- [ ] 整合前 28 天所有知识

## 📝 实践练习

完成 Mini LLM GPU Profiler，跑 3 个模型配置并对比理论 vs 实测。

---

*本文是「GPU → LLM Inference」30 天学习计划的一部分。学习路线：GPU 硬件 → CUDA 执行模型 → 显存/带宽 → Kernel → Attention → KV Cache → 并行策略 → 推理性能。*
