---
title: Loop Engineering：循环不是问题，是解法
tags:
  - Agent设计
  - 软件设计
  - loop engineering
  - agent
  - harness
  - engineering
categories:
  - 工程方法论
abbrlink: 54556
date: 2026-06-22 10:06:00
description: "从 while(true) 到事件循环，从 CI/CD pipeline 到 Agent 的 self-correction，循环一直是系统的核心结构。但我们对它的态度很分裂——一边知道循环是必要的，一边又觉得循环是危险的（死循环、无..."
keywords: "loop, engineering, 循环不是问题, 是解法, loop engineering, agent, harness, 工程方法论"
---

软件工程花了五十年学会一件事：别怕循环。

从 `while(true)` 到事件循环，从 CI/CD pipeline 到 Agent 的 self-correction，循环一直是系统的核心结构。但我们对它的态