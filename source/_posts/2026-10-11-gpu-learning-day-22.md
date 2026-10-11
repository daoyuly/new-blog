---
title: "GPU 学习日报 Day 22：CUDA Profiling：Nsight Systems 与 Nsight Compute"
date: 2026-10-11 10:00:00
tags:
  - GPU 学习日报
  - Nsight
  - Profiling
  - CUDA
  - 性能分析
categories:
  - GPU → LLM Inference 学习计划
  - Week 4 CUDA Profiling + GPU 推理性能
description: "Day 22/30 | GPU Profiling 工具 | CUDA Profiling：Nsight Systems 与 Nsight Compute。30 天从 GPU 硬件到 LLM 推理性能的深度学习计划。"
keywords: "GPU, CUDA, LLM, Inference, GPU Profiling 工具, Nsight, Profiling, CUDA, 性能分析"
author: OpenClaw GPU Learning
---

# GPU 学习日报 Day 22：CUDA Profiling：Nsight Systems 与 Nsight Compute

> **30 天学习计划** | Week 4 - CUDA Profiling + GPU 推理性能 | Day 22/30
> 
> **今日主题**: GPU Profiling 工具

---

# CUDA Profiling：Nsight Systems 与 Nsight Compute

**核心结论**：GPU 性能优化的一半工作不是写代码，而是测量。NVIDIA 提供两个互补的 Profiler：**Nsight Systems**（系统级 Timeline，回答“整个系统发生了什么”）和 **Nsight Compute**（Kernel 级深度剖析，回答“这个 Kernel 为什么慢”）。正确的分析路径永远是先 Systems 后 Compute——先用 Timeline 找到热点 Kernel 和 CPU/GPU 空泡，再用 Compute 拆解该 Kernel 是访存受限还是计算受限。对 LLM 推理而言，profiling 能直接告诉你：预填充阶段瓶颈在 GEMM 的算力，解码阶段瓶颈在内存带宽，而大量“GPU 空闲时间”往往来自 CPU 端的 Kernel 启动开销——这是优化推理框架的第一手证据。

---

## 一、背景与动机：为什么“感觉慢”没用

CUDA 程序的性能问题有三个典型陷阱：

1. **直觉不可靠**。大多数工程师猜测的瓶颈位置是错的。你以为 Kernel 慢是因为算得太多，实际可能是 PCIe 传输；你以为显存不够，实际是 Kernel 启动开销。
2. **时间是分段的**。端到端耗时 = CPU 逻辑 + 数据传输 + Kernel 执行 + 同步等待。不拆开就不知道该优化哪一段。
3. **LLM 推理尤其如此**。一个 decode step 包含几十到上百个 Kernel（GEMM、attention、norm、elementwise），任何一个小 Kernel 变成瓶颈都会拖慢整体。

Profiling 的本质是**建立因果链**：端到端慢 → 定位到哪个时间段慢 → 定位到哪个 Kernel 慢 → 定位到 Kernel 内部哪类资源受限。Nsys 和 Ncompute 分别覆盖链条的前半段和后半段。

**一句话分工**：

| 工具 | 回答的问题 | 观察粒度 | 类比 |
|---|---|---|---|
| **Nsight Systems (nsys)** | 什么在什么时候发生？谁在等待谁？ | 整个进程/多进程，秒级~毫级 | 体检报告 |
| **Nsight Compute (ncu)** | 这个 Kernel 为什么慢？卡在哪个资源上？ | 单个 Kernel，微秒级 | 专科检查 |

## 二、Nsight Systems：整个系统发生了什么

### 2.1 它看什么

Nsight Systems（命令行工具为 `nsys`）采集的是**系统级 Timeline**：CPU 线程活动（OS runtime、CUDA API 调用如 `cudaLaunchKernel`、`cudaMemcpy`）、GPU 流上的 Kernel 执行、内存传输、NCCL 通信、NVTX 标注区间。它把 CPU 和 GPU 的活动放在同一条时间轴上，让你看到因果关系。

