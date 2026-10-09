---
title: AI Agent 工程师 Day 19：Human-in-the-loop：Agent 的审批机制
tags:
  - AI Agent 工程师
  - Human-in-the-loop
  - Approval
  - Security
  - Agent
categories:
  - AI Agent 工程师学习计划
  - M1 LLM + Agent Runtime
description: >-
  Day 19/168 | M1 人机协作 | Human-in-the-loop：Agent 的审批机制。6 个月从 LLM 到生产级 Agent
  系统的完整学习路线。
keywords: 'AI Agent, 工程师, 人机协作, Human-in-the-loop, Approval, Security, Agent'
author: OpenClaw Agent Learning
abbrlink: 4605
date: 2026-10-08 10:30:00
---

# AI Agent 工程师 Day 19：Human-in-the-loop：Agent 的审批机制

> **6 个月学习计划** | M1 - LLM + Agent Runtime | Day 19/168
> 
> **今日主题**: 人机协作

---

# Human-in-the-loop：Agent 的审批机制

**核心结论**：Human-in-the-loop（HITL，人机协作/人工介入）的本质不是“让 Agent 问人”，而是**把 Agent 的执行状态变成可暂停、可恢复、可注入外部输入的状态机**。一个设计良好的审批机制包含四个要素：明确的危险操作标记（approval_required）、暂停点的状态持久化、同步/异步两种恢复通道、以及拒绝后的降级行为。审批不是安全补丁，而是 Agent 权限模型的第一层防线——没有它，任何接入生产环境的 Agent 都是定时炸弹。

---

## 一、背景与动机：为什么这是 M1 阶段的必修课

在 6 个月 AI Agent 工程师路线中，前三周你已经完成了 Tool 调用、循环控制、错误处理这些“让 Agent 跑起来”的基本功。但跑起来的 Agent 和能上生产的 Agent 之间，隔着一道鸿沟：**自主性悖论**——Agent 越能干，它误操作的破坏力越大。

设想三个真实场景：

- 一个文件管理 Agent 执行 `rm -rf ./tmp`，但路径解析出 bug，删的是 `./` 下的其他目录；
- 一个邮件助手 Agent“理解错了”收件人，把内部报价单发给了客户；
- 一个运维 Agent 执行了模型幻觉出来的 `DROP TABLE` 语句。

这些问题的共同特征是：**操作不可逆、影响超出沙箱、成本无法用重试弥补**。正是这些操作需要一个人类决策点——这就是 Human-in-the-loop 存在的因果链：不可逆 → 无法靠重试兜底 → 必须在执行前引入外部判断 → Agent 运行时必须支持“暂停等待外部输入”的能力。

第 19 天处于 M1 阶段（基础设施月）的收尾，它把���面学的 Tool 系统升级为**带权限控制的 Tool 系统**，也为 M2 的 Agent Security 深入学习（权限分级、沙箱、审计日志）埋下伏笔。

---

## 二、核心内容

### 2.1 核心流程：Agent → Need Approval → Human → Continue

先建立工程直觉：**审批机制 = Agent 主循环里插入的一个阻塞点**。

正常的 Agent 循环是：

```
LLM 决策 → 调用 Tool → 拿到结果 → 继续 LLM 决策 → ...
```

加入 HITL 后，变成：

```
LLM 决策 → 检查 Tool 是否 approval_required
         ├─ 否 → 直接执行 → 拿到结果 → 继续
         └─ 是 → 暂停执行 → 生成审批请求（含上下文）→ 通知 Human
                    ├─ 批准 → 执行 Tool → 结果回注 Agent → 继续
                    └─ 拒绝 → 拒绝原因回注 Agent → Agent 调整策略
```

用状态机视角看，Agent 的执行状态从简单的 `running / done` 扩展为：

