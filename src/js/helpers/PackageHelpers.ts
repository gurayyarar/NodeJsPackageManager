import { IPackage } from '../interfaces/IPackage';
import { IPackageExplorer } from '../interfaces/IPackageExplorer';
import { NpmService } from '../services/NpmService';
import { IPackageDetail } from '../interfaces/IPackageDetail';
import { BowerService } from '../services/BowerService';
import { IPackageCommand } from '../interfaces/IPackageCommand';
import { StatusHelpers } from './StatusHelpers';
const compareVersions = require('compare-versions');
const getPackageReadme = require('get-package-readme');
const mdToHtml = require('showdown');
const fs = require('fs');
const q = require('q');

let _command = '';
export class PackageHelpers {
    scope: any;

    constructor(scope: any) {
        this.scope = scope;
    }

    //Reset packages
    resetPackages() {
        this.scope.$root.packages = {}
    }

    //Install package
    install(packageNames: string[], isDevDependency: boolean = false, callback: any) {
        const activeItem: IPackageExplorer = <IPackageExplorer>this.scope.$root.activePackageExplorerItem;
        const path: string = this.scope.$root.activePackageExplorerItem.path;

        new StatusHelpers().setTextForPackageProcess(packageNames.join(', '), _command, 'start');

        if (activeItem.packageManager === 'npm') {
            const npmPacksWithVersion = (packageName: string) => {
                let deferred = q.defer();

                if (packageName !== undefined && packageName.indexOf('||') === -1) {
                    new NpmService().getLatestVersion(packageName, (result: any) => {
                        deferred.resolve(`${packageName}@${result}`);
                    });
                } else {
                    deferred.resolve(packageName.replace('||', '@'));
                }

                return deferred.promise;
            }

            q.all(packageNames.map(npmPacksWithVersion)).done((result: any) => {
                const packs: IPackageCommand = {
                    packages: result,
                    isDevDependency: isDevDependency,
                    packagePath: path,
                    isGlobal: path === null || path === undefined
                }

                new NpmService().install(packs, (result: any) => {
                    packs.packages.forEach((val: any, i: number) => {
                        const packName = val.substring(0, val.lastIndexOf('@'));
                        const packVersion = val.substring(val.lastIndexOf('@') + 1, val.length);

                        this.addToInstalledPackages(packName, packVersion, false, false);
                    });

                    new StatusHelpers().setTextForPackageProcess(packageNames.join(', '), _command, 'end');

                    setTimeout(callback(result), 250);
                });
            });
        }
        else if (activeItem.packageManager === 'bower') {
            const bowerPacksWithVersion = (packageName: string) => {
                let deferred = q.defer();

                if (packageName !== undefined && packageName.indexOf('||') === -1) {
                    new BowerService().getLatestVersion(packageName, (result: any) => {
                        deferred.resolve(`${packageName}#${result}`);
                    });
                } else {
                    deferred.resolve(packageName.replace('||', '#'));
                }

                return deferred.promise;
            }

            q.all(packageNames.map(bowerPacksWithVersion)).done((result: any) => {
                const packs: IPackageCommand = {
                    packages: result,
                    isDevDependency: false,
                    packagePath: path
                }

                new BowerService().install(packs, (result: any) => {
                    $.each(result, (key: string, val: any) => {
                        new StatusHelpers().setTextForPackageProcess(packageNames.join(', '), _command, 'end');
                        this.addToInstalledPackages(key, val.pkgMeta.version, false, false);
                    });

                    setTimeout(callback(result), 250);
                });
            });
        }
    }

    //Uninstall package
    uninstall(packageNames: string[], forUpgradeOrDowngrade: boolean = false, callback: any) {
        const activeItem: IPackageExplorer = <IPackageExplorer>this.scope.$root.activePackageExplorerItem;
        new StatusHelpers().setTextForPackageProcess(packageNames.join(', '), _command, 'start');

        const pack: IPackageCommand = {
            packages: packageNames.map((item) => {
                return item.indexOf('||') !== -1 ? item.split('||')[0] : item;
            }),
            packagePath: activeItem.path,
            isGlobal: activeItem.path === null || activeItem.path === undefined
        };

        if (activeItem.packageManager === 'npm') {
            new NpmService().uninstall(pack, (result: any) => {
                packageNames.forEach((val: any, i: number) => {
                    this.removeFromInstalledPackages(val, forUpgradeOrDowngrade);
                });

                new StatusHelpers().setTextForPackageProcess(packageNames.join(', '), _command, 'end');
                setTimeout(callback(result), 250);
            });
        }
        else if (activeItem.packageManager === 'bower') {
            new BowerService().uninstall(pack, (result: any) => {
                $.each(result, (key: string, val: any) => {
                    this.removeFromInstalledPackages(key, forUpgradeOrDowngrade);
                });

                new StatusHelpers().setTextForPackageProcess(packageNames.join(', '), _command, 'end');
                setTimeout(callback(result), 250);
            });
        }
    }

