var Benchmark = require('benchmark');

var suite = new Benchmark.Suite();

suite
.add('Number()', function () {
  Number('123');
  Number('88888888888888888888');
  Number('8888888888888888888888888888888888888888');
})
.add('parseInt()', function () {
  parseInt('123', 10);
  parseInt('88888888888888888888', 10);
  parseInt('8888888888888888888888888888888888888888', 10);
})
.add('parseFloat()', function () {
  parseFloat('123');
  parseFloat('88888888888888888888');
  parseFloat('8888888888888888888888888888888888888888');
})
.on('cycle', function (event, bench) {
  console.log(String(bench));
})
.on('complete', function () {
  console.log('Fastest is ' + this.filter('fastest').pluck('name'));
})
.run({ async: true });