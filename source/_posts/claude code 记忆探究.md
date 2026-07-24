---
title: claude code 记忆探究
date: 2026-07-24 13:35:19
keywords: "claude code 记忆"
---

# Claude Code 记忆有效性机制探究

> 研究对象:本仓库 `src/memdir/`、`src/services/SessionMemory/` 等(还原)源码。
> 研究问题:Claude Code 如何保证注入上下文的记忆是相关的、不过期的、不重复的、不挤占上下文的。
> 关键常量已经 grep 核验:`MAX_ENTRYPOINT_LINES = 200`、`MAX_ENTRYPOINT_BYTES = 25_000`、`minimumTokensBetweenUpdate: 5000`、老化警告文案。

---

## 一、五个正交的有效性问题

Claude Code 没有把"记忆有效性"当成单一问题,而是拆成新鲜度、相关性、经济性、去重、写入质量五个维度,各配独立机制。

### 1. 新鲜度:记忆会"老化",但不会被删除

`src/memdir/memoryAge.ts` 按文件 mtime 计算记忆年龄(天),超过 1 天的记忆在注入时附带警告:

> "This memory is N days old. **Memories are point-in-time observations, not live state** — claims about code behavior or file:line citations may be outdated. Verify against current code before asserting as fact."

设计选择:**不做自动过期删除**(避免误删仍有效的知识),而是把"这可能过时,用前先对照代码验证"的元信息随记忆一起注入——把失效判断权交给拿着实时工具的主模型。

这与工具结果编造事故的教训是同一哲学:**记忆是声称,代码是事实,冲突时以现场验证为准。**

### 2. 相关性:侧链小模型做守门员,宁缺毋滥

`src/memdir/findRelevantMemories.ts` 不把所有记忆灌进上下文:

- `memoryScan.ts` 扫描各记忆文件的 frontmatter description,组成清单:`[type] filename (时间戳): description`;
- 用 **Sonnet 侧链查询**针对当前用户消息选出**最多 5 个**,系统提示明确要求:
  > "Only include memories that you are certain will be helpful... If you are unsure... do not include it. Be selective and discerning... If there are no memories that would clearly be useful, feel free to return an empty list."
- **语境化抑制**(最精妙的一条):根据 `recentTools`,模型正在使用某工具时,该工具的 API 文档类记忆被抑制(已在实操,不需要),但**警告/坑点类记忆反而保留**:
  > "DO still select memories containing warnings, gotchas, or known issues about those tools — active use is exactly when those matter."

相关性不等于关键词重叠,而是"此刻会不会改变行为"。

### 3. 经济性:索引双 cap + 截断自训导

`src/memdir/memdir.ts:35-38`:MEMORY.md 作为常驻索引,硬限 **200 行 / 25KB**,超限截断并注入警告:

> "WARNING: MEMORY.md is ... Only part of it was loaded. Keep index entries to one line under ~200 chars; move detail into topic files."

截断信息本身就是对模型的写入规范训导,形成"索引轻、正文按需检索"的两级结构。

### 4. 防重复:非蒸发 Set 记账

`src/utils/attachments.ts:1722` 附近的双层机制:

- `loadedNestedMemoryPaths`:会话级持久 Set,记录已注入的记忆路径;即使 `readFileState`(100 条 LRU)把旧条目挤出,同一记忆也不会被二次注入;
- `filterDuplicateMemoryAttachments`:消息规范化阶段兜底合并相邻的重复记忆附件。

### 5. 写入质量:会话记忆挑"安全时机"异步摘录

`src/services/SessionMemory/sessionMemory.ts`:后台 forked subagent 摘录会话要点,不打断主对话。触发条件(`sessionMemoryUtils.ts:34`):

```
初始激活 ≥ 10000 token
且 ( 增量 ≥ 5000 token 且 工具调用 ≥ 3 次 )
或 ( 增量 ≥ 5000 token 且 上一轮 assistant 没有工具调用 )
```

"上一轮无工具调用"是关键设计:工具空窗是自然断点,此时摘录不会把**执行到一半的中间状态**写成事实——避免记忆污染。token 计量哲学与 autocompact 共享,摘录不过频。

---

## 二、注入格式:记忆是普通上下文,不是特权文本

`src/utils/messages.ts:3700` 附近:记忆以 `isMeta: true` 的 **user 侧消息**、包在 `<system-reminder>` 里注入,头部带年龄+路径(`memoryHeader`)。