    //Update the package
    update(packageNames: string[], isDevDependency: boolean = false, callback: any) {
        this.uninstall(packageNames, true, () => {
            this.install(packageNames, isDevDependency, callback);
        });
    }

    //Downgrade package version
    downgrade(packageNames: string[], isDevDependency: boolean = false, callback: any) {
        this.uninstall(packageNames, true, () => {
            this.install(packageNames, isDevDependency, callback);
        });
    }

    //Add a package to list of installed package
    private addToInstalledPackages(packageName: string, version: string, fromInstalledPackage: boolean = false, isDevDependencies: boolean = false) {
        if (this.scope.$root.packages[packageName] === undefined) {
            let packInfo: IPackage = {
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
            }

            this.scope.$root.packages[packageName] = packInfo;
        } else {
            this.scope.$root.packages[packageName].alreadyInstalled = true;
            this.scope.$root.packages[packageName].version = version;
            this.scope.$root.packages[packageName].selectedVersion = version;
        }
    }

    //Remove package from list of installed
    removeFromInstalledPackages(packageName: string, forUpgradeOrDowngrade: boolean = false) {
        if (packageName.indexOf('||') !== -1) packageName = packageName.split('||')[0];
        let packInfo: IPackage = <IPackage>this.scope.$root.packages[packageName];

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
    }

    //Get all installed packages list without read a file
    getAllInstalledPackages(): IPackage[] {
        const allPackages: IPackage[] = <IPackage[]>this.scope.$root.packages;
        let installedPackages: IPackage[] = [];

        $.each(allPackages, (key, val) => {
            if (val.alreadyInstalled) installedPackages.push(val);
        });

        return _.sortBy(installedPackages, 'name');
    }

    setAllAsInstalled(packages: IPackage[]) {
        $.each(packages, (i, key) => {
            let packInfo: IPackage = <IPackage>this.scope.$root.packages[key.name];

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
            this.scope.$root.packages[key.name] = packInfo;
        });
    }

    //Get installed packages from package/bower.json file
    getInstalledPackagesFromFile(packageManager: string, filePath: string, callback: any): void {
        if (packageManager === 'npm') {
            if (filePath === null) { //Global packages
                new NpmService().getGlobalPackages((result: any) => {
                    $.each(result, (i, key) => {
                        this.addToInstalledPackages(key.name, key.version, true, false);
                    });

                    setTimeout(() => {
                        callback(this.getAllInstalledPackages());
                    }, 250);
                });
            } else {
                new NpmService().getInstalledPackagesFromFile(filePath, (result: any) => {
                    if (result !== undefined && result !== null) {
                        $.each(result.dependencies, (key: string, val: any) => {
                            this.addToInstalledPackages(key, val.version, true, false);
                        });
                    }

                    setTimeout(() => {
                        callback(this.getAllInstalledPackages());
                    }, 250);
                });
            }
        }
        else if (packageManager === 'bower') {
            new BowerService().getInstalledPackagesFromFile(filePath, (result: any) => {
                if (result !== undefined && result !== null) {
                    $.each(result.dependencies, (key: string, val: any) => {
                        this.addToInstalledPackages(key, val.pkgMeta.version, true, false);

                        //Depends on packages
                        $.each(val.dependencies, (subKey: string, subVal: any) => {
                            if (subVal.pkgMeta !== undefined) this.addToInstalledPackages(subKey, subVal.pkgMeta.version, true, false);
                        });
                    });
                }

                setTimeout(() => {
                    callback(this.getAllInstalledPackages());
                }, 250);
            });
        }
    }

    //Get&set a package latest version
    setLatestVersion(packageName: string, version: string, callback: any) {
        const pack: IPackageExplorer = <IPackageExplorer>this.scope.$root.activePackageExplorerItem;

        if (pack.packageManager === 'npm') {
            new NpmService().getLatestVersion(packageName, (result: string) => {
                let packInfo: IPackage = <IPackage>this.scope.$root.packages[packageName];

                if (packInfo !== undefined) {
                    packInfo.listItemControl.loader = false;
                    packInfo.listItemControl.update = packInfo.alreadyInstalled && compareVersions(result, version) > 0;
                    packInfo.latestVersion = result;
                    packInfo.selectedVersion = result;
                    packInfo.detailControl.loader = false;
                    packInfo.detailControl.update = packInfo.alreadyInstalled && compareVersions(result, version) > 0;

                    this.scope.$root.$apply(() => {
                        this.scope.$root.packages[packageName] = packInfo;
                        callback();
                    });
                }
            });
        } else if (pack.packageManager === 'bower') {
            new BowerService().getLatestVersion(packageName, (result: string) => {
                let packInfo: IPackage = <IPackage>this.scope.$root.packages[packageName];

                if (packInfo !== undefined) {
                    packInfo.listItemControl.loader = false;
                    packInfo.listItemControl.update = packInfo.alreadyInstalled && compareVersions(result, version) > 0;
                    packInfo.latestVersion = result;
                    packInfo.selectedVersion = result;
                    packInfo.detailControl.loader = false;
                    packInfo.detailControl.update = packInfo.alreadyInstalled && compareVersions(result, version) > 0;

                    this.scope.$root.$apply(() => {
                        this.scope.$root.packages[packageName] = packInfo;
                        callback();
                    });
                }
            });
        }
    }

