---
title: OpenClaw Skill 每日推荐 - 图像与视频生成（image-and-video-generation）
date: 2026-10-13 11:30:00
tags:
  - openclaw
  - skill
  - image-and-video-generation
categories:
  - 技术推荐
---

# OpenClaw Skill 每日推荐 - 图像与视频生成（image-and-video-generation）

> OpenClaw Skill 每日推荐第 14 期，共 30 期。今天介绍的是创作类目里最热闹的一个分类——**图像与视频生成（image-and-video-generation）**。

## 今日分类概述

**image-and-video-generation** 分类收录了 **169 个 skills**，是整个 OpenClaw 生态中数量第二多的分类（仅次于 AI 与大语言模型）。它的覆盖面远不止"文字生图"，大致可以分成几个方向：

- **图像生成**：FLUX、SDXL、DALL·E、Nano Banana（Gemini Image）、智谱 CogView 等各家模型的 API 封装
- **视频生成**：Kling、Sora 2、Veo 3.1、Seedance、MiniMax/WAN 等文生视频/图生视频模型
- **图像编辑与处理**：换脸、年龄变换、深度图、放大、调色板提取、SVG/DXF 转换
- **媒体工具链**：FFmpeg 自然语言剪辑、字幕翻译、GIF 制作、缩略图生成
- **辅助能力**：OCR 文字识别、图表渲染、二维码生成、无版权图库搜索（Unsplash 等）

对 Agent 来说，这个分类意味着一件事：**从"会说话"到"会出活"**——你描述需求，Agent 直接交付图片和视频成品。

---

## 精选 Skill 详解

### 1. fal-ai —— 一个 Key 调用 600+ 生成模型 ⭐⭐⭐⭐⭐

