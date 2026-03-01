# nodejs: 真正的一份代码，到处运行

## 现状: 冗余

在web开发中，我们是否常常会使用不同的编程语言实现相同的功能？

如一个文件上传功能，需要对上传文件进行文件格式限制。我们通常会使用后缀名做限制。

### 前端

为了用户体验，会在页面对用户选择的文件进行判断，合法才让用户可以上传。

    function is_filetype(filename, types) {
        types = types.split(',');
        var pattern = '\.(';
        for(var i=0; i<types.length; i++) {
            if(0 != i) {
                pattern += '|';
            }
            pattern += types[i].trim();
        }
        pattern += ')$';
        return new RegExp(pattern, 'i').test(filename);
    };
    
    // 此处省略N行代码
    if(!is_filetype($('#uploadfile').val(), 'doc,pdf,txt,wps,odf,md,png,gif,jpg')){
        can_submit = false; // 不允许上传
        $('#uploadfile').val('');
        alert('只允许上传: ' + constant.RESUME_FILETYPES);
    }
    // 此处省略N行代码
    

### 后端

由于担心恶意上传，无法避免地需要重新对用户上传的文件进行判断。
于是我又用python写了一个判断文件后缀的逻辑

    import re

    def is_filetype(filename, types):
        types = types.split(',')
        pattern = '\.(' + '|'.join([t.strip() for t in types]) + ')$';
        return re.search(pattern, filename, re.I) != None
    
    # web request handler
    # 此处省略N行代码

### 导致这样重复工作的原因是为什么？

1. 前端永远不可信；
2. 前端和后端使用不同的编程语言；

### 这样的冗余会带来什么代价？

1. 修改业务逻辑，需要重复做2次：如突然发现少支持了 *docx* 文件类型，需要同时修改javascript代码和python代码
2. 增加确保javascript代码和python代码业务逻辑一致的代价。需要分别写2种测试，unit test跑多一倍。

## nodejs时代：DRY

Use [nodejs](http://nodejs.org) no more [DRY](http://c2.com/cgi/wiki?DontRepeatYourself) !

### 一份代码，前端后端同时运行

    // constant.js
    (function(exports){
        
    exports.RESUME_FILETYPES = 'doc,docx,pdf,txt,wps,odf,md,png,gif,jpg';
    
    })( (function(){
        if(typeof exports === 'undefined') {
            window.constant = {};
            return window.constant;
        } else {
            return exports;
        }
    })() );

    // util.js
    (function(exports){
    
    /**
     * 移除字符串两端的空白字符
     *
     * @return {String}
     * @api public
     */
    String.prototype.trim = function(){ 
        return this.replace(/(^\s*)|(\s*$)/g, ""); 
    };
    
    /**
     * 判断是否自定类型的文件
     * 
     * @param {String}filename
     * @param {String}types, 多个类型使用,号分隔，如 doc,docx,txt
     * @return {Boolean} true or false
     * @api public
     */
    var is_filetype = exports.is_filetype = function(filename, types) {
        types = types.split(',');
        var pattern = '\.(';
        for(var i=0; i<types.length; i++) {
            if(0 != i) {
                pattern += '|';
            }
            pattern += types[i].trim();
        }
        pattern += ')$';
        return new RegExp(pattern, 'i').test(filename);
    };
    
    })( (function(){
        if(typeof exports === 'undefined') {
            window.util = {};
            return window.util;
        } else {
            return exports;
        }
    })() );

### 前端

    <script src="/js/util.js"></script>
    <script src="/js/constant.js"></script>
    
    // 此处省略N行代码
    if(!util.is_filetype($('#uploadfile').val(), constant.RESUME_FILETYPES)){
        can_submit = false; // 不允许上传
        $('#uploadfile').val('');
        alert('只允许上传: ' + constant.RESUME_FILETYPES);
    }
    // 此处省略N行代码

### 后端

    var util = require('./public/js/util.js'),
        constant = require('./public/js/constant.js');
    app.post('/resume/upload/:job_id', function(req, res, next){
        req.form.complete(function(err, fields, files){
            if(!util.is_filetype(filepath, constant.RESUME_FILETYPES)) {
                // 由于客户端已做判断，所以这样的情况都是恶意上传的，直接提示
                res.send('文件格式错误: ' + filepath 
                    + ' , 请上传' + constant.RESUME_FILETYPES + '格式的文件');
                return;
            }
            // save file ... 
            // 此处省略N行代码
        });
    });

wow，没冗余了吧！done

## 其他常用场景

 * 常量定义
 * 各种有用的工具模块，如字符串操作
 
## 有爱

^_^ 希望本文对你有帮助