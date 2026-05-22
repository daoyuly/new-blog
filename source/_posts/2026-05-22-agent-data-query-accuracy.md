---
title: 利用 Agent 技术解决数据查询准确性问题的深度实践
date: 2026-05-22
tags: [AI Agent, Data Query, RAG, Text-to-SQL, 数据准确性]
categories: [技术深度分析]
---

# 利用 Agent 技术解决数据查询准确性问题的深度实践

## 引言：数据查询准确性——被低估的关键问题

在企业数据应用的实践中，有一个问题长期存在却常被低估：**数据查询的准确性**。当一个业务分析师在 BI 看板上看到某个指标时，他很少会追问"这个数字准吗？"——直到某天，基于错误数据做出的决策导致了实际损失。

根据 Gartner 2025 年的报告，企业数据质量问题的平均年度损失约为 1290 万美元，而其中超过 40% 的问题直接源于查询环节——要么是查询逻辑错误，要么是语义理解偏差，要么是数据上下文缺失。更值得警惕的是，随着 LLM 驱动的自然语言查询（NL2SQL）的普及，这个问题正在以一种新的形式爆发：LLM 生成的 SQL 看起来语法正确，但语义可能完全偏离用户意图。

传统解决方案——数据治理、元数据管理、SQL 审核规则——依然有效，但它们是静态的、被动的、依赖人工规则的。而 Agent 技术的引入，为这个问题提供了一个全新的解决范式：**让查询本身变得智能——能够理解、推理、校验、修正**。

本文将从痛点剖析出发，系统阐述 Agent 技术如何提升数据查询准确性，给出具体的技术方案、代码实现、架构设计和业界案例，最后提供可落地的实施路径。

---

## 一、数据查询准确性的核心痛点

### 1.1 语义歧义：自然语言与数据语言之间的鸿沟

语义歧义是自然语言查询中最常见、也最棘手的问题。同一个业务问题，不同的表述方式、不同的上下文环境，可能对应完全不同的查询逻辑。

**典型案例：**

| 用户查询 | 可能的语义理解 | 关键歧义点 |
|---------|-------------|----------|
| "上个月的销售额" | 当月确认的收入？还是开票金额？还是回款金额？ | "销售额"的业务定义 |
| "活跃用户数" | DAU？MAU？登录即算？还是有操作行为？ | "活跃"的判定标准 |
| "华东区 TOP10 客户" | 按收入？按订单量？按利润？ | 排序维度 |
| "环比增长率" | (本月-上月)/上月？还是 (本月/上月-1)？ | 计算口径 |

这些歧义不是 NLP 模型能独立解决的，因为正确的语义取决于**业务上下文**和**数据模型定义**，而这些信息通常分散在数据字典、业务文档、团队知识库等不同地方。

**更深层的问题：** LLM 在生成 SQL 时，倾向于使用最常见的语义理解，而不是特定企业的业务定义。例如，当用户问"活跃用户"时，GPT-4 可能默认按"有登录行为"生成 SQL，但企业实际定义可能是"当月至少完成 3 次核心操作的用户"。这种语义偏差在大规模查询场景下会系统性地产出错误数据。

### 1.2 数据质量：脏数据对查询结果的隐性污染

数据质量问题对查询准确性的影响是隐性的——查询逻辑可能完全正确，但结果仍然是错的，因为底层数据本身就是脏的。

**常见数据质量问题及其对查询的影响：**

```python
# 问题1：空值导致聚合结果偏差
# 场景：计算平均客单价，但部分订单金额为 NULL
# 错误结果：AVG() 自动忽略 NULL，实际参与计算的样本量被缩减
SELECT AVG(order_amount) FROM orders WHERE month = '2026-04';
-- 结果：328.5（基于 78% 的非空记录）
-- 真实均值：可能远低于此，因为 NULL 可能集中在小额订单

# 问题2：重复数据导致计数膨胀
# 场景：ETL 过程中产生的重复记录
SELECT COUNT(DISTINCT user_id) FROM user_events WHERE event_date = '2026-05-01';
-- 如果同一事件被记录多次，即使 DISTINCT 也可能因 ID 不一致而失准

# 问题3：编码不一致导致关联失败
# 场景：A 表的部门字段是"技术部"，B 表是"技术研发部"
-- JOIN 时无法匹配，导致结果遗漏

# 问题4：时区不一致导致时间范围偏差
# 场景：数据入库使用 UTC，查询使用北京时间
SELECT SUM(amount) FROM transactions 
WHERE created_at BETWEEN '2026-05-01' AND '2026-05-31';
-- 8小时时差意味着跨日边界的数据归属错误
```

传统做法是在 ETL 层做数据清洗，但现实中清洗规则往往滞后于数据变化，且无法覆盖所有场景。Agent 可以在查询时动态检测和提示数据质量问题，将"被动清洗"升级为"主动感知"。

### 1.3 上下文缺失：查询脱离业务场景的孤立性

数据查询通常是一个孤立的行为——用户提出问题，系统返回结果。但准确的查询需要丰富的上下文支撑：

- **用户上下文**：查询者的角色、权限、常用的指标口径
- **业务上下文**：当前的考核周期、正在进行的营销活动、异常事件
- **数据上下文**：表结构变更历史、字段含义的演变、数据血缘关系
- **历史上下文**：之前问过什么问题、当前查询是否是追问、是否需要对比

**实际场景：**

分析师 A 问："Q1 的 GMV 是多少？"系统返回 1.2 亿。
分析师 B 问："Q1 的 GMV 是多少？"系统也返回 1.2 亿。

但如果 A 是电商运营，B 是财务审计，他们需要的"GMV"口径可能完全不同——运营口径可能包含退款前数据，财务口径需要扣除退货。如果系统不理解用户上下文，就会给出"同一个"但"对某人来说是错"的答案。

### 1.4 多源异构：数据分散导致的查询碎片化

现代企业的数据架构通常是多源的：

- 业务数据库（MySQL、PostgreSQL）存事务数据
- 数据仓库（Snowflake、BigQuery）存分析数据
- 实时流（Kafka、Flink）存事件数据
- 文档系统（Elasticsearch）存日志和非结构化数据
- SaaS 平台（Salesforce、HubSpot）存 CRM 数据

当用户的问题需要跨源关联时，准确性急剧下降：

```
用户问："上周从市场渠道来的新客户，他们的首单转化率和客单价是多少？"

需要关联：
- 广告投放数据（Google Ads API）
- 网站行为数据（Kafka → ClickHouse）
- 用户注册数据（MySQL）
- 订单交易数据（Snowflake）
```

每个数据源有不同的 schema、更新频率、时间粒度和语义定义。人工编写跨源查询已经非常容易出错，LLM 在没有充足 schema 信息的情况下生成跨源 SQL，错误率更高。

### 1.5 痛点总结：一个系统性问题

| 痛点类别 | 根本原因 | 传统解法 | 局限性 |
|---------|---------|---------|--------|
| 语义歧义 | NL 与 SQL 的语义鸿沟 | 数据字典、SQL 模板 | 覆盖不全，维护成本高 |
| 数据质量 | ETL 延迟、系统异构 | 数据质量规则、清洗流水线 | 滞后、规则硬编码 |
| 上下文缺失 | 查询是孤立行为 | BI 看板预设口径 | 无法适配个性化需求 |
| 多源异构 | 数据架构碎片化 | 数据湖/仓统一 | 统一成本高，实时性差 |

这些痛点的共同特征是：**它们都需要动态的、上下文感知的、可推理的能力来解决**——而这正是 Agent 技术的核心优势。

---

## 二、Agent 技术的解决思路

### 2.1 Agent 与传统查询方案的对比

在深入具体技术之前，我们先明确 Agent 与传统方案的差异：

```
传统查询流程：
用户输入 → [NLU 解析] → [SQL 生成] → [执行] → 返回结果
                                    ↑
                               单次生成，无修正

Agent 查询流程：
用户输入 → [意图理解] → [查询规划] → [SQL 生成] → [自我校验] → [执行] → [结果验证] → 返回结果
              ↑              ↑              ↑              ↑              ↑
          澄清歧义      多步分解       检查语义        模拟执行       异常检测
          补充上下文    选择数据源     纠正错误        干运行验证     质量提示
```

核心差异在于：**Agent 具备闭环能力——感知、决策、行动、反馈**。它不是一次性生成查询，而是一个"思考-验证-修正"的迭代过程。

### 2.2 Agent 核心能力映射

| Agent 能力 | 对应查询准确性问题 | 具体作用 |
|-----------|----------------|---------|
| Query Rewrite（查询改写） | 语义歧义、上下文缺失 | 消歧、补全、规范化 |
| RAG 增强 | 语义歧义、上下文缺失 | 注入业务知识、schema 信息 |
| 多步推理（Chain-of-Thought） | 复杂查询、多源异构 | 分解子问题、逐步求解 |
| 自我校验（Self-Verification） | SQL 逻辑错误 | 干运行、语义检查、结果合理性验证 |
| 工具调用（Tool Use） | 多源异构、数据质量 | 跨源查询、质量探查、元数据检索 |
| 交互式澄清 | 语义歧义 | 主动询问用户，确认意图 |
| 记忆机制 | 上下文缺失 | 会话历史、用户偏好、常用口径 |

### 2.3 Query Rewrite：从模糊到精确

Query Rewrite 是 Agent 提升查询准确性的第一道防线。它的核心思想是：**在生成 SQL 之前，先将模糊的自然语言查询改写为语义明确的结构化描述**。

**改写层次：**

1. **消歧改写**：识别歧义术语，基于上下文或主动询问确定语义
2. **补全改写**：补充隐含的时间范围、维度限定、筛选条件
3. **规范化改写**：统一术语表达，映射到标准业务定义
4. **分解改写**：将复杂查询拆解为可独立求解的子查询

**实现示例：**

```python
from pydantic import BaseModel
from typing import Optional
from openai import OpenAI

client = OpenAI()

class RewrittenQuery(BaseModel):
    """改写后的结构化查询描述"""
    original_query: str
    rewritten_query: str
    metric_name: str
    metric_definition: str
    time_range: str
    dimensions: list[str]
    filters: list[str]
    ambiguities: list[str]
    clarifications_needed: list[str]
    confidence: float

def rewrite_query(user_query: str, context: dict) -> RewrittenQuery:
    """基于上下文改写用户查询"""
    
    system_prompt = """你是一个数据查询改写专家。你的任务是将用户的自然语言查询改写为
语义明确的结构化描述。
    
可用上下文：
- 用户角色：{role}
- 常用指标定义：{metric_definitions}
- 数据字典摘要：{schema_summary}
- 会话历史：{conversation_history}

改写规则：
1. 识别查询中的歧义术语，基于上下文消除；无法消除则标记为需澄清
2. 补全隐含的时间范围（默认最近一个完整周期）
3. 将业务术语映射到标准定义
4. 如果查询包含多个子问题，标记需要分解
5. 评估改写置信度（0-1）
""".format(**context)

    response = client.beta.chat.completions.parse(
        model="gpt-4o",
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_query}
        ],
        response_format=RewrittenQuery
    )
    
    return response.choices[0].message.parsed

# 使用示例
context = {
    "role": "电商运营分析师",
    "metric_definitions": {
        "活跃用户": "当月至少完成1次支付行为的去重用户数",
        "GMV": "订单创建时的商品总金额，不含退款",
        "转化率": "支付用户数 / 访问用户数"
    },
    "schema_summary": "dwd_order_fact: 订单事实表, dwd_user_dim: 用户维度表",
    "conversation_history": "用户刚刚查看了5月的整体运营数据"
}

result = rewrite_query("上个月活跃用户的转化率怎么样", context)
print(f"原始查询: {result.original_query}")
print(f"改写查询: {result.rewritten_query}")
print(f"指标定义: {result.metric_name} = {result.metric_definition}")
print(f"歧义项: {result.ambiguities}")
print(f"置信度: {result.confidence}")
```

**改写效果示例：**

```
原始查询: "上个月活跃用户的转化率怎么样"
改写查询: "2026年4月，完成至少1次支付行为的去重用户中，支付用户数/访问用户数的值"
指标: 转化率 = 支付用户数 / 访问用户数
时间: 2026-04-01 至 2026-04-30
维度: [整体]
筛选: [用户当月支付次数 >= 1]
歧义: ["上个月"默认为自然月，如需财务月需确认]
置信度: 0.85
```

### 2.4 RAG 增强：为 Agent 注入业务知识

