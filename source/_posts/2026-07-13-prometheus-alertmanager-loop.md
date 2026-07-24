---
title: 从监控到闭环：Prometheus + Alertmanager 实操指南
tags:
  - Loop Engineering
  - Prometheus
  - Alertmanager
  - 监控
categories:
  - 工程实践
abbrlink: 7273
date: 2026-07-13 18:00:00
description: "前面几篇聊闭环的理论和设计，这篇落地到具体工具。Prometheus + Alertmanager 是当下最主流的监控告警组合，也是大部分团队搭建闭环的起点。"
keywords: "从监控到闭环, prometheus, alertmanager, 实操指南, Loop Engineering, Prometheus, Alertmanager, 监控"
---

# 从监控到闭环：Prometheus + Alertmanager 实操指南

前面几篇聊闭环的理论和设计，这篇落地到具体工具。Prometheus + Alertmanager 是当下最主流的监控告警组合，也是大部分团队搭建闭环的起点。

但很多人的用法只停在"采集+告警"，没有走到"自动动作"那一步。这篇把从监控到闭环的完整链路串起来。

## 前提：Prometheus 基础架构

假设你已经有了基本的 Prometheus 部署。如果没有，快速过一下核心组件：

- **Prometheus Server** — 采集和存储指标
- **Alertmanager** — 告警路由、去重、静默
- **Pushgateway** — 短生命周期任务的指标中转（可选）
- **Grafana** — 可视化面板

闭环的核心在 Prometheus 的 recording rule + alerting rule + Alertmanager 的 routing + webhook。画个图：

```
[应用/服务] → [Exporter] → [Prometheus] → [Recording Rules]
                                                  ↓
                                            [Alerting Rules]
                                                  ↓
                                            [Alertmanager]
                                                  ↓
                                    ┌──────────┼──────────┐
                                    ↓          ↓          ↓
                                [钉钉/Slack] [Webhook]  [自动动作]
```

关键：**Webhook 是闭环的入口。** Alertmanager 通过 webhook 把告警推给你的自动化服务，自动化服务执行动作。

## 第一步：用 Recording Rule 预计算指标

直接在告警规则里做复杂计算是个坏习惯——Prometheus 每次评估告警都要重算一遍，性能差且不好复用。Recording Rule 把计算结果存成新指标，后续直接用。

```yaml
# prometheus_rules.yml
groups:
  - name: service_health
    interval: 30s
    rules:
      # 5分钟滑动窗口的错误率
      - record: service:error_rate_5m
        expr: |
          sum(rate(http_requests_total{status=~"5.."}[5m])) by (service)
          /
          sum(rate(http_requests_total[5m])) by (service)

      # P99延迟（5分钟窗口）
      - record: service:p99_latency_5m
        expr: |
          histogram_quantile(0.99, 
            sum(rate(http_request_duration_seconds_bucket[5m])) by (service, le)
          )

      # 动态基线：过去7天同时段的错误率均值
      - record: service:error_rate_baseline
        expr: |
          avg_over_time(service:error_rate_5m[7d] offset 1h)
```

Recording Rule 的好处是**可复用**。`service:error_rate_5m` 这个指标，告警用、面板用、闭环决策也用，算一次到处用。

## 第二步：告警规则设计

告警规则是闭环的"感知"环节。设计原则：**告警要可操作，不可操作的告警是噪音。**

```yaml
# alert_rules.yml
groups:
  - name: service_alerts
    rules:
      # 错误率超动态基线2倍
      - alert: HighErrorRate
        expr: |
          service:error_rate_5m > service:error_rate_baseline * 2
          and service:error_rate_5m > 0.05
        for: 3m
        labels:
          severity: warning
          team: sre
        annotations:
          summary: "服务 {{ $labels.service }} 错误率异常"
          description: "当前错误率 {{ $value | printf \"%.2%\" }}，基线值约 {{ printf \"%.2%\" (index . \"service:error_rate_baseline\") }}"

      # 错误率超过50%，严重
      - alert: CriticalErrorRate
        expr: service:error_rate_5m > 0.5
        for: 1m
        labels:
          severity: critical
          team: sre
          action: degrade  # ← 关键：标注建议动作
        annotations:
          summary: "服务 {{ $labels.service }} 错误率超过50%"
          action_hint: "建议立即降级该服务"

      # Kafka消费lag异常
      - alert: HighConsumerLag
        expr: |
          kafka_consumer_group_lag > 5000
          and delta(kafka_consumer_group_lag[5m]) > 1000
        for: 5m
        labels:
          severity: warning
          team: sre
          action: scale_up
```

注意两个关键设计：

1. **`for` 字段** — 告警必须持续一段时间才触发，避免毛刺。1-5 分钟是常见值。
2. **`action` label** — 标注建议的闭环动作。这让 Alertmanager 可以根据 action 做路由。

## 第三步：Alertmanager 路由

Alertmanager 不只是发告警，它能根据标签做精细化路由——不同严重程度走不同通道，不同动作类型走不同处理逻辑。

```yaml
# alertmanager.yml
route:
  group_by: ['service', 'action']
  group_wait: 30s
  group_interval: 5m
  
  routes:
    # critical + 有action标签 → 发webhook给自动化服务
    - match:
        severity: critical
      receiver: auto-action
      repeat_interval: 1m
      
    # warning → 只发通知
    - match:
        severity: warning
      receiver: team-notification
      repeat_interval: 10m

receivers:
  - name: team-notification
    slack_configs:
      - api_url: https://hooks.slack.com/services/xxx
        channel: '#sre-alerts'

  - name: auto-action
    webhook_configs:
      - url: http://loop-controller:8080/alert
        send_resolved: true  # 恢复时也通知，用于触发recover动作
```

