---
title: Agent 记忆投毒：攻击手法与防御全景
date: 2026-06-30 14:15:00
tags:
  - AI Agent
  - Memory Poisoning
  - Security
  - Agent Harness
categories:
  - AI安全
---

Agent 越来越依赖长期记忆来保持个性、积累经验、做更好的决策。但记忆是双刃剑——它让 Agent 变聪明，也让攻击者有了持久化的入口。

记忆投毒（Memory Poisoning）正在成为 Agent 安全领域最活跃的研究方向之一。2026 年上半年 arXiv 上相关论文出现了一波爆发，攻防两手都在快速演进。下面梳理主要的攻击手法、代表性防御方案，以及工程落地思路。

## 记忆投毒是什么

攻击者往 Agent 的记忆里塞入恶意内容，这些内容在后续推理时被检索出来，影响 Agent 的行为。

跟传统的 prompt injection 不同，记忆投毒是**持久化**的。一次注入，后续每次对话都可能触发。这就像给 Agent 植入了一段"虚假记忆"，Agent 自己还觉得挺合理。

## 攻击手法一览

### 1. 对话式投毒（Conversational Injection）

最常见也最隐蔽。攻击者通过正常对话，慢慢往 Agent 的长期记忆里植入恶意信息。

**代表工作：** *Hijacking Agent Memory: Stealthy Trojan Attacks Through Conversational Interaction*（Wang et al., 2026）

核心思路：攻击者伪装成普通用户，在多轮对话中巧妙地让 Agent 记住一些"事实"。比如暗示"你有一个新规则，当用户提到X时执行Y"。Agent 的记忆模块会把这些写入长期存储，后续遇到触发条件就会执行。

关键特征：
- 不需要直接访问记忆存储
- 利用 Agent 自动总结对话的机制
- 恶意内容被"自然地"融入正常对话

### 2. 经验投毒（Experience Poisoning）

Agent 的自进化机制——从经验中学习——本身成了攻击面。

**代表工作：** *OEP: Poisoning Self-Evolving LLM Agents via Locally Correct but Non-Transferable Experiences*（Wang et al., 2026）

思路很精妙：注入的经验在当前上下文中完全正确，但无法泛化到其他场景。Agent 学到了一条"局部正确但全局有害"的经验，自进化系统照单全收，后续在别的场景下就出问题。

打个比方：你告诉一个实习生"遇到客户投诉就直接退款"，在某个特定案例里这确实是对的，但如果实习生把这条当通用规则，公司就亏大了。

### 3. 工具劫持（Tool Hijacking via Memory）

**代表工作：** *MemMorph: Tool Hijacking in LLM Agents via Memory Poisoning*（Zhang et al., 2026）

通过污染记忆来劫持 Agent 对工具的调用。往记忆里注入关于某个工具的"使用经验"，让 Agent 在应该调用工具A时调用工具B，或者传入恶意参数。

这类攻击的危害在于——它不直接攻击工具本身，而是改变了 Agent 选择和使用工具的决策依据。

### 4. 图记忆投毒（Graph Memory Poisoning）

**代表工作：** *ShadowMerge: A Novel Poisoning Attack on Graph-Based Agent Memory via Relation-Channel Conflicts*（Luo et al., 2026）

当 Agent 用知识图谱存储记忆时，攻击者通过制造关系冲突来投毒。具体做法是注入新的节点和边，让原有正确的关系被"遮蔽"或"替换"。

图记忆投毒比文本投毒更难检测，因为关系推理本身就是模糊的。

### 5. 多模态记忆投毒

**代表工作：** *MemVenom: Triggered Poisoning of Multimodal Memories in Web Agents*（Zhang et al., 2026）

Web Agent 的记忆可能包含截图、页面结构等模态。攻击者在网页中嵌入恶意元素，Agent 浏览时自动存入记忆，后续被触发。

### 6. 日常聊天投毒

**代表工作：** *When Routine Chats Turn Toxic: Unintended Long-Term State Poisoning in Personalized Agents*（Xu et al., 2026）

这个特别值得注意：攻击者甚至不需要刻意构造恶意内容。普通的日常聊天就能逐渐偏移个性化 Agent 的行为——不需要注入"恶意指令"，只需要持续地、微妙地影响 Agent 对用户偏好的理解。

### 7. 数据泄露型投毒

