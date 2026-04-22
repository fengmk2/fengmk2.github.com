var zlib = require('zlib');
var fs = require('fs');
var path = require('path');
var http = require('http');

var source = fs.readFileSync(path.join(__dirname, 'parse_unicode.js'));

zlib.gzip(source, function (err, zipData) {

  http.createServer(function (req, res) {

    if (req.url === '/gzip') {
      zlib.gzip(source, function (err, zip) {
        res.setHeader('Content-Encoding', 'gzip');
        res.setHeader('X-Source-Length', source.length);
        res.setHeader('Content-Length', zip.length);
        res.end(zip);
      });
      return;
    }

    if (req.url === '/gunzip') {
      zlib.gunzip(zipData, function (err, buf) {
        res.setHeader('X-Source-Length', zipData.length);
        res.setHeader('Content-Length', buf.length);
        res.end(buf);
      });
      return;
    }

    if (req.url === '/source') {
      res.setHeader('Content-Length', source.length);
      res.end(source);
      return;
    }

    res.setHeader('Content-Encoding', 'gzip');
    res.setHeader('Content-Length', zipData.length);
    res.end(zipData);
    return;

  }).listen(8080);

});

// $ siege -c 10 -b -t 10s "http://localhost:8080/gzip"
// $ siege -c 10 -b -t 10s "http://localhost:8080/gunzip"
// $ siege -c 10 -b -t 10s "http://localhost:8080/source"
// $ siege -c 10 -b -t 10s "http://localhost:8080/"