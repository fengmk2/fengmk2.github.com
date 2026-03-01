var profiler = require('chrome-cpu-profiler');

var slice = Array.p

function foo() {
  return [].slice.call(arguments);
}

profiler.startProfiling('slice');
for (var i = 0; i < 1000000; i++) {
  foo(1, 2, 3, 4);
}

var data = profiler.stopProfiling('slice');
profiler.writeFile(data, function (err) {
  if (err) {
    throw err;
  }
});
