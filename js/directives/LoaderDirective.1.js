"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var LoaderDirective = (function () {
    function LoaderDirective() {
        this.restrict = 'E';
        this.templateUrl = './templates/loader.html';
        this.transclude = true;
    }
    LoaderDirective.prototype.link = function (scope, element, attrs) { };
    return LoaderDirective;
}());
exports.LoaderDirective = LoaderDirective;
