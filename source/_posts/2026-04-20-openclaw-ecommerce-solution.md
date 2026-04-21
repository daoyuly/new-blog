---
title: OpenClaw 直播销售数据分析完整方案
tags:
  - OpenClaw
  - 电商分析
  - 数据可视化
  - 自动化
  - 智能分析
categories:
  - 技术实践
abbrlink: 26169
date: 2026-04-20 15:34:00
---

# OpenClaw 直播销售数据分析完整方案

在电商直播销售中，数据驱动决策是成功的关键。本文介绍如何使用 OpenClaw 平台实现四大核心功能：一键生成经营报表、智能选品与市场分析、竞品动态实时监控、评价分析优化产品。

## 系统架构概览

```
┌─────────────────────────────────────────────────────────────┐
│                    OpenClaw 核心平台                         │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │ 数据采集引擎  │  │ 分析引擎     │  │ 可视化引擎   │     │
│  │ - 定时任务    │  │ - 数据处理    │  │ - 图表生成   │     │
│  │ - API调用     │  │ - 统计分析    │  │ - 报告生成   │     │
│  │ - 网页抓取    │  │ - 趋势预测    │  │ - 飞书文档   │     │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘     │
└─────────┼────────────────┼──────────────────┼─────────────┘
          │                │                  │
┌─────────▼────────────────▼──────────────────▼─────────────┐
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │ 飞书多维表   │  │ 本地数据库   │  │ 消息通知     │     │
│  │ - 订单数据   │  │ - SQLite     │  │ - 预警推送   │     │
│  │ - 竞品数据   │  │ - JSON文件   │  │ - 定时报表   │     │
│  │ - 评价数据   │  │              │  │              │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
```

## 一、一键生成经营报表

### 核心功能
- 自动拉取多平台订单数据（抖音、淘宝、京东、快手）
- 整合退款、推广等数据
- 生成可视化报表（HTML + Chart.js）
- 快速掌握经营状况

### 实现代码

```javascript
// scripts/ecommerce-report-generator.js
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

// 数据采集函数
async function fetchPlatformData(platform) {
  // 支持平台：抖音、淘宝、京东、快手
  const platforms = {
    douyin: {
      url: 'https://open.douyin.com/data/order',
      export: true
    },
    taobao: {
      url: 'https://trade.taobao.com',
      export: true
    }
  };

  // 使用浏览器自动化或API获取数据
  // ...
}

// 数据整合与统计
function generateStatistics(data) {
  return {
    totalOrders: data.orders.length,
    totalRevenue: data.orders.reduce((sum, o) => sum + o.amount, 0),
    refundRate: (data.refunds / data.orders.length * 100).toFixed(2),
    conversionRate: '5.2%',  // 实际计算
    topProducts: getTopProducts(data.orders),
    dailyTrend: getDailyTrend(data.orders)
  };
}

// 生成可视化报告（Chart.js + HTML）
function generateReport(stats, date) {
  const reportPath = `reports/ecommerce-report-${date}.html`;
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
        <title>电商经营报表 - ${date}</title>
        <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
        <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            .metrics { display: flex; gap: 20px; margin: 20px 0; }
            .card { flex: 1; padding: 20px; background: #f5f5f5; border-radius: 8px; }
            .value { font-size: 2em; font-weight: bold; color: #333; }
            canvas { max-width: 800px; margin: 20px 0; }
        </style>
    </head>
    <body>
        <h1>经营报表 - ${date}</h1>
        <div class="metrics">
            <div class="card">
                <h3>总订单数</h3>
                <p class="value">${stats.totalOrders}</p>
            </div>
            <div class="card">
                <h3>总营收</h3>
                <p class="value">¥${stats.totalRevenue.toLocaleString()}</p>
            </div>
            <div class="card">
                <h3>退款率</h3>
                <p class="value">${stats.refundRate}%</p>
            </div>
        </div>
        <canvas id="trendChart"></canvas>
        <canvas id="productChart"></canvas>
        <script>
            // Chart.js 图表代码
            new Chart(document.getElementById('trendChart'), {
                type: 'line',
                data: {
                    labels: ${JSON.stringify(stats.dailyTrend.labels)},
                    datasets: [{
                        label: '营收趋势',
                        data: ${JSON.stringify(stats.dailyTrend.values)},
                        borderColor: 'rgb(75, 192, 192)',
                        fill: false
                    }]
                }
            });
            // 更多图表...
        </script>
    </body>
    </html>
  `;

  fs.writeFileSync(reportPath, html);
  return reportPath;
}

