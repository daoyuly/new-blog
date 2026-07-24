---
title: OpenClaw Skill 每日推荐 - 媒体与流媒体
date: 2026-07-24 11:30:00
tags:
  - openclaw
  - skill
  - media-and-streaming
categories:
  - 技术推荐
---

# OpenClaw Skill 每日推荐 - 媒体与流媒体

> 📅 2026年7月24日 | 🏷️ 分类：Media & Streaming | 📦 共 84 个 Skills

媒体与流媒体是 OpenClaw 生态中最丰富的分类之一，涵盖了音频播放、视频处理、语音合成、社交媒体管理、流媒体控制等多个领域。无论你是想用 AI 语音读一篇文章，还是想批量处理视频文件，亦或是控制家里的 HomePod 播放音乐，这个分类都有对应的 Skill 可以胜任。

今天从 84 个 Skills 中精选了 5 个最具代表性的，带你快速了解这个分类的能力边界。

---

## 🎛️ 1. apple-media — Apple 设备媒体控制

**GitHub:** [openclaw/skills - aaronn/apple-media](https://github.com/openclaw/skills/tree/main/skills/aaronn/apple-media/SKILL.md)

**推荐指数：⭐⭐⭐⭐⭐**

### 核心功能

通过 `pyatv` 库的 CLI 工具 `atvremote`，控制局域网内的 Apple TV、HomePod 和 AirPlay 设备。支持设备扫描、播放控制、音量调节、流媒体推送、电源管理等完整操作。

### 实用场景

- **智能家居联动**：下班回家一句话让 HomePod 播放指定歌单
- **多房间音频**：控制不同房间的 AirPlay 设备播放不同音乐
- **家庭影院自动化**：打开 Apple TV、设置音量、播放指定影片

### 技术实现

基于 Python 的 `pyatv` 库，通过本地网络协议与 Apple 设备通信。安装方式：

```bash
pipx install pyatv --python python3.13
```

核心命令示例：

```bash
# 扫描局域网内的 Apple 设备
atvremote scan

# 控制 HomePod 播放
atvremote -n "Kitchen" play
atvremote -n "Kitchen" set_volume=50

# 流式推送本地音频到设备
atvremote -n "Kitchen" stream_file=/path/to/audio.mp3

# 查看当前播放状态
atvremote -n "Kitchen" playing
```

> ⚠️ 注意：pyatv 与 Python 3.14+ 有兼容性问题，建议使用 `--python python3.13` 安装。

---

## 🎙️ 2. elevenlabs-cli — ElevenLabs AI 音频平台

**GitHub:** [openclaw/skills - hongkongkiwi/elevenlabs-cli](https://github.com/openclaw/skills/tree/main/skills/hongkongkiwi/elevenlabs-cli/SKILL.md)

**推荐指数：⭐⭐⭐⭐⭐**

### 核心功能

ElevenLabs AI 音频平台的非官方 CLI 客户端，覆盖 100% SDK 功能。支持文本转语音、语音转文本、声音克隆等，是目前最强大的 AI 音频工具之一。

### 实用场景

- **内容创作**：为博客文章或新闻生成专业级语音播报
- **多语言配音**：利用多语言模型为视频生成不同语言的配音
- **声音克隆**：克隆自己的声音用于自动化内容生产
- **无障碍辅助**：为文本内容生成高质量语音版本

### 技术实现

跨平台支持（macOS/Linux/Windows/Docker），通过 ElevenLabs API 实现。需要设置 `ELEVENLABS_API_KEY` 环境变量。

安装与配置：

```bash
# macOS 安装
brew tap hongkongkiwi/tap
brew install elevenlabs-cli

# 配置 API Key
export ELEVENLABS_API_KEY="your-api-key"

# 设置默认语音和模型
elevenlabs config set default_voice Brian
elevenlabs config set default_model eleven_multilingual_v2
```

文本转语音示例：

```bash
# 基础用法
elevenlabs tts "Hello, how are you?"

# 指定语音和输出文件
elevenlabs tts "你好，欢迎使用语音合成" --voice Brian --output hello.mp3
```

> 🔒 安全提示：API Key 和音频内容会发送到 ElevenLabs 服务器，使用前请确认信任该服务。

---

## 🎬 3. ffmpeg-master — FFmpeg 专业媒体处理

**GitHub:** [openclaw/skills - liudu2326526/ffmpeg-master](https://github.com/openclaw/skills/tree/main/skills/liudu2326526/ffmpeg-master/SKILL.md)

**推荐指数：⭐⭐⭐⭐⭐**

### 核心功能

为 AI Agent 提供专业的 FFmpeg/FFprobe 操作指南，覆盖转码、滤镜、流媒体、元数据操作、复杂滤镜图等全部核心功能。这不是一个封装库，而是一个知识型 Skill——让 Agent 真正理解 FFmpeg 的工作原理并生成正确的命令。

### 实用场景

- **视频压缩**：将 4K 视频转码为 H.265 节省 50% 存储空间
- **音频提取**：从视频中提取音轨生成播客
- **视频编辑**：裁剪、拼接、加水印、调速、加字幕
- **批量处理**：格式转换、分辨率统一、帧率标准化

### 技术实现

作为 specialist 角色的 Skill，它的输出格式为 `shell-command`，意味着 Agent 会直接生成可执行的 FFmpeg 命令。

常用命令速查：

```bash
# 转码为 H.265（节省空间）
ffmpeg -i input.mp4 -c:v libx265 -crf 28 -c:a copy output.mp4

# 提取音频
ffmpeg -i input.mp4 -vn -c:a libmp3lame -q:a 2 output.mp3

# 裁剪视频（10秒开始，持续30秒）
ffmpeg -i input.mp4 -ss 00:00:10 -t 00:00:30 -c copy output.mp4

# 视频加速 2 倍
ffmpeg -i input.mp4 -filter_complex \
  "[0:v]setpts=0.5*PTS[v];[0:a]atempo=2.0[a]" \
  -map "[v]" -map "[a]" output.mp4

# 拼接多个视频
ffmpeg -f concat -safe 0 -i filelist.txt -c copy output.mp4
```

### 亮点

这个 Skill 的价值在于它为 Agent 提供了系统性的 FFmpeg 知识体系：编码器选择、CRF 值含义、滤镜参数、硬件加速等，让 AI 不只是"知道"命令，而是真正理解每个参数的作用。

---

## 📺 4. youtube-pro — YouTube 深度分析

**GitHub:** [openclaw/skills - kjaylee/youtube-pro](https://github.com/openclaw/skills/tree/main/skills/kjaylee/youtube-pro/SKILL.md)

**推荐指数：⭐⭐⭐⭐**

### 核心功能

深度分析 YouTube 视频内容，包括字幕提取、元数据获取、视频智能分析等。支持通过 `summarize` 工具快速获取视频摘要，也可以结合 AI 模型进行深度内容分析。

### 实用场景

- **学习效率**：快速获取长视频的核心要点，节省观看时间
- **内容研究**：分析竞品频道的视频策略和内容方向
- **知识管理**：将视频内容转化为文字笔记存档
- **内容创作**：从热门视频中提取选题灵感和结构参考

### 技术实现

工作流程分为三步：

```bash
# 1. 快速摘要 / 字幕提取
summarize "https://youtube.com/watch?v=XXX"
summarize "https://youtube.com/watch?v=XXX" --youtube auto --extract-only

# 2. 视频智能分析（结合 AI 模型）
# 获取字幕后，使用 AI 分析核心信息、受众反馈、实用建议

# 3. 音频/帧提取（可选）
yt-dlp -f bestaudio "URL"  # 下载音频
ffmpeg -i video.mp4 -vf "fps=1" frames_%04d.png  # 提取关键帧
```

> 💡 实用建议：先用 `summarize` 获取摘要判断是否值得深入观看，再决定是否下载完整内容。

---

## 🔊 5. voice-edge-tts — 免费微软 Edge TTS 语音合成

**GitHub:** [openclaw/skills - zhaov1976/voice-edge-tts](https://github.com/openclaw/skills/tree/main/skills/zhaov1976/voice-edge-tts/SKILL.md)

**推荐指数：⭐⭐⭐⭐**

### 核心功能

基于微软 Edge 浏览器 TTS 引擎的文本转语音 Skill，支持实时流式播放、多语言语音、自定义语速/音量/音调。完全免费，无需 API Key。

### 实用场景

- **日常语音播报**：将新闻、日程、通知转为语音播报
- **多语言学习**：利用中英日韩多语言语音辅助语言学习
- **无障碍服务**：为视障用户提供文本朗读功能
- **自动化提醒**：结合定时任务实现语音提醒

### 技术实现

基于 Python `edge-tts` 库，通过微软 Edge 的 TTS 服务生成语音，再通过 `ffmpeg` 实现流式播放。

安装：

```bash
pip install edge-tts
# macOS 安装 ffmpeg
brew install ffmpeg
```

使用示例：

```python
# 流式播放（推荐，边生成边播放）
await skill.execute({
  action: 'stream',
  text: '你好，我是来顺，今天天气不错'
});

# 生成语音文件
await skill.execute({
  action: 'tts',
  text: 'Hello, how are you today?',
  options: {
    voice: 'zh-CN-XiaoxiaoNeural'
  }
});

# 直接播放
await skill.execute({
  action: 'speak',
  text: 'Hello!'
});
```

可用语音列表：

| 语言 | 语音 ID |
|------|---------|
| 中文（女声） | zh-CN-XiaoxiaoNeural |
| 中文（男声） | zh-CN-YunxiNeural |
| 英文（美式女声） | en-US-Standard-A |
| 日文 | ja-JP-Standard |

### 亮点

**零成本**是最大优势——不需要 ElevenLabs 的付费 API，只要能跑 Python 就能用。流式播放体验也很流畅，适合实时性要求高的场景。

---

## 📊 推荐指数排名

| 排名 | Skill | 推荐指数 | 核心优势 |
|------|-------|---------|---------|
| 1 | apple-media | ⭐⭐⭐⭐⭐ | Apple 生态无缝集成，智能家居必备 |
| 2 | elevenlabs-cli | ⭐⭐⭐⭐⭐ | 最强 AI 语音平台，功能全面 |
| 3 | ffmpeg-master | ⭐⭐⭐⭐⭐ | 媒体处理万能工具，知识体系完整 |
| 4 | youtube-pro | ⭐⭐⭐⭐ | 视频内容分析利器，学习效率翻倍 |
| 5 | voice-edge-tts | ⭐⭐⭐⭐ | 免费 TTS 方案，零门槛上手 |

---

## 🎯 应用场景总结

### 智能家居媒体中心

组合 `apple-media` + `voice-edge-tts`，可以实现：语音播报日程 → 控制 HomePod 播放音乐 → Apple TV 播放视频的全流程自动化。

### 内容创作工作流

组合 `youtube-pro` + `ffmpeg-master` + `elevenlabs-cli`，可以：从 YouTube 提取素材 → 剪辑处理视频 → 生成 AI 配音，形成完整的内容生产流水线。

### 个人媒体库管理

使用 `ffmpeg-master` 批量处理视频文件：转码压缩、格式统一、元数据整理，一个 Skill 搞定所有媒体管理需求。

---

## 💡 实用建议

1. **从免费方案开始**：如果你刚开始探索语音合成，先用 `voice-edge-tts` 体验，等需求升级后再转 `elevenlabs-cli`
2. **FFmpeg 是必修课**：无论你做什么媒体相关项目，`ffmpeg-master` 都值得安装，它是媒体处理的瑞士军刀
3. **Apple 用户首选**：如果你有 HomePod 或 Apple TV，`apple-media` 能让你的智能家居体验提升一个档次
4. **注意隐私安全**：使用云端 API（如 ElevenLabs）时，注意敏感内容不要上传

---

> 📌 本系列每天介绍一个 OpenClaw Skill 分类，共 30 个分类。明天将继续介绍 **Notes & PKM（笔记与知识管理）** 分类，敬请期待！
>
> 完整分类列表：[awesome-openclaw-skills](https://github.com/openclaw/skills)
