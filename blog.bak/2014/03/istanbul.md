# Use istanbul test coverage on koa

Recently, I wrote some koa middlewares: [koa-gzip](https://github.com/fengmk2/koa-gzip), [koa-fresh](https://github.com/fengmk2/koa-fresh),
and I want to do test coverage with my favorite module: [blanket](https://github.com/alex-seville/blanket).

But blanket broken [#393](https://github.com/alex-seville/blanket/issues/393)

```
$ m cov

/Users/mk2/git/koa-gzip/node_modules/blanket/node_modules/esprima/esprima.js:3872
            throw e;
                  ^
Error: Line 27: Unexpected token *
    at throwError (/Users/mk2/git/koa-gzip/node_modules/blanket/node_modules/esprima/esprima.js:1156:21)
    at throwUnexpected (/Users/mk2/git/koa-gzip/node_modules/blanket/node_modules/esprima/esprima.js:1213:9)
```

## Is esprima not work?

First, I think [esprima](http://esprima.org/) not support es6.
But I search on github found [#87](https://github.com/ariya/esprima/pull/87) it's already support es6 now.

## [istanbul](https://github.com/gotwarlost/istanbul) I found

I search 'coverage' on npm, [istanbul](https://github.com/gotwarlost/istanbul) just come out.

There are some articles about makr istanbul work with [mocha](https://github.com/visionmedia/mocha):

* [Running Istanbul code coverage with mocha](https://coderwall.com/p/x6jfwg)
* [Configuring istanbul with mocha](https://github.com/gotwarlost/istanbul/issues/44)

## Change blanket to istanbul

All diffs: [koa-gzip#9af6](https://github.com/fengmk2/koa-gzip/commit/9af69507f28b575e5c2ad9ac5f51b684cd22f1fd)

`package.json`: **MUST** use [istanbul harmony branch](https://github.com/gotwarlost/istanbul/tree/harmony)

```json
"devDependencies": {
  "autod": "*",
  "contributors": "*",
  "istanbul": "git://github.com/gotwarlost/istanbul.git#harmony",
  "koa": "0.5.0",
  "mm": "0.2.0",
  "mocha": "*",
  "should": "3.1.3",
  "supertest": "0.9.0"
}
```

`Makefile`:

```bash
install:
	@npm install --registry=http://r.cnpmjs.org --cache=${HOME}/.npm/.cache/cnpm

test: install
	@NODE_ENV=test node --harmony \
		node_modules/.bin/istanbul cover ./node_modules/.bin/_mocha \
		-- -u exports \
		--reporter $(REPORTER) \
		--timeout $(TIMEOUT) \
		$(MOCHA_OPTS) \
		$(TESTS)
```

stdout:

```bash
$ mt


  index.test.js
    gzip()
      ✓ should work with no options
    when status 200 and request accept-encoding include gzip
      ✓ should return gzip string body (39ms)
      ✓ should return raw string body if body smaller than minLength
      ✓ should return raw string body if gzip body bigger than raw body
      ✓ should return gzip buffer body
      ✓ should return gzip stream body
      ✓ should return gzip json body
      ✓ should return number body
    when status 200 and request accept-encoding exclude gzip
      ✓ should return raw body
    when status non 200
      ✓ should return 404
      ✓ should return 500


  11 passing (117ms)

=============================================================================
Writing coverage object [/Users/mk2/git/koa-gzip/coverage/coverage.json]
Writing coverage reports at [/Users/mk2/git/koa-gzip/coverage]
=============================================================================

=============================== Coverage summary ===============================
Statements   : 100% ( 26/26 )
Branches     : 100% ( 19/19 )
Functions    : 100% ( 2/2 )
Lines        : 100% ( 26/26 )
================================================================================
```

istanbul is awesome! I run once tests, got all reports.

There is no more `$ make test-cov`.

## Write for love

Hope this article make your coding life better and more fun.
