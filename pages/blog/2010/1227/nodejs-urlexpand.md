# nodejs实用示例：缩址还原

nodejs最近好红火，我也趁寒冷天气在nodejs的火炉边取暖一下。

## 思路非常简单:

1. httpserver获取需要还原的url；
2. 使用httpclient递归请求这个url，直到发现http status not in (302, 301)为止。
3. 返回还原的原url。
 
好吧，代码如下：

    var net = require('net'),
        http = require('http'),
        url = require('url'),
        fs = require('fs');
    
    var DEFAULT_PORTS = {
        'http:': 80,
        'https:': 443
    };
    
    var INDEX_TPL = fs.readFileSync('index.html');
    
    function _write(str, res, content_type) {
        if(res.jsonp_cb) {
            str = res.jsonp_cb + '("' + str + '")';
        }
        res.writeHead(200, {
            'Content-Length': str.length,
            'Content-Type': content_type || 'text/plain'
        });
        res.end(str);
    };
    
    function expand(short_url, res) {
        var info = url.parse(short_url);
        //  console.log('info: ' + JSON.stringify(info));
        if(info.protocol != 'http:') { // 无法请求https的url?
            _write(short_url, res);
            return;
        }
        var client = http.createClient(info.port 
            || DEFAULT_PORTS[info.protocol], info.hostname);
        var path = info.pathname || '/';
        if(info.search) {
            path += info.search;
        }
        var headers = {
            host: info.hostname,
            'User-Agent': 'NodejsSpider/1.0'
        };
        var request = client.request('GET', path, headers);
        request.end();
        request.on('response', function (response) {
            if(response.statusCode == 302 
                || response.statusCode == 301) {
                expand(response.headers.location, res);
            } else {
                _write(short_url, res);
            }
        }); 
    };
    
    //expand('http://sinaurl.cn/hbMUII');
    // http服务
    http.createServer(function(req, res){
        if(req.url.indexOf('/api?') == 0) {
            var params = url.parse(req.url, true);
            if(params.query && params.query.u) {
                if(params.query.cb) { // 支持jsonp跨域请求
                    res.jsonp_cb = params.query.cb;
                }
                expand(params.query.u, res);
            } else {
                _write('', res);
            }
        } else {
            _write(INDEX_TPL, res, 'text/html');
        }
    }).listen(1235);
    
    process.on('uncaughtException', function (err) {
        console.log('Caught exception: ' + err);
    });

## 启动你的web服务器吧：

$ node urlexpand.js
 
打开浏览器直接访问:

[http://127.0.0.1:1235/api?u=http://is.gd/imWyT](http://127.0.0.1:1235/api?u=http://is.gd/imWyT)

或者访问我的测试服务器:

[http://s8.hk/api/e?u=http://is.gd/imWyT&cb=foo](http://s8.hk/api/e?u=http://is.gd/imWyT&cb=foo)

### 有爱

希望本文对你有用。^_^ 