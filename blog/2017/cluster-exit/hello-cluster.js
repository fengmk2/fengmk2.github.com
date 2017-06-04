const cluster = require('cluster');
const http = require('http');
const numCPUs = require('os').cpus().length;
const childProcess = require('child_process');
const path = require('path');

if (cluster.isMaster) {
  console.log(`master ${process.pid} is running`);

  // Fork workers.
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`);
  });

  process.on('exit', code => {
    console.log(`master ${process.pid} exit with code: ${code}`);
  });

  childProcess.fork(path.join(__dirname, 'hello-agent.js'));
} else {
  // Workers can share any TCP connection
  // In this case it is an HTTP server
  http.createServer((req, res) => {
    res.writeHead(200);
    res.end('hello world\n');
  }).listen(8000);

  console.log(`worker ${process.pid} started`);

  cluster.worker.on('disconnect', () => {
    console.log(`worker ${process.pid} got disconnect event`);
  });
  process.on('exit', code => {
    console.log(`worker ${process.pid} exit with code: ${code}, exitedAfterDisconnect: ${cluster.worker.exitedAfterDisconnect}`)
  });
}
