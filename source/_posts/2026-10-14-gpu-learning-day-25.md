---
title: "GPU 学习日报 Day 25：GPU 推理性能指标：TTFT、TPOT 与 Throughput"
date: 2026-10-14 10:00:00
tags:
  - GPU 学习日报
  - TTFT
  - TPOT
  - Throughput
  - Latency
  - LLM
categories:
  - GPU → LLM Inference 学习计划
  - Week 4 CUDA Profiling + GPU 推理性能
description: "Day 25/30 | LLM 推理性能指标体系 | GPU 推理性能指标：TTFT、TPOT 与 Throughput。30 天从 GPU 硬件到 LLM 推理性能的深度学习计划。"
keywords: "GPU, CUDA, LLM, Inference, LLM 推理性能指标体系, TTFT, TPOT, Throughput, Latency, LLM"
author: OpenClaw GPU Learning
---

# GPU 学习日报 Day 25：GPU 推理性能指标：TTFT、TPOT 与 Throughput

> **30 天学习计划** | Week 4 - CUDA Profiling + GPU 推理性能 | Day 25/30
> 
> **今日主题**: LLM 推理性能指标体系

---

# GPU 推理性能指标：TTFT、TPOT 与 Throughput

> **核心结论**：LLM 推理性能不是单一数字，而是由一组相互制约的指标构成的体系。**TTFT（Time To First Token，首 Token 延迟）由 Prefill 阶段主导，取决于 Prompt 长度和算力**；**TPOT（Time Per Output Token，每 Token 生成耗时）由 Decode 阶段主导，取决于显存带宽和批大小**；**Throughput（吞吐量）是系统视角指标，与延迟天然存在权衡（trade-off）**。看懂这三个指标，你就看懂了推理系统的优化空间在哪里——延长首 Token 响应可以换更高吞吐，压缩单 Token 延迟往往牺牲并发能力。本文带你建立这套指标的物理直觉。

---

## 一、背景与动机：为什么必须先学指标？

假设你部署了一个 70B 模型的推理服务，用户开始抱怨“太慢了”。慢在哪里？是等第一个字等了 5 秒？还是打字机效果卡顿？还是高峰期整个系统一天只能处理几千个请求？

这三种“慢”对应完全不同的病因和药方：

- 等首字慢 → **TTFT 高**，问题可能出在 Prefill 计算、排队或网络
- 打字卡顿 → **TPOT/ITL 高**，问题可能出在 Decode 阶段的显存带宽瓶颈
- 整体处理能力差 → **Throughput 低**，问题可能出在批处理策略或 KV Cache 管理

没有指标体系，优化就是盲人摸象。你可能会花一周调 CUDA Kernel，结果发现用户抱怨的其实是排队策略问题。这一天的目标就是把这套“体检报告”上的每一项搞清楚：**它测什么、由什么决定、优化它要付出什么代价**。

---

## 二、一次请求的完整生命周期：所有指标的物理载体

在定义指标之前，先建立统一的物理图像。LLM 推理分为两个阶段，这是理解所有指标的基础：

```
用户 Prompt: "请解释 GPU 推理的三个指标"
                              时间轴 ──────────────────────────►

├────────── Prefill（预填充）──────────┤├────────── Decode（解码）──────────────┤
│                                       │                                        │
│  一次性读入整个 Prompt                 │  每次只生成 1 个 token                  │
│  并行计算，算力密集型                   │  自回归，逐个吐出                       │
│  计算 FLOPs 大 → 算力瓶颈              │  每步要读全部 KV Cache → 带宽瓶颈       │
│                                       │                                        │
│  ◄── 决定 TTFT ──►                    │  ◄── 决定 TPOT / ITL ──►               │
│                                       │  "请│GPU│推理│的│三│个│指│标│..."        │
└───────────────────────────────────────┴────────────────────────────────────────┘
     第一个 token 在这里产生                  之后每个 token 依次产生
```

**关键因果链**：

