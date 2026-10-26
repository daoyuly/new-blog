'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { transformMarkdown, extractChineseTitle, listPosts } = require('../tools/strip-philosophy-english');

const sample = `---
title: 软件设计的哲学 - ch8
description: "This chapter introduces another way of thinking about deeper classes."
keywords: "软件设计的哲学, ch8"
---

# 第 8 章 降低复杂性

> Chapter 8 Pull Complexity Downwards

This chapter introduces another way of thinking about how to create deeper classes.

> 本章介绍了有关如何创建更深层类的另一种思考方式。

## 8.1 Example: editor text class 示例：编辑器文本类

- Some complexity comes just from the number of components.
- Subdivision can result in duplication.

---

> - 一些复杂性仅来自组件的数量。
> - 细分可能导致重复。

## 19.6 Getters and setters Getter 和 Setters

img Red Flag: Information Leakage img

Information leakage occurs when the same knowledge is used in multiple places.

> 当在多个地方使用相同的知识时，就会发生信息泄漏。

\`\`\`java
// Not a problem: not all tweet files have full
public class Http {}
\`\`\`

![](../../img/figures/00012.jpeg)

## 13.1 Pick conventions

The first step is to decide on conventions.

> 编写注释的第一步是确定注释的约定。
`;

function visible(text) {
  return text
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/^# en-description:.*\n/gm, '')
    .replace(/\n{3,}/g, '\n\n');
}

test('标题只保留中文，并把紧挨「和」的英文词留在中文里', () => {
  assert.equal(extractChineseTitle('Example: editor text class 示例：编辑器文本类'), '示例：编辑器文本类');
  assert.equal(extractChineseTitle('Getters and setters Getter 和 Setters'), 'Getter 和 Setters');
  assert.equal(extractChineseTitle('Pick conventions'), '选择约定');
  assert.equal(extractChineseTitle('示例：RAMCloud 缓冲区'), '示例：RAMCloud 缓冲区');
});

