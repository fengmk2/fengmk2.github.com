# iPhone使用全记录

iPhone用起来太多东西要记，免得以后刷机都走错路，就在这里记下一些痕迹吧。
 
1. 我的是美版有锁的iPhone 3GS，所以第一步是越狱，然后解锁。
2. [威锋网的源 http://app.weiphone.com/cydia/](http://app.weiphone.com/cydia/), 
   [Sinful源 http://www.sinfuliphonerepo.com/](http://www.sinfuliphonerepo.com/)
   [UCWEB源 http://uc.cn/cydia/](http://uc.cn/cydia/)
3. 安装install0us，这样就可以抛弃iTunes直接在iPhone上安装ipa了，
    install0us的ipa存放目录: /var/mobile/Downloads/
4. 使用ifunbox上传ipa文件到iPhone.
5. deb文件安装方式，有以下2种: 
    1) 直接放到/private/var/root/Media/Cydia/AutoInstall/目录下，然后重启iPhone来安装；
    2) 安装mobile Terminal, 然后调用命令: dpkg -i xxx.deb
6. 安装WinterBoard美化一下，可以自定义背景图；安装百度输入法；
    安装Backgrounder，让所有程序都可以后台运行(短按home键切换状态)；
    安装Activator，自定义快捷键；安装CyDelete，让Cydia安装的软件都可以像App Store那样的方式删除；
    安装QuickReply，可以快速回复短信；安装Safari Download Manager，让Safari浏览器可以下载；
    安装UCWEB和Opera Mini；
7. 让桌面一页存放图标由4行4列变成5行5列，并且固定栏存放5个dock.
    1) 在Cydia搜索: five, 安装File Icon Dock, Five-Column SpringBoard, FivelRows
    2) 图标很挤，所以需要安装Shrink，来将图标缩小为原来的80%.
    
再来张漂亮的桌面

![哈](http://pic002.cnblogs.com/img/fengmk2/201006/2010062400522229.jpg)