# linksys 刷 openwrt

## 配置 ssh wrt 简称

在 `~/.ssh/config` 增加配置

```
Host wrt 192.168.2.1
    Hostname 192.168.2.1
    User root
```

这样就可以通过 `$ ssh wrt` 访问你的 openwrt 了。(很可能你的 wrt ip 是 192.168.1.1)

## 复制需要的文件到 wrt 上

复制之前先将 shadowsocks.json 和 shadowsocks 配置好。

```
scp ~/git/fengmk2.github.com/openwrt/shadowsocks-libev_2.4.8-3_mvebu.ipk wrt:~/
scp ~/git/fengmk2.github.com/openwrt/gfwlist2dnsmasq.py wrt:~/
scp ~/git/fengmk2.github.com/openwrt/update_dnsmasq_list.sh wrt:~/
scp ~/git/fengmk2.github.com/openwrt/shadowsocks.json wrt:/etc/shadowsocks.json
scp ~/git/fengmk2.github.com/openwrt/shadowsocks wrt:/etc/init.d/shadowsocks
```

## 安装软件

在 wrt 上执行 pkg 更新

```
cd ~
opkg update
opkg remove dnsmasq
opkg install dnsmasq-full
opkg install ipset iptables-mod-nat-extra
opkg install shadowsocks-libev_2.4.8-3_mvebu.ipk
```

检查 ss 是否安装完成

```
ldd /usr/bin/ss-redir
```

## 启动 shadowsocks

```
chmod +x /etc/init.d/shadowsocks
/etc/init.d/shadowsocks enable
/etc/init.d/shadowsocks start
```

通过 netstat 可以看到监听了 1080 和 5353 端口

```
netstat -nat
```

## 配置 ipset

- 创建名为gfwlist，格式为iphash的集合
- 匹配gfwlist中ip的nat流量均被转发到shadowsocks端口
- 匹配gfwlist中ip的本机流量均被转发到shadowsocks端口

```
ipset -N gfwlist iphash
iptables -t nat -A PREROUTING -p tcp -m set --match-set gfwlist dst -j REDIRECT --to-port 1080
iptables -t nat -A OUTPUT -p tcp -m set --match-set gfwlist dst -j REDIRECT --to-port 1080
```

## 配置 dnsmasq-full

```
echo 'conf-dir=/etc/dnsmasq.d' >> /etc/dnsmasq.conf
```

更新 gfwlist 并且重启 dnsmasq

```
sh update_dnsmasq_list.sh
```

- 查看 dns 缓存信息

```
ipset -L gfwlist
```

清空 dns 缓存

```
ipset flush gfwlist
```

## 测试

```
curl -v twitter.com
curl -v facebook.com
```

## 参考资料

- [Openwrt上使用dnsmasq和ipset实现域名分流](http://www.keepwn.com/howto/route-traffic-selectively-by-domain-on-openwrt/)
- [Linksys WRT1900ac](https://wiki.openwrt.org/zh-cn/toh/linksys/wrt1900ac)
- [Linksys WRT AC Series](https://wiki.openwrt.org/toh/linksys/wrt_ac_series#tab__wrt1900acs3)
