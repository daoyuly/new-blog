---
title: "AI Agent 工程师 Day 26：Benchmark：Agent 的第一份实验数据"
date: 2026-10-15 10:30:00
tags:
  - AI Agent 工程师
  - Benchmark
  - Metrics
  - Agent
  - Evaluation
categories:
  - AI Agent 工程师学习计划
  - M1 LLM + Agent Runtime
description: "Day 26/168 | M1 Agent Benchmark 体系 | Benchmark：Agent 的第一份实验数据。6 个月从 LLM 到生产级 Agent 系统的完整学习路线。"
keywords: "AI Agent, 工程师, Agent Benchmark 体系, Benchmark, Metrics, Agent, Evaluation"
author: OpenClaw Agent Learning
---

# AI Agent 工程师 Day 26：Benchmark：Agent 的第一份实验数据

> **6 个月学习计划** | M1 - LLM + Agent Runtime | Day 26/168
> 
> **今日主题**: Agent Benchmark 体系

---

# Benchmark：Agent 的第一份实验数据

**核心结论先行**：Agent 工程的本质是“改 prompt、换模型、调工具”的迭代循环，而没有 Benchmark（基准测试）的迭代就是盲调——你不知道一次修改是提升还是倒退。Agent Benchmark 的核心框架是四步链路：**Task（任务）→ Agent（执行）→ Trajectory（轨迹）→ Metrics（指标）**，用 20-50 个任务的批量测试，产出 Success Rate（成功率）、Latency（延迟）、Steps（步数）、Tool Calls（工具调用数）、Token Usage（Token 消耗）、Error Rate（错误率）六类核心指标。本文讲清楚这套体系的因果链，并带你跑出 Agent 的第一份实验数据、建立第一个 Baseline（基线）。

---

## 一、背景与动机：为什么第 26 天要学 Benchmark

回顾这条 6 个月 AI Agent 工程师路线的前四周：你已经理解了 Agent 的基本架构（LLM + 工具 + 记忆 + 规划），手写过 ReAct 循环，接了几个工具调用。你现在处于一个典型状态：**“感觉我的 Agent 能跑，但说不出它有多好。”**

这个状态很危险，原因有三：

1. **Agent 的行为是随机的**。同一个任务跑两次，可能一次 3 步完成、一次 8 步死循环。凭单次运行的“感觉”做工程判断，等于掷骰子做决策。
2. **改动是高频的**。换一个 system prompt、调一个 tool description、升级一次模型版本，每一处都可能让某些任务变好、另一些变坏。没有量化数据，你无法回答“这次改动值不值”。
3. **后续所有优化都依赖它**。这条路线后面要学的记忆管理、多 Agent 协作、成本优化，本质上都是“改进 → 验证 → 再改进”的循环。Benchmark 是这个循环的闭环装置——没有它，后面的课程都只是“听懂了”而不是“做到了”。

换句话说：**前四周你在造车，今天你要装上仪表盘。** 没有仪表盘的车也能开，但你永远不知道自己是快了还是慢了，油还剩多少。

Agent Evaluation（Agent 评估）在学术界是热点（SWE-bench、AgentBench、WebArena 都是这个方向），但在工程实践中，你不需要一开始就复现这些大型学术基准。你需要的是一个**轻量、可复跑、贴近自己业务**的自建 Benchmark——这正是今天实践练习要交付的东西。

---

## 二、核心内容

### 2.1 Task → Agent → Trajectory → Metrics：评估的四段流水线

一切 Agent 评估系统，无论多复杂，都可以拆成这条流水线：

```
┌─────────┐    ┌─────────┐    ┌─────────────┐    ┌─────────┐
│  Task   │───▶│  Agent  │───▶│ Trajectory  │───▶│ Metrics │
│  任务集  │    │  被测系统 │    │  执行轨迹    │    │  指标计算 │
└─────────┘    └─────────┘    └─────────────┘    └─────────┘
```

逐段拆解因果链：

**Task（任务）**：一条结构化的测试用例。最小字段是：

