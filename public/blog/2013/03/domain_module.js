var domain = require('domain');
var http = require('http');

var domainMiddleware = function (req, res, next, errorHandle) {
  var d = domain.create();
  d.once('error', errorHandle);
  d.run(next);
};

var app = http.createServer(function (req, res) {
  domainMiddleware(req, res, function () {
    // normal response
    if (req.url === '/error') {
      process.nextTick(function () {
        var a = null;
        a.foo();
      });
      return;
    }
    res.end('hello domain');
  }, function (err) {
    // sending err response
    res.statusCode = 500;
    res.end(err.stack);
  });
});

app.listen(1984);

var appNoDomain = http.createServer(function (req, res) {
  if (req.url === '/error') {
    process.nextTick(function () {
      var a = null;
      a.foo();
    });
    return;
  }
  res.end('hello domain');
});

appNoDomain.listen(1985);
