"use strict"
/*
 配合插件和框架：
 jquery.js(v1.13 -- v2.0)
 layer.js(大于 v2.0)
 laypage.js（大于 v2.0）
 * */
//ajax
//定义加载层
var layerLoad;
var fnAjax = { //

	//跨域保存后台的sessionID的ajax请求
	method_3: function(murl, mdata, method, successFn) {
		$.ajax({
			type: method,
			url: murl,
			dataType: "json",
			data: mdata,
			timeout: 10000,
			async: true,
			xhrFields: {
				withCredentials: true
			},
			crossDomain: true,
			beforeSend: function() {
				layerLoad = layer.load(3);
			},
			error: function(data) {
				layer.close(layerLoad);
				console.log(data);
				layer.alert("请求失败，请检查服务器端！", {
					icon: 5
				});
			},
			success: function(data) {
				layer.close(layerLoad);
				if(data.code == 3) { //登录超时状态提示字符串
					layer.confirm(data.message + "。是否重新登录？", function() {
						$.toNewPage("login.html");
					});
				} else if(data.code == 2) { //账号在其他ip浏览器上被登录或者超时
					layer.confirm(data.message + "。是否重新登录？", function() {
						$.toNewPage("login.html");
					});
				} else if(data.code == 1) {
					layer.confirm(data.message + "。是否重新登录？", function() {
						$.toNewPage("login.html");
					});
				} else if(data.code == 0) {
					successFn(data);
				} else {
					layer.alert(data.message);
				}
			}
		});
	},
	//普通的ajax请求,添加超时，掉线的提示
	method_4: function(murl, mdata, method, successFn) {
		$.ajax({
			type: method,
			url: murl,
			dataType: "json",
			data: mdata,
			async: true,
			timeout: 10000,			
			beforeSend: function() {
				layerLoad = layer.load(3);
			},
			error: function(data) {
				layer.close(layerLoad);
				console.log(data);
				layer.alert("请求失败，请检查服务器端！", {
					icon: 5
				});
			},
			success: function(data) {
				layer.close(layerLoad);
				if(data.code == 3) { //登录超时状态提示字符串
					layer.confirm(data.message + "。是否重新登录？", function() {
						$.toNewPage("login.html");
					});
				} else if(data.code == 2) { //账号在其他ip浏览器上被登录或者超时
					layer.confirm(data.message + "。是否重新登录？", function() {
						$.toNewPage("login.html");
					});
				} else if(data.code == 1) {
					layer.confirm(data.message + "。是否重新登录？", function() {
						$.toNewPage("login.html");
					});
				} else if(data.code == 0) {
					successFn(data);
				} else {
					layer.alert(data.message);
				}
			}
		});
	},
	//跨域保存后台的sessionID的ajax请求，添加超时，掉线的提示
	method_5: function(murl, mdata, method, successFn) {
		$.ajax({
			type: method,
			url: murl,
			dataType: "json",
			data: mdata,
			timeout: 10000,
			async: true,
			xhrFields: {
				withCredentials: true
			},
			crossDomain: true,
			beforeSend: function() {
				layerLoad = layer.load(3);
			},
			error: function(data) {
				layer.close(layerLoad);
				console.log(data);
				layer.alert("请求失败，请检查服务器端！", {
					icon: 5
				});
			},
			success: function(data) {
				layer.close(layerLoad);
				if(data.code == 3) { //登录超时状态提示字符串
					layer.confirm(data.message + "。是否重新登录？", function() {
						$.toNewPage("login.html");
					});
				} else if(data.code == 2) { //账号在其他ip浏览器上被登录或者超时
					layer.confirm(data.message + "。是否重新登录？", function() {
						$.toNewPage("login.html");
					});
				} else if(data.code == 1) {
					layer.confirm(data.message + "。是否重新登录？", function() {
						$.toNewPage("login.html");
					});
				} else if(data.code == 0) {
					successFn(data);
				} else {
					layer.alert(data.message);
				}
			}
		});
	},
	//跨域保存后台的sessionID的ajax请求（表单文件上传），添加超时，掉线的提示
	method_6: function(murl, mdata, method, successFn) {
		$.ajax({
			type: method,
			url: murl,
			datatype: "jsonp",
			data: mdata,
			timeout: 2000,
			xhrFields: {
				withCredentials: true
			},
			crossDomain: true,
			async: false,
			cache: false,
			contentType: false,
			processData: false,
			error: function(data) {
				console.log(data);
				layer.alert("请求失败，请检查服务器端！", {
					icon: 5
				});
			},
			success: function(data) {
				if(data.state == "overtime") { //登录超时状态提示字符串
					toLoginPage();
				} else if(data.state == "hasLogin") { //账号在其他ip浏览器上被登录的字符串提示
					layer.alert("注意：该用户在ip为 http://" + data.ip + " 的电脑上被登录了!", {
						icon: 0
					});
				} else if(data.code == 0) {
					successFn(data);
				}
			}
		});
	}

};
/*
 关于系统判断
 * */
