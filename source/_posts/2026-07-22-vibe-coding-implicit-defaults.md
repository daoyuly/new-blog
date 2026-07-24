---
title: Vibe Coding 里最危险的不是 Bug，是那些"没人决策过的默认"
date: 2026-07-22 16:10:00
tags:
  - Vibe Coding
  - AI编程
  - 软件工程
  - 系统设计
categories:
  - AI编程
description: "Vibe coding 让人上瘾。你描述需求，AI 生成代码，跑起来能 work，感觉像魔法。但用了一段时间你会发现一种诡异的问题——系统在正常运行，没有报错，没有异常，但它的行为是错的。不是 bug 那种\"崩了你知道哪里坏了\"的错，..."
keywords: "vibe, coding, 里最危险的不是, bug, 是那些"没人决策过的默认, Vibe Coding, AI编程, 软件工程"
---

Vibe coding 让人上瘾。你描述需求，AI 生成代码，跑起来能 work，感觉像魔法。但用了一段时间你会发现一种诡异的问题——系统在正常运行，没有报错，没有异常，但它的行为是错的。不是 bug 那种"崩了你知道哪里坏了"的错，而是"一切看起来正常，但底层逻辑从来没人确认过"的错。

这就是"没人决策过的默认"。

## 什么是"没人决策过的默认"

传统开发中，每一个行为都有人拍板。你写 `setTimeout(fetchData, 5000)`，你决定了重试间隔是 5 秒。你写 `max_connections: 100`，你决定了连接池上限。

Vibe coding 不一样。你跟 AI 说"做个用户注册登录功能"，AI 给你一整套代码。里面包含了很多决策——session 过期时间、密码复杂度要求、数据库索引策略、错误重试次数——但**这些决策不是你做的，也不是 AI 经过思考做的，而是从训练数据里"统计平均"出来的默认值**。

AI 不会问你"session 过期你想设多久"，它直接给你一个 `expiresIn: '7d'`。这个 7 天不是你的业务需求，是 AI 训练数据里最常见的值。它可能适合你，也可能不适合。关键是——**你不知道这个值是哪来的，也不知道它是否匹配你的场景**。

这比 bug 危险得多。Bug 会报错，你看见了就会修。默认值不会报错，系统照常运行，直到某天出了事你才意识到：哦，原来这里一直是错的。

## 几个真实案例

### 案例 1：静默的数据吞没

有人用 vibe coding 搭了一个订单处理系统。AI 生成了完整的后端代码，包括一个错误处理中间件：

```javascript
app.use((err, req, res, next) => {
  console.error(err.message);
  res.status(500).json({ error: 'Internal Server Error' });
});
```

看起来没问题。但有个上游服务偶尔返回 503，订单数据在处理链路中被这个中间件统一捕获，返回 500，然后队列重试。重试三次失败后，订单状态变成 `failed`。

问题在哪？**没人决定过"上游 503 应该重试三次然后放弃"这个策略**。AI 从训练数据里拿了一个常见的重试模式，但这个业务场景下，503 可能只是上游服务正在滚动更新，等 30 秒就好了。正确的策略应该是：503 等待后重试，不设上限或设一个很大的上限，同时告警。

系统运行了两个月，悄悄丢了 200 多个订单。没有报错，因为"重试三次失败后标记为 failed"是"正常流程"。

### 案例 2：权限模型的隐性默认

一个团队用 vibe coding 做内部管理后台。AI 生成了基于 JWT 的认证系统，包含角色权限检查。代码里有这样的逻辑：

```javascript
// 默认角色
const DEFAULT_ROLE = 'viewer';

// 权限检查中间件
function checkPermission(requiredRole) {
  return (req, res, next) => {
    const userRole = req.user?.role || DEFAULT_ROLE;
    if (roleHierarchy[userRole] >= roleHierarchy[requiredRole]) {
      next();
    } else {
      res.status(403).json({ error: 'Forbidden' });
    }
  };
}
```

`DEFAULT_ROLE = 'viewer'` 这个默认值看起来合理——最小权限原则。但问题是，当 JWT 解析失败（比如 token 格式错误、密钥不匹配），`req.user` 是 `undefined`，用户会被静默降级为 `viewer`。

