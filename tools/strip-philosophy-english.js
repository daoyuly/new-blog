'use strict';

const fs = require('node:fs');
const path = require('node:path');

const CJK = /[\u4e00-\u9fff]/;
const FENCE = /^( {0,3})(`{3,}|~{3,})([^`]*)$/;
const HEADING = /^(#{1,6})(\s+)(.*)$/;
const SECTION_NUMBER = /^(\d+(?:\.\d+)*)\s+(.*)$/;
const IMAGE = /^!\[/;
const RED_FLAG = /^img Red Flag:\s*(.*?)\s*img\s*$/;
const RULE = /^ {0,3}(-{3,}|\*{3,}|_{3,})\s*$/;
const QUOTE = /^( *)>\s?(.*)$/;
const BULLET = /^([-*])\s+/;

// 标题只有英文、正文没有对照中文时使用。
const HEADING_ZH = {
  'Pick conventions': '选择约定',
  'Classitis': '类炎',
  'Benefits of well-written comments': '写得好的注释带来的好处',
  'Things that make code more obvious': '让代码更显而易见的因素'
};

function hasCjk(text) {
  return CJK.test(text);
}

function parseQuote(line) {
  const match = line.match(QUOTE);
  if (!match) return { indent: '', text: line, quoted: false };
  return { indent: match[1], text: match[2], quoted: true };
}

function unwrapQuote(line) {
  return parseQuote(line).text;
}

function fenceInfo(line) {
  const match = line.match(FENCE);
  if (!match) return null;
  return { indent: match[1].length, tick: match[2][0], length: match[2].length, info: match[3].trim() };
}

function renderChinese(line, parsed, pendingMarker) {
  if (pendingMarker && !/^(?:[-*]|\d+\.)\s+/.test(parsed.text)) return `${pendingMarker}${parsed.text}`;
  if (parsed.quoted) return `${parsed.indent}${parsed.text}`;
  return line;
}

function extractChineseTitle(title) {
  const index = title.search(CJK);
  if (index < 0) return HEADING_ZH[title.trim()] || null;
  if (index === 0) return title.trim();
  let start = index;
  if (title[index] === '和') {
    const before = title.slice(0, index);
    const word = before.match(/([A-Za-z][A-Za-z0-9.+#]*)\s*$/);
    if (word) start = before.length - word[0].length;
  }
  return title.slice(start).replace(/[ \t\u00a0]{2,}/g, ' ').trim();
}

function transformHeading(line) {
  const match = line.match(HEADING);
  if (!match) return null;
  const [, marks, space, rawTitle] = match;
  const numbered = rawTitle.match(SECTION_NUMBER);
  const number = numbered ? `${numbered[1]} ` : '';
  const title = numbered ? numbered[2] : rawTitle;
  const chinese = extractChineseTitle(title);
  if (!chinese) return { line, englishOnly: true };
  return { line: `${marks}${space}${number}${chinese}`, englishOnly: false, changed: chinese !== title };
}

function clipExcerpt(text, max = 100) {
  const chars = Array.from(text.replace(/\s+/g, ' ').trim());
  if (chars.length <= max) return chars.join('');
  return `${chars.slice(0, max).join('')}...`;
}

function unquoteYaml(value) {
  const trimmed = value.trim();
  if ((trimmed.startsWith('"') && trimmed.endsWith('"')) || (trimmed.startsWith("'") && trimmed.endsWith("'"))) {
    return trimmed.slice(1, -1).replace(/\\"/g, '"');
  }
  return trimmed;
}

function firstExcerpt(body) {
  let inFence = false;
  let inComment = false;
  for (const line of body.split('\n')) {
    if (FENCE.test(line)) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;
    if (line.trim() === '<!--') {
      inComment = true;
      continue;
    }
    if (inComment) {
      if (line.trim() === '-->') inComment = false;
      continue;
    }
    const text = unwrapQuote(line).trim();
    if (!text || text.startsWith('#') || IMAGE.test(text) || text === '**危险信号**') continue;
    if (hasCjk(text)) return clipExcerpt(text.replace(/^[-*]\s+/, ''));
  }
  return '';
}

function transformFrontMatter(frontMatter, mode, excerpt) {
  let replaced = false;
  const lines = frontMatter.split('\n');
  const output = [];
  for (const line of lines) {
    if (mode === 'remove' && line.startsWith('# en-description:')) continue;
    const match = line.match(/^description:\s*(.*)$/);
    if (!match || hasCjk(unquoteYaml(match[1]))) {
      output.push(line);
      continue;
    }
    replaced = true;
    if (mode === 'hide' && !output.some(item => item.startsWith('# en-description:'))) {
      output.push(`# en-description: ${JSON.stringify(unquoteYaml(match[1]))}`);
    }
    output.push(excerpt ? `description: ${JSON.stringify(excerpt)}` : 'description: ""');
  }
  return { text: output.join('\n'), replaced };
}

function splitDocument(source) {
  const match = source.match(/^---\r?\n[\s\S]*?\r?\n---\r?\n/);
  if (!match) return { frontMatter: '', body: source };
  return { frontMatter: match[0], body: source.slice(match[0].length) };
}

function classifyBody(body, mode) {
  const lines = body.split('\n');
  const kinds = new Array(lines.length);
  const outputLines = new Array(lines.length);
  const englishOnlyHeadings = [];
  let fence = null;
  let inComment = false;
  let headingsCleaned = 0;
  let redFlags = 0;
  let pendingMarker = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (inComment) {
      kinds[i] = mode === 'remove' ? 'drop' : 'keep';
      outputLines[i] = line;
      if (line.trim() === '-->') inComment = false;
      continue;
    }
    const fenceLine = fenceInfo(line);
    const closesFence = fence && fenceLine && fenceLine.tick === fence.tick
      && fenceLine.length >= fence.length && fenceLine.info === '';
    if (!fence && fenceLine) {
      fence = fenceLine;
      kinds[i] = 'keep';
      outputLines[i] = line;
      continue;
    }
    if (fence) {
      if (closesFence) fence = null;
      kinds[i] = 'keep';
      outputLines[i] = line;
      continue;
    }
    if (line.trim() === '<!--') {
      inComment = true;
      kinds[i] = mode === 'remove' ? 'drop' : 'keep';
      outputLines[i] = line;
      continue;
    }
    if (line.trim() === '') {
      kinds[i] = 'blank';
      outputLines[i] = '';
      continue;
    }
    if (RULE.test(line)) {
      kinds[i] = 'drop';
      outputLines[i] = '';
      continue;
    }

    const heading = transformHeading(line);
    if (heading) {
      pendingMarker = null;
      if (heading.englishOnly) englishOnlyHeadings.push(line);
      else if (heading.changed) headingsCleaned += 1;
      kinds[i] = 'keep';
      outputLines[i] = heading.line;
      continue;
    }

    const parsed = parseQuote(line);
    if (IMAGE.test(line) || IMAGE.test(parsed.text)) {
      kinds[i] = 'keep';
      outputLines[i] = IMAGE.test(line) ? line : `${parsed.indent}${parsed.text}`;
      continue;
    }
    if (RED_FLAG.test(line)) {
      redFlags += 1;
      kinds[i] = 'keep';
      outputLines[i] = mode === 'hide'
        ? `<!--\n${line.replace(/--/g, '—')}\n-->\n**危险信号**`
        : '**危险信号**';
      continue;
    }

    if (hasCjk(parsed.text)) {
      kinds[i] = 'keep';
      outputLines[i] = renderChinese(line, parsed, pendingMarker);
      if (pendingMarker) pendingMarker = null;
      continue;
    }

    const bullet = line.match(BULLET);
    if (bullet) pendingMarker = `${bullet[1]} `;
    kinds[i] = 'en';
    outputLines[i] = line;
  }

  for (let i = 0; i < kinds.length; i++) {
    if (kinds[i] !== 'blank') continue;
    let previous = i - 1;
    while (previous >= 0 && kinds[previous] === 'blank') previous -= 1;
    let next = i + 1;
    while (next < kinds.length && kinds[next] === 'blank') next += 1;
    if (previous >= 0 && kinds[previous] === 'en' && next < kinds.length && kinds[next] === 'en') {
      kinds[i] = 'en';
    }
  }

  return { lines, kinds, outputLines, englishOnlyHeadings, headingsCleaned, redFlags };
}

function renderBody(classified, mode) {
  const { lines, kinds, outputLines } = classified;
  const rendered = [];
  let englishLines = 0;
  let index = 0;

  while (index < lines.length) {
    if (kinds[index] === 'drop') {
      index += 1;
      continue;
    }
    if (kinds[index] !== 'en') {
      rendered.push(outputLines[index]);
      index += 1;
      continue;
    }
    const hidden = [];
    while (index < lines.length && (kinds[index] === 'en' || kinds[index] === 'drop')) {
      if (kinds[index] === 'en') {
        englishLines += 1;
        hidden.push(lines[index]);
      }
      index += 1;
    }
    if (mode === 'hide' && hidden.length) {
      rendered.push('<!--', hidden.join('\n').replace(/--/g, '—'), '-->');
    }
  }

  const collapsed = [];
  for (const line of rendered.join('\n').split('\n')) {
    if (line === '' && collapsed[collapsed.length - 1] === '') continue;
    collapsed.push(line);
  }
  while (collapsed[0] === '') collapsed.shift();
  while (collapsed[collapsed.length - 1] === '') collapsed.pop();
  return { text: `${collapsed.join('\n')}\n`, englishLines };
}

function transformMarkdown(source, mode = 'hide') {
  if (mode !== 'hide' && mode !== 'remove') {
    throw new Error(`未知模式: ${mode}（可用 hide 或 remove）`);
  }
  const { frontMatter, body } = splitDocument(source);
  const classified = classifyBody(body, mode);
  const rendered = renderBody(classified, mode);
  const excerpt = firstExcerpt(rendered.text);
  const front = frontMatter
    ? transformFrontMatter(frontMatter, mode, excerpt)
    : { text: '', replaced: false };
  return {
    text: `${front.text}${rendered.text}`,
    stats: {
      englishLines: rendered.englishLines,
      headingsCleaned: classified.headingsCleaned,
      redFlags: classified.redFlags,
      descriptionReplaced: front.replaced,
      englishOnlyHeadings: classified.englishOnlyHeadings
    }
  };
}

function listPosts(dir) {
  return fs.readdirSync(dir)
    .filter(name => name.startsWith('软件设计的哲学-') && name.endsWith('.md'))
    .sort()
    .map(name => path.join(dir, name));
}

function run(options) {
  const dir = options.dir;
  const files = listPosts(dir);
  const reports = [];
  for (const file of files) {
    const source = fs.readFileSync(file, 'utf8');
    const result = transformMarkdown(source, options.mode);
    const changed = result.text !== source;
    if (options.write && changed) fs.writeFileSync(file, result.text);
    reports.push({ file: path.basename(file), changed, ...result.stats });
  }
  return reports;
}

function printReports(reports, mode, write) {
  const touched = reports.filter(item => item.changed);
  for (const item of touched) {
    const headings = item.englishOnlyHeadings.length ? `，仍为英文的标题 ${item.englishOnlyHeadings.length}` : '';
    console.log(`${item.file}: 英文 ${item.englishLines} 行，标题 ${item.headingsCleaned}，危险信号 ${item.redFlags}${headings}`);
    for (const heading of item.englishOnlyHeadings) console.log(`  ${heading}`);
  }
  const action = write ? '已写入' : '预览';
  const hint = write ? '' : '未加 --write 时不会改文件。';
  console.log(`${action} ${touched.length}/${reports.length} 篇（模式 ${mode}）。${hint}`);
}

function parseArgs(argv) {
  const options = {
    mode: 'hide',
    write: false,
    dir: path.join(process.cwd(), 'source/_posts')
  };
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === '--write') options.write = true;
    else if (arg === '--mode') options.mode = argv[++i];
    else if (arg === '--dir') options.dir = path.resolve(argv[++i]);
    else if (arg === '--help' || arg === '-h') options.help = true;
    else throw new Error(`未知参数: ${arg}`);
  }
  return options;
}

function printHelp() {
  console.log(`用法: node tools/strip-philosophy-english.js [--mode hide|remove] [--write] [--dir source/_posts]

hide    用 HTML 注释藏起英文，页面上看不见，源文件里还在
remove  删除英文段落、英文摘要，以及藏英文用的注释
默认只预览。确认后加 --write。`);
}

if (require.main === module) {
  const options = parseArgs(process.argv.slice(2));
  if (options.help) {
    printHelp();
  } else {
    printReports(run(options), options.mode, options.write);
  }
}

module.exports = {
  transformMarkdown,
  extractChineseTitle,
  listPosts,
  run
};
