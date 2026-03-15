---
title: MyClaw 开发日记 - Phase 6: React 管理界面完成
date: 2026-03-15 18:35:00
tags: [myclaw, react, electron, frontend, development]
categories: [项目开发]
---

## 概述

MyClaw 项目的 Phase 6 - React 管理界面开发已完成。本阶段实现了完整的桌面应用前端，包括 8 个功能页面、布局组件、API 服务层和状态管理系统。

## 技术栈

- **React 19** - 最新版本的 React，支持并发特性
- **Vite 6** - 极速构建工具
- **React Router 7** - 路由管理
- **TanStack Query** - 数据请求和缓存
- **Zustand** - 轻量级状态管理
- **Lucide React** - 图标库
- **react-markdown** - Markdown 渲染

## 架构设计

### 目录结构

```
apps/desktop/src/renderer/
├── components/
│   └── layout/          # 布局组件
│       ├── Layout.tsx   # 主布局容器
│       ├── Sidebar.tsx  # 侧边栏导航
│       └── index.ts
├── pages/               # 页面组件
│   ├── Dashboard.tsx    # 概览页
│   ├── Chat.tsx         # 聊天界面
│   ├── Rules.tsx        # 规则管理
│   ├── Providers.tsx    # LLM 提供商
│   ├── Channels.tsx     # 消息通道
│   ├── Permissions.tsx  # 权限控制
│   ├── Stats.tsx        # 使用统计
│   ├── Settings.tsx     # 应用设置
│   └── index.ts
├── services/            # 服务层
│   ├── api.ts           # REST API
│   └── websocket.ts     # WebSocket
├── stores/              # 状态管理
│   └── app.ts           # 全局状态
├── types/               # TypeScript 类型
│   └── index.ts
├── App.tsx              # 根组件
├── index.css            # 全局样式
└── main.tsx             # 入口
```

### 核心设计原则

#### 1. 组件化设计

每个页面都是独立的功能模块，包含自己的状态和逻辑：

```tsx
// 页面组件结构
export function Rules() {
  // 状态管理
  const { rules, setRules } = useAppStore()
  const [search, setSearch] = useState('')
  const [editing, setEditing] = useState<Rule | null>(null)
  
  // 数据加载
  useEffect(() => {
    loadRules()
  }, [])
  
  // 事件处理
  async function handleCreate(input: RuleCreateInput) { ... }
  async function handleUpdate(id: string, updates: Partial<Rule>) { ... }
  
  // 渲染
  return ( ... )
}
```

#### 2. 状态管理策略

使用 Zustand 进行轻量级状态管理：

```tsx
// stores/app.ts
export const useAppStore = create<AppStore>((set, get) => ({
  // Gateway 状态
  gatewayStatus: null,
  setGatewayStatus: (status) => set({ gatewayStatus: status }),
  
  // 规则管理
  rules: [],
  setRules: (rules) => set({ rules }),
  addRule: (rule) => set((s) => ({ rules: [...s.rules, rule] })),
  
  // WebSocket 连接状态
  wsConnected: false,
  setWsConnected: (connected) => set({ wsConnected: connected }),
}))
```

#### 3. API 服务层封装

统一的 API 调用封装，支持类型推断：

```tsx
// services/api.ts
async function request<T>(path: string, options?: RequestInit): Promise<APIResponse<T>> {
  try {
    const res = await fetch(`${API_BASE}${path}`, {
      headers: { 'Content-Type': 'application/json' },
      ...options,
    })
    const data = await res.json()
    return { success: res.ok, data }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

// 使用示例
export const getRules = () => request<Rule[]>('/rules')
export const createRule = (input: RuleCreateInput) => request<Rule>('/rules', {
  method: 'POST',
  body: JSON.stringify(input),
})
```

#### 4. WebSocket 实时通信

支持自动重连的 WebSocket 服务：

```tsx
// services/websocket.ts
class WebSocketService {
  private reconnectAttempts = 0
  private maxReconnectAttempts = 5
  
  connect(url: string) {
    this.ws = new WebSocket(url)
    
    this.ws.onopen = () => {
      this.reconnectAttempts = 0
      useAppStore.getState().setWsConnected(true)
    }
    
    this.ws.onclose = () => {
      useAppStore.getState().setWsConnected(false)
      this.attemptReconnect(url) // 指数退避重连
    }
    
    this.ws.onmessage = (event) => {
      const message: WSEvent = JSON.parse(event.data)
      this.handleEvent(message)
    }
  }
}
```

