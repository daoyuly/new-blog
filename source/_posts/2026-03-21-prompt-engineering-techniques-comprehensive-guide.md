---
title: 提示词工程完全指南：从基础到Agent应用的技术全景
date: 2026-03-21 01:00:00
tags:
  - Prompt Engineering
  - LLM
  - AI Agent
  - 技术指南
categories:
  - 技术研究
---

# 提示词工程完全指南：从基础到Agent应用的技术全景

> 系统性综述提示词工程技术，深入剖析原理机制，提供正例反例，并探索在Agent开发中的实战应用

## 引言

提示词工程（Prompt Engineering）是解锁大语言模型（LLM）能力的关键技术。随着Agent系统的兴起，提示词技术从简单的指令演变为复杂的能力编排系统。本文将系统性地介绍14种核心提示词技术，从基础到高级，从理论到实践，帮助开发者构建更强大的AI应用。

---

## 一、基础提示词技术

### 1. Zero-Shot Prompting（零样本提示）

#### 原理与机制

零样本提示是指不提供任何示例，直接让模型完成任务。模型完全依赖预训练知识。

**机制**：
```
输入: 任务描述 + 问题
  ↓
LLM: 依赖预训练知识
  ↓
输出: 直接回答
```

#### 正例 ✅

```python
# 场景：简单分类任务
prompt = """
将以下文本分类为正面、负面或中性情感：

文本："这家餐厅的服务态度很好，菜品也很美味。"
"""

# LLM输出：
# 情感分类：正面
# 原因：文本中包含积极词汇"很好"、"美味"
```

**为什么有效**：
- 任务简单明确
- 预训练数据中包含大量情感分析样本
- 无需额外上下文

#### 反例 ❌

```python
# 场景：复杂业务规则
prompt = """
根据用户订单判断是否可以退款：
订单ID: 12345
"""

# LLM输出：
# 需要更多信息才能判断...

# 问题：
# 1. 缺少业务规则上下文
# 2. 模型无法知道退款政策
# 3. 需要few-shot或结构化提示
```

**失败原因**：
- 业务规则不在预训练数据中
- 缺少必要上下文
- 任务需要领域知识

#### Agent开发应用

```python
# OpenClaw Agent中的使用
class SimpleIntentClassifier:
    def classify(self, user_input: str) -> str:
        # ✅ 适合：简单意图识别
        prompt = f"""
        用户说："{user_input}"
        
        判断用户意图是以下哪一种：
        - 发送消息
        - 查询天气
        - 搜索网络
        
        只返回意图名称，不要解释。
        """
        return self.llm.generate(prompt)
    
    # ❌ 不适合：复杂的多步骤任务规划
```

**适用场景**：
- ✅ 简单分类任务
- ✅ 通用知识问答
- ✅ 格式转换
- ❌ 领域专业任务
- ❌ 需要特定规则的任务
- ❌ 多步骤推理

---

### 2. Few-Shot Prompting（少样本提示）

#### 原理与机制

通过提供少量示例，让模型学习任务模式和输出格式。

**机制**：
```
输入: 任务描述 + 示例1 + 示例2 + ... + 新问题
  ↓
LLM: 模式识别 + 类比推理
  ↓
输出: 遵循示例格式的回答
```

**理论基础**：In-Context Learning（上下文学习）

#### 正例 ✅

```python
prompt = """
从文本中提取人名、地点和事件。

示例1：
文本："张三在北京参加了人工智能大会。"
输出：{"人名": ["张三"], "地点": ["北京"], "事件": ["参加人工智能大会"]}

示例2：
文本："李四和王五在上海创建了科技公司。"
输出：{"人名": ["李四", "王五"], "地点": ["上海"], "事件": ["创建科技公司"]}

请处理：
文本："赵六在深圳发布了新产品，引起广泛关注。"
"""

# LLM输出：
# {"人名": ["赵六"], "地点": ["深圳"], "事件": ["发布新产品"]}
```

**为什么有效**：
- 示例清晰展示输出格式
- 3个示例足够建立模式
- 任务复杂度适中

#### 反例 ❌

```python
# 错误示例1：示例不一致
prompt = """
翻译文本到英文。

示例1：
中文：你好
English: Hello

示例2：
中文：谢谢
Answer: Thanks  # 格式不一致！

示例3：
中文：再见
Output: Goodbye  # 又变了！

翻译：
中文：早上好
"""

# LLM输出混乱，因为示例格式不统一
```

```python
# 错误示例2：示例过多
prompt = """
分类电影类型。

# 提供了20个示例...
# 示例1到示例20...

分类：复仇者联盟
"""

# 问题：
# 1. Token浪费（20个示例可能只需要3-5个）
# 2. 上下文窗口占用过多
# 3. 可能引入噪声
```

#### Agent开发应用

```python
# OpenClaw技能路由示例
class SkillRouter:
    def route_skill(self, user_request: str) -> str:
        # ✅ 使用Few-Shot进行技能匹配
        prompt = f"""
        根据用户请求选择最合适的技能。

        示例1：
        请求："帮我发送邮件给张三"
        技能：send-email

        示例2：
        请求："读取飞书文档"
        技能：feishu-doc

        示例3：
        请求："发布博客文章"
        技能：blog-publisher

        用户请求："{user_request}"
        技能：
        """
        return self.llm.generate(prompt).strip()
```

**最佳实践**：
```python
# 优化：使用动态Few-Shot
class DynamicFewShotRouter:
    def __init__(self):
        self.examples = self.load_examples_from_memory()
    
    def route_skill(self, user_request: str):
        # 1. 从记忆中检索最相似的示例
        similar_examples = self.retrieve_top_k(user_request, k=3)
        
        # 2. 构建Few-Shot提示
        prompt = self.build_prompt(user_request, similar_examples)
        
        return self.llm.generate(prompt)
```

**适用场景**：
- ✅ 格式化输出任务
- ✅ 分类和抽取任务
- ✅ 需要特定输出格式的场景
- ⚠️ 注意示例质量和一致性
- ⚠️ 控制示例数量（通常3-5个足够）

---

### 3. Role-Based Prompting（角色提示）

#### 原理与机制

通过设定角色身份，激活模型在特定领域的知识和表达方式。

**机制**：
```
输入: 角色定义 + 任务
  ↓
LLM: 激活角色相关知识网络
  ↓
输出: 符合角色特征的回答
```

**理论基础**：Persona-based Generation

#### 正例 ✅

```python
prompt = """
你是一位资深的前端工程师，有10年React开发经验。
请用简洁、专业的语言回答以下问题：

问题：如何优化React组件的渲染性能？

请提供：
1. 核心优化策略
2. 代码示例
3. 最佳实践建议
"""

# LLM输出（专业、技术性强）：
# 
# 核心优化策略：
# 1. **React.memo()** - 浅比较props
# 2. **useMemo/useCallback** - 缓存计算和函数
# 3. **代码分割** - React.lazy + Suspense
# 
# 代码示例：
# const OptimizedComponent = React.memo(({ data }) => {
#   const processedData = useMemo(() => 
#     heavyComputation(data), [data]
#   );
#   return <div>{processedData}</div>;
# });
# 
# 最佳实践：
# - 避免不必要的re-render
# - 使用key属性优化列表渲染
# - 虚拟化长列表
```

**为什么有效**：
- 角色定义清晰具体
- 指定了专业背景
- 明确了输出要求

#### 反例 ❌

```python
# 错误示例1：角色过于宽泛
prompt = """
你是一个专家。
解释量子计算。
"""

# 问题：什么领域的专家？缺乏针对性
```

```python
# 错误示例2：角色与任务不匹配
prompt = """
你是一位著名的历史学家。
请帮我写一段Python代码实现快速排序。
"""

# 问题：角色与任务领域不符，可能限制模型能力
```

```python
# 错误示例3：角色定义矛盾
prompt = """
你是一位保守的理财顾问，但同时也喜欢推荐高风险高收益的投资。
请推荐一些投资产品。
"""

# 问题：角色特征矛盾，导致输出不稳定
```

#### Agent开发应用

```python
# 多角色Agent系统
class MultiPersonaAgent:
    def __init__(self):
        self.personas = {
            "technical": """
                你是技术专家，专注于：
                - 技术可行性分析
                - 架构设计建议
                - 性能优化方案
                语言风格：专业、精确、数据驱动
            """,
            "product": """
                你是产品经理，关注：
                - 用户需求和价值
                - 产品体验优化
                - 商业可行性
                语言风格：简洁、商业导向、用户为中心
            """,
            "qa": """
                你是质量保证工程师，负责：
                - 风险识别
                - 测试策略
                - 边界情况分析
                语言风格：严谨、细致、怀疑态度
            """
        }
    
    def analyze_feature(self, feature_desc: str) -> dict:
        """从多个角色视角分析功能"""
        analyses = {}
        
        for role_name, persona in self.personas.items():
            prompt = f"""
            {persona}
            
            功能描述：{feature_desc}
            
            请从你的角色视角分析这个功能，包括：
            1. 关键考虑点
            2. 潜在问题
            3. 建议
            
            限制在150字以内。
            """
            
            analyses[role_name] = self.llm.generate(prompt)
        
        return analyses

# 使用示例
agent = MultiPersonaAgent()
result = agent.analyze_feature("""
添加用户头像上传功能，支持裁剪和滤镜
""")

# 输出示例：
# {
#   "technical": "建议使用Canvas API实现裁剪...",
#   "product": "提升用户个性化体验，但需考虑审核机制...",
#   "qa": "需测试大文件上传、格式兼容性、裁剪精度..."
# }
```

