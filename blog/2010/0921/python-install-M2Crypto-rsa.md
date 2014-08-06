# 编译安装M2Crypto-0.20.2

最新需要用到RSA对称密钥加密，所以需要用到[M2Crypto](http://chandlerproject.org/Projects/MeTooCrypto#M2Crypto)，可怜的我发现编译这东西一点都不容易，以下是我的杯具经验总结。

## 服务器环境

    $ lsb_release -a
    
    LSB Version::core-3.0-ia32:core-3.0-noarch:graphics-3.0-ia32:graphics-3.0-noarch
    Distributor ID:RedHatEnterpriseAS
    Description:Red Hat Enterprise Linux AS release 4 (Nahant Update 4)
    Release:4
    Codename:NahantUpdate4
    
下载[M2Crypto-0.20.2.tar.gz](http://pypi.python.org/packages/source/M/M2Crypto/M2Crypto-0.20.2.tar.gz#md5=6c24410410d6eb1920ea43f77a93613a) 
(一定要是0.20.2，要不然会出现 "undefined symbol: RSA_verify_PKCS1_PSS" 错误)

## M2Crypto安装失败，请进行以下排查

依赖环境：

    0.20.2:
    Python 2.3 or newer
    m2urllib2 requires Python 2.4 or newer
    OpenSSL 0.9.7 or newer
    Some optional new features will require OpenSSL 0.9.8 or newer
    SWIG 1.3.28 or newer required for building
    SWIG 1.3.30 or newer may be required with Python 2.5 or newer and Python 2.4 with Py_ssize_t patches
    $ swig -version

若swig的版本小于1.3.29，则先安装新版本的[swig-2.0.0](http://prdownloads.sourceforge.net/swig/swig-2.0.0.tar.gz)

    $ tar zxvf swig-2.0.0.tar.gz
    $ cd swig-2.0.0
    $ ./configure --prefix=$HOME/local/swig
    $ make && make install
    # 设置$HOME/local/swig/bin 到环境变量PATH，替换原来的swig
    $ source ~/.bash_profile

解压编译M2Crypto-0.20.2

    $ tar zxvf M2Crypto-0.20.2.tar.gz
    $ cd M2Crypto-0.20.2/
    $ ~/local/python/bin/python setup.py build

若出现错误提示1： (早期的OpenSSL 0.9.7会有以下问题)
    
    “This openssl-devel package does not work your architecture?”

则修改setup.py文件，将#'-D__i386__' 的注释去掉 (或直接下载已修改好的[setup.py](http://files.cnblogs.com/fengmk2/setup.zip) 文件替换原来的)

若出现错误提示2：

    “/usr/include/openssl/opensslconf.h:13: Error: Unable to find 'opensslconf-i386.h'”
    # 则先将'opensslconf-i386.h'复制到当前目录
    $ cp /usr/include/openssl/opensslconf-i386.h ./
 
重新编译安装

    $ ~/local/python/bin/python setup.py build
    $ ~/local/python/bin/python setup.py install
 
^_^ 成功了吧！