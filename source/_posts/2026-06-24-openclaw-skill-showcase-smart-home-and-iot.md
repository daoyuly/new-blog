---
title: OpenClaw Skill 每日推荐 - 智能家居与物联网
tags:
  - openclaw
  - skill
  - smart-home-and-iot
categories:
  - 技术推荐
abbrlink: 4676
date: 2026-06-24 11:30:00
description: "今天我们走进 Smart Home & IoT 分类，共收录 43 个 Skills，是 OpenClaw 生态中与物理世界交互最紧密的类别之一。从灯光控制到 3D 打印机，从空气净化器到安防摄像头，你的 AI 助手正在变成真正的\"管家\"。"
keywords: "openclaw, skill, 每日推荐, 智能家居与物联网, smart-home-and-iot, 技术推荐"
---

# 🏠 OpenClaw Skill 每日推荐 — 智能家居与物联网 (Smart Home & IoT)

今天我们走进 **Smart Home & IoT** 分类，共收录 **43 个 Skills**，是 OpenClaw 生态中与物理世界交互最紧密的类别之一。从灯光控制到 3D 打印机，从空气净化器到安防摄像头，你的 AI 助手正在变成真正的"管家"。

---

## 🌟 精选 Skill 详解

### 1. Bambu Local — 本地控制 Bambu Lab 3D 打印机

