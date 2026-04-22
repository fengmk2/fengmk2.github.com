var http = require('http')
  , parse = require('url').parse;
http.createServer(function(req, res) {
    var info = parse(req.url, true);
    var s = +info.query.s;
    res.write('Please waitting for ' + s + ' seconds...');
    setTimeout(function() {
        // 模拟响应处理时间
        res.end(s + ' seconds, url: ' + req.url);
    }, s * 1000);
}).listen(1984);
console.log('Server start at http://localhost:1984/');