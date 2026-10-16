---
title: "GPU 学习日报 Day 26：GPU 推理性能分析：实战 Profile"
date: 2026-10-15 10:00:00
tags:
  - GPU 学习日报
  - 性能分析
  - Benchmark
  - Qwen
  - Llama
  - GPU
categories:
  - GPU → LLM Inference 学习计划
  - Week 4 CUDA Profiling + GPU 推理性能
description: "Day 26/30 | 真实模型推理性能分析 | GPU 推理性能分析：实战 Profile。30 天从 GPU 硬件到 LLM 推理性能的深度学习计划。"
keywords: "GPU, CUDA, LLM, Inference, 真实模型推理性能分析, 性能分析, Benchmark, Qwen, Llama, GPU"
author: OpenClaw GPU Learning
---

# GPU 学习日报 Day 26：GPU 推理性能分析：实战 Profile

> **30 天学习计划** | Week 4 - CUDA Profiling + GPU 推理性能 | Day 26/30
> 
> **今日主题**: 真实模型推理性能分析

---

# GPU 推理性能分析：实战 Profile

> **核心结论**：LLM 推理性能随 batch size 增大呈“先陡后平”的曲线——decode 阶段本质是 Memory Bound（内存带宽受限），batch=1 时 GPU 计算单元大量空转，batch 增大后权重加载成本被多个请求摊薄，Tokens/s 接近线性提升；直到算力被打满，性能切换为 Compute Bound（计算受限），曲线进入平台期。TTFT 主要由 Prefill 阶段的计算量决定（Compute Bound），TPOT 主要由每步显存搬运决定（Memory Bound）。看懂这条曲线，就等于看懂了 GPU 推理优化的全部地图。

---

## 一、背景与动机：为什么必须亲手 Profile

很多工程师对 LLM 推理性能的认知停留在“GPU 越贵越快”、“batch 越大吞吐越高”这种经验句。但经验句无法回答关键问题：

- 为什么 batch=1 时 GPU 利用率只有 20%，Tokens/s 却不见得慢太多？
- 为什么加了 batch 之后单个请求的生成速度（TPOT）反而变慢了？
- 我的服务该设多大 batch？上限在哪？
- Continuous Batching、PagedAttention 这些优化到底优化的是什么？

这些问题的答案都藏在同一条因果链里：**LLM 推理的每个阶段受限于不同的硬件资源**（瓶颈，Bottleneck），而 Profile（性能剖析）就是把这条因果链从猜测变成实测数据的唯一手段。

纸上谈 Roofline 一百遍，不如跑一次 batch scaling 实验来得透彻。本文以 Qwen/Llama 系列开源模型为例，带你完成一次完整的实战。

---

## 二、核心概念：先建立三个名词的物理直觉

| 概念 | 英文 | 一句话物理直觉 | 受限于 |
|---|---|---|---|
| 首字延迟 | TTFT (Time To First Token) | 用户按下回车到看到第一个字的时间 | Prefill 计算量（算力） |
| 单 token 生成时间 | TPOT (Time Per Output Token) | 之后每蹦一个字的间隔 | 显存带宽（每步都要搬整个权重） |
| 系统吞吐 | Tokens/s (Throughput) | 整张卡每秒吐出的 token 总数 | 带宽 → 算力的切换 |

**关键物理直觉**：decode 阶段每生成一个 token，都要把模型的全部权重从 HBM（高带宽显存）搬到计算单元一遍。对于 7B 模型（FP16 约 14GB），在 2TB/s 带宽的卡上，纯搬运时间约 7ms——**无论你算出 1 个 token 还是 100 个 token，这个搬运时间几乎不变**。这就是 batch 能“白嫖”吞吐的物理学基础：让一次权重搬运服务于尽可能多的请求。

---

## 三、实战：跑 Batch Scaling Benchmark

### 3.1 实验设计

控制变量：固定模型（如 Qwen2.5-7B-Instruct）、固定输入长度（如 512 tokens）、固定输出长度（如 128 tokens），只改变并发 batch size：1 / 4 / 8 / 16。

使用 vLLM 的 OpenAI 兼容接口或 HuggingFace 直接批处理均可。下面给一个最小可复现的 HF 版本：

