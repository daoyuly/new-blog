'use strict';

const PAPER_PATTERN = /(日报|周报|综述|速递|arxiv|daily|weekly)/i;

const TOPICS = [
  { title: 'GPU 学习日报', path: '/topics/gpu-learning/' },
  { title: 'AI Agent 工程师', path: '/topics/agent-engineer/' },
  { title: 'Agent 与情绪', path: '/topics/agent-emotion/' },
  { title: 'Agentic Design Patterns', path: '/topics/agentic-design-patterns/' },
  { title: 'Agent设计指南', path: '/topics/agent-design-guide/' },
  { title: '软件设计的哲学', path: '/topics/software-design-philosophy/' },
  { title: '学习之美', path: '/topics/beauty-of-learning/' },
  { title: 'Claude Code 探究', path: '/topics/claude-code/' },
  { title: 'OpenClaw 工作坊', path: '/topics/openclaw-workshop/' }
];

const SERIAL_TOPICS = [
  { title: 'AI Agent 工程师', path: '/topics/agent-engineer/' },
  { title: 'GPU 学习日报', path: '/topics/gpu-learning/' }
];

function categoryText(post) {
  const categories = post && post.categories;
  if (!categories) return '';
  const list = typeof categories.toArray === 'function' ? categories.toArray() : categories;
  if (!list || typeof list.map !== 'function') return '';
  return list.map(item => {
    if (!item) return '';
    if (typeof item === 'string') return item;
    return item.name || '';
  }).join(' ');
}

function laneOf(post) {
  const title = String((post && post.title) || '');
  if (/Skill 每日|OpenClaw Skill/i.test(title)) return 'skill';
  if (/项目深度分析|项目报告/.test(title)) return 'teardown';
  if (/Agent 工程师|GPU 学习/.test(title)) return 'serial';
  if (PAPER_PATTERN.test(title) || PAPER_PATTERN.test(categoryText(post))) return 'paper';
  return 'essay';
}

function dateValue(post) {
  if (!post || post.date == null || post.date === '') return 0;
  if (typeof post.date !== 'string' && typeof post.date.valueOf === 'function') {
    const value = post.date.valueOf();
    if (typeof value === 'number' && !Number.isNaN(value)) return value;
  }
  const parsed = new Date(post.date).valueOf();
  return Number.isNaN(parsed) ? 0 : parsed;
}

function sortByDateDesc(posts) {
  return posts.slice().sort((a, b) => dateValue(b) - dateValue(a));
}

function partition(posts) {
  const buckets = { skill: [], teardown: [], serial: [], paper: [], essay: [] };
  (posts || []).forEach(post => {
    buckets[laneOf(post)].push(post);
  });
  Object.keys(buckets).forEach(key => {
    buckets[key] = sortByDateDesc(buckets[key]);
  });
  return buckets;
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function joinRoot(root, postPath) {
  const base = !root || root === '/' ? '' : String(root).replace(/\/$/, '');
  const rel = String(postPath || '').replace(/^\//, '');
  return `${base}/${rel}`;
}

function formatDate(post) {
  if (post && post.date && typeof post.date.format === 'function') {
    return post.date.format('YYYY-MM-DD');
  }
  return '';
}

function renderPostList(posts, root) {
  if (!posts || !posts.length) {
    return '<p class="topic-list-empty">暂无内容。</p>';
  }
  const items = posts.map(post => {
    const href = escapeHtml(joinRoot(root, post.path));
    const title = escapeHtml(post.title || '');
    const date = escapeHtml(formatDate(post));
    return `<a class="topic-list-item" href="${href}"><div class="topic-list-item__main"><h3 class="topic-list-item__title">${title}</h3></div><span class="topic-list-item__meta">${date}</span></a>`;
  }).join('\n');
  return `<div class="topic-list">\n${items}\n</div>`;
}

module.exports = {
  PAPER_PATTERN,
  TOPICS,
  SERIAL_TOPICS,
  laneOf,
  partition,
  sortByDateDesc,
  renderPostList
};
