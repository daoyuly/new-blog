---
title: OpenClaw Skill 每日推荐 - Smart Home & IoT（智能家居与物联网）
date: 2026-09-14 11:30:00
tags:
  - openclaw
  - skill
  - smart-home
  - iot
categories:
  - 技术推荐
---

# OpenClaw Skill 每日推荐 - Smart Home & IoT（智能家居与物联网）

> 📅 第 27 天 | 分类索引：26/30 | 共 43 个 Skills

## 今日分类概述

**Smart Home & IoT（智能家居与物联网）** 分类共收录了 43 个 OpenClaw Skills，涵盖了智能家电控制、3D 打印机管理、环境监测、安防摄像头、智能照明、温控系统等多个子领域。这是整个 OpenClaw 生态中与物理世界交互最密切的分类之一。

这些 Skills 的共同特点是：通过本地协议（MQTT、LAN）、云 API 或 CLI 工具，让 OpenClaw Agent 能够直接感知和控制物理设备，真正实现「AI 接入现实世界」。

## 精选 Skill 详解

### 1. 🏠 glitch-homeassistant — Home Assistant 智能家居中枢控制

- **GitHub**: [chris6970barbarian-hue/glitch-homeassistant](https://github.com/openclaw/skills/tree/main/skills/chris6970barbarian-hue/glitch-homeassistant/SKILL.md)
- **推荐指数**: ⭐⭐⭐⭐⭐

**核心功能**：通过 Home Assistant API 统一控制智能家居设备。Home Assistant 是全球最流行的开源智能家居平台，支持超过 2000 种设备的集成。

**实用场景**：
- 「把客厅灯光调到 50% 亮度，色温设为暖白」
- 「出门了，帮我关掉所有灯和空调」
- 「查看前门摄像头有没有检测到人」
- 自动化场景：根据时间、天气、传感器数据自动调节家居设备

**技术实现**：通过 Home Assistant 的 REST API 或 WebSocket API 与本地 HA 实例通信，支持设备状态查询、服务调用、自动化触发等操作。使用长期令牌（Long-Lived Access Token）进行认证。

**为什么推荐**：Home Assistant 是智能家居的事实标准，这个 Skill 让 OpenClaw 成为 HA 的自然语言前端，省去了写自动化 YAML 的麻烦。

```yaml
# 示例：通过 HA API 控制灯光
# OpenClaw Agent 可直接调用
service: light.turn_on
entity_id: light.living_room
data:
  brightness_pct: 50
  color_temp: 350
```

---

### 2. 🛏️ eightctl — Eight Sleep 智能床垫控制

- **GitHub**: [steipete/eightctl](https://github.com/openclaw/skills/tree/main/skills/steipete/eightctl/SKILL.md)
- **推荐指数**: ⭐⭐⭐⭐⭐

**核心功能**：控制 Eight Sleep 智能床垫 Pod，包括温度调节、闹钟管理、睡眠计划、音频播放和床架角度控制。

**实用场景**：
- 「把床垫温度设为 20°C，我要睡了」
- 「明天早上 7 点叫醒我，用渐变闹钟」
- 「查看昨晚的睡眠数据」
- 根据室温自动调节床垫冷暖度

**技术实现**：通过 `eightctl` CLI 工具与 Eight Sleep 非官方 API 通信，认证方式支持配置文件和环境变量。

```bash
# 安装
go install github.com/steipete/eightctl/cmd/eightctl@latest

# 常用命令
eightctl status        # 查看当前状态
eightctl on            # 开启床垫
eightctl temp 20       # 设置温度为 20°C
eightctl alarm list    # 列出闹钟
eightctl alarm create  # 创建闹钟
eightctl schedule list # 查看计划
eightctl audio play    # 播放音频
eightctl base info     # 查看床架信息
```

**配置**：
```yaml
# ~/.config/eightctl/config.yaml
email: your@email.com
password: your_password
```

或通过环境变量：`EIGHTCTL_EMAIL`、`EIGHTCTL_PASSWORD`

**为什么推荐**：Eight Sleep 是高端智能床垫的代表，这个 Skill 做得非常完整，覆盖了设备几乎所有功能。CLI 实现简洁优雅，是 IoT Skill 的标杆之作。

---

### 3. 🖨️ bambu-local — Bambu Lab 3D 打印机本地控制

- **GitHub**: [tanguyvans/bambu-local](https://github.com/openclaw/skills/tree/main/skills/tanguyvans/bambu-local/SKILL.md)
- **推荐指数**: ⭐⭐⭐⭐

**核心功能**：通过本地 MQTT 协议直接控制 Bambu Lab 3D 打印机，无需经过 Bambu Cloud，保障网络延迟和隐私。

**实用场景**：
- 「打印机现在什么状态？还有多久打完？」
- 「暂停打印，我去检查一下」
- 「开始打印上次那个模型文件」
- 批量打印管理：多台打印机状态汇总

**技术实现**：Bambu Lab 打印机原生支持 MQTT 协议进行本地通信。Skill 通过连接打印机本地 IP 的 MQTT 端口（默认 8883），订阅设备状态主题、发布控制指令，实现完全本地的设备控制。

```python
# 伪代码示例：MQTT 通信流程
import paho.mqtt.client as mqtt

# 连接本地打印机
client.connect("192.168.1.xxx", 8883)

# 订阅状态主题
client.subscribe("device/printer/status")

# 发布控制指令
client.publish("device/printer/command", 
    json.dumps({"print": "pause"}))
```

**为什么推荐**：3D 打印是创客和制造领域的核心场景。本地 MQTT 意味着不依赖云服务，断网也能控制，对于工业场景尤为重要。

---

### 4. 🌬️ dyson-cli — Dyson 空气净化器/风扇控制

- **GitHub**: [tmustier/dyson-cli](https://github.com/openclaw/skills/tree/main/skills/tmustier/dyson-cli/SKILL.md)
- **推荐指数**: ⭐⭐⭐⭐

**核心功能**：通过本地 MQTT 控制 Dyson 空气净化器、无叶风扇和加热器，支持开关、风速调节、自动模式切换、夜间模式等。

**实用场景**：
- 「PM2.5 升高了，把净化器开到最大」
- 「睡觉了，切到夜间模式」
- 「关掉加热器，今天够暖了」
- 结合空气质量传感器数据自动调节净化器

**技术实现**：Dyson 设备支持本地 MQTT 通信（需通过 Dyson 账号获取设备凭证后本地连接）。Skill 封装了设备发现、认证、状态读取和指令发送的全流程。

```bash
# 典型使用流程
dyson-cli discover          # 发现局域网内 Dyson 设备
dyson-cli devices           # 列出已配置设备
dyson-cli status <device>   # 查看设备状态
dyson-cli on <device>       # 开启设备
dyson-cli auto <device>     # 切到自动模式
dyson-cli night <device>    # 夜间模式
```

**为什么推荐**：Dyson 是高端家电品牌，其本地 MQTT 支持让它可以被集成进任意自动化系统。这个 Skill 绕过了 Dyson 云服务，响应更快、隐私更好。

---

### 5. 📹 frigate — Frigate NVR 安防摄像头

- **GitHub**: [porygonthebot/frigate](https://github.com/openclaw/skills/tree/main/skills/porygonthebot/frigate/SKILL.md)
- **推荐指数**: ⭐⭐⭐⭐

**核心功能**：访问 Frigate NVR（Network Video Recorder）系统，查看摄像头画面、检索事件记录、管理摄像头配置。支持基于会话的认证。

**实用场景**：
- 「刚才门口有没有人经过？」
- 「查看后门摄像头最新截图」
- 「搜索今天所有检测到人的片段」
- 安防告警：检测到异常后自动通知

**技术实现**：Frigate 是开源的 AI 视频监控 NVR，支持物体检测（人、车、动物等）。Skill 通过 Frigate 的 REST API 进行通信，使用基于会话的认证机制。

```bash
# 查看所有摄像头
frigate cameras

# 获取最新事件
frigate events --limit 10

# 查看特定摄像头快照
frigate snapshot front_door

# 检索今天的录像
frigate recordings front_door --today
```

**为什么推荐**：Frigate 是自托管安防摄像头的最佳方案之一，配合 OpenClaw 可以实现自然语言检索监控画面——这在传统 NVR 系统中几乎不可能做到。

## 应用场景总结

| 场景 | 推荐 Skills | 说明 |
|------|------------|------|
| 🏠 全屋智能家居 | glitch-homeassistant, homey | 统一控制平台，覆盖最多设备 |
| 😴 睡眠优化 | eightctl | 智能床垫 + 温度调节 |
| 🖨️ 3D 打印工作流 | bambu-local, bambu-cli | 本地/远程打印机管理 |
| 🌬️ 空气质量管理 | dyson-cli, beestat | 空气净化 + 温控联动 |
| 📹 家庭安防 | frigate, ipcam, nest-sdm | NVR + 摄像头 + 云监控 |
| 💡 智能照明 | control-ikea-lightbulb, govee-lights, wiz-light-control | 多品牌灯光控制 |
| 🌡️ 环境监测 | dht11-temp, tempest-weather, openmeteo-sh-weather-simple | 传感器数据 + 天气 |
| 🔊 音频管理 | devialet, home-music, google-home | 多品牌音响控制 |

## 推荐指数排名

| 排名 | Skill | 评分 | 理由 |
|------|-------|------|------|
| 1 | glitch-homeassistant | ⭐⭐⭐⭐⭐ | HA 生态最大，设备覆盖最广 |
| 2 | eightctl | ⭐⭐⭐⭐⭐ | 功能完整，CLI 设计优秀，IoT Skill 标杆 |
| 3 | frigate | ⭐⭐⭐⭐ | 开源安防首选，自然语言检索独特 |
| 4 | bambu-local | ⭐⭐⭐⭐ | 本地 MQTT 控制，创客必备 |
| 5 | dyson-cli | ⭐⭐⭐⭐ | 绕过云服务，本地控制高端家电 |
| 6 | homey | ⭐⭐⭐⭐ | Homey 平台生态丰富 |
| 7 | control-ikea-lightbulb | ⭐⭐⭐ | IKEA 智能灯泡，性价比高 |
| 8 | nest-sdm | ⭐⭐⭐ | Google Nest 官方 API，但依赖云服务 |
| 9 | govee-lights | ⭐⭐⭐ | Govee 灯带，氛围照明 |
| 10 | dht11-temp | ⭐⭐⭐ | 入门级传感器，简单实用 |

## 技术实现模式分析

从这 43 个 Skills 中，可以总结出 Smart Home & IoT 的几种主流集成模式：

### 1. 本地 MQTT 协议（推荐）
```
OpenClaw → Skill → MQTT Broker → 设备
```
代表：bambu-local、dyson-cli
优点：低延迟、断网可用、隐私好

### 2. 云 API 集成
```
OpenClaw → Skill → 厂商云 API → 设备
```
代表：govee-lights、lg-thinq、nest-sdm
优点：配置简单、支持远程
缺点：依赖网络和云服务稳定性

### 3. CLI 工具封装
```
OpenClaw → Skill → 本地 CLI → 设备 API
```
代表：eightctl、homey-cli
优点：复用已有工具，调试方便

### 4. 开源平台 API
```
OpenClaw → Skill → Home Assistant / Frigate → 设备
```
代表：glitch-homeassistant、frigate
优点：生态丰富，一个接口控制所有设备

## 实用建议

1. **优先选择本地控制**：如果设备支持 MQTT 或本地 API，优先使用本地方案，避免云服务中断导致设备不可用
2. **以 Home Assistant 为中心**：如果你有多个品牌的设备，先部署 HA，再用 glitch-homeassistant Skill 统一管理
3. **注意安全**：IoT 设备控制涉及物理世界操作，建议在 Skill 中加入确认机制，避免误操作
4. **组合使用**：将环境传感器（dht11-temp）与空气净化器（dyson-cli）联动，实现自动空气质量调节
5. **社区关注**：这个分类更新很快，定期查看 ClawHub 获取新 Skill

---

> 📌 明日预告：**Speech & Transcription（语音与转录）** 分类 — 探索 OpenClaw 在语音识别、TTS、语音助手方面的能力
