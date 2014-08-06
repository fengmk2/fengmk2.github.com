$(document).ready(function(){
	$(document.body).height(window.innerHeight);
	$(window).resize(function(){
		$(document.body).height(window.innerHeight);
	});
	var num_img = new Image();
	num_img.src = 'matrix.png';
	num_img.onload = function(){
		var Number = function() {
			var green = [];
			var white = [];
			function draw(n, fix){
				var c = document.createElement('canvas');
				c.width = 80;
				c.height = 100;
				var ct = c.getContext('2d');
				ct.drawImage(num_img, 0, i * 100 + fix, 80, 100, 0, 0, 80, 100);
				return c;
			}
			for (var i = 0; i < 10; i++) {
				green[i] = draw(i, 0);
				white[i] = draw(i, 1000);
			}
			function toArray(arr){
				var arr1 = [];
				var i = 0;
				for (var k in arr) {
					arr1[i++] = arr[k];
				}
				return arr1;
			}
			return {
				getGreen : function(n){
					return green[n];
				},
				getWhite : function(n){
					return white[n];
				},
				getLine : function(min, max){
					var size = Math.random() * (max - min) + min;

					var stack = [];
					for (var i = 0; i < size; i++) {
						stack[i] = i % 10;
					}
					var scale = Math.round(Math.random() * 6 + 1) / 7;
					var line = {
						scale : scale,
						speed : (scale + 1) * (scale) * 7,
						length : size,
						width : 80,
						height : 80 * size,
						realWidth : 0,
						realHeight : 0,
						str : '',
						chars : [],
						canvas : document.createElement('canvas'),
						context : null,
						img : null,
						toString : function(){
							return this.str;
						},
						draw : function(){
							for (var i = 0; i < this.chars.length; i++){
								this.context.drawImage(this.chars[i][1],
									0, 0, 80, 80, 0, i * 80, 80, 80);
							}
							return this;
						}
					};
					line.canvas.width = line.width;
					line.canvas.height = line.height;
					line.context = line.canvas.getContext('2d');
					line.context.scale(line.scale, line.scale);
					line.realWidth = Math.ceil(line.width * line.scale);
					line.realHeight = Math.ceil(line.height * line.scale);



					while(stack.length > 0) {
						var index = Math.floor(Math.random() * stack.length);
						var pos = line.str.length;
						line.str += stack[index];
						line.chars[pos] = [stack[index], green[stack[index]], white[stack[index]]];
						delete stack[index];
						stack = toArray(stack);
					}
					return line;
				}
			}
		}

		var Lines = function(size, can) {
			var number = new Number();
			function sort(a,b){
				return a[0] - b[0];
			}
			var me = {
				ctx : can.getContext('2d'),
				w : can.width,
				h : can.height,
				x : [],
				pos : [],
				lines : [],
				index : [],
				itv : null,
				disable : false,
				reLine : function(n){
					delete this.lines[n];
					this.x[n] = ((700 / size) * n - 50)  + Math.random() * 100;
					this.x[n] < 0 ? 0 : this.x[n];
					this.lines[n] = number.getLine(15, 20).draw();
					this.pos[n] = 0 - this.lines[n].realHeight;
					this.index[n] = [this.lines[n].scale, n];
				},
				draw : function(ctx){
					this.ctx.fillRect(0, 0, this.w, this.h);
					for (var i = 0; i < size; i++) {
						var index = this.index[i][1];
						if (this.pos[index] > 600 + 10) {
							this.reLine(index);
						} else {
							this.ctx.drawImage(this.lines[index].canvas, this.x[index], this.pos[index]);


							this.pos[index] += this.lines[index].speed;
						}
					}
				},
				run : function (){
					if (me.disable) {
						return;
					}
					me.draw();
					window.clearTimeout(me.itv);
					me.itv = window.setTimeout(function(){
						me.run();
					}, 25);
				},
				stop : function () {
					me.disable = true;
					window.clearTimeout(me.itv);
				},
				start : function () {
					me.disable = false;
					//window.clearTimeout(me.itv);
					me.run();
				}


			}
			me.ctx.fillStyle ='#000';
			for (var i = 0; i < size; i++) {
				me.reLine(i);
			}
			//me.index.sort(sort);
			return me;
		}

		var Lottery = function(matrix){
			var me = {
				his : [],
				min : $('#min'),
				max : $('#max'),
				run : $('#run'),
				reset : $('#reset'),
				log : $('#log'),
				info : $('#info'),
				result : $('#result'),
				matrix : matrix
			}
			function rand() {
				var stack = [];
				var min = me.min.val();
				var max = me.max.val();
				for (var i = min; i <= max; i++) {
					if ($.inArray(i, me.his) < 0) {
						stack.push(i);
					}
				}
				if (stack.length <= 0) {
					return -1;
				}
				var num = stack[Math.floor(Math.random() * stack.length)];
				me.his.push(num);
				return num;
			}
			function show(num) {
				me.result.fadeOut('slow');
				me.run.attr('disabled', 'disabled');
				me.min.attr('disabled', 'disabled');
				me.max.attr('disabled', 'disabled');
				me.reset.attr('disabled', 'disabled');
				me.info.html('抽奖中...');
				me.matrix.start();
				window.setTimeout(function(){
					var num = me.his[me.his.length - 1];
					me.matrix.stop();
					me.result.html(num).fadeIn('slow');
					me.info.html('抽奖成功!');
					me.run.removeAttr('disabled');
					me.min.removeAttr('disabled');
					me.max.removeAttr('disabled');
					me.reset.removeAttr('disabled');
					var time = new Date();
					time = (time.getHours() > 9 ? time.getHours() : '0' + time.getHours().toString()) + ":"
							 + (time.getMinutes() > 9 ? time.getMinutes() : '0' + time.getMinutes().toString()) + ":"
							 + (time.getSeconds() > 9 ? time.getSeconds() : '0' + time.getSeconds().toString());
					me.log.prepend('<div>'+ time + ' - ' + num +'</div>');
				}, 2000);
			}
			function run(){
				if (!me.max.val() || parseInt(me.max.val()) < 1) {
					alert('请输入Max值');
					me.max.focus();
					return;
				}
				var num = rand();
				if (num < 0) {
					me.info.html('<font color="red">号码已抽完</font>');
					return;
				}
				show();
			}
			me.run.click(run);
			me.max.keydown(function(evt){

				if(evt.keyCode == 13 && ! me.max.attr('disabled')) {
					run();
				}
			});
			me.reset.click(function(){
				me.his = [];
				me.log.prepend('<hr />');
			});
			me.result.click(function(){
				me.result.fadeOut('slow');
				me.matrix.start();
			})
		}

		var lines = new Lines(10, document.getElementsByTagName('canvas')[0]);
		lines.start();
		var lottery = new Lottery(lines);



		//ctx.drawImage(n.getLine(20, 30).draw().canvas, 0, 0);

//		ctx.drawImage(img, 0, 0);
	};
});
