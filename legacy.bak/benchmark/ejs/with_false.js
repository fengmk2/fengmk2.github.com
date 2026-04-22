/*!
 * ejs benchmark, with_false.js
 * Copyright(c) 2013 fengmk2 <fengmk2@gmail.com>
 * MIT Licensed
 */

"use strict";

/**
 * Module dependencies.
 */

var createRender = require('./tpl');
var render = createRender({_with: false});

var s = render({user: {name: 'fengmk2'}});
console.log(s);
