var microtime = require('microtime');
var mk2 = require('./build/Release/mk2');

console.log(mk2);
console.log('hello() => %j', mk2.hello());
console.log('helloNoClose() => %j', mk2.helloNoClose());
console.log('newPointArray() => %j', mk2.newPointArray(1, 2, 3));
console.log('newPointArrayNoClose() => %j', mk2.newPointArrayNoClose(4, 5, 6));
console.log('getUndefined() => %j', mk2.getUndefined());

function cycle(n) {
  var s = 0;
  for (var i = 0; i < n; i++) {
    s++;
  }
  return s;
}

var start = microtime.now();
var s1 = cycle(100000);
console.log('jsCycle %s us, %j', microtime.now() - start, s1);

start = microtime.now();
var s2 = mk2.cycle(100000);
console.log('cppCycle %s us, %j', microtime.now() - start, s2);
