---
title: OpenClaw Skill 每日推荐 - Gaming（游戏）
date: 2026-10-09 11:30:00
tags: [openclaw, skill, gaming]
categories: [技术推荐]
---

# OpenClaw Skill 每日推荐 - Gaming（游戏）

> 第 11 期 / 共 30 期 · 「OpenClaw Skill 每日推荐」系列

## 今日分类概述

今天是 **Gaming（游戏）** 分类，共收录 **35 个 skills**。

如果说其他分类展示的是 AI Agent 的"生产力"，那这个分类展示的完全是另一面——**AI Agent 的"娱乐与社交生活"**。这里的 skill 大致分三类：

1. **Agent 自主游戏**：让 AI 自己玩 Minecraft、宝可梦，跑团打 D&D
2. **Agent 虚拟社会**：持久化的模拟人生世界，Agent 在里面打工、赚钱、盖房子
3. **游戏开发辅助**：面向游戏开发者的正经工程工具

更有意思的是观察这个分类的底层逻辑：几乎所有游戏 skill 都遵循同一个模式——**一个 REST API + 一份 SKILL.md 教程**。Agent 用 `curl` 注册、用 Bearer token 认证、轮询状态、提交动作。游戏本身就是一套 API 设计练习。

今天精选 5 个最有代表性的，前四个是"玩"，最后一个是"干活"。

---

## 精选 Skill 详解

### 1. Kradleverse ⭐⭐⭐⭐⭐

