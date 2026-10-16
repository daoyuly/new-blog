---
title: translate-ai 项目报告书：本地小模型学术 PDF 翻译流水线
tags:
  - translate-ai
  - 本地大模型
  - Ollama
  - 学术翻译
  - PDF
  - 项目报告
categories:
  - 项目报告
date: 2026-10-16 09:30:00
description: "用本地 8B 档小模型把学术 PDF 译成可校对的简体中文 Markdown；论文不出本机。"
keywords: "translate-ai, 本地翻译, Ollama, Qwen, Marker, 学术 PDF, 术语库, 项目报告"
---

# translate-ai 项目报告书：本地小模型学术 PDF 翻译流水线

**报告日期：** 2026年10月16日  
**项目名称：** translate-ai  
**报告类型：** 项目交付 / 技术架构说明  
**仓库路径：** `~/Documents/my-github/translate_ai`

---

## 执行摘要

translate-ai 把英文学术 PDF 译成一份可校对的简体中文 Markdown。推理在本机完成（Ollama + 8B–9B 档 Qwen），PDF 解析用 Marker，不调用云端模型。架构是 **pipeline + plugin**：流水线里只流动一份 `Document`，文本提取、结构校验、术语绑定、切块遮罩、翻译、核对与润色都是彼此不调用的插件。

当前交付包括：

- 默认流水线 `pipelines/paper_zh.toml`（13 个插件，四段式）
- CLI：`translate-ai run`（支持多 PDF / 目录队列、`--from` 断点续跑）
- 本地网页：上传、排队翻译、中英对照阅读（KaTeX 公式）
- 跨论文确认术语库与本篇覆盖 / 候选机制
- AutoDL 远端部署清单（GPU 上跑 Marker + Ollama）

完成标准是「可校对成稿」，不是「无人校对即发布」。

---

## 1. 背景与目标

### 1.1 要解决什么问题

读论文时常见两条路：要么整篇丢给云端翻译，隐私与配额都受约束；要么自己对着 PDF 边读边译，公式、引用和术语一致性很难守住。translate-ai 的目标是：

1. **论文留在本机**——解析与推理都不上传正文。
2. **结构可对齐**——标题、表格、图片路径保留；公式 / 引用 / URL / 代码与原文逐字相同。
3. **术语可治理**——确认库跨论文复用；模型只能提候选，不能写库。
4. **中断可续跑**——状态落在 `work/<paper-id>/`，从指定插件重跑。

### 1.2 适用与不适用

| 适用 | 不适用 |
|------|--------|
| 消费级 GPU（约 8–12 GB）上的英译中 | 依赖云端才能读懂的扫描件（扫描件只走本机 OCR） |
| 会议 / 期刊 / 综述正文、摘要、致谢 | 把译文排回原版双栏 PDF |
| 以文字为主的附录 | 无人校对即对外发布 |

最终交付是一篇论文一份中文 Markdown；参考文献整节不译，文末保留占位说明。

---

## 2. 产品形态

### 2.1 命令行

```bash
uv sync --extra pdf
ollama pull qwen3:8b && ollama serve

uv run translate-ai run paper.pdf --domain ml
uv run translate-ai run a.pdf b.pdf ./paper_libs --domain ml
uv run translate-ai run --from translate --paper-id paper
```

译文默认写在 `work/<paper-id>/04_polish/translated.md`。多篇按顺序串行；前一篇失败不取消后篇，全部结束后若有失败则以退出码 1 结束。

### 2.2 本地网页

```bash
uv sync --extra pdf --extra web
cd web && npm install && npm run build && cd ..
uv run translate-ai web   # http://127.0.0.1:8765
```

页面只做三件事：上传 PDF、看进度、读译文 / 原文。翻译仍走同一条流水线；同时只跑一篇，其余进队列。阅读页用 KaTeX 渲染 `$...$` / `$$...$$`。

### 2.3 远端 GPU（可选）

