# django接入新浪微博OAuth

最近将网站和新浪微博进行了整合，思路很简单，就是将页面内容和新浪微博联系起来，一个独立内容的页面对于一条微博，自然评论系统只需要使用微博的评论即可。
然后，用户需要发表评论的话，肯定要接入oauth，不可能让用户登录你的网站来发评论吧？没有谁会将自己的账号和密码告诉你的。
查看了新浪微博的授权机制，然后下载了python版的sdk，就可以在django上接入oauth了。
 
## 对于oauth很陌生的同学，请先查看OAUTH协议简介

其实流程很简单：

1. get_request_token -> 
2. create_auth_url -> 
3. [user_login: 跳转到新浪登录页面，用户登陆后会跳转回来] -> 
4. get_access_token -> 
5. done!
 
在django上结合python版的sdk的具体实现代码，已经有很详细的注释了： 

## oauth_views.py

    #!/usr/bin/env python
    # -*- coding: utf-8 -*-
    """
    基于django的新浪微博oauth views
    需要django的session支持
    """
    
    from django.http import HttpResponseRedirect
    from weibopy import OAuthHandler, oauth, WeibopError
    
    consumer_key = '' # 设置你申请的appkey
    consumer_secret = '' # 设置你申请的appkey对于的secret
    
    class WebOAuthHandler(OAuthHandler):
        
        def get_authorization_url_with_callback(self, callback, signin_with_twitter=False):
            """Get the authorization URL to redirect the user"""
            try:
                # get the request token
                self.request_token = self._get_request_token()
    
                # build auth request and return as url
                if signin_with_twitter:
                    url = self._get_oauth_url('authenticate')
                else:
                    url = self._get_oauth_url('authorize')
                request = oauth.OAuthRequest.from_token_and_callback(
                    token=self.request_token, callback=callback, http_url=url
                )
                return request.to_url()
            except Exception, e:
                raise WeibopError(e)
    
    
    def _get_referer_url(request):
        referer_url = request.META.get('HTTP_REFERER', '/')
        host = request.META['HTTP_HOST']
        if referer_url.startswith('http') and host not in referer_url:
            referer_url = '/' # 避免外站直接跳到登录页而发生跳转错误
        return referer_url
    
    def _oauth():
        """获取oauth认证类"""
        return WebOAuthHandler(consumer_key, consumer_secret)
    
    def login(request):
        # 保存最初的登录url，以便认证成功后跳转回来
        back_to_url = _get_referer_url(request)
        request.session['login_back_to_url'] = back_to_url
        
        # 获取oauth认证url
        login_backurl = request.build_absolute_uri('/login_check')
        auth_client = _oauth()
        auth_url = auth_client.get_authorization_url_with_callback(login_backurl)
        # 保存request_token，用户登录后需要使用它来获取access_token
        request.session['oauth_request_token'] = auth_client.request_token
        # 跳转到登录页面
        return HttpResponseRedirect(auth_url)
        
    def login_check(request):
        """用户成功登录授权后，会回调此方法，获取access_token，完成授权"""
        # http://mk2.com/?oauth_token=c30fa6d693ae9c23dd0982dae6a1c5f9&oauth_verifier=603896
        verifier = request.GET.get('oauth_verifier', None)
        auth_client = _oauth()
        # 设置之前保存在session的request_token
        request_token = request.session['oauth_request_token']
        del request.session['oauth_request_token']
        
        auth_client.set_request_token(request_token.key, request_token.secret)
        access_token = auth_client.get_access_token(verifier)
        # 保存access_token，以后访问只需使用access_token即可
        request.session['oauth_access_token'] = access_token
        
        # 跳转回最初登录前的页面
        back_to_url = request.session.get('login_back_to_url', '/')
        return HttpResponseRedirect(back_to_url)
    
    def logout(request):
        """用户登出，直接删除access_token"""
        del request.session['oauth_access_token']
        back_to_url = _get_referer_url(request)
        return HttpResponseRedirect(back_to_url)
        
希望对你有用 ^_^