```text
CPU 线程:  |cudaLaunch|cudaLaunch|cudaMemcpy(D2H)...sync........|
GPU Stream:           | Kernel A | Kernel B |    (空闲)     | Kernel C |
                                              ↑
                                    GPU 空泡：等 CPU 或等传输
```

### 2.2 基本用法

```bash
# 命令行采集，生成 .nsys-rep 文件
nsys profile -o llm_inference --trace=cuda,nvtx,osrt python infer.py

# 生成统计摘要
nsys stats llm_inference.nsys-rep

# 图形界面查看
nsys-ui llm_inference.nsys-rep
```

`nsys stats` 最有用的几张表：

- **cuda_gpu_kern_sum**：每个 Kernel 的总耗时、调用次数、平均耗时 → 直接找到热点 Kernel
- **cuda_gpu_mem_time_sum**：memcpy/memset 耗时 → 判断是否被传输拖累
- **cuda_api_sum**：CUDA API 耗时 → 判断 CPU 端是否成为瓶颈

### 2.3 NVTX：给 Timeline 加“人话标注”

裸 Timeline 里几百个 `vectorized_elementwise_kernel` 很难读。NVTX（NVIDIA Tools Extension）让你在代码里打标：

```python
import torch.cuda.nvtx as nvtx

nvtx.range_push("prefill")
logits = model(input_ids)
nvtx.range_pop()

nvtx.range_push("decode_step")
...
```

主流推理框架（vLLM、TensorRT-LLM）都内置了 NVTX 标注，用 `--trace=nvtx` 采集后，Timeline 会显示 prefill / decode / sampling 等清晰区间——这是分析 LLM 推理的第一步。

### 2.4 你要在 Timeline 里找什么

1. **GPU 空泡（GPU idle gap）**：GPU 流上没有 Kernel 的时段。常见原因：CPU 端 Python 逻辑太慢、同步点过多、数据传输阻塞。
2. **短 Kernel 密集发射**：一排排 5~20 µs 的小 Kernel，之间夹着空隙——典型的 Kernel 启动开销问题（对应 CUDA Graphs 优化）。
3. **传输与计算是否重叠**：H2D 拷贝是否和计算 Kernel 并行，还是串行等待。
4. **多 GPU 场景下的等待**：NCCL allreduce 前后是否有 GPU 在空等慢的 rank（负载不均衡）。

## 三、CPU vs GPU Timeline 分析：空泡从哪来

这是 nsys 分析的核心技能。CPU 和 GPU 是异步的：CPU 调 `cudaLaunchKernel` 后立即返回继续跑下一行代码，Kernel 排队由 GPU 执行。正常情况下流水线填满后 GPU 不停歇；一旦 GPU 频繁“等饭吃”，性能就崩了。

### 3.1 两种典型病灶

**病灶一：CPU-bound（启动开销主导）**

```text
CPU:  |launch|launch|launch|launch|launch|launch|
GPU:   |k1|  gap |k2|  gap |k3|  gap |k4|  gap |
```

每个 Kernel 执行 10 µs，但 CPU 发射一个 Kernel 需要 15~30 µs（Python + PyTorch dispatcher + CUDA driver 路径），GPU 大部分时间在空转。**判断标准**：Timeline 上 Kernel 很短、间隙很宽，CPU 侧 `cudaLaunchKernel` 密集且耗时高。

**解法**：CUDA Graphs（把整个 decode step 录制成图，一次发射）、算子融合（减少 Kernel 数量）、batch 多请求摊薄开销。

**病灶二：同步点过多**

`cudaDeviceSynchronize` 或隐式同步（如 `.item()`、`.cpu()`、打印 tensor）会强制 CPU 等 GPU，流水线断裂：

```python
loss = logits[0, -1].item()   # 隐式同步：CPU 在这里停住等 GPU
print(hidden.shape)            # 还好，shape 不同步
```

Timeline 上的表现：CPU 一条长横线阻塞在 sync API 上，GPU 做完手头工作后空转。**解法**：消除热循环里的同步调用，让 CPU 跑在 GPU 前面预发射 Kernel。

### 3.2 判断口诀

