# 让 ejs 更加快 | Let ejs faster with `options._with = false`

今天看 [ejs](https://github.com/visionmedia/ejs) 源代码的时候，发现 `with` 是可以设置为 `false` 的。
根据 [从tenjin到nTenjin的几点性能优化方法](https://github.com/QLeelulu/nTenjin#change-from-jstenjin) 的优化经验，
不使用 `with` 会有很大的性能提高。

## ejs 普通版使用方式

默认地，ejs 都会开启 `with` 模式:

```js
var TPL_WITH_TRUE = '\
<% if (user) { %>\
  <h2>with_true: <%= user.name %></h2>\
<% } %>';

var render = ejs.compile(TPL_WITH_TRUE);
var s = render({user: {name: 'fengmk2'}});
console.log('_with: true', s);
```

## `options._with = false` 强制关闭 `with` 模式

```js
var TPL_WITH_FALSE = '\
<% if (locals.user) { %>\
  <h2>with_false: <%= locals.user.name %></h2>\
<% } %>';

var render = ejs.compile(TPL_WITH_FALSE, {_with: false});
var s = render({user: {name: 'fengmk2'}});
console.log('_with: false', s);
```

## 对比 ejs 生成的两个模板方法

* 开启 `with`

```js
try {
var buf = [];
with (locals || {}) { (function(){ 
 buf.push('');__stack.lineno=1; if (user) { ; buf.push('  <h2>with_true: ', escape((__stack.lineno=1,  user.name )), '</h2>');__stack.lineno=1; } ; buf.push(''); })();
} 
return buf.join('');
} catch (err) {
  rethrow(err, __stack.input, __stack.filename, __stack.lineno);
}
```

* 关闭 `with`

```js
try {
var buf = [];
 buf.push('');__stack.lineno=1; if (locals.user) { ; buf.push('  <h2>with_false: ', escape((__stack.lineno=1,  locals.user.name )), '</h2>');__stack.lineno=1; } ; buf.push('');
return buf.join('');
} catch (err) {
  rethrow(err, __stack.input, __stack.filename, __stack.lineno);
}
```

## Benchmark 性能测试

通过 [options_with.js](https://github.com/fengmk2/fengmk2.github.com/tree/master/benchmark/ejs/options_with.js) 的测试结果可以看到，
不使用 `with` 差不多有 **4X** 的性能提高。

使用 `{_with: false}` 性能就提高了！就这么简单！

```bash
$ node options_with.js

_with: false   <h2>with_false: fengmk2</h2>
_with: true   <h2>with_true: fengmk2</h2>
options._with = false x 821,470 ops/sec ±3.55% (85 runs sampled)
options._with = true x 268,084 ops/sec ±7.05% (87 runs sampled)
Fastest is options._with = false
```

## 有爱

^_^ 希望本文对你有用。
