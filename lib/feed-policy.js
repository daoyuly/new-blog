'use strict';

const { parse } = require('hexo-front-matter');
const { stripHTML, unescapeHTML, escapeHTML } = require('hexo-util');
const { generateAtomFeed, generateRssFeed, parseRssFeed, parseAtomFeed } = require('feedsmith');

// Only the feed receives these copies; Hexo's models and other generators stay intact.
function preparePosts(posts, config, now = new Date()) {
  return posts.filter(post => post.draft !== true && post.published !== false && post.feed !== false)
    .filter(post => {
      if (!post.date || !Number.isFinite(post.date.valueOf())) throw new Error(`Invalid feed date: ${post.source}`);
      return post.date.valueOf() <= now.valueOf();
    }).map(post => {
      const metadata = parse(post.raw || '');
      let updated = post.date;
      if (Object.prototype.hasOwnProperty.call(metadata, 'updated')) {
        const value = metadata.updated;
        const date = typeof value === 'string' || value instanceof Date ? new Date(value) : null;
        if (!date || !Number.isFinite(date.valueOf())) throw new Error(`Invalid explicit updated: ${post.source}`);
        // Hexo has already applied its configured timezone to valid explicit dates.
        updated = post.updated;
        if (!updated || !Number.isFinite(updated.valueOf())) throw new Error(`Invalid parsed updated: ${post.source}`);
      }
      const explicit = post.description || post.intro || post.excerpt;
      let summary = unescapeHTML(stripHTML(String(explicit || post.content || '')))
        .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '').replace(/\s+/g, ' ').trim();
      if (!explicit) summary = Array.from(summary).slice(0, config.content_limit || 200).join('').trim();
      const copy = Object.create(post);
      Object.defineProperties(copy, {
        updated: { value: updated, enumerable: true },
        description: { value: escapeHTML(summary), enumerable: true },
        feedSummary: { value: summary, enumerable: true },
        intro: { value: '', enumerable: true },
        excerpt: { value: '', enumerable: true },
        content: { value: '', enumerable: true }
      });
      return copy;
    }).sort((a, b) => b.date.valueOf() - a.date.valueOf());
}

// The upstream generator uses only this documented collection-shaped surface.
function collection(posts) {
  return {
    length: posts.length,
    sort() { return collection([...posts].sort((a, b) => b.date.valueOf() - a.date.valueOf())); },
    filter(fn) { return collection(posts.filter(fn)); },
    limit(n) { return collection(posts.slice(0, n)); },
    first() { return posts[0]; },
    toArray() { return posts; }
  };
}

// feedsmith 2.9.0 emits Atom summary without type, which means plain text.
function prepareForFormat(posts, type) {
  if (type !== 'atom') return posts;
  return posts.map(post => {
    const copy = Object.create(post);
    Object.defineProperty(copy, 'description', { value: post.feedSummary, enumerable: true });
    return copy;
  });
}

function emptyFeed(config, type, path) {
  const url = config.url.replace(/\/?$/, '/');
  const self = new URL(path, url).href;
  const author = config.author ? [{ name: config.author }] : undefined;
  const updated = new Date(0);
  const data = type === 'rss2' ? generateRssFeed({
    title: config.title, description: config.subtitle || config.description || config.title,
    link: url, language: config.language, lastBuildDate: updated,
    atom: { links: [{ href: self, rel: 'self', type: 'application/rss+xml' }] }, items: []
  }, { lenient: true }) : generateAtomFeed({
    title: config.title, id: url, subtitle: config.subtitle || config.description,
    updated, authors: author, language: config.language,
    links: [{ href: url, rel: 'alternate' }, { href: self, rel: 'self' }], entries: []
  }, { lenient: true });
  return { path, data };
}

// hexo-generator-feed 4.0.0 passes a string guid; feedsmith 2.9.0 requires an object.
function repairRssGuid(result) {
  const feed = parseRssFeed(result.data);
  for (const item of feed.items || []) {
    item.guid = { value: item.link, isPermaLink: true };
  }
  return { ...result, data: generateRssFeed(feed, { lenient: true }) };
}

function repairAtomUpdated(result, posts) {
  const feed = parseAtomFeed(result.data);
  feed.updated = new Date(Math.max(...posts.map(post => post.updated.valueOf())));
  return { ...result, data: generateAtomFeed(feed, { lenient: true }) };
}

module.exports = { preparePosts, prepareForFormat, collection, emptyFeed, repairRssGuid, repairAtomUpdated };
