---
title: "AI Agent 工程师 Day 53：Test / Debug Loop：Agent 的自我修正"
date: 2026-11-11 10:30:00
tags:
  - AI Agent 工程师
  - Test
  - Debug
  - Coding Agent
  - Loop
categories:
  - AI Agent 工程师学习计划
  - M2 Agent Harness + Tool + Environment
description: "Day 53/168 | M2 测试调试循环 | Test / Debug Loop：Agent 的自我修正。6 个月从 LLM 到生产级 Agent 系统的完整学习路线。"
keywords: "AI Agent, 工程师, 测试调试循环, Test, Debug, Coding Agent, Loop"
author: OpenClaw Agent Learning
---

# AI Agent 工程师 Day 53：Test / Debug Loop：Agent 的自我修正

> **6 个月学习计划** | M2 - Agent Harness + Tool + Environment | Day 53/168
> 
> **今日主题**: 测试调试循环

---

# Test / Debug Loop：Agent 的自我修正

**核心结论先行**：一个 Coding Agent 真正的门槛不是"能写代码"，而是"能修代码"。Test / Debug Loop（测试调试循环）是 Agent 从一次性生成器进化为自我修正系统的分水岭——它的本质是把"测试失败信息"作为一种反馈信号注入 Agent 的决策循环，让 Agent 通过 Run Test → Failure → Read Error → Locate → Fix → Run Test 的闭环迭代逼近正确解。这个循环能否收敛，取决于三个要素：错误信息是否完整传递给 Agent、Agent 是否具备基于错误定位根因（而非盲目重试）的能力、以及循环是否有明确的终止条件。理解了这个循环，你就理解了 SWE-bench 类系统、Auto-fix 流水线和 CI Bot 的共同骨架。

---

## 一、背景与动机：为什么第 53 天要学这个

回顾我们在这条 6 个月 AI Agent 工程师路线中已经走过的路径：M1 阶段我们建立了 LLM 基础认知，M2 的前几周我们让 Agent 学会了读文件、写文件、执行命令，甚至跑通了"给一段需求 → 生成代码 → 跑一次测试"的流水线。

但你应该已经发现了那个令人沮丧的现象：**Agent 一次生成的代码，大概率跑不过测试**。

这不是模型能力问题，而是一个结构性的必然：

1. **生成时缺少运行时信息**。模型在写代码时不知道真实的运行环境、依赖版本、边界输入是什么样。
2. **测试是外部世界对代码的"审判"**，而审判结果（报错栈、断言失败信息）在一次性生成模式中根本没有回流到模型。
3. **没有反馈闭环的系统无法收敛**——这是控制论的常识，同样适用于 Agent 工程。

所以第 53 天的主题非常明确：把"跑测试"从流水线的终点，变成循环中的一个节点。**没有 Test/Debug Loop 的 Agent 是开环系统，有了它才是闭环系统**。这也是后续学习 SWE-bench 复现、Auto-repair 流水线、CI 集成 Agent 的前置知识。

---

## 二、核心内容

### 2.1 Debug Loop 的六步循环：Run Test → Failure → Read Error → Locate → Fix → Run Test

**核心概念：测试调试循环（Test-Debug Loop / Self-Correction Loop）**

先看这个循环的标准形态：

```
┌─────────────────────────────────────────────┐
│                                             │
│  ┌──────────┐    pass    ┌──────────────┐  │
│  │ Run Test │───────────▶│  ✅ Done     │  │
│  └────┬─────┘            └──────────────┘  │
│       │ fail                               │
│       ▼                                    │
│  ┌──────────┐                              │
│  │  Read    │  解析错误类型、堆栈、期望vs实际  │
│  │  Error   │                              │
│  └────┬─────┘                              │
│       ▼                                    │
│  ┌──────────┐                              │
│  │  Locate  │  从报错点回溯到根因代码         │
│  └────┬─────┘                              │
│       ▼                                    │
│  ┌──────────┐                              │
│  │   Fix    │  修改代码                      │
│  └────┬─────┘                              │
│       │                                    │
│       └────────── 回到 Run Test ────────────┘
│                                             │
└──────────���──────────────────────────────────┘
```

