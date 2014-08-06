# 基于KV数据库的文件系统 FileSystem Impl on Key-Value Database

## 需求
* 分布式文件系统
* 分布式系统的自动扩展

## 基本的文件系统操作

### 公共
* stat
* rename

### 文件夹
* mkdir
* rmdir
* readdir

### 文件
* open
* read
* write
* unlink (delete)

## 文件操作的实现
以文件路径为key，文件内容为value，可以很容易实现文件的基本操作。

### a模式的文件更新(append)
如果是append模式的文件写操作，所有数据更新都是以追加形式插入的，
那么同步到数据库中也只需同步增加的那部分数据。
PUT 
range oldsize_start:appendsize

new data bytes

### 文件重命名rename
由于KV数据库对变更key操作很少支持，所以一般情况下只能使用copy模式。
将数据从旧的path复制到新的path。

## 文件夹操作的实现
### 文件夹在KV中的实现
以文件夹路径为key，文件夹所包含的子元素为内容，存储到KV数据库。

### 文件夹重命名rename
