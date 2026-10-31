---
title: OpenClaw Skill 每日推荐 - Web 前端开发（web-and-frontend-development）
tags:
  - openclaw
  - skill
  - web-and-frontend-development
categories:
  - 技术推荐
date: 2026-10-31 11:30:00
---

# OpenClaw Skill 每日推荐 - Web 前端开发

> 「OpenClaw Skill 每日推荐」第 29 期。每天从 [awesome-openclaw-skills](https://github.com/openclaw/skills) 的 30 个分类中取一个，精选代表性 skill 深入介绍。今天是 **Web 前端开发（Web & Frontend Development）**——全库最大的分类，没有之一，也是串门最严重的重灾区。但正主们的含金量，配得上这个体量。

## 今日分类概述

Web 前端开发分类收录 **925 个 skills**，是第二名 ai-and-llms（184 个）的整整五倍。这个数字要打折看：分类名里的 "Web" 被理解得非常宽泛，凡是跟"网页"沾边的都被塞了进来。粗略盘一下库存：

- **真正的正主（约 150 个）**：Next.js 全家桶（next-best-practices、next-cache-components、next-upgrade、web-i18n-nextjs、react-perf）、Tailwind / shadcn 生态（lb-tailwindcss-skill、shadcn-theme-default）、设计美学系列（anti-slop-design、awwwards-design、web-design-pro、kj-ui-ux-pro-max）、脚手架（stack-scaffold、sveltekit-webapp、landing-page-builder）、部署发布（vibe-ship、kj-web-deploy-github、web-hosting、deploy-pilot）、前端测试（qa-patrol、playwright-testing、axe-devtools）
- **借宿的搜索引擎（60+ 个）**：perplexity 系变体至少 7 个、DuckDuckGo 系 6 个、Brave 系 4 个、还有 SearXNG、Kagi、Exa、Serper 各自的山寨军团——搜索类技能 OWN 分类是 search-and-research，这里纯属挤膏房
- **借宿的爬虫家族（40+ 个）**：playwright-* 一大家子十来个、crawl4ai 两个、firecrawler、scrapling 两个、apify、decodo……爬虫们大概觉得"网页"等于"前端"
- **完全无关但理直气壮的**：WhatsApp 自动化五件套（evogo、evolution-api、gowa、p-api、papi）、Google Workspace 套件（其中两个 skill 的名字分别叫 **asdasdas** 和 **fsdfsd**，是的，就是这么起的）、Web3/加密货币一大票、agent 社交网络若干
- **行为艺术**：web-navigator 的描述原文是 "[TODO: Complete and informative explanation of what the skill does and when to use it.]"——连简介都懒得写就上架了

剔除噪音后，正主们呈现出三个清晰趋势：

1. **"文档即技能"模式已经成熟**。lb-* 系列把 Tailwind、Zod、Vercel CLI、Motion 动画库、Better Auth 的完整文档打包成 skill，本质是给 agent 挂一个"离线专家大脑"——不依赖联网检索，规范直接进上下文。
2. **"反 AI 味设计"成为独立赛道**。anti-slop-design、awwwards-design、kj-web-design-guidelines 都在解决同一个问题：AI 生成的页面千篇一律的紫色渐变 + 圆角卡片 + 居中 hero。
3. **新版本跟进速度惊人**。next-cache-components 已经在讲 Next.js 16 的 PPR 和 `use cache` 指令——社区技能对框架新特性的消化速度不输官方文档。

下面精选 5 个，正好覆盖"建项目 → 写代码 → 样式 → 设计 → 上线"的完整链路。

## 精选 Skill 详解

### 1. next-best-practices —— 让 agent 写出"高级工程师手笔"的 Next.js

**链接**：[tuanvidev/next-best-practices](https://github.com/openclaw/skills/tree/main/skills/tuanvidev/next-best-practices/SKILL.md)

**核心功能**：系统化注入 Next.js 最佳实践——文件约定（file conventions）、RSC 边界划分（Server/Client Component 怎么切）、数据获取模式、async API 用法、metadata 处理、错误处理。同一位作者还有配套的 next-cache-components（Next.js 16 缓存组件：PPR、`use cache` 指令、cacheLife/cacheTag）和 next-upgrade（跟随官方迁移指南与 codemod 升级版本）。

**实用场景举例**：

- "帮我做一个带鉴权的 dashboard"——agent 从第一个文件开始就按 App Router 的正确姿势组织目录，而不是把所有东西塞进 `"use client"` 的大组件
- Code review 时让 agent 对照规范检查：数据获取是否在服务端做、`loading.tsx` / `error.tsx` 是否就位、metadata 是否完整
- 老项目升级：next-upgrade 会按官方迁移指南走 codemod，而不是让 agent 凭记忆瞎改

**技术实现**：典型的"规范文档型" skill——SKILL.md 本体是高度浓缩的实践清单 + 常见反模式对照。加载后相当于给 agent 挂载了一份 code review checklist，生成代码时逐条自检。这类技能不调外部 API，纯知识注入，稳定性最好。

**推荐指数**：★★★★★

> Next.js 是当前 agent 生成 Web 应用的事实默认框架，这份规范的价值会被每一次生成放大。五星里扣的半星留给未来版本漂移的风险——框架一升级，文档就得跟着维护。

### 2. anti-slop-design —— 治"AI 味"的一剂猛药

**链接**：[kjaylee/anti-slop-design](https://github.com/openclaw/skills/tree/main/skills/kjaylee/anti-slop-design/SKILL.md)

**核心功能**：名字就说明了一切——slop 指的是 AI 生成内容那种一眼假的整体质感。这个 skill 专门引导 agent 产出"有辨识度的、生产级"的前端界面：字体有态度、配色有逻辑、布局有节奏，明确避开 AI 生成页面的高频套路。

**实用场景举例**：

- 给个人项目做官网："不要看起来像 AI 做的"——这句话终于有了可执行的技术方案
- 品牌站改版：和 awwwards-design（冲获奖级视觉）搭配，一个管"不落俗套"，一个管"惊艳"
- 给客户的 landing page：kj-web-design-guidelines 还能事后按 Web Interface Guidelines 逐条审 UI 代码

**技术实现**：同样是设计规范注入型，但方向和 next-best-practices 相反——后者求"对"，它求"不同"。SKILL.md 大概率包含负面清单（禁用组合、滥用的视觉模式）+ 正向风格方向。和 kj-ui-ux-pro-max、ui-designer-skill（Material You / Glassmorphism / Neo-Brutalism 等风格库）形成"审美工具箱"。

**推荐指数**：★★★★☆

> 解决的是真问题：2026 年了，用户对"AI 做的网站"已经有了肌肉记忆式的反感。扣分点是审美这东西终究见仁见智，规范只能保证下限。

### 3. lb-tailwindcss-skill —— 把整本 Tailwind 文档塞进上下文

**链接**：[leonaaardob/lb-tailwindcss-skill](https://github.com/openclaw/skills/tree/main/skills/leonaaardob/lb-tailwindcss-skill/SKILL.md)

**核心功能**：完整的 Tailwind CSS 文档打包成 skill。同系列还有 lb-zod-skill（Zod 校验库）、lb-vercel-skill（Vercel CLI 完整参考）、lb-motion-skill（Motion 动画库，原 Framer Motion）、lb-better-auth-skill（Better Auth 认证）——一套"前端五件套"文档。

**实用场景举例**：

- 写组件时不再出现"agent 记错了 v3 的类名"——文档版本和你的项目对齐
- 离线/内网环境：不依赖联网查文档，规范直接可用
- 五件套组合安装后，"用 Next.js + Tailwind + Zod + Better Auth 搭一个带表单校验的注册页"这类复合任务，每个环节都有权威参考兜底

**技术实现**：文档型 skill 的标准范式——把官方文档整理成 agent 友好的 Markdown 结构，按需检索加载。优点是稳定、离线、版本可控；代价是占用上下文预算，所以同类 skill 的质量关键在"裁剪得好不好"，而不是"塞得多不多"。

**推荐指数**：★★★★☆

> 没有花活，就是好用。这类"老实人文档包"是 agent 编程质量最被低估的杠杆——模型幻觉最多的地方恰恰是 API 细节。

### 4. stack-scaffold —— 开工第一步，一条命令拉起全栈

**链接**：[guifav/stack-scaffold](https://github.com/openclaw/skills/tree/main/skills/guifav/stack-scaffold/SKILL.md)

**核心功能**：按固定技术栈脚手架化一个全栈项目——Next.js App Router + Supabase + Firebase Auth，部署目标预配 Vercel 和 Cloudflare。目录结构、环境变量模板、基础配置一步到位。

**实用场景举例**：

- 周末副业项目："帮我起一个能跑的项目底座，技术栈就按这套来"——省掉半小时的配置 Hell
- 团队内统一项目模板：比口口相传的"参考那个仓库的配置"靠谱得多
- 和 firebase-auth-setup（配 provider、安全规则、custom claims、React hooks）无缝衔接，认证这层直接铺好

**技术实现**：模板生成型 skill——本质是把一套经过验证的项目模板参数化。价值不在技术难度，在于"被踩过坑的默认值"：目录怎么分、env 变量叫什么、部署配置怎么写，都是现成答案。同赛道还有 sveltekit-webapp（SvelteKit PWA）和 web-i18n-nextjs（国际化专项）。

**推荐指数**：★★★★☆

> "选型 + 配置"是 agent 自由发挥时最容易翻车的环节，锁死技术栈反而是解放。扣分在技术栈绑定较深——Supabase + Firebase Auth 双数据库的组合未必人人喜欢。

### 5. vibe-ship —— 从想法到公网，一个 session 收工

**链接**：[satoshi891102/vibe-ship](https://github.com/openclaw/skills/tree/main/skills/satoshi891102/vibe-ship/SKILL.md)

**核心功能**：一句话描述："Ship a complete web app from idea to public deployment in one session."——把"想法 → 代码 → 构建 → 部署 → 拿到公网 URL"压缩进单个会话流程。

**实用场景举例**：

- "我想要个记录晨间写作的打卡页，今晚就要能打开"——vibe-ship 负责走完全程
- Hackathon / 快速原型验证：想法到可分享链接的时间从小时级压到分钟级
- 和同赛道的 app-builder（Instant 后端 + Next.js）、fastmode（免费建站托管）、agentscale（单命令部署 Web 应用/API）互为备选，哪家稳用哪家

**技术实现**：流程编排型 skill——本身不写代码，而是约束 agent 按固定管线执行：生成 → 本地验证 → 部署命令 → 健康检查。这类 skill 的价值在于把"agent 常见的半途而废"（代码写完忘了部署、部署完不验证）变成流程强制项。deploy-pilot（构建校验 → push → Vercel 部署 → 健康检查全周期）是同思路的更细分版本。

**推荐指数**：★★★★☆

> 端到端交付是 agent 相对传统开发工具的最大差异化优势。扣分在"一个 session"的理想状态依赖网络和平台不抽风——现实里多留一次重试预算。

## 应用场景总结

| 场景 | 组合方案 |
| --- | --- |
| 一句话 MVP | stack-scaffold 起项目 + next-best-practices 写代码 + vibe-ship 收尾上线 |
| 组件级开发 | lb-tailwindcss-skill 查样式 + lb-zod-skill 做校验 + shadcn-theme-default 定主题 |
| 品牌站/官网 | anti-slop-design 定调性 + awwwards-design 拉上限 + kj-web-design-guidelines 做终审 |
| 老项目维护 | next-upgrade 跟官方迁移升级 + technical-seo-checker 体检 + qa-patrol 自动化回归 |
| 团队规范化 | 把团队自己的 lint 规则、目录约定做成内部 skill——next-best-practices 就是现成范本 |

一个值得注意的信号：这个分类里**纯"知识注入型"技能占了正主的半壁江山**。框架规范、库文档、设计准则——都不调 API、不需要密钥，纯粹的"给 agent 发一本手册"。这可能是社区技能里 ROI 最高的一类：制作成本低（整理文档），收益稳定（每次生成都受益）。

## 推荐指数排名

| 排名 | Skill | 推荐指数 | 一句话点评 |
| --- | --- | --- | --- |
| 1 | next-best-practices | ★★★★★ | 默认框架 + 默认规范，被引用次数注定是分类顶流 |
| 2 | lb-tailwindcss-skill | ★★★★☆ | 老实人文档包，专治 API 幻觉 |
| 3 | anti-slop-design | ★★★★☆ | 第一个把"不要 AI 味"写成可执行规范的 |
| 4 | stack-scaffold | ★★★★☆ | 锁死选型的脚手架，配置 Hell 的终结者 |
| 5 | vibe-ship | ★★★★☆ | 端到端交付流程，agent 的"负责到底"训练器 |

## 实用建议

1. **知识型技能按技术栈装，别囤货**。lb-* 五件套、Next.js 三部曲（best-practices / cache-components / upgrade）——你项目用什么装什么。没用的文档包只会白白吃掉上下文预算，还可能让 agent 在该用 A 库时 referencing B 库的写法。
2. **规范类 skill 要"对版本"**。Tailwind v3 和 v4 的配置写法差异不小，装文档包前先确认它覆盖的版本和项目一致，否则等于给 agent 发了一本过期的手册。
3. **设计和部署类 skill 组合拳最好用**。单独的 anti-slop-design 只能保证"不丑"，配合 kj-web-design-guidelines 事后审查 + vibe-ship 交付，才是一条完整的质量链。
4. **警惕这个分类的搜索陷阱**。装个网页搜索需求来这儿找 skill，大概率装回来一堆功能重复的 perplexity 变体——搜索类请移步第 22 期讲过的 search-and-research 分类，那里的正主更全。
5. **"文档即技能"值得抄作业**。如果你维护内部组件库或设计系统，花半天把它整理成 skill，团队里每个 agent 从此都按同一套规范写代码——这可能是普通人能从本期清单里带走的最大启发。

---

*本期是第 29 期。下期是本系列第 30 期，也是第二轮的收官之作——**ai-and-llms（AI 与大语言模型）**，整个技能库的起点和顶流分类，敬请期待。*
