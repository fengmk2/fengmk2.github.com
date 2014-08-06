# nodejs: mkdirs 递归创建目录

nodejs里面的所有文件操作我们很显然地都会选择异步方式。

nodejs对于文件的基本操作果然是很基本的。例如我们想创建一个二级目录：/abc/def，使用fs.mkdir必须先判断/abc，存在，才继续创建/abc/def。这样几个一层层的callback，必要会影响代码的美观性（^_^，写代码也是一门艺术）。
于是乎有了一下通过递归对fs.mkdir和path.exists的封装，得到的目录创建 辅助函数：mkdirs

    // 创建所有目录
    var mkdirs = module.exports.mkdirs = function(dirpath, mode, callback) {
        path.exists(dirpath, function(exists) {
            if(exists) {
                    callback(dirpath);
            } else {
                    //尝试创建父目录，然后再创建当前目录
                    mkdirs(path.dirname(dirpath), mode, function(){
                            fs.mkdir(dirpath, mode, callback);
                    });
            }
        });
    };
    
看，是不是漂亮了许多？

### 有爱

^_^，希望文本对你有用。