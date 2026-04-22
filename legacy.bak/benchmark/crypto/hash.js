/*!
 * benchmark - crypto/md5.js
 *
 * md5 benchmark
 * 
 * Copyright(c) 2012 fengmk2 <fengmk2@gmail.com>
 * MIT Licensed
 */

"use strict";

/**
 * Module dependencies.
 */

var crypto = require('crypto');
var Benchmark = require('benchmark');

function hash(s, hashType) {
  var h = crypto.createHash(hashType);
  h.update(s);
  return h.digest('hex');
}

var s = '1234567890';
var b = new Buffer(s);
var ls = '1234567890f00中文你好水电费收到了发及时两地分居三闾大夫是浪费塑料袋房间了房间了违反了叫我来访问法上来的封建时代雷锋精神老地方';
var lb = new Buffer(ls);

console.log(hash(s, 'md5'));
console.log(hash(b, 'md5'));
console.log(hash('1234567890', 'sha1'));
console.log(hash(b, 'sha1'));

console.log(hash(ls, 'sha1'), hash(lb, 'sha1'));

var suite = new Benchmark.Suite();

suite.add('md5 with string', function () {
  hash(s, 'md5');
}).add('md5 with buffer', function () {
  hash(b, 'md5');
}).add('md5 with long string', function () {
  hash(ls, 'md5');
}).add('md5 with long buffer', function () {
  hash(lb, 'md5');
})

.add('sha1 with string', function () {
  hash(s, 'sha1');
}).add('sha1 with buffer', function () {
  hash(b, 'sha1');
}).add('sha1 with long string', function () {
  hash(ls, 'sha1');
}).add('sha1 with long buffer', function () {
  hash(lb, 'sha1');
});

suite.on('cycle', function (event, bench) {
  console.log(String(bench));
})
.on('complete', function () {
  console.log('Fastest is ' + this.filter('fastest').pluck('name'));
})
.run({ async: true });
