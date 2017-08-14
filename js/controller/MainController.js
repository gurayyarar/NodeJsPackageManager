"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var constantHelpers = require("../helpers/ConstantHelpers");
var MainController = (function () {
    function MainController($scope) {
        this.$scope = $scope;
        this.setSplitPanel();
    }
    MainController.prototype.setSplitPanel = function () {
        var packageExplorerWidth = localStorage.getItem(constantHelpers.LSKey_Package_Explorer_Width) || constantHelpers.Default_Package_Explorer_Width.toString();
        var packageContentWidth = localStorage.getItem(constantHelpers.LSKey_Content_Split_LeftSide_Width) || constantHelpers.Default_Content_Split_LeftSide_Width.toString();
        this.$scope.$root.packageExplorerStyle = { 'width': packageExplorerWidth + "px" };
        this.$scope.$root.contentSplitStyle = { 'width': packageContentWidth + "px" };
        this.$scope.$root.packageExplorerDividerAndRightSideStyle = { 'left': packageExplorerWidth + "px" };
        this.$scope.$root.contentDividerAndRightSideStyle = { 'left': packageContentWidth + "px" };
        $('.main-split-pane').splitPane();
        $('.main-split-pane .split-pane-divider').on('mousedown', function () {
            var $this = $(this);
            $('body').one('mouseup', function () {
                var outerWidth = $this.prev().outerWidth();
                localStorage.setItem(constantHelpers.LSKey_Package_Explorer_Width, outerWidth.toString());
            });
        });
        setTimeout(function () {
            $('.content-split-pane').splitPane();
            $('.content-split-pane .split-pane-divider').on('mousedown', function () {
                var $this = $(this);
                $('body').one('mouseup', function () {
                    var outerWidth = $this.prev().outerWidth();
                    localStorage.setItem(constantHelpers.LSKey_Content_Split_LeftSide_Width, outerWidth.toString());
                });
            });
        }, 1250);
    };
    return MainController;
}());
exports.MainController = MainController;