;
(function($, window, document, undefined) {
	$.extend({
		//判断是否移动端，移动端执行函数1（参数1）；否则执行函数2（参数2）
		isMoblie: function(fnMobile, fnPc) {
			var sUserAgent = navigator.userAgent.toLowerCase();
			var bIsIpad = sUserAgent.match(/ipad/i) == "ipad";
			var bIsIphoneOs = sUserAgent.match(/iphone os/i) == "iphone os";
			var bIsMidp = sUserAgent.match(/midp/i) == "midp";
			var bIsUc7 = sUserAgent.match(/rv:1.2.3.4/i) == "rv:1.2.3.4";
			var bIsUc = sUserAgent.match(/ucweb/i) == "ucweb";
			var bIsAndroid = sUserAgent.match(/android/i) == "android";
			var bIsCE = sUserAgent.match(/windows ce/i) == "windows ce";
			var bIsWM = sUserAgent.match(/windows mobile/i) == "windows mobile";
			if(bIsIpad || bIsIphoneOs || bIsMidp || bIsUc7 || bIsUc || bIsAndroid || bIsCE || bIsWM) { //移动端
				fnMobile();
			} else {
				fnPc();
			}
		},
	});
})(jQuery, window, document);

//关于字符串操作
;
(function($, window, document, undefined) {

	$.extend({
		//含有规律的字符串数据转化为数组；（以字符串中的某个字段截取生成数组）
		//		参数：str指的是大字符串；chart指的是大字符串中的某个子字符串
		stringToArray: function(str, chart) {
			var arrPerssion = [];
			if(str.indexOf(chart) >= 0) {
				var tempArray = str.split(chart);
				var returnArr = new Array();
				var i, len = tempArray.length;
				for(i = 0; i < len; i++) {
					returnArr.push(tempArray[i]);
				}

				return returnArr;
			} else {
				arrPerssion.push(str);
				return arrPerssion;
			}
		},
		////判断某字符串是否含有某个子字符串，如有，打印其第一次或者最后一次的索引
		hasStr: function(stringText, littleStr, isFrist) {
			//stringText指的是整个字符串变量，littleStr指的是整个字符串变量中可能存在的字段,
			//isFirst是布尔值，true指的是第一次出现的索引，false指的是最后一次
			var str = stringText;
			var str2 = littleStr;
			var d = str.length - str.indexOf(str2);
			if(d > str.length) {
				return false;
			} else {

				if(isFrist)
					return str.indexOf(str2)
				else
					return str.lastIndexOf(str2);
			}

		},
	});
})(jQuery, window, document)

