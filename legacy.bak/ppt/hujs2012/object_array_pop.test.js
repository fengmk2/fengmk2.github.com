var servers = [];
for (var i = 0; i < 10000; i++) {
  servers.push('127.0.0.1:' + (1000 + i));
}

var addresses = {};
for (var i = 0; i < servers.length; i++) {
  var server = servers[i];
  addresses[server] = server;
}

var candidateServers = [];
for (var key in addresses) {
  candidateServers.push(addresses[key]);
}

console.log(addresses, candidateServers, servers)

console.log('%s should equal %s', server, candidateServers.pop());