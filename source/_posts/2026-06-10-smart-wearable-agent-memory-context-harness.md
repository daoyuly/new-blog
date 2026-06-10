---
title: 智能穿戴设备的 Agent 记忆、上下文与 Harness 架构综述
date: 2026-06-10 10:00:00
tags:
  - AI Agent
  - 智能穿戴
  - 记忆架构
  - 上下文管理
  - Harness
  - 智能眼镜
  - 智能戒指
  - 智能吊坠
categories:
  - AI Agent
  - 智能硬件
---

# 智能穿戴设备的 Agent 记忆、上下文与 Harness 架构综述

## 摘要

智能穿戴设备——智能眼镜、智能戒指、智能吊坠——正在从被动传感器集合演变为主动的 AI Agent 载体。与手机或桌面设备不同，穿戴设备具有 always-on 感知、极低延迟需求、严格功耗约束和深度隐私敏感等独特属性。这些属性对 Agent 的记忆系统、上下文管理和 Harness 编排架构提出了根本性的新要求。本文系统性地分析三类穿戴设备的能力边界，提出面向穿戴场景的四层记忆架构（感知记忆→情景记忆→语义记忆→程序记忆），设计多模态上下文融合与隐私优先的上下文管理策略，并构建端云协同的 Harness 编排框架。最后讨论关键挑战与未来方向。

**关键词**: AI Agent, 智能穿戴, 记忆架构, 上下文管理, Harness, 端云协同, 隐私计算

---

## 1. 引言

### 1.1 从工具到伙伴：穿戴设备的 Agent 化转型

2024-2026 年间，智能穿戴设备经历了从"传感器+手机附属"到"独立 Agent 载体"的根本性转变。Meta Ray-Ban 智能眼镜集成了 Llama 多模态模型，实现了实时视觉问答；Humane AI Pin 尝试以独立硬件承载全天候 AI 助手；各类智能戒指（Oura Ring、Colmi Ring）从健康监测走向情境感知建议；智能吊坠（Limitless Pendant、Friend）则探索了"记忆伴侣"这一全新品类。

这一转型的核心驱动力是：**穿戴设备是唯一真正 always-on、always-with-you 的计算形态**。手机放在桌上时是沉默的，而眼镜看到的就是用户看到的，戒指感受到的就是用户感受到的。这种亲密性使得穿戴设备天然适合成为 AI Agent 的感知器官和交互界面。

### 1.2 为什么需要新的架构

传统 Agent 架构（如 ReAct、Plan-and-Execute、AutoGPT）运行在服务器端，假设充足的算力、不受限的上下文窗口和无感知延迟。穿戴设备打破了一切假设：

| 维度 | 传统 Agent | 穿戴 Agent |
|------|-----------|-----------|
| 算力 | GPU 集群 | 边缘 NPU，1-10 TOPS |
| 延迟容忍 | 秒级 | 毫秒级（AR 叠加、实时翻译） |
| 上下文来源 | 文本为主 | 多模态（视觉+语音+触觉+环境） |
| 隐私约束 | 服务器端可控 | 近身感知，极度敏感 |
| 功耗预算 | 不受限 | 电池 < 300mAh |
| 网络假设 | 始终在线 | 弱网/离线必须降级 |
| 交互模式 | 键盘/触屏 | 语音/手势/眼神/触觉 |

这意味着我们不能简单地将云端 Agent 移植到穿戴设备上，而需要从记忆、上下文和编排三个维度重新设计架构。

### 1.3 本文贡献

1. 系统分析智能眼镜、智能戒指、智能吊坠三类设备的能力边界与 Agent 适用场景
2. 提出面向穿戴设备的四层记忆架构（WearMem）
3. 设计多模态上下文融合框架（WearCtx）与隐私优先策略
4. 构建端云协同的 Harness 编排架构（WearHarness）
5. 讨论关键挑战与未来方向

---

## 2. 三类穿戴设备的能力边界与交互模式

### 2.1 智能眼镜（Smart Glasses）

**代表产品**: Meta Ray-Ban、Snap Spectacles、Xreal Air、Rokid AR Lite

**感知能力矩阵**:

| 传感器 | 典型规格 | Agent 价值 |
|--------|---------|-----------|
| 摄像头 | 12MP，30fps | 场景理解、OCR、人脸识别、物体检测 |
| 麦克风阵列 | 3-5 麦，波束成形 | 语音指令、环境声识别、实时翻译 |
| IMU | 6/9 轴 | 头部姿态、手势识别、活动检测 |
| 骨传导/扬声器 | 开放式 | 语音反馈、音频AR |
| 环境光传感器 | ALS | 光照适应、场景切换 |
| 眼动追踪 | IR camera（高端） | 注意力分析、意图推断 |

**交互模式**:
- **语音优先**: "Hey Meta" 式语音唤醒是最主要入口
- **视觉辅助**: AR 叠加信息（导航箭头、翻译文字、物体标签）
- **手势辅助**: 触摸镜腿、点头/摇头
- **眼动交互**: 注视选择、视线追踪（高端型号）

**Agent 角色定位**: 视觉助手 + 实时翻译官 + 情境顾问。眼镜是唯一能"看到用户所见"的设备，这赋予了它独特的 Agent 能力——理解用户的视觉上下文并主动提供建议。

### 2.2 智能戒指（Smart Ring）

**代表产品**: Oura Ring Gen 4、Colmi R02、Samsung Galaxy Ring、Ultrahuman Ring Air

**感知能力矩阵**:

| 传感器 | 典型规格 | Agent 价值 |
|--------|---------|-----------|
| PPG 心率 | 绿/红/红外 LED | 心率、HRV、压力检测 |
| 皮肤温度 | 热敏电阻 | 体温趋势、睡眠质量、健康预警 |
| 加速度计 | 3 轴 | 活动识别、睡眠分期、步态分析 |
| 血氧 SpO2 | 红外+红光 | 血氧监测、呼吸健康 |
| 电极（部分） | EDA | 压力反应、情绪推断 |

**交互模式**:
- **无屏交互**: 戒指无显示，输出依赖其他设备或触觉反馈
- **手势控制**: 双击、旋转（部分型号）
- **触觉反馈**: 微型马达震动提醒
- **被动感知**: 7×24 小时连续生理数据采集

**Agent 角色定位**: 健康守卫 + 生理哨兵 + 微交互触发器。戒指是最低侵入性的穿戴设备，用户几乎忘记它的存在，这使它成为理想的被动感知节点。它不能独立完成复杂 Agent 任务，但可以作为 Agent 感知网络的关键组成部分。

### 2.3 智能吊坠（Smart Pendant）

**代表产品**: Limitless Pendant、Friend、Humane AI Pin（胸针形态）

**感知能力矩阵**:

| 传感器 | 典型规格 | Agent 价值 |
|--------|---------|-----------|
| 麦克风阵列 | 2-3 麦 | 对话记录、会议摘要、语音交互 |
| 摄像头（部分） | 5-12MP | 场景记录、拍照识物 |
| 加速度计 | 3 轴 | 活动检测、佩戴状态 |
| 触控面板 | 电容触控 | 简单交互控制 |
| NFC/蓝牙 | BLE 5.0 | 设备配对、数据同步 |

**交互模式**:
- **对话记忆**: 持续录音并生成对话摘要（Limitless 核心功能）
- **语音交互**: 按键或触摸唤醒
- **触觉反馈**: 震动通知
- **视觉辅助**: 拍照+AI 分析（AI Pin）

