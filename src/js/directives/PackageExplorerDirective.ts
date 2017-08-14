import { MessageDialogHelpers } from "../helpers/MessageDialogHelpers";
import { PackageExplorerHelpers } from '../helpers/PackageExplorerHelpers';

export class PackageExplorerDirective {
    restrict: string;
    templateUrl: string;
    transclude: boolean;

    constructor() {
        this.restrict = 'E'
        this.templateUrl = './templates/package-explorer.html'
        this.transclude = true
    }

    link(scope: any, element: any, attrs: any) {
        scope.$root.packagePathList = {};

        scope.$root.activityBarIcons.forEach((value: any, i: number) => {
            scope.$root.packagePathList[value.packageManager] = new PackageExplorerHelpers().getListItem(value.packageManager);
        });
    }
}