**实战案例：角色扮演对话系统**

```python
class RolePlayConversationAgent:
    def __init__(self, character_config: dict):
        self.character = character_config
    
    def generate_response(self, user_input: str) -> str:
        prompt = f"""
        角色设定：
        - 姓名：{self.character['name']}
        - 性格：{self.character['personality']}
        - 背景：{self.character['background']}
        - 说话风格：{self.character['style']}
        
        用户说："{user_input}"
        
        请以{self.character['name']}的身份回复，保持角色一致性。
        """
        return self.llm.generate(prompt)

# 示例角色配置
sherlock_config = {
    "name": "福尔摩斯",
    "personality": "理性、观察敏锐、略带傲慢",
    "background": "维多利亚时代侦探，精通推理",
    "style": "使用演绎法，常引用案例，语气自信"
}
```

**适用场景**：
- ✅ 领域专业问答
- ✅ 多角色对话系统
- ✅ 代码审查（扮演不同角色）
- ✅ 教育辅导（扮演导师角色）
- ⚠️ 确保角色与任务匹配
- ⚠️ 避免角色特征矛盾

---

## 二、推理增强技术

### 4. Chain-of-Thought (CoT) Prompting（思维链）

#### 原理与机制

通过显式的推理步骤，引导模型逐步思考，提高复杂问题的解决能力。

**机制**：
```
输入: 问题 + "让我们一步步思考"
  ↓
LLM: 生成中间推理步骤
  ↓
输出: 推理过程 + 最终答案
```

**理论基础**：Emergent Reasoning Ability

**2026年最新研究**（arXiv:2603.14602）：
> Chain-of-Thought prompting增加了对表格数据的注意力，进一步通过表格调优增强。

#### 正例 ✅

```python
prompt = """
问题：一个商店有125个苹果，卖出了47个，又进货了38个，最后卖出了29个。
现在商店还有多少个苹果？

让我们一步步思考：
"""

# LLM输出：
# 
# 让我们一步步思考：
# 
# 步骤1：初始有125个苹果
# 步骤2：卖出47个，剩余：125 - 47 = 78个
# 步骤3：进货38个，现在有：78 + 38 = 116个
# 步骤4：又卖出29个，剩余：116 - 29 = 87个
# 
# 答案：商店现在有87个苹果。
```

**为什么有效**：
- 显式推理步骤
- 每步都有计算验证
- 逻辑清晰可追溯

#### 高级技巧：Zero-Shot CoT

```python
# 无需示例，只需添加"让我们一步步思考"
prompt = f"""
{complex_problem}

让我们一步步思考。
"""

# 适用于：
# - 没有few-shot示例
# - 任务类型多样
# - 需要通用推理能力
```

#### 反例 ❌

```python
# 错误示例1：跳过推理
prompt = """
问题：计算 15 * 23 + 47 * 8 - 120 / 4

答案：
"""

# LLM输出：854
# 问题：没有推理过程，难以验证正确性
```

```python
# 错误示例2：推理步骤混乱
prompt = """
问题：小明有50元，买了3本书，每本8元，还剩多少钱？

让我们一步步思考：
"""

# 可能的混乱输出：
# 让我们一步步思考：
# 首先，每本书8元（步骤2）
# 小明买了3本书（步骤1）
# 总共花费：8 * 3 = 24元（步骤3）
# 剩余：50 - 24 = 26元（步骤4）
# 
# 问题：步骤编号混乱，逻辑顺序不清
```

#### Agent开发应用

```python
# OpenClaw任务规划Agent
class TaskPlanningAgent:
    def plan(self, user_request: str) -> list:
        prompt = f"""
        用户请求：{user_request}
        
        请制定执行计划。让我们一步步思考：
        1. 分析请求的核心目标
        2. 识别需要的技能和工具
        3. 确定执行顺序
        4. 考虑依赖关系
        5. 输出结构化计划
        
        输出JSON格式的任务列表：
        """
        
        plan = self.llm.generate(prompt)
        return self.parse_plan(plan)

# 使用示例
agent = TaskPlanningAgent()
plan = agent.plan("搜索2026年AI Agent最新论文，分析后发布到博客")

# 输出示例：
# 让我们一步步思考：
# 
# 1. 核心目标：研究、分析并发布AI Agent相关内容
# 
# 2. 需要的技能：
#    - web-research（搜索论文）
#    - arxiv-analyzer（分析论文）
#    - markdown-writer（撰写文章）
#    - blog-publisher（发布博客）
# 
# 3. 执行顺序：
#    步骤1：使用web-research搜索论文
#    步骤2：使用arxiv-analyzer分析核心论文
#    步骤3：使用markdown-writer生成文章
#    步骤4：使用blog-publisher发布到博客
# 
# 4. 依赖关系：
#    - 步骤2依赖步骤1的结果
#    - 步骤3依赖步骤2的分析
#    - 步骤4依赖步骤3的文章
```

**高级应用：Self-Consistency with CoT**

```python
class SelfConsistencyAgent:
    def solve_with_consistency(self, problem: str, n_samples: int = 5):
        """使用自一致性提高准确率"""
        reasoning_paths = []
        
        # 生成多条推理路径
        for i in range(n_samples):
            prompt = f"""
            {problem}
            
            让我们一步步思考（推理路径{i+1}）：
            """
            reasoning = self.llm.generate(prompt, temperature=0.7)
            reasoning_paths.append(reasoning)
        
        # 提取并投票选择最一致的答案
        return self.vote_for_answer(reasoning_paths)
```

**适用场景**：
- ✅ 数学计算问题
- ✅ 逻辑推理任务
- ✅ 多步骤任务规划
- ✅ 复杂决策制定
- ⚠️ 增加token消耗
- ⚠️ 简单任务可能不需要

---

### 5. Tree-of-Thought (ToT) Prompting（思维树）

#### 原理与机制

将推理过程建模为树结构，允许探索多个推理路径，通过评估选择最优解。

**机制**：
```
问题
  ├─ 思路1 → 评估 → 保留/剪枝
  ├─ 思路2 → 评估 → 保留/剪枝
  └─ 思路3 → 评估 → 保留/剪枝
      ↓
  深度搜索 + 回溯
      ↓
  最优解
```

#### 正例 ✅

```python
prompt = """
问题：24点游戏
数字：3, 7, 8, 9
使用加减乘除，每个数字只用一次，得到24。

使用思维树方法，探索不同的组合方式：

思路1：从最大的数字9开始
  ├─ 分支1.1：9 + 8 = 17
  │   └─ 下一步：17 + 7 = 24 ❌ 但3没用上
  ├─ 分支1.2：9 - 8 = 1
  │   └─ 下一步：1 * 3 = 3
  │       └─ 下一步：3 * 7 = 21 ❌ 不是24
  └─ 分支1.3：9 * 3 = 27
      └─ 下一步：27 - 8 = 19
          └─ 下一步：19 + 7 = 26 ❌ 不是24

思路2：先考虑乘法组合
  ├─ 分支2.1：8 * 3 = 24 ✓
  │   └─ 下一步：如何用7和9得到1？
  │       ├─ 9 - 7 = 2 ❌ 
  │       └─ 9 / 7 ≈ 1.29 ❌
  └─ 分支2.2：7 * 3 = 21
      └─ 下一步：21 + 9 = 30 ❌
          └─ 下一步：30 - 8 = 22 ❌

思路3：尝试除法组合
  └─ 分支3.1：(9 - 7) = 2
      └─ (8 / 2) = 4
          └─ 4 * 3 = 12 ❌
  
  └─ 分支3.2：(8 / (9 - 7)) * 3
      = (8 / 2) * 3
      = 4 * 3
      = 12 ❌

最优解：(9 - 8 + 7) * 3 = 24
验证：(9 - 8) = 1, 1 + 7 = 8, 8 * 3 = 24 ✓
"""

# LLM输出包含完整的探索过程
```

**为什么有效**：
- 系统性探索多个路径
- 通过评估剪枝无效分支
- 最终找到最优解

#### 反例 ❌

```python
# 错误示例：简单问题使用ToT（过度设计）
prompt = """
问题：1 + 1 = ?

使用思维树方法，探索所有可能的计算路径：
"""

# 问题：
# 1. 简单问题不需要复杂推理
# 2. 浪费计算资源
# 3. 增加延迟
```

