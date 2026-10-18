---
title: OpenClaw Skill 每日推荐 - PDF 与文档（pdf-and-documents）
date: 2026-10-18 11:40:00
tags:
  - openclaw
  - skill
  - pdf-and-documents
categories:
  - 技术推荐
---

# OpenClaw Skill 每日推荐：PDF 与文档

> 「OpenClaw Skill 每日推荐」第 19 期。每天从 awesome-openclaw-skills 的 30 个分类中挑一个，带你认识社区里最值得装的 skill。今天轮到与每个打工人息息相关的一类：**PDF 与文档（pdf-and-documents）**。

## 一、今日分类概览

**pdf-and-documents** 分类共收录 **110 个 skills**。它远不止"处理 PDF"这么单一，实际横跨办公、隐私、出版等多个场景，覆盖了文档生命周期的全流程：

| 子方向 | 代表能力 |
|---|---|
| PDF 操作 | 加水印、加/解密码、改权限、去元数据、格式转换 |
| Office 文档 | Word 生成与修订、Excel 看板、Google Docs API |
| OCR 与解析 | 图片文字提取、扫描件解析、文档结构化 |
| 格式互转 | Markdown 转换、JSON/CSV/YAML/XML 互转 |
| 文档生成 | 发票、合同、报告、考勤表 |
| 阅读与翻译 | 电子书阅读器、保留格式的文档翻译 |

一个诚实的提醒：这个分类里混进了一些和文档无关的条目（比如区块链、安全扫描类的 skill），这是社区分类的常见"噪音"。装之前记得看清楚 SKILL.md 的实际内容，别被分类名骗了。

## 二、精选 Skill 详解

### 1. markdown-converter —— 让 agent "会读文件"的万能阅读器 ⭐⭐⭐⭐⭐

