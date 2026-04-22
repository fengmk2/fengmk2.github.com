/**!
 * unittest for master and worker
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

const assert = require('assert');
const request = require('supertest');

describe('cluster coverage unittest', function () {

  before(function (done) {
    this.master = require('../master');
    const port = 1984;
    const app = {
      port: port,
      url: 'http://127.0.0.1:' + port,
      address: function () {
        return {
          port: port
        };
      },
      // mock koa api
      callback: function () {
        return app;
      },
    };
    this.app = app;
    setTimeout(done, 1500);
  });

  it('should 200 when user login', function (done) {
    request(this.app.callback())
    .get('/?uid=123')
    .expect({
      uid: '123'
    })
    .expect(200, done);
  });

  it('should 403 when anonymous user request', function (done) {
    request(this.app.callback())
    .get('/')
    .expect({
      error: 'please login first'
    })
    .expect(403, done);
  });

  it('should send message to monitor work', function (done) {
    this.master.monitor.send({
      id: 1,
      hi: 'I\'m master',
    });
    this.master.monitor.once('message', function (msg) {
      assert.deepEqual(msg, {
        from: 'monitor',
        type: 'confirm',
        id: 1,
      });
      done();
    });
  });
});
