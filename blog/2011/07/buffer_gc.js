
var http = require('http')
  , os = require('os');

function create(size, res) {
    var mb = 1024 * 1024;
    res.write('free ' + os.freemem() / mb + 'MB\r\n');
    res.write('------------- after new ' + size + 'MB buffer\r\n');
    var buffer = new Buffer(size * mb);
    for(var i = 0, len = buffer.length; i < len; i++) {
        buffer[i] = 0;
    }
    res.write('free ' + os.freemem() / mb + 'MB\r\n\r\n');
}

http.createServer(function(req, res) {
    var size = 1;
    for(var i = 0; i < 100; i++) {
        res.write('------------- new Buffer ' + i + '\r\n');
        create(size, res);
    }
    res.end('');
}).listen('8080');