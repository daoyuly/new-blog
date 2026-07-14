---
title: 当 Loop 遇到 AI：用 LLM 做闭环决策层
tags:
  - Loop Engineering
  - LLM
  - 工程闭环
  - 混合决策
categories:
  - 工程实践
abbrlink: 19334
date: 2026-07-13 16:30:00
---

# 当 Loop 遇到 AI：用 LLM 做闭环决策层

前两篇聊的闭环，决策层都是硬编码规则——错误率超 50% 就降级，burn rate 超 14 倍就告警。规则的好处是确定性，坏处是死板。生产环境的故障千奇百怪，规则永远覆盖不全。

那能不能让 LLM 来做决策？能，但不是让 LLM 替代规则，而是让 LLM 和规则搭档。

## 规则的边界

硬编码规则处理不了的场景：

**1. 多信号冲突。** CPU 高但错误率正常，该不该降级？规则说不该，但也许 CPU 高是因为某个慢查询在堆积，马上就要爆。规则看不到这种"即将爆"的信号。

**2. 未知故障模式。** 你只能为已知的故障写规则。新的故障模式出现时，规则是瞎的。

**3. 上下文依赖。** 大促期间 5% 错误率可能正常，平时 5% 就是灾难。规则可以加时间条件，但条件组合爆炸后比没有规则还难维护。

这些场景有一个共同点：需要**理解上下文**，而不仅仅是比较数值。LLM 擅长这个。

## 混合决策架构

核心思路：**规则处理确定性逻辑，LLM 处理模糊判断，LLM 的输出必须经过规则校验。**

```
        [指标数据]
            │
     ┌──────┴──────┐
     ▼              ▼
 [规则引擎]     [LLM判断]
  (快速路径)    (慢速路径)
     │              │
     ▼              ▼
  确定性决策    模糊判断结果
     │              │
     └──────┬──────┘
            ▼
      [安全校验层]
            │
            ▼
        [执行动作]
```

规则引擎走快速路径——毫秒级响应，处理明确的情况。LLM 走慢速路径——秒级响应，处理规则覆盖不了的情况。最后都过安全校验，防止 LLM 产出危险操作。

## 实现

### 规则引擎（快速路径）

```python
# rule_engine.py
from dataclasses import dataclass
from typing import Optional

@dataclass
class Decision:
    action: str          # "degrade" | "recover" | "escalate" | "noop"
    confidence: float    # 0.0 - 1.0
    source: str          # "rule" | "llm"
    reason: str

class RuleEngine:
    def decide(self, metrics: dict) -> Decision:
        error_rate = metrics.get("error_rate", 0)
        p99 = metrics.get("p99_latency_ms", 0)
        cpu = metrics.get("cpu_usage", 0)
        
        # 确定性规则：高置信度，直接走
        if error_rate > 0.8:
            return Decision("degrade", 0.95, "rule", f"错误率{error_rate:.0%}>80%")
        
        if error_rate < 0.01 and cpu < 0.5:
            return Decision("recover", 0.9, "rule", "指标正常，可恢复")
        
        # 规则覆盖不了 → 交给 LLM
        if 0.1 < error_rate < 0.8 and cpu > 0.7:
            return Decision("escalate", 0.0, "rule", "多信号冲突，需LLM判断")
        
        return Decision("noop", 0.8, "rule", "指标正常")
```

### LLM 决策（慢速路径）

```python
# llm_decision.py
import json
from rule_engine import Decision

SYSTEM_PROMPT = """你是一个SRE决策助手。根据系统指标决定是否需要执行运维动作。

可用动作：
- degrade: 摘除故障节点
- throttle: 限流
- recover: 恢复节点
- noop: 不动作

你必须返回JSON格式：
{"action": "动作名", "reason": "简短原因", "confidence": 0.0-1.0}

安全规则：
- 永远不要同时降级超过50%的节点
- 如果数据不足以判断，返回noop
- 宁可误报也不要误操作"""

class LLMDecider:
    def __init__(self, client):
        self.client = client  # OpenAI-compatible client
    
    def decide(self, metrics: dict, context: str = "") -> Decision:
        user_msg = f"当前系统指标：\n{json.dumps(metrics, indent=2)}"
        if context:
            user_msg += f"\n\n上下文：{context}"
        
        resp = self.client.chat.completions.create(
            model="glm-4-flash",  # 用快模型，不需要重推理
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": user_msg}
            ],
            temperature=0.1,  # 低温度，要确定性
            max_tokens=200,
        )
        
        try:
            result = json.loads(resp.choices[0].message.content)
            return Decision(
                action=result["action"],
                confidence=result.get("confidence", 0.5),
                source="llm",
                reason=result.get("reason", "")
            )
        except (json.JSONDecodeError, KeyError):
            return Decision("noop", 0.0, "llm", "LLM输出解析失败，默认noop")
```

### 安全校验层

LLM 可能输出任何东西，包括危险操作。校验层是最后防线：

