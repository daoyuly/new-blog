---
title: Error Budget 实战：从 SLO 制定到自动化发布冻结
tags:
  - Loop Engineering
  - SLO
  - Error Budget
  - SRE
categories:
  - 工程实践
abbrlink: 24842
date: 2026-07-13 19:00:00
description: "Error Budget 这个概念，SRE 圈子里人尽皆知。但真把它用起来的团队不多。大部分团队的状态是：知道 Error Budget 是什么，甚至算过，但算完就贴墙上完了，没有接入任何决策流程。"
keywords: "error, budget, slo, 制定到自动化发布冻结, Loop Engineering, SLO, Error Budget, SRE"
---

# Error Budget 实战：从 SLO 制定到自动化发布冻结

Error Budget 这个概念，SRE 圈子里人尽皆知。但真把它用起来的团队不多。大部分团队的状态是：知道 Error Budget 是什么，甚至算过，但算完就贴墙上完了，没有接入任何决策流程。

这篇把从制定 SLO 到自动化发布冻结的完整链路走一遍。

## SLO 怎么定

Error Budget 的前提是有 SLO。SLO 怎么定？很多人的做法是拍脑袋——"我们争取 99.9%"。但 99.9% 意味着每月只能宕机 43 分钟，你的系统能做到吗？

### 第一步：选 SLI

SLI（Service Level Indicator）是可度量的指标。好的 SLI 要满足两个条件：可测量、和用户体验直接相关。

```python
# 常见SLI
SLI_TEMPLATES = {
    "availability": "成功请求数 / 总请求数",
    "latency": "P99延迟 < 阈值的请求比例",
    "correctness": "正确响应数 / 总响应数",
    "freshness": "数据更新时间 < 阈值的比例",
}
```

别选太多。一个服务 2-3 个 SLI 足够。多了没人看，少了覆盖不全。

### 第二步：从历史数据算基线

别拍脑袋，先看过去 3 个月的实际表现：

```python
import numpy as np

def calculate_slo_baseline(metrics: list[float]) -> dict:
    """
    metrics: 过去90天的每日可用性数据
    """
    p50 = np.percentile(metrics, 50)
    p90 = np.percentile(metrics, 90)
    p99 = np.percentile(metrics, 99)
    
    # SLO建议：取P90水平，给自己留点余量
    suggested_slo = p90
    
    return {
        "p50": f"{p50:.4f}",
        "p90": f"{p90:.4f}", 
        "p99": f"{p99:.4f}",
        "suggested_slo": f"{suggested_slo:.4f}",
        "rationale": "取P90水平作为SLO，约10%的天数会超预算"
    }
```

如果你的 P90 是 99.7%，那 SLO 定 99.7% 就行。定 99.99% 只会让自己痛苦。

### 第三步：区分用户和内部

对外 API 的 SLO 要严格，内部工具的 SLO 可以宽松。不是所有服务都值得 99.9%。

```
核心交易链路 → SLO 99.95%（Error Budget: 22分钟/月）
用户中心     → SLO 99.9%（Error Budget: 43分钟/月）
后台管理     → SLO 99.5%（Error Budget: 216分钟/月）
内部工具     → SLO 99%（Error Budget: 432分钟/月）
```

SLO 不是越高越好。SLO 越高，Error Budget 越少，团队越不敢变更，创新速度越慢。

## Error Budget 怎么算

```
Error Budget = 1 - SLO

例：SLO = 99.9%
Error Budget = 0.1% = 43.2分钟/月 = 7.2小时/年
```

但这只是总量。更关键的是**消耗速率**。

### Burn Rate

Burn Rate 是 Error Budget 的消耗速度。正常状态下 burn rate = 1（按月均匀消耗）。Burn rate = 10 意味着如果持续下去，月预算 3 天就花完。

```python
class ErrorBudgetTracker:
    def __init__(self, slo: float, budget_period_hours: int = 720):  # 30天
        self.slo = slo
        self.period_hours = budget_period_hours
        self.budget_minutes = (1 - slo) * budget_period_hours * 60
        
        self.error_minutes = 0
        self.total_minutes = 0
    
    def record(self, healthy: bool):
        self.total_minutes += 1
        if not healthy:
            self.error_minutes += 1
    
    def burn_rate(self) -> float:
        """当前消耗速率（相对于均匀消耗的倍数）"""
        if self.total_minutes == 0:
            return 0
        actual_error_rate = self.error_minutes / self.total_minutes
        budget_rate = 1 - self.slo
        return actual_error_rate / budget_rate if budget_rate > 0 else 0
    
    def remaining_budget_pct(self) -> float:
        """剩余预算百分比"""
        used = self.error_minutes / self.budget_minutes
        return max(0, 1 - used)
    
    def budget_exhausted(self) -> bool:
        return self.remaining_budget_pct() <= 0
    
    def time_to_exhaustion(self) -> float:
        """按当前速率，预算还能撑多少小时"""
        br = self.burn_rate()
        if br <= 0:
            return float('inf')
        remaining_hours = self.remaining_budget_pct() * self.period_hours
        return remaining_hours / br
```

