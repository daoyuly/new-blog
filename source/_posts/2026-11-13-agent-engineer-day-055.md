---
title: "AI Agent 工程师 Day 55：Agent Harness V0：系统整合"
date: 2026-11-13 10:30:00
tags:
  - AI Agent 工程师
  - Harness
  - 整合
  - Agent
  - 架构
categories:
  - AI Agent 工程师学习计划
  - M2 Agent Harness + Tool + Environment
description: "Day 55/168 | M2 Harness 初版 | Agent Harness V0：系统整合。6 个月从 LLM 到生产级 Agent 系统的完整学习路线。"
keywords: "AI Agent, 工程师, Harness, 系统整合, 架构, Runtime"
author: OpenClaw Agent Learning
---

# AI Agent 工程师 Day 55：Agent Harness V0：系统整合

> **6 个月学习计划** | M2 - Agent Harness + Tool + Environment | Day 55/168
> 
> **今日主题**: Harness 初版

---

# Agent Harness V0：系统整合

**核心结论先行**：过去四周我们造了一堆散件——能对话的 Model 封装、能循环的 Runtime、能读写的 Tool、能隔离的 Sandbox、能自我修正的 Debug Loop、能熔断的 Guard。今天把它们全部拼进一个系统：**Agent Harness V0**，对外只暴露一个入口 `harness.run(task)`。判断整合是否成功的标准只有一个：**你能否用一行代码描述「从任务到结果」的完整路径**。这一步完成后，你手里就有了一个最小但完整的 Agent 底座——M3 的 Memory、M4 的推理服务、M5 的评估、M6 的生产化，全都以它为基座生长，而不是推倒重来。

---

## 一、背景与动机：为什么第 55 天要做整合

先盘点一下 M2 四周的存货：

- **第 1 周**：LLM API 封装（重试、超时、结构化输出）、Agent 主循环（while True: model → tool_call → execute → observe）
- **第 2 周**：Tool Runtime（注册表、参数校验、白名单）、Sandbox（文件系统隔离、命令执行边界）
- **第 3 周**：Context 组装（system prompt、任务描述、工具定义、消息历史）
- **第 4 周**：Test / Debug Loop（Day 53）、Guard 防熔断（Day 54）

问题在哪？**这些散件目前只存在于你的多次实验里，彼此的接口没有被一个统一的壳固定下来**。你有一个跑通的循环 A、一个带 Guard 的循环 B、一个能跑测试的循环 C——但「一个 task 字符串进来，走完 Model → Context → Tool → Sandbox → Debug Loop → Guard 的完整链路，返回结构化结果」这条路径，还没有被一行代码固化。

