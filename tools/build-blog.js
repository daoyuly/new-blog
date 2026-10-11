'use strict';

const path = require('node:path');
const fs = require('node:fs');
const assert = require('node:assert/strict');
const { snapshotInputs } = require('../lib/build-inputs');

async function buildBlog(root = path.resolve(__dirname, '..')) {
  const Hexo = require('hexo');
  const blog = new Hexo(root);
  try {
    const inputs = snapshotInputs(root);
    await blog.init();
    // This site's title-based URLs do not use abbrlink; its renderer rewrites source files.
    if (!blog.config.permalink.includes(':abbrlink')) {
      blog.extend.filter.unregister('before_post_render', require('hexo-abbrlink/lib/logic'));
    }
    await blog.call('generate', { concurrency: 4, bail: true });
    await blog.exit();
    assert.deepEqual(snapshotInputs(root), inputs, 'Build inputs changed during generation');
    const manifestPath = path.join(root, '.rss-build/manifest.json');
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    manifest.inputs = inputs;
    fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + '\n');
  } catch (error) {
    await blog.exit(error);
    throw error;
  }
}

module.exports = { buildBlog };

if (require.main === module) {
  buildBlog().catch(error => {
    console.error(`Build failed: ${error.message}`);
    process.exitCode = 1;
  });
}
