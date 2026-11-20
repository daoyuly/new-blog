'use strict';

const { partition, renderPostList } = require('../lib/content-lanes');

hexo.extend.generator.register('papers', function (locals) {
  const root = this.config.root || '/';
  const papers = partition(locals.posts.toArray()).paper;

  const content = `<div class="biz-page papers-page">
<p class="biz-lead">论文、日报、周报与综述。<a href="/research/">返回研究</a></p>
${renderPostList(papers, root)}
</div>`;

  return {
    path: 'papers/index.html',
    layout: ['page'],
    data: {
      title: '论文与综述',
      path: 'papers/index.html',
      comments: false,
      noDate: true,
      content
    }
  };
});
