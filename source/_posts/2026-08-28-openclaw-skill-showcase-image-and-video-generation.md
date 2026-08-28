---
title: OpenClaw Skill 每日推荐 - 图像与视频生成
tags:
  - openclaw
  - skill
  - image-and-video-generation
categories:
  - 技术推荐
abbrlink: 65110
date: 2026-08-28 11:30:00
---

# OpenClaw Skill 每日推荐 - 图像与视频生成

> 📅 第 13 期 | 共 30 期 | 2026-08-28

今天我们来探索 OpenClaw 生态中最庞大的 Skill 分类之一——**图像与视频生成**。这个分类包含了 **169 个 Skill**，涵盖了从 AI 绘画、视频生成、图像编辑到 OCR 识别的全方位视觉创作工具。

## 📊 分类概述

| 维度 | 数据 |
|------|------|
| 总 Skill 数 | 169 |
| 主要方向 | AI 图像生成、视频生成、图像编辑、OCR/文档解析 |
| 热门模型 | FLUX、DALL-E、Gemini Imagen、Kling、SDXL、ComfyUI |
| 典型场景 | 内容创作、营销素材、社交媒体、视频制作 |

## 🌟 精选 Skill 详解

### 1. fal-ai — 多模型 AI 生成网关 ⭐⭐⭐⭐⭐