**Agent 角色定位**: 记忆伴侣 + 对话助手 + 社交辅助。吊坠的核心理念是"记住你说过的每一句话"，这使它天然适合做长期记忆 Agent。它不试图替代手机，而是填补一个空白——被动记录和主动回忆。

### 2.4 三类设备的 Agent 能力对比

```
                    智能眼镜    智能戒指    智能吊坠
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
主动感知范围        ★★★★★     ★★☆☆☆     ★★★☆☆
交互带宽           ★★★★☆     ★☆☆☆☆     ★★★☆☆
佩戴舒适度         ★★★☆☆     ★★★★★     ★★★★☆
电池续航           ★★☆☆☆     ★★★★★     ★★★☆☆
隐私敏感度         ★★★★★     ★★★★☆     ★★★★★
独立 Agent 能力    ★★★★☆     ★☆☆☆☆     ★★★☆☆
多设备协同价值      ★★★★★     ★★★★★     ★★★★☆
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**关键洞察**: 没有单一设备能独立承担完整的 Agent 职能。理想的穿戴 Agent 是**多设备协同网络**——眼镜负责视觉理解，戒指负责生理感知，吊坠负责对话记忆，三者共享上下文和记忆，由 Harness 统一编排。

---

## 3. 记忆架构：WearMem

人类记忆系统的认知科学模型（Atkinson-Shiffrin 模型、Tulving 多系统理论）为 Agent 记忆提供了天然参考。我们提出面向穿戴设备的四层记忆架构 **WearMem**：

```
┌─────────────────────────────────────────────────────┐
│                   程序记忆 (Procedural)               │  ← 自动化技能
│              技能库 · 习惯模型 · 条件反射              │
├─────────────────────────────────────────────────────┤
│                   语义记忆 (Semantic)                 │  ← 知识与偏好
│           知识图谱 · 用户画像 · 领域知识库              │
├─────────────────────────────────────────────────────┤
│                   情景记忆 (Episodic)                 │  ← 行为模式
│          事件序列 · 行为模式 · 时间线索引               │
├─────────────────────────────────────────────────────┤
│                   感知记忆 (Sensory)                  │  ← 原始感知
│         传感器缓冲 · 多模态帧 · 环境快照               │
└─────────────────────────────────────────────────────┘
         ← 短期/低层 ────────────── 长期/高层 →
         ← 设备端存储 ────────────── 云端存储 →
         ← 高频访问 ────────────── 低频访问 →
```

### 3.1 感知记忆（Sensory Memory）

**定义**: 对传感器原始数据的极短期缓存，持续毫秒到秒级。

**穿戴场景的特殊性**:
- 多模态数据速率极高：12MP 摄像头 30fps 产生约 1.2GB/s 原始数据
- 大部分数据无 Agent 价值，需要实时过滤
- 必须在设备端完成，不可上传原始流

**架构设计**:

```python
class SensoryMemory:
    """感知记忆：传感器数据的环形缓冲与注意力过滤"""
    
    def __init__(self, device_type: str):
        self.device_type = device_type
        # 环形缓冲区，按设备类型配置
        self.buffers = {
            "glasses": {
                "visual": RingBuffer(capacity=30, dtype="frame"),    # 1秒视频
                "audio": RingBuffer(capacity=16000, dtype="sample"), # 1秒音频
                "imu": RingBuffer(capacity=200, dtype="vector"),     # IMU数据
            },
            "ring": {
                "ppg": RingBuffer(capacity=100, dtype="float"),      # 心率信号
                "temp": RingBuffer(capacity=10, dtype="float"),      # 温度
                "accel": RingBuffer(capacity=100, dtype="vector"),   # 加速度
            },
            "pendant": {
                "audio": RingBuffer(capacity=48000, dtype="sample"), # 对话音频
                "imu": RingBuffer(capacity=50, dtype="vector"),
            }
        }
        # 注意力过滤器：决定哪些感知值得提升到情景记忆
        self.attention_filter = MultiModalAttentionFilter()
    
    def ingest(self, modality: str, data: Any) -> Optional[SensoryEvent]:
        """摄入感知数据，注意力过滤后决定是否提升"""
        self.buffers[self.device_type][modality].push(data)
        
        # 注意力过滤：只有显著事件才提升
        if self.attention_filter.is_salient(modality, data):
            return SensoryEvent(
                timestamp=time.now(),
                modality=modality,
                embedding=self._encode(modality, data),
                metadata=self._extract_metadata(modality, data)
            )
        return None
```

**注意力过滤策略**:

| 策略 | 眼镜 | 戒指 | 吊坠 |
|------|------|------|------|
| 变化检测 | 视觉场景变化 | 生理指标突变 | 语音活动检测 |
| 重要性评分 | 物体/人脸检测 | 异常心率/血氧 | 关键词/情感检测 |
| 用户关联 | 注视点分析 | 压力峰值 | 被点名/被提问 |
| 频率过滤 | 每 3-5 帧采样 | 每分钟聚合 | 语音段检测 |

**关键约束**: 感知记忆必须在端侧完成全部处理。原始传感器数据永远不应离开设备——只有注意力过滤后的**摘要**和**嵌入向量**可以被传输到更高层记忆。

### 3.2 情景记忆（Episodic Memory）

**定义**: 对用户经历的事件序列的长期记录，支持按时间、地点、情境检索。

**穿戴场景的特殊性**:
- 事件粒度需要适配穿戴场景：不是"我搜索了什么"，而是"我在咖啡店遇到了谁"
- 多设备事件需要对齐：眼镜的"看到"和吊坠的"听到"需要时间同步
- 长期积累会产生海量数据，需要压缩和遗忘机制

**事件模型**:

```typescript
interface EpisodicEvent {
  id: string;
  timestamp: number;           // Unix ms
  duration_ms: number;         // 事件持续时长
  source_device: "glasses" | "ring" | "pendant";
  
  // 多模态内容（嵌入向量，非原始数据）
  visual_embedding?: Float32Array;   // 场景视觉嵌入
  audio_embedding?: Float32Array;    // 音频嵌入
  text_embedding?: Float32Array;     // 对话文本嵌入
  
  // 结构化元数据
  location?: GeoLocation;
  activity?: ActivityLabel;          // "meeting" | "walking" | "eating" | ...
  participants?: string[];           // 参与者（匿名化）
  emotion?: EmotionVector;           // 情感向量
  
  // 语义摘要（由 LLM 生成）
  summary: string;                   // "在星巴克与李明讨论了Q3项目计划"
  
  // 索引标签
  tags: string[];
  importance_score: number;          // 0-1，由注意力机制评估
}
```

**遗忘机制**: 仿照人脑的遗忘曲线，穿戴 Agent 的情景记忆需要智能遗忘：

```python
class EpisodicForgetting:
    """基于艾宾浩斯遗忘曲线的情景记忆管理"""
    
    def should_retain(self, event: EpisodicEvent, current_time: float) -> bool:
        retention_strength = event.importance_score
        
        # 访问强化：每次被检索都会增强记忆
        for access_time in event.access_history:
            decay = self._ebbinghaus_decay(current_time - access_time)
            retention_strength += 0.1 * (1 - decay)
        
        # 情感增强：高情感事件遗忘更慢
        retention_strength *= (1 + 0.3 * event.emotion.intensity)
        
        # 时间衰减
        time_elapsed = current_time - event.timestamp
        decay_factor = self._ebbinghaus_decay(time_elapsed)
        
        return retention_strength * decay_factor > self.retention_threshold
    
    @staticmethod
    def _ebbinghaus_decay(t: float) -> float:
        """艾宾浩斯遗忘曲线: R = e^(-t/S)"""
        S = 86400 * 7  # 稳定性常数：7天
        return math.exp(-t / S)
