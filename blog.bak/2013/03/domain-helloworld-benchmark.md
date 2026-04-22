# nodejs domain module hello world and benchmark

[domain](http://nodejs.org/docs/v0.8.21/api/domain.html#domain_domain): Domains provide a way to handle multiple different IO operations as a single group. 

## Example: [http hello world using `domain`](https://gist.github.com/fengmk2/5079492)

```js
var domain = require('domain');
var http = require('http');
 
var domainMiddleware = function (req, res, next, errorHandle) {
  var d = domain.create();
  d.once('error', errorHandle);
  d.run(next);
};
 
var app = http.createServer(function (req, res) {
  domainMiddleware(req, res, function () {
    // normal response
    if (req.url === '/error') {
      process.nextTick(function () {
        var a = null;
        a.foo();
      });
      return;
    }
    res.end('hello domain');
  }, function (err) {
    // sending err response
    res.statusCode = 500;
    res.end(err.stack);
  });
});
 
app.listen(1984);
```

## Benchmark

Results: QPS reduced by **8%** 

### hello world

```js
var appNoDomain = http.createServer(function (req, res) {
  if (req.url === '/error') {
    process.nextTick(function () {
      var a = null;
      a.foo();
    });
    return;
  }
  res.end('hello domain');
});
appNoDomain.listen(1985);
```

```bash
$ siege -c 100 -b -t 10s http://127.0.0.1:1985/
```

```bash
$ siege -c 100 -b -t 10s http://127.0.0.1:1985/
** SIEGE 2.72
** Preparing 100 concurrent users for battle.
The server is now under siege...
Lifting the server siege...      done.

Transactions:          73806 hits
Availability:         100.00 %
Elapsed time:           9.68 secs
Data transferred:         0.84 MB
Response time:            0.01 secs
Transaction rate:      7624.59 trans/sec
Throughput:           0.09 MB/sec
Concurrency:           99.69
Successful transactions:       73806
Failed transactions:             0
Longest transaction:          0.05
Shortest transaction:         0.00
```

### hello world with `domain`

```bash
$ siege -c 100 -b -t 10s http://127.0.0.1:1984/
```

```bash
$ siege -c 100 -b -t 10s http://127.0.0.1:1984/
** SIEGE 2.72
** Preparing 100 concurrent users for battle.
The server is now under siege...
Lifting the server siege...      done.

Transactions:          70759 hits
Availability:         100.00 %
Elapsed time:          10.01 secs
Data transferred:         0.81 MB
Response time:            0.01 secs
Transaction rate:      7068.83 trans/sec
Throughput:           0.08 MB/sec
Concurrency:           98.86
Successful transactions:       70759
Failed transactions:             0
Longest transaction:          0.10
Shortest transaction:         0.00
```