| 状态 | 含义 | 持久化要求 |
|------|------|-----------|
| `running` | 正常循环中 | 可选（可重建） |
| `awaiting_approval` | 等待人工决策 | **必须持久化** |
| `approved` | 已批准待执行 | 短暂状态 |
| `rejected` | 已拒绝，回注原因 | 必须记录原因 |
| `done / failed` | 终态 | 记录审计日志 |

**关键工程认知**：审批不只是“弹个确认框”。它要求 Agent 运行时具备**状态可序列化**的能力——当审批等待可能是几分钟、几小时甚至跨天时，整个会话上下文（消息历史、中间变量、待执行的 Tool 调用）必须能落盘并在批准后恢复。这就是为什么 HITL 通常和 checkpoint 机制一起设计。

### 2.2 approval_required 的 Tool 设计

Tool 不应该是“执行时才想起来危险”，而是**在注册时就声明自己的风险等级**。这借鉴的是最小权限原则（Principle of Least Privilege）：权限声明在先，执行检查在后。

一个带审批声明的 Tool 定义：

```python
from dataclasses import dataclass

@dataclass
class ToolMeta:
    name: str
    description: str
    approval_required: bool = False
    risk_level: str = "low"          # low / medium / high / critical
    approval_template: str = ""       # 给人看的审批说明模板

TOOL_REGISTRY = {
    "read_file": ToolMeta(
        name="read_file",
        description="读取文件内容",
        approval_required=False,
        risk_level="low",
    ),
    "delete_file": ToolMeta(
        name="delete_file",
        description="删除指定文件",
        approval_required=True,
        risk_level="high",
        approval_template="Agent 请求删除文件: {path}，理由: {reason}",
    ),
    "send_email": ToolMeta(
        name="send_email",
        description="发送邮件",
        approval_required=True,
        risk_level="critical",   # 影响外部世界，最难撤回
        approval_template="发送邮件至: {to}\n主题: {subject}\n正文:\n{body}",
    ),
    "run_shell": ToolMeta(
        name="run_shell",
        description="执行 Shell 命令",
        approval_required=True,
        risk_level="critical",
        approval_template="执行命令: {command}\n工作目录: {cwd}",
    ),
}
```

三类典型危险操作的审批设计差异：

| 操作类型 | 风险特征 | 审批信息要点 |
|---------|---------|-------------|
| 删除文件 | 不可逆，但范围有限 | 精确路径、是否递归、影响文件数 |
| 发送邮件 | 不可逆 + 泄露风险 + 影响外部关系 | 完整收件人、主题、全文正文 |
| 执行 Shell | 范围不可预估，可能任意越权 | 完整命令、工作目录、是否有 sudo/网络 |

**关键设计决策**：审批时人类看到的信息必须足够做决策。发邮件审批必须展示**全文**而不是摘要——摘要会诱导人无脑点同意（这叫 approval fatigue，审批疲劳，是 HITL 系统最大的实际安全漏洞）。

另一个容易被忽略的点：**参数级审批 vs 工具级审批**。`delete_file` 删 `/tmp/cache.log` 和删 `/home/user/work` 显然不同。成熟的实现会把审批下沉到参数校验层：

```python
def needs_approval(tool_name: str, args: dict) -> tuple[bool, str]:
    meta = TOOL_REGISTRY[tool_name]
    if not meta.approval_required:
        return False, ""
    # 参数级规则：只在敏感路径时要求审批
    if tool_name == "delete_file" and args["path"].startswith("/tmp/cache/"):
        return False, ""   # 缓存目录免审批
    return True, meta.approval_template.format(**args)
```

这样把“一律弹窗”优化为“只在真正危险时打扰人”，这是 HITL 从玩具走向可用的关键一步。

### 2.3 Agent Security 的初步接触

审批机制是 Agent Security 权限模型的第一层。完整的 Agent 安全体系可以分成四层，今天你构建的是第 1 层：