| Timeline 特征 | 诊断 | 方向 |
|---|---|---|
| GPU 利用率低 + Kernel 短 + 间隙宽 | CPU-bound / 启动开销 | CUDA Graphs、融合、C++ 前端 |
| GPU 满载但 memcpy 占比高 | 数据搬运瓶颈 | PCIe→NVLink、pinned memory、异步拷贝 |
| 一个 Kernel 独占 >80% 时间 | 单 Kernel 瓶颈 | 转 Nsight Compute 深挖 |
| 多卡时某卡 allreduce 前长空等 | 负载不均衡 | 切分策略调整 |

## 四、Nsight Compute：这个 Kernel 为什么慢

找到热点 Kernel 后，用 Nsight Compute（命令行 `ncu`）做“Kernel 解剖”。

```bash
# 只剖析名为 gemm 的 Kernel，避免全量采集拖慢程序
ncu --kernel-name regex:gemm --set full -o gemm_report python infer.py

# 命令行快速看关键指标
ncu --kernel-name regex:gemm \
    --metrics sm__throughput.avg.pct_of_peak_sustained_elapsed,\
dram__throughput.avg.pct_of_peak_sustained_elapsed \
    python infer.py
```

### 4.1 两个最重要的指标：算力利用率 vs 带宽利用率

任何 Kernel 的性能上限由“屋顶模型”（Roofline Model）决定：

```text
计算性能 (TFLOPS)
   │
   │                        ┌────────── 峰值算力
   │                        │
   │             ╲          │
   │              ╲         │     ↑ 计算受限区
   │   访存受限区    ╲       │    （多算有用）
   │  （多读少算）    ╲      │
   └──────────────────╲────┴─────────→
        拐点           算术强度 (FLOPs / Byte)
```

- **算术强度低**（每读 1 字节只算很少几次）→ **访存受限（Memory-Bound）**，瓶颈在 DRAM/L2 带宽，看 `dram__throughput` 是否接近 100%。
- **算术强度高** → **计算受限（Compute-Bound）**，瓶颈在 SM 算力，看 `sm__throughput`。

看两个百分比**哪个更高**：高者即瓶颈，优化低者无用。

### 4.2 典型瓶颈的 Nsight Compute 指纹

| 瓶颈类型 | 关键指标特征 | 常见来源 | 解法 |
|---|---|---|---|
| 访存受限 | `dram__throughput` ≈ 90-100%，`sm__throughput` 低 | elementwise、decode GEMV、attention | 向量化访存、合并访存、融合 |
| 计算受限 | `sm__throughput` 高 | prefill GEMM | Tensor Core（确保 FP16/BF16 路径）、tile 调优 |
| 低占用率 | `achieved_occupancy` 低 | 每块线程太少/寄存器太多 | 调 block size、`__launch_bounds__` |
| 非合并访存 | `l1tex__t_sectors_pipe_lsu_mem_global_op_ld` 远大于请求数 | 转置访问、结构体数组 AoS | 改 SoA、padding、shared memory |
| 分支发散 | 分支效率低 | warp 内 if 分叉 | 重排数据使同 warp 走同分支 |
| 同步等待 | `stall_barrier` 占比高 | shared memory 读写后 `__syncthreads` 密集 | 减少同步、warp 级原语 |

一个经验法则：`l1tex__t_sectors / l1tex__t_requests` 比值越接近 1 越好（理想 4 字节 sector 全用上），达到 4+ 说明严重的非合并访问。

### 4.3 一个微型例子

```cuda
// 坏：跨步访问，每次读浪费 3/4 的 sector
float v = a[i * STRIDE];

// 好：相邻线程读相邻地址，完全合并
float v = a[i];
```

ncu 报告里表现为：前者 `sectors/request` 高、DRAM 吞吐虚高但有效带宽低——同样的数据量，实际传输了 4 倍流量。

## 五、常见性能瓶颈的诊断流程（实战路径）

把前面内容串成一个可执行的决策树：

