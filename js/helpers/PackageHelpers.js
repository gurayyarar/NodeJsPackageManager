"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var NpmService_1 = require("../services/NpmService");
var BowerService_1 = require("../services/BowerService");
var StatusHelpers_1 = require("./StatusHelpers");
var compareVersions = require('compare-versions');
var getPackageReadme = require('get-package-readme');
var mdToHtml = require('showdown');
var fs = require('fs');
var q = require('q');
var _command = '';
var PackageHelpers = (function () {
    function PackageHelpers(scope) {
        this.scope = scope;
    }
    PackageHelpers.prototype.resetPackages = function () {
        this.scope.$root.packages = {};
    };
    PackageHelpers.prototype.install = function (packageNames, isDevDependency, callback) {
        var _this = this;
        if (isDevDependency === void 0) { isDevDependency = false; }
        var activeItem = this.scope.$root.activePackageExplorerItem;
        var path = this.scope.$root.activePackageExplorerItem.path;
        new StatusHelpers_1.StatusHelpers().setTextForPackageProcess(packageNames.join(', '), _command, 'start');
        if (activeItem.packageManager === 'npm') {
            var npmPacksWithVersion = function (packageName) {
                var deferred = q.defer();
                if (packageName !== undefined && packageName.indexOf('||') === -1) {
                    new NpmService_1.NpmService().getLatestVersion(packageName, function (result) {
                        deferred.resolve(packageName + "@" + result);
                    });
                }
                else {
                    deferred.resolve(packageName.replace('||', '@'));
                }
                return deferred.promise;
            };
            q.all(packageNames.map(npmPacksWithVersion)).done(function (result) {
                var packs = {
                    packages: result,
                    isDevDependency: isDevDependency,
                    packagePath: path,
                    isGlobal: path === null || path === undefined
                };
                new NpmService_1.NpmService().install(packs, function (result) {
                    packs.packages.forEach(function (val, i) {
                        var packName = val.substring(0, val.lastIndexOf('@'));
                        var packVersion = val.substring(val.lastIndexOf('@') + 1, val.length);
                        _this.addToInstalledPackages(packName, packVersion, false, false);
                    });
                    new StatusHelpers_1.StatusHelpers().setTextForPackageProcess(packageNames.join(', '), _command, 'end');
                    setTimeout(callback(result), 250);
                });
            });
        }
        else if (activeItem.packageManager === 'bower') {
            var bowerPacksWithVersion = function (packageName) {
                var deferred = q.defer();
                if (packageName !== undefined && packageName.indexOf('||') === -1) {
                    new BowerService_1.BowerService().getLatestVersion(packageName, function (result) {
                        deferred.resolve(packageName + "#" + result);
                    });
                }
                else {
                    deferred.resolve(packageName.replace('||', '#'));
                }
                return deferred.promise;
            };
            q.all(packageNames.map(bowerPacksWithVersion)).done(function (result) {
                var packs = {
                    packages: result,
                    isDevDependency: false,
                    packagePath: path
                };
                new BowerService_1.BowerService().install(packs, function (result) {
                    $.each(result, function (key, val) {
                        new StatusHelpers_1.StatusHelpers().setTextForPackageProcess(packageNames.join(', '), _command, 'end');
                        _this.addToInstalledPackages(key, val.pkgMeta.version, false, false);
                    });
                    setTimeout(callback(result), 250);
                });
            });
        }
    };
    PackageHelpers.prototype.uninstall = function (packageNames, forUpgradeOrDowngrade, callback) {
        var _this = this;
        if (forUpgradeOrDowngrade === void 0) { forUpgradeOrDowngrade = false; }
        var activeItem = this.scope.$root.activePackageExplorerItem;
        new StatusHelpers_1.StatusHelpers().setTextForPackageProcess(packageNames.join(', '), _command, 'start');
        var pack = {
            packages: packageNames.map(function (item) {
                return item.indexOf('||') !== -1 ? item.split('||')[0] : item;
            }),
            packagePath: activeItem.path,
            isGlobal: activeItem.path === null || activeItem.path === undefined
        };
        if (activeItem.packageManager === 'npm') {
            new NpmService_1.NpmService().uninstall(pack, function (result) {
                packageNames.forEach(function (val, i) {
                    _this.removeFromInstalledPackages(val, forUpgradeOrDowngrade);
                });
                new StatusHelpers_1.StatusHelpers().setTextForPackageProcess(packageNames.join(', '), _command, 'end');
                setTimeout(callback(result), 250);
            });
        }
        else if (activeItem.packageManager === 'bower') {
            new BowerService_1.BowerService().uninstall(pack, function (result) {
                $.each(result, function (key, val) {
                    _this.removeFromInstalledPackages(key, forUpgradeOrDowngrade);
                });
                new StatusHelpers_1.StatusHelpers().setTextForPackageProcess(packageNames.join(', '), _command, 'end');
                setTimeout(callback(result), 250);
            });
        }
    };
    PackageHelpers.prototype.update = function (packageNames, isDevDependency, callback) {
        var _this = this;
        if (isDevDependency === void 0) { isDevDependency = false; }
        this.uninstall(packageNames, true, function () {
            _this.install(packageNames, isDevDependency, callback);
        });
    };
    PackageHelpers.prototype.downgrade = function (packageNames, isDevDependency, callback) {
        var _this = this;
        if (isDevDependency === void 0) { isDevDependency = false; }
        this.uninstall(packageNames, true, function () {
            _this.install(packageNames, isDevDependency, callback);
        });
    };
    PackageHelpers.prototype.addToInstalledPackages = function (packageName, version, fromInstalledPackage, isDevDependencies) {
        if (fromInstalledPackage === void 0) { fromInstalledPackage = false; }
        if (isDevDependencies === void 0) { isDevDependencies = false; }
        if (this.scope.$root.packages[packageName] === undefined) {
            var packInfo = {
                alreadyInstalled: true,
                name: packageName,
                version: version,
                selectedVersion: version,
                isDevDependencies: isDevDependencies,
                listItemControl: {
                    downgrade: false,
                    install: false,
                    loader: fromInstalledPackage ? true : false,
                    reload: fromInstalledPackage ? false : true,
                    uninstall: true,
                    update: false,
                },
                detailControl: {
                    downgrade: false,
                    install: false,
                    loader: fromInstalledPackage ? true : false,
                    reload: fromInstalledPackage ? false : true,
                    uninstall: true,
                    update: false
                }
            };
            this.scope.$root.packages[packageName] = packInfo;
        }
        else {
            this.scope.$root.packages[packageName].alreadyInstalled = true;
            this.scope.$root.packages[packageName].version = version;
            this.scope.$root.packages[packageName].selectedVersion = version;
        }
    };
    PackageHelpers.prototype.removeFromInstalledPackages = function (packageName, forUpgradeOrDowngrade) {
        if (forUpgradeOrDowngrade === void 0) { forUpgradeOrDowngrade = false; }
        if (packageName.indexOf('||') !== -1)
            packageName = packageName.split('||')[0];
        var packInfo = this.scope.$root.packages[packageName];
        packInfo.alreadyInstalled = false;
        packInfo.listItemControl.downgrade = false;
        packInfo.listItemControl.loader = false;
        packInfo.listItemControl.reload = true;
        packInfo.listItemControl.update = false;
        packInfo.detailControl.downgrade = false;
        packInfo.detailControl.loader = false;
        packInfo.detailControl.reload = true;
        packInfo.detailControl.update = false;
        if (!forUpgradeOrDowngrade) {
            packInfo.listItemControl.install = true;
            packInfo.listItemControl.uninstall = false;
            packInfo.detailControl.install = true;
            packInfo.detailControl.uninstall = false;
        }
        this.scope.$root.packages[packageName] = packInfo;
    };
    PackageHelpers.prototype.getAllInstalledPackages = function () {
        var allPackages = this.scope.$root.packages;
        var installedPackages = [];
        $.each(allPackages, function (key, val) {
            if (val.alreadyInstalled)
                installedPackages.push(val);
        });
        return _.sortBy(installedPackages, 'name');
    };
    PackageHelpers.prototype.setAllAsInstalled = function (packages) {
        var _this = this;
        $.each(packages, function (i, key) {
            var packInfo = _this.scope.$root.packages[key.name];
            packInfo.alreadyInstalled = true;
            packInfo.listItemControl.downgrade = false;
            packInfo.listItemControl.install = false;
            packInfo.listItemControl.loader = true;
            packInfo.listItemControl.reload = false;
            packInfo.listItemControl.uninstall = true;
            packInfo.listItemControl.update = false;
            packInfo.detailControl.downgrade = false;
            packInfo.detailControl.install = false;
            packInfo.detailControl.loader = false;
            packInfo.detailControl.reload = false;
            packInfo.detailControl.uninstall = false;
            packInfo.detailControl.update = false;
            _this.scope.$root.packages[key.name] = packInfo;
        });
    };
    PackageHelpers.prototype.getInstalledPackagesFromFile = function (packageManager, filePath, callback) {
        var _this = this;
        if (packageManager === 'npm') {
            if (filePath === null) {
                new NpmService_1.NpmService().getGlobalPackages(function (result) {
                    $.each(result, function (i, key) {
                        _this.addToInstalledPackages(key.name, key.version, true, false);
                    });
                    setTimeout(function () {
                        callback(_this.getAllInstalledPackages());
                    }, 250);
                });
            }
            else {
                new NpmService_1.NpmService().getInstalledPackagesFromFile(filePath, function (result) {
                    if (result !== undefined && result !== null) {
                        $.each(result.dependencies, function (key, val) {
                            _this.addToInstalledPackages(key, val.version, true, false);
                        });
                    }
                    setTimeout(function () {
                        callback(_this.getAllInstalledPackages());
                    }, 250);
                });
            }
        }
        else if (packageManager === 'bower') {
            new BowerService_1.BowerService().getInstalledPackagesFromFile(filePath, function (result) {
                if (result !== undefined && result !== null) {
                    $.each(result.dependencies, function (key, val) {
                        _this.addToInstalledPackages(key, val.pkgMeta.version, true, false);
                        $.each(val.dependencies, function (subKey, subVal) {
                            if (subVal.pkgMeta !== undefined)
                                _this.addToInstalledPackages(subKey, subVal.pkgMeta.version, true, false);
                        });
                    });
                }
                setTimeout(function () {
                    callback(_this.getAllInstalledPackages());
                }, 250);
            });
        }
    };
    PackageHelpers.prototype.setLatestVersion = function (packageName, version, callback) {
        var _this = this;
        var pack = this.scope.$root.activePackageExplorerItem;
        if (pack.packageManager === 'npm') {
            new NpmService_1.NpmService().getLatestVersion(packageName, function (result) {
                var packInfo = _this.scope.$root.packages[packageName];
                if (packInfo !== undefined) {
                    packInfo.listItemControl.loader = false;
                    packInfo.listItemControl.update = packInfo.alreadyInstalled && compareVersions(result, version) > 0;
                    packInfo.latestVersion = result;
                    packInfo.selectedVersion = result;
                    packInfo.detailControl.loader = false;
                    packInfo.detailControl.update = packInfo.alreadyInstalled && compareVersions(result, version) > 0;
                    _this.scope.$root.$apply(function () {
                        _this.scope.$root.packages[packageName] = packInfo;
                        callback();
                    });
                }
            });
        }
        else if (pack.packageManager === 'bower') {
            new BowerService_1.BowerService().getLatestVersion(packageName, function (result) {
                var packInfo = _this.scope.$root.packages[packageName];
                if (packInfo !== undefined) {
                    packInfo.listItemControl.loader = false;
                    packInfo.listItemControl.update = packInfo.alreadyInstalled && compareVersions(result, version) > 0;
                    packInfo.latestVersion = result;
                    packInfo.selectedVersion = result;
                    packInfo.detailControl.loader = false;
                    packInfo.detailControl.update = packInfo.alreadyInstalled && compareVersions(result, version) > 0;
                    _this.scope.$root.$apply(function () {
                        _this.scope.$root.packages[packageName] = packInfo;
                        callback();
                    });
                }
            });
        }
    };
    PackageHelpers.prototype.getSearchResult = function (query, callback) {
        var _this = this;
        var pack = this.scope.$root.activePackageExplorerItem;
        var searchResults = [];
        if (pack.packageManager === 'npm') {
            new NpmService_1.NpmService().getSearchResult(query, function (result) {
                $.each(result, function (i, val) {
                    var shownBefore = _this.scope.$root.packages[val.name] !== undefined;
                    var resultItem;
                    if (!shownBefore) {
                        resultItem = {
                            alreadyInstalled: false,
                            name: val.name,
                            version: val.version,
                            selectedVersion: val.version,
                            listItemControl: {
                                downgrade: false,
                                install: true,
                                loader: false,
                                reload: false,
                                uninstall: false,
                                update: false,
                            },
                            detailControl: {
                                downgrade: false,
                                install: true,
                                loader: false,
                                reload: false,
                                uninstall: false,
                                update: false
                            }
                        };
                        _this.scope.$root.packages[val.name] = resultItem;
                    }
                    else {
                        resultItem = _this.scope.$root.packages[val.name];
                    }
                    searchResults.push(resultItem);
                });
                callback(searchResults);
            });
        }
        else if (pack.packageManager === 'bower') {
            new BowerService_1.BowerService().getSearchResult(query, function (result) {
                $.each(result, function (i, val) {
                    var shownBefore = _this.scope.$root.packages[val.name] !== undefined;
                    var resultItem;
                    if (!shownBefore) {
                        resultItem = {
                            alreadyInstalled: false,
                            name: val.name,
                            version: null,
                            selectedVersion: null,
                            listItemControl: {
                                downgrade: false,
                                install: true,
                                loader: false,
                                reload: false,
                                uninstall: false,
                                update: false,
                            },
                            detailControl: {
                                downgrade: false,
                                install: true,
                                loader: false,
                                reload: false,
                                uninstall: false,
                                update: false
                            }
                        };
                        _this.scope.$root.packages[val.name] = resultItem;
                    }
                    else {
                        resultItem = _this.scope.$root.packages[val.name];
                    }
                    searchResults.push(resultItem);
                });
                callback(searchResults);
            });
        }
    };
    PackageHelpers.prototype.getPackageDetailInfo = function (packageName, callback) {
        var pack = this.scope.$root.activePackageExplorerItem;
        if (pack.packageManager === 'npm') {
            new NpmService_1.NpmService().getPackageDetailInfo(packageName, function (result) {
                var packDetail = {
                    name: result.name,
                    versions: result.versions.reverse()
                };
                callback(packDetail);
            });
        }
        else if (pack.packageManager === 'bower') {
            new BowerService_1.BowerService().getPackageDetailInfo(packageName, function (result) {
                var packDetail = {
                    name: result.name,
                    versions: result.versions
                };
                callback(packDetail);
            });
        }
    };
    PackageHelpers.prototype.getPackageDetailByVersion = function (packageName, version, callback) {
        var pack = this.scope.$root.activePackageExplorerItem;
        if (pack.packageManager === 'npm') {
            new NpmService_1.NpmService().getPackageDetailInfoByVersion(packageName, version, function (log, readMe) {
                var packDetail = {
                    name: packageName,
                    version: version,
                    author: log.author,
                    contributors: log.contributors,
                    dependencies: log.dependencies,
                    devDependencies: log.devDependencies,
                    description: log.description,
                    license: log.license
                };
                if (readMe !== undefined) {
                    callback(packDetail, new mdToHtml.Converter().makeHtml(readMe));
                }
                else {
                    callback(packDetail, '__empty__');
                }
            });
        }
        else if (pack.packageManager === 'bower') {
            new BowerService_1.BowerService().getPackageDetailByVersion(packageName, version, function (log, readMe) {
                var packDetail = {
                    name: packageName,
                    version: version
                };
                if (log.data.pkgMeta !== undefined && log.data.pkgMeta !== null) {
                    packDetail.author = log.data.pkgMeta.author;
                    packDetail.contributors = log.data.pkgMeta.contributors;
                    packDetail.dependencies = log.data.pkgMeta.dependencies;
                    packDetail.devDependencies = log.data.pkgMeta.devDependencies;
                    packDetail.description = log.data.pkgMeta.description;
                    packDetail.license = typeof log.data.pkgMeta.license === 'object' ? log.data.pkgMeta.license.type : log.data.pkgMeta.license;
                    packDetail.author = log.data.pkgMeta.author;
                }
                if (readMe !== undefined) {
                    callback(packDetail, new mdToHtml.Converter().makeHtml(readMe));
                }
                else {
                    callback(packDetail, '__empty__');
                }
            });
        }
    };
    PackageHelpers.prototype.runCommand = function (command, pack, callback) {
        var packageName = pack.name;
        var version = pack.selectedVersion;
        var isDevDependencies = pack.isDevDependencies;
        _command = command;
        if (command === 'reload')
            this.scope.$root.reloadPackageList();
        if (command === 'install') {
            if (version !== undefined && version !== null && version !== '')
                packageName += "||" + version;
            this.install([packageName], isDevDependencies, callback);
        }
        else if (command === 'uninstall') {
            this.uninstall([packageName], false, callback);
        }
        else if (command === 'installAsDev') {
            if (version !== undefined && version !== null && version !== '')
                packageName += "||" + version;
            this.install([packageName], true, callback);
        }
        else if (command === 'update' || command === 'downgrade') {
            if (version !== undefined && version !== null && version !== '')
                packageName += "||" + version;
            this.update([packageName], isDevDependencies, callback);
        }
    };
    return PackageHelpers;
}());
exports.PackageHelpers = PackageHelpers;
