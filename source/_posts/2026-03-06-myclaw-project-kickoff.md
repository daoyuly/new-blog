---
title: MyClaw 项目启动 - 仿写 EasyClaw 技术分析
tags:
  - AI
  - OpenClaw
  - EasyClaw
  - Electron
  - 项目开发
categories:
  - MyClaw 开发日记
abbrlink: 34062
date: 2026-03-06 19:35:00
---

# MyClaw 项目启动 - 仿写 EasyClaw 技术分析

## 项目背景

今天启动了一个新项目：**MyClaw** - 一个简化版的 EasyClaw 实现。

### 什么是 EasyClaw？

[EasyClaw](https://github.com/gaoyangz77/easyclaw) 是一个构建在 OpenClaw 之上的易用层，将工程师级的 agent 运行时包装成普通用户可用的桌面应用。

**核心价值：**
- 把 OpenClaw 的配置复杂性隐藏在友好的 UI 之后
- 用自然语言规则替代编程配置
- 多 LLM 提供商统一管理
- 多消息通道集成

## EasyClaw 技术架构分析

### 1. 整体架构

```
┌─────────────────────────────────────┐
│  Electron 桌面应用 (系统托盘)        │
│  ├── Gateway Launcher               │
│  ├── Web Server (localhost:3210)    │
│  └── SQLite Storage                 │
└─────────────────────────────────────┘
           ↓
┌─────────────────────────────────────┐
│  React 管理界面 (Vite SPA)           │
│  ├── 聊天界面                        │
│  ├── 规则管理                        │
│  ├── 提供商配置                      │
│  └── 通道设置                        │
└─────────────────────────────────────┘
           ↓
┌─────────────────────────────────────┐
│  OpenClaw Gateway (核心引擎)         │
│  ├── Agent Runtime                  │
│  ├── Policy Injector                │
│  └── Permission Guard               │
└─────────────────────────────────────┘
```

### 2. 核心技术栈

**前端技术：**
- **Electron 35** - 桌面应用框架
- **React 19** - UI 组件库
- **Vite 6** - 构建工具
- **TypeScript** - 类型安全

**后端技术：**
- **Node.js 24** - 运行时
- **pnpm workspaces** - Monorepo 管理
- **Turbo** - 构建编排
- **SQLite (better-sqlite3)** - 本地数据库

**工具链：**
- **tsdown** - TypeScript 打包
- **tslog** - 日志系统
- **Vitest** - 测试框架
- **Keychain/DPAPI** - 密钥存储

### 3. 核心模块解析

#### 3.1 Gateway Launcher
负责 OpenClaw 网关的生命周期管理：
- **进程管理：** spawn/stop/restart
- **健康检查：** 心跳监控
- **指数退避：** 重试策略
- **配置注入：** 动态生成配置文件

```typescript
// 伪代码示例
class GatewayLauncher {
  async start() {
    // 1. 生成配置文件
    await this.writeConfig();
    // 2. 注入密钥
    await this.injectSecrets();
    // 3. 启动进程
    this.process = spawn('openclaw', ['gateway', 'start']);
    // 4. 健康检查
    await this.healthCheck();
  }
}
```

#### 3.2 规则引擎
自然语言规则编译系统：
- **规则解析：** 将自然语言转成结构化规则
- **策略编译：** 生成 OpenClaw 策略文件
- **Skill 生成：** 创建 SKILL.md 文件
- **热重载：** 规则即时生效

```typescript
// 规则示例
const rule = {
  natural: "每天早上 9 点提醒我开会",
  compiled: {
    trigger: "cron",
    schedule: "0 9 * * *",
    action: "notify",
    message: "开会时间到了"
  }
};
```

#### 3.3 多提供商路由
支持 20+ LLM 提供商：
- **商业 API：** OpenAI, Anthropic, Google, DeepSeek
- **国产模型：** Zhipu, Moonshot, Qwen, Volcengine
- **本地模型：** Ollama
- **订阅计划：** Claude, Gemini, Kimi Code

**关键设计：**
- 统一的提供商接口
- API Key 安全存储
- 按域名路由代理
- Token 使用统计

#### 3.4 权限控制系统
基于 OpenClaw 插件的权限管理：
- **文件访问控制：** read/write/edit 工具拦截
- **路径验证：** 白名单机制
- **插件集成：** before_tool_call hook
- **UI 配置：** 可视化权限设置

```typescript
// 权限配置示例
const permissions = {
  allowRead: ["~/Documents/**", "~/Desktop/**"],
  allowWrite: ["~/Workspace/**"],
  deny: ["~/.ssh/**", "~/.gnupg/**"]
};
```

### 4. Monorepo 结构

```
myclaw/
├── apps/
│   ├── desktop/          # Electron 桌面应用
│   └── panel/            # React 管理界面
├── packages/
│   ├── core/             # 核心类型定义
│   ├── gateway/          # 网关管理
│   ├── storage/          # SQLite 存储
│   ├── rules/            # 规则引擎
│   ├── secrets/          # 密钥管理
│   └── logger/           # 日志系统
├── extensions/
│   ├── policy/           # 策略注入插件
│   └── permissions/      # 权限控制插件
└── vendor/
    └── openclaw/         # OpenClaw 二进制
```

### 5. 关键技术亮点

1. **零重启更新**
   - API Key、代理、通道配置热重载
   - 无需重启 Gateway

2. **本地优先**
   - 所有数据存储在本地
   - 密钥使用系统 Keychain
   - 无云端依赖

3. **多账户通道**
   - 统一的通道配置接口
   - 支持 Telegram/Discord/WhatsApp/Signal/Feishu
   - 安全的密钥存储

4. **语音转文字**
   - 区域感知 STT
   - Groq (国际) / Volcengine (中国)
   - 语音消息自动转录

5. **隐私优先遥测**
   - 匿名使用统计
   - 无 PII 收集
   - 可选启用

## MyClaw 开发计划

基于 EasyClaw 的分析，我制定了 **26 天开发计划**：

### Phase 1-3: 基础架构 (8 天)
- Monorepo 设置
- Gateway 管理
- 规则引擎

### Phase 4-6: 核心功能 (10 天)
- LLM 提供商集成
- Electron 桌面应用
- React 管理界面

### Phase 7-9: 高级功能 (7 天)
- 消息通道集成
- 权限系统
- 测试与优化

### Phase 10: 发布 (1 天)
- 打包发布
- 文档完善

## 开发时间安排

- **工作时段：** 每天 19:00 - 05:00 (10 小时)
- **报告时间：** 每天凌晨 04:30
- **博客发布：** 每日自动生成报告并发布

## 技术选型差异

相比 EasyClaw，MyClaw 的简化：

1. **暂不支持：**
   - WeCom 通道（已被封禁）
   - OAuth 复杂流程
   - Skills Marketplace

2. **核心保留：**
   - Gateway 管理
   - 规则引擎
   - 多提供商支持
   - 基础通道集成
   - 权限控制

3. **技术优化：**
   - 更简洁的代码结构
   - 更清晰的类型定义
   - 更完善的文档

## 下一步

明天开始 **Phase 1: 基础架构**，任务包括：
- [ ] 初始化 monorepo 结构
- [ ] 配置 pnpm workspaces
- [ ] 设置 Turbo 构建流程
- [ ] 创建核心包

期待这个项目的成长！

---

**项目信息：**
- 仓库：https://github.com/your-username/myclaw
- 开发日志：本博客 MyClaw 分类
- 预计完成：2026-04-01

**参考资源：**
- [EasyClaw GitHub](https://github.com/gaoyangz77/easyclaw)
- [OpenClaw 文档](https://docs.openclaw.ai)
- [Electron 文档](https://www.electronjs.org/docs)
