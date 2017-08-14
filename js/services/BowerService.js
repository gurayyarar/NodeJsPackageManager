"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var MessageDialogHelpers_1 = require("../helpers/MessageDialogHelpers");
var childProcess = require('child_process');
var bower = require('bower');
var fs = require('fs');
var BowerService = (function () {
    function BowerService() {
    }
    BowerService.prototype.getInstalledPackagesFromFile = function (filePath, callback) {
        filePath = filePath.replace('\\bower.json', '');
        bower.commands.list({}, { 'cwd': filePath, 'offline': true })
            .on('end', callback)
            .on('error', function (err) {
            new MessageDialogHelpers_1.MessageDialogHelpers().error(err.message, 7500, 'top');
            callback();
        });
    };
    BowerService.prototype.getPackageDetailInfo = function (packageName, callback) {
        bower.commands.info(packageName, undefined, {})
            .on('end', callback)
            .on('error', function (err) {
            new MessageDialogHelpers_1.MessageDialogHelpers().error(err.message, 7500, 'top');
            callback();
        });
    };
    BowerService.prototype.getPackageDetailByVersion = function (packageName, version, callback) {
        bower.commands.info(packageName + "#" + version, undefined, {})
            .on('log', function (log) {
            if (log.level === 'info') {
                var userReposStr = log.data.resolver.source.replace('https://github.com/', '').replace('.git', '');
                var readMeUrl_1 = "https://raw.githubusercontent.com/" + userReposStr + "/";
                if (log.data.pkgMeta !== undefined && log.data.pkgMeta._resolution !== undefined) {
                    $.ajax({
                        url: "" + readMeUrl_1 + log.data.pkgMeta._resolution.tag + "/README.md",
                        type: 'GET',
                        data: {},
                        complete: function (xhr, statusText) {
                            callback(log, xhr.status !== 404 ? xhr.responseText : undefined);
                        }
                    });
                }
                else {
                    $.ajax({
                        url: readMeUrl_1 + "v" + log.data.endpoint.target + "/README.md",
                        type: 'GET',
                        data: {},
                        complete: function (xhr, statusText) {
                            if (xhr.status === 404) {
                                $.ajax({
                                    url: "" + readMeUrl_1 + log.data.endpoint.target + "/README.md",
                                    type: 'GET',
                                    data: {},
                                    complete: function (subXhr, subStatusText) {
                                        callback(log, subXhr.status !== 404 ? subXhr.responseText : undefined);
                                    }
                                });
                            }
                            else {
                                callback(log, xhr.responseText);
                            }
                        }
                    });
                }
            }
        })
            .on('error', function (err) {
            new MessageDialogHelpers_1.MessageDialogHelpers().error(err.message, 7500, 'top');
            callback();
        });
    };
    BowerService.prototype.getLatestVersion = function (packageName, callback) {
        bower.commands.info(packageName, undefined, {})
            .on('end', function (result) {
            callback(result.latest.version);
        })
            .on('error', function (err) {
            new MessageDialogHelpers_1.MessageDialogHelpers().error(err.message, 7500, 'top');
            callback();
        });
    };
    BowerService.prototype.getSearchResult = function (query, callback) {
        bower.commands.search(query, {})
            .on('end', callback)
            .on('error', function (err) {
            new MessageDialogHelpers_1.MessageDialogHelpers().error(err.message, 7500, 'top');
            callback();
        });
    };
    BowerService.prototype.install = function (packages, callback) {
        var fileDir = packages.packagePath.replace('\\bower.json', '');
        bower.commands.install(packages.packages, { forceLatest: true, save: true }, { cwd: fileDir, force: true, newly: true })
            .on('end', callback)
            .on('error', function (err) {
            new MessageDialogHelpers_1.MessageDialogHelpers().error(err.message, 7500, 'top');
            callback();
        });
    };
    BowerService.prototype.uninstall = function (packages, callback) {
        var fileDir = packages.packagePath.replace('\\bower.json', '');
        bower.commands.uninstall(packages.packages, { forceLatest: true, save: true, saveDev: true }, { cwd: fileDir, force: true, newly: true })
            .on('end', callback)
            .on('error', function (err) {
            new MessageDialogHelpers_1.MessageDialogHelpers().error(err.message, 7500, 'top');
            callback();
        });
    };
    BowerService.prototype.update = function (packages, callback) {
        this.install(packages, callback);
    };
    BowerService.prototype.downgrade = function (packages, callback) {
        this.install(packages, callback);
    };
    return BowerService;
}());
exports.BowerService = BowerService;
