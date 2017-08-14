"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var FooterDirective = (function () {
    function FooterDirective() {
        this.restrict = 'E';
        this.templateUrl = './templates/footer.html';
        this.transclude = true;
    }
    FooterDirective.prototype.link = function (scope, element, attrs) { };
    return FooterDirective;
}());
exports.FooterDirective = FooterDirective;