//关于数组操作
;
(function($, window, document, undefined) {
	$.extend({
		//数组排序
		arrSort: function(arr) {
			return arr.sort(function(a, b) { //排序
				return a < b ? -1 : 1;
			});
		},
		//数组去重
		delRepetition: function(arr) {
			Array.prototype.unique2 = function() {
				this.sort(); //先排序
				var res = [this[0]];
				for(var i = 1; i < this.length; i++) {
					if(this[i] !== res[res.length - 1]) {
						res.push(this[i]);
					}
				}
				return res;
			}
			return arr.unique2();
		},
		//数组扁平化（二维数组一维处理）
		flattening: function(arr) {
			var flattened = Array.prototype.concat.apply([], arr);
			return flattened;
		},
		// 统计数组中所有的值出现的次数,并以对象的形式返回
		countif: function(arr) {
			return arr.reduce(function(prev, next) {
				//				console.log(prev); //obj，其属性为数组的每一个值，属性值为对应属性在数组中出现的次数
				//				console.log(next); //数组的每一个值
				prev[next] = (prev[next] + 1) || 1;
				return prev;
			}, {});
		},
	});
})(jQuery, window, document)

//关于页面跳转
;
(function($, window, document, undefined) {
	//服务器请求地址变量
	var sRequestUrl = "http://123.58.43.16:9555/";
	//服务器地址
	var sIp = 'http://123.58.43.16/';
	$.extend({
		//父页面和当前页面刷新加载
		pageReLoad: function() {
			if(window.parent.parent.parent.parent) {
				parent.parent.parent.parent.location.reload();
			} else if(window.parent.parent.parent) {
				parent.parent.parent.location.reload();
			} else if(window.parent.parent) {
				parent.parent.location.reload();
			} else if(window.parent) {
				parent.location.reload();
			} else {
				window.location.reload();
			}
		},
		//当前页面和父页面跳转到其他页面
		//Url指的是要跳转的路劲页面，如index.html
		toNewPage: function(Url) {
			if(window.parent.parent.parent.parent) {
				parent.parent.parent.parent.location.href = sIp + '' + Url;
			} else if(window.parent.parent.parent) {
				parent.parent.parent.location.href = sIp + '' + Url;
			} else if(window.parent.parent) {
				parent.parent.location.href = sIp + '' + Url;
			} else if(window.parent) {
				parent.location.href = sIp + '' + Url;
			} else {
				window.location.href = sIp + '' + Url;
			}
		},
		//返回路由地址
		urlBack: function(mUrl) {
			return sRequestUrl + '' + mUrl; //统一服务器
		},
	});
})(jQuery, window, document)

//关于函数操作
;
(function($, window, document, undefined) {
	//延迟加载器
	var keyupTimer = null;
	$.extend({
		debounce: function(fn, wait) { //fn指的是函数，wait指的是时间数值（秒）
			//设定默认的延迟时间
			wait = wait || 500;
			//清除定时器
			keyupTimer && clearTimeout(keyupTimer);
			//定时器执行
			keyupTimer = setTimeout(fn, wait);
		}
	});
})(jQuery, window, document)

//关于随机生成
;
(function($, window, document, undefined) {

	$.extend({
		//随机生成n个大写字母
		//参数：n指的是字母个数，值为数字；
		getCapital: function(n) {
			var result = [];
			for(var i = 0; i < n; i++) {
				var ranNum = Math.ceil(Math.random() * 25); //生成一个0到25的数字
				//大写字母'A'的ASCII是65,A~Z的ASCII码就是65 + 0~25;然后调用String.fromCharCode()传入ASCII值返回相应的字符并push进数组里
				result.push(String.fromCharCode(65 + ranNum));
			}
			return result;

		},
		//随机生成范围数字：min最小数字，max最大数字（打印数字为最小到最大的范围）
		randNum: function(min, max) {
			var num = Math.floor(Math.random() * (max - min) + min);
			return num;
		},
	});
})(jQuery, window, document)

/*
 * 关于获取本地系统信息
 */
