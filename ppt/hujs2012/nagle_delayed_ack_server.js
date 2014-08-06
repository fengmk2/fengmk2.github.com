require('http').createServer(function (req, res) {
  var start = Date.now();
  req.on('end', function () {
    res.end('hello world');
    console.log('[%s ms] %s %s', Date.now() - start, req.method, req.url);
  });
}).listen(1984);