**GitHub:** [openclaw/skills - agmmnn/fal-ai](https://github.com/openclaw/skills/tree/main/skills/agmmnn/fal-ai/SKILL.md)

**核心功能：**
通过 fal.ai API 统一接口生成图像、视频和音频。支持 FLUX、SDXL、Whisper 等多种主流模型，是目前覆盖模型最全面的生成类 Skill 之一。

**实用场景：**
- 🎨 快速生成营销配图（FLUX 模型质量高、速度快）
- 🎬 生成短视频素材用于社交媒体
- 🔊 音频转录与语音生成（Whisper 模型）
- 🔄 A/B 测试不同模型的输出效果

**技术实现：**
- 基于 fal.ai 云端 API，无需本地 GPU
- 支持模型切换与参数调优
- 按次付费，成本可控

**推荐指数：** ⭐⭐⭐⭐⭐
> 覆盖面最广，适合需要多种生成能力的全能型用户。

---

### 2. eachlabs-image-generation — 多模型图像生成 ⭐⭐⭐⭐⭐

**GitHub:** [openclaw/skills - eftalyurtseven/eachlabs-image-generation](https://github.com/openclaw/skills/tree/main/skills/eftalyurtseven/eachlabs-image-generation/SKILL.md)

**核心功能：**
集成 Flux、GPT Image、Gemini、Imagen 四大主流图像生成模型，通过统一的 EachLabs API 接口调用。同系列还有图像编辑、视频生成、换脸等 Skill。

**实用场景：**
- 🖼️ 一键生成多风格图片（写实、动漫、油画等）
- 👔 虚拟试穿与时尚 imagery（配合 eachlabs-fashion-ai）
- 📱 社交媒体头像和封面快速生成
- 🔄 对比不同模型在同一 prompt 下的表现

**技术实现：**
- 统一 API 抽象层，屏蔽底层模型差异
- 支持 text-to-image 和 image-to-image
- 同生态还有 face-swap、video-edit 等配套 Skill

**推荐指数：** ⭐⭐⭐⭐⭐
> 模型选择丰富，EachLabs 生态完整，适合专业内容创作者。

---

### 3. comfyui-imagegen — 本地 ComfyUI 图像生成 ⭐⭐⭐⭐

**GitHub:** [openclaw/skills - halr9000/comfyui-imagegen](https://github.com/openclaw/skills/tree/main/skills/halr9000/comfyui-imagegen/SKILL.md)

**核心功能：**
通过 ComfyUI API（localhost:8188）使用 Flux2 工作流生成图像。适合已经在本地部署 ComfyUI 的用户，将 OpenClaw 与本地工作流无缝对接。

**实用场景：**
- 🏠 本地私有化生成，数据不外传
- 🎛️ 利用自定义 ComfyUI 工作流（LoRA、ControlNet 等）
- 🔄 批量生成并自动后处理
- 💰 零 API 成本，只需本地算力

**技术实现：**
- 通过 HTTP API 与本地 ComfyUI 实例通信
- 支持 Flux2 工作流（可扩展自定义工作流）
- 需要本地已安装并运行 ComfyUI

**推荐指数：** ⭐⭐⭐⭐
> 隐私友好、零成本，但需要本地 GPU 和 ComfyUI 部署经验。

---

### 4. Kling 3.0 Omni Video Generator — AI 视频生成 ⭐⭐⭐⭐⭐

**GitHub:** [wells1137/kling-video-generator](https://github.com/wells1137/kling-video-generator/blob/master/SKILL.md)

**核心功能：**
使用快手 Kling 3.0 Omni 模型生成高质量视频。支持六大核心能力：

| 能力 | 说明 |
|------|------|
| Text-to-Video | 文本描述生成视频 |
| Image-to-Video | 静态图片动画化 |
| Video Editing | 修改已有视频（换主体、换风格） |
| Video Reference | 参考视频的运镜和风格 |
| Multi-shot Generation | 多镜头/多场景叙事视频 |
| Audio Generation | 同步生成语音和音效 |

**实用场景：**
- 📹 快速制作产品展示视频
- 🎬 社交媒体短视频批量生成
- 📖 多镜头故事视频创作
- 🎵 带同步音频的完整视频作品

**技术实现：**
- 基于 Kling 3.0 Omni API
- 使用 JWT 认证（KLING_ACCESS_KEY + KLING_SECRET_KEY）
- Python 工具类处理认证、任务创建和轮询
- 内置详细的 Prompt 指南和 API 参考文档
- 支持模板语法引用图片/视频素材（`<<<image_1>>>`、`<<<video_1>>>`）
- 完整的参数约束系统（R1-R10 互斥规则）

**Prompt 设计流程：**
1. 阅读 `prompt_guide.md` 了解核心原则和公式
2. 识别场景（单镜头/多镜头）
3. 编写 Prompt（使用模板语法引用素材）
4. 构造 API 参数（遵循决策树和互斥规则）

**推荐指数：** ⭐⭐⭐⭐⭐
> 视频生成能力最全面的 Skill，多镜头+音频同步是杀手级特性。

---

### 5. openai-image-cli — OpenAI 官方图像工具 ⭐⭐⭐⭐

**GitHub:** [openclaw/skills - g9pedro/openai-image-cli](https://github.com/openclaw/skills/tree/main/skills/g9pedro/openai-image-cli/SKILL.md)

**核心功能：**
通过 OpenAI 官方 API 生成、编辑和管理图像，支持 GPT Image 和 DALL-E 模型。是最直接的 OpenAI 图像生成方案。

**实用场景：**
- 🖼️ 快速生成高质量插图
- ✏️ 图像编辑与局部修改（inpainting）
- 📐 多分辨率和多比例输出
- 🔗 与其他 OpenAI 服务无缝集成

**技术实现：**
- 直调 OpenAI Images API
- 支持 generation 和 edit 两种模式
- 需要 OpenAI API Key

**推荐指数：** ⭐⭐⭐⭐
> 最简单直接的图像生成方案，适合已经使用 OpenAI 生态的用户。

## 📋 推荐指数排名

| 排名 | Skill | 评分 | 最佳场景 |
|------|-------|------|----------|
| 🥇 | fal-ai | ⭐⭐⭐⭐⭐ | 多模型全能网关 |
| 🥇 | eachlabs-image-generation | ⭐⭐⭐⭐⭐ | 专业内容创作 |
| 🥇 | kling-video-generator | ⭐⭐⭐⭐⭐ | AI 视频制作 |
| 🥈 | comfyui-imagegen | ⭐⭐⭐⭐ | 本地私有化生成 |
| 🥈 | openai-image-cli | ⭐⭐⭐⭐ | OpenAI 生态用户 |

## 🎯 应用场景总结

### 内容创作者 / 自媒体
→ **eachlabs-image-generation** + **kling-video-generator**
图像+视频全覆盖，从配图到短视频一站式解决

### 注重隐私的开发者
→ **comfyui-imagegen**
完全本地化，数据不出机器，自由定制工作流

### 快速原型 / 概念验证
→ **fal-ai** 或 **openai-image-cli**
API 调用即用，无需部署，几分钟出图

### 营销团队
→ **eachlabs** 全系列（image-gen + face-swap + fashion-ai + video-gen）
品牌素材、虚拟试穿、广告视频批量生产

## 💡 实用建议

1. **成本控制**：`cheapest-image` Skill 声称每张图仅 $0.0036，适合大批量生成场景
2. **质量优先**：`best-image` Skill 追求最佳质量（~$0.12-0.20/张），适合最终成品
3. **混合使用**：先用便宜模型快速迭代 Prompt，满意后再用高质量模型生成最终版本
4. **本地 vs 云端**：如果有 decent GPU，ComfyUI 方案长期成本最低；否则云端 API 更省心
5. **视频生成**：Kling 的多镜头+音频同步能力让它成为目前最完整的视频生成方案

## 🔗 相关 Skill 推荐

- [algorithmic-art](https://github.com/openclaw/skills/tree/main/skills/seanphan/algorithmic-art/SKILL.md) - 用 p5.js 创建算法艺术
- [mindmap-generator](https://github.com/openclaw/skills/tree/main/skills/parasharnagle/mindmap-generator/SKILL.md) - 生成思维导图 PNG
- [chart-image](https://github.com/openclaw/skills/tree/main/skills/dannyshmueli/chart-image/SKILL.md) - 数据图表生成
- [snapog](https://github.com/openclaw/skills/tree/main/skills/beameasy/snapog/SKILL.md) - 社交分享卡片生成
- [coloring-page](https://github.com/openclaw/skills/tree/main/skills/borahm/coloring-page/SKILL.md) - 照片转 coloring page

---

> 📌 明日预告：**iOS & macOS Development** — 探索 Apple 生态开发相关的 OpenClaw Skills
>
> 📖 查看完整分类列表：[awesome-openclaw-skills](https://github.com/openclaw/skills)
