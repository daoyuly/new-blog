---
title: 搭建git服务器
tags: git
abbrlink: 1721
date: 2020-02-04 16:02:25
---

以centos为例，简单介绍如何搭建git服务器。
<!-- more -->

# 安装git
```shell
yum install curl-devel expat-devel gettext-devel openssl-devel zlib-devel perl-devel
yum install git
```
# 创建用户
创建一个git用户组和用户，用于运行git服务，并设置密码
```shell
sudo groupadd git
sudo useradd -g git
sudo passwd git
```
# 创建登录证书
 收集所有需要登录的用户的公钥，公钥位于id_rsa.pub, 把公钥导入到/home/git/.ssh/authorized_keys，如果需要创建：
```shell
cd /home/git/
mkdir .ssh
chmod 755 .ssh
touch .ssh/authorized_keys
chmod 644 .ssh/authorized_keys
```
# 初始化git仓库
需要选定一个目录作为git仓库，比如/home/gitrepo/demo.git
```shell
cd /home
mkdir gitrepo
chown git:git gitrepo
cd gitrepo

# 创建仓库
git init —bare demo.git
```

# 修改仓库的用户组和用户
Git就会创建一个裸仓库，裸仓库没有工作区，因为服务器上的Git仓库纯粹是为了共享，所以不让用户直接登录到服务器上去改工作区，并且服务器上的Git仓库通常都以.git结尾。然后，把owner改为git：
```shell
chown -R git:git demo.git
```

# 禁用用户git的shell登录
处于安全考虑，用户git禁用shell登录
```shell
vi /etc/passwd
#git:x:1001:1001:,,,:/home/git:/bin/bash 改成
git:x:1001:1001:,,,:/home/git:/usr/bin/git-shell
```

# clone 远程仓库
至此，git仓库就可以使用了
```shell
git clone git@192.168.1.1:/home/gitrepo/demo.git
```

参考
- [搭建git服务器](https://www.liaoxuefeng.com/wiki/896043488029600/899998870925664)
- [git服务器搭建](https://www.runoob.com/git/git-server.html)