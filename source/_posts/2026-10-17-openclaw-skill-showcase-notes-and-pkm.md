---
title: OpenClaw Skill 每日推荐 - 笔记与知识管理（Notes & PKM）
date: 2026-10-17 11:30:00
tags: [openclaw, skill, notes-and-pkm]
categories: [技术推荐]
---

# OpenClaw Skill 每日推荐：笔记与知识管理（Notes & PKM）（71 个 Skills）

> OpenClaw Skill 每日推荐第 18 期。今天的分类是 **notes-and-pkm**，共收录 71 个 skills，是目前 30 个分类里体量最大的一批之一。这个分类有个很有意思的双重身份：一半的 skill 是帮**你**记笔记的（Apple Notes、flomo、Anki、Cubox），另一半是帮 **Agent 自己**记笔记的（记忆系统、状态持久化、错误模式追踪）。看完你会发现一个趋势：**笔记工具正在从"人的第二大脑"变成"人和 Agent 的共享大脑"**。

## 今日分类概述

Notes & PKM（Personal Knowledge Management，个人知识管理）这个分类可以清晰地切出四条产品线：

| 方向 | 代表 Skills | 说明 |
| --- | --- | --- |
| **笔记应用对接** | apple-notes、bear-notes、craft、upnote、alexandrie、bookstack | 把主流笔记 App 的 API/CLI 包成自然语言指令 |
| **碎片收藏** | flomo-notes、cubox、nosi、tweet-processor | 网页、灵感、推文的一键收藏与结构化 |
| **学习与复盘** | anki-connect、meeting-notes、meeting-to-action、nova-letters | 会议纪要、闪卡、给未来自己写信 |
| **Agent 记忆系统** | agent-memory-ultimate、session-memory、guava-memory、rune、cortex-memory、agent-wal、failure-memory | 给 Agent 装上跨会话的长期记忆 |

第三条线的存在感意外地强——大约三分之一的 skill 都在做"Agent 记忆"。这不难理解：OpenClaw 默认的记忆就是工作区里的几个 Markdown 文件（SOUL.md、MEMORY.md），社区显然觉得这不够，于是各种 SQLite、知识图谱、Write-Ahead Log 方案都来了。下面挑 5 个最有代表性的细讲。

## 精选 Skill 详解

### 1. apple-notes —— 让 Agent 直接读写你的 macOS 备忘录 ⭐5.0