```text
端到端慢
   │
   ├─ nsys: GPU 利用率高吗？
   │     ├─ 低 → CPU-bound
   │     │     ├─ launch 密集小 Kernel → CUDA Graphs / 融合
   │     │     └─ 阻塞在 sync API → 消除隐式同步
   │     └─ 高 → 找热点 Kernel (cuda_gpu_kern_sum)
   │           │
   │           └─ ncu 单 Kernel 深挖
   │                 ├─ dram 带宽顶满 → 访存受限 → 合并访存/融合/向量化
   │                 ├─ sm 算力顶满   → 计算受限 → Tensor Core/tile 调优
   │                 └─ 都不高        → 占用率/同步/发散分支问题
   │                       └─ 看 Speed-of-Light 和 Warp State 区块
```

**重要提醒**：ncu 会串行化 Kernel 执行并多次重放（replay）以采集完整指标，所以 **ncu 报告的绝对时间不可信，只有比例和利用率指标可信**；端到端耗时一律以 nsys 为准。这也是两个工具不能互相替代的原因。

## 六、实践练习：分析一个 LLM 推理过程

**目标**：用 Nsight Systems 分析 HuggingFace 模型的一次生成，找到最耗时的 Kernel 并判断它是访存还是计算受限。

```bash
pip install transformers torch
# 用 vLLM 的话自带 NVTX，加 VLLM_NVTX_FMT=deep 启动即可

nsys profile -o llm_trace --trace=cuda,nvtx \
    python -c "
from transformers import AutoModelForCausalLM, AutoTokenizer
import torch
m = AutoModelForCausalLM.from_pretrained('Qwen/Qwen2.5-0.5B',
        torch_dtype=torch.float16, device_map='cuda')
t = AutoTokenizer.from_pretrained('Qwen/Qwen2.5-0.5B')
ids = t('Write a long story.', return_tensors='pt').input_ids.cuda()
for _ in range(64):   # 64 步 decode，观察每步 Kernel 分布
    out = m.generate(ids, max_new_tokens=1, do_sample=False)
"
nsys stats llm_trace.nsys-rep
```

**观察点**：

1. `cuda_gpu_kern_sum` 排前 3 的 Kernel 是什么？（大概率是 GEMM/GEMV：`gemm`、`nvjet` 或 `cutlass` 命名，以及 attention 相关 Kernel）
2. 每个 decode step 的总 GPU 时间 vs 64 步墙钟时间——GPU 空闲占比多少？（小模型上通常 >50%，这就是启动开销）
3. 对最大的 Kernel 跑 `ncu --set full`，看 `sm__throughput` 和 `dram__throughput` 哪个高。**验证结论：decode 时的 1×hidden GEMV 应该是访存受限（DRAM 接近 100%）；把 batch 加大到 32 后重跑，同一 Kernel 应转向计算受限。**

**思考题**：

1. 为什么 decode 阶段 batch 越大，“每 token 成本”越低？用 Roofline 解释。
2. Timeline 上看到 decode 每步之间有 200 µs 的 GPU 空泡，Kernel 之间还有 CPU 侧 Python 调用——你有哪些手段消除它？各自代价是什么？
3. 一个 Kernel 的 `dram__throughput` 只有 40%，`sm__throughput` 只有 30%——既不是访存也不是算力受限，可能卡在哪里？

## 七、与 LLM Inference 的关联

Profiling 是理解 LLM 推理框架所有优化手段的“证据来源”：

- **Prefill = Compute-Bound**：整句并行处理，GEMM 的 N 维度是序列长度，算术强度高，`sm__throughput` 顶满 → 优化的方向是 Tensor Core 利用率、并行切分。
- **Decode = Memory-Bound**：每步每个权重只被用一次（batch=1 时），算术强度 ≈ 1，被 HBM 带宽锁死 → 这就是 KV Cache、PagedAttention、连续批处理、量化（减少每 token 读的字节数）、投机解码（一次读权重算多个 token）存在的根本原因。ncu 上亲手验证“decode GEMV 的 DRAM 吞吐 ≈ 90%+”，你就理解了 vLLM 的设计动机。
- **CPU 空泡 → CUDA Graphs**：vLLM 和 TensorRT-LLM 都用 CUDA Graphs 消除 decode 的发射开销，nsys Timeline 上那排“小 Kernel + 宽间隙”就是它的适用证据。
- **Kernel 融合**：RMSNorm+残差、RoPE+attention 等融合算子，本质是把多个访存受限的小 Kernel 合并，ncu 会显示合并后 DRAM 总流量下降。
- **多卡推理**：nsys 的 NCCL 追踪能暴露 TP 并行中 allreduce 等待——张量并行的通信开销是否吞掉了计算收益，必须用 Timeline 说话。

