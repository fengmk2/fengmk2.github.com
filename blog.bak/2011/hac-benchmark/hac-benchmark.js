var parse = require('querystring').parse;
var fs = require('fs');

var data = fs.readFileSync('./hac-attack-data.txt').toString();
var data_safe = fs.readFileSync('./hac-attack-safe-data.txt').toString();

var keys = data.split('&');
var string_keys = fs.readFileSync('./hac-attack-strdata.txt', 'utf-8').split('&');
var safe_keys = data_safe.split('&');

var keysCounts = [];
var attackResut = [];
var attackStringResut = [];
var safeResut = [];

for (var i = 100, l = keys.length; i < l; i += 1000) {
  keysCounts.push(i);

  // inter keys
  var s = keys.slice(0, i).join('&');
  var start = new Date();
  parse(s);
  var attackMS = new Date() - start;
  attackResut.push(attackMS)

  // string keys
  s = string_keys.slice(0, i).join('&');
  start = new Date();
  parse(s);
  var attackStringMS = new Date() - start;
  attackStringResut.push(attackStringMS)
  
  // safe 

  s = safe_keys.slice(0, i).join('&');
  start = new Date();
  parse(s);
  var safeMS = new Date() - start;
  safeResut.push(safeMS);
  console.log('["%s", %d, %d, %d],', i, safeMS, attackMS, attackStringMS);

  if (i === 100) {
    i = 0;
  }

  // console.log('%s keys, Safe %s ms, Attack %s ms', i, safeMS, attackMS);
}



// var d = parse(data);
// console.log('Attack data %s ms', new Date() - start);

// start = new Date();
// var ds = parse(data_safe);
// console.log('Safe data %s ms', new Date() - start);

// console.log('%s, %s', Object.keys(d).length, Object.keys(ds).length);