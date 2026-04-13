---
title: OpenClaw Skill 每日推荐 - 营销与销售
date: 2026-04-13 11:30:00
tags: [openclaw, skill, 营销与销售]
categories: [技术推荐]
---

# OpenClaw Skill 每日推荐 - 营销与销售 (Marketing & Sales)

> 当期分类包含 **103 个** 精选营销与销售相关的 OpenClaw Skills

## 分类概述

营销与销售分类涵盖了从客户开发、内容创作、邮件营销到社交媒体管理的全方位营销工具。这些技能帮助企业和个人创业者自动化营销流程、提升转化率、优化客户体验，并提供数据驱动的决策支持。

## 精选 Skill 详解

### 1. 📧 cold-email - AI 驱动的冷邮件自动化

**GitHub**: [bluecraft-ai/cold-email](https://github.com/openclaw/skills/tree/main/skills/bluecraft-ai/cold-email/SKILL.md)

**核心功能**:
- 生成超个性化的冷邮件序列
- 使用 AI 分析目标客户画像
- 自动优化邮件内容和发送时机

**实用场景**:
```markdown
# B2B 客户开发
目标：SaaS 公司寻找企业客户

1. 分析目标公司业务模式
2. 提取关键决策人信息
3. 生成个性化邮件内容
4. 跟踪邮件打开率和回复率
5. 自动跟进序列
```

**推荐指数**: ⭐⭐⭐⭐⭐ (5/5)

**技术实现机制**:
- 集成多渠道数据源（LinkedIn、公司官网等）
- 使用 LLM 生成个性化文案
- 支持邮件模板动态填充
- 实时分析邮件表现指标

---

### 2. 💰 affiliate-master - 全栈联盟营销自动化

**GitHub**: [michael-laffin/affiliate-master](https://github.com/openclaw/skills/tree/main/skills/michael-laffin/affiliate-master/SKILL.md)

**核心功能**:
- 自动化联盟营销全流程
- 追踪推荐链接和转化数据
- 生成推广内容和分析报告

**实用场景**:
```markdown
# 内容创作者变现
平台：博客 + YouTube + 社交媒体

1. 自动生成 Amazon/Affiliate 链接
2. 监控每个渠道的转化数据
3. 生成月度收入报告
4. 优化推广策略
```

**推荐指数**: ⭐⭐⭐⭐ (4/5)

**技术实现机制**:
- 集成主流联盟平台 API（Amazon、ShareASale 等）
- 自动追踪点击和转化
- 数据可视化仪表板
- 智能推荐高佣金产品

---

### 3. ✍️ content-creator - SEO 优化的内容创作工具

**GitHub**: [alirezarezvani/content-creator](https://github.com/openclaw/skills/tree/main/skills/alirezarezvani/content-creator/SKILL.md)

**核心功能**:
- 创建 SEO 优化的营销内容
- 保持品牌一致性
- 多格式内容生成（博客、广告文案、社交媒体）

**实用场景**:
```markdown
# 产品发布内容矩阵
产品：AI 写作助手

1. 生成产品介绍博客文章
2. 创建社交媒体广告文案
3. 撰写邮件营销内容
4. 制作产品着陆页文案
5. 生成 FAQ 和帮助文档
```

**推荐指数**: ⭐⭐⭐⭐⭐ (5/5)

**技术实现机制**:
- SEO 关键词研究和优化
- 品牌语音配置和一致性检查
- 多平台内容格式适配
- A/B 测试内容变体

---

### 4. 🎯 marketing-strategy-pmm - 产品营销战略专家

**GitHub**: [alirezarezvani/marketing-strategy-pmm](https://github.com/openclaw/skills/tree/main/skills/alirezarezvani/marketing-strategy-pmm/SKILL.md)

**核心功能**:
- 产品定位和价值主张设计
- Go-to-Market (GTM) 策略规划
- 竞争情报分析
- 产品发布计划

**实用场景**:
```markdown
# 新产品上市策略
产品：企业级 SaaS CRM 系统

1. 市场分析和竞争对手研究
2. 定义目标客户画像 (ICP)
3. 设计产品定位和价值主张
4. 制定 GTM 渠道策略
5. 规划产品发布时间表
6. 设定关键指标和里程碑
```

**推荐指数**: ⭐⭐⭐⭐⭐ (5/5)

**技术实现机制**:
- 集成市场研究数据库
- 竞争对手自动追踪
- SWOT 分析框架
- 策略模板库和最佳实践

---

### 5. 📊 brevo - 邮件营销平台集成

**GitHub**: [yujesyoga/brevo](https://github.com/openclaw/skills/tree/main/skills/yujesyoga/brevo/SKILL.md)

**核心功能**:
- 集成 Brevo（原 Sendinblue）邮件营销 API
- 管理联系人列表
- 创建和发送邮件活动
- 分析邮件营销表现

**实用场景**:
```python
# 自动化邮件营销流程
import brevo_api

# 1. 分段联系人列表
segments = brevo.segment_contacts(
    criteria=["购买历史 > 3 次", "最后30天活跃"]
)

# 2. 创建个性化邮件活动
campaign = brevo.create_campaign(
    name="VIP 客户专属优惠",
    template="vip_offer_template",
    segments=segments
)

# 3. 设置自动化触发器
trigger = brevo.set_automation(
    event="用户完成购买",
    action="发送感谢邮件",
    delay="2小时"
)
```

**推荐指数**: ⭐⭐⭐⭐ (4/5)

**技术实现机制**:
- RESTful API 完整集成
- 支持批量操作
- 实时同步数据
- 邮件模板动态渲染

---

## 应用场景总结

### 场景一：B2B 企业客户开发
使用组合：
- `cold-email` - 个性化客户触达
- `apollo` - 客户数据获取
- `marketing-strategy-pmm` - 策略规划
- `content-creator` - 内容创作

**预期效果**：
- 冷邮件回复率提升 3-5 倍
- 销售线索质量提升 40%
- 客户获取成本降低 30%

### 场景二：内容创作者变现
使用组合：
- `affiliate-master` - 联盟营销管理
- `content-creator` - SEO 内容生成
- `simplified-social-media` - 社交媒体管理
- `brevo` - 邮件营销

**预期效果**：
- 月度收入增长 200%
- 内容创作效率提升 10 倍
- 多平台流量增长 150%

### 场景三：新产品发布
使用组合：
- `marketing-strategy-pmm` - GTM 策略
- `content-creator` - 发布内容矩阵
- `meta-ads-report` - 广告效果监控
- `posthog` - 产品分析

**预期效果**：
- 产品曝光量提升 500%
- 用户转化率提升 25%
- 品牌认知度提升 60%

## 推荐指数排名

| 排名 | Skill 名称 | 推荐指数 | 核心优势 |
|------|-----------|---------|---------|
| 1 | marketing-strategy-pmm | ⭐⭐⭐⭐⭐ | 战略层面最全面 |
| 2 | content-creator | ⭐⭐⭐⭐⭐ | 实用性强，适用范围广 |
| 3 | cold-email | ⭐⭐⭐⭐⭐ | B2B 客户开发利器 |
| 4 | affiliate-master | ⭐⭐⭐⭐ | 联盟营销自动化 |
| 5 | brevo | ⭐⭐⭐⭐ | 邮件营销专业工具 |

## 实用建议

1. **从小处开始**：先从单一技能开始，熟练后再组合使用
2. **数据驱动**：始终关注关键指标（打开率、转化率、ROI）
3. **持续优化**：定期分析表现，调整策略
4. **品牌一致性**：使用 `brand-voice-profile` 确保多渠道内容一致
5. **合规优先**：确保邮件营销符合 GDPR、CAN-SPAM 等法规

## 下期预告

明天将介绍第 11 个分类：**Communication (通信工具)** - 145 个 Skills，涵盖邮件、短信、聊天机器人等通信自动化工具。

---

*OpenClaw Skill 每日推荐计划共 30 期，今天是第 11 期。当前进度：11/30*