这意味着：如果一个管理员因为 token 过期或格式问题导致 JWT 解析失败，他不会被拒绝访问，而是以 viewer 身份登录，看到部分数据。更严重的是，前端代码也是 AI 生成的，没有检查"当前角色是否与预期一致"，所以管理员看到的是一个降级后的界面，不会意识到自己被降权了。

**没人决定过"JWT 解析失败时应该降级为 viewer"这个行为**。AI 选择了"给个默认值"而不是"拒绝访问"。在安全场景下，这两个选择有天壤之别。

### 案例 3：数据库的隐形炸弹

有人用 vibe coding 做了一个内容管理系统的后端。AI 生成了完整的 Prisma schema 和 CRUD 接口：

```prisma
model Article {
  id        String   @id @default(cuid())
  title     String
  content   String
  authorId  String
  author    User     @relation(fields: [authorId], references: [id])
  tags      String[] @default([])
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  @@index([authorId])
}
```

看起来很专业。但仔细看——`tags` 字段没有索引，`createdAt` 没有索引，`title` 没有索引。AI 加了 `authorId` 的索引（因为外键通常需要），但其他字段它做了"不加索引"的默认决策。

对于小数据量没问题。但这个系统是做内容管理的，文章量会增长到几十万。用户按标签搜索、按时间排序时，每次都是全表扫描。数据库 CPU 飙到 80%，但不会报错——查询"成功"了，只是慢。

**没人决定过"tags 字段不需要索引"**。AI 从训练数据里学到"外键加索引，其他默认不加"，这在很多场景下是对的，但在"按标签搜索"这个核心场景下是错的。

### 案例 4：前端的"看起来对"

vibe coding 最容易出问题的地方其实是前端。你让 AI 做一个表单，它生成的代码通常长这样：

```jsx
function UserForm({ initialData, onSubmit }) {
  const [formData, setFormData] = useState(initialData || {});
  
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <input name="name" value={formData.name || ''} onChange={handleChange} />
      <input name="email" value={formData.email || ''} onChange={handleChange} />
      <button type="submit">提交</button>
    </form>
  );
}
```

功能上没问题。但缺少的东西很多：

- **没有表单校验**——邮箱格式、必填字段、长度限制，全是空的
- **没有防重复提交**——网络慢的时候用户点两次，提交两份
- **没有 dirty 检测**——用户改了一半然后离开，数据丢失
- **没有 loading 状态**——提交时按钮还能点

AI 给你的是一个"能跑的最小实现"。这些缺失项不会报错，表单正常提交，数据正常入库。但邮箱可能是 `asdf`，同一个订单可能被提交两次。

**这些都不是 bug**——代码完全按照"写的"在运行。问题是"写的"这些东西从来没人确认过。

## 为什么 Vibe Coding 特别容易出这个问题

传统开发中，每一行代码都是人写的。你写 `expiresIn: '7d'` 的时候，至少要想一下"7 天合适吗"。虽然也会用默认值，但每个默认值都经过了一次人的意识。

Vibe coding 打破了这个机制。代码是 AI 生成的，生成速度极快，人在 review 时主要看"功能对不对"——能不能跑通 happy path。至于 `expiresIn` 设了多少、重试策略是什么、索引加了哪些——这些藏在细节里的决策，人很容易扫过去。

三个原因叠加：

**1. 速度陷阱。** AI 30 秒生成 500 行代码，你花 5 分钟扫一遍就说"看起来没问题"。但 500 行里可能有 30 个隐性决策点，5 分钟根本看不完。传统开发中这 500 行要写半天，每个决策点都经过了人的大脑。

**2. 确认偏差。** 代码"能跑"，你就倾向于认为它"是对的"。但能跑和正确之间隔着一整个决策空间。`console.error(err.message)` 能跑，但它吞掉了 stack trace、丢失了上下文、没有告警——这些你不会在 happy path 里发现。

**3. 知识盲区。** AI 生成的代码可能涉及你不熟悉的领域。比如它生成了一个 Istio VirtualService 配置，你没写过 Istio，看了觉得"应该没问题"就提交了。但里面的重试策略、超时设置、流量拆分比例，都是 AI 做的默认决策，你没能力评估对错。

## 怎么解决

没有银弹，但有几个方向可以大幅降低风险。

### 1. 给 AI 明确的决策清单

不要只给需求，要给约束。把"你期望 AI 做的决策"和"你希望 AI 不要替你做的决策"都列出来。

