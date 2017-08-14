import { MessageDialogHelpers } from '../helpers/MessageDialogHelpers';
import { PackageInitFileHelpers } from '../helpers/PackageInitFileHelpers';
import { PackageExplorerHelpers } from '../helpers/PackageExplorerHelpers';
const fs = require('fs');
const remote = require('electron').remote;
const dialog = remote.dialog;

export class PackageInitDirective {
    restrict: string;
    templateUrl: string;
    transclude: boolean;

    constructor() {
        this.restrict = 'E'
        this.templateUrl = './templates/packages-init.html'
        this.transclude = true
    }

    link(scope: any, element: any, attrs: any) {
        scope.$root.$watch('activeActivityBarMenuItem', (newVal: any, oldVal: any) => {
            if (newVal !== undefined) {
                const packageManager: string = newVal.packageManager;
                const packageFileName: string = newVal.file;

                scope.form = {};
                scope.form[packageManager] = {
                    private: 'false',
                    name: '',
                    version: '',
                    description: ''
                };

                scope.scriptCommandInputs = [{
                    script_key: '',
                    script_value: ''
                }];

                scope.addNewScriptCommandInputs = () => {
                    scope.scriptCommandInputs.push({
                        script_key: '',
                        script_value: ''
                    });
                }

                scope.removeScriptCommandInputs = (i: number) => {
                    scope.scriptCommandInputs.splice(i, 1);
                }

                scope.initPackageFile = () => {
                    dialog.showSaveDialog({
                        title: 'Please choose a destination',
                        defaultPath: `~/${packageFileName}`
                    }, (fileName: string) => {
                        if (fileName === undefined) {
                            return;
                        } else if (fileName !== undefined && fileName.indexOf(packageFileName) === -1) {
                            new MessageDialogHelpers().error(`Please give name of <b>${packageFileName}</b> to file for saving!`, 7500);
                            return;
                        }

                        fs.writeFile(fileName, new PackageInitFileHelpers(scope).getJsonContent(), (err: any) => {
                            if (err) {
                                new MessageDialogHelpers().error(`File couldn't save because of: ${err.message}`);
                                return;
                            }

                            $('#packageInitModal').modal('hide');
                            if (!new PackageExplorerHelpers().isExist(fileName)) {
                                new PackageExplorerHelpers().add(packageManager, fileName);
                                scope.$apply(() => {
                                    scope.$root.packagePathList[packageManager] = new PackageExplorerHelpers().getListItem(packageManager);
                                });
                            }
                            new MessageDialogHelpers().success('The file created successfully!', 3200);
                        });
                    })
                }
            }
        });
    }
}