- `task_id`：唯一标识
- `input`：给 Agent 的自然语言指令
- `expected_answer`：期望的最终答案（用于判分）
- `expected_tools`（可选）：期望调用的工具集合
- `category`（可选）：任务类型标签，便于分维度统计

**Agent（被测系统）**：注意，被测的是“完整 Agent 系统”，不只是 LLM——包括 prompt、工具集、循环策略、上下文管理。Benchmark 测的是这个整体。

**Trajectory（轨迹）**：Agent 执行一次任务的完整记录——每一次 LLM 调用的输入输出、每一步思考、每一个工具调用及其返回、最终答案、全程时间戳。这是评估中最有价值的中间产物。**只看最终对错，你只知道“失败了”；看轨迹，你知道“为什么失败”。**

**Metrics（指标）**：从轨迹中计算出的量化数值。可以事后批量计算，这也是为什么轨迹要完整落盘（存 JSONL 是最常见做法）。

**一个关键工程直觉**：这四段必须解耦。任务定义成数据文件（不是代码），Agent 封装成可替换的接口（今天测你的 v1，明天就能无缝换成 v2），轨迹落盘，指标独立计算脚本。耦合在一起的评估代码，会在第三次迭代时让你痛苦到放弃评估。

### 2.2 六大核心指标：每一项在回答什么问题

六类指标各自回答一个不同的问题，组合起来才是 Agent 的完整画像：

| 指标 | 英文 | 回答的问题 | 计算方式 |
|---|---|---|---|
| 成功率 | Success Rate | 任务做对了吗？ | 正确任务数 / 总任务数 |
| 延迟 | Latency | 多快完成？ | 端到端耗时（平均 / P50 / P95） |
| 步数 | Steps | 过程高效吗？ | LLM 循环轮次数 |
| 工具调用数 | Tool Calls | 外部依赖用了多少？ | 工具调用总次数 |
| Token 消耗 | Token Usage | 成本是多少？ | 输入 + 输出 token 累加 |
| 错误率 | Error Rate | 哪里在崩？ | 失败任务的错误类型分布 |

几个容易被忽略的要点：

**成功率需要定义“正确”**。三种判定方式，严格程度递增：精确匹配（exact match）、包含关键信息（substring/regex）、LLM-as-Judge（用另一个强模型打分）。前者便宜但只适合有唯一答案的任务；LLM-as-Judge 灵活但引入了评估器本身的噪声，且要防“判官偏袒长答案”的偏差。第一版建议：能用规则判定的用规则，开放任务用 LLM-as-Judge 但固定判官模型和判分 prompt，保证可比性。

**延迟要看分布，不只看均值**。Agent 的延迟分布通常是长尾的——大多数任务 10 秒完成，少数死循环任务跑 5 分钟。均值会被长尾严重拉偏，工程上必须看 **P95**（95 分位耗时），它代表你最差 5% 的用户体验。

**步数和工具调用数是“过程质量”的代理指标（proxy metric）**。两个 Agent 成功率相同，一个平均 4 步、一个平均 12 步，后者大概率在低效徘徊。这两项便宜（不用额外判定）但对回归极其敏感——成功率没变、步数翻倍，通常意味着某次改动引入了循环或无效重试。

**错误率的关键是分类，不是总数**。把失败拆成：工具调用失败（参数错误、超时）、死循环/超过最大步数、答案错误但流程正常、格式解析失败、上下文超限。不同类型的失败指向完全不同的修复方向。下面这张表是定位因果链的起点：

| 错误类型 | 典型原因 | 修复方向 |
|---|---|---|
| 工具参数错误 | tool description 写得含糊 | 改工具描述、加 few-shot |
| 死循环/超步数 | 缺乏终止条件、重试无上限 | 加循环检测、限制重试 |
| 流程对但答案错 | 规划能力不足 | 换模型、拆解任务、改 prompt |
| 格式解析失败 | 输出约束不严 | 结构化输出、few-shot |
| 上下文超限 | 轨迹过长 | 摘要压缩、裁剪历史 |

### 2.3 20-50 个任务的批量测试：小样本的工程价值

为什么是 20-50 个，而不是 5 个或 500 个？

