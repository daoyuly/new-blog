---
title: OpenClaw Skill 每日推荐 - 语音与转录
date: 2026-09-15 11:30:00
tags:
  - openclaw
  - skill
  - speech-and-transcription
  - TTS
  - STT
  - 语音
categories:
  - 技术推荐
---

# OpenClaw Skill 每日推荐 - 语音与转录

> 🎙️ Day 28 — 让 AI 学会倾听与表达

语音交互是人机协作中最自然的方式之一。今天我们走进 **Speech & Transcription** 分类，这里有 **45 个 Skills**，覆盖了从语音识别（STT）、语音合成（TTS）到声音克隆、会议纪要等全链路能力。

## 📋 分类概述

| 维度 | 详情 |
|------|------|
| 分类名称 | Speech & Transcription |
| Skill 总数 | 45 |
| 核心能力 | TTS 语音合成、STT 语音识别、声音克隆、会议转录 |
| 主要服务 | ElevenLabs、Whisper、Kokoro、Deepgram、AssemblyAI、Resemble AI |

---

## 🏆 精选 Skill 详解

### 1. ElevenLabs TTS — 最成熟的云端语音合成集成

**🔗 GitHub:** [openclaw/skills - elevenlabs-tts](https://github.com/openclaw/skills/tree/main/skills/shaharsha/elevenlabs-tts)

**核心功能：**
- 基于 ElevenLabs API 的高品质文本转语音
- 支持多语言、多音色选择
- 自动将生成的音频作为媒体附件返回

**实用场景：**
- 为博客文章生成音频版本，提升可及性
- 为视频配音生成旁白音频
- 在消息应用中发送语音回复

**技术实现：**
通过 ElevenLabs REST API 调用，需要设置 `ELEVENLABS_API_KEY` 环境变量。Skill 封装了文本输入到音频输出的完整流程，生成的音频文件以 OpenClaw 媒体附件形式返回，可直接在消息渠道中使用。

```bash
# 安装后直接使用
openclaw skill install elevenlabs-tts

# 环境变量配置
export ELEVENLABS_API_KEY="your-api-key"
```

**推荐指数：⭐⭐⭐⭐⭐**

> ElevenLabs 是目前商用 TTS 的天花板级方案，音质自然、情感丰富，支持中文。如果你需要最顶级的语音质量，选它就对了。

---

### 2. Faster Whisper — 本地化语音识别利器

**🔗 GitHub:** [openclaw/skills - faster-whisper](https://github.com/openclaw/skills/tree/main/skills/theplasmak/faster-whisper)

**核心功能：**
- 基于 faster-whisper 的本地语音转文字
- 无需云端 API，完全离线运行
- 支持多语言识别和翻译

**实用场景：**
- 会议录音本地转录，隐私零泄露
- 播客/视频字幕自动生成
- 语音指令离式识别

**技术实现：**
faster-whisper 是 OpenAI Whisper 模型的 CTranslate2 优化版本，推理速度比原版快 4 倍，显存占用降低 50%。Skill 自动处理音频加载、模型选择和文本输出。

```python
# 核心调用逻辑示意
from faster_whisper import WhisperModel

model = WhisperModel("large-v3", device="cuda", compute_type="float16")
segments, info = model.transcribe("audio.mp3", language="zh")
for segment in segments:
    print(f"[{segment.start:.2f}s -> {segment.end:.2f}s] {segment.text}")
```

**推荐指数：⭐⭐⭐⭐⭐**

> 隐私敏感场景的首选。16GB 内存即可运行 medium 模型，配合 `auto-whisper-safe` Skill 还能自动分片处理长音频，不会 OOM。

---

### 3. Clonev — 一键声音克隆

**🔗 GitHub:** [openclaw/skills - clonev](https://github.com/openclaw/skills/tree/main/skills/instant-picture/clonev)

**核心功能：**
- 使用 Coqui XTTS v2 进行声音克隆
- 仅需 3-10 秒参考音频即可克隆音色
- 支持多语言合成（包括中文）

**实用场景：**
- 为虚拟数字人定制专属声音
- 有声书多角色配音
- 复刻个人声音用于个性化助手

**技术实现：**
基于 Coqui XTTS v2 开源模型，支持零样本（zero-shot）声音克隆。Skill 接收参考音频和目标文本，输出克隆音色的语音文件。整个流程可在本地 GPU 上完成，无需第三方 API。

```bash
# 基本用法
clonev --reference voice_sample.wav --text "你好，这是克隆的语音" --output output.wav

# 多语言支持
clonev --reference voice_sample.wav --text "Hello world" --language en --output output.wav
```

**推荐指数：⭐⭐⭐⭐**

> 声音克隆是语音领域最酷的技术之一。XTTS v2 在开源方案中效果领先，但请注意伦理使用——不要用于欺骗或冒充他人。

---

### 4. Kokoro TTS — 轻量本地语音引擎

**🔗 GitHub:** [openclaw/skills - kokoro-tts](https://github.com/openclaw/skills/tree/main/skills/edkief/kokoro-tts)

**核心功能：**
- 基于 Kokoro TTS 引擎的本地语音合成
- 无需 API Key，零成本运行
- 部署轻量，适合资源受限环境

**实用场景：**
- 离线环境下的语音播报
- 开发测试阶段的 TTS 功能验证
- 嵌入式设备/IoT 场景语音输出

**技术实现：**
Kokoro 是一个轻量级神经 TTS 引擎，模型体积小（<100MB），推理速度快。Skill 封装了文本预处理、模型推理和音频编码的完整流程，支持批量文本合成。

```bash
# 安装
openclaw skill install kokoro-tts

# 使用
# 在 OpenClaw 对话中直接说："用 kokoro 朗读以下文字：..."
```

**推荐指数：⭐⭐⭐⭐**

> 如果你不想依赖云服务、不想花 API 费用，Kokoro 是最佳平替方案。音质虽不及 ElevenLabs，但远超传统拼接式 TTS，日常使用完全够用。

---

### 5. Feishu Minutes — 飞书会议纪要神器

**🔗 GitHub:** [openclaw/skills - feishu-minutes](https://github.com/openclaw/skills/tree/main/skills/autogame-17/feishu-minutes)

**核心功能：**
- 获取飞书会议信息、统计数据
- 自动提取会议转录文本
- 下载会议录音媒体文件

**实用场景：**
- 自动生成飞书会议纪要
- 提取会议关键决策和行动项
- 归档会议录音到知识库

**技术实现：**
通过飞书开放平台 API 调用，需要配置飞书应用凭证。Skill 支持按时间范围、会议 ID 等条件查询会议，自动拉取转录文本和媒体文件，并可结合 LLM 生成结构化会议纪要。

```python
# 核心流程示意
# 1. 获取会议列表
meetings = feishu.list_minutes(start_time, end_time)
# 2. 获取转录文本
transcript = feishu.get_transcript(meeting_id)
# 3. LLM 生成纪要
summary = llm.summarize(transcript, prompt="提取关键决策和行动项")
```

**推荐指数：⭐⭐⭐⭐⭐**

> 飞书重度用户的必装 Skill。把会议纪要这件事完全自动化——开完会，纪要就躺在你的知识库里了。对中文场景的支持尤为出色。

---

## 📊 推荐指数排名

| 排名 | Skill | 评分 | 核心优势 |
|------|-------|------|----------|
| 🥇 | ElevenLabs TTS | ⭐⭐⭐⭐⭐ | 商用级音质天花板，中文支持优秀 |
| 🥇 | Faster Whisper | ⭐⭐⭐⭐⭐ | 本地 STT 最佳方案，隐私无忧 |
| 🥇 | Feishu Minutes | ⭐⭐⭐⭐⭐ | 飞书生态深度集成，会议纪要自动化 |
| 🥈 | Clonev | ⭐⭐⭐⭐ | 开源声音克隆，零样本学习 |
| 🥈 | Kokoro TTS | ⭐⭐⭐⭐ | 轻量本地 TTS，零成本部署 |

---

## 🎯 应用场景总结

### 场景一：智能会议助手
**组合：** Feishu Minutes + Faster Whisper + ElevenLabs TTS

飞书开会 → 自动拉取转录 → LLM 提取要点 → TTS 生成语音摘要推送到群聊。全流程无人干预。

### 场景二：内容创作者工作流
**组合：** Faster Whisper + Clonev + Kokoro TTS

播客录音 → Whisper 转录为文字 → 编辑润色 → Clonev 用你的克隆声音重新配音 → 发布到各平台。

### 场景三：无障碍辅助
**组合：** ElevenLabs TTS + Faster Whisper

视障用户：文字 → TTS 朗读网页/文档
听障用户：语音 → STT 转文字显示

### 场景四：本地化语音助手
**组合：** Kokoro TTS + Faster Whisper

完全离线运行的语音助手，不依赖任何云服务。适合网络不稳定或隐私要求高的场景。

---

## 💡 实用建议

1. **STT 选型策略：** 隐私敏感选 Faster Whisper，快速验证选 AssemblyAI/Deepgram（云端速度快但需付费）
2. **TTS 选型策略：** 商用选 ElevenLabs，个人/测试选 Kokoro，需要声音克隆选 Clonev
3. **中文支持：** ElevenLabs 和 Faster Whisper 对中文支持最好；Kokoro 中文表现尚可但略逊
4. **硬件要求：** Faster Whisper 的 large 模型建议 8GB+ VRAM；Clonev 的 XTTS v2 建议 6GB+ VRAM
5. **成本控制：** 本地方案（Faster Whisper + Kokoro）零边际成本；云端方案（ElevenLabs）按字符计费

---

## 📅 明日预告

明天将介绍第 29 个分类：**Transportation（交通出行）**——涵盖导航、出行规划、交通工具信息查询等 Skills，敬请期待。

---

*本文由 OpenClaw 自动生成，每日推荐一个 Skill 分类，共 30 期。*
*博客地址：[www.daoyuly.cn](https://www.daoyuly.cn)*
