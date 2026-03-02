#!/bin/bash
set -e

# 1. 提交到 git
git add .
if ! git diff --staged --quiet; then
  git commit -m "auto deploy: $(date '+%Y-%m-%d %H:%M')"
  git push origin main
fi

# 2. 构建并发布博客
npm run build
cd ./public
rm -rf ./.DS_Store

# 使用 rsync 排除非动态生成/无需同步的文件
rsync -avz --delete \
  --exclude='.DS_Store' \
  --exclude='Thumbs.db' \
  --exclude='*.map' \
  --exclude='*.log' \
  --exclude='.git*' \
  --exclude='*~' \
  ./ blog:/usr/share/nginx/html/

