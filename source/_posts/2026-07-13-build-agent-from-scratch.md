---
title: 从零搭一个能用的 Agent：不靠框架，50 行代码搞定
tags:
  - AI Agent
  - 从零实现
  - LLM
  - 核心循环
categories:
  - AI工程
abbrlink: 16527
date: 2026-07-13 20:30:00
description: "LangChain、LlamaIndex、CrewAI、AutoGen……Agent 框架一堆，但越用越觉得：框架在帮你，也在绑你。你花在理解框架上的时间，可能比自己写一个 Agent 还多。"
keywords: "从零搭一个能用的, agent, 不靠框架, 行代码搞定, AI Agent, 从零实现, LLM, 核心循环"
---

# 从零搭一个能用的 Agent：不靠框架，50 行代码搞定

LangChain、LlamaIndex、CrewAI、AutoGen……Agent 框架一堆，但越用越觉得：框架在帮你，也在绑你。你花在理解框架上的时间，可能比自己写一个 Agent 还多。

这篇不用任何框架，50 行代码搭一个能跑的 Agent。不是玩具，是真的能用的。

## Agent 的本质

所有 Agent 的核心就一个循环：

```
while not done:
    1. 观察（读输入）
    2. 思考（调 LLM）
    3. 行动（调工具）
    4. 记住（更新状态）
```

LangChain 的 AgentExecutor、AutoGPT 的主循环、CrewAI 的任务执行器，底层都是这个。框架只是在这个循环上加了日志、重试、回调。核心逻辑不需要框架。

## 50 行代码

```python
import json
import openai

client = openai.OpenAI()

# 工具定义
TOOLS = {
    "search": lambda q: f"搜索结果：{q}的相关信息...",
    "calculate": lambda expr: str(eval(expr)),
    "fetch_url": lambda url: f"页面内容：{url}的摘要...",
}

TOOL_DESC = """可用工具：
- search(query): 搜索信息
- calculate(expression): 计算数学表达式
- fetch_url(url): 获取网页内容

回复格式：
需要调工具时：{"tool": "工具名", "args": "参数"}
直接回答时：{"answer": "你的回答"}
任务完成时：{"done": true, "answer": "最终答案"}"""

def agent(task: str, max_steps: int = 10) -> str:
    messages = [
        {"role": "system", "content": TOOL_DESC},
        {"role": "user", "content": task}
    ]
    
    for _ in range(max_steps):
        resp = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=messages,
            temperature=0
        )
        reply = resp.choices[0].message.content
        messages.append({"role": "assistant", "content": reply})
        
        try:
            action = json.loads(reply)
        except json.JSONDecodeError:
            return reply  # 模型直接回了文本
        
        if "answer" in action:
            return action["answer"]
        if "done" in action:
            return action["answer"]
        if "tool" in action:
            result = TOOLS[action["tool"]](action["args"])
            messages.append({"role": "user", "content": f"工具结果：{result}"})
    
    return "达到最大步数限制，任务未完成"

# 用法
print(agent("搜索Python最新版本，然后计算3.12+3.13的平均值"))
```

这就是一个完整的 Agent。观察→思考→行动→记住，循环执行。

## 加点实用的东西

50 行是骨架，生产环境需要更多。但增加的东西不来自框架，来自你的需求。

### 加错误处理

```python
def call_tool(tool_name: str, args: str) -> str:
    if tool_name not in TOOLS:
        return f"错误：未知工具 '{tool_name}'"
    try:
        return TOOLS[tool_name](args)
    except Exception as e:
        return f"工具执行失败：{e}"
```

### 加记忆

```python
def agent_with_memory(task: str, memory: list = None, max_steps: int = 10):
    messages = [
        {"role": "system", "content": TOOL_DESC},
    ]
    # 注入历史记忆
    if memory:
        messages.append({"role": "system", "content": f"之前做过的事：\n" + "\n".join(memory)})
    messages.append({"role": "user", "content": task})
    
    trace = []
    for _ in range(max_steps):
        resp = client.chat.completions.create(model="gpt-4o-mini", messages=messages, temperature=0)
        reply = resp.choices[0].message.content
        messages.append({"role": "assistant", "content": reply})
        trace.append(reply)
        
        try:
            action = json.loads(reply)
        except json.JSONDecodeError:
            return reply, trace
        
        if "answer" in action or "done" in action:
            return action.get("answer", ""), trace
        if "tool" in action:
            result = call_tool(action["tool"], action["args"])
            messages.append({"role": "user", "content": f"工具结果：{result}"})
            trace.append(f"调用了{action['tool']}({action['args']}) → {result}")
    
    return "达到步数限制", trace
```

### 加多工具编排

```python
# 定义有副作用的工具（比如写数据库）
TOOLS = {
    "search": search_fn,
    "calculate": calc_fn,
    "query_db": query_db_fn,         # 只读
    "write_db": write_db_fn,         # 写入
    "send_email": send_email_fn,     # 外部动作
}

# 工具分级：低风险自动执行，高风险需确认
AUTO_TOOLS = {"search", "calculate", "query_db"}
CONFIRM_TOOLS = {"write_db", "send_email"}

if "tool" in action:
    if action["tool"] in CONFIRM_TOOLS:
        print(f"⚠️ 即将执行：{action['tool']}({action['args']})，确认？(y/n)")
        if input().lower() != 'y':
            messages.append({"role": "user", "content": "用户拒绝了此操作"})
            continue
    result = call_tool(action["tool"], action["args"])
```

## 什么时候该用框架

不是不能用框架，是不该**一开始就用框架**。先用裸代码搞清楚 Agent 的核心循环，理解了之后再决定要不要上框架。

框架的价值在于：
- **生态集成**：LangChain 有几百个工具和数据源的连接器，自己写不现实
- **生产级功能**：重试、超时、并发控制、观测性，这些自己写很烦
- **团队协作**：框架提供统一的抽象，团队里的人都能看懂

框架的代价在于：
- **学习成本**：LangChain 的文档比你自己的代码长 10 倍
- **黑箱**：出了问题不知道是框架的锅还是你的锅
- **版本迁移**：LangChain 从 v0.1 到 v0.2 改了半壁江山

我的建议：**原型用裸代码，生产再上框架。** 50 行代码能验证想法，比搭一个 LangChain 项目快得多。验证完了，再决定是继续裸写还是迁移到框架。

## 50 行之外

50 行是起点。从这 50 行出发，可以逐步加：

- 更多工具 → 工具注册机制
- 更长对话 → 记忆压缩
- 多 Agent → 任务拆分+协调
- 更高准确率 → ReAct/Self-refine 循环
- 生产部署 → 错误处理、日志、监控

但不管加多少，核心循环不变。理解了这个循环，框架只是语法糖。

---

**相关阅读：**
- ReAct 论文 - "Reason+Act"的Agent范式
- LangChain AgentExecutor 源码 - 看看框架怎么实现这个循环
- AutoGPT 主循环 - 另一种Agent架构参考
