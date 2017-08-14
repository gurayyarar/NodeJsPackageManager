import { IPackage } from '../interfaces/IPackage';
import { PackageHelpers } from '../helpers/PackageHelpers';

export class PackageListItemDirective {
    scope: any;
    restrict: string;
    templateUrl: string;
    transclude: boolean;

    constructor() {
        this.restrict = 'E'
        this.templateUrl = './templates/package-list-item.html'
        this.transclude = true
        this.scope = {
            item: '=item'
        }
    }

    link(scope: any, element: any, attrs: any) {
        const pack: IPackage = <IPackage>scope.item;

        if (pack.alreadyInstalled === true) {
            new PackageHelpers(scope).setLatestVersion(pack.name, pack.version, () => {
                this.organizeLoader(scope);
            });
        } else {
            pack.latestVersion = pack.selectedVersion = pack.version;
            scope.item = pack;
            this.organizeLoader(scope);
        }

        scope.$root.selectPackage = ($event: any, item: any) => {
            if ($($event.target).hasClass('btn') === false && $($event.target).parents('.btn-group').length === 0) {
                scope.$root.activePackageItem = item;
            }
        }
    }

    organizeLoader(scope: any) {
        let length: number = <number>scope.$root.loadedPackageLength;
        length--;
        scope.$root.loadedPackageLength = length;

        if (length === 0) scope.$root.showLoader = false;
    }
}