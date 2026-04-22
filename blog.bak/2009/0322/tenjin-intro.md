# tenjin - 号称全球最快的模板引擎

Tenjin, "Tenjin is a very fast and full-featured template engine available in several script languages."

官方的测试结果： 也快得太夸张了

    MacOS X 10.4 Tiger, Intel CoreDuo 1.83GHz, Memory 2GB
        Language    Template Engine Test#1(sec) Test#2(sec)
        Python(2.5.1)   pyTenjin (0.6.1)    6.96    5.61
        Cheetah (2.0)   20.36   19.82
        Django (0.9.5)  71.33   59.80
        Myghty (1.1)    107.88  19.30
        Kid (0.9.6) 380.24  378.96
        Genshi (0.4.4)  560.30  271.69
        Mako (0.1.9)    17.78   13.49
        Templetor (web.py 0.22) 428.19  61.53
        Ruby(1.8.6) rbTenjin (0.6.0)    7.34    4.52
        eruby (1.0.5)   12.29   11.53
        ERB(def_method) (Ruby1.8.6) 36.73   5.85
        PHP(5.2.0)  phpTenjin (0.0.1)   5.39    3.64
        Smarty (2.6.18) 10.84   10.21
        Perl(5.8.8) plTenjin (0.0.1)    10.42   5.72
        Template-Toolkit(XS) (2.18) 103.58  26.30
        HTML::Template (2.9)    46.70   30.21
        JS(spidermonkey)    jsTenjin (0.0.1)    19.00   12.98
        JS(Rhino, JDK5) jsTenjin (0.0.1)    24.29   19.15
        Java(JDK5)  Velocity (1.4)  22.80   11.41
        Velocity (1.5)  20.01   8.42
 
这样一来，就可以做到在web端和浏览器端使用相同的模板语法了.

python的例子:

    <html>
      <body>
        <h1>${title}</h1>
        <table>
    <?py i = 0 ?>
    <?py for item in items: ?>
    <?py     i += 1 ?>
    <?py     color = i % 2 == 0 and '#FFCCCC' or '#CCCCFF' ?>
          <tr bgcolor="#{color}">
            <td>#{i}</td>
            <td>${item}</td>
          </tr>
    <?py #endfor ?>
        </table>
      </body>
    </html>
    javascript的例子:
    <html>
      <body>
        <h1>${title}</h1>
        <table>
    <?js for (var i = 0, n = items.length; i < n; i++) { ?>
    <?js    var color = i % 2 == 1 ? '#FFCCCC' : '#CCCCFF'; ?>
          <tr bgcolor="#{color}">
            <td>#{i+1}</td>
            <td>${items[i]}</td>
          </tr>
    <?js } ?>
        </table>
      </body>
    </html>
    
希望本文介绍的内容对你有用! ^_^