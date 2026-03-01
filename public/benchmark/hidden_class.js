
var Benchmark = require('benchmark');

var suite = new Benchmark.Suite();

function Foo() {}

function FasterFoo() {
  this.name = 'name';
  this.age = 100;
}

suite.add('out of constructor functions', function () {
  var b = new Foo();
  b.name = 'name';
  b.age = 100;
}).add('Initialize all object members in constructor functions', function () {
  var b = new FasterFoo();
});

suite.on('cycle', function (event, bench) {
  console.log(String(bench));
})
.on('complete', function () {
  console.log('Fastest is ' + this.filter('fastest').pluck('name'));
})
.run({ async: true });
