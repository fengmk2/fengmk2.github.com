# Nodejs抓取非utf8字符编码的页面

## 问题: nodejs目前无法处理非utf8编码以外的字符

在cnodejs用户组，有同学遇到[抓取百度页面出现编码问题](https://groups.google.com/group/cnodejs/browse_thread/thread/2a7dba383f3e3de8)

由于Buffer.toString(encoding)中encoding只支持utf8编码，所以需要附加模块才能处理此问题

## 解决：[node-iconv](https://github.com/bnoordhuis/node-iconv) 模块

安装: 
    
    $ npm install iconv
 
## 示例
    
    var http = require('http');
    
    var options = {
        host: 'www.baidu.com',
        port: 80,
        path: '/s?wd=gfw'
    };
    
    var Iconv = require('iconv').Iconv;
    
    http.get(options, function(res) {
        console.log("Got response: " + res.statusCode, res.headers);
        var buffers = [], size = 0;
        res.on('data', function(buffer) {
            buffers.push(buffer);
            size += buffer.length;
        });
        res.on('end', function() {
            var buffer = new Buffer(size), pos = 0;
            for(var i = 0, l = buffers.length; i < l; i++) {
                buffers[i].copy(buffer, pos);
                pos += buffers[i].length;
            }
            // 百度返回的页面数据流竟然还无法使用gbk完全解码。。
            // var gbk_to_utf8_iconv = new Iconv('GBK', 'UTF-8//TRANSLIT//IGNORE');
            
            // 百度页面的实际编码是：只能猜是GB18030，目前测试用此编码进行iconv转换处理，还没出现异常。。。
            // 既不是html meta里面声明的charset=gb2312，
            // 也不是response header声明的Content-Type:text/html;charset=gbk。
            var gb18030_to_utf8_iconv = new Iconv('GB18030', 'UTF-8');
            var utf8_buffer = gb18030_to_utf8_iconv.convert(buffer);
            var utf8_buffer = gbk_to_utf8_iconv.convert(buffer);
            console.log(utf8_buffer.toString());
        });
    }).on('error', function(e) {
        console.log("Got error: " + e.message);
    });

具体页面编码可以根据res.headers['content-type'] 来判断。
如果没有res.headers['content-type']，则需要分析html的 Content-Type 来判断charset了 

    “{meta http-equiv="Content-Type" content="text/html; charset=xxxx"/}”

更多url相关请求，可以使用[urllib](http://github.com/fengmk2/urllib)库实现

## 有爱

希望本文对你有用 ^_^