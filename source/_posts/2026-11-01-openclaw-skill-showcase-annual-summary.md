---
title: OpenClaw Skill 每日推荐 · 30 期二轮收官总结
tags:
  - openclaw
  - skill
  - 年度总结
categories:
  - 技术推荐
date: 2026-11-01 11:35:00
---

# OpenClaw Skill 每日推荐 · 30 期二轮收官总结

> 「OpenClaw Skill 每日推荐」系列第二轮正式收官。30 期、30 个分类，从 [ai-and-llms](/2026/11/01/openclaw-skill-showcase-ai-and-llms/) 开始，也在 ai-and-llms 结束——首尾呼应。这篇是整个系列的总结陈词：全库数据、生态观察、五星全明星，以及一份"如果只装 5 个"的最小清单。

## 一、全库数据速览

数据基线（截至 2026-11-01）：

- **30 个分类**，累计收录 **5368 个 skills**（按分类页条目实数统计，官方标注合计 5370）
- 系列自 **2026-03-25** 第一篇（同样是 ai-and-llms）起步，第二轮以编号第 30 期收尾

分类体量分布，头部集中得吓人：

| 梯队 | 分类 | 条目数 | 占比 |
| --- | --- | --- | --- |
| 超巨 | coding-agents-and-ides | 1200 | 22.4% |
| 超巨 | web-and-frontend-development | 925 | 17.2% |
| 第一梯队 | devops-and-cloud | 392 | 7.3% |
| 第一梯队 | search-and-research | 352 | 6.6% |
| 第一梯队 | browser-and-automation | 320 | 6.0% |
| 第二梯队 | productivity / ai-and-llms / cli-utilities / image-video / git | 166–204 | 各 3–4% |
| 长尾 | ios-macos(29) / self-hosted(33) / gaming(35) / clawdbot-tools(36) 等 | 29–45 | 各 <1% |

**前两个分类吃掉全库近 40%**，前十吃掉约 80%——典型的幂律分布。

## 二、逛完 9000+ 条目（两轮）之后的五个观察

### 1. 这是"给编码 Agent 用的生态"，不是"通用助手生态"

coding-agents-and-ides（1200）+ web 前端（925）+ devops（392）+ git（166）加起来超过 2600 条，一半的库在围绕"写代码的 Agent"转。OpenClaw 社区的主力用户画像是开发者，这不是秘密。

### 2. 串门是常态，分类只是"大致方向"

每期写概述都要先"挤水分"：ai-and-llms 里混着 42 个加密货币交易工具（约占 23%），web 前端里混着大量运维和 CLI 工具，shopping 里混着比价爬虫。**用分类当索引用，别当真理**——找 skill 时顺路翻两个相邻分类，常有惊喜。

### 3. 社区在同一批问题上反复造轮子

卷得最厉害的赛道：模型路由（14 个）、记忆系统（5+ 个）、去 AI 味写作（3+ 个）、Solana/Pump.fun 工具（10+ 个）。同一个问题十种解法是好事，但识别"哪个能活下来"比"找一个"更重要。判断标准也很朴素：描述是否具体到可执行、依赖是否清楚、作者是否自己也在用。

### 4. 中等体量分类的"命中率"反而最高

反而是 30–110 条的第二梯队——语音转录（45）、交通（110）、PDF 文档（110）、笔记 PKM（71）——几乎每期都能选出四五星。原因不难理解：这些领域问题边界清晰，skill 做的是"经验固化"而非"能力幻想"。**tfl（伦敦地铁）、markdown-converter 这类工具型 skill，拿出来就能用。**

### 5. 最好的 skill 都在解决"上一次失败"

无论是 anti-slop-design 把"不要 AI 味"写成可执行规范，还是 anti-injection-skill 把注入攻击的教训变成多层防御——高价值 skill 的共同点是：**作者吃过这个亏，然后把亏变成了规则**。API 包装类的 skill 会随着官方支持而过时，经验类的不会。

## 三、二轮五星全明星（10 个）

从第二轮 30 期的四五星推荐里，按"跨领域能力"选出这 10 个（每个都核对过存在于对应分类清单）：

| # | Skill | 分类 | 干什么 |
| --- | --- | --- | --- |
| 1 | [agent-memory](https://github.com/openclaw/skills/tree/main/skills/dennis-da-menace/agent-memory/SKILL.md) | ai-and-llms | Agent 持久记忆，从玩具到助手的分水岭 |
| 2 | [anti-injection-skill](https://github.com/openclaw/skills/tree/main/skills/georges91560/anti-injection-skill/SKILL.md) | ai-and-llms | 提示注入多层防御，放飞 Agent 前的安全带 |
| 3 | [next-best-practices](https://github.com/openclaw/skills/tree/main/skills/tuanvidev/next-best-practices/SKILL.md) | web-frontend | Next.js 官方最佳实践注入，分类顶流 |
| 4 | [lb-tailwindcss-skill](https://github.com/openclaw/skills/tree/main/skills/leonaaardob/lb-tailwindcss-skill/SKILL.md) | web-frontend | Tailwind 文档包，专治 API 幻觉 |
| 5 | [anti-slop-design](https://github.com/openclaw/skills/tree/main/skills/kjaylee/anti-slop-design/SKILL.md) | web-frontend | 把"不要 AI 味"写成可执行设计规范 |
| 6 | [stack-scaffold](https://github.com/openclaw/skills/tree/main/skills/guifav/stack-scaffold/SKILL.md) | web-frontend | 锁死技术选型的脚手架 |
| 7 | [markdown-converter](https://github.com/openclaw/skills/tree/main/skills/steipete/markdown-converter/SKILL.md) | pdf-documents | PDF/HTML/DOCX → Markdown，Agent 的文档输入口 |
| 8 | [tfl](https://github.com/openclaw/skills/tree/main/skills/brianleach/tfl/SKILL.md) | transportation | Transport for London 实时查询，工具型 skill 的典范 |
| 9 | [llmfit](https://github.com/openclaw/skills/tree/main/skills/alexsjones/llmfit/SKILL.md) | ai-and-llms | 本地硬件检测 + 本地模型推荐 |
| 10 | [llmcouncil-router](https://github.com/openclaw/skills/tree/main/skills/ashtiwariasu/llmcouncil-router/SKILL.md) | ai-and-llms | 模型评委会投票路由，多模型时代必修课 |

> 注：第 3–6 项的作者路径以仓库实际为准（上述链接在第二轮第 29 期文中即已核对通过）。

## 四、如果只装 5 个：新手最小集

不想折腾、只想立刻变得更能干？按这个顺序装：

1. **agent-memory** —— 先让 Agent 记住你和你的项目，一切协作的地基；
2. **markdown-converter** —— 打通"喂文档"的通道，Agent 处理外部信息的性价比之王；
3. **anti-injection-skill** —— 在它开始读网页、收邮件之前装好；
4. **next-best-practices**（如果你写 Next.js）或对应技术栈的 lb-\* 文档包 —— 让代码产出直接上一个台阶；
5. **agentpulse** 或任意成本监控 —— 最后一个装，但最该早装：先看账单，再谈优化。

## 五、结语

30 期里最大的收获不是任何单个 skill，而是一个判断框架：**拿到一个 skill，先看它是在"包装 API"还是在"固化经验"**。前者三个月后可能失效，后者会随着你的使用越来越准。

系列二轮到此收官。仓库还在以每天十几条的速度生长，等值得讲的新东西攒够了，再开新篇。

感谢追更。
