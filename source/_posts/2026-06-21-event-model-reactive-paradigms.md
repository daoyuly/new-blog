---
title: 事件·LLM·状态机·响应式：四种驱动范式的骨相
date: 2026-06-21 14:20:00
tags:
  - architecture
  - event-driven
  - model-driven
  - state-machine
  - reactive
  - paradigm
categories:
  - 技术架构
---

做系统设计时，"事件驱动""模型驱动""响应式驱动""状态机驱动"这几个词经常被混着用。它们确实有交集，但骨子里的思考方式完全不同。这篇从技术机制出发，把这些范式的异同讲清楚。

## 四种驱动，驱动的是什么？

先回答一个很多人没想过的问题：**驱动的是什么？**

- **事件驱动**——驱动的是**控制流**。系统等着事情发生，事情发生了就执行对应逻辑。重点是"什么时候做"。
- **模型驱动**——驱动的是**语义理解与推理**。把决策权交给大语言模型，由模型理解意图、生成方案、执行动作。重点是"怎么想"。
- **响应式驱动**——驱动的是**数据流**。数据变了，依赖它的计算自动更新。重点是"变了之后怎样"。
- **状态机驱动**——驱动的是**合法状态空间**。系统只能在预定义的状态之间转换，非法转换直接被拒绝。重点是"能变成什么"。

四种范式解决的是不同层面的问题，所以它们不是互斥的——一个系统可以同时是事件驱动的、状态机驱动的、也是响应式的。模型驱动（LLM 驱动）是一种全新的决策策略，状态机驱动是一种约束策略。

## 事件驱动：当 X 发生，就做 Y

### 核心机制

事件驱动的本质是**解耦生产者和消费者**。生产者发出事件，不关心谁来消费；消费者订阅事件，不关心谁产生的。

```
┌──────────┐     event      ┌──────────────┐     event      ┌──────────┐
│ Producer │ ──────────────→ │  Event Bus   │ ──────────────→│ Consumer │
│ (A服务)  │                 │ (Kafka/MQ)   │                │ (B服务)  │
└──────────┘                 └──────┬───────┘                └──────────┘
                                    │
                              ┌─────┴─────┐
                              ▼           ▼
                        ┌──────────┐ ┌──────────┐
                        │Consumer C│ │Consumer D│
                        └──────────┘ └──────────┘

流程：状态变化 → 发布事件 → 路由分发 → 订阅者处理 → 可能产生新事件
```

关键原语：

| 原语 | 作用 | 典型实现 |
|------|------|---------|
| Event | 状态变化的信号 | 领域事件、命令、通知 |
| Broker | 事件路由和持久化 | Kafka、RabbitMQ、EventBridge |
| Handler | 事件的处理逻辑 | Event Listener、Saga、Processor |
| Schema | 事件的契约 | Schema Registry、Avro、Protobuf |

### 处理模式

事件驱动的处理有几种经典模式：

**1. 简单通知**

```python
# 最朴素的形式：回调
def on_order_created(event):
    send_confirmation_email(event.order_id)

event_bus.subscribe("order.created", on_order_created)
```

**2. 事件溯源（Event Sourcing）**

不存当前状态，存所有发生过的事件。要算当前状态？重放。

```python
class Order:
    def __init__(self):
        self.state = "new"
        self.events = []

    def apply(self, event):
        self.events.append(event)
        if event.type == "order_created":
            self.state = "pending"
        elif event.type == "payment_received":
            self.state = "paid"
        elif event.type == "order_shipped":
            self.state = "shipped"
```

事件溯源的好处是天然有审计日志，坏处是重放成本可能很高。

**3. Saga 编排**

跨服务的事务协调，用事件串联，不用分布式锁。

```
Order Service → [order_created] → Payment Service
Payment Service → [payment_completed] → Inventory Service
Inventory Service → [inventory_reserved] → Shipping Service
```

出错了就发补偿事件，往回滚。

### 事件驱动的坑

- **最终一致性**：事件是异步的，系统状态不会立即一致。很多人嘴上说理解了，上线后还是按强一致性的预期在调试。
- **事件乱序**：同一个聚合的多个事件可能乱序到达。解决方案：版本号、因果链、或分区键保证局部有序。
- **事件风暴**：一个事件触发 N 个 handler，每个 handler 又发事件，很快你就不知道系统在干什么了。需要有意识地限制事件扇出。
- **Schema 演进**：事件的格式会变，旧事件还在 Kafka 里。必须做好向后兼容。

