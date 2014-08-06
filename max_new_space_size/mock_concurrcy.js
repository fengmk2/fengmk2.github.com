
var index = 0;
var done = 0;

function request(url, callback) {
  var i = index++;
  setTimeout(function () {
    done++;
    callback(null, {index: i, url: url});
  }, 10 * i);
}

var n = 2000;
for (var i = 0; i < n; i++) {
  request('/foo' + i, function (err, result) {
    if (err) {
      console.error(err);
    } else {
      var r = result;
      // send(r);
    }
  });
}

// setInterval(function () {
//   console.log(index, done);
// }, 1000);