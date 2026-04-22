# Nodejs中的嵌套callback

## 困惑

Nodejs是异步的，所有IO请求都是异步的方式调用，需要指定一个callback函数处理返回的数据。
于是难免会出现一层层的嵌套callback。
当callback嵌套的层数太多，会引起许多开发者的困惑，怎么消除或者减少callback嵌套呢？

## 伪同步代码封装异步实现

为了解决嵌套callback的问题，目前出现了几个伪同步形式的代码封装异步实现的解决方案:

* jscex
* streaming

但是，这样看上去改变了现有的编码风格，表象让人感觉这是同步代码。
如果新手还未深入理解什么是异步的话，很难明白这些伪同步代码到底是如何实现异步功能的。

其次，虽然去除了嵌套callback的问题，但是却引入了其他成本：

* 学习这些实现的语法成本;
* 在编写代码时，需要时刻分清楚当前代码的情况，是伪同步，还是异步;
* 遇到非预料结果出现的时候，如何定位问题，如何调试等问题;

## 还是callback，减少callback

## 更多阅读

* [Currying the callback, or the essence of futures](http://bjouhier.wordpress.com/2011/04/04/currying-the-callback-or-the-essence-of-futures/)