为什么是这个顺序，而不是 Agent 拿到报错就直接改代码？因为每一步都在为下一步提供约束：

- **Run Test** 产出的是客观事实（哪些测试挂了），不是模型的猜测。这是整个循环中唯一"外部世界给出的真值"。
- **Read Error** 把事实结构化：错误类型、堆栈行号、期望值 vs 实际值。信息越结构化，下一步定位越准。
- **Locate** 是从"症状"回溯到"病因"的过程——报错在第 42 行，但根因可能在第 20 行的变量初始化。这一步是区分"能修改"和"能调试"的关键（见 2.5 节）。
- **Fix** 是最小化修改。注意：修改范围越大，引入新失败的概率越高，循环越可能不收敛。

这里有一个重要的工程直觉：**这个循环和人调试代码的思维方式完全同构**。人类工程师 Debug 也是"跑一下 → 看报错 → 读堆栈 → 加断点/打印 → 改一行 → 再跑"。Agent 循环设计之所以有效，不是因为它发明了什么新方法，而是因为它忠实地复刻了这个已被验证几十年的认知流程。

### 2.2 测试失败信息到 Agent 的传递：决定循环上限的环节

**核心概念：错误信息传递（Error Feedback Injection）**

失败信息如何进入 Agent 的上下文，直接决定了循环的修复成功率。信息不足，Agent 只能瞎猜；信息污染（噪音过多），Agent 会被带偏。

一次测试失败通常携带以下信息层级：

| 信息层级 | 内容示例 | 对 Agent 的价值 | 是否必须传递 |
|---|---|---|---|
| L1 摘要 | `FAILED test_div.py::test_zero - ZeroDivisionError` | 快速判断问题类别 | ✅ 必须 |
| L2 堆栈 | 出错文件、行号、调用链 | 定位失败点 | ✅ 必须 |
| L3 断言详情 | `assert f(0) == 0, but got ZeroDivisionError` | 区分逻辑错误 vs 异常 | ✅ 必须 |
| L4 stdout/stderr | 程序自己打印的日志 | 辅助理解运行时状态 | ⚠️ 截断后传递 |
| L5 全量输出 | 数百行编译警告、依赖信息 | 价值低，占上下文 | ❌ 通常丢弃 |

工程上有一个常见的坑：直接把测试的完整 stdout 塞进上下文。一次 pytest 运行可能输出几千行，真正有用的失败信息只占 5%。**错误信息传递的核心原则是"完整但不冗余"**——每层信息保留，但做截断和优先级排序，把 L1-L3 放在上下文的开头或结尾（模型注意力最强的位置）。

另一个容易被忽略的传递内容：**上一次 Agent 做了什么修改**。如果循环进行了多轮，Agent 需要知道"我已经试过什么、改了哪里、结果如何"，否则会陷入重复同一修复方案的死循环。这是把历史轨迹（trajectory）也纳入反馈的一部分。

### 2.3 Agent 的定位与修复能力：从报错到根因

拿到错误信息只是原料，真正的能力体现在两步：**定位（Locate）** 和 **修复（Fix）**。

**定位的本质是因果链回溯**。给定 `TypeError: unsupported operand type(s) for +: 'int' and 'str'`，一条合格的推理链应该是：

1. 报错发生在 `total = total + item.price`（第 42 行）
2. `item.price` 是 string，说明上游数据解析没做类型转换
3. 根因在 `parse_item()` 中 `return {"price": row[2]}`——从 CSV 读出来的是字符串
4. 修复点：`float(row[2])`，而不是在第 42 行硬转类型

注意第 4 步：**修复应该发生在根因处，而不是症状处**。在症状处打补丁（第 42 行加 `str()`）会让代码"看起来跑通了"，但引入了隐式的类型转换债务。这就是为什么 Locate 必须先于 Fix——跳过定位直接修改，产出的是补丁堆积的代码。

工程上提升定位能力的手段：

