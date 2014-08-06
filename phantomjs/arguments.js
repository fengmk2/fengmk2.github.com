var system = require('system');
phantom.args.forEach(function (arg, i) {
  console.log(i + ': ' + arg);
});
console.log('system.args:');
system.args.forEach(function (arg, i) {
  console.log(i + ': ' + arg);
});
phantom.exit();