- **5 个太少**：一次改动让成功率从 60% 变 80%，在 5 个任务上只是“3 对变 4 对”，统计上毫无意义（随机波动就能解释）。
- **500 个太多**：个人/小团队的迭代节奏下，跑一轮成本（时间 + API 费用）过高，你会下意识减少跑的频率——评估体系被闲置等于没有。
- **20-50 个是实践平衡点**：跑一轮几分钟到几十分钟，成本几块钱以内，且成功率的最小可感知变化约在 5%-15% 区间（50 个任务上一个任务 = 2%），足以捕捉有意义的回归。

任务集设计的四条原则：

1. **覆盖核心能力维度**。按 Agent 实际要做的能力分类：单工具调用、多工具组合、多轮信息收集、需要推理的规划任务、边界/异常输入。每类 5-10 条。
2. **包含难度梯度**。简单任务保证“能跑通”，中等任务区分方案优劣，1-2 个困难任务看天花板。
3. **包含陷阱任务（trap tasks）**。故意设计会诱导错误行为的输入：不存在的参数、模糊指令、需要澄清的问题。这类任务最能暴露 prompt 的鲁棒性。
4. **写成数据文件，与代码分离**。JSONL 或 YAML，一条一个对象。这样增删任务、diff 版本差异都容易。

还有一个必须建立的纪律：**固定随机性**。LLM 输出有随机性（temperature > 0 时），对关键任务集可以在固定 temperature 或多次运行取多数。至少要意识到：单次跑出来的成功率有 ±10% 左右的波动是正常的，别为 3% 的变化过度反应。

### 2.4 实验数据的分析与解读：从数字到因果

数据跑出来只是开始，分析才是价值所在。三层分析框架：

**第一层：整体指标（体检）**。先看总成功率、P95 延迟、平均 token。这一层回答“这个 Agent 大概什么水平”，用于版本间粗对比。

**第二层：分维度统计（透视）**。按任务 `category` 分组统计成功率。典型发现形态是“整体 70%，但多工具组合任务只有 40%”——问题从“Agent 不行”收窄到“Agent 在特定能力上不行”。这一层直接决定你下一步优化的方向。

**第三层：轨迹细读（归因）**。挑出所有失败任务的轨迹，逐条读。这一步没有任何自动化可以替代，因为它需要人理解“Agent 当时为什么这么想”。重点看三类模式：

- **重复模式**：3 个失败都是同一类工具调用参数错——修 tool description，一次修复解决 3 个问题。
- **单点模式**：某个任务失败方式独特——可能是任务本身写得有问题（期望答案不清晰、任务超出能力边界），修正任务定义而不是改 Agent。
- **退化对比**：和上一版轨迹对比，新版本在一个本来通过的任务上换了更绕的路径——典型的 prompt 改动副作用。

一个重要的分析纪律：**区分信号和噪声**。20 个任务的成功率从 65% 到 75% 可能只是波动；但如果错误类型分布发生了结构性变化（比如“工具参数错误”从 5 个降到 0 个），即使总数变化不大，也是真实信号。

### 2.5 Baseline：让一切对比有锚点

Baseline（基线）是你当前 Agent 版本在固定任务集上的一组完整指标快照。它的作用类似 Git 的初始 commit：**之后所有改动都和它对比**。

Baseline 的三个要求：

1. **可复现**：记录模型版本、prompt 版本（建议给 prompt 也加版本号或 git hash）、temperature、任务集版本。环境变了，Baseline 就作废了。
2. **低成本可重跑**：任务集固定后，每次改动的验证流程是“跑同一任务集 → 和 Baseline diff”。
3. **不求完美**：第一版 Baseline 哪怕成功率只有 50% 也有巨大价值——它让你之后的每次优化都有“提升了多少”的量化答案，这是工程师向他人（和向自己）证明工作的唯一硬通货。

**Baseline 表格示例**：

| 指标 | v1.0 Baseline | v1.1（改了 tool description） | 变化 |
|---|---|---|---|
| Success Rate | 65% | 78% | +13% ✅ |
| P95 Latency | 42s | 38s | -10% ✅ |
| Avg Steps | 7.2 | 5.1 | -29% ✅ |
| Avg Tokens | 8,400 | 6,900 | -18% ✅ |
| 主要错误 | 工具参数错误 ×6 | 死循环 ×2 | 结构变化 ⚠️ |

