if(typeof(localStorage) == 'undefined')

{
	var box = document.body || document.getElementsByTagName("head")[0] || document.documentElement;

	userdataobj = document.createElement('input');

	userdataobj.type = "hidden";

	userdataobj.addBehavior("#default#userData");

	box.appendChild(userdataobj);

	//设定对象  

	var localStorage = {

		setItem: function(nam, val)

		{
			userdataobj.load(nam);

			userdataobj.setAttribute(nam, val);

			var d = new Date();

			d.setDate(d.getDate() + 700);

			userdataobj.expires = d.toUTCString();

			userdataobj.save(nam);

			userdataobj.load("userdata_record");

			var dt = userdataobj.getAttribute("userdata_record");

			if(dt == null) dt = '';

			dt = dt + nam + ",";

			userdataobj.setAttribute("userdata_record", dt);

			userdataobj.save("userdata_record");
		},

		//模拟 setItem

		getItem: function(nam)

		{
			userdataobj.load(nam);

			return userdataobj.getAttribute(nam);
		},

		//模拟 getItem

		removeItem: function(nam)

		{
			userdataobj.load(nam);

			clear_userdata(nam)

			userdataobj.load("userdata_record");

			var dt = userdataobj.getAttribute("userdata_record");

			var reg = new RegExp(nam + ",", "g");

			dt = dt.replace(reg, '');

			var d = new Date();

			d.setDate(d.getDate() + 700);

			userdataobj.expires = d.toUTCString();

			userdataobj.setAttribute("userdata_record", dt);

			userdataobj.save("userdata_record");

		},

		//模拟 removeItem

		clear: function() {

			userdataobj.load("userdata_record");

			var dt = userdataobj.getAttribute("userdata_record").split(",");

			for(var i in dt)

			{
				if(dt[i] != '') clear_userdata(dt[i])
			}

			clear_userdata("userdata_record")

		}

		//模拟 clear();

	}

	function clear_userdata(keyname) //将名字为keyname的变量消除

	{
		var keyname;

		var d = new Date();

		d.setDate(d.getDate() - 1);

		userdataobj.load(keyname);

		userdataobj.expires = d.toUTCString();

		userdataobj.save(keyname);

	}

}