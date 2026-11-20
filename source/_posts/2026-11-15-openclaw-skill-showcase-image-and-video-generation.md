---
title: OpenClaw Skill 每日推荐 - 图像与视频生成（image-and-video-generation）
tags:
  - openclaw
  - skill
  - image-and-video-generation
categories:
  - 技术推荐
abbrlink: 1284
date: 2026-11-15 11:30:00
---

# OpenClaw Skill 每日推荐 - 图像与视频生成（image-and-video-generation）

> 「OpenClaw Skill 每日推荐」第 40 期，**第三轮第 10 期**。继续从 [awesome-openclaw-skills](https://github.com/openclaw/skills)（全库 5300+ 条目、30 个分类）中每天取一个分类，精选代表性 skill 深入介绍。上期说好「明天见」，结果隔了个周末才来——但预告兑现了：管完你几点睡，Agent 决定管你画什么。这是 Agent 头一回从「说」跨到「画」：此前它交付给你的全是文字，从这期开始，它交付像素。顺带一提，本分类里还住着教它换脸的和教它识别换脸的，两边门对门。

老规矩，本期精选条目的机制描述、依赖要求和版本历史均逐个核对过 clawskills.sh 详情页原文（唯一例外 kling-video-generator 不在注册表，核对的是作者仓库的 SKILL.md 原文），附安装命令和链接，出处一手。

## 今日分类概述

**图像与视频生成（image-and-video-generation）**，169 个 skills，全库体量第九（前十：coding-agents 1200 / web 925 / devops 392 / search 352 / browser 320 / productivity 204 / ai 184 / cli 180 / **image 169** / git 166）。盘完的结构是**六成正经、四成串场**——和两期前的 Git 分类一个成色，比上期的健身房（四六开倒挂）体面多了。

正经部分（约 100 条）分三层：

- **调用层**（60 条上下）：文生图、图生图、文生视频、换脸、变龄、头像、正装照、专辑封面、YouTube 封面……各家 API 的薄封装，一个 curl 的事；
- **图像周边**（40 多条）：OCR 六件套、图表可视化、SVG/DXF 转换、调色板提取、搜图（Unsplash）、图床托管、相册管理（Immich）——不生产图像，做图像的搬运和后处理；
- **工作流层**（个位数）：本期的主角们，解决的不是「能不能调 API」，而是「Agent 怎么又快、又稳、又便宜地交付媒体」。

串场住户（60 多条）下面行为艺术部分细说，先剧透一句：16 条 crypto/赌场、3 个租人类的、1 个德奥超市比价，还有 1 个塔罗牌。

**eachlabs 帝国**值得单独记一笔：eftalyurtseven 一个人贡献了 **12 个条目**（变龄、头像、正装照、专辑封面、深度图、换脸、时装、图编辑、图生成、视频编辑、视频生成、YouTube 封面），全部走 each::sense API，一把钥匙通吃，占全分类 7%。

## 精选 Skill 详解

### 1. comfyui-imagegen —— 本地生图，把「等一张图」做成工程 ⭐⭐⭐⭐⭐

- **链接**：[halr9000/comfyui-imagegen](https://github.com/openclaw/skills/tree/main/skills/halr9000/comfyui-imagegen/SKILL.md)
- **安装**：`openclaw skills install @halr9000/comfyui-imagegen`
- **详情页**：[clawskills.sh/skills/halr9000-comfyui-imagegen](https://clawskills.sh/skills/halr9000-comfyui-imagegen)

本分类的工程标杆。对着本地跑的 ComfyUI（localhost:8188）用 **Flux2 工作流**出图：自然语言先被整理成结构化 JSON prompt，再提交 ComfyUI API。杀手锏是**异步子代理**：生成任务提交后，一个 sub-agent 每 5 秒轮询一次状态，主 Agent 该干嘛干嘛，出图完成后自动交付——详情页原话，比阻塞式干等省约 **10 倍 token**。

v1.5.0（2026-02-12）的版本说明写得很实：standalone 结构化 prompt 修复、1920x1080 工作流、异步 JSON 生成+交付全链路 live-tested。这不是 Demo，是当生产力在养的。

**实用场景**：概念图批量探索（多 seed 场景变体）；博客头图、演示配图不离终端；生成期间让 Agent 继续干别的活，出图自动送达。

**依赖门槛**：ComfyUI 装好并跑在 8188 端口——显卡是入场券，换来的是零 API 费和不出本机的隐私。

**为什么排第一**：全分类唯一把「Agent 如何等一张图」当工程问题来解的。别人在卷模型，它在卷等待本身。

### 2. eachlabs-image-generation —— 一把钥匙，60 扇门 ⭐⭐⭐⭐

- **链接**：[eftalyurtseven/eachlabs-image-generation](https://github.com/openclaw/skills/tree/main/skills/eftalyurtseven/eachlabs-image-generation/SKILL.md)
- **安装**：`openclaw skills install @eftalyurtseven/eachlabs-image-generation`
- **详情页**：[clawskills.sh/skills/eftalyurtseven-eachlabs-image-generation](https://clawskills.sh/skills/eftalyurtseven-eachlabs-image-generation)

eachlabs 帝国的旗舰。**60+ 模型**（Flux、GPT Image、Gemini、Imagen、Seedream、Ideogram）统一走 EachLabs Predictions API，一套请求 schema，一个 `EACHLABS_API_KEY`，异步三段式：提交任务 → 轮询 → 取回输出 URL。详情页说得直白：省掉的是给每家模型单独开户、单独集成的管理成本。

值得点名的是 v0.1.2（2026-02-09）新增的**安全约束章节**：LoRA 权重只允许白名单平台标识（不接受任意用户提供的 URL）、拒绝转发第三方 API token、输入参数必须匹配模型请求 schema、model slug 提交前先校验。会把安全边界主动写进 SKILL.md 的 skill，全库都不多见。

**实用场景**：产品 mockup、社媒配图、透明背景 logo 原型、博客插图、带特定风格的训练数据集——详情页给的用例清单本身就是个选题库。

### 3. kling-video-generator —— 把 API 手册写成决策树 ⭐⭐⭐⭐

- **链接**：[wells1137/kling-video-generator](https://github.com/wells1137/kling-video-generator/blob/master/SKILL.md)
- **安装**：不在官方注册表（clawskills.sh 查无此 skill），从[作者仓库](https://github.com/wells1137/kling-video-generator)克隆进 skills 目录使用
- **环境变量**：`KLING_ACCESS_KEY` / `KLING_SECRET_KEY`，需要 python3

视频侧的教科书。基于 **Kling 3.0 Omni**，六种模式全覆盖：文生视频、图生视频、视频编辑（换主体换风格）、视频参考（借运镜和风格）、多镜头分镜生成、音画同步（含语音和音效）。

真正的亮点是它的**文档架构**：`references/api_reference.md` 收录全量参数、类型、**R1-R10 互斥规则**和能力矩阵（作者自称 extensive testing 踩出来的）；`references/prompt_guide.md` 给出官方提示词公式、模板语法和全场景 few-shot；`scripts/kling_api.py` 统管 JWT 认证、任务创建和轮询。比如「`sound: on` 与视频输入互斥」这种坑，直接写成硬约束，Agent 构造 payload 前必须先走一遍决策树——多镜头要设 `multi_shot: true` 和 `shot_type: "customize"`，编辑和参考分别对应 `refer_type: "base"` 与 `"feature"`，条条有出处。

**实用场景**：分镜脚本直接出多镜头成片；静态产品图转动态广告；给现有视频换风格。

**两个提醒**：SKILL.md 里写死了 `/home/ubuntu/skills/...` 的 Linux 绝对路径，macOS 用户装完记得改；它也是本期精选里唯一自托管仓库的——不在注册表，质量倒是在线。

### 4. creaa-ai —— 模型阵容最新鲜的一张脸 ⭐⭐⭐⭐

- **链接**：[yys2024/creaa-ai](https://github.com/openclaw/skills/tree/main/skills/yys2024/creaa-ai/SKILL.md)
- **安装**：`openclaw skills install @yys2024/creaa-ai`
- **详情页**：[clawskills.sh/skills/yys2024-creaa-ai](https://clawskills.sh/skills/yys2024-creaa-ai)

走 Creaa API 的图+视频双修，模型表是全分类最激进的：**Nano Banana 2、Sora 2、Seedance 2.0、Veo 3.1**——别的 skill 还在卷去年的旗舰，它把各家最新的视频模型排成了一张表。任务覆盖文生图、图生图、多图参考编辑、文生视频、图生视频，同样是异步提交 → task ID → 轮询的管道。

v1.1.0（2026-03-09）首发的版本说明交代得很清楚：模型表覆盖 model ID、能力、支持宽高比和积分成本——选型时不用自己翻 API 文档，这对 Agent 是实打实的省 token。

**实用场景**：追新模型不想频繁换工具的；图和视频要在同一条管道里出的（比如先生成分镜图、再图生视频）。

### 5. memelink —— 免费梗图，本分类的下限之美 ⭐⭐⭐

- **链接**：[dedene/memelink](https://github.com/openclaw/skills/tree/main/skills/dedene/memelink/SKILL.md)
- **安装**：`openclaw skills install @dedene/memelink`
- **详情页**：[clawskills.sh/skills/dedene-memelink](https://clawskills.sh/skills/dedene-memelink)

不碰大模型：Memegen.link 的公开 API，终端直接产梗图、image macro 和 meme URL。详情页 Requirements 一栏是空的——装完就能用，零依赖零费用。它证明了这个生态的下限可以多低：一条 curl 的事，包装到位了也是价值。

**实用场景**：群聊斗图弹药库；给日报周报配一张克制的表情包；Agent 学会冷幽默的最短路径。

**顺便点名几位荣誉提名**：[bex-nano-banana-pro](https://github.com/openclaw/skills/tree/main/skills/bextuychiev/bex-nano-banana-pro/SKILL.md)（bextuychiev，数据工程圈知名博主，走 Replicate 的 Gemini 3 Pro Image 通道，详情页信息量约等于零但作者口碑在线）；[fal-ai](https://github.com/openclaw/skills/tree/main/skills/agmmnn/fal-ai/SKILL.md)（agmmnn，fal.ai 老牌推理基础设施，FLUX/SDXL/Whisper 图音视频一把抓）；[zhipu-cogview-image](https://github.com/openclaw/skills/tree/main/skills/honestqiao/zhipu-cogview-image/SKILL.md)（智谱 CogView，国内网络环境直连之选）；[ollama-x-z-image-turbo](https://github.com/openclaw/skills/tree/main/skills/eric51/ollama-x-z-image-turbo/SKILL.md)（法语作者，Ollama 本地跑 x/z-image-turbo，出图直发 WhatsApp——本地派的浪漫）；[algorithmic-art](https://github.com/openclaw/skills/tree/main/skills/seanphan/algorithmic-art/SKILL.md)（p5.js + 种子随机，不调 API 的代码生图原教旨主义）。

## 行为艺术三则

1. **价格战打出 50 倍价差**：cheapest-image 号称 $0.0036/张，best-image 报价 $0.12-0.20/张——两句描述、四个 skill、两个作者（pharmacist9527、evolinkai），排列组合出 best/cheapest 各一对，价差最高 55 倍。质量差 50 倍还是成本差 50 倍，两家都没说；kie-ai-skill 更是把「at 30-80%」直接写进描述（原文到此截断，省的是成本还是别的，留给你想象）。API 二道贩子的价格战，正式打进了 skill 市场。
2. **克隆浓度再创新高**：上期健身房三对双胞胎已是全库领先，这期直接翻倍——六对描述完全相同的条目：qr-gen ≡ skill-1（claudiodrusus）、e2ee ≡ openindex（titocosta）、opencr-skill ≡ openocr-skill（topdu，名字就差一个字母）、rent-a-human ≡ rentahuman（alexanderliteplo）、aiusd ≡ aiusd-skills（chaunceyliu），外加上面的 best/cheapest 跨作者四胞胎。另有一个叫 pr-generator 的，描述是「生成 QR 码」——名字和内容之间，大概隔着一次手滑。
3. **攻防同场，四世同堂**：eachlabs-face-swap 教 Agent 换脸，didit-passive-liveness 教 Agent 做活体检测防伪，image-detection 教 Agent 识别 AI 生图，vtl-image-analysis 还要用 Visual Thinking Lens 框架给 AI 生图量构图。一条街上，造假铺子、鉴定铺子和艺术评论家门对门。而本分类最名副其实的串场者是 agentchan——匿名 imageboard（图像板），确实含 image，分类器没骗你，只是没想到。

## 应用场景总结

按人群对号入座：

- **有显卡、要隐私、零预算**：comfyui-imagegen，本地 Flux2 + 异步交付；
- **不想开 N 个账号**：eachlabs-image-generation 一把钥匙 60 模型（或 fal-ai）；
- **视频创作者**：kling-video-generator，分镜到成片一条管道；
- **模型追新党**：creaa-ai，Sora 2 / Veo 3.1 / Nano Banana 2 都在表里；
- **群聊斗图选手**：memelink，免费无依赖；
- **国内网络环境**：zhipu-cogview-image 直连；
- **设计资产已有积累**：canva-connect、figma、photoshop-automator 三座桥；
- **代码生图原教旨**：algorithmic-art，种子随机，可复现的艺术。

一个横向观察：上期健康分类的正经部分是「数据/记忆/纪律」三类代理，这期是「**调用/聚合/工作流**」三层基建。护城河排序很清楚：工作流（comfyui 的异步子代理、kling 的 R1-R10）> 聚合（eachlabs 的 60 模型表）> 调用（上百条薄封装，只能靠价格战互卷）。Agent 生态的图像战场，已经从「能不能调 API」升级到「怎么把等待、约束和成本做成工程」。

## 推荐指数排名

| 排名 | Skill | 推荐指数 | 一句话 |
|---|---|---|---|
| 1 | comfyui-imagegen | ⭐⭐⭐⭐⭐ | 本地 Flux2 + 异步子代理，把等待做成工程 |
| 2 | kling-video-generator | ⭐⭐⭐⭐ | R1-R10 互斥规则 + 决策树，视频六模式；记得改硬编码路径 |
| 3 | eachlabs-image-generation | ⭐⭐⭐⭐ | 60+ 模型一把钥匙，安全边界写进 SKILL.md |
| 4 | creaa-ai | ⭐⭐⭐⭐ | Sora 2 / Veo 3.1 阵容最新，模型表省翻文档 |
| 5 | memelink | ⭐⭐⭐ | 免费梗图，五分钟上手，下限之美 |

---

*系列连载中。下期第 41 期：画完之后，Agent 盯上了你的 iPhone——它说要亲手写 Swift。**iOS/macOS 开发（ios-and-macos-development）**，敬请期待。*
