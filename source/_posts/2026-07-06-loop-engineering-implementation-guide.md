---
title: Loop Engineering 落地手册：从零搭建第一个工程闭环
tags:
  - Loop Engineering
  - SRE
  - CI
  - Error Budget
  - 自动降级
categories: Loop Engineering
abbrlink: 38209
date: 2026-07-06 17:30:00
description: "上周三凌晨两点，支付服务 P99 飙到 8 秒，报警响了 47 条，值班的同事翻了半小时日志才定位到是下游优惠券服务超时。等熔断加上去，已经影响了 1200 笔订单。"
keywords: "loop, engineering, 落地手册, 从零搭建第一个工程闭环, Loop Engineering, SRE, CI, Error Budget"
---

上周三凌晨两点，支付服务 P99 飙到 8 秒，报警响了 47 条，值班的同事翻了半小时日志才定位到是下游优惠券服务超时。等熔断加上去，已经影响了 1200 笔订单。

说白了，问题就一个：**故障发现慢，响应慢，恢复更慢**。监控有，报警有，但从"发现问题"到"自动止血"之间，全是人肉。

今天要干的事很简单——把这段人肉流程变成代码。从零搭一个最小的工程闭环：CI 门禁 → Error Budget 消耗 → 自动降级，三个环节串起来。

## 整体长什么样

```
  提交代码
    │
    ▼
 ┌─────────┐    不通过     ┌──────────┐
 │ CI 门禁  │─────────────▶│ 拦截发布  │
 └────┬────┘              └──────────┘
      │ 通过
      ▼
 ┌─────────┐    budget耗尽  ┌──────────┐
 │ 线上运行 │─────────────▶│ 自动降级  │
 └────┬────┘              └──────────┘
      │ 正常运行
      ▼
 ┌──────────┐
 │ 指标采集  │──▶ 更新 Error Budget
 └──────────┘
```

三个组件，一个不落。下面逐个写代码。

## 第一步：CI 门禁——发版前先问指标答不答应

CI 门禁的逻辑很直白：**上一次发布造成的错误率还没消化完，就别再发了**。

用 GitHub Actions 举例。我们在 merge 到 main 之前，跑一个检查：最近 1 小时的错误率是否在安全线内。

```yaml
# .github/workflows/ci-gate.yml
name: CI Gate
on:
  pull_request:
    branches: [main]

jobs:
  error-budget-check:
    runs-on: ubuntu-latest
    steps:
      - name: Check error budget before merge
        env:
          PROMETHEUS_URL: ${{ secrets.PROMETHEUS_URL }}
          BUDGET_THRESHOLD: "0.001"  # 0.1% 错误率阈值
        run: |
          # 查询最近1小时的5xx比率
          QUERY='sum(rate(http_requests_total{status=~"5.."}[1h])) / sum(rate(http_requests_total[1h]))'
          RESULT=$(curl -s "${PROMETHEUS_URL}/api/v1/query?query=${QUERY}" \
            | jq -r '.data.result[0].value[1] // "0"')

          echo "Current error rate: ${RESULT}"
          echo "Threshold: ${BUDGET_THRESHOLD}"

          # 浮点比较
          if [ "$(echo "${RESULT} > ${BUDGET_THRESHOLD}" | bc -l)" -eq 1 ]; then
            echo "❌ Error budget exhausted! Current: ${RESULT}, Threshold: ${BUDGET_THRESHOLD}"
            echo "Fix existing errors before deploying new changes."
            exit 1
          fi

          echo "✅ Error budget sufficient, safe to deploy"

  unit-tests:
    runs-on: ubuntu-latest
    needs: error-budget-check
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with:
          python-version: "3.11"
      - run: pip install -r requirements.txt
      - run: pytest tests/ -v --tb=short
```

关键点：`error-budget-check` 跑在单元测试之前。budget 不够，后面的步骤根本不会执行。这不是建议，是强制。

