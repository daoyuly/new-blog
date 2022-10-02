---
title: android手机执行go程序
date: 2020-03-02 23:23:11
tags: go android linux 刷机 root
---

# 概述
本文通过在root的android手机中执行一个go程序，来简单记录这基本过程和过程中使用的工具。
<!--more-->
# root android手机
我使用kingRoot，不过现在官方已经关闭了。幸好网络上很多下载可用，我选用的是5.3.6版本。
root的原理其实很简单就是把su程序放在系统目录的/system/xbin下，但是要打开这个有需要su的权限，于是打破这个死循环的方式就是各种root方式的区别了，但是本质上都是利用系统漏洞，因为手机厂商在手机出厂时，都是禁掉su权限的，也是不允许随意刷机的。
# 编写go程序并变成可在arm平台运行的程序
我们来一段简单的示例代码
```go
package main
import (
    "net/http"
    "time"
)
func main() {
    http.HandleFunc("/", myResponse)
    http.ListenAndServe("127.0.0.1:8888", nil)
}
func myResponse(w http.ResponseWriter,r* http.Request) {
    t := time.Now()
    timeString := t.Format("2006-01-02 15:04:05")
    str := "hello world! I am from go. time:"
    str += timeString
    w.Write([]byte(str))
}
```
- 本机平台编译测试一下
```shell
go build demo_service.go
./demo_service
wget 127.0.0.1:8888 -O test.html | vi ./test.html
```
- 交叉编译成arm平台的程序
```shell
GOOS="linux" GOARCH="arm" go build demo_service_arm32.go
```
# 复制demo_service_arm32.go到android手机
- 通过adb push把文件复制到sdcard上，通过mv命令把文件从sdcar上移动到/data/data，最后执行。
```shell
adb push ./demo_service_arm32 /sdcard
adb shell
su
cd /sdcard
mv ./demo_service_arm32 /data/data
chmod 777 ./demo_service_arm32
./demo_service_arm32
```
手机浏览器打开127.0.0.1:8888就可以看到结果了