# mocha + jscoverage

mocha在[Release 0.13.0](https://github.com/visionmedia/mocha/commit/6caeb30386e92b4a980074b535747319324dfe99) 已经支持 `HTMLCov` 和 `JSONCov` 两种reporter, 那么显然可以非常简便地将 [jscoverage](https://github.com/visionmedia/node-jscoverage) 整合到mocha中, 进行代码覆盖率测试了.

## 如何做?

参照 [mocha](http://visionmedia.github.com/mocha/) 的 [Best practices](http://visionmedia.github.com/mocha/), 在 `Makefile` 中配置所有命令:

1. 使用 `jscoverage` 命令行程序转换源代码

        lib-cov:
          @rm -rf ./$@
          @jscoverage lib $@

1. 代码中根据环境变量 `JSCOV` 判断载入的模块是经过转换的 `lib-cov` 模块, 如: [index.js](https://github.com/fengmk2/ndir/blob/master/index.js)

        module.exports = process.env.JSCOV 
          ? require('./lib-cov/ndir')
          : require('./lib/ndir');

1. 增加 `test-cov` 命令, 设置reporter 为 `html-cov`

        test-cov: lib-cov
          @JSCOV=1 $(MAKE) test REPORTER=html-cov > coverage.html && open coverage.html

1. 执行 `make test-cov` 命令享受测试报告吧, 92%的覆盖率, 还不错吧.

![http://ww4.sinaimg.cn/large/6cfc7910jw1dqguzalbuzj.jpg](http://ww4.sinaimg.cn/large/6cfc7910jw1dqguzalbuzj.jpg)

![http://ww3.sinaimg.cn/large/6cfc7910jw1dqguzmli6aj.jpg](http://ww3.sinaimg.cn/large/6cfc7910jw1dqguzmli6aj.jpg)

## 完整Makefile

本文完整的`Makefile` 示例来自 [ndir](https://github.com/fengmk2/ndir)

    SRC = $(shell find lib -type f -name "*.js")
    TESTS = test/*.js
    TESTTIMEOUT = 5000
    REPORTER = spec

    test:
      @NODE_ENV=test ./node_modules/.bin/mocha \
        --reporter $(REPORTER) --timeout $(TESTTIMEOUT) $(TESTS)

    test-cov: lib-cov
      @JSCOV=1 $(MAKE) test REPORTER=html-cov > coverage.html && open coverage.html

    lib-cov:
      @rm -rf ./$@
      @jscoverage lib $@

    clean:
      rm -rf lib-cov
      rm -f coverage.html

    .PHONY: test test-cov

## 有爱

^_^ 希望本文对你有用

原文链接: [http://fengmk2.github.com/blog/2012/02/mocha-with-jscoverage.html](http://fengmk2.github.com/blog/2012/02/mocha-with-jscoverage.html)