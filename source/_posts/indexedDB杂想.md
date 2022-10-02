---
title: indexedDB杂想
date: 2020-04-06 14:44:19
tags: 技术杂想
---

## 仔细理解下indexedDB的设计哲学：
### indexedDB的数据基于键值对
value可以是任何复杂类型的object，键值就是这个这些对象的键值；
### 基于事务的操作模型
在indexedDB内的任何操作都是再事务内的；
这种基于事务的操作模型会很好的处理用户打开两个tab时的数据操作带来的不一致问题；
###  API都是异步的
数据库数据读取，插入，删除等所有的数据库都是异步的。这些操作都需要请求（request），数据库接收请求，接收请求，并执行请求中callback操作，操作结果会以dom event的形式通知
###  基于请求对象模型
请求本质上沟通用户层和数据库层的通信方式，请求上可以绑定事件，用以接收数据库层的操作结果。不同的数据库操作返回的请求对象也不同，包含的对象也是不同的；
###  当数据库操作结果可用时，数据库以dom event的方式通知使用者
在几乎所有的请求对象中，success和error都是可用的。需要注意的是success不能往上冒泡以及取消数据操作，而error却可以，error可以取消任何正在运行的数据库事务
###  对象数据，而不是关系数据库
###  NoSql 数据库
###  遵循同一来源策略
## 如何理解异步
在用户端上的操作上，indexeddb的操作思想和ajax一致，他们都是异步的，发送请求，然后结束，通过事件的形式通知，js的单线程和浏览器的宿主环境决定操作上不宜使用同步操作，这种思想被借鉴到很多地方，比如nginx和nodesjs，实际上很多不同操作环境的交互越来越多的使用这种方式，前端最常用的js和webview交互，在本质上也是这种，再具体实现上，因为webview和js不能传递包装好的request的请求，所以以消息队列的方式实现request的包装，在js侧上看和request数据库的操作类似；

在理解上，可以简单的看成请求-通知的模型，和观察者模式有异曲同工之妙；

随着前端技术标准化的发展，很多异步通信会被归结为一种标准化的操作；

## js的异步写法
前端在异步上的写法也越来越方便快捷，常用的有 callback模式，promise模式，async-await模式，以及生成器；我之前限于浅薄的认识，没有思考过这些模式的组合带来的一些效果，但是在indexedDB的接口封装中，这些模式的组合使用会带来更便利的使用。简单的分析下idb-keyval的实现思路。 作者把indexedDB的异步封装成了promise的形式，使用callback的模式封装具体的对数据库的操作，而用户端端看到的完全是promise化的接口。仔细品味以下核心代码：
```js
_withIDBStore(type: IDBTransactionMode, callback: ((store: IDBObjectStore) => void)): Promise<void> {
    return this._dbp.then(db => new Promise<void>((resolve, reject) => {
        const transaction = db.transaction(this.storeName, type);
        const store = transaction.objectStore(this.storeName)
        transaction.oncomplete = () => resolve();
        transaction.onabort = transaction.onerror = () => reject(transaction.error);
        callback(store);
    }));
}
```
在一个事务中，callback负责完成store的指定操作，比如get，put之类, oncomplete在事务完成后触发，这样就把一个transaction封装在了一个promise，而callback有留出了自定义操作的灵活。这种简洁的处理，有非常好借鉴意义。举个实际点的栗子：
封装一个用户购买游戏道具的标准流程：当用户发起购买时，1 请求接口，获取当前用户的等级；2 根据用户的等级，弹出不同的道具弹窗；3 用户选择关闭弹窗或者选择一个道具，发起支付，这个流程作为一个服务组件，弹不同的道具弹窗就是一个自定义动作，是不同的游戏关卡中自己定义的，核心代码如下：
```js

function purchaseProps(userId: string, openDialogCallback: (userInfo: any) => Promise<void>) {
    return fetch(`${get_userinfo_url}`).then(userInfo => new Promise((resolve, reject) => {
            const dialog = openDialogCallback(userInfo);
            dialog.then(propId => {
            resolve(propId);
            // doPay(); 继续封装道具购买流程
        }, () => {
            reject();
        }).catch(reason => reject(reason));
    }));
}

// 使用者
purchaseProps('king', userInfo => openKingDialong()).then((propId: string) => {
    doPay(); // 发起支付
})

```

