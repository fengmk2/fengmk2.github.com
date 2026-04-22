/*!
 * performance/crypto.js 
 * Copyright(c) 2013 fengmk2 <fengmk2@gmail.com>
 * MIT Licensed
 */

"use strict";

/**
 * Module dependencies.
 */

var crypto = require('crypto');

console.log('node %s', process.version);

var count = 100000;

var hashTypes = ['md5', 'sha1', 'sha256', 'sha512'];

hashTypes.forEach(function (name) {
  console.time(name);
  for (var i = 0; i < count; i++) {
    crypto.createHash(name).update(i + '').digest();
  }
  console.timeEnd(name);
});

