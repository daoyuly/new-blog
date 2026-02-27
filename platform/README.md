# 随想编辑与发布

手机端短内容（≤500字）编辑、离线存储、发布到博客。

## 使用

1. **构建**：`npm run build` 或 `hexo generate`
2. **启动服务**：`PUBLISH_PASSWORD=你的密码 npm start`
3. 访问 `http://localhost:4000/editor/` 编辑并发布

开发时可用：`npm run dev`（先 generate 再启动服务）

## 配置

- 环境变量 `PUBLISH_PASSWORD`：发布密码，未设置时默认 `blog123`
- 编辑页路径：`/editor/`（已加入主题菜单「随想」）

## 功能

- 纯文本编辑，500 字限制
- IndexedDB 离线草稿
- 发布后自动 git commit、hexo generate、hexo deploy