1. **Prefill 是“读题”**：整个 Prompt 一次性并行喂进 GPU，做大规模矩阵乘法。GPU 的计算单元（Tensor Core）被充分喂饱，是**算力（compute-bound）主导**的阶段。
2. **Decode 是“答题”**：每生成一个 token，都要把整份 KV Cache 和全部权重从显存读一遍，但每个权重只做一次乘加。算术强度极低，GPU 大部分时间在“等数据”，是**显存带宽（memory-bound）主导**的阶段。

这个二分法解释了后文几乎所有指标的行为规律。

---

## 三、核心指标详解

### 3.1 TTFT（Time To First Token，首 Token 延迟）

**定义**：从客户端发出请求，到收到第一个生成 token 之间的时间。

```
TTFT = 排队时间 + Prefill 计算时间 + 网络/框架开销
```

**影响因素分解**：

| 因素 | 影响机制 | 典型量级 |
|---|---|---|
| Prompt 长度 | Prefill 计算量与 Token 数成正比；长 Prompt 的 KV Cache 写入也更大 | 每千 token 可达数百毫秒 |
| 排队时间（Queueing） | 服务端并发高时，请求在队列中等待调度 | 可从 0 到数秒，波动最大 |
| Chunked Prefill 与否 | 长 Prompt 是否切分处理，影响对其他请求的干扰 | — |
| 网络往返 + Tokenizer | 固定开销，量小但不可忽略 | 几毫秒到几十毫秒 |
| 模型大小 / GPU 算力 | 决定 Prefill 的绝对计算时间 | — |

**物理直觉**：TTFT 本质上是“用户感知的响应速度”。对交互式应用（聊天、代码补全）它是体验生死线——业界经验是 TTFT 超过 1~2 秒，用户就明显感到“卡住了”。

**重要观察**：排队时间往往是 TTFT 的隐藏大头。系统负载低时 TTFT 可能 200ms，高峰期飙到 5 秒，其中 Prefill 计算根本没变——变的是队列。所以优化 TTFT 时要先区分“算得慢”还是“排得久”。

### 3.2 TPOT（Time Per Output Token，每 Token 生成耗时）

**定义**：首 token 之后，平均每个输出 token 的生成时间：

```
TPOT = (总延迟 - TTFT) / (输出 token 数 - 1)
```

**影响因素**：

| 因素 | 影响机制 |
|---|---|
| 显存带宽 | Decode 每步需读取全部权重 + KV Cache，带宽是硬顶 |
| 模型大小 | 模型越大，每步要读的数据越多，TPOT 下限越高 |
| KV Cache 长度 | 上下文越长（Prompt + 已生成部分），每步读取越多 |
| 批大小（Batch Size） | 批越大，单请求 TPOT 越高（但要被分摊） |
| Speculative Decoding | 用小模型草稿 + 大模型验证，可一次出多个 token |

**物理直觉**：估算 Decode 的速度上限有一个经典方法——**模型每步要读的字节数 ÷ 显存带宽**。以 7B 模型 FP16 为例，权重约 14GB，在带宽 2TB/s 的 A100 上：

```
理论最速 TPOT ≈ 14 GB / 2000 GB/s = 7 ms → 理论上限约 140 token/s
```

如果你的实测 TPOT 是 7ms，说明优化已经到头；如果是 30ms，说明有大量浪费（访存不连续、批调度不佳等）。这个算术是推理工程师的“体温计”。

### 3.3 ITL（Inter-Token Latency，Token 间延迟）

**定义**：相邻两个 token 之间的实际到达时间间隔。

**TPOT 与 ITL 的区别**容易被忽略：TPOT 是“总时间除以 token 数”的**平均值**，ITL 是**逐次观测值**。二者差异暴露了抖动（jitter）：

```
理想情况（TPOT = ITL = 20ms）:
  ──●──────●──────●──────●──────►
   20ms    20ms   20ms   20ms

有抖动的情况（平均 TPOT = 20ms，但 ITL 波动）:
  ──●──●────────────●──●────────►
   10ms   50ms      10ms
   ↑ 用户体验由最差的 ITL 决定，而非平均值！
```

