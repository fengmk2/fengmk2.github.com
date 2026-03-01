# 让python的Cookie.py模块支持:冒号做key

虽然Cookie的标准是不允许:冒号出现在key里面的，但是我们的开发人员是很可爱的，常常会让我们意想不到。

为了做好兼容性，只能选择兼容:冒号。

很简单，修改一下Cookie.Morsel

    #!/usr/bin/python
    # -*- coding: utf-8 -*-
    """MorselHook
    fix Cookie.CookieError: Illegal key value: ys-tab:entrance:e
    """
    
    import Cookie
    import string
    
    _Morsel = Cookie.Morsel
    
    class MorselHook(_Morsel):
        """
        >>> import inspect
        >>> (inspect.getargspec(MorselHook.set)[3])[0]
        "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!#$%&'*+-.^_`|~:"
        >>> cookie = Cookie.SimpleCookie()
        >>> cookie.load("ys-tab:entrance:e=abc; webpy_session_id=75eb60dcc83e2d902146af0bb7f47afe61fbd2b2")
        >>> print cookie
        Set-Cookie: webpy_session_id=75eb60dcc83e2d902146af0bb7f47afe61fbd2b2;
        Set-Cookie: ys-tab:entrance:e=abc;
        """
        def set(self, key, val, coded_val, 
                LegalChars=Cookie._LegalChars+':', 
                idmap=string._idmap, 
                translate=string.translate):
            return super(MorselHook, self).set(key, val, 
                    coded_val, LegalChars, idmap, translate)
        
    Cookie.Morsel = MorselHook
    
    # 在你需要使用到Cookie的地方先让上面的代码执行一遍
    
    
    if __name__ == '__main__':
        import doctest
        doctest.testmod()
        
### 有爱

^_^ 希望本文对你有用。