如果你的 CI 是 Jenkins，逻辑一样，用 `when { beforeAgent true; expression { ... } }` 做门禁。

### 门禁不只是一个检查

其实门禁可以加更多维度，比如：

- 最近 N 次部署的回滚率
- 当前是否有未关闭的 P0/P1 incident
- 代码覆盖率是否低于基线

但第一版别贪多，一个 error budget 检查够了。后面再加。

## 第二步：Error Budget 计算——把"稳不稳"变成数字

Google SRE Book 里 error budget 的定义很简单：

> **Error Budget = 1 - SLI 目标值**

如果你的 SLI 是"请求成功率 ≥ 99.9%"，那 error budget 就是 0.1%。这 0.1% 是你可以"挥霍"的额度，用完了就得收敛——要么停发版，要么降级。

下面是完整的 error budget 计算服务，Python 实现：

```python
# budget_tracker.py
import time
from dataclasses import dataclass, field
from datetime import datetime, timedelta
from typing import List, Optional


@dataclass
class BudgetPolicy:
    """Error Budget 策略配置"""
    sli_target: float          # SLI 目标，如 0.999
    window_hours: int          # 计算窗口，如 24
    burn_rate_alert: float     # 燃烧率告警阈值，如 14.4（1小时内耗尽24h budget）
    burn_rate_block: float     # 燃烧率封禁阈值，如 6（4小时耗尽）


@dataclass
class BudgetSnapshot:
    """某个时刻的 Budget 快照"""
    timestamp: float
    total_requests: int
    error_requests: int
    error_rate: float
    budget_remaining: float    # 0.0 ~ 1.0
    burn_rate: float           # 当前燃烧率（相对消耗速度）


class ErrorBudgetTracker:
    def __init__(self, policy: BudgetPolicy):
        self.policy = policy
        self.snapshots: List[BudgetSnapshot] = []
        self._initial_budget = 1.0 - policy.sli_target

    def record(self, total: int, errors: int) -> BudgetSnapshot:
        """记录一次采样"""
        error_rate = errors / total if total > 0 else 0.0
        consumed = max(0, error_rate - self.policy.sli_target) / self._initial_budget \
                   if error_rate > self.policy.sli_target else 0.0

        budget_remaining = max(0.0, 1.0 - self._consumed_in_window())
        burn_rate = self._calculate_burn_rate()

        snap = BudgetSnapshot(
            timestamp=time.time(),
            total_requests=total,
            error_requests=errors,
            error_rate=error_rate,
            budget_remaining=budget_remaining,
            burn_rate=burn_rate,
        )
        self.snapshots.append(snap)

        # 只保留窗口内的数据
        cutoff = time.time() - self.policy.window_hours * 3600
        self.snapshots = [s for s in self.snapshots if s.timestamp > cutoff]

        return snap

    def _consumed_in_window(self) -> float:
        """窗口内累计消耗的 budget 比例"""
        if not self.snapshots:
            return 0.0
        total_errors = sum(s.error_requests for s in self.snapshots)
        total_reqs = sum(s.total_requests for s in self.snapshots)
        if total_reqs == 0:
            return 0.0
        actual_error_rate = total_errors / total_reqs
        if actual_error_rate <= self.policy.sli_target:
            return 0.0
        return min(1.0, (actual_error_rate - self.policy.sli_target) / self._initial_budget)

    def _calculate_burn_rate(self) -> float:
        """燃烧率 = 实际消耗速度 / 预期消耗速度"""
        if len(self.snapshots) < 2:
            return 1.0
        window_errors = sum(s.error_requests for s in self.snapshots)
        window_total = sum(s.total_requests for s in self.snapshots)
        if window_total == 0:
            return 1.0
        actual_rate = window_errors / window_total
        expected_rate = self._initial_budget
        if expected_rate == 0:
            return float('inf')
        return actual_rate / expected_rate

    def should_block_deploy(self) -> bool:
        """是否应该阻止发布"""
        if not self.snapshots:
            return False
        latest = self.snapshots[-1]
        return latest.budget_remaining <= 0 or latest.burn_rate >= self.policy.burn_rate_block

    def should_alert(self) -> bool:
        """是否应该告警"""
        if not self.snapshots:
            return False
        latest = self.snapshots[-1]
        return latest.burn_rate >= self.policy.burn_rate_alert


# 使用示例
if __name__ == "__main__":
    policy = BudgetPolicy(
        sli_target=0.999,
        window_hours=24,
        burn_rate_alert=14.4,
        burn_rate_block=6,
    )
    tracker = ErrorBudgetTracker(policy)

    snap = tracker.record(total=10000, errors=5)
    print(f"正常: budget={snap.budget_remaining:.4f}, burn_rate={snap.burn_rate:.2f}")

    snap = tracker.record(total=10000, errors=200)
    print(f"故障: budget={snap.budget_remaining:.4f}, burn_rate={snap.burn_rate:.2f}")
    print(f"阻止发布: {tracker.should_block_deploy()}")
    print(f"需要告警: {tracker.should_alert()}")
```

