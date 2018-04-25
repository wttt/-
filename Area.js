(function ($) {
    $.fn.AreaSelect = function () {
        return this.each(function () {
            var _url = "http://localhost:54399/api/Region?code=",event = null, codedata = null,$this = $(this);
            $this.html('<div class="col-sm-5"><select class="form-control select2 province"  style="width:33%;float:left"  required><option value="null">--请选择省份--</option></select>' +
                '<select class="form-control select2 city"  style="width:33%;float:left" required><option value="null">--请选择城市--</option></select >' +
                '<select class="form-control select2 district"  style="width:33%;float:left" required><option value="null">--请选择区县--</option></select></div>' +
                '<label class="control-label col-sm-1">详细地址:</label><div id="map"></div><div class="col-sm-5"><input type="text" name="' + $this.data("addressname") + '"  class="form-control " id="suggestId"  placeholder="填写地址时会出现智能提示，若选择提示列表内的地址会自动选择安装地区" value="" required>' +
                '<div id= "searchResultPanel" style= "border:1px solid #C0C0C0;width:150px;height:auto;display:none"></div>' +
                '<input type="hidden" class="valHiddenID"  name="' + $this.data("valname") + '">' +
                '<input type="hidden" class="textHiddenID" name="' + $this.data("txtname") + '">' +
                '<input type="hidden" class="lng" name="' + $this.data("lngname") + '"><input type="hidden" class="lat" name="' + $this.data("latname") + '"></div>');

            var oProvince = $this.find(".province"), oCity = $this.find(".city"), oDistrict = $this.find(".district"), oVal = $this.find(".valHiddenID"), oText = $this.find(".textHiddenID"), oLat = $this.find(".lat"), oLng = $this.find(".lng");;
            if ($this.data("value") != null && $this.data("value") != '') {
                var codestr = $this.data("value");
                codedata = {
                    province: codestr.toString().substring(0, 2) + '0000',
                    city: codestr.toString().substring(0, 4) + '00',
                    area: codestr.toString()
                };
                event = $this.data("cityevent");
            }

            $.ajax({
                type: "get",
                url: _url + "000000",
                dataType: "json",
                success: function (d) {
                    var s = "";
                    for (var i in d) {
                        s += getStr(d[i]);
                    }
                    oProvince.append(s);
                    if (codedata != null) {
                        oProvince.val(codedata.province).trigger('change');
                    }
                    fullCity();
                }
            });

            function fullCity() {
                oCity.val('null').trigger('change');
                var pcode = oProvince.val();
                $.ajax({
                    type: "get",
                    url: _url + pcode,
                    dataType: "json",
                    success: function (d) {
                        var s = "";
                        for (var i in d) {
                            s += getStr(d[i]);
                        }
                        oCity.html('<option value="null">--请选择城市--</option>' + s);
                        if (codedata != null) {
                            oCity.val(codedata.city).trigger('change');
                        }
                        fullArea();
                    }
                });
            }

            function fullArea() {
                oDistrict.val('null').trigger('change');
                var pcode = oCity.val();
                $.ajax({
                    type: "get",
                    url: _url + pcode,
                    dataType: "json",
                    success: function (d) {
                        var s = "";
                        for (var i in d) {
                            s += getStr(d[i]);
                        }
                        oDistrict.html('<option value="null">--请选择区县--</option>' + s);
                        if (codedata != null) {
                            oDistrict.val(codedata.area).trigger('change');
                        }
                        if (typeof (event) == "string") {
                            eval(event + "('" + oCity.val() + "')");
                        }
                        fullval();
                    }
                });
            }
            function fullval() {
                oVal.val(oDistrict.val());
                oText.val(oProvince.find("option:selected").text() + "  " + oCity.find("option:selected").text() + "  " + oDistrict.find("option:selected").text());
            }
            oProvince.change(function () {
                fullCity();
            });
            oCity.change(function () {
                fullArea();
            });
            oDistrict.change(function () {
                fullval();
            });
            function getStr(item) {
                return "<option value='" + item.Value + "'>" + item.Text + "</option>"
            }
            ////百度地图
            var myValue;
            var map = new BMap.Map("map");
            var myGeo = new BMap.Geocoder();
            map.centerAndZoom("北京", 18);   // 初始化地图,设置城市和地图级别。
            var ac = new BMap.Autocomplete(    //建立一个自动完成的对象
                {
                    "input": 'suggestId'
                    , "location": map
                });
            function G(id) {
                return document.getElementById(id);
            }
            function setPlace() {
                function myFun() {
                    var pp = local.getResults().getPoi(0).point;    //获取第一个智能搜索的结果  
                    oLng.val(pp.lng);
                    oLat.val(pp.lat);
                    map.centerAndZoom(pp, 18);
                    ShowArea(pp)
                }
                var local = new BMap.LocalSearch(map, { //智能搜索
                    onSearchComplete: myFun
                });
                local.search(myValue);
            }
            ac.addEventListener("onconfirm", function (e) {    //鼠标点击下拉列表后的事件
                var _value = e.item.value;
                myValue = _value.province + _value.city + _value.district + _value.street + _value.business;
                G("searchResultPanel").innerHTML = "onconfirm<br />index = " + e.item.index + "<br />myValue = " + myValue;
                setPlace();
            });
            function ShowArea(val) {
                myGeo.getLocation(val, function (rs) {
                    addComp = rs.addressComponents;
                    $.ajax({
                        url: 'http://localhost:54399/api/Region',
                        data: {
                            provincename: addComp.province,
                            cityname: addComp.city,
                            districtname: addComp.district
                        },
                        type: "get",
                        dataType: "json",
                        success: function (res) {
                            codestr = res;
                            codedata = {
                                province: codestr.toString().substring(0, 2) + '0000',
                                city: codestr.toString().substring(0, 4) + '00',
                                area: codestr.toString()
                            };
                            oProvince.val(codedata.province).trigger('change');
                            fullCity();

                        }
                    })
                });
            }
        });


    };
})(jQuery);