---
title: Agent 为什么需要自己写正则？
date: 2026-06-21 20:43:00
tags:
  - agent
  - llm
  - regex
  - pattern
categories:
  - AI工程
---

正则表达式是程序员最不想手写、又不得不手写的东西之一。语法诡异、调试痛苦、改一行炸一片。但在 Agent 系统里，让 LLM 生成正则这件事，不只是"帮我写个 pattern"这么简单——它改变了 Agent 和非结构化数据打交道的方式。

## 先说问题：Agent 遇到非结构化数据怎么办？

Agent 的输入经常是混乱的：用户消息、日志文件、网页抓取内容、API 返回的半结构化文本。你需要从里面提取信息——邮箱、日期、金额、SKU 编号、错误码。

传统做法是硬编码正则。但硬编码有三个硬伤：

1. **你不知道用户会碰到什么格式**。提前穷举不现实。
2. **格式会变**。上游系统改了输出，你的正则就废了。
3. **维护成本高**。正则写完没人敢动，因为没人看得懂。

LLM 生成正则，解决的正是这三个问题。

## LLM 生成正则的三种应用场景

### 场景一：动态数据提取

Agent 运行时才知道要提取什么、从什么格式的文本里提取。

典型例子：一个日志分析 Agent，用户说"帮我从这堆日志里把所有超时的请求 ID 找出来"。你不可能提前知道日志格式——不同服务的日志格式千奇百怪。

```python
# 用户输入
log_sample = """
[2026-06-21 14:32:01] INFO  req-8842a completed in 45ms
[2026-06-21 14:32:03] ERROR req-9913b timed out after 30000ms
[2026-06-21 14:32:05] WARN  req-4421c slow response 8500ms
[2026-06-21 14:32:07] ERROR req-7732f timed out after 60000ms
"""

# Agent 调用 LLM 生成正则
regex_prompt = f"""
根据以下日志样本，生成一个正则表达式，提取所有超时请求的请求ID。
超时的标志是 "timed out" 关键字。请求ID格式为 req-XXXXx。

日志样本：
{log_sample}

只返回正则表达式，不要解释。
"""

pattern = llm.chat(regex_prompt)  # → r"req-[a-z0-9]+(?=.*timed out)"
```

关键点：正则是根据实际数据样本动态生成的，不是提前写死的。换一种日志格式，LLM 会生成不同的正则。

### 场景二：意图识别的轻量路由

Agent 需要对用户输入做分类路由。全扔给 LLM 分类当然可以，但每次推理都有成本和延迟。对于高频的、模式固定的意图，用正则做第一层过滤，LLM 只处理漏网之鱼。

```typescript
// Agent 启动时，让 LLM 根据已知意图模式生成正则路由表
const intents = [
  { name: "query_order", examples: ["查订单", "我的订单到哪了", "订单号XX"] },
  { name: "refund", examples: ["退款", "我要退货", "把钱退给我"] },
  { name: "complaint", examples: ["投诉", "你们服务太差了", "要告你们"] },
];

const patterns = await llm.generateRegexRoutes(intents);
// → {
//     query_order: /查订单|订单[号状态]|到哪了|物流/,
//     refund: /退款|退货|退钱|退给我/,
//     complaint: /投诉|举报|差评|服务差|告/,
//   }

// 运行时：正则先筛，筛不中再过 LLM
function routeIntent(input: string) {
  for (const [intent, pattern] of Object.entries(patterns)) {
    if (pattern.test(input)) return intent;
  }
  return llm.classify(input);  // fallback
}
```

这种模式的技术价值在于**成本分层**：高频路径走正则（零成本、微秒级），低频路径走 LLM（有成本、秒级）。

### 场景三：数据校验和清洗

Agent 从外部系统获取的数据经常是脏的。格式不规范、字段混在一起、编码问题。LLM 可以根据样本数据生成清洗正则，把脏数据变成结构化数据。

