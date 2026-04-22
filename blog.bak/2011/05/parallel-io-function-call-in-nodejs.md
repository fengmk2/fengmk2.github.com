# Nodejs中的并行IO调用

## 并行IO调用

我们编写nodejs程序的时候，常常会遇到可以平行调用IO。
如果使用串行方式调用，会导致嵌套callback太多和抛弃了并行IO的优势。
于是，我们都会选择并行调用。

## 应用场景设定: 合并2个文本的内容，并输出

伪代码

    print readFile(file1) + readFile(file2)

## 计数器模式

最容易想到的方法就是使用计数器，记录是否全部IO都执行完了，然后一并获取结果。

使用封装好的fork方法
`fork` come from [Coordinating parallel execution in node.js](http://stackoverflow.com/questions/4631774/coordinating-parallel-execution-in-node-js):

    function fork(async_calls, shared_callback) {
      var counter = async_calls.length;
      var all_results = [];
      function makeCallback (index) {
        return function () {
          counter --;
          var results = [];
          // we use the arguments object here because some callbacks 
          // in Node pass in multiple arguments as result.
          for (var i=0;i<arguments.length;i++) {
            results.push(arguments[i]);
          }
          all_results[index] = results;
          if (counter == 0) {
            shared_callback(all_results);
          }
        }
      }
    
      for (var i=0;i<async_calls.length;i++) {
        async_calls[i](makeCallback(i));
      }
    }



## Currying the callback ([函数柯里化?](http://dict.youdao.com/search?q=currying&keyfrom=smartresult.dict#q%3Dcurrying%26keyfrom%3Dsmartresult.dict))

## 更多阅读

* [Currying the callback, or the essence of futures](http://bjouhier.wordpress.com/2011/04/04/currying-the-callback-or-the-essence-of-futures/)
* [Currying](http://en.wikipedia.org/wiki/Currying)

## 有爱

希望本文对你有用 ^_^