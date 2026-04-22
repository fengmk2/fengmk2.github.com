var Benchmark = require('benchmark');
var microtime = require('microtime');
var microtime2 = require('microtime2');

var suite = new Benchmark.Suite();

var start = new Date();
var startNow = Date.now();
var startMic = microtime.now();

suite
.add('Date.now()', function () {
  var n = Date.now();
})
.add('Date.now() - Date.now()', function () {
  var diff1 = Date.now() - Date.now();
})
.add('Date.now() - startNow', function () {
  var diff1 = Date.now() - startNow;
})

.add('new Date()', function () {
  var d = new Date();
})
.add('new Date() - new Date()', function () {
  var diff1 = new Date() - new Date();
})
.add('new Date() - start', function () {
  var diff1 = new Date() - start;
})

.add('microtime.now()', function () {
  var n = microtime.now();
})
.add('microtime.now() - microtime.now()', function () {
  var diff2 = microtime.now() - microtime.now();
})
.add('microtime.now() - startMic', function () {
  var diff2 = microtime.now() - startMic;
})

.add('microtime2.now()', function () {
  var n = microtime2.now();
})
.add('microtime2.now() - microtime2.now()', function () {
  var diff2 = microtime2.now() - microtime2.now();
})
.add('microtime2.now() - startMic', function () {
  var diff2 = microtime2.now() - startMic;
})

.add('process.uptime() - process.uptime()', function () {
  var diff3 = process.uptime() - process.uptime();
})
.add('process.hrtime() - process.hrtime()', function () {
  var t = process.hrtime();
  var diff4 = process.hrtime(t);
})
// add listeners
.on('cycle', function (event) {
  console.log(String(event.target));
})
.on('complete', function () {
  console.log('Fastest is ' + this.filter('fastest').pluck('name'));
})
.run();