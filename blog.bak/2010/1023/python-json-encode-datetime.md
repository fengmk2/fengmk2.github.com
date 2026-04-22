# 让python json encode datetime类型

python2.6+ 自带的json模块，不支持datetime的json encode，每次都需要手动转为字符串，很累人，我们可以自己封装一个简单的方法处理此问题.
实现代码如下:

    import json
    from datetime import date, datetime
    
    
    def __default(obj):
        if isinstance(obj, datetime):
            return obj.strftime('%Y-%m-%dT%H:%M:%S')
        elif isinstance(obj, date):
            return obj.strftime('%Y-%m-%d')
        else:
            raise TypeError('%r is not JSON serializable' % obj)
    
    print json.dumps({
            'd': datetime.now(), 
            'today': date.today(), 
            'x': 111
        }, default=__default)
                         
希望对你有用^_^
