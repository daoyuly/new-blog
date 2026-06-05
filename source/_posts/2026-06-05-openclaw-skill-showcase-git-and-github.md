---
title: OpenClaw Skill 每日推荐 - Git 与 GitHub
date: 2026-06-05 11:30:00
tags:
  - openclaw
  - skill
  - git
  - github
categories:
  - 技术推荐
---

# OpenClaw Skill 每日推荐 — Git 与 GitHub 🐙

> 共收录 **166 个 Skills**，是 OpenClaw 生态中最大的分类之一。从基础的 git 操作到高级的 PR 安全审计，覆盖了开发者与 GitHub 交互的方方面面。

---

## 🏆 精选 Skill 详解

### 1. super-github ⭐⭐⭐⭐⭐

**链接：** [super-github](https://github.com/openclaw/skills/tree/main/skills/heldinhow/super-github/SKILL.md)

**核心功能：** 终极 GitHub 自动化框架，整合了 Issues、PR、Releases 等全流程操作，堪称 GitHub Skills 的「瑞士军刀」。

**实用场景：**
- 批量管理仓库的 Issues 和 PR
- 自动化 Release 发布流程
- 生成项目统计报告

**技术实现：** 封装 `gh` CLI 命令，提供统一的 Agent 调用接口，支持多仓库并行操作。

**推荐指数：** ⭐⭐⭐⭐⭐ — 如果你只装一个 GitHub skill，就选这个。

---

### 2. pr-risk-analyzer ⭐⭐⭐⭐⭐

**链接：** [pr-risk-analyzer](https://github.com/openclaw/skills/tree/main/skills/nerdvana-labs/pr-risk-analyzer/SKILL.md)

**核心功能：** 分析 GitHub Pull Request 的安全风险，判断 PR 是否可以安全合并。

**实用场景：**
- 自动审查外部贡献者提交的 PR
- 识别潜在的供应链攻击（如依赖注入、权限提升）
- 在 CI/CD 流程中嵌入安全门禁

**技术实现：** 通过 `gh` CLI 获取 PR diff，对代码变更进行模式匹配和风险评分，输出结构化的安全报告。

**推荐指数：** ⭐⭐⭐⭐⭐ — 团队协作项目的必备安全工具。

---

### 3. conventional-commits ⭐⭐⭐⭐

**链接：** [conventional-commits](https://github.com/openclaw/skills/tree/main/skills/bastos/conventional-commits/SKILL.md)

**核心功能：** 按照 [Conventional Commits](https://www.conventionalcommits.org/) 规范格式化 Git 提交信息。

**实用场景：**
- 让 Agent 自动生成规范的 commit message
- 配合 `git-changelog` 自动生成变更日志
- 保持团队提交历史的一致性

**代码示例：**
```bash
# Agent 自动将你的改动归类并生成规范消息
# feat: add user authentication module
# fix: resolve memory leak in worker pool
# docs: update API reference for v2 endpoints
```

**推荐指数：** ⭐⭐⭐⭐ — 简单但实用，提升代码仓库的整洁度。

---

### 4. gh-action-gen ⭐⭐⭐⭐

**链接：** [gh-action-gen](https://github.com/openclaw/skills/tree/main/skills/branexp/gh-action-gen/SKILL.md)

**核心功能：** 用自然语言描述需求，自动生成 GitHub Actions 工作流配置文件。

**实用场景：**
- 快速搭建 CI/CD 流水线
- 自动发布、自动测试、自动部署
- 降低 YAML 配置的学习门槛

**代码示例：**
```
你说：帮我创建一个 workflow，每次 push 到 main 分支时自动运行测试并部署到 Vercel
Agent 生成：.github/workflows/deploy.yml
```

**推荐指数：** ⭐⭐⭐⭐ — 对不熟悉 GitHub Actions 语法的开发者特别友好。

---

### 5. deepwiki ⭐⭐⭐⭐

**链接：** [deepwiki](https://github.com/openclaw/skills/tree/main/skills/arun-8687/deepwiki/SKILL.md)

**核心功能：** 通过 DeepWiki MCP 服务器查询 GitHub 仓库的文档、Wiki 和项目信息。

**实用场景：**
- 快速了解一个开源项目的架构和用法
- 在不离开聊天界面的情况下浏览项目文档
- 为代码审查提供上下文

**技术实现：** 基于 MCP（Model Context Protocol）协议，将 GitHub 仓库文档作为结构化数据提供给 Agent。

**推荐指数：** ⭐⭐⭐⭐ — 研究开源项目的利器。

---

## 📊 推荐指数排名

| 排名 | Skill | 推荐指数 | 一句话 |
|------|-------|---------|--------|
| 🥇 | super-github | ⭐⭐⭐⭐⭐ | GitHub 全能瑞士军刀 |
| 🥈 | pr-risk-analyzer | ⭐⭐⭐⭐⭐ | PR 安全门禁必备 |
| 🥉 | conventional-commits | ⭐⭐⭐⭐ | 提交规范自动化 |
| 4 | gh-action-gen | ⭐⭐⭐⭐ | 自然语言生成 CI/CD |
| 5 | deepwiki | ⭐⭐⭐⭐ | 开源项目文档查询 |

---

## 🎯 应用场景总结

**个人开发者：** `conventional-commits` + `git-changelog` 组合，让仓库历史干净、变更日志自动生成。

**团队协作：** `super-github` + `pr-risk-analyzer`，自动化 PR 管理并内置安全审查。

**DevOps 工程师：** `gh-action-gen` + `arc-skill-gitops`，用自然语言管理 CI/CD 和 Skill 版本。

**开源维护者：** `deepwiki` + `release-tracker`，快速了解依赖项目并追踪版本更新。

---

## 💡 实用建议

1. **从 super-github 开始** — 它覆盖了 80% 的日常 GitHub 操作
2. **安全优先** — 如果你管理公共仓库，务必安装 pr-risk-analyzer
3. **规范先行** — conventional-commits 是投入产出比最高的 Skill
4. **注意信任验证** — 本分类中有多个安全审计类 Skill（如 `arc-trust-verifier`、`skill-security-reviewer`），建议配合使用

---

*本文是 [OpenClaw Skill 每日推荐](https://www.daoyuly.cn) 系列的一部分，每天介绍一个分类。明天预告：**健康与健身** 🏃*
