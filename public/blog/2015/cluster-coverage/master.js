/**!
 * master process
 *
 * Copyright(c) fengmk2 and other contributors.
 * MIT Licensed
 *
 * Authors:
 *   fengmk2 <m@fengmk2.com> (http://fengmk2.com)
 */

'use strict';

/**
 * Module dependencies.
 */

const cluster = require('cluster');
const path = require('path');
const childprocess = require('child_process');

const workerPath = path.join(__dirname, 'worker.js');
const monitorPath = path.join(__dirname, 'monitor.js');
let monitor;

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

  monitor = childprocess.fork('./node_modules/.bin/istanbul', [
    'cover',
    '--report', 'none',
    '--print', 'none',
    '--include-all-sources',
    '--include-pid',
    monitorPath,
  ], {
    execArgv: process.execArgv.concat(['--debug-port=5856'])
  });

} else {
  cluster.setupMaster({
    exec: workerPath,
  });

  monitor = childprocess.fork(monitorPath, [], {
    // avoid monitor listen 5858 port
    // monitor: 5856
    // master: 5857
    // worker0: 5858
    // worker1: 5859
    // ...
    execArgv: process.execArgv.concat(['--debug-port=5856'])
  });
}

console.log('[master] new monitor:%s start', monitor.pid);
monitor.on('message', function (msg) {
  console.log('[master] got message %j', msg);
});

// fork two workers
cluster.fork();
cluster.fork();

exports.monitor = monitor;