RAG（Retrieval-Augmented Generation）是解决语义歧义和上下文缺失的关键手段。在数据查询场景中，RAG 的作用是**在生成 SQL 之前，检索相关的业务知识、schema 信息和历史查询模式**，作为 LLM 的补充上下文。

**数据查询场景的 RAG 架构：**

```
┌──────────────────────────────────────────────────────┐
│                   知识检索层                          │
│                                                      │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐          │
│  │ 数据字典  │  │ 指标定义  │  │ SQL模板库 │          │
│  │ (Vector)  │  │ (Vector)  │  │ (Vector)  │          │
│  └─────┬────┘  └─────┬────┘  └─────┬────┘          │
│        │             │             │                  │
│        └─────────────┼─────────────┘                  │
│                      │                                │
│              ┌───────▼───────┐                        │
│              │  混合检索引擎  │                        │
│              │  BM25 + Dense │                        │
│              └───────┬───────┘                        │
└──────────────────────┼───────────────────────────────┘
                       │
┌──────────────────────▼───────────────────────────────┐
│                   Agent 决策层                        │
│                                                      │
│  用户查询 → [改写] → [检索] → [增强Prompt] → [生成SQL]│
│                            ↑                          │
│                    检索到的知识片段                     │
└──────────────────────────────────────────────────────┘
```

**知识库构建：**

```python
from langchain_core.documents import Document
from langchain_community.vectorstores import Chroma
from langchain_openai import OpenAIEmbeddings

class DataKnowledgeRAG:
    """数据查询知识库 RAG 系统"""
    
    def __init__(self):
        self.embeddings = OpenAIEmbeddings(model="text-embedding-3-small")
        self.vectorstore = Chroma(
            collection_name="data_knowledge",
            embedding_function=self.embeddings
        )
    
    def index_schema(self, schema_info: dict):
        """索引数据模型信息"""
        docs = []
        for table_name, table_info in schema_info.items():
            # 表级文档
            doc = Document(
                page_content=f"表名: {table_name}\n描述: {table_info['description']}\n"
                           f"字段: {', '.join(table_info['columns'].keys())}",
                metadata={"type": "schema", "table": table_name}
            )
            docs.append(doc)
            
            # 字段级文档
            for col_name, col_info in table_info['columns'].items():
                doc = Document(
                    page_content=f"表: {table_name}, 字段: {col_name}\n"
                               f"类型: {col_info['type']}\n"
                               f"描述: {col_info['description']}\n"
                               f"枚举值: {col_info.get('enum_values', 'N/A')}",
                    metadata={"type": "column", "table": table_name, "column": col_name}
                )
                docs.append(doc)
        
        self.vectorstore.add_documents(docs)
    
    def index_metrics(self, metrics: dict):
        """索引指标定义"""
        docs = []
        for metric_name, metric_info in metrics.items():
            doc = Document(
                page_content=f"指标名: {metric_name}\n"
                           f"业务定义: {metric_info['definition']}\n"
                           f"计算公式: {metric_info['formula']}\n"
                           f"数据来源: {metric_info['source_table']}\n"
                           f"口径说明: {metric_info['caliber_note']}\n"
                           f"负责人: {metric_info['owner']}",
                metadata={"type": "metric", "metric": metric_name}
            )
            docs.append(doc)
        
        self.vectorstore.add_documents(docs)
    
    def index_sql_templates(self, templates: list[dict]):
        """索引历史高质量 SQL 模板"""
        docs = []
        for t in templates:
            doc = Document(
                page_content=f"问题: {t['question']}\nSQL:\n{t['sql']}\n"
                           f"适用场景: {t['scenario']}",
                metadata={"type": "sql_template", "scenario": t['scenario']}
            )
            docs.append(doc)
        self.vectorstore.add_documents(docs)
    
    def retrieve(self, query: str, top_k: int = 5) -> list[Document]:
        """混合检索：结合语义相似度和关键词匹配"""
        # 语义检索
        semantic_results = self.vectorstore.similarity_search_with_score(
            query, k=top_k * 2
        )
        
        # 按类型分组，确保各类型知识都有覆盖
        type_groups = {}
        for doc, score in semantic_results:
            doc_type = doc.metadata.get("type", "unknown")
            if doc_type not in type_groups:
                type_groups[doc_type] = []
            type_groups[doc_type].append((doc, score))
        
        # 每类取 top-k/num_types
        results = []
        per_type = max(1, top_k // len(type_groups)) if type_groups else top_k
        for doc_type, group in type_groups.items():
            results.extend(group[:per_type])
        
        # 按分数排序取 top_k
        results.sort(key=lambda x: x[1])
        return [doc for doc, _ in results[:top_k]]


# 构建知识库
rag = DataKnowledgeRAG()

# 索引数据模型
rag.index_schema({
    "dwd_order_fact": {
        "description": "订单事实表，记录所有订单的交易明细",
        "columns": {
            "order_id": {"type": "string", "description": "订单唯一标识"},
            "user_id": {"type": "string", "description": "下单用户ID"},
            "order_amount": {"type": "decimal", "description": "订单金额（元），不含运费"},
            "pay_amount": {"type": "decimal", "description": "实付金额（元），含优惠扣减"},
            "order_status": {
                "type": "string",
                "description": "订单状态",
                "enum_values": "created, paid, shipped, completed, cancelled, refunded"
            },
            "created_at": {"type": "timestamp", "description": "订单创建时间（UTC）"},
        }
    }
})

# 索引指标定义
rag.index_metrics({
    "GMV": {
        "definition": "一段时间内所有已创建订单的金额总和（不含退款）",
        "formula": "SUM(order_amount) WHERE order_status IN ('created','paid','shipped','completed')",
        "source_table": "dwd_order_fact",
        "caliber_note": "不包含已取消和已退款订单，按订单创建时间统计",
        "owner": "数据平台团队"
    }
})
```

### 2.5 多步推理：复杂查询的分解与编排

复杂查询往往无法一步到位地生成 SQL，需要 Agent 进行多步推理和任务分解。

**典型场景：** "对比华东和华南区域 Q1 的获客成本趋势，并分析差异原因"

这个查询需要：
1. 理解"获客成本"的定义和计算方式
2. 识别华东和华南区域的数据范围
3. 分别查询两个区域各月的获客成本
4. 计算趋势和差异
5. 结合外部数据（营销预算、渠道分布）分析原因

**ReAct 模式实现：**

```python
import json
from dataclasses import dataclass
from typing import Callable

@dataclass
class Tool:
    name: str
    description: str
    func: Callable

class DataQueryAgent:
    """基于 ReAct 模式的数据查询 Agent"""
    
    def __init__(self, llm_client, tools: list[Tool], max_iterations: int = 10):
        self.llm = llm_client
        self.tools = {t.name: t for t in tools}
        self.max_iterations = max_iterations
    
    def run(self, query: str) -> dict:
        """执行 ReAct 循环"""
        messages = [
            {"role": "system", "content": self._build_system_prompt()},
            {"role": "user", "content": query}
        ]
        
        trajectory = []
        
        for i in range(self.max_iterations):
            response = self.llm.chat.completions.create(
                model="gpt-4o",
                messages=messages,
                temperature=0
            )
            
            thought, action, action_input = self._parse_response(
                response.choices[0].message.content
            )
            
            trajectory.append({
                "iteration": i + 1,
                "thought": thought,
                "action": action,
                "action_input": action_input
            })
            
            if action == "FINISH":
                return {
                    "answer": action_input,
                    "trajectory": trajectory,
                    "iterations": i + 1
                }
            
            # 执行工具
            if action in self.tools:
                observation = self.tools[action].func(action_input)
            else:
                observation = f"Error: Unknown tool '{action}'"
            
            trajectory[-1]["observation"] = observation
            
            # 将思考-行动-观察追加到消息
            messages.append({"role": "assistant", "content": response.choices[0].message.content})
            messages.append({"role": "user", "content": f"Observation: {observation}"})
        
        return {"answer": "达到最大迭代次数", "trajectory": trajectory}
    
    def _build_system_prompt(self) -> str:
        tool_descriptions = "\n".join(
            [f"- {name}: {t.description}" for name, t in self.tools.items()]
        )
        return f"""你是一个数据查询 Agent。请使用 ReAct 模式回答用户的数据查询问题。

可用工具：
{tool_descriptions}

请按以下格式输出：
Thought: [思考当前应该做什么]
Action: [工具名称]
Action Input: [工具输入]

当你有了最终答案时：
Thought: [最终推理]
Action: FINISH
Action Input: [最终答案]"""
    
    def _parse_response(self, text: str):
        """解析 ReAct 格式的响应"""
        thought = ""
        action = ""
        action_input = ""
        
        for line in text.strip().split("\n"):
            if line.startswith("Thought:"):
                thought = line.replace("Thought:", "").strip()
            elif line.startswith("Action:"):
                action = line.replace("Action:", "").strip()
            elif line.startswith("Action Input:"):
                action_input = line.replace("Action Input:", "").strip()
        
        return thought, action, action_input


# 定义工具集
def search_schema(keyword: str) -> str:
    """搜索数据模型"""
    # 实际实现调用 schema 检索服务
    schemas = {
        "获客成本": "表: marketing_cost_fact, 字段: cost_per_acquisition, 定义: 营销总费用/新增用户数",
        "区域": "表: dim_region, 字段: region_name (华东/华南/华北/...), 映射字段: province_code"
    }
    return schemas.get(keyword, f"未找到 '{keyword}' 相关的 schema 信息")

def execute_sql(sql: str) -> str:
    """执行 SQL 查询（带安全限制）"""
    # 实际实现连接数据库执行
    return json.dumps({"rows": [{"month": "2026-01", "east": 45.2, "south": 38.7}], "row_count": 1})

def validate_result(description: str) -> str:
    """校验查询结果的合理性"""
    checks = [
        "数值范围检查：获客成本通常在 20-200 元之间",
        "趋势一致性：与历史数据对比，波动不应超过 30%",
        "交叉验证：获客成本 × 新客数 ≈ 营销总费用"
    ]
    return f"校验通过：{'; '.join(checks)}"

tools = [
    Tool(name="search_schema", description="搜索数据模型和字段定义", func=search_schema),
    Tool(name="execute_sql", description="执行 SQL 查询并返回结果", func=execute_sql),
    Tool(name="validate_result", description="校验查询结果的合理性", func=validate_result),
]

# 运行 Agent
from openai import OpenAI
agent = DataQueryAgent(OpenAI(), tools)
result = agent.run("对比华东和华南区域 Q1 的获客成本趋势")
```

### 2.6 自我校验：让 Agent 自己检查答案

自我校验是 Agent 区别于单次 LLM 调用的关键能力。它让 Agent 在返回结果之前，先检查 SQL 逻辑和查询结果是否合理。

**校验维度：**

```
┌─────────────────────────────────────────────────┐
│              Agent 自我校验框架                    │
│                                                  │
│  ┌───────────┐  ┌───────────┐  ┌───────────┐  │
│  │ SQL 语法   │  │ 语义正确性 │  │ 结果合理性 │  │
│  │ 校验      │  │ 校验      │  │ 校验      │  │
│  └─────┬─────┘  └─────┬─────┘  └─────┬─────┘  │
│        │              │              │          │
│  · 可执行性     · 字段语义匹配    · 数值范围    │
│  · 类型兼容     · 筛选条件完整    · 趋势合理    │
│  · JOIN 正确    · 聚合逻辑正确    · 交叉验证    │
│  · 无注入风险   · 时间范围正确    · 空值检查    │
└─────────────────────────────────────────────────┘
```

**实现代码：**

