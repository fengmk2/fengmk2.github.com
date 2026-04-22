var cluster = require('cluster')
  , http = require('http');
var server = http.createServer(function(req, res) {
    res.end('Hello World');
});
cluster(server)
.set('workers', 4)
.use(cluster.stats())
.listen(8080);