```

**多设备事件对齐**:

```python
class MultiDeviceEventAligner:
    """跨设备事件时间对齐与融合"""
    
    def align(self, events_by_device: Dict[str, List[EpisodicEvent]]) -> List[AlignedEpisode]:
        aligned_episodes = []
        
        # 1. 按时间窗口分组（5秒容忍度）
        time_groups = self._group_by_time(events_by_device, tolerance_ms=5000)
        
        for group in time_groups:
            # 2. 多模态融合：将不同设备的感知合并
            episode = AlignedEpisode(
                visual=group.get("glasses")?.visual_embedding,
                audio=group.get("pendant")?.audio_embedding,
                physiological=group.get("ring")?.emotion,
                summary=self._merge_summaries(group),
                confidence=self._compute_alignment_confidence(group)
            )
            
            # 3. 冲突消解：当不同设备给出矛盾信息时
            if episode.confidence < 0.7:
                episode = self._resolve_conflicts(episode, group)
            
            aligned_episodes.append(episode)
        
        return aligned_episodes
```

### 3.3 语义记忆（Semantic Memory）

**定义**: 从情景记忆中抽象出的通用知识和用户偏好，不依赖具体时间地点。

**穿戴场景的特殊性**:
- 用户偏好高度隐式：不像电商的"买了什么"，穿戴场景的偏好需要从行为模式中推断
- 知识需要持续更新："用户最近开始健身了"这种偏好漂移需要检测
- 领域知识需要个性化：通用的营养建议 vs 基于用户体质的个性化建议

**知识图谱结构**:

```typescript
interface WearableSemanticMemory {
  // 用户画像
  user_profile: {
    demographics: { age_range: string; timezone: string; };
    preferences: Map<string, PreferenceEntry>;    // "coffee" → {liked: true, strength: 0.8}
    routines: Routine[];                           // 周期性行为模式
    health_baseline: HealthBaseline;               // 生理基线
    social_patterns: SocialPattern[];              // 社交模式
  };
  
  // 领域知识（按场景组织）
  domain_knowledge: {
    health: HealthKnowledgeBase;        // 健康管理知识
    productivity: ProductivityKB;       // 效率优化知识
    social: SocialKnowledgeBase;        // 社交辅助知识
    navigation: NavigationKB;           // 导航与空间知识
  };
  
  // 设备特定的环境模型
  environment_models: {
    frequent_locations: Location[];     // 常去地点的语义标签
    device_ecosystem: DeviceGraph;      // 设备关系图
    connectivity_patterns: ConnPattern[]; // 网络连接模式
  };
}

interface PreferenceEntry {
  key: string;
  liked: boolean;
  strength: number;        // 0-1，偏好强度
  last_updated: number;    // 时间戳
  drift_detected: boolean; // 偏好是否正在漂移
  source_events: string[]; // 来源情景事件 ID
}
```

**偏好漂移检测**:

```python
class PreferenceDriftDetector:
    """检测用户偏好随时间的变化"""
    
    def detect_drift(self, preference: PreferenceEntry, recent_events: List[EpisodicEvent]) -> DriftResult:
        # 基于近期事件计算当前偏好方向
        current_direction = self._compute_preference_direction(preference.key, recent_events)
        
        # 与历史偏好比较
        historical_direction = 1 if preference.liked else -1
        
        # 方向反转或强度显著变化 = 漂移
        if current_direction * historical_direction < 0:
            return DriftResult(
                drifted=True,
                new_direction=current_direction > 0,
                confidence=abs(current_direction),
                message=f"用户对 {preference.key} 的偏好可能已改变"
            )
        
        return DriftResult(drifted=False)
```

### 3.4 程序记忆（Procedural Memory）

**定义**: 自动化的技能和习惯，不需要显式推理即可执行。

**穿戴场景的特殊性**:
- 穿戴设备的交互带宽极窄，Agent 必须尽可能自动行动
- 习惯性场景（每日通勤、晨间例程）应该零延迟响应
- 技能需要适应设备能力：戒指只能震动提醒，不能显示文字

**技能分层模型**:

```
┌────────────────────────────────────────────────┐
│  L3: 复合技能 (Composite Skills)               │
│  "晨间例程" = 起床检测 + 天气播报 + 日程提醒     │
│  "会议模式" = 静音 + 录音 + 摘要 + 结束提醒      │
├────────────────────────────────────────────────┤
│  L2: 条件技能 (Conditional Skills)             │
│  IF 心率>120 AND 非运动状态 → 压力提醒          │
│  IF 进入超市 AND 购物清单非空 → 清单推送         │
├────────────────────────────────────────────────┤
│  L1: 反射技能 (Reflex Skills)                  │
│  声音检测到用户名字 → 唤醒                       │
│  跌倒检测 → 紧急联系                            │
│  来电 → 震动提醒                                │
└────────────────────────────────────────────────┘
```

```python
class ProceduralMemory:
    """程序记忆：条件-动作技能库"""
    
    def __init__(self):
        self.reflex_skills = []      # L1: 无条件反射
        self.conditional_skills = [] # L2: 条件触发
        self.composite_skills = []   # L3: 复合编排
    
    def match(self, context: WearableContext) -> List[SkillMatch]:
        """根据当前上下文匹配可执行的技能"""
        matches = []
        
        # L1: 反射技能 - 最快响应，设备端执行
        for skill in self.reflex_skills:
            if skill.condition.evaluate(context):
                matches.append(SkillMatch(skill=skill, priority=0, latency_budget_ms=50))
        
        # L2: 条件技能 - 需要简单推理
        for skill in self.conditional_skills:
            if skill.condition.evaluate(context):
                matches.append(SkillMatch(skill=skill, priority=1, latency_budget_ms=500))
        
        # L3: 复合技能 - 需要编排多个动作
        for skill in self.composite_skills:
            if skill.trigger.evaluate(context):
                matches.append(SkillMatch(skill=skill, priority=2, latency_budget_ms=3000))
        
        return sorted(matches, key=lambda m: m.priority)
```

### 3.5 记忆层间的数据流

```
传感器数据 ──→ 感知记忆 (Sensory)
                   │
                   │ 注意力过滤 (只保留显著事件)
                   ↓
              情景记忆 (Episodic)
                   │
                   │ 抽象化 (从事件中提取模式和偏好)
                   ↓
              语义记忆 (Semantic)
                   │
                   │ 自动化 (频繁模式固化为技能)
                   ↓
              程序记忆 (Procedural)
                   
                   ↑ 反馈强化
                   │ (技能执行结果回写情景记忆)
