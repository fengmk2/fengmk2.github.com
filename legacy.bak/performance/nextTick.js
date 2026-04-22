/*!
 * performance - nextTick.js
 * Copyright(c) 2013 fengmk2 <fengmk2@gmail.com>
 * MIT Licensed
 */

"use strict";

/**
 * Module dependencies.
 */

var http = require('http');

http.createServer(function (req, res) {
  res.end('hello world 1984');
}).listen(1984);

http.createServer(function (req, res) {
  process.nextTick(function () {
    res.end('hello world 1985');
  });
}).listen(1985);