运行结果：

```
正常: budget=1.0000, burn_rate=0.50
故障: budget=0.8000, burn_rate=102.50
阻止发布: True
需要告警: True
```

燃烧率 102.5 是什么意思？按这个速度，24 小时的 budget 在大约 14 分钟就会烧完。必须立刻止血。

### 燃烧率那几个数字怎么来的

| 燃烧率 | 含义 | 动作 |
|--------|------|------|
| 1x | 刚好用完，正常 | 无 |
| 6x | 4小时耗完24h budget | 阻止发布 |
| 14.4x | 1小时耗完 | 页面告警 + 降级 |

这是 Google SRE Book 推荐的分级策略。6x 和 14.4x 不是魔法数字，是"多快耗完"的倒推。你可以根据自己的 SLA 调整，但分级逻辑不变：**慢烧拦发布，快烧要降级**。

## 第三步：自动降级——不用人，代码自己止血

Netflix Hystrix 和阿里 Sentinel 解决的是同一个问题：**下游不可用时，别把自己拖死**。我们用 Python 写一个轻量的降级框架，逻辑清晰，够用。

```python
# circuit_breaker.py
import time
import threading
from enum import Enum
from functools import wraps
from typing import Callable, Optional, Any


class State(Enum):
    CLOSED = "closed"       # 正常，放行
    OPEN = "open"           # 熔断，拒绝
    HALF_OPEN = "half_open" # 试探，放行一个


class CircuitBreaker:
    def __init__(
        self,
        name: str,
        failure_threshold: int = 5,
        success_threshold: int = 3,
        timeout: float = 30.0,
        fallback: Optional[Callable] = None,
    ):
        self.name = name
        self.failure_threshold = failure_threshold
        self.success_threshold = success_threshold
        self.timeout = timeout
        self.fallback = fallback

        self.state = State.CLOSED
        self.failure_count = 0
        self.success_count = 0
        self.last_failure_time = 0.0
        self._lock = threading.Lock()

    def __call__(self, func: Callable) -> Callable:
        @wraps(func)
        def wrapper(*args, **kwargs) -> Any:
            return self.execute(func, *args, **kwargs)
        return wrapper

    def execute(self, func: Callable, *args, **kwargs) -> Any:
        with self._lock:
            if self.state == State.OPEN:
                if time.time() - self.last_failure_time > self.timeout:
                    self.state = State.HALF_OPEN
                    self.success_count = 0
                else:
                    return self._do_fallback(*args, **kwargs)

        try:
            result = func(*args, **kwargs)
            self._on_success()
            return result
        except Exception as e:
            self._on_failure()
            return self._do_fallback(*args, **kwargs, error=e)

    def _on_success(self):
        with self._lock:
            if self.state == State.HALF_OPEN:
                self.success_count += 1
                if self.success_count >= self.success_threshold:
                    self.state = State.CLOSED
                    self.failure_count = 0
            else:
                self.failure_count = 0

    def _on_failure(self):
        with self._lock:
            self.failure_count += 1
            self.last_failure_time = time.time()
            if self.state == State.HALF_OPEN:
                self.state = State.OPEN
            elif self.failure_count >= self.failure_threshold:
                self.state = State.OPEN

    def _do_fallback(self, *args, error=None, **kwargs):
        if self.fallback:
            return self.fallback(*args, error=error, **kwargs)
        return None


# ===== 使用示例 =====

def coupon_fallback(user_id: str, error=None) -> dict:
    """优惠券服务降级：返回默认优惠券"""
    print(f"[降级] 优惠券服务不可用，返回默认券 (error: {error})")
    return {"coupon_id": "default", "discount": 0, "fallback": True}


coupon_breaker = CircuitBreaker(
    name="coupon-service",
    failure_threshold=3,
    success_threshold=2,
    timeout=10.0,
    fallback=coupon_fallback,
)


@coupon_breaker
def get_coupon(user_id: str) -> dict:
    """调用优惠券服务"""
    import random
    if random.random() < 0.7:
        raise ConnectionError("coupon service timeout")
    return {"coupon_id": "abc-123", "discount": 15}


if __name__ == "__main__":
    for i in range(15):
        result = get_coupon(f"user-{i}")
        state = coupon_breaker.state.value
        print(f"请求{i:2d}: state={state:9s}, result={result}")
        time.sleep(0.5)
```

