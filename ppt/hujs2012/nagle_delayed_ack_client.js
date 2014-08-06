// npm install agentkeepalive@0.1.0: should reappear the delay problem
var Agent = require('agentkeepalive');
var agent = new Agent();
function request(callback) {
  var options = {port: 1984, path: '/fengmk2', method: 'POST', agent: agent};
  var start = Date.now();
  var req = require('http').request(options, function (res) {
    res.on('end', function () {
      console.log('[%s ms] %s', Date.now() - start, res.statusCode);
      callback();
    });
  });
  req.write('foo');
  process.nextTick(function () { req.end('bar'); });
}
function next() {
  setTimeout(function () { request(next); }, 1000);
}
next();