## 模型驱动：让 LLM 来想

### 核心机制

这里的"模型"就是大语言模型（LLM）。模型驱动的本质是：**不再由程序员穷举所有分支逻辑，而是把上下文扔给模型，让模型理解意图、推理决策、生成行动**。

```
┌────────────┐    context+intent    ┌─────────────┐    tool_call/output    ┌────────────┐
│  用户输入   │ ──────────────────→ │    LLM      │ ─────────────────────→│  执行层    │
│ "帮我退了"  │                      │  (推理引擎) │                       │ (API/DB)   │
└────────────┘                      └──────┬──────┘                       └─────┬──────┘
                                           │                                     │
                                      ┌────┴────┐                          │
                                      ▼         ▼                          │
                                 [工具选择]  [直接输出]                      │
                                      │                                     │
                                      └───────── 执行结果反馈 ──────────────┘

流程：用户意图 → 拼装上下文 → LLM 推理 → 选择工具/生成回复 → 执行 → 结果反馈
```

这和前三种范式有根本区别：事件驱动、状态机驱动、响应式驱动的逻辑都是确定性的——相同的输入永远产生相同的输出。LLM 驱动的逻辑是概率性的——同样的 prompt，两次调用的结果可能不同。

### 三种 LLM 驱动模式

**1. Prompt-Only 模式**

最简单的方式：把需求描述清楚，让模型直接输出结果。

```python
response = llm.chat("""
你是一个订单处理助手。用户说："{user_input}"
当前订单状态：{order_status}
请判断用户意图，返回 JSON：
{"action": "pay" | "cancel" | "ship" | "query", "confidence": 0-1}
""")
```

好处是灵活，坏处是不可控。模型可能返回一个你根本没预料到的 action。

**2. Tool Use / Function Calling 模式**

给模型一组工具，让它决定调哪个。

```typescript
const tools = [
  {
    name: "reserve_inventory",
    description: "为订单预留库存",
    parameters: { orderId: "string", items: "array" },
  },
  {
    name: "process_refund",
    description: "处理退款",
    parameters: { orderId: "string", amount: "number" },
  },
  {
    name: "query_order_status",
    description: "查询订单状态",
    parameters: { orderId: "string" },
  },
];

// LLM 决定调用哪个工具
const result = await llm.chatWithTools({
  messages: [{ role: "user", content: userInput }],
  tools,
  context: { orderStatus, orderItems },
});

// result.tool_calls = [{ name: "reserve_inventory", args: { orderId: "123", items: [...] } }]
```

这是目前 Agent 系统的主流模式。模型负责"想"，工具负责"做"，两者解耦。

**3. 规划-执行模式（Plan-and-Execute）**

复杂任务拆成多步规划，逐步执行。

```python
# 第一步：规划
plan = llm.chat("""
任务：{task}
可用工具：{tool_descriptions}
请制定执行计划，返回步骤列表：
[
  {"step": 1, "tool": "...", "reason": "..."},
  {"step": 2, "tool": "...", "reason": "..."},
  ...
]
""")

# 第二步：逐步执行，每步结果反馈给模型
for step in plan.steps:
    result = execute_tool(step.tool, step.args)
    # 中间结果可以用来调整后续计划
    updated_plan = llm.chat(f"步骤 {step.step} 的结果是：{result}，请调整后续计划")
```

LangChain 的 Plan-and-Execute Agent、AutoGPT、BabyAGI 都是这种模式。

### 模型驱动的核心价值

LLM 驱动解决的是其他三种范式都解决不了的问题：**开放域的语义理解**。

- 事件驱动能处理已知的事件类型，但用户说"我想把那个退了"，你得先把它映射成 `CANCEL` 事件
- 状态机能拒绝非法转换，但它不知道用户"那个"指的是哪个订单
- 响应式能传播数据变更，但它不理解"帮我处理一下退款"是什么意思

LLM 驱动填的就是这个坑——**把模糊的自然语言意图，转化成精确的系统操作**。

### 模型驱动的坑

