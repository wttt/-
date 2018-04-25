(function ($) {
    $.fn.GetProduct = function () {
        return this.each(function () {
            var $this = $(this), productVal = null;
            $this.html('<select class="form-control select2 product"><option value="-1" selected>--请选择产品--</option></select><input type="hidden" class="productValue" name="' + $this.data("valname") + '"/><input type="hidden" class="productText" name="' + $this.data("txtname") + '"/>');
            var oProduct = $this.find(".product"), oProductValue = $this.find(".productValue"), oProductText = $this.find(".productText"), ID = $this.data("id");
            if ($this.data("value") != null) {
                productVal = $this.data("value");
            }
            $.getJSON('http://localhost:54399/api/FullProductModel', { enterpriseID: ID }, function (d) {
                var html = "";
                for (var i in d) {
                    html += getStr(d[i]);
                }
                oProduct.append(html);

                if (productVal != null && productVal != '') {
                    oProduct.val(productVal).trigger('change');
                }
            })

            oProduct.change(function () {
                oProductValue.val(oProduct.val());
                oProductText.val(oProduct.find("option:selected").text());
            });

            function getStr(item) {
                return "<option value='" + item.Value + "'>" + item.Text + "</option>"
            }

        })

    }

})(jQuery);