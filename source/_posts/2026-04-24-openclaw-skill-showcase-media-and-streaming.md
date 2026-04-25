---
title: OpenClaw Skill 每日推荐 - 媒体与流媒体
tags:
  - openclaw
  - skill
  - media-streaming
categories:
  - 技术推荐
abbrlink: 62254
date: 2026-04-24 00:00:00
---

# OpenClaw Skill 每日推荐 - 媒体与流媒体

> 今日分类：**Media & Streaming** | 包含 **84 个 Skills** | 日期：2026-04-24

## 📺 分类概述

媒体与流媒体分类汇集了 84 个强大的 OpenClaw Skills，涵盖了音频处理、视频制作、音乐生成、语音识别、媒体播放器控制、社交媒体管理等多个领域。这些技能让你的 AI 助手能够处理各种媒体任务，从简单的音乐播放到复杂的视频编辑，从语音转录到原创音乐生成。

## 🌟 精选 Skill 详解

### 1. 🍎 apple-media - Apple 媒体设备控制

**GitHub:** [openclaw/skills](https://github.com/openclaw/skills/tree/main/skills/aaronn/apple-media/SKILL.md)

**核心功能：**
- 控制 Apple TV 设备（播放、暂停、搜索、导航）
- 控制 HomePod 音箱（播放音乐、调整音量、控制播放）
- AirPlay 设备发现和控制

**实用场景：**
- "帮我在 Apple TV 上播放电影"
- "把这首音乐通过 AirPlay 投到客厅的 HomePod 上"
- "设置 HomePod 闹钟"

**技术实现：**
- 使用 `pyatv` 库与 Apple 设备通信
- 支持本地网络设备发现
- 基于协议级别的设备控制

**推荐指数：** ⭐⭐⭐⭐⭐ (Apple 生态用户必备)

---

### 2. 🎵 clawtunes - Apple Music CLI 控制器

**GitHub:** [openclaw/skills](https://github.com/openclaw/skills/tree/main/skills/forketyfork/clawtunes/SKILL.md)

**核心功能：**
- 播放/暂停 Apple Music
- 播放特定歌曲、专辑、播放列表
- 搜索音乐库
- 跳过/上一曲控制
- 音量调节

**实用场景：**
- "播放我的'专注'播放列表"
- "找一首周杰伦的歌"
- "跳过这首歌"
- "调大一点音量"

**技术实现：**
- 通过 AppleScript 或 MusicKit API 与 macOS Music 应用交互
- 本地命令行界面
- 无需额外的 API 密钥

**推荐指数：** ⭐⭐⭐⭐ (macOS + Apple Music 用户强烈推荐)

---

### 3. 🎙️ elevenlabs-cli - ElevenLabs AI 音频平台

**GitHub:** [openclaw/skills](https://github.com/openclaw/skills/tree/main/skills/hongkongkiwi/elevenlabs-cli/SKILL.md)

**核心功能：**
- 文本转语音 (TTS) - 多种高质量语音
- 语音转文本 (STT) - 准确转录
- 语音克隆 - 定制个性化声音
- 音效生成
- 音乐生成

**实用场景：**
- "用 Sarah 的声音把这段文字读出来"
- "转录这个会议录音"
- "克隆我的声音生成播客开场白"
- "为视频添加音效"

**技术实现：**
- 集成 ElevenLabs 官方 API
- 支持 29+ 种语言
- 低延迟流式播放
- 语音情感和语调控制

**推荐指数：** ⭐⭐⭐⭐⭐ (专业级音频处理)

---

### 4. 🎬 ffmpeg-master - 专业音视频处理

**GitHub:** [openclaw/skills](https://github.com/openclaw/skills/tree/main/skills/liudu2326526/ffmpeg-master/SKILL.md)

**核心功能：**
- 视频格式转换 (MP4, AVI, MKV, MOV 等)
- 音频提取和分离
- 视频裁剪、合并、分割
- 添加字幕和水印
- 视频压缩和优化
- 视频转 GIF

**实用场景：**
- "把这个 MOV 格式的视频转成 MP4"
- "提取视频里的音频"
- "把这段视频裁剪成 3 个片段"
- "为视频添加中文字幕"

**技术实现：**
- 基于 FFmpeg 引擎
- 支持几乎所有音视频格式
- 高性能硬件加速（可选）
- 批量处理能力

**推荐指数：** ⭐⭐⭐⭐⭐ (视频创作者必备工具)

---

### 5. 📱 youtube-pro - YouTube 高级分析工具

**GitHub:** [openclaw/skills](https://github.com/openclaw/skills/tree/main/skills/kjaylee/youtube-pro/SKILL.md)

**核心功能：**
- 获取视频详细信息（标题、描述、标签）
- 提取字幕和自动生成字幕
- 分析视频元数据
- 获取频道信息
- 下载视频和音频
- 播放列表分析

**实用场景：**
- "分析这个 YouTube 视频的关键信息"
- "下载这个视频的字幕"
- "提取视频中的音频"
- "分析频道的热门视频"

**技术实现：**
- 使用 `yt-dlp` 库
- 支持多种视频质量
- 字幕提取和多语言支持
- 视频元数据深度解析

**推荐指数：** ⭐⭐⭐⭐ (内容创作者和研究人员)

---

### 6. 🎮 chromecast - Chromecast 设备控制

**GitHub:** [openclaw/skills](https://github.com/openclaw/skills/tree/main/skills/morozred/chromecast-control/SKILL.md)

**核心功能：**
- 发现本地网络中的 Chromecast 设备
- 投送视频、音频、图片到电视
- 控制播放（播放、暂停、停止）
- 音量调节
- 设备状态查询

**实用场景：**
- "把手机上的视频投到电视上"
- "暂停电视上的播放"
- "搜索并播放某个 YouTube 视频"

**技术实现：**
- 使用 `pychromecast` 库
- 支持多种媒体格式
- 与 YouTube、Netflix 等服务集成
- 局域网设备自动发现

**推荐指数：** ⭐⭐⭐⭐ (Chromecast 用户)

---

### 7. 🎹 music-cog - AI 原创音乐生成

**GitHub:** [openclaw/skills](https://github.com/openclaw/skills/tree/main/skills/nitishgargiitd/music-cog/SKILL.md)

**核心功能：**
- 基于文本提示生成原创音乐
- 选择不同音乐风格（古典、电子、流行等）
- 控制音乐时长
- 高质量音频输出

**实用场景：**
- "生成一首 3 分钟的电子背景音乐"
- "为视频制作适合的背景音乐"
- "创作一首欢快的音乐用于 Vlog"

**技术实现：**
- 使用 CellCog AI 引擎
- 原创音乐生成（无版权问题）
- 可定制的音乐参数
- 多种风格支持

**推荐指数：** ⭐⭐⭐⭐⭐ (内容创作者必备)

---

### 8. 📥 download-tools - 媒体下载工具集

**GitHub:** [openclaw/skills](https://github.com/openclaw/skills/tree/main/skills/jqlong17/download-tools/SKILL.md)

**核心功能：**
- YouTube 视频和音频下载
- 微信视频号内容下载
- 多格式支持
- 批量下载

**实用场景：**
- "下载这个 YouTube 视频"
- "提取 YouTube 视频的音频"
- "下载微信视频号的内容"
- "批量下载播放列表"

**技术实现：**
- 使用 `yt-dlp` 和专用工具
- 支持多种分辨率和格式
- 保留字幕和元数据
- 智能处理链接

**推荐指数：** ⭐⭐⭐⭐ (内容收集和归档)

---

## 🎯 应用场景总结

### 🎵 音乐娱乐场景
- 全屋音频系统控制（Apple Music, HomePod）
- 个性化音乐推荐和播放
- AI 原创音乐生成
- 音乐数据分析和统计

### 📺 视频制作场景
- 视频格式转换和处理
- 视频剪辑和合并
- 添加字幕和水印
- 视频压缩和优化

### 🎙️ 音频处理场景
- 高质量语音合成
- 语音识别和转录
- 音效生成
- 语音克隆定制

### 📱 社交媒体场景
- 视频发布到多个平台
- 社交媒体内容规划
- 自动生成内容日历
- 竞品分析

### 🏠 智能家居场景
- 媒体设备控制（Apple TV, Chromecast）
- 多房间音频同步
- 语音控制播放
- 自动播放场景

---

## 🏆 推荐指数排名

| 排名 | Skill | 推荐指数 | 适用人群 |
|------|-------|---------|---------|
| 1 | music-cog | ⭐⭐⭐⭐⭐ | 内容创作者、视频制作者 |
| 2 | apple-media | ⭐⭐⭐⭐⭐ | Apple 生态用户 |
| 3 | elevenlabs-cli | ⭐⭐⭐⭐⭐ | 播客制作、配音需求 |
| 4 | ffmpeg-master | ⭐⭐⭐⭐⭐ | 视频创作者 |
| 5 | clawtunes | ⭐⭐⭐⭐ | macOS + Apple Music 用户 |
| 6 | youtube-pro | ⭐⭐⭐⭐ | 内容创作者、研究人员 |
| 7 | chromecast | ⭐⭐⭐⭐ | Chromecast 用户 |
| 8 | download-tools | ⭐⭐⭐⭐ | 内容收集、归档 |

---

## 💡 实用建议

1. **新手入门：** 从 `apple-media` 或 `clawtunes` 开始，快速体验媒体控制
2. **内容创作者：** 组合使用 `music-cog` + `ffmpeg-master` + `youtube-pro`
3. **播客制作：** `elevenlabs-cli` 的语音合成和转录功能非常强大
4. **批量处理：** 利用 `ffmpeg-master` 的批量处理功能提高效率
5. **智能家居：** 结合 `apple-media`、`chromecast` 实现全屋媒体控制

---

## 🔗 更多资源

- **完整分类列表：** [Media & Streaming](https://github.com/openclaw/skills/tree/main/categories/media-and-streaming.md)
- **OpenClaw 官方文档：** https://docs.openclaw.ai
- **技能市场：** https://clawhub.com

---

> 💡 **明日预告：** 个人发展 (Personal Development) 分类 - 提升 AI 助手的软技能和帮助能力

**今日分类进度：18/30** ✅
