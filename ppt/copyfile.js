var fs = require('fs');
var EventEmitter = require('events').EventEmitter;

/**
 * 嵌套callback版本
 */
function copyfileNestedCallback(from, to, callback) {
  fs.stat(from, function (err, stats) {
    if (err) {
      return callback(err);
    }
    fs.readFile(from, function (err, content) {
      if (err) {
        return callback(err);
      }
      fs.writeFile(to, content, function (err) {
        if (err) {
          return callback(err);
        }
        return callback(null, content.length);
      });
    });  
  });
}

/**
 * EventEmitter版本
 */
function copyfileEventEmitter(from, to, callback) {
  var ep = new EventEmitter();
  ep.on('stats', function (stats) {
    fs.readFile(from, function (err, content) {
      if (err) {
        return ep.emit('error', err);
      }
      ep.emit('content', content);
    });
  });
  ep.on('content', function (content) {
    fs.writeFile(to, content, function (err) {
      if (err) {
        return ep.emit('error', err);
      }
      return callback(null, content.length);
    });
  });
  ep.once('error', function (err) {
    ep.removeAllListeners();
    callback(err);
  });

  fs.stat(from, function (err, stats) {
    if (err) {
      return ep.emit('error', err);
    }
    ep.emit('stats', stats);
  });
}