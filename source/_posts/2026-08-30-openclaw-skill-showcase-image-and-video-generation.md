---
title: OpenClaw Skill 每日推荐 - 图像与视频生成
tags:
  - openclaw
  - skill
  - image-and-video-generation
categories:
  - 技术推荐
abbrlink: 65108
date: 2026-08-30 11:30:00
---

# OpenClaw Skill 每日推荐 - 图像与视频生成

> 🎨 今天我们进入第 14 个分类：**Image & Video Generation（图像与视频生成）**
>
> 这是 OpenClaw 生态中最庞大的分类之一，共收录 **169 个 Skills**，涵盖了从 AI 绘画、视频生成、图像编辑到 OCR 识别、图表可视化等全方位视觉创作能力。

## 📊 分类概述

图像与视频生成分类是整个 OpenClaw Skills 生态中规模最大的分类之一。169 个 Skills 可以大致归纳为以下几个子方向：

| 子方向 | 代表 Skills | 说明 |
|--------|------------|------|
| AI 图像生成 | fal-ai, openai-image-cli, comfyui-imagegen | 调用各类大模型生成图片 |
| AI 视频生成 | kling-video-generator, ai-video-gen, heygen-avatar-lite | 文本/图像转视频 |
| 图像编辑处理 | eachlabs-image-edit, photoshop-automator, color-palette | 后期编辑与风格转换 |
| 算法艺术 | algorithmic-art, chart-image, data-viz | 代码驱动的视觉创作 |
| OCR 与文档 | ocr-python, tesseract-ocr, zerox, opencr-skill | 图像文字提取 |
| 社交媒体 | instagram-photo-text-overlay, youtube-thumbnail-generation, snapog | 面向社交平台的内容生成 |

---

## 🏆 精选 Skill 详解

### 1. fal-ai — 多模型 AI 生成瑞士军刀

