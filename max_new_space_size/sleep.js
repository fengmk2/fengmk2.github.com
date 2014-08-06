var http = require('http');

http.createServer(function (req, res) {
  req.resume();
  req.on('end', function () {
    setTimeout(function () {
      res.end('hello world');
    }, 500);
  });
}).listen(1984);
