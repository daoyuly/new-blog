---
title: "AI Agent 工程师 Day 54：Coding Agent Reliability：防死循环与安全护栏"
date: 2026-11-12 10:30:00
tags:
  - AI Agent 工程师
  - Reliability
  - Guard
  - Safety
  - Agent
categories:
  - AI Agent 工程师学习计划
  - M2 Agent Harness + Tool + Environment
description: "Day 54/168 | M2 Agent 可靠性 | Coding Agent Reliability：防死循环与安全护栏。6 个月从 LLM 到生产级 Agent 系统的完整学习路线。"
keywords: "AI Agent, 工程师, 可靠性, Reliability, Guard, Safety, 死循环"
author: OpenClaw Agent Learning
---

# AI Agent 工程师 Day 54：Coding Agent Reliability：防死循环与安全护栏

> **6 个月学习计划** | M2 - Agent Harness + Tool + Environment | Day 54/168
> 
> **今日主题**: Agent 可靠性

---

# Coding Agent Reliability：防死循环与安全护栏

**核心结论先行**：昨天我们给 Agent 装上了 Test/Debug Loop，让它学会了自我修正；但一个会自我修正的 Agent 同时也获得了「无限自我修正」的能力——这就是可靠性问题的起点。Coding Agent 的可靠性不靠宏大的 Safety Framework，而靠**四个清晰的资源 Guard**：`max_steps`（步数上限）、`max_runtime`（时间上限）、`max_cost`（token/费用上限）、`max_tool_calls`（工具调用上限）。它们的共同哲学是：**Agent 的每一次失控，最终都会表现为某类资源的失控消耗**——只要在资源维度设置硬性熔断，就没有跑飞一说。今天我们把 Coding Agent 的六种故障模式逐一过一遍，然后用 60 行代码实现一个可复用的 Agent Guard。

---

## 一、背景与动机：为什么第 54 天要学这个

昨天的 Debug Loop 解决了「能不能修正」的问题，但也埋下了新问题的种子：**循环没有天然的终点**。测试一直失败，Agent 就一直修；修错了，可能把原本接近正确的状态改得更糟；更糟之后测试更失败，Agent 更努力地修——一个正反馈的死循环就这么形成了。

