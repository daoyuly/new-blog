---
title: OpenClaw Skill 每日推荐 - 语音与转录（speech-and-transcription）
tags:
  - openclaw
  - skill
  - speech-and-transcription
categories:
  - 技术推荐
date: 2026-10-29 11:30:00
---

# OpenClaw Skill 每日推荐 - 语音与转录

> 「OpenClaw Skill 每日推荐」第 27 期。每天从 [awesome-openclaw-skills](https://github.com/openclaw/skills) 的 30 个分类中取一个，精选代表性 skill 深入介绍。今天是 **语音与转录（Speech & Transcription）**——给 agent 装上嘴和耳朵的一期。

## 今日分类概述

语音与转录分类收录 **45 个 skills**，是所有分类里"声音浓度"最高的一个。老规矩，先剔除几个串错门的成员（记账的 akaunting、freshbooks-cli、lnbits、norman-\*，做文档 OCR 的 documents-ai，写文章的 critical-article-writer，甚至还有改写文本去 AI 味的 brw-de-ai-ify），真正做语音的部分大致分四路：

- **语音转文字（STT）**：本地派的 faster-whisper、auto-whisper-safe，云端派的 deepgram、assemblyai-transcribe、elevenlabs-transcribe
- **文字转语音（TTS）**：ElevenLabs 全家桶（elevenlabs-tts / elevenlabs-voices / elevenlabs-agents）、本地 Kokoro（kokoro-tts）、国产云 chichi-speech（Qwen3）、doubao-api-open-tts（豆包）、siliconflow-tts-gen（CosyVoice2）、inworld-tts、deepdub-tts、ressemble
- **进阶玩法**：克隆人声的 clonev（Coqui XTTS v2）、生成有声书和播客的 audio-gen、全屋广播的 announcer（AirPlay + Airfoil）
- **会议场景**：拉取飞书妙记的 feishu-minutes、GETTR 音频转录

这一期有个明显趋势：**本地引擎终于好用了**。Whisper 和 Kokoro 这类开源模型让"断网也能听能说"成为现实，而云端派则卷音质和音色。下面精选 5 个详解。

## 精选 Skill 详解

### 1. faster-whisper —— 本地转写的性价比之王

**链接**：[github.com/openclaw/skills/.../faster-whisper](https://github.com/openclaw/skills/tree/main/skills/theplasmak/faster-whisper/SKILL.md)

**核心功能**：用 faster-whisper 在本地跑 Whisper 语音识别。faster-whisper 是 Whisper 的 CTranslate2 重实现，同等精度下比原版快 4 倍、省约一半内存，支持 CPU 推理——意味着一台普通笔记本就能离线转录。

**实用场景**：

- 会议录音、播客、网课视频，整段拖给 agent："转成文字，按发言人整理成纪要"
- 对隐私敏感的语音（私人对话、医疗/法律录音）：数据全程不出本机
- 批量处理音频库：给老录音存档建全文索引，之后"搜一下我 3 月提到项目预算的那通电话"就能命中

**技术实现**：底层是 CTranslate2 量化推理（支持 int8），模型从 tiny 到 large-v3 多档可选——tiny 实时率极高适合现场听写，large-v3 精度最高适合存档转录。skill 教 agent 按音频长度和质量选模型档位，并处理输出带时间戳的分段文本。对 agent 来说，这就是一个"给音频路径、回文本"的命令行调用。

**推荐指数**：⭐⭐⭐⭐⭐ —— 免费、离线、无 API 账单，是整个语音类 skill 里最该先装的一个底座。

### 2. elevenlabs-tts —— 云端音质天花板

**链接**：[github.com/openclaw/skills/.../elevenlabs-tts](https://github.com/openclaw/skills/tree/main/skills/shaharsha/elevenlabs-tts/SKILL.md)

**核心功能**：调用 ElevenLabs API 把文字转成接近真人的语音。作者自信地写着"the best ElevenLabs integration for OpenClaw"。ElevenLabs 是目前公认音质第一梯队的 TTS 服务，情绪、停顿、重音都很自然。同门还有 elevenlabs-voices（18 种预设人声人格）和 elevenlabs-agents（管理 ElevenLabs 的对话式 agent）。

**实用场景**：

- 给 agent 的回复配音：文字报告转成通勤路上听的语音版
- 做内容：视频旁白、多语种配音（它对非英语语种的支持也是第一梯队）
- 定制人格：用 elevenlabs-voices 切换 18 种人设，同一篇文章念出完全不同的感觉

**技术实现**：REST API 调用，核心参数是 voice_id（选音色）、model（精度档位）、stability 与 similarity_boost（稳定度与音色相似度滑杆）。音频流式返回，agent 直接把结果作为媒体附件发回消息渠道。需要 API key，按字符量计费——这是它与本地 kokoro-tts 最本质的区别。

**推荐指数**：⭐⭐⭐⭐⭐ —— 对音质有要求（尤其对外发布的内容），这一档目前没有对手。

### 3. kokoro-tts —— 零成本的本地嗓子

**链接**：[github.com/openclaw/skills/.../kokoro-tts](https://github.com/openclaw/skills/tree/main/skills/edkief/kokoro-tts/SKILL.md)

**核心功能**：用开源的 Kokoro TTS 引擎在本地生成语音。Kokoro 是 2025 年开源 TTS 里的黑马：模型只有 82M 参数（约几百 MB），却在中英文上打平甚至超过大它几十倍的商业模型，CPU 也能实时出声。

**实用场景**：

- 高频、大批量的语音合成：播客脚本试听、通知播报，不心疼账单
- 隐私场景：待办清单、私人日记摘要，不想把文字发给任何云端
- 树莓派 / 家里的小服务器上做全屋语音播报，配合 announcer 还能推到 AirPlay 音箱

**技术实现**：Kokoro 基于 StyleTTS 2 架构，提供多种预设音色，输出 24kHz 音频。skill 把"文本进、wav 出"封装成本地命令行调用，agent 生成音频文件后直接作为附件发送。没有网络依赖、没有配额——代价是音色的丰富度和情感表现力逊于 ElevenLabs。

**推荐指数**：⭐⭐⭐⭐☆ —— "够好且免费"的完美代表。日常播报用它，重要内容才上云端，是性价比最优的组合。

### 4. auto-whisper-safe —— 专治长音频转写爆内存

**链接**：[github.com/openclaw/skills/.../auto-whisper-safe](https://github.com/openclaw/skills/tree/main/skills/neal-collab/auto-whisper-safe/SKILL.md)

**核心功能**：带自动分块的 RAM 安全语音转写。Whisper 处理长音频时会把特征全部载入内存，几小时的录音在 16GB 机器上很容易直接 OOM 崩溃——这个 skill 专门解决这个问题：自动把长音频切成块，逐段转写，再按时间戳拼回完整文本。

**实用场景**：

- 3 小时的会议录像、6 小时的婚礼全程，一台 16GB 的 MacBook 就能啃下来
- Vlog 创作者批量转写素材库，输出带时间戳的文本方便后期对轴
- 和 faster-whisper 组合：机器好、音频短就直接跑，遇到长音频自动降级到分块策略

**技术实现**：先探测本机可用内存与所选模型的内存水位，再按安全块长切分音频（用 ffmpeg 定点切割），逐块调用 Whisper 转写，最后合并时间轴。切块策略保证了上下文连续性——段与段之间留重叠区，避免句子在边界被拦腰斩断。

**推荐指数**：⭐⭐⭐⭐ —— 定位很窄但痛点极真；凡是转写过长录音崩过内存的人，都会立刻明白它的价值。

### 5. feishu-minutes —— 把飞书妙记变成 agent 的会议记忆

**链接**：[github.com/openclaw/skills/.../feishu-minutes](https://github.com/openclaw/skills/tree/main/skills/autogame-17/feishu-minutes/SKILL.md)

**核心功能**：从飞书妙记拉取会议的信息、统计数据、转写全文和媒体文件。对国内团队来说这个 skill 含金量极高：飞书妙记已经把会议录好、转写好、按发言人分段好了，agent 只需要"取回来、看懂、干活"。

**实用场景**：

- "把昨天产品评审会的妙记拉出来，总结决议和待办，@ 对应负责人"
- 每周五自动汇总本周所有会议的转写，生成一份"本周说过什么"的周报素材
- 跨会议检索："过去一个月里，谁提过'性能瓶颈'这个话题？上下文是什么？"

**技术实现**：走飞书开放平台 API，按妙记 ID 或会议链接获取 metadata（时长、参会人）、统计信息、逐句转写文本与原始媒体。配合 OpenClaw 原生的飞书消息通道，形成"开会 → 妙记转写 → agent 解读 → 群里推纪要"的完整闭环，中间不需要人工导出任何文件。

**推荐指数**：⭐⭐⭐⭐ —— 飞书用户（尤其重度开会团队）直接五星；不用飞书的可以跳过。

## 应用场景总结

这 5 个 skill 拼起来，正好是一条完整的"声音流水线"：

| 环节 | 代表 skill | agent 干什么 |
|---|---|---|
| 听（本地 STT） | faster-whisper / auto-whisper-safe | 音频进文字，长录音不崩 |
| 听（会议） | feishu-minutes | 直接读取现成的会议转写 |
| 说（云端 TTS） | elevenlabs-tts | 高音质配音、多语种旁白 |
| 说（本地 TTS） | kokoro-tts | 零成本日常播报 |

进阶组合同样现成：clonev 能克隆一段人声再用 XTTS v2 生成新语音（配音/有声书的玩法），audio-gen 把"脚本 → 分段合成 → 有声书"整链打通，announcer 则负责把结果推到全屋 AirPlay 音箱。

值得注意的行业信号：**本地和云端的分界线正在快速移动**。一年前"本地 TTS"还约等于玩具音质，如今 Kokoro 已经能在多数日常场景替代商业服务；转写这边 faster-whisper 早就是很多生产系统的默认选择。agent 的语音能力，正在从"调个 API"变成"选个合适的本地引擎"。

## 推荐指数排名

| 排名 | Skill | 定位 | 推荐指数 |
|---|---|---|---|
| 1 | [faster-whisper](https://github.com/openclaw/skills/tree/main/skills/theplasmak/faster-whisper/SKILL.md) | 本地 STT 底座 | ⭐⭐⭐⭐⭐ |
| 2 | [elevenlabs-tts](https://github.com/openclaw/skills/tree/main/skills/shaharsha/elevenlabs-tts/SKILL.md) | 云端 TTS 天花板 | ⭐⭐⭐⭐⭐ |
| 3 | [kokoro-tts](https://github.com/openclaw/skills/tree/main/skills/edkief/kokoro-tts/SKILL.md) | 本地 TTS 性价比 | ⭐⭐⭐⭐☆ |
| 4 | [feishu-minutes](https://github.com/openclaw/skills/tree/main/skills/autogame-17/feishu-minutes/SKILL.md) | 会议纪要自动化 | ⭐⭐⭐⭐ |
| 5 | [auto-whisper-safe](https://github.com/openclaw/skills/tree/main/skills/neal-collab/auto-whisper-safe/SKILL.md) | 长音频转写救星 | ⭐⭐⭐⭐ |

*（同星级的按"受众广度"排序：转写底座 > 内容创作 > 垂直场景。）*

## 实用建议

1. **转写本地做，合成按需选**。STT 对实时性和隐私都敏感，faster-whisper 本地跑完全够用；TTS 则相反——音质差距肉眼（耳耳）可见，对外内容用 ElevenLabs，内部播报用 Kokoro，两头都占。

2. **先估内存，再上模型**。本地 Whisper 选型口诀：实时听写用 tiny/base，日常转录用 medium，存档级精度才上 large-v3。16GB 以下机器处理一小时以上的音频，直接用 auto-whisper-safe，别赌运气。

3. **妙记先行，别重复造轮子**。如果团队已经在用飞书会议，转写这步交给妙记 + feishu-minutes 就好——它自带发言人分离和统计，比本地 Whisper 转录会议录音省事得多。本地转写留给"没有平台托底"的录音。

4. **API key 单独管理**。ElevenLabs 按字符计费，key 泄漏等于钱包泄漏。放在本机安全位置，别写进任何会提交的配置文件；建议在服务商后台设月度用量上限兜底。

5. **玩声音克隆，先拿自己的声音练手**。clonev 这类声纹克隆能力很有趣，但克隆他人声音有明确的法律与伦理边界（肖像权/声音权）。给自己配音、做有声书是正途，其余场景先取得授权。

---

*分类清单来自 [awesome-openclaw-skills](https://github.com/openclaw/skills)，明天介绍：**交通出行（transportation）**。*
