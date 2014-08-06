// http://cnodejs.org/topic/4fd6b7ba839e1e581407aac8

var http = require('http');
var net = require('net');

// http://xiaozhi.cloudfoundry.com/diary/add?foo=123
var url = 'http://xiaozhi.cloudfoundry.com/diary/d3412629277555260UJl' + String.fromCharCode(0xDFFF) + '/edit';
http.get(url, function (res) {
  console.log(res.statusCode, res.headers);
  res.on('data', function (data) {
    console.log(data.toString());
  });
});
