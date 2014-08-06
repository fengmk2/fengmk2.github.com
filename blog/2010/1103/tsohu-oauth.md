# 搜狐微博的oauth

最近拿到了搜狐微博(t.sohu.com)的oauth开发key，本想做个oauth登录的，可是发现在发中文微博的时候，总是提示401认证不通过:
 
    {"code":401,"error":"This method requires authentication.",
        "request":"/statuses/upload.json"}。
 
然后我试着发全ASCII码的微博，竟然可以发成功。
 
这样就定位到有可能是我用的utf-8编码有问题，于是尝试了个种中文编码gb2312, gbk 还有更多其他编码，都是一个401不通过的结果。
 
在和搜狐的开发技术支持沟通期间，我突然间灵光一动，会不会是urlencode的问题？

然后我将没有urlencode之前的微博status用来算oauth的签名，然后发送，晕，竟然成功了。

oauth签名的参数不是http的参数吗？怎么是urlencode编码前的参数呢？
 
为了求证对比，我尝试了twitter和新浪微博的oauth，果然，他们都是使用http的参数，即urlencode之后的参数进行签名的。
 
无论如何，总算解决搜狐微博oauth的问题，感谢期间热情给我技术支持的搜狐微博开放人员。
 
^_^