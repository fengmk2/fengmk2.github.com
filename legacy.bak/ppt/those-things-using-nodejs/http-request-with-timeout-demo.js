var http = require('http')
  , parse = require('url').parse;
function urlget(url, callback) {
    var info = parse(url)
      , path = info.pathname + (info.search || '')
      , options = { host: info.hostname, port: info.port || 80, path: path, method: 'GET' };
    var req = null, request_timeout = null;
    request_timeout = setTimeout(function() {
        request_timeout = null;
        req.abort();
        callback(new Error('Request timeout'));
    }, 5000);
    req = http.request(options, function(res) {
        clearTimeout(request_timeout);
        var chunks = [], length = 0;
        res.on('data', function(chunk) {
            length += chunk.length;
            chunks.push(chunk);
        }).on('end', function() {
            var data = new Buffer(length);
            for(var i = 0, pos = 0, l = chunks.length; i < l; i++) {
                chunks[i].copy(data, pos);
                pos += chunks[i].length;
            }
            res.body = data;
            callback(null, res);
        }).on('error', function(err) {
            callback(err, res);
        });
    }).on('error', function(err) {
        // node0.5.x及以上，调用req.abort()会触发一次“socket hang up” error
        // 所以需要判断是否超时，如果是超时，则无需再回调异常结果
        if(request_timeout) {
            clearTimeout(request_timeout);
            callback(err);
        }
    });
    req.end();
};

var util = require('util');
var good_url = 'http://www.google.com/';
urlget(good_url, function(err, res) {
    console.log('\nGET', good_url);
    if(err) {
        console.log('error:', util.inspect(err, true), '\nResponse:\n', res ? res.headers : null);
    } else {
        console.log('Headers:\n', res.headers, '\nBody:\n', res.body.toString());
    }
});

var error_url = 'http://www.google2222.com/';
urlget(error_url, function(err, res) {
    console.log('\nGET', error_url);
    if(err) {
        console.log('error:', util.inspect(err, true), '\nResponse:\n', res ? res.headers : null);
    } else {
        console.log('Headers:\n', res.headers, '\nBody:\n', res.body.toString());
    }
});

var timeout_url = 'http://t.co/';
var start = new Date();
urlget(timeout_url, function(err, res) {
    console.log('\nGET', timeout_url);
    console.log(new Date() - start);
    if(err) {
        console.log('error:', util.inspect(err, true), '\nResponse:\n', res ? res.headers : null);
    } else {
        console.log('Headers:\n', res.headers, '\nBody:\n', res.body.toString());
    }
});

var response_timeout_url = 'http://localhost:1984/foo?s=10';
var start = new Date();
urlget(response_timeout_url, function(err, res) {
    console.log('\nGET', response_timeout_url);
    console.log(new Date() - start);
    if(err) {
        console.log('error:', util.inspect(err, true), '\nResponse:\n', res ? res.headers : null);
    } else {
        console.log('Headers:\n', res.headers, '\nBody:\n', res.body.toString());
    }
});