`send_resolved: true` 很重要——闭环的恢复动作靠的是"告警恢复"信号。

## 第四步：闭环控制器

Webhook 接收端是闭环的"决策+执行"环节。一个简单的实现：

```python
# loop_controller.py
from fastapi import FastAPI, Request
import httpx
import json

app = FastAPI()

# 服务→节点映射（实际从CMDB获取）
SERVICE_NODES = {
    "order-service": ["node-1", "node-2", "node-3"],
    "payment-service": ["node-4", "node-5"],
}

# 当前状态
degraded_services = set()

@app.post("/alert")
async def handle_alert(request: Request):
    payload = await request.json()
    
    for alert in payload.get("alerts", []):
        status = alert["status"]           # firing | resolved
        labels = alert["labels"]
        service = labels.get("service", "")
        action = labels.get("action", "")
        severity = labels.get("severity", "")
        
        if status == "firing" and action == "degrade" and severity == "critical":
            await execute_degrade(service)
        elif status == "resolved" and service in degraded_services:
            await execute_recover(service)
        elif status == "firing" and action == "scale_up":
            await execute_scale_up(service)
    
    return {"status": "ok"}

async def execute_degrade(service: str):
    if service in degraded_services:
        return  # 已经降级了，不重复
    
    # 从Nginx摘除节点
    nodes = SERVICE_NODES.get(service, [])
    if not nodes:
        return
    
    # 摘除一半节点（保守策略）
    to_remove = nodes[:len(nodes)//2]
    
    async with httpx.AsyncClient() as client:
        # 调用Nginx API更新upstream
        for node in to_remove:
            await client.post(
                "http://nginx-api:8080/upstream/remove",
                json={"service": service, "node": node}
            )
    
    degraded_services.add(service)
    log_action("degrade", service, removed=to_remove)

async def execute_recover(service: str):
    # 恢复所有摘除的节点
    async with httpx.AsyncClient() as client:
        await client.post(
            "http://nginx-api:8080/upstream/restore",
            json={"service": service}
        )
    
    degraded_services.discard(service)
    log_action("recover", service)

async def execute_scale_up(service: str):
    # 调K8s API扩容
    async with httpx.AsyncClient() as client:
        await client.post(
            f"http://k8s-api:8080/apis/apps/v1/namespaces/default/deployments/{service}/scale",
            json={"spec": {"replicas": "auto+2"}}
        )
    
    log_action("scale_up", service)

def log_action(action: str, service: str, **kwargs):
    entry = {
        "action": action,
        "service": service,
        **kwargs
    }
    with open("/var/log/loop-actions.jsonl", "a") as f:
        f.write(json.dumps(entry) + "\n")
```

这就是一个最小可用的闭环控制器。200 行代码，接收 Alertmanager 的 webhook，执行降级/恢复/扩容，记日志。

## 第五步：验证闭环生效

闭环上线后，怎么验证它真的管用？

**1. 混沌测试。** 主动注入故障，看闭环是否能自动恢复。

```bash
# 用chaos-mesh注入延迟
kubectl apply -f - <<EOF
apiVersion: chaos-mesh.org/v1alpha1
kind: NetworkChaos
metadata:
  name: test-payment-delay
spec:
  action: delay
  delay:
    latency: "5s"
  selector:
    namespaces: ["default"]
    labelSelectors:
      app: "payment-service"
  duration: "3m"
EOF
```

注入 3 分钟延迟，观察闭环是否在 1 分钟内自动降级支付服务，延迟消失后是否自动恢复。

**2. 告警回溯测试。** 把过去一周的真实告警数据重放给闭环控制器，看它会做出什么决策，和当时的人工决策对比。

**3. 准确率监控。** 记录每次自动动作的结果，统计准确率：

```python
# 每周跑一次
def weekly_accuracy_report():
    actions = load_actions(last_7_days())
    
    total = len(actions)
    correct = sum(1 for a in actions if a["result"] == "improved")
    false_positive = sum(1 for a in actions if a["result"] == "worse_or_no_change")
    
    print(f"总动作数: {total}")
    print(f"准确率: {correct/total:.1%}")
    print(f"误触发: {false_positive/total:.1%}")
```

准确率低于 80% 就该调参，低于 50% 就该关掉自动动作。

## 几个实操建议

**1. Alertmanager 的 inhibit 规则要用上。** critical 告警触发时，自动静默同服务的 warning 告警，避免告警风暴。

```yaml
inhibit_rules:
  - source_match:
      severity: critical
    target_match:
      severity: warning
    equal: [service]
```

**2. 静默窗口。** 大促期间手动设置静默，暂时屏蔽非关键告警。或者反过来——大促期间降低告警阈值，更早感知问题。

**3. 分环境配置。** 测试环境的告警不进闭环，只有生产环境的 critical 告警才触发自动动作。用 Prometheus 的 `external_labels` 区分：

```yaml
# prometheus.yml (生产)
global:
  external_labels:
    environment: production
```

从监控到闭环，Prometheus + Alertmanager 的链路就这样。核心不是工具多复杂，是**把感知→决策→执行→验证的闭环逻辑理清楚，工具只是载体**。

---

**相关阅读：**
- Prometheus 官方文档 - Recording Rules & Alerting Rules
- Alertmanager 官方文档 - Routing & Inhibition
- Chaos Mesh - Kubernetes 混沌工程工具
