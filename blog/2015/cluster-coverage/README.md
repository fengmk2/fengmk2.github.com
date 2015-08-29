# `cluster` code coverage with istanbul

[istanbul] is already supported [Multiple Process Coverage](https://github.com/gotwarlost/istanbul/blob/master/README.md#multiple-process-usage).

I want to show you how to create code coverage using [istanbul].

### master.js

```js
const cluster = require('cluster');
const path = require('path');

const workerPath = path.join(__dirname, 'worker.js');

// setup cluster if running with istanbul coverage
if (process.env.running_under_istanbul) {
  // use coverage for forked process
  // disabled reporting and output for child process
  // enable pid in child process coverage filename
  cluster.setupMaster({
    exec: './node_modules/.bin/istanbul',
    args: [
      'cover',
      '--report', 'none',
      '--print', 'none',
      '--include-all-sources',
      '--include-pid',
      workerPath, '--'
    ]
  });
} else {
  cluster.setupMaster({
    exec: workerPath,
  });
}

// fork two workers
cluster.fork();
cluster.fork();
```

### worker.js

```js
const koa = require('koa');

const app = koa();

app.use(function* () {
  if (this.query.uid) {
    return this.body = {
      uid: this.query.uid,
    };
  }

  this.status = 403;
  this.body = {
    error: 'please login first'
  };
});

app.listen(1984);
console.log('[%s] start listening on 1984', process.pid);
```

### test

Run the unittest and create coverage report

```js
$ npm run cov

> cluster-coverage@ cov /Users/mk2/git/fengmk2.github.com/blog/2015/cluster-coverage
> npm run clean && npm run test-cov && istanbul report


> cluster-coverage@ clean /Users/mk2/git/fengmk2.github.com/blog/2015/cluster-coverage
> rm -rf coverage


> cluster-coverage@ test-cov /Users/mk2/git/fengmk2.github.com/blog/2015/cluster-coverage
> istanbul cover --include-all-sources node_modules/.bin/_mocha -- --check-leaks test/*.test.js

> istanbul report
```

See the [cluster-coverage report](./coverage/lcov-report/index.html)

![](http://ww3.sinaimg.cn/large/61c56ebcjw1evjbdbyfgjj20sr06b407.jpg)


[istanbul]: https://github.com/gotwarlost/istanbul
