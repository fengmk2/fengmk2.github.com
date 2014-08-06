# nodejs web开发入门: Simple-TODO Nodejs 实现版

## 起因

看到[simple todo的各种python版本实现](http://simple-is-better.com/news/tag/simple-todo), 我也来凑凑热闹...
既然已经有这么多python版本了, 我就对比实现了一个Simple-TODO的nodejs版本: [Node TODO](https://github.com/fengmk2/todo), 模版和樣式全部copy自web.py版本.

## Source Code && Demo

* 源代码: [https://github.com/fengmk2/todo](https://github.com/fengmk2/todo)
* 在线demo: [http://api.yongwo.de:3888](http://api.yongwo.de:3888/)

![http://ww3.sinaimg.cn/large/6cfc7910jw1diwdadumcwj.jpg](http://ww3.sinaimg.cn/large/6cfc7910jw1diwdadumcwj.jpg)

## 代码目录

目录还是很清晰的, public存放静态文件, views存放模版, controllers处理业务逻辑, 
还有配置config.js, web主入口server.js

![代码目录](http://ww1.sinaimg.cn/large/6cfc7910jw1dix4wp92nmj.jpg)

## 使用到的第三方nodejs模块

* [express](http://expressjs.com/): Web框架, 目前nodejs使用最广泛的web框架
* [ejs](https://github.com/visionmedia/ejs): 模版渲染引擎, 用于生成动态内容
* [node-mysql](https://github.com/felixge/node-mysql): 纯javascript实现的mysql驱动, 无法安装任何mysql包依赖.

这3个模块都可以直接通过[npm](http://npmjs.org/)安装获得:

    $ npm install express ejs mysql
    
## 开发过程记录 ##

### [config.js](https://github.com/fengmk2/todo/blob/master/config.js) ###

可配置的信息:
* 网站名称
* 监听端口号, 默认8080
* 数据库配置信息

### 如何访问数据库 ###

在[config.js](https://github.com/fengmk2/todo/blob/master/config.js)文件里面, 会使用一下方式保持着数据库的链接对象

    var db = exports.db = new require('mysql').Client(db_options);
    db.connect(function(err) {
        if(err) {
            console.error('connect db ' + db.host + ' error: ' + err);
            process.exit();
        }
    });
    
这样我们就可以在别的地方直接使用db对象了

### [server.js](https://github.com/fengmk2/todo/blob/master/server.js) ###

express可以帮我们默认实现了静态文件处理, cookie处理, 请求参数处理等事情, 只需要配置一下, 就可以使用上这些功能了.

    var app = express.createServer();
    app.use(express.static(__dirname + '/public', {maxAge: 3600000 * 24 * 30}));
    app.use(express.cookieParser());
    app.use(express.bodyParser());
    
同样, 需要配置模版渲染引擎为ejs

    app.set("view engine", "html");
    app.set("views", __dirname + '/views');
    app.register("html", ejs);
    
看看views/index.html里面的一个最复杂的模版例子, 
ejs最让我喜欢的是不用再学一套语法, 直接是内嵌js, 还是很容易读懂的

![http://ww1.sinaimg.cn/large/6cfc7910jw1dix6f9kailj.jpg](http://ww1.sinaimg.cn/large/6cfc7910jw1dix6f9kailj.jpg)

### URL Routing与Controllers ###

一个http请求过来, 由那个controller处理, express提供了简便的routing方式

    app.get('/', todo.index);
    app.post('/todo/new', todo.new);
    app.get('/todo/:id', todo.view);
    app.get('/todo/:id/edit', todo.edit);
    app.post('/todo/:id/edit', todo.save);
    app.get('/todo/:id/delete', todo.delete);
    app.get('/todo/:id/finish', todo.finish);
    
如添加一条todo记录: HTTP GET /new, 将由[todo.new](https://github.com/fengmk2/todo/blob/master/controllers/todo.js)方法处理,
代码逻辑包括了title参数有效性验证, 数据保存到数据库, http redirect:

    exports.new = function(req, res, next) {
        var title = req.body.title || '';
        title = title.trim();
        if(!title) {
            return res.render('error', {message: '标题是必须的'});
        }
        db.query('insert into todo set title=?, post_date=now()', [title], function(err, result) {
            if(err) return next(err);
            res.redirect('/');
        });
    };

更多的controller处理逻辑请查看[/controllers/todo.js](https://github.com/fengmk2/todo/blob/master/controllers/todo.js).

### 数据库初始化及启动Web进程 ###

    $ mysql xxx
    $ source ~/todo/todo.sql
    $ node server.js

### 有爱 ###

可以看到, 无论是python的web开发, 还是nodejs, 我们以前对web的概念还是无需改变的.
都是我们熟悉的一些关键词: 
http, request, response, html, template engine, url routing, MVC, GET, POST, MYSQL, Database...

不同的是, 这里只使用javascript就可以驱动着以上的一切.

希望本文对你有用 ^_^