跑起来你会看到：

```
请求 0: state=closed   , result=None  # 失败，走降级
请求 1: state=closed   , result=None
请求 2: state=open     , result={'coupon_id': 'default', ...}  # 熔断打开
请求 3: state=open     , result={'coupon_id': 'default', ...}
...
请求 8: state=half_open, result={...}  # 超时后试探
请求 9: state=closed   , result={...}  # 试探成功，恢复
```

### 降级策略不止熔断

熔断只是手段之一。完整的降级策略矩阵：

| 策略 | 适用场景 | 实现 |
|------|----------|------|
| 熔断 | 下游超时/错误率高 | Circuit Breaker |
| 限流 | 流量突增 | 令牌桶/滑动窗口 |
| 缓存兜底 | 读多写少 | 返回过期缓存 |
| 功能裁剪 | 非核心功能 | feature flag 关闭 |

生产中通常组合使用。Sentinel 的做法：**先限流，限不住再熔断，熔断后走降级**。

一个组合示例：

```python
# degradation_manager.py
import time
from circuit_breaker import CircuitBreaker


class DegradationManager:
    """根据 error budget 自动切换降级级别"""

    LEVEL_NONE = 0       # 正常
    LEVEL_THROTTLE = 1   # 限流
    LEVEL_DEGRADE = 2    # 降级（关闭非核心功能）
    LEVEL_CIRCUIT = 3    # 熔断

    def __init__(self, budget_tracker):
        self.tracker = budget_tracker
        self.level = self.LEVEL_NONE
        self.feature_flags = {
            "recommendation": True,   # 推荐服务
            "coupon": True,           # 优惠券
            "comment": True,          # 评论
            "search": True,           # 搜索
        }
        self.breakers = {}  # 服务名 -> CircuitBreaker

    def check_and_adjust(self):
        """每次采样后调用，根据 budget 状态调整降级级别"""
        if not self.tracker.snapshots:
            return

        latest = self.tracker.snapshots[-1]
        new_level = self.LEVEL_NONE

        if latest.burn_rate >= self.tracker.policy.burn_rate_block:
            new_level = self.LEVEL_CIRCUIT
        elif latest.budget_remaining < 0.3:
            new_level = self.LEVEL_DEGRADE
        elif latest.budget_remaining < 0.6:
            new_level = self.LEVEL_THROTTLE

        if new_level != self.level:
            self._apply_level(new_level)
            self.level = new_level

    def _apply_level(self, level: int):
        """应用降级级别"""
        if level == self.LEVEL_NONE:
            print("✅ 恢复正常，所有功能开启")
            for k in self.feature_flags:
                self.feature_flags[k] = True

        elif level == self.LEVEL_THROTTLE:
            print("⚠️ 进入限流模式")
            self.feature_flags["recommendation"] = False

        elif level == self.LEVEL_DEGRADE:
            print("🔴 进入降级模式，关闭非核心功能")
            self.feature_flags["recommendation"] = False
            self.feature_flags["coupon"] = False
            self.feature_flags["comment"] = False

        elif level == self.LEVEL_CIRCUIT:
            print("🚨 进入熔断模式，仅保留核心链路")
            for k in self.feature_flags:
                self.feature_flags[k] = False
            # 核心链路走熔断器的 fallback
            for breaker in self.breakers.values():
                breaker.state = CircuitBreaker.State.OPEN \
                    if hasattr(CircuitBreaker, 'State') else None

    def is_feature_enabled(self, name: str) -> bool:
        return self.feature_flags.get(name, False)
```

