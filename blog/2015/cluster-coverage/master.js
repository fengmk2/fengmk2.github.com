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
