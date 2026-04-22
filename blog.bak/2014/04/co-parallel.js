var co = require('co');
var urllib = require('co-urllib');

function *a() {
  console.log('a start');
  var r = yield *urllib.request('http://www.taobao.com');
  console.log('a end');
  return {a: r.status}
}

function *b() {
  console.log('b start');
  var r = yield *urllib.request('http://www.taobao.com');
  console.log('b end');
  return {b: r.status};
}

function *c() {
  console.log('c start');
  var r = yield *urllib.request('http://www.tmall.com');
  console.log('c end');
  return {c: r.status};
}

co(function *() {
  var rs = yield [
    a(),
    b(),
    c(),
  ];
  console.log(rs);
})();
