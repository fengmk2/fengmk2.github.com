# 快速搭建 Node.js / io.js 开发环境以及加速 npm

在公交车上刷微博，还是有很多同学在咨询:

* 如何快速搭建 [node] 开发环境
* [npm] 超慢
* [github] 无法打开的问题

于是我觉得应该写一篇文章解答所有这些起步问题，让新同学也能顺顺利利入门。

## 快速搭建 [Node.js] 开发环境

如果你想长期做 [node] 开发, 或者想快速更新 [node] 版本, 或者想快速切换 [node] 版本,
那么在**非 Windows(如 osx, linux)** 环境下, 请使用 [nvm] 来安装你的 [node] 开发环境, 保持系统的干净.

如果你使用 **Windows** 做开发, 那么你可以使用 [nvmw] 来替代 [nvm]

## osx, linux 环境

如果你是 windows 环境开发, 请跳过这里, 直接查看下一章.

### git clone [nvm]

直接从 github clone nvm 到本地, 这里假设大家都使用 `~/git` 目录存放 git 项目:

```bash
$ cd ~/git
$ git clone https://github.com/cnpm/nvm.git
```

配置终端启动时自动执行 `source ~/git/nvm/nvm.sh`,
在 `~/.bashrc`, `~/.bash_profile`, `~/.profile`, 或者 `~/.zshrc` 文件添加以下命令:

```bash
source ~/git/nvm/nvm.sh
```

重新打开你的终端, 输入 `nvm`

```bash
$ nvm

Node Version Manager

Usage:
    nvm help                    Show this message
    nvm --version               Print out the latest released version of nvm
    nvm install [-s] <version>  Download and install a <version>, [-s] from source
    nvm uninstall <version>     Uninstall a version
    nvm use <version>           Modify PATH to use <version>
    nvm run <version> [<args>]  Run <version> with <args> as arguments
    nvm current                 Display currently activated version
    nvm ls                      List installed versions
    nvm ls <version>            List versions matching a given description
    nvm ls-remote               List remote versions available for install
    nvm deactivate              Undo effects of NVM on current shell
    nvm alias [<pattern>]       Show all aliases beginning with <pattern>
    nvm alias <name> <version>  Set an alias named <name> pointing to <version>
    nvm unalias <name>          Deletes the alias named <name>
    nvm copy-packages <version> Install global NPM packages contained in <version> to current version

Example:
    nvm install v0.10.24        Install a specific version number
    nvm use 0.10                Use the latest available 0.10.x release
    nvm run 0.10.24 myApp.js    Run myApp.js using node v0.10.24
    nvm alias default 0.10.24   Set default node version on a shell

Note:
    to remove, delete or uninstall nvm - just remove ~/.nvm, ~/.npm and ~/.bower folders
```

### 通过 [nvm] 安装任意版本的 [node]

```bash
$ nvm install 0.12.0
```

于是你就会看到一段非常快速进度条:

```bash
######################################################################## 100.0%
Now using node v0.12.0
```

还可以直接安装 iojs 各个版本

```bash
$ nvm install iojs
```

你可以继续非常方便地安装各个版本的 node 了, 你可以查看一下你当前已经安装的版本:

```bash
$ nvm ls-remote
         nvm
     v0.8.26
    v0.10.26
    v0.11.16
->  v0.12.0
```

## windows 环境

### git clone [nvmw]

直接从 github clone nvmw 到本地, 这里假设大家都使用 `d:\git` 目录存放 git 项目:

```bash
$ d:
$ cd git
$ git clone https://github.com/cnpm/nvmw.git
```

设置 `d:\git\nvmw` 目录到你的 `PATH` 环境变量中:

```bash
set "PATH=d:\git\nvmw;%PATH%"
```

重新打开你的终端, 输入 `nvmw`

```bash
$ nvmw

Usage:
  nvmw help                    Show this message
  nvmw install [version]       Download and install a [version]
  nvmw uninstall [version]     Uninstall a [version]
  nvmw use [version]           Modify PATH to use [version]
  nvmw ls                      List installed versions

Example:
  nvmw install v0.6.0          Install a specific version number
  nvmw use v0.6.0              Use the specific version
```

### 通过 [nvmw] 安装任意版本的 [node]

