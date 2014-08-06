# Defense hash algorithm collision 防御hash算法冲突导致拒绝服务器

## 问题

一篇[#2011-003 multiple implementations denial-of-service via hash algorithm collision](http://www.ocert.org/advisories/ocert-2011-003.html) 文章，引起了 Web 应用安全领域的骚动。

这种hash算法冲突的原理到底是什么？可以看看一下两篇以PHP为例子的说明文章：

* [PHP数组的Hash冲突实例 ](http://www.laruence.com/2011/12/30/2435.html), [Supercolliding a PHP array](http://nikic.github.com/2011/12/28/Supercolliding-a-PHP-array.html)
* [关于最近PHP的Array爆出的冲突问题](http://www.xingdonghai.cn/a-new-supercolliding-with-array-of-php)
* [Hash Collision DoS 问题](http://coolshell.cn/articles/6424.html)
* [Application vulnerability due to Non Random Hash Functions](http://stackoverflow.com/questions/8669946/application-vulnerability-due-to-non-random-hash-functions)

## 解决办法

既然是语言层面的hash算法冲突导致的，那么这种冲突就无法避免了。
但是我们可以限制Hash key的数量来避免。

所以可以进行一下设置解决此问题：

* 限制请求大小 (只能指标不治本，因为PHP版本的话，700KB的数据就足以发起攻击)
* 限制请求key的数量 (这可以基本解决问题，除非应用无法预知最大的key数量)
* 只接受允许的key (这是终极方法，但需要保证开发记得配置新增的key)

## 在Nodejs防御此问题

<strike>虽然在目前为止还没看到对Nodejs造成攻击的具体方法，但是还是以防范于未然为原则，需要对此问题做好充分的防御措施。</strike>

**Nodejs 的攻击方法已经出现**，具体测试结果可以查看 [Hash algorithm collision in Nodejs](http://fengmk2.github.com/mk2blog/blog/2011/hac-in-nodejs-results.html)
![hac-results](http://ww1.sinaimg.cn/large/6cfc7910jw1doryp1riixj.jpg)

由于我个人一直使用的是 [connect](https://github.com/senchalabs/connect) ，所以我以 connect 为示例说明吧 ^_^

### 使用 connect.limit 限制 request-body-size

[Issue #446](https://github.com/senchalabs/connect/issues/446) 已有同学提出此问题了，@TJ回复如下:

> we have limit() for this, which works for any request body. Even without this specific issue you could exhaust resources reasonably easily without some form of limiting

好吧，直接上 [connect.limit](https://github.com/senchalabs/connect/blob/master/lib/middleware/limit.js#L8) 模块解决

```
connect()
  .use(connect.limit('1mb'))
  .use(handleRequest)
```

### 修改 [qs](https://github.com/visionmedia/node-querystring) 模块，让其支持 keys-limit 和 allow-keys

[querystring.js](https://github.com/fengmk2/node-querystring/blob/master/lib/querystring.js#L106)

PS: 提了pull request，但是估计在没有真实攻击示例放出来之前，是不会被接受的。

```
/**
 * Parse the given str.
 */

function parseString(str, options) {
  var limit = options && options.limit;
  var keys = options && options.keys;
  if (keys && Array.isArray(keys)) {
    keys = {};
    for (var i = 0, l = options.keys.length; i < l; i++) {
      keys[options.keys[i]] = 1;
    }
  }
  return String(str)
    .split('&', limit)
    .reduce(function(ret, pair){
      try{
        pair = decodeURIComponent(pair.replace(/\+/g, ' '));
      } catch(e) {
        // ignore
      }

      var eql = pair.indexOf('=')
        , brace = lastBraceInKey(pair)
        , key = pair.substr(0, brace || eql);
      if (keys && !keys[key]) {
        return ret;
      }
      var val = pair.substr(brace || eql, pair.length)
      val = val.substr(val.indexOf('=') + 1, val.length);

      // ?foo
      if ('' == key) key = pair, val = '';

      return merge(ret, key, val);
    }, { base: {} }).base;
}


/**
 * Parse the given query `str` or `obj`, returning an object.
 *
 * Options: (only effect on parse string)
 *
 *  - `limit` parse string split limit.
 *  - `keys`  which keys need to be parse.
 *
 * @param {String} str | {Object} obj
 * @param {Object} options
 * @return {Object}
 * @api public
 */

exports.parse = function(str, options) {
  if (null == str || '' == str) return {};
  return 'object' == typeof str
    ? parseObject(str)
    : parseString(str, options);
};
```


还需要让 [connect.query](https://github.com/fengmk2/connect/blob/master/lib/middleware/query.js#L38) 模块 传递options参数给 `qs.parse()`

```
module.exports = function query(options){
  return function query(req, res, next){
    req.query = ~req.url.indexOf('?')
      ? qs.parse(parse(req.url).query, options)
      : {};
    next();
  };
};
```

同样 [connect.urlencoded](https://github.com/fengmk2/connect/blob/master/lib/middleware/urlencoded.js#L47) 模块也需要将options参数传递给 `qs.parse()`

```
    req.on('end', function(){
      try {
        req.body = buf.length
          ? qs.parse(buf, options)
          : {};
        next();
      } catch (err){
        next(err);
      }
    });
```

### 全部组合起来

```
var qsOptions = { limit: 100 };
connect()
  .use(connect.limit('1mb'))
  .use(connect.query(qsOptions))
  .use(connect.bodyParser(qsOptions))
  .use(handleRequest)
```

## 防范 http header 攻击

请求的 `http header` 也会导致hash冲突，在`V8`层面未修复hash算法之前，可以通过简单的 `http_patch.js` 修复此问题:

```
var http = require('http');

var IncomingMessage = http.IncomingMessage;
var _addHeaderLine = IncomingMessage.prototype._addHeaderLine;

// limit http header number
IncomingMessage.prototype._addHeaderLine = function(field, val) {
  if (!this.__headerCount__) {
    this.__headerCount__ = 0;
  } else if (this.__headerCount__ >= 100) {
    return;
  }
  _addHeaderLine.apply(this, arguments);
  this.__headerCount__++;
};
```

## 最后

2011年末，苦逼的程序员还在为这个安全漏洞写补丁，打补丁，想各种解决方法。
2012年或许还会有各种各样的问题，我们一起勇敢面对吧。
Happy New Year!
