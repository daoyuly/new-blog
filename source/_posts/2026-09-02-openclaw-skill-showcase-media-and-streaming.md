---
title: OpenClaw Skill 每日推荐 - 媒体与流媒体
date: 2026-09-02 11:30:00
tags:
  - openclaw
  - skill
  - media-and-streaming
categories:
  - 技术推荐
---

# OpenClaw Skill 每日推荐 — 媒体与流媒体

> 第 17/30 期 | 2026-09-02 | 分类：Media & Streaming

今天我们来探索 OpenClaw 生态中最「有声有色」的分类——**媒体与流媒体**。这个分类包含 **84 个 Skills**，覆盖了音视频处理、语音合成、流媒体控制、社交媒体管理等方方面面。无论你是想用 AI 生成配音、控制家里的 HomePod，还是深度分析 YouTube 视频，这里都有合适的工具。

## 今日分类概述

媒体与流媒体分类的 84 个 Skills 可以归纳为以下几个方向：

| 方向 | 代表 Skills | 数量 |
|------|------------|------|
| 音频处理与 TTS | elevenlabs-cli, voice-edge-tts, audio-transcribe, mlx-audio-server | ~20 |
| 视频处理 | ffmpeg-master, cine-cog, flyworks-avatar-video | ~10 |
| 流媒体设备控制 | apple-media, chromecast, blucli, wiim | ~12 |
| YouTube/视频分析 | youtube-pro, letterboxd-tracker, wherecaniwatch | ~8 |
| 社交媒体管理 | instagram-api, metricool, mixpost, content-recycler | ~15 |
| 音乐生成与控制 | clawtunes, play-music, music-cog, eurobot | ~10 |
| 其他（广播、播客等） | molt-radio, podcast-chaptering-highlights | ~9 |

---

## 精选 Skill 详解

### 1. 🎬 ffmpeg-master — FFmpeg 专业音视频处理

