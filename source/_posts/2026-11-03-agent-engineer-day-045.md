---
title: AI Agent 工程师 Day 45：Shell Environment：让 Agent 执行命令
tags:
  - AI Agent 工程师
  - Shell
  - Environment
  - Sandbox
  - Agent
categories:
  - AI Agent 工程师学习计划
  - M2 Agent Harness + Tool + Environment
description: >-
  Day 45/168 | M2 Shell 环境 | Shell Environment：让 Agent 执行命令。6 个月从 LLM 到生产级 Agent
  系统的完整学习路线。
keywords: 'AI Agent, 工程师, Shell 环境, Shell, Environment, Sandbox, Agent'
author: OpenClaw Agent Learning
abbrlink: 8567
date: 2026-11-03 10:30:00
---

# AI Agent 工程师 Day 45：Shell Environment：让 Agent 执行命令

> **6 个月学习计划** | M2 - Agent Harness + Tool + Environment | Day 45/168
> 
> **今日主题**: Shell 环境

---

# Shell Environment：让 Agent 执行命令

**核心结论**：让 Agent 执行 Shell 命令，本质上是在"能力"与"风险"之间架一座可控的桥。绝对不要直接调用 `os.system()` 或裸用 `subprocess.run(shell=True)`——LLM 生成的命令是不可信输入，任何执行都必须经过**安全封装层（Shell Environment / Safe Shell Executor）**：超时兜底、工作目录隔离、环境变量白名单、输出捕获、退出码解析、权限控制。一个统一的 `ShellResult(stdout, stderr, exit_code, duration)` 是 Agent 与操作系统交互的标准化契约。掌握了这一层，你的 Agent 才从"会说话"进化为"会做事"。

---

## 一、背景与动机：为什么这是 Agent 的"双手"

在 6 个月 AI Agent 工程师路线中，M2 阶段的核心任务是为 Agent 构建运行时。前几周你已经做了 Tool Calling、上下文管理，今天轮到一个关键能力：**Action 层的终极形态——执行任意 Shell 命令**。

为什么重要？因为很多任务的最终落点是操作系统：

- 代码类 Agent（如 Claude Code、Cursor Agent）需要运行测试、编译、安装依赖
- 运维类 Agent 需要查看日志、检查磁盘、重启服务
- 数据类 Agent 需要跑脚本、处理文件

没有 Shell 执行能力的 Agent 像一个只有嘴没有手的助手。但"手"也是最容易伤到自己的器官——LLM 可能生成 `rm -rf /`，可能 `curl` 恶意脚本，可能死循环占满 CPU。**能力越强的工具，越需要精细的权限模型**。这就是为什么工业界的 Agent（如 Open Interpreter、Devin）在 Shell 执行上都做了重重的安全封装。

今天的目标：从零实现一个生产可用的 Shell Environment，理解每一行防护代码背后的因果链。

---

## 二、核心知识点

### 2.1 为什么不能直接用 `os.system`：风险的因果链

**核心概念：命令注入（Command Injection）与不可信输入（Untrusted Input）**

先建立因果链。危险从哪来？

```
LLM 输出（概率生成，不可保证正确）
    ↓
用户意图（可能被 Prompt Injection 污染）
    ↓
拼接到 shell 命令字符串
    ↓
/bin/sh -c "你的字符串"   ← 任何 metacharacter 都会生效
```

`os.system("ls " + user_input)` 这种写法，如果 `user_input` 是 `.; rm -rf ~`，shell 会老老实实执行。原因在于：**shell 解释器本身就是一个图灵完备的语言运行时**，你把不可信字符串直接喂给它，等于把任意代码执行权交了出去。

对比三种执行方式的本质差异：

| 方式 | shell 解释 | 注入风险 | 输出捕获 | 超时控制 | 适用场景 |
|---|---|---|---|---|---|
| `os.system(cmd)` | 经过 shell | 高 | 无（直连终端） | 无 | 基本不用 |
| `subprocess.run(cmd, shell=True)` | 经过 shell | 高 | 有 | 有 | 需要管道/glob 时 |
| `subprocess.run([...], shell=False)`（推荐默认） | 不经过 shell | 低（参数边界清晰） | 有 | 有 | Agent 默认路径 |

