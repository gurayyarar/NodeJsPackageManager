import { PackageHelpers } from '../helpers/PackageHelpers';
import { IPackageExplorer } from '../interfaces/IPackageExplorer';
export class PackageDirective {
    restrict: string;
    templateUrl: string;
    transclude: boolean;

    constructor() {
        this.restrict = 'E'
        this.templateUrl = './templates/packages.html'
        this.transclude = true
    }

    link(scope: any, element: any, attrs: any) {
        scope.makeFilter = (command: string) => {
            scope.$root.searchVal = `${command} `;
            $('.js-package-search').focus();
        }

        scope.clearSearch = () => {
            scope.$root.searchVal = '';
            $('.js-package-search').focus();
        }

        scope.$root.getFilteredData = () => {
            let queryVal: string = scope.$root.searchVal;

            if (queryVal === '' || queryVal === null) {
                scope.$root.packageList = new PackageHelpers(scope).getAllInstalledPackages();
            }
            else if (queryVal.indexOf('@installed') > -1) {
                const query = queryVal.replace('@installed', '').trim();
                let installedPackages = new PackageHelpers(scope).getAllInstalledPackages();

                if (query !== '') {
                    installedPackages = $.grep(installedPackages, (key, i) => {
                        return key.name.indexOf(query) > -1;
                    });
                }

                scope.$root.packageList = installedPackages;
            }
            else if (queryVal.indexOf('@update') > -1) {
                const query = queryVal.replace('@update', '').trim();
                let installedPackages = new PackageHelpers(scope).getAllInstalledPackages();

                let updateAvailablePackages = $.grep(installedPackages, (key, i) => {
                    return scope.$root.packages[key.name].listItemControl.update === true;
                });

                if (query !== '') {
                    updateAvailablePackages = $.grep(updateAvailablePackages, (key, i) => {
                        return key.name.indexOf(query) > -1;
                    });
                }

                scope.$root.packageList = updateAvailablePackages;
            }
            else if (queryVal.indexOf('@devdependencies') > -1) {
                const query = queryVal.replace('@devdependencies', '').trim();
                let installedPackages = new PackageHelpers(scope).getAllInstalledPackages();

                let packs = $.grep(installedPackages, (key, i) => {
                    return scope.$root.packages[key.name].isDevDependencies === true;
                });

                if (query !== '') {
                    packs = $.grep(packs, (key, i) => {
                        return key.name.indexOf(query) > -1;
                    });
                }

                scope.$root.packageList = packs;
            }
            else if (queryVal.indexOf('@dependencies') > -1) {
                const query = queryVal.replace('@dependencies', '').trim();
                let installedPackages = new PackageHelpers(scope).getAllInstalledPackages();

                let packs = $.grep(installedPackages, (key, i) => {
                    return scope.$root.packages[key.name].isDevDependencies === false;
                });

                if (query !== '') {
                    packs = $.grep(packs, (key, i) => {
                        return key.name.indexOf(query) > -1;
                    });
                }

                scope.$root.packageList = packs;
            }
            else {
                scope.$root.showInputLoader = true;
                new PackageHelpers(scope).getSearchResult(queryVal, (result: any) => {
                    scope.$root.$apply(() => {
                        scope.$root.packageList = result;
                        scope.$root.showInputLoader = false;
                    });
                })
            }
        }

        scope.$root.$watch('searchVal', (newVal: string, oldVal: string) => {
            if (newVal !== undefined) scope.$root.getFilteredData();
        });

        scope.$root.reloadPackageList = () => {
            const activeItem: IPackageExplorer = <IPackageExplorer>scope.$root.activePackageExplorerItem;

            scope.$root.hidePackageDetailOverlay = false;
            scope.$root.packageList = {};
            scope.$root.showLoader = true;
            scope.$root.searchVal = '';
            new PackageHelpers(scope).resetPackages();
            new PackageHelpers(scope).getInstalledPackagesFromFile(activeItem.packageManager, activeItem.path, (result: any) => {
                scope.$root.$apply(() => {
                    scope.$root.hidePackageOverlay = true;

                    if (result.length === 0) {
                        scope.$root.showLoader = false;
                    } else {
                        scope.$root.loadedPackageLength = result.length;
                    }

                    scope.$root.packageList = result;
                });
            });
        }
    }
}