---
title: OpenClaw Skill 每日推荐 - 语音与转录
date: 2026-08-07 11:30:00
tags:
  - openclaw
  - skill
  - speech
  - transcription
  - tts
  - stt
categories:
  - 技术推荐
---

# OpenClaw Skill 每日推荐 - 语音与转录

> 🎤 今日分类：**Speech & Transcription（语音与转录）**
> 
> 共收录 **45 个 Skills**，涵盖语音合成（TTS）、语音识别（STT）、语音克隆、会议转录等方向。

## 📋 分类概述

语音与转录是 OpenClaw 生态中最活跃的分类之一。无论你是想让 AI 助手「开口说话」，还是把会议录音自动转成文字笔记，这个分类都有成熟的解决方案。

主要技术方向包括：

| 方向 | 代表技术 | 典型场景 |
|------|---------|---------|
| 语音合成 (TTS) | ElevenLabs、Kokoro、CosyVoice | 语音回复、有声内容 |
| 语音识别 (STT) | Whisper、AssemblyAI、Deepgram | 会议转录、字幕生成 |
| 语音克隆 | XTTS v2 | 个性化语音、内容创作 |
| 会议集成 | Feishu Minutes | 飞书会议转录与摘要 |

---

## 🏆 精选 Skill 详解

### 1. ElevenLabs TTS ⭐⭐⭐⭐⭐

