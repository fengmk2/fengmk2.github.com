echo "## fibonacci(40) benchmark result:\n"

echo "### c"
gcc --version | head -1
echo "\n\`\`\`c"
cat fibonacci.c
echo "\n\`\`\`"

echo "\ngcc -O0"
gcc -O0 fibonacci.c

echo "\n\`\`\`bash"
time ./a.out
echo "\`\`\`\n"
rm a.out

echo "gcc -O1"
gcc -O1 fibonacci.c

echo "\n\`\`\`bash"
time ./a.out
echo "\`\`\`\n"
rm a.out

echo "gcc -O2"
gcc -O2 fibonacci.c

echo "\n\`\`\`bash"
time ./a.out
echo "\`\`\`\n"
rm a.out

echo "gcc -O3"
gcc -O3 fibonacci.c

echo "\n\`\`\`bash"
time ./a.out
echo "\`\`\`\n"
rm a.out

echo "### java"
java -version
echo "\n\`\`\`java"
cat Fibonacci.java
echo "\n\`\`\`"
javac Fibonacci.java

echo "\n\`\`\`bash"
time java Fibonacci
echo "\`\`\`\n"
rm Fibonacci.class

echo "### scala"
scala -version
echo "\n\`\`\`scala"
cat Fibonacci.scala
echo "\n\`\`\`"
scalac Fibonacci.scala

echo "\n\`\`\`bash"
time scala Fibonacci
echo "\`\`\`\n"
rm Fibonacci$.class Fibonacci.class

echo "### go"
go version
echo "\n\`\`\`go"
cat fibonacci.go
echo "\n\`\`\`"
go build fibonacci.go

echo "\n\`\`\`bash"
time ./fibonacci
echo "\`\`\`\n"
rm fibonacci

echo "### nodejs"
echo "\n\`\`\`js"
cat fibonacci.js
echo "\n\`\`\`\n"

$HOME/git/nvm/v0.2.6/bin/node -v
echo "\n\`\`\`bash"
time $HOME/git/nvm/v0.2.6/bin/node fibonacci.js
echo "\`\`\`\n"

$HOME/git/nvm/v0.3.8/bin/node -v
echo "\n\`\`\`bash"
time $HOME/git/nvm/v0.3.8/bin/node fibonacci.js
echo "\`\`\`\n"

$HOME/git/nvm/v0.4.12/bin/node -v
echo "\n\`\`\`bash"
time $HOME/git/nvm/v0.4.12/bin/node fibonacci.js
echo "\`\`\`\n"

$HOME/git/nvm/v0.6.19/bin/node -v
echo "\n\`\`\`bash"
time $HOME/git/nvm/v0.6.19/bin/node fibonacci.js
echo "\`\`\`\n"

$HOME/git/nvm/v0.6.20/bin/node -v
echo "\n\`\`\`bash"
time $HOME/git/nvm/v0.6.20/bin/node fibonacci.js
echo "\`\`\`\n"

$HOME/git/nvm/v0.6.21/bin/node -v
echo "\n\`\`\`bash"
time $HOME/git/nvm/v0.6.21/bin/node fibonacci.js
echo "\`\`\`\n"

$HOME/git/nvm/v0.7.12/bin/node -v
echo "\n\`\`\`bash"
time $HOME/git/nvm/v0.7.12/bin/node fibonacci.js
echo "\`\`\`\n"

$HOME/git/nvm/v0.8.0/bin/node -v
echo "\n\`\`\`bash"
time $HOME/git/nvm/v0.8.0/bin/node fibonacci.js
echo "\`\`\`\n"

$HOME/git/nvm/v0.8.1/bin/node -v
echo "\n\`\`\`bash"
time $HOME/git/nvm/v0.8.1/bin/node fibonacci.js
echo "\`\`\`\n"

$HOME/git/nvm/v0.8.3/bin/node -v
echo "\n\`\`\`bash"
time $HOME/git/nvm/v0.8.3/bin/node fibonacci.js
echo "\`\`\`\n"

$HOME/git/nvm/v0.8.6/bin/node -v
echo "\n\`\`\`bash"
time $HOME/git/nvm/v0.8.6/bin/node fibonacci.js
echo "\`\`\`\n"

$HOME/git/nvm/v0.8.7/bin/node -v
echo "\n\`\`\`bash"
time $HOME/git/nvm/v0.8.7/bin/node fibonacci.js
echo "\`\`\`\n"

$HOME/git/nvm/v0.8.8/bin/node -v
echo "\n\`\`\`bash"
time $HOME/git/nvm/v0.8.8/bin/node fibonacci.js
echo "\`\`\`\n"

$HOME/git/nvm/v0.9.1/bin/node -v
echo "\n\`\`\`bash"
time $HOME/git/nvm/v0.9.1/bin/node fibonacci.js
echo "\`\`\`\n"

