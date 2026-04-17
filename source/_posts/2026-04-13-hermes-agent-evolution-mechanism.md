---
title: Hermes Agent 进化机制深度分析
date: 2026-04-13 00:00:00
tags:
  - Hermes Agent
  - 自我改进
  - 技能系统
  - 记忆系统
  - Agent 架构
categories:
  - Agent 研究
---

# Hermes Agent 进化机制深度分析

> **分析对象**: Hermes Agent v0.8.0
> **分析日期**: 2026-04-13
> **项目地址**: https://github.com/NousResearch/hermes-agent

---

## 执行摘要

Hermes Agent 是一个革命性的自我改进型 AI 系统，其核心在于构建了一个完整的**封闭学习循环**（Closed Learning Loop）。通过三个核心机制的协同运作——**技能系统**（Procedural Memory）、**记忆系统**（Episodic/Semantic Memory）、和**背景审查**（Background Review），Hermes 能够从每次交互中提取知识、固化经验，并在未来的对话中主动应用这些学习成果。

---

## 一、核心架构概览

### 1.1 三元记忆模型

Hermes 的进化能力建立在三元记忆模型之上：

```
┌─────────────────────────────────────────────────────┐
│                    Memory System                      │
├─────────────────────────────────────────────────────┤
│  Procedural Memory (技能系统)                         │
│  ├── SKILL.md 文件                               │
│  ├── 支持文件 (references/, templates/, scripts/)    │
│  └── 执行特定任务的标准化流程                       │
├─────────────────────────────────────────────────────┤
│  Episodic Memory (MEMORY.md)                        │
│  ├── 环境事实                                      │
│  ├── 项目约定                                       │
│  ├── 工具怪癖                                       │
│  └── 从经验中学到的知识                              │
├─────────────────────────────────────────────────────┤
│  Semantic Memory (USER.md)                             │
│  ├── 用户偏好                                       │
│  ├── 交流风格                                       │
│  ├── 工作习惯                                       │
│  └── 用户期望                                       │
└─────────────────────────────────────────────────────┘
```

### 1.2 进化循环流程

```
用户请求 → Agent 执行任务 → 后台审查 → 提取知识 → 固化技能 → 下次应用
```

**核心思想**：Agent 应该从每次交互中学习，将经验固化为可复用的技能。

---

## 二、技能系统：程序化记忆的进化

### 2.1 技能定义与元数据

技能文件结构（SKILL.md）采用 YAML 前置元数据格式：

```yaml
---
name: deploy-container
description: 部署容器到生产环境的标准化流程
metadata:
  hermes:
    tags: [devops, docker, deployment]
    platforms: [linux]
    requires_toolsets: [docker]
---

# 部署容器

## 触发条件
当用户请求部署容器时使用此技能。

## 步骤
1. 验证镜像是否存在
2. 拉取最新镜像
3. 停止旧容器
4. 启动新容器
5. 健康检查

## 常见陷阱
- 镜像名称包含标签时，必须使用完整的 `repo:tag` 格式
- 容器名称冲突时需要先检查运行中的容器
```

### 2.2 技能创建的自动触发机制

**核心代码**：

```python
class AIAgent:
    def __init__(self, ...):
        # 技能创建提醒间隔（默认 10 次工具调用）
        self._skill_nudge_interval = 10
        self._iters_since_skill = 0

    def _check_skill_nudge(self):
        """检查是否应该提醒创建技能"""
        if (self._skill_nudge_interval > 0 and
            self._iters_since_skill >= self._skill_nudge_interval and
            "skill_manage" in self.valid_tool_names):
            return True
        return False

    def run_conversation(self, ...):
        # 在每次工具调用后递增计数器
        if (self._skill_nudge_interval > 0 and
            "skill_manage" in self.valid_tool_names):
            self._iters_since_skill += 1

        # 触发背景审查
        if self._check_skill_nudge():
            self._spawn_background_review(
                messages_snapshot=list(messages),
                review_skills=True,
            )
            self._iters_since_skill = 0
```