```python
import time, torch
from transformers import AutoModelForCausalLM, AutoTokenizer

model_name = "Qwen/Qwen2.5-7B-Instruct"
model = AutoModelForCausalLM.from_pretrained(
    model_name, torch_dtype=torch.float16, device_map="cuda")
tok = AutoTokenizer.from_pretrained(model_name)

prompts = ["写一篇 500 字的短文。" ] * batch_size  # 相同 prompt 保证可比
inputs = tok(prompts, return_tensors="pt", padding=True).to("cuda")
input_len = inputs.input_ids.shape[1]
max_new = 128

torch.cuda.synchronize()
t0 = time.perf_counter()
out = model.generate(**inputs, max_new_tokens=max_new, do_sample=False)
torch.cuda.synchronize()
wall = time.perf_counter() - t0

# 记录指标
total_tokens = batch_size * max_new
throughput = total_tokens / wall                      # Tokens/s
ttft ≈ prefill_time  # 可用 first-token 回调或 step-by-step 循环单独测
tpot = (wall - ttft) / (max_new - 1)                  # TPOT
mem = torch.cuda.max_memory_allocated() / 1e9         # GB
util = torch.cuda.utilization()                       # nvidia-smi 采样
```

同时开一个终端持续记录：

```bash
nvidia-smi --query-gpu=utilization.gpu,memory.used,power.draw \
  --format=csv -l 1
```

### 3.2 典型实测数据（A100-40G，7B FP16，模拟趋势）

| Batch | Tokens/s (总) | 单请求 Tokens/s | TPOT (ms) | GPU Util | 显存 (GB) |
|---|---|---|---|---|---|
| 1 | ~25 | 25 | ~40 | ~30% | 16 |
| 4 | ~80 | 20 | ~50 | ~60% | 17 |
| 8 | ~140 | 17.5 | ~57 | ~80% | 19 |
| 16 | ~190 | 12 | ~75 | ~90%+ | 24 |

（具体数字随硬件/框架浮动，重点是曲线形状，不是绝对值。）

---

## 四、性能变化的根本原因分析

### 4.1 为什么总吞吐先陡后平？

因果链如下：

1. **batch=1 时**：每步耗时 ≈ 权重搬运时间 + 一点点矩阵向量计算。搬运 14GB 权重花掉大部分时间，GPU 的 Tensor Core 大部分闲置 → Utilization 低，**Memory Bound**。
2. **batch 增大**：矩阵向量乘（GEMV）变成矩阵矩阵乘（GEMM），计算单元终于有活干，而权重搬运时间基本不变 → 总吞吐接近线性涨。
3. **继续增大**：KV Cache 显存压力上升、GEMM 计算时间开始超过搬运时间 → 算力打满，**切换为 Compute Bound**，吞吐进入平台期甚至因 cache 容量/调度开销下降。

用 ASCII 画出吞吐曲线：

```
Tokens/s
  ▲
  |                ______________  ← Compute Bound 平台期
  |           ____/
  |        __/                 ← 拐点：算力≈带宽的临界 batch
  |      _/
  |    _/   ← Memory Bound 区，近似线性放大
  |  _/
  | /
  +----------------------------------▶ Batch Size
     1    4    8    16   32
```

### 4.2 为什么 TPOT 会随 batch 变劣？

TPOT 衡量的是**单个用户**的体验。batch=8 时，每一步计算量变成 8 倍，但权重搬运没变快，所以每步总时间从 40ms 涨到 ~57ms。这就是经典的 **Throughput vs Latency 权衡（吞吐-延迟权衡）**：

| 指标 | batch ↑ 的变化 | 对应方 |
|---|---|---|
| Tokens/s（总吞吐） | ↑ 上升 | 服务商开心 |
| TPOT（单请求延迟） | ↑ 变慢 | 用户不开心 |
| TTFT | 基本持平（Prefill 各自独立）+ 排队延迟 | 排队会恶化 |

### 4.3 为什么 TTFT 对 batch 不太敏感，但排队时敏感？

