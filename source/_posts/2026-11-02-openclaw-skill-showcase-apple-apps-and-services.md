---
title: OpenClaw Skill 每日推荐 - Apple 应用与服务（apple-apps-and-services）
tags:
  - openclaw
  - skill
  - apple-apps-and-services
categories:
  - 技术推荐
abbrlink: 53646
date: 2026-11-02 11:30:00
---

# OpenClaw Skill 每日推荐 - Apple 应用与服务

> 「OpenClaw Skill 每日推荐」第 31 期，**第三轮第 1 期**。继续从 [awesome-openclaw-skills](https://github.com/openclaw/skills)（全库 5300+ 条目、30 个分类）中每天取一个分类，精选代表性 skill 深入介绍。今天进入 **Apple 应用与服务（Apple Apps & Services）**——如果说前两轮大多在教 Agent「上网、写码、管事」，这一期是教 Agent「摸你的 Mac」：健康数据、提醒事项、快捷指令、Apple TV、照片笔记……macOS 三十年攒下的系统能力，正在变成 Agent 的手脚。

## 今日分类概述

Apple Apps & Services 收录 **44 个 skills**，规模不大，但主题高度集中——几乎全部围绕「让 Agent 直接操作系统级应用」展开。粗分画像：

| 主题 | 数量 | 代表 |
| --- | --- | --- |
| 健康与运动数据 | 2 | apple-health-skill、healthkit-sync |
| 提醒 / 日历 | 3 | apple-remind-me、mh-apple-reminders、ics-import-on-iphone |
| Apple 硬件与定位 | 4 | appletv、icloud-findmy、findmy-location、apple-find-my-local |
| 笔记 / 邮件 / 通讯录 | 6 | mac-notes-agent、managing-apple-notes、apple-mail-search、drafts、apple-contacts、skill-email-management |
| 语音合成 / 识别（云外方案） | 4 | say、mac-tts、voice-wake-say、clawdbot-skill-voice-wake-say（后两条实为同一工具的重复收录） |
| Apple Silicon 本地模型 | 3 | mlx-stt、mlx-tts、mlx-swift-lm |
| 系统自动化 | 3 | shortcuts-generator、macos-native-automation、get-focus-mode |
| 媒体与照片 | 2 | apple-photos、apple-music |
| 包管理 / 清理 / 网络 | 4 | homebrew、mole-mac-cleanup、network-scanner、fzf-fuzzy-finder |
| 其他 | 13 | testflight-monitor、apple-search-ads-skill、my-tesla、inkjet（蓝牙热敏打印机）、imessage-signal-analyzer、callmac 等 |

两个观察：

1. **这个分类是「操作系统 API 的 Agent 化」最密集的地方。** 别的分类接入的是 SaaS API（要 key、要订阅、数据过第三方），这里接入的是 AppleScript、HealthKit、Shortcuts、Find My——本地、免登录、数据不出机器。
2. **分类边界依然松弛。** homebrew、fzf-fuzzy-finder（通用 CLI 工具）、my-tesla（特斯拉车主 API）、monolith（加密钱包）混在里面，属于「作者觉得跟 Mac 有关」就放这儿了。逛这个分类时留意别被目录名骗了。

## 精选 Skill 详解

### 1. shortcuts-generator — 用自然语言生成快捷指令

[GitHub](https://github.com/openclaw/skills/tree/main/skills/erik-agens/shortcuts-skill/SKILL.md)

**核心功能**：把「帮我做个快捷指令，把剪贴板里的链接存进备忘录并加日期标题」这类需求，直接生成 macOS/iOS 快捷指令的 plist 文件并导入运行。等于给 Agent 配了一个「快捷指令编译器」。

**实用场景**：

- 不会拖快捷指令图块的普通用户，动嘴就能生成自动化流程；
- 生成「截图自动 OCR 并归档」「到家自动发消息」这类系统级动作；
- 给家里长辈的 iPhone 批量做简化操作：一键叫车、一键发定位。

**技术实现**：快捷指令的本质是 plist 定义文件，macOS 自带 `shortcuts` CLI（支持 run/list/sign 等子命令）。这个 skill 做的事就是把自然语言翻译成合法的动作 plist，再导入 Shortcuts 执行。思路和整个分类一脉相承：**Agent 不需要 Apple 新开 API，Apple 早就留好了门，只是以前没人替你写 plist。**

**推荐理由**：如果只能在这个分类装一个 skill，我选它。它不是「多一个工具」，而是能力放大器——一旦能用自然语言生成快捷指令，等于把 Shortcuts 生态里几百个系统动作整体变成了 Agent 的动作库。

**推荐指数**：⭐⭐⭐⭐⭐

### 2. apple-health-skill — 跟自己的健康数据聊天

[GitHub](https://github.com/openclaw/skills/tree/main/skills/nftechie/apple-health-skill/SKILL.md)

**核心功能**：把 Apple Health 数据变成可对话的接口——问「这周跑了几次步」「最近静息心率趋势怎么样」「活动圆环连续合上了多少天」，Agent 直接从数据里找答案。

**实用场景**：

- 周日晚让 Agent 出一份「本周运动复盘」：训练量、心率区间、与上周对比；
- 「我最近是不是练太猛了？」——结合静息心率升高、睡眠变差给出提示；
- 体检前整理近三个月的指标记录，就诊时直接带着结论去。

**技术实现**：Apple Health 的数据锁在 HealthKit 里，而 macOS 端没有原生 HealthKit，所以这类工具的常见路线是两条：解析 Apple Health 的导出文件（iOS 上可导出成 XML），或经 iPhone 快捷指令桥接同步。配套的 [healthkit-sync](https://github.com/openclaw/skills/tree/main/skills/mneves75/healthkit-sync/SKILL.md) 补的就是「数据从 iPhone 到 Mac」这一环。

**推荐理由**：健康数据是个人数据里最私密、也最「存而不用」的一类。Apple 自己的可视化停留在给你看图表，让 Agent 直接对着数据问答，才算把这堆躺在手机里的数据真正用起来。

**推荐指数**：⭐⭐⭐⭐⭐

### 3. apple-remind-me — 自然语言提醒事项

[GitHub](https://github.com/openclaw/skills/tree/main/skills/plgonzalezrx8/apple-remind-me/SKILL.md)

**核心功能**：用自然语言创建**真正的** Apple 提醒事项——「明早八点提醒我带护照，再设个前一天的备用提醒」，落到系统提醒事项 App 里，iPhone 上照样响。

**实用场景**：

- 聊天里随口一句「周五前提醒我交报销」，不用切 App；
- Agent 执行长任务时给自己设提醒：「两小时后提醒我看下构建结果」；
- 整理购物、出差打包清单，直接进全家共享的提醒事项列表。

**技术实现**：Apple 提醒事项是出了名的「没有公开 API」，这类 skill 通常走 AppleScript/osascript 与 Reminders.app 通信，或封装 reminders-cli 这类开源 CLI。同分类还有个 [mh-apple-reminders](https://github.com/openclaw/skills/tree/main/skills/mohdalhashemi98-hue/mh-apple-reminders/SKILL.md) 走 remindctl 路线，提供增删改查全量管理——两个挑一个装就行。

**推荐理由**：它是「Agent 接管日常」的第一块砖：上手成本最低，正反馈天天见。唯一提醒：让 Agent 代管提醒后，偶尔抽查它有没有真设上——别等该响的时候才发现是空头支票。

**推荐指数**：⭐⭐⭐⭐⭐

### 4. mlx-stt — Apple Silicon 上的本地语音识别

[GitHub](https://github.com/openclaw/skills/tree/main/skills/guoqiao/mlx-stt/SKILL.md)

**核心功能**：在 Apple Silicon Mac 上本地跑语音转文字，默认模型是列表标注的 GLM-ASR-Nano——不联网、不上传，录一段话直接出文字。

**实用场景**：

- 会议录音本地转写，涉密内容不出机器；
- 给 Agent 加「语音入口」：对着 Mac 说需求，转文字后交给 Agent 执行；
- 播客、访谈素材的离线粗剪文本。

**技术实现**：MLX 是 Apple 为 Apple Silicon 统一内存优化的开源数组计算框架，模型推理直接跑 GPU，省去 CPU↔GPU 拷贝。同一作者还有 [mlx-tts](https://github.com/openclaw/skills/tree/main/skills/guoqiao/mlx-tts/SKILL.md)（本地语音合成，默认 QWen3-TTS），两个凑一对就是完整的本地语音交互闭环。想在本地跑大模型的还可以看 [mlx-swift-lm](https://github.com/openclaw/skills/tree/main/skills/ronaldmannak)。

**推荐理由**：云 ASR 按分钟计费、隐私堪忧，而 M 系芯片 Mac 的算力常年闲置——本地 ASR 是把这份算力用对地方的最短路径。缺点：只认 Apple Silicon，Intel 机型无缘。

**推荐指数**：⭐⭐⭐⭐

### 5. appletv — 把 Apple TV 交给 Agent 遥控

[GitHub](https://github.com/openclaw/skills/tree/main/skills/lucakaufmann/appletv/SKILL.md)

**核心功能**：通过 pyatv 控制 Apple TV——暂停/播放、调音量、切 App、列出应用、查询正在播放的内容，全部指令化，Agent 可以直接执行。

**实用场景**：

- 「暂停一下，我去热个饭，回来继续」——一句话的事；
- 睡前让 Agent 确认电视已关、没在下载更新；
- 配合其他自动化做联动：检测到全家都睡了 → 自动暂停客厅电视。

**技术实现**：pyatv 是 Python 生态里对 Apple 私有协议（Companion、MRP、AirPlay 等）实现最完整的开源库，首次使用需与设备配对拿凭证，之后纯局域网运行、不依赖 iCloud 账号，隐私上比云方案干净。

**推荐理由**：电视大概是客厅里唯一「没有命令行」的设备。这个 skill 的意义不在省一次按遥控器，而在于 Agent 有了够得着整套家庭娱乐的入口——也是玩智能家居联动的前置能力。

**推荐指数**：⭐⭐⭐⭐

## 应用场景总结

把今天 5 个 skill 串起来，就是一条「Mac 成为 Agent 身体」的完整路线：

```
mlx-stt（听：本地语音入口，说句话就能指挥）
   ↓
apple-remind-me / shortcuts-generator（动手：设提醒、跑系统自动化）
   ↓
appletv（够得着：客厅设备尽在掌握）
   ↓
apple-health-skill（看数据：读懂你自己的身体）
```

几个务实建议：

1. **从提醒事项开始**：apple-remind-me 是全分类上手成本最低、正反馈最快的，先装它建立信任，再谈更深的自动化；
2. **本地优先**：健康、语音是交出去就收不回的数据，mlx-stt 和 apple-health-skill 的本地路线值得坚持；
3. **快捷指令是杠杆**：shortcuts-generator 的价值不是「多一个 skill」，而是把 Apple Shortcuts 生态整体变成 Agent 的动作库；
4. **权限要收敛**：这批 skill 动的是系统级应用（通讯录、邮件、Find My），装之前想清楚 Agent 的操作边界——让它「提醒我」可以，让它「替我发」要三思。

## 推荐指数排名

| 排名 | Skill | 推荐指数 | 一句话点评 |
| --- | --- | --- | --- |
| 1 | [shortcuts-generator](https://github.com/openclaw/skills/tree/main/skills/erik-agens/shortcuts-skill/SKILL.md) | ⭐⭐⭐⭐⭐ | 解锁 Shortcuts 生态的万能钥匙 |
| 2 | [apple-health-skill](https://github.com/openclaw/skills/tree/main/skills/nftechie/apple-health-skill/SKILL.md) | ⭐⭐⭐⭐⭐ | 让最私密的数据终于被用起来 |
| 3 | [apple-remind-me](https://github.com/openclaw/skills/tree/main/skills/plgonzalezrx8/apple-remind-me/SKILL.md) | ⭐⭐⭐⭐⭐ | Agent 日常化的第一块砖 |
| 4 | [mlx-stt](https://github.com/openclaw/skills/tree/main/skills/guoqiao/mlx-stt/SKILL.md) | ⭐⭐⭐⭐ | M 系芯片的正确打开方式 |
| 5 | [appletv](https://github.com/openclaw/skills/tree/main/skills/lucakaufmann/appletv/SKILL.md) | ⭐⭐⭐⭐ | 客厅设备的命令行 |

---

**第三轮，第 1 期，重新出发。** 接下来 30 天继续把 30 个分类再逛一遍——明天第 32 期：**浏览器自动化（browser-and-automation）**，去看看 Agent 是怎么替你开网页、点按钮、抓数据的。
