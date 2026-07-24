'use strict';

// 论文研读列表页:自动收集定时任务生成的日报/周报文章,生成 /papers/
const PATTERN = /(日报|周报|综述|速递|arxiv|daily|weekly)/i;

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

hexo.extend.generator.register('papers', function (locals) {
  const root = this.config.root || '/';

  const posts = locals.posts.toArray()
    .filter(post => {
      const cats = post.categories ? post.categories.map(c => c.name).join(' ') : '';
      return PATTERN.test(post.title || '') || PATTERN.test(cats);
    })
    .sort((a, b) => b.date.valueOf() - a.date.valueOf());

  const items = posts.map(post => {
    const date = post.date.format('YYYY-MM-DD');
    const href = root + post.path;
    return `  <li class="papers-item"><span class="papers-date">${date}</span> · <a href="${href}">${escapeHtml(post.title)}</a></li>`;
  }).join('\n');

  const content = `<div class="biz-page papers-page">
<p class="biz-lead">定时任务自动生成的论文<strong>日报与周报</strong>,共 ${posts.length} 篇,按时间倒序排列。</p>
<ul class="papers-list">
${items}
</ul>
</div>`;

  return {
    path: 'papers/index.html',
    layout: ['page'],
    data: {
      title: '论文研读',
      path: 'papers/index.html',
      comments: false,
      noDate: true,
      content: content
    }
  };
});
