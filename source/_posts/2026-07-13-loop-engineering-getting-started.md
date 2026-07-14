---
title: Loop Engineering 落地手册：从零搭建第一个工程闭环
tags:
  - Loop Engineering
  - 工程闭环
  - SRE
  - DevOps
categories:
  - 工程实践
abbrlink: 38209
date: 2026-07-13 15:00:00
---

# Loop Engineering 落地手册：从零搭建第一个工程闭环

搞工程闭环（Loop Engineering）的人很多，但真把闭环转起来的少。大部分团队的"闭环"就是加个监控面板，配个告警，完事。这不叫闭环，这叫"有监控"。

闭环的核心是**反馈驱动自动决策**——系统不仅告诉你出了问题，还能自己决定怎么处理，处理完了还能验证结果。本文从最小闭环开始，手把手搭一个。

## 什么是工程闭环

简单讲，工程闭环就是四个字：**感知→决策→执行→验证**。

```
[指标采集] → [规则/判断] → [自动动作] → [效果确认]
     ↑                                        |
     └──────────── 反馈回路 ───────────────────┘
```

没有最后那步"验证"，就不知道动作有没有用，下一次决策就没依据。这就是开环和闭环的区别。

## 最小闭环：一个 HTTP 错误率的自动降级

目标：当 API 错误率超过阈值，自动切掉坏节点，切完确认错误率回落。

### 第一步：感知——采集指标

用 Prometheus + node exporter 是最常见的组合。但最小闭环不需要这么重，一个定时脚本就行：

```python
# health_check.py
import requests
import json
import time
from datetime import datetime

ENDPOINT = "https://api.example.com/health"
METRICS_FILE = "/var/run/service-metrics.json"

def collect():
    """采集健康状态，写入本地指标文件"""
    try:
        resp = requests.get(ENDPOINT, timeout=5)
        metrics = {
            "timestamp": datetime.now().isoformat(),
            "status_code": resp.status_code,
            "latency_ms": resp.elapsed.total_seconds() * 1000,
            "healthy": resp.status_code == 200
        }
    except requests.RequestException as e:
        metrics = {
            "timestamp": datetime.now().isoformat(),
            "status_code": 0,
            "latency_ms": -1,
            "healthy": False,
            "error": str(e)
        }
    
    with open(METRICS_FILE, "w") as f:
        json.dump(metrics, f)
    
    return metrics

if __name__ == "__main__":
    metrics = collect()
    if not metrics["healthy"]:
        print(f"[WARN] Service unhealthy: {json.dumps(metrics)}")
```

每 10 秒跑一次（crontab 或 systemd timer），指标写本地文件。够了。

### 第二步：决策——判断要不要动作

```python
# decision.py
import json
import time
from collections import deque

ERROR_RATE_WINDOW = 12  # 最近12次采样（约2分钟）
ERROR_THRESHOLD = 0.5   # 50%失败率触发降级

class ErrorRateTracker:
    def __init__(self, window_size=ERROR_RATE_WINDOW):
        self.window = deque(maxlen=window_size)
    
    def record(self, healthy: bool):
        self.window.append(1 if healthy else 0)
    
    def error_rate(self) -> float:
        if not self.window:
            return 0.0
        return 1.0 - sum(self.window) / len(self.window)
    
    def should_degrade(self) -> bool:
        """连续窗口内错误率超阈值，触发降级"""
        if len(self.window) < self.window.maxlen // 2:
            return False  # 数据不够，不动作
        return self.error_rate() >= ERROR_THRESHOLD

# 全局tracker，实际部署用Redis或文件持久化
tracker = ErrorRateTracker()

def decide(metrics: dict) -> str:
    """返回决策: 'degrade' | 'recover' | 'noop'"""
    tracker.record(metrics["healthy"])
    
    if tracker.should_degrade():
        return "degrade"
    elif tracker.error_rate() < ERROR_THRESHOLD * 0.5 and len(tracker.window) >= 6:
        # 错误率降到阈值一半以下，考虑恢复
        return "recover"
    return "noop"
```

