---
title: OpenClaw Skill 每日推荐 - 图像与视频生成
date: 2026-07-21 11:30:00
tags:
  - openclaw
  - skill
  - image-and-video-generation
  - AI绘画
  - 视频生成
categories:
  - 技术推荐
description: "图像与视频生成是 OpenClaw 生态中最庞大的分类之一，汇集了 169 个 Skills，覆盖了从 AI 绘画、视频生成、头像制作、OCR 文字识别到图表可视化的全链条能力。无论你是想用一句话生成海报、把文字变成视频、还是给照片做..."
keywords: "openclaw, skill, 每日推荐, 图像与视频生成, image-and-video-generation, AI绘画, 视频生成, 技术推荐"
---

# OpenClaw Skill 每日推荐 - 图像与视频生成

> 📅 2026年7月21日 | 🏷️ 分类：Image & Video Generation | 📦 共 169 个 Skills

## 📊 今日分类概述

图像与视频生成是 OpenClaw 生态中最庞大的分类之一，汇集了 **169 个 Skills**，覆盖了从 AI 绘画、视频生成、头像制作、OCR 文字识别到图表可视化的全链条能力。无论你是想用一句话生成海报、把文字变成视频、还是给照片做年龄变换，这个分类都有对应的工具。

这个分类的核心特点：
- **多模型支持**：Flux、DALL-E、Stable Diffusion、Gemini Imagen、CogView 等主流模型一网打尽
- **全流程覆盖**：从文本生图 → 图像编辑 → 视频生成 → 后期处理
- **本地 + 云端**：既有本地 ComfyUI 集成，也有云端 API 调用
- **成本灵活**：从 $0.0036/张的极简方案到 $0.20/张的高品质方案

---

## 🏆 精选 Skill 详解

### 1. fal-ai — 一站式 AI 媒体生成 API