TTFT 由 Prefill 主导。Prefill 一次算整个 prompt（比如 512 tokens），是密集的 GEMM，本来就接近 Compute Bound，batch 内并行时 Prefill 可以合批计算，摊薄成本。但**排队效应**（一个请求等待前面的 Prefill 完成）会显著推高高负载下的 TTFT——这正是 vLLM 等框架做 Prefill/Decode 分离调度、Chunked Prefill 的动机。

---

## 五、Roofline 视角：一张图解释所有数据

Roofline 模型（屋顶线模型）回答一个问题：**一段计算到底被算力卡住还是被带宽卡住？**

```
计算强度 (Arithmetic Intensity) I = FLOPs / Bytes（每搬 1 字节做几次浮点运算）

  FLOP/s
   ▲
   |                ┌────────────── 屋顶：峰值算力
   |               /
   |              /   ← 斜坡：受限于带宽 (Memory Bound)
   |            _/
   |         __/  ← 拐点 = 峰值算力/峰值带宽 = 机器平衡点
   |      __/
   |  ___/         ← 计算强度低，搬家太忙
   +────────────────────▶ Arithmetic Intensity (FLOP/Byte)
```

代入真实数字（以 A100 为例，FP16 算力约 312 TFLOP/s，带宽 2TB/s，机器平衡点 ≈ 156 FLOP/Byte）：

| 阶段 | 每层典型算子 | 计算强度估算 | 瓶颈判定 |
|---|---|---|---|
| Decode, batch=1 | 权重 GEMV：2N FLOPs / 2N Bytes | ≈ 1 FLOP/Byte | **重度 Memory Bound** |
| Decode, batch=64 | 2N×64 FLOPs / 2N Bytes | ≈ 64 FLOP/Byte | 仍偏 Memory Bound |
| Prefill | GEMM，批量 ≥ 数百 | 数百 FLOP/Byte | **Compute Bound** |
| KV Cache 读写 | 大量搬运少量计算 | 极低 | Memory Bound |

这张表解释了所有实测现象：

- **为什么 batch=1 的 Utilization 只有 30%**：计算强度 1 ≪ 156，算力根本喂不饱。
- **为什么吞吐曲线有拐点**：batch 增大 → 计算强度线性增大 → 沿 Roofline 斜坡爬升 → 触顶后进入平台。
- **为什么 GEMM 优化的收益集中在 Prefill**：Prefill 已经在屋顶附近，优化 GEMM 直接兑现；decode 优化重点应是减少搬运（KV Cache 压缩、量化权重、FlashAttention 减少显存往返）。

### 5.1 识别切换点

实测中找 Compute/Memory Bound 切换点有三个信号：

1. **吞吐曲线斜率明显放缓**——最直观；
2. **GPU Utilization > 90% 且继续加 batch 吞吐不再涨**——算力饱和；
3. **实测 FLOP/s 接近峰值算力的 60-70%**（很难到 100%，有 softmax、通信等非 GEMM 开销）——已进 Compute Bound 区。

---

## 六、与 LLM 推理系统优化的关联

理解了瓶颈模型，主流优化技术就不再是黑魔法，而是一一对应：

| 优化技术 | 针对的瓶颈 | 原理 |
|---|---|---|
| Continuous Batching | Memory Bound 摊薄 | 让权重搬运始终服务满批请求 |
| PagedAttention | 显存容量 | KV Cache 分页管理，减少碎片，装更多 batch |
| GPTQ/AWQ 权重量化 | Memory Bound | 权重从 FP16 → INT4，搬运量减 4 倍，decode 直接近 4 倍加速 |
| FlashAttention | Memory Bound | 减少中间结果的显存往返 |
| Chunked Prefill / PD 分离 | TTFT 与 TPOT 互扰 | 避免长 prompt Prefill 阻塞 decode |
| Speculative Decoding | Memory Bound | 一次搬运验证多个 token，提高每次搬运的“性价比” |

一个判断法则：**凡是 decode 阶段的优化，几乎都在“少搬数据”；凡是 Prefill 阶段的优化，几乎都在“多算计算”。**

---

## 七、实践练习与思考题

**练习 1（必做）**：跑 batch = 1/4/8/16 的 benchmark，绘制 Tokens/s、TPOT、Utilization 三条曲线，标出你机器上的拐点 batch。