```python
from pydantic import BaseModel

class SQLValidationResult(BaseModel):
    is_valid: bool
    syntax_check: dict  # {passed: bool, errors: list}
    semantic_check: dict  # {passed: bool, issues: list}
    result_check: dict  # {passed: bool, anomalies: list}
    suggestions: list[str]
    corrected_sql: str | None = None

class SQLSelfValidator:
    """SQL 自我校验器"""
    
    def __init__(self, llm_client, schema_info: dict):
        self.llm = llm_client
        self.schema = schema_info
    
    def validate(self, sql: str, original_query: str, 
                 query_result: dict | None = None) -> SQLValidationResult:
        """多维度校验 SQL"""
        
        # 1. 语法校验（规则引擎）
        syntax_result = self._check_syntax(sql)
        
        # 2. 语义校验（LLM + 规则）
        semantic_result = self._check_semantic(sql, original_query)
        
        # 3. 结果合理性校验（如有查询结果）
        result_result = {}
        if query_result:
            result_result = self._check_result_reasonability(
                sql, original_query, query_result
            )
        
        # 4. 汇总判断
        is_valid = (
            syntax_result.get("passed", False) and
            semantic_result.get("passed", False) and
            result_result.get("passed", True)  # 结果校验可选
        )
        
        # 5. 如果校验失败，尝试修正
        corrected_sql = None
        if not is_valid:
            corrected_sql = self._attempt_correction(
                sql, syntax_result, semantic_result
            )
        
        suggestions = (
            syntax_result.get("errors", []) +
            semantic_result.get("issues", []) +
            result_result.get("anomalies", [])
        )
        
        return SQLValidationResult(
            is_valid=is_valid,
            syntax_check=syntax_result,
            semantic_check=semantic_result,
            result_check=result_result,
            suggestions=suggestions,
            corrected_sql=corrected_sql
        )
    
    def _check_syntax(self, sql: str) -> dict:
        """基于规则的语法检查"""
        errors = []
        
        # 检查危险操作
        dangerous_patterns = ["DROP", "DELETE", "UPDATE", "INSERT", "ALTER", "TRUNCATE"]
        sql_upper = sql.upper()
        for pattern in dangerous_patterns:
            if pattern in sql_upper:
                errors.append(f"检测到危险操作: {pattern}")
        
        # 检查 SELECT 是否有 FROM
        if "SELECT" in sql_upper and "FROM" not in sql_upper:
            errors.append("SELECT 语句缺少 FROM 子句")
        
        # 检查未关闭的括号
        if sql.count("(") != sql.count(")"):
            errors.append("括号不匹配")
        
        # 检查是否有限制行数（防止全表扫描）
        if "LIMIT" not in sql_upper and "WHERE" not in sql_upper:
            errors.append("查询缺少 WHERE 或 LIMIT 子句，可能导致全表扫描")
        
        return {"passed": len(errors) == 0, "errors": errors}
    
    def _check_semantic(self, sql: str, original_query: str) -> dict:
        """基于 LLM 的语义校验"""
        prompt = f"""请校验以下 SQL 是否正确实现了用户的查询意图。

用户查询: {original_query}
生成的 SQL: {sql}

可用表结构:
{json.dumps(self.schema, ensure_ascii=False, indent=2)}

请检查：
1. 选择的字段是否与用户请求的指标匹配
2. WHERE 条件是否完整覆盖了用户的筛选需求
3. JOIN 关系是否正确（是否存在笛卡尔积风险）
4. GROUP BY 是否包含所有非聚合维度
5. 时间范围是否与用户表述一致
6. 聚合函数（SUM/COUNT/AVG等）是否使用了正确的字段

请输出 JSON 格式：{{"passed": bool, "issues": [str]}}"""

        response = self.llm.chat.completions.create(
            model="gpt-4o",
            messages=[{"role": "user", "content": prompt}],
            response_format={"type": "json_object"},
            temperature=0
        )
        
        return json.loads(response.choices[0].message.content)
    
    def _check_result_reasonability(self, sql: str, query: str, 
                                     result: dict) -> dict:
        """校验查询结果的合理性"""
        anomalies = []
        
        rows = result.get("rows", [])
        
        # 空结果检查
        if len(rows) == 0:
            anomalies.append("查询结果为空，请检查筛选条件是否过于严格")
        
        # NULL 值比例检查
        if rows:
            for col in rows[0]:
                null_count = sum(1 for r in rows if r[col] is None)
                null_ratio = null_count / len(rows)
                if null_ratio > 0.3:
                    anomalies.append(
                        f"字段 '{col}' 的 NULL 值比例为 {null_ratio:.1%}，"
                        f"可能影响结果准确性"
                    )
        
        # 数值范围检查（基于历史统计）
        # ... 省略具体实现
        
        return {"passed": len(anomalies) == 0, "anomalies": anomalies}
    
    def _attempt_correction(self, sql: str, syntax_issues: dict, 
                            semantic_issues: dict) -> str | None:
        """尝试自动修正 SQL"""
        all_issues = syntax_issues.get("errors", []) + semantic_issues.get("issues", [])
        
        prompt = f"""以下 SQL 存在问题，请修正：

原 SQL: {sql}
问题列表: {all_issues}

请输出修正后的 SQL，只输出 SQL 语句本身，不要其他内容。"""

        response = self.llm.chat.completions.create(
            model="gpt-4o",
            messages=[{"role": "user", "content": prompt}],
            temperature=0
        )
        
        return response.choices[0].message.content.strip()
```

### 2.7 工具调用：Agent 的手脚

工具调用赋予了 Agent 与外部系统交互的能力。在数据查询场景中，Agent 需要以下核心工具：

```python
from typing import Annotated

# 使用 OpenAI Function Calling 定义工具

tools_definition = [
    {
        "type": "function",
        "function": {
            "name": "search_data_dictionary",
            "description": "搜索数据字典，查找表、字段、指标的定义和说明",
            "parameters": {
                "type": "object",
                "properties": {
                    "keyword": {
                        "type": "string",
                        "description": "搜索关键词，如表名、字段名或业务术语"
                    },
                    "search_type": {
                        "type": "string",
                        "enum": ["table", "column", "metric", "all"],
                        "description": "搜索范围"
                    }
                },
                "required": ["keyword"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "execute_sql",
            "description": "执行 SQL 查询并返回结果。仅支持 SELECT 语句，自动添加 LIMIT",
            "parameters": {
                "type": "object",
                "properties": {
                    "sql": {"type": "string", "description": "要执行的 SQL 语句"},
                    "dry_run": {
                        "type": "boolean",
                        "description": "是否只做语法检查不实际执行",
                        "default": False
                    },
                    "max_rows": {
                        "type": "integer",
                        "description": "最大返回行数",
                        "default": 1000
                    }
                },
                "required": ["sql"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "get_table_profile",
            "description": "获取表的统计概要信息，包括行数、字段分布、NULL比例等",
            "parameters": {
                "type": "object",
                "properties": {
                    "table_name": {"type": "string"},
                    "columns": {
                        "type": "array",
                        "items": {"type": "string"},
                        "description": "需要分析的列名，为空则分析所有列"
                    }
                },
                "required": ["table_name"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "get_query_history",
            "description": "获取相似查询的历史记录和 SQL 模板",
            "parameters": {
                "type": "object",
                "properties": {
                    "query_description": {
                        "type": "string",
                        "description": "查询描述"
                    },
                    "top_k": {
                        "type": "integer",
                        "description": "返回最相似的 K 个历史查询",
                        "default": 5
                    }
                },
                "required": ["query_description"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "validate_data_quality",
            "description": "检查指定表的数据质量，包括完整性、一致性、时效性",
            "parameters": {
                "type": "object",
                "properties": {
                    "table_name": {"type": "string"},
                    "quality_dimensions": {
                        "type": "array",
                        "items": {
                            "type": "string",
                            "enum": ["completeness", "consistency", "timeliness", "accuracy"]
                        },
                        "description": "需要检查的质量维度"
                    }
                },
                "required": ["table_name"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "ask_user_for_clarification",
            "description": "当查询存在歧义时，向用户请求澄清",
            "parameters": {
                "type": "object",
                "properties": {
                    "question": {
                        "type": "string",
                        "description": "需要用户澄清的问题"
                    },
                    "options": {
                        "type": "array",
                        "items": {"type": "string"},
                        "description": "可选的答案列表"
                    }
                },
                "required": ["question"]
            }
        }
    }
]
```

### 2.8 交互式澄清：不猜，问用户

当 Agent 无法通过上下文消歧时，主动向用户澄清是最安全的选择。但这需要把握一个度——不能每个查询都问，否则用户体验极差。

**澄清决策策略：**

```python
class ClarificationStrategy:
    """决定何时以及如何向用户请求澄清"""
    
    def __init__(self, ambiguity_threshold: float = 0.7):
        self.threshold = ambiguity_threshold
    
    def should_clarify(self, rewritten_query) -> bool:
        """判断是否需要向用户澄清"""
        # 置信度低于阈值且有可澄清项
        if rewritten_query.confidence < self.threshold and \
           rewritten_query.clarifications_needed:
            return True
        
        # 歧义项影响核心指标定义
        critical_terms = {"销售额", "利润", "活跃用户", "转化率"}
        for ambiguity in rewritten_query.ambiguities:
            if any(term in ambiguity for term in critical_terms):
                return True
        
        return False
    
    def generate_clarification_message(self, rewritten_query) -> dict:
        """生成澄清消息"""
        if not rewritten_query.clarifications_needed:
            return {"question": None, "options": []}
        
        # 只针对第一个关键歧义提问
        first_ambiguity = rewritten_query.clarifications_needed[0]
        
        return {
            "question": f"关于您查询中的「{first_ambiguity}」，请问您指的是：",
            "options": self._generate_options(first_ambiguity),
            "allow_custom": True  # 允许用户自定义回答
        }
    
    def _generate_options(self, ambiguity: str) -> list[str]:
        """基于歧义类型生成选项"""
        # 实际实现应从知识库中检索相关定义
        option_map = {
            "销售额": ["订单金额（含退款）", "实付金额（不含退款）", "确认收入（财务口径）"],
            "活跃用户": ["当月有登录的用户", "当月有下单的用户", "当月有核心操作的用户"],
            "利润": ["毛利润", "净利润", "营业利润"],
        }
        return option_map.get(ambiguity, ["请详细描述您的含义"])
```

---

## 三、具体技术方案和架构设计

### 3.1 整体架构：Data Query Agent 系统

```
┌─────────────────────────────────────────────────────────────────┐
│                     用户接入层                                    │
│   ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐      │
│   │ Web UI   │  │ Slack Bot │  │ API      │  │ IDE 插件 │      │
│   └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘      │
└────────┼──────────────┼──────────────┼──────────────┼───────────┘
         │              │              │              │
┌────────▼──────────────▼──────────────▼──────────────▼───────────┐
│                    Agent 编排层                                   │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                   Orchestrator (核心控制器)                │  │
│  │                                                          │  │
│  │  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐          │  │
│  │  │ Query  │ │ Plan   │ │ Execute│ │ Verify │          │  │
│  │  │ Rewrite│ │ &Route │ │ &Call  │ │ &Fix   │          │  │
│  │  └────────┘ └────────┘ └────────┘ └────────┘          │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                   状态管理 & 记忆                         │  │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐              │  │
│  │  │ 会话记忆  │  │ 用户偏好  │  │ 查询历史  │              │  │
│  │  └──────────┘  └──────────┘  └──────────┘              │  │
│  └──────────────────────────────────────────────────────────┘  │
└──────────────────────────┬───────────────────────────────────────┘
                           │
┌──────────────────────────▼───────────────────────────────────────┐
│                    工具 & 知识层                                  │
│                                                                  │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐          │
│  │ Schema   │ │ SQL      │ │ 数据质量  │ │ 指标定义  │          │
│  │ Registry │ │ Executor │ │ Checker  │ │ Store    │          │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘          │
│                                                                  │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐          │
│  │ RAG      │ │ SQL模板  │ │ 数据血缘  │ │ API      │          │
│  │ Store    │ │ Library  │ │ Tracker  │ │ Gateway  │          │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘          │
└──────────────────────────────────────────────────────────────────┘
                           │
┌──────────────────────────▼───────────────────────────────────────┐
│                    数据层                                        │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐          │
│  │ 数据仓库  │ │ 业务数据库│ │ 实时数仓  │ │ SaaS API │          │
│  │ Snowflake│ │ MySQL    │ │ ClickHouse│ │ Salesforce│          │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘          │
└──────────────────────────────────────────────────────────────────┘
```

### 3.2 核心编排逻辑