不放进 system prompt 的好处:

- compact 时能作为普通上下文被自然汰换,不永久占据最贵的位置;
- 角色上属于 user 侧,模型明确知道这是外部注入的参考信息,而非自己的输出。

两类记忆附件:

| 类型 | 内容 | 格式 |
|---|---|---|
| `nested_memory` | CLAUDE.md、项目级指导 | `Contents of ${path}:\n\n${content}` |
| `relevant_memories` | 检索选中的记忆 | `${年龄+路径 header}\n\n${content}` |

---

## 三、总结

| 有效性维度 | 机制 | 关键设计 |
|---|---|---|
| 不过时误导 | 年龄标注,不删除(`memoryAge.ts`) | 失效判断权交给有实时工具的主模型 |
| 只注入相关的 | Sonnet 侧链选择器,≤5 个(`findRelevantMemories.ts`) | 宁缺毋滥 + 按工具使用语境抑制/保留 |
| 不挤占上下文 | 索引 200 行 / 25KB 双 cap(`memdir.ts`) | 截断警告兼做写入规范训导 |
| 不重复注入 | 非蒸发 Set + LRU 双层(`attachments.ts`) | 注入记账与文件读取状态分离 |
| 写入不污染 | token/工具阈值 + 空窗摘录(`sessionMemory.ts`) | 只在自然断点固化事实 |
| 可被汰换 | user 侧 isMeta 注入(`messages.ts`) | 记忆是普通上下文,不是特权文本 |

**一句话**:Claude Code 不追求"记得多",而是用标注新鲜度、侧链选择、结构限额、时机控制保证每一条进入上下文的记忆在此刻大概率是真的、有用的、便宜的——**记忆永远是二等公民,现场验证才是一等公民。**

整体架构是"文件优先 + 侧链检索 + 异步摘录"的组合而非向量库:可审计、可 diff、与开发者工作流(git、编辑器)天然一致。

---

## 四、检索链路:一个 query 进来后如何找到记忆

> 源码依据:`src/utils/attachments.ts:2196-2400`、`src/memdir/findRelevantMemories.ts`、`src/memdir/memoryScan.ts`。

### 4.1 端到端流程

```
用户 query
   │
   ① 预算门禁 (attachments.ts:2383)
   │   collectSurfacedMemories() 扫描历史消息,统计本会话已注入的记忆总字节
   │   ≥ MAX_SESSION_BYTES → 直接放弃检索,本轮不注入任何记忆
   │
   ② 确定搜索范围 (attachments.ts:2206-2213)
   │   query 里 @提到了某个 agent → 只搜该 agent 的专属记忆目录(隔离)
   │   否则 → 搜自动记忆目录 (getAutoMemPath)
   │
   ③ 扫描候选 (memoryScan.ts)
   │   只读每个 .md 的前 30 行 frontmatter,提取 description
   │   组成清单: [type] filename (时间戳): description
   │   —— 此时不读正文,成本极低
   │
   ④ 预过滤 (findRelevantMemories.ts:46-48)
   │   剔除 alreadySurfaced(本会话已注入过的路径)
   │   让选择器的 5 个名额全部花在新候选上
   │
   ⑤ Sonnet 侧链选择 (findRelevantMemories.ts:98-122)
   │   输入: "Query: {用户原文}\n\nAvailable memories:\n{清单}\n\nRecently used tools: {...}"
   │   输出: JSON schema 强约束的 {selected_memories: [...]}, max_tokens 仅 256
   │   规则: 宁缺毋滥、最多 5 个、可返回空列表
   │        正在使用的工具 → 抑制其文档类记忆、保留坑点类记忆
   │   返回值过 validFilenames 白名单——防选择器幻觉出不存在的文件名
   │
   ⑥ 事后双保险过滤 (attachments.ts:2231-2234)
   │   再剔除: readFileState 里已有的(模型自己刚 Read 过的文件)
   │           + alreadySurfaced(多目录合并可能重新引入)
   │   .slice(0, 5) 硬截断
   │
   ⑦ 读取正文 (readMemoriesForSurfacing, attachments.ts:2279)
   │   此时才真正读文件,且带行数/字节双限
   │   超限 → 截断 + 注明 "用 Read 工具看完整文件: {路径}"
   │
   ⑧ 注入 (messages.ts:3700 附近)
       以 isMeta: true 的 user 侧消息、<system-reminder> 包裹
       头部 = memoryHeader(路径 + 年龄警告 "N days old... verify against current code")
```