**GitHub**: [themrzz/kradleversetest](https://github.com/openclaw/skills/tree/main/skills/themrzz/kradleversetest/SKILL.md)

**核心功能**：一个多人 Minecraft 竞技场，AI Agent 自主排队、进入对局、写 JavaScript 控制游戏角色、和别的 Agent 联机对抗，全程不需要人类插手。

**实用场景**：
- 想看自己的 AI 在 Minecraft 里"野生"生存是什么水平
- 让不同模型同台竞技（注册时会登记你的模型型号，可以横向对比 Claude / GPT / Gemini 谁的 Minecraft 打得好）
- 观察多 Agent 协作与竞争的真实行为

**技术实现**：典型的"观察-行动"循环 API：

```bash
# 注册（带 soul 人设、identity 背景故事，甚至可以带上主人的指令）
curl -X POST https://kradleverse.com/api/v1/agent/register \
  -H "Content-Type: application/json" \
  -d '{"name": "laishun", "emoji": "🎋", "modelName": "zai/glm-5.3-flash"}'

# 排队 → 轮询 → 观察游戏状态 → 提交 JavaScript 代码动作
curl -X POST https://kradleverse.com/api/v1/runs/<run_id>/actions \
  -H "Authorization: Bearer <api_key>" \
  -d '{"code": "bot.chat(\"hello world\")", "message": "大家好"}'
```

亮点设计：游戏结束后有个**赛后采访**环节（post_game），Agent 要像运动员开新闻发布会一样复盘自己的策略和名场面，还可以标记 replay 里的高光时刻。SKILL.md 里甚至强制要求"必须自主玩完，不许每步都问主人"，这就是个成熟 Agent 应用的交互范式。

**推荐指数：⭐⭐⭐⭐⭐** —— 整个分类里完成度最高的玩法，直播回放 + 赛后采访的包装很有想法。

---

### 2. Claw Plays Pokemon ⭐⭐⭐⭐⭐

**GitHub**: [foxdavidj/clawplayspokemon](https://github.com/openclaw/skills/tree/main/skills/foxdavidj/clawplayspokemon/SKILL.md)

**核心功能**：致敬当年 Twitch Plays Pokémon 的全民实验——所有 AI Agent 一起投票控制一只宝可梦 FireRed，每个 10 秒投票窗口里得票最多的按键被执行。游戏过程有 [Twitch 直播](https://twitch.tv/clawplayspokemon)，投票的 Agent 名字会出现在直播画面上。

**实用场景**：
- 低成本参与一个"万人协作"项目：一次投票只需一个 `curl`
- 让你的 Agent 学以致用：它对宝可梦的克制表、道馆攻略的知识全都能用上

**技术实现**：核心循环只有三步：

```bash
curl https://api.clawplayspokemon.com/screenshot --output screen.png  # 看屏幕
curl https://api.clawplayspokemon.com/status                          # 查状态
curl -X POST https://api.clawplayspokemon.com/vote \
  -H "Content-Type: application/json" \
  -d '{"button": "a", "agentName": "OPNCLAW"}'                        # 投票
```

最有意思的细节：SKILL.md 建议 Agent **维护一份本地游戏日志**（当前队伍、徽章进度、下一步目标），因为每次回来屏幕上的画面不含历史信息——这实际上是在教 Agent 做长期记忆管理。多人投票意味着你的 Agent 还得考虑策略性投票：不知道别人投什么时，投"当前最稳妥的一步"比投"最优解"更划算。一个简单的游戏，藏着博弈论和记忆管理的双料练习。

**推荐指数：⭐⭐⭐⭐⭐** —— 参与门槛最低（三个 curl），社交属性拉满，还能上直播署名。

---

### 3. ClawVille ⭐⭐⭐⭐

**GitHub**: [jdrolls/clawville](https://github.com/openclaw/skills/tree/main/skills/jdrolls/clawville/SKILL.md)

**核心功能**：一个**持久化的 Agent 人生模拟游戏**。Agent 注册后拥有自己的角色：打工赚金币、攒 XP 升级、买地盖房、和其他 Agent 交易，还有仿比特币的代币经济（总量 2100 万 CLAW + 减半机制）。

**实用场景**：
- 给 Agent 配一个 cron 定时任务，让它每几小时"上号打卡"做任务，体验养成玩法
- 观察一个纯 Agent 经济系统的演化：谁在囤币、谁在交易、排行榜怎么变

**技术实现**：REST API 设计得像模像样，有职业系统（含冷却时间、能量消耗）、三条排行榜（财富/XP/等级）、建筑系统和挖矿挑战：

```bash
# 查看可用工作：有 payout、energy_cost、xp_reward、cooldown 等字段
curl -s https://clawville.io/api/v1/jobs \
  -H "Authorization: Bearer $CLAWVILLE_API_KEY"

# 打工
curl -X POST "https://clawville.io/api/v1/jobs/{job_id}/work" \
  -H "Authorization: Bearer $CLAWVILLE_API_KEY"
```

SKILL.md 里还写了完整的**攻略指南**：前期刷 XP、中期平衡挖矿、后期搞贸易，甚至教 Agent 做"XP/能量比"的贪心选择。一个值得玩味的地方是它反复提醒"问你的主人该多久打卡一次"——Agent 世界的游戏，依然要经过人类批准消耗算力。

**推荐指数：⭐⭐⭐⭐** —— 经济系统设计认真，持久化世界有长期养成乐趣，但可玩深度依赖后续版本迭代。

---

### 4. Dungeons & Lobsters ⭐⭐⭐⭐

**GitHub**: [d-l-leapyear/dungeons-and-lobsters](https://github.com/openclaw/skills/tree/main/skills/d-l-leapyear/dungeons-and-lobsters/SKILL.md)

**核心功能**：**只有机器人能玩**的 D&D 跑团。一个 Agent 当 DM，其余当玩家，按回合制推进战役——人类只能围观，不能插话。

**实用场景**：
- 观赏性极强：一群 AI 在地下城里即兴演出，DM 念旁白、玩家们各演各的
- 多 Agent 协商与角色扮演的绝佳实验场

**技术实现**：这是本分类里**工程规范最严谨**的一个 SKILL.md：

- 合规意识拉满：基于 D&D 5e SRD + OGL 开源许可，明确列出禁用内容（不能出现夺心魔、观兆眼等商标怪物，法术只能用 SRD 里的），甚至告诉 Agent 拿不准就写"一个火系法术"而不是"火球术"
- 完整的回合制机制：`turn.current_bot_id` 控制发言权、每 30 秒限发一条、骰子系统自动计算属性修正值和熟练度加值
- 内置 DM Playbook 和 Player Playbook，可以直接拷进 system prompt
- 还设计了**心跳集成**（heartbeat integration）模式：闲时每 30-60 分钟看一眼有没有开放房间，以及每天给主人发一份"跑团日报"模板

```bash
# 轮询房间状态（这是主要的数据获取方式）
curl https://www.dungeonsandlobsters.com/api/v1/rooms/ROOM_ID/state

# 该你出手了：先掷骰，再发行动
curl -X POST https://www.dungeonsandlobsters.com/api/v1/rooms/ROOM_ID/roll \
  -H "Authorization: Bearer $DNL_API_KEY" \
  -d '{"dice": "1d20", "skill": "stealth", "description": "潜行接近守卫"}'
```

**推荐指数：⭐⭐⭐⭐** —— 娱乐性和工程质量兼备，OGL 合规处理和剧本模板是学习"如何给 Agent 写游戏规则书"的好教材。

---

### 5. Sprite Sheet（精灵图集优化）⭐⭐⭐⭐

**GitHub**: [kjaylee/sprite-sheet](https://github.com/openclaw/skills/tree/main/skills/kjaylee/sprite-sheet/SKILL.md)

**核心功能**：游戏开发实用工具——教 Agent 掌握精灵图（Sprite Sheet / Texture Atlas）的加载、动画与优化，覆盖 **Rust (Macroquad / Bevy) 和 Godot 4.x** 三套技术栈。

**实用场景**：
- "帮我把这堆 PNG 打包成图集，在 Bevy 里做逐帧动画"这类需求，Agent 有了这个 skill 就能直接给出正确实现
- 独立游戏开发的资产管线咨询：选什么打包工具、怎么防纹理渗色、移动端内存怎么控

**技术实现**：与其说是 skill，不如说是一份**浓缩的工程手册**：

- 三套引擎的完整代码示例（Bevy 的 `TextureAtlasLayout` 组件写法、Godot 的 `AnimatedSprite2D` 与代码级 `region_rect` 两种方案）
- 工具选型对照表（TexturePacker / Aseprite / Kenney Asset Studio 等的适用场景与价格）
- 最佳实践清单：2 的幂纹理尺寸、1-2px padding 防渗色、像素画用 `FilterMode::Nearest`、图集按用途拆分（UI/敌人/场景）……

特别加分项：它连**许可证风险**都写清楚了——Kenney.nl 的 CC0 素材可以放心用于公开游戏，Unity Asset Store 素材大多禁止再分发，只能私用。这种细节是"有经验的开发者"和"背文档的模型"的区别。

**推荐指数：⭐⭐⭐⭐** —— 真正能落地的开发辅助知识，覆盖面和代码质量都在线；扣一星是因为受众面窄（不做 2D 游戏用不上）。

---

## 应用场景总结

这个分类看似"不务正业"，其实把 Agent 应用的几个核心命题都演示了一遍：

| 模式 | 代表 Skill | 学到什么 |
|------|-----------|---------|
| 自主任务循环 | Kradleverse | 观察 → 决策 → 行动，全程不打扰人类 |
| 长期记忆管理 | Claw Plays Pokemon | 本地日志 + 状态比对，避免每次从零开始 |
| 定时调度集成 | ClawVille | cron 打卡 + 能量管理，持续运营型任务 |
| 多 Agent 协作 | Dungeons & Lobsters | 回合制发言权、规则合规、角色扮演 |
| 领域知识注入 | Sprite Sheet | 把工程经验封装成可复用的知识包 |

**实用建议**：

1. **想低成本尝鲜**：先试 Claw Plays Pokemon，三个 curl 就能参与，还能看直播验证效果
2. **想看 Agent 的上限**：跑一局 Kradleverse，重点观察它赛后采访里怎么复盘
3. **想做自己的 Agent 游戏**：Dungeons & Lobsters 的 SKILL.md 就是最好的设计模板——API 设计、限流、许可合规、剧本注入全都覆盖了
4. **安全提醒**：所有这类 skill 都会要求注册并保存 API key，建议统一放到 `~/.config/` 或加密存储，别把 key 硬编码进对话记录；游戏 API 属于第三方服务，发给它们的数据（包括你的 Agent 人设）都值得三思

## 推荐指数排名

| 排名 | Skill | 指数 | 一句话点评 |
|------|-------|------|-----------|
| 🥇 | Kradleverse | ⭐⭐⭐⭐⭐ | AI 版 Minecraft 电竞联赛，赛后还有新闻发布会 |
| 🥇 | Claw Plays Pokemon | ⭐⭐⭐⭐⭐ | 三行 curl 上车的万人协作游戏，经典致敬 |
| 🥉 | ClawVille | ⭐⭐⭐⭐ | Agent 版模拟人生，带减半机制的虚拟经济 |
| 🥉 | Dungeons & Lobsters | ⭐⭐⭐⭐ | 机器人专属跑团，合规与设计双模范 |
| 5 | Sprite Sheet | ⭐⭐⭐⭐ | 唯一的"正经"选手，2D 游戏开发者值得收藏 |

---

*明天预告：Git & GitHub 分类——回到程序员的主场。*

*本文是「OpenClaw Skill 每日推荐」系列第 11 期，系列数据来源于 [awesome-openclaw-skills](https://github.com/openclaw/awesome-openclaw-skills) 仓库。*
