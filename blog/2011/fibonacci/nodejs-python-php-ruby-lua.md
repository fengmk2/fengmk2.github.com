# fibonacci(40) benchmark

[Node.js is Cancer](http://teddziuba.com/2011/10/node-js-is-cancer.html) show a wrong way to use nodejs.
But the test code **[Fibonacci](http://en.wikipedia.org/wiki/Fibonacci)** is so funny.
I implement the **fibonacci function** in other **[Dynamic Languages](http://en.wikipedia.org/wiki/Dynamic_programming_language)** for comparison testing.

## Languages

### Dynamic

* [nodejs](http://nodejs.org)
* [nodejs + cpp module](http://kkaefer.github.com/node-cpp-modules)
* [python](http://python.org)
* [pypy](http://pypy.org/): a fast, compliant alternative implementation of the Python language. 
* [jython](http://www.jython.org/)
* [perl](http://perl.org) 
* [php](http://www.php.net/)
* [ruby](http://www.ruby-lang.org/)
* [lua](http://www.lua.org/)
* [luajit](http://luajit.org/): a Just-In-Time Compiler for Lua.

### Static

* [c](http://en.wikipedia.org/wiki/C_programming_language)
* [go](http://golang.org/)
* [java](http://www.java.com/)
* [scala](http://www.scala-lang.org/)

If you want to help add more dynamic languagues, please leave the **implement code** in comments.

## Results

(^_^) c > java > go > scala > luajit > nodejs > ruby 2.0.0-p0 > pypy > ruby 1.9.3+ > lua > php > python > perl > ruby 1.8.x (T_T)

<table>
  <tr><th>Language</th><th>Times (user)</th><th>Position</th><th>Version</th></tr>
  <tr>
    <td style="color: green;">c with -O2</td>
    <td>0m0.202s</td>
    <td>#0</td>
    <td>i686-apple-darwin11-llvm-gcc-4.2 (GCC) 4.2.1 <br/>
      (Based on Apple Inc. build 5658) (LLVM build 2336.11.00)
    </td>
  </tr>
  <tr>
    <td style="color: green;">nodejs + cpp module</td>
    <td>0m1.001s</td>
    <td>#1</td>
    <td>v0.8.8, gcc -O2</td>
  </tr>
  <tr>
    <td style="color: green;">java</td>
    <td>0m1.305s</td>
    <td>#2</td>
    <td>Java(TM) SE Runtime Environment (build 1.6.0_35-b10-428-11M3811)<br/>
      Java HotSpot(TM) 64-Bit Server VM (build 20.10-b01-428, mixed mode)
    </td>
  </tr>
  <tr>
    <td style="color: green;">go</td>
    <td>0m1.667s</td>
    <td>#3</td>
    <td>go version go1.0.2</td>
  </tr>
  <tr>
    <td style="color: green;">scala</td>
    <td>0m1.808s</td>
    <td>#4</td>
    <td>Scala code runner version 2.9.2 -- Copyright 2002-2011, LAMP/EPFL</td>
  </tr>
  <tr>
    <td style="color: green;">luajit</td>
    <td>0m2.579s</td>
    <td>#5</td>
    <td>LuaJIT 2.0.0-beta10 -- Copyright (C) 2005-2012 Mike Pall.</td>
  </tr>
  <tr>
    <td style="color: green;">nodejs</td>
    <td>0m2.872s</td>
    <td>#6</td>
    <td>v0.8.8</td>
  </tr>
  <tr>
    <td style="color: red;">ruby 2.0.0-p0</td>
    <td>0m27.777s</td>
    <td>#7</td>
    <td>ruby 2.0.0p0 (2013-02-24 revision 39474) [x86_64-darwin12.2.0]</td>
  </tr>
  <tr>
    <td style="color: red;">pypy</td>
    <td>0m30.010s</td>
    <td>#8</td>
    <td>Python 2.7.2 (341e1e3821ff, Jun 07 2012, 15:42:54) [PyPy 1.9.0 with GCC 4.2.1]</td>
  </tr>
  <tr>
    <td style="color: red;">ruby 1.9.x</td>
    <td>0m37.404s</td>
    <td>#9</td>
    <td>ruby 1.9.3p194 (2012-04-20 revision 35410) [x86_64-darwin12.1.0]</td>
  </tr>
  <tr>
    <td style="color: red;">lua</td>
    <td>0m40.709s</td>
    <td>#10</td>
    <td>Lua 5.1.4 Copyright (C) 1994-2008 Lua.org, PUC-Rio</td>
  </tr>
  <tr>
    <td style="color: red;">jython</td>
    <td>0m53.699s</td>
    <td>#11</td>
    <td>Jython 2.5.2</td>
  </tr>
  <tr>
    <td style="color: red;">php</td>
    <td>1m17.728s</td>
    <td>#12</td>
    <td>PHP 5.4.6 (cli) (built: Sep  8 2012 23:49:53) </td>
  </tr>
  <tr>
    <td style="color: red;">python</td>
    <td>1m17.979s</td>
    <td>#13</td>
    <td>Python 2.7.2</td>
  </tr>
  <tr>
    <td style="color: red;">perl</td>
    <td>2m41.259s</td>
    <td>#14</td>
    <td>This is perl 5, version 12, subversion 4 (v5.12.4) built for darwin-thread-multi-2level</td>
  </tr>
  <tr>
    <td style="color: red;">ruby 1.8.x</td>
    <td>3m35.135s</td>
    <td>#15</td>
    <td>ruby 1.8.7 (2012-02-08 patchlevel 358) [universal-darwin12.0]</td>
  </tr>
</table>

**lua** use *local function* will get better performance.

## fibonacci(40) benchmark result:

### c
i686-apple-darwin11-llvm-gcc-4.2 (GCC) 4.2.1 (Based on Apple Inc. build 5658) (LLVM build 2336.11.00)

```c
#include <stdio.h>

int fibonacci(n) {
  if (n < 2) {
    return n;
  }
  return fibonacci(n - 2) + fibonacci(n - 1);
}

int main() {
  printf("%d\n", fibonacci(40));
  return 0;
}
```

gcc -O0

```bash
102334155

real  0m4.145s
user  0m3.892s
sys 0m0.012s
```

gcc -O1

```bash
102334155

real  0m2.732s
user  0m2.610s
sys 0m0.009s
```

gcc -O2

```bash
102334155

real  0m0.249s
user  0m0.202s
sys 0m0.004s
```

gcc -O3

```bash
102334155

real  0m0.293s
user  0m0.202s
sys 0m0.004s
```

### java
java version "1.6.0_35"
Java(TM) SE Runtime Environment (build 1.6.0_35-b10-428-11M3811)
Java HotSpot(TM) 64-Bit Server VM (build 20.10-b01-428, mixed mode)

```java
public class Fibonacci {
  public static int fib(int n) {
    if (n < 2) {
      return n;
    } else {
      return fib(n - 1) + fib(n - 2);
    }
  }

  public static void main(String[] args) {
    System.out.print(fib(40) + "\n");
  }
}
```

```bash
102334155

real  0m1.413s
user  0m1.305s
sys 0m0.063s
```

### scala
Scala code runner version 2.9.2 -- Copyright 2002-2011, LAMP/EPFL

```scala
object Fibonacci {
  def fib(n: Int): Int = n match {
    case 0 | 1 => n
    case _ => fib(n -1) + fib(n-2)
  }
  
  def main(args: Array[String]) {
    println(fib(40));
  }
}
```

```bash
102334155

real  0m1.909s
user  0m1.808s
sys 0m0.121s
```

### go
go version go1.0.2

```go
package main

import "fmt"

func fibonacci(n int) int{
  if (n < 2) {
    return n
  }
  return fibonacci(n - 2) + fibonacci(n - 1)
}

func main() {
  fmt.Println(fibonacci(40))
}
```

```bash
102334155

real  0m1.732s
user  0m1.667s
sys 0m0.006s
```

### nodejs

```js
function fibonacci(n) {
  if (n < 2) {
    return n;
  }
  return fibonacci(n - 2) + fibonacci(n - 1);
}

console.log(fibonacci(40));
```

v0.2.6

```bash
102334155

real  0m4.959s
user  0m4.699s
sys 0m0.028s
```

v0.3.8

```bash
102334155

real  0m4.961s
user  0m4.867s
sys 0m0.022s
```

v0.4.12

```bash
102334155

real  0m7.544s
user  0m7.219s
sys 0m0.030s
```

v0.6.19

```bash
102334155

real  0m5.264s
user  0m5.062s
sys 0m0.040s
```

v0.6.20

```bash
102334155

real  0m5.413s
user  0m5.195s
sys 0m0.038s
```

v0.6.21-pre

```bash
102334155

real  0m5.081s
user  0m4.906s
sys 0m0.037s
```

v0.7.12

```bash
102334155

real  0m2.964s
user  0m2.867s
sys 0m0.029s
```

v0.8.0

```bash
102334155

real  0m3.034s
user  0m2.868s
sys 0m0.029s
```

v0.8.1

```bash
102334155

real  0m3.064s
user  0m2.863s
sys 0m0.032s
```

v0.8.3

```bash
102334155

real  0m3.024s
user  0m2.855s
sys 0m0.030s
```

v0.8.6

```bash
102334155

real  0m3.046s
user  0m2.854s
sys 0m0.030s
```

v0.8.7

```bash
102334155

real  0m3.258s
user  0m2.933s
sys 0m0.033s
```

v0.8.8

```bash
102334155

real  0m3.052s
user  0m2.866s
sys 0m0.031s
```

v0.9.1

```bash
102334155

real  0m3.190s
user  0m2.852s
sys 0m0.032s
```

### nodejs + cpp module

```js
var fibonacci = require('./build/Release/cppfibonacci').fibonacci;
console.log(fibonacci(40));
```

waf 1.5.16 (7610:7647M)
v0.4.12

```bash
102334155

real  0m1.374s
user  0m1.012s
sys 0m0.024s
```

waf 1.5.16 (7610:7647M)
v0.6.20

```bash
102334155

real  0m1.063s
user  0m1.000s
sys 0m0.018s
```

waf 1.5.16 (7610:7647M)
v0.8.8

```bash
102334155

real  0m1.076s
user  0m1.001s
sys 0m0.015s
```

### luajit
LuaJIT 2.0.0-beta10 -- Copyright (C) 2005-2012 Mike Pall. http://luajit.org/

```lua
function fibonacci(n)
  if n < 2 then
    return n
  end
  return fibonacci(n - 2) + fibonacci(n - 1)
end

io.write(fibonacci(40), "\n")
```

```bash
102334155

real  0m2.847s
user  0m2.579s
sys 0m0.013s
```

using 'local'

```lua
local function fibonacci(n)
  if n < 2 then
    return n
  end
  return fibonacci(n - 2) + fibonacci(n - 1)
end

io.write(fibonacci(40), "\n")
```

```bash
102334155

real  0m2.536s
user  0m2.490s
sys 0m0.006s
```

### pypy
Python 2.7.2 (341e1e3821ff, Jun 07 2012, 15:42:54)
[PyPy 1.9.0 with GCC 4.2.1]

```py
def fibonacci(n):
    if n < 2:
        return n
    return fibonacci(n - 2) + fibonacci(n - 1)

print fibonacci(40)
```

```bash
102334155

real  0m34.082s
user  0m30.010s
sys 0m0.303s
```

### ruby 1.9.x

```ruby
def fibonacci(n)
  if n < 2
    return n
  end
  return fibonacci(n - 2) + fibonacci(n - 1)
end

puts fibonacci(40)
```

ruby 1.9.3p194 (2012-04-20 revision 35410) [x86_64-darwin12.1.0]

```bash
102334155

real  0m39.972s
user  0m37.404s
sys 0m0.124s
```

ruby 2.0.0p0 (2013-02-24 revision 39474) [x86_64-darwin12.2.0]

```bash
102334155

real  0m29.078s
user  0m27.777s
sys 0m0.072s
```

### lua
Lua 5.1.4  Copyright (C) 1994-2008 Lua.org, PUC-Rio

```lua
function fibonacci(n)
  if n < 2 then
    return n
  end
  return fibonacci(n - 2) + fibonacci(n - 1)
end

io.write(fibonacci(40), "\n")
```

```bash
102334155

real  0m42.961s
user  0m40.709s
sys 0m0.098s
```

using 'local'

```lua
local function fibonacci(n)
  if n < 2 then
    return n
  end
  return fibonacci(n - 2) + fibonacci(n - 1)
end

io.write(fibonacci(40), "\n")
```

```bash
102334155

real  0m37.178s
user  0m35.887s
sys 0m0.081s
```

### python && jython
Python 2.7.2

```py
def fibonacci(n):
    if n < 2:
        return n
    return fibonacci(n - 2) + fibonacci(n - 1)

print fibonacci(40)
```

```bash
102334155

real  1m23.989s
user  1m17.979s
sys 0m0.303s
```

Jython 2.5.2

```bash
102334155

real  0m58.651s
user  0m53.699s
sys 0m1.945s
```

### php
PHP 5.3.13 with Suhosin-Patch (cli) (built: Jun 20 2012 17:05:20) 

```php
<?php
function fibonacci($n) {
  if ($n < 2) {
    return $n;
  }
  return fibonacci($n - 2) + fibonacci($n - 1);
}
echo fibonacci(40)."\n";
?>
```

```bash
102334155

real  1m43.579s
user  1m36.905s
sys 0m0.349s
```

PHP 5.4.6 (cli) (built: Sep  8 2012 23:49:53) 

```bash
102334155

real  1m25.155s
user  1m17.728s
sys 0m0.261s
```

### perl
This is perl 5, version 12, subversion 4 (v5.12.4) built for darwin-thread-multi-2level

```perl
sub fibonacci {
  my $n = shift;
  if ($n < 2) {
    return $n;
  }
  return fibonacci($n - 2) + fibonacci($n - 1);
}
print fibonacci(40), "\n";
```

```bash
102334155

real  2m53.937s
user  2m41.259s
sys 0m0.592s
```

### ruby 1.8.x

```ruby
def fibonacci(n)
  if n < 2
    return n
  end
  return fibonacci(n - 2) + fibonacci(n - 1)
end

puts fibonacci(40)
```

ruby 1.8.7 (2012-02-08 patchlevel 358) [universal-darwin12.0]

```bash
102334155

real  3m59.076s
user  3m35.135s
sys 0m0.833s
```

## Conclusion

* **go** is **awsome**!
* **nodejs** is **FAST**, v0.8+ is **FASTER**. 
* **luajit** 2X faster than nodejs@0.6.x, **Shocking**.
* **ruby 1.9.x** faster than lua.
