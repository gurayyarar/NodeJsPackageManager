"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var PackageExplorerHelpers_1 = require("../helpers/PackageExplorerHelpers");
var PackageExplorerDirective = (function () {
    function PackageExplorerDirective() {
        this.restrict = 'E';
        this.templateUrl = './templates/package-explorer.html';
        this.transclude = true;
    }
    PackageExplorerDirective.prototype.link = function (scope, element, attrs) {
        scope.$root.packagePathList = {};
        scope.$root.activityBarIcons.forEach(function (value, i) {
            scope.$root.packagePathList[value.packageManager] = new PackageExplorerHelpers_1.PackageExplorerHelpers().getListItem(value.packageManager);
        });
    };
    return PackageExplorerDirective;
}());
exports.PackageExplorerDirective = PackageExplorerDirective;
