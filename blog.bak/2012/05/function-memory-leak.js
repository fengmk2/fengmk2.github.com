/*!
 * Function memory leak.
 * Copyright(c) 2012 fengmk2 <fengmk2@gmail.com>
 * MIT Licensed
 */

/**
 * Module dependencies.
 */

function search(name, callback) {
  var datas = [];
  for (var i = 0; i < 100; i++) {
    datas.push([ i + new Date().getTime(), name + '_' + Math.random() * 100 ]);
  }
  setTimeout(function () {
    callback(null, datas);
  }, 1000);
}

var cache = {};

function foo(name, callback) {
  var users = cache[name];
  if (users) {
    return callback(null, users);
  }
  search(name, function (err, datas) {
    cache[name] = datas;
    callback(null, datas);
  });
}

var counter = 0;
setInterval(function () {
  var name = 'user_' + counter;
  foo(name, function (err, users) {
    console.log('Search "%s" found %d, memory: %j', name, users.length, process.memoryUsage());
  });
  counter++;
}, 1000);