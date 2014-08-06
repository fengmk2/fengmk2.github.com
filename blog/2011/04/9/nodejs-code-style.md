# Nodejs 代码规范

## 空格

### 缩进 tab => 2空格

    exports.print = function() {
      for (var i = 0, len = arguments.length; i < len; ++i) {
        process.stdout.write(String(arguments[i]));
      }
    };

### for, if 括号前后间隔 1空格

    function format(value, recurseTimes) {
      // Provide a hook for user-specified inspect functions.
      // Check that value is an object with an inspect function on it
      if (value && typeof value.inspect === 'function' &&
          // Filter out the util module, it's inspect function is special
          value !== exports &&
          // Also filter out any prototype objects using the circular check.
          !(value.constructor && value.constructor.prototype === value)) {
        return value.inspect(recurseTimes);
      }
    }
    
### function 只需后 ) 与 { 直接间隔 1空格
    
    function timestamp() {
      var d = new Date();
      var time = [pad(d.getHours()),
                  pad(d.getMinutes()),
                  pad(d.getSeconds())].join(':');
      return [d.getDate(), months[d.getMonth()], time].join(' ');
    }
    
## 相等判断，使用 === , !==

    readStream.addListener('data', function(chunk) {
      if (writeStream.write(chunk) === false) readStream.pause();
    });
    
    