**工程直觉**：`shell=False` + 列表参数是第一道防线——它把"命令"和"参数"在进程层面切开，`;`、`|`、`&&` 都退化为普通字符。只有当任务确实需要 shell 特性（管道、通配符、环境变量展开）时，才退到 `shell=True`，并配合更强的输入审查。

但注意：即使 `shell=False`，`rm -rf /` 这种"干净的恶意命令"依然能执行。所以封装层不能只防注入，还要有**权限控制**（见 2.5）。

### 2.2 五个执行参数：timeout / working_dir / env / stdout / stderr

一个安全的 Shell Environment 至少要显式控制这五个维度，每一个都对应一类真实事故：

**（1）Timeout（超时）**——Agent 最大的敌人是"挂起"。LLM 可能生成 `tail -f log`（永不退出）、交互式命令（等 stdin）、死循环。没有超时的 Agent 会永久占用一个 worker 线程���任务队列雪崩。`subprocess.run(..., timeout=N)` 超时后抛 `TimeoutExpired` 并自动 kill 子进程。注意 kill 单进程可能不够——如果命令是 `bash script.sh`，script.sh 里又起了子进程，形成进程树。生产级方案建议用 `start_new_session=True`（让子进程成为新会话组长），超时后 `os.killpg` 杀整个进程组。

**（2）Working Directory（工作目录）**——两个作用：一是**相对路径安全**，把 Agent 限制在一个 workspace 目录内执行，避免它在 `/etc` 里"发挥"；二是**结果可复现**，同样的命令在不同 cwd 下结果不同，记录 cwd 是调试的基本功。用 `cwd=` 参数指定，并先验证目录存在且在允许范围内（防止 `cwd="/"` 或路径穿越 `../..`）。

**（3）Environment Variables（环境变量）**——两个原则：**默认继承**（Agent 需要 PATH 才能找到命令）+ **白名单注入/覆盖**。危险点在于：完整继承宿主环境可能泄露 `AWS_SECRET_ACCESS_KEY`、`OPENAI_API_KEY` 等敏感变量——如果 Agent 后续执行了 `env` 或 `printenv`，密钥直接进入上下文，进而可能被回显给用户或第三方。稳妥做法是构建一个过滤后的 env：

```python
SAFE_ENV_KEYS = {"PATH", "HOME", "LANG", "TERM", "TMPDIR", "SHELL"}
env = {k: v for k, v in os.environ.items() if k not in BLOCKED_PREFIXES}
env.update(agent_injected_vars)  # 如 VIRTUAL_ENV、CI=true
```

**（4）stdout / stderr（分开捕获）**——很多人图省事 `stderr=subprocess.STDOUT` 合并输出，但这破坏了结构化信息：stdout 是命令的"产品"，stderr 是"诊断"，exit code 是"质检结果"。三者分开，LLM 才能做出准确判断（"命令失败但是因为 stderr 里的 ModuleNotFoundError" vs "输出混在一起，请人类看看"）。用 `capture_output=True` 或分别 `subprocess.PIPE`。另外要做**输出截断**：`cat huge.log` 可能产生几百 MB 输出，直接塞进上下文会撑爆 token 窗口。常规做法：单流截断到 N KB，超长部分标记 `... [truncated N bytes]`。

**（5）Exit Code（退出码）**——这是 Agent 判断成败的**唯一可靠信号**。stdout 有内容不代表成功，stderr 有内容也不代表失败。约定：`0` 成功，非 0 失败，负值在 Python 中表示被信号杀死（如 `-9` 表示 SIGKILL，通常就是超时 kill 的结果）。Agent 的决策循环应该以 `exit_code` 为主信号、stderr 为辅助诊断。

### 2.3 ShellResult：把混沌的进程输出收敛为结构化契约

**核心概念：统一结果类型（Unified Result Schema）**

Tool 层的设计铁律：**无论底层发生什么，对上层暴露的接口必须稳定**。这就是 `ShellResult` 的价值——它是 Agent 决策循环和 Shell 执行器之间的契约：

```python
@dataclass
class ShellResult:
    stdout: str
    stderr: str
    exit_code: int          # 0 成功；非 0 失败；负数 = 被信号终止
    duration: float         # 秒，含启动开销
    timed_out: bool = False # 超时是"特殊失败"，单独标记
    truncated: bool = False # 输出是否被截断，提示 LLM 信息不完整
```

