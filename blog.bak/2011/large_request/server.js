/*!
 * MK2Blog - large_request
 * Copyright(c) 2012 fengmk2 <fengmk2@gmail.com>
 * MIT Licensed
 */

/**
 * Module dependencies.
 */

var http = require('http');
var parse = require('url').parse;

var app = http.createServer(function(req, res) {
  var query = parse(req.url, true).query;
  res.end(req.url.length + ', ' + Object.keys(query).length + ' keys');
}).listen(8080);

console.log('start on 8080');