```

**存储策略**:

| 记忆层 | 存储位置 | 保留时长 | 典型大小 |
|--------|---------|---------|---------|
| 感知记忆 | 设备端 RAM | < 1 秒 | 10-100 MB |
| 情景记忆 | 设备端 + 云端 | 数月-数年 | 1-10 GB/年 |
| 语义记忆 | 云端为主 | 永久 | 10-100 MB |
| 程序记忆 | 设备端 | 永久（除非用户删除） | 1-10 MB |

---

## 4. 上下文管理：WearCtx

### 4.1 穿戴场景的上下文维度

穿戴 Agent 的上下文远比文本 Agent 复杂，因为它需要融合多个物理感知维度：

```typescript
interface WearableContext {
  // 时间上下文
  time: {
    absolute: number;          // Unix timestamp
    relative: TimeOfDay;       // morning/afternoon/evening/night
    schedule_proximity: string; // 距最近日历事件
  };
  
  // 空间上下文
  space: {
    location: GeoLocation;     // GPS (模糊化)
    semantic_place: string;    // "家" | "办公室" | "咖啡店"
    indoor_outdoor: "indoor" | "outdoor" | "transit";
    moving_state: "stationary" | "walking" | "running" | "driving";
  };
  
  // 社交上下文
  social: {
    alone: boolean;
    nearby_people: number;     // 附近人数（不识别身份）
    in_conversation: boolean;
    conversation_topic?: string;
  };
  
  // 生理上下文
  physiological: {
    heart_rate: number;
    hrv: number;               // 心率变异性
    stress_level: number;      // 0-1
    energy_level: "high" | "medium" | "low";
    sleep_debt_hours: number;
  };
  
  // 环境上下文
  environment: {
    noise_level: number;       // dB
    light_level: number;       // lux
    temperature: number;       // °C
  };
  
  // 视觉上下文（眼镜专属）
  visual?: {
    scene_description: string; // "办公桌前，屏幕显示代码编辑器"
    detected_objects: string[];
    text_in_view: string[];
  };
  
  // 设备上下文
  device: {
    active_devices: DeviceId[];
    battery_levels: Map<DeviceId, number>;
    connectivity: "online" | "weak" | "offline";
    last_interaction_ms: number;
  };
}
```

### 4.2 多模态上下文融合

不同设备的上下文信息存在冗余和互补，需要融合策略：

**融合层次模型**:

```
L3: 语义融合 ──── 统一场景理解："用户在办公室开会，有些紧张"
                    ↑
L2: 特征融合 ──── 跨模态特征对齐：视觉"人脸" + 音频"说话声" + 戒指"心率升高"
                    ↑
L1: 信号融合 ──── 时间同步：眼镜帧 t=1.234 + 戒指心率 t=1.230 + 吊坠音频 t=1.235
```

```python
class ContextFusionEngine:
    """多模态上下文融合引擎"""
    
    def fuse(self, device_contexts: Dict[DeviceId, PartialContext]) -> WearableContext:
        # L1: 信号级融合 - 时间对齐
        aligned = self._align_timestamps(device_contexts)
        
        # L2: 特征级融合 - 互补与冲突消解
        fused_features = {}
        
        # 社交状态推断：融合多设备信号
        social = self._infer_social_state(
            visual_people=aligned.get("glasses")?.nearby_people,
            audio_activity=aligned.get("pendant")?.speech_detected,
            proximity=aligned.get("ring")?.nearby_device_count
        )
        
        # 压力状态推断：戒指生理数据 + 眼镜场景数据
        stress = self._infer_stress(
            physiological=aligned.get("ring")?.stress_indicators,
            scene=aligned.get("glasses")?.scene_type,
            audio_stress=aligned.get("pendant")?.voice_stress
        )
        
        # L3: 语义级融合 - 场景理解
        semantic_scene = self._generate_scene_understanding(
            social=social,
            stress=stress,
            location=aligned.location,
            time=aligned.time
        )
        
        return WearableContext(
            time=aligned.time,
            space=self._infer_space(aligned),
            social=social,
            physiological=self._fuse_physiological(aligned),
            environment=self._fuse_environment(aligned),
            visual=aligned.get("glasses")?.visual,
            device=self._device_status(device_contexts),
            _scene_summary=semantic_scene
        )
```

### 4.3 上下文窗口策略

穿戴 Agent 的上下文窗口管理面临独特挑战：物理上下文是连续流，而 LLM 的上下文窗口是离散的。

**分层上下文窗口**:

```
┌─────────────────────────────────────────────────┐
│  活跃上下文窗口 (Active Context Window)           │
│  大小: 2K-4K tokens                              │
│  内容: 当前场景摘要 + 最近 3 轮对话                │
│  延迟: < 100ms                                    │
│  存储: 设备端                                     │
├─────────────────────────────────────────────────┤
│  工作上下文窗口 (Working Context Window)           │
│  大小: 8K-16K tokens                             │
│  内容: 今日事件时间线 + 相关情景记忆               │
│  延迟: 100-500ms                                  │
│  存储: 设备端 (压缩) + 云端 (完整)                 │
├─────────────────────────────────────────────────┤
│  背景上下文窗口 (Background Context Window)        │
│  大小: 32K-128K tokens (RAG 检索)                │
│  内容: 用户画像 + 领域知识 + 历史相关事件           │
│  延迟: 500-2000ms                                 │
│  存储: 云端                                       │
└─────────────────────────────────────────────────┘
```

**动态上下文组装**:

```python
class ContextAssembler:
    """根据当前场景动态组装上下文窗口"""
    
    def assemble(self, query: str, current_ctx: WearableContext) -> AssembledContext:
        # 1. 活跃上下文：始终包含
        active = self._get_active_context(current_ctx)
        
        # 2. 根据场景类型加载工作上下文
        scene_type = current_ctx.scene_summary.type
        working = self._load_working_context(
            scene_type=scene_type,
            time_horizon=self._time_horizon_for_scene(scene_type)
        )
        
        # 3. RAG 检索相关背景知识
        background = self._rag_retrieve(
            query=query,
            context_embedding=self._encode_context(current_ctx),
            top_k=5,
            max_tokens=32000
        )
        
        # 4. Token 预算分配
        budget = self._allocate_tokens(
            total_budget=self._get_model_context_limit(),
            active_tokens=len(active),
            scene_complexity=self._assess_complexity(current_ctx)
        )
        
        return AssembledContext(
            active=active,
            working=working[:budget.working],
            background=background[:budget.background]
        )
    
    def _time_horizon_for_scene(self, scene_type: str) -> timedelta:
        """不同场景的时间视野不同"""
        horizons = {
            "meeting": timedelta(hours=1),      # 会议：1小时内上下文
            "commute": timedelta(minutes=30),   # 通勤：30分钟
            "exercise": timedelta(hours=2),     # 运动：2小时
            "social": timedelta(hours=4),       # 社交：4小时
            "default": timedelta(hours=2),
        }
        return horizons.get(scene_type, horizons["default"])
