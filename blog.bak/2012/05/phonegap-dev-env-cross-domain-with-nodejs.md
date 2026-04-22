# 使用nodejs解决phonegap开发期间的跨域问题

使用phonegap开发基于HTML5的iOS程序，应用程序需要访问额外的网络资源，就必然需要面对跨域访问的问题。

phonegap可以配置白名单，这样可以让最终打包的应用程序能跨域访问。

但是我们开发环境下，一般都是直接使用浏览器进行开发调试的，而浏览器没有这样的选项让我们设置白名单。

那要怎么解决跨域问题呢？每次修改代码后的测试都要启动模拟器，然后不方便地调试？我想大家不会这么做吧。

## nodejs 实现超简单的 `proxy`

将所有请求，通过本地node进程进行转发。
静态文件资源也有此proxy服务处理，也就解决了跨域问题。

```javascript
var http = require('http');
var path = require('path');
var urlparse = require('url').parse;
var connect = require('connect');

var app = connect();
app.use("/proxy", function (req, res) {
  var url = urlparse(req.url, true).query.url;
  if (!url) {
    return res.end(req.method + ': ' + req.url);
  }
  var target = urlparse(url);
  var headers = {};
  for (var k in req.headers) {
    if (k === 'host' || k === 'connection') {
      continue;
    }
    headers[k] = req.headers[k];
  }
  var options = {
    host: target.hostname,
    port: target.port || 80,
    path: target.path,
    method: req.method,
    headers: headers
  };

  var proxyReq = http.request(options, function (response) {
    res.writeHead(response.statusCode, response.headers);
    response.on('data', function (chunk) {
      res.write(chunk);
    });
    response.on('end', function () {
      res.end();
    });
  });

  proxyReq.on('error', function (err) {
    proxyReq.abort();
    res.writeHead(500);
    res.end(url + ' error: ' + err.message);
  });

  req.on('data', function (chunk) {
    proxyReq.write(chunk);
  });
  req.on('end', function () {
    proxyReq.end();
  });
});

app.use(connect.static(path.join(__dirname, "www"), { maxAge: 0 }));


app.listen(8001);
console.log("Server is launching at http://localhost:8001");
```

## 在代码中自动判断是否使用 `proxy`

通过判断 `navigator.notification` 是否存在，确定当前执行环境是浏览器还是模拟器。

```javascript
if (!navigator.notification) {
  V5.Model.proxy = location.origin + '/proxy';
}
```

## 有爱

本文所有示例代码来自于[FaWave 移动版](https://github.com/JacksonTian/fawave_mobile).

希望本文对你有用 ^_^