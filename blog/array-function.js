


var arrays = [0];
var noop = function () {};

var start = new Date();
for (var i = 0; i < 100000000; i++) {
  if (arrays.length === 1) {
    arrays[0] = 1;
  }
}

console.log(new Date() - start);

start = new Date();
for (var i = 0; i < 100000000; i++) {
  noop();
}

console.log(new Date() - start);

start = new Date();
for (var i = 0; i < 100000000; i++) {
  (function () {})();
}

console.log(new Date() - start);
