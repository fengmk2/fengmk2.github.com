
# 在jQuery 1.5+ 的jqXHR上监听文件上传进度(xhr.upload)

## XMLHttpRequest.upload
在Firefox, Google Chrome and Safari中，如果通过XMLHttpRequest上传文件，
是可以通过监听XMLHttpRequest.upload对象的progress事件来查看进度的。

    var xhr = new XMLHttpRequest();
    xhr.upload.addEventListener("progress", function (evt) {
        // display uploading progress infomation...
    });
    
## xhr.upload在jQuery中消失了？
在看完[JQuery最佳实践](http://www.ruanyifeng.com/blog/2011/08/jquery_best_practices.html)后，
决定使用最新版本的jQuery 1.6.2替换一下正在使用的1.4.2，果然，性能在感觉上有提升。
可是悲剧的发现，怎么上传文件的进度不见了。调试发现，原来xhr.upload不见了。

查看jQuery的[jqXHR](http://api.jquery.com/jQuery.ajax/#jqXHR)文档，
发现jqXHR不是XMLHttpRequest的简单扩展。

## 怎样才能拿到原始的XMLHttpRequest？
只要在$.ajax请求中拿到原始的XMLHttpRequest，然后监听upload对象的progress事件，就可以解决此问题了。
于是乎，为了拿到原始的XMLHttpRequest，我们需要写一小段代码。

根据[jQuery.ajax](http://api.jquery.com/jQuery.ajax/)文档，xhr是可以自己提供的：

    xhr: Function
        Default: ActiveXObject when available (IE), 
        the XMLHttpRequest otherwise Callback for creating 
        the XMLHttpRequest object. 
        Defaults to the ActiveXObject when available (IE), 
        the XMLHttpRequest otherwise. 
        Override to provide your own implementation for 
        XMLHttpRequest or enhancements to the factory.

于是，我们就可以自己提供xhr，然后设置progress事件：
    
    function onprogress(evt) {
        // display uploading progress infomation...
    };
    var xhr_provider = function() {
        var xhr = jQuery.ajaxSettings.xhr();
        if(onprogress && xhr.upload) {
            xhr.upload.addEventListener('progress', onprogress, false);
        }
        return xhr;
    };
    
    $.ajax({
        url: url,
        timeout: 5*60*1000,
        type : 'post',
        data: bb.getBlob(),
        contentType: 'multipart/form-data; boundary=' + boundary,
        processData: false,
        xhr: xhr_provider,
        success: function() {},
        error: function() {}
    });
    
## 有爱
其实本文主要目的是推广"[JQuery最佳实践](http://www.ruanyifeng.com/blog/2011/08/jquery_best_practices.html)",
赶紧看，然后赶紧看看自己如何使用jQuery的。

希望本文对你有用。 ^_^
