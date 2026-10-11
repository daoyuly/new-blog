/* global hexo */
'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { preparePosts, prepareForFormat, collection, emptyFeed, repairRssGuid, repairAtomUpdated } = require('../lib/feed-policy');
const officialGenerator = require('hexo-generator-feed/lib/generator');
const { full_url_for, encodeURL } = require('hexo-util');
const manifestPath = path.join(hexo.base_dir, '.rss-build/manifest.json');
let manifest;

hexo.extend.filter.register('before_generate', () => {
  const previousFeeds = fs.existsSync(manifestPath)
    ? JSON.parse(fs.readFileSync(manifestPath, 'utf8')).feeds || [] : [];
  fs.rmSync(manifestPath, { force: true });
  const config = hexo.config.feed;
  const types = Array.isArray(config.type) ? config.type : [config.type];
  const paths = Array.isArray(config.path) ? config.path : [config.path];
  const feeds = types.map((type, index) => ({ type, path: paths[index] }));
  for (const feed of [...previousFeeds, ...feeds]) {
    hexo.route.remove(feed.path);
    fs.rmSync(path.join(hexo.public_dir, feed.path), { force: true });
  }
  manifest = { generatedAt: new Date().toISOString(), enabled: config.enable !== false,
    siteUrl: hexo.config.url, limit: config.limit, feeds, entries: [] };
  if (config.enable === false) {
    for (const feed of feeds) delete hexo.extend.generator.list()[feed.type];
    return;
  }
  for (const feed of feeds) {
    hexo.extend.generator.register(feed.type, locals => {
      const posts = preparePosts(locals.posts.toArray(), config, new Date(manifest.generatedAt));
      const selected = config.limit ? posts.slice(0, config.limit) : posts;
      manifest.entries = selected.map(post => ({
        id: encodeURL(full_url_for.call(hexo, post.permalink)), title: post.title,
        published: post.date.toDate().toISOString(), updated: post.updated.toDate().toISOString(),
        summary: post.feedSummary
      }));
      if (!posts.length) return emptyFeed(hexo.config, feed.type, feed.path);
      const result = officialGenerator.call(hexo, { ...locals, posts: collection(prepareForFormat(posts, feed.type)) }, feed.type, feed.path);
      return feed.type === 'rss2' ? repairRssGuid(result) : repairAtomUpdated(result, selected);
    });
  }
});

hexo.extend.filter.register('after_generate', () => {
  fs.mkdirSync(path.dirname(manifestPath), { recursive: true });
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + '\n');
});
