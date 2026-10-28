---
title: OpenClaw Skill 每日推荐 - 智能家居与物联网（smart-home-and-iot）
tags:
  - openclaw
  - skill
  - smart-home-and-iot
categories:
  - 技术推荐
date: 2026-10-28 11:30:00
---

# OpenClaw Skill 每日推荐 - 智能家居与物联网

> 「OpenClaw Skill 每日推荐」第 26 期。每天从 [awesome-openclaw-skills](https://github.com/openclaw/skills) 的 30 个分类中取一个，精选代表性 skill 深入介绍。今天是 **智能家居与物联网（Smart Home & IoT）**。

## 今日分类概述

智能家居与物联网分类共收录 **43 个 skills**，大概是整个清单里"物理世界接口"最多的一期。剔除十来个明显串错了门的成员（教人类学的 anthropology、教沟通的 communication-coach、讲提示工程的 context-engineering、搞政府采购的 govpredict、做 GTA5 服务器的 fivem-dev……），真正的 IoT 部分覆盖面相当完整：

- **中枢平台**：Home Assistant（glitch-homeassistant）、Homebridge、Homey、IKEA Dirigera、Google Home，几乎每个主流智能家居平台都有对应 skill
- **灯光**：IKEA/TP-Link 灯泡（control-ikea-lightbulb）、Govee 灯带（govee-lights）、WiZ 彩光灯（wiz-light-control）
- **家电与气候**：戴森净化器（dyson-cli）、LGThinQ 白电（lg-thinq）、ecobee 恒温器（beestat）、Google Nest 全家桶（nest-sdm）、Devialet 音箱（devialet）
- **摄像头安防**：Frigate NVR（frigate）、ONVIF 云台摄像头（ipcam）
- **传感器与天气**：DHT11 温湿度（dht11-temp）、WeatherFlow 气象站（tempest-weather）、农场气象（farmos-weather）、去中心化 IoT 数据（nostr-weather）
- **睡眠与穿戴**：Eight Sleep 智能床垫（eightctl）、Arccos 高尔夫传感器（arccos-golf）
- **厨房与工坊**：Anova 低温慢煮棒（anova-oven）、拓竹 3D 打印机（bambu-cli / bambu-local）
- **硬核长尾**：Icom IC-7610 短波电台（icom-7610）、ADB 控电视（google-tv）、全屋音乐场景（home-music）

这个分类有个鲜明特点：**本地优先的 skill 特别多**。dyson-cli、bambu-local、glitch-homeassistant 走的都是局域网直连（MQTT / 本地 API），不依赖厂商云——这既是低延迟的选择，也是隐私的选择。

下面精选 5 个最能代表这个分类的 skills 详解。

## 精选 Skill 详解

### 1. glitch-homeassistant —— 让 agent 接管你的 Home Assistant

**链接**：[github.com/openclaw/skills/.../glitch-homeassistant](https://github.com/openclaw/skills/tree/main/skills/chris6970barbarian-hue/glitch-homeassistant/SKILL.md)

**核心功能**：通过 Home Assistant 的 REST API 控制和查询所有接入 HA 的智能设备。HA 是开源智能家居的事实标准，一旦接上它，agent 的能力就等于你全部设备的总和：灯、窗帘、空调、传感器、扫地机、媒体播放器……

**实用场景**：

- "把客厅灯调到 30% 亮度、色温调暖，然后拉上窗帘"——一句话替代三步手机操作
- 出门前问一句"家里门窗都关好了吗？有几个传感器在报警？"
- 用自然语言描述自动化："工作日早上 7 点，卧室灯渐亮、音响播新闻"，让 agent 帮你翻译成 HA 自动化配置

**技术实现**：Home Assistant 原生提供 REST API，用长期访问令牌（Long-Lived Access Token）认证。`GET /api/states` 拉全部设备状态，`POST /api/services/{domain}/{service}` 下发指令（如 `light.turn_on`）。全程局域网内完成，不经过任何厂商云。skill 本质上是教会 agent 这套 API 的调用姿势和设备域的语义。

**推荐指数**：⭐⭐⭐⭐⭐ —— 只要你家里有 Home Assistant，这就是必装的第一优先级。

### 2. frigate —— 给 AI 摄像头网络录像机装上嘴

**链接**：[github.com/openclaw/skills/.../frigate](https://github.com/openclaw/skills/tree/main/skills/porygonthebot/frigate/SKILL.md)

**核心功能**：访问 Frigate NVR 的摄像头画面与事件数据。Frigate 是最流行的开源自托管 NVR，卖点是用本地 AI 做物体检测（人/车/猫狗/快递员），通常配合 Coral TPU 跑在家庭服务器上。

**实用场景**：

- "把过去 24 小时门口出现过的'人'事件整理成清单，附截图"——巡逻报告自动生成
- "后院出现猫就告诉我一声，别报警，我就想看看"
- 与 glitch-homeassistant 组合：识别到快递员 → 开廊灯 → 推送通知，一条自然语言就能编排的安防联动

**技术实现**：采用会话认证（session-based authentication）登录 Frigate，之后走其 REST API 查询事件列表（含摄像头名、检测标签、起止时间）、拉取事件截图和录像片段。检测本身由 Frigate 完成，skill 专注把"事件流"变成 agent 能理解的对话素材。

**推荐指数**：⭐⭐⭐⭐☆ —— 前提是你已经自建了 Frigate；但只要建了，这几乎是家庭安防体验提升最大的一个 skill。

### 3. dyson-cli —— 不经过云端的戴森空气管理

**链接**：[github.com/openclaw/skills/.../dyson-cli](https://github.com/openclaw/skills/tree/main/skills/tmustier/dyson-cli/SKILL.md)

**核心功能**：通过**本地 MQTT** 控制戴森空气净化器、无叶风扇和暖风机——开关、风速、摆头、温度设定，全都不走戴森官方云。

**实用场景**：

- "卧室 PM2.5 超过 50 就自动开到 5 档"——把净化策略交给 agent 巡查
- 睡前一句"切换到夜间模式，风速调到最低，26 度恒温"
- 配合温湿度传感器数据做全屋空气质量的日报

**技术实现**：戴森设备在局域网内暴露 MQTT broker（1883 端口），用设备序列号 + WiFi 密码派生的凭据完成认证，通过发布/订阅状态主题（`/status`、`/command`）双向通信。dyson-cli 把这套协议封装成命令行，skill 再教 agent 调用它。断网也能用，响应基本无延迟。

**推荐指数**：⭐⭐⭐⭐ —— 本地直连是智能家居该有的样子，可惜只覆盖戴森一家的设备。

### 4. eightctl —— 让 agent 当你的"睡眠管家"

**链接**：[github.com/openclaw/skills/.../eightctl](https://github.com/openclaw/skills/tree/main/skills/steipete/eightctl/SKILL.md)

**核心功能**：控制 Eight Sleep 智能床垫 Pod——查询状态、调节床面温度、管理闹钟和睡眠日程。把"睡眠环境"这类持续微调的任务交给 agent，是这个分类里最有趣的跨界：智能家居与个人健康的交汇点。

**实用场景**：

- "睡前 30 分钟把床降到 18 度，我 11 点上床"——agent 算好时间自动执行
- "工作日 7 点用震动闹钟，周末全部静音"，一句话改完一周的日程
- "把最近一个月的深睡比例和每晚设定温度拉出来对一下，帮我找最优温度"

**技术实现**：走 Eight Sleep 官方云 API 完成认证与控制（这类贴身硬件目前没有本地接口），skill 封装了状态查询、温度设定、闹钟调度等核心操作。作者是 steipete（Peter Steinberger），iOS 圈知名开发者，也是 OpenClaw 社区里最活跃的 skill 贡献者之一。

**推荐指数**：⭐⭐⭐⭐ —— 硬件门槛高（Pod 不便宜），但"用对话管理睡眠参数"这个体验确实先锋。

### 5. bambu-local —— 3D 打印工坊的本地监工

**链接**：[github.com/openclaw/skills/.../bambu-local](https://github.com/openclaw/skills/tree/main/skills/tanguyvans/bambu-local/SKILL.md)

**核心功能**：通过本地 MQTT 直接控制拓竹（Bambu Lab）3D 打印机——查进度、控温、启停打印，完全绕过拓竹云。同门还有个 bambu-cli（侧重命令行运维与排障），两者构成拓竹生态的 agent 接口组合。

**实用场景**：

- "打印进度到一半、到 80%、完成时各提醒我一次"——长打印任务不再需要盯屏
- "读一下摄像头画面，第一层有没有翘边？有就先暂停"
- 与切片工具串联：模型文件就位 → 发起打印 → 全程监控 → 完成通知，一条命令链跑完整条工坊流水线

**技术实现**：拓竹打印机在局域网开放 MQTT over TLS（8883 端口），用设备序列号 + 打印机访问码认证，`device/{serial}/report` 上报状态、`device/{serial}/request` 接收指令。skill 把这些 topic 的报文格式翻译成 agent 能直接操作的接口。

**推荐指数**：⭐⭐⭐⭐ —— maker 用户闭眼装；不打印的人可以跳过，但它展示了"本地协议逆向 + agent"这条路有多好走。

## 应用场景总结

这 5 个 skill 拼起来，正好是一张家庭 agent 的能力地图：

| 层 | 代表 skill | agent 干什么 |
|---|---|---|
| 中枢编排 | glitch-homeassistant | 汇总全部设备，执行自然语言指令与自动化 |
| 安防监控 | frigate / ipcam | 看摄像头、读事件、生成安防报告 |
| 环境舒适 | dyson-cli | 按空气质量与作息自动调节 |
| 健康睡眠 | eightctl | 管理睡眠温控与唤醒日程 |
| 创造工坊 | bambu-local | 监控打印任务，异常即报 |

一个有意思的趋势：这个分类里的高质量 skill 几乎都在做**本地协议**（MQTT、LAN API），而不是调厂商云。agent 站在你家路由器内侧，既快又稳，数据也出不了门。

## 推荐指数排名

| 排名 | Skill | 定位 | 推荐指数 |
|---|---|---|---|
| 1 | [glitch-homeassistant](https://github.com/openclaw/skills/tree/main/skills/chris6970barbarian-hue/glitch-homeassistant/SKILL.md) | 全屋中枢 | ⭐⭐⭐⭐⭐ |
| 2 | [frigate](https://github.com/openclaw/skills/tree/main/skills/porygonthebot/frigate/SKILL.md) | AI 摄像头 NVR | ⭐⭐⭐⭐☆ |
| 3 | [dyson-cli](https://github.com/openclaw/skills/tree/main/skills/tmustier/dyson-cli/SKILL.md) | 本地 MQTT 空气管理 | ⭐⭐⭐⭐ |
| 4 | [eightctl](https://github.com/openclaw/skills/tree/main/skills/steipete/eightctl/SKILL.md) | 智能床垫管家 | ⭐⭐⭐⭐ |
| 5 | [bambu-local](https://github.com/openclaw/skills/tree/main/skills/tanguyvans/bambu-local/SKILL.md) | 3D 打印监工 | ⭐⭐⭐⭐ |

*（同星级的按"受众广度"排序：中枢 > 安防 > 单品类。）*

## 实用建议

1. **先中枢，后单品**。如果你的设备品牌杂，别急着逐个装厂商 skill——先把 Home Assistant 架起来（glitch-homeassistant），多数单品需求它都能覆盖。dyson-cli、bambu-local 这类留给协议级深度控制。

2. **摄像头类 skill 默认只读**。frigate 只给"看"的权限问题不大，但 ipcam 带 ONVIF 云台控制，能转动你的摄像头。安防类 skill 建议：白名单开启、关闭远程写入，agent 能查不能动。

3. **本地优先，云端兜底**。同样控一台设备，优先选局域网直连的实现（dyson-cli、bambu-local、HA 本地 API），延迟低一个量级，而且断网可用；eightctl 这类只有云 API 的，注意别把令牌明文丢在共享环境里。

4. **联动才是智能家居的完全体**。单个 skill 只是遥控器，串起来才是自动化：frigate 识别到人 → glitch-homeassistant 开廊灯 → 推送通知你。agent 的价值正在于用一句自然语言替你写好这条链路。

5. **MQTT 凭据当密码管**。bambu-local、dyson-cli 都依赖设备访问码/WiFi 密码派生凭据，这些等价于设备 root 权限——放在本机安全的位置，别写进会提交到公开仓库的配置文件。

---

*分类清单来自 [awesome-openclaw-skills](https://github.com/openclaw/skills)，明天介绍：**语音与转录（speech-and-transcription）**。*
