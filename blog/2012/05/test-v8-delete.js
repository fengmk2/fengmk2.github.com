// http://club.cnodejs.org/topic/4fbcee9b3a7ec1d15106ddba
// 
// http://jsperf.com/test-v8-delete
// 

function prototypeDeleteBenchmark(number, isDelete) {
  function Foo() {}
  Foo.prototype.x = 1;
  Foo.prototype.y = 2;

  if (isDelete) {
    delete Foo.prototype.y;
  }

  var foo = new Foo();

  var begin = new Date();
  var result = 0;
  for (var i = 0; i < number; i++) {
    result = result + foo.x;
  }
  var end = new Date();
  console.log('delete: %s, loop: %s, usetime: %d ms', isDelete, number, end - begin);
}

function propertyDeleteBenchmark(number, isDelete) {
  var foo = {
    x: 1,
    y: 2
  };

  if (isDelete) {
    delete foo.y;
  }

  var begin = new Date();
  var result = 0;
  for (var i = 0; i < number; i++) {
    result = result + foo.x;
  }
  var end = new Date();
  console.log('delete: %s, loop: %s, usetime: %d ms', isDelete, number, end - begin);
}

var number = parseInt(process.argv[2], 10) || 1000000;

console.log('prototypeDeleteBenchmark:');
prototypeDeleteBenchmark(number, false);
prototypeDeleteBenchmark(number, true);

console.log('propertyDeleteBenchmark:');
propertyDeleteBenchmark(number, false);
propertyDeleteBenchmark(number, true);
