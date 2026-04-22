# [nodejs]Buffer vs String
## 疑问
按nodejs官方的文档说明，使用Buffer操作字节流通常会比转化成String要高效。
实际情况全都是这样的吗？
本文通过一个简单的解析HTTP Request Header实例来解开此疑问。

## HTTP Request Header Demo

    POST /foo HTTP/1.1\r\n
    Host: foo.example.com\r\n
    Content-Length: 5\r\n
    Connection:keep-alive\r\n
    Accept:text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8\r\n
    Cookie:connect.sid=OY2nKGqI3obs5lYee0JKTjhf.FDtbY1Jz5Ngw5So9Jv3MUetI5ITvrIfwgCkRw%2FcXUCk\r\n
    User-Agent:Mozilla/5.0 (Macintosh; Intel Mac OS X 10_7_2) AppleWebKit/535.7 (KHTML, like Gecko) Chrome/16.0.912.41 Safari/535.7
    \r\n\r\n
    q=bar
    
## 需求
获取Header中Host的值

## Buffer版本
    
    var SPACE = 0x20, // ' '
        COLON = 0x3a, // 58, :
        NEWLINE = 0x0a, // \n
        ENTER = 0x0d; // \r
    
    exports.parse = function parse(data) {
        var line_start = 0, len = data.length;
        for(var i = 0 ; i < len; i++) {
            // Host: xxx.abc.com
            if(data[i] === COLON) {
                var key = data.toString('ascii', line_start, i).toLowerCase();
                i++; // skip ':'
                if(key === 'host') {
                    var value_start = i;
                    while(i < len) {
                        if(data[i] === ENTER) {
                            return data.toString('ascii', value_start, i).trim().toLowerCase();
                        }
                        i++;
                    }
                }
            } else if(data[i] ===  ENTER && data[i+1] === NEWLINE) {
                i += 2;
                line_start = i;
                if(data[i] ===  ENTER && data[i+1] === NEWLINE) {
                    // \r\n\r\n
                    return 'Host header not found';
                }
            }
        }
        return null;
    };

## String版本

    exports.parse = function parse(data) {
        var lines = data.toString('ascii').split("\n");
        var cut, name, host;
        for (var i = 0, len = lines.length; i < len; i++) {
            cut = lines[i].split(':');
            name = cut[0];
            if (name === 'Host') {
                if (cut[1] === undefined) {
                    return 'Host header not found';
                }
                host = cut[1].trim().toLowerCase();
                return host;
            }
        }
        return null;
    };

## 测试脚本

    var buffer_parse = require('./string-buffer-benchmark-parse-header-buffer').parse
      , string_parse = require('./string-buffer-benchmark-parse-header-string').parse;
    
    var data = new Buffer('POST /foo HTTP/1.1\r\nHost: foo.example.com\r\nContent-Length: 5\r\nConnection:keep-alive\r\nAccept:text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8\r\nCookie:connect.sid=OY2nKGqI3obs5lYee0JKTjhf.FDtbY1Jz5Ngw5So9Jv3MUetI5ITvrIfwgCkRw%2FcXUCk\r\nUser-Agent:Mozilla/5.0 (Macintosh; Intel Mac OS X 10_7_2) AppleWebKit/535.7 (KHTML, like Gecko) Chrome/16.0.912.41 Safari/535.7\r\n\r\nq=bar');
    
    //console.log(buffer_parse(data));
    //console.log(string_parse(data), data.length);
    
    var n = 1000000;
    var start = new Date();
    for(var i = 0; i < n; i++) {
        buffer_parse(data);
    }
    console.log('buffer_parse take: ' + (new Date() - start) + ' ms');
    
    start = new Date();
    for(var i = 0; i < n; i++) {
        string_parse(data);
    }
    console.log('string_parse take: ' + (new Date() - start) + ' ms');
    
## 测试结果

    $ node string-buffer-benchmark.js
    buffer_parse take: 1888 ms
    string_parse take: 4948 ms

## 结论

Buffer比String快多了。