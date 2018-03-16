window.onload = function () {
    // 创建地图实例
    var map = new BMap.Map("container");
    // 洪泽湖坐标
    var point = new BMap.Point(118.756376, 32.052573);
    map.centerAndZoom(point, 12);
    map.addControl(new BMap.ScaleControl());
    map.addControl(new BMap.OverviewMapControl());
    map.addControl(new BMap.MapTypeControl());
    //启用滚动放大
    map.enableScrollWheelZoom()
    // 创建标注
    var marker = new BMap.Marker(point);
    marker.enableDragging();
    //本地搜索
    var local = new BMap.LocalSearch(map, {
        renderOptions: {map: map}
    });
    local.search('南京市');

    //驾车路线
    var driving = new BMap.DrivingRoute(map, {
        renderOptions: {
            map: map,
            autoViewport: true
        }
    });
    //步行路线
    var walking = new BMap.WalkingRoute(map, {
        renderOptions: {
            map: map
        }
    });
    //公交路线
    var transit = new BMap.TransitRoute(map, {
        renderOptions: {map: map, panel: "results"}
    });
    $(function () {
        // 地址搜索
        $('#city').on('click', function () {
            $('.pageShow').slideToggle();
            local.search($('#local').val());
        })
        // 行车
        $('#car').on('click', function () {
            $('.pageShow').slideToggle();
            driving.search($('#star').val(), $('#end').val());
        })
        // 公交
        $('#bus').on('click', function () {
            $('.pageShow').slideToggle();
            transit.search($('#bStar').val(), $('#bEnd').val());
        })
        // 步行
        $('#walk').on('click', function () {
            $('.pageShow').slideToggle();
            walking.search($('#wStar').val(), $('#wEnd').val());
        })
    })

    $("#show").on('click', function () {
        $('.pageShow').slideToggle();
    })


}
