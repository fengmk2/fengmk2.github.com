var dns = require('dns');

var domain = 'test.nodeweibo.com';

dns.resolve4(domain, function (err, addresses) {
  if (err) {
    throw err;
  }
  console.log('addresses: ' + JSON.stringify(addresses));
  // addresses.forEach(function (a) {
  //   dns.reverse(a, function (err, domains) {
  //     if (err) {
  //       throw err;
  //     }
  //     console.log('reverse for ' + a + ': ' + JSON.stringify(domains));
  //   });
  // });
});

dns.lookup(domain, 4, function (err, addresses) {
  if (err) {
    throw err;
  }
  console.log('addresses: ' + JSON.stringify(addresses));
  // addresses.forEach(function (a) {
  //   dns.reverse(a, function (err, domains) {
  //     if (err) {
  //       throw err;
  //     }
  //     console.log('reverse for ' + a + ': ' + JSON.stringify(domains));
  //   });
  // });
});