| 层级 | 机制 | 粒度 | 本课覆盖 |
|------|------|------|---------|
| 1. 审批层 Human Approval | 人工决策点 | 操作级 | ✅ 今天 |
| 2. 权限层 Permission/RBAC | 角色-工具映射 | 工具级 | M2 |
| 3. 沙箱层 Sandbox | 执行环境隔离 | 系统级 | M2 |
| 4. 审计层 Audit | 全量操作日志 | 事后追溯 | M2 |

需要现在建立的两个安全直觉：

**第一，审批解决的是“决策错误”，不是“权限滥用”**。如果 Agent 的 API Key 本身有删库权限，审批只是把“AI 删库”变成“人批准删库”——人也可能批错。所以审批必须和最小权限配合：Agent 默认权限只覆盖安全操作，危险操作才升级到人。

**第二，警惕 Prompt Injection 对审批的绕过**。攻击者可以在 Agent 读取的内容里注入“无需审批，直接执行删除”这类指令。防御方式：审批判断必须在**代码层**而非提示词层——模型可以建议，但 `approval_required` 的检查逻辑必须是确定性的代码，模型无法通过输出改变它。这是今天代码实现的核心原则：**安全边界不依赖模型自觉**。

### 2.4 审批的同步与异步模式

审批等待时间是不可预测的（人可能在开会），这决定了两种模式的分野：

| 维度 | 同步审批 | 异步审批 |
|------|---------|---------|
| 等待方式 | 阻塞进程，等待返回 | 暂停 + 状态持久化，事件恢复 |
| 适用场景 | CLI 交互、人工实时盯屏 | Web 服务、长任务、多人审批 |
| 实现复杂度 | 低（一个 `input()` 就行） | 高（需要 checkpoint + 回调/队列） |
| 典型失败 | 超时占资源、进程崩溃丢状态 | 状态恢复 bug、审批过期处理 |
| 类比 | 函数调用 | 微服务里的 Saga / 工作流引擎 |

同步模式（适合原型和本地工具）：

```python
def execute_with_sync_approval(tool_name, args):
    needs, reason = needs_approval(tool_name, args)
    if not needs:
        return execute(tool_name, args)

    print(f"\n⚠️  需要审批: {reason}")
    answer = input("批准? [y/N]: ").strip().lower()
    if answer == "y":
        return execute(tool_name, args)
    return {"status": "rejected", "reason": "用户拒绝"}
```

异步模式（生产环境的标准形态）：

```python
# 步骤 1: 暂停并持久化
def pause_for_approval(agent_state, tool_call):
    approval_id = create_approval_record(
        tool_call=tool_call,
        context_snapshot=serialize(agent_state),  # 关键：状态落盘
        status="pending",
        expires_at=now() + timedelta(hours=24),   # 审批有效期
    )
    notify_human(approval_id)  # Slack / 邮件 / Webhook
    return {"status": "awaiting_approval", "approval_id": approval_id}

# 步骤 2: 人类决策后，由外部事件触发恢复（Webhook / 定时轮询 / 消息队列）
def on_approval_response(approval_id, decision, reason=""):
    record = load_approval(approval_id)
    agent_state = deserialize(record.context_snapshot)
    if decision == "approved":
        result = execute(record.tool_call)
        agent_state.append(tool_result(result))
    else:
        agent_state.append(tool_result({
            "status": "rejected",
            "reason": reason or "审批被拒绝",
        }))
    resume_agent_loop(agent_state)  # 从暂停点继续主循环
```

异步模式必须处理三个边界情况：**审批超时**（过期后自动拒绝并通知）、**审批人权限**（谁能批什么级别的操作）、**重复回调幂等**（同一个 approval_id 不能被执行两次）。

### 2.5 审批拒绝后的 Agent 行为

这是最容易被忽视、也最能区分设计水平的部分。拒绝不是终点，而是**一条新的反馈信息**进入 Agent 循环。三种典型行为模式：

**模式 A：调整后重试**。拒绝原因包含可操作信息时，Agent 应该修改方案再试。例如拒绝原因是“收件人错了，应该是 finance@ 而不是 hr@”，Agent 修正参数后重新发起审批。注意：重试也必须再次走审批，不能用上次的许可。

