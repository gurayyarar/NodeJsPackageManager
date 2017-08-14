import { PackageHelpers } from '../helpers/PackageHelpers';
import { IPackageExplorer } from '../interfaces/IPackageExplorer';
import { MessageDialogHelpers } from '../helpers/MessageDialogHelpers';
import { IPackagest } from '../interfaces/IPackagest';
import { PackageExplorerHelpers } from '../helpers/PackageExplorerHelpers';
import { PackageInitFileHelpers } from '../helpers/PackageInitFileHelpers';
const fs = require('fs');
const remote = require('electron').remote;
const shell = remote.shell;

export class PackageListDirective {
    restrict: string;
    templateUrl: string;
    transclude: boolean;

    constructor() {
        this.restrict = 'E'
        this.templateUrl = './templates/package-list.html'
        this.transclude = true
    }

    link(scope: any, element: any, attrs: any) {
        scope.$root.$watch('activePackageExplorerItem', (newVal: any, oldVal: any) => {
            if (newVal !== undefined) {
                scope.$root.showLoader = true;

                if (newVal.path !== undefined && newVal.path !== null) {
                    fs.access(newVal.path, (err: any) => {
                        if (err) {
                            new MessageDialogHelpers().confirm('<b>The file does not exist!</b><br>Do you want to remove item from list?', () => {
                                const activeItem: IPackagest = scope.$root.activeActivityBarMenuItem;
                                new PackageExplorerHelpers().remove(newVal.path);
                                scope.$apply(() => {
                                    scope.$root.packagePathList[activeItem.packageManager] = new PackageExplorerHelpers().getListItem(activeItem.packageManager);
                                    scope.$root.showLoader = false;
                                });
                            });
                        } else {
                            scope.$root.hidePackageOverlay = false;
                            scope.$root.hidePackageDetailOverlay = false;
                            scope.$root.searchVal = '';
                            scope.$root.reloadPackageList();
                            if (!scope.$$phase) scope.$apply();
                        }
                    });
                } else {
                    scope.$root.hidePackageOverlay = false;
                    scope.$root.hidePackageDetailOverlay = false;
                    scope.$root.searchVal = '';
                    scope.$root.reloadPackageList();
                    if (!scope.$$phase) scope.$apply();
                }
            };
        });
    }
}