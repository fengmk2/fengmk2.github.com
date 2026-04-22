# Hello koa, good bye connect

## 从前的 connect

```js
var connect = require('connect');
var eventproxy = require('eventproxy');
var tair = require('./common/tair');

var app = connect();

// TODO: add render

app.use(function (req, res, next) {
  var ep = eventproxy.create();
  ep.fail(next);

  // 并发取 k1, k2
  tair.get('k1', ep.done('v1'));
  tair.get('k2', ep.done('v2'));

  tair.on('v1', function (v1) {
    // k1 取完接着取 k3
    if (v1) {
      return tair.get('k3', ep.done('v3'));
    }
    ep.emit('v3');
  });

  ep.all('v1', 'v2', 'v3', function (v1, v2, v3) {
    res.render('home.html', {
      v1: v1,
      v2: v2,
      v3: v3
    });
  });
});

app.listen(1984);
```

这是我在没有遇到 co 和 koa 之前, 一直写的业务逻辑代码. 基于事件机制,
虽然能很好地解决 [callback hells](https://github.com/dead-horse/callback_hell),
但是让另外一个人看懂业务逻辑, 不是一件简单的事情.

## 现在的 koa

```js
var koa = require('koa');
var thunkfiy = require('thunkify-wrap');
var tair = require('./common/tair');

tair.get = thunkfiy(tair.get);

var app = koa();

// TODO: add render

app.use(function *(next) {
  var ep = eventproxy.create();
  ep.fail(next);

  // 并发取 k1, k2
  var rs = yield [tair.get('k1'), tair.get('k2')];
  var v1 = rs[0];
  var v2 = rs[1];
  var v3 = null;
  if (v1) {
    // k1 取完接着取 k3
    v3 = yield tair.get('k3');
  }

  yield this.render('home.html', {
    v1: v1,
    v2: v2,
    v3: v3
  });
});

app.listen(1984);
```

一切都是回归同步顺序的方式, 从上到下这样顺序写, 顺序执行.
很适合后端编码的思维.

如果大家已经熟悉了事件编程, 或者看惯了 callback, 那么 koa 一开始看起来还是比较奇怪的. 为什么能这么神奇.

一旦大家用上了 koa , 就无法回头写 callback 了.

## 神马? 没多大差别啊

厄, 看来你的功力不错, 好吧, 那大家来看看 cnpm 的一个同步逻辑代码吧:

* callback 和 事件版本: https://github.com/cnpm/cnpmjs.org/blob/3526c9eff7616098ed1cbd52378198f8b2b77de4/proxy/sync_module_worker.js
* co 版本: https://github.com/cnpm/cnpmjs.org/blob/master/proxy/sync_module_worker.js

祝大家早日用上 koa 和 co

:)
