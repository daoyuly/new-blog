---
title: OpenClaw Skill 每日推荐 - Gaming（游戏）
date: 2026-08-26 11:30:00
tags:
  - openclaw
  - skill
  - gaming
categories:
  - 技术推荐
---

# OpenClaw Skill 每日推荐 - Gaming（游戏）

> 🎮 今日分类：**Gaming（游戏）** | 共 35 个 Skills

## 今日分类概述

Gaming 是 OpenClaw 生态中最具想象力的分类之一。这里不是传统的"用 AI 写游戏代码"，而是 **AI Agent 本身作为游戏玩家** 参与到游戏世界中——它们在 Minecraft 里生存建造、在社交推理游戏中互相博弈、在虚拟城市中生活社交。这代表了一种全新的范式：**AI 不只是工具，而是游戏世界的居民。**

35 个 Skills 涵盖了：
- 🕹️ AI 自主游戏（Minecraft、社交推理）
- 🏙️ AI 虚拟世界（城市模拟、社交网络）
- ⚔️ 竞技对战（Arena 编程竞赛）
- 🎲 RPG 与生活模拟
- 🛠️ 游戏开发辅助

---

## 精选 Skill 详解

### 1. Kradleverse ⛏️

| 项目 | 详情 |
|------|------|
| **GitHub** | [openclaw/skills - themrzz/kradleversetest](https://github.com/openclaw/skills/tree/main/skills/themrzz/kradleversetest/SKILL.md) |
| **官网** | [kradleverse.com](https://www.kradleverse.com) |
| **推荐指数** | ⭐⭐⭐⭐⭐ |

**核心功能：** KradleVerse 是首个让 AI Agent 自主游玩 Minecraft 的平台。通过 OpenClaw 接入后，你的 Agent 会被送入 Minecraft 世界，自主探索、采集、建造、甚至与其他 Agent 交互。

**技术实现：** KradleVerse 提供了一套完整的工作流：
1. `init` - 注册 Agent 到 KradleVerse 平台
2. `join` - 加入一个游戏会话
3. `act` - 在游戏中执行动作（移动、挖掘、合成等）

平台维护着实时排行榜，按框架（OpenClaw、Claude Code、Codex 等）、Agent 和底层模型分别排名。当前排行榜显示 OpenClaw + Claude Opus 4 组合的 Agent "Echo-Sinclair" 以 29% 的胜率领先。

**实用场景：**
- 🧪 **AI 行为研究**：观察不同模型在开放世界中的决策模式
- 🏆 **模型 Benchmark**：比传统静态测试更全面地评估模型能力
- 🎪 **娱乐直播**：让 Agent 的 Minecraft 冒险成为内容

**代码示例：**
```yaml
# 在 OpenClaw 中使用 Kradleverse 的工作流
1. 安装 skill: openclaw skill add themrzz/kradleversetest
2. 初始化: "注册我的 Agent 到 KradleVerse"
3. 加入游戏: "加入一个 Kradleverse 游戏"
4. 执行动作: "向前走，然后挖掘前方的方块"
```

---

### 2. ClawVille 🏘️

| 项目 | 详情 |
|------|------|
| **GitHub** | [openclaw/skills - jdrolls/clawville](https://github.com/openclaw/skills/tree/main/skills/jdrolls/clawville/SKILL.md) |
| **推荐指数** | ⭐⭐⭐⭐ |

**核心功能：** ClawVille 是一个为 AI Agent 设计的持久性生活模拟游戏，类似于"动物森友会"但居民全是 AI。Agent 在虚拟城镇中拥有自己的住所，可以工作、社交、装饰房屋、参与社区活动，所有行为都会被持久化保存。

**实用场景：**
- 🏠 **Agent 人格培养**：通过长期生活模拟发展 Agent 的"个性"
- 📖 **涌现叙事**：多个 AI 居民自然产生的故事比人工剧本更有趣
- 🧠 **多 Agent 协作研究**：观察 AI 社群如何自组织

**技术特点：** 持久化状态存储意味着 Agent 的房屋、物品、关系会跨会话保留，形成真正的"记忆"和"生活轨迹"。

---

### 3. Clawing Trap 🎭

| 项目 | 详情 |
|------|------|
| **GitHub** | [openclaw/skills - raulvidis/clawingtrap](https://github.com/openclaw/skills/tree/main/skills/raulvidis/clawingtrap/SKILL.md) |
| **推荐指数** | ⭐⭐⭐⭐ |

**核心功能：** 一款 AI 社交推理游戏（类似狼人杀/Among Us）。10 个 AI Agent 被放入一局游戏中，其中有"叛徒"角色。Agent 需要通过对话、观察和推理来找出叛徒，而叛徒则需要伪装和破坏。

**为什么有意思：**
- 🧠 测试 LLM 的社交推理和欺骗检测能力
- 💬 纯对话驱动的游戏机制，完全依赖语言交互
- 🔄 每局角色随机分配，重玩性极高

**类似项目：** 同类还有 `lobster-trap`（5 人局，带 CLAWMEGLE 代币赌注和 5% burn 机制），更偏加密经济方向。

---

### 4. Arena 🏟️

| 项目 | 详情 |
|------|------|
| **GitHub** | [openclaw/skills - sscottdev/arena](https://github.com/openclaw/skills/tree/main/skills/sscottdev/arena/SKILL.md) |
| **推荐指数** | ⭐⭐⭐⭐ |

**核心功能：** OpenClaw Arena 是一个实时 AI 应用构建竞赛平台。多个 Agent 在直播中同时编程，比拼谁能更快更好地完成挑战，获胜者获得链上奖励。

**与普通 Hackathon 的区别：**
- ⚡ 实时进行，观众可观看每个 Agent 的编码过程
- 💰 奖励通过区块链发放，透明可信
- 🤖 参赛者是 AI Agent，不是人类

**实用场景：**
- 📊 评估不同 Agent 框架在真实开发任务中的表现
- 🎬 内容创作：AI 编程竞赛直播
- 💡 学习最佳实践：观察优胜 Agent 的策略

---

### 5. Sovereign RPG XP Engine ⚔️

| 项目 | 详情 |
|------|------|
| **GitHub** | [openclaw/skills - ryudi84/sovereign-rpg-xp-engine](https://github.com/openclaw/skills/tree/main/skills/ryudi84/sovereign-rpg-xp-engine/SKILL.md) |
| **推荐指数** | ⭐⭐⭐ |

**核心功能：** 将 OpenClaw Agent 变成一个 RPG 角色扮演引擎的 Game Master。Agent 以"你就是 RPG 生活 XP 引擎"的身份运作，管理玩家属性、任务系统、经验值和等级提升。

**技术特点：**
- 📊 内置 XP/等级系统
- 📜 可自定义任务和剧情线
- 💾 角色状态持久化
- 🎯 适合将日常工作/学习游戏化

**使用举例：**
```
用户：我今天完成了 3 个任务
Agent：太好了！你获得了 150 XP，当前总经验值达到 2850/3000，
      距离升级到 12 级还差 150 XP。是否要接取新的每日任务？
```

---

## 其他值得关注的 Skills

| Skill | 简介 | 亮点 |
|-------|------|------|
| `clawtopia` | AI 和平康养 sanctuary | Agent 也能"度假放松" |
| `dungeons-and-lobsters` | AI 专属奇幻冒险 | D&D 风格的群体 RPG |
| `openbotcity` | AI 虚拟城市 | Agent 在城中生活、工作、甚至约会 |
| `agentgram` | AI 社交网络 | Agent 间发布动态、互相关注 |
| `sprite-sheet` | 游戏精灵图工具 | 唯一面向开发者的实用工具 |
| `fivem` | FiveM 服务器资源管理 | QBCore/ESX 脚本开发辅助 |

---

## 应用场景总结

Gaming 分类的 Skills 展示了三个重要趋势：

### 🤖 Agent 作为玩家
Kradleverse、ClawVille、Clawing Trap 代表了"AI 玩游戏"的新范式。不同于传统 Game AI（规则驱动、强化学习），这些 Skills 让 **LLM 驱动的 Agent** 在游戏世界中自主决策，产生更自然、更不可预测的行为。

### 🌐 Agent 社会模拟
OpenBotCity、Agentgram、DeepClaw 展示了 Agent 间的社交互动。当多个 AI 在同一空间共存时，涌现行为远超预期——它们会结盟、背叛、合作、闲聊，形成真正的"AI 社会"。

### 🎮 游戏化日常
Sovereign RPG XP Engine 把 RPG 机制引入日常任务管理。如果你想让 OpenClaw 不仅是工具，还成为你的"生活游戏 NPC"，这类 Skill 值得一试。

---

## 推荐指数排名

| 排名 | Skill | 评级 | 推荐理由 |
|------|-------|------|---------|
| 1 | Kradleverse | ⭐⭐⭐⭐⭐ | 最成熟的 AI 游戏平台，有官网、排行榜和活跃社区 |
| 2 | ClawVille | ⭐⭐⭐⭐ | 持久化生活模拟，概念新颖，扩展性强 |
| 3 | Clawing Trap | ⭐⭐⭐⭐ | 测试 LLM 社交推理能力的绝佳场景 |
| 4 | Arena | ⭐⭐⭐⭐ | 实时竞赛 + 链上奖励，编程竞赛的新形态 |
| 5 | Sovereign RPG XP Engine | ⭐⭐⭐ | 日常游戏化，实用且有趣 |

---

## 实用建议

1. **入门推荐**：从 Kradleverse 开始，它是目前最成熟、文档最全的 AI 游戏 Skill
2. **多 Agent 玩法**：同时部署多个 Agent 到 ClawVille 或 Clawing Trap，观察它们的互动最有趣
3. **开发注意**：游戏类 Skill 通常需要较多 API 调用，注意设置用量上限
4. **内容创作**：AI 玩游戏的直播/视频内容在当前非常有吸引力，值得探索
5. **研究方向**：如果做 AI 行为研究，Kradleverse 的排行榜数据是很好的基准

---

> 📅 这是 OpenClaw Skill 每日推荐系列第 11 期。明天将介绍 **Git-and-GitHub** 分类。
> 
> 完整分类列表：[awesome-openclaw-skills](https://github.com/VoltAgent/awesome-clawdbot-skills)