// 主函数
async function main() {
  const today = new Date().toISOString().split('T')[0];

  // 1. 采集各平台数据
  const douyinData = await fetchPlatformData('douyin');
  const taobaoData = await fetchPlatformData('taobao');

  // 2. 整合数据
  const allData = {
    orders: [...douyinData.orders, ...taobaoData.orders],
    refunds: [...douyinData.refunds, ...taobaoData.refunds],
    promotion: [...douyinData.promotion, ...taobaoData.promotion]
  };

  // 3. 生成统计
  const stats = generateStatistics(allData);

  // 4. 生成报表
  const reportPath = generateReport(stats, today);
  console.log(`报表已生成: ${reportPath}`);

  // 5. 可选：上传到飞书或发送通知
  // await uploadToFeishu(reportPath);
}

main();
```

### 定时任务配置

```bash
# 每天 9:00 生成日报
crontab -e
# 添加：
0 9 * * * cd ~/.openclaw/workspace && node scripts/ecommerce-report-generator.js
```

## 二、智能选品与市场分析

### 核心功能
- 实时监控全网热门趋势
- 自动筛选潜力爆款
- 提供分析报告和推荐
- 多维度评估（搜索趋势、竞争度、利润率等）

### 实现代码

```javascript
// scripts/product-selection-analyzer.js
const { web_search } = require('openclaw-tools');

// 监控全网热门趋势
async function monitorTrends() {
  const keywords = [
    '抖音热销榜 2026',
    '淘宝爆款推荐',
    '小红书种草热门',
    '直播带货热销',
    '季节性爆款',
    '新品爆款趋势'
  ];

  const trendResults = [];
  for (const keyword of keywords) {
    const results = await web_search({
      query: keyword,
      count: 5,
      freshness: 'pw'  // 过去一周
    });
    trendResults.push(...results.web.results);
  }

  return trendResults;
}

// 分析产品潜力
async function analyzeProductPotential(product) {
  const factors = {
    searchTrend: await analyzeSearchTrend(product.name),
    competitionLevel: await analyzeCompetition(product.name),
    pricePoint: analyzePriceRange(product.price),
    seasonality: analyzeSeasonality(product.category),
    profitMargin: calculateProfitMargin(product.cost, product.price)
  };

  // 打分系统
  const score = calculatePotentialScore(factors);

  return {
    product: product.name,
    price: product.price,
    category: product.category,
    score: score,
    factors: factors,
    recommendation: score > 80 ? '强烈推荐' : score > 60 ? '可以考虑' : '不推荐'
  };
}

// 生成选品报告
async function generateSelectionReport() {
  // 1. 获取趋势数据
  const trends = await monitorTrends();

  // 2. 提取候选产品
  const candidates = extractCandidatesFromTrends(trends);

  // 3. 分析每个产品潜力
  const analyses = [];
  for (const candidate of candidates) {
    const analysis = await analyzeProductPotential(candidate);
    analyses.push(analysis);
  }

  // 4. 排序并生成报告
  const sorted = analyses.sort((a, b) => b.score - a.score);
  const report = `
# 智能选品分析报告
**生成时间**: ${new Date().toLocaleString()}

## 🌟 强烈推荐 (Score > 80)
${sorted.filter(p => p.score > 80).map(p =>
  `- **${p.product}** (${p.price}元)\n  - 得分: ${p.score}\n  - 竞争度: ${p.factors.competitionLevel}\n  - 利润率: ${p.factors.profitMargin}%`
).join('\n\n')}

## ✅ 可以考虑 (Score 60-80)
${sorted.filter(p => p.score >= 60 && p.score <= 80).map(p =>
  `- **${p.product}** (${p.price}元) - 得分: ${p.score}`
).join('\n')}

## 📊 市场趋势洞察
${generateTrendInsights(trends)}
  `;

  // 5. 保存报告
  const reportPath = `reports/product-selection-${Date.now()}.md`;
  fs.writeFileSync(reportPath, report);

  // 6. 发送到飞书
  await sendToFeishu(report);

  return reportPath;
}
```

### 定时任务

```bash
# 每天 10:00 和 18:00 分析趋势
crontab -e
# 添加：
0 10,18 * * * cd ~/.openclaw/workspace && node scripts/product-selection-analyzer.js
```

## 三、竞品动态实时监控

### 核心功能
- 7x24小时跟踪竞品
- 监控价格、库存、评价等变化
- 自动预警并生成调价建议
- 支持多平台多竞品监控

### 实现代码

```javascript
// scripts/competitor-monitor.js