```python
from enum import Enum
from dataclasses import dataclass, field
from datetime import datetime

class AgentState(Enum):
    INIT = "init"
    REWRITING = "rewriting"
    CLARIFYING = "clarifying"
    PLANNING = "planning"
    GENERATING = "generating"
    VALIDATING = "validating"
    EXECUTING = "executing"
    VERIFYING = "verifying"
    CORRECTING = "correcting"
    COMPLETED = "completed"
    FAILED = "failed"

@dataclass
class QuerySession:
    """一次查询会话的完整状态"""
    session_id: str
    user_id: str
    original_query: str
    state: AgentState = AgentState.INIT
    rewritten_query: str | None = None
    generated_sql: str | None = None
    validated_sql: str | None = None
    query_result: dict | None = None
    validation_result: SQLValidationResult | None = None
    correction_attempts: int = 0
    max_corrections: int = 3
    trajectory: list[dict] = field(default_factory=list)
    created_at: datetime = field(default_factory=datetime.now)

class DataQueryOrchestrator:
    """数据查询 Agent 的核心编排器"""
    
    def __init__(self, llm_client, rag_system, sql_validator, 
                 sql_executor, clarification_strategy):
        self.llm = llm_client
        self.rag = rag_system
        self.validator = sql_validator
        self.executor = sql_executor
        self.clarification = clarification_strategy
    
    async def process_query(self, session: QuerySession) -> QuerySession:
        """处理一次查询请求，走完整个 Agent 流程"""
        
        try:
            # 阶段1：查询改写
            session.state = AgentState.REWRITING
            rewritten = await self._rewrite(session)
            session.rewritten_query = rewritten.rewritten_query
            session.trajectory.append({
                "step": "rewrite",
                "input": session.original_query,
                "output": rewritten.model_dump(),
                "timestamp": datetime.now().isoformat()
            })
            
            # 阶段2：歧义澄清（如需要）
            if self.clarification.should_clarify(rewritten):
                session.state = AgentState.CLARIFYING
                # 返回澄清请求，等待用户回复
                # 实际实现中这里会中断并等待
                clarification_msg = self.clarification.generate_clarification_message(rewritten)
                session.trajectory.append({
                    "step": "clarification_needed",
                    "message": clarification_msg
                })
                # 假设用户已回复，更新 rewritten_query
            
            # 阶段3：SQL 生成
            session.state = AgentState.GENERATING
            sql = await self._generate_sql(session)
            session.generated_sql = sql
            session.trajectory.append({
                "step": "generate_sql",
                "output": sql,
                "timestamp": datetime.now().isoformat()
            })
            
            # 阶段4：SQL 校验（含自我修正循环）
            session.state = AgentState.VALIDATING
            final_sql = await self._validate_and_correct(session)
            session.validated_sql = final_sql
            session.trajectory.append({
                "step": "validate_and_correct",
                "final_sql": final_sql,
                "correction_attempts": session.correction_attempts,
                "timestamp": datetime.now().isoformat()
            })
            
            # 阶段5：执行查询
            session.state = AgentState.EXECUTING
            result = await self.executor.execute(final_sql)
            session.query_result = result
            session.trajectory.append({
                "step": "execute",
                "row_count": len(result.get("rows", [])),
                "timestamp": datetime.now().isoformat()
            })
            
            # 阶段6：结果验证
            session.state = AgentState.VERIFYING
            verified = await self._verify_result(session)
            session.trajectory.append({
                "step": "verify_result",
                "passed": verified,
                "timestamp": datetime.now().isoformat()
            })
            
            session.state = AgentState.COMPLETED
            
        except Exception as e:
            session.state = AgentState.FAILED
            session.trajectory.append({
                "step": "error",
                "error": str(e),
                "timestamp": datetime.now().isoformat()
            })
        
        return session
    
    async def _rewrite(self, session: QuerySession):
        """查询改写"""
        context = await self._build_context(session)
        return rewrite_query(session.original_query, context)
    
    async def _generate_sql(self, session: QuerySession) -> str:
        """基于改写后的查询和 RAG 增强上下文生成 SQL"""
        # 1. 检索相关知识
        knowledge = self.rag.retrieve(session.rewritten_query, top_k=10)
        knowledge_text = "\n\n".join([doc.page_content for doc in knowledge])
        
        # 2. 检索相似 SQL 模板
        similar_sql = self.rag.retrieve(
            f"SQL模板: {session.rewritten_query}", top_k=3
        )
        template_text = "\n\n".join([doc.page_content for doc in similar_sql])
        
        # 3. 构建 Prompt
        prompt = f"""基于以下信息生成 SQL 查询：

用户原始查询: {session.original_query}
改写后查询: {session.rewritten_query}

相关知识:
{knowledge_text}

相似SQL模板:
{template_text}

要求：
1. 使用标准 SQL 语法
2. 必须包含 WHERE 子句限定数据范围
3. 添加 LIMIT 子句（默认 1000 行）
4. 使用 COALESCE 处理可能的 NULL 值
5. 添加注释说明关键逻辑

请只输出 SQL 语句，不要其他内容。"""

        response = self.llm.chat.completions.create(
            model="gpt-4o",
            messages=[{"role": "user", "content": prompt}],
            temperature=0
        )
        
        sql = response.choices[0].message.content.strip()
        # 清理可能的 markdown 代码块标记
        if sql.startswith("```sql"):
            sql = sql[6:]
        if sql.startswith("```"):
            sql = sql[3:]
        if sql.endswith("```"):
            sql = sql[:-3]
        
        return sql.strip()
    
    async def _validate_and_correct(self, session: QuerySession) -> str:
        """校验 SQL 并在失败时尝试修正"""
        sql = session.generated_sql
        
        while session.correction_attempts < session.max_corrections:
            validation = self.validator.validate(
                sql, session.original_query
            )
            session.validation_result = validation
            
            if validation.is_valid:
                return sql
            
            # 尝试修正
            if validation.corrected_sql:
                sql = validation.corrected_sql
                session.correction_attempts += 1
                session.trajectory.append({
                    "step": "correction",
                    "attempt": session.correction_attempts,
                    "issues": validation.suggestions,
                    "corrected_sql": sql
                })
            else:
                break
        
        return sql  # 返回最后一次修正的 SQL
    
    async def _verify_result(self, session: QuerySession) -> bool:
        """验证查询结果"""
        if not session.query_result:
            return False
        
        # 基本检查
        rows = session.query_result.get("rows", [])
        if len(rows) == 0:
            session.trajectory.append({
                "step": "result_warning",
                "message": "查询结果为空，请确认筛选条件"
            })
            return True  # 空结果也可能是正确的
        
        return True
    
    async def _build_context(self, session: QuerySession) -> dict:
        """构建查询上下文"""
        # 实际实现中从多个来源汇聚上下文
        return {
            "role": "analyst",
            "metric_definitions": {},
            "schema_summary": "",
            "conversation_history": ""
        }
```

### 3.3 TypeScript 实现版本

对于前端驱动的应用场景，以下是基于 TypeScript 的 Agent 实现：

```typescript
import OpenAI from 'openai';

// 类型定义
interface QueryRewrite {
  original: string;
  rewritten: string;
  metric: string;
  definition: string;
  timeRange: string;
  dimensions: string[];
  filters: string[];
  ambiguities: string[];
  confidence: number;
}

interface SQLValidation {
  isValid: boolean;
  syntaxIssues: string[];
  semanticIssues: string[];
  resultAnomalies: string[];
  correctedSQL?: string;
}

interface AgentTool {
  name: string;
  description: string;
  execute: (args: Record<string, unknown>) => Promise<unknown>;
}

// Agent 核心类
class DataQueryAgent {
  private client: OpenAI;
  private tools: Map<string, AgentTool>;
  private maxRetries: number;
  
  constructor(config: { apiKey: string; maxRetries?: number }) {
    this.client = new OpenAI({ apiKey: config.apiKey });
    this.tools = new Map();
    this.maxRetries = config.maxRetries ?? 3;
  }
  
  registerTool(tool: AgentTool): void {
    this.tools.set(tool.name, tool);
  }
  
  async processQuery(
    userQuery: string, 
    context: Record<string, unknown>
  ): Promise<{
    answer: string;
    sql: string;
    trajectory: Array<Record<string, unknown>>;
    confidence: number;
  }> {
    const trajectory: Array<Record<string, unknown>> = [];
    
    // Step 1: Query Rewrite
    const rewritten = await this.rewriteQuery(userQuery, context);
    trajectory.push({ step: 'rewrite', result: rewritten });
    
    // Step 2: RAG Enhancement
    const knowledge = await this.retrieveKnowledge(rewritten.rewritten);
    trajectory.push({ step: 'rag', docsRetrieved: knowledge.length });
    
    // Step 3: SQL Generation
    const sql = await this.generateSQL(rewritten, knowledge, context);
    trajectory.push({ step: 'generate', sql });
    
    // Step 4: Validation & Correction Loop
    let finalSQL = sql;
    let validation: SQLValidation;
    let attempts = 0;
    
    do {
      validation = await this.validateSQL(finalSQL, userQuery);
      trajectory.push({ 
        step: 'validate', 
        attempt: attempts + 1,
        isValid: validation.isValid,
        issues: [...validation.syntaxIssues, ...validation.semanticIssues]
      });
      
      if (!validation.isValid && validation.correctedSQL) {
        finalSQL = validation.correctedSQL;
        attempts++;
      } else {
        break;
      }
    } while (attempts < this.maxRetries);
    
    // Step 5: Execute
    const result = await this.executeSQL(finalSQL);
    trajectory.push({ step: 'execute', rowCount: result.rows?.length ?? 0 });
    
    // Step 6: Result Verification
    const verification = await this.verifyResult(result, userQuery, context);
    trajectory.push({ step: 'verify', passed: verification.passed });
    
    // Step 7: Format Answer
    const answer = await this.formatAnswer(result, userQuery, verification);
    
    return {
      answer,
      sql: finalSQL,
      trajectory,
      confidence: rewritten.confidence * (validation.isValid ? 1 : 0.7)
    };
  }
  
  private async rewriteQuery(
    query: string, 
    context: Record<string, unknown>
  ): Promise<QueryRewrite> {
    const response = await this.client.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: `你是一个数据查询改写专家。请将用户的自然语言查询改写为
结构化的查询描述，消除歧义，补充隐含信息。

用户角色: ${context.role || '分析师'}
常用指标: ${JSON.stringify(context.metrics || {})}
会话历史: ${context.history || '无'}

请输出 JSON 格式，包含: original, rewritten, metric, definition, 
timeRange, dimensions, filters, ambiguities, confidence 字段。`
        },
        { role: 'user', content: query }
      ],
      response_format: { type: 'json_object' },
      temperature: 0
    });
    
    return JSON.parse(response.choices[0].message.content!);
  }
  
  private async retrieveKnowledge(query: string): Promise<string[]> {
    const tool = this.tools.get('search_knowledge');
    if (!tool) return [];
    
    const result = await tool.execute({ query, topK: 5 });
    return (result as { documents: string[] }).documents;
  }
  
  private async generateSQL(
    rewrite: QueryRewrite, 
    knowledge: string[],
    context: Record<string, unknown>
  ): Promise<string> {
    const response = await this.client.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: `基于改写后的查询和知识库信息，生成准确的 SQL。

改写查询: ${rewrite.rewritten}
指标定义: ${rewrite.definition}
时间范围: ${rewrite.timeRange}
维度: ${rewrite.dimensions.join(', ')}
筛选: ${rewrite.filters.join(', ')}

知识库:
${knowledge.join('\n\n')}

Schema:
${JSON.stringify(context.schema || {}, null, 2)}

要求: 只输出 SQL，使用标准语法，必须包含 WHERE 和 LIMIT。`
        },
        { role: 'user', content: '生成 SQL' }
      ],
      temperature: 0
    });
    
    let sql = response.choices[0].message.content!.trim();
    sql = sql.replace(/^```sql?\n?/, '').replace(/\n?```$/, '');
    return sql.trim();
  }
  
  private async validateSQL(
    sql: string, 
    originalQuery: string
  ): Promise<SQLValidation> {
    // 规则检查 + LLM 语义检查
    const syntaxIssues: string[] = [];
    
    const dangerousOps = ['DROP', 'DELETE', 'UPDATE', 'INSERT', 'ALTER', 'TRUNCATE'];
    for (const op of dangerousOps) {
      if (sql.toUpperCase().includes(op)) {
        syntaxIssues.push(`检测到危险操作: ${op}`);
      }
    }
    
    if (!sql.toUpperCase().includes('WHERE')) {
      syntaxIssues.push('缺少 WHERE 子句');
    }
    
    // LLM 语义校验
    const response = await this.client.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'user',
          content: `校验 SQL 是否正确实现了查询意图。

查询: ${originalQuery}
SQL: ${sql}

请输出 JSON: { isValid, semanticIssues: string[], correctedSQL?: string }`
        }
      ],
      response_format: { type: 'json_object' },
      temperature: 0
    });
    
    const result = JSON.parse(response.choices[0].message.content!);
    
    return {
      isValid: syntaxIssues.length === 0 && result.isValid,
      syntaxIssues,
      semanticIssues: result.semanticIssues ?? [],
      resultAnomalies: [],
      correctedSQL: result.correctedSQL
    };
  }
  
  private async executeSQL(sql: string): Promise<Record<string, unknown>> {
    const tool = this.tools.get('execute_sql');
    if (!tool) throw new Error('SQL executor not registered');
    return tool.execute({ sql }) as Promise<Record<string, unknown>>;
  }
  
  private async verifyResult(
    result: Record<string, unknown>,
    query: string,
    context: Record<string, unknown>
  ): Promise<{ passed: boolean; warnings: string[] }> {
    const warnings: string[] = [];
    const rows = result.rows as Array<Record<string, unknown>> ?? [];
    
    if (rows.length === 0) {
      warnings.push('查询结果为空');
    }
    
    return { passed: true, warnings };
  }
  
  private async formatAnswer(
    result: Record<string, unknown>,
    query: string,
    verification: { passed: boolean; warnings: string[] }
  ): Promise<string> {
    const response = await this.client.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: '将查询结果格式化为自然语言回答，包含关键数据、趋势和注意事项。'
        },
        {
          role: 'user',
          content: `问题: ${query}\n结果: ${JSON.stringify(result)}\n注意事项: ${verification.warnings.join('; ')}`
        }
      ],
      temperature: 0.3
    });
    
    return response.choices[0].message.content!;
  }
}

