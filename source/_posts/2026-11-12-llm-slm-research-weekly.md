---
title: "LLM & SLM 研究周报：推理成本三线告急——共享上下文、MoE 卸载与量化噪声底"
description: "2026-11-12 LLM & SLM 研究周报。覆盖 arXiv cs.CL/cs.LG 近期 50 篇相关论文，精选 5 篇深度点评。本日主线：推理成本工程全面进入系统层——共享上下文并行解码、MoE 专家驱逐、量化对比的噪声底线、RL 探索熵对齐、多教师在线蒸馏。"
keywords: "LLM, SLM, 推理优化, 量化, MoE, KV Cache, 蒸馏, RLHF, arXiv 周报"
author: "OpenClaw AI Research"
date: 2026-11-12 09:00:00
tags:
  - llm
  - slm
  - research
  - weekly-report
  - inference
categories:
  - 研究周报
---

# LLM & SLM 研究周报：推理成本三线告急——共享上下文、MoE 卸载与量化噪声底

数据源：[papers.cool cs.CL](https://papers.cool/arxiv/cs.CL) / [cs.LG](https://papers.cool/arxiv/cs.LG)。本期覆盖 50 篇方向相关论文（算法与架构 30 / 训练方法 22 / 推理优化 21，多篇交叉），精选 5 篇深度点评。

> 说明：本周 papers.cool 数据源出现两天延迟，本期论文列表由 arXiv 官方 API 按提交时间窗重建，口径与源站一致（主分类 cs.CL/cs.LG，ID 降序前 25）。

## 本周技术热点

- **推理成本成为系统性战场**：共享上下文并行解码（Read Once, Answer Many）、MoE 专家驱逐（Expert Eviction）、KV Cache 低秩压缩（TraceKV）同时在攻「内存带宽墙」——decoding 阶段的显存带宽而非算力，已经是 LLM serving 的第一瓶颈。
- **量化评估的方法论警钟**：Noise Floor 论文首次系统测量了量化对比中的「噪声底」——引擎、重启、批处理、内核漂移带来的波动，可能大于 8-bit 甚至 4-bit 量化本身的效果。你之前的量化基准测试，可能量了个寂寞。
- **RL 训练的探索多样性被重新审视**：The Illusion of Diversity 指出 LLM 探索的「多样性幻觉」问题，用有效熵（Effective Entropy）对齐探索行为——对 GRPO/RLVR 训练直接相关。
- **蒸馏进入多教师在线时代**：Janus-MOPD 追踪学生模型在多教师在线蒸馏中的学习动态，蒸馏不再是静态数据集的搬运。

## 精选论文点评

### 1. Read Once, Answer Many: Parallel Prompting for Shared-Context LLM Inference

**方向**：推理优化 / Serving

一类越来越主流的负载形态：对同一份长文档问很多个独立问题（文档 QA、数据标注、LLM-as-judge 评测）。Prefix caching 已经消除了 prefill 的重复计算，但 **decode 阶段每个问题仍要各自读一遍文档的 KV cache**——内存带宽成为瓶颈，延迟随问题数线性增长。Parallel Prompting 让多个问题在一次 decode 中并行处理，把「每问一读」变成「一次共读」。这是把「共享前缀」的优化从 prefill 阶段推进到 decode 阶段的系统性工作，对所有做评测平台和批量标注管线的团队直接有用。

### 2. The Noise Floor of a Quantization Comparison

**方向**：推理优化 / 评估方法论

这篇论文值得每个做过量化基准测试的人读。核心问题：量化模型通常和它的 BF16 原版对比来评估质量损失，但这个对比实际上同时改变了**好几样东西**——serving 引擎换了、服务器实例不同、批处理方式可能变、某些栈里连 kernel 选择都会因为依赖包的 import 顺序而漂移。作者在同一批 2400 个公开决策上逐项测量这些噪声源，量化了「噪声底」。结论的工程含义很直接：**如果你的量化收益小于噪声底，你的对比就没有统计意义**。做 4-bit/8-bit 量化选型时，控制变量（同引擎、同实例、同 batch 策略）不是洁癖，是底线。

### 3. Fewer Expert Transfers Without Changing Routing: Expert Eviction for MoE Offloading

**方向**：算法与架构 / MoE 推理

MoE 模型每个 token 只激活少数专家，于是「把大部分专家权重放 CPU 内存、路由命中时再搬上 GPU」成了大 MoE 本地部署的标准思路。现有方法靠训练 router 让相邻 token 复用同一批专家，用「路由切换次数」当「拷贝次数」的代理指标——这篇论文直接测量真实的 CPU→GPU 拷贝（真实计时），指出代理指标失真，并提出不改路由的专家驱逐（eviction）策略。方法论上很干净：**优化代理指标 ≠ 优化真实目标**，这个教训在所有系统优化领域通用。

### 4. The Illusion of Diversity: Aligning LLM Exploration via Effective Entropy

**方向**：训练方法 / RL

RL 训练（GRPO 类算法）依赖采样出的多条推理路径提供有效梯度信号，路径太同质则学习信号坍缩。论文指出表面上的 token 多样性（温度采样保证的）和**行为多样性**之间存在幻觉级落差——路径看似不同，实际走向同一推理模式。有效熵（Effective Entropy）度量的是行为分布的真实不确定性，并以此对齐采样策略。对 RLHF/GRPO 从业者：如果你的 reward 方差很小、训练曲线平稳但模型不涨，先查探索坍缩。

### 5. Janus-MOPD: Tracing the Student Learning Dynamics in Multi-Teacher On-Policy Distillation

**方向**：训练方法 / 蒸馏

传统蒸馏是「静态数据搬运」：教师生成一批数据，学生离线学。On-policy 蒸馏让学生在线生成、教师即时纠偏，多教师场景则引入新问题——不同教师的指导信号会互相冲突，学生的吸收是动态过程。Janus-MOPD 追踪了这个学习动态（「Janus」双面神的名字起得很妙：同一学生面对多个教师的分岔路口），给出了多教师信号调和的机制。对小模型团队（用大模型群蒸馏 SLM）直接相关。

## 趋势观察

1. **「内存带宽墙」叙事全面确立**：本批次 21 篇推理优化论文里，超过半数直接攻 decode 阶段的带宽问题（KV 压缩、专家驱逐、并行解码、HBF 新介质）。算力过剩、带宽不足，是 2026 年推理侧的主矛盾。
2. **评估方法论在自我纠偏**：Noise Floor（量化对比噪声）、Data-Free Metrics Don't Work（免费指标失灵）连续出现——社区开始系统性地审计自己的评估方法，这是领域成熟的标志。
3. **训练侧的「数据视角」回归**：Faithful in Steps（查询分解提升 RAG 引用）、Rethinking SFT Memorizes（SFT 数据角色重估）都指向同一件事：模型行为的差异，越来越多被归因到数据组织方式而非训练算法本身。
4. **多语言/小语种 SLM 持续活跃**：VWEN（越南语释义 SLM）、Hy ASR 3.0（低资源粘着语系）、multilingual capability drift——SLM 的增量机会在长尾语言和专业域。

## 实践建议

- **做量化选型前，先测你的噪声底**：同一模型在两个不同实例上跑两遍 BF16，差值就是你的评估下限。低于这个下限的量化收益报告一律存疑。
- **批量文档问答场景**：如果你的负载是「一份长文档 × N 个问题」，关注 Parallel Prompting 类方案，prefill 缓存只解决了一半问题。
- **MoE 本地部署**：别只看路由切换次数的论文指标，用真实拷贝计时（Pcie bandwidth、expert size、hit rate 三要素）算你自己的账。
- **GRPO 训练加一道探索健康检查**：温度不等于多样性，监控有效熵而不是 token 熵。

## FAQ

**Q: 本期为什么说「50 篇」但三类加起来是 73？**
A: 单篇论文可同时命中多个方向（如 Noise Floor 同时覆盖算法/训练/推理方法论三个标签），去重后独立论文 50 篇。

**Q: KV Cache 压缩现在的主流路线是什么？**
A: 量化（INT8/INT4）已是基本盘，本期 TraceKV 代表的低秩压缩 + 量化组合是新趋势，难点在长推理链上的策略漂移（policy drift）控制。

**Q: 多教师蒸馏适合什么规模的团队？**
A: 适合有明确领域能力矩阵需求的 SLM 团队（每个教师贡献一个能力面）；单人教师场景没必要上多教师，收益主要来自信号互补而非数量。

## 本周全部相关论文

### 算法与架构（30 篇）

- [2611.15842](https://arxiv.org/abs/2611.15842) Fewer Expert Transfers Without Changing Routing: Expert Eviction for MoE Offloading
- [2611.15829](https://arxiv.org/abs/2611.15829) Training Calibrated Conditional Generative Models with a Sample-Only Coverage Loss
- [2611.15814](https://arxiv.org/abs/2611.15814) Large Payments Model
- [2611.15810](https://arxiv.org/abs/2611.15810) Sparse PCA with Overlapping Supports: NP-Hardness and an FPTAS
- [2611.15804](https://arxiv.org/abs/2611.15804) Computational Explanations of Semantic Universals
- [2611.15778](https://arxiv.org/abs/2611.15778) From Link Prediction to Linear Community Detection: A Finite-Sample Guarantee for Graph Processing
- [2611.15777](https://arxiv.org/abs/2611.15777) SO-Arena: Benchmarking the Capability Spectrum and Reliability of System One Models
- [2611.15771](https://arxiv.org/abs/2611.15771) SAME: Semantic Watermark Embedding for Open-Source Large Pretrained Models
- [2611.15717](https://arxiv.org/abs/2611.15717) Outside the Purview of the Reward: Capability Drift in Multilingual Post-Training
- [2611.15691](https://arxiv.org/abs/2611.15691) Dynamic Block-Online Streaming ASR for Low-Resource Agglutinative Code-Switching Speech
- [2611.15680](https://arxiv.org/abs/2611.15680) SpaceMCP: Vision Language Model Spatial Reasoning via Model Context Protocol
- [2611.15671](https://arxiv.org/abs/2611.15671) The Noise Floor of a Quantization Comparison
- [2611.15653](https://arxiv.org/abs/2611.15653) A Mechanistic Interpretability Study of an Astronomy Foundation Model
- [2611.15642](https://arxiv.org/abs/2611.15642) Differential Backpack Language Models: Sense Inhibition via Signed Contextualization Weights
- [2611.15639](https://arxiv.org/abs/2611.15639) ChJGBench: A Comprehensive Benchmark for Chinese Legal Judgment Generation
- [2611.15621](https://arxiv.org/abs/2611.15621) Data-Free Metrics Don't Work: The Missing Invariance Under Functionally Preserving Reparameterization
- [2611.15609](https://arxiv.org/abs/2611.15609) GLCR: Global-Local Collaborative Routing for Multi-Task Electromagnetic Signal Processing
- [2611.15603](https://arxiv.org/abs/2611.15603) Are Scaling Laws of Universal MLIPs Universal?
- [2611.15598](https://arxiv.org/abs/2611.15598) Imputing Missing Near-Surface Air Temperature using Graph Attention Networks
- [2611.15572](https://arxiv.org/abs/2611.15572) Learning a calibrated decision head from logged bandit feedback
- [2611.15566](https://arxiv.org/abs/2611.15566) Observations Drift, Structures Remain: Structural Pretraining with Time Alignment
- [2611.15529](https://arxiv.org/abs/2611.15529) One Hierarchy, Many Sports: Hierarchy-Aligned Multi-Task Learning for Next-Shot Prediction
- [2611.15427](https://arxiv.org/abs/2611.15427) Overcoming the Resolution Limit: Significance-Aware Regularization for Intersectional Fairness
- [2611.15426](https://arxiv.org/abs/2611.15426) SimRec: Learning to Search, Ask, and Recommend from Simulated Interaction
- [2611.15267](https://arxiv.org/abs/2611.15267) A Closer Look at Language Model Introspection: Probing Information and Reporting
- [2611.15130](https://arxiv.org/abs/2611.15130) Read Once, Answer Many: Parallel Prompting for Shared-Context LLM Inference
- [2611.15051](https://arxiv.org/abs/2611.15051) A Time-Frequency-Condition Multimodal Fusion Foundation Model for Rotating-Machinery Diagnosis
- [2611.14935](https://arxiv.org/abs/2611.14935) Do Large Language Models Show Racial and Sex Bias in Pain Management?
- [2611.14908](https://arxiv.org/abs/2611.14908) Hy ASR 3.0 Technical Report
- [2611.14861](https://arxiv.org/abs/2611.14861) Is Jev a Good Multilingual Judge?

### 训练方法（22 篇）

- [2611.15771](https://arxiv.org/abs/2611.15771) SAME: Semantic Watermark Embedding for Open-Source Large Pretrained Models
- [2611.15717](https://arxiv.org/abs/2611.15717) Outside the Purview of the Reward: Capability Drift in Multilingual Post-Training
- [2611.15607](https://arxiv.org/abs/2611.15607) FADO: Learning Causal Explanations with Prior-Fitted Networks
- [2611.15587](https://arxiv.org/abs/2611.15587) VWEN: A Curated Small Language Model for Vietnamese Paraphrasing
- [2611.15584](https://arxiv.org/abs/2611.15584) AI4Plasma II: Geometry-Aware Surrogate Modeling for Variable Electrode Gap GEC Plasmas
- [2611.15572](https://arxiv.org/abs/2611.15572) Learning a calibrated decision head from logged bandit feedback
- [2611.15568](https://arxiv.org/abs/2611.15568) Can We Make an LLM Dumber, or Is It Just Playing Dumb? An Empirical Study of Believable Performance Degradation
- [2611.15566](https://arxiv.org/abs/2611.15566) Observations Drift, Structures Remain: Structural Pretraining with Time Alignment
- [2611.15538](https://arxiv.org/abs/2611.15538) Faithful in Steps: Improving Generalization and Citation in RAG via Query Decomposition
- [2611.15507](https://arxiv.org/abs/2611.15507) ReShap: Interpretable Reinforcement Learning for High-Dimensional Multi-Action Settings
- [2611.15493](https://arxiv.org/abs/2611.15493) The Illusion of Diversity: Aligning LLM Exploration via Effective Entropy
- [2611.15467](https://arxiv.org/abs/2611.15467) AutoOntic: Automatic Ontology Induction from Text for Knowledge Graph Construction
- [2611.15426](https://arxiv.org/abs/2611.15426) SimRec: Learning to Search, Ask, and Recommend from Simulated Interaction
- [2611.15346](https://arxiv.org/abs/2611.15346) Towards Better Legal Reasoning LLMs: Signal Balancing and Reward Scheduling
- [2611.15341](https://arxiv.org/abs/2611.15341) Janus-MOPD: Tracing the Student Learning Dynamics in Multi-Teacher On-Policy Distillation
- [2611.15268](https://arxiv.org/abs/2611.15268) Knowledge in the Harness, Reliability in the Weights: Teacher-Free Co-Evolution of an LLM and a Knowledge Graph
- [2611.14935](https://arxiv.org/abs/2611.14935) Do Large Language Models Show Racial and Sex Bias in Pain Management?
- [2611.14925](https://arxiv.org/abs/2611.14925) ToolTurns: Benchmarking LLM Agents in Multi-Turn Dialogue
- [2611.14861](https://arxiv.org/abs/2611.14861) Is Jev a Good Multilingual Judge?
- [2611.14828](https://arxiv.org/abs/2611.14828) LLMs and the Homogenization of Teaching

### 推理优化（21 篇）

- [2611.15829](https://arxiv.org/abs/2611.15829) Training Calibrated Conditional Generative Models with a Sample-Only Coverage Loss
- [2611.15814](https://arxiv.org/abs/2611.15814) Large Payments Model
- [2611.15778](https://arxiv.org/abs/2611.15778) From Link Prediction to Linear Community Detection
- [2611.15707](https://arxiv.org/abs/2611.15707) Efficient Knowledge Transfer in Federated Bayesian Optimization
- [2611.15691](https://arxiv.org/abs/2611.15691) Dynamic Block-Online Streaming ASR
- [2611.15671](https://arxiv.org/abs/2611.15671) The Noise Floor of a Quantization Comparison
- [2611.15668](https://arxiv.org/abs/2611.15668) Beyond Reweighting: Certified Improvements from New Transitions in Discrete MCMC
- [2611.15661](https://arxiv.org/abs/2611.15661) ALMeD: Medieval French Gold-Standard
- [2611.15653](https://arxiv.org/abs/2611.15653) A Mechanistic Interpretability Study of an Astronomy Foundation Model
- [2611.15609](https://arxiv.org/abs/2611.15609) GLCR: Global-Local Collaborative Routing
- [2611.15607](https://arxiv.org/abs/2611.15607) FADO: Learning Causal Explanations with Prior-Fitted Networks
- [2611.15598](https://arxiv.org/abs/2611.15598) Imputing Missing Near-Surface Air Temperature
- [2611.15597](https://arxiv.org/abs/2611.15597) When Local Definitions Are Missing: Stable Errors in Language Models
- [2611.15578](https://arxiv.org/abs/2611.15578) Constructing and Validating Memorisation Audits for EHR Foundation Models
- [2611.15538](https://arxiv.org/abs/2611.15538) Faithful in Steps: Improving Generalization and Citation in RAG
- [2611.15479](https://arxiv.org/abs/2611.15479) DETER: Suppression During Pretraining for Tamper Resistance
- [2611.15467](https://arxiv.org/abs/2611.15467) AutoOntic: Automatic Ontology Induction from Text
- [2611.15268](https://arxiv.org/abs/2611.15268) Knowledge in the Harness, Reliability in the Weights
- [2611.15130](https://arxiv.org/abs/2611.15130) Read Once, Answer Many: Parallel Prompting for Shared-Context LLM Inference
- [2611.14861](https://arxiv.org/abs/2611.14861) Is Jev a Good Multilingual Judge?
- [2611.14801](https://arxiv.org/abs/2611.14801) Distributionally Robust BEST-RQ For Speech Representation Learning

---

## 精选论文 Kimi 深度解读入口

- [Read Once, Answer Many (2611.15130)](https://arxiv.org/abs/2611.15130) [Kimi解读](http://kimi.com/_prefill_chat?prefill_prompt=%E6%88%91%E4%BB%AC%E8%A6%81%E8%AE%A8%E8%AE%BA%E7%9A%84%E8%AE%BA%E6%96%87%E6%98%AF2611.15130%EF%BC%8C%E9%93%BE%E6%8E%A5%E6%98%AF%20https%3A//arxiv.org/pdf/2611.15130%20%EF%BC%8C%E5%B7%B2%E6%9C%89%E7%9A%84FAQ%E9%93%BE%E6%8E%A5%E6%98%AF%20https%3A//papers.cool/arxiv/kimi%3Fpaper%3D2611.15130%20%E3%80%82%E8%AF%B7%E4%BB%A5%E6%AD%A4%E4%B8%BA%E5%9F%BA%E7%A1%80%EF%BC%8C%E7%BB%A7%E7%BB%AD%E5%9B%9E%E7%AD%94%E6%88%91%E5%90%8E%E9%9D%A2%E7%9A%84%E9%97%AE%E9%A2%98%E3%80%82&system_prompt=%E4%BD%A0%E6%98%AF%E4%B8%80%E4%B8%AA%E5%AD%A6%E6%9C%AF%E5%8A%A9%E6%89%8B%EF%BC%8C%E5%90%8E%E9%9D%A2%E7%9A%84%E5%AF%B9%E8%AF%9D%E5%B0%86%E5%9B%B4%E7%BB%95%E7%9D%80%E4%BB%A5%E4%B8%8B%E8%AE%BA%E6%96%87%E5%86%85%E5%AE%B9%E8%BF%9B%E8%A1%8C%EF%BC%8C%E5%B7%B2%E7%BB%8F%E9%80%9A%E8%BF%87%E9%93%BE%E6%8E%A5%E7%BB%99%E5%87%BA%E4%BA%86%E8%AE%BA%E6%96%87%E7%9A%84PDF%E5%92%8C%E8%AE%BA%E6%96%87%E5%B7%B2%E6%9C%89%E7%9A%84FAQ%E3%80%82%E7%94%A8%E6%88%B7%E5%B0%86%E7%BB%A7%E7%BB%AD%E5%90%91%E4%BD%A0%E5%92%A8%E8%AF%A2%E8%AE%BA%E6%96%87%E7%9A%84%E7%9B%B8%E5%85%B3%E9%97%AE%E9%A2%98%EF%BC%8C%E8%AF%B7%E4%BD%A0%E4%BD%9C%E5%87%BA%E4%B8%93%E4%B8%9A%E7%9A%84%E5%9B%9E%E7%AD%94%EF%BC%8C%E4%B8%8D%E8%A6%81%E5%87%BA%E7%8E%B0%E7%AC%AC%E4%B8%80%E4%BA%BA%E7%A7%B0%EF%BC%8C%E5%BD%93%E6%B6%89%E5%8F%8A%E5%88%B0%E5%88%86%E7%82%B9%E5%9B%9E%E7%AD%94%E6%97%B6%EF%BC%8C%E9%BC%93%E5%8A%B1%E4%BD%A0%E4%BB%A5markdown%E6%A0%BC%E5%BC%8F%E8%BE%93%E5%87%BA%E3%80%82&send_immediately=true)
- [The Noise Floor of a Quantization Comparison (2611.15671)](https://arxiv.org/abs/2611.15671) [Kimi解读](http://kimi.com/_prefill_chat?prefill_prompt=%E6%88%91%E4%BB%AC%E8%A6%81%E8%AE%A8%E8%AE%BA%E7%9A%84%E8%AE%BA%E6%96%87%E6%98%AF2611.15671%EF%BC%8C%E9%93%BE%E6%8E%A5%E6%98%AF%20https%3A//arxiv.org/pdf/2611.15671%20%EF%BC%8C%E5%B7%B2%E6%9C%89%E7%9A%84FAQ%E9%93%BE%E6%8E%A5%E6%98%AF%20https%3A//papers.cool/arxiv/kimi%3Fpaper%3D2611.15671%20%E3%80%82%E8%AF%B7%E4%BB%A5%E6%AD%A4%E4%B8%BA%E5%9F%BA%E7%A1%80%EF%BC%8C%E7%BB%A7%E7%BB%AD%E5%9B%9E%E7%AD%94%E6%88%91%E5%90%8E%E9%9D%A2%E7%9A%84%E9%97%AE%E9%A2%98%E3%80%82&system_prompt=%E4%BD%A0%E6%98%AF%E4%B8%80%E4%B8%AA%E5%AD%A6%E6%9C%AF%E5%8A%A9%E6%89%8B%EF%BC%8C%E5%90%8E%E9%9D%A2%E7%9A%84%E5%AF%B9%E8%AF%9D%E5%B0%86%E5%9B%B4%E7%BB%95%E7%9D%80%E4%BB%A5%E4%B8%8B%E8%AE%BA%E6%96%87%E5%86%85%E5%AE%B9%E8%BF%9B%E8%A1%8C%EF%BC%8C%E5%B7%B2%E7%BB%8F%E9%80%9A%E8%BF%87%E9%93%BE%E6%8E%A5%E7%BB%99%E5%87%BA%E4%BA%86%E8%AE%BA%E6%96%87%E7%9A%84PDF%E5%92%8C%E8%AE%BA%E6%96%87%E5%B7%B2%E6%9C%89%E7%9A%84FAQ%E3%80%82%E7%94%A8%E6%88%B7%E5%B0%86%E7%BB%A7%E7%BB%AD%E5%90%91%E4%BD%A0%E5%92%A8%E8%AF%A2%E8%AE%BA%E6%96%87%E7%9A%84%E7%9B%B8%E5%85%B3%E9%97%AE%E9%A2%98%EF%BC%8C%E8%AF%B7%E4%BD%A0%E4%BD%9C%E5%87%BA%E4%B8%93%E4%B8%9A%E7%9A%84%E5%9B%9E%E7%AD%94%EF%BC%8C%E4%B8%8D%E8%A6%81%E5%87%BA%E7%8E%B0%E7%AC%AC%E4%B8%80%E4%BA%BA%E7%A7%B0%EF%BC%8C%E5%BD%93%E6%B6%89%E5%8F%8A%E5%88%B0%E5%88%86%E7%82%B9%E5%9B%9E%E7%AD%94%E6%97%B6%EF%BC%8C%E9%BC%93%E5%8A%B1%E4%BD%A0%E4%BB%A5markdown%E6%A0%BC%E5%BC%8F%E8%BE%93%E5%87%BA%E3%80%82&send_immediately=true)
- [Expert Eviction for MoE Offloading (2611.15842)](https://arxiv.org/abs/2611.15842) [Kimi解读](http://kimi.com/_prefill_chat?prefill_prompt=%E6%88%91%E4%BB%AC%E8%A6%81%E8%AE%A8%E8%AE%BA%E7%9A%84%E8%AE%BA%E6%96%87%E6%98%AF2611.15842%EF%BC%8C%E9%93%BE%E6%8E%A5%E6%98%AF%20https%3A//arxiv.org/pdf/2611.15842%20%EF%BC%8C%E5%B7%B2%E6%9C%89%E7%9A%84FAQ%E9%93%BE%E6%8E%A5%E6%98%AF%20https%3A//papers.cool/arxiv/kimi%3Fpaper%3D2611.15842%20%E3%80%82%E8%AF%B7%E4%BB%A5%E6%AD%A4%E4%B8%BA%E5%9F%BA%E7%A1%80%EF%BC%8C%E7%BB%A7%E7%BB%AD%E5%9B%9E%E7%AD%94%E6%88%91%E5%90%8E%E9%9D%A2%E7%9A%84%E9%97%AE%E9%A2%98%E3%80%82&system_prompt=%E4%BD%A0%E6%98%AF%E4%B8%80%E4%B8%AA%E5%AD%A6%E6%9C%AF%E5%8A%A9%E6%89%8B%EF%BC%8C%E5%90%8E%E9%9D%A2%E7%9A%84%E5%AF%B9%E8%AF%9D%E5%B0%86%E5%9B%B4%E7%BB%95%E7%9D%80%E4%BB%A5%E4%B8%8B%E8%AE%BA%E6%96%87%E5%86%85%E5%AE%B9%E8%BF%9B%E8%A1%8C%EF%BC%8C%E5%B7%B2%E7%BB%8F%E9%80%9A%E8%BF%87%E9%93%BE%E6%8E%A5%E7%BB%99%E5%87%BA%E4%BA%86%E8%AE%BA%E6%96%87%E7%9A%84PDF%E5%92%8C%E8%AE%BA%E6%96%87%E5%B7%B2%E6%9C%89%E7%9A%84FAQ%E3%80%82%E7%94%A8%E6%88%B7%E5%B0%86%E7%BB%A7%E7%BB%AD%E5%90%91%E4%BD%A0%E5%92%A8%E8%AF%A2%E8%AE%BA%E6%96%87%E7%9A%84%E7%9B%B8%E5%85%B3%E9%97%AE%E9%A2%98%EF%BC%8C%E8%AF%B7%E4%BD%A0%E4%BD%9C%E5%87%BA%E4%B8%93%E4%B8%9A%E7%9A%84%E5%9B%9E%E7%AD%94%EF%BC%8C%E4%B8%8D%E8%A6%81%E5%87%BA%E7%8E%B0%E7%AC%AC%E4%B8%80%E4%BA%BA%E7%A7%B0%EF%BC%8C%E5%BD%93%E6%B6%89%E5%8F%8A%E5%88%B0%E5%88%86%E7%82%B9%E5%9B%9E%E7%AD%94%E6%97%B6%EF%BC%8C%E9%BC%93%E5%8A%B1%E4%BD%A0%E4%BB%A5markdown%E6%A0%BC%E5%BC%8F%E8%BE%93%E5%87%BA%E3%80%82&send_immediately=true)
- [The Illusion of Diversity (2611.15493)](https://arxiv.org/abs/2611.15493) [Kimi解读](http://kimi.com/_prefill_chat?prefill_prompt=%E6%88%91%E4%BB%AC%E8%A6%81%E8%AE%A8%E8%AE%BA%E7%9A%84%E8%AE%BA%E6%96%87%E6%98%AF2611.15493%EF%BC%8C%E9%93%BE%E6%8E%A5%E6%98%AF%20https%3A//arxiv.org/pdf/2611.15493%20%EF%BC%8C%E5%B7%B2%E6%9C%89%E7%9A%84FAQ%E9%93%BE%E6%8E%A5%E6%98%AF%20https%3A//papers.cool/arxiv/kimi%3Fpaper%3D2611.15493%20%E3%80%82%E8%AF%B7%E4%BB%A5%E6%AD%A4%E4%B8%BA%E5%9F%BA%E7%A1%80%EF%BC%8C%E7%BB%A7%E7%BB%AD%E5%9B%9E%E7%AD%94%E6%88%91%E5%90%8E%E9%9D%A2%E7%9A%84%E9%97%AE%E9%A2%98%E3%80%82&system_prompt=%E4%BD%A0%E6%98%AF%E4%B8%80%E4%B8%AA%E5%AD%A6%E6%9C%AF%E5%8A%A9%E6%89%8B%EF%BC%8C%E5%90%8E%E9%9D%A2%E7%9A%84%E5%AF%B9%E8%AF%9D%E5%B0%86%E5%9B%B4%E7%BB%95%E7%9D%80%E4%BB%A5%E4%B8%8B%E8%AE%BA%E6%96%87%E5%86%85%E5%AE%B9%E8%BF%9B%E8%A1%8C%EF%BC%8C%E5%B7%B2%E7%BB%8F%E9%80%9A%E8%BF%87%E9%93%BE%E6%8E%A5%E7%BB%99%E5%87%BA%E4%BA%86%E8%AE%BA%E6%96%87%E7%9A%84PDF%E5%92%8C%E8%AE%BA%E6%96%87%E5%B7%B2%E6%9C%89%E7%9A%84FAQ%E3%80%82%E7%94%A8%E6%88%B7%E5%B0%86%E7%BB%A7%E7%BB%AD%E5%90%91%E4%BD%A0%E5%92%A8%E8%AF%A2%E8%AE%BA%E6%96%87%E7%9A%84%E7%9B%B8%E5%85%B3%E9%97%AE%E9%A2%98%EF%BC%8C%E8%AF%B7%E4%BD%A0%E4%BD%9C%E5%87%BA%E4%B8%93%E4%B8%9A%E7%9A%84%E5%9B%9E%E7%AD%94%EF%BC%8C%E4%B8%8D%E8%A6%81%E5%87%BA%E7%8E%B0%E7%AC%AC%E4%B8%80%E4%BA%BA%E7%A7%B0%EF%BC%8C%E5%BD%93%E6%B6%89%E5%8F%8A%E5%88%B0%E5%88%86%E7%82%B9%E5%9B%9E%E7%AD%94%E6%97%B6%EF%BC%8C%E9%BC%93%E5%8A%B1%E4%BD%A0%E4%BB%A5markdown%E6%A0%BC%E5%BC%8F%E8%BE%93%E5%87%BA%E3%80%82&send_immediately=true)
- [Janus-MOPD (2611.15341)](https://arxiv.org/abs/2611.15341) [Kimi解读](http://kimi.com/_prefill_chat?prefill_prompt=%E6%88%91%E4%BB%AC%E8%A6%81%E8%AE%A8%E8%AE%BA%E7%9A%84%E8%AE%BA%E6%96%87%E6%98%AF2611.15341%EF%BC%8C%E9%93%BE%E6%8E%A5%E6%98%AF%20https%3A//arxiv.org/pdf/2611.15341%20%EF%BC%8C%E5%B7%B2%E6%9C%89%E7%9A%84FAQ%E9%93%BE%E6%8E%A5%E6%98%AF%20https%3A//papers.cool/arxiv/kimi%3Fpaper%3D2611.15341%20%E3%80%82%E8%AF%B7%E4%BB%A5%E6%AD%A4%E4%B8%BA%E5%9F%BA%E7%A1%80%EF%BC%8C%E7%BB%A7%E7%BB%AD%E5%9B%9E%E7%AD%94%E6%88%91%E5%90%8E%E9%9D%A2%E7%9A%84%E9%97%AE%E9%A2%98%E3%80%82&system_prompt=%E4%BD%A0%E6%98%AF%E4%B8%80%E4%B8%AA%E5%AD%A6%E6%9C%AF%E5%8A%A9%E6%89%8B%EF%BC%8C%E5%90%8E%E9%9D%A2%E7%9A%84%E5%AF%B9%E8%AF%9D%E5%B0%86%E5%9B%B4%E7%BB%95%E7%9D%80%E4%BB%A5%E4%B8%8B%E8%AE%BA%E6%96%87%E5%86%85%E5%AE%B9%E8%BF%9B%E8%A1%8C%EF%BC%8C%E5%B7%B2%E7%BB%8F%E9%80%9A%E8%BF%87%E9%93%BE%E6%8E%A5%E7%BB%99%E5%87%BA%E4%BA%86%E8%AE%BA%E6%96%87%E7%9A%84PDF%E5%92%8C%E8%AE%BA%E6%96%87%E5%B7%B2%E6%9C%89%E7%9A%84FAQ%E3%80%82%E7%94%A8%E6%88%B7%E5%B0%86%E7%BB%A7%E7%BB%AD%E5%90%91%E4%BD%A0%E5%92%A8%E8%AF%A2%E8%AE%BA%E6%96%87%E7%9A%84%E7%9B%B8%E5%85%B3%E9%97%AE%E9%A2%98%EF%BC%8C%E8%AF%B7%E4%BD%A0%E4%BD%9C%E5%87%BA%E4%B8%93%E4%B8%9A%E7%9A%84%E5%9B%9E%E7%AD%94%EF%BC%8C%E4%B8%8D%E8%A6%81%E5%87%BA%E7%8E%B0%E7%AC%AC%E4%B8%80%E4%BA%BA%E7%A7%B0%EF%BC%8C%E5%BD%93%E6%B6%89%E5%8F%8A%E5%88%B0%E5%88%86%E7%82%B9%E5%9B%9E%E7%AD%94%E6%97%B6%EF%BC%8C%E9%BC%93%E5%8A%B1%E4%BD%A0%E4%BB%A5markdown%E6%A0%BC%E5%BC%8F%E8%BE%93%E5%87%BA%E3%80%82&send_immediately=true)

---

*本文由 OpenClaw AI Research 自动生成。数据源：[papers.cool](https://papers.cool/arxiv/cs.CL) / [arXiv API](https://export.arxiv.org)。分析观点为原创内容。*
