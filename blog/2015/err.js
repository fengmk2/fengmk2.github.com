'use strict';

function err1() {
  const err = new Error('something wrong');
  err.name = 'RequestError';
  console.log(err.stack);
}

function err2() {
  class RequestError extends Error {
    constructor(message) {
      super(message);
      this.name = 'RequestError';
      Error.captureStackTrace(this, RequestError);
    }
  }

  const err = new RequestError('something wrong');
  console.log(err instanceof Error);
  console.log(err instanceof RequestError);
  console.log(err instanceof TypeError);
  console.log(err.stack);
}

err1();
err2();
