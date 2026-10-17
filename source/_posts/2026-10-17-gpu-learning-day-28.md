---
title: "GPU 学习日报 Day 28：vLLM 与 PagedAttention：GPU Memory 管理的艺术"
date: 2026-10-17 10:00:00
tags:
  - GPU 学习日报
  - vLLM
  - PagedAttention
  - KV Cache
  - 显存管理
  - LLM Serving
categories:
  - GPU → LLM Inference 学习计划
  - Week 4 CUDA Profiling + GPU 推理性能
description: "Day 28/30 | GPU 推理框架源码初探 | vLLM 与 PagedAttention：GPU Memory 管理的艺术。30 天从 GPU 硬件到 LLM 推理性能的深度学习计划。"
keywords: "GPU, CUDA, LLM, Inference, GPU 推理框架源码初探, vLLM, PagedAttention, KV Cache, 显存管理, LLM Serving"
author: OpenClaw GPU Learning
---

# GPU 学习日报 Day 28：vLLM 与 PagedAttention：GPU Memory 管理的艺术

> **30 天学习计划** | Week 4 - CUDA Profiling + GPU 推理性能 | Day 28/30
> 
> **今日主题**: GPU 推理框架源码初探

---

# vLLM 与 PagedAttention：GPU Memory 管理的艺术

## 开篇结论

**核心认知**：vLLM 之所以能将 LLM 推理吞吐量提升 2-4 倍，根源不在算力，而在**显存管理**。KV Cache 是 LLM 推理中最稀缺的资源，传统框架按“请求最大长度”预分配连续显存，导致 60%-80% 的 KV Cache 空间被浪费。**PagedAttention（分页注意力）** 借鉴操作系统虚拟内存分页思想，将 KV Cache 切成固定大小的 Block 按需分配，把显存浪费压到 4% 以下。一句话：**vLLM 的胜利，是操作系统思想在 GPU 上的胜利。**

---

## 一、背景与动机：为什么 KV Cache 是推理的命脉

LLM 自回归推理有一个绕不开的物理约束：**每生成一个 token，都要拿它的 Query 去和之前所有 token 的 Key、Value 做注意力计算**。为了避免每一步都重算历史 token 的 K/V，推理框架会把它们缓存下来——这就是 **KV Cache（键值缓存）**。

KV Cache 的大小有一个残酷的增长公式：

```
KV Cache 大小 = 2 × num_layers × num_heads × head_dim × seq_len × dtype_size × batch_size
```

以 Llama-7B（fp16）为例，单个请求、单 token 的 KV Cache 约为 512 KB。当序列长度到 2048 时，一个请求就要吃掉约 1 GB 显存。一张 80GB 的 A100，模型权重占掉 14GB，剩下的空间理论上能服务几十个并发请求——但实际上，传统框架往往只能跑十几个，甚至更少。

问题出在哪？**不是显存不够，而是显存被浪费了。**

这就是 vLLM（2023 年由 UC Berkeley 团队提出）要解决的核心问题。理解 vLLM，本质上是理解一个问题的答案：**如何像操作系统管理物理内存那样，管理 GPU 上的 KV Cache？**

---

## 二、vLLM 整体架构：四层视角

先建立一张全局地图。vLLM 从上到下可以拆成四层：

```
┌─────────────────────────────────────────┐
│  Scheduler（调度器）                      │  ← 决定下一个 step 跑哪些请求
│  Continuous Batching / Prefill / Decode │
├─────────────────────────────────────────┤
│  Model Executor（模型执行层）             │  ← Llama、GPT 等模型定义
│  nn.Module / PagedAttention 模块        │
├─────────────────────────────────────────┤
│  KV Cache Manager（缓存管理器）           │  ← 分页管理核心
│  BlockManager / BlockTable / PrefixCache│
├─────────────────────────────────────────┤
│  CUDA Kernel（算子层）                   │  ← PagedAttention v1/v2 kernel
│  FlashAttention / page-level kernels    │
└─────────────────────────────────────────┘
```

