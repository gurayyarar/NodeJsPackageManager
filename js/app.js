"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var angular = require("angular");
global.$ = global.jQuery = require('jquery');
global._ = require('underscore');
var MainController_1 = require("./controller/MainController");
var ActivityBarDirective_1 = require("./directives/ActivityBarDirective");
var PackageExplorerDirective_1 = require("./directives/PackageExplorerDirective");
var PackageExplorerListDirective_1 = require("./directives/PackageExplorerListDirective");
var FooterDirective_1 = require("./directives/FooterDirective");
var PackageDirective_1 = require("./directives/PackageDirective");
var PackageListDirective_1 = require("./directives/PackageListDirective");
var PackageListItemDirective_1 = require("./directives/PackageListItemDirective");
var LoaderDirective_1 = require("./directives/LoaderDirective");
var PackageInitDirective_1 = require("./directives/PackageInitDirective");
var PackageDetailDirective_1 = require("./directives/PackageDetailDirective");
var SettingsDirective_1 = require("./directives/SettingsDirective");
require('@shagstrom/split-pane');
require('bootstrap');
angular.module('app', [require('angular-sanitize')])
    .controller('MainController', MainController_1.MainController)
    .directive('activityBar', function () { return new ActivityBarDirective_1.ActivityBarDirective(); })
    .directive('packageExplorer', function () { return new PackageExplorerDirective_1.PackageExplorerDirective(); })
    .directive('packageExplorerList', function () { return new PackageExplorerListDirective_1.PackageExplorerListDirective(); })
    .directive('footer', function () { return new FooterDirective_1.FooterDirective(); })
    .directive('packages', function () { return new PackageDirective_1.PackageDirective(); })
    .directive('packageList', function () { return new PackageListDirective_1.PackageListDirective(); })
    .directive('packageListItem', function () { return new PackageListItemDirective_1.PackageListItemDirective(); })
    .directive('loader', function () { return new LoaderDirective_1.LoaderDirective(); })
    .directive('packageInit', function () { return new PackageInitDirective_1.PackageInitDirective(); })
    .directive('packageDetail', function () { return new PackageDetailDirective_1.PackageDetail(); })
    .directive('settings', function () { return new SettingsDirective_1.SettingsDirective(); });
$(function () {
    $('.modal').on('click', '.advanced-options a', function (e) {
        $(e.target).parents('.advanced-options').toggleClass('open');
    });
});
