# [nodejs]Javascript模板引擎性能对比及几点优化

浏览器版可直接查看: [JavaScript template language shootoff](http://jsperf.com/dom-vs-innerhtml-based-templating/143)

## 运行性能测试

测试代码在：[js-template-benchmarks](https://github.com/fengmk2/fengmk2.github.com/tree/master/blog/2011/04/js-template-benchmarks)

```bash
$ node benchmarks.js
```

## 我的测试环境

```bash
CPU:     4核 Intel(R) Core(TM) i3 CPU M 330  @ 2.13GHz
Memory:  4GB
OS:      Ubuntu 10.10 2.6.35-28-generic-pae i686
```

## 我的测试结果

escape延后处理是需要性能代价的。但是这样可以减少业务复杂性。

### 场景1：No escape 

渲染10万次，最快的是doU, doT, nTenjin(基于tenjin的优化版本), jst_speed；最慢的是tenjin和jade
doT已经达到百万次级别了，好神速啊！
!!!新增[@shaunlee](https://github.com/shaunlee) 的中国第一速度模板引擎: [jst](https://github.com/shaunlee/node-jst), 
[@shaunlee](https://github.com/shaunlee)看见第一次测试结果后非常不满意，经过优化后，速度已经达到第一梯队了！

```bash
No escape, render 100000 times:

doT running...
use: 0.066 sec, rps: 1515151.5151515151
--------------------------------------------
doU running...
use: 0.064 sec, rps: 1562500
--------------------------------------------
nTenjin running...
use: 0.069 sec, rps: 1449275.3623188403
--------------------------------------------
jqtpl running...
use: 2.059 sec, rps: 48567.26566294317
--------------------------------------------
ejs running...
use: 1.514 sec, rps: 66050.19815059446
--------------------------------------------
haml running...
use: 9.532 sec, rps: 10490.97775912715
--------------------------------------------
jade running...
use: 10.592 sec, rps: 9441.087613293052
--------------------------------------------
jst running...
use: 2.089 sec, rps: 47869.79415988511
--------------------------------------------
jst_speed running...
use: 0.065 sec, rps: 1538461.5384615385
--------------------------------------------
```

### 场景2：All escape 

性能马上变成浮云了。
速度高低排名: jst(果然是第一速度), nTenjin, jqtpl, ejs, doT, doU, haml, jade
对比场景1，可看到doT和doU的escape性能非常差。

```bash
All escape, render 100000 times:

doT running...
use: 3.921 sec, rps: 25503.698036215254
--------------------------------------------
doU running...
use: 3.926 sec, rps: 25471.217524197655
--------------------------------------------
nTenjin running...
use: 1.306 sec, rps: 76569.67840735069
--------------------------------------------
jqtpl running...
use: 3.012 sec, rps: 33200.531208499335
--------------------------------------------
ejs running...
use: 3.539 sec, rps: 28256.569652444192
--------------------------------------------
haml running...
use: 11.098 sec, rps: 9010.632546404757
--------------------------------------------
jade running...
use: 12.676 sec, rps: 7888.9239507731145
--------------------------------------------
jst running...
use: 4.004 sec, rps: 24975.02497502498
--------------------------------------------
jst_speed running...
use: 1.167 sec, rps: 85689.8029134533
--------------------------------------------
```

## 从tenjin到nTenjin的几点性能优化方法

原文： https://github.com/QLeelulu/nTenjin/blob/master/README.md

* jsTenjin是使用eval来解析的，而nTenjin是使用 new Function 来解析的(速度差别之一)。
* jsTenjin是使用Array.push来构造字符串的，而nTenjin是使用 String += str 来构造字符串的(速度差别之二)。
* nTenjin中变量必须由it来指定，例如#{param}要修改为#{it.param},其他和jsTenjin完全一致。

## 模板引擎优化步骤

1. 使用new Function 解析;
2. 直接字符从相加 str += s;
3. 变量不切换上下文，直接it指定
4. 高性能的escape

