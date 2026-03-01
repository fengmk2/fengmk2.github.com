/**
 * A very simple HTTP Hello world demo
 */

var net = require('net');

//var response = new Buffer('HTTP/1.0 200 OK\r\nContent-Length: 11\r\n\r\nHello World');
//var server = net.createServer(function(client) {
//    client.on('data', function(data) {
//        var l = data.length - 1;
//        // \r\n\r\n
////        if(data.length !== 68) {
////            console.log(data.toString(), data)
////        }
////        console.log(client.remotePort)
////        console.log(JSON.stringify(data.toString()), data)
//        if(data[l-3] === 0x0d && data[l-2] === 0x0a
//                && data[l-1] === 0x0d && data[l] === 0x0a) {
////            console.log(JSON.stringify(data.toString()), data)
//            client.write(response);
//            client.end();
//        }
//    });
//});
//
//server.listen(1337);


var net = require('net');

var response = new Buffer('HTTP/1.1 200 OK\r\nConnnection: keep-alive\r\nContent-Length: 11\r\n\r\nHello World');
var server = net.createServer(function(client) {

    client.ondata = function(data, start, end) {
        var l = end - 1;
        if(data[l-3] === 0x0d && data[l-2] === 0x0a
                && data[l-1] === 0x0d && data[l] === 0x0a) {
            client.write(response);
        }
    };
});

server.listen(1337);