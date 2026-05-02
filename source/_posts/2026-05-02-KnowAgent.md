---
title: "KnowAgent 项目深度分析报告"
date: 2026-05-02 11:00:00
tags:
  - open-source
  - ai-repo
  - daily-research
  - deep-analysis
categories:
  - 开源项目研究
---

# KnowAgent 项目深度分析报告

> 本报告由 OpenClaw 自动生成（AI 深度分析版）
>
> 研究日期: 2026-05-02
>
> 项目路径: /Users/daoyu/Documents/ai-repo/KnowAgent

---

## 📊 项目概览

- **项目名称**: KnowAgent
- **文件数量**: 548 个文件
- **主要插件**: 0 个

---

> ⚠️ AI 分析失败，本报告基于项目基本信息生成。

## 1. 项目概述



<div align="center">
<img src="img/icon.png" width="360px">  


  **Knowledge-Augmented Planning for LLM-Based Agents.**

  <p align="center">
  <a href="https://arxiv.org/abs/2403.03101">📄Paper</a> •
  <a href="https://www.zjukg.org/project/KnowAgent/">🌐Web</a>
	</p>  

[![Awesome](https://awesome.re/badge.svg)](https://github.com/zjunlp/KnowAgent) 
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
![](https://img.shields.io/github/last-commit/zjunlp/KnowAgent?color=green) 

</div>

---

<img src="img/method.gif" alt="method"/>

​	Our development is grounded on several key steps: **Initially**, we create an extensive *action knowledge base*, which amalgamates action planning knowledge pertinent to specific tasks. This database acts as an external reservoir of information, steering the model's action generation process.  **Subsequently**, by converting action knowledge into text, we enable the model to deeply unders

---

## 📁 文件结构示例

```
/Users/daoyu/Documents/ai-repo/KnowAgent/architect.md
/Users/daoyu/Documents/ai-repo/KnowAgent/requirements.txt
/Users/daoyu/Documents/ai-repo/KnowAgent/.claude/settings.local.json
/Users/daoyu/Documents/ai-repo/KnowAgent/README.md
/Users/daoyu/Documents/ai-repo/KnowAgent/img/icon.png
/Users/daoyu/Documents/ai-repo/KnowAgent/img/method.gif
/Users/daoyu/Documents/ai-repo/KnowAgent/.gitignore
/Users/daoyu/Documents/ai-repo/KnowAgent/Self-Learning/train.sh
/Users/daoyu/Documents/ai-repo/KnowAgent/Self-Learning/traj_reformat.sh
/Users/daoyu/Documents/ai-repo/KnowAgent/Self-Learning/traj_filter_merge.sh
/Users/daoyu/Documents/ai-repo/KnowAgent/Self-Learning/train_iter.sh
/Users/daoyu/Documents/ai-repo/KnowAgent/Self-Learning/train/alfworld_prompts/taskprompt.py
/Users/daoyu/Documents/ai-repo/KnowAgent/Self-Learning/train/alfworld_prompts/example.py
/Users/daoyu/Documents/ai-repo/KnowAgent/Self-Learning/train/HotpotQA_reformat.py
/Users/daoyu/Documents/ai-repo/KnowAgent/Self-Learning/train/ALFWorld_reformat.py
/Users/daoyu/Documents/ai-repo/KnowAgent/Self-Learning/train/datas/ALFWorld_data_knowagent.json
/Users/daoyu/Documents/ai-repo/KnowAgent/Self-Learning/train/datas/HotpotQA_data_knowagent.json
/Users/daoyu/Documents/ai-repo/KnowAgent/Self-Learning/train/train_lora_iter.py
/Users/daoyu/Documents/ai-repo/KnowAgent/Self-Learning/train/train_lora.py
/Users/daoyu/Documents/ai-repo/KnowAgent/Self-Learning/trajs/datas/HotpotQA_processed_knowagent.jsonl
/Users/daoyu/Documents/ai-repo/KnowAgent/Self-Learning/trajs/datas/KnowAgentALFWorld_llama-2-13b_D0.jsonl
/Users/daoyu/Documents/ai-repo/KnowAgent/Self-Learning/trajs/datas/KnowAgentHotpotQA_llama-2-13b_D0.jsonl
/Users/daoyu/Documents/ai-repo/KnowAgent/Self-Learning/trajs/datas/KnowAgentHotpotQA_llama-2-13b_D1.jsonl
/Users/daoyu/Documents/ai-repo/KnowAgent/Self-Learning/trajs/datas/ALFWorld_processed_knowagent.jsonl
/Users/daoyu/Documents/ai-repo/KnowAgent/Self-Learning/trajs/datas/KnowAgentALFWorld_llama-2-13b_D1.jsonl
/Users/daoyu/Documents/ai-repo/KnowAgent/Self-Learning/trajs/traj_merge_and_filter.py
/Users/daoyu/Documents/ai-repo/KnowAgent/Path_Generation/hotpotqa_run/config.py
/Users/daoyu/Documents/ai-repo/KnowAgent/Path_Generation/hotpotqa_run/fewshots.py
/Users/daoyu/Documents/ai-repo/KnowAgent/Path_Generation/hotpotqa_run/agent_arch.py
/Users/daoyu/Documents/ai-repo/KnowAgent/Path_Generation/hotpotqa_run/utils.py
...
(共 548 个文件)
```

---

*本报告由 OpenClaw 的 AI 深度分析系统生成*
*如有疑问或需要进一步分析，请联系研究者*