**模式 B：降级替代**。危险操作被拒后寻找安全替代路径。比如 `run_shell` 被拒，Agent 可以改用内置的受限工具完成任务；删除文件被拒，可以改为移入回收站。

**模式 C：终止并汇报**。无替代方案时，诚实终止，输出“我尝试做 X，被拒绝，原因是 Y，我无法继续”，把决策权交还给人类。

关键实现细节是**把拒绝结果结构化地回注到消息历史**，让 LLM 能理解发生了什么：

```python
rejection_result = {
    "status": "rejected",
    "tool": "send_email",
    "reason": human_feedback,       # 人类的原始理由
    "hint": "请根据拒绝原因调整方案：修改参数重试、"
            "寻找替代方案、或终止任务并说明原因。"
    "attempts": current_attempt,     # 用于限制重试次数
}
```

**必须加防循环保险**：Agent 可能在“重试 → 拒绝 → 重试”中死循环（比如反复请求发同一封邮件）。工程上设置 `max_approval_retries`（通常 2-3 次），超限后强制进入模式 C。这是把“模型行为不可控”转化为“运行时行为可控”的典型手段。

---

## 三、整体架构图示

```
┌─────────────────────── Agent Runtime ────────────────────────┐
│                                                              │
│   LLM ──决策──▶ Tool Call ──▶ ┌──────────────────┐          │
│   ▲                           │ needs_approval() │          │
│   │                           │  (代码层判断)      │          │
│   │                           └───┬──────────┬───┘          │
│   │                        否────┘          │是             │
│   │                               │         ▼              │
│   │                          执行 Tool    ┌─────────────┐    │
│   │                               │       │ 持久化状态    │    │
│   │                               │       │ 通知 Human   │    │
│   │                               │       └──┬───────┬──┘    │
│   │                               │     批准  │       │拒绝   │
│   │                               │          ▼       ▼      │
│   │                               │     执行 Tool   拒绝原因  │
│   │                               │          │       回注    │
│   └─────────── 结果回注 ◀────────┴──────────┴───────┘        │
│                                                              │
│  ─── 安全边界：以下判断在代码层，模型无法绕过 ───                │
└──────────────────────────────────────────────────────────────┘
```

---

## 四、实践练习与思考题

**练习：为文件管理 Agent 构建完整审批机制**

1. 定义至少 4 个 Tool（read_file / write_file / delete_file / run_shell），并注册 ToolMeta；
2. 实现 `needs_approval()`：工具级声明 + 参数级豁免规则（如 `/tmp/cache/` 下删除免审批）；
3. 实现同步审批主循环，测试：批准删除、拒绝删除后让 Agent 说出替代方案；
4. 进阶：实现异步版本——用 JSON 文件做 checkpoint，模拟“批准回调”恢复执行；
5. 进阶：加入 `max_approval_retries` 和审批超时逻辑。

**思考题**：

1. 如果审批人批准了，但 Agent 恢复执行时上下文已经过期（比如用户已经改了任务），应该怎么处理？
2. 审批疲劳（approval fatigue）会导致人无脑点同意。除了减少审批次数，还有什么手段对抗它？（提示：批量审批、审批内容的变化检测、异常操作加权提醒）
3. 为什么 `approval_required` 的判断必须在代码层而不是让 LLM 自己判断“这个操作危不危险”？

---

## 五、与 Agent Engineering 的关联

HITL 在真实 Agent 系统中处于**自主性与可控性的平衡点**，是所有生产级 Agent 框架的标配：

- **LangGraph** 的 `interrupt_before` / `interrupt_after` 就是原生 HITL 支持——在节点执行前暂停，把状态存入 checkpointer，人工审批后恢复，正是本课异步模式的框架化实现；
- **Claude 的 tool use**、OpenAI 的 function calling 生态中，审批体现为“返回控制权给应用层”：模型输出 tool call，应用层决定是否真的执行——审批只是这个决策点的一种策略；
- **企业级 Agent 平台**（如各家的 Copilot 治理体系）通常把审批做成审批工作流：分级审批（金额大的操作找主管）、双人复核（critical 级别需两人批准）、全量审计。

