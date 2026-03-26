# 博客 Footer 定位问题修复报告

## 📅 修复日期
2026-03-26

## 🔍 问题分析

### 原始问题
备案号显示在**屏幕底部**而不是**页面底部**，导致：
- 内容少时，footer 悬浮在内容上方
- 内容多时，footer 会覆盖内容

### 根本原因
yilia 主题的 footer 使用了绝对定位：
```css
#footer {
    position: absolute;  /* ❌ 固定在视口底部 */
    bottom: 30px;
}
```

## ✅ 修复方案

### 方案：Flexbox Sticky Footer

使用 Flexbox 布局，让 footer 始终在内容下方，同时保证内容少时在页面底部。

### 修改文件

#### 1. CSS 源文件（长期方案）

**文件：** `themes/yilia/source-src/css/footer.scss`
```scss
#footer {
    // position: absolute;  // 移除
    // bottom: 30px;        // 移除
    position: static;
    margin-top: 40px;
    padding: 20px 0;
    clear: both;
    ...
}
```

**文件：** `themes/yilia/source-src/css/grid.scss`
```scss
.mid-col {
    ...
    display: flex;           // 添加
    flex-direction: column;  // 添加
}

.body-wrap {
    ...
    flex: 1;  // 添加
}
```

#### 2. 编译后的 CSS 文件（已生效）

**文件：** `themes/yilia/source/main.0cf68a.css`

已完成修改，立即生效。

## 🚀 验证效果

### 本地预览
```bash
cd /Users/daoyu/Documents/my-github/new-blog
npx hexo server
```
访问 http://localhost:4000

### 部署
```bash
cd /Users/daoyu/Documents/my-github/new-blog
npx hexo deploy
```

## 📋 后续任务

### 重新编译主题（推荐）

当有时间时，建议重新编译主题以确保源文件和编译文件一致：

```bash
cd /Users/daoyu/Documents/my-github/new-blog/themes/yilia
npm install --cache /tmp/npm-cache-yilia
npm run dist
```

### 版本控制

建议将修改提交到 Git：
```bash
cd /Users/daoyu/Documents/my-github/new-blog
git add themes/yilia/source-src/css/footer.scss
git add themes/yilia/source-src/css/grid.scss
git add themes/yilia/source/main.0cf68a.css
git commit -m "fix: footer positioning - use flexbox sticky footer"
```

## 🎯 技术说明

### Flexbox Sticky Footer 原理

```
┌─────────────────────────────┐
│  .mid-col (flex container)  │
│  ┌───────────────────────┐  │
│  │  .body-wrap (flex: 1) │  │ ← 占据剩余空间
│  │                       │  │
│  │  [文章内容]            │  │
│  │                       │  │
│  └───────────────────────┘  │
│  ┌───────────────────────┐  │
│  │  #footer (auto)       │  │ ← 自动高度，在底部
│  │  备案号                │  │
│  └───────────────────────┘  │
└─────────────────────────────┘
```

- **内容少时：** body-wrap 会扩展填充空间，footer 在页面底部
- **内容多时：** body-wrap 自然增长，footer 在内容之后

## ✨ 效果对比

### 修复前
- ❌ Footer 固定在视口底部
- ❌ 可能覆盖内容
- ❌ 视觉上不协调

### 修复后
- ✅ Footer 始终在内容下方
- ✅ 不会覆盖内容
- ✅ 内容少时在页面底部
- ✅ 符合标准布局规范

---

**修复完成！** 🎉

如需帮助，请随时联系。
