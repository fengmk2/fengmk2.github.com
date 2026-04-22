# 使用 connect-domain 捕获异步调用中出现的异常

之前经常有同学会问到怎么有些异常无法捕获到呢？

虽然 [connect] 已经在 handler 外层加了 `try catch` ，还是无法捕获异步调用中产生的异常。

## 现状

例如最简单的 helloworld.js 代码

```js
var connect = require('connect');

var app = connect()
.use(function (req, res, next) {
  if (req.url === '/sync_error') {
    throw new Error('sync error');
  }
  if (req.url === '/async_error') {
    return process.nextTick(function () {
      mk2.haha();
    });
  }
  res.end('hello, ' + req.method + ' ' + req.url);
});

process.on('uncaughtException', function (err) {
  console.error(err);
});

app.listen(1985);
```

使用 `curl` 来简单测试一下

```bash
$ curl localhost:1985/foo
hello, GET /foo

$ curl localhost:1985/sync_error
Error: sync error
    at Object.handle ( .../app.js:33:11)
    ....
```

好像还挺正常的，异常也被捕获了。 继续测试

```bash
$ curl localhost:1985/async_error
```

没任何输出了吧？从服务器端控制台看到这样的输出: 证明触发了 `uncaughtException` 事件。

```bash
[ReferenceError: mk2 is not defined]
```

虽然我们能通过 `uncaughtException` 事件捕获到异步调用中产生的异常，但是我们没办法返回 HTTP 500 异常响应给调用者。
调用者也只能一直hold住，直到请求超时。

这是非常不好的做法，因为请求量很大，服务进程内存会暴涨，会导致进程超出内存限制，非正常退出。

## 改进

任何时候，如果服务器端出现异常，我们就应该返回HTTP 500 告诉调用者服务器异常了。

异步调用产生的异常也应该如此处理。

[nodejs@0.8](http://blog.nodejs.org/2012/06/25/node-v0-8-0/) 开始，增加了 [domain] 模块来帮助我们更好地处理异常。

让我们使用 [connect-domain] 来改进一下之前的 helloworld.js:

```js
var connect = require('connect');
var connectDomain = require('connect-domain');

var app = connect()
.use(connectDomain()) // just using connect-domian middleware
.use(function (req, res, next) {
  if (req.url === '/sync_error') {
    throw new Error('sync error');
  }
  if (req.url === '/async_error') {
    return process.nextTick(function () {
      mk2.haha();
    });
  }
  res.end('hello, ' + req.method + ' ' + req.url);
});

process.on('uncaughtException', function (err) {
  console.error(err);
});

app.listen(1984);
```

再看看 [connect-domain] 的实现，非常简单:

```js
var domain = require('domain');

module.exports = function (handler) {
  return function domainMiddleware(req, res, next) {
    var reqDomain = domain.create();

    res.on('close', function () {
      reqDomain.dispose();
    });

    reqDomain.on('error', function (err) {
      if (typeof handler === 'function') {
        handler(err, req, res, next);
      } else {
        next(err);
      }
    });

    reqDomain.run(next);
  };
};
```

重复刚才的 curl 测试:

```bash
$ curl localhost:1984/foo
hello, GET /foo

$ curl localhost:1984/sync_error
Error: sync error
    at Object.handle ( .../app.js:33:11)
    ....

$ curl localhost:1984/async_error
ReferenceError: mk2 is not defined
    at .../app.js:24:7
    at process.startup.processNextTick.process._tickCallback (node.js:244:9)
```

所有请求都有响应了。

服务器进程的输出: 

```bash
{ [ReferenceError: mk2 is not defined]
  domain_thrown: true,
  domain: 
   { domain: null,
     _events: { error: [Function] },
     _maxListeners: 10,
     members: [] } }
```

奇怪的连 `uncaughtException` 事件也触发了。这按我的思维来说，不应该触发才对的。

@isaacs 最新的提交已经修复此问题: https://github.com/joyent/node/issues/4375#issuecomment-11691069 

## 性能对比

到底使用了 domain 模块，会影响多少性能呢？

我写了一个对比 `http.createServer()`, `connect()` 和 `connect() with domain()` 的性能对比测试:

```bash
$ git clone git://github.com/fengmk2/connect-domain.git
$ cd connect-domain && git checkout benchmark
$ sh bench.sh
```

我的2010年的MBP 测试结果: node v0.8.16

* `http.createServer()`: 8293.73 trans/sec
* `connect()`: 7158.11 trans/sec , -13.7%
* `connect() with domain`: 6128.33 trans/sec, -26.1%

## 总结

应该没人再说 [nodejs] 无法捕获异步调用中出现的异常了吧？

## 参考链接

* [Node.js error handling](http://snmaynard.com/2012/12/21/node-error-handling/)
* [domain module](http://nodejs.org/api/domain.html)
* [connect-domain](https://github.com/baryshev/connect-domain)

## Benchmark results

server.js

```js
var connectDomain = require('connect-domain');
var connect = require('connect');
var http = require('http');

var helloworld = function (req, res, next) {
  req.on('end', function () {
    res.end('Hello world');
  });
};

var app1 = http.createServer(helloworld);
var app2 = connect(helloworld);
var app3 = connect(connectDomain(), helloworld);

app1.listen(9890);
app2.listen(9891);
app3.listen(9892);
```

```bash
$ sh bench.sh

v0.8.16

http.createServer() ...
** SIEGE 2.72
** Preparing 50 concurrent users for battle.
The server is now under siege...
Lifting the server siege...      done.

Transactions:         160152 hits
Availability:         100.00 %
Elapsed time:          19.31 secs
Data transferred:         1.68 MB
Response time:            0.01 secs
Transaction rate:      8293.73 trans/sec
Throughput:           0.09 MB/sec
Concurrency:           49.89
Successful transactions:      160152
Failed transactions:             0
Longest transaction:          0.06
Shortest transaction:         0.00
 
connect() ...
** SIEGE 2.72
** Preparing 50 concurrent users for battle.
The server is now under siege...
Lifting the server siege...      done.

Transactions:         143019 hits
Availability:         100.00 %
Elapsed time:          19.98 secs
Data transferred:         1.50 MB
Response time:            0.01 secs
Transaction rate:      7158.11 trans/sec
Throughput:           0.08 MB/sec
Concurrency:           49.92
Successful transactions:      143019
Failed transactions:             0
Longest transaction:          0.09
Shortest transaction:         0.00
 
connect() with connect-domain ...
** SIEGE 2.72
** Preparing 50 concurrent users for battle.
The server is now under siege...
Lifting the server siege...      done.

Transactions:         122444 hits
Availability:         100.00 %
Elapsed time:          19.98 secs
Data transferred:         1.28 MB
Response time:            0.01 secs
Transaction rate:      6128.33 trans/sec
Throughput:           0.06 MB/sec
Concurrency:           49.89
Successful transactions:      122444
Failed transactions:             0
Longest transaction:          0.10
Shortest transaction:         0.00
```

 [connect-domain]: https://github.com/baryshev/connect-domain
 [connect]: https://github.com/senchalabs/connect
 [domain]: http://nodejs.org/api/domain.html
 [nodejs]: http://nodejs.org
