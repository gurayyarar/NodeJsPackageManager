import { PS_Packagest } from '../helpers/ConstantHelpers';
import { IPackagest } from "../interfaces/IPackagest";

export class ActivityBarDirective {
    restrict: string;
    templateUrl: string;
    transclude: boolean;

    constructor() {
        this.restrict = 'E'
        this.templateUrl = './templates/activity-bar.html'
        this.transclude = true
    }

    link(scope: any, element: any, attrs: any) {
        scope.$root.activityBarIcons = PS_Packagest;
        if (!scope.$$phase) scope.$apply();

        scope.$root.activeActivityBarMenuItem = scope.$root.activityBarIcons[0];
        scope.$root.startPackageExplorerWith = (item: IPackagest) => {
            scope.$root.activeActivityBarMenuItem = item;
        }

        scope.showSettingsDialog = () => {
            $('#settingsModal').modal('show');
        }
    }
}