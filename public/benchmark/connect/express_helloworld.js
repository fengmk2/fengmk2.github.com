var express = require('express');
var app = express.createServer();

app.get('/', function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.send('Hello World');
});

app.listen(8124);

console.log('Server running at http://127.0.0.1:8124/');