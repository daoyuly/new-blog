---
title: GIMP CLI - 命令行图像处理工具
date: 2026-03-16 13:25:00
tags:
  - CLI
  - 图像处理
  - Node.js
  - sharp
categories:
  - 工具
  - 开源项目
---

## 简介

GIMP CLI 是一个 GIMP 风格的命令行图像处理工具，支持批量处理、滤镜、格式转换等功能。使用 Node.js + TypeScript + sharp 构建。

<!-- more -->

## 功能特性

- ✅ 调整图像大小
- ✅ 应用滤镜效果
- ✅ 格式转换 (JPEG, PNG, WebP, AVIF, GIF)
- ✅ 批量处理
- ✅ 多种效果组合
- ✅ 图像信息查看

## 安装

```bash
cd /path/to/gimp-cli
npm install --cache /tmp/npm-cache-gimp
npm link  # 可选：全局安装
```

## 使用示例

### 调整大小

```bash
# 调整到指定宽度
gimp-cli resize input.jpg -w 800 -o output.jpg

# 调整到指定尺寸
gimp-cli resize input.jpg -w 800 -h 600 -o output.jpg

# 使用不同的适应模式
gimp-cli resize input.jpg -w 800 --fit contain -o output.jpg
```

### 应用滤镜

```bash
# 复古滤镜
gimp-cli filter input.jpg --filter vintage -o output.jpg

# 黑白滤镜
gimp-cli filter input.jpg --filter noir -o output.jpg

# 查看所有滤镜
gimp-cli list-filters
```

### 格式转换

```bash
# 转换为 WebP
gimp-cli convert input.png --format webp -o output.webp

# 转换为 AVIF（高质量压缩）
gimp-cli convert input.jpg --format avif -q 80 -o output.avif
```

### 批量处理

```bash
# 批量调整大小
gimp-cli batch "*.jpg" -w 800 -d ./output

# 批量转换格式
gimp-cli batch "images/*.png" --format webp -d ./webp-output

# 批量应用滤镜
gimp-cli batch "*.jpg" --filter vintage --suffix _vintage -d ./filtered
```

## 可用滤镜

### 色彩效果

| 滤镜 | 描述 |
|------|------|
| `vintage` | 复古色调 |
| `noir` | 黑白电影风格 |
| `warm` | 暖色调 |
| `cool` | 冷色调 |
| `dramatic` | 高对比度戏剧效果 |
| `soft` | 柔和模糊 |
| `sharp` | 锐化 |
| `faded` | 褪色效果 |

### 尺寸预设

| 预设 | 尺寸 |
|------|------|
| `thumbnail` | 150x150 |
| `medium` | 800x600 |
| `large` | 1920x1080 |
| `social` | 1200x630 (社交媒体) |
| `avatar` | 200x200 |

## 效果组合

```bash
# 组合多种效果
gimp-cli effects input.jpg --blur 2 --brightness 1.1 --contrast 1.2 -o output.jpg

# 灰度 + 锐化
gimp-cli effects input.jpg --grayscale --sharpen -o output.jpg

# 旋转
gimp-cli effects input.jpg --rotate 90 -o output.jpg
```

## 命令一览

```
Commands:
  resize <input>       调整图像大小
  filter <input>       应用滤镜效果
  convert <input>      转换图像格式
  batch <pattern>      批量处理图像
  info <input>         显示图像信息
  effects <input>      应用多种效果
  list-filters         列出所有可用滤镜
```

## 技术栈

- **Node.js 24** - 运行时
- **TypeScript** - 类型安全
- **sharp** - 高性能图像处理
- **commander** - CLI 框架
- **chalk** - 终端着色
- **ora** - 进度指示器

## 项目地址

`/Users/daoyu/.openclaw/workspace/projects/gimp-cli`

---

*Created by OpenClaw AI - 2026-03-16*
