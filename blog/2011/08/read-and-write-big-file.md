# nodejs读写大文件

## 限制

大文件读写操作，由于内存限制问题，不要直接使用[fs.readFile](http://nodejs.org/docs/v0.5.4/api/fs.html#fs.readFile) 和 [fs.writeFile](http://nodejs.org/docs/v0.5.4/api/fs.html#fs.writeFile)。 
必须使用[fs.ReadStream](http://nodejs.org/docs/v0.5.4/api/fs.html#fs.ReadStream) 和 [fs.WriteStream](http://nodejs.org/docs/v0.5.4/api/fs.html#fs.WriteStream) 来对文件进行读写操作。

## [fs.ReadStream](http://nodejs.org/docs/v0.5.4/api/fs.html#fs.ReadStream)：上传大文件

    var urlparse = require('url').parse
      , http = require('http')
      , fs = require('fs');
    
    function upload(url, uploadfile, callback) {
        var urlinfo = urlparse(url);
        var options = {
            method: 'POST',
            host: urlinfo.host,
            path: urlinfo.pathname
        };
        if(urlinfo.port) {
            options.port = urlinfo.port;
        }
        if(urlinfo.search) {
            options.path += urlinfo.search;
        }
        var req = http.request(options, function(res) {
            var chunks = [], length = 0;
            res.on('data', function(chunk) {
                length += chunk.length;
                chunks.push(chunk);
            });
            res.on('end', function() {
                var buffer = new Buffer(length);
                // delay copy
                for(var i = 0, pos = 0, size = chunks.length; i < size; i++) {
                    chunks[i].copy(buffer, pos);
                    pos += chunks[i].length;
                }
                res.body = buffer;
                callback(null, res);
            });
        });
        var readstream = fs.createReadStream(uploadfile);
        readstream.on('data', function(chunk) {
            console.log('write', chunk.length);
            req.write(chunk);
        });
        readstream.on('end', function() {
            req.end();
        });
    };
    
    upload('http://weibo.com/', '/tmp/bigfile.pdf', function(err, res) {
        console.log(res.statusCode, res.headers);
    });


## [fs.WriteStream](http://nodejs.org/docs/v0.5.4/api/fs.html#fs.WriteStream)：下载大文件

    var urlparse = require('url').parse
      , http = require('http')
      , fs = require('fs');
      
    function download(url, savefile, callback) {
        console.log('download', url, 'to', savefile)
        var urlinfo = urlparse(url);
        var options = {
            method: 'GET',
            host: urlinfo.host,
            path: urlinfo.pathname
        };
        if(urlinfo.port) {
            options.port = urlinfo.port;
        }
        if(urlinfo.search) {
            options.path += urlinfo.search;
        }
        var req = http.request(options, function(res) {
            var writestream = fs.createWriteStream(savefile);
            writestream.on('close', function() {
                callback(null, res);
            });
            res.pipe(writestream);
        });
        req.end();
    };
    
    download('http://weibo.com/', '/tmp/downfile.html', function(err, res) {
        console.log(res.statusCode, res.headers);
    });

## 有爱
本文示例中为了凸显文件操作部分，异常处理部分代码已去除，请读者自行补全。
^_^ 希望本文对你有用