**因果链**：Scheduler 决定“谁进来、谁等待”→ Model 定义“计算什么”→ KV Cache Manager 决定“K/V 存哪”→ CUDA Kernel 执行“怎么算”。PagedAttention 并不只是一个 kernel，它是贯穿三层的设计：管理器的数据结构、模型的注意力模块、底层的访存模式，三者围绕“分页”这个概念协同工作。

初读源码的推荐路径：`vllm/engine/`（调度入口）→ `vllm/core/block_manager.py`（分页管理）→ `vllm/attention/backends/`（注意力实现）→ `csrc/attention/`（CUDA kernel）。

---

## 三、PagedAttention 的核心思想：把虚拟内存搬进 GPU

### 3.1 操作系统的老智慧

PagedAttention 的灵感直接来自操作系统的**虚拟内存分页**：

| 操作系统 | vLLM |
|---|---|
| 物理内存 | GPU 显存中的 KV Cache 池 |
| 页面 | KV Cache Block（固定大小，如 16 tokens） |
| 虚拟地址空间 | 每个请求的 Block Table（逻辑块→物理块映射） |
| 页表 | Block Table |
| 按需分配 | 生成到哪，分配到哪 |
| 内存共享 | Copy-on-Write，多请求共享前缀 |

**核心机制**：KV Cache 不再按整段连续显存分配，而是切成固定大小的 Block（每个 Block 存 N 个 token 的 K/V，典型 N=16）。每个请求维护一张 Block Table，记录“我的第 i 个逻辑块在哪个物理块”。注意力 kernel 计算时，通过 Block Table 间接寻址——Gather 一样地把散落的 K/V 拼起来做 QKV 计算。

```
逻辑视图（请求视角，连续）：        物理视图（显存实际布局，离散）：

Block Table: [7, 1, 3]
   逻辑块0 ──────────────→  物理块 7  [token 0-15 的 K/V]
   逻辑块1 ──────────────→  物理块 1  [token 16-31 的 K/V]
   逻辑块2 ──────────────→  物理块 3  [token 32-47 的 K/V]

        ┌────┬────┬────┬────┬────┬────┬────┬────┐
GPU 显存:│ P1 │ P2 │ P3 │ P4 │ P5 │ P6 │ P7 │ P8 │
        └──▲──────────▲──────────────▲────────┘
           └──请求A───┴──请求B────────┘   各请求的块交错存放
```

### 3.2 物理直觉：为什么 kernel 敢这么算

直觉上的疑问：注意力不是要顺序读完整的 K/V 吗？散落各处不会慢吗？

答案在于注意力计算的本质：对每个 Query token，需要与全部历史 Key 做点积。这个访问模式本身就是**逐 token 遍历**的。传统实现中“连续”只是数组布局的偶然属性，不是数学要求。PagedAttention kernel 只要拿到 Block Table，就能按“块内连续访存（对 GPU 友好、可合并）、块间通过指针跳转”的方式完成同样的计算。一次访存 16 个 token 的 K/V，远远超过一个内存事务的最小粒度，因此**访存效率几乎无损**。

---

## 四、为什么 KV Cache 必须分页管理：碎片问题拆解

### 4.1 传统预分配的浪费结构

传统推理框架（早期 FasterTransformer 风格）的做法：请求到达时，按 `max_seq_len` 预分配一整块**连续**显存给 KV Cache。

这带来三重浪费：

| 浪费类型 | 定义 | 传统框架占比 |
|---|---|---|
| **内部碎片** | 预留了 max_seq_len，实际只用到 current_len | 最大头，平均 60%+ |
| **保留浪费** | 预留给“未来可能用”的部分 | 随生成逐步消化，但期间被锁死 |
| **外部碎片** | 多次分配/释放后，显存被切得七零八落，找不到连续大块 | 导致 OOM 或限制并发 |

举个数字直觉：请求 A 申请了 2048 token 的空间，实际只生成了 400 个 token 就结束了。那 1648 个 token 位置对应的约 800MB 显存，从头到尾没被真正使用——期间任何其他请求都碰不到它。

### 4.2 分页如何系统性消灭碎片

PagedAttention 的做法：

