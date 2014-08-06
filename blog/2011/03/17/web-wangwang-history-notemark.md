# web旺旺技术变迁的一些笔记痕迹

## 如何确定一个连接？ 
这是一个很有价值而又让人无法一下子得出答案的问题：

答：原ip，原端口，目的ip，目的端口。

## TCP状态
结合TCP各个状态的转换图，来看看Linux的TCP调优参数及说明：

![TCP各个状态的转换图](http://pic002.cnblogs.com/images/2011/18546/2011031710365593.jpg)

## Linux的TCP调优参数及说明
    //向外连接可用端口范围
    echo “1024 65535” > /proc/sys/net/ipv4/ip_local_port_range
    //time_wait连接重用
    echo 1 > /proc/sys/net/ipv4/tcp_tw_reuse 
    //快速回收time_wait连接
    echo 1 > /proc/sys/net/ipv4/tcp_tw_recycle 
    //最大time_wait连接长度
    echo 180000 > /proc/sys/net/ipv4/tcp_max_tw_buckets 
    //最大等待处于客户端还没有应答回来的连接数（在三次握手中）
    echo 20000 > /proc/sys/net/ipv4/tcp_max_syn_backlog 
    //每一个处于监听(Listen)状态端口的监听队列的长度(establisthed 状态之前)
    echo 10000 > /proc/sys/net/core/somaxconn 
    //最大等待cpu处理的包的数目
    echo 10000 > /proc/sys/net/core/netdev_max_backlog 
    //最大打开文体数
    echo 2000000 > /proc/sys/fs/file-max 
    //FIN-WAIT-2状态等待回收时间
    echo 3 > /proc/sys/net/ipv4/tcp_fin_timeout 
    //最大的TCP数据接收缓冲大小
    /proc/sys/net/core/rmem_max 
    //默认的TCP数据接收缓冲大小
    /proc/sys/net/core/rmem_default 
    //最大的TCP数据发送缓冲大小
    /proc/sys/net/core/wmem_max 
    //默认的TCP数据接收缓冲大小
    /proc/sys/net/core/wmem_default  
    
    /*
    PS:
    /proc目录下的所有内容都是临时性的, 所以重启动系统后任何修改都会丢失，
    增加到/etc/rc.local文件,系统重新引导的时候会自动修改
    */
    
### 有爱
^_^ 非常感谢这样的分享会，受益良多啊！