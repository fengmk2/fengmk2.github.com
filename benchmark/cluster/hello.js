var cluster = require('cluster');
var http = require('http');
var numCPUs = require('os').cpus().length * 2;

if (cluster.isMaster) {
  console.log('current: %s, none: %s, rr: %s', cluster.schedulingPolicy, cluster.SCHED_NONE, cluster.SCHED_RR);
  // Fork workers.
  for (var i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', function (worker, code, signal) {
    console.log('worker ' + worker.process.pid + ' died');
  });

  cluster.on('online', function (worker) {
    console.log("Yay, the worker#%d responded after it was forked", worker.process.pid);
  });
} else {
  // Workers can share any TCP connection
  // In this case its a HTTP server
  http.createServer(function (req, res) {
    var t = Math.random() * 5000;
    setTimeout(function () {
      res.writeHead(200);
      res.end(t + " hello world\n");
    }, t);
  }).listen(8000);
}
