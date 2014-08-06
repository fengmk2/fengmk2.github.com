# Javascript绝句性能

前几天在微博中看到一篇叫[Javascript绝句欣赏](http://site.douban.com/widget/notes/22456/note/142716442/) 的奇文。
里面很多绝句实现了我经常用到的功能需求。对比我自己之前的实现方式，我简直觉得自己搓死了。

## 疑惑

虽然绝句很短很好，但是正因为它很绝，比较难以理解。所以我想给自己一个理由，为什么要去使用这些绝句。
很想当然地我想到性能可能会有所提高，因为实现代码量很少而且又减少了函数调用，某些绝句的性能应该会比较高的。

## 性能对比

### 取整同时转成数值型

绝句实现： `|0 ^0 >>0 ~~`
```
'10.567890'|0
'10.567890'^0
~~'10.567890'
```
结果: 10
```
-2.23456789|0
-2.23456789^0
~~-2.23456789
```
结果: -2

大于等于 `0x80000000` 会出现bug
```
-2147483648|0 
```

普通实现：
```
function integer(n) {
  return n >=0 ? Math.floor(n) : Math.ceil(n);
}
```

```
var count = 5000000;
var start = new Date();
var s = 0;
for (var i = 0; i < count; i++) {
  s = '10.567890'|0;
}
console.log('|0 => %d', new Date() - start);

var start = new Date();
var s = 0;
for (var i = 0; i < count; i++) {
  s = '10.567890'^0;
}
console.log('^0 => %d', new Date() - start);

var start = new Date();
var s = 0;
for (var i = 0; i < count; i++) {
  s = '10.567890'>>0;
}
console.log('>>0 => %d', new Date() - start);

var start = new Date();
var s = 0;
for (var i = 0; i < count; i++) {
  s = ~~'10.567890';
}
console.log('~~ => %d', new Date() - start);

var start = new Date();
var s = 0;
for (var i = 0; i < count; i++) {
  s = integer('10.567890');
}
console.log('integer => %d', new Date() - start);

var start = new Date();
var s = 0;
var n = '10.567890';
for (var i = 0; i < count; i++) {
  s = n >=0 ? Math.floor(n) : Math.ceil(n);
}
console.log('inline => %d', new Date() - start);
console.log('');

```

### 取数组中的最大最小值

Array.max = function( array ){
    return Math.max.apply( Math, array );
};
Array.min = function( array ){
    return Math.min.apply( Math, array );
};