```

### 4.4 隐私优先的上下文处理

穿戴设备感知的数据极度隐私——用户的心率、对话、所见所闻都在采集范围内。隐私不能是事后补丁，必须是架构级设计。

**隐私分级模型**:

```
┌─────────────────────────────────────────────────────────────┐
│ Level 5: 绝对隐私 (Absolute Privacy)                        │
│   内容: 原始音频、原始图像、原始生理信号                       │
│   原则: 永不出设备，处理即销毁                                │
│   示例: 对话录音原始波形、摄像头原始帧                        │
├─────────────────────────────────────────────────────────────┤
│ Level 4: 强隐私 (Strong Privacy)                            │
│   内容: 嵌入向量、匿名化特征                                  │
│   原则: 可传云端，但不可逆推原始内容                           │
│   示例: 对话语义嵌入、场景视觉嵌入、心率模式嵌入               │
├─────────────────────────────────────────────────────────────┤
│ Level 3: 中隐私 (Medium Privacy)                            │
│   内容: 聚合统计、事件摘要                                    │
│   原则: 可传云端存储，但不关联具体时间地点                     │
│   示例: "本周平均睡眠 7.2 小时" "今天开了 3 个会"            │
├─────────────────────────────────────────────────────────────┤
│ Level 2: 弱隐私 (Low Privacy)                               │
│   内容: 用户主动分享的信息                                    │
│   原则: 按用户授权使用                                        │
│   示例: 主动询问天气、主动设置提醒                            │
├─────────────────────────────────────────────────────────────┤
│ Level 1: 公开 (Public)                                      │
│   内容: 通用知识、非个人信息                                  │
│   原则: 自由使用                                              │
│   示例: 天气数据、通用健康知识                                │
└─────────────────────────────────────────────────────────────┘
```

**隐私守门人架构**:

```python
class PrivacyGatekeeper:
    """所有上下文数据流出设备前的隐私守门人"""
    
    def process(self, data: Any, target: str) -> Optional[Any]:
        privacy_level = self._classify_privacy(data)
        policy = self._get_policy(privacy_level, target)
        
        if not policy.allowed:
            return None  # 拒绝传输
        
        if policy.requires_anonymization:
            data = self._anonymize(data, policy.anonymization_level)
        
        if policy.requires_user_consent and not self._check_consent(data):
            return None  # 需要用户授权但未获得
        
        if policy.audit_required:
            self._audit_log(data, target, privacy_level)
        
        return data
    
    def _anonymize(self, data: Any, level: str) -> Any:
        if level == "embedding_only":
            # 只保留嵌入向量，不可逆推
            return self._to_embedding(data)
        elif level == "aggregate":
            # 聚合化：去除时间戳和位置
            return self._aggregate(data)
        elif level == "differential_privacy":
            # 差分隐私：添加噪声
            return self._add_dp_noise(data, epsilon=1.0)
```

### 4.5 跨设备上下文同步

多设备场景下，上下文需要实时同步，但带宽和功耗限制了同步频率。

**同步策略**:

| 数据类型 | 同步方式 | 频率 | 延迟 |
|---------|---------|------|------|
| 上下文摘要 | BLE 广播 | 按需 | < 100ms |
| 情景事件 | BLE/Wi-Fi | 5-30 分钟 | < 5s |
| 语义更新 | Wi-Fi | 每日 | 分钟级 |
| 紧急事件 | BLE 优先 | 即时 | < 50ms |

```python
class CrossDeviceSync:
    """跨设备上下文同步引擎"""
    
    def sync_context(self, source: DeviceId, update: ContextUpdate):
        urgency = self._assess_urgency(update)
        
        if urgency == "immediate":
            # 紧急：BLE 直连，如跌倒检测
            self._ble_broadcast(update, target="all")
        elif urgency == "near_realtime":
            # 近实时：Wi-Fi 直连，如会议状态变化
            self._wifi_direct_send(update, target="companion_devices")
        elif urgency == "periodic":
            # 周期：批量同步，如每日健康摘要
            self._queue_for_batch_sync(update)
        elif urgency == "on_demand":
            # 按需：设备请求时提供，如历史对话记录
            self._store_for_retrieval(update)
```

---

## 5. Harness 架构：WearHarness

Harness 是 Agent 的编排层——它决定何时激活、调用哪个模型、执行什么动作、如何处理异常。穿戴场景的 Harness 需要在延迟、功耗和能力之间精细平衡。

### 5.1 端云协同推理

**核心原则**: 尽可能在端侧完成，只有端侧无法处理时才上云。

**推理分层**:

```
┌──────────────────────────────────────────────────────────┐
│  Tier 3: 云端推理 (Cloud Inference)                       │
│  模型: GPT-4o / Claude / GLM-5 等                         │
│  延迟: 1-5s                                               │
│  功耗: 仅通信功耗                                          │
│  适用: 复杂推理、长文本生成、知识密集型问答                  │
├──────────────────────────────────────────────────────────┤
│  Tier 2: 端侧小模型 (On-device Small Model)               │
│  模型: Gemma 2B / Phi-3-mini / Qwen2-1.5B               │
│  延迟: 100-500ms                                          │
│  功耗: 中等                                                │
│  适用: 摘要生成、分类、简单问答、上下文理解                  │
├──────────────────────────────────────────────────────────┤
│  Tier 1: 规则引擎 + 嵌入匹配 (Rule Engine + Embedding)    │
│  方法: 预置规则 + 向量相似度                                │
│  延迟: < 10ms                                              │
│  功耗: 极低                                                │
│  适用: 反射技能、意图分类、实体识别、紧急响应                │
└──────────────────────────────────────────────────────────┘
```

**动态推理路由**:

```python
class InferenceRouter:
    """根据查询复杂度和设备状态动态路由推理"""
    
    def route(self, query: AgentQuery, device_state: DeviceState) -> InferencePlan:
        complexity = self._assess_complexity(query)
        battery = device_state.battery_level
        connectivity = device_state.connectivity
        
        # 决策矩阵
        if complexity == "trivial":
            tier = "tier1"  # 规则引擎，< 10ms
        elif complexity == "simple" and battery > 20:
            tier = "tier2"  # 端侧小模型
        elif complexity == "moderate" and battery > 10 and connectivity == "online":
            tier = "tier3_cloud"  # 云端推理
        elif complexity == "moderate" and (battery <= 10 or connectivity != "online"):
            tier = "tier2"  # 降级到端侧
        elif complexity == "complex" and connectivity == "online":
            tier = "tier3_cloud"
        else:
            # 离线 + 复杂查询 = 先用端侧兜底，排队等网络恢复
            tier = "tier2_fallback"
        
        return InferencePlan(
            tier=tier,
            model=self._select_model(tier, query),
            timeout=self._timeout_for_tier(tier),
            fallback=self._fallback_plan(tier, device_state)
        )
    
    def _assess_complexity(self, query: AgentQuery) -> str:
        """快速评估查询复杂度"""
        # 使用嵌入相似度与预定义模板匹配
        if query.type in ["greeting", "time_query", "quick_fact"]:
            return "trivial"
        if query.type in ["summarize", "classify", "simple_qa"]:
            return "simple"
        if query.type in ["multi_step_reasoning", "creative_writing", "deep_analysis"]:
            return "complex"
        return "moderate"
```

### 5.2 实时感知-决策-执行循环

穿戴 Agent 的核心循环必须极快——用户期望的是"无感"的辅助，而非等待。

**微秒级循环架构**:

```
                    ┌──────────────┐
                    │  传感器数据流  │
                    └──────┬───────┘
                           │
                    ┌──────▼───────┐
              ┌─────│  感知缓冲层   │─────┐
              │     └──────────────┘     │
              │                          │
    ┌─────────▼──────────┐    ┌─────────▼──────────┐
    │  快速通道 (< 50ms)  │    │  深度通道 (< 2s)    │
    │  · 反射技能匹配     │    │  · 上下文组装       │
    │  · 规则引擎评估     │    │  · 推理路由         │
    │  · 紧急响应触发     │    │  · 模型推理         │
    └─────────┬──────────┘    └─────────┬──────────┘
              │                          │
              │     ┌──────────────┐     │
              └─────►  动作执行层  ◄─────┘
                    │  · 语音反馈  │
                    │  · 触觉反馈  │
                    │  · 视觉叠加  │
                    │  · 设备控制  │
                    └──────────────┘
