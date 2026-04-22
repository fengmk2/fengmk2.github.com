// Abstract hot traces into functions

var Benchmark = require('benchmark');

var N = 10;
var suite = new Benchmark.Suite();

var foo = function () {
  for (var i = 0; i < N; i++) {
    var a = {};
  }
};

suite

.add('normal', function () {
  try {
    for (var i = 0; i < N; i++) {
      var a = {};
    }
  } catch (e) {

  }
  
})

.add('use functions', function () {
  try {
    foo();
  } catch (e) {

  }
})

// add listeners
.on('cycle', function (event) {
  console.log(String(event.target));
})
.on('complete', function () {
  console.log('Fastest is ' + this.filter('fastest').pluck('name'));
})
.run({ async: true });