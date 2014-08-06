
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