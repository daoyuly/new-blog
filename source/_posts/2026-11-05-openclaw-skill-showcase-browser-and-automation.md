---
title: OpenClaw Skill 每日推荐 - 浏览器自动化（browser-and-automation）
tags:
  - openclaw
  - skill
  - browser-and-automation
categories:
  - 技术推荐
abbrlink: 47291
date: 2026-11-05 11:30:00
---

# OpenClaw Skill 每日推荐 - 浏览器自动化

> 「OpenClaw Skill 每日推荐」第 32 期，**第三轮第 2 期**。继续从 [awesome-openclaw-skills](https://github.com/openclaw/skills)（全库 5300+ 条目、30 个分类）中每天取一个分类，精选代表性 skill 深入介绍。今天进入 **浏览器自动化（Browser & Automation）**——全库最大的分类，320 个 skills。如果说上一期的 Apple Apps & Services 是教 Agent「摸你的 Mac」，这一期就是教 Agent「替你上网」：从无头浏览器、反检测环境，到直接替你下单、发帖、盯盘的登录态操作，Web 这层「没有 API 的世界」正在被 Agent 一点点啃下来。

## 今日分类概述

Browser & Automation 收录 **320 个 skills**，是 30 个分类里体量最大的一个。数量大，主题也杂，但粗看下来能理出几条清晰的主线：

- **通用浏览器控制层**：`agent-browser`（Rust 无头 CLI）、[browser-use](https://github.com/openclaw/skills/tree/main/skills/shawnpana/browser-use/SKILL.md)（云端浏览器）、`mcp-chrome`（MCP 协议控 Chrome）、`super-browser`（号称融合 8 个顶级浏览器 skill 的框架）——这一层解决「Agent 怎么拿到一个可操作的浏览器」。
- **方法论与策略**：`browser-ladder`（自动化手段升级阶梯），不提供工具，提供决策框架。
- **反检测与多账号**：`camoufox`（反指纹 Firefox）、`stealthy-google-search`、`multiloginx`（浏览器配置文件管理）——对抗 Cloudflare 和风控的军备竞赛。
- **登录态平台操作**：[x-automation](https://github.com/openclaw/skills/tree/main/skills/nightfullstar/x-automation/SKILL.md)（绕开每月 200 美元的 X API 直接发帖）、`weibo-manager`、`line-oa`、`amazon-shopper`、`raiffeisen-elba`（网上银行）——风险与收益都最高的那一档。
- **数据采集**：`instagram-scraper`、`youtube-scrapper`、`tiktok-crawling`、`sg-property-scraper` 等一众垂直爬虫。
- **邻近地带**：`mac-use`、`linux-desktop` 这类桌面 GUI 自动化也归在这个分类下，严格说它们操作的不是浏览器，但「看屏幕—点击—输入」的动作模型是一样的。

一个值得注意的趋势：纯粹的「抓页面」正在被两层东西夹击——上面是官方 API 和结构化数据源（能用 API 就别爬），下面是 RSS / Markdown 化的阅读器。浏览器自动化真正的不可替代场景，是**需要登录态、需要交互、页面又是为人类设计**的那部分 Web。

## 精选 Skill 详解

### 1. browser-ladder —— 自动化的「升级阶梯」⭐⭐⭐⭐✨

**链接**：[ktpriyatham/browser-ladder](https://github.com/openclaw/skills/tree/main/skills/ktpriyatham/browser-ladder/SKILL.md)

这个 skill 的定位很特别：它不给你新的浏览器，而是给你一套**决策顺序**——名字里的 ladder（梯子）就是字面意思：先站在最低、最便宜的台阶上，只有失败才往上爬。一个典型的阶梯大致是这样的：

1. **内置 fetch / 静态请求**——大多数页面根本不需要浏览器；
2. **无头浏览器渲染**——JS 渲染的页面再上这个；
3. **隐身 / 反检测浏览器**——遇到风控、验证码墙时升级；
4. **云端浏览器或付费服务**——规模化的最后手段。

它解决的是 Agent 浏览器自动化里最常见的浪费：动不动就开一个 Chromium 实例去抓一个 `curl` 就能拿到的页面。把这个 skill 装上，等于给 Agent 装了「成本意识」——每次上网任务先问一句：这真的需要浏览器吗？

**适用场景**：任何需要批量抓取的工作流前置检查；给团队定浏览器自动化的技术选型规范；甚至可以当 Agent 的通用「任务分解」习惯来用。

**推荐指数**：⭐⭐⭐⭐✨（4.5/5）——不重、不贵、改变的是思考方式，这类 skill 的长期价值往往最高。

### 2. agent-browser —— Rust 写的无头浏览器 CLI ⭐⭐⭐⭐✨

**链接**：[thesethrose/agent-browser](https://github.com/openclaw/skills/tree/main/skills/thesethrose/agent-browser/SKILL.md)

清单里的描述很短：「A fast Rust-based headless browser automation CLI」。三个关键词都踩在点上：**Rust**（启动快、资源占用低，Agent 频繁开关浏览器实例时差距会被放大）、**headless**（不渲染 UI，服务器和 CI 里都能跑）、**CLI 形态**（Agent 天然擅长调命令行，比维护一套浏览器进程的会话状态省心得多）。

对 OpenClaw 用户来说，这类 skill 的实际用法就是自然语言派活：

> 「用 agent-browser 打开 xxx 页面，把价格表格抓下来存成 CSV，变化超过 5% 就提醒我。」

比起 Playwright 全家桶，CLI 工具的优势是**可组合**：它能进 shell 脚本、能接 cron、能被管道串起来，正好契合 OpenClaw 的 exec / heartbeat 工作流。

**适用场景**：定时盯页面变化（价格、库存、抢票开售）；CI 里做冒烟测试；大批量页面的结构化抽取。

**推荐指数**：⭐⭐⭐⭐✨（4.5/5）——性能取向的基建型工具，配合 cron 食用最佳。

### 3. nova-act —— 请亚马逊的模型来操作浏览器 ⭐⭐⭐⭐

**链接**：[zouchaoqun/nova-act](https://github.com/openclaw/skills/tree/main/skills/zouchaoqun/nova-act/SKILL.md)

Amazon Nova Act 是 AWS 推出的浏览器自动化 SDK，思路和「让 LLM 直接看 DOM」不同：你用 Python 写一个脚本框架，把高阶意图交给 `nova.act()` 去执行。skill 的描述是「Write and execute Python scripts using Amazon Nova Act for AI-powered browser automation tasks like flight...」——航班查询、订票这类多步长流程是它的主场。上游 SDK 的典型写法长这样：

```python
from nova_act import NovaAct

with NovaAct(starting_page="https://www.example-travel.com") as nova:
    nova.act("搜索下周六北京到东京的单程航班，选最便宜的直飞")
    nova.act("把前三个结果的截图保存下来")
```

它的价值在于**确定性**：脚本骨架是你写的（步骤、断言、落盘位置都是确定的），只有每一步里的模糊操作交给模型。出问题时你知道是哪一步挂了，而不是面对一个黑盒 agent 的第 47 次重试。

**适用场景**：机票/酒店比价下单流程；电商批量操作；任何「步骤明确但每步交互琐碎」的流程。

**推荐指数**：⭐⭐⭐⭐（4/5）——适合愿意写几行 Python 的人，纯自然语言用户会觉得绕。

### 4. camoufox —— 给浏览器做「化装」⭐⭐⭐⭐

**链接**：[goodgoodjm/camoufox](https://github.com/openclaw/skills/tree/main/skills/goodgoodjm/camoufox/SKILL.md)

Camoufox 是一个基于 Firefox 的反检测浏览器上游项目，这个 skill 把它包装成 OpenClaw 可用的能力。普通无头浏览器有一堆指纹破绽：`navigator.webdriver` 标记、Canvas 指纹、字体列表、WebGL 参数、时区与 IP 不匹配……反爬系统靠这些判断「这是机器人」。Camoufox 在浏览器层面做了指纹伪装，上游 API 是 Playwright 兼容的，大致长这样：

```python
from camoufox.sync_api import Camoufox

with Camoufox(humanize=True) as browser:
    page = browser.new_page()
    page.goto("https://目标站点")
```

说清楚边界：它解决的是「被误伤的合规采集」——比如你自己的多店铺后台、需要登录的数据看板被风控误拦。**不是**让你去大规模薅别人的数据，那种场景该找法务而不是找 skill。

**适用场景**：自有站点的自动化测试（验证风控不误伤）；登录态数据面板的定期导出；需要长期会话保持的监控任务。

**推荐指数**：⭐⭐⭐⭐（4/5）——专业场景下的硬通货，但依赖上游项目维护节奏，Firefox 内核更新要跟得上。

### 5. weibo-manager —— 用 Puppeteer 替你运营微博 ⭐⭐⭐✨

**链接**：[hmyaoyuan/weibo-manager](https://github.com/openclaw/skills/tree/main/skills/hmyaoyuan/weibo-manager/SKILL.md)

「Control Weibo via Puppeteer (Unofficial API)」——不走微博开放平台（那个 API 门槛和权限大家都懂），直接用浏览器模拟登录态操作。对中文用户来说这是这个大分类里少见的本土化面孔，实际能派上的用场很具体：定时发内容、抓自己账号的数据、监控关键词、管理评论互动。

但要泼两盆明确的冷水：

- **Unofficial** 意味着页面一改版选择器就可能失效，这类 skill 的有效期以「周」计，要有心理预期；
- **封号风险真实存在**，操作频率、行为模式都克制一点，重要账号别交给它。

同类的登录态操作 skill 在这个分类里还有很多（`line-oa`、`meta-fb-inbox`、`x-automation`），它们共享同样的收益和同样的风险，用法心智可以互相迁移。

**适用场景**：个人博主的内容排期；企业新媒体的辅助运营（小号、测试号先行）。

**推荐指数**：⭐⭐⭐✨（3.5/5）——需求真实存在，但维护成本和风险都写在了「Unofficial」这个词里。

## 应用场景总结

把 320 个 skills 按「你想干什么」重新归置一遍，大概四条路：

| 你要做的事 | 值得看的 skills | 一句话建议 |
|---|---|---|
| 定时盯页面变化 | `agent-browser`、`browser-ladder`、`open-chrome-tabs` | 能 fetch 就别开浏览器 |
| 平台运营/代操作 | `x-automation`、`weibo-manager`、`amazon-shopper`、`line-oa` | 小号先行，频率克制 |
| 批量数据采集 | `instagram-scraper`、`youtube-scrapper`、`tiktok-crawling` | 先查有没有官方 API |
| 登录态面板/风控误伤 | `camoufox`、`multiloginx`、`raiffeisen-elba` | 银行类想清楚再用 |

几个跨场景的好东西顺带一提：[open-chrome-tabs](https://github.com/openclaw/skills/tree/main/skills/mindsocket/open-chrome-tabs/SKILL.md) 能直接读你 Chrome 当前开着的标签页——「把我现在开着的这堆页面总结一下」是最低门槛的浏览器自动化入门；[portfolio-tracker](https://github.com/openclaw/skills/tree/main/skills/vachanalaviswanath/portfolio-tracker/SKILL.md) 用浏览器自动化盯 Yahoo Finance 持仓；还有 [pipelock](https://github.com/openclaw/skills/tree/main/skills/luckypipewrench/pipelock/SKILL.md)——一个拦截 Agent 出站请求的扫描代理，专抓凭证泄漏、SSRF 和提示注入，浏览器自动化玩得越凶越该配一个。

## 推荐指数排名

1. **browser-ladder** ⭐4.5 —— 方法论型选手，教 Agent 省钱省力
2. **agent-browser** ⭐4.5 —— Rust 性能派基建，cron 最佳拍档
3. **nova-act** ⭐4 —— 亚马逊出品，长流程自动化的确定性方案
4. **camoufox** ⭐4 —— 反检测刚需场景的硬通货
5. **weibo-manager** ⭐3.5 —— 本土化稀缺，但 Unofficial 的代价要认

## 实用建议

- **先 API、后静态、再浏览器、最后反检测**。每升一级，维护成本和被封风险都翻倍。browser-ladder 的阶梯思维值得刻进每个自动化工作流。
- **登录态是资产，密码不是工具**。让 Agent 复用本机浏览器 profile 或 cookie，而不是把密码写进对话。跑大量出站请求前，配一个 `pipelock` 这类的扫描代理兜底。
- **给 Unofficial 的东西留退路**。页面改版会让你精心调好的自动化一夜失效，关键流程保留人工兜底，别让「自动」变成「单点故障」。
- **从只读操作开始**。读标签页、抓数据、截图这些零风险操作跑顺了，再考虑让 Agent 替你「动手」。

明天进入 **calendar-and-scheduling（日历与调度）**——让 Agent 学会看日程、约时间。
