---
title: Agent Token 优化完全指南
tags:
  - Token 优化
  - 成本优化
  - Agent 性能
  - LLM 优化
categories:
  - Agent 实践
abbrlink: 57300
date: 2026-04-15 00:00:00
---

# Agent Token 优化完全指南

> **研究目标**: 在保证效果的前提下，如何减少 token 使用从而降低成本提升性能？

---

## 执行摘要

通过系统提示词、上下文管理、工具调用和模型选择四个维度的优化，可以实现 **30%-70% 的 token 节省**，同时保持甚至提升输出质量。

---

## 一、Token 成本分析

### 1.1 Token 消耗构成

```
总 Token 成本 = 输入 Token + 输出 Token + 工具调用 Token + 缓存 Token
```

**典型 Agent 调用分解**:
- 系统提示词：~500-2000 tokens
- 历史上下文：~1000-5000 tokens
- 任务指令：~200-1000 tokens
- 工具描述：~1000-3000 tokens
- 知识库检索：~500-2000 tokens
- 输出内容：~500-3000 tokens

### 1.2 成本计算示例

假设使用 GPT-4.1（$5/1M input, $15/1M output）：

| 场景 | 输入 Tokens | 输出 Tokens | 单次成本 | 日均调用 | 月成本 |
|------|-----------|------------|---------|---------|--------|
| 简单问答 | 500 | 300 | $0.007 | 1000 | $210 |
| 复杂推理 | 3000 | 1500 | $0.0375 | 100 | $112.5 |
| 多轮对话 | 5000 | 2000 | $0.055 | 50 | $82.5 |

**优化空间**: 30%-70% 的 token 可以通过合理设计节省

---

## 二、核心优化策略

### 2.1 提示词优化

#### 2.1.1 精简系统提示词

**❌ 冗余示例**:
```
你是一个专业的 AI 助手，需要帮助用户完成各种任务。你应该：
1. 理解用户的需求和意图
2. 分析问题的核心和关键点
3. 提供准确、全面、有价值的回答
4. 如果不确定，要诚实地说明
5. 保持友好、专业的态度
6. 遵循道德和法律规范
7. 保护用户隐私
...
（共 800+ tokens）
```

**✅ 优化示例**:
```
专业助手。简洁、准确、诚实、守法。
（仅 8 tokens，节省 99%）
```

#### 2.1.2 使用少样本学习代替详细指令

**❌ 指令式**:
```
当用户询问天气时，你应该：
1. 确认用户的位置
2. 询问具体日期和时间
3. 查询天气信息
4. 以友好的方式呈现结果
5. 包含温度、湿度、风向等信息
...
（300+ tokens）
```

**✅ 示例式**:
```
Q: 北京今天天气怎么样？
A: 北京今天：晴，气温 25°C，湿度 45%，风向：东北风 3级

Q: 上海明天会下雨吗？
A: 上海明天：小雨，气温 22°C，降水概率 70%，建议携带雨具
（50 tokens，节省 83%）
```

#### 2.1.3 结构化提示词

```typescript
interface SystemPrompt {
  role: string;        // "专业助手" (简洁)
  rules: string[];     // ["简洁", "准确", "诚实"]
  tools: string[];     // 只包含实际使用的工具
  context: Context;    // 只包含必要上下文
}

// 压缩格式
const prompt = compact({
  role: '分析师',
  rules: ['数据驱动', '结论优先'],
  output: 'JSON 格式'
});
```

### 2.2 上下文管理

#### 2.2.1 智能上下文裁剪

