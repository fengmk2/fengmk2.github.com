# git commit 描述模板

## 标准模板

```txt
本次更新的简要描述（50 个字符以内）

如果必要，此处展开详尽阐述。段落宽度限定在 72 个字符以内。
某些情况下，第一行的简要描述将用作邮件标题，其余部分作为邮件正文。
其间的空行是必要的，以区分两者（当然没有正文另当别论）。
如果并在一起，rebase 这样的工具就可能会迷惑。

(另起空行后，再进一步补充其他说明。 忽略这行说明)
 - 可以使用这样的条目列举式。

 - 一般以单个空格紧跟短划线(-)或者星号(*)作为每项条目的起始符。
   每个条目间用一空行隔开。
   不过这里按自己项目的约定，可以略作变化。
```

## 举例

```txt
目录重构，符合团队约定规范

url router 设置全部整合到/routes.js；
注意区分controllers和common，common之前可以调用，controllers之前不能相互调用；

* app.js app.get() and app.post() => routes.js

* config.js => conf/index.js, conf/config_pre|daily|online.js
```


## 参考

* [分布式-Git-为项目作贡献](http://git-scm.com/book/zh/%E5%88%86%E5%B8%83%E5%BC%8F-Git-%E4%B8%BA%E9%A1%B9%E7%9B%AE%E4%BD%9C%E8%B4%A1%E7%8C%AE)