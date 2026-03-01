#!/bin/bash

./node -v
./node $HOME/helloworld.js &
node_pid=$!
sleep 1

$HOME/pkgs/http_load-12mar2006/http_load -p 100 -s 10 $HOME/urlfile

echo "benchmark done, kill node process"

if [ ! -z $node_pid ]; then
    kill -9 $node_pid
fi
