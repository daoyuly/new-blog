---
title: "claude-plugins-official 项目深度分析报告"
date: 2026-07-21 11:00:00
tags:
  - open-source
  - ai-repo
  - daily-research
  - deep-analysis
categories:
  - 开源项目研究
---

# claude-plugins-official 项目深度分析报告

> 本报告由 OpenClaw 自动生成（AI 深度分析版）
>
> 研究日期: 2026-07-21
>
> 项目路径: /Users/daoyu/Documents/ai-repo/claude-plugins-official

---

## 📊 项目概览

- **项目名称**: claude-plugins-official
- **文件数量**: 212 个文件
- **主要插件**: 25 个 (agent-sdk-dev, clangd-lsp, code-review, code-simplifier, commit-commands...)

---

> ⚠️ AI 分析失败，本报告基于项目基本信息生成。

## 1. 项目概述

# Claude Code Plugins Directory

A curated directory of high-quality plugins for Claude Code.

> **⚠️ Important:** Make sure you trust a plugin before installing, updating, or using it. Anthropic does not control what MCP servers, files, or other software are included in plugins and cannot verify that they will work as intended or that they won't change. See each plugin's homepage for more information.

## Structure

- **`/plugins`** - Internal plugins developed and maintained by Anthropic
- **`/external_plugins`** - Third-party plugins from partners and the community

## Installation

Plugins can be installed directly from this marketplace via Claude Code's plugin system.

To install, run `/plugin install {plugin-name}@claude-plugin-directory`

or browse for the plugin in `/plugin > Discover`

## Contributing

### Internal Plugins

Internal plugins are developed by Anthropic team members. See `/plugins/example-plugin` for a reference implementation.

### External Plugins

Third-party 

---

## 📁 文件结构示例

```
/Users/daoyu/Documents/ai-repo/claude-plugins-official/plugins/kotlin-lsp/README.md
/Users/daoyu/Documents/ai-repo/claude-plugins-official/plugins/gopls-lsp/README.md
/Users/daoyu/Documents/ai-repo/claude-plugins-official/plugins/feature-dev/agents/code-reviewer.md
/Users/daoyu/Documents/ai-repo/claude-plugins-official/plugins/feature-dev/agents/code-explorer.md
/Users/daoyu/Documents/ai-repo/claude-plugins-official/plugins/feature-dev/agents/code-architect.md
/Users/daoyu/Documents/ai-repo/claude-plugins-official/plugins/feature-dev/README.md
/Users/daoyu/Documents/ai-repo/claude-plugins-official/plugins/feature-dev/.claude-plugin/plugin.json
/Users/daoyu/Documents/ai-repo/claude-plugins-official/plugins/feature-dev/commands/feature-dev.md
/Users/daoyu/Documents/ai-repo/claude-plugins-official/plugins/typescript-lsp/README.md
/Users/daoyu/Documents/ai-repo/claude-plugins-official/plugins/php-lsp/README.md
/Users/daoyu/Documents/ai-repo/claude-plugins-official/plugins/jdtls-lsp/README.md
/Users/daoyu/Documents/ai-repo/claude-plugins-official/plugins/rust-analyzer-lsp/README.md
/Users/daoyu/Documents/ai-repo/claude-plugins-official/plugins/example-plugin/.mcp.json
/Users/daoyu/Documents/ai-repo/claude-plugins-official/plugins/example-plugin/README.md
/Users/daoyu/Documents/ai-repo/claude-plugins-official/plugins/example-plugin/.claude-plugin/plugin.json
/Users/daoyu/Documents/ai-repo/claude-plugins-official/plugins/example-plugin/commands/example-command.md
/Users/daoyu/Documents/ai-repo/claude-plugins-official/plugins/example-plugin/skills/example-skill/SKILL.md
/Users/daoyu/Documents/ai-repo/claude-plugins-official/plugins/learning-output-style/hooks-handlers/session-start.sh
/Users/daoyu/Documents/ai-repo/claude-plugins-official/plugins/learning-output-style/README.md
/Users/daoyu/Documents/ai-repo/claude-plugins-official/plugins/learning-output-style/hooks/hooks.json
/Users/daoyu/Documents/ai-repo/claude-plugins-official/plugins/learning-output-style/.claude-plugin/plugin.json
/Users/daoyu/Documents/ai-repo/claude-plugins-official/plugins/swift-lsp/README.md
/Users/daoyu/Documents/ai-repo/claude-plugins-official/plugins/code-review/README.md
/Users/daoyu/Documents/ai-repo/claude-plugins-official/plugins/code-review/.claude-plugin/plugin.json
/Users/daoyu/Documents/ai-repo/claude-plugins-official/plugins/code-review/commands/code-review.md
/Users/daoyu/Documents/ai-repo/claude-plugins-official/plugins/csharp-lsp/README.md
/Users/daoyu/Documents/ai-repo/claude-plugins-official/plugins/plugin-dev/agents/agent-creator.md
/Users/daoyu/Documents/ai-repo/claude-plugins-official/plugins/plugin-dev/agents/skill-reviewer.md
/Users/daoyu/Documents/ai-repo/claude-plugins-official/plugins/plugin-dev/agents/plugin-validator.md
/Users/daoyu/Documents/ai-repo/claude-plugins-official/plugins/plugin-dev/README.md
...
(共 212 个文件)
```

## 🧩 插件列表 (25个)

### 1. agent-sdk-dev
- **描述**: Claude Agent SDK Development Plugin

### 2. clangd-lsp

### 3. code-review
- **描述**: Automated code review for pull requests using multiple specialized agents with confidence-based scoring

### 4. code-simplifier
- **版本**: 1.0.0
- **描述**: Agent that simplifies and refines code for clarity, consistency, and maintainability while preserving functionality

### 5. commit-commands
- **描述**: Streamline your git workflow with simple commands for committing, pushing, and creating pull requests

### 6. csharp-lsp

### 7. example-plugin
- **描述**: A comprehensive example plugin demonstrating all Claude Code extension options including commands, agents, skills, hooks, and MCP servers

### 8. explanatory-output-style
- **描述**: Adds educational insights about implementation choices and codebase patterns (mimics the deprecated Explanatory output style)

### 9. feature-dev
- **描述**: Comprehensive feature development workflow with specialized agents for codebase exploration, architecture design, and quality review

### 10. frontend-design
- **描述**: Frontend design skill for UI/UX implementation

### 11. gopls-lsp

### 12. hookify
- **描述**: Easily create hooks to prevent unwanted behaviors by analyzing conversation patterns

### 13. jdtls-lsp

### 14. kotlin-lsp

### 15. learning-output-style
- **描述**: Interactive learning mode that requests meaningful code contributions at decision points (mimics the unshipped Learning output style)

### 16. lua-lsp

### 17. php-lsp

### 18. plugin-dev

### 19. pr-review-toolkit
- **描述**: Comprehensive PR review agents specializing in comments, tests, error handling, type design, code quality, and code simplification

### 20. pyright-lsp

### 21. ralph-loop
- **描述**: Continuous self-referential AI loops for interactive iterative development, implementing the Ralph Wiggum technique. Run Claude in a while-true loop with the same prompt until task completion.

### 22. rust-analyzer-lsp

### 23. security-guidance
- **描述**: Security reminder hook that warns about potential security issues when editing files, including command injection, XSS, and unsafe code patterns

### 24. swift-lsp

### 25. typescript-lsp

---

*本报告由 OpenClaw 的 AI 深度分析系统生成*
*如有疑问或需要进一步分析，请联系研究者*