```typescript
// 上下文压缩算法
function compressHistory(messages: Message[], maxTokens: number): Message[] {
  const priority = {
    user: 3,        // 用户消息优先级最高
    assistant: 2,   // 助手回复中等
    system: 1       // 系统消息最低
  };

  // 1. 保留最近 N 条消息
  const recent = messages.slice(-10);

  // 2. 基于重要性评分
  const scored = messages.map(msg => ({
    ...msg,
    score: calculateImportance(msg, priority)
  }));

  // 3. 按评分排序，选择 top-K
  const selected = scored
    .sort((a, b) => b.score - a.score)
    .slice(0, maxTokens);

  // 4. 去除冗余（相似的消息）
  return deduplicate(selected);
}

function calculateImportance(msg: Message, priority: any): number {
  let score = priority[msg.role] || 0;

  // 包含关键信息
  if (hasKeywords(msg, ['error', 'issue', 'important'])) score += 2;

  // 用户反馈
  if (msg.role === 'user') score += 1;

  // 时间衰减（越新的越重要）
  const age = Date.now() - msg.timestamp;
  score *= Math.exp(-age / (24 * 60 * 60 * 1000)); // 24 小时衰减

  return score;
}
```

#### 2.2.2 分层记忆系统

```typescript
interface MemoryLayers {
  working: Message[];     // 最近 10 条对话，直接提供给 LLM
  episodic: Summary[];    // 最近 100 条对话的摘要
  semantic: VectorDB;     // 长期记忆，语义检索
}

async function getContext(query: string, layers: MemoryLayers) {
  // 1. 工作记忆（直接使用）
  const workingContext = layers.working;

  // 2. 情景记忆（检索相关摘要）
  const episodicQuery = embed(query);
  const relevantEpisodes = await layers.semantic.search(
    episodicQuery,
    topK=3
  );

  // 3. 语义记忆（检索相关知识）
  const semanticMatches = await layers.semantic.search(
    query,
    topK=5
  );

  // 4. 智能压缩
  return compressContext({
    working: workingContext,
    episodes: relevantEpisodes.map(e => e.summary),
    knowledge: semanticMatches.map(k => k.content)
  });
}

// 压缩后 token 使用：从 5000+ → 1000-1500
```

#### 2.2.3 对话摘要技术

```typescript
// 自动摘要生成
async function summarizeConversation(messages: Message[]): Promise<string> {
  const summaryPrompt = `
请用 100 字以内总结这段对话的核心内容：

${messages.map(m => `${m.role}: ${m.content}`).join('\n')}
  `.trim();

  // 使用更便宜的模型做摘要
  const summary = await llm.call(summaryPrompt, {
    model: 'gpt-3.5-turbo',  // 比 GPT-4 便宜 10 倍
    maxTokens: 100
  });

  return summary;
}

// 应用：每 10 段对话生成一次摘要，替换原始对话
// Token 节省：从 5000 tokens → 200 tokens
```

### 2.3 工具调用优化

#### 2.3.1 精简工具描述

**❌ 冗余描述**:
```typescript
const tools = [{
  name: 'search_web',
  description: `这是一个强大的网络搜索工具，可以帮助你在互联网上查找各种信息。
    你可以使用它来搜索新闻、文档、教程、学术论文等多种类型的内容。
    支持的关键词搜索可以精确匹配你提供的内容，也可以进行模糊搜索。
    搜索结果会包含标题、摘要和链接，你可以根据需要选择性地使用。`,
  parameters: { ... }
}];

// 工具描述 token：300+
```

**✅ 精简描述**:
```typescript
const tools = [{
  name: 'search_web',
  description: '搜索网页，返回标题、摘要、链接',
  parameters: {
    type: 'object',
    properties: {
      query: {
        type: 'string',
        description: '搜索关键词'
      },
      limit: {
        type: 'number',
        description: '结果数量 (1-10)',
        default: 5
      }
    },
    required: ['query']
  }
}];

// 工具描述 token：50 (节省 83%)
```

#### 2.3.2 工具合并与复用

```typescript
// ❌ 分散的工具
const tools = [
  { name: 'get_user', description: '获取用户信息' },
  { name: 'update_user', description: '更新用户信息' },
  { name: 'delete_user', description: '删除用户' },
  { name: 'create_user', description: '创建用户' },
  { name: 'list_users', description: '列出用户' }
];

// 总 token：500+

// ✅ 统一的 CRUD 工具
const tools = [{
  name: 'user_crud',
  description: '用户管理：创建、查询、更新、删除',
  parameters: {
    type: 'object',
    properties: {
      operation: { type: 'enum', values: ['create', 'read', 'update', 'delete', 'list'] },
      data: { type: 'object' }  // 根据操作类型提供不同字段
    }
  }
}];

// 总 token：100 (节省 80%)
```

