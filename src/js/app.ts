import * as angular from 'angular';
global.$ = global.jQuery = require('jquery');
global._ = require('underscore');
import { MainController } from './controller/MainController';
import { ActivityBarDirective } from './directives/ActivityBarDirective';
import { PackageExplorerDirective } from './directives/PackageExplorerDirective';
import { PackageExplorerListDirective } from './directives/PackageExplorerListDirective';
import { FooterDirective } from './directives/FooterDirective';
import { PackageDirective } from './directives/PackageDirective';
import { PackageListDirective } from './directives/PackageListDirective';
import { PackageListItemDirective } from './directives/PackageListItemDirective';
import { LoaderDirective } from './directives/LoaderDirective';
import { PackageInitDirective } from './directives/PackageInitDirective';
import { PackageDetail } from './directives/PackageDetailDirective';
import { SettingsDirective } from './directives/SettingsDirective';
require('@shagstrom/split-pane');
require('bootstrap');


angular.module('app', [require('angular-sanitize')])
    .controller('MainController', MainController)

    .directive('activityBar', () => new ActivityBarDirective())
    .directive('packageExplorer', () => new PackageExplorerDirective())
    .directive('packageExplorerList', () => new PackageExplorerListDirective())
    .directive('footer', () => new FooterDirective())
    .directive('packages', () => new PackageDirective())
    .directive('packageList', () => new PackageListDirective())
    .directive('packageListItem', () => new PackageListItemDirective())
    .directive('loader', () => new LoaderDirective())
    .directive('packageInit', () => new PackageInitDirective())
    .directive('packageDetail', () => new PackageDetail())
    .directive('settings', () => new SettingsDirective())

$(() => {
    $('.modal').on('click', '.advanced-options a', (e) => {
        $(e.target).parents('.advanced-options').toggleClass('open');
    });
})