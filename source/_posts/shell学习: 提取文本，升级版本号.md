---
title: 使用提取文本，升级版本号
date: 2020-02-20 00:38:06
tags: shell 语言学习
---

使用shell写Android的自动构建脚本时，需要从build.gradle中读取当前的版本号，自动加1，最后写入build.gradle。其中使用到grep，sek命令，具体代码如下：

基本思路：
- 通过grep获取版本号的位置，存到临时文件tmpshelldata.txt
- 使用sed提取tmpshelldata.txt中的具体版本号，并且用命令替换赋值给一个变量version1
- 通过 version1 加 1，计算新的版本号
- 使用sed命令，用新版本号 代替 老版本号
- 删除临时文件

sed的一些技巧：
- 提取字符串 是使用正则替换的方法，用\1捕获到的字符串，替换其他的，\1其实要提取的字符串
- 在mac上使用 -i替换，后面必须加个"", 否则不生效，这和linux上不同

```shell
gradleSrc=./

function updateVersionHomePatch(){
    touch ./tmpshelldata.txt
    grep -o "def versionHomePatch = \([0-9]*\)" $gradleSrc > ./tmpshelldata.txt
    version1=`sed 's/.*def versionHomePatch = \([0-9]*\)/\1/' ./tmpshelldata.txt`
    echo "当前版本：$version1";
    add=1
    count=$[$version1+add]
    echo "打包版本：$count"
    new="def versionHomePatch = $count"
    sed -i "" "s/def versionHomePatch = $version1/def versionHomePatch = $count/" 
    cd $gradleSrc
    rm -f ./tmpshelldata.txt
}

updateVersionHomePatch
```