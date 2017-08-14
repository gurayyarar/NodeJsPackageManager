import * as constantHelpers from '../helpers/ConstantHelpers';
import { Default_Settings_Theme } from '../helpers/ConstantHelpers';
const remote = require('electron').remote;
const shell = require('electron').shell;

export class SettingsDirective {
    restrict: string;
    templateUrl: string;
    transclude: boolean;

    constructor() {
        this.restrict = 'E'
        this.templateUrl = './templates/settings.html'
        this.transclude = true
    }

    link(scope: any, element: any, attrs: any) {
        let themes: any = constantHelpers.appThemes;
        const selectedTheme: string = localStorage.getItem(constantHelpers.LSKey_Settings_Theme);
        scope.themes = themes;
        $('body').addClass((selectedTheme === undefined || selectedTheme === null ? constantHelpers.Default_Settings_Theme : selectedTheme));

        //Selected theme assigning
        scope.selectedTheme = $.grep(themes, (key: any, i: number) => {
            return key.class_name.toString() === (selectedTheme === undefined || selectedTheme === null ? constantHelpers.Default_Settings_Theme : selectedTheme);
        })[0];

        //When a link & donation button click inside of the About Tab (will open the defalt web browser)
        $('.about-panel a, #settingsModal .js-donation-btn').on('click', (e) => {
            e.preventDefault();
            shell.openExternal($(e.target).attr('href'));
        });

        //Navtabs item click inside of the Settings Modal Dialog
        $('#settingsModal .nav-tabs a').on('click', (e) => {
            scope.showDonationBtn = $(e.target).attr('href') === '#about';
            if (!scope.$$phase) scope.$apply();
        });

        //Change application theme
        scope.changeTheme = (item: any) => {
            const classes: any = $('body').attr('class').split(' ');
            classes.forEach((val: any, i: number) => {
                if (val.indexOf('-theme') > -1) $('body').removeClass(val);
            });

            $('body').addClass(item.class_name);

            scope.selectedTheme = item;
            localStorage.setItem(constantHelpers.LSKey_Settings_Theme, item.class_name);
        }

        //Restore settings to default values
        scope.restoreToDefaults = () => {
            const packages: any = localStorage.getItem(constantHelpers.LSKey_Package_Explorer_Packages);
            localStorage.clear();

            localStorage.setItem(constantHelpers.LSKey_Package_Explorer_Packages, packages);
            remote.getCurrentWindow().reload();
        }
    }
}