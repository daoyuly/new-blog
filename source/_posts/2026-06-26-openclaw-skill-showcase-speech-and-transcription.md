---
title: OpenClaw Skill 每日推荐 - 语音与转录
tags:
  - openclaw
  - skill
  - 语音与转录
categories:
  - 技术推荐
abbrlink: 6233
date: 2026-06-26 11:30:00
description: "语音交互正成为 AI Agent 最自然的交互方式之一。今天我们走进 Speech & Transcription 分类，这里有 45 个 Skill，覆盖从语音识别（STT）、语音合成（TTS）到声音克隆、会议纪要等全链路场景。"
keywords: "openclaw, skill, 每日推荐, 语音与转录, 技术推荐"
---

# 🎙️ OpenClaw Skill 每日推荐 - 语音与转录

> 第 28 期 | 2026年6月26日

语音交互正成为 AI Agent 最自然的交互方式之一。今天我们走进 **Speech & Transcription** 分类，这里有 **45 个 Skill**，覆盖从语音识别（STT）、语音合成（TTS）到声音克隆、会议纪要等全链路场景。

---

## 📋 分类概述

| 维度 | 数据 |
|------|------|
| 分类名 | Speech & Transcription |
| Skill 总数 | 45 |
| 核心方向 | STT 转录、TTS 合成、声音克隆、语音 Agent |
| 热门服务 | ElevenLabs、Whisper、Kokoro、SiliconFlow |

---

## ⭐ 精选 Skill 详解

### 1. faster-whisper — 本地语音转文本

