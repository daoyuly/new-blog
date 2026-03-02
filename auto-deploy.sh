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
  UPLOAD_COUNT=0
  while IFS= read -r file; do
    [ -z "$file" ] && continue
    # 排除无需上传的文件
    case "$file" in
      *.DS_Store|*Thumbs.db|*.map|*.log|*.git*|*~) continue ;;
    esac
    [ ! -f "$file" ] && continue
    remote_path="/usr/share/nginx/html/$(echo "$file" | sed 's|^public/||')"
    remote_dir=$(dirname "$remote_path")
    ssh blog "mkdir -p $remote_dir"
    scp "$file" "blog:$remote_path"
    ((UPLOAD_COUNT++)) || true
  done <<< "$CHANGED_FILES"
  echo "已上传 $UPLOAD_COUNT 个变更文件"
else
  echo "无变更文件，跳过上传"
fi

# 4. 上传后 git 提交所有变更
if ! git diff --staged --quiet; then
  git add .
  git commit -m "auto deploy: $(date '+%Y-%m-%d %H:%M')"
  git push origin main
fi

