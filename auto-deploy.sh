#!/bin/bash
set -e

ROOT="$(cd "$(dirname "$0")" && pwd)"
cd "$ROOT"

# 1. 构建
npm run build
cd ./public
rm -rf ./.DS_Store

# 2. 通过 git status 找到新增和修改的文件
cd "$ROOT"
git add .

# 3. 只上传新增和修改的文件
scp -r ./* root@8.147.135.17:/usr/share/nginx/html/

# 4. 上传后 git 提交所有变更
if ! git diff --staged --quiet; then
  git add .
  git commit -m "auto deploy: $(date '+%Y-%m-%d %H:%M')"
  git push origin main
fi

