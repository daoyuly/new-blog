# 🚀 部署指南

## 步骤 1: 验证本地效果
访问 http://localhost:4000/ 检查以下页面：
- [ ] 首页
- [ ] 任意文章页
- [ ] 归档页
- [ ] 标签页

**检查点：**
- Footer 是否在页面底部（不是屏幕底部）
- 滚动页面时 footer 是否不会覆盖内容
- 不同长度内容的页面表现是否正常

## 步骤 2: 提交修改（满意后执行）

```bash
cd /Users/daoyu/Documents/my-github/new-blog

# 添加修改的文件
git add themes/yilia/source-src/css/footer.scss
git add themes/yilia/source-src/css/grid.scss
git add themes/yilia/source/main.0cf68a.css
git add FOOTER-FIX-REPORT.md

# 提交
git commit -m "fix: footer positioning - use flexbox sticky footer"

# 推送到远程
git push origin main
```

## 步骤 3: 部署

### 如果使用 Vercel 自动部署
推送到 GitHub 后，Vercel 会自动部署。

### 如果需要手动部署
```bash
cd /Users/daoyu/Documents/my-github/new-blog
npx hexo deploy
```

## 步骤 4: 验证生产环境

访问你的博客网站：https://www.daoyuly.cn
确认修复效果。

## 停止本地服务器

当验证完成后，可以停止本地服务器：
```bash
# 查找并停止 hexo server
pkill -f "hexo server"
```

---

**完成！** 🎉
