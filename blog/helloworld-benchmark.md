# Nodejs "Hello world" benchmark

## 新版本 nodejs 性能

本文将记录 nodejs 历史更新中所有版本的hello world性能测试。

### 测试环境

```
MacBook Pro 
13-inch, Mid 2010

Processor  2.4 GHz Intel Core 2 Duo
Memory  8 GB 1067 MHz DDR3
Software  OS X 10.8.2 (12C60)
```
    
### 测试 helloworld.js

```js
var http = require('http');

http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('Hello World\n');
}).listen(1337, "127.0.0.1");

console.log('Server running at http://127.0.0.1:1337/');
```

### siege 压测命令 

```bash
$ siege -c 100 -b -t 10s http://127.0.0.1:1337/
```

## 测试结果: trans/sec (QPS)

<script src="https://www.google.com/jsapi"></script>
<script>
google.load("visualization", "1", {packages:["corechart"]});
google.setOnLoadCallback(function() {
  var datas = [
    ['0', 7681, 7702, null, 8157, null, 7490, null, 7130],
    ['1', 7710, 7724, null, 8240, null, 7975, 9347, 7136],
    ['2', 7520, 7728, null, 8138, 8127, 7965, 9200, 7410],
    ['3', 7381, 7802, null, 8070, 7931, 7930, 8999, 7500],
    ['4', 6568, 7933, null, 8111, null, 7981, 9000, 7488],
    ['5', 6980, 7926, null, 8060, 8073, 7960, 8880, 7480],
    ['6', 7099, 7759, null, 8046, 6995, 7931, 7815, 7525],
    ['7', 6999, 7840, null, 7791, 7098, 7916, 7871, null],
    ['8', 6845, 7886, null, 7673, 7071, 6588, 7810, null],
    ['9', null, 7656, null, null, 7259, 7606, null, null],
    ['10', null, 7801, null, null, 8200, 7600, null, null],
    ['11', null, 7833, null, null, null, 7558, null, null],
    ['12', null, 7803, null, null, null, 7510, null, null],
    ['13', null, 7700, null, null, null, null, null, null],
    ['14', null, 7593, null, null, null, null, null, null],
    ['15', null, 7659, null, null, null, null, null, null],
    ['16', null, 7649, null, null, null, null, null, null],
    ['17', null, 7613, null, null, null, null, null, null],
    ['18', null, 7679, null, null, null, null, null, null],
    ['19', null, null, null, null, null, null, null, null],
    ['20', null, null, null, null, null, null, null, null],
    ['21', null, null, null, null, null, null, null, null],
  ];
  var versions = [
    'v0.9.x', 'v0.8.x', 'v0.7.x', 'v0.6.x', 
    'v0.5.x', 'v0.4.x', 'v0.3.x', 'v0.2.x'
  ];
  drawChart(versions, datas);
});

function drawChart(versions, datas) {
  var data = new google.visualization.DataTable();
  data.addColumn('string', 'Version');
  for (var i = 0; i < versions.length; i++) {
    data.addColumn('number', versions[i] + ' QPS');
  }
  data.addRows(datas);
  var options = {
    width: '100%', height: 700,
    title: '"Hello world" benchmark in Nodejs'
  };
  var chart = new google.visualization.LineChart(document.getElementById('chart_div'));
  chart.draw(data, options);
}
</script>

<div id="chart_div"></div>

* v0.9.x
<table>
  <tr>
    <th>0.9.8</th><th>0.9.7</th><th>0.9.6</th><th>0.9.5</th><th>0.9.4</th>
    <th>0.9.3</th><th>0.9.2</th><th>0.9.1</th><th>0.9.0</th>
  </tr>
  <tr>
    <td>6845</td><td>6999</td><td>7099</td><td>6980</td><td>6568</td>
    <td>7381</td><td>7520</td><td>7710</td><td>7681</td>
  </tr>
</table>

* v0.8.x
<table>
  <tr>
    <th>0.8.19</th>
    <th>0.8.18</th><th>0.8.17</th><th>0.8.16</th><th>0.8.15</th><th>0.8.14</th>
    <th>0.8.13</th><th>0.8.12</th><th>0.8.11</th><th>0.8.10</th><th>0.8.9</th>
    <th>0.8.8</th><th>0.8.7</th><th>0.8.6</th><th>0.8.5</th><th>0.8.4</th>
    <th>0.8.3</th><th>0.8.2</th><th>0.8.1</th><th>0.8.0</th>
  </tr>
  <tr>
    <th>0.8.19</th>
    <th>7679</th><th>7613</th><th>7649</th><th>7659</th><th>7593</th>
    <th>7700</th><th>7803</th><th>7833</th><th>7801</th><th>7656</th>
    <th>7886</th><th>7840</th><th>7759</th><th>7926</th><th>7933</th>
    <th>7802</th><th>7728</th><th>7724</th><th>7702</th>
  </tr>
