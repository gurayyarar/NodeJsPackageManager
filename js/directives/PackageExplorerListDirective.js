"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var MessageDialogHelpers_1 = require("../helpers/MessageDialogHelpers");
var PackageExplorerHelpers_1 = require("../helpers/PackageExplorerHelpers");
var fs = require('fs');
var remote = require('electron').remote;
var dialog = remote.dialog;
var shell = remote.shell;
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
        scope.selectPackageExplorerItem = function (item) {
            scope.$root.activePackageExplorerItem = item;
        };
        scope.openFile = function () {
            var activeItem = scope.$root.activeActivityBarMenuItem;
            var packageManager = activeItem.packageManager;
            dialog.showOpenDialog({ filters: [{ name: packageManager, extensions: ['json'] }] }, function (fileNames) {
                if (fileNames === undefined)
                    return;
                var file = fileNames[0];
                if (file.indexOf(activeItem.file) === -1) {
                    new MessageDialogHelpers_1.MessageDialogHelpers().error("Please select <b>" + activeItem.file + "</b> file!", 5000);
                    return;
                }
                if (new PackageExplorerHelpers_1.PackageExplorerHelpers().isExist(file)) {
                    new MessageDialogHelpers_1.MessageDialogHelpers().error('You already opened this file. Please choose on list below!', 6000);
                    return;
                }
                else {
                    new PackageExplorerHelpers_1.PackageExplorerHelpers().add(packageManager, file);
                    scope.$apply(function () {
                        scope.$root.packagePathList[packageManager] = new PackageExplorerHelpers_1.PackageExplorerHelpers().getListItem(packageManager);
                    });
                }
            });
        };
        scope.initFile = function () {
            $('#packageInitModal').modal('show');
        };
        scope.clearList = function () {
            var activeItem = scope.$root.activeActivityBarMenuItem;
            new MessageDialogHelpers_1.MessageDialogHelpers().confirm("Are you sure want to delete list on <b>" + activeItem.packageManager + "</b> package?", function () {
                scope.$root.packageList = {};
                new PackageExplorerHelpers_1.PackageExplorerHelpers().removeAllList(activeItem.packageManager);
                scope.$apply(function () {
                    scope.$root.packagePathList[activeItem.packageManager] = new PackageExplorerHelpers_1.PackageExplorerHelpers().getListItem(activeItem.packageManager);
                });
            });
        };
        scope.revealInExplorer = function (path) {
            fs.access(path, function (err) {
                if (err) {
                    new MessageDialogHelpers_1.MessageDialogHelpers().confirm('<b>The file does not exist!</b><br>Do you want to remove item from list?', function () {
                        var activeItem = scope.$root.activeActivityBarMenuItem;
                        new PackageExplorerHelpers_1.PackageExplorerHelpers().remove(path);
                        scope.$apply(function () {
                            scope.$root.packagePathList[activeItem.packageManager] = new PackageExplorerHelpers_1.PackageExplorerHelpers().getListItem(activeItem.packageManager);
                        });
                    });
                }
                else {
                    shell.showItemInFolder(path);
                }
            });
        };
        scope.removeFromList = function (path) {
            new MessageDialogHelpers_1.MessageDialogHelpers().confirm('Are you sure want to remove from list?', function () {
                var activeItem = scope.$root.activeActivityBarMenuItem;
                new PackageExplorerHelpers_1.PackageExplorerHelpers().remove(path);
                scope.$apply(function () {
                    scope.$root.packagePathList[activeItem.packageManager] = new PackageExplorerHelpers_1.PackageExplorerHelpers().getListItem(activeItem.packageManager);
                    if (scope.$root.activePackageExplorerItem !== undefined && scope.$root.activePackageExplorerItem.path === path) {
                        scope.$root.hidePackageOverlay = false;
                        scope.$root.hidePackageDetailOverlay = false;
                        scope.$root.searchVal = '';
                    }
                });
            });
        };
    };
    return PackageExplorerListDirective;
}());
exports.PackageExplorerListDirective = PackageExplorerListDirective;