**为什么会抖动？** 典型原因：批大小动态变化（新请求加入导致该步 Decode 变慢）、Chunked Prefill 插入（长 Prompt 的 Prefill 块与 Decode 混跑，挤占带宽）、垃圾回收或调度间隙。对打字机式的流式输出，用户感知的是 ITL 的尖峰，不是平均值。

### 3.4 TPS 与 QPS：Token 视角与请求视角的吞吐

**TPS（Tokens Per Second）**：系统每秒产出的 token 总数，可细分为：

- **单请求 TPS**：一个请求自己的出字速度 ≈ 1/TPOT
- **系统 TPS**：所有并发请求加总的出字速度，反映整体服务能力

**QPS（Queries Per Second）**：每秒完成的完整请求数。

**换算关系**（设平均输出 200 token）：

```
系统 TPS = QPS × 平均输出长度
例：QPS = 10，输出 200 token/请求 → 系统吞吐 = 2000 token/s
```

| 指标 | 视角 | 谁关心 | 谁决定 |
|---|---|---|---|
| 单请求 TPS | 用户体验 | 产品/用户 | TPOT（受批大小影响）|
| 系统 TPS | 资源效率 | 平台/成本 | 批处理策略、显存管理 |
| QPS | 服务容量 | SRE/架构 | 以上全部 + 调度策略 |

**注意陷阱**：同样是“吞吐高”，可能是单请求很快（TPOT 低），也可能是靠大批量摊出来的。购买推理服务时必须问清楚是哪种。

### 3.5 Latency vs Throughput：一对永恒的权衡

**核心规律：在固定硬件上，延迟和吞吐是跷跷板，不是两个独立可优的目标。**

```bash
# 一个最小化的压力测试示例（伪代码，以 vLLM benchmark 为例）
python benchmark_serving.py \
    --backend vllm \
    --dataset-name sharegpt \
    --num-prompts 64 \          # ← 增大并发：Throughput ↑，TTFT/TPOT ↑
    --request-rate 4            # ← 请求到达速率，模拟不同负载
# 输出会同时给出: TTFT (mean/p99), TPOT (mean/p99), Output throughput, Request throughput
```

**因果链**：为了提高吞吐 → 系统把更多请求凑成大批量 → Decode 每步要服务更多请求 → 单请求的 TPOT 变大 → 延迟上升。反过来，为了压低延迟 → 限制批大小 → GPU 每步摊薄的固定开销变多 → 吞吐下降。

| 维度 | Latency（延迟） | Throughput（吞吐） |
|---|---|---|
| 服务对象 | 单个请求/单个用户 | 整个系统/所有用户 |
| 典型指标 | TTFT、TPOT、ITL、E2E Latency | TPS、QPS |
| 谁在意 | 交互式应用、在线服务 | 离线批处理、成本核算 |
| 提升手段 | 限制并发、Speculative Decoding、更小模型 | Continuous Batching、扩大批、PagedAttention |
| 代价 | 牺牲吞吐 | 牺牲单请求延迟 |

**物理直觉**：Decode 阶段是 memory-bound 的——读一次权重可以顺便算 1 个 token，也可以算 8 个 token（批大小 8），计算几乎免费。所以批处理对吞吐的收益极大；但每批里每个请求都在等这一步完成，批越大等得越久。这就是权衡的物理根源。

### 3.6 GPU Utilization 与 Memory Utilization：最容易被误读的两个数字

**GPU Utilization（nvidia-smi 显示的那个百分比）**：严格说，它测量的是“采样周期内至少有一个 kernel 在执行的时间占比”。它**不等于** GPU 算力被有效利用的比例。

**致命陷阱**：Decode 阶段 GPU 利用率可以显示 95%+，但实际算力利用率（MFU，Model FLOPs Utilization）可能只有 5%——因为每个 tiny kernel 都在“执行”，只是在等显存数据，Tensor Core 大面积空转。

