
var connect = require('connect')
  , path = require('path')
  , fs = require('fs')
  , dns = require('dns')
  , os = require('os');

var root = path.join(__dirname, '../../');
connect(
    connect.static(root),
    function (req, res, next) {
        if (req.url === '/favicon.ico') {
            return next();
        }
        var p = path.join(root, req.url);
        res.setHeader('Content-Type', 'text/html');
        res.write('<!DOCTYPE html>\r\n<html><head><meta charset="utf-8" /><title>' + req.url + '</title></head><body>');
        res.write('<h2>/<a href="/">root</a>');
        var start = req.url, paths = [];
        while(true) {
            paths.push(start);
            start = path.dirname(start);
            if(start === '/') {
                break;
            }
        }
        console.log(paths)
        for(var i = paths.length - 1; i >= 0; i--) {
            var start = paths[i];
            res.write('/<a href="' + start + '">' + path.basename(start) + '</a>');
            start = path.dirname(start);
        }
        res.write('</h2>');
        res.write('<hr /><ul>');
        fs.readdir(p, function(err, files) {
            if(files) {
                for(var i = 0, len = files.length; i < len; i++) {
                    var file = files[i];
                    res.write('<li><a href="' + path.join(req.url, file) + '">' + file + '</a></li>');
                }
            }
            res.end('</ul></body>');
        });
    }
).listen(4444);

dns.lookup(os.hostname(), function(err, address) {
    console.log('server ' + root + ' on http://' + address + ':4444/');
});
