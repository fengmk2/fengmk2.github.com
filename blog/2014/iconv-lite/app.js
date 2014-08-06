/**!
 * gbk-demo - app.js
 *
 * Copyright(c) 2014
 * MIT Licensed
 *
 * Authors:
 *   fengmk2 <fengmk2@gmail.com> (http://fengmk2.github.com)
 */

"use strict";

/**
 * Module dependencies.
 */

var connect = require('connect');
var fs = require('fs');
var path = require('path');
var iconv = require('iconv-lite');

var app = connect();

var filepath = path.join(__dirname, 'index.html');
var content = fs.readFileSync(filepath);

app.use(function (req, res) {
  var s = iconv.decode(content, 'gbk');
  if (req.url === '/utf8') {
    res.setHeader('Content-Type', 'text/html; charset=utf8');
    s = s.replace('<title>淘宝网 - 淘！我喜欢</title>', '<title>淘宝网 - 淘！我喜欢 UTF8</title>')
      .replace('<meta charset="gbk">', '<meta charset="utf8">')
      .replace('你好啊', '你好啊 UTF8');
    // show utf8 page
    return res.end(s);
  }

  // show gbk page
  res.setHeader('Content-Type', 'text/html; charset=gbk');
  s = s.replace('<title>淘宝网 - 淘！我喜欢</title>', '<title>淘宝网 - 淘！我喜欢 GBK</title>')
      .replace('你好啊', '你好啊 GBK');
  res.end(iconv.encode(s, 'gbk'));
});

app.listen(1984);
