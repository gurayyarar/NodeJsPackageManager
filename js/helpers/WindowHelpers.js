"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var WindowHelpers = (function () {
    function WindowHelpers() {
    }
    WindowHelpers.prototype.setPackageDetailContentHeight = function () {
        var _this = this;
        this.getPackageDetailContentHeight();
        window.addEventListener('resize', function (e) {
            e.preventDefault();
            _this.getPackageDetailContentHeight();
        });
        $.each($('.package-detail-container .tab-content .tab-pane'), function (i, value) {
            _this.initScrollToTop(value);
        });
    };
    WindowHelpers.prototype.initScrollToTop = function (element) {
        var $el = $(element);
        var $scrollTop;
        if ($el.find('.scroll-to-top').length === 0) {
            $scrollTop = $('<a href="javascript:void(0);" class="scroll-to-top" title="Scroll To Top"><i class="fa fa-arrow-up"></i></a>');
            $scrollTop.hide();
            $el.append($scrollTop);
        }
        $('.package-detail-container .tab-content .tab-pane').on('click', '.scroll-to-top', function () {
            if ($el.hasClass('active'))
                $el.animate({ scrollTop: 0 }, 'slow');
        });
        $el.scroll(function () {
            if ($el.scrollTop() > 240) {
                $el.find('.scroll-to-top').fadeIn();
            }
            else {
                $el.find('.scroll-to-top').fadeOut();
            }
        });
    };
    WindowHelpers.prototype.getPackageDetailContentHeight = function () {
        var height = $('body').height() - ($('.package-detail-container .header').innerHeight() + $('footer').innerHeight() + $('.package-detail-container .nav-tabs').innerHeight()) - 31;
        $('.package-detail-info-container .tab-content .tab-pane').height(height);
    };
    return WindowHelpers;
}());
exports.WindowHelpers = WindowHelpers;
