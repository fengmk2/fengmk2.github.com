/*!
 * benchmark for "Duff's device".
 * 
 * Copyright(c) 2012 fengmk2 <fengmk2@gmail.com>
 * MIT Licensed
 */

/**
 * Module dependencies.
 */

var num = parseInt(process.argv[2]);
if (isNaN(num)) {
  console.log('Usage: %s %s {num}', process.argv[0], process.argv[1]);
  process.exit(1);
}

// init test datas
var datas = [];
for (var i = num; i--; ) {
  datas[i] = i * i;
}

function normal() {
  var results = [];
  function p(i, v) {
    results[i] = v * i;
  }
  var start = new Date();
  for (var i = num; i--; ) {
    p(i, datas[i]);
  }
  console.log('Normal use %sms', new Date() - start);
  return results;
}

function duffDevice() {
  var results = [];
  function p(i, v) {
    results[i] = v * i;
  }

  var start = new Date();
  var i = num % 8;
  var j = num - 1;
  while (i--) {
    p(j, datas[j--]);
  }

  i = Math.floor(num / 8);
  while (i--) {
    p(j, datas[j--]);
    p(j, datas[j--]);
    p(j, datas[j--]);
    p(j, datas[j--]);
    p(j, datas[j--]);
    p(j, datas[j--]);
    p(j, datas[j--]);
    p(j, datas[j--]);
  }
  console.log('Duff device use %sms', new Date() - start);
  return results;
}

normal();
duffDevice();
// // console.log(r1, r2)
// require('assert').equal(JSON.stringify(r1), JSON.stringify(r2));
