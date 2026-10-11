'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { generateAtomFeed, generateRssFeed } = require('feedsmith');
const { parseFeed, checkEntries, checkHtml } = require('../tools/verify-feed');

const entry = { id: 'https://example.com/2026/example/', title: '中文 & <标题>',
  published: '2026-10-10T00:00:00.000Z', updated: '2026-10-10T01:00:00.000Z',
  summary: '摘要 & <代码>' };
const manifest = { enabled: true, siteUrl: 'https://example.com', feeds: [
  { type: 'atom', path: 'atom.xml' }, { type: 'rss2', path: 'rss.xml' }
] };
const safeSummary = '摘要 &amp; &lt;代码&gt;';

function xml(type) {
  if (type === 'atom') return generateAtomFeed({ title: '中文站点', id: manifest.siteUrl,
    updated: new Date(entry.updated), links: [{ rel: 'self', href: 'https://example.com/atom.xml' }],
    entries: [{ id: entry.id, title: entry.title, published: new Date(entry.published),
      updated: new Date(entry.updated), links: [{ href: entry.id }],
      summary: entry.summary }]
  });
  return generateRssFeed({ title: '中文站点', description: '摘要', link: manifest.siteUrl,
    atom: { links: [{ rel: 'self', href: 'https://example.com/rss.xml' }] },
    items: [{ guid: { value: entry.id }, title: entry.title, link: entry.id,
      pubDate: new Date(entry.published), description: safeSummary }]
  });
}

test('structured XML parsing validates both formats with escaped Chinese summaries', () => {
  for (const type of ['atom', 'rss2']) {
    const feed = parseFeed(xml(type), type);
    checkEntries(feed.entries, [entry], type, manifest.siteUrl);
  }
  assert.throws(() => parseFeed('<feed><broken></feed>', 'atom'), /Invalid XML/);
  assert.throws(() => parseFeed('<feed xmlns="wrong"/>', 'atom'));
});

test('validation rejects missing IDs, incorrect dates, duplicate entries, unsafe markup and full content', () => {
  const actual = parseFeed(xml('atom'), 'atom').entries[0];
  const run = value => checkEntries([value], [entry], 'atom', manifest.siteUrl);
  for (const patch of [{ id: '' }, { published: 'bad' }, { updated: '2030-01-01' },
    { summary: '<script>alert(1)</script>' }, { content: 'full body' },
    { link: 'http://example.com/2026/example/' }]) {
    assert.throws(() => run({ ...actual, ...patch }));
  }
  assert.throws(() => checkEntries([actual, actual], [entry, entry], 'atom', manifest.siteUrl), /duplicate/);
});

test('autodiscovery must match both MIME types and configured URLs exactly once', () => {
  const links = '<link rel="alternate" type="application/atom+xml" href="/atom.xml">'
    + '<link rel="alternate" type="application/rss+xml" href="/rss.xml">'
    + '<nav><a href="/subscribe/">RSS 订阅</a></nav><a class="rss" href="/atom.xml">RSS</a>';
  checkHtml(links, manifest);
  checkHtml(links + '<a href="https://example.com/atom.xml">Atom</a>'
    + '<a href="https://example.com/rss.xml">RSS</a>', manifest, true);
  assert.throws(() => checkHtml(links + links, manifest));
  assert.throws(() => checkHtml(links, { ...manifest, enabled: false, feeds: [] }));
  assert.throws(() => checkHtml('<a class="rss">RSS</a>', { ...manifest, enabled: false, feeds: [] }));
  assert.throws(() => checkHtml('<nav><a href="/subscribe/">订阅</a></nav>', { ...manifest, enabled: false }));
  assert.throws(() => checkHtml('<a id="nav-rss-link">RSS</a>', { ...manifest, enabled: false }));
  checkHtml('<p>订阅已关闭</p>', { ...manifest, enabled: false, feeds: [] });
});

test('build input snapshot detects deleted files and changes despite preserved mtime', () => {
  const fs = require('node:fs');
  const os = require('node:os');
  const path = require('node:path');
  const { snapshotInputs } = require('../lib/build-inputs');
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'rss-inputs-'));
  try {
    fs.mkdirSync(path.join(root, 'source'));
    const post = path.join(root, 'source/post.md');
    fs.writeFileSync(post, 'old article');
    const original = snapshotInputs(root);
    const stat = fs.statSync(post);
    fs.writeFileSync(post, 'new article');
    fs.utimesSync(post, stat.atime, stat.mtime);
    assert.notDeepEqual(snapshotInputs(root), original);
    fs.rmSync(post);
    assert.notDeepEqual(snapshotInputs(root), original);
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});