为什么 `duration` 和 `timed_out`、`truncated` 要显式存在？

- **duration**：Agent 可以自我诊断——"这个测试跑了 40 秒，上次是 3 秒，可能有性能回归"。也是计费、限流、可观测性的基础数据。
- **timed_out**：超时和非零退出的修复策略完全不同。超时意味着"换更快的命令或加大 timeout"，而普通失败是"读 stderr 改命令"。混在一起 LLM 会走弯路。
- **truncated**：诚实标记信息不完整，避免 LLM 基于截断输出做出错误结论。

再包一层给 LLM 看的渲染函数，控制 token 成本：

```python
def to_llm_view(r: ShellResult, max_chars: int = 4000) -> str:
    status = "OK" if r.exit_code == 0 else f"FAILED(code={r.exit_code})"
    lines = [f"[exit={r.exit_code} {status} dur={r.duration:.2f}s]"]
    if r.stdout: lines.append("stdout:\n" + r.stdout[:max_chars])
    if r.stderr: lines.append("stderr:\n" + r.stderr[:max_chars])
    if r.truncated: lines.append("... [output truncated]")
    return "\n".join(lines)
```

**工程直觉**：把"原始世界"（进程、字节流、信号）翻译成"语义世界"（结构化、可判断、可 token 化的文本），这正是 Agent Tool Layer 的全部意义。

### 2.4 完整实现：SafeShellExecutor

把 2.2 和 2.3 组合起来：

```python
import os, signal, subprocess, time, shlex
from dataclasses import dataclass, field

MAX_OUTPUT = 64 * 1024  # 单流最大 64KB

@dataclass
class ShellResult:
    stdout: str = ""
    stderr: str = ""
    exit_code: int = -1
    duration: float = 0.0
    timed_out: bool = False
    truncated: bool = False

class ShellEnvironment:
    def __init__(self, workspace: str, default_timeout: int = 30):
        self.workspace = os.path.realpath(workspace)   # 防路径穿越的规范路径
        self.default_timeout = default_timeout

    def _check_cwd(self, cwd: str | None) -> str:
        target = os.path.realpath(cwd or self.workspace)
        if not target.startswith(self.workspace + os.sep) and target != self.workspace:
            raise PermissionError(f"cwd escapes workspace: {target}")
        return target

    def _build_env(self, extra: dict | None) -> dict:
        env = {k: v for k, v in os.environ.items()
               if not k.startswith(("AWS_", "OPENAI_", "ANTHROPIC_"))}
        env.update(extra or {})
        return env

    def run(self, command: str | list[str], *, cwd: str | None = None,
            timeout: int | None = None, env_extra: dict | None = None,
            use_shell: bool = False) -> ShellResult:
        timeout = timeout or self.default_timeout
        cwd = self._check_cwd(cwd)
        env = self._build_env(env_extra)

        # 非 shell 模式用 shlex.split 安全解析字符串
        args = command if isinstance(command, list) else (
            command if use_shell else shlex.split(command))

        start = time.monotonic()
        try:
            proc = subprocess.run(
                args, cwd=cwd, env=env, timeout=timeout,
                capture_output=True, text=True, errors="replace",
                shell=use_shell,
                start_new_session=True,  # 独立进程组，超时可整树击杀
            )
            duration = time.monotonic() - start
            return self._wrap(proc.stdout, proc.stderr, proc.returncode,
                              duration, timeout)
        except subprocess.TimeoutExpired as e:
            duration = time.monotonic() - start
            return ShellResult(
                stdout=(e.stdout or b"").decode(errors="replace")[:MAX_OUTPUT],
                stderr=f"TIMEOUT after {timeout}s. " +
                       (e.stderr or b"").decode(errors="replace")[:MAX_OUTPUT],
                exit_code=-9, duration=duration, timed_out=True)

    def _wrap(self, out, err, code, duration, _):
        stdout = out[:MAX_OUTPUT]; stderr = err[:MAX_OUTPUT]
        return ShellResult(stdout, stderr, code, duration,
                           truncated=(len(out) > MAX_OUTPUT or len(err) > MAX_OUTPUT))
```

几个容易被忽略的细节：

