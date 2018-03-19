var tanbaOption = '';
var sHtml;
//获取探霸列表
$.ajax({
	type:"get",
	url:"json/tanba.json",
	async:true,
	success:function(data){
//		console.log(data);
		for(var k in data.de){
			tanbaOption += '<option value="'+ data.de[k].id +'" data-stateNum="'+ data.de[k].stateNum +'">'+ data.de[k].id +'（'+ data.de[k].state +'）</option>';
		}
		sHtml = '<form class="form"><h4 style="font-size:12px">属性信息:</h4><table border="0"cellpadding="1"cellspacing="1"><tr><td align="left"class="common">探霸名称：</td><td colspan="2"><input type="text"maxlength="50"size="18"id="tanbaName"></td><td valign="top"><span class="star">*</span></td></tr><tr><td align="left"class="common">探霸id：</td><td colspan="2"><select id="tanbaID">'+ tanbaOption +'</select></td><td valign="top"><span class="star">*</span></td></tr><tr><td align="left"class="common">部署半径（m）：</td><td colspan="2"><input type="text"maxlength="50"size="18"id="radius" value="100"></td><td valign="top"><span class="star">*</span></td></tr><tr><td align="left"class="common">地址：</td><td colspan="2"><input type="text"maxlength="50"size="18"id="tanbaAddr"readonly></td><td valign="top"><span class="star">*</span></td></tr><tr><td align="left"class="common">经纬度：</td><td colspan="2"><input type="text"maxlength="50"size="18"id="jwd"readonly></td><td valign="top"><span class="star">*</span></td></tr><tr><td align="left"class="common">图标地址：</td><td colspan="2"><input type="text"id="tanbaIcon"readonly></td><td valign="top"><span class="star">*</span></td></tr><tr><td align="left"class="common">描述：</td><td colspan="2"><textarea rows="2"cols="15"id="desc"></textarea></td><td valign="top"></td></tr><tr><td align="center"colspan="3"><input type="button"onclick="fnOK()"value="确定">&nbsp;&nbsp;<input type="reset"value="重填"></td></tr></table></form>';
		
	}	
});

