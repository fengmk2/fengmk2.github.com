/*!
 * ejs benchmark, tpl.js
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

module.exports = function (options) {
  return ejs.compile(options._with ? TPL_WITH_TRUE : TPL_WITH_FALSE, options);
};
