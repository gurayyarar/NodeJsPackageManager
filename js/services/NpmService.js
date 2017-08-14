"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var MessageDialogHelpers_1 = require("../helpers/MessageDialogHelpers");
var childProcess = require('child_process');
var NpmService = (function () {
    function NpmService() {
    }
    NpmService.prototype.getGlobalPackages = function (callback) {
        childProcess.exec('npm ls -g --depth=0 --json', { maxBuffer: 1024 * 500 }, function (error, stdout, stderr) {
            var result = [];
            var response = JSON.parse(stdout).dependencies;
            $.each(response, function (key, value) {
                result.push({
                    name: key,
                    version: value.version
                });
            });
            setTimeout(callback(result), 250);
        });
    };
    NpmService.prototype.getInstalledPackagesFromFile = function (filePath, callback) {
        filePath = filePath.replace('\\package.json', '');
        childProcess.exec("npm ls --depth=0 --json", { cwd: filePath, maxBuffer: 1024 * 500 }, function (error, stdout, stderr) {
            callback(JSON.parse(stdout));
        });
    };
    NpmService.prototype.getPackageDetailInfo = function (packageName, callback) {
        childProcess.exec("npm info " + packageName + " --json", { maxBuffer: 1024 * 500 }, function (error, stdout, stderr) {
            callback(JSON.parse(stdout));
        });
    };
    NpmService.prototype.getPackageDetailInfoByVersion = function (packageName, version, callback) {
        childProcess.exec("npm info " + packageName + "@" + version + " --json", { maxBuffer: 1024 * 500 }, function (error, stdout, stderr) {
            var parsedData = JSON.parse(stdout);
            var userReposStr = parsedData.repository.url.replace('git+https://github.com/', '').replace('.git', '').replace('https://github.com/', '');
            var readMeUrl = "https://raw.githubusercontent.com/" + userReposStr + "/";
            $.ajax({
                url: readMeUrl + "v" + parsedData.version + "/README.md",
                type: 'GET',
                data: {},
                complete: function (xhr, statusText) {
                    if (xhr.status === 404) {
                        $.ajax({
                            url: "" + readMeUrl + parsedData.version + "/README.md",
                            type: 'GET',
                            data: {},
                            complete: function (subXhr, subStatusText) {
                                callback(parsedData, subXhr.status !== 404 ? subXhr.responseText : undefined);
                            }
                        });
                    }
                    else {
                        callback(parsedData, xhr.responseText);
                    }
                }
            });
        });
    };
    NpmService.prototype.getLatestVersion = function (packageName, callback) {
        childProcess.exec("npm view " + packageName + " version --json", function (error, stdout, stderr) {
            callback(JSON.parse(stdout));
        });
    };
    NpmService.prototype.getSearchResult = function (query, callback) {
        childProcess.exec("npm search " + query + " --no-description --json", function (error, stdout, stderr) {
            callback(JSON.parse(stdout));
        });
    };
    NpmService.prototype.install = function (packages, callback) {
        var installOptions = {
            maxBuffer: 1024 * 500
        };
        var command = "npm install " + packages.packages.join(' ');
        if (packages.isGlobal) {
            command += ' -g';
        }
        else {
            command += ' --save';
            if (packages.isDevDependency)
                command += '-dev';
            installOptions['cwd'] = packages.packagePath.replace('\\package.json', '');
        }
        command += ' --force --json';
        childProcess.exec(command, installOptions, function (err, stdout, stderr) {
            if (err) {
                new MessageDialogHelpers_1.MessageDialogHelpers().error(err.message, 7500, 'top');
                return;
            }
            callback();
        });
    };
    NpmService.prototype.uninstall = function (packages, callback) {
        var uninstallOptions = {
            maxBuffer: 1024 * 500
        };
        var command = "npm uninstall " + packages.packages.join(' ');
        if (packages.isGlobal) {
            command += ' -g';
        }
        else {
            command += ' --save';
            if (packages.isDevDependency)
                command += '-dev';
            uninstallOptions['cwd'] = packages.packagePath.replace('\\package.json', '');
        }
        command += ' --force --json';
        childProcess.exec(command, uninstallOptions, function (err, stdout, stderr) {
            if (err) {
                new MessageDialogHelpers_1.MessageDialogHelpers().error(err.message, 7500, 'top');
                callback();
            }
            callback();
        });
    };
    NpmService.prototype.update = function (packages, callback) {
        this.install(packages, callback);
    };
    NpmService.prototype.downgrade = function (packages, callback) {
        this.install(packages, callback);
    };
    return NpmService;
}());
exports.NpmService = NpmService;
