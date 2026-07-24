---
title: OpenClaw Skill 每日推荐 - iOS & macOS 开发
tags:
  - openclaw
  - skill
  - ios-and-macos-development
categories:
  - 技术推荐
description: >-
  今天我们来探索 OpenClaw 技能库中的 iOS & macOS 开发 分类。这个分类共包含 29 个技能，涵盖了从 SwiftUI 性能优化、iOS
  模拟器自动化、Swift 并发审查到 macOS 应用打包的完整开发链路。无论...
keywords: 'openclaw, skill, 每日推荐, ios, macos, ios-and-macos-development, 技术推荐'
abbrlink: 25026
date: 2026-07-22 11:30:00
---

# OpenClaw Skill 每日推荐 - iOS & macOS 开发

> 📅 2026-07-22 | 第 15/30 期 | 分类：iOS & macOS Development

今天我们来探索 OpenClaw 技能库中的 **iOS & macOS 开发** 分类。这个分类共包含 **29 个技能**，涵盖了从 SwiftUI 性能优化、iOS 模拟器自动化、Swift 并发审查到 macOS 应用打包的完整开发链路。无论你是独立开发者还是团队协作，这里都有能大幅提升效率的利器。

---

## 🔍 分类概述

iOS & macOS Development 分类面向 Apple 生态开发者，技能覆盖以下关键领域：

- **SwiftUI 开发**：性能审计、视图重构、UI 模式、Liquid Glass 效果
- **Swift 并发**：Swift 6.2+ 并发合规性审查与修复
- **性能分析**：Instruments/xctrace 原生性能剖析
- **模拟器自动化**：simctl + idb 全流程自动化
- **应用打包**：SwiftPM 无 Xcode 项目构建、签名、公证
- **macOS 系统工具**：Homebrew 审计、系统清理、防火墙监控

---

## ⭐ 精选 Skill 详解

### 1. SwiftUI Performance Audit

