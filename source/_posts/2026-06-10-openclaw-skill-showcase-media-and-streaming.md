---
title: OpenClaw Skill 每日推荐 - 媒体与流媒体
tags:
  - openclaw
  - skill
  - media
  - streaming
categories:
  - 技术推荐
abbrlink: 62254
date: 2026-06-10 11:30:00
---

# OpenClaw Skill 每日推荐 - 媒体与流媒体 🎬🎵

今天我们来探索 OpenClaw Skill 生态中内容最丰富的分类之一——**媒体与流媒体（Media & Streaming）**，共收录 **84 个 Skill**，覆盖音乐播放、视频生成、播客制作、语音合成、社交媒体管理等方方面面。

---

## 🎯 分类概述

媒体与流媒体分类几乎涵盖了你能想到的所有媒体操作场景：

| 子领域 | 代表 Skill | 数量 |
|--------|-----------|------|
| 🎵 音乐播放与控制 | apple-media, clawtunes, wiim, blucli | ~10 |
| 🗣️ 语音合成与转录 | elevenlabs-cli, voice-edge-tts, audio-transcribe | ~12 |
| 📺 视频生成与处理 | cine-cog, ffmpeg-master, flyworks-avatar-video | ~6 |
| 🎙️ 播客制作 | podcast-chaptering-highlights, flashcards-podcasts | ~3 |
| 📱 社交媒体管理 | instagram-api, metricool, content-recycler | ~8 |
| 🎮 流媒体与影视 | chromecast, overseerr, wherecaniwatch | ~5 |
| 📊 数据与金融媒体 | sports-odds, kalshi-agent | ~4 |

---

## ⭐ 精选 Skill 详解

### 1. ElevenLabs CLI — AI 语音全家桶 ⭐⭐⭐⭐⭐