// 竞品配置
const competitors = [
  { name: '竞品A', shopId: 'douyin-12345', platform: 'douyin' },
  { name: '竞品B', shopId: 'taobao-67890', platform: 'taobao' }
];

// 监控指标
const metrics = ['price', 'stock', 'rating', 'sales', 'reviews'];

// 存储历史数据
const historyStore = new Map();

async function monitorCompetitor(competitor) {
  const snapshot = {
    timestamp: Date.now(),
    shopId: competitor.shopId,
    platform: competitor.platform
  };

  // 获取当前状态
  for (const metric of metrics) {
    snapshot[metric] = await fetchMetric(competitor, metric);
  }

  // 检测变化
  const previous = historyStore.get(competitor.shopId);
  const alerts = [];

  if (previous) {
    // 价格变化检测
    if (snapshot.price !== previous.price) {
      const change = ((snapshot.price - previous.price) / previous.price * 100).toFixed(2);
      alerts.push({
        type: 'price_change',
        message: `${competitor.name} 价格变化: ¥${previous.price} → ¥${snapshot.price} (${change}%)`,
        severity: Math.abs(change) > 10 ? 'high' : 'medium',
        suggestion: generatePriceSuggestion(change, competitor)
      });
    }

    // 库存预警
    if (snapshot.stock < 10 && previous.stock >= 10) {
      alerts.push({
        type: 'stock_low',
        message: `${competitor.name} 库存不足: 仅剩 ${snapshot.stock} 件`,
        severity: 'high',
        suggestion: '考虑加大库存供应'
      });
    }

    // 评价变化
    if (snapshot.rating < 4.0 && previous.rating >= 4.0) {
      alerts.push({
        type: 'rating_drop',
        message: `${competitor.name} 评分下降: ${previous.rating} → ${snapshot.rating}`,
        severity: 'medium',
        suggestion: '关注用户反馈，改进产品质量'
      });
    }
  }

  // 保存快照
  historyStore.set(competitor.shopId, snapshot);

  // 发送预警
  for (const alert of alerts) {
    if (alert.severity === 'high') {
      await sendAlert(alert);
    }
  }

  return { snapshot, alerts };
}

// 价格调整建议
function generatePriceSuggestion(change, competitor) {
  if (change < -10) {
    return `竞品降价 ${Math.abs(change)}%，建议跟进降价或增加促销`;
  } else if (change > 10) {
    return `竞品涨价 ${change}%，可能是成本上升或品质提升，考虑差异化竞争`;
  } else {
    return `价格小幅波动，保持当前定价策略`;
  }
}

// 发送预警
async function sendAlert(alert) {
  const message = `
⚠️ **竞品监控预警**

**类型**: ${alert.type}
**消息**: ${alert.message}
**时间**: ${new Date().toLocaleString()}

💡 **建议**: ${alert.suggestion}
  `;

  // 发送到飞书、企业微信等
  await sendMessage({
    channel: 'feishu',
    message: message
  });
}

// 7x24小时监控循环
async function startMonitoring() {
  console.log('竞品监控已启动...');

  while (true) {
    for (const competitor of competitors) {
      try {
        await monitorCompetitor(competitor);
      } catch (error) {
        console.error(`监控 ${competitor.name} 失败:`, error);
      }
    }

    // 每15分钟检查一次
    await sleep(15 * 60 * 1000);
  }
}
```

### 部署方式

```bash
# 作为后台服务运行
node scripts/competitor-monitor.js &

# 或使用 pm2 管理进程
npm install -g pm2
pm2 start scripts/competitor-monitor.js --name competitor-monitor
pm2 logs competitor-monitor
```

## 四、评价分析优化产品

### 核心功能
- 抓取商品评价
- 情感分析（正面/中性/负面）
- 提取关键词和问题
- 生成优化建议

### 实现代码

```javascript
// scripts/review-analyzer.js
const { web_search } = require('openclaw-tools');

// 抓取商品评价
async function fetchReviews(productId, platform) {
  // 支持的平台抓取逻辑
  const reviews = [];
  // ... 抓取逻辑
  return reviews;
}

// 情感分析（使用 GLM-5 API）
async function analyzeSentiment(text) {
  const response = await fetch('https://open.bigmodel.cn/api/paas/v4/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.GLM_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'glm-4',
      messages: [{
        role: 'user',
        content: `分析以下评价的情感倾向（正面/中性/负面）并给出原因：\n${text}`
      }]
    })
  });

  const data = await response.json();
  return parseSentimentResult(data);
}