关键点：**不是一次失败就动作**。用滑动窗口看趋势，避免毛刺触发误操作。恢复也有门槛——错误率降到阈值一半才放回来，防止反复横跳。

### 第三步：执行——自动降级

```python
# action.py
import subprocess
import json
from datetime import datetime

ACTION_LOG = "/var/run/degrade-actions.jsonl"

def degrade(node_id: str):
    """从负载均衡摘除节点"""
    # 假设用nginx做负载均衡
    subprocess.run([
        "nginx", "-s", "reload"  # 实际是修改upstream配置后reload
    ], check=True)
    
    _log_action("degrade", node_id, "removed from upstream")

def recover(node_id: str):
    """恢复节点到负载均衡"""
    subprocess.run([
        "nginx", "-s", "reload"
    ], check=True)
    
    _log_action("recover", node_id, "added back to upstream")

def _log_action(action_type: str, node_id: str, detail: str):
    with open(ACTION_LOG, "a") as f:
        f.write(json.dumps({
            "timestamp": datetime.now().isoformat(),
            "action": action_type,
            "node": node_id,
            "detail": detail
        }) + "\n")
```

执行动作要记日志。没有日志的自动动作是定时炸弹。

### 第四步：验证——确认动作生效

这是最容易被忽略的一步。降级完了，得确认错误率真的降下来了：

```python
# verify.py
import json
import time
from decision import ErrorRateTracker

VERIFICATION_DELAY = 30  # 降级后等30秒再验证
VERIFICATION_SAMPLES = 6  # 看6次采样

def verify_degrade(tracker: ErrorRateTracker) -> bool:
    """降级后验证错误率是否回落"""
    time.sleep(VERIFICATION_DELAY)
    
    healthy_count = 0
    for _ in range(VERIFICATION_SAMPLES):
        # 重新采集（调用 health_check.py 的 collect）
        from health_check import collect
        metrics = collect()
        tracker.record(metrics["healthy"])
        if metrics["healthy"]:
            healthy_count += 1
        time.sleep(10)
    
    success_rate = healthy_count / VERIFICATION_SAMPLES
    if success_rate >= 0.8:
        print(f"[OK] 降级成功，健康率 {success_rate:.0%}")
        return True
    else:
        print(f"[ALERT] 降级后仍异常，健康率 {success_rate:.0%}，需要人工介入")
        return False
```

验证失败就报警，不自动往上加操作。自动化的边界在这里——**能自己处理的自己处理，处理不了的及时喊人**。

### 跑起来

把四步串成主循环：

```python
# main_loop.py
import time
import json
from health_check import collect
from decision import decide, tracker
from action import degrade, recover
from verify import verify_degrade

NODE_ID = "node-1"
CHECK_INTERVAL = 10  # 秒

degraded = False

while True:
    metrics = collect()
    decision = decide(metrics)
    
    if decision == "degrade" and not degraded:
        print(f"[ACTION] 降级 {NODE_ID}")
        degrade(NODE_ID)
        degraded = True
        verify_degrade(tracker)
    
    elif decision == "recover" and degraded:
        print(f"[ACTION] 恢复 {NODE_ID}")
        recover(NODE_ID)
        degraded = False
    
    time.sleep(CHECK_INTERVAL)
```

这就是一个完整的闭环。200 行代码，能跑。

## CI 门禁：另一个最小闭环

除了运行时闭环，CI 里也能搭闭环。思路一样：感知→决策→执行→验证。

```yaml
# .github/workflows/quality-gate.yml
name: Quality Gate
on: [pull_request]

jobs:
  gate:
    runs-on: ubuntu-latest
    steps:
      # 感知：跑测试+覆盖率
      - uses: actions/checkout@v4
      - run: npm ci && npm test -- --coverage
      
      # 决策：覆盖率低于80%就拦
      - name: Check coverage
        run: |
          COVERAGE=$(cat coverage/coverage-summary.json | jq '.total.lines.pct')
          if (( $(echo "$COVERAGE < 80" | bc -l) )); then
            echo "Coverage ${COVERAGE}% below threshold 80%"
            exit 1
          fi
      
      # 执行+验证：门禁通过说明代码质量达标
      - name: Gate passed
        run: echo "Quality gate passed ✓"
```

