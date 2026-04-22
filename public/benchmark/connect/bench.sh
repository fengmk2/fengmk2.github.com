siege -c10 -t10S http://127.0.0.1:3303/

siege --benchmark --concurrent=10 --time=10S --log=./siege.log http://127.0.0.1:3303/foo

siege --benchmark --concurrent=20 --time=10S --log=./siege.log http://127.0.0.1:3303/foo

siege --benchmark --concurrent=30 --time=10S --log=./siege.log http://127.0.0.1:3303/foo

siege --benchmark --concurrent=40 --time=10S --log=./siege.log http://127.0.0.1:3303/foo

siege --benchmark --concurrent=50 --time=10S --log=./siege.log http://127.0.0.1:3303/foo

siege --benchmark --concurrent=100 --time=10S --log=./siege.log http://127.0.0.1:3303/foo

siege --benchmark --concurrent=200 --time=10S --log=./siege.log http://127.0.0.1:3303/foo

siege --benchmark --concurrent=500 --time=10S --log=./siege.log http://127.0.0.1:3303/foo

siege --benchmark --concurrent=1000 --time=10S --log=./siege.log http://127.0.0.1:3303/foo

siege --benchmark --concurrent=100 --reps=100 --log=./siege.log http://127.0.0.1:3303/foo

#./http_load-12mar2006/http_load -parallel 100 -seconds 10 url_file
