// http://jsperf.com/parseint-vs-unary-operator/2
// http://jsperf.com/parseint-vs-unary-operator/3

var Benchmark = require('benchmark');

var suite = new Benchmark.Suite();
suite

.add('parseInt(x, base)', function () {
  parseInt('', 10);
  parseInt('123', 10);
  parseInt('abc', 10);
  parseInt('123abc', 10);
  parseInt('+123123123', 10);
  parseInt('-123123123', 10);
})

.add('parseInt(x)', function () {
  parseInt('');
  parseInt('123');
  parseInt('abc');
  parseInt('123abc');
  parseInt('+123123123');
  parseInt('-123123123');
})

.add('+str', function () {
  +'';
  +'123';
  +'abc';
  +'123abc';
  +'+123123123';
  +'-123123123';
})

.add('Number(x)', function () {
  Number('');
  Number('123');
  Number('abc');
  Number('123abc');
  Number('+123123123');
  Number('-123123123');
})

.add('s >> 0', function () {
  '' >> 0;
  '123' >> 0;
  'abc' >> 0;
  '123abc' >> 0;
  '+123123123' >> 0;
  '-123123123' >> 0;
})

.add('Math.floor(x)', function () {
  Math.floor('');
  Math.floor('123');
  Math.floor('abc');
  Math.floor('123abc');
  Math.floor('+123123123');
  Math.floor('-123123123');
})

// add listeners
.on('cycle', function (event, bench) {
  console.log(String(bench));
})
.on('complete', function () {
  console.log('Fastest is ' + this.filter('fastest').pluck('name'));
})
.run({async: true});