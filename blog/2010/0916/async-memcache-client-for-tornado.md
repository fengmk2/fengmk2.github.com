# async_memcache for tornado

[tornado](http://www.tornadoweb.org) 是一个纯[python](http://python.org) 实现的非阻塞web服务器，自带了异步httpclient，可以异步请求http网络资源。

在实际应用中，我们常常需要访问memcached等资源，发现官方并没有具体实现memcache异步客户端，但是tornado留出了ioloop让我们很容易就可以实现异步的socket网络访问。
于是参照memcache的通信协议，我简单实现了一个异步socket的memcache客户端。

# 使用示例

源代码下载: [async_memcache.py](http://code.google.com/p/net4team/source/browse/trunk/net4libs/async_memcache.py)
    
    if __name__ == '__main__':
        client = MemcacheClient('localhost', 11211)
        def get_callback(val):
            print val
        client.set('hello', 'world', get_callback)
        client.set('hello3', 'world3', get_callback)
        client.get('hello3', get_callback)
        client.get('hello2', get_callback)
        client.get(['hello', 'hello2', 'hello3'], get_callback)
        
        client.set('hello4', 'abc', get_callback)
        client.get('hello4', get_callback)
        client.append('hello4', 'append', get_callback)
        client.get('hello4', get_callback)
        client.prepend('hello4', 'prepend', get_callback)
        client.get('hello4', get_callback)
        client.delete('hello4', get_callback)
        client.get('hello4', get_callback)
        client.delete('hello4', get_callback)
        IOLoop.instance().start()
        
希望对你有用 ^_^