# http://ryerh.com/proxy/2016/02/19/polipo-proxy.html
nohup polipo socksParentProxy=localhost:1080 &
http_proxy=http://localhost:8123 curl -v twitter.com
