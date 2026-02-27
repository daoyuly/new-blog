/**
 * 发布服务：提供 /api/publish 接口，写文件、Git 提交、触发 hexo generate
 * 与 hexo server 分离，部署时运行此服务（同时 serve public 静态文件）
 */
const express = require('express');
const path = require('path');
const fs = require('fs').promises;
const { execSync } = require('child_process');

const app = express();
app.use(express.json());

const ROOT = path.resolve(__dirname, '..');
const POSTS_DIR = path.join(ROOT, 'source', '_posts');
const PUBLISH_PASSWORD = process.env.PUBLISH_PASSWORD || '';

function verifyPassword(pwd) {
  if (!PUBLISH_PASSWORD) {
    console.warn('Warning: PUBLISH_PASSWORD not set, using default "blog123"');
    return pwd === 'blog123';
  }
  return pwd === PUBLISH_PASSWORD;
}

function sanitizeFilename(s) {
  return s.replace(/[<>:"/\\|?*]/g, '').slice(0, 50) || 'untitled';
}

app.post('/api/publish', async (req, res) => {
  const { content, password } = req.body || {};
  if (!content || typeof content !== 'string') {
    return res.status(400).json({ success: false, message: '缺少内容' });
  }
  if (content.length > 500) {
    return res.status(400).json({ success: false, message: '内容不能超过500字' });
  }
  if (!verifyPassword(password)) {
    return res.status(401).json({ success: false, message: '密码错误' });
  }

  const now = new Date();
  const dateStr = now.toISOString().slice(0, 19).replace('T', ' ');
  const title = content.length > 20 ? content.slice(0, 20) + '…' : content;
  const safeTitle = sanitizeFilename(title);
  const filename = `随想-${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}-${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}${String(now.getSeconds()).padStart(2, '0')}.md`;
  const filepath = path.join(POSTS_DIR, filename);

  const frontmatter = `---
title: ${safeTitle}
date: ${dateStr}
---

${content}
`;

  try {
    await fs.writeFile(filepath, frontmatter, 'utf8');

    const relPath = path.relative(ROOT, filepath).replace(/\\/g, '/');
    try {
      execSync(`git add "${relPath}"`, { cwd: ROOT });
      execSync(`git commit -m "publish: ${filename}"`, { cwd: ROOT });
    } catch (gitErr) {
      const msg = (gitErr.stderr || gitErr.stdout || gitErr.message || '').toString();
      if (!/nothing to commit|no changes added to commit/i.test(msg)) throw gitErr;
    }
    execSync('hexo generate', { cwd: ROOT, stdio: 'inherit' });
    try {
      execSync('hexo deploy', { cwd: ROOT, stdio: 'inherit' });
    } catch (deployErr) {
      console.warn('hexo deploy skipped or failed:', deployErr.message);
    }

    res.json({ success: true, message: '发布成功' });
  } catch (err) {
    console.error('Publish error:', err);
    res.status(500).json({
      success: false,
      message: err.message || '发布失败'
    });
  }
});

// 静态文件（hexo generate 后的 public）
const publicDir = path.join(ROOT, 'public');
if (require('fs').existsSync(publicDir)) {
  app.use(express.static(publicDir));
} else {
  console.warn('public/ not found. Run "hexo generate" first.');
}

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server: http://localhost:${PORT}`);
  console.log(`Editor: http://localhost:${PORT}/editor/`);
});
