var connect = require('connect');

connect(connect.static(__dirname)).listen(8001);