echo "### nodejs + cpp module"

echo "\n\`\`\`js"
cat cppfibonacci.js
echo "\n\`\`\`\n"

$HOME/git/nvm/v0.4.12/bin/node-waf --version
$HOME/git/nvm/v0.4.12/bin/node -v
$HOME/git/nvm/v0.4.12/bin/node-waf configure 1>/dev/null 2>&1
$HOME/git/nvm/v0.4.12/bin/node-waf build 1>/dev/null 2>&1
mv build/default build/Release
echo "\n\`\`\`bash"
time $HOME/git/nvm/v0.4.12/bin/node cppfibonacci.js
echo "\`\`\`\n"

$HOME/git/nvm/v0.6.20/bin/node-waf --version
$HOME/git/nvm/v0.6.20/bin/node -v
$HOME/git/nvm/v0.6.20/bin/node-waf configure 1>/dev/null 2>&1
$HOME/git/nvm/v0.6.20/bin/node-waf build 1>/dev/null 2>&1
echo "\n\`\`\`bash"
time $HOME/git/nvm/v0.6.20/bin/node cppfibonacci.js
echo "\`\`\`\n"

$HOME/git/nvm/v0.8.8/bin/node-waf --version
$HOME/git/nvm/v0.8.8/bin/node -v
$HOME/git/nvm/v0.8.8/bin/node-waf configure 1>/dev/null 2>&1
$HOME/git/nvm/v0.8.8/bin/node-waf build 1>/dev/null 2>&1
echo "\n\`\`\`bash"
time $HOME/git/nvm/v0.8.8/bin/node cppfibonacci.js
echo "\`\`\`\n"
rm -rf build

echo "### luajit"
luajit -v

echo "\n\`\`\`lua"
cat fibonacci.lua
echo "\n\`\`\`"

echo "\n\`\`\`bash"
time luajit fibonacci.lua
echo "\`\`\`"

echo "\nusing 'local'"
echo "\n\`\`\`lua"
cat fibonacci.lua.local
echo "\n\`\`\`"

echo "\n\`\`\`bash"
time luajit fibonacci.lua.local
echo "\`\`\`\n"

echo "### pypy"
pypy --version

echo "\n\`\`\`py"
cat fibonacci.py
echo "\n\`\`\`"

echo "\n\`\`\`bash"
time pypy fibonacci.py
echo "\`\`\`\n"

echo "### ruby 1.9.x"

echo "\n\`\`\`ruby"
cat fibonacci.rb
echo "\n\`\`\`"

/usr/local/Cellar/ruby/1.9.3-p194/bin/ruby -v

echo "\n\`\`\`bash"
time /usr/local/Cellar/ruby/1.9.3-p194/bin/ruby fibonacci.rb
echo "\`\`\`\n"

echo "### lua"
lua -v

echo "\n\`\`\`lua"
cat fibonacci.lua
echo "\n\`\`\`"

echo "\n\`\`\`bash"
time lua fibonacci.lua
echo "\`\`\`\n"

echo "using 'local'"
echo "\n\`\`\`lua"
cat fibonacci.lua.local
echo "\n\`\`\`"

echo "\n\`\`\`bash"
time lua fibonacci.lua.local
echo "\`\`\`\n"

echo "### python && jython"
python -V

echo "\n\`\`\`py"
cat fibonacci.py
echo "\n\`\`\`"

echo "\n\`\`\`bash"
time python fibonacci.py
echo "\`\`\`\n"

/usr/local/Cellar/jython/2.5.2/libexec/jython --version
echo "\n\`\`\`bash"
time /usr/local/Cellar/jython/2.5.2/libexec/jython fibonacci.py
echo "\`\`\`\n"

echo "### php"
php -v | head -1

echo "\n\`\`\`php"
cat fibonacci.php
echo "\n\`\`\`"

echo "\n\`\`\`bash"
time php fibonacci.php
echo "\`\`\`\n"

$HOME/apps/php-5.4.6/sapi/cli/php -v | head -1

echo "\n\`\`\`bash"
time $HOME/apps/php-5.4.6/sapi/cli/php fibonacci.php
echo "\`\`\`\n"

echo "### perl"
perl -v | head -2 | grep version

echo "\n\`\`\`perl"
cat fibonacci.pl
echo "\n\`\`\`"

echo "\n\`\`\`bash"
time perl fibonacci.pl
echo "\`\`\`\n"

echo "### ruby 1.8.x"

echo "\n\`\`\`ruby"
cat fibonacci.rb
echo "\n\`\`\`"

ruby -v | head -1

echo "\n\`\`\`bash"
time ruby fibonacci.rb
echo "\`\`\`\n"