```

```python
class WearableAgentLoop:
    """穿戴 Agent 主循环"""
    
    def __init__(self):
        self.sensory_memory = SensoryMemory()
        self.context_engine = ContextFusionEngine()
        self.inference_router = InferenceRouter()
        self.procedural_memory = ProceduralMemory()
        self.action_executor = ActionExecutor()
        self.privacy_gate = PrivacyGatekeeper()
    
    async def run(self):
        """主循环"""
        while True:
            # 1. 感知：从传感器缓冲获取数据
            sensory_events = self.sensory_memory.poll()
            
            # 2. 快速通道：反射技能（< 50ms）
            reflex_actions = []
            for event in sensory_events:
                context = self.context_engine.partial_update(event)
                reflex_matches = self.procedural_memory.match_reflexes(context)
                for match in reflex_matches:
                    reflex_actions.append(match.skill.action)
            
            # 立即执行反射动作
            for action in reflex_actions:
                await self.action_executor.execute(action, priority="immediate")
            
            # 3. 深度通道：异步处理（< 2s）
            if self._needs_deep_processing(sensory_events):
                asyncio.create_task(self._deep_processing(sensory_events))
    
    async def _deep_processing(self, events: List[SensoryEvent]):
        """深度处理：上下文组装 → 推理 → 动作"""
        # 3a. 组装完整上下文
        full_context = self.context_engine.fuse(self._get_device_contexts())
        
        # 3b. 路由推理
        plan = self.inference_router.route(
            query=self._formulate_query(events, full_context),
            device_state=self._get_device_state()
        )
        
        # 3c. 执行推理
        result = await self._execute_inference(plan, full_context)
        
        # 3d. 隐私检查后执行动作
        safe_actions = self.privacy_gate.filter_actions(result.actions)
        for action in safe_actions:
            await self.action_executor.execute(action, priority="normal")
        
        # 3e. 记忆更新
        self._update_memories(events, result)
```

### 5.3 多设备协同 Harness

当多个穿戴设备同时在场时，Harness 需要协调它们的感知和行动。

**设备角色分工**:

```python
class DeviceRoleManager:
    """管理多设备协同中的角色分配"""
    
    DEFAULT_ROLES = {
        "glasses": {
            "primary_capabilities": ["visual_perception", "ar_overlay", "voice_output"],
            "secondary_capabilities": ["spatial_tracking", "object_recognition"],
            "preferred_role": "perception_leader"  # 感知领导者
        },
        "ring": {
            "primary_capabilities": ["physiological_sensing", "gesture_input", "haptic_output"],
            "secondary_capabilities": ["activity_detection"],
            "preferred_role": "health_guardian"    # 健康守卫
        },
        "pendant": {
            "primary_capabilities": ["audio_capture", "conversation_memory", "voice_input"],
            "secondary_capabilities": ["scene_photo"],
            "preferred_role": "memory_keeper"      # 记忆守护者
        }
    }
    
    def assign_roles(self, active_devices: List[DeviceId]) -> Dict[DeviceId, DeviceRole]:
        roles = {}
        for device_id in active_devices:
            device_type = self._get_device_type(device_id)
            if device_type in self.DEFAULT_ROLES:
                roles[device_id] = DeviceRole(**self.DEFAULT_ROLES[device_type])
        
        # 如果只有戒指在线，它需要承担更多职责
        if len(active_devices) == 1 and "ring" in [self._get_device_type(d) for d in active_devices]:
            roles[active_devices[0]].additional_duties = ["basic_notification", "emergency_alert"]
        
        return roles
```

**协同决策示例——会议场景**:

```
场景: 用户进入会议室

1. [眼镜] 视觉检测: 检测到多人 + 投影屏幕 → 推断"会议开始"
   → 通知 Harness: "meeting_start" 事件

2. [Harness] 决策: 激活"会议模式"技能
   → 眼镜: AR 叠加参会者名片（如果已知）
   → 吊坠: 开始录音 + 转写
   → 戒指: 进入"勿扰"模式，仅保留紧急提醒

3. [吊坠] 持续录音 → 每 5 分钟生成摘要片段
   → 上传到情景记忆（Level 4 隐私，嵌入向量）

4. [戒指] 监测压力水平
   → 如果心率持续升高 → 通知 Harness
   → Harness 通过眼镜 AR 显示"建议深呼吸"提示

5. [会议结束]
   → 吊坠: 生成完整会议摘要 + 待办事项
   → 情景记忆: 存储会议事件
   → 语义记忆: 更新"与 X 的最近互动"知识
```

### 5.4 技能系统设计

穿戴 Agent 的技能系统需要适配设备能力约束：

```typescript
interface WearableSkill {
  id: string;
  name: string;
  description: string;
  
  // 触发条件
  trigger: {
    type: "continuous" | "event" | "scheduled" | "voice";
    condition: ContextCondition;     // 上下文条件表达式
    debounce_ms: number;            // 防抖，避免频繁触发
  };
  
  // 设备需求
  requirements: {
    devices: DeviceType[];           // 需要哪些设备
    min_battery: number;             // 最低电量要求
    connectivity: "any" | "online" | "offline_capable";
    inference_tier: "tier1" | "tier2" | "tier3";
  };
  
  // 执行动作
  actions: WearableAction[];
  
  // 隐私声明
  privacy: {
    data_access: PrivacyLevel[];     // 需要访问的隐私级别
    data_output: PrivacyLevel[];     // 输出的隐私级别
    user_consent_required: boolean;
  };
  
  // 降级策略
  fallback?: {
    reduced_actions: WearableAction[];  // 降级后的动作
    trigger?: ContextCondition;          // 降级触发条件
  };
}

// 示例: "咖啡店推荐"技能
const coffeeRecommendationSkill: WearableSkill = {
  id: "coffee-recommendation",
  name: "咖啡店推荐",
  description: "当用户在陌生区域寻找咖啡时推荐附近好店",
  trigger: {
    type: "continuous",
    condition: {
      and: [
        { field: "space.semantic_place", op: "not_in", value: ["home", "office"] },
        { field: "time.relative", op: "in", value: ["morning"] },
        { field: "physiological.energy_level", op: "eq", value: "low" }
      ]
    },
    debounce_ms: 300000  // 5分钟内不重复触发
  },
  requirements: {
    devices: ["glasses"],
    min_battery: 15,
    connectivity: "online",
    inference_tier: "tier2"
  },
  actions: [
    { type: "ar_overlay", content: "nearby_coffee_shops", position: "bottom_right" },
    { type: "haptic", pattern: "gentle_tap", device: "ring" }
  ],
  privacy: {
    data_access: ["medium"],
    data_output: ["low"],
    user_consent_required: false  // 位置已是模糊化的
  },
  fallback: {
    reduced_actions: [
      { type: "voice", content: "附近有几家咖啡店，需要推荐吗？", device: "glasses" }
    ],
    trigger: { field: "device.connectivity", op: "eq", value: "offline" }
  }
};
```

### 5.5 离线与降级策略

穿戴设备的网络不可靠是常态，Harness 必须有完善的降级机制：

**降级梯度**:

```
正常模式 (Full Mode)
  │  网络断开 / 电量低
  ▼
