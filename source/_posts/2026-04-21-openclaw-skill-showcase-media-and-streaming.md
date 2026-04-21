---
title: OpenClaw Skill 每日推荐 - 媒体与流媒体 (Media & Streaming)
tags:
  - openclaw
  - skill
  - media-and-streaming
categories:
  - 技术推荐
abbrlink: 16144
date: 2026-04-21 00:00:00
---

# 媒体与流媒体 (Media & Streaming) - OpenClaw Skill 每日推荐

今天是 OpenClaw Skill 每日推荐的第17天！今天我们探索的是 **媒体与流媒体** 分类，这个分类包含 **84个** 技能，涵盖了音频、视频、流媒体播放、社交媒体等全方位的媒体处理和交互能力。

## 分类概述

媒体与流媒体分类是 OpenClaw 生态中最具娱乐性和实用性的分类之一，主要包含：

- 🎵 **音乐控制**：Apple Music、本地音频播放、流媒体音乐
- 🎬 **视频处理**：FFmpeg 视频编辑、格式转换、流媒体播放
- 📺 **设备控制**：Chromecast、Apple TV、智能音响
- 🎙️ **AI 音频**：语音合成、语音识别、声音克隆
- 📱 **社交媒体**：Instagram、YouTube 内容管理
- 🎥 **内容生成**：AI 视频、音乐生成、音效制作

## 精选 Skill 详解

### 1. 🍎 apple-music - Apple Music 深度集成