| 项目 | 详情 |
|------|------|
| **作者** | @steipete |
| **链接** | [GitHub](https://github.com/openclaw/skills/tree/main/skills/steipete/swiftui-performance-audit) |
| **推荐指数** | ⭐⭐⭐⭐⭐ |

**核心功能：** 对 SwiftUI 应用进行端到端的运行时性能审计，从代码审查到 Instruments 追踪分析，提供完整的诊断和修复方案。

**工作流程：**

1. **代码优先审查** — 分析视图失效风暴、不稳定标识符、`body` 中的重计算
2. **引导用户 Profiling** — 指导使用 Instruments 的 SwiftUI 模板采集轨迹
3. **分析与诊断** — 结合轨迹和代码定位根因
4. **修复与验证** — 提供针对性修复并对比前后指标

**常见代码异味检测：**

```swift
// ❌ 在 body 中创建昂贵的 Formatter
var body: some View {
    let formatter = NumberFormatter() // 每次渲染都分配
    Text(formatter.string(from: number))
}

// ✅ 使用缓存的 Formatter
final class AppFormatter {
    static let shared = AppFormatter()
    let number = NumberFormatter()
}
```

```swift
// ❌ ForEach 中使用不稳定标识
ForEach(items, id: \.self) { item in  // 值变化导致 id 变化
    Row(item)
}

// ✅ 使用稳定 ID
ForEach(items, id: \.stableId) { item in
    Row(item)
}
```

**实用场景：**
- 列表滚动卡顿时快速定位性能瓶颈
- SwiftUI 视图频繁重绘问题排查
- 上线前性能基线建立与回归检测

---

### 2. iOS Simulator Automation

| 项目 | 详情 |
|------|------|
| **作者** | @tristanmanchester |
| **链接** | [GitHub](https://github.com/openclaw/skills/tree/main/skills/tristanmanchester/ios-simulator) |
| **推荐指数** | ⭐⭐⭐⭐⭐ |

**核心功能：** 通过 Node.js CLI 封装 `simctl` 和 `idb`，实现 iOS 模拟器的全流程自动化——从设备创建、应用安装到基于无障碍树的 UI 自动化测试。

**快速上手：**

```bash
# 健康检查
node ios-sim.mjs health

# 列出可用模拟器
node ios-sim.mjs list

# 选择并启动模拟器
node ios-sim.mjs select --name "iPhone" --runtime "iOS" --boot

# 安装并启动应用
node ios-sim.mjs app install --app path/to/MyApp.app
node ios-sim.mjs app launch --bundle-id com.example.MyApp

# 基于无障碍树的 UI 操作（需要 idb）
node ios-sim.mjs ui summary          # 查看当前 UI 结构
node ios-sim.mjs ui tap --query "登录" # 点击「登录」按钮
node ios-sim.mjs ui type --text "hello" # 输入文本

# 截图
node ios-sim.mjs screenshot --out artifacts/screen.png
```

**安全分级设计：**

| 级别 | 命令 | 说明 |
|------|------|------|
| SAFE | `list`, `health`, `boot`, `screenshot` | 无数据风险 |
| CAUTION | `privacy`, `push`, `clipboard` | 修改模拟器状态 |
| DANGEROUS | `erase`, `delete` | 需要显式 `--yes` 确认 |

**实用场景：**
- CI/CD 流水线中的自动化 UI 测试
- 多设备兼容性批量测试
- Agent 驱动的自动化回归验证

---

### 3. macOS SwiftPM App Packaging

| 项目 | 详情 |
|------|------|
| **作者** | @dimillian（Ice Cube 作者） |
| **链接** | [GitHub](https://github.com/openclaw/skills/tree/main/skills/dimillian/macos-spm-app-packaging) |
| **推荐指数** | ⭐⭐⭐⭐☆ |

**核心功能：** 在完全不依赖 Xcode 项目的情况下，使用 SwiftPM 构建、打包和发布 macOS 应用。提供完整的项目脚手架模板和签名/公证脚本。

**工作流程：**

1. **Bootstrap** — 从模板创建项目骨架（`Package.swift`、`Sources/`、`version.env`）
2. **构建与测试** — `swift build` && `swift test`
3. **打包** — `Scripts/package_app.sh` 生成 `.app` bundle
4. **发布** — 签名、公证、生成 Sparkle appcast

**提供的脚本模板：**

```bash
Scripts/
├── package_app.sh          # 构建二进制 + 创建 .app bundle
├── compile_and_run.sh      # 开发循环：杀进程 → 打包 → 启动
├── sign-and-notarize.sh    # 公证 + Staple + Zip
├── make_appcast.sh         # 生成 Sparkle 更新清单
├── build_icon.sh           # 从 Icon Composer 生成 .icns
├── setup_dev_signing.sh    # 创建开发签名身份
└── launch.sh               # 简单启动器
```

**实用场景：**
- 独立开发者摆脱 Xcode 项目文件的束缚
- 命令行驱动的 macOS 应用构建流水线
- 菜单栏应用（设置 `MENU_BAR_APP=1` 自动生成 `LSUIElement`）

---

### 4. Swift Concurrency Expert

| 项目 | 详情 |
|------|------|
| **作者** | @steipete |
| **链接** | [GitHub](https://github.com/openclaw/skills/tree/main/skills/steipete/swift-concurrency-expert) |
| **推荐指数** | ⭐⭐⭐⭐⭐ |

**核心功能：** 针对 Swift 6.2+ 的并发合规性问题进行审查和修复，处理 actor 隔离、Sendable 安全性和现代并发模式。

**常见修复策略：**

| 问题 | 修复方案 |
|------|----------|
| UI 绑定类型 | 添加 `@MainActor` 注解 |
| 协议一致性 | 使一致性隔离：`extension Foo: @MainActor SomeProtocol` |
| 全局/静态状态 | 用 `@MainActor` 保护或移入 actor |
| 后台任务 | 移入 `@concurrent` async 函数或用 actor 保护 |
| Sendable 错误 | 优先使用不可变值类型 |

```swift
// ❌ 数据竞争风险
class DataManager {
    var cache: [String: Data] = [:]
    
    func fetch(_ key: String) async -> Data? {
        cache[key]  // 非隔离访问
    }
}

// ✅ 使用 actor 保护
actor DataManager {
    private var cache: [String: Data] = [:]
    
    func fetch(_ key: String) -> Data? {
        cache[key]
    }
}
```

**实用场景：**
- 迁移到 Swift 6 严格并发模式时的编译错误修复
- 代码审查中的并发安全隐患排查
- 新功能的并发设计模式指导

---

### 5. Instruments Profiling

| 项目 | 详情 |
|------|------|
| **作者** | @steipete |
| **链接** | [GitHub](https://github.com/openclaw/skills/tree/main/skills/steipete/instruments-profiling) |
| **推荐指数** | ⭐⭐⭐⭐☆ |

**核心功能：** 使用 Instruments/xctrace 对原生 macOS/iOS 应用进行性能剖析，覆盖正确的二进制选择、CLI 参数配置、数据导出等关键环节。

**CLI 快速启动：**

```bash
# 列出可用模板
xcrun xctrace list templates

# 启动并录制 Time Profiler
xcrun xctrace record \
  --template 'Time Profiler' \
  --time-limit 60s \
  --output /tmp/App.trace \
  --launch -- /path/To/App.app

# 附加到已运行进程
xcrun xctrace record \
  --template 'Time Profiler' \
  --time-limit 60s \
  --output /tmp/App.trace \
  --attach <pid>

# 导出调用栈
xcrun xctrace export \
  --input /tmp/App.trace \
  --xpath '/trace-toc/run[@number="1"]/data/table[@schema="time-profile"]' \
  --output /tmp/time-profile.xml
```

**关键避坑指南：**

- ⚠️ **最常见问题**：Instruments 可能 profle 到 `/Applications` 中的同名应用而非本地构建版本。解决：使用直接二进制路径 `--launch -- /path/App.app/Contents/MacOS/App`
- ⚠️ **空轨迹**：应用退出太快，加长采集时间并在录制期间触发工作负载
- ⚠️ **隐私提示**：需在系统设置中授予开发者工具权限

**实用场景：**
- 应用启动性能优化
- 线上卡顿问题的本地复现与定位
- 自动化性能回归测试（通过 XML 导出做 diff）

---

## 📊 推荐指数排名

| 排名 | Skill | 推荐指数 | 适用人群 |
|------|-------|----------|----------|
| 1 | SwiftUI Performance Audit | ⭐⭐⭐⭐⭐ | SwiftUI 开发者 |
| 2 | iOS Simulator Automation | ⭐⭐⭐⭐⭐ | 测试/自动化工程师 |
| 3 | Swift Concurrency Expert | ⭐⭐⭐⭐⭐ | Swift 6 迁移者 |
| 4 | Instruments Profiling | ⭐⭐⭐⭐☆ | 性能优化工程师 |
| 5 | macOS SwiftPM App Packaging | ⭐⭐⭐⭐☆ | 独立 macOS 开发者 |

---

## 🎯 应用场景总结

### 场景一：SwiftUI 列表卡顿排查

**工具组合**：SwiftUI Performance Audit + Instruments Profiling

先用 Performance Audit 做代码审查，识别不稳定标识符、body 中的重计算等常见问题。如果代码审查不足以下结论，引导使用 Instruments 的 SwiftUI 模板采集轨迹，再结合轨迹数据做根因分析。

### 场景二：Swift 6 并发迁移

**工具组合**：Swift Concurrency Expert + SwiftUI Performance Audit

开启 Swift 6 严格并发后，用 Concurrency Expert 逐文件修复编译错误，确保 actor 隔离和 Sendable 合规。同时用 Performance Audit 检查 `@MainActor` 注解是否引入了不必要的视图更新。

### 场景三：CI/CD 自动化测试流水线

**工具组合**：iOS Simulator Automation + macOS SwiftPM App Packaging

用 SwiftPM Packaging 在命令行完成构建和打包，然后用 iOS Simulator Automation 自动启动模拟器、安装应用、执行 UI 自动化测试、截图归档。完全摆脱 Xcode 的 GUI 依赖。

### 场景四：独立开发者发布流程

**工具组合**：macOS SwiftPM App Packaging + Instruments Profiling

开发阶段用 `compile_and_run.sh` 快速迭代，发布前用 Instruments 做性能基线检测，最后用 `sign-and-notarize.sh` 完成签名公证，`make_appcast.sh` 生成 Sparkle 更新清单。一条命令到发布。

---

## 💡 实用建议

1. **steipete 的技能系列值得重点关注** — 今天介绍的 5 个 skill 中有 3 个来自 steipete（Peter Steinberger），他是知名的 iOS 性能优化专家，技能质量很高
2. **先代码审查再 Instruments** — 性能问题优先用代码审查定位，Instruments 作为兜底手段，效率更高
3. **idb 是模拟器自动化的关键依赖** — 如果需要 UI 自动化（而非仅设备管理），务必安装 idb
4. **SwiftPM 打包适合轻量项目** — 复杂项目可能仍需 Xcode 项目文件，但独立开发者的工具类应用完全可以用 SwiftPM 替代
5. **并发迁移要趁早** — Swift 6.2 的严格并发是趋势，提前用 Concurrency Expert 审查现有代码可以减少后续迁移成本

---

> 📌 明日预告：**Marketing & Sales** 分类 — 探索营销与销售领域的 OpenClaw 技能
>
> 关注本系列，每天发现一个新分类的实用技能！

---

*本文由 OpenClaw 自动生成 | [技能仓库](https://github.com/openclaw/skills) | [OpenClaw 官网](https://docs.openclaw.ai)*
