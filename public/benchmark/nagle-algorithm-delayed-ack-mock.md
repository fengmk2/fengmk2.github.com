# 模拟 Nagle 算法的Delayed Ack

最近做了keepalive优化，在线上应用使用了[agentkeepalive]，
从监控系统观察到，我们预期的 [TIME_WAIT] 过多的问题解决了；
但是，应用的响应时间RT在非正常的情况下，很平均地涨了40ms，由原来的4-5ms，涨到44-46ms之间。

## 摸索导致RT增加了40ms的原因

由于是对Agent增加了KeepAlive的支持，很自然地会去看 [net] 模块的文档，通过搜索`keepAlive`，
肯定会定位到[socket.setKeepAlive()]方法。

但是根据[socket.setKeepAlive()]方法的文档描述，和我们的问题没多大关联。

在屏幕中的[socket.setNoDelay()]吸引了我的视线，然后我看到`Nagle algorithm`，
然后想起之前看过的[网络编程中Nagle算法和Delayed ACK的测试]。

文中描述的一段：

> 可以看到，每次请求到应答的时间间隔都在40ms，除了第一次。linux的delayed ack是40ms，而不是原来以为的200ms。第一次立即ACK，似乎跟linux的quickack mode有关，这里我不是特别清楚，有比较清楚的同学请指教。

*40ms*，和我们的问题现象一致！

## 重现 Nagle's Delayed ACK

按照[网络编程中Nagle算法和Delayed ACK的测试] 文中说到的 `write-write-read` 模式，
使用 [http.request()] + [agentkeepalive@v0.1.0] 模拟重现本文遇到的问题。

模拟程序分为 客户端(Client) 和 服务端(Server) 两个角色。

重现过程：Client 发送支持 Keepalive 的HTTP POST请求，然后等待 Server 响应数据。

### 服务端(Server)

[nagle_delayed_ack_server.js](https://github.com/fengmk2/fengmk2.github.com/blob/master/benchmark/nagle_delayed_ack_server.js)

```js
var http = require('http');
var microtime = require('microtime');

http.createServer(function (req, res) {
  var size = 0;
  var start = microtime.now();
  req.on('data', function (data) {
    size += data.length;
  });
  req.on('end', function () {
    var use = microtime.now() - start;
    res.end(JSON.stringify({
      port: req.connection.remotePort,
      size: size,
      headers: req.headers,
      method: req.method,
      url: req.url,
      use: use,
    }));
    console.log('[%sμs] %s:%s %s %s',
      use, req.connection.remoteAddress, req.connection.remotePort, req.method, req.url);
  });
}).listen(1984);
```

### 客户端(Client)

[nagle_delayed_ack_client.js](https://github.com/fengmk2/fengmk2.github.com/blob/master/benchmark/nagle_delayed_ack_client.js)

```js
// npm install agentkeepalive@0.1.0: should reappear the delay problem
// npm install agentkeepalive@0.1.1+: should slove the delay problem
var Agent = require('agentkeepalive');
var http = require('http');
var microtime = require('microtime');

var agent = new Agent();

function request(callback) {
  var options = {
    host: 'localhost',
    port: 1984,
    path: '/fengmk2',
    method: 'POST',
    agent: agent
  };
  var start = microtime.now();
  var req = http.request(options, function (res) {
    res.on('end', function () {
      var use = microtime.now() - start;
      console.log('[%sμs] %s', use, res.statusCode);
      callback();
    });
  });
  req.write('foo');
  process.nextTick(function () {
    req.end('bar');
  });
}

function next() {
  setTimeout(function () {
    request(next);
  }, 1000);
}

next();
```

分别运行 Server 和 Client，输出如下:

### 重新 Delayed Ack 的场景

可以看到，第一次请求不会等待Ack，但是从第二次请求开始，rt都增加了40ms，就是我们遇到的问题。

Server

```bash
$ node nagle_delayed_ack_server.js

[402μs] 127.0.0.1:6666 POST /fengmk2
[38971μs] 127.0.0.1:6666 POST /fengmk2
[39685μs] 127.0.0.1:6666 POST /fengmk2
[40662μs] 127.0.0.1:6666 POST /fengmk2
[40519μs] 127.0.0.1:6666 POST /fengmk2
[39600μs] 127.0.0.1:6666 POST /fengmk2
[39290μs] 127.0.0.1:6666 POST /fengmk2
[39101μs] 127.0.0.1:6666 POST /fengmk2
[39659μs] 127.0.0.1:6666 POST /fengmk2
[39685μs] 127.0.0.1:6666 POST /fengmk2
```

Client

```bash
$ node nagle_delayed_ack_client.js

[9659μs] 200
[40702μs] 200
[40306μs] 200
[41571μs] 200
[41388μs] 200
[40879μs] 200
[39812μs] 200
[40277μs] 200
[40328μs] 200
[40317μs] 200
```

## 解决问题

通常，找原因都是非常漫长的，而解决问题通常都是一瞬间的。

只需要在[agentkeepalive]中增加[一行代码](https://github.com/TBEDP/agentkeepalive/commit/b04778071a9e2a5a47516daebe16c8f175b92460#diff-2):

```js
s.setNoDelay(true);
```

问题就解决了。

  
  [agentkeepalive]: https://github.com/TBEDP/agentkeepalive
  [agentkeepalive@v0.1.0]: https://github.com/TBEDP/agentkeepalive/commits/v0.1.0
  [net]: http://nodejs.org/api/net.html
  [TIME_WAIT]: http://serverfault.com/questions/219939/too-many-time-wait-state-connections
  [socket.setKeepAlive()]: http://nodejs.org/api/net.html#net_socket_setkeepalive_enable_initialdelay
  [socket.setNoDelay()]: http://nodejs.org/api/net.html#net_socket_setnodelay_nodelay
  [网络编程中Nagle算法和Delayed ACK的测试]: http://www.blogjava.net/killme2008/archive/2011/06/30/353441.html
  [http.request()]: http://nodejs.org/api/http.html#http_http_request_options_callback