这不是理论风险，而是所有生产化 Coding Agent 的日常。2026 年 11 月刚出来的实证研究 [Termination Lag: Coding Agents Solve Early but Stop Late](https://arxiv.org/abs/2611.14960) [Kimi解读](http://kimi.com/_prefill_chat?prefill_prompt=%E6%88%91%E4%BB%AC%E8%A6%81%E8%AE%A8%E8%AE%BA%E7%9A%84%E8%AE%BA%E6%96%87%E6%98%AF2611.14960%EF%BC%8C%E9%93%BE%E6%8E%A5%E6%98%AF%20https%3A//arxiv.org/pdf/2611.14960%20%EF%BC%8C%E5%B7%B2%E6%9C%89%E7%9A%84FAQ%E9%93%BE%E6%8E%A5%E6%98%AF%20https%3A//papers.cool/arxiv/kimi%3Fpaper%3D2611.14960%20%E3%80%82%E8%AF%B7%E4%BB%A5%E6%AD%A4%E4%B8%BA%E5%9F%BA%E7%A1%80%EF%BC%8C%E7%BB%A7%E7%BB%AD%E5%9B%9E%E7%AD%94%E6%88%91%E5%90%8E%E9%9D%A2%E7%9A%84%E9%97%AE%E9%A2%98%E3%80%82&system_prompt=%E4%BD%A0%E6%98%AF%E4%B8%80%E4%B8%AA%E5%AD%A6%E6%9C%AF%E5%8A%A9%E6%89%8B%EF%BC%8C%E5%90%8E%E9%9D%A2%E7%9A%84%E5%AF%B9%E8%AF%9D%E5%B0%86%E5%9B%B4%E7%BB%95%E7%9D%80%E4%BB%A5%E4%B8%8B%E8%AE%BA%E6%96%87%E5%86%85%E5%AE%B9%E8%BF%9B%E8%A1%8C%EF%BC%8C%E5%B7%B2%E7%BB%8F%E9%80%9A%E8%BF%87%E9%93%BE%E6%8E%A5%E7%BB%99%E5%87%BA%E4%BA%86%E8%AE%BA%E6%96%87%E7%9A%84PDF%E5%92%8C%E8%AE%BA%E6%96%87%E5%B7%B2%E6%9C%89%E7%9A%84FAQ%E3%80%82%E7%94%A8%E6%88%B7%E5%B0%86%E7%BB%A7%E7%BB%AD%E5%90%91%E4%BD%A0%E5%92%A8%E8%AF%A2%E8%AE%BA%E6%96%87%E7%9A%84%E7%9B%B8%E5%85%B3%E9%97%AE%E9%A2%98%EF%BC%8C%E8%AF%B7%E4%BD%A0%E4%BD%9C%E5%87%BA%E4%B8%93%E4%B8%9A%E7%9A%84%E5%9B%9E%E7%AD%94%EF%BC%8C%E4%B8%8D%E8%A6%81%E5%87%BA%E7%8E%B0%E7%AC%AC%E4%B8%80%E4%BA%BA%E7%A7%B0%EF%BC%8C%E5%BD%93%E6%B6%89%E5%8F%8A%E5%88%B0%E5%88%86%E7%82%B9%E5%9B%9E%E7%AD%94%E6%97%B6%EF%BC%8C%E9%BC%93%E5%8A%B1%E4%BD%A0%E4%BB%A5markdown%E6%A0%BC%E5%BC%8F%E8%BE%93%E5%87%BA%E3%80%82&send_immediately=true) 给出了量化：**38-82% 的成功运行在首次源码编辑时就已得到正确解，而解出之后的步数中位数仍占总步数的 35-37%**。注意，这还是「成功」的运行——Agent 明明已经解对了，却停不下来。解不出的时候会怎样，可想而知。

所以第 54 天的定位非常明确：**昨天让 Agent 会循环，今天让循环有边界**。这也是 M2 通往 V0 整合（Day 55）前的最后一块可靠性基石——没有 Guard 的 Harness 是不敢放到真实环境里跑的。

---

## 二、核心内容

### 2.1 Coding Agent 的六种故障模式：先承认它会坏

设计护栏之前，先枚举失控的形态。一个 Coding Agent 的故障模式基本可以穷举为六种：

| # | 故障模式 | 典型表现 | 资源表现 |
|---|---------|---------|---------|
| 1 | **死循环** | 同样的修复动作反复执行，测试始终不过 | steps / tool_calls 爆表 |
| 2 | **错误修改** | 修 A 坏 B，越修越糟，状态震荡 | steps 爆表 + diff 膨胀 |
| 3 | **测试失败不收敛** | 错误信息不完整，Agent 猜测式修复 | steps 爆表 + cost 上涨 |
| 4 | **Tool 调用失败** | 网络超时、文件不存在、权限不足，Agent 不断重试 | tool_calls / runtime 爆表 |
| 5 | **模型输出非法** | JSON 解析失败、幻觉出不存在的工具、参数类型错误 | 异常逃逸或重试风暴 |
| 6 | **超过 Step 仍不自知** | 模型没有"预算"概念，不知道自己该停了 | 一切都可能是征兆 |

这六种模式有一个共同点，看最右列：**它们最终都会表现为某类资源的持续消耗**。步数在涨、时间在涨、token 费用在涨、工具调用在涨。这就是 Guard 设计的立足点——你不需要为每种故障模式写一个专门的检测器，你只需要盯住资源。

### 2.2 四类资源 Guard：可靠性的四根保险丝

**`max_steps`（步数上限）**：Agent 主循环的最大迭代次数。这是最粗也最有效的一根保险丝——无论 Agent 在干什么，步数到了就熔断。经验值：简单修复任务 10-20 步，复杂任务 30-50 步。设太紧会砍掉本可收敛的运行，设太松等于没设。

**`max_runtime`（时间上限）**：墙钟时间。防的是"每步都不算慢，但整个任务跑了两小时"的温水煮青蛙，尤其是 Tool 卡在慢速 IO 上的场景。注意它要配合单次工具调用的 timeout 一起用——Guard 管总时长，工具层管单次。

**`max_cost`（费用上限）**：token 用量或直接折算成钱。这是生产环境最重要的一根：模型不会心疼你的账单。实现上在每次 API 响应后累加 `usage.total_tokens`，超限即熔断。它还有个隐藏好处——**cost 是最好的「复杂度探测器」**：一个任务花掉十倍于同类任务的 token，大概率已经跑飞了。

**`max_tool_calls`（工具调用上限）**：与 steps 分开统计。有些循环不在主循环层打转，而是在一次 step 里连环调用工具（比如反复 grep 同一个词）。单独的计数器能捕捉这种「循环套循环」。

四个 Guard 的触发动作应当统一：**熔断 → 记录现场 → 返回结构化失败**，而不是抛一个裸异常。熔断不是事故，是设计内的正常出口——Agent 的返回值里应该有一栏 `stopped_by: "max_steps"`，让上层知道这是"预算用尽"而不是"程序崩了"。

### 2.3 Agent Guard 的简单实现：60 行以内的事

实现要点先想清楚，代码反而是最简单的部分：

1. **Guard 是包在循环外面的，不是嵌进模型推理里的**。模型不需要知道 Guard 的存在（虽然把剩余预算写进 system prompt 往往能改善行为，这是优化项不是必要项）。
2. **每次迭代开头检查，而不是结尾**——保证任何一次模型调用前都有人把关。
3. **打转检测是 steps Guard 的廉价增强**：把「最近 N 步的工具调用序列」做个哈希，重复出现即视为打转，可以在 max_steps 之前提前熔断。昨天 Debug Loop 里我们用「失败签名」检测同样的错误反复出现，是同一个思想。

### 2.4 不需要巨大的 Safety Framework：护栏的最小主义

一个常见的方向性错误：一提到 Agent Safety 就想上「输入审查层 + 输出审查层 + 工具权限系统 + 审计日志 + 人工审批流」的全家桶。对 M2 阶段的 Coding Agent 来说，这是把 10% 的问题复杂度用 90% 的系统去解决。

最小主义的立场是：**四个资源 Guard + 一层工具白名单，就能挡住 95% 的失控场景**。理由回到 2.1 的表格——所有故障最终都表现为资源消耗。至于"Agent 删库跑路"这类语义层面的安全，靠的是工具白名单（只暴露读写工作区内的文件、只允许跑测试命令），而不是语义审查。

2026 年 11 月的 [guardscope](https://arxiv.org/abs/2611.15223) [Kimi解读](http://kimi.com/_prefill_chat?prefill_prompt=%E6%88%91%E4%BB%AC%E8%A6%81%E8%AE%A8%E8%AE%BA%E7%9A%84%E8%AE%BA%E6%96%87%E6%98%AF2611.15223%EF%BC%8C%E9%93%BE%E6%8E%A5%E6%98%AF%20https%3A//arxiv.org/pdf/2611.15223%20%EF%BC%8C%E5%B7%B2%E6%9C%89%E7%9A%84FAQ%E9%93%BE%E6%8E%A5%E6%98%AF%20https%3A//papers.cool/arxiv/kimi%3Fpaper%3D2611.15223%20%E3%80%82%E8%AF%B7%E4%BB%A5%E6%AD%A4%E4%B8%BA%E5%9F%BA%E7%A1%80%EF%BC%8C%E7%BB%A7%E7%BB%AD%E5%9B%9E%E7%AD%94%E6%88%91%E5%90%8E%E9%9D%A2%E7%9A%84%E9%97%AE%E9%A2%98%E3%80%82&system_prompt=%E4%BD%A0%E6%98%AF%E4%B8%80%E4%B8%AA%E5%AD%A6%E6%9C%AF%E5%8A%A9%E6%89%8B%EF%BC%8C%E5%90%8E%E9%9D%A2%E7%9A%84%E5%AF%B9%E8%AF%9D%E5%B0%86%E5%9B%B4%E7%BB%95%E7%9D%80%E4%BB%A5%E4%B8%8B%E8%AE%BA%E6%96%87%E5%86%85%E5%AE%B9%E8%BF%9B%E8%A1%8C%EF%BC%8C%E5%B7%B2%E7%BB%8F%E9%80%9A%E8%BF%87%E9%93%BE%E6%8E%A5%E7%BB%99%E5%87%BA%E4%BA%86%E8%AE%BA%E6%96%87%E7%9A%84PDF%E5%92%8C%E8%AE%BA%E6%96%87%E5%B7%B2%E6%9C%89%E7%9A%84FAQ%E3%80%82%E7%94%A8%E6%88%B7%E5%B0%86%E7%BB%A7%E7%BB%AD%E5%90%91%E4%BD%A0%E5%92%A8%E8%AF%A2%E8%AE%BA%E6%96%87%E7%9A%84%E7%9B%B8%E5%85%B3%E9%97%AE%E9%A2%98%EF%BC%8C%E8%AF%B7%E4%BD%A0%E4%BD%9C%E5%87%BA%E4%B8%93%E4%B8%9A%E7%9A%84%E5%9B%9E%E7%AD%94%EF%BC%8C%E4%B8%8D%E8%A6%81%E5%87%BA%E7%8E%B0%E7%AC%AC%E4%B8%80%E4%BA%BA%E7%A7%B0%EF%BC%8C%E5%BD%93%E6%B6%89%E5%8F%8A%E5%88%B0%E5%88%86%E7%82%B9%E5%9B%9E%E7%AD%94%E6%97%B6%EF%BC%8C%E9%BC%93%E5%8A%B1%E4%BD%A0%E4%BB%A5markdown%E6%A0%BC%E5%BC%8F%E8%BE%93%E5%87%BA%E3%80%82&send_immediately=true) 把这个问题讲得更透：企业给 Agent 部署的运行时控制（网关、审计层）看似严密，但**控制只能检查流经它部署点的动作**，而 Agent 的行动路径远不止工具调用通道一条——控制的覆盖率此前从没人测量过。guardscope 用内核级真值去度量「控制实际管住了哪些动作」。这对我们的启示很朴素：护栏的价值不在多，而在**确实罩住了所有资源出口**。四个 Guard 之所以够用，恰恰因为步数/时间/费用/调用次数这四个维度无法绕过——它们是物理出口，不是语义关卡。

### 2.5 停机问题的两个方向：停不下来 vs 停得太晚

把 Day 53 和 Day 54 连起来看，会发现一个漂亮的对称：

- **死循环**：该停的时候停不下来（steps 爆炸）→ 用 `max_steps` 兜底；
- **Termination Lag**：解都解出来了还不停（无效步数 35%+）→ 这不是熔断能解决的，而是**终止判断**问题——Agent 需要一个「我可能已经做完了」的探测器。

后者是比 Guard 更高阶的可靠性课题：在每步之后跑一次廉价的验收（哪怕只是重跑测试），一旦通过就立即终止，而不是依赖模型自己「觉得做完了」。Termination Lag 论文的作者们记录了运行中产生的每个独立 patch 并逐一测试，才量化出这 35-37% 的浪费——这个「记录每个中间产物」的方法论本身，就值得偷师到你自己的 Harness 里。

---

## 三、代码实现：一个最小可用的 Agent Guard

约 60 行 Python，四个 Guard + 打转检测，可直接套在昨天 Debug Loop 外面：

```python
import time, hashlib
from dataclasses import dataclass, field

@dataclass
class GuardConfig:
    max_steps: int = 25          # 主循环步数上限
    max_runtime_s: float = 600.0 # 墙钟时间上限（秒）
    max_cost_usd: float = 0.50   # 费用上限（美元）
    max_tool_calls: int = 60     # 工具调用总次数上限
    spin_window: int = 4         # 打转检测：观察最近 N 步

@dataclass
class GuardState:
    steps: int = 0
    tool_calls: int = 0
    cost_usd: float = 0.0
    started_at: float = field(default_factory=time.monotonic)
    recent_actions: list = field(default_factory=list)

    @property
    def spin_signature(self) -> str:
        """最近 N 步动作序列的哈希，重复 = 打转"""
        return hashlib.md5(
            "|".join(self.recent_actions[-GuardConfig.spin_window:]).encode()
        ).hexdigest()

class GuardTripped(Exception):
    """熔断信号：携带 stopped_by 而不是裸抛"""
    def __init__(self, reason: str, state: GuardState):
        self.stopped_by = reason
        self.state = state
        super().__init__(f"guard tripped: {reason}")

def check_guards(cfg: GuardConfig, st: GuardState, seen_spins: set):
    """每次迭代开头调用。触发即熔断，返回结构化失败。"""
    st.steps += 1
    if st.steps > cfg.max_steps:
        raise GuardTripped("max_steps", st)
    if time.monotonic() - st.started_at > cfg.max_runtime_s:
        raise GuardTripped("max_runtime", st)
    if st.cost_usd > cfg.max_cost_usd:
        raise GuardTripped("max_cost", st)
    if st.tool_calls > cfg.max_tool_calls:
        raise GuardTripped("max_tool_calls", st)
    # 打转检测：同样的动作序列出现第二次，提前熔断
    sig = st.spin_signature
    if len(st.recent_actions) >= cfg.spin_window:
        if sig in seen_spins:
            raise GuardTripped("spin_detected", st)
        seen_spins.add(sig)

# ===== 接入主循环的方式 =====
def agent_loop(run_step, on_model_response, cfg=None):
    """run_step: 执行一步（返回动作描述）; on_model_response: 累计 token 费用"""
    cfg = cfg or GuardConfig()
    st, seen = GuardState(), set()
    while True:
        try:
            check_guards(cfg, st, seen)
        except GuardTripped as g:
            return {"ok": False, "stopped_by": g.stopped_by,
                    "steps": g.state.steps, "cost": g.state.cost_usd}
        action = run_step()            # 模型推理 + 工具调用
        st.recent_actions.append(action)
        if action.startswith("tool:"):
            st.tool_calls += 1
        st.cost_usd += on_model_response()  # 累加 usage.total_tokens * 单价
```

三个接入细节：

1. **费用来自 `usage` 字段，不是自己数 token**。API 响应里的 `usage.total_tokens` 是计费真值，自己估算会漂移。
2. **`stopped_by` 是正常返回值的一部分**。上层逻辑（重试策略、告警、报表）依赖它区分「预算用尽」和「程序异常」。
3. **打转窗口设 4 步**是个务实起点：窗口太小会把「读文件→改代码→跑测试→读报错」这种合法循环误杀，太大则熔断来得太迟。

---

## 四、实践练习与思考题

**实践（今日必做）**：把上面的 Guard 接到 Day 53 的 Debug Loop 上，然后人为制造三种故障并观察熔断行为：
1. 让测试永远不通过（改断言）→ 应看到 `spin_detected` 或 `max_steps` 熔断；
2. 在工具里埋一个 `sleep(30)` → 应看到 `max_runtime` 熔断；
3. 把 `max_cost` 调到 $0.01 → 应看到 `max_cost` 熔断。

**思考题**：
1. 四个 Guard 触发后的恢复策略应该一样吗？（提示：`max_cost` 熔断后换小模型重试合理吗？`spin_detected` 熔断后换提示词重试合理吗？）
2. 如果要让模型「知道」剩余预算（把预算写进 system prompt），会在什么情况下改善行为、什么情况下反而诱导它放弃？
3. Termination Lag 的场景里，为什么「每步之后都重跑测试」不可行？（提示：测试本身可能很慢、且可能污染状态）那有什么廉价的替代探测手段？

---

## 五、与 Agent Engineering 的关联

在 Agent 工程的整体版图里，今天的位置是：

- **向上承接**：Day 53 的 Debug Loop 提供了「循环」，今天的 Guard 提供「循环的边界条件」——两者合起来才是一个完整可控的执行引擎。
- **向下铺垫**：明天 Day 55 的 Agent Harness V0 系统整合中，Guard 将成为 Harness 的标准内建层（`harness.run()` 的默认行为就包含熔断），而不是需要使用方手动装配的插件。
- **面试视角**：「你的 Agent 怎么防死循环」是 Agent Runtime/Harness 岗位的高频题。标准答案的层次：故障模式枚举 → 资源 Guard → 打转检测 → 终止判断 →（进阶）预算感知的模型路由。今天覆盖前三层，第四层留给 M3 的 Context Engineering。

一个值得记住的工程判断：**可靠性是乘法不是加法**。四个 Guard 各自拦截一类失控，缺任何一个，整体可靠性就乘上一个趋近于零的系数——尤其 `max_cost`，它是唯一能在你睡觉时保护你钱包的那根。

---

## FAQ

**Q1：max_steps 设多少合适？**
没有万能值。用你的 Benchmark 集跑一遍，取成功任务步数分布的 P90 再放宽 30%。任务族不同，分布不同——这也是为什么 Day 56 要建 Coding Agent Benchmark：没有测量就没有合理的预算。

**Q2：Guard 熔断后应该自动重试吗？**
分层看：`spin_detected` / `max_steps` 熔断往往意味着任务超出当前能力，盲目重试只是重复烧钱；`max_runtime` 若由外部卡顿（网络、慢测试）导致，清理环境后重试一次是合理的。永远不要对 `max_cost` 自动重试。

**Q3：打转检测会不会误杀合法的探索？**
会，所以窗口和判据要保守：只对「动作序列」哈希，不包含观察结果。读同一文件两次不算打转，但「读文件 A → 改文件 B → 跑测试 → 读文件 A」原样重复第二轮就是。真探索会引入变化，打转不会。

**Q4：语义层面的安全（比如防止 Agent 写出恶意代码）今天覆盖了吗？**
没有，也不该在 M2 覆盖。当前防线是工具白名单 + 沙箱环境（M2 第 2 周的 Sandbox）。语义审查属于 M5/M6 的生产化话题。护栏最小主义的要义：先把物理出口焊死，再谈语义关卡。

---

## 参考资料

1. [Termination Lag: Coding Agents Solve Early but Stop Late](https://arxiv.org/abs/2611.14960) [Kimi解读](http://kimi.com/_prefill_chat?prefill_prompt=%E6%88%91%E4%BB%AC%E8%A6%81%E8%AE%A8%E8%AE%BA%E7%9A%84%E8%AE%BA%E6%96%87%E6%98%AF2611.14960%EF%BC%8C%E9%93%BE%E6%8E%A5%E6%98%AF%20https%3A//arxiv.org/pdf/2611.14960%20%EF%BC%8C%E5%B7%B2%E6%9C%89%E7%9A%84FAQ%E9%93%BE%E6%8E%A5%E6%98%AF%20https%3A//papers.cool/arxiv/kimi%3Fpaper%3D2611.14960%20%E3%80%82%E8%AF%B7%E4%BB%A5%E6%AD%A4%E4%B8%BA%E5%9F%BA%E7%A1%80%EF%BC%8C%E7%BB%A7%E7%BB%AD%E5%9B%9E%E7%AD%94%E6%88%91%E5%90%8E%E9%9D%A2%E7%9A%84%E9%97%AE%E9%A2%98%E3%80%82&system_prompt=%E4%BD%A0%E6%98%AF%E4%B8%80%E4%B8%AA%E5%AD%A6%E6%9C%AF%E5%8A%A9%E6%89%8B%EF%BC%8C%E5%90%8E%E9%9D%A2%E7%9A%84%E5%AF%B9%E8%AF%9D%E5%B0%86%E5%9B%B4%E7%BB%95%E7%9D%80%E4%BB%A5%E4%B8%8B%E8%AE%BA%E6%96%87%E5%86%85%E5%AE%B9%E8%BF%9B%E8%A1%8C%EF%BC%8C%E5%B7%B2%E7%BB%8F%E9%80%9A%E8%BF%87%E9%93%BE%E6%8E%A5%E7%BB%99%E5%87%BA%E4%BA%86%E8%AE%BA%E6%96%87%E7%9A%84PDF%E5%92%8C%E8%AE%BA%E6%96%87%E5%B7%B2%E6%9C%89%E7%9A%84FAQ%E3%80%82%E7%94%A8%E6%88%B7%E5%B0%86%E7%BB%A7%E7%BB%AD%E5%90%91%E4%BD%A0%E5%92%A8%E8%AF%A2%E8%AE%BA%E6%96%87%E7%9A%84%E7%9B%B8%E5%85%B3%E9%97%AE%E9%A2%98%EF%BC%8C%E8%AF%B7%E4%BD%A0%E4%BD%9C%E5%87%BA%E4%B8%93%E4%B8%9A%E7%9A%84%E5%9B%9E%E7%AD%94%EF%BC%8C%E4%B8%8D%E8%A6%81%E5%87%BA%E7%8E%B0%E7%AC%AC%E4%B8%80%E4%BA%BA%E7%A7%B0%EF%BC%8C%E5%BD%93%E6%B6%89%E5%8F%8A%E5%88%B0%E5%88%86%E7%82%B9%E5%9B%9E%E7%AD%94%E6%97%B6%EF%BC%8C%E9%BC%93%E5%8A%B1%E4%BD%A0%E4%BB%A5markdown%E6%A0%BC%E5%BC%8F%E8%BE%93%E5%87%BA%E3%80%82&send_immediately=true) — Coding Agent 终止滞后的实证量化（2026-11）
2. [guardscope: Measuring Which Actions Runtime Controls Check in LLM Agent Systems](https://arxiv.org/abs/2611.15223) [Kimi解读](http://kimi.com/_prefill_chat?prefill_prompt=%E6%88%91%E4%BB%AC%E8%A6%81%E8%AE%A8%E8%AE%BA%E7%9A%84%E8%AE%BA%E6%96%87%E6%98%AF2611.15223%EF%BC%8C%E9%93%BE%E6%8E%A5%E6%98%AF%20https%3A//arxiv.org/pdf/2611.15223%20%EF%BC%8C%E5%B7%B2%E6%9C%89%E7%9A%84FAQ%E9%93%BE%E6%8E%A5%E6%98%AF%20https%3A//papers.cool/arxiv/kimi%3Fpaper%3D2611.15223%20%E3%80%82%E8%AF%B7%E4%BB%A5%E6%AD%A4%E4%B8%BA%E5%9F%BA%E7%A1%80%EF%BC%8C%E7%BB%A7%E7%BB%AD%E5%9B%9E%E7%AD%94%E6%88%91%E5%90%8E%E9%9D%A2%E7%9A%84%E9%97%AE%E9%A2%98%E3%80%82&system_prompt=%E4%BD%A0%E6%98%AF%E4%B8%80%E4%B8%AA%E5%AD%A6%E6%9C%AF%E5%8A%A9%E6%89%8B%EF%BC%8C%E5%90%8E%E9%9D%A2%E7%9A%84%E5%AF%B9%E8%AF%9D%E5%B0%86%E5%9B%B4%E7%BB%95%E7%9D%80%E4%BB%A5%E4%B8%8B%E8%AE%BA%E6%96%87%E5%86%85%E5%AE%B9%E8%BF%9B%E8%A1%8C%EF%BC%8C%E5%B7%B2%E7%BB%8F%E9%80%9A%E8%BF%87%E9%93%BE%E6%8E%A5%E7%BB%99%E5%87%BA%E4%BA%86%E8%AE%BA%E6%96%87%E7%9A%84PDF%E5%92%8C%E8%AE%BA%E6%96%87%E5%B7%B2%E6%9C%89%E7%9A%84FAQ%E3%80%82%E7%94%A8%E6%88%B7%E5%B0%86%E7%BB%A7%E7%BB%AD%E5%90%91%E4%BD%A0%E5%92%A8%E8%AF%A2%E8%AE%BA%E6%96%87%E7%9A%84%E7%9B%B8%E5%85%B3%E9%97%AE%E9%A2%98%EF%BC%8C%E8%AF%B7%E4%BD%A0%E4%BD%9C%E5%87%BA%E4%B8%93%E4%B8%9A%E7%9A%84%E5%9B%9E%E7%AD%94%EF%BC%8C%E4%B8%8D%E8%A6%81%E5%87%BA%E7%8E%B0%E7%AC%AC%E4%B8%80%E4%BA%BA%E7%A7%B0%EF%BC%8C%E5%BD%93%E6%B6%89%E5%8F%8A%E5%88%B0%E5%88%86%E7%82%B9%E5%9B%9E%E7%AD%94%E6%97%B6%EF%BC%8C%E9%BC%93%E5%8A%B1%E4%BD%A0%E4%BB%A5markdown%E6%A0%BC%E5%BC%8F%E8%BE%93%E5%87%BA%E3%80%82&send_immediately=true) — 运行时控制覆盖率的首次可测量框架（2026-11）
3. Anthropic《Building effective agents》— 官方对 guardrails 与预算控制的工程建议
4. OpenHands / SWE-agent 源码中的 `max_iterations` 与成本追踪实现 — 工业界 Guard 的参考实现
5. Day 53《Test / Debug Loop：Agent 的自我修正》— 本日内容的直接前置

（明日 Day 55 预告：Agent Harness V0：系统整合——把四周的散件 Model、Runtime、Context、Tool Runtime、Environment、Sandbox 拼成一个 `harness.run(task)` 就能跑的系统。）

---

## 📋 本日知识点清单

- [ ] Coding Agent 六种故障模式（死循环/错误修改/测试失败/Tool失败/输出非法/超过Step）
- [ ] 四类资源 Guard：max_steps / max_runtime / max_cost / max_tool_calls
- [ ] Agent Guard 的实现要点（迭代开头检查、usage 计费、stopped_by 结构化返回）
- [ ] 打转检测：动作序列哈希 + 重复熔断
- [ ] 护栏最小主义：不需要巨大 Safety Framework
- [ ] Termination Lag：解得早停得晚的终止判断问题

## 📝 实践练习

实现 Agent Guard（max_steps/max_runtime/max_cost/max_tool_calls），测试各种故障场景。

---

*本文是「AI Agent 工程师」6 个月学习计划的一部分。学习路线：LLM → Inference → Runtime → Harness → Memory → Environment → Evaluation → Production。目标：Agent / AI Systems Engineer。*