### 4.2 关键设计

**1. 关键词匹配只做初筛,语义判断交给小模型。** 没有向量库、没有 embedding——排序靠 Sonnet 读 description 清单做一次 256 token 的廉价判断。源码注释(`findRelevantMemories.ts:87-91`)直说了为什么不能纯靠关键词:query 里有 "spawn"、某记忆 description 里也有 "spawn" → 假阳性;所以传 `recentTools` 让选择器知道"模型已在实操这个工具,文档没用,但坑点正有用"。

**2. 去重不靠内存状态,靠扫描消息历史。** `collectSurfacedMemories()` 的注释(`attachments.ts:2244-2250`)解释了这个选择:从消息历史里数已注入的记忆,意味着 **compact 之后旧的注入自然消失、同一记忆可以合法地重新浮出**——去重状态和上下文生命周期自动对齐,无需额外失效逻辑。

**3. 三层预算,层层收紧:**

| 层 | 限制 |
|---|---|
| 会话级 | 累计注入字节 ≥ MAX_SESSION_BYTES 后整个检索关闭 |
| 每轮 | 最多 5 个文件(选择器上限 + slice 硬截断) |
| 每文件 | 行/字节双限,截断后给出 Read 完整文件的指引 |

**4. 失败全部静默降级。** 侧链调用挂了、JSON 解析失败、目录不存在 → 一律返回 `[]`(`catch(() => [])`)。记忆检索是增强,永远不能阻塞主对话。

**一句话**:query 进来后,Claude Code 用"**便宜的元数据扫描 → 廉价小模型语义选择 → 白名单校验 → 多层去重与预算 → 带年龄警告注入**"这条流水线找记忆——每一步都在防三件事:注入不相关的、注入重复的、注入太多的。

---

## 五、compact 压缩时如何保证记忆和上下文不丢关键信息

> 源码依据:`src/services/compact/`(autoCompact.ts、compact.ts、prompt.ts、sessionMemoryCompact.ts)。关键常量已核验:`AUTOCOMPACT_BUFFER_TOKENS = 13_000`、`MAX_CONSECUTIVE_AUTOCOMPACT_FAILURES = 3`。

compact 不是"一刀切摘要",而是**有损摘要 + 无损保留 + 事后重建**三条腿:

### 5.1 摘要是结构化强制的,不是自由发挥

`prompt.ts` 的压缩 prompt 硬性要求摘要包含 **9 个章节**:用户请求与意图、关键技术概念、涉及的文件和代码段(含完整片段)、所有错误及修复、问题解决过程、**所有用户消息清单**、待办任务、当前进行中的工作(精确到文件名和代码)、下一步(必须带用户原话的逐字引用)。要求先在 `<analysis>` 块逐条按时间序分析再写摘要(输出时 analysis 被剥离)。

前置指令明确禁止压缩轮调用工具:*"CRITICAL: Respond with TEXT ONLY. Do NOT call any tools... Tool calls will be REJECTED and will waste your only turn."*

### 5.2 最近消息保留原文

压缩后上下文构成:`边界标记 → 摘要 → 最近 N 条消息原文 → 重注入附件 → SessionStart hooks 结果`。最近消息(至少 5 条含文本消息、10K–40K token)原文保留,切割点保证**不拆开 tool_use/tool_result 对**——边界孤儿由 `ensureToolResultPairing()` 兜底(与防幻觉是同一套机制)。

### 5.3 压缩后主动重建"工作状态"

摘要只能保叙事,工作状态靠重注入(`compact.ts:122-130`):

| 重注入内容 | 预算 |
|---|---|
| 压缩前最近读过的文件 | 50K token / 最多 5 个文件 |
| 本会话调用过的技能全文 | 25K token / 最多 5 个 |
| Plan 模式状态、工具清单、Agent 清单、MCP 指令 | 不限 |
| CLAUDE.md / MEMORY.md | 重跑 SessionStart hooks 重新装载 |

同时 `readFileState`、`loadedNestedMemoryPaths` 全部清空——旧的"我读过这个文件"记账作废,**强迫压缩后用真实 Read 重建状态**,防止基于压缩前的陈旧认知行动。

### 5.4 与 SessionMemory 联动:先试无损路径

