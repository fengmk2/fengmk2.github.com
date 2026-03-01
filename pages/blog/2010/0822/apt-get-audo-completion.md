# 让apt-get的自动补全打开

    $ vi ~/.bashrc
     
    # enable programmable completion features 
    # (you don't need to enable this, if it's already enabled in 
    # /etc/bash.bashrc and /etc/profile# sources /etc/bash.bashrc).
    if [ -f /etc/bash_completion ]; then  
    　　. /etc/bash_completion
    fi
 
若发现/etc/bash_completion文件不存在， 则安装bash-completion

    $ sudo apt-get install bash-completion
    
重新导入/etc/bash_completion

    $ source /etc/bash_completion
 
然后，没有然后了，可以自动补全了，安装的软件吧！

^_^