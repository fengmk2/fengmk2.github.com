var co = require('co');
var http = require('http');
var eventWrap = require('co-event-wrap');
var fs = require('co-fs');

co(function* () {
  var req = http.get('http://cnodejs.org');
  eventWrap(req);
  req.on('response', function* (res) {
    res = eventWrap(res);
    var datas = [];
    res.on('data', function* (data) {
      console.log('data#%d %d bytes', datas.length, data.length);
      datas.push(data);
    });
    res.on('end', function* () {
      var body = Buffer.concat(datas);
      yield fs.writeFile(__dirname + '/cnodejs.html', body);
      console.log('got %d bytes, headers: %j', body.length, res.headers);
    });
  });
})();
