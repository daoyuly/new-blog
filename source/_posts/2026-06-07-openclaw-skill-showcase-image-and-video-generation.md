---
title: OpenClaw Skill 每日推荐 - 图像与视频生成
date: 2026-06-07 11:30:00
tags:
  - openclaw
  - skill
  - 图像生成
  - 视频生成
  - AI
categories:
  - 技术推荐
---

# OpenClaw Skill 每日推荐 - 图像与视频生成

> 🎨 今天是 OpenClaw Skill 每日推荐的第 14 期，我们聚焦 **图像与视频生成** 分类。这个分类包含了 **169 个 Skills**，是整个生态中最大的分类之一，涵盖了从 AI 绘画、视频生成、图像编辑到 OCR、设计自动化等方方面面。

---

## 分类概述

图像与视频生成是 AI 最热门的应用领域之一。OpenClaw 生态中的 169 个 Skills 覆盖了：

- **AI 图像生成**：Flux、DALL-E、Midjourney、CogView、Imagen 等
- **AI 视频生成**：Kling、Sora、Veo 等模型
- **图像编辑与处理**：人脸替换、风格迁移、超分辨率、上色
- **OCR 与文档解析**：Tesseract、PaddleOCR、Zerox
- **设计工具集成**：Figma、Canva、Adobe 自动化
- **数据可视化**：图表生成、思维导图、流程图

---

## 🌟 精选 Skill 详解

### 1. Kling Video Generator ⭐⭐⭐⭐⭐