// 使用示例
const agent = new DataQueryAgent({ 
  apiKey: process.env.OPENAI_API_KEY!,
  maxRetries: 3 
});

// 注册工具
agent.registerTool({
  name: 'search_knowledge',
  description: '搜索数据知识库',
  execute: async ({ query, topK }) => {
    // 调用向量检索服务
    const resp = await fetch('http://knowledge-service/search', {
      method: 'POST',
      body: JSON.stringify({ query, topK })
    });
    return resp.json();
  }
});

agent.registerTool({
  name: 'execute_sql',
  description: '执行 SQL 查询',
  execute: async ({ sql }) => {
    const resp = await fetch('http://sql-executor/execute', {
      method: 'POST',
      body: JSON.stringify({ sql, maxRows: 1000 })
    });
    return resp.json();
  }
});

// 执行查询
const result = await agent.processQuery(
  '上个月各区域的 GMV 排名情况',
  { role: '运营分析师', metrics: { GMV: '订单金额总和（不含退款）' } }
);
console.log(result.answer);
```

---

## 四、业界案例分析

### 4.1 Text-to-SQL Agent：从自然语言到准确 SQL

Text-to-SQL 是 Agent 技术在数据查询领域最直接的应用。当前业界实践已经从早期的"单次生成 SQL"进化到"Agent 驱动的迭代生成+校验"。

**案例1：基于 Schema Linking 的增强方案**

```
用户问: "华东区2026年Q1销售额超过100万的客户有哪些？"

传统 Text-to-SQL:
  输入 → GPT-4 → SQL（一步到位，容易出错）

Agent 增强方案:
  Step 1: Schema Linking
    - 识别"华东区" → dim_region.region_name = '华东'
    - 识别"Q1" → created_at BETWEEN '2026-01-01' AND '2026-03-31'
    - 识别"销售额超过100万" → SUM(order_amount) > 1000000
  
  Step 2: 生成候选 SQL
    SELECT c.customer_name, SUM(o.order_amount) as total_sales
    FROM dwd_order_fact o
    JOIN dim_customer c ON o.customer_id = c.customer_id
    JOIN dim_region r ON c.region_id = r.region_id
    WHERE r.region_name = '华东'
      AND o.created_at BETWEEN '2026-01-01' AND '2026-03-31'
      AND o.order_status NOT IN ('cancelled', 'refunded')
    GROUP BY c.customer_name
    HAVING SUM(o.order_amount) > 1000000
    ORDER BY total_sales DESC
  
  Step 3: 自我校验
    - ✅ 时间范围正确
    - ✅ 区域筛选正确
    - ⚠️ "销售额"是否含退款？检查指标定义...
    - ✅ HAVING 子句正确
  
  Step 4: 干运行验证
    - EXPLAIN 分析执行计划
    - 预估扫描行数：12,345（合理）
    - 执行时间预估：< 5s（合理）
  
  Step 5: 执行并返回结果
```

**案例2：C3 (ChatGPT for Chemistry) 的思路迁移到数据查询**

C3 框架的核心思路——**Contextual, Customized, Consistent**——同样适用于数据查询：

- **Contextual**：为 SQL 生成注入数据上下文（schema、sample data、business rules）
- **Customized**：针对特定企业的查询模式和术语做定制
- **Consistent**：通过 self-consistency 检查确保多次生成的 SQL 语义一致

```python
def self_consistency_check(query: str, schema: dict, n_samples: int = 5) -> str:
    """通过多次生成取多数一致的结果"""
    sql_candidates = []
    
    for _ in range(n_samples):
        sql = generate_sql(query, schema, temperature=0.7)  # 提高温度增加多样性
        sql_candidates.append(sql)
    
    # 语义等价检查（不是字符串匹配，而是逻辑等价）
    equivalence_groups = group_semantically_equivalent(sql_candidates)
    
    # 取最大的等价组
    largest_group = max(equivalence_groups, key=len)
    
    if len(largest_group) >= n_samples * 0.6:  # 至少 60% 一致
        return largest_group[0]
    else:
        # 一致性不足，需要更仔细的分析
        return analyze_and_reconcile(sql_candidates, query, schema)
```

### 4.2 Data Analyst Agent：端到端的数据分析自动化

Data Analyst Agent 不只是生成 SQL，它还能进行完整的数据分析流程：理解需求、获取数据、分析数据、生成洞察。

**案例：某电商平台 Data Analyst Agent 的架构**

```
┌─────────────────────────────────────────────┐
│           Data Analyst Agent                 │
│                                             │
│  输入: "分析5月份用户流失的原因"              │
│                                             │
│  Step 1: 任务分解                            │
│  ├─ 定义"流失用户"                           │
│  ├─ 查询5月流失用户数据                      │
│  ├─ 对比历史流失数据                         │
│  ├─ 分析流失用户特征                         │
│  └─ 识别潜在流失原因                         │
│                                             │
│  Step 2: 数据获取（多源）                     │
│  ├─ 用户行为数据 (ClickHouse)                │
│  ├─ 订单数据 (Snowflake)                     │
│  ├─ 客服工单数据 (MySQL)                     │
│  └─ 竞品价格数据 (爬虫/API)                  │
│                                             │
│  Step 3: 分析推理                            │
│  ├─ 流失率趋势分析                           │
│  ├─ 流失用户画像聚类                         │
│  ├─ 相关性分析（价格/体验/竞品）              │
│  └─ 因果推断（差分/AB实验对比）               │
│                                             │
│  Step 4: 生成报告                            │
│  ├─ 数据表格和图表                           │
│  ├─ 关键发现摘要                             │
│  └─ 建议行动方案                             │
└─────────────────────────────────────────────┘
```

**核心实现——任务规划器：**

```python
from typing import TypedDict, Annotated, Sequence
from langgraph.graph import StateGraph, END

class AnalystState(TypedDict):
    """Data Analyst Agent 的状态"""
    query: str
    plan: list[dict]
    current_step: int
    data_frames: dict  # 存储中间数据
    analysis_results: list[dict]
    final_report: str | None

def plan_task(state: AnalystState) -> AnalystState:
    """分解分析任务为可执行的步骤"""
    query = state["query"]
    
    prompt = f"""将以下数据分析需求分解为具体的执行步骤。

需求: {query}

每个步骤应包含:
- step_id: 步骤编号
- description: 步骤描述
- action: 执行动作 (query_data/analyze/compare/visualize)
- dependencies: 依赖的步骤ID
- data_source: 需要的数据源

输出 JSON 格式的步骤列表。"""
    
    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[{"role": "user", "content": prompt}],
        response_format={"type": "json_object"},
        temperature=0
    )
    
    plan = json.loads(response.choices[0].message.content)["steps"]
    return {**state, "plan": plan, "current_step": 0}

def execute_step(state: AnalystState) -> AnalystState:
    """执行当前步骤"""
    step = state["plan"][state["current_step"]]
    
    if step["action"] == "query_data":
        result = execute_data_query(step, state["data_frames"])
        state["data_frames"][step["step_id"]] = result
    elif step["action"] == "analyze":
        result = analyze_data(step, state["data_frames"])
        state["analysis_results"].append(result)
    elif step["action"] == "compare":
        result = compare_data(step, state["data_frames"])
        state["analysis_results"].append(result)
    
    return {**state, "current_step": state["current_step"] + 1}

def should_continue(state: AnalystState) -> str:
    """判断是否继续执行"""
    if state["current_step"] >= len(state["plan"]):
        return "generate_report"
    return "execute_step"

def generate_report(state: AnalystState) -> AnalystState:
    """生成最终分析报告"""
    prompt = f"""基于以下分析结果生成结构化的数据报告。

原始需求: {state["query"]}
分析结果: {json.dumps(state["analysis_results"], ensure_ascii=False)}

报告格式:
1. 背景与目标
2. 关键发现（Top 3）
3. 详细分析
4. 数据支撑
5. 建议行动"""
    
    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.3
    )
    
    return {**state, "final_report": response.choices[0].message.content}

# 构建 LangGraph 工作流
workflow = StateGraph(AnalystState)

workflow.add_node("plan", plan_task)
workflow.add_node("execute_step", execute_step)
workflow.add_node("generate_report", generate_report)

workflow.add_edge("plan", "execute_step")
workflow.add_conditional_edges("execute_step", should_continue, {
    "execute_step": "execute_step",
    "generate_report": "generate_report"
})
workflow.add_edge("generate_report", END)

workflow.set_entry_point("plan")

app = workflow.compile()
```

### 4.3 Multi-Agent 协作：专业分工的查询团队

对于复杂的查询场景，单一 Agent 的能力可能不足。Multi-Agent 协作通过专业分工来提升整体准确性。

```
┌────────────────────────────────────────────────────┐
│              Query Orchestrator Agent                │
│              (总调度，理解用户意图)                    │
└────────┬──────────┬──────────┬─────────────────────┘
         │          │          │
    ┌────▼────┐ ┌──▼─────┐ ┌─▼──────────┐
    │ Schema  │ │ SQL    │ │ Validation │
    │ Expert  │ │ Expert │ │ Expert     │
    │ Agent   │ │ Agent  │ │ Agent      │
    └─────────┘ └────────┘ └────────────┘
    
    Schema Expert: 精通数据模型，负责 schema 理解和字段映射
    SQL Expert: 精通 SQL 语法和优化，负责 SQL 生成
    Validation Expert: 精通数据质量，负责结果校验
```

```python
from langchain_openai import ChatOpenAI
from langchain.agents import AgentExecutor, create_openai_tools_agent
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder

