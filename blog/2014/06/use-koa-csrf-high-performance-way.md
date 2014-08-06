# Use [koa-csrf] in high performance way

If you're using [koa-csrf] in [default middleware way](https://github.com/koajs/csrf#middleware),
it will kill your app performance.

`app.js` like this:

```js
var koa = require('koa');
var csrf = require('koa-csrf');
var session = require('koa-session');

var app = koa();
app.keys = ['session secret'];
app.use(session());
app.use(csrf());

app.use(function* () {
  this.body = 'hello csrf';
});

app.listen(1984);
```

Use [wrk] benchmark it:

```bash
$ wrk -t2 -c20 http://127.0.0.1:1984/
Running 10s test @ http://127.0.0.1:1984/
  2 threads and 20 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency     4.29ms    1.14ms  11.42ms   92.11%
    Req/Sec     2.51k   505.52     3.55k    62.38%
  48021 requests in 10.00s, 7.79MB read
Requests/sec:   4802.27
Transfer/sec:    797.25KB
```

## The high performance way

Separate `csrf define(app)` and `csrf middleware`. Dont `define(ctx)` on every request context.

`app_high.js` like this:

```js
var koa = require('koa');
var csrf = require('koa-csrf');
var session = require('koa-session');

var app = koa();
app.keys = ['session secret'];
app.use(session());
csrf(app);
app.use(csrf.middleware);

app.use(function* () {
  this.body = 'hello csrf';
});

app.listen(1985);
```

Use [wrk] benchmark it:

```bash
$ wrk -t2 -c20 http://127.0.0.1:1985/
Running 10s test @ http://127.0.0.1:1985/
  2 threads and 20 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency     3.67ms    2.19ms  15.65ms   93.55%
    Req/Sec     3.17k     0.87k    4.44k    75.50%
  59757 requests in 10.00s, 9.69MB read
Requests/sec:   5975.71
Transfer/sec:      0.97MB
```

## Love

Hope this help for you.

 [koa-csrf]: https://github.com/koajs/csrf
 [wrk]: https://github.com/wg/wrk