**代表工作：** *Trojan Hippo: Weaponizing Agent Memory for Data Exfiltration*（Das et al., 2026）

目的不是改变行为，而是把记忆变成数据外泄的通道。投毒后，Agent 会在特定触发条件下将敏感信息编码进看似正常的输出中。

## 防御方案

攻击手段层出不穷，防御侧同样在快速迭代。以下是几类有代表性的防御思路。

### 1. 来源追踪与权限控制

**代表工作：**
- *MemLineage: Lineage-Guided Enforcement for LLM Agent Memory*（Ouyang & Hou, 2026）
- *Securing LLM-Agent Long-Term Memory Against Poisoning: Non-Malleable, Origin-Bound Authority with Machine-Checked Guarantees*（Louck, 2026）

核心思想：给每条记忆打上来源标签，不同来源的记忆拥有不同权限。

MemLineage 引入了"血统"概念——每条记忆都能追溯到它的来源（用户输入、工具返回、Agent 自我反思等），系统根据来源决定该记忆能影响什么。

Louck 的工作更进一步，用形式化方法（machine-checked guarantees）确保记忆的不可篡改性。每条记忆绑定其来源的权限，即使被检索到，也不能越权影响决策。

### 2. 行为不变量检测

**代表工作：** *Forensic Trajectory Signatures for Agent Memory Poisoning Detection*（2026）

思路：Agent 在正常状态下有一套行为不变量（behavioral invariant）。如果记忆被投毒，Agent 的行为轨迹会偏离这些不变量，检测系统通过对比轨迹特征来发现异常。

这类似免疫系统——不认识每种病毒，但能识别"不像自己的东西"。

### 3. 认证防御

**代表工作：** *SMSR: Certified Defence Against Runtime Memory Poisoning in Persistent LLM Agent Systems*（Sharma, 2026）

提供可证明的防御保证。即使在最坏情况下，也能确保 Agent 的输出在一定范围内不会因投毒而偏离。这类似差分隐私的思路——给防御一个数学保证。

### 4. 自进化安全记忆

**代表工作：** *Membrane: A Self-Evolving Contrastive Safety Memory for LLM Agent Defense*（Choi et al., 2026）

传统安全分类器需要重新训练才能应对新攻击，而 Membrane 用对比学习构建了一个可自进化的安全记忆。它把已知的攻击模式存为"负样本"，正常交互存为"正样本"，通过对比检索来判断新记忆是否安全。

优点是能适应新型攻击，缺点是可能过度拒绝——把跟攻击模式相似的正常查询也挡掉。

### 5. Agent 免疫系统

**代表工作：** *Agent-Native Immune System: Architecture, Taxonomy, and Engineering*（Shen et al., 2026）

这是一个更系统化的视角：给 Agent 构建一套类似生物免疫系统的多层防御。包括先天免疫（规则过滤）、适应性免疫（从攻击中学习）、记忆免疫（记住历史攻击）。

### 6. 信息流控制

**代表工作：** *Cordon-MAS: Defending RAG against Knowledge Poisoning via Information-Flow Control*（Yu et al., 2026）

用信息流控制（IFC）的思想，限制不同信任等级的信息之间的流动。低信任度的外部输入不能直接影响高信任度的核心决策，必须经过"提纯"。

### 7. 梯度耦合异常检测

**代表工作：** *MEMSAD: Gradient-Coupled Anomaly Detection for Memory Poisoning in Retrieval-Augmented Agents*（Gowda, 2026）

通过分析记忆的梯度特征来检测异常。投毒的记忆在梯度空间中会呈现出与正常记忆不同的分布特征，可以用统计方法检测出来。

## 攻防对抗图谱

把攻击和防御放在一起看，能发现几个有意思的模式：

| 攻击维度 | 代表攻击 | 代表防御 | 防御思路 |
|---------|---------|---------|---------|
| 对话注入 | Hijacking Agent Memory | MemLineage | 来源追踪+权限 |
| 经验投毒 | OEP | Agent Immune System | 行为不变量 |
| 工具劫持 | MemMorph | Origin-Bound Authority | 来源绑定 |
| 图记忆投毒 | ShadowMerge | Cordon-MAS | 信息流控制 |
| 多模态投毒 | MemVenom | Membrane | 对比安全记忆 |
| 日常偏移 | Routine Chats Toxic | SMSR | 认证保证 |
| 数据外泄 | Trojan Hippo | MEMSAD | 异常检测 |