#### Agent开发应用

```python
# 决策制定Agent
class DecisionMakingAgent:
    def make_decision(self, scenario: str) -> dict:
        prompt = f"""
        场景：{scenario}
        
        请使用思维树方法分析：
        
        1. 生成3-5个可能的行动方案
        2. 对每个方案进行评估（优点/缺点/风险）
        3. 剪枝不可行的方案
        4. 深度分析剩余方案
        5. 选择最优方案并说明理由
        
        输出格式：
        {
          "options": [...],
          "evaluations": [...],
          "pruned": [...],
          "final_decision": "...",
          "reasoning": "..."
        }
        """
        
        return self.llm.generate_json(prompt)

# 使用示例
agent = DecisionMakingAgent()
decision = agent.make_decision("""
项目进度落后20%，但预算已经用完。
可以选择：
A. 申请追加预算
B. 削减功能范围
C. 延期交付
""")

# 输出示例：
# {
#   "options": [
#     "申请追加预算",
#     "削减功能范围", 
#     "延期交付",
#     "混合方案：削减非核心功能 + 申请部分预算"
#   ],
#   "evaluations": [
#     {
#       "option": "申请追加预算",
#       "pros": ["保留所有功能", "团队士气稳定"],
#       "cons": ["可能被拒", "需要重新审批流程"],
#       "risk": "high",
#       "score": 6/10
#     },
#     ...
#   ],
#   "final_decision": "混合方案",
#   "reasoning": "综合考虑风险和收益..."
# }
```

**代码生成中的应用**

```python
class CodeGenerationAgent:
    def generate_with_tot(self, requirement: str):
        prompt = f"""
        需求：{requirement}
        
        使用思维树方法设计解决方案：
        
        树结构：
        ├─ 设计思路1：[架构A]
        │   ├─ 优点：...
        │   ├─ 缺点：...
        │   └─ 可行性评估：...
        ├─ 设计思路2：[架构B]
        │   ├─ 优点：...
        │   └─ ...
        └─ 设计思路3：[架构C]
        
        最优设计：[选择并解释]
        实现代码：
        """
        
        return self.llm.generate(prompt)
```

**适用场景**：
- ✅ 复杂决策制定
- ✅ 创意问题解决
- ✅ 代码架构设计
- ✅ 游戏策略（24点、数独等）
- ⚠️ 计算成本高
- ⚠️ 简单问题不适用

---

### 6. ReAct Prompting（推理+行动）

#### 原理与机制

结合推理（Reasoning）和行动（Acting），让Agent在思考的同时执行工具调用。

**机制**：
```
Thought: 思考下一步
  ↓
Action: 调用工具
  ↓
Observation: 观察结果
  ↓
Thought: 基于结果继续思考
  ↓
... 循环直到完成
```

**理论基础**：Synergizing Reasoning and Acting

#### 正例 ✅

```python
prompt = """
你是一个智能助手，可以使用以下工具：
- search(query): 搜索网络
- calculator(expression): 计算数学表达式
- weather(city): 查询天气

用户问题：北京现在的温度是多少摄氏度？如果温度低于20度，建议穿什么？

请按ReAct格式思考和行动：

Thought: 我需要查询北京的当前天气
Action: weather("北京")
Observation: 北京当前温度15°C，晴天

Thought: 温度是15度，低于20度。我需要给出穿衣建议。
Answer: 北京当前温度是15°C，低于20度。建议穿着：
- 长袖衬衫或薄毛衣
- 外套（轻薄夹克或风衣）
- 长裤
- 早晚可能需要添衣保暖
"""

# LLM输出符合ReAct格式
```

**为什么有效**：
- 明确的思考-行动-观察循环
- 工具调用有理有据
- 可解释性强

#### 反例 ❌

```python
# 错误示例1：缺少观察步骤
prompt = """
用户问题：123 * 456等于多少？

Thought: 需要计算
Action: calculator("123 * 456")
Answer: 结果是56088

问题：缺少Observation步骤，无法验证结果
"""
```

```python
# 错误示例2：Thought和Action不匹配
prompt = """
用户问题：今天天气如何？

Thought: 我想知道明天天气
Action: weather("今天")

问题：Thought和Action内容不一致
"""
```

#### Agent开发应用

```python
# OpenClaw Agent核心实现
class ReActAgent:
    def __init__(self, tools: dict):
        self.tools = tools
        self.history = []
    
    def run(self, user_request: str, max_iterations: int = 10):
        """ReAct循环"""
        iteration = 0
        
        while iteration < max_iterations:
            iteration += 1
            
            # 生成下一步行动
            prompt = self.build_react_prompt(user_request)
            response = self.llm.generate(prompt)
            
            # 解析Thought/Action/Observation
            thought = self.extract_thought(response)
            action = self.extract_action(response)
            
            if action is None:
                # 没有Action，说明已经给出最终答案
                return self.extract_answer(response)
            
            # 执行工具调用
            tool_name, tool_args = self.parse_action(action)
            observation = self.execute_tool(tool_name, tool_args)
            
            # 记录历史
            self.history.append({
                "thought": thought,
                "action": action,
                "observation": observation
            })
        
        return "达到最大迭代次数，任务未完成"
    
    def build_react_prompt(self, request: str) -> str:
        history_text = self.format_history()
        
        return f"""
        可用工具：{list(self.tools.keys())}
        
        历史：
        {history_text}
        
        用户请求：{request}
        
        请按以下格式继续：
        Thought: [你的思考]
        Action: [工具名(参数)]
        或
        Answer: [最终答案]
        """
    
    def format_history(self) -> str:
        lines = []
        for h in self.history:
            lines.append(f"Thought: {h['thought']}")
            lines.append(f"Action: {h['action']}")
            lines.append(f"Observation: {h['observation']}")
        return "\n".join(lines)

# 使用示例
tools = {
    "search": web_search,
    "read": read_file,
    "write": write_file
}

agent = ReActAgent(tools)
result = agent.run("搜索AI Agent最新论文并保存到文件")

# 执行轨迹：
# Thought: 需要搜索AI Agent论文
# Action: search("AI Agent 2026 latest papers")
# Observation: 找到10篇论文，包括Memento-Skills...
# 
# Thought: 需要将结果保存到文件
# Action: write("papers.md", content)
# Observation: 文件已保存
# 
# Answer: 已完成搜索和保存，共找到10篇论文
```

**高级应用：带反思的ReAct**

```python
class ReflectiveReActAgent(ReActAgent):
    def run_with_reflection(self, request: str):
        """带反思机制的ReAct"""
        result = super().run(request)
        
        # 执行后反思
        reflection_prompt = f"""
        任务：{request}
        执行历史：{self.format_history()}
        结果：{result}
        
        请反思：
        1. 执行过程是否高效？
        2. 有没有更好的工具选择？
        3. 如何改进？
        """
        
        reflection = self.llm.generate(reflection_prompt)
        
        # 保存反思结果以供下次改进
        self.save_reflection(reflection)
        
        return {
            "result": result,
            "reflection": reflection
        }
```

**适用场景**：
- ✅ 需要工具调用的任务
- ✅ 多步骤问题解决
- ✅ 信息检索和整合
- ✅ 交互式决策制定
- ⚠️ 需要精心设计的工具集
- ⚠️ 错误可能累积

---

## 三、结构化输出技术

### 7. Structured Output Prompting（结构化输出）

#### 原理与机制

通过明确的格式约束，让模型生成结构化数据（JSON、XML、表格等）。

**机制**：
```
输入: 任务 + 格式定义 + 示例
  ↓
LLM: 严格遵循格式生成
  ↓
输出: 可解析的结构化数据
```

#### 正例 ✅

```python
prompt = """
分析以下产品评论，提取情感和关键信息。

评论："这款耳机音质很棒，降噪效果出色，但电池续航有点短。"

请以JSON格式输出：
{
  "sentiment": "positive" | "negative" | "neutral",
  "confidence": 0.0-1.0,
  "aspects": [
    {
      "feature": "string",
      "opinion": "positive" | "negative",
      "detail": "string"
    }
  ],
  "summary": "string"
}

输出：
"""

# LLM输出：
# {
#   "sentiment": "positive",
#   "confidence": 0.85,
#   "aspects": [
#     {
#       "feature": "音质",
#       "opinion": "positive",
#       "detail": "很棒"
#     },
#     {
#       "feature": "降噪",
#       "opinion": "positive",
#       "detail": "效果出色"
#     },
#     {
#       "feature": "电池续航",
#       "opinion": "negative",
#       "detail": "有点短"
#     }
#   ],
#   "summary": "音质和降噪优秀，但续航有待提升"
# }
```

**为什么有效**：
- JSON Schema清晰定义
- 枚举值明确
- 示例展示完整结构

#### 反例 ❌

