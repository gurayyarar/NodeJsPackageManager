import { IPackage } from '../interfaces/IPackage';
import { IPackageCommand } from '../interfaces/IPackageCommand';
import { MessageDialogHelpers } from '../helpers/MessageDialogHelpers';
const childProcess = require('child_process');

export class NpmService {
    getGlobalPackages(callback: any) {
        childProcess.exec('npm ls -g --depth=0 --json', { maxBuffer: 1024 * 500 }, (error: any, stdout: any, stderr: any) => {
            let result: IPackage[] = [];
            let response: any = JSON.parse(stdout).dependencies;

            $.each(response, function (key, value) {
                result.push({
                    name: key,
                    version: value.version
                });
            });

            setTimeout(callback(result), 250);
        });
    }

    getInstalledPackagesFromFile(filePath: string, callback: any) {
        filePath = filePath.replace('\\package.json', '');
        childProcess.exec(`npm ls --depth=0 --json`, { cwd: filePath, maxBuffer: 1024 * 500 }, (error: any, stdout: any, stderr: any) => {
            callback(JSON.parse(stdout));
        });
    }

    getPackageDetailInfo(packageName: string, callback: any) {
        childProcess.exec(`npm info ${packageName} --json`, { maxBuffer: 1024 * 500 }, (error: any, stdout: any, stderr: any) => {
            callback(JSON.parse(stdout));
        });
    }

    getPackageDetailInfoByVersion(packageName: string, version: string, callback: any) {
        childProcess.exec(`npm info ${packageName}@${version} --json`, { maxBuffer: 1024 * 500 }, (error: any, stdout: any, stderr: any) => {
            const parsedData: any = JSON.parse(stdout);

            const userReposStr: string = parsedData.repository.url.replace('git+https://github.com/', '').replace('.git', '').replace('https://github.com/', '');
            let readMeUrl: string = `https://raw.githubusercontent.com/${userReposStr}/`;

            $.ajax({
                url: `${readMeUrl}v${parsedData.version}/README.md`,
                type: 'GET',
                data: {},
                complete: (xhr: any, statusText: any) => {
                    if (xhr.status === 404) {
                        $.ajax({
                            url: `${readMeUrl}${parsedData.version}/README.md`,
                            type: 'GET',
                            data: {},
                            complete: (subXhr: any, subStatusText: any) => {
                                callback(parsedData, subXhr.status !== 404 ? subXhr.responseText : undefined);
                            }
                        })
                    } else {
                        callback(parsedData, xhr.responseText);
                    }
                }
            });
        });
    }

    getLatestVersion(packageName: string, callback: any) {
        childProcess.exec(`npm view ${packageName} version --json`, (error: any, stdout: any, stderr: any) => {
            callback(JSON.parse(stdout));
        });
    }

    getSearchResult(query: string, callback: any) {
        childProcess.exec(`npm search ${query} --no-description --json`, (error: any, stdout: any, stderr: any) => {
            callback(JSON.parse(stdout));
        });
    }

    install(packages: IPackageCommand, callback: any) {
        let installOptions: any = {
            maxBuffer: 1024 * 500
        };

        let command: string = `npm install ${packages.packages.join(' ')}`;

        if (packages.isGlobal) {
            command += ' -g';
        } else {
            command += ' --save';
            if (packages.isDevDependency) command += '-dev';
            installOptions['cwd'] = packages.packagePath.replace('\\package.json', '');
        }

        command += ' --force --json';

        childProcess.exec(command, installOptions, (err: any, stdout: any, stderr: any) => {
            if (err) {
                new MessageDialogHelpers().error(err.message, 7500, 'top');
                return;
            }
            callback();
        });
    }

    uninstall(packages: IPackageCommand, callback: any) {
        let uninstallOptions: any = {
            maxBuffer: 1024 * 500
        };

        let command: string = `npm uninstall ${packages.packages.join(' ')}`;

        if (packages.isGlobal) {
            command += ' -g';
        } else {
            command += ' --save';
            if (packages.isDevDependency) command += '-dev';
            uninstallOptions['cwd'] = packages.packagePath.replace('\\package.json', '');
        }

        command += ' --force --json';

        childProcess.exec(command, uninstallOptions, (err: any, stdout: any, stderr: any) => {
            if (err) {
                new MessageDialogHelpers().error(err.message, 7500, 'top');
                callback();
            }
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