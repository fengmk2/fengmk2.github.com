/**!
 * worker process
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
