---
title: OpenClaw Skill 每日推荐 - Git 与 GitHub
date: 2026-10-10 11:30:00
tags:
  - openclaw
  - skill
  - git-and-github
categories:
  - 技术推荐
---

> 「OpenClaw Skill 每日推荐」第 12 期。这个系列每天从 [awesome-openclaw-skills](https://clawskills.sh/) 的 30 个分类中取一个，精选几个值得装的 skill 做详细介绍。今天轮到 **Git 与 GitHub** 分类——166 个 skills，可能是所有分类里离开发者日常最近的一个。

## 今日分类概述

**Git & GitHub** 分类收录了 **166 个 skills**，覆盖从基础提交、分支管理到 PR 审查、发布追踪、事故恢复的完整链路。这个分类的特点非常明显：

- **实用型 skill 占比高**：大量 skill 本质上是把 git/GitHub 的最佳实践封装成 Agent 可执行的指令集
- **良莠不齐也最明显**：既有下载量 7k+ 的精品，也有大量"占坑式"的空壳（这个分类里混进了不少与 Git 毫无关系的 skill，比如 TTS、电商类，筛选时要留意）
- **安全信号分化大**：同为 Git 工具，有的通过双重安全审计，有的被标记 Suspicious

我从 166 个里挑了 5 个最值得装的，另外还有两个"反面教材"值得单独说说。

---

## 精选 Skill 详解

### 1. git-workflows —— 进阶 Git 操作百科全书 ⭐⭐⭐⭐⭐

- **作者**：gitgoodordietrying
- **热度**：7,600+ 下载，本分类下载量第一梯队
- **安全状态**：VirusTotal Benign + OpenClaw Benign（HIGH 置信度），双绿
- **安装**：`openclaw skills install @gitgoodordietrying/git-workflows`
- **详情页**：[clawskills.sh/skills/gitgoodordietrying-git-workflows](https://clawskills.sh/skills/gitgoodordietrying-git-workflows)

**核心功能**：覆盖 add/commit/push 之外的所有进阶操作——交互式 rebase、bisect、worktree、reflog 恢复、subtree/submodule、sparse checkout、冲突解决、cherry-pick、rerere。定位是"git 教程不教的那部分"。

**实用场景**：

- 合并 PR 前把一堆 `fix` 提交 squash 成干净的历史
- 定位"哪个 commit 引入了这个 regression"
- 不想 stash 当前工作，用 worktree 在独立目录里审查 PR
- `reset --hard` 手滑后抢救丢失的提交

**技术实现机制**：它不是包装某个二进制工具，而是一份结构化的操作知识库（Markdown 指令集），Agent 读取后按场景组合原生 git 命令执行。以自动 bisect 为例，Agent 会按这样的流程走：

```bash
git bisect start
git bisect bad                 # 当前 HEAD 是坏的
git bisect good v1.2.0         # 已知好的版本
# 写一个退出码 0=正常 / 1=有 bug 的测试脚本
git bisect run ./test-for-bug.sh   # 自动二分
git bisect reset               # 回到原分支
```

Agent 负责写测试脚本、解读二分结果、`git show` 确认嫌疑 commit——把最枯燥的排查流程自动化了。

**推荐理由**：内容密度高、审计干净、下载量经过社区验证。如果你只装一个 Git 类 skill，装它。

---

### 2. gh —— 把整个 GitHub 工作流装进终端 ⭐⭐⭐⭐⭐

- **作者**：trumppo
- **热度**：2,600+ 下载，4 星
- **安全状态**：VirusTotal Benign + OpenClaw Benign，双绿
- **前置依赖**：本机安装 [GitHub CLI](https://cli.github.com/) 并完成 `gh auth login`
- **详情页**：[clawskills.sh/skills/trumppo-gh](https://clawskills.sh/skills/trumppo-gh)

**核心功能**：让 Agent 通过 `gh` CLI 完成认证状态检查、仓库创建/克隆/fork、issue 管理、PR 操作、release 发布。设计原则是"显式、幂等的命令 + 返回创建资源的 URL"。

**实用场景**：

- 把本地项目目录一键变成私有 GitHub 仓库
- 不开浏览器就能给 issue 评论、打标签
- 从当前分支直接开 PR，正文由 Agent 根据近期提交自动生成
- 发布带 release notes 的版本

**技术实现机制**：本质是对 `gh` CLI 的命令编排规范。一个典型流程：

```bash
gh auth status                          # 确认认证
gh repo view --json owner,name,defaultBranchRef  # 确认上下文
gh pr create --title "..." --body "..." # 基于近期提交生成
# → 输出 https://github.com/owner/repo/pull/42
```

**推荐理由**：它是这个分类里的"基础设施型" skill——很多其他 skill（比如下面的 release-tracker）都默认你装了它。配合 OpenClaw 的 cron 能力，"每天早上自动整理 issue 并开 PR"这类工作流就顺理成章了。

---

### 3. emergency-rescue —— 开发者灾难恢复手册 ⭐⭐⭐⭐

- **作者**：gitgoodordietrying（与 git-workflows 同作者）
- **热度**：2,400+ 下载
- **安全状态**：VirusTotal Benign；OpenClaw 标记 **Suspicious**（"部分操作涉及外部访问，使用前请审查"）
- **集成**：GitHub、GitLab、Docker、Kubernetes、AWS
- **详情页**：[clawskills.sh/skills/gitgoodordietrying-emergency-rescue](https://clawskills.sh/skills/gitgoodordietrying-emergency-rescue)

**核心功能**：覆盖开发者最常见的灾难场景——强推覆盖分支、密钥泄露进仓库、磁盘写满、数据库迁移失败、部署翻车、SSH 被锁死。每个场景都是 **诊断 → 修复 → 验证** 三段式结构，破坏性命令被明确标注，默认走非破坏路径。

**实用场景**（最有代表性的一条）：AWS 密钥不小心提交到了公开仓库——

```bash
# 1. 定位泄露的文件和 commit
git log --all --full-history -- path/to/secret.key
# 2. 第一优先级：先去 IAM 控制台吊销密钥（比改 git 更急）
# 3. 从 git 追踪移除并加入 .gitignore
git rm --cached path/to/secret.key
# 4. 用 filter-repo 从全部历史中抹除
git filter-repo --path path/to/secret.key --invert-paths
git push --force
# 5. 通知所有协作者重新 clone
```

这个顺序很关键：先吊销凭据、再清理历史。人工在慌乱中很容易搞反。

**推荐理由**：内容本身是五星级的——这类知识平时用不上，出事时千金难买。扣一星在于 OpenClaw 的 Suspicious 标记：它涉及对生产系统（AWS/K8s 等）的操作，**建议安装前通读 SKILL.md，并给 Agent 明确的审批边界**。灾难场景恰恰是最不该让 Agent 自由发挥的地方。

---

### 4. git-changelog —— 从提交历史生成变更日志 ⭐⭐⭐

- **作者**：fratua
- **热度**：580+ 下载
- **安全状态**：VirusTotal 标记 Suspicious；OpenClaw Benign（HIGH 置信度）
- **详情页**：[clawskills.sh/skills/fratua-git-changelog](https://clawskills.sh/skills/fratua-git-changelog)

**核心功能**：读取 git 提交历史，按 Conventional Commits 规范解析并分组，输出 Markdown 格式的 changelog。支持 tag 范围、日期范围，自动检测 `BREAKING CHANGE` footer 和 `feat!` 破坏性提交。结果可直接贴进 `CHANGELOG.md` 或 GitHub Release。

**技术实现机制**：纯本地 git 操作，流程是：

```bash
git rev-parse --is-inside-work-tree   # 确认在 git 仓库内
git log v1.1.0..HEAD --pretty=...     # 提取 hash/subject/author/date
# 解析 subject 的 type 前缀 → 分组为 Features / Bug Fixes / Docs...
# 检查 BREAKING CHANGE footer 和 feat! → 单独警示区
```

输出形如：

```markdown
## Features
- a1b2c3d auth: 支持 OAuth2 登录 (login)
- e4f5g6h api: 新增批量导出接口 (export)

## Bug Fixes
- i7j8k9l ui: 修复暗色模式下对比度问题

## ⚠️ Breaking Changes
- m0n1o2p config: 配置文件格式从 YAML 迁移到 TOML
```

**推荐理由**：功能确实解决了痛点（长区间手写 changelog 既繁琐又容易漏），但它被 VirusTotal 标记 Suspicious、下载量还低、零 star，社区验证不足。**建议先在 [ClawHub](https://clawhub.ai/fratua/git-changelog) 上通读 SKILL.md 确认无误后再装**，或者干脆让 Agent 按 Conventional Commits 规范现场手写一个等效流程——这个 skill 的价值更多是"提示词模板"。

---

### 5. release-tracker —— 多仓库发布监控 + 自动播报 ⭐⭐⭐

- **作者**：jo9900
- **热度**：300+ 下载
- **安全状态**：VirusTotal Suspicious；OpenClaw 最新版本 Benign
- **支持渠道**：Discord（Forum/Channel）、Telegram、Slack
- **详情页**：[clawskills.sh/skills/jo9900-release-tracker](https://clawskills.sh/skills/jo9900-release-tracker)

**核心功能**：监控多个 GitHub 仓库的新 release，与本地记录的上次版本号对比，有更新时拉取 release notes、按关键词分级（重点功能 / Breaking / 修复），格式化后推送到配置的渠道。支持 cron 定时或按需触发。

**技术实现机制**：状态文件驱动的设计值得借鉴——

```
release-tracker.json        # 配置：监控哪些仓库、推送到哪
release-tracker-state.json  # 状态：每个仓库上次见到的版本号
```

每次运行：`gh release list` 拉最新 tag → 与状态文件对比 → `gh release view` 取正文 → 分类整理 → 推送 → 回写状态文件。幂等、可断点续跑。

**实用场景**：

- 每天自动检查你依赖的框架有没有新版本（尤其 pre-release）
- 团队 Slack 频道自动播报上游工具的 release notes
- 过滤掉 CI/依赖更新噪音，只看真正重要的变更

**推荐理由**：这是"Agent + cron"模式的典型样本，和 OpenClaw 的定时任务能力是绝配。不足是 Suspicious 标记 + 安装量为零，同上建议先审后装。

---

## 安全观察：这个分类里的两个"反面教材"

精选之外，有两个 skill 我特意拉了完整数据，它们恰好说明了**为什么要看安全状态**：

**gh-action-gen**（963 下载）——用自然语言生成 GitHub Actions YAML，思路很好，但 VirusTotal 和 OpenClaw **双双标记 Suspicious**，且需要 `OPENAI_API_KEY`。想法不错，等它把审计问题解决再说。

**pr-risk-analyzer**（449 下载）——声称分析 PR 安全风险，但看它的实际流程：**把你的仓库信息和 GitHub token POST 到第三方服务器** `pr-risk-analyzer.onrender.com`。双 Suspicious 标记完全合理。这类"安全工具自己不安全"的设计是典型陷阱——审查 PR 风险的工具，恰恰不该让你交出凭据。

> **通用建议**：安装任何 skill 前做三件事——看 clawskills.sh/clawhub.ai 的安全审计状态；通读 SKILL.md（重点找有没有把数据/token 发往外部端点）；搜一下下载量和 star 数做交叉验证。`Suspicious` 不一定意味着恶意，但一定意味着"值得花两分钟看看"。

---

## 应用场景总结

| 场景 | 推荐组合 |
|---|---|
| 日常提交、开 PR、管 issue | `gh` |
| 整理历史、排查 regression、多分支并行 | `git-workflows` |
| 密钥泄露、误操作恢复、生产事故 | `emergency-rescue` |
| 发版前生成 release notes | `git-changelog` |
| 追踪依赖的上游更新 | `release-tracker` + cron |
| 自动化 CI 配置 | 暂缓（gh-action-gen 待观察） |

一个值得尝试的完整工作流：**`release-tracker`（cron 监控上游）→ `git-workflows`（rebase 升级分支）→ `git-changelog`（生成本地变更记录）→ `gh`（开 PR）**，一条链覆盖"跟进依赖更新"的全过程。

## 推荐指数排名

| 排名 | Skill | 推荐指数 | 一句话点评 |
|---|---|---|---|
| 🥇 | git-workflows | ⭐⭐⭐⭐⭐ | 7.6k 下载 + 双绿审计，Git 类首选 |
| 🥈 | gh | ⭐⭐⭐⭐⭐ | 基础设施型 skill，搭配万物 |
| 🥉 | emergency-rescue | ⭐⭐⭐⭐ | 平时不显山露水，出事时救命 |
| 4 | git-changelog | ⭐⭐⭐ | 功能对口，但需先过一遍安全审查 |
| 5 | release-tracker | ⭐⭐⭐ | cron 播报好搭档， adoption 待验证 |

## 实用建议

1. **skill 可以组合**：上面 5 个 skill 并不互斥，`gh` 是地基，其余按需叠加
2. **给破坏性操作上锁**：装 `emergency-rescue`、`git-workflows` 这类能改写历史的 skill 时，建议在 Agent 配置里对 `push --force`、`filter-repo` 等命令设置人工确认
3. **本地已有 gh 就够了？** 不完全是——skill 的价值在于把"什么场景用什么命令序列"的知识固化下来，省掉每次现场推理
4. **下一期预告**：第 13 期将介绍 **健康与健身（health-and-fitness）** 分类，看看 Agent 怎么管你的身体

---

*本文数据采集自 [clawskills.sh](https://clawskills.sh/)（awesome-openclaw-skills 官方目录）与 ClawHub，安全状态以平台 2026 年 3 月同步数据为准。*
