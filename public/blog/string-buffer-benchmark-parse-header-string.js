function parse(data) {
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

var data = new Buffer('POST /foo HTTP/1.1\r\nHost: foo.example.com\r\nContent-Length: 5\r\nConnection:keep-alive\r\nAccept:text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8\r\nCookie:connect.sid=OY2nKGqI3obs5lYee0JKTjhf.FDtbY1Jz5Ngw5So9Jv3MUetI5ITvrIfwgCkRw%2FcXUCk\r\nUser-Agent:Mozilla/5.0 (Macintosh; Intel Mac OS X 10_7_2) AppleWebKit/535.7 (KHTML, like Gecko) Chrome/16.0.912.41 Safari/535.7\r\n\r\nq=bar');

var n = 1000000;
var start = new Date();
for(var i = 0; i < n; i++) {
    parse(data);
}
console.log('buffer_parse take: ' + (new Date() - start) + ' ms');