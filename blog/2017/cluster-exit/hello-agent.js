const http = require('http');

http.createServer((req, res) => {
  res.writeHead(200);
  res.end('agent hello world\n');
}).listen(8001);

console.log(`agent ${process.pid} started`);

process.on('disconnect', () => {
  console.log(`agent ${process.pid} got disconnect event, connected: ${process.connected}`);
  process.exit(0);
});

process.on('exit', code => {
  console.log(`agent ${process.pid} exit with code: ${code}, connected: ${process.connected}`)
});
