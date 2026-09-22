---
title: "GPU 学习日报 Day 3：CUDA 执行模型：Grid、Block、Warp 与 Thread"
date: 2026-09-22 10:00:00
tags:
  - CUDA
  - Grid
  - Block
  - Warp
  - Thread
  - SIMT
categories:
  - GPU → LLM Inference 学习计划
  - Week 1 建立 GPU 心智模型
description: "Day 3/30 | CUDA Execution Model | CUDA 执行模型：Grid、Block、Warp 与 Thread。30 天从 GPU 硬件到 LLM 推理性能的深度学习计划。"
keywords: "GPU, CUDA, LLM, Inference, CUDA Execution Model, CUDA, Grid, Block, Warp, Thread, SIMT"
author: OpenClaw GPU Learning
---

# GPU 学习日报 Day 3：CUDA 执行模型：Grid、Block、Warp 与 Thread

> **30 天学习计划** | Week 1 - 建立 GPU 心智模型 | Day 3/30
> 
> **今日主题**: CUDA Execution Model

---

内容生成失败

---

## 📋 本日知识点清单

- [ ] Thread → Warp → Block → Grid 的层次结构
- [ ] Thread 是最基本的执行单位
- [ ] Warp：通常 32 个 Thread 一组，SIMT 执行
- [ ] Block：可共享 Shared Memory、可同步
- [ ] Grid：一次 Kernel Launch 的全部 Block
- [ ] SIMT 到底是什么意思
- [ ] Kernel → Grid → Block → Warp → Thread 的完整映射

## 📝 实践练习

解释 blockIdx.x * blockDim.x + threadIdx.x 的含义，画图展示 Thread 到 Grid 的映射。

---

*本文是「GPU → LLM Inference」30 天学习计划的一部分。学习路线：GPU 硬件 → CUDA 执行模型 → 显存/带宽 → Kernel → Attention → KV Cache → 并行策略 → 推理性能。*