- **让 Agent 先输出假设再行动**。强制 Agent 在修改前写下"我认为根因是 X，证据是 Y"，能显著减少盲目修改。��是 Chain-of-Thought 在调试场景的具体化。
- **允许 Agent 读更多上下文**。报错只指向一行，但根因往往在别的文件。Agent 需要具备"顺着调用链去读上游代码"的工具调用能力（这依赖我们在前几周建立的 Read/Grep 工具）。
- **限制单次修改的 diff 大小**。小修改 = 小风险，失败后容易回滚和归因。

### 2.4 Debug Loop 的终止条件：防止无限循环

**核心概念：循环终止条件（Loop Termination Criteria）**

没有终止条件的循环是一个定时炸弹。Debug Loop 的终止条件分两类：

**成功终止：**
- 全部测试通过（pass）
- 达到部分通过阈值（如 90% 测试通过，剩余标记为已知问题）

**失败终止（这往往被初学者忽略，但工程上更重要）：**

| 终止条件 | 判断依据 | 为什么需要 |
|---|---|---|
| 最大迭代次数 | 如 5 轮 | 防止无限烧 token |
| 无进展检测 | 连续 2 轮失败测试集合不变 | Agent 在打转 |
| 修改回退检测 | diff 与之前某轮相同 | 重复同一无效方案 |
| token 预算 | 单任务 token 上限 | 成本控制 |
| 状态恶化 | 通过数下降（修一个坏两个） | 越修越糟，需人工介入 |

其中"无进展检测"特别值得展开。判断 Agent 是否在打转，工程上常用**失败测试集合的签名（failing signature）**：把当前失败的测试名列表做 hash。如果连续两轮 hash 相同，说明 Agent 的修改没有产生任何效果——继续循环只是烧钱。更好的做法是检测到这种情况后注入一条提示："你已经尝试了 X 和 Y，均无效，请重新阅读错误信息，考虑完全不同的假设。"

**终止之后做什么**同样重要：优雅退出不是简单报错，而是把"已尝试的方案、失败原因分析"写入一份 debug report 交给人工。这体现了一个成熟的工程观念：**Agent 的自我修正是有界的，超出边界时应扩大反馈回路（升级到人类），而不是死磕**。

### 2.5 从"能修改"到"能调试"的升级：认知层面的分水岭

这是今天最重要的一个认知跃迁，值得单独讲透。

**能修改（Can Edit）**：给定"这里错了，改成这样"，Agent 执行编辑。这是低级能力，只需要 diff 工具。

**能调试（Can Debug）**：给定"测试挂了，报错如下"，Agent 自主完成 根因假设 → 验证假设 → 定位 → 修复 的完整推理。

两者的差异可以总结为一张表：

| 维度 | 能修改 | 能调试 |
|---|---|---|
| 输入 | 明确的修改指令 | 模糊的失败现象 |
| 推理 | 单步执行 | 多步假设-验证 |
| 信息 | 已给出答案的位置 | 需要自己从堆栈中挖 |
| 修改位置 | 指令指定处 | 根因所在处 |
| 失败处理 | 无 | 换假设重试 |

关键洞察在于：**调试是一种"在不确定性下的搜索行为"**。Agent 持有的不是答案，而是若干个待验证的假设。人类工程师调试强，是因为他们有"先验"——这类报错八成是空指针、这个 bug 十有八九在并发层。Agent 同样可以积累这种先验（常见错误模式 → 常见根因的映射），这是后续做经验记忆（memory）模块的伏笔。

从测试到自我修正的升级，本质上是给 Agent 加了一个**外部真值源（Ground Truth Source）**。模型自己判断"我写对了"是不可靠的（LLM 有自我评估偏差，倾向高估自己），但测试通过与否是运行时事实。这就是为什么 Test/Debug Loop 被认为是 Coding Agent 最可靠的自我修正机制——它不依赖模型"自知之明"，而依赖客观验证。

---

## 三、代码实现：一个最小可用的 Debug Loop

下面是一个约 60 行的 Python 实现，展示了循环骨架的所有关键部件：

