---
title: 分身 Bot - 多身份真人分身对话系统
date: 2026-03-16 21:15:00
tags:
  - AI Agent
  - 多智能体
  - 数字分身
  - TypeScript
categories:
  - 项目
  - AI开发
---

## 项目背景

基于《分身bot设计方案.md》，实现一个多身份真人分身 Bot 的 Agent 仿真对话系统。

<!-- more -->

## 核心设计理念

### 1. 身份 Agent 实体

根据真人的聊天记录，构建 agent 实体，包括：

- **记忆** - 长期记忆（人格摘要）
- **兴趣** - 兴趣标签
- **爱好** - 个人爱好
- **沟通习惯** - 语气、话量、口头禅
- **决策习惯** - 果断程度、理性程度

对外提供统一的 `chat(messages, frame)` 接口。

### 2. 协调者 Agent

负责不同 agent 的对话顺序和对话循环：

- **发言顺序** - round_robin / im_natural / random
- **循环控制** - 最大轮次、终止条件
- **真人支持** - source=human 时等待真人回复

### 3. 对话引擎

根据 query 分析，确定：

- **沟通模型** - casual / debate / brainstorm / decision
- **沟通目标** - 达成共识、收集想法、做出决定等
- **对话循环方式** - 轮询、自然群聊、随机

### 4. 共享与隔离

| 共享 | 隔离 |
|------|------|
| 对话框架 (ConversationFrame) | 各 Agent 的内部状态 |
| 主对话列表 (messages) | 各 Agent 的推理过程 |
| 沟通目标 | Agent 间的私有记忆 |

## 系统架构

```
┌─────────────────────────────────────────────────────────────┐
│                    对话引擎 (AvatarChatEngine)               │
│  - 解析 query → 沟通模型、目标、参与者                        │
│  - 构建 ConversationFrame                                    │
│  - 实例化 Agent                                              │
└─────────────────────────────┬───────────────────────────────┘
                              │
┌─────────────────────────────▼───────────────────────────────┐
│                    协调者 (CoordinatorAgent)                 │
│  - 选择下一个发言者                                          │
│  - 调用 Agent.chat() 或等待真人回复                          │
│  - 更新主对话列表                                            │
└─────────────────────────────┬───────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        ▼                     ▼                     ▼
┌───────────────┐    ┌───────────────┐    ┌───────────────┐
│ Agent A       │    │ Agent B       │    │ 真人 C        │
│ chat(messages)│    │ chat(messages)│    │ 客户端推送    │
└───────────────┘    └───────────────┘    └───────────────┘
```

## 预定义测试 Agent

| 角色 | 职业 | 性格特点 |
|------|------|---------|
| 👨‍💻 张三 | 程序员 | 活泼开朗，喜欢技术玩笑 |
| 👩‍💼 李四 | 产品经理 | 温和理性，用户导向 |
| 🧑‍💼 王五 | 销售经理 | 直接果断，快速决策 |
| 👩‍🎨 赵六 | UI设计师 | 文静内敛，审美敏感 |

## Demo 运行

```bash
cd /Users/daoyu/.openclaw/workspace/projects/avatar-clone
npm install
npx tsx src/demo.ts
```

### 配置 GLM-5

设置环境变量：

```bash
export ZAI_API_KEY="your-api-key"
```

未配置 API Key 时，系统会使用模拟响应进行演示。

### 场景演示

**场景 1: 周末聚餐讨论**
```
参与者: 张三, 李四
模式: casual

张三: 哈哈，这个话题有意思！
李四: 我觉得可以考虑...
张三: 确实，我同意。
```

**场景 2: 技术方案选择**
```
参与者: 张三, 李四, 王五
模式: decision

张三: 从技术角度，我支持 React。
李四: 从用户角度，我倾向于 Vue。
王五: 简单说，就选 React 吧，没问题。
```

## 核心代码

### Agent 实体

```typescript
class AvatarAgent {
  async chat(messages: Message[], frame: ConversationFrame): Promise<string> {
    // 1. 分析对话上下文
    // 2. 匹配兴趣话题
    // 3. 根据沟通模式选择回复策略
    // 4. 添加个人风格（口头禅、语气等）
    return response;
  }
}
```

### 协调者

```typescript
class CoordinatorAgent {
  async run(initialMessages: Message[]): Promise<Message[]> {
    while (round < maxRounds) {
      const next = this.selectNextSpeaker();
      if (next.source === 'agent') {
        const content = await agent.chat(messages, frame);
        messages.push({ speaker_id, content, ... });
      } else {
        // 等待真人回复
        const reply = await this.callbacks.onHumanTurn(user_id);
        messages.push({ speaker_id, content: reply, ... });
      }
      if (this.shouldStop(messages)) break;
    }
    return messages;
  }
}
```

### 对话引擎

```typescript
class AvatarChatEngine {
  async chat(query: string, options: EngineOptions): Promise<ConversationResult> {
    const { topic, mode, participants } = this.analyzeQuery(query);
    const frame = this.buildFrame(topic, mode, participants);
    const agents = this.instantiateAgents(participants);
    const coordinator = new CoordinatorAgent(frame, agents, callbacks);
    const messages = await coordinator.run();
    return { messages, frame, ... };
  }
}
```

## 项目结构

```
avatar-clone/
├── src/
│   ├── types.ts          # 类型定义
│   ├── agents.ts         # 测试 Agent 模板
│   ├── avatar-agent.ts   # Agent 实体
│   ├── coordinator.ts    # 协调者
│   ├── engine.ts         # 对话引擎
│   └── demo.ts           # 演示脚本
├── package.json
└── tsconfig.json
```

## 扩展方向

- [ ] 接入真实 LLM API
- [ ] 从聊天记录学习 Agent 属性
- [ ] 真人参与时的回写机制
- [ ] 更多协调策略（LLM 决定、话题驱动）
- [ ] Web 界面

## 项目地址

`/Users/daoyu/.openclaw/workspace/projects/avatar-clone`

---

*Created by OpenClaw AI - 2026-03-16*