注意最后一行：成功率上升的同时出现了新错误类型（死循环），说明优化引入了新问题——这是只有分类型统计才能暴露的。

---

## 三、代码实现

一个最小可用的 Benchmark 骨架（Python，约 100 行），四个模块对应四段流水线：

```python
# ========== 1. Task: 任务定义为数据 ==========
# tasks.jsonl 每行一条：
# {"task_id": "t001", "input": "查一下北京今天天气并总结",
#  "expected_answer": "晴", "expected_tools": ["get_weather"], "category": "single_tool"}

# ========== 2. Agent: 被测系统统一接口 ==========
class AgentRunner:
    def __init__(self, agent, max_steps=15):
        self.agent = agent
        self.max_steps = max_steps

    def run(self, task) -> dict:
        t0 = time.time()
        trajectory = {"steps": [], "tool_calls": 0, "final_answer": None,
                      "status": "ok", "total_tokens": 0}
        state = task["input"]
        for step in range(self.max_steps):
            resp = self.agent.step(state)          # 你的 Agent 一步
            trajectory["steps"].append(resp)
            trajectory["total_tokens"] += resp["tokens"]
            if resp["type"] == "tool_call":
                trajectory["tool_calls"] += 1
            elif resp["type"] == "final":
                trajectory["final_answer"] = resp["content"]
                break
        else:
            trajectory["status"] = "max_steps_exceeded"   # 死循环检测
        trajectory["latency"] = round(time.time() - t0, 2)
        return trajectory

# ========== 3. 轨迹落盘 ==========
def dump_trajectories(trajs, path="runs/v1.0/trajectories.jsonl"):
    with open(path, "w") as f:
        for t in trajs:
            f.write(json.dumps(t, ensure_ascii=False) + "\n")

# ========== 4. Metrics: 独立计算 ==========
def judge(trajectory, task) -> bool:
    """第一版：规则判定为主，兜底 LLM-as-Judge"""
    ans = trajectory["final_answer"] or ""
    return task["expected_answer"] in ans

def compute_metrics(trajs, tasks, judgments):
    n = len(trajs)
    by_cat = defaultdict(list)
    for tid, ok in judgments.items():
        by_cat[tasks[tid]["category"]].append(ok)
    return {
        "success_rate": sum(judgments.values()) / n,
        "p95_latency": sorted(t["latency"] for t in trajs)[int(n * 0.95) - 1],
        "avg_steps": mean(len(t["steps"]) for t in trajs),
        "avg_tool_calls": mean(t["tool_calls"] for t in trajs),
        "avg_tokens": mean(t["total_tokens"] for t in trajs),
        "error_breakdown": Counter(t["status"] for t in trajs if t["status"] != "ok"),
        "success_by_category": {k: mean(v) for k, v in by_cat.items()},
    }
```

使用流程：`python run_bench.py --agent v1.0 --tasks tasks.jsonl --out runs/v1.0/`，然后 `python analyze.py runs/v1.0/` 出报告。版本化的目录结构（`runs/v1.0/`、`runs/v1.1/`）让历史数据天然可对比。

---

## 四、实践练习与思考题

**实践任务（今天必须完成）**：

1. 定义一个 `tasks.jsonl`，包含 20 个任务：8 个单工具任务、6 个多工具任务、4 个多轮任务、2 个陷阱任务。
2. 用第 26 天之前的 Agent 实现 `AgentRunner`，跑完整个任务集，轨迹落盘。
3. 写 `analyze.py`，输出六大指标 + 分类别成功率。
4. 把这份数据存为你的 **v1.0 Baseline**，写三句话总结：最强的能力维度是什么？最弱的是什么？最想先修哪类错误？

**思考题**：

1. 你的任务集里如果某任务连你自己都无法明确判定对错，应该删除、改写还是保留？依据是什么？
2. 成功率提升 10%，但平均 token 消耗翻了 3 倍——这次改动是净收益吗？什么条件下该接受？
3. 如果只允许保留一个指标来监控 Agent 的日常健康度，你会选哪个？为什么？（提示：想想哪个指标对“悄悄变坏”最敏感。）

