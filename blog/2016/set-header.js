'use strict';

const OutgoingMessage = require('http').OutgoingMessage;

'use strict';

const Benchmark = require('benchmark');
const benchmarks = require('beautify-benchmark');
const suite = new Benchmark.Suite();

suite

.add('setHeader() normal', () => {
  const res = new OutgoingMessage();
  res.setHeader('X-Frame-Options1', 'X-Frame-Options1 value');
  res.setHeader('X-Frame-Options2', 'X-Frame-Options2 value');
  res.setHeader('X-Frame-Options3', 'X-Frame-Options3 value');
})

.add('setHeader() lower case', () => {
  const res = new OutgoingMessage();
  res.setHeader('x-frame-options1', 'X-Frame-Options1 value');
  res.setHeader('x-frame-options2', 'X-Frame-Options2 value');
  res.setHeader('x-frame-options3', 'X-Frame-Options3 value');
})

.on('cycle', event => {
  benchmarks.add(event.target);
})
.on('start', event => {
  console.log('\n  res.setHeader() Benchmark\n  node version: %s, date: %s\n  Starting...',
    process.version, Date());
})
.on('complete', () => {
  benchmarks.log();
})
.run({ 'async': false });