```bash
$ nvmw install 0.12.0
```

于是你就会看到一段非常快速进度条:

```
######################################################################## 100.0%
Now using node v0.12.0
```

安装 iojs

```
$ nvmw install iojs-1.4.2
```


然后你可以继续非常方便地安装各个版本的 node 了, 你可以查看一下你当前已经安装的版本:

```
$ nvmw ls

v0.10.26
v0.11.12
Current: v0.11.12
```

到此, 无论是 windows 环境, 还是 osx, linux 环境, 都能快速安装多个版本的 node 了.

## 使用 [cnpm] 加速 [npm]

同理 nvm , npm 默认是从国外的源获取和下载包信息, 不慢才奇怪.
可以通过简单的 `---registry` 参数, 使用国内的镜像 http://registry.npm.taobao.org :

```bash
$ npm install koa --registry=http://registry.npm.taobao.org
```

于是屏幕又哗啦哗啦地一大片输出:

```bash
$ npm install koa --registry=http://registry.npm.taobao.org
...
koa@0.5.2 node_modules/koa
├── koa-compose@2.2.0
├── statuses@1.0.2
├── finished@1.1.1
├── escape-html@1.0.1
├── only@0.0.2
├── debug@0.8.0
├── fresh@0.2.2
├── type-is@1.0.1
├── delegates@0.0.3
├── mime@1.2.11
├── co@3.0.5
├── accepts@1.0.1 (negotiator@0.4.2)
└── cookies@0.4.0 (keygrip@1.0.0)
```

但是毕竟镜像跟官方的 npm 源还是会有一个同步时间差异, 目前 cnpm 的默认同步时间间隔是 10 分钟.
如果你是模块发布者, 或者你想马上同步一个模块, 那么推荐你安装 [cnpm] cli:

```bash
$ npm install cnpm -g --registry=http://registry.npm.taobao.org
```

通过 cnpm 命令行, 你可以快速同步任意模块:

```bash
$ cnpm sync koa connect mocha
```

呃, 我就是不想安装 cnpm cli 怎么办? 哈哈, 早就想到你会这么懒了, 于是我们还有一个 web 页面:

例如我想马上同步 koa, 直接打开浏览器: http://npm.taobao.org/sync/koa

或者你是命令行控, 通过 open 命令打开:

```bash
$ open http://npm.taobao.org/sync/koa
```

如果你安装的模块依赖了 C++ 模块, 需要编译, 肯定会通过 [node-gyp] 来编译,
[node-gyp] 在第一次编译的时候, 需要依赖 [node] 源代码, 于是又会去 node dist 下载,
于是大家又会吐槽, 怎么 npm 安装这么慢...

好吧, 于是又要提到 `--disturl` 参数, 通过中国镜像来下载:

```bash
$ npm install microtime \
  --registry=http://registry.npm.taobao.org \
  --disturl=http://npm.taobao.org/mirrors/node
```

再次要提到 cnpm cli, 它已经默认将 `--registry` 和 `--disturl` 都配置好了, 谁用谁知道
.
写到这里, 就更快疑惑那些不想安装 cnpm cli 又吐槽 npm 慢的同学是基于什么考虑不在本地安装一个 cnpm 呢?

## github 好慢

好了, 看到这里大家应该对 node 和 npm 已经没有速度慢的问题了.

github 慢, 或者说是它的资源 host 被堵而已, 大家可以通过简单的 hosts 映射解决:

```
185.31.16.184 github.global.ssl.fastly.net
```

## 为何最近访问国外网站这么慢?

听说是 APCN2 又断了: http://weibo.com/1415338244/ACTYkq8xK

![1](http://ww4.sinaimg.cn/large/545c5904gw1eeu7h63hxvj20qs0mp78p.jpg)

## 有爱

希望文本对你有用. :)


 [nvm]: https://github.com/cnpm/nvm
 [nvmw]: https://github.com/cnpm/nvmw
 [cnpm]: http://npm.taobao.org
 [node]: http://nodejs.org
 [Node.js]: http://nodejs.org
 [npm]: https://www.npmjs.com
 [github]: https://github.com
 [node-gyp]: https://github.com/TooTallNate/node-gyp
