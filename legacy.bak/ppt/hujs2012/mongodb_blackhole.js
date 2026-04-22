var mongodb = require('mongodb');
var count = 0;
var blackhole = require('net').createServer(function (c) {
  console.log('new connection: ' + count++);
  c.end();
});
blackhole.listen(24008, function () {
  var replSet = new mongodb.ReplSetServers([ 
    new mongodb.Server('127.0.0.1', 24008, {auto_reconnect: true})
  ]);
  var client = new mongodb.Db('test', replSet);
  client.open(function (err, p_client) {
    console.log(err);
  });
});