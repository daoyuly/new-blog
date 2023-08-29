---
title: go入门学习笔记
date: '2020年03月02日23:34:09'
tags: go 语言学习
abbrlink: 38316
---
go入门学习笔记

# 准备
- demo的前提条件，本机上按照有go的编译环境。
- 来一段代码测试下
```go
package main
import (
	"fmt"
)
func main()  {
	fmt.Printf("hello world")
}
```
- 调试方法
    - 目前基本是打印的方式，如果熟悉PHP的话，你懂得这方式.
    - 常用的打印方式：fmt.Print/fmt.Println/fmt.Printf.
    - 使用fmt.Printf打印变量
        - %+v 打印包括字段在内的实例的完整信息
        - %#v 打印包括字段和限定类型名称在内的实例的完整信息
        - %T 打印某个类型的完整信息
    - 使用panic, 获取执行点的堆栈信息
    - 使用defer来跟踪代码执行过程
    
