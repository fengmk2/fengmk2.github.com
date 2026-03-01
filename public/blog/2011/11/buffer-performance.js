
var n = 10000;

// new Buffer(size): 1kb, 2kb, 5kb, 10kb, 20kb, 64kb, 100kb, 1mb, 2mb, 5mb, 10mb
var kb = 1024, mb = 1024 * 1024;
var sizes = [1 * kb, 2 * kb, 5 * kb, 10 * kb, 20 * kb, 64 * kb, 100 * kb, 
             1 * mb, 2 * mb, 5 * mb, 10 * mb];
console.log('new Buffer(size) ' + n + ' times:')
console.log('size\t\tms')
for(var j = 0, l = sizes.length; j < l; j++) {
    var start = new Date()
      , size = sizes[j];
    for(var i = 0; i < n; i++) {
        new Buffer(size);
    }
    console.log(size / kb + '\tkb\t' + (new Date() - start));
}

console.log('---------------------------------------------');

n = 1000;
console.log('Buffer copy and slice copy ' + n + ' times:')
console.log('size\t\tms')
var b = new Buffer(1 * mb); // net socket default buffer size
var sizes = [1 * kb, 2 * kb, 5 * kb, 10 * kb, 20 * kb, 64 * kb, 100 * kb, 1 * mb];
for(var j = 0, l = sizes.length; j < l; j++) {
    var start = new Date()
      , size = sizes[j];
    var buffer = new Buffer(size);
    start = new Date();
    for(var i = 0; i < n; i++) {
        for(var k = 0; k < size; k++) {
            buffer[k] = b[k];
        }
    }
    var copy_time = new Date() - start;
    start = new Date();
    for(var i = 0; i < n; i++) {
        var tmp = b.slice(0, size);
        for(var k = 0; k < size; k++) {
            buffer[k] = tmp[k];
        }
    }
    var slice_copy_time = new Date() - start;
    console.log(size / kb + '\tkb\tcopy\t' + copy_time + '\tslice_copy\t' + slice_copy_time);
}