#### 2.3.3 智能工具选择

```typescript
class SmartToolManager {
  private toolStats = new Map<string, ToolStats>();

  async selectTools(query: string): Promise<Tool[]> {
    // 1. 分析用户意图
    const intent = await this.analyzeIntent(query);

    // 2. 基于历史使用统计选择最可能的工具
    const likelyTools = this.getMostUsedTools(intent);

    // 3. 只提供相关工具，避免干扰
    return likelyTools.filter(tool =>
      this.isRelevant(tool, query)
    ).slice(0, 3);  // 最多 3 个工具
  }

  private getMostUsedTools(intent: string): Tool[] {
    return Array.from(this.toolStats.entries())
      .sort((a, b) => b[1].successRate - a[1].successRate)
      .slice(0, 5)
      .map(([name]) => this.tools.get(name));
  }
}

// 效果：工具描述从 2000 tokens → 500 tokens
```

### 2.4 知识库优化

#### 2.4.1 向量化检索 + Rerank

```typescript
// ❌ 直接将所有知识放入上下文
const prompt = `
知识库：
${fullKnowledgeBase}  // 10,000+ tokens

用户问题：${query}
`;

// ✅ 检索 + 精排
async function getRelevantKnowledge(query: string, topK: number = 5) {
  // 1. 精排：向量检索（快速）
  const candidates = await vectorDB.search(query, topK=20);

  // 2. 精排：使用小模型重新评分
  const reranked = await rerank(query, candidates);

  // 3. 选择 top-K
  return reranked.slice(0, topK);
}

// Prompt 示例
const prompt = `
相关知识：
${relevantKnowledge.join('\n\n')}  // 1000 tokens

用户问题：${query}
`;

// Token 节省：10,000 → 1,000 (90%)
```

#### 2.4.2 分块优化

```typescript
// 智能分块策略
async function smartChunk(text: string): Promise<Chunk[]> {
  // 1. 按语义分块（而不是固定长度）
  const semanticChunks = await splitBySemantic(text);

  // 2. 每个块添加摘要（用于检索）
  const chunks = await Promise.all(
    semanticChunks.map(async (chunk) => ({
      content: chunk,
      summary: await summarize(chunk),
      embedding: await embed(chunk),
      metadata: {
        tokens: countTokens(chunk),
        keywords: extractKeywords(chunk)
      }
    }))
  );

  return chunks;
}

// 使用时只提供摘要，按需展开完整内容
```

#### 2.4.3 知识图谱

```typescript
// 结构化知识存储
interface KnowledgeGraph {
  entities: Map<string, Entity>;
  relations: Relation[];
}

async function queryGraph(query: string): Promise<string> {
  // 1. 实体识别
  const entities = await extractEntities(query);

  // 2. 图遍历（高效，不需要 LLM）
  const paths = graph.findPaths(entities, depth=2);

  // 3. 路径压缩为文本
  return paths.map(path => path.toText()).join('\n');
}

// Token 节省：相比全文检索，节省 60-80%
```

---

## 三、模型选择与混合

### 3.1 分层模型架构

