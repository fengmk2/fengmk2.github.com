/*!
 * helloworld - app.js
 * Copyright(c) 2012 fengmk2 <fengmk2@gmail.com>
 * MIT Licensed
 */

"use strict";

/**
 * Module dependencies.
 */

var connect = require('connect');
var connectDomain = require('connect-domain');

var app1 = connect()
.use(connectDomain())
.use(function (req, res, next) {
  if (req.url === '/sync_error') {
    throw new Error('sync error');
  }
  if (req.url === '/async_error') {
    return process.nextTick(function () {
      mk2.haha();
    });
  }
  res.end('hello, ' + req.method + ' ' + req.url);
});

var app2 = connect()
.use(function (req, res, next) {
  if (req.url === '/sync_error') {
    throw new Error('sync error');
  }
  if (req.url === '/async_error') {
    return process.nextTick(function () {
      mk2.haha();
    });
  }
  res.end('hello, ' + req.method + ' ' + req.url);
});

process.on('uncaughtException', function (err) {
  console.error(err);
});

app1.listen(1984);
app2.listen(1985);