    getSearchResult(query: string, callback: any) {
        const pack: IPackageExplorer = <IPackageExplorer>this.scope.$root.activePackageExplorerItem;
        let searchResults: IPackage[] = [];

        if (pack.packageManager === 'npm') {
            new NpmService().getSearchResult(query, (result: any) => {
                $.each(result, (i: number, val: any) => {
                    const shownBefore: boolean = this.scope.$root.packages[val.name] !== undefined;
                    let resultItem: IPackage;

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
                        }

                        this.scope.$root.packages[val.name] = resultItem;
                    } else {
                        resultItem = <IPackage>this.scope.$root.packages[val.name];
                    }

                    searchResults.push(resultItem);
                });
                callback(searchResults);
            });
        } else if (pack.packageManager === 'bower') {
            new BowerService().getSearchResult(query, (result: any) => {
                $.each(result, (i: number, val: any) => {
                    const shownBefore: boolean = this.scope.$root.packages[val.name] !== undefined;
                    let resultItem: IPackage;

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
                        }

                        this.scope.$root.packages[val.name] = resultItem;
                    } else {
                        resultItem = <IPackage>this.scope.$root.packages[val.name];
                    }

                    searchResults.push(resultItem);
                });
                callback(searchResults);
            });
        }
    }

    getPackageDetailInfo(packageName: string, callback: any) {
        const pack: IPackageExplorer = <IPackageExplorer>this.scope.$root.activePackageExplorerItem;

        if (pack.packageManager === 'npm') {
            new NpmService().getPackageDetailInfo(packageName, (result: any) => {
                const packDetail: IPackageDetail = {
                    name: result.name,
                    versions: result.versions.reverse()
                }

                callback(packDetail);
            })
        }
        else if (pack.packageManager === 'bower') {
            new BowerService().getPackageDetailInfo(packageName, (result: any) => {
                const packDetail: IPackageDetail = {
                    name: result.name,
                    versions: result.versions
                }

                callback(packDetail);
            });
        }
    }

    //Get readme content
    // getReadMeContent(packageName: string, version: string, callback: any) {
    //     const pack: IPackageExplorer = <IPackageExplorer>this.scope.$root.activePackageExplorerItem;

    //     // if (pack.packageManager === 'npm' || pack.packageManager === 'bower') {
    //     //     getPackageReadme(packageName, (err: any, readMe: any) => {
    //     //         if (err || readMe == undefined) {
    //     //             callback('__empty__');
    //     //         } else {
    //     //             callback(new mdToHtml.Converter().makeHtml(readMe));
    //     //         }
    //     //     });
    //     // }
    //     if (pack.packageManager === 'bower') {
    //         new BowerService().getReadMeContent(packageName, version, (result: any) => {
    //             if (result !== undefined) {
    //                 callback(new mdToHtml.Converter().makeHtml(result));
    //             } else {
    //                 callback('__empty__');
    //             }
    //         });
    //     }
    // }
    getPackageDetailByVersion(packageName: string, version: string, callback: any) {
        const pack: IPackageExplorer = <IPackageExplorer>this.scope.$root.activePackageExplorerItem;

        if (pack.packageManager === 'npm') {
            new NpmService().getPackageDetailInfoByVersion(packageName, version, (log: any, readMe: any) => {
                const packDetail: IPackageDetail = {
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
                } else {
                    callback(packDetail, '__empty__');
                }
            });
        } else if (pack.packageManager === 'bower') {
            new BowerService().getPackageDetailByVersion(packageName, version, (log: any, readMe: any) => {
                let packDetail: IPackageDetail = {
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
                } else {
                    callback(packDetail, '__empty__');
                }
            })
        }
    }

    runCommand(command: string, pack: IPackage, callback: any) {
        let packageName: string = pack.name;
        const version: string = pack.selectedVersion;
        const isDevDependencies: boolean = pack.isDevDependencies;
        _command = command;

        if (command === 'reload') this.scope.$root.reloadPackageList();

        if (command === 'install') {
            if (version !== undefined && version !== null && version !== '') packageName += `||${version}`;
            this.install([packageName], isDevDependencies, callback);
        } else if (command === 'uninstall') {
            this.uninstall([packageName], false, callback);
        } else if (command === 'installAsDev') {
            if (version !== undefined && version !== null && version !== '') packageName += `||${version}`;
            this.install([packageName], true, callback);
        } else if (command === 'update' || command === 'downgrade') {
            if (version !== undefined && version !== null && version !== '') packageName += `||${version}`;
            this.update([packageName], isDevDependencies, callback);
        }
    }
}