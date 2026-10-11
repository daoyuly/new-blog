'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { XMLParser, XMLValidator } = require('fast-xml-parser');
const { preparePosts, prepareForFormat, collection, emptyFeed, repairRssGuid, repairAtomUpdated } = require('../lib/feed-policy');
const generator = require('hexo-generator-feed/lib/generator');

function date(value) {
  return { valueOf: () => new Date(value).valueOf(), toDate: () => new Date(value) };
}
function post(index = 0, extra = {}) {
  return { title: `中文 & <标题> ${index}`, source: `post-${index}.md`, raw: '---\ntitle: Test\n---\n正文',
    date: date(`2026-01-${String(index % 28 + 1).padStart(2, '0')}T00:00:00Z`),
    updated: date('2030-01-01T00:00:00Z'), permalink: `https://example.com/p${index}/`,
    content: '<p>中文摘要 &amp; 内容</p>', ...extra };
}
const config = { title: '测试站点', subtitle: '中文摘要', author: '作者', url: 'https://example.com',
  language: 'zh-CN', root: '/', feed: { limit: 50, content: false, content_limit: 200, order_by: '-date' } };

test('feed-only filters and boundary time; original objects remain intact', () => {
  const current = post(0, { date: date('2026-10-11T00:00:00Z') });
  const inputs = [current, post(1, { draft: true }), post(2, { published: false }),
    post(3, { feed: false }), post(4, { date: date('2026-10-11T00:00:01Z') })];
  const output = preparePosts(inputs, config.feed, new Date('2026-10-11T00:00:00Z'));
  assert.equal(output.length, 1);
  assert.equal(output[0].updated, current.date);
  assert.equal(current.updated.toDate().getUTCFullYear(), 2030);
  assert.equal(current.content, '<p>中文摘要 &amp; 内容</p>');
});

test('explicit updated respected and invalid explicit values fail', () => {
  const p = post(0, { raw: '---\nupdated: 2026-02-01\n---\n正文', updated: date('2026-02-01') });
  assert.equal(preparePosts([p], config.feed)[0].updated, p.updated);
  for (const value of ['nonsense', 'null', 'false', '123']) {
    assert.throws(() => preparePosts([post(0, { raw: `---\nupdated: ${value}\n---\n正文` })], config.feed), /Invalid explicit updated/);
  }
});

test('Chinese fallback summary uses Unicode characters, strips HTML, decodes entities', () => {
  const output = preparePosts([post(0, { content: '<p>😀中文 &amp; 内容</p>' })], { content_limit: 3 });
  assert.equal(output[0].description, '😀中文');
  assert.equal(preparePosts([post(0, { content: '<p>中文 内容</p>' })], { content_limit: 3 })[0].feedSummary, '中文');
});

test('Atom feed updated reflects the latest included entry update', () => {
  const posts = preparePosts([
    post(1),
    post(0, { raw: '---\nupdated: 2026-08-01\n---\n正文', updated: date('2026-08-01') })
  ], config.feed);
  const output = generator.call({ config }, { posts: collection(prepareForFormat(posts, 'atom')) }, 'atom', 'atom.xml');
  const parsed = new XMLParser().parse(repairAtomUpdated(output, posts).data);
  assert.equal(new Date(parsed.feed.updated).valueOf(), new Date('2026-08-01').valueOf());
  assert.ok(parsed.feed.entry.every(entry => new Date(entry.updated) <= new Date(parsed.feed.updated)));
});

test('official plugin serializes both formats, applies limit after policy, preserves IDs', () => {
  const inputs = Array.from({ length: 65 }, (_, index) => post(index));
  inputs.push(post(99, { feed: false }));
  const selected = preparePosts(inputs, config.feed);
  const context = { config };
  const parser = new XMLParser();
  for (const [type, path] of [['atom', 'atom.xml'], ['rss2', 'rss.xml']]) {
    let result = generator.call(context, { posts: collection(prepareForFormat(selected, type)) }, type, path);
    if (type === 'rss2') result = repairRssGuid(result);
    assert.equal(XMLValidator.validate(result.data), true);
    const parsed = parser.parse(result.data);
    const items = type === 'atom' ? parsed.feed.entry : parsed.rss.channel.item;
    assert.equal(items.length, 50);
    assert.equal(type === 'atom' ? items[0].id : items[0].guid, selected[0].permalink);
    assert.equal(type === 'atom' ? items[0].summary : items[0].description, type === 'atom' ? '中文摘要 & 内容' : '中文摘要 &amp; 内容');
  }
});

test('empty feeds retain valid structure and correct self URLs', () => {
  const parser = new XMLParser({ ignoreAttributes: false });
  for (const [type, path] of [['atom', 'atom.xml'], ['rss2', 'rss.xml']]) {
    const result = emptyFeed(config, type, path);
    assert.equal(XMLValidator.validate(result.data), true);
    const parsed = parser.parse(result.data);
    assert.ok(type === 'atom' ? parsed.feed : parsed.rss.channel);
    assert.equal(type === 'atom' ? parsed.feed.entry : parsed.rss.channel.item, undefined);
  }
});