CI 门禁是最容易落地的闭环形式，因为"验证"天然就有——合并后 CI 绿了就是验证通过。

## Error Budget：闭环的节奏控制器

没有预算的自动化要么太激进（一点风吹草动就降级），要么太保守（系统都快挂了还不动作）。Error Budget 就是给闭环加个预算：

```
Error Budget = 1 - SLO

例：SLO = 99.9% → Error Budget = 0.1%/月
月内错误率用完预算 → 停止发布，全力修稳定性
预算有富余 → 可以放心发版
```

```python
# error_budget.py
import datetime

SLO = 0.999  # 99.9%
BUDGET_PERIOD_DAYS = 30

class ErrorBudget:
    def __init__(self, slo: float = SLO):
        self.slo = slo
        self.period_start = None
        self.total_minutes = 0
        self.error_minutes = 0
    
    def record(self, healthy: bool):
        if self.period_start is None:
            self.period_start = datetime.date.today()
        
        self.total_minutes += 1
        if not healthy:
            self.error_minutes += 1
    
    def remaining(self) -> float:
        """剩余预算百分比"""
        budget = 1.0 - self.slo
        used = self.error_minutes / max(self.total_minutes, 1)
        return max(0, budget - used) / budget
    
    def exhausted(self) -> bool:
        """预算耗尽"""
        return self.remaining() <= 0
    
    def burn_rate(self) -> float:
        """消耗速率（相对正常速率的倍数）"""
        if self.total_minutes == 0:
            return 0
        actual_error_rate = self.error_minutes / self.total_minutes
        budget_rate = 1.0 - self.slo
        return actual_error_rate / budget_rate if budget_rate > 0 else 0

# 闭环决策加入预算考量
def decide_with_budget(metrics: dict, budget: ErrorBudget) -> str:
    if budget.exhausted():
        return "freeze_deploys"  # 预算耗尽，冻结发布
    
    burn = budget.burn_rate()
    if burn > 14:   # 1小时内耗尽预算的速率
        return "degrade"     # 立即降级
    elif burn > 6:  # 6小时内耗尽
        return "alert"       # 告警但不自动动作
    else:
        return "noop"
```

Error Budget 让闭环有了"经济性"——不是所有错误都值得自动处理，只有预算在快速消耗时才动作。

## 几个落地避坑点

**1. 别一上来搞大闭环**

先搞定一个最小闭环（比如上面的错误率降级），跑稳了再加第二个。多闭环的协调比单闭环复杂一个量级。

**2. 自动动作必须有回滚路径**

每次自动降级/熔断/限流，都要有对应的恢复操作，而且恢复操作要自动化。只管杀不管埋的自动化比手动操作还危险。

**3. 阈值不是写死的**

代码里的 `ERROR_THRESHOLD = 0.5` 是示例，实际部署要从历史数据算。一个简单方法：取过去 7 天 P99 错误率的 2 倍作为阈值。

**4. 日志是闭环的生命线**

每个环节都要有结构化日志。出了问题回头看，没有日志就是黑箱。推荐用 JSON 格式写日志，方便后续用 jq 或 ELK 查。

**5. 闭环要有开关**

生产环境必须能一键关闭自动动作，降级为"只告警不动作"模式。新上的闭环先跑观察模式一周，确认无误再开自动。

## 下一步

这篇文章搭了一个最小闭环。但实际工程中闭环转不起来的原因，往往不是技术问题——是组织问题、指标问题、信任问题。下一篇聊 Loop Engineering 的反模式，说说为什么你的闭环转不起来。

---

**相关阅读：**
- Google SRE Book Chapter 3 - Embracing Risk
-《SRE：Google运维解密》中文版第3章
- Netflix Hystrix 设计思想（熔断器模式）
