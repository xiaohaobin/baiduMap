//渲染自定义覆盖物图标列表
fnAjax.method_4(
			'json/markToolList2.json',
			'',
			'get',
			function(d) {
				$.each(d.htmlData, function(i, v) {
					var aLi = $('<li class="' + v.className + '"></li>');
					$.each(v.htmlData, function(k, e) {
						var aA = $('<a href="javascript:void(0)" onclick="selectStyle(' + e.id + ')"><img src="' + e.src + '" style="width:' + e.width + ';height:' + e.height + ';"/></a>');
						aLi.append(aA);
					});
					$('#divStyle ul').append(aLi);
				});
			}
		);

//打开关闭样式面板
function openStylePnl() {
	if($('#divStyle').attr('data') == '1'){
		$('#divStyle').hide().removeAttr('data');
		return false;
	}
	$('#divStyle').show().attr('data','1');
}


//说明
function ps(){
	layer.alert('双击删除，拖拽更改等该信息，点击更改信息！')
}

//部署列表
function optionedList(){
	var index = layer.open({
		  type: 2,
		  area: ['700px', '530px'],
		  fixed: false, //不固定
		  maxmin: true,
		  content: 'optionedList.html'
	});
	layer.full(index);
}