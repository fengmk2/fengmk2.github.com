/*!
 * ejs benchmark, options_with.js
 * Copyright(c) 2013 fengmk2 <fengmk2@gmail.com>
 * MIT Licensed
 */

"use strict";

/**
 * Module dependencies.
 */

var ejs = require('ejs');
var TPL_WITH_TRUE = '\
<% if (user) { %>\
  <h2>with_true: <%= user.name %></h2>\
<% } %>';

var TPL_WITH_FALSE = '\
<% if (locals.user) { %>\
  <h2>with_false: <%= locals.user.name %></h2>\
<% } %>';

function createRender(options) {
  return ejs.compile(options._with ? TPL_WITH_TRUE : TPL_WITH_FALSE, options);
}

var renderWithFalse = createRender({_with: false, debug: false});
console.log('\n--------------------------------------------------------\n');
var renderWithTrue = createRender({_with: true, debug: false});

var s = renderWithFalse({user: {name: 'fengmk2'}});
console.log('_with: false', s);

s = renderWithTrue({user: {name: 'fengmk2'}});
console.log('_with: true', s);

var Benchmark = require('benchmark');

var suite = new Benchmark.Suite();

suite.add('options._with = false', function () {
  renderWithFalse({user: {name: 'fengmk2'}});
}).add('options._with = true', function () {
  renderWithTrue({user: {name: 'fengmk2'}});
});

suite.on('cycle', function (event) {
  console.log(String(event.target));
})
.on('complete', function () {
  console.log('Fastest is ' + this.filter('fastest').pluck('name'));
})
.run({ async: true });
