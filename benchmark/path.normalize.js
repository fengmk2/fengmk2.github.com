'use strict';

const Benchmark = require('benchmark');
const benchmarks = require('beautify-benchmark');
const path = require('path');

function normalize2(p) {
  return p.replace(/\.\.\//g, '')
    .replace(/\.\//g, '');
}

const judgeString = '__' + Math.floor(Math.random() * 16777215).toString(16) + '__';;
function judgeStringJoin(p) {
  return path.join(judgeString, p).substring(judgeString.length);
}

const suite = new Benchmark.Suite();
const longpath = '/%2E%2E/%2E%2E/%2E%2E/%2E%2E/%2E%2E/%2E%2E/%2E%2E/%2E%2E/%2E%2E/%2E%2E/%2E%2E/%2E%2E/etc/passwd';
console.log('path.normalize(decodeURIComponent(%j)) => %j',
  longpath,
  path.normalize(decodeURIComponent(longpath)));
console.log('normalize2(decodeURIComponent(%j)) => %j',
  longpath,
  normalize2(decodeURIComponent(longpath)));
console.log('path.normalize(%j) => %j',
  longpath,
  path.normalize(longpath));
console.log('judgeStringJoin(decodeURIComponent(%j)) => %j',
  longpath,
  judgeStringJoin(decodeURIComponent(longpath)));

// add tests
suite

.add('path.normalize(longpath)', function() {
  path.normalize(longpath);
})
.add('path.normalize(decodeURIComponent(longpath))', function() {
  path.normalize(decodeURIComponent(longpath));
})
.add('normalize2(decodeURIComponent(longpath))', function() {
  normalize2(decodeURIComponent(longpath));
})
.add('judgeStringJoin(decodeURIComponent(longpath))', function() {
  judgeStringJoin(decodeURIComponent(longpath));
})

// add listeners
.on('cycle', function(event) {
  benchmarks.add(event.target);
})
.on('start', function () {
  console.log('\n  node version: %s, date: %s\n  Starting...', process.version, Date());
})
.on('complete', function() {
  benchmarks.log();
})
// run async
.run({ 'async': false });
