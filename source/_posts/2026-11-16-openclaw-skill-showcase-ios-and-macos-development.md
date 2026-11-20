---
title: OpenClaw Skill 每日推荐 - iOS 与 macOS 开发（ios-and-macos-development）
tags:
  - openclaw
  - skill
  - ios-and-macos-development
categories:
  - 技术推荐
abbrlink: 61603
date: 2026-11-16 11:30:00
---

# OpenClaw Skill 每日推荐 - iOS 与 macOS 开发（ios-and-macos-development）

第 41 期，第三轮第 15 站。

上期收尾埋的钩子今天兑现：「画完之后，Agent 盯上了你的 iPhone，要亲手写 Swift。」——ios-and-macos-development，29 个 skill，Apple 平台开发生态。

先说体感：这是近期**正经浓度最高**的分类之一。Swift/SwiftUI 专家经验、模拟器自动化、打包发布、macOS 运维，一条开发链路从写代码到上架 App Store 基本齐活。当然，也混进来五位跑错片场的（酸面团管理、货运谈判、投资组合……后面细说），但 24/29 ≈ 83% 的正经率，比上期「六成正经四成串场」体面多了。

> **勘误与说明**：往期文章附的 clawskills.sh 详情页链接目前已失效（整站 404），本期起统一改用官方注册表 [ClawHub](https://clawhub.ai)，安装命令为 `clawhub install <slug>`。下文所有链接均已逐一验证可访问。

## 分类速览

29 个 skill 大致分四层：

| 层次 | 数量 | 代表 |
|------|------|------|
| Swift/SwiftUI 专业知识 | ~13 | swiftui-performance-audit、swift-concurrency-expert、swiftui-ui-patterns |
| 构建与工具链 | ~4 | ios-simulator、macos-spm-app-packaging、sfsymbol-generator |
| macOS 系统运维 | ~7 | brew-audit、lulu-monitor、toolguard-daemon-control、agent-defibrillator |
| 跑错片场 | 5 | sourdough-starter-manager、carrier-relationship-management、riskofficer、envios、wopr-clock |

作者分布也有意思：**steipete 一人挂名 5 条**，dimillian 2 条，aadipapp 3 条，szpakkamil 2 条。但 steipete 的 5 条里，有 4 条的 SKILL.md 开头都诚实标注了——

> _Attribution: copied from @Dimillian's `Dimillian/Skills` (2025-12-31)._

也就是说，这批 SwiftUI skill 的原创者是 dimillian，steipete 是署了名的搬运工。加上 dimillian 自己的 2 条原创，**「Dimillian 血统」实际覆盖 6/29 ≈ 21%**——一个人撑起了这个分类的五分之一。

顺便认下人：steipete 是 Peter Steinberger（PSPDFKit 创始人，著名 iOS 老兵），dimillian 是 Thomas Ricouard（开源 Mastodon 客户端 Ice Cubes 作者）。这个分类是整个系列里「明星开发者浓度」最高的一期。

## 精选 Skill 详解

### 1. swiftui-performance-audit — SwiftUI 性能体检 ⭐⭐⭐⭐⭐

- **作者**：steipete（原创：dimillian）
- **详情页**：https://clawhub.ai/skills/swiftui-performance-audit
- **安装**：`clawhub install swiftui-performance-audit`

整个分类里最厚实的一份 SKILL.md（189 行），本质是把 WWDC23「Demystify SwiftUI performance」那些年年讲的内容，**条目化成 agent 可执行的 checklist**。

**工作流设计**：先决策树——用户给了代码就走 Code-First Review，只有症状就先要代码；代码审查拿不准，再引导用户开 Instruments 抓 trace（Release 构建、SwiftUI 模板、复现操作、导出调用树），最后按影响排序输出问题清单和修复建议，有基线数据还能给你 before/after 对比表。

**Code Smells 清单**是精华，每条都带正反例。比如「在 `body` 里分配 Formatter」：

```swift
// ❌ 每次 body 求值都重新分配，很慢
var body: some View {
    let number = NumberFormatter()
    let measure = MeasurementFormatter()
    Text(measure.string(from: .init(value: meters, unit: .meters)))
}

// ✅ 缓存到单例里，一次分配反复用
final class DistanceFormatter {
    static let shared = DistanceFormatter()
    let number = NumberFormatter()
    let measure = MeasurementFormatter()
}
```

再比如「`ForEach` 里的不稳定身份」——用 `id: \.self` 配非稳定值，列表一刷新身份全变，视图树整棵重建。这类问题代码审查时人眼经常漏，agent 拿着 checklist 逐条扫就不会。

其余条目还包括：`body` 里做排序过滤、主线程解码大图、`GeometryReader` 深层嵌套引起的布局抖动、`@Observable` 模型粒度过粗导致的「失效风暴」。

**实用场景**：Agent 帮你审 SwiftUI PR 时挂上这个 skill，它能系统性地过一遍性能问题，而不是只看逻辑对不对。修完还能引导你用 Instruments 复测对比。

### 2. apple-docs — Apple 文档与 WWDC 全库检索 ⭐⭐⭐⭐⭐

- **作者**：thesethrose
- **详情页**：https://clawhub.ai/skills/apple-docs
- **安装**：`clawhub install apple-docs`

**零安装、开箱即用**（底层是 [kimsungwhee/apple-docs-mcp](https://github.com/kimsungwhee/apple-docs-mcp)），一个命令行查遍 Apple 开发者宇宙：

```bash
# 查文档
apple-docs search "SwiftUI animation"
apple-docs symbols "UITableViewDelegate"

# 查平台兼容性：这个 API 最低支持哪个系统版本？
apple-docs platform "VNRecognizeTextRequest"

# 查 API 继承链和协议遵从
apple-docs apis "UIViewController"

# 查弃用 API 的官方推荐替代品
apple-docs similar "UILabel"

# 搜 WWDC 视频（2014-2025，1260+ 场），带完整文字稿
apple-docs wwdc-search "async await"
apple-docs wwdc-video 2024-100
```

**技术机制**：1260+ 场 WWDC 视频**离线打包 35MB** 随 skill 分发，不联网也能搜；文档类 API 走缓存——API 详情 30 分钟、搜索结果 10 分钟、框架信息 1 小时。对 agent 来说这意味着查文档不烧多余 token，也不用开浏览器。

**实用场景**：Agent 写 Swift 代码遇到「这个 modifier 是 iOS 16 还是 17 的」这类问题时，直接查而不是猜；想了解某个 WWDC session 讲了什么，拿文字稿摘要。Apple 文档没有官方全文检索（开发者站搜索 notoriously 不好用），这个 skill 补的就是这个洞。

### 3. ios-simulator — 模拟器全流程自动化 ⭐⭐⭐⭐⭐

- **作者**：tristanmanchester
- **详情页**：https://clawhub.ai/skills/ios-simulator
- **安装**：`clawhub install ios-simulator`

把 `xcrun simctl` 和 Facebook 的 `idb` 包成一个 **专为 agent 设计** 的 Node CLI：默认输出单行 JSON（token 友好），大输出（完整 UI 树）opt-in 才给。

```bash
# 创建/选择/启动一台模拟器（状态写到 .ios-sim-state.json）
node ios-sim.mjs select --name "iPhone" --runtime "iOS" --boot

# 装上 app 并启动
node ios-sim.mjs app install --app path/to/MyApp.app
node ios-sim.mjs app launch --bundle-id com.example.MyApp

# 无障碍树定位 + 语义点击（不需要坐标，按文案找按钮）
node ios-sim.mjs ui tap --query "Log in"
node ios-sim.mjs ui type --text "hello world"

# 截图留证
node ios-sim.mjs screenshot --out artifacts/screen.png
```

**两个设计值得单独表扬**：

1. **安全分级**：命令分 SAFE（list/boot/screenshot）、CAUTION（privacy/push/clipboard，会改模拟器状态）、DANGEROUS（erase/delete，必须显式 `--yes`）。agent 拿到分级就知道哪些能放开手脚、哪些要先问人。
2. **远程节点支持**：明确写了「如果 gateway 不在 macOS 上，通过 macOS node 执行」——考虑到了 OpenClaw 的多节点架构。

能力面很全：隐私授权（`privacy grant`）、推送测试（`push --payload`）、剪贴板、录屏、日志过滤、HOME/SIRI 物理按键模拟。

**实用场景**：Agent 改完 iOS 代码自己编译装进模拟器，点两下验证流程跑得通，截图发你——一个不睡觉的 QA。idb 需要额外装（`brew install idb-companion`），但只用 simctl 管理设备的话裸奔也能跑。

### 4. macos-spm-app-packaging — 不开 Xcode 发布 macOS 应用 ⭐⭐⭐⭐

- **作者**：dimillian
- **详情页**：https://clawhub.ai/skills/macos-spm-app-packaging
- **安装**：`clawhub install macos-spm-app-packaging`

一种很硬核的开发哲学：**macOS 应用完全可以不要 Xcode 工程**，纯 SwiftPM 走到底。这个 skill 提供从脚手架到发布的一整套模板：

```bash
# 脚手架：拷模板、改 MyApp 名字、配 BUNDLE_ID
# 开发循环：杀进程 → 打包 → 启动
Scripts/compile_and_run.sh

# 打包 .app bundle（编译、组装、拷资源、签名）
Scripts/package_app.sh

# 发布三连：公证 + staple + zip
Scripts/sign-and-notarize.sh

# 生成 Sparkle 更新源的 appcast 条目
Scripts/make_appcast.sh
```

细节见功力：菜单栏应用打包时设 `MENU_BAR_APP=1` 自动写入 `LSUIElement`（不在 Dock 显示）；Sparkle 依赖 `CFBundleVersion` 做更新判断，模板里明确提醒「每次发版 BUILD_NUMBER 必须递增」；还有 `build_icon.sh` 从 Icon Composer 文件生成 .icns。

**实用场景**：Agent 帮你把一个 Swift 小工具从源码一路带到「别人能下载安装的 .app」——签名、公证、自动更新源一步不落。对讨厌 Xcode 工程文件的人来说是救赎。

### 5. toolguard-daemon-control — 把长驻进程交给 launchd ⭐⭐⭐⭐

- **作者**：johnnylambada
- **详情页**：https://clawhub.ai/skills/toolguard-daemon-control
- **安装**：`clawhub install toolguard-daemon-control`

SKILL.md 第一句话就说到了 OpenClaw 用户的痛处：

> Use this **instead of background exec** for any process that should persist beyond the current session.

任何应该在会话结束后继续活着的进程，都该注册成 launchd 服务而不是挂在某个终端里。四件套命令：

```bash
# 注册并启动（自动生成 plist，KeepAlive 崩溃自拉起）
bash scripts/install.sh toolguard-proxy /usr/local/bin/my-server \
  --workdir ~/Documents/toolguard --env PORT=8080

# 状态 / 日志 / 卸载
bash scripts/status.sh toolguard-proxy
bash scripts/logs.sh toolguard-proxy --follow
bash scripts/uninstall.sh toolguard-proxy
```

实现干净：用户级 LaunchAgent（`~/Library/LaunchAgents/ai.toolguard.<name>.plist`，无需 sudo），日志落 `~/Library/Logs/toolguard/`，卸载保留日志。还提醒了一个 launchd 的坑：它不支持 `go run`，要先 `go build` 指向二进制。

**实用场景**：Agent 帮你在 Mac 上部署任何长期服务——数据库、代理、自己写的 API——装完就忘了也不怕，崩了 launchd 会拉起来，重启电脑也会自动起。

## 荣誉提名

- **[agent-defibrillator](https://clawhub.ai/skills/agent-defibrillator)**（hazy2go）⭐⭐⭐⭐ — 给 Agent 的宿主装「除颤器」：launchd 服务每 10 分钟检查 gateway 健康度，检测到崩溃/僵死/版本不匹配就自动重启（带冷却期防重启风暴），可选 Discord 通知。AI 给自己配心脏起搏器，很符合本系列的元叙事。
- **[lulu-monitor](https://clawhub.ai/skills/lulu-monitor)**（easonc13）⭐⭐⭐ — LuLu 防火墙的 AI 副驾：监控告警、AI 分析连接行为、Telegram 推 Allow/Block 按钮让你远程决策。
- **[sfsymbol-generator](https://clawhub.ai/skills/sfsymbol-generator)**（svkozak）⭐⭐⭐ — SVG 转 SF Symbol 的 `.symbolset` 资产目录：校验 viewBox、计算路径边界、注入 Ultralight/Regular/Black 三字重模板。小而准。
- **[swiftfindrefs](https://clawhub.ai/skills/swiftfindrefs)**（michaelversus）⭐⭐⭐ — 基于 IndexStoreDB（Xcode 索引库）查符号引用，SKILL.md 里写死了「禁止用 grep/rg 或 IDE 搜索替代」——对跨模块重构防漏改的执念很真实。

## 跑错片场专区

本期 5/29 ≈ 17% 的条目和 Apple 开发没有半毛钱关系：

1. **sourdough-starter-manager** 🍞 — 酸面团酵头管理：喂养计划、水合度计算、健康追踪。认真做的，v1.0.0，emoji 都配好了。但它是烘焙 skill，不是 Xcode skill。
2. **carrier-relationship-management** — 货运承运商组合管理、运费谈判、绩效追踪，「由 15 年以上经验的运输管理者总结」。朋友，第 28 期 transportation 在等你。
3. **riskofficer** — 投资组合管理与风险指标计算。金融 skill。
4. **envios** — 西班牙语的物流查询（配送时间、覆盖区域）。跑错片场 × 语言障碍双重 buff。
5. **wopr-clock** — WarGames 风格的复古倒计时钟，追一个叫 TACO 的活动（2026 年 3 月 6 日——写这篇时活动已经过去八个多月了，钟还在走）。

## 本期观察

**1. 专家经验编码的天花板长什么样。** swiftui-performance-audit 展示了「专家 skill」的理想形态：不是「我会 SwiftUI」的空泛声明，而是决策树 + 带正反例的 smells 清单 + 引导用户抓 trace 的话术 + 修复优先级排序。它的价值不在让 agent「知道」这些——模型本来就见过 WWDC——而在**让 agent 每次都不跳步**。

**2. 为 agent 设计 CLI 的教科书。** ios-simulator 和 toolguard 不约而同做了三件事：结构化输出（单行 JSON）、危险操作显式确认（`--yes`、安全分级）、状态落盘（state file、日志目录）。对照那些把 500 行 `--help` 直接糊给 agent 的 skill，差距是设计意识，不是代码量。

**3. 大佬也在互相搬运。** steipete 4 条拷贝自 Dimillian 并诚实署名，ClawHub 上还躺着 timeflow-swiftui-view-refactor 这样的第三方克隆。skill 生态的内容流通比想象中活跃——署名规范执行得倒是不错。

**4. 全链路覆盖初现。** 写码（concurrency/UI patterns）→ 体检（performance-audit）→ 查资料→ 实测（ios-simulator）→ 打包公证（spm-app-packaging）→ 上架优化（app-store-optimization）。30 个分类看下来，这是「一个平台的完整生命周期」覆盖最齐的一期——Agent 独立开发一款 iOS app 的工具箱，其实已经凑齐了。

## 应用场景总结

- **Agent 独立开发 iOS/macOS 应用**：本分类 + AI 期，从零写一个 SwiftUI app、性能自检、模拟器自测、打包上架，链路无断点
- **团队代码审查**：swift-concurrency-expert 处理 Swift 6 严格并发报错，swiftui-performance-audit 扫性能隐患
- **Mac 自运维**：brew-audit 查过期包、mac-clean 清缓存、toolguard 管长驻服务、lulu-monitor 盯网络
- **Agent 自举**：agent-defibrillator 保证 gateway 本身的高可用——工具开始照顾工具了

## 推荐指数排名

| 排名 | Skill | 星级 | 一句话 |
|------|-------|------|--------|
| 1 | swiftui-performance-audit | ⭐⭐⭐⭐⭐ | WWDC 性能智慧的条件反射化 |
| 2 | apple-docs | ⭐⭐⭐⭐⭐ | 1260 场 WWDC 装进 35MB |
| 3 | ios-simulator | ⭐⭐⭐⭐⭐ | 不睡觉的 iOS QA |
| 4 | macos-spm-app-packaging | ⭐⭐⭐⭐ | 对 Xcode 工程文件的优雅拒绝 |
| 5 | toolguard-daemon-control | ⭐⭐⭐⭐ | 长驻进程的正确归宿 |
| 提名 | agent-defibrillator | ⭐⭐⭐⭐ | AI 的心脏起搏器 |
| 提名 | lulu-monitor / sfsymbol-generator / swiftfindrefs | ⭐⭐⭐ | 各司其职 |

## 下期预告

Agent 学会了写 Swift，学会了自测、打包、公证。然后呢？

**该学卖了。** 下期 marketing-and-sales——而且本期的 app-store-optimization（App Store 搜索优化工具箱）放在 iOS 开发分类里，其实已经提前剧透了下期的剧情：应用写完只是一半，让用户搜到你才是另一半。

明天见。（这次争取真的明天见。）
