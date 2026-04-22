# Nodejs HTTP请求的超时处理 Nodejs HTTP Client Request Timeout Handle

## 问题
Nodejs原生的[http.request](http://nodejs.org/docs/v0.5.3/api/http.html#http.request) 方法是不支持设置超时参数的，
而网络请求经常会遇到超时的情况，特别是对于外部网络，如果不处理超时，发起的请求将会一直卡主，消耗的系统资源也不能及时被释放。

## 解决方案(新, 有问题，socket会重用，设置超时会有问题)：扩展http.ClientRequest, 增加setTimeout方法
利用[socket.setTimeout](http://nodejs.org/docs/v0.4.11/api/net.html#socket.setTimeout)，
我们可以为[http.ClientRequest](http://nodejs.org/docs/v0.4.11/api/http.html#http.ClientRequest)增加超时设置方法

    var http = require('http');
    http.ClientRequest.prototype.setTimeout = function(timeout, callback) {
        var self = this;
        if(callback) {
            self.on('timeout', callback);
        }
        self.connection.setTimeout(timeout, function() {
            self.abort();
            self.emit('timeout');
        });
    };

## 解决方案(旧)
定时器：通过定时器，当timeout事件触发的时候，主动调用[req.abort()](http://nodejs.org/docs/v0.5.3/api/http.html#request.abort) 终止请求，
然后返回超时异常。

## Request Timeout & Response Timeout
* 超时有请求超时(Request Timeout)：HTTP客户端发起请求到接受到HTTP服务器端返回响应头的这段时间，
如果超出设定时间，则表示请求超时。
* 响应超时(Response Timeout)：HTTP服务器端开始发送响应数据到HTTP客户端接收全部数据的这段时间，
如果超出设定时间，则表示响应超时。

## 示例代码：Timeout Demo

    var http = require('http');
    
    var request_timer = null, req = null;
    // 请求5秒超时
    request_timer = setTimeout(function() {
        req.abort();
        console.log('Request Timeout.');
    }, 5000);
    
    var options = {
        host: 'www.google.com',
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
    
## 有爱
^_^ 希望本文对你有用。