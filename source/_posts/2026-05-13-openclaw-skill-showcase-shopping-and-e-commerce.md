---
title: OpenClaw Skill 每日推荐 - Shopping & E-commerce（购物与电商）
tags:
  - openclaw
  - skill
  - shopping-and-e-commerce
categories:
  - 技术推荐
abbrlink: 43344
date: 2026-05-13 00:00:00
---

# OpenClaw Skill 每日推荐 - Shopping & E-commerce（购物与电商）

> 本系列每天介绍一个 OpenClaw Skill 分类，帮助你发现最实用的 AI 助手技能。今天我们探索 **购物与电商** 分类，共包含 **51** 个实用技能。

## 分类概述

购物与电商分类汇集了各种自动化购物体验、管理电商店铺、分析价格、追踪订单等技能。从 Amazon 自动下单到 Shopify 店铺管理，从加密货币交易到物流运输，这个分类涵盖了现代数字购物的方方面面。

### 主要覆盖领域
- 🛒 在线购物自动化（Amazon、Shopify 等）
- 📦 物流与包裹管理
- 💰 价格追踪与分析
- 🏪 电商店铺运营
- 📱 移动应用集成（外卖、购物清单等）
- 🎮 游戏经济（NFT、预测市场）
- 📈 股票与金融数据查询

---

## 精选 Skill 详解

