// 百度地图API功能	
window.onload = function (){
	var div_in = '<div id="all_dizhi">'+
	
			'<div id="info">'+
				'<div>'+
					'<span class="address" style="" >　区域地址：</span>'+
					'<select id="s_province" name="s_province"></select><span class="s_name"> 省</span>  '+
				    '<select id="s_city" name="s_city" ></select><span class="s_name"> 市</span>  '+
				    '<select id="s_county" name="s_county"></select><span class="s_name"> 县/区</span>'+
				    '<script class="resources library" src="js/area.js" type="text/javascript"></script>    '+
					'<script type="text/javascript">_init_area();</script> '+
			    '</div>'+
			    '<div id="show"></div>'+
			'</div>'+
		
			'<div id="r-result" style="margin-top:4px;">'+
				'<span class="address" style="" >　详细地址：</span><input type="text" id="suggestId" name="suggestId" size="20" value=""/><label id="sug_label" for="suggestId"></label>'+
				'<span id="span_address" ></span>'+
			'</div>'+
		'</div>'+
	
		'<div id="searchResultPanel"></div>'+

		'<div id="jingWei">'+
		'<span class="address" id="jing_span">　　　经度：</span><input type="text" id="jing" value="" >'+
		'<span class="address" id="wei_span">纬度：</span><input type="text" id="wei" value="" >'+
		'</div>'+

		'<div id="result">	'+
			'<a id="cleanAll"  title="清除所有遮盖物"><img src="images/dt1.png" ></a>'+
		'</div>'+
		'<div id="xy"></div>'+

		'<div id="allmap" >	'+
			'<div id="map"></div>'+
		'</div>';//html页面插入div代码
	$("#wrap").html(div_in);//插入

	var MapType  ; //1:百度地图 2：高德地图
	var isOnly   ; //是否只一个点一个区域
	var ShowAdress  ; //是否显示区域地址、详细地址栏
	var ShowCoordinate   ; //是否显示经纬栏
	var ShowToolbar  ="";//为空表示隐藏 AE为必须 自由组合按钮如：CBD
	var SearchRange ="";//搜索范围:"1":当前城市 "市级名":某城市或区域
	var KeyWord =""; //搜索关键字
	var jingDu ;	//初始经度
	var weiDu ;		//初始纬度
	$.ajax({ 
			type:"GET",
			url:'../MapCtrl20160215/MapCtrl.xml',
			async: false,
			dataType: "xml",  
			success:function (data) {
                        $(data).find('CTRLmap').each(function (i) {   //读取xml文件,获取默认参数
                           var $item = $(this);
							MapType = parseInt($item.find('MapType').text()); //类型装换为数值
							isOnly = Boolean(parseInt($item.find('isOnly').text()));//布尔
							ShowAdress = Boolean(parseInt($item.find('ShowAdress').text()));//布尔
							ShowCoordinate = Boolean(parseInt($item.find('ShowCoordinate').text()));//布尔
							ShowToolbar = String($item.find('ShowToolbar').text());//字符串
							SearchRange = String($item.find('SearchRange').text());//字符串
							KeyWord = String($item.find('KeyWord').text());//字符串
							jingDu = $item.find('jingDu').text(); //获取经度
							weiDu = $item.find('weiDu').text(); //获取维度
                        });
                    }
		}); 
	if(!ShowAdress){
		document.getElementById("r-result").style.display = "none";  //区域地址、详细地址显示隐藏
		document.getElementById("info").style.display = "none";
	}
	if(!ShowCoordinate){											//经纬栏显示隐藏
		document.getElementById("jing_span").style.display = "none";
		document.getElementById("wei_span").style.display = "none";
		document.getElementById("jing").style.display = "none";
		document.getElementById("wei").style.display = "none";
	}

	//地图判断
	switch (MapType){
		case 1:
		var map = new BMap.Map("map");
			if(typeof(window.parent.myDR) != "object"){
			
			var poi = new BMap.Point(jingDu,weiDu);//默认起始坐标
		}else{
			var marker = new BMap.Marker(new BMap.Point(window.parent.myX, window.parent.myY));
			map.addOverlay(marker);
			//赋值地址默认值
			document.getElementById("span_address").innerText = window.parent.myAddress;
			var xiangxi = "<input  type='hidden' name='opraddress' value="+window.parent.myAddress+">";
			parent.document.getElementById("opraddress_div").innerHTML=xiangxi;
			
			//触发消失
			document.getElementById("suggestId").onfocus=function(){
					document.getElementById("span_address").innerText = '';
				};
			
			var poi = new BMap.Point(window.parent.myDR[0]['lng'],window.parent.myDR[0]['lat']);
			
			//赋值坐标x默认值
			document.getElementById("jing").value = window.parent.myX;
			var jing = "<input id='lng_div'  type='hidden' name='geographiclongitude' value="+window.parent.myX+">";
			parent.document.getElementById("lng_div").innerHTML=jing;
			
			//赋值坐标y默认值
			document.getElementById("wei").value = window.parent.myY;
			var wei = "<input id='lat_div'  type='hidden' name='geographiclatitude' value="+window.parent.myY+">";
			parent.document.getElementById("lat_div").innerHTML=wei;

		}

		var centerP = poi;
		map.centerAndZoom(centerP, 13);
		$('#s_province').change(function() {
	        var value = $(this).children('option:selected').val(); //这就是selected的值 
	        changeTemp(value);	//省改变地方地图联动
	        map.centerAndZoom(centerP, 11);//重新定位地图
	    });
		$('#s_city').change(function() {
	        var value = $(this).children('option:selected').val(); //这就是selected的值 
	        changeTemp(value);	//市改变地方地图联动
	        map.centerAndZoom(centerP, 13);//重新定位地图
	    });
	    function changeTemp(str) {
	        centerP = str;
	        return centerP;//中心点城市名传值
	    }
		map.enableScrollWheelZoom(); //滚动视距
		var first_m = new BMap.Marker(new BMap.Point(jingDu,weiDu));//初始遮盖物初始149b2f3647140074f183d3e30d3b0dd8
		map.addOverlay(first_m);//增加初始遮盖物
		$.ajax({
			//初始点详细位置请求
			type:"GET",
			url:'http://api.map.baidu.com/geocoder/v2/?ak=149b2f3647140074f183d3e30d3b0dd8&callback=renderReverse&location='+weiDu+','+jingDu+'&output=json&pois=0',
			dataType: "jsonp",  
			success:function (json) {                        
                        $('#sug_label').val(json.result.formatted_address);
                        //具体地址给sug_label
                    }
		});
	    var local = new BMap.LocalSearch(map, {    //本地搜索
	     renderOptions:{map: map}      
	    });    
	    // local.search(KeyWord);    
		var local_in = new BMap.LocalSearch(SearchRange, {    //指定地区搜索
		 renderOptions: {    
		   map: map,    
		   autoViewport: true,    
		   selectFirstResult: false    
		 },    
		  pageCapacity: 20    
		});    
		// local_in.search(KeyWord);  
		if(SearchRange=="1"){
			//为1时本IP地区搜索
			local.search(KeyWord);
		}else{
			//否则为字符串地区搜索
			local_in.search(KeyWord);
		}

		function onlyMarker(){//只一个标注
			cleanMarker(); 
		}

		function onlyPolygon(){//只一个多边形 矩形
			cleanPolygon();
		}
	    var overlays = [];		
		// 创建地址解析器实例
		var myGeo = new BMap.Geocoder();		
		var overlaycomplete = function(e){
			
			if(e.overlay == '[object Marker]'){
				//地图上放置点的时候,清除前面所有点
				if(isOnly){
					onlyMarker();
					} 
				////点(在地图上画点的时候,把坐标,地址,显示在input中)	
				var pt = e.overlay.point;
				myGeo.getLocation(pt, function(rs){
					var addComp = rs.addressComponents;//将点的市、区/县、街给addComp
					var s_province = addComp.province;//省市赋值给select
					var s_city = addComp.city;
					var s_district = addComp.district;
					if(s_province=='内蒙古自治区'){
						$("#s_province option:first").text("内蒙古");//当为内蒙古时省份特殊处理
					}else if(s_province=='新疆维吾尔自治区'){
						$("#s_province option:first").text("新疆");//当为新疆时省份特殊处理
					}else {
						$("#s_province option:first").text(s_province); //其他省份
					}
					
					$("#s_city option:selected").text(s_city); //市级单位赋值
					$("#s_county option:selected").text(s_district);//区县单位赋值
					if(addComp.province == addComp.city){	
						var add_p_c =  addComp.city;
					}else{
						var add_p_c =  addComp.province+addComp.city;
					}
					var dizhi = add_p_c+addComp.district+addComp.street+addComp.streetNumber
					//清除地址input
					document.getElementById("span_address").innerText = '';
					//赋值
					document.getElementById("suggestId").value = dizhi;					
					var xiangxi = "<input  type='hidden' name='opraddress' value="+dizhi+">";
				});   
					
					document.getElementById("jing").value = e.overlay.point.lng;
					document.getElementById("wei").value = e.overlay.point.lat;
							
			}else if(e.overlay == '[object Polygon]'){
				if(isOnly){
					onlyPolygon();
				}
				//多边形,矩形 
				var arr = e.overlay.getPath();
				html = '';
				for (n in arr){
					html += "<input  type='hidden' name='xy["+n+"][lng]' value="+arr[n]['lng']+">"+"<input type='hidden' name='xy["+n+"][lat]' value="+arr[n]['lat']+">";
				}			
				//经纬度写入 表单 隐藏域
				parent.document.getElementById("xy").innerHTML=html;
			}else {
				
			}

	    };
	var drawingBar = "";//数组控制BAR
	var drawingBarTF ;//是否为空
	var arr_l = ShowToolbar.split("");
	//数组控制BAR拆分
	    if(ShowToolbar==""){
	    	//如果为真则不显示BAR
	    	document.getElementById("result").style.display = "none";
	    	drawingBarTF = false;
	    }else{
	    	//否则隐藏BAR
	    	drawingBarTF = true;
	    	for(var i in arr_l){	
	    		//循环判断
	    		if(arr_l[i]=='B'){arr_l[i]=BMAP_DRAWING_MARKER;}else if(arr_l[i]=='C'){arr_l[i]=BMAP_DRAWING_POLYGON;}else if(arr_l[i]='D'){arr_l[i]=BMAP_DRAWING_RECTANGLE;}else{alert("error!");};
	    	}
	    }
	    var longArr = arr_l.length;//绘制工具栏位置控制
	    var longNum = 34;
	    switch (longArr){
	    	//控制BAR变化时位置
	    	case 1: longNum = 43;break;
	    	case 2: longNum = 40;break;
	    	case 3: longNum = 34;break;
	    }
	    var styleOptions = {
	        strokeColor:"red",    //边线颜色。
	        fillColor:"red",      //填充颜色。当参数为空时，圆形将没有填充效果。
	        strokeWeight: 3,       //边线的宽度，以像素为单位。
	        strokeOpacity: 0.8,	   //边线透明度，取值范围0 - 1。
	        fillOpacity: 0.6,      //填充的透明度，取值范围0 - 1。
	        strokeStyle: 'solid' //边线的样式，solid或dashed。
	    }
	    //实例化鼠标绘制工具
	    var drawingManager = new BMapLib.DrawingManager(map, {
	        isOpen: false, //是否开启绘制模式
	        enableDrawingTool: drawingBarTF, //是否显示工具栏
	        drawingToolOptions: {
	            anchor: BMAP_ANCHOR_TOP_RIGHT, //位置
	            offset: new BMap.Size(longNum, 5), //偏离值
	            scale: 0.8 ,//工具栏缩放比例
				drawingModes:arr_l
	        },
	        circleOptions: styleOptions, //圆的样式
	        polylineOptions: styleOptions, //线的样式
	        polygonOptions: styleOptions, //多边形的样式
	        rectangleOptions: styleOptions //矩形的样式
	    });  
		 //添加鼠标绘制工具监听事件，用于获取绘制结果
	    drawingManager.addEventListener('overlaycomplete', overlaycomplete);
	    //清除所有遮盖物
	    
		$("#cleanAll").click(function(){
			map.clearOverlays();
			for(var i = 0; i < overlays.length; i++){
				//循环清除overlays
	            map.removeOverlay(overlays[i]);
	        }
	        overlays.length = 0;
			drawingManager.close();//关闭作画
		})
		//联想地址搜索功能
		function G(id) {
			return document.getElementById(id);
		}

			var ac = new BMap.Autocomplete(    //建立一个自动完成的对象
				{
				"input" : "suggestId",
				"location" : map,
				
			});

			ac.addEventListener("onhighlight", function(e) {  //鼠标放在下拉列表上的事件
			var str = "";
				var _value = e.fromitem.value;
				var value = "";
				if (e.fromitem.index > -1) {
					value = _value.province +  _value.city +  _value.district +  _value.street +  _value.business;
				}    
				str = "FromItem<br />index = " + e.fromitem.index + "<br />value = " + value;
				value = "";
				if (e.toitem.index > -1) {
					_value = e.toitem.value;
					value = _value.province +  _value.city +  _value.district +  _value.street +  _value.business;
				}    
				str += "<br />ToItem<br />index = " + e.toitem.index + "<br />value = " + value;
				G("searchResultPanel").innerHTML = str;
			});

			var myValue;
			ac.addEventListener("onconfirm", function(e) {    //鼠标点击下拉列表后的事件
			var _value = e.item.value;
				myValue = _value.province +  _value.city +  _value.district +  _value.street +  _value.business;
				G("searchResultPanel").innerHTML ="onconfirm<br />index = " + e.item.index + "<br />myValue = " + myValue;
				search();
				setPlace();
				cleanMarker();
			});
		function setPlace(){
			//map.clearOverlays();    //清除地图上所有覆盖物 
			function myFun(){ 
				var pp = local.getResults().getPoi(0).point;    //获取第一个智能搜索的结果
				map.centerAndZoom(pp, 18);
				map.addOverlay(new BMap.Marker(pp));    //添加标注
			}
			var local = new BMap.LocalSearch(map, { //智能搜索
			  onSearchComplete: myFun
			});
			local.search(myValue);
		}
		function search(){
		//地址
		var dizhi = document.getElementById("suggestId").value;
		
		myGeo.getPoint(dizhi, function(point){
			if (point) {	
				document.getElementById("jing").value = point.lng;
				document.getElementById("wei").value = point.lat;
				
				var jing = "<input  type='hidden' name='geographiclongitude' value="+point.lng+">";
				var wei = "<input  type='hidden' name='geographiclatitude' value="+point.lat+">";
				var xiangxi = "<input  type='hidden' name='opraddress' value="+dizhi+">";
				
				parent.document.getElementById("lng_div").innerHTML=jing;
				parent.document.getElementById("lat_div").innerHTML=wei;
				parent.document.getElementById("opraddress_div").innerHTML=xiangxi;
				
			}
		}, "北京市");
	}
		
		//清除以前的所有点
		function cleanMarker(){
			//所有覆盖物
			var allOverlay = map.getOverlays();
			//所有覆盖物的个数
			var arrMarker = new Array();			
			var len = allOverlay.length-1;
			var lastMarker = new Array();
			//获取最后一个点
			for (var i in allOverlay){
				if(allOverlay[i] == '[object Marker]'){
					lastMarker[i] = allOverlay[i];

				}			
			}	
			//获取最后一个多边形
			for (var i = len; i >= 0; i--){
				//alert(i+':'+allOverlay[i])
				if(allOverlay[i] == '[object Polygon]'){
					var lastPolygon = allOverlay[i];
					break;
				}
				
			}
			//清除所有
			map.clearOverlays();
			//添加多边形
			map.addOverlay(lastPolygon);
			
			//添加点
			var Marker_num = new Array();
			//var num_a = 0;
			for(var i in lastMarker){
				Marker_num.push(i);
			}
			//最大值
			var max_num = Math.max.apply(null, Marker_num);
			//最小值
			map.addOverlay(lastMarker[max_num]);	
			//选中"拖动地图"
			drawingManager.close();
		}
		
		//清除以前的所有点
		function cleanPolygon(){	
			//所有覆盖物
			var allOverlay = map.getOverlays();	
			var len = allOverlay.length-1;
			//所有多边形
			var lastPolygon = new Array();
			//所有点
			var lastMarker = new Array();
			//分割数组
			for (var i in allOverlay){
				if(allOverlay[i] == '[object Marker]'){
					lastMarker[i] = allOverlay[i];	
				}
				if(allOverlay[i] == '[object Polygon]'){
					lastPolygon[i] = allOverlay[i];	
				}
				
			}
			//清除所有
			map.clearOverlays();
			//添加点
			var Marker_num = new Array();	
			//添加多边形
			var Polygon_num = new Array();
			//遍历点
			for(var i in lastMarker){
				Marker_num.push(i);
			}
			
			//遍历多边形
			for(var i in lastPolygon){
				Polygon_num.push(i);
			}	
			//最小值
			var Marker_min_num = Math.min.apply(null, Marker_num);
			//最大值
			var Polygon_max_num = Math.max.apply(null, Polygon_num);
			//创建点
			map.addOverlay(lastMarker[Marker_min_num]);
			//创建多边形
			map.addOverlay(lastPolygon[Polygon_max_num]);
			//选中"拖动地图"
			drawingManager.close();
		}
		break;

		case 2:
		map = new AMap.Map("container"); break;


	}
}