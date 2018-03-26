var tanbaOption = '';
var sHtml = null;
//已经部署的探霸数据数组
var aTbInfo = [];
var curMkr = null; // 记录当前添加的Mkr
var geoc = new BMap.Geocoder();//实例化查询定位对象
var infoWin,mkrTool;
var labelStyle = {
		border: "solid 1px gray",
		padding:'2px 5px',
		borderRadius:'3px',
		minWidth:'50px',
		overflow:'hidden',
		whiteSpace:'nowrap',
		textOverflow:'ellipsis'
};
fnAjax.method_4(
	url_join('Device/queryDevice?page=1'),
	'',
	'get',
	function(data){
		console.log(data);
	}
);

//获取探霸列表
$.ajax({
	type:"get",
	url:"json/tanba.json",
	async:true,
	success:function(data){
		for(var k in data.de){
			tanbaOption += '<option value="'+ data.de[k].id +'" data-stateNum="'+ data.de[k].stateNum +'">'+ data.de[k].id +'（'+ data.de[k].state +'）</option>';
		}
		//信息窗口模板
//		sHtml ='<form class="form">'+
//					'<h4 style="font-size:12px">属性信息:</h4>'+
//					'<table border="0" cellpadding="1" cellspacing="1">'+
//						'<tr>'+
//							'<td align="left" class="common">探霸名称：</td>'+
//							'<td colspan="2"><input type="text" maxlength="50" size="18" id="tanbaName"></td>'+
//							'<td valign="top"><span class="star">*</span></td>'+
//						'</tr>'+
//						'<tr>'+
//							'<td align="left" class="common">探霸id：</td>'+
//							'<td colspan="2">'+
//								'<select id="tanbaID">'+ tanbaOption +'</select>'+
//							'</td>'+
//							'<td valign="top"><span class="star">*</span></td>'+
//						'</tr>'+
//						'<tr>'+
//							'<td align="left" class="common">部署半径（m）：</td>'+
//							'<td colspan="2"><input type="text" maxlength="50" size="18" id="radius" value="100"></td>'+
//							'<td valign="top"><span class="star">*</span></td>'+
//						'</tr>'+
//						'<tr>'+
//							'<td align="left" class="common">地址：</td>'+
//							'<td colspan="2"><input type="text" maxlength="50" size="18" id="tanbaAddr" readonly></td>'+
//							'<td valign="top"><span class="star">*</span></td>'+
//						'</tr>'+
//						'<tr>'+
//							'<td align="left" class="common">经纬度：</td>'+
//							'<td colspan="2"><input type="text" maxlength="50" size="18" id="jwd" readonly></td>'+
//							'<td valign="top"><span class="star">*</span></td>'+
//						'</tr>'+
//						'<tr>'+
//							'<td align="left" class="common">图标地址：</td>'+
//							'<td colspan="2"><input type="text" id="tanbaIcon" readonly></td>'+
//							'<td valign="top"><span class="star">*</span></td>'+
//						'</tr>'+
//						'<tr>'+
//							'<td align="left" class="common">描述：</td>'+
//							'<td colspan="2"><textarea rows="2" cols="15" id="desc"></textarea></td>'+
//							'<td valign="top"></td>'+
//						'</tr>'+
//						'<tr>'+
//							'<td align="center" colspan="3"><input type="button" onclick="fnOK()" value="确定">&nbsp;&nbsp;<input type="reset" value="重填"></td>'+
//						'</tr>'+
//					'</table>'+
//				'</form>';
				
		sHtml = `
			<div class="container-fluid">
				<form class="form-horizontal">
					<div class="form-group">
						<label for="tanbaID" class="col-sm-3 control-label">设备MAC：</label>
						<div class="col-sm-9">
							<input type="text" class="form-control" id="tanbaID" placeholder="MAC" datatype="s15-18" errormsg="请输入正确的MAC！">
						</div>
					</div>
					<div class="form-group">
						<label for="tanbaName" class="col-sm-3 control-label">设备名称：（可选）</label>
						<div class="col-sm-9">
							<input type="text" class="form-control" id="tanbaName" placeholder="Name">
						</div>
					</div>
					<div class="form-group mobile-hide">
						<label for="deviceStatus" class="col-sm-3 control-label">设备状态：</label>
						<div class="col-sm-9">
							<select class="form-control" id="deviceStatus">
								<option value="0">正常</option>
								<option value="1">在线</option>
								<option value="2">离线</option>
								<option value="3">故障</option>
								<option value="4">维修中</option>
								<option value="5">报废</option>
							</select>
						</div>
					</div>
					<div class="form-group mobile-hide">
						<label for="deviceType" class="col-sm-3 control-label">设备类型：</label>
						<div class="col-sm-9">
							<select class="form-control" id="deviceType">
								<option value="0">基站</option>
								<option value="1">移动</option>
							</select>
						</div>
					</div>
					
					<div class="form-group mobile-hide">
						<label for="locationType" class="col-sm-3 control-label">位置类型：</label>
						<div class="col-sm-9">
							<select class="form-control" id="locationType">
								<option value="0">不设定</option>
								<option value="1">出口</option>
								<option value="2">入口</option>
							</select>
						</div>
					</div>
					<div class="form-group">
						<label for="radius" class="col-sm-3 control-label">天线功率：</label>
						<div class="col-sm-9">
							<select class="form-control" id="radius">
								<option value="0" data="100">2db(100m)</option>
								<option value="1" data="150">3db(150m)</option>
								<option value="2" data="200">6db(200m)</option>
								<option value="3" data="300">9db(300m)</option>
								<option value="4" data="320">10db(320m)</option>
							</select>
						</div>
					</div>
					<div class="form-group">
						<label for="longitude" class="col-sm-3 control-label">经度：</label>
						<div class="col-sm-9">
							<input type="number" class="form-control" id="lng" placeholder="经度" readonly>
						</div>
					</div>
					<div class="form-group">
						<label for="latitude" class="col-sm-3 control-label">纬度：</label>
						<div class="col-sm-9">
							<input type="number" class="form-control" id="lat" placeholder="纬度" readonly>
						</div>
					</div>
					<div class="form-group">
						<label for="tanbaAddr" class="col-sm-3 control-label">详细地址：</label>
						<div class="col-sm-9">
							<input type="text" class="form-control" id="tanbaAddr" placeholder="地址" datatype="s" readonly>
						</div>
					</div>
					<div class="form-group mobile-hide">
						<label for="tanbaIcon" class="col-sm-3 control-label">图标url：</label>
						<div class="col-sm-9">
							<input type="text" class="form-control" id="tanbaIcon" placeholder="图标" datatype="s" readonly>
						</div>
					</div>
					<div class="form-group">
						<label for="desc" class="col-sm-3 control-label">备注：</label>
						<div class="col-sm-9">
							<input type="text" class="form-control" id="desc" placeholder="备注" datatype="s">
						</div>
					</div>
					<div class="form-group mobile-hide">
						<label for="" class="col-sm-3 control-label">安装区域：</label>
						<div class="col-sm-9">
							<div class="ztreeBox">
								<div class="content_wrap">
									<div class="zTreeDemoBackground left">
										<ul id="treeDemo" class="ztree"></ul>
									</div>
								</div>
								<div class="">
									<div>
										<h5>已选择地区(单选)</h5>
									</div>
									<div class="showArea row border-2-gray radius">
										
									</div>
								</div>
							</div>
						</div>
					</div>
					<div class="text-center">
						<button type="button" id="submitBtn" class="btn btn-primary mr-20" onclick="fnOK()">确定</button>
						<button type="reset" id="cancelBtn" class="btn btn-default">重置</button>
					</div>
				</form>
			</div>
		`;
		initData();
	}	
});

