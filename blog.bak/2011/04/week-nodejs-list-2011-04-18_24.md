title: nodejs本周动态(2011-04-18/24)

## Node on iOS

Nathan Rajlich写了篇在iOS上运行Node的文章: [NodeJS on iOS](https://tootallnate.net/nodejs-on-ios). 
他建立了一个项目 [node-iOS](https://github.com/TooTallNate/node-iOS)，为了让iOS原生支持Node. 
你的手机必须先越狱。

## Native Windows Support on v0.6.0

让更多windows开发者加入Nodejs，原生支持node是必须的！

详细请看PPT: [http://nodejs.org/codeconf.pdf](http://nodejs.org/codeconf.pdf)

## Nedis

[Nedis](https://github.com/visionmedia/nedis) (MIT License, npm: nedis) by TJ Holowaychuk is a Redis server implemented with Node. 
TJ has posted some benchmarks of it:

    SET
    nedis: ops 25048, per second 5009.6
    redis: ops 54850, per second 10970

    GET
    nedis: ops 32729, per second 6545.8
    redis: ops 54714, per second 10942.8

作者初衷是为了好玩而写了这个模块 ^_^: 

He’s written a blog post with more details: [Redis Implemented With Node](http://tjholowaychuk.com/post/4595959353/redis-implemented-with-node) and mentions the background of the project:

[…] however as our team grows larger, and as we add more non-technical team members over at LearnBoost I figured it would be nice help prevent the need for compiling development dependencies.

	
## Will the Rise of Javascript Mean the End of LAMP?

 * 原文: [Will the Rise of Javascript Mean the End of LAMP?](http://www.infoq.com/news/2011/04/javascript-lamp)
 * 中文: [Javascript的兴起是否意味着LAMP的终结？](http://www.infoq.com/cn/news/2011/04/javascript-lamp)
 * 引起争论的文章: [NODE.JS AND THE JAVASCRIPT AGE](http://metamarketsgroup.com/blog/node-js-and-the-javascript-age/)

## 虚拟研讨会：Node.js生态系统之框架、库、最佳实践

 * 原文: [Virtual Panel: The Node.js Ecosystem - Frameworks, Libraries and Best Practices](http://www.infoq.com/articles/nodejs-frameworks)
 * 中文: [虚拟研讨会：Node.js生态系统之框架、库、最佳实践](http://www.infoq.com/cn/articles/nodejs-frameworks)
 * [StackVM](http://stackvm.com/) 也大量使用了Nodejs: Peteris和James（StackVM）：[StackVM](http://github.com/pkrumins/stackvm/)本身，它使用了我们为Node.js编写的几个其他模块

## Javascript 模板引擎性能比较

根据[JavaScript template language shootoff](http://jsperf.com/dom-vs-innerhtml-based-templating/128)的测试结果：

 * 最慢：[Mustache.js](https://github.com/janl/mustache.js)
 * 最快: [doT.js](https://github.com/olado/doT) 和 [doU.js](https://github.com/olado/doT)

## ORM on Node

 * [Node-ORM](https://github.com/dresende/node-orm) is a NodeJS module for multiple databases using Object-Relational Mapping.
 * [Mongoose](http://mongoosejs.com/) is a MongoDB object modeling tool designed to work in an asychronous environment.
 * [Nohm](https://github.com/maritz/nohm) is an object relational mapper (ORM) written for node.js and redis.
 * [couch-ar](https://github.com/scottburch/couch-ar) is a thin active record implementation for couchDB
 
## SPDY Server on node.js
![spdy](https://github.com/fengmk2/mk2blog/raw/master/2011/4/spdy.png)

最近google的[SPDY](https://sites.google.com/a/chromium.org/dev/spdy/spdy-whitepaper)话题也很火的，果然，在nodejs已经有人实现了一个模块

SPDY Server on node.js: https://github.com/donnerjack13589/node-spdy

## The JavaScript Disruption

[The JavaScript Disruption](http://www.richardrodger.com/2011/04/05/the-javascript-disruption/): The mainstream programming language for the next ten years will be JavaScript. Once considered a toy language useful only for checking form fields on web pages, JavaScript will come to dominate software development. Why this language and why now?
