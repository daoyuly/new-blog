---
title: Agent Token 优化进阶：生产环境的成本控制实战
date: 2026-07-13 17:00:00
tags:
  - AI Agent
  - Token优化
  - 成本控制
  - LLM
categories:
  - 工程实践
---

# Agent Token 优化进阶：生产环境的成本控制实战

Token 优化不是省钱这么简单。在生产环境里，Token 成本直接影响 Agent 的可用性——单次调用贵了，你就舍不得让 Agent 多跑；上下文长了，延迟就上去；缓存命中率低，同样的问题反复花钱。

这篇聊生产环境里真正管用的 Token 优化手段，从 prompt 压缩到分级推理，都是踩过坑的。

## 先搞清楚钱花在哪

优化之前先量。大多数团队连自己的 Token 消耗分布都不知道，上来就优化，往往优化错地方。

```python
# token_profiler.py
import json
from collections import defaultdict
from datetime import datetime

class TokenProfiler:
    def __init__(self):
        self.calls = []
    
    def record(self, agent: str, model: str, 
               prompt_tokens: int, completion_tokens: int, 
               cached: bool = False):
        self.calls.append({
            "timestamp": datetime.now().isoformat(),
            "agent": agent,
            "model": model,
            "prompt_tokens": prompt_tokens,
            "completion_tokens": completion_tokens,
            "cached": cached,
            "cost": self._estimate_cost(model, prompt_tokens, completion_tokens, cached)
        })
    
    def _estimate_cost(self, model: str, pt: int, ct: int, cached: bool) -> float:
        # GPT-4o 定价 (per 1M tokens)
        prices = {
            "gpt-4o": {"prompt": 2.5, "completion": 10.0, "cached": 1.25},
            "gpt-4o-mini": {"prompt": 0.15, "completion": 0.6, "cached": 0.075},
            "glm-4-flash": {"prompt": 0.1, "completion": 0.1, "cached": 0.0},
        }
        p = prices.get(model, prices["gpt-4o"])
        if cached:
            return pt * p["cached"] / 1_000_000 + ct * p["completion"] / 1_000_000
        return pt * p["prompt"] / 1_000_000 + ct * p["completion"] / 1_000_000
    
    def report(self) -> str:
        by_agent = defaultdict(lambda: {"calls": 0, "prompt": 0, "completion": 0, "cost": 0})
        for c in self.calls:
            a = by_agent[c["agent"]]
            a["calls"] += 1
            a["prompt"] += c["prompt_tokens"]
            a["completion"] += c["completion_tokens"]
            a["cost"] += c["cost"]
        
        lines = ["Token消耗报告", "=" * 50]
        for agent, data in sorted(by_agent.items(), key=lambda x: -x[1]["cost"]):
            lines.append(f"\n{agent}:")
            lines.append(f"  调用次数: {data['calls']}")
            lines.append(f"  Prompt tokens: {data['prompt']:,}")
            lines.append(f"  Completion tokens: {data['completion']:,}")
            lines.append(f"  总成本: ${data['cost']:.2f}")
        
        total_cost = sum(d["cost"] for d in by_agent.values())
        lines.append(f"\n总计: ${total_cost:.2f}")
        return "\n".join(lines)
```

跑一周，你就知道哪个 Agent 吃 Token 最狠。通常 80% 的成本来自 20% 的调用——这些才是优化目标。

## Prompt 压缩：砍掉废话

Agent 的 prompt 里有很多"废话"——重复的系统指令、过长的工具描述、不需要的示例。砍掉这些不影响效果，但能省 30-50% 的 prompt tokens。

### 手动压缩

几个立竿见影的做法：

**1. 工具描述精简。** 大部分 Agent 框架会把所有工具的完整描述塞进 prompt。但一次对话通常只用 2-3 个工具。