- **不确定性**：同一个用户输入，两次调用的结果可能不同。对金融、医疗等场景，这是硬伤。解决方案：加约束（constrained decoding）、加校验（output validation）、加重试。
- **成本**：每次推理都在烧 token。一个高并发的客服系统，如果每个请求都过一遍 LLM，账单会很难看。解决方案：缓存高频 pattern、用小模型做路由、只在关键决策点用大模型。
- **延迟**：LLM 推理是秒级的，事件驱动的 handler 是毫秒级的。对实时性要求高的场景，不能每步都过模型。
- **幻觉**：模型可能编造不存在的工具调用、捏造订单号、给出矛盾的状态判断。必须在 LLM 输出和系统执行之间加一层**守卫层（guardrail）**。
- **可解释性差**：模型为什么选了 A 而不是 B？你只能看 logprob，但那不等于理由。审计和合规场景会很难受。

### 守卫层：LLM 驱动不是裸跑

生产环境下，LLM 的输出不能直接执行，必须过守卫层。这正是 LLM 驱动和状态机驱动天然互补的地方：

```typescript
// LLM 输出 → 状态机校验 → 执行
const llmDecision = await llm.decide(userInput, context);

// 状态机守卫：LLM 说要 CANCEL，但当前状态允许吗？
const guard = fsm.canTransition(order.status, llmDecision.action);
if (!guard.ok) {
  // 拒绝 LLM 的决策，回退到安全路径
  return { error: `Cannot ${llmDecision.action} from ${order.status}` };
}

// 校验通过，执行
executeAction(llmDecision.action, llmDecision.args);
```

LLM 管语义理解，状态机管合法性约束。一个负责"听懂人话"，一个负责"别搞砸了"。

## 状态机驱动：只允许合法的存在

### 为什么要把状态机单拎出来？

你可能会问：状态机不就是一套转换规则吗，值得和事件驱动、LLM 驱动并列？值得。因为状态机驱动的核心贡献不是"表达业务"，而是**约束系统的合法行为空间**。LLM 驱动让系统变聪明了，但也变不可控了——状态机驱动就是那个刹车。

### 核心机制

状态机驱动的本质是**穷举所有合法状态，显式定义转换，拒绝一切未声明的变迁**。

```
                    ┌──────────────────────────────────────────────┐
                    │              状态转换表 δ                      │
                    │                                              │
  输入事件          │  (pending, PAY)    → paid      ✅            │
  ────────→   查表  │  (pending, CANCEL) → cancelled ✅            │
  当前状态          │  (paid, CANCEL)    → cancelled ✅            │
  pending          │  (paid, PAY)       → ❌ undefined  拒绝!     │
                    └──────────────────────────────────────────────┘

     ┌─────────┐  PAY   ┌───────┐  SHIP  ┌─────────┐
     │ pending │───────→│ paid  │───────→│ shipped │
     └────┬────┘        └───┬───┘        └────┬────┘
          │                 │                  │
     CANCEL            CANCEL            COMPLETE
          │                 │                  │
          ▼                 ▼                  ▼
     ┌───────────┐    ┌───────────┐     ┌───────────┐
     │ cancelled │    │ cancelled │     │ completed │
     └───────────┘    └───────────┘     └───────────┘

流程：输入事件 → 查转换表 → 合法则转换状态 → 执行entry/exit动作
                       → 非法则拒绝
```

形式化定义：一个 FSM 是一个五元组 `(S, Σ, δ, s₀, F)`：
- S：有限状态集合
- Σ：输入事件（字母表）
- δ：转换函数 S × Σ → S
- s₀：初始状态
- F：接受状态集合

关键在于 δ 是**全定义**的——任何未定义的 (状态, 事件) 组合都是非法的，系统直接拒绝或报错，而不是"忽略"或"容错处理"。

### 状态机驱动的三种层级

**1. 实体级状态机**

最常见的用法：一个业务实体有自己的状态机。

```typescript
// 订单实体的状态机定义
const orderFSM = defineFSM({
  initial: "draft",
  states: {
    draft:    { on: { SUBMIT: "pending" } },
    pending:  { on: { APPROVE: "approved", REJECT: "rejected" } },
    approved: { on: { FULFILL: "fulfilled", CANCEL: "cancelled" } },
    rejected: { type: "final" },
    fulfilled: { type: "final" },
    cancelled: { type: "final" },
  },
});

// 运行时：非法转换直接抛错
orderFSM.transition("draft", "APPROVE");  // ❌ Error: invalid transition
orderFSM.transition("draft", "SUBMIT");   // ✅ → "pending"
orderFSM.transition("pending", "APPROVE");// ✅ → "approved"
```