`docs/server-setup.md` + `sync.sh` 约定把代码与缓存放在 AutoDL 数据盘，本机用 rsync 推代码、拉回 `work/`。原则：本机术语库与论文目录仍是权威来源，远端主要承担 Marker 与 Ollama 算力。

---

## 3. 架构

### 3.1 核心约定

```
Document
  → probe_text_layer         判断有无文字层
  → pdf_to_markdown          Marker：PDF → Markdown
  → cut_references           参考文献截断
  → check_markdown_rules     规则校验（失败即停）
  → check_markdown_model     模型审结构（只记录）
  → bind_glossary            绑定本篇术语
  → chunk → mask → translate → unmask
  → check_translation        不过则回退 translate 一次
  → polish                   破坏核对则丢弃润色稿
  → assemble                 拼成最终 Markdown
```

- **Document** 字段包括：`paper_id`、`domain`、`pdf_path`、`body`、`source_body`、`glossary`、`chunks`、`status`（`ok` / `failed` / `needs_human`）、`completed_plugins`。
- **Plugin** 形态：`process(doc, ctx) -> doc`，并声明资源类型 `cpu` / `marker` / `ollama`。Marker 插件必须排在所有 Ollama 插件之前（加载配置时检查）。
- **Pipeline** 配置是有序插件名列表。成功后记入 `completed_plugins`；`--from` 从该插件起连同后续一起重跑。`retry_from` 整篇只接受一次回退。
- 工作目录文件是文档的落盘，不是插件之间的调用接口。插件只读 `Document`。

### 3.2 目录结构

```
src/translate_ai/     文档、流水线、插件、Ollama 客户端、本地网页
pipelines/            流水线 TOML
glossary/             确认术语库（跨论文）
web/                  React + Vite 前端
docs/总体需求.md      完整方案约定
work/<paper-id>/      运行产物与 state.json
```

仓库外可用 entry point 组 `translate_ai.plugins` 注册同名插件，覆盖内置实现（例如换掉 `pdf_to_markdown` 或 `translate`）。

### 3.3 资源调度

| 阶段 | 典型占用 | 说明 |
|------|----------|------|
| Marker（块 1） | 峰值约数 GB | 进程退出后再起 Ollama |
| Qwen 8B/9B Q4（块 2–4） | 约 5–7 GB | 单进程，`num_ctx` 8192 |
| 4B 指令版 Q4 | 约 3 GB | 显存不足时的退路 |
| 约 20 页正文 | 12 GB 卡上数分钟到几十分钟 | 含解析、校验、翻译、润色 |

单卡同时只保留一个 Ollama；不默认开 Marker 的 `--use_llm`（会把页面送到外部模型）。

---

## 4. 四段流水线详解

### 4.1 块 1：PDF → Markdown

- PyMuPDF 只探测文字层（字符数 / 页数过低则 `--force_ocr`），其纯文本不进 `source.md`。
- Marker 负责双栏阅读顺序、标题、表格与 LaTeX。
- 遇到独立标题 `References` / `Bibliography` / `参考文献` 即截断，文末写占位说明。

### 4.2 块 2：结构校验 + 术语

规则检查（非空、标题、公式定界、参考文献残留、重复页眉）任一阻断则 `failed`，后续不跑。模型检查只返回带原文引用的 JSON 问题清单，记为警告。术语按规则检索确认库，模型最多提出 25 条候选写入 `candidates.json`，未确认不参与翻译。

### 4.3 块 3：切块 · 遮罩 · 翻译

- 以标题为界切块，源文预算约 1500–2000 token；块间无重叠、不把上一块译文当上下文。
- 公式、引用、URL、代码、图片路径换成 `⟦Tn⟧`，译后按编号还原并核对集合一致。
- 提示词只注入**本块命中**的术语，并标明全篇是否首次出现（`first_mention=zh_en`）。
- 请求顶层 `think: false`；思考模式若打开，输出可能被推理占满导致译文为空。

### 4.4 块 4：核对 · 润色 · 成稿