```python
# 不要这样：把所有工具描述都放进去
tools = [tool_a, tool_b, tool_c, tool_d, tool_e, tool_f]  # 6个工具 ≈ 2000 tokens

# 这样做：只放相关的
def select_relevant_tools(query: str, all_tools: list, top_k: int = 3) -> list:
    """根据用户意图选最相关的工具"""
    # 简单版：用关键词匹配
    # 生产版：用embedding相似度
    scored = []
    for tool in all_tools:
        score = sum(1 for kw in tool.keywords if kw in query.lower())
        scored.append((tool, score))
    scored.sort(key=lambda x: -x[1])
    return [t for t, _ in scored[:top_k]]

relevant_tools = select_relevant_tools(user_query, tools, top_k=3)  # ≈ 1000 tokens
```

**2. 示例精简。** Few-shot 示例是好东西，但 5 个示例太多了。3 个足够，而且只放和当前任务最相关的。

**3. 系统指令去重。** 如果你在多个地方说了类似的话（比如 system prompt 和 tool description 都强调了"安全"），只保留一处。

### 自动压缩

手动压缩有上限，自动压缩能做得更彻底：

```python
# prompt_compressor.py
import re

def compress_prompt(text: str, max_ratio: float = 0.7) -> str:
    """简单但有效的prompt压缩"""
    # 1. 去掉多余空行
    text = re.sub(r'\n{3,}', '\n\n', text)
    
    # 2. 去掉重复句子
    sentences = text.split('。')
    seen = set()
    unique = []
    for s in sentences:
        s = s.strip()
        if s and s not in seen:
            seen.add(s)
            unique.append(s)
    text = '。'.join(unique)
    
    # 3. 缩写常见短语
    abbreviations = {
        "请注意": "注:",
        "你需要": "需",
        "你应该": "应",
        "确保": "保",
        "不要": "勿",
    }
    for full, abbr in abbreviations.items():
        text = text.replace(full, abbr)
    
    return text
```

更激进的方案可以用 LLM 做压缩——用一个便宜模型把长 prompt 压成短 prompt，再用贵模型处理。两步加起来比直接用贵模型处理长 prompt 便宜。

## 缓存策略：同样的钱不花两次

缓存是 Token 优化的重头戏。OpenAI 从 2024 年开始支持 prompt caching，相同前缀的 prompt 只收半价。

### 1. 固定前缀缓存

把 prompt 分成两部分：不变的（系统指令、工具定义）+ 变化的（用户输入、对话历史）。不变的放前面，这样每次请求都能命中缓存。

```python
# 缓存友好：固定前缀 + 变量后缀
SYSTEM_PREFIX = """你是一个客服Agent。你可以：
1. 查询订单状态
2. 处理退款
3. 转接人工
...（固定内容，约1000 tokens）"""

def build_messages(user_input: str, history: list) -> list:
    # 系统指令放最前面 → 缓存命中
    messages = [{"role": "system", "content": SYSTEM_PREFIX}]
    # 对话历史
    messages.extend(history[-6:])  # 只保留最近3轮
    # 当前输入
    messages.append({"role": "user", "content": user_input})
    return messages
```

### 2. 语义缓存

同样的用户意图，换了个说法，缓存就miss了。语义缓存解决这个问题：

```python
import hashlib
import numpy as np

class SemanticCache:
    def __init__(self, embedding_fn, similarity_threshold: float = 0.92):
        self.cache = {}  # embedding_hash → response
        self.embeddings = {}  # hash → embedding
        self.embedding_fn = embedding_fn
        self.threshold = similarity_threshold
    
    def get(self, query: str) -> str | None:
        q_emb = self.embedding_fn(query)
        
        best_sim = 0
        best_key = None
        for key, emb in self.embeddings.items():
            sim = np.dot(q_emb, emb) / (np.linalg.norm(q_emb) * np.linalg.norm(emb))
            if sim > best_sim:
                best_sim = sim
                best_key = key
        
        if best_sim >= self.threshold and best_key:
            return self.cache[best_key]
        return None
    
    def set(self, query: str, response: str):
        key = hashlib.md5(query.encode()).hexdigest()
        self.cache[key] = response
        self.embeddings[key] = self.embedding_fn(query)
```

