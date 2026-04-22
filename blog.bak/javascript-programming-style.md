# Javascript Programming Style

## 为什么要有编程风格

好的编程风格有助于写出`质量更高`, `错误更少`, `更易于维护`的程序.

好的编程风格是一种能够清晰表达你的意图的风格。

## 规则

### 规则1

表示区块起首的大括号，不要另起一行。

Wrong:

```
block
{
  ...
}
```

Right:

```
block {
  ...
}
```

### 规则2

调用函数的时候，函数名与左括号之间没有空格。

Wrong:

```
foo (bar);
```

Right:

```
foo(bar);
```

### 规则3

函数名与参数序列之间，没有空格。

Wrong:

```
function foo (b) { ... }
```

Right:

```
function foo(b) { ... }
```

### 规则4

所有其他语法元素与左括号之间，都有一个空格。

Wrong:

```
return(a+b);

if(a === 0) { ... }

function(x) { ... }
```

Right:

```
return (a+b);

if (a === 0) { ... }

function (x) {...}
```

### 规则5

不要省略句末的分号。

Wrong:

```
var a = 1
```

Right:

```
var a = 1;
```

### 规则6

不要使用`with`语句。

### 规则7

不要使用"相等"（==）运算符，只使用"严格相等"（===）运算符。

Wrong:

```
if (a == 0) { ... }
```

Right:

```
if (a === 0) { ... }
```

### 规则8

不要将不同目的的语句，合并成一行。

Wrong:

```
if (a = b) { ... }

var a = b = 0;
```

Right:

```
a = b;
if (a) { ... }

var a = 0, b = 0;
```

### 规则9

所有变量声明都放在函数的头部。

Wrong:

```
if (!o) {
  var o = {};
}
```

Right:

```
var o;
...

if (!o) {
  o = {};
}
```

Wrong:

```
for (var i ...) { ... }
```

Right:

```
var i;
for (i ...) { ... }
```

### 规则10

所有函数都在使用之前定义。

Wrong:

```
function foo(bar) {
  if (bar) {
    var a = 100;
    ...
  }
  ...
}
```

Right:

```
function foo(bar) {
  var a;
  if (bar) {
    a = 100;
    ...
  }
  ...
}
```

### 规则11

避免使用全局变量；如果不得不使用，用大写字母表示变量名，比如UPPER_CASE。

### 规则12

不要使用new命令，改用[`Object.create()`](https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Object/create)命令。

### 规则13

建构函数的函数名，采用首字母大写（InitialCap）；其他函数名，一律首字母小写。

### 规则14

不要使用自增（++）和自减（--）运算符，用+=和-=代替。

### 规则15

总是使用大括号表示区块。

Wrong:

```
if (a) foo();
```

Right:

```
if (a) { foo(); }
```

## 参考

* [Javascript编程规范](http://www.ruanyifeng.com/blog/2012/04/javascript_programming_style.html)
* [Object.create()](https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Object/create)