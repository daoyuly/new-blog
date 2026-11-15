'use strict';

// 工作周报发布器: 读取 source/weekly/*.md (不移动文件), 渲染为独立文章页 + 列表页。
// URL 形式: /weekly/:abbrlink.html
// 不进入首页文章流, 通过专属列表页 /weekly/ 入口访问。
// 依赖: hexo-front-matter (已随 hexo 安装), moment (hexo 内置依赖)。

const fs = require('fs');
const path = require('path');
const fm = require('hexo-front-matter');
const moment = require('moment');

const WEEKLY_DIR = path.join(hexo.base_dir, 'source/weekly');

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// 把 front-matter 里的 tags/categories 规整成主题期望的 [{name}] 对象数组
function toTagObjects(val) {
  if (!val) return [];
  let arr = Array.isArray(val) ? val : String(val).split(/[,，]/);
  arr = arr.map(x => String(x).trim()).filter(Boolean);
  return arr.map(name => ({ name }));
}

function loadWeeklyFiles() {
  if (!fs.existsSync(WEEKLY_DIR)) return [];
  return fs.readdirSync(WEEKLY_DIR)
    .filter(f => f.endsWith('.md'))
    .map(f => {
      const full = path.join(WEEKLY_DIR, f);
      const raw = fs.readFileSync(full, 'utf8');
      const parsed = fm.parse(raw);
      const abbrlink = String(parsed.abbrlink || f.replace(/\.md$/, ''));
      const date = parsed.date ? moment(parsed.date) : moment(fs.statSync(full).mtime);
      return {
        source: `source/weekly/${f}`,
        title: parsed.title || f.replace(/\.md$/, ''),
        abbrlink,
        slug: abbrlink,
        date,
        tags: toTagObjects(parsed.tags).length ? toTagObjects(parsed.tags) : [{ name: '周报' }],
        categories: toTagObjects(parsed.categories),
        body: parsed._content || '',
      };
    })
    .sort((a, b) => b.date.valueOf() - a.date.valueOf());
}

hexo.extend.generator.register('weekly', function (locals) {
  const root = this.config.root || '/';
  const posts = loadWeeklyFiles();

  const results = posts.map(p => {
    const html = hexo.render.renderSync({ text: p.body, engine: 'markdown' });
    return {
      path: `weekly/${p.abbrlink}.html`,
      layout: ['post'],
      data: {
        title: p.title,
        date: p.date,
        slug: p.slug,
        abbrlink: p.abbrlink,
        content: html,
        path: `weekly/${p.abbrlink}.html`,
        source: p.source,
        tags: p.tags,
        categories: p.categories,
        comments: false,
        noDate: false,
      }
    };
  });

  // 列表页 /weekly/ — 按年份分组索引
  const listContent = buildYearIndex(posts, root);

  results.push({
    path: 'weekly/index.html',
    layout: ['page'],
    data: {
      title: '工作周报',
      path: 'weekly/index.html',
      comments: false,
      noDate: true,
      content: listContent,
    }
  });

  return results;
});

// 构建按年份分组的索引页 HTML
function buildYearIndex(posts, root) {
  // 按年份分组 (posts 已按日期倒序, 所以年份也呈倒序)
  const groups = {};
  const yearOrder = [];
  for (const p of posts) {
    const y = p.date.format('YYYY');
    if (!groups[y]) { groups[y] = []; yearOrder.push(y); }
    groups[y].push(p);
  }

  // 顶部年份锚点导航
  const nav = yearOrder
    .map(y => `<a class="weekly-nav-link" href="#year-${y}">${y} <span class="weekly-nav-count">(${groups[y].length})</span></a>`)
    .join(' · ');

  // 各年份分组
  const sections = yearOrder.map(y => {
    const items = groups[y].map(p => {
      const d = p.date.format('MM-DD');
      const href = `${root}weekly/${p.abbrlink}.html`;
      return `    <li class="weekly-item"><span class="weekly-date">${d}</span> · <a href="${href}">${escapeHtml(p.title)}</a></li>`;
    }).join('\n');
    return `  <section class="weekly-section" id="year-${y}">
    <h2 class="weekly-year">${y} <span class="weekly-year-count">(${groups[y].length} 篇)</span></h2>
    <ul class="weekly-list">
${items}
    </ul>
  </section>`;
  }).join('\n');

  return `<div class="biz-page weekly-page weekly-index">
  <style>
    .weekly-index .weekly-nav{margin:1.2em 0 2em;padding:.8em 1em;background:#f6f8fa;border-radius:6px;line-height:2;font-size:14px}
    .weekly-index .weekly-nav-link{color:#4a86c5;text-decoration:none;margin-right:.4em}
    .weekly-index .weekly-nav-link:hover{text-decoration:underline}
    .weekly-index .weekly-nav-count{color:#999;font-size:12px}
    .weekly-index .weekly-section{margin-bottom:2.2em}
    .weekly-index .weekly-year{font-size:20px;font-weight:600;border-bottom:1px solid #eee;padding-bottom:.3em;margin:0 0 .8em;color:#333}
    .weekly-index .weekly-year-count{font-size:13px;color:#999;font-weight:400}
    .weekly-index .weekly-list{list-style:none;padding-left:0}
    .weekly-index .weekly-item{padding:.45em 0;border-bottom:1px dashed #f0f0f0;font-size:14px}
    .weekly-index .weekly-item:last-child{border-bottom:none}
    .weekly-index .weekly-date{display:inline-block;width:4.2em;color:#888;font-family:monospace}
    .weekly-index .weekly-item a{color:#4a86c5;text-decoration:none}
    .weekly-index .weekly-item a:hover{text-decoration:underline}
  </style>
  <nav class="weekly-nav">${nav}</nav>
${sections}
</div>`;
}
