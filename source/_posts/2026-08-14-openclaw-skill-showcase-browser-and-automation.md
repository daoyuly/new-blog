---
title: OpenClaw Skill 每日推荐 - 浏览器自动化
date: 2026-08-14 11:30:00
tags:
  - openclaw
  - skill
  - browser-and-automation
categories:
  - 技术推荐
---

# OpenClaw Skill 每日推荐 - 浏览器自动化

> 📅 2026年8月14日 | 分类：Browser & Automation | 共 320 个 Skills

## 分类概述

浏览器自动化是 OpenClaw 生态中最大的技能分类之一，拥有 **320 个 Skills**。这个分类涵盖了从网页抓取、表单填写、截图测试，到反检测浏览、macOS 桌面控制、云端浏览器集群等各种自动化场景。无论你是想做数据采集、自动化测试，还是构建 AI Agent 的浏览器交互能力，这里都有对应的工具。

今天精选 5 个最具代表性的 Skills，从不同维度展示浏览器自动化的能力边界。

---

## 🲝 精选 Skill 详解

### 1. Super Browser — 终极浏览器自动化框架

- **GitHub**: [heldinhow/super-browser](https://github.com/openclaw/skills/tree/main/skills/heldinhow/super-browser/SKILL.md)
- **推荐指数**: ⭐⭐⭐⭐⭐

**核心功能**：将 8 个顶级浏览器技能融合为一个统一框架，支持本地和云端两种模式，自动选择最优环境。

**技术实现**：
- 环境自动检测：有 API Key 时使用 Browserbase 云端浏览器，否则降级到本地 Chrome/Chromium
- 完整的会话管理：创建/销毁会话、使用 Profile 持久化登录状态、连接已有标签页
- 核心动作矩阵：navigate、click、type、snapshot、screenshot、pdf 一应俱全
- 融合了 agent-browser（评分 3.672）、browser-automation（3.590）、browser-use（3.538）等高评分技能

**实用场景**：
```bash
# 快速自动化
browser open url="https://example.com"
browser snapshot
browser click ref="login-btn"

# 云端会话 - 大规模并行
browser session create --provider=browserbase
browser task run --goal="Find pricing page"

# Profile 管理 - 保持登录态
browser profile create --name=shopping
browser profile connect --name=shopping
```

**推荐理由**：如果你只安装一个浏览器自动化技能，选这个。它覆盖了绝大多数使用场景，设计上兼顾了易用性和扩展性。

---

### 2. Browser Use — 持久化浏览器自动化 CLI

- **GitHub**: [shawnpana/browser-use](https://github.com/openclaw/skills/tree/main/skills/shawnpana/browser-use/SKILL.md)
- **推荐指数**: ⭐⭐⭐⭐⭐

**核心功能**：基于 `browser-use` CLI 的持久化浏览器自动化技能，支持跨命令保持会话状态，支持 Chromium、真实 Chrome、远程云端三种模式。

**技术实现**：
- **持久化会话**：浏览器在命令间保持打开，支持复杂的多步工作流
- **三种浏览器模式**：
  - `chromium`：快速、隔离、默认无头
  - `real`：使用真实 Chrome，支持 Profile 登录态复用
  - `remote`：云端浏览器，支持代理
- **Cookie 管理**：完整的导出/导入/同步能力
- **Python 执行环境**：内嵌 Python 命名空间，变量跨命令持久化
- **云端隧道**：通过 Cloudflare 隧道暴露本地开发服务器

**实用场景**：

```bash
# 认证浏览 - 复用已有登录态
browser-use -b real profile list
browser-use --browser real --profile "Default" open https://github.com
# 直接已登录状态，无需重新认证

# 并行云端任务
browser-use -b remote run "Research competitor A pricing"
browser-use -b remote run "Research competitor B pricing"
browser-use -b remote run "Research competitor C pricing"
# 每个任务独立会话，并行执行

# 本地开发服务器暴露
npm run dev &                    # localhost:3000
browser-use tunnel 3000          # → https://abc.trycloudflare.com
browser-use --browser remote open https://abc.trycloudflare.com
```

**推荐理由**：Profile 同步功能非常实用——可以只同步特定域名的 Cookie 而非整个 Profile，在安全和便利之间取得了很好的平衡。云端 Agent 任务管理也很成熟，支持异步轮询和实时查看。

---

### 3. Camoufox — 反检测浏览器自动化

- **GitHub**: [goodgoodjm/camoufox](https://github.com/openclaw/skills/tree/main/skills/goodgoodjm/camoufox/SKILL.md)
- **推荐指数**: ⭐⭐⭐⭐

**核心功能**：基于 Firefox 的反检测浏览器自动化工具，专为 X/Twitter、Naver 等严格反爬网站设计。

**技术实现**：
- 基于 Camoufox（Firefox 内核），天生与 Chrome/Playwright 有别
- OS/浏览器指纹伪装：`os='linux'` 必须匹配服务器实际 OS
- 人类化鼠标移动：`humanize=True` 模拟真实用户行为
- 持久化上下文：`persistent_context=True` + `user_data_dir` 保持会话
- **关键注意**：`headless` 必须设为 `False`，无头模式会被检测到

**实用场景**：

```python
from camoufox.sync_api import Camoufox

with Camoufox(
    headless=False,           # 必须为 False
    os='linux',               # 必须匹配服务器 OS
    humanize=True,
    persistent_context=True,
    user_data_dir='~/.openclaw/camoufox-profile'
) as browser:
    page = browser.new_page()
    page.goto('https://x.com')
    # 使用标准 Playwright API
```

```bash
# 首次访问需要手动过 CAPTCHA
DISPLAY=:1 python3 scripts/login_session.py https://site.com/login
# 通过 VNC 解决验证码，之后自动化运行
```

**推荐理由**：当你遇到 "检测到自动化工具" 这类问题时，Camoufox 是终极解决方案。指纹伪装 + 人类化行为 + Firefox 内核的组合，能有效绕过大多数反爬检测。

---

### 4. Mac Use — macOS GUI 可视化控制

- **GitHub**: [kekejun/mac-use](https://github.com/openclaw/skills/tree/main/skills/kekejun/mac-use/SKILL.md)
- **推荐指数**: ⭐⭐⭐⭐

**核心功能**：通过「截图 → 识别元素 → 点击 → 验证」循环控制 macOS 上任何 GUI 应用，不限于浏览器。

**技术实现**：
- 使用 **Apple Vision OCR** 检测屏幕上所有文本元素
- 生成带编号标注的截图：绿色边框 + 蓝色编号
- 1000×1000 画布坐标系，精确定位
- 支持点击、输入、滚动、按键、拖拽等操作
- 输入使用剪贴板粘贴（Cmd+V），完美支持中文等 Unicode 文本

**实用场景**：

```bash
# 控制微信小程序点外卖
python3 mac_use.py list                          # 列出所有窗口
python3 mac_use.py screenshot 微信 --id 41266     # 截图+标注
# → 返回: [{num: 1, text: "搜索", at: [500, 200]}, ...]

python3 mac_use.py clicknum 1                     # 点击"搜索"
python3 mac_use.py type --app 微信 "炸鸡"          # 输入搜索词
python3 mac_use.py key --app 微信 return           # 回车
python3 mac_use.py screenshot 微信 --id 41266     # 查看结果
python3 mac_use.py clicknum 5                     # 选餐厅
```

**推荐理由**：突破了"浏览器自动化"的边界——能控制任何 macOS 应用。对于微信小程序、原生应用等无法通过 Web API 交互的场景，这是最佳方案。Apple Vision OCR 的识别精度很高，编号点击的方式也很直观。

---

### 5. MCP Chrome — Chrome 浏览器 MCP 协议控制

- **GitHub**: [femto/mcp-chrome](https://github.com/openclaw/skills/tree/main/skills/femto/mcp-chrome/SKILL.md)
- **推荐指数**: ⭐⭐⭐⭐

**核心功能**：通过 MCP 协议直接控制你正在使用的 Chrome 浏览器，复用已有登录态、书签和扩展。

**技术实现**：
- **Chrome 扩展 + Native Bridge** 架构：扩展注入页面，Native Bridge 提供 MCP 接口
- 20+ 工具：浏览器管理、截图、内容分析、交互、数据管理、网络监控
- 支持 Streamable HTTP 和 STDIO 两种传输模式
- 多客户端同时连接：Claude Code、Cursor、Kiro 等 MCP 客户端可共享同一个 Chrome

**对比传统 Playwright 方案的优势**：

| 特性 | Playwright MCP | Chrome MCP |
|------|---------------|------------|
| 浏览器实例 | 新进程 | 现有 Chrome |
| 登录状态 | 需重新登录 | 复用已有会话 |
| 用户设置 | 干净环境 | 你的书签/扩展 |
| 启动速度 | 慢 | 即时 |
| 资源占用 | 重 | 轻量 |

**实用场景**：

```json
// 配置 MCP 客户端
{
  "mcpServers": {
    "chrome-mcp-server": {
      "type": "http",
      "url": "http://127.0.0.1:12306/mcp"
    }
  }
}
```

```
# AI 自动操作流程
1. chrome_navigate(url: "https://example.com/login")
2. chrome_get_interactive_elements()  → 找到表单元素
3. chrome_fill_or_select(selector: "#email", value: "user@example.com")
4. chrome_click_element(selector: "button[type=submit]")
5. chrome_screenshot(fullPage: true)  → 验证结果
```

**推荐理由**：最大优势是"零迁移成本"——不需要重新登录、不需要配置新环境，直接接管你正在用的 Chrome。对于需要利用已有登录态的自动化任务（如内部系统操作、社交媒体管理），这是最省心的方案。

---

## 📊 推荐指数排名

| 排名 | Skill | 评分 | 最佳场景 |
|------|-------|------|----------|
| 1 | Super Browser | ⭐⭐⭐⭐⭐ | 通用浏览器自动化首选 |
| 2 | Browser Use | ⭐⭐⭐⭐⭐ | 持久化会话 + 云端并行 |
| 3 | Camoufox | ⭐⭐⭐⭐ | 反爬检测严格的网站 |
| 4 | Mac Use | ⭐⭐⭐⭐ | macOS 原生应用控制 |
| 5 | MCP Chrome | ⭐⭐⭐⭐ | 复用现有 Chrome 登录态 |

---

## 🎯 应用场景总结

### 按需求选择

| 你的需求 | 推荐技能 | 理由 |
|---------|---------|------|
| 通用网页自动化 | Super Browser | 功能最全面，一站式解决 |
| 需要保持登录态 | Browser Use / MCP Chrome | Profile 复用，无需重新认证 |
| 目标网站有反爬 | Camoufox | 指纹伪装 + 人类化行为 |
| 控制 Mac 原生应用 | Mac Use | 突破浏览器边界，控制任意 GUI |
| 并行云端任务 | Browser Use | 云端会话管理成熟 |
| 多 MCP 客户端共享 | MCP Chrome | 原生 MCP 协议支持 |

### 技术选型建议

1. **从 Super Browser 开始**：如果你不确定选哪个，先用它，覆盖面最广
2. **反爬场景加 Camoufox**：当遇到检测拦截时，切换到 Camoufox
3. **macOS 用户加 Mac Use**：处理非浏览器的自动化需求
4. **MCP 生态用户选 MCP Chrome**：如果你已经在用 Claude Code 等 MCP 客户端

### 组合使用

这些技能并非互斥，实际项目中可以组合使用：

```
# 用 MCP Chrome 读取已登录页面内容
# → 用 Camoufox 抓取反爬数据
# → 用 Mac Use 操作本地应用整理数据
# → 用 Browser Use 云端任务并行处理
```

---

## 💡 实用建议

1. **先 observe 再 act**：所有浏览器自动化都遵循"先看后做"原则——先 snapshot/screenshot，再操作
2. **注意 Cookie 安全**：同步 Profile 时尽量按域名同步，避免全量同步泄露敏感会话
3. **云端任务要监控**：使用 `task status` 轮询，如果 cost/duration 停止增长说明任务卡住了
4. **Camoufox 的 headless 必须为 False**：这是反检测的关键，用 Xvfb 虚拟显示器代替
5. **Mac Use 的坐标系统**：1000×1000 画布，原点在左上角，记住这个坐标系才能准确点击

---

## 📌 明日预告

明天将介绍 **Calendar & Scheduling** 分类，涵盖日历管理、会议调度、时间规划等技能。

---

*本文是 OpenClaw Skill 每日推荐系列的第 3 篇，共 30 个分类。*