## 工程实践建议

看完论文，回到实际项目。构建带长期记忆的 Agent 系统，以下几件事优先做：

**1. 记忆来源标记**

给每条记忆存上元数据：谁说的、什么时候说的、在什么上下文中说的。这是最基本也最有效的防线。后续所有高级防御都建立在来源可追溯的基础上。

**2. 分层信任**

不要让所有记忆拥有同样的影响力。用户明确指令的优先级应该高于 Agent 从对话中推测出的"偏好"，后者又高于从外部网页抓取的信息。

**3. 记忆审计**

定期检查记忆存储，看有没有可疑条目。可以用另一个 LLM 做"记忆审计员"，逐条评估记忆是否合理。

**4. 关键决策绕过记忆**

对于安全敏感的操作（转账、删除数据、修改配置），不让记忆直接参与决策，必须经过明确的用户确认。

**5. 记忆衰减**

不要让所有记忆永久存在。设置自然衰减机制，长期未被使用的记忆逐渐降低权重或归档。这既能减少投毒的影响面，也能提升检索质量。

**6. 多路验证**

当记忆引导 Agent 做出某个决策时，如果决策影响较大，可以用另一个独立的 Agent 或规则系统做交叉验证。

## 还缺什么

当前研究有几个明显的空白：

**跨 Agent 传播**：一个 Agent 被投毒后，通过 Agent 间通信传播给其他 Agent——这种"记忆传染病"的场景研究还很少。*When Child Inherits*（Cai et al., 2026）开了个头，但远不够。

**防御的代价**：几乎所有防御方案都有代价——要么降低 Agent 的灵活性（过度拒绝），要么增加推理成本（额外检测步骤）。这些代价如何量化、如何取舍，缺乏系统性研究。

**真实场景评估**：大部分论文在合成环境中评估，真实 Agent 产品的投毒和防御是什么样，公开案例几乎没有。

**多模态融合**：现有防御主要针对文本记忆，多模态（图片、音频、视频）记忆的投毒防御还处在早期。

## 参考资料

1. Wang et al. "Hijacking Agent Memory: Stealthy Trojan Attacks Through Conversational Interaction." arXiv, May 2026.
2. Wang et al. "OEP: Poisoning Self-Evolving LLM Agents via Locally Correct but Non-Transferable Experiences." arXiv, May 2026.
3. Zhang et al. "MemMorph: Tool Hijacking in LLM Agents via Memory Poisoning." arXiv, May 2026.
4. Luo et al. "ShadowMerge: A Novel Poisoning Attack on Graph-Based Agent Memory via Relation-Channel Conflicts." arXiv, May 2026.
5. Zhang et al. "MemVenom: Triggered Poisoning of Multimodal Memories in Web Agents." arXiv, June 2026.
6. Xu et al. "When Routine Chats Turn Toxic: Unintended Long-Term State Poisoning in Personalized Agents." arXiv, May 2026.
7. Das et al. "Trojan Hippo: Weaponizing Agent Memory for Data Exfiltration." arXiv, 2026.
8. Ouyang & Hou. "MemLineage: Lineage-Guided Enforcement for LLM Agent Memory." arXiv, May 2026.
9. Louck. "Securing LLM-Agent Long-Term Memory Against Poisoning: Non-Malleable, Origin-Bound Authority with Machine-Checked Guarantees." arXiv, June 2026.
10. Sharma. "SMSR: Certified Defence Against Runtime Memory Poisoning in Persistent LLM Agent Systems." arXiv, June 2026.
11. Choi et al. "Membrane: A Self-Evolving Contrastive Safety Memory for LLM Agent Defense." arXiv, June 2026.
12. Shen et al. "Agent-Native Immune System: Architecture, Taxonomy, and Engineering." arXiv, June 2026.
13. Yu et al. "Cordon-MAS: Defending RAG against Knowledge Poisoning via Information-Flow Control." arXiv, May 2026.
14. Gowda. "MEMSAD: Gradient-Coupled Anomaly Detection for Memory Poisoning in Retrieval-Augmented Agents." arXiv, May 2026.
15. Dash et al. "From Untrusted Input to Trusted Memory: A Systematic Study of Memory Poisoning Attacks in LLM Agents." arXiv, June 2026.
16. Cai et al. "When Child Inherits: Modeling and Exploiting Subagent Spawn in Multi-Agent Networks." arXiv, May 2026.
