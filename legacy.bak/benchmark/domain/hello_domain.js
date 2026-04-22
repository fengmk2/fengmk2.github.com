// http://nodejs.org/docs/latest/api/domain.html#domain_domain_run_fn

var http = require('http');
var domain = require('domain');

// create a top-level domain for the server
var serverDomain = domain.create();

serverDomain.run(function () {
  // server is created in the scope of serverDomain
  http.createServer(function (req, res) {
    // req and res are also created in the scope of serverDomain
    // however, we'd prefer to have a separate domain for each request.
    // create it first thing, and add req and res to it.
    var reqd = domain.create();
    reqd.add(req);
    reqd.add(res);
    reqd.on('error', function (er) {
      console.error('Error', er, req.url);
      try {
        res.writeHead(500);
        res.end('Error occurred, sorry.');
        res.on('close', function () {
          console.log('res close');
          // forcibly shut down any other things added to this domain
          reqd.dispose();
        });
      } catch (er) {
        console.error('Error sending 500', er, req.url);
        // tried our best.  clean up anything remaining.
        reqd.dispose();
      }
    });

    reqd.run(function () {
      req.on('end', function () {
        res.end('hello world');
      });
    });
    
  }).listen(1337);
});