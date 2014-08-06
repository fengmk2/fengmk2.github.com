# NodeBlog v0.1.0发布
[NodeBlog](https://github.com/fengmk2/nodeblog):http://nodeblog.org/ 是一个基于[node.js](nodejs.org)的开源博客程序。

## Features

 * Write, Read, List, Search blog.
 * Comments
 * Support image and file upload.
 * DIY template
 * Support nodester.com, no.de... nodejs host services
 * Simple to install
 * Support post to twitter, facebook, weibo, tqq and so on.
 * Speed
 * Support MetaWeblog API Sync

## Requirements

 * [libxml2](http://www.xmlsoft.org/), libxml2-devel
 * [node.js](http://nodejs.org/)
 * v8 (comes bundled with node, no need to install)
 * [scons](http://www.scons.org/) (for building)
 * [mongodb](http://www.mongodb.org/)

### Ubuntu
    
    $ sudo apt-get install libxml2 libxml2-dev scons mongodb

### CentOS

    $ sudo yum install libxml2 libxml2-devel 
    
    # install scons
    $ wget http://prdownloads.sourceforge.net/scons/scons-2.1.0.alpha.20101125.tar.gz
    $ cd scons-2.1.0.alpha.20101125
    $ sudo python setup.py install
    
    # install mongodb
    # see: http://www.mongodb.org/display/DOCS/CentOS+and+Fedora+Packages

## Node Modules Install

    $ sudo npm install express express-resource weibo metaweblog mongoose github-flavored-markdown

## Install NodeBlog
    
    $ git clone git://github.com/fengmk2/nodeblog.git
    $ git submodule init
    $ git submodule update

## Demo
http://nodeblog.org/
