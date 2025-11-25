# Hexo 升级指南

## 升级概述

本次升级将 Hexo 从 **4.2.0** 升级到 **7.2.0**，同时更新所有相关依赖包。

## 升级前准备

### 1. 备份数据（重要！）

```bash
# 备份整个博客目录
cp -r /Users/umu/Documents/tech/my-github/new-blog /Users/umu/Documents/tech/my-github/new-blog-backup
```

### 2. 检查 Node.js 版本

Hexo 7.x 要求 Node.js >= 14.0.0，建议使用 Node.js 16+ 或 18+。

```bash
node --version
```

如果版本低于 14.0.0，请先升级 Node.js：
- 访问 https://nodejs.org/ 下载最新 LTS 版本
- 或使用 nvm: `nvm install 18 && nvm use 18`

## 升级步骤

### 1. 清理旧的依赖

```bash
cd /Users/umu/Documents/tech/my-github/new-blog
rm -rf node_modules
rm package-lock.json
```

### 2. 安装新的依赖

```bash
npm install
```

### 3. 验证安装

```bash
npx hexo version
# 应该显示 7.2.0 或更高版本
```

### 4. 测试生成

```bash
# 清理旧的生成文件
npm run clean

# 生成新的静态文件
npm run build

# 启动本地服务器测试
npm run server
```

访问 http://localhost:4000 检查博客是否正常显示。

## 主要变更说明

### 依赖包更新

- `hexo`: 4.0.0 → 7.2.0
- `hexo-generator-archive`: 1.0.0 → 2.0.0
- `hexo-generator-category`: 1.0.0 → 2.0.0
- `hexo-generator-index`: 1.0.0 → 3.0.0
- `hexo-generator-json-content`: 4.1.6 → 4.3.0
- `hexo-generator-tag`: 1.0.0 → 2.0.0
- `hexo-renderer-ejs`: 1.0.0 → 2.0.0
- `hexo-renderer-marked`: 2.0.0 → 6.0.0
- `hexo-renderer-stylus`: 1.1.0 → 2.1.0
- `hexo-server`: 1.0.0 → 3.0.0

### 主题兼容性

yilia 主题（为 Hexo 2.4+ 设计）应该与 Hexo 7 兼容。如果遇到问题：

1. 检查主题是否有更新：
   ```bash
   cd themes/yilia
   git pull origin master
   ```

2. 如果主题有问题，可以考虑：
   - 使用其他兼容 Hexo 7 的主题
   - 或继续使用当前主题（通常不会有问题）

## 可能遇到的问题

### 1. 插件兼容性问题

如果某个插件不兼容，可以：
- 检查插件是否有更新版本
- 在 GitHub 上查看插件的 issue
- 暂时移除不兼容的插件

### 2. 主题样式问题

如果主题显示异常：
- 清除浏览器缓存
- 检查主题配置文件 `themes/yilia/_config.yml`
- 重新生成静态文件：`npm run clean && npm run build`

### 3. 生成速度变慢

Hexo 7 的生成速度通常更快，如果变慢可能是：
- 文章数量增加
- 插件配置问题
- 可以尝试禁用不必要的插件

## 升级后验证清单

- [ ] 博客首页正常显示
- [ ] 文章列表正常
- [ ] 文章详情页正常
- [ ] 标签页正常
- [ ] 分类页正常
- [ ] 归档页正常
- [ ] 搜索功能正常（如果有）
- [ ] 评论功能正常（如果有）
- [ ] 移动端显示正常
- [ ] 部署脚本正常工作

## 部署

升级完成后，使用原有的部署方式：

```bash
npm run build
# 然后使用 deploy.sh 部署
./deploy.sh
```

## 回滚（如果出现问题）

如果升级后遇到无法解决的问题，可以回滚：

```bash
# 恢复备份
cp -r /Users/umu/Documents/tech/my-github/new-blog-backup/* /Users/umu/Documents/tech/my-github/new-blog/

# 或使用 git 回滚（如果使用 git）
git checkout HEAD -- package.json
npm install
```

## 参考资源

- [Hexo 官方文档](https://hexo.io/zh-cn/docs/)
- [Hexo GitHub](https://github.com/hexojs/hexo)
- [Hexo 7.0 发布说明](https://github.com/hexojs/hexo/releases)

## 需要帮助？

如果遇到问题，可以：
1. 查看 Hexo 官方文档
2. 在 GitHub Issues 中搜索相关问题
3. 检查控制台错误信息

