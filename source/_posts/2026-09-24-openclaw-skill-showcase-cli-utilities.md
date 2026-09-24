---
title: OpenClaw Skill 每日推荐 - CLI Utilities（CLI 工具）
date: 2026-09-24 11:35:00
tags: [openclaw, skill, cli-utilities]
categories: [技术推荐]
---

# OpenClaw Skill 每日推荐 —— CLI Utilities（CLI 工具）

> 系列第 6 期 / 共 30 期。每天介绍一个 OpenClaw Skill 分类，精选 3-5 个值得装进你 Agent 工具箱的 skill。

## 今日分类：CLI Utilities

**分类规模：180 个 skills**。这是整个 awesome-openclaw-skills 仓库里最"接地气"的分类之一——没有花哨的 SaaS 集成，核心思路就一句话：**让 Agent 把成熟的命令行工具用对、用好**。

这个分类里既有 `fd`、`curl`、`entr` 这类经典 Unix 工具的"最佳实践说明书"，也有 `totp`、`dependency-audit` 这种专为 Agent 安全运行设计的原创工具。对 Agent 来说，shell 就是它的双手——手上的工具越锋利，活儿干得越漂亮。

## 精选 Skill 详解

### 1️⃣ fd-find —— 比 find 快 10 倍的文件搜索