class MultiAgentQuerySystem:
    """多 Agent 协作查询系统"""
    
    def __init__(self):
        self.llm = ChatOpenAI(model="gpt-4o", temperature=0)
        self.schema_agent = self._create_schema_agent()
        self.sql_agent = self._create_sql_agent()
        self.validation_agent = self._create_validation_agent()
    
    def _create_schema_agent(self) -> AgentExecutor:
        """Schema 专家 Agent"""
        prompt = ChatPromptTemplate.from_messages([
            ("system", """你是数据模型专家。你的职责是：
1. 理解用户的查询意图
2. 识别需要的表和字段
3. 明确字段间的关联关系
4. 解答任何关于数据模型的疑问

输出格式：
- 需要的表和字段
- JOIN 条件
- 关键筛选条件
- 可能的歧义点"""),
            MessagesPlaceholder("chat_history", optional=True),
            ("human", "{input}"),
            MessagesPlaceholder("agent_scratchpad")
        ])
        
        agent = create_openai_tools_agent(self.llm, schema_tools, prompt)
        return AgentExecutor(agent=agent, tools=schema_tools, verbose=True)
    
    def _create_sql_agent(self) -> AgentExecutor:
        """SQL 专家 Agent"""
        prompt = ChatPromptTemplate.from_messages([
            ("system", """你是 SQL 专家。基于 Schema 专家提供的信息，生成高质量的 SQL。

要求：
1. 使用标准 SQL 语法
2. 优先使用 CTE 提高可读性
3. 处理 NULL 值和异常情况
4. 添加适当的索引提示
5. 限制返回行数"""),
            MessagesPlaceholder("chat_history", optional=True),
            ("human", "{input}"),
            MessagesPlaceholder("agent_scratchpad")
        ])
        
        agent = create_openai_tools_agent(self.llm, sql_tools, prompt)
        return AgentExecutor(agent=agent, tools=sql_tools, verbose=True)
    
    def _create_validation_agent(self) -> AgentExecutor:
        """校验专家 Agent"""
        prompt = ChatPromptTemplate.from_messages([
            ("system", """你是数据质量校验专家。你的职责是：
1. 检查 SQL 逻辑的正确性
2. 验证查询结果的合理性
3. 检测数据质量异常
4. 提供修正建议

校验维度：语法正确性、语义一致性、结果合理性、数据质量"""),
            MessagesPlaceholder("chat_history", optional=True),
            ("human", "{input}"),
            MessagesPlaceholder("agent_scratchpad")
        ])
        
        agent = create_openai_tools_agent(self.llm, validation_tools, prompt)
        return AgentExecutor(agent=agent, tools=validation_tools, verbose=True)
    
    async def query(self, user_query: str) -> dict:
        """执行多 Agent 协作查询"""
        
        # Step 1: Schema Agent 分析数据需求
        schema_result = await self.schema_agent.ainvoke({
            "input": f"分析以下查询需要哪些表和字段：{user_query}"
        })
        
        # Step 2: SQL Agent 生成查询
        sql_result = await self.sql_agent.ainvoke({
            "input": f"基于以下 schema 信息生成 SQL：\n"
                    f"用户查询: {user_query}\n"
                    f"Schema 分析: {schema_result['output']}"
        })
        
        # Step 3: 执行 SQL
        sql = self._extract_sql(sql_result['output'])
        execution_result = await execute_sql(sql)
        
        # Step 4: Validation Agent 校验
        validation_result = await self.validation_agent.ainvoke({
            "input": f"校验以下查询结果：\n"
                    f"用户查询: {user_query}\n"
                    f"SQL: {sql}\n"
                    f"结果: {json.dumps(execution_result, ensure_ascii=False)[:2000]}"
        })
        
        return {
            "query": user_query,
            "sql": sql,
            "result": execution_result,
            "validation": validation_result['output'],
            "schema_analysis": schema_result['output']
        }
    
    def _extract_sql(self, text: str) -> str:
        """从 Agent 输出中提取 SQL"""
        import re
        match = re.search(r'```sql\n(.*?)```', text, re.DOTALL)
        if match:
            return match.group(1).strip()
        return text.strip()
```

---

## 五、评估指标体系

### 5.1 准确性评估维度

评估 Agent 驱动的数据查询系统需要多维度指标：

```python
@dataclass
class QueryAccuracyMetrics:
    """数据查询准确性评估指标"""
    
    # === SQL 生成质量 ===
    execution_accuracy: float  # EX (执行准确率): 生成SQL结果与gold SQL结果一致的比例
    exact_match_accuracy: float  # EM (精确匹配): 生成SQL与gold SQL字符串完全匹配的比例
    test_suite_accuracy: float  # 测试套件准确率: 在多组测试数据上的通过率
    
    # === 语义理解质量 ===
    intent_coverage: float  # 意图覆盖率: 用户查询意图被正确理解的比例
    ambiguity_resolution_rate: float  # 歧义消解率: 成功消解歧义的比例
    context_utilization_rate: float  # 上下文利用率: 有效利用上下文信息的比例
    
    # === 自我校验质量 ===
    error_detection_rate: float  # 错误检测率: 能发现SQL错误的比例
    false_positive_rate: float  # 误报率: 将正确SQL误判为错误的比例
    correction_success_rate: float  # 修正成功率: 修正后SQL变正确的比例
    
    # === 结果质量 ===
    result_completeness: float  # 结果完整度: 返回数据是否包含所有所需信息
    result_timeliness: float  # 结果时效性: 数据是否是最新的
    result_consistency: float  # 结果一致性: 相同查询多次执行结果是否一致
    
    # === 用户体验 ===
    clarification_rate: float  # 澄清请求率: 需要向用户确认的比例
    avg_response_time: float  # 平均响应时间（秒）
    user_satisfaction: float  # 用户满意度（1-5分）
```

### 5.2 评估框架实现

```python
class QueryAccuracyEvaluator:
    """数据查询准确性评估框架"""
    
    def __init__(self, agent, test_dataset: list[dict]):
        self.agent = agent
        self.dataset = test_dataset
    
    def evaluate(self) -> QueryAccuracyMetrics:
        """运行完整评估"""
        results = {
            "execution_match": [],
            "exact_match": [],
            "intent_coverage": [],
            "ambiguity_resolved": [],
            "error_detected": [],
            "correction_success": [],
            "clarification_needed": [],
            "response_times": []
        }
        
        for sample in self.dataset:
            start_time = time.time()
            agent_result = self.agent.process_query_sync(sample["query"])
            elapsed = time.time() - start_time
            
            # 执行准确率
            results["execution_match"].append(
                self._compare_results(agent_result, sample["gold_result"])
            )
            
            # 精确匹配
            results["exact_match"].append(
                self._normalize_sql(agent_result.sql) == 
                self._normalize_sql(sample["gold_sql"])
            )
            
            # 意图覆盖
            results["intent_coverage"].append(
                self._check_intent_coverage(agent_result, sample["expected_intents"])
            )
            
            # 歧义消解
            if sample.get("has_ambiguity"):
                results["ambiguity_resolved"].append(
                    agent_result.trajectory.get("ambiguity_resolved", False)
                )
            
            # 错误检测
            if sample.get("has_error"):
                results["error_detected"].append(
                    agent_result.validation_result is not None and
                    not agent_result.validation_result.is_valid
                )
            
            # 修正成功
            if agent_result.correction_attempts > 0:
                results["correction_success"].append(
                    self._compare_results(agent_result, sample["gold_result"])
                )
            
            # 澄清请求
            results["clarification_needed"].append(
                any(step.get("step") == "clarification_needed" 
                    for step in agent_result.trajectory)
            )
            
            results["response_times"].append(elapsed)
        
        return QueryAccuracyMetrics(
            execution_accuracy=np.mean(results["execution_match"]),
            exact_match_accuracy=np.mean(results["exact_match"]),
            test_suite_accuracy=0.0,  # 需要额外测试套件
            intent_coverage=np.mean(results["intent_coverage"]),
            ambiguity_resolution_rate=np.mean(results["ambiguity_resolved"]) if results["ambiguity_resolved"] else 1.0,
            context_utilization_rate=0.0,  # 需要专门评估
            error_detection_rate=np.mean(results["error_detected"]) if results["error_detected"] else 1.0,
            false_positive_rate=0.0,  # 需要专门评估
            correction_success_rate=np.mean(results["correction_success"]) if results["correction_success"] else 0.0,
            result_completeness=0.0,  # 需要专门评估
            result_timeliness=0.0,  # 需要专门评估
            result_consistency=0.0,  # 需要专门评估
            clarification_rate=np.mean(results["clarification_needed"]),
            avg_response_time=np.mean(results["response_times"]),
            user_satisfaction=0.0  # 需要用户反馈
        )
    
    def _compare_results(self, agent_result, gold_result) -> bool:
        """比较查询结果是否一致"""
        if agent_result.query_result is None:
            return False
        agent_rows = agent_result.query_result.get("rows", [])
        gold_rows = gold_result.get("rows", [])
        
        if len(agent_rows) != len(gold_rows):
            return False
        
        # 无序比较（结果顺序可能不同）
        agent_set = {frozenset(row.items()) for row in agent_rows}
        gold_set = {frozenset(row.items()) for row in gold_rows}
        
        return agent_set == gold_set
    
    def _normalize_sql(self, sql: str) -> str:
        """标准化 SQL 用于比较"""
        sql = sql.upper().strip()
        sql = re.sub(r'\s+', ' ', sql)  # 多空格合并
        sql = re.sub(r'\s*([,()])\s*', r'\1', sql)  # 去除标点周围空格
        return sql
    
    def _check_intent_coverage(self, agent_result, expected_intents) -> bool:
        """检查意图是否被覆盖"""
        trajectory_steps = [step.get("step") for step in agent_result.trajectory]
        for intent in expected_intents:
            if intent not in trajectory_steps:
                return False
        return True
```

### 5.3 基准测试数据集

评估需要专门的基准数据集。以下是推荐的构建方式：

```python
def build_evaluation_dataset():
    """构建评估数据集"""
    
    dataset = [
        # === 简单查询 ===
        {
            "id": "simple_001",
            "query": "查询5月的总销售额",
            "gold_sql": "SELECT SUM(order_amount) FROM dwd_order_fact WHERE created_at >= '2026-05-01' AND created_at < '2026-06-01' AND order_status NOT IN ('cancelled', 'refunded')",
            "gold_result": {"rows": [{"total": 15234567.89}]},
            "difficulty": "easy",
            "has_ambiguity": False,
            "has_error": False,
            "expected_intents": ["rewrite", "generate_sql", "validate", "execute"]
        },
        
        # === 歧义查询 ===
        {
            "id": "ambiguous_001",
            "query": "上个月活跃用户有多少",
            "gold_sql": None,  # 多种合理答案
            "gold_result": None,  # 取决于口径
            "difficulty": "medium",
            "has_ambiguity": True,
            "ambiguity_type": "metric_definition",
            "has_error": False,
            "expected_intents": ["rewrite", "clarify", "generate_sql", "validate", "execute"],
            "valid_answers": [
                {"metric": "DAU", "sql_pattern": "COUNT(DISTINCT user_id) WHERE login_date = ?"},
                {"metric": "MAU", "sql_pattern": "COUNT(DISTINCT user_id) WHERE login_date BETWEEN ? AND ?"},
                {"metric": "paying_users", "sql_pattern": "COUNT(DISTINCT user_id) WHERE pay_amount > 0"}
            ]
        },
        
        # === 多表关联 ===
        {
            "id": "complex_001",
            "query": "各区域Q1的获客成本对比，按成本从高到低排序",
            "gold_sql": """
                WITH marketing_cost AS (
                    SELECT r.region_name, SUM(m.cost_amount) as total_cost
                    FROM dwd_marketing_cost_fact m
                    JOIN dim_region r ON m.region_id = r.region_id
                    WHERE m.cost_date >= '2026-01-01' AND m.cost_date < '2026-04-01'
                    GROUP BY r.region_name
                ),
                new_customers AS (
                    SELECT r.region_name, COUNT(DISTINCT u.user_id) as customer_count
                    FROM dim_user u
                    JOIN dim_region r ON u.region_id = r.region_id
                    WHERE u.first_order_date >= '2026-01-01' AND u.first_order_date < '2026-04-01'
                    GROUP BY r.region_name
                )
                SELECT mc.region_name, 
                       mc.total_cost / nc.customer_count as cost_per_acquisition
                FROM marketing_cost mc
                JOIN new_customers nc ON mc.region_name = nc.region_name
                ORDER BY cost_per_acquisition DESC
            """,
            "gold_result": {"rows": [
                {"region_name": "华东", "cost_per_acquisition": 85.3},
                {"region_name": "华南", "cost_per_acquisition": 72.1},
                {"region_name": "华北", "cost_per_acquisition": 68.9}
            ]},
            "difficulty": "hard",
            "has_ambiguity": False,
            "has_error": False,
            "expected_intents": ["rewrite", "plan", "generate_sql", "validate", "execute", "verify"]
        },
        
        # === 需要修正的查询 ===
        {
            "id": "correction_001",
            "query": "最近7天每天的新增用户数",
            "gold_sql": "SELECT DATE(created_at) as dt, COUNT(*) as new_users FROM dim_user WHERE created_at >= DATE_SUB(CURRENT_DATE, INTERVAL 7 DAY) GROUP BY DATE(created_at) ORDER BY dt",
            "gold_result": {"rows": []},
            "difficulty": "easy",
            "has_ambiguity": False,
            "has_error": True,  # Agent 可能生成缺少时区处理的 SQL
            "error_type": "timezone_missing"
        }
    ]
    
    return dataset