```python
# 错误示例1：格式定义模糊
prompt = """
分析评论并以JSON格式输出。

评论："这个产品很好用。"
"""

# LLM输出可能不一致：
# {"good": true}
# 或
# {"rating": 5}
# 或
# {"sentiment": "positive"}

# 问题：缺少具体的Schema定义
```

```python
# 错误示例2：复杂嵌套无示例
prompt = """
分析文章结构，输出JSON：
{
  "sections": [
    {
      "title": "string",
      "paragraphs": [
        {
          "content": "string",
          "keywords": ["string"]
        }
      ]
    }
  ]
}

文章：[长篇文章]
"""

# 问题：
# 1. 嵌套结构复杂但无示例
# 2. 容易出现格式错误
# 3. 难以保证一致性
```

#### Agent开发应用

```python
# OpenClaw配置解析Agent
class ConfigParserAgent:
    def parse_user_intent(self, user_input: str) -> dict:
        prompt = f"""
        用户输入：{user_input}
        
        解析为结构化配置：
        {{
          "action": "create" | "read" | "update" | "delete",
          "resource_type": "file" | "document" | "skill" | "task",
          "parameters": {{
            "path": "string (optional)",
            "content": "string (optional)",
            "options": {{}}
          }},
          "constraints": [
            {{
              "type": "permission" | "validation" | "limit",
              "value": "string"
            }}
          ]
        }}
        
        示例：
        输入："创建一个名为test.md的文件，内容是Hello World"
        输出：{{
          "action": "create",
          "resource_type": "file",
          "parameters": {{
            "path": "test.md",
            "content": "Hello World"
          }},
          "constraints": []
        }}
        
        现在解析：
        """
        
        response = self.llm.generate(prompt)
        return self.validate_and_parse_json(response)

# 使用示例
parser = ConfigParserAgent()
config = parser.parse_user_intent("""
读取/data/reports/目录下所有markdown文件，
找出包含"AI Agent"的段落，并生成摘要报告
""")

# 输出：
# {
#   "action": "read",
#   "resource_type": "file",
#   "parameters": {
#     "path": "/data/reports/",
#     "pattern": "*.md",
#     "filter": {
#       "contains": "AI Agent"
#     }
#   },
#   "constraints": [
#     {
#       "type": "validation",
#       "value": "must_be_directory"
#     }
#   ],
#   "post_action": {
#     "type": "summarize",
#     "output_format": "report"
#   }
# }
```

**高级应用：动态Schema生成**

```python
class DynamicSchemaAgent:
    def __init__(self):
        self.schema_registry = {}
    
    def register_schema(self, task_type: str, schema: dict):
        """注册任务类型的Schema"""
        self.schema_registry[task_type] = schema
    
    def execute_with_schema(self, task_type: str, input_data: str):
        """使用注册的Schema执行任务"""
        schema = self.schema_registry.get(task_type)
        
        if not schema:
            raise ValueError(f"Unknown task type: {task_type}")
        
        prompt = f"""
        输入数据：{input_data}
        
        请严格按照以下JSON Schema输出：
        {json.dumps(schema, indent=2)}
        
        输出：
        """
        
        response = self.llm.generate(prompt)
        return self.validate_against_schema(response, schema)

# 注册不同任务的Schema
agent = DynamicSchemaAgent()

agent.register_schema("sentiment_analysis", {
    "type": "object",
    "properties": {
        "sentiment": {"enum": ["positive", "negative", "neutral"]},
        "score": {"type": "number", "minimum": 0, "maximum": 1}
    },
    "required": ["sentiment", "score"]
})

agent.register_schema("entity_extraction", {
    "type": "object",
    "properties": {
        "entities": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "text": {"type": "string"},
                    "type": {"type": "string"},
                    "confidence": {"type": "number"}
                }
            }
        }
    }
})
```

**适用场景**：
- ✅ API响应生成
- ✅ 数据提取和转换
- ✅ 配置文件生成
- ✅ 报表数据结构化
- ⚠️ 需要严格的Schema定义
- ⚠️ 复杂嵌套需要示例

---

### 8. Program-of-Thoughts (PoT) Prompting（程序化思维）

#### 原理与机制

将推理过程表达为可执行的程序代码，通过代码执行获得精确结果。

**机制**：
```
输入: 问题
  ↓
LLM: 生成Python/代码
  ↓
执行: 代码运行
  ↓
输出: 精确结果
```

#### 正例 ✅

```python
prompt = """
问题：一个班级有30个学生，其中60%是女生。
如果女生的平均分是85分，男生的平均分是78分，
求全班的平均分。

请用Python代码计算，并输出结果。

```python
# 定义变量
total_students = 30
female_percentage = 0.60
female_avg = 85
male_avg = 78

# 计算
female_count = total_students * female_percentage
male_count = total_students - female_count

total_score = (female_count * female_avg + 
               male_count * male_avg)
class_avg = total_score / total_students

print(f"全班平均分：{class_avg:.2f}")
```

执行结果：
"""

# LLM输出：
# 全班平均分：82.20
```

**为什么有效**：
- 代码逻辑清晰
- 可以执行验证
- 避免计算错误

#### 反例 ❌

```python
# 错误示例：非计算问题使用PoT
prompt = """
问题：请描述一下春天的景色。

用Python代码表达：
"""

# 问题：
# 1. 描述性问题不需要编程
# 2. 强行用代码表达反而复杂
# 3. 不适合的领域
```

#### Agent开发应用

```python
# 数据分析Agent
class DataAnalysisAgent:
    def analyze_with_code(self, data_description: str, question: str):
        prompt = f"""
        数据：{data_description}
        问题：{question}
        
        请编写Python代码进行分析：
        1. 加载和预处理数据
        2. 执行分析逻辑
        3. 生成可视化（如需要）
        4. 输出结果
        
        代码：
        ```python
        # 你的代码
        ```
        
        结果解释：
        """
        
        code = self.llm.generate(prompt)
        result = self.execute_code_safely(code)
        
        return {
            "code": code,
            "result": result,
            "explanation": self.explain_result(result)
        }

# 使用示例
agent = DataAnalysisAgent()
analysis = agent.analyze_with_code(
    data_description="""
    销售数据CSV文件，包含列：
    - date: 日期
    - product: 产品名称
    - quantity: 销售数量
    - revenue: 收入
    """,
    question="找出销售额前5的产品及其占比"
)

# 生成的代码：
# import pandas as pd
# import matplotlib.pyplot as plt
# 
# df = pd.read_csv('sales.csv')
# 
# # 计算每个产品的总销售额
# product_sales = df.groupby('product')['revenue'].sum()
# 
# # 找出前5
# top5 = product_sales.nlargest(5)
# 
# # 计算占比
# total_revenue = product_sales.sum()
# percentage = (top5 / total_revenue * 100).round(2)
# 
# print("Top 5 Products:")
# for product, revenue in top5.items():
#     print(f"{product}: ${revenue:.2f} ({percentage[product]}%)")
# 
# # 可视化
# top5.plot(kind='bar')
# plt.title('Top 5 Products by Revenue')
# plt.tight_layout()
# plt.savefig('top5_products.png')
```

**适用场景**：
- ✅ 数学计算
- ✅ 数据分析
- ✅ 统计处理
- ✅ 算法实现
- ⚠️ 需要安全的执行环境
- ⚠️ 非结构化问题不适用

---

## 四、高级提示词技术

### 9. Self-Consistency（自一致性）

#### 原理与机制

对同一问题生成多个推理路径，通过投票选择最一致的答案。

**机制**：
```
问题 → 路径1 → 答案A
     → 路径2 → 答案A
     → 路径3 → 答案B
     → 路径4 → 答案A
     
投票：答案A (3票) vs 答案B (1票)
结果：答案A
```

#### 正例 ✅

```python
class SelfConsistencySolver:
    def solve(self, problem: str, n_samples: int = 5):
        """使用自一致性求解"""
        answers = []
        
        for i in range(n_samples):
            prompt = f"""
            {problem}
            
            让我们一步步思考（推理{i+1}）：
            """
            
            response = self.llm.generate(
                prompt, 
                temperature=0.7  # 增加多样性
            )
            
            answer = self.extract_final_answer(response)
            answers.append({
                "path": i+1,
                "reasoning": response,
                "answer": answer
            })
        
        # 投票
        from collections import Counter
        answer_counts = Counter([a["answer"] for a in answers])
        most_common = answer_counts.most_common(1)[0]
        
        return {
            "consensus_answer": most_common[0],
            "confidence": most_common[1] / n_samples,
            "all_answers": answers
        }

# 使用示例
solver = SelfConsistencySolver()
result = solver.solve("""
一个袋子里有5个红球和3个蓝球。
连续取出2个球（不放回），
第一个是红球的概率是多少？
""", n_samples=10)

# 输出：
# {
#   "consensus_answer": "5/8",
#   "confidence": 0.8,  # 8/10路径得出相同答案
#   "all_answers": [...]
# }
```

