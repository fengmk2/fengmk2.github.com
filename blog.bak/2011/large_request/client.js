/*!
 * MK2Blog - client.js
 * Copyright(c) 2012 fengmk2 <fengmk2@gmail.com>
 * MIT Licensed
 */

/**
 * Module dependencies.
 */

var http = require('http');

var url = '/foo?';

for (var i = 0; i < 8407; i++) {
  url += i + '=' + i + '&';
};

console.log(url.length)

var options = {
  host: 'localhost',
  port: 8080,
  path: url
};

http.get(options, function(res) {
  res.on('data', function(data) {
    console.log('size ' + data.toString());
  });
  res.on('end', function() {
    console.log('end');
  });
});