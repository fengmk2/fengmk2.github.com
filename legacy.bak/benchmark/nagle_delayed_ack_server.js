/*!
 * Copyright(c) 2012 fengmk2 <fengmk2@gmail.com>
 * MIT Licensed
 */

"use strict";

/**
 * Module dependencies.
 */

var http = require('http');
var microtime = require('microtime');

http.createServer(function (req, res) {
  var size = 0;
  var start = microtime.now();
  req.on('data', function (data) {
    size += data.length;
  });
  req.on('end', function () {
    var use = microtime.now() - start;
    res.end(JSON.stringify({
      port: req.connection.remotePort,
      size: size,
      headers: req.headers,
      method: req.method,
      url: req.url,
      use: use,
    }));
    console.log('[%sμs] %s:%s %s %s',
      use, req.connection.remoteAddress, req.connection.remotePort, req.method, req.url);
  });
}).listen(1984);