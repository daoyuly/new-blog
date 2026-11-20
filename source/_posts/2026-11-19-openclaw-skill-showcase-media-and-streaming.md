---
title: OpenClaw Skill 每日推荐 - 媒体与流媒体（media-and-streaming）
tags:
  - openclaw
  - skill
  - media-and-streaming
categories:
  - 技术推荐
abbrlink: 18072
date: 2026-11-19 11:30:00
---

# OpenClaw Skill 每日推荐 - 媒体与流媒体

> 第 43 期 · 第三轮第 16 期 · media-and-streaming · 84 个 skills
>
> 上期埋了句话：「营销的尽头是内容，内容的尽头是媒体管道」。今天兑现——这个分类就是那根管道：语音怎么进来、声音怎么出去、音箱怎么控制、片子去哪找。

## 今日分类概述

media-and-streaming（媒体与流媒体）收录 84 个 skills，是全库第 12 大分类（并列 ai-and-llms 184 条、coding-agents-and-ides 1200 条之后的中坚层）。内容大致分四个梯队：

- **语音进**：audio-transcribe、voice-to-text、salute-speech、free-groq-voice（转录侧）
- **语音出**：elevenlabs-cli、voice-edge-tts、mm-easy-voice、lb-pocket-tts-skill、mlx-audio-server（合成侧）
- **设备控制**：apple-media、blucli、clawtunes、chromecast、wiim、alexa-control、roomsound（把 agent 变成万能遥控器）
- **内容发现与管理**：wherecaniwatch、overseerr、nas-movie-download、letterboxd-tracker、lastfm、youtube-pro

照例说明：所有链接指向 ClawHub（本期有个大发现，GitHub 仓库已经没了，详见「本期观察」第一条）。下载数据取自 ClawHub 搜索 API，为累计值。

---

## 精选 Skill 详解

### 1. audio-transcribe —— 本地语音转录，零 API key ⭐⭐⭐⭐⭐