这比 if-else 强在哪？if-else 的默认行为是"什么都不做"——非法输入被静默吞掉。状态机的默认行为是"报错"——非法输入被显式拒绝。

**2. 协议级状态机**

网络协议的精髓就是状态机。TCP 连接管理、TLS 握手、HTTP/2 流生命周期，全是用状态机定义的。

```
TCP 状态机（简化）:
CLOSED → SYN_SENT → ESTABLISHED → FIN_WAIT_1 → FIN_WAIT_2 → TIME_WAIT → CLOSED
```

协议级状态机的好处是**可验证**。你可以用模型检查工具（如 TLA+、SPIN）形式化验证协议的正确性——有没有死锁、有没有活锁、有没有不可达状态。这是 if-else 做不到的。

**3. 系统级状态机**

整个系统的宏观行为用状态机描述。比如 Kubernetes 的 Pod 生命周期：

```
Pending → ContainerCreating → Running → Succeeded / Failed
                                     ↘ CrashLoopBackOff ↙
```

系统级状态机不只是文档——Kubernetes 的 controller 逻辑本质上就是根据当前状态和期望状态的差异做转换。声明式 API + 状态机驱动的 reconciliation loop，这是 K8s 架构的核心。

### 状态机驱动 vs 事件驱动：关键区分

这两种范式最容易混淆。简单讲：

- **事件驱动**关心"事件来了怎么处理"，handler 的逻辑是自由的
- **状态机驱动**关心"当前状态下哪些事件是合法的"，转换是受限的

```typescript
// 事件驱动：什么事件都能处理，逻辑自己判断
eventBus.on("APPROVE", (e) => {
  if (order.status === "pending") {
    order.status = "approved";
  }
  // 如果不是 pending？默默跳过。或者忘了判断？bug。
});

// 状态机驱动：只有合法转换能通过
fsm.transition(currentState, "APPROVE");  // 如果 currentState 不是 pending，直接报错
```

事件驱动是**开放世界假设**——来了就处理；状态机驱动是**封闭世界假设**——没声明的就不行。

### 状态机驱动的进阶模式

**层级状态机（HFSM）**

状态可以嵌套。订单在"已支付"状态下，物流可能有子状态机：拣货→打包→出库→运输→签收。

```typescript
const orderMachine = createMachine({
  initial: "pending",
  states: {
    pending: { on: { PAY: "paid" } },
    paid: {
      initial: "picking",
      states: {
        picking:   { on: { PICK_DONE: "packing" } },
        packing:   { on: { PACK_DONE: "shipped" } },
        shipped:   { on: { DELIVER: "delivered" } },
        delivered: { type: "final" },
      },
      on: { CANCEL: "cancelled" },  // 子状态任意时刻都可以取消
    },
    cancelled: { type: "final" },
  },
});
```

层级状态机解决了平面状态机的状态爆炸问题。一个 10 状态的实体有 5 个子状态，平面状态机要 50 个状态，HFSM 只要 10 + 5。

**并行状态机**

同一实体可以同时处于多个正交的状态维度。

```
订单 = 支付状态 × 物流状态 × 退款状态

支付: unpaid | paid | refunded
物流: not_shipped | shipped | delivered
退款: none | requested | processing | done
```

三个维度独立演进，组合起来有 3×3×4 = 36 种状态。用平面状态机定义 36 个状态和转换是噩梦，用并行状态机只需定义 3 个独立的状态机。

**持久化状态机**

状态机的状态需要持久化——服务重启后能恢复到正确的状态。这和事件溯源天然适配：事件是转换的输入，状态机是转换的规则，当前状态是 fold 的结果。

```typescript
// 从事件流重建状态机
const events = await eventStore.getEvents(orderId);
const machine = createOrderMachine();
const restored = events.reduce(
  (state, event) => machine.transition(state, event.type),
  machine.initialState
);
```

### 状态机驱动的坑