;
(function($, window, document, undefined) {
	$.extend({
		/*
 * 获取鼠标位置
调用：
获取鼠标水平位置$.getMousePos(event).x
获取鼠标水平位置$.getMousePos(event).y
*/
		getMousePos: function(event) {
			var e = event || window.event;
			var scrollX = document.documentElement.scrollLeft || document.body.scrollLeft;
			var scrollY = document.documentElement.scrollTop || document.body.scrollTop;
			var x = e.pageX || e.clientX + scrollX;
			var y = e.pageY || e.clientY + scrollY;
			return {
				'x': x,
				'y': y
			};
		},
		/*
		 获取当前静态所有时间
		 参数：
		 'y-m-d' ==> 年月日
		 'm-d' ==> 年月
		 'm-d' ==> 月日
		 'h-m-s' ==> 时分秒
		 'h-m' ==> 时分
		 'm-s' ==> 分秒
		 'w' ==>星期
		 '' ==>年月日 时分秒
		 * */
		getOnTime: function(oTime) {
			//获取当前具体时间
			var oDate = new Date();
			var nYear = oDate.getFullYear();
			var nMonth = oDate.getMonth() * 1 + 1;
			var nDate = oDate.getDate();

			var nHours = oDate.getHours();
			var nMinutes = oDate.getMinutes();
			var nSeconds = oDate.getSeconds();

			(nHours < 10) && (nHours = "0" + nHours);
			(nMinutes < 10) && (nMinutes = "0" + nMinutes);
			(nSeconds < 10) && (nSeconds = "0" + nSeconds);

			switch(true) {
				case(oTime === 'y-m-d'):
					return nYear + "-" + nMonth + "-" + nDate;
					break;
				case(oTime === 'y-m'):
					return nYear + "-" + nMonth;
					break;
				case(oTime === 'm-d'):
					return nMonth + "-" + nDate;
					break;
				case(oTime === 'h-m-s'):
					return nHours + ":" + nMinutes + ":" + nSeconds;
					break;
				case(oTime === 'm-s'):
					return nMinutes + ":" + nSeconds;
					break;
				case(oTime === 'h-m'):
					return nHours + ":" + nMinutes;
					break;
				case(oTime === 'w'):
					return "今天是星期" + "日一二三四五六".charAt(new Date().getDay());
					break;
				default:
					return nYear + "-" + nMonth + "-" + nDate + "\0" + nHours + ":" + nMinutes + ":" + nSeconds;
			}
		},
	});
})(jQuery, window, document)

//自定义分页插件（结合laypage插件，layer插件）
;
(function($, window, document, undefined) {	
	$.fn.paging = function(options) {
		var _this = $(this);
		var defaults = {
			url: 'http://103.251.36.122:9555/',
			data: {},
			type: "post",
			callBack: function(data) {
				console.log("huidiao");
				console.log(data);
			}
		};
		var opts = $.extend({}, defaults, options);

		fnAjax.method_5(
			opts.url,
			opts.data,
			opts.type,
			function(data) {
				_this.after($('<div id="pageContainer" class="text-c mt-20"></div>')); //表格和表格后面的分页控制器
				if(parseInt(data.data.total) == 0) {
					_this.children("tbody").html("");
					$("#pageContainer").html("当前没有数据！");
				} else if(parseInt(data.data.total) > 0) {
					opts.callBack(data.data);
					//fn(data.data);
					laypage({
						cont: "pageContainer", //控制分页容器，
						pages: data.data.last_page, //总页数
						skip: true, //是否开启跳页
						groups: 3, //连续显示分页数
						first: '首页', //若不显示，设置false即可
						last: '尾页', //若不显示，设置false即可
						//							prev: '<', //若不显示，设置false即可
						//							next: '>', //若不显示，设置false即可
						hash: true, //开启hash
						jump: function(obj, first) {
							if(!first || first == undefined) { //点击跳页触发函数自身，并传递当前页：obj.curr
								opts.data.page = obj.curr;
								fnAjax.method_5(
									opts.url,
									opts.data,
									opts.type,
									function(d) {
										//											fn(d.data);
										opts.callBack(d.data);
									}
								);
							}

						}
					});
					$("body").delegate(".laypage_btn", "click", function() {
						opts.data.page = $(".laypage_skip").val();
						fnAjax.method_5(
							opts.url,
							opts.data,
							opts.type,
							function(data) {
								opts.callBack(data.data);
							}
						);
					});

				}
			}

		);
	}
})(jQuery, window, document);