受限模式 (Constrained Mode)
  · 云端推理不可用 → 端侧小模型兜底
  · 视觉理解降级 → 基于规则的场景分类
  · AR 叠加关闭 → 仅语音/触觉反馈
  │  电量极低 (< 5%)
  ▼
生存模式 (Survival Mode)
  · 仅保留反射技能（跌倒检测、紧急呼叫）
  · 关闭所有非必要传感器
  · 仅戒指保持运行（功耗最低）
  │  电量恢复 / 网络恢复
  ▼
自动恢复 (Auto-Recovery)
  · 重新同步情景记忆
  · 补充离线期间缺失的上下文
  · 通知用户离线期间的事件摘要
```

```python
class DegradationManager:
    """降级管理器"""
    
    def assess_state(self, device_states: Dict[DeviceId, DeviceState]) -> OperationalMode:
        min_battery = min(s.battery_level for s in device_states.values())
        any_online = any(s.connectivity == "online" for s in device_states.values())
        active_count = len(device_states)
        
        if min_battery < 5:
            return OperationalMode.SURVIVAL
        elif not any_online or min_battery < 15:
            return OperationalMode.CONSTRAINED
        else:
            return OperationalMode.FULL
    
    def apply_mode(self, mode: OperationalMode, harness: WearHarness):
        if mode == OperationalMode.SURVIVAL:
            # 只保留生命安全相关技能
            harness.active_skills = [s for s in harness.all_skills if s.privacy.data_access == ["absolute"]]
            harness.inference_tier = "tier1_only"
            harness.sensors = ["accelerometer"]  # 只留跌倒检测
        
        elif mode == OperationalMode.CONSTRAINED:
            # 禁用需要云端的能力
            harness.active_skills = [s for s in harness.all_skills 
                                     if s.requirements.connectivity != "online"]
            harness.inference_tier = "tier1_tier2"
```

---

## 6. 三类设备的完整架构映射

### 6.1 智能眼镜 Agent 架构

```
┌─────────────────────────────────────────────────────────┐
│                    智能眼镜 Agent 架构                    │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌─────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │ 摄像头 30fps │  │ 麦克风阵列   │  │ IMU + ALS    │  │
│  └──────┬──────┘  └──────┬───────┘  └──────┬───────┘  │
│         │                │                  │          │
│  ┌──────▼────────────────▼──────────────────▼───────┐  │
│  │          感知记忆 (Sensory Memory)                │  │
│  │  · 视觉帧缓冲 (30帧) · 音频缓冲 (1s) · IMU缓冲  │  │
│  │  · 注意力过滤: YOLO物体检测 + 场景分类           │  │
│  └──────────────────────┬────────────────────────────┘  │
│                         │                               │
│  ┌──────────────────────▼────────────────────────────┐  │
│  │          端侧推理引擎 (NPU)                        │  │
│  │  · 场景理解 (MobileNet) · OCR · 人脸检测          │  │
│  │  · 语音活动检测 · 简单问答 (Phi-3-mini)           │  │
│  └──────────────────────┬────────────────────────────┘  │
│                         │                               │
│  ┌──────────────────────▼────────────────────────────┐  │
│  │          Harness 决策层                            │  │
│  │  · 技能匹配 · 推理路由 · 动作编排                  │  │
│  │  · 云端调用 (复杂查询) · 隐私守门                  │  │
│  └───────┬──────────────┬──────────────┬─────────────┘  │
│          │              │              │                 │
│  ┌───────▼───────┐ ┌───▼────┐ ┌───────▼──────────┐    │
│  │ AR 光学叠加    │ │语音输出│ │ BLE 同步(戒指/吊坠)│    │
│  └───────────────┘ └────────┘ └──────────────────┘    │
└─────────────────────────────────────────────────────────┘

记忆配置:
  · 感知记忆: 设备端 RAM, ~50MB
  · 情景记忆: 设备端缓存今日 + 云端全量
  · 语义记忆: 云端
  · 程序记忆: 设备端 (反射+条件技能)

上下文重点:
  · 视觉场景 (primary)
  · 空间位置
  · 环境声
```

### 6.2 智能戒指 Agent 架构

```
┌─────────────────────────────────────────────────────────┐
│                    智能戒指 Agent 架构                    │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐             │
│  │ PPG 心率  │  │ 温度传感器│  │ 加速度计  │             │
│  └─────┬────┘  └─────┬────┘  └─────┬────┘             │
│        │              │              │                   │
│  ┌─────▼──────────────▼──────────────▼────────────────┐ │
│  │          感知记忆 (Sensory Memory)                  │ │
│  │  · 生理信号缓冲 · 温度趋势 · 活动状态              │ │
│  │  · 注意力过滤: 异常检测 + 模式匹配                 │ │
│  └─────────────────────┬──────────────────────────────┘ │
│                        │                                │
│  ┌─────────────────────▼──────────────────────────────┐ │
│  │          规则引擎 (Rule Engine)                     │ │
│  │  · 心率异常检测 · 跌倒检测 · 睡眠分期              │ │
│  │  · 压力评估 · 活动识别                              │ │
│  └─────────────────────┬──────────────────────────────┘ │
│                        │                                │
│  ┌─────────────────────▼──────────────────────────────┐ │
│  │          Harness (极简)                             │ │
│  │  · 仅反射技能 + 条件技能                            │ │
│  │  · 无独立推理能力，依赖手机/眼镜/云端               │ │
│  └───────┬──────────────────────────┬─────────────────┘ │
│          │                          │                    │
│  ┌───────▼───────┐          ┌───────▼───────────┐      │
│  │ 触觉反馈(震动) │          │ BLE 上报(手机/眼镜) │      │
│  └───────────────┘          └───────────────────┘      │
└─────────────────────────────────────────────────────────┘

记忆配置:
  · 感知记忆: 设备端 RAM, ~100KB (极小)
  · 情景记忆: 不存储原始数据，只上传摘要到云端
  · 语义记忆: 不存储，只消费（从云端拉取基线）
  · 程序记忆: 设备端 (仅反射技能)

上下文重点:
  · 生理状态 (primary)
  · 活动状态
  · 睡眠状态

角色: 被动感知节点，不独立承担 Agent 任务
```

### 6.3 智能吊坠 Agent 架构

```
┌─────────────────────────────────────────────────────────┐
│                    智能吊坠 Agent 架构                    │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌──────────────┐  ┌──────────┐  ┌──────────┐         │
│  │ 麦克风阵列    │  │ 触控面板  │  │ 加速度计  │         │
│  └──────┬───────┘  └─────┬────┘  └─────┬────┘         │
│         │                │              │               │
│  ┌──────▼────────────────▼──────────────▼─────────────┐ │
│  │          感知记忆 (Sensory Memory)                  │ │
│  │  · 音频缓冲 (10s) · 语音活动检测 · 触控事件        │ │
│  │  · 注意力过滤: 语音段检测 + 说话人分离             │ │
│  └──────────────────────┬─────────────────────────────┘ │
│                         │                               │
│  ┌──────────────────────▼─────────────────────────────┐ │
│  │          端侧处理 (DSP + 小模型)                    │ │
│  │  · 语音转写 (Whisper tiny) · 说话人分离            │ │
│  │  · 关键词检测 · 情感分析                            │ │
│  └──────────────────────┬─────────────────────────────┘ │
│                         │                               │
│  ┌──────────────────────▼─────────────────────────────┐ │
│  │          Harness                                   │ │
│  │  · 对话记忆管理 · 摘要生成 · 主动回忆               │ │
│  │  · 云端推理 (摘要/分析) · 隐私守门                  │ │
│  └───────┬──────────────────────────┬─────────────────┘ │
│          │                          │                    │
│  ┌───────▼───────┐          ┌───────▼───────────┐      │
│  │ 语音输出(TTS)  │          │ BLE/Wi-Fi 同步     │      │
│  │ 触觉反馈       │          │                    │      │
│  └───────────────┘          └───────────────────┘      │
└─────────────────────────────────────────────────────────┘

