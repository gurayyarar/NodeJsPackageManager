import { IPackage } from '../interfaces/IPackage';
import { MessageDialogHelpers } from '../helpers/MessageDialogHelpers';
import { IPackageCommand } from '../interfaces/IPackageCommand';
import { IPackageExplorer } from '../interfaces/IPackageExplorer';
const childProcess = require('child_process');
const bower = require('bower');
const fs = require('fs');

export class BowerService {
    getInstalledPackagesFromFile(filePath: string, callback: any) {
        filePath = filePath.replace('\\bower.json', '');
        bower.commands.list({}, { 'cwd': filePath, 'offline': true })
            .on('end', callback)
            .on('error', (err: any) => {
                new MessageDialogHelpers().error(err.message, 7500, 'top');
                callback();
            });
    }

    getPackageDetailInfo(packageName: string, callback: any) {
        bower.commands.info(packageName, undefined, {})
            .on('end', callback)
            .on('error', (err: any) => {
                new MessageDialogHelpers().error(err.message, 7500, 'top');
                callback();
            });
    }

    getPackageDetailByVersion(packageName: string, version: string, callback: any) {
        bower.commands.info(`${packageName}#${version}`, undefined, {})
            .on('log', (log: any) => {
                if (log.level === 'info') {
                    const userReposStr: string = log.data.resolver.source.replace('https://github.com/', '').replace('.git', '');
                    let readMeUrl: string = `https://raw.githubusercontent.com/${userReposStr}/`;

                    if (log.data.pkgMeta !== undefined && log.data.pkgMeta._resolution !== undefined) {
                        $.ajax({
                            url: `${readMeUrl}${log.data.pkgMeta._resolution.tag}/README.md`,
                            type: 'GET',
                            data: {},
                            complete: function (xhr, statusText) {
                                callback(log, xhr.status !== 404 ? xhr.responseText : undefined);
                            }
                        });
                    } else {
                        $.ajax({
                            url: `${readMeUrl}v${log.data.endpoint.target}/README.md`,
                            type: 'GET',
                            data: {},
                            complete: (xhr: any, statusText: any) => {
                                if (xhr.status === 404) {
                                    $.ajax({
                                        url: `${readMeUrl}${log.data.endpoint.target}/README.md`,
                                        type: 'GET',
                                        data: {},
                                        complete: (subXhr: any, subStatusText: any) => {
                                            callback(log, subXhr.status !== 404 ? subXhr.responseText : undefined);
                                        }
                                    })
                                } else {
                                    callback(log, xhr.responseText);
                                }
                            }
                        });
                    }
                }
            })
            .on('error', (err: any) => {
                new MessageDialogHelpers().error(err.message, 7500, 'top');
                callback();
            });
    }

    getLatestVersion(packageName: string, callback: any) {
        bower.commands.info(packageName, undefined, {})
            .on('end', (result: any) => {
                callback(result.latest.version); 
            })
            .on('error', (err: any) => {
                new MessageDialogHelpers().error(err.message, 7500, 'top');
                callback();
            });
    }

    getSearchResult(query: string, callback: any) {
        bower.commands.search(query, {})
            .on('end', callback)
            .on('error', (err: any) => {
                new MessageDialogHelpers().error(err.message, 7500, 'top');
                callback();
            });
    }

    install(packages: IPackageCommand, callback: any) {
        const fileDir: string = packages.packagePath.replace('\\bower.json', '');

        bower.commands.install(packages.packages, { forceLatest: true, save: true }, { cwd: fileDir, force: true, newly: true })
            .on('end', callback)
            .on('error', (err: any) => {
                new MessageDialogHelpers().error(err.message, 7500, 'top');
                callback();
            });
    }

    uninstall(packages: IPackageCommand, callback: any) {
        const fileDir: string = packages.packagePath.replace('\\bower.json', '');
        bower.commands.uninstall(packages.packages, { forceLatest: true, save: true, saveDev: true }, { cwd: fileDir, force: true, newly: true })
            .on('end', callback)
            .on('error', (err: any) => {
                new MessageDialogHelpers().error(err.message, 7500, 'top');
                callback();
            });
    }

    update(packages: IPackageCommand, callback: any) {
        this.install(packages, callback);
    }

    downgrade(packages: IPackageCommand, callback: any) {
        this.install(packages, callback);
    }
}