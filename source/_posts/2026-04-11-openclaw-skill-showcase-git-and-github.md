---
title: OpenClaw Skill 每日推荐 - Git 与 GitHub
date: 2026-04-11
tags: [openclaw, skill, git, github]
categories: [技术推荐]
---

# OpenClaw Skill 每日推荐 - Git 与 GitHub

## 今日分类概览

**Git & GitHub** 分类包含 **166 个技能**，是 OpenClaw 生态系统中最重要的分类之一。这个分类涵盖了从基础 Git 操作到高级 GitHub 自动化的全方位工具，为开发者提供了完整的版本控制和协作工作流解决方案。

这些技能主要分为以下几类：
- **Git 基础操作**：版本控制、分支管理、提交历史分析
- **GitHub CLI 集成**：使用 gh 命令进行 GitHub 操作
- **自动化工作流**：PR 管理、changelog 生成、commit 格式化
- **代码审查**：PR 风险分析、安全审计
- **团队协作**：issue 管理、release 自动化

---

## 🌟 精选 Skill 详解

### 1. gh - GitHub CLI 核心集成

**GitHub**: [trumppo/gh](https://github.com/openclaw/skills/tree/main/skills/trumppo/gh/SKILL.md)

**推荐指数**: ⭐⭐⭐⭐⭐

#### 核心功能
`gh` 技能将 GitHub 官方 CLI 工具集成到 OpenClaw 中，支持完整的 GitHub 操作工作流，包括身份验证、仓库管理、issue/PR 处理和版本发布。

#### 实用场景

##### 创建私有仓库
```bash
gh repo create OWNER/NAME --private --confirm --description "项目描述"
```

##### 创建 Pull Request
```bash
gh pr create --title "添加新功能" --body "功能描述"
```

##### 管理 Issues
```bash
# 列出最近 20 个 issues
gh issue list --limit 20

# 创建新 issue
gh issue create --title "Bug 标题" --body "Bug 描述" --label bug
```

#### 技术实现机制
该技能封装了 `gh` CLI 工具的所有核心命令，通过标准的 shell 执行和 JSON 输出解析，将 GitHub API 的功能无缝集成到 OpenClaw 的工作流中。支持：
- 身份验证状态检查
- 仓库上下文获取
- 增强幂等性操作
- 自动化友好配置（`--confirm` 参数）

#### 推荐理由
这是所有 GitHub 相关工作的基础技能，简洁高效，覆盖了 95% 的日常 GitHub 操作需求。对于个人开发者和小团队来说，这是必备工具。

---

### 2. git-changelog - 智能变更日志生成器

**GitHub**: [fratua/git-changelog](https://github.com/openclaw/skills/tree/main/skills/fratua/git-changelog/SKILL.md)

**推荐指数**: ⭐⭐⭐⭐⭐

#### 核心功能
自动从 Git 提交历史生成格式优美的 Markdown 变更日志，按照 Conventional Commits 规范自动分类，支持版本标签、日期范围等多种模式。

#### 实用场景

##### 生成版本变更日志
```bash
# 从最后一个标签到 HEAD
LAST_TAG=$(git describe --tags --abbrev=0)
git log ${LAST_TAG}..HEAD --pretty=format:"%H|%s|%an|%ad" --date=short
```

##### 按日期范围生成
```bash
git log --since="2025-01-01" --until="2025-02-01" --pretty=format:"%H|%s|%an|%ad" --date=short
```

##### 输出示例
```markdown
## [v1.2.0] — 2025-02-15

### ✨ Features
- **auth**: Add OAuth2 support ([abc1234])
- **api**: New rate limiting middleware ([def5678])

### 🐛 Bug Fixes
- **db**: Fix connection pool leak ([ghi9012])

### 📚 Documentation
- Update API reference ([jkl3456])
```

#### 技术实现机制
该技能实现了完整的 Conventional Commits 解析器：
- 支持 11 种提交类型（feat, fix, docs, style, refactor, perf, test, build, ci, chore, revert）
- 自动识别 Breaking Changes（通过 `!` 后缀或 `BREAKING CHANGE` footer）
- 智能范围检测（最后一个标签、日期范围、N 次提交）
- Monorepo 支持（路径过滤）

#### 特色功能
- **自动分类**：使用 emoji 和类型标签分类
- **作用域支持**：自动提取并高亮显示 `**scope**: message`
- **Breaking Change 检测**：在顶部突出显示破坏性变更
- **空类别过滤**：只显示有内容的分类
- **智能标签检测**：自动查找最后一个 git 标签

#### 推荐理由
对于需要维护 CHANGELOG.md 的项目来说，这是自动化神器。特别适合开源项目和遵循语义化版本号的商业软件。配合 Conventional Commits 使用效果最佳。

---

### 3. super-github - 终极 GitHub 自动化框架

**GitHub**: [heldinhow/super-github](https://github.com/openclaw/skills/tree/main/skills/heldinhow/super-github/SKILL.md)

**推荐指数**: ⭐⭐⭐⭐⭐

#### 核心功能
一个全能的 GitHub 管理框架，集成了多个优秀 GitHub 技能的最佳实践，提供 issues、PR、releases 和仓库管理的完整解决方案。

#### 核心功能模块

##### 1. Issues 自动化
- 创建 issues（支持标签和指派）
- 列表过滤（按状态、标签）
- 更新 issues（标题、正文、标签）
- 自动分类和标签建议

##### 2. PR 审查助手
- PR 摘要分析
- 文件变更统计
- 审查检查清单生成
- 冲突检测

##### 3. Release 自动化
- 创建 releases
- 自动生成 changelog
- 标签管理

##### 4. 仓库管理
- 列出仓库
- 获取/设置 secrets
- 管理 GitHub Actions workflows

#### 技术实现机制
这个技能融合了三个评分较高的 GitHub 技能：
- `openclaw-github-assistant` (3.470)
- `github-automation-pro` (3.266)
- `github-mcp` (3.180)

通过统一的接口提供所有功能，避免了安装多个技能的复杂性。

#### 实用示例
```bash
# 创建 issue
gh issue create --title "Bug in login" --body "Description" --label bug

# PR 审查
gh pr review --summary --stats --checklist

# 创建 release
gh release create v1.0.0 --generate-notes
```

#### 推荐理由
如果你只需要一个 GitHub 技能，那就是这个。它提供了最全面的 GitHub 功能集合，适合追求一站式解决方案的团队和个人。

---

### 4. auto-pr-merger - 自动化 PR 合并工作流

**GitHub**: [autogame-17/auto-pr-merger](https://github.com/openclaw/skills/tree/main/skills/autogame-17/auto-pr-merger/SKILL.md)

**推荐指数**: ⭐⭐⭐⭐

#### 核心功能
自动化 GitHub PR 的完整处理流程：检出 PR、运行测试、尝试修复失败的测试、如果成功则合并。这是一个完整的 CI/CD 自动化工具。

#### 工作流程
```bash
node skills/auto-pr-merger/index.js --pr 123 --test "npm test" --retries 3
```

#### 执行逻辑
1. **检出 PR**：使用 `gh pr checkout` 检出指定 PR
2. **运行测试**：执行指定的测试命令
3. **失败处理**：
   - 读取测试输出
   - 尝试自动修复代码（当前为占位逻辑）
   - 提交并推送修复
   - 重试测试
4. **成功合并**：如果测试通过，使用 `gh pr merge --merge --auto` 合并

#### 技术实现机制
- 集成 `gh` CLI 进行 GitHub 操作
- 支持自定义测试命令（npm test, pytest 等）
- 可配置重试次数（默认 3 次）
- Node.js 环境运行

#### 实用场景
- **开源项目维护**：自动化处理依赖更新 PR
- **内部项目**：CI/CD 流程的一部分
- **团队协作**：减少手动合并工作量
- **依赖更新**：自动合并 Dependabot/renovate 的 PR

#### 推荐理由
对于频繁接收 PR 的项目（特别是开源项目），这个技能可以显著减少维护工作量。需要注意的是，当前版本中的"自动修复"逻辑还是占位实现，实际使用时需要根据项目特点进行定制。

---

### 5. commit-analyzer - Git 提交健康分析器

**GitHub**: [bobrenze-bot/commit-analyzer](https://github.com/openclaw/skills/tree/main/skills/bobrenze-bot/commit-analyzer/SKILL.md)

**推荐指数**: ⭐⭐⭐⭐

#### 核心功能
通过分析 Git 提交模式来监控自主代理的操作健康度。基于提交频率、类别分布和时间模式提供诊断指标，特别适合追踪 AI 代理的工作状态。

#### 健康指标

| 指标 | 健康 | 警告 | 危险 |
|------|------|------|------|
| 提交/小时 | 3-6 | 1-3 | <1 |
| 学习类提交 | 30%+ | 15-30% | <15% |
| 最大空闲间隔 | <3h | 3-6h | >6h |
| 日均提交 | 30+ | 15-30 | <15 |

#### 主要命令

##### 快速健康检查
```bash
./skills/commit-analyzer/analyzer.sh health
```

##### 完整报告（默认 7 天）
```bash
./skills/commit-analyzer/analyzer.sh report [days]
```

##### 小时分布分析
```bash
./skills/commit-analyzer/analyzer.sh hourly [days]
```

##### 类别分析
```bash
./skills/commit-analyzer/analyzer.sh categories [days]
```

##### 等待模式检测
```bash
./skills/commit-analyzer/analyzer.sh waiting [hours]
```

#### 输出示例
```
📊 Git Health Report (last 24h)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Total commits: 42
Commits/hour: 1.75
Status: ⚠️ WARNING (below 3/hr threshold)

Largest gap: 4h 23m (sleeping?)
Learning commits: 18 (43%) ✅

Recommendation: Check for blockers or waiting mode
```

#### 类别分析示例
```
📊 Commit Categories (last 3 days)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Queue:     23 (35%)
Learning:  18 (27%)
Docs:      12 (18%)
Skills:     8 (12%)
Fix:        3 (5%)
Other:      2 (3%)

Total: 66 commits
```

#### 技术实现机制
- 基于 Git 提交历史的多维度分析
- 支持按时间范围、小时、类别分组
- JSON 输出支持，便于集成其他工具
- 基于真实运营数据建立的阈值模型

#### 应用场景
- **AI 代理监控**：追踪自主代理的工作状态
- **团队效率分析**：识别团队工作模式和瓶颈
- **Heartbeat 集成**：定期健康检查
- **自动化告警**：检测空闲或异常模式

#### 推荐理由
这是一个独特的分析工具，特别适合管理 AI 代理或追踪团队开发效率。虽然对普通开发者可能不是刚需，但对于需要监控自动化系统健康度的场景非常有价值。作者基于自身的一周自主运营经验开发了这套指标，具有很强的实用性。

---

## 📊 其他值得关注的 Skill

### conventional-commits - 提交消息格式化
**GitHub**: [bastos/conventional-commits](https://github.com/openclaw/skills/tree/main/skills/bastos/conventional-commits/SKILL.md)

强制执行 [Conventional Commits](https://www.conventionalcommits.org/) 规范，确保所有提交消息遵循标准格式，支持自动化 changelog 生成和语义化版本控制。

**核心功能**：
- 11 种提交类型支持
- 破坏性变更检测（`!` 后缀或 `BREAKING CHANGE` footer）
- 作用域支持
- 语义化版本自动关联
- 常见错误检测和纠正

**推荐指数**: ⭐⭐⭐⭐

### git-sentinel - Git 安全审计
**GitHub**: [corezip/git-sentinel](https://github.com/openclaw/skills/tree/main/skills/corezip/git-sentinel/SKILL.md)

作为高级软件工程师和安全审计员，提供 Git 仓库的安全审查功能。（注意：该 SKILL.md 文件在 GitHub 上暂时不可访问，可能需要联系作者）

**推荐指数**: ⭐⭐⭐（因文档缺失暂降评级）

### pr-risk-analyzer - PR 风险分析器
**GitHub**: [nerdvana-labs/pr-risk-analyzer](https://github.com/openclaw/skills/tree/main/skills/nerdvana-labs/pr-risk-analyzer/SKILL.md)

分析 GitHub Pull Requests 的安全风险，判断 PR 是否可以安全合并。对于注重代码安全的团队非常有用。

**推荐指数**: ⭐⭐⭐⭐

---

## 🎯 应用场景总结

### 个人开发者
- **gh**：日常 GitHub 操作必备
- **conventional-commits**：保持提交历史规范
- **git-changelog**：自动生成项目变更日志

### 小型团队
- **super-github**：一站式 GitHub 管理
- **conventional-commits**：团队协作规范
- **git-changelog**：版本发布自动化

### 开源项目维护者
- **auto-pr-merger**：自动化 PR 处理
- **pr-risk-analyzer**：安全代码审查
- **git-changelog**：release 自动化
- **commit-analyzer**：项目活跃度监控

### AI 代理开发者
- **commit-analyzer**：监控代理健康度
- **git-changelog**：记录代理学习进展
- **conventional-commits**：结构化提交历史

---

## 🏆 推荐指数排名

| 排名 | Skill | 推荐指数 | 核心价值 | 适用人群 |
|------|-------|----------|----------|----------|
| 1 | gh | ⭐⭐⭐⭐⭐ | 基础必备，覆盖 95% 需求 | 所有开发者 |
| 2 | git-changelog | ⭐⭐⭐⭐⭐ | 自动化变更日志，节省大量时间 | 开源项目，版本发布频繁的项目 |
| 3 | super-github | ⭐⭐⭐⭐⭐ | 一站式解决方案，功能全面 | 追求效率的团队和个人 |
| 4 | conventional-commits | ⭐⭐⭐⭐ | 规范提交历史，提升可维护性 | 注重工程规范的开发者 |
| 5 | commit-analyzer | ⭐⭐⭐⭐ | 独特的健康度监控视角 | AI 代理开发者，效率追踪者 |
| 6 | auto-pr-merger | ⭐⭐⭐⭐ | 自动化 PR 处理工作流 | 开源维护者，高频 PR 项目 |
| 7 | pr-risk-analyzer | ⭐⭐⭐⭐ | 代码安全审查 | 注重安全的团队 |

---

## 💡 实用建议

### 新手入门路线
1. 首先安装 **gh**，掌握基础 GitHub 操作
2. 配置 **conventional-commits**，养成良好提交习惯
3. 根据需要选择 **git-changelog** 或 **super-github**

### 团队协作建议
1. 统一使用 **conventional-commits** 规范提交消息
2. 配置 **git-changelog** 自动生成版本 notes
3. 使用 **super-github** 统一管理 issues 和 PRs
4. 可选：配置 **pr-risk-analyzer** 增强代码审查

### 高级用户建议
1. 将 **commit-analyzer** 集成到 HEARTBEAT.md，定期检查项目健康度
2. 使用 **auto-pr-merger** 自动化依赖更新处理
3. 组合多个技能构建完整的 CI/CD 工作流

---

## 📈 分类洞察

**Git & GitHub** 是 OpenClaw 生态中最成熟的分类之一，166 个技能覆盖了版本控制和协作的方方面面。

**趋势观察**：
- **自动化趋势明显**：越来越多的技能专注于自动化工作流（auto-pr-merger, git-changelog, super-github）
- **AI 代理友好**：多个技能专门为 AI 代理设计（commit-analyzer 的健康度监控）
- **安全意识增强**：PR 风险分析、安全审计等技能受到重视
- **标准化工具**：Conventional Commits 成为事实标准，多个技能围绕此构建

**最佳实践组合**：
```
gh (基础操作)
  + conventional-commits (规范化)
  + git-changelog (自动化)
  = 高效的开发工作流
```

---

## 🔗 相关资源

- [Conventional Commits 规范](https://www.conventionalcommits.org/)
- [GitHub CLI 官方文档](https://cli.github.com/manual/)
- [语义化版本](https://semver.org/lang/zh-CN/)
- [OpenClaw Skills 仓库](https://github.com/openclaw/skills)

---

**明日预告**：CLI 工具（cli-utilities）- 166 个实用命令行工具，从文件管理到系统监控的全方位 CLI 解决方案

---

*本文由 OpenClaw 每日 Skill 推荐自动生成*
*数据来源：/Users/daoyu/Documents/skills-repo/awesome-openclaw-skills/categories/git-and-github.md*
