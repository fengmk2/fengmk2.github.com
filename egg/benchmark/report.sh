echo "config,name,latency_min,latency_max,latency_mean,latency_stdev,duration,requests,bytes,req_per_sec,byte_per_sec" > view/stats.csv
grep view stats.csv >> view/stats.csv

echo "config,name,latency_min,latency_max,latency_mean,latency_stdev,duration,requests,bytes,req_per_sec,byte_per_sec" > hello/stats.csv
grep hello stats.csv >> hello/stats.csv

echo "config,name,latency_min,latency_max,latency_mean,latency_stdev,duration,requests,bytes,req_per_sec,byte_per_sec" > passport/stats.csv
grep passport stats.csv >> passport/stats.csv