## 页面功能

### 1. Dashboard（概览）

- 系统状态显示（版本、平台、运行时间）
- Gateway 控制面板（启动/停止/重启）
- 资源使用监控（CPU/内存）
- 快捷入口链接

### 2. Chat（聊天）

- 多会话管理
- 消息列表展示
- Markdown 渲染
- 打字动画指示器
- 新建/切换会话

### 3. Rules（规则管理）

- 规则列表展示
- 搜索过滤
- 创建/编辑/删除规则
- 启用/禁用切换
- 优先级和标签管理

### 4. Providers（LLM 提供商）

- 7 种提供商支持（OpenAI、Anthropic、Gemini 等）
- API Key 配置
- 模型选择
- 优先级设置
- 启用/禁用控制

### 5. Channels（消息通道）

- 6 种通道支持（Telegram、Discord、WhatsApp 等）
- 通道配置管理
- 状态监控

### 6. Permissions（权限控制）

- 文件路径权限配置
- 访问级别管理（读/写/完全/拒绝）
- 安全提示

### 7. Stats（使用统计）

- 消息数量统计
- Token 使用统计
- 按提供商分布
- 按日期趋势

### 8. Settings（设置）

- 主题切换（亮色/暗色）
- 自动更新设置
- 日志级别配置
- 关于信息

## CSS 设计系统

### CSS 变量

```css
:root {
  --color-primary: #667eea;
  --color-primary-dark: #764ba2;
  --color-success: #10b981;
  --color-warning: #fbbf24;
  --color-danger: #ef4444;
  
  --sidebar-width: 240px;
  --sidebar-collapsed-width: 64px;
  
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.07);
  
  --transition-fast: 0.15s ease;
  --transition-normal: 0.2s ease;
}
```

### 响应式设计

```css
@media (max-width: 900px) {
  .dashboard__grid {
    grid-template-columns: 1fr;
  }
  
  .stats__overview {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .stats__charts {
    grid-template-columns: 1fr;
  }
}
```

## 与 Electron 集成

### Preload 脚本

通过 `window.electronAPI` 暴露 Electron 能力：

```tsx
interface ElectronAPI {
  getAppStatus: () => Promise<AppStatus>
  getGatewayStatus: () => Promise<GatewayStatus>
  getUpdateStatus: () => Promise<UpdateStatus>
  onUpdateStatus: (callback: (status: UpdateStatus) => void) => void
}

// 在 React 中使用
const status = await window.electronAPI.getGatewayStatus()
```

### 主进程通信

```tsx
// App.tsx
useEffect(() => {
  async function loadInitialStatus() {
    if (window.electronAPI) {
      const gatewayStatus = await window.electronAPI.getGatewayStatus()
      setGatewayStatus(gatewayStatus)
    }
  }
  
  loadInitialStatus()
  const interval = setInterval(loadInitialStatus, 5000)
  return () => clearInterval(interval)
}, [])
```

## 构建与打包

### 开发模式

```bash
pnpm dev  # electron-vite dev
```

### 生产构建

```bash
pnpm build  # 构建所有平台
pnpm build:mac    # macOS DMG
pnpm build:win    # Windows NSIS
pnpm build:linux  # Linux AppImage
```

### 构建产物

```
out/
├── main/        # 主进程代码
├── preload/     # 预加载脚本
└── renderer/    # 渲染进程（React 应用）
    ├── index.html
    └── assets/
        ├── index-xxx.css
        └── index-xxx.js
```

## 测试

所有 302 个测试通过 ✅

```
 Tasks:    26 successful, 26 total
Cached:    26 cached, 26 total
Time:      210ms >>> FULL TURBO
```

## 下一步

Phase 7: 消息通道集成
- Telegram Bot 集成
- Discord Bot 集成
- WhatsApp 集成
- Signal 集成
- 飞书集成

## 总结

Phase 6 成功完成了完整的 React 管理界面，包括：

- ✅ 8 个功能页面
- ✅ 完整的 API 服务层
- ✅ WebSocket 实时通信
- ✅ Zustand 状态管理
- ✅ 响应式 CSS 设计系统
- ✅ Electron 集成

项目进度：Day 9 / 26，已完成 6 个阶段。

---

*本文是 MyClaw 开发日记系列的第 9 篇。*