**GitHub**: [wells1137/kling-video-generator](https://github.com/wells1137/kling-video-generator)

**核心功能**：基于快手 Kling 3.0 Omni 模型的专业视频生成工具，支持：

- **文生视频**（Text-to-Video）：从文字描述生成视频
- **图生视频**（Image-to-Video）：将静态图片动画化
- **视频编辑**（Video-to-Video）：基于提示词修改已有视频
- **多镜头生成**（Multi-shot）：创建包含多个场景的视频
- **音频同步**（Audio-synced）：生成带同步音频的视频

**技术实现**：
- 使用 Python 封装 JWT 认证和任务轮询
- 包含完整的 API 参考文档和提示词指南
- 支持 KLING_ACCESS_KEY / KLING_SECRET_KEY 环境变量配置

**实用场景**：
```bash
# 为产品介绍生成宣传视频
# 输入：一段产品描述文本
# 输出：15-30 秒高质量产品展示视频

# 将静态设计稿转为动态演示
# 输入：设计图片 + 运镜描述
# 输出：带镜头运动的产品演示动画
```

**推荐指数**：⭐⭐⭐⭐⭐ — 国内模型，中文理解优秀，功能全面

---

### 2. fal.ai ⭐⭐⭐⭐⭐

**GitHub**: [agmmnn/fal-ai](https://github.com/openclaw/skills/tree/main/skills/agmmnn/fal-ai)

**核心功能**：通过 fal.ai API 统一访问多种 AI 模型：

- **FLUX** 系列：目前最强的开源图像生成模型之一
- **SDXL**：Stable Diffusion XL 高质量图像生成
- **Whisper**：语音转文字
- 支持图像、视频、音频多模态生成

**实用场景**：
```bash
# 快速生成博客配图
# 批量生成产品展示图
# 生成社交媒体素材
```

**技术亮点**：fal.ai 提供 Serverless GPU 推理，按使用量计费，无需自建 GPU 服务器。

**推荐指数**：⭐⭐⭐⭐⭐ — 模型丰富，API 稳定，性价比高

---

### 3. OpenAI Image CLI ⭐⭐⭐⭐

**GitHub**: [g9pedro/openai-image-cli](https://github.com/openclaw/skills/tree/main/skills/g9pedro/openai-image-cli)

**核心功能**：通过命令行调用 OpenAI 的 GPT Image 和 DALL-E 模型：

- 图像生成（DALL-E 3 / GPT Image）
- 图像编辑（局部修改、风格转换）
- 图像变体生成

**实用场景**：
```bash
# 一句话生成社交媒体封面
openai-image-cli generate "一只穿着太空服的猫在月球上弹吉他"

# 编辑现有图片：添加文字、更换背景
openai-image-cli edit photo.png "把背景换成海滩日落"
```

**推荐指数**：⭐⭐⭐⭐ — OpenAI 官方模型，质量稳定，集成简单

---

### 4. ComfyUI ImageGen ⭐⭐⭐⭐

**GitHub**: [halr9000/comfyui-imagegen](https://github.com/openclaw/skills/tree/main/skills/halr9000/comfyui-imagegen)

**核心功能**：通过 ComfyUI API 本地生成图像：

- 使用 Flux2 工作流
- 连接本地 ComfyUI 实例（localhost:8188）
- 完全离线运行，无需 API Key

**技术实现**：
- 基于 ComfyUI 的节点式工作流引擎
- 通过 HTTP API 发送工作流请求
- 支持 Flux、SDXL 等多种模型

**实用场景**：
```bash
# 本地批量生成高质量图像，无需付费 API
# 自定义工作流：ControlNet、LoRA、IP-Adapter 等
# 隐私敏感场景：所有数据不离开本机
```

**推荐指数**：⭐⭐⭐⭐ — 免费无限用，但需要本地 GPU

---

### 5. 智谱 CogView Image ⭐⭐⭐⭐

**GitHub**: [honestqiao/zhipu-cogview-image](https://github.com/openclaw/skills/tree/main/skills/honestqiao/zhipu-cogview-image)

**核心功能**：使用智谱 AI 的 CogView 模型生成图像：

- 中文提示词原生支持
- CogView-4 高质量图像生成
- 通过智谱 API 调用

**实用场景**：
```bash
# 用中文直接描述生成图像
# "一只在竹林中打太极的熊猫，水墨画风格"
# "赛博朋克风格的上海外滩夜景"
```

**推荐指数**：⭐⭐⭐⭐ — 中文理解最佳，适合国内用户

---

## 📊 推荐指数排名

| 排名 | Skill | 推荐指数 | 最佳场景 |
|------|-------|---------|---------|
| 1 | Kling Video Generator | ⭐⭐⭐⭐⭐ | AI 视频生成 |
| 2 | fal.ai | ⭐⭐⭐⭐⭐ | 多模型统一 API |
| 3 | OpenAI Image CLI | ⭐⭐⭐⭐ | 快速高质量图像 |
| 4 | ComfyUI ImageGen | ⭐⭐⭐⭐ | 本地免费无限生成 |
| 5 | 智谱 CogView | ⭐⭐⭐⭐ | 中文提示词最佳 |

---

## 🎯 应用场景总结

### 内容创作者
- **fal.ai + OpenAI Image CLI**：快速生成博客配图、社交媒体素材
- **Kling Video Generator**：制作短视频、产品宣传

### 设计师
- **ComfyUI ImageGen**：本地批量生成、自定义工作流
- **Figma / Canva 集成 Skills**：设计工具自动化

### 开发者
- **fal.ai API**：Serverless GPU 推理，适合集成到应用中
- **各 OCR Skills**：文档解析、数据提取

### 国内用户
- **智谱 CogView**：中文提示词效果最佳
- **Kling Video**：中文场景理解优秀

---

## 💡 实用建议

1. **入门首选**：从 `fal-ai` 或 `openai-image-cli` 开始，API 调用简单，效果稳定
2. **批量生产**：本地有 GPU 的用户推荐 `comfyui-imagegen`，零成本无限生成
3. **视频需求**：`kling-video-generator` 是目前 OpenClaw 生态中最全面的视频生成工具
4. **中文优先**：`zhipu-cogview-image` 对中文提示词的理解远超英文模型
5. **成本控制**：`cheapest-image` 类 Skill 约 $0.0036/张，适合大批量生成

---

> 📌 **明日预告**：iOS/macOS 开发 分类 — 探索 Apple 生态的开发工具与自动化 Skills
>
> 🔗 完整 Skill 列表：[awesome-openclaw-skills](https://github.com/openclaw/awesome-openclaw-skills)
