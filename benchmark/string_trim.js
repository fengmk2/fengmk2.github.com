var trimRegexp = function (s) {  
  return s.replace(/^\s+|\s+$/g, '');  
};

var trimChunge = function (str) {
  var m = str.length;
  for (var i = 0; i < m; i++) {
    if (str.charCodeAt(i) > 32) {
      break;
    }
  }

  for (var j = m - 1; j > i; j--) {
    if (str.charCodeAt(j) > 32) {
      break;
    }
  }

  return str.slice(i, j + 1);
};

var trimSubstring = function (str) {
  var m = str.length;
  for (var i = 0; i < m; i++) {
    if (str.charCodeAt(i) > 32) {
      break;
    }
  }

  for (var j = m - 1; j > i; j--) {
    if (str.charCodeAt(j) > 32) {
      break;
    }
  }

  return str.substring(i, j + 1);
};

var trimChungeNoIf = function (str) {
  var m = str.length;
  for (var i = 0; str.charCodeAt(i) <= 32 && i < m; i++) {}

  for (var j = m - 1; str.charCodeAt(j) <= 32 &&  j > i; j--) {}

  return str.substring(i, j + 1);
};

var trimChungeNoIf2 = function (str) {
  var m = str.length;
  for (var i = 0; str.charCodeAt(i) < 33 && i < m; i++) {}

  for (var j = m - 1; str.charCodeAt(j) < 33 &&  j > i; j--) {}

  return str.substring(i, j + 1);
};

var orig = "   foo  ";

console.log('%j, %j, %j, %j, %j, %j', 
  trimRegexp(orig), trimChunge(orig), trimSubstring(orig), 
  trimChungeNoIf(orig), trimChungeNoIf2(orig), orig.trim());

var Benchmark = require('benchmark');

var suite = new Benchmark.Suite();
var count = 0;
suite
.add('trimRegexp()', function () {
  trimRegexp(orig);
})
.add('trimChunge()', function () {
  trimChunge(orig);
})
.add('trimSubstring()', function () {
  trimSubstring(orig);
})
.add('trimChungeNoIf()', function () {
  trimChungeNoIf(orig);
})
.add('trimChungeNoIf2()', function () {
  trimChungeNoIf2(orig);
})
.add('String.prototype.trim()', function () {
  orig.trim();
})

// add listeners
.on('cycle', function (event, bench) {
  console.log(String(bench));
})
.on('complete', function () {
  console.log('Fastest is ' + this.filter('fastest').pluck('name'));
})
.run({ async: true });