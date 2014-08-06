# 常用命令

## 网络连接数

```bash
$ netstat -n | awk '/^tcp/ {++S[$NF]} END {for(a in S) print a, S[a]}'

TIME_WAIT 9
CLOSE_WAIT 3
ESTABLISHED 355
```

## 监听端口

```bash
lsof -p $id
```

## 最大文件数

```bash
cat /proc/sys/fs/file-max
```