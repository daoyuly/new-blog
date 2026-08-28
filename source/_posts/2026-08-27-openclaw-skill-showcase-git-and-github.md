---
title: OpenClaw Skill 每日推荐 - Git 与 GitHub
tags:
  - openclaw
  - skill
  - git-and-github
categories:
  - 技术推荐
abbrlink: 6401
date: 2026-08-27 11:30:00
---

# OpenClaw Skill 每日推荐 - Git 与 GitHub

> 📅 2026年8月27日 | 分类：Git 与 GitHub | 共 166 个 Skills

## 今日分类概述

Git 与 GitHub 分类是 OpenClaw Skills 生态中最大的分类之一，拥有 **166 个 skills**。这个分类涵盖了从基础 Git 操作到高级 GitHub 自动化的方方面面：commit 规范、PR 风险分析、changelog 生成、代码"去 slop"、上游项目调研……可以说，如果你在日常开发中和 Git 打交道，这里一定有能帮到你的 skill。

今天精选了 5 个最具代表性的 skills，覆盖了**提交规范、高级工作流、PR 安全、自动化和开源协作**五个维度。

---

## 精选 Skill 详解

### 1. 🌿 git-workflows — 高级 Git 工作流

| 项目 | 信息 |
|------|------|
| **GitHub** | [gitgoodordietrying/git-workflows](https://github.com/openclaw/skills/tree/main/skills/gitgoodordietrying/git-workflows/SKILL.md) |
| **作者** | gitgoodordietrying |
| **推荐指数** | ⭐⭐⭐⭐⭐ |

**核心功能：** 超越 `add/commit/push` 的高级 Git 操作指南，涵盖交互式 rebase、bisect 二分查 bug、worktree 并行开发、reflog 恢复、subtree/submodule 管理、sparse checkout、cherry-pick 和冲突解决。

**实用场景举例：**

```bash
# 场景：用 bisect 自动定位引入 bug 的 commit
git bisect start
git bisect bad                    # 当前 commit 有 bug
git bisect good v1.2.0            # v1.2.0 没有 bug
# Git 自动二分，配合测试脚本全自动定位
git bisect run ./test-for-bug.sh

# 场景：用 worktree 同时处理多个分支
git worktree add ../hotfix-branch hotfix/urgent
# 在另一个目录同时工作，不需要 stash
```

**技术实现机制：** 这个 skill 本质上是一份结构化的 Git 高级操作参考手册，通过 SKILL.md 定义了完整的触发条件和操作流程。它不依赖额外工具，纯靠 `git` CLI 实现所有功能。特别值得一提的是它包含了 `rerere`（复用冲突解决方案）和 `git stash branch`（从 stash 创建分支）这类鲜为人知但极其实用的技巧。

**亮点：** 文档质量极高，每个操作都有完整代码示例和冲突处理方案，堪称 Git 进阶必备。

---

### 2. 📝 conventional-commits — 规范化提交

| 项目 | 信息 |
|------|------|
| **GitHub** | [bastos/conventional-commits](https://github.com/openclaw/skills/tree/main/skills/bastos/conventional-commits/SKILL.md) |
| **作者** | bastos |
| **推荐指数** | ⭐⭐⭐⭐⭐ |

**核心功能：** 强制所有 commit message 遵循 [Conventional Commits](https://www.conventionalcommits.org/) 规范，支持自动化 changelog 生成和语义化版本控制。

**实用场景举例：**

```
feat(auth): add OAuth2 support           # 新功能 → MINOR 版本
fix: resolve null pointer exception      # Bug 修复 → PATCH 版本
feat!: migrate to new API client         # 破坏性变更 → MAJOR 版本
  BREAKING CHANGE: API client interface changed
```

**技术实现机制：** Skill 以 YAML frontmatter 定义了触发条件（当用户提到 commit、git commit 等），核心是一套完整的规范模板。它定义了：

- **9 种 commit type**（feat/fix/docs/style/refactor/perf/test/build/ci/chore/revert）
- **Scope 语法**：`type(scope): description`
- **Breaking Change 两种表达方式**：`!` 标记和 footer
- **与 SemVer 的映射关系**：feat→MINOR, fix→PATCH, BREAKING→MAJOR

**亮点：** 文档极尽详细，从常见错误到多段 body 示例应有尽有。对于团队协作项目来说，这是自动化版本管理的基石。

---

### 3. 🔍 pr-risk-analyzer — PR 风险分析

| 项目 | 信息 |
|------|------|
| **GitHub** | [nerdvana-labs/pr-risk-analyzer](https://github.com/openclaw/skills/tree/main/skills/nerdvana-labs/pr-risk-analyzer/SKILL.md) |
| **作者** | nerdvana-labs |
| **推荐指数** | ⭐⭐⭐⭐ |

**核心功能：** 分析 GitHub Pull Request 的安全风险，在合并前提供风险评分和建议。

**实用场景举例：**

> 场景：团队收到一个外部贡献者的 PR，修改了认证模块。合并前用这个 skill 扫描：
> - 检测是否暴露了密钥
> - 分析代码变更量是否异常
> - 检查是否修改了敏感文件
> - 输出风险评分和合并建议

**技术实现机制：** 这个 skill 调用一个远程 API（`pr-risk-analyzer.onrender.com/analyze-pr`），传入 repo、PR number 和可选的 GitHub token。返回结果包含：

- `riskScore` — 风险评分
- `riskLevel` — 风险等级
- `issues` — 具体问题列表
- `summary` — 总结建议

Skill 定义了清晰的 guardrails：不猜测仓库信息、不存储 token、API 失败时如实报告。

**亮点：** 对 CI/CD 流程中的"最后一道防线"很有价值，适合需要严格 PR 审查的团队。

---

### 4. 📔 git-changelog — 自动生成 Changelog

| 项目 | 信息 |
|------|------|
| **GitHub** | [fratua/git-changelog](https://github.com/openclaw/skills/tree/main/skills/fratua/git-changelog/SKILL.md) |
| **作者** | Sovereign Skills (fratua) |
| **推荐指数** | ⭐⭐⭐⭐ |

**核心功能：** 从 Git commit 历史自动生成美观的、按 Conventional Commits 分类的 changelog，支持 Markdown 输出。

**实用场景举例：**

```bash
# 场景：发布新版本前生成 release notes
# 自动检测上一个 tag，提取所有 commit 并分类
LAST_TAG=$(git describe --tags --abbrev=0)
git log ${LAST_TAG}..HEAD --pretty=format:"%H|%s|%an|%ad" --date=short

# 输出效果：
# ## [v1.2.0] — 2026-08-27
# ### ✨ Features
# - **auth**: Add OAuth2 support ([abc1234])
# ### 🐛 Bug Fixes
# - **db**: Fix connection pool leak ([ghi9012])
# ### 💥 Breaking Changes
# - **api**: Migrate to new API client ([def5678])
```

**技术实现机制：** 完整的 7 步工作流：

1. 验证 Git 仓库
2. 确定范围（tag-to-tag / 日期范围 / 最近 N 条）
3. 提取 commit（`git log --pretty=format`）
4. 按 Conventional Commits 分类（11 个分类，每类配 emoji）
5. 生成 Markdown
6. 检测 Breaking Changes
7. 输出到聊天或写入 `CHANGELOG.md`

**亮点：** 与 conventional-commits skill 天然互补——前者规范提交，后者消费提交历史生成 changelog。两者搭配使用效果极佳。

---

### 5. 🕵️ upstream-recon — 开源项目调研

| 项目 | 信息 |
|------|------|
| **GitHub** | [semmyt/upstream-recon](https://github.com/openclaw/skills/tree/main/skills/semmyt/upstream-recon/SKILL.md) |
| **作者** | semmyt |
| **推荐指数** | ⭐⭐⭐⭐⭐ |

**核心功能：** 在向上游开源项目提交 issue/PR/评论之前，先调研该项目的文化、贡献者结构、PR 接受率和已有讨论，避免重复工作和无效贡献。

**实用场景举例：**

> 场景：你发现一个开源库有个 bug，想提 PR。先用 upstream-recon 调研：
> 1. 查看项目元数据（stars、license、最后活跃时间）
> 2. 分析 Top 10 贡献者（是否一人独大？）
> 3. 搜索已有 issue（是否已有人报告？）
> 4. 查看最近 50 个被关闭但未合并的 PR（维护者拒绝的模式是什么？）
> 5. 最终得到建议：MERGE-LIKELY / FILE-ISSUE-FIRST / COMMENT-ON-EXISTING / DUPLICATE-EXISTS

**技术实现机制：** 全程使用 `gh` CLI 操作，分 8 个维度调研：

| 维度 | 分析内容 |
|------|---------|
| 治理结构 | 独立维护者 / 小团队 / 社区驱动 |
| PR 接受度 | 欢迎 / 挑剔（接受 bug 不接受 feature）/ 封闭 |
| Issue 响应速度 | 维护者回复速度和态度 |
| 合并速度 | 外部贡献者从提交到合并的平均时间 |
| 拒绝模式 | 被忽略？被建议自建？被 bot 关闭？ |
| 话题重叠 | 是否已有人讨论或尝试过 |

最终给出 5 种推荐之一：**MERGE-LIKELY**、**MERGE-UNLIKELY**、**FILE-ISSUE-FIRST**、**COMMENT-ON-EXISTING**、**DUPLICATE-EXISTS**。

**亮点：** 这个 skill 解决了一个非常实际的痛点——很多开发者花时间写了 PR 却被拒绝。通过前置调研可以大幅提高贡献成功率，是开源贡献者的必备工具。

---

## 应用场景总结

| 场景 | 推荐 Skill | 搭配建议 |
|------|-----------|---------|
| 规范团队提交信息 | conventional-commits | + git-changelog 自动生成 release notes |
| 发布版本前生成 Changelog | git-changelog | 需要先有 conventional commits 规范 |
| 处理复杂 Git 操作 | git-workflows | rebase / bisect / worktree / cherry-pick |
| PR 合并前安全检查 | pr-risk-analyzer | 集成到 CI/CD 流水线 |
| 向开源项目贡献代码 | upstream-recon | 提 PR 前必做调研 |
| 清理 AI 生成的冗余代码 | deslop | review diff 后移除不一致的防御性代码 |

## 推荐指数排名

| 排名 | Skill | 推荐指数 | 核心价值 |
|------|-------|---------|---------|
| 1 | git-workflows | ⭐⭐⭐⭐⭐ | Git 进阶操作百科全书 |
| 2 | conventional-commits | ⭐⭐⭐⭐⭐ | 团队协作的提交规范基石 |
| 3 | upstream-recon | ⭐⭐⭐⭐⭐ | 开源贡献者的前置调研利器 |
| 4 | pr-risk-analyzer | ⭐⭐⭐⭐ | PR 合并前的安全防线 |
| 5 | git-changelog | ⭐⭐⭐⭐ | 自动化 release notes 生成 |

## 实用建议

1. **黄金搭档：** `conventional-commits` + `git-changelog` = 规范提交 + 自动 changelog，这是团队协作的最佳实践组合
2. **开源贡献三步走：** 用 `upstream-recon` 调研 → 用 `conventional-commits` 写规范的 commit → 用 `git-workflows` 管理分支
3. **CI/CD 集成：** `pr-risk-analyzer` 可以作为 PR 合并前的必经检查环节
4. **AI 协作场景：** 当 AI agent 帮你写代码后，用 `deslop` 清理 AI 风格的冗余防御性代码
5. **学习路径：** 先掌握 `git-workflows` 中的 rebase 和 bisect，这是提升 Git 熟练度最快的两个命令

---

> 🎯 **明日预告：** 健康与健身（health-and-fitness）分类
>
> 本系列共 30 期，每日一期，带你探索 OpenClaw Skills 生态的全部分类。
