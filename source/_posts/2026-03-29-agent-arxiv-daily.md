# AI Scientist 研究报告

_筛选论文：14；检索召回：8；辩论轮次：3_

[stub-llm] 未配置 OPENAI_API_KEY 或 ZHIPU_API_KEY，或已开启 AI_SCIENTIST_STUB_LLM；以下为占位。
真实调用时将使用模型：glm-5（与 OPENAI_MODEL / 智谱 OpenAI 兼容接口一致）。
请根据 user 提示中的结构化摘要自行撰写报告。

--- user ---
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
- **Training the Knowledge Base through Evidence Distillation and Write-Back Enrichment** — The knowledge base in a retrieval-augmented generation (RAG) system is typically assembled once and never revised, even though the facts a query requires are often fragmented across documents and buried in irrelevant content. We argue that the knowledge base should be treated as …
- **R-C2: Cycle-Consistent Reinforcement Learning Improves Multimodal Reasoning** — Robust perception and reasoning require consistency across sensory modalities. Yet current multimodal models often violate this principle, yielding contradictory predictions for visual and textual representations of the same concept. Rather than masking these failures with standa…
- **Back to Basics: Revisiting ASR in the Age of Voice Agents** — Automatic speech recognition (ASR) systems have achieved near-human accuracy on curated benchmarks, yet still fail in real-world voice agents under conditions that current evaluations do not systematically cover. Without diagnostic tools that isolate specific failure factors, pra…
- **Modernising Reinforcement Learning-Based Navigation for Embodied Semantic Scene Graph Generation** — Semantic world models enable embodied agents to reason about objects, relations, and spatial context beyond purely geometric representations. In Organic Computing, such models are a key enabler for objective-driven self-adaptation under uncertainty and resource constraints. The c…
- **Agentic Trust Coordination for Federated Learning through Adaptive Thresholding and Autonomous Decision Making in Sustainable and Resilient Industrial Networks** — Distributed intelligence in industrial networks increasingly integrates sensing, communication, and computation across heterogeneous and resource constrained devices. Federated learning (FL) enables collaborative model training in such environments, but its reliability is affecte…
- **DAGverse: Building Document-Grounded Semantic DAGs from Scientific Papers** — Directed Acyclic Graphs (DAGs) are widely used to represent structured knowledge in scientific and technical domains. However, datasets for real-world DAGs remain scarce because constructing them typically requires expert interpretation of domain documents. We study Doc2SemDAG co…
- **EcoThink: A Green Adaptive Inference Framework for Sustainable and Accessible Agents** — As the Web transitions from static retrieval to generative interaction, the escalating environmental footprint of Large Language Models (LLMs) presents a critical sustainability challenge. Current paradigms indiscriminately apply computation-intensive strategies like Chain-of-Tho…
- **Trace2Skill: Distill Trajectory-Local Lessons into Transferable Agent Skills** — Equipping Large Language Model (LLM) agents with domain-specific skills is critical for tackling complex tasks. Yet, manual authoring creates a severe scalability bottleneck. Conversely, automated skill generation often yields fragile or fragmented results because it either relie…

### 论文样本（筛选后，最多 20 条）
- **Training the Knowledge Base through Evidence Distillation and Write-Back Enrichment** — The knowledge base in a retrieval-augmented generation (RAG) system is typically assembled once and never revised, even though the facts a query requires are often fragmented across documents and buried in irrelevant content. We argue that the knowledge base should be treated as a trainable componen…
- **Back to Basics: Revisiting ASR in the Age of Voice Agents** — Automatic speech recognition (ASR) systems have achieved near-human accuracy on curated benchmarks, yet still fail in real-world voice agents