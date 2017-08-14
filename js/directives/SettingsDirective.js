"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var constantHelpers = require("../helpers/ConstantHelpers");
var remote = require('electron').remote;
var shell = require('electron').shell;
var SettingsDirective = (function () {
    function SettingsDirective() {
        this.restrict = 'E';
        this.templateUrl = './templates/settings.html';
        this.transclude = true;
    }
    SettingsDirective.prototype.link = function (scope, element, attrs) {
        var themes = constantHelpers.appThemes;
        var selectedTheme = localStorage.getItem(constantHelpers.LSKey_Settings_Theme);
        scope.themes = themes;
        $('body').addClass((selectedTheme === undefined || selectedTheme === null ? constantHelpers.Default_Settings_Theme : selectedTheme));
        scope.selectedTheme = $.grep(themes, function (key, i) {
            return key.class_name.toString() === (selectedTheme === undefined || selectedTheme === null ? constantHelpers.Default_Settings_Theme : selectedTheme);
        })[0];
        $('.about-panel a, #settingsModal .js-donation-btn').on('click', function (e) {
            e.preventDefault();
            shell.openExternal($(e.target).attr('href'));
        });
        $('#settingsModal .nav-tabs a').on('click', function (e) {
            scope.showDonationBtn = $(e.target).attr('href') === '#about';
            if (!scope.$$phase)
                scope.$apply();
        });
        scope.changeTheme = function (item) {
            var classes = $('body').attr('class').split(' ');
            classes.forEach(function (val, i) {
                if (val.indexOf('-theme') > -1)
                    $('body').removeClass(val);
            });
            $('body').addClass(item.class_name);
            scope.selectedTheme = item;
            localStorage.setItem(constantHelpers.LSKey_Settings_Theme, item.class_name);
        };
        scope.restoreToDefaults = function () {
            var packages = localStorage.getItem(constantHelpers.LSKey_Package_Explorer_Packages);
            localStorage.clear();
            localStorage.setItem(constantHelpers.LSKey_Package_Explorer_Packages, packages);
            remote.getCurrentWindow().reload();
        };
    };
    return SettingsDirective;
}());
exports.SettingsDirective = SettingsDirective;
