"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var PackageHelpers_1 = require("../helpers/PackageHelpers");
var PackageDirective = (function () {
    function PackageDirective() {
        this.restrict = 'E';
        this.templateUrl = './templates/packages.html';
        this.transclude = true;
    }
    PackageDirective.prototype.link = function (scope, element, attrs) {
        scope.makeFilter = function (command) {
            scope.$root.searchVal = command + " ";
            $('.js-package-search').focus();
        };
        scope.clearSearch = function () {
            scope.$root.searchVal = '';
            $('.js-package-search').focus();
        };
        scope.$root.getFilteredData = function () {
            var queryVal = scope.$root.searchVal;
            if (queryVal === '' || queryVal === null) {
                scope.$root.packageList = new PackageHelpers_1.PackageHelpers(scope).getAllInstalledPackages();
            }
            else if (queryVal.indexOf('@installed') > -1) {
                var query_1 = queryVal.replace('@installed', '').trim();
                var installedPackages = new PackageHelpers_1.PackageHelpers(scope).getAllInstalledPackages();
                if (query_1 !== '') {
                    installedPackages = $.grep(installedPackages, function (key, i) {
                        return key.name.indexOf(query_1) > -1;
                    });
                }
                scope.$root.packageList = installedPackages;
            }
            else if (queryVal.indexOf('@update') > -1) {
                var query_2 = queryVal.replace('@update', '').trim();
                var installedPackages = new PackageHelpers_1.PackageHelpers(scope).getAllInstalledPackages();
                var updateAvailablePackages = $.grep(installedPackages, function (key, i) {
                    return scope.$root.packages[key.name].listItemControl.update === true;
                });
                if (query_2 !== '') {
                    updateAvailablePackages = $.grep(updateAvailablePackages, function (key, i) {
                        return key.name.indexOf(query_2) > -1;
                    });
                }
                scope.$root.packageList = updateAvailablePackages;
            }
            else if (queryVal.indexOf('@devdependencies') > -1) {
                var query_3 = queryVal.replace('@devdependencies', '').trim();
                var installedPackages = new PackageHelpers_1.PackageHelpers(scope).getAllInstalledPackages();
                var packs = $.grep(installedPackages, function (key, i) {
                    return scope.$root.packages[key.name].isDevDependencies === true;
                });
                if (query_3 !== '') {
                    packs = $.grep(packs, function (key, i) {
                        return key.name.indexOf(query_3) > -1;
                    });
                }
                scope.$root.packageList = packs;
            }
            else if (queryVal.indexOf('@dependencies') > -1) {
                var query_4 = queryVal.replace('@dependencies', '').trim();
                var installedPackages = new PackageHelpers_1.PackageHelpers(scope).getAllInstalledPackages();
                var packs = $.grep(installedPackages, function (key, i) {
                    return scope.$root.packages[key.name].isDevDependencies === false;
                });
                if (query_4 !== '') {
                    packs = $.grep(packs, function (key, i) {
                        return key.name.indexOf(query_4) > -1;
                    });
                }
                scope.$root.packageList = packs;
            }
            else {
                scope.$root.showInputLoader = true;
                new PackageHelpers_1.PackageHelpers(scope).getSearchResult(queryVal, function (result) {
                    scope.$root.$apply(function () {
                        scope.$root.packageList = result;
                        scope.$root.showInputLoader = false;
                    });
                });
            }
        };
        scope.$root.$watch('searchVal', function (newVal, oldVal) {
            if (newVal !== undefined)
                scope.$root.getFilteredData();
        });
        scope.$root.reloadPackageList = function () {
            var activeItem = scope.$root.activePackageExplorerItem;
            scope.$root.hidePackageDetailOverlay = false;
            scope.$root.packageList = {};
            scope.$root.showLoader = true;
            scope.$root.searchVal = '';
            new PackageHelpers_1.PackageHelpers(scope).resetPackages();
            new PackageHelpers_1.PackageHelpers(scope).getInstalledPackagesFromFile(activeItem.packageManager, activeItem.path, function (result) {
                scope.$root.$apply(function () {
                    scope.$root.hidePackageOverlay = true;
                    if (result.length === 0) {
                        scope.$root.showLoader = false;
                    }
                    else {
                        scope.$root.loadedPackageLength = result.length;
                    }
                    scope.$root.packageList = result;
                });
            });
        };
    };
    return PackageDirective;
}());
exports.PackageDirective = PackageDirective;
