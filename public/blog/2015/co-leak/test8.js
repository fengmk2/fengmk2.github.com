'use strict';

/**
 * Module dependencies.
 */

var http = require('http');
var co = require('co');
var urllib = require('urllib');
var Syncer = require('./syncer');

var counts = {
  0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0
};
var runnings = {};

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

[1, 2, 3, 4, 5, 6].forEach(function (index) {
  var fn = co.wrap(function* start() {
    if (runnings[index]) {
      return;
    }
    runnings[index] = true;
    var syncer = new Syncer('http://npm.taobao.org/mirrors/api/node');
    var r;
    try {
      r = yield* syncer.start();
      // r = yield urllib.request('http://127.0.0.1:7001');
      // r = yield get('http://127.0.0.1:7001/');
      // r = yield getPromise('http://127.0.0.1:7001/');
    } catch (err) {
      console.error(err.message);
    } finally {
      runnings[index] = false;
    }
    counts[index]++;
    if (counts[index] % 10 === 0) {
      console.log('[#%d] run %d, %s:%s, %smb, %j',
      index, counts[index], r && r.status, r && r.res.size,
      process.memoryUsage().rss / 1024 / 1024,
      process.memoryUsage());
    }
  });

  setInterval(function () {
    fn.call(null).catch(function (err) {
      throw err;
    });
  }, 10);
});
