---
title: OpenClaw Skill 每日推荐 - 智能家居与物联网
tags:
  - openclaw
  - skill
  - smart-home
  - iot
categories:
  - 技术推荐
abbrlink: 4677
date: 2026-08-05 11:30:00
---

# OpenClaw Skill 每日推荐 - 智能家居与物联网 🏠

> 今日分类：**Smart Home & IoT**（智能家居与物联网）
> 共收录 **43 个 Skills**，覆盖智能照明、安防监控、3D 打印、智能恒温器、天气监测等多个子领域。

## 📋 分类概述

智能家居与物联网是 OpenClaw Skill 生态中最实用的分类之一。这个分类将 AI 助手的能力延伸到了物理世界——从控制一盏灯到管理整套智能家居系统，从读取传感器数据到操作 3D 打印机。43 个 Skills 涵盖了主流智能家居平台（Home Assistant、Homey、Homebridge）、品牌设备（IKEA、LG、Dyson、Nest、Govee）以及 IoT 协议（MQTT、ONVIF、RTSP、Nostr）。

下面精选 5 个最具代表性的 Skills 进行详细解读。

---

## 🏆 精选 Skill 详解

### 1. Homey — Athom 智能家居中枢控制

| 项目 | 详情 |
|------|------|
| **GitHub** | [openclaw/skills - maxsumrall/homey](https://github.com/openclaw/skills/tree/main/skills/maxsumrall/homey/SKILL.md) |
| **作者** | maxsumrall |
| **推荐指数** | ⭐⭐⭐⭐⭐ |

**核心功能：**
通过 Athom Homey 智能家居平台的本地（LAN/VPN）或云端 API，实现对家中所有已接入 Homey 的设备进行控制。Homey 作为 Zigbee/Z-Wave/Wi-Fi/Bluetooth 多协议网关，是欧洲最受欢迎的智能家居中枢之一。

**实用场景：**
- "把客厅灯调到 50% 亮度"
- "把恒温器设为 22°C"
- "锁上前门"
- "启动'离家'场景——关灯、锁门、调低空调"

**技术实现：**
通过 Homey 的 REST API 进行通信，支持本地网络和云端两种连接模式。本地模式延迟更低（<100ms），适合实时控制；云端模式支持远程访问。Skill 封装了设备发现、状态查询、动作执行等核心 API 调用。

**为什么推荐：**
Homey 本身支持 50,000+ 设备，是真正的"万能网关"。将 OpenClaw 接入后，你可以用自然语言控制整个家，而不再依赖固定的语音指令或 App 操作流程。

---

### 2. Frigate — AI 安防监控 NVR

| 项目 | 详情 |
|------|------|
| **GitHub** | [openclaw/skills - porygonthebot/frigate](https://github.com/openclaw/skills/tree/main/skills/porygonthebot/frigate/SKILL.md) |
| **作者** | porygonthebot |
| **推荐指数** | ⭐⭐⭐⭐⭐ |

**核心功能：**
接入 Frigate NVR（Network Video Recorder）系统，这是一个开源的、基于 AI 目标检测的安防监控方案。支持会话认证、多摄像头管理、事件回放和实时快照。

**实用场景：**
- "前门有没有检测到人？"
- "给我看后院摄像头最近 10 分钟的录像"
- "车库门的摄像头还在在线吗？"
- "有没有检测到猫进入院子？"

**技术实现：**
Frigate 本身使用 Google Coral TPU 或 OpenVINO 进行本地 AI 目标检测（人、车、猫、狗等），无需云端订阅。Skill 通过 Frigate 的 HTTP API 实现认证会话管理，查询摄像头状态、获取事件快照和录像片段。

**为什么推荐：**
Frigate 是目前开源安防领域最成熟的方案之一，配合 OpenClaw 后可以实现"智能巡检"——比如每天定时检查各摄像头状态、异常事件主动通知。相比 Ring/Nest 等订阅制产品，隐私性和可扩展性都远超一筹。

---

### 3. EightCtl — Eight Sleep 智能床垫控制

| 项目 | 详情 |
|------|------|
| **GitHub** | [openclaw/skills - steipete/eightctl](https://github.com/openclaw/skills/tree/main/skills/steipete/eightctl/SKILL.md) |
| **作者** | steipete |
| **推荐指数** | ⭐⭐⭐⭐ |

**核心功能：**
控制 Eight Sleep Pod 智能床垫——支持状态查询、温度调节、闹钟管理和睡眠计划配置。Eight Sleep 是高端智能床垫的代表，能根据睡眠阶段自动调节床面温度。

**实用场景：**
- "把床的温度调到 24°C"
- "明天早上 7 点用震动闹钟叫醒我"
- "我昨晚的睡眠评分是多少？"
- "把起床预热时间提前 30 分钟"

**技术实现：**
通过 Eight Sleep 的云端 API 进行交互。支持查询 Pod 的实时状态（当前温度、水位、固件版本等）、设置温度档位和睡眠计划、管理闹钟。作者 steipete（知名 iOS 开发者 Peter Steinberger）在 API 封装上做了精细的状态管理。

**为什么推荐：**
这个 Skill 展示了 OpenClaw 在"健康睡眠"场景的独特价值——不是简单地把空调设为某个温度，而是根据个人睡眠数据动态优化。配合天气 Skill 和日历 Skill，可以实现"明天有早会，提前 15 分钟调温唤醒"这样的复合自动化。

---

### 4. Bambu CLI — 3D 打印机控制

| 项目 | 详情 |
|------|------|
| **GitHub** | [openclaw/skills - tobiasbischoff/bambu-cli](https://github.com/openclaw/skills/tree/main/skills/tobiasbischoff/bambu-cli/SKILL.md) |
| **作者** | tobiasbischoff |
| **推荐指数** | ⭐⭐⭐⭐ |

**核心功能：**
通过命令行操作和排查 Bambu Lab 3D 打印机问题。Bambu Lab 是近年来最受关注的桌面 3D 打印机品牌，以高速、高精度和自动校准著称。

**实用场景：**
- "X1C 打印机现在的状态是什么？"
- "打印进度到多少了？还剩多久？"
- "AMS 的四个料槽分别是什么材料？"
- "上次打印失败的原因是什么？"

**技术实现：**
基于 bambu-cli 命令行工具，通过 MQTT 或 Bambu 云端 API 与打印机通信。支持查询打印机状态、打印进度、AMS（自动供料系统）耗材信息、历史打印记录和错误日志。

**为什么推荐：**
3D 打印是典型的"长周期任务"——一次打印动辄几小时甚至几十小时。通过 OpenClaw，你可以在打印过程中随时用自然语言询问进度、排查异常，而不需要打开 Bambu Studio 或手机 App。搭配列表中另一个 Skill `bambu-local`（通过 MQTT 本地控制），可以实现完全离线的打印机管理。

---

### 5. Glitch HomeAssistant — Home Assistant API 集成

| 项目 | 详情 |
|------|------|
| **GitHub** | [openclaw/skills - chris6970barbarian-hue/glitch-homeassistant](https://github.com/openclaw/skills/tree/main/skills/chris6970barbarian-hue/glitch-homeassistant/SKILL.md) |
| **作者** | chris6970barbarian-hue |
| **推荐指数** | ⭐⭐⭐⭐⭐ |

**核心功能：**
通过 Home Assistant 的 REST API 控制智能家居设备。Home Assistant 是全球最大的开源智能家居平台，支持 2000+ 品牌的设备集成。

**实用场景：**
- "把家里所有的灯关掉"
- "客厅温度是多少？湿度呢？"
- "触发'看电影'场景"
- "洗衣机还有多久洗完？"

**技术实现：**
通过 Home Assistant 的 REST API（`/api/states`、`/api/services`、`/api/events`）进行交互。支持设备状态查询、服务调用（开关灯、设置温度等）、事件监听和自动化触发。使用 Long-Lived Access Token 进行认证。

**为什么推荐：**
Home Assistant 是智能家居的"终极方案"——如果你有不同品牌的设备，HA 可以统一管理。将 OpenClaw 接入后，相当于给你的 AI 助手装上了"控制整个家"的能力。与 Homey Skill 类似但面向不同的生态系统：Home Assistant 更适合极客和 DIY 玩家，Homey 更适合注重易用性的用户。

---

## 📊 推荐指数排名

| 排名 | Skill | 推荐指数 | 适用人群 |
|------|-------|----------|----------|
| 1 | Homey | ⭐⭐⭐⭐⭐ | Homey 中枢用户 |
| 2 | Frigate | ⭐⭐⭐⭐⭐ | 安防监控爱好者 |
| 3 | Glitch HomeAssistant | ⭐⭐⭐⭐⭐ | Home Assistant 用户 |
| 4 | EightCtl | ⭐⭐⭐⭐ | Eight Sleep 床垫用户 |
| 5 | Bambu CLI | ⭐⭐⭐⭐ | Bambu Lab 打印机用户 |

---

## 🎯 应用场景总结

### 场景一：全屋智能控制
选择 Homey 或 Home Assistant 作为中枢，通过 OpenClaw 用自然语言控制全屋设备。不再需要记住"哪个 App 控制哪个设备"。

### 场景二：智能安防巡检
Frigate + OpenClaw 实现每日自动巡检：检查所有摄像头在线状态、查看夜间异常事件、生成安防报告。

### 场景三：睡眠健康管理
EightCtl 记录睡眠数据 → 天气 Skill 获取温湿度 → OpenClaw 分析关联 → 自动优化床垫温度设置。

### 场景四：3D 打印远程监控
打印启动后通过 OpenClaw 监控进度，异常时自动通知。配合 `bambu-local` Skill 实现完全本地化控制。

### 场景五：多协议设备统一管理
列表中还包含 IKEA Dirigera（`dirigera-control`）、Dyson（`dyson-cli`）、LG ThinQ（`lg-thinq`）、Govee 灯带（`govee-lights`）、Wiz 灯泡（`wiz-light-control`）等品牌专属 Skill。如果你的家里是"多品牌混搭"，可以按需安装对应的 Skill。

---

## 💡 实用建议

1. **先选平台，再选 Skill**：如果你还没有智能家居中枢，建议从 Home Assistant 开始（免费、开源、社区庞大），然后安装 `glitch-homeassistant` Skill。

2. **本地优先**：优先选择支持本地控制的 Skill（如 `bambu-local`、`dyson-cli` 通过 MQTT），减少对云端的依赖，响应更快、隐私更好。

3. **组合使用**：智能照明的最佳实践是 `control-ikea-lightbulb` + `govee-lights` + `wiz-light-control` 按品牌安装，再用 Home Assistant 统一管理。

4. **安防场景注意隐私**：Frigate 的 AI 检测完全在本地运行，不上传云端。配合 OpenClaw 查询时，建议仅获取事件摘要而非视频流。

5. **IoT 数据上链**：列表中有 `nostr-plantr` 和 `nostr-weather` 两个基于 Nostr 协议的 IoT 数据 Skill，代表了 IoT 数据去中心化的新方向，值得关注。

---

## 📎 完整 Skill 列表速览

| Skill | 描述 |
|-------|------|
| anova-oven | 控制 Anova 精准烤箱和低温慢煮棒 |
| bambu-cli | Bambu Lab 3D 打印机命令行控制 |
| bambu-local | 通过 MQTT 本地控制 Bambu Lab 打印机 |
| beestat | 通过 Beestat API 查询 ecobee 恒温器数据 |
| control-ikea-lightbulb | 控制 IKEA/TP-Link Kasa 智能灯泡 |
| devialet | 通过 HTTP API 控制 Devialet Phantom 音箱 |
| dht11-temp | 从 DHT11 传感器读取温湿度 |
| dirigera-control | 控制 IKEA Dirigera 智能家居设备 |
| dyson-cli | 通过本地 MQTT 控制 Dyson 空气净化器/风扇/加热器 |
| eightctl | 控制 Eight Sleep 智能床垫 |
| enzoldhazam | NGBS iCON 智能恒温器控制 |
| frigate | 接入 Frigate NVR 安防摄像头系统 |
| glitch-homeassistant | 通过 Home Assistant API 控制设备 |
| google-home | 控制 Google Nest 设备 |
| google-tv | 通过 ADB 控制 Chromecast with Google TV |
| govee-lights | 通过 Govee API 控制智能灯带 |
| home-music | 结合 Spotify 播放控制全屋音乐场景 |
| homebridge | 通过 Homebridge 控制 HomeKit 设备 |
| homey | 控制 Athom Homey 智能家居设备 |
| homey-cli | 控制 Homey 自动化中枢 |
| ipcam | ONVIF PTZ 控制 + RTSP 抓取 + 摄像头发现 |
| lg-thinq | 通过 ThinQ API 控制 LG 智能家电 |
| nest-sdm | 通过 Google SDM API 控制 Nest 设备 |
| tempest-weather | 从 WeatherFlow Tempest 气象站获取数据 |
| wiz-light-control | 通过本地 WiFi 控制 Wiz 智能灯泡 |

> 完整 43 个 Skills 的列表请查看 [OpenClaw Skills 仓库](https://github.com/openclaw/skills)。

---

*本文是 OpenClaw Skill 每日推荐系列的第 27 篇，每日介绍一个分类，共 30 个分类。明天预告：**Speech & Transcription（语音与转录）**——探索语音识别、TTS、语音助手相关的 Skills。*

---

*发布时间：2026-08-05 11:30 CST*
*分类索引：27/30*
