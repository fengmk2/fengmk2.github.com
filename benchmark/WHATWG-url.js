'use strict';

const URL = require('url').URL;
const Benchmark = require('benchmark');
const benchmarks = require('beautify-benchmark');
const path = require('path');

function hostname1(host) {
  if (!host) return '';
  return host.split(':')[0];
}

function hostnameFromURL(host) {
  if (!host) return '';
  return new URL(`http://${host}`).hostname;
}

const suite = new Benchmark.Suite();

console.log('hostname1(www.github.com:8080): %s', hostname1('www.github.com:8080'));
console.log('hostnameFromURL(www.github.com:8080): %s', hostnameFromURL('www.github.com:8080'));

// add tests
suite

.add('hostname1(www.github.com:8080)', function() {
  hostname1('www.github.com:8080')
})
.add('hostnameFromURL(www.github.com:8080)', function() {
  hostnameFromURL('www.github.com:8080')
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
