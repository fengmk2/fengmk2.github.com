# 关于__proto__的链式记忆

## 实例化解析：

    function Foo() {};
    
    var foo = new Foo();
    foo.__proto__ === Foo.prototype;
    foo.__proto__.__proto__ === Object.prototype;
    foo.__proto__.__proto__.__proto__ === null;
    foo.prototype === undefined;
    foo.toString === Object.prototype.toString;
    
## 原形继承后的实例化解析：

    function Bar() {};
    
    Bar.prototype.__proto__ = Foo.prototype;
    
    var bar = new Bar();
    bar.__proto__ === Bar.prototype;
    bar.__proto__.__proto__ === Foo.prototype;
    bar.__proto__.__proto__.__proto__ === Object.prototype;
    bar.__proto__.__proto__.__proto__.__proto__ === null;
    bar.prototype === undefined;
    bar.toString === Object.prototype.toString
    
对象bar，访问toString，整个链式过程如下：

    bar.toString 
        || bar.__proto__.toString 
        || bar.__proto__.__proto__.toString
        || bar.__proto__.__proto__.__proto__.toString 
    
    bar.toString === Object.prototype.toString
    
最终调用的是 Object.prototype.toString 

## 奇怪的Foo.toString

    Foo.__proto__ === Function.prototype;
    Foo.__proto__.__proto__ === Object.prototype;
    Foo.prototype.__proto__ === Object.prototype;
    // 神奇竟然不等于 Object.prototype.toString
    Foo.toString === Object.toString;
    Foo.prototype.toString === Object.prototype.toString;

每个function生成的时候都直接被设置了toString 等于 Object.toString了。

## 参考文档
* [實體關係的確定](https://developer.mozilla.org/zh_tw/Core_JavaScript_1.5_%E6%95%99%E5%AD%B8/%E5%86%8D%E8%AB%87%E5%B1%AC%E6%80%A7%E7%9A%84%E7%B9%BC%E6%89%BF/%E5%AF%A6%E9%AB%94%E9%97%9C%E4%BF%82%E7%9A%84%E7%A2%BA%E5%AE%9A)
* [A re-introduction to JavaScript](https://developer.mozilla.org/cn/A_re-introduction_to_JavaScript)

## 有爱
希望本文对你有用 ^_^
