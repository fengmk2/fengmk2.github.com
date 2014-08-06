var http = require('http');

http.createServer(function (req, res) {
  req.on('end', function () {
    res.end('hello world');
  });    
}).listen(1337);