var Benchmark = require('benchmark');

var suite = new Benchmark.Suite();

var datas20 = [];
for (var i = 0; i < 20; i++) {
  datas20.push(i);
}

var datas200 = [];
for (var i = 0; i < 200; i++) {
  datas200.push(i);
}

var datas500 = [];
for (var i = 0; i < 500; i++) {
  datas500.push(i);
}

suite
.add('for (var i = 0; i < datas20.length; i++)', function () {
  var n = 0;
  for (var i = 0; i < datas20.length; i++) {
    n += datas20[i];
  }
})
.add('datas20.forEach()', function () {
  var n = 0;
  datas20.forEach(function (i) {
    n += datas20[i];
  });
})
.add('for (var i = 0; i < datas200.length; i++)', function () {
  var n = 0;
  for (var i = 0; i < datas200.length; i++) {
    n += datas200[i];
  }
})
.add('datas200.forEach()', function () {
  var n = 0;
  datas200.forEach(function (i) {
    n += datas200[i];
  });
})
.add('for (var i = 0; i < datas500.length; i++)', function () {
  var n = 0;
  for (var i = 0; i < datas500.length; i++) {
    n += datas500[i];
  }
})
.add('datas500.forEach()', function () {
  var n = 0;
  datas500.forEach(function (i) {
    n += datas500[i];
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