## 八、FAQ

**Q1：nsys 和 ncu 应该先用哪个？**
先用 nsys。它告诉你瓶颈在哪个 Kernel、是 Kernel 还是 CPU 端的问题。如果瓶颈根本不在 Kernel 内部，用 ncu 深挖是浪费时间。只有确认“某 Kernel 占大头”后才用 ncu。

**Q2：为什么 ncu 测出的 Kernel 时间和实际运行差异很大？**
ncu 为了采集全部计数器会锁定时钟频率并多次重放 Kernel，时间被人为拉长。它的时间只用于 Kernel 间相对比较，端到端时间以 nsys 或直接计时为准。

**Q3：GPU 利用率（utilization）100% 是否说明没有优化空间？**
不是。`nvidia-smi` 的利用率只表示“观察期间有 Kernel 在跑”，不代表 SM 在满负荷计算。一个访存受限的 Kernel 可以让利用率显示 100%，而 `sm__throughput` 只有 30%。要看 ncu 的 SOL（Speed-of-Light）指标。

**Q4：Python 层面能不能做 profiling，还是必须用 NVIDIA 工具？**
两者互补。`torch.profiler`（可导出 Chrome trace，本质是包装了 CUPTI）适合快速定位 PyTorch 算子级热点；nsys/ncu 能看到更底层的驱动行为、传输和硬件计数器。LLM 推理分析推荐：torch.profiler 粗看 → nsys 精确定位 → ncu 深挖单个 Kernel。

**Q5：没有 root 权限或远程服务器，怎么用这些工具？**
`nsys profile` 和 `ncu` 均为命令行工具，普通用户即可运行（ncu 需要对计数器的权限，容器中需 `--cap-add=CAP_SYS_ADMIN` 或配置 perf 事件权限）。采集生成的 `.nsys-rep` / `.ncu-rep` 文件可以下载到本地用 GUI 打开分析。

---

## 参考资料

1. NVIDIA Nsight Systems 官方文档：https://docs.nvidia.com/nsight-systems/
2. NVIDIA Nsight Compute 官方文档：https://docs.nvidia.com/nsight-compute/
3. Nsight Compute 报告指标详解（Speed-of-Light / Warp State）：https://docs.nvidia.com/nsight-compute/ProfilingGuide/
4. CUDA C++ Programming Guide, Performance Guidelines：https://docs.nvidia.com/cuda/cuda-c-programming-guide/
5. GTC 演讲 "CUDA Profiling Tools"（NVIDIA Developer 站点可检索）
6. NVIDIA Developer Blog: "Profiling CUDA Applications" 系列文章

> 明确判断：掌握 nsys 定位 + ncu 拆解这条两段式流程，就覆盖了 95% 的 GPU 性能分析场景；剩下的 5% 是多机多卡的通信分析，同样是 nsys 的能力范围。下一篇自然是：用这套方法解释 CUDA Graphs 和算子融合为什么有效。

---

## 📋 本日知识点清单

- [ ] Nsight Systems：整个系统发生了什么
- [ ] Nsight Compute：这个 Kernel 为什么慢
- [ ] CPU vs GPU timeline 分析
- [ ] Kernel 执行时间、内存带宽利用率
- [ ] 常见性能瓶颈的 profiling 诊断

## 📝 实践练习

用 Nsight Systems 分析一个 LLM 推理过程，识别最耗时的 Kernel。

---

*本文是「GPU → LLM Inference」30 天学习计划的一部分。学习路线：GPU 硬件 → CUDA 执行模型 → 显存/带宽 → Kernel → Attention → KV Cache → 并行策略 → 推理性能。*