- **GitHub**: [openclaw/skills - bambu-local](https://github.com/openclaw/skills/tree/main/skills/tanguyvans/bambu-local)
- **核心功能**: 通过本地 MQTT 协议控制 Bambu Lab 3D 打印机，无需云端中转
- **实用场景**:
  - "帮我查看打印机当前状态和进度"
  - "暂停/恢复当前打印任务"
  - "把喷嘴温度调到 220°C"
- **技术实现**: 基于 MQTT 协议直连打印机的本地 IP，绕过 Bambu Cloud，延迟低且无需外网
- **推荐指数**: ⭐⭐⭐⭐⭐

> 💡 **实用建议**: 搭配 `bambu-cli` skill 使用，前者负责本地实时控制，后者提供完整的操作和故障排查能力，两者互补。

---

### 2. Dyson CLI — 本地控制戴森空气净化器/风扇/暖风机

- **GitHub**: [openclaw/skills - dyson-cli](https://github.com/openclaw/skills/tree/main/skills/tmustier/dyson-cli)
- **核心功能**: 通过本地 MQTT 控制 Dyson 系列设备（空气净化器、风扇、暖风机）
- **实用场景**:
  - "把卧室的戴森风扇开到 4 档"
  - "查看当前空气质量指数"
  - "开启自动模式，PM2.5 超标时自动加速"
- **技术实现**: 利用 Dyson 设备本地 MQTT 接口，无需官方 App，实现无云控制
- **推荐指数**: ⭐⭐⭐⭐⭐

> 💡 **实用建议**: Dyson 官方 App 响应慢且需要联网，本地 MQTT 控制几乎零延迟。建议在路由器上给设备绑定固定 IP。

---

### 3. EightCtl — 控制 Eight Sleep 智能床垫

- **GitHub**: [openclaw/skills - eightctl](https://github.com/openclaw/skills/tree/main/skills/steipete/eightctl)
- **核心功能**: 控制 Eight Sleep 智能床垫的温度、闹钟和睡眠计划
- **实用场景**:
  - "把床垫温度调到 15 度，我准备睡了"
  - "设置明天 7 点的振动闹钟"
  - "查看昨晚的睡眠评分"
- **技术实现**: 调用 Eight Sleep 官方 API，支持状态查询、温度调节、闹钟管理
- **推荐指数**: ⭐⭐⭐⭐

> 💡 **实用建议**: 结合 OpenClaw 的定时任务，实现"睡前 30 分钟自动降温 → 入睡后维持 → 起床前 15 分钟升温"的智能睡眠曲线。

---

### 4. Frigate — 安防摄像头 NVR 集成

- **GitHub**: [openclaw/skills - frigate](https://github.com/openclaw/skills/tree/main/skills/porygonthebot/frigate)
- **核心功能**: 访问 Frigate NVR 摄像头系统，支持会话认证
- **实用场景**:
  - "查看前门摄像头最近的运动检测事件"
  - "给我看客厅摄像头的实时画面"
  - "有没有检测到人出现在后院？"
- **技术实现**: 通过 Frigate REST API 交互，支持会话认证、快照抓取、事件查询
- **推荐指数**: ⭐⭐⭐⭐⭐

> 💡 **实用建议**: Frigate 是开源 NVR 的黄金标准，AI 物体检测 + OpenClaw 语音查询 = "嘿，刚才门口是谁？" — 真正的智能安防体验。

---

### 5. Glitch HomeAssistant — Home Assistant 集成

- **GitHub**: [openclaw/skills - glitch-homeassistant](https://github.com/openclaw/skills/tree/main/skills/chris6970barbarian-hue/glitch-homeassistant)
- **核心功能**: 通过 Home Assistant API 控制智能家居设备
- **实用场景**:
  - "把所有灯关了，我要出门"
  - "客厅空调调到 26 度"
  - "检查所有窗户传感器是否关闭"
- **技术实现**: 对接 Home Assistant REST/WebSocket API，可控制 HA 注册的所有设备
- **推荐指数**: ⭐⭐⭐⭐⭐

> 💡 **实用建议**: 如果家里已经有 Home Assistant，这是**必装** skill。HA 是智能家居的"万能中枢"，一个 skill 即可控制全屋设备。

---

## 📊 推荐指数排名

| 排名 | Skill | 推荐指数 | 亮点 |
|------|-------|---------|------|
| 🥇 | Frigate | ⭐⭐⭐⭐⭐ | 安防 NVR + AI 检测，语音查监控 |
| 🥇 | Glitch HomeAssistant | ⭐⭐⭐⭐⭐ | 一 skill 控全屋，HA 用户必备 |
| 🥇 | Bambu Local | ⭐⭐⭐⭐⭐ | 本地 MQTT 控制 3D 打印机 |
| 🥇 | Dyson CLI | ⭐⭐⭐⭐⭐ | 零延迟本地控制戴森设备 |
| 🥈 | EightCtl | ⭐⭐⭐⭐ | 智能床垫温度/闹钟管理 |
| 🥉 | Dirigera Control | ⭐⭐⭐ | IKEA 智能家居网关控制 |
| 🥉 | ipcam | ⭐⭐⭐ | ONVIF 摄像头 PTZ + RTSP |
| 🏅 | Wiz Light Control | ⭐⭐⭐ | 本地 WiFi 控制 Wiz 灯泡 |

---

## 🏠 应用场景总结

### 场景一：全屋语音管家
搭配 **Glitch HomeAssistant** + **Frigate**，通过飞书/Telegram 发消息即可控制全屋设备和查看安防：

```
"把二楼灯关了，前门摄像头有没有异常？"
→ 自动调 HA 关灯 + 查询 Frigate 事件
```

### 场景二：3D 打印远程监控
**Bambu Local** 实时监控打印进度，异常时自动通知：

```
定时任务：每 10 分钟检查打印状态，失败则推送飞书告警
```

### 场景三：智能睡眠环境
**EightCtl** + **Dyson CLI** 联动，打造完美睡眠环境：

```
睡前 → 床垫降温 + 空气净化器开启
入睡后 → 床垫恒温 + 净化器静音模式
起床前 → 床垫升温 + 风扇换气
```

### 场景四：IoT 传感器数据采集
**DHT11 Temp** + **Nostr Plantr** 等传感器 skill，实现环境数据自动采集和告警：

```
温湿度超阈值 → 自动推送通知 + 联动空调/加湿器
```

---

## 💡 实用建议

1. **优先选择本地 MQTT/REST 的 skill**：避免云端依赖，响应更快、隐私更好
2. **Home Assistant 是核心枢纽**：如果你有 HA，装一个 `glitch-homeassistant` 就够了
3. **注意网络安全**：IoT 设备建议放在独立 VLAN，OpenClaw 通过 HA 中转而非直连
4. **善用定时任务**：结合 OpenClaw cron，让智能家居真正"自动"

---

*📅 这是 OpenClaw Skill 每日推荐系列的第 26 篇（共 30 篇）。明天预告：**Speech & Transcription — 语音与转录** 🎤*