### 1. 🛍️ buy-anything
**GitHub**: [openclaw/skills](https://github.com/openclaw/skills/tree/main/skills/tsyvic/buy-anything)

**核心功能**：通过对话式结账从 Amazon 购买产品

**实用场景**：
- 自然语言下单：说"帮我在 Amazon 买一套无线耳机"，AI 自动搜索、选择、下单
- 比价购物：描述需求后，AI 比较多个产品并推荐最佳选择
- 重复订单：一键复购之前买过的商品

**技术实现**：
- 集成 Amazon 产品搜索 API
- 实现对话式购物助手，理解用户意图
- 自动处理购物车和结账流程

**推荐指数**：⭐⭐⭐⭐⭐
> 真正实现"说出来就能买"的购物体验，适合懒人购物者！

---

### 2. 📦 atoship
**GitHub**: [atoship-dev/atoship](https://github.com/openclaw/skills/tree/main/skills/atoship-dev/atoship)

**核心功能**：AI 驱动的包裹寄送服务 - 对比 USPS、FedEx、UPS 费率，购买折扣标签，追踪货物

**实用场景**：
- 智能比价：输入包裹信息，自动对比三大承运商的最优价格
- 批量发货：电商卖家批量打印运单，节省时间和成本
- 物流追踪：自动追踪包裹状态，异常预警

**技术实现**：
- 集成 USPS、FedEx、UPS REST API
- 实时运费计算引擎
- 优惠运单购买渠道

**推荐指数**：⭐⭐⭐⭐⭐
> 电商卖家和频繁寄物的必备工具，每次寄包裹都能省钱！

---

### 3. 🏪 clawpify
**GitHub**: [alhwyn/clawpify](https://github.com/openclaw/skills/tree/main/skills/alhwyn/clawpify)

**核心功能**：通过 GraphQL Admin API 查询和管理 Shopify 商店

**实用场景**：
- 库存管理：AI 自动监控库存，缺货时预警或自动补货
- 订单处理：自动分析订单数据，识别趋势和异常
- 产品管理：批量更新产品信息，优化 SEO 描述

**技术实现**：
- Shopify GraphQL Admin API 集成
- 支持产品、订单、客户、库存等核心对象操作
- AI 智能分析和决策

**推荐指数**：⭐⭐⭐⭐
> Shopify 卖家的运营神器，让 AI 帮你管理店铺！

---

### 4. 📋 amazon-orders
**GitHub**: [pfernandez98/amazon-orders](https://github.com/openclaw/skills/tree/main/skills/pfernandez98/amazon-orders)

**核心功能**：下载和查询您的 Amazon 订单历史记录

**实用场景**：
- 账单分析：自动统计每月/每年在 Amazon 的消费
- 订单追踪：快速查询特定商品的订单状态
- 退货管理：识别可退货商品，自动生成退货申请

**技术实现**：
- 使用非官方 Python API 访问 Amazon 账户
- 支持 CLI 命令行查询
- 导出为 CSV/JSON 格式便于分析

**推荐指数**：⭐⭐⭐⭐
> 了解你的消费习惯，Amazon 购物达人的必备工具！

---

### 5. 🤖 moltpho
**GitHub**: [unifiedh/moltpho](https://github.com/openclaw/skills/tree/main/skills/unifiedh/moltpho)

**核心功能**：通过 Moltpho 在 Amazon 上自主购物 - 搜索产品、管理信用

**实用场景**：
- 完全自动化购物：设定预算和偏好，AI 自主完成购物
- 智能补货：监控日用品库存，自动下单补货
- 价格监控：追踪心仪商品价格，降价自动购买

**技术实现**：
- Amazon 产品搜索和购买流程自动化
- 集成支付系统管理
- AI 决策引擎（预算控制、产品评估）

**推荐指数**：⭐⭐⭐⭐⭐
> 让 AI 成为你的私人购物管家，解放你的双手和大脑！

---

## 其他值得关注的 Skills

| Skill 名称 | 核心功能 | 推荐指数 |
|------------|---------|---------|
| **sp3nd** | 使用 USDC (Solana) 在 Amazon 购物 | ⭐⭐⭐⭐ |
| **amazon-competitor-analyzer** | 爬取 Amazon 产品数据，分析竞争对手 | ⭐⭐⭐⭐ |
| **anylist** | 管理 AnyList 购物清单和杂货列表 | ⭐⭐⭐ |
| **checkers-sixty60** | 南非 Checkers Sixty60 配送购物 | ⭐⭐⭐ |
| **gurkerlcli** | 奥地利 Gurkerl 在线杂货购物 | ⭐⭐⭐ |
| **listonic** | 访问 Listonic 购物清单 | ⭐⭐⭐ |
| **stock-price-checker** | 使用 yfinance 检查股票价格 | ⭐⭐⭐⭐ |
| **nft-tracker** | 追踪 NFT 收藏价格、地板价和销售数据 | ⭐⭐⭐ |
| **clawdbites** | 从 Instagram Reels 提取食谱 | ⭐⭐⭐⭐ |
| **turnip-prophet** | 预测动森大头菜价格 | ⭐⭐⭐⭐ |

---

## 应用场景总结

### 💼 电商卖家
- **clawpify** + **atoship**：完整的店铺运营和物流解决方案
- **amazon-competitor-analyzer**：监控竞争对手，优化定价策略

### 🏠 个人消费者
- **buy-anything** / **moltpho**：自动化购物体验
- **amazon-orders**：消费分析和订单管理
- **anylist** / **listonic**：智能购物清单管理

### 💰 投资者
- **stock-price-checker**：实时股价查询
- **nft-tracker**：NFT 市场监控
- **allstock-data**：A股和美股数据查询

### 🎮 游戏玩家
- **turnip-prophet**：动森大头菜价格预测（虚拟经济）

### 🍔 外卖与生鲜
- **checkers-sixty60**：南非外卖配送
- **gurkerlcli**：奥地利生鲜电商
- **food-order**：Foodora 外卖订单管理

---

## 实用建议

### 1. 新手入门路径
如果你是第一次尝试电商类技能，建议从以下开始：

```bash
# 第一步：管理你的 Amazon 订单
amazon-orders

# 第二步：尝试智能购物
buy-anything "帮我在 Amazon 找一个性价比高的无线耳机"

# 第三步：追踪你的消费
# 将订单数据导出为 CSV，用 Excel 或 BI 工具分析
```

### 2. 卖家进阶路径
如果你是电商卖家，可以这样组合使用：

```bash
# 运营店铺
clawpify 查询库存状态

# 处理订单
atoship 对比运费并打印标签

# 分析竞争对手
amazon-competitor-analyzer 检查同类产品价格

# 追踪销量
amazon-orders 分析订单趋势
```

### 3. 安全提醒
- 使用涉及支付的功能（如 buy-anything）时，务必确认 AI 理解了你的意图
- 定期检查自动化订单，避免意外消费
- 保护好 API 密钥和账户凭据

---

## 分类推荐指数总览

| 应用场景 | 推荐技能组合 |
|---------|------------|
| 个人购物 | buy-anything + amazon-orders + anylist |
| 电商运营 | clawpify + atoship + amazon-competitor-analyzer |
| 财务管理 | amazon-orders + stock-price-checker |
| 外卖配送 | checkers-sixty60 / gurkerlcli |
| 投资监控 | nft-tracker + allstock-data |

---

## 下期预告

明天我们将探索 **Smart Home & IoT（智能家居与物联网）** 分类，发现如何用 AI 控制你的智能设备、自动化家居场景！

---

> 💡 **提示**：想要体验这些技能？访问 [Awesome OpenClaw Skills](https://github.com/openclaw/skills) 获取完整列表和安装指南。
>
> 🔗 **更多内容**：关注我们的系列文章，每天解锁新的 OpenClaw 技能！

---