核对项包括占位符、公式 / 引用逐字相同、长度区间、残留英文句、接缝重复句、术语策略。不过关则整条回退 `translate` 一次。润色只改中文措辞；再过同一套规则，失败则丢弃润色稿保留直译。`needs_human` 在成稿中显式标记。

---

## 5. 术语库治理

生效顺序（先命中优先）：

1. 本篇覆盖 `work/<id>/02_check/overrides.json`
2. 领域库 `glossary/<domain>.json`（如 `ml`）
3. 通用库 `glossary/common.json`

条目字段约定：`policy=translate|keep`、`first_mention`、`status=confirmed`、`aliases`。未列入词表的人名、产品名、技术名、机构名保持原文。模型输出、润色稿和自动核对都不能修改 `glossary/*.json`。

人工处理候选的三种结果：入库（跨论文）、只写 overrides（本篇）、标 `rejected`。

---

## 6. 技术栈

| 层级 | 选型 |
|------|------|
| 语言 / 包管理 | Python 3.12+、uv |
| PDF | PyMuPDF（探测）、Marker（转 MD）、llama-server（公式识别） |
| 本地模型 | Ollama + Qwen3 8B（默认），请求 `POST /api/chat` |
| 后端网页 | FastAPI + uvicorn，托管 Vite 构建产物 |
| 前端 | TypeScript、React、KaTeX |
| 测试 | pytest（流水线、切块、术语、网页） |

版本：`0.1.0`。核心 Python 约 2k+ 行，内置插件覆盖 convert / structure / translate / review 四组。

---

## 7. 设计取舍（刻意不做的事）

下列做法明确不进入实现，避免「看起来能跑、校对成本爆炸」：

- 用 `page.get_text` 或按词切块当翻译输入
- 分块重叠后再拼译文，或把上一块完整译文当上下文
- 只靠提示词「不要译公式」，却不做遮罩 / 还原 / 核对
- 默认翻译参考文献
- 块 2 让模型直接改写英文 Markdown
- 未确认候选参与翻译，或把整个术语库塞进每一块提示
- 插件互相调用，或把工作目录中间文件当插件输入接口
- Marker 与 Ollama 在单卡上并行

这些约束写在 `docs/总体需求.md` 第 12 节，实现与评审都以该文档为准。

---

## 8. 当前状态与验收

### 8.1 已具备

- 默认 `paper_zh` 流水线与插件注册（含 entry point 覆盖）
- CLI 多文件 / 目录队列与 `--from` 续跑
- 本地图书馆式网页（上传、队列、进度、对照阅读）
- 术语确认库 + 候选 / 覆盖流程
- AutoDL 同步与环境安装脚本 / 文档
- pytest 覆盖流水线与网页主路径

### 8.2 验收口径（样稿）

用一篇 10–20 页、双栏、含行内公式与 `[n]` 引用的会议论文锁定参数：

| 块 | 通过标准 |
|----|----------|
| 块 1 | 非空 `source.md`，参考文献已截断 |
| 块 2 | 规则 `pass=true`；生效词表不含未确认候选 |
| 块 3 | 公式 / 引用 / URL 与源文一致；已 `ok` 块中断后续跑可跳过 |
| 块 4 | 术语全文一种译法；润色若破坏约束则回退直译；`needs_human` 可见 |

### 8.3 版权提醒

本地推理不会把 PDF 上传到第三方 API；翻译与传播他人论文仍须遵守版权与许可。本项目只规定技术流程。

---

## 9. 小结

translate-ai 不是又一个「PDF 丢进大模型」的包装，而是一套把**可校对**写进流水线的本地学术翻译系统：插件化边界清晰、公式与引用靠遮罩而不是靠模型自觉、术语靠确认库而不是靠每次重新发明译法。网页与 CLI 共用同一条 pipeline，远端 GPU 只补算力，不改变「论文留在本机、成稿需人过目」的产品边界。

---

**相关文档**

- 仓库内方案：`docs/总体需求.md`
- 远端部署：`docs/server-setup.md`
- 使用说明：`README.md`
