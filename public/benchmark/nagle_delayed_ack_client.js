/*!
 * Copyright(c) 2012 fengmk2 <fengmk2@gmail.com>
 * MIT Licensed
 */

"use strict";

/**
 * Module dependencies.
 */

// npm install agentkeepalive@0.1.0: should reappear the delay problem
// npm install agentkeepalive@0.1.1+: should slove the delay problem
var Agent = require('agentkeepalive');
var http = require('http');
var microtime = require('microtime');

var agent = new Agent();

function request(callback) {
  var options = {
    host: 'localhost',
    port: 1984,
    path: '/fengmk2',
    method: 'POST',
    agent: agent
  };
  var start = microtime.now();
  var req = http.request(options, function (res) {
    res.on('end', function () {
      var use = microtime.now() - start;
      console.log('[%sμs] %s', use, res.statusCode);
      callback();
    });
  });
  req.write('foo');
  process.nextTick(function () {
    req.end('bar');
  });
}

function next() {
  setTimeout(function () {
    request(next);
  }, 1000);
}

next();