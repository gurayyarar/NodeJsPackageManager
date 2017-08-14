export class FooterDirective {
    restrict: string;
    templateUrl: string;
    transclude: boolean;

    constructor() {
        this.restrict = 'E'
        this.templateUrl = './templates/footer.html'
        this.transclude = true
    }

    link(scope: any, element: any, attrs: any) { }
}