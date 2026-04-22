# Nodejs asynchronous programming bring "Accidental complexity" : Nodejs异步编程带来的意外复杂性
参考原文: [What's missing from NodeJS](http://mihai.bazon.net/blog/whats-missing-from-node)


How could you not be interested in language features, since, after all, you write in that language and it's the single most important thing once you get past [accidental complexity](http://en.wikipedia.org/wiki/Accidental_complexity).

A part of those projects were written for fun, and others for learning. But many, probably, were written out of necessity. Now when you see a dozen “control flow” libraries that deal with “asynchronous programming” you begin to wonder if this is a serious problem. And it is. If you want to fetch 3 values from a database and print their sum, you need to do something like this:

    get_val("foo", function(foo){
        get_val("bar", function(bar){
            get_val("baz", function(baz){
                print(foo + bar + baz);
            });
        });
    });