**链接**：[agmmnn/fal-ai-openclaw](https://github.com/agmmnn/fal-ai-openclaw)

**核心功能**：通过 fal.ai 的 API 生成图像、视频和语音转录，一个 skill 打包了 600+ 模型的访问能力。

**支持的主要模型**：

| 模型 | 端点 | 类型 |
| --- | --- | --- |
| flux-schnell | `fal-ai/flux/schnell` | 图像（快速） |
| flux-dev | `fal-ai/flux/dev` | 图像 |
| flux-pro | `fal-ai/flux-pro/v1.1-ultra` | 图像（2K） |
| recraft-v3 | `fal-ai/recraft-v3` | 图像 |
| minimax-video | `fal-ai/minimax-video/image-to-video` | 视频 |
| wan-video | `fal-ai/wan/v2.1/1.3b/text-to-video` | 视频 |
| whisper | `fal-ai/whisper` | 语音转文字 |

**技术实现**：这是我很欣赏的一点——它**只用 Python 标准库**，不依赖 `fal_client` 等第三方包，通过 fal.ai 的队列式异步 API（submit → poll → result）完成任务提交与轮询，部署门槛极低。配置只需要一个环境变量：

```bash
export FAL_KEY="your-api-key"
```

之后就可以直接对话式使用：

```
你：用 FLUX 生成一张赛博朋克风格的城市夜景
Agent：生成完成，图片 URL 是 https://...
```

**实用场景**：
- 内容团队批量出图：指定 `num_images` 和 `seed`，同一个 prompt 出多个变体且可复现
- 给博客文章自动配图（配合本期分类里的 chart-image 等技能）
- 一条链路搞定"图片 → 图生视频 → Whisper 转字幕"的多模态流水线

**推荐理由**：模型覆盖广、依赖零、异步队列设计稳定，是图像生成的"默认首选"。

---

### 2. comfy-cli —— ComfyUI 全生命周期管理 ⭐⭐⭐⭐⭐

**链接**：[OpenClaw Skills 收录页](https://github.com/openclaw/skills/tree/main/skills/johntheyoung/comfy-cli/SKILL.md)（底层工具为 [Comfy-Org/comfy-cli](https://github.com/Comfy-Org/comfy-cli)）

**核心功能**：把 ComfyUI 的安装、启动、自定义节点管理、模型下载、工作流执行全部命令化，让 Agent 可以代替你"搓节点"。

**几个杀手级能力**：

```bash
comfy install --m-series          # Apple Silicon 一键装好 ComfyUI + Manager
comfy node install ComfyUI-Impact-Pack   # 装自定义节点
comfy node bisect                 # 二分法定位"是哪个节点把工作流搞挂了"
comfy node save-snapshot          # 保存当前节点+依赖快照，随时回滚
comfy model download --url "..."  # 从 CivitAI/HuggingFace 拉模型
comfy run --workflow xxx.json     # 以 API 模式跑工作流
```

**技术实现**：`comfy node bisect` 是最体现工程思维的功能——当工作流报错时，自动对已安装节点做二分排查，快速定位冲突节点；`snapshot` 机制则让"昨天能跑今天报错"的经典问题有了后悔药。GPU 支持覆盖 NVIDIA / AMD ROCm / Intel Arc / Apple Silicon / CPU。

**实用场景**：
- 本地化、私密化出图：照片不出本机，适合有合规要求的场景
- Agent 自动搭建环境："帮我装 ComfyUI 并配好 Flux 工作流"变成一句话
- 工作流依赖管理：`comfy node install-deps --workflow xxx.json` 直接按工作流装齐依赖

**推荐理由**：ComfyUI 用户几乎必装。把最繁琐的环境和节点管理交给 Agent，人只管调工作流。

---

### 3. kling-video-generator —— Kling 3.0 Omni 视频生成 ⭐⭐⭐⭐

**链接**：[wells1137/kling-video-generator](https://github.com/wells1137/kling-video-generator)

**核心功能**：基于快手 **Kling 3.0 Omni** 模型的视频生成，覆盖六种模式：文生视频、图生视频、视频编辑（改主体/改风格）、视频参考（复刻运镜与风格）、多镜头分镜生成、音画同步生成（含对白和音效）。

**技术实现**：这个 skill 的 SKILL.md 写得相当扎实，是"如何为复杂 API 写 Agent 技能"的范本：

- 内置 `references/api_reference.md`（完整参数约束 + R1~R10 互斥规则）和 `references/prompt_guide.md`（官方提示词公式与 few-shot 示例）
- 用 Mermaid 决策树描述"用户意图 → API 载荷"的构造流程，Agent 按图索骥不会传错参数
- `scripts/kling_api.py` 封装了 JWT 鉴权、任务创建与轮询
- 沉淀了大量实测才踩得到的坑，例如：`sound: "on"` 与视频输入互斥、`duration` 在编辑模式下会被忽略、`refer_type` 必须显式指定等

```yaml
# 所需环境变量
KLING_ACCESS_KEY: xxx
KLING_SECRET_KEY: xxx
```

**实用场景**：
- 多镜头短片：用 `multi_shot: true` 配合分镜 prompt 数组，一次生成带转场的成品
- 电商/营销素材：产品图一键变动态展示视频
- 老视频风格化改造：video-to-video 换风格、换主体

**推荐理由**：六种生成模式 + 参数约束文档化到位，是国产视频模型接入里完成度很高的一个 skill。视频生成单价较高，建议先用短时长试跑确认效果再放量。

---

### 4. ffmpeg-video-editor —— 用自然语言剪视频 ⭐⭐⭐⭐

**链接**：[ffmpeg-video-editor（Skill 收录页）](https://github.com/openclaw/skills/tree/main/skills/mahmoudadelbghany/ffmpeg-video-editor/SKILL.md)

**核心功能**：把自然语言指令翻译成正确的 FFmpeg 命令并执行。FFmpeg 参数体系庞大（滤镜图、编码器选项、时间轴语法），这个 skill 的价值在于让 Agent 替你查文档、拼命令、验证参数。

**实用场景**：

```
你：把这段视频压缩到 10MB 以内，保持 1080p
你：截取 00:01:20 到 00:02:35 的片段，加淡入淡出
你：把竖屏视频转成 16:9，两侧加高斯模糊背景
你：提取视频音轨转成 mp3，并压掉背景噪音
```

**技术实现**：本质是"LLM + FFmpeg"的命令生成模式——Agent 根据需求选择滤镜链与编码参数，生成命令后经 shell 执行。因为 FFmpeg 本机就有，全程无需上传视频到云端。

**推荐理由**：谁没被 FFmpeg 的滤镜语法折磨过呢？配合本期其他生成类 skill，能补齐"生成之后的剪辑、压缩、转码"最后一公里。⚠️ 危险参数（如覆盖输出 `-y`、删除源文件）建议让 Agent 先展示命令再执行。

---

### 5. zhipu-cogview-image —— 智谱 CogView 生图 ⭐⭐⭐⭐

**链接**：[zhipu-cogview-image（Skill 收录页）](https://github.com/openclaw/skills/tree/main/skills/honestqiao/zhipu-cogview-image/SKILL.md)

**核心功能**：调用智谱 AI 的 CogView 系列模型生成图像。对国内用户来说，这是"注册即用、网络直连"的选择——API Key 在智谱开放平台（bigmodel.cn）申请即可，无需科学上网，也不需要海外信用卡。

**技术实现**：标准的 RESTful API 封装，走 `https://open.bigmodel.cn` 的图像生成接口，传入 prompt 与尺寸参数即可返回图片 URL。值得注意的两点：

- `cogview-3-flash` 提供免费额度，试错成本几乎为零
- 对中文 prompt 的理解比多数海外模型更自然，成语、国风意象表现不错

```python
# 典型调用形态（简化）
from zhipuai import ZhipuAI
client = ZhipuAI(api_key="YOUR_KEY")
resp = client.images.generations(
    model="cogview-3-flash",
    prompt="水墨画风格的远山与孤舟，留白构图",
)
print(resp.data[0].url)
```

**实用场景**：
- 中文内容配图：公众号、小红书、博客插图的快速出图
- 国风/水墨/书法类需求，中文语义理解是加分项
- 教学演示与原型验证：免费档先跑通流程，再按需升级 cogview-4

**推荐理由**：国内网络环境下的低门槛之选，免费档对个人开发者非常友好。

---

## 应用场景总结

把这 5 个 skill 串起来，可以搭出一条完整的**内容生产流水线**：

```
构思脚本 → zhipu-cogview / fal-ai 出静态素材
        → kling-video-generator 图生视频 / 多镜头生成
        → ffmpeg-video-editor 剪辑、压缩、加字幕
        → 成品交付（博客、社媒、客户端）
```

| 角色 | 推荐组合 |
| --- | --- |
| 个人博主 | zhipu-cogview-image + ffmpeg-video-editor（低成本起步） |
| 内容团队 | fal-ai（批量出图）+ kling（视频化） |
| 本地/隐私优先 | comfy-cli（本机出图，数据不出门） |
| 技术写作者 | fal-ai 配图 + chart-image 数据图 + ffmpeg 处理录屏 |

**实用建议**：

1. **先免费后付费**：图像类先用免费档（cogview-3-flash、fal 的 schnell 模型）验证 prompt，效果满意再上高级模型
2. **固定 seed 便于迭代**：批量出图时记录 seed，方便在满意结果上微调
3. **视频生成控制成本**：Kling 这类模型按秒计费，先用低分辨率短时长试跑
4. **注意 API Key 安全**：所有 skill 都依赖环境变量注入密钥，不要把 Key 写进仓库或聊天记录
5. **生成内容需标注**：AI 生成的图片/视频用于公开发布时，记得按平台要求添加 AI 生成标识

---

## 推荐指数排名

| 排名 | Skill | 推荐指数 | 一句话点评 |
| :--: | --- | :--: | --- |
| 🥇 | fal-ai | ⭐⭐⭐⭐⭐ | 600+ 模型一个 Key 全搞定，零依赖设计 |
| 🥇 | comfy-cli | ⭐⭐⭐⭐⭐ | ComfyUI 用户的瑞士军刀，bisect 排障是亮点 |
| 🥉 | kling-video-generator | ⭐⭐⭐⭐ | 参数约束文档化典范，视频生成的实力选手 |
| 4 | ffmpeg-video-editor | ⭐⭐⭐⭐ | 自然语言剪视频，补齐后期最后一公里 |
| 5 | zhipu-cogview-image | ⭐⭐⭐⭐ | 国内直连 + 免费额度，中文出图低门槛首选 |

---

*本文是「OpenClaw Skill 每日推荐」系列第 14/30 期。明日预告：**ios-and-macos-development（iOS/macOS 开发）**。*
