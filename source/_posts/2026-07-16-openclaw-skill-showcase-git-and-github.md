---
title: OpenClaw Skill 每日推荐 - Git 与 GitHub
tags:
  - openclaw
  - skill
  - git-and-github
categories:
  - 技术推荐
abbrlink: 6399
date: 2026-07-16 11:30:00
description: "Git 与 GitHub 分类是 OpenClaw 生态中最大的分类之一，聚焦于版本控制的方方面面——从基础的 commit/push 到高级的 PR 风险分析、CI/CD 工作流生成、安全审计等。无论你是独立开发者还是团队协作，都能..."
keywords: "openclaw, skill, 每日推荐, git, github, git-and-github, 技术推荐"
---

# 🐙 OpenClaw Skill 每日推荐 — Git 与 GitHub

> 共收录 **166 个 Skills**，涵盖 Git 工作流、GitHub 自动化、PR 管理和代码安全审计等核心场景。

---

## 📋 分类概述

Git 与 GitHub 分类是 OpenClaw 生态中最大的分类之一，聚焦于版本控制的方方面面——从基础的 commit/push 到高级的 PR 风险分析、CI/CD 工作流生成、安全审计等。无论你是独立开发者还是团队协作，都能在这里找到提升效率的利器。

---

## ⭐ 精选 Skill 详解

### 1. Super GitHub

- **链接**: [super-github](https://github.com/openclaw/skills/tree/main/skills/heldinhow/super-github/SKILL.md)
- **推荐指数**: ⭐⭐⭐⭐⭐

**核心功能**: 终极 GitHub 自动化框架，集成了 Issues、PRs、Releases 等多个 GitHub 功能的最佳实践。

**实用场景**:
- 自动创建和管理 GitHub Issues
- 批量处理 Pull Requests（审查、合并、标签）
- 自动发布 Release 版本
- 一站式 GitHub 项目管理

**技术实现**: 封装了 `gh` CLI 的常用操作，提供统一的 Agent 友好接口，让 AI Agent 能像资深开发者一样操作 GitHub。

```bash
# 典型用法：让 Agent 自动管理你的 GitHub 项目
"帮我创建一个 issue，标题是'修复登录页 Bug'，标签 bug + priority:high"
```

---

### 2. Git Sentinel

- **链接**: [git-sentinel](https://github.com/openclaw/skills/tree/main/skills/corezip/git-sentinel/SKILL.md)
- **推荐指数**: ⭐⭐⭐⭐⭐

**核心功能**: 以高级软件工程师 + 安全审计员的视角，对 Git 仓库进行全面安全审查。

**实用场景**:
- 检测代码中意外提交的密钥和凭证
- 审查 commit 历史中的可疑变更
- 在 PR 合并前进行安全门禁检查
- 自动识别权限提升或数据泄露风险

**技术实现**: Agent 扮演安全审计角色，结合 `git log`、`git diff` 等命令，对提交内容进行模式匹配和语义分析。

```bash
# 典型用法
"审查我的仓库，看有没有意外提交的 API key"
```

---

### 3. Conventional Commits

- **链接**: [conventional-commits](https://github.com/openclaw/skills/tree/main/skills/bastos/conventional-commits/SKILL.md)
- **推荐指数**: ⭐⭐⭐⭐

**核心功能**: 自动格式化 Git 提交信息，遵循 Conventional Commits 规范。

**实用场景**:
- 规范团队提交信息格式（feat/fix/docs/chore 等）
- 自动生成 Changelog
- 配合语义化版本管理
- 让 Git 历史真正可读

**技术实现**: Agent 在执行 commit 时自动根据变更内容推断类型（feat/fix/refactor 等），生成符合规范的 commit message。

```bash
# 规范前
git commit -m "改了点东西"

# 规范后（Agent 自动生成）
git commit -m "fix(auth): resolve token expiration edge case on refresh"
```

---

### 4. PR Risk Analyzer

- **链接**: [pr-risk-analyzer](https://github.com/openclaw/skills/tree/main/skills/nerdvana-labs/pr-risk-analyzer/SKILL.md)
- **推荐指数**: ⭐⭐⭐⭐

**核心功能**: 分析 GitHub Pull Request 的安全风险，判断是否可以安全合并。

**实用场景**:
- 大型 PR 合并前的风险评估
- 识别潜在的供应链攻击
- 检测引入的新依赖安全性
- 自动化 CI 安全门禁

**技术实现**: 抓取 PR diff，对代码变更进行分类分析（新增依赖、权限变更、文件操作等），输出风险评分和建议。

```bash
# 典型用法
"分析 PR #42 的安全风险，能不能直接 merge？"
```

---

### 5. GH CLI (GitHub CLI Skill)

- **链接**: [gh](https://github.com/openclaw/skills/tree/main/skills/trumppo/gh/SKILL.md)
- **推荐指数**: ⭐⭐⭐⭐

**核心功能**: 封装 GitHub CLI (`gh`) 的核心操作，提供 Agent 友好的接口。

**实用场景**:
- 认证状态检查
- 仓库创建/克隆/Fork
- Issue 和 PR 管理
- GitHub Actions 查看

**技术实现**: 直接封装 `gh` 命令行工具，将输入输出转换为 Agent 可理解的结构化数据。

```bash
# 典型用法
"用 gh 列出我所有 open 的 PR"
"fork 这个仓库到我的账号下"
```

---

## 🎯 应用场景总结

| 场景 | 推荐 Skill |
|------|-----------|
| 日常 Git 操作 | `gh`, `git-essentials`, `git-helper` |
| 提交规范 | `conventional-commits`, `sovereign-commit-craft` |
| PR 安全审查 | `pr-risk-analyzer`, `git-sentinel` |
| GitHub 项目管理 | `super-github`, `gh` |
| Changelog 生成 | `git-changelog`, `sovereign-changelog-maker` |
| CI/CD 工作流 | `gh-action-gen`, `martok9803-ci-whisperer` |
| 仓库备份 | `git-crypt-backup`, `clawdbot-backup` |
| PR 三角分流 | `repo-pr-triage`, `auto-pr-merger` |
| 开源贡献前调研 | `upstream-recon`, `deepwiki` |

---

## 🏆 推荐指数排名

| 排名 | Skill | 推荐指数 | 一句话点评 |
|------|-------|---------|-----------|
| 1 | Super GitHub | ⭐⭐⭐⭐⭐ | GitHub 自动化一站式解决方案 |
| 2 | Git Sentinel | ⭐⭐⭐⭐⭐ | 代码安全审计必备 |
| 3 | PR Risk Analyzer | ⭐⭐⭐⭐ | PR 合并前的安全守门员 |
| 4 | Conventional Commits | ⭐⭐⭐⭐ | 提交规范从此不再靠自觉 |
| 5 | GH CLI | ⭐⭐⭐⭐ | 最实用的 GitHub CLI 封装 |

---

## 💡 实用建议

1. **从 GH CLI 开始**: 如果你是新手，先安装 `gh` skill，它覆盖了 80% 的日常操作。
2. **安全优先**: 团队项目务必启用 `git-sentinel` 或 `pr-risk-analyzer`，防止密钥泄露。
3. **规范先行**: `conventional-commits` 投入极低但回报极高——让你的 changelog 自动生成成为可能。
4. **组合使用**: `conventional-commits` + `git-changelog` = 自动化的版本发布工作流。

---

*本系列每日更新，明天见！* 🎋