- **状态爆炸**：状态维度多了，组合状态指数增长。必须用层级和并行来控制。
- **转换副作用**：状态机本身应该是纯函数——(状态, 事件) → 状态。副作用（发通知、调 API）放在 entry/exit action 里，别放在转换逻辑里。否则状态机的可推导性就废了。
- **分布式一致性**：单个实例的状态机很简单。多个实例操作同一个实体呢？乐观锁、悲观锁、还是事件溯源？这是架构决策，不是状态机能解决的。
- **过度设计**：两个状态的实体不需要状态机，一个布尔值就够了。别为了"架构优雅"硬上 FSM。

## 响应式驱动：数据变了，世界跟着变

### 核心机制

响应式驱动的本质是**声明式数据依赖 + 自动传播变更**。你定义数据之间的关系，当输入变了，输出自动更新。

```
  ┌──────────┐   map    ┌────────────┐  debounce  ┌─────────────┐  switchMap ┌──────────┐
  │ 源数据流  │────────→│ 中间流 A   │───────────→│ 中间流 B    │───────────→│ 最终流   │
  │ (click$) │         │ (value$)   │            │ (query$)    │           │ (result$)│
  └──────────┘         └────────────┘            └─────────────┘           └─────┬────┘
                                                                         │
                                                                    subscribe
                                                                         │
                                                                         ▼
  依赖图：source → operator → operator → ... → subscriber
  传播：任一节点值变化 → 自动向下游推送 → 所有依赖者更新

流程：数据源产生值 → 经operator管道变换 → 订阅者消费 → 副作用执行
```

关键概念：

| 概念 | 含义 |
|------|------|
| Observable | 可观察的数据源 |
| Observer | 数据的消费者 |
| Operator | 数据的变换管道 |
| Scheduler | 执行上下文的调度器 |
| Backpressure | 消费速度跟不上生产速度时的流控 |

### 三种响应式

"响应式"这个词在技术圈有三个不同层面的含义，容易混淆：

**1. 响应式编程（Reactive Programming）**

编程范式，核心是数据流和变更传播。RxJS、Reactor 是代表。

```typescript
// RxJS: 搜索框防抖 + 联想
const suggestions$ = fromEvent(searchInput, 'input').pipe(
  map(e => e.target.value),
  debounceTime(300),
  distinctUntilChanged(),
  switchMap(query => fetchSuggestions(query))
);

suggestions$.subscribe(renderSuggestions);
```

**2. 响应式系统（Reactive System）**

架构风格，用 Reactive Manifesto 定义：即时响应、回弹性、弹性伸缩、消息驱动。Akka、Vert.x 是代表。

四条原则：
- **Responsive**：系统及时响应
- **Resilient**：出故障了还能响应
- **Elastic**：负载变了能自动伸缩
- **Message Driven**：异步消息通信

注意最后一条——响应式系统本身就是消息驱动的，和事件驱动有交集。

**3. 响应式 UI（Reactive UI）**

前端框架的事：数据变了，UI 自动更新。React、Vue、SolidJS 都在这个范畴。

```typescript
// SolidJS: 细粒度响应式
const [count, setCount] = createSignal(0);

// count() 变了，这个 p 自动更新
<p>{count()}</p>
```

这三种"响应式"共享同一个内核——**声明依赖，自动更新**——但解决的问题域和实现方式差异很大。

### 响应式驱动的坑

- **学习曲线陡**：Rx 的操作符上百个，`switchMap`/`mergeMap`/`concatMap`/`exhaustMap` 的区别能面试倒一片人。
- **调试困难**：数据流是隐式传播的，调用栈不直观。Reactive 社区自己都承认这是最大痛点。
- **过度响应**：一个变量变了，级联触发 N 层更新，性能爆炸。React 的 `useMemo`/`useCallback` 本质上就是在手动控制这个。
- **Backpressure**：生产者比消费者快怎么办？丢数据？缓存？背压？每个选择都有代价。

## 四者的关系：不是四选一

先看一张全景对比图：