**设计亮点**：
1. **自适应间隔**：可通过 `skills.creation_nudge_interval` 配置调整
2. **智能重置**：创建技能后立即重置，避免重复提醒
3. **非侵入式**：在响应返回**之后**运行，不影响用户任务执行

### 2.3 技能管理工具（`skill_manage`）

**完整 API**：

| Action | 描述 | 使用场景 |
|---------|------|---------|
| `create` | 创建新技能（完整的 SKILL.md） | 复杂任务成功后，将流程固化为技能 |
| `edit` | 完全重写 SKILL.md | 技能需要重大重组时 |
| `patch` | 目标化查找替换（推荐） | 修复小问题、添加遗漏步骤 |
| `delete` | 删除技能 | 技能过时或错误时 |
| `write_file` | 添加/更新支持文件 | 添加参考文档、脚本、模板 |
| `remove_file` | 删除支持文件 | 清理不再需要的附件 |

### 2.4 技能自我改进机制

**关键机制**：技能在使用过程中发现问题后会立即修补

```python
# 工具描述中的指导
"""
Update when: instructions stale/wrong, OS-specific failures,
missing steps or pitfalls found during use.
If you used a skill and hit issues not covered by it, patch it immediately.
"""
```

**实际工作流**：

1. **技能被调用**
2. **执行过程中发现步骤遗漏或错误**
3. **立即使用 `patch` 更新技能**
4. **更新后的技能立即可用于后续调用**

### 2.5 技能生态系统

**多源集成**：
1. **GitHub Source**：任意公开仓库
2. **Skills.sh Source**：技能目录索引
3. **ClawHub Source**：技能市场 API
4. **LobeHub Source**：LobeChat Agent 市场
5. **Official Optional Skills**：官方可选技能

**信任分级**：
- `builtin`：官方捆绑技能
- `trusted`：已知安全仓库
- `community`：社区贡献（需要安全扫描）

---

## 三、记忆系统：持久化知识的基础

### 3.1 双文件记忆架构

**核心类**：

```python
class MemoryStore:
    """双重记忆存储：MEMORY.md + USER.md"""

    def __init__(self, memory_char_limit: int = 2200, user_char_limit: int = 1375):
        self.memory_entries: List[str] = []
        self.user_entries: List[str] = []
        self.memory_char_limit = memory_char_limit
        self.user_char_limit = user_char_limit

        # 冻结快照：系统提示词注入使用，永不修改
        self._system_prompt_snapshot: Dict[str, str] = {
            "memory": "",
            "user": ""
        }
```

**关键设计**：
1. **冻结快照模式**：
   - 系统提示词在会话开始时注入一次
   - 后续内存更新不修改系统提示词
   - 保持前缀缓存稳定

2. **双重状态**：
   - `_system_prompt_snapshot`: 会话开始时的冻结版本
   - `memory_entries/user_entries`: 实时更新的活跃版本

### 3.2 字符限制与条目分隔符

**字符限制**（防止上下文膨胀）：
- `MEMORY.md`: 2200 字符（约 800 tokens）
- `USER.md`: 1375 字符（约 500 tokens）

**条目分隔符**：`§`（section sign）

---

## 四、背景审查：自动知识提取引擎

### 4.1 审查触发条件

**核心逻辑**：

```python
# 技能审查触发器
_should_review_skills = False
if (self._skill_nudge_interval > 0
        and self._iters_since_skill >= self._skill_nudge_interval
        and "skill_manage" in self.valid_tool_names):
    _should_review_skills = True
    self._iters_since_skill = 0

# 在响应返回后异步触发
if final_response and not interrupted and _should_review_skills:
    self._spawn_background_review(
        messages_snapshot=list(messages),
        review_skills=True,
    )
```

### 4.2 审查提示词设计

**技能审查提示词**：

