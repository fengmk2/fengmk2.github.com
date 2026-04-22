# 给 connect 的 static 模块加上url路径前缀

估计我们使用 [connect](http://www.senchalabs.org/connect/) 都会很自然地按照官方的例子使用静态文件模块 [static](http://www.senchalabs.org/connect/static.html):

```js
var connect = require('connect');

connect(
  connect.static(__dirname),
  function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('Hello World\n');
  }
).listen(8124);

console.log('Server running at http://127.0.0.1:8124/');
```

## 基准性能

为了评测 `static` 的性能，我们需要又一个基准对比。

### 官方最纯洁的 helloworld

我们使用 nodejs 官方文档给出的 [helloworld](http://nodejs.org/docs/latest/api/synopsis.html) 做最基础的参照：

```js
var http = require('http');

http.createServer(function (request, response) {
  response.writeHead(200, {'Content-Type': 'text/plain'});
  response.end('Hello World\n');
}).listen(8124);

console.log('Server running at http://127.0.0.1:8124/');
```

### 最纯洁的 connect helloworld

不使用任何中间件模块

```js
var connect = require('connect');

connect(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('Hello World\n');
}).listen(8124);

console.log('Server running at http://127.0.0.1:8124/');
```

### 结合 [domain](http://nodejs.org/docs/latest/api/domain.html) 模块的 connect helloworld

```js
var connect = require('connect');
var createDomain = require('domain').create;

connect(
  function (req, res, next) {
    var domain = createDomain();
    domain.on('error', function (err) {
      console.log('errrrrr', err);
      res.statusCode = 500;
      res.end(err.message + '\n');
      domain.dispose();
    });
    domain.run(next);
  },
  function (req, res, next) {
    if (req.url === '/error') {
      process.nextTick(function () {
        res.end('params: ' + req.query.abc);
      });
      return;
    }
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('Hello World\n');
  }
).listen(8124);

console.log('Server running at http://127.0.0.1:8124/');
```

## 测试结果

官方最纯洁的 helloworld: `7851.56 qps`

```
$ siege -b -c10 -t10S http://127.0.0.1:8124/
** SIEGE 2.72
** Preparing 10 concurrent users for battle.
The server is now under siege...
Lifting the server siege...      done.

Transactions:          78123 hits
Availability:         100.00 %
Elapsed time:           9.95 secs
Data transferred:         0.89 MB
Response time:            0.00 secs
Transaction rate:      7851.56 trans/sec
Throughput:           0.09 MB/sec
Concurrency:            9.93
Successful transactions:       78123
Failed transactions:             0
Longest transaction:          0.09
Shortest transaction:         0.00
```

最纯洁的 connect helloworld: `6808.19 qps`

```
$ siege -b -c10 -t10S http://127.0.0.1:8124/
** SIEGE 2.72
** Preparing 10 concurrent users for battle.
The server is now under siege...
Lifting the server siege...      done.

Transactions:          65699 hits
Availability:         100.00 %
Elapsed time:           9.65 secs
Data transferred:         0.75 MB
Response time:            0.00 secs
Transaction rate:      6808.19 trans/sec
Throughput:           0.08 MB/sec
Concurrency:            9.96
Successful transactions:       65699
Failed transactions:             0
Longest transaction:          0.05
Shortest transaction:         0.00
```

使用 [domain](http://nodejs.org/docs/latest/api/domain.html) 模块的 connect helloworld: `5601.35 qps`

[domain demo for express](https://speakerdeck.com/u/felixge/p/domains-in-node-08)

```
** SIEGE 2.72
** Preparing 50 concurrent users for battle.
The server is now under siege...
Lifting the server siege...      done.

Transactions:              53885 hits
Availability:             100.00 %
Elapsed time:               9.62 secs
Data transferred:           0.62 MB
Response time:              0.01 secs
Transaction rate:        5601.35 trans/sec
Throughput:             0.06 MB/sec
Concurrency:               49.62
Successful transactions:       53885
Failed transactions:               0
Longest transaction:            0.05
Shortest transaction:           0.00
```

带 static 的 connect helloworld: `3636.98 qps`

```
$ siege -b -c10 -t10S http://127.0.0.1:8124/
** SIEGE 2.72
** Preparing 10 concurrent users for battle.
The server is now under siege...
Lifting the server siege...      done.

Transactions:          34915 hits
Availability:         100.00 %
Elapsed time:           9.60 secs
Data transferred:         0.40 MB
Response time:            0.00 secs
Transaction rate:      3636.98 trans/sec
Throughput:           0.04 MB/sec
Concurrency:            9.97
Successful transactions:       34915
Failed transactions:             0
Longest transaction:          0.06
Shortest transaction:         0.00
```

## 为什么性能降低了50%

晕，为什么加上了 `static` 模块，性能会降低了`50％`这么多？
查看 [static.send()](http://www.senchalabs.org/connect/static.html#send) 源代码:

```js
// "hidden" file
if (!hidden && '.' == basename(path)[0]) return next();

fs.stat(path, function(err, stat){
  // mime type
  type = mime.lookup(path);

  // ignore ENOENT
  if (err) {
    if (fn) return fn(err);
    return ('ENOENT' == err.code || 'ENAMETOOLONG' == err.code)
      ? next()
      : next(err);
  // redirect directory in case index.html is present
  } else if (stat.isDirectory()) {
    if (!redirect) return next();
    res.statusCode = 301;
    res.setHeader('Location', url.pathname + '/');
    res.end('Redirecting to ' + url.pathname + '/');
    return;
  }
```

static 模块每次都需要一次文件IO，判断文件是否存在，这是多么损耗性能啊。

## 增加静态文件url路径前缀

既然找到性能问题所在，就可以解决此问题了。对症下药，无需让所有请求都经过 `static` 处理即可。
给 `static` 增加一个url前缀判断，例如 `/public/images/logo.jpg` 只有前缀是 `/public` 的 url 请求才需要进入 `static` 模块处理。

那么我们改进后的代码应该是这样的:

```js
var connect = require('connect');

var app = connect();
app.use('/public', connect.static(__dirname));

app.use(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('Hello World\n');
}).listen(8124);

console.log('Server running at http://127.0.0.1:8124/');
```

性能如何？ wow `6749.03 qps`, 几乎和 connect hellowrold 一致。done!

```js
$ siege -b -c10 -t10S http://127.0.0.1:8124/
** SIEGE 2.72
** Preparing 10 concurrent users for battle.
The server is now under siege...
Lifting the server siege...      done.

Transactions:          66073 hits
Availability:         100.00 %
Elapsed time:           9.79 secs
Data transferred:         0.76 MB
Response time:            0.00 secs
Transaction rate:      6749.03 trans/sec
Throughput:           0.08 MB/sec
Concurrency:            9.97
Successful transactions:       66073
Failed transactions:             0
Longest transaction:          0.03
Shortest transaction:         0.00
```

重现一下之前的性能问题，访问 `/public/foo` 即可重现。

```js
$ siege -b -c10 -t10S http://127.0.0.1:8124/public/foo
** SIEGE 2.72
** Preparing 10 concurrent users for battle.
The server is now under siege...
Lifting the server siege...      done.

Transactions:          37773 hits
Availability:         100.00 %
Elapsed time:           9.59 secs
Data transferred:         0.43 MB
Response time:            0.00 secs
Transaction rate:      3938.79 trans/sec
Throughput:           0.05 MB/sec
Concurrency:            9.97
Successful transactions:       37773
Failed transactions:             0
Longest transaction:          0.05
Shortest transaction:         0.00
```
    
## 有爱

记得给 `connect.static` 加上一个url路径前缀喔!

^_^ 希望本文对你有用.
