---
title: react学习-事件机制
tags: 技术
abbrlink: 887
date: 2022-07-01 22:20:13
---


以下是**从“实现机制 + 历史包袱 + 真实执行路径”**三个层面，对 **React 事件机制（Synthetic Event System）**的深入拆解。不是“怎么用”，而是**为什么必须这样设计**、以及**它的代价是什么**。

---

## 一、先给结论（避免一开始就走偏）

**React 的事件机制本质是：**

> **基于事件委托的跨平台事件适配层 + 调度入口**

它解决的不是“监听事件”，而是：

1. **跨浏览器一致性**
2. **可控的更新调度（与 Fiber / Scheduler 强绑定）**
3. **事件优先级与批量更新**
4. **可被中断、可恢复的渲染**

DOM 事件只是输入信号。

---

## 二、为什么不能直接用 DOM 事件（历史 + 现实）

### 1️⃣ 早期问题（React 16 之前）

* 浏览器事件行为不一致
* IE 的 event 对象地狱
* `this`、冒泡、默认行为不统一

→ **SyntheticEvent** 诞生：做一层标准化。

---

### 2️⃣ 真正原因（React 16+ 之后）

**Fiber 架构要求：**

* 更新是 **可中断的**
* 更新有 **优先级**
* 更新是 **批量的**

而原生 DOM 事件：

* 不可控
* 直接触发 setState → 同步执行

❌ 这与 Fiber 冲突。

---

## 三、React 事件系统的整体结构（非常关键）

### 高层结构图（逻辑）

```
浏览器 DOM Event
        ↓
顶层事件监听（root / document）
        ↓
React Event Plugin System
        ↓
SyntheticEvent 封装
        ↓
Scheduler（优先级）
        ↓
Fiber 更新调度
```

---

## 四、事件委托：不是“挂在 document”这么简单

### React 17 的关键变化

| 版本        | 事件绑定位置             |
| --------- | ------------------ |
| React ≤16 | `document`         |
| React 17+ | **root container** |

**原因：**

* 多 React Root 共存
* 微前端 / iframe
* 避免全局污染

---

### 实际绑定方式（简化）

```js
container.addEventListener('click', dispatchEvent, false);
container.addEventListener('click', dispatchEvent, true);
```

👉 **同时监听捕获 + 冒泡**

---

## 五、事件触发后的真实执行路径（逐步）

以 `onClick` 为例。

### Step 1：浏览器触发 DOM 事件

```text
DOM click
```

---

### Step 2：进入 React 统一入口

```js
dispatchEvent(nativeEvent)
```

React 此时 **不会立刻执行你的 onClick**。

---

### Step 3：事件插件系统解析

React 内部维护一张映射表：

```text
click → onClick
keydown → onKeyDown
```

插件负责：

* 是否需要冒泡
* 是否合成事件
* 是否阻止默认行为

---

### Step 4：构造 SyntheticEvent

```js
const syntheticEvent = new SyntheticEvent(
  reactEventName,
  nativeEvent
);
```

特性：

* 标准化 API
* `preventDefault`
* `stopPropagation`

> React 17 之后 **不再做事件池复用**（这是个重要变化）

---

### Step 5：事件优先级注入（关键）

```text
DiscreteEvent（点击、键盘）
→ 高优先级

ContinuousEvent（mousemove、scroll）
→ 可降级

DefaultEvent
→ 普通
```

这一步直接影响：

* setState 什么时候执行
* 是否可被打断

---

### Step 6：触发 Fiber 更新

```js
setState → enqueueUpdate → scheduleUpdateOnFiber
```

此时：

* **不是同步渲染**
* 而是进入调度系统

---

## 六、SyntheticEvent 不是“假事件”，而是“控制点”

### SyntheticEvent 的真实价值

❌ 不是为了“统一 API”

✔️ 是为了：

* 在事件边界 **批量更新**
* 控制 flush 时机
* 与 Scheduler 对齐

---

### 自动批处理（React 18）

```js
onClick(() => {
  setA(1);
  setB(2);
});
```

**只触发一次 render**

哪怕在：

* Promise
* setTimeout
* 原生事件

这是事件系统与调度系统深度耦合的结果。

---

## 七、捕获 / 冒泡：React vs DOM

### React 事件阶段

```text
Capture phase
→ Target
→ Bubble phase
```

但注意：

* React 捕获 ≠ DOM 捕获
* React 冒泡 ≠ DOM 冒泡

React 是：

> **在 Fiber 树上模拟事件传播**

---

### stopPropagation 的真实效果

```js
e.stopPropagation();
```

阻止的是：

* React 合成事件的继续传播

不一定阻止：

* 原生 DOM 事件（除非显式）

---

## 八、为什么某些事件不能合成？

### 非冒泡事件

* `focus`
* `blur`
* `scroll`

React 的策略：

* 捕获阶段监听
* 或直接绑定到目标元素

---

## 九、React 事件机制的代价（实话实说）

### 成本

1. 多一层抽象（性能）
2. 调试复杂（栈不直观）
3. 与原生事件混用容易踩坑

---

### 典型坑

* 在 document 上监听，拿不到 React 状态
* stopPropagation 行为不符合预期
* 在非 React 管理的节点绑定事件

---

## 十、工程级使用建议（严谨版）

### 必须用 React 事件

* 状态驱动 UI
* 需要批量更新
* 需要调度优先级

### 可以用原生事件

* 性能极限场景（canvas / 拖拽）
* 非 React 管理区域

但要明确：

> **你绕过了 React 的调度系统**

---

## 十一、一句话总结

> **React 事件不是“监听”，而是“进入调度系统的门”。**

如果你需要，下一步可以直接：

* 逐行拆 **dispatchEvent 源码**
* 对比 **Vue / Solid / Svelte 事件模型**
* 分析 **React 事件与 Concurrent Rendering 的冲突点**
* 或结合 **真实线上 bug** 做机制级复盘


-----

更新于2025-07-10 22:35:59，部分内容来自ChatGPT