test('Hexo loads adapter, registers generators and writes a current manifest', async () => {
  const fs = require('node:fs');
  const os = require('node:os');
  const path = require('node:path');
  const Hexo = require('hexo');
  const base = fs.mkdtempSync(path.join(os.tmpdir(), 'rss-policy-'));
  const hexo = new Hexo(base);
  hexo.config = { ...hexo.config, ...config, feed: { ...config.feed, enable: true,
    type: ['atom', 'rss2'], path: ['atom.xml', 'rss.xml'] } };
  hexo.extend.generator.register('atom', () => undefined);
  hexo.extend.generator.register('rss2', () => undefined);
  try {
    await hexo.loadPlugin(path.resolve(__dirname, '../scripts/feed-policy.js'));
    await hexo.extend.filter.exec('before_generate', null, { context: hexo });
    const locals = { posts: { toArray: () => [post(0)] } };
    for (const type of ['atom', 'rss2']) {
      const output = await hexo.extend.generator.get(type).call(hexo, locals);
      assert.equal(XMLValidator.validate(output.data), true);
    }
    await hexo.extend.filter.exec('after_generate', null, { context: hexo });
    const manifest = JSON.parse(fs.readFileSync(path.join(base, '.rss-build/manifest.json')));
    assert.equal(manifest.entries.length, 1);
    assert.equal(manifest.entries[0].updated, manifest.entries[0].published);
    assert.equal(manifest.feeds.length, 2);
    const emptyLocals = { posts: { toArray: () => [post(0, { feed: false })] } };
    for (const type of ['atom', 'rss2']) {
      const output = await hexo.extend.generator.get(type).call(hexo, emptyLocals);
      assert.equal(XMLValidator.validate(output.data), true);
    }
    await hexo.extend.filter.exec('after_generate', null, { context: hexo });
    assert.equal(JSON.parse(fs.readFileSync(path.join(base, '.rss-build/manifest.json'))).entries.length, 0);
    hexo.config.feed.enable = false;
    await hexo.extend.filter.exec('before_generate', null, { context: hexo });
    await hexo.extend.filter.exec('after_generate', null, { context: hexo });
    assert.equal(hexo.extend.generator.get('atom'), undefined);
    assert.equal(hexo.extend.generator.get('rss2'), undefined);
    const disabled = JSON.parse(fs.readFileSync(path.join(base, '.rss-build/manifest.json')));
    assert.equal(disabled.enabled, false);
    assert.deepEqual(disabled.entries, []);
    assert.equal(disabled.feeds.length, 2);
    hexo.config.feed.enable = true;
    await hexo.extend.filter.exec('before_generate', null, { context: hexo });
    assert.ok(hexo.extend.generator.get('atom'));
    assert.ok(hexo.extend.generator.get('rss2'));
    const enabledOutput = await hexo.extend.generator.get('atom').call(hexo, locals);
    assert.equal(XMLValidator.validate(enabledOutput.data), true);
    await hexo.extend.filter.exec('after_generate', null, { context: hexo });
    fs.mkdirSync(hexo.public_dir, { recursive: true });
    fs.writeFileSync(path.join(hexo.public_dir, 'atom.xml'), 'old feed');
    hexo.config.feed.path = ['new-atom.xml', 'new-rss.xml'];
    await hexo.extend.filter.exec('before_generate', null, { context: hexo });
    assert.equal(fs.existsSync(path.join(hexo.public_dir, 'atom.xml')), false);
  } finally {
    fs.rmSync(base, { recursive: true, force: true });
  }
});

test('literal escaped tags stay text in Atom text and RSS HTML summaries', () => {
  const { load } = require('cheerio');
  const parser = new XMLParser({ ignoreAttributes: false });
  const posts = preparePosts([post(0, { description: '&lt;script&gt;alert(1)&lt;/script&gt; &lt;img src=x onerror=alert(1)&gt;' })], config.feed);
  assert.equal(posts[0].feedSummary, '<script>alert(1)</script> <img src=x onerror=alert(1)>');
  for (const [type, path] of [['atom', 'atom.xml'], ['rss2', 'rss.xml']]) {
    let output = generator.call({ config }, { posts: collection(prepareForFormat(posts, type)) }, type, path);
    if (type === 'rss2') output = repairRssGuid(output);
    const parsed = parser.parse(output.data);
    const node = type === 'atom' ? parsed.feed.entry.summary : parsed.rss.channel.item.description;
    const summary = typeof node === 'string' ? node : node['#text'];
    if (type === 'atom') {
      assert.equal(typeof node, 'string');
      assert.equal(summary, posts[0].feedSummary);
      continue;
    }
    const $ = load(summary, {}, false);
    assert.equal($('script,img').length, 0);
    assert.equal($.root().text(), posts[0].feedSummary);
  }
});
