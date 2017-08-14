"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var PackageHelpers_1 = require("../helpers/PackageHelpers");
var WindowHelpers_1 = require("../helpers/WindowHelpers");
var compareVersions = require('compare-versions');
var PackageDetail = (function () {
    function PackageDetail() {
        this.restrict = 'E';
        this.templateUrl = './templates/package-detail.html';
    }
    PackageDetail.prototype.link = function (scope, element, attrs) {
        scope.$root.$watch('activePackageItem', function (newVal, oldVal) {
            if (newVal !== undefined) {
                scope.$root.showLoader = true;
                var packageName_1 = newVal.name;
                new PackageHelpers_1.PackageHelpers(scope).getPackageDetailInfo(packageName_1, function (result) {
                    scope.$apply(function () {
                        var latestVersion = scope.$root.packages[packageName_1].latestVersion;
                        if (latestVersion !== undefined && latestVersion !== null && latestVersion !== '') {
                            scope.$root.packages[packageName_1].selectedVersion = latestVersion;
                        }
                        else {
                            scope.$root.packages[packageName_1].selectedVersion =
                                scope.$root.packages[packageName_1].latestVersion =
                                    scope.$root.packages[packageName_1].version =
                                        result.versions[0];
                        }
                        scope.packageInfo = result;
                        scope.packageInfo.version = scope.$root.packages[packageName_1].version;
                        scope.$root.hidePackageDetailOverlay = true;
                    });
                    setTimeout(function () {
                        scope.getDetailInfo(packageName_1, newVal.selectedVersion);
                    }, 500);
                });
            }
        });
        scope.$root.packageCommand = function ($event, packageName) {
            var $packageContainer = $("[data-package=\"" + packageName + "\"]");
            var cmd = $($event.target).data('cmd');
            var $commandBtn = $packageContainer.find("[data-cmd^=\"" + (cmd === 'installAsDev' ? 'install' : cmd) + "\"]");
            var $btn = null;
            if (cmd !== 'reload') {
                $btn = $commandBtn.button('loading');
            }
            var pack = scope.$root.packages[packageName];
            new PackageHelpers_1.PackageHelpers(scope).runCommand(cmd, pack, function () {
                if ($btn !== null)
                    $btn.button('reset');
                pack.listItemControl.reload = true;
                pack.listItemControl.downgrade = false;
                pack.listItemControl.update = false;
                pack.listItemControl.loader = false;
                if (cmd === 'install' || cmd === 'installAsDev') {
                    pack.listItemControl.install = false;
                    pack.listItemControl.uninstall = true;
                    pack.detailControl.install = false;
                    pack.detailControl.uninstall = true;
                }
                else if (cmd === 'uninstall') {
                    pack.listItemControl.install = true;
                    pack.listItemControl.uninstall = false;
                    pack.detailControl.install = true;
                    pack.detailControl.uninstall = false;
                }
                else if (cmd === 'reload') {
                    scope.$root.reloadPackageList();
                }
                pack.detailControl.reload = true;
                pack.detailControl.downgrade = false;
                pack.detailControl.update = false;
                pack.detailControl.loader = false;
                $btn.button('reset');
                scope.$apply(function () { scope.$root.packages[packageName] = pack; });
            });
        };
        scope.onVersionChanged = function () {
            var activePackageItem = scope.$root.activePackageItem;
            scope.$root.showLoader = true;
            if (activePackageItem.listItemControl.install === false) {
                var compareResult = compareVersions(activePackageItem.selectedVersion, activePackageItem.version);
                activePackageItem.detailControl.update = compareResult > 0;
                activePackageItem.detailControl.downgrade = compareResult < 0;
            }
            scope.$root.activePackageItem = activePackageItem;
            scope.getDetailInfo(activePackageItem.name, activePackageItem.selectedVersion);
        };
        scope.getDetailInfo = function (packageName, version) {
            new PackageHelpers_1.PackageHelpers(scope).getPackageDetailByVersion(packageName, version, function (log, readMe) {
                scope.$apply(function () {
                    var versions = scope.packageInfo.versions;
                    scope.packageInfo = log;
                    scope.packageInfo.versions = versions;
                    scope.packageInfo.readMe = readMe;
                    scope.$root.showLoader = false;
                });
                new WindowHelpers_1.WindowHelpers().setPackageDetailContentHeight();
                setTimeout(function () { $('#details a:not(.scroll-to-top)').attr('target', '_blank'); }, 1000);
            });
        };
    };
    return PackageDetail;
}());
exports.PackageDetail = PackageDetail;
