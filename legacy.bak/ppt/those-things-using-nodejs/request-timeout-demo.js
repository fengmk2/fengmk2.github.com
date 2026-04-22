
var http = require('http');

var request_timer = null, req = null;
// 请求5秒超时
request_timer = setTimeout(function() {
    req.abort();
    console.log('Request Timeout.');
}, 5000);

var options = {
    host: 'www.google.com', // t.co
    port: 80,
    path: '/'
};
req = http.get(options, function(res) {
    clearTimeout(request_timer);
    
    // 等待响应60秒超时
    var response_timer = setTimeout(function() {
        res.destroy();
        console.log('Response Timeout.');
    }, 60000);
    
    console.log("Got response: " + res.statusCode);
    var chunks = [], length = 0;
    res.on('data', function(chunk) {
        length += chunk.length;
        chunks.push(chunk);
    });
    res.on('end', function() {
        clearTimeout(response_timer);
        var data = new Buffer(length);
        // 延后copy
        for(var i=0, pos=0, size=chunks.length; i<size; i++) {
            chunks[i].copy(data, pos);
            pos += chunks[i].length;
        }
        console.log('Body:\r\n');
        console.log(data.toString());
    });
}).on('error', function(e) {
    // 响应头有错误
    clearTimeout(request_timer);
    console.log("Got error: " + e.message);
});