```
┌─────────────┬──────────────┬──────────────┬──────────────┬──────────────┐
│             │  事件驱动     │  LLM 驱动    │  状态机驱动   │  响应式驱动   │
├─────────────┼──────────────┼──────────────┼──────────────┼──────────────┤
│ 驱动对象     │  控制流       │  语义推理     │  合法状态空间 │  数据流       │
│ 核心问题     │  什么时候做   │  怎么想       │  能变成什么   │  变了之后怎样 │
│ 确定性       │  ✅ 确定      │  ❌ 概率性    │  ✅ 确定      │  ✅ 确定      │
│ 输入         │  事件         │  自然语言+上下文│ 状态+事件    │  数据变更     │
│ 输出         │  副作用/新事件│  工具调用/文本 │  新状态/拒绝  │  新值/副作用  │
│ 解耦方向     │  生产者⇆消费者│  意图⇆执行    │  状态⇆转换   │  数据源⇆消费者│
│ 时间语义     │  隐式排序     │  推理轮次     │  状态变迁     │  数据流序列   │
│ 默认行为     │  处理         │  生成         │  拒绝         │  传播         │
│ 典型退化     │  事件风暴     │  Agent失控    │  状态爆炸     │  级联更新     │
│ 可验证性     │  中           │  低           │  高(可形式化) │  中           │
│ 代表实现     │  Kafka        │  GPT/Claude  │  XState/Akka │  RxJS/Reactor │
└─────────────┴──────────────┴──────────────┴──────────────┴──────────────┘
```

```
四范式协作全景：

  用户自然语言输入
        │
        ▼
  ┌──────────┐  理解意图  ┌──────────────┐  校验合法性  ┌──────────────┐
  │ LLM 驱动 │──────────→│ 状态机守卫    │────────────→│ 确定性执行    │
  │ (怎么想) │           │ (能做什么)    │             │              │
  └──────────┘           └──────┬───────┘             │              │
                               │                     │              │
                               │ 合法操作             │              │
                               ▼                     ▼              │
                         ┌──────────┐          ┌──────────┐         │
                         │事件驱动  │──────────→│响应式驱动 │─────────→│
                         │(怎么传)  │  事件分发  │(怎么更新) │  数据传播 │
                         └──────────┘          └──────────┘         │
                                                                       ▼
                                                                    用户看到结果
```

这四种范式不是互斥的。来看它们怎么组合。

### 事件驱动 + 响应式

这是最常见的组合。事件驱动管架构层面的通信，响应式管局部数据流的传播。

```
微服务 A → [事件] → 微服务 B 内部用响应式处理
                         ↓
                    Observable → Operator → Observer
```

Kafka + Project Reactor 就是这个组合的标准答案。

### 模型驱动 + 事件驱动

模型引擎的执行过程本身就可以事件化。状态机每次状态转换发一个领域事件，外部系统订阅这些事件做后续处理。

```python
def on_state_change(self, event):
    event_bus.publish(f"order.{event.source}_to_{event.dest}", event)

# 外部系统订阅
event_bus.subscribe("order.paid_to_shipped", trigger_logistics)
```

### 模型驱动（LLM）+ 事件驱动

LLM 的输出天然适合发事件。模型理解了用户意图后，把决策结果发到事件总线，下游服务订阅处理。

```typescript
// LLM 理解意图 → 发布领域事件
const intent = await llm.classify(userInput);
eventBus.publish(`order.${intent.action}`, { orderId, userId, ...intent.args });

// 下游服务照常处理
eventBus.on("order.cancel", handleCancel);
```

LLM 管语义→事件管分发，职责清晰。而且事件总线的 Schema 可以作为 LLM 输出的约束——你让模型从已知事件类型里选，比让它自由发挥安全得多。

这是最自然的组合。事件是状态机转换的输入，状态机是事件处理的守门人。事件来了，先问状态机"这个转换合法吗"，合法才执行。

```typescript
eventBus.on("APPROVE", (e) => {
  const order = orderStore.get(e.orderId);
  const result = orderFSM.transition(order.status, "APPROVE");
  if (result.ok) {
    orderStore.update(e.orderId, { status: result.state });
    // 发布领域事件
    eventBus.publish("order.approved", { orderId: e.orderId });
  } else {
    // 非法转换，记录或告警
    logger.warn(`Invalid transition: ${order.status} + APPROVE`);
  }
});
```

事件驱动管通信，状态机管约束。一个管"消息怎么流转"，一个管"什么操作是合法的"。

### 三者融合

一个完整的业务系统可以同时使用三种范式：

1. **事件驱动**作为系统间通信的基础设施
2. **模型驱动（LLM）**作为语义理解和意图推理的决策层
3. **状态机驱动**作为实体行为的约束框架
4. **响应式驱动**作为数据处理和 UI 层的编程模型