//实例化标注,初始化标注数据
function initData(){
	
	//sHtml form formTpl.js,创建信息窗口
	infoWin = new BMap.InfoWindow(sHtml, {
		offset: new BMap.Size(0, -10),
		width:500,
		height:500
	});
	
	//监听关闭信息窗口
	infoWin.addEventListener('open',function(evt){
		onloadZtree();
	});
	
	//回显已经部署的探霸
	if(localStorage.getItem("aTbInfo")){
		aTbInfo = JSON.parse(localStorage.getItem("aTbInfo"));
		console.log(aTbInfo);
		//添加标注
		for(var ke in aTbInfo){
			var backP = new BMap.Point(aTbInfo[ke].jwd[0], aTbInfo[ke].jwd[1]);
			var backIcon = new BMap.Icon(aTbInfo[ke].tanbaIcon, new BMap.Size(36, 36));
			var backMkr = new BMap.Marker(backP, {
				icon: backIcon
			}); 
			
			backMkr.code = aTbInfo[ke];//绑定属性数据
			backMkr.enableDragging(); //设置可拖拽
			map.addOverlay(backMkr); // 将标注添加到地图中
			
			//设置label和//设置title
			if(backMkr) {
				var lbl = new BMap.Label(aTbInfo[ke].tanbaName, {
					offset: new BMap.Size(15, -15)
				});
				lbl.setStyle(labelStyle);
				backMkr.setLabel(lbl);
				//设置title
				var title = "探霸id: " + aTbInfo[ke].tanbaID + "\n\r" + "地址: " + aTbInfo[ke].tanbaAddr + "\n\r" + "描述: " + aTbInfo[ke].desc;
				backMkr.setTitle(title);
			}
			
			//设置范围圆圈
			var circle = new BMap.Circle(backP,aTbInfo[ke].radius,{fillColor:"blue", strokeWeight: 1 ,fillOpacity: 0.3, strokeOpacity: 0.3});
			map.addOverlay(circle);
			
			//监听开始拖拽的事件
			var oPoint = null;
			backMkr.addEventListener("dragstart", function(e) { //拖动事件
				oPoint = this.point;
				this.openInfoWindow(infoWin);
				$(".BMap_bubble_content").parent().addClass('scroll');
				//回显地址，经纬度，当前icon图标，当前圆半径...
				$('#tanbaName').val(this.code.tanbaName);
				$('#tanbaIcon').val(this.code.tanbaIcon);
				$('#tanbaID').val(this.code.tanbaID);
				$('#radius').val(this.code.radius);
				$('#desc').val(this.code.desc);
			});
			//监听拖动之后覆盖物，更新编辑其信息
			backMkr.addEventListener("dragend", function(e) { //拖动事件 
				
				//回显地址
				backAddr(e.point,$('#tanbaAddr'));
//				$('#jwd').val(e.point.lng + "," + e.point.lat);
				$('#lng').val(e.point.lng);
				$('#lat').val(e.point.lat);
				//圆对象随之移动
				var oCircle = oBackCircle(oPoint);
				oCircle.setCenter(e.point);
			});
			
			
			//监听标注点击事件
			backMkr.addEventListener("click", function(e,d,w) { 
				var _this = this;
				console.log(_this.code,_this.point);
				//打开信息窗口
				this.openInfoWindow(infoWin);
				$(".BMap_bubble_content").parent().addClass('scroll');
				//回显地址，经纬度，当前icon图标，当前圆半径...
				$('#tanbaName').val(_this.code.tanbaName);
				$('#tanbaIcon').val(_this.code.tanbaIcon);
				$('#tanbaAddr').val(_this.code.tanbaAddr);
				$('#tanbaID').val(_this.code.tanbaID);
				$('#radius').val(_this.code.radius);
				$('#desc').val(_this.code.desc);
//				$('#jwd').val(_this.code.jwd[0] + ',' + _this.code.jwd[1]);
				$('#lng').val(_this.code.jwd[0]);
				$('#lat').val(_this.code.jwd[1]);
			
				//监听圆半径输入框键盘输入事件
				$('#radius').on('change',function(){
					console.log($(this).find('option:selected'));
					var nMeter = $(this).find('option:selected').attr('data');
					var oCircle = oBackCircle(_this.point);
					oCircle.setRadius(nMeter);
				});
				
			});
			
			//监听双击删除探霸
			backMkr.addEventListener("dblclick", function(e) { 
				var _this = this;
				var aO = map.getOverlays();
				//删除对应覆盖物的圆圈
				$.each(aO, function(i,v) {
//					console.log(v);
//					console.log(v.__proto__.vQ);//覆盖物类型
					if(v.__proto__.vQ == 'Circle' && v.point.lat == _this.point.lat && v.point.lng == _this.point.lng) map.removeOverlay(v);
				});
				map.removeOverlay(this);
//						//判断删除所点击的探霸数据，并返回剩下的数据存储在local中
				aTbInfo = _.reject(aTbInfo, function(v){
					return _.isEqual(v,_this.code) == true;
				});
				localStorage.setItem("aTbInfo",JSON.stringify(aTbInfo));
			});
		}
		
	}
	
	//自定义标注类对象
	mkrTool = new BMapLib.MarkerTool(map, {
		autoClose: true
	});
	//监听覆盖物添加到地图事件
	mkrTool.addEventListener("markend", function(evt) {
		console.log(evt.target._opts.icon);
		var mkr = evt.marker;
		mkr.enableDragging(); //设置可拖拽
		mkr.openInfoWindow(infoWin);
		$(".BMap_bubble_content").parent().addClass('scroll');
		curMkr = mkr;
		
		//初始化经纬度，图标和地址
		$('#tanbaIcon').val(evt.target._opts.icon.imageUrl);
//		$('#jwd').val(mkr.getPosition().lng + ',' + mkr.getPosition().lat);
		$('#lng').val(mkr.getPosition().lng);
		$('#lat').val(mkr.getPosition().lat);
		//回显地址
		var	pt = mkr.getPosition();
		backAddr(pt,$('#tanbaAddr'));
		
		//监听拖动覆盖物，更新编辑其信息
		mkr.addEventListener("dragend", function(e) { //拖动事件 
		//回显地址
			backAddr(e.point,$('#tanbaAddr'));
//			$('#jwd').val(e.point.lng + "," + e.point.lat);
			$('#lng').val(e.point.lng);
			$('#lat').val(e.point.lat);
			//重新设置圆的中心点
			circle.setCenter(e.point);
		});
		
		//监听点击覆盖物,更新编辑其信息
		mkr.addEventListener("click", function(e,d,w) { 
			console.log(e);
			var _this = this;
			//打开信息窗口
			this.openInfoWindow(infoWin);
			$(".BMap_bubble_content").parent().addClass('scroll');
			//回显地址，经纬度，图标路劲，圆的半径
			backAddr(e.point,$('#tanbaAddr'));
			console.log(e.point.lng + "," + e.point.lat);
//			$('#jwd').val(e.point.lng + "," + e.point.lat);
			$('#lng').val(e.point.lng);
			$('#lat').val(e.point.lat);
			$('#tanbaIcon').val(_this.z.kj.imageUrl);
			$('#radius').val(circle.getRadius());
			
			
		});
		

		//画圆
		var nLng = mkr.getPosition().lng,
			nLat = mkr.getPosition().lat;
		var cPoint = new BMap.Point(nLng, nLat);
		var circle = new BMap.Circle(cPoint,100,{fillColor:"blue", strokeWeight: 1 ,fillOpacity: 0.3, strokeOpacity: 0.3});
		map.addOverlay(circle);
		
		//监听圆半径输入框键盘输入事件
		$('#radius').on('change',function(){
			console.log($(this).find('option:selected'));
			var nMeter = $(this).find('option:selected').attr('data');
			circle.setRadius(nMeter);
		});
	});
	
}