```

### 5.4 行业基准参考

根据 Spider 基准测试和业界实践，以下是当前各方法的准确率参考：

| 方法 | Spider Dev EX | 复杂查询 EX | 歧义查询处理率 |
|------|-------------|------------|------------|
| 直接 GPT-4 生成 | ~65% | ~40% | ~20% |
| GPT-4 + Few-shot | ~72% | ~48% | ~30% |
| GPT-4 + Schema Linking | ~78% | ~55% | ~40% |
| Agent (Rewrite+RAG+Verify) | ~82% | ~62% | ~65% |
| Agent + Self-Correction | ~85% | ~68% | ~70% |
| Multi-Agent 协作 | ~87% | ~72% | ~75% |
| 人类数据分析师 | ~95% | ~88% | ~90% |

> 注：以上数据为综合多个论文和实际项目的大致范围，具体数值因数据集和实现细节而异。

---

## 六、高级优化策略

### 6.1 基于反馈的学习：让 Agent 越用越准

Agent 系统的准确性不是一成不变的，它应该随着使用而持续提升。核心机制是**反馈闭环**：

```
用户查询 → Agent 生成结果 → 用户反馈（显式/隐式）→ 更新知识库 → 下次查询更准
```

```python
class FeedbackLoop:
    """Agent 反馈学习闭环"""
    
    def __init__(self, feedback_store):
        self.store = feedback_store
    
    def record_feedback(self, session_id: str, feedback: dict):
        """记录用户反馈"""
        # 显式反馈：用户标记结果正确/错误
        # 隐式反馈：用户是否重新查询、是否修改了 SQL、是否放弃了结果
        
        feedback_record = {
            "session_id": session_id,
            "timestamp": datetime.now(),
            "type": feedback["type"],  # explicit / implicit
            "rating": feedback.get("rating"),  # 1-5
            "is_correct": feedback.get("is_correct"),
            "user_correction": feedback.get("user_correction"),  # 用户修正的 SQL
            "abandoned": feedback.get("abandoned", False),
        }
        
        self.store.save(feedback_record)
        
        # 如果用户提供了修正，将其作为新的 SQL 模板入库
        if feedback.get("user_correction"):
            self._add_correction_as_template(session_id, feedback["user_correction"])
    
    def _add_correction_as_template(self, session_id: str, corrected_sql: str):
        """将用户修正的 SQL 添加为模板"""
        session = self.store.get_session(session_id)
        
        template = {
            "question": session.original_query,
            "sql": corrected_sql,
            "scenario": "user_corrected",
            "quality_score": 1.0  # 用户修正的 SQL 默认高质量
        }
        
        # 添加到 RAG 知识库
        self.rag.index_sql_templates([template])
    
    def get_learned_patterns(self, user_id: str = None) -> dict:
        """提取学习到的模式"""
        feedbacks = self.store.get_feedbacks(user_id=user_id, min_count=10)
        
        patterns = {
            "common_corrections": self._extract_common_corrections(feedbacks),
            "ambiguity_preferences": self._extract_ambiguity_preferences(feedbacks),
            "metric_caliber_preferences": self._extract_metric_preferences(feedbacks)
        }
        
        return patterns
    
    def _extract_ambiguity_preferences(self, feedbacks) -> dict:
        """提取用户在歧义场景下的偏好"""
        preferences = {}
        
        for fb in feedbacks:
            if fb.get("ambiguity_type") and fb.get("user_choice"):
                amb_type = fb["ambiguity_type"]
                choice = fb["user_choice"]
                
                if amb_type not in preferences:
                    preferences[amb_type] = {}
                preferences[amb_type][choice] = preferences[amb_type].get(choice, 0) + 1
        
        # 归一化为概率
        for amb_type, choices in preferences.items():
            total = sum(choices.values())
            preferences[amb_type] = {k: v/total for k, v in choices.items()}
        
        return preferences
```

### 6.2 数据血缘追踪：让 Agent 理解数据的来龙去脉

数据血缘（Data Lineage）信息能帮助 Agent 理解数据的来源、转换过程和依赖关系，从而在查询时做出更准确的判断。

```python
class DataLineageTracker:
    """数据血缘追踪器"""
    
    def get_upstream_tables(self, table_name: str, depth: int = 3) -> list[dict]:
        """获取上游表（数据来源）"""
        # 从元数据系统查询血缘关系
        # 实际实现可对接 Apache Atlas, DataHub 等血缘系统
        
        lineage = [
            {
                "table": "ods_order",
                "transformation": "原始订单数据，UTC 时区",
                "quality_notes": "存在约 0.1% 的重复记录"
            },
            {
                "table": "dwd_order_fact",
                "transformation": "去重 + 时区转换(UTC→CST) + 状态标准化",
                "quality_notes": "每日 02:00 更新，延迟约 2 小时"
            }
        ]
        
        return lineage[:depth]
    
    def get_freshness(self, table_name: str) -> dict:
        """获取数据时效性信息"""
        return {
            "table": table_name,
            "last_updated": "2026-05-22 02:15:00",
            "update_frequency": "daily",
            "expected_delay_minutes": 120,
            "is_fresh": True  # 当前时间 - last_updated < expected_delay
        }
    
    def enrich_query_context(self, table_name: str) -> dict:
        """用血缘信息增强查询上下文"""
        upstream = self.get_upstream_tables(table_name)
        freshness = self.get_freshness(table_name)
        
        return {
            "upstream_tables": upstream,
            "freshness": freshness,
            "warnings": self._generate_warnings(upstream, freshness)
        }
    
    def _generate_warnings(self, upstream: list, freshness: dict) -> list[str]:
        """生成数据使用警告"""
        warnings = []
        
        if not freshness.get("is_fresh"):
            warnings.append(
                f"⚠️ 数据更新延迟：{freshness['table']} 预期 "
                f"{freshness['expected_delay_minutes']} 分钟前更新，"
                f"实际最后更新 {freshness['last_updated']}"
            )
        
        for table in upstream:
            if table.get("quality_notes"):
                warnings.append(f"⚠️ {table['table']}: {table['quality_notes']}")
        
        return warnings
```

### 6.3 自适应 Prompt 策略

不同的查询复杂度和用户场景需要不同的 Prompt 策略：

```python
class AdaptivePromptStrategy:
    """自适应 Prompt 策略"""
    
    def select_strategy(self, query_complexity: str, user_level: str, 
                        error_history: list) -> str:
        """根据查询特征选择最优 Prompt 策略"""
        
        # 简单查询：快速路径，减少 Agent 循环
        if query_complexity == "simple" and not error_history:
            return "direct_generation"
        
        # 中等查询：标准 Agent 流程
        if query_complexity == "medium":
            return "standard_agent"
        
        # 复杂查询：增强 Agent 流程，多步推理 + 强校验
        if query_complexity == "complex":
            return "enhanced_agent"
        
        # 有历史错误的查询：保守策略，增加校验
        if error_history:
            return "conservative_agent"
        
        # 新手用户：增加解释和确认
        if user_level == "beginner":
            return "guided_agent"
        
        return "standard_agent"
    
    def get_prompt_template(self, strategy: str) -> str:
        """获取对应的 Prompt 模板"""
        templates = {
            "direct_generation": """直接生成 SQL，不需要多步推理。
查询: {query}
Schema: {schema}
输出 SQL 即可。""",
            
            "standard_agent": """按照标准流程生成 SQL：
1. 理解查询意图
2. 识别需要的表和字段
3. 生成 SQL
4. 检查逻辑正确性
查询: {query}
Schema: {schema}
知识: {knowledge}""",
            
            "enhanced_agent": """这是一个复杂查询，请严格按照以下步骤：
1. 分析查询的每个组成部分
2. 识别所有涉及的表和字段关系
3. 制定查询计划（CTE/子查询结构）
4. 逐步生成 SQL
5. 自我校验：检查 JOIN 条件、聚合逻辑、时间范围
6. 如发现问题，修正后重新验证

查询: {query}
Schema: {schema}
知识: {knowledge}
血缘: {lineage}
历史错误模式: {error_patterns}""",
            
            "conservative_agent": """基于历史错误经验，请特别注意：
{error_patterns}

在生成 SQL 之前，先确认：
1. 所有歧义术语的含义
2. 时间范围和时区
3. 空值处理策略
4. 聚合粒度

查询: {query}
Schema: {schema}""",
            
            "guided_agent": """用户是数据分析新手，请：
1. 先用简单语言解释查询的理解
2. 确认理解正确后再生成 SQL
3. 在结果中解释每个字段的含义
4. 标注数据使用注意事项

查询: {query}
Schema: {schema}"""
        }
        
        return templates.get(strategy, templates["standard_agent"])
```

---

## 七、生产级部署考量

### 7.1 性能优化

Agent 的多步推理虽然提升了准确性，但也增加了延迟。生产环境需要在准确性和性能之间取得平衡。

```python
class PerformanceOptimizer:
    """Agent 性能优化器"""
    
    def __init__(self):
        self.cache = TTLCache(maxsize=1000, ttl=3600)  # 1小时缓存
        self.schema_cache = TTLCache(maxsize=100, ttl=86400)  # 24小时 schema 缓存
    
    async def optimized_query(self, user_query: str) -> dict:
        """带性能优化的查询流程"""
        
        # 1. 语义缓存：检查是否有语义相似的查询
        cache_key = self._semantic_hash(user_query)
        if cache_key in self.cache:
            return self.cache[cache_key]
        
        # 2. 快速路径判断：简单查询跳过 Agent 循环
        complexity = self._assess_complexity(user_query)
        
        if complexity == "simple":
            # 直接生成 SQL，不经过完整 Agent 流程
            result = await self._fast_path(user_query)
        elif complexity == "medium":
            # 标准路径
            result = await self._standard_path(user_query)
        else:
            # 完整 Agent 路径
            result = await self._full_agent_path(user_query)
        
        # 3. 结果缓存
        self.cache[cache_key] = result
        
        return result
    
    def _assess_complexity(self, query: str) -> str:
        """快速评估查询复杂度"""
        complexity_signals = {
            "simple": 0,
            "medium": 0,
            "complex": 0
        }
        
        # 简单信号
        if any(kw in query for kw in ["多少", "总量", "总数", "平均"]):
            complexity_signals["simple"] += 1
        
        # 中等信号
        if any(kw in query for kw in ["对比", "排名", "趋势", "分布"]):
            complexity_signals["medium"] += 2
        
        # 复杂信号
        if any(kw in query for kw in ["为什么", "原因", "预测", "分析", "关联"]):
            complexity_signals["complex"] += 3
        
        if len(query) > 100:  # 长查询通常更复杂
            complexity_signals["complex"] += 1
        
        return max(complexity_signals, key=complexity_signals.get)
    
    def _semantic_hash(self, query: str) -> str:
        """生成语义哈希用于缓存"""
        # 标准化查询后哈希
        normalized = re.sub(r'\d{4}[-/]\d{2}[-/]\d{2}', '<DATE>', query)
        normalized = re.sub(r'\d+', '<NUM>', normalized)
        return hashlib.md5(normalized.encode()).hexdigest()
    
    async def _fast_path(self, query: str) -> dict:
        """快速路径：跳过 Agent 循环"""
        schema = self._get_cached_schema()
        
        prompt = f"直接生成 SQL，不要解释：\n查询: {query}\nSchema: {schema}"
        response = await self.llm.async_generate(prompt)
        sql = self._extract_sql(response)
        
        result = await self.executor.execute(sql)
        
        return {"sql": sql, "result": result, "path": "fast"}
    
    async def _standard_path(self, query: str) -> dict:
        """标准路径：核心 Agent 流程"""
        # Rewrite → Generate → Validate → Execute
        # 省略具体实现，参考前文
        pass
    
    async def _full_agent_path(self, query: str) -> dict:
        """完整 Agent 路径：所有增强能力"""
        # Rewrite → Clarify → RAG → Plan → Generate → Validate → Correct → Execute → Verify
        # 省略具体实现，参考前文
        pass
