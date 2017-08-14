import { PackageHelpers } from '../helpers/PackageHelpers';
import { IPackageExplorer } from '../interfaces/IPackageExplorer';
import { NpmService } from '../services/NpmService';
import { IPackagest } from "../interfaces/IPackagest";
import { MessageDialogHelpers } from '../helpers/MessageDialogHelpers';
import { PackageExplorerHelpers } from '../helpers/PackageExplorerHelpers';
const fs = require('fs');
const remote = require('electron').remote;
const dialog = remote.dialog;
const shell = remote.shell;

export class PackageExplorerListDirective {
    restrict: string;
    templateUrl: string;
    transclude: boolean;
    scope: any;

    constructor() {
        this.restrict = 'E'
        this.templateUrl = './templates/package-explorer-list.html'
        this.transclude = true
        this.scope = {
            item: '=item'
        }
    }

    link(scope: any, element: any, attrs: any) {

        scope.selectPackageExplorerItem = (item: IPackageExplorer) => {
            scope.$root.activePackageExplorerItem = item;
        }

        scope.openFile = () => {
            const activeItem: IPackagest = scope.$root.activeActivityBarMenuItem;
            const packageManager: string = activeItem.packageManager;

            dialog.showOpenDialog({ filters: [{ name: packageManager, extensions: ['json'] }] }, (fileNames: string[]) => {
                if (fileNames === undefined) return;

                const file: string = fileNames[0];
                if (file.indexOf(activeItem.file) === -1) {
                    new MessageDialogHelpers().error(`Please select <b>${activeItem.file}</b> file!`, 5000);
                    return;
                }

                if (new PackageExplorerHelpers().isExist(file)) {
                    new MessageDialogHelpers().error('You already opened this file. Please choose on list below!', 6000);
                    return;
                }
                else {
                    new PackageExplorerHelpers().add(packageManager, file);
                    scope.$apply(() => {
                        scope.$root.packagePathList[packageManager] = new PackageExplorerHelpers().getListItem(packageManager);
                    });
                }
            });
        }

        scope.initFile = () => {
            $('#packageInitModal').modal('show');
        }

        scope.clearList = () => {
            const activeItem: IPackagest = scope.$root.activeActivityBarMenuItem;

            new MessageDialogHelpers().confirm(`Are you sure want to delete list on <b>${activeItem.packageManager}</b> package?`, () => {
                scope.$root.packageList = {};
                new PackageExplorerHelpers().removeAllList(activeItem.packageManager);
                scope.$apply(() => {
                    scope.$root.packagePathList[activeItem.packageManager] = new PackageExplorerHelpers().getListItem(activeItem.packageManager);
                });
            })
        }

        scope.revealInExplorer = (path: string) => {
            fs.access(path, (err: any) => {
                if (err) {
                    new MessageDialogHelpers().confirm('<b>The file does not exist!</b><br>Do you want to remove item from list?', () => {
                        const activeItem: IPackagest = scope.$root.activeActivityBarMenuItem;
                        new PackageExplorerHelpers().remove(path);
                        scope.$apply(() => {
                            scope.$root.packagePathList[activeItem.packageManager] = new PackageExplorerHelpers().getListItem(activeItem.packageManager);
                        });
                    });
                } else {
                    shell.showItemInFolder(path);
                }
            });
        }

        scope.removeFromList = (path: string) => {
            new MessageDialogHelpers().confirm('Are you sure want to remove from list?', () => {
                const activeItem: IPackagest = scope.$root.activeActivityBarMenuItem;
                new PackageExplorerHelpers().remove(path);
                scope.$apply(() => {
                    scope.$root.packagePathList[activeItem.packageManager] = new PackageExplorerHelpers().getListItem(activeItem.packageManager);

                    if (scope.$root.activePackageExplorerItem !== undefined && scope.$root.activePackageExplorerItem.path === path) {
                        scope.$root.hidePackageOverlay = false;
                        scope.$root.hidePackageDetailOverlay = false;
                        scope.$root.searchVal = '';
                    }
                });
            });
        }
    }
}