var Benchmark = require('benchmark');
var suite = new Benchmark.Suite();

suite
.add('a += 1', function () {
  var a = 0;
  a += 1;
  a += 1;
  a += 1;
})
.add('a = a + 1', function () {
  var a = 0;
  a = a + 1;
  a = a + 1;
  a = a + 1;
})
.add('a++', function () {
  var a = 0;
  a++;
  a++;
  a++;
})
// add listeners
.on('cycle', function (event, bench) {
  console.log(String(bench));
})
.on('complete', function () {
  console.log('Fastest is ' + this.filter('fastest').pluck('name'));
})
.run({ async: true });