```
nvidia-smi 视角:  |████████████ kernel ████| kernel |████████| → "95% 忙"
真实算力视角:     |░░░░░░░░ 5% FLOPs ░░░░░|        Tensor Core 大部分闲置
```

**Memory Utilization** 有两层含义，别混淆：

1. **显存占用率**：KV Cache + 权重 + 激活占了多少显存。对 LLM 服务，KV Cache 往往是最大头，占用率高不一定是坏事——留着不用才是浪费。
2. **带宽利用率（HBM Bandwidth Utilization）**：实际带宽 ÷ 峰值带宽。这才是 Decode 性能的真实指标，越接近 100% 说明访存优化越好。

| 指标 | 测什么 | 能否指导优化 | 替代方案 |
|---|---|---|---|
| GPU Utilization | kernel 是否在跑 | ❌ 几乎不能 | MFU、带宽利用率 |
| 显存占用率 | 显存分配了多少 | 部分（KV Cache 规划）| 每请求 KV Cache 字节数 |
| 带宽利用率 | HBM 数据搬运效率 | ✅ Decode 优化的核心 | nsys/ncu 剖析 |

**结论先行**：看 nvidia-smi 的 GPU Utilization 判断 LLM 推理健康度基本无效。要看 MFU（Prefill 阶段）和带宽利用率（Decode 阶段）。

---

## 四、指标定义总表（实践练习产出）

| 指标 | 全称 | 定义式 | 主导阶段 | 主要瓶颈 | 主要影响因素 |
|---|---|---|---|---|---|
| TTFT | Time To First Token | 请求发出 → 首 token 到达 | Prefill | 算力 + 排队 | Prompt 长度、并发负载、网络 |
| TPOT | Time Per Output Token | (总延迟−TTFT)/(输出数−1) | Decode | 显存带宽 | 模型大小、KV Cache 长度、批大小 |
| ITL | Inter-Token Latency | 相邻 token 间隔 | Decode | 显存带宽 + 调度抖动 | 批动态变化、Chunked Prefill |
| 单请求 TPS | Tokens Per Second (per req) | 1/TPOT | Decode | 显存带宽 | 同 TPOT |
| 系统 TPS | Tokens Per Second (total) | QPS × 平均输出长度 | 全局 | 批调度 | 批大小、显存管理 |
| QPS | Queries Per Second | 完成请求数/秒 | 全局 | 混合 | 上述所有 + 调度策略 |
| GPU Util | Kernel 执行时间占比 | — | — | — | 误导性指标，慎用 |
| MFU | Model FLOPs Utilization | 实际 FLOPs ÷ 峰值 FLOPs | Prefill | 算力 | Kernel 效率、通信 |
| 带宽利用率 | HBM BW Utilization | 实际带宽 ÷ 峰值带宽 | Decode | 带宽 | KV Cache 布局、批大小 |

---

## 五、实践练习与思考题

**练习 1（动手）**：用 vLLM 起一个 7B 模型服务，分别用 1、8、32 并发跑 `benchmark_serving.py`，记录 TTFT、TPOT、系统 TPS 三个数字的变化。验证：并发增大时，TPS 增长但 TPOT/TTFT 恶化。

**练习 2（算术）**：查一款 GPU 的 HBM 带宽，对一个 13B FP16 模型计算理论最速 TPOT，再与官方 benchmark 对比，估计访存效率。

**思考题**：

1. 一个场景 90% 的请求 Prompt 只有 20 token，但输出长达 2000 token（如写作助手）；另一个场景 Prompt 8000 token、输出 10 token（如长文档摘要）。两个场景分别该优先优化哪个指标？系统设计有何不同？
2. Speculative Decoding 为什么能降低 TPOT 而不损失吞吐？它的代价落在了哪个资源上？
3. 你的服务 TTFT p99 突然从 500ms 涨到 4s，但 TTFT 均值没变。最可能的原因是什么？（提示：想想排队和长尾。）

---

## 六、与 LLM Inference 的关联

