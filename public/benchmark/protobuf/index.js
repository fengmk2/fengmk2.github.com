/*!
 * protobuf - benchmark
 * Copyright(c) 2013 fengmk2 <fengmk2@gmail.com> (http://fengmk2.github.com)
 * MIT Licensed
 */

"use strict";

/**
 * Module dependencies.
 */

var fs = require('fs');

// $ $PROTO/bin/protoc example.proto -o example.desc

var protobuf = require('protobuf');
var schema = new protobuf.Schema(fs.readFileSync('./example.desc'));
var pbMessage = schema['com.fengmk2.test.Message'];

var nodeProtobuf = require('node-protobuf').Protobuf;
var pb = new nodeProtobuf(fs.readFileSync("./example.desc")); // obviously you can use async methods, it's for simplicity reasons

var protobufjs = require('protobufjs');
var Message = protobufjs.protoFromFile('./example.proto').build('com.fengmk2.test.Message');
// console.log(Message);

var msg = new Message('foo 中文 testing');

var pbData = msg.toBuffer();
var jsonData = JSON.stringify({text: 'foo 中文 testing'});

console.log('protobufjs:', pbData, Message.decode(pbData));

var outOb = pbMessage.parse(pbData);
console.log('protobuf:', outOb, JSON.stringify(outOb));

var outOb = pb.Parse(pbData, 'com.fengmk2.test.Message');
console.log('node-protobuf:', outOb, JSON.stringify(outOb));

var Benchmark = require('benchmark');
var suite = new Benchmark.Suite();

suite
.add('json decode()', function () {
  JSON.parse(jsonData);
})
.add('protobufjs decode()', function () {
  Message.decode(pbData);
})
.add('protobuf decode()', function () {
  pbMessage.parse(pbData);
})
.add('node-protobuf decode()', function () {
  pb.Parse(pbData, 'com.fengmk2.test.Message');
})

.on('cycle', function (event) {
  console.log(String(event.target));
})
.on('complete', function () {
  console.log('Fastest is ' + this.filter('fastest').pluck('name'));
})
.run({ async: true });

