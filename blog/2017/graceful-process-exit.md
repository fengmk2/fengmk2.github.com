# 子进程的优雅退出

## 案例描述

在做 egg-cluster 的时候，app worker 是由 cluster fork 出来的，然而 agent worker 是 master 通过 child_process.fork 出来的。
他们两者之间在 master 正常退出的情况下，没太大区别。

但是在 master 意外被强杀，如 `kill -9` 杀掉，那么 app worker 还是会优雅退出，
但是 agent worker 缺变成了孤儿进程，通过 https://github.com/eggjs/egg-cluster/pull/27 可以看到最终的效果。

> 这个 fix 也证明，通过 child_process fork 出来的子进程，
如果需要实现父进程挂了子进程也跟着挂，必须在子进程里面也加上相应的处理，才能实现，没办法只通过父进程来实现。

于是我们将这里子进程优雅退出的解决方案封装到一个 [graceful-process](https://github.com/node-modules/graceful-process) 模块统一解决，只需要在子进程代码里面执行一下优雅退出逻辑即可。

```js
const gracefulExit = require('graceful-process');

gracefulExit({
  logger: yourlogger,
  label: 'my_worker',
});
```

## 使用案例

- egg-cluster: https://github.com/eggjs/egg-cluster/pull/30
- egg-staticlocal: http://gitlab.alipay-inc.com/chair/egg-staticlocal/merge_requests/33