**GitHub:** [openclaw/skills - agmmnn/fal-ai](https://github.com/openclaw/skills/tree/main/skills/agmmnn/fal-ai/SKILL.md)

**推荐指数：⭐⭐⭐⭐⭐**

**核心功能：**
通过 fal.ai API 统一接口，生成图片、视频和音频。支持 FLUX、SDXL、Whisper 等多种模型，是目前覆盖模型最全的 Skill 之一。

**实用场景：**
- 快速生成产品宣传图（用 FLUX 模型）
- 文本转语音 + 视频字幕提取（Whisper）
- 批量生成社交媒体配图
- 原型设计阶段快速出图

**技术实现：**
通过 fal.ai 的 REST API 进行调用，支持异步轮询。Skill 封装了模型选择、参数传递、结果获取的完整流程，开发者只需描述需求即可自动选择合适模型。

```bash
# 典型调用流程
1. 设置 fal.ai API Key
2. 描述你想要的图片/视频
3. Skill 自动选择最佳模型并生成
4. 返回结果 URL
```

**为什么推荐：** 模型覆盖面最广，一个 Skill 抵好几个专用 Skill。如果你只想装一个图像生成 Skill，选它。

---

### 2. comfyui-imagegen — 本地 ComfyUI 集成

**GitHub:** [openclaw/skills - halr9000/comfyui-imagegen](https://github.com/openclaw/skills/tree/main/skills/halr9000/comfyui-imagegen/SKILL.md)

**推荐指数：⭐⭐⭐⭐**

**核心功能：**
通过本地 ComfyUI API（localhost:8188）生成图片，使用 Flux2 工作流。适合有本地 GPU 的用户。

**实用场景：**
- 隐私敏感的图片生成（完全本地，不上传云端）
- 自定义工作流和模型微调
- 批量生成，零 API 成本
- 开发者想精细控制生成参数

**技术实现：**
连接本地运行的 ComfyUI 实例，通过 API 发送工作流 JSON 请求，轮询结果并返回生成的图片。使用 Flux2 工作流作为默认配置。

```python
# 工作流示例
POST http://localhost:8188/prompt
{
  "workflow": "flux2",
  "prompt": "一只在月球上喝咖啡的猫",
  "steps": 20,
  "cfg": 7.5
}
```

**为什么推荐：** 本地部署的终极方案，隐私好、成本低、可定制性强。前提是你得有一张不错的显卡。

---

### 3. eachlabs-image-generation — 多模型图片生成

**GitHub:** [openclaw/skills - eftalyurtseven/eachlabs-image-generation](https://github.com/openclaw/skills/tree/main/skills/eftalyurtseven/eachlabs-image-generation/SKILL.md)

**推荐指数：⭐⭐⭐⭐**

**核心功能：**
支持 Flux、GPT Image、Gemini、Imagen 等多种模型，通过 EachLabs AI 平台统一调用。该作者还发布了配套的图片编辑、视频生成、换脸等系列 Skills。

**实用场景：**
- A/B 测试不同模型的生成效果
- 根据需求切换模型（写实选 Imagen，创意选 Flux）
- 配合 eachlabs-image-edit 做后期处理
- 配合 eachlabs-face-swap 做趣味换脸

**技术实现：**
通过 EachLabs AI 的 API 网关，将请求路由到不同的底层模型。Skill 内部处理了模型选择逻辑、参数适配和结果标准化。

**为什么推荐：** EachLabs 系列是本分类中最完整的工具族，图像生成 + 编辑 + 视频 + 换脸 + 时尚 AI，一条龙覆盖。系列化设计让各 Skill 配合默契。

---

### 4. kling-video-generator — 文本/图片转视频

**GitHub:** [wells1137/kling-video-generator](https://github.com/wells1137/kling-video-generator/blob/master/SKILL.md)

**推荐指数：⭐⭐⭐⭐⭐**

**核心功能：**
使用快手 Kling 3.0 Omni 模型，支持文本转视频、图片转视频、视频编辑、视频参考、多镜头生成和音频同步视频。功能覆盖面在视频生成领域首屈一指。

**实用场景：**
- 产品演示视频快速生成
- 社交媒体短视频制作（抖音/小红书）
- 多镜头叙事视频创作
- 图片动起来（老照片复活、产品图变视频）

**技术实现：**
调用 Kling 3.0 Omni API，支持多种生成模式：
- Text-to-Video：纯文本描述生成视频
- Image-to-Video：静态图片 + 描述 → 动态视频
- Video Editing：基于原视频进行编辑修改
- Multi-shot Generation：分段描述，生成多镜头连贯视频
- Audio-synced Video：带音频同步的视频生成

```
输入：一张产品图 + "展示产品360度旋转，背景渐变蓝色"
输出：5秒高质量产品展示视频
```

**为什么推荐：** 视频生成是当前 AI 最热门的方向，Kling 3.0 在国产模型中表现顶尖。这个 Skill 把它的全部能力都封装好了。

---

### 5. openai-image-cli — OpenAI 官方图像生成

**GitHub:** [openclaw/skills - g9pedro/openai-image-cli](https://github.com/openclaw/skills/tree/main/skills/g9pedro/openai-image-cli/SKILL.md)

**推荐指数：⭐⭐⭐⭐**

**核心功能：**
通过 OpenAI 官方 API 生成、编辑和管理图片，支持 GPT Image 和 DALL-E 模型。命令行界面，操作直观。

**实用场景：**
- 快速生成博客/文档配图
- 编辑现有图片（擦除、替换、扩展）
- 生成 App 图标和 UI 素材
- 批量生成不同尺寸的营销图

**技术实现：**
直接调用 OpenAI Images API（`/v1/images/generations` 和 `/v1/images/edits`），支持：
- 文本生成图片（DALL-E 3 / GPT Image）
- 图片编辑（蒙版 + 提示词）
- 多尺寸输出（256x256 / 512x512 / 1024x1024 / 1792x1024）
- 质量档位选择（standard / hd）

```bash
# 生成示例
openai-image generate "赛博朋克风格的猫" --size 1024x1024 --quality hd
openai-image edit photo.png --mask mask.png --prompt "把背景换成海滩"
```

**为什么推荐：** OpenAI 官方 API 的稳定性和画质有保障，DALL-E 3 的提示词理解能力一流。如果你已经有 OpenAI API Key，这个 Skill 开箱即用。

---

## 📋 推荐指数排名

| 排名 | Skill 名称 | 推荐指数 | 核心优势 |
|:---:|:---|:---:|:---|
| 1 | fal-ai | ⭐⭐⭐⭐⭐ | 模型最全，图片+视频+音频一站式 |
| 2 | kling-video-generator | ⭐⭐⭐⭐⭐ | 视频生成能力最强，多模式支持 |
| 3 | comfyui-imagegen | ⭐⭐⭐⭐ | 本地部署，隐私好，零 API 成本 |
| 4 | eachlabs-image-generation | ⭐⭐⭐⭐ | 多模型切换，系列 Skills 生态完整 |
| 5 | openai-image-cli | ⭐⭐⭐⭐ | OpenAI 官方，稳定可靠 |

---

## 🎯 应用场景总结

### 个人创作者
- **社交媒体配图**：fal-ai 或 openai-image-cli，快速出图
- **短视频制作**：kling-video-generator，文本直接转视频
- **趣味玩法**：eachlabs 系列（换脸、年龄变换、时尚 AI）

### 开发者 / 技术团队
- **本地部署**：comfyui-imagegen，保护数据隐私
- **批量生成**：fal-ai API，支持高并发
- **产品素材**：openai-image-cli，API 稳定可靠

### 商业应用
- **电商产品图**：eachlabs-image-generation + image-edit
- **营销视频**：kling-video-generator 的图片转视频功能
- **品牌设计**：opengfx（品牌 Logo 系统 + 社交素材）

### 特殊用途
- **极低成本场景**：cheapest-image（$0.0036/张）
- **最高品质场景**：best-image（$0.12-0.20/张）
- **OCR 文字提取**：tesseract-ocr / opencr-skill
- **数据可视化**：chart-image / data-viz

---

## 💡 实用建议

1. **新手入门**：从 `openai-image-cli` 开始，API 简单，文档完善
2. **追求性价比**：用 `cheapest-image` 做草稿，`best-image` 做最终版
3. **视频创作**：`kling-video-generator` 目前是最佳选择，多模式覆盖
4. **本地优先**：有 GPU 的话，`comfyui-imagegen` 省钱又隐私
5. **批量处理**：`fal-ai` 支持异步轮询，适合批量任务
6. **组合使用**：生成用 `eachlabs-image-generation`，编辑用 `eachlabs-image-edit`，换脸用 `eachlabs-face-swap`

---

## 📌 明日预告

明天将为大家带来 **iOS & macOS Development** 分类，介绍 iOS/macOS 开发相关的 OpenClaw Skills，包括 Apple 平台开发工具链、Xcode 自动化、SwiftUI 辅助等。

---

> 🔗 查看完整分类列表：[awesome-openclaw-skills](https://github.com/openclaw/skills)
> 🏠 博客地址：[www.daoyuly.cn](https://www.daoyuly.cn)
