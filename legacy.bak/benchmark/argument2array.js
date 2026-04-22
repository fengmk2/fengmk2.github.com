var Benchmark = require('benchmark');

// http://jsperf.com/arguments-to-array-with-3-length
// http://jsperf.com/arguments-to-array/5

function slice() {
  return Array.prototype.slice.call(arguments);
}

function slice2() {
  return [].slice.call(arguments);
}

function forAndArrayPush() {
  var args = [];
  for (var i = 0, l = arguments.length; i < l; i++) {
    args.push(arguments[i]);
  }
  return args;
}

function forAndArraySet() {
  var args = [];
  for (var i = 0, l = arguments.length; i < l; i++) {
    args[i] = arguments[i];
  }
  return args;
}

function newArrayArgumentsLength() {
  var args = new Array(arguments.length);
  for (var i = 0, l = arguments.length; i < l; i++) {
    args[i] = arguments[i];
  }
  return args;
}

console.log(slice(1, 2, 3, 4, 5));
console.log(slice2(1, 2, 3, 4, 5));
console.log(forAndArrayPush(1, 2, 3, 4, 5));
console.log(forAndArraySet(1, 2, 3, 4, 5));
console.log(newArrayArgumentsLength(1, 2, 3, 4, 5));

var suite = new Benchmark.Suite();

suite
.add('slice(1)', function () {
  slice(1);
})
.add('slice2(1)', function () {
  slice2(1);
})
.add('forAndArrayPush(1)', function () {
  forAndArrayPush(1);
})
.add('forAndArraySet(1)', function () {
  forAndArraySet(1);
})
.add('newArrayArgumentsLength(1)', function () {
  newArrayArgumentsLength(1);
})

.add('slice(1, 2)', function () {
  slice(1, 2);
})
.add('slice2(1, 2)', function () {
  slice2(1, 2);
})
.add('forAndArrayPush(1, 2)', function () {
  forAndArrayPush(1, 2);
})
.add('forAndArraySet(1, 2)', function () {
  forAndArraySet(1, 2);
})
.add('newArrayArgumentsLength(1, 2)', function () {
  newArrayArgumentsLength(1, 2);
})

.add('slice(1, 2, 3)', function () {
  slice(1, 2, 3);
})
.add('slice2(1, 2, 3)', function () {
  slice2(1, 2, 3);
})
.add('forAndArrayPush(1, 2, 3)', function () {
  forAndArrayPush(1, 2, 3);
})
.add('forAndArraySet(1, 2, 3)', function () {
  forAndArraySet(1, 2, 3);
})
.add('newArrayArgumentsLength(1, 2, 3)', function () {
  newArrayArgumentsLength(1, 2, 3);
})

.add('slice(1, 2, 3, 4, 5)', function () {
  slice(1, 2, 3, 4, 5);
})
.add('slice2(1, 2, 3, 4, 5)', function () {
  slice2(1, 2, 3, 4, 5);
})
.add('forAndArrayPush(1, 2, 3, 4, 5)', function () {
  forAndArrayPush(1, 2, 3, 4, 5);
})
.add('forAndArraySet(1, 2, 3, 4, 5)', function () {
  forAndArraySet(1, 2, 3, 4, 5);
})
.add('newArrayArgumentsLength(1, 2, 3, 4, 5)', function () {
  newArrayArgumentsLength(1, 2, 3, 4, 5);
})

.add('slice(1, 2, 3, 4, 5, 6, 7, 8, 9, 10)', function () {
  slice(1, 2, 3, 4, 5, 6, 7, 8, 9, 10);
})
.add('slice2(1, 2, 3, 4, 5, 6, 7, 8, 9, 10)', function () {
  slice2(1, 2, 3, 4, 5, 6, 7, 8, 9, 10);
})
.add('forAndArrayPush(1, 2, 3, 4, 5, 6, 7, 8, 9, 10)', function () {
  forAndArrayPush(1, 2, 3, 4, 5, 6, 7, 8, 9, 10);
})
.add('forAndArraySet(1, 2, 3, 4, 5, 6, 7, 8, 9, 10)', function () {
  forAndArraySet(1, 2, 3, 4, 5, 6, 7, 8, 9, 10);
})
.add('newArrayArgumentsLength(1, 2, 3, 4, 5, 6, 7, 8, 9, 10)', function () {
  newArrayArgumentsLength(1, 2, 3, 4, 5, 6, 7, 8, 9, 10);
})

// add listeners
.on('cycle', function (event, bench) {
  console.log(String(bench));
})
.on('complete', function () {
  console.log('Fastest is ' + this.filter('fastest').pluck('name'));
})
.run({ async: true });