var Benchmark = require('benchmark');

var suite = new Benchmark.Suite();

var cycles = 200;
var datas = [];
for (var i = 0; i < cycles; i++) {
  datas.push(i);
}

suite
.add('var l = datas.length; for (var i = 0; i < l; i++)', function () {
  var n = 0;
  var l = datas.length;
  for (var i = 0; i < l; i++) {
    n += datas[i];
  }
})
.add('for (var i = 0, l = datas.length; i < l; i++)', function () {
  var n = 0;
  for (var i = 0, l = datas.length; i < l; i++) {
    n += datas[i];
  }
})
.add('for (var i = 0; i < datas.length; i++)', function () {
  var n = 0;
  for (var i = 0; i < datas.length; i++) {
    n += datas[i];
  }
})
.add('for (var i = l; i--;)', function () {
  var n = 0;
  for (var i = cycles; i--;) {
    n += datas[i];
  }
})
.add('while (i++ < l)', function () {
  var i = 0;
  var n = 0;
  while (i < cycles) {
    n += datas[i];
    i++;
  }
})
.add('while (i--)', function () {
  var i = cycles;
  var n = 0;
  while (i--) {
    n += datas[i];
  }
})
.add('Array.forEach()', function () {
  var n = 0;
  datas.forEach(function (i) {
    n += datas[i];
  });
})
// add listeners
.on('cycle', function (event) {
  console.log(String(event.target));
})
.on('complete', function () {
  console.log('Fastest is ' + this.filter('fastest').pluck('name'));
})
.run({ async: true });

