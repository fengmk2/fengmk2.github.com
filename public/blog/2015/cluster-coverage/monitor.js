/**!
 * monitor process
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

console.log('monitor:%d start with %j, running_under_istanbul: %s',
  process.pid, process.argv, process.env.running_under_istanbul);
process.on('message', function (msg) {
  console.log('[monitor] got message from master: %j', msg);
  process.send({
    from: 'monitor',
    type: 'confirm',
    id: msg.id
  });
});
