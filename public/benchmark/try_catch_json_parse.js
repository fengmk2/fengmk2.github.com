var Benchmark = require('benchmark');

var suite = new Benchmark.Suite();

var TYPE_LIST = [
  'boolean', 'int', 'short', 'byte', 'long', 'number',
  'double', 'float', 'char', 'string', 'integer'
];

var query = {
  uid: '123123',
  fields: '["foo","bar","hello","sdfsdfsdf"]',
  error: '"awdawd['
};

var params = [
  {
    name: 'uid',
    type: 'number',
  },
  {
    name: 'fields',
    type: 'array',
  },
  {
    name: 'unknow',
    type: 'array',
  },
  {
    name: 'error',
    type: 'map',
  },
];

suite

.add('Just set copy value', function () {
  var args = [];
  for (var i = 0; i < params.length; i++) {
    var p = params[i];
    var value = query[p.name];
    args.push(value);
  }
})

.add('Some types: Try catch and JSON parse()', function () {
  var args = [];
  for (var i = 0; i < params.length; i++) {
    var p = params[i];
    var value = query[p.name];
    if (TYPE_LIST.indexOf(p.type) < 0) {
      try {
        value = JSON.parse(value);
      } catch (e) {

      }
    }
    args.push(value);
  }
})

.add('All types: Try catch and JSON parse()', function () {
  var args = [];
  for (var i = 0; i < params.length; i++) {
    var p = params[i];
    var value = query[p.name];
    try {
      value = JSON.parse(value);
    } catch (e) {

    }
    args.push(value);
  }
})

.add('All types: check empty and Try catch and JSON parse()', function () {
  var args = [];
  for (var i = 0; i < params.length; i++) {
    var p = params[i];
    var value = query[p.name];
    if (value) {
      try {
        value = JSON.parse(value);
      } catch (e) {

      }
    }
    
    args.push(value);
  }
})

// add listeners
.on('cycle', function (event) {
  console.log(String(event.target));
})
.on('complete', function () {
  console.log('Fastest is ' + this.filter('fastest').pluck('name'));
})
.run({ async: true });