**GitHub:** [elevenlabs-cli](https://github.com/openclaw/skills/tree/main/skills/hongkongkiwi/elevenlabs-cli)

**核心功能：** ElevenLabs 是目前最顶级的 AI 语音平台之一，这个 Skill 将其完整能力封装为 CLI 工具：

- **文本转语音（TTS）**：支持 29 种语言的数百种音色
- **语音转文本（STT）**：高精度语音识别
- **语音克隆**：上传短音频即可复刻任意声音
- **音效生成**：通过文字描述生成环境音、音效

**实用场景：**
```
用户: "帮我把这段会议记录转成语音播客"
AI: 调用 elevenlabs-cli，选择合适的音色，生成高质量语音文件

用户: "克隆我的声音，然后用我的声音读这篇新闻"
AI: 上传声音样本 → 克隆语音 → 生成定制化语音内容
```

**推荐指数：** ⭐⭐⭐⭐⭐ — ElevenLabs API 质量业界领先，这个 Skill 把所有能力集成得非常优雅。

---

### 2. FFmpeg Master — 万能媒体处理引擎 ⭐⭐⭐⭐⭐

**GitHub:** [ffmpeg-master](https://github.com/openclaw/skills/tree/main/skills/liudu2326526/ffmpeg-master)

**核心功能：** FFmpeg 是媒体处理的瑞士军刀，这个 Skill 让 AI Agent 能直接调用 FFmpeg 的全部能力：

- **视频转码**：支持所有主流格式互转
- **音频提取/处理**：从视频中提取音频、音频剪辑
- **视频剪辑**：裁剪、拼接、加水印、调速度
- **格式转换**：GIF 生成、缩略图提取、字幕嵌入

**实用场景：**
```bash
# 压缩视频
ffmpeg -i input.mp4 -crf 28 -preset fast output.mp4

# 提取音频
ffmpeg -i video.mp4 -vn -acodec copy audio.aac

# 批量转换格式
for f in *.mkv; do ffmpeg -i "$f" "${f%.mkv}.mp4"; done
```

**推荐指数：** ⭐⭐⭐⭐⭐ — 媒体处理的基石工具，几乎每个媒体工作流都需要它。

---

### 3. YouTube Pro — YouTube 深度分析工具 ⭐⭐⭐⭐⭐

**GitHub:** [youtube-pro](https://github.com/openclaw/skills/tree/main/skills/kjaylee/youtube-pro)

**核心功能：** 不仅仅是视频下载，而是一套完整的 YouTube 分析工具链：

- **视频转录**：自动提取视频字幕/转录文本
- **元数据分析**：频道信息、视频统计、评论抓取
- **内容分析**：视频摘要、关键帧提取
- **SEO 分析**：标签分析、标题优化建议

**实用场景：**
```
用户: "分析这个 YouTube 频道最近 10 个视频的表现趋势"
AI: 调用 youtube-pro 批量获取视频数据 → 生成分析报告

用户: "把这个教程视频的内容整理成文字笔记"
AI: 提取转录文本 → 结构化整理 → 输出 Markdown 笔记
```

**推荐指数：** ⭐⭐⭐⭐⭐ — 内容创作者和研究者必备，把 YouTube 变成可分析的数据源。

---

### 4. Apple Media — 苹果生态媒体控制 ⭐⭐⭐⭐

**GitHub:** [apple-media](https://github.com/openclaw/skills/tree/main/skills/aaronn/apple-media)

**核心功能：** 通过 `pyatv` 库统一控制 Apple 生态的媒体设备：

- **Apple TV 控制**：播放、暂停、切换 App、搜索内容
- **HomePod 控制**：播放音乐、调整音量、AirPlay 投送
- **AirPlay 管理**：设备发现、连接管理、多房间同步

**实用场景：**
```
用户: "在客厅的 HomePod 上播放周杰伦的歌"
AI: 发现设备 → Apple Music 搜索 → 播放控制

用户: "把电脑上的视频投到卧室的 Apple TV"
AI: AirPlay 投送 → 自动播放
```

**推荐指数：** ⭐⭐⭐⭐ — 苹果全家桶用户的福音，让 Agent 变身家庭媒体中心遥控器。

---

### 5. Podcast Chaptering & Highlights — 播客智能分段 ⭐⭐⭐⭐

**GitHub:** [podcast-chaptering-highlights](https://github.com/openclaw/skills/tree/main/skills/codedao12/podcast-chaptering-highlights)

**核心功能：** 自动化播客后期制作的利器：

- **智能分段**：根据内容主题自动划分章节
- **精彩片段提取**：识别播客中的高光时刻
- **Show Notes 生成**：自动生成节目说明和摘要
- **时间戳标记**：精确到秒的章节时间标记

**实用场景：**
```
用户: "我刚录完一期 60 分钟的播客，帮我做后期"
AI: 转录音频 → 内容分析 → 自动分段 → 提取精华 → 生成 Show Notes

用户: "从这期播客里截取最精彩的 5 分钟做短视频"
AI: 识别高光片段 → 截取音频 → 生成精华版
```

**推荐指数：** ⭐⭐⭐⭐ — 播客创作者的生产力倍增器，大幅减少后期制作时间。

---

## 📊 推荐指数排名

| 排名 | Skill | 推荐指数 | 核心价值 |
|------|-------|---------|---------|
| 🥇 | ElevenLabs CLI | ⭐⭐⭐⭐⭐ | 顶级 AI 语音平台完整集成 |
| 🥈 | FFmpeg Master | ⭐⭐⭐⭐⭐ | 媒体处理基础设施 |
| 🥉 | YouTube Pro | ⭐⭐⭐⭐⭐ | YouTube 内容分析神器 |
| 4 | Apple Media | ⭐⭐⭐⭐ | 苹果生态统一控制 |
| 5 | Podcast Chaptering | ⭐⭐⭐⭐ | 播客后期自动化 |

---

## 🎯 应用场景总结

### 内容创作者
搭配 `youtube-pro` + `podcast-chaptering-highlights` + `content-recycler`，构建从内容创作到多平台分发的完整工作流。

### 智能家居玩家
`apple-media` + `chromecast` + `alexa-control` + `wiim`，让 AI Agent 成为全屋媒体中枢。

### 播客制作人
`audio-transcribe` + `podcast-chaptering-highlights` + `elevenlabs-cli`，从录制到发布的全自动流程。

### 社媒运营者
`instagram-api` + `metricool` + `social-media-content-calendar` + `weekly-content-planner`，一周的内容 5 分钟搞定。

---

## 💡 实用建议

1. **从 ElevenLabs CLI 开始** — 语音是媒体交互最自然的入口，建议优先安装
2. **FFmpeg 是基础设施** — 几乎所有媒体工作流都需要格式转换，提前备好
3. **注意 API Key 管理** — 大部分 Skill 需要配置 API Key（ElevenLabs、YouTube Data API 等），建议统一管理
4. **本地优先原则** — `voice-to-text`（Vosk 离线识别）、`ffmpeg-master` 等支持完全本地运行，隐私敏感场景优先使用
5. **组合使用效果翻倍** — 单个 Skill 能力有限，但组合起来就是完整的媒体工作站

---

> 📌 **明日预告：** Moltbook 分类 — 探索 OpenClaw 生态中的 Moltbook 相关 Skill
>
> 🔗 **完整 Skill 列表：** [awesome-openclaw-skills](https://github.com/openclaw/awesome-openclaw-skills)
