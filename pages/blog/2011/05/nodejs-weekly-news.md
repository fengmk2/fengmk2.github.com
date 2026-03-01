# nodejs一周动态(2011-05-05 - 05-15)

## [Google Go boldly goes where no code has gone before](http://www.theregister.co.uk/2011/05/05/google_go/)

文章中说到与Nodejs的对比: [The New Node?](http://www.theregister.co.uk/2011/05/05/google_go/page4.html)

    Node.js shows great numbers for heavy numbers of clients, and they've done a really good job. 
    But if those clients are CPU-intensive, they've got no place to go. 
    You can't get the parallelism you need. 
    With Go, you get the best of both worlds: 
    You get many clients easily handled, and if they're CPU intensive, 
    you can imagine scaling to a much larger number of requests.

同步形式的异步代码:

    That lets you write asynchronous code in a synchronous style. 
    As people, we're much better suited to writing about things in a synchronous style.

Node作者 Ryan Dahl 回答:

    JavaScript is a familiar language to a whole generation of developers,
    The ability to apply an existing programming language 
        to the domain of writing servers goes a long way towards being 'easy'.
    The Node runtime doesn't provide parallel execution, 
    if you like, you can take advantage of the parallelism in the operating system, 
    "pre-forking" the Node server.

此文章还引起在nodejs用户的讨论: [Google's Go language](http://groups.google.com/group/nodejs/browse_thread/thread/b9656566d87eef4c)

## [NodeConf Slides: NodeConf演讲稿](https://gist.github.com/958556)

Ryan Dahl 在[Node v0.5 Roadmap](http://nodejs.org/nodeconf.pdf) 讲到，
将在下一版本实现对windows的原生支持，不再需要Cygwin的辅助了。

Ryan Dahl’s NodeConf slides includes some background on liboio with a focus on Windows support.

    Today Node runs on Windows via Cygwin. This is an unacceptable port. 
    Cygwin is slow, old, buggy. Users hate it

更多PPT请查看: https://gist.github.com/958556

## [nTunes](https://github.com/TooTallNate/nTunes)

nTunes (MIT License) by Nathan Rajlich is a REST API for controlling iTunes. 
There’s an npm package, but you might want to install this globally: 

    npm install -g nTunes. 
    
Once it’s installed and you’ve run nTunes, it can be used like this:

    ~$ nTunes
              ______                                     
             /\__  _\                                    
      ___    \/_/\ \/   __  __    ___       __     ____  
    /' _ `\     \ \ \  /\ \/\ \ /' _ `\   /'__`\  /',__\ 
    /\ \/\ \     \ \ \ \ \ \_\ \/\ \/\ \ /\  __/ /\__, `\
    \ \_\ \_\     \ \_\ \ \____/\ \_\ \_\\ \____\\/\____/
     \/_/\/_/      \/_/  \/___/  \/_/\/_/ \/____/ \/___/
      v0.1.0
              HTTP Server started on port: 8888
         Type 'help' for a list of runtime commands...
    
    curl localhost:8888/current%20track/name
    // "Tres Brujas"
    
    curl -d value=50 localhost:8888/sound%20volume
    // Volume changed to 50
    
## [Kanso](http://kansojs.org/)

![Kanso Logo](http://dailyjs.com/images/posts/kanso.png)
完全利用javascript可以运行在浏览器端和服务器的特性，将使web开发达到机制体验。
什么时Kanso：

Modern web development increasingly means pushing more logic onto the client. 
This provides us with fast and responsive interfaces, but not without cost. 
When grafted onto traditional web-frameworks, rich interfaces require the complete re-implementation of features on both the server and client-side. 
Form validation, Templating and URL routing must either be handled at both ends or become fragile and insecure.

开发一个web应用有多快？可以看看[Kanso的教程](http://kansojs.org/tutorial.html)： http://kansojs.org/tutorial.html

## [IBM Doesn't Care About Node.Js People](http://blog.nodejitsu.com/ibm-doesnt-care-about-nodejs-people)

IBM上的[一篇关于Nodejs的文章](http://www.ibm.com/developerworks/opensource/library/os-nodejs/index.html)写得太过分，
激怒了Nodejs社区上的许多开发者。
为了避免误导Nodejs的新开发者，[Marak Squires](http://github.com/marak) 写了此文章来申讨IBM的上的这篇不负责任的文章。

