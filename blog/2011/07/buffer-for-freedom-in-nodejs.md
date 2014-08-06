# 关于Nodejs中Buffer释放的二三事

## Buffer不会被GC？
为了看看这个问题，我写了一段测试代码

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

从[http://localhost:8080/](http://localhost:8080/)可以看到，一次http请求调用后

    ------------- new Buffer 0
    free 139.82421875MB
    ------------- after new 1MB buffer
    free 138.890625MB
    
    ------------- new Buffer 1
    free 138.890625MB
    ------------- after new 1MB buffer
    free 138.890625MB
    
    ------------- new Buffer 2
    free 138.890625MB
    ------------- after new 1MB buffer
    free 138.93359375MB
    
    ------------- new Buffer 3
    free 138.93359375MB
    ------------- after new 1MB buffer
    free 138.98046875MB
    
    ------------- new Buffer 4
    free 138.98046875MB
    ------------- after new 1MB buffer
    free 139.0703125MB
    
    ------------- new Buffer 5
    free 139.0703125MB
    ------------- after new 1MB buffer
    free 139.09375MB
    
    ***** 此处省略 *******
    
    ------------- new Buffer 96
    free 136.90234375MB
    ------------- after new 1MB buffer
    free 136.15234375MB
    
    ------------- new Buffer 97
    free 136.1796875MB
    ------------- after new 1MB buffer
    free 134.49609375MB
    
    ------------- new Buffer 98
    free 134.515625MB
    ------------- after new 1MB buffer
    free 133.64453125MB
    
    ------------- new Buffer 99
    free 133.64453125MB
    ------------- after new 1MB buffer
    free 132.76171875MB

从结果看来，Buffer会被回收。

## 疑问?

Buffer的实现是内存复用？还是说每次都重新申请和GC时释放给操作系统呢？

## 有爱
^_^ 希望本文对你有用