1. **按需分配**：每生成 16 个 token，才分配一个新 Block。内部碎片被压缩到“最后一个未填满的 Block”内，最坏浪费 `15/16 ≈ 6%`，平均约 4%。
2. **物理块固定大小**：显存池预先切成均匀的 Block，任何释放的 Block 都能立刻被复用——**外部碎片被结构性地消灭了**（因为不存在“不同大小的空隙”）。
3. **Copy-on-Write 共享**：多个请求有相同前缀（system prompt、few-shot）时，物理上共享同一批 Block。只有当某个请求要写入共享块时才复制。这把 Prefix Caching 从“额外功能”变成了分页机制的**自然推论**。

结果：vLLM 论文实测，显存利用率从传统方案的 20%-40% 提升到接近 96%，端到端吞吐提升 2-4 倍，长序列场景下提升更明显。

**关键���断**：LLM Serving 的吞吐瓶颈往往不是 FLOPs 不足，而是能同时塞进多少请求。显存利用率的提升直接转化为并发 batch 的增大，进而摊薄每个请求的权重读取开销——这就是“显存管理的艺术”对性能的杠杆作用。

---

## 五、三个知识点的连接：Memory × KV Cache × Serving

把这三个概念串成一条因果链：

```
LLM Serving 的目标：高吞吐 + 低延迟 + 高并发
        │
        ▼
并发的物理上限 = (显存总量 − 权重) / 每请求 KV Cache 需求
        │                        ▲
        │                        └── KV Cache 是主要占用（长序列下甚至超过权重）
        ▼
所以 GPU Memory 管理的效率 = 并发上限 = Serving 吞吐的上限
        │
        ▼
PagedAttention 把利用率从 ~30% 提到 ~96%
        │
        ▼
同样的卡，并发 batch 翻倍以上 → Continuous Batching 有更多请求可调度
        │
        ▼
吞吐提升 2-4×，且支持 Prefix Caching、抢占与恢复（swapping）
```

再叠加 **Continuous Batching（连续批处理）**：传统静态 batching 要等一整批请求全部生成完才换下一批（长短请求互相拖累）。vLLM 在**每个 decoding step 的粒度**上调度：请求一生成完立刻退出、显存立刻归还 Block 池、新请求立刻插入。注意，**Continuous Batching 之所以可行，正是因为分页机制让“随时加入/退出”的显存操作变得廉价**——如果显存是大块连续分配的，频繁的插拔会造成严重碎片。二者是共生关系，不是并列的两个优化。

---

## 六、实践练习：画出分页 KV Cache 的数据结构

**任务**：阅读 vLLM 源码中以下文件，手画（或用 ASCII 画）一张数据结构图：

- `vllm/v1/core/kv_cache_manager.py` 或旧版 `vllm/core/block_manager.py`——Block 的分配、释放、CoW 逻辑
- `vllm/config.py` 中的 `block_size`（block_nbytes 计算）——一个 Block 到底多大
- `vllm/attention/backends/paged_attn.py` 与 `csrc/attention/attention_kernels.cu`——kernel 如何用 block_table 索引

**画图要求**，至少包含以下元素：

```
1. 物理显存池：一个一维数组，切分为 N 个固定 Block
2. 两个请求各自的 BlockTable：逻辑块序号 → 物理块 ID
3. 一个共享前缀的例子：请求 A 和 B 的 BlockTable 前两项指向同一物理块，
   该物理块的引用计数 = 2
4. 标注：当 B 要写入共享块时，CoW 触发 → B 分配新块、复制、引用计数 -1
```

**思考题**：

1. `block_size` 设 8 和 32 各有什么 trade-off？（提示：从内部碎片率、kernel 访存效率、Block Table 长度三个角度想）
2. 如果两个请求共享 1000 token 的前缀，一个分页系统和一个连续分配系统，各需要多少显存？
3. Beam Search 时，多个候选分支为什么天然适合分页管理？
4. vLLM 的抢占机制会 swap out 某请求的 KV Cache 到 CPU 内存——这在分页模型下为什么比连续分配下更容易实现？

---

## 七、与 LLM Inference 的关联

回到本系列的主线——**推理性能工程**。PagedAttention 对性能的影响可以量化到三个指标：

