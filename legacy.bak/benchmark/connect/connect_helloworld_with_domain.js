var connect = require('connect');
var createDomain = require('/Users/mk2/fork/node/lib/domain').create;

connect(
  function (req, res, next) {
    console.log(req.url)
    var domain = createDomain();
    domain.on('error', function (err) {
      console.log('errrrrr', err);
      res.statusCode = 500;
      res.end(err.message + '\n');
      domain.dispose();
    });
    domain.enter();
    next();
    domain.exit();
  },
  function (req, res, next) {
    if (req.url === '/error') {
      process.nextTick(function () {
        res.end('params: ' + req.query.abc);
      });
      return;
    }
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('Hello World\n');
  }
).listen(8124);

console.log('Server running at http://127.0.0.1:8124/');