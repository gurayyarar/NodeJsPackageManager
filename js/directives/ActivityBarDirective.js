"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ConstantHelpers_1 = require("../helpers/ConstantHelpers");
var ActivityBarDirective = (function () {
    function ActivityBarDirective() {
        this.restrict = 'E';
        this.templateUrl = './templates/activity-bar.html';
        this.transclude = true;
    }
    ActivityBarDirective.prototype.link = function (scope, element, attrs) {
        scope.$root.activityBarIcons = ConstantHelpers_1.PS_Packagest;
        if (!scope.$$phase)
            scope.$apply();
        scope.$root.activeActivityBarMenuItem = scope.$root.activityBarIcons[0];
        scope.$root.startPackageExplorerWith = function (item) {
            scope.$root.activeActivityBarMenuItem = item;
        };
        scope.showSettingsDialog = function () {
            $('#settingsModal').modal('show');
        };
    };
    return ActivityBarDirective;
}());
exports.ActivityBarDirective = ActivityBarDirective;
