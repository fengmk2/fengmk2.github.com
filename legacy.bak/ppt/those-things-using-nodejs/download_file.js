var parse = require('url').parse
  , http = require('http')
  , fs = require('fs');
function download(url, savefile, callback) {
    console.log('download', url, 'to', savefile)
    var urlinfo = parse(url);
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
        // 创建只写文件流
        var writestream = fs.createWriteStream(savefile);
        // 继续做水电工，安装水管，还是以水流的方式安装（吐数据-》收数据）
        // 这次网络流变成吐数据，文件流变成收数据
        res.pipe(writestream);
        // 文件句柄已关闭，回调结果
        writestream.on('close', function() {
            callback(null, res);
        });
    });
    req.end();
};
download('http://weibo.com/', '/tmp/downfile.html', function(err, res) {
    console.log('download success', res.statusCode, res.headers);
});