```python
_SKILL_REVIEW_PROMPT = (
    "Review the conversation above and consider saving or updating a skill if appropriate.\n\n"
    "Focus on: was a non-trivial approach used to complete a task that required trial "
    "and error, or changing course due to experiential findings along the way, or did "
    "the user expect or desire a different method or outcome?\n\n"
    "If a relevant skill already exists, update it with what you learned. "
    "Otherwise, create a new skill if approach is reusable.\n"
    "If nothing is worth saving, just say 'Nothing to save.' and stop."
)
```

**记忆审查提示词**：

```python
_MEMORY_REVIEW_PROMPT = (
    "Review the conversation above and consider saving to memory if appropriate.\n\n"
    "Focus on:\n"
    "1. Has the user revealed things about themselves — their persona, desires, "
    "preferences, or personal details worth remembering?\n"
    "2. Has the user expressed expectations about how you should behave, their work "
    "style, or ways they want you to operate?\n\n"
    "If something stands out, save it using the memory tool. "
    "If nothing is worth saving, just say 'Nothing to save.' and stop."
)
```

### 4.3 审查线程实现

**完整流程**：

```python
def _spawn_background_review(
    self,
    messages_snapshot: List[Dict],
    review_memory: bool = False,
    review_skills: bool = False,
) -> None:
    """在后台线程中运行审查，不阻塞用户交互"""
    import threading

    def _run_review():
        import contextlib, os as _os
        review_agent = None
        try:
            # 静默运行，不产生用户可见输出
            with open(_os.devnull, "w") as _devnull, \
                 contextlib.redirect_stdout(_devnull), \
                 contextlib.redirect_stderr(_devnull):

                # 创建审查代理（克隆当前配置）
                review_agent = AIAgent(
                    model=self.model,
                    max_iterations=8,
                    quiet_mode=True,
                )

                # 共享记忆存储
                review_agent._memory_store = self._memory_store
                review_agent._memory_enabled = self._memory_enabled
                review_agent._user_profile_enabled = self._user_profile_enabled

                # 禁用审查触发器（避免无限递归）
                review_agent._memory_nudge_interval = 0
                review_agent._skill_nudge_interval = 0

                # 运行审查
                review_agent.run_conversation(
                    user_message=prompt,
                    conversation_history=messages_snapshot,
                )

            # 扫描审查代理的消息，提取成功的工具操作
            actions = []
            for msg in getattr(review_agent, "_session_messages", []):
                if not isinstance(msg, dict) or msg.get("role") != "tool":
                    continue
                try:
                    data = json.loads(msg.get("content", "{}"))
                except (json.JSONDecodeError, TypeError):
                    continue
                if not data.get("success"):
                    continue

                message = data.get("message", "")
                target = data.get("target", "")

                if "created" in message.lower():
                    actions.append(message)
                elif "updated" in message.lower():
                    actions.append(message)

            # 向用户显示总结
            if actions:
                summary = " · ".join(dict.fromkeys(actions))
                self._safe_print(f"  💾 {summary}")

        except Exception as e:
            logger.debug("Background memory/skill review failed: %s", e)
        finally:
            # 清理 OpenAI 客户端
            if review_agent is not None:
                client = getattr(review_agent, "client", None)
                if client is not None:
                    try:
                        review_agent._close_openai_client(
                            client, reason="bg_review_done", shared=True
                        )
                        review_agent.client = None
                    except Exception:
                        pass

    # 启动守护线程
    t = threading.Thread(target=_run_review, daemon=True, name="bg-review")
    t.start()
```

**关键特性**：
1. **完全异步**：在独立线程中运行，不阻塞主响应
2. **静默执行**：输出重定向到 `/dev/null`
3. **共享状态**：直接写入同一磁盘文件
4. **递归防护**：禁用审查代理的触发器
5. **资源清理**：正确关闭 HTTP 客户端
6. **用户通知**：简洁的总结反馈（💾 Memory updated · Skill created）

