# Node.js 处理 GBK 编码模板

## 字符串基本原则

如果你需要对非 UTF8 编码的文本进行处理，如 GBK 编码的，那么我们只有遵循以下原则处理就ok：

```js
fs.readFile(filepath, cb)
  => GBK encoding Buffer
    => iconv decode gbk
      => utf8 js String
        => 处理String
          => iconv encode gbk
            => GBK encoding Buffer
              => send to client
```

如果你只需要将 GBK 编码的文本直接输出，那么就不需要转换，直接将 GBK 编码的 Buffer 输出即可.

```
res.send(gbkBuffer);
```

## 示例

将 GBK 模板文件进行简单处理，能按 UTF8 和 GBK 两种编码选择输出.

@see [app.js](https://github.com/fengmk2/fengmk2.github.com/tree/master/blog/2014/iconv-lite/app.js)

```js
var connect = require('connect');
var fs = require('fs');
var path = require('path');
var iconv = require('iconv-lite');

var app = connect();

var filepath = path.join(__dirname, 'index.html');
var content = fs.readFileSync(filepath);

app.use(function (req, res) {
  var s = iconv.decode(content, 'gbk');
  if (req.url === '/utf8') {
    res.setHeader('Content-Type', 'text/html; charset=utf8');
    s = s.replace('<title>淘宝网 - 淘！我喜欢</title>', '<title>淘宝网 - 淘！我喜欢 UTF8</title>')
      .replace('<meta charset="gbk">', '<meta charset="utf8">')
      .replace('你好啊', '你好啊 UTF8');
    // show utf8 page
    return res.end(s);
  }

  // show gbk page
  res.setHeader('Content-Type', 'text/html; charset=gbk');
  s = s.replace('<title>淘宝网 - 淘！我喜欢</title>', '<title>淘宝网 - 淘！我喜欢 GBK</title>')
      .replace('你好啊', '你好啊 GBK');
  res.end(iconv.encode(s, 'gbk'));
});

app.listen(1984);
```

## 有爱

希望本文对你有用.

http://fengmk2.github.io/blog/2014/iconv-lite/iconv-lite.html