### Burn Rate 和告警策略

Google SRE 推荐的 burn rate 告警阈值：

| Burn Rate | 预算耗尽时间 | 动作 |
|-----------|------------|------|
| 14.4x | < 1小时 | 页面告警 + 自动降级 |
| 6x | < 6小时 | 页面告警 |
| 1x | 30天 | 正常消耗，不告警 |
| < 0.5x | > 60天 | 预算充裕，可加速发布 |

```yaml
# Prometheus alerting rules
groups:
  - name: error_budget
    rules:
      - alert: ErrorBudgetBurningFast
        expr: |
          service:burn_rate_1h > 14.4
        for: 5m
        labels:
          severity: critical
        annotations:
          summary: "服务 {{ $labels.service }} 预算消耗速率14x，1小时内耗尽"

      - alert: ErrorBudgetBurningMedium  
        expr: |
          service:burn_rate_6h > 6
        for: 15m
        labels:
          severity: warning
        annotations:
          summary: "服务 {{ $labels.service }} 预算消耗速率6x，6小时内耗尽"
```

## 自动化发布冻结

Error Budget 最有价值的应用不是告警，是**自动影响发布决策**。预算耗尽 → 冻结发布，预算充裕 → 放行。

### 实现方案

```python
class DeploymentGate:
    def __init__(self, budget_tracker: ErrorBudgetTracker):
        self.tracker = budget_tracker
    
    def can_deploy(self, service: str, change_type: str) -> dict:
        remaining = self.tracker.remaining_budget_pct()
        burn = self.tracker.burn_rate()
        
        # 预算耗尽：冻结所有非紧急发布
        if self.tracker.budget_exhausted():
            return {
                "allowed": False,
                "reason": f"Error Budget 已耗尽（剩余 {remaining:.1%}）",
                "override": "仅限紧急修复，需SRE总监审批"
            }
        
        # 预算紧张（<20%）：只允许低风险变更
        if remaining < 0.2:
            if change_type in ("hotfix", "config_change"):
                return {
                    "allowed": True,
                    "reason": f"预算紧张但变更类型为{change_type}，放行",
                    "warning": f"剩余预算 {remaining:.1%}，建议控制变更频率"
                }
            return {
                "allowed": False,
                "reason": f"预算紧张（剩余 {remaining:.1%}），暂停非紧急发布"
            }
        
        # 预算充裕：正常放行
        return {
            "allowed": True,
            "reason": f"预算充裕（剩余 {remaining:.1%}，burn rate {burn:.1f}x）"
        }
```

### 接入 CI/CD

```yaml
# GitHub Actions
name: Deploy Gate
on:
  workflow_dispatch:
    inputs:
      service:
        required: true
      change_type:
        required: true

jobs:
  check-budget:
    runs-on: ubuntu-latest
    steps:
      - name: Check Error Budget
        run: |
          # 调用预算检查API
          RESULT=$(curl -s http://budget-gate:8080/check \
            -d "service=${{ inputs.service }}" \
            -d "change_type=${{ inputs.change_type }}")
          
          ALLOWED=$(echo $RESULT | jq -r '.allowed')
          REASON=$(echo $RESULT | jq -r '.reason')
          
          if [ "$ALLOWED" != "true" ]; then
            echo "::error::$REASON"
            exit 1
          fi
          
          echo "✅ $REASON"
  
  deploy:
    needs: check-budget
    runs-on: ubuntu-latest
    steps:
      - run: echo "部署中..."
```

## 常见问题

**"预算耗尽了但业务要求必须发版怎么办？"**

设一个 override 机制。预算耗尽时，紧急修复经 SRE 总监审批可以放行，但每次 override 都要记录，月度复盘时检查 override 频率。频繁 override 说明 SLO 定高了或者稳定性投入不够。

**"预算怎么重置？"**

按月重置最简单。更讲究的做法是滚动窗口——永远看过去 30 天的预算消耗，而不是每月1号清零。滚动窗口避免了"月底挥霍"和"月初紧缩"的行为。

**"多个服务共享预算还是各自独立？"**

核心链路独立预算，非核心服务可以共享。共享预算的问题是某个服务把预算烧完了，其他服务也跟着冻结。所以只在服务间影响可忽略时才共享。

Error Budget 不是惩罚工具，是沟通工具。它让"稳定性"这件事从模糊的感觉变成具体的数字——预算还有多少，消耗多快，什么时候能恢复发布。有了数字，产品和技术就不用吵架了。

---

**相关阅读：**
- Google SRE Book Chapter 4 - Service Level Objectives
- Google SRE Workbook Chapter 2 - Implementing SLOs
-《SRE：Google运维解密》中文版第4章