```python
# safety_guard.py
from rule_engine import Decision

MAX_DEGRADE_RATIO = 0.5  # 最多降级50%节点
ALLOWED_ACTIONS = {"degrade", "throttle", "recover", "noop"}
RATE_LIMIT_SECONDS = 60  # 同一动作60秒内只能执行一次

class SafetyGuard:
    def __init__(self):
        self.last_action_time = {}
        self.degraded_nodes = set()
        self.total_nodes = 10
    
    def validate(self, decision: Decision) -> Decision:
        # 1. 动作白名单
        if decision.action not in ALLOWED_ACTIONS:
            return Decision("noop", 0.0, "guard", f"非法动作: {decision.action}")
        
        # 2. 降级数量限制
        if decision.action == "degrade":
            if len(self.degraded_nodes) / self.total_nodes >= MAX_DEGRADE_RATIO:
                return Decision("noop", 0.0, "guard", "降级比例已达上限")
            # LLM低置信度的降级需要人工确认
            if decision.source == "llm" and decision.confidence < 0.7:
                return Decision("escalate", decision.confidence, "guard", 
                              f"LLM低置信度({decision.confidence})降级，需人工确认")
        
        # 3. 频率限制
        import time
        now = time.time()
        last = self.last_action_time.get(decision.action, 0)
        if now - last < RATE_LIMIT_SECONDS:
            return Decision("noop", 0.0, "guard", "动作频率限制")
        
        self.last_action_time[decision.action] = now
        return decision
```

### 串起来

```python
# hybrid_loop.py
from rule_engine import RuleEngine
from llm_decision import LLMDecider
from safety_guard import SafetyGuard

class HybridLoop:
    def __init__(self, llm_client):
        self.rules = RuleEngine()
        self.llm = LLMDecider(llm_client)
        self.guard = SafetyGuard()
    
    def decide(self, metrics: dict, context: str = "") -> Decision:
        # 第一步：规则快速路径
        rule_decision = self.rules.decide(metrics)
        
        if rule_decision.action != "escalate":
            # 规则能处理，直接走
            return self.guard.validate(rule_decision)
        
        # 第二步：规则处理不了，交给LLM
        llm_decision = self.llm.decide(metrics, context)
        
        # 第三步：安全校验
        return self.guard.validate(llm_decision)
```

## Prompt as Rule：用 prompt 补充规则

硬编码规则的维护成本高，每次加规则要改代码、发版。另一种做法是把规则写成 prompt：

```
## 降级规则
- 错误率 > 80%：立即降级
- 错误率 > 30% 且 CPU > 90%：降级
- 错误率 > 30% 但 CPU < 50%：限流（可能是下游问题，降级没用）
- 大促期间（每月1号、11号、双11）：错误率阈值翻倍
- 新上线服务（3天内）：错误率阈值减半
```

这些规则用代码写要一堆 if-else，用 prompt 写一目了然。LLM 天然能理解这种自然语言规则。

但要注意：**prompt 规则不能替代安全校验层。** prompt 可以被 LLM 误解、忽略，代码级的安全校验不能省。

## 降级策略：LLM 挂了怎么办

LLM 是外部依赖，它自己也会挂。闭环依赖 LLM 做决策，那 LLM 挂了闭环也挂了——这不行。

降级策略：

```python
def decide_with_fallback(metrics: dict) -> Decision:
    try:
        # 尝试 LLM 决策（超时3秒）
        decision = llm.decide(metrics, timeout=3)
    except (TimeoutError, ConnectionError):
        # LLM 挂了，回退到纯规则模式
        decision = rules.decide(metrics)
        decision.reason += " (LLM不可用，回退规则模式)"
    
    return guard.validate(decision)
```

核心原则：**LLM 是锦上添花，不是生死攸关。** 没有 LLM，规则引擎也能跑，只是覆盖不了模糊场景。不能让 LLM 成为单点故障。

## 成本控制

LLM 调用不是免费的。每秒调一次 GPT-4，一个月下来账单好看不了。

控制成本的几个做法：

1. **只在规则 escalate 时才调 LLM**。大部分请求规则就能处理，LLM 只处理少数模糊场景。实际生产中大概 5-10% 的决策需要 LLM。

2. **用快模型**。决策不需要 GPT-4 级别的推理，用 GPT-4o-mini 或 GLM-4-Flash 就够。响应快，便宜。

3. **缓存相似决策**。同样的指标组合，LLM 的判断大概率一样。用指标特征的哈希做缓存 key：

```python
import hashlib, json

def metrics_hash(metrics: dict) -> str:
    # 离散化指标，避免微小差异导致缓存失效
    discrete = {
        "error_rate": round(metrics["error_rate"], 2),
        "cpu": round(metrics["cpu_usage"], 1),
        "p99": round(metrics["p99_latency_ms"] / 100) * 100,  # 百ms粒度
    }
    return hashlib.md5(json.dumps(discrete, sort_keys=True).encode()).hexdigest()
```

4. **设置每日调用上限**。超了就回退纯规则模式。

## 什么时候适合用 LLM 做决策

不是所有闭环都需要 LLM。适合的场景：

- 多指标联合判断，规则写不全
- 有时间/业务上下文（大促、新版本上线、故障恢复中）
- 故障模式多样化，没法穷举规则

不适合的场景：

- 单指标阈值判断（规则就够了）
- 对延迟极度敏感（LLM 再快也要几百ms）
- 动作不可逆（LLM 可能误判，不可逆操作要人确认）

简单说：**规则是主力，LLM 是替补。** 替补上场时，安全校验必须在线。

---

**相关阅读：**
- Google SRE Book Chapter 6 - Handling Overload
- Amazon Build On - "Using ML for automated remediation"
-《Designing Data-Intensive Applications》第12章（数据系统的可靠性）
