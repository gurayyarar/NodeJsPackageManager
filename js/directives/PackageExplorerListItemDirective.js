"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var constantHelpers = require("../helpers/ConstantHelpers");
var PackageExplorerListDirective = (function () {
    function PackageExplorerListDirective() {
        this.restrict = 'E';
        this.templateUrl = './templates/package-explorer-list.html';
        this.transclude = true;
        this.scope = {
            item: '=item'
        };
    }
    PackageExplorerListDirective.prototype.link = function (scope, element, attrs) {
        this.loadList(scope);
        scope.selectPackageExplorerItem = function (item) {
            scope.$root.activePackageExplorerItem = item;
        };
    };
    PackageExplorerListDirective.prototype.loadList = function (scope) {
        var packageManager = scope.item.packageManager;
        var packages = localStorage.getItem(constantHelpers.LSKey_Package_Explorer_Packages);
        var result = [];
        if (packageManager === 'npm') {
            result.push({
                path: 'Global Packages',
                package_manager: 'npm'
            });
        }
        scope.packagePathList = result;
    };
    return PackageExplorerListDirective;
}());
exports.PackageExplorerListDirective = PackageExplorerListDirective;
