# [co](https://npm.taobao.org/package/co) 常见使用场景

### 定时器 Timers

使用 [co-defer](https://github.com/cojs/defer)

```js
var defer = require('co-defer')

defer.setImmediate(function* () {
  console.log('setImmediate');
});

defer.nextTick(function* () {
  console.log('nextTick');
});

var timer1 = defer.setInterval(function* () {
  console.log('setTimeout 100ms');
  clearTimeout(timer1);
}, 100);

var timer2 = defer.setInterval(function* () {
  console.log('setInterval 100ms');
  clearInterval(timer2);
}, 100);
```

## 并发

### 数组形式

```js
co(function* () {
  var rs = yield [
    get(1),
    get(2),
    get(3),
    get(4),
  ];
  console.log(rs);
  // [1, 2, 3, 4]
})();
```

### 键值对形式

```js
co(function* () {
  var data = yield {
    name: getName(),
    age: getAge()
  };
  console.log(data);
  // { name: 'fengmk2', age: 18 }
})();
```

### 限制最大并发数

co 默认没有并发数限制, 可以通过 [co-parallel](https://github.com/visionmedia/co-parallel) 来限制并发数

```js
var parallel = require('co-parallel');
var request = require('co-request');
var co = require('co');

var urls = [
  'http://google.com',
  'http://yahoo.com',
  'http://ign.com',
  'http://cloudup.com',
  'http://myspace.com',
  'http://facebook.com',
  'http://segment.io'
];

function* status(url) {
  console.log('GET %s', url);
  return (yield request(url)).statusCode;
}

co(function* () {
  var reqs = urls.map(status);
  var res = yield parallel(reqs, 2);
  console.log(res);
})();
```

### 并发请求容错处理

[co-gather](https://npm.taobao.org/package/co-gather) 并发多个请求, 即使其中有一些请求错误了, 也能容错返回

```js
var gather = require('co-gather');
var wait = require('co-wait');
var co = require('co');

var index = 0;
function* random(val) {
  var i = index++;
  yield wait(Math.random() * 100);
  if (Math.random() > 0.5) {
    throw new Error('error');
  }
  return {index: i, value: val};
}

co(function* () {
  var ret = yield gather([
    random(1),
    random(2),
    random(3),
    random(4),
    random(5)
  ]);
  console.log(ret);
})();
```

=>

```js
[
  { isError: false, value: {index: 0, value: 1} },
  { isError: true, error: [Error: error] },
  { isError: true, error: [Error: error] },
  { isError: true, error: [Error: error] },
  { isError: false, value: {index: 4, value: 5} }
]
```

默认并发数为 `concurrency = 5`, 可以自行设置并发数 `gather(thunks, [concurrency])`

## 事件 EventEmitter

### 事件监听者支持 `GeneratorFunction`

使用 [co-event-wrap](https://npm.taobao.org/package/co-event-wrap)

```js
var co = require('co');
var http = require('http');
var eventWrap = require('co-event-wrap');
var fs = require('co-fs');

co(function* () {
  var req = http.get('http://cnodejs.org');
  eventWrap(req);
  req.on('response', function* (res) {
    res = eventWrap(res);
    var datas = [];
    res.on('data', function* (data) {
      datas.push(data);
    });
    res.on('end', function* () {
      var body = Buffer.concat(datas);
      yield fs.writeFile(__dirname + '/cnodejs.html', body);
      console.log('got %d bytes, headers: %j', body.length, res.headers);
    });
  });
})();
```

### 通过 while 方式处理事件

[co-event](https://npm.taobao.org/package/co-event) 帮你实现

```js
var event = require('co-event');

var e;
while (e = yield event(emitter)) {
  switch (e.type) {
    case 'end':
      break;

    case 'close':
      break;

    case 'error':
      break;
  }
}
```

emitter 原来的事件依旧会触发, 但是 `error` 事件不会被触发, 否则抛错无法被处理.

理解上面代码, 你必须以纯同步的思维来理解.
