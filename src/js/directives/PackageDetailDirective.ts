import { PackageHelpers } from '../helpers/PackageHelpers';
import { WindowHelpers } from '../helpers/WindowHelpers';
import { IPackage } from '../interfaces/IPackage';
import { IPackageDetail } from '../interfaces/IPackageDetail';
const compareVersions = require('compare-versions');

export class PackageDetail {
    restrict: string;
    templateUrl: string;

    constructor() {
        this.restrict = 'E'
        this.templateUrl = './templates/package-detail.html'
    }

    link(scope: any, element: any, attrs: any) {
        scope.$root.$watch('activePackageItem', (newVal: any, oldVal: any) => {
            if (newVal !== undefined) {
                scope.$root.showLoader = true;
                const packageName: string = newVal.name;

                new PackageHelpers(scope).getPackageDetailInfo(packageName, (result: any) => {
                    scope.$apply(() => {
                        const latestVersion: string = scope.$root.packages[packageName].latestVersion;

                        if (latestVersion !== undefined && latestVersion !== null && latestVersion !== '') {
                            scope.$root.packages[packageName].selectedVersion = latestVersion;
                        } else {
                            scope.$root.packages[packageName].selectedVersion =
                                scope.$root.packages[packageName].latestVersion =
                                scope.$root.packages[packageName].version =
                                result.versions[0];
                        }
                        scope.packageInfo = result;
                        scope.packageInfo.version = scope.$root.packages[packageName].version;
                        scope.$root.hidePackageDetailOverlay = true;
                    });

                    setTimeout(() => {
                        scope.getDetailInfo(packageName, newVal.selectedVersion);
                    }, 500);
                })
            }
        });

        scope.$root.packageCommand = ($event: any, packageName: string) => {
            const $packageContainer = $(`[data-package="${packageName}"]`);
            const cmd: string = $($event.target).data('cmd');
            const $commandBtn = $packageContainer.find(`[data-cmd^="${cmd === 'installAsDev' ? 'install' : cmd}"]`);
            let $btn: any = null;
            if (cmd !== 'reload') {
                $btn = $commandBtn.button('loading');
            }

            var pack: IPackage = scope.$root.packages[packageName];
            new PackageHelpers(scope).runCommand(cmd, pack, () => {
                if ($btn !== null) $btn.button('reset');

                //Buttons
                pack.listItemControl.reload = true;
                pack.listItemControl.downgrade = false;
                pack.listItemControl.update = false;
                pack.listItemControl.loader = false;

                if (cmd === 'install' || cmd === 'installAsDev') {
                    pack.listItemControl.install = false;
                    pack.listItemControl.uninstall = true;

                    pack.detailControl.install = false;
                    pack.detailControl.uninstall = true;
                } else if (cmd === 'uninstall') {
                    pack.listItemControl.install = true;
                    pack.listItemControl.uninstall = false;

                    pack.detailControl.install = true;
                    pack.detailControl.uninstall = false;
                } else if (cmd === 'reload') {
                    scope.$root.reloadPackageList();
                }

                pack.detailControl.reload = true;
                pack.detailControl.downgrade = false;
                pack.detailControl.update = false;
                pack.detailControl.loader = false;

                $btn.button('reset');
                scope.$apply(() => { scope.$root.packages[packageName] = pack; });
            });
        }

        scope.onVersionChanged = function () {
            const activePackageItem: IPackage = scope.$root.activePackageItem;
            scope.$root.showLoader = true;

            if (activePackageItem.listItemControl.install === false) {
                const compareResult: number = compareVersions(activePackageItem.selectedVersion, activePackageItem.version);

                activePackageItem.detailControl.update = compareResult > 0;
                activePackageItem.detailControl.downgrade = compareResult < 0;
            }

            scope.$root.activePackageItem = activePackageItem;

            scope.getDetailInfo(activePackageItem.name, activePackageItem.selectedVersion);
            // new PackageHelpers(scope).getPackageDetailInfo(activePackageItem.name, activePackageItem.selectedVersion, (result: any) => {
            //     scope.$apply(() => {
            //         scope.packageInfo.author = result.author;
            //         scope.packageInfo.description = result.description;
            //         scope.packageInfo.license = typeof result.license === 'object' ? result.license.type : result.license;
            //         scope.packageInfo.contributors = result.contributors;
            //         scope.packageInfo.dependencies = result.dependencies;
            //         scope.packageInfo.devDependencies = result.devDependencies;
            //         scope.packageInfo.version = activePackageItem.selectedVersion;

            //         scope.$root.showLoader = false;
            //     });
            // });
        }

        scope.getDetailInfo = (packageName: string, version: string) => {
            new PackageHelpers(scope).getPackageDetailByVersion(packageName, version, (log: IPackageDetail, readMe: any) => {
                scope.$apply(() => {
                    const versions: string[] = scope.packageInfo.versions;
                    scope.packageInfo = log;
                    scope.packageInfo.versions = versions;
                    scope.packageInfo.readMe = readMe;
                    scope.$root.showLoader = false;
                });

                new WindowHelpers().setPackageDetailContentHeight();
                setTimeout(() => { $('#details a:not(.scroll-to-top)').attr('target', '_blank'); }, 1000);
            })
        }
    }
}