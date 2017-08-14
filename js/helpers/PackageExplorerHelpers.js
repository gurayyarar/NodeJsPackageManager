"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ConstantHelpers_1 = require("./ConstantHelpers");
var PackageExplorerHelpers = (function () {
    function PackageExplorerHelpers() {
    }
    PackageExplorerHelpers.prototype.getListItem = function (packageManager) {
        var packs = this.getAllItems();
        var result = $.grep(packs, function (key, i) {
            return key.packageManager === packageManager;
        });
        if (packageManager === 'npm') {
            result.push({
                caption: 'Global Packages',
                path: null,
                packageManager: packageManager,
                canDelete: false,
                isExistDevDependencies: false
            });
        }
        return result.reverse();
    };
    PackageExplorerHelpers.prototype.add = function (packageManager, path) {
        var packs = this.getAllItems();
        packs.push({
            caption: path,
            canDelete: true,
            packageManager: packageManager,
            path: path,
            isExistDevDependencies: $.grep(ConstantHelpers_1.PS_Packagest, function (val, i) {
                return val.packageManager === packageManager;
            })[0].isExistDevDependencies
        });
        localStorage.setItem(ConstantHelpers_1.LSKey_Package_Explorer_Packages, JSON.stringify(packs));
    };
    PackageExplorerHelpers.prototype.remove = function (path) {
        var packs = this.getAllItems();
        var result = $.grep(packs, function (key, i) {
            return key.path !== path;
        });
        localStorage.setItem(ConstantHelpers_1.LSKey_Package_Explorer_Packages, JSON.stringify(result));
    };
    PackageExplorerHelpers.prototype.removeAllList = function (packageManager) {
        var packs = this.getAllItems();
        var result = $.grep(packs, function (key, i) {
            return key.packageManager !== packageManager;
        });
        localStorage.setItem(ConstantHelpers_1.LSKey_Package_Explorer_Packages, JSON.stringify(result));
    };
    PackageExplorerHelpers.prototype.isExist = function (path) {
        var packs = this.getAllItems();
        return $.grep(packs, function (key, i) {
            return key.path === path;
        }).length > 0;
    };
    PackageExplorerHelpers.prototype.getAllItems = function () {
        var packs = localStorage.getItem(ConstantHelpers_1.LSKey_Package_Explorer_Packages);
        return packs === null ? [] : JSON.parse(packs);
    };
    return PackageExplorerHelpers;
}());
exports.PackageExplorerHelpers = PackageExplorerHelpers;
