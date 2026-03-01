# Use Blanket.js instead of jscover

在遇到 [Blanket.js] 之前，我一直使用这 [jscover] 来做代码覆盖率测试。

## jscover

使用 [jscover] ，好处是不需要编译，直接使用 java 版本；缺点是需要 java 环境依赖。
通过 Makefile 来驱动整个测试执行，如 [urllib/Makefile](https://github.com/TBEDP/urllib/blob/0.3.4/Makefile)

```bash
TESTS = test/*.test.js
REPORTER = spec
TIMEOUT = 20000
JSCOVERAGE = ./node_modules/jscover/bin/jscover

test:
  @NODE_ENV=test ./node_modules/mocha/bin/mocha \
    --reporter $(REPORTER) \
    --timeout $(TIMEOUT) \
    $(TESTS)

test-cov:
  @rm -rf ./lib-cov
  @$(JSCOVERAGE) lib lib-cov
  @URLLIB_COV=1 $(MAKE) test REPORTER=dot
  @URLLIB_COV=1 $(MAKE) test REPORTER=html-cov > coverage.html

.PHONY: test test-cov
```

执行代码覆盖率测试:

```bash
$ make test-cov
```

打开 [coverage.html](http://fengmk2.github.io/coverage/urllib.html) 就能看到覆盖情况了。

## Blanket.js

某天在github上看到 [Blanket.js] ，算是意外收获，终于能摆脱代码转换依赖了。

> Blanket.js is an easy to install, easy to configure, and easy to use JavaScript code coverage library that works both in-browser and with nodejs.

使用上 [Blanket.js] 以后，不再需要将代码转换落地成文件，也不需要java依赖。

还是以 [urllib/Makefile](https://github.com/TBEDP/urllib/blob/master/Makefile) 为例:

```bash
TESTS = test/*.test.js
REPORTER = spec
TIMEOUT = 20000
MOCHA_OPTS =

test:
  @NODE_ENV=test ./node_modules/mocha/bin/mocha \
    --reporter $(REPORTER) \
    --timeout $(TIMEOUT) \
    $(MOCHA_OPTS) \
    $(TESTS)

test-cov:
  @URLLIB_COV=1 $(MAKE) test MOCHA_OPTS='--require blanket' REPORTER=dot
  @URLLIB_COV=1 $(MAKE) test MOCHA_OPTS='--require blanket' REPORTER=html-cov > coverage.html

.PHONY: test test-cov
```

参考 [Getting Started Guide (nodejs version)](https://github.com/alex-seville/blanket/blob/master/docs/getting_started_node.md)

在 [package.json](https://github.com/TBEDP/urllib/blob/master/package.json) 添加上 blanket 的代码匹配模式，确定你需要对那个路径下的代码进行转换。

```js
"scripts": {
  "test": "make test",
  "blanket": { "pattern": "urllib/lib" }
},
```

执行命令还是保持一致：

```bash
$ make test-cov
```

`coverage.html` 跟使用 [jscover] 的报告结果一致，缺没有了文件生成，也不再需要去服务器上安装java了。

## Project

对于非lib类项目，如普通的应用项目，进行代码覆盖率测试，同样可以使用 [Blanket.js] 很好地做到。

以 [urlrar](https://github.com/fengmk2/urlrar) 为例:

Markfile

```bash
TESTS = test/*.test.js
REPORTER = spec
TIMEOUT = 10000
MOCHA_OPTS =

install:
  @npm install

test: install
  @NODE_ENV=test ./node_modules/mocha/bin/mocha \
    --reporter $(REPORTER) \
    --timeout $(TIMEOUT) \
    $(MOCHA_OPTS) \
    $(TESTS)

test-cov: 
  @URLRAR_COV=1 $(MAKE) test MOCHA_OPTS='--require blanket' REPORTER=html-cov > coverage.html
  @URLRAR_COV=1 $(MAKE) test MOCHA_OPTS='--require blanket' REPORTER=travis-cov

test-all: test test-cov

.PHONY: test-cov test test-all
```

package.json

```js
"devDependencies": {
    "travis-cov": "*",
    "blanket": "*",
    // ...
  },
  "scripts": {
    "test": "make test-all",
    "blanket": { 
      "pattern": "//^((?!(node_modules|test)).)*$/",
      "data-cover-flags": {
        "debug": false
      }
    },
    "travis-cov": {
      "threshold": 93
    }
  },
```

```bash
$ npm test 
```

运行结果: 包含测试结果和代码覆盖率.

![1](http://nfs.nodeblog.org/f/a/fa73ef3685d050f6efcdf8b7a1f428c1.png)


## 有爱

^_^ 希望本文对你有用。


  [Blanket.js]: http://blanketjs.org/
  [jscover]: https://github.com/fengmk2/jscover