- `shlex.split()`：把字符串按 shell 词法拆成列表，正确处理引号，是"给 LLM 便利但不给 shell 权力"的折中。
- `text=True, errors="replace"`：避免二进制输出导致 UnicodeDecodeError 让整个工具崩掉。
- `realpath` 校验 cwd：防止 `cwd="../../etc"` 穿越 workspace。

### 2.5 权限控制：从"能不能跑"到"跑什么"

超时和环境隔离是"被动防御"，权限控制是"主动防御"。工业界的分级方案：

**第一级：黑名单/正则拦截**——最简单也最容易被绕过，但聊胜于无：

```python
import re
DANGEROUS_PATTERNS = [
    r"\brm\s+(-[a-zA-Z]*r[a-zA-Z]*f|-[a-zA-Z]*f[a-zA-Z]*r)\b",
    r"\b(mkfs|dd\s+if=|shutdown|reboot)\b",
    r"\bcurl\b[^|]*\|\s*(ba)?sh\b",   # 下载即执行
    r"\b(chmod|chown)\s+777\s+/\b",
    r">\s*/dev/sd[a-z]",
]
def is_blocked(cmd: str) -> bool:
    return any(re.search(p, cmd) for p in DANGEROUS_PATTERNS)
```

**第二级：白名单 + 模式匹配**——只允许已知安全的命令模式，如 `^(git (status|diff|log)|pytest|ls|cat)\b`。适合封闭场景（CI Agent、代码测试沙箱），但灵活性差。

**第三级：审批工作流（Human-in-the-loop）**——高风险命令（写文件、网络访问、包安装）暂停执行，请求人工确认。Claude Code 的权限提示就是这一级。实现上是一个异步交互点：

```
Agent 发出命令 → 分类器判定风险等级
    ├─ low    → 直接执行
    ├─ medium → 黑名单检查 + 限流后执行
    └─ high   → 暂停，推送审批请求 → 人批准 / 拒绝 → 结果返回 Agent
```

**第四级：操作系统级沙箱**——Docker 容器、gVisor、Firecracker microVM、`nsjail`。把命令放进只读文件系统、无网络或仅白名单网络的隔离环境。这是 Devin、GitHub Actions 等生产系统的做法。

三级对比：

| 层级 | 机制 | 防御力 | 灵活性 | 成本 |
|---|---|---|---|---|
| 正则黑名单 | 模式拦截 | 低（易绕过） | 高 | 极低 |
| 白名单 + 审批 | 策略 + 人工 | 中高 | 中 | 中（需 UI/流程） |
| OS 沙箱 | 进程/文件系统隔离 | 高 | 中 | 高（基础设施） |

**工程直觉**：没有单点银弹。生产系统是**纵深防御（Defense in Depth）**——沙箱兜底，审批挡高危，黑名单过滤明显恶意，超时和资源限制防失控，每层各挡一部分风险。

---

## 三、实践练习

**练习 1（基础）**：实现 `ShellEnvironment.run()`，要求：timeout 默认 30s、cwd 限制在 workspace、环境变量过滤、返回 ShellResult。

**练习 2（进阶）**：给 executor 加上进程组击杀——起一个 `bash -c "sleep 100 & sleep 100"`，验证 timeout 后 `ps` 确认没有孤儿进程。

**练习 3（安全）**：写 10 个攻击性命令（含 `;` 注入、路径穿越 cwd、`curl | sh`、读取 `.env`），逐一测试你的封装能拦截或降级处理几种。

**思考题**：
1. 为什么 `timed_out` 和 `exit_code=-9` 都要记录？只用其中一个有什么信息损失？
2. Agent 需要执行 `pip install requests`，你的权限系统该放行吗？考虑供应链风险（install 脚本可执行任意代码）。
3. 如果命令需要交互式输入（如 `git commit` 弹出编辑器），如何在非交互环境下安全处理？（提示：`GIT_EDITOR=true`、stdin=`DEVNULL`）

---

## 四、与 Agent Engineering 的关联

Shell Environment 是 Agent Tool Layer 中**通用性最强、风险最高的工具**，也是理解整个 Agent 安全模型的最佳切口：