```
[用户输入] → [LLM 语义理解] → [状态机校验] → [事件总线] → [响应式数据流] → [UI]
               ↑                     ↑              ↑                ↑
           意图推理              合法性守卫      系统间通信       数据传播 + 渲染
```

## 选型决策：什么时候用什么

| 场景 | 推荐范式 | 原因 |
|------|---------|------|
| 微服务间解耦通信 | 事件驱动 | 天然解耦，支持异构系统 |
| 审计日志 / 时序数据 | 事件驱动 + Event Sourcing | 事件本身就是日志 |
| 复杂状态流转（订单、工单） | 状态机驱动 | 精确定义合法转换，拒绝非法操作 |
| 模糊意图识别 / 自然语言交互 | 模型驱动（LLM） | LLM 能理解语义，其他范式不能 |
| 可配置业务规则（促销、定价） | 规则引擎 / LLM | 规则明确用引擎，规则模糊用 LLM |
| 实时数据流处理 | 响应式驱动 | 流式处理是它的主场 |
| 前端交互密集 | 响应式驱动 | 声明式 UI 更高效 |
| 协议实现 / 网络通信 | 状态机驱动 | 协议本身就是状态机定义 |
| 需要形式化验证的关键系统 | 状态机驱动 | 可用 TLA+/SPIN 验证 |
| IoT / 传感器数据 | 事件驱动 + 响应式 | 事件入口 + 流式处理 |

一个简单的判断方法：

- 如果你的问题里有"当...发生时"→ 事件驱动
- 如果你的问题里有"根据...规则"→ 模型驱动
- 如果你的问题里有"只能从A到B，不能到C"→ 状态机驱动
- 如果你的问题里有"...变了就更新"→ 响应式驱动

## 实现层面的共同挑战

四种范式虽然思想不同，落地时有些坑是共通的：

### 1. 一致性

事件驱动最终一致，响应式也做不到强一致（除非用同步等待），LLM 驱动的输出本身就不确定，状态机驱动在分布式场景下也要处理一致性。**分布式系统 + 概率性决策 = 一致性是最难的问题，没有之一。**

### 2. 可观测性

四种范式都是"隐式"的——事件流是隐式的传播路径，响应式是隐式的数据依赖，LLM 驱动是隐式的推理过程，状态机驱动是隐式的约束边界。没有好的可观测性工具，出了问题就是黑盒。

事件驱动需要 distributed tracing（Jaeger、Zipkin），响应式需要 marble diagram 调试工具，LLM 驱动需要推理链追踪（LangSmith、Helicone），状态机驱动需要状态转换审计日志。

### 3. 测试

事件驱动的测试要处理时序和并发，响应式的测试要模拟数据流（Rx 的 TestScheduler），模型驱动的测试要覆盖模型定义的路径，状态机驱动的测试要覆盖所有转换路径和非法输入。都比测一个简单的函数调用难得多。

### 4. 退化风险

任何范式都可能退化为面条代码：
- 事件驱动 → 事件风暴，回调地狱
- 模型驱动（LLM）→ Agent 失控，无限循环调用工具
- 状态机驱动 → 状态爆炸，转换图不可读
- 响应式 → Observable 嵌套，operator chain 不可读

范式是工具，不是保证。纪律比范式更重要。

## 代码对比：同一个问题，四种解法

用"订单状态变更"来对比。需求：订单创建后可以支付，支付后可以发货，任何非终态都可以取消。

### 事件驱动

```typescript
// 事件定义
type OrderEvent =
  | { type: "ORDER_CREATED"; orderId: string }
  | { type: "PAYMENT_RECEIVED"; orderId: string }
  | { type: "ORDER_SHIPPED"; orderId: string }
  | { type: "ORDER_CANCELLED"; orderId: string };

// 事件处理器
eventBus.on("ORDER_CREATED", (e) => {
  orderStore.update(e.orderId, { status: "pending" });
  notificationService.sendConfirmation(e.orderId);
});

eventBus.on("PAYMENT_RECEIVED", (e) => {
  orderStore.update(e.orderId, { status: "paid" });
  inventoryService.reserve(e.orderId);
});

eventBus.on("ORDER_SHIPPED", (e) => {
  orderStore.update(e.orderId, { status: "shipped" });
  notificationService.sendShippingInfo(e.orderId);
});

eventBus.on("ORDER_CANCELLED", (e) => {
  orderStore.update(e.orderId, { status: "cancelled" });
  refundService.process(e.orderId);
});
```