**GitHub**: [epheterson/mcp-applemusic](https://github.com/openclaw/skills/tree/main/skills/epheterson/mcp-applemusic/SKILL.md)

**推荐指数**: ⭐⭐⭐⭐⭐

#### 核心功能

这个 skill 提供了两种集成方式：

**AppleScript (macOS)**
- 零配置，立即可用
- 完整的播放控制（播放、暂停、跳过、音量）
- 播放列表管理（创建、编辑、删除）
- 音乐库搜索和管理
- AirPlay 设备控制

**MusicKit API (跨平台)**
- 需要 Apple Developer 账户（$99/年）
- 支持跨平台（Windows、Linux）
- 曲目库搜索功能
- 个性化推荐和历史记录

#### 技术实现

```bash
# AppleScript 示例 - 控制播放
osascript -e 'tell application "Music" to playpause'
osascript -e 'tell application "Music" to return name of current track'

# 获取当前播放信息
osascript <<'EOF'
tell application "Music"
  set t to current track
  return {name of t, artist of t, album of t}
end tell
EOF
```

#### 实用场景

1. **自动化播放列表创建**：根据心情、时间、活动自动生成播放列表
2. **音乐数据分析**：追踪听歌历史、统计最爱歌手和歌曲
3. **智能推荐**：基于听歌习惯推荐新音乐
4. **多房间音响控制**：通过 AirPlay 同步控制多个房间

#### 重要提示

⚠️ **关键限制**：不能直接将曲目库歌曲添加到播放列表，必须先添加到音乐库，然后使用库 ID 而非曲目库 ID。

---

### 2. 📺 chromecast - Chromecast 设备完全控制

**GitHub**: [morozred/chromecast-control](https://github.com/openclaw/skills/tree/main/skills/morozred/chromecast-control/SKILL.md)

**推荐指数**: ⭐⭐⭐⭐⭐

#### 核心功能

基于 `catt` (Cast All The Things) CLI 工具，提供完整的 Chromecast 控制能力：

- **设备发现与管理**：扫描网络中的所有 Chromecast 设备
- **媒体投射**：支持 YouTube、Vimeo、本地文件等数百种视频源
- **播放控制**：播放、暂停、跳过、音量控制
- **队列管理**：添加视频到播放队列、保存/恢复播放状态
- **高级功能**：字幕支持、时间戳跳转、格式选择

#### 技术实现

```bash
# 扫描所有设备
catt scan

# 投射 YouTube 视频
catt cast "https://www.youtube.com/watch?v=VIDEO_ID"

# 投射本地文件
catt cast ./video.mp4

# 播放控制
catt pause
catt play
catt seek 300  # 跳转到 5 分钟
catt volume 50

# 队列管理
catt add "https://youtube.com/watch?v=VIDEO_ID"
catt add -n "https://youtube.com/watch?v=VIDEO_ID"  # 插队播放
catt clear

# 保存/恢复播放状态
catt save
catt restore
```

#### 实用场景

1. **自动化观影**：定时投射视频、自动播放列表
2. **多设备同步**：同时控制多个房间的 Chromecast
3. **内容分发**：从 AI 生成的内容直接投射到电视
4. **背景音乐**：创建自动化音乐播放队列

#### 网络要求

⚠️ Chromecast 和控制设备必须在同一网络，TCP 端口 45000-47000 需要开放用于本地文件投射。

---

### 3. 🎙️ elevenlabs-cli - AI 音频全功能平台

**GitHub**: [hongkongkiwi/elevenlabs-cli](https://github.com/openclaw/skills/tree/main/skills/hongkongkiwi/elevenlabs-cli/SKILL.md)

**推荐指数**: ⭐⭐⭐⭐⭐

#### 核心功能

这是 ElevenLabs AI 音频平台的官方 CLI 客户端，提供 100% SDK 覆盖：

**文本转语音 (TTS)**
- 100+ 预设语音
- 29 种语言支持
- 可调节音质参数（稳定性、相似度、风格）
- 支持批量生成、音频播放

**语音转文字 (STT)**
- 高精度转录
- 说话人分离（Diarization）
- 时间戳标记
- 支持字幕输出（SRT、VTT）

**声音克隆**
- 从音频样本克隆声音
- 音色相似度调节
- 声音共享和发现

**高级功能**
- AI 音效生成
- 语音变换（Voice Changer）
- 降噪和声音隔离
- 多语言视频配音
- 对话生成
- 对话式 AI 代理管理

#### 技术实现

```bash
# 设置 API Key
export ELEVENLABS_API_KEY="your-api-key"

# 文本转语音
elevenlabs tts "Hello, world!" --voice Rachel --model eleven_v3
elevenlabs tts --file script.txt --output audiobook.mp3

# 语音转文字（带说话人分离）
elevenlabs stt meeting.mp3 --diarize --num-speakers 3

# 声音克隆
elevenlabs voice clone --name "My Voice" --samples sample1.mp3,sample2.mp3

# AI 音效生成
elevenlabs sfx "door creaking slowly in a haunted house" --duration 5

# 语音变换
elevenlabs voice-changer input.mp3 --voice Rachel --output transformed.mp3

# 视频配音
elevenlabs dub create --file video.mp4 --source-lang en --target-lang es
```

#### 实用场景

1. **有声书制作**：自动生成高质量有声书
2. **视频配音**：为 AI 生成的视频添加多语言配音
3. **播客转录**：自动转录播客并生成字幕
4. **个性化语音助手**：克隆自己的声音创建语音助手
5. **内容创作**：生成背景音乐和音效

#### 隐私说明

🔒 这是非官方社区维护的 CLI，会发送你的 API Key 和内容到 ElevenLabs 服务器。请注意数据隐私。

---

### 4. 🎬 ffmpeg-master - 专业视频音频处理

**GitHub**: [liudu2326526/ffmpeg-master](https://github.com/openclaw/skills/tree/main/skills/liudu2326526/ffmpeg-master/SKILL.md)

**推荐指数**: ⭐⭐⭐⭐⭐

#### 核心功能

FFmpeg 是业界最强大的多媒体处理框架，这个 skill 提供了全面的使用指南：

**视频处理**
- 格式转换（MP4、MKV、WebM 等）
- 编码转换（H.264、H.265/HEVC、VP9）
- 分辨率调整和裁剪
- 视频剪辑和拼接
- 速度调整（快进/慢动作）
- 水印添加
- 淡入淡出效果

**音频处理**
- 音频提取和转换
- 音量调整
- 音频降噪
- 音频拼接

**高级功能**
- 复杂滤镜链（filter_complex）
- 多视频合成（画中画、分屏）
- 过渡效果
- 硬件加速（NVIDIA、Intel、Apple）
- 元数据处理

#### 技术实现

```bash
# 基础转换
ffmpeg -i input.mp4 output.mkv

# 视频编码为 H.265（更好压缩）
ffmpeg -i input.mp4 -c:v libx265 -crf 28 -c:a copy output.mp4

# 提取音频
ffmpeg -i input.mp4 -vn -c:a libmp3lame -q:a 2 output.mp3

# 调整分辨率（1080p）
ffmpeg -i input.mp4 -vf "scale=1920:1080" output.mp4

# 视频剪辑（从 10 秒开始，持续 30 秒）
ffmpeg -i input.mp4 -ss 00:00:10 -t 00:00:30 -c copy output.mp4

# 添加水印
ffmpeg -i input.mp4 -i watermark.png \
  -filter_complex "overlay=main_w-overlay_w-10:main_h-overlay_h-10" \
  output.mp4

# 垂直堆叠两个视频
ffmpeg -i top.mp4 -i bottom.mp4 \
  -filter_complex "vstack=inputs=2" \
  output.mp4

# 左右分屏
ffmpeg -i left.mp4 -i right.mp4 \
  -filter_complex "hstack=inputs=2" \
  output.mp4

# 调整视频速度（2 倍速）
ffmpeg -i input.mp4 \
  -filter_complex "[0:v]setpts=0.5*PTS[v];[0:a]atempo=2.0[a]" \
  -map "[v]" -map "[a]" output.mp4

# 硬件加速（NVIDIA）
ffmpeg -i input.mp4 -c:v h264_nvenc output.mp4
```

#### 实用场景

1. **视频编辑**：自动化视频剪辑、格式转换
2. **内容优化**：调整视频大小、压缩、优化网络传输
3. **批量处理**：批量转换视频格式、添加水印
4. **AI 内容后处理**：为 AI 生成的视频添加特效和转场
5. **直播准备**：调整视频参数以适应直播平台要求

#### 性能提示

⚡ 使用 `-ss` 在 `-i` 之前进行快速定位（input seeking），但精度较低。需要精确剪辑时，放在 `-i` 之后（output seeking）。

---

### 5. 📱 instagram-api - Instagram 官方 API 集成

**GitHub**: [lifeissea/instagram-api](https://github.com/openclaw/skills/tree/main/skills/lifeissea/instagram-api/SKILL.md)

**推荐指数**: ⭐⭐⭐⭐

#### 核心功能

使用 Meta Graph API 直接发布内容到 Instagram 和 Threads：

**Instagram 内容发布**
- **Feed 帖子**：图片 + 文字
- **Story 限时动态**：竖屏图片
- **Reels 短视频**：短视频 + 文字
- **Carousel 轮播**：多图展示

**Threads 发布**
- 纯文字帖子
- 图片 + 文字帖子

**媒体托管**
- 集成 Imgur API 生成公开 URL
- 自动处理媒体上传流程

#### 技术实现

```bash
# 环境变量配置
export INSTAGRAM_ACCESS_TOKEN="your_token"
export INSTAGRAM_BUSINESS_ACCOUNT_ID="your_account_id"
export IMGUR_CLIENT_ID="your_imgur_client_id"

# 发布 Feed 帖子
bash scripts/post-feed.sh ./photo.jpg ./caption.txt

# 发布 Story
bash scripts/post-story.sh ./story.jpg

# 发布 Reels
bash scripts/post-reels.sh ./reel.mp4 ./caption.txt

# 发布 Carousel（轮播图）
bash scripts/post-carousel.sh ./caption.txt ./img1.jpg ./img2.jpg ./img3.jpg

# 发布 Threads
bash scripts/post-threads.sh ./caption.txt
bash scripts/post-threads.sh ./caption.txt "https://example.com/image.jpg"
```

#### 实用场景

1. **社交媒体自动化**：定时发布内容
2. **内容分发**：从 AI 生成的内容自动发布到 Instagram
3. **多平台同步**：同时发布到 Instagram 和 Threads
4. **批量管理**：批量处理和发布内容

#### 重要限制

⚠️ Instagram 只接受公开 URL 的媒体上传，因此需要 Imgur 作为中转。Reels 视频处理可能需要几分钟时间。

## 应用场景总结

### 娱乐与创作

1. **自动化媒体中心**：使用 chromecast + apple-music + ffmpeg 创建智能娱乐系统
2. **内容创作流水线**：AI 生成视频 → ffmpeg 编辑 → elevenlabs 配音 → 自动发布到 Instagram
3. **个性化音频体验**：克隆自己的声音，生成个性化语音助手

### 商业应用

1. **社交媒体运营**：自动化 Instagram 发布、视频制作、音频内容
2. **内容营销**：批量生成和发布视频、音频、图片内容
3. **品牌管理**：统一管理多平台的媒体内容和播放列表

### 技术开发

1. **媒体处理自动化**：使用 ffmpeg 进行批量视频处理
2. **AI 内容集成**：将 AI 生成的内容快速发布到各大平台
3. **智能设备控制**：统一控制家庭中的媒体设备

## 推荐指数排名

| Skill | 推荐指数 | 适用人群 | 难度 |
|-------|---------|---------|------|
| apple-music | ⭐⭐⭐⭐⭐ | Apple 用户、音乐爱好者 | ⭐⭐ |
| chromecast | ⭐⭐⭐⭐⭐ | Chromecast 用户、家庭影院 | ⭐⭐ |
| elevenlabs-cli | ⭐⭐⭐⭐⭐ | 内容创作者、AI 爱好者 | ⭐⭐⭐ |
| ffmpeg-master | ⭐⭐⭐⭐⭐ | 视频处理、媒体开发 | ⭐⭐⭐⭐ |
| instagram-api | ⭐⭐⭐⭐ | 社交媒体运营、内容营销 | ⭐⭐⭐ |

## 实用建议

### 入门推荐

如果你刚接触媒体与流媒体分类，建议从以下开始：

1. **chromecast**：最实用，配置简单，立即见效
2. **apple-music**：如果你是 Apple 用户，这是必备工具
3. **elevenlabs-cli**：体验 AI 音频的强大功能

### 进阶路径

1. 学习 **ffmpeg-master** 的基础命令
2. 集成 **instagram-api** 实现自动化发布
3. 组合使用多个 skill 创建完整的媒体处理流水线

### 注意事项

- **网络要求**：chromecast 需要同一网络，确保端口开放
- **API 密钥**：elevenlabs-cli 和 instagram-api 需要注册获取 API 密钥
- **成本考虑**：部分服务（ElevenLabs、Apple Developer）可能产生费用
- **隐私保护**：注意第三方 API 的数据隐私政策

## 结语

媒体与流媒体分类展现了 OpenClaw 在娱乐和内容创作领域的强大能力。从简单的音乐播放到复杂的视频处理，从 AI 语音生成到社交媒体自动化，这些技能可以帮助你构建完整的媒体生态系统。

明天我们将继续探索下一个分类，敬请期待！

---

**系列索引**：
- 第16天：[智能家居与物联网](2026-04-20-openclaw-skill-showcase-smart-home-and-iot.md)
- 第18天：[个人发展](2026-04-22-openclaw-skill-showcase-personal-development.md) (即将推出)

**相关资源**：
- [OpenClaw Skills 官方仓库](https://github.com/openclaw/skills)
- [Media & Streaming 分类完整列表](https://github.com/openclaw/skills/tree/main/categories/media-and-streaming.md)
