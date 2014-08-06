
var fs = require('fs');

var data = fs.readFileSync('./attack_str.js', 'utf-8');
var keys = data.match(/\'\w+\'/g)

var attackKeys = [];
for (var i = 0, l = keys.length; i < l; i++) {
  var key = keys[i];
  attackKeys.push(key.substring(1, key.length - 1) + '=');
}
console.log(attackKeys.length)