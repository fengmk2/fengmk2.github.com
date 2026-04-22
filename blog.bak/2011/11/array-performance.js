
var n = 1000000;

var start = new Date()
  , array = [];
for(var i = 0; i < n; i++) {
    array[array.length] = i;
}
console.log('array[array.length] = i : ' + (new Date() - start) + ' ms');

var start = new Date()
  , array = [];
for(var i = 0; i < n; i++) {
  array.push(i);
}
console.log('array.push(i) : ' + (new Date() - start) + ' ms');

var start = new Date()
, array = [];
for(var i = 0; i < n; i++) {
array[i] = i;
}
console.log('array[i] = i : ' + (new Date() - start) + ' ms');