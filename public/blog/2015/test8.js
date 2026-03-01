var http = require('http');
var co = require('co');
var urllib = require('urllib');

var counts = {
  0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0
};
var running = false;

function get(url) {
  return function (callback) {
    http.get(url, function(res) {
      var size = 0;
      res.on('data', function (data) {
        size += data.length;
      }).on('end', function () {
        callback(null, {
          size: size,
          statusCode: res.statusCode
        });
      });
    }).on('error', callback);
  };
}

function getPromise(url) {
  return new Promise(function(resolve, reject) {
    http.get(url, function(res) {
      var size = 0;
      res.on('data', function (data) {
        size += data.length;
      }).on('end', function () {
        resolve({
          size: size,
          statusCode: res.statusCode
        });
      });
    }).on('error', reject);
  });
}

function* start(index) {
  if (running) {
    return;
  }
  running = true;
  var r;
  try {
    r = yield urllib.request('http://127.0.0.1:7001');
    // r = yield get('http://127.0.0.1:7001/');
    // r = yield getPromise('http://127.0.0.1:7001/');
  } catch (err) {
    console.error(err.message);
  } finally {
    running = false;
  }
  counts[index]++;
  if (counts[index] % 100 === 0) {
    console.log('[#%d] run %d, %s:%s, %smb',
    index, counts[index], r && r.status, r && r.size, process.memoryUsage().rss / 1024 / 1024);
  }
}

var fn = co.wrap(start);

setInterval(function () {
  fn.call(null, 1).catch(function (err) {
    throw err;
  });
}, 10);
setInterval(function () {
  fn.call(null, 2).catch(function (err) {
    throw err;
  });
}, 10);
setInterval(function () {
  fn.call(null, 3).catch(function (err) {
    throw err;
  });
}, 10);
setInterval(function () {
  fn.call(null, 4).catch(function (err) {
    throw err;
  });
}, 10);
setInterval(function () {
  fn.call(null, 5).catch(function (err) {
    throw err;
  });
}, 10);
setInterval(function () {
  fn.call(null, 6).catch(function (err) {
    throw err;
  });
}, 10);
