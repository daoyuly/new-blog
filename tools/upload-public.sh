#!/bin/bash
set -euo pipefail

PROJECT_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$PROJECT_ROOT"

# Recheck the manifest before any network write, including direct invocation.
npm run verify:feed
FEED_PATHS="$(node -e '
  const manifest = require("./.rss-build/manifest.json");
  const feeds = manifest.enabled ? manifest.feeds : [];
  for (const feed of feeds) {
    if (!/^[A-Za-z0-9._-]+\.xml$/.test(feed.path)) {
      throw new Error("Nginx uploader requires root-level XML feed paths");
    }
  }
  console.log(feeds.map(feed => feed.path).join("\n"));
')"

REMOTE_HOST="root@8.147.135.17"
REMOTE_DIR="/usr/share/nginx/html"
cd public
FILES=()
for file in *; do
  [ -e "$file" ] || continue
  IS_FEED=false
  while IFS= read -r feed; do
    if [ "$file" = "$feed" ]; then IS_FEED=true; break; fi
  done <<< "$FEED_PATHS"
  if [ "$IS_FEED" = false ]; then FILES+=("$file"); fi
done
if [ "${#FILES[@]}" -gt 0 ]; then
  scp -r "${FILES[@]}" "$REMOTE_HOST:$REMOTE_DIR/"
fi

# Publish each XML via rename so readers cannot fetch a partially uploaded feed.
while IFS= read -r feed; do
  [ -n "$feed" ] || continue
  TEMP_FILE=".$feed.upload.$$"
  scp "$feed" "$REMOTE_HOST:$REMOTE_DIR/$TEMP_FILE"
  ssh "$REMOTE_HOST" "mv -- '$REMOTE_DIR/$TEMP_FILE' '$REMOTE_DIR/$feed'"
done <<< "$FEED_PATHS"
