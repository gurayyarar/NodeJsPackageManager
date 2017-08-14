System.register("interfaces/IPackagest", [], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [],
        execute: function () {
        }
    };
});
System.register("helpers/ConstantHelpers", [], function (exports_2, context_2) {
    "use strict";
    var __moduleName = context_2 && context_2.id;
    var LSKey_Package_Explorer_Width, LSKey_Content_Split_LeftSide_Width, LSKey_Package_Explorer_Packages, Default_Package_Explorer_Width, Defualt_Content_Split_LeftSide_Width, PS_Packagest;
    return {
        setters: [],
        execute: function () {
            exports_2("LSKey_Package_Explorer_Width", LSKey_Package_Explorer_Width = 'Package_Explorer_Width');
            exports_2("LSKey_Content_Split_LeftSide_Width", LSKey_Content_Split_LeftSide_Width = 'Content_Split_LeftSide_Width');
            exports_2("LSKey_Package_Explorer_Packages", LSKey_Package_Explorer_Packages = 'Package_Explorer_Packages');
            exports_2("Default_Package_Explorer_Width", Default_Package_Explorer_Width = 260);
            exports_2("Defualt_Content_Split_LeftSide_Width", Defualt_Content_Split_LeftSide_Width = 360);
            exports_2("PS_Packagest", PS_Packagest = [{
                    title: 'NODEJS PACKAGE MANAGER (NPM)',
                    command: 'npm',
                    packageManager: 'npm'
                },
                {
                    title: 'BOWER',
                    command: 'bower',
                    packageManager: 'bower'
                }]);
        }
    };
});
System.register("controller/MainController", ["helpers/ConstantHelpers"], function (exports_3, context_3) {
    "use strict";
    var __moduleName = context_3 && context_3.id;
    var constantHelpers, MainController;
    return {
        setters: [
            function (constantHelpers_1) {
                constantHelpers = constantHelpers_1;
            }
        ],
        execute: function () {
            MainController = (function () {
                function MainController($scope) {
                    this.$scope = $scope;
                    this.setSplitPanel();
                }
                MainController.prototype.setSplitPanel = function () {
                    var packageExplorerWidth = localStorage.getItem(constantHelpers.LSKey_Package_Explorer_Width) || constantHelpers.Default_Package_Explorer_Width.toString();
                    var packageContentWidth = localStorage.getItem(constantHelpers.LSKey_Content_Split_LeftSide_Width) || constantHelpers.Defualt_Content_Split_LeftSide_Width.toString();
                    this.$scope.$root.packageExplorerStyle = { 'width': packageExplorerWidth + "px" };
                    this.$scope.$root.contentSplitStyle = { 'width': packageContentWidth + "px" };
                    this.$scope.$root.packageExplorerDividerAndRightSideStyle = { 'left': packageExplorerWidth + "px" };
                    this.$scope.$root.contentDividerAndRightSideStyle = { 'left': packageContentWidth + "px" };
                    $('.main-split-pane').splitPane();
                    $('.main-split-pane .split-pane-divider').on('mousedown', function () {
                        var $this = $(this);
                        $('body').one('mouseup', function () {
                            var outerWidth = $this.prev().outerWidth();
                            localStorage.setItem(constantHelpers.LSKey_Package_Explorer_Width, outerWidth.toString());
                        });
                    });
                    setTimeout(function () {
                        $('.content-split-pane').splitPane();
                        $('.content-split-pane .split-pane-divider').on('mousedown', function () {
                            var $this = $(this);
                            $('body').one('mouseup', function () {
                                var outerWidth = $this.prev().outerWidth();
                                localStorage.setItem(constantHelpers.LSKey_Content_Split_LeftSide_Width, outerWidth.toString());
                            });
                        });
                    }, 1250);
                };
                return MainController;
            }());
            exports_3("MainController", MainController);
        }
    };
});
System.register("directives/ActivityBarDirective", ["helpers/ConstantHelpers"], function (exports_4, context_4) {
    "use strict";
    var __moduleName = context_4 && context_4.id;
    var constantHelpers, ActivityBarDirective;
    return {
        setters: [
            function (constantHelpers_2) {
                constantHelpers = constantHelpers_2;
            }
        ],
        execute: function () {
            ActivityBarDirective = (function () {
                function ActivityBarDirective() {
                    this.restrict = 'E';
                    this.templateUrl = './templates/activity-bar.html';
                    this.transclude = true;
                }
                ActivityBarDirective.prototype.link = function (scope, element, attrs) {
                    scope.$root.activityBarIcons = constantHelpers.PS_Packagest;
                    scope.$root.activeActivityBarMenuItem = scope.$root.activityBarIcons[0];
                    scope.$root.startPackageExplorerWith = function (item) {
                        scope.$root.activeActivityBarMenuItem = item;
                    };
                };
                return ActivityBarDirective;
            }());
            exports_4("ActivityBarDirective", ActivityBarDirective);
        }
    };
});
System.register("directives/PackageExplorerDirective", [], function (exports_5, context_5) {
    "use strict";
    var __moduleName = context_5 && context_5.id;
    var PackageExplorerDirective;
    return {
        setters: [],
        execute: function () {
            PackageExplorerDirective = (function () {
                function PackageExplorerDirective() {
                    this.restrict = 'E';
                    this.templateUrl = './templates/package-explorer.html';
                    this.transclude = true;
                }
                PackageExplorerDirective.prototype.link = function (scope, element, attrs) { };
                return PackageExplorerDirective;
            }());
            exports_5("PackageExplorerDirective", PackageExplorerDirective);
        }
    };
});
System.register("directives/PackageExplorerListDirective", [], function (exports_6, context_6) {
    "use strict";
    var __moduleName = context_6 && context_6.id;
    var PackageExplorerListDirective;
    return {
        setters: [],
        execute: function () {
            PackageExplorerListDirective = (function () {
                function PackageExplorerListDirective() {
                    this.restrict = 'E';
                    this.templateUrl = './templates/package-explorer-list.html';
                    this.transclude = true;
                    this.scope = {
                        item: '=item'
                    };
                }
                PackageExplorerListDirective.prototype.link = function (scope, element, attrs) {
                    this.loadList(scope);
                    scope.selectPackageExplorerItem = function (item) {
                        scope.$root.activePackageExplorerItem = item;
                    };
                };
                PackageExplorerListDirective.prototype.loadList = function (scope) {
                    var packageManager = scope.item.packageManager;
                    var packageList = [];
                    if (packageManager === 'npm') {
                        packageList.push('Global Packages');
                    }
                    scope.packagePathList = packageList;
                };
                return PackageExplorerListDirective;
            }());
            exports_6("PackageExplorerListDirective", PackageExplorerListDirective);
        }
    };
});
System.register("directives/FooterDirective", [], function (exports_7, context_7) {
    "use strict";
    var __moduleName = context_7 && context_7.id;
    var FooterDirective;
    return {
        setters: [],
        execute: function () {
            FooterDirective = (function () {
                function FooterDirective() {
                    this.restrict = 'E';
                    this.templateUrl = './templates/footer.html';
                    this.transclude = true;
                }
                FooterDirective.prototype.link = function (scope, element, attrs) { };
                return FooterDirective;
            }());
            exports_7("FooterDirective", FooterDirective);
        }
    };
});
System.register("directives/PackageDirective", [], function (exports_8, context_8) {
    "use strict";
    var __moduleName = context_8 && context_8.id;
    var PackageDirective;
    return {
        setters: [],
        execute: function () {
            PackageDirective = (function () {
                function PackageDirective() {
                    this.restrict = 'E';
                    this.templateUrl = './templates/packages.html';
                    this.transclude = true;
                }
                PackageDirective.prototype.link = function (scope, element, attrs) { };
                return PackageDirective;
            }());
            exports_8("PackageDirective", PackageDirective);
        }
    };
});
System.register("app", ["angular", "controller/MainController", "directives/ActivityBarDirective", "directives/PackageExplorerDirective", "directives/PackageExplorerListDirective", "directives/FooterDirective", "directives/PackageDirective"], function (exports_9, context_9) {
    "use strict";
    var __moduleName = context_9 && context_9.id;
    var angular, MainController_1, ActivityBarDirective_1, PackageExplorerDirective_1, PackageExplorerListDirective_1, FooterDirective_1, PackageDirective_1;
    return {
        setters: [
            function (angular_1) {
                angular = angular_1;
            },
            function (MainController_1_1) {
                MainController_1 = MainController_1_1;
            },
            function (ActivityBarDirective_1_1) {
                ActivityBarDirective_1 = ActivityBarDirective_1_1;
            },
            function (PackageExplorerDirective_1_1) {
                PackageExplorerDirective_1 = PackageExplorerDirective_1_1;
            },
            function (PackageExplorerListDirective_1_1) {
                PackageExplorerListDirective_1 = PackageExplorerListDirective_1_1;
            },
            function (FooterDirective_1_1) {
                FooterDirective_1 = FooterDirective_1_1;
            },
            function (PackageDirective_1_1) {
                PackageDirective_1 = PackageDirective_1_1;
            }
        ],
        execute: function () {
            global.$ = global.jQuery = require('jquery');
            require('@shagstrom/split-pane');
            require('bootstrap');
            angular.module('app', [require('angular-sanitize')])
                .controller('MainController', MainController_1.MainController)
                .directive('activityBar', function () { return new ActivityBarDirective_1.ActivityBarDirective(); })
                .directive('packageExplorer', function () { return new PackageExplorerDirective_1.PackageExplorerDirective(); })
                .directive('packageExplorerList', function () { return new PackageExplorerListDirective_1.PackageExplorerListDirective(); })
                .directive('footer', function () { return new FooterDirective_1.FooterDirective(); })
                .directive('packages', function () { return new PackageDirective_1.PackageDirective(); });
        }
    };
});
System.register("helpers/PackageHelpers", [], function (exports_10, context_10) {
    "use strict";
    var __moduleName = context_10 && context_10.id;
    var PackageHelpers;
    return {
        setters: [],
        execute: function () {
            PackageHelpers = (function () {
                function PackageHelpers() {
                }
                return PackageHelpers;
            }());
            exports_10("PackageHelpers", PackageHelpers);
        }
    };
});
System.register("interfaces/IPackageControl", [], function (exports_11, context_11) {
    "use strict";
    var __moduleName = context_11 && context_11.id;
    return {
        setters: [],
        execute: function () {
        }
    };
});
System.register("interfaces/IPackage", [], function (exports_12, context_12) {
    "use strict";
    var __moduleName = context_12 && context_12.id;
    return {
        setters: [],
        execute: function () {
        }
    };
});