**为什么有效**：
- 多路径减少随机错误
- 投票提高可靠性
- 可以评估置信度

#### 反例 ❌

```python
# 错误示例：简单问题使用自一致性（过度）
solver.solve("1 + 1 = ?", n_samples=10)

# 问题：
# 1. 浪费计算资源
# 2. 增加延迟
# 3. 简单问题不需要
```

#### Agent开发应用

```python
# 关键决策Agent
class CriticalDecisionAgent:
    def make_critical_decision(self, scenario: str):
        """对关键决策使用自一致性"""
        
        # 生成多个决策路径
        decisions = []
        for i in range(5):
            prompt = f"""
            场景：{scenario}
            
            请分析并给出决策建议（分析{i+1}）：
            1. 识别关键因素
            2. 评估风险
            3. 给出建议
            
            决策：
            """
            
            decision = self.llm.generate(prompt, temperature=0.8)
            decisions.append(decision)
        
        # 提取共识
        consensus = self.extract_consensus(decisions)
        
        # 如果没有明确共识，触发人工审核
        if consensus["confidence"] < 0.6:
            self.flag_for_human_review(scenario, decisions)
        
        return consensus
```

**适用场景**：
- ✅ 高风险决策
- ✅ 复杂推理问题
- ✅ 需要置信度的场景
- ⚠️ 计算成本高
- ⚠️ 增加响应时间

---

### 10. Generated Knowledge Prompting（生成知识提示）

#### 原理与机制

先让模型生成相关知识，再基于这些知识回答问题。

**机制**：
```
问题
  ↓
步骤1：生成相关知识
  ↓
步骤2：基于知识回答
  ↓
答案
```

#### 正例 ✅

```python
prompt = """
问题：量子计算机如何工作？

步骤1：生成相关知识
请先列出关于量子计算机的核心概念：
- 量子比特（qubit）
- 量子叠加
- 量子纠缠
- 量子门
- 量子退相干

步骤2：基于知识回答
现在，请使用上述概念解释量子计算机的工作原理：
"""

# LLM输出：
# 
# 相关知识：
# 1. 量子比特：量子信息的基本单位，可以同时处于0和1的叠加态
# 2. 量子叠加：允许量子比特同时表示多个状态
# 3. 量子纠缠：两个量子比特之间可以建立强关联
# 4. 量子门：对量子比特进行操作的基本单元
# 5. 量子退相干：量子态与环境相互作用导致的退化
# 
# 解释：
# 量子计算机利用量子比特的叠加和纠缠特性，
# 可以同时处理大量计算路径。通过量子门的精确操作，
# 实现特定算法（如Shor算法、Grover算法）的指数级加速。
# 但需要克服量子退相干带来的挑战...
```

**为什么有效**：
- 先激活相关知识
- 确保回答基于事实
- 提高专业性

#### 反例 ❌

```python
# 错误示例：简单事实性问题
prompt = """
问题：中国的首都是哪里？

步骤1：生成相关知识
步骤2：回答

# 问题：简单问题不需要两步
# 直接回答即可
"""
```

#### Agent开发应用

```python
# 专家系统Agent
class ExpertSystemAgent:
    def answer_with_knowledge(self, question: str, domain: str):
        prompt = f"""
        领域：{domain}
        问题：{question}
        
        第一阶段：知识生成
        请生成回答此问题所需的核心知识：
        1. 基本概念定义
        2. 关键理论
        3. 重要公式/方法
        4. 相关案例
        
        第二阶段：知识应用
        基于上述知识，详细回答问题：
        """
        
        return self.llm.generate(prompt)

# 使用示例
expert = ExpertSystemAgent()
answer = expert.answer_with_knowledge(
    question="如何设计一个高可用的分布式系统？",
    domain="分布式系统"
)

# 输出包含：
# 1. CAP理论、一致性协议、故障检测等知识
# 2. 基于这些知识的具体设计建议
```

**适用场景**：
- ✅ 专业领域问答
- ✅ 教育辅导
- ✅ 技术文档生成
- ⚠️ 增加token消耗
- ⚠️ 简单问题不适用

---

### 11. Directional Stimulus Prompting（定向刺激提示）

#### 原理与机制

通过特定的关键词或短语，引导模型朝特定方向思考。

**机制**：
```
问题 + 刺激词（如"从安全角度"）
  ↓
LLM: 被引导到特定视角
  ↓
输出: 特定方向的回答
```

#### 正例 ✅

```python
prompt = """
产品功能：用户头像上传

从【安全性】角度分析这个功能：
- 文件上传漏洞
- 恶意文件检测
- 存储安全

从【性能】角度分析：
- 图片压缩
- CDN加速
- 缓存策略

从【用户体验】角度分析：
- 裁剪功能
- 预览效果
- 上传进度

综合建议：
"""

# LLM输出：
# 
# 安全性：
# 1. 限制文件类型（仅允许jpg, png）
# 2. 检查文件头，防止伪装
# 3. 重命名文件，避免路径遍历
# 4. 使用独立存储域名，防止XSS
# 
# 性能：
# 1. 客户端压缩到合理大小
# 2. 使用WebP格式
# 3. CDN分发
# 4. 多尺寸缓存
# 
# 用户体验：
# 1. 提供裁剪工具
# 2. 实时预览
# 3. 进度条显示
# 4. 失败重试机制
# 
# 综合建议：
# 实现一个安全的、高性能的、用户友好的
# 头像上传功能，需要平衡安全检查和性能...
```

**为什么有效**：
- 多角度全面分析
- 刺激词明确方向
- 避免遗漏重要方面

#### 反例 ❌

```python
# 错误示例：刺激词过多
prompt = """
从安全、性能、用户体验、可维护性、
可扩展性、成本、法律合规、国际化、
无障碍访问、SEO角度分析...

# 问题：
# 1. 方向太多，失去焦点
# 2. 难以深入每个方面
# 3. token消耗大
"""
```

#### Agent开发应用

```python
# 代码审查Agent
class CodeReviewAgent:
    def review_code(self, code: str, aspects: list):
        """从多个维度审查代码"""
        
        aspect_prompts = {
            "security": "从【安全性】角度：检查SQL注入、XSS、权限控制",
            "performance": "从【性能】角度：检查算法复杂度、内存使用、I/O",
            "readability": "从【可读性】角度：检查命名、注释、代码结构",
            "maintainability": "从【可维护性】角度：检查耦合度、模块化"
        }
        
        reviews = {}
        for aspect in aspects:
            prompt = f"""
            代码：
            ```
            {code}
            ```
            
            {aspect_prompts.get(aspect, f"从【{aspect}】角度分析：")}
            
            列出问题并给出改进建议。
            """
            
            reviews[aspect] = self.llm.generate(prompt)
        
        return reviews

# 使用示例
reviewer = CodeReviewAgent()
review = reviewer.review_code(
    code=user_code,
    aspects=["security", "performance", "readability"]
)
```

**适用场景**：
- ✅ 多维度分析
- ✅ 代码审查
- ✅ 方案评估
- ✅ 风险分析
- ⚠️ 需要选择合适的角度
- ⚠️ 避免角度过多

---

### 12. Automatic Prompt Engineering (APE)（自动提示词工程）

#### 原理与机制

使用LLM自动生成和优化提示词，通过评估选择最优提示。

**机制**：
```
任务描述
  ↓
LLM生成多个候选提示
  ↓
在测试集上评估
  ↓
选择最优提示
```

#### 正例 ✅

```python
class AutoPromptEngineer:
    def __init__(self, task_description: str, test_cases: list):
        self.task_desc = task_description
        self.test_cases = test_cases
    
    def generate_candidate_prompts(self, n: int = 5):
        """生成候选提示词"""
        prompt = f"""
        任务：{self.task_desc}
        
        请生成{n}个不同的提示词模板，
        每个模板应该：
        1. 清晰定义任务
        2. 提供输出格式
        3. 包含示例（如适用）
        
        模板1：
        ...
        
        模板2：
        ...
        """
        
        return self.llm.generate(prompt)
    
    def evaluate_prompt(self, prompt_template: str):
        """评估提示词效果"""
        correct = 0
        
        for test_case in self.test_cases:
            filled_prompt = prompt_template.format(
                input=test_case["input"]
            )
            
            response = self.llm.generate(filled_prompt)
            
            if self.check_answer(response, test_case["expected"]):
                correct += 1
        
        return correct / len(self.test_cases)
    
    def optimize(self):
        """自动优化流程"""
        # 生成候选
        candidates = self.parse_candidates(
            self.generate_candidate_prompts()
        )
        
        # 评估
        scores = []
        for candidate in candidates:
            score = self.evaluate_prompt(candidate)
            scores.append((candidate, score))
        
        # 选择最优
        best_prompt, best_score = max(scores, key=lambda x: x[1])
        
        # 迭代改进
        for iteration in range(3):
            improved = self.refine_prompt(best_prompt, best_score)
            new_score = self.evaluate_prompt(improved)
            
            if new_score > best_score:
                best_prompt = improved
                best_score = new_score
        
        return {
            "best_prompt": best_prompt,
            "score": best_score,
            "iterations": iteration + 1
        }

# 使用示例
ape = AutoPromptEngineer(
    task_description="情感分析：判断文本是正面、负面还是中性",
    test_cases=[
        {"input": "这个产品很好用", "expected": "positive"},
        {"input": "质量太差了", "expected": "negative"},
        {"input": "还可以", "expected": "neutral"},
        # ...更多测试用例
    ]
)

result = ape.optimize()
print(f"最优提示词：{result['best_prompt']}")
print(f"准确率：{result['score']:.2%}")
```