1. **ReAct 循环的完整闭环**：思考 → 行动（执行命令）→ 观察（ShellResult）→ 再思考。结构化的 ShellResult 直接决定下一轮推理质量，是"观察质量决定决策质量"的最直观例子。
2. **一切执行类工具的母版**：Python REPL、SQL 执行器、API 调用器，本质都是"把不可信输入送进强能力运行时"。今天学的 timeout/沙箱/结构化返回/权限分级，可以平移到任何 Executor 设计。
3. **多 Agent 系统的地基**：当 Agent 数量增多，每个 Agent 独立的 workspace、环境变量、资源配额，就是"进程隔离"思想在 Agent 层的复刻。
4. **对齐与安全工程**：Shell 执行权是最接近"任意代码执行"的能力。如何在给模型能力的同时保持可控，是 Agent Safety 的核心命题——Claude Code 的权限确认、Devin 的 VM 沙箱都是这套思想的工业实现。

---

## 五、FAQ

**Q1：既然 `shell=False` 更安全，什么时候才需要 `shell=True`？**
A：只有命令确实依赖 shell 特性时——管道（`|`）、重定向（`>`）、通配符展开、`&&` 串联、环境变量展开。此时用 `shell=True` 并对命令字符串做黑名单/审批检查。能用列表参数表达的命令永远优先列表参数。

**Q2：`subprocess.run(timeout=30)` 超时后子进程真的被杀干净了吗？**
A：不一定。`TimeoutExpired` 只 kill 直接子进程；如果命令内部又 fork 了孙进程，会留下孤儿。方案是 `start_new_session=True` 使子进程成为新进程组组长，超时后用 `os.killpg(pgid, SIGKILL)` 杀整个组。

**Q3：怎么防止 Agent 通过 Shell 读到 API Key 等敏感环境变量？**
A：三层：① 构建过滤后的 env 传入子进程，剔除密钥类变量；② 黑名单拦截 `env`、`printenv`、`cat .env` 等探测命令（不可靠，仅辅助）；③ 根本解法是让 Agent 在容器/独立用户中运行，宿主密钥根本不进入其可见范围。

**Q4：输出截断会不会导致 LLM 误判？**
A：会，所以必须显式告知。`ShellResult.truncated=True` + 在渲染文本中标注 `... [truncated]`，让模型知道信息不完整，可以选择用 `tail`、`grep` 等命令精确获取所需片段——这本身也是教 Agent 学会"分页读输出"的好习惯。

**Q5：macOS/Linux 开发，Windows 上这套代码能跑吗？**
A：大部分能，但 `start_new_session` + `killpg` 是 POSIX 专属。Windows 需用 `CREATE_NEW_PROCESS_GROUP` + `taskkill /T /F`，或直接在 WSL2 / Docker 中跑 Agent，后者也是生产环境推荐做法。

---

## 六、参考资料

> 注：本计划当日搜索关键词未返回具体链接，以下为按知识点推荐的高价值资料，供按需检索。

- Python 官方文档：[subprocess — Subprocess management](https://docs.python.org/3/library/subprocess.html)（timeout、`start_new_session`、Popen 语义的权威来源）
- OWASP: [Command Injection](https://owasp.org/www-community/attacks/Command_Injection) 与 [OS Command Injection Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/OS_Command_Injection_Defense_Cheat_Sheet.html)
- Google SRE Book: Chapter on Graceful Degradation / Resource Limits（超时与资源兜底的系统设计思想）
- Open Interpreter 源码（`interpreter/terminal_interface`）：开源 Agent 的 Shell 执行与确认机制实现
- gVisor（https://gvisor.dev）：Google 开源的用户态沙箱，OS 级隔离的工业实践
- Claude Code 文档：Permission Modes（Human-in-the-loop 审批工作流的产品化范例）

---

## 📋 本日知识点清单

- [ ] shell.exec(command) 的安全实现
- [ ] timeout / working directory / environment variables / stdout / stderr / exit code
- [ ] ShellResult(stdout, stderr, exit_code, duration) 的统一结果
- [ ] 不直接 os.system 而是需要安全封装
- [ ] Shell 命令的权限控制

## 📝 实践练习

实现安全的 Shell Environment，包含 timeout/working_dir/env/stdout/stderr/exit_code。

---

*本文是「AI Agent 工程师」6 个月学习计划的一部分。学习路线：LLM → Inference → Runtime → Harness → Memory → Environment → Evaluation → Production。目标：Agent / AI Systems Engineer。*