`autoCompact.ts:288`:autocompact 触发时**先尝试 `trySessionMemoryCompaction()`**——若后台 forked agent 已把细节持续摘录到会话记忆文件,直接用该文件当摘要、从 `lastSummarizedMessageId` 之后保留原文,**不调 API、零成本**;失败才走传统 LLM 摘要。这就是"细节先落盘、再压缩"的互补设计。且 `lastSummarizedMessageId` 只在"最后一轮无工具调用"时推进——记忆边界永远落在安全断点上。

### 5.5 失败防御

- 压缩请求自身超长(PTL)→ 按 API 轮次整组从头部删除、最多重试 3 次,断口插入 `[earlier conversation truncated for compaction retry]` 标记;
- 连续失败 3 次熔断,不再空烧 API;
- 触发阈值留 13K token 缓冲 + 为摘要输出预留 20K,不压到极限才动手。

**一句话**:compact 的保真 = 结构化摘要保叙事 + 最近消息保原文 + 附件/hooks 重建工作状态 + SessionMemory 提前把细节无损落盘。信息不是"不丢",而是**分级丢**:细节丢进可检索的文件,骨架留在摘要,现场状态靠重建。

---

## 六、问答:恒定偏好(如"法文命名规则")要靠 Sonnet 判断吗?

> 问题:记忆的选择靠模型判断——如果用户偏好用法文规则定义方法名,这个记忆需要 Sonnet 自己判断是否注入吗?

**答:对了一半,关键看偏好走哪条通道——两条通道机制完全不同。**

**通道 A:CLAUDE.md(无条件注入)。** 每轮全文进上下文,**没有任何选择器参与**。"方法名用法文规则"这种恒定适用的偏好,设计意图上就该放这里——它不该被"判断相关性",因为它永远相关。

**通道 B:auto-memory 记忆文件(Sonnet 侧链选择)。** 若偏好被存成记忆目录下的 topic 文件,则确实取决于 Sonnet 选择器的判断——且选择器**只看文件名 + frontmatter description,不读正文**。真实风险:

- 用户说"帮我修个 bug",query 里没有"命名"字样,选择器很可能漏选"法文命名偏好"——修 bug 时新写的函数就会用英文命名;
- 选择器被训导"宁缺毋滥、不确定就不选",跨场景偏好恰恰最容易被漏选。

缓冲机制:**MEMORY.md 索引常驻** system prompt(源码注释:*"Excludes MEMORY.md (already loaded in system prompt)"*)。索引里若有一行命名偏好的钩子,主模型每轮可见、理论上可自行 Read 正文——但这依赖主模型注意力,不如无条件注入可靠。

**结论**:恒定规则放 CLAUDE.md(确定性注入),情境知识放记忆文件(概率性检索)。把"法文命名"存成记忆文件是通道用错了——它会变成"Sonnet 心情好才生效"的偏好。这也暴露了检索式记忆的真实短板:**对"低关键词关联、高持续适用"的偏好天然不友好**,官方的解法不是改进检索,而是提供 CLAUDE.md 这条旁路。

---

## 七、问答:Chromium 量级的庞大源码,记忆系统够用吗?

> 问题:类似 Chrome 这样的庞大源码,Claude Code 记忆似乎不能满足各种情景知识的有效召回。

**答:判断成立——但 Claude Code 从未打算用记忆系统解决大代码库的情景知识召回。它对 Chromium 量级的回答是另一套机制,记忆只是补丁,不是主干。**

### 7.1 记忆系统的容量天花板是刻意的

索引 200 行/25KB、每轮最多 5 条、选择器只读文件名+description、会话级注入字节封顶、无向量索引——每个参数都在拒绝成为知识库。设计上把记忆限定为"**无法从代码推导出的东西**"(用户偏好、反馈、项目动态),代码库知识被明确排除在记忆职责之外。

### 7.2 官方的大库方案:知识挂在目录拓扑上,而不是靠检索召回

关键机制:`nestedMemoryAttachmentTriggers`(`attachments.ts:2167`)——**模型读到某个文件时,该文件目录链上的 CLAUDE.md 被自动注入**。Chromium 场景的正解:

```
chromium/
├── CLAUDE.md              ← 全局约定(构建、代码风格)
├── net/CLAUDE.md          ← 网络栈坑点,touch net/ 下文件时注入
├── content/browser/CLAUDE.md
└── third_party/blink/CLAUDE.md
```

