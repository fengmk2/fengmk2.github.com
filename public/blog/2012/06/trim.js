/*!
 * trim benchmark
 * 
 * trim1 - trim12: http://stevenlevithan.com/demo/trim.cfm;
 * trim13: http://cnodejs.org/topic/4fc72e7f8be5d070120ce015
 * 
 * Copyright(c) 2012 fengmk2 <fengmk2@gmail.com>
 * MIT Licensed
 */

/**
 * Module dependencies.
 */

exports.trim0 = function trim0(str) {
  return str.trim();
};

exports.trim1 = function trim1(str) {
  return str.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
};

exports.trim2 = function trim2(str) {
  return str.replace(/^\s+/, '').replace(/\s+$/, '');
};

exports.trim3 = function trim3(str) {
  return str.substring(Math.max(str.search(/\S/), 0), str.search(/\S\s*$/) + 1);
};

exports.trim4 = function trim4(str) {
  return str.replace(/^\s+|\s+$/g, '');
};

exports.trim5 = function trim5(str) {
  str = str.match(/\S+(?:\s+\S+)*/);
  return str ? str[0] : '';
};

exports.trim6 = function trim6(str) {
  return str.replace(/^\s*(\S*(\s+\S+)*)\s*$/, '$1');
};

exports.trim7 = function trim7(str) {
  return str.replace(/^\s*(\S*(?:\s+\S+)*)\s*$/, '$1');
};

exports.trim8 = function trim8(str) {
  return str.replace(/^\s*((?:[\S\s]*\S)?)\s*$/, '$1');
};

exports.trim9 = function trim9(str) {
  return str.replace(/^\s*([\S\s]*?)\s*$/, '$1');
};

exports.trim10 = function trim10(str) {
  var whitespace = ' \n\r\t\f\x0b\xa0\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u200b\u2028\u2029\u3000';
  for (var i = 0; i < str.length; i++) {
    if (whitespace.indexOf(str.charAt(i)) === -1) {
      str = str.substring(i);
      break;
    }
  }
  for (i = str.length - 1; i >= 0; i--) {
    if (whitespace.indexOf(str.charAt(i)) === -1) {
      str = str.substring(0, i + 1);
      break;
    }
  }
  return whitespace.indexOf(str.charAt(0)) === -1 ? str : '';
};

exports.trim11 = function trim11(str) {
  str = str.replace(/^\s+/, '');
  for (var i = str.length - 1; i >= 0; i--) {
    if (/\S/.test(str.charAt(i))) {
      str = str.substring(0, i + 1);
      break;
    }
  }
  return str;
};

exports.trim12 = function trim12(str) {
  str = str.replace(/^\s\s*/, "");
  var ws = /\s/;
  var i = str.length;
  while (ws.test(str.charAt(--i)));
  return str.slice(0, i + 1);
};

exports.trim13 = function trim13(str) {
  return str.replace(/^\s+/, '').split('').reverse().join('').replace(/^\s+/, '').split('').reverse().join('');
};

var fs = require('fs');
var text = fs.readFileSync(__dirname + '/text.txt', 'utf-8');
var assert = require('assert');

var runTimes = parseInt(process.argv[2], 10) || 1000;
console.log('%s cycles:', runTimes);

for (var i = 0; i < 14; i++) {
  var method = 'trim' + i;

  assert.strictEqual(exports[method](text), text.trim());

  var start = new Date();
  var n = runTimes;
  while (n--) {
    exports[method](text);
  }
  console.log('%s %d ms', method, new Date() - start);
}

