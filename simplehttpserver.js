/*!
 * A very simple HTTP Server.
 * Copyright(c) 2012 fengmk2 <fengmk2@gmail.com>
 * MIT Licensed
 */

/**
 * Module dependencies.
 */

var fs = require('fs');
var path = require('path');
var http = require('http');

http.createServer(function (req, res) {
  var filepath = path.join(path.dirname(__dirname), req.url.substring(1), 'coverage.html');
  path.exists(filepath, function (exits) {
    if (!exits) {
      res.writeHead(404, { 'Content-Type': 'text/html' });
      return res.end();
    }
    res.writeHead(200, { 'Content-Type': 'text/html' });
    var stream = fs.createReadStream(filepath);
    req.on('close', stream.destroy.bind(stream));
    stream.pipe(res);
  });  
}).listen(8124);