```python
import hashlib, json
from dataclasses import dataclass

@dataclass
class LoopState:
    iteration: int = 0
    seen_signatures: set = None  # 失败签名，用于打转检测

    def __post_init__(self):
        if self.seen_signatures is None:
            self.seen_signatures = set()

def run_tests(cmd="pytest -x --tb=short -q") -> tuple[bool, str]:
    """执行测试，返回 (是否通过, 结构化失败信息)"""
    import subprocess
    r = subprocess.run(cmd, shell=True, capture_output=True, text=True, timeout=300)
    return r.returncode == 0, (r.stdout + r.stderr)[-8000:]  # 截断防上下文爆炸

def extract_failure_signature(output: str) -> str:
    """提取失败测试集合的签名，用于无进展检测"""
    failed = [l for l in output.splitlines() if l.startswith("FAILED")]
    return hashlib.md5("\n".join(sorted(failed)).encode()).hexdigest()

def format_feedback(output: str) -> str:
    """L1-L3 信息优先，噪音靠后"""
    failed_lines = [l for l in output.splitlines() if "FAILED" in l or "Error" in l]
    return "## Test Failure Report\n" + "\n".join(failed_lines[:20]) + \
           "\n\n## Full tail\n" + output[-2000:]

MAX_ITERATIONS = 5

def debug_loop(agent, task: str):
    state = LoopState()
    ok, output = run_tests()
    while not ok and state.iteration < MAX_ITERATIONS:
        sig = extract_failure_signature(output)
        if sig in state.seen_signatures:
            print("[Loop] 无进展：失败集合未变化，终止并升级人工")
            return False
        state.seen_signatures.add(sig)
        state.iteration += 1

        # 关键：把失败信息 + 修改历史一起注入
        feedback = format_feedback(output)
        history = f"\n## 已尝试\n" + json.dumps(agent.get_recent_edits(), ensure_ascii=False)
        prompt = f"""任务: {task}
{feedback}{history}

请先给出根因假设（注明证据），再做最小化修改。"""
        agent.run(prompt)

        ok, output = run_tests()

    if ok:
        print(f"[Loop] ✅ 第 {state.iteration} 轮修复成功")
    else:
        agent.write_debug_report()  # 优雅退出：写报告交人工
    return ok
```

这段代码体现了三个设计决策：**失败签名做打转检测**、**输出截断保护上下文**、**要求 Agent 先假设后修改**。删掉任何一个，循环的成功率都会明显下降。

---

## 四、实践练习与思考题

**练习（今天必做）**：给 Day 52 的 Coding Agent 加上 Test/Debug Loop。

1. 准备一个含 2-3 个故意埋 bug 的小项目（如一个 `utils.py` + `test_utils.py`）。
2. 实现 `run_tests()` 和失败信息格式化函数，注意截断。
3. 接入你的 Agent，跑通完整循环，记录每轮的：失败签名、Agent 给出的根因假设、实际 diff。
4. 手动构造一个 Agent 修不出来的 bug（如需求本身和测试矛盾），验证终止条件是否正确触发。

**思考题：**

1. 如果测试本身是错的（代码符合需求但测试断言写错了），Debug Loop 会发生什么？如何设计让 Agent 识别"该改测试而不是改代码"？
2. 你的循环在第 3 轮开始反复提出同一个错误假设。除了终止，有没有办法主动打破（如注入不同视角的提示）？
3. 多个测试同时失败时，应该一次修一个还是一起修？两种策略各有什么风险？

---

## 五、与 Agent Engineering 的关联

Test/Debug Loop 不是孤立技巧，它是几乎所有现实 Agent 系统的核心骨架：