</table>

* v0.7.x
<table>
    <tr>
        <th>0.7.0</th>
    </tr>
    <tr>
        <td>7676</td>
    </tr>
</table>
* v0.6.x
<table>
  <tr>
    <th>0.6.8</th><th>0.6.7</th><th>0.6.6</th><th>0.6.5</th><th>0.6.4</th>
    <th>0.6.3</th><th>0.6.2</th><th>0.6.1</th><th>0.6.0</th>
  </tr>
  <tr>
    <td>7673</td><td>7791</td><td>8046</td><td>8060</td><td>8111</td>
    <td>8070</td><td>8138</td><td>8240</td><td>8157</td>
  </tr>
</table>
* v0.5.x
<table>
    <tr>
        <th>0.5.10</th><th>0.5.9</th><th>0.5.8</th><th>0.5.7</th><th>0.5.6</th>
        <th>0.5.5</th><th>0.5.4</th><th>0.5.3</th><th>0.5.2</th><th>0.5.1</th>
        <th>0.5.0</th>
    </tr>
    <tr>
        <td>8200</td><td>7259</td><td>7071</td><td>7098</td><td>6996</td>
        <td>8073</td><td>-</td><td>7931</td><td>8127</td><td>-</td><td>-</td>
    </tr>
</table>
* v0.4.x
<table>
    <tr>
        <th>0.4.12</th><th>0.4.11</th><th>0.4.10</th><th>0.4.9</th><th>0.4.8</th>
        <th>0.4.7</th><th>0.4.6</th><th>0.4.5</th><th>0.4.4</th><th>0.4.3</th>
        <th>0.4.2</th><th>0.4.1</th><th>0.4.0</th>
    </tr>
    <tr>
        <td>7510</td><td>7558</td><td>7600</td><td>7606</td><td>6588</td>
        <td>7916</td><td>7931</td><td>7960</td><td>7981</td><td>7930</td>
        <td>7965</td><td>7975</td><td>7490</td>
    </tr>
</table>
* v0.3.x
<table>
    <tr>
        <th>0.3.8</th><th>0.3.7</th><th>0.3.6</th><th>0.3.5</th><th>0.3.4</th>
        <th>0.3.3</th><th>0.3.2</th><th>0.3.1</th><th>0.3.0</th>
    </tr>
    <tr>
        <td>7810</td><td>7871</td><td>7815</td><td>8880</td><td>9000</td>
        <td>8999</td><td>9200</td><td>9347</td><td>-</td>
    </tr>
</table>
* v0.2.x
<table>
    <tr>
        <th>0.2.6</th><th>0.2.5</th><th>0.2.4</th><th>0.2.3</th>
        <th>0.2.2</th><th>0.2.1</th><th>0.2.0</th>
    </tr>
    <tr>
        <td>7525</td><td>7481</td><td>7489</td><td>7500</td>
        <td>7410</td><td>7136</td><td>7130</td>
    </tr>
</table>
* v0.1.x
<table>
    <tr>
        <th>0.1.104</th><th>0.1.103</th><th>0.1.102</th><th>0.1.101</th><th>0.1.100</th>
        <th>0.1.99</th><th>0.1.98</th><th>0.1.97</th><th>0.1.96</th><th>0.1.95</th>
        <th>0.1.94</th><th>0.1.93</th><th>0.1.92</th><th>0.1.91</th><th>0.1.90</th>
        <th>0.1.0</th>
    </tr>
    <tr>
        <td>7640</td><td>7538</td><td>7537</td><td>7674</td><td>7040</td>
        <td>7280</td><td>7211</td><td>7340</td><td>7270</td><td>7210</td>
        <td>7063</td><td>7931</td><td>8020</td><td>8561</td><td>8146</td>
        <td>-</td>
    </tr>
</table>

## v0.6.0与v0.4.12的性能对比

在[v0.6.0更新](http://blog.nodejs.org/2011/11/05/node-v0-6-0/) 说明文章中，列出的对比数据

### v0.4.12 (linux) v0.6.0 (linux)

```
http_simple.js /bytes/1024  5461 r/s    6263 r/s
io.js read                  19.75 mB/s  26.63 mB/s
io.js write                 21.60 mB/s  17.40 mB/s
startup.js                  74.7 ms     49.6 ms
```

### v0.4.12 (windows: Cygwin)   v0.6.0 (windows)

```
http_simple.js /bytes/1024  3858 r/s    5823 r/s
io.js read                  12.41 mB/s  26.51 mB/s
io.js write                 12.61 mB/s  33.58 mB/s
startup.js                  152.81 ms   52.04 ms
```

v0.4 和 v0.6之间的更新说明请查看: [API-changes-between-v0.4-and-v0.6](https://github.com/joyent/node/wiki/API-changes-between-v0.4-and-v0.6)
        
## 有爱
^_^ 希望本文对你有用