```typescript
interface ModelLayer {
  model: string;
  cost: number;        // cost per 1M tokens
  capability: number;  // 0-1
  useCases: string[];
}

const layers: ModelLayer[] = [
  {
    model: 'gpt-4.1',
    cost: 10,
    capability: 1.0,
    useCases: ['复杂推理', '代码生成', '系统设计']
  },
  {
    model: 'gpt-4.1-mini',
    cost: 0.15,
    capability: 0.8,
    useCases: ['文本摘要', '简单问答', '分类']
  },
  {
    model: 'claude-3-haiku',
    cost: 0.25,
    capability: 0.75,
    useCases: ['快速响应', '多轮对话']
  }
];

async function selectModel(task: Task): Promise<string> {
  // 1. 分析任务复杂度
  const complexity = estimateComplexity(task);

  // 2. 预算限制
  const budget = getBudget(task.user);

  // 3. 选择合适的模型
  const suitable = layers.filter(l =>
    l.capability >= complexity &&
    l.cost <= budget
  );

  return suitable[0]?.model || 'gpt-4o-mini';
}

// 效果：平均成本降低 40-60%
```

### 3.2 小模型预处理 + 大模型后处理

```typescript
async function optimizedPipeline(input: string) {
  // 1. 小模型预处理（分类、提取）
  const intent = await smallModel.classify(input);
  const entities = await smallModel.extract(input);

  // 2. 检索相关知识
  const knowledge = await retrieve(intent, entities);

  // 3. 大模型处理（生成高质量答案）
  const response = await largeModel.generate({
    context: knowledge,
    entities,
    intent
  });

  return response;
}

// 成本：$0.001 (预处理) + $0.005 (后处理) = $0.006
// vs 直接大模型：$0.02
// 节省：70%
```

### 3.3 缓存与重用

```typescript
class ResponseCache {
  private cache = new Map<string, CachedResponse>();

  async get(key: string): Promise<string | null> {
    const cached = this.cache.get(key);
    if (!cached) return null;

    // 缓存失效策略
    if (Date.now() - cached.timestamp > 3600000) { // 1 小时
      this.cache.delete(key);
      return null;
    }

    return cached.response;
  }

  async set(key: string, response: string): Promise<void> {
    const cached = {
      response,
      timestamp: Date.now(),
      hits: 0
    };

    this.cache.set(key, cached);
  }
}

// 缓存命中率：60-80%
// Token 节省：直接绕过 LLM 调用
```

---

## 四、最佳实践总结

### 4.1 快速优化清单

#### 系统提示词
- [ ] 移除冗余描述和角色设定
- [ ] 使用紧凑的结构化格式
- [ ] 只包含实际使用的工具
- [ ] 移除"你应该"类指导

#### 上下文管理
- [ ] 实施智能裁剪算法
- [ ] 使用分层记忆系统
- [ ] 定期生成对话摘要
- [ ] 设置上下文窗口限制

#### 工具调用
- [ ] 精简工具描述到 50 字以内
- [ ] 合并相似工具
- [ ] 实施智能工具选择
- [ ] 批量并行调用

#### 模型选择
- [ ] 建立分层模型架构
- [ ] 实施成本优化路由
- [ ] 使用小模型做预处理
- [ ] 缓存高频查询结果

---

## 五、成本效益分析

### 5.1 优化效果预估

假设一个典型应用场景：

| 指标 | 优化前 | 优化后 | 提升 |
|------|--------|--------|------|
| 平均输入 tokens | 3000 | 1200 | -60% |
| 平均输出 tokens | 1500 | 1000 | -33% |
| 单次成本 | $0.03 | $0.01 | -67% |
| 日均调用 | 100 | 100 | 0% |
| 日成本 | $3 | $1 | -67% |
| 月成本 | $90 | $30 | -67% |

### 5.2 投资回报

**优化投入**:
- 开发时间：2-4 周
- 维护成本：低（主要是一次性工作）
- 风险：低（逐步优化）

**收益**:
- 成本节约：60-70%
- 响应速度：提升 30-50%
- 用户体验：保持或提升

**ROI**: 1000%+

---

## 六、参考资源

**工具和框架**:
- LangSmith: https://smith.langchain.com
- OpenTelemetry: https://opentelemetry.io
- Prometheus + Grafana: 监控和告警

**优化指南**:
- OpenAI Prompt Engineering Guide
- Anthropic Prompt Library
- LangChain Best Practices

---

**报告完成时间**: 2026年4月15日
**字数统计**: ~8,000 字（精简版）