1. **Throughput（吞吐量）**：显存利用率 30%→96%，意味着同样的卡并发能力翻倍以上，这是 vLLM 吞吐优势的第一来源。
2. **TTFT（首 token 延迟）**：Prefix Caching 让共享 system prompt 的请求跳过 Prefill，首 token 延迟大幅下降。RAG、多轮对话场景收益最大。
3. **可预测性**：分页模型下，OOM 不再由“外部碎片”这种不可预测因素触发，调度器可以做确定性的容量规划（watermark、抢占、swapping），长尾延迟更可控。

一个反直觉的提醒：PagedAttention 的 kernel 本身**不比 FlashAttention 的单次计算更快**，甚至因为间接寻址略有开销。它的收益全部来自**系统层**——更多的并发、更少的���费。这也是本系列反复强调的方法论：**LLM 推理优化的主战场常常不在算子，而在资源管理。** 这与 CUDA 层面的 Kernel Fusion、算子优化是互补而非竞争关系。

---

## FAQ

**Q1：PagedAttention 和 FlashAttention 是什么关系？竞争还是互补？**
互补。FlashAttention 解决“注意力计算本身”的访存与显存问题（SRAM 分块计算、不落 HBM），PagedAttention 解决“KV Cache 怎么存”的管理问题。vLLM v1 中两者结合使用：分页管理存储，FlashAttention-style kernel 做计算。

**Q2：block_size 为什么默认是 16？设大一点不是内部碎片更少吗？**
反了，设大一点内部碎片反而更多（最后一个未填满的块浪费更多）。设小一点碎片少，但 Block Table 变长、kernel 间接寻址次数变多。16 是碎片率（<6%）与访存效率之间的经验平衡点。

**Q3：有了 PagedAttention，还会 OOM 吗？**
会。分页消灭的是碎片，不消灭需求超过供给的情况。vLLM 的应对是调度层的策略：watermark 限制、请求抢占、KV Cache swap 到 CPU——这些策略之所以可实现，同样得益于分页的灵活性。

**Q4：Prefill 阶段也用分页吗？**
是的，Prefill 生成的 KV Cache 同样按 Block 写入物理池。vLLM v1 还支持 chunked prefill，把长 prompt 的 Prefill 切片与 Decode 混合调度，进一步平滑延迟。

**Q5：如果我不写框架，只是调用推理服务，学这个有什么用？**
三个实际收益：① 能读懂 vLLM 的参数（`block_size`、`gpu_memory_utilization`、`enable_prefix_caching`）并做出正确的容量估算；② 面对吞吐瓶颈时，能判断是调度问题还是显存问题；③ 理解 Prefix Caching 的适用条件（共享前缀长且稳定），优化应用侧的 prompt 结构。

---

## 参考资料

1. vLLM 官方文档与架构博客：https://blog.vllm.ai/2023/06/20/vllm.html
2. PagedAttention 论文：*Efficient Memory Management for Large Language Model Serving with PagedAttention*（SOSP 2023）
3. vLLM GitHub 源码：https://github.com/vllm-project/vllm
4. Continuous Batching 原理：Orca 论文（OSDI 2022）及 Anyscale 博客 *Continuous batching: a significant increase in LLM inference throughput*
5. 操作系统分页机制：任何一本 OS 教材的虚拟内存章节（OSTEP 第 13-23 章免费在线）

**明日预告**：进入更深的算子层——CUDA Kernel 与 GPU 内存层次结构，搞懂 HBM 与 SRAM 为什么决定了 Roofline 模型的形状。

---

## 📋 本日知识点清单

- [ ] vLLM 的整体架构：Model → Attention → KV Cache → CUDA Kernel
- [ ] PagedAttention 的核心思想
- [ ] 为什么 KV Cache 需要分页管理
- [ ] PagedAttention 如何减少显存碎片
- [ ] GPU Memory + KV Cache + LLM Serving 三个知识点的连接

## 📝 实践练习

阅读 vLLM PagedAttention 源码，画图解释分页 KV Cache 的数据结构。

---

*本文是「GPU → LLM Inference」30 天学习计划的一部分。学习路线：GPU 硬件 → CUDA 执行模型 → 显存/带宽 → Kernel → Attention → KV Cache → 并行策略 → 推理性能。*