```

### 7.2 安全与权限控制

```python
class QuerySecurityGuard:
    """查询安全守卫"""
    
    DANGEROUS_PATTERNS = [
        (r'\bDROP\b', '禁止 DROP 操作'),
        (r'\bDELETE\b', '禁止 DELETE 操作'),
        (r'\bUPDATE\b', '禁止 UPDATE 操作'),
        (r'\bINSERT\b', '禁止 INSERT 操作'),
        (r'\bALTER\b', '禁止 ALTER 操作'),
        (r'\bTRUNCATE\b', '禁止 TRUNCATE 操作'),
        (r';.*\bSELECT\b', '检测到 SQL 注入风险（多语句）'),
        (r'UNION\s+SELECT', '检测到 UNION 注入风险'),
        (r'INFORMATION_SCHEMA', '禁止访问系统表'),
        (r'\bINTO\s+OUTFILE\b', '禁止文件导出'),
    ]
    
    def __init__(self, permission_service):
        self.permissions = permission_service
    
    def check_sql_security(self, sql: str, user_id: str) -> dict:
        """检查 SQL 的安全性"""
        issues = []
        sql_upper = sql.upper()
        
        # 1. 危险操作检查
        for pattern, message in self.DANGEROUS_PATTERNS:
            if re.search(pattern, sql_upper):
                issues.append({"level": "CRITICAL", "message": message})
        
        # 2. 数据权限检查
        tables = self._extract_tables(sql)
        for table in tables:
            if not self.permissions.has_read_access(user_id, table):
                issues.append({
                    "level": "CRITICAL",
                    "message": f"无权限访问表: {table}"
                })
        
        # 3. 数据量限制
        if "LIMIT" not in sql_upper:
            issues.append({
                "level": "WARNING",
                "message": "缺少 LIMIT 子句，将自动添加 LIMIT 10000"
            })
        
        # 4. 敏感字段检查
        sensitive_columns = self.permissions.get_sensitive_columns(user_id)
        for col in sensitive_columns:
            if col.upper() in sql_upper:
                issues.append({
                    "level": "WARNING",
                    "message": f"查询包含敏感字段: {col}，结果将脱敏处理"
                })
        
        is_safe = all(issue["level"] != "CRITICAL" for issue in issues)
        
        return {
            "is_safe": is_safe,
            "issues": issues,
            "sanitized_sql": self._sanitize_sql(sql) if is_safe else None
        }
    
    def _extract_tables(self, sql: str) -> list[str]:
        """提取 SQL 中涉及的表名"""
        tables = []
        patterns = [
            r'FROM\s+(\w+)',
            r'JOIN\s+(\w+)',
            r'INTO\s+(\w+)',
            r'UPDATE\s+(\w+)',
        ]
        for pattern in patterns:
            tables.extend(re.findall(pattern, sql, re.IGNORECASE))
        return list(set(tables))
    
    def _sanitize_sql(self, sql: str) -> str:
        """SQL 安全化处理"""
        # 自动添加 LIMIT
        if "LIMIT" not in sql.upper():
            sql = sql.rstrip(';') + " LIMIT 10000;"
        
        return sql
```

### 7.3 可观测性

```python
class QueryAgentObservability:
    """Agent 可观测性系统"""
    
    def __init__(self):
        self.metrics = {
            "total_queries": 0,
            "successful_queries": 0,
            "failed_queries": 0,
            "avg_accuracy": 0.0,
            "avg_latency": 0.0,
            "clarification_rate": 0.0,
            "correction_rate": 0.0,
        }
        self.traces = []
    
    def record_trace(self, session: QuerySession):
        """记录一次查询的完整轨迹"""
        trace = {
            "session_id": session.session_id,
            "user_id": session.user_id,
            "query": session.original_query,
            "final_state": session.state.value,
            "trajectory": session.trajectory,
            "correction_attempts": session.correction_attempts,
            "total_duration_ms": sum(
                step.get("duration_ms", 0) for step in session.trajectory
            ),
            "timestamp": datetime.now().isoformat()
        }
        
        self.traces.append(trace)
        self._update_metrics(trace)
    
    def _update_metrics(self, trace: dict):
        """更新聚合指标"""
        self.metrics["total_queries"] += 1
        
        if trace["final_state"] == "completed":
            self.metrics["successful_queries"] += 1
        else:
            self.metrics["failed_queries"] += 1
        
        if trace["correction_attempts"] > 0:
            self.metrics["correction_rate"] = (
                (self.metrics["correction_rate"] * (self.metrics["total_queries"] - 1) + 1) /
                self.metrics["total_queries"]
            )
    
    def get_dashboard_data(self) -> dict:
        """获取监控面板数据"""
        return {
            "metrics": self.metrics,
            "recent_traces": self.traces[-10:],
            "accuracy_trend": self._compute_accuracy_trend(),
            "latency_distribution": self._compute_latency_distribution(),
            "common_failure_patterns": self._extract_failure_patterns()
        }
    
    def _compute_accuracy_trend(self) -> list[dict]:
        """计算准确性趋势"""
        # 按天聚合
        daily = {}
        for trace in self.traces:
            date = trace["timestamp"][:10]
            if date not in daily:
                daily[date] = {"total": 0, "success": 0}
            daily[date]["total"] += 1
            if trace["final_state"] == "completed":
                daily[date]["success"] += 1
        
        return [
            {"date": date, "accuracy": data["success"] / data["total"]}
            for date, data in sorted(daily.items())
        ]
    
    def _compute_latency_distribution(self) -> dict:
        """计算延迟分布"""
        latencies = [t["total_duration_ms"] for t in self.traces if t["total_duration_ms"]]
        if not latencies:
            return {}
        
        return {
            "p50": np.percentile(latencies, 50),
            "p90": np.percentile(latencies, 90),
            "p99": np.percentile(latencies, 99),
            "avg": np.mean(latencies),
            "max": max(latencies)
        }
    
    def _extract_failure_patterns(self) -> list[dict]:
        """提取常见失败模式"""
        failures = [t for t in self.traces if t["final_state"] != "completed"]
        
        patterns = {}
        for failure in failures:
            # 分析失败原因
            for step in failure["trajectory"]:
                if step.get("step") == "error":
                    error_type = step.get("error", "unknown")[:50]
                    patterns[error_type] = patterns.get(error_type, 0) + 1
        
        return [
            {"pattern": k, "count": v} 
            for k, v in sorted(patterns.items(), key=lambda x: -x[1])
        ]
```

---

## 八、实施路径和建议

### 8.1 分阶段实施路线图

```
Phase 1 (1-2个月): 基础能力建设
├── 搭建基础 Text-to-SQL 能力
├── 构建数据字典和 schema 知识库
├── 实现 Query Rewrite 模块
├── 建立基础评估框架
└── 目标：简单查询准确率 > 75%

Phase 2 (2-3个月): Agent 能力增强
├── 引入 RAG 增强（指标定义 + SQL 模板）
├── 实现自我校验和修正循环
├── 添加交互式澄清能力
├── 建立反馈闭环
└── 目标：中等查询准确率 > 80%，歧义消解率 > 50%

Phase 3 (3-4个月): 高级能力建设
├── 实现多步推理和查询规划
├── 接入数据血缘和质量元数据
├── 优化性能（语义缓存、快速路径）
├── 完善安全和权限体系
└── 目标：复杂查询准确率 > 70%，平均延迟 < 10s

Phase 4 (持续): 持续优化
├── Multi-Agent 协作
├── 自适应 Prompt 策略
├── 用户偏好学习
├── 跨源联邦查询
└── 目标：整体准确率 > 85%，用户满意度 > 4/5
```

### 8.2 团队配置建议

| 角色 | 职责 | 人数建议 |
|------|------|---------|
| Agent 架构师 | 设计整体架构，技术选型 | 1 |
| LLM 工程师 | Prompt 工程，Agent 流程开发 | 2 |
| 数据工程师 | 知识库建设，数据血缘对接 | 1 |
| 后端工程师 | API 开发，安全控制，可观测性 | 1 |
| 测试工程师 | 评估框架，测试数据集构建 | 1 |

### 8.3 关键风险和应对

| 风险 | 影响 | 应对策略 |
|------|------|---------|
| LLM 幻觉导致 SQL 逻辑错误 | 返回错误数据 | 自我校验 + 干运行 + 结果合理性检查 |
| 延迟过高影响用户体验 | 用户弃用 | 分级策略（简单查询走快速路径）+ 语义缓存 |
| 知识库维护成本高 | 知识过时导致误导 | 自动化 schema 采集 + 反馈闭环自动更新 |
| 安全风险（SQL 注入、越权） | 数据泄露 | 安全守卫层 + 参数化查询 + 权限检查 |
| 用户信任建立困难 | 不敢使用 | 置信度标注 + 来源可追溯 + 渐进式开放 |

### 8.4 选型建议

| 组件 | 推荐方案 | 备选方案 | 选择理由 |
|------|---------|---------|---------|
| LLM | GPT-4o | Claude 3.5 Sonnet, GLM-4 | SQL 生成能力强，Function Calling 成熟 |
| Agent 框架 | LangGraph | CrewAI, AutoGen | 灵活的状态机，支持复杂流程 |
| 向量数据库 | Chroma (开发) / Milvus (生产) | Pinecone, Weaviate | 易用性好，支持混合检索 |
| SQL 执行层 | 自建安全执行器 | sqlpad, hue | 安全可控，可定制权限 |
| 元数据管理 | DataHub | Apache Atlas, OpenMetadata | 社区活跃，集成能力强 |
| 可观测性 | LangSmith + Prometheus | Helicone, Arize | Agent trace + 指标监控 |

---

## 九、总结与展望

### 9.1 核心观点回顾

1. **数据查询准确性是一个系统性问题**，不能仅靠单一技术解决，需要 Agent 的多维度能力协同。

2. **Agent 的核心价值在于闭环**——感知（理解意图）、决策（规划查询）、行动（生成 SQL）、反馈（校验修正），这个循环让查询准确性可以持续提升。

3. **Query Rewrite + RAG + Self-Verification 是提升准确性的三大支柱**。三者缺一，准确性都会显著下降。

4. **自我校验是区分"Agent"和"Pipeline"的关键**。没有校验和修正能力的系统只是管道，不是 Agent。

5. **反馈闭环是长期准确性的保障**。Agent 应该越用越准，而不是永远停留在初始水平。

### 9.2 未来趋势

1. **多模态查询**：用户可能上传截图、图表，问"这个数据为什么和我查的不一样？"——Agent 需要理解图像并对比数据。

2. **主动式数据 Agent**：不只是被动回答查询，而是主动发现数据异常、推送洞察。"您关注的 GMV 指标今天下降了 15%，可能原因是..."

3. **联邦查询 Agent**：自动编排跨源查询，屏蔽底层数据架构的复杂性。

4. **因果推理能力**：从"是什么"到"为什么"，Agent 能基于数据做因果推断而不仅是相关性分析。

5. **个性化 Agent**：每个用户有自己的 Agent 实例，它了解用户的查询习惯、指标口径偏好、常用分析视角。

6. **Agent 间的协作与验证**：多个独立 Agent 交叉验证同一查询，类似代码评审机制，进一步提升可信度。

### 9.3 写在最后

Agent 技术解决数据查询准确性问题，本质上是一个**将"数据智能"从"生成式"升级为"推理式"**的过程。生成式方法只关心"能不能生成 SQL"，推理式方法关心"这个 SQL 对不对、为什么对、不对怎么办"。

这个升级不是一蹴而就的，需要扎实的数据基础、精心设计的 Agent 架构、持续优化的知识库，以及最重要的——**对"准确性"这件事的敬畏之心**。每一个看似正确的查询结果背后，都可能有隐藏的语义偏差、数据质量问题或逻辑漏洞。Agent 的使命，就是把这些隐藏的风险暴露出来，让数据查询从"差不多对"变成"真的对"。

---

## 参考资料

1. Gao, D., et al. "Text-to-SQL Empowered by Large Language Models: A Benchmark Evaluation." VLDB 2024.
2. Pourreza, M., et al. "DIN-SQL: Decomposed In-Context Learning of Text-to-SQL with Self-Correction." NeurIPS 2023.
3. Talaei, S., et al. "CHESS: Contextual Harnessing for Efficient SQL Synthesis." ACL 2024.
4. Wang, X., et al. "MAC-SQL: Multi-Agent Collaboration for Text-to-SQL." arXiv 2024.
5. Gartner, "The State of Data Quality 2025." Gartner Research.
6. DataHub Project, https://github.com/datahub-project/datahub
7. LangGraph Documentation, https://langchain-ai.github.io/langgraph/
8. Spider: A Large-Scale Human-Labeled Dataset for Text-to-SQL, https://yale-lily.github.io/spider
9. Bird Benchmark: A Big Bench for Large-Scale Database Grounded Text-to-SQL, https://bird-bench.github.io/
10. Microsoft Fabric Real-Time Intelligence, https://learn.microsoft.com/en-us/fabric/real-time-intelligence/
