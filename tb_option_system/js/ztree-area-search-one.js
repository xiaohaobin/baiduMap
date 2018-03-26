var setting = {
	async: {
		enable: true, //开启异步加载处理  
		url: url_join("areaList"),
		//					url:"http://10.10.10.22/areaList/",
		autoParam: ["id"],
		dataFilter: filter,
//		contentType: "application/json",
		type: "post"
	},
	check: {
		//					enable: true //添加勾选功能
	},
	view: {
		expandSpeed: "",
		addHoverDom: addHoverDom,
		removeHoverDom: removeHoverDom,
		selectedMulti: false
	},
	edit: {
		enable: true
	},
	data: {
		simpleData: {
			enable: true
		}
	},
	callback: {
		beforeDrag: beforeDrag, //拖拽之前回调
		beforeRemove: beforeRemove,
		beforeRename: beforeRename,
		beforeCheck: beforeCheck, //勾选的时候的回调
		onClick: zTreeOnClick, //点击节点回调函数
	}
};

//点击节点回调函数
function zTreeOnClick(event, treeId, treeNode) {
	//			    alert(treeNode ? treeNode.tId + ", " + treeNode.name : "isRoot");
	if(treeNode) {
		console.log(treeNode);
		console.log(treeNode.id + "," + treeNode.pId + "," + treeNode.name);
		var sHtml = $('<div class="hasSelect btn-group" data-id="' + treeNode.id + '" data-pId="' + treeNode.pId + '"><button type="button"class="btn btn-sm btn-primary selectContent">' + treeNode.name + '</button><a href="#"class="closeBtn btn btn-sm btn-danger">X</a></div>');
		$(".showArea").html(sHtml);

		//删除标签
		$("body").delegate(".hasSelect .closeBtn", "click", function(event) {
			
			$(this).parent().remove();
			return false;
		});
	}
};

function beforeDrag() {
	return false;
}

function beforeCheck(treeId, treeNode) {
	console.log(treeNode);
	return(treeNode.doCheck !== false);
} //页面加载获取列表
function filter(treeId, parentNode, childNodes) {
	if(!childNodes)
		return null;
	for(var i = 0, l = childNodes.data.length; i < l; i++) {
		childNodes.data[i].name = childNodes.data[i].address.replace(/\.n/g, '.');
		//					childNodes.data[i].isParent = true; //isParent的值为true指的是有子节点，否则则是false
		if(childNodes.data[i].is_parent == 0) {
			childNodes.data[i].isParent = false;
		}
		if(childNodes.data[i].is_parent == 1) {
			childNodes.data[i].isParent = true;
		}
	}
	return childNodes.data;
}

//删除请求
function beforeRemove(treeId, treeNode) {
	
	console.log(treeNode);
	if(treeNode.is_parent == 1){
		layer.alert("父节点不可以删除");
		return false;
	}
	else{
		layer.confirm("确认删除节点？", 
			function(index) {
				fnAjax.method_4(
					url_join("deleteArea"), {
						"id": treeNode.id
					},
					"post",
					function(data) {
						if(data.code == "10111") {
							layer.msg("操作失败", {
								icon: 0,
								time: 1000
							}, function() {
								layer.close(index);
								location.reload();
							});
						}
						if(data.code == 0) {
							layer.msg("操作成功", {
								icon: 1,
								time: 1000
							}, function() {
								layer.close(index);
							});
						}
					}
				);
			},
			function(){
				location.reload();
			}
		);
	}
	
	//				
}

//修改名字
function beforeRename(treeId, treeNode, newName) {
	console.log(treeNode);
	if(newName.length == 0) {
		layer.alert("节点名称不能为空.");
		return false;
	}
	fnAjax.method_4(
		url_join("updateArea"), {
			"pid": treeNode.pId,
			"id": treeNode.id,
			"address": newName
		},
		"post",
		function(data) {
			if(data.message == "SUCCESS") {
				layer.msg("操作成功", {
					icon: 1,
					time: 1000
				});
			}
		}
	);
	//				
	return true;
}

//添加节点
function addHoverDom(treeId, treeNode) {
	var sObj = $("#" + treeNode.tId + "_span");
	if(treeNode.editNameFlag || $("#addBtn_" + treeNode.tId).length > 0)
		return;
	var addStr = "<span class='button add' id='addBtn_" + treeNode.tId +
		"' title='add node' onfocus='this.blur();'></span>";
	sObj.after(addStr);
	var btn = $("#addBtn_" + treeNode.tId);
	if(btn) {
		btn.bind("click", function() {
			layer.prompt({
				formType: 0,
				value: '某某节点',
				title: '请输入要添加的节点'
			}, function(value, index, elem) {
				//						  alert(value); //得到value
				var Ppname = value;

				if(Ppname == null) {
					return;
				} else if(Ppname == "") {
					layer.alert("节点名称不能为空");
				} else {
					var zTree = $.fn.zTree.getZTreeObj("treeDemo");
					fnAjax.method_4(
						url_join("addArea"), {
							"pid": treeNode.id, //要创建的节点的父级id
							"address": Ppname
						},
						"post",
						function(data) {
							var newNodeId = data.data.areaId;
							console.log(data.data.areaId);
							if(data.message == "SUCCESS") {
								if($.trim(data) != null) {
									var treenode = $.trim(data);
									zTree.addNodes(treeNode, {
										pId: treeNode.id,
										name: Ppname,
										id: newNodeId
									}, true);
									layer.msg("操作成功");
								}

							}
						}
					);
					//						
				}

				layer.close(index);
			});

		});
	}

};

function removeHoverDom(treeId, treeNode) {
	$("#addBtn_" + treeNode.tId).unbind().remove();
};
$(document).ready(function() {
	$.fn.zTree.init($("#treeDemo"), setting);

});

$(".showArea").css("overflow","auto");