这套指标体系直接对应推理系统的每一个优化模块：

- **PagedAttention / KV Cache 管理** → 降低显存浪费 → 同等显存塞下更大批 → 吞吐提升，但可能推高 TPOT
- **Continuous Batching（连续批处理）** → 请求随到随进批 → 降低排队时间 → TTFT 改善
- **Chunked Prefill** → 长 Prompt 切块与 Decode 混跑 → 其他请求的 ITL 尖峰被削平
- **Speculative Decoding** → 一次验证多个草稿 token → TPOT 降低，代价是 Prefill/验证算力
- **KV Cache 量化 / GQA / MLA** → 压缩每步要读的 KV 数据量 → 直接降低 Decode 的带宽需求 → TPOT 下降

**一句话总结因果链**：架构特性 → 改变计算/访存量或调度方式 → 反映为 TTFT/TPOT/Throughput 的变化。反向推理也一样：看到哪个指标差，就能定位到该研究哪个模块。

---

## FAQ

**Q1：TTFT 和 TPOT，哪个对用户体验更重要？**
交互式应用优先 TTFT（用户对“是否有响应”最敏感）；输出很长且用户持续阅读时，TPOT 决定“追文速度”，一般 TPOT 低于人类阅读速度（约 5~10 token/s，即 TPOT < 100ms）体验即可接受。两者都要看 **p99**，不只看均值。

**Q2：GPU 利用率 100% 为什么推理还是很慢？**
因为 nvidia-smi 的 Utilization 只说明 kernel 在执行，不代表算力被用满。Decode 是 memory-bound，GPU 可能 95% 时间在等显存数据。请改看 MFU 和带宽利用率。

**Q3：批大小越大吞吐一定越高吗？**
不一定。批大到一定程度后，Compute 也成为瓶颈（尤其 Prefill 混跑时），TPS 增长饱和甚至下降；同时 TPOT 持续恶化。存在一个“吞吐-延迟”曲线上的最优工作点，取决于你的 SLO。

**Q4：TTFT 里包含 Prompt 的 TPS 吗？Prefill 速度怎么度量？**
可以，业界常报 **Prefill TPS（Prompt Tokens Per Second）**= Prompt 长度 ÷ Prefill 时间。它与 Decode TPS 是两个独立指标，分别反映算力与带宽的利用水平。

**Q5：TTFT 高应该先加 GPU 还是先改调度？**
先定位：如果 TTFT 与负载强相关（低峰正常、高峰爆炸），是排队问题，优先 Continuous Batching、请求优先级、扩容；如果空闲时也慢，才是 Prefill 计算或网络问题。盲目加卡是最贵的答案。

---

## 参考资料

- NVIDIA TensorRT-LLM 性能测量文档：Performance Measurements（TTFT/TPOT 官方定义）
- vLLM `benchmark_serving.py` 文档与输出说明
- vLLM 博客：*Continuous Batching: A significant leap in LLM inference efficiency*（Cade Daniel et al.）
- Anyscale 博客：*ML inference at scale — how Anyscale serves AI models*（批处理与延迟权衡）
- Hugging Face TGI 指标文档：*Measuring inference latency / tokens per second*
- NVIDIA Developer Blog：*Mastering LLM Techniques — Inference Optimization*（Prefill/Decode 二分与瓶颈分析）

---

## 📋 本日知识点清单

- [ ] TTFT (Time To First Token) 的定义与影响因素
- [ ] TPOT (Time Per Output Token) 的定义
- [ ] ITL (Inter-Token Latency)
- [ ] TPS (Tokens Per Second)、QPS
- [ ] Latency vs Throughput 的区分
- [ ] GPU Utilization 与 Memory Utilization

## 📝 实践练习

制作 LLM 推理性能指标定义表，标注每个指标的影响因素。

---

*本文是「GPU → LLM Inference」30 天学习计划的一部分。学习路线：GPU 硬件 → CUDA 执行模型 → 显存/带宽 → Kernel → Attention → KV Cache → 并行策略 → 推理性能。*