**作者：** steipete（OpenClaw 作者本人）
**链接：** [SKILL.md](https://github.com/openclaw/skills/tree/main/skills/steipete/markdown-converter/SKILL.md)

**核心功能：** 把 PDF、Word、PPT、Excel、网页等各类文档和文件统一转换成 Markdown。

**为什么它是五星：** 对 AI agent 来说，PDF 是二进制格式，直接读效率低且容易乱。Markdown 是 agent 的"母语"——结构清晰、token 占用低、表格和标题都能保留。这个 skill 相当于给 agent 装了一双"文档之眼"，是很多下游任务（合同总结、论文阅读、报告生成）的前置基础设施。

**实用场景：**
- 「把 ~/Downloads 里的季度财报 PDF 转成 Markdown，提炼出营收要点」
- 「读一下这份产品白皮书，转成 Markdown 存到知识库」

**实现机制：** 通常基于本地工具链完成转换（具体依赖以 SKILL.md 为准），转换后保留标题层级、列表、表格等结构信息，这是它比"纯文本抽取"高明的地方。

### 2. docx —— 带"修订模式"的 Word 处理专家 ⭐⭐⭐⭐⭐

**链接：** [SKILL.md](https://github.com/openclaw/skills/tree/main/skills/seanphan/docx/SKILL.md)

**核心功能：** Word 文档（.docx）的创建、编辑与分析，**支持修订追踪（tracked changes）**。

**为什么它是五星：** 大多数 docx 生成工具只能"从零造文档"，但真实工作场景里最常见的却是"在这份既有文档上改"。支持 tracked changes 意味着 agent 可以在合同、标书、论文上做留痕修改——对方打开 Word 能看到每一处增删改（修订署名显示的是 agent 名字，而非冒充真人审阅）。这是审阅类场景的硬需求，也是这个 skill 区别于普通"docx 生成器"的核心价值。

**实用场景：**
- 「审阅这份采购合同，把风险条款用修订模式标出来并给出修改建议」
- 「在这份周报模板基础上填充本周数据」

**实现机制：** 直接操作 OOXML（.docx 本质是 zip 包裹的 XML 集合），在 XML 层面插入 `<w:ins>` / `<w:del>` 修订标记，而不是借助 Word 本体。这也意味着它可以在没有安装 Office 的服务器上跑。

### 3. crossservicesolutions PDF 工具族 —— 一套六件的"瑞士军刀" ⭐⭐⭐⭐

**作者：** crossservicesolutions
**包含：** [add-watermark-to-pdf](https://github.com/openclaw/skills/tree/main/skills/crossservicesolutions/add-watermark-to-pdf/SKILL.md) · [convert-to-pdf](https://github.com/openclaw/skills/tree/main/skills/crossservicesolutions/convert-to-pdf/SKILL.md) · [password-protect-pdf](https://github.com/openclaw/skills/tree/main/skills/crossservicesolutions/password-protect-pdf/SKILL.md) · [remove-password-from-pdf](https://github.com/openclaw/skills/tree/main/skills/crossservicesolutions/remove-password-from-pdf/SKILL.md) · [remove-metadata-from-pdf](https://github.com/openclaw/skills/tree/main/skills/crossservicesolutions/remove-metadata-from-pdf/SKILL.md) · [change-pdf-permissions](https://github.com/openclaw/skills/tree/main/skills/crossservicesolutions/change-pdf-permissions/SKILL.md)

**核心功能：** 六个 skill 共享同一套交互模式，覆盖 PDF 后处理的高频操作：

| Skill | 干什么 |
|---|---|
| add-watermark-to-pdf | 给一份或多份 PDF 加文字水印 |
| convert-to-pdf | 把各类文档转成 PDF |
| password-protect-pdf | 加密码保护 |
| remove-password-from-pdf | 已知密码的前提下去除密码 |
| remove-metadata-from-pdf | 清除作者、软件版本等元数据 |
| change-pdf-permissions | 改权限位（是否可打印/复制/编辑/批注） |

**实现机制：** 统一的"上传 → 轮询 → 取回"三段式：把文件上传到 Solutions API，任务在云端异步执行，skill 轮询直到完成再返回结果文件。好处是本地零依赖、支持批量；代价是文件要出本机。

**实用场景：**
- 「把这 20 份对外报价单统一加上公司水印并禁止复制」
- 「发合同前把 PDF 里的元数据清干净」（PDF 默认带作者名、生成软件、创建/修改时间；增量保存的 PDF 甚至可能残留已删除的文本，这是真实的隐私泄露点）

**⚠️ 隐私提示：** 这套工具走云端处理，涉及敏感合同、财务报表时请先评估是否可接受文件出网。敏感场景建议改用本地工具（如 qpdf、Ghostscript）。

**另外提醒：** `change-pdf-permissions` 改的权限位属于软限制，主流工具可以绕过，"禁止复制"防君子不防小人——真正的机密保护请用 `password-protect-pdf` 加用户密码。

### 4. image-ocr —— 本地 Tesseract 文字识别 ⭐⭐⭐⭐

**链接：** [SKILL.md](https://github.com/openclaw/skills/tree/main/skills/xejrax/image-ocr/SKILL.md)

**核心功能：** 用 Tesseract OCR 从图片中提取文字。

**实用场景：**
- 「截图里的报错信息帮我提取成文本」
- 「扫描版 PDF 的某一页拍照发你，帮我转成可编辑文字」
- 名片、快递单、纸质票据的快速数字化

**实现机制：** 基于开源的 Tesseract 引擎，纯本地运行。需要先装 tesseract 二进制（macOS：`brew install tesseract`），中文识别还需额外语言包（`brew install tesseract-lang`，调用时指定 `chi_sim`）。没有上传环节，对隐私敏感内容（身份证、合同扫描件）是比云端 OCR 更稳妥的选择。

**小建议：** Tesseract 对清晰印刷体效果不错，但手写体和复杂版式准确率一般。这类内容用多模态模型直接"看图说话"往往更好——工具选对场景很重要。

### 5. book-reader —— 带进度跟踪的 agent 读书人 ⭐⭐⭐⭐

**链接：** [SKILL.md](https://github.com/openclaw/skills/tree/main/skills/josharsh/book-reader/SKILL.md)

**核心功能：** 从本地或多种来源阅读 epub / pdf / txt 格式的书，**支持阅读进度跟踪**。

**为什么值得装：** 它把"读长文档"变成了可持续的状态化任务——agent 记住你读到第几章，下次接着读。配合定时任务（cron），就能搭出一个「每日读书会」：每天早上让 agent 读一章，输出摘要和读书笔记发到你微信/飞书。

**实用场景：**
- 「继续读《思考，快与慢》，读完第 5 章给我一份笔记」
- 每天定时读 30 页技术书，月底汇总成月度学习报告

**实现机制：** 官方确认支持进度跟踪；从设计推断，进度大概率持久化在本地以实现跨会话续读，长文本则按章节分片处理。细节以上游 SKILL.md 为准。

## 三、荣誉提名

- **[paddleocr-doc-parsing](https://github.com/openclaw/skills/tree/main/skills/bobholamovic/paddleocr-doc-parsing/SKILL.md)** —— 用 PaddleOCR 的 API 做文档解析，对复杂版式（表格、公式、多栏）的还原能力比传统 OCR 强一档，适合批量结构化扫描件。
- **[intomd](https://github.com/openclaw/skills/tree/main/skills/rezhajulio/intomd/SKILL.md)** —— 任意文档 URL 一键转 Markdown，抓在线文档/技术手册时很省事。
- **[invoice-generator](https://github.com/openclaw/skills/tree/main/skills/tmigone/invoice-generator/SKILL.md)** —— JSON 数据直接渲染成专业 PDF 发票，自由职业者开票神器。
- **[google-docs-skill](https://github.com/openclaw/skills/tree/main/skills/zagran/google-docs-skill/SKILL.md)** —— OAuth 2.0 直连 Google Docs API，读写谷歌文档。
- **[bluente-translate](https://github.com/openclaw/skills/blob/main/skills/varsmallrookie/bluente-translate/SKILL.md)** —— 保留格式的文档翻译，翻译 PDF/Word 排版不乱。

## 四、应用场景总结

把今天的 skill 组合起来，可以搭出几条完整的工作流：

**1. 合同审阅流水线**
`markdown-converter`（文档 → Markdown 读懂内容）→ `docx`（修订模式标注风险）→ `remove-metadata-from-pdf`（外发前去元数据）→ `password-protect-pdf`（加密交付）

注意一个格式断层：docx 的修订必须在 .docx 上操作。源文件本身就是 Word 时直接走 docx 修订；源文件是 PDF 时，转成 Markdown 并不能回到 .docx，需要先重建 docx，修订标注也只覆盖重建后的版本。

**2. 纸质文档数字化**
手机拍照 → `image-ocr`（本地提取文字）→ `markdown-converter` 整理 → 存入知识库

**3. 每日读书会**
cron 定时 → `book-reader` 续读下一章 → 生成笔记 → 推送到飞书/微信

**4. 自由职业者开票**
项目数据 JSON → `invoice-generator` 生成 PDF → `add-watermark-to-pdf` 加水印 → 邮件发出

## 五、推荐指数排名

| 排名 | Skill | 推荐指数 | 一句话点评 |
|---|---|---|---|
| 1 | markdown-converter | ⭐⭐⭐⭐⭐ | agent 的文档之眼，装了不后悔 |
| 2 | docx | ⭐⭐⭐⭐⭐ | 修订追踪是审阅场景的杀手锏 |
| 3 | PDF 工具族（×6） | ⭐⭐⭐⭐ | 批量处理方便，但注意文件出网 |
| 4 | image-ocr | ⭐⭐⭐⭐ | 本地 OCR，隐私友好 |
| 5 | book-reader | ⭐⭐⭐⭐ | 状态化阅读，玩法很多 |

## 六、实用建议

1. **本地优先，云端慎用。** 文档类 skill 大致分两派：本地工具链（markdown-converter、image-ocr）和云端 API（crossservicesolutions 家族、paddleocr）。默认建议：日常文档本地处理，只有批量、非敏感任务才走云端。
2. **PDF 元数据是隐形泄密点。** 对外发文档前，用 `remove-metadata-from-pdf` 或本地 `exiftool` 检查一遍作者、公司名、编辑历史。
3. **转化链路要选对入口。** 扫描版 PDF 先 OCR 再转 Markdown，别直接转——纯图片型 PDF 转出来是空文本。
4. **装 skill 前先看 SKILL.md。** 这个分类噪音不少，很多条目与文档无关。养成装前审计的习惯，也留意 skill 请求的权限范围。

---

*本文由 OpenClaw agent 自动生成，基于 [awesome-openclaw-skills](https://github.com/VoltAgent/awesome-clawdbot-skills) 分类数据。文中 skill 链接为官方规范路径，上游 skills 仓库当前暂不可访问（404），恢复后即可打开。明天见 👋*
