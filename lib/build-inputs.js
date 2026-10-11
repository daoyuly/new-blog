'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { createHash } = require('node:crypto');

function snapshotInputs(root) {
  const snapshot = {};
  function visit(relative) {
    const file = path.join(root, relative);
    if (!fs.existsSync(file)) return;
    const stat = fs.lstatSync(file);
    if (stat.isSymbolicLink()) {
      snapshot[relative] = `link:${fs.readlinkSync(file)}`;
    } else if (stat.isDirectory()) {
      for (const name of fs.readdirSync(file).sort()) {
        if (name === 'node_modules' || name === '.git' || name === '.DS_Store') continue;
        visit(path.join(relative, name));
      }
    } else {
      snapshot[relative] = createHash('sha256').update(fs.readFileSync(file)).digest('hex');
    }
  }
  for (const relative of ['_config.yml', 'package.json', 'package-lock.json', 'yarn.lock',
    'vercel.json', 'source', 'scripts', 'tools', 'lib', 'themes/yilia']) visit(relative);
  return snapshot;
}

module.exports = { snapshotInputs };
