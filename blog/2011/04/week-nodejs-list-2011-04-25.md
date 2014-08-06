# nodejs一周动态(2011-04-25 - 05-01)

本文收集一周来业界关于nodejs的相关动态信息和新闻摘要，并会推荐一下非常棒的node.js模块。

## [Mozilla jumps into Node.js server project](http://www.zdnetasia.com/mozilla-jumps-into-node-js-server-project-62208463.htm)

Mozilla也对Node.js感兴趣了，已经着手为Node.js提供V8以外的另一个引擎: 
[SpiderNode](http://blog.zpao.com/post/4620873765/about-that-hybrid-v8monkey-engine): This JavaScript engine in Firefox is called SpiderMonkey, and the hybrid technology used in SpiderNode is called V8Monkey

Node.js is built with the V8 JavaScript engine from Google's Chrome browser, but Mozilla is transplanting Firefox's JavaScript technology in a project called SpiderNode. (The JavaScript engine in Firefox is called SpiderMonkey, and the hybrid technology used in SpiderNode is called V8Monkey.)

## [Build Desktop Apps with Node.js Using WebApp](http://www.readwriteweb.com/hack/2011/04/build-desktop-apps-with-nodejs.php)

Node.js contributor Tim Caswell pushed an initial release of WebApp, a framework for building desktop GUI apps with Node.js, to GitHub. The stated goal is to "Give node developers a way to have a desktop GUI to their node servers using HTML5 + CSS3 as the GUI platform."
Node.js也可以开发桌面程序！

## [Node v0.4.7 release](http://blog.nodejs.org/2011/04/23/node-v0-4-7/)

* Don't emit error on ECONNRESET from read() #670 
* Fix: Multiple pipes to the same stream were broken #929 (Felix Geisendörfer) 
* URL parsing/formatting corrections #954 (isaacs) 
* make it possible to do repl.start('', stream) (Wade Simmons) 
* Add os.loadavg for SunOS (Robert Mustacchi) 
* Fix timeouts with floating point numbers #897 
* Improve docs. 

Download: http://nodejs.org/dist/node-v0.4.7.tar.gz 
Website: http://nodejs.org/docs/v0.4.7/ 
Documentation: http://nodejs.org/docs/v0.4.7/api 

## Cluster Live

TJ Holowaychuk released [Cluster Live](http://tjholowaychuk.com/post/4712080732/cluster-live-0-0-1) (GitHub: [visionmedia / cluster-live](https://github.com/visionmedia/cluster-live), MIT License), which is a realtime administration and statistics plugin for Cluster. If you’ve been holding off on Cluster, this is probably the sort of usage TJ envisioned for it and may convince you to use it.

你只需要一点点配置代码，就可以使用了，很cool吧！:

    var live = require('cluster-live');

    cluster(server)
      .set('workers', 6)
      .use(cluster.debug())
      .use(cluster.stats({ connections: true, lightRequests: true }))
      .use(live())
      .listen(3000);

截图     
<img src="https://d3nwyuy0nl342s.cloudfront.net/img/5dc84aecefb12aa6a2410137e8e48b2ec5241c50/687474703a2f2f662e636c2e6c792f6974656d732f3045306530513161336a317233723335334731592f53637265656e73686f742e706e67" width="90%" height="300" />

## Capsule

[Capsule](https://github.com/andyet/capsule) (MIT License) by Henrik Joreteg is a Node framework that uses Socket.io and Backbone.js to synchronise models between the client and server. He’s written some documentation for [Capsule.models.js](http://andyet.github.com/Capsule/docs/capsule.models.html) and [Capsule.views.js](http://andyet.github.com/Capsule/docs/capsule.views.html), and the README includes a detailed example of how to set things up for the server and browser.

## [node-http-proxy](https://github.com/nodejitsu/node-http-proxy)

[node-http-proxy](https://github.com/nodejitsu/node-http-proxy): 
一个基于nodejs全功能http代理
A full-featured http proxy for node.js

### Features

* Reverse proxies incoming http.ServerRequest streams
* Can be used as a CommonJS module in node.js
* Uses event buffering to support application latency in proxied requests
* Reverse or Forward Proxy based on simple JSON-based configuration
* Supports WebSockets
* Supports HTTPS
* Minimal request overhead and latency
* Full suite of functional tests
* Battled-hardened through production usage @ nodejitsu.com
* Written entirely in Javascript
* Easy to use API

### When to use node-http-proxy

Let's suppose you were running multiple http application servers, but you only wanted to expose one machine to the internet. You could setup node-http-proxy on that one machine and then reverse-proxy the incoming http requests to locally running services which were not exposed to the outside network.

## npm 1.0: Released

[npm 1.0 has been released](http://blog.nodejs.org/2011/05/01/npm-1-0-released/). Here are the highlights:

* Global vs local installation
* ls displays a tree, instead of being a remote search
* No more “activation” concept – dependencies are nested
* Updates to link command
* Install script cleans up any 0.x cruft it finds. (That is, it removes old packages, so that they can be installed properly.)
* Simplified “search” command. One line per package, rather than one line per version.
* Renovated “completion” approach
* More help topics
* Simplified folder structure