//提交数据
function fnOK() {
	//提交后台数据
	var tanbaName = $('#tanbaName').val();//探霸名称
	var tanbaID = $('#tanbaID').val();//id
	var tanbaAddr = $('#tanbaAddr').val();//详细地址
	var lng = $('#lng').val();//经度
	var lat = $('#lat').val();//维度
	var desc = $('#desc').val();//备注
	var tbDB = $('#radius').val();//天线功率
	var tanbaIcon = $('#tanbaIcon').val();//tbIcon
	var deviceStatus = $('#deviceStatus').val();//设备状态
	var deviceType = $('#deviceType').val();//设备类型
	var locationType = $('#locationType').val();//位置类型	
	var hasSelect = $('.hasSelect').attr('data-id');//安装区域id
	
	var hasSelectTxt = $('.hasSelect .selectContent').text();//安装区域字段	
	var radius = $('#radius').find('option:selected').attr('data');//覆盖范围半径（米）
	var deviceStatusTxt = $('#deviceStatus').find('option:selected').text();//设备状态字段
	var deviceTypeTxt = $('#deviceType').find('option:selected').text();//设备类型字段
	var locationTypeTxt = $('#locationType').find('option:selected').text();//位置类型字段
	var jwd = lng + ',' + lat;//经纬度
	
	if(curMkr) {
		//设置label
		var lbl = new BMap.Label(tanbaName, {
			offset: new BMap.Size(15, -15)
		});
		lbl.setStyle(labelStyle);
		curMkr.setLabel(lbl);

		//设置title
		var title = "探霸id: " + tanbaID + "\n\r" + "地址: " + tanbaAddr + "\n\r" + "备注: " + desc;
		curMkr.setTitle(title);
	}
	if(infoWin.isOpen()) {
		map.closeInfoWindow();
	}
	
	//在此用户可将数据提交到后台数据库中
	var tanbaData = {
		tanbaName:tanbaName,
		tanbaID:tanbaID,
		tanbaAddr:tanbaAddr,
		jwd:$.stringToArray(jwd,','),
		desc:desc,
		radius:radius,
		tanbaIcon:tanbaIcon,
		tbDB:tbDB,
		deviceStatus:deviceStatus,
		deviceType:deviceType,
		locationType:locationType,
		hasSelect:hasSelect,
		hasSelectTxt:hasSelectTxt,
		deviceStatusTxt:deviceStatusTxt,
		deviceTypeTxt:deviceTypeTxt,
		locationTypeTxt:locationTypeTxt
	}
	
	
	if(localStorage.getItem("aTbInfo")){
		aTbInfo = JSON.parse(localStorage.getItem("aTbInfo"));
	}
	aTbInfo.push(tanbaData);
	localStorage.setItem("aTbInfo",JSON.stringify(aTbInfo));
	console.log(JSON.parse(localStorage.getItem("aTbInfo")));
	window.location.reload();
	
}



