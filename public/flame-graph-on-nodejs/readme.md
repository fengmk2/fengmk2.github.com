# Create a nodejs application Flame Graph

## Build `with-dtrace`

## Profile the `hello world` http server

`server.js`:

```js
var http = require('http');
http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('Hello World\n');
}).listen(1337, '127.0.0.1');
console.log('Server running at http://127.0.0.1:1337/');
```

```bash
$ node server.js
```

### benchmark: ab

```bash
$ ab -n 1000000 -c 10 -k 'http://127.0.0.1:1337/'
```

## Dtrace

`12345` replace to your node process id.

```
$ sudo dtrace -n 'profile-997/pid == $YOURPID/{ @[jstack(80, 8192)] = count(); }' -c "sleep 30" > dtrace.out
```

##

```bash
$ npm install -g stackvis
# then use stackvis to convert the DTrace output to a flamegraph:
$ stackvis dtrace flamegraph-svg < stacks.out > stacks.svg
$ stackvis < dtrace.out > flamegraph.htm
```