//关于置顶置底
;
(function($, window, document, undefined) {

	// 置顶
	$.fn.toTop = function(options) {
		var defaults = {
			event: 'click' // 事件类型
		};
		var opts = $.extend({}, defaults, options);
		var obj = $(this);
		obj.on(opts.event, function() {
			$('html,body').animate({
				scrollTop: '0px'
			}, 800);
		});
	}
	// 置底
	$.fn.toBottom = function(options) {
		var defaults = {
			event: 'click' // 事件类型
		};
		var opts = $.extend({}, defaults, options);
		var obj = $(this);
		obj.on(opts.event, function() {
			$('html,body').animate({
				scrollTop: document.body.clientHeight + "px"
			}, 800);
		});
	}
})(jQuery, window, document);

;
(function($, window, document, undefined) {
	// 评级组件
	$.fn.rate = function(options) {
		var defaults = {
			star: 1, // 星级
			edit:false,
		};
		var opts = $.extend({}, defaults, options);
		var obj = $(this);
		var rate = opts.star > 5 ? 5 : opts.star;
		var sStar = "★★★★★☆☆☆☆☆".slice(5 - rate, 10 - rate);
		var aStar =  sStar.split("");
		var tem = "";
		for (var i=0;i<aStar.length;i++) {
			tem += '<b data="'+ aStar[i].charCodeAt(0) +'">'+ aStar[i] +'</b>'
		}
		obj.html(tem);
		if(opts.edit){
			obj.css("cursor","pointer");
			obj.children().on("click",function(){
				console.log($(this).attr("data"),$(this).index());
				if($(this).attr("data") == "9733"){
					$(this).attr("data","9734").text(String.fromCharCode(9734));
					$(this).prevAll().attr("data","9733").text(String.fromCharCode(9733));
					$(this).nextAll().attr("data","9734").text(String.fromCharCode(9734));
					return false;
				}
				if($(this).attr("data") == "9734"){
					$(this).attr("data","9733").text(String.fromCharCode(9733));
					$(this).prevAll().attr("data","9733").text(String.fromCharCode(9733));
					
				}
			});
		}
		
	}
})(jQuery, window, document);

//关于验证
;
(function($, window, document, undefined) {
	// 验证禁用中文输入
	$.fn.checkChinese = function(options) {
		var defaults = {
			event: 'keyup', // 事件类型
			paste: false,
		};
		var opts = $.extend({}, defaults, options);
		var obj = $(this);
		obj.on(opts.event, function() {
				var reg = new RegExp("[\\u4E00-\\u9FFF]+", "g");　　
				if(reg.test(obj.val())) {
					alert("不能输入汉字！");
					obj.val("");
					obj.focus();　　
				}
			})
			.on('paste', function() {
				return opts.paste;
			});
	}

	// 验证禁用特殊字符输入
	$.fn.checkVerify = function(options) {
		var defaults = {
			event: 'keyup', // 事件类型
			paste: false,
		};
		var opts = $.extend({}, defaults, options);
		var obj = $(this);
		var r = /^[\u4E00-\u9FA5a-zA-Z0-9]{0,}$/;
		obj.on(opts.event, function() {
				if(r.test($(this).val()) == false) {
					alert("不能输入特殊字符");
					obj.val("");
					obj.focus();
				}
			})
			.on('paste', function() {
				return opts.paste;
			});

	}
		
	// 验证只能输入数字和小数
	$.fn.onlyNumAndFlo = function(options) {
		$(this).on("blur",function(){
			var e = this;
			var re = /^\d+(?=\.{0,1}\d+$|$)/ 
		    if (e.value != "") { 
		        if (!re.test(e.value)) { 
		            alert("请输入正确的数字"); 
		            e.value = ""; 
		            e.focus(); 
		        } 
		    } 
		});
		$(this).on("keyup",function(){
			var e = this;
			e.value = e.value.replace(/[^0-9.]/g,'');
		});
	}
	
})(jQuery, window, document);

/*
 * 
传参的 对象插件函数2
调用：$(ele).testPlugin(); || 
	 $(ele).testPlugin({
	 	'color':'颜色值',
	 	'fontSize': '字体大小',
        'textDecoration': '是否下划线',
        'onClick':function(){},//点击事件
        'animate':{
            	'dTime':2000,//完成动画时间
            	'animateStyle':{//动画执行样式
            		'fontSize':'+100px'
            		......
            	}
            }
	 });
 * */
