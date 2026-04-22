# nodejs 1G堆栈内存限制(by v8)

## 误区: nodejs最多只能使用1G内存

最近有看过“最多只能使用1G内存(V8 is unable to use more than 1gb of memory)”。
实际真的是这样的吗？让我们动手试试，实际是检验真理的唯一标准。

## 让nodejs占满你机器的内存

测试代码：每次填充100MB内存，值得机器卡住为止。
(我的机器是2G内存，为了能将此文章写下去，我限制到1.5G退出程序)

    var os = require('os');
    
    function show_mem() {
      var total = os.totalmem()
        , free = os.freemem()
        , used = total - free;
      console.log('System: total ' + total + ' free ' + free + ' used ' + used);
      var mem = process.memoryUsage();
      console.log('Process: heapTotal ' + mem.heapTotal + ' heapUsed ' + mem.heapUsed
        + ' rss ' + mem.rss + ' vsize ' + mem.vsize
      );
      console.log('----------------------------------------------------------------');
    };
    
    var bs = [];
    function add_100m() {
      var size = 100 * 1024 * 1024,
        buffer = new Buffer(size);
      for (var i = 0; i < size; i++) {
        buffer[i] = 0;
      }
      bs.push(buffer);
    };
    
    for (var j = 0; j < 15; j++) {
      show_mem();
      add_100m();
    }
    show_mem();

运行结果: 进程占用rss 1581735936 字节，跟预想中的一致。证明nodejs进程可以使用超过1G的内存。

    System: total 2100867072 free 52113408 used 2048753664
    Process: heapTotal 6277280 heapUsed 1725092 rss 1581735936 vsize 1628082176
    ----------------------------------------------------------------

![result image](http://images.cnblogs.com/cnblogs_com/fengmk2/293079/o_v81glimit.png)

## 哪到底什么是1G堆栈内存限制

让我们展开热烈的讨论吧。[nodejs 1G堆栈内存限制具体是指什么？](http://zheye.org/asks/4da05d30fd503c24f9000001)