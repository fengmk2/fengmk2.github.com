/*!
 * benchmark - connect static middleware benchmark.
 * 
 * Copyright(c) 2012 fengmk2 <fengmk2@gmail.com>
 * MIT Licensed
 */

/**
 * Module dependencies.
 */

var connect = require('connect');

connect(
  connect.static(__dirname),
  function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('Hello World\n');
  }
).listen(8124);

console.log('Server running at http://127.0.0.1:8124/');