差的 prompt：
> 做一个用户注册登录系统

好的 prompt：
> 做一个用户注册登录系统。要求：
> - session 过期时间需要可配置，默认 24 小时
> - 密码至少 12 位，包含大小写字母和特殊字符
> - 登录失败 5 次锁定 30 分钟
> - 所有错误必须记录完整 stack trace
> - 不要使用默认的 JWT 密钥，密钥从环境变量读取
> - 数据库需要给 email 和 username 字段加唯一索引
> - 对于你不确定的决策，列出来问我，不要自己选默认值

最后一句特别关键——**让 AI 把它做的决策暴露出来**，而不是埋在代码里。

### 2. 建立"决策审计"习惯

Review AI 生成的代码时，不要只看功能逻辑。要专门过一遍"隐性决策清单"：

| 类别 | 检查项 |
|------|--------|
| 安全 | 密钥来源、加密算法、CORS 策略、输入校验、权限默认值 |
| 性能 | 索引策略、缓存策略、连接池大小、批处理 vs 逐条 |
| 可靠性 | 重试策略、超时设置、熔断机制、降级方案 |
| 数据 | 数据校验、类型安全、null 处理、事务边界 |
| 可观测 | 日志级别、监控指标、告警阈值、trace 传播 |
| 前端 | 表单校验、loading 状态、防重复提交、错误展示 |

这个清单不完整，但覆盖了大多数"隐性默认"出问题的地方。每次 review 过一遍，10 分钟的事，能挡掉大部分坑。

### 3. 用测试覆盖"默认行为"

默认值的问题在于它不报错。但测试可以强制让它"暴露"。

比如，你写一个测试：`当用户输入空邮箱时，系统应该返回 422 错误`。如果 AI 生成的代码没有做邮箱校验，这个测试会失败，你就发现了"没有校验"这个隐性默认。

再比如：`当并发提交 100 次相同订单时，系统应该只创建一个订单`。这个测试能暴露"没有防重复提交"的隐性默认。

关键思路：**把"应该有什么行为"写成测试，让缺失的行为自动暴露出来**。这比纯靠人眼 review 靠谱得多。

### 4. 让 AI 做"决策标注"

一个很实用的技巧：让 AI 在生成代码时，把它做的每个决策标注出来。

prompt 里加一句：
> 在代码注释中，用 `// DECISION:` 标注你做的所有非显而易见的决策，包括但不限于：超时时间、重试次数、默认值、错误处理策略、安全策略。

生成的代码会变成这样：

```javascript
// DECISION: session 过期设为 7 天（常见默认值，可根据业务调整）
const SESSION_EXPIRES = '7d';

// DECISION: 错误处理采用静默捕获+日志记录，不向客户端暴露内部错误
app.use((err, req, res, next) => {
  logger.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

// DECISION: 重试 3 次后放弃，间隔指数退避起始 1 秒
const retryConfig = { maxRetries: 3, backoff: 'exponential', initialDelay: 1000 };
```

这些注释让你在 review 时一眼看到所有决策点，而不是在几百行代码里大海捞针。

### 5. 区分"原型"和"生产"

Vibe coding 最大的诱惑是——原型跑通了，就觉得可以上生产了。

原型阶段的隐性默认是可以接受的，因为原型会扔掉。但很多团队的实际情况是：原型直接变成了生产代码，隐性默认也跟着上了生产。

定一条规矩：**vibe coding 生成的代码要上生产，必须经过决策审计**。原型阶段随便用，生产阶段必须把每个 `// DECISION` 过一遍，确认或修改。这条规矩不靠自觉，靠 CI——比如上面的决策标注可以做成一个检查项：没有 `// DECISION` 标注的 PR 不让合并。

## 写在最后

Vibe coding 不会消失，只会越来越强。但"AI 写代码"这件事本身不改变软件工程的本质——**每一个行为都需要有人为它负责**。

Bug 是显性的，它会崩、会报错、会被发现。隐性默认是隐形的，它静悄悄地运行，直到有一天你发现你的系统在过去三个月里用错误的方式处理了所有用户的敏感数据。

工具在进步，但"理解你的系统在做什么"这件事，永远是工程师的责任。Vibe coding 不是让你不思考，而是让你把思考从"怎么写代码"转移到"代码应该做什么"——后者其实更难。

别让 AI 的默认值变成你的技术债。
