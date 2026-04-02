---
title: AI Scientist 研究报告 demo
tags:
  - agent
  - ai-trends
  - daily-insights
  - arxiv
  - github
categories:
  - 前沿洞察
abbrlink: 4308
date: 2026-03-29 18:00:00
---

# AI Scientist 研究报告

_筛选论文：14；检索召回：0；辩论轮次：0_

你是研究助理，请基于以下结构化数据写一份 Markdown 研究报告。
语言：全文须为简体中文（标题、小节名、列表、表格说明均为中文；论文标题、作者、专有名词可保留原文）。
硬性要求：
- 用二级标题组织：摘要；趋势与数据；文献与检索要点；假设与辩论摘要；局限与后续工作。
- 摘要≤200字，须含筛选论文数、检索命中数、辩论裁决概览（接受/拒绝/未决条数）。
- 引用论文时只陈述摘要中明确出现的事实，不编造作者结论。
- 除论文题名与必要术语外，正文不得使用英文段落或英文小节标题。

## 输入数据

### 趋势
{
  "by_category": {
    "uncategorized": 14
  },
  "total": 14
}

### 检索增强召回（优先引用）
_（无检索结果，以下用筛选全集）_

### 论文样本（筛选后，最多 20 条）
- **Training the Knowledge Base through Evidence Distillation and Write-Back Enrichment** — The knowledge base in a retrieval-augmented generation (RAG) system is typically assembled once and never revised, even though the facts a query requires are often fragmented across documents and buried in irrelevant content. We argue that the knowledge base should be treated as a trainable componen…
- **Back to Basics: Revisiting ASR in the Age of Voice Agents** — Automatic speech recognition (ASR) systems have achieved near-human accuracy on curated benchmarks, yet still fail in real-world voice agents under conditions that current evaluations do not systematically cover. Without diagnostic tools that isolate specific failure factors, practitioners cannot an…
- **R-C2: Cycle-Consistent Reinforcement Learning Improves Multimodal Reasoning** — Robust perception and reasoning require consistency across sensory modalities. Yet current multimodal models often violate this principle, yielding contradictory predictions for visual and textual representations of the same concept. Rather than masking these failures with standard voting mechanisms…
- **Agent Factories for High Level Synthesis: How Far Can General-Purpose Coding Agents Go in Hardware Optimization?** — We present an empirical study of how far general-purpose coding agents -- without hardware-specific training -- can optimize hardware designs from high-level algorithmic specifications. We introduce an agent factory, a two-stage pipeline that constructs and coordinates multiple autonomous optimizati…
- **Is Mathematical Problem-Solving Expertise in Large Language Models Associated with Assessment Performance?** — Large Language Models (LLMs) are increasingly used in math education not only as problem solvers but also as assessors of learners' reasoning. However, it remains unclear whether stronger math problem-solving ability is associated with stronger step-level assessment performance. This study examines …
- **EcoThink: A Green Adaptive Inference Framework for Sustainable and Accessible Agents** — As the Web transitions from static retrieval to generative interaction, the escalating environmental footprint of Large Language Models (LLMs) presents a critical sustainability challenge. Current paradigms indiscriminately apply computation-intensive strategies like Chain-of-Thought (CoT) to billio…
- **Cross-Model Disagreement as a Label-Free Correctness Signal** — Detecting when a language model is wrong without ground truth labels is a fundamental challenge for safe deployment. Existing approaches rely on a model's own uncertainty -- such as token entropy or confidence scores -- but these signals fail critically on the most dangerous failure mode: confident …
- **Modernising Reinforcement Learning-Based Navigation for Embodied Semantic Scene Graph Generation** — Semantic world models enable embodied agents to reason about objects, relations, and spatial context beyond purely geometric representations. In Organic Computing, such models are a key enabler for objective-driven self-adaptation under uncertainty and resource constraints. The core challenge is to …
- **Agentic Trust Coordination for Federated Learning through Adaptive Thresholding and Autonomous Decision Making in Sustainable and Resilient Industrial Networks** — Distributed intelligence in industrial networks increasingly integrates sensing, communication, and computation across heterogeneous and resource constrained devices. Federated learning (FL) enables collaborative model training in such environments, but its reliability is affected by inconsistent cl…
- **Macroscopic Characteristics of Mixed Traffic Flow with Deep Reinforcement Learning Based Automated and Human-Driven Vehicles** — Automated Vehicle (AV) control in mixed traffic, where AVs coexist with human-driven vehicles, poses significant challenges in balancing safety, efficiency, comfort, fuel efficiency, and compliance with traffic rules while capturing heterogeneous driver behavior. Traditional car-following models, su…
- **DAGverse: Building Document-Grounded Semantic DAGs from Scientific Papers** — Directed Acyclic Graphs (DAGs) are widely used to represent structured knowledge in scientific and technical domains. However, datasets for real-world DAGs remain scarce because constructing them typically requires expert interpretation of domain documents. We study Doc2SemDAG construction: recoveri…
- **SliderQuant: Accurate Post-Training Quantization for LLMs** — In this paper, we address post-training quantization (PTQ) for large language models (LLMs) from an overlooked perspective: given a pre-trained high-precision LLM, the predominant sequential quantization framework treats different layers equally, but this may be not optimal in challenging bit-width …
- **Trace2Skill: Distill Trajectory-Local Lessons into Transferable Agent Skills** — Equipping Large Language Model (LLM) agents with domain-specific skills is critical for tackling complex tasks. Yet, manual authoring creates a severe scalability bottleneck. Conversely, automated skill generation often yields fragile or fragmented results because it either relies on shallow paramet…
- **UniAI-GraphRAG: Synergizing Ontology-Guided Extraction, Multi-Dimensional Clustering, and Dual-Channel Fusion for Robust Multi-Hop Reasoning** — Retrieval-Augmented Generation (RAG) systems face significant challenges in complex reasoning, multi-hop queries, and domain-specific QA. While existing GraphRAG frameworks have made progress in structural knowledge organization, they still have limitations in cross-industry adaptability, community …