记忆配置:
  · 感知记忆: 设备端 RAM, ~5MB (音频缓冲)
  · 情景记忆: 设备端缓存今日对话 + 云端全量
  · 语义记忆: 云端 (对话模式、人际偏好)
  · 程序记忆: 设备端 (对话管理技能)

上下文重点:
  · 对话内容 (primary)
  · 社交状态
  · 说话人身份

角色: 记忆守护者，主动回忆 + 对话辅助
```

---

## 7. 技术挑战与前沿研究

### 7.1 端侧模型的尺寸-能力权衡

当前端侧模型（1-3B 参数）在复杂推理上仍显不足。关键研究方向：

- **模型蒸馏**: 将大模型的穿戴场景能力蒸馏到小模型
- **混合专家 (MoE)**: 稀疏激活，按场景只激活相关专家
- **推测解码**: 端侧小模型起草 + 云端大模型验证
- **神经架构搜索 (NAS)**: 为特定 NPU 自动优化模型结构

### 7.2 多模态记忆的一致性

不同设备的感知可能产生矛盾信息（如眼镜看到用户在笑，戒指检测到压力升高）。研究挑战：

- **冲突检测与消解**: 如何判断哪个模态更可靠
- **置信度校准**: 每个模态的感知不确定度如何量化
- **时序对齐精度**: 不同设备的时钟漂移如何影响融合质量

### 7.3 隐私-效用平衡

隐私保护与 Agent 效用存在根本张力。研究挑战：

- **联邦记忆**: 记忆存储在本地，推理时通过联邦学习聚合
- **同态加密推理**: 在加密数据上直接推理（当前性能不足）
- **差分隐私记忆**: 记忆查询添加校准噪声，保护个体事件
- **可遗忘性**: 用户要求"忘记这段对话"时如何彻底删除

### 7.4 功耗感知的持续学习

穿戴 Agent 需要持续适应用户，但学习过程消耗额外功耗。研究挑战：

- **低功耗在线学习**: 如何在 < 1mW 功耗下完成参数更新
- **选择性学习**: 只在重要事件上触发学习，跳过平凡事件
- **睡眠学习**: 利用充电时间进行批量模型更新

### 7.5 跨设备身份与信任

多设备协同需要建立设备间的信任关系。研究挑战：

- **设备认证**: 如何确保只有用户的设备能加入 Agent 网络
- **上下文完整性**: 如何防止恶意设备注入虚假上下文
- **权限传播**: 用户在手机上的授权如何安全传播到穿戴设备

---

## 8. 未来展望

### 8.1 从单设备到穿戴网络

未来 2-3 年，智能穿戴将走向**穿戴网络 (Wearable Mesh)**——多个微型设备自动组网，按需分配感知和计算角色。用户不需要思考"这个任务该由哪个设备完成"，Harness 会自动编排。

### 8.2 从被动记录到主动预判

当前穿戴 Agent 主要是被动响应（用户问 → Agent 答）。未来的方向是**主动预判**——基于情景记忆中的行为模式，在用户意识到需求之前就准备好：

- 用户每天 8:30 到咖啡店 → 8:25 自动推荐今日特饮
- 用户开会前心率总升高 → 会议前 5 分钟推送深呼吸引导
- 用户遇到熟人总是想不起名字 → 检测到人脸后自动提示

### 8.3 从个人记忆到集体记忆

智能吊坠记录的对话和事件，经过隐私处理后，可以形成**集体记忆**——团队共享的会议摘要、共同经历的回忆索引。这需要精细的隐私控制和差分隐私技术。

### 8.4 从穿戴到植入

更远期的方向是脑机接口 (BCI) 与穿戴设备的融合。BCI 提供最直接的意图信号，穿戴设备提供环境感知，两者结合将实现真正的"心想事成"。但这也带来了前所未有的伦理挑战。

### 8.5 Agent Harness 标准化

当前各厂商的穿戴 Agent 架构各不相同，缺乏互操作性。未来需要标准化的 Harness 协议，使不同品牌的设备能够共享上下文和记忆，类似当前 Matter 协议对智能家居的统一。

---

## 9. 结论

智能穿戴设备作为 AI Agent 载体，其独特的 always-on 感知、极低延迟需求、严格功耗约束和深度隐私敏感性，要求我们从记忆、上下文和编排三个维度重新设计 Agent 架构。

本文提出的 **WearMem** 四层记忆架构（感知→情景→语义→程序）解决了穿戴场景下多模态感知数据的分层处理和智能遗忘问题；**WearCtx** 上下文管理框架实现了多模态融合、隐私优先和跨设备同步；**WearHarness** 编排架构提供了端云协同推理、实时感知-决策-执行循环和多设备协同能力。

三类穿戴设备各有所长：智能眼镜是感知领导者，智能戒指是健康守卫，智能吊坠是记忆守护者。没有单一设备能独立承担完整的 Agent 职能，但通过协同 Harness 的统一编排，它们可以形成一个比任何单一设备都强大的 Agent 网络。

穿戴 Agent 的未来不在于让某个设备变得更强大，而在于让多个设备协同得更自然——用户甚至感觉不到 Agent 的存在，只感受到恰到好处的辅助。这才是智能穿戴的终极目标：**无感之助，无处不在**。

---

## 参考文献

1. Atkinson, R.C., & Shiffrin, R.M. (1968). Human memory: A proposed system and its control processes. *Psychology of Learning and Motivation*.
2. Tulving, E. (1972). Episodic and semantic memory. *Organization of Memory*.
3. Vaswani, A., et al. (2017). Attention is all you need. *NeurIPS*.
4. Meta. (2024). Meta Ray-Ban AI Features. Meta AI Blog.
5. Humane. (2024). AI Pin: A New Kind of Wearable. Humane Inc.
6. Limitless. (2024). Limitless Pendant: Remember Everything. Limitless Corp.
7. Oura. (2024). Oura Ring Gen 4: Health Monitoring. Oura Health.
8. Abadi, M., et al. (2016). Deep learning with differential privacy. *ACM CCS*.
9. McMahan, B., et al. (2017). Communication-efficient learning of deep networks from decentralized data. *AISTATS*.
10. Wang, L., et al. (2024). A survey on large language model based autonomous agents. *Frontiers of Computer Science*.
11. Park, J.S., et al. (2023). Generative agents: Interactive simulacra of human behavior. *UIST*.
12. Shinn, N., et al. (2023). Reflexion: Language agents with verbal reinforcement learning. *NeurIPS*.

---

*本文由 AI 辅助生成，所有架构设计和代码示例均为概念性展示，实际实现需要根据具体硬件平台和业务需求进行调整。*