召回问题被**结构性消解**:不需要"根据 query 猜哪条知识相关",而是"碰到哪个目录,哪个目录的知识就来找你"。注入由文件路径拓扑驱动,确定性、线性扩展——一万个子目录 CLAUDE.md 也不互相挤占。再加上 grep/glob/LSP/子 agent 现场检索代码本身(ground truth 永远最新),这两条腿才是大库的主干。

### 7.3 真正的缺口:横切知识

三类知识上述两条腿都接不住:

- **跨子系统耦合**:"改 `//net` 的这个接口必须同步改 `//services/network` 的 mojo 定义"——不属于任何单一目录;
- **历史事故知识**:"2023 年这里因为 X 出过 P0"——代码里看不出来;
- **低关键词关联的经验**:与"法文命名"问题同构,检索式召回天然漏。

这块目前没有原生答案,现实解法是外挂:向量/代码图检索 MCP、层级化文档生成(把横切知识摊平进拓扑)、团队 wiki。

**一句话**:Claude Code 的哲学是"知识住在代码库里(可 git、可审计、团队共享),记忆只存人和项目的事"。Chromium 量级下强项是拓扑注入的确定性,短板是横切知识——它选择把短板留给生态,而不是内置一个会过期、不可 diff 的向量库。

---

## 八、对比:mem0 类开源记忆框架 vs Claude Code 记忆

> 注:mem0 细节基于训练知识,其迭代较快,具体以官方文档为准。

### 8.1 四个层面的差异

**存储基底:向量库 vs 纯文本文件。** mem0 将对话经 LLM 抽取成事实条目 → embedding → 向量库(可选图存储);记忆是数据库里的不透明数据。CC 是 markdown 文件躺在磁盘上——可 cat、可 diff、可 git、可手改。这是**所有权**差异:mem0 的记忆属于系统,CC 的记忆属于用户。

**写入路径:自动流水线 vs 主动决策。** mem0 每轮对话自动过抽取管线,LLM 裁决 ADD/UPDATE/DELETE/NOOP——写是默认行为,连续高频。CC 是主模型判断"值得记"才写 + SessionMemory 在安全断点异步摘录——写是例外行为,刻意低频。

**检索路径:语义近邻 vs 小模型判断。** mem0 用 embedding top-k,百万条可召回,但相似≠有用。CC 用 description 扫描 + Sonnet 选 ≤5 条,判断的是"此刻会不会改变行为"。规模换精度。

**真相地位(最本质):** mem0 把记忆当**权威事实库**,冲突在写入时裁决,检索出来就当真用——因为它服务的场景(客服 bot、助手 app)里模型没有工具现场核实,记忆是它唯一的过去。CC 把记忆当**过期时间未知的声称**,注入时附年龄警告,冲突在读取时由主模型对照 ground truth 裁决——因为 agent 随时可以 grep/Read 验证。

> **mem0 给无法验证的模型供"事实",CC 给能验证的模型供"提示"。工具的有无,决定了记忆系统该往哪个方向做。**

### 8.2 对照表

| 维度 | mem0 类框架 | Claude Code |
|---|---|---|
| 存储 | 向量库(+图) | markdown 文件 |
| 写入 | 每轮自动抽取,LLM 裁决增删改 | 模型主动写 + 安全断点异步摘录 |
| 检索 | embedding top-k,百万级可扩展 | description 扫描 + 小模型选 ≤5 |
| 冲突解决 | 写入时(UPDATE/DELETE) | 读取时(现场验证覆盖记忆) |
| 新鲜度 | 依赖写入时更新 | 注入时标注年龄+验证警告 |
| 可审计 | 弱(需专门 UI/API) | 强(文件即界面,git 即历史) |
| 扩展瓶颈 | 抽取质量、事实污染 | 索引 cap、选择器输入上限 |
| 服务对象 | 无工具的对话应用,海量用户 | 有全套工具的单开发者+单代码库 |

### 8.3 失效模式互补

- mem0 的风险:**写入污染**——抽取错的事实进库后被当真反复召回,用户看不见、难纠正("错误洗白成事实"在自动抽取管线里更易发生);
- CC 的风险:**召回不足**——横切知识、低关键词关联偏好会漏(见第六、七节)。

趋势上两者互相借鉴:mem0 加图结构和时间衰减对付污染与过期;CC 的大规模情景召回短板正是向量检索所长——外挂向量记忆 MCP 给 Claude Code,本质是把两种世界观拼起来:**向量库负责"想起来",文件+现场验证负责"信不信"。**
