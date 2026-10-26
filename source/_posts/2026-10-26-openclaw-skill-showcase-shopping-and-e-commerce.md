---
title: OpenClaw Skill 每日推荐 - 购物与电商（shopping-and-e-commerce）
tags:
  - openclaw
  - skill
  - shopping-and-e-commerce
categories:
  - 技术推荐
date: 2026-10-26 11:30:00
---

# OpenClaw Skill 每日推荐 - 购物与电商

> 「OpenClaw Skill 每日推荐」第 25 期。每天从 [awesome-openclaw-skills](https://github.com/openclaw/skills) 的 30 个分类中取一个，精选代表性 skill 深入介绍。今天是 **购物与电商（Shopping & E-commerce）**。

## 今日分类概述

购物与电商分类共收录 **51 个 skills**，是整个 skill 生态里"烟火气"最重的分类之一。粗看一遍清单，你会发现它覆盖了交易的完整链路：

- **买前**：商品搜索（dupe 找同款、marktplaats 逛二手市集）、比价（csfloat 查皮肤行情）、灵感收集（add-wish 万能愿望清单）
- **买中**：对话式下单（buy-anything、moltpho 自主购物）、外卖点餐（food-order、checkers-sixty60、irish-takeaway）、买菜（gurkerlcli、gousto）
- **买后**：订单管理（amazon-orders）、寄件物流（atoship 比价下单）
- **清单侧**：anylist、listonic 购物清单同步
- **卖家侧**：商品图视频生成（eachlabs-product-visuals）、Shopify 店铺管理（clawpify）、数字产品销售（whop-cli、clawver-digital-products）、评价处理（clawver-reviews）
- **金融支付边角**：moonpay（给 agent 充值）、sp3nd（USDC 买 Amazon 商品）、mt5-httpapi（MetaTrader 5 交易）

有意思的是，这个分类里还混进了几个"看起来不太像购物"的成员——动森大头菜价格预测器 turnip-prophet、日本央行数据 boj-mcp、耶路撒冷咖啡店搜索 jlm-coffee。这也侧面说明：凡是"花钱"的场景，大家都在想办法让 agent 接手。

下面精选 5 个最能代表这个分类的 skills 详解。

## 精选 Skill 详解

### 1. amazon-orders —— 让 agent 管好你的订单历史

**链接**：[github.com/openclaw/skills/.../amazon-orders](https://github.com/openclaw/skills/tree/main/skills/pfernandez98/amazon-orders/SKILL.md)

**核心功能**：通过非官方 Python API 和 CLI 下载并查询你的 Amazon 订单历史。买了什么、花了多少、什么时候到的，全部变成 agent 可查询的结构化数据。

**实用场景**：

- "我上个月在 Amazon 花了多少钱？" —— agent 拉取订单记录，按月汇总
- "去年买的那个降噪耳机什么型号来着？" —— 按关键词搜历史订单
- "这个包裹到底发货了没？" —— 查最新订单的物流状态
- 年度消费复盘：配合数据分析 skill 生成消费报告

**技术实现**：从描述看，它封装了 Amazon 的非官方订单 API，提供 Python 库 + CLI 双入口。OpenClaw agent 通过执行 CLI 命令获取 JSON 结果，再交给模型理解和汇总。登录态走本地 cookie/session，无需在对话中暴露密码。

**推荐指数**：⭐⭐⭐⭐⭐

**入选理由**：它是这个分类里"风险最低、价值最直接"的一个——只读不写，不碰你的钱包，却把最烦的"翻订单"体验彻底改变。所有人都用得上。

### 2. buy-anything —— 对话式购物结账

**链接**：[github.com/openclaw/skills/.../buy-anything](https://github.com/openclaw/skills/tree/main/skills/tsyvic/buy-anything/SKILL.md)

**核心功能**：通过对话式结账直接在 Amazon 购买商品。你说"帮我买一箱农夫山泉"，agent 走完搜索、选品、下单全流程。

**实用场景**：

- 日用品补货："猫粮快没了，按上次那个牌子再来一袋"
- 定期采购自动化：结合 cron 定时任务，每周自动下单耗材
- 帮家人代购：口头描述需求，agent 挑选并下单

**技术实现**：基于 Amazon 的对话式购物结账能力（conversational checkout），agent 充当你的购物代理，在会话中完成商品确认和支付流程。这类 skill 的关键设计在于"确认环节"——下单前向用户展示购物车明细，确认后才执行。

**推荐指数**：⭐⭐⭐⭐

**入选理由**：Agentic shopping 的代表作，真正把"嘴上说一句就买到"变成现实。扣一星是因为涉及真实支付，建议配好 spending limit 再放开用。

### 3. atoship —— 寄件比价 + 折扣面单

**链接**：[github.com/openclaw/skills/.../atoship](https://github.com/openclaw/skills/tree/main/skills/atoship-dev/atoship/SKILL.md)

**核心功能**：AI 帮你寄快递——横向比较 USPS、FedEx、UPS 三家费率，购买折扣面单，全程跟踪物流。

**实用场景**：

- 个人卖家发货：出个二手物件，agent 自动比价选最便宜的渠道
- 小团队发货台：把"打印面单"这件事变成一句"把这单寄了，选最便宜的"
- 物流追踪：发货后主动汇报异常（延迟、派送失败）

**技术实现**：atoship 本身是一个集成了多家承运商 API 的寄件服务，skill 封装其能力供 agent 调用。比价 → 下单 → 出面单 → 追踪是一条完整的物流工作流，agent 只需在关键节点（确认价格、确认收件地址）请求授权。

**推荐指数**：⭐⭐⭐⭐

**入选理由**：把一个高度碎片化的线下流程（开三个网站比价、手填地址、贴单）压缩成一次对话。对经常寄件的人是实打实的省钱 + 省时间。

### 4. anylist —— 购物清单的 agent 化

**链接**：[github.com/openclaw/skills/.../anylist](https://github.com/openclaw/skills/tree/main/skills/mjrussell/anylist/SKILL.md)

**核心功能**：通过 AnyList 管理买菜和购物清单——增删条目、勾选已完成项、跨设备同步（AnyList 本身有 iOS/Android/Web 客户端）。

**实用场景**：

- 语音/聊天记账式加购："牛奶没了" → agent 自动加进清单
- 从菜谱生成清单：看到一道菜谱，agent 把缺的食材批量加入
- 家庭共享清单：你在通勤路上对 agent 说"周末火锅，把这些加上"，家人打开 App 就能看到

**技术实现**：对接 AnyList 的私有 API（逆向实现），agent 直接操作你账号下的清单数据。与同类 listonic（对接 Listonic）二选一即可，取决于你在用哪家清单 App。

**推荐指数**：⭐⭐⭐⭐

**入选理由**：购物清单是最适合 agent 介入的"低风险高频"场景——说错了顶多多买瓶酱油，但它把"随手记"这件事的摩擦力降到了零。

### 5. eachlabs-product-visuals —— AI 生成电商商品图

**链接**：[github.com/openclaw/skills/.../eachlabs-product-visuals](https://github.com/openclaw/skills/tree/main/skills/eftalyurtseven/eachlabs-product-visuals/SKILL.md)

**核心功能**：生成电商级的商品摄影图和视频——把手机随手拍的商品图，变成有专业布光、场景化背景的宣传素材。

**实用场景**：

- 独立卖家上新：一款产品 5 张不同场景的主图，不用租摄影棚
- A/B 测试素材：同一商品批量生成多种风格的 listing 图，看哪张转化好
- 社媒带货内容：短视频素材批量产出

**技术实现**：基于 EachLabs 的 AI 图像/视频生成管线，输入商品原图 + 风格描述，输出成品视觉素材。对 OpenClaw 而言就是"收图 → 调 API → 回传成图"的流水线，可以和其他 skill 串联（比如生成完直接由 clawpify 上架到 Shopify）。

**推荐指数**：⭐⭐⭐⭐

**入选理由**：这个分类不止服务买家，卖家侧的 skill 同样亮眼。商品图是电商的"门面"，AI 生成让小卖家第一次拥有了和大品牌同等质量的视觉能力。

## 应用场景总结

把 51 个 skills 按角色归纳，能看到三条清晰的主线：

**① 买家的完整购物代理**
`add-wish`（种草）→ `dupe`（找同款/平替）→ `buy-anything` / `moltpho`（下单）→ `amazon-orders`（查订单）→ `atoship`（退换货寄件）。这条链路里每一段都有 skill 接管，理论上你可以全程只用嘴完成一次购物。

**② 卖家的轻量电商工作台**
`eachlabs-product-visuals`（做图）→ `clawpify`（Shopify 上架）→ `clawver-reviews`（处理评价）→ `whop-cli`（卖数字产品）。对独立开发者和小卖家来说，一个人 + 一个 agent 就是一个迷你电商部门。

**③ 生活半径的延伸**
买菜（gurkerlcli、gousto）、点外卖（food-order、checkers-sixty60）、逛二手市集（marktplaats、marketplace-clis）、找餐厅（ontopo）。这些区域性强、平台分散的服务，恰好是 skill 生态最擅长的"长尾整合"。

## 推荐指数排名

| 排名 | Skill | 定位 | 推荐指数 |
|------|-------|------|----------|
| 1 | [amazon-orders](https://github.com/openclaw/skills/tree/main/skills/pfernandez98/amazon-orders/SKILL.md) | 订单历史管理 | ⭐⭐⭐⭐⭐ |
| 2 | [buy-anything](https://github.com/openclaw/skills/tree/main/skills/tsyvic/buy-anything/SKILL.md) | 对话式购物 | ⭐⭐⭐⭐ |
| 3 | [atoship](https://github.com/openclaw/skills/tree/main/skills/atoship-dev/atoship/SKILL.md) | 寄件比价物流 | ⭐⭐⭐⭐ |
| 4 | [anylist](https://github.com/openclaw/skills/tree/main/skills/mjrussell/anylist/SKILL.md) | 购物清单 | ⭐⭐⭐⭐ |
| 5 | [eachlabs-product-visuals](https://github.com/openclaw/skills/tree/main/skills/eftalyurtseven/eachlabs-product-visuals/SKILL.md) | 商品图生成 | ⭐⭐⭐⭐ |

*（同星级的按"上手门槛从低到高"排序：只读的先试，碰钱的最后开。）*

## 实用建议

1. **先只读，后写入，最后才碰支付**。这个分类里 skill 的风险等级差异巨大：amazon-orders 只读零风险，anylist 最多改个清单，而 buy-anything / moltpho / sp3nd 涉及真实资金。建议按"只读 → 清单 → 下单"的顺序逐级放开权限。

2. **给花钱类 skill 设硬上限**。无论是 Amazon 对话购物还是 sp3nd 的加密货币支付，都建议在服务端预设单笔/单日消费限额，agent 能做的永远不超出你的容忍度。

3. **清单类 skill 是最佳入门点**。anylist / listonic 几乎零风险，但能让你完整体验"自然语言 → 结构化操作 → 跨端同步"的 agentic 流程，很适合作为第一次玩购物类 skill 的起点。

4. **卖家侧的组合拳价值更大**。单个 skill 只是工具，串起来才是自动化：eachlabs 出图 → clawpify 上架 → atoship 发货 → clawver-reviews 回评，一条龙跑通后，"上新一个产品"的时间成本从几小时降到几分钟。

---

*分类清单来自 [awesome-openclaw-skills](https://github.com/openclaw/skills)，明天介绍：**智能家居与物联网（smart-home-and-iot）**。*
