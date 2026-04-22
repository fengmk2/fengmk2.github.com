# 如何在express使用doT模板引擎

本文假设你已经使用过doT和[express](http://expressjs.com)，并知道它的模板语法。

js的模板引擎实在太多了，幸好 [JavaScript template language shootoff](http://jsperf.com/dom-vs-innerhtml-based-templating/143) 这篇不断被更新的文章，帮我们用真实的测试结果，得到了目前最快的模板引擎[doT](https://github.com/olado/doT)

## 安装dot

    $ sudo npm install dot
    
## 让express使用dot

安装express的模板引擎约定，引擎必须有一个compile方法，接受str和options参数，返回一个function对象即可，接口大致如下：

    exports.compile = function(str, options) {
        // compile template str
        // return function
    }

显然，只需要实现compile接口即可

    // dot.express.js
    var dot = require('dot');
    
    exports.compile = function(str, options) {
        return dot.template(str);
    };

在express使用dot.express.js

    var dot_express = require('dot.express');
    
    app.set("view engine", "html");
    app.register(".html", dot_express);
    
    // render
    app.get('/', function(req, res, next) {
        res.render('index', {world: 'world'});
    });
    
## 更简约的方式

    var dot = require('dot');
    
    app.set("view engine", "html");
    app.register(".html", {
        compile: function(str) {
            return dot.template(str);
        }
    });

## 让你的html模板文件也通过智能提示校验

dot默认的定界符是 {{ 和 }}，这样模板文件会如下

    // index.html
    <p>hello {{! word }}</p>

这样，肯定不能通过HTML智能提示校验
参考[tenjin](http://www.kuwata-lab.com/tenjin/)的做法，将定界符修改为能通过智能提示校验的即可

    // index.js
    dot.templateSettings.begin = '<?js';
    dot.templateSettings.end = '?>';
    
    // index.html
    <p>hello <?js! word ?></p>

<script src="https://gist.github.com/944470.js"> </script>

## 'view cache' MUST enabled!

线上环境必须开启'view cache'，因为express的view会使用fs.statSync检测模板是否存在，如果不开启缓存，则每次都会同步检测和加载模板，整个web的性能就完蛋了。

    app.set('view cache', true);

## 有爱

希望本文对你有用 ^_^
