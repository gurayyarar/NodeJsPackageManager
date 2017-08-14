"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var MessageDialogHelpers_1 = require("../helpers/MessageDialogHelpers");
var PackageInitFileHelpers_1 = require("../helpers/PackageInitFileHelpers");
var PackageExplorerHelpers_1 = require("../helpers/PackageExplorerHelpers");
var fs = require('fs');
var remote = require('electron').remote;
var dialog = remote.dialog;
var PackageInitDirective = (function () {
    function PackageInitDirective() {
        this.restrict = 'E';
        this.templateUrl = './templates/packages-init.html';
        this.transclude = true;
    }
    PackageInitDirective.prototype.link = function (scope, element, attrs) {
        scope.$root.$watch('activeActivityBarMenuItem', function (newVal, oldVal) {
            if (newVal !== undefined) {
                var packageManager_1 = newVal.packageManager;
                var packageFileName_1 = newVal.file;
                scope.form = {};
                scope.form[packageManager_1] = {
                    private: 'false',
                    name: '',
                    version: '',
                    description: ''
                };
                scope.scriptCommandInputs = [{
                        script_key: '',
                        script_value: ''
                    }];
                scope.addNewScriptCommandInputs = function () {
                    scope.scriptCommandInputs.push({
                        script_key: '',
                        script_value: ''
                    });
                };
                scope.removeScriptCommandInputs = function (i) {
                    scope.scriptCommandInputs.splice(i, 1);
                };
                scope.initPackageFile = function () {
                    dialog.showSaveDialog({
                        title: 'Please choose a destination',
                        defaultPath: "~/" + packageFileName_1
                    }, function (fileName) {
                        if (fileName === undefined) {
                            return;
                        }
                        else if (fileName !== undefined && fileName.indexOf(packageFileName_1) === -1) {
                            new MessageDialogHelpers_1.MessageDialogHelpers().error("Please give name of <b>" + packageFileName_1 + "</b> to file for saving!", 7500);
                            return;
                        }
                        fs.writeFile(fileName, new PackageInitFileHelpers_1.PackageInitFileHelpers(scope).getJsonContent(), function (err) {
                            if (err) {
                                new MessageDialogHelpers_1.MessageDialogHelpers().error("File couldn't save because of: " + err.message);
                                return;
                            }
                            $('#packageInitModal').modal('hide');
                            if (!new PackageExplorerHelpers_1.PackageExplorerHelpers().isExist(fileName)) {
                                new PackageExplorerHelpers_1.PackageExplorerHelpers().add(packageManager_1, fileName);
                                scope.$apply(function () {
                                    scope.$root.packagePathList[packageManager_1] = new PackageExplorerHelpers_1.PackageExplorerHelpers().getListItem(packageManager_1);
                                });
                            }
                            new MessageDialogHelpers_1.MessageDialogHelpers().success('The file created successfully!', 3200);
                        });
                    });
                };
            }
        });
    };
    return PackageInitDirective;
}());
exports.PackageInitDirective = PackageInitDirective;
