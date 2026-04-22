# nodejs: 修复express的res.download 下载被取消导致的 “Can't remove headers after they are sent” 异常

## 来自百度？

想必你搜索看到此文章，一定是遇到了和我一样的问题。

express 中如果我们使用res.download处理文件下载，中途被取消下载，就会出现以下异常

    node.js:116
        throw e; // process.nextTick error, or 'error' event on first tick
            ^
            Error: Can't remove headers after they are sent.
            at ServerResponse.removeHeader (http.js:537:11)
            at Socket. (/usr/local/lib/node/.npm/express/2.0.0rc/package/lib/response.js:205:19)
            at Socket.emit (events.js:59:20)
            at Array. (net.js:799:27)
            at EventEmitter._tickCallback (node.js:108:2
            
查看了一下express的源代码，发现出现err的时候，会移除“Content-Disposition“ http header，这样必要会异常，因为响应已经发给客户端了，我们只需要将”if (err) self.removeHeader('Content-Disposition');“ 这段源代码注释掉就可以了。
如果不想修改express的源代码，我们可以在require('express')后，对express 进行一个简单修复：

    var express = require('express');
    //fixed express download cancel bug:
    require('http').ServerResponse.prototype.download = function(path, filename, fn){
        var self = this;
        // support callback as second arg
         if ('function' == typeof filename) {
            fn = filename;
            filename = null;
        }
        // transfer the file
         this.attachment(filename || path).sendfile(path, function(err){
            // if (err) self.removeHeader('Content-Disposition');
             if (fn) return fn(err);
            if (err) {
                self.req.next('ENOENT' == err.code
                    ? null
                    : err);
            }
        });
    };
  
### 有爱

^_^ ，希望本文对你有用。