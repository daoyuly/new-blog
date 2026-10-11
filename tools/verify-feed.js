'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { snapshotInputs } = require('../lib/build-inputs');

const MIME = { atom: 'application/atom+xml', rss2: 'application/rss+xml' };
const list = value => value === undefined ? [] : Array.isArray(value) ? value : [value];
const text = value => typeof value === 'object' && value !== null ? value['#text'] || '' : value || '';

function parseFeed(xml, type) {
  const { XMLParser, XMLValidator } = require('fast-xml-parser');
  const valid = XMLValidator.validate(xml);
  assert.equal(valid, true, `Invalid XML: ${JSON.stringify(valid)}`);
  const parsed = new XMLParser({ ignoreAttributes: false, parseTagValue: false,
    trimValues: true, processEntities: true }).parse(xml);
  if (type === 'atom') {
    const feed = parsed.feed;
    assert.ok(feed, 'Atom root missing');
    assert.equal(feed['@_xmlns'], 'http://www.w3.org/2005/Atom');
    assert.ok(Number.isFinite(Date.parse(feed.updated)), 'Invalid Atom feed updated');
    return { self: list(feed.link).find(link => link['@_rel'] === 'self')?.['@_href'],
      entries: list(feed.entry).map(entry => ({
        id: text(entry.id), title: text(entry.title),
        link: list(entry.link).find(link => !link['@_rel'] || link['@_rel'] === 'alternate')?.['@_href'],
        published: text(entry.published), updated: text(entry.updated),
        summary: text(entry.summary), summaryType: entry.summary?.['@_type'] || 'text',
        content: text(entry.content)
      })) };
  }
  assert.equal(parsed.rss?.['@_version'], '2.0', 'RSS 2.0 root missing');
  assert.ok(parsed.rss.channel, 'RSS channel missing');
  const channel = parsed.rss.channel;
  return { self: list(channel['atom:link']).find(link => link['@_rel'] === 'self')?.['@_href'],
    entries: list(channel.item).map(item => ({
      id: text(item.guid), title: text(item.title), link: text(item.link),
      published: text(item.pubDate), summary: text(item.description),
      content: text(item['content:encoded'])
    })) };
}

function checkEntries(actual, expected, type, siteUrl) {
  const { load } = require('cheerio');
  assert.equal(actual.length, expected.length, `${type}: wrong entry count`);
  const ids = new Set();
  let previousDate = Infinity;
  for (let i = 0; i < actual.length; i++) {
    const entry = actual[i];
    const wanted = expected[i];
    assert.ok(entry.id && !ids.has(entry.id), `${type}: missing or duplicate ID`);
    ids.add(entry.id);
    assert.equal(entry.id, wanted.id, `${type}: wrong entry ID at ${i}`);
    assert.equal(entry.link, wanted.id, `${type}: wrong original link`);
    const url = new URL(entry.link);
    assert.equal(url.protocol, 'https:', 'Entry must use HTTPS');
    assert.equal(url.origin, new URL(siteUrl).origin, 'Entry points outside the site');
    assert.equal(entry.title, wanted.title, `${type}: wrong title`);
    const published = Date.parse(entry.published);
    assert.ok(Number.isFinite(published), `${type}: invalid published date`);
    assert.equal(published, Date.parse(wanted.published), `${type}: wrong published date`);
    assert.ok(published <= previousDate, `${type}: entries not in descending date order`);
    previousDate = published;
    if (type === 'atom') {
      assert.equal(Date.parse(entry.updated), Date.parse(wanted.updated), 'Wrong stable updated date');
    }
    assert.equal(entry.content, '', 'Summary feed must not contain full content');
    if (type === 'atom' && entry.summaryType === 'text') {
      assert.equal(entry.summary, wanted.summary, `${type}: wrong plain text summary`);
      continue;
    }
    assert.ok(type === 'rss2' || entry.summaryType === 'html', 'Unexpected summary type');
    const summary = load(entry.summary, {}, false);
    assert.equal(summary.text(), wanted.summary, `${type}: wrong summary`);
    assert.equal(summary('script, iframe, object, embed').length, 0, 'Unsafe summary markup');
    summary('[href], [src]').each((_, element) => {
      for (const attribute of ['href', 'src']) {
        const value = summary(element).attr(attribute);
        if (value) assert.equal(new URL(value).protocol, 'https:', 'Summary resource must use HTTPS');
      }
    });
  }
}