语义缓存在客服场景特别有效——"我的快递到哪了"和"物流信息是什么"是同一个问题，缓存命中直接返回，不调 LLM。

### 3. 对话历史压缩

Agent 跑久了，对话历史越来越长，Token 消耗线性增长。解决办法：定期压缩历史。

```python
def compress_history(history: list, llm_client) -> list:
    """用LLM把长对话压缩成摘要，保留关键信息"""
    if len(history) < 10:
        return history
    
    # 最近5轮保留原样
    recent = history[-5:]
    old = history[:-5]
    
    # 把旧对话压缩成摘要
    old_text = "\n".join(
        f"{'User' if m['role']=='user' else 'Agent'}: {m['content']}" 
        for m in old
    )
    
    summary = llm_client.chat.completions.create(
        model="gpt-4o-mini",  # 用便宜模型做压缩
        messages=[
            {"role": "system", "content": "把以下对话压缩成200字以内的摘要，保留关键决策和用户需求。"},
            {"role": "user", "content": old_text}
        ],
        max_tokens=300
    ).choices[0].message.content
    
    return [
        {"role": "system", "content": f"对话摘要：{summary}"}
    ] + recent
```

10 轮对话压缩后，从 ~5000 tokens 降到 ~1500 tokens，后续每轮都能省 3500 tokens。

## 分级推理：该快的快，该省的省

不是每次调用都需要最强模型。分级推理根据任务复杂度选模型：

```python
class TieredRouter:
    def __init__(self):
        self.tiers = {
            "fast": {"model": "gpt-4o-mini", "max_tokens": 200},
            "standard": {"model": "gpt-4o", "max_tokens": 500},
            "heavy": {"model": "gpt-4o", "max_tokens": 2000},
        }
    
    def route(self, query: str, context: dict) -> str:
        # 简单判断：意图分类
        simple_patterns = ["查询", "状态", "是多少", "什么时候", "在哪"]
        medium_patterns = ["分析", "对比", "建议", "怎么选"]
        
        if any(p in query for p in simple_patterns):
            return "fast"
        elif any(p in query for p in medium_patterns):
            return "standard"
        else:
            return "heavy"
    
    def call(self, query: str, context: dict) -> str:
        tier = self.route(query, context)
        config = self.tiers[tier]
        # 调用对应模型...
        return config["model"]
```

实际效果：客服 Agent 大约 70% 的请求可以走 fast tier，成本降到 1/15。

## 一个完整的优化检查清单

| 手段 | 预期节省 | 实施难度 | 优先级 |
|------|---------|---------|--------|
| 工具描述精简 | 20-30% prompt | 低 | P0 |
| 固定前缀缓存 | 50% prompt (缓存命中时) | 低 | P0 |
| 对话历史压缩 | 40-60% prompt (长对话) | 中 | P1 |
| 分级推理 | 60-80% (fast tier) | 中 | P1 |
| 语义缓存 | 10-30% (高频场景) | 中 | P2 |
| Prompt 自动压缩 | 30% prompt | 高 | P2 |

P0 先做，一周就能上。P1 需要一些开发量但回报大。P2 是锦上添花。

## 别为了省 Token 牺牲效果

最后说一句：Token 优化的前提是不影响 Agent 的输出质量。省了 Token 但答案变差了，那是本末倒置。

判断标准：**A/B 测试**。优化前后各跑 100 个相同请求，比较输出质量。如果质量下降超过 5%，这个优化就不值得。

Token 优化是个持续过程。模型在变，定价在变，你的 Agent 也在变。每月看一次 profile 报告，哪里的成本涨了，就优化哪里。

---

**相关阅读：**
- OpenAI Prompt Caching 文档
- LangChain ConversationSummaryMemory
-《Designing Machine Learning Systems》Chapter 9 - Serving ML Systems