```python
dirty_data = """
价格：￥1,299.00  |  折后：¥999
售价: 2399元     |  会员价：1,899
"""

clean_prompt = f"""
从以下文本中提取所有价格数字（包含小数和千分位），返回正则。
样本：
{dirty_data}

只返回正则。
"""

# → r"[¥￥]?\s?([\d,]+\.?\d*)\s?[元]?"
```

这比手写正则强在哪？你不需要提前知道所有可能的价格格式——人民币符号可能是全角半角、可能有千分位、可能带"元"可能不带。LLM 看了样本就能覆盖。

## 技术价值：不只是"帮我写个正则"

### 1. 正则是 LLM 输出的可审计中间产物

这是最被低估的价值。

LLM 直接返回结构化 JSON 当然可以，但你无法审计它的提取逻辑——它为什么提取了这个字段而不是那个？不知道。

LLM 生成正则，正则是一个**可读、可审计、可版本化**的中间产物。你可以：

- 检查正则是否合理
- 把正则存下来，下次复用
- 对比不同版本的正则差异
- 用正则做单元测试

```typescript
// 可审计的提取流水线
const extraction = {
  id: "ext_order_id_v3",
  source: "log_parser",
  pattern: await llm.generateRegex(sample, instruction),  // LLM 生成
  createdAt: "2026-06-21",
  accuracy: 0.97,  // 跑测试集得到的准确率
  sampleSize: 500,
};

// 正则可以进 git，可以 code review
// LLM 的推理过程不能
```

### 2. 正则是"编译后"的 LLM 能力

把 LLM 当正则生成器用，本质上是把 LLM 的语义理解能力**编译**成确定性的执行逻辑。

```
LLM（慢、贵、不确定） → 生成正则 → 正则引擎（快、免费、确定）
```

一次 LLM 调用，换来无数次确定性执行。这是典型的 amortize cost 模式——用一次重的推理成本，换取持续的轻量执行。

和直接让 LLM 每次都提取对比：

| 维度 | LLM 每次提取 | LLM 生成正则后用正则提取 |
|------|------------|----------------------|
| 延迟 | 500ms-2s | <1ms |
| 成本 | 每次 $0.001-0.01 | 一次 $0.001，后续 $0 |
| 确定性 | ❌ | ✅ |
| 灵活性 | ✅ 适应新格式 | ❌ 需要重新生成 |

适合用正则的场景：格式相对固定、提取频率高。适合每次用 LLM 的场景：格式经常变、提取频率低。

### 3. 正则生成 + 验证形成闭环

正则可以跑测试集验证，LLM 的直接输出不容易。这给了一个自然的迭代闭环：

```
样本数据 → LLM 生成正则 → 跑测试集 → 准确率 < 阈值？
      ↑                                    │
      └──── 反馈错误case，重新生成 ←───────┘
```

```python
def generate_validated_regex(samples, test_cases, max_retries=3):
    for attempt in range(max_retries):
        pattern = llm.generate_regex(samples)
        
        passed = 0
        failed_cases = []
        for case in test_cases:
            result = re.findall(pattern, case.input)
            if result == case.expected:
                passed += 1
            else:
                failed_cases.append({
                    "input": case.input,
                    "expected": case.expected,
                    "got": result,
                })
        
        accuracy = passed / len(test_cases)
        if accuracy >= 0.95:
            return pattern, accuracy
        
        # 把失败 case 喂回去，让 LLM 修正
        samples = f"{samples}\n\n以下case提取失败，请修正：\n{failed_cases}"
    
    return pattern, accuracy  # 重试次数用完，返回最好的结果
```

这个闭环是纯 LLM 提取做不到的——你没法用单元测试来约束 LLM 的每次推理输出，但你可以用单元测试来约束一个正则表达式。

### 4. 正则是跨 Agent 的契约

多个 Agent 协作时，正则可以作为数据提取的共享契约。Agent A 生成正则，Agent B 使用正则——B 不需要调 LLM，也不需要理解提取逻辑，只需要跑正则。

```
Agent A（日志专家）：分析日志格式 → 生成提取正则 → 发布到共享 registry
Agent B（告警专家）：从 registry 取正则 → 提取关键字段 → 触发告警规则
Agent C（统计专家）：从 registry 取正则 → 提取指标 → 生成报表
```

