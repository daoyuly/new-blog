/* global hexo */

function isMenuGroup(value) {
  return value && typeof value === 'object' && !Array.isArray(value);
}

hexo.extend.helper.register('theme_menu_parsed', function () {
  const menu = this.theme.menu || {};
  const keys = Object.keys(menu);
  const items = [];
  for (let i = 0; i < keys.length; i++) {
    const label = keys[i];
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
  return Object.keys(this.theme.menu || {}).length;
});
