var mdit = require('mdit');
var ndir = require('ndir');
var path = require('path');
var fs = require('fs');

var existsSync = fs.existsSync || path.existsSync;
var page_layout = path.join(__dirname, 'page-layout.html');
var layout = path.join(__dirname, 'layout.html');
var slideLayout = path.join(__dirname, 'ppt', 'slides.tpl.html');

var root = process.argv[2] ? path.join(__dirname, process.argv[2]) : __dirname;
if (fs.statSync(root).isFile()) {
  if (/\/index\.md$/.test(root)) {
    var out = mdit.toHTML(root, layout);
  } else if (/\.md$/.test(root)) {
    if (root.indexOf('/ppt/') >= 0) {
      var out = mdit.toSlides(root, slideLayout);
    } else {
      var out = mdit.toHTML(root, page_layout);
    }
  } else {
    var out = root + ' is not a markdown.';
  }
  console.log(out);
  return;
}

var walker = ndir.walk(root, function (dir, files) {
  if (dir.indexOf('/.git') >= 0) {
    return;
  }
  for (var i = 0, l = files.length; i < l; i++) {
    var info = files[i];
    if (info[1].isFile()) {
      var ext = path.extname(info[0]);
      var name = path.basename(info[0]);
      if (ext === '.md') {
        var out;
        if (info[0].indexOf('/ppt/') >= 0) {
          out = mdit.toSlides(info[0]);
        } else if (name === 'index.md') {
          out = mdit.toHTML(info[0], layout);
        } else {
          out = mdit.toHTML(info[0], page_layout);
        }
        console.log(out);
      }
    }
  }
});

walker.on('end', function () {
  console.log('start build index...');
  ndir.walk('./', function (dir, files) {
    if (dir.indexOf('/.git') >= 0) {
      return;
    }
    files.sort(function (a, b) {
      if (a[1].isFile() && !b[1].isFile()) {
        return 1;
      }
      if (!a[1].isFile() && b[1].isFile()) {
        return -1;
      }
      return a[0] > b[0] ? -1 : 1;
    });
    var indexfile = path.join(dir, 'index.md');
    var needIndex = dir !== __dirname;
    if (needIndex) {
      if (dir.indexOf('/blog') < 0 && dir.indexOf('/collections') < 0) {
        return;
      }
      var dirurl = dir.replace(__dirname, '');
      var list = '#Index of ' + dirurl + '\n';
      for (var i = 0, l = files.length; i < l; i++) {
        var info = files[i];
        var url = info[0].replace(__dirname, '');
        var ext = path.extname(info[0]);
        var name = path.basename(info[0]);
        var isDir = info[1].isDirectory();
        if (isDir) {
          name = url + '/';
        } else if (name !== 'index.html' && ext === '.html') {
          var mdpath = info[0].replace(/\.html$/, '.md');
          if (existsSync(mdpath)) {
            var md = fs.readFileSync(mdpath, 'utf-8');
            var title = md.split('\n', 1)[0].substring(1); // skip `#`
            name = title;
          }
        } else {
          name = null;
        }
        if (name) {
          list += '* [' + name + '](' + url + ')\n';
        }
      }
      // console.log(list)
      fs.writeFileSync(indexfile, list);
      mdit.toHTML(indexfile, page_layout);
      fs.unlinkSync(indexfile);
    }
  });
});
