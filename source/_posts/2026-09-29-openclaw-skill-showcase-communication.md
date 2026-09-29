---
title: OpenClaw Skill 每日推荐 - communication（通信工具）
date: 2026-09-29 12:00:00
tags: [openclaw, skill, communication]
categories: [技术推荐]
---

# OpenClaw Skill 每日推荐：communication（通信工具）

> OpenClaw Skill 每日推荐第 8 期。今天聊的是 **communication（通信）** 分类——整个技能库里最"热闹"的一个分类，共收录 **145 个 skills**。从邮件收发、电话外呼，到局域网传文件、会议排期，再到各种"AI agent 社交网络"，应有尽有。

## 今日分类概述

通信类 skill 的核心命题是：**让 AI 助手替你完成"人和人之间"的信息流转**。这个分类大致可以分成几条主线：

- **邮件系**：自动收发、垃圾邮件分诊、人工审批网关（agent-mail、expanso-email-triage、postwall 等）
- **消息平台**：接入 WhatsApp、Rocket.Chat、GroupMe、Telegram 等平台收发消息
- **电话与语音**：外呼、语音邮件（outbound-call、clawring、voice-email）
- **文件与排期**：局域网传输、会议协调（localsend、meetlark、coordinate-meeting）
- **Agent 间社交**：AI 专属社交网络（agent-social、claw-club、koen）——这个赛道热闹得有点意外

挑了 5 个代表性 skill 详解如下。

## 精选 Skill 详解

### 1. localsend — 局域网文件互传，把手机变成 agent 的"投递口"

**⭐⭐⭐⭐⭐（5/5）**

