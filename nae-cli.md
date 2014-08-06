# NAE client v1(beta) release

如有任何问题，请微博联系[@Literal](http://weibo.com/literal)

Hi, all
NAE client v1(beta) release~。 这回真可以用了！！！

欢迎试用，安全起见，首次试用，请先用一个测试目录。记得保护自己的代码哦

欢迎反馈 ， ^_^ 。

## 安装nae客户端

    $ wget http://cnodejs.net/download/install.sh
    $ chmod +x ./install.sh
    $ sudo ./install.sh

安装之后

    $ nae
    # 将打印出版本信息,说明安装成功

## 使用nae客户端

在开始之前，请仔细阅读这段说明。
nae client在开始使用时需要先身份认证，身份认证需要使用auth命令获取身份认证

    $ nae auth

份认证成功之后，会在~/.nae_auth文件中保存认证的token信息。所以当切换用户时，需要重新认证。

nae client执行download动作时，是将服务器端的代码同步到本地。
同步的过程中，“会删除本地有而服务器端没有的文件！！！”
所以在使用download之前，请先commit本地代码，以防代码丢失。

nae client执行upload的时候，同样，“会将本地没有而服务器端有的文件删除！！！”
所以在upload之前，如有必要，请先备份服务器端代码。

### 身份认证

    $ nae auth

### 查看app状态

    $ nae status appname

### 启动app

    $ nae start appname

### 关闭app

    $ nae stop appname

### 重启app

    $ nae restart appname

调试app,捕获服务器端app的输出信息

    $ nae debug appname

### 上传app
上传的时候，有需要排除的文件
比如.project .setting等文件，可以创建一个.naeignore文件，每行一个正则表达，匹配则忽略文件和目录

    $ nae upload appname
    $ nae sup appname

### 下载app
下载之后，目录中会有一个索引文件，.naeindex ,这是一个diff文件，不要删除它，client需要这个文件

    $ nae syncdown appname
    $ nae sdown appname

### 帮助信息

    $ nae help

### 更新客户端
自我更新功能，还需要存放客户端的服务器支持，暂无~

    $ sudo nae update

### 启动app

当cd到app目录中时，nae命令可以省略appname，比如:
    
    $ nae start
    # 重启
    $ nae restart

## .naeignore

### .naeignore文件策略

. naeignore  文件用来控制syncup、syncdown时，过滤不必要的文件传输，比如一些用户数据、版本控制文件、服务器日志等等。
syncup的时候，使用本地的. naeignore文件，
syncdown的时候，使用服务器端的. naeignore文件

### .naeignore 编写范例：

    db/*                   => ^db\/.*$                        过滤服务器根目录下的db目录下的所有文件，db目录不会被过滤
    db                       => ^db$                               仅过滤服务器根目录下名为 db的文件
    log/*.error       => ^\/log\/.*\.error$        过滤服务器根目录下 log目录下的 .error后缀的文件
    upload/*           => ^upload\/.*$                 过滤上传目录下的所有文件
    package.json   =>                                          过滤nae的配置文件
    config.js            =>                                          过滤工程的配置文件


## Change log

1. 订正了同步协议中的一些bug，更新了同步机制
2. 同步命令增加两个别名，方便使用
3. 同步时有确认命令，便于检查
4. 修复了cmd的一些bug
5. 源代码加入了Build工具