- **SWE-bench / Devin / OpenHands** 类系统：整个评测就是在测 Debug Loop 的收敛能力——给定 issue 和测试，Agent 能否在 N 轮内让测试全绿。
- **CI 中的 Auto-repair Bot**：PR 挂了 CI → Bot 读失败日志 → 提交修复 → 重新触发 CI。这就是本文循环在工业界的直接落地。
- **通用 Agent 的反思模式（Reflection Pattern）**：Test/Debug Loop 是 Reflection 的最强实例，因为它用**客观验证**取代了模型的自我评估，规避了 LLM 自评偏差。
- **为后续模块打地基**：循环中的失败签名、轨迹历史，是将来做经验记忆（"上次遇到这种错我用 X 方案修好了"）的原始数据；终止后的 debug report 是人机协作（human-in-the-loop）接口的雏形。

一句话定位：**Agent 工程的大部分可靠性工程，就是在设计"反馈信号怎么进来、循环怎么收敛、不收敛时怎么退出"。** 今天的 Debug Loop 就是这三个问题的最小完整案例。

---

## FAQ

**Q1：Agent 修复失败后，直接把错误信息重新发给它重试不行吗？为什么要设计这么复杂的循环？**
A：单纯重试（re-prompt）相当于让 Agent 复读自己的错误思路。循环的价值在于每轮注入**新的客观信息**（最新测试结果 + 已尝试方案记录），迫使 Agent 的推理路径发生实质变化。没有新增信息的重试，成功率接近于随机。

**Q2：Debug Loop 一般设多少轮迭代合适？**
A：实践中 3-8 轮是常见区间。研究表明多数可修复的 bug 在前 3 轮内解决；超过 8 轮仍不收敛的，继续跑的边际收益极低，应升级人工。轮数上限应与任务复杂度和 token 预算挂钩，而非拍脑袋定一个数。

**Q3：测试全绿就一定代表代码正确吗？**
A：不一定。测试覆盖不足时，Agent 可能通过"迎合断言"的方式作弊（比如硬编码期望值）。缓解手段：要求 diff 最小化、审查修改是否改变了测试本身、增加覆盖检查。这也是为什么生产级系统里 Debug Loop 后面还要接 Code Review 环节。

**Q4：如果报错信息很长，全部塞进上下文会不会更好？**
A：不会。超长噪音会稀释关键信息（lost in the middle 问题），且浪费 token。正确做法是分层传递：摘要和断言详情置顶，完整输出截尾。实践上截断到 4K-8K 字符通常够用。

**Q5：这个循环和 Reflection（自我反思）模式是什么关系？**
A：Reflection 是模式名，Test/Debug Loop 是它在 Coding 场景下的具体实现，而且是最可靠的一种——因为反馈来自测试运行这个客观真值源，而不是模型对自己输出的主观评价。做通用 Reflection 时应优先寻找类似测试这样的外部验证器。

---

## 参考资料

由于本次检索未返回具体链接，以下为该主题下公认的权威出处，建议按此清单补全阅读：

1. SWE-bench 论文与仓库 — Jimenez et al., *SWE-bench: Can Language Models Resolve Real-World GitHub Issues?*（Debug Loop 能力的标准评测集）
2. OpenHands（原 OpenDevin）源码中的 agent loop 实现与 CodeAct 论文
3. Reflexion 论文 — Shinn et al., *Reflexion: Language Agents with Verbal Reinforcement Learning*（自我修正 + 反馈记忆的经典框架）
4. Anthropic《Building effective agents》— workflow 与 agent 循环设计的官方指南
5. AutoGen / LangGraph 文档中关于 cyclic graph 与 loop termination 的章节

（明日 Day 54 预告：在 Debug Loop 之上引入多文件修改与代码库级理解。）

---

## 📋 本日知识点清单

- [ ] Run Test → Failure → Read Error → Locate → Fix → Run Test 的循环
- [ ] 测试失败信息到 Agent 的传递
- [ ] Agent 根据错误信息定位和修复的能力
- [ ] Debug Loop 的终止条件
- [ ] 从"能修改"到"能调试"的升级

## 📝 实践练习

加入 Test/Debug Loop，Agent 能根据测试失败自动定位和修复。

---

*本文是「AI Agent 工程师」6 个月学习计划的一部分。学习路线：LLM → Inference → Runtime → Harness → Memory → Environment → Evaluation → Production。目标：Agent / AI Systems Engineer。*
