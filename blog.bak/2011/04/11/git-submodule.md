# git submodule，解决依赖模块更新

## git submodule add 添加项目的依赖模块

在项目的根目录添加子模块

    $ cd demo_project
    $ git submodule add git://github.com/felixge/node-mysql.git deps/mysql
    $ git submodule init
    $ git submodule update
    # 提交更改

## git submodule init and update 就可以直接获取依赖模块了

    $ git submodule init
    
    Submodule 'deps/connect' (git://github.com/senchalabs/connect.git) registered for path 'deps/connect'
    Submodule 'deps/connect-form' (git://github.com/visionmedia/connect-form.git) registered for path 'deps/connect-form'
    Submodule 'deps/express' (git://github.com/visionmedia/express.git) registered for path 'deps/express'
    Submodule 'deps/formidable' (git://github.com/felixge/node-formidable.git) registered for path 'deps/formidable'
    Submodule 'deps/jqtpl' (git://github.com/kof/node-jqtpl.git) registered for path 'deps/jqtpl'
    Submodule 'deps/mime' (git://github.com/bentomas/node-mime.git) registered for path 'deps/mime'
    Submodule 'deps/mysql' (git://github.com/felixge/node-mysql.git) registered for path 'deps/mysql'
    Submodule 'deps/node-weibo' (git://github.com/fengmk2/node-weibo.git) registered for path 'deps/node-weibo'
    Submodule 'deps/nodeunit' (git://github.com/caolan/nodeunit.git) registered for path 'deps/nodeunit'
    Submodule 'deps/qs' (git://github.com/visionmedia/node-querystring.git) registered for path 'deps/qs'

    $ git submodule status
    
    4b5a36540b26ce13e1d7af3e0a1f2341730d03db deps/connect (1.3.0)
    e861cc85d66e13dbc3a671c1ac72af988de20100 deps/connect-form (0.2.1)
    961146a287b00d30285a33041eade42a0b3c92ec deps/express (2.2.1-6-g961146a)
    5d98e9c75c8642c1a3f39d1741b839cc44aa2be7 deps/formidable (v0.9.11-2-g5d98e9c)
    72abc952c779a994ac94dd79a198638b7b1e1cec deps/jqtpl (heads/master)
    da62624813ef2790834a683fa487a74d2f5ea7b4 deps/mime (heads/master)
    0790eba1a8caf90385bc5ec52f2b9a438f270e80 deps/mysql (v0.9.1-2-g0790eba)
    23e7427da78bbf934a2eb8007dfd372c1a025e2a deps/node-weibo (heads/master)
    121df84c6865e7e57d19c51eb742313db3dedaed deps/nodeunit (0.4.0-60-g121df84)
    534b70356c9f615a50c54534d20b4c3e650e1072 deps/qs (0.0.7-1-g534b703)

## 删除submodule，竟然没哟命令

先删除git文件中出现的相关信息

    .git/config
    .gitmodules
    
将本地缓存也清除，然后直接删除问题，提交修改

    git rm --cached path/to/submodule
    rm -r path/to/submodule

## 有爱

希望本文对你有用 ^_^
