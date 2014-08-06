
// Create a MySQL connection pool with
// a max of 10 connections and a 30 second max idle time
var poolModule = require('generic-pool');
var pool = poolModule.Pool({
    name     : 'mysql',
    create   : function(callback) {
        var Client = require('mysql').Client;
        var c = new Client();
        c.user     = 'root';
        c.password = '123456';
        c.database = 'test';
        // parameter order: err, resource
        // new in 1.0.6
        callback(null, c);
    },
    destroy  : function(client) { client.end(); },
    max      : 10,
    idleTimeoutMillis : 30000,
    log : true
});

// acquire connection - callback function is called
// once a resource becomes available
pool.acquire(function(err, client) {
    client.query("select * from foo", [], function() {
        console.log(arguments)
        // return object back to pool
        pool.release(client);
    });
});