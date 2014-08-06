# MK2 in Github

## Who is MK2

![mk2 photo](https://secure.gravatar.com/avatar/95b9d41231617a05ced5604d242c9670?s=200)
<iframe src="http://githubbadge.appspot.com/fengmk2?s=1" style="border: 0;height: 142px;width: 200px;overflow: hidden;" frameBorder="0"></iframe>

* Github: [@fengmk2](https://github.com/fengmk2)
* Weibo: [@Python发烧友](http://weibo.com/imk2)
* Twitter: [@fengmk2](http://twitter.com/fengmk2)
* cnblogs: [让生活Web个够](http://fengmk2.cnblogs.com/)
* CNode: [@suqian](http://cnodejs.org/user/suqian)
* cnpm: [China npm mirror](http://cnpmjs.org)

## My open source projects

### Libraries

#### http & https

* [response-patch](https://github.com/fengmk2/response-patch): monkey patch for `http.ServerResponse`.
* [agentkeepalive](https://github.com/TBEDP/agentkeepalive): The nodejs's missing keep alive http.Agent. Support http and https.
* [urllib](https://github.com/TBEDP/urllib): Help in opening URLs (mostly HTTP) in a complex world — basic and digest authentication, redirections, cookies and more. Like python's _urllib_ module.
* ~~[httpsync](https://github.com/fengmk2/node-curl): `httpsync` is a port of libcurl to node.js. Its interface emulates the `http` module of node.js. But in contrast to `http` module's asynchronous functions, `httpsync` provides the equivalent synchronous APIs.~~

#### connect middlewares

* [safe-redirect](https://github.com/fengmk2/safe-redirect): Safe redirect middleware for connect.
* [response-cookie](https://github.com/fengmk2/response-cookie): cookie helpers for response. connect reponse cookie middleware.
* [connect-rt](https://github.com/fengmk2/connect-rt): connect response time middleware, include micro second.
* [userauth](https://github.com/fengmk2/userauth): connect user auth abstraction layer middleware.
* [connect-markdown](https://github.com/fengmk2/connect-markdown): Auto convert markdown to html for connect.
* [urlrouter](https://github.com/fengmk2/urlrouter): `http` url router, `connect` missing router middleware. Support `express` format routing. Support `connect` @1.8.x and @2.2.0+ .
* [connect-render](https://github.com/fengmk2/connect-render): Template Render helper using ejs for connect, Support connect @1.8.x and @2.2.0+ .
* [onehost](https://github.com/fengmk2/onehost): One host only, redirect `HTTP GET` for `any.domain.com` and `www.domain.com` to `want.domain.com`.
* [restful-router](https://github.com/fengmk2/restful-router): Simple RESTful url router.

#### Process

* [pm](https://github.com/aleafs/pm): A light weight child process manager, much power than `cluser`.
* [graceful](https://github.com/fengmk2/graceful): Graceful exit when `uncaughtException` emit, base on `process.on('uncaughtException')`.

#### unit test

* [node-patch](https://github.com/fengmk2/node-patch): Patch codes for node <= 0.6
* [pedding](https://github.com/fengmk2/pedding): Useful tools for unit test.
* [mm](https://github.com/fengmk2/mm): mock mate, easy to mock `http` request, `fs` access and so on. Mock伴侣，单元测试必备。
* [jscover](https://github.com/fengmk2/jscover): node wrap for JSCover.

#### logging

* [logstream](https://github.com/fengmk2/logstream): Log file stream, including auto rolling feature, support multiprocess append write at the same time.

#### Buffer, String, Stream

* [urlencode](https://github.com/fengmk2/urlencode): encodeURIComponent with charset.
* [charset](https://github.com/fengmk2/charset): Get the content charset from header and html content-type.
* [buffer-type](https://github.com/fengmk2/buffer-type): Detect content-type from Buffer data.
* [formstream](https://github.com/fengmk2/formstream): A multipart/form-data encoded stream, helper for file upload.

#### file system

* [ndir](https://github.com/fengmk2/ndir): The lost dir util tools.
* [mdit](https://github.com/fengmk2/mdit): Markdown it, yes, everything!

#### database

* [hbase-client](https://github.com/alibaba/node-hbase-client): Asynchronous HBase client for nodejs, pure javascript implementation.
* [zookeeper-watcher](https://github.com/fengmk2/zookeeper-watcher): Extend node-zookeeper-client, let zookeeper client support watch(path) method.
* [easymysql](https://github.com/aleafs/easymysql): mysql client in cluster, based on node-mysql
* [mongoskin](https://github.com/kissjs/node-mongoskin): A mongodb driver. This module is a wrapper of [node-mongodb-native](http://christkv.github.com/node-mongodb-native/).

#### Events & Callbacks

* [eventproxy](https://github.com/JacksonTian/eventproxy): An implementation of task/event based asynchronous pattern.

#### Tools

* [buffer-concat](https://github.com/fengmk2/buffer-concat): concat patch for Buffer in node < 0.8.
* [weibo-mid](https://github.com/fengmk2/weibo-mid): Convert Weibo Open API mid to base62 hash string.
* [cache-dns](https://github.com/fengmk2/cache-dns): Like dns module, but cache the results.
* [address](https://github.com/fengmk2/address): Get current machine IP, MAC and DNS servers.
* [parameter](https://github.com/fengmk2/parameter): A parameter verify tools.
* [utility](https://github.com/fengmk2/utility): A collection of useful utilities.
* [emoji](https://github.com/fengmk2/emoji): This library allows the handling and conversion of Emoji in Javascript.

#### code style

* [iFrame](https://github.com/windyrobin/iFrame): Nodejs code styles guide documents.

### Services API Client

* [node-gitlab](https://github.com/fengmk2/gitlab): Gitlab API nodejs client.
* [restful-client](https://github.com/fengmk2/restful-client): RESTFul api client base object. Usually use by some api client implementation.
* [node-weibo](https://github.com/fengmk2/node-weibo): weibo nodejs sdk
* [top](https://github.com/fengmk2/top): [Taobao Open API](http://open.taobao.com/) Client.
* [ots](https://github.com/fengmk2/ots): Aliyun OTS(Open Table Service) SDK for nodejs.
* [metaweblog](https://github.com/fengmk2/metaweblog): MetaWeblog API on Nodejs
* [tfs](https://github.com/fengmk2/tfs): Taobao FileSystem nodejs client.

### Applications

* [FaWave](https://chrome.google.com/webstore/detail/aicelmgbddfgmpieedjiggifabdpcnln): FaWave, is a Chrome extension supporting multiple microblogging, which can make all microblogs synchronously updating, work seamlessly across multiple microblogs when you switch between them.
<br/>![fawave prev](http://ww2.sinaimg.cn/large/6cfc7910jw1dp88kwaao5j.jpg)
* [mgravatar](https://github.com/fengmk2/mgravatar): Multi Globally Recognized Avatar.
* [nodeclub](https://github.com/cnodejs/nodeclub): Community system base on nodejs. [CNode](http://cnodejs.org) use this.
* [nodeblog](https://github.com/fengmk2/nodeblog): A blog system base on nodejs.
* [nodebox](https://github.com/fengmk2/nodebox) : A file box base on nodejs.
* [tjob](https://github.com/TBEDP/tjob): tao job in social network
* [urlrar](https://github.com/fengmk2/urlrar): Expand any shorten url for you
* [todo](https://github.com/fengmk2/todo): Simple todo web.

## Slides

* [Node.js 高性能编程 | High Performance Node.js](./ppt/high-performance-on-nodejs.html)
* [Node HBase Client](./ppt/nodejs_hbase_client.html): Asynchronous HBase client for Node.
* [Nodejs 快速开发 Web 产品](./ppt/nodejs-web-dev.html), [v2](./ppt/nodejs-web-dev-v2.html)
* [Code traps in Nodejs | 在Nodejs上踩过的坑](./ppt/hujs.html) at [沪JS 2012](http://www.hujs.org/)
* [我的 nodejs 编程规范](./ppt/nodejs_programming_style.html)
* [Unit Test in Nodejs](/ppt/unittest-and-bdd-in-nodejs-with-mocha.html)
* [Nodejs, 脱离了浏览器的Javascript](/ppt/qcon2011/index.html)
* [Nodejs实践二三事](/ppt/those-things-using-nodejs/index.html)

## Nodejs

* [Defense hash algorithm collision 防御hash算法冲突导致拒绝服务器](/blog/2011/defense-hash-algorithm-collision-dos.html)
* [Hash algorithm collision in Nodejs](/blog/2011/hac-in-nodejs-results.html)
* [Nodejs "Hello world" benchmark](/blog/helloworld-benchmark.html)
* [fibonacci(40) benchmark](/blog/2011/fibonacci/nodejs-python-php-ruby-lua.html)

## Application

* [Emoji](./emoji/)
* [Markdown Preview](./browser.html)
* [NAE-CLI](http://club.cnodejs.org/topic/4f387648301a48d50e003d4c)
* [CNodejs抽奖程序](/lottery/index.html)
* [Draw Text with Canvas](/blog/2011/canvas-text.html)

## [Collections](./collections)

* [Nodejs](./collections/nodejs.html)
* [Git](./collections/git.html)
* [Javascript](/collections/javascript.html)
* [jQuery](/collections/jquery.html)
* [CSS](/collections/css.html)
* [Linux](/collections/linux.html)
* [Web](/collections/web.html)

## Articles

* [Blog/2014](./blog/2014)
 * [co 常见使用场景](./blog/2014/07/co-usage.html)
 * [配置 Windows 下的 nodejs C++ 模块编译环境](blog/2014/07/node-gyp-cpp-build-env.html)
 * [Use koa-csrf in high performance way](blog/2014/06/use-koa-csrf-high-performance-way.html)
 * [byte, hessian.js, hsf-protocol 性能优化实战](blog/2014/05/hessian-performance-improve.html)
 * [快速搭建 Node.js 开发环境以及加速 npm](blog/2014/03/node-env-and-faster-npm.html)
 * [Hello koa, good bye connect](blog/2014/03/koa-vs-connect.html)
 * [Use istanbul run test coverage with mocha on koa](blog/2014/03/istanbul.html)
 * [Node.js 处理 GBK 编码模板](./blog/2014/iconv-lite/iconv-lite.html)
* [Blog/2013](./blog/2013)
 * [让 ejs 更加快 | Let ejs faster with options._with = false](./benchmark/ejs/with_false_better_than_true.html)
 * [Use Blanket.js instead of jscover](./blog/2013/05/blanketjs-jscoverage.html)
 * [Generate cobertura-xml report with mocha](./blog/2013/02/cobertura-xml-with-mocha.html)
 * [nodejs domain module hello world and benchmark](./blog/2013/03/domain-helloworld-benchmark.html)
* [Blog/2012](./blog/2012)
 * [使用 connect-domain 捕获异步调用中出现的异常](./blog/2012/12/domain_module.html)
 * [模拟 Nagle 算法的Delayed Ack](./benchmark/nagle-algorithm-delayed-ack-mock.html)
 * [给 connect 的 static 模块加上url路径前缀](./blog/2012/06/use-pre-for-connect-static-middleware.html)
 * [jscoverage 必须指定encoding参数](./blog/2012/06/jscoverage-must-set-encoding.html)
 * [使用nodejs解决phonegap开发期间的跨域问题](./blog/2012/05/phonegap-dev-env-cross-domain-with-nodejs.html)
* [Blog/2011](./blog/2011)
* [Blog/2010](./blog/2010)
* [Blog/2009](./blog/2009)
* [Blog](./blog/)
* [习得的乐观测试](./Learned-Optimism-Test.htm)
* [github `ssh` 协议代理配置](./github-proxy.html)

## Events

* <img width="100" src="http://jsconfcn.qiniudn.com/logo.png"> [杭JS 2014](http://2014.jsconf.cn/) is a two day conference focused on JavaScript and Node.js technologies. This developer driven event will bring together notable figures from both the Chinese and international JavaScript communities to share their knowledge and passion for JavaScript. The conference will be held in Hangzhou from June 21-22.

<a href="http://ww4.sinaimg.cn/large/61c56ebcgw1ehp32sddkgj21kw0s5k52.jpg" target="_blank"><img src="http://ww4.sinaimg.cn/mw1024/61c56ebcgw1ehp32sddkgj21kw0s5k52.jpg" alt="HangJS"></a>

* <img width="100" src="http://nfs.nodeblog.org/b/2/b2d5557fcea267c6b5ef13eb8762c4be.png" alt="Jingjs"> [京JS](http://jingjs.org/): 2013 9 - 10, NOVEMBER, A two day conference in Beijing for the Chinese JavaScript and Node.js community. (一个在北京举办的为期二天，为中国JavaScript和Node.js研发者社区举办的国际性技术大会)

![mk2&jackson&troy&goddy](http://nfs.nodeblog.org/b/8/b89258b13b66ee5abd4f530d018409f1.jpg)

* <img width="100" src="http://ww1.sinaimg.cn/bmiddle/6cfc7910jw1ehp6uh3sjrj20dw0dwglw.jpg" alt="Hujs"> [沪JS](http://www.hujs.org/): 2012 九月14－16日，上海, 一个为中国Javascript和Node.js开发者社区举办的会议

[![gleen&troy&goddy&jackson&mk2](http://ww3.sinaimg.cn/bmiddle/6cfc7910jw1dx6wgxck38j.jpg)](http://ww3.sinaimg.cn/large/6cfc7910jw1dx6wgxck38j.jpg)

* [Alibaba Developer Conference]

<a href="http://adc.alibabatech.org/" target="_blank"><img src="http://img04.taobaocdn.com/tps/i4/T1d7iVXvRfXXciXB3I-728-90.png" width="728" height="90" alt="ADC·阿里技术嘉年华（7月13-14日·杭州）" /></a>

<a href="http://adc.taobao.com/" target="_blank"><img src="http://adc.taobao.com/bundles/devcarnival/images/d2_728x90.jpg" width="728" height="90" alt="ADC·阿里技术嘉年华（7月7-8日·杭州）" /></a>

[Alibaba Developer Conference]: http://adc.taobao.com/

## Clone MK2's Blog

```
$ git clone git://github.com/fengmk2/fengmk2.github.com
```
