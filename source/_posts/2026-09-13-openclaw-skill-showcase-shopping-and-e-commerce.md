---
title: OpenClaw Skill 每日推荐 - 购物与电商
date: 2026-09-13 11:30:00
tags:
  - openclaw
  - skill
  - shopping
  - e-commerce
categories:
  - 技术推荐
---

# OpenClaw Skill 每日推荐 - 购物与电商

> 🛒 今日分类：**Shopping & E-commerce**（51 个 Skills）
> 
> 从对话式购物到加密货币支付，从 Shopify 管理到物流发货，OpenClaw 的购物与电商类 Skill 正在重新定义「AI 代你买东西」这件事。

## 分类概述

购物与电商分类共收录 **51 个 Skill**，覆盖了电商运营的完整链路：

- **购物代理**：AI 直接帮你下单买东西
- **店铺管理**：Shopify、Amazon 卖家工具
- **物流发货**：多承运商比价、面单购买、物流追踪
- **订单管理**：查询历史订单、分析消费数据
- **加密支付**：用 USDC 等加密货币自主完成购买
- **比价与选品**：竞品分析、找平替、NFT 追踪
- **食品杂货**：在线买菜、外卖订餐、食谱提取

这类 Skill 的核心价值在于：**把多步骤、跨平台的购物流程压缩为一句自然语言指令**。

---

## 精选 Skill 详解

### 1. 📦 buy-anything — 对话式购物代理

