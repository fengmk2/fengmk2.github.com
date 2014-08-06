# Google Appengine 的自动部署脚本

你是否在appengine上注册了N个应用？每次代码更新都很痛苦？！

在我痛苦了很久后，总算找到一种可以自动部署方式，并写成了脚本，共大家分享

## deploy.py

    #!/usr/bin/env python
    # -*- coding: utf-8 -*-
    
    # 将 {project_name} 替换成你的项目目录
    # 将 {password} 替换成你的密码文件
    # 将 {email} 替换成你的email
    
    import sys
    import os
    import urllib2

    
    def deploy(no):
        tpl = open('app.yaml', 'rb')
        try:
            tpl_data = tpl.read().replace('{{no}}', str(no))
            to_f = open('./source/app.yaml', 'wb')
            try:
                to_f.write(tpl_data)
            finally:
                to_f.close()
        finally:
            tpl.close()
        os.system('appcfg.py --passin --email={email} update {project_name} < {password}')
    
    if __name__ == '__main__':
        start, end = int(sys.argv[1]), int(sys.argv[2]) + 1
        for i in range(start, end):
            deploy(i)
        
## app.yaml

    application: demo{{no}}
    version: 1
    runtime: python
    api_version: 1
    
    handlers:
    - url: .*
      script: main.py

## 运行
    
    # 慢慢等吧，^_^
    python deploy.py 0, 10000

## 有爱
^_^希望对你有用

    