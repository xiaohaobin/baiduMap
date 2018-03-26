// 百度地图API功能
var map = new BMap.Map("allmap");
map.centerAndZoom(new BMap.Point(113.953812, 22.549255), 17);

map.enableScrollWheelZoom();

/*
 * 缩放工具栏			
 * */
var navigationControl = new BMap.NavigationControl({
	anchor: BMAP_ANCHOR_BOTTOM_RIGHT,
	offset: new BMap.Size(0, 30),
	type: BMAP_NAVIGATION_CONTROL_LARGE,
	showZoomInfo: true,
	enableGeolocation: true
});
map.addControl(navigationControl);

/*
 比例尺,比例尺比例和地图级别有关
 * */
var scaleControl = new BMap.ScaleControl({
	anchor: BMAP_ANCHOR_TOP_RIGHT,
	offset: new BMap.Size(0, 0),
});
map.addControl(scaleControl);

//负责进行地图当前位置定位的控件
var geolocationControl = new BMap.GeolocationControl({
	anchor: BMAP_ANCHOR_BOTTOM_LEFT,
	showAddressBar: true,
	offset: new BMap.Size(10, 50),
	enableGeolocation: true
});
//定位成功事件
geolocationControl.addEventListener("locationSuccess", function(e) {
	// 定位成功事件
	console.log(e);
	var address = '';
	address += e.addressComponent.province;
	address += e.addressComponent.city;
	address += e.addressComponent.district;
	address += e.addressComponent.street;
	address += e.addressComponent.streetNumber;
	layer.alert("当前定位地址为：" + address);
	//			    console.log(geolocationControl.getAddressComponent());//：返回当前的定位信息。
});
//定位失败事件
geolocationControl.addEventListener("locationError", function(e) {
	layer.alert("定位失败：" + e.message);
});
map.addControl(geolocationControl);