test('remove 删掉英文并展开中文引用，代码和图片保持原样', () => {
  const { text, stats } = transformMarkdown(sample, 'remove');
  assert.match(text, /^# 第 8 章 降低复杂性\n\n本章介绍了/m);
  assert.doesNotMatch(text, /This chapter introduces/);
  assert.doesNotMatch(text, /Chapter 8/);
  assert.match(text, /## 8\.1 示例：编辑器文本类/);
  assert.match(text, /## 19\.6 Getter 和 Setters/);
  assert.match(text, /## 13\.1 选择约定/);
  assert.match(text, /^- 一些复杂性仅来自组件的数量。\n- 细分可能导致重复。/m);
  assert.match(text, /\*\*危险信号\*\*\n\n当在多个地方使用相同的知识时/);
  assert.match(text, /\/\/ Not a problem: not all tweet files have full\npublic class Http \{\}/);
  assert.match(text, /!\[\]\(\.\.\/\.\.\/img\/figures\/00012\.jpeg\)/);
  assert.match(text, /description: "本章介绍了有关如何创建更深层类的另一种思考方式。"/);
  const body = text.replace(/^---\n[\s\S]*?\n---\n/, '');
  assert.doesNotMatch(body, /^---$/m);
  assert.equal(stats.englishOnlyHeadings.length, 0);
  assert.equal(stats.redFlags, 1);
});

test('英文列表项改成对应的中文，缩进代码块保持不变', () => {
  const source = `# 示例

- Another editor project contained the following code:

  > 另一个编辑器项目包含以下代码：

  \`\`\`java
  // Blink state: true when cursor visible.
  private boolean blinkStatus = true;
  \`\`\`

  The name blinkStatus doesn’t convey enough information.

  > 名称 blinkStatus 无法传达足够的信息。
`;
  const { text } = transformMarkdown(source, 'remove');
  assert.match(text, /^- 另一个编辑器项目包含以下代码：/m);
  assert.match(text, /^ {2}```java\n {2}\/\/ Blink state: true when cursor visible\.\n {2}private boolean blinkStatus = true;\n {2}```/m);
  assert.match(text, /^ {2}名称 blinkStatus 无法传达足够的信息。/m);
  assert.doesNotMatch(text, /Another editor project/);
  assert.doesNotMatch(text, /doesn’t convey/);
});

test('hide 的可见正文与 remove 一致，英文留在注释里', () => {
  const hidden = transformMarkdown(sample, 'hide').text;
  const removed = transformMarkdown(sample, 'remove').text;
  assert.match(hidden, /<!--[\s\S]*This chapter introduces another way/);
  assert.match(hidden, /# en-description:/);
  assert.equal(visible(hidden).replace(/\n{3,}/g, '\n\n'), removed);
});

test('重复执行结果不变，hide 之后再 remove 等于直接 remove', () => {
  const removed = transformMarkdown(sample, 'remove').text;
  assert.equal(transformMarkdown(removed, 'remove').text, removed);
  const hidden = transformMarkdown(sample, 'hide').text;
  assert.equal(transformMarkdown(hidden, 'hide').text, hidden);
  assert.equal(transformMarkdown(hidden, 'remove').text, removed);
});

test('已经是中文的章节只清标题里的英文，保留原摘要', () => {
  const source = `---
description: "这本书是关于如何设计软件系统以最小化其复杂性。"
---
# 第 2 章 复杂性的本质

识别复杂性的能力是至关重要的设计技能。

## 2.1 Complexity defined 复杂性的定义

出于本书的目的，我以实用的方式定义“复杂性”。
`;
  const { text, stats } = transformMarkdown(source, 'remove');
  assert.match(text, /description: "这本书是关于如何设计软件系统以最小化其复杂性。"/);
  assert.match(text, /## 2\.1 复杂性的定义/);
  assert.match(text, /识别复杂性的能力是至关重要的设计技能。/);
  assert.equal(stats.englishLines, 0);
});

test('系列原文里的中文、代码和图片都会留下来', () => {
  const posts = listPosts(path.join(__dirname, '../source/_posts'));
  assert.ok(posts.length >= 20);
  for (const file of posts) {
    const source = fs.readFileSync(file, 'utf8');
    const removed = transformMarkdown(source, 'remove').text;
    const body = source.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, '');
    const outputBody = removed.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, '');
    assert.deepEqual(outputBody.match(/```[\s\S]*?```/g), body.match(/```[\s\S]*?```/g), file);
    assert.deepEqual(outputBody.match(/^!\[.*$/gm), body.match(/^!\[.*$/gm), file);

    let inFence = false;
    for (const line of body.split('\n')) {
      if (/^ {0,3}```/.test(line)) {
        inFence = !inFence;
        continue;
      }
      if (inFence || !/[\u4e00-\u9fff]/.test(line)) continue;
      const quoted = line.match(/^( *)>\s?(.*)$/);
      const payload = quoted ? quoted[2] : line;
      if (/^#{1,6}\s/.test(line)) {
        assert.match(removed, new RegExp(extractChineseTitle(line.replace(/^#{1,6}\s+/, '').replace(/^\d+(?:\.\d+)*\s+/, '')).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
      } else {
        assert.ok(removed.includes(payload), `${path.basename(file)} 丢失: ${payload.slice(0, 40)}`);
      }
    }

    let inOutFence = false;
    let inComment = false;
    for (const line of outputBody.split('\n')) {
      if (/^ {0,3}```/.test(line)) {
        inOutFence = !inOutFence;
        continue;
      }
      if (inOutFence) continue;
      if (line.trim() === '<!--') {
        inComment = true;
        continue;
      }
      if (inComment) {
        if (line.trim() === '-->') inComment = false;
        continue;
      }
      if (!line.trim() || /^#{1,6}\s/.test(line) || /^!\[/.test(line) || line === '**危险信号**') continue;
      assert.match(line, /[\u4e00-\u9fff]/, `${path.basename(file)} 仍有英文: ${line.slice(0, 80)}`);
    }
  }
});
