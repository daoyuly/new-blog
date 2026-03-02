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
CHANGED_FILES=$(git diff --cached --name-only --diff-filter=AM | grep '^public/' || true)

# 3. 只上传新增和修改的文件
if [ -n "$CHANGED_FILES" ]; then
  EXCLUDE_OPTS=(
    --exclude='.DS_Store'
    --exclude='Thumbs.db'
    --exclude='*.map'
    --exclude='*.log'
    --exclude='.git*'
    --exclude='*~'
  )
  echo "$CHANGED_FILES" | sed 's|^public/||' | rsync -avz --files-from=- "${EXCLUDE_OPTS[@]}" ./public/ blog:/usr/share/nginx/html/
  echo "已上传 $(echo "$CHANGED_FILES" | wc -l | tr -d ' ') 个变更文件"
else
  echo "无变更文件，跳过上传"
fi

# 4. 上传后 git 提交所有变更
if ! git diff --staged --quiet; then
  git commit -m "auto deploy: $(date '+%Y-%m-%d %H:%M')"
  git push origin main
fi

