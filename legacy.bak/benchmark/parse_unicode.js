/**
 * Transform unicode codes to unicode string.
 *
 * e.g.: '\\u6765\\u662F\\u7F18' => '来是缘' === '\u6765\u662F\u7F18'
 * 
 * @param {String} val
 * @return {String}
 */
var jsonParse = function (val) {
  if (!val) {
    return val;
  }
  try {
    val = JSON.parse('"' + val + '"');
  } catch (e) {
  }
  return val;
};

// unescape(nickCookie.replace(/\\u/g, '%u'));

var unescapeParse = function (val) {
  if (!val) {
    return val;
  }
  try {
    val = unescape(val.replace(/\\u/g, '%u'));
  } catch (e) {
  }
  return val;
};

console.log(jsonParse('\\u6765\\u662F\\u7F18\\u6765\\u662F\\u7F18\\u6765\\u662F\\u7F18'));
console.log(unescapeParse('\\u6765\\u662F\\u7F18\\u6765\\u662F\\u7F18\\u6765\\u662F\\u7F18'));

var Benchmark = require('benchmark');

var suite = new Benchmark.Suite();
suite

.add('jsonParse()', function () {
  jsonParse('\\u6765\\u662F\\u7F18');
  jsonParse('\\u6765\\u662F');
  jsonParse('\\u6765');
  jsonParse('rainfeng2005');
  jsonParse('');
  jsonParse('\\u6765\\u662F\\u7F18\\u6765\\u662F\\u7F18\\u6765\\u662F\\u7F18');
})

.add('unescapeParse()', function () {
  unescapeParse('\\u6765\\u662F\\u7F18');
  unescapeParse('\\u6765\\u662F');
  unescapeParse('\\u6765');
  unescapeParse('rainfeng2005');
  unescapeParse('');
  unescapeParse('\\u6765\\u662F\\u7F18\\u6765\\u662F\\u7F18\\u6765\\u662F\\u7F18');
})

// add listeners
.on('cycle', function (event, bench) {
  console.log(String(bench));
})
.on('complete', function () {
  console.log('Fastest is ' + this.filter('fastest').pluck('name'));
})
.run({async: true});