- **作者**：aktheknight
- **链接**：[clawhub.ai/skills/audio-transcribe](https://clawhub.ai/skills/audio-transcribe)
- **下载量**：4,245

一句话：用 faster-whisper 在本机跑 Whisper，语音消息自动转文字，不花一分钱、不泄一个字。

**核心功能**：

- 自动转录传入的语音消息（开启后 agent 收到语音直接出文字）
- 可选 5 档模型，从 39MB 的 tiny 到 1.5GB 的 large-v3
- 纯本地推理，无 API key、无外部请求

```bash
# 安装
pip install faster-whisper

# 转录一个文件
python3 /root/clawd/skills/audio-transcribe/scripts/transcribe.py /path/to/audio.ogg
```

模型选择表是这份 SKILL.md 里最有信息量的部分：

| 模型 | 体积 | 内存 | 速度 | 适用 |
|------|------|------|------|------|
| tiny | 39 MB | ~1 GB | ⚡⚡⚡ | 快速草稿 |
| base | 74 MB | ~1 GB | ⚡⚡ | 基础准确度 |
| **small** | **244 MB** | **~2 GB** | **⚡** | **推荐默认** |
| medium | 769 MB | ~5 GB | 🐢 | 更高准确度 |
| large-v3 | 1.5 GB | ~10 GB | 🐢🐢 | 最佳准确度 |

**实用场景**：家人群里的长语音懒得听，让 agent 转成文字再总结；会议录音本地归档（涉密内容不出机器）；给播客做粗剪底稿。

**为什么五星**：这是整个分类里「价值密度」最高的一个——`pip install` 一条命令就能跑，默认 small 模型在 2GB 内存内出活，隐私完全可控。对比那些要 API key、要云上传的同类，它把门槛压到了地板。要说缺点：换模型要手改脚本里的 `WhisperModel('small', ...)`，没有参数化，属于能用但糙。

---

### 2. elevenlabs-cli —— ElevenLabs 全家桶命令行 ⭐⭐⭐⭐½

- **作者**：hongkongkiwi
- **链接**：[clawhub.ai/skills/elevenlabs-cli](https://clawhub.ai/skills/elevenlabs-cli)
- **下载量**：1,244（注意：官方版已入场，见下）

一句话：TTS、STT、声音克隆一个 CLI 全包，号称 100% SDK 覆盖，五渠道安装。

```bash
# macOS / Linux
brew tap hongkongkiwi/tap
brew install elevenlabs-cli

# 配置
export ELEVENLABS_API_KEY="your-key"
elevenlabs config set default_voice Brian

# 文字转语音
elevenlabs tts "你好，这是来顺的测试"
```

**技术实现**：Rust/编译型 CLI（支持 brew、scoop、snap、cargo、docker 五种分发），走 `api.elevenlabs.io`。SKILL.md 里的「Trust Statement」值得表扬——明确写了 API key 和音频内容会发到 ElevenLabs 服务器、本地不持久化、无遥测，把隐私边界说在明面上，这在社区 skill 里是规范级操作。

**实用场景**：给自己的 agent 配一个有辨识度的声音；批量把文章转成音频版；克隆自己的声音做播客草稿。

**为什么 4.5 不是 5**：云依赖是硬伤（按字符计费），而且本期发现 ElevenLabs **官方 org 已经入驻 ClawHub**——`elevenlabs/music`（14,531 下载）、`elevenlabs/voice-changer`（9,327）、`elevenlabs/speech-engine`（9,023）三件套全面碾压社区版的 1,244。社区先行、官方收编，这个剧本在 skill 生态里会越来越常见。

---

### 3. clawtunes —— Apple Music 命令行遥控器 ⭐⭐⭐⭐½

- **作者**：forketyfork
- **链接**：[clawhub.ai/skills/clawtunes](https://clawhub.ai/skills/clawtunes)
- **下载量**：3,732

一句话：macOS 上用 `clawtunes` 控制 Apple Music——搜歌、播放、音量、歌单、AirPlay，终端里全搞定。

```bash
# 安装（仅 macOS，需要 Apple Music 应用）
brew install forketyfork/tap/clawtunes

# 播放（永远带 -N 防止交互式提示卡死 agent）
clawtunes -N play song "Hotel California"

# 多结果命中时自动选第一个
clawtunes -1 play album "Kind of Blue"

# 常用控制
clawtunes pause && clawtunes volume +10
clawtunes shuffle on
clawtunes love          # 标记喜爱当前曲目
clawtunes playlist create "深夜代码"
```

**工程质量是这份 SKILL.md 的亮点**：明确要求所有调用带 `--non-interactive`（`-N`）——agent 最怕的就是命令挂在那里等人输入；定义了降级策略：退出码 1 且多结果 → 换更精确的歌名重试 → 仍多结果 → `--first` 自动选第一个。这套「防呆三连」是写给 agent 看的接口设计教科书，比大多数 skill 的「能跑就行」高一个段位。

**实用场景**：写代码时说一句「来点 post-rock」；定时任务早八点自动播放晨间歌单并接到 AirPlay 音箱；「把这首歌加到周末歌单」。

**为什么 4.5**：macOS 限定 + 依赖 Apple Music 本体，扣一点普适性；但在它的射程内几乎无可挑剔。

---

### 4. blucli —— 高保真音响的 agent 入口，本期下载量之王 ⭐⭐⭐⭐½

- **作者**：steipete（老朋友了，上期的 bird 才介绍过）
- **链接**：[clawhub.ai/skills/blucli](https://clawhub.ai/skills/blucli) · [blucli.sh](https://blucli.sh)
- **下载量**：13,837 —— 本期验证过的最高值，是第二名的三倍

一句话：Go 写的 BluOS CLI，让 agent 直接控制 Bluesound/NAD 功放——发现设备、播放、分组、音量、TuneIn 电台。

```bash
# 安装（Go 单二进制）
go install github.com/steipete/blucli/cmd/blu@latest

blu devices                     # 扫描设备
blu --device living-room play
blu volume set 15
blu group add kitchen           # 多房间分组
blu tunein search "jazz"        # TuneIn 电台搜索直播
blu tunein play "BBC Radio 6"
```

**技术实现**：Go 编译型 CLI（brew 也可装：`brew install steipete/tap/bird` 的同门套路），所有命令支持 `--json` 输出方便脚本解析；设备定位有三级优先：`--device` 参数 > `BLU_DEVICE` 环境变量 > 配置文件默认值。SKILL.md 只有一百来字，但每句都是干货——steipete 的风格一贯是「工具本身做好，文档只写 agent 需要的」。

**实用场景**：「客厅放歌，厨房加进组」一句话完成多房间联动；睡前定时把全家音量调到 10；听 TuneIn 网络电台不用掏手机。

**为什么 4.5 不是 5**：硬件门槛——你得先有 Bluesound/NAD 设备（国内用户偏小众，欧美 audiophile 圈密度高，这解释了 13.8K 下载）。但如果你正好在这个生态里，它就是标配。

**连续两期出现同一个作者**（marketing 期的 bird、本期的 blucli），steipete 正在系统性地把自己的硬件栈全部 agent 化——这种「把自己的生活工作流逐个 CLI 化」的打法，本身就是个人 skill 开发的最佳示范。

---

### 5. wherecaniwatch —— 「这片子哪能看」⭐⭐⭐☆

- **作者**：samthewise2855
- **链接**：[clawhub.ai/skills/wherecaniwatch](https://clawhub.ai/skills/wherecaniwatch)
- **下载量**：1,442

一句话：查任意电影/剧集在哪些流媒体平台可看，附订阅/免费/租赁比价和深链。

```bash
# 1. 搜标题
GET https://www.wherecaniwatch.tv/api/search?q=interstellar

# 2. 拿播放渠道（返回 bestDeal + availability 列表）
GET https://www.wherecaniwatch.tv/api/watch/interstellar-2014-157336.json
```

返回结构里 `bestDeal` 直接给最优解，`availability` 数组列出全渠道（含画质和价格），agent 按用户已有的订阅过滤后输出：

> **星际穿越**正在 **Netflix** 上架（订阅含，4K）。[去 Netflix 看](https://www.netflix.com/title/...)
> 也可以在 Tubi 免费看（HD），或 Prime Video $3.99 租赁。

**细节到位**：免费 API 无需 key；限速写清楚（搜索 10 次/分钟、查询 60 次/分钟）；结果按平台热度智能排序。**硬伤**：仅美区（US only），库里 2,400+ 部。对中文用户的价值打折，但作为「agent 接入流媒体元数据」的范本值得一读。

---

## 荣誉提名

- **apple-media**（aaronn，4,472 下载）—— pyatv 控制 Apple TV / HomePod / AirPlay 全家桶，`atvremote scan` 扫描、播放、导航一把抓。文档连「pyatv 与 Python 3.14 不兼容，请 pin 3.13」这种坑都写了。Apple 全家桶用户与 clawtunes 二选一或全都要。
- **mlx-audio-server**（guoqiao，4,093 下载）—— Apple Silicon 上的本地 24x7 OpenAI 兼容音频服务器（STT/TTS/STS），brew 装完以 LaunchAgent 常驻。和 audio-transcribe 凑成「本地语音双向管道」，彻底摆脱 API 计费。
- **molt-radio**（fciaf420，4,111 下载）—— 「成为 AI 电台主播」：agent 注册电台人格、排班、发节目，支持多 agent 圆桌对谈，广播给「听众」。魔幻但真实存在，伏笔已埋，下下期细说。
- **ffmpeg-master / mediaproc** —— 前者是老生常谈的音视频处理瑞士军刀说明书，后者走 SSH 沙箱处理媒体文件，安全姿势更讲究。
- **overseerr**（j1philli）—— 对接自建 Overseerr，一句话提交观影请求并跟踪状态，NAS 家庭影院党的最后一环（配合 nas-movie-download 的 Jackett 链路）。
- **voice-edge-tts**（zhaov1976）—— 白嫖微软 Edge TTS 引擎，实时流式播放，零成本 TTS 的兜底方案。
- **letterboxd-tracker / lastfm / mal-lookup / anime** —— 影评、听歌史、番剧数据库，agent 比你更懂你的品味档案。

---

## 应用场景总结：组装你的私人媒体中枢

这个分类的正确打开方式不是挑一个装上，而是按「管道」思路组装：

1. **语音进**：audio-transcribe（本地、免费）→ 收到语音先转文字再处理
2. **语音出**：mlx-audio-server（Apple Silicon 本地）或 elevenlabs-cli（云端高音质）→ 回复可以开口说
3. **设备层**：clawtunes / apple-media / blucli / chromecast / wiim 按家里硬件对号入座 → agent 变万能遥控器
4. **内容发现**：wherecaniwatch 查渠道 → overseerr 提请求 → NAS 落地 → letterboxd 记影评 → content-recycler 把播客变成笔记（如果它还活着的话，见观察③）

一条龙下来，「早上好」之后 agent 播报天气、读新闻摘要、放晨间歌单、顺手把昨晚聊到的电影加进下载队列——这就是「媒体管道」的完整形态。

## 推荐指数排名

| 排名 | Skill | 星级 | 一句话理由 |
|------|-------|------|-----------|
| 1 | audio-transcribe | ★★★★★ | 零门槛零成本零隐私风险，人人可装 |
| 2 | elevenlabs-cli | ★★★★½ | 功能最全，但官方入场 + 云依赖 |
| 3 | clawtunes | ★★★★½ | SKILL.md 工程质量标杆，macOS 日用神器 |
| 4 | blucli | ★★★★½ | 13.8K 下载的王，但吃硬件生态 |
| 5 | wherecaniwatch | ★★★☆ | API 设计优雅，仅美区是硬伤 |

## 本期观察

**① GitHub 链接全灭，ClawHub 正式成为唯一权威源。** 本期核链时发现 awesome 列表里指向 `github.com/openclaw/skills` 的链接整批 404，查 GitHub org API 确认该仓库已不存在（org 下现在是 clawhub、casa、clawdinators 等项目）。这不是链接失效，是基础设施迁移的信号——skill 分发彻底收拢到 ClawHub。从本期起，系列文章所有 skill 链接改用 ClawHub 地址。顺带收获：ClawHub 的 `AMBIGUOUS_SKILL_SLUG` 机制已在运行（podcast-chaptering-highlights 有两个作者撞名，安装时会强制你选）。

**② 厂商直营时代来了。** ElevenLabs 官方 org 入驻 ClawHub，三个官方 skill 下载量（14.5K / 9.3K / 9K）对社区最好的 CLI（1,244）形成碾压。社区 skill 的窗口期逻辑变了：先行者拿信誉，官方进场后要么被收编要么被边缘化。以后评估语音类 skill 得先查一眼「官方来了没有」。

**③ 伏笔兑现情况：三中一翻车。** 上期预告的 blucli（兑现，还成了下载量之王）、audio-transcribe（兑现，五星精选）、clawtunes（兑现，精选）都立住了；但 **content-recycler 查无此 skill**——ClawHub 搜不到、GitHub 仓库已删，上期「已踩点」的承诺作废，诚实勘误。踩点信息也会过期，这本身就是 skill 生态高速汰换的证据。

**④ 类目杂烩率 ~26%。** 84 条里约 20 条明显跑错片场：金融五件套（financial-overview、norman-financial-overview、financial-planning、passive-income-tracker、payrail402）、博彩预测五件套（btc15 ×2、kalshi-agent、sports-odds、betbud）、安全修复、房产比价、发票模板全混进来了。另外发现四组同作者双胞胎注水：anime/anime-lookup、amateur-radio-dx/ham-radio-dx（描述一字不差）、financial-overview/norman-financial-overview、btc15 ×2。

**⑤ 一个幽灵条目。** slashbot-news 的描述就写着「DEPRECATED，请用 clawhub 上的新版」——awesome 列表开始出现指向 ClawHub 的弃用标记，和观察①互相印证：仓库死了，列表还活着，但正在变成 ClawHub 的化石索引。

**⑥ 音频是本期最卷的赛道。** 转录侧 4 个（本地 whisper / Vosk / Groq 白嫖 / Sber）、合成侧 6+ 个（ElevenLabs 双版本 / Edge / MiniMax / Kyutai Pocket / Qwen / MLX），加上设备控制 7 个——「声音进出」占了分类三分之一。这个信号值得记住：人机交互的下一个主战场是耳朵，不是屏幕。

## 下期预告

**moltbook**（index 17）—— 全库最神秘的分类之一。线索先放两条：本期荣誉提名的 molt-radio（AI 电台主播注册、排班、广播给听众）就带着「molt」基因；molt 在生物学上是「蜕皮」，放在 agent 语境里是什么意思？下期拆这个壳。

---

*系列历史：第一轮 30 期全分类速览 → 第二轮 30 期深评 → 第三轮进行中（第 43 期）。往期入口：[daoyuly.cn](https://www.daoyuly.cn)*