### 模型驱动（LLM）

```typescript
// LLM 理解用户意图，决定执行什么操作
const tools = [
  { name: "pay_order", description: "支付订单" },
  { name: "cancel_order", description: "取消订单" },
  { name: "ship_order", description: "发货" },
];

const result = await llm.chatWithTools({
  messages: [
    { role: "system", content: "你是订单助手。当前订单状态：" + order.status },
    { role: "user", content: userInput },
  ],
  tools,
});

// result.tool_calls[0].name 可能是 "pay_order"、"cancel_order" 等
// 但 LLM 可能会在 shipped 状态下仍然选择 pay_order —— 这就是为什么需要状态机守卫
```

### 状态机驱动

```typescript
import { createMachine, interpret } from "xstate";

const orderMachine = createMachine({
  id: "order",
  initial: "pending",
  states: {
    pending: {
      on: { PAY: "paid", CANCEL: "cancelled" },
    },
    paid: {
      on: { SHIP: "shipped", CANCEL: "cancelled" },
      entry: "reserveInventory",
    },
    shipped: {
      on: { COMPLETE: "completed" },
      entry: "notifyShipped",
    },
    completed: { type: "final" },
    cancelled: { type: "final", entry: "processRefund" },
  },
});

// 运行时：非法转换被拒绝
const order = interpret(orderMachine).start();
order.send("PAY");     // ✅ pending → paid
order.send("SHIP");    // ✅ paid → shipped
order.send("PAY");     // ❌ shipped 状态下 PAY 无定义，被忽略/报错
```

### 响应式驱动

```typescript
// 用 RxJS 管理订单状态流
const orderEvents$ = new Subject<OrderEvent>();

const orderStatus$ = orderEvents$.pipe(
  scan((status, event) => {
    const transitions: Record<string, Record<string, string>> = {
      pending: { PAYMENT_RECEIVED: "paid", ORDER_CANCELLED: "cancelled" },
      paid: { ORDER_SHIPPED: "shipped", ORDER_CANCELLED: "cancelled" },
      shipped: { ORDER_COMPLETED: "completed" },
    };
    return transitions[status]?.[event.type] ?? status;
  }, "pending"),
  distinctUntilChanged()
);

// 订阅副作用
orderStatus$.pipe(filter(s => s === "paid")).subscribe(() => {
  inventoryService.reserve(currentOrderId);
});

orderStatus$.pipe(filter(s => s === "cancelled")).subscribe(() => {
  refundService.process(currentOrderId);
});
```

四段代码做同一件事，但思维方式完全不同：

- 事件驱动：**关注事件触发的动作**
- 模型驱动：**关注语义理解和意图推理**
- 状态机驱动：**关注状态的合法转换和非法拒绝**
- 响应式驱动：**关注状态变化的传播**

## 一个常被忽略的区别：时间语义

四种范式对"时间"的处理方式不同，这个区别很深，但很少有人讲。

- **事件驱动**：时间是**隐式排序**。事件 A 先于事件 B 发生，所以先处理 A。时间藏在事件的先后顺序里。
- **模型驱动（LLM）**：时间是**推理轮次**。每次推理是一个时间步，多轮对话构成推理链。时间藏在 context window 的滑动里。
- **状态机驱动**：时间是**状态变迁**。从状态 S1 到 S2，中间的转换就是"时间"。时间藏在状态机的边（edge）上。
- **响应式驱动**：时间是**数据流**。Observable 本质就是一个时间轴上的值序列。时间就是流本身。

理解了这个区别，就能理解为什么事件溯源和响应式流天然适配——事件溯源把时间显式化为事件序列，响应式流天然处理时间序列上的数据。也能理解为什么事件溯源和状态机驱动天然适配——事件是转换的输入日志，状态机是转换的规则，当前状态是 fold 的结果。

## 最后说一点

四种范式不是信仰，是工具。选型时不要问"我是事件驱动派还是响应式派"，要问"我眼前这个问题，哪种抽象更贴切"。

很多时候，最好的架构不是选一种范式贯彻到底，而是在不同层面用最合适的范式，然后用清晰的边界把它们拼起来。事件总线管通信，LLM 管理解，状态机管约束，响应式管数据流——各司其职，比教条地只用一种要强得多。