**GitHub**: [openclaw/skills - ffmpeg-master](https://github.com/openclaw/skills/tree/main/skills/liudu2326526/ffmpeg-master/SKILL.md)

**核心功能**：为 AI Agent 提供专业的 FFmpeg/FFprobe 命令行生成能力，覆盖转码、剪辑、滤镜、流处理、元数据操作等全链路音视频处理。

**实用场景举例**：

```bash
# 将视频转码为 H.265 节省存储（压缩率比 H.264 高约 50%）
ffmpeg -i input.mp4 -c:v libx265 -crf 28 -c:a copy output.mp4

# 从视频中截取片段（10秒开始，持续30秒）
ffmpeg -ss 00:00:10 -i input.mp4 -to 00:00:40 -c:v libx264 -crf 23 -c:a aac output.mp4

# 添加水印到右下角
ffmpeg -i input.mp4 -i watermark.png -filter_complex "overlay=main_w-overlay_w-10:main_h-overlay_h-10" output.mp4

# 2倍速播放（视频+音频）
ffmpeg -i input.mp4 -filter_complex "[0:v]setpts=0.5*PTS[v];[0:a]atempo=2.0[a]" -map "[v]" -map "[a]" output.mp4
```

**技术实现机制**：
- 以 `role: specialist` + `scope: implementation` + `output-format: shell-command` 的方式工作
- Agent 根据自然语言描述生成精确的 FFmpeg 命令，而非调用 API
- 支持硬件加速（NVIDIA NVENC、Intel QSV、Apple VideoToolbox）
- 内置复杂 filtergraph 指南（拼贴、转场、画中画等）

**推荐指数**：⭐⭐⭐⭐⭐

> 评价：FFmpeg 是音视频领域的瑞士军刀，这个 Skill 让 AI 直接具备了专业音视频处理能力。无需额外 API、无需云端依赖，命令即服务。

---

### 2. 🎙️ elevenlabs-cli — ElevenLabs AI 音频全功能 CLI

**GitHub**: [openclaw/skills - elevenlabs-cli](https://github.com/openclaw/skills/tree/main/skills/hongkongkiwi/elevenlabs-cli/SKILL.md)

**核心功能**：ElevenLabs AI 音频平台的非官方 CLI 客户端，覆盖 100% SDK 功能——文字转语音、语音转文字、声音克隆、音效生成、音频降噪、变声、多语言配音、对话生成、AI Agent 管理等。

**实用场景举例**：

```bash
# 文字转语音——用 Brian 的声音朗读
elevenlabs tts "Hello, world!" --voice Brian --model eleven_v3 --play

# 从音频文件克隆声音
elevenlabs voice clone --name "My Voice" --samples sample1.mp3,sample2.mp3

# 语音转文字（带说话人识别）
elevenlabs stt meeting.mp3 --diarize --num-speakers 3

# 生成音效
elevenlabs sfx "door creaking slowly in a haunted house" --duration 5

# 多角色对话生成
elevenlabs dialogue --inputs "Hello there!:Brian,Hi! How are you?:Rachel,I'm great thanks!:Brian"

# 视频翻译配音
elevenlabs dub create --file video.mp4 --source-lang en --target-lang es
```

**技术实现机制**：
- Rust 实现的 CLI 工具，支持 Homebrew/Scoop/Snap/Cargo/Docker 多平台安装
- 需要 `ELEVENLABS_API_KEY` 环境变量
- 支持 29 种语言的 `eleven_multilingual_v2` 模型、低延迟的 `eleven_flash_v2_5`、高表现力的 `eleven_v3`
- 输出格式：MP3 128/192kbps、WAV、PCM、Opus
- 内置交互式 REPL 模式 (`elevenlabs interactive`)

**推荐指数**：⭐⭐⭐⭐⭐

> 评价：功能覆盖最全面的 ElevenLabs CLI 工具。从 TTS 到声音克隆到视频配音，一条命令搞定。API key 管理规范，安全声明清晰，适合生产环境使用。

---

### 3. 🎛️ apple-media — Apple 设备流媒体控制

**GitHub**: [openclaw/skills - apple-media](https://github.com/openclaw/skills/tree/main/skills/aaronn/apple-media/SKILL.md)

**核心功能**：通过 `pyatv` 库的 `atvremote` CLI 控制 Apple TV、HomePod 和 AirPlay 设备——扫描、播放、音量、导航、文字输入、App 启动、多房间音频分组等。

**实用场景举例**：

```bash
# 扫描局域网内的 Apple 设备
atvremote scan

# 控制厨房 HomePod 播放/暂停
atvremote -n "Kitchen" play_pause

# 流式播放本地音频到 HomePod
atvremote -n "Kitchen" stream_file=/path/to/audio.mp3

# 控制 Apple TV 导航
atvremote -n "Apple TV" up
atvremote -n "Apple TV" select
atvremote -n "Apple TV" text_set="search query"

# 多房间音频分组
atvremote -n "Apple TV" add_output_devices=<device_id>

# 实时监听播放状态变化
atvremote -n "Kitchen" push_updates
```

**技术实现机制**：
- 基于 Python `pyatv` 库，通过 `pipx install pyatv --python python3.13` 安装
- 支持 AirPlay 和 Companion 协议
- 首次使用需配对（`atvremote pair`），凭据存储在 `~/.pyatv.conf`
- 支持通过设备名 (`-n`)、IP (`-s`)、标识符 (`-i`) 三种方式定位设备
- 可控制电源、shuffle/repeat 模式、精确 seek 位置

**推荐指数**：⭐⭐⭐⭐

> 评价：苹果全家桶用户的刚需。把 HomePod 和 Apple TV 变成可编程的流媒体终端。唯一注意点是 Python 3.14+ 有兼容问题，需指定 3.13。

---

### 4. 📺 youtube-pro — YouTube 深度分析

**GitHub**: [openclaw/skills - youtube-pro](https://github.com/openclaw/skills/tree/main/skills/kjaylee/youtube-pro/SKILL.md)

**核心功能**：YouTube 视频的深度分析工具，支持字幕提取、内容摘要、元数据提取，以及结合 Gemini 进行视频智能分析。

**实用场景举例**：

```bash
# 快速摘要视频内容
summarize "https://www.youtube.com/watch?v=XXXXX"

# 仅提取字幕（不摘要）
summarize "https://www.youtube.com/watch?v=XXXXX" --youtube auto --extract-only

# 配合 yt-dlp + ffmpeg 提取关键帧做视觉分析
yt-dlp -f "bestvideo[height<=720]" --download-sections "*00:01:00-00:02:00" -o segment.mp4 "URL"
ffmpeg -i segment.mp4 -vf "fps=1" frame_%03d.png
```

**技术实现机制**：
- 内置 `summarize` 工具获取 YouTube 字幕和摘要
- 可配合 `yt-dlp` 下载特定片段
- 配合 `ffmpeg` 提取关键帧做视觉分析
- 设计上与 Gemini 等 LLM 联动，做「核心信息提取 + 实用建议生成」
- 工作流清晰：字幕提取 → LLM 分析 → 可选音视频帧提取

**推荐指数**：⭐⭐⭐⭐

> 评价：信息消费效率提升器。适合研究型用户——快速判断一个长视频是否值得完整观看。与 FFmpeg 和 yt-dlp 的组合拳很实用。

---

### 5. 🔊 voice-edge-tts — 微软 Edge TTS 免费语音合成

**GitHub**: [openclaw/skills - voice-edge-tts](https://github.com/openclaw/skills/tree/main/skills/zhaov1976/voice-edge-tts/SKILL.md)

**核心功能**：基于微软 Edge TTS 引擎的文字转语音工具，支持流式播放（边生成边播放）、多语言语音、自定义语速/音量/音调，完全免费无需 API Key。

**实用场景举例**：

```bash
# 安装依赖
pip install edge-tts
# macOS 还需要 ffmpeg
brew install ffmpeg

# 流式播放（推荐——边生成边播放，体验最佳）
# 基础用法
skill.execute({
  action: 'stream',
  text: '你好，我是小九'
});

# 自定义语音和参数
skill.execute({
  action: 'stream',
  text: 'Hello, how are you?',
  options: {
    voice: 'en-US-Standard-A',
    rate: '+10%',
    volume: '+0%',
    pitch: '+0Hz'
  }
});

# 生成语音文件
skill.execute({
  action: 'tts',
  text: 'Hello, how are you today?',
  options: { voice: 'zh-CN-XiaoxiaoNeural' }
});
```

**可用语音**：

| 语言 | 语音 ID | 性别 |
|------|---------|------|
| 中文 | zh-CN-XiaoxiaoNeural | 女 |
| 中文 | zh-CN-YunxiNeural | 男 |
| 中文 | zh-CN-YunyangNeural | 男 |
| 英文(美) | en-US-Standard-A | 女 |
| 英文(美) | en-US-Standard-D | 男 |
| 英文(英) | en-GB-Standard-A | 女 |
| 日文 | ja-JP-NanamiNeural | 女 |
| 韩文 | ko-KR-SunHiNeural | 女 |

**技术实现机制**：
- Python `edge-tts` 库调用微软 Edge 浏览器的 TTS 服务
- 流式播放依赖 `ffmpeg` 实现实时音频解码
- **安全设计**：语音参数白名单验证、使用 `spawn()` 替代 `exec()` 防命令注入、固定脚本路径防路径遍历
- 支持语速 (-50%~+100%)、音量 (-50%~+50%)、音调调整

**推荐指数**：⭐⭐⭐⭐

> 评价：零成本 TTS 方案的天花板。微软 Edge TTS 的语音质量在免费方案中属于第一梯队，流式播放体验接近商业产品。安全设计也到位，适合集成到生产环境。

---

## 应用场景总结

| 场景 | 推荐组合 | 说明 |
|------|---------|------|
| 🎵 智能家居音乐控制 | apple-media + clawtunes | 用 AI 控制全屋 HomePod 播放音乐 |
| 🎬 视频创作者工作流 | ffmpeg-master + elevenlabs-cli | 视频剪辑 + AI 配音一条龙 |
| 📰 内容研究与分析 | youtube-pro + web_fetch | YouTube 视频深度分析和信息提取 |
| 🗣️ 多语言语音应用 | voice-edge-tts + elevenlabs-cli | 免费 TTS 用于日常 + 高质量 TTS 用于正式场景 |
| 📻 播客制作 | ffmpeg-master + elevenlabs-cli + podcast-chaptering-highlights | 录制、降噪、生成章节标记 |
| 🏠 多房间音频 | apple-media + blucli + wiim | 统一控制 Apple/BluOS/WiiM 设备 |

---

## 推荐指数排名

| 排名 | Skill | 星级 | 核心价值 |
|------|-------|------|---------|
| 1 | ffmpeg-master | ⭐⭐⭐⭐⭐ | 音视频处理的万能工具，零依赖成本 |
| 2 | elevenlabs-cli | ⭐⭐⭐⭐⭐ | AI 音频全覆盖，从 TTS 到声音克隆 |
| 3 | apple-media | ⭐⭐⭐⭐ | 苹果生态控制，家庭自动化必备 |
| 4 | youtube-pro | ⭐⭐⭐⭐ | 视频内容分析，信息消费提效 |
| 5 | voice-edge-tts | ⭐⭐⭐⭐ | 免费高质量 TTS，安全设计到位 |

---

## 实用建议

1. **TTS 选择策略**：日常使用选 `voice-edge-tts`（免费），正式场景选 `elevenlabs-cli`（高质量+声音克隆）。两者可以共存，按场景切换。

2. **音视频处理组合拳**：`ffmpeg-master` 是基础能力，配合 `yt-dlp`（下载）和 `elevenlabs-cli`（配音）可以构建完整的视频后期工作流。

3. **苹果生态用户**：`apple-media` + `clawtunes`（Apple Music 控制）是黄金组合。配对一次后，AI 就能全程语音控制你的家庭音响系统。

4. **社交媒体管理**：分类中还有 `instagram-api`、`metricool`、`mixpost` 等 Skills，适合需要跨平台发布内容的创作者。`content-recycler` 可以将一条内容改写为多平台适配版本。

5. **安全提醒**：使用 `elevenlabs-cli` 等需要 API Key 的 Skill 时，确保 Key 存储在环境变量中，不要硬编码到脚本里。`voice-edge-tts` 的安全设计（白名单+spawn）值得其他 Skill 开发者学习。

---

> 📌 明日预告：第 18 期将介绍 **Moltbook** 分类，敬请期待！
>
> 💡 想体验这些 Skills？运行 `openclaw skill install <skill-name>` 即可安装。
