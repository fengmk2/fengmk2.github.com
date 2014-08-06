# 使用 connect 进行web开发

nodejs的web开发，目前最受欢迎的必然是 [express]。

但是我觉得 [express] 太过复杂了，而且很多功能都不一定会使用上。

于是我最近都在想如何脱离 [express] ，基于 [connect] ，结合刚好满足需求功能的 `middleware`，进行web开发。

## web开发的基本功能

* url routing
* query parser, body parser
* upload file
* template engine and render helper

[express]: http://expressjs.com/ "High performance, high class web development for Node.js"
[connect]: http://senchalabs.github.com/connect "Connect is a middleware framework for node, shipping with over 18 bundled middleware and a rich selection of 3rd-party middleware."