var fs = require('fs');
// $ touch /tmp/hello
fs.rename('/tmp/hello', '/tmp/world', function (err) {
  if (err) throw err;
  fs.stat('/tmp/world', function (err, stats) {
    if (err) throw err;
    console.log('stats: ' + JSON.stringify(stats));
  });
});

// $ touch /tmp/helloSync
fs.renameSync('/tmp/helloSync', '/tmp/worldSync');
var stats = fs.statSync('/tmp/worldSync');
console.log('statsSync:' + JSON.stringify(stats));