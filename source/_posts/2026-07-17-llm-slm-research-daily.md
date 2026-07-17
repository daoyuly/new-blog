---
title: "LLM & SLM 研究日报 - 2026-07-17"
date: 2026-07-17 09:00:00
tags:
  - LLM
  - SLM
  - 算法
  - 训练
  - 推理
  - arxiv
  - daily-report
categories:
  - LLM/SLM 日报
---


# LLM & SLM 研究日报

> 算法·训练·推理 —— 大语言模型与小语言模型的前沿研究
>
> 数据源: [cs.CL](https://papers.cool/arxiv/cs.CL) + [cs.LG](https://papers.cool/arxiv/cs.LG)
>
> 生成时间: 2026/7/17 09:00:11

## 📊 今日概况

| 方向 | 论文数 |
|------|--------|
| 🧮 算法与架构 | 5 |
| 🏋️ 训练方法 | 4 |
| ⚡ 推理优化 | 1 |
| **总计扫描** | **50** |

---

## 📝 论文列表

### 🧮 算法与架构 (5 篇)

#### 1. SPyCE: Skill-Policy Co-evolution for Multimodal Agents

- **arXiv**: [2607.13854](https://arxiv.org/abs/2607.13854)
- **摘要**: spyce,skill,policy,skills,rollouts,multimodal,reusable,library,agents,trajectories
- **关键词**: spyce,skill,policy,skills,rollouts,multimodal,reusable,library,agents,trajectories

---

#### 2. Post-Training Shifts Confidence: A Three-Stage Analysis of How SFT, RL, and OPD Shape Pre-, Intra-, and Post-CoT Calibration

- **arXiv**: [2607.13753](https://arxiv.org/abs/2607.13753)
- **摘要**: confidence,opd,post,reasoning,sft,calibration,early,position,posconf,aggregation
- **关键词**: confidence,opd,post,reasoning,sft,calibration,early,position,posconf,aggregation

---

#### 3. Self-supervised Speech Comparison for L2 Phone, Rhythm, and Intonation Scoring

- **arXiv**: [2607.13721](https://arxiv.org/abs/2607.13721)
- **摘要**: intonation,rhythm,dtw,speech,scoring,phonetic,assessment,self,supervised,suprasegmental
- **关键词**: intonation,rhythm,dtw,speech,scoring,phonetic,assessment,self,supervised,suprasegmental

---

#### 4. NodeImport: Imbalanced Node Classification with Node Importance Assessment

- **arXiv**: [2607.13837](https://arxiv.org/abs/2607.13837)
- **摘要**: node,imbalance,nodeimport,nodes,class,imbalanced,importance,classes,classification,underrepresenting
- **关键词**: node,imbalance,nodeimport,nodes,class,imbalanced,importance,classes,classification,underrepresenting

---

#### 5. Implementations of Quantum and Classical Topology-Aligned Architectures for Molecular Property Prediction

- **arXiv**: [2607.13737](https://arxiv.org/abs/2607.13737)
- **摘要**: aligned,qm9,topology,quantum,implementations,classical,iso,qgnn,cgnn,architectures
- **关键词**: aligned,qm9,topology,quantum,implementations,classical,iso,qgnn,cgnn,architectures



### 🏋️ 训练方法 (4 篇)

#### 1. Post-Training Shifts Confidence: A Three-Stage Analysis of How SFT, RL, and OPD Shape Pre-, Intra-, and Post-CoT Calibration

- **arXiv**: [2607.13753](https://arxiv.org/abs/2607.13753)
- **摘要**: confidence,opd,post,reasoning,sft,calibration,early,position,posconf,aggregation
- **关键词**: confidence,opd,post,reasoning,sft,calibration,early,position,posconf,aggregation

---

#### 2. Exploring Post-Training Alignment of Small Language Models for Biomedical Data-to-Text Generation: A Case Study of Medication Leaflet

- **arXiv**: [2607.13430](https://arxiv.org/abs/2607.13430)
- **摘要**: biomedical,slms,grpo,orpo,leaflet,datato,openfda,medication,post,alignment
- **关键词**: biomedical,slms,grpo,orpo,leaflet,datato,openfda,medication,post,alignment

---

#### 3. Demystifying On-Policy Distillation: Roles, Pathologies, and Regulations

- **arXiv**: [2607.13399](https://arxiv.org/abs/2607.13399)
- **摘要**: opd,pathologies,regulations,exploration,student,distillation,teacher,signal,length,guiding
- **关键词**: opd,pathologies,regulations,exploration,student,distillation,teacher,signal,length,guiding

---

#### 4. Meta-Learning Preferences for Multilingual LLM Alignment

- **arXiv**: [2607.13315](https://arxiv.org/abs/2607.13315)
- **摘要**: meta,languages,preference,multilingual,language,target,alignment,across,settings,resource
- **关键词**: meta,languages,preference,multilingual,language,target,alignment,across,settings,resource



### ⚡ 推理优化 (1 篇)

#### 1. Exploring Post-Training Alignment of Small Language Models for Biomedical Data-to-Text Generation: A Case Study of Medication Leaflet

- **arXiv**: [2607.13430](https://arxiv.org/abs/2607.13430)
- **摘要**: biomedical,slms,grpo,orpo,leaflet,datato,openfda,medication,post,alignment
- **关键词**: biomedical,slms,grpo,orpo,leaflet,datato,openfda,medication,post,alignment



---

## 今日技术热点

今日扫描到 算法与架构 5 篇、训练方法 4 篇、推理优化 1 篇。

## 算法与架构趋势

当前 LLM 架构正从纯 Transformer 向混合架构演进：SSM (Mamba) 和线性注意力在长序列场景展现优势，MoE 在推理成本可控的前提下持续扩展参数规模。小模型架构注重蒸馏和紧凑设计。

## 训练方法趋势

DPO 和直接偏好优化正在成为 RLHF 的高效替代方案。合成数据质量成为新的研究焦点。LoRA/QLoRA 已成为高效微调的事实标准。

## 推理优化趋势

INT4 量化 (GPTQ/AWQ) 已成熟，GGUF 格式让端侧部署成为可能。Speculative decoding 在线推理中逐步普及。KV cache 压缩是降低长上下文推理成本的关键。

## 关键洞察

1. **架构多元化**: Transformer 不再是唯一选择，SSM 和混合架构值得持续关注
2. **对齐轻量化**: DPO 系列方法降低了高质量对齐的门槛
3. **推理即服务**: 推理优化的研究热度反映了部署需求的爆发
4. **小模型逆袭**: 端侧 SLM 的设计思路与大模型差异显著，需要专门的技术栈
5. **数据 > 算法**: 训练数据质量对模型能力的影响被重新审视

## 学习建议

1. 重点关注 Mamba/Mamba-2 和混合架构的最新论文
2. 实践 DPO 训练流程，对比 RLHF 的效果差异
3. 尝试 vLLM + 量化模型的端到端推理优化

*注：GLM-5 API 未调用，此为备用分析*

---

## 📚 附录

### 筛选关键词

**算法**: attention mechanism, mixture of experts, MoE, sparse attention, flash attention, rotary position, RoPE, grouped query, GQA, KV cache ...

**训练**: pre-training, pretraining, post-training, fine-tuning, finetuning, supervised fine-tuning, SFT, alignment, RLHF, DPO ...

**推理**: inference, serving, latency, throughput, speculative decoding, batching, continuous batching, PagedAttention, vLLM, quantization ...

---

*本报告由 OpenClaw 自动生成 | LLM & SLM Research Daily*
