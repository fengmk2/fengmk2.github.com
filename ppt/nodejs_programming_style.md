# 我的 nodejs 编程规范

## 苏千@[Python发烧友](http://weibo.com/81715239)

2012-06-12 晚上 at Taobao

---

## 大纲

### 为什么要遵循编程规范
### 我的 nodejs 编程规范
### 之乎@者也

---

## 为什么要遵循编程规范

### 代码清晰易读

质量好的代码，通常都是有观赏性的。

### 减少出错

让代码能在眼睛里运行，无须猜测运行结果。

### 团队开发

参与团队开发或者给开源项目提交pull request之前，必须了解项目的编程规范。

### 代码艺术

`Coding` 也是一门 `艺术` ([link](http://kb.cnblogs.com/page/132089/))。

---

## 我的 nodejs 编程规范

---

## 缩进: `tab` => `2 space`

避免代码显示差异，入乡随俗，这是 `nodejs` 源码及 `module` 采用的标准。

必须让编辑器自动转换:

* [sublimetext](http://www.sublimetext.com/docs/2/indentation.html)
* [vim](http://stackoverflow.com/questions/426963/replace-tab-with-spaces-in-vim)
* [eclipse](http://ww3.sinaimg.cn/large/6cfc7910jw1dnf44jzellj.jpg)

---

## 空格！空格！空格！

* `function`关键词与`函数名`之间有`一个空格`
* 调用函数的时候，`函数名`与`左括号`之间`没有空格`

```
// right
function foo(bar) {...}
foo(bar);
foo(function callback(err, data) {...});
foo(function (err, data) {...});

// wrong
function foo (bar) {...}
foo (bar);
foo(function callback (err, data) {...});
foo(function(err, data) {...});
```

---

## 空格！空格！空格！

* 所有其他`语法元素`与`左括号`之间，都有`一个空格`

```
// right
return (a + b);
if (a === 0) {...}
for (var k in map) {...}
while (i > 0) {...}

// wrong
return(a + b);
if(a === 0) {...}
for(var k in map) {...}
while(i > 0) {...}
```

---

## 空格！空格！空格！

* `操作符`号与`参数`之前有`一个空格`
* 能提高阅读性的空格不能省略

```
// right
var a = 1 + 2;
for (var i = 0, l = items.length; i < l; i++) {...}

//wrong
var a=1+2;
for(var i=0,l=items.length;i<l;i++){...}
```

---

## 直观明了的变量与函数命名

好的变量与函数命名，可以避免大量的注释，以及让圈内的同学感到熟悉。

驼峰式:

* 函数和变量：`functionNamesLikeThis`, `variableNamesLikeThis`
* 类名和枚举类型：`ClassNamesLikeThis`, `EnumNamesLikeThis`
* 类方法：`methodNamesLikeThis`
* 常量：`SYMBOLIC_CONSTANTS_LIKE_THIS`

```
// var definition
var adminUser = db.query('SELECT * FROM users ...');

// function definition
function run() {...}

// Class definition
function BankAccount() {...}
```

---

## Only `===`

你能只看到代码，就能保证下面对比的结果吗？

```
0 == ''
1 == true
2 == true
0 == '0'
false == 'false'
false == '0'
" \t\r\n " == 0
```

---

## Only `===`

结果绝对是 `坑爹` 的：

```
> 0 == ''
true
> 1 == true
true
> 2 == true
false
> 0 == '0'
true
> false == 'false'
false
> false == '0'
true
> " \t\r\n " == 0
true
```

---

## 回调潜规则: `callback(err, data)`

在 nodejs 的代码里面，异步IO回调方法必须遵循的潜规则: `callback(err, data)`

```
var fs = require('fs');

fs.readFile(__dirname + '/foo.txt', 'utf8', function (err, data) {
  if (err) {
    return console.log(err);
  }
  console.log(data);
});
```

dns 域名查询ip: [dns_dns_lookup_domain_family_callback](http://nodejs.org/docs/latest/api/dns.html#dns_dns_lookup_domain_family_callback)

```
var dns = require('dns');

dns.lookup('taobao.com', function (err, address, family) {
  console.log(err, address, family);
});
```

---

## String is not `Error`

```javascript
function request(url, callback) {
  requestURLAsync(url, function () {
    // ...
    if (isTimeout) {
      return callback('Request `' + url '` timeout.');
    }
    callback(null, ...);
  });
}
```

将 `String` 当 `Error` 使用，会有什么问题呢？

---

## String is not `Error`

使用 `String` 会丢失了 `Error` 的上下文堆栈信息: [A String is not an Error](http://www.devthought.com/2011/12/22/a-string-is-not-an-error/)

正确的方式:

```javascript
function request(url, callback) {
  requestURLAsync(url, function () {
    // ...
    if (isTimeout) {
      var err = new Error('Request `' + url '` timeout.');
      err.name = 'RequestTimeout';
      return callback(err);
    }
    callback(null, ...);
  });
}
```

---

## 嵌套嵌套嵌套？开玩笑吧你？

demo场景: 复制文件 `foo.txt` 内容到 `bar.txt`

```
function copyfileNestedCallback(from, to, callback) {
  fs.stat(from, function (err, stats) {
    if (err) {
      return callback(err);
    }
    fs.readFile(from, function (err, content) {
      if (err) {
        return callback(err);
      }
      fs.writeFile(to, content, function (err) {
        if (err) {
          return callback(err);
        }
        return callback(null, content.length);
      });
    });  
  });
}
```

---

## 嵌套嵌套嵌套？开玩笑吧你？

`事件驱动` 方式: [EventEmitter](http://nodejs.org/docs/latest/api/events.html)

```
function copyfileEventEmitter(from, to, callback) {
  var ep = new EventEmitter();
  ep.on('stats', function (stats) {
    fs.readFile(from, function (err, content) {
      if (err) {
        return ep.emit('error', err);
      }
      ep.emit('content', content);
    });
  });
  ep.on('content', function (content) {
    fs.writeFile(to, content, function (err) {
      if (err) {
        return ep.emit('error', err);
      }
      return callback(null, content.length);
    });
  });
```

---

## 嵌套嵌套嵌套？开玩笑吧你？

```
  ep.once('error', function (err) {
    ep.removeAllListeners();
    callback(err);
  });
  fs.stat(from, function (err, stats) {
    if (err) {
      return ep.emit('error', err);
    }
    ep.emit('stats', stats);
  });
}
```

---

## 嵌套嵌套嵌套？开玩笑吧你？

更多解决方案: [Control flow / Async goodies](https://github.com/joyent/node/wiki/modules#wiki-async-flow)

* [eventproxy](https://github.com/JacksonTian/eventproxy)
* [jscex](http://github.com/JeffreyZhao/jscex)
* [async](https://github.com/caolan/async)

---

## 参考

* [EDP Node 编码规范](https://github.com/windyrobin/iFrame/blob/master/style.md)
* [Javascript编程风格](http://www.ruanyifeng.com/blog/2012/04/javascript_programming_style.html)
* [Google JavaScript代码风格指南](http://chajn.org/jsguide/javascriptguide.html)
* [Felix's Node.js Style Guide](http://nodeguide.com/style.html)
* [Programming Styles in the Node Community](http://dailyjs.com/2012/01/12/style/)
* [Writing Asynchronous Code](http://nodemanual.org/latest/nodejs_dev_guide/writing_asynchronous_code.html)

---

# QA === 知乎者也
