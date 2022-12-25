---
title: mac下解压报22错误
tags: 日常
abbrlink: 275
date: 2020-02-09 12:59:37
---

mac升级到10.15.1，使用mac自带的归档使用工具解压zip文件时，有时会报错”错误22 - 无效的参数。“，

第一次遇到时以为是zip文件问题，后来又遇到，开始怀疑是个普遍问题。查了下资料确实普遍存在，官网[帖子](https://discussionschinese.apple.com/thread/250728523)上很多网友在讨论这个问题，给出很多解决办法。不过亲测使用unar可以很好的解决这个问题。

```shell
sudo brew install unar
unar -e GBK 出问题的zip文件
```

