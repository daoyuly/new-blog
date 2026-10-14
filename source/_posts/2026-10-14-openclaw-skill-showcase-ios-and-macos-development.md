---
title: OpenClaw Skill 每日推荐 - iOS 与 macOS 开发
date: 2026-10-14 11:30:00
tags: [openclaw, skill, ios-and-macos-development]
categories: [技术推荐]
---

# OpenClaw Skill 每日推荐：iOS 与 macOS 开发（29 个 Skills）

> OpenClaw Skill 每日推荐第 15 期。今天进入 Apple 开发者的主场 —— **ios-and-macos-development** 分类，共收录 29 个 skills，覆盖从文档查询、SwiftUI 代码审查、性能剖析，到模拟器自动化、打包分发的完整 Apple 开发工作流。

## 今日分类概述

这个分类是 30 个分类中"含金量"最高的之一：大量 skills 来自 iOS 社区的资深开发者（比如 steipete —— [PSPDFKit](https://pspdfkit.com) 创始人，以及 dimillian —— 开源客户端 [Ice Cubes](https://github.com/Dimillian/IceCubesApp) 的作者）。它们的特点是**把专家的调试经验、坑点清单直接编码成 agent 可执行的规则**，而不是简单的命令行包装。

分类内 skills 大致分为五类：

| 子方向 | 代表 Skills |
|--------|------------|
| 文档与学习 | apple-docs |
| 代码质量 | swift-concurrency-expert、swiftui-view-refactor、swiftui-performance-audit |
| 测试自动化 | ios-simulator、swiftfindrefs |
| 性能分析 | instruments-profiling |
| 构建分发 | macos-spm-app-packaging、sfsymbol-generator |
| macOS 运维 | agent-defibrillator、brew-audit、toolguard-daemon-control |

---

## 精选 Skill 详解

### 1️⃣ apple-docs —— 口袋里的 Apple 文档库

**链接**：[github.com/openclaw/skills/.../apple-docs](https://github.com/openclaw/skills/tree/main/skills/thesethrose/apple-docs/SKILL.md)
**推荐指数**：⭐⭐⭐⭐⭐

**核心功能**：一条命令查询 Apple 开发者文档、框架 API 和 **2014–2025 全部 1260+ 个 WWDC 视频**（离线内置，35MB），无需安装，开箱即用。

```bash
# 搜索文档与 API 符号
apple-docs search "SwiftUI animation"
apple-docs symbols "UITableViewDelegate"

# 查平台兼容性 —— 避免"这个 API iOS 几才有"的反复搜索
apple-docs platform "VNRecognizeTextRequest"

# 找废弃 API 的官方替代品
apple-docs similar "UIPickerView"

# 直接看 WWDC 会话的文字稿和示例代码
apple-docs wwdc-video 2024-100
```

**实用场景**：写代码时问 agent "SwiftUI 的 `.scrollIndicators` 支持 iOS 15 吗？"，它会直接调 `platform` 命令给出准确答案，而不是凭训练数据幻觉。内置 30 分钟文档缓存 + 10 分钟搜索缓存，响应很快。

**技术实现**：封装了一个 Apple Docs MCP Server，用原生 `fetch` 拉取 developer.apple.com 数据；WWDC 视频元数据离线打包。零外部依赖（只需 node）。

**为什么五星**：它解决的是所有 Apple 开发者每天都会遇到的问题，且数据的准确性直接来自官方文档而非模型记忆。

---

### 2️⃣ swift-concurrency-expert —— Swift 6 并发错误的"老中医"

**链接**：[github.com/openclaw/skills/.../swift-concurrency-expert](https://github.com/openclaw/skills/tree/main/skills/steipete/swift-concurrency-expert/SKILL.md)
**推荐指数**：⭐⭐⭐⭐⭐

**核心功能**：针对 **Swift 6.2+** 的并发合规问题（actor 隔离、Sendable 安全、数据竞争检查），提供系统化的审查与最小改动修复方案。这个 skill 来自 Thomas Ricouard（Dimillian）的生产实践，被 steipete 收录维护。

**核心工作流**：

```
1. Triage：捕获编译器诊断，识别当前 actor 上下文
   （@MainActor / actor / nonisolated），确认 UI-bound 还是后台任务
2. Apply smallest safe fix：优先选择不改变行为的修复
   - UI 相关类型 → 标注 @MainActor
   - 协议遵循 → 隔离遵循（extension Foo: @MainActor SomeProto）
   - 全局/静态状态 → 用 @MainActor 保护或移入 actor
   - 后台耗时工作 → 移入 @concurrent async 函数
   - Sendable 报错 → 优先不可变值类型，慎用 @unchecked Sendable
```

**实用场景**：把几十条 "Region 'x' is isolated to global actor 'MainActor'" 的编译报错直接扔给 agent，它不会像普通 LLM 那样建议无脑加 `@unchecked Sendable` 糊弄过去，而是按 actor 模型给出结构性正确、改动最小的方案。附带的 `references/swift-6-2-concurrency.md` 是一份浓缩版 Swift 6.2 并发变更清单。

**为什么五星**：Swift 6 严格并发是当前 iOS 迁移的最大痛点，市面上几乎没有第二份这么聚焦的 agent 规则集。

---

### 3️⃣ ios-simulator —— 让 agent 亲手"用"你的 App

**链接**：[github.com/openclaw/skills/.../ios-simulator](https://github.com/openclaw/skills/tree/main/skills/tristanmanchester/ios-simulator/SKILL.md)
**推荐指数**：⭐⭐⭐⭐⭐

**核心功能**：为 AI agent 设计的 iOS Simulator 自动化 CLI，封装 `xcrun simctl`（设备/应用管理）+ Facebook 的 `idb`（**无障碍树**检查 + 语义化 UI 操作）。

```bash
# 安装启动 App
node ios-sim.mjs app install --app path/to/MyApp.app
node ios-sim.mjs app launch --bundle-id com.example.MyApp

# 语义化 UI 操作 —— 按"按钮文字"点击，而非死板坐标
node ios-sim.mjs ui tap --query "Log in"
node ios-sim.mjs ui type --text "hello world"

# 截图 + 查看无障碍树
node ios-sim.mjs screenshot --out artifacts/screen.png
node ios-sim.mjs ui summary
```

**实用场景**：
- **自动化 E2E 测试**：让 agent 自己装 App、点按钮、填表单、截图验证，完整跑一遍登录流程；
- **推送测试**：`push` 命令直接向模拟器注入远程推送；
- **权限测试**：`privacy` 命令一键授予/重置相机、定位等权限。

**技术实现**：Node 单文件 CLI，默认输出**单行 JSON**（省 token，这是为 agent 优化的细节），命令按安全等级分三档 —— `erase`/`delete` 这类危险操作必须显式加 `--yes` 才执行。

**为什么五星**：simctl + idb 的组合让 agent 拥有了"眼睛和手指"，这是把 AI agent 接入 iOS 测试闭环的关键基础设施。

---

### 4️⃣ instruments-profiling —— 性能调优的避坑手册

**链接**：[github.com/openclaw/skills/.../instruments-profiling](https://github.com/openclaw/skills/tree/main/skills/steipete/instruments-profiling/SKILL.md)
**推荐指数**：⭐⭐⭐⭐

**核心功能**：教授 agent 正确使用 `xctrace` 命令行做 macOS/iOS 应用性能剖析 —— 模板选择、二进制定位、trace 导出，以及大量**只有踩过坑才知道的细节**。

```bash
# 录制 Time Profiler（启动模式）
xcrun xctrace record --template 'Time Profiler' --time-limit 60s \
  --output /tmp/App.trace --launch -- /path/To/App.app/Contents/MacOS/App

# 导出原始采样数据，供脚本离线聚合
xcrun xctrace export --input /tmp/App.trace --toc
```

**实用场景**：这个 skill 最值钱的是 **gotchas 清单**：
- Instruments 经常 profile 到错误的 App（LaunchServices 解析到了 `/Applications` 里的旧版本）→ 必须用**直接二进制路径**启动，并在录制后确认进程路径；
- `xcrun xctrace --help` 不是合法子命令，得用 `xcrun xctrace help record`；
- XML 导出文件巨大，应该用 XPath 过滤后离线处理。

**为什么四星**：性能剖析是高频需求，但这类知识 Google 也不好搜 —— 把"专家肌肉记忆"固化成 skill 正是 agent skills 的精髓。

---

### 5️⃣ macos-spm-app-packaging —— 不开 Xcode 也能发 macOS App

**链接**：[github.com/openclaw/skills/.../macos-spm-app-packaging](https://github.com/openclaw/skills/tree/main/skills/dimillian/macos-spm-app-packaging/SKILL.md)
**推荐指数**：⭐⭐⭐⭐

**核心功能**：完整脱离 Xcode 工程，从零脚手架一个 **SwiftPM-based macOS App**，一路打通构建、打包 `.app` bundle、签名、公证（notarization）、Sparkle 更新源生成。

```bash
# 两步工作流
1. Bootstrap：复制模板，改 Package.swift / APP_NAME / BUNDLE_ID
2. 构建发布链：
   swift build && swift test      # 构建测试
   Scripts/package_app.sh         # 打包 .app + 签名
   Scripts/sign-and-notarize.sh   # 公证 + staple + zip
   Scripts/make_appcast.sh        # 生成 Sparkle appcast
```

**实用场景**：做命令行工具的 GUI 壳、独立小工具、开源软件分发 —— 尤其适合"我只想写 Swift，不想伺候 Xcode 项目文件"的开发者。附带 `build_icon.sh`（从 Icon Composer 文件生成 .icns）这种贴心细节。

**为什么四星**：对特定人群（SwiftPM 派）是神器，但 Xcode 工程派用不上，故四星。

---

## 应用场景总结

把这五个 skills 串起来，就是一条**由 agent 驱动的完整 Apple 开发闭环**：

```
┌─ 写代码前：apple-docs 查 API 兼容性，避免踩废弃 API
├─ 写代码时：swift-concurrency-expert 审查并发安全，swiftui-view-refactor 优化视图
├─ 测试阶段：ios-simulator 自动化跑 UI 流程 + 截图回归
├─ 性能阶段：instruments-profiling 定位卡顿热点
└─ 发布阶段：macos-spm-app-packaging 打包公证 + Sparkle 自动更新
```

**给 Apple 开发者的三条建议**：

1. **组合安装效果最好**。`apple-docs` + `swift-concurrency-expert` 是写代码的"左手右手"；`ios-simulator` + `instruments-profiling` 是测试调优的"左右护法"。
2. **让 agent 用语义化 UI 操作而不是坐标**。`ios-simulator` 的 `ui tap --query "登录"` 基于 accessibility tree，比截图 + 坐标点击稳定得多 —— 顺手还检查了 App 的无障碍合规。
3. **警惕 expert 类 skills 的版本时效**。Swift 每年大版本迭代，Swift 6.2 的并发规则未必完全适用于 6.1 的老项目，使用时留意 skill 内标注的版本范围。

## 推荐指数排名

| 排名 | Skill | 推荐指数 | 一句话理由 |
|------|-------|---------|-----------|
| 🥇 | apple-docs | ⭐⭐⭐⭐⭐ | 离线 1260+ WWDC 视频 + 官方文档直查，准确性有保障 |
| 🥇 | swift-concurrency-expert | ⭐⭐⭐⭐⭐ | Swift 6.2 迁移痛点的专家级解药 |
| 🥇 | ios-simulator | ⭐⭐⭐⭐⭐ | agent 测试 iOS App 的"眼睛和手指" |
| 4 | instruments-profiling | ⭐⭐⭐⭐ | 珍贵的性能调优避坑清单 |
| 5 | macos-spm-app-packaging | ⭐⭐⭐⭐ | SwiftPM 派的全链路发布方案 |

> 📅 明日预告：第 16 期 —— **marketing-and-sales**（营销与销售），看看 agent 能不能帮你写文案、找客户。