;
(function($, window, document, undefined) {
	//定义oFunction的构造函数
	var oFunction = function(ele, opt) {
		this.$element = ele,
			this.defaults = {
				'color': 'red',
				'fontSize': '12px',
				'textDecoration': 'none',
				'onClick': function() {
					console.log("默认的mmp");
				},
				'animate': {
					'dTime': 2000,
					'animateStyle': {
						'fontSize': '+100px'
					}
				}
			},
			this.options = $.extend({}, this.defaults, opt)
	}
	//定义Beautifier的方法
	oFunction.prototype = {
		method_1: function() {
			return this.$element.css({
					'color': this.options.color,
					'fontSize': this.options.fontSize,
					'textDecoration': this.options.textDecoration
				})
				.animate(this.options.animate.animateStyle, this.options.animate.dTime)
				.on("click", this.options.onClick);
		}
	}
	//在插件中使用Beautifier对象
	$.fn.testPlugin = function(options) {
		//创建Beautifier的实体
		var _function = new oFunction(this, options);
		//调用其方法
		return _function.method_1();
	}
})(jQuery, window, document);

/*
 银行账号格式输入组件，jq需要先引入，提示框结合layer.js
 调用，例子：
 $("#account").bankInput({
	min: 16, // 最少输入字数 
	max: 25, // 最多输入字数 
	deimiter: ' ', // 账号分隔符 
	onlyNumber: true, // 只能输入数字 
	copy: false, // 允许复制
	paste: false, //不允许粘贴
	cut: false //不允许剪切
});
 * */
;
(function($, window, document, undefined) {
	// 输入框格式化 
	$.fn.bankInput = function(options) {
		var defaults = {
			min: 10, // 最少输入字数 
			max: 25, // 最多输入字数 
			deimiter: ' ', // 账号分隔符 
			onlyNumber: true, // 只能输入数字 
			copy: false, // 允许复制
			paste: false, //不允许粘贴
			cut: false //不允许剪切

		};
		var opts = $.extend({}, defaults, options);
		var obj = $(this);
		obj.css({
			imeMode: 'Disabled',
			borderWidth: '1px',
			color: '#000',
			fontFamly: 'Times New Roman'
		}).attr('maxlength', opts.max);
		if(obj.val() != '') obj.val(obj.val().replace(/\s/g, '').replace(/(\d{4})(?=\d)/g, "$1" + opts.deimiter));
		obj.on('keyup', function(event) {
				if(opts.onlyNumber) {
					if(!(event.keyCode >= 48 && event.keyCode <= 57)) {
						this.value = this.value.replace(/\D/g, '');
					}
				}
				this.value = this.value.replace(/\s/g, '').replace(/(\d{4})(?=\d)/g, "$1" + opts.deimiter);
			})
			.on('dragenter', function() {
				return false;
			})
			.on('paste', function() { //粘贴事件
				console.log("粘贴类型：" + opts.paste);
				return opts.paste;
			})
			.on("copy", function() { //复制事件
				console.log("复制类型：" + opts.copy);
				return opts.copy;
			})
			.on("cut", function() { //剪切事件
				console.log("剪切类型：" + opts.cut);
				return opts.cut;
			})
			.on('blur', function() {
				this.value = this.value.replace(/\s/g, '').replace(/(\d{4})(?=\d)/g, "$1" + opts.deimiter);
				if(this.value.length < opts.min) {
					layer.alert('最少输入' + opts.min + '位账号信息！');
					obj.val("");
				}
			})

	}
	// 列表显示格式化 
	$.fn.bankList = function(options) {
		var defaults = {
			deimiter: ' ' // 分隔符 
		};
		var opts = $.extend({}, defaults, options);
		return this.each(function() {
			$(this).text($(this).text().replace(/\s/g, '').replace(/(\d{4})(?=\d)/g, "$1" + opts.deimiter));
		})
	}
})(jQuery, window, document);