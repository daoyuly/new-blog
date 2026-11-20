'use strict';

const {
  TOPICS,
  SERIAL_TOPICS,
  partition,
  sortByDateDesc,
  renderPostList
} = require('../lib/content-lanes');

const PREVIEW = 12;

function page(path, title, content) {
  return {
    path,
    layout: ['page'],
    data: {
      title,
      path,
      comments: false,
      noDate: true,
      content
    }
  };
}

function section(title, allHref, allLabel, posts, root) {
  const preview = posts.slice(0, PREVIEW);
  return `<section class="biz-section">
<h2>${title}</h2>
<p><a href="${allHref}">${allLabel} ${posts.length} 篇</a></p>
${renderPostList(preview, root)}
</section>`;
}

hexo.extend.helper.register('content_lanes', function () {
  const posts = this.site.posts.toArray();
  const buckets = partition(posts);
  const updates = sortByDateDesc([].concat(buckets.skill, buckets.teardown, buckets.serial, buckets.paper));
  return {
    topics: TOPICS,
    updates: updates.slice(0, 8),
    essays: buckets.essay.slice(0, 8)
  };
});

hexo.extend.generator.register('research', function (locals) {
  const root = this.config.root || '/';
  const buckets = partition(locals.posts.toArray());
  const serialLinks = SERIAL_TOPICS.map(item => `<a href="${item.path}">${item.title}</a>`).join(' · ');

  const research = `<div class="biz-page">
<p class="biz-lead">按更新节奏分开的四条线。连载的完整目录在专题里。</p>
${section('论文与综述', '/papers/', '全部', buckets.paper, root)}
${section('项目拆解', '/research/teardowns/', '全部', buckets.teardown, root)}
${section('Skill', '/research/skills/', '全部', buckets.skill, root)}
<section class="biz-section">
<h2>连载</h2>
<p>${serialLinks}</p>
${renderPostList(buckets.serial.slice(0, PREVIEW), root)}
</section>
</div>`;

  return [
    page('research/index.html', '研究', research),
    page('research/skills/index.html', 'Skill', `<div class="biz-page">
<p class="biz-lead">OpenClaw Skill 每日推荐。<a href="/research/">返回研究</a></p>
${renderPostList(buckets.skill, root)}
</div>`),
    page('research/teardowns/index.html', '项目拆解', `<div class="biz-page">
<p class="biz-lead">开源项目拆解与项目报告。<a href="/research/">返回研究</a></p>
${renderPostList(buckets.teardown, root)}
</div>`)
  ];
});
