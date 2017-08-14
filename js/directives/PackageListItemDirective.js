"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var PackageHelpers_1 = require("../helpers/PackageHelpers");
var PackageListItemDirective = (function () {
    function PackageListItemDirective() {
        this.restrict = 'E';
        this.templateUrl = './templates/package-list-item.html';
        this.transclude = true;
        this.scope = {
            item: '=item'
        };
    }
    PackageListItemDirective.prototype.link = function (scope, element, attrs) {
        var _this = this;
        var pack = scope.item;
        if (pack.alreadyInstalled === true) {
            new PackageHelpers_1.PackageHelpers(scope).setLatestVersion(pack.name, pack.version, function () {
                _this.organizeLoader(scope);
            });
        }
        else {
            pack.latestVersion = pack.selectedVersion = pack.version;
            scope.item = pack;
            this.organizeLoader(scope);
        }
        scope.$root.selectPackage = function ($event, item) {
            if ($($event.target).hasClass('btn') === false && $($event.target).parents('.btn-group').length === 0) {
                scope.$root.activePackageItem = item;
            }
        };
    };
    PackageListItemDirective.prototype.organizeLoader = function (scope) {
        var length = scope.$root.loadedPackageLength;
        length--;
        scope.$root.loadedPackageLength = length;
        if (length === 0)
            scope.$root.showLoader = false;
    };
    return PackageListItemDirective;
}());
exports.PackageListItemDirective = PackageListItemDirective;