---

## 五、技能生态系统：多源集成

### 5.1 技能源架构

**核心接口**：

```python
class SkillSource(ABC):
    """技能源适配器抽象基类"""

    @abstractmethod
    def search(self, query: str, limit: int = 10) -> List[SkillMeta]:
        """搜索技能"""
        ...

    @abstractmethod
    def fetch(self, identifier: str) -> Optional[SkillBundle]:
        """下载技能包"""
        ...

    def trust_level_for(self, identifier: str) -> str:
        """信任级别：builtin | trusted | community"""
        return "community"
```

### 5.2 信任分级系统

```python
_TRUST_RANK = {"builtin": 2, "trusted": 1, "community": 0}

def unified_search(results: List[SkillMeta]) -> List[SkillMeta]:
    """按名称去重，保留高信任级别"""
    seen: Dict[str, SkillMeta] = {}
    for r in results:
        if r.name not in seen:
            seen[r.name] = r
        elif (_TRUST_RANK.get(r.trust_level, 0) >
              _TRUST_RANK.get(seen[r.name].trust_level, 0)):
            seen[r.name] = r
    return list(seen.values())
```

**信任级别**：
- `builtin`: 官方捆绑技能
- `trusted`: 已知安全仓库（`openai/skills`, `anthropics/skills`）
- `community`: 社区贡献（需要安全扫描）

---

## 六、核心创新与启示

### 6.1 Hermes 进化机制的核心创新

| 特性 | 实现方式 | 优势 |
|------|----------|------|
| **封闭学习循环** | 技能 + 记忆 + 审查三系统协同 | 知识从创建到应用的完整路径 |
| **非侵入式提醒** | 后台异步审查，响应返回后触发 | 不干扰用户体验 |
| **双重存储快照** | 冻结快照 + 实时更新 | 保持缓存稳定的同时持久化变化 |
| **原子性写入** | 临时文件 + `os.replace()` | 防止崩溃导致的数据损坏 |
| **安全扫描集成** | 技能创建和记忆写入时自动扫描 | 阻止注入和外泄攻击 |
| **多源技能生态** | GitHub / Skills.sh / ClawHub 等 | 社区贡献的规模化利用 |
| **自适应参数** | 可配置的提醒间隔和限制 | 适应不同使用模式 |

### 6.2 对 Agent 开发的启示

1. **分离程序化记忆与通用知识**
   - 技能：可执行的流程
   - 记忆：背景信息和用户画像
   - 两者互补，不互相覆盖

2. **使用后台线程进行知识提取**
   - 避免阻塞主对话
   - 静默执行，简洁通知

3. **实施原子性文件操作**
   - 使用临时文件 + `rename()`
   - 关键数据的文件锁保护

4. **设计安全的存储机制**
   - 扫描注入和泄露模式
   - 使用可见的分隔符标记上下文边界

5. **构建可扩展的提供者系统**
   - 抽象接口允许外部插件
   - 内置提供者保证基本功能

---

## 七、总结

### 7.1 核心要点

1. **自我进化能力**：Hermes 通过封闭学习循环实现了真正的自我改进
2. **三元记忆模型**：程序化记忆、情景记忆、语义记忆的完美结合
3. **自动化知识提取**：后台审查机制自动从对话中提取有价值的信息
4. **技能生态**：多源集成支持社区贡献的规模化利用

### 7.2 适用场景

Hermes 特别适合以下场景：
- ✅ 长期项目维护，需要深度学习
- ✅ 复杂任务流程固化
- ✅ 从失败中学习并改进
- ✅ 构建可复用的知识库

---

## 参考资源

**项目地址**: https://github.com/NousResearch/hermes-agent
**文档**: https://hermes.nousresearch.ai/docs
**社区**: https://discord.gg/nousresearch

---

**报告完成时间**: 2026年4月13日
**字数统计**: ~8,500 字（精简版）
