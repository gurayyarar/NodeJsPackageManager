export class LoaderDirective {
    restrict: string;
    templateUrl: string;
    transclude: boolean;

    constructor() {
        this.restrict = 'E'
        this.templateUrl = './templates/loader.html'
        this.transclude = true
    }

    link(scope: any, element: any, attrs: any) { }
}