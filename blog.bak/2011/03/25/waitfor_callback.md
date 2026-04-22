# nodejs: 随想javascript并行调用带callback的异步函数

先看看本文基于的一个应用场景

## 用户发表评论
1. 允许用户发表文字评论，并且可以带附件。
2. 服务器端处理需要认证用户是否登录；
3. 需要将文字评论保存到数据库，附件以文件形式保存在服务器上；

## 实现1：串行callback
    
## 实现2：并行callback

## 实现3：去除冗余

## 实现4：实现3的改进？闭包？function(){}

## 结论

## 有爱
^_^ 希望本文对你有用。

## Without the async module

var files = ['file1', 'file2', 'file3'],
    results = [],
    completed = 0;

files.forEach(function(f){
    path.exists(f, function(exists){
        if(exists) results.push(f);
        completed++;
        if(completed == files.length){
            if(results){
                sys.puts('The following files already exist: ' + results);
            }
        }
    });
});