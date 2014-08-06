var foo = require('./foo');
var foo_cov = require('./foo_cov');
var foo_cov_utf8 = require('./foo_cov_utf8');

console.log('foo', foo.getName(), foo.getName() === '你好');
console.log('foo_cov', foo_cov.getName(), foo_cov.getName() === '你好');
console.log('foo_cov_utf8', foo_cov_utf8.getName(), foo_cov_utf8.getName() === '你好');