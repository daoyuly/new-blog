# 论文研读列表页设计

日期:2026-07-24

## 目标

1. 新增 `/papers/` 论文研读列表页,自动收集定时任务生成的日报/周报文章。
2. 主菜单 `系列文章`(指向 `/series/`)改为 `论文研读`(指向 `/papers/`)。

## 背景

- 博客为 Hexo 7 + yilia 主题。
- 定时任务生成的报告文章位于 `source/_posts/`,分类写法分散(70+ 种,如 `论文综述`、`AI 论文`、`Agent Memory 日报`、`LLM/SLM 日报`、`Agent周报` 等),无法用固定分类白名单可靠收集。
- 现有 `/series/` 是手写静态卡片页(`source/series/index.md`),使用 `page` 布局与 `biz-page` 样式。

## 方案

### 菜单

`themes/yilia/_config.yml` 中 `系列文章: /series/` 改为 `论文研读: /papers/`。
`source/series/index.md` 保留不动,`/series/` 仍可直接访问,只是不在主菜单出现。

### 列表页生成器

新建 `scripts/papers.js`,注册 Hexo generator:

- 遍历 `locals.posts`,**标题或任一分类**命中以下不区分大小写的正则即收录:
  `/(日报|周报|综述|速递|arxiv|daily|weekly)/i`
- 按 `date` 倒序排列,简单平铺(不分组、不分页)。
- 生成路径 `papers/index.html`,使用主题 `page` 布局;页面内容为生成器拼出的 HTML,复用 `biz-page` 样式风格,与 `/series/` 页视觉一致。
- 每条列表项格式:`YYYY-MM-DD · 文章标题`,标题链接到文章 URL。

### 不改动

- 定时任务本身及其产出的文章 front-matter。
- `/series/` 页面及其他菜单项。
- 关键词正则的容错策略:未来定时任务分类写法漂移时,只要标题/分类含关键词即可自动收录;接受少量误收。

## 验证

- `yarn build` 成功。
- `public/papers/index.html` 存在,条目数与预期量级相符(数百条),抽查最新日报/周报在列。
- 抽查非报告文章(如 MyClaw 开发日记)未被误收。
- 生成后的菜单 HTML 中出现 `论文研读` 且链接为 `/papers/`,`系列文章` 不再出现。
