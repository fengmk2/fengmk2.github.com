# 自定义错误

## 从前

大部分情况，我们都是直接 `new Error('foo')` 来创建一个异常，然后为了有区分度，
通常会改变它的 `name`:

```js
const err = new Error('something wrong');
err.name = 'RequestError';

throw err;
```

会输出以下堆栈信息

```js
RequestError: something wrong
    at err1 (/Users/mk2/git/fengmk2.github.com/blog/2015/err.js:4:15)
    at Object.<anonymous> (/Users/mk2/git/fengmk2.github.com/blog/2015/err.js:10:1)
    at Module._compile (module.js:430:26)
    at Object.Module._extensions..js (module.js:448:10)
    at Module.load (module.js:355:32)
    at Function.Module._load (module.js:310:12)
    at Function.Module.runMain (module.js:471:10)
    at startup (node.js:117:18)
    at node.js:952:3
```