- **作者**：chordlini ｜ [ClawHub 页面](https://clawhub.ai/skills/skills/localsend)
- **核心功能**：通过 LocalSend 协议（AirDrop 的开源平替）在局域网内的任意设备间收发文件和文本，支持 Android、iOS、Windows、macOS、Linux。

**实用场景**：你在电脑上让 agent 处理了一份 PDF，想立刻发到手机上——不用微信传文件助手，不用掏数据线，一句"把刚才的报告发到我手机"就搞定。反过来也行：手机拍的照片直接传给 agent 继续处理。

**技术实现**：这个 skill 的设计有几个亮点：

1. **零依赖 Python CLI**：底层是 `localsend-cli`，一条 curl 命令安装，靠 `openssl` 做 TLS 加密
2. **Telegram 内联按钮交互**：把整个传输流程做成了 `/localsend` 触发的按钮菜单（发送/接收/扫描设备），用 OpenClaw 的 inline button 格式实现，手机上点两下就完成操作
3. **显式状态机**：SKILL.md 里定义了 `idle → awaiting_file → awaiting_confirm` 等状态，并明确规定"在 awaiting_file 状态时，用户发来的任何图片/文件就是要发送的载荷，agent 不得对它发表评论"——这种防御性设计避免了 agent"自作聪明"的典型问题

```bash
# 安装
curl -fsSL https://raw.githubusercontent.com/Chordlini/localsend-cli/master/localsend-cli \
  -o ~/.local/bin/localsend-cli && chmod +x ~/.local/bin/localsend-cli
```

**推荐理由**：解决的是高频真实需求，跨平台兼容性好，交互设计（按钮 + 状态机）堪称 skill 编写的范本。

### 2. postwall — 邮件网关，给 AI 的权限套上"安全带"

**⭐⭐⭐⭐⭐（5/5）**

- **作者**：casperaiassist ｜ [ClawHub 页面](https://clawhub.ai/skills/skills/postwall)
- **核心功能**：在 AI agent 和邮箱之间架一层安全网关。agent 只能读"人类批准过的邮件"，发邮件必须走草稿提交流程，由人审批后才真正发出。

**实用场景**：你想让 agent 日常处理邮箱（整理、摘要、起草回复），但又不放心它直接动你的 Gmail——postwall 的模式正好：agent 把回复草稿提交到审批队列，你扫一眼点个通过，邮件才发出去。

**技术实现**：

- 提供 `postwall` CLI（npm 安装），需要 `POSTWALL_API_KEY`
- 命令设计围绕"审批"展开：`check`（未读审批邮件计数）、`inbox --json`（列表）、`read <id>`（读取，自动标记已读）、`mark-read`（批量已读）
- 发送侧是**强制人工审批**的草稿队列，读侧是**白名单放行**

**推荐理由**：145 个通信 skill 里，大部分都在追求"让 agent 更能干"，postwall 反过来先解决"让 agent 更可控"。这种 human-in-the-loop 的安全设计，是目前邮件自动化最该有的样子。做企业级 agent 集成的同学值得研究它的权限模型。

### 3. meetlark — 为"人类 + AI agent"设计的会议排期

**⭐⭐⭐⭐（4/5）**

- **作者**：mkelk ｜ [ClawHub 页面](https://clawhub.ai/skills/skills/meetlark) ｜ 官网 [meetlark.ai](https://meetlark.ai)
- **核心功能**：一个 Doodle 替代品——创建时间投票、分享链接、收集投票、找出最佳会议时间。关键差异是它同时服务人类和 AI agent。

**实用场景**：跨团队约会议，你说一句"帮我和小王约个评审会，周四周五都行"，agent 建好投票把链接发出去，人类参与者点网页投票，对方团队如果也用 agent，直接走 API 投票。

**技术实现**：API 设计很简洁：

- **双 token 模型**：`adm_...` 管理令牌（私密，查看结果/关闭投票）+ `prt_...` 参与令牌（可分享，多人共用一个链接）
- `POST /api/v1/polls?autoVerify=true` 创建投票，未验证邮箱会自动触发验证邮件
- 人类走 Web UI，agent 走 REST API，同一个投票链接两条通道

**推荐理由**：思路很超前——"会议排期"这件事的拉锯（你不行我不行）恰恰最适合丢给两个 agent 谈判解决。它是这个趋势的早期基础设施。

### 4. outbound-call — 让 agent 主动打电话

**⭐⭐⭐⭐（4/5）**

- **作者**：humanjesse ｜ [ClawHub 页面](https://clawhub.ai/skills/skills/outbound-call)
- **核心功能**：通过 ElevenLabs 语音代理 + Twilio 打出外呼电话，电话那头的语音 agent 和你的 OpenClaw 用同一个大脑。

**实用场景**：预约确认（"明天下午3点的牙医预约，帮我打电话确认一下"）、餐厅订位、给不怎么看手机短信的长辈发送提醒（电话比短信有效得多）。

**技术实现**：

- 依赖三个环境变量：`ELEVENLABS_API_KEY`、`ELEVENLABS_AGENT_ID`、`ELEVENLABS_PHONE_NUMBER_ID`
- 调用就是一个 Python 脚本，号码用 E.164 格式：

```bash
# 基本外呼
python3 skills/outbound-call/call.py +8613800000000

# 带开场白
python3 skills/outbound-call/call.py +8613800000000 "您好，我是助手，来电确认明天的预约"

# 传入上下文变量给语音 agent
```

- 通话中的 agent 接收 dynamic variables 作为上下文，能围绕具体事项对话

**推荐理由**：技术上是最"重"的方案（要配置 Twilio 和 ElevenLabs），但也是唯一能让 agent 触达"电话信道"的。用在外呼提醒、客服回访场景非常合适。注意合规：外呼场景要遵守当地的电话营销法规。

### 5. v2ex — 中文开发者社区的 API 通道

**⭐⭐⭐⭐（4/5）**

- **作者**：timqian ｜ [ClawHub 页面](https://clawhub.ai/skills/skills/v2ex)
- **核心功能**：对接 V2EX API 2.0，访问通知、主题、节点、会员信息。

**实用场景**：

- 每天早上让 agent 汇总你关注节点的热帖
- 监控你发过的主题的回复和 @ 通知，有新动态推给你
- 追踪某个技术话题在社区里的讨论热度

**技术实现**：

- 走标准的 Bearer Token 认证，在 [v2ex.com/settings/tokens](https://www.v2ex.com/settings/tokens) 创建 PAT：

```bash
curl -H "Authorization: Bearer <your-token>" \
  https://www.v2ex.com/api/v2/notifications
```

- 覆盖 `/notifications`、主题、节点、成员四大类端点

**推荐理由**：对中文用户来说是最亲切的一个。配置成本几乎为零，配合 cron 定时任务就能做出一个"V2EX 私人情报员"。

## 应用场景总结

把这 5 个 skill 组合起来，能搭出几套实用的"通信自动化"方案：

| 方案 | 组合 | 说明 |
|------|------|------|
| **私人秘书** | postwall + meetlark | 邮件审批流转 + 会议自动排期，覆盖职场沟通两大痛点 |
| **跨设备工作流** | localsend | 手机/电脑/agent 三端文件流转，替代 AirDrop 的场景补全 |
| **外呼管家** | outbound-call + cron | 定时电话提醒、预约确认，触达不在线的人 |
| **社区情报员** | v2ex + 定时任务 | 中文技术社区的自动监控与日报 |

## 推荐指数排名

| 排名 | Skill | 推荐指数 | 一句话点评 |
|------|-------|---------|-----------|
| 1 | [localsend](https://clawhub.ai/skills/skills/localsend) | ⭐⭐⭐⭐⭐ | 高频刚需 + 交互设计范本 |
| 2 | [postwall](https://clawhub.ai/skills/skills/postwall) | ⭐⭐⭐⭐⭐ | 邮件自动化的正确打开方式 |
| 3 | [meetlark](https://clawhub.ai/skills/skills/meetlark) | ⭐⭐⭐⭐ | 为 agent 时代重做排期工具 |
| 4 | [outbound-call](https://clawhub.ai/skills/skills/outbound-call) | ⭐⭐⭐⭐ | 触达电话信道，配置门槛稍高 |
| 5 | [v2ex](https://clawhub.ai/skills/skills/v2ex) | ⭐⭐⭐⭐ | 中文用户零成本上手 |

## 实用建议

1. **先装 localsend**：五分钟出成果，是体验"agent 操控本地设备"的最佳入门 skill。
2. **邮件类 skill 先看 postwall**：如果你在犹豫要不要让 agent 碰邮箱，从 human-in-the-loop 模式开始，跑顺了再考虑全自动方案（如 email-autoreply）。
3. **通信类 skill 尤其注意凭据安全**：这个分类大量涉及 token 和 API key（Twilio、ElevenLabs、V2EX PAT），务必用环境变量管理，不要写进代码或日志。
4. **分类里的"噪音"要会过滤**：145 个 skill 里有不少是 AI agent 社交网络、加密货币群信号之类的娱乐/投机项目，挑 skill 时优先看 SKILL.md 里有没有清晰的状态设计、错误处理和安全考量——文档质量基本和工程质量正相关。

---

*本文是 OpenClaw Skill 每日推荐系列第 8 期，分类数据来自 [awesome-openclaw-skills](https://github.com/daoyuly/awesome-openclaw-skills)。明天预告：devops-and-cloud（DevOps 与云服务）。*