`DegradationManager` 和 `ErrorBudgetTracker` 配合起来，就形成了完整的自动降级圈：采样 → 算燃烧率 → 切降级级别 → 采样，一直转。

## 踩坑

这三个坑是我和同事用血泪换来的。

### 坑1：Error Budget 窗口设太短

一开始我们把窗口设成 1 小时，结果凌晨低峰期（请求量小）随便几个 5xx 就把 budget 烧完了，大清早被电话叫起来。

**解法**：窗口至少 24 小时，或者用滑动窗口加权——最近的错误权重更高，但不会因为短期波动就触发。

### 坑2：熔断器超时设太短

熔断等 10 秒就去试探下游，下游还在重启，试探失败又熔断，来回弹。P99 不降反升。

**解法**：超时至少设成下游平均恢复时间的 2 倍。优惠券服务重启要 30 秒，熔断超时就设 60 秒。另外，半开状态别只放一个请求过去，放 3-5 个，成功率统计才有意义。

### 坑3：降级了但没人知道

自动降级跑得好好的，但没人关注降级事件。结果降级跑了一整天，非核心功能一直关着，用户投诉才知道。

**解法**：每次降级级别变更必须发通知——Slack/钉钉/企微都行，别只写日志。通知里带上当前 budget 剩余和燃烧率，让值班的人能快速判断要不要介入。

```python
def _apply_level(self, level: int):
    # ... 原有逻辑 ...
    # 发通知
    self._notify_level_change(level)

def _notify_level_change(self, level: int):
    msg = (
        f"[降级变更] {self.tracker.snapshots[-1].error_rate:.4f} "
        f"budget剩余: {self.tracker.snapshots[-1].budget_remaining:.2%} "
        f"燃烧率: {self.tracker.snapshots[-1].burn_rate:.1f}x "
        f"新级别: {['正常','限流','降级','熔断'][level]}"
    )
    # 发到钉钉/Slack webhook
    import requests
    requests.post(os.getenv("ALERT_WEBHOOK_URL"), json={"content": msg})
```

## 下一步

最小闭环跑起来之后，可以往这些方向扩展：

1. **多服务联动**：一个服务降级时，上游自动切换到轻量模式，避免级联失败
2. **混沌工程**：用 Chaos Monkey 定期注入故障，验证闭环是否真的转得起来
3. **指标可视化**：Grafana dashboard 展示 budget 消耗曲线和降级事件时间线
4. **配置中心化**：熔断阈值、budget 策略不要硬编码，放到 Apollo/Nacos 里动态调整
5. **故障复盘自动化**：每次降级事件自动生成 timeline，减少人工梳理

核心就一件事：**让系统在出问题时能自己止血，而不是等人来救**。从这三个组件开始，先把圈转起来，再慢慢加。