function checkHtml(html, manifest, subscribePage = false) {
  const { load } = require('cheerio');
  const $ = load(html);
  const tags = $('link[rel="alternate"]').toArray()
    .filter(tag => Object.values(MIME).includes($(tag).attr('type')));
  assert.equal(tags.length, manifest.enabled ? manifest.feeds.length : 0, 'Wrong autodiscovery count');
  for (const feed of manifest.enabled ? manifest.feeds : []) {
    const url = new URL(feed.path, manifest.siteUrl.replace(/\/?$/, '/')).href;
    assert.equal(tags.filter(tag => $(tag).attr('type') === MIME[feed.type]
      && new URL($(tag).attr('href'), manifest.siteUrl).href === url).length, 1,
    `Missing ${feed.type} autodiscovery`);
    if (subscribePage) {
      assert.ok($('a').toArray().some(tag => $(tag).attr('href') === url), 'Subscription link missing');
    }
  }
  if (!manifest.enabled) {
    assert.equal($('a.rss, #nav-rss-link').length, 0, 'RSS icon still visible while disabled');
    assert.equal($('nav a[href="/subscribe/"]').length, 0, 'Subscription menu still visible while disabled');
  } else {
    assert.ok($('nav a[href="/subscribe/"]').length > 0, 'Subscription menu missing');
    assert.ok($('a.rss, #nav-rss-link').length > 0, 'RSS icon missing');
  }
}

function verifyBuild(root = path.resolve(__dirname, '..')) {
  const manifestPath = path.join(root, '.rss-build/manifest.json');
  assert.ok(fs.existsSync(manifestPath), 'Feed manifest missing: run npm run build first');
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  assert.equal(typeof manifest.enabled, 'boolean');
  const generatedAt = Date.parse(manifest.generatedAt);
  assert.ok(Number.isFinite(generatedAt), 'Invalid manifest build timestamp');
  assert.ok(manifest.inputs, 'Build input snapshot missing: use npm run build');
  assert.deepEqual(snapshotInputs(root), manifest.inputs, 'Stale build: source/configuration changed');
  const publicDir = path.join(root, 'public');
  const results = [];
  assert.ok(Array.isArray(manifest.entries) && Array.isArray(manifest.feeds));
  assert.ok(!manifest.limit || manifest.entries.length <= manifest.limit, 'Feed exceeds limit');
  if (!manifest.enabled) {
    assert.equal(manifest.entries.length, 0);
    for (const name of ['atom.xml', 'rss.xml', ...manifest.feeds.map(feed => feed.path)]) {
      assert.ok(!fs.existsSync(path.join(publicDir, name)), `Disabled feed remains: ${name}`);
    }
  }
  for (const feed of manifest.enabled ? manifest.feeds : []) {
    assert.ok(MIME[feed.type], 'Unknown feed type');
    const file = path.resolve(publicDir, feed.path);
    assert.ok(file.startsWith(publicDir + path.sep), 'Feed path escapes public directory');
    assert.ok(fs.existsSync(file), `Feed missing: ${feed.path}`);
    const parsed = parseFeed(fs.readFileSync(file, 'utf8'), feed.type);
    assert.equal(parsed.self, new URL(feed.path, manifest.siteUrl.replace(/\/?$/, '/')).href, 'Wrong self link');
    checkEntries(parsed.entries, manifest.entries, feed.type, manifest.siteUrl);
    results.push(`${feed.path}: ${parsed.entries.length} entries`);
  }
  checkHtml(fs.readFileSync(path.join(publicDir, 'index.html'), 'utf8'), manifest);
  checkHtml(fs.readFileSync(path.join(publicDir, 'subscribe/index.html'), 'utf8'), manifest, true);
  if (manifest.entries.length) {
    const postPath = decodeURIComponent(new URL(manifest.entries[0].id).pathname).replace(/^\//, '');
    checkHtml(fs.readFileSync(path.join(publicDir, postPath, 'index.html'), 'utf8'), manifest);
  }
  return { manifest, results };
}

module.exports = { parseFeed, checkEntries, checkHtml, verifyBuild };

if (require.main === module) {
  try {
    const { results } = verifyBuild();
    console.log(`Feed verification passed: ${results.join('; ') || 'feeds disabled'}`);
  } catch (error) {
    console.error(`Feed verification failed: ${error.message}`);
    process.exitCode = 1;
  }
}