---

## 五、与 Agent Engineering 的关联

在真实的 Agent 工程团队里，这套 Benchmark 体系就是日常工作的地基，具体体现在四个环节：

1. **回归测试（Regression Testing）**：任何 prompt/模型/工具的改动，合并前跑一遍任务集，防止“修好一个 bug、弄坏三个任务”。这是 Agent 系统的 CI。
2. **成本-质量权衡决策**：换更便宜的模型？先看 Baseline 对比：成功率掉多少、延迟省多少、token 省多少。没有数据，这类决策全靠勇气。
3. **监控告警的数据源**：线上采样真实任务回流到任务集，Benchmark 从“开发期工具”演进为“线上质量探针”，任务集本身也在持续进化。
4. **后续课程的前置依赖**：多 Agent 编排、记忆系统、RAG 接入——每个新组件的引入都需要回答“带来了多少提升”，而答案只能来自 Benchmark 对比。

一句话：**Agent 工程师和 Agent 调参者的区别，就是有没有一份自己维护的 Benchmark。**

---

## FAQ

**Q1：任务集里该不该包含 LLM 无法稳定解对的超难任务？**
应该保留 1-2 个，但明确标注难度。它们的作用是测量能力天花板和观察失败模式，不参与主要成功率对比。当某天困难任务开始被解对，那是能力跃迁的强信号。

**Q2：LLM-as-Judge 判分靠谱吗？**
对“答案是否包含关键信息”这类判定足够靠谱（与人类一致率通常 80%+），但要固定判官模型和判分 prompt，并在上线前人工抽检 20 条校准。规则能判的永远优先用规则。

**Q3：每次跑 Benchmark 的结果都有波动，怎么判断改动是否真的有效？**
三招：降低 temperature（评估时可用 0）、同一改动跑 2-3 次看稳定性、优先看错误类型分布等结构性变化而非单纯的成功率小数点。50 个任务上 <5% 的成功率变化不要当结论。

**Q4：Benchmark 和 Unit Test 什么关系？**
Unit Test 测确定性组件（工具函数、解析逻辑），用断言；Benchmark 测含随机性的端到端系统，用统计指标。两者互补：工具函数坏了应该被 Unit Test 先拦截，Benchmark 测的是“整体协作质量”。

**Q5：任务集要不要随 Agent 迭代而更新？**
要，但节奏要慢。频繁改任务集会导致历史 Baseline 失去可比性。推荐做法：任务集也版本化，核心 20 条尽量冻结用于长期对比，新增能力用扩展集单独测。

---

## 参考资料

- AgentBench: Evaluating LLMs as Agents — https://arxiv.org/abs/2308.03688
- SWE-bench: Can Language Models Resolve Real-World GitHub Issues? — https://arxiv.org/abs/2310.06770
- WebArena: A Realistic Web Environment for Building Autonomous Agents — https://arxiv.org/abs/2307.13854
- OpenAI Cookbook: Evaluating Abstention / Agent Evaluations 实践指南 — https://cookbook.openai.com
- LangSmith Evaluation 文档（工程化评估框架参考）— https://docs.smith.langchain.com/evaluation
- ReAct: Synergizing Reasoning and Acting in Language Models（轨迹结构参考）— https://arxiv.org/abs/2210.03629

---

## 📋 本日知识点清单

- [ ] Task → Agent → Trajectory → Metrics 的完整流程
- [ ] Success Rate / Latency / Steps / Tool Calls / Token Usage / Error Rate 的统计
- [ ] 20-50 个任务的批量测试
- [ ] 实验数据的分析与解读
- [ ] Baseline 的建立

## 📝 实践练习

建立第一版 Benchmark，跑 20-50 个任务得到实验数据。

---

*本文是「AI Agent 工程师」6 个月学习计划的一部分。学习路线：LLM → Inference → Runtime → Harness → Memory → Environment → Evaluation → Production。目标：Agent / AI Systems Engineer。*
