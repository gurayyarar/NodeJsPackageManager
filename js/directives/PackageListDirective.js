"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var MessageDialogHelpers_1 = require("../helpers/MessageDialogHelpers");
var PackageExplorerHelpers_1 = require("../helpers/PackageExplorerHelpers");
var fs = require('fs');
var remote = require('electron').remote;
var shell = remote.shell;
var PackageListDirective = (function () {
    function PackageListDirective() {
        this.restrict = 'E';
        this.templateUrl = './templates/package-list.html';
        this.transclude = true;
    }
    PackageListDirective.prototype.link = function (scope, element, attrs) {
        scope.$root.$watch('activePackageExplorerItem', function (newVal, oldVal) {
            if (newVal !== undefined) {
                scope.$root.showLoader = true;
                if (newVal.path !== undefined && newVal.path !== null) {
                    fs.access(newVal.path, function (err) {
                        if (err) {
                            new MessageDialogHelpers_1.MessageDialogHelpers().confirm('<b>The file does not exist!</b><br>Do you want to remove item from list?', function () {
                                var activeItem = scope.$root.activeActivityBarMenuItem;
                                new PackageExplorerHelpers_1.PackageExplorerHelpers().remove(newVal.path);
                                scope.$apply(function () {
                                    scope.$root.packagePathList[activeItem.packageManager] = new PackageExplorerHelpers_1.PackageExplorerHelpers().getListItem(activeItem.packageManager);
                                    scope.$root.showLoader = false;
                                });
                            });
                        }
                        else {
                            scope.$root.hidePackageOverlay = false;
                            scope.$root.hidePackageDetailOverlay = false;
                            scope.$root.searchVal = '';
                            scope.$root.reloadPackageList();
                            if (!scope.$$phase)
                                scope.$apply();
                        }
                    });
                }
                else {
                    scope.$root.hidePackageOverlay = false;
                    scope.$root.hidePackageDetailOverlay = false;
                    scope.$root.searchVal = '';
                    scope.$root.reloadPackageList();
                    if (!scope.$$phase)
                        scope.$apply();
                }
            }
            ;
        });
    };
    return PackageListDirective;
}());
exports.PackageListDirective = PackageListDirective;
