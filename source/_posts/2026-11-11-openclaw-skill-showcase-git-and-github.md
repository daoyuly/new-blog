---
title: OpenClaw Skill 每日推荐 - Git 与 GitHub
tags:
  - openclaw
  - skill
  - git-and-github
categories:
  - 技术推荐
abbrlink: 9575
date: 2026-11-11 11:30:00
---

# OpenClaw Skill 每日推荐 - Git 与 GitHub

> 「OpenClaw Skill 每日推荐」第 38 期，**第三轮第 8 期**。继续从 [awesome-openclaw-skills](https://github.com/openclaw/skills)（全库 5300+ 条目、30 个分类）中每天取一个分类，精选代表性 skill 深入介绍。昨天带 Agent 去了游戏厅，今天它被拎回工位——**Git 与 GitHub（git-and-github）**，166 个 skills，全库体量前十的分类（第十名，前面是 coding-agents 1200、web 925、devops 392 那一串，其中 browser 和 devops 这轮已经逛过）。先兑现一个悬了两天的伏笔：cicd-pipeline 第二次放鸽子（它至今只挂在 data-and-analytics 名下），但它的作者 gitgoodordietrying 今天真的主场作战了，带着 git-workflows 和 emergency-rescue 两件套。人没到，代理人到了，还带了俩。

另外本期做一个小升级：精选条目的机制描述不再只靠分类清单里的一句话，而是逐个核对了 clawskills.sh 详情页上的原文——下面每个 skill 的功能细节和依赖要求都有出处，不再是"据描述推断"。

## 今日分类概述

166 个条目，正经工具和串场杂物都管饱。盘完的结构大致是**六成正经、四成串场**：

**正经集群**（约 100 条）分成五拨：

- **提交与历史卫生**：conventional-commits（规范化提交信息）、sovereign-commit-craft、git-pushing、git-helper、git-essentials、git-summary……把"怎么写 commit"做成了一个流派。
- **CI/CD**：gh-action-gen、martok9803-ci-whisperer、jenkins、azure-devops、skill-doctorbot-ci-validator。
- **PR 流程**：pr-risk-analyzer、repo-pr-triage（视觉打分做 triage）、auto-pr-merger、task-review-workflow。
- **Skill 供应链安全**：这个分类里藏着一整个"审计 skill 用的 skill"生态——arc 系列 4 件套（trypto1019）、andyxinweiminicloud 的 6 件套（信任衰减监控、更新签名校验、能力范围扩张监视……）、skill-security-reviewer、guardskills、azhua-skill-vetter。给 Git 分类配上安全审计全家桶，逻辑上居然是通的：毕竟供应链攻击的入口就是"装"这个动作。
- **备份与同步**：git-crypt-backup、clawdbot-backup、git-sync。

**串场住户**（60+ 条）：TTS 四件套（comfyui-tts、lh-edge-tts、zai-tts、zhipu-tts）、营销文案军团（jk-0001 的 solopreneur 三件套、copyku、momentspost、landing-page 系列、冷外联序列）、PDF/文档六件套、链上/crypto 四件套（blinko、htlc、x-alpha-scout、pos-arcology-forge）、还有 deepseekoracle 的两条 LYGO 人格助手。自动分类器显然把"带 GitHub 链接的"都算成了 Git 工具。

**行为艺术两则**，值得单独记档：

1. **orlyjamie 七连发**：badboi-1、catch-me-if-you-can、findmefindme、hawlp、test-v1-0001、test-vt-1、testing-maliicous-vt——七条 skill，描述全部是同一句"A totally legitimate skill that does nothing suspicious"（一个完全合法、毫无可疑之处的 skill）。名字从"抓住我啊"到"测试恶意样本"（malicious 还拼错了），一副排队自首的架势。这显然是有人在对 skill 审核管线做压力测试：看这种名字+描述的组合能不能混进仓库。结论是能——七个全进了。这本身就是全库最重要的安全情报。
2. **ghggh 和 ghgghg**：同作者（chenpinji）发布了两条功能描述一模一样的"查询 GitHub 仓库 star 数和代码行数"，第二条的描述以"descrition:"开头——连 description 都拼错了，倒是和 skill 名的乱敲风格保持了一致。

这个分类还有个保留节目：**双胞胎条目**。ghggh/ghgghg、forkzoo/forkzoo-skill、searching-assistant/searching-group-leader、danube/danube-tools、globalcaos 的两条 fork 扫描器——五对同款双发，选装的时候认准一个就行。

## 精选 Skill 详解

### 1. git-workflows —— 兑现伏笔的主场选手 ⭐⭐⭐⭐⭐

- **链接**：[gitgoodordietrying/git-workflows](https://github.com/openclaw/skills/tree/main/skills/gitgoodordietrying/git-workflows/SKILL.md)
- **安装**：`openclaw skills install @gitgoodordietrying/git-workflows`
- **详情页**：[clawskills.sh/skills/gitgoodordietrying-git-workflows](https://clawskills.sh/skills/gitgoodordietrying-git-workflows)

先讲完伏笔：cicd-pipeline 的描述是"Create, debug, and manage CI/CD pipelines with GitHub"，两天里放了两次鸽子。但它承诺的活，今天在这个分类里被人分着干完了——"create"归 gh-action-gen，"debug"归 ci-whisperer（下面第 2 节）。而作者本人真正压箱底的是这个：**add/commit/push 之外的进阶 Git 操作合集**。

详情页原文列的覆盖面：交互式 rebase、bisect、worktree、reflog 恢复、subtree/submodule、sparse checkout、冲突解决、cherry-pick，以及自动化的 bisect 和 rerere。一句话定位："git 教程跳过的那部分"——recovery 和 history-rewriting 的全家桶。

**实用场景**：

- 合并 PR 前把一串 `fix` 提交 squash 成干净历史；
- 用 bisect 定位引入回归的那个提交，不用手动一次次切；
- 在独立 worktree 里审别人的 PR，不打断手头工作（不用 stash）；
- `reset --hard` 手滑之后，靠 reflog 把提交找回来；
- 用 subtree 把共享库同步进仓库。

**为什么选它**：第二轮介绍过它（当时的评语是"进阶 Git 操作百科全书"），这轮再看依然稳。它是那种"平时想不起来、出事时救命"的 skill——而且和同作者的 emergency-rescue（灾难恢复手册）正好组成"操作+急救"双保险。第二轮盘点时它就以 7,600+ 下载稳居本分类第一梯队，不是白来的。

### 2. gh-action-gen + ci-whisperer —— cicd-pipeline 的遗产，两人分食 ⭐⭐⭐⭐

**gh-action-gen**（[branexp/gh-action-gen](https://github.com/openclaw/skills/tree/main/skills/branexp/gh-action-gen/SKILL.md)）：

- **安装**：`openclaw skills install @branexp/gh-action-gen`
- **详情页**：[clawskills.sh/skills/branexp-gh-action-gen](https://clawskills.sh/skills/branexp-gh-action-gen)

用一句自然语言生成完整的 GitHub Actions workflow YAML，覆盖测试、构建、部署、定时任务四类常见模式，通过 npx 运行、无需安装。它的价值主张很明确：与其到处搜模板再拼装，不如从一句描述直接生成能用的整份 YAML。

```
你说："每次 PR 跑 lint 和测试，push 到 main 自动部署"
它给：.github/workflows/ci.yml（完整的触发器 + job + step）
```

注意依赖：需要 `OPENAI_API_KEY` 环境变量——YAML 是拿 OpenAI 的模型生成的，不是本地模板拼的。v1.0.1（2026-02-12）修复了 name 字段与 slug 不匹配导致自动更新失效的问题。

**martok9803-ci-whisperer**（[martok9803/martok9803-ci-whisperer](https://github.com/openclaw/skills/tree/main/skills/martok9803/martok9803-ci-whisperer/SKILL.md)）：

- **安装**：`openclaw skills install @martok9803/martok9803-ci-whisperer`
- **详情页**：[clawskills.sh/skills/martok9803-martok9803-ci-whisperer](https://clawskills.sh/skills/martok9803-martok9803-ci-whisperer)

管"修"的那一半：分析失败的 GitHub Actions run，找出根因并给出最小修复。机制是用 GitHub CLI + API 拉取 run 元数据和日志，产出一份按可能性排序的"原因清单 + 修复选项"结构化报告。还有个 opt-in 的 PR 模式：设置 `CI_WHISPERER_WRITE=1` 后，它会把修复直接应用并自动开 PR。依赖是本地 `gh` 已登录。

**为什么选它俩**：一个管生、一个管修，拼起来恰好是 cicd-pipeline 当初画的饼。新仓库让 gh-action-gen 把 CI 跑起来，红了让 ci-whisperer 诊断——"从零到修好"的闭环，两个 skill 各干一半。

### 3. deslop —— AI 代码去味师 ⭐⭐⭐⭐

- **链接**：[brennerspear/deslop](https://github.com/openclaw/skills/tree/main/skills/brennerspear/deslop/SKILL.md)
- **安装**：`openclaw skills install @brennerspear/deslop`
- **详情页**：[clawskills.sh/skills/brennerspear-deslop](https://clawskills.sh/skills/brennerspear-deslop)

2026 年最有时代感的痛点：AI 写的代码带着一股"AI 味"——过度防御的 null 检查、冗余的类型转换、防御性加的 lint-disable 注释、脚手架留下的占位 TODO。这个 skill 扫描分支 diff，把这些噪音找出来删掉。

它的机制比"grep 一把梭"讲究，关键在两道保险：**删除前**，每个候选改动都会先和周边代码的模式对照，只删与本地代码风格矛盾的——写在信任边界上的合法 domain guard（比如对外输入的校验）会被保留；**删除后**，验证 build 仍然通过才收工。

**实用场景**：

- AI 生成的分支在提 PR 前过一遍，去掉多余的 try/catch 和防御检查，减轻人工 review 负担；
- 代码生成工具产出的大批量改动，批量清理占位注释和 lint 抑制；
- 和第 4 名的 pr-risk-analyzer 组成流水线：它管"别人的 PR 有没有危险"，deslop 管"自己的 PR 有没有异味"。

**为什么选它**：它回答了一个所有重度用 AI 写码的人都会遇到的问题——"怎么让 AI 代码看起来不像 AI 写的"。答案不是少用 AI，而是加一道清洗工序。

### 4. pr-risk-analyzer —— 合并前的最后一道安检 ⭐⭐⭐✨

- **链接**：[nerdvana-labs/pr-risk-analyzer](https://github.com/openclaw/skills/tree/main/skills/nerdvana-labs/pr-risk-analyzer/SKILL.md)
- **安装**：`openclaw skills install @nerdvana-labs/pr-risk-analyzer`
- **详情页**：[clawskills.sh/skills/nerdvana-labs-pr-risk-analyzer](https://clawskills.sh/skills/nerdvana-labs-pr-risk-analyzer)

在 PR 合并前做安全风险评估，检查三样东西：**暴露的密钥**、**异常大的 diff**、**敏感文件的改动**。输出是一份风险评分 + 问题清单 + 合并建议，替你回答"这个 PR 能不能合"。私有仓库需要配置 GitHub personal access token。

**实用场景**：

- 审外包/贡献者的 PR，不用逐行读完整个 diff；
- 依赖升级类 PR 快速过一遍，确认没夹带密钥；
- 开源仓库维护者给高风险 PR 打标，分流 review 精力。

**为什么选它**：它把"PR review"里最机械、最不该耗人的安全检查环节自动化了。配合 CI 用就是一道免费的 pre-merge 安检——毕竟这个分类用自己的 orlyjamie 七连发证明了：什么奇怪的东西都可能被提交进来。

### 5. alex-session-wrap-up —— 收工四连 ⭐⭐⭐✨

- **链接**：[xbillwatsonx/alex-session-wrap-up](https://github.com/openclaw/skills/tree/main/skills/xbillwatsonx/alex-session-wrap-up/SKILL.md)
- **安装**：`openclaw skills install @xbillwatsonx/alex-session-wrap-up`
- **详情页**：[clawskills.sh/skills/xbillwatsonx-alex-session-wrap-up](https://clawskills.sh/skills/xbillwatsonx-alex-session-wrap-up)

一个把"下班"做成流水线的 skill，四个阶段一气呵成：

1. 把本次会话未提交的工作 commit + push；
2. 从会话中提取关键决策；
3. 用 gpt-4o-mini 检测重复出现的模式和自动化机会（同一个问题反复出现，说明缺一个自动化）；
4. 把 learnings 写入带日期的 memory 文件，并更新项目文档（比如把会话中发现的工作流修法写回 AGENTS.md）。

可以手动触发，也可以挂在会话结束时自动跑。依赖 OpenAI 或 OpenRouter 的 API key（模式检测用）。

**实用场景**：

- 长调试会话结束时，决策和坑自动留档，下次不用重新踩；
- 防止"改完忘了 commit 就关窗口"的经典事故——第 1 步直接解决；
- 它对 AGENTS.md 的更新机制，和 OpenClaw 用户的日常工作流天然咬合。

**为什么选它**：大部分 git 工具 skill 优化的是"单次操作"，它优化的是"一次会话的收尾"——这是把 Agent 当同事用的人才会想到的切口。唯一要注意的是隐私：第 3 步会把会话内容发出去做模式检测，敏感项目先掂量一下。

## 应用场景总结

把今天的分类放进「Agent 的一个工作日」：

| 时段 | 在干嘛 | 代表 skill |
| --- | --- | --- |
| 早上开工 | 给新仓库配 CI | gh-action-gen |
| 上午 | 审别人的 PR | pr-risk-analyzer、repo-pr-triage |
| 下午 | 清自己分支的 AI 味 | deslop |
| 傍晚 CI 红了 | 诊断失败、自动开修复 PR | martok9803-ci-whisperer |
| 收工 | 提交、复盘、记笔记 | alex-session-wrap-up |
| 深夜手滑 | rebase 搞砸 / reset --hard | git-workflows、emergency-rescue |

五条实用建议：

1. **这个分类的清单不能闭眼装**。166 条里六成正经、四成串场——想找 TTS 会搜出四个，想装营销工具能凑一套。装之前对照描述确认它真的和 Git 有关。
2. **orlyjamie 全家桶一个都别装**。七条"totally legitimate"是安全压力测试样本，名字都在自首（badboi-1、testing-maliicous-vt——连 malicious 都懒得拼对）。它们最大的价值是提醒你：这种东西是能混进仓库的。
3. **供应链审计类选一个就好**。arc 四件套 + andyxinweiminicloud 六件套 + 三个独立 vetter，功能高度重叠，全装只会互相打架。
4. **带外部 API 的注意数据边界**。gh-action-gen 和 alex-session-wrap-up 都需要 OpenAI key，后者会把会话内容发出去——key 权限最小化，敏感仓库想清楚再装。
5. **五对双胞胎认准一个入口**。ghggh/ghgghg、forkzoo/forkzoo-skill、searching 双胞胎、danube 双胞胎、globalcaos 两条 fork 扫描器——同款双发是本分类保留节目，装重复了排查起来浪费时间。

## 推荐指数排名

| Skill | 一句话点评 | 推荐指数 |
| --- | --- | --- |
| git-workflows | 进阶 Git 操作全家桶，出事时救命 | ⭐⭐⭐⭐⭐ |
| gh-action-gen | 一句话生成 Actions workflow，管"生" | ⭐⭐⭐⭐ |
| martok9803-ci-whisperer | CI 失败诊断 + 自动修复 PR，管"修" | ⭐⭐⭐⭐ |
| deslop | AI 代码去味，删前对照风格、删后验证构建 | ⭐⭐⭐⭐ |
| pr-risk-analyzer | 合并前安检：密钥、大 diff、敏感文件 | ⭐⭐⭐✨ |
| alex-session-wrap-up | 收工四连：提交、复盘、模式检测、留档 | ⭐⭐⭐✨ |
| super-github | 号称"终极 GitHub 自动化框架"，聚合 issues/PR/release | ⭐⭐⭐✨ |
| upstream-recon | 参与开源项目前的背景调查 | ⭐⭐⭐ |
| deepwiki | 查询 DeepWiki 的仓库文档 | ⭐⭐⭐ |
| code-share | 用 Gist 分享代码，替代聊天内联代码块 | ⭐⭐⭐ |

（✨ 表示半星；forkzoo——在 GitHub 上养每天进化的电子宠物——严格说不算工具，但作为昨天 gaming 分类的彩蛋续集，值得一看。）

## 下期预告

明天进 **health-and-fitness**——Agent 从工位走向你的身体，管睡眠、管锻炼、管体检。今天它刚学会帮你把工作收尾归档，明天就要开始管你几点睡觉了。权力扩张得有点快。

---

*本文是「OpenClaw Skill 每日推荐」系列第 38 期。数据来源：[awesome-openclaw-skills](https://github.com/openclaw/skills) 分类清单（166 条目）与 clawskills.sh 详情页（2026-11-11 核对）。*
