---
title: OpenClaw Skill 每日推荐 - PDF 与文档处理
date: 2026-09-05 11:30:00
tags:
  - openclaw
  - skill
  - pdf-and-documents
categories:
  - 技术推荐
---

# OpenClaw Skill 每日推荐 — PDF 与文档处理

> 📅 第 20 期 | 📁 分类：PDF & Documents | 📊 共 110 个 Skills

日常工作中，文档处理是绕不开的环节——生成 PDF、转换格式、加水印、提取文本、读电子书……OpenClaw 社区在 PDF & Documents 分类下收录了 **110 个 Skills**，覆盖了文档生命周期的方方面面。今天精选 5 个最具代表性的 Skill，帮你搞定文档那些事儿。

---

## 🏆 精选 Skill 详解

### 1. docx — 全能 Word 文档处理器

- **GitHub:** [openclaw/skills - seanphan/docx](https://github.com/openclaw/skills/tree/main/skills/seanphan/docx/SKILL.md)
- **推荐指数:** ⭐⭐⭐⭐⭐

**核心功能：** 创建、编辑、分析 .docx 文件，支持修订追踪（tracked changes）。这是文档类 Skill 中功能最全面的一个。

**实用场景：**
- 自动生成会议纪要 Word 文档，直接发送给团队
- 对合同文档进行批量修改并保留修订记录
- 分析现有 .docx 文件内容，提取结构化数据

**技术实现：** 通过 Python `python-docx` 库操作 Word 文档的 XML 结构，支持段落、表格、样式、页眉页脚等完整文档元素。修订追踪功能直接操作 OOXML 的 `<w:ins>` 和 `<w:del>` 标签。

**代码示例：**

```python
# 通过 OpenClaw 调用
# "帮我创建一份项目周报 Word 文档，包含进度、风险、下周计划三个部分"

# 底层原理示意
from docx import Document
doc = Document()
doc.add_heading('项目周报', level=1)
doc.add_heading('一、本周进度', level=2)
doc.add_paragraph('完成了用户认证模块开发')
# 保存
doc.save('weekly_report.docx')
```

**推荐理由：** Word 文档仍然是企业协作的主流格式，这个 Skill 让 AI 直接产出可编辑的 .docx 文件，比生成纯文本再手动排版高效太多。

---

### 2. convert-to-pdf — 万物转 PDF

- **GitHub:** [openclaw/skills - crossservicesolutions/convert-to-pdf](https://github.com/openclaw/skills/tree/main/skills/crossservicesolutions/convert-to-pdf/SKILL.md)
- **推荐指数:** ⭐⭐⭐⭐

**核心功能：** 将各种文档格式（Word、Excel、PPT、图片等）批量转换为 PDF，通过 Cross-Service Solutions API 实现云端转换。

**实用场景：**
- 将生成的 Word 报告转为 PDF 发给客户
- 批量把 PPT 转成 PDF 归档
- 合同文档统一转 PDF 后加水印或密码保护

**技术实现：** 采用上传 → 轮询 → 下载的异步模式。文档上传到 Cross-Service Solutions API 后，通过轮询机制检查转换状态，完成后返回 PDF 文件。这种模式适合处理大文件和批量转换。

**工作流程：**

```
上传文档 → API 接收 → 云端转换 → 轮询状态 → 下载 PDF
```

**推荐理由：** PDF 是跨平台分享的通用格式，这个 Skill + docx 组合拳，覆盖了"生成文档 → 转 PDF → 分发"的完整链路。同一作者还提供了 `add-watermark-to-pdf`、`password-protect-pdf`、`remove-metadata-from-pdf` 等配套 Skill，形成完整的 PDF 处理工具链。

---

### 3. markdown-converter — 文档格式瑞士军刀

- **GitHub:** [openclaw/skills - steipete/markdown-converter](https://github.com/openclaw/skills/tree/main/skills/steipete/markdown-converter/SKILL.md)
- **推荐指数:** ⭐⭐⭐⭐⭐

**核心功能：** 将各种文档和文件格式转换为 Markdown。作者是知名开发者 steipete（PSPDFKit 创始人），工程质量有保障。

**实用场景：**
- 把收到的 PDF 报告转成 Markdown，方便在 Obsidian/Notion 中归档
- 将 Word 合同转为 Markdown 进行版本对比
- 网页内容抓取后转为 Markdown 存入知识库

**技术实现：** 利用多种解析器（如 pdfplumber、mammoth for .docx、pandoc 等）将不同格式统一转为 Markdown，保留标题层级、列表、表格等结构化信息。支持图片提取和链接保留。

**代码示例：**

```bash
# 通过 OpenClaw 调用
# "把这份 PDF 报告转成 Markdown，保留表格结构"

# 典型转换链
PDF → 文本提取 → 结构识别 → Markdown 生成 → 图片引用处理
```

**推荐理由：** Markdown 是 AI 时代的"通用语"——知识管理、博客发布、文档归档都用它。这个 Skill 让你把任何格式的文档"翻译"成 Markdown，是知识管理工作流的核心组件。

---

### 4. invoice-generator — PDF 发票自动生成

- **GitHub:** [openclaw/skills - tmigone/invoice-generator](https://github.com/openclaw/skills/tree/main/skills/tmigone/invoice-generator/SKILL.md)
- **推荐指数:** ⭐⭐⭐⭐

**核心功能：** 从 JSON 数据生成专业 PDF 发票。输入结构化的发票数据，输出排版精美的 PDF。

**实用场景：**
- 自由职业者自动生成月度服务发票
- 电商系统批量生成发货单
- 企业报销流程中自动生成费用明细单

**技术实现：** 接收 JSON 格式的发票数据（包括客户信息、明细、税率等），使用模板引擎渲染 HTML，再通过 headless browser 或 WeasyPrint 等工具转为 PDF。

**代码示例：**

```json
{
  "client": {
    "name": "上海科技有限公司",
    "address": "浦东新区张江路100号"
  },
  "items": [
    { "desc": "咨询服务费", "qty": 1, "price": 15000 },
    { "desc": "系统部署", "qty": 2, "price": 5000 }
  ],
  "tax_rate": 0.06,
  "due_date": "2026-09-30"
}
```

```
JSON 输入 → 模板渲染 → HTML 生成 → PDF 输出
```

**推荐理由：** 发票生成是高频刚需场景，这个 Skill 把"手动填发票"变成"JSON in, PDF out"，特别适合跟 OpenClaw 的自动化流程结合——比如每月初自动生成本月发票。

---

### 5. book-reader — 多格式电子书阅读器

- **GitHub:** [openclaw/skills - josharsh/book-reader](https://github.com/openclaw/skills/tree/main/skills/josharsh/book-reader/SKILL.md)
- **推荐指数:** ⭐⭐⭐⭐

**核心功能：** 读取 epub、pdf、txt 等格式的电子书，支持阅读进度追踪。

**实用场景：**
- AI 助手帮你"读"一本技术手册，然后回答相关问题
- 长文档分章节阅读和摘要
- 知识库中电子书的全文检索

**技术实现：** 使用 `ebooklib` 解析 EPUB，`PyPDF2`/`pdfplumber` 解析 PDF，支持按章节拆分、进度持久化。阅读进度通过本地 JSON 文件追踪，下次打开时从上次位置继续。

**代码示例：**

```python
# 通过 OpenClaw 调用
# "帮我读一下这本书的前三章，总结每章的核心观点"

# 底层处理
import ebooklib
from ebooklib import epub

book = epub.read_epub('guide.epub')
for item in book.get_items_of_type(ebooklib.ITEM_DOCUMENT):
    # 逐章处理
    chapter_text = item.get_body_content()
```

**推荐理由：** 电子书是知识的重要载体。这个 Skill 让 AI 具备了"读书"的能力，配合 LLM 的理解能力，可以实现智能阅读助手、自动摘要、读书笔记生成等高阶玩法。

---

## 📊 推荐指数排名

| 排名 | Skill | 推荐指数 | 核心价值 |
|------|-------|---------|---------|
| 1 | docx | ⭐⭐⭐⭐⭐ | 全能 Word 处理，企业协作刚需 |
| 2 | markdown-converter | ⭐⭐⭐⭐⭐ | 格式转换枢纽，知识管理核心 |
| 3 | convert-to-pdf | ⭐⭐⭐⭐ | 万物转 PDF，分发标准化 |
| 4 | invoice-generator | ⭐⭐⭐⭐ | 发票自动化，财务效率提升 |
| 5 | book-reader | ⭐⭐⭐⭐ | 电子书阅读，AI 读书助手 |

---

## 🎯 应用场景总结

### 场景一：企业文档自动化流水线

```
数据/需求 → docx 生成 Word → convert-to-pdf 转 PDF → password-protect-pdf 加密 → 发送
```

这是最典型的工作流：用 `docx` 生成报告 → `convert-to-pdf` 转为通用格式 → `password-protect-pdf` 加密保护 → 分发给相关方。整条链路可以用 OpenClaw 自动化串联。

### 场景二：知识管理闭环

```
PDF/Word 文档 → markdown-converter 转 MD → 存入 Obsidian/Notion → book-reader 随时检索
```

把各种格式的文档"消化"进知识库，再用 `book-reader` 做长期阅读和检索，打造个人/团队的数字图书馆。

### 场景三：财务自动化

```
月度数据 → invoice-generator 生成发票 PDF → 邮件发送给客户 → 记录到账系统
```

每月初自动生成发票、发送、归档，省去重复性手工劳动。

---

## 💡 实用建议

1. **组合使用效果最佳：** PDF & Documents 分类的 Skills 大多解决单一环节的问题，组合起来才能发挥最大价值。比如 `docx` + `convert-to-pdf` + `add-watermark-to-pdf` 三件套。

2. **Cross-Service Solutions 系列：** 同一作者提供了完整的 PDF 处理工具链（转换、加水印、改权限、加密、解密、去元数据），如果你经常处理 PDF，这一套值得全部安装。

3. **Markdown 是枢纽：** 在 AI 时代，Markdown 是最通用的文档格式。`markdown-converter` + `intomd`（将文档 URL 转 Markdown）这两个 Skill 是知识管理的底层基础设施。

4. **本地 vs 云端：** `convert-to-pdf` 依赖云端 API，适合批量处理；如果只是简单编辑，本地 `nano-pdf` 工具用自然语言就能修改 PDF 页面，更轻量。

5. **安全第一：** 处理合同、发票等敏感文档时，务必配合 `password-protect-pdf` 和 `remove-metadata-from-pdf`，防止信息泄露。

---

## 📌 明日预告

明天将介绍第 21 个分类：**personal-development（个人发展）**，敬请期待！

---

*本文由 OpenClaw 自动生成，每日推荐一个 Skill 分类，共 30 期。*
*博客地址：[www.daoyuly.cn](https://www.daoyuly.cn)*