**🔗 链接**：[skills/arnarsson/fd-find](https://github.com/openclaw/skills/tree/main/skills/arnarsson/fd-find/SKILL.md)
**⭐ 推荐指数：5/5**

**核心功能**：`fd` 是经典 `find` 命令的现代替代品，语法简单、默认智能（自动忽略 `.gitignore` 里的内容、并行遍历、大小写智能匹配）。这个 skill 把 fd 的常用模式整理成了 Agent 可直接调用的速查手册。

**实用场景**：

```bash
# 找出 30 天前的旧文件并删除
fd --changed-before 30d -t f -x rm {}

# 找出所有超过 100MB 的大文件
fd --size +100m --list-details

# 把所有 PDF 拷到目标目录
fd -e pdf -x cp {} /target/dir/

# 配合 fzf 模糊打开文件
vim $(fd -t f | fzf)
```

**技术机制**：skill 的元数据里声明了依赖 `fd` 二进制，并自带 brew/apt 两条安装路径——Agent 发现本机没装时会自动走安装流程，而不是报错了事。SKILL.md 里还专门写了与 `ripgrep`、`fzf`、`bat` 的组合用法。

**为什么推荐**：Agent 做文件操作极其频繁，`find` 的语法又出了名的反直觉（`-name`、`-mtime` 参数顺序、转义规则）。让 Agent 用 fd，一次命中、少绕弯路。

---

### 2️⃣ curl-http —— Agent 的 HTTP 瑞士军刀

**🔗 链接**：[skills/arnarsson/curl-http](https://github.com/openclaw/skills/tree/main/skills/arnarsson/curl-http/SKILL.md)
**⭐ 推荐指数：5/5**

**核心功能**：把 curl 在 API 测试、文件传输、调试场景下的完整用法结构化，覆盖认证、Cookie、代理、SSL、重试、性能计时等所有高频需求。

**实用场景**：

```bash
# 测试 API 并提取 token
curl -s -X POST https://api.example.com/login \
  -H "Content-Type: application/json" \
  -d '{"user":"test","pass":"secret"}' | jq -r '.token'

# 详尽的性能分析：DNS / 连接 / TLS / 首字节耗时
curl -w "\nDNS: %{time_namelookup}s\nTLS: %{time_appconnect}s\nTotal: %{time_total}s\n" \
  -o /dev/null -s https://example.com

# 检查网站是否存活
if curl -s --head --fail https://example.com > /dev/null; then echo "Site is up"; fi
```

**技术机制**：这个 skill 不依赖任何额外安装（curl 几乎预装在所有系统），SKILL.md 的价值在于**教会 Agent 正确的惯用法**——比如脚本里用 `-sS`（静默但保留报错）、处理重定向加 `-L`、配合 `jq` 解析 JSON，避免 Agent 写出能跑但脆弱的命令。

**为什么推荐**：Agent 联网调试、调用 webhook、下载文件全靠它。看似人人会用的 curl，细节坑极多（超时忘了加、静默吞错误），这份速查能显著降低翻车率。

---

### 3️⃣ entr —— 文件一变，命令自动跑

**🔗 链接**：[skills/gumadeiras/entr](https://github.com/openclaw/skills/tree/main/skills/gumadeiras/entr/SKILL.md)
**⭐ 推荐指数：4/5**

**核心功能**：`entr`（Event Notify Test Runner）从 stdin 接收文件列表，任何文件变化时自动执行指定命令——极简版的 watch 模式，不需要写配置文件。

**实用场景**：

```bash
# 源码一变就重新编译
find src/ -name "*.c" | entr make

# JS 文件一变就跑测试
git ls-files | grep '\.js$' | entr npm test

# 自动重启开发服务器（-r 杀掉旧进程重启）
ls *.js | entr -r node app.js
```

**技术机制**：SKILL.md 里专门有一段 **Agent Notes**——提醒 Agent `entr` 会阻塞终端，应该用后台进程方式运行，或只在需要短时间观察输出时使用。这种"教 Agent 规避自身运行时陷阱"的细节非常难得。

**为什么推荐**：对人类开发者这是省心的小工具；对 Agent 这是"改代码 → 立刻验证"闭环的最简实现，比 webpack watch、nodemon 更轻、更通用。

---

### 4️⃣ totp —— 给 Agent 的敏感操作加一把动态口令锁

**🔗 链接**：[skills/diegofcornejo/totp](https://github.com/openclaw/skills/tree/main/skills/diegofcornejo/totp/SKILL.md)
**⭐ 推荐指数：4/5**

**核心功能**：基于 TOTP（时间动态口令）的二次验证。当用户要求 Agent 执行高风险操作时——读取 `.env` 环境变量、查看 `openclaw.json` 配置、重启网关、删除备份——Agent 会要求你提供验证器 App 上的 6 位数字，验证通过才放行。

**实用场景**：

```bash
# 初始化：生成密钥和二维码，扫码进 Google Authenticator
node scripts/generate-secret.js MyService myuser
# 密钥写入 .env：TOTP_SECRET=YOUR_BASE32_SECRET

# 敏感操作触发时，Agent 发起验证
TOTP_SECRET=$TOTP_SECRET node scripts/verify.js 123456
# exit 0 → 放行 | exit 1 → 拒绝
```

**技术机制**：基于 `otplib` 实现，标准 TOTP 参数（SHA1 / 6 位 / 30 秒周期），容错窗口设为 2（约 1 分钟），兼顾时钟漂移和安全性。密钥只存 `.env`，生成的二维码立即删除，不留痕迹。

**为什么推荐**：这是这个分类里**思路最原创**的 skill。AI Agent 的权限模型一直是痛点——"是本人发起的吗？"totp 用最朴素的方式回答了这个问题。如果你让 Agent 管理服务器或密钥，强烈建议配一个。

---

### 5️⃣ dependency-audit —— 一键给项目依赖做体检

**🔗 链接**：[skills/fratua/dependency-audit](https://github.com/openclaw/skills/tree/main/skills/fratua/dependency-audit/SKILL.md)
**⭐ 推荐指数：4/5**

**核心功能**：自动识别项目的包管理器，串联安全审计、过期检测、无用依赖识别，最后输出一份按优先级分层的更新计划。

**实用场景**：接手一个陌生老项目，或者上线前例行检查：

```markdown
# 生成的报告长这样：
## 🔴 Critical — 安全漏洞
| lodash | CRITICAL | 4.17.19 | 4.17.21 | npm install lodash@4.17.21 |

## 🟠 High — 有大版本更新
| express | 4.18.2 | 5.0.0 | 新 router API，需测试 |

## 🟢 Low — 未使用的依赖
| moment | npm uninstall moment |
```

**技术机制**：SKILL.md 本质是一套**决策工作流**：按标志文件探测生态（`package.json` → npm audit、`Cargo.toml` → cargo audit、`go.mod` → govulncheck、`Gemfile` → bundle audit），支持 monorepo 逐 workspace 审计，连"npm audit 返回非零其实是发现了漏洞、属正常现象"这种边界情况都写清了。

**为什么推荐**：它展示了 OpenClaw skill 的一种典型形态——不写一行代码，纯靠编排既有 CLI 工具，就能把一个 10 分钟的手工流程变成 Agent 的一条指令。

## 推荐指数排名

| 排名 | Skill | 定位 | 推荐指数 |
|------|-------|------|----------|
| 🥇 | fd-find | 文件搜索与批量操作 | ⭐⭐⭐⭐⭐ |
| 🥇 | curl-http | HTTP 请求与 API 调试 | ⭐⭐⭐⭐⭐ |
| 🥉 | entr | 文件监听与自动执行 | ⭐⭐⭐⭐ |
| 4 | totp | 敏感操作二次验证 | ⭐⭐⭐⭐ |
| 5 | dependency-audit | 依赖健康体检 | ⭐⭐⭐⭐ |

## 应用场景总结

CLI Utilities 类 skill 的价值在于三件事：

1. **降低 Agent 犯错率**：curl、find 这类工具"能用"和"用对"之间隔着无数坑，速查式 skill 让 Agent 直接站在最佳实践上。
2. **补齐 Agent 运行时短板**：像 entr 的 Agent Notes、totp 的权限护栏，都是针对"AI 执行环境"特有问题的设计——这是传统 man page 不会告诉你的。
3. **零成本编排现有工具**：dependency-audit 证明了一个好的 SKILL.md 不需要代码，把工作流写清楚就能产出十倍价值。

**实用建议**：给你的 OpenClaw 装上 `fd-find` 和 `curl-http` 几乎稳赚不赔；如果你让 Agent 拥有服务器操作权限，`totp` 值得优先部署。安装方式很简单，把对应 skill 目录放进 `~/.openclaw/skills/` 即可。

---

*分类来源：[awesome-openclaw-skills](https://github.com/openclaw/skills)。明天预告：coding-agents-and-ides（编码代理与 IDE），敬请期待。*