// 批量分析评价
async function analyzeProductReviews(productId) {
  const reviews = await fetchReviews(productId);

  const analysis = {
    total: reviews.length,
    sentiment: { positive: 0, neutral: 0, negative: 0 },
    keywords: {},
    issues: [],
    praises: [],
    suggestions: []
  };

  for (const review of reviews) {
    // 情感分析
    const sentiment = await analyzeSentiment(review.content);
    analysis.sentiment[sentiment.type]++;

    // 提取关键词
    const keywords = extractKeywords(review.content);
    for (const keyword of keywords) {
      analysis.keywords[keyword] = (analysis.keywords[keyword] || 0) + 1;
    }

    // 分类问题与表扬
    if (sentiment.type === 'negative') {
      analysis.issues.push({
        review: review.content,
        reason: sentiment.reason
      });
    } else if (sentiment.type === 'positive') {
      analysis.praises.push({
        review: review.content,
        reason: sentiment.reason
      });
    }
  }

  // 生成优化建议
  analysis.suggestions = generateSuggestions(analysis);

  return analysis;
}

// 生成优化建议
function generateSuggestions(analysis) {
  const suggestions = [];

  // 基于问题生成建议
  const issueMap = {};
  for (const issue of analysis.issues) {
    const key = issue.reason.split(':')[0];
    issueMap[key] = (issueMap[key] || 0) + 1;
  }

  // 问题排序
  const topIssues = Object.entries(issueMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  for (const [issue, count] of topIssues) {
    suggestions.push({
      type: 'improvement',
      priority: count > 10 ? 'high' : 'medium',
      issue: issue,
      count: count,
      suggestion: getImprovementSuggestion(issue)
    });
  }

  // 基于表扬保持优势
  const praiseMap = {};
  for (const praise of analysis.praises) {
    const key = praise.reason.split(':')[0];
    praiseMap[key] = (praiseMap[key] || 0) + 1;
  }

  const topPraises = Object.entries(praiseMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  for (const [praise, count] of topPraises) {
    suggestions.push({
      type: 'maintain',
      feature: praise,
      count: count,
      suggestion: `继续保持 ${praise} 的优势`
    });
  }

  return suggestions;
}

// 生成分析报告
async function generateReviewReport(productId) {
  const analysis = await analyzeProductReviews(productId);

  const report = `
# 商品评价分析报告
**商品ID**: ${productId}
**分析时间**: ${new Date().toLocaleString()}

## 📊 情感分析
- ✅ 正面: ${analysis.sentiment.positive} (${(analysis.sentiment.positive/analysis.total*100).toFixed(1)}%)
- 😐 中性: ${analysis.sentiment.neutral} (${(analysis.sentiment.neutral/analysis.total*100).toFixed(1)}%)
- ❌ 负面: ${analysis.sentiment.negative} (${(analysis.sentiment.negative/analysis.total*100).toFixed(1)}%)

## 🔍 关键词
${Object.entries(analysis.keywords)
  .sort((a, b) => b[1] - a[1])
  .slice(0, 10)
  .map(([k, v]) => `- ${k}: ${v}次`)
  .join('\n')}

## ⚠️ 主要问题
${analysis.issues.slice(0, 10).map(i => `- ${i.reason}`).join('\n')}

## 💡 优化建议
${analysis.suggestions.map(s =>
  s.type === 'improvement'
    ? `### [${s.priority.toUpperCase()}] ${s.issue}\n- 影响: ${s.count} 条评价\n- 建议: ${s.suggestion}`
    : `### ✅ 保持优势: ${s.feature}\n- 好评: ${s.count} 条\n- 建议: ${s.suggestion}`
).join('\n\n')}
  `;

  return report;
}
```

## 数据存储方案

### 使用飞书多维表格

```javascript
// 保存订单数据到飞书
async function saveOrdersToFeishu(orders) {
  const { app_token, table_id } = await feishu_bitable_get_meta({
    url: 'https://example.feishu.cn/base/xxx?table=orders'
  });

  for (const order of orders) {
    await feishu_bitable_create_record({
      app_token,
      table_id,
      fields: {
        '订单号': order.orderId,
        '平台': order.platform,
        '商品名称': order.productName,
        '金额': order.amount,
        '下单时间': order.orderTime,
        '客户ID': order.customerId,
        '状态': order.status
      }
    });
  }
}

// 保存竞品监控数据
async function saveCompetitorData(competitor, snapshot) {
  await feishu_bitable_create_record({
    app_token: 'xxx',
    table_id: 'competitor_monitor',
    fields: {
      '竞品名称': competitor.name,
      '时间': new Date(snapshot.timestamp).toISOString(),
      '价格': snapshot.price,
      '库存': snapshot.stock,
      '评分': snapshot.rating,
      '销量': snapshot.sales,
      '评价数': snapshot.reviews
    }
  });
}
```

## 完整部署方案

### 项目结构

```
~/.openclaw/workspace/
├── ecommerce-analysis/
│   ├── scripts/
│   │   ├── report-generator.js        # 经营报表生成
│   │   ├── product-selector.js        # 智能选品
│   │   ├── competitor-monitor.js      # 竞品监控
│   │   ├── review-analyzer.js         # 评价分析
│   │   └── data-fetcher.js            # 通用数据采集
│   ├── config/
│   │   ├── platforms.json             # 平台配置
│   │   ├── competitors.json           # 竞品配置
│   │   └── credentials.json           # API凭证
│   ├── reports/                       # 报告输出
│   ├── data/                          # 数据缓存
│   └── package.json
└── launchd/
    └── com.openclaw.ecommerce-*.plist # 定时任务配置
```

### 一键启动脚本

```bash
#!/bin/bash
# setup-ecommerce.sh

echo "🚀 设置电商数据分析系统..."

# 1. 创建目录
mkdir -p ~/.openclaw/workspace/ecommerce-analysis/{scripts,config,reports,data,logs}

# 2. 安装依赖
cd ~/.openclaw/workspace/ecommerce-analysis
npm init -y
npm install axios cheerio

# 3. 配置定时任务
# 报表生成：每天 9:00
(crontab -l 2>/dev/null; echo "0 9 * * * cd ~/.openclaw/workspace/ecommerce-analysis && node scripts/report-generator.js >> logs/report.log 2>&1") | crontab -

# 选品分析：每天 10:00, 18:00
(crontab -l 2>/dev/null; echo "0 10,18 * * * cd ~/.openclaw/workspace/ecommerce-analysis && node scripts/product-selector.js >> logs/selector.log 2>&1") | crontab -

# 竞品监控：持续运行（使用 pm2）
npm install -g pm2
pm2 start scripts/competitor-monitor.js --name competitor-monitor

# 评价分析：每天 14:00
(crontab -l 2>/dev/null; echo "0 14 * * * cd ~/.openclaw/workspace/ecommerce-analysis && node scripts/review-analyzer.js >> logs/review.log 2>&1") | crontab -

echo "✅ 设置完成！"
echo "📊 查看报表: ls ~/.openclaw/workspace/ecommerce-analysis/reports/"
echo "🔍 查看日志: tail -f ~/.openclaw/workspace/ecommerce-analysis/logs/*.log"
```

## 实施步骤

### 1. 快速启动（30分钟）

```bash
# 运行设置脚本
chmod +x setup-ecommerce.sh
./setup-ecommerce.sh
```

### 2. 配置平台和竞品

- 编辑 `config/platforms.json` 添加你的店铺
- 编辑 `config/competitors.json` 添加竞品

### 3. 测试运行

```bash
# 手动触发报表生成
node scripts/report-generator.js

# 查看竞品监控状态
pm2 status
pm2 logs competitor-monitor
```

### 4. 查看结果

- 报表自动保存到 `reports/` 目录
- 飞书多维表格实时更新
- 预警消息自动推送

## 核心优势

✅ **完全自动化** - 7x24小时无人值守运行
✅ **多平台集成** - 支持抖音、淘宝、京东等主流平台
✅ **智能分析** - 基于 GLM-5 的深度分析能力
✅ **实时预警** - 竞品变化即时通知
✅ **可视化报告** - 图表清晰展示经营状况
✅ **数据持久化** - 飞书多维表格 + 本地数据库双重保障

## 总结

通过 OpenClaw 平台，我们可以快速构建一套完整的电商数据分析系统，涵盖经营报表、智能选品、竞品监控和评价分析四大核心功能。系统完全自动化运行，帮助商家实现数据驱动的决策，提升运营效率和竞争力。

## 扩展方向

1. **更多平台支持** - 添加拼多多、快手等平台
2. **AI 预测模型** - 基于历史数据预测销量和趋势
3. **移动端适配** - 开发移动端查看报表和预警
4. **团队协作** - 支持多用户权限管理和团队协作

希望这个方案能帮助你在电商直播销售中取得更好的成绩！
