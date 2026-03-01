var koa = require('koa');
var csrf = require('koa-csrf');
var session = require('koa-session');

var app = koa();
app.keys = ['session secret'];
app.use(session());
app.use(csrf());

app.use(function* () {
  this.body = 'hello csrf';
});

app.listen(1984);