这就是 Harness 的定义：**包裹在模型外面的执行骨架**。2026 年 11 月的 [EvoX: Rethinking the Agent Harness as a Runtime Policy](https://arxiv.org/abs/2611.15006) [Kimi解读](http://kimi.com/_prefill_chat?prefill_prompt=%E6%88%91%E4%BB%AC%E8%A6%81%E8%AE%A8%E8%AE%BA%E7%9A%84%E8%AE%BA%E6%96%87%E6%98%AF2611.15006%EF%BC%8C%E9%93%BE%E6%8E%A5%E6%98%AF%20https%3A//arxiv.org/pdf/2611.15006%20%EF%BC%8C%E5%B7%B2%E6%9C%89%E7%9A%84FAQ%E9%93%BE%E6%8E%A5%E6%98%AF%20https%3A//papers.cool/arxiv/kimi%3Fpaper%3D2611.15006%20%E3%80%82%E8%AF%B7%E4%BB%A5%E6%AD%A4%E4%B8%BA%E5%9F%BA%E7%A1%80%EF%BC%8C%E7%BB%A7%E7%BB%AD%E5%9B%9E%E7%AD%94%E6%88%91%E5%90%8E%E9%9D%A2%E7%9A%84%E9%97%AE%E9%A2%98%E3%80%82&system_prompt=%E4%BD%A0%E6%98%AF%E4%B8%80%E4%B8%AA%E5%AD%A6%E6%9C%AF%E5%8A%A9%E6%89%8B%EF%BC%8C%E5%90%8E%E9%9D%A2%E7%9A%84%E5%AF%B9%E8%AF%9D%E5%B0%86%E5%9B%B4%E7%BB%95%E7%9D%80%E4%BB%A5%E4%B8%8B%E8%AE%BA%E6%96%87%E5%86%85%E5%AE%B9%E8%BF%9B%E8%A1%8C%EF%BC%8C%E5%B7%B2%E7%BB%8F%E9%80%9A%E8%BF%87%E9%93%BE%E6%8E%A5%E7%BB%99%E5%87%BA%E4%BA%86%E8%AE%BA%E6%96%87%E7%9A%84PDF%E5%92%8C%E8%AE%BA%E6%96%87%E5%B7%B2%E6%9C%89%E7%9A%84FAQ%E3%80%82%E7%94%A8%E6%88%B7%E5%B0%86%E7%BB%A7%E7%BB%AD%E5%90%91%E4%BD%A0%E5%92%A8%E8%AF%A2%E8%AE%BA%E6%96%87%E7%9A%84%E7%9B%B8%E5%85%B3%E9%97%AE%E9%A2%98%EF%BC%8C%E8%AF%B7%E4%BD%A0%E4%BD%9C%E5%87%BA%E4%B8%93%E4%B8%9A%E7%9A%84%E5%9B%9E%E7%AD%94%EF%BC%8C%E4%B8%8D%E8%A6%81%E5%87%BA%E7%8E%B0%E7%AC%AC%E4%B8%80%E4%BA%BA%E7%A7%B0%EF%BC%8C%E5%BD%93%E6%B6%89%E5%8F%8A%E5%88%B0%E5%88%86%E7%82%B9%E5%9B%9E%E7%AD%94%E6%97%B6%EF%BC%8C%E9%BC%93%E5%8A%B1%E4%BD%A0%E4%BB%A5markdown%E6%A0%BC%E5%BC%8F%E8%BE%93%E5%87%BA%E3%80%82&send_immediately=true) 给了一个精准的概念模型：基础模型提供的是**语义策略**（决定「做什么」），Harness 提供的是**操作策略**（保证「确实做成」）——模型决策合理不等于执行成功，中间的工具调用失配、流程中断、虚报完成，全靠 Harness 这层运行时策略兜住。今天的整合，就是把这句话变成你自己的代码。

从学习曲线上说，今天也是 M2 的收官预演：明天 Day 56 拿 10 个 Coding Tasks 做月度验收，**验收对象不是某个散件，而是今天整合出来的这个 V0**。

---

## 二、核心内容

### 2.1 V0 的完整架构：六个组件一张图

```
                        ┌─────────────────────────────────────────┐
                        │            harness.run(task)            │  ← 唯一入口
                        └───────────────────┬─────────────────────┘
                                            │
          ┌─────────────────────────────────┼─────────────────────────────────┐
          │                                 │                                 │
          ▼                                 ▼                                 ▼
 ┌────────────────┐              ┌──────────────────┐              ┌──────────────────┐
 │  1. Context    │              │   2. Model       │              │  3. Tool Runtime │
 │  组装层         │              │   语义策略层      │              │  操作策略层       │
 │                │              │                  │              │                  │
 │ system prompt  │──组装──────▶ │  LLM API 封装    │ ──tool_call─▶│ 注册表 / 校验     │
 │ 任务 / 工具定义 │              │  重试 / 结构化输出│              │ 白名单 / 分发     │
 │ 消息历史        │              │  多模型路由       │              │                  │
 └────────────────┘              └──────────────────┘              └────────┬─────────┘
       ▲                                  ▲                                 │
       │           观察结果回填             │        执行结果                  ▼
       │      ┌───────────────────────────┘                                 ▼
       │      │                                                    ┌──────────────┐
  ┌────┴──────┴──┐                                                  │ 4. Sandbox   │
  │ 6. Guard     │   步数/时间/费用/调用 熔断                          │ 环境隔离层    │
  │ 资源护栏层    │◀──每次迭代检查───────────                          │ 文件系统边界  │
  └──────┬───────┘                                                  │ 命令执行边界  │
         │                                                          └──────┬───────┘
         ▼                                                                 │
  ┌────────────────┐        测试失败信号                                    │
  │ 5. Debug Loop  │◀────────────────────────────────────────────────────┘
  │ 自我修正层      │   Run Test → Read Error → Locate → Fix → Run Test
  └────────────────┘
```

六个组件、一个入口、单向主数据流（Context → Model → Tool → Sandbox）加两条反馈回路（观察回填、测试失败信号）。这就是 V0 的全部——**没有更多了**。V0 的美德在于克制：任何「以后再加」的冲动（记忆、规划、多智能体）都应该等到 M3+，今天的任务是把这条主干跑通。

### 2.2 `harness.run(task)`：统一入口的契约设计

入口的价值在于**契约**。调用方给一个 task 字符串，拿回一个结构化结果，中间的一切都是 Harness 的内政：

```python
result = harness.run(task="修复 src/utils.py 里的除零 bug 并跑通测试")

# result 的契约（V0 固定这五个字段）:
# {
#   "ok": True,                    # 任务是否成功
#   "steps": 7,                    # 实际执行步数
#   "cost_usd": 0.083,             # 实际花费
#   "stopped_by": "task_complete", # 终止原因: task_complete | max_steps | spin_detected | ...
#   "artifacts": ["patch.diff", "test_report.txt"]  # 产出物清单
# }
```

三个设计判断值得强调：

**第一，`stopped_by` 是契约的一等公民**。Day 54 讲过，熔断是正常出口不是事故——调用方必须能区分「做完了」「预算用尽」「打转被杀」，否则重试策略和成本归因都无从谈起。

**第二，产出一律落盘为 artifacts**。不要返回大段文本塞满 `result`——patch 写成文件、测试结果写成报告，`result` 只带路径。这是后面 M5 评估（对比 artifacts）和 M6 生产化（交付物管理）的伏笔。

**第三，Harness 内部共享一份 `RunState`**。步数、费用、消息历史、工具调用记录，六个组件读写同一份状态对象——Guard 看它的资源计数，Debug Loop 看它的测试信号，Context 组装看它的消息历史。状态不共享，整合就退回到散件互传参数的泥潭。

### 2.3 从散件到系统：整合中最容易翻车的三处

**翻车点一：Context 组装与消息历史的边界**。最容易犯的错是「全量历史 + 全量工具定义」每步都塞给模型，跑十步后 token 成本翻几倍。V0 的正确姿势：system prompt 和工具定义是**静态层**（每步相同，利于 prompt cache），消息历史是**动态层**（追加式增长），未来 M3 的 Context Engineering 会替换掉动态层的朴素策略，但 V0 先把这两层分开，接口就留好了。

**翻车点二：Debug Loop 与主循环的控制权冲突**。Debug Loop 是「循环里的循环」——测试失败后 Agent 在里面打转，外面的主循环 step 计数还在走。整合时要想清楚：Debug Loop 的每一次 Fix-Retry 算不算一个 step？答案：**算**。所有循环共享同一个 RunState 的步数计数，Guard 的熔断覆盖一切嵌套循环——否则嵌套循环就是 Guard 的盲区（Day 54 的 `max_tool_calls` 分开计数同理）。

**翻车点三：Sandbox 的生命周期**。task 开始时创建隔离环境，结束时销毁还是保留？V0 的答案：**成功则保留（方便取 artifacts），失败也保留（方便 post-mortem），但由调用方显式清理**。隐式清理是调试杀手——你最需要看现场的时候，现场没了。

### 2.4 Harness 作为 M3-M6 的基座：为什么值得认真拼

接下来四个月的一切，都长在今天的 V0 上：

- **M3 Context / Memory / Retrieval** → 替换 2.3 里的「朴素动态层」，长期记忆挂进 Context 组装层
- **M4 GPU / Inference / Serving** → 替换 Model 层的实现（本地推理服务、量化模型），接口不变
- **M5 Evaluation** → `harness.run()` 的结构化结果直接就是评估输入；Benchmark 就是批量调 `run()` + 统计
- **M6 Production** → Guard 的熔断信号接告警；artifacts 接交付流水线；RunState 接观测系统

这就是「Harness 先行」的复利：**接口定下来，四个后续模块都是局部换件，不是重构**。反过来的路径（先做应用再补 Harness）每加一个能力都要动全身——这也是为什么 OpenHands、SWE-agent 这类头部开源 Coding Agent，代码组织的第一层目录就是 Harness 的组件层。

### 2.5 一个自我检验：EvoX 的「第二策略」视角

拿刚提到的 EvoX 论文当镜子照一照自己的 V0：它提出 Harness 的三类机制——**Action Realization**（动作实现：把模型的 tool_call 变成确定性的执行，失败可见）、**Execution Continuity**（执行连续性：中断可恢复、上下文不丢）、**Outcome Verification**（结果验证：完成声明必须被检查）。

对照 V0：Action Realization ≈ 你的 Tool Runtime + Sandbox；Outcome Verification ≈ 你的 Debug Loop（测试通过才算完成）；Execution Continuity 是 V0 的短板——进程崩了 RunState 就没了。**承认这个短板并写进 V0 的 known issues**，比假装它不存在更工程。这也是 M6 才补的课，今天不用做，但要知道。

---

## 三、代码实现：`harness.run(task)` 的完整骨架

约 80 行 Python，把四周散件接到一个入口上（各组件用前几天的实现，此处只写装配层）：

```python
from dataclasses import dataclass, field
from typing import Callable

@dataclass
class RunState:
    task: str
    messages: list = field(default_factory=list)
    steps: int = 0
    tool_calls: int = 0
    cost_usd: float = 0.0
    artifacts: list = field(default_factory=list)
    stopped_by: str = "running"

class HarnessV0:
    def __init__(self, model, tools: dict, sandbox, debug_loop=None,
                 guard_config=None, system_prompt=""):
        self.model = model            # Day 29+: LLM 封装（含重试/结构化输出）
        self.tools = tools            # Day 36+: {name: callable}，白名单即字典的 keys
        self.sandbox = sandbox        # Day 43+: 沙箱（文件系统+命令边界）
        self.debug_loop = debug_loop  # Day 53: Test/Debug Loop（可选注入）
        self.guard_cfg = guard_config # Day 54: GuardConfig
        self.system_prompt = system_prompt or "You are a coding agent. Use tools to complete the task."

    def run(self, task: str) -> dict:
        st = RunState(task=task)
        self.sandbox.setup()                    # 建隔离环境
        seen_spins = set()
        try:
            st.messages = [
                {"role": "system", "content": self.system_prompt},
                {"role": "user", "content": task},
            ]
            while True:
                # ① Guard：每次迭代开头检查（Day 54 的 check_guards）
                tripped = self._check_guards(st, seen_spins)
                if tripped:
                    st.stopped_by = tripped
                    return self._finish(st)

                # ② Model：语义策略层
                resp = self.model.chat(st.messages, tools=self.tools.values())
                st.cost_usd += resp.cost_usd

                # ③ Tool：操作策略层（在 Sandbox 内执行）
                if resp.tool_call:
                    st.tool_calls += 1
                    obs = self._execute_in_sandbox(resp.tool_call)
                    st.messages.append(obs)      # 观察结果回填动态层
                    continue

                # ④ 无工具调用 = 模型声明完成 → Debug Loop 验证（Outcome Verification）
                if self.debug_loop:
                    ok, report = self.debug_loop.verify(st)
                    st.artifacts.append(report)
                    if not ok:
                        st.messages.append(self.debug_loop.failure_note(report))
                        continue                 # 验证失败，回到循环继续修
                st.stopped_by = "task_complete"
                return self._finish(st)
        finally:
            pass  # Sandbox 保留现场，由调用方显式清理（见 2.3 翻车点三）

    def _execute_in_sandbox(self, tool_call):
        fn = self.tools.get(tool_call.name)
        if fn is None:
            return {"role": "tool", "content": f"ERROR: unknown tool {tool_call.name}"}
        return {"role": "tool", "content": str(self.sandbox.run(fn, tool_call.args))}

    def _check_guards(self, st, seen):
        # 复用 Day 54 的 check_guards 逻辑，触发时返回原因字符串
        ...

    def _finish(self, st) -> dict:
        return {"ok": st.stopped_by == "task_complete", "steps": st.steps,
                "cost_usd": st.cost_usd, "stopped_by": st.stopped_by,
                "artifacts": st.artifacts}

# 使用方式——一行描述完整路径：
# result = HarnessV0(model, tools, sandbox, debug_loop).run("修复 src/utils.py 的除零 bug")
```

读代码时注意装配层的三个「接缝」：`_check_guards` 复用 Day 54、`debug_loop.verify()` 复用 Day 53、`model.chat()` 复用 M1——**V0 没有新算法，只有新装配**。这正是系统整合的本质：难度不在写代码，在定接缝。

---

## 四、实践练习与思考题

**实践（今日必做）**：把四周的散件真正装配成一个可运行的 `HarnessV0`，跑通这个验收用例：

```python
harness = HarnessV0(model=my_model, tools={...}, sandbox=my_sandbox,
                    debug_loop=my_debug_loop)
result = harness.run("在 /workspace 创建 hello.py，实现 add(a,b)，并写测试验证")
assert result["ok"] and result["stopped_by"] == "task_complete"
```

**思考题**：
1. 如果两个 `harness.run()` 并发执行，RunState / Sandbox 各需要几份？哪些组件天然无状态可以共享？（这是 M6 多租户的雏形）
2. `stopped_by: "max_steps"` 的运行，artifacts 里可能有价值的中间产物。V0 该不该把它们算进 `result["artifacts"]`？调用方怎么用？
3. EvoX 的 Execution Continuity 在 V0 里缺失。如果只允许你加 20 行代码补一个最简版（崩溃后能恢复），你会持久化 RunState 的哪些字段？

---

## 五、与 Agent Engineering 的关联

- **里程碑意义**：今天完成的是从「会写 Agent 组件」到「会装配 Agent 系统」的跨越。面试里「描述你的 Agent 架构」这类问题，从今天起你的回答是一张六组件架构图 + 一个 `run()` 契约，而不是一堆零散的 API 调用经历。
- **与整个系列的呼应**：本站早前的[《从提示词到图：AI 应用工程的六次范式跃迁》](https://www.daoyuly.cn/2026/2026-11-06-ai-app-paradigm-evolution/)把 Harness 列为六层范式的第三层——今天你亲手把它从概念变成了 80 行可运行的骨架；EvoX 则代表了这个方向的前沿：Harness 不是脚手架，而是与模型并列的一等策略公民。
- **明天的验收**：Day 56 用 10 个 Coding Tasks 对 V0 做基准测试，产出 Task Success Rate / First-pass Success / Average Steps / Token Cost 等指标——你第一次拥有「自己系统的量化画像」。

---

## FAQ

**Q1：V0 该不该支持多模型路由（简单任务用小模型）？**
接口上预留（Model 层本来就是可替换的），实现上别做。V0 的原则是主干跑通；路由策略需要成本/质量数据做依据，而数据要等 Day 56 的 Benchmark——顺序不能反。

**Q2：为什么 Debug Loop 是可选注入而不是必选？**
有些任务没有可运行的测试（比如改配置文件）。Debug Loop 的 `verify()` 在无测试场景应当退化为「语法检查/静态检查」级别的轻验证。V0 允许不注入，是承认任务谱系的存在，不是偷懒。

**Q3：RunState 和 Guard 的关系再确认一下？**
RunState 是「事实」——记录发生了什么；Guard 是「规则」——基于事实决定要不要终止。Guard 读 RunState 但不写它（除了触发 stopped_by）。保持这个单向依赖，未来加重试策略、加观测都不会打架。

**Q4：我的散件和这个架构对不上，要不要推倒重写？**
不要。对照 2.1 的架构图找出「缺的组件」和「接口不一致的接缝」，逐个改接口套进来。重写的冲动通常来自「架构洁癖」，而 V0 的价值恰恰在于证明你的旧件能在新骨架里活下来——这本身就是一次真实的迁移演练。

---

## 参考资料

1. [EvoX: Rethinking the Agent Harness as a Runtime Policy](https://arxiv.org/abs/2611.15006) [Kimi解读](http://kimi.com/_prefill_chat?prefill_prompt=%E6%88%91%E4%BB%AC%E8%A6%81%E8%AE%A8%E8%AE%BA%E7%9A%84%E8%AE%BA%E6%96%87%E6%98%AF2611.15006%EF%BC%8C%E9%93%BE%E6%8E%A5%E6%98%AF%20https%3A//arxiv.org/pdf/2611.15006%20%EF%BC%8C%E5%B7%B2%E6%9C%89%E7%9A%84FAQ%E9%93%BE%E6%8E%A5%E6%98%AF%20https%3A//papers.cool/arxiv/kimi%3Fpaper%3D2611.15006%20%E3%80%82%E8%AF%B7%E4%BB%A5%E6%AD%A4%E4%B8%BA%E5%9F%BA%E7%A1%80%EF%BC%8C%E7%BB%A7%E7%BB%AD%E5%9B%9E%E7%AD%94%E6%88%91%E5%90%8E%E9%9D%A2%E7%9A%84%E9%97%AE%E9%A2%98%E3%80%82&system_prompt=%E4%BD%A0%E6%98%AF%E4%B8%80%E4%B8%AA%E5%AD%A6%E6%9C%AF%E5%8A%A9%E6%89%8B%EF%BC%8C%E5%90%8E%E9%9D%A2%E7%9A%84%E5%AF%B9%E8%AF%9D%E5%B0%86%E5%9B%B4%E7%BB%95%E7%9D%80%E4%BB%A5%E4%B8%8B%E8%AE%BA%E6%96%87%E5%86%85%E5%AE%B9%E8%BF%9B%E8%A1%8C%EF%BC%8C%E5%B7%B2%E7%BB%8F%E9%80%9A%E8%BF%87%E9%93%BE%E6%8E%A5%E7%BB%99%E5%87%BA%E4%BA%86%E8%AE%BA%E6%96%87%E7%9A%84PDF%E5%92%8C%E8%AE%BA%E6%96%87%E5%B7%B2%E6%9C%89%E7%9A%84FAQ%E3%80%82%E7%94%A8%E6%88%B7%E5%B0%86%E7%BB%A7%E7%BB%AD%E5%90%91%E4%BD%A0%E5%92%A8%E8%AF%A2%E8%AE%BA%E6%96%87%E7%9A%84%E7%9B%B8%E5%85%B3%E9%97%AE%E9%A2%98%EF%BC%8C%E8%AF%B7%E4%BD%A0%E4%BD%9C%E5%87%BA%E4%B8%93%E4%B8%9A%E7%9A%84%E5%9B%9E%E7%AD%94%EF%BC%8C%E4%B8%8D%E8%A6%81%E5%87%BA%E7%8E%B0%E7%AC%AC%E4%B8%80%E4%BA%BA%E7%A7%B0%EF%BC%8C%E5%BD%93%E6%B6%89%E5%8F%8A%E5%88%B0%E5%88%86%E7%82%B9%E5%9B%9E%E7%AD%94%E6%97%B6%EF%BC%8C%E9%BC%93%E5%8A%B1%E4%BD%A0%E4%BB%A5markdown%E6%A0%BC%E5%BC%8F%E8%BE%93%E5%87%BA%E3%80%82&send_immediately=true) — Harness 即运行时策略、三类机制的参考架构（2026-11）
2. Anthropic《Building effective agents》— 「orchestrator 与组件边界」一节，V0 的组件切分参照
3. OpenHands / SWE-agent 源码的顶层目录组织 — 真实开源 Harness 的组件层划分
4. 本站《[从提示词到图：AI 应用工程的六次范式跃迁](https://www.daoyuly.cn/2026/2026-11-06-ai-app-paradigm-evolution/)》— Harness 在 AI 应用工程范式谱系中的位置
5. Day 53《Test / Debug Loop》与 Day 54《防死循环与安全护栏》— V0 直接装配的两块核心散件

（明日 Day 56 预告：M2 最终验收——用 10 个 Coding Tasks 给你的 Harness V0 建立第一份 Benchmark 画像。）

---

## 📋 本日知识点清单

- [ ] Model + Runtime + Context + Tool Runtime + Environment + Sandbox 的完整整合
- [ ] `harness.run(task)` 统一入口的五字段契约（ok/steps/cost/stopped_by/artifacts）
- [ ] 六组件架构图与两条反馈回路
- [ ] 整合三大翻车点：静态/动态层分离、嵌套循环共享步数、Sandbox 生命周期
- [ ] Harness 作为 M3-M6 基座：接口先行、局部换件
- [ ] EvoX 第二策略：Action Realization / Execution Continuity / Outcome Verification

## 📝 实践练习

整合 Agent Harness V0，实现 `harness.run(task)` 入口。

---

*本文是「AI Agent 工程师」6 个月学习计划的一部分。学习路线：LLM → Inference → Runtime → Harness → Memory → Environment → Evaluation → Production。目标：Agent / AI Systems Engineer。*
