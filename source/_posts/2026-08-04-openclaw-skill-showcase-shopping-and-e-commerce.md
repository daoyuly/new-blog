---
title: OpenClaw Skill 每日推荐 - Shopping & E-commerce
tags:
  - openclaw
  - skill
  - shopping
  - e-commerce
categories:
  - 技术推荐
abbrlink: 32044
date: 2026-08-04 11:30:00
---

# OpenClaw Skill 每日推荐 - Shopping & E-commerce 🛒

> 第 26 期 | 2026-08-04 | 分类：购物与电商
>
> 共 51 个 Skills，覆盖在线购物、订单管理、物流发货、比价找平替、店铺运营等场景

## 📌 分类概述

Shopping & E-commerce 分类汇集了 51 个与购物和电商相关的 OpenClaw Skills。从对话式下单购买到亚马逊订单历史查询，从 Shopify 店铺管理到跨承运商物流发货，再到智能找平替——这个分类几乎覆盖了电商生态的每一个环节。

无论是消费者想用 AI 辅助购物决策，还是商家需要自动化店铺运营和物流流程，都能在这里找到趁手的工具。

---

## 🏆 精选 Skill 详解

### 1. Buy Anything — 对话式购物助手

**GitHub:** [openclaw/skills - tsyvic/buy-anything](https://github.com/openclaw/skills/tree/main/skills/tsyvic/buy-anything)

**核心功能：** 通过自然对话完成 Amazon 和 Shopify 商品的购买。用户只需发送商品链接，AI 即可协助完成整个下单流程。

**技术实现：**
- 集成 **Rye API** 作为电商结算引擎，支持 Amazon 和 Shopify 两个平台
- 通过 **BasisTheory** 进行 PCI 合规的信用卡安全存储，卡片信息从不进入聊天上下文
- 支持将支付令牌和收货地址保存到本地 memory，实现"一次设置，后续秒购"
- 异步轮询订单状态（`retrieving_offer` → `placing_order` → `completed`）

**实用场景：**
```
用户：帮我买这个 https://amazon.com/dp/B0DJLKV4N9
AI：好的！请提供收货地址...
用户：张三，北京市朝阳区xxx，电话...
AI：已打开安全卡片输入页面，请在浏览器中输入卡号...
用户：[粘贴 BasisTheory 令牌]
AI：订单已提交！商品：无线耳机 Pro，总价：$358.44，订单号：RYE-ABC123
```

**亮点：**
- Amazon 订单 $15 以上享免费 2 天 Prime 配送
- Shopify 商店无加价
- 支持消费上限保护，超限自动预警
- 卡片信息零接触，安全可靠

**推荐指数：** ⭐⭐⭐⭐⭐

---

### 2. Amazon Orders — 亚马逊订单历史查询

**GitHub:** [openclaw/skills - pfernandez98/amazon-orders](https://github.com/openclaw/skills/tree/main/skills/pfernandez98/amazon-orders)

**核心功能：** 通过非官方 Python API 和 CLI 工具，下载和查询你的 Amazon.com 订单历史。

**技术实现：**
- 基于 `amazon-orders` Python 包，通过网页爬取方式获取数据
- 支持环境变量认证（`AMAZON_USERNAME`/`AMAZON_PASSWORD`/`AMAZON_OTP_SECRET_KEY`）
- 兼容 MFA/OTP 账户，适合自动化场景
- 同时提供 Python 库和 CLI 两种使用方式

**实用场景：**

```python
from amazonorders.session import AmazonSession
from amazonorders.orders import AmazonOrders

amazon_session = AmazonSession("email@example.com", "password")
amazon_session.login()

orders = AmazonOrders(amazon_session)
# 获取最近30天订单
recent = orders.get_order_history(time_filter="last30")

for order in recent:
    print(f"{order.order_number} - {order.grand_total}")
```

CLI 方式：
```bash
# 导出年度订单到 JSON
amazon-orders history --year 2025 --full-details > orders_2025.json

# 快速查看近30天消费
amazon-orders history --last-30-days --full-details \
  | jq -r '.[] | [.order_number, .grand_total] | @tsv'
```

**亮点：**
- 支持按年份、最近30天、近3个月等时间筛选
- `--full-details` 获取更丰富的订单字段
- 适合个人财务分析和消费统计

**注意事项：** 这是非官方爬虫工具，仅支持 Amazon.com 英文站，Amazon 页面改版可能导致临时不可用。

**推荐指数：** ⭐⭐⭐⭐

---

### 3. Clawpify — Shopify GraphQL 管理助手

**GitHub:** [openclaw/skills - alhwyn/clawpify](https://github.com/openclaw/skills/tree/main/skills/alhwyn/clawpify)

**核心功能：** 通过 Shopify GraphQL Admin API 全面管理 Shopify 店铺，覆盖商品、订单、客户、库存、折扣等所有数据操作。

**技术实现：**
- 直接调用 Shopify GraphQL Admin API
- 涵盖 25+ 参考文档（products、orders、customers、inventory、discounts、fulfillments、refunds 等）
- 支持分页查询、批量操作、Webhook 管理
- 内置安全机制：退款、取消订单、删除商品等危险操作必须用户显式确认

**实用场景：**

```graphql
# 查询最近10笔订单
query {
  orders(first: 10, sortKey: CREATED_AT, reverse: true) {
    nodes {
      id
      name
      totalPriceSet { shopMoney { amount currencyCode } }
      customer { displayName }
    }
  }
}

# 搜索活跃商品
query {
  products(first: 10, query: "title:*shirt* AND status:ACTIVE") {
    nodes { id title status }
  }
}

# 检查库存水平
query GetInventory($id: ID!) {
  inventoryItem(id: $id) {
    inventoryLevels(first: 5) {
      nodes {
        quantities(names: ["available"]) { name quantity }
        location { name }
      }
    }
  }
}
```

**亮点：**
- 一个 Skill 覆盖 Shopify 店铺管理的方方面面
- 完善的错误处理（区分 GraphQL 语法错误和验证错误）
- 支持多市场、订阅、草稿订单、礼品卡等高级功能
- 适合从日常运营到批量数据迁移的各类场景

**推荐指数：** ⭐⭐⭐⭐⭐

---

### 4. Atoship — AI 智能物流发货

**GitHub:** [openclaw/skills - atoship-dev/atoship](https://github.com/openclaw/skills/tree/main/skills/atoship-dev/atoship)

**核心功能：** AI 驱动的全能物流管理工具，支持 USPS、FedEx、UPS 三大承运商的费率比较、面单购买和物流追踪。

**技术实现：**
- 纯指令型 Skill，无需安装额外软件，直接调用 atoship REST API
- 钱包制计费，无月费无订阅，用多少扣多少
- 支持 PDF/PNG/ZPL 多种面单格式，兼容热敏打印机
- 钱包操作（购买/取消面单）需用户显式确认，只读操作（查询费率/追踪）可直接执行

**实用场景：**

```bash
# 比较费率
curl -X POST "https://atoship.com/api/v1/rates" \
  -H "Authorization: Bearer ak_live_xxx" \
  -H "Content-Type: application/json" \
  -d '{
    "from_address": {"city": "Los Angeles", "state": "CA", "zip": "90001"},
    "to_address": {"city": "New York", "state": "NY", "zip": "10001"},
    "parcel": {"weight": 16, "weight_unit": "oz"}
  }'

# 追踪包裹
curl -X GET "https://atoship.com/api/v1/tracking/9400111899223456789012" \
  -H "Authorization: Bearer ak_live_xxx"
```

对话式使用：
```
用户：帮我寄一个 2 磅的箱子从洛杉矶到纽约，3 天内到，找最便宜的
AI：正在比较费率...
     USPS Priority Mail: $8.95, 预计 2 天送达
     FedEx Ground: $9.50, 预计 3 天送达
     UPS Ground: $10.20, 预计 3 天送达
     推荐 USPS Priority Mail，最便宜且 2 天可达。确认购买？
用户：确认
AI：面单已购买！追踪号：9400111899223456789012
     下载链接：https://atoship.com/labels/xxx.pdf
```

**亮点：**
- 折扣费率，无最低量要求
- 支持 200+ 国家国际运输
- 地址验证功能，避免附加费
- 支持签名确认和保险
- 适合电商卖家、小企业、代发货等多种业务

**推荐指数：** ⭐⭐⭐⭐⭐

---

### 5. Dupe — 智能找平替

**GitHub:** [openclaw/skills - crisanmm/dupe](https://github.com/openclaw/skills/tree/main/skills/crisanmm/dupe)

**核心功能：** 基于 dupe.com API，通过商品链接或图片 URL 智能查找相似产品，帮你找到更实惠的替代品。

**技术实现：**
- 调用 dupe.com API，支持两种输入：商品页面 URL 或直接图片 URL
- 返回结果包含相似度评分、价格、来源商店、质量评估等维度
- 支持设置返回数量（默认 7 条，最多 20 条）
- 覆盖 Wayfair、Birch Lane、AllModern 等多家零售商

**实用场景：**

```bash
# 通过商品链接找平替
curl --request POST \
  --url https://api.dupe.com/api/dupes/agent-skill \
  --header 'Content-Type: application/json' \
  --data '{
    "type": "product",
    "productUrl": "https://www.danishdesignstore.com/products/verner-panton-flowerpot-vp9",
    "limit": 7
  }'

# 通过图片找平替
curl --request POST \
  --url https://api.dupe.com/api/dupes/agent-skill \
  --header 'Content-Type: application/json' \
  --data '{
    "type": "image",
    "imageUrl": "https://cdn.shopify.com/s/files/xxx/flowerpot.jpg",
    "limit": 10
  }'
```

返回结果示例：
```
共找到 72 个相似商品，以下是 Top 5：

1. Ailaigh 21" 2-Light Matte Pink Desk Lamp
   💰 $61.99 | 🏪 Wayfair | 相似度 84%
   
2. Hinata 5-In LED Table Lamp
   💰 $76.03 | 🏪 Wayfair | 相似度 87%
   
3. Pin Lamp
   💰 $485 | 🏪 Wayfair | 相似度 82%
```

**亮点：**
- 支持图片直接搜索，不依赖商品链接
- 提供质量评估和性价比评级
- 覆盖多家零售商，一站式比价
- 非常适合家居、装饰、服装等视觉导向品类的购物决策

**推荐指数：** ⭐⭐⭐⭐

---

## 📊 推荐指数排名

| 排名 | Skill | 推荐指数 | 适用人群 |
|:---:|-------|:---:|---------|
| 1 | **Buy Anything** | ⭐⭐⭐⭐⭐ | 想用 AI 对话完成购物的消费者 |
| 2 | **Clawpify** | ⭐⭐⭐⭐⭐ | Shopify 店铺运营者/商家 |
| 3 | **Atoship** | ⭐⭐⭐⭐⭐ | 电商卖家/小企业/物流人员 |
| 4 | **Amazon Orders** | ⭐⭐⭐⭐ | 需要分析消费记录的个人用户 |
| 5 | **Dupe** | ⭐⭐⭐⭐ | 追求性价比的精明消费者 |

---

## 🎯 应用场景总结

### 消费者场景
- **对话式购物：** 发个链接就能下单，不用手动填写表单（Buy Anything）
- **找平替省钱：** 看到喜欢的商品太贵？一键找到相似款（Dupe）
- **消费分析：** 导出亚马逊订单历史，做年度消费统计（Amazon Orders）

### 商家场景
- **店铺管理：** 用 GraphQL 全方位管理 Shopify 店铺（Clawpify）
- **物流发货：** 对话式比价发货，自动选最便宜的承运商（Atoship）
- **订单履约：** 从接单到发货全流程自动化

### 开发者场景
- 电商 API 集成参考
- 支付安全（BasisTheory 令牌化）实践范例
- 多承运商物流 API 对接方案

---

## 💡 实用建议

1. **入门顺序：** 先试 Dupe（零配置，即开即用）→ 再试 Buy Anything（需要绑卡）→ 最后试 Atoship（需要 API Key）
2. **安全提醒：** Buy Anything 使用 BasisTheory 进行 PCI 合规的卡片存储，卡号不会进入 AI 对话——但请务必设置消费上限
3. **自动化建议：** Amazon Orders + Atoship 可以组合使用，实现"查订单 → 自动发货"的工作流
4. **Shopify 商家：** Clawpify 几乎可以替代 Shopify Admin 后台的大部分操作，配合批量操作参考文档效率更高

---

*本文是 OpenClaw Skill 每日推荐系列第 26 期，每日介绍一个分类的精选 Skills。*
*关注本博客获取每日更新，发现更多强大的 AI Agent 技能！*
