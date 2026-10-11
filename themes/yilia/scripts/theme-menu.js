/* global hexo */

function isMenuGroup(value) {
  return value && typeof value === 'object' && !Array.isArray(value);
}

function feedEntries(config, theme) {
  const feed = config.feed;
  if (!feed) {
    return theme.rss ? [{ type: 'atom', path: theme.rss, label: 'Atom', mime: 'application/atom+xml' }] : [];
  }
  if (feed.enable === false) return [];
  const types = Array.isArray(feed.type) ? feed.type : [feed.type || 'atom'];
  const paths = Array.isArray(feed.path) ? feed.path : [feed.path || 'atom.xml'];
  return types.map((type, index) => ({
    type,
    path: paths[index],
    label: type === 'rss2' ? 'RSS 2.0' : 'Atom',
    mime: type === 'rss2' ? 'application/rss+xml' : 'application/atom+xml'
  })).filter(entry => entry.path && ['atom', 'rss2'].includes(entry.type));
}

hexo.extend.helper.register('rss_feeds', function () {
  return feedEntries(this.config, this.theme);
});

hexo.extend.helper.register('theme_menu_parsed', function () {
  const menu = this.theme.menu || {};
  const keys = Object.keys(menu);
  const items = [];
  for (let i = 0; i < keys.length; i++) {
    const label = keys[i];
    if (label === (this.theme.rss_menu_label || 'RSS 订阅') && !feedEntries(this.config, this.theme).length) continue;
    const val = menu[label];
    if (isMenuGroup(val)) {
      const childKeys = Object.keys(val);
      const children = [];
      for (let j = 0; j < childKeys.length; j++) {
        const cl = childKeys[j];
        children.push({ label: cl, path: val[cl] });
      }
      items.push({ type: 'group', label, children });
    } else {
      items.push({ type: 'link', label, path: val });
    }
  }
  return items;
});

hexo.extend.helper.register('theme_menu_top_level_count', function () {
  return hexo.extend.helper.get('theme_menu_parsed').call(this).length;
});

hexo.extend.tag.register('rss_subscribe', function () {
  const entries = feedEntries(hexo.config, hexo.theme.config);
  if (!entries.length) return '<p>订阅源暂未开放。</p>';
  const escape = require('hexo-util').escapeHTML;
  const fullUrl = hexo.extend.helper.get('full_url_for');
  return '<ul>' + entries.map(entry => {
    const url = escape(fullUrl.call({ config: hexo.config }, entry.path));
    return '<li><strong>' + entry.label + '</strong>：<a href="' + url + '">' + url + '</a></li>';
  }).join('') + '</ul>';
});
