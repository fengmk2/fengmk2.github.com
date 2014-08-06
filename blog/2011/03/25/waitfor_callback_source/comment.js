/* 评论系统
 * 
 * 所需要的数据表

CREATE TABLE  `demo`.`user` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `password` varchar(50) NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` timestamp,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_unique` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `demo`.`comment` (
  `id` int UNSIGNED AUTO_INCREMENT,
  `user_id` int UNSIGNED NOT NULL,
  `comment` text  NOT NULL,
  `filepath` varchar(2048)  COMMENT '附件存储路径',
  PRIMARY KEY (`id`)
)
ENGINE = InnoDB
CHARACTER SET utf8 COLLATE utf8_general_ci;

grant all privileges on demo.* to demo@localhost identified by '123456';

 * 模块依赖:
 *   node-mysql
 *   expressjs
 *   connect-form
 *   
 */



var path = require('path'),
	fs = require('fs'),
	Client = require('mysql').Client,
	express = require('express'),
	form = require('connect-form');

var mysql = new Client({
	host: 'localhost',
	user: 'demo',
	password: '123456',
	database: 'demo'
});
mysql.connect();

//创建所有目录
var mkdirs = function(dirpath, mode, callback) {
	path.exists(dirpath, function(exists) {
		if(exists) {
			callback(dirpath);
		} else {
			//尝试创建父目录，然后再创建当前目录
			mkdirs(path.dirname(dirpath), mode, function(){
				fs.mkdir(dirpath, mode, callback);
			});
		}
	});
};

// 使用connect-form，解析upload 请求
var app = express.createServer(
	form({keepExtensions: true})
);
app.use(express.static(__dirname + '/public'));
app.use(express.cookieParser());
app.use(express.bodyParser());

// 串行调用
app.post('/login', function(req, res, next){
	var name = req.body.name;
	var password = req.body.password;
	mysql.query('select * from user where name=?', 
			[name], function(err, rows){
		if(err) {
			next(err);
		} else {
			if(0 == rows.length) {
				// 用户不存在，直接使用当前用户名和密码注册
				mysql.query('insert into user set name=?, password=?',
						[name, password], function(err, result){
					if(err) {
						next(err);
					} else {
						var user_id = result.insertId;
						res.cookie('user_id', user.id, {path: '/', maxAge: 138000000});
						res.redirect('/');
					}
				});
			} else {
				// 判断密码
				var user = rows[0];
				if(user.password != password) {
					res.send(name + ' 密码不正确.');
				} else {
					// 登录成功，设置cookie
					// 保存30天
					res.cookie('user_id', user.id, {path: '/', maxAge: 138000000});
					res.redirect('/');
				}
			}
		}
	});
	
});

// 保存文件
function save_file(from_path, to_path, callback) {
	mkdirs(path.dirname(to_path), '777', function() {
		fs.rename(from_path, to_path, callback);
	});
};

// 保存评论
function save_comment(user_id, comment, filepath, callback) {
	mysql.query('insert into comment set user_id=?, comment=?, filepath=?',
			[user_id, comment, filepath], callback);
};

function return_comment_result(res, next) {
	return function(err, result) {
		if (err) {
			next(err);
		} else {
			res.send(result.insertId);
		}
	};
};

// 保存文件 -> 保存评论到数据库
app.post('/comment1', function(req, res, next){
	req.form.complete(function(err, fields, files){
		if (err) {
			next(err);
		} else {
			var user_id = req.cookies.user_id;
			var comment = fields.comment;
			var filepath = files.attachment ? 
					files.attachment.filename : null;
			if(filepath) {
				filepath = path.join(user_id, filepath);
				var size = files.resume.size;
				var save_path = path.join(__dirname, 
						'public/uploads', filepath);
				// 保存文件
				_save_file(files.attachment.path, save_path, function(){
					// 保存评论
					save_comment(user_id, comment, filepath, 
							return_comment_result(res, next));
				});
			} else {
				// 只需保存评论
				save_comment(user_id, comment, filepath, 
						return_comment_result(res, next));
			}
		}
	});
});


app.listen(9999);
console.log('web server start http://127.0.0.1:9999/');