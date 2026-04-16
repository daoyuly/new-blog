---
title: OpenClaw Skill 每日推荐 - PDF 与文档处理
tags:
  - openclaw
  - skill
  - pdf-documents
categories:
  - 技术推荐
abbrlink: 40539
date: 2026-04-16 00:00:00
---

# PDF 与文档处理 - OpenClaw Skill 每日推荐

## 今日分类概述

**PDF 与文档处理** 分类共包含 **110 个 skills**，涵盖从 PDF 编辑、文档转换、格式化到专业文档生成的全方位解决方案。这些技能帮助 AI 助手处理各种文档任务，包括创建、编辑、转换、保护和分析文档。

## 精选 Skill 详解

### 1. 📄 docx - 专业文档处理全能手

**GitHub 链接**: [seanphan/docx](https://github.com/openclaw/skills/tree/main/skills/seanphan/docx/SKILL.md)

**核心功能**:
- 全面的 .docx 文档创建、编辑和分析
- 支持修订追踪（tracked changes）和评论
- 保留文档格式和样式
- 文本提取和结构化分析

**技术实现机制**:
- 使用 **docx-js** (JavaScript/TypeScript) 创建新文档
- 使用 **Document library** (Python) 处理 OOXML 格式
- 支持 pandoc 进行文本提取和转换
- 可直接访问底层 XML 结构进行复杂操作

**实用场景**:
```javascript
// 创建新文档示例
const { Document, Paragraph, TextRun } = require('docx');

const doc = new Document({
  sections: [{
    properties: {},
    children: [
      new Paragraph({
        children: [
          new TextRun({
            text: "Hello World",
            bold: true,
          }),
        ],
      }),
    ],
  }],
});
```

- **合同起草与修订**: 使用修订追踪功能进行法律文档的多人协作编辑
- **报告生成**: 自动创建格式化的商业报告和技术文档
- **文档分析**: 提取文档结构、评论和元数据进行内容分析

**推荐指数**: ⭐⭐⭐⭐⭐ (5/5)
- 功能全面，专业级文档处理能力
- 支持复杂的修订追踪和格式保留
- 文档详细，工作流程清晰

---

### 2. 🧾 invoice-generator - PDF 发票生成器

**GitHub 链接**: [tmigone/invoice-generator](https://github.com/openclaw/skills/tree/main/skills/tmigone/invoice-generator/SKILL.md)

**核心功能**:
- 从结构化 JSON 数据生成专业 PDF 发票
- 支持自定义公司信息和客户信息
- 自动计算总额和货币格式化
- 支持多行项目和服务描述

**技术实现机制**:
- 使用 Node.js 和 weasyprint 生成 PDF
- 通过脚本处理 JSON 输入数据
- 环境变量配置发票输出目录
- 支持配置模板复用

**实用场景**:
```json
{
  "company": {
    "name": "Your Company",
    "address": "123 Main St",
    "cityStateZip": "City, State, 12345",
    "country": "Country"
  },
  "client": {
    "name": "Client Name",
    "address": "456 Client Ave",
    "cityStateZip": "City, State, 67890",
    "country": "Country",
    "taxId": "TAX123"
  },
  "invoice": {
    "number": "INV-2025.01",
    "date": "Jan 15 2025",
    "dueDate": "Jan 30 2025"
  },
  "items": [
    {
      "description": "Service description",
      "rate": "1000.00",
      "currency": "USD"
    }
  ],
  "totals": {
    "currency": "USD",
    "total": "1,000.00"
  }
}
```

- **自由职业者账单**: 快速生成专业发票发送给客户
- **企业账单自动化**: 集成到计费系统自动生成月度发票
- **批量发票处理**: 为多个客户批量生成发票

**推荐指数**: ⭐⭐⭐⭐ (4/5)
- 专注于发票生成，功能精准
- JSON 驱动，易于集成到自动化流程
- 输出格式专业，适合商业使用

---

### 3. 🔄 markdown-converter - 万能文档转换器

**GitHub 链接**: [steipete/markdown-converter](https://github.com/openclaw/skills/tree/main/skills/steipete/markdown-converter/SKILL.md)

**核心功能**:
- 将多种文档格式转换为 Markdown
- 支持文档、网页、媒体等多种格式
- 保留文档结构（标题、表格、列表、链接）
- 可选 Azure Document Intelligence 增强提取

**技术实现机制**:
- 使用 `uvx markitdown` 工具（无需安装）
- 支持多种输入格式：PDF、Word、PowerPoint、Excel、HTML、CSV、JSON、XML
- 媒体支持：图片（EXIF/OCR）、音频（转录）
- 其他格式：ZIP、YouTube URL、EPub

**实用场景**:
```bash
# 转换 Word 文档
uvx markitdown report.docx -o report.md

# 转换 Excel 表格
uvx markitdown data.xlsx > data.md

# 转换 PowerPoint 演示
uvx markitdown slides.pptx -o slides.md

# 使用 Azure Document Intelligence 增强提取
uvx markitdown scan.pdf -d -e "https://your-resource.cognitiveservices.azure.com/"
```

- **文档归档**: 将各种格式的文档统一转换为 Markdown 便于管理
- **AI 文档处理**: 为 LLM 提供结构化的文本输入
- **内容迁移**: 将 Office 文档转换为 Markdown 用于静态网站生成

**推荐指数**: ⭐⭐⭐⭐⭐ (5/5)
- 支持格式极其丰富，真正的"万能"转换器
- 无需安装依赖，即开即用
- 保留文档结构，输出质量高

---

### 4. 💧 add-watermark-to-pdf - PDF 水印工具

**GitHub 链接**: [crossservicesolutions/add-watermark-to-pdf](https://github.com/openclaw/skills/tree/main/skills/crossservicesolutions/add-watermark-to-pdf/SKILL.md)

**核心功能**:
- 为单个或多个 PDF 添加文本水印
- 批量处理支持
- 通过 Solutions API 处理，无需本地安装
- 返回下载链接，支持 ZIP 打包

**技术实现机制**:
- 使用 Cross-Service-Solutions API
- 支持多文件上传（multipart/form-data）
- 异步处理，轮询状态直到完成
- Bearer Token 认证

**实用场景**:
```json
// 输入参数示例
{
  "files": ["document1.pdf", "document2.pdf"],
  "text": "CONFIDENTIAL - Internal Use Only",
  "api_key": "your-api-key"
}

// 输出示例
{
  "job_id": 6101,
  "status": "done",
  "outputs": [
    { "name": "watermarked.pdf", "path": "https://.../watermarked.pdf" }
  ],
  "download_url": "https://.../watermarked.pdf"
}
```

- **文档保护**: 为机密文档添加"内部使用"或"草稿"水印
- **版权保护**: 添加公司名称或版权信息水印
- **批量处理**: 一次性为多个文档添加水印

**推荐指数**: ⭐⭐⭐⭐ (4/5)
- 功能专一，实现简洁
- 支持批量处理，提高效率
- API 驱动，易于集成

---

### 5. 🔐 password-protect-pdf - PDF 密码保护工具

**GitHub 链接**: [crossservicesolutions/password-protect-pdf](https://github.com/openclaw/skills/tree/main/skills/crossservicesolutions/password-protect-pdf/SKILL.md)

**核心功能**:
- 为 PDF 添加密码保护
- 通过 Solutions API 处理
- 返回加密后的 PDF 下载链接
- 安全的密码处理（不记录或回显）

**技术实现机制**:
- 使用 Cross-Service-Solutions API
- 上传 PDF 文件和密码
- 异步处理和状态轮询
- Bearer Token 认证

**实用场景**:
```json
// 输入参数示例
{
  "file": "sensitive-document.pdf",
  "userPass": "my-secure-password",
  "api_key": "your-api-key"
}

// 输出示例
{
  "job_id": 321,
  "status": "done",
  "download_url": "https://.../protected.pdf",
  "file_name": "protected.pdf"
}
```

- **敏感文档加密**: 为财务报告、合同等敏感文档添加密码保护
- **客户交付**: 加密后通过邮件发送给客户
- **归档保护**: 为长期存储的文档添加访问控制

**推荐指数**: ⭐⭐⭐⭐ (4/5)
- 安全可靠的密码保护方案
- API 驱动，易于自动化
- 密码处理安全，不会泄露

---

## 应用场景总结

### 1. 企业文档工作流
```
文档创建 (docx) → 内容转换 (markdown-converter) → 发票生成 (invoice-generator)
→ 水印添加 (add-watermark-to-pdf) → 密码保护 (password-protect-pdf)
```

### 2. 法律文档处理
- 使用 **docx** 的修订追踪功能进行合同协商
- 使用 **markdown-converter** 将历史文档转换为可搜索格式
- 使用 **password-protect-pdf** 保护最终签署的合同

### 3. 自由职业者工具链
- **invoice-generator** 快速生成专业发票
- **docx** 创建项目提案和合同
- **password-protect-pdf** 保护敏感客户信息

### 4. 内容管理系统
- **markdown-converter** 将各种格式的文档统一转换为 Markdown
- **add-watermark-to-pdf** 为发布前的文档添加品牌水印
- **docx** 从 Markdown 逆向生成 Word 文档用于编辑

## 推荐指数排名

| 排名 | Skill | 推荐指数 | 理由 |
|------|-------|---------|------|
| 1 | docx | ⭐⭐⭐⭐⭐ | 功能全面，专业级文档处理，支持复杂场景 |
| 2 | markdown-converter | ⭐⭐⭐⭐⭐ | 支持格式最多，无需安装，输出质量高 |
| 3 | invoice-generator | ⭐⭐⭐⭐ | 专注发票生成，商业价值高 |
| 4 | add-watermark-to-pdf | ⭐⭐⭐⭐ | 批量水印处理，实用性强 |
| 5 | password-protect-pdf | ⭐⭐⭐⭐ | 安全可靠的文档加密方案 |

## 实用建议

1. **组合使用**: 这些技能可以组合使用，形成完整的文档处理流水线
2. **API 优先**: 对于水印和密码保护，选择 API 驱动的方案更易于集成到自动化流程
3. **格式选择**: 对于需要长期保存和协作的文档，优先使用 Markdown 格式
4. **安全考虑**: 处理敏感文档时，务必使用密码保护功能

## 总结

PDF 与文档处理分类的 110 个技能为 AI 助手提供了强大的文档处理能力。从专业的 Word 文档编辑到万能的格式转换，从发票生成到文档安全保护，这些技能覆盖了文档生命周期的各个环节。

特别推荐 **docx** 和 **markdown-converter**，它们分别代表了"专业文档处理"和"万能格式转换"两个方向，是最值得优先掌握的技能。

---

**明日预告**: 笔记与知识管理（Notes & PKM）- 15 个技能，探索如何用 AI 增强个人知识管理系统。
