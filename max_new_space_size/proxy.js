var http = require('http');

var agent = new http.Agent({
  keepAlive: true
});

http.createServer(function (req, res) {
  req.resume();
  req.on('end', function () {
    var start = Date.now();
    http.get('http://localhost:1984/foo', function (serverRes) {
      var size = 0;
      serverRes.on('data', function (data) {
        size += data.length;
      });
      serverRes.on('end', function () {
        var use = Date.now() - start;
        // console.log(use);
        res.end('data size: ' + size);
      });
    });
  });
}).listen(1985);