**GitHub:** [shaharsha/elevenlabs-tts](https://github.com/openclaw/skills/tree/main/skills/shaharsha/elevenlabs-tts/SKILL.md)

**核心功能：** 接入 ElevenLabs API 实现高质量文本转语音，被描述为「OpenClaw 最佳 ElevenLabs 集成」。

**技术实现：**
- 基于 ElevenLabs API，支持多语音模型选择
- 可调节语速、稳定性、相似度等参数
- 支持长文本分段合成，避免 API 长度限制
- 音频文件自动保存到本地

**实用场景：**
```bash
# 让助手用语音回复消息
"帮我用 Morgan 的声音读一下今天的日程"

# 将长文转为播客音频
"把这篇 3000 字的文章转成音频，用 Rachel 的声音"
```

**推荐指数：** ⭐⭐⭐⭐⭐

ElevenLabs 目前是商业 TTS 的天花板级方案，音质自然、情感丰富。这个 Skill 封装完善，是语音交互的首选。

---

### 2. Faster Whisper ⭐⭐⭐⭐⭐

**GitHub:** [theplasmak/faster-whisper](https://github.com/openclaw/skills/tree/main/skills/theplasmak/faster-whisper/SKILL.md)

**核心功能：** 使用 faster-whisper 实现本地语音转文字，无需 API 密钥，完全离线运行。

**技术实现：**
- 基于 CTranslate2 加速的 Whisper 模型
- 支持多种模型大小（tiny 到 large-v3）
- 自动语言检测与翻译
- 支持时间戳输出，便于字幕生成

**实用场景：**
```bash
# 转录本地音频文件
"帮我把 meeting-recording.m4a 转成文字"

# 生成字幕文件
"提取 this-video.mp4 的字幕，输出 SRT 格式"

# 多语言转录
"这段日语录音帮我转成中文文字"
```

**推荐指数：** ⭐⭐⭐⭐⭐

隐私友好、零成本、离线可用。对于需要频繁处理音频转录的用户，这是必装 Skill。faster-whisper 的推理速度比官方 Whisper 快 4-5 倍，内存占用更低。

---

### 3. Auto Whisper Safe ⭐⭐⭐⭐

**GitHub:** [neal-collab/auto-whisper-safe](https://github.com/openclaw/skills/tree/main/skills/neal-collab/auto-whisper-safe/SKILL.md)

**核心功能：** 内存安全的语音转录方案，自动分块处理长音频，在 16GB 内存的机器上也能稳定运行。

**技术实现：**
- 自动音频分块（chunking），避免 OOM
- 智能检测可用内存，动态调整批次大小
- 分块结果自动拼接，保持时间戳连续
- 支持断点续传，中断后可恢复

**实用场景：**
```bash
# 处理 2 小时的会议录音
"这个两小时的全体会议录音帮我转成文字"

# 批量处理播客
"把 podcasts/ 文件夹下所有 mp4 都转成文字"
```

**推荐指数：** ⭐⭐⭐⭐

解决了 faster-whisper 在长音频上容易内存溢出的痛点。如果你的机器内存有限（16GB 或更少），这个 Skill 是更安全的选择。

---

### 4. Clonev - 语音克隆 ⭐⭐⭐⭐

**GitHub:** [instant-picture/clonev](https://github.com/openclaw/skills/tree/main/skills/instant-picture/clonev/SKILL.md)

**核心功能：** 使用 Coqui XTTS v2 克隆任意语音，只需少量样本即可生成目标说话人的语音。

**技术实现：**
- 基于 Coqui XTTS v2 开源模型
- 支持 17+ 种语言的跨语言克隆
- 仅需 3-10 秒参考音频即可克隆
- 本地推理，无需上传语音样本

**实用场景：**
```bash
# 克隆自己的声音
"用我录的这 10 秒音频作为样本，之后用我的声音读文本"

# 多语言内容创作
"用我的声音把这段中文翻译成英文并读出来"

# 有声书制作
"用 X 的声音朗读这本小说的第一章"
```

**推荐指数：** ⭐⭐⭐⭐

语音克隆技术在内容创作领域潜力巨大。Clonev 的本地化方案保护了隐私，但需注意伦理使用——请仅克隆自己或获得授权的声音。

---

### 5. Feishu Minutes - 飞书会议转录 ⭐⭐⭐⭐

**GitHub:** [autogame-17/feishu-minutes](https://github.com/openclaw/skills/tree/main/skills/autogame-17/feishu-minutes/SKILL.md)

**核心功能：** 获取飞书会议的详细信息、统计数据、转录文本和媒体文件。

**技术实现：**
- 调用飞书开放平台 API
- 获取会议参与者、时长、转录文本
- 支持下载会议录制媒体文件
- 可与飞书文档/多维表格联动

**实用场景：**
```bash
# 获取今天会议的转录
"把今天下午的飞书会议转录拉下来，整理成会议纪要"

# 会议数据分析
"统计这周所有飞书会议的参与时长和发言比例"

# 自动归档
"把这个月的飞书会议转录都存到知识库里"
```

**推荐指数：** ⭐⭐⭐⭐

对于使用飞书办公的团队，这个 Skill 极其实用。会议转录 → AI 摘要 → 知识库归档的工作流可以大幅提升团队效率。

---

## 📊 推荐指数排名

| 排名 | Skill 名称 | 评分 | 核心优势 |
|------|-----------|------|---------|
| 1 | ElevenLabs TTS | ⭐⭐⭐⭐⭐ | 最佳商业 TTS 集成，音质天花板 |
| 2 | Faster Whisper | ⭐⭐⭐⭐⭐ | 本地 STT 最佳方案，隐私+免费 |
| 3 | Auto Whisper Safe | ⭐⭐⭐⭐ | 长音频转录不崩溃，低内存友好 |
| 4 | Clonev | ⭐⭐⭐⭐ | 开源语音克隆，本地隐私保护 |
| 5 | Feishu Minutes | ⭐⭐⭐⭐ | 飞书生态集成，团队协作场景必备 |

---

## 🎯 应用场景总结

### 场景一：语音助手交互

搭配 ElevenLabs TTS + Faster Whisper，可以让 OpenClaw 实现完整的语音对话闭环：

```
用户语音输入 → Faster Whisper 转文字 → AI 处理 → ElevenLabs TTS 语音回复
```

### 场景二：会议自动化

飞书会议 → Feishu Minutes 获取转录 → AI 生成会议纪要 → 自动归档到知识库

### 场景三：内容创作

文本稿件 → Clonev 克隆目标声音 → 生成有声内容（播客、有声书等）

### 场景四：批量字幕处理

视频文件 → Auto Whisper Safe 转录 → 生成 SRT 字幕 → 批量处理多个文件

---

## 💡 实用建议

1. **TTS 选型：** 追求音质选 ElevenLabs，追求免费/离线选 Kokoro TTS
2. **STT 选型：** 短音频用 faster-whisper，长音频用 auto-whisper-safe
3. **隐私考量：** 语音数据敏感时，优先使用本地方案（faster-whisper、clonev、kokoro）
4. **成本控制：** ElevenLabs 有免费额度但有限，高频使用建议订阅；Whisper 系列完全免费
5. **安装方式：** 使用 `clawhub install <skill-slug>` 一键安装

---

> 📅 这是 OpenClaw Skill 每日推荐系列的第 28 期。明天将介绍 **Transportation（交通出行）** 分类，敬请期待！