**为什么有效**：
- 自动化提示词设计
- 基于数据驱动优化
- 可以持续改进

#### Agent开发应用

```python
# Agent技能提示词优化器
class SkillPromptOptimizer:
    def optimize_skill_prompt(self, skill_name: str, examples: list):
        """优化特定技能的提示词"""
        
        # 提取任务特征
        task_features = self.analyze_examples(examples)
        
        # 生成候选提示词
        candidates = self.generate_prompts(task_features)
        
        # 在真实场景中测试
        best_prompt = None
        best_score = 0
        
        for candidate in candidates:
            # 在实际使用中评估
            score = self.evaluate_in_production(
                skill_name,
                candidate,
                test_period="1h"
            )
            
            if score > best_score:
                best_prompt = candidate
                best_score = score
        
        # 更新技能提示词
        self.update_skill(skill_name, best_prompt)
        
        return {
            "skill": skill_name,
            "new_prompt": best_prompt,
            "improvement": best_score
        }
```

**适用场景**：
- ✅ 大规模部署场景
- ✅ 需要持续优化
- ✅ 有充足测试数据
- ⚠️ 需要评估基础设施
- ⚠️ 计算成本高

---

## 五、Agent专用技术

### 13. Multi-Turn Prompting（多轮对话提示）

#### 原理与机制

维护对话历史，让模型理解上下文，实现连贯的多轮交互。

**机制**：
```
对话历史 = [
  {"role": "user", "content": "..."},
  {"role": "assistant", "content": "..."},
  ...
]
  ↓
LLM: 基于完整上下文生成回复
  ↓
新回复加入历史
```

#### 正例 ✅

```python
class ConversationAgent:
    def __init__(self, max_history: int = 10):
        self.history = []
        self.max_history = max_history
    
    def chat(self, user_input: str) -> str:
        """多轮对话"""
        
        # 添加用户消息
        self.history.append({
            "role": "user",
            "content": user_input
        })
        
        # 构建提示词（包含历史）
        prompt = self.build_prompt_with_history()
        
        # 生成回复
        response = self.llm.generate(prompt)
        
        # 添加到历史
        self.history.append({
            "role": "assistant",
            "content": response
        })
        
        # 限制历史长度
        if len(self.history) > self.max_history * 2:
            self.history = self.history[-self.max_history * 2:]
        
        return response
    
    def build_prompt_with_history(self) -> str:
        """构建包含历史的提示词"""
        history_text = "\n".join([
            f"{msg['role']}: {msg['content']}"
            for msg in self.history
        ])
        
        return f"""
        对话历史：
        {history_text}
        
        请基于对话历史继续对话，保持连贯性和一致性。
        """

# 使用示例
agent = ConversationAgent()

# 第一轮
response1 = agent.chat("我想学习Python")
# "Python是一门很好的编程语言..."

# 第二轮（模型记住上下文）
response2 = agent.chat("从哪里开始？")
# "建议从基础语法开始，比如变量、数据类型..."
# （模型理解"从哪里开始"是指Python学习）

# 第三轮
response3 = agent.chat("有什么好的教程推荐吗？")
# "推荐以下Python教程..."
# （模型继续在Python学习上下文中）
```

**为什么有效**：
- 保持上下文连贯
- 支持指代消解
- 用户体验自然

#### 反例 ❌

```python
# 错误示例1：历史过长
agent = ConversationAgent(max_history=100)

# 问题：
# 1. Token消耗过大
# 2. 早期对话可能不相关
# 3. 成本增加

# 错误示例2：历史包含敏感信息
agent.history = [
    {"role": "user", "content": "我的密码是123456"},
    ...
]

# 后续对话中可能泄露密码
# 问题：安全风险
```

#### Agent开发应用

```python
# OpenClaw多轮任务执行
class MultiTurnTaskAgent:
    def __init__(self):
        self.task_history = []
        self.current_context = {}
    
    def execute_with_context(self, user_request: str):
        """带上下文的任务执行"""
        
        # 解析请求（参考历史）
        context_aware_prompt = f"""
        历史任务：{self.task_history[-5:]}  # 最近5个任务
        
        当前请求：{user_request}
        
        请判断：
        1. 这是新任务还是延续之前的任务？
        2. 需要哪些上下文信息？
        3. 如何执行？
        """
        
        task_plan = self.llm.generate(context_aware_prompt)
        
        # 执行任务
        result = self.execute_task(task_plan)
        
        # 记录到历史
        self.task_history.append({
            "request": user_request,
            "plan": task_plan,
            "result": result,
            "timestamp": time.now()
        })
        
        return result

# 使用示例
agent = MultiTurnTaskAgent()

# 任务1
agent.execute_with_context("搜索AI Agent论文")
# → 执行搜索，保存结果到context

# 任务2（引用任务1的结果）
agent.execute_with_context("分析刚才找到的论文")
# → 理解"刚才找到的论文"指的是任务1的结果

# 任务3
agent.execute_with_context("发布分析结果到博客")
# → 理解"分析结果"是任务2的输出
```

**高级应用：智能历史压缩**

```python
class SmartHistoryAgent(ConversationAgent):
    def compress_history(self):
        """智能压缩对话历史"""
        if len(self.history) < 10:
            return
        
        # 使用LLM总结早期对话
        early_history = self.history[:5]
        summary_prompt = f"""
        总结以下对话的关键信息：
        {early_history}
        
        用2-3句话概括：
        """
        
        summary = self.llm.generate(summary_prompt)
        
        # 用摘要替换早期历史
        self.history = [
            {"role": "system", "content": f"[历史摘要] {summary}"},
            *self.history[5:]
        ]
```

**适用场景**：
- ✅ 聊天机器人
- ✅ 任务执行Agent
- ✅ 教育辅导系统
- ⚠️ 需要管理历史长度
- ⚠️ 注意隐私和安全

---

### 14. Metacognitive Prompting（元认知提示）

#### 原理与机制

让模型反思自己的思考过程，进行自我评估和改进。

**机制**：
```
初始回答
  ↓
自我评估：这个回答好吗？
  ↓
识别不足
  ↓
改进回答
  ↓
最终答案
```

#### 正例 ✅

```python
class MetacognitiveAgent:
    def answer_with_reflection(self, question: str):
        """带元认知的回答"""
        
        # 第一步：初始回答
        initial_prompt = f"""
        问题：{question}
        
        请回答：
        """
        initial_answer = self.llm.generate(initial_prompt)
        
        # 第二步：自我评估
        reflection_prompt = f"""
        问题：{question}
        
        我的回答：{initial_answer}
        
        请自我评估：
        1. 回答是否完整？
        2. 逻辑是否清晰？
        3. 有没有遗漏重要信息？
        4. 准确性如何？（0-10分）
        5. 如何改进？
        """
        reflection = self.llm.generate(reflection_prompt)
        
        # 第三步：改进回答
        improvement_prompt = f"""
        问题：{question}
        
        初始回答：{initial_answer}
        
        自我评估：{reflection}
        
        基于评估，请给出改进后的回答：
        """
        improved_answer = self.llm.generate(improvement_prompt)
        
        return {
            "initial": initial_answer,
            "reflection": reflection,
            "improved": improved_answer
        }

# 使用示例
agent = MetacognitiveAgent()
result = agent.answer_with_reflection("""
如何设计一个高并发系统？
""")

# 输出：
# {
#   "initial": "可以使用负载均衡、缓存...",
#   "reflection": "
#     1. 完整性：7/10，缺少数据库设计
#     2. 逻辑：8/10，结构清晰
#     3. 遗漏：没提到分布式事务、消息队列
#     4. 准确性：8/10
#     5. 改进：增加数据库分片、消息队列内容
#   ",
#   "improved": "
#     设计高并发系统需要：
#     1. 负载均衡（Nginx、HAProxy）
#     2. 缓存策略（Redis、CDN）
#     3. 数据库优化（读写分离、分片）
#     4. 消息队列（削峰填谷）
#     5. 分布式事务（最终一致性）
#     ...
#   "
# }
```

**为什么有效**：
- 显式反思过程
- 识别并弥补不足
- 提高回答质量

#### 反例 ❌