- **GitHub**: [theplasmak/faster-whisper](https://github.com/openclaw/skills/tree/main/skills/theplasmak/faster-whisper/SKILL.md)
- **核心功能**: 基于 CTranslate2 优化的 Whisper 模型，本地运行语音转录，无需云端 API
- **实用场景**:
  - 会议录音本地转文字，保护隐私不上传
  - 播客/视频字幕自动生成
  - 离线环境下批量转录音频文件
- **技术实现**: 使用 faster-whisper 库（CTranslate2 后端），比原版 whisper 快 4 倍，内存占用更低，支持多种模型大小（tiny → large-v3）
- **推荐指数**: ⭐⭐⭐⭐⭐

```bash
# 安装后直接使用
openclaw skill add theplasmak/faster-whisper
# 对音频文件进行转录
```

> 💡 **实用建议**: 如果你关心数据隐私或需要离线转录，这是首选。配合 `auto-whisper-safe` Skill 可以在 16GB 内存机器上稳定运行长音频。

---

### 2. elevenlabs-tts — 最佳 ElevenLabs 集成

- **GitHub**: [shaharsha/elevenlabs-tts](https://github.com/openclaw/skills/tree/main/skills/shaharsha/elevenlabs-tts/SKILL.md)
- **核心功能**: ElevenLabs 文本转语音，支持多语言、多音色，音质业界领先
- **实用场景**:
  - 为 AI Agent 添加高质量语音输出
  - 有声书、播客旁白自动生成
  - 多角色对话配音（不同 voice ID）
- **技术实现**: 调用 ElevenLabs REST API，支持流式输出，可选声音克隆和 Voice Design 功能
- **推荐指数**: ⭐⭐⭐⭐⭐

```bash
openclaw skill add shaharsha/elevenlabs-tts
```

> 💡 **实用建议**: ElevenLabs 是目前 TTS 音质天花板，但需付费。免费额度有限，建议配合 `kokoro-tts` 做日常使用，ElevenLabs 留给需要高保真的场景。

---

### 3. kokoro-tts — 本地高质量 TTS

- **GitHub**: [edkief/kokoro-tts](https://github.com/openclaw/skills/tree/main/skills/edkief/kokoro-tts/SKILL.md)
- **核心功能**: 使用 Kokoro TTS 引擎本地生成语音，完全离线，零 API 费用
- **实用场景**:
  - 日常 TTS 需求，不想付 API 费用
  - 隐私敏感内容的语音合成
  - 开发调试阶段高频调用
- **技术实现**: Kokoro 是开源 TTS 模型，支持本地推理，音质接近云端服务
- **推荐指数**: ⭐⭐⭐⭐

```bash
openclaw skill add edkief/kokoro-tts
```

> 💡 **实用建议**: 免费 + 本地 = 日常首选。音质虽不及 ElevenLabs，但远超系统自带 TTS。

---

### 4. elevenlabs-voices — 18 角色语音合成

- **GitHub**: [robbyczgw-cla/elevenlabs-voices](https://github.com/openclaw/skills/tree/main/skills/robbyczgw-cla/elevenlabs-voices/SKILL.md)
- **核心功能**: 预设 18 种人物角色 + 32 种音色的 ElevenLabs 语音合成，一键切换角色风格
- **实用场景**:
  - 多角色有声书制作（ narrator / 角色A / 角色B...）
  - 播客节目多主持人配音
  - 游戏角色对话生成
- **技术实现**: 基于 ElevenLabs API，封装了角色-音色映射表，自动匹配 voice ID 和风格参数
- **推荐指数**: ⭐⭐⭐⭐

```bash
openclaw skill add robbyczgw-cla/elevenlabs-voices
# 指定角色生成语音
```

> 💡 **实用建议**: 比 `elevenlabs-tts` 更适合需要多角色切换的场景，省去手动查找 voice ID 的麻烦。

---

### 5. clonev — 声音克隆

- **GitHub**: [instant-picture/clonev](https://github.com/openclaw/skills/tree/main/skills/instant-picture/clonev/SKILL.md)
- **核心功能**: 使用 Coqui XTTS v2 克隆任意声音，仅需短音频样本即可生成该声音的语音
- **实用场景**:
  - 克隆自己的声音，让 AI 用你的声音说话
  - 为视频角色定制专属配音
  - 修复/补录音频片段
- **技术实现**: 基于 Coqui XTTS v2 开源模型，支持 few-shot 语音克隆，本地或远程推理
- **推荐指数**: ⭐⭐⭐⭐

```bash
openclaw skill add instant-picture/clonev
# 提供音频样本 → 克隆声音 → 生成新语音
```

> ⚠️ **注意**: 声音克隆涉及伦理问题，请仅克隆自己或获得授权的声音。

---

## 🏆 推荐指数排名

| 排名 | Skill | 推荐指数 | 核心优势 |
|------|-------|---------|---------|
| 🥇 | faster-whisper | ⭐⭐⭐⭐⭐ | 本地转录，隐私+速度 |
| 🥈 | elevenlabs-tts | ⭐⭐⭐⭐⭐ | TTS 音质天花板 |
| 🥉 | kokoro-tts | ⭐⭐⭐⭐ | 免费本地 TTS |
| 4 | elevenlabs-voices | ⭐⭐⭐⭐ | 多角色一键切换 |
| 5 | clonev | ⭐⭐⭐⭐ | 开源声音克隆 |

---

## 🎯 应用场景总结

### 语音输入链路（STT）
- **隐私优先**: `faster-whisper`（本地）→ `auto-whisper-safe`（低内存）
- **云端高精度**: `assemblyai-transcribe`、`elevenlabs-transcribe`、`deepgram`
- **飞书会议**: `feishu-minutes`（直接获取飞书会议转录+纪要）

### 语音输出链路（TTS）
- **极致音质**: `elevenlabs-tts` → `elevenlabs-voices`（多角色）
- **免费本地**: `kokoro-tts` → `chichi-speech`（Qwen3 驱动）
- **国内服务**: `doubao-api-open-tts`（火山引擎）、`siliconflow-tts-gen`（CosyVoice2）

### 进阶玩法
- **声音克隆**: `clonev`（Coqui XTTS v2）
- **全双工语音 Agent**: `cult-of-carcinization`（给 Agent 加耳朵和嘴）、`claw-voice`
- **全屋播报**: `announcer`（AirPlay 多房间广播）

### 推荐组合
```
日常转录: faster-whisper + auto-whisper-safe
日常 TTS: kokoro-tts
高品质场景: elevenlabs-tts + elevenlabs-voices
语音 Agent: claw-voice + faster-whisper
```

---

## 💡 实用建议

1. **STT 选型优先考虑本地方案** — faster-whisper 速度和质量都够用，数据不离开本机
2. **TTS 付费与免费搭配** — 日常用 kokoro-tts，关键场景切 elevenlabs-tts
3. **国内用户关注 doubao-api-open-tts 和 siliconflow-tts-gen** — 延迟低，无需科学上网
4. **长音频转录务必用 auto-whisper-safe** — 自动分块，避免 OOM 崩溃
5. **飞书用户直接用 feishu-minutes** — 一条龙搞定会议转录+纪要

---

*明天预告: 🚗 Transportation — 交通出行类 Skill，让你的 Agent 帮你规划路线、叫车、查航班！*

---

> 📌 本系列共 30 期，每日一个分类，带你发现 OpenClaw 生态中最实用的 Skill。
> 
> 专栏索引: [awesome-openclaw-skills](https://github.com/openclaw/skills)
