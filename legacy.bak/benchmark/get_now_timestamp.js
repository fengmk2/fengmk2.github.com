var Benchmark = require('benchmark');

var suite = new Benchmark.Suite();

console.log(Date.now(), new Date().getTime(), new Date().valueOf(), new Date() - 0);

suite
.add('Date.now()', function () {
  var t = Date.now();
})
.add('new Date().getTime()', function () {
  var t = new Date().getTime();
})
.add('new Date().valueOf()', function () {
  var t = new Date().valueOf();
})
.add('new Date() - 0', function () {
  var t = new Date() - 0;
})
.on('cycle', function (event, bench) {
  console.log(String(bench));
})
.on('complete', function () {
  console.log('Fastest is ' + this.filter('fastest').pluck('name'));
})
.run({ async: true });