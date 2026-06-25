---
title: OpenClaw Skill 每日推荐 - Speech & Transcription（语音与转录）
tags:
  - openclaw
  - skill
  - speech-and-transcription
categories:
  - 技术推荐
abbrlink: 42312
date: 2026-06-25 11:30:00
---

# 🎙️ OpenClaw Skill 每日推荐 — Speech & Transcription（语音与转录）

> 当 AI 学会「开口说话」和「倾听理解」，人机交互才真正跨越了屏幕的边界。

今天我们聚焦 **Speech & Transcription** 分类，这个分类包含 **45 个 Skills**，覆盖语音合成（TTS）、语音识别（STT）、声音克隆、会议纪要等场景。以下是精选推荐。

---

## 🏆 精选 Skill 详解

### 1. faster-whisper — 本地语音转录利器

**GitHub:** [theplasmak/faster-whisper](https://github.com/openclaw/skills/tree/main/skills/theplasmak/faster-whisper/SKILL.md)

**核心功能：** 基于 CTranslate2 优化的 Whisper 模型，在本地完成语音转文字，无需云端 API。

**实用场景：**
- 离线环境下的会议录音转写
- 隐私敏感场景的语音转录（医疗、法律）
- 批量处理播客/讲座音频生成字幕

**技术实现：** 使用 faster-whisper 库（Whisper 的 CTranslate2 重实现），比原版快 4 倍，内存占用减少 50%。支持多语言识别和自动语言检测。

**推荐指数：** ⭐⭐⭐⭐⭐

> 本地运行 = 零成本 + 零隐私顾虑，这是语音转录的首选方案。

---

### 2. elevenlabs-tts — 最佳 ElevenLabs 集成

**GitHub:** [shaharsha/elevenlabs-tts](https://github.com/openclaw/skills/tree/main/skills/shaharsha/elevenlabs-tts/SKILL.md)

**核心功能：** 将文本转换为接近真人的高质量语音，集成 ElevenLabs 的全部语音模型。

**实用场景：**
- 为博客文章生成音频版本（有声阅读）
- 视频配音 / 播客旁白
- AI Agent 语音交互场景

**技术实现：** 调用 ElevenLabs REST API，支持 29+ 语言、多种音色选择、语速和情感调节。输出 MP3 格式，可直接附加到消息中发送。

**推荐指数：** ⭐⭐⭐⭐⭐

> ElevenLabs 目前是 TTS 领域的天花板，自然度远超传统方案。

---

### 3. clonev — 一键声音克隆

**GitHub:** [instant-picture/clonev](https://github.com/openclaw/skills/tree/main/skills/instant-picture/clonev/SKILL.md)

**核心功能：** 克隆任意声音并生成语音，基于 Coqui XTTS v2 模型。

**实用场景：**
- 个性化 AI 语音助手（用你自己的声音）
- 有声书多角色配音
- 内容创作者的个性化语音品牌

**技术实现：** 基于 Coqui XTTS v2 开源模型，仅需几秒音频样本即可克隆声音。支持本地运行，也可接入 API 服务。

**推荐指数：** ⭐⭐⭐⭐

> 声音克隆是语音领域的"魔法"，但请注意合规使用，尊重他人声音权。

---

### 4. feishu-minutes — 飞书会议纪要自动生成

**GitHub:** [autogame-17/feishu-minutes](https://github.com/openclaw/skills/tree/main/skills/autogame-17/feishu-minutes/SKILL.md)

**核心功能：** 从飞书会议中获取信息、统计数据、转录文本和媒体文件，自动生成会议纪要。

**实用场景：**
- 自动整理飞书音视频会议内容
- 生成会议摘要和行动项
- 归档会议记录到知识库

**技术实现：** 通过飞书开放 API 获取会议相关数据，结合 STT 服务转录音频，再由 LLM 提炼摘要。

**推荐指数：** ⭐⭐⭐⭐⭐

> 飞书用户的福音——开完会，纪要已经写好了。

---

### 5. kokoro-tts — 轻量本地 TTS 引擎

**GitHub:** [edkief/kokoro-tts](https://github.com/openclaw/skills/tree/main/skills/edkief/kokoro-tts/SKILL.md)

**核心功能：** 基于 Kokoro 模型的本地文本转语音引擎，无需 API Key。

**实用场景：**
- 日常语音通知和提醒
- 本地化语音交互原型开发
- 不依赖云服务的 TTS 方案

**技术实现：** 使用 Kokoro 开源 TTS 模型，完全本地推理，支持中英日等多种语言。模型体积小，可在消费级 GPU 上实时生成。

**推荐指数：** ⭐⭐⭐⭐

> 如果 faster-whisper 是 STT 的本地优选，kokoro-tts 就是 TTS 的对应方案。

---

## 📊 推荐指数排名

| 排名 | Skill | 推荐指数 | 核心优势 |
|:---:|:---|:---:|:---|
| 1 | faster-whisper | ⭐⭐⭐⭐⭐ | 本地 STT，零成本高隐私 |
| 2 | elevenlabs-tts | ⭐⭐⭐⭐⭐ | 业界最佳 TTS 质量 |
| 3 | feishu-minutes | ⭐⭐⭐⭐⭐ | 飞书生态无缝集成 |
| 4 | clonev | ⭐⭐⭐⭐ | 声音克隆，个性化体验 |
| 5 | kokoro-tts | ⭐⭐⭐⭐ | 本地 TTS，轻量免费 |

---

## 🎯 应用场景总结

**语音输入（STT）：**
- 会议录音转文字 → `faster-whisper` + `feishu-minutes`
- 多语言转录 → `deepgram` / `assemblyai-transcribe`
- 低内存环境 → `auto-whisper-safe`（16GB 机器也能跑）

**语音输出（TTS）：**
- 追求极致音质 → `elevenlabs-tts`
- 本地离线方案 → `kokoro-tts`
- 中文场景 → `doubao-api-open-tts`（火山引擎豆包）、`chichi-speech`（Qwen3）
- 语音克隆 → `clonev` / `elevenlabs-voices`

**端到端方案：**
- 语音对话 Agent → `claw-voice` + `faster-whisper` + `elevenlabs-tts`
- 会议全流程 → `feishu-minutes`（录制→转录→摘要）

---

## 💡 实用建议

1. **先本地后云端**：`faster-whisper` + `kokoro-tts` 组合已覆盖基本需求，零成本起步
2. **质量优先选 ElevenLabs**：如果对音质有要求，`elevenlabs-tts` 值得付费
3. **声音克隆需谨慎**：务必获得声音本人授权，遵守当地法律法规
4. **飞书用户必装**：`feishu-minutes` 能把每周的会议整理时间从小时级降到分钟级
5. **组合使用效果翻倍**：STT + LLM + TTS = 完整的语音交互闭环

---

*本系列每日更新一个 OpenClaw Skill 分类，共 30 期。明天预告：**Transportation（交通出行）**🚗*
