# 配置 Windows 下的 nodejs C++ 模块编译环境

根据 [node-gyp](https://github.com/TooTallNate/node-gyp#installation) 指示的 Windows 编译环境说明,
简单一句话就是 "Python + VC++ 编译环境".

所有需要的安装文件, 我都下载好放到百度云盘了: [nodejs-gyp-windows](http://pan.baidu.com/s/1iwrT0)

## Python

* 安装 python-2.7.7.msi

## iso 虚拟磁盘

* 安装 DTLite4491-0356.exe

## Windows XP

文件在: [node-gyp-windows/windowsXP](http://pan.baidu.com/s/1iwrT0#dir/path=%2Fnodejs-gyp-windows%2FwindwsXP)

* 用 DTLite 打开 VS2010Express1.iso , 然后安装 `Visual Studio C++ 2010` 就OK了, 其他不需要安装

## Windows 7

文件在: [node-gyp-windows/windows7](http://pan.baidu.com/s/1iwrT0#dir/path=%2Fnodejs-gyp-windows%2Fwindows7)

* 用 DTLite 打开 VS2012_WDX_ENU.iso , 然后点击 "Install" 就OK了, 会安装整个 `Visual Studio Express 2012`

## 编译你的第一个 nodejs c++ 模块

假设你在使用 `node v0.10.29`

这里举例安装 `microtime` 模块:

```bash
$ npm install microtime --registry=https://registry.npm.taobao.org --disturl=https://npm.taobao.org/dist
```

测试安装编译结果:

```bash
$ node -e 'console.log("now is %d ms", require("microtime").now())'
```