一次生成，多方复用。而且正则的语义比 JSON schema 更精确——JSON schema 告诉你"这个字段是 string"，正则告诉你"这个 string 长什么样"。

## LLM 生成正则的坑

### 1. LLM 生成的正则经常有 bug

这是最大的问题。LLM 对正则语法的掌握并不完美，尤其是：

- **贪婪/非贪婪**：该用 `.*?` 的地方用了 `.*`，吃掉太多内容
- **边界条件**：忘了 `^$` 或 `\b`，匹配了不该匹配的
- **特殊字符**：该转义没转义，不该转义转了
- **回溯灾难**：嵌套量词导致 catastrophic backtracking

所以**必须有验证层**。不能 LLM 吐一个正则就直接用，得跑测试集。

### 2. 样本偏差

LLM 生成的正则只覆盖它看到的样本。如果你的样本不够有代表性，正则就会漏掉边界情况。

解决方案：除了正样本，还要给负样本——"这些不应该被匹配"。这让 LLM 对边界更敏感。

```python
prompt = f"""
生成正则，匹配以下正样本，不匹配以下负样本。

正样本：
{positive_samples}

负样本（不应匹配）：
{negative_samples}
"""
```

### 3. 复杂正则不可读

LLM 有时会生成一个很长的、没人看得懂的正则。这和手写正则的问题一样，但 LLM 生成的往往更长——因为它倾向于把所有边界情况都塞进一个 pattern。

解决方案：**拆分正则**。不要一个正则干所有事，拆成多个简单的正则，每个只处理一种模式。

```python
# ❌ 一个正则吃天下
pattern = r"(?:\+?86[-\s]?1[3-9]\d{9})|(?:\d{3}[-\s]\d{4}[-\s]\d{4})|(?:\(\d{3}\)\s?\d{3}-\d{4})"

# ✅ 拆成多个简单正则
patterns = {
    "mobile_cn": r"\+?86[-\s]?1[3-9]\d{9}",
    "phone_with_dash": r"\d{3}[-\s]\d{4}[-\s]\d{4}",
    "phone_with_paren": r"\(\d{3}\)\s?\d{3}-\d{4}",
}
```

### 4. 安全风险

如果 LLM 生成的正则直接用在生产环境的输入上，可能有 ReDoS 风险。LLM 不关心正则引擎的回溯行为，它只关心"能不能匹配"。

解决方案：

- 用有回溯限制的正则引擎（Rust 的 `regex` crate、Go 的 `regexp`、RE2）
- 对 LLM 生成的正则做静态分析，检测危险模式（嵌套量词、重叠交替组）
- 设置匹配超时

## 实践建议

### 什么时候用 LLM 生成正则

- ✅ 格式多样、难以穷举的数据提取（日志、网页、文档）
- ✅ 高频调用的意图路由，需要把 LLM 推理成本摊薄
- ✅ 需要可审计、可版本化的提取逻辑
- ✅ 多 Agent 共享数据提取契约

### 什么时候别用

- ❌ 格式已知且固定（手写更可靠）
- ❌ 正则匹配的输入不可信且有 ReDoS 风险
- ❌ 需要理解语义才能提取的场景（"客户对价格不满意"这种，正则搞不定）

### 生成流水线的最小可靠设计

```
1. 收集样本（正样本 + 负样本，至少各 10 条）
2. LLM 生成正则
3. 跑测试集验证（准确率 < 95% 则把错误 case 喂回 LLM 重试）
4. 静态分析检测 ReDoS 风险
5. 存入正则 registry，标记版本和准确率
6. 运行时用正则提取，监控匹配率——匹配率突然下降说明格式变了，触发重新生成
```

## 一句话

LLM 生成正则的核心价值不是"省得手写"——而是把 LLM 的语义理解能力编译成确定性逻辑，用一次推理换无数次执行，用可审计的中间产物替代黑盒输出。在 Agent 系统里，这意味着更低的成本、更快的响应、更好的可维护性。前提是：别裸跑，加验证。
