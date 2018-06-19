/*
@depend
	jquery.js(v1.10 -- v2.0)
@author xiaohaobin
@version 1.0
*/
var mapControl = {
    //缩放工具
    navigationControl: function () {
        var n = new BMap.NavigationControl({
            anchor: BMAP_ANCHOR_BOTTOM_RIGHT,
            offset: new BMap.Size(10, 150),
            type: BMAP_NAVIGATION_CONTROL_LARGE,
            showZoomInfo: true,
            enableGeolocation: true
        });
        return n;
    },
    //定位工具
    geolocationControl: function () {
        var g = new BMap.GeolocationControl({
            anchor: BMAP_ANCHOR_BOTTOM_LEFT,
            offset: new BMap.Size(10, 80),
            showAddressBar: true,
            enableGeolocation: true
        });
        //定位成功事件
        g.addEventListener("locationSuccess", function (e) {
            // 定位成功事件
            sessionStorage.setItem("gps_lng", e.point.lng);
            sessionStorage.setItem("gps_lat", e.point.lat);
            var address = '';
            address += e.addressComponent.province;
            address += e.addressComponent.city;
            address += e.addressComponent.district;
            address += e.addressComponent.street;
            address += e.addressComponent.streetNumber;
            alert("当前定位地址为：" + address);

        });
        //定位失败事件
        g.addEventListener("locationError", function (e) {
            alert("定位失败：" + e.message);
        });
        return g;
    },
    //比例尺工具
    scaleControl: function () {
        var s = new BMap.ScaleControl({
            anchor: BMAP_ANCHOR_TOP_RIGHT,
            offset: new BMap.Size(10, 10),
        });
        return s;
    },
    //切换地图类型
    mapTypeControl: function () {
        var opts6 = {
            anchor: BMAP_ANCHOR_TOP_RIGHT,
            type: BMAP_MAPTYPE_CONTROL_MAP
        }
        var maptype = new BMap.MapTypeControl(opts6);
        return maptype;
    },
    /*
     负责切换至全景地图的控件(浏览器要装Adobe Flash Play控件)
     * */
    panoramaControl: function () {
        var p = new BMap.PanoramaControl({
            anchor: BMAP_ANCHOR_TOP_RIGHT,
        });
        return p;
    },
    //删除指定经纬度标注
    //获取地图上所有的覆盖物  
    //longitude,latitude：指定标注的经纬度，
    removeMarker: function (longitude, latitude) {
        var allOverlay = map.getOverlays();
        for (var i = 0; i < allOverlay.length; i++) {
            if (allOverlay[i].toString() == "[object Marker]") {
                if (allOverlay[i].getPosition().lng == longitude && allOverlay[i].getPosition().lat == latitude) {
                    map.removeOverlay(allOverlay[i]);
                }
            }
        }
    },
    //获取两点之间的距离
    getDistence: function (start_lng, start_lat, end_lng, end_lat) {
        var start_point = new BMap.Point(start_lng * 1, start_lat * 1);
        var end_point = new BMap.Point(end_lng * 1, end_lat * 1);
        return Math.ceil(map.getDistance(start_point, end_point));
    },
    /*
	marker设置地图label
	@param {object}
	@property {string} content label标签内容
	@property {[number,number]} offset label标签相对marker标注的偏移值
	@property {object} style label样式对象
	@example
	mapControl.setLabel({
		content:"这是标注的label",
		offset:[15, -15],
		style:{
			border: "solid 1px gray",
			padding:'2px 5px',
			borderRadius:'3px',
		}
	})
	@return {object} lable对象
	*/
    setLabel: function (option) {
		var _this = this;
		var defaults = {
			content:"这是标注的label",
			offset:[15, -15],
			style:{
				border: "solid 1px gray",
				padding:'2px 5px',
				borderRadius:'3px',
			}
		};
		var opts = $.extend({}, defaults, option);
		
        var lbl = new BMap.Label(
            opts.content, {
                offset: new BMap.Size(opts.offset[0], opts.offset[1])
            }
        );
        lbl.setStyle(opts.style);
        return lbl;
    },
    //9.GPS经纬度转换百度经纬度
    //curLongitude,curLatitude经纬度
    //fn：转换后的回调函数
    transfrom: function (curLongitude, curLatitude, fn) {
        //将获取的坐标转换为百度坐标
        var ggPoint = new BMap.Point(curLongitude, curLatitude);
        //坐标转换完之后的回调函数
        var translateCallback = function (data) {
            if (data.status === 0) fn(data.points[0]);
        }
        var convertor = new BMap.Convertor();
        var pointArr = [];
        pointArr.push(ggPoint);
        convertor.translate(pointArr, 1, 5, translateCallback);
    },
    /*
	自定义icon创建标注
	@param {object}
	@property {object} Icon 不设置，默认百度原始图标对象
	@property {number} lng 要创建的标注经度
	@property {number} lat 要创建的标注维度
	@example
	mapControl.createMarker({
		lng:113.95403656908,
		lat:22.549744538467
	})
	@return {object}
	*/
    createMarker: function (option) {
		var _this = this;
		var defaults = {
			Icon:_this.setIcon(),
			lng:113.95403656908,
			lat:22.549744538467
		};
		var opts = $.extend({}, defaults, option);
		var point = new BMap.Point(opts.lng,opts.lat)
        var Marker = new BMap.Marker(point, {
            icon: opts.Icon
        });
        return Marker;
        // map.addOverlay(Marker);
    },
	/*
	自定义icon
	@param {object}
	@property {String} imgUrl 图片icon地址s
	@property {number} width 图片的原始宽度
	@property {number} height 图片的原始高度
	@example
	mapControl.setIcon({
		imgUrl:"http://api0.map.bdimg.com/images/marker_red_sprite.png",
		width:39,//img的原始宽度
		height:25//img的原始高度
	})
	@return {object} 
	*/
	setIcon:function(option){
		var defaults = {
			imgUrl:"http://api0.map.bdimg.com/images/marker_red_sprite.png",
			width:39,//img的原始宽度
			height:25//img的原始高度
		};
		var opts = $.extend({}, defaults, option);
		var icon = new BMap.Icon(opts.imgUrl, new BMap.Size(opts.width, opts.height));
		return icon;
	},
	/*
	自定义窗口
	@param {object}
	@property {String} content 信息窗口的主要内容
	@property {number} width 信息窗口的原始宽度
	@property {number} height 信息窗口的原始高度
	@property {string} title 信息窗口标题
	@example
	mapControl.setWindow({
		content:"这特么是信息窗口内容！....",
		width : 200,     // 信息窗口宽度
		height: 200,     // 信息窗口高度
		title : "信息窗口标题" , // title信息窗口标题
	})
	@return {object} 信息窗口对象
	*/
	setWindow:function(option){
		var defaults = {
			content:"这特么是信息窗口内容！....",
			width : 200,     // 信息窗口宽度
			height: 200,     // 信息窗口高度
			title : "信息窗口标题" , // title信息窗口标题
		};
		var opts = $.extend({}, defaults, option);
		var infoWindow = new BMap.InfoWindow(
				opts.content, {
				width : opts.width,     // 信息窗口宽度
				height: opts.height,     // 信息窗口高度
				title : opts.title // 信息窗口标题
		});  
		return infoWindow;
	},
	/*
	自定义右键菜单
	@param {object}
	@property {array} ContextMenu 右键菜单数据数组
	@property {string} text 右键菜单名称
	@property {function} callback 右键菜单回调函数
	@example
	mapControl.setContextMenu({
		ContextMenu:[
			{
				text:"打印",
				callback:function(e,k,m){
					console.log(e,k,m);
				}
			},
			{
				text:"删除",
				callback:function(e,k,m){
					map.removeOverlay(m);
					console.log("del");
				}
			}
		]
	})
	@return {object} 
	*/
	setContextMenu:function(option){
		var defaults = {
			ContextMenu:[
				{
					text:"打印",
					callback:function(e,k,m){
						console.log(e,k,m);
					}
				},
				{
					text:"删除",
					callback:function(e,k,m){
						map.removeOverlay(m);
						console.log("del");
					}
				}
			]
		};
		var opts = $.extend({}, defaults, option);
		var Menu = new BMap.ContextMenu();
		for(var k in opts.ContextMenu){
			Menu.addItem(
				new BMap.MenuItem(opts.ContextMenu[k].text,opts.ContextMenu[k].callback)
			);
		}
		return Menu;
	},
};