//选择覆盖物样式
function selectStyle(index) {
	mkrTool.open(); //打开工具 
	console.log(BMapLib);
	var icon = BMapLib.MarkerTool.SYS_ICONS[index]; //设置工具样式，使用系统提供的样式BMapLib.MarkerTool.SYS_ICONS[0] -- BMapLib.MarkerTool.SYS_ICONS[23]
	console.log(icon);
	mkrTool.setIcon(icon);
	$('#divStyle').hide();
}


//定位回显地址到表单
function backAddr(pt,ele){
	geoc.getLocation(pt, function(rs) {
		addComp = rs.addressComponents;
		dizhi = addComp.city + addComp.district + addComp.street + addComp.streetNumber;
		ele.val(dizhi);
	});
}


/*
 返回最小绝对值
 输入aN，数组对象，o，对象
 return arr
 * */
function backMin(aN,o){
	
	return	_.min(aN,function(v){
			return Math.abs(v.lat - o.lat) && Math.abs(v.lng - o.lng);
	});
	
}
/*
 返回匹配的圆对象
 输入:匹配的接近经纬度对象
 输出：obj，圆对象
 * */

function oBackCircle(oPoint){
	var getCircle;
	var aPoints = [];
	var aO = map.getOverlays();
	//重新设置圆的中心点,因为拖拽的时候触点有误差，故加入最小偏差算法
	$.each(aO, function(i,v) {
		if(v.__proto__.vQ == 'Circle'){
			aPoints.push(v.point);
		} 
	});
	
	$.each(aO, function(i,v) {
		if(_.isEqual(v.point,backMin(aPoints,oPoint))){
			getCircle = v;
		}
	});
	return getCircle;
	
}

//导入树状菜单
function onloadZtree(){
	$('#sc').remove();
	var sc = $('<script src="js/ztree-area-search-one.js" type="text/javascript" id="sc"></script>');
	$('body').append(sc);
}