**GitHub:** [openclaw/skills - agmmnn/fal-ai](https://github.com/openclaw/skills/tree/main/skills/agmmnn/fal-ai/SKILL.md)

**核心功能：**
通过 fal.ai API 统一接口，调用多种顶级 AI 模型生成图像、视频和音频。支持 FLUX、SDXL、Stable Diffusion、Whisper 等数十种模型，一个 Skill 覆盖几乎全部生成需求。

**实用场景：**
- 快速生成产品配图、博客封面
- 文本转语音、音频转文字
- 视频生成与风格迁移
- 批量生成图像素材用于 A/B 测试

**技术实现：**
通过 fal.ai 的 REST API 发送请求，支持异步轮询获取结果。API Key 通过环境变量 `FAL_KEY` 注入，无需自行管理模型推理基础设施。

**推荐指数：⭐⭐⭐⭐⭐**

> 亮点：一个 Skill 顶十个用，fal.ai 平台模型更新快，新模型出来即可使用。

---

### 2. comfyui-imagegen — 本地 ComfyUI 集成

**GitHub:** [openclaw/skills - halr9000/comfyui-imagegen](https://github.com/openclaw/skills/tree/main/skills/halr9000/comfyui-imagegen/SKILL.md)

**核心功能：**
连接本地运行的 ComfyUI 实例（默认 `localhost:8188`），通过 API 发送 Flux2 工作流，在本地生成图像。完全掌控推理过程，无需第三方 API 费用。

**实用场景：**
- 隐私敏感的图像生成（完全本地运行）
- 自定义工作流（ControlNet、LoRA、IPAdapter 等）
- 批量生成，离线可用
- 与 ComfyUI 丰富的节点生态无缝对接

**技术实现：**
通过 HTTP 请求调用 ComfyUI 的 API 端点，发送 JSON 格式的工作流定义，轮询任务状态，最终获取生成图像。依赖本地已安装并运行 ComfyUI。

```bash
# 前置条件：本地运行 ComfyUI
# 安装 ComfyUI 后启动
cd /path/to/ComfyUI
python main.py --listen 0.0.0.0 --port 8188
```

**推荐指数：⭐⭐⭐⭐**

> 亮点：零 API 费用 + 完全可控的工作流，适合有本地 GPU 的进阶用户。

---

### 3. openai-image-cli — OpenAI 官方图像生成

**GitHub:** [openclaw/skills - g9pedro/openai-image-cli](https://github.com/openclaw/skills/tree/main/skills/g9pedro/openai-image-cli/SKILL.md)

**核心功能：**
通过 OpenAI 官方 API 调用 GPT Image 和 DALL-E 模型，支持图像生成、编辑和管理。包括文本转图像、图像编辑（inpainting）、图像变体生成等功能。

**实用场景：**
- 高质量营销素材快速生成
- 产品概念图与原型设计
- 博客/社交媒体配图
- 图像局部编辑与修改

**技术实现：**
通过 OpenAI REST API（`/v1/images/generations`、`/v1/images/edits` 等端点）发送请求，API Key 通过环境变量 `OPENAI_API_KEY` 注入。支持 DALL-E 2/3 和最新的 GPT Image 模型。

```bash
# 环境变量配置
export OPENAI_API_KEY="sk-..."

# 典型调用流程
# 1. 提示词 → 生成图像
# 2. 上传原图 + 蒙版 → 局部编辑
# 3. 原图 → 生成变体
```

**推荐指数：⭐⭐⭐⭐⭐**

> 亮点：OpenAI 官方支持，图像质量稳定，GPT Image 模型的文字渲染能力是杀手级特性。

---

### 4. kling-video-generator — Kling 3.0 Omni 视频生成

**GitHub:** [wells1137/kling-video-generator](https://github.com/wells1137/kling-video-generator)

**核心功能：**
使用快手 Kling 3.0 Omni 模型生成高质量视频，支持六大核心能力：

| 能力 | 说明 |
|------|------|
| Text-to-Video | 从文本描述生成视频 |
| Image-to-Video | 让静态图片动起来 |
| Video Editing | 基于提示词修改现有视频 |
| Video Reference | 用视频作为风格参考 |
| Multi-shot Generation | 多场景分镜生成 |
| Audio Generation | 生成同步音频（语音 + 音效） |

**实用场景：**
- 短视频内容创作（抖音/B站风格）
- 产品演示视频生成
- 故板分镜视频批量生成
- AI 配音视频一体化制作

**技术实现：**
使用 Python 脚本（`scripts/kling_api.py`）进行 JWT 认证、任务创建和结果轮询。需要 `KLING_ACCESS_KEY` 和 `KLING_SECRET_KEY` 两个环境变量。Skill 内含完整的 API 参考文档和 Prompt 编写指南。

```python
# 认证流程
import jwt, time

def create_token(access_key, secret_key):
    payload = {
        "iss": access_key,
        "exp": int(time.time()) + 1800,
        "nbf": int(time.time()) - 5
    }
    return jwt.encode(payload, secret_key, algorithm="HS256")
```

工作流采用决策树模式，根据用户意图（单镜头/多镜头、是否有视频输入、是否需要音频）自动构建正确的 API 请求参数，确保符合模型的复杂参数约束规则（R1-R10）。

**推荐指数：⭐⭐⭐⭐⭐**

> 亮点：覆盖视频生成全链路，从文本到成片一站式完成，多镜头 + 音频同步是独门绝技。

---

### 5. algorithmic-art — p5.js 算法艺术

**GitHub:** [openclaw/skills - seanphan/algorithmic-art](https://github.com/openclaw/skills/tree/main/skills/seanphan/algorithmic-art/SKILL.md)

**核心功能：**
使用 p5.js 创作算法艺术作品，通过种子随机数（seeded randomness）确保作品可复现。与 AI 生成不同，这是**代码驱动**的视觉创作——你写算法，算法画出作品。

**实用场景：**
- 生成独特的 NFT 艺术品
- 数据可视化艺术化呈现
- 程序化纹理与图案生成
- 教学演示算法可视化

**技术实现：**
基于 p5.js（JavaScript 创意编程库），通过随机种子控制伪随机数生成器，确保同一种子 + 同一算法 = 同一作品。输出为 PNG 或 SVG 格式。

```javascript
// 基本示例：种子化随机绘画
function setup() {
  createCanvas(800, 800);
  randomSeed(42);  // 种子确保可复现
  noLoop();
}

function draw() {
  for (let i = 0; i < 1000; i++) {
    let x = random(width);
    let y = random(height);
    let r = random(5, 50);
    let c = color(random(255), random(255), random(255), 150);
    fill(c);
    noStroke();
    circle(x, y, r);
  }
}
```

**推荐指数：⭐⭐⭐⭐**

> 亮点：不依赖任何 AI API，完全免费且可复现。是 AI 生成之外一种独特的创作范式——**你定义规则，算法创造美**。

---

## 📋 应用场景总结

图像与视频生成分类的 169 个 Skills 覆盖了以下核心场景：

### 内容创作
- **博客/社交媒体配图**：openai-image-cli、fal-ai 可快速生成高质量配图
- **YouTube 封面**：youtube-thumbnail-generation 专门优化高 CTR 设计
- **Instagram 内容**：instagram-photo-text-overlay 直接输出带文字的社交媒体图

### 视频制作
- **短视频生产**：kling-video-generator 从文本到成片全链路覆盖
- **数字人视频**：heygen-avatar-lite 通过 HeyGen API 创建 AI 数字人
- **视频编辑**：ffmpeg-video-editor 用自然语言生成 FFmpeg 命令

### 专业工具
- **设计自动化**：figma、canva-connect、photoshop-automator 对接主流设计工具
- **CAD 渲染**：cad-agent 为 AI 代理提供 CAD 工作流
- **数据可视化**：chart-image、data-viz 将数据转为出版级图表

### 图像分析
- **OCR 文字识别**：tesseract-ocr、ocr-python、zerox 支持多语言文档数字化
- **AI 图像检测**：image-detection 检测 AI 生成图像
- **人脸分析**：didit-age-estimation、didit-passive-liveness 用于年龄估计和活体检测

---

## 🏅 推荐指数排名

| 排名 | Skill | 推荐指数 | 核心优势 |
|------|-------|---------|---------|
| 1 | fal-ai | ⭐⭐⭐⭐⭐ | 多模型统一接口，覆盖图像/视频/音频 |
| 2 | openai-image-cli | ⭐⭐⭐⭐⭐ | OpenAI 官方支持，文字渲染能力顶级 |
| 3 | kling-video-generator | ⭐⭐⭐⭐⭐ | 视频生成全链路，多镜头+音频同步 |
| 4 | algorithmic-art | ⭐⭐⭐⭐ | 零 API 依赖，可复现的代码艺术 |
| 5 | comfyui-imagegen | ⭐⭐⭐⭐ | 本地免费推理，工作流完全可控 |

---

## 💡 实用建议

1. **入门首选**：如果你刚接触 AI 图像生成，从 `openai-image-cli` 开始，OpenAI 的模型最稳定、文档最全。
2. **性价比之王**：`cheapest-image` 声称每张图仅约 $0.0036，适合大批量生成场景。
3. **视频创作**：`kling-video-generator` 是目前最完整的视频生成 Skill，多镜头+音频同步能力独步江湖。
4. **本地部署**：有本地 GPU 的用户优先考虑 `comfyui-imagegen`，零 API 费用 + ComfyUI 生态 = 无限可能。
5. **创意编程**：想跳出 AI 生成范式？试试 `algorithmic-art`，用代码定义规则，用算法创造美。
6. **批量处理**：`eachlabs-image-edit` 支持 200+ AI 模型，适合需要多种风格变换的批量任务。

---

> 📅 这是 OpenClaw Skill 每日推荐系列的第 14 期。明天我们将介绍 **iOS & macOS Development** 分类，敬请期待！
>
> 完整分类列表请访问 [Awesome OpenClaw Skills](https://github.com/daoyuly/awesome-openclaw-skills)