```python
# 错误示例：简单问题使用元认知
agent.answer_with_reflection("1 + 1 = ?")

# 问题：
# 1. 过度设计
# 2. 浪费资源
# 3. 简单问题无需反思
```

#### Agent开发应用

```python
# OpenClaw任务反思Agent
class ReflectiveTaskAgent:
    def execute_and_reflect(self, task: str):
        """执行任务并反思"""
        
        # 执行任务
        execution_result = self.execute_task(task)
        
        # 反思执行过程
        reflection_prompt = f"""
        任务：{task}
        执行结果：{execution_result}
        
        请反思：
        1. 执行效率如何？
        2. 有没有更优方案？
        3. 遇到什么问题？
        4. 如何避免类似问题？
        5. 可以学到什么经验？
        """
        
        reflection = self.llm.generate(reflection_prompt)
        
        # 更新技能库（如果学到新经验）
        if self.should_update_skill(reflection):
            self.update_skill_library(task, reflection)
        
        return {
            "result": execution_result,
            "reflection": reflection,
            "skill_updated": True
        }

# 使用示例
agent = ReflectiveTaskAgent()
result = agent.execute_and_reflect("""
搜索并分析10篇AI Agent论文
""")

# 可能的反思：
# "执行效率：中等
#  问题：逐个分析论文较慢
#  改进：可以并行处理
#  经验：添加批量分析技能"
```

**高级应用：持续学习循环**

```python
class ContinuousLearningAgent:
    def __init__(self):
        self.experience_log = []
        self.learned_patterns = {}
    
    def learn_from_experience(self, task: str, result: str):
        """从经验中学习"""
        
        # 元认知分析
        analysis = self.metacognitive_analyze(task, result)
        
        # 提取模式
        patterns = self.extract_patterns(analysis)
        
        # 更新知识库
        for pattern in patterns:
            if pattern.is_useful():
                self.learned_patterns[pattern.id] = pattern
        
        # 应用到未来任务
        self.update_prompts_with_patterns()
    
    def metacognitive_analyze(self, task, result):
        """元认知分析"""
        prompt = f"""
        任务：{task}
        结果：{result}
        
        深度分析：
        1. 什么做得好？
        2. 什么可以改进？
        3. 有什么通用规律？
        4. 如何应用到类似任务？
        5. 需要记住什么？
        """
        
        return self.llm.generate(prompt)
```

**适用场景**：
- ✅ 复杂任务执行
- ✅ 持续学习系统
- ✅ 质量要求高的场景
- ⚠️ 增加计算成本
- ⚠️ 简单任务不适用

---

## 六、技术对比与选择指南

### 6.1 技术对比矩阵

| 技术 | 复杂度 | Token消耗 | 准确性提升 | 适用场景 |
|------|--------|----------|-----------|---------|
| Zero-Shot | ⭐ | ⭐ | - | 简单通用任务 |
| Few-Shot | ⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ | 格式化输出 |
| Role-Based | ⭐⭐ | ⭐⭐ | ⭐⭐ | 专业领域问答 |
| CoT | ⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | 推理任务 |
| ToT | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | 复杂决策 |
| ReAct | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | 工具调用 |
| Structured | ⭐⭐ | ⭐⭐ | ⭐⭐⭐⭐ | 数据提取 |
| PoT | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | 计算任务 |
| Self-Consistency | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | 高风险决策 |
| Generated Knowledge | ⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | 专业问答 |
| Directional Stimulus | ⭐⭐ | ⭐⭐ | ⭐⭐⭐ | 多角度分析 |
| APE | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | 大规模部署 |
| Multi-Turn | ⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ | 对话系统 |
| Metacognitive | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | 质量保证 |

### 6.2 选择决策树

```
任务类型？
├─ 简单分类/问答
│   └─ Zero-Shot 或 Few-Shot（需要示例时）
│
├─ 推理/计算
│   ├─ 简单计算 → PoT
│   ├─ 逻辑推理 → CoT
│   └─ 复杂决策 → ToT 或 Self-Consistency
│
├─ 工具调用
│   └─ ReAct
│
├─ 数据提取
│   └─ Structured Output
│
├─ 专业领域
│   ├─ 有示例 → Few-Shot + Role-Based
│   └─ 无示例 → Generated Knowledge
│
├─ 多角度分析
│   └─ Directional Stimulus
│
├─ 对话系统
│   └─ Multi-Turn
│
└─ 质量要求高
    └─ Metacognitive 或 Self-Consistency
```

### 6.3 组合使用策略

```python
# 组合示例1：Few-Shot + CoT + Structured Output
class AdvancedExtractionAgent:
    def extract_complex_data(self, text: str):
        prompt = f"""
        从文本中提取结构化信息。

        示例1：
        文本："张三，男，28岁，工程师，月薪15000"
        推理：
        1. "张三"是人名
        2. "男"是性别
        3. "28岁"是年龄（数字28）
        4. "工程师"是职业
        5. "月薪15000"是收入（数字15000）
        输出：{{"name": "张三", "gender": "male", "age": 28, "job": "工程师", "salary": 15000}}

        示例2：
        文本："李四，女，35岁，医生，收入20000/月"
        推理：
        1. "李四"是人名
        2. "女"是性别
        3. "35岁"是年龄
        4. "医生"是职业
        5. "20000/月"是月薪
        输出：{{"name": "李四", "gender": "female", "age": 35, "job": "医生", "salary": 20000}}

        现在处理：
        文本："{text}"
        
        让我们一步步思考：
        """
        
        return self.llm.generate_json(prompt)

# 组合示例2：ReAct + CoT + Metacognitive
class ReflectiveReActAgent(ReActAgent):
    def run_with_reflection(self, request: str):
        # 执行ReAct循环
        result = super().run(request)
        
        # 元认知反思
        reflection_prompt = f"""
        任务：{request}
        执行历史：{self.format_history()}
        结果：{result}
        
        反思：
        1. 工具选择是否合理？
        2. 执行步骤是否最优？
        3. 如何改进？
        """
        
        reflection = self.llm.generate(reflection_prompt)
        
        # 如果发现可改进，重新执行
        if self.should_retry(reflection):
            return super().run(request)
        
        return result

# 组合示例3：Role-Based + Multi-Turn + Structured Output
class RolePlayDataAgent:
    def __init__(self, role_config: dict):
        self.role = role_config
        self.history = []
    
    def process_with_role(self, user_input: str):
        prompt = f"""
        角色设定：{self.role}
        
        对话历史：
        {self.format_history()}
        
        用户输入：{user_input}
        
        请以角色身份处理，并输出JSON格式结果：
        {{
          "response": "角色回复",
          "extracted_data": {{}},
          "next_action": "建议下一步"
        }}
        """
        
        response = self.llm.generate_json(prompt)
        self.history.append({"user": user_input, "assistant": response})
        
        return response
```

---

## 七、实战案例：构建OpenClaw提示词系统

### 7.1 系统架构

```python
class OpenClawPromptSystem:
    """OpenClaw提示词系统"""
    
    def __init__(self):
        self.skill_registry = {}
        self.prompt_templates = {}
        self.optimization_engine = AutoPromptEngineer()
    
    def register_skill(self, skill_name: str, config: dict):
        """注册技能"""
        self.skill_registry[skill_name] = {
            "base_prompt": config["prompt"],
            "techniques": config.get("techniques", []),
            "examples": config.get("examples", []),
            "validator": config.get("validator")
        }
    
    def build_prompt(self, skill_name: str, context: dict) -> str:
        """构建组合提示词"""
        skill = self.skill_registry[skill_name]
        
        # 基础提示词
        prompt = skill["base_prompt"]
        
        # 应用技术
        for technique in skill["techniques"]:
            prompt = self.apply_technique(
                technique, 
                prompt, 
                context,
                skill["examples"]
            )
        
        return prompt
    
    def apply_technique(self, technique: str, prompt: str, 
                       context: dict, examples: list) -> str:
        """应用特定提示词技术"""
        
        if technique == "few_shot":
            # 添加示例
            examples_text = "\n\n".join([
                f"示例{i+1}：\n输入：{ex['input']}\n输出：{ex['output']}"
                for i, ex in enumerate(examples[:3])
            ])
            prompt = f"{prompt}\n\n{examples_text}\n\n现在处理：\n输入：{context['input']}"
        
        elif technique == "cot":
            prompt = f"{prompt}\n\n让我们一步步思考："
        
        elif technique == "structured":
            prompt = f"{prompt}\n\n请以JSON格式输出。"
        
        elif technique == "role_based":
            prompt = f"{context.get('role', '你是专家助手')}\n\n{prompt}"
        
        # ... 其他技术
        
        return prompt

# 使用示例
system = OpenClawPromptSystem()

# 注册技能
system.register_skill("blog-publisher", {
    "prompt": "发布博客文章到指定平台",
    "techniques": ["few_shot", "structured", "cot"],
    "examples": [
        {
            "input": "发布文章到WordPress",
            "output": '{"platform": "wordpress", "status": "success"}'
        }
    ],
    "validator": validate_blog_config
})

# 构建提示词
final_prompt = system.build_prompt(
    "blog-publisher",
    {
        "input": "发布Markdown到Hexo博客",
        "role": "你是博客发布专家"
    }
)
```