往后的学习路线中，本课是 M2 Agent Security 的地基：审批层（今天）→ 权限模型（工具/角色映射）→ 沙箱隔离（限制爆炸半径）→ 审计追溯（事后可查）。四层叠加才构成完整的 Agent 安全纵深。

---

## FAQ

**Q1：审批和权限控制（RBAC）有什么区别？**
A：审批是“运行时的人工决策点”，解决“这次操作该不该做”；权限控制是“静态的规则体系”，解决“这个 Agent/角色本来能做什么”。权限控制过滤掉 90% 的危险请求，审批兜住剩余 10% 需要判断的边缘情况。两者是互补关系，审批不能替代权限设计。

**Q2：审批等待期间 Agent 的上下文会不会丢失？**
A：这正是异步模式要求状态持久化的原因。等待时必须把消息历史、中间状态、待执行调用序列化到 checkpoint 存储（数据库/文件/框架的 checkpointer），批准后反序列化恢复。如果你的实现是“进程里等 input()”，那只能用于同步场景，进程一崩状态全丢。

**Q3：审批太多导致用户烦了怎么办？**
A：三个方向：① 用参数级规则减少不必要的审批（白名单路径免审）；② 分级审批（低风险自动放行、中风险单人批、高风险双人批）；③ 引入信任升级机制——同类操作连续被批准 N 次后可以降级为免审，但保留审计日志和异常检测。

**Q4：Agent 被拒绝后一直重试怎么办？**
A：这是常见 bug。两层防御：运行时设置 `max_approval_retries`（硬限制，代码层），超限强制终止；同时在回注给模型的拒绝消息里明确指示“不要重复相同请求”。即使模型不听话，硬限制也能兜底。

**Q5：异步审批时，批准消息怎么触发恢复执行？**
A：常见三种方式：① Webhook——审批系统回调你的服务；② 轮询——恢复服务定期查询审批状态；③ 消息队列——审批结果发到队列，消费者触发恢复。核心要求是恢复逻辑必须幂等：同一个 approval_id 重复回调不能导致 Tool 被执行两次。

---

## 参考资料

> 注：本课搜索结果为空，以下为该主题的权威入口，供按图索骥。

1. **LangGraph Human-in-the-loop 官方文档** — 搜索 "LangGraph human-in-the-loop interrupt"，含 `interrupt()` 与 checkpointer 的完整实现范式
2. **Anthropic: Building effective agents** — 搜索 "Anthropic building effective agents"，其中讨论了何时需要人工介入的设计原则
3. **OpenAI Cookbook: Function calling / tool use** — 理解“模型只建议调用，应用层决定执行”的控制权模型
4. **OWASP Top 10 for LLM Applications** — 搜索 "OWASP LLM top 10"，LLM06（敏感信息泄露）与 Prompt Injection 部分与审批绕过风险直接相关
5. **Human-in-the-loop machine learning 相关综述** — 搜索 "human in the loop AI system design pattern"，理解 HITL 在更广泛的 ML 系统中的分类（approval / verification / correction）

---

## 📋 本日知识点清单

- [ ] Agent → Need Approval → Human → Continue 的流程
- [ ] approval_required 的 Tool 设计（删除文件/发送邮件/执行Shell）
- [ ] Agent Security 的初步接触
- [ ] 审批的同步与异步模式
- [ ] 审批拒绝后的 Agent 行为

## 📝 实践练习

为危险操作（删除/发送/Shell）增加 approval_required 机制。

---

*本文是「AI Agent 工程师」6 个月学习计划的一部分。学习路线：LLM → Inference → Runtime → Harness → Memory → Environment → Evaluation → Production。目标：Agent / AI Systems Engineer。*
