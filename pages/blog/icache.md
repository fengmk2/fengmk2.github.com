# Indexed Cache
To store key value datas. Only two buffer: index and data

# 索引
save的时候自动创建，顺序索引，二分查找

    key     data_offset   data_size
| 4 bytes |  4 bytes    |  4bytes   |

key: 从 0 到 2^32 的整型数据

# 数据存储

顺序存储，最大存储空间2^32 bytes