**链接**：[steipete/apple-notes](https://clawskills.sh/skills/steipete-apple-notes)
**安装**：`openclaw skills install @steipete/apple-notes`

**核心功能**：通过开源的 `memo` CLI 操作 Apple Notes，支持创建、查看、编辑、删除、模糊搜索、移动文件夹，还能导出成 HTML 或 Markdown。作者 steipete（Peter Steinberger，iOS 社区的老熟人）出品，质量有保障。

**技术实现机制**：`memo` 是一个 Homebrew 分发的 Rust CLI（`brew tap antoniorodr/memo && brew install antoniorodr/memo/memo`），底层走 macOS 的 AppleScript/框架接口直连备忘录数据库。skill 本身只是教 Agent 怎么调用这条命令链，不涉及任何云 API——数据全程留在本地，隐私上很干净。

**实用场景举例**：

- 你在地铁上发条消息："记一下，周三之前把护照续签材料准备好"——Agent 直接写进备忘录
- "帮我搜一下之前记的 Airbnb 折扣码"，模糊搜索全库
- "把上周的旅行清单导出成 Markdown"，顺手就能贴进博客或 Notion

**推荐理由**：零成本、零新账号、数据本地化。对 macOS 用户来说这是"装完就能用"的典型，也是我给满分的原因。

### 2. flomo-notes —— 一句话把想法投进 flomo 收件箱 ⭐4.5

**链接**：[xiaoluoboding/flomo-notes](https://clawskills.sh/skills/xiaoluoboding-flomo-notes)
**安装**：`openclaw skills install @xiaoluoboding/flomo-notes`

**核心功能**：通过 flomo 的收件箱 Webhook 保存笔记。对 Agent 说"save to flomo"或"记录到 flomo"，它就把内容用一次 HTTP POST 打进你的 flomo 账号。

**技术实现机制**：flomo 没有开放 API，官方唯一认可的程序化入口就是 Pro 会员的 inbox webhook。这个 skill 做的事非常克制：读环境变量 `FLOMO_WEBHOOK_URL`，把文本包成 webhook 约定的格式发出去。整个 skill 没有复杂依赖，属于"半小时看懂源码"的类型。

**实用场景举例**：

- 阅读时随手说一句"这个观点记到 flomo：卡片笔记法的本质是输出倒逼输入 #阅读 #PKM"
- 开会中让 Agent 把 takeaway 直接流进 flomo 时间线
- 带标签的中文速记——flomo 的 #标签 语法被完整保留

**推荐理由**：flomo 在中文用户里渗透率极高，这个 skill 等于给你的聊天窗口接了一根直通 flomo 的管子。缺点也很明确：只进不出，搜索和整理还是得回 flomo 做。

### 3. cubox —— 网页收藏的自动化管道 ⭐4.0

**链接**：[liam8/cubox](https://clawskills.sh/skills/liam8-cubox)
**安装**：`openclaw skills install @liam8/cubox`

**核心功能**：通过 Cubox 的 Open API 保存网页和文字备忘，支持自定义标题、描述、标签、目标文件夹。

**技术实现机制**：同样走官方 API 扩展（设置 → 扩展中心 → API 扩展里拿个人 API URL，配成 `CUBOX_API_URL` 环境变量）。相比浏览器插件一次次手动点收藏，skill 化之后收藏动作可以被编排进任何工作流——比如"读完了这篇文章，摘要存 Cubox、金句存 flomo、待办进备忘录"一句话三连。

**实用场景举例**：

- 让 Agent 每天扫一遍你关注的博客，把值得读的自动收进 Cubox 的"稍后读"文件夹
- 研究某个主题时，批量归档搜索结果页并打好标签
- 聊天中随手丢一个链接："收进 Cubox，标签 #AI #基础设施"

**推荐理由**：需要 Cubox Premium 才能用 API，这是门槛；但如果你本来就是重度用户，它把"收藏"从主动动作变成了副产品。

### 4. anki-connect —— 把 Agent 变成你的出题老师 ⭐4.5

**链接**：[gyroninja/anki-connect](https://clawskills.sh/skills/gyroninja-anki-connect)
**安装**：`openclaw skills install @gyroninja/anki-connect`

**核心功能**：通过 AnkiConnect 插件的 REST API 程序化操作 Anki：建卡、改卡、搜卡、管理牌组和模板，全程不用打开 Anki 界面。

**技术实现机制**：AnkiConnect 是 Anki 的经典插件，在本地起一个 HTTP 服务（默认 `localhost:8765`），暴露 JSON-RPC 风格的接口。skill 教 Agent 调用这些端点做 CRUD。前提条件：Anki 桌面端在跑 + 装好 AnkiConnect 插件。

**实用场景举例**：

- "我刚读完这篇讲 TCP 拥塞控制的文章，帮我出 10 张闪卡进 #网络 牌组"——这才是 LLM 和间隔重复的正确组合方式
- 阅读外文文章时遇到生词，自动查词建卡进词汇牌组
- 先搜后建，避免重复卡片；发现讲错了，一句话改卡

**推荐理由**：Anki 的痛点从来不是复习，而是**做卡片太累**。LLM 恰好擅长从内容里生成问答对。这个组合是我心目中"AI + 学习"最落地的形态之一，唯一遗憾是要求 Anki 桌面端常驻。

### 5. agent-memory-ultimate —— 给 Agent 装一个"睡眠整理"过的长期记忆 ⭐4.0

**链接**：[globalcaos/agent-memory-ultimate](https://clawskills.sh/skills/globalcaos-agent-memory-ultimate)
**安装**：`openclaw skills install @globalcaos/agent-memory-ultimate`

**核心功能**：一套生产级的 Agent 记忆系统：每日日志、睡眠整理（sleep consolidation，类比人类睡眠时大脑固化记忆的机制，定期把散落的日志压缩、去重、归档）、SQLite + FTS5 全文检索，还带 WhatsApp 聊天记录、ChatGPT 导出、VCF 通讯录的导入器。

**技术实现机制**：不走向量数据库的重路线，而是 SQLite + FTS5（内置全文搜索扩展）——单文件、零运维、检索够快，非常适合跑在个人机器上。"睡眠整理"由定时任务触发，把当天日志浓缩成结构化记忆，控制上下文膨胀。

**实用场景举例**：

- Agent 记得你三个月前说过"对花生过敏"，推荐菜谱时主动避开
- 把历史 WhatsApp 聊天导进去，Agent 一开箱就"认识"你
- 会话崩溃/重启后，记忆不丢，人设不崩

**推荐理由**：这是理解这个分类下半场（Agent 记忆）的最佳样本：不追新概念，用的都是 SQLite 这种老掉牙但可靠的积木。想给自研记忆方案找参照物的，值得读它的 SKILL.md。类似思路的还有 session-memory（轻量工具箱）、agent-wal（用数据库的 Write-Ahead Log 思想做状态持久化）、failure-memory（把翻车记录变成防复发模式）——整个赛道已经卷起来了。

## 应用场景总结

把这 5 个 skill 串起来，就是一条完整的个人知识流水线：

```text
信息输入            整理沉淀              记忆固化
─────────          ─────────            ─────────
cubox 收网页   →   apple-notes 写正式   →   anki-connect
flomo 接灵感       笔记/导出 Markdown       变成闪卡长期复习
                   meeting-to-action       agent-memory-ultimate
                   把会议变成行动项          让 Agent 自己也记得
```

三条实用建议：

1. **不要全都要**。笔记工具最大的坑是同时用五个、每个都只记了三天。先选一条主线（比如 flomo 收灵感 + Apple Notes 存正式笔记），skill 只是你现有习惯的加速器。
2. **闪卡生成是 LLM 的甜点区**。如果你有考证、学语言、学技术的需求，`anki-connect` + 让 Agent 读材料出卡，投入产出比可能是整个分类最高的。
3. **Agent 记忆类 skill 谨慎上车**。这一批实验性强、质量参差，而且涉及把你所有对话写进本地数据库——装之前想清楚两件事：数据在哪、怎么删。

## 推荐指数排名

| 排名 | Skill | 推荐指数 | 一句话点评 |
| --- | --- | --- | --- |
| 🥇 | apple-notes | ⭐⭐⭐⭐⭐ | macOS 用户零门槛接入，数据全本地 |
| 🥈 | anki-connect | ⭐⭐⭐⭐½ | LLM 出题 + Anki 复习，学习自动化最优解 |
| 🥉 | flomo-notes | ⭐⭐⭐⭐½ | 中文用户最顺手的灵感捕捉管子 |
| 4 | cubox | ⭐⭐⭐⭐ | 收藏自动化，Premium 门槛换工作流编排 |
| 5 | agent-memory-ultimate | ⭐⭐⭐⭐ | Agent 记忆赛道的工程化样本 |

---

*本文是「OpenClaw Skill 每日推荐」系列第 18 篇，分类数据来自 [awesome-openclaw-skills](https://github.com/VoltAgent/awesome-clawdbot-skills)。明天的分类：pdf-and-documents（PDF 与文档）。*
