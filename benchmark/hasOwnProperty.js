var Benchmark = require('benchmark');

var suite = new Benchmark.Suite();

var user = {
  id: 123,
  name: 'foo',
  created: new Date()
};

suite
.add('hasOwnProperty()', function () {
  var result = user.hasOwnProperty('name');
  var result2 = user.hasOwnProperty('nameNotExists');
})
.add('key in object', function () {
  var result = 'name' in user;
  var result2 = 'nameNotExists' in user;
})
.add('object[key]', function () {
  var result = user['name'] !== undefined;
  var result2 = user['nameNotExists'] !== undefined;
})
.add('object.key', function () {
  var result = user.name !== undefined;
  var result2 = user.nameNotExists !== undefined;
})
.on('cycle', function (event, bench) {
  console.log(String(bench));
})
.on('complete', function () {
  console.log('Fastest is ' + this.filter('fastest').pluck('name'));
})
.run({ async: true });