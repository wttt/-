(function ($) {
    $.fn.GetPlatForm = function () {
        return this.each(function () {
            var $this = $(this), platFormVal = null;
            $this.html('<select class="form-control select2 platForm"><option value="-1" selected>--请选择平台--</option></select><input type="hidden" class="platFormValue" name="' + $this.data("valname") + '"/><input type="hidden" class="platFormText" name="' + $this.data("txtname") + '"/>');
            var oPlatForm = $this.find(".platForm"), oPlatFormValue = $this.find(".platFormValue"), oPlatFormText = $this.find(".platFormText"), ID = $this.data("id");
            if ($this.data("value") != null) {
                platFormVal = $this.data("value");
            }
            $.getJSON('http://localhost:54399/api/SalesPlatform', { enterpriseID: ID }, function (d) {
                var html = "";
                for (var i in d) {
                    html += getStr(d[i]);
                }
                oPlatForm.append(html);
                if (platFormVal != null && platFormVal != '') {
                    oPlatForm.val(platFormVal).trigger('change');
                }
            })

            oPlatForm.change(function () {
                oPlatFormValue.val(oPlatForm.val());
                oPlatFormText.val(oPlatForm.find("option:selected").text());
            });

            function getStr(item) {
                return "<option value='" + item.Value + "'>" + item.Text + "</option>"
            }

        })

    }

})(jQuery);