**练习 2（推荐）**：用 FP16 与 AWQ INT4 量化模型各跑一遍 batch=1，对比 TPOT。验证“权重搬运量减半 → decode 提速近 2 倍”的预测。

**练习 3（进阶）**：用 `torch.profiler` 或 NVIDIA Nsight Systems 抓一个 decode step 的 kernel 时间线，看看 GEMV kernel 的 SM 占用率和显存读写占比。

**思考题**：
1. 为什么 speculative decoding 对 Compute Bound 的 Prefill 没有收益？
2. 把 batch 从 16 加到 64，TTFT 会发生什么变化？提示：考虑排队和 Prefill 合批。
3. 如果你的显卡带宽翻倍但算力不变，Roofline 拐点（机器平衡点）会变大还是变小？

---

## FAQ

**Q1：GPU Utilization 90% 就代表 GPU 跑满了吗？**
A：不是。`nvidia-smi` 的 Utilization 只表示“采样时间内有 kernel 在执行”，不代表 SM 全部饱和。batch=1 的 decode Utilization 可能 80%+，但算力利用率（FLOP/s / 峰值）可能不到 5%。判断真实饱和要看吞吐曲线是否触顶，或用 Nsight 看 SM 占用。

**Q2：为什么 batch 增大到一定程度，吞吐反而下降？**
A：常见原因：① KV Cache 超出显存触发换页或 OOM 重试；② batch 内请求长度差异大导致 padding 浪费；③ GEMM 已进 Compute Bound 后，调度和 cache 争用开销占比上升。这个下降点就是该硬件上此模型的**最优服务 batch 上限**。

**Q3：TTFT 和 TPOT 分别受什么控制？优化哪个？**
A：TTFT 由 Prefill 主导（Compute Bound），优化靠算力、GEMM 效率和调度排队策略；TPOT 由 decode 主导（Memory Bound），优化靠减少搬运——量化、KV Cache 管理等。面向交互式聊天产品优先压 TPOT 和 TTFT；面向离线批处理只看总吞吐。

**Q4：为什么 LLM 推理 decode 阶段是 Memory Bound，训练却不是？**
A：训练是批量并行的大 GEMM（大 batch、全序列），计算强度高，通常 Compute Bound；decode 每步只算 1 个 token，权重却要整个搬一遍，计算强度≈1 FLOP/Byte，远低于机器平衡点（A100 约 156）。同一个模型，两种截然不同的瓶颈形态。

**Q5：没有 A100/H100，用消费卡（如 4090）能观察到同样的规律吗？**
A：能，且更明显。4090 带宽约 1TB/s 但算力极高，机器平衡点更高，decode 的 Memory Bound 更严重——batch scaling 带来的吞吐放大倍数会更可观，拐点出现得也更晚。

---

## 参考资料

- vLLM 官方性能基准与 Continuous Batching 论文：*Efficient Memory Management for Large Language Model Serving with PagedAttention* (SOSP'23)
- Roofline Model 原始论文：Williams et al., *Roofline: An Insightful Visual Performance Model* (CACM 2009)
- NVIDIA Nsight Systems 官方文档：https://docs.nvidia.com/nsight-systems/
- HuggingFace Transformers `generate` 文档与 Qwen2.5 模型卡：https://huggingface.co/Qwen
- FlashAttention 论文：Dao et al., *FlashAttention: Fast and Memory-Efficient Exact Attention* (NeurIPS 2022)
- Speculative Decoding：Leviathan et al., *Fast Inference from Transformers via Speculative Decoding* (ICML 2023)

---

## 📋 本日知识点清单

- [ ] 用 Qwen/Llama 跑不同 batch size 的推理
- [ ] 记录 TTFT、TPOT、Tokens/s、GPU Memory、GPU Utilization
- [ ] 分析性能变化的根本原因
- [ ] 从 Roofline 视角解释实测数据
- [ ] 识别 Compute Bound 和 Memory Bound 的切换点

## 📝 实践练习

跑 Batch=1/4/8/16 的推理 benchmark，分析性能拐点。

---

*本文是「GPU → LLM Inference」30 天学习计划的一部分。学习路线：GPU 硬件 → CUDA 执行模型 → 显存/带宽 → Kernel → Attention → KV Cache → 并行策略 → 推理性能。*
