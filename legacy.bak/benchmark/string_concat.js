var Benchmark = require('benchmark');

var datas = [];
for (var i = 0; i < 10; i++) {
  datas.push('foobarhaha');
}

function arrayJoin() {
  return datas.join(',');
}

function stringPlus() {
  var str = '';
  for (var i = 0; i < 10; i++) {
    str += datas[i];
  }
  return str;
}

var suite = new Benchmark.Suite();
var count = 0;
suite
.add('arrayJoin()', function () {
  arrayJoin();
  console.log(++count);
})
// .add('stringPlus()', function () {
//   stringPlus();
// })

// add listeners
.on('cycle', function (event, bench) {
  console.log(String(bench));
})
.on('complete', function () {
  console.log('Fastest is ' + this.filter('fastest').pluck('name'));
})
.run({ async: true });