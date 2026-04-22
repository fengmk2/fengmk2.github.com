'use strict';

var urllib = require('urllib');

function Syncer(url) {
  this.url = url;
}

Syncer.prototype.start = function* () {
  return yield* this.get(this.url);
};

Syncer.prototype.get = function* (url) {
  return yield urllib.request('http://127.0.0.1:7001', {
    dataType: 'json'
  });
};

module.exports = Syncer;