### 7.2 动态技术选择

```python
class AdaptivePromptSelector:
    """自适应提示词选择器"""
    
    def __init__(self):
        self.performance_history = {}
    
    def select_techniques(self, task_analysis: dict) -> list:
        """根据任务特征选择技术"""
        
        techniques = []
        
        # 任务复杂度
        if task_analysis["complexity"] == "high":
            techniques.append("cot")
        
        # 是否需要工具
        if task_analysis["requires_tools"]:
            techniques.append("react")
        
        # 是否需要精确输出
        if task_analysis["needs_structured_output"]:
            techniques.append("structured")
        
        # 风险级别
        if task_analysis["risk_level"] == "high":
            techniques.append("self_consistency")
        
        # 领域专业性
        if task_analysis["domain_specific"]:
            techniques.append("role_based")
        
        # 历史性能
        task_type = task_analysis["type"]
        if task_type in self.performance_history:
            best_techniques = self.performance_history[task_type]["best"]
            techniques = self.merge_techniques(techniques, best_techniques)
        
        return techniques
    
    def record_performance(self, task_type: str, techniques: list, 
                          metrics: dict):
        """记录性能数据"""
        if task_type not in self.performance_history:
            self.performance_history[task_type] = []
        
        self.performance_history[task_type].append({
            "techniques": techniques,
            "metrics": metrics,
            "timestamp": time.now()
        })
        
        # 更新最佳技术组合
        self.update_best_techniques(task_type)

# 使用示例
selector = AdaptivePromptSelector()

# 分析任务
task_analysis = {
    "type": "data_extraction",
    "complexity": "medium",
    "requires_tools": False,
    "needs_structured_output": True,
    "risk_level": "low",
    "domain_specific": True
}

# 选择技术
techniques = selector.select_techniques(task_analysis)
# 输出：["structured", "role_based"]
```

---

## 八、最佳实践与注意事项

### 8.1 提示词设计原则

1. **清晰性原则**
   ```python
   # ✅ 好
   prompt = """
   任务：提取文本中的日期
   输入格式：自由文本
   输出格式：YYYY-MM-DD
   """
   
   # ❌ 差
   prompt = "把日期找出来"
   ```

2. **一致性原则**
   ```python
   # ✅ 好：示例格式一致
   示例1：输入："..." 输出：{...}
   示例2：输入："..." 输出：{...}
   示例3：输入："..." 输出：{...}
   
   # ❌ 差：格式不一致
   示例1：Input: "..." Output: {...}
   示例2：输入："..." 结果：[...]
   示例3："..." → {...}
   ```

3. **最小化原则**
   ```python
   # ✅ 好：只提供必要信息
   prompt = "分析情感：{text}"
   
   # ❌ 差：冗余信息
   prompt = """
   你是一个AI助手，由XXX公司开发...
   （100行无关信息）
   现在分析情感：{text}
   """
   ```

### 8.2 常见陷阱

1. **过度工程**
   ```python
   # ❌ 简单问题复杂化
   simple_question = "1+1=?"
   
   # 使用ToT + Self-Consistency
   # 问题：浪费资源
   ```

2. **示例偏差**
   ```python
   # ❌ 示例不够代表性
   示例1：输入："好" 输出："positive"
   示例2：输入："很好" 输出："positive"
   示例3：输入："非常好" 输出："positive"
   
   # 问题：缺少negative示例
   ```

3. **忽略约束**
   ```python
   # ❌ 没有明确约束
   prompt = "生成代码"
   
   # 可能输出：
   # - Python
   # - JavaScript
   # - Java
   # 不确定
   
   # ✅ 明确约束
   prompt = "生成Python 3.10+代码，使用类型注解"
   ```

### 8.3 性能优化

1. **缓存策略**
   ```python
   class PromptCache:
       def __init__(self):
           self.cache = {}
       
       def get_or_generate(self, prompt_hash: str, 
                          generator: callable):
           if prompt_hash in self.cache:
               return self.cache[prompt_hash]
           
           result = generator()
           self.cache[prompt_hash] = result
           return result
   ```

2. **并行处理**
   ```python
   import asyncio
   
   async def parallel_self_consistency(prompt: str, n: int):
       tasks = [
           llm.generate_async(prompt, temperature=0.7)
           for _ in range(n)
       ]
       results = await asyncio.gather(*tasks)
       return vote_for_best(results)
   ```

3. **Token优化**
   ```python
   def optimize_prompt(prompt: str, max_tokens: int):
       """优化提示词以减少token"""
       
       # 移除冗余空白
       prompt = " ".join(prompt.split())
       
       # 压缩示例（保留关键信息）
       prompt = compress_examples(prompt)
       
       # 使用缩写
       prompt = use_abbreviations(prompt)
       
       return prompt
   ```

---

## 九、未来趋势

### 9.1 自动化提示词工程

2026年的趋势是完全自动化的提示词优化：

```python
class AutoPromptOptimizer:
    """全自动提示词优化器"""
    
    def __init__(self, task_dataset):
        self.dataset = task_dataset
        self.llm = get_llm()
    
    def auto_optimize(self):
        """自动化优化流程"""
        
        # 1. 分析任务特征
        task_features = self.analyze_task()
        
        # 2. 生成候选提示词
        candidates = self.generate_candidates(task_features)
        
        # 3. 在数据集上评估
        ranked = self.evaluate_all(candidates)
        
        # 4. 迭代改进
        best = self.iterative_refinement(ranked[0])
        
        # 5. 部署
        self.deploy(best)
        
        return best
```

### 9.2 多模态提示词

```python
# 多模态CoT
multimodal_prompt = """
图像：[图片数据]
文本："{text}"

让我们一步步分析：
1. 视觉特征：...
2. 文本含义：...
3. 综合理解：...
"""
```

### 9.3 个性化提示词

```python
class PersonalizedPromptEngine:
    """个性化提示词引擎"""
    
    def __init__(self, user_profile: dict):
        self.profile = user_profile
    
    def personalize(self, base_prompt: str) -> str:
        """根据用户画像个性化"""
        
        # 用户偏好
        style = self.profile.get("preferred_style", "formal")
        level = self.profile.get("expertise_level", "intermediate")
        language = self.profile.get("language", "zh-CN")
        
        personalized = f"""
        用户背景：{level}水平
        语言：{language}
        风格偏好：{style}
        
        {base_prompt}
        """
        
        return personalized
```

---

## 十、总结

提示词工程是AI Agent开发的核心技能。本文系统性地介绍了14种提示词技术：

**基础技术**：
1. Zero-Shot - 简单快速
2. Few-Shot - 格式学习
3. Role-Based - 领域专业

**推理增强**：
4. Chain-of-Thought - 逻辑推理
5. Tree-of-Thought - 复杂决策
6. ReAct - 工具调用

**结构化输出**：
7. Structured Output - 数据提取
8. Program-of-Thoughts - 精确计算

**高级技术**：
9. Self-Consistency - 提高可靠性
10. Generated Knowledge - 知识激活
11. Directional Stimulus - 多角度分析
12. APE - 自动优化

**Agent专用**：
13. Multi-Turn - 对话系统
14. Metacognitive - 自我反思

### 关键要点

1. **没有万能技术**：根据任务选择合适的技术组合
2. **平衡成本与质量**：简单问题用简单技术
3. **持续优化**：基于反馈不断改进提示词
4. **注重可解释性**：保留推理过程便于调试
5. **安全第一**：注意隐私保护和恶意输入

### 实践建议

- 从简单技术开始，逐步增加复杂度
- 建立提示词库，积累最佳实践
- 使用A/B测试验证效果
- 记录性能数据，持续优化
- 关注最新研究，保持技术更新

---

## 参考文献

1. Wei et al. "Chain-of-Thought Prompting Elicits Reasoning in LLMs" (2022)
2. Yao et al. "ReAct: Synergizing Reasoning and Acting" (2022)
3. Yao et al. "Tree of Thoughts" (2023)
4. Wang et al. "Self-Consistency Improves CoT Reasoning" (2022)
5. Zhou et al. "Large Language Models Are Human-Level Prompt Engineers" (2022)
6. arXiv:2603.14602 - "$PA^3$: Policy-Aware Agent Alignment through CoT" (2026)
7. arXiv:2603.15402 - "A Closer Look into LLMs for Table Understanding" (2026)
8. arXiv:2603.16867 - "Efficient Reasoning on the Edge" (2026)

---

*本文基于2025-2026年最新研究和实践经验撰写，代码示例参考OpenClaw实现。*

**持续更新中...**
