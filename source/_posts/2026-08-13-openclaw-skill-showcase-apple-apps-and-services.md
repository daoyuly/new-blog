---
title: OpenClaw Skill 每日推荐 - Apple Apps & Services
date: 2026-08-13 11:30:00
tags:
  - openclaw
  - skill
  - apple
  - macos
categories:
  - 技术推荐
---

# OpenClaw Skill 每日推荐 - Apple Apps & Services 🍎

> 本文是 OpenClaw Skill 每日推荐系列的第 2 篇，共 30 篇。
> 每天介绍一个 Skill 分类，帮你发现 OpenClaw 生态中最实用的技能。

## 今日分类概述

**分类名称：** Apple Apps & Services
**Skill 数量：** 44 个
**GitHub 仓库：** [openclaw/skills](https://github.com/openclaw/skills)

Apple 生态拥有庞大的用户群体，macOS 和 iOS 平台上沉淀了大量原生应用和服务。这个分类的 Skill 聚焦于让 OpenClaw 与 Apple 原生生态深度集成——从通讯录、照片、音乐到健康数据，从系统自动化到本地 AI 推理，覆盖了 Apple 用户的几乎所有日常场景。

44 个 Skill 大致可分为以下几个方向：

| 方向 | 代表 Skill | 数量 |
|------|-----------|------|
| 📱 原生应用集成 | Apple Notes、Apple Reminders、Apple Photos | ~15 |
| 🎵 媒体与音频 | Apple Music DJ、MLX TTS/STT、Mac TTS | ~8 |
| 🔧 系统自动化 | macOS Native Automation、Homebrew、Shortcuts | ~6 |
| 🏠 设备与定位 | Find My、Apple TV、Tesla 控制 | ~6 |
| 📊 数据与健康 | Apple Health、HealthKit Sync | ~4 |
| 📝 效率工具 | Drafts、Email Management、FZF | ~5 |

---

## 精选 Skill 详解

### 1. 🎧 Apple Music DJ

**GitHub:** [and3rn3t/apple-music-dj](https://github.com/and3rn3t/apple-music-dj)
**推荐指数：** ⭐⭐⭐⭐⭐

#### 核心功能

这不是一个简单的音乐播放器 Skill——它是一个**完整的 Apple Music 个性化引擎**。通过 MusicKit API 读取你的收听历史、Replay 统计、评分和资料库数据，构建深度品味画像，然后使用五种策略生成智能播放列表，直接写入你的 Apple Music 资料库。

#### 五大播放列表策略

1. **Deep Cuts Explorer** — 挖掘你喜爱艺人中尚未听过的冷门曲目
2. **Mood / Activity Matcher** — 根据心情或活动（健身、专注、派对）匹配音乐
3. **Trend Radar** — 当前排行榜热门曲目，过滤后匹配你的口味
4. **Constellation Discovery** — 从熟悉艺人出发，向外探索新音乐领域
5. **Playlist Refresh** — 分析现有播放列表的声音特征，添加新鲜曲目

#### 实用场景

```
用户："我最近老听同样的20首歌"
→ Constellation Discovery 策略，从你的常听艺人出发向外扩展

用户："给我做个跑步播放列表"
→ Mood/Activity Matcher，140-180 BPM 高能量曲目

用户："下周要看 Phoebe Bridgers 演出"
→ Concert Prep Playlist，热门曲目 + 冷门佳作预热
```

#### 技术实现

- **API 集成：** Apple Music API（MusicKit JWT 认证）
- **数据源：** 最近播放、Heavy Rotation、Replay 年度统计、评分、资料库
- **品味画像：** 加权评分系统（显式评分 > 重复播放 > 最近播放 > 资料库 > 推荐）
- **缓存机制：** 7 天 TTL 本地缓存，避免重复 API 调用
- **自动化：** 支持 OpenClaw cron 定时生成周混音、每日推荐

#### 亮点功能

- **Taste DNA Card** — 生成可分享的口味画像卡片（SVG 格式）
- **兼容性评分** — 评估你与某位艺人的匹配度（0-100%）
- **Catalog Gap Analysis** — 扫描你最爱艺人的完整唱片目录，找出遗漏的专辑
- **Artist Rabbit Hole** — 从一个艺人出发，链式探索相关音乐人
- **Year in Review** — 比 Apple Replay 更深入的年度听听总结

---

### 2. 📸 Apple Photos Cleaner

**GitHub:** [and3rn3t/apple-photos-cleaner](https://github.com/and3rn3t/apple-photos-cleaner)
**推荐指数：** ⭐⭐⭐⭐⭐

#### 核心功能

Apple Photos 自带的管理功能很基础，这个 Skill 填补了空白——它给你**X 光般的透视能力**来审视整个照片库。直接读取 Photos SQLite 数据库（只读操作，安全无忧），提供 20 个分析模块。

#### 20 个功能模块一览

| 模块 | 功能 | 典型用途 |
|------|------|---------|
| Library Analysis | 全库统计概览 | "我有多少照片？" |
| Junk Finder | 垃圾照片识别 | "哪些可以删？" |
| Duplicate Finder | 重复照片检测 | "哪些是重复的？" |
| Storage Analyzer | 存储深度分析 | "什么占了空间？" |
| Timeline Recap | 时间线叙事 | "上周做了什么？" |
| Smart Export | 智能导出规划 | "按年份导出" |
| Best Photos | 最佳照片发现 | "我最好的照片是？" |
| People Analyzer | 人物分析 | "谁出镜最多？" |
| Location Mapper | 位置/旅行地图 | "去过哪些地方？" |
| Scene Search | 场景内容搜索 | "有多少海滩照？" |
| Photo Habits | 拍照习惯分析 | "我什么时候拍最多？" |
| On This Day | 历史今天 | "往年今天做了什么？" |
| Album Auditor | 相册审计 | "有多少孤儿照片？" |
| Cleanup Executor | 清理执行器 | "批量删除旧截图" |
| Live Photo Analyzer | Live Photo 分析 | "Live Photo 占了多少空间？" |
| Shared Library | 共享资料库分析 | "谁贡献了多少？" |
| iCloud Status | iCloud 同步状态 | "哪些没同步？" |
| Similarity Finder | 相似照片检测 | "哪些照片视觉相似？" |
| Seasonal Highlights | 季度精选 | "今年每季最佳照片" |
| Face Quality | 面部质量评分 | "每人最好/最差的肖像" |

#### 实用场景

```bash
# 快速清理评估
python3 scripts/library_analysis.py --human
python3 scripts/junk_finder.py --human

# 年度照片回顾
python3 scripts/timeline_recap.py --start-date 2025-01-01 --end-date 2025-12-31 --narrative

# 查找隐藏佳作
python3 scripts/best_photos.py --hidden-gems --human

# 实际清理旧截图（先预览再执行）
python3 scripts/cleanup_executor.py --category old_screenshots --human
python3 scripts/cleanup_executor.py --category old_screenshots --execute
```

#### 技术实现

- **数据访问：** 直接读取 `~/Pictures/Photos Library.photoslibrary/database/Photos.sqlite`
- **安全性：** 所有分析操作均为只读，清理操作通过 AppleScript 执行（可恢复 30 天）
- **依赖：** 纯 Python 标准库，无需安装额外依赖
- **质量评分：** 利用 Apple 计算的质量属性（构图、光照、对称性等）

---

### 3. ⏰ Apple Reminders (remindctl)

**GitHub:** [steipete/remindctl](https://github.com/steipete/remindctl)
**推荐指数：** ⭐⭐⭐⭐

#### 核心功能

通过 `remindctl` CLI 完整管理 Apple Reminders——查看、创建、编辑、完成、删除提醒事项。支持列表管理、日期过滤、JSON 输出，是终端用户的效率利器。

#### 快速上手

```bash
# 安装
brew install steipete/tap/remindctl

# 查看今日提醒
remindctl

# 查看本周
remindctl week

# 快速添加
remindctl add "买牛奶"

# 带列表和截止日期
remindctl add --title "给妈妈打电话" --list Personal --due tomorrow

# 完成提醒
remindctl complete 1 2 3

# JSON 输出（适合脚本化）
remindctl today --json
```

#### 实用场景

- **语音添加提醒：** 通过 OpenClaw 对话说 "提醒我下午3点开会" → 自动创建 Apple Reminder
- **批量管理：** 查看过期提醒，一次性完成多个
- **与其他 Skill 联动：** 结合日历 Skill 实现"提醒 + 日程"双轨管理

#### 技术实现

- **平台：** macOS 专属
- **权限：** 需要在系统设置中授予 Reminders 访问权限
- **日期格式：** 支持 `today`、`tomorrow`、`YYYY-MM-DD`、ISO 8601 等多种格式
- **输出：** 支持默认表格、JSON、Plain TSV、静默计数四种格式

---

### 4. 🦞 MLX STT + MLX TTS

**GitHub:** [guoqiao/mlx-stt](https://github.com/guoqiao/skills/blob/main/mlx-stt) | [guoqiao/mlx-tts](https://github.com/guoqiao/skills/blob/main/mlx-tts)
**推荐指数：** ⭐⭐⭐⭐⭐

#### 核心功能

利用 Apple Silicon 的 MLX 框架，在**本地完全离线**运行语音转文字（STT）和文字转语音（TTS）。无需 API Key，无需服务器，免费且准确。

#### MLX STT（语音转文字）

```bash
# 安装（自动安装 ffmpeg、uv、mlx_audio）
bash install.sh

# 转录音频
bash mlx-stt.sh /path/to/audio.m4a
```

- **默认模型：** GLM-ASR-Nano-2512
- **首次运行：** 需要下载模型（约几百 MB）
- **输出：** 转录文本输出到 stdout

#### MLX TTS（文字转语音）

```bash
# 生成语音
bash mlx-tts.sh "你好，这是一段测试语音"
# 输出: /tmp/folder/audio.ogg
```

- **默认模型：** QWen3-TTS
- **输出格式：** 音频文件路径
- **与 OpenClaw 集成：** 生成的音频可通过 `message` 工具直接发送为语音消息

#### 实用场景

```
用户："把这段语音转成文字"
→ MLX STT 转录音频文件，输出文本

用户："用语音回复我"
→ MLX TTS 生成语音，通过 message 工具发送

用户："帮我转录这个会议录音"
→ MLX STT 处理长音频，输出完整转录文本
```

#### 技术实现

- **框架：** Apple MLX（专为 Apple Silicon 优化的机器学习框架）
- **运行环境：** macOS + Apple Silicon (M1/M2/M3/M4)
- **依赖管理：** 通过 `brew` 自动安装 `ffmpeg` 和 `uv`
- **模型：** 开源模型，本地运行，零隐私泄露风险

#### 推荐理由

这是 Apple Silicon 用户**必须安装**的 Skill 组合。完全本地化的语音处理方案，不花一分钱，不泄露任何数据。对于需要频繁处理语音消息、会议录音、播客转录的用户来说，这是黄金组合。

---

### 5. 📝 Apple Notes (memo)

**GitHub:** [antoniorodr/memo](https://github.com/antoniorodr/memo)
**推荐指数：** ⭐⭐⭐⭐

#### 核心功能

通过 `memo` CLI 在终端完整管理 Apple Notes——创建、查看、编辑、删除、搜索、移动笔记到文件夹、导出为 HTML/Markdown。

#### 快速上手

```bash
# 安装
brew tap antoniorodr/memo && brew install antoniorodr/memo/memo

# 列出所有笔记
memo notes

# 按文件夹过滤
memo notes -f "工作"

# 搜索笔记
memo notes -s "会议纪要"

# 快速创建
memo notes -a "项目计划"

# 导出为 Markdown
memo notes -ex
```

#### 实用场景

- **快速记录：** 通过 OpenClaw 对话说 "记一下：明天要准备周会PPT" → 自动创建 Apple Note
- **笔记搜索：** "我之前记的那个会议纪要在哪？" → fuzzy 搜索快速定位
- **知识管理：** 与其他 PKM Skill 联动，实现"Apple Notes + Obsidian/Notion"双同步

#### 技术实现

- **底层：** 通过 AppleScript 与 Notes.app 交互
- **平台：** macOS 专属
- **导出：** 使用 Mistune 进行 Markdown 转换
- **限制：** 无法编辑包含图片或附件的笔记

---

## 应用场景总结

### 场景一：Apple 生态全自动化办公

结合 Apple Reminders + Apple Notes + Apple Mail Search，打造终端原生的 GTD 工作流：

```
"提醒我下午3点给客户打电话" → Apple Reminders
"把这个方案记到笔记里" → Apple Notes
"搜索上周关于项目的邮件" → Apple Mail Search
```

### 场景二：照片库深度管理

Apple Photos Cleaner 提供从分析到清理的完整工作流：

```
1. library_analysis.py → 全库概览
2. junk_finder.py → 识别垃圾照片
3. duplicate_finder.py → 查找重复
4. cleanup_executor.py → 安全清理
5. best_photos.py → 发现隐藏佳作
```

### 场景三：本地化语音助手

MLX STT + MLX TTS 组合实现完全离线的语音交互：

```
语音输入 → MLX STT 转录 → OpenClaw 处理 → MLX TTS 语音回复
```

全程本地运行，零延迟，零隐私泄露。

### 场景四：音乐发现与品味管理

Apple Music DJ 不仅仅是播放音乐，而是一个深度音乐发现引擎：

```
"分析我的音乐品味" → Taste Profiler
"给我做个惊喜播放列表" → Constellation Discovery
"我错过了 Radiohead 哪些专辑" → Catalog Gap Analysis
"生成我的品味卡片" → Taste DNA Card
```

---

## 推荐指数排名

| 排名 | Skill | 推荐指数 | 核心价值 |
|------|-------|---------|---------|
| 1 | Apple Music DJ | ⭐⭐⭐⭐⭐ | 最完整的 Apple Music 个性化引擎 |
| 2 | Apple Photos Cleaner | ⭐⭐⭐⭐⭐ | 照片库深度管理无替代品 |
| 3 | MLX STT + MLX TTS | ⭐⭐⭐⭐⭐ | Apple Silicon 本地语音处理黄金组合 |
| 4 | Apple Reminders | ⭐⭐⭐⭐ | 终端原生提醒管理，简洁高效 |
| 5 | Apple Notes | ⭐⭐⭐⭐ | 笔记管理基础工具，稳定可靠 |

---

## 实用建议

1. **优先安装 MLX STT/TTS** — 如果你是 Apple Silicon 用户，这是性价比最高的 Skill，完全免费的本地语音处理
2. **照片库管理要定期做** — 建议每月运行一次 `junk_finder.py` 和 `duplicate_finder.py`，防止照片库膨胀
3. **Apple Music DJ 需要开发者账号** — 需要配置 MusicKit JWT Token，初始设置有一定门槛，但一次配置终身受益
4. **权限授予很重要** — 大部分 Apple 集成 Skill 需要在系统设置中授予相应权限（Reminders、Notes、Photos 等），首次使用时注意弹窗
5. **组合使用效果更佳** — Apple Reminders + Apple Notes + Apple Calendar 形成完整的 Apple 原生效率工具链

---

## 下期预告

明天我们将介绍 **Browser & Automation** 分类，探索 OpenClaw 生态中用于浏览器自动化的 Skill——网页抓取、表单填充、自动化测试、RPA 流程等。敬请期待！

---

*本文由 OpenClaw 自动生成，每日推荐一个 Skill 分类。关注本博客获取每日更新。*
