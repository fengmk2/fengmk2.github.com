var parse = require('url').parse
  , http = require('http')
  , fs = require('fs');
function upload(url, uploadfile, callback) {
    var info = parse(url)
      , path = info.pathname + (info.search || '')
      , options = { host: info.hostname, port: info.port || 80, path: path, method: 'POST' };
    var req = http.request(options, function(res) {
        var chunks = [], length = 0;
        res.on('data', function(chunk) {
            length += chunk.length;
            chunks.push(chunk);
        });
        res.on('end', function() {
            var buffer = new Buffer(length);
            for(var i = 0, pos = 0, l = chunks.length; i < l; i++) {
                chunks[i].copy(buffer, pos);
                pos += chunks[i].length;
            }
            res.body = buffer;
            callback(null, res);
        });
    });
    // 创建文件只读文件流
    var readstream = fs.createReadStream(uploadfile);
    // 通过监听文件的data事件，获取数据，就像它自己会吐数据出来一样
    // 而不用自己去调用read方法，一点一点地去取数据
    readstream.on('data', function(chunk) {
        console.log('write', chunk.length);
        // 向服务器发送数据
        req.write(chunk);
    });
    // 通过end事件可以判断文件数据是否全部读取完了
    readstream.on('end', function() {
        req.end();
    });
};

function upload_with_pipe(url, uploadfile, callback) {
    var info = parse(url)
      , path = info.pathname + (info.search || '')
      , options = { host: info.hostname, port: info.port || 80, path: path, method: 'POST' };
    var req = http.request(options, function(res) {
        var chunks = [], length = 0;
        res.on('data', function(chunk) {
            length += chunk.length;
            chunks.push(chunk);
        });
        res.on('end', function() {
            var buffer = new Buffer(length);
            for(var i = 0, pos = 0, l = chunks.length; i < l; i++) {
                chunks[i].copy(buffer, pos);
                pos += chunks[i].length;
            }
            res.body = buffer;
            callback(null, res);
        });
    });
    // 创建只读文件流
    var readstream = fs.createReadStream(uploadfile);
    // 直接使用pipe，想象两端水管，我们只需将他们按照水流方向连接起来即可（吐数据-》收数据）
    // 当数据读取完，会自动触发req.end()
    readstream.pipe(req);
};

upload('http://weibo.com/', '/tmp/bigfile.pdf', function(err, res) {
    console.log('upload success', res.statusCode, res.headers);
});

upload_with_pipe('http://weibo.com/', '/tmp/bigfile.pdf', function(err, res) {
    console.log('upload success', res.statusCode, res.headers);
});