# Bash one liners explained

links:

* http://www.catonmat.net/blog/bash-one-liners-explained-part-one/

# Working with files 文件操作

## 1. 生成空文件

```bash
$ > file
```

替换文件内容或者创建文件填充内容

```bash
$ echo "hello bash" > file
```

## 2. 文件追加内容

```bash
$ echo "I'm append content." >> file
```

如果你不想出现换行符，那么需要在`echo`增加一个`-n`参数:

```bash
$ echo -n "Hi, man." >> file
```

## 3. 读取文件的第一行内容

```bash
$ read -r line < file
$ IFS= read -r line < file
$ line=$(head -1 file)
$ line=`head -1 file`
```

## 4. 一行行地读取文件

```bash
$ while read -r line; do
    # do something with $line
done < file
```

```bash
$ while IFS= read -r line; do
    # do something with $line
done < file
```

```bash
$ cat file | while IFS= read -r line; do
    # do something with $line
done
```