**GitHub**: [openclaw/skills/tsyvic/buy-anything](https://github.com/openclaw/skills/tree/main/skills/tsyvic/buy-anything/SKILL.md)

**核心功能**：通过 Rye Checkout API 实现 Amazon 和 Shopify 商店的对话式购物。用户发一个商品链接，AI 就能完成整个下单流程。

**工作流程**：

```
用户发商品 URL → AI 确认 → 收集收货地址 → 安全录入信用卡 → 提交订单 → 轮询确认
```

**技术实现**：

1. **BasisTheory 信用卡代币化**：通过浏览器打开 PCI 合规的卡片录入页面，卡号永远不进入聊天上下文，只保存不透明的 Token ID
2. **Rye API 下单**：以 `POST /api/v1/partners/clawdbot/purchase` 提交购买请求，返回 Checkout Intent ID
3. **异步轮询**：每 5 秒查询订单状态，直到 `completed` 或 `failed`

**费用结构**：
- Shopify 商店：原价，无加价
- Amazon：3% 服务费覆盖交易成本
- $15 以下订单：$6.99 运费
- $15 以上：免费 2 天 Prime 配送

**实用场景**：

```
用户：帮我买这个 https://amazon.com/dp/B0DJLKV4N9
AI：好的！请提供收货地址。
用户：张三，上海市浦东新区xxx路123号，138xxxx
AI：最高消费限额是多少？
用户：500 美元
AI：[打开安全卡片录入页面] 请在浏览器中输入信用卡信息...
用户：[粘贴 BasisTheory Token]
AI：订单已提交！正在等待确认...
     ✅ 商品：无线耳机 Pro
     ✅ 总价：$358.44（含 3% 服务费）
     ✅ 订单号：RYE-ABC123
     下次需要保存卡片信息以便快速结账吗？
```

**推荐指数**：⭐⭐⭐⭐⭐

**亮点**：信用卡信息零接触聊天、支持记忆地址和卡片 Token、消费限额保护——这是目前最完整的对话式购物 Skill。

---

### 2. 🏪 clawpify — Shopify GraphQL 管理利器

**GitHub**: [openclaw/skills/alhwyn/clawpify](https://github.com/openclaw/skills/tree/main/skills/alhwyn/clawpify/SKILL.md)

**核心功能**：通过 Shopify GraphQL Admin API 全面管理店铺——商品、订单、客户、库存、折扣、退款等。

**覆盖范围**：

| 领域 | 支持操作 |
|------|---------|
| 商品 | 列表、搜索、创建、更新、删除 |
| 订单 | 查看、取消、履约 |
| 客户 | 列表、创建、更新 |
| 库存 | 查询水平、调整数量 |
| 折扣 | 创建折扣码、管理促销 |
| 退款 | 处理退款（需确认） |
| Collections、Webhooks、页面、博客、文件、运输、订阅等 | 全覆盖 |

**安全机制**：对退款、订单取消、礼品卡停用、库存调整、商品删除、折扣激活等危险操作**强制要求用户确认**。

**实用场景**：

```graphql
# 搜索所有含 "shirt" 的活跃商品
query {
  products(first: 10, query: "title:*shirt* AND status:ACTIVE") {
    nodes { id title status }
  }
}

# 查看最近 10 笔订单
query {
  orders(first: 10, sortKey: CREATED_AT, reverse: true) {
    nodes {
      id name
      totalPriceSet { shopMoney { amount currencyCode } }
      customer { displayName }
    }
  }
}
```

**推荐指数**：⭐⭐⭐⭐

**亮点**：覆盖 25+ 个参考文档，从商品到营销活动全方位管理。适合 Shopify 卖家用自然语言管理店铺，替代后台点击操作。

---

### 3. 🚚 atoship — AI 智能物流管家

**GitHub**: [openclaw/skills/atoship-dev/atoship](https://github.com/openclaw/skills/tree/main/skills/atoship-dev/atoship/SKILL.md)

**核心功能**：一个 Skill 统一管理 USPS、FedEx、UPS 三大承运商——比价、购买面单、追踪包裹、管理订单。

**核心能力**：

| 功能 | 说明 |
|------|------|
| 比价 | 一次请求获取三大承运商的实时费率 |
| 购买面单 | 支持 PDF、PNG、ZPL（热敏打印机）格式 |
| 追踪 | 全事件历史，实时状态更新 |
| 地址验证 | 购买前验证收货地址，避免附加费 |
| 钱包余额 | 邮资信用管理，只付实际运费 |

**安全设计**：
- 购买面单和作废面单**必须用户确认**（影响钱包余额）
- 查询费率、追踪包裹等只读操作可自主执行
- 测试密钥 `ak_test_...` 生成的面单免费且不发货

**实用场景**：

```
用户：从洛杉矶寄一个 2 磅的包裹到纽约，最便宜的方式是什么？
AI：[调用 atoship API 比价]
     USPS Priority Mail：$8.50，2 天送达
     FedEx Ground：$9.20，3 天送达
     UPS Ground：$10.10，3 天送达
     最便宜的是 USPS Priority Mail，$8.50。

用户：买 USPS 的标签
AI：请确认：
     承运商：USPS Priority Mail
     服务：Priority Mail
     费用：$8.50
     发件人：Sender, 123 Main St, Los Angeles CA 90001
     收件人：Recipient, 456 Oak Ave, New York NY 10001
     确认购买？

用户：确认
AI：✅ 面单已购买！
     追踪号：9400111899223456789012
     下载链接：[PDF]
```

**推荐指数**：⭐⭐⭐⭐⭐

**亮点**：三大承运商一个 API 搞定，折扣费率无最低量要求，无月费。电商卖家、小企业主、物流协调员的理想工具。

---

### 4. 📋 amazon-orders — Amazon 订单历史查询

**GitHub**: [openclaw/skills/pfernandez98/amazon-orders](https://github.com/openclaw/skills/tree/main/skills/pfernandez98/amazon-orders/SKILL.md)

**核心功能**：通过非官方 Python API 下载和查询你的 Amazon 订单历史。

**使用方式**：

```bash
# 安装
python3 -m pip install --upgrade amazon-orders

# 环境变量认证
export AMAZON_USERNAME="you@example.com"
export AMAZON_PASSWORD="your-password"
export AMAZON_OTP_SECRET_KEY="BASE32_TOTP_SECRET"  # 可选，用于 MFA

# CLI 命令
amazon-orders login
amazon-orders history --year 2023
amazon-orders history --last-30-days
amazon-orders history --last-3-months --full-details > orders.json
```

```python
# Python 库
from amazonorders.session import AmazonSession
from amazonorders.orders import AmazonOrders

session = AmazonSession("email", "password")
session.login()
orders = AmazonOrders(session)
results = orders.get_order_history(time_filter="last30")
for order in results:
    print(f"{order.order_number} - {order.grand_total}")
```

**实用场景**：
- 年度消费分析：导出全年订单，统计消费总额和品类分布
- 价格追踪：检查历史购买价格，判断当前是否是好价
- 退款核对：对比订单记录和银行账单

**推荐指数**：⭐⭐⭐

**亮点**：简单实用的数据导出工具，适合做个人消费分析。注意这是非官方爬虫工具，Amazon 页面变更可能导致功能失效。

---

### 5. 🪙 sp3nd — 用 USDC 在 Amazon 自主购物

**GitHub**: [openclaw/skills/kent-x1/sp3nd](https://github.com/openclaw/skills/tree/main/skills/kent-x1/sp3nd/SKILL.md)

**核心功能**：AI Agent 使用 USDC（Solana 链上稳定币）在 Amazon 自主完成购物——0% 平台费、免 Prime 配送、无需 KYC、支持 200+ 国家和 22 个 Amazon 站点。

**技术架构**：

```
registerAgent → createPartnerCart → createPartnerOrder → payAgentOrder (HTTP 402) → 链上支付 USDC → Helius Webhook 确认 → 发货
```

**x402 支付协议**：
1. Agent 调用 `/payAgentOrder`，服务器返回 HTTP 402 Payment Required
2. 响应头 `PAYMENT-REQUIRED` 中包含支付要求（收款地址、金额、USDC mint 地址）
3. Agent 构建 Solana v0 版本交易：USDC 转账 + Memo 指令（`SP3ND Order: <order_number>`）
4. 提交给 PayAI facilitator 验证并结算
5. Helius Webhook 检测到链上支付 + Memo，标记订单为已支付

**费用结构**：
| 项目 | 费用 |
|------|------|
| 平台费 | 0% |
| 支付处理费 | 0%（USDC 链上转账，gas 近乎为零） |
| Prime 配送 | 免费 |
| 覆盖范围 | 22 个 Amazon 站点，200+ 国家 |

**Amazon TLD 匹配规则**（关键）：
必须使用与收件国家匹配的 Amazon 域名。例如寄到德国用 `amazon.de`，寄到日本用 `amazon.co.jp`。用错 TLD 会导致订单失败。

**代码示例**（Node.js）：

```javascript
import { Connection, Keypair, PublicKey, TransactionMessage, VersionedTransaction } from '@solana/web3.js';
import { getAssociatedTokenAddress, createTransferCheckedInstruction } from '@solana/spl-token';
import { createMemoInstruction } from '@solana/spl-memo';

// 1. 创建购物车
const cart = await fetch(`${BASE_URL}/createPartnerCart`, {
  method: 'POST', headers,
  body: JSON.stringify({ items: [{ product_url: 'https://amazon.com/dp/B08XYZ123', quantity: 1 }] })
}).then(r => r.json());

// 2. 创建订单
const order = await fetch(`${BASE_URL}/createPartnerOrder`, {
  method: 'POST', headers,
  body: JSON.stringify({ cart_id: cart.cart.cart_id, customer_email, shipping_address })
}).then(r => r.json());

// 3. 触发 402 支付请求
const res = await fetch(`${BASE_URL}/payAgentOrder`, {
  method: 'POST', headers,
  body: JSON.stringify({ order_id: order.order.order_id, order_number: order.order.order_number })
});

// 4. 解析支付要求，构建并签名交易
const paymentReq = JSON.parse(Buffer.from(res.headers.get('PAYMENT-REQUIRED'), 'base64').toString());
// ... 构建 VersionedTransaction，包含 USDC 转账 + Memo 指令

// 5. 验证 + 结算
await fetch(`${FACILITATOR}/verify`, { method: 'POST', ... });
await fetch(`${FACILITATOR}/settle`, { method: 'POST', ... });

// 6. 轮询确认
while (true) {
  const status = await fetch(`${BASE_URL}/getPartnerOrders`, { headers }).then(r => r.json());
  if (status.orders.find(o => o.status === 'Paid')) break;
  await new Promise(r => setTimeout(r, 5000));
}
```

**推荐指数**：⭐⭐⭐⭐⭐

**亮点**：这是目前最完整的加密货币电商支付 Skill。x402 协议实现了真正的自主支付——Agent 发现商品、创建订单、链上转账、确认发货，全程无需人工干预。0% 平台费 + 免费 Prime 配送 + 22 个 Amazon 站点的覆盖范围，对 Web3 生态的 AI Agent 购物场景意义重大。

---

## 应用场景总结

### 场景一：个人购物助手

用户在聊天中发送商品链接 → `buy-anything` 完成下单 → 记忆卡片和地址 → 下次一句话复购。

### 场景二：电商卖家运营

Shopify 卖家用 `clawpify` 管理商品和订单 → 客户下单后用 `atoship` 比价发货 → 用 `amazon-orders` 追踪采购历史。

### 场景三：Web3 自主购物

Agent 使用 `sp3nd` 以 USDC 在 Amazon 自主购物 → x402 协议自动完成链上支付 → 22 个站点覆盖 200+ 国家 → 全程零人工干预。

### 场景四：消费数据分析

用 `amazon-orders` 导出全年订单 JSON → 分析消费趋势、品类分布、价格波动 → 辅助购物决策。

---

## 推荐指数排名

| 排名 | Skill | 指数 | 核心价值 |
|------|-------|------|---------|
| 🥇 | buy-anything | ⭐⭐⭐⭐⭐ | 对话式购物的完整实现，安全、便捷、可记忆 |
| 🥇 | atoship | ⭐⭐⭐⭐⭐ | 三大承运商统一管理，电商卖家必备 |
| 🥇 | sp3nd | ⭐⭐⭐⭐⭐ | 加密货币电商支付的标杆，x402 协议的最佳实践 |
| 🥈 | clawpify | ⭐⭐⭐⭐ | Shopify 全方位管理，GraphQL 深度集成 |
| 🥉 | amazon-orders | ⭐⭐⭐ | 实用订单导出工具，适合消费分析 |

---

## 实用建议

1. **入门首选**：从 `buy-anything` 开始体验对话式购物，设置消费限额保护
2. **电商卖家**：`clawpify` + `atoship` 组合，从店铺管理到物流发货一站式解决
3. **Web3 开发者**：研究 `sp3nd` 的 x402 协议实现，这是 AI Agent 自主支付的最佳参考
4. **安全提醒**：购物类 Skill 涉及支付敏感操作，务必在受信任的环境中使用，注意 API Key 的权限范围和消费限额设置
5. **多 Skill 协同**：`amazon-competitor-analyzer` 做竞品分析 → `buy-anything` 下单 → `atoship` 发货 → `amazon-orders` 追踪，形成完整电商工作流

---

> 📌 明日预告：**Smart Home & IoT** 分类——让你的 AI 管家控制灯光、温度、安防设备。
> 
> 🎯 本系列已发布 26/30 期，即将完成首轮遍历！
